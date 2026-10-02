import { getTranslations } from "next-intl/server";
import { NotFoundView } from "@/components/sections/not-found-view";

/**
 * Gelokaliseerde 404 binnen de layout (spec 01 §4.13) voor notFound() in
 * pagina's. Next zet status 404 en noindex. Let op: Next 16.3 rendert deze
 * grens pas in de browser (de HTML is de lege foutschil); onbekende paden lopen
 * daarom via proxy.ts naar het vangnet [...rest], dat de 404 wel op de server rendert.
 */
export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <>
      <title>{t("metaTitle")}</title>
      <NotFoundView />
    </>
  );
}
