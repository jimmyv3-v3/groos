# 12 SEO, structured data en lokale vindbaarheid

| Status | Fase | Hangt af van | Bronnen |
|---|---|---|---|
| concept, ter goedkeuring aan Djulan | 1 en 2 (fase 2 alleen benoemd, uitwerking in spec 15) | 01 (routes, registers, proxy, `Breadcrumbs`), 10 (data-laag, `VacancyDetail`, cache-tags), 03 (`meta`, `common.format`, `lib/format.ts`, sjablonen), 06 (vacaturepagina's, namespace `vacatures`), 05 (beroepspagina's), 09 (`lib/legal.ts`), 02 (`lib/brand.ts`, logo, fonts) | context/10 (volledig), docs/MIGRATIE.md §3 en §10, bijlagen/samenvattingen/context-10, -08, -05, -04, bijlagen/repo-inventaris.md §1 en §4, 00 §3.2 (B-02, B-03, B-04, B-11, B-15, B-16, B-21 tot en met B-24, B-26, B-27, B-35, B-40, B-43), `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/{sitemap,robots,opengraph-image}.md`, `.../04-functions/generate-metadata.md` |

## 1 Doel

Deze module zorgt dat Groos gevonden wordt door de twee doelgroepen en dat elke
vacature zonder handwerk in Google for Jobs verschijnt en er netjes weer uit
verdwijnt. Ze levert de volledige SEO-laag in `lib/seo.ts`: `pageMetadata()` met
robots, eigen OG-afbeelding en afwijkende canonical, de JSON-LD-builders
(`organizationLd`, `websiteLd`, `employmentAgencyLd`, `serviceLd`,
`breadcrumbLd`, `faqLd`, `jobPostingLd`) en de metadata-helpers voor
vacaturepagina's. Daarnaast bouwt ze `app/sitemap.ts`, `app/robots.ts`,
`app/llms.txt/route.ts` en de OG-afbeeldingen in de nieuwe merkstijl, met een
dynamische afbeelding per vacature. De spec legt de metadata-sjablonen per
paginatype vast in NL en EN, de canonical- en noindex-regels, de levenscyclus van
een vacature in metadata, JSON-LD en sitemap (B-15), en de afspraken voor lokale
vindbaarheid: NAP, Google Bedrijfsprofiel, reviews en interne links. Alles is op
localhost te controleren tegen `groos-dev` met de seedvacatures van spec 10.

## 2 Gebruikers en scenario's

**Werkzoekende**

- S-12-01 Een orderpicker zoekt in Google op "vacature orderpicker naaldwijk". In het vacatureblok van Google staat "Orderpicker" van Groos Personeelsdiensten met Naaldwijk en € 14,99 tot € 16,20 per uur. Hij tikt op "Solliciteren" en landt op `/vacatures/orderpicker-naaldwijk-1003`, waar hij direct het formulier ziet.
- S-12-02 Een schoonmaker deelt een vacature in een WhatsApp-groep. De linkvoorvertoning toont een witte kaart met het logo, de titel "Schoonmaker kantoren", "Rijswijk" en "€ 15,52 tot € 16,08 bruto per uur".
- S-12-03 Een werkzoekende zoekt "werken als verhuizer den haag" en ziet als zoekresultaat "Werken als verhuizer in Den Haag | Groos Personeelsdiensten" met een beschrijving in je-vorm.
- S-12-04 Een werkzoekende klikt in Google op een oude vacature die vorige week is vervuld. Hij ziet de pagina met een melding en vergelijkbare vacatures. Google krijgt `noindex, follow` en geen JobPosting meer; na 30 dagen geeft de URL een 404.

**Werkgever**

- S-12-05 Een facilitair manager zoekt "uitzendbureau schoonmaak den haag" en vindt `/werkgevers/schoonmakers` met een titel en beschrijving in u-vorm.
- S-12-06 Een planner van een verhuisbedrijf zoekt "personeel voor verhuisbedrijf" en vindt `/werkgevers/verhuizers`, niet een pagina die particulieren een verhuizing aanbiedt.
- S-12-07 Een opdrachtgever zoekt "Groos Personeelsdiensten" op Google Maps. Hij ziet het Bedrijfsprofiel met de categorie Uitzendbureau, een servicegebied rond Den Haag, het hoofdnummer en de website, zonder zichtbaar woonadres.

**Beheerder**

- S-12-08 Lorenzo publiceert een vacature in `/beheer`. Bij het volgende bezoek staat de vacature met JobPosting online en in `/sitemap.xml`, zonder deploy.
- S-12-09 Jimmy sluit een vacature als vervuld. Bij het volgende bezoek heeft de pagina `noindex, follow`, is de JobPosting weg en ontbreekt de URL in de sitemap.

**Crawler en AI-assistent**

- S-12-10 Googlebot haalt `/robots.txt` op, vindt de sitemap, leest per open vacature één geldige JobPosting en wordt nooit naar `/en` doorgestuurd (spec 01, `proxy.ts`).
- S-12-11 Een AI-assistent leest `/llms.txt` en kan vragen beantwoorden als "welk uitzendbureau in Den Haag levert glazenwassers en hoe vraag ik ze aan".

## 3 Scope

### 3.1 Wel in fase 1

