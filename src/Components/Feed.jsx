import React, { useMemo, useState } from "react";
import { useItems } from "../lib/hooks";
import { DealGrid, SkeletonCard } from "./DealCard";
import DealCard from "./DealCard";

export const SORTS = [
  { key: "newest", label: "Newest first" },
  { key: "score", label: "BODZ Score" },
  { key: "discount", label: "Biggest % off" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
];

export const MIN_OFF = [0, 30, 50, 70];

export function sortItems(items, sort) {
  const list = items.slice();
  const p = (i) => (i.price == null ? Infinity : i.price);
  switch (sort) {
    case "score":
      return list.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
    case "discount":
      return list.sort((a, b) => (b.pct || 0) - (a.pct || 0));
    case "price-asc":
      return list.sort((a, b) => p(a) - p(b));
    case "price-desc":
      return list.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    default:
      return list;
  }
}

/**
 * A "load more" feed over a list of catalog rows. Listings are fetched live
 * 20 at a time. Sort and discount filters apply to everything loaded so far,
 * and the toolbar says so.
 */
export default function Feed({ rows, pageSize = 20, emptyText = "No deals here yet." }) {
  const [pages, setPages] = useState(1);
  const [sort, setSort] = useState("newest");
  const [minOff, setMinOff] = useState(0);

  const asins = useMemo(() => rows.slice(0, pages * pageSize).map((r) => r.asin), [rows, pages, pageSize]);
  const { slots, items, done, loaded, total } = useItems(asins);

  const shaped = useMemo(() => {
    const f = minOff ? items.filter((i) => (i.pct || 0) >= minOff) : items;
    return sortItems(f, sort);
  }, [items, sort, minOff]);

  const pending = total - loaded;
  const more = rows.length > pages * pageSize;
  const plain = sort === "newest" && !minOff;

  if (!rows.length) {
    return (
      <div className="empty">
        <h3>Nothing to show</h3>
        <p>{emptyText}</p>
      </div>
    );
  }

  return (
    <>
      <div className="toolbar">
        <div className="chips" role="group" aria-label="Minimum discount">
          {MIN_OFF.map((m) => (
            <button key={m} className="chip" aria-pressed={minOff === m} onClick={() => setMinOff(m)}>
              {m ? `${m}%+ off` : "Any discount"}
            </button>
          ))}
        </div>
        <div className="row">
          <span className="toolbar-note">
            {loaded} of {rows.length} loaded
          </span>
          <label className="sr-only" htmlFor="sort">
            Sort
          </label>
          <select id="sort" className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {plain ? (
        <DealGrid slots={slots} />
      ) : (
        <div className="grid">
          {shaped.map((it) => (
            <DealCard key={it.asin} item={it} />
          ))}
          {Array.from({ length: Math.min(pending, 4) }, (_, i) => (
            <SkeletonCard key={`p${i}`} />
          ))}
        </div>
      )}

      {done && items.length === 0 ? (
        <div className="empty" style={{ marginTop: 16 }}>
          <h3>No live listings</h3>
          <p>{emptyText}</p>
        </div>
      ) : null}
      {done && !plain && shaped.length === 0 && items.length > 0 ? (
        <div className="empty" style={{ marginTop: 16 }}>
          <h3>No deals at {minOff}%+ off in what's loaded</h3>
          <p>Load more deals or lower the discount filter.</p>
        </div>
      ) : null}

      <div className="load-more">
        {!done ? (
          <div className="progress" aria-label="Loading prices">
            <span style={{ width: `${(loaded / Math.max(total, 1)) * 100}%` }} />
          </div>
        ) : null}
        {more ? (
          <button className="btn btn-lg" disabled={!done} onClick={() => setPages((p) => p + 1)}>
            {done ? `Load ${Math.min(pageSize, rows.length - pages * pageSize)} more deals` : "Checking live prices…"}
          </button>
        ) : done ? (
          <span className="toolbar-note">That's every deal here.</span>
        ) : null}
      </div>
    </>
  );
}
