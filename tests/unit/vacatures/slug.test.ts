import { describe, expect, it } from "vitest";
import {
  buildVacancySearchParams,
  parseVacancySearchParams,
  parseVacancySlug,
} from "@/lib/data/vacancy-search-params";

// AC-10-17 en B-16: zoekparameters en slugs van /vacatures (spec 10 §4.3 punt 9).

describe("parseVacancySearchParams (AC-10-17)", () => {
  it("negeert onbekende waarden en zet pagina 0 op 1", () => {
    const state = parseVacancySearchParams({ beroep: ["schoonmaker", "onzin"], pagina: "0" });
    expect(state.filters.beroep).toEqual(["schoonmaker"]);
    expect(state.page).toBe(1);
    expect(state.isFiltered).toBe(true);
  });

  it("telt alleen pagina niet als filter", () => {
    const state = parseVacancySearchParams({ pagina: "2" });
    expect(state.page).toBe(2);
    expect(state.isFiltered).toBe(false);
  });

  it("leest komma's en herhaalde waarden", () => {
    const state = parseVacancySearchParams({ beroep: "schoonmaker,verhuizer", dienst: ["vroeg", "nacht", "ochtend"] });
    expect(state.filters.beroep).toEqual(["schoonmaker", "verhuizer"]);
    expect(state.filters.dienst).toEqual(["vroeg", "nacht"]);
  });

  it("vertaalt sortering met VACANCY_SORTS; de standaard telt niet als filter", () => {
    expect(parseVacancySearchParams({ sortering: "salaris" })).toMatchObject({ sort: "salary", isFiltered: true });
    expect(parseVacancySearchParams({ sortering: "sluitdatum" })).toMatchObject({ sort: "closing", isFiltered: true });
    expect(parseVacancySearchParams({ sortering: "nieuwste" })).toMatchObject({ sort: "newest", isFiltered: false });
    expect(parseVacancySearchParams({ sortering: "onzin" })).toMatchObject({ sort: "newest", isFiltered: false });
  });
});

describe("buildVacancySearchParams (B-16)", () => {
  it("schrijft de vaste volgorde en laat standaardwaarden weg", () => {
    const params = buildVacancySearchParams({
      filters: { dienst: ["dag"], q: "den haag", beroep: ["glazenwasser"], uren: ["32-plus"], plaats: ["delft"] },
      sort: "salary",
      page: 2,
    });
    expect(params.toString()).toBe("q=den+haag&beroep=glazenwasser&plaats=delft&uren=32-plus&dienst=dag&sortering=salaris&pagina=2");
    expect(buildVacancySearchParams({ sort: "newest", page: 1 }).toString()).toBe("");
  });

  it("geeft na parsen dezelfde staat terug", () => {
    const params = buildVacancySearchParams({ filters: { beroep: ["verhuizer"] }, sort: "closing", page: 3 });
    const state = parseVacancySearchParams(Object.fromEntries(params));
    expect(state).toMatchObject({ filters: { beroep: ["verhuizer"] }, sort: "closing", page: 3 });
  });
});

describe("parseVacancySlug (AC-10-17, B-15)", () => {
  it("leest het nummer aan het eind", () => {
    expect(parseVacancySlug("glazenwasser-den-haag-1001")).toBe(1001);
    expect(parseVacancySlug("glazenwasser")).toBeNull();
    expect(parseVacancySlug("glazenwasser-42")).toBeNull();
  });

  it("geeft bij een andere tekst met hetzelfde nummer hetzelfde nummer (basis voor de 308)", () => {
    expect(parseVacancySlug("andere-tekst-1001")).toBe(parseVacancySlug("glazenwasser-den-haag-1001"));
  });
});
