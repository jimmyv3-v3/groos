"use client";

import { MessageCircle, Phone } from "lucide-react";
import { track } from "@vercel/analytics";
import { CtaButton } from "@/components/ui/cta-button";
import type { OccupationSlug } from "@/lib/data/options";
import type { FormId } from "@/lib/validation/shared";

type TrackedContactLinkProps = {
  href: string;
  label: string;
  /** Begint met het zichtbare label (B-54); de WhatsApp-knop heeft er geen. */
  ariaLabel?: string;
  kind: "call" | "whatsapp";
  form: FormId;
  beroep?: OccupationSlug;
  vacature?: number;
  external?: boolean;
  /** Tekst voor schermlezers bij een link die in een nieuw venster opent. */
  newTabLabel?: string;
  className?: string;
};

/** Bel- of WhatsApp-knop die call_click of whatsapp_click meet (spec 07 §4.5, §5.9). */
export function TrackedContactLink({
  href,
  label,
  ariaLabel,
  kind,
  form,
  beroep,
  vacature,
  external,
  newTabLabel,
  className,
}: TrackedContactLinkProps) {
  const Icon = kind === "call" ? Phone : MessageCircle;
  return (
    <CtaButton
      variant="secondary"
      href={href}
      ariaLabel={ariaLabel}
      external={external}
      newTabLabel={newTabLabel}
      className={className}
      onClick={() => {
        try {
          const props: Record<string, string | number> = { form };
          if (beroep) props.beroep = beroep;
          if (vacature !== undefined) props.vacature = vacature;
          track(kind === "call" ? "call_click" : "whatsapp_click", props);
        } catch {
          // Analytics mag de link nooit raken.
        }
      }}
    >
      <Icon aria-hidden="true" />
      {label}
    </CtaButton>
  );
}
