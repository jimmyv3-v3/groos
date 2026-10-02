"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { segments } from "@/lib/site";

/**
 * Doelgroep-beeldaccordion voor de hero.
 * - Mobiel: de segmenten staan overzichtelijk onder elkaar als volledige
 *   kaarten (geen krappe verticale labels).
 * - Desktop (lg+): interactief horizontaal accordion dat per segment uitklapt
 *   bij hover, focus of klik.
 * Valt terug op een kleurverloop als een foto ontbreekt of niet laadt.
 */
export function SegmentAccordion() {
  const t = useTranslations("home.segments");
  const [active, setActive] = useState(0);
  const [broken, setBroken] = useState<Record<string, boolean>>({});
  const onErr = (id: string) => setBroken((p) => ({ ...p, [id]: true }));

  return (
    <>
      {/* Mobiel: gestapelde kaarten onder elkaar */}
      <div className="flex flex-col gap-3 lg:hidden">
        {segments.map((s) => {
          const Icon = s.icon;
          const title = t(`${s.id}.title`);
          const blurb = t(`${s.id}.blurb`);
          return (
            <div
              key={s.id}
              className="relative h-32 overflow-hidden rounded-lg border border-border/60"
            >
              {!s.image || broken[s.id] ? (
                <div className="absolute inset-0 bg-muted" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.image}
                  alt=""
                  onError={() => onErr(s.id)}
                  style={{ objectPosition: s.focus ?? "center" }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/45 to-background/10" />
              <Icon
                className="absolute left-4 top-4 h-5 w-5 text-brand-strong"
                aria-hidden
              />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="font-display text-base font-medium tracking-tight text-brand-strong">
                  {title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {blurb}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: interactief horizontaal accordion */}
      <div className="hidden h-[460px] gap-2 lg:flex">
        {segments.map((s, i) => {
          const isActive = i === active;
          const Icon = s.icon;
          const title = t(`${s.id}.title`);
          const blurb = t(`${s.id}.blurb`);
          return (
            <button
              key={s.id}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-label={title}
              aria-pressed={isActive}
              className={cn(
                "group relative h-full overflow-hidden rounded-lg border border-border/60 outline-hidden",
                "transition-[flex-grow,flex-basis] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive ? "flex-[1_1_0%]" : "flex-[0_0_4rem]",
              )}
            >
              {!s.image || broken[s.id] ? (
                <div className="absolute inset-0 bg-muted" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.image}
                  alt=""
                  onError={() => onErr(s.id)}
                  style={{ objectPosition: s.focus ?? "center" }}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}

              <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/35 to-background/10" />
              <div
                className={cn(
                  "absolute inset-0 rounded-lg ring-1 transition-all duration-500",
                  isActive ? "ring-brand/40" : "ring-transparent",
                )}
              />

              <Icon
                className={cn(
                  "absolute left-4 top-4 h-5 w-5 transition-colors duration-500",
                  isActive ? "text-brand-strong" : "text-brand/70",
                )}
              />

              {/* Active: horizontaal label + blurb linksonder */}
              <div
                className={cn(
                  "absolute bottom-5 left-5 right-5 text-left transition-all duration-500",
                  isActive
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-2 opacity-0",
                )}
              >
                <p className="font-display text-lg font-medium tracking-tight text-brand-strong">
                  {title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{blurb}</p>
              </div>

              {/* Ingeklapt: verticaal label */}
              <span
                className={cn(
                  "absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-sm font-medium tracking-wide text-brand transition-opacity duration-500 [writing-mode:vertical-rl] rotate-180",
                  isActive ? "opacity-0" : "opacity-100",
                )}
              >
                {title}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
