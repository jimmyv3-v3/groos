import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { ROUTES } from "@/lib/routes";
import { contact } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { CtaBand } from "@/components/sections/cta-band";
import { AboutHero } from "@/components/sections/about/about-hero";
import { AboutStory } from "@/components/sections/about/about-story";
import { AboutPeople } from "@/components/sections/about/about-people";
import { AboutArea } from "@/components/sections/about/about-area";
import { AboutApproach } from "@/components/sections/about/about-approach";

// Over ons (spec 04 §4.5): statisch. JSON-LD alleen BreadcrumbList via Breadcrumbs.
export const revalidate = false;

export async function generateMetadata({ params }: PageProps<"/[locale]/over-ons">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return pageMetadata({ locale, path: ROUTES.overOns, title: t("title"), description: t("description") });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/over-ons">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const [t, tCommon, tHeader] = await Promise.all([
    getTranslations({ locale, namespace: "about.cta" }),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "header" }),
  ]);

  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutPeople locale={locale} />
      <AboutArea />
      <AboutApproach />
      <CtaBand
        id="contact"
        headingId="over-ons-cta-titel"
        title={t("title")}
        accent={t("accent")}
        body={t.rich("body", {
          phone: contact.phone,
          email: contact.email,
          link: (chunks) => (
            <a
              href={contact.phoneHref}
              className="font-semibold whitespace-nowrap text-foreground underline underline-offset-4"
            >
              {chunks}
            </a>
          ),
        })}
        actions={[
          { href: ROUTES.contact, label: tCommon("cta.contact"), variant: "primary" },
          {
            href: contact.phoneHref,
            label: tCommon("cta.call"),
            variant: "secondary",
            icon: <Phone aria-hidden />,
            ariaLabel: tHeader("callAria", { phone: contact.phone }),
          },
        ]}
      />
    </>
  );
}
