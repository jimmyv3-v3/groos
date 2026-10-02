# 01 Informatiearchitectuur, routes, navigatie, i18n en applicatieframework

| Status | Fase | Hangt af van | Bronnen |
|---|---|---|---|
| concept | 1 | 00; 02 (tokens, fonts, logo, primitives); 03 (sleutels en copy); 05 (beroepsnamen); 10 (datalaag); 12 (SEO-builders) | context/03 (leidend voor routes en navigatie), docs/MIGRATIE.md §5, §7, §8, §9, context/08 §6.1 en §7, context/10 §2 en §7, bijlagen/repo-inventaris.md, `node_modules/next/dist/docs` (Next 16.3.8) |

## 1 Doel

Deze spec legt het skelet vast waar alle andere modules in passen: welke routes er zijn en hoe ze renderen, hoe een bezoeker navigeert (header, uitklapmenu's, mobiel menu, actiebalk, taalknop, footer en kruimelpad), hoe de tweetaligheid werkt en hoe de app technisch is opgebouwd met Next.js 16 en React 19. De spec levert de registers waar de andere specs op bouwen (`lib/site.ts`, `lib/routes.ts`, `content/beroepen/index.ts`), de foutafhandeling, de conventies voor caching, formulieren en afbeeldingen en de verwijderlijst die de J. Versseput-basis terugbrengt tot wat Groos nodig heeft. Na deze module bestaat elke route van fase 1 op localhost met werkende navigatie in beide talen, ook al vullen de specs 04 tot en met 09 de inhoud pas in latere bouwstappen.

## 2 Gebruikers en scenario's

**Werkzoekende**

- S-01-01 Een schoonmaker zoekt op zijn telefoon "schoonmaakwerk den haag" en landt op `/werken-als/schoonmaker`. Bovenaan ziet hij een kruimelpad, onderin een vaste balk met "Bel ons" en "App ons"; WhatsApp opent met een vooringevuld bericht.
- S-01-02 Een werkzoekende opent op `/` het menu op volledig scherm, klapt "Werkzoekenden" open en kiest "Verhuizer". Het menu sluit en `/werken-als/verhuizer` staat open.
- S-01-03 Een logistiek medewerker in Polen opent een vacature via Google for Jobs. Bij zijn eerste bezoek stuurt de proxy hem naar `/en/vacatures/<slug>`, waar hij een Engelse interface ziet met een melding dat de vacaturetekst Nederlands is. Met de taalknop gaat hij naar dezelfde vacature op de Nederlandse URL.

**Werkgever**

- S-01-04 Een facilitair manager opent op zijn laptop het uitklapmenu "Werkgevers" en kiest "Schoonmakers". Op `/werkgevers/schoonmakers` staat rechtsboven de knop "Personeel aanvragen".
- S-01-05 Een planner van een verhuisbedrijf leest `/werkgevers/verhuizers` op zijn telefoon en tikt in de vaste balk op "Personeel aanvragen".

**Iedere bezoeker**

- S-01-06 Een bezoeker volgt een verouderde link en krijgt een 404 met header, footer, een korte uitleg en links naar vacatures, personeel aanvragen en contact, in de taal van het pad.
- S-01-07 Een toetsenbordgebruiker springt met "Ga direct naar de inhoud" over de header, opent het uitklapmenu met Enter, loopt met Tab en pijltjes door de links en sluit met Escape.
- S-01-08 De database is even onbereikbaar. De bezoeker ziet een foutpagina met "Probeer opnieuw" en het telefoonnummer in plaats van een wit scherm.

**Beheerder**

- S-01-09 Jimmy opent `/beheer` op zijn telefoon tijdens een vakantie in Spanje. Hij krijgt geen taalomleiding en geen publieke header, want `/beheer` heeft een eigen root-layout (spec 08).
- S-01-10 Lorenzo publiceert een vacature in `/beheer`. De vacature verschijnt op `/vacatures`, op de homepage en in de sitemap zonder nieuwe build, omdat de caching op tags en paden werkt (§4.15).

**Crawler**

- S-01-11 Googlebot crawlt vanuit de VS `/werkgevers` en krijgt de Nederlandse pagina met status 200, zonder geo-omleiding, met canonical en hreflang. De Rich Results Test (user agent `Google-InspectionTool`) krijgt evenmin een omleiding.

## 3 Scope

**Wel in fase 1**

- De routetabel van fase 1 met per route het bestand, de eigenaar, de rendering, de revalidatie, de indexering en de talen (§4.1).
- De mappenstructuur, de server- en clientgrenzen en de werkwijze met Next 16 en React 19 (§4.2 en §4.3).
- De registers `lib/site.ts`, `lib/routes.ts`, `lib/navigation.ts`, `lib/revalidate.ts` en `content/beroepen/index.ts` (§5).
- Header, uitklapmenu's, mobiel menu, actiebalk, taalknop, footer en kruimelpad: structuur, gedrag en toegankelijkheid. Het uiterlijk volgt de tokens van spec 02.
- De i18n-configuratie, `proxy.ts` en het gedrag van `/en` bij vacatures (§4.11 en §4.12).
- Foutafhandeling, laadstaten, caching, formulierconventies, afbeeldingen, Tailwind 4 en packages als kaders voor alle specs (§4.13 tot en met §4.19).
- Skeletpagina's voor alle routes waarvan de inhoud later komt (§4.20) en de verwijderlijst (§4.10).
- Welke routes in de sitemap en in `llms.txt` horen (§7.3); de implementatie is van spec 12.

**Niet in deze spec**

Tekst en tone of voice (spec 03 en de paginaspecs), tokens, fonts en logo (spec 02), homepagesecties (spec 04), paginatemplates (specs 05, 06, 07, 09), datamodel en leesfuncties (spec 10), SEO-builders en de implementatie van sitemap en `llms.txt` (spec 12), headers en redirects in `next.config.mjs` (spec 13), testopzet (spec 14).

**Fase 2**

Vertaalde Engelse paden met next-intl `pathnames` (bijvoorbeeld `/en/jobs`) als Djulan daarvoor kiest, extra talen (pl, bg, tr, ro), `/jobalert`, `/regio/[plaats]`, `/feeds/[portaal]`, Engelse vacatures met eigen canonical en hreflang, en een menu-item voor regio's.

**Eisen**

| Id | Eis | Dient |
|---|---|---|
| E-01-01 | Elke route uit §4.1 bestaat met het genoemde bestand, de rendering en de indexeringsregel; er bestaan geen andere publieke routes (behalve `/stijlgids` in ontwikkeling). | R-01, R-19 |
| E-01-02 | De JV-modules dienst, werkgebied en Web3Forms zijn verwijderd volgens §4.10 en geen code verwijst er nog naar. | R-08, R-19 |
| E-01-03 | De mappenstructuur en de server- en clientgrenzen volgen §4.2 en §4.3; `"use client"` staat alleen op componenten met interactie. | R-15, R-19 |
| E-01-04 | `lib/site.ts` heeft de vorm van §5.1 met de NAW-gegevens (B-23), het hoofdnummer (B-21), het e-mailadres (B-02), beide contactpersonen, navigatie en footerkolommen; onbevestigde gegevens zijn gemarkeerd met `TODO`. | R-09, R-12 |
| E-01-05 | `content/beroepen/index.ts` is de enige bron voor beroep-id's, beide slugs, iconen en volgorde (§5.2). | R-01, R-19 |
| E-01-06 | `lib/routes.ts` is de enige bron voor vaste paden, padhelpers, doelgroep per pad en de indeling voor sitemap en `llms.txt` (§5.3). | R-09, R-19 |
| E-01-07 | De desktopheader toont Vacatures, Werkzoekenden (uitklapmenu), Werkgevers (uitklapmenu), Over ons en Contact, met rechts het hoofdnummer, de taalknop en een knop die past bij de doelgroep van de pagina (§4.4). | R-01, R-05 |
| E-01-08 | Het mobiele menu is een modaal dialoogvenster op volledig scherm met focusval, Escape, scrollvergrendeling en uitklapgroepen per doelgroep (§4.5). | R-14, R-15 |
| E-01-09 | Onder 1024 px staat een vaste actiebalk met twee acties die per context verschillen (§4.6). | R-01, R-14 |
| E-01-10 | De taalknop wisselt naar hetzelfde pad in de andere taal, behoudt queryparameters en onthoudt de keuze (§4.7). | R-13 |
| E-01-11 | De footer toont op elke pagina dezelfde NAW-gegevens, de linkkolommen en de juridische links (§4.8). | R-09, R-01 |
| E-01-12 | Elke pagina onder de homepage, behalve bedankpagina's, toont een zichtbaar kruimelpad met BreadcrumbList uit dezelfde gegevens (§4.9). | R-09, R-15 |
| E-01-13 | De tweetaligheid volgt B-03: NL op de root, EN onder `/en`, Nederlandse paden, gespiegelde messages, statische generatie per taal (§4.11). | R-13 |
| E-01-14 | `/en/vacatures/[slug]` toont de Nederlandse vacature met een Engelse melding, canonical naar de NL-URL, zonder hreflang en zonder JobPosting (§4.11.6). | R-13, R-10 |
| E-01-15 | `proxy.ts` sluit in de eerste matcher `api`, `beheer`, `feeds`, `monitoring`, het BotID-pad en statische bestanden uit; `/beheer` gaat alleen via de tweede matcher naar `beheerProxy()` (B-38). Crawlers krijgen nooit een geo-omleiding (§4.12). | R-09, R-03 |
| E-01-16 | Onbekende paden en `notFound()` geven status 404 met een gelokaliseerde pagina; runtimefouten tonen een herstelbare foutpagina (§4.13). | R-15 |
| E-01-17 | Er staat geen `loading.tsx` onder `app/[locale]`; laadstaten lopen via `<Suspense>` binnen pagina's (§4.14). | R-15, R-09 |
| E-01-18 | Caching en revalidatie volgen B-35 en de routetabel; publieke paden worden altijd per taal ververst (§4.15). | R-02, R-15 |
| E-01-19 | Formulieren volgen B-36 met Server Actions in `app/actions/*`, gedeelde zod-schema's en `useActionState` (§4.16). | R-04, R-14 |
| E-01-20 | Alle beelden gaan via `next/image`; er staat geen `<img>` meer in de code (§4.17). | R-15 |
| E-01-21 | Componenten van deze spec gebruiken alleen tokenklassen van spec 02 in Tailwind 4 (§4.18). | R-05 |
| E-01-22 | Deze spec voegt geen dependencies toe en verwijdert `@radix-ui/react-slot` (§4.19). | R-19 |
| E-01-23 | Sitemap en `llms.txt` bevatten precies de indexeerbare routes van §7.3. | R-09 |
| E-01-24 | De bouw-agent zet per UI-plek een sub-agent in die via 21st.dev kandidaten zoekt (§9). | R-16 |
| E-01-25 | Alles uit deze spec is te verifiëren op localhost tegen het dev-project `groos-dev`, zonder deploy. | R-17 |

## 4 Pagina's en componenten

### 4.1 Routetabel fase 1

Alle publieke routes staan onder `app/[locale]`. NL draait op de root (next-intl herschrijft intern naar `/nl/...`), EN onder `/en`. De Engelse paden zijn gelijk aan de Nederlandse (B-03). "Statisch" betekent prerender bij de build; "ISR" betekent statisch met revalidatie; "dynamisch" betekent renderen per verzoek. `generateStaticParams` voor de taal staat alleen in de layout; kindroutes geven alleen hun eigen parameter terug en Next combineert dat per taal.

| Route | Bestand in `app/` | Paginatype en eigenaar | Rendering en parameters | `revalidate` | Index | Talen |
|---|---|---|---|---|---|---|
| `/` | `[locale]/page.tsx` | home met twee routes, 04 | ISR | `3600` (leest `LatestVacancies`, tag `vacatures`) | ja | nl, en |
| `/vacatures` | `[locale]/vacatures/page.tsx` | overzicht met zoeken en filters, 06 | dynamisch door `searchParams`; data via `unstable_cache` (spec 10) | n.v.t. (data `3600` plus tags) | ja; met filterparameters `noindex, follow` en canonical `/vacatures`; `?pagina=n` self-canonical (B-16) | nl, en (interface vertaald, vacaturetekst nl) |
| `/vacatures/[slug]` | `[locale]/vacatures/[slug]/page.tsx` | vacature met sollicitatieformulier, 06 en 07 | ISR; `generateStaticParams` geeft slugs van gepubliceerde vacatures; `dynamicParams = true` (B-35) | `3600` plus tags `vacatures`, `vacature:<nummer>` | ja; gesloten `noindex, follow`; na 30 dagen of gearchiveerd 404 (B-15) | nl; en toont nl-tekst met melding (§4.11.6) |
| `/inschrijven` | `[locale]/inschrijven/page.tsx` | open sollicitatie en inschrijven, 07 | statisch | `false` | ja | nl, en |
| `/werkzoekenden` | `[locale]/werkzoekenden/page.tsx` | doelgroeppagina, 05 | ISR | `3600` als de pagina vacatures toont, anders `false` (spec 05 kiest) | ja | nl, en |
| `/werken-als/[beroep]` | `[locale]/werken-als/[beroep]/page.tsx` | beroepspagina werkzoekende, 05 | ISR; `generateStaticParams` geeft de vijf `slugWerkzoekende`; `dynamicParams = false` | `3600` (live vacatures per beroep) | ja | nl, en |
| `/werkgevers` | `[locale]/werkgevers/page.tsx` | doelgroeppagina, 05 | statisch | `false` | ja | nl, en |
| `/werkgevers/[beroep]` | `[locale]/werkgevers/[beroep]/page.tsx` | beroepspagina opdrachtgever, 05 | statisch; `generateStaticParams` geeft de vijf `slugWerkgever`; `dynamicParams = false` | `false` | ja | nl, en |
| `/werkgevers/personeel-aanvragen` | `[locale]/werkgevers/personeel-aanvragen/page.tsx` | aanvraagformulier, 07 | statisch (Server Actions maken een pagina niet dynamisch) | `false` | ja | nl, en |
| `/werkgevers/wtta` | `[locale]/werkgevers/wtta/page.tsx` | kennispagina, 05 met juridische toets van 09 | statisch | `false` | ja | nl, en |
| `/over-ons` | `[locale]/over-ons/page.tsx` | verhaal en personen, 04 | statisch | `false` | ja | nl, en |
| `/contact` | `[locale]/contact/page.tsx` | contactgegevens en formulier, 07 | statisch | `false` | ja | nl, en |
| `/privacyverklaring` | `[locale]/privacyverklaring/page.tsx` | juridisch, 09 | statisch | `false` | ja | nl, en |
| `/cookieverklaring` | `[locale]/cookieverklaring/page.tsx` | juridisch, 09 | statisch | `false` | ja | nl, en |
| `/algemene-voorwaarden` | `[locale]/algemene-voorwaarden/page.tsx` | juridisch, 09 | statisch | `false` | `noindex` en niet gelinkt zolang `getLegalDoc("terms").published` in `lib/legal.ts` onwaar is (B-11, B-40) | nl, en |
| `/klachtenregeling` | `[locale]/klachtenregeling/page.tsx` | juridisch, 09 | statisch | `false` | ja | nl, en |
| `/bedankt/[soort]` | `[locale]/bedankt/[soort]/page.tsx` | bedankpagina's, 07 | statisch; `generateStaticParams` geeft `sollicitatie`, `inschrijving`, `aanvraag`, `contact`; `dynamicParams = false` | `false` | `noindex, follow` | nl, en |
| `/stijlgids` | `[locale]/stijlgids/page.tsx` | stijlgids voor ontwikkeling, 02 | statisch; in productie `notFound()` | `false` | `noindex, nofollow`, niet in `STATIC_ROUTES`, sitemap of llms.txt | nl, en |
| onbekend pad | `[locale]/[...rest]/page.tsx` | vangnet, 01 | dynamisch; roept `notFound()` | n.v.t. | 404 | nl, en |
| `/beheer/*` | `beheer/layout.tsx` (eigen root-layout) en `beheer/**` | beheeromgeving, 08 | dynamisch (sessie) | n.v.t. | `noindex, nofollow`, robots.txt `Disallow` | alleen nl |
| `/api/cron/*` | `api/cron/<taak>/route.ts` | geplande taken, 10 | route handler `GET` met `CRON_SECRET` | n.v.t. | n.v.t. | n.v.t. |
| `/api/upload/cv` | `api/upload/cv/route.ts` | signed upload URL, 07 | route handler `POST` | n.v.t. | n.v.t. | n.v.t. |
| `/api/webhooks/resend` | `api/webhooks/resend/route.ts` | Resend-webhook, 11 | route handler `POST` | n.v.t. | n.v.t. | n.v.t. |
| `/api/dev/e-mail` | `api/dev/e-mail/route.ts` | voorbeeldroute, 11 | alleen `next dev`, anders 404 | n.v.t. | n.v.t. | n.v.t. |
| `/api/dev/revalidate` | `api/dev/revalidate/route.ts` | revalidatie tijdens ontwikkeling, 10 | route handler, alleen `POST`; buiten de taalrouting (de eerste matcher sluit `api` uit); op productie (`VERCEL_ENV === "production"`) 404 | n.v.t. | niet in sitemap of llms.txt; `Disallow: /api/` geldt al (B-46) | n.v.t. |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt` | `sitemap.ts`, `robots.ts`, `llms.txt/route.ts` | 12 | sitemap ISR `3600`; robots statisch; llms.txt statisch (`force-static`, spec 12 §4.9) | zie spec 12 | n.v.t. | n.v.t. |
| `/opengraph-image`, `/twitter-image`, `/icon`, `/apple-icon` | bestaande bestanden | 12 en 02 | statisch | n.v.t. | n.v.t. | n.v.t. |
| `/vacatures/<slug>/opengraph-image`, `/werken-als/<slug>/opengraph-image`, `/werkgevers/<slug>/opengraph-image` (plus `twitter-image`, ook onder `/en`) | `opengraph-image.tsx` en `twitter-image.tsx` in `[locale]/vacatures/[slug]/`, `[locale]/werken-als/[beroep]/` en `[locale]/werkgevers/[beroep]/` | OG-afbeelding per pagina, 12 | via de proxy (de taalprefix is nodig, §4.12) | zie spec 12 | n.v.t. | nl, en |

Speciale bestanden van deze spec: `app/[locale]/layout.tsx`, `app/[locale]/not-found.tsx`, `app/[locale]/error.tsx`, `app/[locale]/[...rest]/page.tsx`, `app/global-error.tsx` en `app/global-not-found.tsx` (§4.13).

Volgorde van routeherkenning: statische segmenten gaan voor dynamische. Daarom wint `werkgevers/personeel-aanvragen` en `werkgevers/wtta` van `werkgevers/[beroep]`, en `beheer` van `[locale]`. Geen publiek pad mag beginnen met `api`, `beheer`, `feeds`, `monitoring`, `149e9513-01fa-4fb0-aad4-566afd725d1b` (BotID, spec 13 §4.4), `icon`, `apple-icon`, `opengraph-image` of `twitter-image`, omdat de proxy die voorvoegsels overslaat.

Fase 2, nu niet bouwen: `/jobalert` en `/regio/[plaats]` onder `[locale]`, `/feeds/[portaal]` als route handler in `app/feeds/[portaal]/route.ts` buiten `[locale]` (spec 15).

### 4.2 Mappenstructuur

Eigenaar tussen haakjes. Mappen die nog niet bestaan maakt de eigenaar aan in zijn bouwstap.

```
app/
  [locale]/
    layout.tsx                         root-layout publieke site (01)
    not-found.tsx  error.tsx           gelokaliseerde 404 en foutgrens (01)
    [...rest]/page.tsx                 vangnet voor onbekende paden (01)
    page.tsx                           / (04)
    vacatures/page.tsx                 (06)
    vacatures/[slug]/page.tsx          (06, formulier 07)
    vacatures/[slug]/opengraph-image.tsx, twitter-image.tsx       (12)
    inschrijven/page.tsx               (07)
    werkzoekenden/page.tsx             (05)
    werken-als/[beroep]/page.tsx       (05)
    werken-als/[beroep]/opengraph-image.tsx, twitter-image.tsx    (12)
    werkgevers/page.tsx                (05)
    werkgevers/[beroep]/page.tsx       (05)
    werkgevers/[beroep]/opengraph-image.tsx, twitter-image.tsx    (12)
    werkgevers/personeel-aanvragen/page.tsx  (07)
    werkgevers/wtta/page.tsx           (05, 09)
    over-ons/page.tsx                  (04)
    contact/page.tsx                   (07)
    privacyverklaring/  cookieverklaring/  algemene-voorwaarden/  klachtenregeling/  (09)
    bedankt/[soort]/page.tsx           (07)
    stijlgids/page.tsx                 (02, alleen ontwikkeling)
  beheer/                              eigen root-layout, alleen NL (08)
    _lib/proxy.ts                      beheerProxy() (08; stub uit stap 3 van deze spec, §4.12)
  actions/                             Server Actions van de publieke formulieren (07)
  api/
    upload/cv/route.ts                 (07)
    webhooks/resend/route.ts           (11)
    dev/e-mail/route.ts                (11)
    dev/revalidate/route.ts            (10)
    cron/{vacatures,bewaartermijnen,opruimen}/route.ts   (10)
  global-error.tsx  global-not-found.tsx   (01)
  globals.css                          (02)
  sitemap.ts  robots.ts  llms.txt/route.ts  opengraph-image.tsx  twitter-image.tsx  (12)
  icon.tsx  apple-icon.tsx             (02)
components/
  sections/   site-header.tsx, site-footer.tsx, site-action-bar.tsx, breadcrumbs.tsx,
              page-placeholder.tsx en header/* (01); homepagesecties (04)
  service/    bestaande bouwstenen van detailpagina's, namen ongewijzigd (05)
  beroep/     nieuwe beroepsspecifieke componenten (05)
  vacatures/  (06)    forms/ (07)    beheer/ (08)
  legal/      footer-legal.tsx en de overige juridische componenten (09; stub van footer-legal.tsx uit stap 3, §4.8)
  brand/  ui/  motion/   (02)        seo/json-ld.tsx (12)
content/
  beroepen/index.ts (01); beroepen/<id>.ts en beroepen/pages.ts (05)
  pages/{werkzoekenden,werkgevers,wtta}.ts (05); pages/over-ons.ts (04, als spec 04 dat kiest)
i18n/         routing.ts, navigation.ts, request.ts, formats.ts, client-messages.ts, locale.ts (01)
lib/
  site.ts  routes.ts  navigation.ts  revalidate.ts   (01)
  seo.ts (12)   brand.ts  fonts.ts (02)   utils.ts (bestaand)
  supabase/{server,browser,admin}.ts  data/*  database.types.ts   (10)
  validation/* (07)    email/* (11)
emails/       React Email-sjablonen (11)
messages/     nl/<namespace>.json, en/<namespace>.json: één bestand per namespace (sleutels 03, namespaces per eigenaar)
              nl/index.ts, en/index.ts: voegen de namespaces per taal samen (01, B-45)
supabase/     migrations/, seed.sql, config.toml (10)
scripts/      check-launch.mjs (14)
proxy.ts  global.d.ts   (01)
```

`components/service/` blijft bestaan met de bestaande namen (`ServiceHero`, `ServiceCta`, `ServiceFaq`, `ServiceFeatureGrid`, `ServiceSteps`), zodat de verwijzingen in de repo-inventaris en in andere specs kloppen. Nieuwe componenten die alleen bij beroepen horen, zet spec 05 in `components/beroep/`.

### 4.3 Server- en clientgrenzen en de werkwijze van Next 16 en React 19

**Regels**

1. Pagina's, layouts, secties en alles in `content/` zijn server components. `"use client"` staat alleen op componenten met state, effecten, browser-API's of event handlers.
2. Clientcomponenten krijgen tekst bij voorkeur als props van een server component. Gebruiken ze toch `useTranslations`, dan moet de namespace in `CLIENT_NAMESPACES` staan (§4.11.4).
3. Geef geen functies of componenttypen als prop aan een clientcomponent. Iconen gaan als gerenderd element (`icon: <Truck aria-hidden />`, type `ReactNode`), niet als `LucideIcon`.
4. Server-only modules beginnen met `import "server-only"`: `lib/navigation.ts`, `lib/revalidate.ts`, `lib/data/*`, `lib/supabase/server.ts` en `admin.ts`, `lib/email/*` en de loaders van lange tekst in `content/beroepen/pages.ts` en `content/pages/*`. Next verwerkt dat pakket intern; installeren is niet nodig (`01-app/02-guides/data-security.md`).
5. `content/beroepen/index.ts`, `lib/site.ts` en `lib/routes.ts` bevatten geen tekst en zijn veilig voor de client.

**Clienteilanden van deze spec**

| Component | Bestand | Waarom client |
|---|---|---|
| `DesktopNav` | `components/sections/header/desktop-nav.tsx` | base-ui `NavigationMenu`, actieve staat via `usePathname` |
| `HeaderCta` | `components/sections/header/header-cta.tsx` | knop hangt af van het pad |
| `MobileMenu` | `components/sections/header/mobile-menu.tsx` | base-ui `Dialog` en `Accordion`, open-staat |
| `ActionBar` | `components/sections/header/action-bar.tsx` | variant per pad, verbergen bij focus in een veld |
| `LanguageToggle` | `components/ui/language-toggle.tsx` (bestaand) | cookie en router |
| `LocaleError` | `app/[locale]/error.tsx` | foutgrenzen zijn altijd client |
| `GlobalError` | `app/global-error.tsx` | idem |

**Werkwijze die alle specs volgen** (met de bron in `node_modules/next/dist/docs/01-app/`)

- `params` en `searchParams` zijn Promises. Typeer met de globale helpers `PageProps<"/[locale]/werken-als/[beroep]">` en `LayoutProps<"/[locale]">`; die ontstaan door `next typegen`, daarom wordt het script `typecheck` `next typegen && tsc --noEmit` (`03-api-reference/03-file-conventions/page.md`, `layout.md`, `03-api-reference/06-cli/next.md`).
- Taalrouting in `proxy.ts`, de opvolger van `middleware.ts` (`03-api-reference/03-file-conventions/proxy.md`).
- Meerdere root-layouts: `app/[locale]/layout.tsx` en `app/beheer/layout.tsx` hebben elk `<html>` en `<body>`; er is geen `app/layout.tsx`. Navigeren tussen beide is een volledige paginalading (`03-file-conventions/layout.md`, "Root Layout").
- Foutgrenzen krijgen in 16.3 `{ error, retry }`; `retry()` haalt de segmenten opnieuw op, `reset()` blijft bestaan voor zeldzame gevallen (`03-file-conventions/error.md`).
- `not-found.tsx` per segment en `global-not-found.tsx` voor URL's zonder route (`03-file-conventions/not-found.md`).
- Statuscodes: zodra een antwoord streamt is de status 200; `notFound()` moet daarom vóór elke Suspense-grens vallen (`03-file-conventions/loading.md`, "Status Codes").
- Mutaties via Server Actions met `useActionState`; Next voert acties per client na elkaar uit en controleert de `Origin` (`02-guides/server-actions.md`, `02-guides/forms.md`).
- Caching zonder Cache Components: `unstable_cache` met tags, segmentconfig `revalidate`, `revalidateTag(tag, "max")` met verplicht tweede argument, `updateTag` alleen in Server Actions, `revalidatePath` met het bestemmingspad bij rewrites (`02-guides/caching-without-cache-components.md`, `02-guides/upgrading/version-16.md`, `04-functions/revalidatePath.md`).
- Metadata via `generateMetadata` en `pageMetadata()` uit `lib/seo.ts`; in componenten die geen metadata kunnen exporteren (foutpagina's) zet React 19 de titel met een `<title>`-element (`01-getting-started/14-metadata-and-og-images.md`).
- `next/image` met `preload` voor het LCP-beeld; `priority` is in 16 vervallen (`03-api-reference/02-components/image.md`).
- `<html data-scroll-behavior="smooth">` zodat Next bij paginawissels niet traag scrollt terwijl ankers wel soepel scrollen (`02-guides/upgrading/version-16.md`, "Scroll Behavior Override").
- React 19: `ref` als gewone prop (geen `forwardRef`), `<Context value>` als provider, `useActionState`, `useFormStatus`, `useOptimistic` en `<title>` in componenten.

### 4.4 Header desktop (vanaf `lg`, 1024 px)

**Bestand en rol.** `components/sections/site-header.tsx` wordt een async server component zonder props (`export async function SiteHeader()`). De layout rendert hem één keer; pagina's renderen geen header meer. Hij haalt het navigatiemodel op met `getNavModel()` uit `lib/navigation.ts` (§5.4) en geeft opgeloste labels, paden en iconen door aan de clienteilanden.

**Opbouw van links naar rechts**

```
<header>                      sticky top-0 z-50, witte achtergrond, rand onder, hoogte 64 px
  <Link href="/">             logo: <Wordmark idSuffix="header" />, aria-label header.homeAria
  <DesktopNav>                alleen lg en breder; aria-label header.mainMenu
     Vacatures | Werkzoekenden ▾ | Werkgevers ▾ | Over ons | Contact
  <div ml-auto>
     <a href="tel:+31683351985">   lg: icoon met aria-label header.callAria; xl: icoon plus "06 83 35 19 85"
     <LanguageToggle />            alleen lg en breder
     <HeaderCta />                 alleen lg en breder, CtaButton size "sm"
     <MobileMenu />                alleen de trigger, onder lg zichtbaar
```

**Uitklappaneel Werkzoekenden** (base-ui `NavigationMenuContent`, breedte ongeveer 34rem, twee kolommen):

- links een lijst met de vijf beroepen in de volgorde van `content/beroepen/index.ts`: icoon plus `beroepen.<id>.enkelvoud`, link `paths.werkenAls(id)`. De `<ul>` heeft `aria-label` `header.menu.beroepenWerkzoekenden`; er staat geen zichtbaar label boven de lijst (geen eyebrows);
- rechts "Inschrijven" (`/inschrijven`, icoon `UserPlus`, met nadruk als knopachtige rij) en "Alles voor werkzoekenden" (`/werkzoekenden`, icoon `ArrowRight`).

**Uitklappaneel Werkgevers**: links de vijf beroepen met `beroepen.<id>.meervoud` en link `paths.werkgeverBeroep(id)`, `aria-label` `header.menu.beroepenWerkgevers`; rechts "Personeel aanvragen" (`/werkgevers/personeel-aanvragen`, icoon `ClipboardList`, met nadruk), "Inlenen en de Wtta" (`/werkgevers/wtta`, icoon `Scale`) en "Alles voor werkgevers" (`/werkgevers`, icoon `ArrowRight`).

Geen beschrijvingen, beelden of cijfers in de panelen. Iconen: Lucide 0.456, lijndikte 2 (B-28), `aria-hidden`.

**Actieve staat.** Een link waarvan `href` gelijk is aan het pad krijgt `aria-current="page"`. Het hoofdmenu-item van de sectie (Vacatures voor `/vacatures/*`, Werkzoekenden voor `/werkzoekenden`, `/werken-als/*` en `/inschrijven`, Werkgevers voor `/werkgevers/*`) krijgt `data-active` voor de styling van spec 02. De logica staat in `isActive()` in `lib/routes.ts`.

**Knop rechts (`HeaderCta`).** De knop volgt `headerCtaFor(pathname)` uit `lib/routes.ts`:

| Doelgroep van het pad | Knop | Doel | Uitzondering |
|---|---|---|---|
| werkzoekende | `inschrijven` (`common.cta.register`) | `/inschrijven` | op `/inschrijven` zelf: `vacatures` (`common.cta.viewJobs`) naar `/vacatures` |
| werkgever | `personeelAanvragen` (`common.cta.requestStaff`) | `/werkgevers/personeel-aanvragen` | op dat pad zelf: `contact` (`common.cta.contact`) naar `/contact` |
| algemeen | `personeelAanvragen` (`common.cta.requestStaff`) | `/werkgevers/personeel-aanvragen` | geen |

Labels van de knoppen (`HeaderCtaKey`), ook voor de knoppen in het mobiele menu: inschrijven = `common.cta.register`, vacatures = `common.cta.viewJobs`, personeelAanvragen = `common.cta.requestStaff`, contact = `common.cta.contact`. De labels `header.nav.*` blijven voor de menulinks.

`usePathname()` uit `@/i18n/navigation` werkt ook tijdens server-rendering, dus de juiste knop staat al in de HTML.

**Ombouw van de bestaande `SiteHeader`**

| Nu (JV-basis) | Wordt |
|---|---|
| Eén clientcomponent met alles erin | Server shell met vier clienteilanden (§4.3) |
| Uitklapmenu "Diensten" uit `content/services` met titel en samenvatting | Twee uitklapmenu's met de beroepen uit `content/beroepen/index.ts`, alleen naam en icoon |
| Ankerlinks `/#werkwijze`, `/#projecten`, `/#over-ons`, `/#contact` uit `nav` | Echte routes uit de nieuwe `nav` in `lib/site.ts` |
| `fixed`, transparant tot scrollen met `useScroll`, `glass-panel` | `sticky`, wit met rand onder; secties hoeven niet meer te compenseren voor de headerhoogte |
| WhatsApp-icoon in de desktopheader | Weg op desktop; WhatsApp staat in de actiebalk, het mobiele menu, de footer en op contact |
| Vaste CTA "Offerte aanvragen" naar `/#contact` | `HeaderCta` per doelgroep |
| Mobiel menu via portal met framer-motion, zonder focusval | base-ui `Dialog` met `Accordion` en CSS-overgangen (§4.5) |
| Actiebalk "Bel ons" en "Offerte" in de header | Losse `SiteActionBar` met varianten (§4.6) |
| Labels uit `common.nav.*` en `services.*` | `header.nav.*`, `header.menu.*` en `beroepen.<id>.*` |
| Elke pagina rendert `<SiteHeader />` | De layout rendert hem één keer |

De base-ui-wrappers in `components/ui/navigation-menu.tsx` (spec 02) blijven de basis. `NavigationMenuLink` krijgt de next-intl `Link` via `render={<Link href={...} />}`, zoals nu.

### 4.5 Mobiel menu (onder `lg`)

`MobileMenu` (client) met props `{ items: ResolvedNavItem[]; ctas: ResolvedLink[]; phone: ResolvedAction; whatsapp: ResolvedAction; logo: ReactNode; labels: { open: string; close: string; title: string } }`.

- **Trigger**: knop van minimaal 44 bij 44 px met icoon `Menu`, `aria-label` `header.openMenu`, rechts in de header.
- **Venster**: base-ui `Dialog` (`@base-ui-components/react/dialog`, al aanwezig in 1.0.0-rc.0), modaal. Het venster vult het scherm (`fixed inset-0`, boven de actiebalk) met een eigen kopregel van 64 px: logo als link naar `/` en `Dialog.Close` met icoon `X` en `aria-label` `header.closeMenu`. `Dialog.Title` is visueel verborgen met de tekst `header.mobileMenu`.
- **Inhoud** (scrollt binnen het venster), regels van minimaal 48 px:
  1. Vacatures (link).
  2. Werkzoekenden als base-ui `Accordion.Item` (`@base-ui-components/react/accordion`): vijf beroepen, Inschrijven, Alles voor werkzoekenden.
  3. Werkgevers als `Accordion.Item`: vijf beroepen, Personeel aanvragen, Inlenen en de Wtta, Alles voor werkgevers.
  4. Over ons. 5. Contact.
- **Onderkant** (vast binnen het venster): inschrijven met `common.cta.register` (`CtaButton variant="secondary"`) en personeelAanvragen met `common.cta.requestStaff` (`CtaButton`), beide volle breedte, met dezelfde `ResolvedLink`'s als `HeaderCta` (§4.4); daaronder de belregel met het hoofdnummer, de WhatsApp-link en `LanguageToggle`.
- **Gedrag**: focusval, Escape sluit, focus keert terug naar de trigger, scrollvergrendeling; dat levert de modale `Dialog`. Een klik op een link sluit het venster (gecontroleerde `open`-state); een effect op `usePathname()` sluit het ook na elke navigatie. De groep van de huidige doelgroep staat bij openen al open (`defaultValue` uit `audienceFor(pathname)`).
- **Beweging**: vervagen en 8 px verschuiven via de `data-[starting-style]`- en `data-[ending-style]`-attributen van base-ui, 200 ms; `motion-reduce:transition-none`. Geen framer-motion in de header.

### 4.6 Actiebalk (onder `lg`)

`components/sections/site-action-bar.tsx` (server, `SiteActionBar()` zonder props) lost de acties op en rendert `ActionBar` (client) uit `components/sections/header/action-bar.tsx` met props `{ ariaLabel: string; actions: Record<ActionKey, ResolvedAction> }`. `ActionKey` is `"call" | "whatsappAlgemeen" | "whatsappWerkzoekende" | "whatsappWerkgever" | "personeelAanvragen" | "solliciteren"`.

| Variant (`actionBarVariantFor`) | Paden | Links | Rechts |
|---|---|---|---|
| `werkzoekende` | `/vacatures`, `/werkzoekenden`, `/werken-als/*`, `/inschrijven`, `/bedankt/sollicitatie`, `/bedankt/inschrijving` | Bellen (`tel:+31683351985`) | WhatsApp met `common.whatsapp.werkzoekende` |
| `vacature` | `/vacatures/<slug>` | Bellen | Solliciteren, anker `#solliciteren` op de vacaturepagina (spec 06) |
| `werkgever` | `/werkgevers`, `/werkgevers/*` behalve het aanvraagformulier, `/bedankt/aanvraag`, `/algemene-voorwaarden` | Bellen | Personeel aanvragen (`/werkgevers/personeel-aanvragen`) |
| `aanvraag` | `/werkgevers/personeel-aanvragen` | Bellen | WhatsApp met `common.whatsapp.werkgever` |
| `algemeen` | alle overige paden, ook 404 | Bellen | WhatsApp met `common.whatsapp.algemeen` |

- Labels per `ActionKey`: bellen (`call`) = `common.cta.call`; WhatsApp (`whatsappAlgemeen`, `whatsappWerkzoekende`, `whatsappWerkgever`) = `common.cta.whatsapp`, met de verborgen toevoeging `common.opensInNewTab` en de vooringevulde tekst uit `common.whatsapp.*`; personeelAanvragen = `common.cta.requestStaff`; solliciteren = `common.cta.apply`.
- Een `<nav>` met `aria-label` uit `header.actionBar`, `fixed inset-x-0 bottom-0 z-40 lg:hidden`, wit met rand boven, twee knoppen naast elkaar van 48 px hoog, onderruimte `max(0.75rem, env(safe-area-inset-bottom))`. De rechterknop is de primaire `CtaButton`, de linker de secundaire.
- WhatsApp-links openen in een nieuw venster (`target="_blank" rel="noopener noreferrer"`) met een verborgen toevoeging `common.opensInNewTab` voor schermlezers.
- Zodra een `input`, `textarea` of `select` focus krijgt (`focusin` op `document`), schuift de balk weg (`translate-y-full`) en krijgt hij `inert`; bij `focusout` komt hij terug. Zo staat de balk niet boven het toetsenbord of over de verzendknop.
- De layout zet na de footer een lege ruimte van dezelfde hoogte (`<div aria-hidden className="h-[calc(4.5rem+env(safe-area-inset-bottom))] lg:hidden" />`), zodat de laatste footerregel niet onder de balk valt.
- De viewport krijgt `viewportFit: "cover"`, anders werkt `env(safe-area-inset-bottom)` niet op iPhones.

### 4.7 Taalknop

`LanguageToggle` in `components/ui/language-toggle.tsx` (uiterlijk spec 02, gedrag deze spec). Props blijven `{ className?: string }`.

- Twee echte links "NL" en "EN" in een `role="group"` met `aria-label` `common.languageSwitcher.label`. Elke link is een next-intl `Link` met `href={pathname}` en `locale={code}`, plus `hrefLang={code}`, `lang={code}` en `aria-label` met de taalnaam in die taal (`common.languageSwitcher.nl` "Nederlands", `.en` "English"). De actieve taal krijgt `aria-current="true"`.
- `onClick`: zet de cookie `NEXT_LOCALE=<code>; path=/; max-age=31536000; samesite=lax`, voorkomt de standaardnavigatie en roept binnen `startTransition` `router.replace(pathname + window.location.search, { locale: code })` aan. Zo blijven filters op `/vacatures` behouden. Zonder JavaScript werkt de link gewoon.
- Lees de query niet met `useSearchParams`: dat dwingt statische pagina's tot clientrendering zonder Suspense-grens.
- Bij één taal (`routing.locales.length < 2`) rendert de knop niets.
- Plaatsen: header (lg en breder), onderkant van het mobiele menu, onderbalk van de footer.

### 4.8 Footer

`components/sections/site-footer.tsx` wordt een async server component zonder props, door de layout één keer gerenderd.

```
<footer>                                   contentinfo
  bovenste deel (grid; mobiel gestapeld, lg 12 kolommen)
    merkblok (lg 4 kolommen): logo-link, footer.description (twee zinnen), socials als die er zijn
    <nav aria-label="footer.navLabel"> (lg 5 kolommen, sm 3 kolommen)
       per footerColumns-item: <h2> footer.columns.<key> plus <ul> links
         Werkzoekenden: Vacatures, de vijf beroepen (enkelvoud), Inschrijven, Alles voor werkzoekenden
         Werkgevers: de vijf beroepen (meervoud), Personeel aanvragen, Inlenen en de Wtta, Alles voor werkgevers
         Groos: Over ons, Contact
    contactblok (lg 3 kolommen): <h2> footer.columns.contact plus <address>
       Groos Personeelsdiensten B.V. / Hugo Coenraadspad 6 / 2553 ER Den Haag
       common.address.byAppointment ("Langskomen kan alleen op afspraak." / "Visits are by appointment only.", B-23)
       telefoon (hoofdnummer), WhatsApp, e-mail
       openingstijden (common.contact.officeHoursValue), alleen als contact.openingHours gevuld is (B-22)
  onderbalk: `© {year} Groos Personeelsdiensten B.V.` | `<FooterLegal />` (spec 09: registratieregel met KvK en btw, Wtta-regel en juridische links uit `publishedLegalDocs()`) | `LanguageToggle`
```

- KvK en btw staan niet in het contactblok; die toont `FooterLegal` in de registratieregel. `SiteFooter` heeft geen eigen `<nav aria-label="footer.legalNav">` meer: de juridische links komen uit `publishedLegalDocs()` in `FooterLegal`, zodat algemene voorwaarden pas verschijnen als `getLegalDoc("terms").published` waar is (B-11, B-40).
- `FooterLegal` is een server component zonder props in `components/legal/footer-legal.tsx` (eigendom spec 09). In bouwstap 3 maakt deze spec de stub `export function FooterLegal(): React.JSX.Element | null { return null; }`, zodat de footer compileert; spec 09 blok A vult hem in dezelfde bouwstap.
- Personen (Jimmy en Lorenzo) staan niet in de footer, wel op contact, over ons en bij elke vacature (B-21).
- Kolomkoppen zijn `h2` met een kleine stijl van spec 02; in de footer staan geen andere koppen.

### 4.9 Kruimelpad

`Breadcrumbs` in `components/sections/breadcrumbs.tsx`, async server component.

```ts
type Crumb = { label: string; href: AppPath };
type BreadcrumbsProps = {
  /** Het spoor na Home; het laatste item is de huidige pagina. */
  items: Crumb[];
  className?: string;
  /** Standaard true: rendert ook BreadcrumbList via breadcrumbLd() uit lib/seo.ts. */
  jsonLd?: boolean;
};
```

- Het component zet zelf "Home" (`common.breadcrumbs.home`, `/`) vooraan.
- HTML: `Breadcrumbs` rendert `Breadcrumb` (label `common.breadcrumbs.label`), `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbSeparator` en `BreadcrumbPage` uit `components/ui/breadcrumb.tsx` (spec 02) in plaats van eigen `<nav><ol>`-markup. Het laatste item is `BreadcrumbPage` (tekst met `aria-current="page"`), de rest zijn `BreadcrumbLink`'s met de `Link` uit `@/i18n/navigation`. Op smalle schermen loopt het spoor door op een tweede regel; het laatste item wordt na één regel afgekapt met `line-clamp-1` en `title`.
- JSON-LD: `<JsonLd data={breadcrumbLd(items.map(...))} />` met paden via `localizedPath(locale, href)`. Pagina's roepen `breadcrumbLd` niet zelf aan, zodat zichtbaar spoor en structured data altijd gelijk zijn.
- `ServiceHero` (spec 05) houdt zijn prop `breadcrumb` maar rendert die met `<Breadcrumbs items={...} />` in plaats van het eigen `<nav>`. Deze spec past dat in bouwstap 3 aan; spec 05 laat het zo.

| Pagina | Spoor na Home |
|---|---|
| `/vacatures` | Vacatures |
| `/vacatures/[slug]` | Vacatures, {functietitel} |
| `/inschrijven` | Werkzoekenden, Inschrijven |
| `/werkzoekenden` | Werkzoekenden |
| `/werken-als/[beroep]` | Werkzoekenden, {beroep enkelvoud} |
| `/werkgevers` | Werkgevers |
| `/werkgevers/[beroep]` | Werkgevers, {beroep meervoud} |
| `/werkgevers/personeel-aanvragen` | Werkgevers, Personeel aanvragen |
| `/werkgevers/wtta` | Werkgevers, Inlenen en de Wtta |
| `/over-ons`, `/contact` | Over ons of Contact |
| juridische pagina's | {titel van de pagina} |
| `/`, `/bedankt/*`, 404 | geen kruimelpad |

Labels komen uit `header.nav.*` of uit de titel die de paginaspec al heeft.

### 4.10 Verwijderlijst

Alles uit de JV-basis wat Groos niet nodig heeft. Kolom "Wanneer": stap 3 is de bouwstap van deze spec; stap 4 is die van spec 04 en 05. De regel is: verwijder in stap 3 alles waarvan alle gebruikers in stap 3 verdwijnen, zodat `npm run verify` groen blijft.

| Pad of onderdeel | Actie | Wanneer | Reden |
|---|---|---|---|
| `app/[locale]/diensten/[slug]/page.tsx` (map `diensten`) | verwijderen | 3 | vervangen door beroepspagina's (B-30) |
| `app/[locale]/werkgebied/page.tsx` en `werkgebied/[stad]/page.tsx` | verwijderen | 3 | werkgebied vervalt in fase 1 (B-30); fase 2 `/regio/[plaats]` |
| `app/[locale]/privacybeleid/page.tsx` | hernoemen naar `app/[locale]/privacyverklaring/page.tsx` (`git mv`); spec 09 herschrijft de tekst | 3 | route heet `/privacyverklaring` (00 §4.1); geen redirect nodig, want Groos heeft nog geen live site |
| `content/services/` (alle 8 bestanden) | verwijderen | 3 | vervangen door `content/beroepen` (B-30) |
| `content/werkgebied/` (alle 4 bestanden) | verwijderen | 3 | B-30 |
| `components/werkgebied/city-page.tsx` | verwijderen | 3 | B-30 |
| `components/sections/services.tsx` | verwijderen en uit `app/[locale]/page.tsx` halen | 3 | leest `content/services`; de beroepensectie van de homepage komt uit spec 04 |
| `components/sections/offerte-form.tsx` (`OfferteForm`) | verwijderen en uit `app/[locale]/page.tsx` halen | 3 | Web3Forms vervalt (B-13); formulieren komen uit `components/forms` (spec 07) |
| `components/sections/site-header.tsx`, `site-footer.tsx` | herschrijven | 3 | §4.4 tot en met §4.8 |
| `<SiteHeader />`, `<SiteFooter />` en `<main>` in `app/[locale]/page.tsx` en in `components/legal/legal-page.tsx` (`LegalPage`, gebruikt door de juridische pagina's) | verwijderen; `LegalPage` geeft daarna een `<article>` met de bestaande inhoud terug | 3 | de layout rendert ze één keer |
| `components/ui/button.tsx` (`Button`, `buttonVariants`) | verwijderen | 3 | nergens gebruikt |
| `@radix-ui/react-slot` | `npm uninstall @radix-ui/react-slot` | 3 | alleen gebruikt door `Button` |
| `components/ui/menu-toggle-icon.tsx`, `components/ui/use-scroll.tsx` | verwijderen als na stap 3 niets ze meer importeert | 3 | de nieuwe header gebruikt ze niet |
| `components/sections/{clients,metrics,service-ticker,projects,proof,assurance,segment-accordion}.tsx` | verwijderen volgens spec 04 | 4 | 00 §1a, B-26, B-29 |
| `components/ui/marquee.tsx`, `components/motion/count-up.tsx` | verwijderen samen met `Clients` en `Metrics` (spec 04, spec 02) | 4 | B-29, B-26 |
| `components/sections/{hero,process,trust-bar,about,faq,section-heading}.tsx` | spec 04 beslist (herschrijven of hergebruiken) | 4 | homepage |
| Exports `metrics`, `usps`, `segments`, `steps`, `assurances`, `certification`, `clients`, `projectPhotos` in `lib/site.ts` | tijdelijk laten staan onder het kopje "Homepage-data uit de JV-basis"; spec 04 verwijdert of vervangt ze | 4 | de secties die ze lezen bestaan tot stap 4 |
| Export `nav` met ankers in `lib/site.ts` | vervangen door de nieuwe `nav` (§5.1) | 3 | echte routes |
| `public/clients/`, `public/projects/`, `public/segments/`, `public/certifications/` | verwijderen (alleen `.gitkeep`) | 3 | B-25, B-26 |
| `.DS_Store` en `content/.DS_Store` | verwijderen | 3 | staan al in `.gitignore` |
| messages `services.*`, `werkgebied.*`, `common.nav.*`, `footer.allAreas`, `footer.columns.services`, `footer.columns.workArea`, `footer.responsePromise`, `footer.privacy`, `footer.terms`, `header.quickContact`, `header.whatsappAria` | verwijderen in nl en en | 3 | vervangers in §6; alleen zodra niets ze meer leest |
| messages `service.*`, `home.contactForm.*`, `common.cta.requestQuote`, `common.cta.quote`, `common.cta.callUs` | verwijderen zodra hun laatste gebruiker weg is (`ServiceHero`, `ServiceCta`, `Hero`) | 3 of 4 | spec 03 legt de vervangers vast; `common.cta.callDirect` vervalt en wordt vervangen door `common.cta.call` ("Bel ons" / "Call us", B-54, spec 03 §6.16); `grep -rn "callDirect" messages app components` geeft daarna niets. |
| `app/sitemap.ts`, `app/llms.txt/route.ts` | imports van `services` en `cities` vervangen door `STATIC_ROUTES` en `beroepen` (minimale versie, §10 stap 16) | 3 | spec 12 maakt ze af in stap 5 |
| `scripts/check-launch.mjs` §2 en §4 | registratiecontrole van `content/services` vervangen door die van `content/beroepen`; de notitie over `.env.local` noemt Web3Forms niet meer | 3 | spec 14 breidt het script verder uit |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in `.env.example` | spec 13 | 1 | B-13 |
| `tailwind.config.ts`, signature-klassen (`.glass-panel`, `.spotlight`, `.bg-grid`, `.hairline`, `.logo-mono`), `.dark`-tokens | spec 02 | 2 | B-34, B-29, B-01 |
| `app/icon.tsx`, `app/apple-icon.tsx`, `lib/brand.ts` | spec 02 | 2 | logo |
| CTA `/#contact` in `components/legal/legal-page.tsx` | spec 09 maakt er `/contact` van | 8 | anker bestaat niet meer |
| CTA `#offerte` in `ServiceHero` en `ServiceCta` | spec 05 | 4 | formulier per beroepspagina |
| Tabel "Waar dingen staan" in `CLAUDE.md` en de structuur in `README.md` | bijwerken naar `content/beroepen`, `content/pages`, `lib/routes.ts`, `components/forms`, `app/beheer`, `supabase/`; Web3Forms uit README | 3 | documentatie klopt met de code |

### 4.11 Tweetaligheid (B-03)

#### 4.11.1 `i18n/routing.ts`

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["nl", "en"],
  defaultLocale: "nl",
  localePrefix: "as-needed",
  // De taal bepaalt proxy.ts zelf (cookie en IP-land), niet de browsertaal.
  localeDetection: false,
  // NEXT_LOCALE beheren proxy.ts en LanguageToggle; next-intl raakt de cookie niet aan.
  localeCookie: false,
  // hreflang alleen via pageMetadata(); de Link-header van next-intl zou
  // ook een EN-alternatief melden voor vacatures die alleen in het Nederlands bestaan.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];

/** Landen waar een eerste bezoek de standaardtaal krijgt (zie proxy.ts). */
export const DEFAULT_LOCALE_COUNTRIES: readonly string[] = ["NL", "BE"];
```

`i18n/navigation.ts` blijft ongewijzigd: `{ Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)`. Interne links gaan altijd via deze `Link`, nooit via `next/link`.

#### 4.11.2 `i18n/request.ts`, `i18n/formats.ts` en `i18n/locale.ts`

```ts
// i18n/request.ts
// Messages staan per taal en per namespace in messages/<locale>/<namespace>.json;
// messages/<locale>/index.ts voegt ze samen (B-45). Alleen de gevraagde taal wordt geladen.
const loaders = {
  nl: () => import("../messages/nl"),
  en: () => import("../messages/en"),
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  return {
    locale,
    messages: (await loaders[locale]()).default,
    timeZone: "Europe/Amsterdam",
    formats,
  };
});

