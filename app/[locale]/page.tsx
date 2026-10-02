import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/sections/site-header";
import { Hero } from "@/components/sections/hero";
import { Clients } from "@/components/sections/clients";
import { SegmentAccordion } from "@/components/sections/segment-accordion";
import { Metrics } from "@/components/sections/metrics";
import { TrustBar } from "@/components/sections/trust-bar";
import { ServiceTicker } from "@/components/sections/service-ticker";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Projects } from "@/components/sections/projects";
import { Proof } from "@/components/sections/proof";
import { Assurance } from "@/components/sections/assurance";
import { About } from "@/components/sections/about";
import Faq from "@/components/sections/faq";
import { OfferteForm } from "@/components/sections/offerte-form";
import { SiteFooter } from "@/components/sections/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { faqLd, localBusinessLd, localizedPath, pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: "/",
    title: t("titleDefault"),
    description: t("description"),
    keywords: t.raw("keywords") as string[],
    absoluteTitle: true,
  });
}

// De volgorde van de secties is de blauwdruk van J. Versseput. Zie
// docs/MIGRATIE.md voor de rol van elke sectie en welke optioneel zijn.
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tMeta = await getTranslations("meta");
  const faqItems = t.raw("faq.items") as { q: string; a: string }[];

  return (
    <>
      <JsonLd
        data={localBusinessLd({
          description: tMeta("description"),
          path: localizedPath(locale, "/"),
        })}
      />
      <JsonLd data={faqLd(faqItems)} />
      <SiteHeader />
      <main>
        <Hero />
        <Clients />
        {/* Doelgroepen onder de logo's op mobiel; op desktop staan ze in de hero */}
        <section aria-label={t("segments.ariaLabel")} className="lg:hidden">
          <div className="container pb-2">
            <SegmentAccordion />
          </div>
        </section>
        <Metrics />
        <TrustBar />
        <ServiceTicker />
        <Services />
        <Process />
        <Projects />
        <Proof />
        <Assurance />
        <About />
        <Faq />
        <OfferteForm />
      </main>
      <SiteFooter />
    </>
  );
}
