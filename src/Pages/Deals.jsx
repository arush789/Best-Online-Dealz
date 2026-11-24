import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useCatalog, useTitle } from "../lib/hooks";
import { ALL_CATEGORIES, getCategory } from "../lib/categories";
import Feed from "../Components/Feed";
import { useCategoryCounts } from "../Components/CategoryTiles";
import { GridSkeleton, LoadError } from "../Components/States";

export default function Deals() {
  useTitle("Latest deals");
  const { rows, error } = useCatalog();
  const [params, setParams] = useSearchParams();
  const cat = params.get("cat");
  const counts = useCategoryCounts(rows);

  const list = useMemo(() => (rows ? (cat ? rows.filter((r) => r.cat === cat) : rows) : null), [rows, cat]);
  const chips = ALL_CATEGORIES.filter((c) => counts[c.slug]);

  return (
    <div className="wrap">
      <div className="page-head">
        <p className="eyebrow">Newest first</p>
        <h1>Latest drops</h1>
        <p>Every deal we've posted, newest at the top. Prices load live as you scroll.</p>
      </div>

      <div className="chips" role="group" aria-label="Category" style={{ marginBottom: 14 }}>
        <button className="chip" aria-pressed={!cat} onClick={() => setParams({})}>
          All<span className="count">{rows ? rows.length : ""}</span>
        </button>
        {chips.map((c) => (
          <button key={c.slug} className="chip" aria-pressed={cat === c.slug} onClick={() => setParams({ cat: c.slug })}>
            {c.emoji} {c.name}
            <span className="count">{counts[c.slug]}</span>
          </button>
        ))}
      </div>

      {error ? <LoadError message={error} /> : null}
      {list ? (
        <Feed key={cat || "all"} rows={list} emptyText={`No deals in ${getCategory(cat)?.name || "this category"} yet.`} />
      ) : !error ? (
        <GridSkeleton />
      ) : null}
    </div>
  );
}
