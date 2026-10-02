"use client";

import { Share2 } from "lucide-react";
import { useSyncExternalStore } from "react";
import { CtaButton } from "@/components/ui/cta-button";

type Props = { url: string; title: string; text: string; label: string };

const noop = () => () => {};

/** Systeemdeelknop; rendert alleen als navigator.share bestaat (na hydratatie). */
export function NativeShareButton({ url, title, text, label }: Props) {
  const canShare = useSyncExternalStore(
    noop,
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false,
  );
  if (!canShare) return null;

  async function share() {
    try {
      await navigator.share({ url, title, text });
    } catch {
      // Geannuleerd door de gebruiker; geen melding nodig.
    }
  }

  return (
    <CtaButton variant="secondary" onClick={share}>
      <Share2 aria-hidden="true" />
      {label}
    </CtaButton>
  );
}
