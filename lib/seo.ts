import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { contact, site, socials } from "@/lib/site";

/**
 * SEO-helpers (spec 12 §4.2 en §4.4). Elke pagina bouwt haar metadata met
 * `pageMetadata()` en haar structured data met de `*Ld()`-builders, zodat
 * canonical, hreflang, robots, de OG-afbeelding en de JSON-LD overal gelijk zijn.
 * Spec 12 voegt in bouwstap 5 de vacaturehelpers en `jobPostingLd` toe.
 */

export const SITE_URL: string = site.url;
export const ORGANIZATION_ID = `${SITE_URL}/#organization` as const;
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const TITLE_MAX = 60;
export const BRAND_SUFFIX = ` | ${contact.shortName}`;
export const BRAND_SUFFIX_SHORT = " | Groos";
export const ADDRESS_REGION = "Zuid-Holland";

export type JsonLdObject = Record<string, unknown>;

const OG_LOCALES: Record<Locale, string> = { nl: "nl_NL", en: "en_GB" };
const IN_LANGUAGE: Record<Locale, string> = { nl: "nl-NL", en: "en-GB" };
const LANGUAGE_NAMES: Record<Locale, string> = { nl: "Dutch", en: "English" };

/** "/" of een pad dat met "/" begint, eventueel met query. nl zonder prefix, en met "/en". */
export function localizedPath(locale: Locale | string, path: string): string {
  const clean = path === "/" ? "" : path;
  if (locale === routing.defaultLocale) return clean || "/";
  return `/${locale}${clean}`;
}

/** SITE_URL plus pad. */
export function absoluteUrl(path: string): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/** Titel met merk: eerst " | Groos Personeelsdiensten", past dat niet binnen 60 tekens dan " | Groos", anders de titel zelf. */
export function brandedTitle(title: string, max: number = TITLE_MAX): string {
  if (title.length + BRAND_SUFFIX.length <= max) return `${title}${BRAND_SUFFIX}`;
  if (title.length + BRAND_SUFFIX_SHORT.length <= max) return `${title}${BRAND_SUFFIX_SHORT}`;
  return title;
}

/** Canonical en hreflang. Standaard: canonical naar zichzelf, languages nl, en en x-default (naar nl). */
export function alternatesFor(
  locale: Locale,
  path: string,
  options: {
    /** false: geen languages (vacaturedetail, B-03). */
    languages?: boolean;
    /** Afwijkende canonical, bijvoorbeeld de NL-vacature vanaf /en. */
    canonical?: { locale: Locale; path: string };
  } = {},
): { canonical: string; languages?: Record<string, string> } {
  const canonical = options.canonical
    ? localizedPath(options.canonical.locale, options.canonical.path)
    : localizedPath(locale, path);
  if (options.languages === false) return { canonical };
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = localizedPath(l, path);
  languages["x-default"] = localizedPath(routing.defaultLocale, path);
  return { canonical, languages };
}

/** Pad van de OG-afbeelding van een segment met een eigen opengraph-image.tsx. */
export function ogImagePath(locale: Locale, path: string): string {
  return `${localizedPath(locale, path).replace(/\/$/, "")}/opengraph-image`;
}

export type OgImage = { url: string; alt: string; width?: number; height?: number };

export type PageMetadataInput = {
  locale: Locale;
  /** Pad zonder taalprefix, bijvoorbeeld "/werkgevers/schoonmakers" of "/vacatures?pagina=2". */
  path: string;
  /** Eigen deel van de titel, zonder merk. */
  title: string;
  description: string;
  keywords?: string[];
  /** true: geen merkachtervoegsel (alleen home, die heeft het merk al in meta.titleDefault). */
  absoluteTitle?: boolean;
  /** Standaard true. false: geen alternates.languages. */
  languages?: boolean;
  canonical?: { locale: Locale; path: string };
  /** true: robots "noindex, follow". */
  noindex?: boolean;
  /** Standaard { url: "/opengraph-image", alt: contact.shortName, 1200 bij 630 }. */
  image?: OgImage;
};

const INDEX_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: true,
  follow: true,
  googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
};

/**
 * Volledige metadata voor één pagina. Gebruik dit in élke generateMetadata.
 * De titel is altijd absoluut, zodat meta.titleTemplate geen tweede merk toevoegt.
 */
