import type { ServiceCopy, ServicePage } from "./types";
import dienstEen from "./dienst-een";
import dienstTwee from "./dienst-twee";
import dienstDrie from "./dienst-drie";
import dienstVier from "./dienst-vier";

/**
 * Volledige paginacontent per dienst, op slug. Alleen server-side importeren
 * (dienstpagina's), zodat de lange teksten niet in de client-bundle belanden.
 * Elke slug uit ./index.ts moet hier staan; `npm run check` controleert dat.
 */
export const servicePages: Record<string, ServicePage> = {
  "dienst-een": dienstEen,
  "dienst-twee": dienstTwee,
  "dienst-drie": dienstDrie,
  "dienst-vier": dienstVier,
};

export function getServicePage(
  slug: string,
  locale: string,
): { page: ServicePage; copy: ServiceCopy } | undefined {
  const page = servicePages[slug];
  if (!page) return undefined;
  const copy = (locale === "en" && page.en) || page.nl;
  return { page, copy };
}
