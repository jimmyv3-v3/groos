import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { LEGAL_DOCS, PRIVACY_NOTICE_VERSION, getLegalDoc, publishedLegalDocs, type WttaConfig } from "@/lib/legal";
import { ANALYTICS_ALLOWED_PARAMS, analyticsBeforeSend } from "@/lib/analytics-privacy";

describe("lib/legal.ts (spec 09 §5.1)", () => {
  it("kent elk document precies één keer met een vast pad", () => {
    assert.deepEqual(
      LEGAL_DOCS.map((d) => [d.id, d.path]),
      [
        ["privacy", "/privacyverklaring"],
        ["cookies", "/cookieverklaring"],
        ["complaints", "/klachtenregeling"],
        ["terms", "/algemene-voorwaarden"],
      ],
    );
  });

  it("publiceert de voorwaarden pas als de tekst er is (B-11, AC-09-07)", () => {
    assert.equal(getLegalDoc("terms").published, false);
    assert.deepEqual(
      publishedLegalDocs().map((d) => d.id),
      ["privacy", "cookies", "complaints"],
    );
  });

  it("geeft de versie van de privacyverklaring door aan de formulieren (E-09-11)", () => {
    assert.equal(PRIVACY_NOTICE_VERSION, getLegalDoc("privacy").version);
    assert.match(PRIVACY_NOTICE_VERSION, /^\d+\.\d+$/);
  });

  it("heeft een geldige ISO-datum bij elk gepubliceerd document", () => {
    for (const doc of publishedLegalDocs()) assert.match(doc.updatedAt ?? "", /^\d{4}-\d{2}-\d{2}$/);
  });

  it("laat een toelating zonder registernummer niet toe (AC-09-12)", () => {
    // @ts-expect-error registerNumber en registerUrl zijn verplicht bij "admitted"; npm run typecheck faalt anders.
    const zonderNummer: WttaConfig = { phase: "admitted" };
    assert.equal(zonderNummer.phase, "admitted");
  });
});

describe("analyticsBeforeSend (spec 09 §4.7, AC-09-17)", () => {
  it("houdt alleen toegestane queryparameters over", () => {
    const event = analyticsBeforeSend({ type: "pageview", url: "https://x.nl/vacatures?q=jan&beroep=schoonmaker&ref=S-1" });
    assert.equal(event?.url, "https://x.nl/vacatures?beroep=schoonmaker");
  });

  it("meet /beheer niet", () => {
    assert.equal(analyticsBeforeSend({ type: "pageview", url: "https://x.nl/beheer/sollicitaties" }), null);
  });

  it("laat elke toegestane parameter staan", () => {
    const query = ANALYTICS_ALLOWED_PARAMS.map((p) => `${p}=1`).join("&");
    const event = analyticsBeforeSend({ type: "pageview", url: `https://x.nl/vacatures?${query}&email=a%40b.nl` });
    assert.equal(event?.url, `https://x.nl/vacatures?${query}`);
  });
});
