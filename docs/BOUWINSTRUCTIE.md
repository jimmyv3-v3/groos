# Bouwinstructie: website en vacaturebank Groos Personeelsdiensten

Voor de Claude-sessie die in deze repo de specs opstelt en daarna bouwt. Lees
dit volledig voordat je iets voorstelt of wijzigt.

---

## 1. Jouw rol

Je bouwt samen met Djulan (ontwikkelaar, SKUU) de website van Groos
Personeelsdiensten B.V.: een nieuw uitzendbureau in Den Haag van Jimmy en
Lorenzo, met vijf beroepen (glazenwassers, schoonmakers, logistiek
medewerkers, verhuizers, hulpkrachten bouw en sloop) en twee doelgroepen
(werkgevers en werkzoekenden). De site krijgt een vacaturebank met een eigen
beheeromgeving.

Werk in twee stappen:

1. **Specs opstellen** (§5) en laten goedkeuren door Djulan.
2. **Bouwen per module** in de volgorde van §4, met na elke module een
   werkende, geverifieerde stand.

## 2. Wat er al staat

Deze repo is op 2 oktober 2026 opgezet vanuit de J. Versseput-site (zelfde
opdrachtgever). Stand:

- Volledige marketing-site-structuur met alle JV-secties en paginatypes,
  neutraal gestyled (grijs) en met `TODO`-teksten. Zie docs/MIGRATIE.md §5
  voor de blauwdruk.
- Tweetalig NL/EN via next-intl, taalkeuze via `proxy.ts`.
- SEO-laag: `pageMetadata()`, JSON-LD-builders, automatische sitemap,
  `robots.txt` en `llms.txt`, werkende OG-afbeelding en iconen.
