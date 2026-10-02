import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import type { Database } from "@/lib/database.types";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { publicMediaUrl } from "@/lib/supabase/public-media";
import { VACANCIES_TAG, vacancyTag } from "./cache-tags";
import { loadActiveOccupations } from "./occupation-loader";
import { HOURS_BUCKETS, OCCUPATION_SLUGS, SHIFTS } from "./options";
import type { CloseReason, HoursBucketId, OccupationSlug, Province, ShiftId, ShiftSlug } from "./options";
import type {
  VacancyDetail,
  VacancyFacets,
  VacancyFilters,
  VacancyListItem,
  VacancyListResult,
  VacancySort,
  VacancyState,
} from "./types";

/**
 * Gecachte leesfuncties voor de publieke vacaturebank (spec 10 §4.3 en §4.4).
 * Alles leest via de view public_vacancies met de publishable key, dus door
 * RLS heen.
 *
 * Fouten (bijvoorbeeld zolang de migraties nog niet op het project staan)
 * worden gelogd en geven een leeg resultaat; ze worden niet gecachet, zodat
 * de eerstvolgende aanroep het opnieuw probeert. Spec 10 §4.3 punt 10 gooide
 * hier een Error; de bouwopdracht van stap 1 vraagt om zacht falen.
 */

type PublicVacancyRow = Database["public"]["Views"]["public_vacancies"]["Row"];

/** Lijstitem plus de genormaliseerde zoektekst en updatedAt (alleen intern). */
type OpenVacancy = VacancyListItem & { searchText: string; updatedAt: string };

const REVALIDATE_SECONDS = 3600;
const MAX_OPEN_IN_MEMORY = 500;
const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 48;
const SUMMARY_MAX = 200;

const LIST_COLUMNS = [
  "id",
  "number",
  "slug",
  "title",
  "summary",
  "intro",
  "tasks",
  "occupation_slug",
  "occupation_name_nl",
  "occupation_plural_nl",
  "occupation_name_en",
  "occupation_plural_en",
  "city",
  "city_slug",
  "location_label",
  "contract_type",
  "hours_min",
  "hours_max",
  "shifts",
  "salary_min",
  "salary_max",
  "is_featured",
  "is_urgent",
  "start_asap",
  "start_date",
  "published_at",
  "closes_at",
  "updated_at",
  "state",
].join(", ");

const SHIFT_ID_BY_SLUG = new Map<string, ShiftId>(SHIFTS.map((s) => [s.slug, s.id]));

// ---------------------------------------------------------------------------
// Hulpfuncties
// ---------------------------------------------------------------------------

function logFailure(where: string, error: unknown): void {
  const message = error instanceof Error ? error.message : JSON.stringify(error);
  console.error(`[lib/data/vacancies] ${where} mislukt, leeg resultaat: ${message}`);
}

function supabaseError(where: string, error: { message: string; code?: string }): Error {
  return new Error(`${where}: ${error.message}${error.code ? ` (${error.code})` : ""}`);
}

/** Kleine letters, zonder diakrieten, 's-Gravenhage als Den Haag, leestekens als spatie. */
export function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’]?s-gravenhage/g, "den haag")
    .replace(/[^a-z0-9€]+/g, " ")
    .trim();
}

