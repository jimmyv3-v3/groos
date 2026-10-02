/**
 * Merkwaarden voor plekken waar CSS-variabelen niet werken: OG-afbeelding,
 * favicon, apple-icon, e-mail en themakleur. Houd de hexwaarden gelijk aan
 * app/globals.css; scripts/check-contrast.mjs controleert dat.
 */
export const brand = {
  wordmark: "groos",
  descriptor: "Personeelsdiensten",
  colors: {
    background: "#FFFFFF",
    foreground: "#0B0F2E",
    muted: "#4B5170",
    accent: "#2741C9",
    brand: "#2741C9",
    brandStrong: "#1C2F9E",
    brandTint: "#EEF1FD",
    brandSubtle: "#7C8AE0",
    onBrandMuted: "#DCE1FF",
    ice: "#F5F6FA",
    border: "#E3E6EF",
    input: "#8A90AA",
    success: "#16794A",
    warning: "#B45309",
    danger: "#C02B2B",
    info: "#0E6F8C",
  },
} as const;

export type BrandColor = keyof typeof brand.colors;
