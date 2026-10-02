import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { NOT_FOUND_HEADER } from "@/lib/routes";
import { NotFoundView } from "@/components/sections/not-found-view";

/**
 * Vangnet voor onbekende paden onder een geldige taal (spec 01 §4.13).
 *
 * notFound() geeft in Next 16.3 wel status 404, maar de HTML bevat dan alleen
 * de lege foutschil; de 404-inhoud verschijnt pas na JavaScript. Daarom zet
 * proxy.ts voor onbekende paden zelf status 404 (rewrite met status) en een
 * kopregel; deze pagina rendert dan de 404 gewoon op de server. Komt een
 * verzoek hier zonder die kopregel (paden die de proxy overslaat, zoals
 * /en/bestand.xyz), dan valt de pagina terug op notFound(), zodat de status
 * altijd 404 is.
 */
export async function generateMetadata({ params }: PageProps<"/[locale]/[...rest]">): Promise<Metadata> {
  const { locale: raw } = await params;
  const t = await getTranslations({ locale: resolveLocale(raw), namespace: "notFound" });
  // Geen robots hier: bij status 404 zet Next zelf <meta name="robots" content="noindex">.
  return { title: { absolute: t("metaTitle") } };
}

export default async function CatchAll({ params }: PageProps<"/[locale]/[...rest]">) {
  const { locale: raw } = await params;
  setRequestLocale(resolveLocale(raw));
  if ((await headers()).get(NOT_FOUND_HEADER) !== "1") notFound();
  return <NotFoundView />;
}
