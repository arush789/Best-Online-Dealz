import React, { useMemo } from "react";
import { Link } from "react-router-dom";
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
  const { rows, error } = useCatalog();
  const asins = useMemo(() => (rows ? rows.slice(0, HOME_POOL).map((r) => r.asin) : null), [rows]);
  const { items, slots, done } = useItems(asins);

  const fresh = slots.slice(0, 8);
  const bestValue = useMemo(
    () => items.filter((i) => i.score != null).sort((a, b) => b.score - a.score).slice(0, 4),
    [items]
  );
  const heroTags = bestValue.length >= 3 ? bestValue.slice(0, 3) : [];
  const avgOff = items.length
    ? Math.round(items.filter((i) => i.price != null).reduce((s, i) => s + (i.pct || 0), 0) / Math.max(1, items.filter((i) => i.price != null).length))
    : null;
  const catCount = rows ? new Set(rows.map((r) => r.cat)).size : null;

  return (
    <>
      <section className="wrap hero">
        <div>
          <p className="eyebrow">Best Online Dealz · since 2021</p>
          <h1>
            Elevate your <span className="hl">shopping</span>. Uncover exclusive deals.
          </h1>
          <p className="hero-lede">
            Handpicked online deals, chosen with care for elegance and savings. Every price is checked live and
            given a simple value grade, so you know exactly what you're getting.
          </p>
          <SearchBox big />
          <div className="hero-hints">
            <span>Popular shelves:</span>
            {CATEGORIES.slice(0, 4).map((c) => (
              <Link key={c.slug} to={`/category/${c.slug}`} className="hint-chip">
                {c.name}
              </Link>
            ))}
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
            <b>A+ to C</b>
            <span>
              <Link to="/how-we-pick" className="link-arrow">Value grade</Link> on every deal
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
            <p className="eyebrow">Highest value grade right now</p>
            <h2 className="h2">Best value right now</h2>
          </div>
          <Link to="/top" className="link-arrow">
            See all Best Value →
          </Link>
        </div>
        {bestValue.length ? <DealGrid items={bestValue} skeletons={done ? 0 : 4 - bestValue.length} /> : <GridSkeleton n={4} />}
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
            <p>Every product is chosen by hand from online sales. A short, tidy list instead of an endless feed.</p>
          </div>
          <div className="step">
            <h3>Price checked live</h3>
            <p>When you open a deal we fetch today's price, so what you see is what's on sale now.</p>
          </div>
          <div className="step">
            <h3>Graded for value</h3>
            <p>
              Each deal gets a grade from A+ to C based on the discount and the rupees saved.{" "}
              <Link to="/how-we-pick" className="link-arrow">How grading works</Link>
            </p>
          </div>
        </div>
      </section>

      <section className="wrap section">
        <div className="cta-band">
          <div>
            <h2>Eyeing something online?</h2>
            <p>Paste its link and we'll grade today's price before you buy.</p>
          </div>
          <Link to="/lookup" className="btn btn-lime btn-lg">
            Check a price <Icon name="arrow" />
          </Link>
        </div>
      </section>
    </>
  );
}
