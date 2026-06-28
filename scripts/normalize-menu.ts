/**
 * Normalizes data/menu.raw.json (Poster shape) into our typed Menu and writes
 * data/menu.generated.json, which the app consumes via data/menu.ts.
 *
 * Run: npm run menu:normalize  (or npm run menu:pull to scrape + normalize)
 */
import fs from "node:fs";
import path from "node:path";
import type { Menu, MenuCategory, MenuItem } from "../types/menu";

const DATA_DIR = path.join(process.cwd(), "data");
const RAW = path.join(DATA_DIR, "menu.raw.json");
const OUT = path.join(DATA_DIR, "menu.generated.json");

type RawItem = {
  name: string;
  productId: number;
  description: string | null;
  categoryPosId: string | null;
  categoryName: string | null;
  categoryUrl: string | null;
  photo: string | null;
  price: number | string | null;
  tags?: { name: string }[];
  isWeight?: boolean;
};

const stripHtml = (s: string) =>
  s
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toNumber = (v: RawItem["price"]): number => {
  if (typeof v === "number") return v;
  if (typeof v === "string") return Math.round(parseFloat(v.replace(",", ".")));
  return 0;
};

function main() {
  if (!fs.existsSync(RAW)) {
    console.error("data/menu.raw.json not found — run npm run menu:scrape first.");
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(RAW, "utf8")) as RawItem[];

  const order: string[] = [];
  const byId = new Map<string, MenuCategory>();

  for (const it of raw) {
    if (!it?.name) continue;
    const price = toNumber(it.price);

    const catId =
      it.categoryUrl ||
      it.categoryPosId ||
      (it.categoryName ?? "other").toLowerCase();
    const catName = it.categoryName ?? "Інше";

    if (!byId.has(catId)) {
      order.push(catId);
      byId.set(catId, {
        id: catId,
        name: catName,
        slug: catId,
        order: order.length,
        items: [],
      });
    }

    const popular =
      it.categoryPosId === "popular" ||
      (it.tags ?? []).some((t) => t.name?.toLowerCase() === "popular");

    const item: MenuItem = {
      id: String(it.productId),
      name: it.name.trim(),
      description: it.description ? stripHtml(it.description) || undefined : undefined,
      price,
      currency: "₴",
      image: it.photo || undefined,
      categoryId: catId,
      popular,
    };

    byId.get(catId)!.items.push(item);
  }

  // Drop empty categories, keep insertion order.
  const categories = order
    .map((id) => byId.get(id)!)
    .filter((c) => c.items.length > 0);

  const menu: Menu = {
    categories,
    currency: "₴",
    source: "scraped",
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(OUT, JSON.stringify(menu, null, 2), "utf8");

  const total = categories.reduce((n, c) => n + c.items.length, 0);
  console.log(`Wrote ${OUT}`);
  console.log(`${categories.length} categories, ${total} items:`);
  for (const c of categories) console.log(`  ${c.items.length.toString().padStart(3)}  ${c.name}`);
}

main();
