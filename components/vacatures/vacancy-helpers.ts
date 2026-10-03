import type { Locale } from "@/i18n/routing";
import { NEW_BADGE_DAYS } from "./constants";

/**
 * Pure hulpfuncties van de vacaturebank (spec 06 §4.5), zonder next-imports,
 * zodat ze met een eenheidstest te controleren zijn. vacancy-format.ts
 * exporteert ze opnieuw voor de servercomponenten.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/** Vaste vertaling van een eigennaam (spec 06 §6.3); overige plaatsen blijven gelijk. */
const CITY_EN: Record<string, string> = { "Den Haag": "The Hague" };

export function displayCity(city: string, locale: Locale): string {
  return locale === "en" ? (CITY_EN[city] ?? city) : city;
}

/** +316xxxxxxxx als "06 xx xx xx xx", anders de invoer. */
export function displayPhone(e164: string): string {
  const mobile = /^\+316(\d{2})(\d{2})(\d{2})(\d{2})$/.exec(e164);
  if (mobile) return `06 ${mobile.slice(1).join(" ")}`;
  return e164;
}

/** Jonger dan NEW_BADGE_DAYS dagen. */
export function isNewVacancy(publishedAt: string, now: Date = new Date()): boolean {
  const published = Date.parse(publishedAt);
  if (Number.isNaN(published)) return false;
  const age = now.getTime() - published;
  return age >= 0 && age < NEW_BADGE_DAYS * DAY_MS;
}

/** Vandaag als "YYYY-MM-DD" in Europe/Amsterdam (spec 12 §10 stap 4). */
export function todayInAmsterdam(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Startdatum die nog moet komen, anders null (per direct of datum in het verleden). */
export function upcomingStartDate(startAsap: boolean, startDate: string | null, now: Date = new Date()): string | null {
  if (startAsap || !startDate) return null;
  return startDate > todayInAmsterdam(now) ? startDate : null;
}

/** Eerste letter klein, voor beroepsnamen midden in een zin (spec 03 §6.17). */
export function lowerFirst(value: string, locale: Locale): string {
  return value ? value.charAt(0).toLocaleLowerCase(locale) + value.slice(1) : value;
}
