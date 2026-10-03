import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { beroepen } from "@/content/beroepen";
import { BEROEP_ROUTE_META, STATIC_ROUTES, paths, type AppPath, type SitemapMeta } from "@/lib/routes";
import { LEGAL_DOCS } from "@/lib/legal";
import { getVacancySitemapEntries } from "@/lib/data/vacancies";
import { parseVacancySlug } from "@/lib/data/vacancy-search-params";
import { absoluteUrl, localizedPath } from "@/lib/seo";

/**
 * Sitemap uit de registers (spec 12 §4.7): gepubliceerde vaste routes en de
 * tien beroepspagina's in beide talen met hreflang, plus open vacatures alleen
 * als NL-URL zonder alternates. `published` komt uit STATIC_ROUTES (voor de
 * juridische routes via lib/legal.ts, B-40). Een Supabase-fout gooit (B-56);
 * zonder .env.local geeft de datalaag een lege lijst, zodat de build lukt.
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

/** Nummer uit het laatste padsegment, voor de volgorde op nummer aflopend. */
function numberOf(path: string): number {
  return parseVacancySlug(path.slice(path.lastIndexOf("/") + 1)) ?? 0;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vacancies = [...(await getVacancySitemapEntries())].sort((a, b) => numberOf(b.path) - numberOf(a.path));
  // Laatste wijziging van de vacatures geldt voor / en /vacatures, die ze tonen (regel 4).
  const latest = vacancies.map((v) => v.lastModified).sort().at(-1);
  const legalUpdatedAt = new Map<string, string | undefined>(LEGAL_DOCS.map((d) => [d.path, d.updatedAt]));

  const statics = STATIC_ROUTES.filter((r) => r.published && r.sitemap).flatMap((r) => {
    const lastModified = r.path === "/" || r.path === "/vacatures" ? latest : legalUpdatedAt.get(r.path);
    return localizedEntries(r.path, r.sitemap!, lastModified);
  });

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
