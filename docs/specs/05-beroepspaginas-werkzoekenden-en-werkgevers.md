# 05 Beroepspagina's, werkzoekenden, werkgevers en Wtta

| Status | Fase | Hangt af van | Bronnen |
|---|---|---|---|
| concept | 1 | 01 (routes, registers, `Breadcrumbs`, `paths`), 03 (toon, sleutels, claims, `check:copy`); gebruikt 02 (tokens, `CtaButton`, `components/motion/*`), 06 (`VacancyCard`), 09 (`WttaStatus`, VR- en CL-regels), 10 (`lib/data/*`), 12 (builders in `lib/seo.ts`) | context/01 (hoofdbron per beroep), context/02, context/08 §4.3 en §6.8 tot en met §6.10, context/09 §1, §3, §4, §6, §8 en §9, context/10 §1, §2 en §6, context/13 §5, §7 en §10, `bijlagen/samenvattingen/context-{01,09,10,13,research}.md`, `bijlagen/repo-inventaris.md` §2 en §5 |

## 1 Doel

Deze module levert de dertien pagina's waar de twee doelgroepen van Groos hun eigen route vinden: de overzichtspagina's `/werkzoekenden` en `/werkgevers`, vijf beroepspagina's voor werkzoekenden onder `/werken-als/[beroep]`, vijf beroepspagina's voor opdrachtgevers onder `/werkgevers/[beroep]` en de kennispagina `/werkgevers/wtta`, steeds in het Nederlands en het Engels. Ze legt het template vast (de bestaande bouwstenen uit `components/service/` met een werkzoekende- en een werkgeversvariant, aangevuld met nieuwe componenten in `components/beroep/`), de typen en de inhoud van `content/beroepen/<id>.ts` en `content/pages/{werkzoekenden,werkgevers,wtta}.ts`, de messages-namespaces `werkzoekenden`, `werkgevers` en `beroepen`, de regels die voorkomen dat tien vergelijkbare pagina's als doorway pages worden gezien, en per beroep een contentbrief waarmee een sub-agent beide perspectieven schrijft. Het resultaat is dat een werkzoekende in B1-taal leest wat het werk is, wat het ongeveer betaalt en hoe hij solliciteert, dat een opdrachtgever in de u-vorm leest wat Groos levert zonder één onbevestigde belofte, en dat elke pagina zelfstandig rankt op haar eigen zoekintentie.

## 2 Gebruikers en scenario's

**Werkzoekende**

- S-05-01 Een Haagse werkzoekende zoekt op zijn telefoon "schoonmaakwerk avond den haag" en landt op `/werken-als/schoonmaker`. Hij ziet bovenaan in twee zinnen wat het werk is, een indicatie van het bruto uurloon met bron en peildatum, en de knoppen "Bekijk vacatures" en "App ons".
- S-05-02 Een werkzoekende zonder heftruckcertificaat leest op `/werken-als/logistiek-medewerker` welke certificaten vaak gevraagd worden, wat ze inhouden en hoe je ze haalt. Hij ziet nergens een belofte dat Groos de cursus betaalt, omdat die claim nog niet bevestigd is.
- S-05-03 Op `/werken-als/verhuizer` staan op dit moment geen vacatures. De werkzoekende ziet een rustige lege staat met "Schrijf je in" en een WhatsApp-link met de vooringevulde tekst "Hallo Groos, ik zoek werk als verhuizer."
- S-05-04 Een werkzoekende opent `/werkzoekenden`, leest hoe solliciteren werkt en wat zijn rechten als uitzendkracht zijn, kiest het beroep glazenwasser in het beroepenraster en komt op `/werken-als/glazenwasser`.
- S-05-05 Een Engelstalige werkzoekende opent `/en/werken-als/hulpkracht-bouw-en-sloop` en leest dezelfde opbouw in eenvoudig Engels, met de uitleg dat VCA een veiligheidsdiploma is.

**Opdrachtgever**

- S-05-06 De planner van een verhuisbedrijf zoekt "personeel voor verhuisbedrijf den haag" en landt op `/werkgevers/verhuizers`. De h1 noemt zijn verhuisbedrijf, niet de particuliere verhuizing, en de pagina eindigt met de vraagkop "Extra verhuizers nodig rond de maandwisseling?" en de knop "Personeel aanvragen".
- S-05-07 Een facilitair manager leest op `/werkgevers` wat uitzenden inhoudt, wie de werkgever is en hoe hij betaalt, en volgt de link naar `/werkgevers/wtta`.
- S-05-08 Een inkoper van een bouwbedrijf opent in november 2026 `/werkgevers/wtta`. Hij ziet een tijdlijn met vijf gedateerde mijlpalen, leest wat hij als inlener vanaf 1 januari 2028 moet regelen, en ziet onder "De status van Groos" de eerlijke fasezin uit `WttaStatus`.
- S-05-09 Een opdrachtgever die per ongeluk op `/werken-als/glazenwasser` belandt, ziet onderaan een korte verwijzing naar `/werkgevers/glazenwassers`. Omgekeerd verwijst elke werkgeverspagina naar de werkzoekendenkant.

**Beheerder**

- S-05-10 Lorenzo publiceert een vacature voor een orderpicker. Binnen een uur, en direct na de revalidatie door spec 08, staat de vacature op `/werken-als/logistiek-medewerker` en op `/werkzoekenden`, zonder nieuwe build.
- S-05-11 Jimmy bevestigt via Djulan dat Groos de VCA-cursus regelt. Djulan zet `certificateSupport` in `lib/claims.ts` op `true`, en de bijbehorende FAQ-antwoorden en kaarten verschijnen op alle beroepspagina's tegelijk.

**Bouwteam**

- S-05-12 Vijf sub-agents schrijven tegelijk elk één beroep in beide perspectieven met de contentbrief uit §6.6. De kwaliteitstest uit §10 stap 12 meldt daarna per pagina het aantal woorden, het aandeel unieke tekst en de verhouding specifieke FAQ's.

## 3 Scope

**Wel in deze module**

