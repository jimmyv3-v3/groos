import "server-only";
import { unstable_cache } from "next/cache";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { VACANCIES_TAG } from "./cache-tags";
import { OCCUPATION_SLUGS } from "./options";
import type { OccupationSlug } from "./options";
import type { VacancyOccupation } from "./types";

export type ActiveOccupation = VacancyOccupation & { sortOrder: number };

/**
 * Actieve beroepen op sort_order (spec 10 §4.3 punt 11). Gooit bij een fout,
 * zodat die niet gecachet wordt; de aanroepers vangen hem op.
 */
export const loadActiveOccupations = unstable_cache(
  async (): Promise<ActiveOccupation[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from("occupations")
      .select("slug, name_nl, plural_nl, name_en, plural_en, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw new Error(`occupations: ${error.message}${error.code ? ` (${error.code})` : ""}`);
    return (data ?? [])
      .filter((row): row is typeof row & { slug: OccupationSlug } =>
        (OCCUPATION_SLUGS as readonly string[]).includes(row.slug),
      )
      .map((row) => ({
        slug: row.slug,
        nameNl: row.name_nl,
        pluralNl: row.plural_nl,
        nameEn: row.name_en,
        pluralEn: row.plural_en,
        sortOrder: row.sort_order,
      }));
  },
  ["groos:beroepen:v1"],
  { tags: [VACANCIES_TAG], revalidate: 3600 },
);
