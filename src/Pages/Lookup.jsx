import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fetchCatalog, fetchItem, parseAsin } from "../lib/api";
import { useTitle } from "../lib/hooks";
import { rupees } from "../lib/format";
import { tierFor } from "../lib/score";
import DealCard from "../Components/DealCard";
import Icon from "../Components/Icon";

const VERDICT = {
  top: "Excellent value. A great time to buy.",
  great: "Very good value. A good time to buy.",
  good: "A fair saving if you need it now.",
  fair: "A small saving. It may be worth waiting for a sale.",
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
          Paste a product link (or its 10-character product code). We fetch today's price and give it a value
          grade.
        </p>
      </div>

      <div className="lookup-card">
        <form className="searchbox big" onSubmit={submit}>
          <Icon name="link" />
          <label htmlFor="lookup" className="sr-only">
            Product link or code
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
          <div className="spinner" /> <span className="muted">Checking {state.asin}…</span>
        </div>
      ) : null}

      {state.status === "short" ? (
        <div className="error-box" style={{ marginTop: 24 }}>
          <b>That's a short link.</b> Open it in your browser, then paste the full address here.
        </div>
      ) : null}
      {state.status === "bad" ? (
        <div className="error-box" style={{ marginTop: 24 }}>
          <b>We couldn't find a product ID in that.</b> Paste a full product link, or search our deals
          instead.{" "}
          <button className="btn btn-ghost" onClick={() => navigate(`/search?q=${encodeURIComponent(initial)}`)}>
            Search “{initial.slice(0, 30)}”
          </button>
        </div>
      ) : null}
      {state.status === "missing" ? (
        <div className="error-box" style={{ marginTop: 24 }}>
          <b>No live listing for {state.asin}.</b> It may be out of stock right now.
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
                  Value grade <b className="mono">{tier.grade}</b> · {tier.label}
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
                <p className="muted">The store isn't showing a price for this listing right now.</p>
              </>
            )}
            <div className="detail-actions">
              <Link to={`/offers/${state.item.asin}`} className="btn">
                Full details
              </Link>
              <a href={state.item.url} target="_blank" rel="noreferrer sponsored" className="btn btn-hot">
                Go to store <Icon name="external" size={16} />
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
