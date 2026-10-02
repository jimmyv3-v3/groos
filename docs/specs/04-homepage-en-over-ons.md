# 04 Homepage en over ons

| Status | Fase | Hangt af van | Bronnen |
|---|---|---|---|
| concept | 1 | 01 (routes, layout, registers, `Breadcrumbs`), 02 (tokens, primitives, `.surface-brand`, `Reveal`), 03 (schrijfregels, `common`, `meta`, claims), 06 (`LatestVacancies`), 07 (`ContactPersonCard`), 12 (`pageMetadata`, `employmentAgencyLd`, `faqLd`) | docs/MIGRATIE.md §5.1, context/08 §4.1, §5 en §6.16, context/13 §1, §6.3, §7 en §11, context/02, context/12 §3 en §4, context/research/jversseput-schrijfstijl-analyse.md §13, bijlagen/samenvattingen/context-05, -08, -12, -13 en -research, bijlagen/repo-inventaris.md §2 en §3, 00 §3.2 en §4 |

## 1 Doel

Deze module levert de homepage (`/` en `/en`) en de pagina `/over-ons`. De homepage stuurt elke bezoeker binnen één scherm naar de juiste route: werkzoekenden naar de vacatures en de vijf beroepen, opdrachtgevers naar het aanvraagformulier en de telefoon. Daaronder staan de nieuwste vacatures uit de database, de vijf beroepen met een link voor beide kanten, de werkwijze in twee sporen, de vaste afspraken van Groos, Jimmy en Lorenzo als vaste gezichten, een veelgestelde-vragenblok voor beide doelgroepen en een afsluitende oproep. `/over-ons` vertelt wat de naam Groos betekent, wie Jimmy en Lorenzo zijn, waar Groos zit en hoe het bureau werkt. Beide pagina's tonen alleen feiten die kloppen (B-26), werken zonder foto's (B-25), sturen bijna geen JavaScript naar de browser en vervangen de vijftien JV-secties van de huidige homepage.

## 2 Gebruikers en scenario's

**Werkzoekende**

- S-04-01 Een schoonmaker opent `/` op een telefoon van 390 px breed. Zonder te scrollen ziet zij de kop, het blok "Ik zoek werk" met de knop "Bekijk vacatures" en het blok "Ik zoek personeel". Zij tikt op "Schoonmaker" in de rij met beroepen en komt op `/werken-als/schoonmaker`.
- S-04-02 Een logistiek medewerker scrolt naar "De nieuwste vacatures", ziet vier kaarten met plaats, uurloon en uren, en opent de vacature in Zoetermeer.
- S-04-03 Er staan geen vacatures online. De bezoeker ziet in dezelfde sectie een zin dat er nu geen vacatures zijn en een knop "Schrijf je in", zodat de pagina niet doodloopt.
- S-04-04 Een werkzoekende met Nederlands als tweede taal opent het vragenblok, laat het keuzerondje op "Werkzoekenden" staan en leest dat een cv niet nodig is en dat solliciteren niets kost.

**Opdrachtgever**

- S-04-05 Een planner van een verhuisbedrijf opent `/` op zijn laptop, klikt in het blok "Ik zoek personeel" op "Personeel aanvragen" en komt op `/werkgevers/personeel-aanvragen`.
- S-04-06 Een facilitair manager op zijn telefoon tikt in hetzelfde blok op "Bel ons" en belt het hoofdnummer 06 83 35 19 85.
- S-04-07 Een opdrachtgever kiest in het vragenblok "Werkgevers" en leest dat een uitzendkracht hetzelfde loon krijgt als zijn vaste mensen.
- S-04-08 Een opdrachtgever wil weten met wie hij te maken krijgt. Hij leest op `/over-ons` dat Jimmy en Lorenzo Groos samen leiden, ziet hun nummers en leest dat langskomen op afspraak kan.

**Iedere bezoeker**

- S-04-09 Een bezoeker zonder JavaScript gebruikt de homepage volledig: alle links werken, het vragenblok wisselt van doelgroep en de antwoorden klappen open.
- S-04-10 Een schermlezergebruiker hoort op `/` één h1, een h2 per sectie en de twee deuren als eigen koppen, en kan met de pijltjestoetsen tussen de twee vragensets wisselen.
- S-04-11 Een Engelstalige bezoeker opent `/en` en `/en/over-ons` en leest alle tekst in het Engels.

**Beheerder**

- S-04-12 Lorenzo publiceert in `/beheer` een vacature. Na `revalidateVacancies([nummer], "visibility")` uit `lib/data/revalidate.ts` (spec 10, B-35) staat die vacature bovenaan in "De nieuwste vacatures" op `/` en `/en`, zonder nieuwe build.

**Crawler**

- S-04-13 Googlebot leest op `/` de titel "Uitzendbureau in Den Haag | Groos Personeelsdiensten", de JSON-LD `EmploymentAgency` en `FAQPage` met precies de tien zichtbare vragen, en vindt links naar `/vacatures`, `/werkzoekenden`, `/werkgevers` en de tien beroepspagina's.

## 3 Scope

**Wel in deze spec**

- De pagina `app/[locale]/page.tsx` met acht secties en de pagina `app/[locale]/over-ons/page.tsx` met zes secties, in nl en en.
- De nieuwe componenten in `components/sections/home/*`, `components/sections/about/*` en `components/sections/cta-band.tsx`, en de uitbreiding van `SectionHeading` met `headingId`.
- Het besluit per bestaande homepagesectie (§4.1) en het opruimen van de JV-homepagebestanden, de bijbehorende exports in `lib/site.ts` en de oude `home.*`-sleutels.
- De volledige namespaces `home` en `about` in `messages/nl/home.json`, `messages/nl/about.json`, `messages/en/home.json` en `messages/en/about.json` (§6, B-45, B-47).
- Metadata en JSON-LD van beide pagina's met de builders van spec 12.
- De 21st.dev-opdrachten voor alle plekken op beide pagina's (§9).

**Niet in deze spec**

Header, footer, actiebalk en kruimelpad (spec 01 en 02), vacaturekaarten en `LatestVacancies` (spec 06), formulieren en `ContactPersonCard` (spec 07), de builders zelf (spec 12), wettelijke vermeldingen en `WttaStatus` (spec 09), de copy van `common` en `meta` (spec 03).

**Fase 2 of na bevestiging**

Een keurmerkstrook met registerlink zodra B-24 bevestigd is, echte citaten zodra er toestemming is (B-26), foto's van Jimmy en Lorenzo zodra die er zijn (B-25), het oprichtingsverhaal (claim `foundingStory`) en de plaatsnamen in Haaglanden (claim `workArea`). De plekken daarvoor zijn in §4 beschreven en staan nu uit.

**Eisen**

| Id | Eis | Dient |
|---|---|---|
| E-04-01 | De hero van `/` heeft één h1 en twee gelijkwaardige deuren: "Ik zoek werk" met "Bekijk vacatures" en de vijf beroepen, en "Ik zoek personeel" met "Personeel aanvragen" en "Bel ons". Op 390 px staan beide deuren met hun hoofdknop binnen de eerste 844 px. | R-01, R-14 |
| E-04-02 | De homepage toont de nieuwste vacatures via `LatestVacancies` van spec 06, met een lege staat die naar `/inschrijven` leidt. | R-02, R-01 |
| E-04-03 | De homepage toont de vijf beroepen in de volgorde van `content/beroepen/index.ts`, elk met een link naar `/werken-als/<slug>` en naar `/werkgevers/<slug>`. | R-01, R-09 |
| E-04-04 | De homepage legt de werkwijze uit in twee sporen van drie stappen, voor werkzoekenden in je-vorm en voor opdrachtgevers in u-vorm. | R-01, R-07 |
| E-04-05 | Het blok "Wat u van Groos kunt verwachten" bevat alleen claims uit categorie A en B van het claimbeleid (spec 03); er staat geen cijferband, logowand, citaat, keurmerk, cao, Wtta-status, reactietermijn of 24/7. | R-12, R-08 |
| E-04-06 | Jimmy en Lorenzo staan op `/` en `/over-ons` als twee kaarten met initiaal, voornaam, nummer en belknop, en bij Jimmy ook WhatsApp; geen foto zolang er geen is. | R-01, R-12 |
| E-04-07 | Het vragenblok op `/` heeft twee sets van vijf vragen (werkzoekenden en werkgevers), wisselt zonder JavaScript van set en houdt alle tien antwoorden in de HTML. | R-01, R-14, R-15 |
| E-04-08 | Een blauwe afsluiter (`.surface-brand`) sluit beide pagina's af met twee knoppen en het hoofdnummer. | R-01, R-05 |
| E-04-09 | `/over-ons` vertelt wat Groos betekent, stelt Jimmy en Lorenzo voor, noemt het werkgebied en de werkwijze en leidt naar contact; J. Versseput wordt nergens genoemd. | R-07, R-08, R-12 |
| E-04-10 | Alle tekst staat in de namespaces `home` en `about`, gespiegeld in nl en en, volgens de schrijfregels van spec 03 en de aanspreekvorm per blok (B-04). | R-07, R-13 |
| E-04-11 | Metadata via `pageMetadata()`; JSON-LD op `/` met `employmentAgencyLd` en `faqLd` (plus `organizationLd` en `websiteLd` uit de layout), op `/over-ons` alleen `BreadcrumbList` via `Breadcrumbs`. | R-09 |
| E-04-12 | De JV-homepagesecties, hun registers in `lib/site.ts` en hun messages zijn verwijderd volgens §4.1. | R-08, R-19 |
| E-04-13 | Het LCP-element van `/` is de h1-tekst, niet lazy, niet in een reveal; CLS op `/` is 0,05 of lager; de homepage voegt geen eigen clientcomponent toe. | R-15 |
| E-04-14 | De homepage werkt op localhost tegen `groos-dev`: de vacaturesectie leest de seedvacatures en ververst na een publicatie in `/beheer`. | R-17, R-02 |
| E-04-15 | De bouw-agent zet per plek een 21st.dev-sub-agent in volgens §9 en legt de keuzes vast. | R-16 |
| E-04-16 | De ontwerpen werken zonder foto's, met wit, ijs, blauwtint en één blauw vlak per pagina, en zonder glas, gloed, ticker of telanimatie. | R-05, R-06 |

## 4 Pagina's en componenten

### 4.1 Wat er gebeurt met de bestaande homepagesecties

Bron: `app/[locale]/page.tsx` en `components/sections/*` op de startcommit (MIGRATIE §5.1, repo-inventaris §2). "Stap" verwijst naar 00 §6.

| Sectie (bestand) | Besluit | Vervanger | Waarom |
|---|---|---|---|
| `Hero` (`hero.tsx`, client) | herschrijven | `HomeHero` (`home/home-hero.tsx`, server) | De JV-hero heeft één doelgroep, een waardenstrip met onbewezen woorden en de segment-accordeon als clienteiland. Groos heeft twee deuren nodig (context/13 §1.4) en de hero hoeft geen JavaScript te hebben. `hero.tsx` wordt verwijderd. |
| `Clients` (`clients.tsx`) | verwijderen | geen | Logowand zonder echte klanten met toestemming (B-26). Met `Marquee` en `.logo-mono` weg (spec 02). |
| `SegmentAccordion` (`segment-accordion.tsx`, client) | verwijderen | `HomeBeroepen` | Vier JV-doelgroepen met foto's; de vijf beroepen nemen die rol over en hebben geen accordeon nodig. |
| `Metrics` (`metrics.tsx`) | verwijderen | geen | Cijferband zonder te verdedigen getallen (B-26); `CountUp` vervalt (spec 02). |
| `TrustBar` (`trust-bar.tsx`) | herschrijven | `WhyGroos` (`home/why-groos.tsx`) | Het patroon van vier kaarten met icoon blijft bruikbaar, maar de inhoud wordt "vaste afspraken" met alleen claims uit categorie A en B. `trust-bar.tsx` wordt verwijderd. |
| `ServiceTicker` (`service-ticker.tsx`, client) | verwijderen | geen | Ticker met rollend woord past niet bij een minimale site (B-29). |
| `Services` (`services.tsx`, client) | verwijderen (al in stap 3 door spec 01) | `HomeBeroepen` | Leest `content/services` en gebruikt `.spotlight`. |
| `Process` (`process.tsx`) | herschrijven | `HowItWorks` (`home/how-it-works.tsx`) | Eén spoor van vier stappen wordt twee sporen van drie stappen, één per doelgroep (context/08 §5). `process.tsx` wordt verwijderd. |
| `Projects` (`projects.tsx`) | verwijderen | `HomeVacancies` | Fotogalerij zonder foto's (B-25); de levende vacatures zijn het bewijs dat er werk is. |
| `Proof` (`proof.tsx`) | verwijderen | geen (optioneel later) | Geen citaten tot er echte zijn met toestemming (B-26, claim `testimonials`). |
| `Assurance` (`assurance.tsx`) | verwijderen | geen (strook later) | Keurmerkblok zonder keurmerk (B-24). Komt het keurmerk rond, dan krijgt `WhyGroos` een vijfde kaart met registerlink (§4.6). |
| `About` (`about.tsx`) | verwijderen | `HomePeople` op `/` en de pagina `/over-ons` | Over ons is een eigen route (00 §4.1); op de homepage staan alleen de twee gezichten met een link naar `/over-ons`. |
| `Faq` (`faq.tsx`, default export) | herschrijven | `HomeFaq` (`home/home-faq.tsx`, named export) | Twee doelgroepen, native `<details>` via `Accordion` van spec 02. `faq.tsx` wordt verwijderd. |
| `OfferteForm` (`offerte-form.tsx`) | verwijderen (al in stap 3 door spec 01) | `CtaBand` met links naar de formulieren van spec 07 | Web3Forms vervalt (B-13). |
| `SectionHeading` (`section-heading.tsx`) | hergebruiken en uitbreiden | zelfde component | Props blijven; nieuw is `headingId?: string` (§4.4). Spec 02 levert het uiterlijk. |
| `Reveal`, `RevealGroup`, `RevealItem` | hergebruiken | zelfde componenten | Server components met scroll-gedreven CSS (spec 02); nooit op de hero. |

Opruimen in dezelfde stap (stap 4):

- Bestanden: `components/sections/{hero,clients,segment-accordion,metrics,trust-bar,service-ticker,process,projects,proof,assurance,about,faq}.tsx`, plus `components/ui/marquee.tsx` en `components/motion/count-up.tsx` zodra niets ze nog importeert (spec 02 §4.6).
- `lib/site.ts`: de exports onder "Homepage-data uit de JV-basis" (`metrics`, `Metric`, `usps`, `segments`, `Segment`, `steps`, `assurances`, `certification`, `clients`, `Client`, `projectPhotos`, `ProjectPhoto`) en hun lucide-imports. Spec 01 heeft ze tot stap 4 laten staan.
- messages: de hele oude namespace `home` (alle paden uit repo-inventaris §3, zoals `home.values`, `home.metricLabels`, `home.trustBar`, `home.segments`, `home.ticker`, `home.servicesSection`, `home.process`, `home.projects`, `home.proof`, `home.assurance`, `home.about`, `home.faq.heading`, `home.contactForm`) wordt vervangen door de boom van §6.2. `home.contactForm.*` heeft spec 01 in stap 3 al laten vervallen.
- Daarna: `grep -rn "framer-motion" app components` controleren; is er geen treffer meer, dan `npm uninstall framer-motion` (spec 02 §10 stap 19).

### 4.2 Homepage: sectievolgorde

`app/[locale]/page.tsx` geeft een fragment terug; `SiteHeader`, `main#inhoud`, `SiteFooter` en `SiteActionBar` komen uit de layout (spec 01 §4.22).

| # | Sectie | Component | Anker | Achtergrond | Doelgroep en vorm |
|---|---|---|---|---|---|
| 0 | Header | `SiteHeader` (spec 01) | | wit | |
| 1 | Hero met twee deuren | `HomeHero` | geen (h1 `id="home-titel"`) | wit | gedeeld; deur 1 je, deur 2 u |
| 2 | De nieuwste vacatures | `HomeVacancies` met `LatestVacancies` (spec 06) | `#vacatures` | ijs (`bg-ice`) | gedeeld kop, lege staat je |
| 3 | Vijf beroepen | `HomeBeroepen` | `#beroepen` | wit | neutraal |
| 4 | Zo werkt het, twee sporen | `HowItWorks` | `#zo-werkt-het` | ijs | spoor 1 je, spoor 2 u |
| 5 | Wat u van Groos kunt verwachten | `WhyGroos` | `#waarom-groos` | wit | wij en u |
| 6 | Jimmy en Lorenzo | `HomePeople` met `ContactPersonCard` (spec 07) | `#contactpersonen` | ijs | wij en u |
| 7 | Veelgestelde vragen | `HomeFaq` | `#veelgestelde-vragen` | wit | set 1 je, set 2 u |
| 8 | Afsluiter | `CtaBand` | `#aan-de-slag` | wit met blauw vlak | wij en u |
| 9 | Footer | `SiteFooter` (spec 01, 02, 09) | | ijs | |

