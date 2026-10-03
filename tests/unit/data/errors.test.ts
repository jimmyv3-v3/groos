import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockSupabaseClient, type MockAnswer } from "./supabase-mock";

// AC-10-33 (spec 10 §4.3 punt 10, B-56): een Supabase-fout geeft een Error met
// de code, geen leeg resultaat. Zonder Supabase-variabelen wel een leeg resultaat.

const state = vi.hoisted(() => ({
  configured: true,
  answer: (() => ({ data: null, error: null })) as (table: string) => MockAnswer,
}));

vi.mock("next/cache", () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));
vi.mock("@/lib/supabase/env", () => ({ hasSupabaseEnv: () => state.configured }));
vi.mock("@/lib/supabase/public", () => ({
  createSupabasePublicClient: () => mockSupabaseClient((table) => state.answer(table)).client,
}));

const PGRST205: MockAnswer = { data: null, error: { message: "x", code: "PGRST205" } };

describe("leesfuncties bij een Supabase-fout (AC-10-33)", () => {
  beforeEach(() => {
    state.configured = true;
    state.answer = () => PGRST205;
  });
  afterEach(() => vi.restoreAllMocks());

  it("getVacancyList gooit met de Supabase-code", async () => {
    const { getVacancyList } = await import("@/lib/data/vacancies");
    await expect(getVacancyList()).rejects.toThrow(/PGRST205/);
  });

  it("getVacancyByNumber gooit met de Supabase-code en geeft geen null", async () => {
    const { getVacancyByNumber } = await import("@/lib/data/vacancies");
    await expect(getVacancyByNumber(1001)).rejects.toThrow(/PGRST205/);
  });

  it("getLatestVacancies gooit met de Supabase-code", async () => {
    const { getLatestVacancies } = await import("@/lib/data/vacancies");
    await expect(getLatestVacancies()).rejects.toThrow(/PGRST205/);
  });

  it("listOccupations gooit met de Supabase-code", async () => {
    const { listOccupations } = await import("@/lib/data/occupations");
    await expect(listOccupations()).rejects.toThrow(/PGRST205/);
  });

  it("de overige publieke leesfuncties gooien ook", async () => {
    const data = await import("@/lib/data/vacancies");
    await expect(data.getVacancyFacets()).rejects.toThrow(/PGRST205/);
    await expect(data.getVacanciesByOccupation("schoonmaker")).rejects.toThrow(/PGRST205/);
    await expect(data.getSimilarVacancies(1001)).rejects.toThrow(/PGRST205/);
    await expect(data.listOpenVacancyParams()).rejects.toThrow(/PGRST205/);
    await expect(data.getVacancySitemapEntries()).rejects.toThrow(/PGRST205/);
    await expect(data.getOpenVacancyCount()).rejects.toThrow(/PGRST205/);
  });

  it("een mislukte fetch gooit ook", async () => {
    state.answer = () => ({ data: null, error: { message: "TypeError: fetch failed" } });
    const { getVacancyList } = await import("@/lib/data/vacancies");
    await expect(getVacancyList()).rejects.toThrow(/public_vacancies \(open\): TypeError: fetch failed/);
  });

  it("getVacancyByNumber(42) geeft null zonder query (AC-10-15)", async () => {
    const { getVacancyByNumber } = await import("@/lib/data/vacancies");
    await expect(getVacancyByNumber(42)).resolves.toBeNull();
  });
});

describe("leesfuncties zonder Supabase-variabelen (B-56)", () => {
  beforeEach(() => {
    state.configured = false;
    state.answer = () => {
      throw new Error("er mag geen query zijn");
    };
  });

  it("listOpenVacancyParams en getVacancySitemapEntries geven [] zonder fout", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const data = await import("@/lib/data/vacancies");
    await expect(data.listOpenVacancyParams()).resolves.toEqual([]);
    await expect(data.getVacancySitemapEntries()).resolves.toEqual([]);
    await expect(data.getVacancyByNumber(1001)).resolves.toBeNull();
    const { listOccupations } = await import("@/lib/data/occupations");
    await expect(listOccupations()).resolves.toEqual([]);
    expect(warn.mock.calls.length).toBeLessThanOrEqual(1);
  });
});
