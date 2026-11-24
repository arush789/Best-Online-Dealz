import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fetchCatalog, fetchItem, parseAsin } from "../lib/api";
import { useTitle } from "../lib/hooks";
import { rupees } from "../lib/format";
import { tierFor } from "../lib/score";
import DealCard from "../Components/DealCard";
import Icon from "../Components/Icon";

const VERDICT = {
  steal: "Buy it. This is a strong deal.",
  great: "Good time to buy.",
  good: "Decent discount. Fine if you need it now.",
  fair: "Not much of a deal. Wait if you can.",
};

export default function Lookup() {
  useTitle("Price Check");
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const initial = params.get("url") || "";
  const [text, setText] = useState(initial);
  const [state, setState] = useState({ status: "idle" });

  useEffect(() => {
    if (!initial) {
      setState({ status: "idle" });
      return;
    }
    const { asin, short } = parseAsin(initial);
    if (short) {
      setState({ status: "short" });
      return;
    }
    if (!asin) {
      setState({ status: "bad" });
      return;
    }
    let alive = true;
    setState({ status: "loading", asin });
    Promise.all([fetchItem(asin), fetchCatalog().catch(() => [])])
      .then(([item, rows]) => {
        if (!alive) return;
        if (!item) return setState({ status: "missing", asin });
        setState({ status: "ok", item, listed: rows.some((r) => r.asin === asin) });
      })
      .catch((e) => alive && setState({ status: "error", message: e.message }));
    return () => {
      alive = false;
    };
  }, [initial]);

  function submit(e) {
    e.preventDefault();
    if (text.trim()) setParams({ url: text.trim() });
  }

  const tier = state.item ? tierFor(state.item.score) : null;

  return (
    <div className="wrap">
      <div className="page-head">
        <p className="eyebrow">Price Check</p>
        <h1>Is it really a deal?</h1>
        <p>
          Paste any Amazon India product link (or its 10-character ASIN). We pull the live price and give it a
          BODZ Score.
        </p>
      </div>

      <div className="lookup-card">
        <form className="searchbox big" onSubmit={submit}>
          <Icon name="link" />
          <label htmlFor="lookup" className="sr-only">
            Amazon link or ASIN
          </label>
          <input
            id="lookup"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://www.amazon.in/dp/B0…"
            autoComplete="off"
            inputMode="url"
          />
          <button className="btn btn-hot" type="submit">
            Check
          </button>
        </form>
        <p className="fine">
          Works with links like <code className="mono">amazon.in/…/dp/B0XXXXXXXX</code>. Short links (amzn.to,
          amzn.in) need to be opened first: open it, then copy the full address.
        </p>
      </div>

      {state.status === "loading" ? (
        <div className="row" style={{ marginTop: 28 }}>
          <div className="spinner" /> <span className="muted">Checking {state.asin} on Amazon…</span>
        </div>
      ) : null}

      {state.status === "short" ? (
        <div className="error-box" style={{ marginTop: 24 }}>
          <b>That's a short link.</b> Open it in your browser, then paste the full amazon.in address here.
        </div>
      ) : null}
      {state.status === "bad" ? (
        <div className="error-box" style={{ marginTop: 24 }}>
          <b>We couldn't find a product ID in that.</b> Paste a full Amazon product link, or search our deals
          instead.{" "}
          <button className="btn btn-ghost" onClick={() => navigate(`/search?q=${encodeURIComponent(initial)}`)}>
            Search “{initial.slice(0, 30)}”
          </button>
        </div>
      ) : null}
      {state.status === "missing" ? (
        <div className="error-box" style={{ marginTop: 24 }}>
          <b>No live listing for {state.asin}.</b> It may be out of stock or not sold on Amazon India.
        </div>
      ) : null}
      {state.status === "error" ? (
        <div className="error-box" style={{ marginTop: 24 }}>
          <b>Price check failed.</b> {state.message}
        </div>
      ) : null}

      {state.status === "ok" ? (
        <div className="lookup-result">
          <DealCard item={state.item} />
          <div className="verdict">
            {tier ? (
              <>
                <p className="eyebrow mt-0">Verdict</p>
                <h3>{VERDICT[tier.key]}</h3>
                <p className="muted">
                  BODZ Score <b className="mono">{state.item.score}</b>/100 · {tier.label}
                </p>
                <div className="receipt" style={{ marginTop: 16 }}>
                  <div className="receipt-row">
                    <span>M.R.P.</span>
                    <span>{rupees(state.item.mrp)}</span>
                  </div>
                  <div className="receipt-row">
                    <span>You save</span>
                    <span className="hot">
                      {rupees(state.item.save)} ({state.item.pct}%)
                    </span>
                  </div>
                  <div className="receipt-row total">
                    <span>Price now</span>
                    <b>{rupees(state.item.price)}</b>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3>No price shown</h3>
                <p className="muted">Amazon didn't return a price for this listing right now.</p>
              </>
            )}
            <div className="detail-actions">
              <Link to={`/offers/${state.item.asin}`} className="btn">
                Full details
              </Link>
              <a href={state.item.url} target="_blank" rel="noreferrer sponsored" className="btn btn-hot">
                View on Amazon <Icon name="external" size={16} />
              </a>
            </div>
            {state.listed ? (
              <p className="fine">
                <Icon name="check" size={14} /> This product is already on BODZ.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
