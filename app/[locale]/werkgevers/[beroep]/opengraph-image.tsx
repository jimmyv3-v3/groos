import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { findBeroepBySlug } from "@/content/beroepen";
import { contact } from "@/lib/site";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";
import nlMeta from "@/messages/nl/meta.json";
import SiteOgImage from "@/app/opengraph-image";

/**
 * OG-afbeelding per beroep, perspectief werkgever (spec 12 §4.6): label
 * header.nav.werkgevers, kop beroepen.og.werkgever en subregel meta.ogSubline.
 * Statisch; de params komen uit generateStaticParams van de pagina.
 */
export const alt = `${contact.shortName}: ${nlMeta.ogSubline}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function BeroepOgImage({ params }: { params: Promise<{ locale: string; beroep: string }> }) {
  const { locale: raw, beroep } = await params;
  const locale: Locale = hasLocale(routing.locales, raw) ? raw : routing.defaultLocale;
  const item = findBeroepBySlug("werkgever", beroep);
  if (!item) return SiteOgImage();

  const [t, tNav, tMeta] = await Promise.all([
    getTranslations({ locale, namespace: "beroepen" }),
    getTranslations({ locale, namespace: "header.nav" }),
    getTranslations({ locale, namespace: "meta" }),
  ]);
  const occupation = t(`${item.id}.enkelvoud`).toLocaleLowerCase(locale);
  const occupationPlural = t(`${item.id}.meervoud`);
  return renderOgCard({
    label: tNav("werkgevers"),
    title: t("og.werkgever", { occupation, occupationPlural }),
    lines: [tMeta("ogSubline")],
  });
}
