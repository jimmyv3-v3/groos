import Image from "next/image";
import { Phone, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { contact } from "@/lib/site";
import type { AppPath } from "@/lib/routes";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { CtaButton } from "@/components/ui/cta-button";

type Crumb = { label: string; href: AppPath };

/**
 * Service-page hero: breadcrumb, title, lead, two CTAs and an optional photo.
 * Server component; de CTA-knoppen komen uit components/ui/cta-button.
 */
export function ServiceHero({
  breadcrumb,
  title,
  lead,
  image,
  imageAlt,
}: {
  breadcrumb: Crumb[];
  title: string;
  lead: string;
  image?: string;
  imageAlt?: string;
}) {
  const t = useTranslations();
  return (
    <section className="relative overflow-hidden pb-16 pt-12 sm:pb-20 sm:pt-16">
      <div className="container relative">
        <Breadcrumbs items={breadcrumb} />

        <div
          className={cn(
            "mt-8 grid items-center gap-12",
            image && "lg:grid-cols-2",
          )}
        >
          <div className={image ? undefined : "max-w-3xl"}>
            <h1 className="text-h1">
              {title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {lead}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CtaButton href="#offerte" size="default">
                {t("common.cta.requestStaff")}
                <ArrowRight className="h-4 w-4" />
              </CtaButton>
              <CtaButton href={contact.phoneHref} variant="secondary" size="default">
                <Phone className="h-4 w-4" />
                {t("common.cta.callDirect")}
              </CtaButton>
            </div>
          </div>

          {image && (
            <div className="relative aspect-4/3 overflow-hidden rounded-lg border border-border/60">
              <Image
                src={image}
                alt={imageAlt ?? ""}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/70 via-background/10 to-transparent" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
