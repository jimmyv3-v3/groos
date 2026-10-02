import type { Metadata } from "next";
import { MessageCircle, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { beroepen } from "@/content/beroepen";
import { getWerkgeversPage } from "@/content/pages/loaders";
import { withConfirmedClaims } from "@/lib/claims";
import { ROUTES, paths } from "@/lib/routes";
import { faqLd, pageMetadata } from "@/lib/seo";
import { contact, whatsappLink } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { ServiceHero } from "@/components/service/service-hero";
import { ServiceFeatureGrid } from "@/components/service/service-feature-grid";
import { ServiceSteps } from "@/components/service/service-steps";
import { ServiceFaq } from "@/components/service/service-faq";
import { ServiceCta } from "@/components/service/service-cta";
import type { CtaLink } from "@/components/service/types";
import { BeroepGrid } from "@/components/beroep/beroep-grid";
import { ListSection } from "@/components/beroep/list-section";
import { FactSheet } from "@/components/beroep/fact-sheet";
import { AudienceCompare } from "@/components/beroep/audience-compare";
import { toFeatureItems } from "@/components/beroep/feature-items";

export async function generateMetadata({ params }: PageProps<"/[locale]/werkgevers">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const t = await getTranslations({ locale, namespace: "werkgevers.meta" });
  return pageMetadata({ locale, path: ROUTES.werkgevers, title: t("title"), description: t("description") });
}

export default async function Page({ params }: PageProps<"/[locale]/werkgevers">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);

  const [t, tb] = await Promise.all([getTranslations({ locale }), getTranslations({ locale, namespace: "beroepen" })]);
  const c = getWerkgeversPage(locale);
  const faq = withConfirmedClaims(c.faq.items);
  const steps = t.raw("werkgevers.steps.items") as { title: string; body: string }[];
  const ctas: CtaLink[] = [
    { label: t("common.cta.requestStaff"), href: ROUTES.personeelAanvragen, variant: "primary" },
    {
      label: t("common.cta.call"),
      href: contact.phoneHref,
      variant: "secondary",
      icon: <Phone aria-hidden="true" />,
      ariaLabel: t("header.callAria", { phone: contact.phone }),
    },
  ];

  return (
    <>
      <ServiceHero
        breadcrumb={[{ label: t("header.nav.werkgevers"), href: ROUTES.werkgevers }]}
        title={c.hero.title}
        lead={c.hero.lead}
        ctas={ctas}
        note={t("common.notes.noObligationEmployer")}
      />

      <ServiceFeatureGrid
        id="wat-wij-leveren"
        className="bg-ice"
        heading={c.supply.title}
        accent={c.supply.accent}
        intro={c.supply.intro}
        features={toFeatureItems(withConfirmedClaims(c.supply.items))}
        columns={withConfirmedClaims(c.supply.items).length === 3 ? 3 : 4}
      />

      <BeroepGrid
        id="beroepen"
        heading={c.beroepen.title}
        accent={c.beroepen.accent}
        intro={c.beroepen.intro}
        items={beroepen.map((b) => ({
          id: b.id,
          title: tb(`${b.id}.meervoud`),
          body: tb(`${b.id}.employer.summary`),
          href: paths.werkgeverBeroep(b.id),
          icon: b.icon,
        }))}
      />

      <ServiceSteps
        id="werkwijze"
        className="bg-ice"
        heading={t("werkgevers.steps.title")}
        accent={t("werkgevers.steps.accent")}
        intro={t("werkgevers.steps.intro")}
        steps={steps}
      />

      <FactSheet id="uitzenden" heading={c.agency.title} accent={c.agency.accent} intro={c.agency.intro} items={c.agency.items} />

      <ListSection
        id="zekerheid"
        className="bg-ice"
        heading={c.legal.title}
        accent={c.legal.accent}
        intro={c.legal.intro}
        groups={[{ items: withConfirmedClaims(c.legal.items).map((i) => i.text) }]}
        tone="check"
        link={{ label: c.legal.wttaLinkLabel, href: ROUTES.wtta }}
      />

      <AudienceCompare
        id="voor-werkzoekenden"
        heading={c.compare.title}
        accent={c.compare.accent}
        intro={c.compare.intro}
        caption={c.compare.caption}
        columns={[
          { title: c.compare.jobseekerTitle, href: ROUTES.werkzoekenden, linkLabel: c.compare.jobseekerLinkLabel, current: false },
          { title: c.compare.employerTitle, href: ROUTES.werkgevers, linkLabel: c.compare.employerLinkLabel, current: true },
        ]}
        rows={c.compare.rows.map((r) => ({ label: r.label, values: [r.jobseeker, r.employer] }))}
      />

      <ServiceFaq className="bg-ice" heading={c.faq.title} accent={c.faq.accent} intro={c.faq.intro} items={faq} />
      <JsonLd data={faqLd(faq.map(({ q, a }) => ({ q, a })))} />

      <ServiceCta
        title={c.cta.title}
        accent={c.cta.accent}
        subtitle={c.cta.body}
        ctas={[
          ...ctas,
          {
            label: t("common.cta.whatsapp"),
            href: whatsappLink(t("common.whatsapp.werkgever")),
            variant: "secondary",
            external: true,
            icon: <MessageCircle aria-hidden="true" />,
          },
        ]}
        note={t("common.notes.urgentEmployer")}
      />
    </>
  );
}
