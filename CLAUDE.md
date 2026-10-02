# CLAUDE.md — werkafspraken voor de website van Groos Personeelsdiensten

## Start hier

0. **Schrijf je de definitieve specs (master-agent)?** Begin met
   **[docs/HANDOVER.md](docs/HANDOVER.md)**: stand van zaken, feiten,
   modulelijst en werkwijze.
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
  Tailwind CSS 4 (`@tailwindcss/postcss`, tokens via `@theme inline`), shadcn/ui
  (`components.json`, stijl new-york), next-intl 4, framer-motion (tot stap 4),
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
| Vaste paden, padhelpers, doelgroep per pad       | `lib/routes.ts`                          |
| Beroepenregister (id's, slugs, iconen, volgorde) | `content/beroepen/index.ts`              |
| Header, footer, actiebalk, kruimelpad            | `components/sections/` (+ `header/*`)    |
| Paginasectie (hero, raster, FAQ…)                | `components/sections/`                   |
| Bouwstenen van beroepspagina's                   | `components/service/`, `components/beroep/` |
| Formulieren                                      | `components/forms/`, `app/actions/`      |
| Primitive (knop, input…)                         | `components/ui/`                         |
| Merk-CTA (alle aanvraag- en belknoppen)          | `components/ui/cta-button.tsx`           |
| Logo (`Logo`, `LogoMark`, paden in JSON)         | `components/brand/`                      |
| Bedrijfsgegevens, personen, navigatie, footer    | `lib/site.ts`                            |
| Opgelost navigatiemodel (server)                 | `lib/navigation.ts`                      |
| Merk-hexwaarden (OG, favicon, themakleur)        | `lib/brand.ts`                           |
| SEO-helpers en JSON-LD-builders                  | `lib/seo.ts`, `components/seo/json-ld.tsx` |
| Korte UI-tekst en kaarttekst (NL/EN)             | `messages/<taal>/<namespace>.json`       |
| Lange paginatekst per beroep of vaste pagina     | `content/beroepen/<id>.ts`, `content/pages/` |
| Datalaag, Supabase                               | `lib/data/`, `lib/supabase/`, `supabase/` |
| Beheeromgeving                                   | `app/beheer/` (eigen root-layout)        |
| Design tokens (kleur, radius, fonts)             | `app/globals.css`                        |
| Afbeeldingen, logo-bestanden                     | `public/`                                |
| Bedrijfscontext en research                      | `context/`                               |
| Documentatie, specs                              | `docs/`                                  |

- Importalias `@/*` → repo-root. Gebruik `cn()` uit `@/lib/utils`.
- Interne links altijd via `Link` uit `@/i18n/navigation`, nooit `next/link`.

## Design tokens: de enige plek om te thema's

Kleur, radius, typografie, schaduw en beweging zijn tokens in `app/globals.css`
(hexwaarden in `:root`, gekoppeld via `@theme inline`; spec 02). Er is geen
`tailwind.config.ts` en geen `.dark`-thema; het standaardpalet van Tailwind
staat uit, dus alleen tokenklassen werken (`bg-background`, `text-foreground`,
`bg-primary`, `text-muted-foreground`, `border-border`, `bg-brand-tint`,
`text-brand`, `text-brand-strong`, `bg-ice`, `text-h2`, `text-lead`, ...).
Signature-klassen: `.accent-text`, `.surface-brand`, `.pattern-oo`,
`.prose-groos`. Nooit hex- of hsl-waarden in componenten. Fonts via
`next/font` in `lib/fonts.ts` (Onest `--font-onest`, Instrument Sans
`--font-instrument`), op `<html>` gezet in `app/[locale]/layout.tsx`. Houd
`lib/brand.ts` gelijk aan de tokens; `node scripts/check-contrast.mjs`
controleert contrast en gelijkheid. Primitives en knoppen: `components/ui/*`
en `CtaButton`/`ctaButtonVariants`; overzicht op `/stijlgids` (alleen dev).

## Tekst en vertaling

1. **UI- en kaarttekst** → `messages/<taal>/<namespace>.json`, één bestand per
   namespace per taal (`common`, `meta`, `header`, `footer`, `notFound`,
   `error`, `home`, `about`, `werkzoekenden`, `werkgevers`, `beroepen`,
   `vacatures`, `forms`, `contact`, `bedankt`, `legal`). Elke spec werkt alleen
   in zijn eigen namespaces (eigenaarschap in `docs/specs/00-overzicht.md`
   §4.4a), zodat specs parallel kunnen werken. `messages/<taal>/index.ts` voegt
   de bestanden samen met statische imports; `i18n/request.ts` laadt de juiste
   taal. Een nieuwe namespace: JSON in `nl/` én `en/` plus een import in beide
   `index.ts`-bestanden. `global.d.ts` typt de sleutels naar `messages/nl`, dus
   `tsc` faalt bij een ontbrekende sleutel; `npm run check` bewaakt dat nl en
   en dezelfde bestanden, sleutels en arraylengtes hebben. Lezen met
   `getTranslations` (server) of `useTranslations` (client). Clientcomponenten
   krijgen alleen de namespaces uit `CLIENT_NAMESPACES` in
   `i18n/client-messages.ts`; geef tekst bij voorkeur als props door.
   Accentwoorden in koppen: `t.rich("key", { accent: (c) => <span className="accent-text">…</span> })`.
2. **Lange paginatekst** → `content/beroepen/<id>.ts` en `content/pages/*.ts`
   met een `nl`- en `en`-blok. Alleen server-side importeren.
3. **Structurele data** (NAW, personen, navigatie, iconen) → `lib/site.ts`,
   paden → `lib/routes.ts`, beroepen → `content/beroepen/index.ts`. Geen tekst
   in deze registers; labels komen uit messages.
4. **Beheerteksten** → `app/beheer/_strings.ts` (alleen Nederlands, buiten de
   spiegelcontrole).

Juridische pagina's houden hun tekst in de page zelf (`CONTENT = { nl, en }`),
net als de inline teksten van `app/global-error.tsx` en `app/global-not-found.tsx`.

## SEO-afspraken

- Elke `generateMetadata` gebruikt `pageMetadata()` uit `lib/seo.ts`
  (canonical, hreflang, OG en Twitter mét afbeelding). Nooit losse
  `openGraph`-objecten: die vervangen die van de layout volledig.
- Structured data via `<JsonLd data={…} />` en de builders in `lib/seo.ts`.
- `app/sitemap.ts` en `app/llms.txt/route.ts` worden afgeleid uit de registers;
  nieuwe routes die niet uit een register komen voeg je daar toe.
- `proxy.ts` sluit `api`, `beheer`, `feeds`, `monitoring`, bestanden en
  metadata-routes uit de taalrouting. `/beheer` heeft een eigen matcher die
  alleen de Supabase-sessie ververst. Crawlers krijgen nooit een geo-redirect.
- Indexering: `pageMetadata({ noindex: true })` voor bedankpagina's en
  ongepubliceerde routes (`published` in `lib/routes.ts`).

## Hoe je hier een goede pagina bouwt

1. **Content eerst.** Echte tekst en structuur vóór styling.
2. **Secties stapelen.** Een pagina is een stapel `components/sections/*`;
   secties zijn zelfstandig en presentational, data via props of registers.
3. **Primitives hergebruiken.** Eerst `components/ui/*`, dan pas zelf bouwen.
4. **Semantisch en toegankelijk.** Echte landmarks, één `h1` per pagina,
   alt-teksten, gelabelde velden, zichtbare focus.
5. **Responsive.** Mobile-first; controleer op 390, 768, 1280 en 1440 px.
6. **Beweging met mate.** `Reveal` uit `components/motion/*` is scroll-gedreven
   CSS zonder JavaScript; respecteer `prefers-reduced-motion`; content nooit
   blokkeren op animatie.
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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
