import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { ROUTES } from "@/lib/routes";
import { employmentAgencyLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { PagePlaceholder } from "@/components/sections/page-placeholder";

// Skelet van bouwstap 3 (spec 01 §4.20); spec 07 vult de inhoud en laat de
// routeconfiguratie, setRequestLocale en generateMetadata staan.

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return pageMetadata({ locale, path: ROUTES.contact, title: t("title"), description: t("description") });
}

export default async function Page({ params }: PageProps<"/[locale]/contact">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const tn = await getTranslations({ locale, namespace: "header.nav" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });

  return (
    <>
      <JsonLd data={employmentAgencyLd({ locale, description: tMeta("organizationDescription") })} />
      <PagePlaceholder
      title={tn("contact")}
      breadcrumbs={[{ label: tn("contact"), href: ROUTES.contact }]}
      spec="07"
      />
    </>
  );
}
