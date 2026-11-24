// BODZ Score: a 0-100 rating of how good a deal is right now.
//
// It uses only what the Amazon API returns for the live listing:
//   - discount off M.R.P. (up to 70 points, capped at 80% off)
//   - rupees saved, on a log scale (up to 30 points, full marks at ₹10,000)
// Discounts of 80%+ usually mean an inflated M.R.P., so those scores are capped
// at 80 and flagged.
// It does not use price history. The /how-we-pick page explains this in plain
// words, so keep both in sync if the formula changes.

export const SUSPECT_PCT = 80;
export const SUSPECT_CAP = 80;

export const TIERS = [
  { min: 70, key: "steal", label: "Steal" },
  { min: 50, key: "great", label: "Great deal" },
  { min: 30, key: "good", label: "Good deal" },
  { min: 0, key: "fair", label: "Fair price" },
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
