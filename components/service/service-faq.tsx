"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/sections/section-heading";

export type FaqItem = { q: string; a: string };

/** Accessible FAQ accordion for a service page. */
export function ServiceFaq({
  items,
  heading,
}: {
  items: FaqItem[];
  heading?: string;
}) {
  const t = useTranslations("service");
  const resolvedHeading = heading ?? t("faqHeading");
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative scroll-mt-24 py-16 sm:py-20">
      <div className="container max-w-3xl">
        <SectionHeading title={resolvedHeading} align="center" />
        <div className="mt-12 border-t border-border/60">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-b border-border/60">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-display text-base font-medium text-foreground">
                    {item.q}
                  </span>
                  {isOpen ? (
                    <Minus className="h-4 w-4 shrink-0 text-brand" />
                  ) : (
                    <Plus className="h-4 w-4 shrink-0 text-brand" />
                  )}
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]",
                  )}
                >
                  <p className="overflow-hidden text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
