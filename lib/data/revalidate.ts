import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { VACANCIES_TAG, vacancyTag } from "./cache-tags";

/**
 * Ververst de vacaturedata na een mutatie (spec 08), een statuswissel door de
 * cron of een aanroep van /api/dev/revalidate (spec 10 §4.4, B-35).
 *
 * Profiel "max" bij `kind: "content"` (tekst, uren, loon, vlaggen, verlengen).
 * `{ expire: 0 }` bij `kind: "visibility"` (publiceren, offline halen, sluiten,
 * archiveren, verwijderen en elke wijziging van de publieke staat of de slug),
 * zodat de eerstvolgende bezoeker geen oude versie met JobPosting ziet. De
 * aanroeper kiest `kind` op basis van de publieke staat vóór de actie.
 * Een lege `numbers` ververst alleen de tag `vacatures` en de paden.
 */
export function revalidateVacancies(numbers: number[], kind: "content" | "visibility"): void {
  const profile = kind === "visibility" ? { expire: 0 } : "max";
  revalidateTag(VACANCIES_TAG, profile);
  for (const number of new Set(numbers)) revalidateTag(vacancyTag(number), profile);
  revalidatePath("/[locale]/vacatures", "layout");
  revalidatePath("/sitemap.xml");
}
