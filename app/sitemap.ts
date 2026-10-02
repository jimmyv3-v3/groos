import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { beroepen } from "@/content/beroepen";
import { BEROEP_ROUTE_META, STATIC_ROUTES, paths, type AppPath, type SitemapMeta } from "@/lib/routes";
import { getVacancySitemapEntries } from "@/lib/data/vacancies";
import { absoluteUrl, localizedPath } from "@/lib/seo";

/**
 * Sitemap uit de registers (spec 12 §4.7, spec 01 §7.3): gepubliceerde vaste
 * routes en de tien beroepspagina's in beide talen met hreflang, plus open
 * vacatures alleen als NL-URL. Zonder database (geen .env.local of een fout)
 * geeft de datalaag een lege lijst, zodat de build blijft werken.
 * Spec 12 vervangt het filter op `published` door LEGAL_DOCS van spec 09.
 */
export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

function localizedEntries(path: AppPath, meta: SitemapMeta, lastModified?: string): Entry[] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = absoluteUrl(localizedPath(l, path));
  languages["x-default"] = absoluteUrl(localizedPath(routing.defaultLocale, path));
  return routing.locales.map((locale) => ({
    url: absoluteUrl(localizedPath(locale, path)),
    ...(lastModified && { lastModified }),
    changeFrequency: meta.changeFrequency,
    priority: meta.priority,
    alternates: { languages },
  }));
}

async function vacancyEntries() {
  try {
    return await getVacancySitemapEntries();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vacancies = await vacancyEntries();
  // Laatste wijziging van de vacatures geldt voor / en /vacatures, die ze tonen.
  const latest = vacancies.map((v) => v.lastModified).sort().at(-1);

  const statics = STATIC_ROUTES.filter((r) => r.published && r.sitemap).flatMap((r) =>
    localizedEntries(r.path, r.sitemap!, r.path === "/" || r.path === "/vacatures" ? latest : undefined),
  );

  const beroepPages = [...beroepen]
    .sort((a, b) => a.order - b.order)
    .flatMap((b) => [
      ...localizedEntries(paths.werkenAls(b.id), BEROEP_ROUTE_META.werkzoekende),
      ...localizedEntries(paths.werkgeverBeroep(b.id), BEROEP_ROUTE_META.werkgever),
    ]);

  const vacancyPages: Entry[] = vacancies.map((v) => ({
    url: absoluteUrl(v.path),
    lastModified: v.lastModified,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...statics, ...beroepPages, ...vacancyPages];
}
