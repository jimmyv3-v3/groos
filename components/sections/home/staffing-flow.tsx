import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { CalendarCheck, ClipboardList, FileText, MessageCircle, Phone, UserCheck, Wallet } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { beroepen } from "@/content/beroepen";
import { LogoMark } from "@/components/brand/logo-mark";
import { cn } from "@/lib/utils";

/**
 * Visual naast de vacaturesectie op de homepage: aanvragen komen bovenaan
 * binnen, Groos regelt in het midden selectie, contract, planning en loon, en
 * onderaan staan de beroepen, vijf per rij. De eerste rij hangt direct onder
 * de verdeellijn; de lijnen naar een volgende rij lopen langs de buitenrand om
 * de rij erboven heen, zodat ze geen icoon of label kruisen. Eén afbeelding voor hulptechnologie
 * (role="img"); de animatie is CSS zonder JavaScript (zie .flow-* in
 * app/globals.css) en staat stil bij reduced motion.
 */

const W = 564;
const HUB = { x: 282, y: 200 };
const R = 12;
const PER_ROW = 5;
const ROW_X = 62;
const ROW_STEP = 110;
const ROW_Y = 338;
const ROW_GAP = 140;
/** Verdeellijn boven de eerste rij en de afstand van elke volgende verdeellijn tot haar rij. */
const BUS_Y = 285;
const BUS_ABOVE = 44;
/** Buitenranden waarlangs de lijnen naar een volgende rij lopen. */
const EDGE = { left: 5, right: W - 5 };
/** Ruimte onder de laatste rij voor het label. */
const FOOT = 82;

type Node = { key: string; icon: LucideIcon; label: string; x: number; y: number; path: string; labelAbove?: boolean };

/** Van boven naar de hub: omlaag, met afgeronde hoeken naar het midden. */
function inboundPath(x: number, y: number): string {
  if (x === HUB.x) return `M ${x} ${y} V ${HUB.y}`;
  const dir = x < HUB.x ? 1 : -1;
  const busY = 130;
  return `M ${x} ${y} V ${busY - R} Q ${x} ${busY} ${x + dir * R} ${busY} H ${HUB.x - dir * R} Q ${HUB.x} ${busY} ${HUB.x} ${busY + R} V ${HUB.y}`;
}

/** Van de hub naar onder: via een verdeellijn naar elk beroep in de eerste rij. */
function outboundPath(x: number, y: number): string {
  if (x === HUB.x) return `M ${HUB.x} ${HUB.y} V ${y}`;
  const dir = x < HUB.x ? -1 : 1;
  return `M ${HUB.x} ${HUB.y} V ${BUS_Y - R} Q ${HUB.x} ${BUS_Y} ${HUB.x + dir * R} ${BUS_Y} H ${x - dir * R} Q ${x} ${BUS_Y} ${x} ${BUS_Y + R} V ${y}`;
}

/**
 * Van de hub naar een beroep in een volgende rij: over de eerste verdeellijn
 * naar de buitenrand, daarlangs omlaag en over een eigen verdeellijn naar het
 * beroep. De linkerhelft en het midden gaan linksom, de rechterhelft rechtsom.
 */
function outboundPathAround(x: number, y: number): string {
  const left = x <= HUB.x;
  const dir = left ? -1 : 1;
  const edge = left ? EDGE.left : EDGE.right;
  const busY = y - BUS_ABOVE;
  return [
    `M ${HUB.x} ${HUB.y} V ${BUS_Y - R} Q ${HUB.x} ${BUS_Y} ${HUB.x + dir * R} ${BUS_Y}`,
    `H ${edge - dir * R} Q ${edge} ${BUS_Y} ${edge} ${BUS_Y + R}`,
    `V ${busY - R} Q ${edge} ${busY} ${edge - dir * R} ${busY}`,
    `H ${x + dir * R} Q ${x} ${busY} ${x} ${busY + R} V ${y}`,
  ].join(" ");
}

function percent(value: number, total: number): string {
  return `${(value / total) * 100}%`;
}

