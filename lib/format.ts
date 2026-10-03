import type { Locale } from "@/i18n/routing";

/**
 * Notatiehelpers voor bedragen, tijden, datums en getallen (spec 03 §5.2).
 * Messages bevatten alleen de woorden eromheen (common.format.*). Alleen
 * type-imports, zodat het bestand ook met `node` te testen is.
 */

const TAG: Record<Locale, string> = { nl: "nl-NL", en: "en-GB" };
const TIME_ZONE = "Europe/Amsterdam";

/** nl: "€ 16,08" (vaste spatie), "€ 50.000"; en: "€16.08", "€50,000". */
export function formatEuro(amount: number, locale: Locale): string {
  const whole = amount >= 1000 && Number.isInteger(amount);
  const formatted = new Intl.NumberFormat(TAG[locale], {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(amount);
  return locale === "nl" ? formatted.replace(/^€\s?/, "€ ") : formatted.replace(/^€\s/, "€");
}

/** "07:00" of "07:00:00" wordt nl "07.00", en "07:00". */
export function formatTime(value: string, locale: Locale): string {
  const [h = "00", m = "00"] = value.split(":");
  const hh = h.padStart(2, "0");
  return locale === "nl" ? `${hh}.${m}` : `${hh}:${m}`;
}

/** nl "2 oktober 2026", en "2 October 2026"; met weekday: "vrijdag 2 oktober 2026". */
export function formatDate(value: Date | string, locale: Locale, opts: { weekday?: boolean } = {}): string {
  const date = typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00Z`) : new Date(value);
  return new Intl.DateTimeFormat(TAG[locale], {
    ...(opts.weekday && { weekday: "long" }),
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(date);
}

/** nl "1.250", en "1,250". */
export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(TAG[locale]).format(value);
}
