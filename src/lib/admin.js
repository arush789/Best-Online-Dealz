// Admin API client. Every admin action goes through bodz-server, which holds
// the database, Telegram and Cutt.ly credentials. The browser only ever holds
// a short-lived signed token.

import { API_BASE } from "./api";

const TOKEN_KEY = "bodz:admin";

export function getToken() {
  try {
    const raw = sessionStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const { token, expiresAt } = JSON.parse(raw);
    if (!token || Date.now() > expiresAt) return null;
    return token;
  } catch {
    return null;
  }
}

export function logout() {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

async function call(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (!token) throw Object.assign(new Error("Please log in again."), { status: 401 });
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && auth) logout();
    throw Object.assign(new Error(data.message || `Request failed (${res.status})`), { status: res.status });
  }
  return data;
}

export async function login(username, password) {
  const data = await call("/admin/login", { method: "POST", body: { username, password }, auth: false });
  try {
    sessionStorage.setItem(TOKEN_KEY, JSON.stringify({ token: data.token, expiresAt: data.expiresAt }));
  } catch {
    /* ignore */
  }
  return data;
}

export const me = () => call("/admin/me");

export const listProducts = (page = 1, itemsPerPage = 50) =>
  call(`/getTable?page=${page}&itemsPerPage=${itemsPerPage}`, { auth: false });

export const addProduct = ({ name, asin, note, notify }) =>
  call("/admin/items", { method: "POST", body: { name, asin, note, notify } });

export const deleteProducts = (ids) => call("/admin/items", { method: "DELETE", body: { ids } });