Elke sectie (behalve de hero) is een `<section aria-labelledby="<kop-id>">` met binnenin `<div className="container section">`. Secties wisselen wit en ijs (spec 02 §4.5); er is precies één `.surface-brand` per pagina.

### 4.3 Homepage per sectie

#### 4.3.1 Hero met twee deuren (`HomeHero`)

**Doel.** In één scherm laten zien wat Groos is en elke bezoeker de juiste deur geven. Het merkidee "trots op goed werk" komt hier niet als slogan terug, maar in rust en feiten.

**Inhoud.** h1 met accent, een intro van twee zinnen, daaronder twee deuren naast elkaar (vanaf `md`) of onder elkaar (mobiel).

| Deel | Element | Sleutel | NL | EN |
|---|---|---|---|---|
| Kop | `h1#home-titel`, `text-hero`, rich `<accent>` | `home.hero.title` | Uitzendbureau in Den Haag voor `<accent>`praktisch werk`</accent>` | Employment agency in The Hague for `<accent>`hands-on work`</accent>` |
| Intro | `p.text-lead.text-muted-foreground` | `home.hero.intro` | Wij zoeken mensen voor glasbewassing, schoonmaak, logistiek, verhuizen en bouw en sloop in Den Haag en omgeving. Werkzoekenden en opdrachtgevers spreken bij ons steeds met Jimmy of Lorenzo. | We find people for window cleaning, cleaning, logistics, removals and construction and demolition in The Hague and the surrounding area. Job seekers and clients always speak to Jimmy or Lorenzo. |
| Deur 1, kop | `h2`, met de klasse `text-h3` | `home.hero.jobseeker.title` | Ik zoek werk | I am looking for work |
| Deur 1, tekst | `p` | `home.hero.jobseeker.body` | Bekijk de open vacatures of kies hieronder je beroep. | View the open jobs or choose your occupation below. |
| Deur 1, knop | `CtaButton` primary, `href={ROUTES.vacatures}`, icoon `Briefcase` | `common.cta.viewJobs` | Bekijk vacatures | View jobs |
| Deur 1, beroepen | `ul` met `aria-label`, vijf links | `home.hero.jobseeker.beroepenLabel` en `beroepen.<id>.enkelvoud` (spec 05) | Kies je beroep | Choose your occupation |
| Deur 2, kop | `h2`, met de klasse `text-h3` | `home.hero.employer.title` | Ik zoek personeel | I am looking for staff |
| Deur 2, tekst | `p` | `home.hero.employer.body` | Vraag mensen aan voor een dag, een paar weken of langer. | Request people for a day, a few weeks or longer. |
| Deur 2, knop 1 | `CtaButton` primary, `href={ROUTES.personeelAanvragen}`, icoon `ClipboardList` | `common.cta.requestStaff` | Personeel aanvragen | Request staff |
| Deur 2, knop 2 | `CtaButton` secondary, `href={contact.phoneHref}`, icoon `Phone`, `ariaLabel` uit `header.callAria` met `{phone}` (B-54) | `common.cta.call` | Bel ons | Call us |
| Deur 2, regel | `p.text-sm.text-muted-foreground` | `common.notes.noObligationEmployer` (spec 03) | Een aanvraag doen is vrijblijvend. | Submitting a request places you under no obligation. |

De deurkoppen zijn h2, omdat elke deur een eigen deel van de pagina is met een eigen doel; zo springt de koppenstructuur niet van h1 naar h3 (B-05 blijft gelden: één h1, h2 per deel, h3 voor itemtitels).

**Component.** `HomeHero` in `components/sections/home/home-hero.tsx`, async server component zonder props. Leest `getTranslations("home")`, `getTranslations("common")`, `getTranslations("beroepen")`, `getTranslations("header")`, `beroepen` uit `content/beroepen/index.ts`, `paths` uit `lib/routes.ts` en `contact` uit `lib/site.ts`.

```
<section aria-labelledby="home-titel" className="pt-6 pb-12 md:pt-12 md:pb-16 lg:pt-16 lg:pb-20">
  <div className="container">
    <h1 id="home-titel" className="text-hero max-w-[22ch]">…</h1>
    <p className="mt-4 max-w-[60ch] text-lead text-muted-foreground">…</p>
    <div className="mt-6 grid gap-3 md:mt-10 md:grid-cols-2 md:gap-6">
      <div className="pattern-oo flex flex-col rounded-2xl bg-brand-tint p-5 md:p-8" aria-labelledby="deur-werk">   deur 1
        <h2 id="deur-werk" className="text-h3">…</h2>
        <p className="mt-2">…</p>
        <CtaButton className="mt-4 w-full sm:w-auto">…</CtaButton>
        <ul aria-label="Kies je beroep" className="mt-3 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
          <li><CtaButton variant="secondary" size="sm" href={paths.werkenAls(id)}>{icoon}{enkelvoud}</CtaButton></li> × 5
        </ul>
      </div>
      <div className="pattern-oo flex flex-col rounded-2xl bg-brand-tint p-5 md:p-8" aria-labelledby="deur-personeel">   deur 2
        <h2 id="deur-personeel" className="text-h3">…</h2>
        <p className="mt-2">…</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <CtaButton className="w-full sm:w-auto">Personeel aanvragen</CtaButton>
          <CtaButton variant="secondary" className="w-full sm:w-auto">Bel ons</CtaButton>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">…</p>
      </div>
    </div>
  </div>
</section>
```

- De beroepenlinks gebruiken `CtaButton variant="secondary" size="sm"` (44 px hoog op mobiel, spec 02) met het icoon uit `beroepen[i].icon` als `<Icon aria-hidden className="size-4 text-brand" />`. Volgorde uit `content/beroepen/index.ts`. Geen nieuwe primitive.
- De beroepenrij scrolt onder `md` horizontaal binnen de deur (`overflow-x-auto`), zodat de deur kort blijft; de pagina zelf scrolt nooit horizontaal. Vanaf `md` lopen de links door over meerdere regels.
- De deuren hebben gelijke hoogte (`grid` met `flex flex-col`); in deur 2 staat de regel met `mt-auto` onderaan als de deur hoger is dan zijn inhoud.
- Geen foto, geen illustratie, geen reveal en geen beweging in de hero.

**Data.** `beroepen` (id, slug, icoon), `contact.phoneHref` en `contact.phone`. Geen database.

**Gedrag per breedte.**

| Breedte | Gedrag |
|---|---|
| 390 | h1 in drie regels (38 px), intro van vijf regels, deuren onder elkaar met `gap-3`; deur 1 met volle-breedteknop en de beroepenrij als één horizontaal scrollende regel; in deur 2 de twee knoppen onder elkaar op volle breedte, met "Personeel aanvragen" bovenaan. De onderkant van de knop "Personeel aanvragen" ligt binnen 844 px vanaf de bovenkant van de pagina (AC-04-02). |
| 768 | Deuren naast elkaar (`md:grid-cols-2`), beroepenlinks lopen door over twee of drie regels, knoppen in deur 2 naast elkaar. |
| 1280 | h1 op twee regels (ongeveer 60 px), intro op twee regels, deuren van ongeveer 600 px breed met `p-8`. |
| 1440 | Als 1280; de container blijft 80 rem, de marges groeien. |

**Beweging.** Alleen de hoverstijlen van `CtaButton` (spec 02). Haalt de meting op 390 px de 844 px niet, dan verkort de bouw-agent eerst `pt-6` naar `pt-4` en `mt-6` naar `mt-5`, en daarna de deurtekst; hij verplaatst geen inhoud tussen de deuren.

#### 4.3.2 De nieuwste vacatures (`HomeVacancies`)

**Doel.** Laten zien dat er nu werk is, met echte lonen, en in één klik naar de vacaturebank.

**Inhoud.** Kop, intro, vier vacaturekaarten in de variant `compact`, een link naar alle vacatures; zonder vacatures een zin en de knop "Schrijf je in".

| Deel | Sleutel | NL | EN |
|---|---|---|---|
| Kop (`title` plus `accent`, als één string meegegeven) | `home.vacatures.title`, `home.vacatures.accent` | De nieuwste vacatures / in Den Haag en omgeving | The latest jobs / in The Hague and the surrounding area |
| Intro | `home.vacatures.intro` | Bij elke vacature staan het bruto uurloon, de uren en de plaats. Solliciteren kan in een paar minuten, ook zonder cv. | Every job shows the gross hourly wage, the hours and the location. Applying takes a few minutes, even without a CV. |
| Link naar alles | `common.cta.viewAllJobs` (spec 03) | Bekijk alle vacatures | View all jobs |
| Lege staat | `home.vacatures.emptyJobseeker` | Er staan nu geen vacatures online. Schrijf je in, dan bellen wij je zodra er werk is dat bij je past. | There are no jobs online right now. Register with us and we will call you as soon as there is work that suits you. |

**Component.** `HomeVacancies` in `components/sections/home/home-vacancies.tsx`, async server component met props `{ locale: Locale }`:

```tsx
<div id="vacatures" className="bg-ice">
  <div className="container section">
    <Suspense fallback={<VacancyListSkeleton count={4} variant="compact" />}>
      <LatestVacancies
        locale={locale}
        heading={`${t("vacatures.title")} ${t("vacatures.accent")}`}
        headingId="home-vacatures-titel"
        intro={t("vacatures.intro")}
        limit={4}
        variant="compact"
        viewAll={{ href: ROUTES.vacatures, label: tCommon("cta.viewAllJobs") }}
        emptyText={t("vacatures.emptyJobseeker")}
      />
    </Suspense>
  </div>
</div>
```

`LatestVacancies` (spec 06 §4.8) rendert zelf de `<section aria-labelledby>`, de h2, de intro, de lijst `VacancyList` met kaarttitels als h3, de link naar `/vacatures` en bij nul vacatures de lege tekst met de knop "Schrijf je in" naar `/inschrijven`. Deze spec kiest `limit={4}`, omdat `VacancyList` vanaf `md` twee kolommen heeft en vier kaarten dan een rustig blok van twee bij twee geven. De kop gaat als platte string mee; het accent heeft hier dus geen kleur (§12, punt 3).

**Data.** `getLatestVacancies({ limit: 4 })` via `LatestVacancies` (spec 10, gecachet met tag `vacatures` en `revalidate: 3600`). De homepage heeft `export const revalidate = 3600` (spec 01 §4.1).

**Gedrag per breedte.**

| Breedte | Gedrag |
|---|---|
| 390 | Vier compacte kaarten onder elkaar, link naar alle vacatures eronder. |
| 768 | Twee kolommen, twee rijen. |
| 1280 en 1440 | Twee kolommen binnen de container; kop en intro links boven de lijst. |

**Beweging.** Geen eigen beweging; kaarten hebben de hoverstijl van spec 06. Het skelet heeft de maat van vier compacte kaarten (geen CLS).

#### 4.3.3 Vijf beroepen (`HomeBeroepen`)

**Doel.** Beide doelgroepen per beroep doorsturen en de tien beroepspagina's intern linken (spec 12 §7.8).

**Inhoud.** Kop, intro, vijf kaarten. Elke kaart: `IconTile` met het beroepsicoon, h3 met de beroepsnaam, één zin over het werk en twee tekstlinks.

| Deel | Sleutel | NL | EN |
|---|---|---|---|
| Kop | `home.beroepen.title`, `home.beroepen.accent` | Werk en personeel in / vijf praktische beroepen | Work and staff in / five hands-on occupations |
| Intro | `home.beroepen.intro` | Kies een beroep en lees wat het werk inhoudt. Werkzoekenden vinden er vacatures en uurlonen, opdrachtgevers lezen hoe zij mensen aanvragen. | Choose an occupation and read what the work involves. Job seekers will find jobs and hourly wages, clients can read how to request people. |
| Link werkzoekende | `home.beroepen.jobseekerLink` met `{occupation}` in kleine letters | Werken als {occupation} | Work as a {occupation} |
| Link opdrachtgever | `home.beroepen.employerLink` met `{occupationPlural}` in kleine letters | Huur {occupationPlural} in | Hire {occupationPlural} |
| Kaarttitel (h3) | `beroepen.<id>.enkelvoud` (spec 05) | Glazenwasser, Schoonmaker, enzovoort | Window cleaner, Cleaner, enzovoort |
| Kaarttekst | `home.beroepen.items.glazenwasser.body` | Glazenwassers maken ramen, gevels en zonnepanelen schoon, vaak op hoogte met een hoogwerker. | Window cleaners clean windows, facades and solar panels, often at height from an aerial platform. |
| | `home.beroepen.items.schoonmaker.body` | Schoonmakers houden kantoren, scholen, hotels en nieuwe woningen schoon, vaak vroeg in de ochtend of in de avond. | Cleaners keep offices, schools, hotels and new homes clean, often early in the morning or in the evening. |
| | `home.beroepen.items.logistiek-medewerker.body` | Logistiek medewerkers pakken orders, laden en lossen vrachtwagens en houden het magazijn op orde. | Logistics workers pick orders, load and unload lorries and keep the warehouse in order. |
| | `home.beroepen.items.verhuizer.body` | Verhuizers pakken in, dragen meubels en zetten alles op de nieuwe plek weer neer, bij huizen en kantoren. | Movers pack, carry furniture and set everything up again at the new address, for homes and offices. |
| | `home.beroepen.items.hulpkracht-bouw-en-sloop.body` | Hulpkrachten bouw en sloop helpen vakmensen op de bouwplaats met sjouwen, opruimen en sloopwerk. | Construction and demolition labourers help skilled workers on site with carrying, clearing up and demolition work. |

De parameters zijn `beroepen.<id>.enkelvoud` en `.meervoud` met `toLocaleLowerCase(locale)` (spec 03 §6.8). De linknamen zijn per kaart uniek ("Werken als glazenwasser", "Huur glazenwassers in"), dus een schermlezer hoort waar elke link heen gaat.

**Component.** `HomeBeroepen` in `components/sections/home/home-beroepen.tsx`, async server component zonder props. Per kaart `Card variant="default"` (spec 02) met `CardTitle as="h3"`; de kaart zelf is niet klikbaar, want hij heeft twee links. Links met `Link` uit `@/i18n/navigation` en de klasse `link`, met `ArrowRight` (`size-4`, `aria-hidden`, schuift 2 px op bij hover). Lijst als `<ul role="list">` met `<li>` per kaart, in `RevealGroup`.

**Data.** `beroepen` uit `content/beroepen/index.ts`, `paths.werkenAls(id)`, `paths.werkgeverBeroep(id)`.

**Gedrag per breedte.**

| Breedte | Gedrag |
|---|---|
| 390 | Eén kolom; per kaart icoon en titel op één regel, tekst eronder, de twee links onder elkaar met minimaal 44 px klikhoogte (`inline-flex min-h-11 items-center`). |
| 768 | `md:grid-cols-2`; de vijfde kaart `md:col-span-2`. |
| 1280 en 1440 | `lg:grid-cols-6`; kaart 1 tot en met 3 `lg:col-span-2`, kaart 4 en 5 `lg:col-span-3`, zodat de rijen drie en twee kaarten van gelijke hoogte hebben. |

**Beweging.** `RevealGroup` op de lijst (CSS, spec 02); hover op de links.

#### 4.3.4 Zo werkt het, twee sporen (`HowItWorks`)

**Doel.** Beide doelgroepen weten vooraf wat er gebeurt na hun eerste stap.

**Inhoud.** Kop en intro, daaronder twee kaarten (sporen), elk met een h3, een genummerde lijst van drie stappen en een knop.

