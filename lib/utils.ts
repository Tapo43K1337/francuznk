/** Lightweight className joiner (truthy values only). */
export function cn(
  ...inputs: Array<string | false | null | undefined>
): string {
  return inputs.filter(Boolean).join(" ");
}

/** Format a price in Ukrainian hryvnia. */
export function formatPrice(value: number, currency = "₴"): string {
  const rounded = Number.isInteger(value) ? value : Math.round(value);
  return `${rounded} ${currency}`;
}

/** Clamp a number between min and max. */
export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

/** Linear interpolation. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
