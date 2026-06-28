import type { Menu, MenuCategory, MenuItem, MenuProduct } from "@/types/menu";
import { seedMenu } from "./menu.seed";
import generated from "./menu.generated.json";

/**
 * Single source of truth for menu data consumed by the app (RSC, build time).
 * The scraper (scripts/scrape-menu.ts + normalize-menu.ts) overwrites
 * data/menu.generated.json with live data from menu.ps.me. Until then (or if a
 * pull yields nothing) we transparently fall back to the curated seed so the
 * build never breaks and the UI always has realistic content.
 */
const live = generated as unknown as Menu;

export const MENU: Menu =
  live && Array.isArray(live.categories) && live.categories.length > 0
    ? live
    : seedMenu;

// Hide packaging junk and any product without a photo, then drop empty cats.
const JUNK_CAT_KEYWORDS = ["упаковка"];
const JUNK_ITEM_KEYWORDS = [
  "пакет",
  "упаковка",
  "тара",
  "стакан",
  "кришка",
  "трубочк",
];
const isJunkItem = (name: string) => {
  const n = name.toLowerCase();
  return JUNK_ITEM_KEYWORDS.some((k) => n.includes(k));
};

// Items pulled with a wrong/mismatched photo — hidden until the source is fixed.
// 301 = Шейк "Чорничний йогурт" (scraped image shows a cake, not a shake).
const HIDDEN_ITEM_IDS = new Set(["301"]);

export const CATEGORIES = MENU.categories
  .filter(
    (c) => !JUNK_CAT_KEYWORDS.some((k) => c.name.toLowerCase().includes(k))
  )
  .map((c) => ({
    ...c,
    items: c.items.filter(
      (i) => i.image && !isJunkItem(i.name) && !HIDDEN_ITEM_IDS.has(i.id)
    ),
  }))
  .filter((c) => c.items.length > 0);

export const ALL_ITEMS = CATEGORIES.flatMap((c) => c.items);

/**
 * Collapse same-product size variants (… 250 мл / 340 мл / 450 мл) into one
 * MenuProduct so the menu shows a single card with a size selector. Items
 * without a "мл" size, or whose base name is unique, stay as single-variant
 * products (selector hidden). Order is preserved.
 */
// volume (мл/л) for drinks and weight (г) for food, e.g. "250 мл", "350г".
// `\b` is ASCII-only and fails after Cyrillic letters, so we use a lookahead
// that forbids a following Cyrillic letter (keeps "350 грн" from reading as г).
const SIZE_RE = /(\d+)\s*(мл|г|л)(?![а-яіїєґʼ'])/i;

function parseSize(name: string): { base: string; ml: number | null; label: string | null } {
  const m = name.match(SIZE_RE);
  if (!m) return { base: name.trim(), ml: null, label: null };
  const ml = parseInt(m[1], 10);
  const unit = m[2].toLowerCase();
  const base = name
    .replace(m[0], "")
    .replace(/\s{2,}/g, " ")
    .replace(/[\s,.–-]+$/u, "")
    .trim();
  return { base: base || name.trim(), ml, label: `${ml} ${unit}` };
}

export function groupItemsBySize(items: MenuItem[]): MenuProduct[] {
  const order: string[] = [];
  const groups = new Map<string, { base: MenuItem; ml: number; label: string }[]>();

  items.forEach((it) => {
    const { base, ml, label } = parseSize(it.name);
    // only merge items that carry a мл size; everything else is its own group
    const key = ml !== null ? `g:${it.categoryId}:${base.toLowerCase()}` : `s:${it.id}`;
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
    }
    groups.get(key)!.push({ base: it, ml: ml ?? 0, label: label ?? "" });
  });

  return order.map((key) => {
    const entries = groups.get(key)!;
    const multi = entries.length > 1;
    if (multi) entries.sort((a, b) => a.ml - b.ml);
    const head = entries[0].base;
    const baseName = multi ? parseSize(head.name).base : head.name;

    const variants = entries.map((e) => ({
      id: e.base.id,
      ml: e.ml,
      sizeLabel: e.label,
      price: e.base.price,
      priceAlt: e.base.priceAlt,
    }));

    return {
      key,
      name: baseName,
      description: head.description,
      composition: head.composition,
      currency: head.currency,
      image: head.image,
      categoryId: head.categoryId,
      popular: entries.some((e) => e.base.popular),
      variants,
    } satisfies MenuProduct;
  });
}

export const POPULAR_ITEMS = ALL_ITEMS.filter((i) => i.popular);

const FOOD_CATEGORY_KEYWORDS = [
  "сніданк",
  "круасан",
  "тістечко",
  "кондитер",
  "піца",
  "десерт",
  "чизкейк",
  "торт",
  "еклер",
  "гамбург",
  "галета",
];

const FOOD_ITEMS = CATEGORIES.filter((c) =>
  FOOD_CATEGORY_KEYWORDS.some((k) => c.name.toLowerCase().includes(k))
).flatMap((c) => c.items.filter((i) => i.image));

function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((i) => (seen.has(i.id) ? false : (seen.add(i.id), true)));
}

