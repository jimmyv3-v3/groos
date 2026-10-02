import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/** Gedeelde typen van de bouwstenen in components/service (spec 05 §4.4.1). */

export type CtaLink = {
  label: string;
  /** Intern pad ("/..."), anker ("#...") of extern adres (tel:, https://wa.me/...). */
  href: string;
  /** Standaard "primary". */
  variant?: "primary" | "secondary";
  /** Gerenderd Lucide-element met aria-hidden. */
  icon?: ReactNode;
  /** true: nieuw venster plus common.opensInNewTab. */
  external?: boolean;
  ariaLabel?: string;
};

export type FeatureItem = { icon?: LucideIcon; title: string; body: string };
export type StepItem = { title: string; body: string; icon?: LucideIcon };
export type FaqItem = { q: string; a: string };
export type HeroFact = { label: string; value: string };
