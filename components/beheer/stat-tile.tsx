import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { BadgeTone } from "@/app/beheer/_lib/types";
import { cn } from "@/lib/utils";

const ACCENT: Record<BadgeTone, string> = {
  neutral: "bg-border-strong",
  brand: "bg-brand",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
};

/** Tegel met label en getal; de hele tegel is een link (geen grafiek, geen trend). */
export function StatTile({ label, value, href, tone = "neutral" }: { label: string; value: number; href: string; tone?: BadgeTone }) {
  return (
    <Link
      href={href}
      className="group relative grid min-h-24 gap-1 overflow-hidden rounded-2xl border border-border bg-card p-4 transition-[border-color,box-shadow] duration-150 hover:border-brand/40 hover:shadow-md motion-reduce:transition-none"
    >
      <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 w-1", value > 0 ? ACCENT[tone] : "bg-border")} />
      <span className="flex items-start justify-between gap-2 text-sm text-muted-foreground">
        {label}
        <ChevronRight className="size-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
      </span>
      <span className="font-display text-[2rem] leading-none font-semibold tabular-nums text-foreground">{value}</span>
    </Link>
  );
}
