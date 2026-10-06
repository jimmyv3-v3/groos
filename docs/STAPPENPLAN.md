# Stappenplan: Groos Personeelsdiensten van repo tot livegang

Takenlijst voor Djulan, van A tot Z. Vink af in VS Code. Per taak staat wie
hem doet: **jij**, **Jimmy/Lorenzo** of **Claude** (een chat in deze repo).

**Realistisch voor morgen:** fase A tot en met G, zodat specs, infrastructuur,
huisstijl en de marketingpagina's met echte tekst op een preview-URL staan.
De vacaturebank met beheeromgeving (fase H) kost naar verwachting nog twee tot
drie dagen. Livegang (fase K) volgt als fase H af is, of eerder met een
tijdelijke oplossing (zie de beslissing in fase D).

**Kritieke paden die je 's ochtends start:** domein en DNS (wachttijd),
toegang tot Jimmy's GitHub en Vercel, en de vragen aan Jimmy en Lorenzo.

---

## A. Opstarten (15 min) · jij

- [ ] Map openen in VS Code: `~/Developer/groos-personeelsdiensten`.
- [ ] `npm install`
- [ ] `cp .env.example .env.local`
- [ ] `npm run verify` slaagt (typecheck, lint, build).
- [ ] `npm run dev` en kijk op http://localhost:3000; alles is grijs met `TODO`.
- [ ] `git log` toont de startcommit. Werk vanaf nu op branches.

## B. Input van Jimmy en Lorenzo (30 min, bellen of WhatsApp) · jij + Jimmy/Lorenzo

Stuur 's ochtends één bericht met deze vragen, zodat de antwoorden binnen zijn
voordat je ze nodig hebt:

- [ ] KvK-nummer, btw-nummer, exacte postcode van Hugo Coenraadspad 6.
- [ ] Domein: `groospersoneelsdiensten.nl`, met "s" na "personeel",
      geregistreerd bij STRATO (besluit B-02). Bestaat de mailbox
      `info@groospersoneelsdiensten.nl` al?
- [ ] E-mail: welke provider (Mijndomein, Google Workspace, Microsoft 365)?
- [ ] Toelating of registratie als uitzendbureau, cao (ABU of NBBU), keurmerk.
- [ ] Merkrichting kiezen uit context/12 (A "Signaal", B "Baksteen",
      C "Kobalt"); stuur de samenvatting mee.
- [ ] Foto's: van het team, de bus, het werk. Logo-wensen.
- [ ] Eerste vacatures (titel, plaats, uren, salaris, eisen).
- [ ] Wie plaatst straks vacatures en handelt sollicitaties af.
- [ ] Toegang: inloggegevens of uitnodiging voor Jimmy's GitHub (`jimmyv3-v3`)
      en Vercel-account.
- [ ] Akkoord op maandkosten (context/11: ±45 tot 65 dollar, Vercel Pro,
      Supabase Pro, Resend).

## C. Context afronden (30 min) · jij

