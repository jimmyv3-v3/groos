import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addDays, toFieldErrors, todayAmsterdam } from "@/lib/validation/shared";
import { staffRequestSchema } from "@/lib/validation/staff-request";

const valid = {
  companyName: "Testbedrijf B.V.",
  contactName: "Piet Pieters",
  phone: "070 123 45 67",
  email: "piet@example.com",
  occupations: ["schoonmaker", "glazenwasser"],
  headcount: "4",
  start: "asap",
  duration: "weeks",
  workCity: "Rijswijk",
};

function errors(input: Record<string, unknown>) {
  const r = staffRequestSchema.safeParse(input);
  return r.success ? {} : toFieldErrors(r.error);
}

describe("staffRequestSchema", () => {
  it("accepteert een aanvraag per direct (AC-07-06)", () => {
    const result = staffRequestSchema.safeParse({ ...valid, startDate: addDays(todayAmsterdam(), 3) });
    assert.equal(result.success, true);
    if (!result.success) return;
    assert.equal(result.data.headcount, 4);
    assert.equal(result.data.startDate, undefined);
    assert.deepEqual(result.data.occupations, ["schoonmaker", "glazenwasser"]);
  });

  it("vraagt minstens een beroep of ander werk", () => {
    assert.equal(errors({ ...valid, occupations: [] }).occupations, "occupationsRequired");
    assert.equal(errors({ ...valid, occupations: [], occupationOther: "Evenementen" }).occupations, undefined);
  });

  it("vraagt een datum vanaf vandaag bij start op datum", () => {
    assert.equal(errors({ ...valid, start: "date" }).startDate, "startDateRequired");
    assert.equal(errors({ ...valid, start: "date", startDate: "2020-01-01" }).startDate, "startDatePast");
    assert.equal(errors({ ...valid, start: "date", startDate: todayAmsterdam() }).startDate, undefined);
  });

  it("controleert aantallen, uren en KvK", () => {
    assert.equal(errors({ ...valid, headcount: "0" }).headcount, "headcountInvalid");
    assert.equal(errors({ ...valid, headcount: undefined }).headcount, "headcountRequired");
    assert.equal(errors({ ...valid, hoursPerWeek: "61" }).hoursPerWeek, "hoursInvalid");
    assert.equal(errors({ ...valid, kvkNumber: "1234" }).kvkNumber, "kvkInvalid");
    assert.equal(errors({ ...valid, kvkNumber: "1234 5678" }).kvkNumber, undefined);
  });

  it("zet de duur standaard op unknown", () => {
    const result = staffRequestSchema.safeParse({ ...valid, duration: undefined });
    assert.equal(result.success && result.data.duration, "unknown");
  });
});
