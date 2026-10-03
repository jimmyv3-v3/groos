import assert from "node:assert/strict";
import { afterEach, describe, it, vi } from "vitest";
import {
  ORGANIZATION_ID,
  SITE_URL,
  areaServed,
  brandedTitle,
  breadcrumbLd,
  employmentAgencyLd,
  faqLd,
  pageMetadata,
} from "@/lib/seo";
import { contact } from "@/lib/site";

const DESCRIPTION = "x".repeat(130);

afterEach(() => {
  vi.restoreAllMocks();
});

describe("brandedTitle (AC-12-01)", () => {
  it("kiest het lange merk, dan het korte, dan de titel zelf", () => {
    assert.equal(brandedTitle("Contact"), "Contact | Groos Personeelsdiensten");
    const long = "Werken als logistiek medewerker in Den Haag";
    assert.equal(brandedTitle(long), `${long} | Groos`);
    assert.equal(brandedTitle(long).length, 51);
    const tooLong = "a".repeat(58);
    assert.equal(brandedTitle(tooLong), tooLong);
  });
});

describe("pageMetadata (AC-12-02, AC-12-33)", () => {
  const base = { locale: "nl" as const, path: "/bedankt/aanvraag", title: "x", description: "y" };

  it("zet noindex, follow als de optie dat vraagt", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    assert.deepEqual(pageMetadata({ ...base, noindex: true }).robots, { index: false, follow: true });
  });

  it("geeft standaard index met max-image-preview large, hreflang en de site-brede OG-afbeelding", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const meta = pageMetadata(base);
    const robots = meta.robots as { googleBot: Record<string, unknown> };
    assert.equal(robots.googleBot["max-image-preview"], "large");
    assert.deepEqual(Object.keys(meta.alternates?.languages ?? {}), ["nl", "en", "x-default"]);
    const images = meta.openGraph?.images as { url: string }[];
    assert.equal(images[0].url, "/opengraph-image");
    assert.equal((meta.twitter as { card?: string }).card, "summary_large_image");
  });

  it("laat languages weg en volgt een afwijkende canonical", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    assert.equal(pageMetadata({ ...base, languages: false }).alternates?.languages, undefined);
    const meta = pageMetadata({ ...base, locale: "en", canonical: { locale: "nl", path: "/vacatures/a-1001" } });
    assert.equal(meta.alternates?.canonical, "/vacatures/a-1001");
  });

  it("waarschuwt één keer bij een eigen titeldeel van 53 tekens, niet bij 52", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    pageMetadata({ locale: "nl", path: "/x", title: "a".repeat(53), description: DESCRIPTION });
    assert.equal(warn.mock.calls.length, 1);
    assert.match(String(warn.mock.calls[0][0]), /53/);
    assert.match(String(warn.mock.calls[0][0]), /\/x/);

    warn.mockClear();
    const meta = pageMetadata({ locale: "nl", path: "/x", title: "a".repeat(52), description: DESCRIPTION });
    assert.equal(warn.mock.calls.length, 0);
    assert.ok((meta.title as { absolute: string }).absolute.endsWith(" | Groos"));
  });
});

describe("employmentAgencyLd (AC-12-05)", () => {
  it("geeft naam, adres en telefoon zonder geo of beoordelingen", () => {
    const ld = employmentAgencyLd({ locale: "nl", description: "d" });
    assert.equal(ld["@type"], "EmploymentAgency");
    assert.equal(ld["@id"], ORGANIZATION_ID);
    assert.equal(ORGANIZATION_ID, `${SITE_URL}/#organization`);
    const address = ld.address as Record<string, unknown>;
    assert.equal(address.streetAddress, "Hugo Coenraadspad 6");
    assert.equal(address.postalCode, "2553 ER");
    assert.equal(ld.telephone, "+31683351985");
    assert.equal(ld.geo, undefined);
    assert.equal(ld.aggregateRating, undefined);
    if (!contact.openingHours) assert.equal(ld.openingHoursSpecification, undefined);
  });

  it("noemt als werkgebied alleen plaatsen zolang workArea niet bevestigd is (B-43)", () => {
    const area = areaServed();
    assert.ok(area.length > 0);
    assert.ok(area.every((a) => a["@type"] === "City"));
    assert.deepEqual(employmentAgencyLd({ locale: "nl", description: "d" }).areaServed, area);
  });
});

describe("breadcrumbLd en faqLd", () => {
  it("nummert de kruimels vanaf 1 met absolute URL's", () => {
    const ld = breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Vacatures", path: "/vacatures" },
    ]);
    const items = ld.itemListElement as { position: number; item: string }[];
    assert.deepEqual(
      items.map((i) => i.position),
      [1, 2],
    );
    assert.ok(items.every((i) => i.item.startsWith(SITE_URL)));
  });

  it("zet elke vraag met antwoord in een FAQPage", () => {
    const ld = faqLd([{ q: "Vraag?", a: "Antwoord." }]);
    assert.equal(ld["@type"], "FAQPage");
    const main = ld.mainEntity as { name: string; acceptedAnswer: { text: string } }[];
    assert.equal(main[0].name, "Vraag?");
    assert.equal(main[0].acceptedAnswer.text, "Antwoord.");
  });
});
