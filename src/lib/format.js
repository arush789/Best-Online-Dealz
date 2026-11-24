const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function rupees(n) {
  if (n == null || Number.isNaN(n)) return "";
  return inr.format(Math.round(n));
}

export function compact(n) {
  return new Intl.NumberFormat("en-IN").format(n);
}

/** Strip the marketing prefixes and emoji that admins put on product names. */
export function cleanName(name = "") {
  let s = name.replace(/[\p{Extended_Pictographic}️‍]/gu, " ");
  // e.g. "Lowest :", "GRAB FAST :", "70% Off -", "[ Triple Offer ]", "Best Router Deal"
  for (let i = 0; i < 3; i++) {
    s = s
      .replace(/^\s*\[[^\]]*\]\s*/, "")
      .replace(/^\s*(lowest|grab fast|grab|best|triple offer|limited time deal|deal|\d+%\s*off)\b\s*[:\-–|,]?\s*/i, "")
      .replace(/^\s*best \w+ deal\s*/i, "");
  }
  return s.replace(/\s{2,}/g, " ").trim();
}

/** Short card title: first clause of an Amazon title, max ~70 chars. */
export function shortTitle(title = "") {
  const first = title.split(/\s[|–-]\s|,|\(|\|/)[0].trim();
  const t = first.length >= 18 ? first : title;
  return t.length > 72 ? t.slice(0, 70).trimEnd() + "…" : t;
}

/** Ask Amazon's image CDN for a bigger render of the same image. */
export function largerImage(url, size = 800) {
  return url ? url.replace(/\._SL\d+_\./, `._SL${size}_.`) : url;
}