| Id | Eis | Dient |
|---|---|---|
| E-12-01 | `pageMetadata()` ondersteunt `noindex`, een eigen OG-afbeelding, het weglaten van hreflang (`languages: false`) en een afwijkende canonical, en geeft altijd een absolute titel van hoogstens 60 tekens terug (§4.2). | R-09, R-13 |
| E-12-02 | Elke indexeerbare pagina heeft een titel die uniek is binnen de taal (B-53) van hoogstens 60 tekens inclusief merkachtervoegsel en een beschrijving van 120 tot 160 tekens (doel 140 tot 155), in de aanspreekvorm van de doelgroep van de pagina (B-04). | R-07, R-09 |
| E-12-03 | De metadata-sjablonen per paginatype in NL en EN staan in §6.2 en gebruiken de zoekwoorden per beroep uit §6.3. | R-01, R-09 |
| E-12-04 | Canonical, hreflang en noindex volgen de regeltabel in §7.1, inclusief filters, paginering, bedankpagina's, gesloten vacatures en `/en/vacatures/[slug]` (B-15, B-16, B-03). | R-09, R-13 |
| E-12-05 | `lib/seo.ts` bevat `organizationLd`, `websiteLd` en `employmentAgencyLd`; `localBusinessLd` bestaat niet meer. Adres volgens B-23, openingstijden alleen als `contact.openingHours` gevuld is (B-22), `areaServed` volgens §4.4 (Haaglanden alleen na bevestiging van `workArea`, B-43), geen `geo` en geen `aggregateRating`. | R-09, R-12 |
| E-12-06 | `jobPostingLd()` levert per open vacature een JobPosting met alle verplichte en aanbevolen velden van Google, volgens de veldmapping in §5.3. | R-10 |
| E-12-07 | De levenscyclus van B-15 is in metadata, JSON-LD en sitemap uitgevoerd volgens §5.4. | R-10 |
| E-12-08 | `app/sitemap.ts` bevat de gepubliceerde vaste routes en de tien beroepspagina's in NL en EN met alternates, en de open vacatures alleen in NL met `lastModified`; hij ververst bij elke zichtbaarheidswijziging en uiterlijk na 3600 seconden. | R-09, R-10, R-13 |
| E-12-09 | `app/robots.ts` sluit `/beheer` en `/api/` uit, verwijst naar de sitemap en blokkeert geen filterpagina's. | R-09, R-03 |
| E-12-10 | `/llms.txt` beschrijft Groos, de NAW-gegevens, de routes per doelgroep en de tien beroepspagina's met absolute URL's, zonder TODO en zonder bedankpagina's of beheer. | R-09 |
| E-12-11 | `/opengraph-image` toont de nieuwe merkstijl (wit, blauw accent, logo, Instrument Sans) met tekst uit `meta.ogHeadline` en `meta.ogSubline`. | R-05, R-06, R-09 |
| E-12-12 | Elke vacature heeft een eigen OG- en Twitter-afbeelding met titel, plaats, uren en bruto uurloon; een gesloten vacature toont dat hij gesloten is. | R-10, R-14 |
| E-12-13 | Elke beroepspagina (tien stuks, per taal) heeft een eigen OG-afbeelding met de paginakop. | R-01, R-09 |
| E-12-14 | Naam, adres en telefoonnummer (NAP) staan op site, in JSON-LD, in `llms.txt` en in externe vermeldingen exact gelijk; de bron is `contact` in `lib/site.ts`. | R-09, R-12 |
| E-12-15 | De procedure voor Google Bedrijfsprofiel, Bing Places en Apple Business Connect, inclusief de beschrijvingstekst, staat in §7.6 en wordt bij de livegang door Jimmy met Djulan uitgevoerd (spec 13, Deel G). | R-12 |
| E-12-16 | Er staat nergens `aggregateRating` of `Review`-markup van eigen reviews; reviews worden alleen via Google gevraagd volgens §7.7. | R-12 |
| E-12-17 | Interne links tussen vacatures, beroepspagina's en werkgeverspagina's volgen §7.8. | R-01, R-02 |
| E-12-18 | Metadata, JSON-LD, OG-afbeeldingen en `llms.txt` bevatten geen onbevestigde claims (keurmerk, cao, Wtta-status, 24/7, reactietermijn, cijfers, klantnamen). | R-12 |
| E-12-19 | `serviceLd`, `faqLd` en `breadcrumbLd` worden gebruikt volgens de tabel in §7.3; er is geen `ItemList` met vacatures (B-16). | R-09 |
| E-12-20 | De builders zijn pure functies met eenheidstests (spec 14, `seo/job-posting.test.ts` en `seo/builders.test.ts`). | R-19, R-10 |
| E-12-21 | Alles uit deze spec is te verifiëren op localhost met `npm run build && npm run start` tegen `groos-dev`. | R-17 |
| E-12-22 | De bouw-agent zet voor de opmaak van de OG-afbeeldingen een sub-agent in die via 21st.dev inspiratie zoekt (§9). | R-16 |
| E-12-23 | Fase 2 (Indexing API, feeds, regiopagina's, Engelse vacatures) is benoemd en blokkeert fase 1 niet (§3.3). | R-20 |

### 3.2 Niet in deze spec

Teksten en woordkeus (spec 03 en de eigenaars van de namespaces), het
uiterlijk en de inhoud van pagina's (specs 04 tot en met 09), de proxy en de
botlijst (spec 01), headers zoals `X-Robots-Tag` in `next.config.mjs` (spec 13),
Search Console, Bing Webmaster Tools en DNS-verificatie (spec 13, Deel G), de
testopzet zelf (spec 14). Deze spec beschrijft wel wat die specs moeten aanleveren
of aanroepen.

### 3.3 Fase 2 (benoemd, uitgewerkt in spec 15)

- **Google Indexing API.** `URL_UPDATED` bij publiceren en wijzigen, `URL_DELETED` na 30 dagen gesloten of bij archiveren, aangestuurd vanuit `revalidateVacancies()` (spec 10). Vraagt een Google Cloud-project, een serviceaccount als eigenaar in Search Console en een extra env var. Fase 1 steunt op sitemap en JobPosting (B-27).
- **Vacaturefeeds** onder `/feeds/[portaal]` (route handler buiten `[locale]`, al buiten de proxy), alleen voor betaalde portalen (B-27). `robots.ts` hoeft daarvoor niets te blokkeren.
- **Regiopagina's** `/regio/[plaats]` met eigen `areaServed` (`City`) en alleen bij structureel vacatures en echte lokale tekst.
- **Engelse vacatures**: `/en/vacatures/[slug]` krijgt dan een eigen canonical, wederzijdse hreflang, een Engelse JobPosting en een plek in de sitemap.
- **Aparte vacaturesitemap** met `generateSitemaps` zodra er meer dan 1.000 open vacatures zijn.
- **Reviewlink** van het Bedrijfsprofiel in bevestigingsmails (spec 11) na de eerste plaatsingen.

## 4 Pagina's en componenten

Deze module heeft geen eigen pagina's. Ze levert een bibliotheek, vier
metadata-routes en zes OG-routes. Alle bestanden hieronder zijn eigendom van
deze spec (00 §4.4a: `lib/seo.ts`, sitemap, robots, llms.txt en
OG-afbeeldingen).

### 4.1 Bestandsoverzicht

| Bestand | Soort | Nieuw of gewijzigd | Gebruikt door |
|---|---|---|---|
| `lib/seo.ts` | pure helpers en builders | herschreven (§4.2 tot en met §4.5) | alle pagina's, 01 (`Breadcrumbs`, layout), 04 tot en met 09 |
| `lib/og.tsx` | gedeelde opmaak, fonts en kleuren voor `ImageResponse` | nieuw (§4.6) | alle OG-routes |
| `assets/fonts/InstrumentSans-SemiBold.ttf`, `assets/fonts/Onest-Regular.ttf`, `assets/fonts/Onest-Medium.ttf`, `assets/fonts/OFL.txt` | fontbestanden (statische TTF) en licentie | bestaand, geleverd door spec 02 in bouwstap 2; deze spec leest ze alleen | `lib/og.tsx` |
| `components/brand/logo-paths.json` | logopaden en viewBoxen | bestaand, geleverd door spec 02; deze spec leest het logo via `logoDataUri()` uit `components/brand/logo-svg.ts` | `lib/og.tsx` |
| `app/opengraph-image.tsx` | site-brede OG-afbeelding | herschreven | alle pagina's zonder eigen beeld |
| `app/twitter-image.tsx` | hergebruikt de OG-afbeelding | ongewijzigd | idem |
| `app/[locale]/vacatures/[slug]/opengraph-image.tsx` en `twitter-image.tsx` | OG per vacature | nieuw | spec 06 |
| `app/[locale]/werken-als/[beroep]/opengraph-image.tsx` en `twitter-image.tsx` | OG per beroep, werkzoekende | nieuw | spec 05 |
| `app/[locale]/werkgevers/[beroep]/opengraph-image.tsx` en `twitter-image.tsx` | OG per beroep, werkgever | nieuw | spec 05 |
| `app/sitemap.ts` | sitemap | herschreven (§4.7) | crawlers |
| `app/robots.ts` | robots.txt | herschreven (§4.8) | crawlers |
| `app/llms.txt/route.ts` | llms.txt | herschreven (§4.9) | AI-assistenten |
| `components/seo/json-ld.tsx` | `JsonLd` | ongewijzigd (props `{ data: Record<string, unknown> \| Record<string, unknown>[] }`) | alle pagina's |

Spec 01 heeft in bouwstap 3 een minimale sitemap en `llms.txt` gemaakt zonder
vacatures. Deze spec vervangt beide in bouwstap 5.

### 4.2 `lib/seo.ts`: basis en `pageMetadata()`

```ts
import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { contact, site, socials } from "@/lib/site";

export const SITE_URL: string = site.url;                       // "https://www.groospersoneelsdiensten.nl"
export const ORGANIZATION_ID = `${SITE_URL}/#organization` as const;
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const TITLE_MAX = 60;
export const BRAND_SUFFIX = ` | ${contact.shortName}`;           // " | Groos Personeelsdiensten"
export const BRAND_SUFFIX_SHORT = " | Groos";
export const ADDRESS_REGION = "Zuid-Holland";

export type JsonLdObject = Record<string, unknown>;

/** Bestaand. "/" of een pad dat met "/" begint, eventueel met query. nl zonder prefix, en met "/en". */
export function localizedPath(locale: Locale | string, path: string): string;
/** Bestaand. SITE_URL plus pad. */
export function absoluteUrl(path: string): string;

/** Titel met merk: eerst " | Groos Personeelsdiensten", past dat niet binnen 60 tekens dan " | Groos", anders de titel zelf (alleen een vangnet: een eigen deel van hoogstens 52 tekens past altijd met " | Groos"). */
export function brandedTitle(title: string, max?: number): string;

/** Canonical en hreflang. Standaard: canonical naar zichzelf, languages nl, en en x-default (naar nl). */
export function alternatesFor(
  locale: Locale,
  path: string,
  options?: {
    /** false: geen languages (vacaturedetail, B-03). */
    languages?: boolean;
    /** Afwijkende canonical, bijvoorbeeld de NL-vacature vanaf /en. */
    canonical?: { locale: Locale; path: string };
  },
): NonNullable<Metadata["alternates"]>;

/** Pad van de OG-afbeelding van een segment met een eigen opengraph-image.tsx. */
export function ogImagePath(locale: Locale, path: string): string;   // `${localizedPath(locale, path)}/opengraph-image`

export type OgImage = { url: string; alt: string; width?: number; height?: number };

export type PageMetadataInput = {
  locale: Locale;
  /** Pad zonder taalprefix, bijvoorbeeld "/werkgevers/schoonmakers" of "/vacatures?pagina=2". */
  path: string;
  /** Eigen deel van de titel, zonder merk: bij voorkeur 25 tot 45 tekens, hoogstens 52 (B-44). */
  title: string;
  description: string;
  keywords?: string[];
  /** true: de titel krijgt geen merkachtervoegsel (alleen home, die heeft het merk al in meta.titleDefault). */
  absoluteTitle?: boolean;
  /** Standaard true. false: geen alternates.languages. */
  languages?: boolean;
  canonical?: { locale: Locale; path: string };
  /** true: robots "noindex, follow". */
  noindex?: boolean;
  /** Standaard { url: "/opengraph-image", alt: contact.shortName, 1200 bij 630 }. */
  image?: OgImage;
};

export function pageMetadata(input: PageMetadataInput): Metadata;
```

**Gedrag van `pageMetadata()`**

1. `fullTitle = absoluteTitle ? title : brandedTitle(title)`. De functie geeft `title: { absolute: fullTitle }` terug, zodat `meta.titleTemplate` van de layout nooit een tweede achtervoegsel toevoegt en de lengteregel gegarandeerd is. `openGraph.title` en `twitter.title` zijn gelijk aan `fullTitle` (spec 03 §7: zelfde scheidingsteken).
2. `alternates = alternatesFor(locale, path, { languages, canonical })`. Relatieve paden worden door `metadataBase` uit de layout absoluut.
3. `robots`: bij `noindex` `{ index: false, follow: true }`; anders `{ index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }`. De robots van de pagina vervangen die van de layout (`generate-metadata.md`, samenvoegen).
4. `openGraph`: `type: "website"`, `locale` `nl_NL` of `en_GB`, `url` gelijk aan de canonical, `siteName: contact.shortName`, `title`, `description`, `images: [image]`. Nooit een los `openGraph`-object in een pagina (CLAUDE.md).
5. `twitter`: `card: "summary_large_image"`, `title`, `description`, `images: [image.url]`.
6. In development (`process.env.NODE_ENV !== "production"`) een `console.warn` met pad en lengte als het eigen deel van de titel (`title`, zonder `absoluteTitle`) langer is dan 52 tekens (B-44), als `fullTitle` langer is dan 60 tekens of als de beschrijving van een indexeerbare pagina buiten 120 tot 160 tekens valt. In productie geen controle. De derde terugval van `brandedTitle()` (titel zonder merk) blijft alleen een vangnet: met een eigen deel van hoogstens 52 tekens krijgt elke titel minstens " | Groos".
7. `keywords` gaat ongewijzigd mee; het meta-keywordsveld heeft geen rankingwaarde en is alleen voor consistentie (spec 03 §7).

`absoluteTitle` geldt alleen voor `/` en `/en`: daar is de titel `meta.titleDefault`
("Uitzendbureau in Den Haag | Groos Personeelsdiensten"). Op alle andere pagina's
geeft de pagina het eigen deel mee.

Een pagina met een eigen `opengraph-image.tsx` geeft `image: { url:
ogImagePath(locale, path), alt }` mee. Next laat een bestandsgebaseerde
OG-afbeelding in hetzelfde segment voorgaan op `generateMetadata`
(`generate-metadata.md`, "File-based metadata has the higher priority"); door
dezelfde URL mee te geven zijn `og:image` en `twitter:image` altijd gelijk. Er
ontstaat geen hash-achtervoegsel, omdat de routes geen groeps- of parallelle
segmenten bevatten (`next/dist/lib/metadata/get-metadata-route.js`).

### 4.3 `lib/seo.ts`: helpers voor vacaturepagina's

Spec 06 roept deze twee functies aan in `generateMetadata`; de regels voor lengte
en inkorting staan hier, zodat ze op één plek getest worden. De pagina haalt
`city`, `hours`, `wage` en `startDate` uit `getVacancySeoParts(vacancy, locale)` in
`components/vacatures/vacancy-format.ts` (spec 06, §10 stap 4).

```ts
import type { VacancyDetail } from "@/lib/data/types";

/** Sleutels onder vacatures.meta (eigenaar spec 06 §6.1 en §6.2; namen van spec 06). */
export type VacancyMetaKey =
  | "title" | "description" | "titlePaged" | "descriptionPaged"
  | "detailTitle" | "detailDescription" | "detailDescriptionShort"
  | "startAsapSentence" | "startDateSentence"
  | "closedTitleFilled" | "closedTitleOther" | "closedDescriptionFilled" | "closedDescriptionOther"
  | "ogAlt";
export type VacancyMetaTranslator = (key: VacancyMetaKey, values?: Record<string, string | number>) => string;

/** Metadata voor /vacatures (B-16). */
export function vacancyListMetadata(input: {
  locale: Locale;
  t: VacancyMetaTranslator;
  page: number;          // uit parseVacancySearchParams (spec 10)
  isFiltered: boolean;   // idem
}): Metadata;

/** Metadata voor /vacatures/[slug] in beide talen, open of gesloten. */
export function vacancyMetadata(input: {
  locale: Locale;
  vacancy: VacancyDetail;
  t: VacancyMetaTranslator;
  /** Verplicht. Plaatsnaam zoals de pagina hem toont: displayCity(vacancy.city, locale) (spec 06). */
  city: string;
  /** "32 tot 40 uur per week": common.format.hoursRange of hoursPerWeek met lib/format.ts (spec 03). */
  hours: string;
  /** "€ 16,08 tot € 17,50 bruto per uur": common.format.wageRange of wagePerHour. */
  wage: string;
  /** Opgemaakte startdatum met formatDate (spec 03), of null bij startAsap of een datum in het verleden. */
  startDate: string | null;
}): Metadata;
```

**`vacancyListMetadata`**

| Situatie | Titel | Beschrijving | Canonical | Robots | hreflang |
|---|---|---|---|---|---|
| geen filter, `page` 1 | `t("title")` | `t("description")` | `/vacatures` | index | nl, en, x-default |
| geen filter, `page` 2 of hoger | `t("titlePaged", { page })` | `t("descriptionPaged", { page })` | `/vacatures?pagina=<page>` | index | idem, met dezelfde query |
| `isFiltered` (filter, zoekterm of sortering) | `t("title")` | `t("description")` | `/vacatures` | `noindex, follow` | nl, en, x-default zonder query |

**`vacancyMetadata`**

1. `path = vacancy.path` (`/vacatures/<slug>`, altijd de juiste slug uit de database).
2. `vacancy.state === "open"`: titel `t("detailTitle", { title, city })`, met `city` uit de invoer. Beschrijving: `start = startDate ? t("startDateSentence", { date: startDate }) : t("startAsapSentence")`; `d = t("detailDescription", { title, city, hours, wage, start })`; is `d` langer dan 160 tekens, dan `t("detailDescriptionShort", { title, city, hours, wage })`. Gebruikt de beheerder `seoTitle` of `seoDescription` (spec 10, `vacancy_translations`), dan gaan die voor, maar alleen bij `locale === "nl"`; op `/en` gelden altijd de sjablonen. Is ook `detailDescriptionShort` langer dan 160 tekens, dan `summary`, afgekapt op het laatste hele woord onder 157 tekens plus "...".
3. `vacancy.state === "closed"`: bij `closeReason === "filled"` `closedTitleFilled` en `closedDescriptionFilled`, anders `closedTitleOther` en `closedDescriptionOther`, met `{ title, city, occupation }` waarbij `occupation` de kleine-letternaam van het beroep is (`occupation.nameNl` of `nameEn`, eerste letter klein). `noindex: true`. `seoTitle` en `seoDescription` worden dan genegeerd.
4. Altijd `languages: false` (spec 01 §4.11.6).
5. `locale === "en"`: `canonical: { locale: "nl", path }`. Op `/en` staat geen eigen noindex bij een open vacature, omdat noindex samen met een canonical naar een andere URL tegenstrijdige signalen geeft; de canonical en het ontbreken in de sitemap zijn genoeg.
6. `image: { url: ogImagePath(locale, path), alt: t("ogAlt", { title, city }) }`.

### 4.4 `lib/seo.ts`: JSON-LD-builders

Alle builders zijn pure functies zonder `next/*`-imports, zodat ze met Vitest te
testen zijn. Ze geven objecten met `"@context": "https://schema.org"` terug en
worden gerenderd met `<JsonLd data={...} />`. Velden met een lege waarde worden
weggelaten, nooit als `undefined`, lege string of `TODO` meegestuurd.

```ts
/** Site-breed in app/[locale]/layout.tsx. */
export function organizationLd(input: { description: string }): JsonLdObject;
export function websiteLd(input: { locale: Locale }): JsonLdObject;

/** Op / en /contact (beide talen). Vervangt localBusinessLd. */
export function employmentAgencyLd(input: { locale: Locale; description: string }): JsonLdObject;

/** Op /werkgevers/[beroep]. */
export function serviceLd(input: {
  locale: Locale;
  path: string;              // "/werkgevers/schoonmakers"
  name: string;              // paginakop, bijvoorbeeld "Schoonmakers inhuren in Den Haag"
  serviceType: string;       // bijvoorbeeld "Uitzenden van schoonmakers" (copy van spec 05)
  description: string;       // metabeschrijving van de pagina
}): JsonLdObject;

/** Alleen via Breadcrumbs (spec 01). Paden al gelokaliseerd. */
export function breadcrumbLd(items: { name: string; path: string }[]): JsonLdObject;

/** Alleen met de vragen die zichtbaar op de pagina staan. */
export function faqLd(items: { q: string; a: string }[]): JsonLdObject;

/** Alleen op /vacatures/[slug] in het Nederlands; null als de vacature niet open is. */
export function jobPostingLd(input: {
  vacancy: VacancyDetail;
  /** Dezelfde h2's als op de pagina: vacatures.detail.sections.{tasks,requirements,offer,extra} (spec 06), in het Nederlands. */
  labels: JobPostingLabels;
  /** Precies [uren, uurloon, startzin], dezelfde waarden als hours, wage en start in vacancyMetadata. */
  facts: string[];
  /** vacatures.detail.minAge.<minAgeReason> als minAge18 waar is, anders null (B-32). */
  minAgeSentence: string | null;
}): JsonLdObject | null;

export type JobPostingLabels = { tasks: string; requirements: string; offer: string; extra: string };
export type EmploymentType = "FULL_TIME" | "PART_TIME" | "TEMPORARY" | "CONTRACTOR" | "PER_DIEM" | "OTHER";

/** Exporteren voor tests. */
export function employmentTypesFor(contractType: ContractType, hoursMin: number, hoursMax: number): EmploymentType[];
export function jobDescriptionHtml(vacancy: VacancyDetail, labels: JobPostingLabels, facts: string[], minAgeSentence: string | null): string;
export function escapeHtml(value: string): string;   // & < > " ' naar entiteiten
```

**`organizationLd`**

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.groospersoneelsdiensten.nl/#organization",
  "name": "Groos Personeelsdiensten",
  "legalName": "Groos Personeelsdiensten B.V.",
  "url": "https://www.groospersoneelsdiensten.nl",
  "logo": "https://www.groospersoneelsdiensten.nl/brand/logo.png",
  "description": "<meta.organizationDescription>",
  "email": "info@groospersoneelsdiensten.nl",
  "telephone": "+31652549539",
  "sameAs": ["<socials[].href, alleen als er zijn>"]
}
```

**`websiteLd`**: `@type` `WebSite`, `@id` `<absolute URL van / of /en>#website`,
`url` die URL, `name` `contact.shortName`, `inLanguage` `nl-NL` of `en-GB`,
`publisher` `{ "@id": ORGANIZATION_ID }`. Geen `SearchAction` (Google toont het
zoekvak van sitelinks niet meer).

**`employmentAgencyLd`**

| Veld | Waarde | Bron |
|---|---|---|
| `@type` | `"EmploymentAgency"` (`site.schemaType`) | spec 01 |
| `@id` | `ORGANIZATION_ID` | zelfde entiteit als `organizationLd`; JSON-LD voegt beide knopen samen |
| `name`, `legalName` | `contact.shortName`, `contact.name` | `lib/site.ts` |
| `url` | `absoluteUrl(localizedPath(locale, "/"))` | |
| `logo`, `image` | `absoluteUrl(site.logo)`, `absoluteUrl("/opengraph-image")` | |
| `description` | `meta.organizationDescription` van de taal | spec 03 |
| `telephone`, `email` | `contact.phoneE164`, `contact.email` | B-21, B-02 |
| `address` | `PostalAddress` met `streetAddress` `contact.street`, `postalCode` `contact.postalCode`, `addressLocality` `contact.city`, `addressRegion` `ADDRESS_REGION`, `addressCountry` `"NL"` | B-23 |
| `areaServed` | `site.areaServed` (Den Haag als `City`), plus `{ "@type": "AdministrativeArea", name: "Haaglanden" }` alleen als `isClaimConfirmed("workArea")` waar is | spec 01 (`site.areaServed`), spec 03 (`lib/claims.ts`), B-43 |
| `knowsLanguage` | `["nl", "en"]` uit `routing.locales` | |
| `contactPoint` | één `ContactPoint` met `contactType: "customer service"`, `telephone`, `email`, `areaServed: "NL"`, `availableLanguage: ["Dutch", "English"]` | |
| `openingHoursSpecification` | alleen als `contact.openingHours` gevuld is: `dayOfWeek` maandag tot en met vrijdag, `opens` en `closes` als `"07:00"` | B-22 |
| `identifier`, `iso6523Code` | alleen als `contact.kvk` gevuld is: `{ "@type": "PropertyValue", "propertyID": "KvK", "value": kvk }` en `"0106:<kvk>"` | context/10 §5 |
| `vatID` | alleen als `contact.btw` gevuld is | |
| `sameAs` | `socials[].href`, alleen als er zijn | |
| niet | `geo` (adres is verborgen in het Bedrijfsprofiel en niet voor bezoek bedoeld), `aggregateRating`, `review`, `priceRange` | B-23, B-26 |

**`serviceLd`**: `@type` `Service`, `name`, `serviceType`, `description`, `url`
`absoluteUrl(localizedPath(locale, path))`, `areaServed` zoals bij
`employmentAgencyLd` (`site.areaServed` met Den Haag als `City`, plus
`{ "@type": "AdministrativeArea", name: "Haaglanden" }` alleen als
`isClaimConfirmed("workArea")` waar is, B-43),
`audience` `{ "@type": "BusinessAudience" }`, `availableLanguage` `["nl", "en"]`,
`provider` `{ "@type": "EmploymentAgency", "@id": ORGANIZATION_ID, "name":
contact.name }`. Geen prijzen.

**`breadcrumbLd`** en **`faqLd`** blijven zoals in de repo (repo-inventaris §4).
`breadcrumbLd` geeft `position` 1 tot en met n en absolute `item`-URL's. Google
toont FAQ-resultaten sinds 2023 bijna alleen nog voor overheid en zorg; de markup
blijft omdat hij klein is en AI-zoekfuncties hem lezen.

### 4.5 `jobPostingLd`: gedrag

1. Geeft `null` als `vacancy.state !== "open"`. De pagina roept de functie alleen aan bij `locale === "nl"` (spec 01 §4.11.6).
2. `description` is `jobDescriptionHtml(vacancy, labels, facts, minAgeSentence)` en volgt de volgorde van de pagina (spec 06):

```html
<p>{intro}</p>
<p>{facts[0]}. {facts[1]}. {facts[2]}</p>         (uren, uurloon, startzin)
<p><strong>{labels.tasks}</strong></p><ul><li>{tasks[0]}</li>...</ul>
<p><strong>{labels.requirements}</strong></p><ul><li>{requirements[0]}</li>...<li>{minAgeSentence}</li></ul>
<p><strong>{labels.offer}</strong></p><ul><li>{offer[0]}</li>...<li>{salaryNote}</li></ul>
<p><strong>{labels.extra}</strong></p><p>{extra}</p>   (alleen als extra gevuld is; alinea's op lege regel gesplitst)
```

   De minimumleeftijdzin (`vacatures.detail.minAge.<reason>`) is het laatste `<li>` onder requirements, alleen als `minAgeSentence` gevuld is; `salaryNote` is het laatste `<li>` onder offer, alleen als die gevuld is. Elke waarde gaat eerst door `escapeHtml`. Lege lijsten en lege alinea's vervallen. De feiten staan in één alinea, gescheiden door een spatie; de functie voegt alleen een punt toe als een feit niet al op "." eindigt (de startzin heeft er al een). `JsonLd` escapet daarna `<` als `<`; dat blijft geldige JSON en Google leest de HTML correct.
3. De veldmapping staat in §5.3. Velden zonder bruikbare waarde worden weggelaten.
4. Het object heeft `"@context": "https://schema.org/"` en `"@type": "JobPosting"`, met daarbij `url` (absolute NL-URL van de vacature).

### 4.6 OG-afbeeldingen

**`lib/og.tsx`** (alleen server, Node-runtime)

```tsx
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { brand } from "@/lib/brand";

export const OG_CONTENT_TYPE = "image/png";
export { OG_SIZE } from "@/lib/seo";

/** Kleurrollen voor de OG-afbeeldingen; waarden komen uit lib/brand.ts (spec 02), nooit hex hier. */
export const OG_COLORS = {
  canvas: brand.colors.background,
  ink: brand.colors.foreground,
  muted: brand.colors.muted,
  accent: brand.colors.accent,
  accentSoft: brand.colors.brandTint,
  onAccent: brand.colors.background,
} as const;

/**
 * Leest één keer per proces (module scope) de drie fonts van spec 02:
 * assets/fonts/InstrumentSans-SemiBold.ttf, assets/fonts/Onest-Regular.ttf en assets/fonts/Onest-Medium.ttf.
 */
export function loadOgFonts(): Promise<NonNullable<ConstructorParameters<typeof ImageResponse>[1]>["fonts"]>;

/**
 * Logo in kleur als SVG-data-URI (beeldmerk links, woordmerk rechts, zonder beschrijver), opgebouwd
 * uit components/brand/logo-paths.json (spec 02 §4.11, B-61). Vervangt loadLogoDataUri met logo.png.
 */
export function logoDataUri(): string;

export type OgCardProps = {
  /** Klein label boven de kop, bijvoorbeeld "Vacature" of "Werkgevers". Geen hoofdletters. */
  label?: string;
  title: string;
  /** Hoogstens twee korte regels onder de kop. */
  lines?: string[];
  /** Eén regel in de accentkleur, bijvoorbeeld het uurloon. */
  highlight?: string;
  /** Rechtsonder, standaard "groospersoneelsdiensten.nl" (hostnaam van site.url zonder "https://www."). */
  footer?: string;
};

/** Rendert de kaart als ImageResponse van 1200 bij 630. */
export function renderOgCard(props: OgCardProps): Promise<ImageResponse>;
```

Opmaak van `OgCard` (inline styles, want `ImageResponse` ondersteunt geen
Tailwind-klassen uit de app):

- Achtergrond `OG_COLORS.canvas` (wit), binnenmarge 72 px. Links een verticale balk van 12 px breed over de volle hoogte in `OG_COLORS.accent` (kobalt, B-01). Geen verlopen, geen glans, geen raster (B-29).
- Bovenaan het logo in kleur (beeldmerk met woordmerk) als `<img>` met de SVG-data-URI van `logoDataUri()` (uit `components/brand/logo-svg.ts`), 48 px hoog en ongeveer 217 px breed (viewBox 166,18 bij 36,75), zonder losse naamtekst ernaast.
- Daaronder, bij `label`, het label in Onest 500, 28 px, kleur `accent`, gewone hoofdletters (spec 03: geen `uppercase`).
- De kop in Instrument Sans 600, kleur `ink`, regelafstand 1,1, hoogstens drie regels: 76 px tot 28 tekens, 64 px tot 44 tekens, anders 56 px. Langer dan 90 tekens wordt afgekapt met een beletselteken.
- `lines` in Onest 400, 34 px, kleur `muted`. `highlight` als pil met achtergrond `accentSoft` (ijs) en tekst `accent`, Onest 500, 34 px.
- Rechtsonder `footer` ("groospersoneelsdiensten.nl") in Onest 400, 26 px, kleur `accent`.
- Het label is de enige tekst boven de kop en is geen kop; de afbeelding is geen HTML, dus B-05 geldt niet. De alt-tekst noemt alles wat op het beeld staat.

**Fonts.** `loadOgFonts` leest de statische TTF-bestanden die spec 02 in
bouwstap 2 in `assets/fonts/` zet: `InstrumentSans-SemiBold.ttf` (Instrument Sans
600), `Onest-Regular.ttf` (Onest 400) en `Onest-Medium.ttf` (Onest 500). Satori
ondersteunt geen variabele fonts en geen woff2. Spec 02 haalt de bestanden op en
levert ook `assets/fonts/OFL.txt` (SIL Open Font License); deze spec heeft geen
eigen map of downloadscript. De fonts worden gelezen met
`readFile(join(process.cwd(), "assets/fonts/<naam>.ttf"))` op modulescope, zoals de Next-documentatie voorschrijft
(`opengraph-image.md`, "Using Node.js runtime with local assets"); Next neemt de
bestanden dan mee in de functiebundel.

**Routes**

| Route (bestand) | URL | Inhoud | Caching |
|---|---|---|---|
| `app/opengraph-image.tsx` | `/opengraph-image` (buiten de proxy) | `title: meta.ogHeadline`, `lines: [meta.ogSubline]`, geen label, geen highlight; tekst uit `messages/nl/meta.json` (B-45) | statisch |
| `app/[locale]/vacatures/[slug]/opengraph-image.tsx` | `/vacatures/<slug>/opengraph-image`, `/en/vacatures/<slug>/opengraph-image` (door de proxy, spec 01 §4.12) | open: `label: vacatures.og.label`, `title: vacancy.title`, `lines: [displayCity(vacancy.city, locale), hours]`, `highlight: wage`; gesloten: `lines: [displayCity(vacancy.city, locale)]`, `highlight: vacatures.og.closed`; onbekend nummer of `null`: de site-brede kaart | `export const revalidate = 3600`; data via `getVacancyByNumber` met tags; ververst mee met `revalidatePath("/[locale]/vacatures", "layout")` uit `revalidateVacancies` (spec 10) |
| `app/[locale]/werken-als/[beroep]/opengraph-image.tsx` | `/werken-als/<slug>/opengraph-image` en `/en/...` | `label: header.nav.werkzoekenden`, `title: beroepen.og.werkzoekende` met `{ occupation, occupationPlural }`, `lines: [meta.ogSubline]` | statisch (params uit `generateStaticParams` van de pagina) |
| `app/[locale]/werkgevers/[beroep]/opengraph-image.tsx` | `/werkgevers/<slug>/opengraph-image` en `/en/...` | `label: header.nav.werkgevers`, `title: beroepen.og.werkgever` met `{ occupation, occupationPlural }`, `lines: [meta.ogSubline]` | statisch |

Elke route exporteert `alt` (dynamische routes met `generateImageMetadata` zijn niet nodig),
`size = OG_SIZE` en `contentType = OG_CONTENT_TYPE`, en heeft een
`twitter-image.tsx` ernaast met `export { default, alt, size, contentType } from
"./opengraph-image";`. De dynamische routes lezen `params` als Promise
(`{ locale, slug }` of `{ locale, beroep }`), zetten de taal met
`resolveLocale` (spec 01) en halen teksten met `getTranslations({ locale,
namespace })`. Bedragen en uren gaan door `formatEuro` en de sleutels
`common.format.*` (spec 03), net als op de pagina. De plaatsnaam gaat door
`displayCity(city, locale)` van spec 06 (`components/vacatures/vacancy-format.ts`),
zodat `/en` "The Hague" toont. De beroepsroutes geven beide sleutels dezelfde twee
parameters mee: `{ occupation }` is `beroepen.<id>.enkelvoud` met een kleine eerste
letter en `{ occupationPlural }` is `beroepen.<id>.meervoud` zoals hij is. De
site-brede afbeelding blijft Nederlands; `/en` gebruikt hetzelfde beeld (§12).

Het nummer komt uit `parseVacancySlug(slug)` (spec 10). Een afwijkende slug geeft
geen 308 in de OG-route; de afbeelding hoort bij het nummer.

### 4.7 `app/sitemap.ts`

```ts
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { beroepen } from "@/content/beroepen";
import { STATIC_ROUTES, BEROEP_ROUTE_META, paths, type StaticPath } from "@/lib/routes";
import { LEGAL_DOCS } from "@/lib/legal";
import { getVacancySitemapEntries } from "@/lib/data/vacancies";
import { absoluteUrl, localizedPath } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap>;
```

Regels:

1. **Vaste routes.** Elke `RouteMeta` uit `STATIC_ROUTES` met `published` waar en `sitemap !== null`. `published` komt voor alle vaste routes uit `STATIC_ROUTES`; voor de juridische routes leest `lib/routes.ts` die waarde uit `lib/legal.ts` (`getLegalDoc(<id>).published`, B-40), zodat de sitemap maar één bron leest. `lastModified` van een juridische route is `updatedAt` uit `LEGAL_DOCS` (spec 09). Per route één entry per taal, elk met `alternates.languages` voor `nl`, `en` en `x-default` (absolute URL's), plus `changeFrequency` en `priority` uit `RouteMeta.sitemap`.
2. **Beroepspagina's.** Voor elk item uit `beroepen`: `paths.werkenAls(id)` met `BEROEP_ROUTE_META.werkzoekende` en `paths.werkgeverBeroep(id)` met `BEROEP_ROUTE_META.werkgever`, per taal met alternates. Samen twintig entries.
3. **Vacatures.** `getVacancySitemapEntries()` (spec 10) geeft alleen open vacatures. Per vacature één entry: `url: absoluteUrl(entry.path)` (NL), `lastModified: entry.lastModified`, `changeFrequency: "daily"`, `priority: 0.8`, zonder alternates. Geen `/en/vacatures/*`.
4. **lastModified van `/` en `/vacatures`** (beide talen) is de laatste `lastModified` van de vacatures, omdat die pagina's vacatures tonen. Andere vaste routes en beroepspagina's krijgen geen `lastModified`; een onjuiste datum kost crawlbudget (context/10 §3).
5. **Nooit erin**: `/bedankt/*`, `/algemene-voorwaarden` zolang `published` onwaar is, URL's met een query (filters en paginering), gesloten, geplande, concept- en gearchiveerde vacatures, `/beheer`, `/api`, `/feeds`.
6. **Volgorde**: vaste routes in de volgorde van `STATIC_ROUTES`, dan beroepen in registervolgorde, dan vacatures op nummer aflopend.
7. **Verversen**: `revalidate = 3600` als vangnet; `revalidateVacancies()` (spec 10) roept `revalidatePath("/sitemap.xml")` aan bij elke wijziging. Zonder `.env.local` geeft `getVacancySitemapEntries()` een lege lijst, zodat `npm run build` blijft werken.

Eén sitemap volstaat: bij 10 tot 100 vacatures blijft hij ver onder de grens van
50.000 URL's. Een aparte vacaturesitemap is fase 2 (§3.3).

### 4.8 `app/robots.ts`

```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/beheer", "/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

Uitvoer:

```
User-Agent: *
Allow: /
Disallow: /beheer
Disallow: /api/

Sitemap: https://www.groospersoneelsdiensten.nl/sitemap.xml
```

- Filterpagina's, `/bedankt/*` en gesloten vacatures worden niet geblokkeerd: Google moet de `noindex` kunnen lezen (context/10 §8).
- Geen `host`-regel meer (alleen Yandex las die).
- Geen aparte regels voor AI-crawlers; de site is publiek en `llms.txt` is juist voor hen.
- Preview-deploys krijgen `X-Robots-Tag: noindex` van Vercel zelf (spec 13 §7); `robots.ts` kent geen omgevingslogica.

### 4.9 `app/llms.txt/route.ts`

`export const dynamic = "force-static"`. De route leest `messages/nl/<namespace>.json` (B-45),
`contact` en `site` uit `lib/site.ts`, `STATIC_ROUTES` en `paths` uit
`lib/routes.ts`, `beroepen` uit `content/beroepen` en `publishedLegalDocs()` uit
`lib/legal.ts`. Ze bevat geen vacaturedata: vacatures wisselen vaak en de lijst
op `/vacatures` is altijd actueel. De koppen van `llms.txt` staan inline in de
route (machinebestand, net als nu).

Inhoud (voorbeelduitvoer met de huidige gegevens):

```markdown
# Groos Personeelsdiensten

> Groos Personeelsdiensten B.V. is een uitzendbureau in Den Haag. Wij leveren glazenwassers, schoonmakers, logistiek medewerkers, verhuizers en hulpkrachten bouw en sloop aan opdrachtgevers.

Groos Personeelsdiensten B.V., Hugo Coenraadspad 6, 2553 ER Den Haag. Langskomen kan alleen op afspraak. Telefoon en WhatsApp: 06 52 54 95 39. E-mail: info@groospersoneelsdiensten.nl.

Werkzoekenden solliciteren op een vacature of schrijven zich in via https://www.groospersoneelsdiensten.nl/inschrijven. Opdrachtgevers vragen personeel aan via https://www.groospersoneelsdiensten.nl/werkgevers/personeel-aanvragen.

## Werkzoekenden

- [Vacatures](https://www.groospersoneelsdiensten.nl/vacatures): <vacatures.meta.description>
- [Werkzoekenden](https://www.groospersoneelsdiensten.nl/werkzoekenden): <werkzoekenden.meta.description>
- [Inschrijven](https://www.groospersoneelsdiensten.nl/inschrijven)
- [Werken als glazenwasser](https://www.groospersoneelsdiensten.nl/werken-als/glazenwasser)
- ... (vijf beroepen)

## Werkgevers

- [Werkgevers](https://www.groospersoneelsdiensten.nl/werkgevers): <werkgevers.meta.description>
- [Personeel aanvragen](https://www.groospersoneelsdiensten.nl/werkgevers/personeel-aanvragen)
- [Inlenen en de Wtta](https://www.groospersoneelsdiensten.nl/werkgevers/wtta)
- [Glazenwassers](https://www.groospersoneelsdiensten.nl/werkgevers/glazenwassers)
- ... (vijf beroepen)

## Groos

- [Over ons](https://www.groospersoneelsdiensten.nl/over-ons)
- [Contact](https://www.groospersoneelsdiensten.nl/contact)

## Optional

- [Privacyverklaring](https://www.groospersoneelsdiensten.nl/privacyverklaring)
- [Cookieverklaring](https://www.groospersoneelsdiensten.nl/cookieverklaring)
- [Klachtenregeling](https://www.groospersoneelsdiensten.nl/klachtenregeling)
- [English version](https://www.groospersoneelsdiensten.nl/en)
```

Regels:

- De blockquote is `meta.organizationDescription` (spec 03). De NAW-regel wordt opgebouwd uit `contact` en `common.address.byAppointment` (spec 01); KvK en btw komen er alleen bij als ze gevuld zijn. Zo bevat `llms.txt` nooit `TODO` (spec 14, `seo/robots-llms.spec.ts`).
- Linkteksten komen uit `header.nav.*` (spec 01). Beroepen: "Werken als " plus `beroepen.<id>.enkelvoud` met kleine eerste letter, en `beroepen.<id>.meervoud` voor werkgevers.
- Een beschrijving na de dubbele punt staat er alleen als `<namespace>.meta.description` in `messages/nl/<namespace>.json` bestaat (spec 03 §6.13, regel 4). De route gebruikt een vaste koppeling: `/vacatures` naar `vacatures`, `/werkzoekenden` naar `werkzoekenden`, `/werkgevers` naar `werkgevers`, `/over-ons` naar `about`, `/contact` naar `contact`. Ontbreekt de sleutel, dan alleen de link.
- Alleen routes met `published` en `llms` gevuld in `STATIC_ROUTES`; juridische documenten uit `publishedLegalDocs()` onder "Optional".
- `Content-Type: text/plain; charset=utf-8`.

## 5 Data

### 5.1 Wat deze module leest

Deze module bezit geen tabellen. Ze leest alleen via de data-laag van spec 10 en
de registers van spec 01 en 09.

| Bron | Gebruikt voor | Eigenaar |
|---|---|---|
| `VacancyDetail` uit `getVacancyByNumber(number)` | `vacancyMetadata`, `jobPostingLd`, OG per vacature | 10 |
| `getVacancySitemapEntries(): Promise<{ path; lastModified }[]>` | sitemap | 10 |
| `parseVacancySlug(slug)`, `parseVacancySearchParams(sp)` (`page`, `isFiltered`) | OG-route, `vacancyListMetadata` | 10 |
| `ContractType`, `EducationLevel`, `ExperienceLevel` uit `lib/data/options.ts` | mapping JobPosting | 10 |
| `site`, `contact`, `socials` uit `lib/site.ts` | alle builders, NAP | 01 |
| `STATIC_ROUTES`, `BEROEP_ROUTE_META`, `paths`, `routeMeta` uit `lib/routes.ts`; `beroepen` uit `content/beroepen/index.ts` | sitemap, llms.txt | 01 |
| `LEGAL_DOCS`, `publishedLegalDocs()` uit `lib/legal.ts` | sitemap, llms.txt | 09 |
| `brand.colors` uit `lib/brand.ts`, `logoDataUri()` uit `components/brand/logo-svg.ts`, fonts in `assets/fonts/` | OG | 02 |
| `public/brand/logo.png` (`site.logo`) | `logo` in `organizationLd`, `employmentAgencyLd` en `hiringOrganization` | 02 |
| `isClaimConfirmed("workArea")` uit `lib/claims.ts` | `areaServed` in `employmentAgencyLd` en `serviceLd` (B-43) | 03 |
| `displayCity(city, locale)`, `getVacancySeoParts(vacancy, locale)` en `todayInAmsterdam()` uit `components/vacatures/vacancy-format.ts` | plaatsnaam in de vacature-OG; de pagina geeft `city`, `hours`, `wage` en `startDate` aan `vacancyMetadata` en `[hours, wage, start]` als `facts` aan `jobPostingLd` | 06 |
| `formatEuro`, `formatDate` uit `lib/format.ts` | OG, metabeschrijving vacature | 03 |

### 5.2 Afbakening van vacaturevelden

De view `public_vacancies` geeft alleen vacatures met `state` `open` of `closed`
(spec 10 §5.7). Concept, gepland (voor `publish_at`), gearchiveerd en gesloten
langer dan 30 dagen bestaan voor deze module niet: `getVacancyByNumber` geeft
`null` en spec 06 roept `notFound()` aan.

### 5.3 Veldmapping JobPosting

| JobPosting-veld | Status bij Google | Waarde | Bron in `VacancyDetail` (spec 10) |
|---|---|---|---|
| `title` | verplicht | alleen de functie, bijvoorbeeld `"Glazenwasser"`; nooit plaats, loon of bedrijfsnaam | `title` (check 80 tekens, spec 03: hoogstens 60) |
| `description` | verplicht | HTML volgens §4.5 | `intro`, `tasks`, `requirements`, `offer`, `extra`, `salaryNote` plus `labels`, `facts` en `minAgeSentence` van de pagina |
| `datePosted` | verplicht | ISO 8601, bijvoorbeeld `"2026-09-27T07:00:00.000Z"`; verandert niet bij heropenen | `publishedAt` |
| `validThrough` | verplicht bij einddatum | ISO 8601 | `closesAt` (standaard 45 dagen, B-15) |
| `hiringOrganization` | verplicht | `{ "@type": "Organization", "@id": ORGANIZATION_ID, "name": contact.name, "sameAs": SITE_URL, "logo": absoluteUrl(site.logo) }`; Groos is bij uitzenden en detacheren de juridische werkgever | `lib/site.ts` |
| `jobLocation` | verplicht | `{ "@type": "Place", "address": { "@type": "PostalAddress", "addressLocality": city, "postalCode": postalCode (alleen als gevuld), "addressRegion": province, "addressCountry": "NL" } }`; de echte werkplaats, nooit het kantooradres van Groos | `city`, `postalCode`, `province` |
| `baseSalary` | aanbevolen | `{ "@type": "MonetaryAmount", "currency": "EUR", "value": { "@type": "QuantitativeValue", "minValue": salaryMin, "maxValue": salaryMax, "unitText": "HOUR" } }`; bij gelijke waarden `"value": salaryMin` in plaats van min en max | `salaryMin`, `salaryMax` (altijd bruto per uur) |
| `employmentType` | aanbevolen | `employmentTypesFor(contractType, hoursMin, hoursMax)`, zie hieronder | `contractType`, `hoursMin`, `hoursMax` |
| `directApply` | aanbevolen | `true`: het formulier staat op de pagina zonder inloggen (spec 07) | vast |
| `identifier` | aanbevolen | `{ "@type": "PropertyValue", "name": contact.name, "value": String(number) }` | `number` |
| `educationRequirements` | aanbevolen | `"no requirements"` bij `none`; anders `{ "@type": "EducationalOccupationalCredential", "credentialCategory": c }` met `vmbo`, `havo_vwo` naar `"high school"`, `mbo1` tot en met `mbo4` naar `"professional certificate"`, `hbo` en `wo` naar `"bachelor degree"` | `educationLevel` |
| `experienceRequirements` | aanbevolen | `"no requirements"` bij `none` en `nice_to_have`; bij `required` met `experienceMonths`: `{ "@type": "OccupationalExperienceRequirements", "monthsOfExperience": experienceMonths }`; bij `required` zonder maanden weglaten | `experienceLevel`, `experienceMonths` |
| `totalJobOpenings` | schema.org | alleen als `positionsCount > 1` | `positionsCount` |
| `jobStartDate` | schema.org | alleen als `startAsap` onwaar is: `startDate` (`"YYYY-MM-DD"`) | `startDate` |
| `url` | schema.org | `absoluteUrl(vacancy.path)` | `path` |
| niet | | `jobLocationType`, `applicantLocationRequirements` (geen thuiswerk), `image`, `salaryCurrency` los, `industry`, `qualifications`; geen cao-naam (B-24) | |

**`employmentTypesFor`**

| `contractType` | Basis | Uren | Resultaat (voorbeeld) |
|---|---|---|---|
| `temp_agency` (uitzenden) | `TEMPORARY` | plus `FULL_TIME` als `hoursMax >= 32`, plus `PART_TIME` als `hoursMin < 32` | 32 tot 40: `["TEMPORARY", "FULL_TIME"]`; 12 tot 20: `["TEMPORARY", "PART_TIME"]`; 24 tot 40: `["TEMPORARY", "FULL_TIME", "PART_TIME"]` |
| `secondment` (detachering) | `TEMPORARY` | idem | idem |
| `recruitment` (vaste baan bij opdrachtgever) | geen | alleen `FULL_TIME` en of `PART_TIME` volgens dezelfde grens | 36 tot 40: `["FULL_TIME"]` |

De grens van 32 uur volgt de uren-bucket `32-plus` van spec 10, zodat filter en
markup hetzelfde zeggen.

**Voorbeeld voor seedvacature 1001** (`/vacatures/glazenwasser-den-haag-1001`):

```json
{
  "@context": "https://schema.org/",
  "@type": "JobPosting",
  "title": "Glazenwasser",
  "description": "<p>Je maakt ramen en kozijnen ... om 07.00 uur.</p><p>32 tot 40 uur per week. € 16,08 tot € 17,50 bruto per uur. Je kunt direct beginnen.</p><p><strong>Je werkdag</strong></p><ul><li>Ramen wassen met een telescopisch wassysteem</li>...</ul><p><strong>Wat je meebrengt</strong></p><ul>...<li>Omdat je op hoogte werkt, is de minimumleeftijd 18 jaar.</li></ul><p><strong>Wat je van ons krijgt</strong></p><ul>...</ul>",
  "datePosted": "2026-09-27T16:00:00.000Z",
  "validThrough": "2026-11-11T16:00:00.000Z",
  "employmentType": ["TEMPORARY", "FULL_TIME"],
  "hiringOrganization": {
    "@type": "Organization",
    "@id": "https://www.groospersoneelsdiensten.nl/#organization",
    "name": "Groos Personeelsdiensten B.V.",
    "sameAs": "https://www.groospersoneelsdiensten.nl",
    "logo": "https://www.groospersoneelsdiensten.nl/brand/logo.png"
  },
  "jobLocation": {
    "@type": "Place",
    "address": { "@type": "PostalAddress", "addressLocality": "Den Haag", "addressRegion": "Zuid-Holland", "addressCountry": "NL" }
  },
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "EUR",
    "value": { "@type": "QuantitativeValue", "minValue": 16.08, "maxValue": 17.5, "unitText": "HOUR" }
  },
  "directApply": true,
  "identifier": { "@type": "PropertyValue", "name": "Groos Personeelsdiensten B.V.", "value": "1001" },
  "educationRequirements": "no requirements",
  "experienceRequirements": "no requirements",
  "url": "https://www.groospersoneelsdiensten.nl/vacatures/glazenwasser-den-haag-1001"
}
```

De koppen zijn gelijk aan de h2's die spec 06 op de pagina toont (`vacatures.detail.sections.*`).

### 5.4 Levenscyclus voor Google for Jobs (B-15)

| Toestand (spec 10) | HTTP | Robots | Canonical en hreflang | JSON-LD | Sitemap | OG-afbeelding |
|---|---|---|---|---|---|---|
| `draft` | 404 | Next zet `noindex` | n.v.t. | geen | nee | site-brede kaart |
| `scheduled` voor `publish_at` | 404 | idem | n.v.t. | geen | nee | site-brede kaart |
| open (`published`, of `scheduled` na `publish_at`, en `closes_at` in de toekomst) | 200 | index, follow | NL: zichzelf, geen hreflang; EN: canonical naar NL | NL: `JobPosting` plus `BreadcrumbList`; EN: alleen `BreadcrumbList` | ja, NL, `lastModified` uit `updated_at` | titel, plaats, uren, uurloon |
| gesloten tot 30 dagen (`closed`, of `published` met `closes_at` voorbij) | 200 met melding (spec 06) | `noindex, follow` | idem | geen `JobPosting`; wel `BreadcrumbList` | nee | titel, plaats, "Deze vacature is gesloten" |
| gesloten langer dan 30 dagen, of `archived` | 404 via `notFound()` | Next zet `noindex` | n.v.t. | geen | nee | site-brede kaart |
| afwijkende slug bij een bestaand nummer | 308 naar de juiste slug (spec 06) | n.v.t. | n.v.t. | n.v.t. | n.v.t. | volgt het nummer |

- De view berekent de toestand op het moment van lezen (spec 10 §5.4), dus een verlopen vacature verliest haar JobPosting ook als de cron-taak te laat is; de cache is dan hoogstens 3600 seconden oud. Bij elke zichtbaarheidswijziging uit `/beheer` of de cron ververst `revalidateVacancies(numbers, "visibility")` direct (spec 10 §4.4).
- `datePosted` blijft de eerste publicatie; verlengen past alleen `validThrough` aan.
- Google ziet een gesloten vacature dus eerst als `noindex` zonder markup en daarna als 404. Een 410 vraagt een extra laag in de proxy en levert geen voordeel op (B-15).
- Fase 2 voegt per overgang een Indexing API-melding toe (§3.3).

## 6 Tekstelementen

Toon, woordkeus en definitieve copy zijn van spec 03 en van de eigenaar van elke
namespace. Deze spec bezit geen messages-namespace. Hieronder staan de sjablonen
en de sleutels die deze module leest, met een verwijzing naar de eigenaar van de
tekst; ontbreekt een sleutel bij de bouw van stap 5, dan zet de bouw-agent hem met
de tekst uit de spec van de eigenaar in beide bestanden en meldt hij dat aan de
eigenaar.

### 6.1 Regels voor titels en beschrijvingen

- Titel: eigen deel van bij voorkeur 25 tot 45 tekens, hoogstens 52 (B-44), plus `brandedTitle()`. Totaal hoogstens 60 tekens. `pageMetadata()` waarschuwt in development bij een eigen deel boven 52 tekens (§4.2); de derde terugval van `brandedTitle()` (titel zonder merk) is alleen een vangnet. Scheidingsteken ` | ` met een spatie aan beide kanten (spec 03 §7 en spec 01 §6); geen gedachtestreepje.
- Beschrijving: 120 tot 160 tekens (spec 03, controle C-22), doel 140 tot 155. Twee zinnen: bewering met onderwerp en plaats, dan een concreet feit of een oproep (sjabloon ZS-15 van spec 03). Bandbreedtes met "tot", nooit met een streepje.
- Aanspreekvorm per doelgroep (B-04): je-vorm op `/vacatures*`, `/werkzoekenden`, `/werken-als/*`, `/inschrijven`; u-vorm op `/werkgevers*`; wij-zinnen of neutraal op `/`, `/over-ons`, `/contact` en juridisch. `audienceFor()` uit `lib/routes.ts` geeft de doelgroep van een pad.
- Geen onbevestigde claims (R-12): geen reactietermijn, geen "24/7", geen keurmerk, cao of Wtta-status, geen aantallen, geen klantnamen.
- EN: Brits Engels, "you", dezelfde lengtes. Vacaturetitels blijven Nederlands, ook in Engelse metadata (B-03).

### 6.2 Sjablonen per paginatype

Titels zonder merk; het merk zet `pageMetadata()` erachter. De beschrijvingen staan
alleen bij de eigenaar van de sleutel; deze tabel noemt per rij de sleutel en waar
de eigenaar de tekst vastlegt, zonder eigen tekst. Lengtes van de titels zijn
gemeten met de seedgegevens.

| Paginatype en vorm | Sleutels (eigenaar) | Titel NL / EN | Beschrijving NL | Beschrijving EN |
|---|---|---|---|---|
| Home `/` (wij, neutraal) | `meta.titleDefault`, `meta.description` (03) | "Uitzendbureau in Den Haag \| Groos Personeelsdiensten" (52) / "Employment agency in The Hague \| Groos Personeelsdiensten" (57), beide absoluut | spec 03 §6.14, `meta.description` | spec 03 §6.15, `meta.description` |
| Vacatures `/vacatures` (je) | `vacatures.meta.title`, `.description` (06) | Vacatures in Den Haag en omgeving / Jobs in The Hague and surroundings | spec 06 §6.1, `vacatures.meta.description` | spec 06 §6.2, `vacatures.meta.description` |
| Vacatures pagina n (je) | `vacatures.meta.titlePaged`, `.descriptionPaged` (06) | Vacatures in Den Haag en omgeving, pagina {page} / Jobs in The Hague and surroundings, page {page} | spec 06 §6.1, `vacatures.meta.descriptionPaged` | spec 06 §6.2, `vacatures.meta.descriptionPaged` |
| Vacature open (je) | `vacatures.meta.detailTitle`, `.detailDescription`, `.detailDescriptionShort`, `.startAsapSentence`, `.startDateSentence` (06) | {title} in {city} (beide talen, `city` via `displayCity`) | spec 06 §6.1 en §7.3, `vacatures.meta.detailDescription` en `.detailDescriptionShort` | spec 06 §6.2 en §7.3, `vacatures.meta.detailDescription` en `.detailDescriptionShort` |
| Vacature gesloten (je, noindex) | `vacatures.meta.closedTitleFilled`, `.closedTitleOther`, `.closedDescriptionFilled`, `.closedDescriptionOther` (06) | {title} in {city} (vervuld) of (gesloten) / {title} in {city} (filled) of (closed) | spec 06 §6.1, `vacatures.meta.closedDescriptionFilled` en `.closedDescriptionOther` | spec 06 §6.2, `vacatures.meta.closedDescriptionFilled` en `.closedDescriptionOther` |
| Inschrijven (je) | `forms.register.meta.*` (07) | Inschrijven of open solliciteren / Register or apply openly | spec 07 §6, `forms.register.meta.description` | spec 07 §6, `forms.register.meta.description` |
| Werkzoekenden (je) | `werkzoekenden.meta.*` (05) | Werk vinden via Groos / Find work through Groos | spec 05 §6, `werkzoekenden.meta.description` | spec 05 §6, `werkzoekenden.meta.description` |
| Werken als (je) | `copy.jobseeker.meta.*` in `content/beroepen/<id>.ts` (05) | Werken als {beroep} in Den Haag / Work as a {occupation} in The Hague | spec 05 §6.6 en §7.1 | spec 05 §6.6 en §7.1 |
| Werkgevers (u) | `werkgevers.meta.*` (05) | Personeel inhuren in Den Haag / Hire staff in The Hague | spec 05 §6, `werkgevers.meta.description` | spec 05 §6, `werkgevers.meta.description` |
| Werkgevers per beroep (u) | `copy.employer.meta.*` in `content/beroepen/<id>.ts` (05) | spec 05 §6.6 | spec 05 §6.6 en §7.1 | spec 05 §6.6 en §7.1 |
| Personeel aanvragen (u) | `forms.staffRequest.meta.*` (07) | Personeel aanvragen / Request staff | spec 07 §6, `forms.staffRequest.meta.description` | spec 07 §6, `forms.staffRequest.meta.description` |
| Wtta (u) | `werkgevers.wtta.meta.*` (05) | Inlenen en de Wtta / Hiring and the Wtta | spec 05 §6, `werkgevers.wtta.meta.description` | spec 05 §6, `werkgevers.wtta.meta.description` |
| Over ons (neutraal) | `about.meta.*` (04) | Over ons / About us | spec 04 §6, `about.meta.description` | spec 04 §6, `about.meta.description` |
| Contact (neutraal) | `contact.meta.*` (07) | Contact / Contact | spec 07 §6, `contact.meta.description` | spec 07 §6, `contact.meta.description` |
| Juridisch (neutraal) | `title` en `metaDescription` in `CONTENT` van de page (09) | documentnaam | spec 09 §4.4 en §6, `CONTENT.nl.metaDescription` | spec 09 §4.4 en §6, `CONTENT.en.metaDescription` |
| Bedankpagina's (doelgroep, noindex) | `bedankt.<key>.metaTitle` (07) | bijvoorbeeld Bedankt voor je sollicitatie | niet verplicht (spec 07 §6) | niet verplicht (spec 07 §6) |
| 404 (noindex) | `notFound.metaTitle` (03) | Pagina niet gevonden / Page not found | niet nodig | niet nodig |

`{start}` is `vacatures.meta.startAsapSentence` of `vacatures.meta.startDateSentence`
(spec 06). Valt de beschrijving boven 160 tekens, dan gebruikt `vacancyMetadata`
`detailDescriptionShort` zonder startmoment (spec 03 §7), en daarna zo nodig de
ingekorte `summary` (§4.3).

### 6.3 Zoekwoorden per beroep (context/10 §1)

Gebruik per pagina de hoofdterm in titel, h1 en eerste alinea en de
neventerm in een h2, de beschrijving of een FAQ-vraag. Geen opsommingen van
zoektermen in lopende tekst. Volumes zijn schattingen uit Google-autocomplete en
worden na livegang getoetst in Search Console.

| Beroep | Werkzoekende: hoofdterm, neventerm | Werkgever: hoofdterm, neventerm |
|---|---|---|
| `glazenwasser` | vacature glazenwasser den haag; glazenwasser worden | personeel voor glazenwasserij; uitzendbureau glazenwassers |
| `schoonmaker` | schoonmaakwerk den haag; avond schoonmaakwerk, parttime schoonmaakwerk | uitzendbureau schoonmaak den haag; schoonmaakpersoneel inhuren |
| `logistiek-medewerker` | orderpicker den haag, magazijnmedewerker den haag; heftruckchauffeur vacatures | uitzendbureau logistiek; logistiek personeel inhuren |
| `verhuizer` | verhuizer vacatures den haag; verhuizer gezocht | personeel voor verhuisbedrijf; uitzendkrachten verhuizing |
| `hulpkracht-bouw-en-sloop` | hulpkracht bouw, sloopwerk vacatures; opperman, handsloper | uitzendbureau bouw den haag; personeel inhuren bouw |
| alle (drempelverlagers) | werk zonder diploma den haag; direct aan het werk | n.v.t. |

De werkgeverstitels per beroep (NL en EN) staan in spec 05 §6.6; die spec is
leidend.

"Glazenwasser inhuren" en "verhuizers inhuren" zijn zoekopdrachten van
particulieren die hun ramen willen laten wassen of gaan verhuizen (context/10 §1).
Daarom wijken de werkgeverstitels en de beschrijvingen voor deze twee beroepen af
van het sjabloon "{Meervoud} inhuren in Den Haag" van spec 03 en noemen ze het
bedrijf (glazenwasserij, verhuisbedrijf) in plaats van de dienst. De teksten staan
in spec 05 §6.6.

De beroepspagina's van werkzoekenden noemen "zonder diploma" alleen als de
vacatures van dat beroep echt geen diploma vragen; de FAQ "Heb ik een diploma
nodig?" is de natuurlijke plek (spec 05). Namen van opdrachtgevers worden nooit
als zoekwoord gebruikt.

### 6.4 Sleutels die deze module leest

Deze spec legt geen tekst vast voor deze sleutels: de tekst staat bij de eigenaar.

| Sleutel | Tekst | Eigenaar |
|---|---|---|
| `meta.titleDefault`, `meta.description`, `meta.organizationDescription`, `meta.ogHeadline`, `meta.ogSubline` | zie de eigenaar | spec 03 §6.14 en §6.15 |
| `common.format.wageRange`, `.wagePerHour`, `.hoursRange`, `.hoursPerWeek` | zie de eigenaar | spec 03 §6.14 en §6.15 |
| `common.address.byAppointment` | zie de eigenaar | spec 03 §6.14 |
| `header.nav.*` | zie de eigenaar | spec 03 §6.14 |
| `vacatures.meta.title`, `.description`, `.titlePaged`, `.descriptionPaged` | zie de eigenaar | spec 06 §6.1 en §6.2 |
| `vacatures.meta.detailTitle`, `.detailDescription`, `.detailDescriptionShort`, `.startAsapSentence`, `.startDateSentence` | zie de eigenaar | spec 06 §6.1 en §6.2 |
| `vacatures.meta.closedTitleFilled`, `.closedTitleOther`, `.closedDescriptionFilled`, `.closedDescriptionOther` | zie de eigenaar | spec 06 §6.1 en §6.2 |
| `vacatures.meta.ogAlt` | zie de eigenaar | spec 06 §6.1 en §6.2 |
| `vacatures.og.label`, `vacatures.og.closed` | zie de eigenaar | spec 06 §6.1 en §6.2 |
| `vacatures.detail.sections.tasks`, `.requirements`, `.offer`, `.extra`; `vacatures.detail.minAge.<reason>` (de pagina geeft ze aan `jobPostingLd`) | zie de eigenaar | spec 06 §6.1 en §6.2 |
| `beroepen.og.werkzoekende`, `beroepen.og.werkgever`, met de parameters `{occupation}` en `{occupationPlural}` in beide talen | zie de eigenaar | spec 05 §6.2 en §6.3 |
| `beroepen.<id>.enkelvoud`, `.meervoud` | zie de eigenaar | spec 05 §6.2 en §6.3 |

`{occupation}` krijgt de enkelvoudsnaam (`beroepen.<id>.enkelvoud`) met een kleine
eerste letter; `{occupationPlural}` de meervoudsnaam zoals in
`beroepen.<id>.meervoud`. De OG-routes geven beide parameters aan beide
`beroepen.og.*`-sleutels mee, in beide talen. De namespace `vacatures` staat in
`CLIENT_NAMESPACES` (spec 01), maar deze sleutels worden alleen op de server
gelezen.

### 6.5 Google Bedrijfsprofiel: beschrijving (definitief voor spec 13, Deel G5)

Wij-vorm, hoogstens 750 tekens, geen links, geen claims die niet bevestigd zijn
(dit is de tekst waar spec 13 §6.3 naar verwijst):

> Groos Personeelsdiensten is een uitzendbureau in Den Haag voor praktisch werk.
> Wij leveren glazenwassers, schoonmakers, logistiek medewerkers, verhuizers en
> hulpkrachten bouw en sloop aan bedrijven in Den Haag en omgeving.
>
> Werkzoekenden solliciteren bij ons op een vacature of schrijven zich in, ook
> zonder cv. Bellen of een WhatsApp-bericht sturen naar 06 52 54 95 39 kan ook.
>
> Jimmy en Lorenzo zijn de vaste contactpersonen voor opdrachtgevers en
> werkzoekenden. Langskomen kan alleen op afspraak.
>
> TODO bereikbaarheid buiten kantoortijden alleen na bevestiging door Jimmy (B-22).

Ongeveer 500 tekens zonder de TODO-regel. De TODO-regel wordt vóór plaatsing
verwijderd of vervangen door een bevestigde zin.

## 7 SEO

### 7.1 Canonical, hreflang en indexering

| Pagina of situatie | Canonical | hreflang (`alternates.languages`) | Robots | Sitemap |
|---|---|---|---|---|
| vaste pagina's en beroepspagina's, NL en EN | zichzelf | nl, en, x-default (naar NL) | index, follow | ja, beide talen |
| `/vacatures` zonder query | zichzelf | nl, en, x-default | index | ja |
| `/vacatures?pagina=n` met n van 2 of hoger, zonder andere parameters | zichzelf met `?pagina=n` | idem met dezelfde query | index | nee |
| `/vacatures?pagina=1` | `/vacatures` | zonder query | index | nee |
| `/vacatures` met `q`, `beroep`, `plaats`, `uren`, `dienst` of `sortering` (`isFiltered`) | `/vacatures` van dezelfde taal | zonder query | `noindex, follow` | nee |
| `/vacatures?pagina=n` voorbij de laatste pagina | n.v.t. | n.v.t. | 404 (spec 06, `outOfRange`) | nee |
| `/vacatures/[slug]` open, NL | zichzelf | geen | index | ja |
| `/en/vacatures/[slug]` open | NL-URL van de vacature | geen | geen eigen noindex | nee |
| `/vacatures/[slug]` en `/en/...` gesloten tot 30 dagen | NL: zichzelf; EN: NL-URL | geen | `noindex, follow` | nee |
| vacature gearchiveerd, gesloten langer dan 30 dagen, concept, gepland | n.v.t. | n.v.t. | 404, Next zet `noindex` | nee |
| `/bedankt/*` | zichzelf | nl, en, x-default | `noindex, follow` (`pageMetadata({ noindex: true })`) | nee |
| `/algemene-voorwaarden` zolang `getLegalDoc("terms").published` onwaar is | zichzelf | nl, en, x-default | `noindex, follow` (`pageMetadata({ noindex: !getLegalDoc("terms").published })`) | nee |
| 404 en vangnet | n.v.t. | n.v.t. | `noindex` (Next) | nee |
| `/beheer/*` | n.v.t. | n.v.t. | `noindex, nofollow` (spec 08), `X-Robots-Tag` (spec 13), `Disallow` | nee |
| `/api/*` | n.v.t. | n.v.t. | `X-Robots-Tag` (spec 13), `Disallow` | nee |
| preview-deploys | n.v.t. | n.v.t. | `X-Robots-Tag: noindex` van Vercel | n.v.t. |

- Crawlers krijgen nooit een geo-omleiding (spec 01, `proxy.ts`); dat geldt ook voor de OG-routes onder `[locale]`.
- Alle canonicals zijn absoluut op `https://www.groospersoneelsdiensten.nl` (via `metadataBase` in de layout van spec 01).
- `<html lang>` volgt de taal van het pad; Nederlandse vacaturetekst op `/en` staat in een element met `lang="nl"` (spec 01, spec 06).

### 7.2 Metadata per pagina

Elke `generateMetadata` onder `app/[locale]` gebruikt `pageMetadata()` of een
helper die het aanroept (`vacancyListMetadata`, `vacancyMetadata`). Paginaspecs
geven het eigen deel van de titel en de beschrijving uit hun namespace mee
(`<namespace>.meta.title`, `<namespace>.meta.description`, spec 03 §6.13).
Titel: eigen deel van bij voorkeur 25 tot 45 tekens, hoogstens 52 (B-44); in
development (`process.env.NODE_ENV !== "production"`) geeft `pageMetadata()` een
`console.warn` met pad en lengte als het eigen deel langer is dan 52 tekens. De
derde terugval van `brandedTitle()` (titel zonder merk) blijft alleen een vangnet.
Noindex gaat altijd via de optie `noindex` van `pageMetadata()`, nooit via een eigen
`robots`-object na de spread: de bedankpagina's met `noindex: true` (spec 07) en
`/algemene-voorwaarden` met `noindex: !getLegalDoc("terms").published` (spec 09)
gebruiken die optie. De controle K12 van spec 14 vindt pagina's zonder `pageMetadata(` en losse
`openGraph:`-objecten.

### 7.3 JSON-LD per paginatype

| Pagina | Blokken | Builder | Wie rendert |
|---|---|---|---|
| alle pagina's onder `[locale]` | `Organization`, `WebSite` | `organizationLd({ description: meta.organizationDescription })`, `websiteLd({ locale })` | `app/[locale]/layout.tsx` (spec 01) |
| `/`, `/en` | `EmploymentAgency`; `FAQPage` als de homepage een FAQ toont | `employmentAgencyLd`, `faqLd` | spec 04 |
| `/contact` | `EmploymentAgency`, `BreadcrumbList` | `employmentAgencyLd`, via `Breadcrumbs` | spec 07, spec 01 |
| `/werkzoekenden`, `/werkgevers` | `BreadcrumbList`; `FAQPage` als er een FAQ zichtbaar is | via `Breadcrumbs`, `faqLd` | spec 05 |
| `/werken-als/[beroep]` | `BreadcrumbList`, `FAQPage` | via `Breadcrumbs`, `faqLd` | spec 05 |
| `/werkgevers/[beroep]` | `BreadcrumbList`, `Service`, `FAQPage` | via `Breadcrumbs`, `serviceLd`, `faqLd` | spec 05 |
| `/vacatures` | `BreadcrumbList`; geen `ItemList` (B-16) | via `Breadcrumbs` | spec 06 |
| `/vacatures/[slug]` NL open | `JobPosting`, `BreadcrumbList` | `jobPostingLd`, via `Breadcrumbs` | spec 06 |
| `/vacatures/[slug]` gesloten, en `/en/vacatures/[slug]` | `BreadcrumbList` | via `Breadcrumbs` | spec 06 |
| overige pagina's met kruimelpad | `BreadcrumbList` | via `Breadcrumbs` | spec 01 |
| `/inschrijven` | `BreadcrumbList`; nooit `JobPosting` (open sollicitatie is geen vacature) | via `Breadcrumbs` | spec 07 |

`FAQPage` bevat precies de vragen en antwoorden die zichtbaar zijn, uit dezelfde
bron (spec 14 test dat). JSON-LD staat in server components, nooit in een
clientcomponent.

### 7.4 Sitemap, robots en llms.txt

Zie §4.7, §4.8 en §4.9. De indeling van routes (welke in de sitemap en welke in
`llms.txt`) komt uit `STATIC_ROUTES` van spec 01 en `LEGAL_DOCS` van spec 09; deze
module voegt de vacatures toe.

### 7.5 NAP (naam, adres, telefoon)

Eén schrijfwijze, één bron (`contact` in `lib/site.ts`):

| Onderdeel | Op de site en in vermeldingen | In JSON-LD |
|---|---|---|
| Naam | Groos Personeelsdiensten B.V. (juridisch), Groos Personeelsdiensten (merk) | `legalName`, `name` |
| Adres | Hugo Coenraadspad 6, 2553 ER Den Haag, met "Langskomen kan alleen op afspraak." (`common.address.byAppointment`, B-23) | `PostalAddress` met `addressRegion` "Zuid-Holland", `addressCountry` "NL" |
| Telefoon | 06 52 54 95 39 (hoofdnummer en WhatsApp, B-66) | `+31652549539` |
| E-mail | info@groospersoneelsdiensten.nl (B-02) | `email` |
| Website | https://www.groospersoneelsdiensten.nl | `url` |

- Footer, `/contact`, `/over-ons`, elke vacature (contactpersoon), `employmentAgencyLd`, `llms.txt` en de OG-afbeeldingen lezen deze waarden; nergens staat een adres of nummer als losse tekst in messages of content.
- Wijzigt een waarde (bijvoorbeeld een vast 070-nummer, B-21), dan eerst `lib/site.ts`, daarna alle externe vermeldingen uit §7.6 op dezelfde dag.

### 7.6 Google Bedrijfsprofiel en andere vermeldingen

Uitvoering bij de livegang door Jimmy met Djulan (spec 13, Deel G5). Deze spec
legt de inhoud vast.

| Veld | Waarde | Toelichting |
|---|---|---|
| Naam | Groos Personeelsdiensten B.V. | exact als `contact.name`; geen zoekwoorden in de naam |
| Primaire categorie | Uitzendbureau | aanvullende categorie alleen als er een bestaat die letterlijk uitzend- of tijdelijk werk beschrijft; geen categorie voor glazenwassen of verhuizen, want Groos levert die diensten niet aan particulieren |
| Adres | Hugo Coenraadspad 6, 2553 ER Den Haag invoeren voor verificatie, daarna verbergen | het adres is in de BAG een woning (B-23); op de website blijft het staan |
| Servicegebied | Den Haag, tot `workArea` bevestigd is (B-43); daarna Den Haag, Rijswijk, Delft, Westland, Zoetermeer, Leidschendam-Voorburg, Wassenaar | volgt `areaServed` in JSON-LD (§4.4): eerst alleen Den Haag, na bevestiging met Haaglanden; spec 13 G5 voert het uit |
| Telefoon | 06 52 54 95 39 | B-66 |
| Website | `https://www.groospersoneelsdiensten.nl/?utm_source=google&utm_medium=organic&utm_campaign=bedrijfsprofiel` | spec 13 G5 |
| Openingstijden | pas na bevestiging van B-22; dan dezelfde tijden als `contact.openingHours` | geen 24/7 als openingstijd |
| Diensten | Glazenwassers, Schoonmakers, Logistiek medewerkers, Verhuizers, Hulpkrachten bouw en sloop | meervoud uit 00 §4.2 |
| Beschrijving | §6.5 | |
| Foto's | alleen echte foto's van Jimmy, Lorenzo en het werk (B-25); geen stockfoto's | |
| Berichten | een bericht per nieuwe vacature mag, met link naar de vacature-URL | handmatig in fase 1 |

Overige vermeldingen met exact dezelfde NAP (in deze volgorde, na het
Bedrijfsprofiel): Bing Places (importeren vanuit Google), Apple Business Connect,
KVK (controleren), LinkedIn-bedrijfspagina, Indeed-bedrijfspagina, De
Telefoongids. Zodra een kanaal bestaat, komt de URL in `socials` (spec 01); dan
verschijnt hij vanzelf in `sameAs` en de footer.

### 7.7 Reviews

- Vraag na elke plaatsing zowel de kandidaat als de opdrachtgever om een Google-review, altijd en niet alleen bij tevreden mensen, en zonder beloning (Google-beleid).
- Reageer op elke review, ook op kritiek, rustig en inhoudelijk, binnen een paar werkdagen.
- Geen `aggregateRating`, `Review` of sterren op de eigen site: Google toont geen eigen reviews van een `LocalBusiness` of `Organization`, en zelfgekozen citaten mogen pas met toestemming (B-26).
- De reviewlink van het Bedrijfsprofiel komt na verificatie in de bevestigingsmails na een plaatsing (fase 2, spec 11 en 15).

### 7.8 Interne links

Deze eisen bouwen spec 04, 05 en 06; spec 14 controleert ze.

| Van | Naar |
|---|---|
| elke vacature | de beroepspagina van werkzoekenden (`paths.werkenAls(id)`), 2 tot 4 vergelijkbare vacatures (`getSimilarVacancies`), `/inschrijven` ("Staat het werk dat je zoekt er niet bij?") |
| elke beroepspagina van werkzoekenden | `paths.vacaturesVoorBeroep(id)`, de werkgeverspagina van hetzelfde beroep, `/inschrijven` |
| elke werkgeverspagina per beroep | `/werkgevers/personeel-aanvragen`, de beroepspagina van werkzoekenden van hetzelfde beroep, `/werkgevers/wtta` |
| home | `/vacatures`, de tien beroepspagina's (direct of via twee blokken), `/werkgevers`, `/werkzoekenden` |
| header en footer | alle tien beroepspagina's (spec 01) |
| gesloten vacature | vergelijkbare vacatures en `/inschrijven` |

Linkteksten noemen het doel ("Bekijk vacatures als schoonmaker"), nooit "klik
hier" (spec 03).

## 8 Toegankelijkheid en performance

- **JSON-LD en metadata** voegen niets zichtbaars toe en raken de toegankelijkheid niet. `<title>` is uniek binnen de taal (B-53), wat schermlezergebruikers helpt bij tabbladen (WCAG 2.4.2).
- **OG-afbeeldingen** hebben een alt-tekst die alles noemt wat op het beeld staat (`og:image:alt`), in de taal van de pagina. De kleuren komen uit `lib/brand.ts`; tekst `ink` op wit en `accent` op `accentSoft` halen minstens 4,5:1 (controle door spec 02 op de tokens).
- **Performance.** Builders zijn pure functies zonder runtime-dependencies. JSON-LD is server-side en kost geen JavaScript in de browser. OG-routes draaien alleen als een crawler of app ze opvraagt; de site-brede en de beroepsafbeeldingen zijn statisch, de vacatureafbeeldingen ISR met dezelfde tags als de pagina. De fonts worden één keer per proces gelezen.
- **Caching.** Sitemap: `revalidate = 3600` plus `revalidatePath("/sitemap.xml")` uit spec 10. `llms.txt` en `robots.txt`: statisch. Vacaturemetadata en JSON-LD liften mee op de cache van de pagina (B-35).
- **Geen extra dependencies.** `next/og` zit in Next; geen `schema-dts`, geen `next-sitemap` (B-37).
- **Lighthouse SEO** (mobiel) is 100 op `/`, een vacature en `/werken-als/schoonmaker` (spec 14 meet).

## 9 21st.dev-opdracht voor sub-agents

Deze module heeft geen interactieve UI; de enige visuele plek zijn de
OG-afbeeldingen. Die worden met inline styles in `ImageResponse` (Satori)
gerenderd, dus code van 21st.dev is niet bruikbaar en `get_component` wordt voor
deze module niet aangeroepen. Wel zet de bouw-agent één sub-agent in voor
inspiratie over de compositie.

**Sub-agent `scout-og`: compositie van de deelkaart**

- Boodschap van de plek: in één oogopslag welk werk, waar en wat het betaalt, van een betrouwbaar bureau uit Den Haag.
- Tools: `ToolSearch` met `select:mcp__magic__search,mcp__magic__get_inspiration`.
- `mcp__magic__search` (`type: "component"`, `limit: 10`): "job listing card"; "job card salary location badge"; "pricing card minimal price hierarchy"; "open graph image card".
- `mcp__magic__get_inspiration`: "minimal white social share card 1200x630 with logo, large job title, location and hourly wage, blue accent bar"; "clean job vacancy preview card with salary pill and company logo".
- Selectiecriteria: minimaal, witte achtergrond, blauw alleen als accent uit de rollen van `OG_COLORS` (tokens van spec 02), duidelijke hiërarchie titel, plaats, loon; geen glas, gloed, raster of verloop (B-29); leesbaar op een telefoonvoorvertoning van 300 px breed; geen foto's (B-25).
- Oplevering (tekst aan de bouw-agent): 2 tot 4 kandidaten met id, naam en preview-URL, per kandidaat twee zinnen over wat de compositie bruikbaar maakt, één gemotiveerde keuze voor de verhoudingen van `OgCard`. Geen code ophalen.
- Aanpassingsregels: alleen de compositie overnemen (plaatsing, grootteverhoudingen, pilvorm voor het loon); kleuren via `OG_COLORS`, fonts Instrument Sans en Onest, tekst uit messages, label in gewone hoofdletters, geen eyebrow op de site zelf.
- Valt 21st.dev tegen, dan bouwt de agent de opmaak uit §4.6 zoals beschreven.

Startpunt (gezocht op 2 oktober 2026):

| Id | Naam | Preview | Bruikbaar voor |
|---|---|---|---|
| 8725 | Job Listing (educalvolpz) | https://21st.dev/@educalvolpz/components/job-listing | volgorde titel, plaats en kenmerken |
| 7464 | Opportunity Card (ravikatiyar162) | https://21st.dev/@ravikatiyar162/components/card-12 | logo linksboven met titel en een duidelijke bedragregel |
| 26141 | Pricing Card (felipemenezes098) | https://21st.dev/@felipemenezes098/components/card-09 | hiërarchie van een bedrag met eenheid |
| 6962 | Badge Tag, hiring badge (prebuiltui) | https://21st.dev/@prebuiltui/components/badge-tag | vorm van het label "Vacature" |

## 10 Bouwopdracht

> **Notitie.** Het vacaturedeel van deze spec is gecommit met spec 06 (8a89ebe, gemerged in b12c48d). De rest bouwt een agent op `bouw/fase-1` direct na bouwstap 3b en vóór de poort van stap 5 (00 §6, B-52).

Bouwstap 5 uit 00 §6, samen met spec 06. Voorwaarden: stap 1 (spec 10 en 13:
`groos-dev`, seed, `lib/data/*`), stap 2 (spec 02: `lib/brand.ts`,
`components/brand/logo-paths.json`, `public/brand/logo.png`, de fonts in
`assets/fonts/`, tokens), stap 3 (spec 01 en 03: `lib/site.ts`,
`lib/routes.ts`, `content/beroepen/index.ts`, `Breadcrumbs`, messages `meta` en
`common.format`, minimale sitemap en `llms.txt`) en `lib/legal.ts` van spec 09 blok A (bestaat sinds 8a719eb); maak geen stub. Lees vooraf `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/{sitemap,robots,opengraph-image}.md` en `04-functions/generate-metadata.md` (robots, samenvoegen).

1. **Fonts.** Controleer dat `assets/fonts/InstrumentSans-SemiBold.ttf`, `assets/fonts/Onest-Regular.ttf`, `assets/fonts/Onest-Medium.ttf` en `assets/fonts/OFL.txt` bestaan (spec 02, AC-02-22). Deze spec haalt zelf geen fonts op; ontbreken ze, dan meldt de agent dat aan spec 02.
2. **`lib/seo.ts` basis.** Herschrijf volgens §4.2: `brandedTitle`, `alternatesFor` met opties, `ogImagePath`, `pageMetadata` met `noindex`, `image`, `languages`, `canonical` en de absolute titel. Behoud `localizedPath`, `absoluteUrl` en `SITE_URL`. Controleer met `grep -rn "pageMetadata(" app` dat bestaande aanroepen blijven compileren (de oude parameters blijven geldig).
3. **Builders.** Voeg `organizationLd` (nieuwe signatuur met object), `websiteLd` (object), `employmentAgencyLd`, `serviceLd` (met `locale`), `jobPostingLd`, `employmentTypesFor`, `jobDescriptionHtml` en `escapeHtml` toe (§4.4, §4.5, §5.3). Verwijder `localBusinessLd` en vervang de aanroep op de homepage door `employmentAgencyLd({ locale, description: t("organizationDescription") })`. Pas de aanroepen van `organizationLd` en `websiteLd` in `app/[locale]/layout.tsx` aan (spec 01 is eigenaar van de structuur, deze stap wijzigt alleen de twee regels).
4. **Vacaturehelpers.** Voeg `vacancyListMetadata` en `vacancyMetadata` toe (§4.3). Lever spec 06 de aanroep:

```ts
// app/[locale]/vacatures/[slug]/page.tsx (spec 06)
export async function generateMetadata({ params }: PageProps<"/[locale]/vacatures/[slug]">): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  const number = parseVacancySlug(slug);
  const vacancy = number ? await getVacancyByNumber(number) : null;
  if (!vacancy) return {};
  const t = await getTranslations({ locale, namespace: "vacatures.meta" });
  // getVacancySeoParts uit components/vacatures/vacancy-format.ts (spec 06)
  const { city, hours, wage, startDate, start } = await getVacancySeoParts(vacancy, locale);
  return vacancyMetadata({ locale, vacancy, t: (k, v) => t(k, v), city, hours, wage, startDate });
}
// In de pagina, alleen bij locale "nl" (labels uit vacatures.detail.sections.*, facts precies [hours, wage, start]):
// const { city, hours, wage, startDate, start } = await getVacancySeoParts(vacancy, locale);
// const ld = jobPostingLd({ vacancy, labels, facts: [hours, wage, start], minAgeSentence });
// {ld && <JsonLd data={ld} />}
```

   `todayInAmsterdam()` staat in `components/vacatures/vacancy-format.ts` (spec 06).
5. **Messages.** Controleer dat de sleutels uit §6.4 in `messages/nl/<namespace>.json` en `messages/en/<namespace>.json` staan (B-45); zet ontbrekende met de tekst uit de spec van de eigenaar en meld dat in het verslag aan de eigenaar (06 of 05). Draai `npm run check -- --warn`.
6. **Sub-agent.** Start `scout-og` (§9) en ga intussen door.
7. **`lib/og.tsx` en OG-routes.** Maak `lib/og.tsx` (§4.6), herschrijf `app/opengraph-image.tsx` met `renderOgCard`, en maak de zes nieuwe bestanden voor vacatures en beroepen. Koppel in spec 05 en 06 `image: { url: ogImagePath(locale, path), alt }` in `pageMetadata` (één regel per pagina; bij spec 06 doet `vacancyMetadata` het al).
8. **Sitemap, robots, llms.txt.** Herschrijf `app/sitemap.ts` (§4.7), `app/robots.ts` (§4.8) en `app/llms.txt/route.ts` (§4.9).
9. **Paginaspecs aansluiten.** Controleer dat de bedankpagina's de optie `noindex` gebruiken met `pageMetadata({ ..., noindex: true })` (spec 07), `/algemene-voorwaarden` de optie `noindex: !getLegalDoc("terms").published` (spec 09), `/werkgevers/[beroep]` `serviceLd` (spec 05), home en contact `employmentAgencyLd` (spec 04, 07). Ontbreekt iets, dan meldt de agent het aan de eigenaar in het verslag in spec 00 en past hij alleen de metadata-aanroep aan.
10. **Tests.** Lever spec 14 de fixtures: seedvacature 1001 (open, 32 tot 40 uur), 1002 (12 tot 20 uur), 1005 (24 tot 40 uur) en 1007 (gesloten, `filled`) als `VacancyDetail`-objecten in `tests/fixtures/vacancies.ts` (plek volgens spec 14). Schrijf de gevallen van AC-12-01 tot en met AC-12-05 in `seo/job-posting.test.ts` en `seo/builders.test.ts`.
11. **Verifiëren.**

```bash
npm run verify
npm run check -- --warn
npm run build && npm run start          # http://localhost:3000, gekoppeld aan groos-dev
B=http://localhost:3000
curl -s $B/robots.txt
curl -s $B/sitemap.xml | grep -o '<loc>[^<]*</loc>' | sort
curl -s $B/llms.txt | head -40
curl -s -o /tmp/og.png -w '%{http_code} %{content_type}\n' $B/opengraph-image && file /tmp/og.png
curl -s -o /tmp/og1001.png -w '%{http_code} %{content_type}\n' $B/vacatures/glazenwasser-den-haag-1001/opengraph-image && file /tmp/og1001.png
for u in / /contact /vacatures/glazenwasser-den-haag-1001 /en/vacatures/glazenwasser-den-haag-1001 \
  /vacatures/opleveringsschoonmaker-delft-1007 "/vacatures?beroep=schoonmaker" /bedankt/sollicitatie; do
  echo "== $u"; curl -s "$B$u" | grep -oE '<title>[^<]*</title>|<meta name="robots"[^>]*>|<link rel="canonical"[^>]*>|hreflang="[a-z-]*"|"@type":"(JobPosting|EmploymentAgency|Organization|WebSite|BreadcrumbList)"' | sort -u
done
```

12. **Handmatig.** Rich Results Test met het tabblad "Code" op de HTML van `/vacatures/glazenwasser-den-haag-1001`; Schema Markup Validator op `/` en `/contact`; de OG-afbeeldingen bekijken (Read van `/tmp/og.png` en `/tmp/og1001.png`) en in opengraph.xyz zodra een preview bestaat (spec 14 §7.2).
13. **Afsluiten.** Noteer in spec 00 de stand, de keuze van `scout-og` en eventuele sleutels die bij een andere eigenaar zijn toegevoegd.

## 11 Acceptatiecriteria

Op localhost met de productieserver (`npm run build && npm run start`) tegen
`groos-dev` met de seed van spec 10, tenzij anders vermeld. Criteria met
seedvacatures (onder meer AC-12-09 tot en met AC-12-12) gaan uit van de toestand
direct na `npm run db:seed:reset` (B-46).

| Id | Criterium | Eis |
|---|---|---|
| AC-12-01 | `brandedTitle("Contact")` geeft "Contact \| Groos Personeelsdiensten"; `brandedTitle("Werken als logistiek medewerker in Den Haag")` geeft "Werken als logistiek medewerker in Den Haag \| Groos" (51 tekens); een titel van 58 tekens komt ongewijzigd terug. | E-12-01, E-12-02 |
| AC-12-02 | `pageMetadata({ locale: "nl", path: "/bedankt/aanvraag", title: "x", description: "y", noindex: true }).robots` is `{ index: false, follow: true }`; zonder `noindex` bevat `robots.googleBot["max-image-preview"]` de waarde `"large"`; met `languages: false` ontbreekt `alternates.languages`; met `canonical: { locale: "nl", path: "/vacatures/a-1001" }` en `locale: "en"` is `alternates.canonical` `"/vacatures/a-1001"`; `openGraph.images[0].url` is `"/opengraph-image"` tenzij `image` is meegegeven. | E-12-01, E-12-04 |
| AC-12-03 | `employmentTypesFor("temp_agency", 32, 40)` geeft `["TEMPORARY","FULL_TIME"]`, `(…, 12, 20)` geeft `["TEMPORARY","PART_TIME"]`, `(…, 24, 40)` geeft `["TEMPORARY","FULL_TIME","PART_TIME"]` en `("recruitment", 36, 40)` geeft `["FULL_TIME"]`. | E-12-06 |
| AC-12-04 | `jobPostingLd` met fixture 1001, `labels` uit `vacatures.detail.sections.*` en `facts` [uren, uurloon, startzin] bevat precies de velden en waarden van het voorbeeld in §5.3 (behalve de datums, die gelijk zijn aan `publishedAt` en `closesAt`); `description` begint met `<p>`, bevat drie `<ul>`'s met de koppen "Je werkdag", "Wat je meebrengt" en "Wat je van ons krijgt", het laatste `<li>` onder "Wat je meebrengt" is "Omdat je op hoogte werkt, is de minimumleeftijd 18 jaar.", de feitenalinea is "32 tot 40 uur per week. € 16,08 tot € 17,50 bruto per uur. Je kunt direct beginnen." (na de startzin staat precies één punt), en er is geen ongeëscapete tekst (een taak met `<b>` komt terug als `&lt;b&gt;`); met een gevulde `salaryNote` is die het laatste `<li>` onder "Wat je van ons krijgt", en met een gevulde `extra` staat `<p><strong>Meer over dit werk</strong></p>` ervoor; met fixture 1007 (`state: "closed"`) geeft de functie `null`. | E-12-06, E-12-07, E-12-20 |
| AC-12-05 | `employmentAgencyLd({ locale: "nl", description })` heeft `@type` `EmploymentAgency`, `@id` `https://www.groospersoneelsdiensten.nl/#organization`, `address.streetAddress` "Hugo Coenraadspad 6", `address.postalCode` "2553 ER", `telephone` "+31652549539", en geen `geo`, `aggregateRating` of `openingHoursSpecification` zolang `contact.openingHours` leeg is; met `openingHours` gevuld staat `dayOfWeek` Monday tot en met Friday met `opens` "07:00". | E-12-05, E-12-14 |
| AC-12-06 | `/vacatures/glazenwasser-den-haag-1001` bevat precies één script met `"@type":"JobPosting"` met `"title":"Glazenwasser"`, `"minValue":16.08`, `"maxValue":17.5`, `"unitText":"HOUR"`, `"addressLocality":"Den Haag"`, `"addressCountry":"NL"`, `"directApply":true` en `"value":"1001"`; de `<title>` is "Glazenwasser in Den Haag \| Groos Personeelsdiensten"; er is geen `hreflang` en de canonical is `https://www.groospersoneelsdiensten.nl/vacatures/glazenwasser-den-haag-1001`. | E-12-06, E-12-04 |
| AC-12-07 | `/vacatures/schoonmaker-kantoren-rijswijk-1002` heeft `"employmentType":["TEMPORARY","PART_TIME"]`; `/vacatures/verhuizer-den-haag-1005` heeft `["TEMPORARY","FULL_TIME","PART_TIME"]`. | E-12-06 |
| AC-12-08 | `/en/vacatures/glazenwasser-den-haag-1001` heeft de canonical van AC-12-06, geen `hreflang`, geen `JobPosting` en geen `meta name="robots"` met `noindex`; de `og:image` wijst naar `https://www.groospersoneelsdiensten.nl/en/vacatures/glazenwasser-den-haag-1001/opengraph-image`. | E-12-04, E-12-12 |
| AC-12-09 | `/vacatures/opleveringsschoonmaker-delft-1007` geeft 200 met `<meta name="robots" content="noindex, follow">`, geen `JobPosting`, wel een `BreadcrumbList`, en de `<title>` "Opleveringsschoonmaker in Delft (vervuld) \| Groos". | E-12-07 |
| AC-12-10 | De slugs van 1008 (gepland), 1009 (concept) en 1010 (gesloten langer dan 30 dagen) geven 404. | E-12-07 |
| AC-12-11 | Na `update vacancies set closes_at = now() - interval '1 minute' where number = 1002` en een aanroep van `/api/cron/vacatures` met `CRON_SECRET` heeft `/vacatures/schoonmaker-kantoren-rijswijk-1002` bij de eerstvolgende aanvraag `noindex, follow` en geen `JobPosting`, en ontbreekt `-1002` in `/sitemap.xml`. | E-12-07, E-12-08 |
| AC-12-12 | Na `update vacancies set publish_at = now() - interval '1 minute' where number = 1008` en een cron-aanroep staat `/vacatures/medewerker-bloemenlogistiek-honselersdijk-1008` in `/sitemap.xml` en heeft de pagina een `JobPosting`. | E-12-07, E-12-08 |
| AC-12-13 | `/sitemap.xml` bevat (zonder de wijzigingen van AC-12-11 en AC-12-12) voor de vacatures precies de zes URL's van 1001 tot en met 1006, alleen NL, elk met `<lastmod>` en zonder `xhtml:link`; alle gepubliceerde vaste routes en de tien beroepspagina's in NL en EN, elk met `xhtml:link` voor `nl`, `en` en `x-default`; `<lastmod>` van `/vacatures` is gelijk aan de nieuwste `<lastmod>` van de vacatures; geen `/bedankt/`, `/beheer`, `/api`, `/algemene-voorwaarden`, `/en/vacatures/` en geen URL met `?`. | E-12-08 |
| AC-12-14 | `curl -s /robots.txt` geeft exact de uitvoer van §4.8 (vier regels plus de `Sitemap`-regel). | E-12-09 |
| AC-12-15 | `/llms.txt` geeft 200 met `text/plain; charset=utf-8`, begint met `# Groos Personeelsdiensten`, bevat "Hugo Coenraadspad 6, 2553 ER Den Haag", "06 52 54 95 39", de tien beroepspagina's als absolute URL's, `/vacatures`, `/werkgevers/personeel-aanvragen` en `/en`, en bevat geen `TODO`, `/bedankt` of `/beheer`. | E-12-10, E-12-14 |
| AC-12-16 | `/opengraph-image` en `/vacatures/glazenwasser-den-haag-1001/opengraph-image` geven 200 met `content-type: image/png` en `file` meldt "1200 x 630"; de vacatureafbeelding toont visueel "Vacature", "Glazenwasser", "Den Haag", "32 tot 40 uur per week" en "€ 16,08 tot € 17,50 bruto per uur"; de afbeelding van 1007 toont "Deze vacature is gesloten"; `/vacatures/onzin-42/opengraph-image` geeft de site-brede kaart. | E-12-11, E-12-12 |
| AC-12-17 | `/werken-als/verhuizer/opengraph-image` en `/en/werkgevers/schoonmakers/opengraph-image` geven 200 met `image/png`; de `og:image` van `/werken-als/verhuizer` wijst naar `https://www.groospersoneelsdiensten.nl/werken-als/verhuizer/opengraph-image`. | E-12-13 |
| AC-12-18 | Op `/` en `/contact` (NL en EN) staat één `EmploymentAgency`; op elke pagina onder `[locale]` staan één `Organization` en één `WebSite`; `/vacatures` bevat geen `ItemList`; `/werkgevers/schoonmakers` bevat een `Service` met `provider.@id` `https://www.groospersoneelsdiensten.nl/#organization`. | E-12-05, E-12-19 |
| AC-12-19 | `grep -rn "localBusinessLd\|aggregateRating\|\"geo\"" app components lib` geeft geen treffers. | E-12-05, E-12-16 |
| AC-12-20 | Voor elke URL uit `/sitemap.xml` is de `<title>` hoogstens 60 tekens en uniek binnen dezelfde taal (NL-URL's onderling, `/en`-URL's onderling); voor elke indexeerbare URL ligt `meta[name=description]` tussen 120 en 160 tekens (spec 14, `seo/metadata.spec.ts`, zachte controle). | E-12-02, E-12-03 |
| AC-12-21 | `/vacatures?beroep=schoonmaker` en `/vacatures?q=den+haag` hebben `noindex, follow` en canonical `https://www.groospersoneelsdiensten.nl/vacatures`; `vacancyListMetadata({ locale: "nl", page: 2, isFiltered: false, t })` geeft canonical `/vacatures?pagina=2`, index en de titel "Vacatures in Den Haag en omgeving, pagina 2 \| Groos"; met `page: 1` is de canonical `/vacatures`. | E-12-04 |
| AC-12-22 | `/bedankt/sollicitatie`, `/en/bedankt/aanvraag` en (zolang `published` onwaar is) `/algemene-voorwaarden` hebben `noindex, follow`. | E-12-04 |
| AC-12-23 | De `<title>` van `/werkgevers/glazenwassers` bevat "glazenwasserij" en niet "inhuren"; die van `/werkgevers/verhuizers` bevat "verhuisbedrijven"; beide beschrijvingen staan in de u-vorm en die van `/werken-als/glazenwasser` in de je-vorm. | E-12-03 |
| AC-12-24 | In de HTML van `/`, `/contact` en `/en/contact` staan in footer, zichtbare contactgegevens en JSON-LD dezelfde straat, postcode, plaats en hetzelfde nummer (`06 52 54 95 39` zichtbaar, `+31652549539` in JSON-LD en `tel:`). | E-12-14 |
| AC-12-25 | `grep -rniE "24/7\|keurmerk\|binnen [0-9]+ (uur\|werkdag)\|cao van groos" lib/seo.ts lib/og.tsx app/llms.txt app/opengraph-image.tsx` geeft niets, en de metabeschrijvingen uit §6.2 bevatten geen van die claims. | E-12-18 |
| AC-12-26 | De Rich Results Test (tabblad "Code") op de HTML van `/vacatures/glazenwasser-den-haag-1001` toont "Vacature" en "Breadcrumbs" geldig zonder fouten; de Schema Markup Validator op `/` en `/contact` geeft nul fouten. | E-12-06, E-12-05 |
| AC-12-27 | Op `/vacatures/glazenwasser-den-haag-1001` staan links naar `/werken-als/glazenwasser`, minstens twee andere `/vacatures/`-URL's en `/inschrijven`; op `/werken-als/schoonmaker` staan links naar `/vacatures?beroep=schoonmaker` en `/werkgevers/schoonmakers`; op `/werkgevers/schoonmakers` naar `/werkgevers/personeel-aanvragen` en `/werken-als/schoonmaker`. | E-12-17 |
| AC-12-28 | De beschrijving in §6.5 is zonder de TODO-regel hoogstens 750 tekens, en elke alinea heeft twee zinnen zonder uitroepteken of streepje. | E-12-15 |
| AC-12-29 | Lighthouse (mobiel) geeft voor SEO 100 op `/`, `/vacatures/glazenwasser-den-haag-1001` en `/werken-als/schoonmaker`. | E-12-02, E-12-21 |
| AC-12-30 | `npm run verify` slaagt; `npm run check -- --warn` meldt geen ontbrekende sleutels uit §6.4. | E-12-21 |
| AC-12-31 | Het verslag van `scout-og` noemt 2 tot 4 kandidaten met id, naam en preview-URL en een gemotiveerde keuze; `get_component` is voor deze module niet aangeroepen. | E-12-22 |
| AC-12-32 | Er bestaan geen bestanden onder `app/feeds`, geen route `/regio` en geen code die de Indexing API aanroept (fase 2). | E-12-23 |
| AC-12-33 | Met `NODE_ENV` ongelijk aan `"production"` geeft `pageMetadata({ locale: "nl", path: "/x", title: <53 tekens>, description })` één `console.warn` met het pad `/x` en de lengte 53; met een eigen deel van 52 tekens geeft de titel-controle geen waarschuwing en eindigt `fullTitle` op " \| Groos". | E-12-01, E-12-02 |

## 12 Open vragen en aannames

| Onderwerp | Aanname in deze spec | Bevestigt | Wat verandert als het anders is |
|---|---|---|---|
| Scheidingsteken in titels | ` \| ` met merkachtervoegsel " \| Groos Personeelsdiensten", of " \| Groos" als het totaal anders boven 60 tekens komt. De opdracht voor deze spec noemde " · "; spec 01 en spec 03 (eigenaar van de titelteksten) kozen de verticale streep, en deze spec volgt hen. De repo gebruikt nu nog een middenpunt. | Djulan | Alleen `BRAND_SUFFIX` en `BRAND_SUFFIX_SHORT` in `lib/seo.ts`, plus `meta.titleTemplate` en `titleDefault` (spec 03). |
| Titellengte | Eigen deel van de titel bij voorkeur 25 tot 45 tekens, hoogstens 52 (B-44); `pageMetadata()` waarschuwt in development (`process.env.NODE_ENV !== "production"`) met pad en lengte boven 52 tekens. De derde terugval van `brandedTitle()` (titel zonder merk) is alleen een vangnet. | Djulan | Andere grens: alleen de waarschuwing in `pageMetadata()` en de copy bij de eigenaars van de namespaces. |
| Unieke titels | Een titel is uniek binnen de taal (B-53): NL-URL's onderling en `/en`-URL's onderling. Dezelfde titel op een NL-pagina en haar EN-tegenhanger mag, bijvoorbeeld "Contact \| Groos Personeelsdiensten" (E-12-02, AC-12-20). | Djulan | Uniek over beide talen: de eigenaars van de namespaces geven de EN-titels van korte pagina's een andere tekst en AC-12-20 vergelijkt alle URL's samen. |
| Absolute titels | `pageMetadata()` geeft altijd `{ absolute }` terug, zodat de layout-template nooit een tweede merk toevoegt. `meta.titleTemplate` blijft alleen als vangnet voor pagina's zonder `pageMetadata` (404 zet de titel zelf). | spec 03 | Template gebruiken: de lengteregel kan dan niet in één functie. |
| Metadata van vacatures | De inkorting van de beschrijving (startmoment eraf boven 160 tekens, daarna de afgekapte `summary`) staat in `vacancyMetadata()` in `lib/seo.ts` in plaats van in spec 06 (spec 03 §7 noemde spec 06). De sleutelnamen zijn die van spec 06; `seoTitle` en `seoDescription` gelden alleen bij `locale === "nl"`; de pagina geeft `city`, `hours`, `wage` en `startDate` mee uit `getVacancySeoParts` (spec 06). | spec 06 | Spec 06 bouwt het zelf; dan vervalt `vacancyMetadata`. |
| Titel gesloten vacature | "(vervuld)" alleen bij `close_reason = filled`, anders "(gesloten)". Spec 03 noemt alleen "(vervuld)". | spec 03, Jimmy | Eén sleutel `closedTitle`; dan staat er soms "vervuld" bij een ingetrokken vacature. |
| Werkgeverstitels per beroep | Gesloten in de kruiscontrole (ronde 1): spec 05 §6.6 is leidend en neemt de titels over ("Personeel voor glazenwasserijen in Den Haag", "Schoonmakers inhuren in Den Haag", "Logistiek medewerkers inhuren in Den Haag", "Personeel voor verhuisbedrijven in Den Haag", "Hulpkrachten bouw en sloop inhuren in Den Haag"; EN met "labourers"), ook de beschrijvingen voor glazenwassers en verhuizers. Deze spec houdt alleen de reden (§6.3) en AC-12-23. | gesloten | Sjabloon "{Meervoud} inhuren" voor alle vijf: risico op verkeerd verkeer en concurrentie met J. Versseput op "glazenwasser Den Haag"; dan past spec 05 §6.6 aan en vervalt AC-12-23. |
| `hiringOrganization` bij werving voor een vaste baan | Ook bij `contract_type = recruitment` is Groos de `hiringOrganization`, omdat spec 10 geen veld voor de opdrachtgever heeft. Google vraagt eigenlijk de werkgever; de bouw-agent controleert de actuele documentatie. | Djulan, Jimmy | Veld `employer_name` in spec 10 en `hiringOrganization.name` daaruit, of "confidential". |
| `/en/vacatures/[slug]` zonder noindex | Alleen een canonical naar NL, geen noindex (geen tegenstrijdige signalen). | Djulan | `noindex: true` in `vacancyMetadata` bij `locale === "en"`. |
| Spec 14 en vacature-URL's in de sitemap | Gesloten in de kruiscontrole (ronde 1): spec 14 is aangepast en zondert vacature-URL's uit van de hreflang-controle in `seo/sitemap.spec.ts` en `seo/metadata.spec.ts`; vacatures hebben bewust geen hreflang (spec 01 §4.11.6, B-03). | gesloten | Geen wijziging hier. |
| Spec 14 en `/vacatures?pagina=2` | Met zes seedvacatures en 12 per pagina is pagina 2 een 404 (spec 10 `outOfRange`). Deze spec toetst de paginering daarom met een unit-test (AC-12-21). Spec 14 §7.3 test `/vacatures?pagina=2` als pagina; dat vraagt meer seedvacatures of een kleinere paginagrootte in de test. | kruiscontrole, spec 14 | Geen wijziging hier. |
| OG-beeld voor `/en` | De site-brede OG-afbeelding is Nederlands en wordt ook op `/en` gebruikt; een tweede site-brede route zou het pad `/opengraph-image` veranderen waar spec 13 en 14 op testen. Beroeps- en vacaturebeelden zijn wel per taal. | Djulan | `generateImageMetadata` met `nl` en `en`; dan wijzigen de URL's en de checks van spec 13 en 14. |
| Kleurrollen OG | `OG_COLORS` koppelt de rollen aan `brand.colors` van spec 02: canvas `background`, ink `foreground`, muted `muted`, accent `accent`, accentSoft `brandTint`, onAccent `background` (§4.6). | spec 02 | Alleen de koppeling in `lib/og.tsx`. |
| Logo in OG | Het logo in kleur (beeldmerk met woordmerk, B-61) als SVG-data-URI uit `components/brand/logo-svg.ts` (spec 02), 48 px hoog, zonder losse naamtekst; `logoDataUri()` vervangt `loadLogoDataUri` met `logo.png`. `public/brand/logo.png` blijft alleen voor `site.logo` in JSON-LD. | spec 02 | Een gewijzigd beeldmerk: spec 02 genereert `logo-paths.json` opnieuw; `logoDataUri` blijft gelijk. |
| Fonts | Gesloten in de kruiscontrole (ronde 1): `loadOgFonts` leest `assets/fonts/InstrumentSans-SemiBold.ttf`, `assets/fonts/Onest-Regular.ttf` en `assets/fonts/Onest-Medium.ttf` van spec 02; spec 02 levert ook `assets/fonts/OFL.txt`. `assets/og/` en het eigen downloadscript vervallen. | gesloten (spec 02) | Andere fonts in spec 02: alleen de bestandsnamen in `loadOgFonts`. |
| Sleutels in andere namespaces | Deze spec leest `vacatures.meta.*`, `vacatures.og.*`, `vacatures.detail.sections.*`, `vacatures.detail.minAge.*` (spec 06) en `beroepen.og.*` met `{occupation}` en `{occupationPlural}` (spec 05); de tekst staat alleen bij de eigenaar (§6.4). | spec 05, spec 06 | Andere namen: alleen `VacancyMetaKey`, de OG-routes en de aanroep van `jobPostingLd`. |
| `lib/legal.ts` | Gesloten in de kruiscontrole (ronde 1, B-40): `published` komt voor alle vaste routes uit `STATIC_ROUTES`; voor de juridische routes leest `lib/routes.ts` die waarde uit `lib/legal.ts`. De sitemap leest alleen `STATIC_ROUTES` (plus `updatedAt` uit `LEGAL_DOCS`), `llms.txt` `publishedLegalDocs()`. | gesloten (B-40) | Geen; alleen de import in `lib/routes.ts` (spec 01). |
| `llms.txt` zonder vacatures | Geen individuele vacatures, omdat ze vaak wisselen en `/vacatures` altijd actueel is; de route is daardoor statisch (`force-static`). Gesloten in de kruiscontrole (ronde 1): spec 01 is aangepast en noemt voor `llms.txt` dezelfde statische rendering. | gesloten (spec 01), Djulan (inhoud) | Vacatures toevoegen: `revalidate = 3600` en `revalidatePath("/llms.txt")` in `revalidateVacancies` (spec 10). |
| ISO 6523-code KvK | `iso6523Code` `"0106:<kvk>"` (ICD 0106 voor het KvK-nummer), pas als het KvK-nummer bekend is. | Djulan (verifiëren in de Google-documentatie) | Veld weglaten; `identifier` blijft. |
| `areaServed` | Volgens B-43: tot `workArea` bevestigd is alleen Den Haag (`City`) in JSON-LD en Den Haag als servicegebied in het Bedrijfsprofiel; daarna komt Haaglanden (`AdministrativeArea`) erbij en noemt het Bedrijfsprofiel Den Haag, Rijswijk, Delft, Westland, Zoetermeer, Leidschendam-Voorburg en Wassenaar. | Jimmy en Lorenzo | Alleen de vlag `workArea` in `lib/claims.ts` (spec 03) en het Bedrijfsprofiel. |
| Openingstijden | Niet in JSON-LD en niet in het Bedrijfsprofiel tot B-22 bevestigd is; nooit "24/7" als openingstijd. | Jimmy | `contact.openingHours` vullen; `employmentAgencyLd` neemt ze vanzelf op. |
| Categorie Bedrijfsprofiel | Primair "Uitzendbureau"; geen aanvullende categorie zonder letterlijke match. | Jimmy | Alleen het profiel. |
| Grens voltijd | 32 uur per week, gelijk aan de uren-bucket van spec 10. | Djulan | Eén constante in `employmentTypesFor`. |
| Geo-redirect | Blijft zoals gebouwd met uitzondering voor crawlers (B-03), hoewel context/10 §7 een niet-blokkerende taalsuggestie aanraadt. Geen afwijking. | Djulan | Spec 01 vervangt de omleiding door een melding. |
| Indexing API | Fase 2 (B-27); fase 1 steunt op sitemap, JobPosting en ISR. Context/10 maakt de API onderdeel van de levenscyclus. | Djulan | Fase 1 uitbreiden: Google Cloud-project, serviceaccount, env var in spec 13, aanroep in `revalidateVacancies`. |

Afwijkingen van B-01 tot en met B-37: geen.
