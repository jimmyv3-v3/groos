import { findBeroepBySlug, getBeroep, type BeroepId, type Perspectief } from "@/content/beroepen";
import type { NavKey } from "@/lib/site"; // alleen een type, dus geen kringafhankelijkheid tijdens runtime

/**
 * Enige bron voor vaste paden, padhelpers, doelgroep per pad en de indeling
 * voor sitemap en llms.txt (spec 01 §5.3). Paden zonder taalprefix; de
 * Engelse variant staat op hetzelfde pad onder /en (B-03). Veilig voor de client.
 */

export const ROUTES = {
  home: "/",
  vacatures: "/vacatures",
  inschrijven: "/inschrijven",
  werkzoekenden: "/werkzoekenden",
  werkgevers: "/werkgevers",
  personeelAanvragen: "/werkgevers/personeel-aanvragen",
  wtta: "/werkgevers/wtta",
  overOns: "/over-ons",
  contact: "/contact",
  privacyverklaring: "/privacyverklaring",
  cookieverklaring: "/cookieverklaring",
  algemeneVoorwaarden: "/algemene-voorwaarden",
  klachtenregeling: "/klachtenregeling",
} as const;
export type StaticPath = (typeof ROUTES)[keyof typeof ROUTES];

export const BEDANKT_SOORTEN = ["sollicitatie", "inschrijving", "aanvraag", "contact"] as const;
export type BedanktSoort = (typeof BEDANKT_SOORTEN)[number];

export function isBedanktSoort(value: string): value is BedanktSoort {
  return (BEDANKT_SOORTEN as readonly string[]).includes(value);
}

export type AppPath =
  | StaticPath
  | `/vacatures/${string}`
  | `/vacatures?${string}`
  | `/werken-als/${string}`
  | `/werkgevers/${string}`
  | `/bedankt/${BedanktSoort}`;

export const paths = {
  vacature: (slug: string): AppPath => `/vacatures/${slug}`,
  vacaturesVoorBeroep: (id: BeroepId): AppPath => `/vacatures?beroep=${id}`,
  werkenAls: (id: BeroepId): AppPath => `/werken-als/${getBeroep(id).slugWerkzoekende}`,
  werkgeverBeroep: (id: BeroepId): AppPath => `/werkgevers/${getBeroep(id).slugWerkgever}`,
  bedankt: (soort: BedanktSoort): AppPath => `/bedankt/${soort}`,
} as const;

