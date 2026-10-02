import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { actionBarVariantFor, audienceFor, headerCtaFor, isActive, isKnownPath } from "@/lib/routes";

// Registers van spec 01 §5.3 en de 404 via de proxy (§4.12, B-55, AC-01-39).

/** Het routescript van spec 01 §10 stap 16. */
const ROUTESCRIPT = [
  "/", "/vacatures", "/inschrijven", "/werkzoekenden", "/werkgevers", "/werkgevers/personeel-aanvragen",
  "/werkgevers/wtta", "/over-ons", "/contact", "/privacyverklaring", "/cookieverklaring", "/algemene-voorwaarden",
  "/klachtenregeling", "/bedankt/sollicitatie", "/bedankt/inschrijving", "/bedankt/aanvraag", "/bedankt/contact",
  "/werken-als/glazenwasser", "/werken-als/schoonmaker", "/werken-als/logistiek-medewerker",
  "/werken-als/verhuizer", "/werken-als/hulpkracht-bouw-en-sloop", "/werkgevers/glazenwassers",
  "/werkgevers/schoonmakers", "/werkgevers/logistiek-medewerkers", "/werkgevers/verhuizers",
  "/werkgevers/hulpkrachten-bouw-en-sloop",
];

/** AC-01-02 plus de vacaturepaden uit AC-01-39 zonder geldig nummer. */
const ONBEKEND = [
  "/diensten/dienst-een", "/werkgebied", "/werkgebied/stad-een", "/privacybeleid", "/werken-als/onbekend",
  "/werkgevers/onbekend", "/bedankt/onbekend", "/en/onbekend", "/een/twee/drie", "/vacatures/onzin",
  "/en/vacatures/onzin", "/vacatures/glazenwasser-den-haag-12", "/en/beheer",
];

describe("isKnownPath (spec 01 §4.12, AC-01-39)", () => {
  it("geeft waar voor elk pad uit het routescript, in nl en en", () => {
    for (const p of ROUTESCRIPT) {
      assert.equal(isKnownPath(p), true, p);
      assert.equal(isKnownPath(p === "/" ? "/en" : `/en${p}`), true, `/en${p}`);
    }
  });

  it("geeft onwaar voor onbekende paden en vacatureslugs zonder nummer", () => {
    for (const p of ONBEKEND) assert.equal(isKnownPath(p), false, p);
  });

  it("accepteert een vacatureslug met nummer en de OG-afbeelding ervan", () => {
    assert.equal(isKnownPath("/vacatures/bestaat-niet-999999"), true);
    assert.equal(isKnownPath("/en/vacatures/glazenwasser-den-haag-1042"), true);
    assert.equal(isKnownPath("/vacatures/glazenwasser-den-haag-1042/opengraph-image"), true);
    assert.equal(isKnownPath("/werken-als/verhuizer/twitter-image"), true);
  });

  it("negeert query en slash aan het eind", () => {
    assert.equal(isKnownPath("/vacatures?beroep=verhuizer"), true);
    assert.equal(isKnownPath("/contact/"), true);
  });
});

describe("doelgroep, headerknop en actiebalk (spec 01 §4.4, §4.6, §5.3)", () => {
  it("audienceFor volgt B-04", () => {
    assert.equal(audienceFor("/werken-als/verhuizer"), "werkzoekende");
    assert.equal(audienceFor("/en/bedankt/inschrijving"), "werkzoekende");
    assert.equal(audienceFor("/algemene-voorwaarden"), "werkgever");
    assert.equal(audienceFor("/bedankt/contact"), "algemeen");
    assert.equal(audienceFor("/een/twee/drie"), "algemeen");
  });

  it("headerCtaFor geeft de knop per doelgroep (AC-01-12)", () => {
    assert.equal(headerCtaFor("/werken-als/verhuizer"), "inschrijven");
    assert.equal(headerCtaFor("/inschrijven"), "vacatures");
    assert.equal(headerCtaFor("/"), "personeelAanvragen");
    assert.equal(headerCtaFor("/werkgevers/verhuizers"), "personeelAanvragen");
    assert.equal(headerCtaFor("/werkgevers/personeel-aanvragen"), "contact");
  });

  it("actionBarVariantFor volgt de tabel van §4.6", () => {
    assert.equal(actionBarVariantFor("/werken-als/schoonmaker"), "werkzoekende");
    assert.equal(actionBarVariantFor("/vacatures/glazenwasser-den-haag-1042"), "vacature");
    assert.equal(actionBarVariantFor("/werkgevers/schoonmakers"), "werkgever");
    assert.equal(actionBarVariantFor("/werkgevers/personeel-aanvragen"), "aanvraag");
    assert.equal(actionBarVariantFor("/"), "algemeen");
  });

  it("isActive markeert pagina en sectie", () => {
    assert.equal(isActive("/werkzoekenden", "werkzoekenden"), "page");
    assert.equal(isActive("/inschrijven", "werkzoekenden"), "section");
    assert.equal(isActive("/werkgevers/wtta", "werkgevers"), "section");
    assert.equal(isActive("/vacatures", "werkgevers"), false);
  });
});
