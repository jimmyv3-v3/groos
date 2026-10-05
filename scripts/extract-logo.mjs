// Haalt de paden en de opbouw van het logo uit de bronbestanden in
// docs/specs/assets/logo/ (logo-mark.svg, logo-mark-klein.svg,
// logo-horizontaal.svg, logo-gestapeld.svg en icoon.svg) en schrijft
// components/brand/logo-paths.json.
// Gebruik: node scripts/extract-logo.mjs
import { readFileSync, writeFileSync } from "node:fs";

const root = process.argv[2] ?? ".";
const dir = "docs/specs/assets/logo";
const read = (file) => readFileSync(`${root}/${dir}/${file}`, "utf8");
const need = (value, what) => {
  if (value == null) throw new Error(`${what} niet gevonden in de bronbestanden`);
  return value;
};
const viewBox = (svg) => need(svg.match(/viewBox="([^"]+)"/)?.[1], "viewBox");
const attr = (svg, name) => need(svg.match(new RegExp(` ${name}="([^"]+)"`))?.[1], `attribuut ${name}`);
const d = (svg, id) => need(svg.match(new RegExp(`<path id="${id}"[^>]* d="([^"]+)"`))?.[1], `pad ${id}`);
const transform = (svg, id) => need(svg.match(new RegExp(`<g id="${id}" transform="([^"]+)"`))?.[1], `groep ${id}`);

const mark = read("logo-mark.svg");
const markSmall = read("logo-mark-klein.svg");
const horizontal = read("logo-horizontaal.svg");
const stacked = read("logo-gestapeld.svg");
const icon = read("icoon.svg");

// Het beeldmerk is de hoofdletter G van het woord: het logo leest als G + "roos".
//
// Raster. Het logo is ontworpen op een beeldmerkhoogte van 38 px; één pixel is
// dan 100/38 = 2,63 eenheden. Op die maat (en op veelvouden ervan) vallen alle
// rechte randen op hele pixels:
// - logo-mark-klein.svg is de optische versie voor alles onder ongeveer 48 px
//   beeldmerkhoogte (header, footer, tegel, favicon). De balken van de G zijn
//   6, 5 en 7 px hoog, de stam is 7 px breed, de punten zijn stomp en de sikkel
//   staat op 90 procent, zodat de tussenruimtes minstens 2 px zijn (in het
//   beeldmerk één op één 3,4 tot 4,6 eenheden, dus 1,3 tot 1,7 px).
// - De letters "roos" staan in Onest 575 op de basislijn van het beeldmerk:
//   x-hoogte 27 px (verhouding 1,41 tot het beeldmerk, zoals een hoofdletter
//   naast kleine letters), stam 6 px, 2 px wit tussen het beeldmerk en de r.
// - De beschrijver staat in Onest 500 met een kapitaalhoogte van 10 px, de
//   basislijn op 53 px, uitgevuld over de breedte van het woord.
//
// Marge. Elk kader heeft 2 px (5,26 eenheden, ruim 5 procent van de hoogte)
// vrije ruimte links, rechts en boven en 3 px onder, zodat de randen van het
// logo nooit op de rand van het kader vallen en niet worden afgesneden. De
// maten in px (data-size) zijn breedte, hoogte zonder en hoogte met beschrijver
// op de referentiemaat: 143 bij 43 en 143 bij 58.
//
// logo-horizontaal.svg en logo-gestapeld.svg dragen het beeldmerk één op één;
// de tekst staat daar 1,07 eenheid naar rechts, omdat de stam van de G in de
// optische versie op het raster is gezet. Het gestapelde bestand is dezelfde
// opbouw met 16 eenheden extra vrije ruimte rondom.
const [boxW, wordH, lockupH] = attr(horizontal, "data-size").split(" ").map(Number);
const clear = Number(attr(stacked, "data-clear"));
const grow = (box) => {
  const [x, y, w, h] = box.split(" ").map(Number);
  const round = (n) => Math.round(n * 100) / 100;
  return `${round(x - clear)} ${round(y - clear)} ${round(w + 2 * clear)} ${round(h + 2 * clear)}`;
};
const wordBox = attr(horizontal, "data-wordmark-box");
const [tileSize] = viewBox(icon).split(" ").slice(2).map(Number);
const markBox = viewBox(mark).split(" ").map(Number);
const px = wordH / Number(wordBox.split(" ")[3]);

const out = {
  source: `${dir}/logo-mark.svg, logo-mark-klein.svg, logo-horizontaal.svg, logo-gestapeld.svg, icoon.svg`,
  mark: {
    viewBox: viewBox(mark),
    width: Math.round(markBox[2] * px),
    height: Math.round(markBox[3] * px),
    g: d(mark, "mark-g"),
    crescent: d(mark, "mark-crescent"),
  },
  markSmall: { viewBox: viewBox(markSmall), g: d(markSmall, "mark-g"), crescent: d(markSmall, "mark-crescent") },
  wordmark: { transform: transform(horizontal, "wordmark"), roos: d(horizontal, "wordmark-roos") },
  descriptor: { transform: transform(horizontal, "descriptor"), d: d(horizontal, "descriptor-text") },
  // Verschuiving van het tekstblok bij het beeldmerk één op één; de optische versie heeft geen verschuiving.
  text: { optical: "translate(0 0)", master: transform(horizontal, "text") },
  horizontal: {
    wordmark: { viewBox: wordBox, width: boxW, height: wordH },
    lockup: { viewBox: viewBox(horizontal), width: boxW, height: lockupH },
  },
  stacked: {
    wordmark: { viewBox: grow(wordBox), width: Math.round(boxW + 2 * clear * px), height: Math.round(wordH + 2 * clear * px) },
    lockup: { viewBox: viewBox(stacked), width: Math.round(boxW + 2 * clear * px), height: Math.round(lockupH + 2 * clear * px) },
  },
  tile: {
    viewBox: viewBox(icon),
    size: tileSize,
    rx: Number(need(icon.match(/<rect id="tile"[^>]* rx="([\d.]+)"/)?.[1], "hoekstraal van de tegel")),
    mark: transform(icon, "mark"),
  },
};
writeFileSync(`${root}/components/brand/logo-paths.json`, JSON.stringify(out, null, 2) + "\n");
console.log(
  "logo-paths.json geschreven",
  Object.fromEntries(Object.entries(out).map(([k, v]) => [k, typeof v === "string" ? v : Object.keys(v)])),
);
