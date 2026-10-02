import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { registrationSchema } from "@/lib/validation/registration";
import { toFieldErrors } from "@/lib/validation/shared";

const valid = {
  firstName: "Anna",
  lastName: "Jansen",
  phone: "+48 512 345 678",
  email: "anna@example.com",
  city: "Delft",
  mayWorkInNl: "no",
  retentionConsent: "on",
};

describe("registrationSchema", () => {
  it("vraagt het toestemmingsvinkje (AC-07-05)", () => {
    const { retentionConsent: _omit, ...withoutConsent } = valid;
    void _omit;
    const result = registrationSchema.safeParse(withoutConsent);
    assert.equal(result.success, false);
    if (result.success) return;
    assert.equal(toFieldErrors(result.error).retentionConsent, "registerConsentRequired");
  });

  it("ontdubbelt beroepen en weigert onbekende", () => {
    const ok = registrationSchema.safeParse({ ...valid, occupations: ["verhuizer", "logistiek-medewerker", "verhuizer"] });
    assert.equal(ok.success, true);
    if (ok.success) assert.deepEqual(ok.data.occupations, ["verhuizer", "logistiek-medewerker"]);
    const bad = registrationSchema.safeParse({ ...valid, occupations: ["piloot"] });
    assert.equal(bad.success, false);
    if (!bad.success) assert.equal(toFieldErrors(bad.error).occupations, "occupationsInvalid");
  });

  it("maakt beroepen en rijbewijs optioneel", () => {
    const result = registrationSchema.safeParse(valid);
    assert.equal(result.success, true);
    if (!result.success) return;
    assert.deepEqual(result.data.occupations, []);
    assert.equal(result.data.hasDrivingLicenseB, undefined);
    assert.equal(result.data.retentionConsent, true);
  });
});
