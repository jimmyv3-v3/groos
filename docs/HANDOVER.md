# Handover voor de master-agent: definitieve specs Groos Personeelsdiensten

Opgesteld op 2 oktober 2026 door de sessie die de J. Versseput-repo heeft
geanalyseerd en deze repo heeft opgezet. Jij bent de master-agent die de
definitieve specs schrijft, met sub-agents waar dat sneller of beter is.
Bouwen hoort niet bij deze opdracht.

Lees daarna, in deze volgorde: `CLAUDE.md`, `docs/BOUWINSTRUCTIE.md` (§4 is de
backlog, §5 de spec-vorm, §7 de open beslissingen), `docs/MIGRATIE.md` en alle
bestanden in `context/`.

---

## 1. Opdracht

Lever in `docs/specs/` een complete, onderling consistente set specs waarmee
een bouw-agent de site van Groos zonder verdere vragen kan bouwen:

- één spec per module (§4 hieronder), in de vorm van BOUWINSTRUCTIE §5;
- `docs/specs/00-overzicht.md`: modules, fase, afhankelijkheden, status,
  beslissingslog en een traceerbaarheidstabel (eis → module → acceptatiecriterium);
- alle open beslissingen beantwoord door Djulan of expliciet als aanname
  gemarkeerd, met wie het moet bevestigen.

Klaar als Djulan elke spec heeft goedgekeurd en er geen tegenstrijdigheden meer
zijn tussen routes, datamodel, tekstsleutels, SEO en formulieren.

## 2. Stand van de repo

- Map: `/Users/djulangem/Developer/groos-personeelsdiensten` (eerder
  `jimmy-nieuw-bedrijf`; hernoemd door de context-sessie).
- Git: startcommit `ec3d7ac` op `main`. De map `context/` is bewust niet
  gecommit, omdat een andere sessie er nog in schreef. Vraag Djulan of de context
  af is en commit hem dan.
- Werkt: `npm run verify` (typecheck, lint, build met 29 statische pagina's).
  Visueel gecontroleerd op 1440 en 390 px. SEO-uitvoer gecontroleerd met de
  productieserver: canonical en hreflang op elke pagina, absolute `og:image`,
  OG/Twitter/icon-routes geven 200, JSON-LD (Organization, WebSite,
  LocalBusiness, Service, BreadcrumbList, FAQPage), sitemap met
  taalalternates, `llms.txt`, onbekende slug geeft 404, Googlebot krijgt
  geen geo-redirect.
- Bewust nog leeg: alle tekst (`TODO`), identiteit (grijs), Groos-routes,
  vacatures, Supabase, beheeromgeving, GitHub-remote, Vercel-project, domein.
  `npm run check` somt de placeholders op.
- Inhoud van de repo en de herkomst per bestand: MIGRATIE §2, §3 en §9.

## 3. Feiten die je nodig hebt

### Opdrachtgever en eerdere site

- Opdrachtgever Jimmy (ook eigenaar van J. Versseput Vastgoedonderhoud B.V.).
  Groos runt hij met Lorenzo. Bedrijfsgegevens: context/00.
- JV-repo: `/Users/djulangem/Developer/J.versseput B.V.` (Next 16, next-intl,
  Tailwind 3, shadcn). Bruikbaar als voorbeeld van toon, lengte en opbouw
  (bijvoorbeeld het `CONTENT`-blok in
  `app/[locale]/diensten/zonnepanelenreiniging/page.tsx`); geen tekst overnemen.
- JV live: https://www.jversseput.nl. Bekende problemen daar: MIGRATIE §10.

### Infrastructuur zoals bij JV (door Djulan bevestigd voor Groos)

- GitHub: repo's onder Jimmy's account `jimmyv3-v3` (JV: `jimmyv3-v3/website`,
  publiek; Groos wordt privé). De `gh`-CLI op deze laptop is ingelogd als
  `skuu-os`; voor Jimmy's account is toegang of collaboratorschap nodig.
- Vercel: project in Jimmy's eigen Vercel-account met de Git-integratie (push
  naar `main` = productie). De Vercel-CLI op deze laptop is ingelogd in het
  SKUU-team; daar staat een verouderd project `skuu/jversseput`. Specs mogen
  niet uitgaan van CLI-deploys vanuit SKUU.