// i18n/formats.ts
import type { Formats } from "next-intl";
export const formats = {
  dateTime: {
    datum: { day: "numeric", month: "long", year: "numeric" },
    kort: { day: "numeric", month: "short" },
  },
  number: { euro: { style: "currency", currency: "EUR", minimumFractionDigits: 2 } },
} satisfies Formats;

// i18n/locale.ts
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "./routing";
/** Zet de string uit params om naar Locale; onbekend geeft een 404. */
export function resolveLocale(value: string): Locale {
  if (!hasLocale(routing.locales, value)) notFound();
  return value;
}
```

De vaste tijdzone voorkomt verschillen tussen server en browser bij datums van vacatures. Spec 06 gebruikt `format.dateTime(date, "datum")` en `format.number(bedrag, "euro")`.

#### 4.11.3 Getypeerde messages (`global.d.ts`)

```ts
import type { routing } from "@/i18n/routing";
import type { formats } from "@/i18n/formats";
import type messages from "./messages/nl";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
    Formats: typeof formats;
  }
}
```

Daarmee geeft `tsc` een fout bij een sleutel die niet in `messages/nl/<namespace>.json` staat, bijvoorbeeld `messages/nl/header.json` voor `header.*`. Een bouw-agent zet dus eerst de sleutel in `messages/nl/<namespace>.json` en `messages/en/<namespace>.json` en gebruikt hem daarna. `messages/<locale>/index.ts` is de plek waar de namespaces van een taal worden samengevoegd, met een statische import per namespacebestand (B-45, eigenaar 01); een nieuwe namespace komt in beide `index.ts`-bestanden. `npm run check` bewaakt de spiegeling van nl en en.

#### 4.11.4 Messages naar de client

De layout geeft niet alle messages door, alleen de namespaces die clientcomponenten lezen:

```ts
// i18n/client-messages.ts
import type { Messages } from "next-intl";
export const CLIENT_NAMESPACES = ["common", "error", "forms", "vacatures"] as const;
export function pickClientMessages(messages: Messages): Partial<Messages> {
  return Object.fromEntries(
    CLIENT_NAMESPACES.filter((ns) => ns in messages).map((ns) => [ns, messages[ns as keyof Messages]]),
  ) as Partial<Messages>;
}
```

Een spec die in een clientcomponent `useTranslations` met een andere namespace gebruikt, voegt die namespace hier toe en noemt dat in zijn bouwopdracht. De voorkeur blijft: tekst als props vanuit een server component.

#### 4.11.5 Pagina's en layouts

- Elke layout en pagina onder `[locale]` roept `setRequestLocale(locale)` aan vóór de eerste next-intl-aanroep; anders valt statische rendering terug op dynamisch.
- `generateMetadata` gebruikt `getTranslations({ locale, namespace })` met de locale uit `params`.
- `generateStaticParams` voor de taal staat alleen in `app/[locale]/layout.tsx`. Kindroutes geven alleen hun eigen parameter terug.
- Patroon voor een pagina met parameter:

```tsx
// app/[locale]/werken-als/[beroep]/page.tsx (skelet van stap 3; spec 05 vult de inhoud)
export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams() {
  return beroepen.map((b) => ({ beroep: b.slugWerkzoekende }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/werken-als/[beroep]">): Promise<Metadata> {
  const { locale: raw, beroep } = await params;
  const locale = resolveLocale(raw);
  const item = findBeroepBySlug("werkzoekende", beroep);
  if (!item) return {};
  const t = await getTranslations({ locale, namespace: "beroepen" });
  return pageMetadata({ locale, path: paths.werkenAls(item.id), title: t(`${item.id}.enkelvoud`), description: "TODO beschrijving (spec 05)" });
}

export default async function Page({ params }: PageProps<"/[locale]/werken-als/[beroep]">) {
  const { locale: raw, beroep } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const item = findBeroepBySlug("werkzoekende", beroep);
  if (!item) notFound();
  // ...
}
```

- Server Actions die na verzenden doorsturen, gebruiken `redirect({ href: paths.bedankt("aanvraag"), locale })` uit `@/i18n/navigation`, zodat `/en` behouden blijft.

#### 4.11.6 Vacatures op `/en` (B-03)

| Pad | Gedrag |
|---|---|
| `/en/vacatures` | Interface in het Engels; titels en samenvattingen van vacatures in het Nederlands met `lang="nl"` op het element. Volwaardige taalvariant: canonical naar zichzelf en hreflang nl, en en x-default. |
| `/en/vacatures/[slug]` | Dezelfde vacature als op NL. Bovenaan een melding met `role="note"` (sleutel `vacatures.detail.onlyDutch`, tekst in spec 06: "This job is only available in Dutch. If you have a question, call or message us and we will help you in English."). De vacatureinhoud staat in een element met `lang="nl"`; formulier, knoppen en labels zijn Engels. Metadata: canonical naar `https://www.groospersoneelsdiensten.nl/vacatures/<slug>`, geen `alternates.languages`, geen JobPosting, geen opname in de sitemap. |
| `/vacatures/[slug]` (NL) | Canonical naar zichzelf, geen hreflang-alternatieven (er bestaat geen echte vertaling), wel JobPosting (spec 12). |

De taalknop blijft op vacaturepagina's zichtbaar, omdat de interface wel vertaald is. Komt er in fase 2 Engelse vacaturetekst (`vacancy_translations` met `en`), dan krijgt `/en/vacatures/[slug]` een eigen canonical, hreflang en JobPosting (spec 15).

#### 4.11.7 Een taal toevoegen (fase 2)

Locale toevoegen aan `routing.locales`, de map `messages/<code>/` gespiegeld aanmaken met per namespace een bestand `messages/<code>/<namespace>.json` en een `messages/<code>/index.ts` die ze samenvoegt, de taal toevoegen aan `loaders` in `i18n/request.ts`, `common.languageSwitcher.<code>` toevoegen, `DEFAULT_LOCALE_COUNTRIES` herzien, fontsubsets controleren (Onest heeft Cyrillisch, spec 02) en de taalknop omzetten naar een keuzelijst zodra er meer dan twee talen zijn.

### 4.12 `proxy.ts`

Het gedrag blijft zoals gebouwd (B-03): (1) cookie `NEXT_LOCALE=en` op een NL-pad stuurt door naar `/en...`; (2) een eerste bezoek zonder cookie op een NL-pad, buiten NL en BE volgens `x-vercel-ip-country` en zonder bot-user-agent, stuurt door naar `/en...` en zet de cookie een jaar; (3) anders next-intl. Wijzigingen:

```ts
// Crawlers, link-previews en testtools krijgen nooit een geo-omleiding.
// "google" vangt ook Google-InspectionTool (Rich Results Test) en Google-Extended.
const BOT_UA =
  /bot|crawl|spider|slurp|google|bing|duckduck|yandex|baidu|applebot|facebookexternalhit|whatsapp|linkedin|telegram|slack|discord|embedly|preview|lighthouse|inspectiontool|headless|vercel/i;

export const config = {
  matcher: [
    // Eerste matcher: taalrouting voor alle publieke paden. Overgeslagen voorvoegsels:
    //   api                                   route handlers (upload, webhooks, cron, dev)
    //   beheer                                gaat alleen via de tweede matcher (B-38)
    //   feeds                                 feedroutes van fase 2 (spec 15)
    //   monitoring                            tunnelroute voor foutmonitoring (spec 13 of 14)
    //   _next, _vercel                        interne paden van Next en Vercel
    //   149e9513-01fa-4fb0-aad4-566afd725d1b  BotID-pad (spec 13 §4.4)
    //   opengraph-image, twitter-image        metadata-routes op het hoogste niveau (spec 12)
    //   icon, apple-icon                      iconen (spec 02)
    //   .*\\..*                               alles met een punt (bestanden, sitemap.xml,
    //                                         robots.txt, llms.txt, .well-known)
    "/((?!api|beheer|feeds|monitoring|_next|_vercel|149e9513-01fa-4fb0-aad4-566afd725d1b|opengraph-image|twitter-image|icon|apple-icon|.*\\..*).*)",
    // Tweede matcher: beheeromgeving, alleen sessieverversing via beheerProxy() (B-38).
    "/beheer/:path*",
  ],
};

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Beheer: geen next-intl, geen geo-redirect, geen NEXT_LOCALE (B-38).
  if (pathname === "/beheer" || pathname.startsWith("/beheer/")) return beheerProxy(request);
  // ... daarna het bestaande gedrag (1) tot en met (3) hierboven; elke respons van next-intl gaat door withNotFound(request, response) (B-55).
}
```

- `beheerProxy` komt uit `app/beheer/_lib/proxy.ts` en doet geen taalrouting: geen next-intl, geen geo-redirect en geen `NEXT_LOCALE`-cookie (B-38). In bouwstap 3 maakt deze spec daar de stub `export async function beheerProxy(request: NextRequest) { return (await updateSession(request)).response; }` met `updateSession` uit `lib/supabase/proxy.ts` (spec 10); spec 08 vervangt de inhoud in bouwstap 7.
- `/en/beheer` gaat door de eerste matcher, valt in `app/[locale]/[...rest]` en geeft een 404.
- `monitoring` is gereserveerd voor een eventuele tunnelroute van foutmonitoring (spec 13 of 14).
- Geneste metadata-routes onder `[locale]` (bijvoorbeeld een OG-afbeelding per vacature van spec 12 op `/vacatures/<slug>/opengraph-image`) gaan wel door de proxy, omdat ze de taalprefix nodig hebben.
- Test lokaal met `curl -H "x-vercel-ip-country: DE"`; zonder die header (localhost) gebeurt nooit een geo-omleiding.
- `withNotFound(request, response)` in `proxy.ts`: is de respons geen 3xx en geeft `isKnownPath(pathname)` uit `lib/routes.ts` onwaar, dan herschrijft de proxy met status 404 naar `/<locale>/pagina-niet-gevonden` (`NOT_FOUND_PATH`, `<locale>` is `en` voor paden onder `/en`, anders `nl`), zet de verzoekkopregel `x-groos-not-found: 1` (`NOT_FOUND_HEADER`) en neemt de `set-cookie`-regels van next-intl over. `isKnownPath` loopt gelijk met de mappen onder `app/[locale]`: elke nieuwe publieke route voegt zichzelf daar toe. Voor `/vacatures/<slug>` geeft hij alleen waar als `parseVacancySlug(slug)` (uit `lib/data/vacancy-search-params.ts`) een nummer geeft. De proxy doet geen databasequery (B-55).

Nazorg 3b: de eerste matcher in de gebouwde `proxy.ts` mist het BotID-voorvoegsel `149e9513-01fa-4fb0-aad4-566afd725d1b`; zet de matcher letterlijk zoals in het codevoorbeeld hierboven (K11).

### 4.13 Foutafhandeling

| Bestand | Type | Vangt | Inhoud |
|---|---|---|---|
| `app/[locale]/[...rest]/page.tsx` | server | onbekende paden die de proxy met status 404 herschrijft (`/onbekend`, `/en/x/y`, `/vacatures/onzin`) | Leest `headers()`; is `x-groos-not-found` gelijk aan `1`, dan rendert hij `NotFoundView` (zelfde inhoud als `not-found.tsx`) op de server; anders `notFound()`. `generateMetadata` geeft `title: { absolute: t("metaTitle") }` uit `notFound`; Next zet bij status 404 zelf `noindex`. |
| `app/[locale]/not-found.tsx` | server | `notFound()` in pagina's, het vangnet hierboven en `dynamicParams = false` | binnen de layout, dus met header en footer; `<title>{t("metaTitle")}</title>`; `<section>` met h1 `notFound.title`, alinea `notFound.body`, een lijst met drie links (`/vacatures`, `/werkgevers/personeel-aanvragen`, `/contact`) met `aria-label` `notFound.linksLabel` en een link naar `/`. Status 404 en automatisch `noindex`. Bij `notFound()` na een `await` (vacatures die van de database afhangen, `outOfRange` op `/vacatures`) staan status 404 en `noindex` in de respons, maar rendert Next 16.3 deze inhoud pas in de browser (B-55). |
| `app/[locale]/error.tsx` | client | runtimefouten in pagina's en secties | props `{ error: Error & { digest?: string }; retry: () => void }`; `useTranslations("error")`; h1 `error.title`, alinea `error.body` met `{phone}` uit `contact.phone`, knop `error.retry` die `retry()` aanroept, link `error.home`, en klein `error.code` met `error.digest` als die er is. `console.error(error)` in een effect. `<title>{t("metaTitle")}</title>`. |
| `app/global-error.tsx` | client | fouten in de root-layout zelf | eigen `<html lang>` en `<body>`, importeert `./globals.css` en de fonts van spec 02; tekst inline als `CONTENT = { nl, en }` (geen next-intl-provider beschikbaar), taal uit `usePathname()` van `next/navigation` (`/en` of niet); knop roept `retry()` aan. |
| `app/global-not-found.tsx` | server | URL's buiten `app/[locale]` zonder route (bijvoorbeeld `/beheer/bestaat-niet` als spec 08 geen eigen vangnet heeft, of `/bestand.xyz`) | eigen `<html lang="nl">` en `<body>`, importeert `./globals.css` en fonts; inline Nederlandse tekst met één Engelse zin met `lang="en"`; links naar `/` en `/en`; `export const metadata = { title: "Pagina niet gevonden", robots: { index: false } }`. Vereist `experimental.globalNotFound: true` in `next.config.mjs` (spec 13 §4.2 zet die vlag). |

- Een 404 die zonder database vast te stellen is, loopt via de proxy (`isKnownPath`) en heeft de volledige inhoud in de server-HTML. Een 404 die van de database afhangt, is `notFound()` in de pagina, vóór elke `<Suspense>`, zodat de status 404 is; de inhoud verschijnt dan in de browser (B-55).
- Spec 08 maakt eigen `not-found.tsx` en `error.tsx` onder `app/beheer`.
- Als `experimental.globalNotFound` in Next 16.3.8 een build- of typefout geeft, vervallen het bestand en de vlag; de standaard-404 van Next is dan het vangnet buiten de proxy. De bouw-agent noteert dat in spec 00.
- De inline teksten van `global-error.tsx` en `global-not-found.tsx` vallen buiten de spiegelcontrole van `npm run check`, net als de juridische `CONTENT`-blokken.

### 4.14 Laadstaten

- Geen `loading.tsx` onder `app/[locale]`. Een `loading.tsx` laat een segment streamen, waardoor `notFound()` daarna een 200 geeft; statische pagina's hebben het niet nodig.
- Trage delen (de resultatenlijst op `/vacatures`, live vacatures op een beroepspagina) staan binnen de pagina in `<Suspense fallback={...}>`, onder de h1 en na alle `notFound()`-controles. Het skelet heeft dezelfde afmetingen als de inhoud (geen CLS) en een schermlezertekst `common.loading` in een `aria-live="polite"`-element.
- Formulieren tonen hun verzendstatus met de `isPending`-waarde van `useActionState` of met `useFormStatus` (spec 07).
- `/beheer` mag wel `loading.tsx` gebruiken (spec 08), omdat daar geen SEO-status telt.

### 4.15 Caching en revalidatie (B-35)

- Geen `cacheComponents` en geen `use cache` in fase 1.
- Leesfuncties in `lib/data/*` (spec 10) gebruiken `unstable_cache` met tags `vacatures` en `vacature:<nummer>` en `revalidate: 3600`. Pagina's exporteren de `revalidate` uit §4.1 als letterlijke waarde (`export const revalidate = 3600`, niet `60 * 60`).
- Vacaturemutaties (beheer en cron) lopen via `revalidateVacancies(numbers, kind)` uit `lib/data/revalidate.ts` (spec 10 §4.4, B-35). `lib/revalidate.ts` blijft alleen voor paden die geen vacature zijn.
- Pad-revalidatie gaat altijd via `revalidateLocalizedPath()`, omdat next-intl NL intern onder `/nl` serveert en `revalidatePath` het bestemmingspad nodig heeft (`04-functions/revalidatePath.md`, "Using revalidatePath with rewrites"):

```ts
// lib/revalidate.ts
import "server-only";
import { revalidatePath } from "next/cache";
import { routing } from "@/i18n/routing";
import type { AppPath } from "@/lib/routes";

/** Ververst een publiek pad in alle talen, bijvoorbeeld "/vacatures" of "/vacatures/glazenwasser-den-haag-1042". */
export function revalidateLocalizedPath(path: AppPath): void {
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}${path === "/" ? "" : path}`);
  }
}