/** Collapse near-duplicates like Кекс "Лимонний" / …цілий and size variants. */
function normName(n: string) {
  return n
    .toLowerCase()
    .replace(/["'«»]/g, "")
    .replace(/\d+[.,]?\d*\s*(мл|л|г|кг|шт|порц)?/g, "")
    .replace(/\b(цілий|цілого|шматок|великий|малий|велика|мала)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
function dedupeByName<T extends { name: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((i) => {
    const k = normName(i.name);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** Curated mix of popular drinks + food for the "Гості обирають" section. */
export const FEATURED = dedupeByName(
  dedupeById([...POPULAR_ITEMS.filter((i) => i.image), ...FOOD_ITEMS])
).slice(0, 8);

// ---- Food / drink grouping for the unified menu ----
const DRINK_KEYWORDS = [
  "кава",
  "напо",
  "фреш",
  "лимонад",
  "чай",
  "матч",
  "коктейль",
  "bubble",
  "смузі",
  "шейк",
  "вода",
  "сік",
  "сок",
  "енерг",
  "какао",
  "раф",
  "лате",
  "капуч",
  "еспресо",
  "тонік",
  "tonic",
];

const isPopularCat = (c: MenuCategory) =>
  c.slug === "popular" || c.name.toLowerCase().includes("популярне");
const isDrinkCat = (c: MenuCategory) => {
  const n = c.name.toLowerCase();
  return DRINK_KEYWORDS.some((k) => n.includes(k));
};

const menuCats = CATEGORIES.filter((c) => !isPopularCat(c));

export const DRINK_CATEGORIES = menuCats.filter(isDrinkCat);

// ---- Кухня: collapse 28 scraped categories (many with a single item) into a
// handful of broad, sensibly named sections. Each source category maps to one
// bucket; unmapped ones are appended untouched so nothing is ever lost. ----
const FOOD_BUCKET_OF: Record<string, string> = {
  "Сніданки": "Сніданки",
  "Салати": "Салати",
  "Перші страви": "Гарячі страви",
  "Другі страви": "Гарячі страви",
  "Піца": "Піца",
  "Гамбургери": "Бургери та сендвічі",
  "Хот-Дог": "Бургери та сендвічі",
  "Тортильї": "Бургери та сендвічі",
  "Бутербродна група": "Бургери та сендвічі",
  "Чіабата": "Бургери та сендвічі",
  "Круасани ситні": "Круасани та випічка",
  "Круасани солодкі": "Круасани та випічка",
  "Тістечко": "Тістечка",
  "Капкейк": "Тістечка",
  "Еклери": "Тістечка",
  "Тарт": "Тістечка",
  "Трайфл": "Тістечка",
  "Чизкейк": "Чизкейки",
  "Торт": "Торти",
  "Желе": "Десерти",
  "Меренговий рулет": "Десерти",
  "Пряник": "Десерти",
  "Інші вироби": "Десерти",
  "Кондитерські вироби": "Десерти",
  "Паска": "Десерти",
  "Морозиво": "Морозиво",
  "ДОП": "Додатки",
};

const FOOD_BUCKET_ORDER = [
  "Сніданки",
  "Салати",
  "Гарячі страви",
  "Піца",
  "Бургери та сендвічі",
  "Круасани та випічка",
  "Тістечка",
  "Чизкейки",
  "Торти",
  "Десерти",
  "Морозиво",
  "Додатки",
];

function reBucketFood(cats: MenuCategory[]): MenuCategory[] {
  const byBucket = new Map<string, MenuItem[]>();
  const extra: MenuCategory[] = [];
  for (const c of cats) {
    const bucket = FOOD_BUCKET_OF[c.name.trim()];
    if (!bucket) {
      extra.push(c);
      continue;
    }
    if (!byBucket.has(bucket)) byBucket.set(bucket, []);
    byBucket.get(bucket)!.push(...c.items);
  }
  const ordered: MenuCategory[] = [];
  FOOD_BUCKET_ORDER.forEach((name, i) => {
    const items = byBucket.get(name);
    if (!items || items.length === 0) return;
    ordered.push({
      id: `food-b${i}`,
      name,
      slug: `food-b${i}`,
      order: i,
      items: dedupeById(items),
    });
  });
  return [...ordered, ...extra];
}

export const FOOD_CATEGORIES = reBucketFood(
  menuCats.filter((c) => !isDrinkCat(c))
);

export const MENU_GROUPS: {
  id: "drink" | "food";
  label: string;
  categories: MenuCategory[];
}[] = [
  { id: "drink", label: "Напої", categories: DRINK_CATEGORIES },
  { id: "food", label: "Кухня", categories: FOOD_CATEGORIES },
];
