import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { ROUTES } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { PagePlaceholder } from "@/components/sections/page-placeholder";

// Skelet van bouwstap 3 (spec 01 §4.20); spec 05 vult de inhoud en laat de
// routeconfiguratie, setRequestLocale en generateMetadata staan.

export async function generateMetadata({ params }: PageProps<"/[locale]/werkgevers">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const t = await getTranslations({ locale, namespace: "werkgevers.meta" });
  return pageMetadata({ locale, path: ROUTES.werkgevers, title: t("title"), description: t("description") });
}

export default async function Page({ params }: PageProps<"/[locale]/werkgevers">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const tn = await getTranslations({ locale, namespace: "header.nav" });

  return (
    <PagePlaceholder
      title={tn("werkgevers")}
      breadcrumbs={[{ label: tn("werkgevers"), href: ROUTES.werkgevers }]}
      spec="05"
    />
  );
}