| Deel | Sleutel | NL | EN |
|---|---|---|---|
| Kop | `home.steps.title`, `home.steps.accent` | Van eerste contact tot / de eerste werkdag | From first contact to / the first working day |
| Intro | `home.steps.intro` | Werk zoeken en personeel aanvragen gaat bij Groos in drie stappen. Zo weet iedereen vooraf wat er gebeurt. | Finding work and requesting staff at Groos takes three steps. That way everyone knows in advance what will happen. |
| Spoor 1, kop (h3) | `home.steps.jobseeker.title` | Voor werkzoekenden | For job seekers |
| Stap 1 | `home.steps.jobseeker.steps[0]` | Solliciteer of schrijf je in · Kies een vacature of schrijf je in zonder vacature, een cv is niet nodig. | Apply or register · Choose a job or register without one, you do not need a CV. |
| Stap 2 | `home.steps.jobseeker.steps[1]` | Wij bellen je · Jimmy of Lorenzo belt je om te horen welk werk je zoekt en wanneer je kunt werken. | We call you · Jimmy or Lorenzo calls you to hear what work you are looking for and when you can work. |
| Stap 3 | `home.steps.jobseeker.steps[2]` | Je begint · Past het werk, dan spreken wij samen je eerste werkdag, je uren en je uurloon af. | You start · If the work suits you, we agree your first working day, your hours and your hourly wage together. |
| Spoor 1, knop | `common.cta.viewJobs` | Bekijk vacatures | View jobs |
| Spoor 2, kop (h3) | `home.steps.employer.title` | Voor werkgevers | For employers |
| Stap 1 | `home.steps.employer.steps[0]` | Vraag personeel aan · U vertelt ons welke mensen u zoekt, vanaf wanneer en voor hoe lang. | Request staff · You tell us which people you need, from when and for how long. |
| Stap 2 | `home.steps.employer.steps[1]` | Wij stellen mensen voor · Wij bespreken het werk en de werktijden met u en stellen daarna mensen voor die passen. | We propose people · We discuss the work and the working hours with you and then propose people who fit. |
| Stap 3 | `home.steps.employer.steps[2]` | Het werk begint · Wij houden contact met u en de medewerker zolang de inzet loopt. | The work starts · We stay in touch with you and the worker for as long as the assignment runs. |
| Spoor 2, knop | `common.cta.requestStaff` | Personeel aanvragen | Request staff |

In de tabel scheidt "·" de stapnaam (`title`) van de staptekst (`body`).

**Component.** `HowItWorks` in `components/sections/home/how-it-works.tsx`, async server component zonder props. Per spoor `Card variant="default"` met `p-6 md:p-8`, `CardTitle as="h3"`, een `<ol>` met per stap een `<li className="grid grid-cols-[auto_1fr] gap-4">`: links het stapnummer als decoratief cijfer (`<span aria-hidden className="font-display text-h1 leading-none text-brand-subtle tabular-nums">1</span>`, kleur alleen op wit, spec 02 §4.1), rechts de stapnaam als `<p className="font-display font-semibold">` en de tekst als `<p className="text-muted-foreground">`. De stapnamen zijn geen koppen: de sporen zijn de items (B-05). Onderaan elk spoor staat een `CtaButton variant="secondary"` met `mt-auto`; beide knoppen zijn secundair, omdat de hero de primaire knoppen al heeft. De `<ol>` levert de nummering voor schermlezers; het zichtbare cijfer is `aria-hidden`.

**Data.** `t.raw("steps.jobseeker.steps")` en `t.raw("steps.employer.steps")` als `{ title: string; body: string }[]`, elk precies drie lang in nl en en.

**Gedrag per breedte.**

| Breedte | Gedrag |
|---|---|
| 390 | Sporen onder elkaar; cijfers 33 px; knop volle breedte. |
| 768 | Sporen onder elkaar, knop `w-auto`. |
| 1280 en 1440 | `lg:grid-cols-2 lg:gap-8`, sporen naast elkaar met gelijke hoogte, knop met `mt-auto` onderaan. |

**Beweging.** `RevealGroup` op de twee sporen.

#### 4.3.5 Wat u van Groos kunt verwachten (`WhyGroos`)

**Doel.** Vertrouwen met alleen feiten die kloppen (B-26, R-12). Het merkidee "trots op goed werk" klinkt in de intro als belofte die zichzelf beperkt.

| Deel | Sleutel | NL | EN |
|---|---|---|---|
| Kop | `home.why.title`, `home.why.accent` | Wat u van Groos / kunt verwachten | What you can / expect from Groos |
| Intro | `home.why.intro` | Wij beloven alleen wat wij kunnen waarmaken. Dit zijn de vaste afspraken voor iedereen die met Groos werkt. | We only promise what we can deliver. These are the fixed arrangements for everyone who works with Groos. |
| Kaart 1 (icoon `Users`) | `home.why.items.contactpersonen` | Twee vaste contactpersonen · U spreekt steeds met Jimmy of Lorenzo. Hun 06-nummers staan op deze site en bij elke vacature. | Two dedicated contacts · You always speak to Jimmy or Lorenzo. Their mobile numbers are on this site and with every job. |
| Kaart 2 (icoon `Briefcase`) | `home.why.items.beroepen` | Vijf praktische beroepen · Groos richt zich op glasbewassing, schoonmaak, logistiek, verhuizen en bouw en sloop. Per beroep staat op deze site wat het werk inhoudt. | Five hands-on occupations · Groos focuses on window cleaning, cleaning, logistics, removals and construction and demolition. For each occupation this site explains what the work involves. |
| Kaart 3 (icoon `Euro`) | `home.why.items.loon` | Eerlijk over loon · Bij elke vacature staat het bruto uurloon. Volgens de wet krijgt een uitzendkracht hetzelfde loon als vaste collega's in dezelfde functie. | Honest about pay · Every job shows the gross hourly wage. By law a temporary worker receives the same pay as permanent colleagues in the same role. |
| Kaart 4 (icoon `MessageCircle`) | `home.why.items.solliciteren` | Solliciteren op drie manieren · Werkzoekenden solliciteren via het formulier, met een WhatsApp-bericht of met een telefoontje. Een cv is daarbij niet nodig. | Three ways to apply · Job seekers apply through the form, with a WhatsApp message or with a phone call. A CV is not needed. |

**Component.** `WhyGroos` in `components/sections/home/why-groos.tsx`, async server component zonder props. Constante in hetzelfde bestand (alleen structuur, geen tekst):

```ts
const WHY_ITEMS = [
  { key: "contactpersonen", icon: Users },
  { key: "beroepen", icon: Briefcase },
  { key: "loon", icon: Euro },
  { key: "solliciteren", icon: MessageCircle },
] as const satisfies readonly { key: string; icon: LucideIcon; claim?: ClaimKey }[];
```

Per item een `Card variant="default"` met `IconTile tone="tint"`, `CardTitle as="h3"` en `CardDescription`. Items met een `claim` worden gefilterd met `withConfirmedClaims` (spec 03); nu heeft geen item een claim. Komt B-24 rond (claim `keurmerk`), dan krijgt de lijst een vijfde item `{ key: "keurmerk", icon: ShieldCheck, claim: "keurmerk" }` met sleutels `home.why.items.keurmerk.{title,body}` en een registerlink; dat bouwt de agent pas na bevestiging.

**Gedrag per breedte.** 390: één kolom. 768: `md:grid-cols-2`. 1280 en 1440: `lg:grid-cols-4`, kaarten van gelijke hoogte. Kop links uitgelijnd met `SectionHeading`.

**Beweging.** `RevealGroup` op de kaarten.

#### 4.3.6 Jimmy en Lorenzo (`HomePeople`)

**Doel.** De twee vaste gezichten tonen, zonder foto's (B-25), met directe nummers (B-21).

| Deel | Sleutel | NL | EN |
|---|---|---|---|
| Kop | `home.people.title`, `home.people.accent` | Bij Groos spreekt u / Jimmy of Lorenzo | At Groos you speak to / Jimmy or Lorenzo |
| Intro | `home.people.intro` | Zij plaatsen de vacatures, spreken werkzoekenden en bespreken aanvragen met opdrachtgevers. Bel of app hen gerust met een vraag over werk of personeel. | They post the jobs, talk to job seekers and discuss requests with clients. Feel free to call or message them with a question about work or staff. |
| Link | `home.people.aboutLink` | Lees meer over Groos | Read more about Groos |

**Component.** `HomePeople` in `components/sections/home/home-people.tsx`, async server component met props `{ locale: Locale }`. Rendert `SectionHeading` (met `headingId="home-mensen-titel"`), daaronder `<ul role="list" className="mt-10 grid gap-4 sm:grid-cols-2 lg:max-w-4xl">` met per persoon uit `people` (`lib/site.ts`) een `<li><ContactPersonCard person={person} locale={locale} headingLevel="h3" /></li>`, en onder de lijst een `Link` naar `ROUTES.overOns` met de klasse `link` en `ArrowRight`.

`ContactPersonCard` (spec 07, `components/contact/contact-person-card.tsx`) toont de initiaal in een cirkel (spec 02 §4.9 punt 6), de voornaam als h3, het nummer als `tel:`-link en de knoppen Bellen en, alleen bij `person.whatsapp`, WhatsApp. Deze spec bouwt geen eigen personenkaart. Heeft de kaart van spec 07 nog geen foto-ondersteuning wanneer er foto's komen, dan regelt spec 07 dat via `person.photo`.

**Gedrag per breedte.** 390: kaarten onder elkaar. 640 en breder: twee kaarten naast elkaar (`sm:grid-cols-2`). 1280 en 1440: het raster blijft maximaal 56 rem breed, links uitgelijnd onder de kop.

**Beweging.** `Reveal` op de lijst.

#### 4.3.7 Veelgestelde vragen (`HomeFaq`)

**Doel.** De vijf belangrijkste vragen per doelgroep beantwoorden, zonder onbevestigde claims (spec 03 §6.11).

**Inhoud.** Kop, een keuze tussen twee sets (tabs zonder JavaScript), per set vijf uitklapvragen en een link naar de doelgroeppagina.

| Deel | Sleutel | NL | EN |
|---|---|---|---|
| Kop | `home.faq.title`, `home.faq.accent` | Veelgestelde vragen over / werk en personeel | Frequently asked questions about / work and staff |
| Legenda (sr-only) | `home.faq.switchLabel` | Vragen voor | Questions for |
| Tab 1 | `home.faq.jobseeker.tab` | Werkzoekenden | Job seekers |
| Tab 2 | `home.faq.employer.tab` | Werkgevers | Employers |
| Link set 1 | `home.faq.jobseeker.moreLink` | Meer over werken via Groos | More about working through Groos |
| Link set 2 | `home.faq.employer.moreLink` | Meer over personeel inhuren | More about hiring staff |

Vragen en antwoorden voor werkzoekenden (je-vorm, B1), `home.faq.jobseeker.items[]`:

| # | Vraag NL | Antwoord NL | Status (spec 03 §6.11) |
|---|---|---|---|
| 1 | Kost solliciteren of inschrijven geld? | Nee, solliciteren en inschrijven zijn altijd gratis. Groos vraagt nooit geld voor werk, een contract of een sollicitatie. Vraagt iemand dat toch uit onze naam, meld het ons dan. | A |
| 2 | Heb ik een cv nodig om te solliciteren? | Nee, een cv is niet nodig. Je vult een paar gegevens in, zoals je naam en je telefoonnummer, en wij bespreken je ervaring aan de telefoon. | A, B |
| 3 | Moet ik Nederlands spreken? | Dat verschilt per vacature. Bij elke vacature staat of je Nederlands nodig hebt voor het werk. Deze site is ook in het Engels te lezen. | A |
| 4 | Wat verdien ik? | Het bruto uurloon staat bij elke vacature. Volgens de wet krijg je hetzelfde loon als vaste collega's die hetzelfde werk doen. Daarnaast bouw je vakantiegeld op. | A |
| 5 | Krijg ik veiligheidsschoenen en andere beschermingsmiddelen? | Ja, beschermingsmiddelen zoals veiligheidsschoenen, handschoenen of een helm krijg je gratis als het werk daarom vraagt. Wij vertellen je vooraf wat je op je eerste werkdag nodig hebt. | A, B |

Vragen en antwoorden voor werkgevers (u-vorm, vraag in de stem van de bezoeker), `home.faq.employer.items[]`:

| # | Vraag NL | Antwoord NL | Status |
|---|---|---|---|
| 1 | Wat kost een uitzendkracht? | Het tarief hangt af van het beroep, het aantal uren, de werktijden en de duur van de inzet. Na uw aanvraag sturen wij u een voorstel met een uurtarief. | A, B |
| 2 | Voor hoe lang kan ik personeel inhuren? | Dat bepaalt u zelf, ook als het om één dag gaat. Wij stemmen het aantal mensen en de uren af op uw planning. | A |
| 3 | Wie is mijn vaste contactpersoon? | U heeft contact met Jimmy of Lorenzo, die uw aanvraag zelf afhandelen. Hun nummers staan op deze site, zodat u hen direct kunt bellen. | A |
| 4 | Krijgen jullie mensen hetzelfde loon als mijn vaste medewerkers? | Ja, dat schrijft de wet voor met de gelijkwaardige beloning. Een uitzendkracht krijgt hetzelfde loon en dezelfde vergoedingen als uw vaste medewerkers in dezelfde functie. Daarom vragen wij bij uw aanvraag naar de beloning in uw bedrijf. | A |
| 5 | Wie zorgt voor veiligheid op de werkplek? | Als opdrachtgever zorgt u volgens de Arbowet voor een veilige werkplek en voor uitleg over het werk. Wij spreken vooraf met u af welke certificaten en beschermingsmiddelen nodig zijn. | A, B |

De Engelse vragen en antwoorden staan in §6.3.

**Component.** `HomeFaq` in `components/sections/home/home-faq.tsx`, async server component zonder props. De wissel tussen de sets is een groep van twee native keuzerondjes; de zichtbaarheid regelt CSS met `:has()`. Er is geen clientcomponent en geen base-ui `Tabs` (spec 02 sluit `Tabs` uit voor inhoud die geïndexeerd moet worden).

```
import { ROUTES } from "@/lib/routes";

<section id="veelgestelde-vragen" aria-labelledby="home-faq-titel" className="group/faq">
  <div className="container section">
    <SectionHeading headingId="home-faq-titel" title=… accent=… />
    <fieldset className="mt-8 inline-flex rounded-lg bg-muted p-1">
      <legend className="sr-only">Vragen voor</legend>
      <label className="relative inline-flex h-11 cursor-pointer items-center rounded-md px-4 text-sm font-medium text-muted-foreground
                        has-[:checked]:bg-background has-[:checked]:text-foreground has-[:checked]:shadow-xs
                        has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring">
        <input type="radio" name="faq-doelgroep" id="faq-tab-werkzoekende" value="werkzoekende" defaultChecked className="sr-only" />
        Werkzoekenden
      </label>
      <label …><input type="radio" name="faq-doelgroep" id="faq-tab-werkgever" value="werkgever" className="sr-only" />Werkgevers</label>
    </fieldset>
    <div className="mt-6 max-w-3xl">
      <div data-faq="werkzoekende" className="group-has-[#faq-tab-werkgever:checked]/faq:hidden">
        <h3 className="sr-only">Werkzoekenden</h3>
        <Accordion>{items.map((i) => <AccordionItem name="faq-werkzoekende" title={i.q}>{i.a}</AccordionItem>)}</Accordion>
        <Link className="link mt-6 inline-flex" href={ROUTES.werkzoekenden}>Meer over werken via Groos</Link>
      </div>
      <div data-faq="werkgever" className="hidden group-has-[#faq-tab-werkgever:checked]/faq:block">
        <h3 className="sr-only">Werkgevers</h3>
        <Accordion>…</Accordion>
        <Link className="link mt-6 inline-flex" href={ROUTES.werkgevers}>Meer over personeel inhuren</Link>
      </div>
    </div>
  </div>
</section>
```

- Een `<form>` is niet nodig: de keuzerondjes sturen niets op, ze schakelen alleen zichtbaarheid.
- Toetsenbord: Tab gaat naar de geselecteerde keuze, pijltjes wisselen de set (native radiogedrag), Tab gaat daarna naar de eerste vraag.
- Browsers zonder `:has()` (minder dan 5 procent) zien alleen de set voor werkzoekenden en de link naar `/werkgevers`; de werkgeversvragen staan dan nog wel in de HTML en in de JSON-LD. Werkt `group-has-[…]` in Tailwind 4.3 niet zoals verwacht, dan zet de bouw-agent twee regels in een `<style>`-blok onderaan de component met dezelfde selectors; het component blijft een server component.
- Antwoorden staan in de DOM, ook dichtgeklapt (`<details>`), zodat de FAQPage-tekst zichtbaar is (spec 12 §7.3).
- Items gaan door `withConfirmedClaims` (spec 03); nu heeft geen item een `claim`. Dezelfde gefilterde lijst voedt `faqLd` (§7).

