import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { defaultContactId, previewDates, publicStateOf } from "@/app/beheer/_data/vacancies";
import {
  extendRevalidationKind,
  saveRevalidationKind,
  scheduleRevalidationKind,
  unscheduleRevalidationKind,
} from "@/app/beheer/_lib/revalidation";
import { fieldErrorsOf } from "@/app/beheer/_lib/validation/common";
import {
  emptyVacancyValues,
  publishErrorsFromValues,
  vacancyDraftSchema,
  vacancyWarnings,
  type VacancyFormValues,
} from "@/app/beheer/_lib/validation/vacancy";
import { S } from "@/app/beheer/_strings";
import { MINIMUM_WAGE_21_PLUS, VACANCY_DEFAULT_CLOSE_DAYS } from "@/lib/data/options";

const ME = "11111111-1111-4111-8111-111111111111";
const OTHER = "22222222-2222-4222-8222-222222222222";
const NOW = new Date("2026-10-02T10:00:00Z");

function values(over: Partial<VacancyFormValues> = {}): VacancyFormValues {
  return { ...emptyVacancyValues(ME), occupation_slug: "glazenwasser", title: "Glazenwasser", ...over };
}

function errorsFor(v: VacancyFormValues, ctx: Partial<Parameters<typeof vacancyDraftSchema>[0]> = {}) {
  const r = vacancyDraftSchema({ status: null, contactIds: [ME], now: NOW, ...ctx }).safeParse(v);
  return r.success ? {} : fieldErrorsOf(r.error);
}

describe("vacancyDraftSchema (spec 08 §5.5)", () => {
  it("een concept met alleen beroep en titel is geldig (AC-08-14)", () => {
    assert.deepEqual(errorsFor(values({ contact_admin_id: "" })), {});
  });

  it("contactpersoon moet een actieve beheerder met telefoonnummer zijn (B-48)", () => {
    assert.deepEqual(errorsFor(values({ contact_admin_id: OTHER })).contact_admin_id, [S.validation.contact]);
    assert.deepEqual(errorsFor(values({ contact_admin_id: ME })), {});
  });

  it("sluitdatum in het verleden geeft een fout bij een concept", () => {
    assert.deepEqual(errorsFor(values({ closes_at: "2026-10-01" }), { status: "draft" }).closes_at, [
      S.validation.closesInPast,
    ]);
  });

  it("een ongewijzigde sluitdatum van een online vacature geeft geen fout (§4.7)", () => {
    const v = values({ closes_at: "2026-10-02" });
    assert.deepEqual(errorsFor(v, { status: "published", storedClosesOn: "2026-10-02" }), {});
    assert.deepEqual(errorsFor(v, { status: "scheduled", storedClosesOn: "2026-10-02" }), {});
    assert.deepEqual(errorsFor(v, { status: "published", storedClosesOn: "2026-10-20" }).closes_at, [
      S.validation.closesInPast,
    ]);
  });

  it("een lege sluitdatum mag alleen bij een concept of een nieuwe vacature", () => {
    assert.deepEqual(errorsFor(values(), { status: "draft" }), {});
    assert.deepEqual(errorsFor(values(), { status: "published" }).closes_at, [S.validation.closesRequired]);
  });

  it("bij een gesloten vacature is de sluitdatum alleen-lezen en wordt hij niet gecontroleerd", () => {
    assert.deepEqual(errorsFor(values({ closes_at: "" }), { status: "closed" }), {});
  });

  it("taal op het werk mag leeg zijn of een waarde uit WORKPLACE_LANGUAGES hebben", () => {
    const parse = (w: string) =>
      vacancyDraftSchema({ status: null, contactIds: [ME], now: NOW }).parse(values({ workplace_language: w }));
    assert.equal(parse("").vacancy.workplace_language, null);
    assert.equal(parse("nl_or_en").vacancy.workplace_language, "nl_or_en");
  });
});

describe("publishErrorsFromValues (B-06)", () => {
  const complete = values({
    city: "Den Haag",
    hours_min: "24",
    hours_max: "40",
    salary_min: "15,50",
    salary_max: "17,00",
    intro: "Je wast ramen bij kantoren in Den Haag. Dit werk past bij jou als je graag buiten bent.",
    tasks: ["Ramen wassen", "Ladders plaatsen", "Materiaal schoonmaken"],
    requirements: ["Geen hoogtevrees"],
    offer: ["Bruto uurloon van € 15,50"],
  });

  it("een volledige vacature heeft geen publicatiefouten", () => {
    assert.deepEqual(publishErrorsFromValues(complete, [ME]), []);
  });

  it("een contactpersoon zonder telefoonnummer telt als ontbrekend", () => {
    assert.deepEqual(publishErrorsFromValues(complete, [OTHER]), ["contact"]);
    assert.deepEqual(publishErrorsFromValues({ ...complete, contact_admin_id: "" }), ["contact"]);
  });

  it("twee taken en geen uurloon geven tasks en salary (AC-08-15)", () => {
    const codes = publishErrorsFromValues({ ...complete, tasks: ["a", "b"], salary_min: "", salary_max: "" }, [ME]);
    assert.deepEqual(codes, ["salary", "tasks"]);
  });
});

