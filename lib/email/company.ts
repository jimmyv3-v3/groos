import "server-only";
import { beheerOrigin } from "@/app/beheer/_lib/paths";
import type { EmailCompany, EmailLinks, EmailLocale } from "@/emails/types";
import { formatTime } from "@/lib/format";
import { ROUTES } from "@/lib/routes";
import { localizedPath } from "@/lib/seo";
import { contact, site } from "@/lib/site";

/** Bedrijfsblok en links voor de mails (spec 11 §4.9). */

/** Basis-URL van alle links in mails (= beheerOrigin() van spec 08). */
export function emailOrigin(): string {
  return beheerOrigin();
}

function officeHours(locale: EmailLocale): string | null {
  const hours = contact.openingHours;
  if (!hours) return null;
  const opens = formatTime(hours.opens, locale);
  const closes = formatTime(hours.closes, locale);
  return locale === "nl"
    ? `maandag tot en met vrijdag van ${opens} tot ${closes} uur`
    : `Monday to Friday, ${opens} to ${closes}`;
}

export function emailCompany(locale: EmailLocale): EmailCompany {
  const origin = emailOrigin();
  return {
    legalName: contact.name,
    street: contact.street,
    postalCode: contact.postalCode,
    city: contact.city,
    phoneDisplay: contact.phone,
    phoneHref: contact.phoneHref,
    email: contact.email,
    websiteUrl: origin + localizedPath(locale, "/"),
    websiteLabel: site.url.replace(/^https:\/\//, ""),
    kvk: contact.kvk ?? null,
    officeHours: officeHours(locale),
    logoUrl: `${origin}/brand/logo-email.png`,
  };
}

export function emailLinks(locale: EmailLocale): EmailLinks {
  const origin = emailOrigin();
  const privacy = origin + localizedPath(locale, ROUTES.privacyverklaring);
  return {
    privacy: {
      solliciteren: `${privacy}#solliciteren`,
      inschrijven: `${privacy}#inschrijven`,
      opdrachtgevers: `${privacy}#opdrachtgevers`,
      berichten: `${privacy}#berichten`,
    },
    vacancies: origin + localizedPath(locale, ROUTES.vacatures),
    register: origin + localizedPath(locale, ROUTES.inschrijven),
    staffRequest: origin + localizedPath(locale, ROUTES.personeelAanvragen),
  };
}
