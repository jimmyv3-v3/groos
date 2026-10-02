"use client";

import { useSearchParams } from "next/navigation";

const PATTERNS = {
  S: /^S-\d{4}-\d{4,6}$/,
  P: /^P-\d{4}-\d{4,6}$/,
} as const;

/**
 * Toont de referentie uit ?ref= op de statische bedankpagina (spec 07 §4.10),
 * alleen als de waarde het verwachte patroon heeft. Zoekt nooit een record op.
 */
export function BedanktReference({ template, pattern }: { template: string; pattern: "S" | "P" }) {
  const ref = useSearchParams().get("ref");
  if (!ref || !PATTERNS[pattern].test(ref)) return null;
  const [before, after = ""] = template.split("__REF__");
  return (
    <p className="mt-4 text-lead text-foreground">
      {before}
      <strong className="font-semibold tabular-nums">{ref}</strong>
      {after}
    </p>
  );
}