- Formulier via Web3Forms (zonder backend).
- Geverifieerd: `npm run verify` slaagt (typecheck, lint, build met 29
  statische pagina's); visueel gecontroleerd op desktop en mobiel.
- `npm run check` toont nog alle placeholders; dat is de bedoeling.
- Nog niet: Groos-identiteit, echte tekst, Groos-routes, vacatures, Supabase,
  beheeromgeving, GitHub-repo, Vercel-project, domein.

## 3. Lees in deze volgorde

1. `CLAUDE.md` (werkafspraken, schrijfregels, SEO-afspraken).
2. `context/README.md` en dan de genummerde contextbestanden. De belangrijkste
   voor de specs:
   - `00-bedrijfsoverzicht.md`: wie, wat, contactgegevens, doelgroepen.
   - `01-beroepen-profielen.md`: taken, eisen, certificaten, cao per beroep.
   - `08-tekstelementen-inventaris.md`: alle tekstelementen van JV, de mapping
     naar Groos, nieuwe tekstelementen en het sitemap-voorstel (§7).
   - `11-backend-admin-strategie.md`: platformkeuze, datamodel, statusflows,
     schermen van de beheeromgeving, mappenstructuur.
   - `12-branding-richting.md`: drie merkrichtingen, aanbeveling en tokens.
   - `09-juridisch-en-compliance.md`: wat juridisch moet kloppen.
   - `05-referentie-wilk-site.md`, `13-concurrentie-en-inspiratie.md`: alleen
     ter begrip; niets één-op-één overnemen.
3. `docs/MIGRATIE.md`: wat er uit JV komt en hoe het op de Groos-sitemap past (§7).
4. `docs/STAPPENPLAN.md`: de takenlijst van Djulan tot livegang.

Is een genoemd contextbestand er nog niet, vraag Djulan dan of het nog komt.

## 4. Wat er gebouwd moet worden

Fase 1 is nodig voor livegang. Fase 2 komt daarna.

### 4.1 Identiteit en designsysteem (fase 1)

- Gekozen merkrichting uit context/12 omzetten naar tokens in
  `app/globals.css` (inclusief `--brand-subtle`, `--brand`, `--brand-strong`),
  `lib/brand.ts`, lettertypes in de layout en signature-klassen.
- Logo (beeldmerk + woordmerk) in `components/brand/*`, favicon, apple-icon,
  OG-afbeelding.
- Merk-CTA opnieuw ontwerpen in `components/ui/cta-button.tsx` (props gelijk
  houden).
- Klaar als: geen grijze placeholder-tokens meer, contrast WCAG AA (koppen en
  knoppen AAA waar context/12 dat vraagt), alle pagina's visueel gecontroleerd
  op 390/768/1280/1440 px.

### 4.2 Informatiearchitectuur en routes (fase 1)

- Sitemap volgens context/08 §7: `/`, `/werkgevers`,
  `/werkgevers/personeel-aanvragen`, `/personeel/[beroep]`, `/werkzoekenden`,
  `/werken-als/[beroep]`, `/vacatures`, `/vacatures/[slug]`,
  `/open-sollicitatie`, `/over-ons`, `/contact`, juridische pagina's,
  bedankpagina's (`noindex`). Fase 2: `/jobalert`, `/uitzendbureau/[stad]`.
- Hergebruik de JV-templates zoals beschreven in docs/MIGRATIE.md §7. Het
  register `content/services` wordt het beroepenregister; maak een tweede
  perspectief (werkgevers en werkzoekenden) zonder de template te dupliceren.
- Pas mee aan: `lib/site.ts` (`nav`), header-uitklapmenu, footer-kolommen,
  `app/sitemap.ts`, `app/llms.txt/route.ts`.
- Besluit of Engelse slugs Nederlands blijven of via next-intl `pathnames`
  worden vertaald (`/en/jobs`).
- Klaar als: alle routes bestaan, interne links kloppen, sitemap en llms.txt
  bevatten precies de indexeerbare pagina's.

### 4.3 Content (fase 1)

- Nederlandse copy voor alle `TODO`'s in `messages/nl.json`, `lib/site.ts` en
  `content/`, op basis van de context en de schrijfregels in `CLAUDE.md`.
- Twee tonen: werkgevers (u-vorm, zakelijk) en werkzoekenden (besluit:
  je-vorm of u-vorm; zie context).
- Daarna Engels, als besloten is dat de site tweetalig blijft.
- Klaar als: `npm run check` geen placeholders meer meldt (behalve bewust
  uitgestelde onderdelen) en Djulan de tekst heeft gelezen.

### 4.4 Vacaturebank, publiek deel (fase 1)

- `/vacatures`: overzicht met zoeken en filters (beroep, plaats, uren),
  lege staat, paginering.
- `/vacatures/[slug]`: detail met kenmerken, taken, eisen, aanbod,
  sollicitatieformulier, vergelijkbare vacatures. Opbouw op basis van het
  dienstpagina-template.
- **JobPosting-JSON-LD** per vacature (Google for Jobs): `title`,
  `description`, `datePosted`, `validThrough`, `employmentType`,
  `hiringOrganization`, `jobLocation`, waar mogelijk `baseSalary`. Voeg een
  `jobPostingLd()`-builder toe aan `lib/seo.ts`.
- Vervulde of verlopen vacatures: uit de sitemap, met een nette melding en
  links naar vergelijkbare vacatures (zie context/08 §6.12 en context/11 §3.1).
- Data uit Supabase via gecachte leesfuncties (`lib/data/*`), met
  revalidatie zodra een vacature in de beheeromgeving wijzigt.
- Klaar als: vacatures uit de database verschijnen, JSON-LD valideert in de
  Rich Results Test en verlopen vacatures correct verdwijnen.

### 4.5 Formulieren en leads (fase 1)

- Sollicitatie (met cv-upload), open sollicitatie, personeel aanvragen en
  contact.
- Opslag in Supabase volgens het datamodel in context/11, cv's in Storage
  (EU-regio), validatie met gedeelde zod-schema's (`lib/validation/*`).
- Bevestiging naar de aanvrager en melding naar Groos via e-mail (Resend en
  React Email volgens context/11).
- Botbescherming volgens context/11 (Vercel BotID) plus de bestaande honeypot.
- Bedankpagina's met `noindex`.
- Web3Forms vervalt zodra de formulieren naar Supabase gaan; gebruik het
  hooguit als tijdelijke oplossing vóór de backend er is.
- Klaar als: elk formulier een record in de database oplevert, beide e-mails
  aankomen, foutmeldingen vertaald zijn en het formulier met toetsenbord en
  schermlezer te gebruiken is.

### 4.6 Beheeromgeving `/beheer` (fase 1 minimaal, fase 2 uitgebreid)

- Volgens context/11 §4: inloggen (met MFA), dashboard, vacatures beheren
  (aanmaken, publiceren, vervuld, archiveren), sollicitaties en
  personeelsaanvragen bekijken en een status geven.
- Eigen root-layout, alleen Nederlands, `noindex`, buiten de taal-proxy
  (`beheer` toevoegen aan de uitsluiting in `proxy.ts`).
- Mobielvriendelijk: Jimmy en Lorenzo werken vanaf hun telefoon.
- Klaar als: Jimmy zonder hulp een vacature kan plaatsen en een sollicitatie
  kan afhandelen op zijn telefoon.

### 4.7 Backend en infrastructuur (fase 1)

- Supabase volgens context/11: Pro, EU-regio (Frankfurt), RLS op alle tabellen,
  schema en policies als SQL-migraties in `supabase/migrations/`, clients in
  `lib/supabase/{server,browser,admin}.ts` (`admin.ts` met
  `import "server-only"`).
- Integraties bij voorkeur via de Vercel Marketplace in Jimmy's
  Vercel-account, zodat de env vars automatisch in het project staan. Vraag
  Djulan vóór het aanmaken van betaalde abonnementen.
- Geplande taken (vacatures laten verlopen, cv's opschonen volgens de
  bewaartermijn) via Vercel Cron, beveiligd met `CRON_SECRET`.
- `.env.example` bijwerken met elke nieuwe variabele.

### 4.8 SEO en lokale vindbaarheid (fase 1, deels fase 2)

- `site.schemaType` op `"EmploymentAgency"` (schema.org-subtype van
  LocalBusiness) en echte NAW in `lib/site.ts`.
- Titels en metabeschrijvingen per pagina via `pageMetadata()`.
- Beroepspagina's per doelgroep met unieke inhoud (geen doorway-pagina's).
- Fase 2: `/uitzendbureau/[stad]` op basis van de stadspagina-module, alleen
  voor steden waar Groos echt werkt; vacaturefeeds voor portals
  (`app/feeds/[portal]`, context/11).

