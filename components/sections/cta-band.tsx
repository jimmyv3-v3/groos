import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { CtaButton } from "@/components/ui/cta-button";

export type CtaBandAction = {
  /** "/…" wordt Link; tel:, mailto: en https: worden <a>. */
  href: string;
  label: string;
  variant: "primary" | "secondary";
  /** Gerenderd element, bijvoorbeeld <Phone aria-hidden />. */
  icon?: ReactNode;
  ariaLabel?: string;
  external?: boolean;
};

export type CtaBandProps = {
  /** Sectieanker. */
  id?: string;
  headingId: string;
  title: string;
  accent?: string;
  /** De aanroeper levert t.rich(...). */
  body: ReactNode;
  /** 1 tot 3 knoppen. */
  actions: CtaBandAction[];
  className?: string;
};

/**
 * Blauwe afsluiter (spec 04 §4.3.8, recept spec 02 §4.13): één .surface-brand
 * per pagina, met kop, één zin met het nummer en hoogstens drie knoppen.
 * Binnen het vlak worden de tokens omgezet, dus primary is wit met kobalt tekst.
 */
export function CtaBand({ id, headingId, title, accent, body, actions, className }: CtaBandProps) {
  return (
    <section id={id} aria-labelledby={headingId} className={cn("section-tight", className)}>
      <div className="container">
        <Reveal className="surface-brand pattern-oo rounded-2xl p-8 md:p-12">
          <h2 id={headingId} className="max-w-[22ch] text-h2">
            {title} {accent && <span className="accent-text">{accent}</span>}
          </h2>
          <p className="mt-4 max-w-[60ch] text-lead text-muted-foreground">{body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {actions.slice(0, 3).map((action) => (
              <CtaButton
                key={`${action.href}-${action.label}`}
                href={action.href}
                variant={action.variant}
                ariaLabel={action.ariaLabel}
                external={action.external}
                className="w-full sm:w-auto"
              >
                {action.icon}
                {action.label}
              </CtaButton>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
