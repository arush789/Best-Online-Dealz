import React from "react";
import { Link } from "react-router-dom";
import { rupees, shortTitle } from "../lib/format";
import { tierFor } from "../lib/score";

export function ScoreBadge({ score, withLabel = true }) {
  const tier = tierFor(score);
  if (!tier) return null;
  return (
    <span className={`score ${tier.key}`} title={`Value grade ${tier.grade}: ${tier.label}`}>
      <i>{tier.grade}</i>
      {withLabel ? tier.label : "grade"}
    </span>
  );
}

export function Stamp({ pct }) {
  if (!pct || pct < 5) return null;
  return (
    <div className="stamp" aria-label={`${pct} percent off`}>
      <div>
        −{pct}%<small>OFF</small>
      </div>
    </div>
  );
}

export default function DealCard({ item, style }) {
  const hasPrice = item.price != null;
  return (
    <Link to={`/offers/${item.asin}`} className="tag" style={style}>
      <Stamp pct={item.pct} />
      <div className="tag-media">
        {item.image ? (
          <img src={item.image} alt="" loading="lazy" decoding="async" />
        ) : null}
      </div>
      <div className="tag-body">
        {item.brand ? <div className="tag-brand">{item.brand}</div> : null}
        <h3 className="tag-title" title={item.title}>
          {shortTitle(item.title)}
        </h3>
        <div className="tag-foot">
          {hasPrice ? (
            <div>
              <div className="price">{rupees(item.price)}</div>
              {item.mrp > item.price ? <div className="mrp">{rupees(item.mrp)}</div> : null}
            </div>
          ) : (
            <div className="no-price">See price</div>
          )}
          <ScoreBadge score={item.score} withLabel={false} />
        </div>
      </div>
    </Link>
  );
}

export function SkeletonCard() {
  return (
    <div className="tag skeleton" aria-hidden="true">
      <div className="tag-media" />
      <div className="tag-body">
        <div className="sk-line" style={{ width: "40%" }} />
        <div className="sk-line" style={{ width: "92%" }} />
        <div className="sk-line" style={{ width: "70%" }} />
        <div className="tag-foot">
          <div className="sk-line" style={{ width: "45%", height: 18 }} />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of deal cards. Pass `slots` (from useItems) to show skeletons for
 * listings still loading; unavailable listings (null) are skipped.
 */
export function DealGrid({ items, slots, skeletons = 0 }) {
  if (slots) {
    return (
      <div className="grid">
        {slots.map((s, i) =>
          s === undefined ? <SkeletonCard key={`s${i}`} /> : s ? <DealCard key={s.asin} item={s} /> : null
        )}
      </div>
    );
  }
  return (
    <div className="grid">
      {items.map((it) => (
        <DealCard key={it.asin} item={it} />
      ))}
      {Array.from({ length: skeletons }, (_, i) => (
        <SkeletonCard key={`k${i}`} />
      ))}
    </div>
  );
}
