# 09 Juridisch, privacy en compliance

| Status | Fase | Hangt af van | Bronnen |
|---|---|---|---|
| concept; de juridische teksten zijn concepten ter toetsing door een jurist | 1 | 07 (gebruikt daarnaast 01, 02, 03, 05, 10, 11, 12, 13) | context/09 (volledig), context/11 §6.4, §6.6, §7, §8, context/08 §2.1, §4.6, §6.17, context/03, context/00, spec 00 B-02, B-04, B-07 tot en met B-12, B-17, B-19, B-20, B-21, B-23, B-24, B-26, B-31, B-32, B-40, B-42, B-44, bijlagen/repo-inventaris §1, §2, §7 |

## 1 Doel

Deze module zorgt dat de site van Groos zich aan de wet houdt en dat ook laat zien. Ze levert vier juridische pagina's (privacyverklaring, cookieverklaring, klachtenregeling en algemene voorwaarden) op de bestaande `LegalPage`, de wettelijke vermeldingen in de footer met een eerlijke Wtta-status per fase, de privacyteksten bij de formulieren en de regels waaraan elke vacature- en beroepstekst moet voldoen. Daarnaast legt ze vast wat er buiten de code moet gebeuren: het verwerkingsregister, de verwerkersovereenkomsten en de werkwijze bij verzoeken van betrokkenen, datalekken en klachten. Het resultaat is dat Groos bij de livegang aantoonbaar voldoet aan de AVG (R-11) en geen claim doet die niet klopt (R-12), zonder dat Jimmy en Lorenzo daarvoor schermen nodig hebben die in fase 1 nog niet bestaan (B-19).

## 2 Gebruikers en scenario's

**Werkzoekende (je-vorm, B1)**

- S-09-01 Een schoonmaker solliciteert op haar telefoon op een vacature. Boven de verzendknop leest ze één regel over haar gegevens met een link naar `/privacyverklaring#solliciteren`, waar ze ziet dat haar cv vier weken na afronding automatisch wordt verwijderd.
- S-09-02 Een verhuizer vinkt bij het solliciteren het losse vakje aan om zijn gegevens een jaar te laten bewaren. Twee maanden later mailt hij dat hij dat niet meer wil; Groos trekt de toestemming in volgens §5.6.
- S-09-03 Een logistiek medewerker schrijft zich in via `/inschrijven` zonder vacature. Het verplichte toestemmingsvakje staat uit; zonder vinkje krijgt hij een duidelijke foutmelding.
- S-09-04 Een hulpkracht bouw en sloop leest een vacature met "minimumleeftijd 18 jaar". De vacature noemt de reden (werken op een bouwplaats met sloopwerk) en vraagt nergens naar geboortedatum, BSN of nationaliteit.

**Opdrachtgever (u-vorm)**

- S-09-05 Een facilitair manager wil weten of Groos een echt bedrijf is. In de footer van elke pagina ziet hij de statutaire naam met B.V., het adres, het KvK-nummer, het btw-nummer en de Wtta-status, met een link naar `/werkgevers/wtta`.
- S-09-06 Een opdrachtgever vraagt naar de algemene voorwaarden. Zolang die niet gepubliceerd zijn, staat de pagina niet in de footer en niet in de sitemap; Jimmy stuurt de voorwaarden mee met de offerte.

**Iedereen**

- S-09-07 Een bezoeker wil weten welke cookies de site plaatst en leest `/cookieverklaring`. Er verschijnt geen cookiebanner, omdat er alleen functionele cookies zijn (B-09).
- S-09-08 Een uitzendkracht is ontevreden over de communicatie en dient een klacht in volgens `/klachtenregeling`. Binnen vijf werkdagen krijgt hij een inhoudelijke reactie van Lorenzo, omdat de klacht over Jimmy gaat (B-10).
- S-09-09 Een oud-sollicitant vraagt per mail welke gegevens Groos nog van hem heeft. Jimmy registreert het verzoek, Djulan zoekt de gegevens op en Jimmy antwoordt binnen een maand (§5.6).
- S-09-10 Een Engelstalige werkzoekende opent `/en/privacyverklaring` en leest een Engelse vertaling met de vermelding dat de Nederlandse tekst voorgaat.

**Beheerder (Jimmy en Lorenzo)**

- S-09-11 Lorenzo verliest zijn telefoon met een actieve sessie in `/beheer`. Hij belt Jimmy en Djulan; zij volgen de datalekprocedure (§5.7) en beslissen binnen 72 uur over een melding bij de AP.
- S-09-12 Jimmy schrijft een vacature in `/beheer`. Hij volgt de vacatureregels (§6.8): bruto uurloon ingevuld, geen leeftijdseis zonder arbo-reden, geen "jong team".
- S-09-13 Groos meldt zich in november 2026 aan voor de overgangsregeling. Djulan zet `WTTA.phase` op `transition`; footer en `/werkgevers/wtta` tonen daarna de bijpassende zin.

**Ontwikkelaar (Djulan) en jurist**

- S-09-14 Vóór de productie-livegang tekenen Jimmy en Djulan de verwerkersovereenkomsten uit §5.5 en houdt Djulan de status bij in `docs/compliance/verwerkersovereenkomsten.md`.
- S-09-15 Bij elke tekstronde draait Djulan `npm run check:claims` en loopt hij de claims-checklist (§6.9) na.
- S-09-16 De jurist leest de concepten uit §6.4 tot en met §6.6. Na akkoord zet Djulan in `lib/legal.ts` de versie op `1.0`, `draft` op `false` en verwijdert hij de TODO-markeringen.

## 3 Scope

### 3.1 Wel in fase 1

