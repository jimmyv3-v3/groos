"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

const EASE = [0.22, 1, 0.36, 1] as const;
const INTERVAL = 2200;

/**
 * Service rotator with a fixed lead-in and a clean vertical "departure board"
 * roll for the service options. The slot is locked to the width of the widest
 * word so the line never jumps, the word is always fully legible (it rolls in
 * as the previous rolls out, no empty frame), and the whole thing degrades to
 * a static list under reduced-motion. A full sentence is exposed to screen
 * readers.
 */
export function ServiceTicker() {
  const t = useTranslations("home.ticker");
  const words = t.raw("words") as string[];
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const measureRef = useRef<HTMLDivElement>(null);

  // Animate the slot to the width of the CURRENT word, so it stays snug to the
  // lead-in and the line re-centres smoothly without ever jumping.
  useEffect(() => {
    const measure = () => {
      const el = measureRef.current?.children[index] as HTMLElement | undefined;
      if (el) setWidth(Math.ceil(el.getBoundingClientRect().width));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [index]);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      INTERVAL,
    );
    return () => window.clearInterval(id);
  }, [reduce, words.length]);

  return (
    <section
      aria-label={t("ariaLabel")}
      className="relative overflow-hidden border-y border-border/60 bg-card/20 py-20 sm:py-28"
    >
      {/* Ambient: faint grid + soft central glow */}
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 opacity-30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-[42rem] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--brand)/0.10),transparent_70%)]"
      />

      <div className="container relative flex flex-col items-center text-center">
        <p className="sr-only">
          {t("srSentence", { words: words.join(", ") })}
        </p>

        <p
          aria-hidden="true"
          className="flex flex-col items-center justify-center gap-2 font-display text-2xl font-light leading-tight tracking-tight sm:flex-row sm:gap-x-3 sm:text-4xl lg:text-5xl"
        >
          <span className="text-muted-foreground">{t("lead")}</span>
          <motion.span
            className="relative inline-flex h-[1.3em] items-center justify-center overflow-hidden align-middle"
            animate={{ width }}
            transition={{ type: "spring", stiffness: 200, damping: 26, mass: 1 }}
          >
            <AnimatePresence initial={false}>
              <motion.span
                key={index}
                className="absolute inset-0 flex items-center justify-center whitespace-nowrap accent-text font-normal"
                initial={reduce ? { opacity: 0 } : { y: "115%" }}
                animate={reduce ? { opacity: 1 } : { y: "0%" }}
                exit={reduce ? { opacity: 0 } : { y: "-115%" }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                {words[index]}
              </motion.span>
            </AnimatePresence>
          </motion.span>
        </p>

        <a
          href="#diensten"
          className="group mt-9 inline-flex items-center gap-2 text-sm tracking-wide text-muted-foreground transition-colors hover:text-brand-strong"
        >
          {t("viewAll")}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </a>
      </div>

      {/* Hidden measurer: same typography as the visible word */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="invisible pointer-events-none absolute left-0 top-0 -z-10 font-display text-2xl font-normal sm:text-4xl lg:text-5xl"
      >
        {words.map((w) => (
          <span key={w} className="inline-block whitespace-nowrap">
            {w}
          </span>
        ))}
      </div>
    </section>
  );
}
