import { brand } from "@/lib/brand";
import paths from "./logo-paths.json";

/**
 * SVG-data-URI's van het logo voor plekken zonder CSS (ImageResponse in
 * app/icon.tsx, app/apple-icon.tsx en de OG-afbeelding). Spec 02 §4.11.
 */
const toDataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

/** Tegel: kobalt vlak met witte "oo"; rx 0 voor de apple-icon (iOS rondt zelf af). */
export function tileDataUri({ rounded = true }: { rounded?: boolean } = {}) {
  const rx = rounded ? paths.tile.rx : 0;
  return toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${paths.tile.viewBox}" width="48" height="48"><rect width="48" height="48" rx="${rx}" fill="${brand.colors.brand}"/><path transform="${paths.tile.transform}" d="${paths.tile.oo}" fill="${brand.colors.background}"/></svg>`,
  );
}

/** Woordmerk in kleur. */
export function wordmarkDataUri() {
  return toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${paths.wordmark.viewBox}"><g transform="${paths.wordmark.transform}"><path fill="${brand.colors.foreground}" d="${paths.wordmark.grs}"/><path fill="${brand.colors.brand}" d="${paths.wordmark.oo}"/></g></svg>`,
  );
}

/** Losse "oo" in kobalt. */
export function markDataUri() {
  return toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${paths.mark.viewBox}"><path transform="${paths.mark.transform}" d="${paths.mark.oo}" fill="${brand.colors.brand}"/></svg>`,
  );
}

export const wordmarkRatio = (() => {
  const [, , w, h] = paths.wordmark.viewBox.split(" ").map(Number);
  return w / h;
})();
