/**
 * Vervangt {sleutel} door de waarde (alleen tekst en getallen). Een onbekende
 * sleutel blijft staan, zodat de templatetest hem vindt (spec 11 §4.13).
 */
export function fill(template: string, values: object): string {
  const record = values as Record<string, unknown>;
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = record[key];
    return typeof value === "string" || typeof value === "number" ? String(value) : match;
  });
}
