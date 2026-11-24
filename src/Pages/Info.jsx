import React from "react";
import { Link } from "react-router-dom";
import { useTitle } from "../lib/hooks";
import { TIERS } from "../lib/score";

function PageHead({ eyebrow, title, lede }) {
  return (
    <div className="page-head">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h1>{title}</h1>
      {lede ? <p>{lede}</p> : null}
    </div>
  );
}

export function HowWePick() {
  useTitle("How we pick");
  return (
    <div className="wrap">
      <PageHead
        eyebrow="Method"
        title="How we pick and grade deals"
        lede="No magic, no hidden rules. Here's exactly what goes into every deal you see on BODZ."
      />
      <div className="prose">
        <h2>1. A person picks the product</h2>
        <p>
          Every product on BODZ is added by hand from online sales. We skip listings with doubtful M.R.P.s,
          unknown sellers or poor reviews, and focus on things people actually buy.
        </p>

        <h2>2. The price is checked live</h2>
        <p>
          Prices are not typed in by us. When a deal loads, BODZ asks the store's official product API for the
          current price, the M.R.P. and the saving. If there's no live listing, the deal is hidden.
        </p>

        <h2>3. Every deal gets a value grade</h2>
        <p>Behind each grade is a 0–100 value score with two parts:</p>
        <pre className="formula">
          {`discount points = min(% off, 80) ÷ 80 × 70
savings points  = min(log10(₹ saved + 1) ÷ 4, 1) × 30

value score     = discount points + savings points`}
        </pre>
        <p>
          The discount part rewards a big percentage off. The savings part rewards real rupees: saving ₹4,000 on
          a TV counts for more than saving ₹40 on a cable, even at the same percentage. Full savings marks start
          at ₹10,000 saved.
        </p>
        <table className="tier-table">
          <thead>
            <tr>
              <th>Grade</th>
              <th>Score</th>
              <th>Label</th>
              <th>What it means</th>
            </tr>
          </thead>
          <tbody>
            {TIERS.map((t, i) => (
              <tr key={t.key}>
                <td className="mono">
                  <b>{t.grade}</b>
                </td>
                <td className="mono">
                  {t.min}
                  {i === 0 ? "+" : `–${TIERS[i - 1].min - 1}`}
                </td>
                <td>
                  <b>{t.label}</b>
                </td>
                <td>
                  {
                    {
                      top: "Excellent value. A great time to buy.",
                      great: "A strong discount. A good time to buy.",
                      good: "A fair saving.",
                      fair: "A small saving. A sale may bring it lower.",
                    }[t.key]
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Very large discounts</h2>
        <p>
          Discounts of 80% or more are unusual, so those deals get a gentle note on their page and stay at
          grade A at most.
        </p>

        <h2>What the grade doesn't know</h2>
        <p>
          The grade compares today's price to the listed M.R.P. It doesn't track price history yet, so step 1
          matters: a person checks each listing before it goes up.
        </p>

        <h2>How we make money</h2>
        <p>
          Links to stores are affiliate links. If you buy, the store pays us a small commission. You pay the same
          price. The grade never depends on the commission. See the <Link to="/disclaimer">disclaimer</Link>.
        </p>
      </div>
    </div>
  );
}

export function About() {
  useTitle("About");
  return (
    <div className="wrap">
      <PageHead
        eyebrow="About"
        title="Deals chosen with care"
        lede="BODZ (Best Online Dealz) started in 2021 as a small deals channel. Today it's a handpicked list of online deals with live prices."
      />
      <div className="prose">
        <p>
          Online sales are noisy. Every product claims to be 70% off, and most of those discounts are against an
          M.R.P. nobody pays. BODZ is our answer: a short list of products we would buy ourselves, with the live
          price and a simple grade that shows the value at a glance.
        </p>
        <h2>What you can do here</h2>
        <ul>
          <li>
            <Link to="/deals">Latest</Link>: every deal, newest first.
          </li>
          <li>
            <Link to="/top">Best Value</Link>: recent deals sorted by value grade.
          </li>
          <li>
            <Link to="/budget">Budget Buys</Link>: the best deals under ₹499, ₹999, ₹1,999 and ₹4,999.
          </li>
          <li>
            <Link to="/categories">Categories</Link>: browse by shelf.
          </li>
          <li>
            <Link to="/lookup">Price Check</Link>: paste a product link to grade its price.
          </li>
        </ul>
        <h2>Get in touch</h2>
        <p>
          Questions, deal tips or partnerships: <Link to="/contact">contact us</Link>.
        </p>
      </div>
    </div>
  );
}

export function Contact() {
  useTitle("Contact");
  return (
    <div className="wrap">
      <PageHead eyebrow="Contact" title="Say hello" lede="Questions about the site, advertising, or a deal tip? Email us." />
      <div className="prose">
        <a className="btn btn-hot btn-lg" href="mailto:help.bodz@gmail.com">
          help.bodz@gmail.com
        </a>
        <p className="fine">We usually reply within two working days.</p>
      </div>
    </div>
  );
}

export function Disclaimer() {
  useTitle("Disclaimer");
  return (
    <div className="wrap">
      <PageHead eyebrow="Legal" title="Disclaimer" />
      <div className="prose">
        <h2>Affiliate links</h2>
        <p>
          BestOnlineDealz may contain affiliate links. When you click one, you go to the seller's site and buy
          there, not on BestOnlineDealz. If you buy, we may earn a small commission. Your price stays the same.
        </p>
        <p>BestOnlineDealz takes part in two kinds of affiliate programs:</p>
        <ul>
          <li>
            <b>Amazon affiliate links.</b> BestOnlineDealz is a participant in the Amazon Associates Program, an
            affiliate advertising program designed to provide a means for sites to earn advertising fees by
            advertising and linking to Amazon.in.
          </li>
          <li>
            <b>Product affiliate links.</b> When you buy through these links, BestOnlineDealz earns a percentage
            of the sale or other compensation.
          </li>
        </ul>
        <p>Affiliate links don't change what you pay, and we are not paid per click.</p>

        <h2>Sponsored content</h2>
        <p>
          BestOnlineDealz does not publish paid posts. If we ever do, we will say so clearly at the top of the
          post.
        </p>

        <h2>Prices and accuracy</h2>
        <p>
          Prices, discounts and stock come from the store and can change at any time, including between when you see
          a deal and when you check out. The price shown by the seller at checkout is the final price.
        </p>
        <p>
          Information on this site is provided "as is". We don't guarantee or endorse products or content on
          external websites linked from here, and your decision to buy is your own. The site is meant for users
          in India and is governed by the laws of India.
        </p>
      </div>
    </div>
  );
}

export function NotFound() {
  useTitle("Not found");
  return (
    <div className="wrap">
      <div className="page-head" style={{ borderBottom: 0 }}>
        <p className="eyebrow">404</p>
        <h1>This deal expired.</h1>
        <p>Or the page never existed. Either way, there are fresher ones waiting.</p>
      </div>
      <div className="row">
        <Link to="/" className="btn">
          Home
        </Link>
        <Link to="/deals" className="btn btn-hot">
          Latest deals
        </Link>
      </div>
    </div>
  );
}
