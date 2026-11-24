import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useCatalog, useTitle } from "../lib/hooks";
import { getCategory } from "../lib/categories";
import CategoryTiles from "../Components/CategoryTiles";
import Feed from "../Components/Feed";
import { GridSkeleton, LoadError } from "../Components/States";
import NotFound from "./NotFound";

export function Categories() {
  useTitle("Categories");
  const { rows, error } = useCatalog();
  return (
    <div className="wrap">
      <div className="page-head">
        <p className="eyebrow">Every shelf</p>
        <h1>Categories</h1>
        <p>Pick a shelf to see its deals, newest first.</p>
      </div>
      {error ? <LoadError message={error} /> : null}
      {rows ? <CategoryTiles rows={rows} /> : null}
    </div>
  );
}

export function Category() {
  const { slug } = useParams();
  const cat = getCategory(slug);
  useTitle(cat?.name || "Category");
  const { rows, error } = useCatalog();
  const list = useMemo(() => (rows ? rows.filter((r) => r.cat === slug) : null), [rows, slug]);

  if (!cat) return <NotFound />;
  return (
    <div className="wrap">
      <div className="page-head">
        <div className="crumbs">
          <Link to="/categories">Categories</Link> / {cat.name}
        </div>
        <h1>
          <span aria-hidden="true">{cat.emoji}</span> {cat.name}
        </h1>
        <p>{list ? `${list.length} deals on this shelf.` : "Loading…"}</p>
      </div>
      {error ? <LoadError message={error} /> : null}
      {list ? <Feed key={slug} rows={list} /> : !error ? <GridSkeleton /> : null}
    </div>
  );
}
