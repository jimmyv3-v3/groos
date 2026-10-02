import type { LucideIcon } from "lucide-react";
import {
  Award,
  Building2,
  CalendarRange,
  ClipboardCheck,
  FileCheck2,
  HardHat,
  Home,
  KeyRound,
  Landmark,
  Leaf,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

/**
 * Centrale bedrijfsconfiguratie. Alles wat per bedrijf verschilt en géén
 * vertaalbare tekst is, staat hier: NAW, contactkanalen, socials, navigatie en
 * de iconen, cijfers en afbeeldingen per homepage-sectie. Vertaalbare tekst
 * staat in messages/<locale>.json, lange paginacontent in content/.
 *
 * Placeholders herken je aan TODO, example.nl of 00000000. `npm run check`
 * somt ze op en moet vóór livegang schoon zijn.
 */

export const site = {
  /** Productiedomein inclusief www, zonder slash aan het eind. */
  url: "https://www.example.nl", // TODO: definitieve domeinnaam
  /** Logo voor de Organization-JSON-LD (vierkant PNG, minimaal 512×512). */
  logo: "/brand/logo.png", // TODO: bestand toevoegen in public/brand
  /**
   * Schema.org-type voor de bedrijfs-JSON-LD. Kies het meest specifieke type dat
   * past, bijvoorbeeld "HomeAndConstructionBusiness", "ProfessionalService",
   * "RoofingContractor" of "Store". "LocalBusiness" is altijd geldig.
   */
  schemaType: "LocalBusiness", // TODO: specifieker type kiezen
  /** Plaatsen of regio's voor `areaServed` in de JSON-LD. */
  areaServed: ["TODO Plaats", "Nederland"],
} as const;

const PHONE_DISPLAY = "+31 6 00000000"; // TODO: telefoonnummer zoals getoond
const PHONE_E164 = "+31600000000"; // TODO: zelfde nummer, internationaal zonder spaties
const EMAIL = "info@example.nl"; // TODO: e-mailadres voor aanvragen

export const contact = {
  /** Statutaire naam zoals bij de KvK. */
  name: "TODO Bedrijfsnaam B.V.",
  /** Merknaam voor logo, titels en OG-afbeelding. */
  shortName: "TODO Bedrijfsnaam",
  phone: PHONE_DISPLAY,
  phoneHref: `tel:${PHONE_E164}`,
  whatsapp: PHONE_DISPLAY,
  whatsappHref:
    `https://wa.me/${PHONE_E164.replace("+", "")}?text=` +
    encodeURIComponent(
      "Hallo, ik wil graag een vrijblijvende offerte aanvragen voor ",
    ),
  email: EMAIL,
  emailHref: `mailto:${EMAIL}`,
  kvk: "00000000", // TODO
  btw: undefined as string | undefined, // TODO: btw-nummer, verschijnt dan in de footer
  street: undefined as string | undefined, // TODO: straat + huisnummer (optioneel tonen)
  postalCode: undefined as string | undefined,
  city: "TODO Plaats",
} as const;

export type Social = {
  platform: "linkedin" | "instagram" | "facebook";
  href: string;
};

/** Alleen ingevulde kanalen verschijnen in de footer en in de JSON-LD (`sameAs`). */
export const socials: Social[] = [
  // { platform: "linkedin", href: "https://www.linkedin.com/company/..." },
  // { platform: "instagram", href: "https://www.instagram.com/..." },
];

// Ankers beginnen met "/" zodat de navigatie ook vanaf subpagina's werkt (eerst
// naar home, dan naar de sectie). `key` verwijst naar messages onder
// "common.nav". De eerste entry (Diensten) rendert de header als uitklapmenu.
export const nav = [
  { key: "services", href: "/#diensten" },
  { key: "method", href: "/#werkwijze" },
  { key: "projects", href: "/#projecten" },
  { key: "about", href: "/#over-ons" },
  { key: "contact", href: "/#contact" },
] as const;

/**
 * Cijferband. `value` is numeriek zodat hij kan optellen. Labels staan in
 * messages `home.metricLabels`, in dezelfde volgorde.
 */
export type Metric = { value: number; prefix?: string; suffix?: string };

export const metrics: Metric[] = [
  { value: 10, suffix: "+" }, // TODO: echte, verdedigbare cijfers
  { value: 100, suffix: "+" },
  { value: 5 },
];

/** Iconen van de TrustBar. Tekst in messages `home.trustBar.items` (zelfde volgorde). */
export const usps: { icon: LucideIcon }[] = [
  { icon: Award },
  { icon: ShieldCheck },
  { icon: Sparkles },
  { icon: MapPin },
];

/**
 * Doelgroepen voor de beeldaccordion in de hero (desktop) en de kaarten onder
 * de logo's (mobiel). Titel en blurb in messages `home.segments.<id>`. Zonder
 * `image` valt de kaart terug op een kleurverloop.
 */
export type Segment = {
  id: string;
  icon: LucideIcon;
  image?: string;
  /** CSS object-position voor de uitsnede (standaard "center"). */
  focus?: string;
};

export const segments: Segment[] = [
  { id: "doelgroep-1", icon: Building2 }, // TODO: foto in /public/segments
  { id: "doelgroep-2", icon: KeyRound },
  { id: "doelgroep-3", icon: Landmark },
  { id: "doelgroep-4", icon: Home },
];

/** Werkwijze-stappen. Tekst in messages `home.process.steps` (zelfde volgorde). */
export const steps: { n: string; icon: LucideIcon }[] = [
  { n: "01", icon: ClipboardCheck },
  { n: "02", icon: CalendarRange },
  { n: "03", icon: HardHat },
  { n: "04", icon: FileCheck2 },
];

/** Kwaliteitsbeloftes. Tekst in messages `home.assurance.items` (zelfde volgorde). */
export const assurances: { icon: LucideIcon }[] = [
  { icon: ShieldCheck },
  { icon: HardHat },
  { icon: Users },
  { icon: Leaf },
];

/** Keurmerk in de kwaliteitssectie. Zonder `src` toont de sectie een icoon. */
export const certification: { src?: string } = {
  // src: "/certifications/keurmerk.png", // TODO: alleen een écht behaald keurmerk
};

/**
 * Opdrachtgevers in de logoband. Zonder `src` verschijnt de naam als tekst.
 * Toon alleen klanten die daar toestemming voor hebben gegeven.
 */
export type Client = { name: string; src?: string };

export const clients: Client[] = [
  { name: "TODO Klant 1" },
  { name: "TODO Klant 2" },
  { name: "TODO Klant 3" },
  { name: "TODO Klant 4" },
  { name: "TODO Klant 5" },
];

/**
 * Projectgalerij. `altKey` verwijst naar messages `home.projects.<altKey>`.
 * Zonder `src` toont de tegel een placeholder. Foto's in /public/projects.
 */
export type ProjectPhoto = { src?: string; altKey: string };

export const projectPhotos: ProjectPhoto[] = [
  { altKey: "altDefault" }, // TODO: echte projectfoto's
  { altKey: "altDefault" },
  { altKey: "altDefault" },
  { altKey: "altDefault" },
  { altKey: "altDefault" },
  { altKey: "altDefault" },
  { altKey: "altDefault" },
  { altKey: "altDefault" },
];