- DNS bij JV: nameservers bij Vercel DNS (`ns1/ns2.vercel-dns.com`), e-mail
  bij Mijndomein (MX `mx1/mx2.mijndomein.nl`, SPF
  `include:spf.mijndomeinhosting.nl`), `www` als hoofddomein.
- Formulieren bij JV: Web3Forms (`NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`), geen
  eigen backend.
- Vercel-abonnement van Jimmy is onbekend. Hobby is niet toegestaan voor
  commerciële sites; context/11 rekent met Pro.

### Tooling in deze omgeving

- 21st.dev Magic MCP (`magic`, `@21st-dev/magic`) op gebruikersniveau:
  `search`, `get_inspiration`, `get_theme`, `get_component` (kost een
  retrieval per dag), `search_logo`, `search_picker`. Werkwijze: MIGRATIE §6.
- Playwright MCP voor visuele controle; screenshots alleen opslaan in de
  toegestane map (de `.playwright-mcp`-map van de werkmap van de sessie).
- Supabase MCP is gekoppeld aan het account van Djulan; controleer of
  projecten in Jimmy's organisatie moeten komen.
- Versies: Next 16.3.8, React 19.3, next-intl 4.14, Tailwind 3.4.19,
  lucide-react 0.456 (bewust niet hoger), `@base-ui-components/react`
  1.0.0-rc.0 (vast; de navigatie is op die API geschreven), ESLint 9,
  Node 24.

### Technische eigenschappen die specs moeten respecteren

- Taalrouting via `proxy.ts` (Next 16). Nieuwe niet-publieke paden
  (`/beheer`, `/feeds`, `/api`) moeten buiten de matcher vallen.
- Alle metadata via `pageMetadata()`, alle JSON-LD via builders in
  `lib/seo.ts`; `app/sitemap.ts` en `app/llms.txt` lezen registers.
- Drie tekstmechanismen (CLAUDE.md): messages voor UI en kaarttekst,
  `content/` voor lange paginatekst, `lib/site.ts` voor structurele data.
  messages nl/en moeten gespiegeld blijven (`npm run check`).
- Tokens: `app/globals.css` plus `--brand-subtle`, `--brand`, `--brand-strong`
  die alle componenten gebruiken; hex-waarden in `lib/brand.ts`.
- Schrijfregels voor sitetekst (CLAUDE.md): alleen h1/h2, geen eyebrows, geen
  streepjes in zinnen, geen fragmenten.

## 4. Modules voor de specs

Gebruik deze indeling en nummering, zodat specs en bouw dezelfde taal spreken.
De backlog per module staat in BOUWINSTRUCTIE §4.

| Nr | Spec | Fase | Hangt af van | Belangrijkste bronnen |
|---|---|---|---|---|
| 00 | Overzicht, beslissingslog, traceerbaarheid | 1 | alles | deze handover |
| 01 | Informatiearchitectuur, routes, navigatie, i18n | 1 | 05 | context/08 §7, MIGRATIE §7 |
| 02 | Designsysteem en merk | 1 | — | context/12, MIGRATIE §6 |
| 03 | Contentstrategie, tone of voice, tekstsleutels | 1 | 01 | context/00, /01, /08 §5–6 |
| 04 | Homepage | 1 | 01, 02, 03 | MIGRATIE §5.1 |
| 05 | Beroepspagina's werkgevers en werkzoekenden | 1 | 01, 03 | context/01, MIGRATIE §5.2 |
| 06 | Vacaturebank publiek (overzicht, detail, filters) | 1 | 10 | context/11 §2–3, context/04 |
| 07 | Formulieren en leads (solliciteren, open sollicitatie, personeel aanvragen, contact) | 1 | 10, 11 | context/11, context/09 |
| 08 | Beheeromgeving `/beheer` | 1 minimaal | 10 | context/11 §4 |
| 09 | Juridisch, privacy en compliance | 1 | 07 | context/09 |
| 10 | Backend: datamodel, RLS, storage, migraties | 1 | — | context/11 §1–2 |
| 11 | E-mail en notificaties | 1 | 10 | context/11 |
| 12 | SEO, structured data (JobPosting, EmploymentAgency), lokale vindbaarheid | 1 en 2 | 01, 06 | MIGRATIE §3, context/08 |
| 13 | Infrastructuur, deployment, domein, DNS, e-mailrecords | 1 | — | STAPPENPLAN E en K |
| 14 | Kwaliteit, toegankelijkheid, performance, acceptatietests | 1 | alles | CLAUDE.md |
| 15 | Fase 2: jobalert, feeds, stadspagina's, Engelse vacatures | 2 | 06, 12 | context/08, /11 |

