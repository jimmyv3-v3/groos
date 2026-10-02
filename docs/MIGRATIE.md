# Migratie: van J. Versseput naar Groos Personeelsdiensten

Naslagdocument. Het beschrijft wat er uit de J. Versseput-site (JV) is
overgenomen, wat daarbij is verbeterd, hoe alle pagina's zijn opgebouwd en hoe
de nieuwe identiteit wordt aangebracht.

JV-repo (lokaal, alleen lezen): `/Users/djulangem/Developer/J.versseput B.V.`
Live: https://www.jversseput.nl (GitHub `jimmyv3-v3/website`, Vercel in
Jimmy's account).

---

## 1. Uitgangspunt

- **Structuur en methode: hergebruiken.** Paginatypes, sectievolgorde,
  componenten, i18n, SEO-laag, formulierafhandeling, werkafspraken en
  deployment-aanpak komen uit JV.
- **Identiteit en tekst: nieuw.** Kleuren, typografie, logo, beeld en copy
  worden voor Groos gemaakt. In deze repo staat daarom een neutrale grijze basis
  met `TODO`-teksten.
- **Groos heeft meer nodig dan JV.** Twee doelgroepen (werkgevers en
  werkzoekenden), vacatures en een beheeromgeving. Zie §7 en
  [BOUWINSTRUCTIE.md](BOUWINSTRUCTIE.md).

## 2. Wat één-op-één is overgenomen

| Onderdeel | Bestanden |
|---|---|
| App Router-opzet met `[locale]` | `app/[locale]/…` |
| Tweetaligheid NL/EN (NL zonder prefix, EN onder `/en`) | `i18n/*`, `messages/*` |
| Taalkeuze via IP-land + cookie + taalknop | `proxy.ts`, `components/ui/language-toggle.tsx` |
| Header: logo, uitklapmenu diensten, ankerlinks, telefoon, WhatsApp, taalknop, CTA; mobiel menu op volledig scherm; vaste actiebalk onderin op mobiel | `components/sections/site-header.tsx` |
| Alle homepage-secties in dezelfde volgorde | `components/sections/*`, `app/[locale]/page.tsx` |
| Dienstpagina-template (hero, inbegrepen, urgentie, CTA-band, waarom wij, FAQ, formulier) | `app/[locale]/diensten/[slug]/page.tsx`, `components/service/*` |
| Werkgebied-overzicht en stadspagina's met unieke lokale content | `app/[locale]/werkgebied/**`, `components/werkgebied/city-page.tsx` |
| Juridische pagina's als gestructureerde data | `components/legal/legal-page.tsx`, `app/[locale]/privacybeleid`, `algemene-voorwaarden` |
| Formulier via Web3Forms met validatie, AVG-vinkje en foutafhandeling | `components/sections/offerte-form.tsx` |
| Motion-systeem (reveal, stagger, count-up) met reduced-motion | `components/motion/*` |
| shadcn-config, Tailwind met CSS-variabelen, `cn()` | `components.json`, `tailwind.config.ts`, `lib/utils.ts` |
| Next-config (Turbopack-root, AVIF/WebP, lucide-optimalisatie, redirects-blok) | `next.config.mjs` |
| Vercel Analytics | `app/[locale]/layout.tsx` |
| Werkafspraken en schrijfregels | `CLAUDE.md` |

## 3. Wat is verbeterd ten opzichte van JV

