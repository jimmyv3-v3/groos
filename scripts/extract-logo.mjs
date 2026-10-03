// Haalt de paden en de opbouw van het logo uit de bronbestanden in
// docs/specs/assets/logo/ (logo-mark.svg, logo-horizontaal.svg,
// logo-gestapeld.svg en icoon.svg) en schrijft components/brand/logo-paths.json.
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
const d = (svg, id) => need(svg.match(new RegExp(`<path id="${id}"[^>]* d="([^"]+)"`))?.[1], `pad ${id}`);
const transform = (svg, id) => need(svg.match(new RegExp(`<g id="${id}" transform="([^"]+)"`))?.[1], `groep ${id}`);
const round = (n) => Math.round(n * 100) / 100;

const mark = read("logo-mark.svg");
const horizontal = read("logo-horizontaal.svg");
const stacked = read("logo-gestapeld.svg");
const icon = read("icoon.svg");

const [, , markW, markH] = viewBox(mark).split(" ").map(Number);
const [, , , lockupH] = viewBox(horizontal).split(" ").map(Number);
const [, , stackedW, stackedH] = viewBox(stacked).split(" ").map(Number);

// Het woordmerk zonder beschrijver is 123.72 bij 36.75 (Instrument Sans 640,
// korps 50). De varianten zonder beschrijver volgen dezelfde regels als de
// bronbestanden: horizontaal is het beeldmerk even hoog als het tekstblok met
// een kwart van die hoogte als tussenruimte; gestapeld vervalt alleen de regel
// van de beschrijver en blijft het beeldmerk boven het midden staan.
const WORD_W = 123.72;
const WORD_H = 36.75;
const scale = WORD_H / markH;
const textX = round(markW * scale + WORD_H * 0.25);
const [, stackedMarkX, stackedMarkRest] = need(
  transform(stacked, "mark").match(/^translate\(([\d.]+) ([^)]+\).*)$/),
  "translate van het gestapelde beeldmerk",
);

const out = {
  source: `${dir}/logo-mark.svg, logo-horizontaal.svg, logo-gestapeld.svg, icoon.svg`,
  mark: { viewBox: viewBox(mark), g: d(mark, "mark-g"), crescent: d(mark, "mark-crescent") },
  wordmark: {
    transform: transform(horizontal, "wordmark"),
    grs: d(horizontal, "wordmark-grs"),
    oo: d(horizontal, "wordmark-oo"),
  },
  descriptor: { transform: transform(horizontal, "descriptor"), d: d(horizontal, "descriptor-text") },
  horizontal: {
    wordmark: { viewBox: `0 0 ${round(textX + WORD_W)} ${WORD_H}`, mark: `scale(${scale})`, text: `translate(${textX} 0)` },
    lockup: { viewBox: viewBox(horizontal), mark: transform(horizontal, "mark"), text: transform(horizontal, "text") },
  },
  stacked: {
    wordmark: {
      viewBox: `0 0 ${WORD_W} ${round(stackedH - (lockupH - WORD_H))}`,
      mark: `translate(${round(Number(stackedMarkX) - (stackedW - WORD_W) / 2)} ${stackedMarkRest}`,
      text: transform(stacked, "text"),
    },
    lockup: { viewBox: viewBox(stacked), mark: transform(stacked, "mark"), text: transform(stacked, "text") },
  },
  tile: {
    viewBox: viewBox(icon),
    rx: Number(need(icon.match(/<rect id="tile"[^>]* rx="([\d.]+)"/)?.[1], "hoekstraal van de tegel")),
    mark: transform(icon, "mark"),
  },
};
writeFileSync(`${root}/components/brand/logo-paths.json`, JSON.stringify(out, null, 2) + "\n");
console.log(
  "logo-paths.json geschreven",
  Object.fromEntries(Object.entries(out).map(([k, v]) => [k, typeof v === "string" ? v : Object.keys(v)])),
);
