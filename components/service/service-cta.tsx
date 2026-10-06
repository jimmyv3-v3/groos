import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { ColumnLines } from "@/components/ui/column-lines";
import { CtaLinks } from "./cta-links";
import type { CtaLink } from "./types";

/**
 * Afsluitende band (spec 05 §4.4.1, recept spec 02 §4.13): een blauwe kaart met
 * uitlopende kolomlijnen in een witte sectie. Precies één per pagina; de kop is een
 * vraagkop met het accent aan het slot.
 */
export function ServiceCta({
  id,
  title,
  accent,
  subtitle,
  ctas,
  note,
  link,
  className,
}: {
  id?: string;
  title: string;
  accent?: string;
  subtitle?: string;
  ctas: CtaLink[];
  note?: string;
  link?: { label: string; href: string };
  className?: string;
}) {
  return (
    <section id={id} className={cn("section-tight scroll-mt-24", className)}>
      <div className="container">
        <ColumnLines
          columnWidth={56}
          columnCount={40}
          radialFadeStart={0}
          radialFadeEnd={62}
          className="surface-brand rounded-2xl p-6 [--cl-at:100%_0%] sm:p-8 md:p-12 lg:p-14"
        >
          <div className="max-w-2xl">
            <h2 className="text-h2">
              {title} {accent && <span className="accent-text">{accent}</span>}
            </h2>
            {subtitle && <p className="mt-4 text-lead text-muted-foreground">{subtitle}</p>}
          </div>
          <CtaLinks ctas={ctas} className="mt-8" />
          {note && <p className="mt-4 text-sm text-muted-foreground">{note}</p>}
          {link && (
            <p className="mt-3">
              {/* Inline, zodat de pijl bij het laatste woord blijft als de link op een telefoon over twee regels loopt. */}
              <Link
                href={link.href}
                className="inline-block py-2.5 font-medium text-foreground underline underline-offset-4 decoration-border-strong hover:decoration-current"
              >
                {link.label}
                {" "}
                <ArrowRight className="inline size-4 align-[-0.125em]" aria-hidden="true" />
              </Link>
            </p>
          )}
        </ColumnLines>
      </div>
    </section>
  );
}