| Id | Eis | Dient |
|---|---|---|
| E-09-01 | De routes `/privacyverklaring`, `/cookieverklaring`, `/klachtenregeling` en `/algemene-voorwaarden` (plus `/en`-varianten) bestaan, gebruiken `LegalPage` en houden hun tekst in de page als `CONTENT = { nl, en }` (00 §4.4 punt 6). | R-11, R-13, R-09 |
| E-09-02 | De privacyverklaring dekt alle verwerkingen (sollicitaties, inschrijvingen, werken via Groos, aanvragen, berichten, e-mail, website, beheer), met doel, grondslag, bewaartermijn, ontvangers, verwerkers, doorgifte buiten de EU, rechten, contactadres, versie en datum. | R-11 |
| E-09-03 | Er is een korte cookieverklaring en geen cookiebanner; de cookietabel is gebaseerd op een waarneming in de browser, niet op aannames (B-09). | R-11 |
| E-09-04 | Er is een klachtenregeling met indienen, behandelaar en een reactie binnen vijf werkdagen (B-10). | R-11, R-07 |
| E-09-05 | `/algemene-voorwaarden` bestaat met sjabloon, maar is `noindex`, staat niet in de sitemap en wordt nergens gelinkt zolang de tekst er niet is (B-11). | R-09, R-12 |
| E-09-06 | `LegalPage` krijgt een inhoudsopgave, ankers per artikel, tabellen, klikbare links in tekst, een versieregel, een conceptmelding en een CTA naar `/contact`. | R-15, R-05, R-07 |
| E-09-07 | `lib/legal.ts` is de enige bron voor versie, datum, publicatiestatus en conceptstatus van de documenten en voor de Wtta-fase. Footer, sitemap en formulieren lezen daaruit. | R-09, R-19 |
| E-09-08 | Elke publieke pagina toont in de footer: naam met B.V., vestigingsadres, e-mailadres, KvK-nummer, btw-nummer en een link naar de privacyverklaring (art. 3:15d BW). | R-11, R-12 |
| E-09-09 | De Wtta-status verschijnt alleen via `WttaStatus` en past bij de werkelijke fase (B-24); een toelating zonder registernummer is technisch onmogelijk. | R-12 |
| E-09-10 | Elk formulier toont de informatieregel van B-08 boven de verzendknop; solliciteren heeft een optioneel talentpoolvinkje en `/inschrijven` een verplicht toestemmingsvinkje, beide standaard uit. | R-11, R-04, R-07 |
| E-09-11 | Bij elke sollicitatie en inschrijving worden de versie van de privacyverklaring en, bij toestemming, moment en bron van die toestemming opgeslagen. | R-11 |
| E-09-12 | Geen enkel publiek formulier vraagt BSN, kopie identiteitsbewijs, geboortedatum, nationaliteit, foto of gezondheid (B-17). | R-11 |
| E-09-13 | De bewaartermijnen in de privacyverklaring zijn gelijk aan B-07 en aan de constanten van spec 10. | R-11 |
| E-09-14 | De publieke site laadt geen inhoud, scripts of fonts van derden in de browser (geen ingesloten kaarten, video's, social widgets of pixels). | R-11 |
| E-09-15 | Vercel Web Analytics ontvangt geen persoonsgegevens: querystrings worden gefilterd, `/beheer` wordt niet gemeten en conversie-events bevatten alleen toegestane eigenschappen (B-31). | R-11 |
| E-09-16 | Vacatureteksten en beroepspagina's volgen de regels VR-01 tot en met VR-15: discriminatievrij, leeftijd alleen met arbo-reden (B-32), salaris altijd vermeld, contracttype eerlijk, geen kosten, nooit BSN of ID online. | R-12, R-07, R-10 |
| E-09-17 | Er is een claims-checklist (CL-01 tot en met CL-22) en een script `npm run check:claims` dat bij elke tekstronde de plekken toont die gecontroleerd moeten worden. | R-12 |
| E-09-18 | Het verwerkingsregister, de lijst van verwerkersovereenkomsten, de procedures en de claimstatus staan als documenten in `docs/compliance/`. | R-11 |
| E-09-19 | Met elke verwerker is een verwerkersovereenkomst afgesloten voordat er echte persoonsgegevens in productie komen. | R-11, R-17 |
| E-09-20 | Er is een handmatige procedure voor verzoeken van betrokkenen met termijnen en rollen. | R-11 |
| E-09-21 | Er is een handmatige procedure voor datalekken met de 72-uurstermijn en rollen. | R-11 |
| E-09-22 | Lokaal en in het project `groos-dev` staan alleen fictieve persoonsgegevens. | R-11, R-17 |
| E-09-23 | De Engelse teksten zijn een vertaling van de Nederlandse en zeggen dat de Nederlandse tekst voorgaat. | R-13 |
| E-09-24 | Onbevestigde onderdelen en concepten zijn met `TODO` gemarkeerd, zodat `npm run check` de livegang blokkeert tot jurist, Jimmy en Lorenzo ze hebben bevestigd. | R-12, R-17 |
| E-09-25 | De bouw-agent zet de sub-agent legal-layout in volgens §9. | R-16 |

### 3.2 Niet in fase 1

- Een cookiebanner of consentmodule. Die komt pas als er niet-functionele cookies of trackers bijkomen (B-09).
- Schermen in `/beheer` voor privacyverzoeken, verzoekenregister, export en logboekweergave (B-19, fase 2). In fase 1 loopt dit handmatig volgens §5.6.
- De tekst van de algemene voorwaarden. Die levert Jimmy of een jurist (B-11).
- Een DPIA. De specs gaan ervan uit dat die niet verplicht is; de jurist bevestigt dat (§12).
- Het zelf regelen van KvK-registratie, Wtta-aanmelding, keurmerken of verzekeringen. Dat is werk voor Jimmy en Lorenzo; deze spec bepaalt alleen wat de site daarover zegt.

### 3.3 Fase 2

- Tabel `privacy_requests` en beheerschermen "Privacy" (verzoekenregister, verwijderverzoek uitvoeren met voorbeeld, inzage-export) zoals context/11 §4.12.
- Actie "Toestemming vastleggen of intrekken" bij een sollicitatie in `/beheer`.
- Teksten voor jobalert met dubbele opt-in (spec 15) en een toestemmingslink in de afwijzingsmail.
- Een bannermodule met Consent Mode als er ooit tracking bijkomt.
- Vertalingen van de juridische pagina's in extra talen.

## 4 Pagina's en componenten

### 4.1 Bestanden

| Bestand | S/C | Actie | Inhoud |
|---|---|---|---|
| `lib/legal.ts` | n.v.t. | nieuw | Register van juridische documenten en Wtta-configuratie (§5.1). |
| `lib/analytics-privacy.ts` | n.v.t. | nieuw | `analyticsBeforeSend` en `ANALYTICS_ALLOWED_PARAMS` (§4.7). |
| `lib/compliance/copy-rules.json` | n.v.t. | nieuw | Patronen voor de claimcontrole (§10 blok A stap 10). |
| `scripts/check-claims.mjs` | n.v.t. | nieuw | Script achter `npm run check:claims` (§10 blok A stap 11). |
| `components/legal/legal-page.tsx` | S | gewijzigd | Nieuwe props, inhoudsopgave, versieregel, conceptmelding (§4.2). |
| `components/legal/legal-toc.tsx` | C | nieuw | Inhoudsopgave met actief artikel (§4.3). |
| `components/legal/legal-text.tsx` | S | nieuw | Tekst met `[label](href)`-links (§4.3). |
| `components/legal/legal-table.tsx` | S | nieuw | Tabelblok (§4.3). |
| `components/legal/footer-legal.tsx` | S | nieuw | Wettelijke vermeldingen in de footer (§4.5). |
| `components/legal/wtta-status.tsx` | S | nieuw | Wtta-zin per fase (§4.6). |
| `components/legal/privacy-analytics.tsx` | C | nieuw | `<Analytics beforeSend>`-wrapper (§4.7). |
| `app/[locale]/privacyverklaring/page.tsx` | S | nieuw | Tekst uit §6.4. |
| `app/[locale]/cookieverklaring/page.tsx` | S | nieuw | Tekst uit §6.5. |
| `app/[locale]/klachtenregeling/page.tsx` | S | nieuw | Tekst uit §6.6. |
| `app/[locale]/algemene-voorwaarden/page.tsx` | S | herschreven | Sjabloon uit §6.7. |
| `app/[locale]/privacybeleid/` | | verwijderd | Vervangen door `/privacyverklaring` (staat ook op de verwijderlijst van spec 01). |
| `messages/nl/legal.json`, `messages/en/legal.json` | | gewijzigd | Namespace `legal` (§6.1, B-45). |
| `package.json` | | gewijzigd | Script `"check:claims": "node scripts/check-claims.mjs"`. |
| `docs/compliance/verwerkingsregister.md`, `verwerkersovereenkomsten.md`, `procedures.md`, `claims-status.md` | | nieuw | Uit §5.4 tot en met §5.8 en §6.9. |

`components/legal/*` valt onder "juridische pagina's" in de eigenaarschapstabel (00 §4.4a) en is dus van deze spec. Geen nieuwe dependencies.

### 4.2 `LegalPage` (gewijzigd, server component)

Nieuwe typen en props in `components/legal/legal-page.tsx`:

```ts
import type { LegalDocId } from "@/lib/legal";

/** Tekst mag links bevatten als [label](href); zie LegalText. */
export type LegalBlock =
  | string
  | { list: string[] }
  | { table: { caption: string; head: string[]; rows: string[][] } };

export type LegalSection = {
  /** Stabiel anker, gelijk in nl en en, patroon ^[a-z0-9-]+$. */
  id: string;
  heading: string;
  blocks: LegalBlock[];
};

export type LegalContent = {
  title: string;
  metaDescription: string;
  intro: string;
  sections: LegalSection[];
};

export function pickLegal(
  content: { nl: LegalContent; en: LegalContent },
  locale: string,
): LegalContent; // en bij "en", anders nl

export function LegalPage(props: {
  doc: LegalDocId;                 // leest versie, datum en concept uit lib/legal.ts
  content: LegalContent;
  articlePrefix?: string;          // "Artikel " / "Article " of leeg
  download?: { href: string; label: string }; // alleen algemene voorwaarden als pdf
}): React.JSX.Element;
```

Gedrag en opbouw van boven naar beneden. De pagina staat in `container` (spec 02).

0. Kruimelpad: `<Breadcrumbs items={[{ label: content.title, href: getLegalDoc(doc).path }]} />` uit `components/sections/breadcrumbs.tsx` (spec 01), boven de kopband; dat levert ook de `BreadcrumbList`.
1. Kopband: `h1` met `content.title`; `p` met `content.intro`; versieregel `legal.versionLine` met `{version}` en `{date}` uit `getLegalDoc(doc)`. De datum wordt opgemaakt met `new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "nl-NL", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Amsterdam" })`; `locale` komt uit `useLocale()`. Heeft het document geen `updatedAt`, dan vervalt de versieregel.
2. Conceptmelding: als `getLegalDoc(doc).draft` waar is, `Alert tone="neutral"` (spec 02) met `legal.draftNotice`, zonder `role`. Geen waarschuwingskleur.
3. Downloadlink: als `download` is meegegeven een `CtaButton` met `variant="secondary"` en `href={download.href}`.
4. Inhoudsopgave en artikelen. Onder `lg`: een `<details>` met `<summary>` `legal.toc.title` en daarin `LegalToc variant="inline"`, boven de artikelen. Vanaf `lg`: een raster `lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16`; links de artikelen, rechts een `<aside>` met een `sticky top-28` blok met `LegalToc variant="sidebar"`. De inhoudsopgave verschijnt alleen als er vijf of meer artikelen zijn.
5. Artikelen: per sectie een `<article id={section.id} className="scroll-mt-28">` met `h2` "`{articlePrefix}{i + 1}. {heading}`", waarbij het nummer in `text-brand` staat. Blokken: `string` wordt `<p>` via `LegalText`; `{ list }` wordt `<ul>` met `LegalText` per item; `{ table }` wordt `LegalTable`. De artikelen staan in een wrapper met `prose-groos` (spec 02), die witruimte en regellengte regelt; geen eigen `text-base leading-relaxed max-w-[68ch]`.
6. Contactblok: `legal.contactQuestion` en `CtaButton href={ROUTES.contact}` (uit `lib/routes.ts`, spec 01) met `legal.contactCta`. De huidige link `/#contact` vervalt, omdat dat anker straks niet meer bestaat.

Verder:

- De klassen `.bg-grid` en `.hairline` vervallen (B-29, spec 02). Alleen tokenklassen van spec 02: `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-muted`, `text-brand`, `text-brand-strong`.
- Rendert de layout van spec 01 (`app/[locale]/layout.tsx`) al `SiteHeader`, `SiteFooter` en `<main>`, dan haalt de bouw-agent die drie uit `LegalPage`. Rendert de layout ze niet, dan blijven ze in `LegalPage` zoals nu. De bouw-agent controleert dit in het layoutbestand.
- In ontwikkeling (`process.env.NODE_ENV !== "production"`) gooit `LegalPage` een fout bij dubbele of ongeldige `section.id`.
- Geen `"use client"`; alleen `LegalToc` is client.

### 4.3 Hulpcomponenten

**`LegalToc`** (`components/legal/legal-toc.tsx`, client):

```ts
export function LegalToc(props: {
  items: { id: string; number: string; label: string }[];
  ariaLabel: string;              // legal.toc.ariaLabel
  variant: "inline" | "sidebar";
}): React.JSX.Element;
```

Rendert `<nav aria-label={ariaLabel}><ol>` met per item `<a href={"#" + id}>`, het nummer en het label. Werkt zonder JavaScript als gewone ankerlijst. Met JavaScript volgt een `IntersectionObserver` (`rootMargin: "-112px 0px -60% 0px"`) welk artikel in beeld is en zet `aria-current="location"` op die link (stijl: `text-foreground font-medium`, linkerrand `border-brand`; overige links `text-muted-foreground`). Kleurwissel alleen met `motion-safe:transition-colors`. Soepel scrollen alleen via CSS `scroll-behavior: smooth` binnen `@media (prefers-reduced-motion: no-preference)` op `html`; die regel hoort in `app/globals.css` van spec 02. Bestaat die regel niet, dan scrollt de pagina direct, wat ook goed is. In de variant `inline` sluit een klik op een link de omringende `<details>` niet automatisch; dat is bewust, zodat de bezoeker de lijst opnieuw kan gebruiken.

**`LegalText`** (`components/legal/legal-text.tsx`, server): `export function LegalText({ text }: { text: string }): React.JSX.Element`. Splitst `text` op het patroon `/\[([^\]]+)\]\(([^)\s]+)\)/g`. Een href die met `/` begint wordt `Link` uit `@/i18n/navigation`; `#`, `mailto:`, `tel:` en `https:` worden een gewone `<a>`, externe `https:`-links met `rel="noopener noreferrer"` in hetzelfde tabblad. Links krijgen `underline underline-offset-4 text-brand-strong hover:text-brand`. Geen HTML in strings; React escapet de rest.

**`LegalTable`** (`components/legal/legal-table.tsx`, server): `export function LegalTable({ caption, head, rows }: { caption: string; head: string[]; rows: string[][] }): React.JSX.Element`. Rendert een wrapper `<div role="region" aria-label={caption} tabIndex={0} className="overflow-x-auto">` met `<table>`, `<caption>` (zichtbaar, `text-sm text-muted-foreground`), `<th scope="col">` per kop en `LegalText` per cel. Rijen gescheiden door `border-b border-border`, geen zebra. Op 390 px scrollt alleen de tabel horizontaal, nooit de pagina. Heeft spec 02 al `components/ui/table.tsx` toegevoegd, dan mag `LegalTable` die primitive gebruiken.

### 4.4 De vier pagina's

Elke page volgt hetzelfde patroon als de huidige `privacybeleid/page.tsx`: `CONTENT: { nl: LegalContent; en: LegalContent }` boven in het bestand, `generateMetadata` met `pageMetadata()` en een default export die `setRequestLocale(locale)` aanroept en `LegalPage` rendert. Bedrijfsgegevens komen via template-strings uit `contact` in `lib/site.ts`, zodat niets dubbel staat.

```tsx
// app/[locale]/privacyverklaring/page.tsx (schets)
// TODO (jurist): concepttekst versie 0.1, laten toetsen vóór livegang (spec 09 §12).
const CONTENT: { nl: LegalContent; en: LegalContent } = { nl: { ... }, en: { ... } };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const c = pickLegal(CONTENT, locale);
  return pageMetadata({ locale, path: getLegalDoc("privacy").path, title: c.title, description: c.metaDescription });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage doc="privacy" content={pickLegal(CONTENT, locale)} />;
}
```

Zo ook per document: de andere pages geven `path: getLegalDoc("cookies").path`, `getLegalDoc("complaints").path` en `getLegalDoc("terms").path` mee, nooit een vast pad als string.

| Route | Bestand | `doc` | `articlePrefix` | Artikelen | Tekst |
|---|---|---|---|---|---|
| `/privacyverklaring` | `app/[locale]/privacyverklaring/page.tsx` | `privacy` | leeg | 17 | §6.4 |
| `/cookieverklaring` | `app/[locale]/cookieverklaring/page.tsx` | `cookies` | leeg | 8 | §6.5 |
| `/klachtenregeling` | `app/[locale]/klachtenregeling/page.tsx` | `complaints` | `"Artikel "` / `"Article "` | 9 | §6.6 |
| `/algemene-voorwaarden` | `app/[locale]/algemene-voorwaarden/page.tsx` | `terms` | `"Artikel "` / `"Article "` | 0 tot de tekst er is | §6.7 |

Voor `/algemene-voorwaarden` geldt bovendien: `generateMetadata` van `/algemene-voorwaarden` geeft `pageMetadata({ locale, path: getLegalDoc("terms").path, title: c.title, description: c.metaDescription, noindex: !getLegalDoc("terms").published })` terug. Is er een pdf, dan krijgt `LegalPage` `download={{ href: "/documenten/algemene-voorwaarden-groos.pdf", label: t("legal.download") }}` en staat het bestand in `public/documenten/`.

### 4.5 Footer-vermeldingen: `FooterLegal`

`components/legal/footer-legal.tsx`, server component zonder props: `export function FooterLegal(): React.JSX.Element`. Spec 01 (structuur) en spec 02 (uiterlijk) plaatsen `<FooterLegal />` in de onderste balk van `SiteFooter`, boven de regel `footer.rights`. De huidige array `legalLinks` en de sleutels `footer.privacy` en `footer.terms` gebruikt de footer dan niet meer; de links komen uit `FooterLegal`.

Opbouw:

1. Registratieregel als `<p>`: `{contact.name} · {contact.street}, {contact.postalCode} {contact.city} · {legal.footer.kvk} · {legal.footer.vat}`. De middenpunten zijn `<span aria-hidden="true">`. Onder `sm` staat elk onderdeel op een eigen regel. Ontbreekt `contact.btw`, dan wordt het btw-deel weggelaten en meldt AC-09-10 het als fout; de livegang-check vindt de TODO in `lib/site.ts`.
2. `<WttaStatus variant="footer" />`.
3. `<nav aria-label={t("legal.footer.ariaLabel")}>` met een `<ul>` van links naar alle documenten uit `publishedLegalDocs()` in de volgorde privacy, cookies, klachten, voorwaarden, met labels `legal.nav.<id>`. Algemene voorwaarden verschijnen dus pas als `published` waar is.

E-mailadres en telefoon staan in de contactkolom van `SiteFooter` (spec 01); art. 3:15d BW is pas gedekt als die kolom en `FooterLegal` samen op elke pagina staan (AC-09-10). Tekst `text-sm text-muted-foreground`; links `hover:text-brand-strong`.

### 4.6 Wtta-status: `WttaStatus`

`components/legal/wtta-status.tsx`, server component:

```ts
export function WttaStatus(props: { variant: "footer" | "block"; className?: string }): React.JSX.Element | null;
```

Leest `WTTA` uit `lib/legal.ts` (§5.1) en rendert:

| Fase | `footer` | `block` | Link |
|---|---|---|---|
| `none` | niets (`null`) | niets | geen |
| `preparing` | `legal.wtta.footer.preparing` | `legal.wtta.block.preparing` | `legal.wtta.infoLink` naar `/werkgevers/wtta` (alleen in `footer`) |
| `transition` | `legal.wtta.footer.transition` | `legal.wtta.block.transition` | idem |
| `provisional` | `legal.wtta.footer.provisional` | `legal.wtta.block.provisional` | `legal.wtta.registerLink` naar `WTTA.registerUrl` |
| `admitted` | `legal.wtta.footer.admitted` met `{number}` | `legal.wtta.block.admitted` met `{number}` | `legal.wtta.registerLink` naar `WTTA.registerUrl` |

`footer` rendert één `<p>` plus link; `block` rendert één `<p>` plus link voor gebruik op `/werkgevers/wtta`. Spec 05 plaatst `<WttaStatus variant="block" />` op die pagina; de kop daarboven is van spec 05. Geen andere component of tekst op de site mag een Wtta-status, toelating of registernummer noemen (CL-04).

### 4.7 Analytics zonder persoonsgegevens: `PrivacyAnalytics`

`lib/analytics-privacy.ts`:

```ts
import type { BeforeSendEvent } from "@vercel/analytics";

export const ANALYTICS_ALLOWED_PARAMS = ["beroep", "plaats", "uren", "dienst", "pagina"] as const;

/** Haalt /beheer weg en verwijdert elke queryparameter die niet op de lijst staat (ook q en ref). */
export function analyticsBeforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  const url = new URL(event.url);
  if (url.pathname.startsWith("/beheer")) return null;
  for (const key of [...url.searchParams.keys()]) {
    if (!(ANALYTICS_ALLOWED_PARAMS as readonly string[]).includes(key)) url.searchParams.delete(key);
  }
  return { ...event, url: url.toString() };
}
```

`components/legal/privacy-analytics.tsx` (`"use client"`): `export function PrivacyAnalytics() { return <Analytics beforeSend={analyticsBeforeSend} />; }` met `Analytics` uit `@vercel/analytics/next`. Een functie kan niet van een server component naar een client component als prop, daarom deze wrapper. Spec 01 vervangt in `app/[locale]/layout.tsx` `<Analytics />` door `<PrivacyAnalytics />`.

Conversie-events (spec 07 roept `track` aan uit `@vercel/analytics`) bevatten alleen deze eigenschappen: `form` (`"apply" | "register" | "staffRequest" | "contact"`), `beroep` (een beroepen-id uit 00 §4.2) en `vacature` (het vacaturenummer). Nooit naam, e-mail, telefoon, woonplaats, vrije tekst of referentienummer.

### 4.8 Formulieren (plaatsing door spec 07)

Spec 07 bezit de formulieren, de plaatsing en de sleutels. Deze spec levert de tekst (§6.2) en stelt deze eisen:

| Formulier | Informatieregel | Vinkje | Link in de regel |
|---|---|---|---|
| `ApplyForm` (`/vacatures/[slug]`) | `forms.privacy.applyNotice` (je) | optioneel `forms.privacy.talentPool.label` met hint, standaard uit | `/privacyverklaring#solliciteren` |
| `RegisterForm` (`/inschrijven`) | `forms.privacy.registerNotice` (je) | verplicht `forms.privacy.registerConsent.label` met hint en fout, standaard uit | `/privacyverklaring#inschrijven` |
| `StaffRequestForm` (`/werkgevers/personeel-aanvragen`) | `forms.privacy.staffRequestNotice` (u) | geen | `/privacyverklaring#opdrachtgevers` |
| `ContactForm` (`/contact`) | `forms.privacy.contactNotice` (u, B-04) | geen | `/privacyverklaring#berichten` |

- De informatieregel staat direct boven de verzendknop, is altijd zichtbaar (niet in een tooltip of uitklapper) en heeft minimaal AA-contrast.
- De regel wordt gerenderd met `t.rich(key, { link: (chunks) => <Link href="...">{chunks}</Link> })`.
- Vinkjes staan los van de verzendknop en zijn nooit vooraf aangevinkt. De hint staat onder het label en is via `aria-describedby` gekoppeld.
- Geen verplicht kennisnamevinkje bij solliciteren, aanvragen en contact (B-08).

## 5 Data

### 5.1 `lib/legal.ts`

```ts
export type LegalDocId = "privacy" | "cookies" | "complaints" | "terms";

export type LegalDoc = {
  id: LegalDocId;
  path: "/privacyverklaring" | "/cookieverklaring" | "/klachtenregeling" | "/algemene-voorwaarden";
  /** "0.x" zolang concept, "1.0" na akkoord jurist; elke inhoudelijke wijziging verhoogt de versie. */
  version: string;
  /** ISO-datum JJJJ-MM-DD van de huidige versie; leeg zolang er geen tekst is. */
  updatedAt?: string;
  /** Opnemen in footer, sitemap en llms.txt en indexeerbaar maken. */
  published: boolean;
  /** Toont de conceptmelding op de pagina. */
  draft: boolean;
};

// TODO (jurist): versies 0.1 zijn concepten; na akkoord version "1.0", draft false, nieuwe updatedAt.
export const LEGAL_DOCS: readonly LegalDoc[] = [
  { id: "privacy", path: "/privacyverklaring", version: "0.1", updatedAt: "2026-10-02", published: true, draft: true },
  { id: "cookies", path: "/cookieverklaring", version: "0.1", updatedAt: "2026-10-02", published: true, draft: true },
  { id: "complaints", path: "/klachtenregeling", version: "0.1", updatedAt: "2026-10-02", published: true, draft: true },
  { id: "terms", path: "/algemene-voorwaarden", version: "0.0", published: false, draft: true },
] as const;

export function getLegalDoc(id: LegalDocId): LegalDoc;
export function publishedLegalDocs(): LegalDoc[]; // volgorde privacy, cookies, complaints, terms

/** Opslaan bij elke sollicitatie en inschrijving (spec 07, kolom privacy_notice_version). */
export const PRIVACY_NOTICE_VERSION: string = getLegalDoc("privacy").version;

export type WttaConfig =
  | { phase: "none" }
  | { phase: "preparing" }
  | { phase: "transition"; since: string }                         // ISO-datum aanmelding
  | { phase: "provisional"; registerUrl: string; validUntil?: string }
  | { phase: "admitted"; registerNumber: string; registerUrl: string };

// TODO (Jimmy en Lorenzo): fase bevestigen (B-24). "preparing" alleen als jullie de toelating echt voorbereiden.
export const WTTA: WttaConfig = { phase: "preparing" };
```

Regels:

- `lib/legal.ts` is client-veilig (geen `server-only`) en importeert `lib/routes.ts` niet; `lib/routes.ts` leest `published` hieruit (B-40).

- Een wijziging van de tekst van de privacyverklaring, of van de formulierteksten in §6.2, verhoogt `version` van het document `privacy` en zet `updatedAt` op de nieuwe datum. Zo verwijst `privacy_notice_version` altijd naar een tekst die te reconstrueren is uit git.
- `WTTA` wijzigt alleen met bevestiging van Jimmy of Lorenzo. Mijlpalen om na te lopen: 31 december 2026 (einde aanmelding overgangsregeling), 1 juli 2027 (openbaar register), 1 januari 2028 (handhaving).
- Het wettelijk minimumuurloon staat niet in `lib/legal.ts`. Spec 08 gebruikt `MINIMUM_WAGE_21_PLUS` uit `lib/data/options.ts` (spec 10, B-42) voor een waarschuwing (geen blokkade) als een vacature een bruto uurloon onder dit bedrag heeft.

### 5.2 Gegevens die deze module bij formulieren verwacht

De kolommen zijn van spec 10, de schema's van spec 07. Deze spec vraagt:

| Tabel | Kolom | Waarde |
|---|---|---|
| `applications` | `privacy_notice_version` (text, kolom nullable; elk publiek formulier vult hem altijd met `PRIVACY_NOTICE_VERSION`) | `PRIVACY_NOTICE_VERSION` op het moment van indienen. |
| `applications` | `retention_consent` (boolean, standaard false) | true als het talentpoolvinkje (sollicitatie) of het toestemmingsvinkje (inschrijving) is aangevinkt. |
| `applications` | `retention_consent_at` (timestamptz, null) | Servertijd bij indienen als `retention_consent` waar is. |
| `applications` | `retention_consent_source` (enum `consent_source`: `form`, `phone`, `email`, `in_person`) | `form` bij het vinkje op de website (de trigger van spec 10 zet hem); later `phone`, `email` of `in_person` bij handmatige vastlegging. |
| `applications` | `completed_at`, `retain_until` | Zoals spec 10; `retain_until` volgt §5.3. |

Een inschrijving via `/inschrijven` is in spec 10 een rij in `applications` zonder `vacancy_id` (context/11 §2.4). Het zod-schema van spec 07 voor de inschrijving eist `retention_consent: z.literal(true)` met de foutmelding `forms.privacy.registerConsent.error`.

Velden die nooit in een publiek formulier, schema of tabel voor sollicitanten voorkomen: BSN, kopie of upload van een identiteitsbewijs, geboortedatum, nationaliteit of geboorteland, geslacht, burgerlijke staat, pasfoto, gezondheid of verzuim (B-17). De werkrechtvraag is "Mag je in Nederland werken?" met ja of nee.

### 5.3 Bewaartermijnen

De termijnen zijn B-07 in tekstvorm. Spec 10 bezit de constanten en de cron-route die verwijdert (inclusief Storage); deze tabel beschrijft wat die constanten moeten opleveren. De privacyverklaring (§6.4, artikel 12) gebruikt exact deze termijnen.

| Gegevens | Termijn | Start | Wat er gebeurt | Herkomst |
|---|---|---|---|---|
| Sollicitatie op een vacature zonder talentpool | 4 weken | `completed_at` (status `placed`, `rejected` of `withdrawn`) | Cv uit bucket `cvs` en record verwijderd of geanonimiseerd (keuze spec 10) | B-07 |
| Sollicitatie met talentpooltoestemming | 1 jaar | `completed_at` | idem | B-07 |
| Sollicitatie of inschrijving zonder contact | interne herinnering na 8 weken zonder contact; automatisch afgesloten na 12 weken zonder contact; daarna de termijn van 4 weken | `last_contact_at` (notitie, bellen, WhatsApp, e-mail of statuswissel door een beheerder) of `created_at` | na 12 weken status `rejected` (sollicitatie) of `withdrawn` (inschrijving); 28 dagen later geanonimiseerd, cv verwijderd | B-07 |
| Inschrijving via `/inschrijven` | 365 dagen na toestemming, of 28 dagen na afsluiten als dat eerder is | `retention_consent_at`; afsluiten (`completed_at`, handmatig of automatisch) | Geanonimiseerd en cv verwijderd, ook als er wel contact is geweest | B-07 |
| Cv-upload zonder sollicitatie (`pending/`) | 24 uur | upload | Bestand verwijderd | context/11 §8.1 |
| Personeelsaanvraag | 2 jaar | laatste statuswijziging | Verwijderd | B-07 |
| Contactbericht | 6 maanden; spam 30 dagen | status `answered` of `archived`; markering `spam` | Verwijderd | B-07, context/11 §3.4 |
| `email_log` | 90 dagen | verzending | Verwijderd | B-07 |
| `audit_log` | 2 jaar | gebeurtenis | Verwijderd | B-07 |
| Back-ups Supabase | 7 dagen | back-up | Overschreven door Supabase (Pro) | context/11 §8.1 |
| Meldingsmails in de mailbox `info@` | 4 weken | ontvangst | Handmatig: Jimmy of Lorenzo verwijdert maandelijks meldingsmails ouder dan 4 weken uit de map "Website" | aanvulling (§12) |
| Klachtdossier | 1 jaar | afhandeling | Handmatig verwijderd uit het klachtenregister | aanvulling (§12) |
| Verzoekenregister | 2 jaar | afhandeling | Handmatig | aanvulling (§12) |
| Datalekregister | 5 jaar | registratie | Handmatig | aanvulling (§12) |
| Kopie ID bij intake, niet in dienst | maximaal 4 weken | opname | Vernietigd (buiten de website) | art. 7c Waadi |
| Personeels- en loonadministratie | 7 jaar (fiscaal); ID-kopie werknemer 5 jaar na einde dienstverband | einde dienstverband | Buiten de website | context/09 §7 |

Bij het intrekken van talentpooltoestemming wordt `retention_consent` false; spec 10 berekent `retain_until` dan opnieuw met de termijn van 4 weken.

### 5.4 Verwerkingsregister (bijlage voor Djulan en Jimmy)

Verwerkingsverantwoordelijke: Groos Personeelsdiensten B.V., Hugo Coenraadspad 6, 2553 ER Den Haag, KvK TODO, contact info@groospersoneelsdiensten.nl, aanspreekpunt Jimmy (bestuurder, TODO bevestigen) met Lorenzo als vervanger. Geen functionaris gegevensbescherming. De bouw-agent zet deze tabel in `docs/compliance/verwerkingsregister.md` (zonder persoonsgegevens, dus mag in de repo). Doorgifte buiten de EU staat per verwerker in §5.5; beveiliging staat in artikel 13 van de privacyverklaring en in spec 10 (RLS, MFA, privébucket).

| Nr | Verwerking | Doel en grondslag | Betrokkenen en gegevens | Ontvangers en verwerkers | Bewaartermijn |
|---|---|---|---|---|---|
| V-01 | Sollicitaties via de website | Sollicitatie behandelen; art. 6 lid 1 b, na afronding f | Werkzoekenden: naam, telefoon, e-mail, woonplaats, werkrecht ja of nee, rijbewijs B, beschikbaarheid, bericht, cv | Jimmy, Lorenzo; opdrachtgever na overleg; Supabase, Vercel, Resend, STRATO, ontwikkelaar | §5.3 |
| V-02 | Talentpool | Benaderen voor ander werk; art. 6 lid 1 a | Als V-01, plus moment en bron van toestemming | Als V-01 | 1 jaar na afronding |
| V-03 | Inschrijvingen (`/inschrijven`) | Passend werk zoeken en benaderen; art. 6 lid 1 a | Als V-01, plus gewenste beroepen | Als V-01 | maximaal 1 jaar, eerder bij 12 weken zonder contact |
| V-04 | Personeelsaanvragen | Aanvraag, offerte, samenwerking; art. 6 lid 1 b en f | Contactpersonen opdrachtgevers: naam, telefoon, e-mail, bedrijfsgegevens, KvK | Jimmy, Lorenzo; Supabase, Vercel, Resend, STRATO, ontwikkelaar | 2 jaar |
| V-05 | Contactberichten | Vraag beantwoorden; art. 6 lid 1 f | Afzenders: naam, e-mail of telefoon, onderwerp, bericht | Als V-04 | 6 maanden; spam 30 dagen |
| V-06 | Contact per telefoon, WhatsApp en e-mail | Bereikbaarheid; art. 6 lid 1 b en f | Iedereen die contact opneemt: naam, nummer, inhoud | Jimmy, Lorenzo; STRATO (mail); WhatsApp (Meta, rol TODO jurist) | als de verwerking waar het bij hoort |
| V-07 | Bevestigings- en meldingsmails | Ontvangst bevestigen, beheerders informeren; art. 6 lid 1 b en f | Ontvangers: e-mailadres, naam; `email_log` met gehasht adres zonder inhoud | Resend, STRATO | `email_log` 90 dagen; mailbox 4 weken |
| V-08 | Beheeromgeving | Beveiligde toegang en verantwoording; art. 6 lid 1 f | Beheerders: naam, e-mail, wachtwoordhash, TOTP-factor, sessies, `audit_log` met gehasht IP | Supabase, Vercel, ontwikkelaar | `audit_log` 2 jaar; account zolang actief |
| V-09 | Contactpersoon bij vacatures | Kandidaten een vast aanspreekpunt geven; art. 6 lid 1 f, met instemming van Jimmy en Lorenzo | Jimmy en Lorenzo: voornaam, telefoon, WhatsApp, eventueel foto | Openbaar op de site; Supabase, Vercel | zolang zij beheerder zijn |
| V-10 | Beveiliging van de website | Misbruik en spam voorkomen; art. 6 lid 1 f | Bezoekers: IP-adres voor rate limiting per IP-adres (Vercel Firewall, spec 13 §5.6), browserkenmerken (BotID), honeypot en invultijd, tijdstippen | Vercel | volgens Vercel (TODO termijn logs controleren) |
| V-11 | Websitestatistieken | Gebruik meten zonder cookies; art. 6 lid 1 f | Bezoekers: paginabezoek zonder identificatie, conversie-events zonder persoonsgegevens | Vercel | geaggregeerd |
| V-12 | Intake en identificatie | Wettelijke identificatie en werkrecht; art. 6 lid 1 c (art. 7c Waadi, Wav, Wet LB) | Kandidaten: ID-kopie, BSN, werkvergunning | Jimmy, Lorenzo; salarisadministratie TODO | 4 weken als niet in dienst |
| V-13 | Personeels- en loonadministratie | Arbeidsovereenkomst en loon; art. 6 lid 1 b en c | Uitzendkrachten: NAW, BSN, bank, uren, loon, contracten | Salarisadministratie TODO, Belastingdienst, UWV, opdrachtgever (uren) | 7 jaar |
| V-14 | Opdrachtgeversadministratie | Offertes, contracten, facturen; art. 6 lid 1 b en c | Contactpersonen opdrachtgevers | Boekhouder TODO | 7 jaar |
| V-15 | Klachten | Klacht behandelen; art. 6 lid 1 f | Indieners en betrokkenen: naam, contact, inhoud klacht | Jimmy, Lorenzo | 1 jaar na afhandeling |
| V-16 | Verzoeken en datalekken | Verantwoording AVG; art. 6 lid 1 c | Verzoekers: naam, contact, soort verzoek; datalekken: beschrijving zonder onnodige persoonsgegevens | Jimmy, Lorenzo, ontwikkelaar; AP bij melding | 2 en 5 jaar |

### 5.5 Verwerkers en verwerkersovereenkomsten (bijlage voor Djulan en Jimmy)

Alle productieaccounts staan op naam van Groos (B-12, CLAUDE.md). De bouw-agent zet deze tabel met een kolom "Status" (open, aangevraagd, getekend met datum) in `docs/compliance/verwerkersovereenkomsten.md`. Djulan houdt de status bij; Jimmy tekent. `docs/compliance/verwerkersovereenkomsten.md` is de enige plek voor de status van verwerkersovereenkomsten; spec 13 verwijst ernaar.

| Verwerker | Wat | Locatie en doorgifte | Overeenkomst en hoe | Wie tekent | Uiterlijk |
|---|---|---|---|---|---|
| Supabase Inc. | Database, Auth, Storage: alle formuliergegevens, cv's, beheerdersaccounts | Project in eu-central-1 (Frankfurt). Toegang vanuit de VS bij ondersteuning mogelijk; standaardcontractbepalingen in de DPA | DPA van Supabase (supabase.com/legal/dpa). Het project ontstaat via de Vercel Marketplace (B-12): controleren of de DPA dan ook geldt en zo nodig een getekend exemplaar aanvragen via het Supabase-dashboard | Jimmy, als eigenaar van de organisatie | vóór de eerste echte sollicitatie in productie (bouwstap 10) |
| Vercel Inc. | Hosting, functies, logs, BotID, Web Analytics | Wereldwijd netwerk; functieregio volgens spec 13; EU-VS Data Privacy Framework of standaardcontractbepalingen volgens de DPA | DPA van Vercel (vercel.com/legal/dpa), onderdeel van de voorwaarden van het Pro-account | Jimmy, als eigenaar van het Vercel-account | bij het aanmaken van het Pro-account |
| Resend | Versturen van bevestigingen, meldingen en Auth-mails | Verzendregio eu-west-1 (Ierland); Amerikaans bedrijf; doorgifte volgens de DPA | DPA van Resend (resend.com/legal/dpa); juridische entiteit controleren (TODO) | Jimmy, als eigenaar van het Resend-account | vóór de eerste echte mail |
| STRATO AG | Domein, DNS, mailboxen `info@` met meldingsmails en correspondentie | Duitsland, binnen de EU | Overeenkomst voor verwerking in opdracht in het STRATO-klantenpaneel | Jimmy, als houder van het domein | direct |
| Ontwikkelaar: Sinka B.V. (handelsnaam SKUU) | Bouw en technisch beheer; toegang tot Supabase, Vercel en Resend; uitvoeren van privacyverzoeken in fase 1 (§5.6) | Nederland | Verwerkersovereenkomst op basis van een model (bijvoorbeeld NLdigital). Vastleggen: alleen op instructie van Groos, geheimhouding, geen kopieën van productiedata op eigen apparaten, datalekmelding aan Groos binnen 24 uur | Jimmy namens Groos en Djulan namens de ontwikkelaar | vóór de ontwikkelaar productietoegang krijgt |
| Salarisadministratie of backoffice (TODO) | Loonadministratie uitzendkrachten | TODO | DPA van de leverancier | Jimmy | vóór de eerste uitzendkracht |
| Boekhouder (TODO) | Facturen en administratie | TODO | DPA of opdrachtbevestiging met verwerkersclausule | Jimmy | vóór de eerste factuur |

Geen verwerker, met reden:

- GitHub: de repo bevat geen persoonsgegevens. Regel: geen echte namen, adressen of cv's in code, seed, tests, issues of commits.
- Supabase-organisatie Groos Personeelsdiensten (gratis plan, eigenaar Djulan) met project `groos-dev` (B-12), kosten 0: alleen fictieve gegevens (E-09-22). Testmail gaat naar `delivered@resend.dev` of naar eigen adressen van Djulan.
- WhatsApp (Meta): Jimmy en Lorenzo gebruiken het als communicatiemiddel. De jurist beoordeelt de rol en of WhatsApp Business met zakelijke voorwaarden nodig is (§12).
- Google Bedrijfsprofiel: bevat geen gegevens van kandidaten.

Organisatorisch: in Supabase, Vercel en Resend staat het e-mailadres van Jimmy als eigenaar en dat van Djulan als lid, zodat beveiligingsmeldingen van leveranciers bij beiden aankomen (spec 13).

### 5.6 Procedure voor verzoeken van betrokkenen (fase 1, handmatig)

Rollen: Jimmy is verantwoordelijk, Lorenzo vervangt hem, Djulan voert de technische stappen uit binnen vijf werkdagen na een vraag van Jimmy. De wettelijke termijn is één maand na ontvangst, met twee maanden verlenging bij complexe verzoeken als de verzoeker dat binnen de eerste maand hoort (art. 12 lid 3 AVG).

1. **Ontvangen en registreren (dag 0).** Een verzoek kan binnenkomen per mail, telefoon, post of WhatsApp. Wie het ontvangt, zet het dezelfde dag in het verzoekenregister (§5.8) met datum, soort, kanaal, naam, contactgegeven en uiterste datum (ontvangst plus een maand).
2. **Bevestigen en controleren (binnen 3 werkdagen).** Jimmy bevestigt de ontvangst en controleert de identiteit via een kanaal dat al bekend is: terugbellen op het bekende nummer of antwoorden op het bekende e-mailadres. Nooit om een kopie van een identiteitsbewijs vragen.
3. **Gegevens zoeken.** Djulan zoekt in de productiedatabase via de SQL-editor van het Supabase-dashboard, met de kolomnamen van spec 10:

   ```sql
   -- vervang beide waarden; telefoon in E.164, bijvoorbeeld +31612345678
   select 'application' as soort, id, created_at, status, first_name, last_name, email, phone_e164, cv_path
     from applications where lower(email) = lower('naam@voorbeeld.nl') or phone_e164 = '+31612345678';
   select 'staff_request' as soort, id, created_at, status, contact_name, email, phone_e164
     from staff_requests where lower(email) = lower('naam@voorbeeld.nl') or phone_e164 = '+31612345678';
   select 'contact_message' as soort, id, created_at, status, name, email, phone_e164
     from contact_messages where lower(email) = lower('naam@voorbeeld.nl') or phone_e164 = '+31612345678';
   select * from activities where entity_id in ('<id uit de queries hierboven>');
   ```

   Jimmy en Lorenzo zoeken zelf in de mailbox `info@` en in WhatsApp. `email_log` bevat geen inhoud en alleen gehashte adressen; die vervalt na 90 dagen en hoeft niet te worden opgezocht.
4. **Uitvoeren per soort verzoek.**
   - Inzage of overdraagbaarheid: Djulan exporteert de rijen als JSON en downloadt eventuele cv's via het Storage-scherm. Jimmy stuurt het overzicht aan het bekende adres, als pdf of JSON, zonder gegevens van anderen.
   - Correctie: Jimmy past het aan in `/beheer` als het veld daar bewerkbaar is; anders Djulan via SQL.
   - Verwijdering: eerst de cv-bestanden verwijderen via de Storage API of het Storage-scherm (nooit met SQL in `storage.objects`, context/11 §7.3), daarna de rijen in `activities` en de hoofdtabel. Djulan voegt een regel toe aan `audit_log` met actie `privacy.erased`, het soort record en het id, zonder persoonsgegevens. Jimmy en Lorenzo verwijderen bijbehorende mails en WhatsApp-gesprekken. Gegevens die de wet laat bewaren (loonadministratie, facturen) blijven staan; dat staat in het antwoord.
   - Intrekken van talentpooltoestemming: Djulan zet `retention_consent` op false, waarna spec 10 `retain_until` opnieuw berekent. Bij een inschrijving betekent intrekken verwijderen.
   - Bezwaar of beperking: Jimmy beoordeelt het met de jurist als het niet eenvoudig is.
5. **Antwoorden (uiterlijk de datum uit stap 1).** Jimmy antwoordt schriftelijk wat er is gedaan, met de vermelding dat reservekopieën na zeven dagen zijn verdwenen.
6. **Afsluiten.** Het register krijgt datum van afhandeling en wat er is gedaan.

### 5.6a Authenticator kwijt (fase 1, handmatig)

1. **Melden.** De beheerder meldt het verlies bij Djulan. Djulan controleert de identiteit via de andere eigenaar (Jimmy bevestigt Lorenzo en omgekeerd) via een kanaal dat al bekend is, niet via het verloren toestel.
2. **Factor verwijderen en sessies intrekken.** Djulan verwijdert in het Supabase-dashboard van het juiste project (Authentication, Users, de gebruiker, Multi-factor authentication) de TOTP-factor, of in de SQL-editor `delete from auth.mfa_factors where user_id = '<id>';`, en trekt alle sessies in met `delete from auth.sessions where user_id = '<id>';`. Een al uitgegeven toegangstoken blijft hoogstens een uur geldig.
3. **Mogelijk datalek.** Is het toestel gestolen of kwijt met een actieve beheersessie, dan geldt ook §5.7 stap 1 tot en met 3.
4. **Vastleggen.** Djulan voegt een regel toe: `insert into audit_log (actor_type, action, entity_type, entity_id, changes) values ('system', 'admin.mfa_reset', 'admin_profile', '<id>', '{"factor":"totp","sessions":"revoked"}');`.
5. **Opnieuw koppelen.** Bij de volgende login komt de beheerder op `/beheer/mfa/koppelen` en koppelt een nieuwe authenticator-app. Herstelcodes of passkeys volgen in fase 2 (spec 15).

### 5.7 Procedure bij een datalek (fase 1, handmatig)

Een datalek is elke inbreuk waarbij persoonsgegevens verloren gaan of bij iemand terechtkomen die ze niet mag zien. Voorbeelden voor Groos: een telefoon of laptop met een actieve beheersessie raakt kwijt, een mail met kandidaatgegevens gaat naar de verkeerde persoon, een sleutel zoals `SUPABASE_SECRET_KEY` komt in een commit of chat terecht, een beheerdersaccount wordt overgenomen, of een leverancier meldt een eigen lek.

| Stap | Wanneer | Wie | Wat |
|---|---|---|---|
| 1 Melden | direct | wie het ontdekt | Belt Jimmy en Djulan (Lorenzo als Jimmy onbereikbaar is) en noteert het tijdstip van ontdekking; dat is het begin van de 72 uur. |
| 2 Inperken | binnen enkele uren | Djulan | Sessies intrekken en het account blokkeren (`admin_profiles.is_active = false`, uitloggen in Supabase Auth, TOTP-factor resetten); gelekte sleutels roteren (`SUPABASE_SECRET_KEY`, `RESEND_API_KEY`, `CRON_SECRET`) in Supabase, Resend en Vercel en opnieuw deployen. Bij een verkeerd verstuurde mail vraagt Jimmy de ontvanger de mail te verwijderen en dat te bevestigen. |
| 3 Beoordelen | binnen 24 uur | Jimmy en Djulan | Welke gegevens, van hoeveel mensen, hoe gevoelig (cv's en contactgegevens tellen zwaar), en is het risico voor die mensen klein of groot. Gebruik de uitleg van de AP over de meldplicht datalekken. |
| 4 Melden bij de AP | binnen 72 uur na ontdekking | Jimmy, met technische informatie van Djulan | Via het meldloket datalekken op autoriteitpersoonsgegevens.nl, tenzij het lek waarschijnlijk geen risico oplevert. Is nog niet alles bekend, dan toch melden en later aanvullen. |
| 5 Betrokkenen informeren | zonder onnodige vertraging, bij groot risico | Jimmy | Per mail of telefoon in gewone taal: wat er is gebeurd, welke gegevens, wat Groos heeft gedaan en wat zij zelf kunnen doen. |
| 6 Vastleggen | altijd, ook zonder melding | Jimmy | In het datalekregister (§5.8): datum ontdekking, beschrijving, soorten gegevens, aantal betrokkenen, gevolgen, maatregelen, wel of niet gemeld en waarom. |
| 7 Evalueren | binnen 2 weken | Jimmy en Djulan | Wat voorkomt herhaling; vastleggen in het register. |

Een verwerker meldt een lek aan Groos volgens zijn DPA; die melding komt binnen op het eigenaarsadres van Jimmy en bij Djulan (§5.5) en start dezelfde procedure.

### 5.8 Registers buiten de code

Het verzoekenregister, het datalekregister en het klachtenregister bevatten persoonsgegevens. Ze staan daarom niet in de repo en niet in Supabase in fase 1, maar in één spreadsheet "Groos privacyregisters" met drie tabbladen in een eigen opslag van Groos (TODO: welke dienst, §12), alleen toegankelijk voor Jimmy en Lorenzo.

| Tabblad | Kolommen |
|---|---|
| Verzoeken | nummer, ontvangen op, kanaal, soort (inzage, correctie, verwijdering, bezwaar, beperking, overdracht, intrekken), naam, contactgegeven, identiteit gecontroleerd via, uiterste datum, behandelaar, afgehandeld op, wat gedaan |
| Datalekken | nummer, ontdekt op, ontdekt door, beschrijving, soorten gegevens, aantal betrokkenen, risico, maatregelen, gemeld bij AP (datum en meldnummer of reden van niet melden), betrokkenen geïnformeerd, evaluatie |
| Klachten | nummer, ontvangen op, kanaal, naam en contact, onderwerp, behandelaar, reactie verstuurd op, uitkomst, afgehandeld op |

`docs/compliance/procedures.md` bevat §5.6, §5.6a, §5.7 en dit sjabloon zonder ingevulde rijen.

## 6 Tekstelementen

Toon, woordenlijst en lengtes komen van spec 03. Voor juridische tekst geldt in aanvulling: alinea's van twee zinnen waar dat kan, zinnen van ongeveer 15 woorden, wij-zinnen, geen uitroeptekens, geen streepjes tussen zinsdelen, wetsartikelen tussen haakjes achter de zin. Aanspreekvorm volgens B-04: artikelen voor werkzoekenden in je-vorm op B1-niveau, al het andere in u-vorm.

### 6.1 Messages `legal` (eigendom van deze spec)

De sleutel `legal.updatedAt` vervalt; `legal.versionLine` vervangt hem. `legal.contactQuestion` en `legal.contactCta` blijven.

| Sleutel | nl | en |
|---|---|---|
| `legal.versionLine` | Versie {version}, bijgewerkt op {date}. | Version {version}, updated on {date}. |
| `legal.draftNotice` | Dit is een concepttekst. Een jurist controleert hem voordat deze website live gaat. | This is a draft. A lawyer will review it before this website goes live. |
| `legal.contactQuestion` | Is iets in deze tekst niet duidelijk? Bel of mail ons, dan leggen wij het uit. | Is something in this text unclear? Call or email us and we will explain it. |
| `legal.contactCta` | Neem contact op | Contact us |
| `legal.download` | Download de pdf | Download the PDF |
| `legal.toc.title` | Inhoud | Contents |
| `legal.toc.ariaLabel` | Inhoud van deze pagina | Contents of this page |
| `legal.nav.privacy` | Privacyverklaring | Privacy statement |
| `legal.nav.cookies` | Cookieverklaring | Cookie statement |
| `legal.nav.complaints` | Klachtenregeling | Complaints procedure |
| `legal.nav.terms` | Algemene voorwaarden | Terms and conditions |
| `legal.footer.ariaLabel` | Juridische informatie | Legal information |
| `legal.footer.kvk` | KvK {number} | Chamber of Commerce {number} |
| `legal.footer.vat` | Btw {number} | VAT {number} |
| `legal.wtta.footer.preparing` | Wij bereiden onze toelating onder de Wtta voor. | We are preparing our admission under the Dutch Wtta act. |
| `legal.wtta.footer.transition` | Wij zijn aangemeld voor de overgangsregeling van de Wtta. | We have registered for the Wtta transitional arrangement. |
| `legal.wtta.footer.provisional` | Wij hebben een voorlopige toelating van de Nederlandse Autoriteit Uitleenmarkt. | We hold a provisional admission from the Nederlandse Autoriteit Uitleenmarkt. |
| `legal.wtta.footer.admitted` | Wij zijn toegelaten door de Nederlandse Autoriteit Uitleenmarkt onder registernummer {number}. | We are admitted by the Nederlandse Autoriteit Uitleenmarkt under register number {number}. |
| `legal.wtta.block.preparing` | Groos Personeelsdiensten bereidt de toelating onder de Wet toelating terbeschikkingstelling van arbeidskrachten voor. Zodra wij zijn aangemeld of toegelaten, ziet u dat hier met een link naar het openbare register. | Groos Personeelsdiensten is preparing its admission under the Dutch act on the admission of labour providers (Wtta). As soon as we have registered or been admitted, you will see it here with a link to the public register. |
| `legal.wtta.block.transition` | Groos Personeelsdiensten is aangemeld voor de overgangsregeling van de Wet toelating terbeschikkingstelling van arbeidskrachten. Vanaf 1 juli 2027 kunt u onze status controleren in het openbare register van de Nederlandse Autoriteit Uitleenmarkt. | Groos Personeelsdiensten has registered for the transitional arrangement of the Wtta. From 1 July 2027 you can check our status in the public register of the Nederlandse Autoriteit Uitleenmarkt. |
| `legal.wtta.block.provisional` | Groos Personeelsdiensten heeft een voorlopige toelating van de Nederlandse Autoriteit Uitleenmarkt. U kunt dit zelf controleren in het openbare register. | Groos Personeelsdiensten holds a provisional admission from the Nederlandse Autoriteit Uitleenmarkt. You can check this yourself in the public register. |
| `legal.wtta.block.admitted` | Groos Personeelsdiensten is toegelaten tot de uitleenmarkt onder registernummer {number}. In het openbare register van de Nederlandse Autoriteit Uitleenmarkt ziet u of de toelating geldig is. | Groos Personeelsdiensten is admitted to the labour provider market under register number {number}. The public register of the Nederlandse Autoriteit Uitleenmarkt shows whether the admission is valid. |
| `legal.wtta.infoLink` | Lees wat de Wtta voor inleners betekent | Read what the Wtta means for hirers |
| `legal.wtta.registerLink` | Bekijk onze registratie in het openbare register | View our registration in the public register |

Spec 03 bezit de namespace `footer`; de sleutels `footer.privacy` en `footer.terms` worden door `FooterLegal` niet meer gebruikt en kunnen daar vervallen.

### 6.2 Formulierteksten (sleutels van spec 07)

Spec 07 bezit de namespace `forms`. Deze spec verwacht onderstaande paden; kiest spec 07 andere paden, dan is de tekst leidend en niet het pad. `{email}` is `contact.email`. De backticks in de tabel zijn alleen opmaak; in de JSON staat bijvoorbeeld `"Wij gebruiken je gegevens voor deze sollicitatie. In onze <link>privacyverklaring</link> lees je hoe lang wij ze bewaren en wat je rechten zijn."` Bij elke wijziging van deze teksten verhoogt de versie van de privacyverklaring (§5.1).

| Sleutel | nl | en |
|---|---|---|
| `forms.privacy.applyNotice` | Wij gebruiken je gegevens voor deze sollicitatie. In onze `<link>`privacyverklaring`</link>` lees je hoe lang wij ze bewaren en wat je rechten zijn. | We use your details for this application. Read in our `<link>`privacy statement`</link>` how long we keep them and what your rights are. |
| `forms.privacy.registerNotice` | Wij gebruiken je gegevens om passend werk voor je te zoeken. In onze `<link>`privacyverklaring`</link>` lees je hoe lang wij ze bewaren en wat je rechten zijn. | We use your details to find suitable work for you. Read in our `<link>`privacy statement`</link>` how long we keep them and what your rights are. |
| `forms.privacy.staffRequestNotice` | Wij gebruiken uw gegevens alleen om uw aanvraag te behandelen. In onze `<link>`privacyverklaring`</link>` leest u hoe wij daarmee omgaan. | We only use your details to handle your request. Read in our `<link>`privacy statement`</link>` how we handle them. |
| `forms.privacy.contactNotice` | Wij gebruiken uw gegevens alleen om uw bericht te beantwoorden. In onze `<link>`privacyverklaring`</link>` leest u hoe wij daarmee omgaan. | We only use your details to answer your message. Read in our `<link>`privacy statement`</link>` how we handle them. |
| `forms.privacy.talentPool.label` | Bewaar mijn gegevens een jaar, zodat Groos mij kan benaderen voor ander passend werk. | Keep my details for one year so Groos can contact me about other suitable work. |
| `forms.privacy.talentPool.hint` | Dit is niet verplicht. Je kunt deze toestemming altijd intrekken met een mail naar {email}. | This is optional. You can withdraw your consent at any time by emailing {email}. |
| `forms.privacy.registerConsent.label` | Ik geef Groos toestemming om mijn gegevens een jaar te bewaren en mij te benaderen voor passend werk. | I give Groos permission to keep my details for one year and to contact me about suitable work. |
| `forms.privacy.registerConsent.hint` | Zonder deze toestemming kunnen wij je inschrijving niet bewaren. Je kunt hem altijd intrekken via {email}. | Without this permission we cannot keep your registration. You can withdraw it at any time via {email}. |
| `forms.privacy.registerConsent.error` | Vink dit vakje aan om je in te schrijven. | Tick this box to register. |

### 6.3 Engelse vertaling

De bouw-agent vertaalt §6.4 tot en met §6.6 naar het `en`-blok van elke page. Regels:

- De `intro` van elke Engelse versie eindigt met: "This is a translation of the Dutch text. If the two versions differ, the Dutch version applies."
- Overal "you"; geen onderscheid tussen je en u.
- Zelfde artikelen, zelfde volgorde, zelfde `id`'s, zelfde tabellen.
- Termen: privacyverklaring is privacy statement; verwerkingsverantwoordelijke is controller; verwerker is processor; verwerkersovereenkomst is data processing agreement; grondslag is legal basis; gerechtvaardigd belang is legitimate interest; Autoriteit Persoonsgegevens is Dutch Data Protection Authority (Autoriteit Persoonsgegevens); uitzendbureau is employment agency; opdrachtgever is client; uitzendkracht is temporary worker; burgerservicenummer is citizen service number (BSN). Wtta en Nederlandse Autoriteit Uitleenmarkt blijven in het Nederlands, met bij de eerste vermelding een korte Engelse omschrijving.

### 6.4 Privacyverklaring (concept 0.1 voor de jurist)

Metadata: titel "Privacyverklaring"; beschrijving "Lees welke gegevens Groos Personeelsdiensten verwerkt als u solliciteert, personeel aanvraagt of contact opneemt. U leest ook hoe lang wij ze bewaren."

Intro: "Groos Personeelsdiensten gebruikt gegevens van werkzoekenden, uitzendkrachten en opdrachtgevers. Hier staat welke gegevens dat zijn, waarvoor wij ze gebruiken, hoe lang wij ze bewaren en welke rechten u heeft."

Waarden tussen accolades komen uit `contact` in `lib/site.ts`; links staan in de notatie `[label](href)`. De pagina krijgt bovenaan de code het commentaar `// TODO (jurist): concepttekst versie 0.1, laten toetsen vóór livegang (spec 09 §12).` De zichtbare TODO's in de tekst blijven staan tot de gegevens bekend zijn.

**1 Wie wij zijn** (`wie-wij-zijn`)

Groos Personeelsdiensten B.V. bepaalt waarvoor en hoe de persoonsgegevens in deze verklaring worden gebruikt. Wij zijn een uitzendbureau in Den Haag en werken met werkzoekenden, uitzendkrachten en opdrachtgevers.

- {name}, {street}, {postalCode} {city}
- KvK-nummer {kvk}
- E-mail: [{email}]({emailHref})
- Telefoon: [{phone}]({phoneHref})

Wij hebben geen functionaris voor gegevensbescherming, omdat dat voor ons niet verplicht is. Jimmy en Lorenzo zijn het aanspreekpunt voor alle vragen over privacy.

**2 Voor wie deze verklaring geldt** (`voor-wie`)

Deze verklaring geldt voor iedereen van wie wij gegevens gebruiken, via de website of via e-mail, telefoon en WhatsApp. Dat zijn werkzoekenden, uitzendkrachten, contactpersonen bij opdrachtgevers en andere mensen die contact met ons opnemen.

In de artikelen voor werkzoekenden spreken wij je aan met je. In de andere artikelen spreken wij u aan met u.

**3 Als je solliciteert op een vacature** (`solliciteren`)

Solliciteer je via onze website, dan vragen wij je naam, telefoonnummer, e-mailadres en woonplaats. Ook vragen wij of je in Nederland mag werken.

Je kunt zelf meer sturen, zoals je cv, een bericht en de datum waarop je kunt beginnen. Vraagt de vacature om een rijbewijs, dan vragen wij ook of je rijbewijs B hebt.

Via de website vragen wij nooit om:

- je burgerservicenummer (BSN);
- een kopie van je identiteitsbewijs;
- je geboortedatum of nationaliteit;
- een foto van jezelf;
- gegevens over je gezondheid.

Wij gebruiken je gegevens om je sollicitatie te bekijken en contact met je op te nemen. Dat doen wij per telefoon, WhatsApp of e-mail.

Dat mag omdat je zelf solliciteert en wij samen kijken of er een arbeidsovereenkomst kan komen. In de wet heet dat een stap vóór een overeenkomst (artikel 6 lid 1 onder b AVG).

Is je sollicitatie afgerond, dan bewaren wij je gegevens nog vier weken. Zo kunnen wij vragen over je sollicitatie nog beantwoorden (gerechtvaardigd belang, artikel 6 lid 1 onder f AVG).

Afgerond betekent dat je via ons aan het werk bent, dat wij je hebben afgewezen of dat je je sollicitatie hebt ingetrokken. Horen wij twaalf weken niets van je, dan ronden wij je sollicitatie ook af.

Na die vier weken verwijderen wij je gegevens en je cv automatisch. Ga je via ons werken, dan lees je in het artikel "Als je via ons gaat werken" welke gegevens wij dan bewaren.

Wil je dat wij je ook benaderen voor ander werk? Dan kun je bij het solliciteren een los vakje aanvinken.

Met dat vinkje bewaren wij je gegevens tot een jaar nadat je sollicitatie is afgerond. Dat doen wij alleen met jouw toestemming (artikel 6 lid 1 onder a AVG), en die kun je altijd intrekken.

**4 Als je je inschrijft zonder vacature** (`inschrijven`)

Schrijf je je in via de pagina Inschrijven, dan vragen wij dezelfde gegevens als bij een sollicitatie. Je kunt ons ook vertellen welk werk je zoekt.

Wij gebruiken die gegevens om passend werk voor je te zoeken en je daarvoor te benaderen. Dat doen wij alleen met jouw toestemming, die je geeft met het vakje in het formulier (artikel 6 lid 1 onder a AVG).

Wij bewaren je inschrijving zolang je via ons werk zoekt, en nooit langer dan een jaar.

Is er twaalf weken geen contact geweest, dan sluiten wij je inschrijving af. Vier weken later verwijderen wij je gegevens automatisch.

Wil je niet meer ingeschreven staan? Stuur dan een mail naar [{email}]({emailHref}) of bel ons, dan verwijderen wij je gegevens.

Ben je jonger dan zestien jaar? Dan heb je toestemming van je ouder of voogd nodig om je in te schrijven.

**5 Als je via ons gaat werken** (`werken-via-groos`)

Ga je via ons aan het werk, dan hebben wij meer gegevens van je nodig. Die vragen wij in een persoonlijk gesprek en nooit via de website.

Wij bekijken dan je originele identiteitsbewijs en maken er een kopie van, omdat de wet dat verplicht. Ook hebben wij je burgerservicenummer nodig voor je loon en de belasting.

Kom je toch niet bij ons in dienst, dan vernietigen wij de kopie van je identiteitsbewijs binnen vier weken. Kom je wel in dienst, dan bewaren wij je personeelsgegevens zo lang als de wet voorschrijft; voor de belasting is dat zeven jaar.

Wij gebruiken deze gegevens voor je arbeidsovereenkomst, je loon en onze wettelijke plichten (artikel 6 lid 1 onder b en c AVG). Voor de loonadministratie werken wij samen met TODO naam salarisadministratie.

Wij geven de opdrachtgever waar je werkt alleen de gegevens die nodig zijn. Dat zijn bijvoorbeeld je naam, je werktijden en je certificaten.

**6 Als u personeel aanvraagt of met ons samenwerkt** (`opdrachtgevers`)

Vraagt u personeel aan, dan gebruiken wij uw naam, telefoonnummer en e-mailadres en de gegevens van uw bedrijf. Wij gebruiken die om uw aanvraag te behandelen, een offerte te maken en de samenwerking uit te voeren.

Dat doen wij om een overeenkomst met uw bedrijf te sluiten en uit te voeren, en omdat wij zakelijk contact met u willen houden. De grondslagen zijn artikel 6 lid 1 onder b en f AVG.

Wij bewaren uw aanvraag tot twee jaar na de laatste wijziging. Offertes, overeenkomsten en facturen bewaren wij zeven jaar, omdat de belastingwet dat verplicht.

**7 Als u ons een bericht stuurt** (`berichten`)

Stuurt u een bericht via het contactformulier, dan gebruiken wij uw naam, uw e-mailadres of telefoonnummer en uw bericht. Wij gebruiken die alleen om uw vraag te beantwoorden (gerechtvaardigd belang, artikel 6 lid 1 onder f AVG).

Wij bewaren het bericht tot zes maanden nadat wij het hebben afgehandeld. Berichten die wij als spam herkennen, verwijderen wij na dertig dagen.

Neemt u contact op via WhatsApp, dan gebruikt ook WhatsApp uw gegevens, volgens de eigen privacyverklaring van WhatsApp. Stuur via WhatsApp daarom geen kopie van uw identiteitsbewijs of andere gevoelige gegevens.

**8 Bevestigingen en meldingen per e-mail** (`e-mail`)

Na het versturen van een formulier krijgt u een bevestiging per e-mail, en Jimmy en Lorenzo krijgen een melding. Wij versturen die e-mails via Resend, vanaf servers in de Europese Unie.

Een cv sturen wij nooit als bijlage mee. Jimmy en Lorenzo openen een cv alleen in onze beveiligde beheeromgeving.

Van elke verstuurde e-mail bewaren wij negentig dagen een kort verzendverslag. Daarin staat niet wat er in de e-mail stond, en uw e-mailadres alleen in onherkenbare vorm.

**9 Onze website: beveiliging, statistieken en cookies** (`website`)

Onze website wordt gehost door Vercel. Bij elk bezoek verwerkt Vercel technische gegevens zoals uw IP-adres, om de website te leveren en te beveiligen.

Bij het versturen van een formulier controleren wij met Vercel BotID of het verzoek van een mens komt. BotID beoordeelt daarvoor technische kenmerken van uw browser, en wij gebruiken die alleen voor deze controle.

Ook bevat elk formulier een onzichtbaar controleveld en kijken wij hoe snel het is ingevuld. Dit doen wij om misbruik en spam te voorkomen (gerechtvaardigd belang, artikel 6 lid 1 onder f AVG).

Om misbruik te voorkomen beperkt onze hostingpartij Vercel het aantal formulierverzendingen en inlogpogingen per IP-adres; daarvoor wordt het IP-adres kort verwerkt.

Engelse tekst van deze alinea voor het `en`-blok (§6.3): "To prevent abuse, our hosting provider Vercel limits the number of form submissions and login attempts per IP address; the IP address is processed briefly for this purpose."

Wij meten het gebruik van de website met Vercel Web Analytics. Dat werkt zonder cookies, en wij kunnen u daarmee niet herkennen bij een volgend bezoek.

Wij tellen ook hoeveel formulieren er worden verstuurd, zonder namen of andere persoonsgegevens. Welke cookies wij wel gebruiken, leest u in onze [cookieverklaring](/cookieverklaring).

**10 Met wie wij gegevens delen** (`delen`)

Wij verkopen persoonsgegevens nooit. Wij delen ze alleen als dat nodig is voor ons werk of als de wet dat verplicht.

- Opdrachtgevers krijgen de gegevens die nodig zijn als wij iemand voorstellen voor werk. Een cv sturen wij pas door als wij dat eerst met de werkzoekende hebben besproken.
- Overheidsinstanties zoals de Belastingdienst, het UWV en de Nederlandse Arbeidsinspectie krijgen gegevens als de wet ons dat verplicht.
- Leveranciers die gegevens in onze opdracht verwerken, de verwerkers, staan hieronder.

Deze verwerkers werken in onze opdracht:

- Supabase: database en opslag van cv's, op servers in Frankfurt;
- Vercel: hosting van de website, beveiliging van formulieren en statistieken;
- Resend: versturen van e-mail;
- STRATO: domeinnaam en e-mailboxen, in Duitsland;
- Sinka B.V. (handelsnaam SKUU; TODO juridische naam bevestigen, 00 §7 punt 6): bouw en technisch beheer van de website;
- TODO naam salarisadministratie: loonadministratie van uitzendkrachten.

Met elke verwerker hebben wij een verwerkersovereenkomst. Daarin staat dat zij de gegevens alleen voor ons gebruiken en goed beveiligen.

**11 Gegevens buiten de Europese Unie** (`buiten-de-eu`)

Wij bewaren gegevens zoveel mogelijk in de Europese Unie. Onze database en de cv's staan bij Supabase op servers in Frankfurt.

Supabase, Vercel en Resend zijn Amerikaanse bedrijven. Daardoor kunnen gegevens soms toch in de Verenigde Staten worden verwerkt, bijvoorbeeld bij technische ondersteuning.

Voor die doorgifte gelden de afspraken uit hun verwerkersovereenkomst. Dat zijn het EU-VS Data Privacy Framework of de standaardcontractbepalingen van de Europese Commissie.

**12 Hoe lang wij gegevens bewaren** (`bewaartermijnen`)

Wij bewaren gegevens niet langer dan nodig. Het verwijderen gebeurt automatisch, ook van cv's.

Tabel met caption "Bewaartermijnen" en koppen "Gegevens" en "Hoe lang wij ze bewaren":

| Gegevens | Hoe lang wij ze bewaren |
|---|---|
| Sollicitatie op een vacature | Vier weken nadat de sollicitatie is afgerond |
| Sollicitatie met toestemming voor ander werk | Een jaar nadat de sollicitatie is afgerond |
| Inschrijving zonder vacature | Zolang je werk zoekt en nooit langer dan een jaar; na twaalf weken zonder contact afgesloten en vier weken later verwijderd |
| Cv dat niet bij een verstuurde sollicitatie hoort | 24 uur |
| Personeelsaanvraag | Twee jaar na de laatste wijziging |
| Bericht via het contactformulier | Zes maanden na afhandeling; spam dertig dagen |
| Verzendverslag van een e-mail | Negentig dagen |
| Logboek van de beheeromgeving | Twee jaar |
| Kopie identiteitsbewijs als je niet in dienst komt | Hoogstens vier weken |
| Personeels- en loonadministratie | Zo lang als de wet voorschrijft; voor de belasting zeven jaar |
| Klacht | Een jaar na afhandeling |

Een verwijderd gegeven kan nog zeven dagen in een reservekopie van de database staan. Daarna is het ook daar verdwenen.

**13 Beveiliging** (`beveiliging`)

Wij beveiligen gegevens met passende technische en organisatorische maatregelen. Alleen Jimmy en Lorenzo kunnen in de beheeromgeving, met een wachtwoord en een code uit een app op hun telefoon.

Cv's staan in afgeschermde opslag en zijn alleen te openen via een link die kort geldig is. Wij leggen vast wanneer een cv is bekeken.

Gaat er toch iets mis met persoonsgegevens, dan melden wij dat binnen 72 uur bij de Autoriteit Persoonsgegevens als de wet dat vraagt. Loopt u daardoor een groot risico, dan laten wij het u ook zelf weten.

**14 Geen automatische besluiten** (`besluiten`)

Wij nemen geen besluiten over mensen die alleen door een computer worden genomen. Jimmy of Lorenzo bekijkt zelf elke sollicitatie en inschrijving.

Wij gebruiken geen kunstmatige intelligentie om sollicitaties te selecteren of te beoordelen. Gaan wij dat ooit wel doen, dan passen wij eerst deze verklaring aan.

**15 Uw rechten** (`rechten`)

Iedereen van wie wij gegevens gebruiken, heeft deze rechten:

- inzage in de gegevens die wij van u hebben;
- correctie van gegevens die niet kloppen;
- verwijdering van uw gegevens;
- beperking van het gebruik van uw gegevens;
- bezwaar tegen het gebruik van uw gegevens;
- uw gegevens ontvangen in een gangbaar bestand, om ze aan een ander te geven;
- uw toestemming intrekken, als wij gegevens op basis van toestemming gebruiken.

Een verzoek stuurt u naar [{email}]({emailHref}) of per post naar ons adres. Wij reageren binnen een maand, en bij een ingewikkeld verzoek laten wij binnen die maand weten als wij meer tijd nodig hebben.

Wij controleren of het verzoek echt van u komt via het telefoonnummer of e-mailadres dat wij al van u hebben. Wij vragen daarvoor nooit een kopie van uw identiteitsbewijs.

Soms mogen wij gegevens niet verwijderen, omdat de wet ons verplicht ze te bewaren. Dan leggen wij uit om welke gegevens het gaat en waarom.

Trekt u uw toestemming in, dan stoppen wij met dat gebruik. Wat wij daarvoor met uw gegevens deden, blijft wel toegestaan.

**16 Een klacht over privacy** (`klacht`)

Bent u niet tevreden over hoe wij met uw gegevens omgaan, laat het ons dan eerst weten. Dat kan volgens onze [klachtenregeling](/klachtenregeling).

U kunt ook altijd een klacht indienen bij de Autoriteit Persoonsgegevens. Dat doet u via [autoriteitpersoonsgegevens.nl](https://autoriteitpersoonsgegevens.nl).

**17 Wijzigingen in deze verklaring** (`wijzigingen`)

Wij passen deze verklaring aan als onze werkwijze of de wet verandert. Bovenaan deze pagina staan het versienummer en de datum van de huidige versie.

Bij elke sollicitatie en inschrijving leggen wij vast welke versie op dat moment gold. Zo kunnen wij altijd laten zien wat wij u hebben verteld.

### 6.5 Cookieverklaring (concept 0.1)

Metadata: titel "Cookieverklaring"; beschrijving "Groos Personeelsdiensten gebruikt alleen cookies die nodig zijn en meet bezoek zonder cookies. Hier leest u welke cookies dat zijn en waarom."

Intro: "Op deze pagina leest u welke cookies onze website gebruikt en waarom. Wij gebruiken alleen cookies die nodig zijn, daarom vragen wij u niet om toestemming."

**1 Wat cookies zijn** (`wat-zijn-cookies`)

Een cookie is een klein tekstbestand dat een website op uw computer of telefoon opslaat. Daarmee onthoudt de website bijvoorbeeld welke taal u heeft gekozen.

**2 Welke cookies wij gebruiken** (`welke-cookies`)

Onze website gebruikt alleen functionele cookies. Die zijn nodig om de website goed te laten werken, en daarvoor is volgens de Telecommunicatiewet geen toestemming nodig.

Tabel met caption "Cookies op deze website":

| Naam | Waarvoor | Hoe lang | Soort |
|---|---|---|---|
| NEXT_LOCALE | Onthoudt of u de website in het Nederlands of in het Engels bekijkt. U krijgt deze cookie alleen als u een taal kiest, of als u de website voor het eerst van buiten Nederland en België bezoekt. | Een jaar | Functioneel |
| sb-…-auth-token | Houdt Jimmy en Lorenzo ingelogd in de beheeromgeving. Bezoekers van de website krijgen deze cookie niet. | Tot het uitloggen; TODO maximale duur na waarneming invullen | Functioneel |

De bouw-agent vult deze tabel aan of past hem aan op basis van de waarneming in stap B2 van §10. Elke cookie die dan op een publieke pagina verschijnt en hier niet staat, krijgt een eigen rij. Is het geen functionele cookie, dan stopt de bouw-agent en legt hij het aan Djulan voor, omdat B-09 dan niet meer klopt.

**3 Statistieken zonder cookies** (`statistieken`)

Wij meten het bezoek aan onze website met Vercel Web Analytics. Dat werkt zonder cookies en zonder iets op uw apparaat op te slaan.

Wij zien daardoor hoeveel pagina's er worden bekeken en hoeveel formulieren er worden verstuurd. Wij kunnen u daarmee niet herkennen en niet volgen op andere websites.

**4 Beveiliging van formulieren** (`beveiliging`)

Bij het versturen van een formulier controleert Vercel BotID of het verzoek van een mens komt. Daarbij plaatsen wij geen cookies.

Meer hierover leest u in onze [privacyverklaring](/privacyverklaring#website).

De zin "Daarbij plaatsen wij geen cookies." blijft alleen staan als de waarneming in stap B2 dat bevestigt; anders komt de cookie in de tabel van artikel 2 en vervalt de zin.

**5 Geen advertentiecookies en geen inhoud van anderen** (`geen-tracking`)

Wij gebruiken geen advertentiecookies en geen pixels van sociale media. Ook staan er op onze website geen ingesloten kaarten, video's of berichten van andere websites.

Klikt u op een link naar bijvoorbeeld Google Maps, WhatsApp of LinkedIn, dan komt u op een andere website. Die website heeft eigen cookies en een eigen cookieverklaring.

**6 Cookies zelf verwijderen** (`zelf-regelen`)

U kunt cookies altijd verwijderen of blokkeren in de instellingen van uw browser. Verwijdert u de taalcookie, dan ziet u de website weer in de standaardtaal.

**7 Wijzigingen** (`wijzigingen`)

Gaan wij ooit cookies gebruiken waarvoor toestemming nodig is, dan vragen wij u die eerst. Deze verklaring passen wij dan ook aan.

**8 Vragen** (`vragen`)

Heeft u een vraag over cookies, mail dan naar [{email}]({emailHref}). Wij helpen u graag verder.

### 6.6 Klachtenregeling (concept 0.1)

Metadata: titel "Klachtenregeling"; beschrijving "Heeft u een klacht over Groos Personeelsdiensten? Hier leest u hoe u die indient, wie hem behandelt en wanneer u antwoord krijgt."

Intro: "Wij willen dat iedereen goed wordt behandeld door Groos Personeelsdiensten. Bent u toch niet tevreden, dan leest u hier hoe u een klacht indient en wat wij ermee doen."

Bovenaan de page: `// TODO (Jimmy en Lorenzo): termijnen van vijf werkdagen en vier weken bevestigen (B-10).`

**Artikel 1 Voor wie deze regeling geldt** (`voor-wie`)

Deze regeling geldt voor werkzoekenden, uitzendkrachten, opdrachtgevers en iedereen die met ons te maken heeft. U kunt een klacht indienen over hoe wij u hebben behandeld, over onze werkwijze of over iemand die voor Groos werkt.

**Artikel 2 Waarover u een klacht kunt indienen** (`onderwerpen`)

U kunt bijvoorbeeld een klacht indienen over:

- de manier waarop wij met u communiceren;
- de afhandeling van een sollicitatie, inschrijving of aanvraag;
- het gebruik van uw persoonsgegevens;
- ongelijke behandeling of discriminatie;
- uw arbeidsvoorwaarden of de veiligheid tijdens uw werk via Groos.

Gaat uw klacht over de werkplek bij een opdrachtgever, dan bespreken wij die ook met de opdrachtgever. Dat doen wij alleen als u dat goed vindt.

**Artikel 3 Hoe u een klacht indient** (`indienen`)

Stuur uw klacht per e-mail naar [{email}]({emailHref}) met als onderwerp "Klacht". U kunt ook een brief sturen naar {name}, {street}, {postalCode} {city}.

Belt u liever, dan kan dat via [{phone}]({phoneHref}). Wij schrijven uw klacht dan op en sturen u die ter controle.

Zet in uw klacht in elk geval:

- uw naam en hoe wij u kunnen bereiken;
- waar de klacht over gaat en wanneer het gebeurde;
- wat u van ons verwacht.

**Artikel 4 Wat wij met uw klacht doen** (`behandeling`)

Binnen vijf werkdagen na ontvangst krijgt u van ons een inhoudelijke reactie. Hebben wij meer tijd nodig, dan laten wij dat binnen die vijf werkdagen weten, met de reden en een nieuwe datum.

Die nieuwe datum ligt nooit later dan vier weken na ontvangst van uw klacht. Aan het eind krijgt u altijd schriftelijk wat wij hebben besloten en waarom.

**Artikel 5 Wie uw klacht behandelt** (`behandelaar`)

Jimmy of Lorenzo behandelt uw klacht. Gaat de klacht over een van hen, dan behandelt de ander hem.

**Artikel 6 Vertrouwelijk en zonder nadeel** (`vertrouwelijk`)

Wij behandelen uw klacht vertrouwelijk en delen hem alleen met wie nodig is voor een oplossing. Een klacht indienen heeft geen nadelige gevolgen voor uw werk of voor onze samenwerking.

Een klacht indienen kost u niets.

**Artikel 7 Hoe wij klachten vastleggen** (`vastleggen`)

Wij leggen elke klacht en de afhandeling vast in een klachtenregister. Wij bewaren die gegevens tot een jaar nadat de klacht is afgehandeld.

**Artikel 8 Als u het niet eens bent met onze reactie** (`niet-eens`)

Groos is niet aangesloten bij een geschillencommissie. Bent u het niet eens met onze reactie, dan kunt u naar de bevoegde rechter.

Voor sommige klachten kunt u ook terecht bij een andere instantie:

- over privacy bij de [Autoriteit Persoonsgegevens](https://autoriteitpersoonsgegevens.nl);
- over discriminatie bij het [College voor de Rechten van de Mens](https://www.mensenrechten.nl);
- over onderbetaling of onveilig werk bij de [Nederlandse Arbeidsinspectie](https://www.nlarbeidsinspectie.nl).

**Artikel 9 Wijzigingen** (`wijzigingen`)

Wij passen deze regeling aan als onze werkwijze of de wet verandert. Bovenaan staan het versienummer en de datum van de huidige versie.

### 6.7 Algemene voorwaarden (sjabloon, tekst van de klant)

De page houdt `CONTENT` met `title` "Algemene voorwaarden" / "Terms and conditions", `metaDescription` "TODO beschrijving zodra de voorwaarden er zijn", `intro` "TODO Inleiding door Jimmy of de jurist." en `sections: []`. Bovenaan staat `// TODO (Jimmy): tekst van de voorwaarden aanleveren (B-11); daarna LEGAL_DOCS terms op published true.` De huidige 13 generieke koppen verdwijnen, omdat ze niet bij uitzenden passen.

Ter informatie voor Jimmy en de jurist (niet als paginatekst): uitzendvoorwaarden voor opdrachtgevers behandelen gewoonlijk definities, toepasselijkheid, totstandkoming, terbeschikkingstelling en duur, tarieven en facturering (met g-rekening en btw-verlegging waar die gelden), arbeidsvoorwaarden en gelijkwaardige beloning (art. 8 en 12a Waadi), arbeidsomstandigheden (art. 7:658 BW), aansprakelijkheid, overname van een uitzendkracht (art. 9a Waadi), Wtta-toelating, geheimhouding en privacy, klachten en toepasselijk recht. NBBU-modelvoorwaarden zijn een mogelijke basis als het lidmaatschap rond is (B-11). Zolang de voorwaarden niet online staan, stuurt Groos ze mee met elke offerte (art. 6:234 BW).

### 6.8 Regels voor vacatureteksten en beroepspagina's

Deze regels gelden voor vacatures in de database (Jimmy en Lorenzo via `/beheer`, spec 08), voor de seed-vacatures van spec 10, voor de beroepspagina's en `content/pages/*` van spec 05 en voor de homepage van spec 04. Ze komen uit context/09 §6 en §8.

| Id | Regel | Goed | Vermijden | Borging |
|---|---|---|---|---|
| VR-01 | Discriminatievrij werven: functietitel genderneutraal, geen eisen over leeftijd, geslacht, afkomst, nationaliteit, geloof, burgerlijke staat, gezondheid of uiterlijk. | glazenwasser, schoonmaker | "dame voor schoonmaak", "sterke man gezocht", "jong team" | check:claims (VR-01); beoordeling bij publicatie |
| VR-02 | Leeftijd alleen als minimumleeftijd 18 met arbo-reden in de tekst (B-32, gelijk aan het enum `min_age_reason`): werken op hoogte, bouw en sloop, heftruck of reachtruck, nachtwerk, gevaarlijke stoffen. | "Vanwege het werken op hoogte is de minimumleeftijd 18 jaar." | "max. 30 jaar", "starter", "student", "jonge" | Spec 08: veld minimumleeftijd alleen met verplichte reden; check:claims |
| VR-03 | Taal functioneel omschrijven. | "Je spreekt genoeg Nederlands of Engels om veiligheidsinstructies te volgen." | "native speaker", "moedertaal Nederlands" | check:claims |
| VR-04 | Fysieke eisen objectief beschrijven. | "Je tilt regelmatig en staat of loopt het grootste deel van de dag." | "fit en gezond", "sterk" | check:claims |
| VR-05 | Rijbewijs of eigen vervoer alleen als het werk het vraagt. | "Je rijdt de verhuisbus naar het adres; daarvoor heb je rijbewijs B nodig." | "eigen auto vereist" zonder reden | beoordeling |
| VR-06 | Werkrecht in plaats van nationaliteit. | "Je mag in Nederland werken." | "alleen EU-paspoort" | Spec 07: vraag "Mag je in Nederland werken?" |
| VR-07 | Salaris altijd vermelden als bruto uurloon (minimum en maximum, B-06), vakantiegeld en toeslagen apart; minimaal het wettelijk minimumuurloon (`MINIMUM_WAGE_21_PLUS` uit `lib/data/options.ts`, spec 10, B-42). | "€ 15,50 tot € 17,00 bruto per uur, plus 8 procent vakantiegeld" | "all-in", "contant", "netto per uur", geen salaris | Spec 08: velden verplicht; waarschuwing onder `MINIMUM_WAGE_21_PLUS`; check:claims |
| VR-08 | Contracttype eerlijk: uitzenden is uitzenden; geen belofte van een vaste baan of vast contract tenzij die er is; geen nulurenbeloftes voor werk dat na 1 januari 2028 doorloopt. | "Je werkt via Groos op uitzendbasis." | "vaste baan", "nulurencontract" | Spec 08: dienstverband als keuzeveld; check:claims |
| VR-09 | Geen cao, keurmerk of brancheorganisatie noemen zolang die niet geldt (B-24). Toegestaan is gelijkwaardige beloning. | "Je krijgt minimaal hetzelfde loon als collega's in een vergelijkbare functie bij de opdrachtgever." | "volgens de cao voor uitzendkrachten", "SNA-gecertificeerd" | CL-01 tot en met CL-03 |
| VR-10 | Geen kosten voor de werkzoekende of uitzendkracht (art. 9 Waadi); beschermingsmiddelen zijn kosteloos. | "Inschrijven en solliciteren is gratis." | "inschrijfgeld", "kosten voor werkkleding of cursus" | check:claims |
| VR-11 | Nooit online om BSN, kopie ID, geboortedatum, nationaliteit, pasfoto of gezondheid vragen; identificatie gebeurt bij de intake met het originele document. | "Bij het kennismakingsgesprek nemen wij je identiteitsbewijs door." | "stuur een kopie van je paspoort mee" | Spec 07 schema's; check:claims met VR-11a (verzoek om iets te sturen of in te vullen, niveau block) en VR-11b (elke vermelding, niveau review) |
| VR-12 | Opleidingen en certificaten alleen beloven als Groos ze echt regelt; "geen ervaring nodig" bij werken op hoogte alleen als Groos de training regelt. | "Heb je nog geen VCA, dan vertellen wij je hoe je dat haalt." (na bevestiging) | "wij betalen je VCA" zonder bevestiging | CL-11; spec 08: hint bij Ervaring en waarschuwing `noExperienceAtHeight`; seed 1001 met `nice_to_have` (spec 10) |
| VR-13 | Hulpkrachten bouw en sloop werken nooit met asbest; geen vacatures voor asbestsanering. | "Vind je materiaal dat op asbest lijkt, dan stop je en meld je het." | "asbestsanering", "asbest verwijderen" | check:claims |
| VR-14 | Werktijden eerlijk vermelden: vroeg, avond, nacht, weekend, ploegen. | "Je begint om 06.00 uur." | "flexibele tijden" als het om nachtwerk gaat | beoordeling |
| VR-15 | Opdrachtgever niet bij naam noemen zonder diens toestemming; huisvesting niet aanbieden in fase 1. | "een kantoorpand in Rijswijk" | naam van de opdrachtgever zonder akkoord | Spec 08: hint bij Introductie en Extra informatie; een intern veld voor de opdrachtgever volgt in fase 2 |

Verzoeken van opdrachtgevers die mensen uitsluiten op grond van afkomst, leeftijd, geslacht of geloof wijst Groos af. Spec 05 mag dat op `/werkgevers` als zin opnemen: "Wij beoordelen iedere kandidaat op wat het werk vraagt. Verzoeken die mensen uitsluiten op grond van afkomst, leeftijd, geslacht of geloof wijzen wij af."

### 6.9 Claims-checklist (R-12)

Gebruik bij elke tekstronde (messages, `content/`, juridische pages, e-mails van spec 11, seed-vacatures). Werkwijze:

1. Draai `npm run check -- --warn` (TODO's) en `npm run check:claims` (claims en vacatureregels).
2. Loop elke treffer langs de tabel hieronder en kies: laten staan (de claim is bevestigd en vastgelegd), herschrijven naar de toegestane vorm, of markeren met `TODO`.
3. Een bevestiging van Jimmy of Lorenzo legt Djulan vast in `docs/compliance/claims-status.md` (datum, wie, bron) en, als het een besluit is, in de beslissingslog van spec 00.
4. Vacatures in de database loopt Djulan na bij de eerste vijf echte vacatures; daarna houden Jimmy en Lorenzo zich aan §6.8.

| Id | Onderwerp | Nu toegestaan | Niet toegestaan tot bevestiging | Bevestigt | Borging |
|---|---|---|---|---|---|
| CL-01 | Keurmerken (SNA, NEN 4400-1, VCU) | niets | elk keurmerk, logo of "gecertificeerd" | Jimmy en Lorenzo, met registerlink | check:claims (CL-01) |
| CL-02 | Brancheorganisatie (ABU, NBBU) | niets | "lid van", "aangesloten bij" | Jimmy en Lorenzo | check:claims (CL-02) |
| CL-03 | Cao | gelijkwaardige beloning (art. 8 Waadi, B-24) | "volgens de cao", cao-namen als toepasselijk | Jimmy, Lorenzo, jurist | check:claims (CL-03) |
| CL-04 | Wtta-status, toelating, registernummer | alleen via `WttaStatus` en `/werkgevers/wtta` | elke andere vermelding | Jimmy en Lorenzo (`WTTA` in `lib/legal.ts`) | `WttaStatus` (§4.6); check:claims (CL-04) |
| CL-05 | Reactietermijn | klachtenregeling: vijf werkdagen (B-10) | "binnen één werkdag", "binnen 24 uur", "direct antwoord" | Jimmy en Lorenzo | check:claims (CL-05); vlag `responseTime` (alleen reactietermijn, B-49) |
| CL-06 | Bereikbaarheid | kantoortijden zodra bevestigd (B-22) | "24/7", "dag en nacht", "altijd bereikbaar" | Jimmy en Lorenzo | check:claims (CL-06) |
| CL-07 | Cijfers | vijf beroepen, twee vaste contactpersonen, Den Haag (B-26) | aantallen kandidaten, plaatsingen, opdrachtgevers, jaren ervaring | Jimmy en Lorenzo | check:claims (CL-07) |
| CL-08 | Klantnamen, logo's, citaten, reviews | niets | elke naam of quote zonder schriftelijke toestemming | Jimmy en Lorenzo | beoordeling |
| CL-09 | Snelheid van levering | niets | "vandaag nog personeel", "binnen een dag iemand" | Jimmy en Lorenzo | check:claims (CL-09); vlag `deliverySpeed` in `lib/claims.ts` (B-49) |
| CL-10 | Uitbetaling | niets | "wekelijks uitbetaald" | Jimmy en Lorenzo | check:claims (CL-10) |
| CL-11 | Opleidingen die Groos regelt of betaalt | niets | "wij regelen je VCA", "gratis heftruckcursus" | Jimmy en Lorenzo | check:claims (CL-11) |
| CL-12 | Gratis inschrijven en solliciteren | altijd (art. 9 Waadi) | n.v.t. | n.v.t. | n.v.t. |
| CL-13 | "Geen ervaring nodig" | per vacature als het klopt | bij werken op hoogte zonder geregelde training | Jimmy of Lorenzo per vacature | Spec 08: hint en waarschuwing `noExperienceAtHeight` |
| CL-14 | Werkgebied | Den Haag en omgeving | "heel Nederland", "landelijk" | Jimmy en Lorenzo | check:claims (CL-14) |
| CL-15 | Relatie met J. Versseput | niets (B-26) | elke vermelding | Jimmy | check:claims (CL-15, niveau block) |
| CL-16 | Superlatieven | niets | "de beste", "nummer 1", "goedkoopste" | n.v.t. | check:claims (CL-16) |
| CL-17 | Gelijke behandeling | de zin uit §6.8 | n.v.t. | n.v.t. | n.v.t. |
| CL-18 | Dienstvormen | uitzenden | detacheren, werving en selectie, payrolling | Jimmy en Lorenzo | check:claims (CL-18) |
| CL-19 | Huisvesting en vervoer | niets | "huisvesting geregeld", "vervoer van en naar het werk" | Jimmy en Lorenzo | check:claims (CL-19) |
| CL-20 | Talen die Groos spreekt | Nederlands, Engels | andere talen | Jimmy en Lorenzo | beoordeling |
| CL-21 | Kantoor en bezoek | "bezoek op afspraak" (B-23) | "loop gerust binnen" | Jimmy | beoordeling |
| CL-22 | G-rekening, verzekeringen, VOG | niets | "wij hebben een g-rekening", "volledig verzekerd" | Jimmy en Lorenzo | check:claims (CL-22) |

## 7 SEO

Alle metadata via `pageMetadata()` uit `lib/seo.ts` (spec 12), dus met canonical, hreflang (nl, en, x-default), Open Graph en Twitter. `pageMetadata()` zet het merkachtervoegsel met `brandedTitle()` (spec 12, B-44).

| Route | Titel nl | Titel en | Index |
|---|---|---|---|
| `/privacyverklaring` | Privacyverklaring | Privacy statement | index, follow |
| `/cookieverklaring` | Cookieverklaring | Cookie statement | index, follow |
| `/klachtenregeling` | Klachtenregeling | Complaints procedure | index, follow |
| `/algemene-voorwaarden` | Algemene voorwaarden | Terms and conditions | `noindex, follow` zolang `published` onwaar is, daarna index, follow |

- Beschrijvingen staan in §6.4 tot en met §6.6 (u-vorm, B-04); Engelse beschrijvingen zijn vertalingen.
- Sitemap (spec 12, `app/sitemap.ts`): de paden uit `publishedLegalDocs()`, per taal één entry met alternates, `changeFrequency: "yearly"`, prioriteit 0.3, `lastModified` uit `updatedAt`. `/privacybeleid` en `/algemene-voorwaarden` (zolang ongepubliceerd) staan er niet in.
- `llms.txt` (spec 12) mag de gepubliceerde juridische documenten uit `publishedLegalDocs()` noemen onder de kop Optional (spec 12 §4.9).
- Geen eigen JSON-LD op deze pagina's behalve de `BreadcrumbList` die `Breadcrumbs` levert (§4.2); de layout levert `Organization` en `WebSite`.
- Ankers (`#solliciteren`, `#bewaartermijnen` en dergelijke) zijn stabiel en gelijk in beide talen, zodat e-mails van spec 11 en formulieren van spec 07 ernaar kunnen linken.

## 8 Toegankelijkheid en performance

- Eén `h1` per pagina, `h2` per artikel, geen `h3` (B-05). Artikelen zijn `<article>` met een `id`.
- De inhoudsopgave is een `<nav>` met eigen `aria-label` en een `<ol>`; het actieve artikel krijgt `aria-current="location"`. Onder `lg` zit hij in een `<details>`, zodat hij met toetsenbord en schermlezer werkt zonder JavaScript.
- Tabellen hebben een zichtbare `<caption>`, `<th scope="col">` en een scrollbare wrapper met `role="region"`, `aria-label` en `tabIndex={0}`.
- Linkteksten zijn beschrijvend ("privacyverklaring", niet "klik hier"). Externe links openen in hetzelfde tabblad.
- Contrast minimaal 4,5:1 voor alle tekst, ook voor de versieregel (niet meer `text-muted-foreground/70`) en de informatieregel bij formulieren.
- Lopende tekst op de basismaat van spec 02 (17 px, B-28), niet kleiner op mobiel; regellengte via `prose-groos` (spec 02).
- `scroll-mt-28` op artikelen zodat koppen niet onder de vaste header verdwijnen; soepel scrollen alleen bij `prefers-reduced-motion: no-preference`.
- Alle juridische pagina's zijn statisch (geen data-fetch, geen cookies of headers gelezen) en worden per taal vooraf gegenereerd via de `generateStaticParams` van de layout.
- `LegalToc` is de enige client component op deze pagina's en blijft klein (geen dependencies, alleen `IntersectionObserver`).
- Geen afbeeldingen. Geen inhoud, scripts of fonts van derden in de browser; fonts komen via `next/font` uit de eigen build (spec 02).
- Doel: axe zonder fouten en Lighthouse toegankelijkheid 100 op `/privacyverklaring` bij 390 en 1280 px.

## 9 21st.dev-opdracht voor sub-agents

Alleen voor de opmaak van de juridische pagina's; de inhoud ligt vast. De bouw-agent spawnt één sub-agent, **legal-layout**, tijdens blok A van §10. De sub-agent laadt de tools met `ToolSearch` en de query `select:mcp__magic__search,mcp__magic__get_inspiration`.

**Plekken en zoekopdrachten**

| Plek | `mcp__magic__search` (type `component`) | `mcp__magic__get_inspiration` |
|---|---|---|
| Inhoudsopgave desktop (sticky, actief artikel) | "table of contents sticky sidebar", "on this page navigation scroll spy", "toc active heading border", "document outline sidebar minimal" | "minimal legal document page with sticky table of contents and numbered articles on white" |
| Inhoudsopgave mobiel (inklapbaar) | "collapsible table of contents mobile", "disclosure details summary minimal", "collapsible section accessible" | "mobile article contents disclosure minimal" |
| Tabelblok (cookies, bewaartermijnen) | "simple table caption", "minimal data table borders", "shadcn table" | "readable simple table for legal text" |

**Startkandidaten (gevonden op 2 oktober 2026)**

| Plek | Id | Naam | Preview |
|---|---|---|---|
| Inhoudsopgave desktop | 18113 | Table of Contents (mohammadshehadeh) | https://cdn.21st.dev/hirael/toc/default/preview.1784488118775-d628fbab-89b8-465c-9b1e-fe98616e5e2c.png, pagina https://21st.dev/@mohammadshehadeh/components/toc |
| Inhoudsopgave desktop | 34516 | Table of Contents (appica-dev) | https://cdn.21st.dev/user_registry_appica-dev_1790790016927/toc/default/preview.1790808454423.webp, pagina https://21st.dev/@appica-dev/components/toc |
| Inhoudsopgave desktop | 18123 | Table of Contents (inference-sh) | https://cdn.21st.dev/inference-sh/table-of-contents/default/preview.1784718030348-03461537-ce39-4fc3-bf13-9623dd5e947b.png, pagina https://21st.dev/@inference-sh/components/table-of-contents |
| Inhoudsopgave mobiel | 19705 | Collapsible (cnippet-dev, Base UI) | https://cdn.21st.dev/user_36Tbt0v8JdD4jEycmBFhR8tojnR/cnippet-collapsible/card/preview.1787334244774.png, pagina https://21st.dev/@cnippet-dev/components/cnippet-collapsible |
| Inhoudsopgave mobiel | 31385 | Collapsible (wensity) | https://cdn.21st.dev/wensity/collapsible/default/preview.1790298260182-1d15cf9e-9eb7-4a33-85ca-07be6b28fb83.png, pagina https://21st.dev/@wensity/components/collapsible |
| Tabelblok | 87 | Table (originui) | https://cdn.21st.dev/user_originui/table/striped-table/preview.png?v=1, pagina https://21st.dev/@originui/components/table |
| Tabelblok | 22165 | Striped Table (felipemenezes098) | https://cdn.21st.dev/felipemenezes098/table-04/default/preview.1785127716683-a3d4b9be-653c-4cb2-ab4a-d2c557bca23b.png, pagina https://21st.dev/@felipemenezes098/components/table-04 |

Bewust afgewezen: 24952 "Privacy Policy Collapsible Card" en andere accordeons voor de tekst zelf (juridische tekst moet volledig zichtbaar en doorzoekbaar zijn), 22596, 33300 en 31745 (te speels voor een juridische pagina), 14029 en 25011 (nieuwe dependencies), 5740 (modal met verplicht doorscrollen past niet bij B-08).

**Selectiecriteria**

- Minimaal, witte achtergrond, blauw alleen als accent via tokens van spec 02 (`text-brand`, `border-brand`), geen schaduwen of gloed.
- Past bij de boodschap van deze plek: rustig, betrouwbaar, makkelijk te scannen; de tekst staat centraal.
- shadcn-compatibel, Tailwind, TypeScript, geen nieuwe dependencies. Een kandidaat die een andere Base UI-package importeert dan `@base-ui-components/react` 1.0.0-rc.0 valt af.
- Toegankelijk: echte links in een `<nav>`, werkt zonder JavaScript, `aria-current`, toetsenbord, `prefers-reduced-motion`.
- Klein: geen animatiebibliotheek nodig, geen eigen scrollcontainer.

**Oplevering van de sub-agent**

Per plek 2 tot 4 kandidaten met id, naam en preview-URL, plus een gemotiveerde keuze in drie zinnen. Daarna `get_component` alleen voor de gekozen kandidaat van de desktop-inhoudsopgave, en alleen als die echt beter is dan de eigen opzet uit §4.3. Voor mobiel en tabel is de standaard de eigen opzet (`<details>` en `LegalTable`); 21st.dev dient daar als inspiratie.

**Aanpassingsregels**

- Kleuren alleen via tokens van spec 02; geen hex, hsl of Tailwind-kleurnamen.
- Props en bestandsnamen uit §4.3 blijven gelijk (`LegalToc` met `items`, `ariaLabel`, `variant`); de `id`'s van de artikelen blijven ongewijzigd.
- Alle tekst via messages (`legal.toc.*`) of `CONTENT`; niets hardcoded.
- Server component tenzij interactie nodig is; alleen `LegalToc` is client.
- Beweging alleen kleur en een rustige markering; niets bij `prefers-reduced-motion: reduce`.

Geeft 21st.dev niets bruikbaars, dan bouwt de bouw-agent §4.3 op de eigen primitives (`CtaButton`, native `<details>`, gewone `<table>`).

## 10 Bouwopdracht

> **Notitie.** Blok A wordt sinds vóór kruiscontrole ronde 2 gebouwd. Ontbreken na de merge `lib/legal.ts`, `FooterLegal`, `copy-rules.json` of `check-claims.mjs`, dan bouwt de agent van bouwstap 3b ze; de wijzigingen uit ronde 2 voert een nazorg-sub-agent in 3b uit (00 §6).

Deze module bouwt in twee blokken. Blok A gebeurt tijdens bouwstap 3 van 00 §6 (routes en registers), omdat spec 07 in bouwstap 6 `PRIVACY_NOTICE_VERSION` en de ankers nodig heeft. Blok B is bouwstap 8.

**Blok A (tijdens bouwstap 3)**

1. Lees spec 00 (§3.2 en §4), deze spec, `CLAUDE.md`, `docs/specs/bijlagen/repo-inventaris.md` §1, §2 en §7 en `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md` (sectie robots).
2. Maak `lib/legal.ts` volgens §5.1.
3. Start de sub-agent legal-layout uit §9 en werk ondertussen door op de eigen opzet.
4. Herschrijf `components/legal/legal-page.tsx` volgens §4.2 en maak `legal-toc.tsx`, `legal-text.tsx` en `legal-table.tsx` volgens §4.3. Controleer in `app/[locale]/layout.tsx` of header, footer en `<main>` daar al staan en pas `LegalPage` daarop aan.
5. Maak `app/[locale]/privacyverklaring/page.tsx`, `cookieverklaring/page.tsx` en `klachtenregeling/page.tsx` met de Nederlandse tekst uit §6.4 tot en met §6.6, letterlijk, met `id`'s per artikel en de TODO-commentaren. Schrijf het `en`-blok volgens §6.3.
6. Herschrijf `app/[locale]/algemene-voorwaarden/page.tsx` volgens §4.4 en §6.7. Verwijder `app/[locale]/privacybeleid/` als spec 01 dat nog niet deed.
7. Werk `messages/nl/legal.json` en `messages/en/legal.json` bij volgens §6.1 (namespace `legal`, `legal.updatedAt` weg, B-45).
8. Maak `components/legal/footer-legal.tsx` en `wtta-status.tsx` volgens §4.5 en §4.6. Plaats `<FooterLegal />` in de onderste balk van `SiteFooter` in overleg met de bouw-agent van spec 01, en haal daar `legalLinks` weg.
9. Maak `lib/analytics-privacy.ts` en `components/legal/privacy-analytics.tsx` volgens §4.7 en vervang `<Analytics />` in `app/[locale]/layout.tsx` door `<PrivacyAnalytics />`.
10. Maak `lib/compliance/copy-rules.json` met deze vorm:

    ```json
    {
      "scan": ["messages", "content", "app", "components", "emails", "lib", "supabase/seed.sql"],
      "ignore": ["lib/compliance/copy-rules.json", "app/beheer", "components/beheer"],
      "rules": [
        { "id": "CL-01", "level": "review", "pattern": "keurmerk|\\bSNA\\b|NEN ?4400|\\bVCU\\b|gecertificeerd", "flags": "i", "note": "Keurmerk alleen met bevestiging en registerlink." },
        { "id": "CL-02", "level": "review", "pattern": "\\b(ABU|NBBU)\\b|lid van|aangesloten bij", "flags": "i", "note": "Brancheorganisatie alleen met bevestiging." },
        { "id": "CL-03", "level": "review", "pattern": "\\bcao\\b", "flags": "i", "note": "Geen cao als toepasselijk noemen; gelijkwaardige beloning mag wel (B-24)." },
        { "id": "CL-04", "level": "review", "pattern": "toelating|toegelaten|registernummer|overgangsregeling", "flags": "i", "note": "Wtta-status alleen via WttaStatus en /werkgevers/wtta." },
        { "id": "VR-02", "level": "review", "pattern": "\\bjonge?\\b|\\bstarters?\\b(?!\\??\\s*:)|\\bstudent(en)?\\b|max(imaal)?\\.? ?\\d{2} jaar", "flags": "i", "note": "Leeftijd alleen als minimumleeftijd 18 met arbo-reden (B-32)." }
      ],
      "allow": [
        { "rule": "VR-11a", "files": ["app/[locale]/privacyverklaring/page.tsx"] },
        { "rule": "VR-11b", "files": ["app/[locale]/privacyverklaring/page.tsx"] },
        { "rule": "CL-04", "files": ["lib/legal.ts", "components/legal/wtta-status.tsx", "content/pages/wtta.ts", "messages/nl/legal.json", "messages/en/legal.json"] },
        { "rule": "VR-13", "files": ["content/beroepen/hulpkracht-bouw-en-sloop.ts", "supabase/seed.sql"] },
        { "rule": "CL-22", "files": ["content/pages/wtta.ts"] },
        { "rule": "CL-03", "files": ["content/beroepen/glazenwasser.ts", "content/beroepen/schoonmaker.ts", "content/beroepen/logistiek-medewerker.ts", "content/beroepen/verhuizer.ts", "content/beroepen/hulpkracht-bouw-en-sloop.ts"] },
        { "rule": "VR-11b", "files": ["content/pages/werkzoekenden.ts"] }
      ]
    }
    ```

    CL-01 tot en met CL-04 en VR-02 staan hierboven volledig, alle met `"flags": "i"`. Het patroon van VR-02 slaat het typeveld `starter` in `content/beroepen` over (`starter:` en `starter?:`), zodat alleen tekst over starters meetelt. Neem daarnaast regels op voor CL-05 (`binnen (één|1|een) werkdag|binnen \d+ uur|direct antwoord`), CL-06 (`24/7|dag en nacht|altijd bereikbaar`), CL-07 (`\d+\+? (kandidaten|opdrachtgevers|plaatsingen|jaar ervaring)`), CL-09 (`vandaag nog`), CL-10 (`wekelijks uitbetaald`), CL-11 (`gratis (VCA|heftruck|cursus)`), CL-14 (`heel Nederland|landelijk`), CL-15 (`Versseput`, niveau `block`), CL-16 (`\bbeste\b|nummer 1|goedkoopste|grootste`), CL-18 (`detacher|werving en selectie|payroll`), CL-19 (`huisvesting|woonruimte`), CL-22 (`g-rekening|volledig verzekerd`), VR-01 en VR-04 (`\bdame\b|sterke? man|fit en gezond`), VR-03 (`native|moedertaal`), VR-07 (`all-in|contant|netto per uur`), VR-08 (`nuluren|0-uren|vaste baan|vast contract`), VR-10 (`inschrijfgeld|kosten voor (kleding|werkkleding|cursus)`), VR-11a (`(stuur|upload|mail|voeg|vul).{0,40}(\bBSN\b|burgerservicenummer|kopie (van je )?(ID|identiteitsbewijs|paspoort)|geboortedatum|nationaliteit|pasfoto)`, niveau `block`), VR-11b (`\bBSN\b|burgerservicenummer|kopie (van je )?(ID|identiteitsbewijs|paspoort)|geboortedatum|nationaliteit|pasfoto`, niveau `review`) en VR-13 (`asbest`). Een regel mag meer dan één allow-regel hebben (zoals VR-11b); het script voegt de bestanden dan samen. Een allow-regel geldt alleen voor de genoemde bestanden; dezelfde treffer elders blijft een treffer.
11. Maak `scripts/check-claims.mjs`: leest de JSON, scant de paden (bestanden `.ts`, `.tsx`, `.json`, `.sql`), slaat `ignore` en `allow` over, en drukt per regel-id de treffers af als `bestand:regel  fragment` met de `note`. Zonder vlag is de exitcode 0; met `--strict` is de exitcode 1 als er een treffer is met `level: "block"`. Voeg `"check:claims": "node scripts/check-claims.mjs"` toe aan `package.json`.
12. Geef de bouw-agent van spec 07 de teksten uit §6.2 en de eisen uit §4.8 door (spec 07 zet ze in `forms.privacy.*`).
13. Verifieer: `npm run verify`, `npm run check -- --warn` (alleen verwachte TODO's), `curl -s localhost:3000/privacyverklaring | grep -c '<h2'` geeft 17 of meer, en `curl -s localhost:3000/algemene-voorwaarden | grep -o '<meta name="robots"[^>]*>'` toont `noindex`.

**Blok B (bouwstap 8, na spec 06, 07 en 11)**

1. Draai `npm run check:claims` en verwerk elke treffer volgens §6.9. Wat niet zelf op te lossen is, wordt `TODO` met een verwijzing naar de CL- of VR-id.
2. Waarneming cookies en opslag op `http://localhost:3000` met de Playwright MCP: open `/`, `/vacatures`, een vacature, `/inschrijven`, `/contact` en `/privacyverklaring`; lees na het laden `document.cookie`, `Object.keys(localStorage)` en `Object.keys(sessionStorage)` uit en controleer met `curl -sI` op `Set-Cookie`. Wissel daarna van taal en herhaal. Log in op `/beheer` met het testaccount en noteer naam en `Max-Age` of `Expires` van de Supabase-cookies. Vul de tabel van §6.5 artikel 2 in en verwijder de TODO als alles bekend is. Analytics en BotID draaien niet in ontwikkeling; noteer in `docs/compliance/procedures.md` dat deze waarneming herhaald wordt op de eerste preview-deploy (spec 13) en pas de tekst dan zo nodig aan.
3. Waarneming netwerk: met `browser_network_requests` op dezelfde pagina's controleren dat er geen verzoeken naar andere domeinen gaan dan het eigen domein, Supabase (alleen bij een cv-upload) en `/_vercel/*`.
4. Formulieren: dien met fictieve gegevens (`delivered@resend.dev`) een sollicitatie met en zonder talentpoolvinkje in, een inschrijving, een aanvraag en een contactbericht. Controleer in `groos-dev` de kolommen uit §5.2 en controleer de formulieren tegen §4.8.
5. Leg de termijnen van §5.3 naast de constanten van spec 10 en noteer de vergelijking in het bouwverslag. Een verschil wordt opgelost in overleg met de bouw-agent van spec 10, niet stil in een van beide.
6. Maak `docs/compliance/verwerkingsregister.md` (§5.4), `verwerkersovereenkomsten.md` (§5.5 met kolom Status), `procedures.md` (§5.6, §5.6a, §5.7, §5.8 en de herhaalde cookiewaarneming; de procedure van §5.6a staat daarin onder het kopje `## Authenticator kwijt`, tussen de kopjes `## Procedure voor verzoeken van betrokkenen` en `## Procedure bij een datalek`) en `claims-status.md` (§6.9 met kolommen Status, Datum, Wie, Bron).
7. Visueel met Playwright op 390, 768, 1280 en 1440 px: `/privacyverklaring`, `/en/privacyverklaring`, `/cookieverklaring`, `/klachtenregeling`, `/algemene-voorwaarden` en de footer van `/`. Scroll eerst door de pagina. Draai axe op `/privacyverklaring` bij 390 en 1280 px.
8. Draai `npm run verify`, `npm run check -- --warn` en `npm run check:claims`. Rapporteer aan Djulan de lijst van open TODO's die Jimmy, Lorenzo of de jurist moeten oplossen (§12).

## 11 Acceptatiecriteria

| Id | Criterium | Dekt |
|---|---|---|
| AC-09-01 | `GET /privacyverklaring` en `GET /en/privacyverklaring` geven 200 met één `h1` ("Privacyverklaring" en "Privacy statement") en 17 `h2`'s genummerd 1 tot en met 17; elementen met `id` `solliciteren`, `inschrijven`, `opdrachtgevers`, `berichten`, `website`, `bewaartermijnen` en `rechten` bestaan in beide talen, en een `nav[aria-label="Kruimelpad"]` met Home en de documenttitel. | E-09-01, E-09-02 |
| AC-09-02 | De tekst van `/privacyverklaring` noemt Supabase, Frankfurt, Vercel, BotID, Web Analytics, Resend, STRATO, het Data Privacy Framework of de standaardcontractbepalingen, de Autoriteit Persoonsgegevens, een termijn van een maand voor verzoeken en het e-mailadres uit `contact.email` als klikbare `mailto:`-link. | E-09-02 |
| AC-09-03 | De tabel onder `#bewaartermijnen` bevat de 11 rijen uit §6.4 artikel 12, en het bouwverslag bevat de vergelijking met de constanten van spec 10 zonder verschillen. | E-09-13 |
| AC-09-04 | `GET /cookieverklaring` geeft 200 met een tabel met caption "Cookies op deze website"; de waarneming uit blok B stap 2 vindt op publieke pagina's geen andere cookie dan `NEXT_LOCALE` (alleen na taalkeuze of geo-omleiding) en geen opslagsleutels van derden. | E-09-03 |
| AC-09-05 | Op `/`, `/vacatures`, een vacature, `/inschrijven` en `/contact` gaan geen netwerkverzoeken naar andere domeinen dan het eigen domein, Supabase en `/_vercel/*`; er staat geen `<iframe>` op de publieke site. | E-09-14 |
| AC-09-06 | `GET /klachtenregeling` geeft 200 met 9 `h2`'s die beginnen met "Artikel 1." tot en met "Artikel 9."; de tekst bevat "vijf werkdagen" en de naam van de behandelaars. | E-09-04 |
| AC-09-07 | Met `published: false` voor `terms`: `GET /algemene-voorwaarden` geeft 200 met `<meta name="robots" content="noindex, follow">`, `/sitemap.xml` bevat geen `algemene-voorwaarden` en geen enkele pagina linkt ernaar. | E-09-05 |
| AC-09-08 | Zet de bouw-agent tijdelijk `published: true`, dan verdwijnt de `noindex`, verschijnt de pagina in de sitemap en verschijnt de link in de footer; daarna zet hij de waarde terug. | E-09-05, E-09-07 |
| AC-09-09 | `/sitemap.xml` bevat `/privacyverklaring`, `/cookieverklaring` en `/klachtenregeling` in nl en en met `xhtml:link`-alternates, en geen `/privacybeleid`. | E-09-01, E-09-07 |
| AC-09-10 | De footer van `/`, `/vacatures`, `/werkgevers`, `/contact` en `/en` toont "Groos Personeelsdiensten B.V.", "Hugo Coenraadspad 6", "2553 ER Den Haag", "KvK" gevolgd door 8 cijfers, "Btw" gevolgd door een nummer van de vorm NL000000000B00, het e-mailadres `info@groospersoneelsdiensten.nl` en links naar `/privacyverklaring`, `/cookieverklaring` en `/klachtenregeling`. Zolang KvK of btw ontbreekt, faalt dit criterium en is de site niet klaar voor livegang. | E-09-08 |
| AC-09-11 | Met `WTTA = { phase: "preparing" }` toont de footer "Wij bereiden onze toelating onder de Wtta voor." met een link naar `/werkgevers/wtta`; met elk van de andere vier fasen toont de footer de tekst uit §6.1 en bij `none` geen Wtta-regel (handmatig getest, daarna teruggezet). | E-09-09 |
| AC-09-12 | `WTTA = { phase: "admitted" }` zonder `registerNumber` of `registerUrl` geeft een fout bij `npm run typecheck`. | E-09-09 |
| AC-09-13 | Op een vacaturepagina staat direct boven de verzendknop de tekst van `forms.privacy.applyNotice` met een link naar `/privacyverklaring#solliciteren`; het talentpoolvinkje is niet aangevinkt en het formulier verstuurt zonder vinkje. Op `/werkgevers/personeel-aanvragen` en `/contact` staat de u-variant zonder vinkje. | E-09-10 |
| AC-09-14 | Op `/inschrijven` is het toestemmingsvinkje niet aangevinkt; versturen zonder vinkje toont "Vink dit vakje aan om je in te schrijven." bij het vinkje en maakt geen record aan, ook met JavaScript uitgeschakeld. | E-09-10 |
| AC-09-15 | Een testsollicitatie met talentpoolvinkje levert in `applications` `privacy_notice_version = "0.1"`, `retention_consent = true`, een gevulde `retention_consent_at` en `retention_consent_source = 'form'`; zonder vinkje is `retention_consent` false en zijn de andere twee leeg. | E-09-11 |
| AC-09-16 | Geen enkel publiek formulier heeft een veld (naam, label of placeholder) voor BSN, identiteitsbewijs, geboortedatum, nationaliteit, foto of gezondheid; `npm run check:claims -- --strict` geeft exitcode 0. | E-09-12, E-09-16 |
| AC-09-17 | `node --input-type=module -e "import { analyticsBeforeSend } from './lib/analytics-privacy.ts'; console.log(analyticsBeforeSend({ type: 'pageview', url: 'https://x.nl/vacatures?q=jan&beroep=schoonmaker&ref=S-1' }).url, analyticsBeforeSend({ type: 'pageview', url: 'https://x.nl/beheer/sollicitaties' }))"` drukt `https://x.nl/vacatures?beroep=schoonmaker null` af. | E-09-15 |
| AC-09-18 | Elke aanroep van `track(` in de code (zoek met grep) gebruikt alleen de eigenschappen `form`, `beroep` en `vacature`; `app/[locale]/layout.tsx` rendert `PrivacyAnalytics` en niet meer `Analytics` direct. | E-09-15 |
| AC-09-19 | Op 1280 px staat de inhoudsopgave rechts en blijft zichtbaar bij scrollen; een klik op "12 Hoe lang wij gegevens bewaren" brengt de kop volledig in beeld onder de header en de link krijgt `aria-current="location"`. Op 390 px staat de inhoudsopgave ingeklapt boven de artikelen en is er geen horizontale scroll van de pagina. | E-09-06 |
| AC-09-20 | Elke juridische pagina toont "Versie 0.1, bijgewerkt op 2 oktober 2026." en de conceptmelding zolang `draft` waar is; met `draft: false` verdwijnt de melding. | E-09-06, E-09-07 |
| AC-09-21 | De `intro` van elke Engelse juridische pagina eindigt met de zin over voorrang van de Nederlandse tekst; `npm run check` meldt geen verschil in sleutels tussen `messages/nl/legal.json` en `messages/en/legal.json`. | E-09-23 |
| AC-09-22 | axe meldt geen overtredingen op `/privacyverklaring` en `/cookieverklaring` bij 390 en 1280 px; Lighthouse toegankelijkheid is 100 op `/privacyverklaring`. | E-09-06 |
| AC-09-23 | `npm run check:claims` draait, toont treffers gegroepeerd per CL- of VR-id met bestand en regelnummer en eindigt met exitcode 0. | E-09-17 |
| AC-09-24 | `docs/compliance/verwerkingsregister.md` bevat V-01 tot en met V-16, `verwerkersovereenkomsten.md` bevat alle verwerkers uit §5.5 met een kolom Status, en `procedures.md` en `claims-status.md` bestaan. | E-09-18, E-09-20, E-09-21 |
| AC-09-25 | Vóór de productie-livegang (bouwstap 10) staat in `docs/compliance/verwerkersovereenkomsten.md` bij Supabase, Vercel, Resend, STRATO en de ontwikkelaar de status "getekend" met datum. | E-09-19 |
| AC-09-26 | `grep -Eo '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+' supabase/seed.sql` toont alleen adressen op `example.com`, `example.nl` of `resend.dev`. | E-09-22 |
| AC-09-27 | `GET /privacybeleid` geeft 404. | E-09-01 |
| AC-09-28 | Zolang jurist, Jimmy en Lorenzo niet hebben bevestigd, noemt `npm run check` de TODO's in de vier juridische pages en in `lib/legal.ts`; na hun bevestiging en het verwijderen van de markeringen noemt hij daar niets meer. | E-09-24 |
| AC-09-29 | `npm run verify` slaagt na blok A en na blok B. | E-09-01 tot en met E-09-24 |
| AC-09-30 | Het verslag van legal-layout staat in `docs/21st-keuzes.md` onder "Spec 09" met 2 tot 4 kandidaten (id, naam, preview-URL) en een gemotiveerde keuze. | E-09-25 |

## 12 Open vragen en aannames

| Onderwerp | Aanname in deze spec | Bevestigt | Gevolg als het anders is |
|---|---|---|---|
| Juridische toets | De teksten in §6.4 tot en met §6.6 zijn concepten (versie 0.1) en gaan vóór de livegang langs een jurist. | jurist via Djulan | Wijzigingen alleen in `CONTENT` en `LEGAL_DOCS`; versie naar 1.0. |
| Afsluiten zonder contact | Volgt B-07: sollicitaties en inschrijvingen zonder contact (`last_contact_at` of `created_at`) worden na 12 weken afgesloten (`rejected` of `withdrawn`) en 28 dagen later geanonimiseerd met verwijdering van het cv; de herinnering na 8 weken is een dashboardfilter. | Jimmy, Lorenzo, jurist (via B-07) | Andere uitleg: de zin in artikel 3, artikel 4 en de rij in §5.3 aanpassen; spec 10 past zijn cron aan. |
| Afwijking van B-07 (aanvulling) | Nieuwe termijnen buiten de database: meldingsmails 4 weken, klachtdossier 1 jaar, verzoekenregister 2 jaar, datalekregister 5 jaar. | Jimmy, Lorenzo, jurist | Alleen §5.3, artikel 12 van de privacyverklaring en artikel 7 van de klachtenregeling. |
| Uitleg van B-07 voor inschrijvingen | 365 dagen na toestemming, of 28 dagen na afsluiten als dat eerder is (`application_retain_until` in spec 10); na 12 weken zonder contact automatisch afgesloten; de herinnering na 8 weken is intern (dashboard), geen mail aan de kandidaat in fase 1. Artikel 4 belooft daarom geen vraag aan de kandidaat na acht weken. | Jimmy, Lorenzo, jurist | Andere uitleg: artikel 4 en §5.3 aanpassen, spec 10 en 08 volgen. |
| Klachtenregeling termijnen | Inhoudelijke reactie binnen vijf werkdagen (B-10); uiterlijk vier weken voor de eindreactie is een aanvulling. | Jimmy en Lorenzo | Alleen artikel 4. |
| Geen geschillencommissie | Groos is niet aangesloten bij een geschillencommissie of brancheorganisatie. | Jimmy en Lorenzo | Bij NBBU-lidmaatschap artikel 8 aanpassen en CL-02 bijwerken. |
| Wtta-fase | Startwaarde `preparing`; alleen zichtbaar als Jimmy en Lorenzo bevestigen dat zij de toelating voorbereiden; anders `none`. | Jimmy en Lorenzo | Alleen `WTTA` in `lib/legal.ts`. |
| KvK- en btw-nummer | Nog onbekend; de livegang wacht erop (art. 3:15d BW, AC-09-10). | Jimmy | Alleen `lib/site.ts`. |
| Privacycontactadres | `info@groospersoneelsdiensten.nl` (B-02) met onderwerp "Privacy"; geen apart `privacy@`. | Jimmy | Alias toevoegen in STRATO en `contact` of een eigen veld in `lib/site.ts`. |
| Functionaris gegevensbescherming en DPIA | Niet verplicht voor Groos bij deze schaal. | jurist | Artikel 1 aanpassen; DPIA toevoegen aan `docs/compliance/`. |
| Ontwikkelaar als verwerker | De verwerkersovereenkomst loopt via Sinka B.V. (handelsnaam SKUU), gelijk aan spec 13 §5.8; Djulan bevestigt de juridische naam (00 §7 punt 6). | Djulan | Alleen §5.5 en artikel 10. |
| Salarisadministratie en boekhouder | Nog niet gekozen; staan als TODO in artikel 5 en 10. | Jimmy en Lorenzo | Naam invullen en DPA toevoegen. |
| WhatsApp | Jimmy en Lorenzo gebruiken WhatsApp voor contact met kandidaten; de rol van Meta en de keuze voor WhatsApp Business beoordeelt de jurist. | jurist | Artikel 7 en V-06 aanpassen. |
| Geen AI in selectie | Groos gebruikt geen AI-tools om sollicitaties te selecteren of te beoordelen (context/09 §7). | Jimmy en Lorenzo | Artikel 14 herschrijven met transparantie-informatie en menselijke beoordeling. |
| Cv naar opdrachtgever | Een cv gaat pas naar een opdrachtgever na overleg met de werkzoekende. | Jimmy en Lorenzo | Artikel 10 aanpassen. |
| Minderjarigen | Groos accepteert inschrijvingen vanaf 16 jaar, onder 16 alleen met toestemming van ouder of voogd. | Jimmy en Lorenzo | Artikel 4 aanpassen; eventueel een minimumleeftijd in `/inschrijven` (spec 07). |
| BotID en cookies | BotID Basic plaatst geen cookies; wordt waargenomen op de eerste preview-deploy. | Djulan | Rij in de cookietabel en zin in artikel 4 van de cookieverklaring. |
| Supabase-sessiecookie | Naam `sb-<project-ref>-auth-token` (met varianten `.0`, `.1` en `-code-verifier`); duur wordt waargenomen. | bouw-agent | Alleen de cookietabel. |
| Resend en EU-regio | Verzending vanuit eu-west-1 volgens B-20; of dat op het gratis plan kan is niet zeker (context/11). | Djulan | Bij een andere regio artikel 8 en 11 aanpassen. |
| Supabase DPA via Vercel Marketplace | De DPA van Supabase geldt ook voor een project dat via de Marketplace is aangemaakt. | Djulan, bij Supabase navragen | Een getekende DPA apart aanvragen. |
| Vercel-logs | Termijn van Vercel-logs is nog niet vastgesteld (V-10). | Djulan | Termijn invullen in §5.4. |
| Opslag van de registers | De spreadsheet met verzoeken, datalekken en klachten staat in een eigen opslag van Groos die nog gekozen moet worden. | Jimmy | Alleen §5.8 en `procedures.md`. |
| Sleutels in `forms` | Spec 07 neemt de sleutels `forms.privacy.*` uit §6.2 over. | bouw-agent spec 07 | Bij andere paden blijft de tekst gelijk; AC-09-13 en 14 toetsen de tekst. |
| Footer-sleutels | `FooterLegal` gebruikt `legal.nav.*` en `legal.footer.*`; `footer.privacy` en `footer.terms` (spec 03) vervallen. | Djulan | Als spec 03 ze houdt, gebruikt `FooterLegal` ze niet. |
| Chrome in `LegalPage` | De layout van spec 01 bepaalt of `LegalPage` zelf header, footer en `<main>` rendert; de bouw-agent kijkt in de layout. | bouw-agent | Geen gevolg voor andere specs. |
| Inzage van cv's gelogd | Spec 08 en 10 schrijven bij elke weergave van een cv een regel in `audit_log` (actie `application.cv_viewed`), zoals artikel 13 van de privacyverklaring belooft. | bouw-agent spec 08 en 10 | Zonder logging vervalt de zin "Wij leggen vast wanneer een cv is bekeken." |
| Rate limiting | WAF-regels van spec 13 §5.6 (formulieren-per-ip, upload-per-ip, beheer-inloggen) zijn actief op productie; artikel 9 noemt ze. | Djulan (spec 13, B-12) | Zonder deze regels vervallen de alinea over rate limiting in artikel 9 en de vermelding bij V-10. |
| Publicatiestatus juridische documenten | Besloten: `lib/legal.ts` is de enige bron (B-40). | Djulan | Geen; alleen de import in `lib/routes.ts`. |
| Custom events in Web Analytics | Conversie-events vragen een Vercel Pro-abonnement; dat is er (context/11 §1.6). | Jimmy | Zonder Pro geen events, wel paginabezoek; tekst blijft juist. |
| Authenticator kwijt | In fase 1 herstelt Djulan de toegang handmatig volgens §5.6a (factor verwijderen, sessies intrekken, regel `admin.mfa_reset` in `audit_log`); herstelcodes of passkeys en de actie `resetAdminMfa` in het beheer volgen in fase 2 (spec 15). | Djulan | Met herstelcodes in fase 1: spec 08 krijgt een herstelscherm en §5.6a vervalt of wordt een uitzondering. |
| Afwijking bouwstap 3b: aanspreekvorm in artikel 2 | De tweede alinea van artikel 2 van de privacyverklaring luidt "De artikelen voor werkzoekenden zijn informeel geschreven. In de andere artikelen spreken wij u aan met u." in plaats van de zin uit §6.4. De zin uit §6.4 bevat je en u in één waarde en faalt daardoor op regel C-09 van `check:copy` (spec 03 §6.19). Het Engelse blok zegt dat de Nederlandse tekst werkzoekenden informeel aanspreekt en gebruikt zelf overal "you" (§6.3). | Djulan (copyregels), jurist bij de toets | Nieuwe zin zonder je en u samen; `check:copy` moet foutloos blijven. |
| Afwijking bouwstap 3b: tekstlinks Wtta | `legal.wtta.infoLink` is "Wat de Wtta voor inleners betekent" ("What the Wtta means for hirers") en `legal.wtta.registerLink` is "Bekijk onze registratie in het register" ("View our registration in the register"). De teksten in §6.1 hebben zeven woorden; regel C-14 van `check:copy` staat voor een tekstlink hoogstens zes woorden toe (commit 5f2d3a7, integratie). | Djulan | Langere tekst alleen met een uitzondering op C-14 in spec 03. |
| Afwijking bouwstap 3b: links in artikel 3 en 4 | De verwijzing naar het artikel "Als je via ons gaat werken" (artikel 3) is een ankerlink naar `#werken-via-groos`, en "de pagina Inschrijven" (artikel 4) linkt naar `/inschrijven`. De tekst zelf is gelijk aan §6.4. | Djulan | Geen; alleen de linknotatie in `CONTENT`. |
| Afwijking bouwstap 3b: claimregels | In `lib/compliance/copy-rules.json` is VR-03 `\bnative[ -]speakers?\b\|\bnative (Dutch\|English)\b\|moedertaal` en CL-18 `detacher\|werving en selectie\|payrolling\|payrollbedrijf\|payroll services`. De patronen uit §10 blok A stap 10 (`native`, `payroll`) gaven ruim 70 valse treffers op `alternatives`, `NativeSelect` en "payroll taxes" in de Engelse Wtta-teksten. Daarnaast twee allow-regels voor wettelijke zinnen: CL-05 voor de privacyverklaring ("binnen 72 uur" bij de AP) en CL-02 voor de klachtenregeling ("niet aangesloten bij een geschillencommissie"). `tests/unit/scripts/check-claims.test.ts` bewaakt de voorbeelden uit §6.8. | Djulan | Terug naar de brede patronen als de valse treffers acceptabel zijn. |
