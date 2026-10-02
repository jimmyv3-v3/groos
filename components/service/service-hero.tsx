import { Phone, ArrowRight, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { contact } from "@/lib/site";
import { Link } from "@/i18n/navigation";
import { CtaButton } from "@/components/ui/cta-button";

type Crumb = { label: string; href?: string };

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
    <section className="relative overflow-hidden pb-16 pt-32 sm:pb-20 sm:pt-36">
      <div className="pointer-events-none absolute right-0 top-0 h-full w-[55%] bg-[radial-gradient(ellipse_70%_60%_at_75%_30%,hsl(var(--brand)/0.08),transparent_65%)]" />
      <div className="container relative">
        <nav
          aria-label={t("service.breadcrumbAria")}
          className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
        >
          {breadcrumb.map((c, i) => (
            <span key={c.label} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight
                  className="h-3 w-3 text-brand-subtle/60"
                  aria-hidden
                />
              )}
              {c.href ? (
                <Link
                  href={c.href}
                  className="transition-colors hover:text-brand-strong"
                >
                  {c.label}
                </Link>
              ) : (
                <span className="text-foreground/80">{c.label}</span>
              )}
            </span>
          ))}
        </nav>

        <div
          className={cn(
            "mt-8 grid items-center gap-12",
            image && "lg:grid-cols-2",
          )}
        >
          <div className={image ? undefined : "max-w-3xl"}>
            <h1 className="font-display text-3xl font-light leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {lead}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CtaButton href="#offerte" size="default">
                {t("common.cta.requestQuote")}
                <ArrowRight className="h-4 w-4" />
              </CtaButton>
              <CtaButton href={contact.phoneHref} variant="secondary" size="default">
                <Phone className="h-4 w-4" />
                {t("common.cta.callDirect")}
              </CtaButton>
            </div>
          </div>

          {image && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={imageAlt ?? ""}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
