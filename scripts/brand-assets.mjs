// Maakt de logobestanden in public/brand/ en het overzicht in
// docs/specs/assets/logo/ uit components/brand/logo-paths.json en de kleuren
// uit lib/brand.ts (spec 02 §4.11 punt 5).
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
const docs = new URL("../docs/specs/assets/logo/", import.meta.url);
mkdirSync(out, { recursive: true });

const size = (viewBox) => viewBox.split(" ").map(Number).slice(2);
const COLOR = { g: c.foreground, accent: c.brand, descriptor: c.muted };
const WHITE = { g: c.background, accent: c.background, descriptor: c.background };
const INK = { g: c.foreground, accent: c.foreground, descriptor: c.foreground };

/** Beeldmerk: de G in drie delen en de sikkel. */
const markGroup = (col = COLOR) =>
  `<path fill="${col.g}" d="${paths.mark.g}"/><path fill="${col.accent}" d="${paths.mark.crescent}"/>`;

/** Logo in een opbouw (horizontal of stacked) en variant (wordmark of lockup). */
function logoGroup(layout, variant, col = COLOR) {
  const box = paths[layout][variant];
  const descriptor =
    variant === "lockup"
      ? `<g transform="${paths.descriptor.transform}"><path fill="${col.descriptor}" d="${paths.descriptor.d}"/></g>`
      : "";
  return `<g transform="${box.mark}">${markGroup(col)}</g><g transform="${box.text}"><g transform="${paths.wordmark.transform}"><path fill="${col.g}" d="${paths.wordmark.grs}"/><path fill="${col.accent}" d="${paths.wordmark.oo}"/></g>${descriptor}</g>`;
}

/** Tegel met het beeldmerk; standaard kobalt met wit, of wit met het beeldmerk in kleur. */
function tileGroup({ light = false, rx = paths.tile.rx } = {}) {
  const rect = light
    ? `<rect x="0.5" y="0.5" width="47" height="47" rx="${rx - 0.5}" fill="${c.background}" stroke="${c.border}"/>`
    : `<rect width="48" height="48" rx="${rx}" fill="${c.brand}"/>`;
  return `${rect}<g transform="${paths.tile.mark}">${markGroup(light ? COLOR : WHITE)}</g>`;
}

const [lw, lh] = size(paths.horizontal.lockup.viewBox);
const [sw, sh] = size(paths.stacked.lockup.viewBox);
const label = "Groos Personeelsdiensten";

writeFileSync(
  new URL("logo.svg", out),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${paths.horizontal.lockup.viewBox}" width="${lw * 4}" height="${lh * 4}" role="img" aria-label="${label}">${logoGroup("horizontal", "lockup")}</svg>\n`,
);
writeFileSync(
  new URL("logo-mark.svg", out),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${paths.tile.viewBox}" width="192" height="192" role="img" aria-label="${label}">${tileGroup()}</svg>\n`,
);

// Inhoud van vbW bij vbH op een wit vlak van w bij h, contentW breed en gecentreerd.
function placed(w, h, contentW, inner, vbW, vbH) {
  const scale = contentW / vbW;
  const x = (w - contentW) / 2;
  const y = (h - vbH * scale) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${c.background}"/><g transform="translate(${x} ${y}) scale(${scale})">${inner}</g></svg>`;
}

// Vierkant logo voor JSON-LD: gestapelde lockup in kleur, 352 px breed, gecentreerd.
await sharp(Buffer.from(placed(512, 512, 352, logoGroup("stacked", "lockup"), sw, sh)), { density: 300 })
  .resize(512, 512)
  .png()
  .toFile(new URL("logo.png", out).pathname);

// E-maillogo: 480 bij 200, horizontale lockup in kleur met 24 px marge.
const emailW = Math.min(480 - 48, ((200 - 48) * lw) / lh);
await sharp(Buffer.from(placed(480, 200, emailW, logoGroup("horizontal", "lockup"), lw, lh)), { density: 300 })
  .resize(480, 200)
  .png()
  .toFile(new URL("logo-email.png", out).pathname);

for (const f of ["logo.png", "logo-email.png"]) {
  const m = await sharp(new URL(f, out).pathname).metadata();
  console.log(`public/brand/${f}: ${m.width} bij ${m.height}`);
}
console.log("public/brand/logo.svg en logo-mark.svg geschreven");