/** Plek van beroep `index` in het raster onder de hub, met de rij erbij. */
function occupationPosition(index: number): { x: number; y: number; row: number } {
  const row = Math.floor(index / PER_ROW);
  return { x: ROW_X + (index % PER_ROW) * ROW_STEP, y: ROW_Y + row * ROW_GAP, row };
}

export async function StaffingFlow({ locale, className }: { locale: Locale; className?: string }) {
  const [t, tb] = await Promise.all([
    getTranslations({ locale, namespace: "home.vacatures.visual" }),
    getTranslations({ locale, namespace: "beroepen" }),
  ]);

  const channels: Node[] = [
    { key: "phone", icon: Phone, x: 112 },
    { key: "form", icon: ClipboardList, x: 282 },
    { key: "whatsapp", icon: MessageCircle, x: 452 },
  ].map((c) => ({
    ...c,
    y: 66,
    label: t(`channels.${c.key as "phone" | "form" | "whatsapp"}`),
    path: inboundPath(c.x, 66),
    labelAbove: true,
  }));

  const steps: Node[] = [
    { key: "contract", icon: FileText, x: 60 },
    { key: "selection", icon: UserCheck, x: 164 },
    { key: "planning", icon: CalendarCheck, x: 400 },
    { key: "payroll", icon: Wallet, x: 504 },
  ].map((s) => ({
    ...s,
    y: HUB.y,
    label: t(`steps.${s.key as "contract" | "selection" | "planning" | "payroll"}`),
    path: `M ${HUB.x} ${HUB.y} H ${s.x}`,
  }));

  const rows = Math.ceil(beroepen.length / PER_ROW);
  const H = ROW_Y + (rows - 1) * ROW_GAP + FOOT;
  const occupations: Node[] = beroepen.map((b, i) => {
    const { x, y, row } = occupationPosition(i);
    const path = row === 0 ? outboundPath(x, y) : outboundPathAround(x, y);
    return { key: b.id, icon: b.icon, x, y, label: tb(`${b.id}.meervoud`), path };
  });

  const nodes = [...channels, ...steps, ...occupations];

  return (
    <div
      role="img"
      aria-label={t("label")}
      className={cn("flow-canvas overflow-hidden rounded-2xl border border-border bg-card p-3 sm:p-5", className)}
    >
      <div aria-hidden="true" className="@container relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} fill="none" className="pointer-events-none absolute inset-0 size-full">
          {nodes.map((n, i) => (
            <g key={n.key}>
              <path d={n.path} className="stroke-border-strong" strokeWidth="1" />
              <path
                d={n.path}
                pathLength={100}
                className="flow-dash stroke-brand"
                strokeWidth="2"
                strokeLinecap="round"
                style={{ animationDelay: `${-((i * 0.7) % 4)}s` } as CSSProperties}
              />
            </g>
          ))}
        </svg>

        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-1 shadow-md sm:rounded-2xl sm:p-2 sm:shadow-lg"
          style={{ left: percent(HUB.x, W), top: percent(HUB.y, H) }}
        >
          <LogoMark variant="tile" decorative className="size-8 sm:size-16" />
          <span className="flow-pulse absolute inset-0 rounded-xl border-2 border-brand sm:rounded-2xl" />
        </div>

        {nodes.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.key}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: percent(n.x, W), top: percent(n.y, H) }}
            >
              <span className="grid size-8 place-items-center rounded-lg border border-border bg-card text-brand shadow-sm sm:size-12 sm:rounded-xl">
                <Icon className="size-4 sm:size-5" strokeWidth={2} />
              </span>
              <span
                className={cn(
                  // Breedte en lettergrootte schalen mee met de visual (cqw), zodat labels
                  // naast elkaar passen als de visual smal naast de tekst staat.
                  "absolute left-1/2 hidden -translate-x-1/2 text-center text-[length:clamp(0.59375rem,2.1cqw,0.75rem)] leading-tight font-medium text-balance text-foreground sm:block",
                  n.labelAbove ? "bottom-full mb-1.5 w-[28cqw]" : "top-full mt-1.5 w-[19.3cqw]",
                )}
              >
                {n.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
