import { defineRouting } from "next-intl/routing";

// Nederlands is de standaardtaal en krijgt geen URL-prefix; Engels leeft onder
// /en met dezelfde (Nederlandse) paden (B-03, spec 01 §4.11.1).
// Eentalige site? Zet locales op ["nl"]: taalknop, geo-redirect en
// hreflang-alternates verdwijnen dan vanzelf.
export const routing = defineRouting({
  locales: ["nl", "en"],
  defaultLocale: "nl",
  localePrefix: "as-needed",
  // De taal bepaalt proxy.ts zelf (cookie en IP-land), niet de browsertaal.
  localeDetection: false,
  // NEXT_LOCALE beheren proxy.ts en LanguageToggle; next-intl raakt de cookie niet aan.
  localeCookie: false,
  // hreflang alleen via pageMetadata(); de Link-header van next-intl zou
  // ook een EN-alternatief melden voor vacatures die alleen in het Nederlands bestaan.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];

/** Landen waar een eerste bezoek de standaardtaal krijgt (zie proxy.ts). */
export const DEFAULT_LOCALE_COUNTRIES: readonly string[] = ["NL", "BE"];
