import {
  buildVacancySearchParams,
  parseVacancySearchParams,
  type VacancySearchState,
} from "@/lib/data/vacancy-search-params";
import type { HiddenField } from "./types";

/**
 * Hulp voor de GET-formulieren van /vacatures (spec 06 §4.4). Client-veilig.
 * Alles gaat door de parser en de opbouw van spec 10, zodat de URL met en
 * zonder JavaScript dezelfde vorm heeft. `pagina` valt altijd weg.
 */
export function normalizeEntries(entries: Iterable<[string, FormDataEntryValue]>): URLSearchParams {
  const raw: Record<string, string[]> = {};
  for (const [key, value] of entries) {
    if (typeof value !== "string" || key === "pagina") continue;
    (raw[key] ??= []).push(value);
  }
  const state = parseVacancySearchParams(raw);
  return buildVacancySearchParams({ filters: state.filters, sort: state.sort });
}

/** Verborgen velden: de huidige staat zonder pagina en zonder de velden die het formulier zelf heeft. */
export function hiddenFieldsFor(state: VacancySearchState, own: readonly string[]): HiddenField[] {
  const params = buildVacancySearchParams({ filters: state.filters, sort: state.sort });
  return [...params.entries()].filter(([name]) => !own.includes(name));
}

/** Pad voor Link uit @/i18n/navigation (zonder taalprefix). */
export function vacaturesHref(params: URLSearchParams): string {
  const qs = params.toString();
  return qs ? `/vacatures?${qs}` : "/vacatures";
}