## 5. Werkwijze (orkestratie)

1. **Inlezen.** Laat per groot contextbestand een sub-agent een samenvatting van
   maximaal één pagina maken met feiten, besluiten, aannames en open vragen.
   Lees de korte bestanden zelf.
2. **Beslissingen ophalen.** Leg de open beslissingen (BOUWINSTRUCTIE §7, plus
   wat de samenvattingen opleveren) in één keer aan Djulan voor, met per vraag
   een aanbeveling. Noteer antwoorden in de beslissingslog van spec 00.
3. **Specs schrijven.** Eén sub-agent per module of per cluster van verwante
   modules (bijvoorbeeld 06+07+10+11). Geef elke sub-agent mee: deze handover,
   CLAUDE.md, BOUWINSTRUCTIE §5, de beslissingslog en de relevante bronnen uit
   de tabel in §4.
4. **Kruiscontrole.** Laat een aparte sub-agent alle specs naast elkaar leggen op
   routes, tabellen en velden, statusflows, tekstsleutels, JSON-LD, sitemap,
   env vars en acceptatiecriteria. Los tegenstrijdigheden op.
5. **Consolideren.** Werk spec 00 bij (status, afhankelijkheden,
   traceerbaarheid) en leg het geheel ter goedkeuring voor.

## 6. Wat besloten is en wat alleen voorgesteld

| Onderwerp | Status |
|---|---|
| JV-structuur hergebruiken, nieuwe identiteit en tekst | besloten (Djulan) |
| GitHub onder `jimmyv3-v3`, Vercel in Jimmy's account | besloten (Djulan) |
| Niets één-op-één van Wilk overnemen | besloten (team, context/00) |
| Vacaturebank met kleine backend, voorkeur Supabase | wens van de klant (context/00) |
| Supabase Pro in de EU, eigen `/beheer`, Resend, BotID, Vercel Cron | voorgesteld (context/11) |
| Merkrichting A "Signaal" | voorgesteld (context/12), klant kiest |
| Tweetalig NL/EN | technisch klaar, inhoudelijk open |
| Live vóór of na de vacaturebank | open (STAPPENPLAN D) |

## 7. Risico's en aandachtspunten

- **Gelijktijdige sessies.** Eerder heeft een andere sessie deze map hernoemd
  terwijl er nog in werd geschreven. Controleer het pad voordat je schrijft en
  wijzig niets in `context/` zonder overleg.
- **Toegang.** Zonder Jimmy's GitHub- en Vercel-toegang loopt fase E vast;
  vraag dit vroeg.
- **E-maildomein.** Het domein is `groospersoneelsdiensten.nl`, met "s" na
  "personeel" (besluit B-02). In de briefing stond het zonder die "s"; gebruik
  die spelling nergens voor DNS, e-mail of Resend.
- **Compliance.** Uitzendbureaus vallen onder registratie- of toelatingsregels;
  claims over cao en keurmerk alleen als ze kloppen (context/09).
- **Privacy.** Cv's zijn persoonsgegevens: EU-opslag, bewaartermijn, grondslag,
  verwerkersovereenkomsten, en de privacyverklaring moet dat dekken.
- **Google for Jobs.** JobPosting vraagt verplichte velden en nette afhandeling
  van verlopen vacatures; anders worden ze genegeerd of afgestraft.
- **Kosten.** Vercel Pro en Supabase Pro zijn nodig voor productie; Jimmy moet
  akkoord geven (STAPPENPLAN B).
- **SEO-lessen uit JV** (MIGRATIE §3 en §10) mogen niet terugkomen in nieuwe
  routes: elke pagina via `pageMetadata()`, metadata-routes buiten de proxy,
  geen geo-redirect voor crawlers.
