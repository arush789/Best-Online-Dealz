// BODZ Score: a 0-100 rating of how good a deal is right now.
//
// It uses only what the Amazon API returns for the live listing:
//   - discount off M.R.P. (up to 70 points, capped at 80% off)
//   - rupees saved, on a log scale (up to 30 points, full marks at ₹10,000)
// Discounts of 80%+ are unusual, so those scores are capped below the top grade
// and get a gentle note on the deal page.
// It does not use price history. The /how-we-pick page explains this in plain
// words, so keep both in sync if the formula changes.

export const SUSPECT_PCT = 80;
export const SUSPECT_CAP = 69; // keeps these at grade A (Great value) at most

// Shown to shoppers as a letter grade, not a raw number.
export const TIERS = [
  { min: 70, key: "top", grade: "A+", label: "Top value" },
  { min: 50, key: "great", grade: "A", label: "Great value" },
  { min: 30, key: "good", grade: "B", label: "Good value" },
  { min: 0, key: "fair", grade: "C", label: "Fair price" },
];

export function scoreParts(item) {
  const pct = Math.max(0, Math.min(item?.pct || 0, 80));
  const save = Math.max(0, item?.save || 0);
  const discount = (pct / 80) * 70;
  const savings = Math.min(Math.log10(save + 1) / 4, 1) * 30;
  const suspect = (item?.pct || 0) >= SUSPECT_PCT;
  const raw = Math.round(discount) + Math.round(savings);
  return {
    discount: Math.round(discount),
    savings: Math.round(savings),
    suspect,
    capped: suspect && raw > SUSPECT_CAP,
    total: suspect ? Math.min(raw, SUSPECT_CAP) : raw,
  };
}

export function dealScore(item) {
  if (!item || item.price == null) return null;
  return scoreParts(item).total;
}

export function tierFor(score) {
  if (score == null) return null;
  return TIERS.find((t) => score >= t.min);
}
