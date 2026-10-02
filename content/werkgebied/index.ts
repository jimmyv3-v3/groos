import type { City, CityView } from "./types";
import stadEen from "./stad-een";
import stadTwee from "./stad-twee";

/**
 * Lokale SEO: steden met een eigen landingspagina onder /werkgebied/<slug>, in
 * weergavevolgorde. Een stad toevoegen = een bestand in deze map in de vorm van
 * ./stad-een.ts en het hieronder registreren. Sitemap, llms.txt, footer en het
 * werkgebied-overzicht volgen automatisch.
 *
 * Werkt het bedrijf niet lokaal of regionaal, dan kan de hele module weg: zie
 * docs/MIGRATIE.md onder "Optionele modules".
 */
export const cities: City[] = [stadEen, stadTwee];

export function getCity(slug: string, locale: string): CityView | undefined {
  const city = cities.find((c) => c.slug === slug);
  if (!city) return undefined;
  const copy = (locale === "en" && city.en) || city.nl;
  return {
    slug: city.slug,
    province: city.province,
    image: city.image,
    ...copy,
    name: copy.name ?? city.name,
  };
}
