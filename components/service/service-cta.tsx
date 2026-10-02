import { Phone, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { contact } from "@/lib/site";
import { CtaButton } from "@/components/ui/cta-button";
import { Reveal } from "@/components/motion/reveal";

/**
 * Mid-page call-to-action band. Used to keep the offerte/bel action visible
 * throughout a service page, not just in the hero and footer form.
 */
export function ServiceCta({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const t = useTranslations();
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="container relative">
        <Reveal className="mx-auto max-w-3xl rounded-xl border border-border/70 bg-card/40 px-8 py-12 text-center sm:px-12">
          <h2 className="text-h2">
            {title}
          </h2>
          {subtitle && (
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {subtitle}
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <CtaButton href="#offerte" size="default">
              {t("common.cta.requestStaff")}
              <ArrowRight className="h-4 w-4" />
            </CtaButton>
            <CtaButton href={contact.phoneHref} variant="secondary" size="default">
              <Phone className="h-4 w-4" />
              {t("common.cta.callDirect")}
            </CtaButton>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            {t("common.notes.noObligationEmployer")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
