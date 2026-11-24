import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Icon, { BrandTag } from "./Icon";
import SearchBox from "./SearchBox";
import { useCatalog, useItems } from "../lib/hooks";
import { rupees, shortTitle } from "../lib/format";

const NAV = [
  { to: "/deals", label: "Latest" },
  { to: "/top", label: "Best Value" },
  { to: "/budget", label: "Budget Buys" },
  { to: "/categories", label: "Categories" },
  { to: "/lookup", label: "Price Check" },
];

function readTheme() {
  try {
    return localStorage.getItem("bodz:theme");
  } catch {
    return null;
  }
}

function useTheme() {
  const [theme, setTheme] = useState(() => readTheme());
  useEffect(() => {
    const root = document.documentElement;
    if (theme) root.setAttribute("data-theme", theme);
    else root.removeAttribute("data-theme");
    try {
      if (theme) localStorage.setItem("bodz:theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);
  const isDark =
    theme === "dark" ||
    (!theme && typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches);
  return [isDark, () => setTheme(isDark ? "light" : "dark")];
}

function Ticker() {
  const { rows } = useCatalog();
  const asins = rows ? rows.slice(0, 12).map((r) => r.asin) : null;
  const { items } = useItems(asins);
  const live = items.filter((i) => i.price != null && i.pct >= 10);
  if (live.length < 3) return <div className="ticker" aria-hidden="true" />;
  return (
    <div className="ticker" role="marquee" aria-label="Latest price drops">
      <div className="ticker-track">
        {[...live, ...live].map((i, n) => (
          <Link key={`${i.asin}-${n}`} to={`/offers/${i.asin}`} tabIndex={n >= live.length ? -1 : undefined}>
            <b>▼{i.pct}%</b>
            <span>{shortTitle(i.title).slice(0, 42)}</span>
            <span>{rupees(i.price)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDark, toggleTheme] = useTheme();
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <Ticker />
      <div className="wrap">
        <nav className="nav" aria-label="Main">
          <Link to="/" className="brand" aria-label="BODZ home">
            <BrandTag />
            <span>
              BODZ
              <small>Best Online Dealz</small>
            </span>
          </Link>
          <ul className="nav-links">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to}>{n.label}</NavLink>
              </li>
            ))}
          </ul>
          <div className="nav-search">
            <SearchBox />
          </div>
          <div className="nav-tools">
            <button
              className="icon-btn search-btn"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              aria-expanded={searchOpen}
            >
              <Icon name="search" />
            </button>
            <button className="icon-btn" onClick={toggleTheme} aria-label={isDark ? "Light mode" : "Dark mode"}>
              <Icon name={isDark ? "sun" : "moon"} />
            </button>
            <button
              className="icon-btn menu-btn"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
            >
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
        </nav>
        {searchOpen && !open ? (
          <div style={{ paddingBottom: 12 }}>
            <SearchBox autoFocus onDone={() => setSearchOpen(false)} />
          </div>
        ) : null}
      </div>
      {open ? (
        <div className="drawer">
          <div className="wrap">
            <SearchBox onDone={() => setOpen(false)} />
            <ul>
              {[{ to: "/", label: "Home" }, ...NAV].map((n) => (
                <li key={n.to}>
                  <NavLink to={n.to} end={n.to === "/"}>
                    {n.label} <Icon name="arrow" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </header>
  );
}
