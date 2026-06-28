export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  /** Ingredient / composition line. */
  composition?: string;
  price: number;
  /** Optional second price (e.g. large size). */
  priceAlt?: number;
  currency: string;
  /** Local path under /public or remote URL. */
  image?: string;
  categoryId: string;
  tags?: string[];
  popular?: boolean;
}

/** One size option of a grouped product (e.g. 250 мл / 52 ₴). */
export interface MenuVariant {
  id: string;
  ml: number;
  sizeLabel: string;
  price: number;
  priceAlt?: number;
}

/** A menu item after size-variants are collapsed into one card. Single-size
 *  items become a product with exactly one variant (selector hidden). */
export interface MenuProduct {
  key: string;
  name: string;
  description?: string;
  composition?: string;
  currency: string;
  image?: string;
  categoryId: string;
  popular?: boolean;
  variants: MenuVariant[];
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  order: number;
  items: MenuItem[];
}

export interface Menu {
  categories: MenuCategory[];
  currency: string;
  source: "scraped" | "seed";
  /** ISO timestamp of last data refresh. */
  updatedAt?: string;
}
