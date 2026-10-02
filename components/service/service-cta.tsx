import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { CtaLinks } from "./cta-links";
import type { CtaLink } from "./types";

/**
 * Afsluitende band (spec 05 §4.4.1, recept spec 02 §4.13): een blauw vlak met
 * het oo-patroon in een witte sectie. Precies één per pagina; de kop is een
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
        <div className="surface-brand pattern-oo rounded-2xl p-8 md:p-12 lg:p-14">
          <div className="max-w-2xl">
            <h2 className="text-h2">
              {title} {accent && <span className="accent-text">{accent}</span>}
            </h2>
            {subtitle && <p className="mt-4 text-lead text-muted-foreground">{subtitle}</p>}
          </div>
          <CtaLinks ctas={ctas} className="mt-8" />
          {note && <p className="mt-4 text-sm text-muted-foreground">{note}</p>}
          {link && (
            <p className="mt-5">
              <Link
                href={link.href}
                className="inline-flex min-h-11 items-center gap-2 font-medium text-foreground underline underline-offset-4 decoration-border-strong hover:decoration-current"
              >
                {link.label}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
