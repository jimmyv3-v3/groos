import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { formats } from "./formats";

// Messages staan per taal en per namespace in messages/<locale>/<namespace>.json.
// messages/<locale>/index.ts voegt ze samen met statische imports (werkt met
// Turbopack en geeft global.d.ts het type). Alleen de gevraagde taal wordt geladen.
const loaders = {
  nl: () => import("../messages/nl"),
  en: () => import("../messages/en"),
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await loaders[locale]()).default,
    timeZone: "Europe/Amsterdam",
    formats,
  };
});