| Verbetering | Waarom |
|---|---|
| **OG-afbeelding en favicon werken** (matcher in `proxy.ts` sluit `opengraph-image`, `twitter-image`, `icon`, `apple-icon` uit) | In JV geven `/opengraph-image`, `/twitter-image` en `/icon` een 404: de taal-proxy stuurt ze door naar een niet-bestaand pad. |
| **`og:image` op elke pagina** via `pageMetadata()` | In JV ontbreekt `og:image` overal, omdat het `openGraph`-object van de layout dat van de bestandsconventie vervangt. Gedeelde links tonen daardoor geen afbeelding. |
| **hreflang op elke pagina**, niet alleen op home | In JV vervangt `alternates: { canonical }` op subpagina's de taalalternates. |
| **Geen geo-redirect voor crawlers** | In JV krijgt Googlebot (crawlt vanuit de VS) op elke Nederlandse URL een redirect naar `/en`. Dat is een indexeringsrisico voor de NL-pagina's. |
| **Dienstpagina's datagedreven** (één template + `content/services/<slug>.ts`) | JV had acht bijna identieke page-bestanden van ±350 regels. |
| **Sitemap en llms.txt automatisch uit de registers** | In JV was de sitemap een handmatige lijst; `llms.txt` bestond niet. |
| **`SITE_URL` op één plek** (`lib/site.ts`) | In JV stond hij in vijf bestanden. |
| **JSON-LD via builders**, ook FAQPage en Breadcrumb op dienstpagina's | Consistent en compleet; `<` wordt ge-escaped. |
| **Footer en menu tonen vertaalde dienstnamen** | In JV stonden op `/en` Nederlandse dienstnamen in footer en menu. |
| **Geen dode verwijzingen** | JV verwijst naar `/og.jpg` en `/projects/gallery-2.jpg`, die niet bestaan. |
| **`npm run lint` werkt** (ESLint flat config) | Next 16 heeft `next lint` geschrapt; in JV faalde lint daardoor (niet door de spatie in de mapnaam). |
| **`proxy.ts` in plaats van `middleware.ts`** | Next 16-conventie; `middleware.ts` is deprecated. |
| **Eentalig mogelijk met één regel** (`locales: ["nl"]`) | Taalknop, geo-redirect en hreflang verdwijnen dan vanzelf. |
| **Livegang-check** (`npm run check`) | Vindt placeholders, ontbrekende vertalingen en registraties. |
| **Honeypot in het formulier**, vertaalde foutmeldingen | Minder spam; in JV stond één foutmelding hardcoded in het Nederlands. |
| **React 19, Next 16.3, Node 24 vastgezet** | Actuele, ondersteunde combinatie. |

## 4. Wat bewust níet is overgenomen

JV-identiteit: het "Satin Charcoal"-thema (alleen donker), titanium-glans op
accentwoorden, de liquid-metal-knop (WebGL via `@paper-design/shaders`) en de
metal-knop, het Outfit-lettertype, ambient-gloed en raster over de hele pagina,
het JV-logo, alle foto's en klantlogo's, alle copy, de algemene voorwaarden en
de contextbestanden. Ook dode code is weggelaten (`cta.tsx`,
`capabilities.tsx`, `text-marquee.tsx`, ongebruikte exports in `lib/site.ts`)
en de ongebruikte dependency `next-themes`.

## 5. Blauwdruk: pagina's en de plek van elk element

### 5.1 Homepage (`app/[locale]/page.tsx`)

