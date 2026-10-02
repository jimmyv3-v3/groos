import type { LucideIcon } from "lucide-react";

/**
 * Tekst van één dienstpagina in één taal. De veldnamen zijn gelijk aan de
 * CONTENT-blokken van de J. Versseput-dienstpagina's, zodat die als voorbeeld
 * van toon, lengte en opbouw kunnen dienen.
 */
export type ServiceCopy = {
  /** H1 en metatitel. */
  title: string;
  /** 140 tot 160 tekens: dienst, doelgroep, regio en een uitnodiging. */
  metaDescription: string;
  /** Hero-intro: twee tot drie zinnen. */
  lead: string;
  /** Optioneel beeld naast de hero-tekst. */
  imageAlt?: string;
  whatTitle: string;
  whatAccent: string;
  whatIntro: string;
  /** Vier tot zes punten: wat er bij de dienst inbegrepen is. */
  included: string[];
  /** Optioneel extra blok, bijvoorbeeld een nabehandeling of specialisme. */
  extra?: { title: string; accent?: string; intro: string; items: string[] };
  /** Optionele werkwijze specifiek voor deze dienst (ServiceSteps). */
  steps?: {
    heading: string;
    accent?: string;
    intro?: string;
    items: { title: string; description: string }[];
  };
  urgencyTitle: string;
  urgencyAccent: string;
  urgencyIntro: string;
  /** Precies drie, gekoppeld aan `stakeIcons`. */
  stakes: { title: string; body: string }[];
  ctaTitle: string;
  ctaSubtitle: string;
  featureHeading: string;
  featureAccent: string;
  /** Precies vier, gekoppeld aan `featureIcons`. */
  features: { title: string; body: string }[];
  /** Vijf tot zes vragen; worden ook als FAQPage-JSON-LD uitgegeven. */
  faqs: { q: string; a: string }[];
  jsonLdServiceType: string;
  jsonLdDescription: string;
};

export type ServicePage = {
  /** Iconen voor de "uitstel kost"-kaarten, in de volgorde van `stakes`. */
  stakeIcons: LucideIcon[];
  /** Iconen voor de "waarom wij"-kaarten, in de volgorde van `features`. */
  featureIcons: LucideIcon[];
  /** Iconen voor `steps.items` (optioneel, zelfde volgorde). */
  stepIcons?: LucideIcon[];
  /** Optionele heroafbeelding uit /public. */
  image?: string;
  nl: ServiceCopy;
  /** Engelse versie. Ontbreekt die, dan valt de pagina terug op Nederlands. */
  en?: ServiceCopy;
};
