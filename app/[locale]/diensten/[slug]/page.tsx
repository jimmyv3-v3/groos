import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { OfferteForm } from "@/components/sections/offerte-form";
import { ServiceHero } from "@/components/service/service-hero";
import { ServiceFeatureGrid } from "@/components/service/service-feature-grid";
import { ServiceSteps } from "@/components/service/service-steps";
import { ServiceFaq } from "@/components/service/service-faq";
import { ServiceCta } from "@/components/service/service-cta";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { services } from "@/content/services";
import { getServicePage } from "@/content/services/pages";
import {
  breadcrumbLd,
  faqLd,
  localizedPath,
  pageMetadata,
  serviceLd,
} from "@/lib/seo";

/**
 * Eén template voor alle dienstpagina's. In J. Versseput was dit acht keer
 * dezelfde page.tsx met een eigen CONTENT-blok; hier komt de tekst uit
 * content/services/<slug>.ts en blijft de opbouw op één plek.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getServicePage(slug, locale);
  if (!service) return {};
  return pageMetadata({
    locale,
    path: `/diensten/${slug}`,
    title: service.copy.title,
    description: service.copy.metaDescription,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = getServicePage(slug, locale);
  if (!service) notFound();
  const { page, copy: c } = service;
  const tNav = await getTranslations("common.nav");
  const path = localizedPath(locale, `/diensten/${slug}`);

  return (
    <>
      <JsonLd
        data={serviceLd({
          name: c.title,
          serviceType: c.jsonLdServiceType,
          description: c.jsonLdDescription,
          path,
        })}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: tNav("home"), path: localizedPath(locale, "/") },
          { name: tNav("services"), path: localizedPath(locale, "/") + "#diensten" },
          { name: c.title, path },
        ])}
      />
      <JsonLd data={faqLd(c.faqs)} />
      <SiteHeader />
      <main>
        <ServiceHero
          breadcrumb={[
            { label: tNav("home"), href: "/" },
            { label: tNav("services"), href: "/#diensten" },
            { label: c.title },
          ]}
          title={c.title}
          lead={c.lead}
          image={page.image}
          imageAlt={c.imageAlt}
        />

        {/* Wat wij doen */}
        <section className="relative scroll-mt-24 py-16 sm:py-20">
          <div className="container grid gap-12 lg:grid-cols-2 lg:gap-16">
            <SectionHeading
              title={c.whatTitle}
              accent={c.whatAccent}
              intro={c.whatIntro}
            />
            <Reveal delay={0.1}>
              <ul className="space-y-4">
                {c.included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check
                      className="mt-0.5 h-5 w-5 shrink-0 text-brand"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span className="text-sm leading-relaxed text-foreground/85">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* Optioneel extra blok (in J. Versseput: conserveren na gevelreiniging) */}
        {c.extra && (
          <section className="relative scroll-mt-24 border-y border-border/60 bg-card/20 py-16 sm:py-20">
            <div className="container grid gap-12 lg:grid-cols-2 lg:gap-16">
              <SectionHeading
                title={c.extra.title}
                accent={c.extra.accent}
                intro={c.extra.intro}
              />
              <Reveal delay={0.1}>
                <ul className="space-y-4">
                  {c.extra.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check
                        className="mt-0.5 h-5 w-5 shrink-0 text-brand"
                        strokeWidth={2}
                        aria-hidden
                      />
                      <span className="text-sm leading-relaxed text-foreground/85">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>
        )}

        {/* Wat uitstel u kost: urgentie */}
        <section className="relative scroll-mt-24 py-16 sm:py-20">
          <div className="container">
            <SectionHeading
              title={c.urgencyTitle}
              accent={c.urgencyAccent}
              intro={c.urgencyIntro}
            />
            <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.stakes.map((s, i) => {
                const Icon = page.stakeIcons[i % page.stakeIcons.length];
                return (
                  <RevealItem key={s.title + i} className="h-full">
                    <div className="flex h-full flex-col rounded-lg border border-border/70 bg-card/40 p-6">
                      <Icon
                        className="h-7 w-7 text-brand"
                        strokeWidth={1.4}
                        aria-hidden
                      />
                      <h3 className="mt-5 font-display text-lg font-medium text-foreground">
                        {s.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {s.body}
                      </p>
                    </div>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </div>
        </section>

        <ServiceCta title={c.ctaTitle} subtitle={c.ctaSubtitle} />

        {c.steps && (
          <ServiceSteps
            heading={c.steps.heading}
            accent={c.steps.accent}
            intro={c.steps.intro}
            steps={c.steps.items.map((s, i) => ({
              ...s,
              icon: page.stepIcons?.[i],
            }))}
          />
        )}

        <ServiceFeatureGrid
          heading={c.featureHeading}
          accent={c.featureAccent}
          features={c.features.map((f, i) => ({
            ...f,
            icon: page.featureIcons[i % page.featureIcons.length],
          }))}
        />

        <ServiceFaq items={c.faqs} />

        <div id="offerte" className="scroll-mt-24">
          <OfferteForm />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
