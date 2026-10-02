import type { BeforeSendEvent } from "@vercel/analytics";

/**
 * Vercel Web Analytics zonder persoonsgegevens (spec 09 §4.7, B-31). Alleen
 * deze queryparameters gaan mee; al het andere (ook q en ref) valt weg.
 */
export const ANALYTICS_ALLOWED_PARAMS = ["beroep", "plaats", "uren", "dienst", "pagina"] as const;

/** Haalt /beheer weg en verwijdert elke queryparameter die niet op de lijst staat (ook q en ref). */
export function analyticsBeforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  const url = new URL(event.url);
  if (url.pathname.startsWith("/beheer")) return null;
  for (const key of [...url.searchParams.keys()]) {
    if (!(ANALYTICS_ALLOWED_PARAMS as readonly string[]).includes(key)) url.searchParams.delete(key);
  }
  return { ...event, url: url.toString() };
}
