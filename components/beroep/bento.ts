/**
 * Bento-indeling van de beroepenrasters op de homepage en de
 * doelgroeppagina's: twee brede kaarten boven en daaronder rijen van drie.
 * Blijven er onderaan twee kaarten over, dan zijn die ook breed; blijft er één
 * over, dan loopt die over de volle breedte. Zo sluit het raster bij elk
 * aantal beroepen zonder gat.
 */
export type BentoSlot = "wide" | "narrow" | "full";

export function bentoSlot(index: number, count: number): BentoSlot {
  if (index < 2) return "wide";
  const rest = (count - 2) % 3;
  if (rest === 2 && index >= count - 2) return "wide";
  if (rest === 1 && index === count - 1) return "full";
  return "narrow";
}
