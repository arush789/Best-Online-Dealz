// Data layer for the public site.
//
// Two sources, both on bodz-server:
//   GET /api/getTable?itemsPerPage=N  -> every catalog row (id, name, asin, category).
//                                       Cheap DB read, no Amazon call.
//   GET /api/getItem/:asin            -> live Amazon listing for one ASIN.
//
// The catalog gives us search, categories and ordering for free. Live prices
// are fetched per ASIN, a few at a time, and cached for the browser session.

import { classify } from "./categories";
import { cleanName } from "./format";
import { dealScore } from "./score";

export const API_BASE =
  import.meta.env.BODZ_PUBLIC_API_BASE || "https://bodz-server.vercel.app/api";

const CATALOG_KEY = "bodz:catalog:v2";
const ITEM_KEY = "bodz:item:v4:";
const CATALOG_TTL = 30 * 60 * 1000; // 30 min
const ITEM_TTL = 20 * 60 * 1000; // 20 min: prices move

// ---------- session cache helpers (fail silently: private mode, quota) ----------
function readCache(key, ttl) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return undefined;
    const { t, v } = JSON.parse(raw);
    if (Date.now() - t > ttl) return undefined;
    return v;
  } catch {
    return undefined;
  }
}
function writeCache(key, v) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), v }));
  } catch {
    /* ignore */
  }
}

