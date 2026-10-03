// TODO (opdrachtgever): tekst van de voorwaarden aanleveren (B-11); daarna LEGAL_DOCS terms op published true.
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/seo";
import { getLegalDoc } from "@/lib/legal";
import { LegalPage, pickLegal, type LegalContent } from "@/components/legal/legal-page";

// Sjabloon (spec 09 §6.7). Zolang `published` in lib/legal.ts onwaar is, is deze
// pagina noindex, staat hij niet in de sitemap en linkt niets ernaar. Komt er een
// pdf, zet die dan in public/documenten/ en geef LegalPage de prop `download`
// met het label legal.download.

const CONTENT: { nl: LegalContent; en: LegalContent } = {
  nl: {
    title: "Algemene voorwaarden",
    metaDescription: "TODO beschrijving zodra de voorwaarden er zijn",
    intro: "TODO Inleiding door Groos of de jurist.",
    sections: [],
  },
  en: {
    title: "Terms and conditions",
    metaDescription: "TODO description once the terms are available",
    intro:
      "TODO Introduction by Groos or the lawyer. This is a translation of the Dutch text. If the two versions differ, the Dutch version applies.",
    sections: [],
  },
};

export async function generateMetadata({ params }: PageProps<"/[locale]/algemene-voorwaarden">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const c = pickLegal(CONTENT, locale);
  return pageMetadata({
    locale,
    path: getLegalDoc("terms").path,
    title: c.title,
    description: c.metaDescription,
    // Niet indexeren zolang de tekst er niet is (B-11).
    noindex: !getLegalDoc("terms").published,
  });
}

export default async function Page({ params }: PageProps<"/[locale]/algemene-voorwaarden">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const articlePrefix = locale === "en" ? "Article " : "Artikel ";
  return <LegalPage doc="terms" content={pickLegal(CONTENT, locale)} articlePrefix={articlePrefix} />;
}
