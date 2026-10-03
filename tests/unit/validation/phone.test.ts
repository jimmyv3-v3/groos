import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { formatPhoneDisplay, normalizePhone } from "@/lib/validation/phone";

describe("normalizePhone", () => {
  it("zet Nederlandse en buitenlandse nummers om naar E.164", () => {
    assert.equal(normalizePhone("06 12345678"), "+31612345678");
    assert.equal(normalizePhone("0031 6 1234 5678"), "+31612345678");
    assert.equal(normalizePhone("+48 512 345 678"), "+48512345678");
    assert.equal(normalizePhone("+31 (0)6-1234 5678"), "+31612345678");
    assert.equal(normalizePhone("070-1234567"), "+31701234567");
    assert.equal(normalizePhone("612345678"), "+31612345678");
  });

  it("geeft null bij ongeldige invoer", () => {
    assert.equal(normalizePhone("12345"), null);
    assert.equal(normalizePhone("+3161234"), null);
    assert.equal(normalizePhone("geen nummer"), null);
  });
});

describe("formatPhoneDisplay", () => {
  it("maakt nummers leesbaar", () => {
    assert.equal(formatPhoneDisplay("+31612345678"), "06 12 34 56 78");
    assert.equal(formatPhoneDisplay("+31701234567"), "070 123 45 67");
    assert.equal(formatPhoneDisplay("+48512345678"), "+48 512345678");
  });
});
