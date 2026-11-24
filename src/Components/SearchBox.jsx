import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { parseAsin } from "../lib/api";

/**
 * One box for both jobs: type words to search the catalog, or paste a product
 * link / ASIN to jump straight to the price check.
 */
export default function SearchBox({ big = false, autoFocus = false, initial = "", onDone }) {
  const [q, setQ] = useState(initial);
  const navigate = useNavigate();

  function submit(e) {
    e.preventDefault();
    const text = q.trim();
    if (!text) return;
    const { asin, short } = parseAsin(text);
    if (asin || short || /^https?:\/\//i.test(text)) {
      navigate(`/lookup?url=${encodeURIComponent(text)}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(text)}`);
    }
    onDone?.();
  }

  return (
    <form className={`searchbox${big ? " big" : ""}`} onSubmit={submit} role="search">
      <Icon name="search" />
      <label className="sr-only" htmlFor={big ? "q-big" : "q-nav"}>
        Search deals or paste a product link
      </label>
      <input
        id={big ? "q-big" : "q-nav"}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={big ? "Search deals or paste a product link…" : "Search deals…"}
        autoFocus={autoFocus}
        autoComplete="off"
        enterKeyHint="search"
      />
      {big ? (
        <button className="btn btn-hot" type="submit">
          Find
        </button>
      ) : null}
    </form>
  );
}
