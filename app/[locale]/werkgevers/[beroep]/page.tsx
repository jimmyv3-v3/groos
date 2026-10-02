import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { beroepen, findBeroepBySlug } from "@/content/beroepen";
import { getBeroepCopy } from "@/content/beroepen/pages";
import { withConfirmedClaims } from "@/lib/claims";
import { ROUTES, paths } from "@/lib/routes";
import { faqLd, ogImagePath, pageMetadata, serviceLd } from "@/lib/seo";
import { contact, whatsappLink } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { ServiceHero } from "@/components/service/service-hero";
import { ServiceFeatureGrid } from "@/components/service/service-feature-grid";
import { ServiceSteps } from "@/components/service/service-steps";
import { ServiceFaq } from "@/components/service/service-faq";
import { ServiceCta } from "@/components/service/service-cta";
import type { CtaLink } from "@/components/service/types";
import { ListSection } from "@/components/beroep/list-section";
import { CertificateList } from "@/components/beroep/certificate-list";
import { PerspectiveLink } from "@/components/beroep/perspective-link";
import { toFeatureItems } from "@/components/beroep/feature-items";

// Routeconfiguratie van spec 01 (§4.11.5). Statisch: geen live vacatures op deze pagina.
export const dynamicParams = false;
export const revalidate = false;

export function generateStaticParams() {
  return beroepen.map((b) => ({ beroep: b.slugWerkgever }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/werkgevers/[beroep]">): Promise<Metadata> {
  const { locale: raw, beroep } = await params;
  const locale = resolveLocale(raw);
  const item = findBeroepBySlug("werkgever", beroep);
  if (!item) return {};
  const t = await getTranslations({ locale, namespace: "beroepen" });
  const { meta } = getBeroepCopy(item.id, locale).copy.employer;
  const path = paths.werkgeverBeroep(item.id);
  const occupation = t(`${item.id}.enkelvoud`).toLocaleLowerCase(locale);
  const occupationPlural = t(`${item.id}.meervoud`);
  return pageMetadata({
    locale,
    path,
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    image: { url: ogImagePath(locale, path), alt: t("og.werkgever", { occupation, occupationPlural }), width: 1200, height: 630 },
  });
}

export default async function Page({ params }: PageProps<"/[locale]/werkgevers/[beroep]">) {
  const { locale: raw, beroep } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const item = findBeroepBySlug("werkgever", beroep);
  if (!item) notFound();

  const id = item.id;
  const [t, tb] = await Promise.all([getTranslations({ locale }), getTranslations({ locale, namespace: "beroepen" })]);
  const { copy } = getBeroepCopy(id, locale);
  const c = copy.employer;
  const path = paths.werkgeverBeroep(id);

  const occupationPlural = tb(`${id}.meervoud`).toLocaleLowerCase(locale);
  const ctas: CtaLink[] = [
    { label: t("common.cta.requestStaff"), href: `${ROUTES.personeelAanvragen}?beroep=${id}`, variant: "primary" },
    {
      label: t("common.cta.callDirect"),
      href: contact.phoneHref,
      variant: "secondary",
      icon: <Phone aria-hidden="true" />,
      ariaLabel: t("header.callAria", { phone: contact.phone }),
    },
  ];
  const faq = withConfirmedClaims(c.faq.items);
  const steps = t.raw("werkgevers.steps.items") as { title: string; body: string }[];

  return (
    <>
      <ServiceHero
        breadcrumb={[
          { label: t("header.nav.werkgevers"), href: ROUTES.werkgevers },
          { label: tb(`${id}.meervoud`), href: path },
        ]}
        title={c.hero.title}
        lead={c.hero.lead}
        ctas={ctas}
        note={t("common.notes.noObligationEmployer")}
      />

      <ListSection
        id="levering"
        className="bg-ice"
        heading={c.supply.title}
        accent={c.supply.accent}
        intro={c.supply.intro}
        groups={[{ items: c.supply.tasks }, { title: c.supply.clientsTitle, items: c.supply.clients }]}
        tone="check"
      />

      <ServiceFeatureGrid
        id="waarom"
        heading={c.why.title}
        accent={c.why.accent}
        intro={c.why.intro}
        features={toFeatureItems(withConfirmedClaims(c.why.items))}
        columns={4}
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
        id="planning"
        heading={c.planning.title}
        accent={c.planning.accent}
        intro={c.planning.intro}
        features={toFeatureItems(withConfirmedClaims(c.planning.items))}
        columns={3}
      />

      <ServiceSteps
        id="werkwijze"
        className="bg-ice"
        heading={t("werkgevers.steps.title")}
        accent={t("werkgevers.steps.accent")}
        intro={t("werkgevers.steps.intro")}
        steps={steps}
      />

      <ListSection
        id="zekerheid"
        heading={c.legal.title}
        accent={c.legal.accent}
        intro={c.legal.intro}
        groups={[{ items: withConfirmedClaims(c.legal.items).map((i) => i.text) }]}
        tone="check"
        link={{ label: c.legal.wttaLinkLabel, href: ROUTES.wtta }}
      />

      <ServiceFaq className="bg-ice" heading={c.faq.title} accent={c.faq.accent} intro={c.faq.intro} items={faq} />
      <JsonLd data={faqLd(faq.map(({ q, a }) => ({ q, a })))} />
      <JsonLd
        data={serviceLd({
          locale,
          path,
          name: c.hero.title,
          serviceType: c.meta.serviceType,
          description: c.meta.description,
        })}
      />

      <PerspectiveLink text={c.perspective.text} linkLabel={c.perspective.linkLabel} href={paths.werkenAls(id)} />

      <ServiceCta
        id="aanvragen"
        title={c.cta.title}
        accent={c.cta.accent}
        subtitle={c.cta.body}
        ctas={[
          ...ctas,
          {
            label: t("common.cta.whatsapp"),
            href: whatsappLink(t("common.whatsapp.werkgeverBeroep", { occupationPlural })),
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
