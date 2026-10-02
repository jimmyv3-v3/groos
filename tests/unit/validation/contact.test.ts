import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { contactSchema } from "@/lib/validation/contact";
import { countLinks, toFieldErrors } from "@/lib/validation/shared";

function errors(input: Record<string, unknown>) {
  const r = contactSchema.safeParse(input);
  return r.success ? {} : toFieldErrors(r.error);
}

describe("contactSchema (AC-07-08)", () => {
  it("bel mij terug met alleen naam en telefoon is genoeg", () => {
    assert.deepEqual(errors({ name: "Ann", phone: "06 12345678", topic: "callback" }), {});
  });

  it("vraagt telefoon of e-mail", () => {
    const e = errors({ name: "Ann", topic: "other", message: "Een vraag" });
    assert.equal(e.phone, "reachRequired");
    assert.equal(e.email, "reachRequired");
  });

  it("vraagt een telefoonnummer bij terugbellen", () => {
    assert.equal(errors({ name: "Ann", email: "a@example.com", topic: "callback" }).phone, "phoneRequiredForCallback");
  });

  it("vraagt een bericht bij andere onderwerpen", () => {
    assert.equal(errors({ name: "Ann", email: "a@example.com", topic: "other" }).message, "messageRequired");
    assert.deepEqual(errors({ name: "Ann", email: "a@example.com", topic: "other", message: "Vraag" }), {});
  });

  it("telt links voor de spamcontrole", () => {
    assert.equal(countLinks("zie https://a.nl en www.b.nl en http://c.nl"), 3);
    assert.equal(countLinks(undefined), 0);
  });
});
