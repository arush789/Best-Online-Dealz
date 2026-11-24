import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchItem } from "../lib/api";
import { useCatalog, useItems, useTitle } from "../lib/hooks";
import { getCategory } from "../lib/categories";
import { largerImage, rupees, shortTitle } from "../lib/format";
import { scoreParts, tierFor } from "../lib/score";
import { DealGrid, ScoreBadge, Stamp } from "../Components/DealCard";
import Icon from "../Components/Icon";

/** Amazon titles pack specs after "|". Keep the part before it for the heading. */
function headline(title = "") {
  const first = title.split(" | ")[0].trim();
  return first.length >= 20 && first.length <= 140 ? first : title.length > 140 ? title.slice(0, 138) + "…" : title;
}

function ShareButtons({ item }) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/offers/${item.asin}`;
  const text = `${shortTitle(item.title)} at ${rupees(item.price)}${item.pct ? ` (${item.pct}% off)` : ""}`;

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "BODZ deal", text, url });
        return;
      } catch {
        /* user cancelled: fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="pill-row">
      <span className="muted" style={{ fontSize: 14 }}>
        Share:
      </span>
      <a className="pill" href={`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`} target="_blank" rel="noreferrer">
        WhatsApp
      </a>
      <a
        className="pill"
        href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noreferrer"
      >
        Telegram
      </a>
      <button className="pill" style={{ background: "none", cursor: "pointer" }} onClick={share}>
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}

function ScoreMeter({ item }) {
  const parts = scoreParts(item);
  const tier = tierFor(parts.total);
  return (
    <div className="meter">
      <div className="meter-head">
        <div>
          <p className="eyebrow mt-0">BODZ Score</p>
          <b>
            {parts.total}
            <span className="muted" style={{ fontSize: 16 }}>
              /100
            </span>
          </b>
        </div>
        <ScoreBadge score={parts.total} />
      </div>
      <div className="meter-bar" role="img" aria-label={`Score ${parts.total} out of 100`}>
        <span style={{ width: `${parts.discount}%` }} />
        <span style={{ width: `${parts.savings}%` }} />
      </div>
      <div className="meter-legend">
        <span>
          <i style={{ background: "var(--hot)" }} />
          Discount {parts.discount}/70
        </span>
        <span>
          <i style={{ background: "var(--lime)" }} />
          Rupees saved {parts.savings}/30
        </span>
        <Link to="/how-we-pick" className="link-arrow">
          How it's scored
        </Link>
      </div>
      {parts.suspect ? (
        <p className="fine">
          ⚠ {item.pct}% off is unusually high. The M.R.P. may be inflated, so we cap this score at 80. Compare
          with similar products before you buy.
        </p>
      ) : null}
      {tier?.key === "fair" ? (
        <p className="fine">Small discount. Worth waiting for a sale unless you need it now.</p>
      ) : null}
    </div>
  );
}

export default function OfferDetail() {
  const { id } = useParams();
  const asin = (id || "").toUpperCase();
  const [state, setState] = useState({ status: "loading" });
  const { rows } = useCatalog();

  useEffect(() => {
    let alive = true;
    setState({ status: "loading" });
    fetchItem(asin)
      .then((item) => alive && setState(item ? { status: "ok", item } : { status: "missing" }))
      .catch((e) => alive && setState({ status: "error", message: e.message }));
    return () => {
      alive = false;
    };
  }, [asin]);

  const item = state.item;
  useTitle(item ? shortTitle(item.title) : "Deal");

  const catSlug = rows?.find((r) => r.asin === asin)?.cat;
  const cat = getCategory(catSlug);
  const similarAsins = useMemo(() => {
    if (!rows) return null;
    const pool = rows.filter((r) => r.asin !== asin && (!catSlug || r.cat === catSlug));
    return pool.slice(0, 8).map((r) => r.asin);
  }, [rows, asin, catSlug]);
  const { items: similar } = useItems(similarAsins);

  if (state.status === "loading") {
    return (
      <div className="wrap">
        <div className="detail">
          <div className="detail-media tag skeleton" style={{ borderRadius: 20 }}>
            <div className="tag-media" style={{ width: "100%", height: "100%", margin: 0 }} />
          </div>
          <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
            <div className="sk-line" style={{ width: "30%" }} />
            <div className="sk-line" style={{ width: "90%", height: 28 }} />
            <div className="sk-line" style={{ width: "70%", height: 28 }} />
            <div className="sk-line" style={{ width: "100%", height: 140, marginTop: 12 }} />
          </div>
        </div>
      </div>
    );
  }

  if (state.status !== "ok") {
    return (
      <div className="wrap">
        <div className="page-head">
          <h1>{state.status === "missing" ? "Deal not available" : "Couldn't load this deal"}</h1>
          <p>
            {state.status === "missing"
              ? "Amazon has no live listing for this product right now. It may be sold out."
              : state.message}
          </p>
        </div>
        <div className="row">
          <a href={`https://www.amazon.in/dp/${asin}?tag=catchkaps0e-21`} target="_blank" rel="noreferrer sponsored" className="btn">
            Try on Amazon <Icon name="external" size={16} />
          </a>
          <Link to="/deals" className="btn btn-hot">
            See latest deals
          </Link>
        </div>
      </div>
    );
  }

  const hasPrice = item.price != null;

  return (
    <div className="wrap">
      <div className="detail">
        <div>
          <div className="detail-media">
            <Stamp pct={item.pct} />
            {item.image ? <img src={largerImage(item.image)} alt={item.title} /> : null}
          </div>
        </div>

        <div>
          <div className="crumbs" style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>
            <Link to="/deals" style={{ textDecoration: "none" }}>Deals</Link>
            {cat ? (
              <>
                {" / "}
                <Link to={`/category/${cat.slug}`} style={{ textDecoration: "none" }}>
                  {cat.name}
                </Link>
              </>
            ) : null}
          </div>
          {item.brand ? <p className="eyebrow" style={{ marginTop: 14 }}>{item.brand}</p> : null}
          <h1 title={item.title}>{headline(item.title)}</h1>

          {hasPrice ? (
            <div className="receipt">
              {item.mrp > item.price ? (
                <>
                  <div className="receipt-row">
                    <span>M.R.P.</span>
                    <span style={{ textDecoration: "line-through" }}>{rupees(item.mrp)}</span>
                  </div>
                  <div className="receipt-row">
                    <span>You save</span>
                    <span className="hot">
                      − {rupees(item.save)} ({item.pct}%)
                    </span>
                  </div>
                </>
              ) : null}
              <div className="receipt-row total">
                <span>Deal price</span>
                <b>{rupees(item.price)}</b>
              </div>
            </div>
          ) : (
            <div className="receipt">
              <div className="receipt-row">Amazon isn't showing a price right now. Check the listing.</div>
            </div>
          )}

          <div className="detail-actions">
            <a href={item.url} target="_blank" rel="noreferrer sponsored" className="btn btn-hot btn-lg">
              Buy on Amazon <Icon name="external" size={18} />
            </a>
          </div>
          <ShareButtons item={item} />

          {hasPrice ? <ScoreMeter item={item} /> : null}

          {item.features.length ? (
            <>
              <h2 style={{ fontSize: 20, margin: "28px 0 0" }}>Highlights</h2>
              <ul className="features">
                {item.features.slice(0, 6).map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </>
          ) : null}

          <p className="fine">
            Price checked live from Amazon when you opened this page. Prices can change with sellers and sale
            timing; the price at checkout is the final one. We may earn a commission if you buy.
          </p>
        </div>
      </div>

      {similar.length ? (
        <section className="section">
          <div className="section-head">
            <div>
              <p className="eyebrow">{cat ? cat.name : "More deals"}</p>
              <h2 className="h2">You might also like</h2>
            </div>
            {cat ? (
              <Link to={`/category/${cat.slug}`} className="link-arrow">
                All {cat.name} →
              </Link>
            ) : null}
          </div>
          <DealGrid items={similar.slice(0, 4)} />
        </section>
      ) : null}
    </div>
  );
}
