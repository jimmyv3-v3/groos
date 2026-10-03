import { getTranslations } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { beroepen, findBeroepBySlug } from "@/content/beroepen";
import { contact } from "@/lib/site";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";
import nlMeta from "@/messages/nl/meta.json";
import { lowerFirst } from "@/components/vacatures/vacancy-helpers";
import SiteOgImage from "@/app/opengraph-image";

/**
 * OG-afbeelding per beroep, perspectief werkzoekende (spec 12 §4.6): label
 * header.nav.werkzoekenden, kop beroepen.og.werkzoekende en subregel meta.ogSubline.
 * Statisch; de params komen uit generateStaticParams van de pagina.
 */
export const alt = `${contact.shortName}: ${nlMeta.ogSubline}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Statisch per beroep, net als de pagina (spec 12 §4.6). */
export function generateStaticParams() {
  return beroepen.map((b) => ({ beroep: b.slugWerkzoekende }));
}

export default async function BeroepOgImage({ params }: { params: Promise<{ locale: string; beroep: string }> }) {
  const { locale: raw, beroep } = await params;
  const locale = resolveLocale(raw);
  const item = findBeroepBySlug("werkzoekende", beroep);
  if (!item) return SiteOgImage();

  const [t, tNav, tMeta] = await Promise.all([
    getTranslations({ locale, namespace: "beroepen" }),
    getTranslations({ locale, namespace: "header.nav" }),
    getTranslations({ locale, namespace: "meta" }),
  ]);
  const occupation = lowerFirst(t(`${item.id}.enkelvoud`), locale);
  const occupationPlural = t(`${item.id}.meervoud`);
  return renderOgCard({
    label: tNav("werkzoekenden"),
    title: t("og.werkzoekende", { occupation, occupationPlural }),
    lines: [tMeta("ogSubline")],
  });
}
