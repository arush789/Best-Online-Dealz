import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useCatalog, useItems, useTitle } from "../lib/hooks";
import { compact } from "../lib/format";
import { DealGrid } from "../Components/DealCard";
import { GridSkeleton, LoadError } from "../Components/States";
import { BANDS } from "./Home";
import { POOL } from "./TopPicks";

export default function Budget() {
  const [params, setParams] = useSearchParams();
  const under = BANDS.includes(Number(params.get("under"))) ? Number(params.get("under")) : 999;
  useTitle(`Deals under ₹${compact(under)}`);

  const { rows, error } = useCatalog();
  const asins = useMemo(() => (rows ? rows.slice(0, POOL).map((r) => r.asin) : null), [rows]);
  const { items, done, loaded, total } = useItems(asins);

  const list = useMemo(
    () => items.filter((i) => i.price != null && i.price <= under).sort((a, b) => (b.score ?? 0) - (a.score ?? 0)),
    [items, under]
  );

  return (
    <div className="wrap">
      <div className="page-head">
        <p className="eyebrow">Budget Buys</p>
        <h1>
          Great deals under <span className="mono">₹{compact(under)}</span>
        </h1>
        <p>Recent deals that fit your budget, best score first.</p>
      </div>
      <div className="toolbar">
        <div className="chips" role="group" aria-label="Budget">
          {BANDS.map((b) => (
            <button key={b} className="chip" aria-pressed={b === under} onClick={() => setParams({ under: String(b) })}>
              Under ₹{compact(b)}
            </button>
          ))}
        </div>
        <span className="toolbar-note">{done ? `${list.length} deals` : `Checking prices… ${loaded}/${total}`}</span>
      </div>
      {error ? <LoadError message={error} /> : null}
      {!rows && !error ? <GridSkeleton /> : null}
      {rows ? (
        <>
          <DealGrid items={list} skeletons={done ? 0 : Math.max(0, 8 - list.length)} />
          {done && !list.length ? (
            <div className="empty">
              <h3>Nothing under ₹{compact(under)} right now</h3>
              <p>Try a bigger budget.</p>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
