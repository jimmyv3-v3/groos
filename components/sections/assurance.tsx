import type { LucideIcon } from "lucide-react";
import { BadgeCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { assurances, certification } from "@/lib/site";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

/**
 * Kwaliteit en zekerheid. Links een uitgelicht keurmerk (in J. Versseput: VCA),
 * rechts de kop en vier beloftes. Zonder keurmerkbestand toont het vlak een
 * icoon. Toon alleen keurmerken en claims die echt kloppen.
 */
export function Assurance() {
  const t = useTranslations("home");
  const items = t.raw("assurance.items") as { title: string; body: string }[];
  return (
    <section
      id="kwaliteit"
      aria-labelledby="kwaliteit-heading"
      className="relative scroll-mt-24 border-y border-border/60 bg-card/20 py-16 sm:py-20"
    >
      <div className="container relative grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Uitgelicht keurmerk */}
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center">
            <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-2xl border border-border/70 bg-white p-3">
              {certification.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={certification.src}
                  alt={t("assurance.certAlt")}
                  className="h-full w-full object-contain"
                />
              ) : (
                <BadgeCheck className="h-12 w-12 text-brand" aria-hidden />
              )}
            </div>
            <p className="relative mt-6 font-display text-xl font-medium text-brand-strong">
              {t("assurance.certTitle")}
            </p>
            <p className="relative mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("assurance.certBody")}
            </p>
          </div>
        </Reveal>

        {/* Kop en beloftes */}
        <div>
          <Reveal>
            <h2
              id="kwaliteit-heading"
              className="text-h2"
            >
              {t("assurance.heading")}{" "}
              <span className="accent-text">{t("assurance.headingAccent")}</span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              {t("assurance.intro")}
            </p>
          </Reveal>

          <RevealGroup className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {assurances.map((item, i) => {
              const Icon: LucideIcon = item.icon;
              const text = items[i];
              if (!text) return null;
              return (
                <RevealItem key={text.title + i}>
                  <div className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-card/50">
                      <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display text-h3 font-semibold text-foreground">
                        {text.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {text.body}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
