// Category map for the BODZ catalog.
//
// The products table only has a category for ~25% of rows (set by the admin
// panel from Amazon browse nodes). Everything else is classified here from the
// product name, so every deal lands on a browsable shelf.
//
// Order matters: the first rule whose pattern matches wins. Specific shelves
// (smartwatches, kitchen) sit above broad ones (watches, home, bags).

export const CATEGORIES = [
  {
    slug: "tvs",
    name: "TVs & Projectors",
    emoji: "📺",
    db: ["Smart TVs"],
    match: /\b(smart tv|google tv|android tv|led tv|qled|oled|\btv\b|television|projector|fire ?stick)/i,
  },
  {
    slug: "computers",
    name: "Laptops & Computers",
    emoji: "💻",
    db: ["Laptops"],
    match: /\b(laptop|notebook|monitor|keyboard|mouse|router|wi-?fi mesh|ssd|hard drive|hard disk|pen ?drive|printer|webcam|hdmi|usb hub|travel hub|graphics card|gamepad|dslr|mirrorless|gaming|\d+(\.\d+)?[ -]?inch.*\b(fhd|full hd|qhd)\b)/i,
  },
  {
    slug: "phones-tablets",
    name: "Phones & Tablets",
    emoji: "📱",
    db: ["Smartphones"],
    match: /\b(smart ?phones?|iphone|galaxy [amsz]\d|redmi|realme|poco|vivo|oppo|motorola|nord|iqoo|\b5g\b|\d+ ?gb ram|tablet|ipad|galaxy tab|oneplus pad|\btab \w*\d)/i,
  },
  {
    slug: "smartwatches",
    name: "Smartwatches",
    emoji: "⌚",
    db: ["Smart Watches"],
    match: /\b(smart ?watch|fitness band|smart ring)/i,
  },
  {
    slug: "audio",
    name: "Audio",
    emoji: "🎧",
    db: ["In-Ear Headphones", "Speakers"],
    match: /\b(ear ?buds|airdopes|tws|head ?phones?|ear ?phones?|neckband|speakers?|sound ?bar|microphone|\bmic\b|home theat(er|re)|buds)\b/i,
  },
  {
    slug: "cooling",
    name: "ACs & Coolers",
    emoji: "❄️",
    db: [],
    match: /\b(split ac|window ac|inverter ac|\bac\b|\d(\.\d+)? ?ton\b|air cooler|desert cooler|personal cooler|tower cooler)/i,
  },
  {
    slug: "fans",
    name: "Fans",
    emoji: "🌀",
    db: ["Ceiling Fans"],
    match: /\b(fan|bldc)\b/i,
  },
  {
    slug: "power",
    name: "Chargers & Power",
    emoji: "🔋",
    db: ["Power Banks"],
    match: /\b(power ?bank|charger|charging|cable|adapter|inverter battery|ups\b|extension (board|cord)|surge)/i,
  },
  {
    slug: "kitchen",
    name: "Kitchen & Dining",
    emoji: "🍳",
    db: ["Kitchen appliances", "Mixer Grinders"],
    match: /\b(air ?fryer|mixer|grinder|juicer|kettle|cookware|casserole|induction|cooker|lunch ?box|bottle|flask|tawa|kadai|frying pan|kitchen|chopper|toaster|sandwich maker|oven|otg|blender|dinner set|storage jar|container|tiffin|knife|scissor|chimney|hob|gas stove)/i,
  },
  {
    slug: "appliances",
    name: "Home Appliances",
    emoji: "🏠",
    db: [],
    match: /\b(refrigerator|fridge|washing machine|washer|water heater|geyser|dishwasher|water purifier|aquaguard|purifier|vacuum|humidifier|room heater|heater|iron\b|steamer|water dispenser|dryer\b)/i,
  },
  {
    slug: "beauty",
    name: "Beauty & Grooming",
    emoji: "💄",
    db: ["Perfume", "Trimmers & Shavers"],
    match: /\b(trimmer|shaver|groom|hair ?dryer|straightener|sunscreen|shampoo|conditioner|lotion|face ?wash|serum|kajal|lipstick|makeup|perfume|deo|eau de|parfum|toothbrush|cream|soap|body wash|hair oil|epilator|moisturi[sz]er|toner|hand ?wash|face)/i,
  },
  {
    slug: "health",
    name: "Health & Fitness",
    emoji: "🏋️",
    db: [],
    match: /\b(massager|heating (belt|pad)|weighing scale|fitness|yoga|dumbbell|treadmill|bp monitor|oximeter|thermometer|protein|gym|blood pressure|pull ?up bar|cushion)/i,
  },
  {
    slug: "bags",
    name: "Luggage & Bags",
    emoji: "🧳",
    db: ["Backpacks"],
    match: /\b(trolley|luggage|suitcase|duffle|backpack|bag)\b/i,
  },
  {
    slug: "fashion",
    name: "Fashion & Watches",
    emoji: "👟",
    db: [],
    match: /\b(shoes?|sneakers?|sandals?|slippers?|t-?shirt|shirt|jeans|pants|trousers?|kurta|saree|dress|jacket|hoodie|wallet|sunglasses|watch|pendant|gold|silver|ring|jewell?ery|earrings?|casio|fastrack|titan)\b/i,
  },
  {
    slug: "toys",
    name: "Toys & Kids",
    emoji: "🧸",
    db: [],
    match: /\b(toy|hot wheels|rc\b|remote control|drone|potty|baby|kids|lego|puzzle|foosball|board game|nerf|blaster)/i,
  },
  {
    slug: "auto",
    name: "Auto & Bikes",
    emoji: "🛵",
    db: [],
    match: /\b(car|dash ?cam|tyre|tire|helmet|scooter|bike|cycle|motocorp|inflator)\b/i,
  },
  {
    slug: "home",
    name: "Home & Furniture",
    emoji: "🛋️",
    db: [],
    match: /\b(mattress|wardrobe|table|chair|desk|bed|sofa|shelf|rack|cupboard|organi[sz]er|lamp|bulb|light|curtain|bedsheet|pillow|ladder|bathroom|storage|almirah|camera|cctv|smart plug|lock|comforter|mop|duster|tent|blanket|towel|cleaning|drill|tool ?kit|screwdriver)\b/i,
  },
];

export const MISC = { slug: "more", name: "More Finds", emoji: "✨", db: [], match: null };

export const ALL_CATEGORIES = [...CATEGORIES, MISC];

const bySlug = Object.fromEntries(ALL_CATEGORIES.map((c) => [c.slug, c]));
const byDb = {};
for (const c of CATEGORIES) for (const d of c.db) byDb[d.toLowerCase()] = c.slug;

export function getCategory(slug) {
  return bySlug[slug] || null;
}

/** Pick a category slug for a catalog row from its DB category, then its name. */
export function classify(name = "", dbCategory = "") {
  const firstDb = (dbCategory || "").split(",")[0].trim().toLowerCase();
  if (firstDb && byDb[firstDb]) return byDb[firstDb];
  for (const c of CATEGORIES) {
    if (c.match.test(name)) return c.slug;
  }
  return MISC.slug;
}
