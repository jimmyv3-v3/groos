import "server-only";
import { loadActiveOccupations } from "./occupation-loader";
import { isSchemaMissing } from "./vacancies";
import type { OccupationWithCount } from "./types";
import { countOpenVacanciesByOccupation, supabaseConfiguredOrWarn } from "./vacancies";

/**
 * Actieve beroepen op sort_order met het aantal open vacatures (spec 10 §4.3
 * punt 11). Gooit bij een Supabase-fout (§4.3 punt 10, B-56); alleen zonder
 * Supabase-variabelen geeft hij [] met één waarschuwing.
 */
export async function listOccupations(): Promise<OccupationWithCount[]> {
  if (!supabaseConfiguredOrWarn()) return [];
  const [occupations, counts] = await Promise.all([loadActiveOccupations().catch((error) => {
      if (isSchemaMissing(error)) return [];
      throw error;
    }),
    countOpenVacanciesByOccupation(),]);
  return occupations.map((o) => ({ ...o, openCount: counts.get(o.slug) ?? 0 }));
}
