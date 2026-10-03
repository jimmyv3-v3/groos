import "server-only";
import type { Locale } from "@/i18n/routing";
import type { WerkgeversCopy, WerkzoekendenCopy, WttaCopy } from "./types";
import { werkzoekendenPage } from "./werkzoekenden";
import { werkgeversPage } from "./werkgevers";
import { wttaPage } from "./wtta";

/** Loaders van de lange tekst van de vaste pagina's van spec 05 (§5.3). Alleen op de server. */
export function getWerkzoekendenPage(locale: Locale): WerkzoekendenCopy {
  return werkzoekendenPage[locale];
}

export function getWerkgeversPage(locale: Locale): WerkgeversCopy {
  return werkgeversPage[locale];
}

export function getWttaPage(locale: Locale): WttaCopy {
  return wttaPage[locale];
}