describe("vacancyWarnings (§5.5, AC-08-16, AC-08-42)", () => {
  it("waarschuwt onder het minimumloon", () => {
    const w = vacancyWarnings(values({ salary_min: "13,50" }));
    assert.equal(w.length, 1);
    assert.ok(w[0].includes("14,99"), w[0]);
    assert.equal(vacancyWarnings(values({ salary_min: String(MINIMUM_WAGE_21_PLUS).replace(".", ",") })).length, 0);
  });

  it("waarschuwt bij geen ervaring en werken op hoogte zonder training", () => {
    const atHeight = values({ experience_level: "none", min_age_18: true, min_age_reason: "work_at_height" });
    assert.deepEqual(vacancyWarnings(atHeight), [S.validation.noExperienceAtHeight]);
    assert.deepEqual(vacancyWarnings({ ...atHeight, experience_level: "nice_to_have" }), []);
    assert.deepEqual(vacancyWarnings({ ...atHeight, training_offered: ["ipaf"] }), []);
  });
});

describe("revalidatie per actie (§5.3 tabel 2, B-35)", () => {
  const base = {
    publishedFromDraft: false,
    publicStateBefore: "open" as const,
    slugBefore: "glazenwasser-den-haag-1001",
    slugAfter: "glazenwasser-den-haag-1001",
    closesAtBefore: "2026-11-01T22:59:00.000Z",
    closesAtAfter: "2026-11-01T22:59:00.000Z",
  };

  it("publiceren vanuit concept is visibility", () => {
    assert.equal(saveRevalidationKind({ ...base, publicStateBefore: null, publishedFromDraft: true }), "visibility");
  });

  it("zonder publieke staat geen revalidatie", () => {
    assert.equal(saveRevalidationKind({ ...base, publicStateBefore: null }), null);
  });

  it("een andere slug van een publieke vacature is visibility, anders content", () => {
    assert.equal(saveRevalidationKind({ ...base, slugAfter: "glazenwasser-delft-1001" }), "visibility");
    assert.equal(saveRevalidationKind(base), "content");
  });

  it("een andere sluitdatum bij een publiek gesloten vacature is visibility", () => {
    assert.equal(
      saveRevalidationKind({ ...base, publicStateBefore: "closed", closesAtAfter: "2026-12-01T22:59:00.000Z" }),
      "visibility",
    );
    assert.equal(saveRevalidationKind({ ...base, publicStateBefore: "closed" }), "content");
  });

  it("inplannen, inplanning annuleren en verlengen volgen de publieke staat vóór de actie", () => {
    assert.equal(scheduleRevalidationKind("draft", null), null);
    assert.equal(scheduleRevalidationKind("scheduled", "open"), "visibility");
    assert.equal(scheduleRevalidationKind("scheduled", null), null);
    assert.equal(unscheduleRevalidationKind("open"), "visibility");
    assert.equal(unscheduleRevalidationKind(null), null);
    assert.equal(extendRevalidationKind("closed"), "visibility");
    assert.equal(extendRevalidationKind("open"), "content");
  });
});

describe("publicStateOf en voorbeeld (§4.7)", () => {
  const now = Date.parse("2026-10-02T10:00:00Z");
  const row = {
    status: "published" as const,
    published_at: "2026-09-01T08:00:00Z",
    publish_at: null,
    closes_at: "2026-10-30T22:59:00Z",
    closed_at: null,
    updated_at: "2026-09-02T08:00:00Z",
  };

  it("volgt vacancy_public_state", () => {
    assert.equal(publicStateOf(row, now), "open");
    assert.equal(publicStateOf({ ...row, closes_at: "2026-10-01T22:59:00Z" }, now), "closed");
    assert.equal(publicStateOf({ ...row, status: "scheduled", publish_at: "2026-10-01T05:00:00Z" }, now), "open");
    assert.equal(publicStateOf({ ...row, status: "draft" }, now), null);
  });

  it("vult publishedAt en closesAt aan voor een concept", () => {
    const draft = { ...row, status: "draft" as const, published_at: null, closes_at: null };
    const d = previewDates(draft);
    assert.equal(d.publishedAt, draft.updated_at);
    assert.equal(
      Date.parse(d.closesAt) - Date.parse(draft.updated_at),
      VACANCY_DEFAULT_CLOSE_DAYS * 24 * 60 * 60 * 1000,
    );
    assert.equal(d.state, "open");
    assert.equal(previewDates({ ...row, status: "scheduled", published_at: null, publish_at: "2026-10-05T05:00:00Z" }).publishedAt, "2026-10-05T05:00:00Z");
  });

  it("closed of archived geeft de gesloten weergave", () => {
    assert.equal(previewDates({ ...row, status: "archived" }).state, "closed");
    assert.equal(previewDates({ ...row, status: "closed", closed_at: "2026-01-01T00:00:00Z" }).state, "closed");
  });
});

describe("defaultContactId (§4.7)", () => {
  it("kiest de ingelogde beheerder met telefoonnummer, anders de eerste met telefoonnummer", () => {
    const admins = [
      { id: OTHER, hasPhone: true },
      { id: ME, hasPhone: false },
    ];
    assert.equal(defaultContactId(admins, ME), OTHER);
    assert.equal(defaultContactId([{ id: ME, hasPhone: true }, ...admins], ME), ME);
    assert.equal(defaultContactId([{ id: ME, hasPhone: false }], ME), "");
  });
});

describe("teksten (spec 08 §6.2)", () => {
  it("publicatiecode contact noemt het telefoonnummer (B-48)", () => {
    assert.equal(S.validation.publish.contact, "Kies een contactpersoon met een telefoonnummer.");
  });
});
