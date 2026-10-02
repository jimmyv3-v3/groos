import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { contact, site, socials } from "@/lib/site";
import type { ContractType, EducationLevel } from "@/lib/data/options";
import type { VacancyDetail } from "@/lib/data/types";

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

/* Vacatures (spec 12 §4.3, §4.5 en §5.3) ----------------------------------- */

/** Sleutels onder vacatures.meta (eigenaar spec 06 §6.1 en §6.2). */
export type VacancyMetaKey =
  | "title"
  | "description"
  | "titlePaged"
  | "descriptionPaged"
  | "detailTitle"
  | "detailDescription"
  | "detailDescriptionShort"
  | "startAsapSentence"
  | "startDateSentence"
  | "closedTitleFilled"
  | "closedTitleOther"
  | "closedDescriptionFilled"
  | "closedDescriptionOther"
  | "ogAlt";
export type VacancyMetaTranslator = (key: VacancyMetaKey, values?: Record<string, string | number>) => string;

export const DESCRIPTION_MAX = 160;

/** Afkappen op het laatste hele woord onder `max - 3` tekens plus "..." (spec 06 §7.3, regel 4). */
export function truncateAtWord(text: string, max: number = DESCRIPTION_MAX): string {
  const clean = text.trim().replace(/\s+/g, " ");
  if (clean.length <= max) return clean;
  const limit = max - 3;
  const cut = clean.slice(0, limit + 1);
  const space = cut.lastIndexOf(" ");
  const base = (space > 0 ? cut.slice(0, space) : clean.slice(0, limit)).replace(/[\s.,;:]+$/, "");
  return `${base}...`;
}

/** Metadata voor /vacatures (B-16). */
export function vacancyListMetadata(input: {
  locale: Locale;
  t: VacancyMetaTranslator;
  page: number;
  isFiltered: boolean;
}): Metadata {
  const { locale, t, page, isFiltered } = input;
  if (isFiltered) {
    return pageMetadata({ locale, path: "/vacatures", title: t("title"), description: t("description"), noindex: true });
  }
  if (page >= 2) {
    return pageMetadata({
      locale,
      path: `/vacatures?pagina=${page}`,
      title: t("titlePaged", { page }),
      description: t("descriptionPaged", { page }),
    });
  }
  return pageMetadata({ locale, path: "/vacatures", title: t("title"), description: t("description") });
}

/** Beschrijving van een open vacature volgens spec 06 §7.3 (pure functie, testbaar). */
export function vacancyDescription(input: {
  t: VacancyMetaTranslator;
  title: string;
  city: string;
  hours: string;
  wage: string;
  startDate: string | null;
  summary: string;
}): string {
  const { t, title, city, hours, wage, startDate, summary } = input;
  const start = startDate ? t("startDateSentence", { date: startDate }) : t("startAsapSentence");
  const full = t("detailDescription", { title, city, hours, wage, start });
  if (full.length <= DESCRIPTION_MAX) return full;
  const short = t("detailDescriptionShort", { title, city, hours, wage });
  if (short.length <= DESCRIPTION_MAX) return short;
  return truncateAtWord(summary);
}

/** Metadata voor /vacatures/[slug] in beide talen, open of gesloten (spec 12 §4.3). */
export function vacancyMetadata(input: {
  locale: Locale;
  vacancy: VacancyDetail;
  t: VacancyMetaTranslator;
  /** Plaatsnaam zoals de pagina hem toont: displayCity(vacancy.city, locale) (spec 06). */
  city: string;
  hours: string;
  wage: string;
  /** Opgemaakte startdatum, of null bij startAsap of een datum in het verleden. */
  startDate: string | null;
}): Metadata {
  const { locale, vacancy, t, city, hours, wage, startDate } = input;
  const path = vacancy.path;
  const title = vacancy.title;
  const shared = {
    locale,
    path,
    languages: false,
    ...(locale === "en" && { canonical: { locale: routing.defaultLocale, path } }),
    image: { url: ogImagePath(locale, path), alt: t("ogAlt", { title, city }), ...OG_SIZE },
  };

  if (vacancy.state === "closed") {
    const filled = vacancy.closeReason === "filled";
    const name = locale === "en" ? vacancy.occupation.nameEn : vacancy.occupation.nameNl;
    const occupation = name ? name.charAt(0).toLocaleLowerCase(locale) + name.slice(1) : name;
    return pageMetadata({
      ...shared,
      title: t(filled ? "closedTitleFilled" : "closedTitleOther", { title, city }),
      description: t(filled ? "closedDescriptionFilled" : "closedDescriptionOther", { title, city, occupation }),
      noindex: true,
    });
  }

  const useSeo = locale === routing.defaultLocale;
  return pageMetadata({
    ...shared,
    title: (useSeo && vacancy.seoTitle?.trim()) || t("detailTitle", { title, city }),
    description:
      (useSeo && vacancy.seoDescription?.trim()) ||
      vacancyDescription({ t, title, city, hours, wage, startDate, summary: vacancy.summary || vacancy.intro }),
  });
}

