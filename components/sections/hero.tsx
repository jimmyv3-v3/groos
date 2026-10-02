"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Phone, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { contact } from "@/lib/site";
import { CtaButton } from "@/components/ui/cta-button";
import { SegmentAccordion } from "@/components/sections/segment-accordion";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const t = useTranslations();
  const values = t.raw("home.values") as string[];
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.8, ease: EASE, delay },
  });

  return (
    <section
      id="top"
      className="relative flex items-start overflow-hidden lg:min-h-[72svh]"
    >
      <div className="container relative z-10 pt-10 pb-10 sm:pt-14 lg:pb-0">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="max-w-2xl">
          <motion.h1
            {...rise(0.1)}
            className="text-hero"
          >
            {t.rich("home.hero.title", {
              accent: (chunks) => (
                <span className="accent-text">{chunks}</span>
              ),
            })}
          </motion.h1>

          <motion.p
            {...rise(0.25)}
            className="mt-6 max-w-[60ch] text-lead text-muted-foreground"
          >
            {t("home.hero.intro")}
          </motion.p>

          <motion.div
            {...rise(0.4)}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <CtaButton href="/werkgevers/personeel-aanvragen" size="default">
              {t("common.cta.requestStaff")}
              <ArrowRight className="h-4 w-4" />
            </CtaButton>
            <CtaButton href={contact.phoneHref} variant="secondary" size="default">
              <Phone className="h-4 w-4" />
              {t("common.cta.callDirect")}
            </CtaButton>
          </motion.div>

          {/* Brand value strip from the wrap */}
          <motion.ul
            {...rise(0.55)}
            className="mt-12 hidden flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium uppercase tracking-brand text-muted-foreground sm:flex"
          >
            {values.map((v, i) => (
              <li key={v} className="flex items-center gap-5">
                {i > 0 && (
                  <span className="text-brand-subtle/50" aria-hidden>
                    •
                  </span>
                )}
                {v}
              </li>
            ))}
          </motion.ul>
          </div>

          <motion.div {...rise(0.5)} className="hidden w-full lg:block">
            <SegmentAccordion />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
