// Maakt de logobestanden in public/brand/ uit components/brand/logo-paths.json
// en de kleuren uit lib/brand.ts (spec 02 §4.11 punt 5).
// Gebruik: node scripts/brand-assets.mjs
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const paths = JSON.parse(read("components/brand/logo-paths.json"));
// lib/brand.ts kan hier niet geïmporteerd worden (Node behandelt .ts als CommonJS);
// lees de hexwaarden met dezelfde reguliere expressie als check-contrast.mjs.
const c = Object.fromEntries(
  [...read("lib/brand.ts").matchAll(/(\w+):\s*"(#[0-9a-fA-F]{6})"/g)].map(([, k, v]) => [k, v]),
);

const out = new URL("../public/brand/", import.meta.url);
mkdirSync(out, { recursive: true });

const [, , lw, lh] = paths.lockup.viewBox.split(" ").map(Number);
const [, , ww, wh] = paths.wordmark.viewBox.split(" ").map(Number);

const wordmarkGroup = `<g transform="${paths.wordmark.transform}"><path fill="${c.foreground}" d="${paths.wordmark.grs}"/><path fill="${c.brand}" d="${paths.wordmark.oo}"/></g>`;
const descriptorGroup = `<g transform="${paths.lockup.descriptorTransform}"><path fill="${c.muted}" d="${paths.lockup.descriptor}"/></g>`;

const lockupSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${paths.lockup.viewBox}" width="${lw * 4}" height="${lh * 4}" role="img" aria-label="Groos Personeelsdiensten">${wordmarkGroup}${descriptorGroup}</svg>\n`;
const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="192" height="192" role="img" aria-label="Groos Personeelsdiensten"><defs><mask id="oo" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48"><rect width="48" height="48" fill="#fff"/><path transform="${paths.tile.transform}" d="${paths.tile.oo}" fill="#000"/></mask></defs><rect width="48" height="48" rx="${paths.tile.rx}" fill="${c.brand}" mask="url(#oo)"/></svg>\n`;

writeFileSync(new URL("logo.svg", out), lockupSvg);
writeFileSync(new URL("logo-mark.svg", out), markSvg);

// Woordmerk of lockup als SVG op een wit vlak van w bij h, inhoud contentW breed, gecentreerd.
function placed(w, h, contentW, inner, vbW, vbH) {
  const scale = contentW / vbW;
  const x = (w - contentW) / 2;
  const y = (h - vbH * scale) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${c.background}"/><g transform="translate(${x} ${y}) scale(${scale})">${inner}</g></svg>`;
}

await sharp(Buffer.from(placed(512, 512, 384, wordmarkGroup, ww, wh)), { density: 300 })
  .resize(512, 512)
  .png()
  .toFile(new URL("logo.png", out).pathname);

// E-maillogo: 480 bij 200, lockup in kleur met 24 px marge.
const emailW = Math.min(480 - 48, ((200 - 48) * lw) / lh);
await sharp(Buffer.from(placed(480, 200, emailW, wordmarkGroup + descriptorGroup, lw, lh)), { density: 300 })
  .resize(480, 200)
  .png()
  .toFile(new URL("logo-email.png", out).pathname);

for (const f of ["logo.png", "logo-email.png"]) {
  const m = await sharp(new URL(f, out).pathname).metadata();
  console.log(`public/brand/${f}: ${m.width} bij ${m.height}`);
}
console.log("public/brand/logo.svg en logo-mark.svg geschreven");