### 4.9 Juridisch en compliance (fase 1)

- Privacyverklaring uitbreiden voor sollicitanten: cv's, bewaartermijn,
  grondslag, verwerkers (Supabase, Resend, Vercel). Algemene voorwaarden van de
  klant. Zie context/09.
- Alleen claims die kloppen: toelating of registratie als uitzendbureau, cao,
  keurmerken, reactietijd.
- Geen cookiebanner nodig zolang er alleen functionele cookies en Vercel
  Analytics (cookieloos) zijn; komt er tracking bij, dan wel.

### 4.10 Livegang (fase 1)

Volgt docs/STAPPENPLAN.md: GitHub onder `jimmyv3-v3`, Vercel in Jimmy's
account, domein en DNS, Search Console, Google Bedrijfsprofiel.

## 5. Zo stel je de specs op

1. Maak `docs/specs/` met per module uit §4 één bestand,
   `docs/specs/<nn>-<module>.md`, in deze vorm:
   - **Doel**: één alinea.
   - **Gebruikers en scenario's**: werkgever, werkzoekende, beheerder.
   - **Scope**: wat wel en wat niet, fase 1 of 2.
   - **Pagina's en componenten**: welke JV-bouwsteen, wat nieuw is.
   - **Data**: tabellen en velden (verwijs naar context/11 §2), validatie.
   - **Tekstelementen**: verwijs naar context/08 §6.
   - **SEO**: metadata, JSON-LD, sitemap.
   - **Toegankelijkheid en performance**.
   - **Acceptatiecriteria**: toetsbaar, als lijst.
   - **Open vragen**.
2. Leg elke spec voor aan Djulan en verwerk de feedback vóór het bouwen.
3. Houd `docs/specs/00-overzicht.md` bij met de status per module.

## 6. Regels tijdens het bouwen

- Werkafspraken uit `CLAUDE.md` gelden altijd (tokens, schrijfregels,
  `pageMetadata()`, server components, geen nieuwe dependencies zonder reden).
- Niets één-op-één van Wilk of JV: geen tekst, geen beeld, geen huisstijl.
- Na elke module: `npm run verify` en een visuele controle op 390/768/1280/1440
  px (eerst door de pagina scrollen vanwege de reveal-animaties).
- Werk op een branch per module en open een pull request; Vercel maakt er een
  preview van. `main` is productie.
- Commitberichten in het Nederlands, kort en beschrijvend.

## 7. Open beslissingen

Leg deze vast in de specs; vraag ze zo nodig via Djulan aan Jimmy en Lorenzo.

1. Merkrichting (context/12: A "Signaal", B "Baksteen" of C "Kobalt").
2. Domeinnaam en e-mailadres (in de briefing staat
   `info@groospersoneeldiensten.nl`, zonder "s" in personeel; klopt dat?).
3. Tweetalig of alleen Nederlands; zo ja, vertaalde slugs of niet.
4. Je-vorm of u-vorm voor werkzoekenden.
5. Wie vacatures invoert en goedkeurt; welke gegevens per vacature verplicht zijn.
6. Bewaartermijn voor cv's en of kandidaten toestemming geven voor langer
   bewaren.
7. KvK-nummer, btw-nummer, exacte postcode, toelating of registratie als
   uitzendbureau, cao (ABU of NBBU), keurmerk.
8. Welke foto's er zijn (eigen beeld heeft de voorkeur boven stockfoto's).
9. Fase 2: jobalert, vacaturefeeds, stadspagina's, Engelse vacatures.