| # | Sectie (component) | Anker | Inhoud en positie | Data |
|---|---|---|---|---|
| 0 | `SiteHeader` | | Vast bovenaan, transparant tot scrollen. Links logo, midden "Diensten" (uitklapmenu met icoon, titel, samenvatting) + ankerlinks, rechts telefoon, WhatsApp-icoon, taalknop, CTA. Mobiel: hamburger → volledig scherm; vaste balk onderin met "Bel ons" en "Offerte". | `lib/site.ts` (`nav`, `contact`), `content/services`, messages `header`, `common` |
| 1 | `Hero` | `#top` | Twee kolommen. Links H1 met accentwoord, intro, twee CTA's (primair aanvragen, secundair bellen), strip met vier kernwaarden. Rechts (desktop) de doelgroepen-accordion. | messages `home.hero`, `home.values` |
| 2 | `Clients` | | Logoband (marquee) direct onder de hero. | `lib/site.ts` `clients` |
| 3 | `SegmentAccordion` (alleen mobiel) | | Doelgroepen als gestapelde fotokaarten onder de logo's. | `lib/site.ts` `segments`, messages `home.segments` |
| 4 | `Metrics` | | Band met drie optellende cijfers. | `lib/site.ts` `metrics`, messages `home.metricLabels` |
| 5 | `TrustBar` | | Vier USP's met icoon in vier kolommen. | `lib/site.ts` `usps`, messages `home.trustBar` |
| 6 | `ServiceTicker` | | Grote zin "<naam> voor al uw ___" met rollend woord, link naar diensten. | messages `home.ticker` |
| 7 | `Services` | `#diensten` | Kop + raster van dienstkaarten (2 kolommen mobiel, 4 desktop) met spotlight. | `content/services`, messages `services`, `home.servicesSection` |
| 8 | `Process` | `#werkwijze` | Vier genummerde stappen. | `lib/site.ts` `steps`, messages `home.process` |
| 9 | `Projects` | `#projecten` | Raster van fototegels zonder tekst. | `lib/site.ts` `projectPhotos` |
| 10 | `Proof` | | Eén grote quote met beeldmerk, naam en rol. | messages `home.proof` |
| 11 | `Assurance` | `#kwaliteit` | Links uitgelicht keurmerk, rechts kop + vier beloftes. | `lib/site.ts` `assurances`, `certification` |
| 12 | `About` | `#over-ons` | Verhaal in twee alinea's + vestigingsplaats; groot beeldmerk als watermerk. | messages `home.about` |
| 13 | `Faq` | | Uitklapvragen; ook als FAQPage-JSON-LD. | messages `home.faq` |
| 14 | `OfferteForm` | `#contact` | Links kop, intro, kanalen, twee voordelen. Rechts formulierkaart. | messages `home.contactForm` |
| 15 | `SiteFooter` | | Links logo, omschrijving, reactiebelofte, socials. Rechts kolommen Diensten, Werkgebied, Contact (NAW, KvK, btw). Onder: copyright + juridische links. | `lib/site.ts`, registers |

### 5.2 Detailpagina (dienst) — `app/[locale]/diensten/[slug]`

