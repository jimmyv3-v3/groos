import { brand } from "@/lib/brand";

/** Kleuren en maten van de mails, uit lib/brand.ts (spec 11 §4.13). */
export const emailTheme = {
  color: {
    page: brand.colors.ice,
    card: brand.colors.background,
    text: brand.colors.foreground,
    muted: brand.colors.muted,
    brand: brand.colors.brand,
    brandStrong: brand.colors.brandStrong,
    tint: brand.colors.brandTint,
    border: brand.colors.border,
    onBrand: brand.colors.background,
  },
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  size: { body: 16, small: 13, h1: 24, h2: 17 },
  lineHeight: { body: 1.55, heading: 1.3 },
  width: 600,
} as const;
