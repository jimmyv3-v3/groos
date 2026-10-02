import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cleanError, hashRecipients } from "@/lib/email/log";
import { cleanSubject, safeEcho } from "@/lib/email/sanitize";

describe("safeEcho", () => {
  it("laat gewone namen door", () => {
    assert.equal(safeEcho("Jan"), "Jan");
    assert.equal(safeEcho("Anne-Marie"), "Anne-Marie");
    assert.equal(safeEcho("D'Souza"), "D'Souza");
    assert.equal(safeEcho("Testbedrijf B.V."), "Testbedrijf B.V.");
  });

  it("weigert links, adressen en te lange tekst", () => {
    assert.equal(safeEcho("Bezoek www.spam.nl"), null);
    assert.equal(safeEcho("a@b.nl"), null);
    assert.equal(safeEcho("http://x"), null);
    assert.equal(safeEcho("spam.com"), null);
    assert.equal(safeEcho("x".repeat(61)), null);
    assert.equal(safeEcho("Jan", 2), null);
    assert.equal(safeEcho(""), null);
    assert.equal(safeEcho(null), null);
  });
});

describe("cleanSubject en cleanError", () => {
  it("maakt een onderwerp van één regel van hoogstens 150 tekens", () => {
    assert.equal(cleanSubject("  Nieuw\n bericht  "), "Nieuw bericht");
    assert.ok(cleanSubject("x".repeat(400)).length <= 150);
  });

  it("vervangt adressen in foutmeldingen", () => {
    assert.equal(cleanError("Invalid to: jan@example.com"), "Invalid to: [adres]");
    assert.ok(cleanError("x".repeat(900)).length <= 500);
  });
});

describe("hashRecipients", () => {
  it("is onafhankelijk van volgorde en hoofdletters", () => {
    const a = hashRecipients(["B@x.nl", "a@x.nl"]);
    assert.equal(a, hashRecipients(["a@x.nl", "b@x.nl"]));
    assert.match(a, /^[0-9a-f]{64}$/);
  });
});
