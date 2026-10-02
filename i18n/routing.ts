import { defineRouting } from "next-intl/routing";

// Nederlands is de standaardtaal en krijgt geen URL-prefix (schone root-URL's).
// Engels leeft onder /en. Door "as-needed" blijven Nederlandse paden ongewijzigd
// en is alleen de Engelse variant herkenbaar aan de prefix.
// Eentalige site? Zet locales op ["nl"]: de taalknop, de geo-redirect en de
// hreflang-alternates verdwijnen dan vanzelf.
export const routing = defineRouting({
  locales: ["nl", "en"],
  defaultLocale: "nl",
  localePrefix: "as-needed",
  // Taaldetectie regelen we volledig zelf in proxy.ts (IP-geo + cookie), zodat
  // het IP-signaal voorrang heeft op de browsertaal.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

/**
 * Landen waarvoor bezoekers standaard de standaardtaal zien. Bezoekers van
 * elders krijgen bij hun eerste bezoek de tweede taal (zie proxy.ts).
 */
export const DEFAULT_LOCALE_COUNTRIES: string[] = ["NL", "BE"];
