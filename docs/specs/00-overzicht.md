# 00 Overzicht, beslissingslog en traceerbaarheid

| Status | Datum | Eigenaar |
|---|---|---|
| concept, ter goedkeuring aan Djulan | 2 oktober 2026 | master-agent (specsessie) |

Dit is de ingang van `docs/specs/`. Het bevat de modulelijst, het eisenregister,
de beslissingslog, de gedeelde begrippen die elke spec gebruikt, de spec-vorm,
de bouwvolgorde voor de uitvoering en de traceerbaarheidstabel. Een bouw-agent
leest eerst dit bestand en daarna de spec van zijn module.

## 1 Leeswijzer

1. Dit bestand (vooral §3 beslissingen en §4 gedeelde begrippen).
2. `CLAUDE.md` (werkafspraken en schrijfregels) en `docs/HANDOVER.md` §3
   (technische eigenschappen).
3. De spec van de module die je bouwt, plus de specs waar die van afhangt (§2).
4. De bronnen die de spec noemt in `context/`, en zo nodig `bijlagen/`.

## 1a Stand van de repo (analyse 2 oktober 2026)

De volledige inventaris staat in `bijlagen/repo-inventaris.md`; samenvattingen
van de grote contextbestanden staan in `bijlagen/samenvattingen/`.

