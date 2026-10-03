import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockSupabaseClient, type MockAnswer } from "./supabase-mock";

// Datamappers van lib/data/vacancies.ts en revalidateVacancies (spec 14 §4.4,
// AC-10-15, AC-10-18).

const state = vi.hoisted(() => ({
  answer: (() => ({ data: [], error: null })) as (table: string) => MockAnswer,
  revalidateTag: [] as unknown[][],
  revalidatePath: [] as unknown[][],
}));

vi.mock("next/cache", () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
  revalidateTag: (...args: unknown[]) => state.revalidateTag.push(args),
  revalidatePath: (...args: unknown[]) => state.revalidatePath.push(args),
}));
vi.mock("@/lib/supabase/env", () => ({ hasSupabaseEnv: () => true }));
vi.mock("@/lib/supabase/public", () => ({
  createSupabasePublicClient: () => mockSupabaseClient((table) => state.answer(table)).client,
}));

/** Een rij uit public_vacancies zoals PostgREST hem geeft (numeric als string). */
function rij(overrides: Record<string, unknown> = {}) {
  return {
    id: "0b0f6c0e-0000-4000-8000-000000001007",
    number: 1007,
    slug: "opleveringsschoonmaker-delft-1007",
    title: "Opleveringsschoonmaker",
    summary: null,
    intro: "Je verwijdert bouwstof, verfspatten en kitresten in nieuwe woningen. Je werkt overdag in een ploeg.",
    tasks: ["Ramen en kozijnen schoonmaken", "Vloeren stofvrij maken", "Sanitair schoonmaken"],
    requirements: ["Je werkt nauwkeurig"],
    offer: ["Een bruto uurloon tussen € 16,08 en € 16,70"],
    extra: null,
    seo_title: null,
    seo_description: null,
    occupation_slug: "schoonmaker",
    occupation_name_nl: "Schoonmaker",
    occupation_plural_nl: "Schoonmakers",
    occupation_name_en: "Cleaner",
    occupation_plural_en: "Cleaners",
    city: "Delft",
    city_slug: "delft",
    postal_code: null,
    province: "Zuid-Holland",
    location_label: null,
    positions_count: 1,
    contract_type: "temp_agency",
    hours_min: 32,
    hours_max: 38,
    shifts: ["day"],
    salary_min: "16.08",
    salary_max: "16.70",
    salary_note: null,
    education_level: "none",
    experience_level: "none",
    experience_months: null,
    required_qualifications: [],
    preferred_qualifications: ["rijbewijs_b"],
    training_offered: [],
    min_age_18: false,
    min_age_reason: null,
    start_asap: true,
    start_date: null,
    workplace_language: null,
    published_at: "2026-09-07T10:00:00+00:00",
    closes_at: "2026-10-22T10:00:00+00:00",
    is_featured: false,
    is_urgent: false,
    allow_whatsapp_apply: true,
    image_path: null,
    contact_name: "Jimmy",
    contact_phone: "+31683351985",
    contact_whatsapp: "+31683351985",
    contact_photo_path: null,
    state: "closed",
    closed_at: "2026-09-27T10:00:00+00:00",
    close_reason: "filled",
    updated_at: "2026-09-27T10:00:00+00:00",
    ...overrides,
  };
}

describe("rij uit public_vacancies naar VacancyDetail", () => {
  beforeEach(() => {
    state.answer = () => ({ data: rij(), error: null });
  });

  it("zet bedragen om naar getallen, vult de samenvatting uit de intro en neemt de contactpersoon mee", async () => {
    const { getVacancyByNumber } = await import("@/lib/data/vacancies");
    const detail = await getVacancyByNumber(1007);
    expect(detail).not.toBeNull();
    expect(detail?.salaryMin).toBe(16.08);
    expect(detail?.salaryMax).toBe(16.7);
    expect(detail?.path).toBe("/vacatures/opleveringsschoonmaker-delft-1007");
    expect(detail?.summary.startsWith("Je verwijdert bouwstof")).toBe(true);
    expect(detail?.summary.length).toBeLessThanOrEqual(200);
    expect(detail?.contact).toEqual({ name: "Jimmy", phoneE164: "+31683351985", whatsappE164: "+31683351985", photoUrl: null });
    expect(detail?.asksDrivingLicenseB).toBe(true);
    expect(detail?.workplaceLanguage).toBeNull();
  });

  it("geeft bij een gesloten vacature de sluitreden (AC-10-15)", async () => {
    const { getVacancyByNumber } = await import("@/lib/data/vacancies");
    const detail = await getVacancyByNumber(1007);
    expect(detail?.state).toBe("closed");
    expect(detail?.closeReason).toBe("filled");
    expect(detail?.closedAt).toBe("2026-09-27T10:00:00+00:00");
  });

  it("geeft null als de view geen rij heeft (concept, gepland, gearchiveerd)", async () => {
    state.answer = () => ({ data: null, error: null });
    const { getVacancyByNumber } = await import("@/lib/data/vacancies");
    await expect(getVacancyByNumber(1009)).resolves.toBeNull();
  });

  it("laat lege optionele velden leeg en arrays als array", async () => {
    state.answer = () => ({ data: rij({ state: "open", closed_at: null, close_reason: null, tasks: null, contact_name: null }), error: null });
    const { getVacancyByNumber } = await import("@/lib/data/vacancies");
    const detail = await getVacancyByNumber(1007);
    expect(detail?.tasks).toEqual([]);
    expect(detail?.contact).toBeNull();
    expect(detail?.closedAt).toBeNull();
    expect(detail?.closeReason).toBeNull();
  });
});

describe("revalidateVacancies (AC-10-18)", () => {
  beforeEach(() => {
    state.revalidateTag = [];
    state.revalidatePath = [];
  });

  it("gebruikt { expire: 0 } bij visibility", async () => {
    const { revalidateVacancies } = await import("@/lib/data/revalidate");
    revalidateVacancies([1001, 1001], "visibility");
    expect(state.revalidateTag).toEqual([
      ["vacatures", { expire: 0 }],
      ["vacature:1001", { expire: 0 }],
    ]);
    expect(state.revalidatePath).toEqual([["/[locale]/vacatures", "layout"], ["/sitemap.xml"]]);
  });

  it("gebruikt max bij content", async () => {
    const { revalidateVacancies } = await import("@/lib/data/revalidate");
    revalidateVacancies([1002], "content");
    expect(state.revalidateTag).toEqual([
      ["vacatures", "max"],
      ["vacature:1002", "max"],
    ]);
  });

  it("ververst bij een lege lijst alleen de tag vacatures en de paden", async () => {
    const { revalidateVacancies } = await import("@/lib/data/revalidate");
    revalidateVacancies([], "visibility");
    expect(state.revalidateTag).toEqual([["vacatures", { expire: 0 }]]);
    expect(state.revalidatePath).toHaveLength(2);
  });
});
