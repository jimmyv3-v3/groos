/**
 * Opschonen van tekst die terug kan naar een extern adres (spec 11 §4.7).
 * Client-veilig, zonder imports.
 */

const ALLOWED = /^[\p{L}\p{M}0-9 '’&().,-]+$/u;
const LINK_LIKE = /(https?:|www\.|@|\.[a-z]{2,}(\b|\/))/i;

/** Waarde die veilig terug mag naar een extern adres, anders null. */
export function safeEcho(value: string | null | undefined, maxLength = 60): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (trimmed.length > maxLength) return null;
  if (!ALLOWED.test(trimmed)) return null;
  if (LINK_LIKE.test(trimmed)) return null;
  return trimmed;
}

/** Eén regel, witruimte samengevoegd, hoogstens 150 tekens. */
export function cleanSubject(subject: string): string {
  const oneLine = subject.replace(/\s+/g, " ").trim();
  return oneLine.length > 150 ? `${oneLine.slice(0, 149).trimEnd()}…` : oneLine;
}
