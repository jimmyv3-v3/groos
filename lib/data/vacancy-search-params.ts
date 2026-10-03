/**
 * Parsen en opbouwen van de filterparameters van /vacatures (spec 10 §4.3,
 * B-16). Client-veilig. Onbekende waarden worden genegeerd.
 */
import { HOURS_BUCKETS, OCCUPATION_SLUGS, SHIFTS, VACANCY_SORTS } from "./options";
import type { HoursBucketId, OccupationSlug, ShiftSlug } from "./options";
import type { VacancyFilters, VacancySort } from "./types";

export type VacancySearchState = {
  filters: VacancyFilters;
  page: number;
  sort: VacancySort;
  isFiltered: boolean;
};

type RawParams = Record<string, string | string[] | undefined>;

const Q_MAX = 80;
const CITY_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const OCCUPATIONS = new Set<string>(OCCUPATION_SLUGS);
const BUCKETS = new Set<string>(HOURS_BUCKETS.map((b) => b.id));
const SHIFT_SLUGS = new Set<string>(SHIFTS.map((s) => s.slug));

/** Alle waarden van een parameter, herhaald (?a=1&a=2) of met komma's (?a=1,2). */
function values(raw: string | string[] | undefined): string[] {
  const list = Array.isArray(raw) ? raw : raw === undefined ? [] : [raw];
  const out: string[] = [];
  for (const item of list) {
    for (const part of item.split(",")) {
      const value = part.trim().toLowerCase();
      if (value && !out.includes(value)) out.push(value);
    }
  }
  return out;
}

function first(raw: string | string[] | undefined): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw;
}

export function parseVacancySearchParams(sp: RawParams): VacancySearchState {
  const filters: VacancyFilters = {};

  const q = first(sp.q)?.trim().replace(/\s+/g, " ").slice(0, Q_MAX);
  if (q) filters.q = q;

  const beroep = values(sp.beroep).filter((v): v is OccupationSlug => OCCUPATIONS.has(v));
  if (beroep.length) filters.beroep = beroep;

  const plaats = values(sp.plaats).filter((v) => CITY_SLUG.test(v) && v.length <= 80);
  if (plaats.length) filters.plaats = plaats;

  const uren = values(sp.uren).filter((v): v is HoursBucketId => BUCKETS.has(v));
  if (uren.length) filters.uren = uren;

  const dienst = values(sp.dienst).filter((v): v is ShiftSlug => SHIFT_SLUGS.has(v));
  if (dienst.length) filters.dienst = dienst;

  const sortSlug = first(sp.sortering)?.trim().toLowerCase();
  const sort: VacancySort = VACANCY_SORTS.find((s) => s.slug === sortSlug)?.id ?? "newest";

  const pageNumber = Number.parseInt(first(sp.pagina) ?? "", 10);
  const page = Number.isFinite(pageNumber) && pageNumber >= 1 ? pageNumber : 1;

  const isFiltered = Object.keys(filters).length > 0 || sort !== "newest";
  return { filters, page, sort, isFiltered };
}

/** Vaste volgorde q, beroep, plaats, uren, dienst, sortering, pagina; standaardwaarden vallen weg. */
export function buildVacancySearchParams(state: Partial<VacancySearchState>): URLSearchParams {
  const params = new URLSearchParams();
  const f = state.filters ?? {};
  if (f.q?.trim()) params.set("q", f.q.trim().slice(0, Q_MAX));
  for (const v of f.beroep ?? []) params.append("beroep", v);
  for (const v of f.plaats ?? []) params.append("plaats", v);
  for (const v of f.uren ?? []) params.append("uren", v);
  for (const v of f.dienst ?? []) params.append("dienst", v);
  const sortSlug = VACANCY_SORTS.find((s) => s.id === state.sort)?.slug;
  if (state.sort && state.sort !== "newest" && sortSlug) params.set("sortering", sortSlug);
  if (state.page && state.page > 1) params.set("pagina", String(state.page));
  return params;
}

/** "glazenwasser-den-haag-1001" geeft 1001; zonder nummer van minimaal 1001 null. */
export function parseVacancySlug(slug: string): number | null {
  const match = /(?:^|-)(\d+)$/.exec(slug);
  if (!match) return null;
  const number = Number(match[1]);
  return Number.isSafeInteger(number) && number >= 1001 ? number : null;
}
