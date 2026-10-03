// Contrastcontrole voor de tokens van spec 02 en gelijkheid van lib/brand.ts
// met app/globals.css. Gebruik: node scripts/check-contrast.mjs
import { readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const { pairs, brandToToken } = JSON.parse(read("lib/contrast-pairs.json"));
const root = read("app/globals.css").match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
const tokens = Object.fromEntries(
  [...root.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)].map(([, k, v]) => [k, v.toLowerCase()]),
);
const brand = Object.fromEntries(
  [...read("lib/brand.ts").matchAll(/(\w+):\s*"(#[0-9a-fA-F]{6})"/g)].map(([, k, v]) => [k, v.toLowerCase()]),
);

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((v) => lin(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

let fails = 0;
for (const { fg, bg, min, use } of pairs) {
  const a = tokens[fg];
  const b = tokens[bg];
  if (!a || !b) {
    console.log(`ONTBREEKT --${fg} of --${bg}`);
    fails++;
    continue;
  }
  const r = ratio(a, b);
  if (r < min) fails++;
  console.log(`${r >= min ? "ok    " : "FAALT "} --${fg} op --${bg}: ${r.toFixed(2)}:1, minimaal ${min}:1 (${use})`);
}
for (const [key, token] of Object.entries(brandToToken)) {
  if (brand[key] !== tokens[token]) {
    console.log(`VERSCHIL lib/brand.ts ${key} = ${brand[key]}, --${token} = ${tokens[token]}`);
    fails++;
  }
}
console.log(fails ? `\n${fails} probleem of problemen.` : "\nAlle contrastparen en merkwaarden kloppen.");
process.exit(fails ? 1 : 0);