Header → `ServiceHero` (kruimelpad, H1, lead, twee CTA's, optioneel beeld) →
"Wat wij doen" (kop links, vinklijst rechts) → optioneel extra blok →
"Uitstel kost" (drie kaarten met icoon) → `ServiceCta` (band met twee CTA's) →
optioneel `ServiceSteps` → `ServiceFeatureGrid` ("Waarom kiezen voor", vier
items) → `ServiceFaq` → formulier (`#offerte`) → footer.
JSON-LD: Service, BreadcrumbList, FAQPage.

### 5.3 Stadspagina — `app/[locale]/werkgebied/[stad]`

`ServiceHero` met foto → lokale intro (twee alinea's) → "Onze diensten in
<stad>" (kaarten naar de dienstpagina's) → "Waarom <naam> in <stad>" (vier
items) → FAQ → CTA-band → formulier. JSON-LD: LocalBusiness met `areaServed`,
BreadcrumbList, FAQPage.

### 5.4 Werkgebied-overzicht, juridisch

Overzicht: kruimelpad, H1 met accent, intro, raster van stadskaarten, blok
"Staat uw plaats er niet bij?" met CTA. Juridisch: kopband (H1, intro, datum),
genummerde artikelen, contactblok met CTA.

## 6. De nieuwe identiteit aanbrengen (re-skin)

Volgorde, zodat de hele site in één keer meegaat:

1. **Richting kiezen.** context/12 stelt drie richtingen voor en beveelt
   richting A "Signaal" aan (geel en inkt). Laat de klant kiezen.
2. **Tokens zetten** in `app/globals.css`. context/12 §6.1 levert de
   shadcn-tokens. Zet daarnaast de drie merk-tokens die de componenten
   gebruiken: `--brand-subtle` (rustig accent), `--brand` (iconen, randen,
   focus) en `--brand-strong` (nadruk en hover-tekst). Let op contrast: een
   signaalkleur als geel hoort niet op `--brand-strong` als tekst op wit.
   Extra tokens uit context/12 (zoals `--ink`, `--success`, `--warning`) ook in
   `tailwind.config.ts` koppelen voordat je ze gebruikt.
3. **`lib/brand.ts`** gelijktrekken (hex-waarden voor OG-afbeelding, favicon,
   themakleur) en de initialen of het beeldmerk.
4. **Lettertypes** in `app/[locale]/layout.tsx` (`--font-sans` en een tweede
   `next/font` voor `--font-display`).
5. **Signature-elementen** opnieuw ontwerpen: `.accent-text`, `.glass-panel`,
   `.logo-mono`, `.bg-grid`, `.spotlight` in `globals.css`, de merk-CTA in
   `components/ui/cta-button.tsx` en het logo in `components/brand/*`.
6. **Per sectie verfijnen** met 21st.dev (hieronder), van boven naar beneden.
7. **OG-afbeelding en iconen**: `app/opengraph-image.tsx` opmaken; zodra het
   logo er is `app/icon.png` en `app/apple-icon.png` toevoegen en de `.tsx`-
   versies verwijderen.
8. **Controleren** op 390/768/1280/1440 px en in donker als die variant wordt
   gebruikt.

### 21st.dev Magic MCP gebruiken

De MCP-server `magic` (`@21st-dev/magic`) is op gebruikersniveau ingesteld en
dus ook in deze repo beschikbaar.

| Doel | Tool | Tip |
|---|---|---|
| Thema-inspiratie | `search` met `type: "theme"`, eventueel `color` | Gratis; levert metadata. |
| Thema-CSS ophalen | `get_theme` met het id | Gratis; levert `:root`/`.dark`-tokens. Neem over in `globals.css` en vul de `--brand-*`-tokens aan. |
| Ideeën per sectie | `get_inspiration` of `search` met `type: "component"` | Bijvoorbeeld "job listing card with filters", "hero two audiences", "pricing-free lead form". |
| Componentcode | `get_component` met het demo-id | Kost een retrieval per dag; kies gericht. |
| Logo's van klanten of platforms | `search_logo` | Gratis (svgl). |
| Gebruiker laten kiezen | `search_picker` | Toont een keuzelijst in de chat. |

Regels bij het overnemen van een 21st.dev-component: kleuren alleen via tokens,
props en sectie-ID's van de bestaande component behouden, tekst via messages,
`"use client"` alleen als het nodig is, reduced-motion respecteren, geen
dependencies erbij zonder reden.

## 7. Wat dit betekent voor Groos

Het volledige sitemap-voorstel staat in context/08 §7; de backend in context/11.
De JV-bouwstenen passen er zo op:

| Groos-route (voorstel) | JV-bouwsteen in deze repo | Wat er nog bij moet |
|---|---|---|
| `/` (beide doelgroepen) | Homepage-blauwdruk §5.1 | Hero met twee routes (werkgevers en werkzoekenden), recente vacatures, CTA's "Personeel aanvragen" en "Bekijk vacatures". |
| `/werkgevers`, `/personeel/[beroep]` | Dienstpagina-template §5.2 | Diensten worden beroepen vanuit werkgeverszicht; register `content/services` hernoemen of dupliceren. |
| `/werkzoekenden`, `/werken-als/[beroep]` | Dienstpagina-template §5.2 | Tweede register voor het werkzoekendenperspectief; je-vorm of u-vorm besluiten. |
| `/werkgevers/personeel-aanvragen` | `OfferteForm` | Velden voor beroep, aantal, periode, locatie; opslag in Supabase volgens context/11. |
| `/vacatures`, `/vacatures/[slug]` | Kaarten, FAQ, CTA-band, hero | Nieuw: overzicht met filters, detail met sollicitatie, JobPosting-JSON-LD, data uit Supabase. |
| `/open-sollicitatie` | Formulieropbouw | Nieuw: cv-upload (Supabase Storage), AVG-bewaartermijn. |
| `/uitzendbureau/[stad]` (fase 2) | Stadspagina §5.3 | Route hernoemen van `werkgebied`; alleen steden waar Groos echt werkt. |
| `/over-ons`, `/contact` | `About`, `OfferteForm` | Eigen pagina's i.p.v. ankers. |
| `/privacyverklaring`, `/algemene-voorwaarden` | `LegalPage` | Privacytekst uitbreiden voor sollicitanten en cv's (context/09). |
| `/beheer` | Nieuw | Eigen beheeromgeving volgens context/11; buiten de taal-proxy en `noindex`. |

Let bij het hernoemen van routes op: `app/sitemap.ts` (`STATIC_PATHS`),
`app/llms.txt/route.ts`, `lib/site.ts` (`nav`), de footer-kolommen en de
interne links in `components/*`.

## 8. Optionele modules en hoe je ze verwijdert

| Module | Verwijderen |
|---|---|
| Engels | `locales: ["nl"]` in `i18n/routing.ts`; `messages/en.json` en de `en`-blokken mogen blijven of weg. |
| Werkgebied | `app/[locale]/werkgebied`, `components/werkgebied`, `content/werkgebied`; footerkolom en de regels in sitemap en llms.txt. |
| Doelgroepen-accordion | `<SegmentAccordion />` uit hero en homepage; `segments` uit `lib/site.ts`. |
| Logoband, cijfers, ticker, projecten, keurmerk | De sectie uit `app/[locale]/page.tsx` halen; data uit `lib/site.ts` en messages opruimen. |

`npm run check` meldt daarna messages-sleutels die nergens meer bij horen.

## 9. Bestandsmapping JV → deze repo

| JV | Hier |
|---|---|
| `middleware.ts` | `proxy.ts` |
| `app/[locale]/diensten/<8 mappen>/page.tsx` (elk met `CONTENT`) | `app/[locale]/diensten/[slug]/page.tsx` + `content/services/<slug>.ts` |
| `lib/werkgebied.ts` + `lib/werkgebied.en.ts` | `content/werkgebied/<slug>.ts` (NL en EN per stad) |
| `lib/site.ts` (data én Nederlandse tekst) | `lib/site.ts` (alleen data), tekst in messages |
| `components/ui/liquid-metal-button.tsx`, `metal-button.tsx` | `components/ui/cta-button.tsx` (zelfde props) |
| `titanium-dim/-mid/-bright`, `.text-titanium` | `brand-subtle`/`brand`/`brand-strong`, `.accent-text` |
| `app/icon.png` + `app/icon.tsx` (dubbel) | alleen `app/icon.tsx` en `app/apple-icon.tsx` tot er een logo is |
| messages `home.assurance.vca*` | `home.assurance.cert*` |
| messages `home.contactForm.clientOptions` | `clientTypes` (lijst) + `clientTypePlaceholder` |
| messages `footer.allOfNetherlands` | `footer.allAreas` |
| messages `werkgebied.city.features.vca` | `werkgebied.city.features.quality` |
| — | `meta.ogHeadline`, `meta.ogSubline`, `app/llms.txt`, `scripts/check-launch.mjs`, `lib/seo.ts`, `lib/brand.ts` |

## 10. Bekende problemen in de live JV-site

Gevonden tijdens deze analyse; in deze repo al opgelost (zie §3). De moeite
waard om ook in JV te herstellen:

1. OG-afbeelding, Twitter-afbeelding en `/icon` geven 404; `og:image`
   ontbreekt op alle pagina's.
2. Googlebot krijgt op Nederlandse URL's een redirect naar `/en`. Controleer in
   Search Console (rapport Pagina's) of de NL-pagina's geïndexeerd zijn.
3. `/projects/gallery-2.jpg` (Amsterdam-pagina) en `/og.jpg` (JSON-LD) bestaan
   niet.
4. `npm run lint` faalt omdat `next lint` niet meer bestaat.
5. Op `/en` staan Nederlandse dienstnamen in footer en menu; `contact.region`
   is Nederlandstalig in de Engelse over-ons-tekst.
6. De GitHub-repo `jimmyv3-v3/website` is publiek.
7. De lokale `.vercel`-koppeling wijst naar het verouderde project
   `skuu/jversseput` (laatste deploy juni). De live site deployt via GitHub
   naar Jimmy's Vercel-account; `vercel --prod` vanuit die map gaat dus naar het
   verkeerde project.
