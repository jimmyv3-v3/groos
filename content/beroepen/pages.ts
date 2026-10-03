import "server-only";
import type { Locale } from "@/i18n/routing";
import type { BeroepId } from "@/content/beroepen";
import type { BeroepContent, BeroepCopy } from "@/content/beroepen/types";
import { glazenwasser } from "./glazenwasser";
import { schoonmaker } from "./schoonmaker";
import { logistiekMedewerker } from "./logistiek-medewerker";
import { verhuizer } from "./verhuizer";
import { hulpkrachtBouwEnSloop } from "./hulpkracht-bouw-en-sloop";

/** Loader van de lange tekst per beroep (spec 05 §5.3). Alleen op de server. */
export const beroepContent: Record<BeroepId, BeroepContent> = {
  glazenwasser,
  schoonmaker,
  "logistiek-medewerker": logistiekMedewerker,
  verhuizer,
  "hulpkracht-bouw-en-sloop": hulpkrachtBouwEnSloop,
};

export function getBeroepCopy(id: BeroepId, locale: Locale): { content: BeroepContent; copy: BeroepCopy } {
  const content = beroepContent[id];
  return { content, copy: content[locale] };
}
