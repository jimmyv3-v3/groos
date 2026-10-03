import "server-only";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { withConfirmedClaims, type ClaimKey } from "@/lib/claims";

export type HomeFaqItem = { q: string; a: string; claim?: ClaimKey };
export type HomeFaqSets = { jobseeker: HomeFaqItem[]; employer: HomeFaqItem[] };

/** Beide vragensets van de homepage, gefilterd op bevestigde claims (spec 03). */
export async function getHomeFaqSets(locale: Locale): Promise<HomeFaqSets> {
  const t = await getTranslations({ locale, namespace: "home.faq" });
  return {
    jobseeker: withConfirmedClaims(t.raw("jobseeker.items") as HomeFaqItem[]),
    employer: withConfirmedClaims(t.raw("employer.items") as HomeFaqItem[]),
  };
}

/**
 * De tien zichtbare vragen van /, eerst werkzoekenden en dan werkgevers
 * (spec 04 §4.6). Dezelfde lijst voedt HomeFaq en faqLd, zodat zichtbare
 * tekst en FAQPage gelijk blijven.
 */
export async function getHomeFaqItems(locale: Locale): Promise<{ q: string; a: string }[]> {
  const { jobseeker, employer } = await getHomeFaqSets(locale);
  return [...jobseeker, ...employer].map(({ q, a }) => ({ q, a }));
}
