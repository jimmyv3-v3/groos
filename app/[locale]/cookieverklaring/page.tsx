import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { ROUTES } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { PagePlaceholder } from "@/components/sections/page-placeholder";

// Skelet van bouwstap 3 (spec 01 §4.20); spec 09 zet hier CONTENT = { nl, en }
// en LegalPage neer (bouwstap 8).
export async function generateMetadata({ params }: PageProps<"/[locale]/cookieverklaring">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const t = await getTranslations({ locale, namespace: "legal" });
  return pageMetadata({ locale, path: ROUTES.cookieverklaring, title: t("nav.cookies"), description: t("placeholder.description") });
}

export default async function Page({ params }: PageProps<"/[locale]/cookieverklaring">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal" });
  const title = t("nav.cookies");
  return <PagePlaceholder title={title} breadcrumbs={[{ label: title, href: ROUTES.cookieverklaring }]} spec="09" />;
}
