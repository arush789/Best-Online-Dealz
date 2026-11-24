import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ALL_CATEGORIES } from "../lib/categories";
import { compact } from "../lib/format";

export function useCategoryCounts(rows) {
  return useMemo(() => {
    const counts = {};
    for (const r of rows || []) counts[r.cat] = (counts[r.cat] || 0) + 1;
    return counts;
  }, [rows]);
}

export default function CategoryTiles({ rows, limit }) {
  const counts = useCategoryCounts(rows);
  let cats = ALL_CATEGORIES.filter((c) => counts[c.slug]);
  cats.sort((a, b) => (a.slug === "more") - (b.slug === "more") || counts[b.slug] - counts[a.slug]);
  if (limit) cats = cats.slice(0, limit);
  return (
    <div className="cat-grid">
      {cats.map((c) => (
        <Link key={c.slug} to={`/category/${c.slug}`} className="cat-tile">
          <span className="emo" aria-hidden="true">
            {c.emoji}
          </span>
          <div>
            <b>{c.name}</b>
            <span>{compact(counts[c.slug])} deals</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
