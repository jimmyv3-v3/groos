import type { LucideIcon } from "lucide-react";
import { BrickWall, Forklift, Grid2x2, Hammer, HardHat, Recycle, Shovel, SprayCan, Tractor, Truck } from "lucide-react";

/**
 * Lichte lijst van de tien beroepen (spec 01 §5.2). De enige bron voor id's,
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
  "grondwerker",
  "sloper",
  "bouwopruimer",
  "machinist",
  "stratenmaker",
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
  { id: "grondwerker", slugWerkzoekende: "grondwerker", slugWerkgever: "grondwerkers", icon: Shovel, order: 6 },
  { id: "sloper", slugWerkzoekende: "sloper", slugWerkgever: "slopers", icon: Hammer, order: 7 },
  { id: "bouwopruimer", slugWerkzoekende: "bouwopruimer", slugWerkgever: "bouwopruimers", icon: Recycle, order: 8 },
  { id: "machinist", slugWerkzoekende: "machinist", slugWerkgever: "machinisten", icon: Tractor, order: 9 },
  { id: "stratenmaker", slugWerkzoekende: "stratenmaker", slugWerkgever: "stratenmakers", icon: BrickWall, order: 10 },
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
