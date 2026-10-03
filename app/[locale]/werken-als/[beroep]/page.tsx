import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { beroepen, findBeroepBySlug } from "@/content/beroepen";
import { getBeroepCopy } from "@/content/beroepen/pages";
import { withConfirmedClaims } from "@/lib/claims";
import { formatDate, formatEuro } from "@/lib/format";
import { ROUTES, paths } from "@/lib/routes";
import { faqLd, ogImagePath, pageMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { ServiceHero } from "@/components/service/service-hero";
import { ServiceFeatureGrid } from "@/components/service/service-feature-grid";
import { ServiceSteps } from "@/components/service/service-steps";
import { ServiceFaq } from "@/components/service/service-faq";
import { ServiceCta } from "@/components/service/service-cta";
import { ListSection } from "@/components/beroep/list-section";
import { WageIndication } from "@/components/beroep/wage-indication";
import { CertificateList } from "@/components/beroep/certificate-list";
import { CareerPath } from "@/components/beroep/career-path";
import { BeroepVacancies } from "@/components/beroep/beroep-vacancies";
import { PerspectiveLink } from "@/components/beroep/perspective-link";
import { toFeatureItems } from "@/components/beroep/feature-items";

// Routeconfiguratie van spec 01 (§4.11.5); ISR omdat de pagina live vacatures toont.
export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams() {
  return beroepen.map((b) => ({ beroep: b.slugWerkzoekende }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/werken-als/[beroep]">): Promise<Metadata> {
  const { locale: raw, beroep } = await params;
  const locale = resolveLocale(raw);
  const item = findBeroepBySlug("werkzoekende", beroep);
  if (!item) return {};
  const t = await getTranslations({ locale, namespace: "beroepen" });
  const { meta } = getBeroepCopy(item.id, locale).copy.jobseeker;
  const path = paths.werkenAls(item.id);
  const occupation = t(`${item.id}.enkelvoud`).toLocaleLowerCase(locale);
  const occupationPlural = t(`${item.id}.meervoud`);
  return pageMetadata({
    locale,
    path,
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    image: { url: ogImagePath(locale, path), alt: t("og.werkzoekende", { occupation, occupationPlural }), width: 1200, height: 630 },
  });
}

export default async function Page({ params }: PageProps<"/[locale]/werken-als/[beroep]">) {
  const { locale: raw, beroep } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const item = findBeroepBySlug("werkzoekende", beroep);
  if (!item) notFound();

  const id = item.id;
  const [t, tb] = await Promise.all([getTranslations({ locale }), getTranslations({ locale, namespace: "beroepen" })]);
  const { content, copy } = getBeroepCopy(id, locale);
  const c = copy.jobseeker;

  const occupation = tb(`${id}.enkelvoud`).toLocaleLowerCase(locale);
  const range = (r: { min: number; max: number }) =>
    t("common.format.wageRange", { min: formatEuro(r.min, locale), max: formatEuro(r.max, locale) });
  const starterRange = range(content.wage.starter);
  const registerHref = `${ROUTES.inschrijven}?beroep=${id}`;
  const whatsappText = t("common.whatsapp.werkzoekendeBeroep", { occupation });
  const whatsapp = {
    label: t("common.cta.whatsapp"),
    href: whatsappLink(whatsappText),
    variant: "secondary" as const,
    external: true,
    icon: <MessageCircle aria-hidden="true" />,
  };
  const faq = withConfirmedClaims(c.faq.items);
  const steps = t.raw("werkzoekenden.steps.items") as { title: string; body: string }[];

  return (
    <>
      <ServiceHero
        breadcrumb={[
          { label: t("header.nav.werkzoekenden"), href: ROUTES.werkzoekenden },
          { label: tb(`${id}.enkelvoud`), href: paths.werkenAls(id) },
        ]}
        title={c.hero.title}
        lead={c.hero.lead}
        facts={[{ label: tb("ui.wageFactLabel"), value: starterRange }, ...c.hero.facts]}
        factsLabel={tb("ui.factsLabel")}
        ctas={[
          { label: t("common.cta.viewJobs"), href: "#vacatures", variant: "primary" },
          { label: t("common.cta.register"), href: registerHref, variant: "secondary" },
          whatsapp,
        ]}
        note={t("common.notes.freeJobseeker")}
      />

      <ListSection
        id="werk"
        className="bg-ice"
        heading={c.work.title}
        accent={c.work.accent}
        intro={c.work.intro}
        groups={[{ items: c.work.tasks }, { title: c.work.placesTitle, items: c.work.places }]}
        tone="check"
      />

      <ListSection
        id="eisen"
        heading={c.requirements.title}
        accent={c.requirements.accent}
        intro={c.requirements.intro}
        groups={[{ items: c.requirements.items }]}
        note={c.requirements.minAgeNote}
      />

      <WageIndication
        id="loon"
        className="bg-ice"
        heading={c.wage.title}
        accent={c.wage.accent}
        intro={c.wage.intro}
        badge={tb("ui.wage.badge")}
        rangeLabel={tb("ui.wage.rangeLabel")}
        range={starterRange}
        experienced={
          content.wage.experienced
            ? { label: tb("ui.wage.experiencedLabel"), range: range(content.wage.experienced) }
            : undefined
        }
        source={tb("ui.wage.source", { source: c.wage.sourceLabel, date: formatDate(content.wage.checkedAt, locale) })}
        disclaimer={tb("ui.wage.disclaimerJobseeker")}
        extra={c.wage.extra}
      />

      <ServiceFeatureGrid
        id="werktijden"
        heading={c.schedule.title}
        accent={c.schedule.accent}
        intro={c.schedule.intro}
        features={toFeatureItems(withConfirmedClaims(c.schedule.items))}
        columns={3}
      />

      <CertificateList
        id="certificaten"
        className="bg-ice"
        heading={c.certificates.title}
        accent={c.certificates.accent}
        intro={c.certificates.intro}
        items={withConfirmedClaims(c.certificates.items).map((entry) => ({
          name: entry.name,
          needLabel: tb(`ui.need.${entry.need}`),
          body: entry.body,
        }))}
      />

      <ServiceFeatureGrid
        id="waarom"
        heading={c.why.title}
        accent={c.why.accent}
        intro={c.why.intro}
        features={toFeatureItems(withConfirmedClaims(c.why.items))}
        columns={3}
      />

      <CareerPath
        id="doorgroei"
        className="bg-ice"
        heading={c.career.title}
        accent={c.career.accent}
        intro={c.career.intro}
        steps={c.career.steps}
        listLabel={tb("ui.careerListLabel")}
        note={c.career.note}
      />

      <BeroepVacancies
        id="vacatures"
        beroepId={id}
        locale={locale}
        heading={c.vacancies.title}
        accent={c.vacancies.accent}
        intro={c.vacancies.intro}
        limit={6}
        empty={{ title: c.vacancies.emptyTitle, body: c.vacancies.emptyBody, whatsappText }}
      />

      <ServiceSteps
        id="solliciteren"
        className="bg-ice"
        heading={t("werkzoekenden.steps.title")}
        accent={t("werkzoekenden.steps.accent")}
        intro={t("werkzoekenden.steps.intro")}
        steps={steps}
      />

      <ServiceFaq heading={c.faq.title} accent={c.faq.accent} intro={c.faq.intro} items={faq} />
      <JsonLd data={faqLd(faq.map(({ q, a }) => ({ q, a })))} />

      <PerspectiveLink
        className="bg-ice"
        text={c.perspective.text}
        linkLabel={c.perspective.linkLabel}
        href={paths.werkgeverBeroep(id)}
      />

      <ServiceCta
        id="aan-de-slag"
        title={c.cta.title}
        accent={c.cta.accent}
        subtitle={c.cta.body}
        ctas={[{ label: t("common.cta.register"), href: registerHref, variant: "primary" }, whatsapp]}
        note={t("common.notes.cvOptionalJobseeker")}
        link={{ label: tb("ui.vacancies.viewAllLink"), href: paths.vacaturesVoorBeroep(id) }}
      />
    </>
  );
}
