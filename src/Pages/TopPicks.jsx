import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCatalog, useItems, useTitle } from "../lib/hooks";
import { TIERS } from "../lib/score";
import { DealGrid } from "../Components/DealCard";
import { GridSkeleton, LoadError } from "../Components/States";

export const POOL = 60;

export default function TopPicks() {
  useTitle("Best Value");
  const { rows, error } = useCatalog();
  const asins = useMemo(() => (rows ? rows.slice(0, POOL).map((r) => r.asin) : null), [rows]);
  const { items, done, loaded, total } = useItems(asins);
  const [minScore, setMinScore] = useState(50);

  const ranked = useMemo(
    () => items.filter((i) => i.score != null && i.score >= minScore).sort((a, b) => b.score - a.score),
    [items, minScore]
  );

  return (
    <div className="wrap">
      <div className="page-head">
        <p className="eyebrow">Graded for value</p>
        <h1>Best Value</h1>
        <p>
          The {POOL} most recent deals, sorted so the best value comes first.{" "}
          <Link to="/how-we-pick" className="link-arrow">How grading works</Link>
        </p>
      </div>

      <div className="toolbar">
        <div className="chips" role="group" aria-label="Minimum grade">
          {TIERS.slice(0, 3).map((t) => (
            <button key={t.key} className="chip" aria-pressed={minScore === t.min} onClick={() => setMinScore(t.min)}>
              {t.label} <span className="count">{t.grade}</span>
            </button>
          ))}
          <button className="chip" aria-pressed={minScore === 0} onClick={() => setMinScore(0)}>
            Everything
          </button>
        </div>
        <span className="toolbar-note">
          {done ? `${ranked.length} deals` : `Checking prices… ${loaded}/${total}`}
        </span>
      </div>

      {error ? <LoadError message={error} /> : null}
      {!rows && !error ? <GridSkeleton /> : null}
      {rows ? (
        <>
          <DealGrid items={ranked} skeletons={done ? 0 : Math.min(8, Math.max(0, 8 - ranked.length))} />
          {done && ranked.length === 0 ? (
            <div className="empty">
              <h3>Nothing at this grade right now</h3>
              <p>Try a lower grade.</p>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
