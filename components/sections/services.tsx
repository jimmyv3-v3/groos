"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { services, type ServiceListItem } from "@/content/services";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/sections/section-heading";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

/**
 * Diensten als een uniform raster. Alle diensten zijn even groot en even
 * belangrijk. Client component omdat
 * de kaarten useTranslations gebruiken binnen RevealGroup.
 */
function ServiceCard({ service }: { service: ServiceListItem }) {
  const t = useTranslations();

  return (
    <Link
      href={`/diensten/${service.slug}`}
      className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-[border-color,box-shadow] duration-150 ease-brand hover:border-brand/40 hover:shadow-md sm:p-6"
    >
      <service.icon
        className="h-6 w-6 shrink-0 text-brand transition-colors duration-500 group-hover:text-brand-strong sm:h-7 sm:w-7"
        aria-hidden
      />
      <h3 className="mt-4 font-display text-h3 font-semibold text-foreground sm:mt-5">
        {t(`services.${service.slug}.title`)}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:mt-3">
        {t(`services.${service.slug}.summary`)}
      </p>
      <span className="mt-auto flex items-center gap-1.5 pt-4 text-xs font-medium uppercase tracking-wider text-brand-subtle transition-colors group-hover:text-brand-strong sm:pt-6">
        {t("home.servicesSection.moreAbout")}
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function Services() {
  const t = useTranslations("home.servicesSection");
  return (
    <section
      id="diensten"
      aria-label={t("ariaLabel")}
      className="relative scroll-mt-24 border-y border-border/60 bg-card/20 py-16 sm:py-20"
    >
      <div className="container relative">
        <SectionHeading
          title={t("title")}
          accent={t("accent")}
          intro={t("intro")}
        />

        <RevealGroup
          className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 lg:grid-cols-4"
          stagger={0.06}
          delayChildren={0.1}
        >
          {services.map((service) => (
            <RevealItem key={service.slug} className="h-full">
              <ServiceCard service={service} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
