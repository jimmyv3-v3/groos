/**
 * Kwaliteitstest voor de beroepspagina's (spec 05 §10 stap 12, §6.7 D-1 tot en met D-5).
 * Draait in Vitest (spec 14) met `npm test`; drukt per pagina het aantal woorden
 * en het unieke aandeel af.
 */
import assert from "node:assert/strict";
import { test } from "vitest";
import { glazenwasser } from "@/content/beroepen/glazenwasser";
import { schoonmaker } from "@/content/beroepen/schoonmaker";
import { logistiekMedewerker } from "@/content/beroepen/logistiek-medewerker";
import { verhuizer } from "@/content/beroepen/verhuizer";
import { hulpkrachtBouwEnSloop } from "@/content/beroepen/hulpkracht-bouw-en-sloop";
import { werkzoekendenPage } from "@/content/pages/werkzoekenden";
import { werkgeversPage } from "@/content/pages/werkgevers";
import { wttaPage } from "@/content/pages/wtta";
import { MINIMUM_WAGE_21_PLUS } from "@/lib/data/options";
import nlWerkzoekenden from "@/messages/nl/werkzoekenden.json";
import nlWerkgevers from "@/messages/nl/werkgevers.json";
import nlBeroepen from "@/messages/nl/beroepen.json";
import enWerkzoekenden from "@/messages/en/werkzoekenden.json";
import enWerkgevers from "@/messages/en/werkgevers.json";
import enBeroepen from "@/messages/en/beroepen.json";

const CONTENT = [glazenwasser, schoonmaker, logistiekMedewerker, verhuizer, hulpkrachtBouwEnSloop];
const LOCALES = ["nl", "en"] as const;
type Locale = (typeof LOCALES)[number];
type Perspective = "jobseeker" | "employer";
const MESSAGES = {
  nl: { werkzoekenden: nlWerkzoekenden, werkgevers: nlWerkgevers, beroepen: nlBeroepen },
  en: { werkzoekenden: enWerkzoekenden, werkgevers: enWerkgevers, beroepen: enBeroepen },
};

/* Hulpfuncties ------------------------------------------------------------- */

/** Alle strings in een waarde, behalve onder de sleutels in `skip`. */
function strings(value: unknown, skip: Set<string> = new Set()): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap((v) => strings(v, skip));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) =>
      skip.has(k) || k === "claim" || k === "icon" || k === "need" || k === "specific" ? [] : strings(v, skip),
    );
  }
  return [];
}

/** Alleen zichtbare items: alle claimvlaggen op false (AC-05-13). */
function visible<T>(value: T): T;
function visible(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.filter((v: unknown) => !(v && typeof v === "object" && "claim" in v)).map((v: unknown) => visible(v));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, visible(v)]));
  }
  return value;
}

const words = (s: string) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));
const countWords = (list: string[]) => list.reduce((n, s) => n + words(s).length, 0);

const NAMES = LOCALES.flatMap((l) =>
  CONTENT.flatMap(({ id }) => [MESSAGES[l].beroepen[id].meervoud, MESSAGES[l].beroepen[id].enkelvoud]),
)
  .map((n) => n.toLowerCase())
  .sort((a, b) => b.length - a.length);

function normalize(s: string) {
  let t = s.toLowerCase();
  for (const n of NAMES) t = t.split(n).join(" beroepnaam ");
  return t.replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}

function grams(list: string[], n = 5) {
  const out: string[] = [];
  for (const s of list) {
    const w = normalize(s).split(" ").filter(Boolean);
    for (let i = 0; i + n <= w.length; i++) out.push(w.slice(i, i + n).join(" "));
  }
  return out;
}

function stepStrings(locale: Locale, perspective: Perspective) {
  const ns = perspective === "jobseeker" ? "werkzoekenden" : "werkgevers";
  return strings(MESSAGES[locale][ns].steps);
}

/** Tekst per pagina voor D-1 en D-2: content zonder meta, zichtbare items, plus de gedeelde stappen. */
function pageText(content: (typeof CONTENT)[number], locale: Locale, perspective: Perspective) {
  const own = strings(visible(content[locale][perspective]), new Set(["meta"]));
  return { own, steps: stepStrings(locale, perspective) };
}

const sentences = (s: string) => s.split(/(?<=[.?])\s+/).filter(Boolean);

/* Rapport ------------------------------------------------------------------ */

