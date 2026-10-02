import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { contact } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";

// TODO (juridisch): algemene voorwaarden verschillen per bedrijf en branche en
// zijn niet overgenomen uit J. Versseput. Vraag Jimmy om de bestaande voorwaarden
// (eigen versie of branchevoorwaarden) of laat ze opstellen, en zet de tekst
// hieronder in dezelfde structuur. Gebruikt het bedrijf branchevoorwaarden als
// PDF, dan kan deze pagina ook een korte toelichting met downloadlink worden.

type LegalContent = {
  title: string;
  metaDescription: string;
  intro: string;
  updatedAt: string;
  sections: LegalSection[];
};

const NL_HEADINGS = [
  "Definities",
  "Toepasselijkheid",
  "Offertes en aanbiedingen",
  "Totstandkoming van de overeenkomst",
  "Uitvoering van de werkzaamheden",
  "Verplichtingen van de opdrachtgever",
  "Wijzigingen en meerwerk",
  "Prijzen en betaling",
  "Duur, verlenging en opzegging",
  "Klachten",
  "Aansprakelijkheid",
  "Overmacht",
  "Toepasselijk recht en geschillen",
];

const EN_HEADINGS = [
  "Definitions",
  "Applicability",
  "Quotes and offers",
  "Formation of the agreement",
  "Performance of the work",
  "Obligations of the client",
  "Changes and additional work",
  "Prices and payment",
  "Term, renewal and termination",
  "Complaints",
  "Liability",
  "Force majeure",
  "Applicable law and disputes",
];

const CONTENT: { nl: LegalContent; en: LegalContent } = {
  nl: {
    title: "Algemene voorwaarden",
    metaDescription: `De algemene voorwaarden van ${contact.name} voor offertes, opdrachten en de uitvoering van onze diensten.`,
    intro: `Deze algemene voorwaarden zijn van toepassing op alle offertes en overeenkomsten van ${contact.name}, ingeschreven bij de Kamer van Koophandel onder nummer ${contact.kvk}.`,
    updatedAt: "TODO datum van publicatie",
    sections: NL_HEADINGS.map((heading) => ({
      heading,
      blocks: ["TODO Tekst van dit artikel, aangeleverd door de opdrachtgever of een jurist."],
    })),
  },
  en: {
    title: "Terms and conditions",
    metaDescription: `The terms and conditions of ${contact.name} for quotes, assignments and the performance of our services.`,
    intro: `These terms and conditions apply to all quotes and agreements of ${contact.name}, registered with the Dutch Chamber of Commerce under number ${contact.kvk}. In case of any discrepancy, the Dutch version prevails.`,
    updatedAt: "TODO publication date",
    sections: EN_HEADINGS.map((heading) => ({
      heading,
      blocks: ["TODO Text of this article, translated from the Dutch version."],
    })),
  },
};

function pick(locale: string): LegalContent {
  return CONTENT[(locale as "nl" | "en") in CONTENT ? (locale as "nl" | "en") : "nl"];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = pick(locale);
  return pageMetadata({
    locale,
    path: "/algemene-voorwaarden",
    title: c.title,
    description: c.metaDescription,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = pick(locale);
  return (
    <LegalPage
      title={c.title}
      intro={c.intro}
      updatedAt={c.updatedAt}
      sections={c.sections}
      articlePrefix={locale === "en" ? "Article " : "Artikel "}
    />
  );
}