async function getJSON(url, signal, init = {}) {
  const res = await fetch(url, { signal, ...init });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

// ---------- catalog ----------
// Stale-while-revalidate: a saved copy (if any) renders instantly, and every
// page load also fetches the live list once. When the live list differs,
// subscribers re-render, so a deal added in the admin shows up on refresh.
let catalogPromise = null;
const catalogListeners = new Set();

function sameCatalog(a, b) {
  return a && b && a.length === b.length && a[0]?.id === b[0]?.id && a[a.length - 1]?.id === b[b.length - 1]?.id;
}

function loadFreshCatalog() {
  return getJSON(`${API_BASE}/getTable?itemsPerPage=10000&page=1`, undefined, { cache: "no-store" }).then((data) => {
    const seen = new Set();
    const rows = [];
    for (const r of data.items || []) {
      const asin = (r.asin || "").trim().toUpperCase();
      if (!/^[A-Z0-9]{10}$/.test(asin) || seen.has(asin)) continue;
      seen.add(asin);
      const name = cleanName(r.name || "");
      rows.push({ id: r.id, asin, name, cat: classify(name, r.category) });
    }
    writeCache(CATALOG_KEY, rows);
    return rows;
  });
}

/** Re-render callback for when the live catalog replaces a saved copy. */
export function subscribeCatalog(fn) {
  catalogListeners.add(fn);
  return () => catalogListeners.delete(fn);
}

/** Forget the saved catalog, e.g. after the admin adds or deletes a deal. */
export function clearCatalogCache() {
  catalogPromise = null;
  try {
    sessionStorage.removeItem(CATALOG_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Every product in the catalog, newest first, one row per ASIN.
 * Row: { id, asin, name, cat }
 */
export function fetchCatalog() {
  if (catalogPromise) return catalogPromise;
  const cached = readCache(CATALOG_KEY, CATALOG_TTL);
  const fresh = loadFreshCatalog();

  if (cached) {
    catalogPromise = Promise.resolve(cached);
    fresh
      .then((rows) => {
        if (sameCatalog(rows, cached)) return;
        catalogPromise = Promise.resolve(rows);
        catalogListeners.forEach((fn) => fn(rows));
      })
      .catch(() => {
        /* keep showing the saved copy */
      });
    return catalogPromise;
  }

  catalogPromise = fresh.catch((err) => {
    catalogPromise = null; // allow retry
    throw err;
  });
  return catalogPromise;
}

// ---------- items ----------
const memItems = new Map(); // asin -> normalized item | null
const inflight = new Map(); // asin -> Promise

export function normalizeItem(raw) {
  if (!raw?.ASIN) return null;
  const listing = raw.Offers?.Listings?.[0];
  const price = listing?.Price?.Money?.Amount ?? null;
  let mrp = listing?.Price?.SavingBasis?.Money?.Amount ?? null;
  let save = listing?.Price?.Savings?.Money?.Amount ?? null;
  let pct = listing?.Price?.Savings?.Percentage ?? null;
  if (price != null && mrp == null) mrp = price;
  if (price != null && mrp != null && save == null) save = Math.max(0, mrp - price);
  if (pct == null && mrp) pct = Math.round(((mrp - price) / mrp) * 100);

  const item = {
    asin: raw.ASIN,
    title: raw.ItemInfo?.Title?.DisplayValue || "",
    brand: raw.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || "",
    features: raw.ItemInfo?.Features?.DisplayValues || [],
    image:
      raw.Images?.Primary?.Large?.URL || raw.Images?.Primary?.Medium?.URL || "",
    url: raw.DetailPageURL || `https://www.amazon.in/dp/${raw.ASIN}`,
    nodes: (raw.BrowseNodeInfo?.BrowseNodes || [])
      .map((n) => n.ContextFreeName)
      .filter(Boolean),
    price,
    mrp,
    save,
    pct: pct ?? 0,
  };
  item.score = dealScore(item);
  return item;
}

/** Live listing for one ASIN. Resolves to null if Amazon has no listing. */
export function fetchItem(asin) {
  asin = asin.toUpperCase();
  if (memItems.has(asin)) return Promise.resolve(memItems.get(asin));
  const cached = readCache(ITEM_KEY + asin, ITEM_TTL);
  if (cached !== undefined) {
    memItems.set(asin, cached);
    return Promise.resolve(cached);
  }
  if (inflight.has(asin)) return inflight.get(asin);

  const p = getJSON(`${API_BASE}/getItem/${encodeURIComponent(asin)}`)
    .then((data) => {
      const item = normalizeItem(data?.item?.ItemsResult?.Items?.[0]);
      memItems.set(asin, item);
      writeCache(ITEM_KEY + asin, item);
      return item;
    })
    .finally(() => inflight.delete(asin));
  inflight.set(asin, p);
  return p;
}

/** Peek at an already-loaded item without a network call. */
export function cachedItem(asin) {
  if (memItems.has(asin)) return memItems.get(asin);
  const c = readCache(ITEM_KEY + asin, ITEM_TTL);
  return c === undefined ? undefined : c;
}

/**
 * Load many ASINs with limited concurrency.
 * onItem(index, item) fires as each one lands so the UI can fill in progressively.
 * Failed or unavailable ASINs come back as null.
 */
export async function fetchItems(asins, { concurrency = 6, onItem, signal } = {}) {
  const out = new Array(asins.length).fill(undefined);
  let next = 0;
  async function worker() {
    while (next < asins.length) {
      if (signal?.aborted) return;
      const i = next++;
      let item = null;
      try {
        item = await fetchItem(asins[i]);
      } catch {
        item = null;
      }
      out[i] = item;
      if (!signal?.aborted) onItem?.(i, item);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, asins.length) }, worker));
  return out;
}

// ---------- lookup ----------
/**
 * Pull an ASIN out of whatever the user pasted: a full Amazon URL, a bare ASIN,
 * or a share text. Short links (amzn.to / amzn.in) can't be expanded from the
 * browser, so we return { short: true } for those.
 */
export function parseAsin(input = "") {
  const s = input.trim();
  if (!s) return { asin: null };
  const fromPath = s.match(/(?:\/dp\/|\/gp\/product\/|\/gp\/aw\/d\/|\/product\/|\/offers\/|[?&]asin=)([A-Z0-9]{10})(?=[/?&#]|$)/i);
  if (fromPath) return { asin: fromPath[1].toUpperCase() };
  if (/^[A-Z0-9]{10}$/i.test(s)) return { asin: s.toUpperCase() };
  if (/\b(amzn\.to|amzn\.in|a\.co)\//i.test(s)) return { asin: null, short: true };
  return { asin: null };
}