/** Ververst alle pagina's van een routepatroon, bijvoorbeeld "/vacatures/[slug]". */
export function revalidateRoutePattern(pattern: `/${string}`): void {
  revalidatePath(`/[locale]${pattern}`, "page");
}
```

### 4.16 Formulieren en mutaties (B-36)

Conventies voor spec 07 en 08; de velden en schema's zijn van spec 07.

- Eén zod 4-schema per formulier in `lib/validation/<formulier>.ts`, gedeeld door client en server.
- Eén bestand per formulier in `app/actions/<formulier>.ts` met `"use server"` bovenaan. Signatuur `(prev: FormState, formData: FormData) => Promise<FormState>`; elke actie valideert opnieuw op de server, controleert BotID en honeypot en geeft alleen terug wat de UI toont.
- Het formuliercomponent in `components/forms/*` is client, gebruikt `useActionState(action, initialState)` en `<form action={formAction}>`. Zonder JavaScript werkt het formulier ook (progressive enhancement); alleen de cv-upload vraagt JavaScript.
- Na succes stuurt de actie door met `redirect({ href: paths.bedankt(soort), locale })` uit `@/i18n/navigation`.
- Bestanden gaan nooit door een Server Action (limiet 1 MB), maar via de signed upload URL van spec 07.
- Beheeracties staan onder `app/beheer/` volgens spec 08.

### 4.17 Afbeeldingen

- Alle beelden via `next/image` (`<Image>`); geen `<img>` en geen `eslint-disable` voor `@next/next/no-img-element`.
- Lokale beelden als statische import (afmetingen en blur automatisch); responsieve beelden met `sizes`; het LCP-beeld met `preload` (B-25: er zijn nog geen foto's, dus vaak geen beeld boven de vouw).
- Beelden uit de Supabase-bucket `public-media` via `images.remotePatterns` op de host uit `NEXT_PUBLIC_SUPABASE_URL` en pad `/storage/v1/object/public/public-media/**` (instelling in `next.config.mjs`, spec 13).
- Logo en iconen zijn inline SVG-componenten (spec 02); OG-afbeeldingen via `ImageResponse` (spec 12).

### 4.18 Tailwind 4 (B-34)

Spec 02 voert de upgrade uit in stap 2. Voor de componenten van deze spec geldt: alleen semantische tokenklassen (`bg-background`, `text-foreground`, `bg-primary`, `text-primary-foreground`, `text-muted-foreground`, `border-border`, `ring-ring`, `bg-muted` en de merktokens van spec 02), nooit hex, hsl of oklch in componenten, `cn()` uit `@/lib/utils` met tailwind-merge 3, geen `theme()` in willekeurige waarden (wel `calc(var(--spacing)*n)` of vaste rem-waarden), `size-*` voor vierkante iconen, `min-h-dvh` voor de body en `motion-reduce:` voor beweging.

### 4.19 Packages (B-37)

Deze spec voegt geen dependencies toe. Gebruikt: `next-intl`, `@base-ui-components/react` 1.0.0-rc.0 (NavigationMenu, Dialog, Accordion), `lucide-react` 0.456, `@vercel/analytics`. Verwijderd: `@radix-ui/react-slot`. framer-motion verdwijnt na bouwstap 4 (spec 02 §4.10); header en actiebalk importeren het nooit. Scriptwijziging in `package.json`: `"typecheck": "next typegen && tsc --noEmit"`.

### 4.20 Skeletpagina's (bouwstap 3)

Zodat in stap 3 alle routes een 200 geven, maakt deze spec voor elke route zonder pagina een skelet. De eigenaar vervangt de inhoud in zijn eigen stap en laat routing, `generateStaticParams`, `dynamicParams`, `revalidate` en `setRequestLocale` staan.

`PagePlaceholder` in `components/sections/page-placeholder.tsx` (server), props `{ title: string; breadcrumbs?: Crumb[]; spec: string }`: rendert `Breadcrumbs`, een h1 met `title` en de alinea "TODO inhoud volgt uit spec {spec}." Het component verdwijnt zodra geen pagina het meer importeert (spec 14 controleert dat vóór livegang).

| Skelet | Titel (h1) | Bijzonderheden |
|---|---|---|
| `vacatures/page.tsx` | `header.nav.vacatures` | geen data |
| `vacatures/[slug]/page.tsx` | geen | `generateStaticParams` geeft `[]`, `dynamicParams = true`, de pagina roept `notFound()` aan tot spec 06 bouwt |
| `inschrijven`, `werkzoekenden`, `werkgevers`, `werkgevers/personeel-aanvragen`, `werkgevers/wtta`, `over-ons`, `contact` | label uit `header.nav.*` | kruimelpad volgens §4.9 |
| `werken-als/[beroep]`, `werkgevers/[beroep]` | `beroepen.<id>.enkelvoud` of `.meervoud` | volledige routeconfiguratie uit §4.11.5 |
| `cookieverklaring`, `klachtenregeling` | `legal.nav.cookies` (cookieverklaring) of `legal.nav.complaints` (klachtenregeling) | spec 09 vult `CONTENT` |
| `bedankt/[soort]` | `TODO titel (spec 07)` | `robots: { index: false, follow: true }` samengevoegd met `pageMetadata()` |

`algemene-voorwaarden/page.tsx` bestaat al; deze spec voegt alleen `robots: { index: false, follow: true }` toe zolang `getLegalDoc("terms").published` onwaar is.

### 4.21 Kaders voor `app/beheer` (spec 08 bouwt)

- `app/beheer/layout.tsx` is een eigen root-layout met `<html lang="nl">` en `<body>`, importeert `../globals.css` en de fonts van spec 02, zet `metadata.robots = { index: false, follow: false }` en rendert geen `SiteHeader`, `SiteFooter`, `SiteActionBar`, `NextIntlClientProvider` of `Analytics`.
- Teksten uit `app/beheer/_strings.ts` (00 §4.4); geen messages.
- `/beheer` valt buiten de taalrouting en de geo-redirect; `proxy.ts` roept voor `/beheer` alleen `beheerProxy()` aan (B-38).

### 4.22 `app/[locale]/layout.tsx`

```tsx
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: brand.colors.background,
};

// generateMetadata: metadataBase, title.default en title.template uit meta,
// description, applicationName, robots index/follow zoals nu, plus
// formatDetection: { telephone: false, email: false, address: false }.

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const [t, messages] = await Promise.all([
    getTranslations({ locale, namespace: "header" }),
    getMessages(),
  ]);

  return (
    <html lang={locale} className={cn(fontSans.variable, fontDisplay.variable)} data-scroll-behavior="smooth">
      <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased">
        <a href="#inhoud" className="sr-only focus:not-sr-only ...">{t("skipLink")}</a>
        {/* site-brede JSON-LD van spec 12 (nu organizationLd en websiteLd) */}
        <NextIntlClientProvider messages={pickClientMessages(messages)}>
          <SiteHeader />
          <main id="inhoud" tabIndex={-1} className="flex-1 focus:outline-hidden">{children}</main>
          <SiteFooter />
          <div aria-hidden className="h-[calc(4.5rem+env(safe-area-inset-bottom))] lg:hidden" />
          <SiteActionBar />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
