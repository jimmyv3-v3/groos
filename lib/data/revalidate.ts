import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";
import { VACANCIES_TAG, vacancyTag } from "./cache-tags";

/**
 * Ververst de vacaturedata na een mutatie (spec 08) of een statuswissel door
 * de cron (spec 10 §4.4).
 *
 * Profiel: "max" voor beide soorten, volgens beslissing B-35 in spec 00.
 * Spec 10 §4.4 en §12 stellen voor om bij `kind: "visibility"` `{ expire: 0 }`
 * te gebruiken, zodat een gesloten vacature niet nog één bezoek met JobPosting
 * online staat. Dat wacht op Djulan; aanpassen is alleen VISIBILITY_PROFILE.
 */
const CONTENT_PROFILE = "max";
const VISIBILITY_PROFILE = "max";

export function revalidateVacancies(numbers: number[], kind: "content" | "visibility"): void {
  const profile = kind === "visibility" ? VISIBILITY_PROFILE : CONTENT_PROFILE;
  revalidateTag(VACANCIES_TAG, profile);
  for (const number of new Set(numbers)) revalidateTag(vacancyTag(number), profile);
  revalidatePath("/[locale]/vacatures", "layout");
  revalidatePath("/sitemap.xml");
}