**Gedrag per breedte.** 390: wissel volle breedte (`w-full` met twee gelijke labels via `grid grid-cols-2`), vragen volle breedte. 768: wissel `inline-flex`, vragen maximaal 48 rem. 1280 en 1440: `lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16`: links de kop en de wissel (`lg:sticky lg:top-24`), rechts de vragen.

**Beweging.** Openen via `::details-content` (spec 02, 200 ms); geen reveal op de vragen zelf, wel op de kop via `SectionHeading`.

#### 4.3.8 Afsluiter (`CtaBand`)

**Doel.** Eén laatste, duidelijke stap voor beide doelgroepen, met het nummer zichtbaar.

| Deel | Sleutel | NL | EN |
|---|---|---|---|
| Kop | `home.cta.title`, `home.cta.accent` | Eén telefoontje is genoeg / om te beginnen | One phone call is enough / to get started |
| Tekst (rich `<link>`) | `home.cta.body` | Bel of app ons op `<link>`{phone}`</link>`. Wie liever eerst rondkijkt, kiest hieronder de route die past. | Call or message us on `<link>`{phone}`</link>`. If you would rather look around first, choose the route that suits you below. |
| Knop 1 | `common.cta.requestStaff` → `/werkgevers/personeel-aanvragen` | Personeel aanvragen | Request staff |
| Knop 2 | `common.cta.viewJobs` → `/vacatures` | Bekijk vacatures | View jobs |

**Component.** `CtaBand` in `components/sections/cta-band.tsx`, server component, herbruikbaar (spec 05 mag hem ook gebruiken):

```ts
type CtaBandAction = {
  href: string;                       // "/…" wordt Link; tel:, mailto: en https: worden <a>
  label: string;
  variant: "primary" | "secondary";
  icon?: ReactNode;                   // gerenderd element, bijvoorbeeld <Phone aria-hidden />
  ariaLabel?: string;
  external?: boolean;
};
type CtaBandProps = {
  id?: string;                        // sectieanker
  headingId: string;
  title: string;
  accent?: string;
  body: ReactNode;                    // de aanroeper levert t.rich(...)
  actions: CtaBandAction[];           // 1 tot 3
  className?: string;
};
```

Opbouw volgens het recept van spec 02 §4.13: `<section id aria-labelledby className="section-tight"><div className="container"><div className="surface-brand pattern-oo rounded-2xl p-8 md:p-12">` met h2 (`title` plus `<span className="accent-text">{accent}</span>`), `<p className="mt-4 max-w-[60ch] text-lead text-muted-foreground">` en een `<div className="mt-8 flex flex-col gap-3 sm:flex-row">` met de knoppen. De `<link>` in de tekst wordt `<a href={contact.phoneHref} className="font-semibold underline underline-offset-4">`. Binnen `.surface-brand` worden de primaire knop wit met kobalt tekst en de secundaire wit omlijnd (spec 02).

**Gedrag per breedte.** 390: knoppen onder elkaar volle breedte, `p-8`. 768 en breder: knoppen naast elkaar. 1280 en 1440: `p-12`, tekst maximaal 60 tekens breed, knoppen links uitgelijnd.

**Beweging.** `Reveal` op het blauwe vlak.

#### 4.3.9 Footer

De footer komt uit de layout (spec 01 §4.8, uiterlijk spec 02 §4.13, vermeldingen spec 09). Deze spec voegt niets toe. De footer staat op ijs na een witte afsluitersectie.

### 4.4 Uitbreiding van `SectionHeading`

`components/sections/section-heading.tsx` krijgt één optionele prop, zodat secties hun `aria-labelledby` aan de kop kunnen koppelen. Bestaande aanroepen blijven werken.

```ts
type SectionHeadingProps = {
  title: string;
  accent?: string;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Nieuw: id op de h2, voor aria-labelledby van de sectie. */
  headingId?: string;
};
```

De h2 rendert `{title} <span className="accent-text">{accent}</span>` met een spatie ertussen; het uiterlijk (`text-h2`, intro `text-lead text-muted-foreground max-w-[60ch]`) komt uit spec 02 §10 stap 14.

### 4.5 `/over-ons`: sectievolgorde

`app/[locale]/over-ons/page.tsx`, statisch (`revalidate = false`, spec 01 §4.1). Gedeelde pagina in wij-zinnen met u als standaard (B-04); geen je-blok.

| # | Sectie | Component | Anker | Achtergrond |
|---|---|---|---|---|
| 1 | Kruimelpad, h1 en lead | `AboutHero` | geen (h1 `id="over-ons-titel"`) | wit |
| 2 | Wat de naam betekent | `AboutStory` | `#verhaal` | wit |
| 3 | Jimmy en Lorenzo | `AboutPeople` met `ContactPersonCard` | `#contactpersonen` | ijs |
| 4 | Werkgebied en adres | `AboutArea` | `#werkgebied` | wit |
| 5 | Zo werken wij | `AboutApproach` | `#werkwijze` | ijs |
| 6 | Contact | `CtaBand` | `#contact` | wit met blauw vlak |

Alle componenten in `components/sections/about/*`, async server components zonder props tenzij vermeld.

#### 4.5.1 `AboutHero`

`<Breadcrumbs items={[{ label: t("header.nav.overOns"), href: ROUTES.overOns }]} />` (spec 01 §4.9, rendert ook `BreadcrumbList`), daarna h1 en lead in `container pt-6 pb-10 md:pt-10 md:pb-14`.

| Deel | Sleutel | NL | EN |
|---|---|---|---|
| h1 (`text-h1`, rich `<accent>`) | `about.hero.title` | Groos is een oud woord voor `<accent>`trots`</accent>` | Groos is an old Dutch word for `<accent>`pride`</accent>` |
| Lead | `about.hero.intro` | Wij zijn een uitzendbureau uit Den Haag voor glasbewassing, schoonmaak, logistiek, verhuizen en bouw en sloop. Jimmy en Lorenzo leiden Groos samen en zijn de vaste contactpersonen. | We are an employment agency in The Hague for window cleaning, cleaning, logistics, removals and construction and demolition. Jimmy and Lorenzo run Groos together and are the dedicated contacts. |

Gedrag: op 390 px h1 in twee of drie regels; op 1280 px één of twee regels met `max-w-[22ch]`. Geen beweging.

#### 4.5.2 `AboutStory`

**Doel.** Het merkidee "trots op goed werk" uitleggen zonder grootspraak (context/12 §4.2).

| Deel | Sleutel | NL | EN |
|---|---|---|---|
| Kop | `about.story.title`, `about.story.accent` | Wat trots betekent in / ons werk | What pride means / in our work |
| Alinea 1 | `about.story.paragraphs[0]` | Groos is een oud Nederlands woord voor trots, dat in Zeeland en Rotterdam nog wordt gebruikt. Wij kozen die naam omdat het werk van onze mensen vaak onzichtbaar blijft, terwijl iedereen er elke dag op rekent. | Groos is an old Dutch word for pride that is still used in Zeeland and Rotterdam. We chose the name because the work our people do often goes unseen, while everyone relies on it every day. |
| Alinea 2 | `about.story.paragraphs[1]` | Schone ramen, een opgeruimd magazijn en een verhuizing die op tijd klaar is, vallen pas op als ze ontbreken. Wij vinden dat dit werk respect verdient, in het loon, in de planning en in hoe wij met mensen omgaan. | Clean windows, a tidy warehouse and a move that finishes on time only stand out when they are missing. We believe this work deserves respect, in the pay, in the planning and in how we treat people. |
| Alinea 3 | `about.story.paragraphs[2]` | Voor opdrachtgevers betekent trots dat wij mensen voorstellen die hun werk goed willen doen. Voor werkzoekenden betekent het dat wij eerlijk zijn over het loon, de uren en het werk zelf. | For clients, pride means that we propose people who want to do their work well. For job seekers, it means that we are honest about the pay, the hours and the work itself. |
Het oprichtingsverhaal heeft nu geen sleutel in messages (nl en en). Zolang `isClaimConfirmed("foundingStory")` onwaar is (spec 03 §5.1), rendert `AboutStory` voor de oprichting niets: geen alinea, geen lege regel en geen TODO. De open claim blijft zichtbaar via de TODO-regel van `foundingStory` in `lib/claims.ts`, die `npm run check` meldt. Na bevestiging voegt de schrijver de sleutel `about.story.founding` toe in nl en en, met twee zinnen volgens sjabloon AS-12 (spec 03), en rendert `AboutStory` die als vierde alinea achter de claim.

Opbouw: `SectionHeading` met `headingId="over-ons-verhaal-titel"`, daarna `<div className="mt-8 measure space-y-5 text-base">` met de alinea's. Op 1280 px staat de kop links (`lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16`) en de tekst rechts. `Reveal` op de tekst.

#### 4.5.3 `AboutPeople` (props `{ locale: Locale }`)

| Deel | Sleutel | NL | EN |
|---|---|---|---|
| Kop | `about.people.title`, `about.people.accent` | De mensen achter / Groos | The people behind / Groos |
| Intro | `about.people.intro` | Bij Groos heeft u steeds contact met dezelfde twee mensen. Bel of app hen gerust met een vraag over werk of personeel. | At Groos you always deal with the same two people. Feel free to call or message them with a question about work or staff. |

Zelfde raster als `HomePeople` (§4.3.6) met `ContactPersonCard`, zonder de link naar over ons. Komen er foto's (B-25), dan toont `ContactPersonCard` die; deze sectie verandert niet.

#### 4.5.4 `AboutArea`

| Deel | Sleutel | NL | EN |
|---|---|---|---|
| Kop | `about.area.title`, `about.area.accent` | Een Haags bureau voor / Den Haag en omgeving | An agency from The Hague for / The Hague and the surrounding area |
| Alinea 1 | `about.area.paragraphs[0]` | Groos is gevestigd aan het Hugo Coenraadspad in Den Haag. Langskomen kan alleen op afspraak, dus bel of app ons even van tevoren. | Groos is based on Hugo Coenraadspad in The Hague. Visits are by appointment only, so please call or message us beforehand. |
| Alinea 2 | `about.area.paragraphs[1]` | Wij zoeken werk en personeel in Den Haag en de gemeenten eromheen. Bij elke vacature staat precies waar het werk is. | We look for work and staff in The Hague and the surrounding municipalities. Every job states exactly where the work is. |
| Plaatsen, inleiding (achter claim) | `about.area.placesIntro` | Wij werken onder meer in deze plaatsen: | We work in places including: |
| Plaatsen (achter claim) | `about.area.places[]` | Den Haag, Delft, Leidschendam-Voorburg, Midden-Delfland, Pijnacker-Nootdorp, Rijswijk, Wassenaar, Westland, Zoetermeer | The Hague, Delft, Leidschendam-Voorburg, Midden-Delfland, Pijnacker-Nootdorp, Rijswijk, Wassenaar, Westland, Zoetermeer |
| Adreskop (h3) | `common.contact.address` (spec 03) | Adres | Address |

- De plaatsenlijst (Haaglanden, context/02) staat alleen op de pagina als `isClaimConfirmed("workArea")` waar is (spec 03 woordenlijst: "Haaglanden" en plaatsnamen pas na bevestiging). Tot dan noemt de copy "Den Haag en omgeving".
- Adresblok rechts (vanaf `lg`) of onder de tekst: `Card variant="tint"` met h3 en `<address className="not-italic">` met `contact.name`, `contact.street`, `contact.postalCode contact.city` en `common.address.byAppointment`, alle waarden uit `lib/site.ts` (spec 12 §7.5: geen adres als losse tekst in messages). Geen kaart en geen kaartdienst van derden (spec 14 §8.5).
- Gedrag: 390 en 768 onder elkaar; 1280 en 1440 `lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12`. `Reveal` op het adresblok.

#### 4.5.5 `AboutApproach`

| Deel | Sleutel | NL | EN |
|---|---|---|---|
| Kop | `about.approach.title`, `about.approach.accent` | Zo werken wij met / werkzoekenden en opdrachtgevers | This is how we work with / job seekers and clients |
| Intro | `about.approach.intro` | Een klein bureau werkt anders dan een grote keten. Dit zijn de vier gewoontes die bij Groos altijd gelden. | A small agency works differently from a large chain. These are the four habits that always apply at Groos. |
| Item 1 (`MessagesSquare`) | `about.approach.items.kennismaken` | Eerst kennismaken · Wij bellen werkzoekenden om kennis te maken en bespreken elke aanvraag met de opdrachtgever. Zo weten wij wat iemand zoekt en wat het werk vraagt. | Getting to know each other first · We call job seekers to get to know them and discuss every request with the client. That way we know what someone is looking for and what the work requires. |
| Item 2 (`ClipboardCheck`) | `about.approach.items.afspraken` | Afspraken vooraf · Uurloon, uren en werktijden zijn bekend voordat iemand begint. Bij elke vacature staat het bruto uurloon al vermeld. | Agreements in advance · Hourly wage, hours and working times are known before anyone starts. Every job already states the gross hourly wage. |
| Item 3 (`Phone`) | `about.approach.items.contact` | Contact tijdens het werk · Wij houden contact met de medewerker en de opdrachtgever zolang het werk loopt. Gaat er iets mis, dan zoeken wij samen een oplossing. | Contact during the work · We stay in touch with the worker and the client for as long as the work runs. If something goes wrong, we look for a solution together. |
| Item 4 (`ShieldCheck`) | `about.approach.items.kosten` | Nooit geld voor werk · Groos vraagt nooit geld voor werk, een contract of een sollicitatie. Wie zo'n verzoek uit onze naam krijgt, kan het direct bij ons melden. | Never money for work · Groos never asks for money for work, a contract or an application. Anyone who receives such a request in our name can report it to us straight away. |

Constante `APPROACH_ITEMS` in het bestand (sleutel en icoon), net als `WHY_ITEMS`. Kaarten `Card variant="default"` met `IconTile tone="tint"`, `CardTitle as="h3"`. 390: één kolom; 768: twee; 1280 en 1440: twee kolommen naast de kop of vier op een rij (`lg:grid-cols-2 xl:grid-cols-4`). `RevealGroup`.

#### 4.5.6 Contact (`CtaBand`)

| Deel | Sleutel | NL | EN |
|---|---|---|---|
| Kop | `about.cta.title`, `about.cta.accent` | Een vraag over / werk of personeel? | A question about / work or staff? |
| Tekst (rich `<link>`) | `about.cta.body` met `{phone}` en `{email}` | Bel of app ons op `<link>`{phone}`</link>`, of mail naar {email}. Via de contactpagina kunt u ook een bericht sturen. | Call or message us on `<link>`{phone}`</link>`, or email {email}. You can also send a message through the contact page. |
| Knop 1 | `common.cta.contact` → `/contact` | Neem contact op | Contact us |
| Knop 2 | `common.cta.call` → `contact.phoneHref`, icoon `Phone`, `ariaLabel` `header.callAria` | Bel ons | Call us |

`{phone}` is `contact.phone`, `{email}` is `contact.email` (spec 01 §5.1).

### 4.6 Overzicht van nieuwe en gewijzigde componenten

| Naam | Bestand | S/C | Props |
|---|---|---|---|
| `HomeHero` | `components/sections/home/home-hero.tsx` | S | geen |
| `HomeVacancies` | `components/sections/home/home-vacancies.tsx` | S | `{ locale: Locale }` |
| `HomeBeroepen` | `components/sections/home/home-beroepen.tsx` | S | geen |
| `HowItWorks` | `components/sections/home/how-it-works.tsx` | S | geen |
| `WhyGroos` | `components/sections/home/why-groos.tsx` | S | geen |
| `HomePeople` | `components/sections/home/home-people.tsx` | S | `{ locale: Locale }` |
| `HomeFaq` | `components/sections/home/home-faq.tsx` | S | geen |
| `CtaBand` | `components/sections/cta-band.tsx` | S | `CtaBandProps` (§4.3.8) |
| `AboutHero` | `components/sections/about/about-hero.tsx` | S | geen |
| `AboutStory` | `components/sections/about/about-story.tsx` | S | geen |
| `AboutPeople` | `components/sections/about/about-people.tsx` | S | `{ locale: Locale }` |
| `AboutArea` | `components/sections/about/about-area.tsx` | S | geen |
| `AboutApproach` | `components/sections/about/about-approach.tsx` | S | geen |
| `SectionHeading` (gewijzigd) | `components/sections/section-heading.tsx` | S | bestaande props plus `headingId?: string` |
| `getHomeFaqItems` | `components/sections/home/faq-items.ts` (server-only) | n.v.t. | `(locale: Locale) => Promise<{ q: string; a: string }[]>`: leest beide sets met `t.raw`, filtert met `withConfirmedClaims` en geeft eerst werkzoekenden, dan werkgevers terug; gebruikt door `HomeFaq` en door de JSON-LD op de pagina |

