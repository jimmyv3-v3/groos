import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { beroepen } from "@/content/beroepen";
import { getWerkzoekendenPage } from "@/content/pages/loaders";
import { withConfirmedClaims } from "@/lib/claims";
import { ROUTES, paths } from "@/lib/routes";
import { faqLd, pageMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { ServiceHero } from "@/components/service/service-hero";
import { ServiceFeatureGrid } from "@/components/service/service-feature-grid";
import { ServiceSteps } from "@/components/service/service-steps";
import { ServiceFaq } from "@/components/service/service-faq";
import { ServiceCta } from "@/components/service/service-cta";
import { BeroepGrid } from "@/components/beroep/beroep-grid";
import { ListSection } from "@/components/beroep/list-section";
import { BeroepVacancies } from "@/components/beroep/beroep-vacancies";
import { AudienceCompare } from "@/components/beroep/audience-compare";
import { toFeatureItems } from "@/components/beroep/feature-items";

// ISR: de pagina toont de nieuwste vacatures (spec 05 §4.1).
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/[locale]/werkzoekenden">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const t = await getTranslations({ locale, namespace: "werkzoekenden.meta" });
  return pageMetadata({ locale, path: ROUTES.werkzoekenden, title: t("title"), description: t("description") });
}

export default async function Page({ params }: PageProps<"/[locale]/werkzoekenden">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);

  const [t, tb] = await Promise.all([getTranslations({ locale }), getTranslations({ locale, namespace: "beroepen" })]);
  const c = getWerkzoekendenPage(locale);
  const whatsappText = t("common.whatsapp.werkzoekende");
  const faq = withConfirmedClaims(c.faq.items);
  const steps = t.raw("werkzoekenden.steps.items") as { title: string; body: string }[];

  return (
    <>
      <ServiceHero
        breadcrumb={[{ label: t("header.nav.werkzoekenden"), href: ROUTES.werkzoekenden }]}
        title={c.hero.title}
        lead={c.hero.lead}
        ctas={[
          { label: t("common.cta.viewJobs"), href: ROUTES.vacatures, variant: "primary" },
          { label: t("common.cta.register"), href: ROUTES.inschrijven, variant: "secondary" },
          {
            label: t("common.cta.whatsapp"),
            href: whatsappLink(whatsappText),
            variant: "secondary",
            external: true,
            icon: <MessageCircle aria-hidden="true" />,
          },
        ]}
        note={t("common.notes.freeJobseeker")}
      />

      <BeroepGrid
        id="beroepen"
        className="bg-ice"
        heading={c.beroepen.title}
        accent={c.beroepen.accent}
        intro={c.beroepen.intro}
        items={beroepen.map((b) => ({
          id: b.id,
          title: tb(`${b.id}.enkelvoud`),
          body: tb(`${b.id}.jobseeker.summary`),
          href: paths.werkenAls(b.id),
          icon: b.icon,
        }))}
      />

      <ServiceSteps
        id="zo-werkt-het"
        heading={t("werkzoekenden.steps.title")}
        accent={t("werkzoekenden.steps.accent")}
        intro={t("werkzoekenden.steps.intro")}
        steps={steps}
      />

      <ServiceFeatureGrid
        id="wat-je-krijgt"
        className="bg-ice"
        heading={c.promises.title}
        accent={c.promises.accent}
        intro={c.promises.intro}
        features={toFeatureItems(withConfirmedClaims(c.promises.items))}
        columns={withConfirmedClaims(c.promises.items).length % 3 === 0 ? 3 : 4}
      />

      <ListSection
        id="je-rechten"
        heading={c.rights.title}
        accent={c.rights.accent}
        intro={c.rights.intro}
        groups={[{ items: withConfirmedClaims(c.rights.items).map((i) => i.text) }]}
        tone="check"
      />

      <BeroepVacancies
        id="vacatures"
        className="bg-ice"
        locale={locale}
        heading={c.vacancies.title}
        accent={c.vacancies.accent}
        intro={c.vacancies.intro}
        limit={3}
        empty={{ title: c.vacancies.emptyTitle, body: c.vacancies.emptyBody, whatsappText }}
      />

      <AudienceCompare
        id="voor-werkgevers"
        heading={c.compare.title}
        accent={c.compare.accent}
        intro={c.compare.intro}
        caption={c.compare.caption}
        columns={[
          { title: c.compare.jobseekerTitle, href: ROUTES.werkzoekenden, linkLabel: c.compare.jobseekerLinkLabel, current: true },
          { title: c.compare.employerTitle, href: ROUTES.werkgevers, linkLabel: c.compare.employerLinkLabel, current: false },
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
          { label: t("common.cta.viewJobs"), href: ROUTES.vacatures, variant: "primary" },
          { label: t("common.cta.register"), href: ROUTES.inschrijven, variant: "secondary" },
        ]}
        note={t("common.notes.cvOptionalJobseeker")}
      />
    </>
  );
}
