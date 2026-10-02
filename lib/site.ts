import type { LucideIcon } from "lucide-react";
import { ArrowRight, ClipboardList, Scale, UserPlus } from "lucide-react";
import type { Perspectief } from "@/content/beroepen";
import { ROUTES, type StaticPath } from "@/lib/routes";

/**
 * Centrale bedrijfsconfiguratie (vorm: spec 01 §5.1). Alles wat geen
 * vertaalbare tekst is: site en vindbaarheid, NAW, contactpersonen, navigatie,
 * footerkolommen en juridische links. Tekst staat in messages/<locale>/*.json,
 * lange paginatekst in content/. Onbevestigde gegevens dragen een TODO;
 * `npm run check` somt ze op.
 */

/* Site en vindbaarheid ----------------------------------------------------- */

export type AreaServed = { "@type": "City" | "AdministrativeArea"; name: string };
export type Site = {
  url: `https://${string}`;
  logo: `/${string}`;
  schemaType: "EmploymentAgency";
  region: string;
  areaServed: readonly AreaServed[];
};

export const site = {
  url: "https://www.groospersoneelsdiensten.nl", // TODO bevestigen door Jimmy (B-02)
  logo: "/brand/logo.png", // PNG van minimaal 512 bij 512 (spec 02)
  schemaType: "EmploymentAgency",
  region: "Haaglanden",
  areaServed: [
    { "@type": "City", name: "Den Haag" },
    { "@type": "AdministrativeArea", name: "Haaglanden" },
  ],
} as const satisfies Site;

/* Contact (NAW volgens B-23, hoofdnummer B-21, e-mail B-02) --------------- */

export type Phone = { display: string; e164: `+31${string}` };
export type OpeningHours = {
  days: "ma-vr";
  opens: `${number}:${number}`;
  closes: `${number}:${number}`;
};

const HOOFDNUMMER: Phone = { display: "06 83 35 19 85", e164: "+31683351985" };
const EMAIL = "info@groospersoneelsdiensten.nl"; // TODO bevestigen door Jimmy (B-02)

export const contact = {
  /** Statutaire naam zoals bij de KvK. */
  name: "Groos Personeelsdiensten B.V.",
  /** Merknaam voor logo, titels en OG-afbeelding. */
  shortName: "Groos Personeelsdiensten",
  phone: HOOFDNUMMER.display,
  phoneE164: HOOFDNUMMER.e164,
  phoneHref: `tel:${HOOFDNUMMER.e164}`,
  whatsapp: HOOFDNUMMER.display,
  /** Zonder vooringevulde tekst; tekst gaat via whatsappLink(text) uit messages. */
  whatsappHref: `https://wa.me/${HOOFDNUMMER.e164.slice(1)}`,
  email: EMAIL,
  emailHref: `mailto:${EMAIL}`,
  street: "Hugo Coenraadspad 6",
  postalCode: "2553 ER", // TODO postcode bevestigen door Jimmy (B-23)
  city: "Den Haag",
  country: "NL",
  visitByAppointment: true,
  kvk: undefined as string | undefined, // TODO KvK-nummer (Jimmy)
  btw: undefined as string | undefined, // TODO btw-nummer (Jimmy)
  openingHours: undefined as OpeningHours | undefined, // TODO kantoortijden bevestigen (B-22)
} as const;

