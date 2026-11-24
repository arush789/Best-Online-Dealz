import React from "react";
import { Link } from "react-router-dom";
import { BrandTag } from "./Icon";
import { CATEGORIES } from "../lib/categories";

const TELEGRAM_URL = import.meta.env.BODZ_PUBLIC_TELEGRAM_URL;
const FACEBOOK_URL = "https://www.facebook.com/people/Online-Offers-Dealz/61555187057187/";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link to="/" className="brand" aria-label="BODZ home">
              <BrandTag />
              <span>BODZ</span>
            </Link>
            <p>
              Handpicked online deals, graded for value. We check today's price before you click, so you
              always know what you're getting.
            </p>
          </div>
          <div>
            <h4>Deals</h4>
            <ul>
              <li><Link to="/deals">Latest drops</Link></li>
              <li><Link to="/top">Best Value</Link></li>
              <li><Link to="/budget">Budget Buys</Link></li>
              <li><Link to="/lookup">Price Check</Link></li>
            </ul>
          </div>
          <div>
            <h4>Popular</h4>
            <ul>
              {CATEGORIES.slice(0, 5).map((c) => (
                <li key={c.slug}>
                  <Link to={`/category/${c.slug}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>BODZ</h4>
            <ul>
              <li><Link to="/how-we-pick">How we pick</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/disclaimer">Disclaimer</Link></li>
              <li><a href={FACEBOOK_URL} target="_blank" rel="noreferrer">Facebook</a></li>
              {TELEGRAM_URL ? (
                <li><a href={TELEGRAM_URL} target="_blank" rel="noreferrer">Telegram</a></li>
              ) : null}
            </ul>
          </div>
        </div>
        <div className="footer-legal">
          <p>
            BestOnlineDealz is a participant in the Amazon Associates Program, an affiliate advertising program
            designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.in.
            We may earn a commission when you buy through our links, at no extra cost to you.
          </p>
          <p>Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.</p>
          <p>Prices and availability change often. The price at checkout is the one that counts.</p>
          <p>© {year} Best Online Dealz. All rights reserved.</p>
        </div>
        <p className="big-word" aria-hidden="true">
          BODZ<span>.</span>
        </p>
      </div>
    </footer>
  );
}
