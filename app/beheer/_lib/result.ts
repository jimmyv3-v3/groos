/** Resultaat van elke beheeractie (spec 08 §4.2). Client-veilig, alleen typen. */
export type BeheerErrorCode =
  | "sessie_verlopen"
  | "mfa_vereist"
  | "geen_toegang"
  | "geen_rechten"
  | "ongeldig"
  | "niet_publiceerbaar"
  | "ongeldige_overgang"
  | "niet_gevonden"
  | "conflict"
  | "bot"
  | "onbekend";

export type ActionResult<T = undefined> =
  | { ok: true; toast: string; data?: T }
  | { ok: false; code: BeheerErrorCode; message: string; fieldErrors?: Record<string, string[]> };
