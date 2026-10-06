"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { actionBarVariantFor, type ActionBarVariant } from "@/lib/routes";
import type { ActionKey, ResolvedAction } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { CtaButton } from "@/components/ui/cta-button";

/** Linker- en rechteractie per variant (spec 01 §4.6). */
const VARIANTS: Record<ActionBarVariant, [ActionKey, ActionKey]> = {
  werkzoekende: ["call", "whatsappWerkzoekende"],
  vacature: ["call", "solliciteren"],
  werkgever: ["call", "personeelAanvragen"],
  aanvraag: ["call", "whatsappWerkgever"],
  algemeen: ["call", "whatsappAlgemeen"],
};

function isField(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && target.matches("input, textarea, select");
}

/**
 * Vaste actiebalk onder lg. Schuift weg (en wordt inert) zodra een invoerveld
 * focus heeft, zodat hij niet boven het toetsenbord of de verzendknop staat.
 */
export function ActionBar({ ariaLabel, actions }: { ariaLabel: string; actions: Record<ActionKey, ResolvedAction> }) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onIn = (e: FocusEvent) => setHidden(isField(e.target));
    const onOut = (e: FocusEvent) => {
      if (!isField(e.relatedTarget)) setHidden(false);
    };
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  const [left, right] = VARIANTS[actionBarVariantFor(pathname)].map((key) => actions[key]);

  return (
    <nav
      aria-label={ariaLabel}
      inert={hidden || undefined}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background px-[max(1rem,env(safe-area-inset-left),env(safe-area-inset-right))] pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-200 ease-brand motion-reduce:transition-none lg:hidden",
        hidden && "translate-y-full",
      )}
    >
      {/* Gelijke kolommen zolang het past. Past de primaire actie ("Personeel
          aanvragen") niet in de helft, dan krijgt die de breedte van haar label
          en wordt de belknop smaller, zodat het label niet wordt afgekapt. */}
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(max-content,1fr)] gap-3">
        {[left, right].map((action, i) => (
          <CtaButton
            key={i}
            href={action.href}
            variant={i === 0 ? "secondary" : "primary"}
            external={action.external}
            ariaLabel={action.ariaLabel}
            className="min-w-0 gap-1.5 px-2.5 max-[400px]:text-[0.9375rem]"
          >
            <span className={cn("contents", i === 0 ? "[&_svg]:text-brand" : "max-[400px]:hidden")}>{action.icon}</span>
            <span className="truncate">{action.label}</span>
          </CtaButton>
        ))}
      </div>
    </nav>
  );
}
