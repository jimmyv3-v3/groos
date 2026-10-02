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
cp .env.example .env.local   # Web3Forms-key invullen
npm run dev                  # http://localhost:3000
npm run verify               # typecheck + lint + build
npm run check                # livegang-check (placeholders, vertalingen)
```

Node 24 (zie `engines` in package.json).

## Structuur

```
app/[locale]/          Pagina's (NL op de root, EN onder /en)
app/                   sitemap, robots, llms.txt, OG-afbeelding, iconen
components/sections/   Paginasecties (header, hero, footer, formulier…)
components/service/    Bouwstenen van detailpagina's
components/ui/         Primitives en de merk-CTA
content/               Lange paginatekst per dienst en stad (NL + EN)
lib/                   Bedrijfsconfig, merkwaarden, SEO-helpers
messages/              UI-tekst per taal
proxy.ts               Taalrouting (Next 16-opvolger van middleware.ts)
context/               Bedrijfscontext en research
docs/                  Instructies, stappenplan, specs
scripts/               Livegang-check
```
