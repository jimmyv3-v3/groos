import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { applicationSchema } from "@/lib/validation/application";
import { addDays, formDataToRecord, toFieldErrors, todayAmsterdam, valuesForState } from "@/lib/validation/shared";

const valid = {
  firstName: "Jan",
  lastName: "de Vries",
  phone: "06 12345678",
  email: "Jan@Example.com",
  city: "Den Haag",
  mayWorkInNl: "yes",
};

describe("applicationSchema", () => {
  it("accepteert alleen de verplichte velden", () => {
    const result = applicationSchema.safeParse(valid);
    assert.equal(result.success, true);
    if (!result.success) return;
    assert.equal(result.data.phone, "+31612345678");
    assert.equal(result.data.email, "jan@example.com");
    assert.equal(result.data.mayWorkInNl, true);
    assert.equal(result.data.retentionConsent, false);
    assert.equal(result.data.locale, "nl");
  });

  it("geeft foutcodes per verplicht veld", () => {
    const result = applicationSchema.safeParse({});
    assert.equal(result.success, false);
    if (result.success) return;
    assert.deepEqual(toFieldErrors(result.error), {
      firstName: "firstNameRequired",
      lastName: "lastNameRequired",
      phone: "phoneRequired",
      email: "emailRequired",
      city: "cityRequired",
      mayWorkInNl: "mayWorkInNlRequired",
    });
  });

  it("controleert datums, telefoon, e-mail en cv-pad", () => {
    const errors = (input: Record<string, unknown>) => {
      const r = applicationSchema.safeParse({ ...valid, ...input });
      return r.success ? {} : toFieldErrors(r.error);
    };
    assert.equal(errors({ availableFrom: "2020-01-01" }).availableFrom, "availableFromPast");
    assert.equal(errors({ availableFrom: addDays(todayAmsterdam(), 400) }).availableFrom, "availableFromTooFar");
    assert.equal(errors({ availableFrom: "morgen" }).availableFrom, "availableFromInvalid");
    assert.equal(errors({ phone: "123" }).phone, "phoneInvalid");
    assert.equal(errors({ email: "geen-adres" }).email, "emailInvalid");
    assert.equal(errors({ cvPath: "applications/x.pdf" }).cvPath, "cvUploadExpired");
    assert.equal(errors({ message: "x".repeat(2001) }).message, "messageTooLong");
  });

  it("laat velden weg die het formulier nooit vraagt (AC-07-17)", () => {
    const result = applicationSchema.safeParse({ ...valid, bsn: "123", birthDate: "1990-01-01", nationality: "NL" });
    assert.equal(result.success, true);
    if (!result.success) return;
    for (const key of ["bsn", "birthDate", "dateOfBirth", "nationality", "photo", "gender"]) {
      assert.equal(key in result.data, false);
    }
    assert.equal("bsn" in applicationSchema.shape, false);
  });

  it("zet het talentpoolvinkje en de bestandsnaam om", () => {
    const result = applicationSchema.safeParse({ ...valid, retentionConsent: "on", cvFilename: "C:\\map\\cv.pdf" });
    assert.equal(result.success, true);
    if (!result.success) return;
    assert.equal(result.data.retentionConsent, true);
    assert.equal(result.data.cvFilename, "cv.pdf");
  });
});

describe("formDataToRecord en valuesForState", () => {
  it("maakt lege strings undefined en laat verborgen velden weg uit values", () => {
    const fd = new FormData();
    fd.append("firstName", "Jan");
    fd.append("lastName", "  ");
    fd.append("$ACTION_ID_abc", "");
    fd.append("occupations", "schoonmaker");
    fd.append("occupations", "verhuizer");
    fd.append("submissionId", "00000000-0000-4000-8000-000000000000");
    const record = formDataToRecord(fd, ["occupations"]);
    assert.equal(record.lastName, undefined);
    assert.equal("$ACTION_ID_abc" in record, false);
    assert.deepEqual(record.occupations, ["schoonmaker", "verhuizer"]);
    const values = valuesForState(record);
    assert.equal(values.submissionId, undefined);
    assert.equal(values.firstName, "Jan");
  });
});