/** WhatsApp-link met optionele vooringevulde tekst uit messages (common.whatsapp.*). */
export function whatsappLink(text?: string, phone: Phone = HOOFDNUMMER): string {
  const base = `https://wa.me/${phone.e164.slice(1)}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/* Personen (rol als tekst in messages common.people.<id>.role) ------------- */

export type PersonId = "jimmy" | "lorenzo";
export type Person = {
  id: PersonId;
  firstName: string;
  phone: Phone;
  whatsapp: boolean;
  photo?: `/${string}`;
};

export const people = [
  { id: "jimmy", firstName: "Jimmy", phone: { display: "06 83 35 19 85", e164: "+31683351985" }, whatsapp: true },
  // TODO bevestigen of Lorenzo WhatsApp op dit nummer gebruikt
  { id: "lorenzo", firstName: "Lorenzo", phone: { display: "06 52 54 95 39", e164: "+31652549539" }, whatsapp: false },
] as const satisfies readonly Person[];

export function getPerson(id: PersonId): Person {
  const person = people.find((p) => p.id === id);
  if (!person) throw new Error(`Onbekende contactpersoon: ${id}`);
  return person;
}

/* Navigatie (labels in messages header.nav.<key>) ---------------------------- */

export type NavKey = "vacatures" | "werkzoekenden" | "werkgevers" | "overOns" | "contact";
export type NavLinkKey = "inschrijven" | "alleWerkzoekenden" | "personeelAanvragen" | "wtta" | "alleWerkgevers";
export type NavChild =
  | { kind: "beroepen"; perspectief: Perspectief }
  | { kind: "link"; key: NavLinkKey; href: StaticPath; icon: LucideIcon; emphasis?: boolean };
export type NavItem = { key: NavKey; href: StaticPath; children?: readonly NavChild[] };

export const nav = [
  { key: "vacatures", href: ROUTES.vacatures },
  {
    key: "werkzoekenden",
    href: ROUTES.werkzoekenden,
    children: [
      { kind: "beroepen", perspectief: "werkzoekende" },
      { kind: "link", key: "inschrijven", href: ROUTES.inschrijven, icon: UserPlus, emphasis: true },
      { kind: "link", key: "alleWerkzoekenden", href: ROUTES.werkzoekenden, icon: ArrowRight },
    ],
  },
  {
    key: "werkgevers",
    href: ROUTES.werkgevers,
    children: [
      { kind: "beroepen", perspectief: "werkgever" },
      { kind: "link", key: "personeelAanvragen", href: ROUTES.personeelAanvragen, icon: ClipboardList, emphasis: true },
      { kind: "link", key: "wtta", href: ROUTES.wtta, icon: Scale },
      { kind: "link", key: "alleWerkgevers", href: ROUTES.werkgevers, icon: ArrowRight },
    ],
  },
  { key: "overOns", href: ROUTES.overOns },
  { key: "contact", href: ROUTES.contact },
] as const satisfies readonly NavItem[];

/* Footer (kolomkoppen in messages footer.columns.<key>) ---------------------- */

export type FooterColumnKey = "werkzoekenden" | "werkgevers" | "groos";
export type FooterLink =
  | { kind: "beroepen"; perspectief: Perspectief }
  | { kind: "route"; key: NavKey | NavLinkKey; href: StaticPath };

export const footerColumns = [
  {
    key: "werkzoekenden",
    links: [
      { kind: "route", key: "vacatures", href: ROUTES.vacatures },
      { kind: "beroepen", perspectief: "werkzoekende" },
      { kind: "route", key: "inschrijven", href: ROUTES.inschrijven },
      { kind: "route", key: "alleWerkzoekenden", href: ROUTES.werkzoekenden },
    ],
  },
  {
    key: "werkgevers",
    links: [
      { kind: "beroepen", perspectief: "werkgever" },
      { kind: "route", key: "personeelAanvragen", href: ROUTES.personeelAanvragen },
      { kind: "route", key: "wtta", href: ROUTES.wtta },
      { kind: "route", key: "alleWerkgevers", href: ROUTES.werkgevers },
    ],
  },
  {
    key: "groos",
    links: [
      { kind: "route", key: "overOns", href: ROUTES.overOns },
      { kind: "route", key: "contact", href: ROUTES.contact },
    ],
  },
] as const satisfies readonly { key: FooterColumnKey; links: readonly FooterLink[] }[];

/**
 * Juridische links. De sleutel is het document-id van spec 09 (`LegalDocId`),
 * het label komt uit messages `legal.nav.<key>`. Alleen routes met
 * `routeMeta(path).published` verschijnen.
 */
export type LegalLinkKey = "privacy" | "cookies" | "complaints" | "terms";
export const legalLinks = [
  { key: "privacy", href: ROUTES.privacyverklaring },
  { key: "cookies", href: ROUTES.cookieverklaring },
  { key: "complaints", href: ROUTES.klachtenregeling },
  { key: "terms", href: ROUTES.algemeneVoorwaarden },
] as const satisfies readonly { key: LegalLinkKey; href: StaticPath }[];

/* Socials: alleen ingevulde kanalen verschijnen in footer en sameAs --------- */

export type Social = { platform: "linkedin" | "instagram" | "facebook"; href: `https://${string}` };
export const socials: readonly Social[] = [];
