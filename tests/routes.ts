import { beroepen } from "@/content/beroepen";
import { BEDANKT_SOORTEN, STATIC_ROUTES, paths } from "@/lib/routes";

// Routelijsten voor de e2e-tests, afgeleid uit de registers (spec 14 §4.1).

/** Vaste pagina's die gepubliceerd zijn. */
export const VASTE_ROUTES: string[] = STATIC_ROUTES.filter((r) => r.published).map((r) => r.path);

/** Twee pagina's per beroep: één voor werkzoekenden en één voor werkgevers. */
export const BEROEP_ROUTES: string[] = beroepen.flatMap((b) => [paths.werkenAls(b.id), paths.werkgeverBeroep(b.id)]);

export const BEDANKT_ROUTES: string[] = BEDANKT_SOORTEN.map((s) => paths.bedankt(s));

/** Paden die een 404 moeten geven (AC-01-02). */
export const ONBEKENDE_ROUTES: string[] = [
  "/diensten/dienst-een",
  "/werkgebied",
  "/privacybeleid",
  "/werken-als/onbekend",
  "/werkgevers/onbekend",
  "/bedankt/onbekend",
  "/en/onbekend",
  "/een/twee/drie",
];

/** Met taalprefix: "/" wordt "/en", "/contact" wordt "/en/contact". */
export function engels(pad: string): string {
  return pad === "/" ? "/en" : `/en${pad}`;
}
