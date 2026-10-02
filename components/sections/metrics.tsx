import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { metrics } from "@/lib/site";
import { CountUp } from "@/components/motion/count-up";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";

export function Metrics() {
  const t = useTranslations("home");
  const labels = t.raw("metricLabels") as string[];
  return (
    <section
      aria-label={t("metricsAriaLabel")}
      className="relative border-y border-border/60 bg-card/20 py-16 sm:py-20"
    >
      {/* Subtle architectural grid */}
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 opacity-[0.4]"
      />

      <div className="container relative">
        <RevealGroup>
          <dl className="grid grid-cols-1 gap-y-10 sm:grid-cols-3">
            {metrics.map((m, i) => (
              <RevealItem key={labels[i]} as="div">
                {/*
                 * flex-col-reverse puts dd (the number) at the top visually
                 * while keeping dt before dd in the DOM for correct semantics.
                 * Hairline dividers appear between columns on lg+; hidden on mobile.
                 */}
                <div
                  className={cn(
                    "flex flex-col-reverse items-center px-4 text-center",
                    i > 0 && "sm:border-l sm:border-border/40",
                  )}
                >
                  <dt className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                    {labels[i]}
                  </dt>
                  <dd className="font-display text-4xl font-light accent-text sm:text-5xl">
                    <CountUp
                      value={m.value}
                      prefix={m.prefix}
                      suffix={m.suffix}
                    />
                  </dd>
                </div>
              </RevealItem>
            ))}
          </dl>
        </RevealGroup>
      </div>
    </section>
  );
}
