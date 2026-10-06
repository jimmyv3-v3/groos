import { describe, expect, it } from "vitest";
import { Constants } from "@/lib/database.types";
import * as options from "@/lib/data/options";

// AC-10-28 (E-10-17): elke waardenset in lib/data/options.ts is gelijk aan de
// enum in de database (via de gegenereerde lib/database.types.ts).
const enums = Constants.public.Enums;

describe("lib/data/options.ts tegen de database-enums (AC-10-28)", () => {
  const paren: [string, readonly string[], readonly string[]][] = [
    ["contract_type", options.CONTRACT_TYPES, enums.contract_type],
    ["shift", options.SHIFTS.map((s) => s.id), enums.shift],
    ["education_level", options.EDUCATION_LEVELS, enums.education_level],
    ["experience_level", options.EXPERIENCE_LEVELS, enums.experience_level],
    ["qualification", options.QUALIFICATIONS, enums.qualification],
    ["workplace_language", options.WORKPLACE_LANGUAGES, enums.workplace_language],
    ["min_age_reason", options.MIN_AGE_REASONS, enums.min_age_reason],
    ["vacancy_close_reason", options.CLOSE_REASONS, enums.vacancy_close_reason],
    ["vacancy_status", options.VACANCY_STATUSES, enums.vacancy_status],
    ["application_status", options.APPLICATION_STATUSES, enums.application_status],
    ["application_kind", options.APPLICATION_KINDS, enums.application_kind],
    ["application_source", options.APPLICATION_SOURCES, enums.application_source],
    ["staff_request_status", options.STAFF_REQUEST_STATUSES, enums.staff_request_status],
    ["request_duration", options.REQUEST_DURATIONS, enums.request_duration],
    ["contact_topic", options.CONTACT_TOPICS, enums.contact_topic],
    ["message_status", options.MESSAGE_STATUSES, enums.message_status],
  ];

  it.each(paren)("%s heeft dezelfde waarden", (_naam, constante, databaseEnum) => {
    expect([...constante]).toEqual([...databaseEnum]);
  });

  it("de tien beroepen staan in de volgorde van spec 00 §4.2", () => {
    expect([...options.OCCUPATION_SLUGS]).toEqual([
      "glazenwasser",
      "schoonmaker",
      "logistiek-medewerker",
      "verhuizer",
      "hulpkracht-bouw-en-sloop",
      "grondwerker",
      "sloper",
      "bouwopruimer",
      "machinist",
      "stratenmaker",
    ]);
  });

  it("geen dav meer in de kwalificaties (VR-13)", () => {
    expect(options.QUALIFICATIONS).not.toContain("dav");
  });

  it("de termijnen volgen spec 10 §5.6 en B-07", () => {
    expect(options.VACANCY_DEFAULT_CLOSE_DAYS).toBe(45);
    expect(options.CLOSED_VISIBLE_DAYS).toBe(30);
    expect(options.RETENTION_DAYS).toMatchObject({
      applicationDefault: 28,
      applicationConsent: 365,
      registration: 365,
      staleReminder: 56,
      staleAutoClose: 84,
      staffRequest: 730,
      contactMessage: 182,
      spam: 30,
      emailLog: 90,
      auditLog: 730,
      pendingUploadHours: 24,
    });
    expect(options.MINIMUM_WAGE_21_PLUS).toBe(14.99);
  });

  it("VACANCY_SORTS koppelt VacancySort aan ?sortering (B-16)", () => {
    expect(options.VACANCY_SORTS.map((s) => [s.id, s.slug])).toEqual([
      ["newest", "nieuwste"],
      ["salary", "salaris"],
      ["closing", "sluitdatum"],
    ]);
  });
});
