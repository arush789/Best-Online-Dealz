import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../lib/admin";
import { useTitle } from "../lib/hooks";
import { BrandTag } from "../Components/Icon";

export default function SignIn() {
  useTitle("Admin login");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await login(String(data.get("username") || ""), String(data.get("password") || ""));
      navigate("/management", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-card" onSubmit={handleSubmit}>
        <div className="brand">
          <BrandTag />
          <span>BODZ admin</span>
        </div>
        <label>
          Username
          <input name="username" autoComplete="username" required autoFocus />
        </label>
        <label>
          Password
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        {error ? (
          <p className="admin-error" role="alert">
            {error}
          </p>
        ) : null}
        <button className="btn btn-hot" type="submit" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
