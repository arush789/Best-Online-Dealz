import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCatalog, useTitle } from "../lib/hooks";
import { getCategory } from "../lib/categories";
import Feed from "../Components/Feed";
import SearchBox from "../Components/SearchBox";
import { GridSkeleton, LoadError } from "../Components/States";

function norm(s) {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]+/g, " ");
}

/** Every word of the query must appear in the product name (or its category). */
export function searchRows(rows, q) {
  const words = norm(q).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return rows.filter((r) => {
    const hay = norm(`${r.name} ${getCategory(r.cat)?.name || ""}`);
    return words.every((w) => hay.includes(w));
  });
}

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  useTitle(q ? `“${q}”` : "Search");
  const { rows, error } = useCatalog();
  const results = useMemo(() => (rows ? searchRows(rows, q) : null), [rows, q]);

  return (
    <div className="wrap">
      <div className="page-head">
        <p className="eyebrow">Search</p>
        <h1>{q ? <>“{q}”</> : "Search deals"}</h1>
        <p>{results ? `${results.length} matching deals` : "Searching…"}</p>
        <div style={{ maxWidth: 560, marginTop: 16 }}>
          <SearchBox key={q} initial={q} />
        </div>
      </div>
      {error ? <LoadError message={error} /> : null}
      {results ? (
        results.length ? (
          <Feed key={q} rows={results} />
        ) : (
          <div className="empty">
            <h3>No deals match “{q}”</h3>
            <p>
              Try fewer words, browse <Link to="/categories" className="link-arrow">categories</Link>, or{" "}
              <Link to="/lookup" className="link-arrow">paste an Amazon link</Link> to check any product.
            </p>
          </div>
        )
      ) : !error ? (
        <GridSkeleton />
      ) : null}
    </div>
  );
}
