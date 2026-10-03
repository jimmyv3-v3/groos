import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { getWttaPage } from "@/content/pages/loaders";
import { withConfirmedClaims } from "@/lib/claims";
import { formatDate } from "@/lib/format";
import { WTTA } from "@/lib/legal";
import { ROUTES } from "@/lib/routes";
import { faqLd, pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/sections/section-heading";
import { WttaStatus } from "@/components/legal/wtta-status";
import { ServiceHero } from "@/components/service/service-hero";
import { ServiceSteps } from "@/components/service/service-steps";
import { ServiceFaq } from "@/components/service/service-faq";
import { ServiceCta } from "@/components/service/service-cta";
import { ListSection } from "@/components/beroep/list-section";
import { WttaTimeline } from "@/components/beroep/wtta-timeline";
import { SourceList } from "@/components/beroep/source-list";

export async function generateMetadata({ params }: PageProps<"/[locale]/werkgevers/wtta">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const t = await getTranslations({ locale, namespace: "werkgevers.wtta.meta" });
  return pageMetadata({ locale, path: ROUTES.wtta, title: t("title"), description: t("description") });
}

function Paragraphs({
  id,
  heading,
  accent,
  intro,
  paragraphs,
  className,
}: {
  id: string;
  heading: string;
  accent?: string;
  intro?: string;
  paragraphs: string[];
  className?: string;
}) {
  return (
    <section id={id} className={cn("section scroll-mt-24", className)}>
      <div className="container">
        <SectionHeading title={heading} accent={accent} intro={intro} />
        <div className="mt-8 grid max-w-prose gap-4 text-base">
          {paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function Page({ params }: PageProps<"/[locale]/werkgevers/wtta">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);

  const t = await getTranslations({ locale });
  const c = getWttaPage(locale);
  const faq = withConfirmedClaims(c.faq.items);
  // Statische pagina: "voorbij" wordt bij elke build opnieuw bepaald.
  const buildDate = new Date();
  const showStatus = WTTA.phase !== "none";
  // Valt de statussectie weg, dan schuift de afwisseling van de achtergronden op (§4.7).
  const bg = (withStatus: boolean) => (withStatus === showStatus ? "bg-ice" : undefined);

  return (
    <>
      <ServiceHero
        breadcrumb={[
          { label: t("header.nav.werkgevers"), href: ROUTES.werkgevers },
          { label: t("header.nav.wtta"), href: ROUTES.wtta },
        ]}
        title={c.hero.title}
        lead={c.hero.lead}
        ctas={[
          { label: t("common.cta.contact"), href: ROUTES.contact, variant: "primary" },
          { label: t("common.cta.requestStaff"), href: ROUTES.personeelAanvragen, variant: "secondary" },
        ]}
        note={t("werkgevers.wtta.reviewed", { date: formatDate(c.reviewedAt, locale) })}
      />

      <Paragraphs
        id="wat-is-de-wtta"
        className="bg-ice"
        heading={c.about.title}
        accent={c.about.accent}
        intro={c.about.intro}
        paragraphs={c.about.paragraphs}
      />

      <WttaTimeline
        id="tijdlijn"
        heading={c.timeline.title}
        accent={c.timeline.accent}
        intro={c.timeline.intro}
        pastLabel={t("werkgevers.wtta.pastLabel")}
        items={c.timeline.items.map((item) => ({
          date: item.date,
          dateLabel: item.dateLabel ?? formatDate(item.date, locale),
          title: item.title,
          body: item.body,
          source: item.source,
          past: new Date(`${item.date}T00:00:00`) < buildDate,
        }))}
      />

      <ListSection
        id="wat-u-regelt"
        className="bg-ice"
        heading={c.hirer.title}
        accent={c.hirer.accent}
        intro={c.hirer.intro}
        groups={[{ items: withConfirmedClaims(c.hirer.items).map((i) => i.text) }]}
        tone="check"
      />

      <ServiceSteps
        id="controleren"
        heading={c.check.title}
        accent={c.check.accent}
        intro={c.check.intro}
        steps={c.check.steps}
      />

      {showStatus && (
        <section id="status-groos" className="section scroll-mt-24 bg-ice">
          <div className="container">
            <SectionHeading title={c.status.title} accent={c.status.accent} intro={c.status.intro} />
            <WttaStatus variant="block" className="mt-8" />
          </div>
        </section>
      )}

      <Paragraphs
        id="aansprakelijkheid"
        className={bg(false)}
        heading={c.liability.title}
        accent={c.liability.accent}
        intro={c.liability.intro}
        paragraphs={c.liability.paragraphs}
      />

      <ServiceFaq className={bg(true)} heading={c.faq.title} accent={c.faq.accent} intro={c.faq.intro} items={faq} />
      <JsonLd data={faqLd(faq.map(({ q, a }) => ({ q, a })))} />

      <SourceList id="bronnen" className={bg(false)} heading={c.sources.title} intro={c.sources.intro} items={c.sources.items} />

      <ServiceCta
        title={c.cta.title}
        accent={c.cta.accent}
        subtitle={c.cta.body}
        ctas={[{ label: t("common.cta.requestStaff"), href: ROUTES.personeelAanvragen, variant: "primary" }]}
      />
    </>
  );
}