const report: { locale: Locale; perspective: Perspective; id: string; words: number; unique: number }[] = [];
for (const locale of LOCALES) {
  for (const perspective of ["jobseeker", "employer"] as const) {
    const pages = CONTENT.map((c) => ({ id: c.id, ...pageText(c, locale, perspective) }));
    for (const page of pages) {
      const mine = grams(page.own);
      const others = new Set(pages.filter((p) => p.id !== page.id).flatMap((p) => grams(p.own)));
      const unique = mine.filter((g) => !others.has(g)).length;
      const total = mine.length + grams(page.steps).length;
      report.push({
        locale,
        perspective,
        id: page.id,
        words: countWords(page.own) + countWords(page.steps),
        unique: total ? unique / total : 0,
      });
    }
  }
}

console.log("\nBeroepspagina's: woorden en unieke vijfwoordsreeksen (D-1, D-2)");
console.table(
  report.map((r) => ({ taal: r.locale, perspectief: r.perspective, beroep: r.id, woorden: r.words, uniek: `${Math.round(r.unique * 100)}%` })),
);

/* Tests --------------------------------------------------------------------- */

const range = (label: string, n: number, min: number, max: number) => assert.ok(n >= min && n <= max, `${label}: ${n} (verwacht ${min} tot ${max})`);

test("lijstlengtes per beroep en perspectief (§5.2)", () => {
  for (const c of CONTENT) {
    for (const locale of LOCALES) {
      const j = c[locale].jobseeker;
      const e = c[locale].employer;
      const p = `${c.id}/${locale}`;
      range(`${p} hero.facts`, j.hero.facts.length, 1, 2);
      range(`${p} work.tasks`, j.work.tasks.length, 5, 7);
      range(`${p} work.places`, j.work.places.length, 3, 5);
      range(`${p} requirements.items`, j.requirements.items.length, 3, 6);
      range(`${p} certificates (jobseeker)`, j.certificates.items.length, 2, 4);
      range(`${p} career.steps`, j.career.steps.length, 3, 5);
      range(`${p} supply.tasks`, e.supply.tasks.length, 5, 7);
      range(`${p} supply.clients`, e.supply.clients.length, 3, 5);
      range(`${p} legal.items`, e.legal.items.length, 3, 5);
      assert.equal(j.schedule.items.length, 3);
      assert.equal(j.why.items.length, 3);
      assert.equal(e.why.items.length, 4);
      assert.equal(e.planning.items.length, 3);
    }
  }
});

test("D-1 lengte per perspectief 500 tot 800 woorden", () => {
  for (const r of report) range(`${r.id}/${r.locale}/${r.perspective} woorden`, r.words, 500, 800);
});

test("D-2 minstens 60 procent unieke tekst", () => {
  for (const r of report.filter((x) => x.locale === "nl")) {
    assert.ok(r.unique >= 0.6, `${r.id}/${r.perspective}: ${Math.round(r.unique * 100)}% uniek`);
  }
});

test("D-3 en D-4 eigen h1, metatitel, metabeschrijving, CTA-kop en waarom-kop", () => {
  for (const locale of LOCALES) {
    type Block = (typeof CONTENT)[number]["nl"]["jobseeker" | "employer"];
    const fields: Record<string, (b: Block) => string> = {
      h1: (b) => b.hero.title,
      metaTitle: (b) => b.meta.title,
      metaDescription: (b) => b.meta.description,
      cta: (b) => `${b.cta.title} ${b.cta.accent}`,
      why: (b) => `${b.why.title} ${b.why.accent}`,
    };
    for (const [name, get] of Object.entries(fields)) {
      // D-3 vergelijkt de waarden zelf (de h1 "Werken als {beroep} in Den Haag" is een vast sjabloon);
      // D-4 vergelijkt ook na vervanging van de beroepsnaam door {beroep}.
      const d4 = name === "cta" || name === "why";
      const values = CONTENT.flatMap((c) => [get(c[locale].jobseeker), get(c[locale].employer)]).map((v) =>
        d4 ? normalize(v) : v.toLowerCase(),
      );
      assert.equal(new Set(values).size, values.length, `${locale} ${name} niet uniek: ${values.join(" | ")}`);
    }
  }
});