- [ ] Lees `context/README.md` en loop de genummerde bestanden na.
- [ ] Werk de lijsten "Te verifiëren" bij met de antwoorden uit fase B.
- [ ] Zet ruwe input (WhatsApp-export, foto's, notities) in `context/_input/`.

## D. Specs opstellen (60 tot 90 min) · jij + Claude

- [ ] Start een nieuwe Claude-chat in deze repo met deze prompt:

  > Lees CLAUDE.md, docs/BOUWINSTRUCTIE.md en de bestanden in context/. Stel
  > daarna volgens §5 van de bouwinstructie de specs op in docs/specs/, één
  > per module, en begin met 00-overzicht.md. Leg de open beslissingen uit §7
  > eerst aan mij voor. Nog niets bouwen.

- [ ] Beslis samen: tweetalig of niet, je-vorm of u-vorm voor werkzoekenden,
      vertaalde slugs, en of de site live gaat vóór de vacaturebank klaar is
      (dan tijdelijk: vacatures als content in de repo en formulieren via
      Web3Forms).
- [ ] Specs goedkeuren.

## E. Accounts en infrastructuur (45 min, parallel aan D) · jij

GitHub, onder Jimmy's account zoals bij J. Versseput:

- [ ] Maak in GitHub (ingelogd als Jimmy) een **private** repo
      `groos-personeelsdiensten`, zonder README. `gh` op deze laptop is
      ingelogd als `skuu-os`; laat Jimmy die als collaborator toevoegen of log
      in met zijn account.
- [ ] `git remote add origin https://github.com/jimmyv3-v3/groos-personeelsdiensten.git`
- [ ] `git push -u origin main`

Vercel, in Jimmy's account (níet het SKUU-team):

- [ ] Add New → Project → importeer de GitHub-repo. Framework: Next.js.
- [ ] Node-versie 24 (staat in package.json; controleer in Settings).
- [ ] Env var `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` voor Production en Preview.
- [ ] Deploy en open de `*.vercel.app`-URL.
- [ ] Settings → Analytics aanzetten.
- [ ] Controleer het abonnement: Hobby is alleen voor niet-commercieel
      gebruik. Een bedrijfssite hoort op Pro.
- [ ] Niet `vercel link` draaien vanuit deze map zolang de CLI als SKUU is
      ingelogd.

Supabase (zodra de specs dat bevestigen, context/11):

- [ ] Via Vercel Marketplace → Supabase in Jimmy's project, regio EU
      (Frankfurt), Pro. De env vars komen dan vanzelf in Vercel.
- [ ] `vercel env pull .env.local` (ingelogd als Jimmy) of de waarden
      handmatig in `.env.local`.

Domein en e-mail:

- [ ] Domein registreren als dat nog niet is gebeurd.
- [ ] **Eerst alle bestaande DNS-records noteren** (vooral MX, SPF, DKIM)
      voordat je iets omzet.
- [ ] Kies de aanpak. Zoals bij J. Versseput: nameservers naar Vercel DNS
      (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`) en de MX- en SPF-records van
      de mailprovider in Vercel DNS opnieuw aanmaken. Of: alleen de A- en
      CNAME-records die Vercel toont bij de registrar zetten.
- [ ] In Vercel: domein toevoegen met en zonder `www`; `www` als hoofdadres
      (zoals JV) en het kale domein doorsturen.

## F. Huisstijl (60 tot 90 min) · jij + Claude

- [ ] Richting gekozen in fase B. Logo: schets met Claude of laat een
      ontwerper het maken; het beeldmerk moet ook één-kleurig werken (hesje, bus).
- [ ] Prompt voor Claude:

  > Pas de gekozen merkrichting uit context/12 toe volgens docs/MIGRATIE.md §6:
  > tokens in app/globals.css inclusief de drie --brand-tokens, lib/brand.ts,
  > lettertypes, signature-klassen, cta-button en logo-componenten. Gebruik de
  > 21st.dev-MCP voor thema- en componentinspiratie. Controleer daarna met
  > Playwright op 390, 768, 1280 en 1440 px.

- [ ] Logo-bestanden in `public/brand/` (`logo.png` minimaal 512×512 voor de
      JSON-LD); `app/icon.png` en `app/apple-icon.png` toevoegen en de
      `.tsx`-varianten verwijderen.

## G. Structuur en tekst (2 tot 3 uur) · Claude, jij leest mee

- [ ] Routes volgens de goedgekeurde sitemap-spec (context/08 §7 en
      docs/MIGRATIE.md §7): werkgevers, werkzoekenden, beroepen per doelgroep,
      over ons, contact.
- [ ] `lib/site.ts` vullen met de geverifieerde gegevens; `schemaType` wordt
      `"EmploymentAgency"`.
- [ ] Tekst schrijven. Laat Claude per beroep een aparte agent inzetten, zodat
      de beroepspagina's parallel ontstaan:

  > Schrijf de Nederlandse tekst voor alle TODO's in messages/nl.json,
  > lib/site.ts en content/, op basis van context/ en de schrijfregels in
  > CLAUDE.md. Zet één agent per beroep in voor de beroepspagina's. Draai
  > daarna npm run check en npm run verify.

- [ ] Lees alle tekst zelf na: klopt elke claim?
- [ ] Engelse versie (als besloten), daarna `npm run check`.
- [ ] Push de branch en bekijk de preview-URL op je telefoon.

## H. Vacaturebank en formulieren (twee tot drie dagen) · Claude, jij test

Volgens docs/BOUWINSTRUCTIE.md §4.4 tot en met §4.7 en de specs:

- [ ] Supabase-schema, RLS en storage als migraties.
- [ ] `/vacatures` en `/vacatures/[slug]` met JobPosting-JSON-LD.
- [ ] Formulieren (solliciteren met cv, open sollicitatie, personeel
      aanvragen, contact) naar Supabase, e-mails via Resend, BotID.
- [ ] `/beheer` minimaal: inloggen met MFA, vacatures beheren, sollicitaties
      en aanvragen afhandelen.
- [ ] Test als werkzoekende, als werkgever en als beheerder, ook op de telefoon.

## I. Beeld (30 min) · jij

- [ ] Foto's verkleinen en omzetten naar WebP of AVIF, in `public/`.
- [ ] Alt-teksten in messages; alleen klantlogo's met toestemming.

## J. Kwaliteit en SEO (45 min) · jij + Claude

- [ ] `npm run verify` en `npm run check` zonder punten.
- [ ] Lighthouse mobiel op home, een vacature en een beroepspagina
      (Performance, Accessibility, SEO ≥ 90).
- [ ] Google Rich Results Test: JobPosting, FAQPage, Breadcrumb,
      EmploymentAgency.
- [ ] OG-preview controleren (bijvoorbeeld opengraph.xyz en de LinkedIn Post
      Inspector) met de preview-URL.
- [ ] `/sitemap.xml`, `/robots.txt`, `/llms.txt` openen en nalopen.
- [ ] Alle formulieren één keer echt versturen; e-mails komen aan, niet in spam.
- [ ] Toetsenbordnavigatie en schermlezer kort testen.

## K. Livegang (30 min plus DNS-wachttijd) · jij

- [ ] `site.url` in `lib/site.ts` op het echte domein; mergen naar `main`.
- [ ] DNS omzetten volgens fase E; wachten tot Vercel het domein als geldig
      toont en het certificaat er is.
- [ ] Testen op het echte domein: home, vacatures, formulieren, `/en`.
- [ ] Controleer dat de e-mail van het domein nog werkt.

## L. Na livegang (30 min) · jij

- [ ] Google Search Console: domeineigendom via een TXT-record in Vercel DNS,
      sitemap indienen.
- [ ] Bing Webmaster Tools: importeren vanuit Search Console.
- [ ] Google Bedrijfsprofiel voor Groos met exact dezelfde naam, adres en
      telefoon als op de site.
- [ ] Na een paar dagen: Search Console → Pagina's en Vacatures (Google for
      Jobs) controleren.
- [ ] Vercel Analytics na een week bekijken.

## M. Overdracht (30 min) · jij + Jimmy/Lorenzo

- [ ] Beheeromgeving uitleggen op hun telefoon: vacature plaatsen, sollicitatie
      afhandelen.
- [ ] Afspreken wie de site beheert en wie de accounts (GitHub, Vercel,
      Supabase, Resend, domein) bezit.

## N. Eenmalig: J. Versseput herstellen (30 min, wanneer het uitkomt) · Claude

Gevonden tijdens de analyse; details in docs/MIGRATIE.md §10. Prompt voor een
chat in de JV-repo:

> Neem uit ~/Developer/groos-personeelsdiensten de oplossingen over voor: de
> proxy-matcher (OG-afbeelding en iconen), og:image en hreflang op elke pagina
> via een pageMetadata-helper, geen geo-redirect voor crawlers, de ontbrekende
> afbeeldingen gallery-2.jpg en og.jpg, ESLint via de CLI en de vertaalde
> dienstnamen in footer en menu. Hernoem middleware.ts naar proxy.ts.

- [ ] Daarna: in Search Console van jversseput.nl controleren of de
      Nederlandse pagina's geïndexeerd zijn.
- [ ] Repo `jimmyv3-v3/website` op private zetten.
- [ ] Verouderde `.vercel`-koppeling naar `skuu/jversseput` verwijderen en dat
      project archiveren.
