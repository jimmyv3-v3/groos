import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "vitest";

// AC-03-02: common, meta, header, footer, notFound en error bevatten exact de
// sleutelboom van spec 03 §6.14 (nl) en §6.15 (en). De test leest de
// JSON-blokken uit de spec zelf, zodat spec en messages niet uit elkaar lopen.

const NAMESPACES = ["common", "meta", "header", "footer", "notFound", "error"] as const;
type Tree = Record<string, unknown>;

function specTree(section: "6.14" | "6.15"): Tree {
  const md = readFileSync("docs/specs/03-content-tone-of-voice-en-tekstsleutels.md", "utf8");
  const start = md.indexOf(`### ${section} `);
  assert.ok(start >= 0, `§${section} niet gevonden`);
  const block = /```json\n([\s\S]*?)\n```/.exec(md.slice(start));
  assert.ok(block, `geen JSON-blok in §${section}`);
  return JSON.parse(block[1]) as Tree;
}

function flatten(value: unknown, path = "", out: Record<string, unknown> = {}): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const [k, v] of Object.entries(value)) flatten(v, path ? `${path}.${k}` : k, out);
  } else {
    out[path] = value;
  }
  return out;
}

for (const [locale, section] of [
  ["nl", "6.14"],
  ["en", "6.15"],
] as const) {
  describe(`messages/${locale} volgt spec 03 §${section}`, () => {
    const spec = specTree(section);
    for (const ns of NAMESPACES) {
      it(`${ns}.json heeft exact de sleutels en teksten van de spec`, () => {
        const actual = JSON.parse(readFileSync(`messages/${locale}/${ns}.json`, "utf8")) as Tree;
        assert.deepEqual(flatten(actual, ns), flatten(spec[ns], ns));
      });
    }
  });
}
