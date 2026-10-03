# Groos Personeelsdiensten — website

Website van Groos Personeelsdiensten B.V. (uitzendbureau, Den Haag). Gebouwd
op de structuur van de J. Versseput-site, met een nieuwe identiteit.

- Werkafspraken voor AI-agents: [CLAUDE.md](CLAUDE.md)
- Wat er gebouwd moet worden: [docs/BOUWINSTRUCTIE.md](docs/BOUWINSTRUCTIE.md)
- Takenlijst tot livegang: [docs/STAPPENPLAN.md](docs/STAPPENPLAN.md)
- Herkomst en blauwdruk: [docs/MIGRATIE.md](docs/MIGRATIE.md)
- Bedrijfscontext: [context/](context/)

## Lokaal draaien

```bash
npm install
cp .env.example .env.local   # Supabase-sleutels van groos-dev invullen
npm run dev                  # http://localhost:3000
npm run verify               # typecheck + lint + build
npm run check                # livegang-check (placeholders, vertalingen)
```

Node 24 (zie `engines` in package.json).

## Structuur

```
app/[locale]/          Publieke pagina's (NL op de root, EN onder /en), layout, 404 en foutgrens
app/beheer/            Beheeromgeving (spec 08, eigen root-layout, alleen NL)
app/api/               Cron-routes en uploadroute (buiten de taalproxy)
app/                   sitemap, robots, llms.txt, OG-afbeelding, iconen, global-error/-not-found
components/sections/   Header, footer, actiebalk, kruimelpad en paginasecties
components/service/    Bouwstenen van beroepspagina's
components/ui/         Primitives en de merk-CTA
components/forms/      Formulieren (spec 07)
content/beroepen/      Beroepenregister (index.ts) en lange tekst per beroep (NL + EN)
content/pages/         Lange tekst van vaste pagina's (NL + EN)
lib/site.ts            Bedrijfsgegevens, personen, navigatie, footer
lib/routes.ts          Vaste paden, padhelpers, doelgroep per pad, sitemap-indeling
lib/                   SEO-helpers, datalaag, Supabase-clients, merkwaarden
messages/<taal>/       UI-tekst per taal, één JSON-bestand per namespace
proxy.ts               Taalrouting en sessieverversing voor /beheer
supabase/              Migraties, seed en configuratie
context/               Bedrijfscontext en research
docs/                  Instructies, stappenplan, specs
scripts/               Livegang-check en hulpscripts
```