Gebruikte bouwstenen van andere specs: `Breadcrumbs` (01), `CtaButton`, `Card` en delen, `IconTile`, `Accordion` en `AccordionItem`, `Reveal`, `RevealGroup`, `RevealItem` (02), `LatestVacancies`, `VacancyListSkeleton` (06), `ContactPersonCard` (07), `JsonLd`, `pageMetadata`, `employmentAgencyLd`, `faqLd` (12). Geen `"use client"` in deze module.

## 5 Data

Deze module schrijft niets en bezit geen tabellen.

| Bron | Wat | Eigenaar |
|---|---|---|
| `getLatestVacancies({ limit: 4 })` via `LatestVacancies` | vier open vacatures, nieuwste eerst, als `VacancyListItem[]` uit `public_vacancies` met `state = 'open'` | 10, 06 |
| `content/beroepen/index.ts` | `beroepen` (id, `slugWerkzoekende`, `slugWerkgever`, `icon`, `order`) | 01 |
| `lib/routes.ts` | `ROUTES`, `paths.werkenAls`, `paths.werkgeverBeroep` | 01 |
| `lib/site.ts` | `contact` (naam, adres, `phone`, `phoneHref`, `email`), `people` (jimmy, lorenzo) | 01 |
| `lib/claims.ts` | `isClaimConfirmed`, `withConfirmedClaims`, vlaggen `foundingStory`, `workArea`, `keurmerk`, `testimonials` | 03 |

Caching: `/` heeft `export const revalidate = 3600`; de vacaturedata is gecachet met tag `vacatures` (B-35). Na het publiceren, sluiten of offline halen van een vacature in `/beheer` (spec 08) of door de cron wordt `revalidateVacancies([nummer], "visibility")` uit `lib/data/revalidate.ts` aangeroepen (spec 10, B-35), waarna de homepage bij het volgende verzoek ververst. `/over-ons` heeft `revalidate = false`. Geen eigen Supabase-client, geen `fetch`, geen `searchParams`, geen `cookies()` of `headers()` op deze pagina's, zodat ze statisch blijven.

Fout in de database bij de eerste build of verversing: `LatestVacancies` vangt fouten niet af (spec 06 §4.8). Bij een ISR-verversing houdt Next de vorige versie; bij een eerste render toont `error.tsx` van spec 01 de foutpagina. Tijdens `next build` moet `groos-dev` bereikbaar zijn (`.env.local`, spec 13).

## 6 Tekstelementen

### 6.1 Regels voor deze namespaces

- Eigenaar van `home` en `about` is deze spec (00 §4.4a). Toon, notatie, woordenlijst, lengtes en claimbeleid volgen spec 03.
- Zones voor `npm run check:copy` (spec 03 §6.19): sleutelpaden met het segment `jobseeker` of het achtervoegsel `Jobseeker` zijn je-zone; met `employer` u-zone; de rest is neutraal (wij en u, nooit je). Zo is `home.hero.jobseeker.body` je-vorm en `home.why.intro` neutraal.
- Koppen in twee delen (`title` plus `accent`); alleen de h1's gebruiken de rich-tag `<accent>`. `home.cta.body` en `about.cta.body` gebruiken de rich-tag `<link>`.
- Lengte (spec 03 §6.12): de zichtbare copy van `/` is ongeveer 720 woorden met één open vragenset; `/over-ons` ongeveer 400 woorden.
- Eenmalige formules per pagina: op `/` staat "zodat" alleen in werkgeversvraag 3 en "van … tot" alleen in de kop van de stappen.
- Geen tekst van J. Versseput of Wilk; geen J. Versseput-vermelding (B-26). Onbevestigde inhoud staat achter een claimvlag. Bestaat de tekst nog niet, dan heeft hij geen sleutel in messages en blijft de open claim zichtbaar via de TODO-regel van de vlag in `lib/claims.ts`.

### 6.2 Sleutelboom NL (`messages/nl/home.json` en `messages/nl/about.json`, elk zonder de namespace als bovenste sleutel)

```json
{
  "home": {
    "hero": {
      "title": "Uitzendbureau in Den Haag voor <accent>praktisch werk</accent>",
      "intro": "Wij zoeken mensen voor glasbewassing, schoonmaak, logistiek, verhuizen en bouw en sloop in Den Haag en omgeving. Werkzoekenden en opdrachtgevers spreken bij ons steeds met Jimmy of Lorenzo.",
      "jobseeker": {
        "title": "Ik zoek werk",
        "body": "Bekijk de open vacatures of kies hieronder je beroep.",
        "beroepenLabel": "Kies je beroep"
      },
      "employer": {
        "title": "Ik zoek personeel",
        "body": "Vraag mensen aan voor een dag, een paar weken of langer."
      }
    },
    "vacatures": {
      "title": "De nieuwste vacatures",
      "accent": "in Den Haag en omgeving",
      "intro": "Bij elke vacature staan het bruto uurloon, de uren en de plaats. Solliciteren kan in een paar minuten, ook zonder cv.",
      "emptyJobseeker": "Er staan nu geen vacatures online. Schrijf je in, dan bellen wij je zodra er werk is dat bij je past."
    },
    "beroepen": {
      "title": "Werk en personeel in",
      "accent": "vijf praktische beroepen",
      "intro": "Kies een beroep en lees wat het werk inhoudt. Werkzoekenden vinden er vacatures en uurlonen, opdrachtgevers lezen hoe zij mensen aanvragen.",
      "jobseekerLink": "Werken als {occupation}",
      "employerLink": "Huur {occupationPlural} in",
      "items": {
        "glazenwasser": { "body": "Glazenwassers maken ramen, gevels en zonnepanelen schoon, vaak op hoogte met een hoogwerker." },
        "schoonmaker": { "body": "Schoonmakers houden kantoren, scholen, hotels en nieuwe woningen schoon, vaak vroeg in de ochtend of in de avond." },
        "logistiek-medewerker": { "body": "Logistiek medewerkers pakken orders, laden en lossen vrachtwagens en houden het magazijn op orde." },
        "verhuizer": { "body": "Verhuizers pakken in, dragen meubels en zetten alles op de nieuwe plek weer neer, bij huizen en kantoren." },
        "hulpkracht-bouw-en-sloop": { "body": "Hulpkrachten bouw en sloop helpen vakmensen op de bouwplaats met sjouwen, opruimen en sloopwerk." }
      }
    },
    "steps": {
      "title": "Van eerste contact tot",
      "accent": "de eerste werkdag",
      "intro": "Werk zoeken en personeel aanvragen gaat bij Groos in drie stappen. Zo weet iedereen vooraf wat er gebeurt.",
      "jobseeker": {
        "title": "Voor werkzoekenden",
        "steps": [
          { "title": "Solliciteer of schrijf je in", "body": "Kies een vacature of schrijf je in zonder vacature, een cv is niet nodig." },
          { "title": "Wij bellen je", "body": "Jimmy of Lorenzo belt je om te horen welk werk je zoekt en wanneer je kunt werken." },
          { "title": "Je begint", "body": "Past het werk, dan spreken wij samen je eerste werkdag, je uren en je uurloon af." }
        ]
      },
      "employer": {
        "title": "Voor werkgevers",
        "steps": [
          { "title": "Vraag personeel aan", "body": "U vertelt ons welke mensen u zoekt, vanaf wanneer en voor hoe lang." },
          { "title": "Wij stellen mensen voor", "body": "Wij bespreken het werk en de werktijden met u en stellen daarna mensen voor die passen." },
          { "title": "Het werk begint", "body": "Wij houden contact met u en de medewerker zolang de inzet loopt." }
        ]
      }
    },
    "why": {
      "title": "Wat u van Groos",
      "accent": "kunt verwachten",
      "intro": "Wij beloven alleen wat wij kunnen waarmaken. Dit zijn de vaste afspraken voor iedereen die met Groos werkt.",
      "items": {
        "contactpersonen": { "title": "Twee vaste contactpersonen", "body": "U spreekt steeds met Jimmy of Lorenzo. Hun 06-nummers staan op deze site en bij elke vacature." },
        "beroepen": { "title": "Vijf praktische beroepen", "body": "Groos richt zich op glasbewassing, schoonmaak, logistiek, verhuizen en bouw en sloop. Per beroep staat op deze site wat het werk inhoudt." },
        "loon": { "title": "Eerlijk over loon", "body": "Bij elke vacature staat het bruto uurloon. Volgens de wet krijgt een uitzendkracht hetzelfde loon als vaste collega's in dezelfde functie." },
        "solliciteren": { "title": "Solliciteren op drie manieren", "body": "Werkzoekenden solliciteren via het formulier, met een WhatsApp-bericht of met een telefoontje. Een cv is daarbij niet nodig." }
      }
    },
    "people": {
      "title": "Bij Groos spreekt u",
      "accent": "Jimmy of Lorenzo",
      "intro": "Zij plaatsen de vacatures, spreken werkzoekenden en bespreken aanvragen met opdrachtgevers. Bel of app hen gerust met een vraag over werk of personeel.",
      "aboutLink": "Lees meer over Groos"
    },
    "faq": {
      "title": "Veelgestelde vragen over",
      "accent": "werk en personeel",
      "switchLabel": "Vragen voor",
      "jobseeker": {
        "tab": "Werkzoekenden",
        "moreLink": "Meer over werken via Groos",
        "items": [
          { "q": "Kost solliciteren of inschrijven geld?", "a": "Nee, solliciteren en inschrijven zijn altijd gratis. Groos vraagt nooit geld voor werk, een contract of een sollicitatie. Vraagt iemand dat toch uit onze naam, meld het ons dan." },
          { "q": "Heb ik een cv nodig om te solliciteren?", "a": "Nee, een cv is niet nodig. Je vult een paar gegevens in, zoals je naam en je telefoonnummer, en wij bespreken je ervaring aan de telefoon." },
          { "q": "Moet ik Nederlands spreken?", "a": "Dat verschilt per vacature. Bij elke vacature staat of je Nederlands nodig hebt voor het werk. Deze site is ook in het Engels te lezen." },
          { "q": "Wat verdien ik?", "a": "Het bruto uurloon staat bij elke vacature. Volgens de wet krijg je hetzelfde loon als vaste collega's die hetzelfde werk doen. Daarnaast bouw je vakantiegeld op." },
          { "q": "Krijg ik veiligheidsschoenen en andere beschermingsmiddelen?", "a": "Ja, beschermingsmiddelen zoals veiligheidsschoenen, handschoenen of een helm krijg je gratis als het werk daarom vraagt. Wij vertellen je vooraf wat je op je eerste werkdag nodig hebt." }
        ]
      },
      "employer": {
        "tab": "Werkgevers",
        "moreLink": "Meer over personeel inhuren",
        "items": [
          { "q": "Wat kost een uitzendkracht?", "a": "Het tarief hangt af van het beroep, het aantal uren, de werktijden en de duur van de inzet. Na uw aanvraag sturen wij u een voorstel met een uurtarief." },
          { "q": "Voor hoe lang kan ik personeel inhuren?", "a": "Dat bepaalt u zelf, ook als het om één dag gaat. Wij stemmen het aantal mensen en de uren af op uw planning." },
          { "q": "Wie is mijn vaste contactpersoon?", "a": "U heeft contact met Jimmy of Lorenzo, die uw aanvraag zelf afhandelen. Hun nummers staan op deze site, zodat u hen direct kunt bellen." },
          { "q": "Krijgen jullie mensen hetzelfde loon als mijn vaste medewerkers?", "a": "Ja, dat schrijft de wet voor met de gelijkwaardige beloning. Een uitzendkracht krijgt hetzelfde loon en dezelfde vergoedingen als uw vaste medewerkers in dezelfde functie. Daarom vragen wij bij uw aanvraag naar de beloning in uw bedrijf." },
          { "q": "Wie zorgt voor veiligheid op de werkplek?", "a": "Als opdrachtgever zorgt u volgens de Arbowet voor een veilige werkplek en voor uitleg over het werk. Wij spreken vooraf met u af welke certificaten en beschermingsmiddelen nodig zijn." }
        ]
      }
    },
    "cta": {
      "title": "Eén telefoontje is genoeg",
      "accent": "om te beginnen",
      "body": "Bel of app ons op <link>{phone}</link>. Wie liever eerst rondkijkt, kiest hieronder de route die past."
    }
  },
  "about": {
    "meta": {
      "title": "Over ons",
      "description": "Groos Personeelsdiensten is een Haags uitzendbureau voor praktisch werk in vijf beroepen. Lees wie Jimmy en Lorenzo zijn en hoe wij werken."
    },
    "hero": {
      "title": "Groos is een oud woord voor <accent>trots</accent>",
      "intro": "Wij zijn een uitzendbureau uit Den Haag voor glasbewassing, schoonmaak, logistiek, verhuizen en bouw en sloop. Jimmy en Lorenzo leiden Groos samen en zijn de vaste contactpersonen."
    },
    "story": {
      "title": "Wat trots betekent in",
      "accent": "ons werk",
      "paragraphs": [
        "Groos is een oud Nederlands woord voor trots, dat in Zeeland en Rotterdam nog wordt gebruikt. Wij kozen die naam omdat het werk van onze mensen vaak onzichtbaar blijft, terwijl iedereen er elke dag op rekent.",
        "Schone ramen, een opgeruimd magazijn en een verhuizing die op tijd klaar is, vallen pas op als ze ontbreken. Wij vinden dat dit werk respect verdient, in het loon, in de planning en in hoe wij met mensen omgaan.",
        "Voor opdrachtgevers betekent trots dat wij mensen voorstellen die hun werk goed willen doen. Voor werkzoekenden betekent het dat wij eerlijk zijn over het loon, de uren en het werk zelf."
      ]
    },
    "people": {
      "title": "De mensen achter",
      "accent": "Groos",
      "intro": "Bij Groos heeft u steeds contact met dezelfde twee mensen. Bel of app hen gerust met een vraag over werk of personeel."
    },
    "area": {
      "title": "Een Haags bureau voor",
      "accent": "Den Haag en omgeving",
      "paragraphs": [
        "Groos is gevestigd aan het Hugo Coenraadspad in Den Haag. Langskomen kan alleen op afspraak, dus bel of app ons even van tevoren.",
        "Wij zoeken werk en personeel in Den Haag en de gemeenten eromheen. Bij elke vacature staat precies waar het werk is."
      ],
      "placesIntro": "Wij werken onder meer in deze plaatsen:",
      "places": ["Den Haag", "Delft", "Leidschendam-Voorburg", "Midden-Delfland", "Pijnacker-Nootdorp", "Rijswijk", "Wassenaar", "Westland", "Zoetermeer"]
    },
    "approach": {
      "title": "Zo werken wij met",
      "accent": "werkzoekenden en opdrachtgevers",
      "intro": "Een klein bureau werkt anders dan een grote keten. Dit zijn de vier gewoontes die bij Groos altijd gelden.",
      "items": {
        "kennismaken": { "title": "Eerst kennismaken", "body": "Wij bellen werkzoekenden om kennis te maken en bespreken elke aanvraag met de opdrachtgever. Zo weten wij wat iemand zoekt en wat het werk vraagt." },
        "afspraken": { "title": "Afspraken vooraf", "body": "Uurloon, uren en werktijden zijn bekend voordat iemand begint. Bij elke vacature staat het bruto uurloon al vermeld." },
        "contact": { "title": "Contact tijdens het werk", "body": "Wij houden contact met de medewerker en de opdrachtgever zolang het werk loopt. Gaat er iets mis, dan zoeken wij samen een oplossing." },
        "kosten": { "title": "Nooit geld voor werk", "body": "Groos vraagt nooit geld voor werk, een contract of een sollicitatie. Wie zo'n verzoek uit onze naam krijgt, kan het direct bij ons melden." }
      }
    },
    "cta": {
      "title": "Een vraag over",
      "accent": "werk of personeel?",
      "body": "Bel of app ons op <link>{phone}</link>, of mail naar {email}. Via de contactpagina kunt u ook een bericht sturen."
    }
  }
}
```

