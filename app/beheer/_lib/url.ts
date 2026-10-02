/** Zoekparameters van lijstpagina's (client-veilig). */
export type RawParams = Record<string, string | string[] | undefined>;

/** Bouwt een href met de huidige parameters plus wijzigingen; lege waarden vallen weg. */
export function listHref(path: string, current: RawParams, changes: Record<string, string | number | null | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(current)) {
    const v = Array.isArray(value) ? value[0] : value;
    if (v) params.set(key, v);
  }
  for (const [key, value] of Object.entries(changes)) {
    if (value === null || value === undefined || value === "") params.delete(key);
    else params.set(key, String(value));
  }
  params.delete("melding");
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

/** Paginanummer uit ?pagina, minimaal 1. */
export function pageParam(value: string | string[] | undefined): number {
  const v = Number(Array.isArray(value) ? value[0] : value);
  return Number.isInteger(v) && v >= 1 ? v : 1;
}

/** Waarde alleen als die in de lijst staat. */
export function oneOf<T extends string>(value: string | string[] | undefined, options: readonly T[]): T | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return v && (options as readonly string[]).includes(v) ? (v as T) : undefined;
}
