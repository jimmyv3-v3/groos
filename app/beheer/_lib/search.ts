/**
 * Zoektermen voor PostgREST-filters (spec 08 §4.2). Maximaal 80 tekens, kleine
 * letters, hoogstens drie woorden; tekens die een .or()-filter kunnen breken
 * gaan eruit. Een woord van minimaal 6 cijfers wordt een telefoonzoekterm
 * zonder voorloopnul (en zonder 31 als landnummer).
 */
export type SearchTerm = { kind: "text"; value: string } | { kind: "phone"; value: string };

export function sanitizeSearch(q: string | null | undefined): string[] {
  if (!q) return [];
  return q
    .slice(0, 80)
    .toLowerCase()
    .replace(/[,()*%\\:"']/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean)
    .slice(0, 3);
}

/** Zoals sanitizeSearch, maar herkent telefoonnummers ("06 12 34 56 78" telt als één term). */
export function searchTerms(q: string | null | undefined): SearchTerm[] {
  if (!q) return [];
  const compact = q.replace(/[\s\-.()]/g, "");
  if (/^\+?\d{6,}$/.test(compact)) {
    return [{ kind: "phone", value: compact.replace(/^\+?31/, "").replace(/^0+/, "") }];
  }
  return sanitizeSearch(q).map((w) =>
    /^\d{6,}$/.test(w) ? { kind: "phone", value: w.replace(/^0+/, "") } : { kind: "text", value: w },
  );
}
