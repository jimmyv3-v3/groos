/**
 * Keuze van de revalidatie bij vacaturemutaties (spec 08 §5.3 tabel 2, B-35).
 * De keuze volgt de publieke staat vóór de actie en de slug die save_vacancy
 * teruggeeft, niet alleen de status. null betekent: geen revalidatie.
 */
export type RevalidationKind = "visibility" | "content" | null;

type PublicState = "open" | "closed" | null;

const time = (iso: string | null) => (iso ? Date.parse(iso) : null);

/** saveVacancy: publiceren vanuit concept, een andere slug of een gewijzigde sluitdatum bij een publiek gesloten vacature. */
export function saveRevalidationKind(input: {
  publishedFromDraft: boolean;
  publicStateBefore: PublicState;
  slugBefore: string | null;
  slugAfter: string;
  closesAtBefore: string | null;
  closesAtAfter: string | null;
}): RevalidationKind {
  if (input.publishedFromDraft) return "visibility";
  if (!input.publicStateBefore) return null;
  if (input.slugBefore !== null && input.slugAfter !== input.slugBefore) return "visibility";
  if (input.publicStateBefore === "closed" && time(input.closesAtBefore) !== time(input.closesAtAfter)) {
    return "visibility";
  }
  return "content";
}

/** scheduleVacancy: eerste inplanning geen; een gewijzigde inplanning alleen als de vacature publiek al open was. */
export function scheduleRevalidationKind(statusBefore: string, publicStateBefore: PublicState): RevalidationKind {
  return statusBefore === "scheduled" && publicStateBefore === "open" ? "visibility" : null;
}

/** unscheduleVacancy: alleen als de geplande vacature publiek al open was. */
export function unscheduleRevalidationKind(publicStateBefore: PublicState): RevalidationKind {
  return publicStateBefore === "open" ? "visibility" : null;
}

/** extendVacancy: visibility als de vacature publiek al gesloten was, anders content. */
export function extendRevalidationKind(publicStateBefore: PublicState): RevalidationKind {
  return publicStateBefore === "closed" ? "visibility" : "content";
}
