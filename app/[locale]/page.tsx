import type { Metadata } from "next";
import { ClipboardList, Briefcase } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { ROUTES } from "@/lib/routes";
import { contact } from "@/lib/site";
import { employmentAgencyLd, faqLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { CtaBand } from "@/components/sections/cta-band";
import { HomeHero } from "@/components/sections/home/home-hero";
import { HomeVacancies } from "@/components/sections/home/home-vacancies";
import { HomeBeroepen } from "@/components/sections/home/home-beroepen";
import { HowItWorks } from "@/components/sections/home/how-it-works";
import { WhyGroos } from "@/components/sections/home/why-groos";
import { HomePeople } from "@/components/sections/home/home-people";
import { HomeFaq } from "@/components/sections/home/home-faq";
import { getHomeFaqItems } from "@/components/sections/home/faq-items";

// Homepage (spec 04 §4.2). ISR: de vacaturesectie ververst via de tag
// `vacatures` (B-35) en anders elk uur.
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

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const [tMeta, t, tCommon, faqItems] = await Promise.all([
    getTranslations({ locale, namespace: "meta" }),
    getTranslations({ locale, namespace: "home.cta" }),
    getTranslations({ locale, namespace: "common" }),
    getHomeFaqItems(locale),
  ]);

  return (
    <>
      <JsonLd data={employmentAgencyLd({ locale, description: tMeta("organizationDescription") })} />
      <JsonLd data={faqLd(faqItems)} />
      <HomeHero />
      <HomeVacancies locale={locale} />
      <HomeBeroepen />
      <HowItWorks />
      <WhyGroos />
      <HomePeople locale={locale} />
      <HomeFaq />
      <CtaBand
        id="aan-de-slag"
        headingId="home-cta-titel"
        title={t("title")}
        accent={t("accent")}
        body={t.rich("body", {
          phone: contact.phone,
          link: (chunks) => (
            <a href={contact.phoneHref} className="font-semibold whitespace-nowrap text-foreground underline underline-offset-4">
              {chunks}
            </a>
          ),
        })}
        actions={[
          {
            href: ROUTES.personeelAanvragen,
            label: tCommon("cta.requestStaff"),
            variant: "primary",
            icon: <ClipboardList aria-hidden />,
          },
          { href: ROUTES.vacatures, label: tCommon("cta.viewJobs"), variant: "secondary", icon: <Briefcase aria-hidden /> },
        ]}
      />
    </>
  );
}
