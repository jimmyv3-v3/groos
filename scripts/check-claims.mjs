// Claimcontrole (spec 09 §10 blok A stap 11, CL-01 tot en met CL-22 en VR-regels).
// Leest lib/compliance/copy-rules.json, scant .ts, .tsx, .json en .sql en drukt per
// regel-id de treffers af als `bestand:regel  fragment` met de toelichting.
// Zonder vlag altijd exitcode 0; met --strict exitcode 1 bij een treffer met level "block".
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const strict = process.argv.includes("--strict");
const config = JSON.parse(readFileSync(join(ROOT, "lib/compliance/copy-rules.json"), "utf8"));
const EXT = /\.(ts|tsx|json|sql)$/;
const SKIP_DIRS = new Set(["node_modules", ".next", ".git"]);

const toPosix = (p) => p.split(sep).join("/");
const ignored = (rel) => config.ignore.some((i) => rel === i || rel.startsWith(`${i}/`));

function walk(path, out) {
  if (!existsSync(path)) return out;
  const rel = toPosix(relative(ROOT, path));
  if (rel && ignored(rel)) return out;
  const stat = statSync(path);
  if (stat.isDirectory()) {
    for (const name of readdirSync(path)) if (!SKIP_DIRS.has(name)) walk(join(path, name), out);
  } else if (EXT.test(path)) {
    out.push(rel);
  }
  return out;
}

const allow = new Map();
for (const a of config.allow) {
  const set = allow.get(a.rule) ?? new Set();
  for (const f of a.files) set.add(f);
  allow.set(a.rule, set);
}

const rules = config.rules.map((r) => ({ ...r, re: new RegExp(r.pattern, r.flags ?? "") }));
const files = config.scan.flatMap((p) => walk(join(ROOT, p), []));
const hits = new Map();

for (const file of files) {
  const lines = readFileSync(join(ROOT, file), "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const rule of rules) {
      if (allow.get(rule.id)?.has(file)) continue;
      const m = rule.re.exec(line);
      if (!m) continue;
      const start = Math.max(0, m.index - 40);
      const fragment = line.slice(start, m.index + m[0].length + 40).trim();
      const list = hits.get(rule.id) ?? [];
      list.push(`${file}:${i + 1}  ${fragment}`);
      hits.set(rule.id, list);
    }
  });
}

let blocking = 0;
let total = 0;
for (const rule of rules) {
  const list = hits.get(rule.id);
  if (!list) continue;
  total += list.length;
  if (rule.level === "block") blocking += list.length;
  console.log(`\n[${rule.id}] ${rule.level === "block" ? "BLOKKEERT" : "controleren"}: ${rule.note}`);
  for (const line of list) console.log(`  ${line}`);
}

console.log(
  `\nClaimcontrole: ${total} treffer(s) in ${files.length} bestanden, waarvan ${blocking} blokkerend.` +
    (total ? " Beoordeel elke treffer: regel met TODO, item met claim-veld, of een allow-regel." : ""),
);
process.exit(strict && blocking > 0 ? 1 : 0);