**Wat de basis goed levert en blijft.** Een werkende Next.js 16-app met
NL op de root en EN onder `/en`, een taal-proxy die crawlers nooit omleidt, een
SEO-laag met `pageMetadata()` en JSON-LD-builders, sitemap en `llms.txt` uit
registers, werkende OG-afbeelding en iconen, een livegang-check en een
datagedreven detailpagina-template. Gecontroleerd op deze datum: `npm run verify`
slaagt (29 statische pagina's) en op localhost geven `/`, `/en`, `/sitemap.xml`,
`/robots.txt`, `/llms.txt`, `/opengraph-image` en `/icon` een 200 en geeft een
onbekend pad een 404.

**Wat te veel is en weg gaat.** De dienst- en werkgebiedmodule
(`/diensten/[slug]`, `/werkgebied/**`, `content/services`, `content/werkgebied`,
`components/werkgebied`), de JV-homepage-secties die niet bij een minimale site
passen (logoband, cijferband, ticker, projectgalerij, quote, keurmerkblok zonder
keurmerk), het Web3Forms-formulier, de effectklassen (glass, spotlight, grid),
de ongebruikte `Button` met Radix-slot en het donkere thema. Details: spec 01
(routes en bestanden), spec 02 (stijl) en spec 04 (homepage-secties).

**Wat ontbreekt en erbij komt.** Groos-routes voor twee doelgroepen, het
beroepenregister met twee perspectieven, de vacaturebank, vier formulieren met
opslag en e-mail, Supabase (schema, RLS, storage, migraties, seed), de
beheeromgeving met MFA, `not-found` en `error`-pagina's, `next/image`, de
merkidentiteit met logo, echte bedrijfsgegevens, tests en de infrastructuur
(GitHub, Vercel, domein, DNS, Resend).

Stand bij kruiscontrole ronde 2 (2 oktober 2026, avond): bouwstap 1 (spec 10
en 13 deel A, commit 28ed49d), bouwstap 2 (spec 02, 47e42fd), bouwstap 3 (spec
01 en 03, 16c35a6) en het deel van bouwstap 4 voor spec 04 (1a15c0c, gemerged
in 1668ce0) zijn gecommit op `bouw/fase-1`.

Stand bij kruiscontrole ronde 3 (2 oktober 2026, HEAD 30762de op
`bouw/fase-1`): gemerged zijn spec 09 blok A (8a719eb, in 08da643; met
`lib/legal.ts` en `WttaStatus`, zonder `FooterLegal`), spec 06 met het
vacaturedeel van spec 12 (8a89ebe, in b12c48d), spec 05 (8a4f1a5, in d2d2714),
spec 07 en 11 (99e1a03, in f20eea8) en spec 08 (542ded3, in 30762de). Er wordt
in fase 1 niet meer in een aparte worktree gebouwd. De integratie van de
parallel gebouwde delen is bij de merges gebeurd en wordt in bouwstap 3b alleen
gecontroleerd (B-52).

Stand bij kruiscontrole ronde 4 (2 oktober 2026, HEAD 3d9446e op `bouw/fase-1`):
na 30762de kwamen 0ea1b81 (server-404 via een proxy-rewrite met `isKnownPath`,
B-55), 613930d (`PrivacyAnalytics` in de layout, publicatiestatus uit
`lib/legal.ts`), ca21390 (`CtaButton` met `newTabLabel`), 1851edc (`vacatures`
uit `CLIENT_NAMESPACES`), 40d7067 (`lib/og.tsx` met `renderOgCard` en OG-routes
per beroep), 8e784af (beheermanifest met scope `/beheer`), c193539
(correctiemigratie `20261003090000_kruiscontrole_1.sql`, gecommit; of hij op
`groos-dev` staat, stelt de controle van B-57 vast) en 3d9446e (datalaag:
startmoment in de lijst, taal op het werk). Niet gecommit: `docs/specs/`,
`docs/HANDOVER-2.md`, `context/` (B-58) en de devDependencies van spec 14 in
`package.json`.

Nog niet gebouwd: stap A en B van spec 14 (er staan losse bestanden in
`tests/unit` en `tests/fixtures`, maar `package.json` heeft geen vitest,
Playwright of script `test`), `scripts/check-copy.mjs` met `check:copy` (spec 03
§10.1 stap 5), `lib/compliance/copy-rules.json` en `scripts/check-claims.mjs`
(spec 09 blok A), `components/legal/footer-legal.tsx` met `FooterLegal`
(`components/legal/footer-notices.tsx` staat er nog), sitemap, robots en
llms.txt volgens spec 12 §10, en de toolbarbronnen voor previews in
`next.config.mjs` (spec 13 §4.2) en `.env.example` volgens spec 13 §5.2. Verder
open voor 3b: (1) de schemacontrole van B-57 op `groos-dev` (gaf op 2 oktober
2026 `PGRST205`; deze checkout heeft geen `supabase/.temp/project-ref`); (2) het
zachte falen in `lib/data/vacancies.ts` en `lib/data/occupations.ts` vervangen
door gooien (B-56, AC-10-33); (3) `isKnownPath` met de slugcontrole voor
vacatures (B-55, AC-01-39); (4) het BotID-voorvoegsel
`149e9513-01fa-4fb0-aad4-566afd725d1b` in de eerste matcher van `proxy.ts` (spec
01 §4.12, B-38, K11); (5) `common.cta.callDirect` uit `messages/nl/common.json`
en `messages/en/common.json` (B-54); (6) de 21st.dev-scouting van spec 01 §9
vastleggen onder het kopje "Spec 01" in `docs/21st-keuzes.md` (AC-01-38); (7) de
scouting `scout-og` van spec 12 §9 vastleggen onder "Spec 12" in
`docs/21st-keuzes.md`, of daar "niet uitgevoerd" met de reden; (8) `FooterLegal`
in `components/legal/footer-legal.tsx` in plaats van
`components/legal/footer-notices.tsx`. Dit alles, plus de nazorg uit
kruiscontrole ronde 1, 2 en 3 op spec 01, 02, 03, 10 en 13 deel A en op elke
spec die vóór ronde 3 al (deels) gebouwd was, gebeurt in bouwstap 3b (§6); de
rest van spec 12 bouwt een agent direct na 3b, als stap 3c vóór de poort van
stap 4 (§6).

## 2 Modules

Status "concept, kruisgecontroleerd" betekent: het bestand bestaat, heeft alle
twaalf secties uit §5 en heeft kruiscontrole ronde 1 tot en met 4 doorlopen.
De kolom Bouwstand zegt wat er in de code staat (§1a).

| Nr | Spec | Bestand | Fase | Hangt af van | Status | Bouwstand |
|---|---|---|---|---|---|---|
| 00 | Overzicht, beslissingslog, traceerbaarheid | [00-overzicht.md](00-overzicht.md) | 1 | alles | concept, kruisgecontroleerd | n.v.t. |
| 01 | Informatiearchitectuur, routes, navigatie, i18n | [01-informatiearchitectuur-en-framework.md](01-informatiearchitectuur-en-framework.md) | 1 | 02, 03, 05, 10, 12 | concept, kruisgecontroleerd | gebouwd, nazorg in 3b |
| 02 | Designsysteem, merk en logo | [02-designsysteem-merk-en-logo.md](02-designsysteem-merk-en-logo.md) | 1 | — | concept, kruisgecontroleerd | gebouwd, nazorg in 3b |
| 03 | Contentstrategie, tone of voice, tekstsleutels | [03-content-tone-of-voice-en-tekstsleutels.md](03-content-tone-of-voice-en-tekstsleutels.md) | 1 | 01 | concept, kruisgecontroleerd | gebouwd, nazorg in 3b |
| 04 | Homepage en over ons | [04-homepage-en-over-ons.md](04-homepage-en-over-ons.md) | 1 | 01, 02, 03, 06, 07, 12 | concept, kruisgecontroleerd | gebouwd, nazorg in 3b |
| 05 | Beroepspagina's werkgevers en werkzoekenden | [05-beroepspaginas-werkzoekenden-en-werkgevers.md](05-beroepspaginas-werkzoekenden-en-werkgevers.md) | 1 | 01, 03 (gebruikt 02, 06, 09, 10, 12) | concept, kruisgecontroleerd | gebouwd, nazorg in 3b |
| 06 | Vacaturebank publiek | [06-vacaturebank-publiek.md](06-vacaturebank-publiek.md) | 1 | 01, 02, 03, 05, 07, 10, 12 | concept, kruisgecontroleerd | gebouwd, nazorg in 3b |
| 07 | Formulieren en leads | [07-formulieren-en-leads.md](07-formulieren-en-leads.md) | 1 | 01, 02, 03, 06, 09, 10, 11, 13 | concept, kruisgecontroleerd | gebouwd, nazorg in 3b |
| 08 | Beheeromgeving `/beheer` | [08-beheeromgeving.md](08-beheeromgeving.md) | 1 minimaal | 10, 11 (gebruikt 01, 02, 03, 13, 14) | concept, kruisgecontroleerd | gebouwd, nazorg in 3b |
| 09 | Juridisch, privacy en compliance | [09-juridisch-privacy-en-compliance.md](09-juridisch-privacy-en-compliance.md) | 1 | 01, 03, 07, 10 (gebruikt 02, 05, 11, 12, 13) | concept, kruisgecontroleerd | blok A gebouwd, nazorg in 3b; blok B in stap 8 |
| 10 | Backend: datamodel, RLS, storage, migraties | [10-backend-datamodel-rls-en-migraties.md](10-backend-datamodel-rls-en-migraties.md) | 1 | — | concept, kruisgecontroleerd | gebouwd, nazorg in 3b |
| 11 | E-mail en notificaties | [11-e-mail-en-notificaties.md](11-e-mail-en-notificaties.md) | 1 | 01, 02, 03, 07, 08, 09, 10, 13 | concept, kruisgecontroleerd | gebouwd, nazorg in 3b |
| 12 | SEO, structured data, lokale vindbaarheid | [12-seo-structured-data-en-lokale-vindbaarheid.md](12-seo-structured-data-en-lokale-vindbaarheid.md) | 1 en 2 | 01, 02, 03, 05, 06, 09, 10 | concept, kruisgecontroleerd | vacaturedeel (8a89ebe) en OG (40d7067) gebouwd; sitemap, robots, llms.txt en aansluiten in stap 3c |
| 13 | Infrastructuur, deployment, domein, DNS, e-mailrecords | [13-infrastructuur-deployment-en-domein.md](13-infrastructuur-deployment-en-domein.md) | 1 | — (raakt 01, 07, 08, 10, 11, 12, 14) | concept, kruisgecontroleerd | deel A gebouwd, nazorg in 3b; deel B tot en met H open |
| 14 | Kwaliteit, toegankelijkheid, performance, acceptatietests | [14-kwaliteit-toegankelijkheid-performance-en-acceptatie.md](14-kwaliteit-toegankelijkheid-performance-en-acceptatie.md) | 1 | 01 tot en met 13 | concept, kruisgecontroleerd | testopzet gecommit in 7332293; afronding en controle van stap A en B in 3b |
| 15 | Fase 2: jobalert, feeds, regiopagina's, Engelse vacatures | [15-fase-2.md](15-fase-2.md) | 2 | 01, 06 tot en met 14 | concept, kruisgecontroleerd | fase 2, niet bouwen |

## 3 Eisenregister en beslissingslog

### 3.1 Eisen op het hoogste niveau

Deze eisen komen uit de briefing van Djulan, de wensen van Jimmy en Lorenzo
(context/00) en de werkafspraken. Elke spec koppelt zijn eigen eisen (E-nn-xx)
en acceptatiecriteria (AC-nn-xx) aan één of meer van deze R-nummers.

| Id | Eis | Bron |
|---|---|---|
| R-01 | Twee doelgroepen (werkzoekenden en werkgevers) krijgen vanaf de homepage elk een eigen route, eigen taal en eigen formulier. | briefing, context/02, context/03 |
| R-02 | Een publieke vacaturebank met zoeken en filters, gevoed door de database. | briefing, context/00 |
| R-03 | Een beveiligde beheeromgeving waarin Jimmy en Lorenzo zelf vacatures plaatsen en sollicitaties en aanvragen afhandelen, ook op hun telefoon. | briefing, BOUWINSTRUCTIE §4.6 |
| R-04 | Vier formulieren (solliciteren, inschrijven, personeel aanvragen, contact) slaan op in de database en sturen een bevestiging en een interne melding. | BOUWINSTRUCTIE §4.5 |
| R-05 | Minimale look-and-feel, witte achtergrond, een touch blauw, zoals de meeste moderne sites. | briefing Djulan |
| R-06 | Een nieuw logo (beeldmerk en woordmerk) dat ook in één kleur en op 24 px werkt. | briefing, context/12 |
| R-07 | Alle tekst in de taal van de klant: Nederlands, in de methode van J. Versseput, B1 voor werkzoekenden, geen uitroeptekens, geen streepjes in zinnen. | briefing, HANDOVER-2, CLAUDE.md |
| R-08 | Niets één-op-één van Wilk of J. Versseput: geen tekst, beeld, huisstijl of structuurlabels. | team, context/00 |
| R-09 | SEO-laag zoals in de repo: `pageMetadata()` overal, JSON-LD via builders, sitemap en llms.txt uit registers, geen geo-redirect voor crawlers. | MIGRATIE §3, CLAUDE.md |
| R-10 | Vacatures zijn geldig voor Google for Jobs: verplichte JobPosting-velden, verlopen vacatures verdwijnen netjes. | HANDOVER §7, context/10 |
| R-11 | AVG: EU-opslag, bewaartermijnen, grondslag, verwerkersovereenkomsten en een privacyverklaring die sollicitanten dekt. | context/09 |
| R-12 | Claims alleen als ze kloppen: keurmerk, cao, Wtta-status, reactietijd, cijfers. | CLAUDE.md, HANDOVER-2 |
| R-13 | Tweetalig NL/EN met gespiegelde messages; Nederlands op de root, Engels onder `/en`. | CLAUDE.md, context/02 |
| R-14 | Mobiel eerst; werkzoekenden solliciteren in één minuut op hun telefoon. | context/02, context/04 |
| R-15 | Toegankelijk (WCAG 2.2 AA) en snel (Lighthouse mobiel 90 of hoger op home, vacature en beroepspagina). | CLAUDE.md, STAPPENPLAN J |
| R-16 | Bouw-agents zetten sub-agents in die via 21st.dev (Magic MCP) de beste elementen per plek ophalen, binnen de tokens. | briefing Djulan |
| R-17 | Alles werkt eerst volledig op localhost met gekoppelde database; de Vercel-deploy is de laatste stap. | briefing Djulan |
| R-18 | GitHub privé onder `jimmyv3-v3`, Vercel in Jimmy's account via de Git-integratie. | Djulan, CLAUDE.md |
| R-19 | Elke spec is zonder verdere vragen bouwbaar: routes, velden, sleutels, SEO en acceptatiecriteria zijn consistent. | HANDOVER §1 |
| R-20 | Fase 2 is afgebakend en blokkeert fase 1 niet: jobalert, feeds, regiopagina's, Engelse vacatures, extra talen. | HANDOVER §4 |

### 3.2 Beslissingslog

Status: **besloten** (door Djulan of het team, vastgelegd in de handovers) of
**aanname** (door de master-agent gekozen omdat de spec anders niet geschreven
kan worden; geldt tot de genoemde persoon anders beslist). Bij "gevolg" staat
wat er verandert als de beslissing anders uitvalt.

| Id | Onderwerp | Beslissing | Status | Bevestigt | Gevolg bij anders |
|---|---|---|---|---|---|
| B-01 | Merkrichting | Wit met een touch blauw, minimaal. Basis is richting C "Kobalt" uit context/12 zonder het limoenaccent: één blauwfamilie (primair kobalt, nacht voor koppen, ijs als rustige achtergrond) plus neutralen. Alleen een licht thema; geen donker thema bij lancering. Context/12 beval A (geel) aan, maar de briefing van Djulan vraagt expliciet blauw op wit. | aanname (briefing Djulan) | Jimmy en Lorenzo via Djulan | Bij keuze voor A of B verandert alleen spec 02 (tokens, fonts, logo); structuur en copy blijven. |
| B-02 | Domein en e-mail | `www.groospersoneelsdiensten.nl` (met "s") en `info@groospersoneelsdiensten.nl`. Het domein staat sinds 11 september 2026 bij STRATO met werkende mailserver. Van 3 tot 5 oktober 2026 stonden de site en het Resend-verzenddomein tijdelijk op de variant zonder "s" na "personeel" (DNS bij Mijndomein); op 5 oktober is dat teruggedraaid. `lib/site.ts` en `lib/email/config.ts` gebruiken de spelling met "s", beide adressen staan op het Vercel-project en het verzenddomein in Resend is `mail.groospersoneelsdiensten.nl` (regio `eu-west-1`, in het Resend-team van J. Versseput). DNS blijft bij STRATO volgens spec 13 §5.4 en deel E. | besloten (Djulan, 5 oktober 2026); de mailbox `info@` is nog niet door Jimmy bevestigd | Djulan, Jimmy | Alleen `lib/site.ts`, `lib/email/config.ts`, DNS en Resend-domein veranderen. |
| B-03 | Talen | NL en EN bij lancering voor alle vaste pagina's en de interface. Vacature-inhoud alleen Nederlands in fase 1; op `/en` toont een vacature een melding dat de tekst Nederlands is. Engelse paden blijven Nederlands (geen next-intl `pathnames`). Pools, Bulgaars, Turks en Roemeens in fase 2 of later. Geo-redirect blijft zoals gebouwd (eerste bezoek buiten NL en BE naar `/en`, crawlers uitgezonderd). | aanname | Djulan (paden), Jimmy en Lorenzo (talen) | Alleen Nederlands: `locales: ["nl"]` en de EN-blokken vervallen. Vertaalde paden: spec 01 §i18n en sitemap. |
| B-04 | Aanspreekvorm | "je" voor werkzoekenden, "u" voor opdrachtgevers, "je" in de beheeromgeving. Per route: `/werkzoekenden`, `/werken-als/*`, `/vacatures/*`, `/inschrijven`, `/bedankt/sollicitatie` in je-vorm; `/werkgevers/*`, `/bedankt/aanvraag`, algemene voorwaarden in u-vorm; gedeelde pagina's (`/`, `/over-ons`, `/contact`, privacy) in wij-zinnen, binnen een doelgroepblok de vorm van die doelgroep, anders u. Metabeschrijvingen volgen de doelgroep van de pagina. | aanname (voorstel 07, 02, 11) | Djulan | Alles u: alleen copy in messages en content verandert. |
| B-05 | Koppen | h1 één keer, h2 per sectie, h3 voor titels van items binnen een sectie (kaarten, kenmerken, stappen). Geen eyebrows, kickers of labels boven koppen. CLAUDE.md wordt hierop aangepast. | aanname | Djulan | Zonder h3 worden kaarttitels `p` met `font-semibold`. |
| B-06 | Vacature-invoer | Jimmy en Lorenzo zijn beiden beheerder met dezelfde rechten; geen goedkeuringsstap, publiceren kan direct. Verplicht om te publiceren: titel, beroep, werkplaats, dienstverband, uren (min en max), bruto uurloon (min en max), intro, minimaal drie taken, minimaal één eis, minimaal één punt aanbod, start (datum of per direct), sluitdatum (standaard 45 dagen), contactpersoon. | aanname | Jimmy en Lorenzo | Goedkeuringsstap: extra status `review` in spec 10 en een actie in spec 08. |
| B-07 | Bewaartermijnen | Sollicitatie op een vacature: 4 weken na eindstatus (geplaatst, afgewezen, ingetrokken); met talentpool-toestemming 1 jaar na eindstatus. Inschrijving via `/inschrijven`: hoogstens 1 jaar na de toestemming, en 4 weken na afsluiten (handmatig of automatisch) als dat eerder is. Sollicitaties en inschrijvingen zonder contact: interne herinnering na 8 weken (dashboardfilter in spec 08, geen mail), automatisch afgesloten na 12 weken (sollicitatie `rejected`, inschrijving `withdrawn`) en 4 weken later geanonimiseerd met verwijdering van het cv. Losse cv-upload zonder formulier 24 uur, personeelsaanvraag 2 jaar, contactbericht 6 maanden (spam 30 dagen), e-maillog 90 dagen, auditlog 2 jaar. Buiten de database: meldingsmails in de mailbox 4 weken, klachtdossier 1 jaar, verzoekenregister 2 jaar, datalekregister 5 jaar. Verwijderen in de database is automatisch (cron `bewaartermijnen` en `opruimen`) en omvat Storage. | aanname (context/09, 11; kruiscontrole ronde 1) | Jimmy, Lorenzo en jurist | Termijnen zijn constanten en de functie `application_retain_until` in spec 10 en tekst in spec 09. |
| B-08 | Privacyvinkje | Geen verplicht vinkje bij solliciteren, personeel aanvragen en contact: een vaste informatieregel met link naar de privacyverklaring boven de verzendknop (grondslag is precontractueel of gerechtvaardigd belang). Wel een optioneel vinkje "bewaar mijn gegevens een jaar voor ander werk" bij solliciteren en een verplicht vinkje van die strekking bij `/inschrijven` (grondslag toestemming). Jobalert (fase 2) met dubbele opt-in. | aanname (keuze uit 08, 09 en 11) | jurist via Djulan | Verplicht kennisnamevinkje: één extra veld in het zod-schema en het formulier van spec 07. |
| B-09 | Cookies | Geen cookiebanner: alleen functionele cookies (`NEXT_LOCALE`, sessiecookies in `/beheer`) en cookieloze Vercel Analytics. Wel een korte `/cookieverklaring`. Komt er tracking bij, dan een banner met Consent Mode. | aanname (context/09 leidend) | Djulan | Tracking: spec 09 en 14 krijgen een bannermodule. |
| B-10 | Klachtenregeling | Korte pagina `/klachtenregeling` in fase 1: hoe je een klacht indient, reactie binnen vijf werkdagen, wie het afhandelt. | aanname | Jimmy en Lorenzo | Weglaten: route uit spec 01 en 09, footerlink weg. |
| B-11 | Algemene voorwaarden | Route en template bestaan in fase 1; de tekst levert Jimmy (of een jurist, bijvoorbeeld op basis van NBBU-modelvoorwaarden als het lidmaatschap rond is). Tot die tijd blijft de tekst `TODO` en wordt de pagina niet gelinkt of in de sitemap opgenomen. | aanname | Jimmy | Geen gevolg voor andere specs. |
| B-12 | Backend en diensten | Supabase (Postgres, Auth, Storage, RLS) met eigen `/beheer` in dezelfde Next.js-app; Resend met React Email voor alle mail, ook de Auth-mails via SMTP; spambescherming met Vercel BotID Basic, honeypot en invultijd, en op productie rate limiting per IP-adres met de Vercel Firewall (spec 13 §5.6); Vercel Cron voor geplande taken; zod voor validatie; `@supabase/ssr` voor sessies. Productieproject: Supabase Pro, regio Frankfurt (eu-central-1), in de organisatie van Jimmy, aangemaakt via de Vercel Marketplace in Jimmy's Vercel-account. Ontwikkelproject: `groos-dev` bestaat (aangemaakt door Djulan op 2 oktober 2026) in de eigen Supabase-organisatie "Groos Personeelsdiensten" op het gratis plan (0 dollar per maand), niet in Sinka B.V.; regio eu-central-1, project-ref `smcskfrkjgniinbhqnln`, URL `https://smcskfrkjgniinbhqnln.supabase.co`. Niemand maakt dit project opnieuw aan. De claude.ai-Supabase-koppeling heeft geen rechten op deze organisatie; agents gebruiken de projectgebonden MCP-server `supabase` uit `.mcp.json` (na `/mcp` authenticeren) of de dashboardwaarden. Docker ontbreekt, dus `supabase start` kan niet; de werkwijze staat in B-39. Migraties in de repo houden beide projecten gelijk. Bescherming van de beheer-authpaden: B-50. | besloten (dev-organisatie, Djulan) en aanname (productie, rate limiting) | Jimmy (abonnementen productie, ongeveer 45 tot 65 dollar per maand) | Dev-project elders: alleen `.env.local`. Geen rate limiting: spec 13 §5.6 en artikel 9 van de privacyverklaring vervallen. |
| B-13 | Web3Forms | Vervalt. Alle formulieren gaan vanaf de eerste bouw via Server Actions naar Supabase en Resend. `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` verdwijnt uit `.env.example` en de code. | aanname (volgt uit de briefing: eerst alles lokaal, dan pas deploy) | Djulan | Tijdelijke livegang zonder backend: Web3Forms terug in spec 07 als fallback. |
| B-14 | Volgorde livegang | Eén livegang nadat site, vacaturebank en beheer werken. Preview-deploys op Vercel mogen eerder voor beoordeling door Jimmy en Lorenzo. | aanname (briefing Djulan) | Djulan | Eerder live: spec 13 krijgt een tussenstap met `noindex` op `/vacatures`. |
| B-15 | Vacature-URL en levenscyclus | `/vacatures/<functie>-<plaats>-<nummer>`; het nummer (vanaf 1001) is leidend, een afwijkende tekst in de slug geeft een 308 naar de juiste slug. Statussen: concept, gepland, gepubliceerd, gesloten (vervuld, verlopen, ingetrokken), gearchiveerd. Gesloten: 30 dagen bereikbaar met melding, `noindex, follow`, zonder JobPosting en uit de sitemap; daarna en bij archiveren een 404 via `notFound()` (een Next.js-pagina kan geen 410 teruggeven zonder extra laag in de proxy; Google behandelt 404 en 410 op termijn gelijk). Sluitdatum standaard 45 dagen na publicatie, met actie "verlengen". Hoe de 404 tot stand komt: B-55. | aanname (context/10, 11) | Jimmy en Lorenzo (termijnen) | Termijnen zijn constanten in spec 10. |
| B-16 | Filters en paginering | Filters en sortering als queryparameters (`q`, `beroep`, `plaats`, `uren`, `dienst` en `sortering` met de waarden `nieuwste` (standaard), `salaris` en `sluitdatum`) met `noindex, follow` en canonical naar `/vacatures`; de standaardsortering telt niet als filter. Paginering `?pagina=n` (n ≥ 2) met self-canonical; `?pagina=1` heeft canonical `/vacatures`. Geen ItemList met alle vacatures. | aanname (context/10) | Djulan | Geen. |
| B-17 | Sollicitatieformulier en inschrijven | Solliciteren: verplicht voornaam, achternaam, telefoon, e-mail, woonplaats, "mag je in Nederland werken" (ja of nee). Optioneel: beschikbaar vanaf, bericht, cv (pdf, doc, docx, maximaal 10 MB), rijbewijs B alleen als de vacature dat vraagt, talentpool-vinkje. Inschrijven (`/inschrijven`): dezelfde verplichte velden plus het verplichte toestemmingsvinkje (B-08); optioneel beroepen (meerdere), rijbewijs B (altijd zichtbaar), beschikbaar vanaf, bericht en cv. Nooit BSN, ID, geboortedatum, nationaliteit, foto of gezondheid. WhatsApp en bellen staan als gelijkwaardige route naast het formulier, WhatsApp met vooringevulde tekst met titel en nummer; bij een vacature alleen als `allow_whatsapp_apply` waar is. | aanname (context/09, 11, 04) | Jimmy en Lorenzo, jurist | Velden zijn één zod-schema per formulier in spec 07. |
| B-18 | Personeel aanvragen en contact | Aanvraag: bedrijfsnaam, contactpersoon, telefoon, e-mail, beroep (meerdere) of ander werk (vrij tekstveld, optioneel), aantal, start (datum of per direct), duur, uren per week, werkplaats, toelichting; KvK optioneel. Contact: naam, telefoon of e-mail, onderwerp (waaronder "bel mij terug"), bericht. Geen apart terugbelformulier. | aanname | Jimmy en Lorenzo | Geen. |
| B-19 | Scope beheer fase 1 | Inloggen (e-mail, wachtwoord, verplichte TOTP), dashboard, vacatures (aanmaken, bewerken, publiceren, plannen, sluiten, verlengen, archiveren, dupliceren), sollicitaties (lijst, detail, cv via signed URL, status, notities), aanvragen (lijst, detail, status, notities), berichten (lijst, status). Gebruikers worden uitgenodigd via het Supabase-dashboard. Fase 2: instellingen, gebruikersbeheer, sjablonen, CSV-export, privacyverzoeken, logboekweergave, talentpool. Beheerteksten alleen Nederlands, buiten `messages/`. | aanname (context/11 ingekort) | Djulan, Jimmy en Lorenzo | Meer schermen in fase 1: spec 08 §scope. |
| B-20 | E-mail | Resend (EU), verzenddomein `mail.groospersoneelsdiensten.nl` met SPF, DKIM en DMARC bij STRATO, reply-to `info@`. Fase 1: bevestiging en interne melding voor sollicitatie, inschrijving, aanvraag en contact, plus de Auth-mails (uitnodiging, wachtwoord). Nooit een cv als bijlage. | aanname (context/11) | Jimmy (DNS-toegang) | Geen. |
| B-21 | Telefoonnummers | Hoofdnummer is het nummer van Jimmy (06 83 35 19 85), ook voor WhatsApp. Beide nummers staan met voornaam op contact, over ons en bij elke vacature (contactpersoon per vacature). Een vast 070-nummer is een latere keuze van Jimmy. Een contactpersoon van een vacature heeft altijd een telefoonnummer (B-48). Het tonen van beide nummers met voornaam is vervangen door B-60; het hoofdnummer zelf is vervangen door B-66. | aanname (context/00, 03) | Jimmy en Lorenzo | Alleen `lib/site.ts`. |
| B-22 | Openingstijden en spoed | Kantoortijden (voorstel maandag tot en met vrijdag 07.00 tot 18.00 uur) verschijnen alleen als `contact.openingHours` in `lib/site.ts` gevuld is, via `common.contact.officeHoursValue` met `{opens}` en `{closes}`; er is geen claimvlag voor kantoortijden. Tot bevestiging blijft `openingHours` leeg met een TODO in `lib/site.ts`. De 24/7-claim wordt niet overgenomen; de zin over bereikbaarheid buiten kantoortijden voor spoed staat alleen achter de claim `afterHoursUrgent`. Spoedzinnen beloven geen levertijd: "Heeft u snel mensen nodig? Bel ons dan direct." Reactietermijn en levertermijn zijn aparte claims (B-49). | aanname (HANDOVER-2, kruiscontrole ronde 1) | Jimmy en Lorenzo | Alleen `lib/site.ts`, `lib/claims.ts` en messages. |
| B-23 | Adres | Hugo Coenraadspad 6, 2553 ER Den Haag staat in footer, contact, e-mailfooter en JSON-LD met de zin "Langskomen kan alleen op afspraak." (EN "Visits are by appointment only.", sleutel `common.address.byAppointment`). In het Google Bedrijfsprofiel wordt het adres verborgen met een servicegebied. | aanname (context/03) | Jimmy (postcode) | Geen. |
| B-24 | Keurmerken, cao, Wtta | Geen keurmerk, cao-naam of Wtta-status op de site tot die bevestigd is. Toegestane claim: gelijkwaardige beloning (hetzelfde loon als vaste collega's bij de opdrachtgever, artikel 8 Waadi). `/werkgevers/wtta` in fase 1 als kennispagina met eerlijke fase-tekst ("Groos bereidt de toelating voor"). | aanname (context/09) | Jimmy en Lorenzo, jurist | Keurmerk rond: strook en registerlink in spec 04 en 05. |
| B-25 | Foto's | Er zijn nog geen foto's. Het ontwerp werkt zonder foto's (typografie, iconen, blauwe vlakken); fotoslots zijn optioneel. Geen stockfoto's. | aanname | Jimmy en Lorenzo | Foto's: alleen `public/` en `lib/site.ts`. |
| B-26 | Cijfers, logo's, citaten | Geen cijferband met niet te verdedigen getallen, geen logowand, geen citaten tot er echte zijn met toestemming. De homepage toont feiten die kloppen (vijf beroepen, twee vaste contactpersonen, Den Haag). De relatie met J. Versseput wordt niet genoemd. De twee vaste contactpersonen als feit op de homepage zijn vervangen door B-60. | aanname (context/08, 12) | Jimmy en Lorenzo | Secties zijn in spec 04 als optioneel beschreven. |
| B-27 | Fase 2 | Jobalert, feeds (alleen betaald, geen gratis Indeed-feed meer), `/regio/[plaats]`, Engelse vacatures, extra talen, Google Indexing API, talentpool, CSV-export. Fase 1 steunt voor Google for Jobs op sitemap en JobPosting. | aanname (HANDOVER, context/10, 11) | Djulan | Geen. |
| B-28 | Typografie en iconen | Koppen Instrument Sans, lopende tekst Onest (met Cyrillisch) via `next/font`, subset latin en latin-ext; iconen Lucide 0.456 met lijndikte 2. Basistekst 17 px. | aanname (context/12 C) | Djulan | Alleen spec 02. |
| B-29 | Signature-elementen | De JV-effecten (glass, spotlight, grid, ticker, marquee) worden niet hergebruikt; beweging beperkt tot subtiele reveal en hover, met `prefers-reduced-motion`. | aanname (briefing: minimaal) | Djulan | Alleen spec 02 en 04. |
| B-30 | Beroepenregister | Eén register `content/beroepen/<id>.ts` per beroep met beide perspectieven (werkzoekende en werkgever) en beide slugs; vervangt `content/services`. Werkgebied-module (`content/werkgebied`) verdwijnt uit fase 1 en komt in fase 2 terug als regiopagina's. | aanname (MIGRATIE §7, context/03) | Djulan | Geen. |
| B-31 | Analytics | Vercel Analytics (cookieloos) met conversie-events per formulier. Geen Google Analytics. | aanname (context/09, 10) | Jimmy | Spec 09 en 14. |
| B-32 | Minimumleeftijd | 18 jaar alleen bij een veiligheidsreden uit het enum `min_age_reason`: werken op hoogte, bouw en sloop, heftruck of reachtruck, nachtwerk, gevaarlijke stoffen; die reden staat als zin in de tekst. Vacatures hebben een veld daarvoor. | aanname (context/09) | jurist | Spec 06, 08, 09 en 10. |
| B-34 | Tailwind CSS | Upgrade van Tailwind 3.4 naar Tailwind 4 (huidig 4.3) in bouwstap 2, samen met de nieuwe tokens: `npx @tailwindcss/upgrade`, tokens via `@theme inline` in `app/globals.css`, `tailwind.config.ts` vervalt, `tailwind-merge` naar 3.x, `components.json` met lege `tailwind.config`. Reden: shadcn/ui en vrijwel alle 21st.dev-componenten zijn op Tailwind 4 geschreven; de tokens worden toch volledig vervangen. Lukt de upgrade niet binnen één bouwstap met `npm run verify` groen, dan blijft 3.4 en noteert de bouw-agent dat in spec 00. | aanname | Djulan | Op 3.4 blijven: spec 02 levert dan een `tailwind.config.ts`-koppeling in plaats van `@theme`. |
| B-35 | Caching en data | Geen `cacheComponents` in fase 1: next-intl 4.14.9 ondersteunt `use cache` niet aantoonbaar. Publieke vacaturedata via `unstable_cache` met tags (`vacatures`, `vacature:<nummer>`) en `revalidate: 3600` als vangnet. Alle vacaturemutaties in `/beheer`, de cron en de ontwikkelroute `/api/dev/revalidate` (B-46) roepen `revalidateVacancies(numbers, kind)` uit `lib/data/revalidate.ts` (spec 10) aan: `revalidateTag` op `vacatures` en `vacature:<nummer>` met profiel `"max"` bij `kind: "content"` en `{ expire: 0 }` bij `kind: "visibility"`, plus `revalidatePath("/[locale]/vacatures", "layout")` en `revalidatePath("/sitemap.xml")`. `visibility` geldt bij publiceren, offline halen, sluiten, archiveren en verwijderen, en bij elke wijziging die de publieke staat of de slug verandert: titel of plaats van een vacature met publieke staat open of closed, verlengen van een vacature die publiek al closed is, en terugzetten naar concept of verplaatsen van een geplande vacature die publiek al open is. De keuze volgt de publieke staat vóór de actie (`publicState` uit `getVacancyForEdit`, spec 08) en de slug die `save_vacancy` teruggeeft, niet alleen de status. `content` geldt voor de overige wijzigingen aan een vacature met publieke staat open of closed; zonder publieke staat is er geen revalidatie. Vacaturepagina's: `generateStaticParams` voor gepubliceerde vacatures plus `dynamicParams = true`. Bron: `node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md`. | aanname (kruiscontrole ronde 2) | Djulan | Met Cache Components: alleen `lib/data/*` en de route-config veranderen. |
| B-36 | Formulieren en mutaties | Server Actions met React 19 `useActionState`, één gedeeld zod 4-schema per formulier in `lib/validation/*` (client en server), progressive enhancement (formulier werkt zonder JavaScript, behalve de cv-upload). Uitzondering op productie: BotID weigert op Vercel inzendingen zonder JavaScript; zo'n bezoeker ziet de weigermelding met bellen en WhatsApp. Lokaal en in de e2e-tests werkt progressive enhancement volledig. Cv-upload via een signed upload URL naar de privébucket, gevraagd na de BotID-controle. | aanname (context/11; uitzondering op productie ter bevestiging) | Djulan | Wil Djulan ook op productie formulieren zonder JavaScript: `guardSubmission` slaat BotID over als `fillMs` ontbreekt (spec 07 §12), met meer spamrisico. |
| B-37 | Nieuwe packages | Dependencies: `@supabase/supabase-js` 2.x, `@supabase/ssr` 0.12.x, `zod` 4.x, `resend` 6.x, `@react-email/components` 1.x, `botid` 1.x, `tailwind-merge` 3.x, `tw-animate-css` 1.x (spec 02), `server-only` 0.0.1. DevDependencies: `tailwindcss` 4.x, `@tailwindcss/postcss` 4.x, `sharp` 0.35.x (spec 02), `@vercel/config` 0.8.0 exact (spec 13), `vitest` 5.x, `vite` 8.x, `@playwright/test` 1.63.x, `@axe-core/playwright` 4.13.x (spec 14). De supabase-CLI via npx. Bestaande packages van de startcommit (onder meer `next`, `next-intl`, `@base-ui-components/react`, `lucide-react`, `framer-motion` tot bouwstap 4) blijven. Geen andere dependencies zonder vermelding in de spec van de module en in deze regel. | aanname | Djulan | Geen. |
| B-38 | `/beheer` en `proxy.ts` | `/beheer` blijft buiten de taalrouting en de geo-redirect, maar `proxy.ts` ververst er de Supabase-sessie. Config: `matcher: ["/((?!api\|beheer\|feeds\|monitoring\|_next\|_vercel\|149e9513-01fa-4fb0-aad4-566afd725d1b\|opengraph-image\|twitter-image\|icon\|apple-icon\|.*\\..*).*)", "/beheer/:path*"]`; `proxy()` begint met `if (pathname === "/beheer" \|\| pathname.startsWith("/beheer/")) return beheerProxy(request);` (`app/beheer/_lib/proxy.ts`, spec 08 §4.13): alleen `updateSession()` (spec 10) en optimistische 307-redirects, geen next-intl, geen geo-redirect, geen `NEXT_LOCALE`, geen databasequery. Het BotID-voorvoegsel gaat nooit door de proxy. Reden: Server Components kunnen geen ververste sessiecookies schrijven, waardoor beheerders anders elk uur opnieuw moeten inloggen. | aanname (kruiscontrole ronde 1, spec 08 en 10) | Djulan | Helemaal buiten de proxy: spec 08 ververst met een browserclient in de beheerlayout, AC-08-39 wordt handmatig, spec 01 en 14 K11 krijgen de oude matcher terug. |
| B-39 | Werkwijze Supabase zonder Docker | Migraties gaan alleen met `npx supabase db push --linked` vanuit `supabase/migrations/` naar een project, nooit met `apply_migration` van de MCP. De MCP wordt alleen gebruikt om te lezen (`list_tables`, `get_advisors`, `generate_typescript_types`, `get_project_url`, `get_publishable_keys`) en om de seed met `execute_sql` te draaien als `psql` ontbreekt, en voor `notify pgrst, 'reload schema';` uit B-57. Volgorde op een leeg project: (1) `npx supabase db push --linked` zonder `--include-seed`; (2) `npm run db:admin -- --email <adres> --full-name <naam> --display-name <voornaam> --phone <E.164>`; (3) alleen op `groos-dev` de seed met `psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/seed.sql`; (4) `npm run db:types`. Productie krijgt nooit seed-data; beheerders daar via Invite user en `public.grant_admin(...)`. `supabase config push` wordt nooit gedraaid: Auth-instellingen, e-mailtemplates (bron `supabase/templates/*.html`, spec 11) en SMTP zet Djulan per project in het dashboard (spec 13 A2, D5 tot en met D7); de `[auth]`-blokken in `supabase/config.toml` documenteren alleen. Bouwstap 1 is gecommit; of `groos-dev` de migraties heeft, controleer je met AC-10-01 en de REST-controle uit spec 13 A5 stap 4a (B-57). Schemawijzigingen uit de kruiscontrole staan in een nieuw migratiebestand (`20261003090000_kruiscontrole_1.sql`, gecommit in c193539); bestaande migratiebestanden blijven ongewijzigd. Nooit: `supabase start`, `stop`, `db diff`, `db pull`, `db reset`, `config push`. | aanname (volgt de gebouwde `supabase/config.toml` en spec 13) | Djulan | Met `config push` voor `groos-dev`: spec 10 stap 7 en spec 11 stap 11 krijgen hun push terug en `config.toml` wordt de bron voor dev; productie blijft dashboard. |
| B-40 | Publicatiestatus juridische documenten | `lib/legal.ts` (spec 09) is de enige bron voor versie, conceptstatus en publicatiestatus van privacyverklaring, cookieverklaring, klachtenregeling en algemene voorwaarden. `lib/routes.ts` (spec 01) zet `published` van die vier routes met `getLegalDoc(<id>).published`; `lib/legal.ts` is client-veilig en importeert `lib/routes.ts` niet. Footer (`FooterLegal`), sitemap, llms.txt en `noindex` lezen deze waarde. | aanname (kruiscontrole ronde 1) | Djulan | Geen; alleen import in `lib/routes.ts`. |
| B-41 | Cron-taken fase 1 | Precies drie Vercel Cron-taken, tijden in UTC: `/api/cron/vacatures` `*/15 * * * *`, `/api/cron/bewaartermijnen` `0 2 * * *`, `/api/cron/opruimen` `30 2 * * *` (spec 10 eigenaar van de routes, spec 13 van `vercel.ts`). Geen cron voor herinneringsmails in fase 1; de herinnering na 8 weken is een dashboardfilter. `maxDuration` 60 tenzij een spec een hogere waarde met reden noemt. Elk kwartier draaien vraagt Vercel Pro; op Hobby dagelijks. | aanname | Djulan | Herinneringsmail in fase 1: spec 10 en 11 krijgen een vierde route. |
| B-42 | Wettelijk minimumuurloon | Eén constante: `MINIMUM_WAGE_21_PLUS = 14.99` in `lib/data/options.ts` (spec 10), geldig vanaf 1 juli 2026, bijwerken per 1 januari en 1 juli. Spec 05, 08 en 09 importeren deze constante; `WML_HOURLY` vervalt. Het beheer waarschuwt (blokkeert niet) bij een lager bruto uurloon. | aanname | Djulan | Geen. |
| B-43 | Werkgebied in tekst en JSON-LD | Tot de claim `workArea` bevestigd is: in tekst "Den Haag" of "Den Haag en omgeving", in JSON-LD `areaServed` alleen Den Haag (`City`), in het Google Bedrijfsprofiel servicegebied Den Haag. Na bevestiging komt `Haaglanden` (`AdministrativeArea`) erbij en het servicegebied Den Haag, Rijswijk, Delft, Westland, Zoetermeer, Leidschendam-Voorburg en Wassenaar. | aanname (spec 03 woordenlijst, spec 09 CL-14) | Jimmy en Lorenzo | Alleen `lib/claims.ts`. |
| B-44 | Paginatitels | `pageMetadata()` (spec 12) zet het merkachtervoegsel zelf met `brandedTitle()`: " \| Groos Personeelsdiensten", of " \| Groos" als het totaal anders boven 60 tekens komt, en geeft een absolute titel terug; een titel zonder merk is alleen een vangnet. `meta.titleTemplate` is ook alleen een vangnet. Het eigen deel van een titel is bij voorkeur 25 tot 45 tekens en hoogstens 52 tekens, zodat er altijd minstens " \| Groos" achter past; `pageMetadata()` geeft in development een `console.warn` als het eigen deel langer is dan 52 tekens. Pagina's met een korte naam (Contact, Over ons, Personeel aanvragen, Inlenen en de Wtta, Werk vinden via Groos en de juridische documenten) mogen korter zijn dan 25 tekens. In het beheer heeft het veld SEO-titel de hint "hoogstens 45 tekens" (databasegrens 60). Teksten van titels en beschrijvingen staan alleen bij de eigenaar van de namespace (05 voor beroepspagina's, 06 voor vacatures); spec 12 levert helpers en regels, geen eigen copy. Uniciteit van titels geldt per taal (B-53). | aanname (kruiscontrole ronde 2) | Djulan | Strikt 25 tot 45 tekens: de korte titels in spec 04, 05 en 07 en de lange beroepstitels in spec 05 opnieuw schrijven. |
| B-45 | Indeling messages | Eén JSON-bestand per namespace en per taal: `messages/nl/<namespace>.json` en `messages/en/<namespace>.json`, gespiegeld, samengevoegd in `messages/<locale>/index.ts` (eigenaar spec 01). Een nieuwe namespace is één bestand per taal plus één import in elke `index.ts`. `messages/nl.json` en `messages/en.json` bestaan niet meer; specs noemen het bestand van de namespace, bijvoorbeeld `messages/nl/home.json`. Gebouwd in bouwstap 3 (commit 16c35a6), zodat specs parallel aan hun eigen namespace werken. E-mailteksten staan niet in messages maar als `COPY = { nl, en }` in `emails/*.tsx` (spec 11, 00 §4.4 punt 7). De vorm van een namespacebestand staat in B-47. | besloten (gebouwd in bouwstap 3) | Djulan | Terug naar twee bestanden: alleen `messages/<locale>/index.ts`, `i18n/request.ts`, `scripts/check-launch.mjs` (K1) en `scripts/check-copy.mjs` veranderen. |
| B-46 | Testtoestand `groos-dev` | De seed heeft relatieve datums, en acceptatietests rekenen op de toestand direct na het seeden. `npm run db:seed:reset` (spec 10, `scripts/supabase/seed-reset.mjs`) stopt als `SUPABASE_DB_URL` de ref `smcskfrkjgniinbhqnln` niet bevat, en draait daarna `supabase/seed-reset.sql` en `supabase/seed.sql` met `psql`. `seed-reset.sql` is één transactie die weigert als er vacatures zijn en geen enkele `vacancy_translations.summary` met "Testvacature." begint. Daarna verwijdert hij activiteiten, e-maillog, sollicitaties, aanvragen, berichten en vacatures; beheerders en `audit_log` blijven. De seed zet de relatieve datums opnieuw en de sequence op 1010. Vanuit een shell of test ververst `POST /api/dev/revalidate` (spec 10, Bearer `CRON_SECRET`, body `{ numbers, kind }`) de cache via `revalidateVacancies`; bij `VERCEL_ENV === "production"` geeft die route 404. Cv-bestanden onder `cvs/applications/` in `groos-dev` verwijdert `scripts/e2e-voorbereiden.mjs` (spec 14) vóór de reset. Productie krijgt nooit een reset of seed (B-39). | aanname (kruiscontrole ronde 2) | Djulan | Zonder reset worden AC's met seedtoestanden handmatig en hangt hun uitkomst af van de dag. |
| B-47 | Vorm van namespacebestanden | Een namespacebestand `messages/<locale>/<namespace>.json` bevat alleen de sleutels van die namespace, zonder de namespace als bovenste sleutel: `messages/nl/home.json` begint met `"hero"`, en `messages/<locale>/index.ts` zet het bestand onder de naam van de namespace. Sleutelbomen in de specs tonen de namespace als bovenste sleutel alleen voor de leesbaarheid. Een AC of grep op een namespacebestand gebruikt het sleutelpad zonder de namespace, bijvoorbeeld `story.founding` in `messages/nl/about.json`. Vult B-45 aan. | besloten (zo gebouwd in bouwstap 3, 16c35a6) | Djulan | Met wrapper: elke `index.ts` en elk namespacebestand verandert; de specs niet. |
| B-48 | Contactpersoon met telefoonnummer | Een vacature is alleen publiceerbaar met een actieve contactpersoon met `phone_e164` (punt (8) van de correctiemigratie van spec 10, B-21). De seed (spec 10 §5.11) kiest `v_a` en `v_b` daarom alleen uit actieve beheerders met een telefoonnummer. Het e2e-beheeraccount (spec 14 §5.6) krijgt `p_phone: "+31600000099"`. Het beheer (spec 08) biedt in de select `contact_admin_id` alleen beheerders met een telefoonnummer aan (`listAdminOptions` met `hasPhone`), en `S.validation.publish.contact` luidt "Kies een contactpersoon met een telefoonnummer.". Elke echte beheerder krijgt bij `npm run db:admin` een `--phone`. | aanname (kruiscontrole ronde 3) | Jimmy en Lorenzo | Zonder telefoonnummer: punt (8) vervalt en spec 06 toont een vacature zonder belknop. |
| B-49 | Reactietermijn en levertermijn | Twee aparte claimvlaggen in `lib/claims.ts` (spec 03). `responseTime` (CL-05) dekt alleen hoe snel Groos reageert op sollicitaties en aanvragen. `deliverySpeed` (CL-09, nieuw, standaard `false`) dekt elke uitspraak over hoe snel iemand kan beginnen. Een tekst achter `responseTime` noemt geen levertermijn: de FAQ "Hoe snel kunt u iemand sturen?" noemt achter `responseTime` alleen de reactietermijn en zegt dat de start afhangt van beroep, werktijden en certificaten. Spoedzinnen zonder termijn ("Heeft u snel mensen nodig? Bel ons dan direct.") hebben geen vlag nodig (B-22). | aanname (kruiscontrole ronde 3) | Jimmy en Lorenzo | Bevestigde levertermijn: `deliverySpeed` op true, en de tekst krijgt de termijn. |
| B-50 | Bescherming van de beheer-authpaden | De WAF-regel `beheer-inloggen` (spec 13 §5.6) geldt voor POST op `/beheer/inloggen`, `/beheer/mfa`, `/beheer/mfa/koppelen` en `/beheer/wachtwoord-vergeten`: 10 per 600 seconden per IP-adres, daarna 429, direct in modus `rate_limit`. BotID beschermt POST op `/beheer/inloggen` en `/beheer/wachtwoord-vergeten`. `requestPasswordReset` (spec 08) begint met `isBotRequest()` en toont bij een bot dezelfde bevestiging `S.auth.forgot.sent`, zonder Supabase aan te roepen. Vult B-12 aan. | aanname (kruiscontrole ronde 3) | Djulan | Geen; alleen de WAF-regel in Vercel en `instrumentation-client.ts`. |
| B-51 | Lokale variabelen in AC-opdrachten | `CRON_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` en de andere app-variabelen staan alleen in `.env.local` en worden geen shellvariabelen. Een AC of scriptmelding die ze in een shellopdracht gebruikt, gaat uit van een shell waarin eerst `set -a; . ./.env.local; set +a` draaide (spec 13 A3 stap 9). `SUPABASE_DB_URL` blijft een shellvariabele en is ook nodig voor `npm run db:seed:reset` en voor elke lokale e2e-run (spec 14 §5.8). | aanname (kruiscontrole ronde 3) | Djulan | Geen. |
| B-52 | Bouwstand en bouwstap 3b na ronde 3 | Op 2 oktober 2026 (HEAD 30762de) zijn 04, 05, 06 met het vacaturedeel van 12, 07 met 11, 08 en 09 blok A gemerged op `bouw/fase-1`; in fase 1 wordt niet meer in een aparte worktree gebouwd. Bouwstap 3b bouwt de ontbrekende basis (00 §1a). Daarna voert een nazorg-sub-agent per gebouwde spec (01, 02, 03, 04 tot en met 09, 10, 11, het vacaturedeel van 12 en 13 deel A) de wijzigingen uit kruiscontrole ronde 2 en 3 uit. Ten slotte controleert 3b de integratie: één `components/contact/contact-person-card.tsx` met de props van spec 07; `ApplySection` op de vacaturepagina alleen bij `state === "open"`; `BeroepVacancies` rendert `VacancyList` van spec 06; `HomeVacancies` rendert `LatestVacancies`; geen "TODO formulier uit spec 07" of "TODO VacancyCard" meer in `app` en `components`. Wat 8a89ebe van spec 12 nog niet bouwde (sitemap, robots en llms.txt en het aansluiten van 04, 05, 07 en 09 volgens spec 12 §10; `lib/og.tsx` en de OG-routes staan er sinds 40d7067), bouwt een agent op `bouw/fase-1` direct na 3b en vóór de poort van stap 5. | besloten (stand van de repo) | Djulan | Geen. |
| B-53 | Unieke titels per taal | Een paginatitel is uniek binnen dezelfde taal: NL-URL's onderling en `/en`-URL's onderling. Taalvarianten die via hreflang aan elkaar gekoppeld zijn, mogen dezelfde titel hebben, zoals "Contact \| Groos Personeelsdiensten" op `/contact` en `/en/contact`. Dit geldt voor E-12-02, AC-12-20 en de WCAG-regel 2.4.2 in spec 14. Vult B-44 aan. | aanname (kruiscontrole ronde 3) | Djulan | Uniek over beide talen heen: spec 07 krijgt een andere Engelse titel (bijvoorbeeld "Contact us") en spec 12 controleert over alle URL's. |
| B-54 | Zichtbaar label in de toegankelijke naam | Krijgt een knop of link een `ariaLabel`, dan begint die met het zichtbare label (WCAG 2.5.3). De belknop met `ariaLabel` `header.callAria` ("Bel ons op {phone}") heeft daarom het label `common.cta.call` ("Bel ons" / "Call us") op home, `/werkgevers` en `/werkgevers/[beroep]`, en `common.cta.callDirect` vervalt. WhatsApp-knoppen met `common.cta.whatsappPerson` ("App {name}") krijgen geen `ariaLabel`. Hun naam is het label plus `common.opensInNewTab`, en `common.a11y.whatsappPerson` vervalt. | aanname (kruiscontrole ronde 3) | Djulan | Geen; alleen labels in spec 04, 05 en 07 en twee sleutels in spec 03. |
| B-55 | 404-weergave | Een onbekend pad krijgt zijn 404 in `proxy.ts`: is de respons van next-intl geen 3xx en geeft `isKnownPath(pathname)` uit `lib/routes.ts` onwaar, dan herschrijft de proxy met status 404 naar `/<locale>/pagina-niet-gevonden` (`NOT_FOUND_PATH`) met de verzoekkopregel `x-groos-not-found: 1` (`NOT_FOUND_HEADER`); `app/[locale]/[...rest]/page.tsx` rendert dan `NotFoundView` op de server en roept zonder die kopregel `notFound()` aan. `isKnownPath` loopt gelijk met de mappen onder `app/[locale]`; elke nieuwe publieke route (ook `/jobalert/*` en `/regio/[plaats]` van spec 15) voegt zichzelf daar toe. Voor `/vacatures/<slug>` geeft hij alleen waar als `parseVacancySlug(slug)` een nummer geeft, zodat `/vacatures/onzin` de volledige server-404 krijgt. Een 404 die van de database afhangt (onbekend nummer, concept, gepland, gesloten na 30 dagen, gearchiveerd, en `outOfRange` op `/vacatures`) blijft `notFound()` in de pagina: status 404 en `noindex` staan in de respons, maar Next 16.3 rendert de inhoud van `not-found.tsx` pas in de browser. De proxy doet geen databasequery. Vult B-15 en B-16 aan. | aanname (kruiscontrole ronde 4; gebouwd in 0ea1b81) | Djulan | Moet ook de database-404 volledig op de server staan: de proxy krijgt `vacancyIsReachable(number)` in `lib/data/vacancy-exists.ts` (REST-lezing op `public_vacancies` met de publishable key, geheugen-TTL 60 s, bij netwerkfout doorlaten) en AC-06-20 eist de h1 in de server-HTML; dat kost één Supabase-verzoek per niet-gecachte vacatureweergave. |
| B-56 | Fouten in publieke leesfuncties | Geeft Supabase een fout (een `error` in het antwoord of een mislukte fetch), dan gooien alle publieke leesfuncties in `lib/data/*` een `Error` met de plek en de Supabase-code en geven ze geen `[]`, `null` of `0`; het resultaat wordt niet gecachet. `error.tsx` van spec 01 toont de foutpagina, een ISR-verversing houdt de vorige versie, en een build tijdens een Supabase-storing faalt terwijl de vorige deploy live blijft. Alleen als `hasSupabaseEnv()` onwaar is, geven ze een leeg resultaat met één `console.warn`, zodat `npm run build` zonder `.env.local` slaagt. Het zachte falen in de gebouwde `lib/data/vacancies.ts` en `lib/data/occupations.ts` (`logFailure`, "mislukt, leeg resultaat") vervalt in de nazorg van bouwstap 3b (spec 10 §4.3 punt 10, AC-10-33, AC-06-38). | aanname (kruiscontrole ronde 4) | Djulan | Zacht falen: spec 10 §4.3 punt 10, AC-10-33 en AC-06-38 vervallen; een storing toont dan "geen vacatures" en een 404 op live vacatures. |
| B-57 | Schemacontrole op een Supabase-project | Na elke `npx supabase db push --linked`, en als eerste poort van bouwstap 3b, draait de agent de REST-controle uit spec 13 A5 stap 4a: `curl` op `/rest/v1/occupations?select=slug` met de publishable key geeft de vijf beroeps-id's (AC-13-05). Bij `PGRST205`: (a) `cat supabase/.temp/project-ref` moet `smcskfrkjgniinbhqnln` geven, anders eerst `supabase link` (spec 13 A4 stap 2); (b) MCP `execute_sql` met `select to_regclass('public.occupations'), to_regclass('public.public_vacancies')`, en bij `null` `npm run db:status` en `npx supabase db push --linked`; (c) bestaan de tabellen, dan zet Djulan in het dashboard onder Project Settings, Data API de Data API aan met `public` in Exposed schemas en voert de agent via MCP `execute_sql` `notify pgrst, 'reload schema';` uit. Seed (A7), `npm run db:types` en elke AC die data leest, wachten op deze controle, samen met AC-10-01 en AC-13-04. Op 2 oktober 2026 gaf `groos-dev` `PGRST205` en had deze checkout geen `supabase/.temp/project-ref`. Vervangt in B-39 de zin dat `groos-dev` de migraties heeft, en staat naast de seed `notify pgrst` toe als schrijvende `execute_sql`. | aanname (kruiscontrole ronde 4) | Djulan | Geen. |
| B-58 | Specs en context in Git | Vóór het vervolg van bouwstap 3b commit de agent op `bouw/fase-1` `docs/specs/` (met `bijlagen/` en `assets/logo/`) en `docs/HANDOVER-2.md` met het bericht "Specs fase 1 na kruiscontrole ronde 4". `context/` zonder `context/_input/` (staat in `.gitignore`) volgt in een eigen commit zodra context 06, 07 en 14 er zijn (B-33), en uiterlijk in de commit vóór de eerste push naar `jimmyv3-v3`, ook als ze dan nog ontbreken. De correctiemigratie `20261003090000_kruiscontrole_1.sql` is al gecommit (c193539). De eerste push blijft een beslissing van Djulan (spec 13 deel B stap 3, met de controle `git ls-files docs/specs \| wc -l` gelijk aan `find docs/specs -type f \| wc -l`). | aanname (kruiscontrole ronde 4) | Djulan | context/ pas na 06, 07 en 14: vóór de eerste push `git rm -r --cached context`; specs en HANDOVER-2 blijven gecommit. |
| B-59 | Logo (vervallen) | Vervangen door B-61. De eerdere logoconcepten en hun bestanden zijn verwijderd. | vervallen (3 oktober 2026) | Djulan | Geen. |
| B-60 | Geen persoonsnamen, één nummer, team-CTA | De publieke site, de e-mails aan kandidaten en opdrachtgevers en alle content noemen Jimmy en Lorenzo niet bij naam; de tekst spreekt van "ons team" (EN "our team"). Er staat één telefoonnummer op de publieke site: het hoofdnummer 06 83 35 19 85 uit `lib/site.ts`, ook voor WhatsApp; het tweede nummer staat nergens meer (sinds B-66 is 06 52 54 95 39 het hoofdnummer en staat het andere nummer alleen in de footer). De personenkaarten op home, over ons, contact en de vacaturepagina en de ondertekening van de e-mails zijn vervangen door één teamblok (`TeamContactCard`, `EmailSignoff`) met het nummer, WhatsApp en e-mail. De algemene oproep is "Kom in contact met ons team" (EN "Get in touch with our team", `common.team.title`); waar een naam in een knop stond, staat nu "Bel ons" en "App ons". Vervangt de delen van B-21 en B-26 over het tonen van beide personen (twee nummers met voornaam, twee vaste contactpersonen); de contactbeheerder van een vacature blijft alleen intern in `/beheer` en de database bestaan. | besloten (Djulan, 3 oktober 2026) | Djulan | Terugdraaien vraagt `people` in `lib/site.ts`, de sleutels `callPerson` en `whatsappPerson` en de personenkaart terug; de copy in messages, content en e-mails moet dan opnieuw. |
| B-61 | Logo van de klant | Het logo is het beeldmerk dat de klant heeft gekozen: een G in drie delen (bovenboog met vlakke balk, kom linksonder, rechterblok met de balk naar binnen en de schuine afsnede rechtsonder) met links een sikkel. De vorm is één op één overgenomen van het aangeleverde beeld (afwijking overal kleiner dan een half procent van de breedte van het beeldmerk) en is vlak: G in nacht `#0B0F2E`, sikkel in kobalt `#2741C9`, zonder zilver, reliëf, schaduw of zwart vlak. De letters van het aangeleverde beeld zijn niet overgenomen; het woordmerk "groos" en de beschrijver "Personeelsdiensten" blijven in het lettertype van de site staan zoals ze stonden. Opbouw horizontaal (beeldmerk links, in header en footer) en gestapeld (beeldmerk boven het woordmerk); het icoon is de kobalt tegel met het witte beeldmerk (favicon, apple-icon, app-iconen van het beheer). Bronbestanden in `docs/specs/assets/logo/` (`logo-mark.svg`, `logo-horizontaal.svg`, `logo-gestapeld.svg`, `icoon.svg`, `overzicht.svg` en `overzicht.png`); bouw via `node scripts/extract-logo.mjs` en `node scripts/brand-assets.mjs` (spec 02 §4.11). Vervangt B-59. | besloten (klant via Djulan, 3 oktober 2026) | Jimmy en Lorenzo via Djulan | Een wijziging van het beeldmerk vraagt alleen nieuwe paden in `logo-mark.svg` en twee scriptruns; componenten en routes blijven gelijk. |
| B-62 | Tweestapsverificatie optioneel | Inloggen op Groos Beheer gaat met e-mailadres en wachtwoord. Een authenticator-app koppelen is per account vrijwillig en kan op `/beheer/mfa/koppelen`. Wie een app heeft gekoppeld, wordt bij elke aanmelding om de code gevraagd en krijgt zonder die code geen beheerdata. De regel staat op twee plekken die gelijk moeten blijven: `is_admin()` en `is_owner()` in `20261003100000_mfa_optioneel.sql` (aal2, of geen geverifieerde factor in `auth.mfa_factors`) en `getSessionState()` in `app/beheer/_lib/auth.ts`. De proxy controleert alleen nog of er een sessie is. `supabase/tests/rls_smoke.sql` dekt beide gevallen. Vervangt de vaste aal2-eis in spec 08 §4.4, §4.5 en §4.13, spec 10 §5.4 en §5.8 en AC-10-08; de e2e-aanmelding met TOTP (spec 14 §5.6) blijft werken omdat dat testaccount een factor heeft. | besloten (Djulan, 3 oktober 2026) | Djulan | Beheer bevat persoonsgegevens en cv's van kandidaten en is nu met alleen een wachtwoord bereikbaar. Opnieuw verplichten vóór livegang vraagt een migratie die de aal2-eis in beide functies terugzet en in `getSessionState()` de doorverwijzing naar `/beheer/mfa/koppelen`. |
| B-63 | Hosting in het bestaande Vercel-account van Jimmy | De site draait in het bestaande Vercel-account van Jimmy, in hetzelfde team als J. Versseput (`jim-versseputs-projects`, waar `jimmyv3-v3/website` deployt). Er komt geen apart team "Groos Personeelsdiensten" en er komen geen extra leden. Het project heet `groos-personeelsdiensten` en wordt gekoppeld aan de repo `jimmyv3-v3/groos`. Vervangt C1 en C2 in spec 13 deel C; C3 tot en met C7 blijven gelden met dit team als `<groos-team>`. De Supabase-organisatie van de Marketplace (deel D) hoort dan ook bij dit team. | besloten (Djulan, 3 oktober 2026) | Djulan | Het team staat op Hobby en blijft daar (B-65). Toch een eigen team: C1 en C2 gelden weer en het project verhuist via Settings, Transfer Project. |
| B-65 | Geen betaalde hosting: Vercel Hobby | Het team van Jimmy staat op Hobby, net als zijn andere sites, en Groos betaalt niet voor hosting. De bouw gaat uit van de grenzen van Hobby. (1) Een cron mag één keer per dag draaien: `/api/cron/vacatures` draait dagelijks om 03.00 uur UTC in plaats van elk kwartier, en op Hobby start een taak ergens in het opgegeven uur. Een geplande vacature komt nog steeds op tijd online en een verlopen vacature sluit op tijd, omdat de view `public_vacancies` de publieke staat uit `publish_at` en `closes_at` berekent; zonder de cron ververst de cache binnen ongeveer een uur (`REVALIDATE_SECONDS` in `lib/data/vacancies.ts`). Alleen de status in de database en het archiveren lopen tot een dag achter. (2) Skew Protection is er niet. (3) Er zijn geen extra leden; alles gaat via het ene account (B-63). (4) De WAF-regels uit spec 13 §5.6 gelden voor zover Hobby ze toelaat; dat blijkt bij het instellen. Vervangt het cron-schema in spec 13 §4.3 en §5.7 en spec 10 §4.6, de regel Skew Protection in spec 13 C4 en het plan en de kosten voor Vercel in spec 13 §5.8. | besloten (Djulan, 3 oktober 2026) | Djulan | De voorwaarden van Vercel staan Hobby alleen toe voor niet-commercieel gebruik; Vercel kan een bedrijfssite op Hobby stilzetten. Naar Pro (20 dollar per maand): het schema in `vercel.ts` terug naar `*/15 * * * *` en Skew Protection aan, zonder verdere codewijziging. |
| B-64 | Eén beheeraccount | Groos Beheer krijgt één gedeeld account met de rol `owner`, in plaats van een eigen account voor Jimmy en voor Lorenzo. Het account ontstaat op `groos-dev` met `npm run db:admin` en op productie met één aanroep van `grant_admin` (spec 13 D11). Code en datamodel blijven gelijk. Vervangt het deel van B-06 over twee beheerders, de regel "Aantal beheerders" in de open vragen van spec 08 en de twee uitnodigingen in spec 13 D11. | besloten (Djulan, 3 oktober 2026) | Djulan | Met een gedeeld account is achteraf niet te zien wie een wijziging deed, en bij vertrek van een persoon moet het wachtwoord worden gewijzigd. Met B-62 is dat ene account met alleen een wachtwoord bereikbaar. Toch twee accounts: een tweede aanroep van `grant_admin`, zonder codewijziging. |
| B-66 | Hoofdnummer 06 52 54 95 39, planningsnummer alleen in de footer | Het hoofdnummer van de publieke site is 06 52 54 95 39 (`+31652549539`, acquisitie), ook voor WhatsApp, de e-mails, de JSON-LD en `/llms.txt`. Het nummer 06 83 35 19 85 (`+31683351985`, planning, administratie en infra) staat alleen in het contactblok van de footer, onder het hoofdnummer, met het label "Planning" (EN "Scheduling", `footer.planningPhone`); het staat op geen enkele andere plek, heeft geen WhatsApp-link en staat niet in de JSON-LD. De notatie blijft die van spec 03 §6.6. Vervangt het deel van B-21 en B-60 over welk nummer het hoofdnummer is en de zin van B-60 dat het tweede nummer nergens meer staat; de rest van B-60 (geen persoonsnamen, één teamblok) blijft gelden. | besloten (Djulan, 5 oktober 2026) | Djulan | Alleen `HOOFDNUMMER` en `PLANNINGNUMMER` in `lib/site.ts`, de regel in `SiteFooter`, plus de tests en de externe vermeldingen uit spec 12 §7.6 die het hoofdnummer noemen. |
| B-33 | Context 06, 07 en 14 | Die contextbestanden bestaan nog niet. De specs 03, 06, 07, 08 en 10 zijn geschreven op basis van context/01, 04, 08, 09, 10, 11 en `research/jversseput-schrijfstijl-analyse.md`. Zodra 06, 07 en 14 er zijn, volgt een afstemronde (zie §7). | feit | Djulan | Afstemronde kan velden, woordenlijst en open vragen wijzigen. |

## 4 Gedeelde begrippen (verplicht in elke spec)

### 4.1 Routes

Bron: context/03 (leidend). Fase 1 tenzij anders vermeld. Engelse variant: zelfde
pad onder `/en`.

| Route | Paginatype | Spec | Index |
|---|---|---|---|
| `/` | home, twee routes | 04 | ja |
| `/vacatures` | overzicht met zoeken en filters | 06 | ja (filters noindex) |
| `/vacatures/[slug]` | vacature met sollicitatieformulier | 06, 07 | ja (gesloten: noindex) |
| `/inschrijven` | open sollicitatie en inschrijven | 07 | ja |
| `/werkzoekenden` | hoe het werkt, loon en rechten, FAQ | 05 | ja |
| `/werken-als/[beroep]` | beroepspagina werkzoekende (5) | 05 | ja |
| `/werkgevers` | dienstverlening, werkwijze | 05 | ja |
| `/werkgevers/[beroep]` | beroepspagina opdrachtgever (5, meervoudsslug) | 05 | ja |
| `/werkgevers/personeel-aanvragen` | aanvraagformulier | 07 | ja |
| `/werkgevers/wtta` | kennispagina inlenen en Wtta | 05, 09 | ja |
| `/over-ons` | verhaal, Jimmy en Lorenzo | 04 | ja |
| `/contact` | contactgegevens en contactformulier | 07 | ja |
| `/privacyverklaring` | juridisch | 09 | ja |
| `/cookieverklaring` | juridisch, kort | 09 | ja |
| `/algemene-voorwaarden` | juridisch, tekst van de klant | 09 | ja (pas als tekst er is) |
| `/klachtenregeling` | juridisch, kort | 09 | ja |
| `/bedankt/sollicitatie`, `/bedankt/inschrijving`, `/bedankt/aanvraag`, `/bedankt/contact` | bedankpagina's | 07 | noindex |
| `/beheer/*` | beheeromgeving, alleen NL, eigen root-layout | 08 | noindex, nofollow; buiten de taalrouting en de geo-redirect; `proxy.ts` ververst alleen de sessie via `beheerProxy()` (B-38, spec 08 §4.13) |
| `/api/*` | route handlers (cron, webhooks, uploads; `/api/dev/revalidate` alleen buiten productie, B-46) | 10, 13 | buiten de taalrouting (eerste matcher sluit `api` uit); `Disallow: /api/` in robots.txt |
| `/stijlgids` | stijlgids, alleen in ontwikkeling | 02 | noindex, nofollow; in productie 404; niet in sitemap of llms.txt |
| `/jobalert`, `/regio/[plaats]`, `/feeds/[portaal]` | fase 2 | 15 | — |

De bestaande routes `/diensten/[slug]`, `/werkgebied`, `/werkgebied/[stad]` en
`/privacybeleid` verdwijnen (spec 01).

### 4.2 Beroepen

| Id | Slug werkzoekende (`/werken-als/`) | Slug werkgever (`/werkgevers/`) | Enkelvoud | Meervoud |
|---|---|---|---|---|
| `glazenwasser` | `glazenwasser` | `glazenwassers` | glazenwasser | glazenwassers |
| `schoonmaker` | `schoonmaker` | `schoonmakers` | schoonmaker | schoonmakers |
| `logistiek-medewerker` | `logistiek-medewerker` | `logistiek-medewerkers` | logistiek medewerker | logistiek medewerkers |
| `verhuizer` | `verhuizer` | `verhuizers` | verhuizer | verhuizers |
| `hulpkracht-bouw-en-sloop` | `hulpkracht-bouw-en-sloop` | `hulpkrachten-bouw-en-sloop` | hulpkracht bouw en sloop | hulpkrachten bouw en sloop |
| `grondwerker` | `grondwerker` | `grondwerkers` | grondwerker | grondwerkers |
| `sloper` | `sloper` | `slopers` | sloper | slopers |
| `bouwopruimer` | `bouwopruimer` | `bouwopruimers` | bouwopruimer | bouwopruimers |
| `machinist` | `machinist` | `machinisten` | machinist | machinisten |
| `stratenmaker` | `stratenmaker` | `stratenmakers` | stratenmaker | stratenmakers |

Engelse namen (spec 05 is eigenaar): window cleaner, cleaner, logistics worker,
mover, construction and demolition labourer, groundworker, demolition worker,
construction site cleaner, excavator operator, street paver; meervoud met -s,
bij de vijfde construction and demolition labourers.

De laatste vijf beroepen (bouw, sloop en infra) zijn op 5 oktober 2026
toegevoegd. De feitelijke basis per beroep staat in
`context/research/beroepen-uitbreiding/`. "Hulpkracht bouw en sloop" blijft het
instapberoep; sloper, grondwerker, bouwopruimer, machinist en stratenmaker zijn
eigen vakken met een eigen pagina. In een Engelse zin komt de beroepsnaam altijd
via `occupationPhrase()` uit `i18n/occupation-phrase.ts`, zodat het lidwoord
klopt ("an excavator operator").

De `id` is tegelijk de waarde in de database (`occupations.slug`) en de sleutel in
messages en content.

### 4.3 Data en statussen (namen zijn vast; kolommen in spec 10)

Tabellen fase 1 (Engelse namen, zoals context/11): `admin_profiles`,
`occupations`, `vacancies`, `vacancy_translations` (fase 1 alleen `nl`),
`applications`, `staff_requests`, `contact_messages`, `activities`,
`email_log`, `audit_log`. Buckets: `cvs` (privé), `public-media`.

Statussen: vacature `draft`, `scheduled`, `published`, `closed`, `archived` met
`close_reason` `filled`, `expired`, `withdrawn`, `other`; sollicitatie `new`,
`in_progress`, `invited`, `placed`, `rejected`, `withdrawn`; aanvraag `new`,
`in_progress`, `quote_sent`, `started`, `completed`, `cancelled`; bericht `new`,
`answered`, `archived`, `spam`. Nederlandse labels in de beheerteksten (spec 08).

### 4.4 Tekstmechanismen

1. `messages/nl/<namespace>.json` en `messages/en/<namespace>.json`, één
   bestand per namespace en gespiegeld, samengevoegd in
   `messages/<locale>/index.ts` (eigenaar spec 01, B-45). Een nieuwe namespace
   is één JSON-bestand per taal plus één import in elke `index.ts`. Namespaces:
   `common`, `meta`, `header`, `footer`, `home`, `werkzoekenden`,
   `werkgevers`, `beroepen`, `vacatures`, `forms`, `legal`, `about`,
   `contact`, `bedankt`, `notFound`, `error`. Spec 03 legt de sleutels vast.
   Fase 2 (spec 15): `jobalert` en `regio`. Een namespacebestand bevat alleen
   de sleutels van die namespace, zonder de namespace als bovenste sleutel
   (`messages/nl/home.json` begint met `"hero"`); sleutelbomen in de specs
   tonen de namespace als bovenste sleutel alleen voor de leesbaarheid (B-47).
2. `content/beroepen/<id>.ts` voor lange tekst per beroep (nl en en, beide
   perspectieven); `content/pages/*.ts` voor lange tekst van vaste pagina's
   (werkzoekenden, werkgevers, over ons, wtta).
3. `lib/site.ts` voor NAW, personen, navigatie, iconen.
4. Database voor vacatures (alleen `nl` in fase 1).
5. Beheerteksten in `app/beheer/_strings.ts` (alleen Nederlands, buiten de
   spiegelcontrole van `npm run check`).
6. Juridische pagina's houden hun tekst in de page (`CONTENT = { nl, en }`).
7. E-mailteksten staan als `COPY = { nl, en }` bovenin elk bestand in
   `emails/*.tsx` (spec 11), niet in messages, omdat mails ook buiten een
   request (cron) worden gerenderd; check:copy leest ze mee (spec 03 §6.19).

### 4.4a Eigenaarschap van namespaces, bestanden en gedeelde componenten

Eén spec is eigenaar; andere specs verwijzen ernaar en definiëren het niet opnieuw.
Verwijs naar een gedeeld onderdeel met de naam hieronder, niet met een
sectienummer van een andere spec.

| Onderdeel | Eigenaar |
|---|---|
| messages `common`, `meta`, `header`, `footer`, `notFound`, `error`; schrijfregels, woordenlijst, sjablonen en lengtes voor alle tekst, ook in `content/`; `lib/claims.ts`, `lib/format.ts`, `scripts/check-copy.mjs` | 03 |
| messages `home`, `about`; homepagesecties; `/over-ons`; `components/sections/section-heading.tsx` (props; uiterlijk spec 02), `components/sections/cta-band.tsx`, `components/sections/home/*`, `components/sections/about/*` | 04 |
| messages `werkzoekenden`, `werkgevers`, `beroepen`; typen en inhoud van `content/beroepen/<id>.ts` en `content/pages/{werkzoekenden,werkgevers,wtta}.ts`; templates van de beroepspagina's; `components/service/*` (ServiceHero, ServiceFeatureGrid, ServiceSteps, ServiceFaq, ServiceCta, `types.ts` met `StepItem`), `components/beroep/*` | 05 |
| messages `vacatures`; `components/vacatures/*` (onder meer `VacancyCard`, `VacancyList`, `LatestVacancies`, `VacancyFacts`, `VacancyFilters`) | 06 |
| messages `forms`, `contact`, `bedankt`; `components/forms/*` (onder meer `ApplyForm`, `RegisterForm`, `StaffRequestForm`, `ContactForm`); `lib/validation/*`; Server Actions in `app/actions/*`; uploadroute; `components/contact/*` | 07 |
| `app/beheer/**`, `app/beheer/_strings.ts`, `components/beheer/*`; `app/beheer/_lib/proxy.ts` (`beheerProxy()`), `components/beheer/ui/*` | 08 |
| messages `legal`; juridische pagina's; vermeldingen in de footer (inhoud); `lib/legal.ts` (enige bron voor versie en publicatiestatus van juridische documenten, B-40), `components/legal/*` (`FooterLegal`, `WttaStatus`), `scripts/check-claims.mjs`, `lib/compliance/copy-rules.json`, `docs/compliance/*` | 09 |
| `supabase/migrations/*`, `supabase/seed.sql`, `lib/supabase/{server,browser,admin}.ts`, `lib/data/*` (leesfuncties en hun signaturen), `lib/database.types.ts`, cron-routes in `app/api/cron/*`; `lib/supabase/proxy.ts` (`updateSession()`), `lib/data/revalidate.ts` (`revalidateVacancies()`), `lib/data/options.ts` (waaronder `MINIMUM_WAGE_21_PLUS`), `scripts/supabase/*`, `supabase/tests/*`, `supabase/seed-reset.sql`, `scripts/supabase/seed-reset.mjs`, `app/api/dev/revalidate/route.ts` (B-46) | 10 |
| `emails/*` (React Email), `lib/email/*`; `supabase/templates/*` (bron van de Auth-mailteksten, geplakt in het dashboard) | 11 |
| `lib/seo.ts` (alle builders, waaronder `employmentAgencyLd` en `jobPostingLd`), `app/sitemap.ts`, `app/robots.ts`, `app/llms.txt/route.ts`, OG-afbeeldingen | 12 |
| `.env.example`, `vercel.ts` of `vercel.json`, `next.config.mjs` (headers, redirects), securityheaders, DNS, accounts; `instrumentation-client.ts`, `lib/security/*`, `supabase/config.toml` (CLI-configuratie; de `[auth]`-blokken zijn documentatie, B-39), `.github/workflows/*` (spec 14 mag een stap toevoegen), `.github/pull_request_template.md` | 13 |
| testopzet, `scripts/check-launch.mjs` (uitbreidingen), acceptatiematrix | 14 |
| `app/[locale]/layout.tsx` (structuur), `proxy.ts`, `i18n/*`, `messages/<locale>/index.ts`, `lib/site.ts` (vorm en navigatie), `content/beroepen/index.ts` (lichte lijst: id, beide slugs, icoon, volgorde), `components/sections/site-header.tsx` en `site-footer.tsx` (structuur), `app/[locale]/not-found.tsx`, `error.tsx`, `app/[locale]/[...rest]/page.tsx`, `lib/routes.ts` (paden, `isKnownPath`, `NOT_FOUND_PATH`, `NOT_FOUND_HEADER`, B-55), mappenstructuur en verwijderlijst van routes | 01 |
| `app/globals.css`, `lib/brand.ts`, fonts, `components/brand/*` (logo), `components/ui/*` (primitives en `cta-button.tsx`), `components/motion/*`, favicon en apple-icon, uiterlijk van header en footer | 02 |
| `messages` `jobalert` en `regio`, `content/regio/*`, `components/jobalert/*` (fase 2); `emails/job-alert-confirm.tsx`, `emails/job-alert-digest.tsx`, `emails/job-alert-reconfirm.tsx` en `emails/stale-reminder.tsx` (vorm volgens spec 11) | 15 |

### 4.5 Omgevingsvariabelen (fase 1)

Vast: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
`SUPABASE_SECRET_KEY`, `RESEND_API_KEY`, `CRON_SECRET`, `RESEND_WEBHOOK_SECRET`.
Optioneel, niet op productie: `EMAIL_FROM`, `EMAIL_DEV_TO`, `BOTID_DEV_BYPASS`.
Alleen in de shell, nooit door de app gelezen: `SUPABASE_DB_URL`,
`SUPABASE_DB_PASSWORD`, `E2E_BASE_URL`, `VERCEL_AUTOMATION_BYPASS_SECRET`.
Opdrachten in AC's die `$CRON_SECRET` of `$NEXT_PUBLIC_SUPABASE_*` gebruiken,
draaien in een shell waarin eerst `set -a; . ./.env.local; set +a` is
uitgevoerd (spec 13 A3 stap 9, B-51); deze variabelen blijven in `.env.local`
en worden geen shellvariabelen. `SUPABASE_DB_URL` is ook nodig voor
`npm run db:seed:reset` en elke lokale e2e-run.
Fase 2: `GOOGLE_INDEXING_SERVICE_ACCOUNT` (spec 15). Geen andere zonder
vermelding in spec 13 en `.env.example`. `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`
vervalt.

### 4.6 Tooling in deze omgeving (feiten van 2 oktober 2026)

- Node 24.13.1; `npm run verify` slaagt op de startcommit (29 statische pagina's).
- `gh` ingelogd als `skuu-os`; Vercel CLI ingelogd in het SKUU-team; Supabase
  CLI 2.104.0; geen Docker (dus geen lokale Supabase-stack).
- Supabase MCP via claude.ai: organisatie Sinka B.V. van Djulan; heeft geen
  rechten op de organisatie Groos Personeelsdiensten. Voor `groos-dev` (ref
  `smcskfrkjgniinbhqnln`) geldt de projectgebonden MCP-server `supabase` uit
  `.mcp.json` (na `/mcp`); die kent geen `list_organizations`, `list_projects`
  of `create_project` (B-12, B-39).
- 21st.dev Magic MCP: tier paid, `aiGenerationEnabled` false. `search` op
  componenten werkt; `search` op thema's gaf geen resultaten voor blauwe of
  lichte thema's, dus tokens komen uit spec 02 en niet uit `get_theme`.
  Werkwijze: `search` en `get_inspiration` (gratis) om te kiezen,
  `get_component` alleen voor de gekozen kandidaat.
- JV-repo aanwezig op `/Users/djulangem/Developer/J.versseput B.V.` (alleen lezen).

## 5 Spec-vorm

Elke spec volgt exact deze opbouw (uit BOUWINSTRUCTIE §5, aangevuld met de
21st.dev-opdracht en de bouwopdracht uit de briefing).

```
# <nn> <Module>

| Status | Fase | Hangt af van | Bronnen |
|---|---|---|---|

## 1 Doel
## 2 Gebruikers en scenario's          (S-<nn>-01 ...)
## 3 Scope                              (E-<nn>-01 ..., gekoppeld aan R-xx)
## 4 Pagina's en componenten
## 5 Data
## 6 Tekstelementen
## 7 SEO
## 8 Toegankelijkheid en performance
## 9 21st.dev-opdracht voor sub-agents
## 10 Bouwopdracht
## 11 Acceptatiecriteria                (AC-<nn>-01 ..., toetsbaar)
## 12 Open vragen en aannames           (tabel: onderwerp, aanname, bevestigt, gevolg)
```

Schrijfregels voor specs: Nederlands, volledige zinnen, geen uitroeptekens,
geen gedachtestreepjes in zinnen. Verwijs als `spec 10 §5` en `context/11 §4.2`.

## 6 Bouwvolgorde voor de uitvoering

Volgorde voor de bouwsessie (één agent of sub-agent per stap; na elke stap
`npm run verify`, en vanaf stap 4 ook een visuele controle op 390, 768, 1280 en
1440 px).

| Stap | Spec | Wat | Poort |
|---|---|---|---|
| 1 | 13 (deel A), 10; 14 (stap A, verschoven naar 3b) | `.env.local` met het dev-project, Supabase-clients, migraties en seed draaien, `supabase/` in de repo | `npm run typecheck`; tabellen zichtbaar in Supabase |
| 2 | 02 | Tokens, fonts, logo-schetsen, cta-button, iconen; oude signature-klassen weg | contrastcontrole; alle pagina's grijs weg |
| 3 | 01, 03, 09 (blok A); 14 (stap B, verschoven naar 3b) | Routes, navigatie, registers, messages-sleutels (nog met tekst uit de specs), proxy-uitsluitingen, minimale sitemap en llms.txt | alle routes 200, `npm run check` zonder sleutelfouten |
| 3b | 10 (correctiemigratie, `VACANCY_SORTS`, seed-reset, `/api/dev/revalidate`), 14 (stap A en B), 09 (blok A, waaronder `check:claims`), 03 (`check:copy`), nazorg 01, 02, 03 en 13 deel A, plus per al gebouwde spec (01, 02, 03, 04 tot en met 09, 10, 11, het vacaturedeel van 12 en 13 deel A) een nazorg-sub-agent voor de wijzigingen uit de kruiscontroles, en de integratiecontrole uit B-52 | Ontbrekende basis en nazorg op gecommitte code (§1a) | Eerst AC-10-01, AC-13-04 en AC-13-05 (schemacontrole, B-57); daarna `npm run verify`; `npm run test`; `npm run check -- --warn` zonder punten voor K1 tot en met K3 en K9 tot en met K13; AC-01-01 tot en met AC-01-38 en AC-03-01 tot en met AC-03-05 groen; headercontrole uit spec 13 A10 stap 3; AC-01-39, AC-06-38 en AC-10-33 groen |
| 3c | 12 (rest) | Sitemap, robots en llms.txt volgens spec 12 §4.7 tot en met §4.9, en het aansluiten van 04, 05, 07 en 09 volgens spec 12 §10 stap 9 | `npm run verify`; AC-12-13 tot en met AC-12-15 en AC-12-20 groen |
| 4 | 04, 05 | Homepage en beroepspagina's met echte tekst, per beroep een sub-agent | visueel; Lighthouse (`scripts/lighthouse.mjs` uit 3b) |
| 5 | 06, 12 | Vacatureoverzicht, detail, JobPosting, gesloten staat | Rich Results Test op een voorbeeld |
| 6 | 07, 11 | Formulieren, uploads, e-mails, bedankpagina's | elk formulier levert een record en twee mails |
| 7 | 08 | Beheer: login met MFA, vacatures, sollicitaties, aanvragen, berichten | Jimmy-scenario op een telefoon |
| 8 | 09 (blok B) | juridische teksten, treffers van check:claims verwerken | `npm run check` |
| 9 | 14 | Acceptatietests, toegankelijkheid, performance | alle AC's groen |
| 10 | 13 (deel C tot en met H) | Vercel-productie, productie-Supabase, domein en DNS omzetten | STAPPENPLAN E en K |

Alle worktrees van fase 1 zijn gemerged (30762de, B-52). Bouwstap 3b draait nu,
vóór het aftekenen van de poorten van stap 4 tot en met 8. Bouwstap 3b begint
met de schemacontrole van B-57; seed, types en elke AC die data leest, wachten
daarop. Elke spec die vóór kruiscontrole ronde 3 al (deels) gebouwd was, krijgt
in 3b een nazorg-sub-agent die alleen de wijzigingen uit de kruiscontroles voor
die spec toepast. De integratiecontrole van 3b controleert: één
`components/contact/contact-person-card.tsx` met de props van spec 07 §4.9 en
geen tweede personenkaart; `<ApplySection vacancy={vacancy} locale={locale} />`
op `app/[locale]/vacatures/[slug]/page.tsx` alleen bij
`vacancy.state === "open"`; `BeroepVacancies` rendert `VacancyList` van spec 06;
`HomeVacancies` rendert `LatestVacancies`;
`grep -rn "TODO formulier uit spec 07\|TODO VacancyCard" app components` geeft
niets. Stap 3c bouwt spec 12, voor zover 8a89ebe het niet bouwde (sitemap,
robots, llms.txt en het aansluiten van 04, 05, 07 en 09 volgens spec 12 §10;
`lib/og.tsx` en de OG-routes staan er sinds 40d7067), op `bouw/fase-1` direct
na 3b. Dat is vóór de poort van stap 4 en dus ook vóór die van stap 5 (B-52),
omdat AC-04-12, AC-05-20 en AC-05-21 de JSON-LD en de aansluiting uit spec 12
toetsen.

**Controle van de volgorde tegen de afhankelijkheden (§2, stand 2 oktober
2026).** De volgorde klopt met deze aanpassingen: stap A en B van spec 14 staan
bij stap 1 en 3 als verschoven naar 3b (spec 14 §10.1 en §10.2), en de rest van
spec 12 is stap 3c vóór de poort van stap 4. De poort van stap 4 vraagt
Lighthouse, en `scripts/lighthouse.mjs` komt uit spec 14 stap A in 3b. Een
aantal specs hangt af van een spec uit een latere stap: 01 van 05
(beroepsnamen) en 12 (builders), 04 van 06 (`LatestVacancies`) en 07
(`ContactPersonCard`), 06 van 07 (`ApplySection`), 07 van 11 (e-mailfuncties)
en 11 van 08 (`beheerUrl`, `/beheer/auth/bevestigen`). Die zijn bij de bouw
opgevangen met de afgesproken signaturen, en sinds de merges van B-52 staat de
code van al die specs op `bouw/fase-1`. De poorten van stap 4 tot en met 8
worden daarom na 3b en 3c in deze volgorde afgetekend; een poort die een
onderdeel van een latere stap gebruikt, toetst de gemergde code van die stap.
Spec 07 gebruikt BotID uit spec 13 deel A (A9) en spec 08 de Auth-instellingen
uit A2; beide horen bij stap 1. Spec 15 komt pas na de livegang en na
vrijgave per onderdeel door Djulan (E-15-02).

GitHub (spec 13 deel B), het Resend-verzenddomein (E3) en de Search
Console-TXT (G1) mogen zodra Jimmy toegang geeft; ze raken localhost niet en
gaan dus niet in tegen R-17. Vercel-previews mogen eerder (B-14); de
productiedeploy met domein blijft de laatste stap.

Iteratierondes (morgen) gaan over spec 02, 04, 05 en 06: uiterlijk en copy,
niet over datamodel of routes.

## 7 Open punten

Dit is de bundel van alle open vragen uit §12 van spec 01 tot en met 15 en de
punten van de arbiter van kruiscontrole ronde 4, ontdubbeld en per persoon die
beslist. Een vraag die meer mensen raakt, staat bij degene met het laatste
woord; de anderen staan tussen haakjes bij het onderwerp. "Arbiter" betekent
dat de vraag uit de arbitrage komt en de aanname de aanbeveling van de arbiter
is. Punten die in §12 als gesloten of besloten staan, staan hier niet. Punten
die alleen een andere spec, een test of de bouw-agent bevestigt, staan in §7.4.
De kolom "Verandert" noemt de spec die verandert als de beslissing anders
uitvalt. Een verwijzing als "00 §7 punt 4" in een andere spec betekent D4.

### 7.1 Djulan (42 vragen)

**Nu nodig: acties en arbiterpunten**

| Nr | Onderwerp | Aanname die de specs nu hanteren | Verandert |
|---|---|---|---|
| D1 | `.env` in de repo-root (arbiter) | In de repo-root staat een `.env` met `supabase_service_api` en `supabase_api_secret`, en Next.js laadt dat bestand in elke omgeving. Aanbeveling: zet de waarden in de kluis Groos en verwijder `.env`; lokale waarden horen alleen in `.env.local`. AC-13-02 controleert dat `.env` niet bestaat. | 13 (A3 stap 8) |
| D2 | Schemacontrole `groos-dev` (B-57; arbiter; 13 §12 Data API) | `groos-dev` gaf op 2 oktober 2026 via de Data API `PGRST205` en deze checkout heeft geen `supabase/.temp/project-ref`. Nodig: het databasewachtwoord van `groos-dev` uit de kluis voor `supabase link`. Bestaan de tabellen wel, zet dan in het dashboard onder Project Settings, Data API de Data API aan met `public` in Exposed schemas. Seed, types en elke AC die data leest wachten hierop. | 13 (A4 stap 2, A5 stap 4a), 10 (AC-10-01) |
| D3 | Sessieverversing en Supabase-werkwijze (B-38, B-39; arbiter; 01, 08 en 10 §12) | Bevestigen. `/beheer` gaat via de tweede matcher van `proxy.ts` naar `beheerProxy()`, dat alleen de sessie ververst en optimistisch doorstuurt. Geen `supabase config push`: Auth en mailteksten gaan via het dashboard, en een schemawijziging komt in een correctiemigratie in plaats van in een bestaande migratie. B-39 volgt wat in bouwstap 1 is gebouwd (`supabase/config.toml` zegt "nooit config push"). Gevolg voor Djulan: de Auth-instellingen en vijf mailtemplates uit `supabase/templates/` één keer in het dashboard van `groos-dev` plakken (spec 13 A2). | B-38 anders: 08 (verversen met een browserclient, AC-08-39 handmatig), 01 en 14 (K11, oude matcher). B-39 anders: 10 stap 7 en 11 stap 11 krijgen hun push terug. |
| D4 | Specs en `context/` in Git (B-58; arbiter; 13 §12 Eerste push en `context/_input/`) | Ja: `context/` zonder `context/_input/` gaat mee in de eerste push naar `jimmyv3-v3`, ook als context 06, 07 en 14 dan nog ontbreken; die volgen als eigen commit. De specs verwijzen overal naar `context/`. `docs/specs/` en `docs/HANDOVER-2.md` worden in elk geval nu lokaal gecommit. `context/_input/` gaat nooit in Git. | 13 (deel B stap 3); bij nee vóór de eerste push `git rm -r --cached context` |
| D5 | Formulieren zonder JavaScript op productie (B-36; arbiter; 07 §12) | Accepteren: BotID weigert op productie een formulier dat zonder JavaScript wordt verstuurd, wat afwijkt van de belofte van progressive enhancement. De bezoeker ziet bellen en WhatsApp, het spamrisico blijft laag, en lokaal en in de tests werkt alles zonder JavaScript. | 07 (`guardSubmission` slaat BotID over als `fillMs` ontbreekt, met meer spamrisico) |
| D6 | Juridische naam van de ontwikkelaar (arbiter; 09 §12) | "Sinka B.V. (handelsnaam SKUU)" in de verwerkersovereenkomst en de overdrachtsdocumenten. | 09 (§5.5, artikel 10), 13 (§5.8) |
| D7 | Parallel gebouwde specs en bouwstap 3b (arbiter; B-52) | De arbiter schreef dit toen 05 tot en met 09 nog in vijf worktrees vanaf 16c35a6 werden gebouwd, vóór de merge van 04 en vóór ronde 2. Zijn aanbeveling (afmaken, per spec mergen, daarna 3b met een nazorg-sub-agent per gebouwde spec) is inmiddels uitgevoerd tot en met de merges: de laatste is 30762de. Open is de bevestiging dat 3b de nazorg en de integratiecontrole doet en dat de poorten van stap 4 (spec 05) tot en met 8 pas daarna worden afgetekend (§6). | 00 §6 |
| D8 | Titellengte (B-44; arbiter; 03 en 12 §12) | Akkoord: het eigen deel van een titel is bij voorkeur 25 tot 45 tekens en hoogstens 52; pagina's met een korte naam (Contact, Over ons, Personeel aanvragen en dergelijke) mogen korter. Strikt 25 tot 45 tekens zou kunstmatig lange titels geven. | Strikt: 04, 05 en 07 schrijven korte en lange titels opnieuw; 12 past de waarschuwing in `pageMetadata()` aan |
| D9 | Unieke titels (B-53; arbiter; 12 §12) | Uniek per taal: `/contact` en `/en/contact` heten allebei "Contact \| Groos Personeelsdiensten", en de copy van spec 07 blijft zoals hij is. | 07 (andere Engelse titel, bijvoorbeeld "Contact us"), 12 (AC-12-20 over alle URL's), 14 |
| D10 | Label van de belknop (B-54; arbiter) | "Bel ons" (EN "Call us") in plaats van "Bel direct" op home en `/werkgevers`, omdat de schermlezernaam "Bel ons op 06 52 54 95 39" anders het zichtbare label niet bevat (WCAG 2.5.3). Alternatief: "Bel direct" zonder `ariaLabel`, dan noemt de schermlezer het nummer niet. | 03 (sleutels), 04, 05 en 07 (labels) |
| D11 | 404 van vacatures uit de database (B-55; arbiter; 01 §12 punt 21) | Niet doen: status 404 en `noindex` staan in de respons, de 404-tekst verschijnt pas na JavaScript (Next 16.3). Google kijkt naar de status en bezoekers zien de tekst gewoon; een databaseverzoek in de proxy vertraagt elke vacaturepagina en botst met de ISR-opzet van B-35. Een slug zonder nummer krijgt wel de volledige server-404. | 01 (`proxy.ts` met `vacancyIsReachable`), 10 (`lib/data/vacancy-exists.ts`), 06 (AC-06-20 eist de h1 in de server-HTML) |
| D12 | Fouten in publieke leesfuncties (B-56) | Leesfuncties gooien bij een Supabase-fout; alleen zonder Supabase-variabelen geven ze een leeg resultaat. | 10 (§4.3 punt 10, AC-10-33), 06 (AC-06-38) |
| D13 | Context 06, 07 en 14 (B-33; 03 §12 Context 07) | Ze ontbreken; 03, 06, 07, 08 en 10 steunen op de andere contextbestanden. Zodra ze er zijn, zet een agent die specs ertegen af en legt hij de verschillen hier vast. | 03, 06, 07, 08, 10 |

**Beslissingen uit de log ter bevestiging**

| Nr | Onderwerp | Aanname die de specs nu hanteren | Verandert |
|---|---|---|---|
| D14 | Talen en paden (B-03; 01 §12 punt 10) | NL en EN bij lancering; Nederlandse paden ook onder `/en`; vacatures alleen in het Nederlands. | 01 (`pathnames`, `ROUTES` per taal, taalknop), 12 (sitemap) |
| D15 | Geo-redirect en botlijst (B-03; 01 §12 punt 11, 12 §12) | Omleiding zoals gebouwd, met uitzondering voor crawlers, Google-testtools en previews, al raadt context/10 §7 een taalsuggestie aan. | 01 (melding in plaats van omleiding; regex in `proxy.ts`) |
| D16 | Aanspreekvorm en woordkeus (B-04; 03 §12) | Je voor werkzoekenden en u voor opdrachtgevers, per route; altijd "wij", nooit "we"; "werkgevers" als label en route, "opdrachtgever" in lopende u-tekst, "het bedrijf waar je werkt" in je-tekst. | 03 (copy, woordenlijst, lijst A, regel C-07 en zones in `check-copy.mjs`) |
| D17 | Koppen (B-05; 02 en 04 §12) | h3 voor itemtitels; de twee deuren in de hero zijn h2; `Accordion`-titels standaard zonder kop in `summary`, met `headingLevel` als optie. | 04 (`HomeHero`), 02 (`Accordion`) |
| D18 | Web3Forms weg (B-13) | Alle formulieren gaan via Server Actions naar Supabase en Resend. | 07 (Web3Forms terug als fallback) |
| D19 | Scope beheer fase 1 (B-19; met Jimmy en Lorenzo) | Zoals B-19; instellingen, gebruikersbeheer, sjablonen, export en talentpool in fase 2. | 08 |
| D20 | Merknaam en scheidingsteken in titels (01 §12 punt 12, 03 en 12 §12) | " \| Groos Personeelsdiensten", of " \| Groos" boven 60 tekens; de opdracht voor 12 noemde " · ". | 12 (`BRAND_SUFFIX`), 03 (`titleTemplate`, `titleDefault`, AC-03-14), 01 (`contact.shortName`) |

**Keuzes per spec**

| Nr | Onderwerp | Aanname die de specs nu hanteren | Verandert |
|---|---|---|---|
| D21 | Header en actiebalk (01 §12 punt 2 en 3, 06 §12; met Jimmy) | Headerknop "Schrijf je in" op werkzoekendenpagina's, elders "Personeel aanvragen"; de actiebalk op een vacature heeft "Bel ons" en "Solliciteer direct" (anker `#solliciteren`), WhatsApp staat in de pagina; geen tweede vaste balk. | 01 (`headerCtaFor`, variant `vacature`), 06 (anker of eigen balk) |
| D22 | `global-not-found.tsx` (01 §12 punt 9) | Gebruikt, al is het experimenteel in Next 16.3.8. | 01 |
| D23 | Tint van het blauw (02 §12) | `#2741C9` in plaats van `#3340E0`. | 02 |
| D24 | Nieuwe packages (B-37; 02 en 14 §12) | `tw-animate-css`, `sharp`, `vitest`, `vite`, `@playwright/test` en `@axe-core/playwright`; geen `radix-ui`, `sonner`, `next-themes` of `@vercel/speed-insights`. | 02 (PNG's met de hand), 14 (`node --test`), 01 en 13 (Speed Insights) |
| D25 | Interactie zonder JavaScript (02 §12, 04 §12 punt 2, 05 §12) | `Accordion` en `ServiceFaq` op native `<details>`; het vragenblok op home met keuzerondjes en `:has()`; op de publieke site alleen `NativeSelect`; reveal met scroll-gedreven CSS; `Sheet`, `Tabs` en `Toaster` op base-ui 1.0.0-rc.0. | 02, 04 (`HomeFaq` wordt client), 05 (`ServiceFaq` wordt client) |
| D26 | Kleinere ontwerpkeuzes (02 §12) | Fontvariabelen `--font-onest` en `--font-instrument`; `Wordmark` zonder beschrijver in de header; stijlgids alleen in ontwikkeling. | 02, 01 (stijlgidsroute) |
| D27 | Engels en notatie (03 §12) | Brits Engels; "logistics worker" met "warehouse worker" als synoniem; "8 procent" in tekst en "8%" in tabellen. | 03 (woordenlijst, §6.6), 10 (seed) |
| D28 | Homepage (04 §12 punt 4 en 5) | Vier vacatures op home; `ContactPersonCard` van 07 op `/` en `/over-ons`, met klikevents als `form: "contact"`. | 04, 06 (`className` op `VacancyList`), 07 (prop voor de bron) |
| D29 | Beroepspagina's (05 §12) | Bouwstenen blijven in `components/service/`; sectie-id `faq` blijft; geen live vacatures op werkgeverspagina's; loonbedragen gelden tot `reviewBy` 2027-01-01; Wtta-mijlpalen volgens context/09 per 2 oktober 2026. | 05 |
| D30 | Vacaturebank (06 §12) | Geen `loading.tsx`, omdat streamen de 404 en de 308 breekt; eigen sectiekoppen om Wilk te vermijden; badge Spoed zonder urgentiecopy; sorteren op "Nieuwste eerst" en "Hoogste uurloon" (sluitdatum alleen via de URL); filters beroep, plaats, uren en werktijden; zes plaatsen zichtbaar; h1 met `lang="nl"` op `/en`; UTM-parameters gaan verloren bij de 308. | 06, 10 (extra filter) |
| D31 | Formulieren (07 §12) | Upload met een rauwe `PUT` via XHR, met `uploadToSignedUrl` als terugval; aanvraag op één pagina; referentie op de bedankpagina client-side; minimale invultijd 3 seconden. | 07, 14 (`wachtInvultijd`) |
| D32 | Beheer (08 §12) | Metadata zonder `pageMetadata()`; beheerschema's in `app/beheer/_lib/validation/`; e-mailen via `mailto:`; uitnodigen via het dashboard met de `token_hash`-link; wachtwoordherstel via de codestap (AC-08-09); lokaal testen op een telefoon via het IP-adres van de laptop. | 08, 11 (mails in fase 1), 12 (optie in `pageMetadata()`) |
| D33 | Authenticator of telefoon kwijt (08 en 09 §12) | Djulan verwijdert de factor in het dashboard volgens 09 §5.6a; geen herstelcodes in fase 1. | 08 (herstelscherm), 09 (§5.6a), 15 |
| D34 | Verwerkers, cookies en logging (09 §12) | De Supabase-DPA geldt ook via de Marketplace (navragen); termijn van Vercel-logs nog vast te stellen; BotID Basic plaatst geen cookies (waarnemen op de eerste preview); de WAF-regels zijn actief op productie (B-12). | 09 (§5.4, cookietabel, artikel 9), 13 (§5.6) |
| D35 | Datamodel (10 §12) | Geen tabellen buiten 00 §4.3; uren-buckets tot en met 20, 21 tot en met 31 en 32 of meer, ook als voltijdgrens in spec 12; `MINIMUM_WAGE_21_PLUS` bijwerken per 1 januari en 1 juli (B-42). | 10, 12 (`employmentTypesFor`) |
| D36 | Testdata en ontwikkelroutes (10 en 14 §12) | Beroepen in migratie en seed; de seed vraagt eerst een beheerder met telefoon; `db:seed:reset` alleen op `groos-dev`; `/api/dev/revalidate` overal behalve productie; e2e tegen `groos-dev` met bewaking op de ref en zelfopruimende testvacatures; de testgebruiker wordt zonder mail aangemaakt. | 10, 14 |
| D37 | Mail (11 §12; afzender en misbruikcontact met Jimmy) | Afzender `website@mail.groospersoneelsdiensten.nl` met reply-to `info@`; één `email_log`-rij per interne melding; alleen `VERCEL_ENV === "production"` verstuurt echt; Auth-links 24 uur geldig; beveiligingsmeldingen in het dashboard controleren; "Djulan van SKUU" als contact bij misbruik; de link wordt bij GET geverifieerd (risico van scanners); geen webfonts in mails. | 11, 08 (bevestigingspagina met knop) |
| D38 | SEO (12 §12; `hiringOrganization` met Jimmy) | Groos is `hiringOrganization`, ook bij werving voor een vaste baan; `/en/vacatures/[slug]` zonder `noindex`; één Nederlandse site-brede OG-afbeelding (ook 03 §12); `llms.txt` zonder vacatures; `iso6523Code` `0106:<kvk>` na controle in de Google-documentatie. | 12, 10 (`employer_name`), 13 en 14 (OG-URL's) |
| D39 | Infrastructuur (13 §12; DNS met Jimmy) | Previews tegen `groos-dev`; DNS blijft bij STRATO met Vercel DNS als plan B; `vercel.ts` met `@vercel/config` 0.8.0; CSP met `frame-src 'self'` en `worker-src 'self' blob:` voor BotID (AC-13-27). | 13 |
| D40 | Testopzet en drempels (14 §12) | `verify` draait `npm run test`; `E2E_BASE_URL` en het bypass-geheim alleen in de shell; JS-budgetten 200, 215, 235 en 350 kB; bundelmeting uit `.next/diagnostics/route-bundle-stats.json`; Lighthouse 90 in alle categorieën; in CI alleen `npm run test`; Schema Markup Validator als poort voor FAQ en EmploymentAgency; `delivered+label@resend.dev` als testadres. | 14, 13 (CI) |

**Fase 2**

| Nr | Onderwerp | Aanname die de specs nu hanteren | Verandert |
|---|---|---|---|
| D41 | Feeds (15 §12, afwijking van B-27) | Ook gratis portalen die aantoonbaar werken (Jooble, Werkzoeken.nl vanaf 25 vacatures); Indeed alleen gesponsord. | 15 (`FEED_PORTALS`), 00 B-27 |
| D42 | Techniek fase 2 (15 en 12 §12) | Indexing API pas in fase 2 (B-27) en mogelijk door Google geweigerd; `URL_UPDATED` bij sluiten; `manage_token` leesbaar in `job_alerts`; Engelse slug met `den-haag`; geen automatische vertaling; drempel regiopagina vijf vacatures in 90 dagen; `settings` alleen voor jobalert, Indexing en feeds; passkeys alleen met `aal2`; cron-tijden uit 15 §5.7; schatting 25 tot 30 werkdagen. | 15, 12 |

### 7.2 Jimmy en Lorenzo (29 vragen)

Djulan legt deze vragen voor; zie ook STAPPENPLAN B.

| Nr | Onderwerp | Aanname die de specs nu hanteren | Verandert |
|---|---|---|---|
| JL1 | Logo (B-61; 02 §12) | Besloten op 3 oktober 2026: het beeldmerk van de klant (G met sikkel), vlak, met het woordmerk in het lettertype van de site. Geen open vraag meer. | 02 (`docs/specs/assets/logo/logo-mark.svg`, AC-02-21) |
| JL2 | Merkrichting (B-01; 02 §12) | Wit met kobalt, richting C zonder limoen. | 02 (tokens, fonts, logo) |
| JL3 | Taal op de werkvloer (arbiter; 06 §12) | Nieuw vacatureveld met Nederlands, Engels of "Nederlands of Engels", niet verplicht, in fase 1 in database, beheerformulier en vacaturepagina (gebouwd in c193539 en 3d9446e). Aanbeveling: houden, want het helpt Engelstalige werkzoekenden en kost één select in het beheer. | 10 (kolom), 08 (select), 06 (`VacancyFacts`); verplicht maken: 08 en 10 |
| JL4 | Opleidingen die Groos regelt of betaalt (CL-11 `certificateSupport`; arbiter; 05, 06 en 08 §12) | Vraag of Groos opleidingen zoals VCA, heftruck of IPAF regelt of betaalt. Tot dat bevestigd is, verbergt het beheer het veld "Opleiding die Groos regelt", zodat "wij regelen de opleiding" niet ongemerkt online komt. | 03 (vlag); daarna verschijnen 05, 06 en 08 vanzelf |
| JL5 | Levertermijn (B-49, CL-09 `deliverySpeed`; arbiter; 03 §12) | Vraag of Groos een levertermijn wil noemen, bijvoorbeeld "binnen twee werkdagen iemand". Aanbeveling: `deliverySpeed` blijft `false` tot een termijn bevestigd is. De FAQ "Hoe snel kunt u iemand sturen?" blijft achter `responseTime` en noemt alleen de reactietermijn. | 03 (vlag en FAQ-tekst), 05 (FAQ's) |
| JL6 | Contactpersoon met telefoonnummer (B-48, B-21; arbiter; 10 §12) | Elke beheerder die contactpersoon kan zijn, heeft een telefoonnummer. Aanbeveling: bij `npm run db:admin` voor Jimmy en Lorenzo altijd `--phone`, en in fase 1 geen beheerder zonder nummer als contactpersoon. | 10 (punt (8) van de correctiemigratie), 08 (`listAdminOptions`), 06 (vacature zonder belknop), 13 (A7, D11) |
| JL7 | Reactietermijn (CL-05 `responseTime`; 03 en 07 §12) | "Binnen één werkdag" als voorlopige tekst achter de vlag; zonder vlag nergens. | 03 (notes-waarden), 07 (bedankpagina's) |
| JL8 | Overige claims (03 §12, 04 §12 punt 8, 11 en 12, 05 §12; 09 CL-01 tot en met CL-22) | Alle claims van categorie C staan op `false`; werkwijzezinnen van categorie B ("Wij bellen je") mogen met meelezen. Open onder meer: keurmerk en brancheorganisatie (CL-01, CL-02), cao (CL-03), uitbetaling (CL-10), huisvesting en vervoer (CL-19), talen (CL-20), kandidaten na een gesprek (`personalIntake`), oprichtingsverhaal (`foundingStory`), klantnamen en citaten (CL-08). | 03 (`lib/claims.ts`), 04 (vijfde kaart, citaatsectie, `about.story.founding`), 05 (`supply`-item), 09 (`claims-status.md`) |
| JL9 | Dienstvormen (CL-18 `serviceForms`; 06, 08 en 10 §12) | Alleen uitzenden tot bevestiging; daarna verschijnen detacheren en werving en selectie vanzelf in het beheer. Geen zzp, oproep of stage. | 03 (vlag), 06 (labels), 10 (`alter type` bij een nieuwe vorm) |
| JL10 | Werkgebied (B-43, CL-14 `workArea`; 01, 04, 05, 12 en 13 §12) | "Den Haag en omgeving"; JSON-LD en Bedrijfsprofiel alleen Den Haag; na bevestiging Haaglanden en de zes plaatsen uit spec 13 G5. | 03 (vlag), 04 (`about.area.places`), 05, 12, 13 (G5) |
| JL11 | Kantoortijden en spoed (B-22, CL-06; 01, 03, 12 en 13 §12) | Voorstel maandag tot en met vrijdag 07.00 tot 18.00 uur, niet zichtbaar tot bevestiging; nooit 24/7; spoedzin zonder termijn; `afterHoursUrgent` uit. | 01 (`contact.openingHours`), 03 (vlag), 12 (JSON-LD), 13 (Bedrijfsprofiel) |
| JL12 | Bedrijfsgegevens (B-02, B-23; 01, 03, 09 en 12 §12) | KvK, btw en postcode zijn onbekend (`TODO`) en de livegang wacht op KvK en btw (AC-09-10). Domein `www.groospersoneelsdiensten.nl` met `info@`, ook als privacyadres. "Langskomen kan alleen op afspraak." | 01 (`lib/site.ts`), 09 (privacyadres), 12 (`iso6523Code`), 03 (`common.address.byAppointment`) |
| JL13 | Personen en kanalen (B-21; 01, 03, 04 en 06 §12) | Alleen het nummer van Jimmy is WhatsApp; rollen zijn "Contactpersoon" en worden niet getoond; geen socials. | 01 (`people`, `socials`), 03 (rollen), 07 (rol in de kaart), 10 (koppeling naar `PersonId`) |
| JL14 | Terugval contactpersoon (06, 07 en 11 §12) | Zonder actieve contactpersoon met nummer: Jimmy met het hoofdnummer; in de bevestigingsmail "Jimmy of Lorenzo". | 06 (`resolveVacancyContact`), 11 (`forms.ts`) |
| JL15 | Betekenis van de naam (04 §12 punt 9; Jimmy) | "Een oud Nederlands woord voor trots, nog gebruikt in Zeeland en Rotterdam"; de Vlaamse herkomst uit de briefing staat er niet in. | 04 (`about.story.paragraphs[0]`, `about.hero.title`) |
| JL16 | Wtta-fase (05 en 09 §12) | Startwaarde `preparing`, alleen als Jimmy en Lorenzo bevestigen dat zij de toelating voorbereiden; anders `none`. | 09 (`WTTA` in `lib/legal.ts`), 05 (sectie valt weg) |
| JL17 | Foto's (B-25; 05 en 06 §12) | Geen foto's en geen stockfoto's; het ontwerp werkt zonder. | 05 (`image`-veld), 06 (vacaturebeeld) |
| JL18 | Termijnen van vacatures en berichten (B-15; 06 en 10 §12) | Badge "Nieuw" 7 dagen; gesloten vacatures 30 dagen zichtbaar, daarna 404 en archief; spamberichten 30 dagen. | 10 (constanten), 06 (`NEW_BADGE_DAYS`) |
| JL19 | Formuliervelden (B-17, B-18; 07 §12; rijbewijs ook jurist) | Beroepen bij inschrijven niet verplicht; rijbewijs bij inschrijven altijd zichtbaar en niet verplicht; vanaf drie links in vrije tekst wordt een sollicitatie of aanvraag geweigerd. | 07 |
| JL20 | Beheer (B-19; 08 §12) | Geen handmatige invoer van sollicitaties via telefoon of WhatsApp in fase 1 (een halve dag extra); twee eigenaren, rol `recruiter` heet Medewerker. | 08 |
| JL21 | Mail vanuit site en beheer (11 §12) | Geen aparte mail bij een mislukte verzending, het beheer toont `failed` en `bounced`; geen statusmails vanuit het beheer in fase 1. | 11, 08 |
| JL22 | Titel van een gesloten vacature (12 §12; met spec 03) | "(vervuld)" alleen bij `close_reason = filled`, anders "(gesloten)". | 12, 03 (`closedTitle`) |
| JL23 | Vercel-team en abonnement (07, 09, 10 en 13 §12) | Nieuw Pro-team "Groos Personeelsdiensten" in Jimmy's account; Djulan als Member (20 dollar per maand); Pro is nodig voor de cron elk kwartier en voor custom events. | 13 (deel C), 10 (cron dagelijks op Hobby), 07 en 09 (zonder events) |
| JL24 | Resend (B-20; 09, 11, 13 en 15 §12) | Eigen Free-account van Groos in `eu-west-1`; Djulan controleert of de EU-regio op Free kan. 100 mails per dag; Pro (20 dollar per maand) bij krapte of als EU alleen op Pro kan, nooit uitwijken naar de VS. | 13, 09 (artikel 8 en 11), 11 |
| JL25 | Google en e-mailrecords (12 en 13 §12) | Search Console en Bedrijfsprofiel op een Google-account van Groos; categorie "Uitzendbureau"; DMARC `p=reject` blijft zonder rapportadres; het domein zonder "s" registreren en doorsturen (aanbeveling). | 13 (deel E en G), 12 |
| JL26 | Merk buiten de site (02 §12; Jimmy) | Geen merkonderzoek gedaan (BOIP, EUIPO, klasse 35); Pantone en folie volgen uit een proef. | Geen gevolg voor de site; vóór belettering laten toetsen |
| JL27 | Bedrijfsvoering in de juridische teksten (B-10, B-11; 09 §12) | Geen geschillencommissie of brancheorganisatie; klachtenregeling met reactie binnen vijf werkdagen en eindreactie binnen vier weken; salarisadministratie en boekhouder nog niet gekozen; geen AI in selectie; een cv gaat pas na overleg naar een opdrachtgever; inschrijven vanaf 16 jaar; registers in een nog te kiezen opslag; Jimmy levert de algemene voorwaarden. | 09 (artikelen 4, 5, 8, 10 en 14, §5.8), 07 (minimumleeftijd) |
| JL28 | Overige besluiten (00 §3.2) | B-06 (verplichte velden van een vacature), B-17 en B-18 (formuliervelden), B-21 tot en met B-26 (telefoon, openingstijden, adres, keurmerk, foto's, cijfers). | Zie "Gevolg bij anders" in §3.2 |
| JL29 | Fase 2: jobalert, talen en regio's (15 §12) | Jobalert dagelijks of wekelijks; taalvolgorde Turks, Bulgaars, Pools, Roemeens; regio's Westland, Rijswijk, Delft, Zoetermeer en Leidschendam-Voorburg; Resend Pro vanaf ongeveer 80 actieve jobalerts. | 15 |

### 7.3 Jurist (13 vragen)

Djulan legt deze vragen voor; de teksten van spec 09 gaan als geheel langs de jurist (JU1).

| Nr | Onderwerp | Aanname die de specs nu hanteren | Verandert |
|---|---|---|---|
| JU1 | Juridische toets (09 §12) | De teksten in 09 §6.4 tot en met §6.6 zijn concepten (versie 0.1) en gaan vóór de livegang langs een jurist. | 09 (`CONTENT`, `LEGAL_DOCS`, versie 1.0) |
| JU2 | Bewaartermijnen en afsluiten (B-07; 09 en 10 §12; met Jimmy en Lorenzo) | Afsluiten na 12 weken zonder contact geldt voor inschrijvingen en sollicitaties, anonimiseren 28 dagen later; een inschrijving geldt 365 dagen, of tot 28 dagen na afsluiten als dat eerder is; de herinnering na 8 weken staat alleen op het dashboard. Buiten de database: meldingsmails 4 weken, klachtdossier 1 jaar, verzoekenregister 2 jaar, datalekregister 5 jaar. | 10 (`auto_close_stale_applications`, `application_retain_until`), 09 (artikel 3, 4 en 12, §5.3), 08 |
| JU3 | Anonimiseren of verwijderen (10 §12) | Verlopen sollicitaties worden geanonimiseerd; aanvragen en berichten worden verwijderd. | 10 (`anonymize_applications`) |
| JU4 | Privacyvinkje (B-08) | Geen verplicht vinkje bij solliciteren, aanvragen en contact; wel bij `/inschrijven`, en een optioneel talentpoolvinkje. | 07 (zod-schema en formulier) |
| JU5 | Werkrecht (B-17; 07 en 10 §12) | Ja of nee; bij nee blijft solliciteren mogelijk met een uitnodigende hint. | 10 (enum met "weet ik niet"), 07 (`noHint`) |
| JU6 | Minimumleeftijd (B-32; 05 §12) | 18 jaar alleen bij een veiligheidsreden; in de logistiek alleen bij rijden op een heftruck of reachtruck. | 05, 06, 08, 09, 10 |
| JU7 | Uitspraken op beroepspagina's (05 §12; RAS met Jimmy en Lorenzo) | Een cao-naam alleen als bron van een loonindicatie; RAS-opleiding en uitzendregels schoonmaak met een TODO en zonder belofte; geen boetebedrag Wtta; inlenersaansprakelijkheid alleen algemeen, zonder g-rekening (CL-22). | 05, 09 (`check:claims`) |
| JU8 | Keurmerk, cao en Wtta-status (B-24; met Jimmy en Lorenzo) | Niets op de site tot bevestiging, alleen gelijkwaardige beloning. | 04 en 05 (strook en registerlink) |
| JU9 | FG, DPIA en WhatsApp (09 §12) | Geen functionaris gegevensbescherming en geen DPIA nodig; de rol van Meta en de keuze voor WhatsApp Business ter beoordeling. | 09 (artikel 1 en 7, V-06, `docs/compliance/`) |
| JU10 | Gegevens in mails (11 §12; met Jimmy en Lorenzo) | Bevestigingen tonen alleen telefoon, referentie, vacature, vaste keuzes en namen via `safeEcho`; interne meldingen bevatten naam, telefoon, e-mail en woonplaats, zonder cv of bericht. | 11 |
| JU11 | Sessieduur in het beheer (08 §12; met Jimmy en Lorenzo) | Geen maximale sessieduur; ingelogd op de eigen telefoon tot uitloggen. | 08 (tijdslimiet in Supabase Auth Pro), 09 (datalekprocedure) |
| JU12 | Fase 2: talentpool, jobalert en herinnering (15 §12; met Jimmy en Lorenzo en Djulan) | Talentpool automatisch voor wie toestemming gaf, 365 dagen en nooit langer dan de gekoppelde bewaartermijn; geen jobalertvinkje bij solliciteren; herbevestigen na 365 dagen zonder klikmeting; herinnering na 8 weken alleen intern. | 15, 07, 09, 11 |
| JU13 | Fase 2: privacyverzoeken en talen (15 §12; talen met Jimmy en Lorenzo) | Het register bewaart een hash van e-mail of telefoon; inzage-export als JSON; privacyverklaring voor gedeeltelijke talen via de Engelse versie. | 15, 09 |

### 7.4 Controles in de bouw (geen beslissing van een persoon)

Deze punten uit §12 heeft een andere spec, de kruiscontrole, een test of de
bouw-agent als bevestiger. De nazorg-sub-agent van de betreffende spec in 3b,
of de bouw-agent van de genoemde stap, controleert ze en meldt een afwijking
hier.

- 01: geen header, footer of `<main>` in pagina's; beroepsnamen via
  `beroepen.<id>.*`; opties `languages: false` en `canonical` van
  `pageMetadata()`; vorm van `FooterLegal`.
- 02: geen `button.tsx`; budget van twee `get_component`-aanroepen; nazorg van
  bouwstap 2 in 3b; doelgrootte bij keuzevakjes; `logo-email.png`; OG-fonts;
  iconen per beroep.
- 03: beroepsnamen en doelgroepblokken van 05; `people`, `whatsappLink` en
  `openingHours` van 01; vacaturetitel zonder plaats; claims in twee lagen;
  OG-beeld per taal (12).
- 04: kop van de vacaturesectie als platte tekst; feiten in de copy die op 06
  en 10 steunen.
- 05: props van `VacancyList` en `VacancyCard`; prefill `?beroep=` in 07;
  Vitest-alias; Wtta-fase lezen zonder helper.
- 06: prop van `ApplyForm`; `lib/format.ts` in plaats van `i18n/formats.ts`.
- 07: namen van de e-mailfuncties (11); eigenaarschap van
  `components/contact/*` en `app/actions/_shared.ts`.
- 08: voorbeeldweergave met het detailcomponent van 06.
- 09: naam en duur van de Supabase-sessiecookie; sleutels `forms.privacy.*`;
  footer-sleutels; chrome in `LegalPage`; logging van cv-inzage in 08 en 10.
- 10: telefoonnormalisatie zonder extra package.
- 11: webhook in fase 1; status `queued` in consolemodus; eigenaarschap van
  `supabase/templates/*`; `@react-email/render` in Next 16; cron
  `herinneringen` in fase 2.
- 12: absolute titels; `vacancyMetadata()` in `lib/seo.ts`; paginering in de
  test van 14; kleurrollen en logo in de OG-afbeelding; sleutels van 05 en 06.
- 13: eigenaarschap BotID; uploadroute; inlogpad beheer; drie cron-routes;
  beroepen in een migratie; `db:admin` en `grant_admin`; sleutels via de
  Marketplace (spec 13 D2); eerste beheerder op `groos-dev`; CSP met BotID op de
  preview.
- 14: seed resetten vóór een run; mail tijdens e2e; `check-copy` en
  `check-claims` als K5 en K6; constante voor de invultijd; `data-slot` op
  `CtaButton`.
- 15: aanvullingen in bestanden van andere eigenaren.

### 7.5 Notities uit de bouw

Bouw-agents noteren hier wat hun spec vraagt (spec 03 §10 en AC-03-24, spec 05
§10 stap 16, spec 11 §10, spec 15 E-15-02), met datum.

- Goedkeuring van de Nederlandse copy door Djulan: nog niet gegeven (AC-03-24).
- Lijst open claims voorgelegd aan Jimmy en Lorenzo: nog niet (AC-03-24; zie
  JL4, JL5, JL7 tot en met JL11).
- Vrijgave van onderdelen van fase 2: geen (E-15-02).

## 8 Traceerbaarheid

Per R-eis de modules, de eisen (E-id's) en de acceptatiecriteria (AC-id's) die
hem dekken. De tabel is afgeleid uit de eisentabel in §3 en de AC-tabel in §11
van spec 01 tot en met 15 (stand 2 oktober 2026, na kruiscontrole ronde 4): een
E-id dekt de R-eisen uit zijn kolom "Dient"; een AC-id dekt de R-eisen van de
E-id's die hij noemt, plus de R-eisen die spec 03 en 07 per AC direct noemen.
"Modules" telt alleen fase 1 (spec 01 tot en met 14); spec 15 staat in een
eigen kolom en telt niet mee voor de dekking van fase 1. Een R-eis zonder AC in
fase 1 is een gat en staat in de kolom AC als "**gat**".

| Eis | Modules | Eisen | Acceptatiecriteria | Fase 2 (spec 15) |
|---|---|---|---|---|
| R-01 | 01 tot en met 07, 12 en 14 | E-01-01, E-01-05, E-01-07, E-01-09, E-01-11, E-02-15, E-03-01, E-03-13, E-04-01 tot en met E-04-04, E-04-06 tot en met E-04-08, E-05-01, E-05-02, E-05-10, E-05-14, E-06-06, E-06-08, E-06-10, E-06-14, E-07-01, E-07-10, E-07-11, E-12-03, E-12-13, E-12-17 en E-14-03 | AC-01-01, AC-01-02, AC-01-05, AC-01-10 tot en met AC-01-13, AC-01-16 tot en met AC-01-19, AC-01-28, AC-01-34, AC-01-36, AC-02-09, AC-02-19, AC-03-07, AC-03-08, AC-03-13, AC-04-01 tot en met AC-04-04, AC-04-06, AC-04-07, AC-04-09 tot en met AC-04-11, AC-04-17, AC-04-23, AC-04-25, AC-04-26, AC-05-01 tot en met AC-05-06, AC-05-15, AC-05-23, AC-05-24, AC-05-29, AC-06-09, AC-06-10, AC-06-17, AC-06-28, AC-07-01, AC-07-05 tot en met AC-07-08, AC-07-19 tot en met AC-07-21, AC-07-25, AC-07-27, AC-07-31, AC-12-17, AC-12-20, AC-12-23, AC-12-27, AC-14-03, AC-14-33 en AC-14-34 | E-15-10 en E-15-26; AC-15-16, AC-15-35 en AC-15-44 |
| R-02 | 01 tot en met 06, 08, 10, 12 en 14 | E-01-18, E-02-07, E-03-04, E-03-16, E-04-02, E-04-14, E-05-08, E-05-17, E-06-01 tot en met E-06-06, E-06-09, E-06-12, E-06-13, E-08-07, E-08-08, E-08-10, E-10-01, E-10-02, E-10-05, E-10-11, E-12-17 en E-14-03 | AC-01-05, AC-02-02, AC-02-14, AC-02-18, AC-03-11, AC-03-18, AC-03-26, AC-04-04, AC-04-05, AC-05-02, AC-05-09, AC-05-10, AC-05-28, AC-06-01 tot en met AC-06-05, AC-06-09, AC-06-11, AC-06-13 tot en met AC-06-16, AC-06-18, AC-06-37, AC-08-12 tot en met AC-08-24, AC-08-42, AC-10-02, AC-10-04, AC-10-05, AC-10-07, AC-10-10, AC-10-15 tot en met AC-10-18, AC-10-24, AC-10-26, AC-10-31, AC-10-33, AC-12-27, AC-14-03, AC-14-33 en AC-14-34 | E-15-05, E-15-07, E-15-10 en E-15-23; AC-15-06 tot en met AC-15-08, AC-15-11, AC-15-12, AC-15-16, AC-15-17, AC-15-33, AC-15-34, AC-15-44 en AC-15-48 |
| R-03 | 01 tot en met 03, 07, 08 en 10 tot en met 14 | E-01-15, E-02-07, E-02-18, E-03-16, E-07-04, E-08-01 tot en met E-08-07, E-08-11 tot en met E-08-14, E-10-01, E-10-07, E-11-09, E-11-12, E-11-13, E-12-09, E-13-11, E-13-14, E-13-15, E-14-04 en E-14-14 | AC-01-06 tot en met AC-01-08, AC-02-02, AC-02-14, AC-02-18, AC-02-23, AC-03-26, AC-07-01, AC-07-06, AC-07-22, AC-08-01 tot en met AC-08-14, AC-08-17 tot en met AC-08-20, AC-08-22 tot en met AC-08-33, AC-08-39, AC-08-40, AC-10-02, AC-10-08, AC-10-24, AC-11-09, AC-11-10, AC-11-18, AC-11-19, AC-11-21, AC-11-22, AC-12-14, AC-13-10, AC-13-19 tot en met AC-13-22, AC-13-27, AC-13-28, AC-13-30, AC-14-03, AC-14-06, AC-14-22, AC-14-28 en AC-14-35 | E-15-11 tot en met E-15-14, E-15-17, E-15-19, E-15-29 en E-15-34; AC-15-17 tot en met AC-15-21, AC-15-25, AC-15-27, AC-15-40 en AC-15-46 |
| R-04 | 01, 02, 07 tot en met 11, 13 en 14 | E-01-19, E-02-07, E-02-08, E-07-01 tot en met E-07-08, E-07-13, E-08-12, E-08-13, E-09-10, E-10-01, E-10-06, E-10-08, E-11-01, E-11-02, E-11-05, E-11-06, E-11-08, E-11-09, E-11-13, E-13-04, E-13-05, E-13-13, E-13-15, E-14-02 en E-14-03 | AC-01-30, AC-02-02, AC-02-14, AC-02-15, AC-02-18, AC-07-01 tot en met AC-07-13, AC-07-20, AC-07-22, AC-07-23, AC-07-27 tot en met AC-07-30, AC-08-30, AC-08-31, AC-09-13, AC-09-14, AC-09-29, AC-10-02, AC-10-06, AC-10-22 tot en met AC-10-24, AC-10-29, AC-11-01 tot en met AC-11-03, AC-11-06, AC-11-08 tot en met AC-11-11, AC-11-14, AC-11-15, AC-11-18 tot en met AC-11-20, AC-11-24, AC-11-25, AC-13-08, AC-13-09, AC-13-21, AC-13-26, AC-13-29, AC-13-30, AC-14-02, AC-14-03, AC-14-33 en AC-14-34 | — |
| R-05 | 01, 02, 04, 05, 08, 09, 11, 12 en 14 | E-01-07, E-01-21, E-02-01, E-02-04 tot en met E-02-06, E-02-09, E-02-10, E-02-15, E-04-08, E-04-16, E-05-03, E-08-16, E-09-06, E-11-10, E-12-11, E-14-07 en E-14-10 | AC-01-10 tot en met AC-01-13, AC-01-28, AC-01-29, AC-01-34, AC-02-01, AC-02-04 tot en met AC-02-07, AC-02-09, AC-02-13, AC-02-14, AC-02-17, AC-02-19, AC-02-24 tot en met AC-02-26, AC-04-17, AC-04-23 tot en met AC-04-25, AC-05-03, AC-05-25, AC-08-34, AC-08-35, AC-08-37, AC-09-19, AC-09-20, AC-09-22, AC-09-29, AC-11-14, AC-11-17, AC-12-16, AC-14-15 tot en met AC-14-18 en AC-14-27 | — |
| R-06 | 02, 04, 11 en 12 | E-02-12, E-02-13, E-04-16, E-11-10 en E-12-11 | AC-02-09 tot en met AC-02-12, AC-02-21, AC-04-17, AC-04-23 tot en met AC-04-25, AC-11-14, AC-11-17 en AC-12-16 | — |
| R-07 | 03 tot en met 09, 11, 12 en 14 | E-03-01 tot en met E-03-07, E-03-09, E-03-11, E-03-18, E-04-04, E-04-09, E-04-10, E-05-02, E-05-09, E-05-15, E-06-19, E-06-22, E-07-12, E-08-15, E-09-04, E-09-06, E-09-10, E-09-16, E-11-03, E-11-12, E-12-02 en E-14-09 | AC-03-02, AC-03-04 tot en met AC-03-11, AC-03-15 tot en met AC-03-19, AC-03-23 tot en met AC-03-25, AC-04-01, AC-04-07, AC-04-08, AC-04-14 tot en met AC-04-16, AC-04-18, AC-05-05, AC-05-06, AC-05-11 tot en met AC-05-14, AC-05-30, AC-05-32, AC-06-13, AC-06-15, AC-06-24, AC-06-29, AC-07-21, AC-07-26, AC-08-36, AC-09-06, AC-09-13, AC-09-14, AC-09-16, AC-09-19, AC-09-20, AC-09-22, AC-09-29, AC-11-05, AC-11-21, AC-11-22, AC-12-01, AC-12-20, AC-12-29, AC-12-33 en AC-14-26 | E-15-21, E-15-27 en E-15-31; AC-15-29, AC-15-30, AC-15-37, AC-15-39 en AC-15-42 |
| R-08 | 01 tot en met 04, 06 en 14 | E-01-02, E-02-06, E-02-17, E-03-07, E-03-12, E-04-05, E-04-09, E-04-12, E-06-22 en E-14-09 | AC-01-02, AC-01-04, AC-02-06, AC-02-07, AC-03-03, AC-03-23, AC-04-08, AC-04-14 tot en met AC-04-16, AC-04-19, AC-06-15, AC-06-29 en AC-14-26 | E-15-31; AC-15-42 |
| R-09 | 01 tot en met 10 en 12 tot en met 14 | E-01-04, E-01-06, E-01-11, E-01-12, E-01-15, E-01-17, E-01-23, E-02-13, E-02-14, E-03-11, E-03-17, E-04-03, E-04-11, E-05-09, E-05-10, E-05-12 tot en met E-05-14, E-06-01, E-06-05, E-06-08, E-06-11, E-06-18, E-08-01, E-09-01, E-09-05, E-09-07, E-10-03, E-10-11, E-12-01 tot en met E-12-05, E-12-08 tot en met E-12-11, E-12-13, E-12-14, E-12-19, E-13-12, E-13-14, E-13-18, E-14-02, E-14-08 en E-14-09 | AC-01-06 tot en met AC-01-08, AC-01-13, AC-01-18 tot en met AC-01-20, AC-01-24, AC-01-31, AC-01-32, AC-01-34, AC-01-37, AC-02-09 tot en met AC-02-12, AC-02-22, AC-03-02, AC-03-09, AC-03-14 tot en met AC-03-17, AC-04-06, AC-04-12 tot en met AC-04-14, AC-05-11 tot en met AC-05-15, AC-05-17 tot en met AC-05-23, AC-06-01, AC-06-03, AC-06-10 tot en met AC-06-12, AC-06-19, AC-06-20, AC-06-22, AC-06-23, AC-07-20, AC-08-01 tot en met AC-08-03, AC-08-40, AC-09-01, AC-09-07 tot en met AC-09-09, AC-09-20, AC-09-27, AC-09-29, AC-10-09, AC-10-15 tot en met AC-10-18, AC-10-31, AC-10-33, AC-12-01, AC-12-02, AC-12-05, AC-12-06, AC-12-08, AC-12-11 tot en met AC-12-24, AC-12-26, AC-12-29, AC-12-33, AC-13-10, AC-13-23 tot en met AC-13-25, AC-13-27, AC-13-28, AC-13-32 tot en met AC-13-34, AC-14-02 en AC-14-19 tot en met AC-14-26 | E-15-25, E-15-26 en E-15-28; AC-15-35, AC-15-36, AC-15-38, AC-15-44 en AC-15-48 |
| R-10 | 01, 03, 06 tot en met 10 en 12 tot en met 14 | E-01-14, E-03-16, E-06-11, E-06-16, E-06-18, E-08-07 tot en met E-08-10, E-09-16, E-10-02 tot en met E-10-04, E-10-12, E-12-06 tot en met E-12-08, E-12-12, E-12-20, E-13-08, E-13-18, E-14-02, E-14-03 en E-14-08 | AC-01-22, AC-03-26, AC-06-12, AC-06-19 tot en met AC-06-23, AC-07-13, AC-07-22, AC-08-12 tot en met AC-08-24, AC-08-42, AC-09-16, AC-09-29, AC-10-09 tot en met AC-10-15, AC-12-03, AC-12-04, AC-12-06 tot en met AC-12-13, AC-12-16, AC-12-26, AC-13-15, AC-13-16, AC-13-32 tot en met AC-13-34, AC-14-02, AC-14-03, AC-14-19 tot en met AC-14-25, AC-14-33 en AC-14-34 | E-15-03, E-15-04, E-15-13, E-15-22 en E-15-23; AC-15-03 tot en met AC-15-05, AC-15-17 en AC-15-31 tot en met AC-15-34 |
| R-11 | 07 tot en met 11, 13 en 14 | E-07-06, E-07-09, E-07-13, E-08-01 tot en met E-08-03, E-08-11, E-08-14, E-09-01 tot en met E-09-04, E-09-08, E-09-10 tot en met E-09-15, E-09-18 tot en met E-09-22, E-10-05 tot en met E-10-10, E-10-12, E-10-14, E-10-15, E-11-04, E-11-05, E-13-08 tot en met E-13-11, E-13-13, E-13-14, E-13-16, E-13-17, E-13-19, E-14-05 en E-14-14 | AC-07-02 tot en met AC-07-05, AC-07-17, AC-07-18, AC-07-23, AC-07-25, AC-07-28, AC-08-01 tot en met AC-08-08, AC-08-14, AC-08-19, AC-08-24 tot en met AC-08-29, AC-08-32, AC-08-39, AC-08-40, AC-09-01 tot en met AC-09-06, AC-09-09, AC-09-10, AC-09-13 tot en met AC-09-18, AC-09-24 tot en met AC-09-27, AC-09-29, AC-10-03 tot en met AC-10-08, AC-10-12, AC-10-13, AC-10-19 tot en met AC-10-23, AC-10-25, AC-10-26, AC-10-29, AC-10-30, AC-10-32, AC-11-01, AC-11-03, AC-11-04, AC-11-07, AC-11-20, AC-13-02, AC-13-10, AC-13-11, AC-13-15 tot en met AC-13-22, AC-13-26 tot en met AC-13-28, AC-13-31, AC-13-35, AC-13-36, AC-13-38, AC-14-03 tot en met AC-14-05, AC-14-22 en AC-14-28 | E-15-05, E-15-06, E-15-08, E-15-09, E-15-11, E-15-15 tot en met E-15-18, E-15-20, E-15-29 en E-15-34; AC-15-06 tot en met AC-15-10, AC-15-13 tot en met AC-15-15, AC-15-17 tot en met AC-15-19, AC-15-22 tot en met AC-15-28, AC-15-40, AC-15-44 en AC-15-46 tot en met AC-15-48 |
| R-12 | 01 tot en met 12 en 14 | E-01-04, E-02-10, E-03-06, E-03-08, E-04-05, E-04-06, E-04-09, E-05-06, E-05-07, E-05-11, E-05-12, E-06-13, E-06-22, E-07-15, E-08-08, E-09-05, E-09-08, E-09-09, E-09-16, E-09-17, E-09-24, E-10-02, E-11-11, E-12-05, E-12-14 tot en met E-12-16, E-12-18, E-14-09 en E-14-13 | AC-01-13, AC-01-19, AC-02-26, AC-03-09 tot en met AC-03-12, AC-03-24, AC-04-08, AC-04-09, AC-04-14 tot en met AC-04-16, AC-04-25, AC-05-07, AC-05-08, AC-05-13, AC-05-16 tot en met AC-05-19, AC-06-14, AC-06-15, AC-06-29, AC-07-24, AC-08-15, AC-08-16, AC-08-42, AC-09-07, AC-09-08, AC-09-10 tot en met AC-09-12, AC-09-16, AC-09-23, AC-09-28, AC-09-29, AC-10-10, AC-11-13, AC-12-05, AC-12-15, AC-12-18, AC-12-19, AC-12-24 tot en met AC-12-26, AC-12-28, AC-14-26 en AC-14-32 | E-15-02, E-15-24, E-15-25, E-15-27 en E-15-31; AC-15-02, AC-15-33, AC-15-35 tot en met AC-15-37, AC-15-39, AC-15-42 en AC-15-48 |
| R-13 | 01, 03 tot en met 07, 09 tot en met 12 en 14 | E-01-10, E-01-13, E-01-14, E-03-05, E-03-10, E-03-11, E-03-14, E-04-10, E-05-01, E-05-04, E-05-05, E-06-17, E-06-19, E-06-22, E-07-11, E-07-12, E-09-01, E-09-23, E-10-16, E-11-03, E-12-01, E-12-04, E-12-08, E-14-03, E-14-08 en E-14-09 | AC-01-01, AC-01-08, AC-01-09, AC-01-21 tot en met AC-01-23, AC-01-30, AC-03-01, AC-03-02, AC-03-06, AC-03-09, AC-03-16, AC-03-17, AC-03-20 tot en met AC-03-22, AC-03-25, AC-04-01, AC-04-18, AC-05-01 tot en met AC-05-04, AC-05-06, AC-05-24, AC-05-29, AC-05-31, AC-06-13, AC-06-15, AC-06-24, AC-06-25, AC-06-29, AC-07-20, AC-07-21, AC-07-25, AC-07-26, AC-09-01, AC-09-09, AC-09-21, AC-09-27, AC-09-29, AC-10-27, AC-11-05, AC-12-01, AC-12-02, AC-12-06, AC-12-08, AC-12-11 tot en met AC-12-13, AC-12-21, AC-12-22, AC-12-33, AC-14-03, AC-14-19 tot en met AC-14-26, AC-14-33 en AC-14-34 | E-15-21, E-15-22, E-15-27 en E-15-28; AC-15-29 tot en met AC-15-32 en AC-15-37 tot en met AC-15-39 |
| R-14 | 01 tot en met 08, 10, 12 en 14 | E-01-08, E-01-09, E-01-19, E-02-02, E-02-04, E-02-05, E-02-07, E-02-08, E-02-15, E-03-02, E-03-13, E-04-01, E-04-07, E-05-06, E-05-08, E-06-07, E-06-12, E-06-14, E-06-15, E-06-21, E-07-03, E-07-06, E-07-10, E-08-05, E-12-12, E-14-03, E-14-06, E-14-07 en E-14-10 | AC-01-14 tot en met AC-01-18, AC-01-29, AC-01-30, AC-01-34, AC-02-01, AC-02-02, AC-02-05, AC-02-09, AC-02-13 tot en met AC-02-15, AC-02-17 tot en met AC-02-19, AC-02-24, AC-03-13, AC-03-19, AC-04-01 tot en met AC-04-03, AC-04-10, AC-04-11, AC-04-23, AC-04-26, AC-05-07, AC-05-09, AC-05-10, AC-05-28, AC-06-06 tot en met AC-06-08, AC-06-14 tot en met AC-06-18, AC-06-30, AC-06-33, AC-06-37, AC-07-01 tot en met AC-07-04, AC-07-12, AC-07-13, AC-07-16, AC-07-19, AC-07-25, AC-07-28, AC-07-31, AC-08-26, AC-08-33, AC-10-29, AC-12-08, AC-12-16, AC-14-03, AC-14-07 tot en met AC-14-18, AC-14-27, AC-14-31, AC-14-33 en AC-14-34 | — |
| R-15 | 01 tot en met 11 en 14 | E-01-03, E-01-08, E-01-12, E-01-16 tot en met E-01-18, E-01-20, E-02-02, E-02-04, E-02-05, E-02-09, E-02-11, E-02-18, E-03-09, E-03-15, E-04-07, E-04-13, E-05-16, E-06-03, E-06-07, E-06-09, E-06-20, E-06-21, E-06-23, E-07-03, E-07-14, E-08-16, E-09-06, E-10-11, E-11-10, E-14-06 en E-14-07 | AC-01-02, AC-01-03, AC-01-05, AC-01-14, AC-01-15, AC-01-20, AC-01-23 tot en met AC-01-27, AC-01-29, AC-01-33, AC-01-34, AC-01-39, AC-02-01, AC-02-05, AC-02-13, AC-02-14, AC-02-16, AC-02-17, AC-02-23 tot en met AC-02-25, AC-03-15, AC-03-17, AC-03-20, AC-03-22, AC-04-10, AC-04-11, AC-04-20 tot en met AC-04-22, AC-04-24, AC-04-26, AC-05-04, AC-05-25 tot en met AC-05-27, AC-06-01, AC-06-05 tot en met AC-06-08, AC-06-13, AC-06-26, AC-06-27, AC-06-30 tot en met AC-06-34, AC-06-38, AC-07-01, AC-07-12 tot en met AC-07-16, AC-07-27, AC-07-28, AC-08-34, AC-08-35, AC-08-37, AC-09-19, AC-09-20, AC-09-22, AC-09-29, AC-10-15 tot en met AC-10-18, AC-10-31, AC-10-33, AC-11-14, AC-11-17, AC-14-07 tot en met AC-14-18 en AC-14-31 | — |
| R-16 | 01 tot en met 09 en 12 | E-01-24, E-02-16, E-03-19, E-04-15, E-05-15, E-06-24, E-07-16, E-08-18, E-09-25 en E-12-22 | AC-01-35, AC-01-38, AC-02-20, AC-03-27, AC-04-27, AC-05-30, AC-05-32, AC-06-35, AC-07-32, AC-08-41, AC-09-30 en AC-12-31 | E-15-32; AC-15-43 |
| R-17 | 01 tot en met 06 en 08 tot en met 14 | E-01-25, E-02-03, E-03-18, E-04-14, E-05-17, E-06-20, E-06-25, E-08-19, E-09-19, E-09-22, E-09-24, E-10-13, E-10-14, E-11-07, E-11-14, E-12-21, E-13-01, E-13-02, E-13-04, E-13-20, E-14-01, E-14-05 en E-14-13 | AC-01-30, AC-02-02, AC-02-03, AC-02-08, AC-03-04, AC-03-24, AC-04-04, AC-04-05, AC-05-02, AC-05-10, AC-05-28, AC-06-26, AC-06-27, AC-06-34, AC-06-36, AC-06-38, AC-08-11, AC-09-25, AC-09-26, AC-09-28, AC-09-29, AC-10-01, AC-10-03, AC-10-26, AC-10-32, AC-11-01, AC-11-02, AC-11-12, AC-11-16, AC-12-29, AC-12-30, AC-13-01, AC-13-03 tot en met AC-13-08, AC-13-10, AC-13-19, AC-13-37, AC-14-01, AC-14-03 tot en met AC-14-05 en AC-14-32 | E-15-04 en E-15-33; AC-15-04 en AC-15-45 |
| R-18 | 13 en 14 | E-13-06, E-13-07, E-13-12, E-13-19, E-14-12 en E-14-13 | AC-13-13 tot en met AC-13-15, AC-13-23 tot en met AC-13-25, AC-13-35, AC-13-36, AC-14-29 en AC-14-32 | — |
| R-19 | 01 tot en met 14 | E-01-01 tot en met E-01-03, E-01-05, E-01-06, E-01-22, E-02-03, E-03-03, E-03-05, E-03-10, E-04-12, E-05-03 tot en met E-05-05, E-06-10, E-07-02, E-08-14, E-08-17, E-09-07, E-10-01, E-10-17, E-11-01, E-11-08, E-11-15, E-12-20, E-13-02, E-13-03, E-14-01, E-14-02, E-14-09, E-14-11 en E-14-12 | AC-01-01, AC-01-02, AC-01-04, AC-01-05, AC-01-23, AC-01-27, AC-01-36, AC-01-37, AC-02-02, AC-02-03, AC-02-08, AC-03-01, AC-03-02, AC-03-04 tot en met AC-03-06, AC-03-08, AC-03-19, AC-03-21, AC-03-22, AC-03-25, AC-04-19, AC-05-03, AC-05-06, AC-05-25, AC-05-29, AC-05-31, AC-06-28, AC-07-08, AC-08-05, AC-08-14, AC-08-19, AC-08-27, AC-08-28, AC-08-32, AC-08-37, AC-08-38, AC-09-08, AC-09-09, AC-09-20, AC-09-29, AC-10-02, AC-10-24, AC-10-28, AC-11-02, AC-11-08, AC-11-23 tot en met AC-11-25, AC-12-04, AC-13-02 tot en met AC-13-06, AC-13-12, AC-13-19, AC-14-01, AC-14-02, AC-14-26, AC-14-29 en AC-14-30 | E-15-30; AC-15-41 |
| R-20 | 10 tot en met 12 | E-10-16, E-11-15 en E-12-23 | AC-10-27, AC-11-23 en AC-12-32 | E-15-01 en E-15-02; AC-15-01 en AC-15-02 |

Gaten: geen. Elke R-eis heeft in fase 1 minstens één E-id en één AC-id, en
elke E-id uit spec 01 tot en met 15 wordt door minstens één AC-id gedekt.
AC-12-31 (R-16) is handmatig: verslag onder "Spec 12" in
`docs/21st-keuzes.md`, afgetekend door Djulan.

Aantal eisen en acceptatiecriteria per spec (de nummering loopt in elke spec
zonder gaten):

| Spec | E-id's | AC-id's |
|---|---|---|
| 01 | 25 (E-01-01 tot en met E-01-25) | 39 (AC-01-01 tot en met AC-01-39) |
| 02 | 18 (E-02-01 tot en met E-02-18) | 26 (AC-02-01 tot en met AC-02-26) |
| 03 | 19 (E-03-01 tot en met E-03-19) | 27 (AC-03-01 tot en met AC-03-27) |
| 04 | 16 (E-04-01 tot en met E-04-16) | 27 (AC-04-01 tot en met AC-04-27) |
| 05 | 17 (E-05-01 tot en met E-05-17) | 32 (AC-05-01 tot en met AC-05-32) |
| 06 | 25 (E-06-01 tot en met E-06-25) | 38 (AC-06-01 tot en met AC-06-38) |
| 07 | 16 (E-07-01 tot en met E-07-16) | 32 (AC-07-01 tot en met AC-07-32) |
| 08 | 19 (E-08-01 tot en met E-08-19) | 42 (AC-08-01 tot en met AC-08-42) |
| 09 | 25 (E-09-01 tot en met E-09-25) | 30 (AC-09-01 tot en met AC-09-30) |
| 10 | 17 (E-10-01 tot en met E-10-17) | 33 (AC-10-01 tot en met AC-10-33) |
| 11 | 15 (E-11-01 tot en met E-11-15) | 25 (AC-11-01 tot en met AC-11-25) |
| 12 | 23 (E-12-01 tot en met E-12-23) | 33 (AC-12-01 tot en met AC-12-33) |
| 13 | 20 (E-13-01 tot en met E-13-20) | 38 (AC-13-01 tot en met AC-13-38) |
| 14 | 14 (E-14-01 tot en met E-14-14) | 35 (AC-14-01 tot en met AC-14-35) |
| 15 | 34 (E-15-01 tot en met E-15-34) | 48 (AC-15-01 tot en met AC-15-48) |
| totaal | 303 | 505 |
