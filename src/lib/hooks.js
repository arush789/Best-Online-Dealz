import { useEffect, useMemo, useRef, useState } from "react";
import { cachedItem, fetchCatalog, fetchItems, subscribeCatalog } from "./api";

/** The full catalog (newest first). */
export function useCatalog() {
  const [state, setState] = useState({ rows: null, error: null });
  useEffect(() => {
    let alive = true;
    fetchCatalog()
      .then((rows) => alive && setState({ rows, error: null }))
      .catch((e) => alive && setState({ rows: null, error: e.message }));
    // A saved copy shows first; swap in the live list when it arrives.
    const unsubscribe = subscribeCatalog((rows) => alive && setState({ rows, error: null }));
    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);
  return state;
}

/**
 * Live listings for a list of ASINs, filled in progressively.
 * Returns { items, slots, done, loaded } where:
 *   slots: one entry per ASIN: undefined while loading, null if unavailable
 *   items: the available ones, in input order
 */
export function useItems(asins) {
  const key = asins ? asins.join(",") : "";
  const [slots, setSlots] = useState(() => (asins || []).map((a) => cachedItem(a)));
  const [done, setDone] = useState(false);
  const keyRef = useRef(key);

  useEffect(() => {
    keyRef.current = key;
    const list = asins || [];
    const initial = list.map((a) => cachedItem(a));
    setSlots(initial);
    setDone(initial.every((x) => x !== undefined));
    if (!list.length) return;
    const ctrl = new AbortController();
    const todo = list.map((a, i) => [a, i]).filter(([, i]) => initial[i] === undefined);
    if (!todo.length) return;

    // Batch state updates so 20 parallel loads don't cause 20 re-renders each.
    let pending = [];
    let timer = null;
    const flush = () => {
      timer = null;
      if (ctrl.signal.aborted || keyRef.current !== key) return;
      const batch = pending;
      pending = [];
      setSlots((prev) => {
        const next = prev.slice();
        for (const [i, item] of batch) next[i] = item;
        return next;
      });
    };
    fetchItems(
      todo.map(([a]) => a),
      {
        signal: ctrl.signal,
        onItem: (j, item) => {
          pending.push([todo[j][1], item]);
          if (!timer) timer = setTimeout(flush, 120);
        },
      }
    ).then(() => {
      if (ctrl.signal.aborted) return;
      clearTimeout(timer);
      flush();
      setDone(true);
    });
    return () => {
      ctrl.abort();
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const items = useMemo(() => slots.filter(Boolean), [slots]);
  const loaded = slots.filter((s) => s !== undefined).length;
  return { items, slots, done, loaded, total: slots.length };
}

/** Set document.title for a page. */
export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · BODZ` : "BODZ · Best Online Dealz";
  }, [title]);
}

/** Read a boolean-ish media query. */
export function usePrefersDark() {
  const q = typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)");
  const [dark, setDark] = useState(q ? q.matches : false);
  useEffect(() => {
    if (!q) return;
    const fn = (e) => setDark(e.matches);
    q.addEventListener?.("change", fn);
    return () => q.removeEventListener?.("change", fn);
  }, [q]);
  return dark;
}
