import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { Hero } from "@/components/sections/hero";
import { Clients } from "@/components/sections/clients";
import { SegmentAccordion } from "@/components/sections/segment-accordion";
import { Metrics } from "@/components/sections/metrics";
import { TrustBar } from "@/components/sections/trust-bar";
import { ServiceTicker } from "@/components/sections/service-ticker";
import { Process } from "@/components/sections/process";
import { Projects } from "@/components/sections/projects";
import { Proof } from "@/components/sections/proof";
import { Assurance } from "@/components/sections/assurance";
import { About } from "@/components/sections/about";
import Faq from "@/components/sections/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { employmentAgencyLd, faqLd, pageMetadata } from "@/lib/seo";

// Tussenstand na bouwstap 3: de JV-secties staan er nog zonder de dienst- en
// formulierdelen. Spec 04 bouwt de homepage in bouwstap 4 opnieuw.
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
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

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const [t, tMeta, messages] = await Promise.all([
    getTranslations({ locale, namespace: "home" }),
    getTranslations({ locale, namespace: "meta" }),
    getMessages(),
  ]);
  const faqItems = t.raw("faq.items") as { q: string; a: string }[];

  return (
    // De JV-secties Hero, SegmentAccordion en ServiceTicker zijn clientcomponenten
    // die `home` lezen; die namespace krijgt alleen deze pagina mee (tijdelijk, spec 04).
    <NextIntlClientProvider messages={{ common: messages.common, home: messages.home }}>
      <JsonLd data={employmentAgencyLd({ locale, description: tMeta("organizationDescription") })} />
      <JsonLd data={faqLd(faqItems)} />
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
      <Process />
      <Projects />
      <Proof />
      <Assurance />
      <About />
      <Faq />
    </NextIntlClientProvider>
  );
}
