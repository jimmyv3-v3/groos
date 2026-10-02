import type { LucideIcon } from "lucide-react";
import { CalendarClock, ShieldCheck, Sparkles, Wrench } from "lucide-react";

/**
 * Lichte dienstenlijst: slug + icoon, in menuvolgorde. Veilig om te importeren
 * in client components (header, dienstenraster), want er zit geen paginatekst
 * in.
 *
 * Een dienst toevoegen:
 * 1. slug + icoon hieronder,
 * 2. kaarttitel en samenvatting in messages/<locale>.json onder `services.<slug>`,
 * 3. paginacontent in content/services/<slug>.ts (vorm: ./dienst-een.ts),
 * 4. registreren in ./pages.ts.
 * Sitemap, llms.txt, header, footer en stadspagina's volgen automatisch.
 */
export type ServiceListItem = { slug: string; icon: LucideIcon };

export const services: ServiceListItem[] = [
  { slug: "dienst-een", icon: Sparkles }, // TODO: echte slugs (kort, Nederlands, met koppeltekens)
  { slug: "dienst-twee", icon: Wrench },
  { slug: "dienst-drie", icon: ShieldCheck },
  { slug: "dienst-vier", icon: CalendarClock },
];
