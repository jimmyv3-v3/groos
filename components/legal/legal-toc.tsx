"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type LegalTocItem = { id: string; number: string; label: string };

/**
 * Inhoudsopgave van een juridische pagina (spec 09 §4.3). Zonder JavaScript een
 * gewone ankerlijst; met JavaScript markeert een IntersectionObserver het
 * artikel dat in beeld is met aria-current="location". Alleen kleur wisselt.
 */
export function LegalToc({
  items,
  ariaLabel,
  variant,
}: {
  items: LegalTocItem[];
  ariaLabel: string;
  variant: "inline" | "sidebar";
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0 || typeof IntersectionObserver === "undefined") return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Het eerste artikel in documentvolgorde dat in de bovenste band staat.
        const first = items.find((item) => visible.has(item.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-112px 0px -60% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label={ariaLabel}>
      <ol className="grid border-l border-border">
        {items.map((item) => {
          const current = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "-ml-px flex gap-2 border-l-2 pr-2 pl-4 text-sm leading-snug motion-safe:transition-colors",
                  variant === "inline" ? "min-h-11 items-center py-2" : "py-1",
                  current
                    ? "border-brand font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border-strong hover:text-foreground",
                )}
              >
                <span className="w-5 shrink-0 tabular-nums text-brand">{item.number}</span>
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