// Overzicht van alle varianten: op wit, op kobalt, in één kleur en de iconen op 16, 32 en 64 px.
const [ww, wh] = size(paths.horizontal.wordmark.viewBox);
const [mw, mh] = size(paths.mark.viewBox);
const at = (x, y, h, vbH, inner) => `<g transform="translate(${x} ${y}) scale(${h / vbH})">${inner}</g>`;
const text = (x, y, s, fill = c.muted, weight = 400, px = 14) =>
  `<text x="${x}" y="${y}" font-family="Helvetica, Arial, sans-serif" font-size="${px}" font-weight="${weight}" fill="${fill}">${s}</text>`;

const BOARD_W = 1280;
const ROW_H = 300;
const rows = [
  { title: "Op wit: G in nacht, sikkel in kobalt", bg: c.background, col: COLOR, ink: c.muted },
  { title: "Op kobalt: alles wit", bg: c.brand, col: WHITE, ink: c.background },
  { title: "Eén kleur: alles nacht", bg: c.ice, col: INK, ink: c.muted },
];
let board = `<rect width="${BOARD_W}" height="${rows.length * ROW_H + 300}" fill="${c.background}"/>`;
rows.forEach((row, i) => {
  const y = i * ROW_H;
  board += `<rect y="${y}" width="${BOARD_W}" height="${ROW_H}" fill="${row.bg}"/>`;
  board += text(40, y + 36, row.title, row.ink, 700);
  board += at(40, y + 96, 104, lh, logoGroup("horizontal", "lockup", row.col));
  board += text(40, y + 264, "Horizontaal met beschrijver", row.ink);
  board += at(480, y + 110, 72, wh, logoGroup("horizontal", "wordmark", row.col));
  board += text(480, y + 264, "Horizontaal, header", row.ink);
  board += at(860, y + 60, 176, sh, logoGroup("stacked", "lockup", row.col));
  board += text(860, y + 264, "Gestapeld", row.ink);
  board += at(1110, y + 84, 128, mh, markGroup(row.col));
  board += text(1110, y + 264, "Beeldmerk", row.ink);
});
const iy = rows.length * ROW_H;
board += `<rect y="${iy}" width="${BOARD_W}" height="1" fill="${c.border}"/>`;
board += text(40, iy + 36, "Icoon en beeldmerk op ware grootte: 16, 32 en 64 px", c.muted, 700);
const sizes = [16, 32, 64];
const iconRow = (x0, label2, draw, bg) => {
  let s = bg ? `<rect x="${x0 - 20}" y="${iy + 64}" width="200" height="104" rx="12" fill="${bg}"/>` : "";
  let x = x0;
  for (const px of sizes) {
    s += draw(x, iy + 84 + (64 - px), px);
    x += px + 24;
  }
  return s + text(x0 - 20, iy + 196, label2);
};
board += iconRow(60, "Kobalt tegel (favicon en app-icoon)", (x, y, px) => at(x, y, px, 48, tileGroup()));
board += iconRow(320, "Witte tegel", (x, y, px) => at(x, y, px, 48, tileGroup({ light: true })));
board += iconRow(580, "Beeldmerk in kleur", (x, y, px) => at(x, y, px, mh, markGroup()));
board += iconRow(840, "Kobalt tegel op donker", (x, y, px) => at(x, y, px, 48, tileGroup()), c.foreground);
board += iconRow(1080, "Witte tegel op donker", (x, y, px) => at(x, y, px, 48, tileGroup({ light: true })), c.foreground);
board += text(40, iy + 250, `Kleuren: nacht ${c.foreground}, kobalt ${c.brand}, wit ${c.background}. Verhouding beeldmerk ${mw} bij ${mh}; horizontaal ${ww} bij ${wh} en ${lw} bij ${lh}.`);

const boardH = iy + 280;
const boardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BOARD_W} ${boardH}" width="${BOARD_W}" height="${boardH}" role="img" aria-label="Overzicht van het logo van ${label}">${board}</svg>\n`;
writeFileSync(new URL("overzicht.svg", docs), boardSvg);
await sharp(Buffer.from(boardSvg), { density: 72 }).resize(BOARD_W, boardH).png().toFile(new URL("overzicht.png", docs).pathname);
console.log("docs/specs/assets/logo/overzicht.svg en overzicht.png geschreven");
