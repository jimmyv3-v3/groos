/**
 * Merkwaarden voor plekken waar CSS-variabelen niet werken: de OG-afbeelding,
 * het favicon, de apple-icon en de browser-themakleur. Houd de kleuren gelijk
 * aan de tokens in app/globals.css.
 */
export const brand = {
  /** Tekst in het tijdelijke beeldmerk en favicon, tot het echte logo er is. */
  initials: "TB", // TODO
  /** Regel onder de naam in het woordmerk, bijvoorbeeld de activiteit + "B.V.". */
  descriptor: "TODO DESCRIPTOR B.V.",
  colors: {
    background: "#ffffff", // TODO: gelijk aan --background
    foreground: "#0a0a0a", // TODO: gelijk aan --foreground
    muted: "#737373", // TODO: gelijk aan --muted-foreground
    accent: "#171717", // TODO: gelijk aan --brand
  },
} as const;