export type Audience = "werkzoekende" | "werkgever" | "algemeen";
export type SitemapMeta = { priority: number; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" };
export type RouteMeta = {
  path: StaticPath;
  audience: Audience;
  owner: "04" | "05" | "06" | "07" | "09";
  /** false: noindex, niet gelinkt, niet in sitemap of llms.txt (B-11). */
  published: boolean;
  sitemap: SitemapMeta | null;
  llms: "kern" | "optioneel" | null;
};

export const STATIC_ROUTES: readonly RouteMeta[] = [
  { path: "/", audience: "algemeen", owner: "04", published: true, sitemap: { priority: 1, changeFrequency: "daily" }, llms: "kern" },
  { path: "/vacatures", audience: "werkzoekende", owner: "06", published: true, sitemap: { priority: 0.9, changeFrequency: "daily" }, llms: "kern" },
  { path: "/werkzoekenden", audience: "werkzoekende", owner: "05", published: true, sitemap: { priority: 0.8, changeFrequency: "monthly" }, llms: "kern" },
  { path: "/inschrijven", audience: "werkzoekende", owner: "07", published: true, sitemap: { priority: 0.6, changeFrequency: "yearly" }, llms: "kern" },
  { path: "/werkgevers", audience: "werkgever", owner: "05", published: true, sitemap: { priority: 0.8, changeFrequency: "monthly" }, llms: "kern" },
  { path: "/werkgevers/personeel-aanvragen", audience: "werkgever", owner: "07", published: true, sitemap: { priority: 0.7, changeFrequency: "yearly" }, llms: "kern" },
  { path: "/werkgevers/wtta", audience: "werkgever", owner: "05", published: true, sitemap: { priority: 0.6, changeFrequency: "monthly" }, llms: "kern" },
  { path: "/over-ons", audience: "algemeen", owner: "04", published: true, sitemap: { priority: 0.5, changeFrequency: "yearly" }, llms: "kern" },
  { path: "/contact", audience: "algemeen", owner: "07", published: true, sitemap: { priority: 0.5, changeFrequency: "yearly" }, llms: "kern" },
  { path: "/privacyverklaring", audience: "algemeen", owner: "09", published: true, sitemap: { priority: 0.3, changeFrequency: "yearly" }, llms: "optioneel" },
  { path: "/cookieverklaring", audience: "algemeen", owner: "09", published: true, sitemap: { priority: 0.3, changeFrequency: "yearly" }, llms: "optioneel" },
  { path: "/klachtenregeling", audience: "algemeen", owner: "09", published: true, sitemap: { priority: 0.3, changeFrequency: "yearly" }, llms: "optioneel" },
  // TODO publiceren zodra Jimmy de tekst levert (B-11)
  { path: "/algemene-voorwaarden", audience: "werkgever", owner: "09", published: false, sitemap: { priority: 0.3, changeFrequency: "yearly" }, llms: "optioneel" },
];

/** Sitemapwaarden voor de beroepspagina's (afgeleid uit content/beroepen). */
export const BEROEP_ROUTE_META: Record<Perspectief, SitemapMeta> = {
  werkzoekende: { priority: 0.7, changeFrequency: "weekly" },
  werkgever: { priority: 0.7, changeFrequency: "monthly" },
};

export function routeMeta(path: StaticPath): RouteMeta {
  const meta = STATIC_ROUTES.find((r) => r.path === path);
  if (!meta) throw new Error(`Geen RouteMeta voor ${path}`);
  return meta;
}

/** Pad zonder taalprefix, zonder query en zonder slash aan het eind. */
function normalize(pathname: string): string {
  let p = pathname.split(/[?#]/)[0] || "/";
  if (p === "/en" || p.startsWith("/en/")) p = p.slice(3) || "/";
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p;
}

function under(p: string, base: string): boolean {
  return p === base || p.startsWith(`${base}/`);
}

/** Doelgroep van een pad (B-04). Werkt met en zonder taalprefix. */
export function audienceFor(pathname: string): Audience {
  const p = normalize(pathname);
  if (
    under(p, "/vacatures") ||
    p === "/werkzoekenden" ||
    under(p, "/werken-als") ||
    p === "/inschrijven" ||
    p === "/bedankt/sollicitatie" ||
    p === "/bedankt/inschrijving"
  ) {
    return "werkzoekende";
  }
  if (under(p, "/werkgevers") || p === "/bedankt/aanvraag" || p === "/algemene-voorwaarden") {
    return "werkgever";
  }
  return "algemeen";
}

export type ActionBarVariant = "werkzoekende" | "werkgever" | "aanvraag" | "vacature" | "algemeen";

export function actionBarVariantFor(pathname: string): ActionBarVariant {
  const p = normalize(pathname);
  if (p.startsWith("/vacatures/")) return "vacature";
  if (p === ROUTES.personeelAanvragen) return "aanvraag";
  const audience = audienceFor(p);
  return audience === "werkzoekende" ? "werkzoekende" : audience === "werkgever" ? "werkgever" : "algemeen";
}

export type HeaderCtaKey = "inschrijven" | "vacatures" | "personeelAanvragen" | "contact";

export function headerCtaFor(pathname: string): HeaderCtaKey {
  const p = normalize(pathname);
  if (audienceFor(p) === "werkzoekende") return p === ROUTES.inschrijven ? "vacatures" : "inschrijven";
  if (p === ROUTES.personeelAanvragen) return "contact";
  return "personeelAanvragen";
}

/** "page" bij exacte match, "section" als het pad onder het menu-item valt, anders false. */
export function isActive(pathname: string, item: NavKey): "page" | "section" | false {
  const p = normalize(pathname);
  switch (item) {
    case "vacatures":
      return p === ROUTES.vacatures ? "page" : under(p, ROUTES.vacatures) ? "section" : false;
    case "werkzoekenden":
      return p === ROUTES.werkzoekenden
        ? "page"
        : under(p, "/werken-als") || p === ROUTES.inschrijven
          ? "section"
          : false;
    case "werkgevers":
      return p === ROUTES.werkgevers ? "page" : under(p, ROUTES.werkgevers) ? "section" : false;
    case "overOns":
      return p === ROUTES.overOns ? "page" : false;
    case "contact":
      return p === ROUTES.contact ? "page" : false;
  }
}

/**
 * 404 op de server (spec 01 §4.13, AC-01-03). notFound() levert in Next 16.3
 * alleen een lege HTML-schil op; proxy.ts herschrijft onbekende paden daarom
 * met status 404 naar het vangnet app/[locale]/[...rest] en zet deze kopregel.
 */
export const NOT_FOUND_HEADER = "x-groos-not-found";
/** Pad zonder route waarop de proxy onbekende paden laat landen (valt in [...rest]). */
export const NOT_FOUND_PATH = "/pagina-niet-gevonden";

/** Laatste padsegment van metadata-afbeeldingen naast een pagina (spec 12). */
const IMAGE_ROUTE = /^(opengraph-image|twitter-image)(-[\w-]+)?$/;

/**
 * Of een pad (met of zonder taalprefix) bij een bestaande pagina hoort. Houd
 * gelijk aan de mappen onder app/[locale]. Vacatureslugs komen uit de database;
 * die pagina geeft zelf notFound().
 */
export function isKnownPath(pathname: string): boolean {
  let p = normalize(pathname);
  const parts = p.split("/").filter(Boolean);
  if (parts.length > 0 && IMAGE_ROUTE.test(parts[parts.length - 1])) {
    parts.pop();
    p = `/${parts.join("/")}`;
  }
  if ((Object.values(ROUTES) as string[]).includes(p)) return true;
  if (p === "/stijlgids") return process.env.NODE_ENV !== "production";
  if (parts.length !== 2) return false;
  const [section, slug] = parts;
  switch (section) {
    case "vacatures":
      return true;
    case "werken-als":
      return findBeroepBySlug("werkzoekende", slug) !== undefined;
    case "werkgevers":
      return findBeroepBySlug("werkgever", slug) !== undefined;
    case "bedankt":
      return isBedanktSoort(slug);
    default:
      return false;
  }
}