### 6.3 Sleutelboom EN (`messages/en/home.json` en `messages/en/about.json`, elk zonder de namespace als bovenste sleutel)

```json
{
  "home": {
    "hero": {
      "title": "Employment agency in The Hague for <accent>hands-on work</accent>",
      "intro": "We find people for window cleaning, cleaning, logistics, removals and construction and demolition in The Hague and the surrounding area. Job seekers and clients always speak to Jimmy or Lorenzo.",
      "jobseeker": {
        "title": "I am looking for work",
        "body": "View the open jobs or choose your occupation below.",
        "beroepenLabel": "Choose your occupation"
      },
      "employer": {
        "title": "I am looking for staff",
        "body": "Request people for a day, a few weeks or longer."
      }
    },
    "vacatures": {
      "title": "The latest jobs",
      "accent": "in The Hague and the surrounding area",
      "intro": "Every job shows the gross hourly wage, the hours and the location. Applying takes a few minutes, even without a CV.",
      "emptyJobseeker": "There are no jobs online right now. Register with us and we will call you as soon as there is work that suits you."
    },
    "beroepen": {
      "title": "Work and staff in",
      "accent": "five hands-on occupations",
      "intro": "Choose an occupation and read what the work involves. Job seekers will find jobs and hourly wages, clients can read how to request people.",
      "jobseekerLink": "Work as a {occupation}",
      "employerLink": "Hire {occupationPlural}",
      "items": {
        "glazenwasser": { "body": "Window cleaners clean windows, facades and solar panels, often at height from an aerial platform." },
        "schoonmaker": { "body": "Cleaners keep offices, schools, hotels and new homes clean, often early in the morning or in the evening." },
        "logistiek-medewerker": { "body": "Logistics workers pick orders, load and unload lorries and keep the warehouse in order." },
        "verhuizer": { "body": "Movers pack, carry furniture and set everything up again at the new address, for homes and offices." },
        "hulpkracht-bouw-en-sloop": { "body": "Construction and demolition labourers help skilled workers on site with carrying, clearing up and demolition work." }
      }
    },
    "steps": {
      "title": "From first contact to",
      "accent": "the first working day",
      "intro": "Finding work and requesting staff at Groos takes three steps. That way everyone knows in advance what will happen.",
      "jobseeker": {
        "title": "For job seekers",
        "steps": [
          { "title": "Apply or register", "body": "Choose a job or register without one, you do not need a CV." },
          { "title": "We call you", "body": "Jimmy or Lorenzo calls you to hear what work you are looking for and when you can work." },
          { "title": "You start", "body": "If the work suits you, we agree your first working day, your hours and your hourly wage together." }
        ]
      },
      "employer": {
        "title": "For employers",
        "steps": [
          { "title": "Request staff", "body": "You tell us which people you need, from when and for how long." },
          { "title": "We propose people", "body": "We discuss the work and the working hours with you and then propose people who fit." },
          { "title": "The work starts", "body": "We stay in touch with you and the worker for as long as the assignment runs." }
        ]
      }
    },
    "why": {
      "title": "What you can",
      "accent": "expect from Groos",
      "intro": "We only promise what we can deliver. These are the fixed arrangements for everyone who works with Groos.",
      "items": {
        "contactpersonen": { "title": "Two dedicated contacts", "body": "You always speak to Jimmy or Lorenzo. Their mobile numbers are on this site and with every job." },
        "beroepen": { "title": "Five hands-on occupations", "body": "Groos focuses on window cleaning, cleaning, logistics, removals and construction and demolition. For each occupation this site explains what the work involves." },
        "loon": { "title": "Honest about pay", "body": "Every job shows the gross hourly wage. By law a temporary worker receives the same pay as permanent colleagues in the same role." },
        "solliciteren": { "title": "Three ways to apply", "body": "Job seekers apply through the form, with a WhatsApp message or with a phone call. A CV is not needed." }
      }
    },
    "people": {
      "title": "At Groos you speak to",
      "accent": "Jimmy or Lorenzo",
      "intro": "They post the jobs, talk to job seekers and discuss requests with clients. Feel free to call or message them with a question about work or staff.",
      "aboutLink": "Read more about Groos"
    },
    "faq": {
      "title": "Frequently asked questions about",
      "accent": "work and staff",
      "switchLabel": "Questions for",
      "jobseeker": {
        "tab": "Job seekers",
        "moreLink": "More about working through Groos",
        "items": [
          { "q": "Does applying or registering cost money?", "a": "No, applying and registering are always free. Groos never asks for money for work, a contract or an application. If someone asks for it in our name, please report it to us." },
          { "q": "Do I need a CV to apply?", "a": "No, you do not need a CV. You fill in a few details, such as your name and your phone number, and we discuss your experience on the phone." },
          { "q": "Do I need to speak Dutch?", "a": "That depends on the job. Every job states whether you need Dutch for the work. You can also read this site in English." },
          { "q": "What will I earn?", "a": "Every job shows the gross hourly wage. By law you receive the same pay as permanent colleagues who do the same work. On top of that you build up holiday pay." },
          { "q": "Will I get safety shoes and other protective equipment?", "a": "Yes, protective equipment such as safety shoes, gloves or a helmet is free if the work requires it. We tell you in advance what you need on your first working day." }
        ]
      },
      "employer": {
        "tab": "Employers",
        "moreLink": "More about hiring staff",
        "items": [
          { "q": "What does a temporary worker cost?", "a": "The rate depends on the occupation, the number of hours, the working times and the length of the assignment. After your request we send you a proposal with an hourly rate." },
          { "q": "For how long can I hire staff?", "a": "You decide, even if it is for a single day. We match the number of people and the hours to your planning." },
          { "q": "Who is my dedicated contact?", "a": "You deal with Jimmy or Lorenzo, who handle your request themselves. Their numbers are on this site, so you can call them directly." },
          { "q": "Do your people receive the same pay as my permanent staff?", "a": "Yes, the law requires equivalent pay. A temporary worker receives the same pay and the same allowances as your permanent staff in the same role. That is why we ask about pay at your company when you submit a request." },
          { "q": "Who is responsible for safety at the workplace?", "a": "As the client you are responsible under the Working Conditions Act for a safe workplace and for explaining the work. We agree with you in advance which certificates and protective equipment are needed." }
        ]
      }
    },
    "cta": {
      "title": "One phone call is enough",
      "accent": "to get started",
      "body": "Call or message us on <link>{phone}</link>. If you would rather look around first, choose the route that suits you below."
    }
  },
  "about": {
    "meta": {
      "title": "About us",
      "description": "Groos Personeelsdiensten is an employment agency in The Hague for hands-on work in five occupations. Read who Jimmy and Lorenzo are and how we work."
    },
    "hero": {
      "title": "Groos is an old Dutch word for <accent>pride</accent>",
      "intro": "We are an employment agency in The Hague for window cleaning, cleaning, logistics, removals and construction and demolition. Jimmy and Lorenzo run Groos together and are the dedicated contacts."
    },
    "story": {
      "title": "What pride means",
      "accent": "in our work",
      "paragraphs": [
        "Groos is an old Dutch word for pride that is still used in Zeeland and Rotterdam. We chose the name because the work our people do often goes unseen, while everyone relies on it every day.",
        "Clean windows, a tidy warehouse and a move that finishes on time only stand out when they are missing. We believe this work deserves respect, in the pay, in the planning and in how we treat people.",
        "For clients, pride means that we propose people who want to do their work well. For job seekers, it means that we are honest about the pay, the hours and the work itself."
      ]
    },
    "people": {
      "title": "The people behind",
      "accent": "Groos",
      "intro": "At Groos you always deal with the same two people. Feel free to call or message them with a question about work or staff."
    },
    "area": {
      "title": "An agency from The Hague for",
      "accent": "The Hague and the surrounding area",
      "paragraphs": [
        "Groos is based on Hugo Coenraadspad in The Hague. Visits are by appointment only, so please call or message us beforehand.",
        "We look for work and staff in The Hague and the surrounding municipalities. Every job states exactly where the work is."
      ],
      "placesIntro": "We work in places including:",
      "places": ["The Hague", "Delft", "Leidschendam-Voorburg", "Midden-Delfland", "Pijnacker-Nootdorp", "Rijswijk", "Wassenaar", "Westland", "Zoetermeer"]
    },
    "approach": {
      "title": "This is how we work with",
      "accent": "job seekers and clients",
      "intro": "A small agency works differently from a large chain. These are the four habits that always apply at Groos.",
      "items": {
        "kennismaken": { "title": "Getting to know each other first", "body": "We call job seekers to get to know them and discuss every request with the client. That way we know what someone is looking for and what the work requires." },
        "afspraken": { "title": "Agreements in advance", "body": "Hourly wage, hours and working times are known before anyone starts. Every job already states the gross hourly wage." },
        "contact": { "title": "Contact during the work", "body": "We stay in touch with the worker and the client for as long as the work runs. If something goes wrong, we look for a solution together." },
        "kosten": { "title": "Never money for work", "body": "Groos never asks for money for work, a contract or an application. Anyone who receives such a request in our name can report it to us straight away." }
      }
    },
    "cta": {
      "title": "A question about",
      "accent": "work or staff?",
      "body": "Call or message us on <link>{phone}</link>, or email {email}. You can also send a message through the contact page."
    }
  }
}
```

### 6.4 Sleutels van andere namespaces die deze module leest

| Sleutel | Eigenaar | Gebruik |
|---|---|---|
| `meta.titleDefault`, `meta.description`, `meta.keywords`, `meta.organizationDescription` | 03 | metadata en JSON-LD van `/` |
| `common.cta.{viewJobs, viewAllJobs, requestStaff, call, contact, register}` | 03 | knoppen |
| `common.notes.noObligationEmployer` | 03 | regel in deur 2 |
| `common.contact.address`, `common.address.byAppointment` | 03 | adresblok op `/over-ons` |
| `header.callAria`, `header.nav.overOns` | 03 | `aria-label` van belknoppen, kruimelpad |
| `beroepen.<id>.enkelvoud`, `beroepen.<id>.meervoud` | 05 | beroepennamen in hero en raster |
| namespace `vacatures` (via `LatestVacancies`) | 06 | kaarten en lege staat |
| namespace `contact` (via `ContactPersonCard`) | 07 | personenkaarten |

`home` en `about` hoeven niet in `CLIENT_NAMESPACES` (spec 01 §4.11.4): deze module heeft geen clientcomponenten.

## 7 SEO

**Metadata `/`** (bestaand patroon, nieuwe signatuur van spec 12):

```ts
export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: "/",
    title: t("titleDefault"),
    description: t("description"),
    keywords: t.raw("keywords") as string[],
    absoluteTitle: true,
  });
}
```

Titel NL "Uitzendbureau in Den Haag | Groos Personeelsdiensten", EN "Employment agency in The Hague | Groos Personeelsdiensten" (spec 03 §6.14). Canonical `/` en `/en`, hreflang nl, en, x-default; OG-afbeelding `/opengraph-image` (spec 12).

**Metadata `/over-ons`**: `pageMetadata({ locale, path: ROUTES.overOns, title: t("meta.title"), description: t("meta.description") })` met namespace `about`. Titel "Over ons | Groos Personeelsdiensten" en "About us | Groos Personeelsdiensten". De beschrijvingen zijn 139 tekens (NL) en 148 tekens (EN), binnen 120 tot 160 (spec 03 C-22).

**JSON-LD `/`** (spec 12 §7.3):

| Blok | Builder | Wie rendert |
|---|---|---|
| `Organization` | `organizationLd({ description: meta.organizationDescription })` | layout (spec 01) |
| `WebSite` | `websiteLd({ locale })` | layout (spec 01) |
| `EmploymentAgency` | `employmentAgencyLd({ locale, description: tMeta("organizationDescription") })` | `app/[locale]/page.tsx` |
| `FAQPage` | `faqLd(await getHomeFaqItems(locale))`: de tien zichtbare vragen, eerst werkzoekenden, dan werkgevers | `app/[locale]/page.tsx` |

De pagina rendert `Organization` en `WebSite` niet nog een keer. `faqLd` krijgt exact dezelfde lijst als `HomeFaq` (zelfde functie `getHomeFaqItems`), zodat zichtbare tekst en markup gelijk blijven.

**JSON-LD `/over-ons`**: alleen `BreadcrumbList` via `Breadcrumbs` (Home › Over ons); de pagina roept `breadcrumbLd` niet zelf aan (spec 01 §4.9).

**Sitemap en llms.txt**: beide routes staan al in `STATIC_ROUTES` (spec 01 §5.3: `/` prioriteit 1, `daily`, `kern`; `/over-ons` 0,5, `yearly`, `kern`). `llms.txt` gebruikt `about.meta.description` voor `/over-ons` (spec 12). Deze spec voegt niets toe.

**Interne links** (spec 12 §7.8): `/` linkt naar `/vacatures`, de tien beroepspagina's (hero en raster), `/werkzoekenden` en `/werkgevers` (vragenblok), `/werkgevers/personeel-aanvragen`, `/inschrijven` (lege staat via spec 06) en `/over-ons`.

## 8 Toegankelijkheid en performance

**Koppen en landmarks**

- `/`: één h1 (`#home-titel`); h2 voor de twee deuren en elke sectie; h3 voor kaarttitels (beroepen, vacatures via spec 06, sporen, afspraken, personen) en de verborgen titels van de vragensets. `/over-ons`: één h1, h2 per sectie, h3 voor kaarten en het adresblok.
- Elke sectie is een `<section aria-labelledby>` naar zijn h2; landmarks `header`, `main`, `footer` komen uit de layout.
- Lijsten zijn `<ul role="list">` of `<ol>`; de stapnummers zijn `aria-hidden` en de volgorde komt uit `<ol>`.

**Bediening**

- Alle knoppen en links via `CtaButton` of `Link` met zichtbare focus (spec 02). Klikdoelen minstens 44 px op 390 px, ook de tekstlinks in de beroepenkaarten (`min-h-11`).
- De belknoppen hebben `aria-label` "Bel ons op 06 83 35 19 85" (`header.callAria`). WhatsApp-links in `ContactPersonCard` melden een nieuw venster (spec 07, `common.opensInNewTab`).
- Het vragenblok is een `fieldset` met `legend` en twee native keuzerondjes; pijltjes wisselen de set, de focusring staat op het label via `has-[:focus-visible]`.
- De horizontaal scrollende beroepenrij in de hero bestaat uit links; Tab brengt elke link in beeld. Er is geen verborgen inhoud.

**Contrast en beweging**

- Tekst op wit, ijs en blauwtint volgens de contrasttabel van spec 02; de stapcijfers in `brand-subtle` staan alleen op witte kaarten. Binnen `.surface-brand` alleen tokens die daar zijn omgezet.
- Geen reveal op de hero, de h1, de eerste alinea of iets boven de vouw op 390 px (spec 02 §4.10). Reveal is CSS en staat uit bij `prefers-reduced-motion`.

**Performance**

- LCP-element van `/` is de tekst van de h1; geen beeld boven de vouw, geen lazy loading op de hero, fonts via `next/font` met `display: swap` (spec 02). Doel Lighthouse mobiel 95, poort 90 (spec 14 §8.4).
- Geen layoutverschuiving: het skelet van de vacatures heeft de maat van vier compacte kaarten; de deuren hebben vaste padding; er laden geen beelden. CLS 0,05 of lager.
- Client-JavaScript: deze module voegt geen clientcomponent toe. De homepage laadt alleen de framework-chunks en de headereilanden van spec 01, en geen framer-motion meer. Budget "inhoud" uit spec 14 §8.5: 200 kB gzip, doel 170 kB.
- `/` is ISR met `revalidate = 3600`, `/over-ons` statisch. Geen `searchParams`, `cookies()` of `headers()`.

## 9 21st.dev-opdracht voor sub-agents

### 9.1 Werkwijze voor alle sub-agents van deze spec

De bouw-agent van stap 4 start de sub-agents hieronder tegelijk, zodra §4 en §6 in code staan als werkende server components op de primitives van spec 02. De structuur, de props en de tekst zijn dan al klaar; de sub-agents leveren alleen voorstellen voor vorm, ritme en details.