test("D-5 beroepsspecifieke FAQ's na filtering", () => {
  for (const c of CONTENT) {
    for (const locale of LOCALES) {
      const j = visible(c[locale].jobseeker).faq.items;
      const e = visible(c[locale].employer).faq.items;
      range(`${c.id}/${locale} zichtbare FAQ werkzoekende`, j.length, 6, 7);
      assert.ok(j.filter((f) => f.specific).length >= 4, `${c.id}/${locale}: minder dan 4 specifieke FAQ's (werkzoekende)`);
      range(`${c.id}/${locale} zichtbare FAQ werkgever`, e.length, 6, 8);
      assert.ok(e.filter((f) => f.specific).length * 2 >= e.length, `${c.id}/${locale}: minder dan de helft specifiek (werkgever)`);
    }
  }
});

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, ["claim", "icon", "specific", "need"].includes(k) ? v : shape(v)]),
    );
  }
  return typeof value;
}

test("nl en en hebben dezelfde vorm, claims, iconen en specific-waarden", () => {
  for (const c of CONTENT) assert.deepEqual(shape(c.en), shape(c.nl), `${c.id}: nl en en wijken af`);
  const pages = [
    ["werkzoekenden", werkzoekendenPage],
    ["werkgevers", werkgeversPage],
    ["wtta", wttaPage],
  ] as const;
  for (const [name, page] of pages) {
    const nl = { ...page.nl, reviewedAt: undefined };
    const en = { ...page.en, reviewedAt: undefined };
    assert.deepEqual(shape(en), shape(nl), `${name}: nl en en wijken af`);
  }
});

test("minimumleeftijd alleen met arbo-reden (VR-02)", () => {
  for (const c of CONTENT) {
    for (const locale of LOCALES) {
      const req = c[locale].jobseeker.requirements;
      const note = "minAgeNote" in req ? req.minAgeNote : undefined;
      if (c.minAge18) assert.ok(note && /18/.test(note), `${c.id}/${locale}: minAgeNote ontbreekt`);
      else assert.ok(!note, `${c.id}/${locale}: minAgeNote zonder arbo-reden`);
      const all = strings(c[locale]).join(" ");
      if (!c.minAge18) assert.ok(!/18 (jaar|years)/.test(all), `${c.id}/${locale}: noemt 18 jaar zonder reden`);
    }
  }
});

test("startersloon niet onder het wettelijk minimumloon (B-42)", () => {
  for (const c of CONTENT) {
    assert.ok(c.wage.starter.min >= MINIMUM_WAGE_21_PLUS, `${c.id}: ${c.wage.starter.min} < ${MINIMUM_WAGE_21_PLUS}`);
    assert.ok(c.wage.starter.max >= c.wage.starter.min);
    if (new Date() > new Date(c.wage.reviewBy)) console.warn(`[waarschuwing] ${c.id}: loonbedragen na ${c.wage.reviewBy} opnieuw bekijken`);
  }
});

/* Schrijfregels (deel van check:copy van spec 03, hier als vangnet) ---------- */

const FORBIDDEN_NL = /\b(we|men|ontzorg\w*|naadloos|passie|gedreven|dynamisch|uitdagend|innovatief|cruciaal|essentieel|ontdek|gegarandeerd|garantie|de beste|uniek|fysiek sterk|fit en gezond|jong\w*|student\w*|native|moedertaal|flexkracht\w*|talenten|matchen|keurmerk|24\/7|dag en nacht|binnen 24 uur|binnen één werkdag|wekelijks uitbetaald|g-rekening van groos|huisvesting geregeld)\b/iu;
const FORBIDDEN_EN = /\b(best|number one|leading|unique|guaranteed?|24\/7|around the clock|seamless|passionate|dynamic|innovative|hassle-free|discover|crucial|essential|flex worker|talent|young|student|native|physically strong)\b/iu;
const DASH = /\s[-–—]\s|[–—]/u;

function zoneStrings() {
  const out: { where: string; locale: Locale; zone: "je" | "u"; list: string[] }[] = [];
  for (const c of CONTENT) {
    for (const locale of LOCALES) {
      out.push({ where: `${c.id}/${locale}/jobseeker`, locale, zone: "je", list: strings(c[locale].jobseeker) });
      out.push({ where: `${c.id}/${locale}/employer`, locale, zone: "u", list: strings(c[locale].employer) });
    }
  }
  for (const locale of LOCALES) {
    out.push({ where: `werkzoekenden/${locale}`, locale, zone: "je", list: strings(werkzoekendenPage[locale]) });
    out.push({ where: `werkgevers/${locale}`, locale, zone: "u", list: strings(werkgeversPage[locale]) });
    out.push({ where: `wtta/${locale}`, locale, zone: "u", list: strings(wttaPage[locale]) });
  }
  return out;
}

