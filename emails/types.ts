/** Gedeelde typen van de mailtemplates (spec 11 §4.9). */

export type EmailLocale = "nl" | "en";

export type EmailCompany = {
  /** contact.name, "Groos Personeelsdiensten B.V." */
  legalName: string;
  street: string;
  postalCode: string;
  city: string;
  /** contact.phone, "06 52 54 95 39" */
  phoneDisplay: string;
  /** contact.phoneHref */
  phoneHref: string;
  /** contact.email */
  email: string;
  /** emailOrigin() + localizedPath(locale, "/") */
  websiteUrl: string;
  /** site.url zonder "https://" */
  websiteLabel: string;
  /** contact.kvk, alleen als gevuld */
  kvk: string | null;
  /** Alleen als contact.openingHours gevuld is. */
  officeHours: string | null;
  /** emailOrigin() + "/brand/logo-email.png" */
  logoUrl: string;
};

export type EmailLinks = {
  privacy: Record<"solliciteren" | "inschrijven" | "opdrachtgevers" | "berichten", string>;
  vacancies: string;
  register: string;
  staffRequest: string;
};