export function pageMetadata(input: PageMetadataInput): Metadata {
  const {
    locale,
    path,
    title,
    description,
    keywords,
    absoluteTitle = false,
    languages = true,
    canonical,
    noindex = false,
    image = { url: "/opengraph-image", alt: contact.shortName, ...OG_SIZE },
  } = input;
  const fullTitle = absoluteTitle ? title : brandedTitle(title);
  const alternates = alternatesFor(locale, path, { languages, canonical });

  if (process.env.NODE_ENV === "development") {
    if (fullTitle.length > TITLE_MAX) console.warn(`[seo] titel langer dan ${TITLE_MAX} tekens op ${path}: ${fullTitle}`);
    if (!noindex && (description.length < 120 || description.length > 160) && !description.startsWith("TODO")) {
      console.warn(`[seo] beschrijving van ${description.length} tekens op ${path} (doel 120 tot 160)`);
    }
  }

  return {
    title: { absolute: fullTitle },
    description,
    keywords,
    alternates,
    robots: noindex ? { index: false, follow: true } : INDEX_ROBOTS,
    openGraph: {
      type: "website",
      locale: OG_LOCALES[locale],
      url: alternates.canonical ?? localizedPath(locale, path),
      siteName: contact.shortName,
      title: fullTitle,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.url],
    },
  };
}

/* JSON-LD ------------------------------------------------------------------ */

const sameAs = socials.map((s) => s.href);

function postalAddress(): JsonLdObject {
  return {
    "@type": "PostalAddress",
    streetAddress: contact.street,
    postalCode: contact.postalCode,
    addressLocality: contact.city,
    addressRegion: ADDRESS_REGION,
    addressCountry: contact.country,
  };
}

/** Site-breed in app/[locale]/layout.tsx. */
export function organizationLd({ description }: { description: string }): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: contact.shortName,
    legalName: contact.name,
    url: SITE_URL,
    logo: absoluteUrl(site.logo),
    description,
    email: contact.email,
    telephone: contact.phoneE164,
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export function websiteLd({ locale }: { locale: Locale }): JsonLdObject {
  const url = absoluteUrl(localizedPath(locale, "/"));
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}#website`,
    url,
    name: contact.shortName,
    inLanguage: IN_LANGUAGE[locale],
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** Op / en /contact (beide talen). */
export function employmentAgencyLd({ locale, description }: { locale: Locale; description: string }): JsonLdObject {
  const opening = contact.openingHours;
  const kvk = contact.kvk;
  return {
    "@context": "https://schema.org",
    "@type": site.schemaType,
    "@id": ORGANIZATION_ID,
    name: contact.shortName,
    legalName: contact.name,
    url: absoluteUrl(localizedPath(locale, "/")),
    logo: absoluteUrl(site.logo),
    image: absoluteUrl("/opengraph-image"),
    description,
    telephone: contact.phoneE164,
    email: contact.email,
    address: postalAddress(),
    areaServed: site.areaServed,
    knowsLanguage: [...routing.locales],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: contact.phoneE164,
      email: contact.email,
      areaServed: "NL",
      availableLanguage: routing.locales.map((l) => LANGUAGE_NAMES[l]),
    },
    ...(opening && {
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: opening.opens,
        closes: opening.closes,
      },
    }),
    ...(kvk && {
      identifier: { "@type": "PropertyValue", propertyID: "KvK", value: kvk },
      iso6523Code: `0106:${kvk}`,
    }),
    ...(contact.btw && { vatID: contact.btw }),
    ...(sameAs.length > 0 && { sameAs }),
  };
}

/** Op /werkgevers/[beroep]. */
export function serviceLd({
  locale,
  path,
  name,
  serviceType,
  description,
}: {
  locale: Locale;
  path: string;
  name: string;
  serviceType: string;
  description: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType,
    description,
    url: absoluteUrl(localizedPath(locale, path)),
    areaServed: site.areaServed,
    audience: { "@type": "BusinessAudience" },
    availableLanguage: [...routing.locales],
    provider: { "@type": site.schemaType, "@id": ORGANIZATION_ID, name: contact.name },
  };
}

/** Alleen via Breadcrumbs (spec 01). Paden al gelokaliseerd. */
export function breadcrumbLd(items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Alleen met de vragen die zichtbaar op de pagina staan. */
export function faqLd(items: { q: string; a: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
