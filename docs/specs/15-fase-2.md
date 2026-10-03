# 15 Fase 2: jobalert, feeds, regiopagina's, Engelse vacatures en uitbreidingen

| Status | Fase | Hangt af van | Bronnen |
|---|---|---|---|
| concept, ter goedkeuring aan Djulan | 2 (niets hiervan wordt in de bouwsessie van fase 1 gebouwd) | 06 (vacaturepagina's, `VacancyCard`, `VacancyList`, `VacancyEmptyState`, `VacancyRegisterPrompt`, namespace `vacatures`), 12 (`pageMetadata()`, `alternatesFor`, `jobPostingLd`, `jobDescriptionHtml`, `serviceLd`, `faqLd`, sitemap, `llms.txt`), 10 (tabellen, view `public_vacancies`, `lib/data/*`, `revalidateVacancies`, cron-patroon), 08 (shell, `withAdmin`, `requireAdmin`, `_strings.ts`, componenten), 07 (veldcomponenten, `guardSubmission`, `FormState`), 01 (`lib/routes.ts`, `proxy.ts`, `i18n/*`), 09 (privacyteksten), 11 (`emails/*`, `lib/email/*`), 13 (`vercel.ts`, `.env.example`, BotID, WAF), 14 (testopzet) | context/10 §1, §2, §3, §4, §7; context/11 §2.4, §2.5, §4.10 tot en met §4.12, §6.6, §7.4, §8, §9.2 tot en met §9.4, §10; context/08 §4.5 en §6.11; context/02; context/research/lokaal-en-niche.md; bijlagen/samenvattingen/context-10, -11, -13, -research; 00 §3.2 (B-03, B-07, B-08, B-09, B-15, B-19, B-20, B-27, B-35, B-37); `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md`, `.../04-functions/after.md`, `.../04-functions/revalidatePath.md`, `.../02-guides/caching-without-cache-components.md` |

## 1 Doel

Deze spec beschrijft alles wat na de livegang van fase 1 bij de site en het beheer van Groos komt: een jobalert met dubbele opt-in, meldingen aan de Google Indexing API, vacaturefeeds voor portalen die echt werken, regiopagina's onder `/regio/[plaats]`, Engelse vacatureteksten, kandidaatpagina's in het Turks, Bulgaars, Pools en Roemeens, een talentpool, CSV-export, de beheerschermen die fase 1 bewust wegliet (instellingen, gebruikers, mijn profiel, sjablonen, privacyverzoeken, logboek) en inloggen met een passkey. Elk onderdeel is een zelfstandig bouwpakket met eigen startvoorwaarden, datamodelwijziging, routes, schermen, e-mails, SEO-gevolgen en acceptatiecriteria, zodat Djulan per onderdeel kan beslissen of en wanneer het gebouwd wordt. Niets uit deze spec blokkeert fase 1 (R-20): er komen geen tabellen, routes of sleutels van deze spec in de bouwsessie van fase 1, en elk onderdeel werkt eerst op localhost tegen `groos-dev` voordat het naar productie gaat (R-17).

## 2 Gebruikers en scenario's

**Werkzoekende**

1. S-15-01 Een schoonmaker ziet op `/vacatures?beroep=schoonmaker&plaats=rijswijk` geen passend werk. Onder de lege staat tikt ze op "Maak een jobalert". Op `/jobalert` staan Schoonmaker en Rijswijk al aangevinkt; ze vult haar e-mailadres in, kiest "Eén keer per week" en krijgt een mail om te bevestigen.
2. S-15-02 Na het bevestigen krijgt ze op maandag een mail met twee nieuwe vacatures. Onderaan staat "Jobalert aanpassen"; daar zet ze de frequentie op elke dag of meldt ze zich met één klik af.
3. S-15-03 Een expat opent `/en/vacatures/window-cleaner-den-haag-1001`. De hele vacature staat in het Engels, Google toont hem in het Engels in de vacatureresultaten en de Nederlandse versie verwijst met hreflang naar deze pagina.
4. S-15-04 Een Turkssprekende Hagenaar uit Laak kiest in de taalkeuze "Türkçe". Hij leest `/tr/werkzoekenden` en `/tr/werken-als/verhuizer` in het Turks, ziet de vacatures met Turkse labels en Nederlandse vacaturetekst, en schrijft zich in via `/tr/inschrijven`.
5. S-15-05 Een orderpicker uit Naaldwijk zoekt "werk westland". Hij landt op `/regio/westland` met de open vacatures in het Westland, echte informatie over waar en hoe laat het werk is, en een knop voor een jobalert in die regio.

**Werkgever**

6. S-15-06 Een werkgever merkt niets van fase 2, behalve dat vacatures die Groos voor hem invult sneller in Google for Jobs staan en ook op Jooble verschijnen.

**Beheerder**

7. S-15-07 Lorenzo publiceert een vacature. Binnen een kwartier meldt de site de URL aan Google met `URL_UPDATED`; in Instellingen ziet hij dat de melding is verstuurd.
8. S-15-08 Jimmy maakt een nieuwe vacature met het sjabloon "Glazenwasser met ervaring op hoogte". Na het kiezen van plaats, uurloon en contactpersoon kan hij publiceren.
9. S-15-09 Jimmy nodigt een nieuwe medewerker uit vanuit `/beheer/gebruikers`. Die krijgt een mail, stelt een wachtwoord in en koppelt een authenticator-app.
10. S-15-10 Een oud-sollicitant vraagt per mail om verwijdering. Lorenzo registreert het verzoek in `/beheer/privacy`, zoekt op e-mailadres, ziet wat er wordt verwijderd, typt VERWIJDEREN en markeert het verzoek als afgehandeld.
11. S-15-11 Bij een nieuwe vacature voor schoonmakers ziet Jimmy op de bewerkpagina vijf kandidaten uit de talentpool die toestemming gaven om benaderd te worden. Hij belt de eerste vanuit het beheer.
12. S-15-12 Jimmy exporteert de sollicitaties van september als CSV voor zijn administratie. Hij bevestigt een waarschuwing en de export komt in het logboek.
13. S-15-13 Jimmy logt in met Face ID op zijn telefoon in plaats van een code uit de authenticator-app.

**Zoekmachine en portaal**

14. S-15-14 Jooble haalt elke dag `/feeds/jooble.xml` op en ziet alleen open vacatures met een link naar de vacaturepagina en de UTM-code `utm_source=jooble`.

## 3 Scope

### 3.1 Eisen per onderdeel

Onderdeelcodes: **IX** Indexing API, **JA** jobalert, **BH** beheer-uitbreidingen, **TP** talentpool, **EN** Engelse vacatures, **FD** feeds, **RG** regiopagina's, **TL** extra talen, **PK** passkeys.

| Id | Onderdeel | Eis | Dient |
|---|---|---|---|
| E-15-01 | alle | Geen enkel onderdeel van deze spec is nodig voor fase 1; elk onderdeel heeft een eigen migratie, eigen routes en eigen acceptatiecriteria en kan los worden gebouwd, gedeployed en uitgezet. | R-20 |
| E-15-02 | alle | Elk onderdeel start pas als de startvoorwaarden uit §3.3 vervuld zijn en Djulan het onderdeel vrijgeeft; de bouw-agent noteert de vrijgave in spec 00. | R-20, R-12 |
| E-15-03 | IX | Bij publiceren, sluiten, offline halen en archiveren van een vacature komt automatisch een melding in de wachtrij `indexing_notifications`; een cron-route stuurt die naar de Google Indexing API met een serviceaccount, binnen een eigen dagplafond van 180 meldingen. | R-10 |
| E-15-04 | IX | De Indexing API draait alleen op productie, alleen als `GOOGLE_INDEXING_SERVICE_ACCOUNT` gezet is en `settings.indexing_enabled` waar is; zonder die drie wordt een melding `skipped`. | R-10, R-17 |
| E-15-05 | JA | `/jobalert` laat een werkzoekende een jobalert maken met beroepen (minimaal één), plaatsen (optioneel), uren per week (optioneel), frequentie (dagelijks of wekelijks), e-mailadres en een verplicht toestemmingsvinkje. | R-02, R-11 |
| E-15-06 | JA | Een jobalert is pas actief na dubbele opt-in: een bevestigingsmail met een link die zeven dagen geldig is en een bevestigknop op de pagina (geen bevestiging bij alleen openen). Onbevestigde aanmeldingen verdwijnen na zeven dagen. | R-11 |
| E-15-07 | JA | Een dagelijkse cron stuurt per actieve jobalert een mail met alleen nieuwe, open, passende vacatures die die jobalert nog niet ontving; geen nieuwe vacatures betekent geen mail. | R-02 |
| E-15-08 | JA | Elke jobalertmail heeft een link om aan te passen en af te melden en de headers `List-Unsubscribe` en `List-Unsubscribe-Post` voor afmelden met één klik; afmelden verwijdert de jobalert direct. | R-11 |
| E-15-09 | JA | Na twaalf maanden vraagt de site opnieuw om bevestiging; zonder bevestiging binnen dertig dagen wordt de jobalert verwijderd. | R-11 |
| E-15-10 | JA | De lege staat en de inschrijfoproep op `/vacatures` en de regiopagina's tonen `JobAlertPrompt` met een link naar `/jobalert` met de actieve filters als voorinvulling. | R-01, R-02 |
| E-15-11 | BH | `/beheer/gebruikers` (eigenaar): uitnodigen, uitnodiging opnieuw sturen, rol wijzigen, deactiveren en heractiveren, tweestapsverificatie resetten; er blijft altijd minstens één actieve eigenaar. | R-03, R-11 |
| E-15-12 | BH | `/beheer/profiel` (iedere beheerder): naam, weergavenaam, telefoon, WhatsApp, foto, meldingsvoorkeuren, wachtwoord wijzigen, passkeys (als PK gebouwd is) en overal uitloggen. | R-03 |
| E-15-13 | BH | `/beheer/instellingen` (eigenaar) met de tabel `settings`: jobalerts pauzeren, Indexing API aan of uit met de laatste meldingen, feeds per portaal aan of uit met kopieerbare URL, en de bewaartermijnen ter inzage. | R-03, R-10 |
| E-15-14 | BH | `/beheer/sjablonen`: sjablonen per beroep aanmaken, bewerken, dupliceren en verwijderen; "Nieuwe vacature" en "Opslaan als sjabloon" gebruiken ze. | R-03 |
| E-15-15 | BH | `/beheer/privacy` (eigenaar): verzoekenregister met termijn van een maand, zoeken op e-mail of telefoon over alle tabellen met persoonsgegevens, inzage-export als JSON, verwijderen na het typen van VERWIJDEREN, en de lijst "Binnenkort verwijderd". | R-11 |
| E-15-16 | BH | `/beheer/logboek` (eigenaar): `audit_log` met filters op beheerder, actie en periode, 50 regels per pagina. | R-11 |
| E-15-17 | BH | CSV-export van vacatures (iedere beheerder), sollicitaties, aanvragen, talentpool en logboek (alleen eigenaar), met waarschuwing, logboekregel `export.csv`, UTF-8 met BOM, puntkomma als scheidingsteken en bescherming tegen formules. | R-03, R-11 |
| E-15-18 | TP | De tabel `candidates` vult zich automatisch uit sollicitaties en inschrijvingen met toestemming om een jaar te bewaren; zonder toestemming komt niemand in de talentpool. | R-11 |
| E-15-19 | TP | `/beheer/talentpool` met lijst, filters, detail, notities, toestemming vernieuwen en intrekken; de bewerkpagina van een vacature toont maximaal tien passende kandidaten. | R-03 |
| E-15-20 | TP | Een kandidaat verdwijnt automatisch 365 dagen na de laatste toestemming; intrekken verwijdert de kandidaat direct, zet de gekoppelde sollicitaties op een vacature terug op de termijn van vier weken en anonimiseert een gekoppelde inschrijving direct. | R-11 |
| E-15-21 | EN | Een beheerder kan per vacature een Engelse tekst invullen en publiceren; publiceren vraagt een volledige tekst en de verklaring dat een mens de vertaling schreef of controleerde. Er is geen automatische vertaling. | R-13, R-07 |
| E-15-22 | EN | Een vacature met gepubliceerde Engelse tekst heeft op `/en/vacatures/<engelse-slug>` eigen inhoud, een canonical naar zichzelf, wederzijdse hreflang met de Nederlandse versie, een Engelse `JobPosting` en een plek in de sitemap; zonder Engelse tekst blijft het gedrag van spec 06. | R-10, R-13 |
| E-15-23 | FD | `/feeds/<portaal>.xml` levert een XML-feed met alleen open vacatures voor de portalen `jooble`, `werkzoeken`, `uitzendbureau-nl` en `indeed`, elk alleen als het in `settings.feeds_enabled` aan staat; anders 404. | R-02, R-10 |
| E-15-24 | FD | De Indeed-feed gaat alleen aan bij een gesponsorde campagne met budget van Jimmy; gratis bereik via een Indeed-feed bestaat niet meer (B-27). | R-12 |
| E-15-25 | RG | `/regio/[plaats]` bestaat alleen voor regio's die in het register `content/regio` op `gepubliceerd` staan, en dat mag pas als de drempel uit §3.3 gehaald is en de tekst echte, geverifieerde lokale feiten bevat. | R-09, R-12 |
| E-15-26 | RG | Een regiopagina toont de live vacatures van de plaatsen in die regio, lokale werkgebieden, bereikbaarheid, beroepen, een FAQ en een jobalertknop, met `BreadcrumbList`, `Service` met `areaServed` en `FAQPage`. | R-01, R-09 |
| E-15-27 | TL | Turks, Bulgaars, Pools en Roemeens worden per taal apart geactiveerd, alleen voor de kandidaatpagina's uit `PARTIAL_SCOPE`, alleen met een menselijke vertaling en alleen als Groos kandidaten in die taal kan bedienen. Andere paden geven in die talen een 404. | R-13, R-07, R-12 |
| E-15-28 | TL | Een gedeeltelijke taal krijgt nooit een geo-omleiding; de bezoeker kiest hem zelf in de taalkeuze. Hreflang en sitemap noemen een gedeeltelijke taal alleen op paden binnen de scope. | R-09, R-13 |
| E-15-29 | PK | Een beheerder kan in Mijn profiel een passkey toevoegen en ermee inloggen, zodra Supabase passkeys algemeen beschikbaar maakt en een passkey-sessie `aal2` oplevert; TOTP blijft altijd als terugval bestaan. | R-03, R-11 |
| E-15-30 | alle | Geen nieuwe npm-packages (B-37): de JWT voor Google gaat met `node:crypto`, CSV en XML worden zelf opgebouwd. | R-19 |
| E-15-31 | alle | Nieuwe sitetekst staat in de namespaces `jobalert` en `regio` en in `content/regio/*`, gespiegeld in alle talen, volgens spec 03 (je-vorm, B1, geen uitroeptekens, geen streepjes in zinnen, geen onbevestigde claims). | R-07, R-08, R-12 |
| E-15-32 | JA, RG | De bouw-agent zet voor het jobalertformulier en de regiohero een sub-agent in die via 21st.dev kandidaten zoekt (§9). | R-16 |
| E-15-33 | alle | Elk onderdeel is op localhost tegen `groos-dev` te testen; cron-routes accepteren buiten productie de parameter `force=1`. | R-17 |
| E-15-34 | BH | Op werkdagen stuurt `/api/cron/herinneringen` één interne mail aan beheerders met `notify_applications` over sollicitaties en inschrijvingen die 8 weken geen contact hadden (B-07), elke sollicitatie één keer, zonder mail als er niets is; `maxDuration` 60. | R-03, R-11 |

### 3.2 Niet in deze spec

WhatsApp-meldingen via de WhatsApp Business API, pushmeldingen en een installeerbare app met meldingen, kandidaat-accounts, cv-parsing en matching op tekst, een koppeling met een ATS of salarissysteem, Arabisch (rechts-naar-links), een dagelijkse samenvatting voor beheerders, een tijdelijke melding op de site, beroepen en locaties beheren in het beheer, zoeken op postcode met straal, en een aparte vacaturesitemap (die komt pas boven 1.000 open vacatures, spec 12). Een jobalertvinkje in het sollicitatieformulier komt er niet, omdat toestemming voor marketingmail los moet staan van solliciteren (context/09).

### 3.3 Startvoorwaarden per onderdeel

| Onderdeel | Voorwaarden om te starten (allemaal waar) | Wie bevestigt |
|---|---|---|
| IX Indexing API | 1. De site staat live op `https://www.groospersoneelsdiensten.nl` (spec 13). 2. De domeineigenschap staat in Search Console en is geverifieerd (spec 13 G1). 3. De Rich Results Test geeft op minstens drie open vacatures een geldige `JobPosting` zonder fouten. 4. Jimmy maakt een Google Cloud-project "groos-indexing" in een Google-account van Groos. 5. Onderdeel BH-instellingen is gebouwd (voor `settings.indexing_enabled`), of de bouw-agent bouwt dat tabblad als eerste. | Djulan, Jimmy |
| JA Jobalert | 1. Fase 1 is live en de bevestigingsmails van spec 11 komen aan (SPF, DKIM, DMARC in orde). 2. Gemiddeld minstens vijf nieuwe vacatures per maand over de laatste drie maanden (anders zijn er te weinig mails om aanmelden zinvol te maken). 3. Resend Pro (20 dollar per maand) zodra het aantal actieve jobalerts boven 80 komt, omdat het gratis plan 100 mails per dag toestaat. 4. De jurist keurt de tekst voor de privacyverklaring (sectie `#jobalert`) en de toestemmingszin goed. | Djulan, Jimmy, jurist |
| BH Beheer | 1. Fase 1 is live. 2. Resend werkt als SMTP voor Supabase Auth (spec 13), nodig voor uitnodigen. 3. Voor privacyverzoeken: de jurist bevestigt de termijnen en de werkwijze uit spec 09. | Djulan, jurist |
| TP Talentpool | 1. Minstens 25 sollicitaties of inschrijvingen met toestemming in de laatste drie maanden. 2. De privacyverklaring noemt de talentpool al (spec 09, V-02); de jurist bevestigt dat automatisch opnemen past. | Jimmy en Lorenzo, jurist |
| EN Engelse vacatures | 1. Jimmy en Lorenzo willen Engelstalige kandidaten bedienen en kunnen ze in het Engels te woord staan. 2. Minstens drie vacatures per maand waarvoor Nederlands op de werkvloer niet nodig is. 3. Iemand schrijft of controleert de Engelse teksten (geen machinevertaling). | Jimmy en Lorenzo |
| FD Feeds | Per portaal: Jooble zonder voorwaarde (gratis opname, controleren of de feed na twee weken vacatures oplevert); Werkzoeken.nl alleen bij minstens 25 open vacatures (onder 25 neemt het portaal de feed niet op); Uitzendbureau.nl alleen met een betaald abonnement dat Jimmy afsluit; Indeed alleen met een gesponsorde campagne en budget dat Jimmy vastlegt. Werk.nl en Nationale Vacaturebank blijven handwerk. | Jimmy |
| RG Regiopagina's | Per regio: 1. Minstens vijf vacatures gepubliceerd in de laatste 90 dagen met een plaats in die regio en minstens twee daarvan nu open (`npm run regio:check`). 2. Minstens drie lokale feiten die Jimmy of Lorenzo bevestigt (waar het werk is, hoe je er komt, welke beroepen), elk met bron in het contentbestand. 3. Jimmy of Lorenzo keurt de tekst goed. | Jimmy en Lorenzo, Djulan |
| TL Extra talen | Per taal: 1. Iemand van Groos (of een vaste, afgesproken tolk) beantwoordt telefoon en WhatsApp in die taal op werkdagen. 2. Groos bevestigt schriftelijk wat het wel en niet regelt rond huisvesting en vervoer, zodat de tekst daar eerlijk over is. 3. Budget voor een professionele vertaler en een controle door een moedertaalspreker. 4. Minstens drie open vacatures per maand waarvoor Nederlands op de werkvloer niet nodig is. Volgorde volgens research: Turks, Bulgaars, Pools, Roemeens. | Jimmy en Lorenzo |
| PK Passkeys | 1. Supabase meldt passkeys als algemeen beschikbaar (niet meer in bèta). 2. De documentatie of een test op `groos-dev` toont dat een sessie na inloggen met een passkey `aal: "aal2"` heeft, zodat `is_admin()` van spec 10 toegang geeft. | Djulan |

### 3.4 Prioriteit en schatting

Schatting voor één ontwikkelaar met AI-ondersteuning, in werkdagen, exclusief tekst die Groos of een vertaler aanlevert.

| Volgorde | Onderdeel | Waarom op deze plek | Schatting |
|---|---|---|---|
| 1 | IX Indexing API, plus het tabblad Instellingen uit BH | Klein en direct effect op Google for Jobs, de grootste gratis bron van sollicitaties (context/10 §4). | 1,5 |
| 2 | BH Beheer: gebruikers, mijn profiel, logboek, CSV-export | Nodig zodra er een derde gebruiker komt en voor de verantwoording van het logboek. | 2,5 |
| 3 | BH Beheer: privacyverzoeken en binnenkort verwijderd | Wettelijke verplichting; nu loopt het via Djulan en de SQL-editor (spec 09). | 2 |
| 4 | JA Jobalert | Houdt werkzoekenden vast als er even geen passend werk is. | 3,5 |
| 5 | BH Beheer: sjablonen | Scheelt tijd bij herhaalde vacatures. | 1 |
| 6 | TP Talentpool | Zinvol zodra er genoeg kandidaten met toestemming zijn. | 2,5 |
| 7 | EN Engelse vacatures | Alleen bij echte vraag van Engelstalige kandidaten. | 3,5 |
| 8 | FD Feeds | Per portaal klein; Jooble eerst. | 1 plus 0,5 per portaal |
| 9 | RG Regiopagina's | Pas bij structureel vacatures in een regio. | 1,5 plus 0,5 per regio |
| 10 | TL Extra talen | Pas als Groos de taal kan bedienen. | 2,5 plus 0,5 per taal |
| 11 | PK Passkeys | Afhankelijk van Supabase. | 1 |
| | **Totaal** | | **ongeveer 25 tot 30 dagen** |

## 4 Pagina's en componenten

### 4.1 Overzicht van routes

| Route | Bestand | Onderdeel | Rendering | Index |
|---|---|---|---|---|
| `/jobalert` | `app/[locale]/jobalert/page.tsx` | JA | dynamisch (`searchParams` voor voorinvulling) | ja; met query `noindex, follow` en canonical `/jobalert` |
| `/jobalert/aangemeld` | `app/[locale]/jobalert/aangemeld/page.tsx` | JA | statisch | `noindex, follow` |
| `/jobalert/bevestigen?token=` | `app/[locale]/jobalert/bevestigen/page.tsx` | JA | dynamisch | `noindex, nofollow`, `referrer: no-referrer` |
| `/jobalert/beheren?token=` | `app/[locale]/jobalert/beheren/page.tsx` | JA | dynamisch | `noindex, nofollow`, `referrer: no-referrer` |
| `/jobalert/afgemeld` | `app/[locale]/jobalert/afgemeld/page.tsx` | JA | statisch | `noindex, follow` |
| `/api/jobalert/afmelden?token=` | `app/api/jobalert/afmelden/route.ts` (GET en POST) | JA | dynamisch | buiten proxy |
| `/api/cron/jobalerts` | `app/api/cron/jobalerts/route.ts` | JA | dynamisch | buiten proxy |
| `/api/cron/indexing` | `app/api/cron/indexing/route.ts` | IX | dynamisch | buiten proxy |
| `/api/cron/onderhoud-fase2` | `app/api/cron/onderhoud-fase2/route.ts` | JA, TP, BH, IX | dynamisch | buiten proxy |
| `/api/cron/herinneringen` | `app/api/cron/herinneringen/route.ts` | BH | dynamisch | buiten proxy |
| `/feeds/<portaal>.xml` | `app/feeds/[portaal]/route.ts` | FD | ISR 3600 | `X-Robots-Tag: noindex` |
| `/regio/[plaats]` | `app/[locale]/regio/[plaats]/page.tsx` | RG | ISR 3600, `dynamicParams = false` | ja |
| `/en/vacatures/<engelse-slug>` | bestaande `app/[locale]/vacatures/[slug]/page.tsx` (spec 06), uitgebreid | EN | ISR 3600 | ja, met eigen canonical |
| `/tr/...`, `/bg/...`, `/pl/...`, `/ro/...` | bestaande pagina's binnen `PARTIAL_SCOPE` | TL | zoals de NL-pagina | ja binnen de scope |
| `/beheer/instellingen` | `app/beheer/(app)/instellingen/page.tsx` | BH | ongecachet | noindex (spec 08) |
| `/beheer/gebruikers` | `app/beheer/(app)/gebruikers/page.tsx` | BH | idem | idem |
| `/beheer/profiel` | `app/beheer/(app)/profiel/page.tsx` | BH, PK | idem | idem |
| `/beheer/sjablonen`, `/nieuw`, `/[id]` | `app/beheer/(app)/sjablonen/**` | BH | idem | idem |
| `/beheer/privacy`, `/beheer/privacy/verzoeken/[id]` | `app/beheer/(app)/privacy/**` | BH | idem | idem |
| `/beheer/privacy/inzage` | `app/beheer/privacy/inzage/route.ts` (POST) | BH | dynamisch | idem |
| `/beheer/logboek` | `app/beheer/(app)/logboek/page.tsx` | BH | idem | idem |
| `/beheer/export/[soort]` | `app/beheer/export/[soort]/route.ts` (POST) | BH | dynamisch | idem |
| `/beheer/talentpool`, `/beheer/talentpool/[id]` | `app/beheer/(app)/talentpool/**` | TP | idem | idem |
| `/beheer/jobalerts` | `app/beheer/(app)/jobalerts/page.tsx` | JA | idem | idem |

Statische segmenten gaan voor `[locale]`, dus `/beheer/*` en `/feeds/*` komen nooit in de publieke layout. De proxy-matcher van spec 01 sluit `api`, `beheer`, `feeds` en het BotID-pad al uit; daar verandert niets aan, behalve de tak voor `/beheer` (spec 08 §4.13, B-38) en de gedeeltelijke talen.

Aanvullingen in `lib/routes.ts` (eigenaar spec 01; deze spec levert de waarden): `ROUTES.jobalert = "/jobalert"`; `AppPath` krijgt `` `/jobalert${string}` `` en `` `/regio/${string}` ``; `paths.regio(slug: string): AppPath` en `paths.jobalert(prefill?: { beroep?: OccupationSlug[]; plaats?: string[] }): AppPath` (bouwt `/jobalert?beroep=..&plaats=..` met herhaalde parameters); `STATIC_ROUTES` krijgt `{ path: "/jobalert", audience: "werkzoekende", owner: "15", published: true, sitemap: { priority: 0.4, changeFrequency: "yearly" }, llms: "kern" }` (het type `owner` krijgt `"15"`); `audienceFor` rekent `/jobalert*` en `/regio/*` tot `werkzoekende`.

### 4.2 IX Indexing API

Geen pagina's. Bestanden:

| Bestand | Inhoud |
|---|---|
| `lib/google/indexing.ts` (`import "server-only"`) | serviceaccount lezen, token halen, melding versturen, wachtrij legen |
| `app/api/cron/indexing/route.ts` | `GET`, patroon van spec 10 §4.6 met `verifyCronRequest()`, `dynamic = "force-dynamic"`, `maxDuration = 60` |

```ts
// lib/google/indexing.ts
import "server-only";
export type IndexingType = "URL_UPDATED" | "URL_DELETED";
export type ServiceAccount = { client_email: string; private_key: string };
/** Leest GOOGLE_INDEXING_SERVICE_ACCOUNT (base64 van het JSON-sleutelbestand); null als hij ontbreekt of ongeldig is. */
export function readServiceAccount(): ServiceAccount | null;
/** JWT met RS256 via node:crypto createSign("RSA-SHA256"); claims iss = client_email,
 *  scope = "https://www.googleapis.com/auth/indexing", aud = "https://oauth2.googleapis.com/token",
 *  iat = nu, exp = nu + 3600. POST naar https://oauth2.googleapis.com/token met
 *  grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer en assertion=<jwt>.
 *  Het token wordt op modulescope bewaard tot 60 seconden voor exp. */
export async function getIndexingAccessToken(sa: ServiceAccount): Promise<string>;
/** POST https://indexing.googleapis.com/v3/urlNotifications:publish met body { url, type }. */
export async function publishUrlNotification(url: string, type: IndexingType): Promise<{ status: number; error?: string }>;
export const INDEXING_DAILY_CAP = 180;      // Google staat standaard 200 publish-verzoeken per dag toe
export const INDEXING_BATCH = 20;           // per cron-aanroep
export async function flushIndexingQueue(opts?: { force?: boolean }): Promise<{ sent: number; failed: number; skipped: number; deferred: number }>;
```

Gedrag van `flushIndexingQueue`:

1. Leest `settings.indexing_enabled` met `createSupabaseAdminClient()`. Is die onwaar, ontbreekt het serviceaccount, of is `process.env.VERCEL_ENV !== "production"` (en geen `force`), dan worden alle rijen met status `pending` op `skipped` gezet met `last_error` `disabled`, `no_credentials` of `not_production`. Zo groeit de wachtrij op localhost niet.
2. Telt rijen met `status = 'sent'` en `sent_at > now() - interval '24 hours'`. Is dat 180 of meer, dan stopt de functie met `deferred` gelijk aan het aantal wachtende rijen.
3. Pakt de oudste `INDEXING_BATCH` rijen met `pending`. Per rij bouwt hij de URL: `absoluteUrl(localizedPath(locale, "/vacatures/" + slug))`, met de slug uit `vacancy_translations` van die taal (via de admin-client, ook bij een gearchiveerde vacature).
4. Antwoord 200: `status = 'sent'`, `sent_at = now()`, `url` en `response_status` gevuld. Antwoord 429: rij blijft `pending`, de run stopt. Antwoord 400, 403 of 404: `failed` met de fouttekst (hoogstens 500 tekens). Antwoord 5xx of netwerkfout: `attempts + 1`; bij 5 pogingen `failed`.
5. Geeft de tellers terug; de route antwoordt `{ ok: true, ...tellers, ranAt }`.

Melding in de wachtrij komt uit de database (§5.2), dus ook statuswissels door de cron van spec 10 tellen mee zonder dat spec 10 code wijzigt.

| Overgang (`vacancies.status`) | Melding | Taal |
|---|---|---|
| naar `published` (publiceren, geplande vacature gaat online, heropenen) | `URL_UPDATED` | `nl`, en `en` als er een gepubliceerde Engelse tekst is |
| `published` naar `closed` (vervuld, verlopen, ingetrokken) | `URL_UPDATED`, zodat Google de pagina zonder `JobPosting` en met `noindex` ziet | idem |
| `published` naar `draft` (offline halen) | `URL_DELETED` (de pagina geeft 404) | idem |
| `closed` naar `archived` (handmatig of na 30 dagen door `run_vacancy_lifecycle`) | `URL_DELETED` | idem |
| wijziging van een vacature of tekst terwijl de status `published` blijft | `URL_UPDATED` | de gewijzigde taal |
| Engelse tekst gepubliceerd of teruggetrokken | `URL_UPDATED` of `URL_DELETED` | `en` |

### 4.3 JA Jobalert

#### 4.3.1 `/jobalert` van boven naar beneden

```
<Breadcrumbs items={[{ label: t("jobalert.breadcrumb"), href: "/jobalert" }]} />     spec 01
<section aria-labelledby="jobalert-titel">                container max-w-2xl
  <h1 id="jobalert-titel">jobalert.page.title</h1>
  <p>jobalert.page.intro</p>
  <JobAlertForm ... />                                     client, §4.3.3
</section>
<ServiceSteps id="zo-werkt-de-jobalert" heading={jobalert.steps.title} steps={3 stappen} />   spec 05
```

Paginacode: `searchParams` wordt gelezen met `parseVacancySearchParams` van spec 10, zodat `beroep` en `plaats` dezelfde validatie krijgen als op `/vacatures`; alleen `filters.beroep`, `filters.plaats` en `filters.uren` gaan als `defaults` naar het formulier. De lijst plaatsen komt uit `getVacancyFacets({})` (`facets.plaats`, plaatsen met open vacatures), aangevuld met plaatsen uit de query die daar niet in staan (dan met hun `citySlug` als label met hoofdletter). Zijn er geen plaatsen, dan vervalt die groep en betekent de jobalert "alle plaatsen".

#### 4.3.2 Overige jobalertpagina's

| Pagina | Inhoud |
|---|---|
| `/jobalert/aangemeld` | h1 `jobalert.sent.title`, alinea `jobalert.sent.body`, alinea `jobalert.sent.noMail`, link `jobalert.sent.backLink` naar `/vacatures`. Geen e-mailadres in de URL of op de pagina. |
| `/jobalert/bevestigen?token=` | Server component zoekt de jobalert op met `findJobAlertByConfirmToken(token)`. Gevonden en geldig: h1 `jobalert.confirm.title`, alinea `jobalert.confirm.body`, samenvatting van de keuze (`JobAlertSummary`), en `JobAlertConfirmForm` met één knop. Na de actie: h1 `jobalert.confirm.doneTitle` en `doneBody`. Ongeldig of verlopen: h1 `jobalert.confirm.invalidTitle`, `invalidBody`, knop naar `/jobalert`. Openen zonder op de knop te drukken bevestigt niets, zodat linkscanners in mailprogramma's geen jobalert aanzetten. |
| `/jobalert/beheren?token=` | Zoekt op `manage_token`. Gevonden: h1 `jobalert.manage.title`, `JobAlertManageForm` (zelfde velden als het aanmeldformulier, zonder e-mail en zonder toestemmingsvinkje), daaronder h2 `jobalert.manage.unsubscribeTitle`, alinea en een knop Afmelden (`unsubscribeJobAlert`). Niet gevonden: `jobalert.manage.invalidTitle` en `invalidBody`. |
| `/jobalert/afgemeld` | h1 `jobalert.unsubscribed.title`, alinea, `CtaButton` naar `/jobalert`. |

`generateMetadata` van bevestigen en beheren zet via `pageMetadata({ ..., noindex: true })` de robots en voegt daarna `referrer: "no-referrer"` toe, zodat het token niet in een Referer-header naar een andere site gaat. Deze twee pagina's lezen `searchParams` en zijn dus dynamisch; ze gebruiken geen `loading.tsx`.

#### 4.3.3 Componenten (`components/jobalert/`)

| Naam | Bestand | S/C | Props |
|---|---|---|---|
| `JobAlertForm` | `job-alert-form.tsx` | C | `{ locale: Locale; occupations: { value: OccupationSlug; label: string }[]; places: { value: string; label: string }[]; defaults: { beroep: OccupationSlug[]; plaats: string[]; uren: HoursBucketId[] }; labels: JobAlertFormLabels }` |
| `JobAlertManageForm` | `job-alert-manage-form.tsx` | C | `{ token: string; occupations; places; values: { beroep: OccupationSlug[]; plaats: string[]; uren: HoursBucketId[]; frequency: JobAlertFrequency }; labels: JobAlertFormLabels }` |
| `JobAlertConfirmForm` | `job-alert-confirm-form.tsx` | C | `{ token: string; labels: { button: string; pending: string; doneTitle: string; doneBody: string; error: string } }` |
| `JobAlertSummary` | `job-alert-summary.tsx` | S (async) | `{ alert: JobAlertCriteria; locale: Locale }`; een `<dl>` met beroepen, plaatsen, uren en frequentie |
| `JobAlertPrompt` | `job-alert-prompt.tsx` | S (async) | `{ locale: Locale; headingId: string; prefill?: { beroep?: OccupationSlug[]; plaats?: string[] }; variant?: "block" \| "inline" }`; h2 `jobalert.prompt.title`, alinea en `CtaButton variant="secondary"` naar `paths.jobalert(prefill)` |

`JobAlertFormLabels` is een object met alle teksten uit `jobalert.form.*`, door de server als props meegegeven (spec 01 §4.11.4); de namespace `jobalert` komt dus niet in `CLIENT_NAMESPACES`.

`JobAlertForm` bouwt op de veldcomponenten van spec 07 (`components/forms/fields/*`) en `useFormBehaviour`, met `formId` `"jobAlert"`:

1. `CheckboxGroupField` `occupations` (legend `jobalert.form.legendOccupations`, hint, opties de vijf beroepen in de volgorde van `OCCUPATION_SLUGS`).
2. `CheckboxGroupField` `places` (alleen als er plaatsen zijn).
3. `CheckboxGroupField` `hours` met `HOURS_BUCKETS` en de labels `vacatures.filters.uren.options.*` van spec 06.
4. `ChoiceField` `frequency` met `weekly` (standaard) en `daily`.
5. `TextField` `email` (`type="email"`, `autoComplete="email"`, `inputMode="email"`, verplicht).
6. `CheckboxField` `consent` (verplicht, nooit vooraf aangevinkt).
7. `PrivacyNotice` met `jobalert.form.privacyNotice` (rich text met een link naar `/privacyverklaring#jobalert`).
8. `Honeypot`, `FormMeta`, `ErrorSummary`, `FormAlert`, `SubmitButton`.

Op een telefoon staan de groepen onder elkaar; vanaf `md` staan beroepen en plaatsen naast elkaar. De knop staat op volle breedte onder 640 px.

Spec 06 rendert `JobAlertPrompt` op drie plekken (één regel per plek, eigenaar blijft spec 06): in `VacancyEmptyState` als vierde uitweg met `prefill` uit de actieve filters, op `/vacatures` direct na `VacancyRegisterPrompt` met dezelfde `prefill`, en in de gesloten staat van een vacature met `prefill: { beroep: [vacancy.occupation.slug] }`. De regiopagina gebruikt hem ook (§4.8).

#### 4.3.4 Server Actions (`app/actions/job-alert.ts`, `"use server"`)

```ts
export async function submitJobAlert(prev: FormState, formData: FormData): Promise<FormState>;
export async function confirmJobAlert(prev: ConfirmState, formData: FormData): Promise<ConfirmState>;
export async function updateJobAlert(prev: FormState, formData: FormData): Promise<FormState>;
export async function unsubscribeJobAlert(formData: FormData): Promise<void>;   // redirect naar /jobalert/afgemeld
export type ConfirmState = { status: "idle" | "confirmed" | "invalid" | "error" };
```

`submitJobAlert`:

1. `formDataToRecord(formData, ["occupations", "places", "hours"])`; `guardSubmission(raw, [])` van spec 07; bij `blocked` de foutstaat `blocked`.
2. `jobAlertSchema.safeParse(raw)` (§5.6); fouten als `invalid`.
3. `settings.job_alerts_paused` waar: foutstaat `generic` met de tekst `jobalert.form.errors.paused`.
4. Normaliseren: arrays gesorteerd en ontdubbeld; e-mail in kleine letters.
5. Bestaat al een rij met hetzelfde `submission_id`: direct naar stap 9.
6. Telt rijen met dit e-mailadres: vijf of meer bevestigde jobalerts geeft veldfout `email: "tooMany"`; drie of meer onbevestigde aanmeldingen in de laatste 24 uur geeft `email: "tooManyPending"` (begrenzing tegen misbruik als mailkanon).
7. `const confirm = createToken()` en `const manage = createToken()` (`lib/jobalert/tokens.ts`). Insert via `createSupabaseAdminClient()` in `job_alerts` met `confirm_token_hash = confirm.hash`, `confirm_expires_at = now + 7 dagen`, `manage_token = manage.raw` en de overige kolommen uit §5.2. Een dubbele combinatie (unieke index op e-mail en criteria) gaat zonder fout verder naar stap 9 zonder nieuwe mail, zodat niemand kan zien of een adres al een jobalert heeft.
8. `after(() => sendJobAlertConfirmation({ jobAlertId, rawConfirmToken: confirm.raw }))`. In ontwikkeling schrijft de actie daarnaast `console.info("[jobalert] bevestigingslink:", url)`.
9. `redirect({ href: "/jobalert/aangemeld", locale })`.

`confirmJobAlert`: zoekt op `sha256(token)` met `confirm_expires_at > now()`; gevonden: `confirmed_at = now()`, `confirm_token_hash = null`, `confirm_expires_at = null`, `reconfirm_sent_at = null` en een `audit_log`-regel `job_alert.confirmed` met `actor_type = 'public'` (zonder e-mail). Niet gevonden: `invalid`.

`updateJobAlert`: zoekt op `manage_token`, valideert met `jobAlertManageSchema`, werkt criteria en frequentie bij; e-mail is niet te wijzigen (dan een nieuwe jobalert maken).

`unsubscribeJobAlert`: verwijdert de rij met dit `manage_token` (de deliveries gaan mee via `on delete cascade`), schrijft `job_alert.unsubscribed` in `audit_log` en stuurt door naar `/jobalert/afgemeld`. Een onbekend token stuurt ook door naar `/jobalert/afgemeld`; afmelden is idempotent.

`app/api/jobalert/afmelden/route.ts`: `POST` (afmelden met één klik volgens RFC 8058, body `List-Unsubscribe=One-Click`) verwijdert de jobalert met `manage_token = token` en geeft 200 met lege body; `GET` geeft een 303 naar `/<locale>/jobalert/beheren?token=...` van die jobalert (onbekend token: naar `/jobalert/afgemeld`). Beide met `Cache-Control: no-store`.

#### 4.3.5 Verzenden (`lib/jobalert/*`, alle `import "server-only"`)

```ts
// lib/jobalert/tokens.ts
export function createToken(): { raw: string; hash: string };   // raw = randomBytes(32).toString("base64url"), hash = sha256 hex
export function hashToken(raw: string): string;

// lib/jobalert/store.ts
export type JobAlertFrequency = "daily" | "weekly";
export type JobAlertCriteria = { beroep: OccupationSlug[]; plaats: string[]; uren: HoursBucketId[]; frequency: JobAlertFrequency };
export type JobAlertRow = JobAlertCriteria & { id: string; email: string; locale: AppLocale; confirmedAt: string | null; lastSentAt: string | null; manageToken: string };
export async function findJobAlertByConfirmToken(raw: string): Promise<JobAlertRow | null>;
export async function findJobAlertByManageToken(raw: string): Promise<JobAlertRow | null>;
export async function listDueJobAlerts(now: Date, opts?: { force?: boolean }): Promise<JobAlertRow[]>;

// lib/jobalert/match.ts
export const JOB_ALERT_MAX_ITEMS = 10;
export async function findNewVacanciesForAlert(alert: JobAlertRow): Promise<{ items: VacancyListItem[]; total: number }>;

// lib/jobalert/run.ts
export async function runJobAlertDigest(now: Date, opts?: { force?: boolean }): Promise<{ checked: number; mailed: number; vacanciesSent: number; failed: number }>;
export async function runJobAlertMaintenance(now: Date): Promise<{ unconfirmedDeleted: number; reconfirmSent: number; expiredDeleted: number }>;
```

Regels:

- **Wanneer verschuldigd.** `daily`: `confirmed_at` gevuld en (`last_sent_at` leeg of ouder dan 20 uur). `weekly`: alleen als het in Europe/Amsterdam maandag is, en `last_sent_at` leeg of ouder dan 6 dagen. Met `force` vervalt de tijdscontrole (alleen buiten productie).
- **Welke vacatures.** `getVacancyList({ filters: { beroep, plaats, uren }, sort: "newest", page: 1, pageSize: 48 })` van spec 10 (gecachet, dus één query voor alle jobalerts), daarna alleen items met `publishedAt > coalesce(last_sent_at, confirmed_at)` en zonder rij in `job_alert_deliveries` voor deze jobalert. Een lege `plaats` of `uren` betekent geen filter.
- **Mail.** Hoogstens `JOB_ALERT_MAX_ITEMS` vacatures, nieuwste eerst; bij meer een link `COPY.<locale>.more` (§6.6) naar `/vacatures` met dezelfde filters. Elke vacaturelink krijgt `?utm_source=jobalert&utm_medium=email&utm_campaign=<frequentie>`, zodat spec 07 de herkomst in `applications.utm` bewaart. Onder `/en` en de gedeeltelijke talen gaat de link naar de vacature in die taal (bij een Engelse tekst de Engelse slug).
- **Na een geslaagde verzending:** insert in `job_alert_deliveries` voor elke getoonde vacature en `last_sent_at = now()`. Bij een fout van Resend niets bijwerken; de volgende run probeert het opnieuw.
- **Snelheid.** Hoogstens 5 mails tegelijk; `maxDuration = 300` op de route. Bij meer dan 500 actieve jobalerts logt de route een waarschuwing (dan is een wachtrij nodig, buiten deze spec).
- **Onderhoud** (in `/api/cron/onderhoud-fase2`): onbevestigd en ouder dan 7 dagen: verwijderen. `confirmed_at` ouder dan 365 dagen en `reconfirm_sent_at` leeg: nieuw bevestigingstoken, mail `sendJobAlertReconfirm`, `reconfirm_sent_at = now()`. `reconfirm_sent_at` ouder dan 30 dagen en `confirmed_at < reconfirm_sent_at`: verwijderen. Elke verwijdering zonder persoonsgegevens in `audit_log` (`job_alert.expired`).

#### 4.3.6 E-mails

De templates staan in `emails/` en de verzendfuncties in `lib/email/job-alerts.ts`; die mappen zijn van spec 11. Deze spec levert de inhoud en de signaturen; de bouw-agent gebruikt de layoutcomponent, afzender, `reply-to` en de schrijfwijze naar `email_log` van spec 11.

```ts
// lib/email/job-alerts.ts
export async function sendJobAlertConfirmation(input: { jobAlertId: string; rawConfirmToken: string }): Promise<void>;
export async function sendJobAlertDigest(input: { jobAlertId: string; items: VacancyListItem[]; total: number }): Promise<{ ok: boolean }>;
export async function sendJobAlertReconfirm(input: { jobAlertId: string; rawConfirmToken: string }): Promise<void>;
```

| Template (naam) | Bestand | Onderwerp | Idempotentiesleutel | Inhoud |
|---|---|---|---|---|
| `job-alert-confirm` (bevestigen) | `emails/job-alert-confirm.tsx` | `COPY.<locale>.subject` | `job-alert-confirm/<jobAlertId>/<eerste 16 tekens van confirm_token_hash>` | intro, samenvatting van de keuze, knop naar `/<locale>/jobalert/bevestigen?token=`, de zin over zeven dagen geldigheid, de zin dat je de mail kunt negeren als je niets hebt aangevraagd |
| `job-alert-digest` (nieuwe vacatures) | `emails/job-alert-digest.tsx` | `COPY.<locale>.subject` met `count` via `fill()` (bij één vacature `COPY.<locale>.subjectOne`) | `job-alert-digest/<jobAlertId>/<YYYY-MM-DD in Europe/Amsterdam>` | intro, per vacature titel, plaats, uurloon en uren (opgemaakt met `lib/format.ts` van spec 03), link "meer vacatures", links Aanpassen en Afmelden, voetregel |
| `job-alert-reconfirm` (opnieuw bevestigen) | `emails/job-alert-reconfirm.tsx` | `COPY.<locale>.subject` | `job-alert-reconfirm/<jobAlertId>/<eerste 16 tekens van confirm_token_hash>` | intro, knop naar bevestigen, link Afmelden, voetregel |

De drie namen `job-alert-confirm`, `job-alert-digest` en `job-alert-reconfirm` komen in `EMAIL_TEMPLATE_NAMES` (spec 11). Elke aanroep van `sendEmail` geeft de idempotentiesleutel uit de tabel expliciet mee als `idempotencyKey`, met `entity: { type: "job_alert", id: jobAlertId }`; `email_log` krijgt dus `template` `job-alert-confirm`, `job-alert-digest` of `job-alert-reconfirm` en `entity_type = 'job_alert'`. Elke jobalertmail geeft via `headers` van `sendEmail` (spec 11 §4.3) `List-Unsubscribe: <https://www.groospersoneelsdiensten.nl/api/jobalert/afmelden?token=<manage_token>>` en `List-Unsubscribe-Post: List-Unsubscribe=One-Click` mee. De taal is `job_alerts.locale`; de tekst staat als `COPY = { nl, en }` bovenin het templatebestand (§6.6, 00 §4.4 punt 7). Open- en klikmeting blijven uit (B-09).

### 4.4 BH Beheer-uitbreidingen

Alle schermen gebruiken de shell, componenten en hulpcode van spec 08 (`PageHeader`, `SectionCard`, `ResponsiveList`, `ListToolbar`, `StatusTabs`, `Pagination`, `EmptyState`, `ConfirmDialog`, `DefinitionList`, `Field`, `SubmitButton`, `ContactActions`, `NoteForm`, `ActivityFeed`, `withAdmin`, `requireAdmin`, `mapDbError`, `writeAdminAudit`). Nieuw in `app/beheer/_lib/auth.ts`: `requireOwner(): Promise<AdminContext>` (redirect naar `/beheer?melding=geen-rechten` als de rol geen `owner` is). Nieuwe paden in `beheerPaths`: `settings`, `users`, `profile`, `templates`, `template(id)`, `templateNew`, `privacy`, `privacyRequest(id)`, `auditLog`, `talentPool`, `candidate(id)`, `jobAlerts`. De pagina `/beheer/meer` en de sidebar krijgen deze items in een tweede groep "Meer" (Talentpool, Sjablonen, Jobalerts, Instellingen, Gebruikers, Privacy, Logboek, Mijn profiel); items alleen voor eigenaren zijn voor een `recruiter` verborgen.

**Instellingen `/beheer/instellingen`** (eigenaar). `SectionCard`'s:

1. *Jobalerts*: `Switch` "Jobalerts pauzeren" (`job_alerts_paused`) met hint; tellers bevestigd, onbevestigd en mails vandaag.
2. *Google*: `Switch` "Meldingen aan Google sturen" (`indexing_enabled`), een regel of het serviceaccount gevonden is (ja of nee, nooit de sleutel), tellers van de laatste 24 uur, en een tabel met de laatste 20 rijen uit `indexing_notifications` (vacature, taal, soort, status, tijd, fout).
3. *Vacaturefeeds*: per portaal een `Switch` met de feed-URL en een knop Kopiëren; onder Werkzoeken.nl de hint dat het portaal minder dan 25 vacatures niet opneemt, met het actuele aantal open vacatures.
4. *Bewaartermijnen*: alleen lezen, een `DefinitionList` uit `RETENTION_DAYS` (spec 10) plus de jobalert- en talentpooltermijnen.

Actie `updateSettings({ field, value })` (`ownerOnly`), logboek `admin.settings_updated` met `{ field, value }`; bij een feedwijziging ook `revalidatePath("/feeds/[portaal]", "page")`.

**Gebruikers `/beheer/gebruikers`** (eigenaar). `ResponsiveList` met kolommen Naam, E-mailadres, Rol, Tweestapsverificatie (aan of uit uit `auth.admin.mfa.listFactors`), Laatst actief, Status. Knop Gebruiker uitnodigen opent een `Dialog` met e-mailadres, volledige naam, weergavenaam, rol en telefoon. Acties (`app/beheer/_actions/users.ts`, alle `ownerOnly`):

| Actie | Gedrag |
|---|---|
| `inviteAdmin({ email, fullName, displayName, role, phone? })` | admin-client `auth.admin.inviteUserByEmail(email, { redirectTo: beheerUrl("/beheer/auth/bevestigen?volgende=/beheer/wachtwoord-instellen") })`, daarna `rpc("grant_admin", ...)`; logboek `admin.invited` |
| `resendInvite({ id })` | opnieuw `inviteUserByEmail` zolang de gebruiker nooit heeft ingelogd |
| `setAdminRole({ id, role })` | weigert als daarmee geen actieve eigenaar overblijft; logboek `admin.role_changed` |
| `setAdminActive({ id, active })` | `admin_profiles.is_active` en `auth.admin.updateUserById(id, { ban_duration: active ? "none" : "876000h" })`; niet voor jezelf; laatste eigenaar niet; logboek `admin.deactivated` of `admin.reactivated` |
| `resetAdminMfa({ id })` | alle factoren van die gebruiker verwijderen met `auth.admin.mfa.deleteFactor`; de gebruiker koppelt bij de volgende keer inloggen opnieuw (spec 08); logboek `admin.mfa_reset` |

**Mijn profiel `/beheer/profiel`** (iedere beheerder): formulier met `full_name`, `display_name`, `phone_e164`, `whatsapp_e164` (via `normalizePhone` van spec 07), drie meldingsvinkjes (`notify_applications`, `notify_staff_requests`, `notify_messages`), een foto-upload naar `public-media/contacts/<uuid>.<ext>` met de browserclient (de storage-policy van spec 10 staat dat toe), knoppen Wachtwoord wijzigen (link naar `/beheer/wachtwoord-instellen`) en Overal uitloggen, en de sectie Passkeys (§4.11). Actie `updateOwnProfile` werkt de kolommen bij die de column grant van spec 10 toestaat en roept daarna `revalidateVacancies(nummers, "content")` aan voor de vacatures waar deze beheerder contactpersoon is.

**Sjablonen `/beheer/sjablonen`**: lijst gegroepeerd per beroep, knop Nieuw sjabloon. Het sjabloonformulier gebruikt de blokken Basis (zonder plaats, postcode en contactpersoon), Tekst, Arbeidsvoorwaarden (zonder startdatum) en Eisen van `VacancyForm` (spec 08), plus een veld `name`. Acties `saveTemplate`, `duplicateTemplate`, `deleteTemplate` (eigenaar). In `/beheer/vacatures/nieuw` komt boven het formulier een `Select` "Begin met een sjabloon" met de sjablonen van het gekozen beroep; kiezen laadt `/beheer/vacatures/nieuw?sjabloon=<id>`, dat de waarden voorinvult. Op de bewerkpagina komt in het menu de actie "Opslaan als sjabloon" (`saveTemplateFromVacancy({ vacancyId, name })`).

**Privacy `/beheer/privacy`** (eigenaar). Drie blokken:

1. *Verzoekenregister*: lijst met soort, ontvangen, uiterlijk af (`due_at`, rood als binnen 7 dagen), status; knop Verzoek registreren (soort, ontvangen op, e-mailadres of telefoon van de aanvrager, notitie). Het adres wordt alleen als SHA-256-hash bewaard (§5.5); voor zoeken vult de beheerder het adres opnieuw in.
2. *Gegevens zoeken*: formulier met e-mail en telefoon; actie `findPersonRecords` roept `rpc("find_person_records")` aan en toont per tabel het aantal en de referenties. Knoppen Inzage exporteren (POST naar `/beheer/privacy/inzage`, geeft een JSON-bestand `groos-inzage-<datum>.json` met alle rijen uit `applications` met hun `activities`, `staff_requests`, `contact_messages`, `job_alerts` en `candidates`; logboek `privacy.exported`) en Alles verwijderen (`ConfirmDialog` met invoerveld VERWIJDEREN; actie `erasePerson` roept eerst `removeApplicationFiles(ids)` van spec 10 aan voor de gevonden sollicitaties en daarna `rpc("erase_person")`; logboek `privacy.erased` met alleen aantallen). Een verzoek kan aan de zoekopdracht gekoppeld worden; na verwijderen zet de actie het op `done`.
3. *Binnenkort verwijderd*: sollicitaties, aanvragen, berichten en kandidaten met `retain_until` binnen 14 dagen, met per regel Openen en bij sollicitaties Toestemming vastleggen (`recordConsent({ applicationId, source })`, zet `retention_consent = true` met `retention_consent_source` `phone`, `email` of `in_person`; logboek via de trigger van spec 10).

**Logboek `/beheer/logboek`** (eigenaar): `ListToolbar` met `beheerder` (actieve en gedeactiveerde beheerders plus Systeem en Website), `actie` (prefix: `vacancy`, `application`, `staff_request`, `contact_message`, `admin`, `export`, `privacy`, `job_alert`, `candidate`), `periode` (7, 30, 90, 365 dagen). Kolommen Datum en tijd, Gebruiker, Actie (label uit `S.auditLog.actions`, anders de ruwe code), Onderdeel (met link als de entiteit nog bestaat), Wijziging (veldnamen of van en naar). 50 per pagina.

**CSV-export** (`app/beheer/export/[soort]/route.ts`, POST). `soort` is `vacatures`, `sollicitaties`, `aanvragen`, `talentpool` of `logboek`. Het formulier staat in een `ConfirmDialog` met `S.dialogs.export` (spec 08) en stuurt de huidige filters van de lijst mee als verborgen velden. De route: controleert `Origin` gelijk aan de eigen origin, `getSessionState()` moet `admin` zijn, voor alles behalve `vacatures` met rol `owner` (anders 403), leest de rijen met de sessieclient en dezelfde filters als de lijst (hoogstens 5.000 rijen), schrijft `audit_log` `export.csv` met `{ soort, aantal, filters }` en antwoordt met `Content-Type: text/csv; charset=utf-8`, `Content-Disposition: attachment; filename="groos-<soort>-<YYYY-MM-DD>.csv"` en `Cache-Control: no-store`. Opbouw in `lib/csv.ts`: `toCsv(headers: string[], rows: (string | number | null)[][]): string` met BOM `﻿`, scheidingsteken `;`, regeleinde `\r\n`, waarden met `;`, `"`, of een regeleinde tussen dubbele aanhalingstekens (aanhalingsteken verdubbeld), en een `'` vóór elke waarde die begint met `=`, `+`, `-`, `@`, tab of `\r`. Datums als `DD-MM-JJJJ UU:MM` in Europe/Amsterdam, bedragen met komma.

| Soort | Kolommen (Nederlandse kop) |
|---|---|
| `vacatures` | Nummer, Titel, Beroep, Plaats, Status, Online sinds, Sluitdatum, Uren min, Uren max, Uurloon min, Uurloon max, Uitgelicht, Spoed, Contactpersoon, Sollicitaties |
| `sollicitaties` | Referentie, Ontvangen, Soort, Status, Vacature, Voornaam, Achternaam, Telefoon, E-mail, Woonplaats, Mag in Nederland werken, Beschikbaar vanaf, Cv aanwezig, Talentpool, Bron, Toegewezen aan, Bewaard tot (geen bericht en geen cv-inhoud) |
| `aanvragen` | Referentie, Ontvangen, Status, Bedrijf, KvK, Contactpersoon, Telefoon, E-mail, Beroepen, Aantal, Start, Duur, Uren per week, Werkplaats, Toegewezen aan |
| `talentpool` | Voornaam, Achternaam, Telefoon, E-mail, Woonplaats, Beroepen, Certificaten, Beschikbaar vanaf, Toestemming sinds, Bewaard tot |
| `logboek` | Datum en tijd, Gebruiker, Soort gebruiker, Actie, Onderdeel, Wijziging |

### 4.5 TP Talentpool

**Lijst `/beheer/talentpool`**: `ListToolbar` met `q` (naam, telefoon, e-mail, woonplaats), `beroep`, `certificaat` (uit `QUALIFICATIONS`), `beschikbaar` (`nu` of een datum), `plaats` (vrije tekst). Kolommen Naam, Beroepen, Woonplaats, Certificaten, Beschikbaar vanaf, Laatst contact, Bewaard tot; kaart op mobiel met `ContactActions` (Bellen, WhatsApp). 25 per pagina.

**Detail `/beheer/talentpool/[id]`**: `PageHeader` met de naam; `SectionCard` Contact met `ContactActions` (`entityType: "candidate"`); Gegevens (`DefinitionList`, met knop Gegevens bewerken: beroepen, certificaten, beschikbaar vanaf, woonplaats); Sollicitaties (gekoppelde sollicitaties met link); Tijdlijn met `NoteForm` (`entityType` uitgebreid met `"candidate"`) en `ActivityFeed`; Toestemming (sinds, bron, bewaard tot) met knoppen Toestemming vernieuwen (dialoog met bron) en Toestemming intrekken en verwijderen (`ConfirmDialog` met tekst `S.talentPool.withdrawConfirm`); `DetailActionBar` op mobiel.

**Op de bewerkpagina van een vacature** (spec 08 §4.7) komt onder Geschiedenis een `SectionCard` "Passende kandidaten" met hoogstens tien kandidaten uit `listMatchingCandidates(ctx, vacancyId)`: hetzelfde beroep in `occupation_slugs`, gesorteerd op aantal gedeelde certificaten met `required_qualifications`, dan dezelfde woonplaats als de vacature, dan `last_activity_at` aflopend. Per kandidaat naam, woonplaats, beschikbaar vanaf en `ContactActions` met de WhatsApp-tekst `S.talentPool.whatsappVacancy` (titel en nummer van de vacature).

Acties (`app/beheer/_actions/candidates.ts`): `updateCandidate`; `renewCandidateConsent({ id, source })` (zet `consent_at = now()` en `consent_source` op de kandidaat, en daarnaast `retention_consent_at = now()` op de gekoppelde sollicitaties met `anonymized_at is null`, zodat spec 10 hun `retain_until` opnieuw berekent; logboek `candidate.consent_renewed`); `withdrawCandidateConsent({ id })` (eigenaar of medewerker, §5.4): roept met de sessieclient `rpc("withdraw_candidate_consent", { p_id })` aan, roept daarna voor de teruggegeven `registration_ids` (als die niet leeg zijn) `removeApplicationFiles(ids)` van spec 10 en `rpc("anonymize_applications_now", { p_ids })` aan, en verwijdert daarna de kandidaat; en `addNote` en `logContactAttempt` van spec 08 met `entityType` `candidate`.

### 4.6 EN Engelse vacatures

**Beheer.** `VacancyForm` (spec 08) krijgt een zevende blok Engels (`#engels`) na Tekst, standaard ingeklapt met daarin de status "Vertaling ontbreekt", "Concept" of "Online". Velden: `en_title`, `en_summary`, `en_intro`, `en_tasks`, `en_requirements`, `en_offer`, `en_extra`, `en_seo_title`, `en_seo_description` (zelfde grenzen als de Nederlandse velden), een `CheckboxField` `en_reviewed` met het label `S.vacancies.english.reviewedLabel` ("Ik heb deze Engelse tekst zelf geschreven of door iemand laten controleren die goed Engels spreekt") en een `Switch` `en_publish`. De Engelse velden zijn optioneel bij opslaan. Bij `en_publish` controleert `rpc("vacancy_translation_errors")` titel, intro, drie taken, één eis en één punt aanbod, plus `en_reviewed`; ontbreekt iets, dan blijft de Engelse tekst concept met veldfouten. Er komt geen knop "Vertaling voorstellen" en geen automatische vertaling. Actie: `saveVacancy` roept na `save_vacancy` de nieuwe `rpc("save_vacancy_translation", ...)` aan als een Engels veld gevuld is, en daarna `revalidateVacancies([nummer], "visibility")` als de publicatiestatus van de Engelse tekst wijzigde, anders `"content"`.

**Publiek** (aanpassing van de pagina van spec 06, gedrag per situatie):

| Situatie | `/vacatures/<nl-slug>` | `/en/vacatures/<slug>` |
|---|---|---|
| geen gepubliceerde Engelse tekst | zoals spec 06 | zoals spec 06 (Engelse interface, Nederlandse inhoud met `lang="nl"`, canonical naar NL, `OnlyDutchNotice`) |
| wel een Engelse tekst, slug is de Engelse slug | canonical zichzelf; hreflang `nl` zichzelf, `en` de Engelse URL, `x-default` NL; Nederlandse `JobPosting` | inhoud uit de Engelse tekst zonder `lang="nl"` en zonder `OnlyDutchNotice`; canonical zichzelf; dezelfde hreflang; Engelse `JobPosting` |
| wel een Engelse tekst, slug is iets anders (bijvoorbeeld de NL-slug) | n.v.t. | 308 naar `/en/vacatures/<engelse-slug>` |
| gesloten met Engelse tekst | zoals spec 06 | Engelse gesloten staat, `noindex, follow`, geen `JobPosting`, canonical zichzelf |

Op `/en/vacatures` gebruiken kaarten met een Engelse tekst de Engelse titel, samenvatting en URL zonder `lang="nl"`. De OG-afbeelding onder `/en` toont de Engelse titel als die er is (spec 12, OG-route per vacature). Zoeken op `/en/vacatures` blijft op de Nederlandse tekst werken; dat is bij deze aantallen voldoende.

Benodigde hulpfuncties in `components/vacatures/vacancy-format.ts` (spec 06): `mergeTranslation(vacancy: VacancyDetail, tr: VacancyTranslation): VacancyDetail` (vervangt `title`, `summary`, `intro`, `tasks`, `requirements`, `offer`, `extra`, `seoTitle`, `seoDescription`, `slug`, `path`) en `cardWithTranslation(item: VacancyListItem, tr: VacancyTranslationSummary | undefined)`.

### 4.7 FD Feeds

`app/feeds/[portaal]/route.ts`:

```ts
export const revalidate = 3600;
export const dynamicParams = false;
export function generateStaticParams() { return FEED_PORTALS.map((p) => ({ portaal: `${p}.xml` })); }
export async function GET(_req: NextRequest, ctx: RouteContext<"/feeds/[portaal]">): Promise<Response>;
// 1. portaal zonder ".xml" moet in FEED_PORTALS staan, anders 404.
// 2. settings.feeds_enabled (admin-client) moet het portaal bevatten, anders 404.
// 3. items = await getFeedVacancies(portal); body = FEED_RENDERERS[portal](items).
// 4. new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8",
//    "X-Robots-Tag": "noindex", "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" } })
```

```ts
// lib/feeds/index.ts (import "server-only")
export const FEED_PORTALS = ["jooble", "werkzoeken", "uitzendbureau-nl", "indeed"] as const;
export type FeedPortal = (typeof FEED_PORTALS)[number];
export type FeedVacancy = {
  number: number; url: string; title: string; descriptionHtml: string;
  city: string; postalCode: string | null; province: string; company: string;   // contact.name uit lib/site.ts
  salaryMin: number; salaryMax: number; hoursMin: number; hoursMax: number;
  employmentTypes: EmploymentType[]; occupationNl: string;
  publishedAt: string; updatedAt: string; closesAt: string;
};
export async function getFeedVacancies(portal: FeedPortal): Promise<FeedVacancy[]>;
// listOpenVacancyParams() van spec 10, per nummer getVacancyByNumber() (gecachet), alleen state "open";
// url = absoluteUrl(vacancy.path) + "?utm_source=" + portal + "&utm_medium=feed&utm_campaign=vacatures";
// descriptionHtml = jobDescriptionHtml(vacancy, labels, facts) van spec 12 met de Nederlandse koppen van spec 06;
// employmentTypes = employmentTypesFor(contractType, hoursMin, hoursMax) van spec 12.
export const FEED_RENDERERS: Record<FeedPortal, (items: FeedVacancy[]) => string>;
// lib/feeds/xml.ts
export function xmlEscape(value: string): string;   // & < > " '
export function cdata(value: string): string;       // splitst "]]>" in twee CDATA-blokken
```

Veldmapping (tagnamen op hoofdlijnen gecontroleerd in context/10 §4; de bouw-agent legt de actuele specificatie van elk portaal ernaast en noteert afwijkingen in spec 00):

| Veld | Jooble (`<jobs><job id="">`) | Werkzoeken.nl | Indeed (`<source><job>`) | Uitzendbureau.nl |
|---|---|---|---|---|
| nummer | attribuut `id` | `id` | `referencenumber` | volgens developer.uitzendbureau.nl/jobs-xml |
| URL | `link` | `url` | `url` | idem |
| titel | `name` | `title` | `title` | idem |
| omschrijving (HTML in CDATA) | `description` | `description` | `description` | idem |
| plaats en postcode | `region` (plaats) | `city`, `zipcode` | `city`, `postalcode`, `state` (provincie), `country` NL | idem |
| bedrijf | `company` | `company` | `company`, `sourcename` | idem |
| salaris | `salary` als "€ 16,08 tot € 17,50 per uur" | `salary` | `salary` | idem |
| uren en soort | `jobtype` | `hours` | `jobtype` | idem |
| datum | `pubdate` en `updated` als `DD.MM.YYYY` | datum | `date` (RFC 2822) | idem |
| einddatum | `expire` als `DD.MM.YYYY` | n.v.t. | `expirationdate` | idem |

Een gesloten vacature valt uit de feed bij de eerstvolgende verversing (hoogstens een uur). Werk.nl en Nationale Vacaturebank krijgen geen feed.

### 4.8 RG Regiopagina's

Register:

```ts
// content/regio/index.ts (client-veilig, geen tekst)
export const REGIO_IDS = ["westland", "rijswijk", "delft", "zoetermeer", "leidschendam-voorburg"] as const;
export type RegioId = (typeof REGIO_IDS)[number];
export type RegioMeta = {
  id: RegioId; slug: string;                  // slug = id
  citySlugs: string[];                        // waarden van vacancies.city_slug (spec 10)
  occupations: OccupationSlug[];              // beroepen die hier echt voorkomen
  status: "concept" | "gepubliceerd";
  publishedOn: string | null; updatedOn: string;   // "YYYY-MM-DD"
  locales: ("nl" | "en")[];                   // talen met een volledige tekst
};
export const regios: readonly RegioMeta[];
export function getRegio(slug: string): RegioMeta | undefined;
export function publishedRegios(): RegioMeta[];
```

Startwaarden voor `citySlugs` (de bouw-agent controleert ze tegen `slugify` van spec 10): `westland` met `naaldwijk`, `honselersdijk`, `s-gravenzande`, `monster`, `de-lier`, `wateringen`, `poeldijk`, `kwintsheul`, `maasdijk`; `rijswijk` met `rijswijk`; `delft` met `delft`; `zoetermeer` met `zoetermeer`; `leidschendam-voorburg` met `leidschendam`, `voorburg`, `stompwijk`. Alle vijf starten op `concept`. Den Haag krijgt geen regiopagina; dat is het werkgebied van de homepage en `/vacatures`.

```ts
// content/regio/<id>.ts (alleen server-side importeren)
export type RegioCopy = {
  name: string;                       // "Westland"
  metaTitle: string; metaDescription: string;
  h1: string; lead: string;
  intro: [string, string];            // twee alinea's van twee zinnen
  areas: { title: string; body: string }[];        // 2 tot 4 werkgebieden of bedrijventerreinen
  travel: [string, string];           // bereikbaarheid vanuit Den Haag, fiets en OV
  faq: { q: string; a: string }[];    // 3 tot 5, antwoorden uniek voor deze regio
  sources: { fact: string; source: string; checkedOn: string }[];   // niet op de pagina; minstens 3
};
export type RegioPage = { id: RegioId; nl: RegioCopy; en?: RegioCopy };
// content/regio/pages.ts: regioPages: Record<RegioId, RegioPage>; getRegioPage(id, locale): { meta; copy } | undefined
```

`/regio/[plaats]` van boven naar beneden:

```
<Breadcrumbs items={[{ label: t("regio.breadcrumb", { regio: copy.name }), href: paths.regio(slug) }]} />
<RegioHero />                 h1 copy.h1, lead, regel regio.openCount, CtaButton naar /vacatures?plaats=..,
                              secundaire CtaButton naar paths.jobalert({ plaats: citySlugs })
<section aria-labelledby="regio-intro">   sr-only h2 regio.introTitle, twee alinea's
<RegioVacancies />            h2 regio.vacanciesTitle, VacancyList (spec 06) met hoogstens 6 kaarten,
                              link naar /vacatures?plaats=..; leeg: regio.vacanciesEmpty en JobAlertPrompt
<ServiceFeatureGrid id="werkgebieden" heading={regio.areasTitle} features={areas met iconen} />   bestaand
<section aria-labelledby="bereikbaarheid">  h2 regio.travelTitle, twee alinea's
<RegioOccupationLinks />      h2 regio.occupationsTitle, links naar /werken-als/<slug> voor meta.occupations
<ServiceFaq items={copy.faq} heading={regio.faqTitle} />   bestaand, id="faq"
<VacancyRegisterPrompt locale headingId="regio-inschrijven" />   spec 06
<p>regio.lastUpdated met formatDate(meta.updatedOn)</p>
```

| Component | Bestand | S/C | Props |
|---|---|---|---|
| `RegioHero` | `components/regio/regio-hero.tsx` | S (async) | `{ meta: RegioMeta; copy: RegioCopy; locale: Locale; openCount: number }` |
| `RegioVacancies` | `components/regio/regio-vacancies.tsx` | S (async) | `{ meta: RegioMeta; locale: Locale; regioName: string }`; data `getVacancyList({ filters: { plaats: meta.citySlugs }, page: 1, pageSize: 6 })` |
| `RegioOccupationLinks` | `components/regio/regio-occupation-links.tsx` | S (async) | `{ occupations: OccupationSlug[]; locale: Locale; regioName: string }` |

Iconen voor `areas` in volgorde: `Warehouse`, `Building2`, `Sprout`, `MapPin` (lucide 0.456). `openCount` is `getVacancyList(...).total`; dat is een live telling en geen claim. De pagina heeft `export const revalidate = 3600`, `dynamicParams = false` en `generateStaticParams()` uit `publishedRegios()`; een regio in concept geeft dus een 404.

Footer (spec 01, eigenaar van de structuur): zodra `publishedRegios()` niet leeg is, krijgt de kolom voor werkzoekenden de regel "Werk in de regio" met een link per gepubliceerde regio.

Controle: `scripts/regio-check.mjs` (`npm run regio:check`, Node 24, geen packages) leest met `process.loadEnvFile(".env.local")` en de secret key per regio het aantal vacatures met `published_at` in de laatste 90 dagen en het aantal nu open (via `public_vacancies`), en drukt per regio `drempel gehaald` of `drempel niet gehaald` af. Djulan draait het elk kwartaal; zakt een gepubliceerde regio twee kwartalen onder de drempel, dan bespreekt hij met Jimmy of de pagina terug naar `concept` gaat.

### 4.9 EN en TL: taalkeuze

`LanguageToggle` (spec 01) wordt bij meer dan twee talen een `LanguageSelect` (`components/ui/language-select.tsx`, C, eigenaar spec 02 voor uiterlijk): een native `<select>` met label `common.languageSwitcher.label`, opties in de eigen taal (`Nederlands`, `English`, `Türkçe`, `Български`, `Polski`, `Română`) met `lang` per optie, en buiten de scope van een gedeeltelijke taal alleen `nl` en `en`. Wijzigen zet `NEXT_LOCALE` en navigeert met `useRouter` uit `@/i18n/navigation`.

### 4.10 TL Extra talen

```ts
// i18n/scope.ts (client-veilig)
export const FULL_LOCALES = ["nl", "en"] as const;
export const PARTIAL_LOCALES = [] as const;   // per geactiveerde taal toevoegen: "tr", "bg", "pl", "ro"
export const PARTIAL_SCOPE = [
  "/werkzoekenden", "/inschrijven", "/vacatures", "/vacatures/*", "/werken-als/*",
  "/jobalert", "/jobalert/*", "/bedankt/inschrijving", "/bedankt/sollicitatie",
] as const;
export function isPartialLocale(locale: string): boolean;
export function isInLocaleScope(locale: Locale, pathname: string): boolean;   // pad zonder taalprefix
/** Voor elke pagina: roept notFound() aan als een gedeeltelijke taal buiten de scope valt. */
export function assertLocaleScope(locale: Locale, pathname: AppPath): void;
export function localesFor(pathname: string): Locale[];   // FULL_LOCALES plus PARTIAL_LOCALES als het pad in de scope valt
```

Wijzigingen per laag (eigenaar tussen haakjes; deze spec levert de inhoud):

1. `i18n/routing.ts` (01): `locales: [...FULL_LOCALES, ...PARTIAL_LOCALES]`. `DEFAULT_LOCALE_COUNTRIES` blijft `["NL", "BE"]`; de geo-omleiding gaat alleen ooit naar `/en`.
2. `i18n/request.ts` (01): voor een gedeeltelijke taal worden de messages diep samengevoegd: eerst die uit `messages/en/index.ts`, daarover die uit `messages/<taal>/index.ts` (B-45). Zo bestaan sleutels buiten de scope (header, footer) altijd; de pagina's zelf zijn volledig vertaald (regel K16 hieronder).
3. `proxy.ts` (01): een cookie `NEXT_LOCALE` met een gedeeltelijke taal stuurt alleen door als het pad in `PARTIAL_SCOPE` valt; anders doet de proxy niets met die cookie.
4. Pagina's: elke pagina binnen de scope roept na `resolveLocale` `assertLocaleScope(locale, pad)` aan; `app/[locale]/page.tsx` stuurt bij een gedeeltelijke taal met `permanentRedirect` naar `/<taal>/werkzoekenden`. Pagina's buiten de scope roepen `assertLocaleScope` ook aan en geven zo een 404.
5. Header en footer (01): bij een gedeeltelijke taal alleen links binnen de scope, plus "Privacy" naar `/en/privacyverklaring` met `hrefLang="en"` en de toevoeging `common.languageSwitcher.inEnglish`.
6. Messages: `messages/<taal>/` met per namespace een bestand `<namespace>.json` en een `index.ts` (B-45), voor de namespaces `common`, `meta`, `header`, `footer`, `notFound`, `error`, `werkzoekenden`, `beroepen` (alleen de blokken voor werkzoekenden), `vacatures`, `forms`, `bedankt`, `jobalert`. Content: `content/beroepen/<id>.ts` krijgt per taal een optioneel `jobseeker`-blok en `content/pages/werkzoekenden.ts` een optioneel blok per taal (typen van spec 05 krijgen een optionele sleutel per gedeeltelijke taal).
7. Vacatures: interface vertaald, inhoud Nederlands met `lang="nl"`, de melding `vacatures.detail.onlyDutch` in die taal, canonical naar de Nederlandse URL, geen hreflang, geen `JobPosting`, net als `/en` zonder Engelse tekst.
8. Database (10): `alter type public.app_locale add value '<taal>'` per taal, zodat sollicitaties, inschrijvingen en jobalerts de taal bewaren en mails in die taal gaan. Heeft spec 11 voor een mail geen tekst in die taal, dan gaat die mail in het Engels.
9. Fonts (02): Onest met subset `cyrillic` zodra `bg` actief is; Instrument Sans heeft geen Cyrillisch, dus in `app/globals.css` komt `:root:lang(bg) { --font-display: var(--font-sans); }`.
10. Controle (14): nieuwe regel K16 in `scripts/check-launch.mjs`: voor elke taal in `PARTIAL_LOCALES` moeten de namespaces uit punt 6 exact de sleutels en arraylengtes van de bestanden in `messages/nl/` hebben, zonder `TODO`.

Vertaalproces: de bouw-agent exporteert de bronteksten met `node scripts/i18n-export.mjs <taal>` naar `vertaling/<taal>-bron.json` (alleen de namespaces en contentblokken uit punt 6). Een professionele vertaler met die moedertaal vertaalt; een tweede moedertaalspreker die het werk kent (bij voorkeur iemand van Groos) controleert. De vertaling komt terug als JSON en gaat met `node scripts/i18n-import.mjs <taal>` in de repo. Geen machinevertaling, ook niet als eerste versie. Woordenlijst per taal: beroepsnamen worden vertaald, "Groos" en plaatsnamen niet, bedragen en datums gaan via `lib/format.ts` met de locale van die taal.

### 4.11 PK Passkeys

In `/beheer/profiel` een `SectionCard` Passkeys met de lijst van passkeys (naam, toegevoegd op) en de knoppen Passkey toevoegen en Verwijderen. Op `/beheer/inloggen` komt onder het formulier een knop "Inloggen met passkey", alleen als `window.PublicKeyCredential` bestaat. De bouw-agent gebruikt de API die Supabase bij de algemene beschikbaarheid documenteert (verwacht in `supabase.auth.mfa` of `supabase.auth.signInWithPasskey`); de spec legt alleen het gedrag vast:

1. Een passkey is een tweede factor naast het wachtwoord, of een vervanging van wachtwoord plus code, maar alleen als de sessie daarna `aal2` is. Anders bouwt de agent het onderdeel niet en noteert hij dat in spec 00.
2. TOTP blijft verplicht gekoppeld; een passkey vervangt hem niet, zodat een kwijtgeraakte telefoon geen buitensluiting geeft.
3. Toevoegen en verwijderen komen in het logboek (`admin.passkey_added`, `admin.passkey_removed`) en sturen de beveiligingsmail van spec 11.
4. `resetAdminMfa` (§4.4) verwijdert ook passkeys.

## 5 Data

Het datamodel van fase 1 is van spec 10. Deze spec voegt per onderdeel één migratie toe. Bestandsnamen maakt de bouw-agent met `supabase migration new <naam>`, zodat de tijdstempel later is dan die van spec 10 en van eerdere fase 2-migraties. Na elke migratie: `npm run db:push`, `npm run db:types`, `get_advisors` zonder ERROR. Conventies van spec 10 gelden: `set search_path = ''`, volledig gekwalificeerde namen, RLS aan op elke nieuwe tabel, `(select public.is_admin())` in policies, `set_updated_at` op elke tabel met `updated_at`.

### 5.1 Migratie `fase2_basis` (vóór elk ander onderdeel)

```sql
alter type public.entity_type add value if not exists 'job_alert';
alter type public.entity_type add value if not exists 'candidate';
alter type public.entity_type add value if not exists 'privacy_request';

create table public.settings (
  id smallint primary key default 1 check (id = 1),
  job_alerts_paused boolean not null default false,
  indexing_enabled boolean not null default false,
  feeds_enabled text[] not null default '{}'
    check (feeds_enabled <@ array['jooble','werkzoeken','uitzendbureau-nl','indeed']::text[]),
  updated_by uuid references public.admin_profiles (id) on delete set null,
  updated_at timestamptz not null default now()
);
insert into public.settings (id) values (1) on conflict (id) do nothing;
alter table public.settings enable row level security;
-- select: is_admin(); update: is_owner(); geen insert of delete via de API
```

Server-code buiten het beheer (feeds, cron) leest `settings` met `createSupabaseAdminClient()`.

### 5.2 Migratie `fase2_jobalerts` (JA) en `fase2_indexing` (IX)

```sql
create type public.job_alert_frequency as enum ('daily', 'weekly');

create table public.job_alerts (
  id uuid primary key default gen_random_uuid(),
  email text not null check (email = lower(email) and length(email) <= 254 and position('@' in email) > 1),
  locale public.app_locale not null default 'nl',
  occupation_slugs text[] not null check (cardinality(occupation_slugs) between 1 and 5),
  city_slugs text[] not null default '{}' check (cardinality(city_slugs) <= 15),
  hours_buckets text[] not null default '{}' check (hours_buckets <@ array['tot-20','20-32','32-plus']::text[]),
  frequency public.job_alert_frequency not null default 'weekly',
  confirm_token_hash text unique check (confirm_token_hash ~ '^[0-9a-f]{64}$'),
  confirm_expires_at timestamptz,
  confirmed_at timestamptz,
  reconfirm_sent_at timestamptz,
  manage_token text not null unique check (length(manage_token) between 40 and 60),
  last_sent_at timestamptz,
  consent_text_version text not null check (length(consent_text_version) <= 40),
  privacy_notice_version text not null check (length(privacy_notice_version) <= 40),
  utm jsonb check (utm is null or jsonb_typeof(utm) = 'object'),
  submission_id uuid unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index job_alerts_email_criteria_key
  on public.job_alerts (email, occupation_slugs, city_slugs, hours_buckets, frequency);
create index job_alerts_due_idx on public.job_alerts (frequency, last_sent_at) where confirmed_at is not null;
create index job_alerts_email_idx on public.job_alerts (email);
create trigger job_alerts_occupations before insert or update on public.job_alerts
  for each row execute function public.assert_occupation_slugs();   -- bestaande functie van spec 10

create table public.job_alert_deliveries (
  job_alert_id uuid not null references public.job_alerts (id) on delete cascade,
  vacancy_id uuid not null references public.vacancies (id) on delete cascade,
  sent_at timestamptz not null default now(),
  primary key (job_alert_id, vacancy_id)
);
create index job_alert_deliveries_vacancy_idx on public.job_alert_deliveries (vacancy_id);
-- RLS aan op beide; geen policy voor anon of authenticated behalve select op job_alerts voor is_owner()
-- (alleen tellers in /beheer/jobalerts). Schrijven gebeurt alleen server-side met de secret key.
```

Arrays worden in de app gesorteerd en ontdubbeld vóór het schrijven, zodat de unieke index werkt.

```sql
create type public.indexing_type as enum ('URL_UPDATED', 'URL_DELETED');
create type public.indexing_status as enum ('pending', 'sent', 'failed', 'skipped');

create table public.indexing_notifications (
  id bigint generated always as identity primary key,
  vacancy_id uuid not null references public.vacancies (id) on delete cascade,
  locale public.app_locale not null default 'nl',
  type public.indexing_type not null,
  status public.indexing_status not null default 'pending',
  attempts smallint not null default 0,
  url text,
  response_status smallint,
  last_error text check (length(last_error) <= 500),
  created_at timestamptz not null default now(),
  sent_at timestamptz
);
create unique index indexing_pending_key on public.indexing_notifications (vacancy_id, locale, type)
  where status = 'pending';
create index indexing_created_idx on public.indexing_notifications (created_at);

create or replace function public.enqueue_indexing(p_vacancy_id uuid, p_type public.indexing_type) returns void
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.indexing_notifications (vacancy_id, locale, type)
  select p_vacancy_id, t.locale, p_type
  from public.vacancy_translations t
  where t.vacancy_id = p_vacancy_id and (t.locale = 'nl' or t.is_published)   -- is_published bestaat na EN; zie §5.3
  on conflict (vacancy_id, locale, type) where status = 'pending' do nothing;
end $$;
```

Zolang migratie `fase2_engels` niet bestaat, gebruikt `enqueue_indexing` alleen `t.locale = 'nl'`; de EN-migratie vervangt de functie.

Trigger `vacancies_indexing` (after update on `vacancies`, security definer):

| Voorwaarde | Aanroep |
|---|---|
| `new.status = 'published'` en `old.status <> 'published'` | `enqueue_indexing(new.id, 'URL_UPDATED')` |
| `old.status = 'published'` en `new.status = 'closed'` | `URL_UPDATED` |
| `old.status = 'published'` en `new.status = 'draft'` | `URL_DELETED` |
| `old.status = 'closed'` en `new.status = 'archived'` | `URL_DELETED` |
| beide `published` en een van de publieke kolommen uit `public_vacancies` veranderde | `URL_UPDATED` |

Trigger `vacancy_translations_indexing` (after update on `vacancy_translations`): als de vacature `published` is en een tekstkolom veranderde, een rij voor die taal met `URL_UPDATED`. De wachtrij voorkomt dubbele meldingen per vacature, taal en soort zolang een rij `pending` is. RLS: select voor `is_owner()`, verder alleen de secret key. Opschonen: rijen ouder dan 90 dagen in `onderhoud-fase2`.

### 5.3 Migratie `fase2_engels` (EN)

```sql
alter table public.vacancy_translations
  add column is_published boolean not null default true,
  add column reviewed_by uuid references public.admin_profiles (id) on delete set null,
  add column reviewed_at timestamptz;
alter table public.vacancy_translations alter column is_published set default false;
-- before insert or update: bij locale = 'nl' altijd is_published := true
create or replace function public.vacancy_translation_errors(p_vacancy_id uuid, p_locale public.app_locale)
returns text[] language sql stable set search_path = '' as $$
  select array_remove(array[
    case when t.title is null then 'title' end,
    case when coalesce(length(btrim(t.intro)), 0) < 20 then 'intro' end,
    case when coalesce(cardinality(t.tasks), 0) < 3 then 'tasks' end,
    case when coalesce(cardinality(t.requirements), 0) < 1 then 'requirements' end,
    case when coalesce(cardinality(t.offer), 0) < 1 then 'offer' end,
    case when t.reviewed_at is null then 'reviewed' end
  ], null)
  from public.vacancy_translations t where t.vacancy_id = p_vacancy_id and t.locale = p_locale
$$;
-- constraint trigger (deferrable initially deferred) op vacancy_translations: locale <> 'nl' en is_published
-- vraagt een lege vacancy_translation_errors, anders 'translation_not_publishable:<codes>'
create or replace function public.save_vacancy_translation(
  p_vacancy_id uuid, p_locale public.app_locale, p_tr jsonb, p_publish boolean, p_reviewed boolean
) returns table (translation_slug text) language plpgsql security invoker set search_path = '' as $$ ... $$;
-- controleert is_admin(); upsert van title, summary, intro, tasks, requirements, offer, extra, seo_title,
-- seo_description; p_reviewed true zet reviewed_by = auth.uid(), reviewed_at = now(); p_reviewed false zet beide leeg;
-- is_published = p_publish; geeft de slug terug. Weigert p_locale = 'nl'.

create view public.public_vacancy_translations with (security_invoker = true) as
select v.number, t.locale, t.slug, t.title, t.summary, t.intro, t.tasks, t.requirements, t.offer, t.extra,
       t.seo_title, t.seo_description, greatest(v.updated_at, t.updated_at) as updated_at
from public.vacancies v
join public.vacancy_translations t on t.vacancy_id = v.id and t.locale <> 'nl' and t.is_published
where public.vacancy_public_state(v.status, v.publish_at, v.closes_at, v.closed_at) is not null;
grant select on public.public_vacancy_translations to anon, authenticated;
```

De select-policy van `anon` op `vacancy_translations` en de publieke tak van de policy voor `authenticated` (spec 10 §5.8) krijgen de extra voorwaarde `and (locale = 'nl' or is_published)`, zodat een Engels concept nooit via de REST API leesbaar is. De migratie vervangt `enqueue_indexing` door de versie uit §5.2 met `is_published`.

Data-laag (aanvulling op `lib/data/types.ts` en `lib/data/vacancies.ts`, eigenaar spec 10):

```ts
export type VacancyTranslation = {
  locale: "en"; number: number; slug: string; path: `/vacatures/${string}`;
  title: string; summary: string; intro: string; tasks: string[]; requirements: string[]; offer: string[];
  extra: string | null; seoTitle: string | null; seoDescription: string | null; updatedAt: string;
};
export type VacancyTranslationSummary = Pick<VacancyTranslation, "number" | "slug" | "path" | "title" | "summary">;
export async function getVacancyTranslation(number: number, locale: "en"): Promise<VacancyTranslation | null>;
// unstable_cache met tags [VACANCIES_TAG, vacancyTag(number)], revalidate 3600; React cache() eromheen
export async function listVacancyTranslations(locale: "en"): Promise<Map<number, VacancyTranslationSummary>>;
// één gecachte query op public_vacancy_translations, tag VACANCIES_TAG
export async function getVacancySitemapEntries(): Promise<{ path; lastModified; alternates?: { en: `/vacatures/${string}` } }[]>;
// uitgebreid: alternates.en als er een gepubliceerde Engelse tekst is
```

### 5.4 Migratie `fase2_talentpool` (TP)

```sql
create table public.candidates (
  id uuid primary key default gen_random_uuid(),
  first_name text not null check (length(btrim(first_name)) between 1 and 80),
  last_name text not null check (length(btrim(last_name)) between 1 and 120),
  email text check (email = lower(email) and length(email) <= 254 and position('@' in email) > 1),
  phone_e164 text check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  city text check (length(btrim(city)) between 2 and 80),
  occupation_slugs text[] not null default '{}',
  qualifications public.qualification[] not null default '{}',
  available_from date,
  may_work_in_nl boolean,
  consent_at timestamptz not null,
  consent_source public.consent_source not null,
  last_activity_at timestamptz not null default now(),
  retain_until timestamptz not null,               -- trigger: consent_at + 365 dagen
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint candidates_reachable check (email is not null or phone_e164 is not null)
);
create unique index candidates_email_key on public.candidates (email) where email is not null;
create unique index candidates_phone_key on public.candidates (phone_e164) where phone_e164 is not null;
create index candidates_retain_idx on public.candidates (retain_until);
alter table public.applications add column candidate_id uuid references public.candidates (id) on delete set null;
create index applications_candidate_idx on public.applications (candidate_id);
```

Triggers en functies:

- `candidates_before_write`: `email` naar kleine letters, `retain_until := consent_at + interval '365 days'`, `assert_occupation_slugs` (bestaande functie).
- `applications_sync_candidate` (before insert or update of `retention_consent` on `applications`, security definer): als `new.retention_consent` waar is en `new.anonymized_at` leeg, zoek een kandidaat op `email` of `phone_e164`; bestaat hij, dan `occupation_slugs` samenvoegen, `last_activity_at = now()`, `consent_at = greatest(consent_at, coalesce(new.retention_consent_at, now()))`; anders een nieuwe rij met de gegevens van de sollicitatie en `consent_source = coalesce(new.retention_consent_source, 'form')`. Daarna `new.candidate_id` zetten. Een inschrijving (`kind = 'registration'`) heeft altijd toestemming (spec 10) en komt dus altijd in de talentpool.
- `withdraw_candidate_consent(p_id uuid) returns table (changed integer, registration_ids uuid[])` (security invoker, `is_admin()`): zet `retention_consent = false` alleen op de sollicitaties met deze `candidate_id` en `kind = 'vacancy'` (de trigger van spec 10 herberekent `retain_until`) en geeft hun aantal terug als `changed`. Inschrijvingen (`kind = 'registration'`) met deze `candidate_id` laat de functie in de SQL ongemoeid; hun ids komen terug in `registration_ids`. De functie verwijdert de kandidaat niet.
- `anonymize_applications_now(p_ids uuid[]) returns integer` (security definer, `set search_path = ''`): nieuw in deze migratie. Uitvoeren mag alleen bij `is_admin()` (anders de fout `not_admin`). Maakt voor de rijen uit `p_ids` met `anonymized_at is null` dezelfde kolommen leeg als `anonymize_applications` van spec 10, zet `anonymized_at = now()` en verwijdert hun activiteiten, maar zonder de voorwaarde `retain_until <= now()`; geeft het aantal geanonimiseerde rijen terug. Voor een inschrijving geldt intrekken als verwijderen (spec 09); daarom anonimiseert de actie `withdrawCandidateConsent` (§4.5) die direct met deze functie.
- `delete_entity_activities` (spec 10) en `write_audit_log` (argument `candidate`) worden ook aan `candidates` gehangen.

RLS: select, insert en update voor `is_admin()`; delete voor `is_owner()`. Bij intrekken verwijdert de actie `withdrawCandidateConsent` de kandidaat met `createSupabaseAdminClient()`, nadat `withdraw_candidate_consent` met de sessieclient `is_admin()` heeft gecontroleerd, zodat ook een medewerker kan intrekken. Opschonen in `onderhoud-fase2`:

```sql
delete from candidates c
where c.retain_until <= now()
   or not exists (select 1 from applications a where a.candidate_id = c.id and a.retention_consent and a.anonymized_at is null);
```

Zo verdwijnt een kandidaat ook als geen gekoppelde sollicitatie of inschrijving nog toestemming heeft, bijvoorbeeld na een inschrijving die automatisch is afgesloten en geanonimiseerd.

### 5.5 Migratie `fase2_beheer` (BH)

```sql
create table public.vacancy_templates (
  id uuid primary key default gen_random_uuid(),
  occupation_slug text not null references public.occupations (slug) on update cascade,
  name text not null check (length(btrim(name)) between 2 and 80),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  sort_order smallint not null default 0,
  created_by uuid references public.admin_profiles (id) on delete set null,
  updated_by uuid references public.admin_profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index vacancy_templates_occupation_idx on public.vacancy_templates (occupation_slug, sort_order);
-- RLS: select, insert, update voor is_admin(); delete voor is_owner()

create type public.privacy_request_type as enum ('access', 'rectification', 'erasure', 'objection', 'portability', 'withdraw_consent');
create type public.privacy_request_status as enum ('open', 'in_progress', 'done', 'rejected');
create table public.privacy_requests (
  id uuid primary key default gen_random_uuid(),
  type public.privacy_request_type not null,
  status public.privacy_request_status not null default 'open',
  requester_email_hash text check (requester_email_hash ~ '^[0-9a-f]{64}$'),
  requester_phone_hash text check (requester_phone_hash ~ '^[0-9a-f]{64}$'),
  received_at timestamptz not null default now(),
  due_at timestamptz not null,                       -- trigger: received_at + interval '1 month'
  handled_by uuid references public.admin_profiles (id) on delete set null,
  handled_at timestamptz,
  notes text check (length(notes) <= 2000),          -- hulptekst: geen inhoud van persoonsgegevens
  retain_until timestamptz,                           -- trigger: handled_at + interval '2 years'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint privacy_requests_requester check (requester_email_hash is not null or requester_phone_hash is not null)
);
-- RLS: alles alleen voor is_owner()

create or replace function public.find_person_records(p_email text, p_phone text) returns jsonb
language plpgsql stable security invoker set search_path = '' as $$ ... $$;
-- is_owner() verplicht; geeft { applications: [{id, reference}], staff_requests: [...], contact_messages: [...],
-- job_alerts: n, candidates: [{id}] } op lower(email) of phone_e164 (beide optioneel, minstens één gevuld)
create or replace function public.erase_person(p_email text, p_phone text) returns jsonb
language plpgsql security definer set search_path = '' as $$ ... $$;
-- is_owner() verplicht (anders 'not_owner'); verwijdert job_alerts, candidates, contact_messages en staff_requests
-- met dit adres of nummer; anonimiseert sollicitaties zoals anonymize_applications van spec 10 maar zonder de
-- voorwaarde op retain_until; geeft de aantallen per tabel terug. Storage gaat vooraf via removeApplicationFiles.
```

`content` van een sjabloon wordt gevalideerd met `vacancyTemplateSchema` (§5.6): `{ vacancy: { contract_type?, hours_min?, hours_max?, shifts?, salary_min?, salary_max?, salary_note?, education_level?, experience_level?, experience_months?, required_qualifications?, preferred_qualifications?, training_offered?, min_age_18?, min_age_reason?, positions_count?, allow_whatsapp_apply? }, nl: { title?, summary?, intro?, tasks?, requirements?, offer?, extra? } }`.

Opschonen in `onderhoud-fase2`: `privacy_requests` met `retain_until <= now()`.

### 5.6 Validatie (zod 4)

```ts
// lib/validation/job-alert.ts (client-veilig)
export const JOB_ALERT_CONSENT_VERSION = "2027-01";   // verhogen bij elke wijziging van jobalert.form.consent
export const jobAlertSchema = z.object({
  email: z.email("email").max(254).transform((v) => v.trim().toLowerCase()),
  occupations: z.array(z.enum(OCCUPATION_SLUGS)).min(1, "occupations").max(5),
  places: z.array(z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)).max(15).default([]),
  hours: z.array(z.enum(["tot-20", "20-32", "32-plus"])).max(3).default([]),
  frequency: z.enum(["daily", "weekly"]).default("weekly"),
  consent: z.literal("on", { error: "consent" }),
}).and(metaSchema);                                    // metaSchema van spec 07
export const jobAlertManageSchema = z.object({
  token: z.string().min(40).max(60),
  occupations: ..., places: ..., hours: ..., frequency: ...,   // zelfde regels zonder e-mail en toestemming
});
```

`FORM_IDS` (spec 07) krijgt `"jobAlert"`; de foutcodes staan onder `jobalert.form.errors`. Overige schema's in `app/beheer/_lib/validation/`: `settings.ts`, `users.ts` (`inviteSchema` met `email`, `fullName` 1 tot 120, `displayName` 1 tot 40, `role`, `phone` optioneel via `normalizePhone`), `templates.ts` (`vacancyTemplateSchema`), `privacy.ts` (`privacyRequestSchema`, `personSearchSchema` met minstens één van e-mail en telefoon, `eraseSchema` met `confirm: z.literal("VERWIJDEREN")`), `candidates.ts`, `english.ts` (de Engelse velden met de grenzen van spec 08 §5.5).

### 5.7 Cron-routes en `vercel.ts`

| Route | Schema (UTC) | Doet | Antwoord |
|---|---|---|---|
| `/api/cron/indexing` | `*/15 * * * *` | `flushIndexingQueue({ force })` | `{ ok, sent, failed, skipped, deferred, ranAt }` |
| `/api/cron/jobalerts` | `0 5 * * *` | `runJobAlertDigest(new Date(), { force })`; slaat over als `settings.job_alerts_paused` | `{ ok, checked, mailed, vacanciesSent, failed, ranAt }` |
| `/api/cron/onderhoud-fase2` | `30 3 * * *` | `runJobAlertMaintenance`; kandidaten, privacyverzoeken en indexingregels opschonen | `{ ok, unconfirmedDeleted, reconfirmSent, expiredDeleted, candidatesDeleted, privacyRequestsDeleted, indexingRowsDeleted, ranAt }` |
| `/api/cron/herinneringen` | `0 5 * * 1-5` (fase 2, onderdeel BH) | `runStaleReminders(new Date(), { force })`: interne mail over sollicitaties en inschrijvingen die 8 weken geen contact hadden | `{ ok, stale, mailed, ranAt }` |

Elke route volgt het contract van spec 10 §4.6 (`verifyCronRequest`, idempotent, geen persoonsgegevens in het antwoord). `force=1` werkt alleen als `VERCEL_ENV !== "production"`. `maxDuration` is 60 voor `indexing`, `onderhoud-fase2` en `herinneringen` en 300 voor `jobalerts` (§4.3.5). De bouw-agent voegt de regels toe aan `crons` in `vercel.ts` (spec 13) zodra het onderdeel live gaat. Onderdeel BH voegt `{ path: "/api/cron/herinneringen", schedule: "0 5 * * 1-5" }` toe aan `crons` in `vercel.ts` (spec 13 §4.3) zodra de route gebouwd is; in fase 1 staat hij er niet (B-41).

**Herinnering na 8 weken (`/api/cron/herinneringen`, BH).** Fase 1 toont deze herinnering alleen op het dashboard (spec 08, groep "Bijna automatisch afgesloten"); deze route voegt een interne mail toe en verandert het dashboard niet. `lib/beheer/reminders.ts` (`import "server-only"`):

```ts
export async function runStaleReminders(now: Date, opts?: { force?: boolean }): Promise<{ stale: number; mailed: number }>;
```

1. Selecteert met `createSupabaseAdminClient()` sollicitaties en inschrijvingen met status `new`, `in_progress` of `invited`, niet geanonimiseerd, waarvan `coalesce(last_contact_at, created_at)` ouder is dan `RETENTION_DAYS.staleReminder` (56 dagen) en niet ouder dan 56 dagen plus het aantal dagen sinds de vorige werkdag (maandag 3, andere werkdagen 1). Zo komt elke sollicitatie één keer in een mail, ook na het weekend.
2. Geen rijen: geen mail. Wel rijen: één mail `sendStaleReminder({ items })` (`lib/email/reminders.ts`, bestand `emails/stale-reminder.tsx`; conventies van spec 11) aan `internalRecipients("notify_applications")`. De templatenaam `stale-reminder` komt in `EMAIL_TEMPLATE_NAMES` (spec 11); `sendEmail` krijgt `entity: null` en de expliciete `idempotencyKey` `stale-reminder/<YYYY-MM-DD>` (de datum van vandaag in Europe/Amsterdam), zodat `email_log` `template` `stale-reminder` zonder entiteit krijgt. Per regel: voornaam, referentie, vacature of "Inschrijving", de datum waarop de 84 dagen verlopen (`RETENTION_DAYS.staleAutoClose`) en een link naar de sollicitatie in `/beheer`. Geen telefoon, e-mailadres of cv in de mail.
3. Idempotent: staat er vandaag (Europe/Amsterdam) al een rij `stale-reminder` met status `sent` in `email_log`, dan stuurt de run niets (behalve met `force` buiten productie).
4. `export const maxDuration = 60` en `export const dynamic = "force-dynamic"`.

### 5.8 Omgevingsvariabelen

| Variabele | Soort | Waarde | Onderdeel |
|---|---|---|---|
| `GOOGLE_INDEXING_SERVICE_ACCOUNT` | geheim, alleen server, alleen Production | base64 van het JSON-sleutelbestand van het serviceaccount (`base64 -i sleutel.json`) | IX |

De naam is die van spec 13 §3.3. De bouw-agent voegt hem met uitleg toe aan `.env.example` en §5.1 van spec 13. Andere onderdelen hebben geen nieuwe variabelen.

Werkwijze voor het serviceaccount (Jimmy met Djulan): in Google Cloud het project "groos-indexing" aanmaken, de Web Search Indexing API aanzetten, een serviceaccount `groos-indexing` met een JSON-sleutel maken, het e-mailadres van het serviceaccount in Search Console als **eigenaar** van de domeineigenschap toevoegen, de sleutel als Sensitive in Vercel Production zetten, het lokale bestand verwijderen. Bij structureel meer dan 180 meldingen per dag vraagt Djulan quotum aan via het formulier van Google.

## 6 Tekstelementen

Toon volgt spec 03: je-vorm voor werkzoekenden (alle publieke tekst van deze spec), B1, alinea's van twee zinnen, geen uitroeptekens, geen streepjes in zinnen, geen onbevestigde claims. Nieuwe namespaces van deze spec: `jobalert` en `regio`; ze staan samen met de bestanden `content/regio/*` en `components/jobalert/*` met eigenaar spec 15 in 00 §4.4 en §4.4a. Ze worden de bestanden `messages/<locale>/jobalert.json` en `messages/<locale>/regio.json`, met een import in elke `messages/<locale>/index.ts` (B-45). De blokken in §6.1 tot en met §6.3 tonen de namespace met zijn sleutelpad; de vorm van het bestand volgt B-45. De tekst van de jobalertmails staat niet in `messages/` maar als `COPY = { nl, en }` bovenin de templates (§6.6, 00 §4.4 punt 7). Beide horen in de je-zone van `scripts/check-copy.mjs` (de bouw-agent vult de tabel `ZONES` aan, zoals spec 03 §6.19 toestaat). Nieuwe sleutels bij andere eigenaren: `common.languageSwitcher.{tr,bg,pl,ro,inEnglish}` (03), en in `app/beheer/_strings.ts` (08) de objecten `settings`, `users`, `profile`, `templates`, `privacy`, `auditLog`, `talentPool`, `jobAlerts`, `export`, `vacancies.english`. De privacyverklaring krijgt een sectie met anker `jobalert` en de verwerking V-02 wordt uitgebreid met de automatische opname in de talentpool (spec 09).

### 6.1 `jobalert` (NL, `messages/nl/jobalert.json`)

```json
{
  "jobalert": {
    "breadcrumb": "Jobalert",
    "meta": {
      "title": "Jobalert voor nieuw werk",
      "description": "Krijg een mail zodra Groos nieuwe vacatures heeft die bij je passen. Je kiest zelf het werk, de plaats en hoe vaak je mail krijgt."
    },
    "page": {
      "title": "Krijg nieuwe vacatures in je mail",
      "intro": "Kies welk werk je zoekt, dan sturen wij je een mail als er een nieuwe vacature bij komt. Je kunt je altijd met één klik weer afmelden."
    },
    "steps": {
      "title": "Zo werkt de jobalert",
      "items": [
        { "title": "Je kiest je werk", "body": "Je kiest een of meer beroepen en, als je wilt, de plaatsen en uren die bij je passen." },
        { "title": "Je bevestigt je adres", "body": "Je krijgt een mail met een knop. Pas als je daarop drukt, staat je jobalert aan." },
        { "title": "Je krijgt nieuw werk", "body": "Komt er een vacature bij die past, dan staat die in je volgende mail. Zonder nieuw werk krijg je geen mail." }
      ]
    },
    "form": {
      "legendOccupations": "Welk werk zoek je?",
      "hintOccupations": "Kies een of meer beroepen.",
      "legendPlaces": "Waar wil je werken?",
      "hintPlaces": "Kies niets als elke plaats in de regio goed is.",
      "legendHours": "Hoeveel uur per week wil je werken?",
      "hintHours": "Kies niets als het aantal uren niet uitmaakt.",
      "legendFrequency": "Hoe vaak wil je mail?",
      "frequency": { "daily": "Elke ochtend, als er nieuw werk is", "weekly": "Eén keer per week, op maandag" },
      "email": "Je e-mailadres",
      "emailHint": "Hier sturen wij de vacatures naartoe. Wij gebruiken dit adres voor niets anders.",
      "consent": "Ja, stuur mij e-mails met nieuwe vacatures van Groos die bij mijn keuze passen.",
      "privacyNotice": "Lees in onze <link>privacyverklaring</link> hoe wij met je e-mailadres omgaan.",
      "submit": "Maak mijn jobalert",
      "submitting": "Je jobalert wordt gemaakt",
      "errors": {
        "email": "Vul een geldig e-mailadres in, zoals naam@voorbeeld.nl.",
        "occupations": "Kies minimaal één beroep.",
        "consent": "Zet een vinkje als je de e-mails wilt ontvangen.",
        "tooMany": "Op dit adres staan al vijf jobalerts. Pas een bestaande jobalert aan via de link onderaan je mail.",
        "tooManyPending": "Voor dit adres staan al drie aanmeldingen klaar. Bevestig eerst de mail die je al hebt gekregen.",
        "paused": "Je kunt op dit moment geen jobalert maken. Probeer het later opnieuw of bel ons.",
        "blocked": "Je aanmelding is niet verstuurd. Probeer het over een paar minuten opnieuw of bel ons.",
        "generic": "Er ging iets mis bij het maken van je jobalert. Probeer het opnieuw of bel ons."
      }
    },
    "sent": {
      "title": "Kijk in je mail om te bevestigen",
      "body": "Wij hebben je een mail gestuurd met een knop. Druk op die knop, dan staat je jobalert aan.",
      "noMail": "Geen mail gekregen? Kijk ook in je map met ongewenste mail.",
      "backLink": "Terug naar de vacatures"
    },
    "confirm": {
      "title": "Bevestig je jobalert",
      "body": "Druk op de knop hieronder, dan sturen wij je voortaan nieuwe vacatures die bij je passen.",
      "button": "Jobalert bevestigen",
      "pending": "Bezig met bevestigen",
      "doneTitle": "Je jobalert staat aan",
      "doneBody": "Je krijgt een mail zodra er nieuw werk is dat bij je keuze past. Onderaan elke mail staat een link om je jobalert aan te passen.",
      "invalidTitle": "Deze link werkt niet meer",
      "invalidBody": "De link is verlopen of al gebruikt. Maak gerust een nieuwe jobalert aan, dat kost maar een minuut.",
      "newLink": "Nieuwe jobalert maken"
    },
    "manage": {
      "title": "Je jobalert aanpassen",
      "intro": "Hier pas je aan welk werk je zoekt en hoe vaak je mail krijgt. Je e-mailadres wijzig je door een nieuwe jobalert te maken.",
      "save": "Wijzigingen opslaan",
      "saved": "Je wijzigingen zijn opgeslagen.",
      "unsubscribeTitle": "Geen mail meer ontvangen?",
      "unsubscribeBody": "Meld je af, dan stoppen de mails van deze jobalert direct. Wij verwijderen dan ook je gegevens van deze jobalert.",
      "unsubscribe": "Afmelden",
      "invalidTitle": "Deze jobalert bestaat niet meer",
      "invalidBody": "Misschien heb je je al afgemeld. Wil je weer mail ontvangen, maak dan een nieuwe jobalert."
    },
    "unsubscribed": {
      "title": "Je bent afgemeld",
      "body": "Je ontvangt van deze jobalert geen mail meer. Wil je later toch weer nieuw werk in je mail, maak dan een nieuwe jobalert.",
      "cta": "Nieuwe jobalert maken"
    },
    "prompt": {
      "title": "Mis geen nieuw werk",
      "body": "Maak een jobalert, dan krijg je een mail zodra er een nieuwe vacature bij komt. Je kiest zelf het werk en hoe vaak je mail krijgt.",
      "cta": "Maak een jobalert"
    },
    "summary": {
      "occupations": "Werk",
      "places": "Plaatsen",
      "placesAll": "Alle plaatsen",
      "hours": "Uren per week",
      "hoursAll": "Maakt niet uit",
      "frequency": "Hoe vaak"
    }
  }
}
```

### 6.2 `jobalert` (EN, `messages/en/jobalert.json`, zelfde sleutels)

```json
{
  "jobalert": {
    "breadcrumb": "Job alert",
    "meta": {
      "title": "Job alert for new work",
      "description": "Get an email as soon as Groos has new jobs that suit you. You choose the work, the place and how often you hear from us."
    },
    "page": {
      "title": "Get new jobs in your inbox",
      "intro": "Choose the work you are looking for, and we email you when a new job comes in. You can unsubscribe at any time with one click."
    },
    "steps": {
      "title": "How the job alert works",
      "items": [
        { "title": "You choose your work", "body": "You choose one or more occupations and, if you like, the places and hours that suit you." },
        { "title": "You confirm your address", "body": "You get an email with a button. Your job alert only starts once you press it." },
        { "title": "You get new work", "body": "When a matching job comes in, it is in your next email. Without new work you get no email." }
      ]
    },
    "form": {
      "legendOccupations": "What work are you looking for?",
      "hintOccupations": "Choose one or more occupations.",
      "legendPlaces": "Where do you want to work?",
      "hintPlaces": "Choose nothing if any place in the region is fine.",
      "legendHours": "How many hours a week do you want to work?",
      "hintHours": "Choose nothing if the number of hours does not matter.",
      "legendFrequency": "How often do you want an email?",
      "frequency": { "daily": "Every morning, when there is new work", "weekly": "Once a week, on Monday" },
      "email": "Your email address",
      "emailHint": "We send the jobs to this address. We do not use it for anything else.",
      "consent": "Yes, send me emails with new jobs at Groos that match my choice.",
      "privacyNotice": "Read in our <link>privacy statement</link> how we handle your email address.",
      "submit": "Create my job alert",
      "submitting": "Creating your job alert",
      "errors": {
        "email": "Enter a valid email address, such as name@example.com.",
        "occupations": "Choose at least one occupation.",
        "consent": "Tick the box if you want to receive the emails.",
        "tooMany": "This address already has five job alerts. Change an existing job alert through the link at the bottom of your email.",
        "tooManyPending": "This address already has three sign-ups waiting. First confirm the email you already received.",
        "paused": "You cannot create a job alert right now. Please try again later or call us.",
        "blocked": "Your sign-up was not sent. Please try again in a few minutes or call us.",
        "generic": "Something went wrong while creating your job alert. Please try again or call us."
      }
    },
    "sent": {
      "title": "Check your inbox to confirm",
      "body": "We have sent you an email with a button. Press that button and your job alert starts.",
      "noMail": "No email? Please also check your spam folder.",
      "backLink": "Back to the jobs"
    },
    "confirm": {
      "title": "Confirm your job alert",
      "body": "Press the button below, and from now on we send you new jobs that suit you.",
      "button": "Confirm job alert",
      "pending": "Confirming",
      "doneTitle": "Your job alert is on",
      "doneBody": "You get an email as soon as there is new work that matches your choice. Every email has a link at the bottom to change your job alert.",
      "invalidTitle": "This link no longer works",
      "invalidBody": "The link has expired or was already used. Feel free to create a new job alert, it only takes a minute.",
      "newLink": "Create a new job alert"
    },
    "manage": {
      "title": "Change your job alert",
      "intro": "Here you change the work you are looking for and how often you get an email. To use another email address, create a new job alert.",
      "save": "Save changes",
      "saved": "Your changes have been saved.",
      "unsubscribeTitle": "No more emails?",
      "unsubscribeBody": "Unsubscribe and the emails from this job alert stop straight away. We then also delete the details of this job alert.",
      "unsubscribe": "Unsubscribe",
      "invalidTitle": "This job alert no longer exists",
      "invalidBody": "You may already have unsubscribed. If you want emails again, create a new job alert."
    },
    "unsubscribed": {
      "title": "You have unsubscribed",
      "body": "You no longer receive emails from this job alert. If you want new work in your inbox later, create a new job alert.",
      "cta": "Create a new job alert"
    },
    "prompt": {
      "title": "Do not miss new work",
      "body": "Create a job alert and get an email as soon as a new job comes in. You choose the work and how often you hear from us.",
      "cta": "Create a job alert"
    },
    "summary": {
      "occupations": "Work",
      "places": "Places",
      "placesAll": "All places",
      "hours": "Hours per week",
      "hoursAll": "Does not matter",
      "frequency": "How often"
    }
  }
}
```

### 6.3 `regio` (NL en EN, `messages/nl/regio.json` en `messages/en/regio.json`)

```json
{ "regio": {
  "breadcrumb": "Werk in {regio}",
  "openCount": "{count, plural, =0 {Nu geen open vacatures} one {# open vacature} other {# open vacatures}}",
  "cta": { "vacancies": "Bekijk vacatures in {regio}", "jobAlert": "Jobalert voor {regio}" },
  "introTitle": "Werken in {regio}",
  "vacanciesTitle": "Vacatures in {regio}",
  "vacanciesAll": "Bekijk alle vacatures in {regio}",
  "vacanciesEmpty": "Op dit moment staan er geen vacatures in {regio} online. Maak een jobalert, dan hoor je het als dat verandert.",
  "areasTitle": "Waar je in {regio} werkt",
  "travelTitle": "Zo kom je er",
  "occupationsTitle": "Werk dat wij in {regio} hebben",
  "occupationLink": "Werken als {occupation}",
  "faqTitle": "Vragen over werken in {regio}",
  "lastUpdated": "Bijgewerkt op {date}"
} }
```

EN: `"Work in {regio}"`, `"{count, plural, =0 {No open jobs right now} one {# open job} other {# open jobs}}"`, `"See jobs in {regio}"`, `"Job alert for {regio}"`, `"Working in {regio}"`, `"Jobs in {regio}"`, `"See all jobs in {regio}"`, `"There are no jobs in {regio} online right now. Create a job alert, and we let you know when that changes."`, `"Where you work in {regio}"`, `"How to get there"`, `"Work we have in {regio}"`, `"Work as a {occupation}"`, `"Questions about working in {regio}"`, `"Updated on {date}"`. `{regio}` krijgt `copy.name`; in het Engels blijft de plaatsnaam Nederlands (Westland, Rijswijk), behalve dat `displayCity` van spec 06 geldt voor Den Haag.

### 6.4 Voorbeeldtekst regiopagina (`content/regio/westland.ts`, nl)

Alle feiten met TODO zijn onbevestigd; `npm run check` meldt ze, en de pagina gaat pas naar `gepubliceerd` als ze bevestigd zijn en in `sources` staan.

```ts
nl: {
  name: "Westland",
  metaTitle: "Werk in het Westland via Groos",
  metaDescription: "Werk in het Westland in de logistiek van bloemen, planten en groente. Bekijk de open vacatures en solliciteer bij Groos, ook zonder cv.",
  h1: "Werk in het Westland",
  lead: "In het Westland werk je vaak in de logistiek van bloemen, planten en groente. Wij zoeken hier vooral orderpickers en medewerkers die vroeg kunnen beginnen.",
  intro: [
    "Het werk in het Westland begint vaak al om 05.00 of 06.00 uur. Je verzamelt orders, zet karren klaar of laadt vrachtwagens voor de export.",
    "TODO bevestigen in welke plaatsen Groos hier opdrachtgevers heeft. Bij elke vacature zie je de plaats, de uren en het bruto uurloon.",
  ],
  areas: [
    { title: "Naaldwijk en Honselersdijk", body: "TODO bevestigen welk werk Groos hier heeft. Noem alleen bedrijventerreinen waar onze vacatures echt zijn." },
    { title: "Wateringen en Poeldijk", body: "TODO bevestigen of hier vacatures van Groos zijn." },
  ],
  travel: [
    "TODO bevestigen hoe lang de fietstocht en de busreis vanaf Den Haag Zuidwest naar Naaldwijk duren. Noem alleen lijnen en tijden die je zelf hebt gecontroleerd.",
    "TODO bevestigen of Groos vervoer regelt. Regelt Groos het niet, schrijf dat dan eerlijk in deze zin.",
  ],
  faq: [
    { q: "Hoe vroeg begin ik in het Westland?", a: "TODO bevestigen met de echte begintijden. Bij elke vacature staat de werktijd die bij die opdrachtgever hoort." },
    { q: "Regelt Groos huisvesting in het Westland?", a: "TODO bevestigen. Schrijf alleen wat Groos echt wel of niet regelt." },
    { q: "Heb ik een certificaat nodig voor werk in het Westland?", a: "Voor veel werk is geen certificaat nodig. Vraagt een vacature een EPT- of heftruckcertificaat, dan staat dat erbij en regelen wij soms de opleiding." },
  ],
  sources: [],
}
```

### 6.5 Beheerteksten (voorbeelden voor `_strings.ts`, je-vorm)

| Sleutel | Tekst |
|---|---|
| `settings.jobAlerts.pauseHint` | Zet dit aan als je even geen jobalerts wilt versturen. Aanmelden op de site kan dan ook niet. |
| `settings.indexing.hint` | Google hoort dan binnen een kwartier dat een vacature online of offline is gegaan. Zet dit alleen uit als Google meldt dat er iets misgaat. |
| `settings.feeds.werkzoekenHint` | Werkzoeken.nl neemt een feed pas op vanaf 25 vacatures. Nu staan er {count} vacatures online. |
| `users.invite.title` | Gebruiker uitnodigen |
| `users.lastOwner` | Er moet altijd minstens één actieve eigenaar zijn. Maak eerst iemand anders eigenaar. |
| `templates.empty` | Er zijn nog geen sjablonen. Met een sjabloon maak je een nieuwe vacature in een paar minuten. |
| `privacy.eraseConfirm` | We verwijderen alle gegevens van deze persoon definitief, ook cv's en notities. Typ VERWIJDEREN om te bevestigen. |
| `privacy.dueSoon` | Dit verzoek moet binnen {days} dagen zijn afgehandeld. |
| `talentPool.empty` | Er staat nog niemand in de talentpool. Kandidaten komen hier vanzelf als ze toestemming geven om een jaar bewaard te blijven. |
| `talentPool.withdrawConfirm` | {naam} komt uit de talentpool. Gekoppelde sollicitaties volgen weer de termijn van vier weken en een inschrijving wissen wij direct. Dat kun je niet ongedaan maken. |
| `talentPool.whatsappVacancy` | Hoi {voornaam}, je staat in de talentpool van Groos. Wij hebben nieuw werk: {titel} (vacature {nummer}). Heb je interesse? |
| `vacancies.english.reviewedLabel` | Ik heb deze Engelse tekst zelf geschreven of door iemand laten controleren die goed Engels spreekt. |
| `export.done` | De export is klaar en wordt gedownload. Bewaar het bestand alleen zolang je het nodig hebt. |

### 6.6 Mailteksten jobalert (`COPY` in `emails/job-alert-*.tsx`)

Volgens spec 11 §6 en 00 §4.4 punt 7 staat de mailtekst als `const COPY = { nl: {...}, en: {...} } as const` bovenin elk templatebestand. Plaatshouders staan tussen `{}` en worden met `fill()` van spec 11 ingevuld. De teksten zijn dezelfde als de vroegere sleutels `jobalert.email.*`. De samenvatting van de keuze in de bevestigingsmail gebruikt `COPY.<locale>.summary` met dezelfde teksten als `jobalert.summary`, `jobalert.form.frequency`, `beroepen.<id>.enkelvoud` en `vacatures.filters.uren.options`; de bouw-agent neemt die letterlijk over.

```ts
// emails/job-alert-confirm.tsx
const COPY = {
  nl: {
    subject: "Bevestig je jobalert bij Groos",
    intro: "Je hebt op onze site een jobalert gemaakt. Druk op de knop om te bevestigen dat dit jouw e-mailadres is.",
    button: "Jobalert bevestigen",
    expiry: "Deze knop werkt zeven dagen. Heb je zelf niets aangevraagd, dan kun je deze mail negeren.",
    summary: { /* zie hierboven */ },
  },
  en: {
    subject: "Confirm your job alert at Groos",
    intro: "You created a job alert on our website. Press the button to confirm that this is your email address.",
    button: "Confirm job alert",
    expiry: "This button works for seven days. If you did not ask for this, you can ignore this email.",
    summary: { /* zie hierboven */ },
  },
} as const;

// emails/job-alert-digest.tsx
const COPY = {
  nl: {
    subject: "{count} nieuwe vacatures voor jou bij Groos",
    subjectOne: "1 nieuwe vacature voor jou bij Groos",
    intro: "Er is nieuw werk dat past bij je jobalert. Bekijk de vacatures hieronder en solliciteer als het je aanspreekt.",
    more: "Bekijk alle vacatures die bij je keuze passen",
    manage: "Jobalert aanpassen",
    unsubscribe: "Afmelden",
    footer: "Je krijgt deze mail omdat je een jobalert hebt gemaakt op de site van Groos.",
  },
  en: {
    subject: "{count} new jobs for you at Groos",
    subjectOne: "1 new job for you at Groos",
    intro: "There is new work that matches your job alert. Have a look at the jobs below and apply if one suits you.",
    more: "See all jobs that match your choice",
    manage: "Change job alert",
    unsubscribe: "Unsubscribe",
    footer: "You receive this email because you created a job alert on the Groos website.",
  },
} as const;

// emails/job-alert-reconfirm.tsx
const COPY = {
  nl: {
    subject: "Wil je de jobalert van Groos houden?",
    intro: "Je ontvangt al een jaar onze jobalert. Druk op de knop als je de mails wilt blijven krijgen, anders stoppen ze over dertig dagen vanzelf.",
    button: "Jobalert bevestigen",
    unsubscribe: "Afmelden",
    footer: "Je krijgt deze mail omdat je een jobalert hebt gemaakt op de site van Groos.",
  },
  en: {
    subject: "Do you want to keep the Groos job alert?",
    intro: "You have been receiving our job alert for a year. Press the button if you want to keep getting the emails, otherwise they stop in thirty days.",
    button: "Confirm job alert",
    unsubscribe: "Unsubscribe",
    footer: "You receive this email because you created a job alert on the Groos website.",
  },
} as const;
```

Een gedeeltelijke taal (§4.10 punt 8) krijgt een eigen blok in `COPY` zodra de vertaling er is; tot die tijd gebruikt de template `COPY.en`.

## 7 SEO

| Pagina | Titel (eigen deel) en beschrijving | Canonical en hreflang | Robots | JSON-LD | Sitemap en `llms.txt` |
|---|---|---|---|---|---|
| `/jobalert` | `jobalert.meta.title` en `.description` | zichzelf; nl, en, x-default en de gedeeltelijke talen uit `localesFor` | index; met query `noindex, follow`, canonical zonder query | `BreadcrumbList` via `Breadcrumbs` | sitemap ja (via `STATIC_ROUTES`), `llms.txt` onder Werkzoekenden |
| `/jobalert/aangemeld`, `/bevestigen`, `/beheren`, `/afgemeld` | titels uit `jobalert.sent.title` enzovoort | zichzelf | `noindex` (bevestigen en beheren `noindex, nofollow` plus `referrer: no-referrer`) | geen | nee |
| `/regio/[plaats]` | `copy.metaTitle` (hoogstens 45 tekens eigen deel) en `copy.metaDescription` (120 tot 160 tekens, je-vorm) | zichzelf; hreflang alleen voor de talen in `meta.locales` plus x-default | index | `BreadcrumbList`; `serviceLd` met `areaServed` `{ "@type": "City", name }` per plaats (Westland als `AdministrativeArea`) en `serviceType` "Arbeidsbemiddeling voor werkzoekenden in {regio}"; `faqLd(copy.faq)` | sitemap: per gepubliceerde regio en taal, `priority` 0,6, `changeFrequency` weekly, `lastModified` uit `updatedOn`; `llms.txt`: kopje "Regio's" onder Werkzoekenden |
| `/vacatures/<slug>` met Engelse tekst | zoals spec 06 | canonical zichzelf; `languages` nl, en (Engelse URL), x-default nl | index | NL `JobPosting` | sitemap: NL-entry met `alternates.languages` nl en en |
| `/en/vacatures/<engelse-slug>` | Engelse `seoTitle` of `vacatures.meta.detailTitle` met de Engelse titel; beschrijving met de Engelse `detailDescription` | canonical zichzelf; dezelfde hreflang | index (gesloten: `noindex, follow`) | Engelse `JobPosting` (`inLanguage` niet nodig; titel en omschrijving Engels), `BreadcrumbList` | sitemap: eigen entry met dezelfde alternates |
| pagina's in gedeeltelijke talen binnen de scope | messages van die taal | zichzelf; hreflang via `localesFor` | index | zoals de NL-pagina, behalve vacatures | sitemap: per pad binnen de scope een entry per gedeeltelijke taal |
| `/feeds/*.xml` | n.v.t. | n.v.t. | `X-Robots-Tag: noindex` | n.v.t. | nooit |

Aanvullingen in `lib/seo.ts` (eigenaar spec 12; deze spec beschrijft wat nodig is, de bouw-agent overlegt met de eigenaar):

1. `alternatesFor` en `pageMetadata` krijgen `languages?: boolean | Partial<Record<Locale, string>>`: een object geeft per taal het pad (zonder prefix), bijvoorbeeld `{ nl: "/vacatures/glazenwasser-den-haag-1001", en: "/vacatures/window-cleaner-den-haag-1001" }`; `x-default` volgt `nl`. Zonder object blijven de talen uit `localesFor(path)` gelden.
2. `vacancyMetadata` krijgt `translation?: VacancyTranslationSummary | null`: met een vertaling geen canonical naar NL onder `/en` en wel de hreflang uit punt 1.
3. `jobPostingLd` krijgt `locale?: "nl" | "en"` (standaard `nl`); `url` wordt `absoluteUrl(localizedPath(locale, vacancy.path))`. De pagina geeft voor `en` de samengevoegde `VacancyDetail` (`mergeTranslation`) en de Engelse koppen van spec 06 mee.
4. `serviceLd` krijgt `areaServed?: JsonLdObject[]`, dat `site.areaServed` vervangt.
5. `app/sitemap.ts` neemt `getVacancySitemapEntries()` met `alternates.en` over, de gepubliceerde regio's en de paden binnen de scope van de gedeeltelijke talen.

Indexing API en sitemap vullen elkaar aan: de sitemap blijft de basis (spec 12), de Indexing API versnelt alleen. Feeds dragen niet bij aan de eigen SEO en staan daarom niet in de sitemap.

Doorway-risico: regiopagina's verschijnen alleen met echte lokale inhoud en echte vacatures (§3.3). Combinaties van plaats en beroep (`/regio/westland/orderpicker`) komen er niet.

## 8 Toegankelijkheid en performance

- **Koppen.** Eén h1 per pagina; h2 per sectie; h3 alleen voor kaarttitels en stappen (B-05). Op `/jobalert` zijn de vragen `legend`s binnen `fieldset`s, geen koppen.
- **Formulieren.** Alle velden volgen de regels van spec 07 §4.3: zichtbare labels, `aria-describedby` voor hint en fout, `aria-invalid`, focus naar het eerste ongeldige veld, `ErrorSummary` met `role="alert"`, doelen van minimaal 44 bij 44 px. Het toestemmingsvinkje staat nooit vooraf aan. De bevestigknop op `/jobalert/bevestigen` meldt het resultaat in een element met `role="status"`.
- **Zonder JavaScript** werken aanmelden, bevestigen, aanpassen en afmelden als gewone formulieren met Server Actions (B-36).
- **Taal.** Elke pagina in een gedeeltelijke taal heeft `<html lang>` van die taal; Nederlandse vacatureinhoud krijgt `lang="nl"`. Opties in `LanguageSelect` hebben `lang` per optie. Bulgaarse koppen vallen terug op Onest met Cyrillisch.
- **Contrast en kleur** via de tokens van spec 02; de status in het verzoekenregister en de indexinglijst heeft altijd tekst naast kleur.
- **Beweging.** Geen nieuwe animaties; overgangen met `motion-reduce:transition-none`.
- **Performance.** `/regio/[plaats]` is ISR (3600) met data uit de gecachte loader van spec 10. `/jobalert` is dynamisch door `searchParams`, maar leest alleen `getVacancyFacets` uit de cache. Feeds zijn ISR en lezen per vacature `getVacancyByNumber` uit de cache. JavaScript-budget: `/jobalert` hoogstens 200 kB first-load gzip, `/regio/[plaats]` hoogstens 190 kB (spec 14 meet met `npm run check:bundles`). Lighthouse mobiel 90 of hoger op `/jobalert` en een gepubliceerde regiopagina.
- **Cron.** `jobalerts` verstuurt hoogstens 5 mails tegelijk en stopt netjes binnen `maxDuration = 300`; `indexing` verstuurt hoogstens 20 meldingen per run; `indexing`, `onderhoud-fase2` en `herinneringen` hebben `maxDuration = 60`.
- **Beheer.** Nieuwe beheerschermen volgen spec 08 §8 (tabellen vanaf `lg`, kaarten eronder, vaste actiebalk op detailpagina's, geen horizontale scroll op 390 px).

## 9 21st.dev-opdracht voor sub-agents

### 9.1 Werkwijze

De bouw-agent van JA en RG start de sub-agent van dat onderdeel zodra de structuur werkt op de bestaande primitives (formulier met de veldcomponenten van spec 07, regiopagina met de bestaande secties). Andere onderdelen hebben geen eigen UI-keuze: de beheerschermen volgen de componenten en keuzes van spec 08 (§9 daar), en IX, FD en TL hebben geen nieuwe zichtbare elementen.

- Tools: `ToolSearch` met `select:mcp__magic__search,mcp__magic__get_inspiration`.
- `mcp__magic__search` met `type: "component"` en `limit: 10` per formulering (Engels); `mcp__magic__get_inspiration` met de beschrijvingen. Zoeken op thema's levert niets op (00 §4.6).
- Selectiecriteria: minimaal en rustig; witte achtergrond; blauw accent alleen via tokens van spec 02 (`bg-primary`, `text-primary`, `bg-accent`, `bg-brand-tint`, `bg-ice`, `ring-ring`, `border-primary`); past bij de boodschap van de plek; shadcn-compatibel met Tailwind 4 en `cn()`; toegankelijk (native `fieldset`, `legend`, `input type="checkbox"` en `type="radio"`, zichtbare focus, doelen van 44 px); geen nieuwe dependencies (geen TanStack Form, geen react-hook-form, geen Radix, geen framer-motion); geen glas, gloed, raster, spotlight of marquee (B-29); geen foto als verplicht onderdeel (B-25).
- Oplevering als tekst aan de bouw-agent: 2 tot 4 kandidaten met id, naam en preview-URL, per kandidaat twee zinnen over wat bruikbaar is en wat niet, één gemotiveerde keuze, en of `get_component` nodig is.
- `mcp__magic__get_component` alleen voor de gekozen kandidaat, hoogstens één keer per plek, en alleen als het overnemen van structuur echt tijd scheelt.
- Aanpassingsregels: kleuren en radius alleen via tokens; componentnamen, props en id's uit §4 blijven gelijk (`jobalert-titel`, `zo-werkt-de-jobalert`, `werkgebieden`, `faq`); alle tekst via messages of props; server component tenzij interactie; formulieren blijven native en werken zonder JavaScript; `Link` uit `@/i18n/navigation`; lucide 0.456 met lijndikte 2; `prefers-reduced-motion` gerespecteerd; geen eyebrows of labels boven koppen; geen uppercase.
- Valt 21st.dev tegen, dan bouwt de agent op de veldcomponenten van spec 07, `CtaButton` en de secties van spec 05.

### 9.2 Sub-agent `scout-jobalert`: `JobAlertForm`, `JobAlertPrompt`

Boodschap: in een minuut aangemeld, je houdt zelf de regie en je kunt altijd stoppen.

- `search`: "newsletter signup form with checkboxes"; "email subscribe form"; "radio group cards"; "checkbox with description"; "subscription preferences form".
- `get_inspiration`: "minimal job alert signup form with email, occupation checkboxes, frequency radio buttons, white background, blue accent"; "compact call to action block inviting users to subscribe to job alerts, one button, calm tone".
- Specifiek: beroepen als checkboxrijen van volle breedte met grote raakvlakken; frequentie als twee radiokaarten naast elkaar vanaf `sm`; toestemming als vinkje met tekst ernaast; één primaire knop; het blok `JobAlertPrompt` als rustig vlak in `bg-accent` of `bg-ice` met één secundaire knop.

| Id | Naam | Preview | Startpunt voor |
|---|---|---|---|
| 25087 | Newsletter Subscription Form (felipemenezes098) | https://21st.dev/@felipemenezes098/components/tsf-recipes-04 | opbouw e-mail plus frequentie in één kaart; TanStack Form niet overnemen |
| 21496 | Newsletter Signup (olewandowski1) | https://21st.dev/@olewandowski1/components/newsletter-1 | e-mailveld met toestemmingsvinkje en knop, centraal blok voor `JobAlertPrompt` |
| 28339 | Radio Group in Card with Separators (sean0205) | https://21st.dev/@sean0205/components/c-radio-group-8 | frequentiekeuze als rijen in een kaart |
| 24896 | Checkbox with Description (felipemenezes098) | https://21st.dev/@felipemenezes098/components/checkbox-02 | toestemmingsvinkje met hulpregel |

Niet kiezen: 992 (Newsletter Section, achtergrondeffect) en 31727 (CTA met woordanimatie en avatarrij).

### 9.3 Sub-agent `scout-regio`: `RegioHero`

Boodschap: concreet werk dicht bij huis, met een echte telling en twee duidelijke volgende stappen.

- `search`: "page header with breadcrumb title and description"; "hero section minimal with stats"; "centered hero two buttons"; "hero with features underneath".
- `get_inspiration`: "simple local landing page hero for a city with heading, short intro and two call to action buttons, no image, white background"; "minimal page header with live count badge and two buttons".
- Specifiek: kruimelpad erboven (component van spec 01), h1, lead, een regel met het aantal open vacatures als gewone tekst of rustig label, twee knoppen; geen afbeelding, geen achtergrondeffect; op 390 px knoppen onder elkaar op volle breedte.

| Id | Naam | Preview | Startpunt voor |
|---|---|---|---|
| 18129 | Page Header Breadcrumb (uiable) | https://21st.dev/@uiable/components/uiable-breadcrumb-page-header | kruimelpad met paginatitel in één rustig blok |
| 612 | Hero 45 (shadcnblockscom) | https://21st.dev/@shadcnblockscom/components/shadcnblocks-com-hero45 | hero met drie kenmerken eronder, bruikbaar voor de werkgebieden |
| 6999 | Hero Minimalism (lyanchouss) | https://21st.dev/@lyanchouss/components/hero-minimalism | typografische hero zonder beeld; alleen de verhoudingen |
| 7520 | Hero Modern (brijr) | https://21st.dev/@brijr/components/hero-modern | gecentreerde kop met twee knoppen |

Niet kiezen: 29522 (spotlight-effect), 2723 (verloopachtergrond) en 19069 (portretfoto).

## 10 Bouwopdracht

Algemeen voor elk onderdeel: lees eerst §3.3 en noteer de vrijgave van Djulan in spec 00; werk op een eigen branch `fase2/<code>`; schrijf eerst de migratie, dan de data- en serverlaag, dan de UI; draai na elke stap `npm run typecheck`; sluit af met `npm run verify`, `npm run check`, de tests van het onderdeel en Playwright op 390, 768, 1280 en 1440 px (screenshots alleen in `.playwright-mcp/`). Alles eerst op localhost tegen `groos-dev`, daarna pas een preview en productie (R-17). Lees vooraf `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md`, `.../04-functions/after.md` en `.../04-functions/revalidatePath.md`.

**Stap 0, basis.** Migratie `fase2_basis` (§5.1); `npm run db:push`, `npm run db:types`.

**Stap R, routeherkenning (JA, RG, EN, TL).** Elke nieuwe publieke route onder `app/[locale]` komt in `isKnownPath` in `lib/routes.ts` (B-55): `/jobalert`, `/jobalert/aangemeld`, `/jobalert/bevestigen`, `/jobalert/beheren` en `/jobalert/afgemeld` altijd; `/regio/<slug>` alleen als `getRegio(slug)?.status === "gepubliceerd"`. Komen er talen bij (Turks, Bulgaars, Pools, Roemeens), dan herkennen `normalize()` in `lib/routes.ts` en `withNotFound()` in `proxy.ts` ook die taalprefixen. Engelse vacatureslugs eindigen op het nummer, zodat `parseVacancySlug` ze blijft herkennen.

**IX Indexing API**

1. Migratie `fase2_indexing` (§5.2), inclusief de twee triggers en `enqueue_indexing`.
2. `lib/google/indexing.ts` en `app/api/cron/indexing/route.ts`. Unit-tests `tests/unit/fase2/indexing.test.ts` met een gemockte `fetch`: JWT-opbouw (header `{"alg":"RS256","typ":"JWT"}`, claims), afhandeling van 200, 429, 403 en 503, dagplafond.
3. Tabblad Google in `/beheer/instellingen` (§4.4).
4. Lokaal: `update vacancies set status = 'closed', close_reason = 'filled' where number = 1001` en controleren dat er een rij `pending` komt; `curl -H "Authorization: Bearer $CRON_SECRET" "http://localhost:3000/api/cron/indexing"` zet hem op `skipped` met `not_production`.
5. Productie: serviceaccount volgens §5.8, variabele zetten, cronregel in `vercel.ts`, `indexing_enabled` aan, één vacature publiceren en de rij `sent` met `response_status` 200 controleren.

**BH Beheer** (volgorde: gebruikers en profiel, logboek en CSV, privacy, sjablonen, instellingen-rest)

1. Migratie `fase2_beheer` (§5.5).
2. `requireOwner`, uitbreiding van `beheerPaths`, navigatie en `/beheer/meer`.
3. Schermen en acties uit §4.4 met hun `_strings.ts`-objecten; `lib/csv.ts` met unit-tests (BOM, scheidingsteken, aanhalingstekens, formulebescherming).
4. Tests `tests/e2e/fase2/beheer-*.spec.ts` met het beheertestaccount van spec 14.
5. Cron-route `herinneringen` (§5.7) met `lib/beheer/reminders.ts`, `emails/stale-reminder.tsx` en `lib/email/reminders.ts`; de regel aan `crons` in `vercel.ts` toevoegen. Unit-test `tests/unit/fase2/reminders.test.ts` voor het venster (maandag 3 dagen, andere werkdagen 1).

**JA Jobalert**

1. Migratie `fase2_jobalerts` (§5.2); `FORM_IDS` uitbreiden; `lib/validation/job-alert.ts`.
2. `lib/jobalert/*`, `app/actions/job-alert.ts`, `app/api/jobalert/afmelden/route.ts`, de drie templates en `lib/email/job-alerts.ts` (conventies van spec 11).
3. Messages `messages/nl/jobalert.json` en `messages/en/jobalert.json` (§6.1, §6.2) met een import in elke `messages/<locale>/index.ts` (B-45), de `COPY`-blokken van de drie templates (§6.6) en de zone in `scripts/check-copy.mjs`; `lib/routes.ts`-aanvullingen (§4.1).
4. Pagina's en componenten (§4.3); `JobAlertPrompt` op de drie plekken in spec 06.
5. BotID: in `instrumentation-client.ts` (spec 13) `"/jobalert"` en `"/jobalert/*"` aan `FORM_PAGES` toevoegen.
6. Cron-routes `jobalerts` en `onderhoud-fase2`; `/beheer/jobalerts` met tellers per beroep en frequentie.
7. Sub-agent `scout-jobalert` (§9.2).
8. Tests: `tests/unit/fase2/job-alert.test.ts` (schema, tokens, verschuldigd-regels, matching), `tests/e2e/fase2/jobalert.spec.ts` met helper `maakJobalert({ bevestigd, beroep, plaats, frequentie })` die rechtstreeks via de admin-client een rij met bekend token schrijft.
9. Privacyverklaring: sectie `#jobalert` laten schrijven en goedkeuren (spec 09).

**TP Talentpool**

1. Migratie `fase2_talentpool` (§5.4); daarna eenmalig `update applications set retention_consent = retention_consent where retention_consent and anonymized_at is null`, zodat bestaande toestemmingen in de talentpool komen (controleer het aantal met Jimmy).
2. Schermen en acties (§4.5); "Passende kandidaten" op de bewerkpagina.
3. Opschonen in `onderhoud-fase2`; tests.

**EN Engelse vacatures**

1. Migratie `fase2_engels` (§5.3) inclusief de aangepaste policies; `rls_smoke.sql` van spec 10 aanvullen met een Engels concept dat voor `anon` onzichtbaar is.
2. Data-laag (§5.3), `mergeTranslation` en `cardWithTranslation`, aanpassing van de vacaturepagina en `/en/vacatures` (§4.6), metadata en JSON-LD (§7 punten 1 tot en met 3), sitemap.
3. Blok Engels in `VacancyForm` met `save_vacancy_translation`.
4. Tests: een vacature met Engelse tekst in een testhelper `maakTestVacature("gepubliceerd", { en: true })` (spec 14 uitbreiden).

**FD Feeds**

1. `lib/feeds/*` en `app/feeds/[portaal]/route.ts` (§4.7); renderer per portaal pas schrijven als dat portaal vrijgegeven is, de andere renderers geven tot dan een lege lijst.
2. Valideren: `curl -s http://localhost:3000/feeds/jooble.xml | xmllint --noout -` (na aanzetten in `settings`); de actuele specificatie van het portaal naast de uitvoer leggen.
3. Aanmelden bij het portaal door Jimmy met de URL uit Instellingen.

**RG Regiopagina's**

1. `content/regio/index.ts`, `pages.ts` en per regio een bestand; `scripts/regio-check.mjs` en `npm run regio:check`.
2. Pagina en componenten (§4.8), messages `messages/nl/regio.json` en `messages/en/regio.json` (§6.3) met een import in elke `messages/<locale>/index.ts` (B-45), `serviceLd` met `areaServed`, sitemap, `llms.txt`, footerregel.
3. Sub-agent `scout-regio` (§9.3).
4. Per regio pas `status: "gepubliceerd"` na de drempel en de goedkeuring.

**TL Extra talen** (per taal)

1. `i18n/scope.ts` en de wijzigingen uit §4.10 punt 1 tot en met 5 en 9 (eenmalig bij de eerste taal).
2. `scripts/i18n-export.mjs` en `scripts/i18n-import.mjs` (eenmalig); export naar de vertaler; import; regel K16.
3. Enumwaarde in `app_locale`; e-mailteksten in die taal (spec 11) of de Engelse terugval.
4. Tests: `tests/e2e/fase2/talen.spec.ts` (scope 200, buiten scope 404, geen geo-omleiding naar de taal, hreflang).

**PK Passkeys**

1. Op `groos-dev` met een testaccount nagaan dat een passkey-sessie `aal2` geeft; anders stoppen en noteren.
2. Sectie in Mijn profiel en knop op de inlogpagina (§4.11); logboek en beveiligingsmail.

Na elk onderdeel: spec 00 bijwerken (stand, afwijkingen, sub-agentkeuzes) en de nieuwe criteria in de acceptatiematrix van spec 14 zetten.

## 11 Acceptatiecriteria

Op localhost met de productieserver tegen `groos-dev` met de seed van spec 10, tenzij anders vermeld. Cron-aanroepen met `Authorization: Bearer $CRON_SECRET` en, waar genoemd, `force=1`.

| Id | Criterium | Eis |
|---|---|---|
| AC-15-01 | Op de commit van fase 1 bestaan geen tabellen `job_alerts`, `candidates`, `settings` of `indexing_notifications`, geen map `app/feeds`, geen route `/regio` en geen namespace `jobalert` (controle met `list_tables` en `grep`); elk onderdeel van deze spec staat in een eigen migratie met de naam uit §5. | E-15-01 |
| AC-15-02 | Spec 00 bevat per gebouwd onderdeel een regel met de datum van vrijgave door Djulan en welke startvoorwaarden uit §3.3 vervuld waren. | E-15-02 |
| AC-15-03 | Na het sluiten van 1001 als vervuld staat er in `indexing_notifications` precies één rij `pending`, `URL_UPDATED`, `nl` voor die vacature; een tweede wijziging voordat de cron draait maakt geen tweede rij. Na archiveren komt er een rij `URL_DELETED`. | E-15-03 |
| AC-15-04 | Op localhost zet `/api/cron/indexing` alle rijen `pending` op `skipped` met `last_error` `not_production`; met een gemockte Google-API geeft de unit-test 200 als `sent`, 429 als `pending` met het stoppen van de run, 403 als `failed`, en stopt de run bij 180 verzonden meldingen in 24 uur. | E-15-03, E-15-04 |
| AC-15-05 | Op productie (na IX-stap 5) heeft een zojuist gepubliceerde vacature binnen 20 minuten een rij met `status = 'sent'` en `response_status = 200`, en toont Instellingen die regel. | E-15-03 |
| AC-15-06 | `/jobalert?beroep=schoonmaker&plaats=rijswijk` toont de h1 "Krijg nieuwe vacatures in je mail", de checkboxen Schoonmaker en Rijswijk aangevinkt, de radioknop "Eén keer per week" gekozen en het toestemmingsvinkje uit; de pagina heeft `noindex, follow` en canonical `/jobalert`, `/jobalert` zelf is indexeerbaar. | E-15-05 |
| AC-15-07 | Verzenden zonder beroep, zonder vinkje en met e-mail "test" geeft drie veldfouten met de teksten uit §6.1 en focus op het eerste veld; zonder JavaScript gebeurt hetzelfde na een volledige paginalading. | E-15-05 |
| AC-15-08 | Een geldige aanmelding stuurt door naar `/jobalert/aangemeld`, maakt een rij in `job_alerts` met `confirmed_at` leeg, `confirm_expires_at` zeven dagen later en `consent_text_version` "2027-01", en schrijft een rij `job-alert-confirm` in `email_log`; de serverlog toont de bevestigingslink. | E-15-05, E-15-06 |
| AC-15-09 | Een GET op de bevestigingslink zet `confirmed_at` niet; pas de knop zet `confirmed_at` en maakt `confirm_token_hash` leeg. Dezelfde link daarna geeft "Deze link werkt niet meer"; de pagina heeft `<meta name="referrer" content="no-referrer">` en `noindex, nofollow`. | E-15-06 |
| AC-15-10 | Een onbevestigde jobalert met `created_at` van acht dagen geleden is na `/api/cron/onderhoud-fase2` verwijderd. | E-15-06 |
| AC-15-11 | Een bevestigde wekelijkse jobalert voor schoonmaker in Rijswijk met `confirmed_at` drie dagen geleden krijgt bij `/api/cron/jobalerts?force=1` één mail met vacature 1002 en een rij in `job_alert_deliveries`; een tweede aanroep stuurt niets. Een jobalert voor verhuizer in Wassenaar krijgt geen mail. | E-15-07 |
| AC-15-12 | De link naar 1002 in de mail eindigt op `?utm_source=jobalert&utm_medium=email&utm_campaign=weekly`; een sollicitatie via die link heeft in `applications.utm` `source` "jobalert". | E-15-07 |
| AC-15-13 | De jobalertmail heeft de headers `List-Unsubscribe` met `https://www.groospersoneelsdiensten.nl/api/jobalert/afmelden?token=` en `List-Unsubscribe-Post: List-Unsubscribe=One-Click`; een POST met `List-Unsubscribe=One-Click` op die URL geeft 200 en verwijdert de rij en haar deliveries; een tweede POST geeft ook 200. | E-15-08 |
| AC-15-14 | Op `/jobalert/beheren?token=<manage_token>` wijzigt "Wijzigingen opslaan" de frequentie naar `daily`; "Afmelden" stuurt door naar `/jobalert/afgemeld` en de rij bestaat niet meer; een onbekend token toont "Deze jobalert bestaat niet meer". | E-15-08 |
| AC-15-15 | Een jobalert met `confirmed_at` van 366 dagen geleden krijgt na `onderhoud-fase2` een mail `job-alert-reconfirm` en `reconfirm_sent_at`; met `reconfirm_sent_at` van 31 dagen geleden en zonder nieuwe bevestiging is hij na de volgende run verwijderd. | E-15-09 |
| AC-15-16 | `/vacatures?beroep=verhuizer&dienst=nacht` toont in de lege staat een link "Maak een jobalert" naar `/jobalert?beroep=verhuizer`; `/vacatures` toont het blok "Mis geen nieuw werk" na de inschrijfoproep. | E-15-10 |
| AC-15-17 | Met `settings.job_alerts_paused = true` geeft aanmelden de melding `jobalert.form.errors.paused` en verstuurt `/api/cron/jobalerts` niets. | E-15-05, E-15-13 |
| AC-15-18 | Een eigenaar nodigt via `/beheer/gebruikers` een adres uit; er ontstaat een gebruiker in `auth.users`, een actief profiel en een regel `admin.invited`. Een medewerker krijgt op `/beheer/gebruikers` een redirect met de melding geen rechten. | E-15-11 |
| AC-15-19 | De laatste actieve eigenaar deactiveren of medewerker maken geeft de melding uit `users.lastOwner`; een gedeactiveerde gebruiker kan niet meer inloggen; na `resetAdminMfa` moet de gebruiker bij het inloggen opnieuw koppelen. | E-15-11 |
| AC-15-20 | In `/beheer/profiel` wijzigt een beheerder zijn telefoonnummer naar 06 12 34 56 78; daarna toont de vacature waarvan hij contactpersoon is bij het volgende verzoek het nieuwe nummer. | E-15-12 |
| AC-15-21 | Een sjabloon "Glazenwasser met ervaring op hoogte" vult in `/beheer/vacatures/nieuw?sjabloon=<id>` titel, taken, eisen, aanbod, uren en kwalificaties in; plaats en contactpersoon blijven leeg. | E-15-14 |
| AC-15-22 | In `/beheer/privacy` geeft zoeken op `test.kandidaat@example.com` één sollicitatie; na "Alles verwijderen" met VERWIJDEREN is die sollicitatie geanonimiseerd, staat er geen cv meer onder `applications/<id>/`, en staat er een regel `privacy.erased` met alleen aantallen. Zonder de tekst VERWIJDEREN gebeurt niets. | E-15-15 |
| AC-15-23 | Een nieuw verzoek met ontvangen op vandaag heeft `due_at` precies een maand later; in de lijst staat het verzoek in rood vanaf zeven dagen voor `due_at`; in de tabel staat geen leesbaar e-mailadres. | E-15-15 |
| AC-15-24 | `/beheer/logboek?actie=vacancy&periode=7` toont alleen regels die met `vacancy.` beginnen uit de laatste zeven dagen, 50 per pagina. | E-15-16 |
| AC-15-25 | De export van sollicitaties levert een bestand `groos-sollicitaties-<datum>.csv` dat met `EF BB BF` begint, `;` als scheidingsteken heeft, geen kolom Bericht heeft, en een voornaam `=SOM(1)` als `'=SOM(1)` bevat; in `audit_log` staat `export.csv` met `{"soort":"sollicitaties","aantal":..}`. Een medewerker krijgt 403 op alles behalve `vacatures`. | E-15-17 |
| AC-15-26 | Na een sollicitatie met talentpoolvinkje bestaat er een rij in `candidates` met dezelfde naam en `retain_until` 365 dagen na `consent_at`, en heeft de sollicitatie `candidate_id`; zonder vinkje ontstaat geen kandidaat. Een tweede sollicitatie met hetzelfde e-mailadres maakt geen tweede kandidaat. | E-15-18 |
| AC-15-27 | Op de bewerkpagina van 1002 staat "Passende kandidaten" met de testinschrijver (beroep schoonmaker); "Toestemming intrekken en verwijderen" verwijdert de kandidaat, zet de gekoppelde sollicitaties met `kind = 'vacancy'` op `retention_consent = false` en anonimiseert de gekoppelde inschrijving direct (`anonymized_at` gevuld, geen cv meer onder `applications/<id>/`). | E-15-19, E-15-20 |
| AC-15-28 | Een kandidaat met `consent_at` van 366 dagen geleden is na `onderhoud-fase2` verwijderd, met zijn activiteiten. | E-15-20 |
| AC-15-29 | Publiceren van een Engelse tekst met twee taken of zonder het vinkje "zelf geschreven of laten controleren" faalt met veldfouten en laat de tekst op concept; met drie taken en het vinkje staat `is_published = true`. | E-15-21 |
| AC-15-30 | `curl "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/vacancy_translations?locale=eq.en&select=title" -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"` geeft een Engels concept niet terug en een gepubliceerde Engelse tekst wel. | E-15-21 |
| AC-15-31 | Met een gepubliceerde Engelse tekst "Window cleaner" op 1001: `/en/vacatures/glazenwasser-den-haag-1001` geeft 308 naar `/en/vacatures/window-cleaner-den-haag-1001`; die pagina heeft de h1 "Window cleaner in The Hague" zonder `lang="nl"`, geen `role="note"`-melding, canonical naar zichzelf, `hreflang="nl"` en `hreflang="en"`, en precies één `JobPosting` met `"title":"Window cleaner"` en een `url` met `/en/`. `/vacatures/glazenwasser-den-haag-1001` heeft dezelfde twee hreflang-links. | E-15-22 |
| AC-15-32 | `/sitemap.xml` bevat met die tekst zowel de NL- als de EN-URL van 1001, elk met `xhtml:link` voor `nl` en `en`; zonder Engelse tekst blijft alles zoals AC-12-13. | E-15-22 |
| AC-15-33 | Met `feeds_enabled = '{jooble}'` geeft `/feeds/jooble.xml` 200 met `application/xml; charset=utf-8` en `X-Robots-Tag: noindex`, is het geldige XML (`xmllint --noout`), bevat het de zes open seedvacatures en niet 1007; `/feeds/indeed.xml` geeft 404 zolang Indeed uit staat, net als `/feeds/onzin.xml`. | E-15-23, E-15-24 |
| AC-15-34 | Elke `link` in de Jooble-feed eindigt op `?utm_source=jooble&utm_medium=feed&utm_campaign=vacatures`, en een omschrijving met `]]>` in de tekst levert geldige XML op. | E-15-23 |
| AC-15-35 | Met `westland` op `concept` geeft `/regio/westland` 404 en staat er geen `/regio/` in de sitemap; na `gepubliceerd` geeft hij 200 met één h1, een link naar `/vacatures?plaats=naaldwijk&plaats=honselersdijk&...`, de kaart van 1003, een `FAQPage`, een `Service` met `areaServed` en een `BreadcrumbList`, en staat hij in de sitemap en `llms.txt`. | E-15-25, E-15-26 |
| AC-15-36 | `npm run regio:check` drukt voor elk van de vijf regio's het aantal vacatures in 90 dagen, het aantal open vacatures en `drempel gehaald` of `drempel niet gehaald` af; `npm run check` meldt geen `TODO` in een regiobestand met status `gepubliceerd`. | E-15-25 |
| AC-15-37 | Met `PARTIAL_LOCALES = ["tr"]`: `/tr/werkzoekenden`, `/tr/inschrijven`, `/tr/vacatures` en `/tr/werken-als/verhuizer` geven 200 met `<html lang="tr">`; `/tr/werkgevers` en `/tr/over-ons` geven 404; `/tr` geeft 308 naar `/tr/werkzoekenden`. | E-15-27 |
| AC-15-38 | Een eerste bezoek aan `/` met `x-vercel-ip-country: TR` gaat naar `/en`, niet naar `/tr`; met cookie `NEXT_LOCALE=tr` gaat `/werkzoekenden` naar `/tr/werkzoekenden` en blijft `/werkgevers` op `/werkgevers`. `/werkzoekenden` heeft een `hreflang="tr"`, `/werkgevers` niet. | E-15-28 |
| AC-15-39 | `npm run check` faalt (regel K16) zolang een bestand in `messages/tr/*.json` voor een namespace uit §4.10 punt 6 een sleutel mist of `TODO` bevat. | E-15-27 |
| AC-15-40 | Na het toevoegen van een passkey op `groos-dev` geeft inloggen met die passkey een sessie met `aal2` en toegang tot `/beheer/sollicitaties`; het logboek bevat `admin.passkey_added`; de TOTP-factor bestaat nog. | E-15-29 |
| AC-15-41 | `git diff <commit fase 1> -- package.json` toont na alle onderdelen geen nieuwe dependencies. | E-15-30 |
| AC-15-42 | `npm run check:copy` meldt in `jobalert`, `regio` en `content/regio` geen uitroepteken, geen gedachtestreepje en geen los woord u of uw; de sleutels zijn gespiegeld in `messages/nl/` en `messages/en/`. | E-15-31 |
| AC-15-43 | De verslagen van `scout-jobalert` en `scout-regio` noemen 2 tot 4 kandidaten met id, naam en preview-URL en een gemotiveerde keuze; `get_component` is per plek hoogstens één keer aangeroepen. | E-15-32 |
| AC-15-44 | Op 390, 768, 1280 en 1440 px geldt op `/jobalert` en een gepubliceerde regiopagina `scrollWidth <= innerWidth`; axe geeft geen bevindingen van niveau serious of critical; Lighthouse mobiel is 90 of hoger. | E-15-05, E-15-26 |
| AC-15-45 | Alle cron-routes van deze spec geven 401 zonder header, en `force=1` heeft op productie (`VERCEL_ENV=production`) geen effect. | E-15-33 |
| AC-15-46 | Een inschrijving met status `new` en `last_contact_at` van 56,5 dagen geleden staat na `/api/cron/herinneringen?force=1` op localhost in één mail `stale-reminder` aan de beheerders met `notify_applications`; een tweede aanroep op dezelfde dag zonder `force` stuurt niets, en zonder passende rijen komt er geen mail. Het bestand zet `maxDuration = 60`. | E-15-34 |
| AC-15-47 | Een inschrijving die automatisch is afgesloten en geanonimiseerd, heeft na de volgende run van `onderhoud-fase2` geen kandidaat meer in `candidates`. | E-15-20 |
| AC-15-48 | `/regio/<slug van een regio op concept>` en `/jobalert/bestaat-niet` geven 404 en hun HTML bevat "Deze pagina bestaat niet of niet meer"; `/jobalert` geeft 200. | E-15-05, E-15-25 |

## 12 Open vragen en aannames

| Onderwerp | Aanname in deze spec | Bevestigt | Gevolg als het anders is |
|---|---|---|---|
| Afwijking van B-27 (feeds) | B-27 zegt "feeds alleen betaald". Deze spec staat ook gratis portalen toe die aantoonbaar werken (Jooble, Werkzoeken.nl vanaf 25 vacatures), zoals de opdracht voor deze spec vraagt; Indeed alleen gesponsord. Reden: gratis bereik zonder risico, en een feed gaat per portaal aan of uit. | Djulan | Alleen betaald: `FEED_PORTALS` wordt `["uitzendbureau-nl", "indeed"]`. |
| Nieuwe namespaces (gesloten) | Afgehandeld in ronde 1 van de kruiscontrole: `jobalert`, `regio`, `content/regio/*` en `components/jobalert/*` staan met eigenaar spec 15 in 00 §4.4 en §4.4a. | kruiscontrole (gesloten) | Geen open punt meer. |
| Bestanden van andere eigenaren | Deze spec beschrijft aanvullingen in `lib/seo.ts` (12), `lib/routes.ts`, `proxy.ts`, `i18n/*` (01), `lib/data/*` en cron-routes (10), `emails/*` en `lib/email/*` (11), `_strings.ts` en de vacatureformulieren (08), `instrumentation-client.ts`, `vercel.ts`, `.env.example` (13), `check-launch.mjs` (14). De eigenaar blijft dezelfde; de bouw-agent van dit onderdeel voert de wijziging uit in overleg en noteert hem in spec 00. | kruiscontrole | Wil een eigenaar het zelf bouwen, dan levert deze spec alleen de eisen. |
| Jobalertfrequentie | Dagelijks of wekelijks; geen directe mail per vacature, omdat dat bij weinig vacatures nauwelijks verschil maakt en de daglimiet van Resend sneller raakt. | Jimmy en Lorenzo | Direct: een frequentie `instant` en een aanroep vanuit de cron `indexing` of de lifecycle. |
| Jobalert zonder klikmeting | Opnieuw bevestigen na 365 dagen, ongeacht of iemand op links klikte (context/11 noemde "zonder klik"). Klikken meten zou tracking zijn (B-09). | Djulan, jurist | Met klikmeting: een redirectroute en een kolom `last_click_at`, plus een regel in de privacyverklaring. |
| Beheertoken in de database | `manage_token` staat leesbaar in `job_alerts` (alleen server en eigenaar via RLS), omdat elke mail hem nodig heeft; het bevestigingstoken staat alleen als hash. | Djulan | Alleen hashes: een geheime sleutel en afgeleide tokens via HMAC (nieuwe env var). |
| Jobalert en sollicitatieformulier | Geen jobalertvinkje bij solliciteren; toestemming voor mail staat los (context/09). | jurist | Vinkje erbij: extra veld in spec 07 en een aanmelding zonder dubbele opt-in is dan niet toegestaan. |
| Talentpool automatisch | Iedereen met het talentpoolvinkje of een inschrijving komt automatisch in `candidates`. | Jimmy en Lorenzo, jurist | Handmatig: de trigger vervalt en er komt een knop "Toevoegen aan talentpool" bij een sollicitatie met toestemming. |
| Termijn talentpool | 365 dagen na de laatste toestemming en nooit langer dan de bewaartermijn van de gekoppelde sollicitatie of inschrijving (B-07). | jurist | Andere termijn: één regel in `candidates_before_write` en `RETENTION_DAYS`. |
| Engelse slug | Engelse paden blijven `/en/vacatures/...` (B-03); alleen de slug is Engels, met `den-haag` als plaatsdeel uit `city_slug`. | Djulan | `the-hague` in de slug: een vertaaltabel voor `city_slug` in de slugtrigger. |
| Geen automatische vertaling | Ook voor Engels geen knop "Vertaling voorstellen" (context/11 stelde die voor), omdat de opdracht menselijke vertaling eist en een slechte vertaling vertrouwen kost. | Djulan | Met voorstel: een AI-dienst en een nieuwe dependency of API-sleutel, plus het vinkje blijft verplicht. |
| Gedeeltelijke talen | Alleen de paden in `PARTIAL_SCOPE`; privacyverklaring via de Engelse versie. | jurist, Jimmy en Lorenzo | Vertaalde privacyverklaring per taal: spec 09 fase 2, en `/privacyverklaring` in de scope. |
| Taalvolgorde | Turks, Bulgaars, Pools, Roemeens (research: Turks bereikt ook Bulgaarse Turken; Bulgaren zijn de grootste EU-groep). | Jimmy en Lorenzo | Alleen de volgorde in §3.4. |
| Regio's | Westland, Rijswijk, Delft, Zoetermeer en Leidschendam-Voorburg als kandidaten; Den Haag niet. | Jimmy en Lorenzo | Andere regio's: alleen `content/regio`. |
| Drempel regiopagina | Vijf vacatures in 90 dagen en twee open bij publicatie. | Djulan | Alleen §3.3 en `regio-check.mjs`. |
| Instellingen | `settings` bevat alleen jobalert-pauze, Indexing-schakelaar en feeds; bedrijfsgegevens en openingstijden blijven in `lib/site.ts` (00 §4.4). | Djulan | Bedrijfsgegevens in de database: grote wijziging van spec 01 en 12; buiten deze spec. |
| Privacyverzoeken met hash | Het register bewaart alleen een hash van e-mail of telefoon; de beheerder vult het adres opnieuw in om te zoeken. | jurist | Leesbaar adres: kolom `requester_contact` met eigen bewaartermijn. |
| Inzage-export | JSON, geen PDF (geen extra dependency, B-37). | jurist | PDF: een package of een printvriendelijke pagina. |
| Indexing bij sluiten | `URL_UPDATED` bij sluiten (pagina blijft 30 dagen met `noindex`), `URL_DELETED` bij de 404. Context/10 en spec 12 noemen beide varianten. | Djulan | `URL_DELETED` bij sluiten: één regel in de trigger. |
| Indexing API voor een eigen site | Google beoordeelt toegang sinds 2025 strenger (context/11). Als Google de aanvraag of het gebruik weigert, blijft fase 1 (sitemap en `JobPosting`) gewoon werken. | Djulan | Onderdeel IX vervalt; `indexing_enabled` blijft uit. |
| Passkeys | Alleen als een passkey-sessie `aal2` geeft; TOTP blijft verplicht. De exacte Supabase-API is bij het schrijven van deze spec nog bèta. | Djulan | Passkey zonder `aal2`: onderdeel uitstellen; `is_admin()` niet versoepelen. |
| Cron-tijden | `jobalerts` om 05.00 UTC (06.00 of 07.00 in Nederland), zodat de mail er is voor de eerste dienst; `onderhoud-fase2` om 03.30 UTC; `herinneringen` op werkdagen om 05.00 UTC, door onderdeel BH aan `vercel.ts` toegevoegd (§5.7, B-41). | Djulan | Alleen `vercel.ts`. |
| Herinnering na 8 weken | `/api/cron/herinneringen` hoort bij fase 2 (onderdeel BH, `maxDuration` 60) en stuurt alleen een interne mail aan beheerders met `notify_applications`; de kandidaat krijgt geen mail. In fase 1 staat de herinnering alleen op het dashboard (spec 08, 09, 11). | Jimmy en Lorenzo, jurist | Ook een mail aan de kandidaat ("zoek je nog werk"): een tweede template bij spec 11 en een zin in de privacyverklaring (spec 09). |
| Resend-plan | Gratis plan tot ongeveer 80 actieve jobalerts; daarna Pro (20 dollar per maand). | Jimmy | Bij een ander plan alleen de drempel in §3.3. |
| Schattingen | Ongeveer 25 tot 30 werkdagen voor alles; context/11 schatte 8 tot 12 dagen voor een kleiner fase 2-pakket zonder regio's, talen en het volledige beheer. | Djulan | Planning per onderdeel. |

Afwijkingen van B-01 tot en met B-37: één, B-27 (feeds), zie de eerste regel van de tabel.
