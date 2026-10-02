/**
 * Register van de juridische documenten en de Wtta-configuratie (spec 09 §5.1).
 * Enige bron voor versie, datum, publicatiestatus en conceptstatus (B-40).
 * Footer, sitemap, llms.txt, formulieren en `noindex` lezen hieruit.
 * Client-veilig: geen server-only en geen import van lib/routes.ts.
 */

export type LegalDocId = "privacy" | "cookies" | "complaints" | "terms";

export type LegalDoc = {
  id: LegalDocId;
  path: "/privacyverklaring" | "/cookieverklaring" | "/klachtenregeling" | "/algemene-voorwaarden";
  /** "0.x" zolang concept, "1.0" na akkoord jurist; elke inhoudelijke wijziging verhoogt de versie. */
  version: string;
  /** ISO-datum JJJJ-MM-DD van de huidige versie; leeg zolang er geen tekst is. */
  updatedAt?: string;
  /** Opnemen in footer, sitemap en llms.txt en indexeerbaar maken. */
  published: boolean;
  /** Toont de conceptmelding op de pagina. */
  draft: boolean;
};

// TODO (jurist): versies 0.1 zijn concepten; na akkoord version "1.0", draft false, nieuwe updatedAt.
export const LEGAL_DOCS: readonly LegalDoc[] = [
  { id: "privacy", path: "/privacyverklaring", version: "0.1", updatedAt: "2026-10-02", published: true, draft: true },
  { id: "cookies", path: "/cookieverklaring", version: "0.1", updatedAt: "2026-10-02", published: true, draft: true },
  { id: "complaints", path: "/klachtenregeling", version: "0.1", updatedAt: "2026-10-02", published: true, draft: true },
  // TODO (Jimmy): published op true zodra de tekst van de voorwaarden er is (B-11).
  { id: "terms", path: "/algemene-voorwaarden", version: "0.0", published: false, draft: true },
] as const;

const ORDER: readonly LegalDocId[] = ["privacy", "cookies", "complaints", "terms"];

export function getLegalDoc(id: LegalDocId): LegalDoc {
  const doc = LEGAL_DOCS.find((d) => d.id === id);
  if (!doc) throw new Error(`Onbekend juridisch document: ${id}`);
  return doc;
}

/** Gepubliceerde documenten in de volgorde privacy, cookies, complaints, terms. */
export function publishedLegalDocs(): LegalDoc[] {
  return ORDER.map(getLegalDoc).filter((d) => d.published);
}

/** Opslaan bij elke sollicitatie en inschrijving (spec 07, kolom privacy_notice_version). */
export const PRIVACY_NOTICE_VERSION: string = getLegalDoc("privacy").version;

export type WttaConfig =
  | { phase: "none" }
  | { phase: "preparing" }
  | { phase: "transition"; since: string } // ISO-datum aanmelding
  | { phase: "provisional"; registerUrl: string; validUntil?: string }
  | { phase: "admitted"; registerNumber: string; registerUrl: string };

// TODO (Jimmy en Lorenzo): fase bevestigen (B-24). "preparing" alleen als jullie de toelating echt voorbereiden.
export const WTTA: WttaConfig = { phase: "preparing" };
