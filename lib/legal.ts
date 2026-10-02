// STUB: wordt vervangen door spec 09
/**
 * Minimale stub van het register van juridische documenten (spec 09 §5.1),
 * gemaakt door de bouw-agent van spec 07 omdat de formulieren
 * PRIVACY_NOTICE_VERSION nodig hebben. De versie van spec 09 wint bij de merge.
 * Client-veilig, importeert lib/routes.ts niet.
 */

export type LegalDocId = "privacy" | "cookies" | "complaints" | "terms";

export type LegalDoc = {
  id: LegalDocId;
  path: "/privacyverklaring" | "/cookieverklaring" | "/klachtenregeling" | "/algemene-voorwaarden";
  version: string;
  updatedAt?: string;
  published: boolean;
  draft: boolean;
};

// TODO (jurist): versies 0.1 zijn concepten; na akkoord version "1.0", draft false, nieuwe updatedAt.
export const LEGAL_DOCS: readonly LegalDoc[] = [
  { id: "privacy", path: "/privacyverklaring", version: "0.1", updatedAt: "2026-10-02", published: true, draft: true },
  { id: "cookies", path: "/cookieverklaring", version: "0.1", updatedAt: "2026-10-02", published: true, draft: true },
  { id: "complaints", path: "/klachtenregeling", version: "0.1", updatedAt: "2026-10-02", published: true, draft: true },
  { id: "terms", path: "/algemene-voorwaarden", version: "0.0", published: false, draft: true },
] as const;

export function getLegalDoc(id: LegalDocId): LegalDoc {
  const doc = LEGAL_DOCS.find((d) => d.id === id);
  if (!doc) throw new Error(`Onbekend juridisch document: ${id}`);
  return doc;
}

export function publishedLegalDocs(): LegalDoc[] {
  return LEGAL_DOCS.filter((d) => d.published);
}

/** Opslaan bij elke sollicitatie en inschrijving (spec 07, kolom privacy_notice_version). */
export const PRIVACY_NOTICE_VERSION: string = getLegalDoc("privacy").version;

export type WttaConfig =
  | { phase: "none" }
  | { phase: "preparing" }
  | { phase: "transition"; since: string }
  | { phase: "provisional"; registerUrl: string; validUntil?: string }
  | { phase: "admitted"; registerNumber: string; registerUrl: string };

// TODO (Jimmy en Lorenzo): fase bevestigen (B-24).
export const WTTA: WttaConfig = { phase: "preparing" };
