// Eenmalig: haalt de paden van concept 3 uit docs/specs/assets/logo/concept-3.svg
// en schrijft components/brand/logo-paths.json. Gebruik: node scripts/extract-logo.mjs
import { readFileSync, writeFileSync } from "node:fs";

const root = process.argv[2] ?? ".";
const svg = readFileSync(`${root}/docs/specs/assets/logo/concept-3.svg`, "utf8");
const group = (id) => svg.match(new RegExp(`<g id="${id}"( transform="([^"]+)")?>([\\s\\S]*?)</g>(?=<g id=|\\n</svg>)`));
const paths = (s) => [...s.matchAll(/<path(?: transform="([^"]+)")? d="([^"]+)"/g)].map((m) => ({ transform: m[1], d: m[2] }));

const word = group("c3-wordmark");
const desc = group("c3-descriptor");
const tile = group("c3-mark-tile");
const mark = group("c3-mark");
const [grs, oo] = paths(word[3]);
const out = {
  source: "docs/specs/assets/logo/concept-3.svg",
  wordmark: { viewBox: "0 0 123.72 36.75", transform: word[2], grs: grs.d, oo: oo.d },
  lockup: { viewBox: "0 0 125.33 52.08", descriptorTransform: desc[2], descriptor: paths(desc[3])[0].d },
  mark: { viewBox: "0 0 48 48", transform: paths(mark[3])[0].transform, oo: paths(mark[3])[0].d },
  tile: { viewBox: "0 0 48 48", rx: 12, transform: paths(tile[3])[0].transform, oo: paths(tile[3])[0].d },
};
writeFileSync(`${root}/components/brand/logo-paths.json`, JSON.stringify(out, null, 2) + "\n");
console.log("logo-paths.json geschreven", Object.fromEntries(Object.entries(out).map(([k, v]) => [k, typeof v === "string" ? v : Object.keys(v)])));
