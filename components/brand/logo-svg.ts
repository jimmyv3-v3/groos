import { brand } from "@/lib/brand";
import paths from "./logo-paths.json";

/**
 * SVG-data-URI's van het logo voor plekken zonder CSS (ImageResponse in
 * app/icon.tsx, app/apple-icon.tsx, app/beheer/icon.tsx en de OG-afbeelding).
 * Spec 02 §4.11.
 */
const toDataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

type MarkColors = { g?: string; crescent?: string };

/** De twee paden van het beeldmerk: de G en de sikkel. */
function markPaths({ g = brand.colors.foreground, crescent = brand.colors.brand }: MarkColors = {}) {
  return `<path fill="${g}" d="${paths.mark.g}"/><path fill="${crescent}" d="${paths.mark.crescent}"/>`;
}

const ratio = (viewBox: string) => {
  const [, , w, h] = viewBox.split(" ").map(Number);
  return w / h;
};

/** Tegel: kobalt vlak met het witte beeldmerk; rx 0 voor de apple-icon (iOS rondt zelf af). */
export function tileDataUri({ rounded = true }: { rounded?: boolean } = {}) {
  const rx = rounded ? paths.tile.rx : 0;
  const white = brand.colors.background;
  return toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${paths.tile.viewBox}" width="48" height="48"><rect width="48" height="48" rx="${rx}" fill="${brand.colors.brand}"/><g transform="${paths.tile.mark}">${markPaths({ g: white, crescent: white })}</g></svg>`,
  );
}

/** Logo in kleur: beeldmerk links, woordmerk rechts, zonder beschrijver. */
export function logoDataUri() {
  const box = paths.horizontal.wordmark;
  return toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.viewBox}"><g transform="${box.mark}">${markPaths()}</g><g transform="${box.text}"><g transform="${paths.wordmark.transform}"><path fill="${brand.colors.foreground}" d="${paths.wordmark.grs}"/><path fill="${brand.colors.brand}" d="${paths.wordmark.oo}"/></g></g></svg>`,
  );
}

/** Los beeldmerk; standaard de G in nacht en de sikkel in kobalt. */
export function markDataUri(colors?: MarkColors) {
  return toDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${paths.mark.viewBox}">${markPaths(colors)}</svg>`);
}

/** Breedte gedeeld door hoogte van het logo uit logoDataUri(). */
export const logoRatio = ratio(paths.horizontal.wordmark.viewBox);

/** Breedte gedeeld door hoogte van het losse beeldmerk. */
export const markRatio = ratio(paths.mark.viewBox);