test("schrijfregels: geen uitroepteken, geen streepje in zinnen, geen verboden woorden", () => {
  const problems: string[] = [];
  for (const z of zoneStrings()) {
    for (const s of z.list) {
      if (s.startsWith("http")) continue;
      if (s.includes("!")) problems.push(`${z.where}: uitroepteken in "${s}"`);
      if (DASH.test(s)) problems.push(`${z.where}: streepje in "${s}"`);
      const forbidden = (z.locale === "nl" ? FORBIDDEN_NL : FORBIDDEN_EN).exec(s);
      if (forbidden) problems.push(`${z.where}: verboden woord "${forbidden[0]}" in "${s}"`);
      if (/\bTODO\b/.test(s)) problems.push(`${z.where}: TODO in zichtbare tekst "${s}"`);
    }
  }
  assert.deepEqual(problems, []);
});

test("aanspreekvorm: je-zones zonder u en uw, u-zones zonder je, jij, jou en jouw (AC-05-05)", () => {
  const problems: string[] = [];
  for (const z of zoneStrings().filter((x) => x.locale === "nl")) {
    for (const s of z.list) {
      const wrong = z.zone === "je" ? /\b(u|uw)\b/iu.exec(s) : /\b(je|jij|jou|jouw)\b/iu.exec(s);
      if (wrong) problems.push(`${z.where}: "${wrong[0]}" in "${s}"`);
    }
  }
  assert.deepEqual(problems, []);
});

test("B1: zinnen in je-zones hoogstens 22 woorden (waarschuwing boven 15 gemiddeld)", () => {
  const problems: string[] = [];
  for (const z of zoneStrings().filter((x) => x.locale === "nl" && x.zone === "je")) {
    const all = z.list.flatMap(sentences);
    for (const s of all) if (words(s).length > 22) problems.push(`${z.where}: ${words(s).length} woorden in "${s}"`);
    const avg = countWords(all) / Math.max(all.length, 1);
    if (avg > 15) console.warn(`[waarschuwing] ${z.where}: gemiddeld ${avg.toFixed(1)} woorden per zin`);
  }
  assert.deepEqual(problems, []);
});

test("vaste pagina's: lijstlengtes en woorden (§5.4, spec 03 §6.12)", () => {
  for (const locale of LOCALES) {
    const wz = werkzoekendenPage[locale];
    const wg = werkgeversPage[locale];
    const wt = wttaPage[locale];
    range(`werkzoekenden/${locale} promises`, wz.promises.items.length, 4, 6);
    range(`werkzoekenden/${locale} rights`, wz.rights.items.length, 5, 7);
    range(`werkzoekenden/${locale} zichtbare faq`, visible(wz).faq.items.length, 7, 8);
    range(`werkzoekenden/${locale} compare.rows`, wz.compare.rows.length, 4, 5);
    assert.equal(wg.supply.items.length, 4);
    range(`werkgevers/${locale} agency`, wg.agency.items.length, 4, 5);
    range(`werkgevers/${locale} zichtbare faq`, visible(wg).faq.items.length, 7, 8);
    range(`wtta/${locale} about`, wt.about.paragraphs.length, 2, 3);
    assert.equal(wt.timeline.items.length, 6);
    range(`wtta/${locale} hirer`, wt.hirer.items.length, 4, 5);
    assert.equal(wt.check.steps.length, 3);
    assert.equal(wt.liability.paragraphs.length, 2);
    range(`wtta/${locale} faq`, wt.faq.items.length, 5, 6);
    for (const item of wt.timeline.items) assert.match(item.date, /^\d{4}-\d{2}-\d{2}$/);
  }
  const summaries = (side: "jobseeker" | "employer") => CONTENT.map((c) => MESSAGES.nl.beroepen[c.id][side].summary);
  const wzWords = countWords(strings(visible(werkzoekendenPage.nl))) + countWords(stepStrings("nl", "jobseeker")) + countWords(summaries("jobseeker"));
  const wgWords = countWords(strings(visible(werkgeversPage.nl))) + countWords(stepStrings("nl", "employer")) + countWords(summaries("employer"));
  const wtWords = countWords(strings(wttaPage.nl).filter((s) => !s.startsWith("http")));
  console.log(`\nVaste pagina's (nl): werkzoekenden ${wzWords} woorden (600 tot 900), werkgevers ${wgWords} (700 tot 1000), wtta ${wtWords} (500 tot 900)`);
  range("werkzoekenden woorden", wzWords, 600, 900);
  range("werkgevers woorden", wgWords, 700, 1000);
  range("wtta woorden", wtWords, 500, 900);
});
