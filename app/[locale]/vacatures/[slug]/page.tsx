import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { ROUTES } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

// Skelet van bouwstap 3 (spec 01 §4.20): elke slug geeft een 404 tot spec 06
// de vacaturepagina bouwt (generateStaticParams uit listOpenVacancyParams,
// vacancyMetadata van spec 12, sollicitatieformulier van spec 07).
export const dynamicParams = true;
export const revalidate = 3600;

export function generateStaticParams(): { slug: string }[] {
  return [];
}

export async function generateMetadata({ params }: PageProps<"/[locale]/vacatures/[slug]">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const t = await getTranslations({ locale, namespace: "vacatures.meta" });
  return pageMetadata({ locale, path: ROUTES.vacatures, title: t("title"), description: t("description"), noindex: true });
}

export default async function Page({ params }: PageProps<"/[locale]/vacatures/[slug]">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  notFound();
}
