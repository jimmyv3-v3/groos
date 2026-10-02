import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { contact, site, socials } from "@/lib/site";

/**
 * SEO-helpers. Elke pagina bouwt haar metadata met `pageMetadata()` en haar
 * structured data met de `*Ld()`-builders, zodat canonical, hreflang, de
 * OG-afbeelding en de JSON-LD overal hetzelfde en compleet zijn.
 */

export const SITE_URL = site.url;

const OG_LOCALES: Record<string, string> = { nl: "nl_NL", en: "en_US" };
const LANGUAGE_NAMES: Record<string, string> = { nl: "Dutch", en: "English" };

/**
 * Pad voor een taal. De standaardtaal staat op de root, andere talen krijgen
 * een prefix (localePrefix "as-needed"). `path` is "/" of begint met "/".
 */
export function localizedPath(locale: string, path: string): string {
  const clean = path === "/" ? "" : path;
  if (locale === routing.defaultLocale) return clean || "/";
  return `/${locale}${clean}`;
}

export function absoluteUrl(path: string): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/** Canonical plus hreflang-alternates (alle talen en x-default) voor één pagina. */
export function alternatesFor(
  locale: string,
  path: string,
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = localizedPath(l, path);
  languages["x-default"] = localizedPath(routing.defaultLocale, path);
  return { canonical: localizedPath(locale, path), languages };
}

const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630 };

/**
 * Volledige metadata voor één pagina. Gebruik dit in élke generateMetadata.
 * Een `openGraph`-object op paginaniveau vervangt dat van de layout volledig,
 * dus de afbeelding moet hier steeds opnieuw mee (in J. Versseput ontbrak
 * og:image daardoor op alle pagina's).
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  keywords,
  absoluteTitle = false,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  /** true voor de homepage: de titel wordt dan niet aangevuld met de merknaam. */
  absoluteTitle?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} · ${contact.shortName}`;
  const image = { ...OG_IMAGE, alt: contact.shortName };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: alternatesFor(locale, path),
    openGraph: {
      type: "website",
      locale: OG_LOCALES[locale] ?? locale,
      url: localizedPath(locale, path),
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

type JsonLdObject = Record<string, unknown>;

function postalAddress(): JsonLdObject {
  return {
    "@type": "PostalAddress",
    ...(contact.street && { streetAddress: contact.street }),
    ...(contact.postalCode && { postalCode: contact.postalCode }),
    addressLocality: contact.city,
    addressCountry: "NL",
  };
}

const sameAs = socials.map((s) => s.href);

export function organizationLd(description: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: contact.name,
    url: SITE_URL,
    logo: absoluteUrl(site.logo),
    description,
    ...(sameAs.length > 0 && { sameAs }),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: contact.phone,
      email: contact.email,
      contactType: "customer service",
      areaServed: "NL",
      availableLanguage: routing.locales.map((l) => LANGUAGE_NAMES[l] ?? l),
    },
  };
}

export function websiteLd(locale: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: contact.shortName,
    url: SITE_URL,
    inLanguage: `${locale}-NL`,
  };
}

export function localBusinessLd({
  description,
  path,
  areaServed,
}: {
  description: string;
  /** Gelokaliseerd pad van de pagina waarop dit blok staat. */
  path: string;
  areaServed?: JsonLdObject | readonly string[];
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": site.schemaType,
    name: contact.name,
    url: absoluteUrl(path),
    image: absoluteUrl(OG_IMAGE.url),
    logo: absoluteUrl(site.logo),
    telephone: contact.phone,
    email: contact.email,
    address: postalAddress(),
    areaServed: areaServed ?? site.areaServed,
    description,
    identifier: { "@type": "PropertyValue", name: "KvK", value: contact.kvk },
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export function serviceLd({
  name,
  serviceType,
  description,
  path,
}: {
  name: string;
  serviceType: string;
  description: string;
  path: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType,
    description,
    url: absoluteUrl(path),
    areaServed: site.areaServed,
    provider: {
      "@type": site.schemaType,
      name: contact.name,
      telephone: contact.phone,
      url: SITE_URL,
    },
  };
}

/** Kruimelpad. Geef gelokaliseerde paden mee (zie `localizedPath`). */
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
