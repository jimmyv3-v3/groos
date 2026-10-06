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

const box = (viewBox) => viewBox.split(" ").map(Number);
const COLOR = { g: c.foreground, accent: c.brand, descriptor: c.muted };
const WHITE = { g: c.background, accent: c.background, descriptor: c.background };
const INK = { g: c.foreground, accent: c.foreground, descriptor: c.foreground };

/** Beeldmerk: de G in drie delen en de sikkel; optical kiest de versie voor kleine maten. */
const markGroup = (col = COLOR, optical = false) => {
  const mark = optical ? paths.markSmall : paths.mark;
  return `<path fill="${col.g}" d="${mark.g}"/><path fill="${col.accent}" d="${mark.crescent}"/>`;
};

/** Logo (het beeldmerk als G met "roos" erachter), zonder (wordmark) of met beschrijver (lockup). */
function logoGroup(variant, col = COLOR, optical = false) {
  const descriptor =
    variant === "lockup"
      ? `<g transform="${paths.descriptor.transform}"><path fill="${col.descriptor}" d="${paths.descriptor.d}"/></g>`
      : "";
  const text = optical ? paths.text.optical : paths.text.master;
  return `${markGroup(col, optical)}<g transform="${text}"><g transform="${paths.wordmark.transform}"><path fill="${col.g}" d="${paths.wordmark.roos}"/></g>${descriptor}</g>`;
}

/** Tegel met het beeldmerk op 59 procent; standaard kobalt met wit, of wit met het beeldmerk in kleur. */
function tileGroup({ light = false, rx = paths.tile.rx, optical = true } = {}) {
  const s = paths.tile.size;
  const rect = light
    ? `<rect x="0.5" y="0.5" width="${s - 1}" height="${s - 1}" rx="${rx - 0.5}" fill="${c.background}" stroke="${c.border}"/>`
    : `<rect width="${s}" height="${s}" rx="${rx}" fill="${c.brand}"/>`;
  return `${rect}<g transform="${paths.tile.mark}">${markGroup(light ? COLOR : WHITE, optical)}</g>`;
}

const LOCKUP = paths.horizontal.lockup;
const WORD = paths.horizontal.wordmark;
const [, , lw, lh] = box(LOCKUP.viewBox);
const label = "Groos Personeelsdiensten";
const head = 'xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision"';

// Losse SVG's: het kader heeft de marge van het logo, dus geen rand valt op de rand van het bestand.
writeFileSync(
  new URL("logo.svg", out),
  `<svg ${head} viewBox="${LOCKUP.viewBox}" width="${LOCKUP.width * 4}" height="${LOCKUP.height * 4}" overflow="visible" role="img" aria-label="${label}">${logoGroup("lockup")}</svg>\n`,
);
writeFileSync(
  new URL("logo-mark.svg", out),
  `<svg ${head} viewBox="${paths.tile.viewBox}" width="192" height="192" role="img" aria-label="${label}">${tileGroup()}</svg>\n`,
);

// Vierkant logo voor JSON-LD: alleen het beeldmerk (één op één) op de kobalt tegel, 512 bij 512.
await sharp(Buffer.from(`<svg ${head} viewBox="${paths.tile.viewBox}" width="512" height="512">${tileGroup({ optical: false })}</svg>`), {
  density: 300,
})
  .resize(512, 512)
  .png()
  .toFile(new URL("logo.png", out).pathname);

// E-maillogo: 480 bij 200, logo met beschrijver in kleur, gecentreerd op wit. De marge van het kader telt mee als witruimte.
const emailW = Math.min(480 - 32, ((200 - 32) * lw) / lh);
const emailH = (emailW * lh) / lw;
await sharp(
  Buffer.from(
    `<svg ${head} width="480" height="200" viewBox="0 0 480 200"><rect width="480" height="200" fill="${c.background}"/><svg x="${(480 - emailW) / 2}" y="${(200 - emailH) / 2}" width="${emailW}" height="${emailH}" viewBox="${LOCKUP.viewBox}">${logoGroup("lockup")}</svg></svg>`,
  ),
  { density: 300 },
)
  .resize(480, 200)
  .png()
  .toFile(new URL("logo-email.png", out).pathname);

for (const f of ["logo.png", "logo-email.png"]) {
  const m = await sharp(new URL(f, out).pathname).metadata();
  console.log(`public/brand/${f}: ${m.width} bij ${m.height}`);
}
console.log("public/brand/logo.svg en logo-mark.svg geschreven");

// Overzicht van alle varianten. `place` zet een kader (viewBox) op x, y met hoogte h in px.
const place = (x, y, h, viewBox, inner) => {
  const [, , w, vh] = box(viewBox);
  return `<svg x="${x}" y="${y}" width="${(w * h) / vh}" height="${h}" viewBox="${viewBox}" overflow="visible">${inner}</svg>`;
};
const text = (x, y, s, fill = c.muted, weight = 400, px = 14) =>
  `<text x="${x}" y="${y}" font-family="Helvetica, Arial, sans-serif" font-size="${px}" font-weight="${weight}" fill="${fill}">${s}</text>`;

