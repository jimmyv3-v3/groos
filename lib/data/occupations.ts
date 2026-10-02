import "server-only";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { loadActiveOccupations } from "./occupation-loader";
import type { OccupationWithCount } from "./types";
import { countOpenVacanciesByOccupation } from "./vacancies";

/**
 * Actieve beroepen op sort_order met het aantal open vacatures (spec 10 §4.3).
 * Faalt zacht: [] met een logregel zolang de database niet bereikbaar is of de
 * migraties nog niet zijn toegepast.
 */
export async function listOccupations(): Promise<OccupationWithCount[]> {
  if (!hasSupabaseEnv()) {
    console.warn("[lib/data/occupations] Supabase is niet geconfigureerd; geen beroepen.");
    return [];
  }
  try {
    const [occupations, counts] = await Promise.all([loadActiveOccupations(), countOpenVacanciesByOccupation()]);
    return occupations.map((o) => ({ ...o, openCount: counts.get(o.slug) ?? 0 }));
  } catch (error) {
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    console.error(`[lib/data/occupations] beroepen laden mislukt, leeg resultaat: ${message}`);
    return [];
  }
}