- De routes `/werkzoekenden`, `/werken-als/[beroep]` (5), `/werkgevers`, `/werkgevers/[beroep]` (5) en `/werkgevers/wtta`, elk in nl en en (26 URL's).
- Het paginatemplate: de bestaande bouwstenen `ServiceHero`, `ServiceFeatureGrid`, `ServiceSteps`, `ServiceFaq` en `ServiceCta`, aangepast en in `components/service/` gehouden, plus nieuwe componenten in `components/beroep/`.
- Typen en inhoud van `content/beroepen/<id>.ts`, de loader `content/beroepen/pages.ts`, `content/beroepen/icons.ts`, de typen en inhoud van `content/pages/{werkzoekenden,werkgevers,wtta}.ts` en de loader `content/pages/loaders.ts`.
- De messages-namespaces `werkzoekenden`, `werkgevers` en `beroepen` in nl en en.
- Metadata, FAQPage, Service en BreadcrumbList op deze pagina's met de builders uit `lib/seo.ts`.
- De kwaliteitsregels tegen doorway pages en de test die ze controleert.
- De contentbrieven per beroep en per vaste pagina, en de bouwopdracht met één sub-agent per beroep.

**Niet in deze module**

- Header, footer, kruimelpad, routes en registers (spec 01), tokens en primitives (spec 02), schrijfregels en de sleutels van `common` (spec 03), de homepage en het beroepenblok daar (spec 04), vacaturekaarten en vacaturepagina's (spec 06), formulieren (spec 07), `WttaStatus` en de juridische regels (spec 09), datamodel en leesfuncties (spec 10), de implementatie van de JSON-LD-builders, sitemap en `llms.txt` (spec 12).
- Een eigen formulier op de beroepspagina's. Werkzoekenden gaan naar een vacature of naar `/inschrijven`, opdrachtgevers naar `/werkgevers/personeel-aanvragen` (spec 07).

**Fase 2**

Beroepspagina's in Pools, Bulgaars, Turks en Roemeens, regiopagina's per beroep (`/regio/[plaats]`, spec 15), een tariefindicatieformulier, een vergelijkingstabel van dienstvormen zodra `serviceForms` bevestigd is, en foto's van echte mensen en werkplekken (B-25).

**Eisen**

| Id | Eis | Dient |
|---|---|---|
| E-05-01 | De 26 URL's van §4.1 bestaan met de sectievolgorde van §4, in nl en en, als server components. | R-01, R-13 |
| E-05-02 | Werkzoekendenpagina's gebruiken je-vorm en B1, werkgeverspagina's en `/werkgevers/wtta` u-vorm (B-04); geen urgentie- of angstcopy richting werkzoekenden. | R-01, R-07 |
| E-05-03 | Het template hergebruikt `ServiceHero`, `ServiceFeatureGrid`, `ServiceSteps`, `ServiceFaq` en `ServiceCta` uit `components/service/` met de props van §4.3; nieuwe bouwstenen staan in `components/beroep/` (§4.4). | R-05, R-19 |
| E-05-04 | Lange tekst staat in `content/beroepen/<id>.ts` en `content/pages/*.ts` met een `nl`- en een `en`-blok van het type uit §5; alleen server-side geladen. | R-13, R-19 |
| E-05-05 | Messages `werkzoekenden`, `werkgevers` en `beroepen` bevatten exact de sleutelboom van §6.2 en §6.3, gespiegeld in nl en en. | R-13, R-19 |
| E-05-06 | Elke werkzoekendenpagina per beroep toont een indicatie van het bruto uurloon met bron, peildatum en de vermelding dat het geen loonbelofte is (§4.2.3). | R-12, R-14 |
| E-05-07 | Eisen in de copy zijn objectief en noodzakelijk; een minimumleeftijd van 18 jaar staat er alleen met de arbo-reden (B-32, VR-01 tot en met VR-05). | R-12 |
| E-05-08 | Elke werkzoekendenpagina per beroep toont live vacatures van dat beroep uit de database, of een lege staat met een route naar `/inschrijven` en WhatsApp (§4.4.5). | R-02, R-14 |
| E-05-09 | Elke pagina voldoet aan de doorway-regels van §6.7: lengte, aandeel unieke tekst, eigen h1, eigen CTA-kop, eigen waarom-kop, minstens de helft beroepsspecifieke FAQ's. | R-09, R-07 |
| E-05-10 | Werkgeverspagina's per beroep trekken geen consumentenintentie aan: h1 en titel noemen het bedrijf of het personeel, niet de dienst aan particulieren (§6.6). | R-09, R-01 |
| E-05-11 | Claims volgen spec 03 §6.11 en de claims-checklist van spec 09: onbevestigde items dragen een `claim`-veld en worden gefilterd met `withConfirmedClaims`; geen keurmerk, cao-lidmaatschap, reactietermijn of 24/7. | R-12 |
| E-05-12 | `/werkgevers/wtta` geeft gedateerde feiten uit context/09 met bron en peildatum, en toont de status van Groos alleen via `WttaStatus` (B-24, CL-04). | R-12, R-09 |
| E-05-13 | Metadata via `pageMetadata()`, JSON-LD via `breadcrumbLd` (door `Breadcrumbs`), `faqLd` en `serviceLd` uit `lib/seo.ts`; de FAQPage bevat precies de zichtbare vragen (§7). | R-09 |
| E-05-14 | Elke beroepspagina linkt naar het andere perspectief van hetzelfde beroep en naar de bijbehorende overzichtspagina. | R-01, R-09 |
| E-05-15 | De bouw-agent zet per UI-plek een 21st.dev-sub-agent in volgens §9 en per beroep één schrijf-sub-agent volgens §10. | R-16, R-07 |
| E-05-16 | Lighthouse mobiel op `/werken-als/schoonmaker` haalt 90 of hoger in alle vier categorieën; de pagina's voegen geen eigen clientcomponent toe. | R-15 |
| E-05-17 | Alles werkt op localhost tegen `groos-dev`; vacaturedata komen via `lib/data/*` met de caching van B-35. | R-17, R-02 |

## 4 Pagina's en componenten

### 4.1 Routes en renderconfiguratie

De bestanden bestaan na bouwstap 3 als skelet van spec 01. Deze module vervangt de inhoud en laat de routeconfiguratie staan.

| Route | Bestand | Rendering | `revalidate` | Doelgroep en vorm | Kruimelpad na Home |
|---|---|---|---|---|---|
| `/werkzoekenden` | `app/[locale]/werkzoekenden/page.tsx` | ISR (toont de nieuwste vacatures) | `3600` | werkzoekende, je | Werkzoekenden |
| `/werken-als/[beroep]` | `app/[locale]/werken-als/[beroep]/page.tsx` | ISR, `generateStaticParams` uit `beroepen` met `slugWerkzoekende`, `dynamicParams = false` | `3600` | werkzoekende, je | Werkzoekenden, {enkelvoud} |
| `/werkgevers` | `app/[locale]/werkgevers/page.tsx` | statisch | `false` | werkgever, u | Werkgevers |
| `/werkgevers/[beroep]` | `app/[locale]/werkgevers/[beroep]/page.tsx` | statisch, `generateStaticParams` met `slugWerkgever`, `dynamicParams = false` | `false` | werkgever, u | Werkgevers, {meervoud} |
| `/werkgevers/wtta` | `app/[locale]/werkgevers/wtta/page.tsx` | statisch | `false` | werkgever, u | Werkgevers, Inlenen en de Wtta |

Vaste regels voor elke pagina van deze module:

1. `const locale = resolveLocale(raw)` uit `@/i18n/locale`, daarna `setRequestLocale(locale)` vóór de eerste next-intl-aanroep.
2. Op beroepspagina's: `const item = findBeroepBySlug("werkzoekende" | "werkgever", beroep)`; bij `undefined` direct `notFound()`, vóór elke `await` op data en vóór elke `<Suspense>`.
3. De pagina geeft een fragment van secties terug; geen `<main>`, `<header>` of `<footer>` (spec 01 §4.22).
4. Tekst komt uit `getTranslations` (korte tekst) en uit de loaders van §5.3 (lange tekst). Geen zichtbare string in JSX.
5. Interne links via `Link` uit `@/i18n/navigation` of `CtaButton` met een pad dat met `/` begint; paden via `ROUTES` en `paths` uit `lib/routes.ts`.
6. Items met een `claim`-veld gaan door `withConfirmedClaims()` uit `lib/claims.ts` voordat ze gerenderd of in JSON-LD gezet worden.
7. Elke sectie krijgt een vaste `id` (de ankers in de tabellen hieronder), gelijk in nl en en.
8. Elke sectie krijgt de achtergrond uit de kolom Achtergrond van de tabellen hieronder: de hero is wit, daarna wisselen `bg-ice` en wit elkaar af, en de afsluiter is een witte sectie met het blauwe vlak van `ServiceCta`. De pagina zet `bg-ice` via de prop `className` van de sectiebouwsteen; wit is de standaard en vraagt geen klasse.

### 4.2 Beroepspagina werkzoekende: `/werken-als/[beroep]`

Lange tekst: `getBeroepCopy(item.id, locale).copy.jobseeker` (§5.3). Totale lengte 500 tot 800 woorden (spec 03 §6.12).

| Nr | Sectie en anker | Bouwsteen en props | Inhoud | Achtergrond |
|---|---|---|---|---|
| 1 | Hero | `ServiceHero` met `breadcrumb=[{ label: t("header.nav.werkzoekenden"), href: ROUTES.werkzoekenden }, { label: tb(\`${id}.enkelvoud\`), href: paths.werkenAls(id) }]`, `title=hero.title`, `lead=hero.lead`, `facts=hero.facts`, `factsLabel=tb("ui.factsLabel")`, `ctas` (zie onder), `note=t("common.notes.freeJobseeker")` | h1 "Werken als {beroep} in Den Haag", lead van twee zinnen, 2 tot 3 feitenchips | wit |
| 2 | Wat je doet, `#werk` | `ListSection` met `heading=work.title`, `accent=work.accent`, `intro=work.intro`, `groups=[{ items: work.tasks }, { title: work.placesTitle, items: work.places }]`, `tone="check"` | 5 tot 7 taken, 3 tot 5 soorten werkplekken | `bg-ice` |
| 3 | Wat je meebrengt, `#eisen` | `ListSection` met `groups=[{ items: requirements.items }]`, `note=requirements.minAgeNote` | 3 tot 6 objectieve eisen; leeftijdszin alleen bij `content.minAge18` | wit |
| 4 | Loon, `#loon` | `WageIndication` (§4.4.2) | indicatie, bron, peildatum, voorbehoud | `bg-ice` |
| 5 | Werktijden, `#werktijden` | `ServiceFeatureGrid` met `columns={3}`, `features=schedule.items` met icoon uit `BEROEP_ICONS` | 3 kaarten: dagindeling, drukke periodes, weer of seizoen | wit |
| 6 | Certificaten, `#certificaten` | `CertificateList` (§4.4.3) | 2 tot 4 certificaten met hoe nodig, wat het is en hoe je het haalt | `bg-ice` |
| 7 | Waarom via Groos, `#waarom` | `ServiceFeatureGrid` met `columns={3}`, `features=why.items` | eigen waarom-kop per beroep, 3 kaarten | wit |
| 8 | Doorgroei, `#doorgroei` | `CareerPath` (§4.4.4) | 3 tot 5 stappen en één zin | `bg-ice` |
| 9 | Vacatures, `#vacatures` | `<Suspense fallback={<VacancyListSkeleton count={3} />}>` van spec 06 met `BeroepVacancies` (§4.4.5), `beroepId=id`, `limit={6}` | live vacatures of lege staat | wit |
| 10 | Solliciteren, `#solliciteren` | `ServiceSteps` met `heading`, `accent`, `intro` en `steps` uit messages `werkzoekenden.steps` | 4 gedeelde stappen | `bg-ice` |
| 11 | Vragen, `#faq` | `ServiceFaq` met `heading=faq.title`, `accent=faq.accent`, `items=withConfirmedClaims(faq.items)` | 6 of 7 vragen, minstens 4 beroepsspecifiek | wit |
| 12 | Ander perspectief | `PerspectiveLink` met `text=perspective.text`, `linkLabel=perspective.linkLabel`, `href=paths.werkgeverBeroep(id)` | één zin plus link | `bg-ice` |
| 13 | Afsluiter, `#aan-de-slag` | `ServiceCta` met `title=cta.title`, `accent=cta.accent`, `subtitle=cta.body`, `ctas` en `note=t("common.notes.cvOptionalJobseeker")` | eigen CTA-kop per beroep | wit met het blauwe vlak van `ServiceCta` |

**Knoppen in de hero:** (1) `{ label: t("common.cta.viewJobs"), href: "#vacatures", variant: "primary" }`; (2) `{ label: t("common.cta.register"), href: \`${ROUTES.inschrijven}?beroep=${id}\`, variant: "secondary" }`; (3) `{ label: t("common.cta.whatsapp"), href: whatsappLink(t("common.whatsapp.werkzoekendeBeroep", { occupation })), variant: "secondary", external: true, icon: <MessageCircle aria-hidden /> }`, met `occupation = tb(\`${id}.enkelvoud\`).toLocaleLowerCase(locale)`. Op 390 px staan de knoppen onder elkaar op volle breedte.

**Knoppen in de afsluiter:** `{ label: t("common.cta.register"), href: \`${ROUTES.inschrijven}?beroep=${id}\`, variant: "primary" }`, WhatsApp zoals hierboven (`variant: "secondary"`) en een tekstlink `beroepen.ui.vacancies.viewAllLink` naar `paths.vacaturesVoorBeroep(id)`.

**Feitenchips in de hero** (`hero.facts`, 2 of 3 items, elk `{ label, value }`): het eerste is altijd het loon met `label` "Uurloon (indicatie)" en `value` gelijk aan de startersband uit `content.wage.starter`, opgemaakt met `formatEuro` en `common.format.wageRange`. De pagina zet dat eerste item zelf, zodat het getal maar op één plek staat; `hero.facts` in content bevat alleen de andere chips, bijvoorbeeld "Werktijden: meestal vanaf 07.00 uur" en "Diploma: niet nodig".

### 4.3 Beroepspagina werkgever: `/werkgevers/[beroep]`

Lange tekst: `copy.employer`. Totale lengte 500 tot 800 woorden. Geen live vacatures (context/08 §6.8).

| Nr | Sectie en anker | Bouwsteen en props | Inhoud | Achtergrond |
|---|---|---|---|---|
| 1 | Hero | `ServiceHero` met `breadcrumb=[{ label: t("header.nav.werkgevers"), href: ROUTES.werkgevers }, { label: tb(\`${id}.meervoud\`), href: paths.werkgeverBeroep(id) }]`, `ctas` (zie onder), `note=t("common.notes.noObligationEmployer")` | h1 zonder consumentenintentie (§6.6), lead van twee zinnen | wit |
| 2 | Wat wij leveren, `#levering` | `ListSection` met `groups=[{ items: supply.tasks }, { title: supply.clientsTitle, items: supply.clients }]` | 5 tot 7 taken die de medewerkers doen, 3 tot 5 soorten opdrachtgevers (zonder namen) | `bg-ice` |
| 3 | Waarom Groos, `#waarom` | `ServiceFeatureGrid` met `columns={4}`, `features=withConfirmedClaims(why.items)` | eigen waarom-kop per beroep, 4 kaarten | wit |
| 4 | Certificaten, `#certificaten` | `CertificateList` | welke certificaten vaak gevraagd worden, per kandidaat besproken | `bg-ice` |
| 5 | Planning, `#planning` | `ServiceFeatureGrid` met `columns={3}`, `features=planning.items` | drukke periodes, werktijden, duur van de inzet | wit |
| 6 | Werkwijze, `#werkwijze` | `ServiceSteps` met `werkgevers.steps` | 4 gedeelde stappen | `bg-ice` |
| 7 | Zekerheid, `#zekerheid` | `ListSection` met `groups=[{ items: withConfirmedClaims(legal.items).map(i => i.text) }]` plus link `legal.wttaLinkLabel` naar `ROUTES.wtta` | gelijkwaardige beloning, Arbowet, inlenersaansprakelijkheid, Wtta-link | wit |
| 8 | Vragen, `#faq` | `ServiceFaq` | 6 tot 8 vragen, minstens de helft beroepsspecifiek | `bg-ice` |
| 9 | Ander perspectief | `PerspectiveLink` naar `paths.werkenAls(id)` | één zin plus link | wit |
| 10 | Afsluiter, `#aanvragen` | `ServiceCta` met `title`, `accent`, `subtitle`, `ctas` en `note=t("common.notes.urgentEmployer")` | eigen CTA-kop per beroep | wit met het blauwe vlak van `ServiceCta` |

**Knoppen in hero en afsluiter:** (1) `{ label: t("common.cta.requestStaff"), href: \`${ROUTES.personeelAanvragen}?beroep=${id}\`, variant: "primary" }`; (2) `{ label: t("common.cta.call"), href: contact.phoneHref, variant: "secondary", icon: <Phone aria-hidden />, ariaLabel: t("header.callAria", { phone: contact.phoneDisplay }) }`. In de afsluiter komt daar WhatsApp bij: `{ label: t("common.cta.whatsapp"), href: whatsappLink(t("common.whatsapp.werkgeverBeroep", { occupationPlural })), variant: "secondary", external: true, icon: <MessageCircle aria-hidden /> }`, met `occupationPlural = tb(\`${id}.meervoud\`).toLocaleLowerCase(locale)`.

### 4.4 Componenten

#### 4.4.1 Aanpassingen aan `components/service/` (blijven op die plek, namen ongewijzigd)

Besluit: de vijf bouwstenen blijven in `components/service/` (spec 01 §4.2 rekent op die plek en die namen). Ze worden losgekoppeld van de JV-sleutels (`service.*`, `common.cta.requestQuote`, `#offerte`) en krijgen hun knoppen en koppen als props. Elke bouwsteen accepteert daarnaast `className?: string` op het `<section>`-element, waarmee de pagina de achtergrond uit de kolom Achtergrond zet (§4.1 regel 8). De glas-, gloed- en rastereffecten verdwijnen (B-29); kleuren alleen via tokens van spec 02.

Gedeelde typen in het nieuwe bestand `components/service/types.ts`, waaronder `StepItem = { title: string; body: string; icon?: LucideIcon }`:

```ts
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type CtaLink = {
  label: string;
  /** Intern pad ("/..."), anker ("#...") of extern adres (tel:, https://wa.me/...). */
  href: string;
  variant?: "primary" | "secondary";   // standaard "primary"
  icon?: ReactNode;                     // gerenderd Lucide-element met aria-hidden
  external?: boolean;                   // true: nieuw venster plus common.opensInNewTab
  ariaLabel?: string;
};

export type FeatureItem = { icon?: LucideIcon; title: string; body: string };
export type StepItem = { title: string; body: string; icon?: LucideIcon };
export type FaqItem = { q: string; a: string };
export type HeroFact = { label: string; value: string };
```

| Component | S/C | Props na aanpassing | Wijzigingen |
|---|---|---|---|
| `ServiceHero` (`service-hero.tsx`) | S | `{ breadcrumb: Crumb[]; title: string; lead: string; facts?: HeroFact[]; factsLabel?: string; ctas: CtaLink[]; note?: string; image?: { src: StaticImageData \| string; alt: string } }`; `Crumb` uit `components/sections/breadcrumbs` (spec 01) | Kruimelpad via `<Breadcrumbs items={breadcrumb} />` (spec 01 bouwt dat in stap 3). Geen `pt-32` meer (header is sticky). Feitenchips als `<ul aria-label={factsLabel}>` met per item `<li><span>{label}</span> <strong>{value}</strong></li>`. Knoppen uit `ctas` via `CtaButton`; bij een WhatsApp-knop (`external: true`, `variant="secondary"`) geeft hij `external` en `newTabLabel={t("common.opensInNewTab")}` aan `CtaButton` door (API spec 02 §4.7). `note` als `<p>` direct onder de knoppen. Beeld alleen via `next/image` met `sizes`, nu nergens gebruikt (B-25). `imageAlt` als losse prop vervalt. |
| `ServiceFeatureGrid` (`service-feature-grid.tsx`) | S | `{ id?: string; heading: string; accent?: string; intro?: string; features: FeatureItem[]; columns?: 3 \| 4 }` | `icon` optioneel; `columns` standaard 4 (`lg:grid-cols-4`), bij 3 `lg:grid-cols-3`. Itemtitels blijven h3 (B-05). Geen `bg-card/20` en geen rand rondom de sectie; het vlak volgt de achtergrondkolom; items als `Card variant="default"`. Iconen lijndikte 2 (B-28). |
| `ServiceSteps` (`service-steps.tsx`) | S | `{ id?; heading; accent?; intro?; steps: StepItem[] }`, met `StepItem` uit `components/service/types.ts` | Veld `description` heet `body` (zoals messages). Grid `lg:grid-cols-4` bij vier stappen. Het stapnummer is een los cijfer naast de kop met `aria-hidden`, de lijst is een `<ol>` zodat de volgorde voor schermlezers vast ligt. Geen "Stap 1"-label (spec 03 §6.5 regel 7). |
| `ServiceFaq` (`service-faq.tsx`) | S (was C) | `{ id?: string; heading: string; accent?: string; intro?: string; items: FaqItem[] }`, `id` standaard `"faq"` | Wordt een server component die `<Accordion>` uit `components/ui/accordion.tsx` (spec 02) rendert, met per item `<AccordionItem name={id} title={q} defaultOpen={i === 0}>{a}</AccordionItem>`. Die primitive is native `<details>` en `<summary>`: één tegelijk open in moderne browsers, Enter en Spatie werken zonder JavaScript, geen hydratie; het pictogram en de draaiing komen uit de primitive. `heading` is verplicht; `service.faqHeading` vervalt. |
| `ServiceCta` (`service-cta.tsx`) | S | `{ id?: string; title: string; accent?: string; subtitle?: string; ctas: CtaLink[]; note?: string; link?: { label: string; href: string } }` | Rendert het recept van spec 02 §4.13: `section-tight` > `container` > `surface-brand pattern-oo rounded-2xl p-8 md:p-12`; precies één per pagina. Kop als h2 met `title` plus `accent` (accent aan het slot). Geen radiale gloed. Knoppen uit `ctas` via `CtaButton`; bij een WhatsApp-knop (`external: true`, `variant="secondary"`) geeft hij `external` en `newTabLabel={t("common.opensInNewTab")}` aan `CtaButton` door (API spec 02 §4.7). `link` als tekstlink onder de knoppen; `note` uit `common.notes.*` in plaats van `service.ctaNote`. |

`CtaButton` (spec 02) rendert de knoppen. Voor `external: true` geven `ServiceHero` en `ServiceCta` `external` en `newTabLabel={t("common.opensInNewTab")}` aan `CtaButton` door (API spec 02 §4.7); `CtaButton` zet dan `target="_blank" rel="noopener noreferrer"` en de verborgen tekst. WhatsApp-knoppen gebruiken altijd `variant="secondary"`.

`SectionHeading` uit `components/sections/section-heading.tsx` blijft de kop van elke sectie (`{ title, accent?, intro?, align?, className? }`). Spec 04 bezit de props, spec 02 het uiterlijk.

#### 4.4.2 Nieuwe componenten in `components/beroep/`

Alle componenten zijn server components zonder eigen state. Elke sectie rendert `<section id={id} className="scroll-mt-24 ...">` met `SectionHeading` als h2, en elke sectiecomponent accepteert `className?: string` voor de achtergrond (§4.1 regel 8).

| Naam | Bestand | Props | Rendert |
|---|---|---|---|
| `ListSection` | `list-section.tsx` | `{ id?: string; heading: string; accent?: string; intro?: string; groups: { title?: string; items: string[] }[]; note?: string; tone?: "check" \| "dot"; link?: { label: string; href: AppPath } }` | Groepen naast elkaar vanaf `md` (één groep: één kolom met `max-w-3xl`). Een groep met `title` krijgt een h3. Items als `<ul>`, bij `tone="check"` met `Check` (aria-hidden). `note` als `<p>` onder de lijsten, `link` als tekstlink. |
| `WageIndication` | `wage-indication.tsx` | `{ id?: string; heading: string; accent?: string; intro?: string; badge: string; rangeLabel: string; range: string; experienced?: { label: string; range: string }; source: string; disclaimer: string; extra?: string }` | Een blok met het label `badge` ("Indicatie") naast `rangeLabel`, het bedrag `range` groot in `font-display` en tabulaire cijfers, daaronder optioneel de regel "Met ervaring" en `extra` (toeslagen in één zin). Onder het blok `source` en `disclaimer` in kleine tekst met AA-contrast. Alle strings komen opgemaakt binnen; het component formatteert niets. |
| `CertificateList` | `certificate-list.tsx` | `{ id?: string; heading: string; accent?: string; intro?: string; items: { name: string; needLabel: string; body: string }[] }` | Lijst van kaarten, per item een h3 met `name`, een badge `needLabel` en `body`. Twee kolommen vanaf `md`. |
| `CareerPath` | `career-path.tsx` | `{ id?: string; heading: string; accent?: string; intro?: string; steps: string[]; listLabel: string; note?: string }` | `<ol aria-label={listLabel}>` als horizontale reeks vanaf `md` met `ChevronRight` tussen de stappen (aria-hidden), verticaal op mobiel. `note` als één alinea. |
| `BeroepVacancies` | `beroep-vacancies.tsx` | `{ id?: string; beroepId?: BeroepId; locale: Locale; heading: string; accent?: string; intro?: string; limit?: number; empty: { title: string; body: string; whatsappText: string } }` | Zie §4.4.5. Async. |
| `BeroepGrid` | `beroep-grid.tsx` | `{ id?: string; heading: string; accent?: string; intro?: string; items: { id: BeroepId; title: string; body: string; href: AppPath; icon: LucideIcon }[] }` | Vijf kaarten; per kaart één `Link` in de h3, die met `after:absolute after:inset-0` de hele kaart klikbaar maakt, met `ArrowRight` (aria-hidden). De kaart zelf is geen `Link` (zie de tabel hieronder). Drie kolommen vanaf `lg`, twee vanaf `sm`. |
| `AudienceCompare` | `audience-compare.tsx` | `{ id?: string; heading: string; accent?: string; intro?: string; caption: string; columns: [AudienceColumn, AudienceColumn]; rows: { label: string; values: [string, string] }[] }` met `AudienceColumn = { title: string; href: AppPath; linkLabel: string; current: boolean }` | Een `<table>` met zichtbare `<caption>`, `<th scope="col">` per doelgroep en `<th scope="row">` per rij, in een wrapper met `role="region"`, `aria-label={caption}` en `tabIndex={0}` voor horizontaal scrollen op 390 px. De kolom met `current: true` krijgt een rustige tint via tokens. Onder elke kolom een tekstlink naar de pagina van die doelgroep (de huidige pagina krijgt geen link). |
| `PerspectiveLink` | `perspective-link.tsx` | `{ text: string; linkLabel: string; href: AppPath }` | `<aside>` met één alinea en een tekstlink met `ArrowRight`. |
| `WttaTimeline` | `wtta-timeline.tsx` | `{ id?: string; heading: string; accent?: string; intro?: string; items: { date: string; dateLabel: string; title: string; body: string; past: boolean }[] }` | `<ol>` met per item `<time dateTime={date}>{dateLabel}</time>`, een h3 en een alinea. Items met `past: true` krijgen een gevuld bolletje, de rest een open bolletje; de betekenis staat ook in tekst (`dateLabel` plus de zin "Deze datum is voorbij." uit `werkgevers.wtta.pastLabel` als `sr-only`). |
| `SourceList` | `source-list.tsx` | `{ id?: string; heading: string; intro: string; items: { label: string; href: string }[] }` | h2, één zin met de peildatum, `<ul>` met externe links (zelfde tabblad, zie spec 09 §8). |
| `FactSheet` | `fact-sheet.tsx` | `{ id?: string; heading: string; accent?: string; intro?: string; items: { term: string; description: string }[] }` | `<dl>` in twee kolommen vanaf `md`: `<dt>` vet, `<dd>` gewone tekst. |

`AppPath` en `Locale` komen uit `lib/routes.ts` en `i18n/routing.ts`; `BeroepId` uit `content/beroepen/index.ts`.

**Primitives van spec 02**

| Component | Primitives |
|---|---|
| `ServiceFeatureGrid` | `Card variant="default"` met `IconTile tone="tint"` en `CardTitle as="h3"` |
| `CertificateList` | per item `Card variant="default"` met `Badge tone="neutral" size="sm"` voor `needLabel` |
| `WageIndication` | `Card variant="tint"` met `Badge tone="brand" size="sm"` voor "Indicatie" |
| `BeroepGrid` | `Card variant="interactive"` met `IconTile tone="tint"` en een h3 met daarin de `Link` met `after:absolute after:inset-0` en `ArrowRight` (`aria-hidden`), dus niet de hele kaart in een `Link` |
| `AudienceCompare` | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` en een zichtbare `TableCaption` (spec 02) |
| `FactSheet` | `Card variant="muted"` met een `<dl>` |

#### 4.4.3 Certificaten

`CertificateList` krijgt per item `needLabel = tb(\`ui.need.${entry.need}\`)`. De pagina filtert eerst met `withConfirmedClaims`. Een certificaat dat Groos volgens de copy "regelt" of "betaalt" draagt `claim: "certificateSupport"` en verschijnt pas na bevestiging (CL-11, VR-12); de basistekst beschrijft alleen wat het certificaat is en hoe je het in het algemeen haalt.

#### 4.4.4 Doorgroei

`CareerPath` krijgt `listLabel = tb("ui.careerListLabel")`. De stappen zijn functienamen uit context/01 ("Glazenwasser", "Allround glazenwasser", "Meewerkend voorman"); de `note` is één zin in je-vorm zonder belofte over opleidingen die Groos betaalt.

#### 4.4.5 `BeroepVacancies`

```tsx
// components/beroep/beroep-vacancies.tsx (server, async)
export async function BeroepVacancies(props: BeroepVacanciesProps): Promise<React.JSX.Element>;
```

1. Met `beroepId`: `const { items, total } = await getVacanciesByOccupation(beroepId, { limit: limit ?? 6 })`. Zonder `beroepId` (op `/werkzoekenden`): `const items = await getLatestVacancies({ limit: limit ?? 3 })` en `total = await getOpenVacancyCount()`. Beide uit `lib/data/vacancies.ts` (spec 10).
2. Een fout van de datalaag wordt opgevangen (`try/catch`): de sectie toont dan `beroepen.ui.vacancies.loadError` met een link naar `/vacatures` en logt `console.error`. Zo valt de beroepspagina niet om als Supabase even weg is; de volgende revalidatie herstelt het.
3. Met resultaten: een `sr-only` `<p id={listId}>` met `beroepen.ui.vacancies.listLabel` (of `listLabelAll`) en daarna `<VacancyList items={items} locale={locale} headingLevel="h3" ariaLabelledBy={listId} className="lg:grid-cols-3" />` van spec 06 (een `<ul>` met per item `VacancyCard`), daaronder de regel `beroepen.ui.vacancies.count` met `{count: total}` en de tekstlink `beroepen.ui.vacancies.viewAllLink` naar `paths.vacaturesVoorBeroep(beroepId)` (of `ROUTES.vacatures` zonder beroep).
4. Zonder resultaten: de lege staat met h3 `empty.title`, alinea `empty.body`, `CtaButton` "Schrijf je in" naar `${ROUTES.inschrijven}?beroep=${id}` (met `id = beroepId`; zonder `beroepId`, op `/werkzoekenden`, naar `ROUTES.inschrijven`) en een WhatsApp-knop met `whatsappLink(empty.whatsappText)`, `variant="secondary"`, `external` en `newTabLabel={t("common.opensInNewTab")}`. Nooit een doodlopende pagina (context/13 §11 punt 12).
5. De sectie staat onder alle `notFound()`-controles en binnen `<Suspense fallback={<VacancyListSkeleton count={3} />}>` met `VacancyListSkeleton` van spec 06; deze module heeft geen eigen skelet. De kop staat buiten de Suspense-grens, zodat de koppenstructuur vast ligt.

### 4.5 `/werkzoekenden`

Lange tekst: `getWerkzoekendenPage(locale)` (§5.3). Lengte 600 tot 900 woorden. Je-vorm, B1.

| Nr | Sectie en anker | Bouwsteen | Inhoud | Achtergrond |
|---|---|---|---|---|
| 1 | Hero | `ServiceHero` met kruimelpad Werkzoekenden, knoppen `common.cta.viewJobs` naar `ROUTES.vacatures`, `common.cta.register` naar `ROUTES.inschrijven`, WhatsApp met `common.whatsapp.werkzoekende`; `note=common.notes.freeJobseeker` | h1 en lead | wit |
| 2 | Beroepen, `#beroepen` | `BeroepGrid` met per id `title=beroepen.<id>.enkelvoud`, `body=beroepen.<id>.jobseeker.summary`, `href=paths.werkenAls(id)`, icoon uit `beroepen` (spec 01) | vijf kaarten | `bg-ice` |
| 3 | Zo werkt het, `#zo-werkt-het` | `ServiceSteps` met `werkzoekenden.steps` | 4 stappen | wit |
| 4 | Wat je krijgt, `#wat-je-krijgt` | `ServiceFeatureGrid` met `withConfirmedClaims(promises.items)` | 4 tot 6 kaarten, alleen claims A en B | `bg-ice` |
| 5 | Je rechten, `#je-rechten` | `ListSection` met `withConfirmedClaims(rights.items)` | 5 tot 7 punten over contract, loon, vakantiegeld, beschermingsmiddelen, papieren | wit |
| 6 | Vacatures, `#vacatures` | `BeroepVacancies` zonder `beroepId`, `limit={3}`, in `<Suspense fallback={<VacancyListSkeleton count={3} />}>` | nieuwste 3 of lege staat | `bg-ice` |
| 7 | Twee kanten, `#voor-werkgevers` | `AudienceCompare` met `columns[0].current = true` | vergelijking werkzoekende en werkgever | wit |
| 8 | Vragen, `#faq` | `ServiceFaq` | 7 of 8 vragen (context/13 §7.1) | `bg-ice` |
| 9 | Afsluiter | `ServiceCta` met `common.cta.viewJobs` en `common.cta.register` | vraagkop | wit met het blauwe vlak van `ServiceCta` |

### 4.6 `/werkgevers`

Lange tekst: `getWerkgeversPage(locale)`. Lengte 700 tot 1.000 woorden. U-vorm.

| Nr | Sectie en anker | Bouwsteen | Inhoud | Achtergrond |
|---|---|---|---|---|
| 1 | Hero | `ServiceHero` met kruimelpad Werkgevers, knoppen `common.cta.requestStaff` naar `ROUTES.personeelAanvragen` en `common.cta.call`; `note=common.notes.noObligationEmployer` | h1 en lead | wit |
| 2 | Wat Groos levert, `#wat-wij-leveren` | `ServiceFeatureGrid` met `withConfirmedClaims(supply.items)` | 4 items, waarvan 2 met een `claim`; met alle vlaggen op `false` alleen de A-items | `bg-ice` |
| 3 | Beroepen, `#beroepen` | `BeroepGrid` met `title=beroepen.<id>.meervoud`, `body=beroepen.<id>.employer.summary`, `href=paths.werkgeverBeroep(id)` | vijf kaarten | wit |
| 4 | Werkwijze, `#werkwijze` | `ServiceSteps` met `werkgevers.steps` | 4 stappen | `bg-ice` |
| 5 | Uitzenden in het kort, `#uitzenden` | `FactSheet` met `agency.items` | wie is werkgever, wanneer handig, hoe u betaalt, wie zorgt voor veiligheid, duur | wit |
| 6 | Zekerheid, `#zekerheid` | `ListSection` met `legal.items` en link naar `ROUTES.wtta` | gelijkwaardige beloning, inlenersaansprakelijkheid, Arbowet, gelijke behandeling (zin uit spec 09 §6.8) | `bg-ice` |
| 7 | Twee kanten, `#voor-werkzoekenden` | `AudienceCompare` met `columns[1].current = true` | dezelfde rijen, gespiegelde nadruk | wit |
| 8 | Vragen, `#faq` | `ServiceFaq` | 7 of 8 vragen (context/13 §7.2, alleen A en B, C met `claim`) | `bg-ice` |
| 9 | Afsluiter | `ServiceCta` met `common.cta.requestStaff`, `common.cta.call` en WhatsApp met `common.whatsapp.werkgever` (`variant="secondary"`) | vraagkop | wit met het blauwe vlak van `ServiceCta` |

### 4.7 `/werkgevers/wtta`

Lange tekst: `getWttaPage(locale)`. Lengte 500 tot 900 woorden. U-vorm. Kennispagina met gedateerde feiten uit context/09 §1 en een eerlijke statusvermelding (B-24).

| Nr | Sectie en anker | Bouwsteen | Inhoud | Achtergrond |
|---|---|---|---|---|
| 1 | Hero | `ServiceHero` met kruimelpad Werkgevers, Inlenen en de Wtta; knoppen `common.cta.requestStaff` (secundair) en `common.cta.contact` naar `ROUTES.contact`; `note` = `werkgevers.wtta.reviewed` met `{date: formatDate(copy.reviewedAt, locale)}` | h1, lead | wit |
| 2 | Wat de Wtta is, `#wat-is-de-wtta` | `SectionHeading` plus `about.paragraphs` als alinea's (`max-w-prose`) | 2 of 3 alinea's | `bg-ice` |
| 3 | Tijdlijn, `#tijdlijn` | `WttaTimeline` met `past = new Date(item.date) < buildDate` (berekend bij render, de pagina is statisch en wordt bij elke deploy opnieuw gebouwd) | 6 mijlpalen | wit |
| 4 | Wat u regelt, `#wat-u-regelt` | `ListSection` met `hirer.items` | 4 tot 5 punten | `bg-ice` |
| 5 | Controleren, `#controleren` | `ServiceSteps` met `check.steps` | 3 stappen | wit |
| 6 | Status van Groos, `#status-groos` | `SectionHeading` met `status.title` en `status.intro`, daaronder `<WttaStatus variant="block" />` (spec 09) | geen eigen statustekst | `bg-ice` |
| 7 | Aansprakelijkheid, `#aansprakelijkheid` | `SectionHeading` plus `liability.paragraphs` | inlenersaansprakelijkheid en g-rekening in het algemeen | wit |
| 8 | Vragen, `#faq` | `ServiceFaq` | 5 of 6 vragen | `bg-ice` |
| 9 | Bronnen, `#bronnen` | `SourceList` | officiële bronnen met peildatum | wit |
| 10 | Afsluiter | `ServiceCta` met `common.cta.requestStaff` | vraagkop | wit met het blauwe vlak van `ServiceCta` |

De tekst zegt nergens zelf of Groos is aangemeld, toegelaten of in voorbereiding; dat doet alleen `WttaStatus` (CL-04). De sectiekop "Waar Groos nu staat" staat er zolang `WTTA.phase` uit `lib/legal.ts` niet gelijk is aan `"none"`; bij `"none"` rendert `WttaStatus` niets en laat de pagina sectie 6 helemaal weg. Valt sectie 6 weg, dan schuift de afwisseling op: sectie 7 `bg-ice`, sectie 8 wit, sectie 9 `bg-ice`.

## 5 Data

### 5.1 Database

Deze module bezit geen tabellen. Ze leest via spec 10:

| Functie (`lib/data/vacancies.ts`) | Gebruik | Velden die getoond worden (via `VacancyCard`) |
|---|---|---|
| `getVacanciesByOccupation(slug, { limit: 6 })` | sectie Vacatures op `/werken-als/[beroep]` | `VacancyListItem` volledig; deze module leest zelf alleen `total` |
| `getLatestVacancies({ limit: 3 })` en `getOpenVacancyCount()` | sectie Vacatures op `/werkzoekenden` | idem |

`occupations.slug` is gelijk aan `BEROEP_IDS` (spec 01 §5.2). Caching volgt B-35: de leesfuncties gebruiken `unstable_cache` met tag `vacatures` en `revalidate: 3600`. `revalidateTag("vacatures", ...)` door spec 08 en de cron van spec 10 maakt daarmee ook de ISR-pagina's van deze module ongeldig; daarom hoeft `revalidateVacancies` de paden `/werken-als/*` en `/werkzoekenden` niet apart te verversen. De pagina's exporteren als vangnet `export const revalidate = 3600`.

### 5.2 Typen voor `content/beroepen`

```ts
// content/beroepen/types.ts (geen runtime-imports)
import type { ClaimKey } from "@/lib/claims";
import type { BeroepId } from "@/content/beroepen";
import type { BeroepIcon } from "@/content/beroepen/icons";

export type Claimable = { claim?: ClaimKey };
export type SectionHead = { title: string; accent?: string; intro?: string };
export type TextItem = Claimable & { title: string; body: string; icon?: BeroepIcon };
export type ListItem = Claimable & { text: string };
export type FaqEntry = Claimable & { q: string; a: string; /** true als de vraag alleen over dit beroep gaat */ specific: boolean };
export type CertificateNeed = "always" | "often" | "sometimes" | "plus";
export type CertificateEntry = Claimable & { name: string; need: CertificateNeed; body: string };
export type HeroFactCopy = { label: string; value: string };
export type MetaCopy = { title: string; description: string; keywords: string[] };
export type CtaCopy = { title: string; accent: string; body: string };
export type Tuple3<T> = readonly [T, T, T];
export type Tuple4<T> = readonly [T, T, T, T];

export type JobseekerCopy = {
  meta: MetaCopy;
  hero: { title: string; lead: string; facts: HeroFactCopy[] };          // facts: 1 of 2 items, loonchip zet de pagina
  work: SectionHead & { tasks: string[]; placesTitle: string; places: string[] };   // tasks 5..7, places 3..5
  requirements: SectionHead & { items: string[]; minAgeNote?: string };  // items 3..6
  wage: SectionHead & { sourceLabel: string; extra?: string };          // extra: toeslagen in één zin
  schedule: SectionHead & { items: Tuple3<TextItem> };
  certificates: SectionHead & { items: CertificateEntry[] };            // 2..4
  why: SectionHead & { items: Tuple3<TextItem> };                       // eigen waarom-kop
  career: SectionHead & { steps: string[]; note?: string };             // steps 3..5
  vacancies: SectionHead & { emptyTitle: string; emptyBody: string };
  faq: SectionHead & { items: FaqEntry[] };                             // 6..7, specific >= 4
  perspective: { text: string; linkLabel: string };
  cta: CtaCopy;                                                         // eigen CTA-kop
};

export type EmployerCopy = {
  meta: MetaCopy & { serviceType: string };                             // serviceType voor serviceLd
  hero: { title: string; lead: string };
  supply: SectionHead & { tasks: string[]; clientsTitle: string; clients: string[] };
  why: SectionHead & { items: Tuple4<TextItem> };                       // eigen waarom-kop
  certificates: SectionHead & { items: CertificateEntry[] };
  planning: SectionHead & { items: Tuple3<TextItem> };
  legal: SectionHead & { items: ListItem[]; wttaLinkLabel: string };    // items 3..5
  faq: SectionHead & { items: FaqEntry[] };                             // 6..8, specific >= helft
  perspective: { text: string; linkLabel: string };
  cta: CtaCopy;
};

export type BeroepCopy = { jobseeker: JobseekerCopy; employer: EmployerCopy };

export type WageFacts = {
  /** Bruto per uur, 21 jaar en ouder, zonder ervaring. */
  starter: { min: number; max: number };
  /** Optioneel: bandbreedte met ervaring. */
  experienced?: { min: number; max: number };
  /** ISO-datum van de loontabel waar de bedragen uit komen. */
  tableDate: string;
  /** ISO-datum waarop de bedragen zijn gecontroleerd (peildatum op de pagina). */
  checkedAt: string;
  /** ISO-datum waarop de bedragen opnieuw bekeken moeten worden (volgende loonsverhoging). */
  reviewBy: string;
  sourceUrl: string;
};

export type BeroepContent = {
  id: BeroepId;
  wage: WageFacts;
  /** Arbo-reden voor 18+, gelijk aan MIN_AGE_REASONS uit lib/data/options.ts, of null. */
  minAge18: "work_at_height" | "construction_demolition" | "forklift" | null;
  nl: BeroepCopy;
  en: BeroepCopy;
};
```

`content/beroepen/icons.ts` (geen tekst, client-veilig):

```ts
import { CalendarDays, CloudSun, Clock, HardHat, Handshake, Phone, Receipt, ShieldCheck, Sun, Truck, Users, Wrench, Euro, Route } from "lucide-react";
export const BEROEP_ICONS = { calendar: CalendarDays, weather: CloudSun, clock: Clock, safety: HardHat, handshake: Handshake, phone: Phone, payslip: Receipt, shield: ShieldCheck, season: Sun, transport: Truck, team: Users, tools: Wrench, wage: Euro, route: Route } as const;
export type BeroepIcon = keyof typeof BEROEP_ICONS;
```

Elk iconenpaar bestaat in lucide-react 0.456; ontbreekt er een, dan kiest de bouw-agent een bestaand icoon met dezelfde betekenis en houdt hij de sleutel.

Per beroep één bestand, `content/beroepen/<id>.ts`, met `export const <camelCaseId> = { ... } satisfies BeroepContent;` (`glazenwasser`, `schoonmaker`, `logistiekMedewerker`, `verhuizer`, `hulpkrachtBouwEnSloop`). Het bestand importeert alleen typen. De blokken heten `jobseeker` en `employer`, zodat `check:copy` de je-zone en de u-zone herkent (spec 03 §6.19). Slugs staan er niet in; die komen uit `getBeroep(id)` (spec 01).

**Validatie.** Elke lijst met een minimum en maximum in de commentaren hierboven wordt gecontroleerd in `tests/unit/content/beroepen-kwaliteit.test.ts` (§10 stap 12); de typen leggen alleen de tuples vast. `nl` en `en` hebben dezelfde lengtes, dezelfde `claim`-waarden, dezelfde `icon`-waarden en dezelfde `specific`-waarden per index.

### 5.3 Loaders (server-only)

```ts
// content/beroepen/pages.ts
import "server-only";
import type { Locale } from "@/i18n/routing";
export const beroepContent: Record<BeroepId, BeroepContent>;
export function getBeroepCopy(id: BeroepId, locale: Locale): { content: BeroepContent; copy: BeroepCopy };   // copy = content[locale]

// content/pages/loaders.ts
import "server-only";
export function getWerkzoekendenPage(locale: Locale): WerkzoekendenCopy;
export function getWerkgeversPage(locale: Locale): WerkgeversCopy;
export function getWttaPage(locale: Locale): WttaCopy;
```

De databestanden (`content/beroepen/<id>.ts`, `content/pages/*.ts`) importeren geen `server-only`, zodat de tests ze direct kunnen laden; alleen de loaders doen dat (spec 01 §4.3 regel 4). Geen terugval van `en` naar `nl`: beide blokken zijn verplicht (K2 en K15 van spec 14).

### 5.4 Typen voor `content/pages`

```ts
// content/pages/types.ts
import type { CtaCopy, FaqEntry, ListItem, SectionHead, TextItem } from "@/content/beroepen/types";

export type CompareCopy = SectionHead & {
  caption: string;
  jobseekerTitle: string; employerTitle: string;
  jobseekerLinkLabel: string; employerLinkLabel: string;
  /** Waarden zonder je of u, zodat de rij op beide pagina's past (spec 03 §6.2). */
  rows: { label: string; jobseeker: string; employer: string }[];   // 4..5
};

export type WerkzoekendenCopy = {
  hero: { title: string; lead: string };
  beroepen: SectionHead;
  promises: SectionHead & { items: TextItem[] };      // 4..6
  rights: SectionHead & { items: ListItem[] };        // 5..7
  vacancies: SectionHead & { emptyTitle: string; emptyBody: string };
  compare: CompareCopy;
  faq: SectionHead & { items: FaqEntry[] };           // 7..8, specific altijd false
  cta: CtaCopy;
};

export type WerkgeversCopy = {
  hero: { title: string; lead: string };
  supply: SectionHead & { items: TextItem[] };        // 4
  beroepen: SectionHead;
  agency: SectionHead & { items: { term: string; description: string }[] };   // 4..5
  legal: SectionHead & { items: ListItem[]; wttaLinkLabel: string };
  compare: CompareCopy;
  faq: SectionHead & { items: FaqEntry[] };           // 7..8
  cta: CtaCopy;
};

export type WttaMilestone = { date: string; dateLabel?: string; title: string; body: string; source: string };
export type WttaCopy = {
  reviewedAt: string;                                 // ISO, getoond als "Bijgewerkt op ..."
  hero: { title: string; lead: string };
  about: SectionHead & { paragraphs: string[] };     // 2..3
  timeline: SectionHead & { items: WttaMilestone[] }; // 6
  hirer: SectionHead & { items: ListItem[] };         // 4..5
  check: SectionHead & { steps: { title: string; body: string }[] };   // 3
  status: SectionHead;
  liability: SectionHead & { paragraphs: string[] };  // 2
  faq: SectionHead & { items: FaqEntry[] };           // 5..6
  sources: { title: string; intro: string; items: { label: string; href: string }[] };
  cta: CtaCopy;
};

export type Localized<T> = { nl: T; en: T };
```

`content/pages/werkzoekenden.ts` exporteert `werkzoekendenPage satisfies Localized<WerkzoekendenCopy>`, `werkgevers.ts` exporteert `werkgeversPage`, `wtta.ts` exporteert `wttaPage`. Bij `WttaMilestone` is `dateLabel` verplicht als de mijlpaal een periode is ("1 november tot en met 31 december 2026"); anders maakt de pagina het label met `formatDate(date, locale)`. `source` is een korte bronnaam met datum ("toelatinguitleenmarkt.nl, geraadpleegd 2 oktober 2026") en wordt als kleine regel onder het item getoond.

## 6 Tekstelementen

Toon, aanspreekvorm, notatie, woordenlijst, sjablonen en lengtes volgen spec 03; claims volgen het claimbeleid van spec 03 en de claims-checklist van spec 09. Deze paragraaf legt vast welke tekst waar staat, met voorbeeldcopy die de schrijvers mogen verbeteren maar niet mogen vervangen door een andere structuur.

### 6.1 Waar de tekst staat

| Soort tekst | Plek |
|---|---|
| Beroepsnamen, korte samenvattingen voor rasters, UI-labels van de beroepscomponenten | messages `beroepen` |
| Metadata en gedeelde stappen van de overzichtspagina's, labels van de Wtta-pagina | messages `werkzoekenden`, `werkgevers` |
| Alle lange tekst per beroep, inclusief metadata per beroep | `content/beroepen/<id>.ts` |
| Lange tekst van `/werkzoekenden`, `/werkgevers`, `/werkgevers/wtta` | `content/pages/{werkzoekenden,werkgevers,wtta}.ts` |
| Knoppen, notes, WhatsApp-teksten, laadtekst | `common` (spec 03), alleen gelezen |
| Wtta-statuszin | `legal.wtta.block.*` via `WttaStatus` (spec 09), alleen gerenderd |

### 6.2 Sleutelboom NL

```json
{
  "werkzoekenden": {
    "meta": {
      "title": "Werk vinden via Groos",
      "description": "Zo vind je via Groos praktisch werk in en rond Den Haag. Lees hoe solliciteren werkt, wat je verdient en wat je rechten zijn."
    },
    "steps": {
      "title": "Van je sollicitatie tot",
      "accent": "je eerste werkdag",
      "intro": "Je weet bij elke stap wat er gebeurt en wie je kunt bellen.",
      "items": [
        { "title": "Je solliciteert of schrijft je in", "body": "Dat kan met het formulier, via WhatsApp of door ons te bellen, ook zonder cv." },
        { "title": "Wij bellen je", "body": "Jimmy of Lorenzo belt je om kennis te maken en te horen welk werk je zoekt." },
        { "title": "Je hoort wat het werk is", "body": "Voor je begint, hoor je de taken, de werktijden, het bruto uurloon en wat je meeneemt." },
        { "title": "Je begint met werken", "body": "Op je eerste werkdag weet je waar je moet zijn en wie je belt als je een vraag hebt." }
      ]
    }
  },
  "werkgevers": {
    "meta": {
      "title": "Personeel inhuren in Den Haag",
      "description": "Groos levert medewerkers voor glasbewassing, schoonmaak, logistiek, verhuizen, bouw en sloop in Den Haag en omgeving. Vraag vrijblijvend personeel aan."
    },
    "steps": {
      "title": "Van uw aanvraag tot",
      "accent": "de eerste werkdag",
      "intro": "U heeft bij elke stap contact met dezelfde persoon.",
      "items": [
        { "title": "U vertelt wie u zoekt", "body": "U belt ons of vult de aanvraag in met het beroep, het aantal mensen en de startdatum." },
        { "title": "Wij bespreken het werk", "body": "Wij nemen contact met u op over de taken, de werktijden en de eisen aan de mensen." },
        { "title": "Wij stellen kandidaten voor", "body": "U krijgt kandidaten die passen bij het werk, met hun ervaring en hun certificaten." },
        { "title": "De medewerker begint", "body": "Groos regelt het contract en het loon, en wij houden contact met u zolang de inzet loopt." }
      ]
    },
    "wtta": {
      "meta": {
        "title": "Inlenen en de Wtta",
        "description": "Vanaf 2028 mag u alleen inlenen bij een toegelaten uitlener. Lees wat de Wtta voor uw bedrijf betekent en hoe u de status van een uitzendbureau controleert."
      },
      "reviewed": "Deze pagina is bijgewerkt op {date}.",
      "pastLabel": "Deze datum is voorbij."
    }
  },
  "beroepen": {
    "glazenwasser": {
      "enkelvoud": "Glazenwasser",
      "meervoud": "Glazenwassers",
      "jobseeker": { "summary": "Je maakt ramen en gevels schoon, deels op hoogte. Je werkt meestal overdag in een vaste ploeg." },
      "employer": { "summary": "Wij leveren glazenwassers voor uw routes en objecten. Wij bespreken vooraf welke certificaten het werk vraagt." }
    },
    "schoonmaker": {
      "enkelvoud": "Schoonmaker",
      "meervoud": "Schoonmakers",
      "jobseeker": { "summary": "Je houdt kantoren, scholen of woningen schoon. Je werkt vroeg, in de avond of overdag." },
      "employer": { "summary": "Wij leveren schoonmakers voor vaste objecten, vervanging en opleveringen. Wij stemmen de werktijden vooraf met u af." }
    },
    "logistiek-medewerker": {
      "enkelvoud": "Logistiek medewerker",
      "meervoud": "Logistiek medewerkers",
      "jobseeker": { "summary": "Je pakt orders, laadt en lost, en houdt het magazijn op orde. Je werkt vaak in een vroege of late dienst." },
      "employer": { "summary": "Wij leveren orderpickers, magazijnmedewerkers en heftruckchauffeurs voor uw ploegen. Wij bespreken vooraf de diensten en certificaten." }
    },
    "verhuizer": {
      "enkelvoud": "Verhuizer",
      "meervoud": "Verhuizers",
      "jobseeker": { "summary": "Je pakt in, draagt en zet alles op het nieuwe adres weer neer. Je begint vroeg en werkt in een ploeg." },
      "employer": { "summary": "Wij leveren verhuizers en bijrijders voor drukke dagen en de zomer. Wij zoeken mensen die netjes werken bij uw klanten thuis." }
    },
    "hulpkracht-bouw-en-sloop": {
      "enkelvoud": "Hulpkracht bouw en sloop",
      "meervoud": "Hulpkrachten bouw en sloop",
      "jobseeker": { "summary": "Je helpt vakmensen op de bouwplaats of bij sloopwerk. Je werkt buiten in een ploeg, meestal vanaf 07.00 uur." },
      "employer": { "summary": "Wij leveren hulpkrachten, oppermannen en slopers voor uw project. Wij bespreken vooraf welke certificaten nodig zijn." }
    },
    "og": {
      "werkzoekende": "Werken als {occupation} in Den Haag",
      "werkgever": "{occupationPlural} voor uw bedrijf in Den Haag"
    },
    "ui": {
      "factsLabel": "Kort overzicht",
      "wageFactLabel": "Uurloon (indicatie)",
      "wage": {
        "badge": "Indicatie",
        "rangeLabel": "Bruto uurloon zonder ervaring, voor 21 jaar en ouder",
        "experiencedLabel": "Met ervaring",
        "source": "Bron: {source}. Gecontroleerd op {date}.",
        "disclaimerJobseeker": "Dit is een indicatie en geen loonbelofte. Je uurloon staat altijd in de vacature."
      },
      "need": {
        "always": "Altijd nodig",
        "often": "Vaak gevraagd",
        "sometimes": "Soms gevraagd",
        "plus": "Een pluspunt"
      },
      "careerListLabel": "Groeipad",
      "vacancies": {
        "listLabel": "Vacatures als {occupation}",
        "listLabelAll": "Nieuwste vacatures",
        "count": "{count, plural, =0 {Er staan nu geen vacatures open.} one {Er staat # vacature open.} other {Er staan # vacatures open.}}",
        "viewAllLink": "Alle vacatures voor dit beroep",
        "viewAllLinkAll": "Bekijk alle vacatures",
        "loadError": "De vacatures laden nu niet. Ze staan wel op de vacaturepagina."
      }
    }
  }
}
```

### 6.3 Sleutelboom EN

```json
{
  "werkzoekenden": {
    "meta": {
      "title": "Find work through Groos",
      "description": "This is how you find hands-on work in and around The Hague through Groos. Read how applying works, what you earn and what your rights are."
    },
    "steps": {
      "title": "From your application to",
      "accent": "your first working day",
      "intro": "At every step you know what happens and who you can call.",
      "items": [
        { "title": "You apply or register", "body": "You can use the form, send us a WhatsApp message or call us, also without a CV." },
        { "title": "We call you", "body": "Jimmy or Lorenzo calls you to get to know you and to hear what work you are looking for." },
        { "title": "You hear what the work is", "body": "Before you start, you hear the tasks, the working hours, the gross hourly wage and what to bring." },
        { "title": "You start working", "body": "On your first day you know where to go and who to call if you have a question." }
      ]
    }
  },
  "werkgevers": {
    "meta": {
      "title": "Hire staff in The Hague",
      "description": "Groos provides workers for window cleaning, cleaning, logistics, removals, construction and demolition in The Hague. Request staff with no obligation."
    },
    "steps": {
      "title": "From your request to",
      "accent": "the first working day",
      "intro": "At every step you deal with the same person.",
      "items": [
        { "title": "You tell us who you need", "body": "You call us or fill in the request with the occupation, the number of people and the start date." },
        { "title": "We discuss the work", "body": "We contact you about the tasks, the working hours and the requirements for the people." },
        { "title": "We propose candidates", "body": "You receive candidates who suit the work, with their experience and their certificates." },
        { "title": "The worker starts", "body": "Groos arranges the contract and the pay, and we stay in touch with you for as long as the assignment runs." }
      ]
    },
    "wtta": {
      "meta": {
        "title": "Hiring and the Wtta",
        "description": "From 2028 you may only hire staff from an admitted labour provider. Read what the Wtta means for your business and how to check the status of an agency."
      },
      "reviewed": "This page was last updated on {date}.",
      "pastLabel": "This date has passed."
    }
  },
  "beroepen": {
    "glazenwasser": {
      "enkelvoud": "Window cleaner",
      "meervoud": "Window cleaners",
      "jobseeker": { "summary": "You clean windows and facades, partly at height. You usually work during the day in a regular team." },
      "employer": { "summary": "We provide window cleaners for your rounds and sites. We agree in advance which certificates the work requires." }
    },
    "schoonmaker": {
      "enkelvoud": "Cleaner",
      "meervoud": "Cleaners",
      "jobseeker": { "summary": "You keep offices, schools or homes clean. You work early, in the evening or during the day." },
      "employer": { "summary": "We provide cleaners for regular sites, cover and handovers. We agree the working hours with you in advance." }
    },
    "logistiek-medewerker": {
      "enkelvoud": "Logistics worker",
      "meervoud": "Logistics workers",
      "jobseeker": { "summary": "You pick orders, load and unload, and keep the warehouse tidy. You often work an early or late shift." },
      "employer": { "summary": "We provide order pickers, warehouse workers and forklift drivers for your teams. We discuss shifts and certificates in advance." }
    },
    "verhuizer": {
      "enkelvoud": "Mover",
      "meervoud": "Movers",
      "jobseeker": { "summary": "You pack, carry and set everything up again at the new address. You start early and work in a team." },
      "employer": { "summary": "We provide movers and drivers' mates for busy days and the summer. We look for people who work carefully in your customers' homes." }
    },
    "hulpkracht-bouw-en-sloop": {
      "enkelvoud": "Construction and demolition labourer",
      "meervoud": "Construction and demolition labourers",
      "jobseeker": { "summary": "You help skilled workers on the building site or with demolition work. You work outside in a team, usually from 07:00." },
      "employer": { "summary": "We provide labourers, bricklayers' mates and demolition workers for your project. We discuss in advance which certificates are needed." }
    },
    "og": {
      "werkzoekende": "Work as a {occupation} in The Hague",
      "werkgever": "{occupationPlural} for your business in The Hague"
    },
    "ui": {
      "factsLabel": "At a glance",
      "wageFactLabel": "Hourly wage (indication)",
      "wage": {
        "badge": "Indication",
        "rangeLabel": "Gross hourly wage without experience, aged 21 and over",
        "experiencedLabel": "With experience",
        "source": "Source: {source}. Checked on {date}.",
        "disclaimerJobseeker": "This is an indication, not a promised wage. Your hourly wage is always stated in the job."
      },
      "need": {
        "always": "Always required",
        "often": "Often asked for",
        "sometimes": "Sometimes asked for",
        "plus": "A plus"
      },
      "careerListLabel": "Career path",
      "vacancies": {
        "listLabel": "Jobs as a {occupation}",
        "listLabelAll": "Latest jobs",
        "count": "{count, plural, =0 {There are no open jobs right now.} one {There is # open job.} other {There are # open jobs.}}",
        "viewAllLink": "All jobs in this occupation",
        "viewAllLinkAll": "View all jobs",
        "loadError": "The jobs are not loading right now. You can still find them on the jobs page."
      }
    }
  }
}
```

Opmerkingen bij de sleutels:

- `beroepen.<id>.enkelvoud` en `.meervoud` beginnen met een hoofdletter (spec 01 §6, spec 03 §6.8); in een zin `toLocaleLowerCase(locale)`. De Engelse naam van `hulpkracht-bouw-en-sloop` is "Construction and demolition labourer", gelijk aan `occupations.name_en` (spec 10) en de woordenlijst van spec 03; de voorbeeldwaarde "helper" uit spec 01 §6 vervalt (§12).
- `beroepen.<id>.jobseeker.summary` en `.employer.summary` mag ook spec 04 lezen voor de homepage.
- `beroepen.og.werkzoekende` en `beroepen.og.werkgever` zijn de koppen van de OG-afbeeldingen van de beroepspagina's (spec 12) en de `alt` van die afbeeldingen (§7.1). `{occupation}` is de enkelvoudsnaam met kleine eerste letter (`tb(\`${id}.enkelvoud\`).toLocaleLowerCase(locale)`); `{occupationPlural}` is de meervoudsnaam zoals hij in `beroepen.<id>.meervoud` staat, dus met hoofdletter aan het begin van de kop. De Engelse naam van de hulpkracht is overal "Construction and demolition labourer" en "Construction and demolition labourers".
- De lijst `BEROEP_SLEUTELS` die spec 14 in K2 controleert, is per id: `beroepen.<id>.enkelvoud`, `beroepen.<id>.meervoud`, `beroepen.<id>.jobseeker.summary`, `beroepen.<id>.employer.summary`.
- `werkgevers.wtta.reviewed` staat in de u-zone maar bevat geen voornaamwoord; `werkzoekenden.steps.items[1].body` noemt de voornamen, wat een feit is (B-21, claim A).
- Geen van deze namespaces hoeft naar de client; `CLIENT_NAMESPACES` (spec 01 §4.11.4) blijft ongewijzigd.

### 6.4 Feiten per beroep (bron: context/01, peildatum 2 oktober 2026)

Deze tabel is bindend voor de getallen in `content/beroepen/<id>.ts`. Bedragen zijn bruto per uur voor 21 jaar en ouder, in de notatie van spec 03 §6.6 via `formatEuro`.

| Id | `wage.starter` | `wage.experienced` | `tableDate` | `sourceLabel` (nl) | `reviewBy` | `minAge18` |
|---|---|---|---|---|---|---|
| `glazenwasser` | 16,08 tot 16,70 | 17,70 tot 18,44 | 2026-01-01 | loontabel van de cao Schoonmaak- en Glazenwassersbedrijf, Glazenwasser I en II, per 1 januari 2026 | 2027-01-01 | `work_at_height` |
| `schoonmaker` | 15,52 tot 16,08 | 17,05 tot 17,70 | 2026-01-01 | loontabel van de cao Schoonmaak- en Glazenwassersbedrijf, loongroep 1 en 2, per 1 januari 2026 | 2027-01-01 | null |
| `logistiek-medewerker` | 14,99 tot 16,50 | 15,50 tot 18,00 (heftruck en reachtruck) | 2026-07-01 | vacatures in Den Haag en het Westland in oktober 2026 en het wettelijk minimumloon per 1 juli 2026 | 2027-01-01 | `forklift` (alleen voor wie op een heftruck of reachtruck rijdt) |
| `verhuizer` | 14,99 tot 16,00 | 16,00 tot 20,00 | 2026-07-01 | functieloonschalen van de cao Beroepsgoederenvervoer per 1 januari 2026 en het wettelijk minimumloon per 1 juli 2026 | 2027-01-01 | null |
| `hulpkracht-bouw-en-sloop` | 15,98 tot 17,00 | 19,00 tot 21,50 | 2026-07-01 | starttabel en garantielonen van de cao Bouw en Infra per 1 juli 2026 | 2027-01-01 | `construction_demolition` |

`checkedAt` is voor alle vijf `2026-10-02`. `sourceUrl` is de eerste bron uit context/01 §Bronnen voor die cao. De zin `wage.extra` noemt toeslagen alleen in algemene termen ("Voor werk in de avond, de nacht of het weekend gelden vaak toeslagen."); percentages uit een cao staan er niet in, omdat ze per opdrachtgever verschillen. De bron noemt een branche-cao als herkomst van het getal; de tekst zegt nergens dat Groos een cao toepast (CL-03, §12).

Leeftijdszinnen (`requirements.minAgeNote`), letterlijk in deze strekking (VR-02): glazenwasser "Omdat je op hoogte werkt, moet je minimaal 18 jaar zijn."; hulpkracht "Omdat je in de bouw en sloop werkt, moet je minimaal 18 jaar zijn."; logistiek medewerker "Rij je op een heftruck of reachtruck, dan moet je daarvoor minimaal 18 jaar zijn."

### 6.5 Overzichtspagina's: voorbeeldcopy

**`/werkzoekenden` (je, B1)**

- h1: "Praktisch werk in Den Haag, met een vaste contactpersoon"
- Lead: "Wij helpen je aan werk als glazenwasser, schoonmaker, logistiek medewerker, verhuizer of hulpkracht in de bouw en sloop. Solliciteren is gratis en kan ook zonder cv."
- Wat je krijgt (`promises`, kop "Wat je van ons" plus accent "mag verwachten"), items met claimstatus: "Solliciteren kost niets" (A), "Hetzelfde loon als vaste collega's" (A), "Je uurloon staat bij elke vacature" (A), "Eén vaste contactpersoon" (A), "Weekloon" (`claim: "weeklyPay"`), "Hulp bij certificaten" (`claim: "certificateSupport"`).
- Je rechten (`rights`, kop "Dit zijn je rechten" plus accent "als uitzendkracht"): uitzendovereenkomst met uitleg in dezelfde zin, gelijk loon, 8 procent vakantiegeld, kosteloze beschermingsmiddelen, nooit geld voor werk, je ID en BSN laat je pas bij de start zien en nooit online (VR-11), ziek melden bij Groos en bij het bedrijf waar je werkt.
- FAQ (strekking context/13 §7.1, eigen woorden): Kost solliciteren iets? Heb ik een cv nodig? Moet ik Nederlands spreken? Wat voor contract krijg ik? Krijg ik vakantiegeld? Welke papieren heb ik nodig om te beginnen? Wat gebeurt er als de opdracht stopt? Regelen jullie huisvesting? (antwoord met `claim: "housing"`; zonder bevestiging valt de vraag weg).
- Afsluiter: titel "Klaar voor", accent "je volgende baan?", body "Solliciteer in een paar minuten, ook zonder cv. Jimmy of Lorenzo belt je om kennis te maken."

**`/werkgevers` (u)**

- h1: "Personeel voor praktisch werk in Den Haag en omgeving"
- Lead: "Wij leveren glazenwassers, schoonmakers, logistiek medewerkers, verhuizers en hulpkrachten in de bouw en sloop. U regelt uw aanvraag met één vast aanspreekpunt in Den Haag."
- Wat Groos levert (`supply`): "Eén vaste contactpersoon" (A), "Kandidaten na een gesprek" (`claim: "personalIntake"`), "Contract en loon via Groos" (A: Groos is werkgever van de uitzendkracht), "Vervanging bij uitval" (`claim: "replacement"`). De renderer filtert met `withConfirmedClaims`, zodat `supply` zolang de vlaggen onwaar zijn alleen de A-items toont ("Eén vaste contactpersoon" en "Contract en loon via Groos").
- Uitzenden in het kort (`agency`, `FactSheet`): Werkgever van de medewerker: "Groos Personeelsdiensten, u geeft leiding op de werkplek."; Wanneer handig: "Bij drukte, seizoenswerk, vervanging of als u eerst wilt zien of iemand past."; Hoe u betaalt: "Een uurtarief over de gewerkte uren, volgens een voorstel vooraf."; Veiligheid op de werkplek: "Volgens de Arbowet zorgt u als inlener voor instructie en een veilige werkplek."
- Zekerheid (`legal`): gelijkwaardige beloning met uitleg (B-24); inlenersaansprakelijkheid in het algemeen ("Als inlener bent u volgens de Invorderingswet aansprakelijk voor loonheffingen en btw die een uitlener niet afdraagt."); de zin over gelijke behandeling uit spec 09 §6.8; link "Lees wat de Wtta voor inleners betekent" naar `/werkgevers/wtta`. Geen g-rekening, keurmerk of verzekering (CL-01, CL-22).
- FAQ (strekking context/13 §7.2): Wat kost een uitzendkracht? (AS-09, zonder factor) Voor hoe lang kan ik iemand inhuren? Wie is mijn contactpersoon? Wie zorgt voor veiligheid op de werkplek? Spreken uw medewerkers Nederlands? Hoe gaat Groos om met gelijke behandeling? Hoe snel kunt u iemand sturen? (`claim: "responseTime"`; het antwoord noemt alleen de reactietermijn en zegt dat de start afhangt van beroep, werktijden en certificaten; een levertermijn vraagt `deliverySpeed`, B-49) Betaal ik als er niemand start? (`claim: "noStartNoCost"`).
- Afsluiter: titel "Heeft u", accent "binnenkort extra mensen nodig?", body "Vertel ons wie u zoekt en vanaf wanneer. Wij nemen contact met u op om de aanvraag door te nemen."

**Vergelijking (`compare`, op beide pagina's)**: caption "Wat Groos doet voor werkzoekenden en werkgevers". Rijen zonder je of u: Wat Groos doet ("Werk zoeken dat past bij ervaring, uren en woonplaats" tegenover "Mensen zoeken die passen bij het werk en de werktijden"); Kosten ("Gratis, ook inschrijven" tegenover "Een uurtarief over gewerkte uren"); Contract ("Uitzendovereenkomst met Groos" tegenover "Afspraken met Groos over de inzet"); Contact ("Jimmy of Lorenzo, op hun eigen nummer" in beide kolommen); Eerste stap ("Solliciteren of inschrijven" tegenover "Personeel aanvragen of bellen").

**`/werkgevers/wtta` (u)**

- h1: "Wat de Wtta betekent als u personeel inleent"
- Lead: "Vanaf 1 januari 2028 mag u alleen nog inlenen bij een uitlener met een toelating. Op deze pagina leest u wat er verandert en hoe u een uitzendbureau controleert."
- Wat de Wtta is: twee alinea's. Strekking: de Wet toelating terbeschikkingstelling van arbeidskrachten voegt een toelatingsplicht toe aan de Waadi; de Nederlandse Autoriteit Uitleenmarkt beoordeelt uitleners op onder meer loonheffingen, identificatie, een waarborgsom en een inspectierapport; de huidige registratieplicht bij de KvK vervalt op 1 januari 2028.
- Tijdlijn (`timeline.items`, letterlijk deze feiten):

| `date` | `dateLabel` | Titel (strekking) | Bron |
|---|---|---|---|
| 2026-11-01 | 1 november tot en met 31 december 2026 | Aanmelden voor de overgangsregeling | toelatinguitleenmarkt.nl, geraadpleegd 2 oktober 2026 |
| 2027-01-01 | | De Wtta treedt in werking | wetten.overheid.nl, geraadpleegd 2 oktober 2026 |
| 2027-05-01 | 1 mei tot en met 30 juni 2027 | Uitleners vragen hun toelating aan | toelatinguitleenmarkt.nl |
| 2027-07-01 | | Het openbare register gaat online | toelatinguitleenmarkt.nl |
| 2028-01-01 | | Handhaving start; inlenen mag alleen bij een toegelaten uitlener, een uitlener met ontheffing of een uitlener onder de overgangsregeling | toelatinguitleenmarkt.nl (inleners) |
| 2028-01-01 | | De Waadi-registratie bij de KvK vervalt | wetten.overheid.nl |

- Wat u regelt (`hirer`): vóór de start vastleggen welke medewerker via welke uitlener werkt; de status van de uitlener controleren in het openbare register vanaf 1 juli 2027, met meldingen bij een wijziging; in het contract afspreken dat de toelating de hele looptijd geldig blijft en wat er gebeurt als die vervalt; dezelfde controle bij doorlenen.
- Controleren (`check.steps`): "Zoek de uitlener op in het register", "Bekijk de status en de datum", "Zet een melding aan bij wijzigingen".
- Status van Groos: kop "Waar Groos nu staat", intro "Hieronder staat de actuele fase van Groos Personeelsdiensten. Wij passen deze tekst aan zodra er iets verandert." Daaronder alleen `WttaStatus`.
- Aansprakelijkheid: twee alinea's over inlenersaansprakelijkheid (art. 34 Invorderingswet) en de g-rekening in het algemeen, zonder te zeggen dat Groos er een heeft (CL-22).
- FAQ: Vanaf wanneer moet ik controleren? Wat gebeurt er als ik inleen bij een uitlener zonder toelating? (strekking: boete en stoppen; de bedragen staan in nog vast te stellen beleidsregels, dus geen bedrag noemen) Geldt de Wtta ook voor één uitzendkracht voor één dag? Wat is de overgangsregeling? Waar vind ik het register?
- Bronnen: toelatinguitleenmarkt.nl (uitleners en inleners), wetten.overheid.nl (Waadi, hoofdstuk 3a), Belastingdienst (inlenersaansprakelijkheid). Intro: "Wij hebben deze bronnen geraadpleegd op 2 oktober 2026."
- Afsluiter: titel "Vragen over inlenen", accent "via Groos?", body "Bel of mail ons. Wij leggen u uit hoe wij werken en wat u vooraf van ons krijgt."
- `reviewedAt`: `2026-10-02`. Werk de pagina bij na elke mijlpaal en uiterlijk op 31 december 2026; `TODO` in een commentaar boven `reviewedAt`.

### 6.6 Contentbrieven per beroep

Elke schrijf-sub-agent gebruikt het sjabloon van spec 03 §10.3 en vult het met de regels hieronder. Zinnen hieronder zijn voorbeeldcopy; de schrijver mag ze verbeteren, maar houdt de strekking, de claimstatus en de getallen.

**Gemeenschappelijk voor alle vijf**

- Routes: `/werken-als/<slugWerkzoekende>` en `/werkgevers/<slugWerkgever>`, plus `/en`.
- Bestand: `content/beroepen/<id>.ts`, blokken `nl.jobseeker`, `nl.employer`, daarna `en.jobseeker`, `en.employer`.
- Vorm: `jobseeker` je-vorm B1 (spec 03 §6.4), `employer` u-vorm. Wij voor Groos, nooit "we".
- Lengtes: zie spec 03 §6.12, en totaal per perspectief 500 tot 800 woorden inclusief de gedeelde stappen (die tellen voor ongeveer 60 woorden).
- Sjablonen: lead AS-02, sectie-intro ZS-06, FAQ AS-08 en AS-09, afsluiter AS-11 met vraagkop, metabeschrijving ZS-15. Werkzoekenden: geen ZS-13, AS-05 of AS-06. Werkgevers: hoogstens één risicozin per pagina.
- Claims: alleen categorie A en B uit spec 03 §6.11 als gewone tekst. Elke zin over weekloon, hulp bij certificaten, vervoer, huisvesting, reactietijd, vervanging, screening als belofte of "niets betalen als niemand start" krijgt een `claim`-veld of komt niet in de tekst.
- Verboden: geen tekst van Wilk of J. Versseput (ook de voorbeeldzinnen uit context/01 §Voorbeeldcopy niet letterlijk), geen opdrachtgevernamen (VR-15), geen "fysiek sterk" (schrijf de belasting concreet, VR-04), geen "asbest" behalve de stopregel bij bouw en sloop (VR-13), geen plaatsnamen buiten Den Haag behalve als soort werkplek zonder claim ("bedrijventerreinen rond Den Haag"). Koppen nooit 'Wat ga je doen', 'Wat vragen wij', 'Wat bieden wij' of 'Interesse' (structuurlabels van Wilk, R-08); de kop van `requirements` begint met 'Wat je meebrengt'.
- Zoektermen: de termen uit context/01 §Zoektermen van dat beroep in h1, eerste alinea, één h2 en de metabeschrijving; synoniemen uit spec 03 §6.8 hoogstens twee keer per pagina.
- FAQ: werkzoekende 6 of 7 vragen waarvan minstens 4 met `specific: true`; werkgever 6 tot 8 vragen waarvan minstens de helft `specific: true`. Algemene vragen (kosten, cv, gelijk loon, tarief, contactpersoon) schrijft de schrijver opnieuw voor dit beroep, met een detail van dit beroep in het antwoord.
- Metatitels: de rij Metatitel in de tabellen hieronder is de enige bron van de metatitels per beroep; spec 12 §6.3 verwijst ernaar. Metabeschrijvingen volgen de sjablonen van §7.1, behalve de werkgeversbeschrijvingen van glazenwassers en verhuizers in de rij Metabeschrijving.
- Ander perspectief: de werkzoekendepagina is een je-zone en de werkgeverspagina een u-zone, dus de verwijzing naar de andere doelgroep staat zonder voornaamwoord. Werkzoekende: "Personeel zoeken voor een {sector}bedrijf? Lees wat Groos voor opdrachtgevers doet." met linklabel "Naar de pagina voor werkgevers". Werkgever: "Zelf werk zoeken als {enkelvoud}? Op de pagina voor werkzoekenden staat alles over het werk." met linklabel "Naar de pagina voor werkzoekenden".

**Glazenwasser** (`glazenwasser`; zoektermen: glazenwasser vacature den haag, glazenwasser worden, werk als glazenwasser, glazenwasser zonder ervaring)

| Veld | Werkzoekende (je) | Werkgever (u) |
|---|---|---|
| h1 | Werken als glazenwasser in Den Haag | Uitzendkrachten voor uw glazenwassersbedrijf in Den Haag |
| Metatitel | Werken als glazenwasser in Den Haag | Personeel voor glazenwasserijen in Den Haag; EN: Staff for window cleaning companies in The Hague |
| Metabeschrijving | sjabloon werkzoekende uit §7.1 | Zoekt u personeel voor uw glazenwasserij in Den Haag en omgeving? Groos levert glazenwassers voor een dag, een paar weken of langer. Vraag personeel aan. (153 tekens) |
| Lead | Als glazenwasser maak je ramen, kozijnen en gevels van kantoren, winkels en woningen schoon. Je werkt meestal overdag in een ploeg, deels op hoogte met ladder, telescoopsysteem of hoogwerker. | U wilt glazenwassers die veilig op hoogte werken en uw route zelfstandig kunnen rijden. Wij zoeken de mensen en bespreken vooraf welke certificaten en ervaring het werk vraagt. |
| Taken | glas binnen en buiten wassen; werken met een telescopisch wassysteem met osmosewater; werken vanaf ladder of hoogwerker; zonnepanelen en dakgoten reinigen; bus en materiaal netjes houden; klanten netjes te woord staan | idem in u-perspectief ("Uw medewerker wast glas ...") |
| Werkplekken of opdrachtgevers | kantoren, winkelstraten, woonwijken, hoogbouw | glazenwassers- en gevelonderhoudsbedrijven, schoonmaakbedrijven met glasbewassing, bedrijven in zonnepaneelreiniging, facilitaire dienstverleners |
| Eisen | je hebt geen last van hoogtevrees; rijbewijs B als je de bus rijdt; je spreekt genoeg Nederlands of Engels voor veiligheidsinstructies; minAgeNote | n.v.t. |
| Werktijden en drukte | start meestal om 07.00 uur; voorjaar en zomer zijn het drukst; bij vorst, harde wind of zware regen wordt minder gewerkt | piek in voorjaar en zomer; weersafhankelijk plannen; vroege starts bij winkels en kantoren |
| Certificaten | VCA Basis (vaak); IPAF bij werken met een hoogwerker (soms, 1 dag, 5 jaar geldig); rijbewijs B (vaak); RAS-basisvakopleiding glasbewassing (TODO bevestigen of dit voor uitzendkrachten via Groos geldt) | dezelfde lijst, per kandidaat besproken |
| Doorgroei | Glazenwasser, Allround glazenwasser, Gevelbehandelaar, Meewerkend voorman | n.v.t. |
| Waarom-kop | "Werk op hoogte met" plus "duidelijke afspraken" | "Glazenwassers die u" plus "op hoogte kunt inzetten" |
| Specifieke FAQ | Moet ik tegen hoogte kunnen? Werk ik ook als het regent of vriest? Heb ik een rijbewijs nodig? Wat is IPAF en wanneer heb ik het nodig? | Hebben uw glazenwassers VCA en IPAF? (per kandidaat) Kan de medewerker zelf de bus rijden? Wat als het weer tegenzit? Hoe lang mag ik een uitzendkracht inlenen in de glazenwassersbranche? (TODO laten toetsen tegen de cao 2026-2028) |
| CTA-kop | "Wil je werken als glazenwasser" plus "in een vaste ploeg?" | "Extra glazenwassers nodig" plus "voor het voorjaar?" |

**Schoonmaker** (`schoonmaker`; zoektermen: schoonmaker vacature den haag, schoonmaakwerk avond, schoonmaakwerk ochtend, schoonmaakwerk weekend)

| Veld | Werkzoekende (je) | Werkgever (u) |
|---|---|---|
| h1 | Werken als schoonmaker in Den Haag | Schoonmaakpersoneel voor uw bedrijf in Den Haag |
| Metatitel | Werken als schoonmaker in Den Haag | Schoonmakers inhuren in Den Haag; EN: Hire cleaners in The Hague |
| Lead | Als schoonmaker houd je kantoren, scholen, hotels of nieuwe woningen schoon. Je werkt vaak vroeg in de ochtend of in de avond, en soms in het weekend. | U zoekt schoonmakers voor vroege of late diensten, voor vervanging of voor een oplevering. Wij zoeken de mensen en stemmen de werktijden en de startdatum met u af. |
| Taken | bureaus, vloeren en sanitair schoonmaken; pantry's bijvullen; stofzuigen en dweilen; algemene ruimtes bijhouden; bouwstof en verfspatten verwijderen bij een oplevering | idem in u-perspectief |
| Werkplekken of opdrachtgevers | kantoren, scholen, zorginstellingen, hotels, nieuwbouwwoningen | schoonmaakbedrijven, hotels, zorg en onderwijs, woningcorporaties en VvE-beheerders, bouwbedrijven voor opleveringen |
| Eisen | je werkt zelfstandig en betrouwbaar, vaak alleen in een pand; je kunt vroeg of laat werken; je spreekt genoeg Nederlands of Engels voor de instructies en de middelen | n.v.t. |
| Werktijden en drukte | ochtend ongeveer 05.00 tot 09.00 uur, avond ongeveer 17.00 tot 22.00 uur; drukker in de zomervakantie, bij opleveringen en rond de maandwisseling | idem plus vervanging bij vakantie en ziekte |
| Certificaten | geen diploma nodig; VOG soms bij scholen, zorg en ambassades; VCA Basis bij opleveringen op een bouwplaats; RAS-basisvakopleiding (TODO bevestigen) | idem |
| Doorgroei | Schoonmaker, Allround schoonmaker, Vloerenspecialist, Meewerkend voorman, Objectleider | n.v.t. |
| Waarom-kop | "Uren die passen bij" plus "je eigen week" | "Schoonmakers die passen bij" plus "uw objecten en tijden" |
| Specifieke FAQ | Kan ik alleen 's ochtends of 's avonds werken? Kan ik meer uren krijgen door adressen te combineren? (antwoord B: "Wij kijken met je mee", geen garantie) Heb ik een VOG nodig? Krijg ik extra geld voor avond- of weekendwerk? | Mag ik als groot schoonmaakbedrijf uitzendkrachten inzetten? (TODO 7,5 procent-regel en 12 maanden laten toetsen) Heeft de medewerker een VOG? Werken uw mensen ook vroeg of laat? Kunt u vervanging leveren bij ziekte? (`claim: "replacement"`) |
| CTA-kop | "Zoek je schoonmaakwerk" plus "dat bij je dag past?" | "Een schoonmaker nodig" plus "voor vervanging of oplevering?" |

**Logistiek medewerker** (`logistiek-medewerker`; zoektermen: orderpicker vacature den haag, magazijnmedewerker vacature den haag, heftruckchauffeur vacatures den haag, logistiek medewerker vacature)

| Veld | Werkzoekende (je) | Werkgever (u) |
|---|---|---|
| h1 | Werken als logistiek medewerker in Den Haag | Logistiek personeel voor uw magazijn of distributiecentrum |
| Metatitel | Werken als logistiek medewerker in Den Haag | Logistiek medewerkers inhuren in Den Haag; EN: Hire logistics workers in The Hague |
| Lead | Als logistiek medewerker zorg je dat goederen op de juiste plek komen, van orderpicken tot laden en lossen. Je werkt in een magazijn of distributiecentrum, vaak in een vroege of late dienst. | U zoekt orderpickers, magazijnmedewerkers of heftruckchauffeurs voor uw vaste ploeg of een drukke periode. Wij zoeken de mensen en bespreken vooraf de diensten, de certificaten en de startdatum. |
| Taken | orders verzamelen met een scanner; vrachtwagens laden en lossen; inpakken en labelen; rijden met een elektrische pallettruck of heftruck; voorraad tellen; in de bloemenhandel karren klaarzetten | idem |
| Werkplekken of opdrachtgevers | distributiecentra, groothandels, webwinkels, bloemen- en plantenhandel | logistieke dienstverleners, groothandels en foodservice, distributiecentra, bloemen- en plantenexporteurs |
| Eisen | je kunt de hele dienst staan en lopen en regelmatig tillen; je kunt in een vroege of late dienst werken; je spreekt genoeg Nederlands of Engels voor de veiligheidsinstructies; minAgeNote | n.v.t. |
| Werktijden en drukte | twee- of drieploegendienst; in de bloemenhandel begin je soms om 05.00 uur; het drukst in het vierde kwartaal en rond Valentijnsdag en Moederdag | idem; opschalen in pieken |
| Certificaten | EPT (vaak, 1 dag); heftruck of reachtruck (vaak bij rijdende functies, 1 dag); VCA zelden | idem; "Heeft de kandidaat geen certificaat, dan bespreken wij met u hoe dat geregeld wordt." (hulp door Groos alleen met `certificateSupport`) |
| Doorgroei | Orderpicker, EPT-chauffeur, Heftruck- of reachtruckchauffeur, Allround magazijnmedewerker, Teamleider | n.v.t. |
| Waarom-kop | "Weten wat je verdient" plus "voor elke dienst" | "Magazijnpersoneel dat meedraait" plus "in uw ploegen" |
| Specifieke FAQ | Kan ik beginnen zonder heftruckcertificaat? Hoe vroeg begin ik? Werk ik in ploegen? Hoe kom ik op een bedrijventerrein zonder auto? (antwoord per vacature; vervoer alleen met `claim: "transport"`) | Kunnen uw mensen heftruck of reachtruck rijden? Kunt u extra mensen leveren in het vierde kwartaal? (geen termijn; een levertermijn alleen met `claim: "deliverySpeed"`) Werken uw mensen in ploegendienst? Welke beloning krijgt de medewerker? (gelijkwaardige beloning, de cao bij u bepaalt het loon) |
| CTA-kop | "Klaar voor werk" plus "in het magazijn?" | "Meer mensen nodig" plus "in de drukke weken?" |

**Verhuizer** (`verhuizer`; zoektermen: verhuizer vacatures den haag, werken als verhuizer, bijrijder vacatures den haag, verhuishulp bijbaan)

| Veld | Werkzoekende (je) | Werkgever (u) |
|---|---|---|
| h1 | Werken als verhuizer in Den Haag | Verhuizers voor uw verhuisbedrijf in Den Haag |
| Metatitel | Werken als verhuizer in Den Haag | Personeel voor verhuisbedrijven in Den Haag; EN: Staff for removal companies in The Hague |
| Metabeschrijving | sjabloon werkzoekende uit §7.1 | Zoekt u personeel voor uw verhuisbedrijf in Den Haag en omgeving? Groos levert verhuizers voor een dag, een paar weken of langer. Vraag personeel aan. (150 tekens) |
| Lead | Als verhuizer pak je inboedels in, draag je meubels en zet je alles op het nieuwe adres weer neer. Je begint vroeg en werkt in een ploeg, bij mensen thuis of in kantoren. | U heeft rond de maandwisseling of in de zomer meer handen nodig dan uw vaste ploeg. Wij zoeken verhuizers en bijrijders die vroeg beginnen en netjes werken bij uw klanten thuis. |
| Taken | inpakken en uitpakken; meubels demonteren en monteren; dozen en meubels dragen en in de wagen zetten; een verhuislift bedienen na instructie; meerijden en navigeren | idem |
| Werkplekken of opdrachtgevers | woningen, kantoren, scholen, internationale verhuizingen voor expats | verhuisbedrijven, internationale verhuizers, projectverhuizers, woningcorporaties bij renovatie, opslagbedrijven |
| Eisen | je kunt de hele dag tillen en dragen, ook op trappen; je begint vroeg; je werkt netjes bij mensen thuis; rijbewijs B alleen als je de bus rijdt (VR-05) | n.v.t. |
| Werktijden en drukte | start om 07.00 uur of eerder; het drukst aan het eind en het begin van de maand en in de zomer; kantoorverhuizingen vaak in de avond of het weekend | idem; werk vaak per dag of per klus |
| Certificaten | rijbewijs B (een pluspunt); rijbewijs BE of C (een pluspunt, doorgroei); VOG soms bij overheid en ambassades; VCA soms bij projectverhuizingen | idem |
| Doorgroei | Verhuishulp, Verhuizer, Liftbediener of allround verhuizer, Voorman, Projectleider verhuizingen | n.v.t. |
| Waarom-kop | "Hard werken met" plus "een eerlijk uurloon" | "Verhuizers die netjes werken" plus "bij uw klanten thuis" |
| Specifieke FAQ | Hoe zwaar is het werk? Waarom is het rond het einde van de maand zo druk? Heb ik een rijbewijs nodig? Werk ik ook in het weekend? | Heeft u extra mensen rond de maandwisseling? (geen garantie, wel planning vooraf) Kunnen ze een verhuislift bedienen? Kunnen ze de verhuisbus rijden? Spreken uw verhuizers Engels voor expats? (per kandidaat) |
| CTA-kop | "Wil je meehelpen" plus "bij de volgende verhuizing?" | "Extra verhuizers nodig" plus "rond de maandwisseling?" |

**Hulpkracht bouw en sloop** (`hulpkracht-bouw-en-sloop`; zoektermen: opperman vacature, sloper vacature den haag, hulpkracht bouw, bouw vacature zonder ervaring, vca halen den haag)

| Veld | Werkzoekende (je) | Werkgever (u) |
|---|---|---|
| h1 | Werken als hulpkracht in de bouw en sloop in Den Haag | Hulpkrachten voor uw bouwplaats of sloopproject |
| Metatitel | Werken als hulpkracht bouw en sloop in Den Haag; EN: Work as a construction and demolition labourer | Hulpkrachten bouw en sloop inhuren in Den Haag; EN: Hire construction and demolition labourers |
| Lead | Als hulpkracht help je vakmensen op de bouwplaats of bij sloopwerk, bijvoorbeeld met opruimen, materiaal aanvoeren en strippen. Je werkt buiten in een vaste ploeg, meestal van 07.00 tot 16.00 uur. | U zoekt hulpkrachten, oppermannen of slopers die veilig meewerken op uw project. Wij bespreken vooraf welke certificaten nodig zijn en wanneer de ploeg begint. |
| Taken | de bouwplaats opruimen en materiaal aan- en afvoeren; als opperman specie mengen en stenen aangeven; plafonds, vloeren en keukens strippen; sloopafval scheiden; helpen bij grondwerk | idem |
| Werkplekken of opdrachtgevers | nieuwbouw, renovatie van woningen, sloopprojecten, straatwerk | bouwbedrijven en onderaannemers, sloopbedrijven, renovatiebedrijven, stratenmakers, afbouw- en steigerbedrijven |
| Eisen | je werkt buiten in elk seizoen; je kunt de hele dag tillen, bukken en staan; je volgt de veiligheidsregels op de bouwplaats; minAgeNote; vast in de tekst: "Je werkt nooit met asbest. Zie je materiaal dat erop lijkt, dan stop je en meld je het." (VR-13) | de asbestregel in u-vorm |
| Werktijden en drukte | meestal 07.00 tot 16.00 uur; minder werk bij vorst en zware regen; in de bouwvakantie ligt een deel stil, renovatie en sloop lopen vaak door | idem; projectmatig, weken of maanden |
| Certificaten | VCA Basis (vrijwel altijd, ook in het Engels, Pools, Turks of Bulgaars te halen); werkschoenen S3 en andere beschermingsmiddelen (kosteloos, geen certificaat); asbestherkenning (soms, korte cursus) | idem; DAV hoort er niet bij, want hulpkrachten werken niet met asbest |
| Doorgroei | Hulpkracht, Opperman of sloper, Metselaar of stratenmaker na een opleiding, Voorman | n.v.t. |
| Waarom-kop | "Veilig beginnen op" plus "de bouwplaats" | "Hulpkrachten die veilig werken" plus "volgens uw regels" |
| Specifieke FAQ | Heb ik VCA nodig? Werk ik met asbest? (nee) Hoe laat begint een werkdag? Kan ik doorgroeien naar vakman? | Hebben uw hulpkrachten VCA? (per kandidaat) Mogen ze met asbest werken? (nee, nooit) Wie levert de beschermingsmiddelen? (afspraak vooraf; altijd kosteloos voor de medewerker) Kunnen ze weken op hetzelfde project blijven? |
| CTA-kop | "Wil je aan de slag" plus "op de bouwplaats?" | "Hulpkrachten nodig" plus "voor uw volgende project?" |

De h1 van de hulpkracht-werkzoekendepagina telt tien woorden; dat is de grens van spec 03 §6.12.

### 6.7 Regels tegen doorway pages

Deze regels gelden voor de tien beroepspagina's en worden getest (§10 stap 12, AC-05-11 tot en met AC-05-14).

| Nr | Regel | Meting |
|---|---|---|
| D-1 | Lengte per perspectief 500 tot 800 woorden. | Woorden in alle strings van `jobseeker` of `employer` behalve `meta`, plus de gedeelde stappen; daarnaast `main` op de pagina minstens 500 woorden (Playwright, zonder vacaturekaarten). |
| D-2 | Minstens 60 procent unieke tekst ten opzichte van de andere vier pagina's van hetzelfde perspectief. | Vijfwoordsreeksen (kleine letters, leestekens weg, beroepsnamen vervangen door `{beroep}`) uit de content van de pagina; aandeel reeksen dat in geen van de andere vier voorkomt. De gedeelde stappen tellen mee als niet-uniek. |
| D-3 | Eigen h1, metatitel en metabeschrijving per pagina. | Geen twee pagina's met dezelfde waarde. |
| D-4 | Eigen CTA-kop en eigen waarom-kop per pagina. | `cta.title + cta.accent` en `why.title + why.accent` verschillen per pagina, ook nadat de beroepsnaam is vervangen door `{beroep}`. |
| D-5 | Minstens de helft van de FAQ's beroepsspecifiek, en bij werkzoekenden minstens 4. | Telling van `specific: true` na `withConfirmedClaims` met alle vlaggen op `false`. |
| D-6 | Elke pagina heeft beroepsfeiten die nergens anders staan: het loon met bron, de werktijden en de certificaten. | Handmatig in de review van Djulan (spec 03 §10.2 stap 9). |
| D-7 | Geen pagina per beroep en plaats in fase 1. | Er bestaan alleen de routes van §4.1. |

## 7 SEO

### 7.1 Metadata

Elke pagina roept `pageMetadata({ locale, path, title, description, keywords })` uit `lib/seo.ts` aan. `title` is het eigen deel zonder merknaam; `pageMetadata()` zet het merkachtervoegsel met `brandedTitle()` (spec 12). De `generateMetadata` van `/werken-als/[beroep]` en `/werkgevers/[beroep]` roept `pageMetadata({ locale, path, title, description, keywords, image: { url: ogImagePath(locale, path), alt } })` aan, met als `alt` de tekst van `beroepen.og.werkzoekende` (werkzoekende) of `beroepen.og.werkgever` (werkgever), ingevuld met `{ occupation, occupationPlural }` (§6.3). De metatitels per beroep staan in §6.6.

| Route | `title` | `description` | `keywords` | `path` |
|---|---|---|---|---|
| `/werkzoekenden` | `werkzoekenden.meta.title` | `werkzoekenden.meta.description` | geen | `ROUTES.werkzoekenden` |
| `/werken-als/[beroep]` | `copy.jobseeker.meta.title` | `copy.jobseeker.meta.description` | `copy.jobseeker.meta.keywords` | `paths.werkenAls(id)` |
| `/werkgevers` | `werkgevers.meta.title` | `werkgevers.meta.description` | geen | `ROUTES.werkgevers` |
| `/werkgevers/[beroep]` | `copy.employer.meta.title` | `copy.employer.meta.description` | `copy.employer.meta.keywords` | `paths.werkgeverBeroep(id)` |
| `/werkgevers/wtta` | `werkgevers.wtta.meta.title` | `werkgevers.wtta.meta.description` | geen | `ROUTES.wtta` |

Beschrijvingen zijn 120 tot 160 tekens, twee zinnen met een oproep aan het slot, zonder uitroepteken of streepje (C-22). Sjabloon werkzoekende (spec 03 §7): "Wil je werken als {beroep} in Den Haag? Lees wat het werk inhoudt, wat je verdient en hoe laat je begint. Solliciteren kan zonder cv." Met een lange beroepsnaam mag de middelste zin korter. Sjabloon werkgever: "Zoekt u {meervoud} voor uw {soort bedrijf} in Den Haag? Groos levert mensen voor een dag, een paar weken of langer. Vraag vrijblijvend personeel aan." Voor glazenwassers en verhuizers gelden de twee beschrijvingen in §6.6. Canonical naar zichzelf, hreflang nl, en en x-default (allemaal via `pageMetadata`). Alle pagina's zijn indexeerbaar.

### 7.2 JSON-LD

| Pagina | Builders |
|---|---|
| alle vijf typen | `BreadcrumbList` via `Breadcrumbs` (spec 01); de pagina roept `breadcrumbLd` niet zelf aan |
| alle pagina's met FAQ | `<JsonLd data={faqLd(visibleFaq.map(({ q, a }) => ({ q, a })))} />`, met `visibleFaq` exact de lijst die `ServiceFaq` rendert |
| `/werkgevers/[beroep]` | `<JsonLd data={serviceLd({ locale, path: paths.werkgeverBeroep(id), name: copy.employer.hero.title, serviceType: copy.employer.meta.serviceType, description: copy.employer.meta.description })} />`, met `serviceType` zoals "Uitzenden van glazenwassers" |

Geen `JobPosting`, `ItemList` of `Occupation` op deze pagina's (context/10 §3: JobPosting alleen op de vacaturedetail). Geen `EmploymentAgency` (die staat op home en contact, spec 12). Hernoemt spec 12 een builder of wijzigt de signatuur, dan past de bouw-agent alleen de aanroep aan.

### 7.3 Sitemap en `llms.txt`

Spec 01 en 12 nemen `/werkzoekenden`, `/werkgevers`, `/werkgevers/wtta` (uit `STATIC_ROUTES`) en de tien beroepspagina's (uit `beroepen` met `BEROEP_ROUTE_META`) op in beide talen. Deze module voegt niets toe. Voor `llms.txt` levert de beschrijving per beroep `beroepen.<id>.jobseeker.summary` en `.employer.summary` (spec 12 kiest).

### 7.4 Interne links

Elke `/werken-als/<slug>` linkt naar `/werkgevers/<slug>` (PerspectiveLink), `/werkzoekenden` (kruimelpad), `/vacatures?beroep=<id>` en `/inschrijven?beroep=<id>`. Elke `/werkgevers/<slug>` linkt naar `/werken-als/<slug>`, `/werkgevers`, `/werkgevers/personeel-aanvragen` en `/werkgevers/wtta`. De overzichtspagina's linken naar alle vijf beroepspagina's van hun doelgroep (BeroepGrid) en naar elkaar (AudienceCompare).

## 8 Toegankelijkheid en performance

**Structuur**

- Eén h1 per pagina (in `ServiceHero`), h2 per sectie via `SectionHeading`, h3 voor items (kaarten, stappen, certificaten, tijdlijnitems, groepstitels in `ListSection`), zonder overgeslagen niveaus (B-05). FAQ-vragen staan in `<summary>`, niet in een kop.
- Lijsten zijn echte `<ul>` of `<ol>`; de stappen en het groeipad zijn `<ol>`. De vergelijking is een `<table>` met caption en scopes; de tijdlijn gebruikt `<time dateTime>`.
- Nederlandse beroepsnamen in de Engelse tekst krijgen geen `lang`; Nederlandse vaktermen zoals "cao" of "Wtta" worden in de Engelse tekst uitgelegd (spec 03 §6.18).

**Bediening en contrast**

- `ServiceFaq` werkt met Enter en Spatie op de `<summary>` zonder JavaScript.
- Zichtbare focus volgens spec 02 §4.5; geen eigen ring-klassen.
- Kaarten in `BeroepGrid` hebben één link (in de h3, met `after:absolute after:inset-0`) en een zichtbare focusring op de hele kaart via `Card variant="interactive"`; geen geneste links.
- Knoppen minimaal 44 bij 44 px; op 390 px volle breedte.
- Bedragen in `WageIndication` hebben AA-contrast; de badge "Indicatie" is ook tekst, niet alleen kleur. Het voorbehoud staat in gewone tekstgrootte (minimaal 15 px) direct onder het bedrag.
- WhatsApp-knoppen melden het nieuwe venster met `common.opensInNewTab` via `newTabLabel` van `CtaButton`.

**Beweging**

- Alleen `Reveal`, `RevealGroup` en `RevealItem` uit `components/motion/*` (spec 02) met de reduced-motion-terugval; inhoud is nooit afhankelijk van animatie. Het pictogram in `ServiceFaq` draait met `motion-reduce:transition-none`.

**Performance**

- Alle pagina's zijn server components; deze module voegt geen clientcomponent toe (`ServiceFaq` wordt server). De enige client-JavaScript komt uit de layout (spec 01).
- `content/` wordt alleen via de server-only loaders geladen; geen tekst uit `content/` in de clientbundel.
- `/werken-als/[beroep]` en `/werkzoekenden` zijn ISR met `revalidate = 3600` en de tag `vacatures`; de vacaturesectie staat in `<Suspense>` met een skelet van gelijke hoogte (geen CLS). De overige drie routetypes zijn volledig statisch.
- Geen afbeeldingen boven de vouw (B-25); als er later een beeld komt, via `next/image` met `sizes` en `preload` alleen voor het LCP-beeld.
- Doel: Lighthouse mobiel 90 of hoger in alle vier categorieën op `/werken-als/schoonmaker` (poortpagina van spec 14), LCP 2,5 s of minder, CLS 0,1 of minder.

## 9 21st.dev-opdracht voor sub-agents

### 9.1 Werkwijze voor alle sub-agents

De bouw-agent van stap 4 start de zes sub-agents hieronder (§9.2 tot en met §9.4 en §9.6 tot en met §9.8) tegelijk, zodra de componenten van §4.4 met hun props en hun basisopmaak staan. Hij bouwt intussen door op de eigen primitives; de sub-agents leveren alleen een keuze, geen code.

- **Tools laden**: `ToolSearch` met `select:mcp__magic__search,mcp__magic__get_inspiration`.
- **Zoeken**: `mcp__magic__search` met `type: "component"` en `limit: 10`, met elk van de genoemde formuleringen (Engels werkt het best). `mcp__magic__get_inspiration` met de genoemde beschrijvingen. Bij het schrijven van deze spec gaf `get_inspiration` vooral eerdere bladwijzers terug die niet bij de vraag passen; gebruik de uitkomst alleen als die echt over het element gaat. Zoeken op thema's levert niets op (00 §4.6).
- **Selectiecriteria**: minimaal en rustig; witte achtergrond; blauw accent alleen via de tokens van spec 02 (`bg-primary`, `text-primary` en de merktokens); past bij de boodschap van de plek (nuchter, concreet, twee doelgroepen, geen verkooppraat); shadcn-compatibel met Tailwind 4 en `cn()`; toegankelijk (toetsenbord, semantiek, zichtbare focus, doelen van 44 px); server component tenzij interactie echt nodig is; geen nieuwe dependencies (base-ui 1.0.0-rc.0 en lucide 0.456 zijn er al); geen framer-motion of motion; geen glas, gloed, spotlight, raster, marquee, 3D-tilt of gradiëntvlakken (B-29); geen eyebrow of kicker boven koppen.
- **Oplevering** (als tekst aan de bouw-agent): 2 tot 4 kandidaten met id, naam en preview-URL, per kandidaat twee zinnen over wat bruikbaar is en wat niet, één gemotiveerde keuze, en of `get_component` nodig is. Geen bruikbare kandidaat: het advies om op de eigen componenten te bouwen, met de punten die wel inspireren.
- **Vastleggen**: de bouw-agent schrijft per plek de kandidaten (id, naam, preview-URL), de keuze, wel of geen `get_component` en de aanpassingen in `docs/21st-keuzes.md` onder het kopje "Spec 05".
- **Code ophalen**: `mcp__magic__get_component` alleen voor de gekozen kandidaat, hoogstens één keer per plek, en alleen als structuur of interactie echt tijd scheelt.
- **Aanpassingsregels**: kleuren en radius alleen via tokens; componentnamen, props en sectie-id's uit §4 blijven gelijk; alle tekst via props uit messages of `content/` (spec 03 §9: geen demotekst laten staan); `Link` uit `@/i18n/navigation`; iconen uit lucide 0.456 met lijndikte 2; `prefers-reduced-motion` gerespecteerd; koppen volgens B-05.
- **Valt 21st.dev tegen**, dan bouwt de agent op `SectionHeading`, `CtaButton`, `components/motion/*` en de bestaande bouwstenen uit `components/service/`.

### 9.2 `scout-beroephero`: hero van beroeps- en overzichtspagina's (`ServiceHero`)

Boodschap: in één scherm weten wat het werk of de dienst is, met het uurloon of de vrijblijvende aanvraag binnen bereik.

- `search`: "hero section with breadcrumb title and two buttons minimal"; "simple hero text left two call to action buttons"; "hero with stat chips under headline"; "landing hero badges key facts light".
- `get_inspiration`: "minimal white occupation landing page hero for job seekers with breadcrumb, h1, two sentence lead, wage fact chips and apply plus WhatsApp buttons, blue accent"; "B2B staffing service hero with request staff button and phone link, no image".
- Specifiek: geen beeld, geen achtergrondanimatie, feitenchips als lijst, knoppen onder elkaar op mobiel.

| Id | Naam | Preview |
|---|---|---|
| 1122 | Hero with text and two button (tommyjepsen) | https://21st.dev/@tommyjepsen/components/hero-with-text-and-two-button |
| 1160 | Hero with image, text and two buttons (tommyjepsen) | https://21st.dev/@tommyjepsen/components/hero-with-image-text-and-two-buttons |
| 6999 | Hero Minimalism (lyanchouss) | https://21st.dev/@lyanchouss/components/hero-minimalism |
| 10630 | Hero Section (moumensoliman) | https://21st.dev/@moumensoliman/components/hero-section-shadcnui |

### 9.3 `scout-feiten`: kenmerken- en feitenblokken (`ServiceFeatureGrid`, `WageIndication`, `CertificateList`, `ListSection`, `FactSheet`)

Boodschap: feiten in plaats van bijvoeglijke naamwoorden; een bedrag, een tijd, een certificaat.

- `search`: "feature grid with icons four columns"; "features grid icon title description minimal"; "stats section key figure with label"; "definition list key facts card"; "checklist two columns section".
- `get_inspiration`: "calm light section with one large hourly wage figure, an 'indication' badge, source line and disclaimer"; "list of certificates as small cards with a requirement badge".
- Specifiek: geen spotlight of muiseffecten; cijfers met tabulaire cijfers; badges klein en in tekst.

| Id | Naam | Preview |
|---|---|---|
| 28163 | Features Grid (shadcnui-blocks) | https://21st.dev/@shadcnui-blocks/components/features-01 |
| 28299 | Icon Feature Grid (felipemenezes098) | https://21st.dev/@felipemenezes098/components/content-09 |
| 29870 | Stats Section (shadcnui-blocks) | https://21st.dev/@shadcnui-blocks/components/stats-05 |
| 5447 | Stats (meschacirung) | https://21st.dev/@meschacirung/components/stats |

### 9.4 `scout-stappen`: werkwijze en groeipad (`ServiceSteps`, `CareerPath`)

Boodschap: de lezer weet bij elke stap wat er gebeurt en wie hij belt.

- `search`: "how it works steps numbered"; "minimal three step process numbered circles"; "vertical timeline steps"; "career path horizontal steps".
- `get_inspiration`: "four numbered steps with short title and one sentence, ordered list, light background, no icons required".
- Specifiek: `<ol>`, cijfer als los teken, geen kickerlabel "Stap 1", geen pinned of scroll-gebonden animatie.

| Id | Naam | Preview |
|---|---|---|
| 26891 | How It Works Steps (ln-dev7) | https://21st.dev/@ln-dev7/components/how-it-works-09 |
| 19863 | How It Works Timeline (olewandowski1) | https://21st.dev/@olewandowski1/components/how-it-works-2 |
| 26902 | Vertical How It Works Timeline (ln-dev7) | https://21st.dev/@ln-dev7/components/how-it-works-02 |
| 29925 | Basic Stepper (sean0205) | https://21st.dev/@sean0205/components/c-stepper-1 |

Kandidaat 26916 heeft een kickerlabel boven de kop en valt daarom af.

### 9.5 `scout-faq` (vervallen)

Deze plek vervalt (kruiscontrole ronde 2). `ServiceFaq` gebruikt het uiterlijk van `Accordion` uit spec 02 (`components/ui/accordion.tsx`, native `<details>`); er is geen sub-agent, geen `get_component` en geen keuze in `docs/21st-keuzes.md` voor de vragenlijst. De nummering van §9.6 tot en met §9.8 blijft gelijk.

### 9.6 `scout-vacatures`: vacaturerij en lege staat (`BeroepVacancies`)

Boodschap: er is werk, of er komt werk, en je kunt nu al iets doen.

- `search`: "job listing cards row"; "job board list compact"; "empty state with call to action"; "list section with view all link".
- `get_inspiration`: "row of three job cards with title, place, hourly wage and hours, plus a 'view all' link; friendly empty state with register and WhatsApp buttons".
- Specifiek: de kaart zelf is `VacancyCard` van spec 06; deze sub-agent kiest alleen de rij, de tellerregel en de lege staat. Geen carrousel of slider.

| Id | Naam | Preview |
|---|---|---|
| 8725 | Job Listing (educalvolpz) | https://21st.dev/@educalvolpz/components/job-listing |
| 5642 | Joblisting (reuno-ui) | https://21st.dev/@reuno-ui/components/joblisting-component |
| 8123 | Animated Card (kavikatiyar), alleen de opbouw, zonder tilt | https://21st.dev/@kavikatiyar/components/animated-card |

### 9.7 `scout-cta`: afsluitende band (`ServiceCta`) en `PerspectiveLink`

Boodschap: één duidelijke volgende stap, met de belofte als microcopy naast de knop.

- `search`: "call to action banner with two buttons"; "cta section centered title description buttons"; "simple cta block left aligned"; "inline link callout aside".
- `get_inspiration`: "solid blue rounded call to action panel inside a white section, question headline, two buttons and one line of reassurance".
- Specifiek: geen gradiënt of gloed; het vlak is het recept van spec 02 §4.13 (`ColumnLines` met `surface-brand`). Sinds 3 oktober 2026 staan alle secties op wit met een haarlijn (`section-rule`) erboven in plaats van afwisselend `bg-ice`.

| Id | Naam | Preview |
|---|---|---|
| 610 | Cta 10 (shadcnblockscom) | https://21st.dev/@shadcnblockscom/components/shadcnblocks-com-cta10 |
| 18475 | Call to Action (felipemenezes098) | https://21st.dev/@felipemenezes098/components/cta-01 |
| 7534 | Call to Action (brijr) | https://21st.dev/@brijr/components/call-to-action-1 |
| 4708 | Call To Action (meschacirung) | https://21st.dev/@meschacirung/components/call-to-action |

### 9.8 `scout-vergelijking`: werkzoekende en werkgever naast elkaar (`AudienceCompare`), beroepenraster (`BeroepGrid`) en Wtta-tijdlijn (`WttaTimeline`)

Boodschap: twee kanten van hetzelfde werk, eerlijk naast elkaar, en een tijdlijn die laat zien wat wanneer verandert.

- `search`: "comparison two columns side by side"; "comparison table two columns highlighted column"; "category link cards grid with icon and arrow"; "vertical timeline milestones"; "timeline dates minimal".
- `get_inspiration`: "two audience comparison table, job seekers versus employers, neutral rows, one column softly highlighted"; "vertical timeline of dated legal milestones with past and future markers".
- Specifiek: de vergelijking is een echte `<table>` en heeft geen kruisjes of "zij tegen wij"-toon; kandidaat 21217 is alleen bruikbaar voor de opmaak van de kolommen, niet voor de rode kruisregels. De tijdlijn is een `<ol>` zonder links-rechts-afwisseling op mobiel.

| Id | Naam | Preview |
|---|---|---|
| 26827 | Comparison Table (mohammadshehadeh) | https://21st.dev/@mohammadshehadeh/components/comparison-02 |
| 21217 | Us vs Them Comparison (olewandowski1) | https://21st.dev/@olewandowski1/components/comparison-2 |
| 8862 | Cards Grid (kavikatiyar) | https://21st.dev/@kavikatiyar/components/cards-grid |
| 28384 | Milestone Timeline (olewandowski1) | https://21st.dev/@olewandowski1/components/timeline-1 |

Extra voor de tijdlijn: 28298 Timeline (slide-cn), https://21st.dev/@slide-cn/components/timeline. Voor het raster: 25350 Icon Link Card (cnippet-dev), https://21st.dev/@cnippet-dev/components/v-card-14.

## 10 Bouwopdracht

> **Notitie.** Bouwstap 4 voor deze spec is gecommit (8a4f1a5, gemerged in d2d2714). De wijzigingen uit kruiscontrole ronde 2 en 3 voert een nazorg-sub-agent in bouwstap 3b uit (00 §6).

Bouwstap 4 uit 00 §6, parallel met spec 04. Voorwaarden: stap 1 tot en met 3 zijn klaar (Supabase-clients en `lib/data/*` van spec 10, tokens en `CtaButton` van spec 02, routes, skeletten, `Breadcrumbs`, `lib/routes.ts`, `content/beroepen/index.ts`, `lib/claims.ts`, `lib/format.ts` en `check:copy` van spec 01 en 03). `BeroepVacancies` rendert `VacancyList` van spec 06; bouwstap 3b controleert dat (B-52).

1. **Lezen.** 00 §3 en §4, deze spec, spec 01 §4.2, §4.9, §4.11, §5, spec 03 §6 en §10, spec 09 §4.6, §6.8 en §6.9, spec 10 §4.3, `CLAUDE.md`, en `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md` en `02-guides/caching-without-cache-components.md`.
2. **Typen.** Maak `content/beroepen/types.ts`, `content/beroepen/icons.ts` en `content/pages/types.ts` (§5.2, §5.4).
3. **Bouwstenen aanpassen.** Werk `components/service/{service-hero,service-feature-grid,service-steps,service-faq,service-cta}.tsx` bij en maak `components/service/types.ts` (§4.4.1). Haal de laatste lezers van `service.*` en `common.cta.requestQuote` weg, zodat spec 03 die sleutels kan verwijderen.
4. **Nieuwe componenten.** Maak de elf bestanden in `components/beroep/` (§4.4.2).
5. **21st.dev.** Start de zes sub-agents uit §9 tegelijk en werk intussen door.
6. **Messages.** Zet de sleutels van §6.2 en §6.3 in `messages/nl/<namespace>.json` en `messages/en/<namespace>.json` (`werkzoekenden`, `werkgevers`, `beroepen`) (B-45); de waarden van `beroepen.<id>.enkelvoud` en `.meervoud` uit stap 3 blijven, behalve de Engelse naam van `hulpkracht-bouw-en-sloop`.
7. **Lege contentbestanden.** Maak `content/beroepen/{glazenwasser,schoonmaker,logistiek-medewerker,verhuizer,hulpkracht-bouw-en-sloop}.ts` met de getallen uit §6.4 en een skelet dat aan het type voldoet (strings `TODO`), plus `content/beroepen/pages.ts`, `content/pages/{werkzoekenden,werkgevers,wtta}.ts` en `content/pages/loaders.ts`.
8. **Pagina's.** Vervang de skeletten van spec 01 door de pagina's van §4.2 tot en met §4.7, met metadata en JSON-LD volgens §7. Houd `generateStaticParams`, `dynamicParams`, `revalidate` en `setRequestLocale` zoals spec 01 ze zette; zet `/werkzoekenden` op `revalidate = 3600`.
9. **Schrijvers.** Start zes schrijf-sub-agents tegelijk: één per beroep (beide perspectieven, eerst `jobseeker`, dan `employer`, alleen Nederlands) met de contentbrief uit §6.6, en één voor de drie vaste pagina's met §6.5. Elke schrijver volgt spec 03 §10.2 stap 2 tot en met 5: schrijven, `npm run check:copy`, de skill `humanizer` als reviewlijst, en voor de je-teksten een B1-lezer. Elke schrijver levert de lijst gebruikte claims mee.
10. **Controle.** Daarna één sub-agent voor de claims (spec 03 §10.2 stap 6): `npm run check:claims` (spec 09), elke belofte naast spec 03 §6.11 en `lib/claims.ts`, ontbrekende `claim`-velden toevoegen, de lijst open claims voor Jimmy en Lorenzo opleveren. Daarna de checklist van spec 09 §6.8 per beroep afvinken in het bouwverslag.
11. **Engels.** Eén vertaal-sub-agent per batch van twee of drie beroepen volgens spec 03 §6.18, daarna een voor de vaste pagina's. Zelfde lengtes, claims, iconen en `specific`-waarden.
12. **Kwaliteitstest.** Schrijf `tests/unit/content/beroepen-kwaliteit.test.ts` (Vitest, opzet van spec 14) met: (a) per beroep en perspectief de lijstlengtes uit §5.2; (b) D-1 tot en met D-5 uit §6.7 met de meting uit die tabel; (c) gelijke lengtes, `claim`-, `icon`- en `specific`-waarden tussen `nl` en `en`; (d) elke `minAge18` niet `null` heeft een `requirements.minAgeNote` in nl en en; (e) `wage.starter.min` is minimaal `MINIMUM_WAGE_21_PLUS` uit `lib/data/options.ts` (spec 10, B-42); (f) een `console.warn` als de huidige datum na `wage.reviewBy` ligt. De test drukt per pagina het aantal woorden en het unieke aandeel af. Spec 14 neemt de test op in de suite van module 05.
13. **Ontwerp.** Verwerk de keuzes van de sub-agents binnen de regels van §9.1.
14. **Verifiëren.**

```bash
npm run verify
npm run check -- --warn                 # geen sleutel- of registratiefouten; open claims staan in de lijst
npm run check:copy                      # geen fouten in werkzoekenden, werkgevers, beroepen, content/beroepen, content/pages
npm run check:claims -- --strict        # exitcode 0; elke treffer met reden in het bouwverslag (AC-05-16)
npx vitest run tests/unit/content       # beroepen.test.ts (spec 14) en beroepen-kwaliteit.test.ts
npm run build && npm run start

B=http://localhost:3000
for p in /werkzoekenden /werkgevers /werkgevers/wtta \
  /werken-als/glazenwasser /werken-als/schoonmaker /werken-als/logistiek-medewerker \
  /werken-als/verhuizer /werken-als/hulpkracht-bouw-en-sloop \
  /werkgevers/glazenwassers /werkgevers/schoonmakers /werkgevers/logistiek-medewerkers \
  /werkgevers/verhuizers /werkgevers/hulpkrachten-bouw-en-sloop; do
  for pre in "" /en; do echo "$(curl -s -o /dev/null -w '%{http_code}' "$B$pre$p") $pre$p"; done; done
curl -s $B/werkgevers/glazenwassers | grep -o '"@type":"[A-Za-z]*"' | sort | uniq -c
npm run lighthouse -- --alleen=beroep  # script van spec 14
```

15. **Visueel.** Playwright op 390, 768, 1280 en 1440 px voor `/werkzoekenden`, `/werken-als/schoonmaker`, `/werken-als/hulpkracht-bouw-en-sloop`, `/werkgevers`, `/werkgevers/verhuizers`, `/werkgevers/wtta` en `/en/werken-als/verhuizer`. Scroll eerst door de pagina. Controleer dat de h1 op 390 px niet over meer dan vier regels loopt, dat knoppen niet afbreken en dat de vergelijkingstabel horizontaal scrollt zonder de pagina breder te maken. Screenshots alleen in `.playwright-mcp/`.
16. **Afsluiten.** Noteer in spec 00 §7 de stand, de sub-agentkeuzes, de uitkomst van de kwaliteitstest per pagina en de lijst open claims; leg de Nederlandse copy ter goedkeuring voor aan Djulan (spec 03 §10.2 stap 9).

## 11 Acceptatiecriteria

Alle criteria gelden op localhost met de productieserver tegen `groos-dev`, met de seed van spec 10 en alle vlaggen in `lib/claims.ts` op `false`, tenzij anders vermeld. De criteria gaan uit van de seedtoestand direct na `npm run db:seed:reset` (B-46).

| Id | Criterium | Eis |
|---|---|---|
| AC-05-01 | Het routescript uit §10 stap 14 geeft 200 voor alle 26 URL's; `/werken-als/glazenwassers` en `/werkgevers/glazenwasser` (verkeerde slugvorm) geven 404. | E-05-01 |
| AC-05-02 | De uitvoer van `next build` toont `/[locale]/werken-als/[beroep]` en `/[locale]/werkgevers/[beroep]` met elk 10 vooraf gegenereerde pagina's, `/[locale]/werkzoekenden` met revalidatie van 1 uur en `/[locale]/werkgevers` en `/[locale]/werkgevers/wtta` als statisch. | E-05-01, E-05-17 |
| AC-05-03 | Op `/werken-als/glazenwasser` staan de secties in de volgorde van §4.2 met de id's `werk`, `eisen`, `loon`, `werktijden`, `certificaten`, `waarom`, `doorgroei`, `vacatures`, `solliciteren`, `faq`, `aan-de-slag`; op `/werkgevers/glazenwassers` de id's `levering`, `waarom`, `certificaten`, `planning`, `werkwijze`, `zekerheid`, `faq`, `aanvragen`. | E-05-01, E-05-03 |
| AC-05-04 | Elke pagina van deze module heeft precies één h1, geen overgeslagen kopniveau en geen h4; axe meldt geen fouten (spec 14). | E-05-01, E-05-16 |
| AC-05-05 | Playwright: `main` op de zes werkzoekendepagina's (nl, `/werkzoekenden` en de vijf `/werken-als/*`) bevat geen los woord u of uw; `main` op `/werkgevers`, de vijf werkgeverspagina's en `/werkgevers/wtta` bevat geen los woord je, jij, jou of jouw. | E-05-02 |
| AC-05-06 | `npm run check:copy` meldt geen fout in `messages` onder `werkzoekenden`, `werkgevers` en `beroepen`, in `content/beroepen/*.ts` en in `content/pages/*.ts`; `npm run check -- --warn` meldt geen sleutelverschil en K2 vindt voor elk id de vier sleutels van §6.3. | E-05-05, E-05-02 |
| AC-05-07 | `#loon` op `/werken-als/schoonmaker` toont "€ 15,52 tot € 16,08 bruto per uur" (met vaste spaties), de badge "Indicatie", een bronregel met "Gecontroleerd op 2 oktober 2026" en de zin "Dit is een indicatie en geen loonbelofte."; op `/en/werken-als/schoonmaker` "€15.52 to €16.08 gross per hour" en "Checked on 2 October 2026". | E-05-06 |
| AC-05-08 | `#eisen` op `/werken-als/glazenwasser` en `/werken-als/hulpkracht-bouw-en-sloop` bevat een zin met "minimaal 18 jaar" en de reden; op `/werken-als/schoonmaker` en `/werken-als/verhuizer` komt "18 jaar" niet voor. Geen beroepspagina bevat "fysiek sterk", "fit en gezond", "jong", "student" of "native". | E-05-07 |
| AC-05-09 | `/werken-als/glazenwasser` toont in `#vacatures` de seedvacature 1001 als kaart met een link naar `/vacatures/<slug van 1001>`, de regel "Er staat 1 vacature open." en de link "Alle vacatures voor dit beroep" naar `/vacatures?beroep=glazenwasser`. `/werken-als/logistiek-medewerker` toont 1003 en 1004 en niet de geplande 1008. | E-05-08 |
| AC-05-10 | Na het tijdelijk sluiten van seedvacature 1005 in `/beheer` (of met een SQL-update gevolgd door `curl -X POST -H "Authorization: Bearer $CRON_SECRET" -H 'content-type: application/json' -d '{"numbers":[1005],"kind":"visibility"}' http://localhost:3000/api/dev/revalidate`) toont `/werken-als/verhuizer` bij het volgende bezoek de lege staat met een link naar `/inschrijven?beroep=verhuizer` en een WhatsApp-link waarvan de gedecodeerde tekst "Hallo Groos, ik zoek werk als verhuizer." is; daarna `npm run db:seed:reset`. | E-05-08, E-05-17 |
| AC-05-11 | `npx vitest run tests/unit/content/beroepen-kwaliteit.test.ts` slaagt: elk perspectief van elk beroep heeft 500 tot 800 woorden en minstens 60 procent unieke vijfwoordsreeksen, en de afgedrukte tabel staat in het bouwverslag. | E-05-09 |
| AC-05-12 | In dezelfde test zijn de tien h1's, de tien metatitels, de tien metabeschrijvingen, de tien CTA-koppen en de tien waarom-koppen onderling verschillend, ook na vervanging van de beroepsnaam door `{beroep}`. | E-05-09 |
| AC-05-13 | Met alle vlaggen op `false` heeft elke werkzoekendepagina 6 of 7 zichtbare FAQ's waarvan minstens 4 beroepsspecifiek, en elke werkgeverspagina 6 tot 8 waarvan minstens de helft beroepsspecifiek. | E-05-09, E-05-11 |
| AC-05-14 | Playwright telt in `main` van elke beroepspagina (nl) minstens 500 woorden, gemeten zonder de elementen binnen `#vacatures ul`. | E-05-09 |
| AC-05-15 | De h1 van `/werkgevers/glazenwassers` en `/werkgevers/verhuizers` bevat "bedrijf" of "uitzendkrachten" of "personeel"; geen titel of h1 van een werkgeverspagina bevat "laten wassen", "verhuizing plannen" of een andere consumentenformulering. | E-05-10 |
| AC-05-16 | Op geen enkele pagina van deze module staat "24/7", "dag en nacht", "binnen één werkdag", "binnen 24 uur", "wekelijks uitbetaald", "keurmerk", "SNA", "NEN 4400", "VCU-gecertificeerd", "ABU", "NBBU", "g-rekening van Groos" of "huisvesting geregeld"; `npm run check:claims -- --strict` eindigt met exitcode 0, en elke treffer in `content/beroepen` en `content/pages` staat in het bouwverslag met een van deze redenen: regel met `TODO`, item met een `claim`-veld, of een regel in `allow` van `lib/compliance/copy-rules.json`. | E-05-11 |
| AC-05-17 | Zet de bouw-agent tijdelijk `certificateSupport` op `true`, dan verschijnen op `/werken-als/logistiek-medewerker` extra items met `claim: "certificateSupport"` in de FAQ en in de FAQPage-JSON-LD; daarna zet hij de vlag terug en verdwijnen ze. | E-05-11, E-05-13 |
| AC-05-18 | `/werkgevers/wtta` toont in `#tijdlijn` zes items met `<time dateTime>` voor 2026-11-01, 2027-01-01, 2027-05-01, 2027-07-01 en twee keer 2028-01-01, elk met een bronregel; `#bronnen` linkt naar `toelatinguitleenmarkt.nl` en `wetten.overheid.nl`; de hero noemt "Deze pagina is bijgewerkt op 2 oktober 2026.". | E-05-12 |
| AC-05-19 | Met `WTTA = { phase: "preparing" }` staat in `#status-groos` de tekst van `legal.wtta.block.preparing`; buiten `#status-groos` komen op `/werkgevers/wtta` de woorden "aangemeld", "toegelaten", "voorlopige toelating van Groos" en "registernummer" niet voor als uitspraak over Groos (handmatige leescontrole plus `grep` op `content/pages/wtta.ts`). | E-05-12 |
| AC-05-20 | Op `/werken-als/schoonmaker` bevat de pagina één `BreadcrumbList` met drie items (Home, Werkzoekenden, Schoonmaker) en één `FAQPage` waarvan de vragen exact gelijk zijn aan de tekst van de zichtbare `<summary>`-elementen in `#faq`. | E-05-13 |
| AC-05-21 | Op `/werkgevers/schoonmakers` bevat de pagina één `Service` met `provider.name` "Groos Personeelsdiensten B.V." en een absolute `url` die eindigt op `/werkgevers/schoonmakers`, plus `BreadcrumbList` en `FAQPage`; er staat geen `JobPosting` of `ItemList`. De Schema Markup Validator geeft nul fouten. | E-05-13 |
| AC-05-22 | De `<title>` van `/werken-als/verhuizer` begint met "Werken als verhuizer in Den Haag" en eindigt op " \| Groos Personeelsdiensten"; canonical is `https://www.groospersoneelsdiensten.nl/werken-als/verhuizer`; er zijn `hreflang`-links voor nl, en en x-default; de metabeschrijving telt 120 tot 160 tekens. | E-05-13 |
| AC-05-23 | Elke `/werken-als/<slug>` bevat een link naar `/werkgevers/<meervoudsslug>` van hetzelfde beroep en omgekeerd; `/werkzoekenden` linkt naar de vijf `/werken-als/*`-pagina's en `/werkgevers` naar de vijf `/werkgevers/<beroep>`-pagina's. | E-05-14 |
| AC-05-24 | Op `/werkzoekenden` en `/werkgevers` staat een `<table>` met een zichtbare `<caption>`, twee kolomkoppen met `scope="col"` en minstens vier rijkoppen met `scope="row"`; op 390 px geldt `document.documentElement.scrollWidth <= window.innerWidth`. | E-05-01 |
| AC-05-25 | In `#faq` opent Enter op een gefocuste `<summary>` het antwoord en sluit Spatie het weer, ook met JavaScript uitgeschakeld (Playwright `javaScriptEnabled: false`). | E-05-03, E-05-16 |
| AC-05-26 | `grep -l '"use client"' components/beroep/* components/service/*` geeft niets. | E-05-16 |
| AC-05-27 | Lighthouse mobiel op `/werken-als/schoonmaker` (`npm run lighthouse -- --alleen=beroep`) geeft een mediaan van 90 of hoger in alle vier categorieën, met CLS 0,1 of minder. | E-05-16 |
| AC-05-28 | Met `NEXT_PUBLIC_SUPABASE_URL` tijdelijk op een onbereikbaar adres (alleen tijdens de controle, met `npm run dev`) geeft `/werken-als/schoonmaker` status 200 met de tekst van `beroepen.ui.vacancies.loadError` in `#vacatures` en de rest van de pagina intact. | E-05-08, E-05-17 |
| AC-05-29 | `/en/werken-als/hulpkracht-bouw-en-sloop` heeft `<html lang="en">`, een h1 met "construction and demolition labourer", geen Nederlandse zin van vier woorden of meer in `main` buiten vacaturekaarten, en legt VCA uit als "VCA safety certificate". | E-05-01, E-05-05 |
| AC-05-30 | Het bouwverslag noemt per sub-agent uit §9 2 tot 4 kandidaten met id, naam en preview-URL en een gemotiveerde keuze, per plek hoogstens één `get_component`, en per schrijf-sub-agent de uitvoer van `check:copy` en de lijst gebruikte claims. ServiceFaq telt niet als plek. | E-05-15 |
| AC-05-31 | `content/beroepen/pages.ts` en `content/pages/loaders.ts` beginnen met `import "server-only"`, geen bestand met `"use client"` importeert uit `content/beroepen/<id>` of `content/pages/`, en K15 meldt niets. | E-05-04 |
| AC-05-32 | `docs/21st-keuzes.md` heeft een sectie "Spec 05" met per plek uit §9 twee tot vier kandidaten, de keuze en de aanpassingen; `get_component` is per plek hoogstens één keer aangeroepen. ServiceFaq telt niet als plek. | E-05-15 (R-16) |

## 12 Open vragen en aannames

| Onderwerp | Aanname in deze spec | Bevestigt | Wat verandert als het anders is |
|---|---|---|---|
| Plek van de bouwstenen | `ServiceHero`, `ServiceFeatureGrid`, `ServiceSteps`, `ServiceFaq` en `ServiceCta` blijven in `components/service/` met dezelfde namen (spec 01 §4.2); alleen hun props veranderen. Nieuwe componenten in `components/beroep/`. | Djulan | Verhuizen naar `components/beroep/`: alleen imports. |
| `ServiceFaq` als server component | `Accordion` van spec 02 op native `<details name>` voor exclusief openklappen; oudere browsers openen meerdere tegelijk, wat geen fout is. Het uiterlijk komt uit spec 02; er is geen 21st.dev-plek voor de vragenlijst (§9.5 vervallen in kruiscontrole ronde 2). | Djulan | Base UI Accordion: het component wordt client en `common` volstaat als namespace. |
| `VacancyList` en `VacancyCard` (spec 06) | Bestaan in `components/vacatures/`; `VacancyList` heeft props `{ items: VacancyListItem[]; locale: Locale; variant?; headingLevel?; className?; ariaLabelledBy? }` en `VacancyCard` `{ vacancy: VacancyListItem; locale: Locale; variant?; headingLevel?; now? }` (spec 06 §4.6). | spec 06 | Andere props: alleen `BeroepVacancies`. |
| `CtaButton` met `external` | Gesloten (kruiscontrole ronde 1): `CtaButton` heeft `external` en `newTabLabel` (API spec 02 §4.7); `ServiceHero` en `ServiceCta` geven ze bij WhatsApp door met `newTabLabel={t("common.opensInNewTab")}`. Er is geen terugval en geen `ctaButtonClasses`. | gesloten | Geen. |
| Prefill van het aanvraagformulier | De knop op werkgeverspagina's gaat naar `/werkgevers/personeel-aanvragen?beroep=<id>`; spec 07 mag het beroep vooraf aanvinken. | spec 07 | Negeert spec 07 de parameter, dan is er geen gevolg; anders kiest spec 07 een andere parameternaam en past deze module de link aan. |
| Engelse naam hulpkracht | Gesloten (kruiscontrole ronde 1): overal "Construction and demolition labourer" en "Construction and demolition labourers", gelijk aan `occupations.name_en` (spec 10), de woordenlijst van spec 03 en 00 §4.2; "helper" vervalt. | gesloten | Geen. |
| Afwijking van het titelsjabloon van spec 03 §7 | Gesloten (kruiscontrole ronde 1). §6.6 is de enige bron van de metatitels; spec 12 §6.3 verwijst ernaar. Werkgeverstitels: "Personeel voor glazenwasserijen in Den Haag" (EN "Staff for window cleaning companies in The Hague"), "Schoonmakers inhuren in Den Haag" (EN "Hire cleaners in The Hague"), "Logistiek medewerkers inhuren in Den Haag" (EN "Hire logistics workers in The Hague"), "Personeel voor verhuisbedrijven in Den Haag" (EN "Staff for removal companies in The Hague"), "Hulpkrachten bouw en sloop inhuren in Den Haag" (EN "Hire construction and demolition labourers", 42 tekens). Werkzoekendetitel hulpkracht: "Werken als hulpkracht bouw en sloop in Den Haag" (EN "Work as a construction and demolition labourer", 46 tekens). Glazenwassers en verhuizers wijken af van "{Meervoud} inhuren in Den Haag", omdat "glazenwassers inhuren" en "verhuizers inhuren" consumentenzoekopdrachten zijn (context/10 §1); hun beschrijvingen staan in §6.6. Geen afwijking van een B-besluit. Drie titels zijn langer dan 45 tekens (hulpkracht werkgever 46, hulpkracht werkzoekende 47, EN glazenwassers 48); dat mag tot 52 tekens (B-44), en `brandedTitle()` zet er dan " \| Groos" achter. Ook de EN-werkzoekendetitel van de hulpkracht telt 46 tekens en valt onder dezelfde regel. | gesloten | Andere titel: alleen `meta.title` in `content/beroepen/<id>.ts`. |
| Cao-naam als bron van een loonindicatie | De bronregel noemt de branche-cao waar het getal uit komt; de tekst zegt nergens dat Groos die cao toepast of lid is (CL-02, CL-03). `check:claims` kan op het woord cao reageren; de claimcontrole beoordeelt die treffers. | jurist via Djulan, spec 09 | Mag het niet: `sourceLabel` wordt "loontabellen van de branche, 1 januari 2026" en de cao-naam verdwijnt uit de pagina. |
| RAS-opleiding en uitzendregels schoonmaak | Of de RAS-basisvakopleiding, de 7,5 procent-regel en de inleenduur van 12 maanden in de cao 2026-2028 gelden voor uitzendkrachten via Groos, is niet bevestigd (context/01 §Te verifiëren). De copy noemt ze alleen met een `TODO`-commentaar en zonder belofte. | Jimmy, Lorenzo, jurist | Bevestigd: TODO weg; anders de zinnen schrappen. |
| Loonbedragen per 1 januari 2027 | De bedragen gelden tot de volgende verhoging (`reviewBy` 2027-01-01). De kwaliteitstest waarschuwt na die datum. | Djulan | Eerder bijwerken bij een nieuwe loontabel. |
| Minimumleeftijd logistiek | Alleen voor rijden op een heftruck of reachtruck (`forklift`); orderpicken overdag zonder rijden heeft geen leeftijdszin. | jurist | Andere grens: één zin en `minAge18`. |
| Wtta-fase | `/werkgevers/wtta` toont de fase alleen via `WttaStatus` met de waarde in `lib/legal.ts` (spec 09, startwaarde `preparing`). Bij `none` valt de sectie weg. | Jimmy en Lorenzo | Geen; alleen `WTTA` in `lib/legal.ts`. |
| Datums op de Wtta-pagina | De zes mijlpalen komen uit context/09 §1 (bronnen geraadpleegd 2 oktober 2026). Een nieuwe datum of wijziging van de NAU vraagt een update van `content/pages/wtta.ts` en `reviewedAt`. | Djulan | Alleen `content/pages/wtta.ts`. |
| Boetebedrag Wtta | Niet noemen; de bedragen staan in nog vast te stellen beleidsregels (context/09). | jurist | Na publicatie mag een FAQ-antwoord het bedrag noemen met bron. |
| Kandidaten na een gesprek | Het `supply`-item "Kandidaten na een gesprek" op `/werkgevers` draagt `claim: "personalIntake"` (spec 03 §6.11) en staat er pas na bevestiging; tot dan toont `supply` alleen de A-items (kruiscontrole ronde 2). | Jimmy en Lorenzo | Bevestigd: `personalIntake` op `true` in `lib/claims.ts`, het item verschijnt zonder wijziging in de content. |
| Inlenersaansprakelijkheid | Algemene uitleg van de wet op `/werkgevers` en `/werkgevers/wtta`, zonder te zeggen dat Groos een g-rekening of verzekering heeft (CL-22). | jurist | Na bevestiging een zin met vlag `gAccount`. |
| Werkgebied | Alleen Den Haag en "Den Haag en omgeving" in de copy; plaatsnamen buiten Den Haag pas na `workArea` (CL-14). Soorten werkplekken zoals "bedrijventerreinen" mogen. | Jimmy en Lorenzo | Na bevestiging mogen leads en werktijdenkaarten Westland, Rijswijk en Zoetermeer noemen. |
| Live vacatures op werkgeverspagina's | Niet tonen (context/08 §6.8); een opdrachtgever zoekt geen vacatures. | Djulan | Toevoegen kan met `BeroepVacancies`; de pagina wordt dan ISR met `revalidate = 3600`. |
| Foto's | Geen (B-25); `ServiceHero.image` blijft ongebruikt. | Jimmy en Lorenzo | Foto's per beroep in `public/beroepen/<id>.webp` en een `image`-veld in `BeroepContent`. |
| Testopzet | Vitest met de padalias `@/` bestaat na stap 3 (spec 14). Zonder Vitest draait de kwaliteitstest als `node --experimental-strip-types` met relatieve imports. | spec 14 | Alleen de manier van draaien. |
| Wtta-fase lezen | Spec 09 levert geen helper; deze module vergelijkt `WTTA.phase` uit `lib/legal.ts` direct. | spec 09 | Geen. |
| Sectie-id `faq` | `ServiceFaq` houdt zijn bestaande id `faq` (CLAUDE.md: id's van bestaande componenten gelijk houden), ook al zijn de andere ankers Nederlands. | Djulan | Alleen de standaardwaarde van de prop. |
| Genderneutrale functienamen (afwijking, bouwstap 3b) | De voorbeeldstappen "Meewerkend voorman" en "Voorman" in §4.4.4 en §6.6 zijn niet genderneutraal (spec 09 VR-01). De code gebruikt "Meewerkend ploegleider" (glazenwasser), "Meewerkend teamleider" (schoonmaker) en "Ploegleider" (verhuizer, hulpkracht), in het Engels "Working crew leader", "Working team leader" en "Crew leader". Lopende tekst noemt de leiding van de opdrachtgever "uitvoerder" of "leidinggevende" (EN "site manager", "supervisor"). "Opperman" blijft: het is de gangbare vaktitel en een zoekterm uit de woordenlijst van spec 03 §6.8 en de seed van spec 10. De kwaliteitstest weigert "voorman" en "foreman". | Djulan | Andere neutrale namen: alleen `career.steps` in `content/beroepen/<id>.ts`. |
| Extra iconsleutels (afwijking, bouwstap 3b) | `BEROEP_ICONS` in `content/beroepen/icons.ts` heeft naast de veertien sleutels van §5.2 ook `early`, `evening`, `document`, `message`, `learn`, `person`, `building` en `check` (Lucide 0.456), voor werktijdenkaarten en de overzichtspagina's. | Djulan | Geen; een ongebruikte sleutel kan weg. |
| `AudienceCompare` zonder `Table`-primitives (afwijking, bouwstap 3b) | De tabel is een eigen `<table>` met zichtbare `<caption>` en scopes in een wrapper met `role="region"`, `aria-label` en `tabIndex={0}` (§4.4.2). De `Table` van spec 02 zet zelf een scrollende `div` zonder `tabIndex` om de tabel; binnen de focusbare wrapper zou dan een niet-focusbare scrollcontainer staan (axe `scrollable-region-focusable`). | spec 02 | Krijgt `Table` een prop voor de wrapper (rol, label, `tabIndex`), dan stapt `AudienceCompare` over op de primitives. |
| Suspense in `BeroepVacancies` | De `<Suspense fallback={<VacancyListSkeleton count={3} />}>` uit §4.2 rij 9 en §4.6 rij 6 staat in `BeroepVacancies` zelf, om het resultaatdeel heen; de kop staat erbuiten (§4.4.5 punt 5). De pagina's roepen `BeroepVacancies` daarom zonder eigen Suspense aan. | Djulan | Geen. |
| Bron onder een tijdlijnitem | `WttaTimeline` krijgt naast de props van §4.4.2 een optioneel `source` per item, voor de bronregel van §5.4. | Djulan | Geen. |
| Engelse werkzoekendetitels | Naar het voorbeeld van de hulpkracht in §6.6 en `beroepen.og.werkzoekende` beginnen alle Engelse werkzoekendetitels en h1's met "Work as a" ("Work as a window cleaner in The Hague"). | Djulan | Alleen `meta.title` en `hero.title` in `content/beroepen/<id>.ts`. |
| Woordtelling h1 hulpkracht | §6.6 zegt dat de h1 "Werken als hulpkracht in de bouw en sloop in Den Haag" tien woorden telt; met "Den Haag" als twee woorden zijn het er elf. De h1 blijft zoals in §6.6, omdat de zoekterm en de plaats er allebei in moeten. | spec 03 (§6.12) | Strikt tien woorden: "Werken als hulpkracht in de bouw en sloop" plus de plaats in de lead. |

Afwijkingen van B-01 tot en met B-46: geen. De afwijking van het titelsjabloon in spec 03 §7 voor twee werkgeverspagina's is in kruiscontrole ronde 1 gesloten (zie hierboven).