- **Tools laden**: `ToolSearch` met `select:mcp__magic__search,mcp__magic__get_inspiration`.
- **Zoeken**: `mcp__magic__search` met `type: "component"` en `limit: 10` voor elke formulering; `mcp__magic__get_inspiration` met de beschrijving, zonder `context`. Zoeken op thema's levert niets op (00 §4.6); tokens komen uit spec 02.
- **Selectiecriteria**: minimaal en rustig; witte achtergrond met ijs en blauwtint; blauw alleen via tokens (`bg-primary`, `text-brand`, `bg-brand-tint`, `.surface-brand`); past bij de boodschap van de plek; shadcn-compatibel met Tailwind 4 en `cn()`; toegankelijk (toetsenbord, aria, zichtbare focus, 44 px); werkt als server component; geen nieuwe dependencies (geen framer-motion of `motion`, geen Radix, geen carrousel, geen shader); geen foto's, avatars uit stockbeeld, sterren, logowanden, cijfertellers, eyebrows, glas, gloed, spotlight of marquee (B-25, B-26, B-29).
- **Oplevering** (als tekst aan de bouw-agent, geen bestanden): 2 tot 4 kandidaten met id, naam en preview-URL, per kandidaat twee zinnen over wat bruikbaar is en wat niet, één gemotiveerde keuze, en of `get_component` nodig is. Geen code ophalen.
- **`get_component`**: alleen de bouw-agent, alleen voor de gekozen kandidaat, hoogstens twee keer in deze stap, met voorrang voor de hero en het vragenblok. Voor de andere plekken dient de preview als visuele referentie en bouwt de agent op de primitives.
- **Aanpassingsregels**: kleuren, radius en schaduw alleen via tokens van spec 02 (het standaardpalet staat uit, dus `zinc-*`, `slate-*` en `blue-*` vervangen); componentnamen, props en sectie-id's uit §4.6 blijven gelijk; alle tekst via messages (spec 03 §9: geen demotekst laten staan); server component tenzij interactie, en deze module heeft geen interactie nodig; `Link` uit `@/i18n/navigation`; lucide 0.456 met lijndikte 2; `prefers-reduced-motion` gerespecteerd; geen reveal boven de vouw.
- **Vastleggen**: de bouw-agent schrijft per plek de kandidaten, de keuze, wel of geen `get_component` en de aanpassingen in `docs/21st-keuzes.md` onder het kopje "Spec 04".
- **Valt 21st.dev tegen**, dan bouwt de agent op `Card`, `IconTile`, `CtaButton`, `Accordion`, `SectionHeading` en het recept van de blauwe afsluiter (spec 02 §4.13).

### 9.2 SA-04-A Hero met twee doelgroepen (`HomeHero`)

Boodschap: rustig en zeker; in één oogopslag twee gelijke deuren, en bellen is één tik.

- `search`: "split hero two cards call to action"; "hero section with two audience cards"; "minimal hero two buttons"; "hero with category chips links"; "landing hero with two paths".
- `get_inspiration`: "minimal white hero for a staffing agency with two equal doors: I am looking for work (job categories as links) and I need staff (request button and phone)"; "hero with large headline and two side by side tinted panels, each with a heading, one sentence and buttons, no images".
- Specifiek: grote typografie, twee panelen van gelijke waarde in blauwtint, chips of kleine knoppen voor de beroepen, geen beeld en geen sociale bewijsvoering.

| Id | Naam (auteur) | Preview |
|---|---|---|
| 19078 | Split Hero With Image Cards (felipemenezes098) | https://21st.dev/@felipemenezes098/components/hero-08 |
| 612 | Hero 45 (shadcnblockscom) | https://21st.dev/@shadcnblockscom/components/shadcnblocks-com-hero45 |
| 1122 | Hero with text and two button (tommyjepsen) | https://21st.dev/@tommyjepsen/components/hero-with-text-and-two-button |
| 18890 | Feature Hero (uilayout.contact) | https://21st.dev/@uilayout.contact/components/feature-hero |

Kandidaat 19078 heeft de juiste opzet met twee kaarten, maar de beelden en de avatars vervallen. 26894 "Minimal Centered Hero" (ln-dev7) valt af door het eyebrowlabel.

### 9.3 SA-04-B Vacaturekaarten-rij (`HomeVacancies`)

Boodschap: er is nu werk, met echte lonen; de lijst nodigt uit om door te klikken. De kaart zelf is van spec 06; deze sub-agent kijkt alleen naar de omlijsting op de homepage (kop links, link naar alles, ritme op ijs) en roept geen `get_component` aan.

- `search`: "job listing cards grid"; "latest jobs section with view all link"; "job board preview section"; "card list section with header and link".
- `get_inspiration`: "latest jobs section on a light grey background with four compact job cards in a two by two grid and a view all link, no images".

| Id | Naam (auteur) | Preview |
|---|---|---|
| 8725 | Job Listing (educalvolpz) | https://21st.dev/@educalvolpz/components/job-listing |
| 8461 | Card Grid (ravikatiyar162) | https://21st.dev/@ravikatiyar162/components/card-grid |
| 8862 | Cards Grid (kavikatiyar) | https://21st.dev/@kavikatiyar/components/cards-grid |

8862 gebruikt framer-motion en is alleen visuele referentie.

### 9.4 SA-04-C Beroepenraster (`HomeBeroepen`)

Boodschap: vijf duidelijke vakken, elk met een deur voor beide kanten.

- `search`: "feature grid cards with icon and links"; "features grid icon title description"; "service cards with two links"; "bento grid five cards".
- `get_inspiration`: "five profession cards with a line icon, a one-sentence description and two text links, white cards with a thin border, three plus two layout".

| Id | Naam (auteur) | Preview |
|---|---|---|
| 28163 | Features Grid (shadcnui-blocks) | https://21st.dev/@shadcnui-blocks/components/features-01 |
| 2070 | Grid Feature Cards (efferd) | https://21st.dev/@efferd/components/grid-feature-cards |
| 28299 | Icon Feature Grid (felipemenezes098) | https://21st.dev/@felipemenezes098/components/content-09 |

26797 "Feature Grid Spotlight Cards" en 29553 vallen af door de spotlight-effecten (B-29).

### 9.5 SA-04-D Stappen in twee sporen (`HowItWorks`)

Boodschap: voorspelbaar en eenvoudig, voor allebei in drie stappen.

- `search`: "how it works steps timeline numbered"; "minimal 3 step process"; "vertical timeline steps"; "two column process steps".
- `get_inspiration`: "two side by side cards, each with a heading and a vertical list of three numbered steps with a short sentence, large light numbers, one button at the bottom".

| Id | Naam (auteur) | Preview |
|---|---|---|
| 26891 | How It Works Steps (ln-dev7) | https://21st.dev/@ln-dev7/components/how-it-works-09 |
| 26902 | Vertical How It Works Timeline (ln-dev7) | https://21st.dev/@ln-dev7/components/how-it-works-02 |
| 19863 | How It Works Timeline (olewandowski1) | https://21st.dev/@olewandowski1/components/how-it-works-2 |
| 28381 | Process Timeline (shadcnui-blocks) | https://21st.dev/@shadcnui-blocks/components/timeline-05 |

26916 valt af door het kickerlabel boven de kop.

### 9.6 SA-04-E Raster van de teamkaarten (`HomePeople`, `AboutPeople`)

Boodschap: twee echte mensen die je kunt bellen. Deze sub-agent kijkt alleen naar het raster van de teamkaarten: de verdeling van twee kaarten naast elkaar, de afstanden, de uitlijning onder de kop en de link naar `/over-ons` op `/`. Het uiterlijk van de kaart is `ContactPersonCard` van spec 07; die kaart scout alleen sub-agent F van spec 07. Geen `get_component`.

- `search`: "team section two members grid"; "two column team grid section"; "team section heading left cards grid".
- `get_inspiration`: "section with a heading and intro on the left and two equal contact cards side by side in a grid, with a text link below the grid, no photos".

Er staan hier geen vooraf gekozen kandidaten; de sub-agent levert twee tot vier kandidaten voor het raster volgens §9.1.

### 9.7 SA-04-F Vragenblok met tabs voor twee doelgroepen (`HomeFaq`)

Boodschap: korte, eerlijke antwoorden; je kiest eerst wie je bent.

- `search`: "faq with tabs categories"; "categorized faq accordion"; "faq segmented control"; "faq two columns heading left".
- `get_inspiration`: "FAQ section with a two-option segmented switch (job seekers, employers) above a minimal accordion with plus icons, heading on the left on desktop".
- Specifiek: de wissel moet zonder JavaScript werken (native keuzerondjes, §4.3.7); een kandidaat met animatie of client-state is alleen visuele referentie.

| Id | Naam (auteur) | Preview |
|---|---|---|
| 24859 | Categorized FAQ (educalvolpz) | https://21st.dev/@educalvolpz/components/faq-4 |
| 29953 | FAQ Tabs Card (arihantcodes_1f7b8c4d) | https://21st.dev/@arihantcodes_1f7b8c4d/components/faq-tabs-card |
| 28210 | Categorized FAQ (diarmuradi) | https://21st.dev/@diarmuradi/components/faq-9 |
| 27097 | FAQ Accordion Columns (diarmuradi) | https://21st.dev/@diarmuradi/components/faq-11 |

27107 valt af door de knoppen "helpful" en "not helpful".

### 9.8 SA-04-G CTA-band (`CtaBand`)

Boodschap: één laatste duidelijke stap met het nummer in beeld.

- `search`: "call to action banner section"; "cta section solid primary background two buttons"; "centered call to action"; "cta block rounded".
- `get_inspiration`: "rounded solid blue call to action panel inside a white section with a headline, one sentence with a phone number and two buttons, subtle pattern in one corner".

| Id | Naam (auteur) | Preview |
|---|---|---|
| 28155 | CTA Section (shadcndesign) | https://21st.dev/@shadcndesign/components/cta-section-1 |
| 18475 | Call to Action (felipemenezes098) | https://21st.dev/@felipemenezes098/components/cta-01 |
| 1414 | Call to action (tommyjepsen) | https://21st.dev/@tommyjepsen/components/call-to-action |

28155 heeft een taglinelabel; dat vervalt. Kandidaten met een e-mailveld (19857, 19354) vallen af.

### 9.9 SA-04-H Verhaal en werkgebied op `/over-ons` (`AboutStory`, `AboutArea`, `AboutApproach`)

Boodschap: nuchter en persoonlijk; een klein Haags bureau dat uitlegt waarom het bestaat.

- `search`: "about us story section"; "about section text two columns"; "address card contact details"; "values cards grid minimal".
- `get_inspiration`: "about page with a large headline, three short paragraphs next to a heading, an address card in a soft blue tint and four value cards, no photos or statistics".

| Id | Naam (auteur) | Preview |
|---|---|---|
| 6289 | About Section (uilayout.contact) | https://21st.dev/@uilayout.contact/components/about-section |
| 2202 | About 3 (shadcnblockscom) | https://21st.dev/@shadcnblockscom/components/about-3 |
| 6906 | About (prebuiltui) | https://21st.dev/@prebuiltui/components/about |

Statistieken, logo's en beelden uit deze kandidaten vervallen (B-25, B-26).

## 10 Bouwopdracht

> **Notitie.** Bouwstap 4 voor deze spec is gecommit (1a15c0c, gemerged in 1668ce0). De wijzigingen uit kruiscontrole ronde 2 en 3 voert een nazorg-sub-agent in bouwstap 3b uit (00 §6, B-52).

Bouwstap 4 uit 00 §6, samen met spec 05. Voorwaarden: stap 2 (spec 02: tokens, primitives, `Reveal` als server component) en stap 3 (spec 01 en 03: layout, registers, `Breadcrumbs`, `common`, `meta`, `header`, `lib/claims.ts`) zijn klaar. Voor `LatestVacancies`, `VacancyListSkeleton` (spec 06) en `ContactPersonCard` (spec 07): zie stap 3 hieronder.

1. **Lezen.** 00 §3 en §4, deze spec, spec 02 §4.7 tot en met §4.13, spec 03 §6, spec 06 §4.8 en spec 07 §4.9. In de Next-docs: `node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md` en `json-ld.md`.
2. **Messages.** Vervang in `messages/nl/home.json` en `messages/en/home.json` de namespace `home` door §6.2 en §6.3, en vul `messages/nl/about.json` en `messages/en/about.json` met de namespace `about` uit §6.2 en §6.3 (B-45). Draai `npm run check -- --warn` (pariteit) en `npm run check:copy` (geen fouten in `home` en `about`). Zet geen sleutel `about.story.founding` in messages; die voegt de schrijver pas toe na bevestiging van `foundingStory` (§4.5.2).
3. **Afhankelijkheden.** `HomeVacancies` rendert `LatestVacancies` van spec 06 en de personensecties gebruiken `ContactPersonCard` uit `components/contact/contact-person-card.tsx` (spec 07); bouwstap 3b controleert dat (B-52). Bouw geen tweede personenkaart.
4. **Personenkaart.** Zie stap 3: `HomePeople` en `AboutPeople` renderen per persoon `ContactPersonCard` van spec 07 (§4.3.6, §4.5.3).
5. **Gedeelde onderdelen.** Breid `components/sections/section-heading.tsx` uit met `headingId` (§4.4). Maak `components/sections/cta-band.tsx` (§4.3.8).
6. **Homesecties.** Maak de bestanden van §4.6 in `components/sections/home/`, inclusief `faq-items.ts` met `import "server-only"`.
7. **Homepagina.** Herschrijf `app/[locale]/page.tsx`:

```tsx
export const revalidate = 3600;

export async function generateMetadata(/* zie §7 */) {}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const faqItems = await getHomeFaqItems(locale);
  return (
    <>
      <JsonLd data={employmentAgencyLd({ locale, description: tMeta("organizationDescription") })} />
      <JsonLd data={faqLd(faqItems)} />
      <HomeHero />
      <HomeVacancies locale={locale} />
      <HomeBeroepen />
      <HowItWorks />
      <WhyGroos />
      <HomePeople locale={locale} />
      <HomeFaq />
      <CtaBand id="aan-de-slag" headingId="home-cta-titel" /* tekst en knoppen uit home.cta en common.cta */ />
    </>
  );
}
```

8. **Over ons.** Vervang het skelet `app/[locale]/over-ons/page.tsx` (spec 01 §4.20). Laat `setRequestLocale` staan, zet `export const revalidate = false`, voeg `generateMetadata` toe (§7) en render `AboutHero`, `AboutStory`, `AboutPeople locale={locale}`, `AboutArea`, `AboutApproach` en `CtaBand id="contact"`. Maak de componenten in `components/sections/about/`.
9. **Sub-agents.** Start de acht sub-agents uit §9 tegelijk zodra stap 6 en 8 compileren. Verwerk hun keuzes binnen de regels van §9.1 en noteer ze in `docs/21st-keuzes.md`.
10. **Opruimen.** Voer §4.1 uit: verwijder de oude sectiebestanden, de JV-exports in `lib/site.ts`, `marquee.tsx` en `count-up.tsx`; controleer daarna met `grep -rn "framer-motion\|marquee\|count-up\|segments\|projectPhotos\|certification" app components lib` dat er geen gebruiker meer is, en draai zo nodig `npm uninstall framer-motion`.
11. **Verifiëren.**

```bash
npm run verify
npm run check -- --warn        # geen sleutelverschillen; open punten alleen in lib/claims.ts (onder meer foundingStory)
npm run check:copy             # geen fouten in home en about
npm run build && npm run start

B=http://localhost:3000
for u in / /en /over-ons /en/over-ons; do echo "$(curl -s -o /dev/null -w '%{http_code}' $B$u) $u"; done
curl -s $B/ | grep -o '"@type":"[A-Za-z]*"' | sort | uniq -c        # Organization, WebSite, EmploymentAgency, FAQPage, Question x10
curl -s $B/ | grep -c '<h1'                                         # 1
curl -s $B/over-ons | grep -o '"@type":"BreadcrumbList"' | wc -l    # 1
grep -rln '"use client"' components/sections/home components/sections/about components/sections/cta-band.tsx   # niets
```