function summaryFrom(summary: string | null, intro: string | null): string {
  if (summary?.trim()) return summary.trim();
  const text = (intro ?? "").trim().replace(/\s+/g, " ");
  if (text.length <= SUMMARY_MAX) return text;
  const sentences = text.match(/[^.?]+[.?]+/g) ?? [];
  let out = "";
  for (const sentence of sentences) {
    const next = (out + sentence).trim();
    if (next.length > SUMMARY_MAX) break;
    out = next + " ";
  }
  out = out.trim();
  if (out) return out;
  const cut = text.slice(0, SUMMARY_MAX - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 0 ? cut.lastIndexOf(" ") : cut.length)}…`;
}

function isOccupationSlug(value: string | null): value is OccupationSlug {
  return value !== null && (OCCUPATION_SLUGS as readonly string[]).includes(value);
}

function toListItem(row: PublicVacancyRow): VacancyListItem | null {
  if (
    !row.id ||
    !row.number ||
    !row.slug ||
    !row.title ||
    !isOccupationSlug(row.occupation_slug) ||
    !row.city ||
    !row.city_slug ||
    row.hours_min === null ||
    row.hours_max === null ||
    row.salary_min === null ||
    row.salary_max === null ||
    !row.contract_type ||
    !row.closes_at ||
    (row.state !== "open" && row.state !== "closed")
  ) {
    return null;
  }
  return {
    id: row.id,
    number: row.number,
    slug: row.slug,
    path: `/vacatures/${row.slug}`,
    title: row.title,
    summary: summaryFrom(row.summary, row.intro),
    occupation: {
      slug: row.occupation_slug,
      nameNl: row.occupation_name_nl ?? row.occupation_slug,
      pluralNl: row.occupation_plural_nl ?? row.occupation_slug,
      nameEn: row.occupation_name_en ?? row.occupation_slug,
      pluralEn: row.occupation_plural_en ?? row.occupation_slug,
    },
    city: row.city,
    citySlug: row.city_slug,
    locationLabel: row.location_label,
    contractType: row.contract_type,
    hoursMin: Number(row.hours_min),
    hoursMax: Number(row.hours_max),
    shifts: row.shifts ?? [],
    salaryMin: Number(row.salary_min),
    salaryMax: Number(row.salary_max),
    isFeatured: Boolean(row.is_featured),
    isUrgent: Boolean(row.is_urgent),
    startAsap: row.start_asap ?? true,
    startDate: row.start_date,
    // Een open vacature heeft altijd een publicatiemoment; publish_at valt terug op closes_at.
    publishedAt: row.published_at ?? row.closes_at,
    closesAt: row.closes_at,
    state: row.state as VacancyState,
  };
}

function toOpenVacancy(row: PublicVacancyRow): OpenVacancy | null {
  const item = toListItem(row);
  if (!item) return null;
  const searchText = normalizeSearchText(
    [
      item.title,
      item.city,
      item.locationLabel ?? "",
      item.occupation.nameNl,
      item.occupation.pluralNl,
      item.occupation.nameEn,
      item.occupation.pluralEn,
      item.summary,
      row.intro ?? "",
      ...(row.tasks ?? []),
    ].join(" "),
  );
  return { ...item, searchText, updatedAt: row.updated_at ?? item.publishedAt };
}

function toDetail(row: PublicVacancyRow): VacancyDetail | null {
  const item = toListItem(row);
  if (!item) return null;
  const required = row.required_qualifications ?? [];
  const preferred = row.preferred_qualifications ?? [];
  const closed = item.state === "closed";
  return {
    ...item,
    intro: row.intro ?? "",
    tasks: row.tasks ?? [],
    requirements: row.requirements ?? [],
    offer: row.offer ?? [],
    extra: row.extra,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    postalCode: row.postal_code,
    province: (row.province ?? "Zuid-Holland") as Province,
    positionsCount: row.positions_count ?? 1,
    salaryNote: row.salary_note,
    educationLevel: row.education_level ?? "none",
    experienceLevel: row.experience_level ?? "none",
    experienceMonths: row.experience_months,
    requiredQualifications: required,
    preferredQualifications: preferred,
    trainingOffered: row.training_offered ?? [],
    minAge18: Boolean(row.min_age_18),
    minAgeReason: row.min_age_reason,
    // Zonder de kolom (migratie kruiscontrole_1 nog niet toegepast) is de waarde undefined.
    workplaceLanguage: row.workplace_language ?? null,
    allowWhatsappApply: row.allow_whatsapp_apply ?? true,
    asksDrivingLicenseB: required.includes("rijbewijs_b") || preferred.includes("rijbewijs_b"),
    imageUrl: publicMediaUrl(row.image_path),
    contact: row.contact_name
      ? {
          name: row.contact_name,
          phoneE164: row.contact_phone,
          whatsappE164: row.contact_whatsapp,
          photoUrl: publicMediaUrl(row.contact_photo_path),
        }
      : null,
    closedAt: closed ? row.closed_at : null,
    closeReason: closed ? (row.close_reason as CloseReason | null) : null,
    updatedAt: row.updated_at ?? item.publishedAt,
  };
}

function stripInternal(v: OpenVacancy): VacancyListItem {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { searchText, updatedAt, ...item } = v;
  return item;
}

// ---------------------------------------------------------------------------
// Loaders (gecachet; gooien bij een fout, zodat een fout niet gecachet wordt)
// ---------------------------------------------------------------------------

const loadOpenVacanciesCached = unstable_cache(
  async (): Promise<OpenVacancy[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("public_vacancies")
      .select(LIST_COLUMNS)
      .eq("state", "open")
      .overrideTypes<PublicVacancyRow[], { merge: false }>();
    if (error) throw supabaseError("public_vacancies (open)", error);
    const rows = (data ?? []).map(toOpenVacancy).filter((v): v is OpenVacancy => v !== null);
    if (rows.length > MAX_OPEN_IN_MEMORY) {
      console.warn(
        `[lib/data/vacancies] ${rows.length} open vacatures; filteren in het geheugen moet naar de database (spec 10 §4.3, fase 2).`,
      );
    }
    return rows;
  },
  ["groos:vacatures:open:v1"],
  { tags: [VACANCIES_TAG], revalidate: REVALIDATE_SECONDS },
);

/** Alle open vacatures; [] als Supabase niet geconfigureerd is of de query faalt. */
async function loadOpenVacancies(): Promise<OpenVacancy[]> {
  if (!hasSupabaseEnv()) {
    console.warn("[lib/data/vacancies] Supabase is niet geconfigureerd; geen vacatures.");
    return [];
  }
  try {
    return await loadOpenVacanciesCached();
  } catch (error) {
    logFailure("open vacatures laden", error);
    return [];
  }
}

function loadVacancyByNumberCached(number: number): Promise<PublicVacancyRow | null> {
  return unstable_cache(
    async (): Promise<PublicVacancyRow | null> => {
      const supabase = createSupabasePublicClient();
      const { data, error } = await supabase
        .from("public_vacancies")
        .select("*")
        .eq("number", number)
        .maybeSingle();
      if (error) throw supabaseError(`public_vacancies (${number})`, error);
      return data;
    },
    ["groos:vacature", String(number), "v1"],
    { tags: [VACANCIES_TAG, vacancyTag(number)], revalidate: REVALIDATE_SECONDS },
  )();
}

// ---------------------------------------------------------------------------
// Filteren, tellen en sorteren in het geheugen
// ---------------------------------------------------------------------------

type Group = "beroep" | "plaats" | "uren" | "dienst";

function searchWords(q: string | undefined): string[] {
  if (!q) return [];
  return normalizeSearchText(q.slice(0, 80)).split(" ").filter(Boolean).slice(0, 6);
}

function matchesBucket(v: OpenVacancy, id: HoursBucketId): boolean {
  const bucket = HOURS_BUCKETS.find((b) => b.id === id);
  return bucket ? v.hoursMin <= bucket.max && v.hoursMax >= bucket.min : false;
}

function matchesShift(v: OpenVacancy, slug: ShiftSlug): boolean {
  const id = SHIFT_ID_BY_SLUG.get(slug);
  return id ? v.shifts.includes(id) : false;
}

function matchesGroup(v: OpenVacancy, group: Group, filters: VacancyFilters): boolean {
  switch (group) {
    case "beroep":
      return !filters.beroep?.length || filters.beroep.includes(v.occupation.slug);
    case "plaats":
      return !filters.plaats?.length || filters.plaats.includes(v.citySlug);
    case "uren":
      return !filters.uren?.length || filters.uren.some((id) => matchesBucket(v, id));
    case "dienst":
      return !filters.dienst?.length || filters.dienst.some((slug) => matchesShift(v, slug));
  }
}

const GROUPS: Group[] = ["beroep", "plaats", "uren", "dienst"];

/** Binnen een groep OF, tussen groepen EN; `except` laat één groep weg (voor de tellers). */
function applyFilters(all: OpenVacancy[], filters: VacancyFilters, except?: Group): OpenVacancy[] {
  const words = searchWords(filters.q);
  return all.filter(
    (v) =>
      words.every((w) => v.searchText.includes(w)) &&
      GROUPS.every((g) => g === except || matchesGroup(v, g, filters)),
  );
}

function compareNewest(a: OpenVacancy, b: OpenVacancy): number {
  if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
  if (a.publishedAt !== b.publishedAt) return a.publishedAt < b.publishedAt ? 1 : -1;
  return b.number - a.number;
}

function sortVacancies(list: OpenVacancy[], sort: VacancySort): OpenVacancy[] {
  const copy = [...list];
  if (sort === "salary") {
    copy.sort((a, b) => b.salaryMax - a.salaryMax || compareNewest(a, b));
  } else if (sort === "closing") {
    copy.sort((a, b) => (a.closesAt < b.closesAt ? -1 : a.closesAt > b.closesAt ? 1 : compareNewest(a, b)));
  } else {
    copy.sort(compareNewest);
  }
  return copy;
}

// ---------------------------------------------------------------------------
// Publieke functies
// ---------------------------------------------------------------------------

export async function getVacancyList(input: {
  filters?: VacancyFilters;
  sort?: VacancySort;
  page?: number;
  pageSize?: number;
} = {}): Promise<VacancyListResult> {
  const pageSize = Math.min(Math.max(Math.trunc(input.pageSize ?? DEFAULT_PAGE_SIZE), 1), MAX_PAGE_SIZE);
  const page = Math.max(Math.trunc(input.page ?? 1), 1);
  const all = await loadOpenVacancies();
  const filtered = sortVacancies(applyFilters(all, input.filters ?? {}), input.sort ?? "newest");
  const total = filtered.length;
  const pageCount = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  return {
    items: filtered.slice(start, start + pageSize).map(stripInternal),
    total,
    page,
    pageSize,
    pageCount,
    outOfRange: pageCount > 0 && page > pageCount,
  };
}

export async function getVacancyFacets(filters: VacancyFilters = {}): Promise<VacancyFacets> {
  const [all, occupations] = await Promise.all([loadOpenVacancies(), loadOccupationsSafe()]);
  const total = applyFilters(all, filters).length;

  const forBeroep = applyFilters(all, filters, "beroep");
  const occupationOrder =
    occupations.length > 0
      ? occupations.map((o) => ({ slug: o.slug, nameNl: o.nameNl }))
      : OCCUPATION_SLUGS.map((slug) => ({
          slug,
          nameNl: all.find((v) => v.occupation.slug === slug)?.occupation.nameNl ?? slug,
        }));
  const beroep = occupationOrder.map((o) => ({
    slug: o.slug,
    nameNl: o.nameNl,
    count: forBeroep.filter((v) => v.occupation.slug === o.slug).length,
  }));

  const forPlaats = applyFilters(all, filters, "plaats");
  const cities = new Map<string, string>();
  for (const v of all) if (!cities.has(v.citySlug)) cities.set(v.citySlug, v.city);
  const plaats = [...cities]
    .map(([slug, name]) => ({ slug, name, count: forPlaats.filter((v) => v.citySlug === slug).length }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "nl"));

  const forUren = applyFilters(all, filters, "uren");
  const uren = HOURS_BUCKETS.map((b) => ({ id: b.id, count: forUren.filter((v) => matchesBucket(v, b.id)).length }));

  const forDienst = applyFilters(all, filters, "dienst");
  const dienst = SHIFTS.map((s) => ({ slug: s.slug, count: forDienst.filter((v) => matchesShift(v, s.slug)).length }));

  return { total, beroep, plaats, uren, dienst };
}

/** Open of gesloten (tot 30 dagen); anders null. Eén lezing per request dankzij cache(). */
export const getVacancyByNumber = cache(async (number: number): Promise<VacancyDetail | null> => {
  if (!Number.isInteger(number) || number < 1001) return null;
  if (!hasSupabaseEnv()) {
    console.warn("[lib/data/vacancies] Supabase is niet geconfigureerd; geen vacature.");
    return null;
  }
  try {
    const row = await loadVacancyByNumberCached(number);
    return row ? toDetail(row) : null;
  } catch (error) {
    logFailure(`vacature ${number} laden`, error);
    return null;
  }
});

export async function getLatestVacancies(
  options: { limit?: number; occupation?: OccupationSlug } = {},
): Promise<VacancyListItem[]> {
  const all = await loadOpenVacancies();
  const list = options.occupation ? all.filter((v) => v.occupation.slug === options.occupation) : all;
  return sortVacancies(list, "newest")
    .slice(0, options.limit ?? 3)
    .map(stripInternal);
}

export async function getVacanciesByOccupation(
  slug: OccupationSlug,
  options: { limit?: number } = {},
): Promise<{ items: VacancyListItem[]; total: number }> {
  const all = await loadOpenVacancies();
  const list = sortVacancies(
    all.filter((v) => v.occupation.slug === slug),
    "newest",
  );
  return { items: list.slice(0, options.limit ?? 6).map(stripInternal), total: list.length };
}

export async function getSimilarVacancies(
  number: number,
  options: { limit?: number; fill?: boolean } = {},
): Promise<VacancyListItem[]> {
  const limit = options.limit ?? 3;
  const fill = options.fill ?? true;
  const all = await loadOpenVacancies();
  const self =
    all.find((v) => v.number === number) ?? (await getVacancyByNumber(number).catch(() => null)) ?? null;
  const others = all.filter((v) => v.number !== number);
  const score = (v: OpenVacancy) =>
    self ? (v.occupation.slug === self.occupation.slug ? 2 : 0) + (v.citySlug === self.citySlug ? 1 : 0) : 0;
  const scored = others
    .map((v) => ({ v, s: score(v) }))
    .filter(({ s }) => s >= 1)
    .sort((a, b) => b.s - a.s || compareNewest(a.v, b.v))
    .map(({ v }) => v);
  let result = scored.slice(0, limit);
  if (fill && result.length < limit) {
    const taken = new Set(result.map((v) => v.number));
    const rest = sortVacancies(
      others.filter((v) => !taken.has(v.number)),
      "newest",
    );
    result = [...result, ...rest.slice(0, limit - result.length)];
  }
  return result.map(stripInternal);
}

/** Voor generateStaticParams (spec 06). */
export async function listOpenVacancyParams(): Promise<{ slug: string }[]> {
  const all = await loadOpenVacancies();
  return all.map((v) => ({ slug: v.slug }));
}

/** Alleen open vacatures (spec 12). lastModified is de laatste wijziging van vacature of tekst. */
export async function getVacancySitemapEntries(): Promise<{ path: `/vacatures/${string}`; lastModified: string }[]> {
  const all = await loadOpenVacancies();
  return sortVacancies(all, "newest").map((v) => ({ path: v.path, lastModified: v.updatedAt }));
}

export async function getOpenVacancyCount(): Promise<number> {
  return (await loadOpenVacancies()).length;
}

// ---------------------------------------------------------------------------
// Intern voor occupations.ts
// ---------------------------------------------------------------------------

async function loadOccupationsSafe() {
  if (!hasSupabaseEnv()) return [];
  try {
    return await loadActiveOccupations();
  } catch (error) {
    logFailure("beroepen laden", error);
    return [];
  }
}

/** Aantal open vacatures per beroep, voor listOccupations(). */
export async function countOpenVacanciesByOccupation(): Promise<Map<OccupationSlug, number>> {
  const counts = new Map<OccupationSlug, number>();
  for (const v of await loadOpenVacancies()) counts.set(v.occupation.slug, (counts.get(v.occupation.slug) ?? 0) + 1);
  return counts;
}
