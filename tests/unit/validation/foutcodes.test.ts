import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { JOBSEEKER_ERROR_CODES, type JobseekerErrorCode } from "@/lib/validation/application";
import { CONTACT_ERROR_CODES, type ContactErrorCode } from "@/lib/validation/contact";
import { STAFF_REQUEST_ERROR_CODES, type StaffRequestErrorCode } from "@/lib/validation/staff-request";
import en from "@/messages/en/forms.json";
import nl from "@/messages/nl/forms.json";

// Typetest: elke foutcode heeft een tekst in messages/nl (spec 07 §5.4, §10 stap 12).
const jobseeker = nl.jobseeker.errors satisfies Record<JobseekerErrorCode, string>;
const staff = nl.staffRequest.errors satisfies Record<StaffRequestErrorCode, string>;
const contact = nl.contactForm.errors satisfies Record<ContactErrorCode, string>;

describe("foutcodes en messages", () => {
  it("heeft voor elke code een tekst in nl en en", () => {
    for (const code of JOBSEEKER_ERROR_CODES) {
      assert.ok(jobseeker[code], code);
      assert.ok(en.jobseeker.errors[code], code);
    }
    for (const code of STAFF_REQUEST_ERROR_CODES) {
      assert.ok(staff[code], code);
      assert.ok(en.staffRequest.errors[code], code);
    }
    for (const code of CONTACT_ERROR_CODES) {
      assert.ok(contact[code], code);
      assert.ok(en.contactForm.errors[code], code);
    }
    assert.ok(nl.privacy.registerConsent.error);
    assert.ok(en.privacy.registerConsent.error);
  });
});
