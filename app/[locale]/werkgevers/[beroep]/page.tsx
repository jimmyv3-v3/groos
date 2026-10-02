import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { beroepen, findBeroepBySlug } from "@/content/beroepen";
import { ROUTES, paths } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { PagePlaceholder } from "@/components/sections/page-placeholder";

// Skelet van bouwstap 3 (spec 01 §4.11.5 en §4.20); spec 05 vult de inhoud en
// laat de routeconfiguratie staan. Statisch: geen live vacatures op deze pagina.
export const dynamicParams = false;
export const revalidate = false;

export function generateStaticParams() {
  return beroepen.map((b) => ({ beroep: b.slugWerkgever }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/werkgevers/[beroep]">): Promise<Metadata> {
  const { locale: raw, beroep } = await params;
  const locale = resolveLocale(raw);
  const item = findBeroepBySlug("werkgever", beroep);
  if (!item) return {};
  const t = await getTranslations({ locale, namespace: "beroepen" });
  const name = t(`${item.id}.meervoud`);
  return pageMetadata({
    locale,
    path: paths.werkgeverBeroep(item.id),
    title: t("og.werkgever", { beroepen: name }),
    description: t("placeholder.description"),
  });
}

export default async function Page({ params }: PageProps<"/[locale]/werkgevers/[beroep]">) {
  const { locale: raw, beroep } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const item = findBeroepBySlug("werkgever", beroep);
  if (!item) notFound();
  const [t, tn] = await Promise.all([
    getTranslations({ locale, namespace: "beroepen" }),
    getTranslations({ locale, namespace: "header.nav" }),
  ]);
  const title = t(`${item.id}.meervoud`);
  return (
    <PagePlaceholder
      title={title}
      breadcrumbs={[
        { label: tn("werkgevers"), href: ROUTES.werkgevers },
        { label: title, href: paths.werkgeverBeroep(item.id) },
      ]}
      spec="05"
    />
  );
}