12. **Visueel.** Playwright op 390, 768, 1280 en 1440 px voor `/`, `/en`, `/over-ons` en `/en/over-ons`: eerst doorscrollen, dan een screenshot van de hele pagina in `.playwright-mcp/`. Extra op 390 px: het vragenblok met "Werkgevers" gekozen, en `/` met een lege vacaturelijst (tijdelijk alle seedvacatures op `closed` in `groos-dev`, daarna `npm run db:seed:reset` (B-46)).
13. **Lighthouse.** `npm run lighthouse -- --alleen=home` (spec 14); noteer de mediaan in spec 00.
14. **Afsluiten.** Noteer in spec 00 de stand (stap 4 klaar voor spec 04), de sub-agentkeuzes en de afwijkingen.

## 11 Acceptatiecriteria

Alle criteria gelden op localhost met `npm run build && npm run start` tegen `groos-dev`, tenzij anders vermeld.

| Id | Criterium | Eis |
|---|---|---|
| AC-04-01 | `GET /`, `/en`, `/over-ons` en `/en/over-ons` geven 200; elk heeft precies één `<h1>`. Op `/` is de h1-tekst "Uitzendbureau in Den Haag voor praktisch werk", op `/en` "Employment agency in The Hague for hands-on work". | E-04-01, E-04-10 |
| AC-04-02 | Op 390 bij 844 px ligt de onderkant van de knop met `href` `/vacatures` in deur 1 en van de knop met `href` `/werkgevers/personeel-aanvragen` in deur 2 binnen 844 px vanaf de bovenkant van de pagina (`getBoundingClientRect().bottom + scrollY <= 844` zonder te scrollen). | E-04-01 |
| AC-04-03 | `section[aria-labelledby="home-titel"]` bevat twee `h2`'s "Ik zoek werk" en "Ik zoek personeel", vijf links naar `/werken-als/glazenwasser`, `/werken-als/schoonmaker`, `/werken-als/logistiek-medewerker`, `/werken-als/verhuizer` en `/werken-als/hulpkracht-bouw-en-sloop` in die volgorde, een link naar `/werkgevers/personeel-aanvragen` en een link met `href="tel:+31683351985"` en `aria-label` "Bel ons op 06 83 35 19 85". | E-04-01 |
| AC-04-04 | Met de seed van spec 10 bevat `#vacatures` een `h2`, vier kaarten met een link naar `/vacatures/<slug>` en een link naar `/vacatures`. Na het sluiten van alle seedvacatures in `groos-dev` en `curl -X POST -H "Authorization: Bearer $CRON_SECRET" -H 'content-type: application/json' -d '{"numbers":[],"kind":"visibility"}' http://localhost:3000/api/dev/revalidate` (spec 10, B-35, B-46) toont `#vacatures` de tekst van `home.vacatures.emptyJobseeker` en een link naar `/inschrijven`, en blijft de sectie op dezelfde plek; daarna `npm run db:seed:reset`. | E-04-02, E-04-14 |
| AC-04-05 | Na het publiceren van een nieuwe vacature in `/beheer` (spec 08) staat die vacature na het eerstvolgende verzoek als eerste kaart in `#vacatures` op `/` en `/en`, zonder `npm run build`. | E-04-14 |
| AC-04-06 | `#beroepen` bevat vijf `h3`'s in de volgorde Glazenwasser, Schoonmaker, Logistiek medewerker, Verhuizer, Hulpkracht bouw en sloop, en tien links: de vijf `/werken-als/<slug>` met tekst "Werken als <naam in kleine letters>" en de vijf `/werkgevers/<meervoudsslug>` met tekst "Huur <meervoud in kleine letters> in". | E-04-03 |
| AC-04-07 | `#zo-werkt-het` bevat twee `h3`'s ("Voor werkzoekenden", "Voor werkgevers") en twee `ol`'s met elk drie `li`'s; de cijfers hebben `aria-hidden="true"`. In het eerste spoor komt geen los woord "u" of "uw" voor, in het tweede geen los woord "je", "jij" of "jouw". | E-04-04 |
| AC-04-08 | `document.querySelector("main").innerText` op `/` en `/over-ons` (beide talen) bevat geen van: "24/7", "dag en nacht", "binnen één werkdag", "binnen 24 uur", "keurmerk", "cao", "Wtta", "NEN", "SNA", "ABU", "NBBU", "Versseput", "Wilk", en geen getal gevolgd door "+" of "%". | E-04-05, E-04-09 |
| AC-04-09 | `#contactpersonen` op `/` en `/over-ons` bevat twee kaarten met de initialen "J" en "L", de voornamen als `h3`, links `tel:+31683351985` en `tel:+31652549539`, precies één link die begint met `https://wa.me/31683351985` en geen `img`. `#contactpersonen` op `/` linkt naar `/over-ons`. | E-04-06 |
| AC-04-10 | In `#veelgestelde-vragen` zijn na het laden vijf `details` zichtbaar met de vragen voor werkzoekenden. Na een klik op het label "Werkgevers" zijn vijf andere `details` zichtbaar en de eerste vijf niet. Dit werkt ook met `javaScriptEnabled: false`. De HTML van `/` bevat alle tien vragen en antwoorden. | E-04-07 |
| AC-04-11 | Met alleen het toetsenbord: Tab bereikt het gekozen keuzerondje "Werkzoekenden" met een zichtbare focusring, pijl rechts kiest "Werkgevers" en toont die set, Tab bereikt daarna de eerste werkgeversvraag en Enter klapt die open. | E-04-07 |
| AC-04-12 | De JSON-LD van `/` bevat precies één `EmploymentAgency` (met `address.streetAddress` "Hugo Coenraadspad 6" en `telephone` "+31683351985"), één `FAQPage` met tien `Question`-items waarvan elke `name` letterlijk als vraag in de pagina staat, en één `Organization` en één `WebSite` (uit de layout). `/en` heeft dezelfde blokken met de Engelse vragen. | E-04-11 |
| AC-04-13 | De `<title>` van `/` is "Uitzendbureau in Den Haag \| Groos Personeelsdiensten"; van `/over-ons` "Over ons \| Groos Personeelsdiensten"; van `/en/over-ons` "About us \| Groos Personeelsdiensten". Beide pagina's hebben een canonical naar zichzelf en `link[rel=alternate]` voor nl, en en x-default; de meta description van `/over-ons` is 139 tekens en van `/en/over-ons` 148 tekens. | E-04-11 |
| AC-04-14 | `/over-ons` heeft een `nav[aria-label="Kruimelpad"]` met Home en Over ons, één `BreadcrumbList` met twee items en de secties `#verhaal`, `#contactpersonen`, `#werkgebied`, `#werkwijze` en `#contact` in die volgorde. | E-04-09, E-04-11 |
| AC-04-15 | `#werkgebied` op `/over-ons` bevat een `address` met "Hugo Coenraadspad 6", "2553 ER Den Haag" en "Langskomen kan alleen op afspraak.". Met `workArea` op `false` staat "Zoetermeer" niet op de pagina; met `workArea` tijdelijk op `true` staan de negen plaatsen er wel. | E-04-09, E-04-05 |
| AC-04-16 | Met `foundingStory` op `false` staat de tekst "TODO" nergens in de HTML van `/over-ons` en bevat `#verhaal` precies de drie alinea's van `about.story.paragraphs`; `messages/nl/about.json` en `messages/en/about.json` hebben geen sleutel `story.founding`; `npm run check -- --warn` noemt de TODO-regel van `foundingStory` in `lib/claims.ts`. | E-04-05, E-04-09 |
| AC-04-17 | Op `/` en `/over-ons` heeft precies één element de klasse `surface-brand`; binnen dat element staan twee knoppen (`data-slot="cta-button"`) en een link `tel:+31683351985`. | E-04-08, E-04-16 |
| AC-04-18 | `npm run check -- --warn` meldt geen sleutelverschil tussen nl en en; `npm run check:copy` meldt geen fouten in `home` en `about`; de sleutelpaden van `home` en `about` in beide bestanden zijn exact die van §6.2. | E-04-10 |
| AC-04-19 | De bestanden `components/sections/{hero,clients,segment-accordion,metrics,trust-bar,service-ticker,process,projects,proof,assurance,about,faq}.tsx`, `components/ui/marquee.tsx` en `components/motion/count-up.tsx` bestaan niet; `grep -nE "metrics\|usps\|segments\|assurances\|certification\|clients\|projectPhotos" lib/site.ts` geeft niets; `messages/nl/home.json` en `messages/en/home.json` bevatten geen sleutel `metricLabels`, `trustBar`, `ticker`, `servicesSection`, `projects`, `proof`, `assurance` of `contactForm`. | E-04-12 |
| AC-04-20 | `grep -rln '"use client"' components/sections/home components/sections/about components/sections/cta-band.tsx` geeft niets; `grep -rn "framer-motion" app components` geeft niets. | E-04-13 |
| AC-04-21 | Lighthouse mobiel op de productiebuild van `/` (spec 14, mediaan van drie runs): Performance 90 of hoger, Accessibility 95 of hoger, LCP 2,5 s of minder, CLS 0,05 of lager; het LCP-element in het rapport is de `h1` of een tekstknoop daarin. | E-04-13 |
| AC-04-22 | `scripts/check-bundles.mjs` (spec 14) meldt voor `/[locale]` ten hoogste 200 kB first-load JavaScript (gzip). | E-04-13 |
| AC-04-23 | Op 390, 768, 1280 en 1440 px geldt op `/` en `/over-ons` `document.documentElement.scrollWidth <= window.innerWidth`; op 390 px is elk element met `data-slot="cta-button"` en elke link in `#beroepen` minstens 44 px hoog. | E-04-01, E-04-16 |
| AC-04-24 | Met `reducedMotion: "reduce"` en ook met JavaScript uit hebben alle elementen met `data-reveal` op `/` en `/over-ons` direct na het laden `opacity: 1`; geen element binnen `section[aria-labelledby="home-titel"]` heeft `data-reveal`. | E-04-13, E-04-16 |
| AC-04-25 | `public/` bevat na stap 4 geen fotobestand buiten `public/brand/`; `/` en `/over-ons` laden geen `img` en geen verzoek naar een andere host dan localhost en `/_vercel/insights`. | E-04-16, E-04-06 |
| AC-04-26 | De axe-scan van spec 14 (`a11y/axe.spec.ts`) meldt op `/`, `/en` en `/over-ons` geen fouten, ook niet voor `heading-order`. | E-04-01, E-04-07 |
| AC-04-27 | `docs/21st-keuzes.md` heeft een sectie "Spec 04" met per plek uit §9.2 tot en met §9.9 twee tot vier kandidaten (id, naam, preview-URL), de keuze en de aanpassingen; er zijn in deze stap hoogstens twee `get_component`-aanroepen gedaan. | E-04-15 |

## 12 Open vragen en aannames

| Onderwerp | Aanname in deze spec | Bevestigt | Wat verandert als het anders is |
|---|---|---|---|
| 1. Deurkoppen als h2 | De twee deuren in de hero hebben een h2, omdat ze elk een eigen deel van de pagina zijn; daardoor geen sprong van h1 naar h3. | Djulan | Met h3: alleen `HomeHero`; axe kan dan `heading-order` melden. |
| 2. Vragenblok zonder JavaScript | Wissel met native keuzerondjes en `:has()`, geen base-ui `Tabs`, zodat alle antwoorden in de HTML staan (spec 02 sluit `Tabs` uit voor indexeerbare inhoud). | Djulan | Met base-ui `Tabs` en `keepMounted`: `HomeFaq` wordt een clientcomponent en `home` moet in `CLIENT_NAMESPACES`. |
| 3. Kop van de vacaturesectie | `LatestVacancies` (spec 06) neemt `heading` als string; deze spec geeft `title` en `accent` samen als platte tekst mee, zonder accentkleur. Dat wijkt af van regel 7 van spec 03 (h2 in twee delen met accent). | spec 06, kruiscontrole | Krijgt `heading` het type `ReactNode`, dan geeft `HomeVacancies` de kop met `<span className="accent-text">` mee. |
| 4. Aantal vacatures op home | `limit={4}`, omdat `VacancyList` vanaf `md` twee kolommen heeft. | Djulan | Bij drie: één kaart alleen op de tweede rij; bij een grid van drie kolommen moet spec 06 `VacancyList` een `className` voor de lijst laten doorgeven. |
| 5. Personenkaart | `ContactPersonCard` van spec 07 op `/` en `/over-ons` (spec 07 §12 staat dat toe). De klikgebeurtenissen gaan dan als `form: "contact"` naar Vercel Analytics, ook op de homepage. | spec 07, Djulan | Krijgt de kaart een prop voor de bron (bijvoorbeeld `source: "home"`), dan geeft deze spec die mee. |
| 6. Rol bij de personen | Geen rol op de kaart, zoals spec 07 vastlegt; `common.people.<id>.role` blijft ongebruikt tot de echte rol bekend is. | Jimmy en Lorenzo | Rol bevestigd: spec 07 toont hem in de kaart; deze spec verandert niet. |
| 7. Werkgebied | Zichtbaar: "Den Haag en omgeving". De negen plaatsen in Haaglanden (context/02) staan achter de claim `workArea`, omdat spec 03 "Haaglanden" en plaatsnamen pas na bevestiging toestaat. `areaServed` is Den Haag; Haaglanden pas na claim `workArea` (B-43). | Jimmy en Lorenzo | Bevestigd: vlag op `true`; `areaServed` krijgt Haaglanden erbij (B-43, spec 12); eventueel de lijst in `about.area.places` aanpassen (nl en en even lang). |
| 8. Oprichtingsverhaal | Niet zichtbaar en zonder sleutel in messages; de open claim staat als TODO-regel bij `foundingStory` in `lib/claims.ts`. Het verband met J. Versseput wordt nooit genoemd (B-26). | Jimmy en Lorenzo | Bevestigd: de schrijver voegt `about.story.founding` toe met twee zinnen volgens AS-12 in beide talen en zet de vlag op `true`. |
| 9. Betekenis van de naam | "Een oud Nederlands woord voor trots, nog gebruikt in Zeeland en Rotterdam" volgens context/12 §4.1; de Vlaamse herkomst uit de briefing is niet bevestigd en staat er niet in. | Jimmy | Andere uitleg: alleen `about.story.paragraphs[0]` en `about.hero.title`. |
| 10. Feiten in de copy | "Hun 06-nummers staan bij elke vacature" steunt op de contactpersoon per vacature (B-21, spec 06 E-06-14); "bij elke vacature staat of je Nederlands nodig hebt" steunt op de eisen per vacature (spec 03 §5.3) en straks het veld taal op de werkvloer (spec 06 E-06-13). | spec 06, 10 | Valt een van beide weg, dan wordt die zin herschreven of geschrapt. |
| 11. Werkwijzezinnen (categorie B) | "Wij bellen je", "wij stellen mensen voor", "wij houden contact zolang de inzet loopt" en "wij bespreken elke aanvraag" zijn werkwijze zonder getal en mogen nu, met meelezen door Jimmy en Lorenzo (spec 03 §10.2). | Jimmy en Lorenzo | Klopt een werkwijze niet, dan die zin aanpassen in nl en en. |
| 12. Keurmerk en citaten | Geen strook en geen citaten. Na bevestiging van `keurmerk` krijgt `WhyGroos` een vijfde kaart met registerlink; na `testimonials` kan een citaatsectie tussen `WhyGroos` en `HomePeople` komen. | Jimmy en Lorenzo | Nieuwe sleutels `home.why.items.keurmerk` en eventueel `home.quote`; geen andere secties veranderen. |
| 13. WhatsApp-sleutels | Vervallen: de namen van spec 03 gelden. Deze spec leest zelf geen WhatsApp-sleutel. | besloten (kruiscontrole ronde 1) | Geen. |
| 14. Bouwvolgorde | Bouwstap 4 voor deze spec is gecommit (1a15c0c, gemerged in 1668ce0). `LatestVacancies` (spec 06) en `ContactPersonCard` (spec 07) komen uit hun eigen worktrees; de nazorg-sub-agent in bouwstap 3b controleert dat `HomeVacancies` en de personensecties ze gebruiken en voert de wijzigingen uit kruiscontrole ronde 2 en 3 uit (§10, B-52). | Djulan | Geen. |
| 15. Engelse beroepsnaam | Gesloten: de Engelse naam is "Construction and demolition labourer" (meervoud "construction and demolition labourers", spec 05 en 00 §4.2). De links gebruiken `beroepen.<id>.enkelvoud` en `.meervoud` van spec 05. | besloten (kruiscontrole ronde 1) | Geen. |

Afwijkingen van B-01 tot en met B-37: geen. Punt 3 is een afwijking van een schrijfregel van spec 03, geen besluit uit 00.
