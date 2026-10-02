import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { ROUTES } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { PagePlaceholder } from "@/components/sections/page-placeholder";

// Skelet van bouwstap 3 (spec 01 §4.20); spec 06 vult de inhoud en laat de
// routeconfiguratie, setRequestLocale en generateMetadata staan.

export async function generateMetadata({ params }: PageProps<"/[locale]/vacatures">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const t = await getTranslations({ locale, namespace: "vacatures.meta" });
  return pageMetadata({ locale, path: ROUTES.vacatures, title: t("title"), description: t("description") });
}

export default async function Page({ params }: PageProps<"/[locale]/vacatures">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const tn = await getTranslations({ locale, namespace: "header.nav" });

  return (
    <PagePlaceholder
      title={tn("vacatures")}
      breadcrumbs={[{ label: tn("vacatures"), href: ROUTES.vacatures }]}
      spec="06"
    />
  );
}
