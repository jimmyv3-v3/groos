"use client";

import { usePathname } from "@/i18n/navigation";
import { headerCtaFor, type HeaderCtaKey } from "@/lib/routes";
import type { ResolvedLink } from "@/lib/navigation";
import { CtaButton } from "@/components/ui/cta-button";

/** Knop rechts in de header, per doelgroep van het pad (spec 01 §4.4, headerCtaFor). */
export function HeaderCta({ ctas, className }: { ctas: Record<HeaderCtaKey, ResolvedLink>; className?: string }) {
  const pathname = usePathname();
  const cta = ctas[headerCtaFor(pathname)];
  return (
    <CtaButton href={cta.href} size="sm" className={className}>
      {cta.label}
    </CtaButton>
  );
}
