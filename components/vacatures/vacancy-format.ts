import "server-only";
import { cache } from "react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { formatDate, formatEuro } from "@/lib/format";
import { contact, people, type Phone } from "@/lib/site";
import { SHIFTS, type ShiftId } from "@/lib/data/options";
import type { VacancyDetail } from "@/lib/data/types";
import { displayCity, displayPhone, upcomingStartDate } from "./vacancy-helpers";

export { displayCity, displayPhone, isNewVacancy, lowerFirst, todayInAmsterdam, upcomingStartDate } from "./vacancy-helpers";

/**
 * Opmaak van vacaturewaarden (spec 06 §4.5). Bedragen en datums alleen via
 * lib/format.ts (spec 03), de woorden eromheen uit common.format.* en
 * vacatures.*. Eén set formatters per taal per verzoek.
 */
export type VacancyFormatters = {
  wage(min: number, max: number): string;
  hours(min: number, max: number): string;
  shifts(ids: readonly ShiftId[]): string;
  start(asap: boolean, date: string | null): string;
  city(city: string): string;
  date(iso: string): string;
  phone(e164: string): string;
};

export const getVacancyFormatters = cache(async (locale: Locale): Promise<VacancyFormatters> => {
  const [tf, tv] = await Promise.all([
    getTranslations({ locale, namespace: "common.format" }),
    getTranslations({ locale, namespace: "vacatures" }),
  ]);
  return {
    wage: (min, max) =>
      min === max
        ? tf("wagePerHour", { amount: formatEuro(min, locale) })
        : tf("wageRange", { min: formatEuro(min, locale), max: formatEuro(max, locale) }),
    hours: (min, max) => (min === max ? tf("hoursPerWeek", { hours: min }) : tf("hoursRange", { min, max })),
    shifts: (ids) => {
      const labels = SHIFTS.filter((s) => ids.includes(s.id)).map((s) => tv(`filters.dienst.options.${s.slug}`));
      if (labels.length === 0) return tv("facts.shiftsNone");
      return labels.map((l, i) => (i === 0 ? l : l.toLocaleLowerCase(locale))).join(", ");
    },
    start: (asap, date) => {
      const upcoming = upcomingStartDate(asap, date);
      return upcoming ? tv("card.startFrom", { date: formatDate(upcoming, locale) }) : tv("card.startAsap");
    },
    city: (city) => displayCity(city, locale),
    date: (iso) => formatDate(iso, locale),
    phone: (e164) => displayPhone(e164),
  };
});

export type VacancySeoParts = { city: string; hours: string; wage: string; startDate: string | null; start: string };

/**
 * Plaats, uren, uurloon en startzin zoals metadata, JobPosting en OG ze delen
 * (spec 06 §4.5, spec 12 §10 stap 4), zodat ze overal dezelfde tekst hebben.
 */
export async function getVacancySeoParts(vacancy: VacancyDetail, locale: Locale): Promise<VacancySeoParts> {
  const [f, tm] = await Promise.all([
    getVacancyFormatters(locale),
    getTranslations({ locale, namespace: "vacatures.meta" }),
  ]);
  const upcoming = upcomingStartDate(vacancy.startAsap, vacancy.startDate);
  const startDate = upcoming ? formatDate(upcoming, locale) : null;
  return {
    city: f.city(vacancy.city),
    hours: f.hours(vacancy.hoursMin, vacancy.hoursMax),
    wage: f.wage(vacancy.salaryMin, vacancy.salaryMax),
    startDate,
    start: startDate ? tm("startDateSentence", { date: startDate }) : tm("startAsapSentence"),
  };
}

export type ResolvedVacancyContact = {
  name: string;
  phoneE164: string;
  phoneDisplay: string;
  whatsappE164: string | null;
  photoUrl: string | null;
};

/** Contactpersoon van de vacature; zonder profiel het hoofdnummer van Jimmy (B-21). */
export function resolveVacancyContact(vacancy: VacancyDetail): ResolvedVacancyContact {
  const c = vacancy.contact;
  const phoneE164 = c?.phoneE164 ?? contact.phoneE164;
  return {
    name: c?.name ?? people[0].firstName,
    phoneE164,
    phoneDisplay: displayPhone(phoneE164),
    whatsappE164: c?.whatsappE164 ?? contact.phoneE164,
    photoUrl: c?.photoUrl ?? null,
  };
}

/** Phone-object voor whatsappLink() uit lib/site.ts. */
export function asPhone(e164: string): Phone {
  return { display: displayPhone(e164), e164: e164 as Phone["e164"] };
}
