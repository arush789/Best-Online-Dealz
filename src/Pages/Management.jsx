import React, { useCallback, useEffect, useState } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import { addProduct, deleteProducts, getToken, listProducts, logout } from "../lib/admin";
import { parseAsin } from "../lib/api";
import { useTitle } from "../lib/hooks";
import { BrandTag } from "../Components/Icon";

const PER_PAGE = 50;

// Route loader: send to /login when there's no valid token.
export async function loader() {
  if (!getToken()) throw redirect("/login");
  return null;
}

function AddForm({ onAdded }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [notify, setNotify] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const { asin } = parseAsin(link);

  async function submit(e) {
    e.preventDefault();
    if (!name.trim() || !asin) return;
    setBusy(true);
    setMsg(null);
    try {
      const r = await addProduct({ name: name.trim(), asin, note: note.trim(), notify });
      const tg = !notify
        ? "Not posted to Telegram."
        : r.telegram?.ok
        ? "Posted to Telegram."
        : `Telegram post failed: ${r.telegram?.reason || "unknown error"}.`;
      setMsg({ ok: true, text: `Added #${r.item.id}${r.item.category ? ` (${r.item.category})` : ""}. ${tg}` });
      setName("");
      setLink("");
      setNote("");
      onAdded();
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-card admin-add" onSubmit={submit}>
      <h2>Add a deal</h2>
      <label>
        Product name (shown on Telegram)
        <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Havells air fryer 5.5L" />
      </label>
      <label>
        Amazon link or ASIN
        <input value={link} onChange={(e) => setLink(e.target.value)} required placeholder="https://www.amazon.in/dp/B0…" />
        <small className={asin ? "ok" : ""}>{link ? (asin ? `ASIN ${asin}` : "No ASIN found in that") : " "}</small>
      </label>
      <label>
        Extra note / coupon (optional)
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Use coupon SAVE10" />
      </label>
      <label className="check">
        <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
        Post to Telegram
      </label>
      <button className="btn btn-hot" type="submit" disabled={busy || !asin || !name.trim()}>
        {busy ? "Adding…" : "Add deal"}
      </button>
      {msg ? <p className={msg.ok ? "admin-ok" : "admin-error"}>{msg.text}</p> : null}
    </form>
  );
}

export default function Management() {
  useTitle("Admin");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(() => new Set());
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(() => {
    setError("");
    listProducts(page, PER_PAGE)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [page]);

  useEffect(load, [load]);

  function signOut() {
    logout();
    navigate("/login", { replace: true });
  }

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function removeSelected() {
    const ids = [...selected];
    if (!ids.length) return;
    if (!window.confirm(`Delete ${ids.length} product${ids.length > 1 ? "s" : ""}? This can't be undone.`)) return;
    setDeleting(true);
    try {
      await deleteProducts(ids);
      setSelected(new Set());
      load();
    } catch (e) {
      if (e.status === 401) return signOut();
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  }

  const rows = data?.items || [];
  const allOnPage = rows.length > 0 && rows.every((r) => selected.has(r.id));

  return (
    <div className="admin">
      <header className="admin-bar">
        <Link to="/" className="brand">
          <BrandTag />
          <span>BODZ admin</span>
        </Link>
        <button className="btn btn-ghost" onClick={signOut}>
          Log out
        </button>
      </header>

      <div className="admin-grid">
        <AddForm onAdded={() => (page === 1 ? load() : setPage(1))} />

        <section className="admin-card">
          <div className="admin-table-head">
            <h2>
              Products <span className="muted">{data ? data.totalItems : ""}</span>
            </h2>
            <button className="btn" onClick={removeSelected} disabled={!selected.size || deleting}>
              {deleting ? "Deleting…" : `Delete selected (${selected.size})`}
            </button>
          </div>
          {error ? <p className="admin-error">{error}</p> : null}
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      aria-label="Select all on this page"
                      checked={allOnPage}
                      onChange={() =>
                        setSelected((prev) => {
                          const next = new Set(prev);
                          rows.forEach((r) => (allOnPage ? next.delete(r.id) : next.add(r.id)));
                          return next;
                        })
                      }
                    />
                  </th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>ASIN</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {!data && !error ? (
                  <tr>
                    <td colSpan={5}>Loading…</td>
                  </tr>
                ) : null}
                {rows.map((r) => (
                  <tr key={r.id} className={selected.has(r.id) ? "sel" : ""}>
                    <td>
                      <input type="checkbox" aria-label={`Select ${r.id}`} checked={selected.has(r.id)} onChange={() => toggle(r.id)} />
                    </td>
                    <td className="mono">{r.id}</td>
                    <td>{r.name}</td>
                    <td className="mono">
                      <Link to={`/offers/${r.asin}`} target="_blank">
                        {r.asin}
                      </Link>
                    </td>
                    <td>{r.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data ? (
            <div className="admin-pager">
              <button className="btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                ← Newer
              </button>
              <span className="mono">
                Page {page} of {data.totalPages}
              </span>
              <button className="btn" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
                Older →
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
