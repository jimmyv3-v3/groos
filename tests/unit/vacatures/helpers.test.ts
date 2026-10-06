import assert from "node:assert/strict";
import { describe, it } from "vitest";
import {
  displayCity,
  displayPhone,
  isNewVacancy,
  lowerFirst,
  todayInAmsterdam,
  upcomingStartDate,
} from "@/components/vacatures/vacancy-helpers";
import { occupationPhrase } from "@/i18n/occupation-phrase";
import { parseVacancySlug } from "@/lib/data/vacancy-search-params";
import { fixtureVacancies, fixtureVacancy } from "../../fixtures/vacancies";

const NOW = new Date("2026-10-02T10:00:00Z");

describe("vacaturehulpfuncties (spec 06 §4.5)", () => {
  it("vertaalt alleen Den Haag naar het Engels", () => {
    assert.equal(displayCity("Den Haag", "en"), "The Hague");
    assert.equal(displayCity("Den Haag", "nl"), "Den Haag");
    assert.equal(displayCity("Rijswijk", "en"), "Rijswijk");
  });

  it("toont een mobiel nummer als 06 met spaties", () => {
    assert.equal(displayPhone("+31612345678"), "06 12 34 56 78");
    assert.equal(displayPhone("+3215123456"), "+3215123456");
  });

  it("markeert vacatures jonger dan zeven dagen als nieuw", () => {
    assert.equal(isNewVacancy(fixtureVacancy(1001, NOW).publishedAt, NOW), true);
    assert.equal(isNewVacancy("2026-09-20T10:00:00Z", NOW), false);
    assert.equal(isNewVacancy("2026-10-03T10:00:00Z", NOW), false);
    assert.equal(isNewVacancy("geen datum", NOW), false);
  });

  it("rekent vandaag in Europe/Amsterdam", () => {
    assert.equal(todayInAmsterdam(new Date("2026-10-02T22:30:00Z")), "2026-10-03");
    assert.equal(todayInAmsterdam(new Date("2026-10-02T21:30:00Z")), "2026-10-02");
  });

  it("geeft alleen een startdatum die nog moet komen", () => {
    assert.equal(upcomingStartDate(true, "2026-12-01", NOW), null);
    assert.equal(upcomingStartDate(false, null, NOW), null);
    assert.equal(upcomingStartDate(false, "2026-10-02", NOW), null);
    assert.equal(upcomingStartDate(false, "2026-10-15", NOW), "2026-10-15");
  });

  it("maakt de eerste letter klein", () => {
    assert.equal(lowerFirst("Glazenwasser", "nl"), "glazenwasser");
    assert.equal(lowerFirst("", "nl"), "");
  });
});

describe("occupationPhrase (beroepsnaam in een zin)", () => {
  it("geeft in het Nederlands alleen een kleine beginletter", () => {
    assert.equal(occupationPhrase("Machinist", "nl"), "machinist");
    assert.equal(occupationPhrase("Hulpkracht bouw en sloop", "nl"), "hulpkracht bouw en sloop");
  });

  it("zet in het Engels het juiste lidwoord ervoor", () => {
    assert.equal(occupationPhrase("Window cleaner", "en"), "a window cleaner");
    assert.equal(occupationPhrase("Excavator operator", "en"), "an excavator operator");
    assert.equal(occupationPhrase("Street paver", "en"), "a street paver");
  });

  it("laat een lege naam leeg", () => {
    assert.equal(occupationPhrase("", "en"), "");
  });
});

describe("parseVacancySlug (AC-10-17)", () => {
  it("leest het nummer aan het eind van de slug", () => {
    assert.equal(parseVacancySlug("glazenwasser-den-haag-1001"), 1001);
    assert.equal(parseVacancySlug("andere-tekst-1001"), 1001);
    assert.equal(parseVacancySlug("1002"), 1002);
  });

  it("geeft null zonder geldig nummer", () => {
    assert.equal(parseVacancySlug("glazenwasser"), null);
    assert.equal(parseVacancySlug("onzin-42"), null);
  });
});

describe("fixtures van de seedvacatures", () => {
  it("bevatten 1001 tot en met 1007 met slug, pad en startmoment", () => {
    const all = fixtureVacancies(NOW);
    assert.deepEqual(
      all.map((v) => v.number),
      [1001, 1002, 1003, 1004, 1005, 1006, 1007],
    );
    for (const v of all) {
      assert.equal(parseVacancySlug(v.slug), v.number);
      assert.equal(v.path, `/vacatures/${v.slug}`);
      assert.equal(typeof v.startAsap, "boolean");
      assert.equal(v.workplaceLanguage, null);
      assert.ok(Date.parse(v.closesAt) > Date.parse(v.publishedAt));
    }
    assert.deepEqual(
      all.filter((v) => v.state === "closed").map((v) => v.number),
      [1007],
    );
  });
});
