import { brand } from "@/lib/brand";
import paths from "./logo-paths.json";

/**
 * SVG-data-URI's van het logo voor plekken zonder CSS (ImageResponse in
 * app/icon.tsx, app/apple-icon.tsx, app/beheer/icon.tsx en de OG-afbeelding).
 * Spec 02 §4.11. `optical` kiest de optische versie van het beeldmerk voor
 * kleine maten (onder ongeveer 48 px beeldmerkhoogte); zonder is het het
 * beeldmerk één op één. Elk kader heeft een marge, zodat geen rand wordt
 * afgesneden.
 */
const toDataUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

type MarkColors = { g?: string; crescent?: string; optical?: boolean };

/** De twee paden van het beeldmerk: de G en de sikkel. */
function markPaths({ g = brand.colors.foreground, crescent = brand.colors.brand, optical = false }: MarkColors = {}) {
  const mark = optical ? paths.markSmall : paths.mark;
  return `<path fill="${g}" d="${mark.g}"/><path fill="${crescent}" d="${mark.crescent}"/>`;
}

const ratio = (viewBox: string) => {
  const [, , w, h] = viewBox.split(" ").map(Number);
  return w / h;
};

/**
 * Tegel van 64: kobalt vlak met het witte beeldmerk van 34 bij 38 (59 procent
 * van de hoogte, op hele pixels); rx 0 voor de apple-icon (iOS rondt zelf af).
 * Standaard de optische versie, want een tegel staat bijna altijd klein.
 */
export function tileDataUri({ rounded = true, optical = true }: { rounded?: boolean; optical?: boolean } = {}) {
  const { size, viewBox, mark } = paths.tile;
  const rx = rounded ? paths.tile.rx : 0;
  const white = brand.colors.background;
  return toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${size}" height="${size}" shape-rendering="geometricPrecision"><rect width="${size}" height="${size}" rx="${rx}" fill="${brand.colors.brand}"/><g transform="${mark}">${markPaths({ g: white, crescent: white, optical })}</g></svg>`,
  );
}

/** Logo in kleur: het beeldmerk als G met "roos" erachter, zonder beschrijver. */
export function logoDataUri({ optical = false }: { optical?: boolean } = {}) {
  const box = paths.horizontal.wordmark;
  const text = optical ? paths.text.optical : paths.text.master;
  return toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.viewBox}" shape-rendering="geometricPrecision">${markPaths({ optical })}<g transform="${text}"><g transform="${paths.wordmark.transform}"><path fill="${brand.colors.foreground}" d="${paths.wordmark.roos}"/></g></g></svg>`,
  );
}

/** Los beeldmerk; standaard de G in nacht en de sikkel in kobalt. */
export function markDataUri(colors?: MarkColors) {
  return toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${paths.mark.viewBox}" shape-rendering="geometricPrecision">${markPaths(colors)}</svg>`,
  );
}

/** Breedte gedeeld door hoogte van het kader van logoDataUri(), inclusief de marge. */
export const logoRatio = ratio(paths.horizontal.wordmark.viewBox);

/** Breedte gedeeld door hoogte van het kader van het losse beeldmerk, inclusief de marge. */
export const markRatio = ratio(paths.mark.viewBox);
