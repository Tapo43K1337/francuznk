/**
 * Scrapes the live Poster QR-menu (menu.ps.me). The menu is hydrated into the
 * page as <script id="menu-data" type="application/json">…</script>, so we
 * render the page in headless Chromium and read that payload directly.
 *
 * Output (consumed by normalize-menu.ts):
 *   data/menu.raw.json       — the raw Poster menu array
 *   data/menu.settings.json  — account/locale settings
 *   data/menu.sample.json    — first 2 items (for inspection)
 *
 * Run: npm run menu:scrape
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const URL = process.env.MENU_URL ?? "https://menu.ps.me/oaYvSKkeZv0";
const DATA_DIR = path.join(process.cwd(), "data");

async function readJson(page: import("playwright").Page, selector: string) {
  const el = await page.$(selector);
  if (!el) return null;
  const text = await el.textContent();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function main() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ locale: "uk-UA" });

  console.log(`Opening ${URL} …`);
  await page.goto(URL, { waitUntil: "networkidle", timeout: 60_000 });
  await page.waitForSelector("#menu-data", { timeout: 30_000 }).catch(() => {});

  const menu = await readJson(page, "#menu-data");
  const settings = await readJson(page, "#settings-data");

  await browser.close();

  if (!Array.isArray(menu) || menu.length === 0) {
    console.error("Could not read #menu-data. Aborting.");
    process.exit(1);
  }

  fs.writeFileSync(
    path.join(DATA_DIR, "menu.raw.json"),
    JSON.stringify(menu, null, 2),
    "utf8"
  );
  fs.writeFileSync(
    path.join(DATA_DIR, "menu.settings.json"),
    JSON.stringify(settings, null, 2),
    "utf8"
  );
  fs.writeFileSync(
    path.join(DATA_DIR, "menu.sample.json"),
    JSON.stringify(menu.slice(0, 2), null, 2),
    "utf8"
  );

  const keys = new Set<string>();
  for (const item of menu) {
    if (item && typeof item === "object") {
      for (const k of Object.keys(item)) keys.add(k);
    }
  }

  console.log(`\nParsed ${menu.length} menu items.`);
  console.log(`Union of item keys: ${[...keys].sort().join(", ")}`);
  console.log(`Wrote data/menu.raw.json (+ settings, sample).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
