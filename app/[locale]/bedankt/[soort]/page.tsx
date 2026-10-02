import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { BEDANKT_SOORTEN, isBedanktSoort, paths, type BedanktSoort } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { PagePlaceholder } from "@/components/sections/page-placeholder";

// Skelet van bouwstap 3 (spec 01 §4.20); spec 07 vult de inhoud. Bedankpagina's
// zijn noindex, follow en hebben geen kruimelpad.
export const dynamicParams = false;
export const revalidate = false;

/** Route-soort naar sleutel in messages bedankt.<key> (spec 07). */
const KEYS = {
  sollicitatie: "application",
  inschrijving: "registration",
  aanvraag: "staffRequest",
  contact: "contact",
} as const satisfies Record<BedanktSoort, string>;

export function generateStaticParams() {
  return BEDANKT_SOORTEN.map((soort) => ({ soort }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/bedankt/[soort]">): Promise<Metadata> {
  const { locale: raw, soort } = await params;
  const locale = resolveLocale(raw);
  if (!isBedanktSoort(soort)) return {};
  const t = await getTranslations({ locale, namespace: "bedankt" });
  const title = t(`${KEYS[soort]}.metaTitle`);
  return pageMetadata({ locale, path: paths.bedankt(soort), title, description: title, noindex: true });
}

export default async function Page({ params }: PageProps<"/[locale]/bedankt/[soort]">) {
  const { locale: raw, soort } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  if (!isBedanktSoort(soort)) notFound();
  const t = await getTranslations({ locale, namespace: "bedankt" });
  return <PagePlaceholder title={t(`${KEYS[soort]}.title`)} spec="07" />;
}
