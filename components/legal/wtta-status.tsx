// STUB: wordt vervangen door spec 09
import { WTTA } from "@/lib/legal";
import { cn } from "@/lib/utils";

/** Tijdelijke WttaStatus tot spec 09 de echte component met legal.wtta.* levert. */
export function WttaStatus({ variant, className }: { variant: "footer" | "block"; className?: string }) {
  if (WTTA.phase === "none") return null;
  return (
    <p className={cn(variant === "block" ? "max-w-3xl text-base" : "text-sm", className)}>
      TODO WttaStatus (spec 09), fase {WTTA.phase}
    </p>
  );
}