const BOARD_W = 1280;
const ROW_H = 300;
const rows = [
  { title: "Op wit: G in nacht, sikkel in kobalt", bg: c.background, col: COLOR, ink: c.muted },
  { title: "Op kobalt: alles wit", bg: c.brand, col: WHITE, ink: c.background },
  { title: "Eén kleur: alles nacht", bg: c.ice, col: INK, ink: c.muted },
];
let board = `<rect width="${BOARD_W}" height="${rows.length * ROW_H + 640}" fill="${c.background}"/>`;
rows.forEach((row, i) => {
  const y = i * ROW_H;
  board += `<rect y="${y}" width="${BOARD_W}" height="${ROW_H}" fill="${row.bg}"/>`;
  board += text(40, y + 36, row.title, row.ink, 700);
  board += place(34, y + 70, 150, LOCKUP.viewBox, logoGroup("lockup", row.col));
  board += text(40, y + 264, "Met beschrijver (footer, e-mail)", row.ink);
  board += place(464, y + 90, 110, WORD.viewBox, logoGroup("wordmark", row.col));
  board += text(470, y + 264, "Zonder beschrijver (header)", row.ink);
  board += place(890, y + 76, WORD.height, WORD.viewBox, logoGroup("wordmark", row.col, true));
  board += place(890, y + 150, LOCKUP.height, LOCKUP.viewBox, logoGroup("lockup", row.col, true));
  board += text(890, y + 264, "Ware grootte, optisch", row.ink);
  board += place(1110, y + 78, 138, paths.mark.viewBox, markGroup(row.col));
  board += text(1116, y + 264, "Beeldmerk", row.ink);
});
const iy = rows.length * ROW_H;
board += `<rect y="${iy}" width="${BOARD_W}" height="1" fill="${c.border}"/>`;
board += text(40, iy + 36, "Icoon en beeldmerk op ware grootte (optische versie): 16, 32 en 64 px", c.muted, 700);
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
const tileAt = (opts) => (x, y, px) => place(x, y, px, paths.tile.viewBox, tileGroup(opts));
board += iconRow(60, "Kobalt tegel (favicon en app-icoon)", tileAt());
board += iconRow(320, "Witte tegel", tileAt({ light: true }));
board += iconRow(580, "Beeldmerk, optische versie", (x, y, px) => place(x, y, px, paths.markSmall.viewBox, markGroup(COLOR, true)));
board += iconRow(840, "Kobalt tegel op donker", tileAt(), c.foreground);
board += iconRow(1080, "Witte tegel op donker", tileAt({ light: true }), c.foreground);
board += text(
  40,
  iy + 250,
  `Kleuren: nacht ${c.foreground}, kobalt ${c.brand}, wit ${c.background}. Raster: beeldmerk 38 px hoog; kader ${WORD.width} bij ${WORD.height} px, met beschrijver ${LOCKUP.width} bij ${LOCKUP.height} px, 2 px marge.`,
);

// Het beeldmerk één op één naast de optische versie voor kleine maten.
const cy = iy + 290;
board += `<rect y="${cy - 10}" width="${BOARD_W}" height="1" fill="${c.border}"/>`;
board += text(40, cy + 26, "Beeldmerk één op één (vanaf ongeveer 48 px) en de optische versie (daaronder)", c.muted, 700);
board += place(50, cy + 46, 226, paths.mark.viewBox, markGroup());
board += text(60, cy + 296, "Eén op één: tussenruimtes 3,4 tot 4,6");
board += place(350, cy + 46, 226, paths.markSmall.viewBox, markGroup(COLOR, true));
board += text(360, cy + 296, "Optisch: tussenruimtes 5,4 (2 px op 38), stompe punten");
board += place(760, cy + 56, 200, paths.tile.viewBox, tileGroup({ optical: false }));
board += text(760, cy + 296, "Tegel één op één (logo.png)");
board += place(1020, cy + 56, 200, paths.tile.viewBox, tileGroup());
board += text(1020, cy + 296, "Tegel optisch (favicon, app-icoon)");

const boardH = cy + 320;
const boardSvg = `<svg ${head} viewBox="0 0 ${BOARD_W} ${boardH}" width="${BOARD_W}" height="${boardH}" role="img" aria-label="Overzicht van het logo van ${label}">${board}</svg>\n`;
writeFileSync(new URL("overzicht.svg", docs), boardSvg);
await sharp(Buffer.from(boardSvg), { density: 72 }).resize(BOARD_W, boardH).png().toFile(new URL("overzicht.png", docs).pathname);
console.log("docs/specs/assets/logo/overzicht.svg en overzicht.png geschreven");
