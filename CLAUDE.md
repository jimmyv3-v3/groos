# CLAUDE.md — werkafspraken voor de website van Groos Personeelsdiensten

## Start hier

1. **[docs/BOUWINSTRUCTIE.md](docs/BOUWINSTRUCTIE.md)**: wat er gebouwd moet
   worden, in welke volgorde en hoe je de specs opstelt. Lees dit eerst.
2. **[context/](context/)**: bedrijfscontext van Groos (beroepen, doelgroepen,
   sitemap-voorstel, backend-strategie, branding-richting, juridisch).
3. **[docs/MIGRATIE.md](docs/MIGRATIE.md)**: wat uit de J. Versseput-site is
   overgenomen, de blauwdruk van alle pagina's en hoe de nieuwe identiteit wordt
   aangebracht.
4. **[docs/STAPPENPLAN.md](docs/STAPPENPLAN.md)**: de takenlijst van A tot Z
   tot livegang.

## Wat deze repo is (en niet is)

- Het IS: een werkende Next.js-basis die is afgeleid van de J. Versseput-site
  (zelfde opdrachtgever, Jimmy). Structuur, secties, i18n, SEO, formulieren en
  deployment-aanpak zijn overgenomen en verbeterd. Alle bedrijfstekst staat op
  `TODO`.
- Het is NIET: een kopie van J. Versseput of van de referentiesite Wilk. Geen
  JV-kleuren, -logo, -copy of -foto's, en niets één-op-één van Wilk. De
  visuele identiteit van Groos wordt nieuw gekozen (zie context/12).
- De J. Versseput-repo staat lokaal op
  `/Users/djulangem/Developer/J.versseput B.V.` en mag gelezen worden als
  voorbeeld van toon, lengte en opbouw. Neem er geen tekst uit over.

## Stack en commando's

- Next.js 16.3 App Router (Turbopack), React 19, TypeScript strict,
  Tailwind CSS 3.4, shadcn/ui (`components.json`), next-intl 4, framer-motion,
  lucide-react (vast op 0.456: nieuwere versies missen de social-iconen),
  @vercel/analytics.
- `npm run dev` (localhost:3000) · `npm run build` · `npm run lint` (ESLint-CLI;
  `next lint` bestaat niet meer in Next 16) · `npm run typecheck` ·
  `npm run check` (livegang-check: placeholders, NL/EN-sleutels, registraties) ·
  `npm run verify` (typecheck + lint + build).
- Primitives toevoegen: `npx shadcn@latest add <component>` → `components/ui/`.
- `proxy.ts` is de Next 16-opvolger van `middleware.ts` (taalrouting).

## Waar dingen staan

| Wat                                             | Waar                                    |
| ----------------------------------------------- | --------------------------------------- |
| Route / pagina                                   | `app/[locale]/<route>/page.tsx`          |
| Paginasectie (hero, raster, FAQ…)                | `components/sections/`                   |
| Bouwstenen van detailpagina's                    | `components/service/`                    |
| Primitive (knop, input…)                         | `components/ui/`                         |
| Merk-CTA (alle offerte- en belknoppen)           | `components/ui/cta-button.tsx`           |
| Logo (tijdelijk)                                 | `components/brand/`                      |
| Bedrijfsgegevens, navigatie, iconen, cijfers     | `lib/site.ts`                            |
| Merk-hexwaarden (OG, favicon, themakleur)        | `lib/brand.ts`                           |
| SEO-helpers en JSON-LD-builders                  | `lib/seo.ts`, `components/seo/json-ld.tsx` |
| Korte UI-tekst en kaarttekst (NL/EN)             | `messages/nl.json`, `messages/en.json`   |
| Lange paginatekst per dienst/stad (NL/EN)        | `content/services/`, `content/werkgebied/` |
| Design tokens (kleur, radius, fonts)             | `app/globals.css`                        |
| Afbeeldingen, logo-bestanden                     | `public/`                                |
| Bedrijfscontext en research                      | `context/`                               |
| Documentatie, specs                              | `docs/`                                  |

- Importalias `@/*` → repo-root. Gebruik `cn()` uit `@/lib/utils`.
- Interne links altijd via `Link` uit `@/i18n/navigation`, nooit `next/link`.

## Design tokens: de enige plek om te thema's

Kleur en radius zijn CSS-variabelen in `app/globals.css` (`:root` + `.dark`),
gekoppeld in `tailwind.config.ts`. Componenten gebruiken alleen semantische
klassen (`bg-background`, `text-foreground`, `bg-primary`,
`text-muted-foreground`, `border-border`, `text-brand`, `text-brand-strong`,
`text-brand-subtle`) en de signature-klassen `.accent-text`, `.glass-panel`,
`.logo-mono`, `.bg-grid`, `.spotlight`. Nooit hex- of hsl-waarden in
componenten. Fonts via `next/font` in `app/[locale]/layout.tsx`
(`--font-sans`, `--font-display`). Houd `lib/brand.ts` gelijk aan de tokens.

## Tekst en vertaling: drie mechanismen

