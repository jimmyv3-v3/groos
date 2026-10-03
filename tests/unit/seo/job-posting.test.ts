import assert from "node:assert/strict";
import { describe, it } from "vitest";
import { employmentTypesFor, escapeHtml, jobDescriptionHtml, jobPostingLd, SITE_URL } from "@/lib/seo";
import { contact } from "@/lib/site";
import { fixtureVacancy } from "../../fixtures/vacancies";

const NOW = new Date("2026-10-02T10:00:00Z");
const LABELS = { tasks: "Wat ga je doen", requirements: "Wat vragen wij", offer: "Wat bieden wij", extra: "Goed om te weten" };
const FACTS = ["32 tot 40 uur per week", "€ 16,08 tot € 17,50 bruto per uur", "Je kunt direct beginnen."];

function ld(number: number, overrides: Partial<ReturnType<typeof fixtureVacancy>> = {}) {
  const vacancy = { ...fixtureVacancy(number, NOW), ...overrides };
  return jobPostingLd({ vacancy, labels: LABELS, facts: FACTS, minAgeSentence: null });
}

describe("jobPostingLd (spec 12 §5.3, spec 14 seo/job-posting)", () => {
  it("vult de verplichte en aanbevolen velden voor een open vacature", () => {
    const result = ld(1001);
    assert.ok(result);
    assert.equal(result["@type"], "JobPosting");
    assert.equal(result.title, "Glazenwasser");
    assert.equal(result.datePosted, fixtureVacancy(1001, NOW).publishedAt);
    assert.equal(result.validThrough, fixtureVacancy(1001, NOW).closesAt);
    assert.match(String(result.datePosted), /^\d{4}-\d{2}-\d{2}T/);
    assert.match(String(result.validThrough), /^\d{4}-\d{2}-\d{2}T/);
    assert.deepEqual(result.employmentType, ["TEMPORARY", "FULL_TIME"]);
    assert.equal(result.directApply, true);
    assert.equal(result.url, `${SITE_URL}/vacatures/glazenwasser-den-haag-1001`);
  });

  it("noemt Groos als werkgever met sameAs en logo", () => {
    const org = ld(1001)?.hiringOrganization as Record<string, unknown>;
    assert.equal(org.name, contact.name);
    assert.equal(org.sameAs, SITE_URL);
    assert.match(String(org.logo), /^https:\/\/.+\.png$/);
  });

  it("geeft plaats en land, en het uurloon in euro per uur", () => {
    const result = ld(1001);
    const address = (result?.jobLocation as { address: Record<string, unknown> }).address;
    assert.equal(address.addressLocality, "Den Haag");
    assert.equal(address.addressCountry, "NL");
    assert.deepEqual(result?.baseSalary, {
      "@type": "MonetaryAmount",
      currency: "EUR",
      value: { "@type": "QuantitativeValue", minValue: 16.08, maxValue: 17.5, unitText: "HOUR" },
    });
    assert.deepEqual(result?.identifier, { "@type": "PropertyValue", name: contact.name, value: "1001" });
  });

  it("gebruikt één bedrag als minimum en maximum gelijk zijn", () => {
    const salary = ld(1001, { salaryMin: 16, salaryMax: 16 })?.baseSalary as { value: Record<string, unknown> };
    assert.deepEqual(salary.value, { "@type": "QuantitativeValue", value: 16, unitText: "HOUR" });
  });

  it("zet de beschrijving als HTML met escaping", () => {
    const description = String(ld(1001, { tasks: ["Ramen <wassen> & drogen", "a", "b"] })?.description);
    assert.match(description, /^<p>/);
    assert.ok(description.includes("<strong>Wat ga je doen</strong>"));
    assert.ok(description.includes("Ramen &lt;wassen&gt; &amp; drogen"));
    assert.ok(description.includes("32 tot 40 uur per week."));
  });

  it("noemt de startdatum alleen als die vastligt", () => {
    assert.equal(ld(1001)?.jobStartDate, undefined);
    assert.equal(ld(1001, { startAsap: false, startDate: "2026-11-01" })?.jobStartDate, "2026-11-01");
  });

  it("geeft geen JobPosting voor een gesloten vacature", () => {
    assert.equal(fixtureVacancy(1007, NOW).state, "closed");
    assert.equal(ld(1007), null);
  });
});

describe("employmentTypesFor en escapeHtml", () => {
  it("volgt de mapping van spec 12 §5.3", () => {
    assert.deepEqual(employmentTypesFor("temp_agency", 32, 40), ["TEMPORARY", "FULL_TIME"]);
    assert.deepEqual(employmentTypesFor("temp_agency", 16, 24), ["TEMPORARY", "PART_TIME"]);
    assert.deepEqual(employmentTypesFor("secondment", 24, 40), ["TEMPORARY", "FULL_TIME", "PART_TIME"]);
    assert.deepEqual(employmentTypesFor("recruitment", 38, 40), ["FULL_TIME"]);
  });

  it("escapet de vijf HTML-tekens", () => {
    assert.equal(escapeHtml(`<a href="x">'&'</a>`), "&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
  });

  it("zet de minimumleeftijdzin als laatste eis", () => {
    const html = jobDescriptionHtml(fixtureVacancy(1001, NOW), LABELS, FACTS, "Je bent minimaal 18 jaar.");
    assert.ok(html.includes("<li>Je bent minimaal 18 jaar.</li></ul>"));
  });
});
