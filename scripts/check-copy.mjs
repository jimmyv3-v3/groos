#!/usr/bin/env node
/**
 * Copycontrole (spec 03 §6.19): de schrijfregels C-01 tot en met C-23 op
 * messages/<taal>/*.json, content/**, de CONTENT-blokken van de juridische
 * pagina's, app/beheer/_strings.ts en de COPY-blokken in emails/. Node zonder
 * dependencies.
 *
 *   node scripts/check-copy.mjs                 fouten en waarschuwingen, exit 1 bij een fout
 *   node scripts/check-copy.mjs --warn          alles als waarschuwing, exit 0
 *   node scripts/check-copy.mjs --report        per namespace of bestand: strings, zinslengte, tweezinswaarden
 *   node scripts/check-copy.mjs --json          uitvoer als JSON (voor scripts/check-launch.mjs, K5)
 *   node scripts/check-copy.mjs --fixture fout.json   leest scripts/fixtures/check-copy/<bestand>
 *   node scripts/check-copy.mjs --compare <map> C-21: acht gelijke woorden met de brontekst in <map>
 *
 * Waarden met "TODO" slaat het script over voor de stijlregels.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative, sep } from "node:path";

const ROOT = process.cwd();
const args = process.argv.slice(2);
const WARN_ONLY = args.includes("--warn");
const REPORT = args.includes("--report");
const JSON_OUT = args.includes("--json");
const argValue = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};
const FIXTURE = argValue("--fixture");
const COMPARE = argValue("--compare");
const toPosix = (p) => p.split(sep).join("/");

/* Zones ----------------------------------------------------------------------- */

/**
 * Aanspreekzone per sleutelvoorvoegsel voor namespaces zonder vaste zone
 * (forms, bedankt, contact, home; spec 03 §6.2 en §6.19). Langste voorvoegsel wint.
 */
const ZONES = {
  "forms.jobseeker": "je",
  "forms.apply": "je",
  "forms.register": "je",
  "forms.privacy.applyNotice": "je",
  "forms.privacy.registerNotice": "je",
  "forms.privacy.registerConsent": "je",
  "forms.privacy.talentPool": "je",
  "forms.staffRequest": "u",
  "forms.privacy.staffRequestNotice": "u",
  "bedankt.application": "je",
  "bedankt.registration": "je",
  "bedankt.staffRequest": "u",
  "bedankt.contact": "u",
  "home.vacatures": "je",
};
const JE_NAMESPACES = new Set(["werkzoekenden", "vacatures"]);
const U_NAMESPACES = new Set(["werkgevers"]);
/** Uitgezonderd van C-10 (niet van C-09). */
const ZONE_EXEMPT = ["common.cta", "header.nav", "common.whatsapp"];
const NO_MARKER = new Set(["header.nav.werkzoekenden", "header.nav.werkgevers"]);
/** Vaste labels uit de sleutelboom van spec 03 §6.14 die een woord uit lijst B bevatten zonder iets te beloven (C-12). */
const C12_EXEMPT = new Set(["header.actionBar"]);

function zoneForKey(path) {
  const segments = path.split(/\.|\[\d+\]/).filter(Boolean);
  const ns = segments[0];
  let best = null;
  for (const [prefix, zone] of Object.entries(ZONES)) {
    if ((path === prefix || path.startsWith(`${prefix}.`) || path.startsWith(`${prefix}[`)) && (!best || prefix.length > best[0].length)) {
      best = [prefix, zone];
    }
  }
  if (!NO_MARKER.has(path)) {
    for (const seg of segments.slice(1)) {
      if (seg === "jobseeker" || /Jobseeker$/.test(seg) || /werkzoekende/i.test(seg)) return "je";
      if (seg === "employer" || /Employer$/.test(seg) || /werkgever/i.test(seg)) return "u";
    }
  }
  if (best) return best[1];
  if (JE_NAMESPACES.has(ns)) return "je";
  if (U_NAMESPACES.has(ns)) return "u";
  return "neutral";
}

