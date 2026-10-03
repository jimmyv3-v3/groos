import { getTranslations } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { contact } from "@/lib/site";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";
import { getVacancyByNumber } from "@/lib/data/vacancies";
import { parseVacancySlug } from "@/lib/data/vacancy-search-params";
import { getVacancySeoParts } from "@/components/vacatures/vacancy-format";
import nlVacatures from "@/messages/nl/vacatures.json";
import SiteOgImage from "@/app/opengraph-image";

/**
 * OG-afbeelding per vacature (spec 12 §4.6, inhoud spec 06 §7.6): label,
 * titel, plaats, uren en uurloon; gesloten: "Deze vacature is gesloten".
 * Onbekend nummer of geen database: de site-brede kaart.
 */
export const revalidate = 3600;
export const alt = `${nlVacatures.og.label}, ${contact.shortName}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function VacancyOgImage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  const number = parseVacancySlug(slug);
  const vacancy = number ? await getVacancyByNumber(number) : null;
  if (!vacancy) return SiteOgImage();

  const [t, { city, hours, wage }] = await Promise.all([
    getTranslations({ locale, namespace: "vacatures.og" }),
    getVacancySeoParts(vacancy, locale),
  ]);
  const closed = vacancy.state === "closed";
  return renderOgCard({
    label: t("label"),
    title: vacancy.title,
    lines: closed ? [city] : [city, hours],
    highlight: closed ? t("closed") : wage,
  });
}