export type JobPostingLabels = { tasks: string; requirements: string; offer: string; extra: string };
export type EmploymentType = "FULL_TIME" | "PART_TIME" | "TEMPORARY" | "CONTRACTOR" | "PER_DIEM" | "OTHER";

/** Grens voltijd, gelijk aan de uren-bucket 32-plus van spec 10 (spec 12 §12). */
export const FULL_TIME_HOURS = 32;

/** employmentType volgens spec 12 §5.3. */
export function employmentTypesFor(contractType: ContractType, hoursMin: number, hoursMax: number): EmploymentType[] {
  const types: EmploymentType[] = contractType === "recruitment" ? [] : ["TEMPORARY"];
  if (hoursMax >= FULL_TIME_HOURS) types.push("FULL_TIME");
  if (hoursMin < FULL_TIME_HOURS) types.push("PART_TIME");
  return types;
}

/** & < > " ' naar entiteiten. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlList(items: (string | null | undefined)[]): string {
  const filled = items.map((i) => i?.trim()).filter((i): i is string => !!i);
  return filled.length ? `<ul>${filled.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>` : "";
}

function htmlParagraphs(text: string | null | undefined): string {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join("");
}

/** description van JobPosting in de volgorde van de pagina (spec 12 §4.5). */
export function jobDescriptionHtml(
  vacancy: VacancyDetail,
  labels: JobPostingLabels,
  facts: string[],
  minAgeSentence: string | null,
): string {
  const factLine = facts
    .map((f) => f.trim())
    .filter(Boolean)
    .map((f) => (f.endsWith(".") ? f : `${f}.`))
    .join(" ");
  const section = (label: string, body: string) => (body ? `<p><strong>${escapeHtml(label)}</strong></p>${body}` : "");
  return [
    htmlParagraphs(vacancy.intro),
    factLine ? `<p>${escapeHtml(factLine)}</p>` : "",
    section(labels.tasks, htmlList(vacancy.tasks)),
    section(labels.requirements, htmlList([...vacancy.requirements, minAgeSentence])),
    section(labels.offer, htmlList([...vacancy.offer, vacancy.salaryNote])),
    section(labels.extra, htmlParagraphs(vacancy.extra)),
  ].join("");
}

const EDUCATION_CATEGORY: Partial<Record<EducationLevel, string>> = {
  vmbo: "high school",
  havo_vwo: "high school",
  mbo1: "professional certificate",
  mbo2: "professional certificate",
  mbo3: "professional certificate",
  mbo4: "professional certificate",
  hbo: "bachelor degree",
  wo: "bachelor degree",
};

/** Alleen op /vacatures/[slug] in het Nederlands; null als de vacature niet open is (spec 12 §4.5 en §5.3). */
export function jobPostingLd(input: {
  vacancy: VacancyDetail;
  /** Dezelfde h2's als op de pagina: vacatures.detail.sections.* (spec 06). */
  labels: JobPostingLabels;
  /** Precies [uren, uurloon, startzin]. */
  facts: string[];
  /** vacatures.detail.minAge.<reden> als minAge18 waar is, anders null (B-32). */
  minAgeSentence: string | null;
}): JsonLdObject | null {
  const { vacancy: v, labels, facts, minAgeSentence } = input;
  if (v.state !== "open") return null;

  const category = EDUCATION_CATEGORY[v.educationLevel];
  const education =
    v.educationLevel === "none"
      ? "no requirements"
      : category
        ? { "@type": "EducationalOccupationalCredential", credentialCategory: category }
        : undefined;
  const experience =
    v.experienceLevel === "required"
      ? v.experienceMonths
        ? { "@type": "OccupationalExperienceRequirements", monthsOfExperience: v.experienceMonths }
        : undefined
      : "no requirements";

  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: v.title,
    description: jobDescriptionHtml(v, labels, facts, minAgeSentence),
    datePosted: v.publishedAt,
    validThrough: v.closesAt,
    employmentType: employmentTypesFor(v.contractType, v.hoursMin, v.hoursMax),
    hiringOrganization: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: contact.name,
      sameAs: SITE_URL,
      logo: absoluteUrl(site.logo),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: v.city,
        ...(v.postalCode?.trim() && { postalCode: v.postalCode.trim() }),
        ...(v.province && { addressRegion: v.province }),
        addressCountry: "NL",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "EUR",
      value:
        v.salaryMin === v.salaryMax
          ? { "@type": "QuantitativeValue", value: v.salaryMin, unitText: "HOUR" }
          : { "@type": "QuantitativeValue", minValue: v.salaryMin, maxValue: v.salaryMax, unitText: "HOUR" },
    },
    directApply: true,
    identifier: { "@type": "PropertyValue", name: contact.name, value: String(v.number) },
    ...(education !== undefined && { educationRequirements: education }),
    ...(experience !== undefined && { experienceRequirements: experience }),
    ...(v.positionsCount > 1 && { totalJobOpenings: v.positionsCount }),
    ...(!v.startAsap && v.startDate && { jobStartDate: v.startDate }),
    url: absoluteUrl(v.path),
  };
}