/* Woordenlijsten (spec 03 §6.4, §6.7 en §6.9) ----------------------------------- */

const LIST_A_NL = [
  "de beste", "beste uitzendbureau", "nummer 1", "nr. 1", "marktleider", "toonaangevend", "uniek", "de enige", "100%",
  "gegarandeerd", "garantie", "razendsnel", "supersnel",
  "24/7", "dag en nacht", "altijd bereikbaar", "binnen 24 uur", "binnen een uur",
  "ontzorgen", "ontzorging", "naadloos", "passie", "gepassioneerd", "gedreven", "dynamisch", "uitdagend", "innovatief",
  "oplossingsgericht", "synergie", "toegevoegde waarde", "hoogwaardig", "one-stop-shop", "ontdek", "duik in", "moeiteloos",
  "zorgeloos", "cruciaal", "essentieel", "in het hart van",
  "flexkracht", "flexer", "inleenkracht", "personeelslid", "handjes", "matchen", "match", "talenten", "recruiter",
  "recruitment", "staffing", "workforce", "jobs",
  "(m/v)", "(m/v/x)", "man/vrouw", "jong team", "jonge", "nederlandse nationaliteit", "native speaker", "moedertaal",
  "schoonmaakster", "allochtoon",
  "klik hier", "middels", "teneinde", "derhalve", "alsmede", "thans", "doch",
  "j. versseput", "versseput", "wilk",
];
const LIST_A_EN = [
  "best", "number one", "leading", "unique", "guaranteed", "guarantee", "24/7", "around the clock", "seamless", "passionate",
  "dynamic", "innovative", "synergy", "hassle-free", "discover", "dive into", "crucial", "essential", "flex worker", "talent",
  "recruiter",
];
const LIST_B_NL = [
  "snel", "flexibel", "betrouwbaar", "kwaliteit", "professioneel", "persoonlijk", "op maat", "altijd", "nooit", "de juiste",
  "ervaren", "zo snel mogelijk", "direct aan het werk", "geen ervaring nodig", "student", "fysiek sterk", "toewijding",
];
const HARD_WORDS = [
  "beschikbaarheid", "inzetbaar", "werkzaamheden", "dienstverband", "arbeidsovereenkomst", "kwalificaties", "competenties",
  "indien", "conform", "reeds", "aanvangen", "verstrekken", "ter beschikking stellen", "woonachtig", "dient te", "wensen",
  "trachten", "inzake", "omtrent", "ten aanzien van", "accuraat", "representatief",
];
const BAD_ABBREVIATIONS = ["o.a.", "i.v.m.", "m.b.t.", "d.m.v.", "t.b.v.", "bijv.", "evt.", "ca.", "z.s.m.", "etc.", "enz.", "incl.", "excl."];
/** Afkortingen die een zin niet beëindigen. */
const KEEP_ABBREVIATIONS = ["B.V.", "J.", "nr.", "art.", "o.a.", "bijv.", "ca.", "etc.", "enz.", "incl.", "excl."];

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
function wordRe(list) {
  // Woordgrenzen die ook bij leestekens aan het begin of eind werken.
  return new RegExp(`(?<![\\p{L}\\p{N}])(${list.map(escapeRe).join("|")})(?![\\p{L}\\p{N}])`, "iu");
}
const RE_LIST_A_NL = wordRe(LIST_A_NL);
const RE_LIST_A_EN = wordRe(LIST_A_EN);
const RE_LIST_B_NL = wordRe(LIST_B_NL);
const RE_HARD = wordRe(HARD_WORDS);
const RE_BAD_ABBR = new RegExp(`(?<![\\p{L}])(${BAD_ABBREVIATIONS.map(escapeRe).join("|")})`, "iu");
/** Uitzonderingen op lijst A (spec 03 §6.9). */
const LIST_A_ALLOWED = [/wet meer zekerheid flexwerkers/i, /talentpool/i];