1. **UI- en kaarttekst** → `messages/<locale>.json` met gespiegelde sleutels
   (`npm run check` bewaakt dat). Lezen met `useTranslations`/`getTranslations`.
   Accentwoorden in koppen: `t.rich("key", { accent: (c) => <span className="accent-text">…</span> })`.
2. **Lange paginatekst** → één bestand per dienst of stad in `content/` met een
   `nl`- en `en`-blok. Alleen server-side importeren (houdt de client-bundle klein).
3. **Structurele data** (iconen, cijfers, afbeeldingen) → `lib/site.ts`, op index
   gekoppeld aan de tekst in messages. Arrays in nl en en houden dezelfde lengte.

Juridische pagina's houden hun tekst in de page zelf (`CONTENT = { nl, en }`).

## SEO-afspraken

- Elke `generateMetadata` gebruikt `pageMetadata()` uit `lib/seo.ts`
  (canonical, hreflang, OG en Twitter mét afbeelding). Nooit losse
  `openGraph`-objecten: die vervangen die van de layout volledig.
- Structured data via `<JsonLd data={…} />` en de builders in `lib/seo.ts`.
- `app/sitemap.ts` en `app/llms.txt/route.ts` worden afgeleid uit de registers;
  nieuwe routes die niet uit een register komen voeg je daar toe.
- `proxy.ts` sluit API-routes, bestanden en metadata-routes uit. Nieuwe
  niet-publieke paden (zoals `/beheer`, `/feeds`) moeten ook in de
  uitsluiting. Crawlers krijgen nooit een geo-redirect.

## Hoe je hier een goede pagina bouwt

1. **Content eerst.** Echte tekst en structuur vóór styling.
2. **Secties stapelen.** Een pagina is een stapel `components/sections/*`;
   secties zijn zelfstandig en presentational, data via props of registers.
3. **Primitives hergebruiken.** Eerst `components/ui/*`, dan pas zelf bouwen.
4. **Semantisch en toegankelijk.** Echte landmarks, één `h1` per pagina,
   alt-teksten, gelabelde velden, zichtbare focus.
5. **Responsive.** Mobile-first; controleer op 390, 768, 1280 en 1440 px.
6. **Beweging met mate.** framer-motion via `components/motion/*`; respecteer
   `prefers-reduced-motion`; content nooit blokkeren op animatie.
7. **Performance.** `next/image` voor nieuwe beelden, `next/font`, server
   components standaard; `"use client"` alleen bij interactie.
8. **SEO.** Zie hierboven.

## Schrijfregels voor sitetekst

- **Alleen koppen**: `h1` (titel) en `h2` (sectie). Geen eyebrows, kickers of
  labels boven koppen.
- **Geen streepjes in zinnen.** Geen `-`, `–` of `—` om zinsdelen te verbinden
  of te breken. Schrijf een volledige, lopende zin.
- **Geen hakkelige fragmenten.** Volledige, natuurlijke zinnen.
- Nederlands, professioneel, u-vorm richting opdrachtgevers. Voor
  werkzoekenden besluit de copy-spec of het je-vorm wordt (zie context).
- Claims alleen als ze kloppen (keurmerk, cao, reactietijd, cijfers).

## 21st.dev (Magic MCP)

Beschikbaar als MCP-server `magic`. Gebruik `search` (type theme/component) en
`get_inspiration` voor ideeën, `get_theme` voor tokens, `get_component` voor
code (kost een retrieval per dag) en `search_logo` voor merklogo's. Regels:
pas elke component aan aan de tokens hierboven (geen eigen kleuren), houd de
props en sectie-ID's van de bestaande component gelijk, behoud i18n via
messages, en controleer server/client-grenzen. Zie docs/MIGRATIE.md §6.

## Verifiëren vóór je klaar bent

- `npm run verify` moet slagen.
- Visueel met Playwright op 390/768/1280/1440 px. Scroll de pagina eerst door,
  anders staan secties met reveal-animaties nog op onzichtbaar.
- Bij livegang: `npm run check` zonder punten.

## Deployment

- GitHub: repo onder het account van Jimmy (`jimmyv3-v3`), net als
  `jimmyv3-v3/website` van J. Versseput.
- Vercel: project in Jimmy's Vercel-account met de Git-integratie. Push naar
  `main` = productie, pull request = preview. Niet `vercel link` draaien vanuit
  het SKUU-account; dat maakt een project in het verkeerde team (zo staat er
  nog een verouderd `skuu/jversseput`).
- Env vars: zie `.env.example`; altijd ook in Vercel zetten.

## Conventies

- TypeScript strict, props typeren, geen `any`.
- Server components standaard; `"use client"` alleen waar nodig.
- Houd componenten gefocust; splits een pagina op zodra hij lang wordt.
- Volg de stijl van de bestaande bestanden; draai `npm run verify`.
- Geen dependencies voor triviale dingen.

## Bij twijfel

Vraag naar merk- en contentrichting in plaats van stil een permanente keuze te
maken. Placeholders zijn prima; markeer ze met `TODO`.
