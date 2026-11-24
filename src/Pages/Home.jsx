import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCatalog, useItems, useTitle } from "../lib/hooks";
import { CATEGORIES } from "../lib/categories";
import { compact } from "../lib/format";
import DealCard, { DealGrid } from "../Components/DealCard";
import SearchBox from "../Components/SearchBox";
import CategoryTiles from "../Components/CategoryTiles";
import { GridSkeleton, LoadError } from "../Components/States";
import Icon from "../Components/Icon";

const HOME_POOL = 24;
export const BANDS = [499, 999, 1999, 4999];

export default function Home() {
  useTitle(null);
  const navigate = useNavigate();
  const { rows, error } = useCatalog();
  const asins = useMemo(() => (rows ? rows.slice(0, HOME_POOL).map((r) => r.asin) : null), [rows]);
  const { items, slots, done } = useItems(asins);

  const fresh = slots.slice(0, 8);
  const steals = useMemo(
    () => items.filter((i) => i.score != null).sort((a, b) => b.score - a.score).slice(0, 4),
    [items]
  );
  const heroTags = steals.length >= 3 ? steals.slice(0, 3) : [];
  const avgOff = items.length
    ? Math.round(items.filter((i) => i.price != null).reduce((s, i) => s + (i.pct || 0), 0) / Math.max(1, items.filter((i) => i.price != null).length))
    : null;
  const catCount = rows ? new Set(rows.map((r) => r.cat)).size : null;

  return (
    <>
      <section className="wrap hero">
        <div>
          <p className="eyebrow">Amazon India · checked live</p>
          <h1>
            Pay the <span className="hl">real</span> price, not the <span className="strike">M.R.P.</span>
          </h1>
          <p className="hero-lede">
            BODZ hand-picks Amazon deals, checks the live price, and scores every one so you can tell a steal
            from a fake sale in a second.
          </p>
          <SearchBox big />
          <div className="hero-hints">
            <span>Try:</span>
            {["air fryer", "earbuds", "smart tv", "trimmer"].map((h) => (
              <button key={h} className="hint-chip" onClick={() => navigate(`/search?q=${encodeURIComponent(h)}`)}>
                {h}
              </button>
            ))}
            <Link to="/lookup" className="hint-chip">
              or paste a link →
            </Link>
          </div>
        </div>
        <div className="hero-stack" aria-hidden={heroTags.length === 0}>
          {heroTags.map((it) => (
            <DealCard key={it.asin} item={it} />
          ))}
        </div>
      </section>

      <section className="wrap">
        <div className="stats">
          <div className="stat">
            <b>{rows ? compact(rows.length) : "—"}</b>
            <span>deals hand-picked</span>
          </div>
          <div className="stat">
            <b>{catCount ?? "—"}</b>
            <span>categories</span>
          </div>
          <div className="stat">
            <b>{avgOff != null && done ? `${avgOff}%` : "—"}</b>
            <span>average off, latest drops</span>
          </div>
          <div className="stat">
            <b>0–100</b>
            <span>
              <Link to="/how-we-pick" className="link-arrow">BODZ Score</Link> on every deal
            </span>
          </div>
        </div>
      </section>

      {error ? (
        <section className="wrap section">
          <LoadError message={error} />
        </section>
      ) : null}

      <section className="wrap section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Just dropped</p>
            <h2 className="h2">Fresh price drops</h2>
          </div>
          <Link to="/deals" className="link-arrow">
            All latest deals →
          </Link>
        </div>
        {rows ? <DealGrid slots={fresh} /> : <GridSkeleton n={8} />}
      </section>

      <section className="wrap section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Highest BODZ Score right now</p>
            <h2 className="h2">Steals of the moment</h2>
          </div>
          <Link to="/top" className="link-arrow">
            See all Top Picks →
          </Link>
        </div>
        {steals.length ? <DealGrid items={steals} skeletons={done ? 0 : 4 - steals.length} /> : <GridSkeleton n={4} />}
      </section>

      <section className="wrap section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Shop by budget</p>
            <h2 className="h2">Great deals under…</h2>
          </div>
        </div>
        <div className="bands">
          {BANDS.map((b) => (
            <Link key={b} to={`/budget?under=${b}`} className="band">
              <small>Under</small>
              <b>₹{compact(b)}</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <div>
            <p className="eyebrow">{CATEGORIES.length + 1} shelves</p>
            <h2 className="h2">Browse by category</h2>
          </div>
          <Link to="/categories" className="link-arrow">
            All categories →
          </Link>
        </div>
        {rows ? <CategoryTiles rows={rows} limit={12} /> : null}
      </section>

      <section className="wrap section">
        <div className="section-head">
          <div>
            <p className="eyebrow">How BODZ works</p>
            <h2 className="h2">Three checks before a deal goes up</h2>
          </div>
        </div>
        <div className="steps">
          <div className="step">
            <h3>Picked by a person</h3>
            <p>Every product is chosen by hand from Amazon India sales. No scraped junk, no endless feed.</p>
          </div>
          <div className="step">
            <h3>Price checked live</h3>
            <p>When you open a deal we pull the current price from Amazon, so what you see is what's on sale now.</p>
          </div>
          <div className="step">
            <h3>Scored out of 100</h3>
            <p>
              The BODZ Score weighs the discount and the rupees saved.{" "}
              <Link to="/how-we-pick" className="link-arrow">See the formula</Link>
            </p>
          </div>
        </div>
      </section>

      <section className="wrap section">
        <div className="cta-band">
          <div>
            <h2>Found a product on Amazon?</h2>
            <p>Paste the link and we'll tell you if the price is a real deal before you buy.</p>
          </div>
          <Link to="/lookup" className="btn btn-lime btn-lg">
            Check a price <Icon name="arrow" />
          </Link>
        </div>
      </section>
    </>
  );
}