```

De spacer `h-[calc(4.5rem+env(safe-area-inset-bottom))] lg:hidden` blijft het enige mechanisme voor ruimte onder de actiebalk; pagina's en de footer voegen daarvoor geen eigen ruimte toe.

`fontSans` en `fontDisplay` komen uit `lib/fonts.ts` (spec 02). Pagina's renderen geen `<main>`, `<header>` of `<footer>` op topniveau; ze geven een fragment van secties terug.

### 4.23 Overzicht van componenten van deze spec

| Naam | Bestand | S/C | Props |
|---|---|---|---|
| `SiteHeader` | `components/sections/site-header.tsx` | S | geen |
| `DesktopNav` | `components/sections/header/desktop-nav.tsx` | C | `{ items: ResolvedNavItem[]; ariaLabel: string }` |
| `HeaderCta` | `components/sections/header/header-cta.tsx` | C | `{ ctas: Record<HeaderCtaKey, ResolvedLink> }` |
| `MobileMenu` | `components/sections/header/mobile-menu.tsx` | C | zie §4.5 |
| `SiteActionBar` | `components/sections/site-action-bar.tsx` | S | geen |
| `ActionBar` | `components/sections/header/action-bar.tsx` | C | `{ ariaLabel: string; actions: Record<ActionKey, ResolvedAction> }` |
| `SiteFooter` | `components/sections/site-footer.tsx` | S | geen |
| `Breadcrumbs` | `components/sections/breadcrumbs.tsx` | S | `BreadcrumbsProps` (§4.9) |
| `PagePlaceholder` | `components/sections/page-placeholder.tsx` | S | `{ title: string; breadcrumbs?: Crumb[]; spec: string }` |
| `FooterLegal` (stub) | `components/legal/footer-legal.tsx` | S | geen; spec 09 vult |
| `LanguageToggle` (gedrag) | `components/ui/language-toggle.tsx` | C | `{ className?: string }` |

## 5 Data

Deze spec bezit geen tabellen. Hij levert drie registers zonder tekst en een navigatiemodel. Tekst staat in messages (§6). Functies zonder body in de codeblokken hieronder zijn signaturen; de bouw-agent schrijft de implementatie volgens de regels in de tekst.

### 5.1 `lib/site.ts`

```ts
import type { LucideIcon } from "lucide-react";
import { ArrowRight, ClipboardList, Scale, UserPlus } from "lucide-react";
import type { Perspectief } from "@/content/beroepen";
import { ROUTES, type StaticPath } from "@/lib/routes";

