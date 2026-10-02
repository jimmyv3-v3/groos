import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { services } from "@/content/services";
import { cities } from "@/content/werkgebied";
import { absoluteUrl, localizedPath } from "@/lib/seo";

// Alle indexeerbare routes, afgeleid uit de registers. Een nieuwe dienst of
// stad verschijnt hier dus vanzelf; alleen losse pagina's voeg je hieronder toe.
const STATIC_PATHS = ["/", "/werkgebied", "/privacybeleid", "/algemene-voorwaarden"];

function priorityFor(path: string): number {
  if (path === "/") return 1;
  if (path.startsWith("/diensten")) return 0.8;
  if (path.startsWith("/werkgebied")) return 0.7;
  return 0.4;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...STATIC_PATHS,
    ...services.map((s) => `/diensten/${s.slug}`),
    ...cities.map((c) => `/werkgebied/${c.slug}`),
  ];

  // Per route één entry per taal, elk met hreflang-alternates naar alle talen.
  return paths.flatMap((path) => {
    const languages: Record<string, string> = {};
    for (const l of routing.locales) languages[l] = absoluteUrl(localizedPath(l, path));
    languages["x-default"] = absoluteUrl(localizedPath(routing.defaultLocale, path));

    return routing.locales.map((locale) => ({
      url: absoluteUrl(localizedPath(locale, path)),
      changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: priorityFor(path),
      alternates: { languages },
    }));
  });
}