/* Tekstbewerking ------------------------------------------------------------------------- */

/** Haalt ICU-parameters en rich-tags weg; plural-vormen worden hun eerste tekst. */
function plain(value) {
  let s = value;
  // {count, plural, =0 {Geen} one {# vacature} other {# vacatures}} -> "# vacatures"
  for (let i = 0; i < 3; i++) {
    s = s.replace(/\{\s*\w+\s*,\s*(plural|select|selectordinal)\s*,((?:[^{}]|\{[^{}]*\})*)\}/g, (_, __, body) => {
      const forms = [...body.matchAll(/\{([^{}]*)\}/g)].map((m) => m[1]);
      return forms[forms.length - 1] ?? "";
    });
  }
  return s
    .replace(/<\/?(accent|link|strong)>/g, "")
    .replace(/\{(\w+)\}/g, "X")
    .replace(/#/g, "1");
}

const words = (s) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));

function sentences(s) {
  let t = s;
  KEEP_ABBREVIATIONS.forEach((a, i) => {
    t = t.split(a).join(`§${i}§`);
  });
  return t
    .split(/(?<=[.?!])\s+(?=[\p{Lu}0-9"“'€])/u)
    .map((x) => x.replace(/§(\d+)§/g, (_, i) => KEEP_ABBREVIATIONS[Number(i)]).trim())
    .filter(Boolean);
}

/* Bronnen ------------------------------------------------------------------------------- */

/** Platte lijst { path, key, parentKeys, value } uit een JSON-object. */
function flatten(value, path, out, parent) {
  if (typeof value === "string") {
    out.push({ path, value, parent });
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => flatten(v, `${path}[${i}]`, out, value));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) flatten(v, path ? `${path}.${k}` : k, out, value);
  }
  return out;
}

/**
 * Minimale tokenizer voor objectliteralen in TypeScript: geeft elke
 * stringliteral (zonder `${`) met zijn sleutelpad. Commentaar wordt overgeslagen.
 */
function literals(src, start = 0) {
  const out = [];
  const stack = [];
  let pendingKey = null;
  let i = start;
  // Met een startpositie (blokmodus) stopt de tokenizer na het eerste object;
  // zonder startpositie leest hij het hele bestand.
  const blockMode = start > 0;
  let depth0 = null;
  const keyPath = () => {
    const parts = [];
    for (const f of stack) {
      if (f.key !== null) parts.push(f.key);
      if (f.type === "arr") parts.push(`[${f.index}]`);
    }
    return parts.join(".").replace(/\.\[/g, "[");
  };
  while (i < src.length) {
    const c = src[i];
    const n = src[i + 1];
    if (c === "/" && n === "/") {
      i = src.indexOf("\n", i);
      if (i < 0) break;
      continue;
    }
    if (c === "/" && n === "*") {
      i = src.indexOf("*/", i + 2) + 2;
      if (i < 2) break;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      let j = i + 1;
      let value = "";
      while (j < src.length && src[j] !== c) {
        if (src[j] === "\\") {
          const e = src[j + 1];
          value += e === "n" ? "\n" : e === "u" ? String.fromCharCode(parseInt(src.slice(j + 2, j + 6), 16)) : e;
          j += e === "u" ? 6 : 2;
          continue;
        }
        value += src[j];
        j++;
      }
      const after = src.slice(j + 1).match(/^\s*(\S)/)?.[1];
      const top = stack[stack.length - 1];
      if (after === ":" && top?.type === "obj") {
        pendingKey = value;
      } else if (stack.length && !(c === "`" && value.includes("${"))) {
        const path = top.type === "obj" ? (pendingKey !== null ? [keyPath(), pendingKey].filter(Boolean).join(".") : null) : keyPath();
        if (path) out.push({ path, value, line: src.slice(0, i).split("\n").length });
      }
      i = j + 1;
      continue;
    }
    if (c === "{" || c === "[") {
      const top = stack[stack.length - 1];
      const key = top?.type === "obj" ? pendingKey : null;
      stack.push({ type: c === "{" ? "obj" : "arr", key, index: 0 });
      if (blockMode && depth0 === null) depth0 = stack.length;
      pendingKey = null;
      i++;
      continue;
    }
    if (c === "}" || c === "]") {
      stack.pop();
      pendingKey = null;
      i++;
      if (depth0 !== null && stack.length < depth0) break;
      continue;
    }
    if (c === ",") {
      const top = stack[stack.length - 1];
      if (top?.type === "arr") top.index++;
      pendingKey = null;
      i++;
      continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      const m = src.slice(i).match(/^[A-Za-z_$][\w$]*/)[0];
      const after = src.slice(i + m.length).match(/^\s*(\??:)/);
      if (after && stack[stack.length - 1]?.type === "obj") pendingKey = m;
      i += m.length;
      continue;
    }
    i++;
  }
  return out;
}

function walkFiles(dir, re, out = []) {
  const full = join(ROOT, dir);
  if (!existsSync(full)) return out;
  for (const entry of readdirSync(full)) {
    const rel = join(dir, entry);
    if (statSync(join(ROOT, rel)).isDirectory()) walkFiles(rel, re, out);
    else if (re.test(entry)) out.push(toPosix(rel));
  }
  return out;
}

const SKIP_CONTENT_KEYS = /(^|\.)(id|href|src|className|icon|claim|sourceUrl|url|need|specific|date|reviewedAt|checkedAt|reviewBy|tableDate)$/;

function contentEntries() {
  const out = [];
  for (const file of walkFiles("content", /\.ts$/)) {
    const name = basename(file, ".ts");
    const fileZone = name === "werkzoekenden" ? "je" : name === "werkgevers" || name === "wtta" ? "u" : null;
    for (const lit of literals(readFileSync(join(ROOT, file), "utf8"))) {
      const segs = lit.path.split(/\.|\[\d+\]/).filter(Boolean);
      const localeIdx = segs.findIndex((s) => s === "nl" || s === "en");
      if (localeIdx < 0 || SKIP_CONTENT_KEYS.test(lit.path)) continue;
      if (words(lit.value).length < 3 || !/\p{Ll}/u.test(lit.value)) continue;
      const zone = segs.includes("jobseeker") ? "je" : segs.includes("employer") ? "u" : (fileZone ?? "neutral");
      out.push({
        source: file,
        line: lit.line,
        locale: segs[localeIdx],
        path: lit.path,
        value: lit.value,
        zone,
        kind: "content",
      });
    }
  }
  return out;
}

function blockEntries(file, marker, kind, zone, localeDefault) {
  const out = [];
  const src = readFileSync(join(ROOT, file), "utf8");
  for (const m of src.matchAll(marker)) {
    const start = src.indexOf("{", m.index + m[0].length - 1);
    for (const lit of literals(src, start)) {
      if (SKIP_CONTENT_KEYS.test(lit.path) || words(lit.value).length < 2 || !/\p{Ll}/u.test(lit.value)) continue;
      const segs = lit.path.split(/\.|\[\d+\]/).filter(Boolean);
      const locale = segs.find((s) => s === "nl" || s === "en") ?? localeDefault;
      out.push({ source: file, line: lit.line, locale, path: lit.path, value: lit.value, zone, kind });
    }
  }
  return out;
}

function messageEntries(tree, locale, source) {
  const out = [];
  for (const { path, value, parent } of flatten(tree, "", [], null)) {
    out.push({ source, locale, path, value, parent, zone: zoneForKey(path), kind: "messages" });
  }
  return out;
}

function collect() {
  if (FIXTURE) {
    const file = join(ROOT, "scripts/fixtures/check-copy", FIXTURE);
    const data = JSON.parse(readFileSync(file, "utf8"));
    const out = [];
    for (const [top, tree] of Object.entries(data)) {
      // Bovenste segment is de regel-id (fout.json) of een gewone sleutel (goed.json).
      const isRule = /^C-\d\d$/.test(top);
      const subtree = isRule ? tree : { [top]: tree };
      const locales = subtree && typeof subtree === "object" && ("nl" in subtree || "en" in subtree) && isRule ? subtree : { nl: subtree };
      for (const [locale, t] of Object.entries(locales)) {
        for (const e of messageEntries(t, locale === "en" ? "en" : "nl", `fixture:${FIXTURE}`)) out.push({ ...e, rule: isRule ? top : null });
      }
    }
    return out;
  }
  const out = [];
  for (const locale of ["nl", "en"]) {
    const dir = join("messages", locale);
    if (!existsSync(join(ROOT, dir))) continue;
    for (const f of readdirSync(join(ROOT, dir)).filter((x) => x.endsWith(".json"))) {
      const ns = f.replace(/\.json$/, "");
      const tree = { [ns]: JSON.parse(readFileSync(join(ROOT, dir, f), "utf8")) };
      out.push(...messageEntries(tree, locale, toPosix(join(dir, f))));
    }
  }
  out.push(...contentEntries());
  for (const page of ["privacyverklaring", "cookieverklaring", "algemene-voorwaarden", "klachtenregeling"]) {
    const file = `app/[locale]/${page}/page.tsx`;
    if (existsSync(join(ROOT, file))) out.push(...blockEntries(file, /const CONTENT\b[^=]*=\s*\{/g, "legal", "legal", "nl"));
  }
  if (existsSync(join(ROOT, "app/beheer/_strings.ts"))) {
    out.push(...blockEntries("app/beheer/_strings.ts", /export const S\b[^=]*=\s*\{/g, "beheer", "je", "nl"));
  }
  for (const file of walkFiles("emails", /\.tsx?$/)) {
    out.push(...blockEntries(file, /\b[A-Z_]*COPY\b[^=\n]*=\s*\{/g, "email", "email", "nl"));
  }
  return out;
}

/* Regels -------------------------------------------------------------------------------- */

const findings = [];
function report(entry, rule, severity, message) {
  findings.push({
    rule,
    severity: WARN_ONLY ? "warning" : severity,
    where: `${entry.source}${entry.line ? `:${entry.line}` : ""} ${entry.path}`,
    message,
    fixtureRule: entry.rule ?? null,
  });
}

const lastKey = (path) => path.split(".").pop().replace(/\[\d+\]$/, "");
const parentPath = (path) => path.replace(/(\.[^.[]+|\[\d+\])$/, "");
const ACTIVE_EMAIL_RULES = new Set(["C-01", "C-02", "C-07", "C-11", "C-20"]);

function isButton(entry) {
  const key = lastKey(entry.path);
  if (key === "submitting" || key === "pending" || /Link$/.test(key)) return false;
  if (key === "submit" || key === "retry") return true;
  const parentKey = lastKey(parentPath(entry.path));
  return parentKey === "cta" && entry.parent && !Array.isArray(entry.parent) && !("title" in entry.parent);
}
function isTextLink(entry) {
  const key = lastKey(entry.path);
  const parentKey = lastKey(parentPath(entry.path));
  return /Link$/.test(key) || parentKey === "links" || parentKey === "nav" || key === "home";
}
const isHeading = (entry) => ["title", "metaTitle", "accent"].includes(lastKey(entry.path));

function checkEntry(entry, stats) {
  const raw = entry.value;
  if (/\bTODO\b/.test(raw) || /^https?:\/\//.test(raw.trim())) return;
  const text = plain(raw);
  const nl = entry.locale === "nl";
  const active = (rule) => entry.kind !== "email" || ACTIVE_EMAIL_RULES.has(rule);
  const legal = entry.kind === "legal";

  // C-01 uitroepteken
  if (active("C-01") && raw.includes("!")) report(entry, "C-01", "error", `uitroepteken: "${raw}"`);
  // C-02 streepjes
  if (active("C-02") && (/[–—]/.test(raw) || /\s-\s/.test(text) || /\d\s*-\s*\d/.test(text.replace(/\b\d{4}-\d{2}-\d{2}\b/g, "")))) {
    report(entry, "C-02", "error", `streepje in een zin: "${raw}"`);
  }
  // C-20 emoji
  if (active("C-20") && /\p{Extended_Pictographic}/u.test(raw.replace(/[©®™]/g, ""))) report(entry, "C-20", "error", `emoji: "${raw}"`);
  // C-07 we
  if (active("C-07") && nl && /(?<![\p{L}])we(?![\p{L}])/iu.test(text)) report(entry, "C-07", "error", `"we" in plaats van "wij": "${raw}"`);
  // C-11 lijst A
  if (active("C-11")) {
    const hay = LIST_A_ALLOWED.reduce((s, re) => s.replace(re, ""), text);
    const hit = (nl ? RE_LIST_A_NL : RE_LIST_A_EN).exec(hay);
    if (hit) report(entry, "C-11", "error", `verboden woord "${hit[1]}": "${raw}"`);
  }
  if (entry.kind === "email") return;

  const sents = sentences(text);
  // Zinnen die alleen uit een parameter bestaan ("{wage}.") tellen niet als zin.
  const realSents = sents.filter((s) => !/^X[.?!]?$/.test(s));
  const wordCount = words(text).length;

  if (nl) {
    // C-03 zinslengte
    const max = legal ? 35 : entry.zone === "je" ? 22 : 30;
    for (const s of sents) {
      if (words(s).length > max) report(entry, "C-03", "error", `zin van ${words(s).length} woorden (max ${max}): "${s}"`);
    }
    // In fixturemodus telt alleen de groep van C-04 mee voor het gemiddelde.
    if (stats && wordCount >= 4 && (!FIXTURE || entry.rule === "C-04")) {
      const key = entry.kind === "messages" ? entry.path.split(".")[0] : entry.source;
      const st = stats.get(key) ?? { strings: 0, sentences: 0, words: 0, twoSentence: 0, zone: entry.zone };
      st.strings++;
      st.sentences += sents.length;
      st.words += sents.reduce((n, s) => n + words(s).length, 0);
      if (sents.length === 2) st.twoSentence++;
      if (entry.zone === "je") st.zone = "je";
      stats.set(key, st);
    }
    // C-08 men, & in een zin, verboden afkortingen
    if (/(?<![\p{L}])men(?![\p{L}])/iu.test(text)) report(entry, "C-08", "error", `"men": "${raw}"`);
    else if (text.includes("&") && wordCount >= 3) report(entry, "C-08", "error", `"&" in een zin: "${raw}"`);
    else if (RE_BAD_ABBR.test(text)) report(entry, "C-08", "error", `afkorting "${RE_BAD_ABBR.exec(text)[1]}": "${raw}"`);
    // C-09 en C-10 aanspreekvorm
    const je = /(?<![\p{L}])(je|jij|jou|jouw)(?![\p{L}])/iu.test(text);
    const u = /(?<![\p{L}'’])(u|uw)(?![\p{L}'’])/iu.test(text);
    if (je && u) report(entry, "C-09", "error", `je en u in één waarde: "${raw}"`);
    else if (!legal) {
      const exempt = ZONE_EXEMPT.some((p) => entry.path.startsWith(`${p}.`) || entry.path === p);
      if (!exempt) {
        if (entry.zone === "je" && u) report(entry, "C-10", "error", `u-vorm in een je-zone: "${raw}"`);
        else if ((entry.zone === "u" || entry.zone === "neutral") && je) {
          report(entry, "C-10", "error", `je-vorm in een ${entry.zone === "u" ? "u-zone" : "neutrale waarde zonder marker"}: "${raw}"`);
        }
      }
    }
    // C-12 lijst B, C-13 moeilijke woorden
    // Een vraag beschrijft de wens van de lezer, geen belofte ("Heeft u snel mensen nodig?", B-22).
    const claimText = sents.filter((x) => !x.trim().endsWith("?")).join(" ");
    const b = C12_EXEMPT.has(entry.path) ? null : RE_LIST_B_NL.exec(claimText);
    if (b && !/\d/.test(text)) report(entry, "C-12", "warning", `woord "${b[1]}" zonder concreet feit: "${raw}"`);
    const hard = RE_HARD.exec(text);
    if (hard && entry.zone === "je") report(entry, "C-13", "warning", `moeilijk woord "${hard[1]}" in een je-zone: "${raw}"`);
    // C-17 notatie
    if (/€\d/.test(raw) || /\b\d{1,2}:\d{2}\b/.test(text) || /\b\d{1,2}u\b/.test(text) || /p\/u/i.test(text) || /\bma\s*-\s*vr\b|\bma t\/m vr\b/i.test(text)) {
      report(entry, "C-17", "error", `notatie (euroteken, tijd of dagen): "${raw}"`);
    }
  }

  // C-05 meer dan drie zinnen
  if (!legal && realSents.length > 3) report(entry, "C-05", "warning", `${realSents.length} zinnen in één waarde`);
  // C-06 zin van één woord
  if (sents.length > 1 && !isHeading(entry)) {
    // Een parameter ({url}, {wage}) als losse "zin" is geen fragment.
    const single = sents.find((s) => words(s).length === 1 && !/^X[.?!]?$/.test(s));
    if (single) report(entry, "C-06", "error", `zin van één woord "${single}": "${raw}"`);
  }
  // C-14 knoppen en tekstlinks
  if (entry.kind === "messages") {
    const n = words(plain(raw).replace(/X/g, "x")).length;
    if (isButton(entry) && n > 3) report(entry, "C-14", "error", `knoplabel van ${n} woorden: "${raw}"`);
    else if (isTextLink(entry) && n > 6) report(entry, "C-14", "error", `tekstlink van ${n} woorden: "${raw}"`);
  }
  // C-15 koppen
  const key = lastKey(entry.path);
  // In _strings.ts heten foutmeldingen soms naar het veld (validation.publish.title); dat zijn geen koppen.
  const headingKey = (key === "title" || key === "metaTitle" || key === "accent") && !(entry.kind === "beheer" && /(^|\.)validation\./.test(entry.path));
  if (headingKey) {
    const trimmed = text.trim();
    // Een tijd als 07:00 (Engelse notatie, §6.6) is geen dubbele punt in de kop.
    if (/[^.]\.$/.test(trimmed) || /:(?!\d)/.test(trimmed.replace(/\d:\d/g, ""))) report(entry, "C-15", "error", `kop eindigt op een punt of bevat een dubbele punt: "${raw}"`);
    if (key === "title" && entry.parent && typeof entry.parent.accent === "string") {
      const total = words(`${trimmed} ${plain(entry.parent.accent)}`).length;
      if (total > 12) report(entry, "C-15", "warning", `kop van ${total} woorden (title plus accent)`);
    }
  }
  // C-16 FAQ-vraag
  if (key === "q" && !text.trim().endsWith("?")) report(entry, "C-16", "error", `FAQ-vraag zonder vraagteken: "${raw}"`);
  // C-18 rich text
  const tags = [...raw.matchAll(/<\/?([a-zA-Z][\w-]*)>/g)].map((m) => m[1]);
  if (tags.some((t) => !["accent", "link", "strong"].includes(t)) || (raw.match(/<accent>/g) ?? []).length > 1) {
    report(entry, "C-18", "error", `ongeldige rich text: "${raw}"`);
  }
  // C-22 metabeschrijving
  if (/(^|\.)meta\.description$/.test(entry.path) && !/^(bedankt|notFound)\./.test(entry.path)) {
    const len = raw.length;
    if (len < 120 || len > 160) report(entry, "C-22", "warning", `metabeschrijving van ${len} tekens (doel 120 tot 160)`);
  }
  // C-23 WhatsApp-voorinvultekst
  if (/^common\.whatsapp\./.test(entry.path) && raw.length > 160) report(entry, "C-23", "error", `WhatsApp-tekst van ${raw.length} tekens (max 160)`);
}

/* Uitvoeren ------------------------------------------------------------------------------- */

const entries = collect();
const stats = new Map();
for (const e of entries) checkEntry(e, stats);

// C-04 gemiddelde zinslengte per namespace of bestand
for (const [key, st] of stats) {
  if (!st.sentences) continue;
  const avg = st.words / st.sentences;
  const limit = st.zone === "je" ? 15 : 18;
  if (avg > limit) {
    report({ source: key, path: "", locale: "nl" }, "C-04", "warning", `gemiddeld ${avg.toFixed(1)} woorden per zin (doel hoogstens ${limit})`);
  }
}

// C-19 Engelse waarde gelijk aan de Nederlandse (vier woorden of meer)
const byPath = new Map();
for (const e of entries.filter((x) => x.kind === "messages")) {
  const k = `${e.rule ?? ""}|${e.path}`;
  const slot = byPath.get(k) ?? {};
  slot[e.locale] = e;
  byPath.set(k, slot);
}
for (const { nl, en } of byPath.values()) {
  if (nl && en && nl.value === en.value && words(plain(nl.value).replace(/\bX\b/g, "")).length >= 4 && !/\bTODO\b/.test(nl.value)) {
    report(en, "C-19", "warning", `Engelse waarde gelijk aan de Nederlandse: "${en.value}"`);
  }
}

// C-21 acht gelijke woorden met een vergelijkingsbron
if (COMPARE) {
  const grams = new Set();
  const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
  for (const file of walkFiles(relative(ROOT, COMPARE) || COMPARE, /\.(json|tsx?|md|txt|html)$/)) {
    const w = norm(readFileSync(join(ROOT, file), "utf8"));
    for (let i = 0; i + 8 <= w.length; i++) grams.add(w.slice(i, i + 8).join(" "));
  }
  for (const e of entries.filter((x) => x.locale === "nl")) {
    const w = norm(plain(e.value));
    for (let i = 0; i + 8 <= w.length; i++) {
      if (grams.has(w.slice(i, i + 8).join(" "))) {
        report(e, "C-21", "error", `acht gelijke woorden met de brontekst: "${w.slice(i, i + 8).join(" ")}"`);
        break;
      }
    }
  }
}

const errors = findings.filter((f) => f.severity === "error");
const warnings = findings.filter((f) => f.severity === "warning");

if (JSON_OUT) {
  console.log(JSON.stringify({ errors, warnings, strings: entries.length }, null, 2));
} else {
  console.log(`Copycontrole: ${errors.length} fout(en), ${warnings.length} waarschuwing(en) in ${entries.length} teksten.`);
  for (const f of errors) console.log(`  ✗ [${f.rule}] ${f.where}: ${f.message}`);
  for (const f of warnings) console.log(`  · [${f.rule}] ${f.where}: ${f.message}`);
  if (REPORT) {
    console.log("\nPer namespace of bestand (nl): strings, gemiddelde zinslengte, aandeel tweezinswaarden");
    for (const [key, st] of [...stats].sort()) {
      const avg = st.sentences ? (st.words / st.sentences).toFixed(1) : "0";
      console.log(`  ${key}: ${st.strings} strings, ${avg} woorden per zin, ${Math.round((st.twoSentence / st.strings) * 100)}% twee zinnen`);
    }
  }
}
process.exit(errors.length > 0 && !WARN_ONLY ? 1 : 0);