/* Site en vindbaarheid */
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
  // Haaglanden komt er pas bij via employmentAgencyLd/serviceLd als isClaimConfirmed("workArea") waar is (B-43).
  areaServed: [{ "@type": "City", name: "Den Haag" }],
} as const satisfies Site;

/* Contact (NAW volgens B-23, hoofdnummer B-21, e-mail B-02) */
export type Phone = { display: string; e164: `+31${string}` };
export type OpeningHours = { days: "ma-vr"; opens: `${number}:${number}`; closes: `${number}:${number}` };
const HOOFDNUMMER: Phone = { display: "06 83 35 19 85", e164: "+31683351985" };
const EMAIL = "info@groospersoneelsdiensten.nl"; // TODO bevestigen door Jimmy (B-02)

export const contact = {
  name: "Groos Personeelsdiensten B.V.",
  shortName: "Groos Personeelsdiensten",
  phone: HOOFDNUMMER.display,
  phoneE164: HOOFDNUMMER.e164,
  phoneHref: `tel:${HOOFDNUMMER.e164}`,
  whatsapp: HOOFDNUMMER.display,
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

/** WhatsApp-link met optionele vooringevulde tekst uit messages. */
export function whatsappLink(text?: string, phone: Phone = HOOFDNUMMER): string {
  const base = `https://wa.me/${phone.e164.slice(1)}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

/* Personen (rol als tekst in messages common.people.<id>.role) */
export type PersonId = "jimmy" | "lorenzo";
export type Person = { id: PersonId; firstName: string; phone: Phone; whatsapp: boolean; photo?: `/${string}` };
export const people = [
  { id: "jimmy", firstName: "Jimmy", phone: { display: "06 83 35 19 85", e164: "+31683351985" }, whatsapp: true },
  // TODO bevestigen of Lorenzo WhatsApp op dit nummer gebruikt
  { id: "lorenzo", firstName: "Lorenzo", phone: { display: "06 52 54 95 39", e164: "+31652549539" }, whatsapp: false },
] as const satisfies readonly Person[];
export function getPerson(id: PersonId): Person { /* zoekt in people */ }

/* Navigatie */
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

/* Footer */
export type FooterColumnKey = "werkzoekenden" | "werkgevers" | "groos";
export type FooterLink =
  | { kind: "beroepen"; perspectief: Perspectief }
  | { kind: "route"; key: NavKey | NavLinkKey; href: StaticPath };
export const footerColumns = [
  { key: "werkzoekenden", links: [
    { kind: "route", key: "vacatures", href: ROUTES.vacatures },
    { kind: "beroepen", perspectief: "werkzoekende" },
    { kind: "route", key: "inschrijven", href: ROUTES.inschrijven },
    { kind: "route", key: "alleWerkzoekenden", href: ROUTES.werkzoekenden },
  ] },
  { key: "werkgevers", links: [
    { kind: "beroepen", perspectief: "werkgever" },
    { kind: "route", key: "personeelAanvragen", href: ROUTES.personeelAanvragen },
    { kind: "route", key: "wtta", href: ROUTES.wtta },
    { kind: "route", key: "alleWerkgevers", href: ROUTES.werkgevers },
  ] },
  { key: "groos", links: [
    { kind: "route", key: "overOns", href: ROUTES.overOns },
    { kind: "route", key: "contact", href: ROUTES.contact },
  ] },
] as const satisfies readonly { key: FooterColumnKey; links: readonly FooterLink[] }[];

/* Socials: alleen ingevulde kanalen verschijnen in footer en sameAs */
export type Social = { platform: "linkedin" | "instagram" | "facebook"; href: `https://${string}` };
export const socials: readonly Social[] = [];

/* Homepage-data uit de JV-basis: blijft tot spec 04 het verwijdert of vervangt (stap 4). */
// metrics, usps, segments, steps, assurances, certification, clients, projectPhotos ongewijzigd
```

Bestaande veldnamen (`name`, `shortName`, `phone`, `phoneHref`, `whatsapp`, `whatsappHref`, `email`, `emailHref`, `kvk`, `btw`, `street`, `postalCode`, `city`) blijven, zodat `lib/seo.ts` en de secties die tot stap 4 blijven bestaan blijven compileren. `whatsappHref` heeft geen vooringevulde tekst meer; vooringevulde tekst gaat via `whatsappLink(text)` met tekst uit messages. `site.areaServed` heeft al de JSON-LD-vorm, dus `localBusinessLd` blijft werken tot spec 12 hem vervangt. `areaServed` bevat alleen Den Haag; Haaglanden komt er pas bij via `employmentAgencyLd` en `serviceLd` als `isClaimConfirmed("workArea")` waar is (B-43). `legalLinks` en `LegalLinkKey` bestaan niet meer: de juridische links komen uit `publishedLegalDocs()` in `lib/legal.ts` (spec 09) via `FooterLegal`. `contact.openingHours` blijft `undefined` met de TODO-regel tot B-22 bevestigd is. JSON-LD gebruikt `contact.phoneE164`.

### 5.2 `content/beroepen/index.ts`

```ts
import type { LucideIcon } from "lucide-react";
import { Forklift, Grid2x2, HardHat, SprayCan, Truck } from "lucide-react";

/** Gelijk aan occupations.slug in de database (spec 10) en aan de sleutels in messages en content. */
export const BEROEP_IDS = [
  "glazenwasser", "schoonmaker", "logistiek-medewerker", "verhuizer", "hulpkracht-bouw-en-sloop",
] as const;
export type BeroepId = (typeof BEROEP_IDS)[number];
export type Perspectief = "werkzoekende" | "werkgever";

export type BeroepListItem = {
  id: BeroepId;
  /** Pad /werken-als/<slugWerkzoekende> */
  slugWerkzoekende: string;
  /** Pad /werkgevers/<slugWerkgever> (meervoud) */
  slugWerkgever: string;
  icon: LucideIcon;
  order: number;
};

export const beroepen = [
  { id: "glazenwasser", slugWerkzoekende: "glazenwasser", slugWerkgever: "glazenwassers", icon: Grid2x2, order: 1 },
  { id: "schoonmaker", slugWerkzoekende: "schoonmaker", slugWerkgever: "schoonmakers", icon: SprayCan, order: 2 },
  { id: "logistiek-medewerker", slugWerkzoekende: "logistiek-medewerker", slugWerkgever: "logistiek-medewerkers", icon: Forklift, order: 3 },
  { id: "verhuizer", slugWerkzoekende: "verhuizer", slugWerkgever: "verhuizers", icon: Truck, order: 4 },
  { id: "hulpkracht-bouw-en-sloop", slugWerkzoekende: "hulpkracht-bouw-en-sloop", slugWerkgever: "hulpkrachten-bouw-en-sloop", icon: HardHat, order: 5 },
] as const satisfies readonly BeroepListItem[];

export function isBeroepId(value: string): value is BeroepId;
export function getBeroep(id: BeroepId): BeroepListItem;
export function findBeroepBySlug(perspectief: Perspectief, slug: string): BeroepListItem | undefined;
```

De slugs staan alleen hier. `content/beroepen/<id>.ts` (spec 05) bevat de lange tekst en herhaalt de slugs niet; heeft spec 05 ze nodig, dan importeert het `getBeroep(id)`. De iconen zijn een voorstel binnen Lucide 0.456; spec 02 mag ze vervangen door eigen iconen met hetzelfde type.

### 5.3 `lib/routes.ts`

```ts
import { getBeroep, type BeroepId, type Perspectief } from "@/content/beroepen";
import type { NavKey } from "@/lib/site"; // alleen een type, dus geen kringafhankelijkheid tijdens runtime
import { getLegalDoc } from "@/lib/legal"; // client-veilig en importeert lib/routes.ts niet (B-40)

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
  { path: "/privacyverklaring", audience: "algemeen", owner: "09", published: getLegalDoc("privacy").published, sitemap: { priority: 0.3, changeFrequency: "yearly" }, llms: "optioneel" },
  { path: "/cookieverklaring", audience: "algemeen", owner: "09", published: getLegalDoc("cookies").published, sitemap: { priority: 0.3, changeFrequency: "yearly" }, llms: "optioneel" },
  { path: "/klachtenregeling", audience: "algemeen", owner: "09", published: getLegalDoc("complaints").published, sitemap: { priority: 0.3, changeFrequency: "yearly" }, llms: "optioneel" },
  // published volgt LEGAL_DOCS in lib/legal.ts; spec 09 zet terms op true zodra Jimmy de tekst levert (B-11, B-40)
  { path: "/algemene-voorwaarden", audience: "werkgever", owner: "09", published: getLegalDoc("terms").published, sitemap: { priority: 0.3, changeFrequency: "yearly" }, llms: "optioneel" },
];

/** Sitemapwaarden voor de beroepspagina's (afgeleid uit content/beroepen). */
export const BEROEP_ROUTE_META: Record<Perspectief, SitemapMeta> = {
  werkzoekende: { priority: 0.7, changeFrequency: "weekly" },
  werkgever: { priority: 0.7, changeFrequency: "monthly" },
};

export function routeMeta(path: StaticPath): RouteMeta;
/** Doelgroep van een pad zonder taalprefix (B-04). */
export function audienceFor(pathname: string): Audience;
export type ActionBarVariant = "werkzoekende" | "werkgever" | "aanvraag" | "vacature" | "algemeen";
export function actionBarVariantFor(pathname: string): ActionBarVariant;
export type HeaderCtaKey = "inschrijven" | "vacatures" | "personeelAanvragen" | "contact";
export function headerCtaFor(pathname: string): HeaderCtaKey;
/** "page" bij exacte match, "section" als het pad onder het menu-item valt, anders false. */
export function isActive(pathname: string, item: NavKey): "page" | "section" | false;
```

`lib/legal.ts` (spec 09) importeert `lib/routes.ts` niet en is client-veilig, dus er is geen kringafhankelijkheid (B-40). `/stijlgids` staat niet in `STATIC_ROUTES`.

Regels voor `audienceFor` (pad zonder taalprefix):

| Doelgroep | Paden |
|---|---|
| werkzoekende | `/vacatures`, `/vacatures/*`, `/werkzoekenden`, `/werken-als/*`, `/inschrijven`, `/bedankt/sollicitatie`, `/bedankt/inschrijving` |
| werkgever | `/werkgevers`, `/werkgevers/*`, `/bedankt/aanvraag`, `/algemene-voorwaarden` |
| algemeen | alle andere paden, waaronder `/`, `/over-ons`, `/contact`, privacy, cookies, klachten, `/bedankt/contact` en 404 |

Deze indeling volgt de aanspreekvorm per route van B-04. Spec 03 mag `audienceFor` gebruiken om de juiste vorm te controleren.

### 5.4 `lib/navigation.ts` (server-only)

```ts
import "server-only";
export type ResolvedLink = { href: AppPath; label: string; icon?: ReactNode; emphasis?: boolean };
export type ResolvedAction = { href: string; label: string; ariaLabel?: string; icon: ReactNode; external?: boolean };
export type ResolvedNavItem = {
  key: NavKey;
  href: StaticPath;
  label: string;
  panel?: { beroepen: ResolvedLink[]; beroepenLabel: string; links: ResolvedLink[] };
};
export type NavModel = {
  items: ResolvedNavItem[];
  headerCtas: Record<HeaderCtaKey, ResolvedLink>; // labels uit common.cta.*, zie hieronder
  actions: Record<ActionKey, ResolvedAction>; // labels uit common.cta.*, zie hieronder
  footerColumns: { key: FooterColumnKey; title: string; links: ResolvedLink[] }[];
  // Geen legalLinks: de footer haalt juridische links via FooterLegal (spec 09).
};
/** Lost nav, headerCtas, actions en footerColumns op voor de huidige taal; met React cache() per verzoek één keer. */
export const getNavModel: () => Promise<NavModel>;
```

Labels in het navigatiemodel: `headerCtas` (ook gebruikt door de knoppen in het mobiele menu) krijgt inschrijven = `common.cta.register`, vacatures = `common.cta.viewJobs`, personeelAanvragen = `common.cta.requestStaff` en contact = `common.cta.contact`. `actions` krijgt bellen = `common.cta.call`, WhatsApp = `common.cta.whatsapp` (met `common.opensInNewTab` als verborgen toevoeging in `ariaLabel`), personeelAanvragen = `common.cta.requestStaff` en solliciteren = `common.cta.apply`. `legalLinks` vervalt; de footer haalt juridische links via `FooterLegal`.

### 5.5 Gegevens van andere specs die deze spec gebruikt

- `lib/data/*` (spec 10) levert voor de skeletten niets; spec 06 voegt in `vacatures/[slug]/page.tsx` een leesfunctie toe voor `generateStaticParams`.
- `occupations.slug` (spec 10) heeft exact de waarden van `BEROEP_IDS`.
- De contactpersoon van een vacature (spec 10) is te herleiden tot `PersonId` (`jimmy` of `lorenzo`), zodat spec 06 naam en nummer uit `people` kan tonen.

## 6 Tekstelementen

Toon, aanspreekvorm en definitieve copy zijn van spec 03 (B-04: header, footer en foutpagina's zijn gedeeld, dus wij-zinnen of zinnen zonder aanspreekvorm; waar nodig de u-vorm). Hieronder staan de sleutelpaden die de componenten van deze spec lezen. De bouw-agent van stap 3 zet ze per namespace in `messages/nl/<namespace>.json` en `messages/en/<namespace>.json` (`header.json`, `common.json`, `footer.json`, `notFound.json`, `error.json`, `meta.json`, `beroepen.json` en `legal.json`), in afstemming met de agent van spec 03. `messages/<locale>/index.ts` voegt de namespaces samen (§4.11.3, B-45).

Tekst: spec 03 §6.14 (nl) en §6.15 (en); beroepsnamen: spec 05 (`beroepen.<id>.enkelvoud`, `.meervoud`); juridische vermeldingen: spec 09 (`legal.*`).

**`header`** (eigenaar spec 03)

- `header.skipLink`, `header.homeAria`, `header.mainMenu`, `header.openMenu`, `header.closeMenu`, `header.mobileMenu`, `header.callAria` (met `{phone}`), `header.actionBar`
- `header.nav.vacatures`, `header.nav.werkzoekenden`, `header.nav.werkgevers`, `header.nav.overOns`, `header.nav.contact`, `header.nav.inschrijven`, `header.nav.alleWerkzoekenden`, `header.nav.personeelAanvragen`, `header.nav.wtta`, `header.nav.alleWerkgevers`
- `header.menu.beroepenWerkzoekenden`, `header.menu.beroepenWerkgevers`

**`common`** (eigenaar spec 03)

- Knoppen van `HeaderCta` en het mobiele menu: `common.cta.register`, `common.cta.viewJobs`, `common.cta.requestStaff`, `common.cta.contact`
- Knoppen van `ActionBar`: `common.cta.call`, `common.cta.whatsapp`, `common.cta.requestStaff`, `common.cta.apply`
- `common.whatsapp.algemeen`, `common.whatsapp.werkzoekende`, `common.whatsapp.werkgever` (vooringevulde tekst)
- `common.opensInNewTab`
- `common.languageSwitcher.label`, `common.languageSwitcher.nl`, `common.languageSwitcher.en`
- `common.breadcrumbs.label`, `common.breadcrumbs.home`
- `common.address.byAppointment`
- `common.contact.officeHoursValue` (alleen als `contact.openingHours` gevuld is, B-22)
- `common.people.jimmy.role`, `common.people.lorenzo.role`
- `common.loading`

**`footer`** (eigenaar spec 03)

- `footer.description`, `footer.navLabel`
- `footer.columns.werkzoekenden`, `footer.columns.werkgevers`, `footer.columns.groos`, `footer.columns.contact`
- `footer.rights` (met `{year}` en `{name}`)

**`notFound` en `error`** (eigenaar spec 03)

- `notFound.metaTitle`, `notFound.title`, `notFound.body`, `notFound.linksLabel`, `notFound.links.vacatures`, `notFound.links.personeel`, `notFound.links.contact`, `notFound.home`
- `error.metaTitle`, `error.title`, `error.body` (met `{phone}`), `error.retry`, `error.home`, `error.code` (met `{digest}`)

**`beroepen`** (eigenaar spec 05): deze spec leest alleen `beroepen.<id>.enkelvoud` en `beroepen.<id>.meervoud` voor de vijf id's uit `BEROEP_IDS` en zet ze in stap 3 als ze er nog niet zijn.

**`legal`** (eigenaar spec 09): de skeletten lezen `legal.nav.cookies` en `legal.nav.complaints` als titel (§4.20); de overige `legal.*`-sleutels leest `FooterLegal`.

**`meta`** (eigenaar spec 03): de layout leest `meta.titleDefault`, `meta.titleTemplate` en `meta.description`. Het scheidingsteken in titels is `|` (context/10 §6); spec 03 en spec 12 stemmen af of `pageMetadata()` de merknaam toevoegt of de template.

**Inline tekst (uitzondering op messages)**: `global-error.tsx` met NL "Er ging iets mis" en "De site laadt nu niet goed. Probeer het opnieuw of bel ons op 06 83 35 19 85." plus de EN-tegenhanger; `global-not-found.tsx` met "Deze pagina bestaat niet" en "Ga naar de homepage of bel ons op 06 83 35 19 85.", plus "This page does not exist." met `lang="en"`.

**Structurele data**: `lib/site.ts` (§5.1), `lib/routes.ts` (§5.3), `content/beroepen/index.ts` (§5.2).

## 7 SEO

### 7.1 Metadata, canonical en hreflang

- Elke pagina gebruikt `pageMetadata()` uit `lib/seo.ts` (spec 12); geen losse `openGraph`-objecten.
- Canonical naar zichzelf, met deze uitzonderingen: `/vacatures` met filterparameters naar `/vacatures` (B-16); `/en/vacatures/[slug]` naar de NL-URL (§4.11.6).
- hreflang `nl`, `en` en `x-default` (naar NL) op alle pagina's, behalve op vacaturedetails: daar geen alternatieven. Spec 12 §4.2 geeft `pageMetadata()` daarvoor de opties `languages: false` (geen alternatieven) en `canonical: { locale, path }` (afwijkende canonical).
- next-intl zet geen `Link`-header met alternatieven (`alternateLinks: false`); hreflang staat alleen in de `<head>` en in de sitemap.
- `<html lang>` volgt de taal van het pad; Nederlandse inhoud op een Engelse pagina krijgt `lang="nl"`.

### 7.2 Indexering

| Wat | Regel |
|---|---|
| bedankpagina's | `noindex, follow` |
| 404 en vangnet | status 404, Next zet `noindex` |
| `/algemene-voorwaarden` zolang `getLegalDoc("terms").published` onwaar is | `noindex, follow`, niet gelinkt, niet in sitemap of llms.txt |
| gesloten vacatures (spec 06) | `noindex, follow` tot 30 dagen, daarna 404 |
| `/vacatures` met `q`, `beroep`, `plaats`, `uren`, `dienst` of `sortering` (niet-standaard) | `noindex, follow` en canonical `/vacatures` (B-16) |
| `/beheer/*` | `noindex, nofollow` en `Disallow: /beheer` in robots.txt (spec 12) |
| `/stijlgids` | `noindex, nofollow`; in productie `notFound()` (spec 02) |
| `/api/*` | `Disallow: /api/` in robots.txt (spec 12) |
| crawlers | nooit een geo-omleiding (§4.12) |

### 7.3 Sitemap en `llms.txt` (implementatie spec 12)

**In de sitemap** (per URL beide talen met `alternates.languages` en `x-default`, behalve waar anders vermeld): alle `STATIC_ROUTES` met `published: true` en `sitemap` niet `null`; `/werken-als/<slug>` en `/werkgevers/<slug>` voor alle vijf beroepen met `BEROEP_ROUTE_META`; gepubliceerde vacatures alleen als NL-URL zonder alternatieven, met `lastModified` uit `updated_at` (spec 12 en 06).

**Niet in de sitemap**: `/bedankt/*`, `/algemene-voorwaarden` zolang niet gepubliceerd, `/en/vacatures/*`, filter- en pagineringsURL's, gesloten vacatures, `/beheer`, `/api`, `/feeds`, `/stijlgids`.

**In `llms.txt`**: Routes met `llms: "kern"` onder de koppen Werkzoekenden, Werkgevers en Groos volgens `RouteMeta.audience` (algemeen onder Groos), met de vijf beroepspagina's per perspectief; gepubliceerde juridische documenten uit `publishedLegalDocs()` en de link naar `/en` onder Optional (spec 12 §4.9).

### 7.4 JSON-LD

- `BreadcrumbList` alleen via `Breadcrumbs` (§4.9).
- Site-brede JSON-LD in de layout en `EmploymentAgency` op home en contact zijn van spec 12; `site.schemaType` is `"EmploymentAgency"` en `site.areaServed` heeft de JSON-LD-vorm.

## 8 Toegankelijkheid en performance

**Landmarks en koppen**

- Per pagina precies één `header` (banner), één `main#inhoud`, één `footer` (contentinfo). Navigaties: hoofdmenu, kruimelpad, footeroverzicht, juridische links en snel contact, elk met een eigen `aria-label`.
- Skiplink als eerste focusbare element; hij springt naar `main#inhoud` (`tabIndex={-1}`).
- Koppen volgen B-05; header en menu bevatten geen koppen; footerkolommen zijn `h2`; foutpagina's hebben één `h1`.

**Bediening**

- Uitklapmenu volgt het base-ui NavigationMenu-patroon: Enter, spatie en pijl omlaag openen, Escape sluit en zet de focus terug op de trigger, Tab loopt door de links.
- Mobiel menu: focusval, Escape, focus terug naar de trigger, achtergrond `inert` (base-ui Dialog modaal).
- Doelgrootte: menuknop, actiebalkknoppen en menuregels minimaal 44 bij 44 px, actiebalk 48 px hoog (context/12).
- Zichtbare focus volgens spec 02 §4.5; geen eigen ring-klassen.
- Links die een nieuw venster openen, melden dat aan schermlezers (`common.opensInNewTab`).
- Telefoonnummers als `tel:`-link met `aria-label` "Bel ons op 06 83 35 19 85"; `formatDetection` staat uit, zodat iOS geen tweede link maakt.

**Contrast en beweging**

- Kleuren alleen via tokens van spec 02 (contrast AA, lopende tekst 7:1 waar spec 02 dat vraagt); actieve staat nooit alleen met kleur, ook met onderstreping of `aria-current`.
- Overgangen 150 tot 200 ms, met `motion-reduce:transition-none`; geen framer-motion in header, menu en actiebalk.

**Performance**

- Header, footer en kruimelpad renderen op de server; de clienteilanden zijn klein (base-ui NavigationMenu, Dialog en Accordion, die al in de bundel zitten).
- De client krijgt alleen de messages van `CLIENT_NAMESPACES`.
- Sticky header met vaste hoogte van 64 px en fonts via `next/font`: geen verschuiving bij laden (CLS onder 0,1, spec 14).
- Statische generatie per taal voor alle vaste pagina's; ISR waar vacatures getoond worden; geen `loading.tsx` op publieke pagina's.
- Alle beelden via `next/image` (§4.17).

## 9 21st.dev-opdracht voor sub-agents

### 9.1 Werkwijze voor alle sub-agents

De bouw-agent van stap 3 start vier sub-agents tegelijk, zodra §5 (registers) staat en vóórdat hij de visuele afwerking van header, menu, footer en foutpagina's doet. De logica (props, gedrag, toegankelijkheid) bouwt hij intussen al op de bestaande primitives.

- **Tools laden**: `ToolSearch` met `select:mcp__magic__search,mcp__magic__get_inspiration`.
- **Zoeken**: `mcp__magic__search` met `type: "component"` en `limit: 10`, met elk van de opgegeven formuleringen; `mcp__magic__get_inspiration` met de opgegeven beschrijvingen. Zoeken op thema's levert niets op (00 §4.6); tokens komen uit spec 02.
- **Selectiecriteria**: minimaal en rustig; witte achtergrond; blauw accent alleen via tokens van spec 02 (`bg-primary`, `text-primary`, `ring-ring`); past bij de boodschap van de plek (helder, nuchter, twee doelgroepen, snel bellen); shadcn-compatibel met Tailwind 4 en `cn()`; toegankelijk (toetsenbord, aria, zichtbare focus, doelen van 44 px); geen nieuwe dependencies (geen Radix-pakketten, geen framer-motion in header en menu; base-ui 1.0.0-rc.0 en lucide 0.456 zijn er al); geen glass, gloed, raster of marquee (B-29).
- **Oplevering** (als tekst aan de bouw-agent, geen bestanden): 2 tot 4 kandidaten met id, naam en preview-URL, per kandidaat twee zinnen over wat bruikbaar is en wat niet, één gemotiveerde keuze, en of `get_component` nodig is. Bij geen bruikbare kandidaat: het advies om op de primitives te bouwen, met de punten uit de kandidaten die wel inspireren.
- **Code ophalen**: `mcp__magic__get_component` alleen voor de gekozen kandidaat, maximaal één keer per plek, en alleen als het overnemen van structuur of interactie echt tijd scheelt. Voor 404 en foutpagina is dat zelden zo.
- **Vastleggen**: de bouw-agent schrijft per plek de kandidaten (id, naam, preview-URL), de keuze, wel of geen `get_component` en de aanpassingen in `docs/21st-keuzes.md` onder het kopje "Spec 01".
- **Aanpassingsregels**: kleuren en radius alleen via tokens van spec 02; de componentnamen, props en id's uit §4.23 blijven gelijk; alle tekst via messages of props; server component tenzij interactie; base-ui-wrappers in `components/ui/navigation-menu.tsx` in plaats van Radix NavigationMenu; `Link` uit `@/i18n/navigation`; iconen uit lucide 0.456 met lijndikte 2; `prefers-reduced-motion` gerespecteerd; geen eyebrows of labels boven koppen.
- **Valt 21st.dev tegen**, dan bouwt de agent op `components/ui/navigation-menu.tsx`, base-ui `Dialog` en `Accordion` en `CtaButton`.

### 9.2 Sub-agent `scout-header`: header met uitklapmenu

Boodschap van de plek: in één oogopslag twee routes (werk zoeken en personeel inhuren), met bellen altijd binnen bereik.

- `search`: "navigation menu dropdown mega menu"; "minimal navbar with dropdown links and CTA button"; "header navigation dropdown with icon list two columns"; "site header with phone number and call to action".
- `get_inspiration`: "minimal white site header with two audience dropdown menus (job seekers and employers), phone link and primary CTA, accessible keyboard navigation"; "staffing agency website header with jobs link and request staff button".
- Specifiek: paneel met twee kolommen (lijst met iconen, kolom met twee of drie acties), geen beschrijvingen of beelden, werkt met de base-ui-wrapper.

| Id | Naam | Preview |
|---|---|---|
| 18191 | Rich Navigation Menu (shadcnui-blocks) | https://21st.dev/@shadcnui-blocks/components/navigation-menu-06 |
| 31509 | Navigation Menu (wensity) | https://21st.dev/@wensity/components/navigation-menu |
| 606 | Navbar with Dropdowns (shadcnblockscom) | https://21st.dev/@shadcnblockscom/components/shadcnblocks-com-navbar1 |
| 21220 | Centered Nav Header (olewandowski1) | https://21st.dev/@olewandowski1/components/centered-nav-header |

### 9.3 Sub-agent `scout-mobiel`: mobiel menu en actiebalk

Boodschap: snel de juiste kant op met de duim, en bellen of appen zonder te zoeken.

- `search`: "full screen mobile menu"; "mobile navigation sheet with accordion submenu"; "base ui dialog mobile menu"; "sticky bottom action bar mobile call buttons".
- `get_inspiration`: "full screen white mobile menu with two collapsible groups and two stacked call to action buttons at the bottom"; "mobile sticky bottom bar with call and WhatsApp buttons for a local service business".
- Specifiek: modaal venster met eigen kopregel en sluitknop; uitklapgroepen op base-ui `Accordion`; actiebalk met twee gelijke knoppen; geen swipe-bibliotheek.

| Id | Naam | Preview |
|---|---|---|
| 26888 | Classic Header with Sheet Menu (ln-dev7) | https://21st.dev/@ln-dev7/components/header-17 |
| 2307 | Navbar 5 (shadcnblockscom) | https://21st.dev/@shadcnblockscom/components/navbar-5 |
| 11312 | Accordion op Base UI (coss.com) | https://21st.dev/@coss.com/components/coss-accordion |
| 11444 | Drawer (coss.com) | https://21st.dev/@coss.com/components/drawer |

Voor de actiebalk gaf 21st.dev geen passende kandidaat (alleen "Bottom Menu", 10458, https://21st.dev/@0xUrvish/components/bottom-menu, als inspiratie voor afmetingen); die bouwt de agent op `CtaButton`.

### 9.4 Sub-agent `scout-footer`: footer

Boodschap: betrouwbaar en vindbaar, met adres en nummers die overal gelijk zijn.

- `search`: "footer with link columns"; "agency footer with contact details and legal links"; "minimal light footer sitemap columns"; "footer with address block and copyright bar".
- `get_inspiration`: "clean light footer with three link columns, contact address block and legal links bar"; "local business footer with address, phone, email and small legal navigation".
- Specifiek: merkblok, drie linkkolommen, contactblok met `<address>`, onderbalk met juridische links en taalknop; geen grote woordmerken op de achtergrond, geen nieuwsbrief.

| Id | Naam | Preview |
|---|---|---|
| 21474 | Agency Footer (shadcnspace) | https://21st.dev/@shadcnspace/components/footer-01 |
| 28291 | Footer with Navigation Grid (shadcnui-blocks) | https://21st.dev/@shadcnui-blocks/components/footer-01 |
| 27521 | Footer Two (meschacirung) | https://21st.dev/@meschacirung/components/footer-2 |
| 2223 | Footer 7 (shadcnblockscom) | https://21st.dev/@shadcnblockscom/components/footer-7 |

### 9.5 Sub-agent `scout-randen`: 404 en foutpagina

Boodschap: als iets misgaat, helpen wij de bezoeker direct verder. Het kruimelpad is van spec 02 (`components/ui/breadcrumb.tsx`); deze sub-agent zoekt daar niet naar.

- `search`: "404 not found page with suggested links"; "error page try again button".
- `get_inspiration`: "friendly 404 page with three suggested pages and a home link, white background"; "minimal error page with one retry button and a phone number".
- Specifiek: 404 met h1, twee zinnen en drie links, zonder grote "404"-illustratie en zonder eyebrow; foutpagina met één primaire knop en het telefoonnummer.

| Id | Naam | Preview |
|---|---|---|
| 21524 | Not Found 06 (shadcnui-blocks) | https://21st.dev/@shadcnui-blocks/components/not-found-06 |
| 8825 | Not Found Page (efferd) | https://21st.dev/@efferd/components/not-found-page-1 |
| 29348 | 500 Server Error Page (olewandowski1) | https://21st.dev/@olewandowski1/components/error-3 |

## 10 Bouwopdracht

> **Notitie.** Bouwstap 3 is gecommit (16c35a6). De wijzigingen uit kruiscontrole ronde 1 en 2 aan deze spec voert de bouw-agent van bouwstap 3b uit (00 §6).

Bouwstap 3 uit 00 §6, samen met spec 03. Voorwaarden: stap 1 (spec 13 en 10: `.env.local` met `groos-dev`, Supabase-clients) en stap 2 (spec 02: Tailwind 4, tokens, `lib/fonts.ts` met `fontSans` en `fontDisplay`, `Wordmark`) zijn klaar. Lees vooraf `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/{proxy,not-found,error,layout,page}.md` en `02-guides/caching-without-cache-components.md`.

1. **Registers.** Maak `content/beroepen/index.ts` (§5.2) en `lib/routes.ts` (§5.3) met alle functies uitgewerkt. Herschrijf `lib/site.ts` volgens §5.1; laat de homepage-exports staan.
2. **i18n.** Pas `i18n/routing.ts` aan (§4.11.1). Maak `i18n/formats.ts`, `i18n/locale.ts` en `i18n/client-messages.ts`, breid `i18n/request.ts` uit (§4.11.2 en §4.11.4) en maak `global.d.ts` (§4.11.3).
3. **Messages.** Zet de sleutels van §6 in `messages/nl/<namespace>.json` en `messages/en/<namespace>.json` (namespaces `header`, `common`, `footer`, `notFound`, `error`, `meta`, `beroepen` en `legal`) en zorg dat `messages/nl/index.ts` en `messages/en/index.ts` elke namespace samenvoegen (§4.11.3), in afstemming met de agent van spec 03. Verwijder de sleutels uit §4.10 waarvan geen gebruiker overblijft.
4. **Proxy en config.** Werk `proxy.ts` bij (§4.12) en maak de stub `app/beheer/_lib/proxy.ts` met `beheerProxy()` (§4.12; spec 08 vervangt de inhoud in stap 7). `next.config.mjs` is van spec 13 en bevat `globalNotFound: true` al (spec 13 §4.2); controleer dat alleen. Zet in `package.json` `"typecheck": "next typegen && tsc --noEmit"` en draai `npm uninstall @radix-ui/react-slot`.
5. **Sub-agents.** Start de vier sub-agents uit §9 tegelijk; ga intussen door met stap 6 tot en met 8 op de primitives.
6. **Navigatiemodel.** Maak `lib/navigation.ts` met `getNavModel()` (§5.4) en `lib/revalidate.ts` (§4.15).
7. **Header, menu, actiebalk.** Herschrijf `components/sections/site-header.tsx` en maak `components/sections/header/{desktop-nav,header-cta,mobile-menu,action-bar}.tsx` en `components/sections/site-action-bar.tsx` (§4.4 tot en met §4.6). Pas het gedrag van `components/ui/language-toggle.tsx` aan (§4.7).
8. **Footer en kruimelpad.** Herschrijf `components/sections/site-footer.tsx` (§4.8); maak `components/legal/footer-legal.tsx` als stub (§4.8; spec 09 blok A vult hem in dezelfde bouwstap), `components/sections/breadcrumbs.tsx` (§4.9) en `components/sections/page-placeholder.tsx` (§4.20). Laat `ServiceHero` `Breadcrumbs` gebruiken.
9. **Layout.** Herschrijf `app/[locale]/layout.tsx` volgens §4.22.
10. **Foutafhandeling.** Maak `app/[locale]/not-found.tsx`, `app/[locale]/error.tsx`, `app/[locale]/[...rest]/page.tsx`, `app/global-error.tsx` en `app/global-not-found.tsx` (§4.13).
11. **Verwijderen.** Voer de regels van §4.10 met "Wanneer 3" uit, waaronder `git mv app/[locale]/privacybeleid app/[locale]/privacyverklaring`. Haal `SiteHeader`, `SiteFooter`, `<main>`, `Services` en `OfferteForm` uit `app/[locale]/page.tsx`, en `SiteHeader`, `SiteFooter` en `<main>` uit `components/legal/legal-page.tsx`.
12. **Skeletten.** Maak de skeletpagina's van §4.20 met de routeconfiguratie uit §4.1 en §4.11.5.
13. **Ontwerp toepassen.** Verwerk de keuzes van de sub-agents in header, menu, actiebalk, footer en foutpagina's, binnen de regels van §9.1. Het kruimelpad gebruikt de primitives van spec 02 (§4.9).
14. **Afgeleiden.** Vervang in `app/sitemap.ts` en `app/llms.txt/route.ts` de imports van `services` en `cities` door `STATIC_ROUTES`, `BEROEP_ROUTE_META` en `beroepen` volgens §7.3 (nog zonder vacatures; spec 12 maakt ze af in stap 5). Vervang in `scripts/check-launch.mjs` controle 2 door: elk id uit `content/beroepen/index.ts` heeft `beroepen.<id>.enkelvoud` en `.meervoud` in elke locale; bestanden `content/beroepen/<id>.ts` controleert spec 14 zodra spec 05 ze levert. Haal Web3Forms uit de `.env.local`-notitie.
15. **Documentatie.** Werk de tabel "Waar dingen staan" in `CLAUDE.md` en de structuur in `README.md` bij.
16. **Verifiëren.**

```bash
npm run verify
npm run check -- --warn            # geen sleutel- of registratiefouten; TODO's mogen nog
npm run build && npm run start     # productieserver op http://localhost:3000

B=http://localhost:3000
for p in / /vacatures /inschrijven /werkzoekenden /werkgevers /werkgevers/personeel-aanvragen \
  /werkgevers/wtta /over-ons /contact /privacyverklaring /cookieverklaring /algemene-voorwaarden \
  /klachtenregeling /bedankt/sollicitatie /bedankt/inschrijving /bedankt/aanvraag /bedankt/contact \
  /werken-als/glazenwasser /werken-als/schoonmaker /werken-als/logistiek-medewerker \
  /werken-als/verhuizer /werken-als/hulpkracht-bouw-en-sloop /werkgevers/glazenwassers \
  /werkgevers/schoonmakers /werkgevers/logistiek-medewerkers /werkgevers/verhuizers \
  /werkgevers/hulpkrachten-bouw-en-sloop; do
  for pre in "" /en; do u="$pre$p"; [ "$u" = "/en/" ] && u=/en
    echo "$(curl -s -o /dev/null -w '%{http_code}' "$B$u") $u"; done; done
for u in /diensten/dienst-een /werkgebied /werkgebied/stad-een /privacybeleid /werken-als/onbekend \
  /werkgevers/onbekend /bedankt/onbekend /en/onbekend /een/twee/drie; do
  echo "$(curl -s -o /dev/null -w '%{http_code}' "$B$u") $u"; done
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' -H 'x-vercel-ip-country: DE' $B/werkgevers
curl -s -o /dev/null -w '%{http_code}\n' -H 'x-vercel-ip-country: DE' -A 'Mozilla/5.0 (compatible; Google-InspectionTool/1.0)' $B/werkgevers
curl -sI $B/werkgevers | grep -i '^link:' || echo "geen Link-header"
```

17. **Visueel.** Playwright op 390, 768, 1280 en 1440 px voor `/`, `/werken-als/schoonmaker`, `/werkgevers/schoonmakers`, `/contact` en een 404: header, uitklapmenu's (1280), mobiel menu en actiebalk (390), footer, kruimelpad. Scroll elke pagina eerst door. Screenshots alleen in `.playwright-mcp/`.
18. **Afsluiten.** Noteer in spec 00 de stand (stap 3 klaar) en eventuele afwijkingen (bijvoorbeeld `globalNotFound` vervallen). De sub-agentkeuzes gaan naar `docs/21st-keuzes.md` onder "Spec 01" (§9.1), niet naar spec 00.
19. **Nazorg bouwstap 3b.** (a) BotID-voorvoegsel in de eerste matcher (§4.12); (b) `isKnownPath` met `parseVacancySlug` voor `vacatures` (§4.12, B-55); (c) `common.cta.callDirect` uit beide `common.json` (§4.10); (d) 21st.dev-scouting §9 uitvoeren en vastleggen onder "Spec 01" in `docs/21st-keuzes.md` (AC-01-38).

Afhankelijkheden in latere stappen: spec 04 en 05 (stap 4) vervangen skeletten en ruimen de homepage-data op; spec 06 (stap 5) bouwt de vacaturepagina's, de melding op `/en` en het anker `#solliciteren`; spec 12 (stap 5) maakt sitemap en `llms.txt` af en voegt de opties `languages: false` en `canonical: { locale, path }` toe aan `pageMetadata()`; spec 07 (stap 6) gebruikt `paths.bedankt()` en `redirect` uit `@/i18n/navigation`; spec 08 (stap 7) bouwt `app/beheer` volgens §4.21, vult `beheerProxy()` en gebruikt `revalidateVacancies()` van spec 10; spec 09 (blok A, stap 3) vult `FooterLegal` en zet `LEGAL_DOCS` terms op `published: true` zodra de tekst er is.

## 11 Acceptatiecriteria

Alle criteria gelden op localhost met de productieserver (`npm run build && npm run start`) tegen `groos-dev`, tenzij anders vermeld.

| Id | Criterium | Eis |
|---|---|---|
| AC-01-01 | Het routescript uit §10 stap 16 geeft 200 voor alle 27 paden in NL en in EN (54 regels). | E-01-01, E-01-13 |
| AC-01-02 | `/diensten/dienst-een`, `/werkgebied`, `/werkgebied/stad-een`, `/privacybeleid`, `/werken-als/onbekend`, `/werkgevers/onbekend`, `/bedankt/onbekend`, `/en/onbekend` en `/een/twee/drie` geven 404. | E-01-01, E-01-02, E-01-16 |
| AC-01-03 | De 404 van `/een/twee/drie` bevat header, footer, `<h1>Deze pagina bestaat niet of niet meer</h1>`, drie links naar `/vacatures`, `/werkgevers/personeel-aanvragen` en `/contact`, een link naar `/` en `<meta name="robots" content="noindex">`; `/en/onbekend` toont "This page does not exist or no longer exists" met `<html lang="en">`. | E-01-16 |
| AC-01-04 | `grep -rE "content/services\|content/werkgebied\|OfferteForm\|web3forms\|components/werkgebied" app components lib content scripts` geeft geen treffers; `components/ui/button.tsx` bestaat niet en `package.json` noemt `@radix-ui/react-slot` niet. | E-01-02, E-01-22 |
| AC-01-05 | De uitvoer van `next build` toont `/[locale]`, `/[locale]/werken-als/[beroep]` (10 pagina's), `/[locale]/werkgevers/[beroep]` (10) en `/[locale]/bedankt/[soort]` (8) als prerender en `/[locale]/[...rest]` als dynamisch; vanaf stap 5 (spec 06 leest `searchParams`) staat ook `/[locale]/vacatures` als dynamisch. | E-01-01, E-01-18 |
| AC-01-06 | `curl -H 'x-vercel-ip-country: DE' /werkgevers` geeft 307 naar `/en/werkgevers` met `set-cookie: NEXT_LOCALE=en`; met user agent Googlebot of Google-InspectionTool en dezelfde header geeft het 200; met `x-vercel-ip-country: NL` 200. | E-01-15 |
| AC-01-07 | `/beheer` krijgt geen 307 naar `/en` en geen `NEXT_LOCALE`-cookie, ook met `x-vercel-ip-country: PL` (en met `DE`); `/en/beheer` geeft 404. | E-01-15 |
| AC-01-08 | `curl -H 'Cookie: NEXT_LOCALE=en' /contact` geeft 307 naar `/en/contact`. | E-01-13, E-01-15 |
| AC-01-09 | `curl -sI /werkgevers` bevat geen `link:`-header met hreflang. | E-01-13 |
| AC-01-10 | Op 1280 px bevat `nav[aria-label="Hoofdmenu"]` in deze volgorde Vacatures, Werkzoekenden, Werkgevers, Over ons, Contact. Het paneel Werkzoekenden bevat precies de links `/werken-als/glazenwasser`, `/werken-als/schoonmaker`, `/werken-als/logistiek-medewerker`, `/werken-als/verhuizer`, `/werken-als/hulpkracht-bouw-en-sloop`, `/inschrijven`, `/werkzoekenden`; het paneel Werkgevers de vijf meervoudspaden plus `/werkgevers/personeel-aanvragen`, `/werkgevers/wtta`, `/werkgevers`. | E-01-07 |
| AC-01-11 | Met alleen het toetsenbord: Tab naar de trigger Werkzoekenden, Enter opent het paneel, Tab bereikt de eerste link, Escape sluit en de focus staat weer op de trigger. | E-01-07 |
| AC-01-12 | De headerknop is "Schrijf je in" naar `/inschrijven` op `/werken-als/verhuizer`, "Bekijk vacatures" naar `/vacatures` op `/inschrijven`, "Personeel aanvragen" naar `/werkgevers/personeel-aanvragen` op `/` en `/werkgevers/verhuizers`, en "Neem contact op" naar `/contact` op `/werkgevers/personeel-aanvragen`. De test leest de verwachte tekst uit messages (`common.cta.*`), zoals spec 14 §6.1. | E-01-07 |
| AC-01-13 | Op 1280 px staat in de header een link met `href="tel:+31683351985"` en de tekst "06 83 35 19 85". | E-01-04, E-01-07 |
| AC-01-14 | Op 390 px is het hoofdmenu niet zichtbaar en is de menuknop minimaal 44 bij 44 px. Na een klik is een `[role="dialog"]` zichtbaar, staat de focus erin, blijft Tab binnen het venster, sluit Escape het venster en keert de focus terug naar de menuknop; tijdens het open venster scrollt de pagina niet mee. | E-01-08 |
| AC-01-15 | Op `/werkgevers/schoonmakers` staat bij openen van het mobiele menu de groep Werkgevers open; een klik op "Verhuizers" opent `/werkgevers/verhuizers` en sluit het venster. | E-01-08 |
| AC-01-16 | Op 390 px toont `nav[aria-label="Snel contact"]` op `/werken-als/schoonmaker` "Bel ons" en "App ons" (href begint met `https://wa.me/31683351985?text=`), op `/werkgevers/schoonmakers` "Bel ons" en "Personeel aanvragen", op `/werkgevers/personeel-aanvragen` "Bel ons" en "App ons", op `/` "Bel ons" en "App ons"; op 1280 px is de balk niet zichtbaar. Vanaf stap 5 toont `/vacatures/<seed-slug>` "Bel ons" en "Solliciteer direct" naar `#solliciteren`. De test leest de verwachte tekst uit messages (`common.cta.*`). | E-01-09 |
| AC-01-17 | Vanaf stap 6: op `/inschrijven` krijgt de actiebalk `inert` en schuift hij weg zodra het eerste invoerveld focus heeft, en komt hij terug na het verlaten van het veld. | E-01-09 |
| AC-01-18 | Op 390 px overlapt de laatste regel van de footer na doorscrollen niet met de actiebalk (de rechthoeken snijden elkaar niet). | E-01-09, E-01-11 |
| AC-01-19 | Op `/`, `/werkgevers/glazenwassers` en `/en/contact` bevat de footer "Hugo Coenraadspad 6", "2553 ER Den Haag", "Langskomen kan alleen op afspraak." (EN "Visits are by appointment only."), `tel:+31683351985`, `mailto:info@groospersoneelsdiensten.nl`, `https://wa.me/31683351985`, de tien beroepslinks en links naar privacyverklaring, cookieverklaring en klachtenregeling, en geen link naar `/algemene-voorwaarden`. | E-01-11, E-01-04 |
| AC-01-20 | Op `/werkgevers/glazenwassers` bevat `nav[aria-label="Kruimelpad"] ol` drie items: Home (`/`), Werkgevers (`/werkgevers`) en Glazenwassers met `aria-current="page"` zonder link. De pagina bevat één `BreadcrumbList` met drie `itemListElement` en absolute URL's op `https://www.groospersoneelsdiensten.nl`; op `/en/werkgevers/glazenwassers` beginnen die met `https://www.groospersoneelsdiensten.nl/en`. | E-01-12 |
| AC-01-21 | Op `/werken-als/verhuizer` leidt een klik op EN naar `/en/werken-als/verhuizer` met `<html lang="en">` en cookie `NEXT_LOCALE=en`; een daarop volgend bezoek aan `/` wordt `/en`; een klik op NL leidt naar `/werken-als/verhuizer` met cookie `NEXT_LOCALE=nl`. Op `/vacatures?beroep=verhuizer` leidt EN naar `/en/vacatures?beroep=verhuizer`. Beide taallinks hebben een `hreflang`-attribuut. | E-01-10 |
| AC-01-22 | Vanaf stap 5, met een seedvacature: `/en/vacatures/<slug>` heeft `<link rel="canonical" href="https://www.groospersoneelsdiensten.nl/vacatures/<slug>">`, geen `<link rel="alternate" hreflang>`, een zichtbaar element met `role="note"`, de vacaturetekst in een element met `lang="nl"` en geen JSON-LD met `"@type":"JobPosting"`. `/vacatures/<slug>` heeft geen hreflang-alternatieven. | E-01-14 |
| AC-01-23 | `curl -s /over-ons \| grep -c skipLink` geeft 0: de namespace `header` zit niet in de clientpayload, terwijl `common` er wel in zit. | E-01-13, E-01-03 |
| AC-01-24 | `find 'app/[locale]' -name 'loading.tsx'` geeft niets. | E-01-17 |
| AC-01-25 | Een tijdelijke pagina `app/[locale]/fouttest/page.tsx` die een fout gooit (alleen tijdens de controle, daarna verwijderd) toont binnen header en footer `<h1>Er ging iets mis bij het laden van deze pagina</h1>`, het telefoonnummer en de knop "Probeer opnieuw". | E-01-16 |
| AC-01-26 | `/bestand.xyz` (een pad met extensie, buiten de proxy en zonder route) geeft status 404 met de tekst "Deze pagina bestaat niet" uit `global-not-found.tsx` (of de standaard-404 van Next als `globalNotFound` is vervallen, met een notitie in spec 00). | E-01-16 |
| AC-01-27 | Op elke gecontroleerde pagina is er precies één `main#inhoud`, één `header` op topniveau en één `footer` op topniveau. De eerste Tab focust "Ga direct naar de inhoud"; Enter zet de focus op `main#inhoud`. | E-01-03, E-01-16 |
| AC-01-28 | Op 390, 768, 1280 en 1440 px geldt op `/`, `/werkgevers/schoonmakers` en de 404 `document.documentElement.scrollWidth <= window.innerWidth`; op 1024 px is de header 64 px hoog (geen tweede regel). | E-01-07, E-01-21 |
| AC-01-29 | Met `prefers-reduced-motion: reduce` is `parseFloat(getComputedStyle(el).transitionDuration)` van het mobiele menuvenster hoogstens 0,00001 (seconden; Chromium geeft `1e-06s` door de globale regel van spec 02 §4.2), of is `transition-property` `none`. `grep -rl "framer-motion" components/sections/site-header.tsx components/sections/header` geeft niets. | E-01-08, E-01-21 |
| AC-01-30 | `npm run verify` slaagt; `npm run check -- --warn` meldt geen ontbrekende sleutels en geen registratiefouten; het script `typecheck` in `package.json` begint met `next typegen`. | E-01-13, E-01-19, E-01-25 |
| AC-01-31 | `/sitemap.xml` bevat `/` en `/en`, alle gepubliceerde vaste routes in beide talen met `xhtml:link` voor nl, en en x-default, en de tien beroepspagina's in beide talen; hij bevat geen `/bedankt/`, `/beheer`, `/api`, `/algemene-voorwaarden` en geen `/en/vacatures/`. | E-01-23 |
| AC-01-32 | `/llms.txt` noemt de kernroutes en de tien beroepspagina's met absolute NL-URL's en noemt geen bedankpagina's en geen `/beheer`. | E-01-23 |
| AC-01-33 | `grep -rn "<img" app components` geeft niets. | E-01-20 |
| AC-01-34 | Lighthouse (mobiel) op `/contact` en de 404 geeft voor toegankelijkheid minimaal 95; de toegankelijkheidsscan van spec 14 meldt geen fouten in header, menu, actiebalk, footer en kruimelpad. | E-01-07, E-01-08, E-01-11 |
| AC-01-35 | Het verslag van elke sub-agent uit §9 noemt 2 tot 4 kandidaten met id, naam en preview-URL en een gemotiveerde keuze; per plek is `get_component` hoogstens één keer aangeroepen. | E-01-24 |
| AC-01-36 | `grep -rnE "\"(glazenwassers\|schoonmakers\|logistiek-medewerkers\|verhuizers\|hulpkrachten-bouw-en-sloop)\"" app components lib content --include=*.ts --include=*.tsx` vindt alleen `content/beroepen/index.ts`, en K2 van spec 14 meldt niets. | E-01-05 |
| AC-01-37 | `grep -rnE "href=\"/(vacatures\|inschrijven\|werkzoekenden\|werkgevers\|over-ons\|contact\|privacyverklaring\|cookieverklaring\|klachtenregeling\|algemene-voorwaarden\|bedankt)" app components` vindt niets, en `app/sitemap.ts` en `app/llms.txt/route.ts` importeren `@/lib/routes`. | E-01-06 |
| AC-01-38 | `docs/21st-keuzes.md` heeft een sectie "Spec 01" met per plek uit §9 twee tot vier kandidaten, de keuze en de aanpassingen; `get_component` is per plek hoogstens één keer aangeroepen. | E-01-24 (R-16) |
| AC-01-39 | `curl -s -o body.html -w "%{http_code}" http://localhost:3000/vacatures/onzin` en hetzelfde voor `/en/vacatures/onzin` geven 404, en `body.html` bevat een `<h1` met "Deze pagina bestaat niet of niet meer" (EN: "This page does not exist or no longer exists"). `/vacatures/bestaat-niet-999999` en `/en/vacatures/bestaat-niet-999999` geven 404 met `<meta name="robots" content="noindex"/>`, en in de browser (Playwright, JavaScript aan) staat dezelfde h1 binnen header en footer. Een eenheidstest toont dat `isKnownPath` waar geeft voor elk pad uit het routescript van §10 stap 16 en onwaar voor de paden uit AC-01-02. | E-01-16 |

## 12 Open vragen en aannames

| Onderwerp | Aanname in deze spec | Bevestigt | Wat verandert als het anders is |
|---|---|---|---|
| 1. Sessieverversing in `/beheer` | Besloten in B-38. `/beheer` gaat via de tweede matcher van `proxy.ts` naar `beheerProxy()` uit `app/beheer/_lib/proxy.ts` (stub in stap 3, inhoud spec 08), zonder next-intl, geo-redirect of `NEXT_LOCALE` (§4.12). | besloten (B-38) | Geen; gesloten. |
| 2. Headerknop per doelgroep | "Schrijf je in" (`common.cta.register`) op werkzoekendenpagina's, "Personeel aanvragen" (`common.cta.requestStaff`) op werkgevers- en algemene pagina's. | Djulan | Eén vaste knop: `headerCtaFor` geeft altijd `personeelAanvragen`; `HeaderCta` wordt een server component. |
| 3. Actiebalk op een vacature | "Bel ons" en "Solliciteer direct" (anker `#solliciteren`) in plaats van WhatsApp; de WhatsApp-knop met vooringevulde vacaturetekst staat in de pagina (spec 06 en 07, B-17). | Djulan, Jimmy | Variant `vacature` toont dan WhatsApp; spec 06 hoeft geen anker `#solliciteren` te leveren. |
| 4. Werkgebied in JSON-LD | `areaServed` is Den Haag; Haaglanden pas na claim `workArea` (B-43). | Jimmy en Lorenzo | Bevestigen zij het werkgebied, dan voegen `employmentAgencyLd` en `serviceLd` Haaglanden toe (spec 12); `site.areaServed` blijft gelijk. |
| 5. KvK, btw en postcode | Onbekend; `TODO` in `lib/site.ts`. KvK en btw staan niet in het contactblok maar in de registratieregel van `FooterLegal` (spec 09). KvK moet vóór livegang op de site staan. | Jimmy | Alleen `lib/site.ts`. |
| 6. WhatsApp van Lorenzo | Alleen het hoofdnummer (Jimmy) is WhatsApp (B-21); Lorenzo `whatsapp: false`. | Lorenzo | Alleen `people`. |
| 7. Rollen van Jimmy en Lorenzo | `TODO` in `common.people.<id>.role`. | Jimmy en Lorenzo | Alleen messages. |
| 8. Kantoortijden | Niet op de site tot B-22 bevestigd is; `contact.openingHours` is `undefined`. | Jimmy | `contact.openingHours` vullen; de footer toont `common.contact.officeHoursValue`. |
| 9. `global-not-found.tsx` | Experimentele functie van Next 16.3.8 die de documentatie aanraadt bij meerdere root-layouts en een root-layout onder een dynamisch segment. | Djulan | Weglaten: standaard-404 van Next buiten de proxy. |
| 10. Engelse paden | Nederlandse paden ook onder `/en` (B-03). | Djulan | Met `pathnames` in `i18n/routing.ts`: `ROUTES` krijgt per taal een pad, sitemap en taalknop gaan via `getPathname`. |
| 11. Botlijst | Uitgebreid met `google`, `inspectiontool`, `headless`, `vercel`, berichtendiensten en zoekmachines, zodat ook de Rich Results Test en previews nooit omgeleid worden. | Djulan | Alleen de regex in `proxy.ts`. |
| 12. Merknaam in titels | `contact.shortName` is "Groos Personeelsdiensten"; scheidingsteken `\|`. | Djulan, spec 03 en 12 | Alleen `contact.shortName` of `meta.titleTemplate`. |
| 13. Domein en e-mail | `www.groospersoneelsdiensten.nl` en `info@groospersoneelsdiensten.nl` (B-02), gemarkeerd met `TODO bevestigen`. | Jimmy | Alleen `lib/site.ts`. |
| 14. Header, footer en `<main>` in de layout | Pagina's renderen geen `SiteHeader`, `SiteFooter` of `<main>`; specs 04 tot en met 09 geven fragmenten van secties terug. | kruiscontrole | Rendert een paginaspec ze toch, dan ontstaan dubbele landmarks (AC-01-27 faalt). |
| 15. Beroepsnamen | Spec 05 gebruikt de sleutels `beroepen.<id>.enkelvoud` en `beroepen.<id>.meervoud` en zet de slugs niet opnieuw in `content/beroepen/<id>.ts`. | spec 05, kruiscontrole | Andere sleutelnamen: alleen `lib/navigation.ts` en de skeletten. |
| 16. hreflang op vacaturedetails | `pageMetadata()` krijgt van spec 12 de opties `languages: false` (alternatieven weglaten) en `canonical: { locale, path }` (afwijkende canonical), spec 12 §4.2. | spec 12 | Andere optienamen: alleen de aanroep in spec 06. |
| 17. Footer-vermeldingen | `FooterLegal` van spec 09: server component zonder props in `components/legal/footer-legal.tsx`, in de onderbalk van `SiteFooter`. | spec 09 | Andere vorm: alleen de aanroep in `SiteFooter`. |
| 18. Socials | Nog geen kanalen; de footer toont niets. | Jimmy en Lorenzo | `socials` vullen. |
| 19. Engelse naam van hulpkracht bouw en sloop | Gesloten: "Construction and demolition labourer" (spec 05, `beroepen.hulpkracht-bouw-en-sloop.enkelvoud` in `messages/en/beroepen.json`). | gesloten | Geen. |
| 20. Indeling van messages | Gesloten: één JSON-bestand per namespace in `messages/nl/<namespace>.json` en `messages/en/<namespace>.json`; `messages/<locale>/index.ts` voegt de namespaces samen en is de bron voor `i18n/request.ts` en het type in `global.d.ts` (B-45, eigenaar 01). | gesloten (B-45) | Geen. |
| 21. 404 zonder database via de proxy | Volgt B-55: `proxy.ts` herschrijft paden waarvoor `isKnownPath` onwaar geeft met status 404 naar `/<locale>/pagina-niet-gevonden`, zodat de 404-inhoud in de server-HTML staat; een 404 die van de database afhangt, blijft `notFound()` in de pagina en krijgt zijn inhoud pas in de browser (Next 16.3, §4.12 en §4.13). | Djulan (B-55) | Rendert een latere Next-versie `notFound()` na een `await` weer op de server, dan kan `withNotFound` vervallen en is `[...rest]` weer alleen `notFound()`. |

Afwijkingen van de beslissingslog: geen. Het gedrag van `/beheer` in `proxy.ts` volgt B-38.
