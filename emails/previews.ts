import type { EmailTemplateName } from "@/lib/email/types";
import { formatTime } from "@/lib/format";
import { contact, site } from "@/lib/site";
import type { EmailCompany, EmailLinks, EmailLocale } from "./types";

/**
 * Voorbeeldprops voor de voorbeeldroute en de templatetest (spec 11 §4.12).
 * Alleen adressen op example.com. Het veld message bestaat niet in de props;
 * de test controleert dat de tekst "GEHEIME TESTTEKST" nergens verschijnt.
 */

export const PREVIEW_VARIANTS = ["default", "consent", "callback", "claims", "noName", "en"] as const;
export type PreviewVariant = (typeof PREVIEW_VARIANTS)[number];

let ORIGIN = "http://localhost:3000";

function previewCompany(locale: EmailLocale, withHours: boolean): EmailCompany {
  const prefix = locale === "nl" ? "" : `/${locale}`;
  return {
    legalName: contact.name,
    street: contact.street,
    postalCode: contact.postalCode,
    city: contact.city,
    phoneDisplay: contact.phone,
    phoneHref: contact.phoneHref,
    email: contact.email,
    websiteUrl: `${ORIGIN}${prefix || "/"}`,
    websiteLabel: site.url.replace(/^https:\/\//, ""),
    kvk: contact.kvk ?? null,
    officeHours: withHours
      ? locale === "nl"
        ? `maandag tot en met vrijdag van ${formatTime("07:00", "nl")} tot ${formatTime("18:00", "nl")} uur`
        : `Monday to Friday, ${formatTime("07:00", "en")} to ${formatTime("18:00", "en")}`
      : null,
    logoUrl: `${ORIGIN}/brand/logo-email.png`,
  };
}

function previewLinks(locale: EmailLocale): EmailLinks {
  const prefix = locale === "nl" ? "" : `/${locale}`;
  const privacy = `${ORIGIN}${prefix}/privacyverklaring`;
  return {
    privacy: {
      solliciteren: `${privacy}#solliciteren`,
      inschrijven: `${privacy}#inschrijven`,
      opdrachtgevers: `${privacy}#opdrachtgevers`,
      berichten: `${privacy}#berichten`,
    },
    vacancies: `${ORIGIN}${prefix}/vacatures`,
    register: `${ORIGIN}${prefix}/inschrijven`,
    staffRequest: `${ORIGIN}${prefix}/werkgevers/personeel-aanvragen`,
  };
}

const PHONE = { display: "06 12 34 56 78", href: "tel:+31612345678" };
const WHATSAPP = "https://wa.me/31612345678";

/** Props voor een template in een taal, met een optionele variant. */
export function previewProps(
  template: EmailTemplateName,
  locale: EmailLocale,
  variant: PreviewVariant = "default",
  origin = "http://localhost:3000",
) {
  ORIGIN = origin;
  const claims = variant === "claims";
  const company = previewCompany(locale, claims);
  const links = previewLinks(locale);
  const greetingName = variant === "noName" ? null : "Test";
  const formLocale: EmailLocale = variant === "en" ? "en" : "nl";

  switch (template) {
    case "application-confirmation":
      return {
        locale,
        company,
        greetingName,
        reference: "S-2026-0001",
        vacancyTitle: "Glazenwasser",
        vacancyNumber: 1001,
        vacancyCity: "Den Haag",
        phoneDisplay: PHONE.display,
        hasCv: true,
        retentionConsent: variant === "consent",
        showResponseTime: claims,
        links,
      };
    case "registration-confirmation":
      return {
        locale,
        company,
        greetingName,
        reference: "S-2026-0002",
        occupationLabels: locale === "nl" ? ["Glazenwasser", "Schoonmaker"] : ["Window cleaner", "Cleaner"],
        phoneDisplay: PHONE.display,
        hasCv: false,
        showResponseTime: claims,
        links,
      };
    case "staff-request-confirmation":
      return {
        locale,
        company,
        greetingName,
        reference: "P-2026-0001",
        companyName: "Testbedrijf B.V.",
        occupationLabels: locale === "nl" ? ["Schoonmakers", "Glazenwassers"] : ["Cleaners", "Window cleaners"],
        hasOtherOccupation: variant === "consent",
        headcount: 4,
        start: claims ? { asap: false, dateLabel: locale === "nl" ? "2 november 2026" : "2 November 2026" } : { asap: true },
        duration: "weeks",
        hoursPerWeek: 32,
        workCity: "Rijswijk",
        showResponseTime: claims,
        showAfterHours: claims,
        links,
      };
    case "contact-confirmation":
      return {
        locale,
        company,
        greetingName,
        topic: variant === "callback" ? "callback" : variant === "consent" ? "job_seeker" : "employer",
        links,
      };
    case "application-notification":
      return {
        locale: "nl",
        company,
        reference: "S-2026-0001",
        fullName: "Test Kandidaat",
        phone: PHONE,
        whatsappHref: WHATSAPP,
        email: "test.kandidaat@example.com",
        city: "Den Haag",
        mayWorkInNl: true,
        hasDrivingLicenseB: variant === "consent" ? true : null,
        availableFromLabel: "2 november 2026",
        hasCv: true,
        hasMessage: true,
        retentionConsent: variant === "consent",
        formLocale,
        utmSource: "google_jobs_apply",
        vacancyTitle: "Glazenwasser",
        vacancyNumber: 1001,
        beheerLink: `${ORIGIN}/beheer/sollicitaties/S-2026-0001`,
      };
    case "registration-notification":
      return {
        locale: "nl",
        company,
        reference: "S-2026-0002",
        fullName: "Test Kandidaat",
        phone: PHONE,
        whatsappHref: WHATSAPP,
        email: "test.kandidaat@example.com",
        city: "Delft",
        mayWorkInNl: true,
        hasDrivingLicenseB: true,
        availableFromLabel: null,
        hasCv: false,
        hasMessage: false,
        formLocale,
        utmSource: null,
        occupationLabels: ["Glazenwasser", "Schoonmaker"],
        beheerLink: `${ORIGIN}/beheer/sollicitaties/S-2026-0002`,
      };
    case "staff-request-notification":
      return {
        locale: "nl",
        company,
        reference: "P-2026-0001",
        companyName: "Testbedrijf B.V.",
        kvkNumber: "12345678",
        contactName: "Test Opdrachtgever",
        phone: { display: "070 123 45 67", href: "tel:+31701234567" },
        whatsappHref: null,
        email: "opdrachtgever@example.com",
        occupationLabels: ["Schoonmakers", "Glazenwassers"],
        occupationOther: "Hulp bij een evenement",
        headcount: 4,
        start: { asap: true },
        duration: "weeks",
        hoursPerWeek: 32,
        workCity: "Rijswijk",
        hasDescription: true,
        formLocale,
        utmSource: null,
        beheerLink: `${ORIGIN}/beheer/aanvragen/P-2026-0001`,
      };
    case "contact-notification":
      return {
        locale: "nl",
        company,
        name: "Test Kandidaat",
        phone: variant === "default" || variant === "callback" ? PHONE : null,
        whatsappHref: variant === "default" || variant === "callback" ? WHATSAPP : null,
        email: variant === "callback" ? null : "test.kandidaat@example.com",
        topic: variant === "callback" ? "callback" : "other",
        hasMessage: variant !== "callback",
        formLocale,
        beheerLink: `${ORIGIN}/beheer/berichten/00000000-0000-4000-8000-000000000001`,
      };
  }
}
