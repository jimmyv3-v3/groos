import type { LucideIcon } from "lucide-react";
import { Forklift, Grid2x2, HardHat, SprayCan, Truck } from "lucide-react";

/**
 * Lichte lijst van de vijf beroepen (spec 01 §5.2). De enige bron voor id's,
 * beide slugs, iconen en volgorde. Bevat geen tekst: namen staan in messages
 * `beroepen.<id>.enkelvoud` en `.meervoud`, lange tekst in
 * `content/beroepen/<id>.ts` (spec 05). Veilig voor de client.
 */

/** Gelijk aan occupations.slug in de database (spec 10) en aan de sleutels in messages en content. */
export const BEROEP_IDS = [
  "glazenwasser",
  "schoonmaker",
  "logistiek-medewerker",
  "verhuizer",
  "hulpkracht-bouw-en-sloop",
] as const;
export type BeroepId = (typeof BEROEP_IDS)[number];
export type Perspectief = "werkzoekende" | "werkgever";

export type BeroepListItem = {
  id: BeroepId;
  /** Pad /werken-als/<slugWerkzoekende> */
  slugWerkzoekende: string;
  /** Pad /werkgevers/<slugWerkgever> (meervoud) */
  slugWerkgever: string;
  icon: LucideIcon;
  order: number;
};

export const beroepen = [
  { id: "glazenwasser", slugWerkzoekende: "glazenwasser", slugWerkgever: "glazenwassers", icon: Grid2x2, order: 1 },
  { id: "schoonmaker", slugWerkzoekende: "schoonmaker", slugWerkgever: "schoonmakers", icon: SprayCan, order: 2 },
  { id: "logistiek-medewerker", slugWerkzoekende: "logistiek-medewerker", slugWerkgever: "logistiek-medewerkers", icon: Forklift, order: 3 },
  { id: "verhuizer", slugWerkzoekende: "verhuizer", slugWerkgever: "verhuizers", icon: Truck, order: 4 },
  { id: "hulpkracht-bouw-en-sloop", slugWerkzoekende: "hulpkracht-bouw-en-sloop", slugWerkgever: "hulpkrachten-bouw-en-sloop", icon: HardHat, order: 5 },
] as const satisfies readonly BeroepListItem[];

export function isBeroepId(value: string): value is BeroepId {
  return (BEROEP_IDS as readonly string[]).includes(value);
}

export function getBeroep(id: BeroepId): BeroepListItem {
  const item = beroepen.find((b) => b.id === id);
  if (!item) throw new Error(`Onbekend beroep: ${id}`);
  return item;
}

export function findBeroepBySlug(perspectief: Perspectief, slug: string): BeroepListItem | undefined {
  return beroepen.find((b) =>
    perspectief === "werkzoekende" ? b.slugWerkzoekende === slug : b.slugWerkgever === slug,
  );
}
