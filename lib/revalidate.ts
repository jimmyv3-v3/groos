import "server-only";
import { revalidatePath } from "next/cache";
import { routing } from "@/i18n/routing";
import type { AppPath } from "@/lib/routes";

/**
 * Pad-revalidatie per taal (spec 01 §4.15). next-intl serveert NL intern onder
 * /nl, en revalidatePath heeft het bestemmingspad nodig.
 */

/** Ververst een publiek pad in alle talen, bijvoorbeeld "/vacatures" of "/vacatures/glazenwasser-den-haag-1042". */
export function revalidateLocalizedPath(path: AppPath): void {
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}${path === "/" ? "" : path}`);
  }
}

/** Ververst alle pagina's van een routepatroon, bijvoorbeeld "/vacatures/[slug]". */
export function revalidateRoutePattern(pattern: `/${string}`): void {
  revalidatePath(`/[locale]${pattern}`, "page");
}
