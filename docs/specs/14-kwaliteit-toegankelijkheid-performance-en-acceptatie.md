# 14 Kwaliteit, toegankelijkheid, performance en acceptatietests

| Status | Fase | Hangt af van | Bronnen |
|---|---|---|---|
| concept | 1 | 01 tot en met 13 | CLAUDE.md (Verifiëren vóór je klaar bent), docs/STAPPENPLAN.md fase J en K, context/12 §3.4 en §3.5, context/04, context/05, context/10, `scripts/check-launch.mjs`, `node_modules/next/dist/docs/01-app/02-guides/testing/{vitest,playwright}.md`, `.../02-guides/production-checklist.md`, `.../02-guides/package-bundling.md`, `.../03-api-reference/06-cli/next.md` |

## 1 Doel

Deze module levert de kwaliteitslaag waarmee elke andere module aantoont dat hij af is: een testopzet met Vitest voor eenheden, @playwright/test voor end-to-end en @axe-core/playwright voor toegankelijkheid, een uitgebreide livegang-check, budgetten en metingen voor performance, automatische en handmatige SEO-controles, een visueel protocol op 390, 768, 1280 en 1440 px, een definition of done per module en per bouwstap, een acceptatiematrix over alle specs en een pre-livegangchecklist. De specs worden vanavond door agents uitgevoerd en morgen doet Djulan alleen nog iteratierondes op de frontend. Daarom moet elke bouwstap eindigen met commando's die slagen of falen op localhost tegen het project `groos-dev` (R-17), en mogen tests niet breken als de copy morgen verandert: ze lezen labels uit `messages/` en uit de beheerteksten in plaats van vaste Nederlandse zinnen. Velddata voor Core Web Vitals na de livegang via PageSpeed Insights; geen Vercel Speed Insights in fase 1 (§12).

## 2 Gebruikers en scenario's

De gebruikers van deze module zijn de bouw-agents (per bouwstap en in stap 9), Djulan (iteratie, review en livegang), Jimmy en Lorenzo (acceptatie van het beheer op hun telefoon) en indirect de bezoekers en crawlers waarvoor de controles bestaan.

1. **S-14-01** Een bouw-agent rondt een bouwstap af. Hij draait `npm run verify`, de e2e-bestanden van zijn stap, `npm run check -- --warn` en vanaf stap 2 het visuele protocol voor de pagina's die hij wijzigde, en werkt de acceptatiematrix bij.
2. **S-14-02** De bouw-agent van stap 9 draait alle suites, Lighthouse, de bundelcontrole en het schermlezerprotocol. Wat rood is, lost hij op of legt hij met reden vast in de matrix.
3. **S-14-03** Djulan past morgen tekst en uiterlijk aan. Hij draait `npm run test:e2e:smoke` en `npm run test:visueel`; de tests blijven groen omdat ze tekst uit `messages/nl/*.json` halen.
4. **S-14-04** Djulan bereidt de livegang voor. Hij loopt de pre-livegangchecklist af, doet de Rich Results Test en de OG-controle en draait de alleen-lezen suite tegen de preview en daarna tegen productie.
5. **S-14-05** Een werkzoekende met VoiceOver op een iPhone zoekt een vacature, filtert op beroep en solliciteert. Elke stap is bedienbaar en wordt goed voorgelezen.
6. **S-14-06** Een werkzoekende zonder muis gebruikt alleen het toetsenbord. Hij springt met de skiplink naar de inhoud, opent het menu en verstuurt het contactformulier.
7. **S-14-07** Jimmy logt op zijn telefoon in met wachtwoord en authenticator-app, plaatst een vacature en zet een sollicitatie op "uitgenodigd". Djulan speelt dit scenario vanavond na; Jimmy tekent het later af.
8. **S-14-08** Googlebot bezoekt de site vanaf een Amerikaans IP-adres. Hij krijgt geen geo-redirect, vindt de sitemap en leest per open vacature een geldige JobPosting.
9. **S-14-09** Een pull request op GitHub start de workflow `verify` van spec 13. Typecheck, lint, eenheidstests en de livegang-check draaien en een fout blokkeert het samenvoegen.
10. **S-14-10** Iemand draait de suite per ongeluk met de gegevens van het productieproject in `.env.local`. De voorbereiding weigert voordat er één record is geschreven.

## 3 Scope

### 3.1 Wel

- Testopzet: configuratie, scripts, helpers, mappenstructuur, testdata en omgeving.
- De e2e-, toegankelijkheids-, SEO- en performancetests voor alle publieke routes en het beheer, plus de eenheidstests voor pure functies.
- Uitbreiding van `scripts/check-launch.mjs` en drie nieuwe scripts: `scripts/check-bundles.mjs`, `scripts/lighthouse.mjs` en `scripts/check-acceptatie.mjs`, plus de voorbereidings- en opruimscripts voor e2e.
- Het visuele protocol, het toetsenbordprotocol en het schermlezerprotocol.
- De definition of done per module en per bouwstap, de acceptatiematrix en de pre-livegangchecklist.
- Een extra stap `npm run test` in de workflow `verify` die spec 13 maakt (`.github/workflows/verify.yml`).

### 3.2 Niet

- Geen visuele regressietests met vergelijking tegen een basislijn (`toHaveScreenshot`) in fase 1: het ontwerp verandert morgen in iteratierondes. Screenshots zijn materiaal voor beoordeling, geen assertie.
- Geen e2e in CI: die vragen databasetoegang en geheimen, en Vercel bouwt elke pull request al.
- Geen load- of stresstests en geen penetratietest. De beveiligingsrooktest in §4.4 controleert alleen RLS, cron-autorisatie en headers.
- Geen tests voor componentweergave met React Testing Library: de meeste componenten zijn async server components, die Vitest volgens de Next-docs niet ondersteunt. Die dekt e2e.

### 3.3 Fase 2

- Visuele basislijnen met `toHaveScreenshot` zodra het ontwerp vastligt.
- Velddata voor Core Web Vitals via Vercel Speed Insights (besluit van Djulan, zie §12).
- Tests voor jobalert, feeds, regiopagina's en Engelse vacatures (spec 15).
- Een apart testproject of Supabase-branch in de organisatie van Jimmy als e2e ook in CI moet draaien.

### 3.4 Eisen

| Id | Eis | Dient |
|---|---|---|
| E-14-01 | Er is één testopzet: Vitest 5 voor eenheden en integratie, @playwright/test 1.63 voor e2e, @axe-core/playwright 4.13 voor toegankelijkheid, met scripts in `package.json` en alle artefacten in `.playwright-mcp/`. | R-17, R-19 |
| E-14-02 | Pure functies hebben eenheidstests: zod-schema's, `jobPostingLd` en de andere builders, slug- en opmaakfuncties, datamappers, het beroepenregister en het tokencontrast. | R-04, R-09, R-10, R-19 |
| E-14-03 | De publieke flows hebben e2e-tests: routes in nl en en, twee doelgroeproutes, beroepspagina's, vacatureoverzicht met filters, detail, gesloten staat, 308 bij afwijkende slug en de vier formulieren met record en twee mails. | R-01, R-02, R-04, R-10, R-13, R-14 |
| E-14-04 | Het beheer heeft e2e-tests met inloggen via wachtwoord en TOTP, AAL2-afdwinging, de levenscyclus van een vacature en het afhandelen van sollicitaties, ook op 390 px. | R-03 |
| E-14-05 | Tests draaien tegen `groos-dev`, nooit tegen productie, met gemarkeerde testdata die na elke run is opgeruimd. | R-17, R-11 |
| E-14-06 | De site voldoet aan WCAG 2.2 AA: axe zonder bevindingen op alle routes op 390 en 1280 px, plus automatische controles op koppen, focus, doelgrootte, reflow, reduced motion en taal, en een handmatig schermlezerprotocol. | R-15, R-14 |
| E-14-07 | Performance: Lighthouse mobiel 90 of hoger in alle vier categorieën op home, een vacature en een beroepspagina; Core Web Vitals binnen de doelen; JavaScript per route binnen budget; geen consolefouten en geen onverwachte derde partijen. | R-15, R-14, R-05 |
| E-14-08 | SEO wordt automatisch gecontroleerd (sitemap, robots, llms.txt, canonical, hreflang, noindex, JSON-LD) en handmatig met de Rich Results Test en de Schema Markup Validator. | R-09, R-10, R-13 |
| E-14-09 | `scripts/check-launch.mjs` controleert het beroepenregister, de verwijderlijst, placeholders, spiegeling, verplichte bestanden, env vars en geheimen, tokens, links, metadata en proxy, en neemt de copyregels (verboden tekens, aanspreekvorm) van `check:copy` en de claims van `check:claims` op in één poort; beheerteksten vallen buiten de spiegelcontrole. | R-07, R-08, R-09, R-12, R-13, R-19 |
| E-14-10 | Er is een visueel protocol op 390, 768, 1280 en 1440 px dat eerst door de pagina scrollt en alleen in `.playwright-mcp/` opslaat. | R-05, R-14 |
| E-14-11 | Elke module en elke bouwstap heeft een definition of done, en de acceptatiematrix koppelt elk AC-id aan een testsoort, een test of protocol en een bouwstap. | R-19 |
| E-14-12 | De workflow `verify` van spec 13 draait bij elke pull request ook de eenheidstests. | R-18, R-19 |
| E-14-13 | Een pre-livegangchecklist, gekoppeld aan spec 13, is volledig afgetekend voordat de DNS wordt omgezet. | R-17, R-18, R-12 |
| E-14-14 | Een beveiligingsrooktest bewijst dat anonieme toegang tot persoonsgegevens geweigerd wordt, dat cron-routes zonder geheim 401 geven en dat `/beheer` niet geïndexeerd wordt. | R-03, R-11 |

### 3.5 Definition of done: algemeen

Een bouwstap of module is af als aan alle punten hieronder is voldaan. De bouw-agent noteert het resultaat in `docs/acceptatie/acceptatiematrix.md` (§11.2).

1. `npm run verify` slaagt. In deze spec omvat `verify` ook de eenheidstests (§4.2).
2. Elke nieuwe pure functie heeft een eenheidstest. Elke nieuwe flow heeft een e2e-test waarvan de titel begint met het AC-id dat hij bewijst, bijvoorbeeld `test("AC-06-04 gesloten vacature toont melding", ...)`.
3. De e2e-bestanden van de stap slagen lokaal: `npx playwright test tests/e2e/<map> --project=chromium`.
4. `npm run check -- --warn` meldt geen nieuwe punten, behalve `TODO` voor onbevestigde klantgegevens. Elke nieuwe `TODO` noemt op dezelfde regel wie bevestigt, bijvoorbeeld `TODO bevestigen door Jimmy`.
5. Vanaf stap 2 is het visuele protocol (§8.7) uitgevoerd voor elke gewijzigde publieke pagina en zijn de bevindingen opgelost of genoteerd.
6. Vanaf stap 3 geeft axe geen bevindingen op de gewijzigde routes (`npx playwright test tests/e2e/a11y --grep @a11y`).
7. Er is geen dependency bijgekomen buiten B-37 en de vier devDependencies uit §4.2.
8. Er staan geen screenshots, rapporten of traces buiten `.playwright-mcp/`.
9. De acceptatiematrix is bijgewerkt: status per AC van de stap en een regel in het bouwstappenlogboek met datum, commando's en uitkomst.

### 3.6 Definition of done per bouwstap

De stappen en poorten komen uit 00 §6. Deze tabel voegt per stap toe welke tests en controles groen moeten zijn. Bestandsnamen staan in §4.4.

| Stap | Specs | Tests en controles die groen moeten zijn | Extra poort |
|---|---|---|---|
| 1 | 13, 10, plus stap A van deze spec | `npm run verify`; `npm run test`; `npm run test:integration` (`rls.test.ts`, `storage.test.ts`); `npm run db:test` van spec 10 (`supabase/tests/rls_smoke.sql`); `node scripts/e2e-voorbereiden.mjs` slaagt en maakt het beheertestaccount | `lib/database.types.ts` gegenereerd; ref van `groos-dev` in `tests/e2e/toegestane-projecten.json` |
| 2 | 02 | `tests/unit/design/contrast.test.ts`; regel K14 (kleuren) zonder punten; visueel protocol op `/` | contrastcontrole uit 00 §6 is deze test |
| 3 | 01, 03 (gecommit) | `publiek/navigatie.spec.ts`, `publiek/taal-en-proxy.spec.ts`, `seo/robots-llms.spec.ts`, `seo/sitemap.spec.ts` (vaste routes); `npm run check -- --warn` zonder punten voor K1 tot en met K3 en K9 tot en met K13 | alle routes 200 |
| 3b | 10 (correctiemigratie), 14 (stap A en B), 09 (blok A), 03 (`check:copy`), nazorg voor ronde 2 en 3 op 01, 02, 03, 04 tot en met 09, 10, 11, het vacaturedeel van 12 en 13 deel A, plus de integratiecontrole (B-52) | eerst AC-10-01, AC-13-04 en AC-13-05 (schemacontrole, B-57); `npm run verify`; `npm run test`; `npm run check -- --warn` zonder punten voor K1 tot en met K3 en K9 tot en met K13; regels K5 en K6 als probleem in plaats van notitie; `tests/unit/data/errors.test.ts` (AC-10-33); de eenheidstest van `isKnownPath` (AC-01-39) | AC-01-01 tot en met AC-01-38 en AC-03-01 tot en met AC-03-05 groen; AC-01-39, AC-06-38 en AC-10-33 groen |
| 4 | 04, 05 | `publiek/home.spec.ts`, `publiek/beroepen.spec.ts`, `publiek/copy.spec.ts`, `tests/unit/content/beroepen.test.ts`, `a11y/axe.spec.ts` voor home en beroepspagina's; regel K5 (`check:copy`) zonder fouten; `npm run lighthouse -- --alleen=home,beroep` (informatief) | visueel protocol; eerste Lighthouse-meting genoteerd |
| 5 | 06, 12 | `vacatures/*.spec.ts`, `seo/json-ld.spec.ts`, `seo/noindex.spec.ts`, `seo/metadata.spec.ts`; eenheidstests `seo/*`, `vacatures/*`, `data/mappers.test.ts` | Rich Results Test met code-invoer op één vacature |
| 6 | 07, 11 | `formulieren/*.spec.ts`; `tests/unit/validation/*.test.ts` | handmatig: één echte bevestigingsmail komt aan in de inbox van Djulan, niet in spam |
| 7 | 08 | `beheer/*.spec.ts` inclusief `beheer/mobiel.spec.ts`; `api/cron.spec.ts`; `api/beveiliging.spec.ts` | Jimmy-scenario (S-14-07) door Djulan op zijn telefoon |
| 8 | 09 | `publiek/juridisch.spec.ts`; regels K6 (`check:claims`) en K15 | `npm run check -- --warn` |
| 9 | 14 | `npm run verify`, `test`, `test:integration`, `test:e2e`, `test:visueel`, `lighthouse`, `check:bundles`, `check:acceptatie`; toetsenbord- en schermlezerprotocol | alle AC's groen of afgetekend |
| 10 | 13 | pre-livegangchecklist (§10.6); `npm run test:e2e:ro` tegen de preview en daarna tegen productie; Lighthouse op productie; Rich Results Test met URL | STAPPENPLAN E en K |

### 3.7 Definition of done per module

| Spec | Klaar als | Bewijs |
|---|---|---|
| 01 | Routes uit 00 §4.1 geven 200 in nl en en; verwijderde routes 404; `/api` en `/feeds` buiten de proxy, `/beheer` alleen via `beheerProxy`; `not-found` en `error` werken. | `publiek/navigatie.spec.ts`, `publiek/taal-en-proxy.spec.ts`, K3, K11, K13 |
| 02 | Tokencontrast haalt §8.1; geen kleur buiten tokens; logo leesbaar op 24 px; reduced motion gerespecteerd. | `design/contrast.test.ts`, K14, visueel protocol, `a11y/weergave.spec.ts` |
| 03 | Messages gespiegeld; `check:copy` zonder fouten (verboden tekens, aanspreekvorm, zinslengte); open claims alleen als vlag in `lib/claims.ts`. | K1, K4, K5, K6, `publiek/copy.spec.ts` |
| 04 | Eén h1, beide routes boven de vouw op 390 px, laatste vacatures, `/over-ons`; Lighthouse op `/`. | `publiek/home.spec.ts`, visueel protocol, `npm run lighthouse` |
| 05 | Tien beroepspagina's met kruislinks, vacatures of lege staat, FAQ gelijk aan JSON-LD; Lighthouse op `/werken-als/schoonmaker`. | `publiek/beroepen.spec.ts`, `content/beroepen.test.ts`, `npm run lighthouse` |
| 06 | Filters (ook zonder JavaScript), paginering, detail, 308, gesloten staat, 404 na de termijn. | `vacatures/*.spec.ts`, `vacatures/*.test.ts` |
| 07 | Per formulier record, twee rijen in `email_log`, bedankpagina met noindex, gekoppelde fouten, werkt zonder JavaScript behalve de cv-upload. | `formulieren/*.spec.ts`, `validation/*.test.ts` |
| 08 | TOTP-login, vacatures, sollicitaties, aanvragen, berichten op 1280 en 390 px; Jimmy-scenario afgetekend. | `beheer/*.spec.ts`, handmatig protocol |
| 09 | Juridische pagina's in nl en en, footervermeldingen, algemene voorwaarden pas gelinkt met tekst; `check:claims` slaagt. | `publiek/juridisch.spec.ts`, K6, K15 |
| 10 | Migraties en seed op `groos-dev`; RLS weigert anonieme toegang tot persoonsgegevens; cron werkt; advisors zonder fouten. | `integration/*.test.ts`, `npm run db:test`, `api/cron.spec.ts`, `data/mappers.test.ts`, Supabase MCP |
| 11 | Bevestiging en interne melding per formulier, `email_log` gevuld, nooit een cv als bijlage, Auth-mails komen aan. | `formulieren/*.spec.ts`, handmatige spamtest |
| 12 | Metadata, JSON-LD, sitemap, robots, llms.txt en OG kloppen; Rich Results Test zonder fouten. | `seo/*.spec.ts`, `seo/*.test.ts`, §7.2 |
| 13 | Env vars, geheimen, headers, Vercel, domein, DNS en Resend ingericht; alleen-lezen suite groen op productie. | K9, K10, `api/beveiliging.spec.ts`, §10.6, `npm run test:e2e:ro` |
| 15 | Fase 2, niet van toepassing. | n.v.t. |

## 4 Pagina's en componenten

Deze module levert geen pagina's of UI-componenten. Ze levert configuratie, testbestanden, helpers en scripts. De te testen bouwstenen zijn eigendom van andere specs (00 §4.4a); deze spec beschrijft alleen hoe de tests ze aanspreken.

### 4.1 Mappenstructuur

```
playwright.config.ts                 e2e-configuratie (§4.2)
vitest.config.mts                    unit- en integratieconfiguratie (§4.2)
.github/workflows/verify.yml         van spec 13; deze spec voegt één stap toe (§10.5)
docs/acceptatie/acceptatiematrix.md  levende matrix en bouwstappenlogboek (§11.2)
scripts/
  check-launch.mjs                   livegang-check (uitgebreid, §10.2)
  check-launch.uitzonderingen.json   toegestane uitzonderingen met reden
  check-bundles.mjs                  JavaScript-budget per route (§8.5)
  lighthouse.mjs                     Lighthouse mobiel, mediaan van drie (§8.6)
  check-acceptatie.mjs               matrix tegen specs en tests (§11.2)
  e2e-voorbereiden.mjs               bewaking, cv-objecten weg, seed resetten, testaccount (§5)
  e2e-opruimen.mjs                   verwijdert alle e2e-data (§5.5)
  lib/testomgeving.mjs               controleerTestproject() en aal2SessieE2e(), gedeeld door scripts en tests
tests/
  routes.ts                          routelijsten, afgeleid uit lib/routes.ts en content/beroepen (spec 01)
  unit/
    stubs/server-only.ts             lege module voor import "server-only"
    helpers/kleur.ts                 contrastberekening, alleen hex (de tokens zijn hex)
    validation/{sollicitatie,inschrijving,personeelsaanvraag,contact}.test.ts
    seo/{job-posting,builders}.test.ts
    vacatures/{slug,opmaak}.test.ts
    data/mappers.test.ts
    content/{beroepen,messages}.test.ts
    analytics.test.ts
    design/contrast.test.ts
    scripts/check-launch.test.ts
  integration/
    bewaking.ts
    rls.test.ts
    storage.test.ts
    database.test.ts
  e2e/
    toegestane-projecten.json        { "supabaseProjectRefs": ["smcskfrkjgniinbhqnln"] }
    global-teardown.ts
    beheer.setup.ts                  logt in met TOTP en bewaart de sessie
    helpers/{env,supabase-admin,fixtures,totp,messages,beheer-strings,scroll,a11y,json-ld,formulieren}.ts
    publiek/{navigatie,taal-en-proxy,home,beroepen,juridisch,copy}.spec.ts
    vacatures/{overzicht,detail,gesloten}.spec.ts
    formulieren/{solliciteren,inschrijven,personeel-aanvragen,contact,zonder-js}.spec.ts
    beheer/{login,vacatures,sollicitaties,aanvragen,berichten,mobiel}.spec.ts
    seo/{sitemap,robots-llms,metadata,json-ld,noindex}.spec.ts
    a11y/{axe,toetsenbord,weergave}.spec.ts
    perf/{interactie,netwerk}.spec.ts
    api/{cron,beveiliging}.spec.ts
  visual/
    visueel.spec.ts
.playwright-mcp/                     staat al in .gitignore; alle artefacten
  test-results/  playwright-report/  .auth/  visueel/<datum>/  lighthouse/<datum>/
```

Afspraak over namen: Vitest-bestanden eindigen op `.test.ts`, Playwright-bestanden op `.spec.ts`. Zo pakt de ene runner nooit de bestanden van de andere.

### 4.2 Configuratie

**devDependencies (nieuw, aanvulling op B-37):** `vitest` ^5.0.3, `vite` ^8.3.2 (peer van Vitest 5), `@playwright/test` ^1.63.0 en `@axe-core/playwright` ^4.13.0. Browsers: `npx playwright install chromium webkit`. Lighthouse draait via `npx --yes lighthouse` en wordt geen dependency. De livegang-check gebruikt het bestaande pakket `typescript`.

**Scripts in `package.json`:**

```json
{
  "test": "vitest run --project unit --passWithNoTests",
  "test:watch": "vitest --project unit",
  "test:integration": "vitest run --project integration",
  "test:e2e": "node scripts/e2e-voorbereiden.mjs && playwright test --project=chromium --project=mobiel --project=webkit",
  "test:e2e:smoke": "node scripts/e2e-voorbereiden.mjs && playwright test --project=chromium --project=webkit --grep @smoke",
  "test:e2e:ro": "playwright test --project=chromium --grep @readonly",
  "test:e2e:opruimen": "node scripts/e2e-opruimen.mjs",
  "test:a11y": "node scripts/e2e-voorbereiden.mjs && playwright test --project=chromium --project=mobiel --grep @a11y",
  "test:visueel": "playwright test --project=visueel",
  "lighthouse": "node scripts/lighthouse.mjs",
  "check:bundles": "node scripts/check-bundles.mjs",
  "check:acceptatie": "node scripts/check-acceptatie.mjs",
  "verify": "npm run typecheck && npm run lint && npm run test && npm run build"
}
```

`verify` krijgt `npm run test` erbij. De eenheidstests duren seconden en maken punt 1 van de definition of done automatisch.

**`vitest.config.mts`:**

```ts
import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    tsconfigPaths: true, // Vite 8: het pad-alias @/* uit tsconfig.json
    alias: { "server-only": fileURLToPath(new URL("./tests/unit/stubs/server-only.ts", import.meta.url)) },
  },
  test: {
    projects: [
      { extends: true, test: { name: "unit", include: ["tests/unit/**/*.test.ts"], environment: "node" } },
      {
        extends: true,
        test: {
          name: "integration",
          include: ["tests/integration/**/*.test.ts"],
          environment: "node",
          env: loadEnv("development", process.cwd(), ""),
          fileParallelism: false,
          testTimeout: 30_000,
          globalSetup: ["tests/integration/bewaking.ts"],
        },
      },
    ],
  },
});
```

De alias voor `server-only` is nodig omdat dat pakket buiten de react-server-omgeving een fout gooit; `lib/supabase/admin.ts` en mogelijk `lib/seo.ts` importeren het. `tests/integration/bewaking.ts` roept `controleerTestproject()` uit `scripts/lib/testomgeving.mjs` aan (§5.2).

**`playwright.config.ts`** (de kern; de bouw-agent mag opmaak en commentaar toevoegen):

```ts
import { defineConfig, devices } from "@playwright/test";

try { process.loadEnvFile(".env.local"); } catch { /* geen .env.local: alleen @readonly tegen E2E_BASE_URL */ }

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3100";
const EIGEN_SERVER = !process.env.E2E_BASE_URL;
const LOKAAL = new URL(BASE_URL).hostname === "localhost";
const BYPASS = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export default defineConfig({
  testMatch: "**/*.spec.ts",
  outputDir: ".playwright-mcp/test-results",
  reporter: [["list"], ["html", { outputFolder: ".playwright-mcp/playwright-report", open: "never" }]],
  fullyParallel: true,
  workers: 2,
  retries: 0,
  grep: LOKAAL ? undefined : /@readonly/,
  globalTeardown: LOKAAL ? "./tests/e2e/global-teardown.ts" : undefined,
  use: {
    baseURL: BASE_URL,
    locale: "nl-NL",
    timezoneId: "Europe/Amsterdam",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    extraHTTPHeaders: BYPASS ? { "x-vercel-protection-bypass": BYPASS } : undefined,
  },
  webServer: EIGEN_SERVER
    ? { command: "npm run build && npx next start -p 3100", url: "http://localhost:3100", reuseExistingServer: false,
        timeout: 300_000, env: { EMAIL_DEV_TO: "delivered+e2e@resend.dev" } }
    : undefined,
  projects: [
    { name: "setup", testDir: "tests/e2e", testMatch: /beheer\.setup\.ts/ },
    { name: "chromium", testDir: "tests/e2e", testIgnore: /\.setup\.ts/, dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
    { name: "mobiel", testDir: "tests/e2e", grep: /@mobiel/, dependencies: ["setup"],
      use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } } },
    { name: "webkit", testDir: "tests/e2e", grep: /@smoke/, use: { ...devices["iPhone 15"] } },
    { name: "visueel", testDir: "tests/visual", use: { ...devices["Desktop Chrome"] } },
  ],
});
```

Toelichting bij de keuzes:

- **Productiebuild.** De Next-docs raden aan e2e tegen productiecode te draaien. Poort 3100 voorkomt een botsing met `npm run dev` op 3000. Elke volledige run bouwt opnieuw, zodat de build de opnieuw geseede vacatures van `e2e-voorbereiden.mjs` bevat (§5.3).
- **Eigen server.** Met `E2E_BASE_URL=http://localhost:3000` draait de volledige suite tegen een server die al loopt, zonder build. Tests die op verse cache rekenen kunnen dan verouderde data zien; de suite meldt dat bij het starten.
- **Externe URL.** Een `E2E_BASE_URL` buiten localhost (preview of productie) draait automatisch alleen `@readonly`: die tests schrijven niets.
- **Browsers.** Chromium op 1280 px draait alles. Het project `mobiel` (Chromium op 390 px) draait de tests met `@mobiel`. WebKit op een iPhone draait `@smoke` voor Safari-gedrag. Beheertests draaien alleen in Chromium, omdat WebKit cookies met `Secure` op `http://localhost` anders behandelt.

**ESLint.** In `eslint.config.mjs` komt één blok voor `tests/**` dat `react-hooks/rules-of-hooks` uitzet. Anders ziet de regel de Playwright-fixturefunctie `use` als React-hook en faalt `npm run lint`.

**Tags.** `@readonly` (schrijft niets en mag tegen preview en productie), `@smoke` (kleine snelle selectie voor iteratie), `@mobiel` (draait ook op 390 px), `@a11y`, `@perf`. Een test kan meerdere tags hebben; ze staan aan het eind van de titel.

### 4.3 Helpers

Alle helpers staan in `tests/e2e/helpers/` en zijn getypeerd zonder `any`.

| Bestand | Exports | Doet |
|---|---|---|
| `env.ts` | `BASE_URL: string`, `LOKAAL: boolean`, `RUN_ID: string`, `testEmail(label: string): string` | `RUN_ID` uit `.playwright-mcp/.auth/run.json`; `testEmail("sollicitatie")` geeft `delivered+e2e-<RUN_ID>-sollicitatie@resend.dev`. |
| `supabase-admin.ts` | `adminClient(): SupabaseClient<Database>` | Service-role-client met type uit `lib/database.types.ts`; roept eerst `controleerTestproject()` aan. |
| `fixtures.ts` | `openSeedVacature(beroep?: OccupationSlug): Promise<{ nummer: number; pad: string }>`; `maakTestVacature(toestand: "gepubliceerd" \| "gesloten-recent" \| "gesloten-oud" \| "gepland" \| "concept", overrides?: { beroep?: OccupationSlug; titel?: string }): Promise<{ id: string; nummer: number; pad: string }>`; `recordOpEmail(tabel: "applications" \| "staff_requests" \| "contact_messages", email: string): Promise<{ id: string } \| null>`; `emailLogVoor(entityId: string): Promise<{ template: string; status: string }[]>` | `openSeedVacature` leest `public_vacancies` met `state = 'open'`. `maakTestVacature` werkt als in §5.4. `pad` is `/vacatures/<slug>` met de slug uit de database (spec 10 maakt hem in een trigger). |
| `totp.ts` | `totp(geheimBase32: string, nu?: number): string`; `wachtOpVerseCode(minSeconden?: number): Promise<void>` | RFC 6238 met `node:crypto`, zie hieronder. |
| `messages.ts` | `t(pad: string, opties?: { locale?: "nl" \| "en"; waarden?: Record<string, string \| number> }): string` | Leest een sleutelpad uit `messages/nl/*.json` of `messages/en/*.json` (het bestand van de namespace, B-45), vult `{naam}` in, haalt rich-tags weg. Locators gebruiken altijd `t()`. |
| `beheer-strings.ts` | herexport uit `app/beheer/_strings.ts` | Beheertests lezen labels uit dezelfde bron als het beheer. |
| `scroll.ts` | `scrollDoor(page: Page, opties?: { stapFactor?: number; pauzeMs?: number }): Promise<void>` | Scrollt per 0,8 vensterhoogte met 150 ms pauze tot onderaan, wacht 600 ms, terug naar boven, wacht op `document.fonts.ready`. Daarna staan reveal-elementen op zichtbaar. |
| `a11y.ts` | `verwachtGeenAxeBevindingen(page: Page, opties?: { uitsluiten?: string[] }): Promise<void>`; `koppen(page: Page): Promise<{ niveau: number; tekst: string }[]>` | Axe met `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`; uitsluitingen alleen met reden in `tests/e2e/a11y/uitsluitingen.ts`. |
| `json-ld.ts` | `jsonLd(page: Page): Promise<Record<string, unknown>[]>`; `vanType(items: Record<string, unknown>[], type: string): Record<string, unknown>[]` | Leest alle `script[type="application/ld+json"]` en pakt `@graph` uit. |
| `formulieren.ts` | `wachtInvultijd(): Promise<void>` | Wacht de minimale invultijd uit de constante van spec 07 plus 500 ms. |

TOTP-helper (dit is de volledige logica; geen extra pakket nodig):

```ts
import { createHmac } from "node:crypto";

const ALFABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32NaarBuffer(invoer: string): Buffer {
  const schoon = invoer.replace(/=+$/, "").replace(/\s/g, "").toUpperCase();
  let bits = "";
  for (const teken of schoon) {
    const waarde = ALFABET.indexOf(teken);
    if (waarde < 0) throw new Error(`Ongeldig base32-teken: ${teken}`);
    bits += waarde.toString(2).padStart(5, "0");
  }
  return Buffer.from((bits.match(/.{8}/g) ?? []).map((b) => parseInt(b, 2)));
}

export function totp(geheim: string, nu = Date.now()): string {
  const teller = Buffer.alloc(8);
  teller.writeBigUInt64BE(BigInt(Math.floor(nu / 1000 / 30)));
  const hmac = createHmac("sha1", base32NaarBuffer(geheim)).update(teller).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  return ((hmac.readUInt32BE(offset) & 0x7fffffff) % 1_000_000).toString().padStart(6, "0");
}
```

`wachtOpVerseCode(5)` wacht tot het volgende venster van 30 seconden als er minder dan 5 seconden over zijn, zodat een code niet verloopt tussen invullen en versturen.

### 4.4 Testbestanden en wat ze dekken

**Eenheidstests (Vitest, project `unit`).** De functienamen komen uit de specs die eigenaar zijn; waar de naam nog niet vaststaat, gebruikt de bouw-agent de echte export.

| Bestand | Test | Eigenaar van de code |
|---|---|---|
| `validation/sollicitatie.test.ts` | Geldig minimaal invoer slaagt; elk verplicht veld uit B-17 ontbreekt één keer en faalt met de juiste sleutel; e-mail en telefoon (Nederlands en internationaal) worden genormaliseerd; cv alleen pdf, doc of docx tot 10 MB; rijbewijsveld alleen als de vacature het vraagt; velden als BSN, geboortedatum of nationaliteit komen nooit door het schema. | 07 (`lib/validation/*`) |
| `validation/inschrijving.test.ts` | Toestemmingsvinkje verplicht (B-08); verder als sollicitatie zonder vacature. | 07 |
| `validation/personeelsaanvraag.test.ts` | Velden uit B-18; meerdere beroepen alleen uit de vijf id's van 00 §4.2; aantal is een positief geheel getal; KvK optioneel en dan acht cijfers. | 07 |
| `validation/contact.test.ts` | Telefoon of e-mail: minstens één van beide; onderwerp uit de vaste lijst met "bel mij terug". | 07 |
| `seo/job-posting.test.ts` | `jobPostingLd` met een vaste vacature-fixture: `title` alleen de functietitel, `description` als HTML, `datePosted`, `validThrough` in ISO 8601, `employmentType` volgens de mapping van spec 12, `hiringOrganization` Groos met `sameAs` en `logo`, `jobLocation.address` met `addressLocality` en `addressCountry` "NL", `baseSalary` in EUR met `unitText` "HOUR" en min en max, `directApply` true, `identifier` met het vacaturenummer. Voor een gesloten of gearchiveerde vacature levert de pagina geen JobPosting (de builder of de aanroeper, zoals spec 12 het vastlegt). | 12 (`lib/seo.ts`) |
| `seo/builders.test.ts` | `employmentAgencyLd`, `breadcrumbLd` (posities 1 tot n, absolute URL's), `faqLd`, en `pageMetadata` (canonical absoluut, `alternates.languages` met nl, en en x-default, OG-afbeelding aanwezig, robots `noindex` als de optie dat vraagt). | 12 |
| `vacatures/slug.test.ts` | `parseVacancySlug` en `parseVacancySearchParams` met de gevallen uit AC-10-17, plus: een slug met een andere tekst en hetzelfde nummer geeft hetzelfde nummer (basis voor de 308 van B-15). De slug zelf maakt een databasetrigger; die toetst spec 10 in SQL. | 10 (`lib/data/*`) |
| `vacatures/opmaak.test.ts` | `formatEuro`, `formatTime`, `formatDate` en de andere functies uit `lib/format.ts` met de gevallen uit AC-03-18, plus bandbreedtes met "tot" en uren per week. | 03 (`lib/format.ts`), 06 |
| `data/mappers.test.ts` | Rijen uit `lib/database.types.ts` naar de typen uit `lib/data/types.ts`: lege optionele velden, arrays, datums als ISO-string, bedragen als getal, contactpersoon. Plus `revalidateVacancies` met een mock van `next/cache`: profiel `{ expire: 0 }` bij `visibility` (AC-10-18). | 10 |
| `content/beroepen.test.ts` | `beroepen` uit `content/beroepen/index.ts` bevat precies de vijf id's met `slugWerkzoekende` en `slugWerkgever` uit 00 §4.2, gelijk aan `OCCUPATION_SLUGS` uit `lib/data/options.ts`; `paths.werkenAls` en `paths.werkgeverBeroep` uit `lib/routes.ts` geven de juiste paden; elk `content/beroepen/<id>.ts` heeft `nl` en `en` met alle verplichte velden gevuld. | 01, 05, 10 |
| `content/messages.test.ts` | De sleutelpaden van `common`, `meta`, `header`, `footer`, `notFound` en `error` in beide messages zijn gelijk aan de lijst uit spec 03 (AC-03-02). | 03 |
| `analytics.test.ts` | `analyticsBeforeSend` haalt `q` en andere vrije invoer uit de URL en laat `beroep` staan, met de gevallen uit AC-09-17. | 09 |
| `design/contrast.test.ts` | Leest de paren en drempels uit `lib/contrast-pairs.json` (spec 02 §4.3) en de hextokens uit `:root` van `app/globals.css`, en controleert met `brandToToken` dat `lib/brand.ts` gelijk is aan de tokens; geen eigen lijst. | 02 |
| `scripts/check-launch.test.ts` | Schrijft per regel K1 tot en met K15 een mini-repo in een tijdelijke map (`fs.mkdtempSync`), draait het script met `--json` in die map en verwacht precies het bedoelde probleem; voor K9, K11 en K12 ook de gevallen die geen probleem mogen geven (§10.2). Geen fixturebestanden in de repo, dus geen last voor `tsc` en ESLint. | 14 |

**Integratietests (Vitest, project `integration`, tegen `groos-dev`).**

| Bestand | Test |
|---|---|
| `rls.test.ts` | De REST-controles van AC-10-04 tot en met AC-10-07 als test met supabase-js en de publishable key: `public_vacancies` geeft alleen open vacatures en gesloten vacatures binnen 30 dagen, nooit `draft` of `scheduled`; `applications` en `audit_log` geven fout `42501`; een insert in `contact_messages` geeft `42501`; `admin_profiles` geeft alleen de kolommen van de column grant. Seednummers worden niet hard verwacht, omdat de seed tijdsafhankelijk is. |
| `storage.test.ts` | Anoniem: `cvs` lijst niets op en een download van een bestaand object faalt; de publieke objectroute voor `cvs` geeft geen bestand. `public-media` is leesbaar. |
| `database.test.ts` | De regels uit AC-10-09 tot en met AC-10-11 en AC-10-24 op testvacatures en testsollicitaties (nooit op de seed): vast nummer, slug uit titel en plaats, publiceren met twee taken faalt met `vacancy_not_publishable:tasks`, ongeldige overgang faalt, dubbele `submission_id` geeft `23505`. Plus de zichtbaarheid in `public_vacancies` rond `CLOSED_VISIBLE_DAYS` (gesloten 29 dagen geleden zichtbaar, 31 dagen geleden niet; gepland en concept nooit). Ruimt zijn eigen rijen op. |

**E2e-tests (Playwright).** Kolom "Schrijft" zegt of de test data aanmaakt.

| Bestand | Dekt | Tags | Schrijft |
|---|---|---|---|
| `publiek/navigatie.spec.ts` | Elke route uit `tests/routes.ts` in nl en en: 200, één h1, een `<title>`, geen consolefouten. De verwijderde en onbekende paden uit AC-01-02: 404 met tekst uit `notFound` en noindex. Header linkt naar `/werkzoekenden` en `/werkgevers`. | @readonly @smoke @mobiel | nee |
| `publiek/taal-en-proxy.spec.ts` | Taalwissel behoudt het pad en zet `NEXT_LOCALE`; geo-redirect voor mensen, niet voor Googlebot (AC-14-25); `/beheer` krijgt geen taalomleiding en geen `NEXT_LOCALE`, ook met `x-vercel-ip-country: PL`; `/en/beheer` geeft 404. | @readonly | nee |
| `publiek/home.spec.ts` | Op 390 px beide doelgroeproutes binnen de eerste 844 px; laatste vacatures uit de seed met links naar hun detail. | @readonly @smoke @mobiel | nee |
| `publiek/beroepen.spec.ts` | Tien beroepspagina's: h1 noemt het beroep, link naar het andere perspectief, vacatures of een lege staat met link naar `/inschrijven`, FAQ-JSON-LD gelijk aan de zichtbare vragen. | @readonly | nee |
| `publiek/juridisch.spec.ts` | Privacy-, cookie- en klachtenpagina in nl en en; footerlinks; `/algemene-voorwaarden` met `noindex, follow` en nergens gelinkt zolang `getLegalDoc("terms").published` in `lib/legal.ts` `false` is (B-11). | @readonly | nee |
| `publiek/copy.spec.ts` | De zichtbare-tekstcontroles van spec 03: geen uitroepteken of gedachtestreepje in `document.body.innerText`; geen je-vorm in `main` van werkgeverspagina's en geen u-vorm op werkzoekendenpagina's; op `/en` geen Nederlandse waarde in header, footer en knoppen. | @readonly | nee |
| `vacatures/overzicht.spec.ts` | Filters `q`, `beroep`, `plaats`, `uren`, `dienst` als queryparameters, ook gecombineerd en zonder JavaScript (GET-formulier); lege staat; aantal resultaten in `aria-live`; filterpaneel achter een knop op 390 px. `?pagina=2` (AC-06-11) staat in een eigen test zonder `@readonly` die zeven testvacatures maakt en daarna opruimt (§7.3). | @readonly @mobiel | alleen de pagineringstest |
| `vacatures/detail.spec.ts` | Kenmerken, taken, eisen, aanbod; `tel:`-link en WhatsApp-link met titel en nummer; vaste sollicitatieknop op 390 px; 308 bij afwijkende slugtekst; `/en/vacatures/<slug>` met de melding over Nederlandse tekst en `lang="nl"`. | @readonly @smoke @mobiel | nee |
| `vacatures/gesloten.spec.ts` | Testvacature "gesloten recent": 200, melding, `noindex, follow`, geen JobPosting, geen formulier, vergelijkbare vacatures. Testvacatures "gesloten oud", "gepland" en "concept", en seedvacatures 1008 tot en met 1010: 404. | | ja (fixtures) |
| `formulieren/solliciteren.spec.ts` | Met en zonder cv: `/bedankt/sollicitatie` met noindex, record met status `new`, cv in `cvs`, twee rijen in `email_log`. Fouten via `aria-describedby` en focus naar de eerste fout. 11 MB en `.png` geweigerd. Honeypot geeft geen record. Talentpool-vinkje komt in het record. | @mobiel | ja |
| `formulieren/inschrijven.spec.ts` | Zonder toestemmingsvinkje een fout; met vinkje record, twee mails, `/bedankt/inschrijving`. | | ja |
| `formulieren/personeel-aanvragen.spec.ts` | Meerdere beroepen; record in `staff_requests`, twee mails, `/bedankt/aanvraag`. | | ja |
| `formulieren/contact.spec.ts` | Telefoon of e-mail volstaat, geen van beide is een fout; onderwerp "bel mij terug"; record, twee mails, `/bedankt/contact`. | | ja |
| `formulieren/zonder-js.spec.ts` | `javaScriptEnabled: false`: contact, aanvraag en sollicitatie zonder cv slagen; serverfouten bij de velden (B-36). | | ja |
| `beheer/login.spec.ts` | Zonder sessie naar de inlogpagina; fout wachtwoord en foute code geven een melding; AAL1 komt niet voorbij de TOTP-stap; uitloggen; `autocomplete` `username` of `email`, `current-password`, `one-time-code`. | | nee |
| `beheer/vacatures.spec.ts` | Aanmaken met de velden uit B-06; publiceren met een ontbrekend veld geweigerd; publiceren zichtbaar op `/vacatures`; titel wijzigen geeft 308 op de oude slug; sluiten als vervuld toont de melding; verlengen; dupliceren; plannen blijft onzichtbaar; archiveren geeft 404. | | ja |
| `beheer/sollicitaties.spec.ts` | Lijst, detail, cv via signed URL (200 en juiste content-type), status wijzigen met rij in `activities`, notitie. | | ja |
| `beheer/aanvragen.spec.ts`, `beheer/berichten.spec.ts` | Lijst, detail, status volgens 00 §4.3, notitie. | | ja |
| `beheer/mobiel.spec.ts` | Jimmy-scenario op 390 px: inloggen, vacature plaatsen, sollicitatie op "uitgenodigd"; geen horizontale scroll. | @mobiel | ja |
| `seo/*.spec.ts`, `a11y/*.spec.ts`, `perf/*.spec.ts` | Zie §7.1, §8.1, §8.2, §8.5 en §8.6. Beheerschermen in `a11y` gebruiken de sessie uit de setup en zijn niet `@readonly`. De pagineringstest in `seo/noindex.spec.ts` maakt testvacatures (§7.3) en is niet `@readonly`. | @readonly, @a11y, @perf | alleen de pagineringstest |
| `api/cron.spec.ts` | `/api/cron/vacatures`, `/api/cron/bewaartermijnen` en `/api/cron/opruimen` (spec 10, en elk pad uit `vercel.ts`): 401 zonder `Authorization: Bearer <CRON_SECRET>`, 200 met `{ ok: true }` (de 401-test is `@readonly`). Effecten alleen op testdata, nooit op de seed: een testvacature met verlopen `closes_at` staat na `/api/cron/vacatures` op `closed` met reden `expired` en toont publiek de melding; een e2e-sollicitatie met `retain_until` in het verleden is na `/api/cron/bewaartermijnen` geanonimiseerd zonder cv-object (AC-10-14, AC-10-19). | | ja |
| `api/beveiliging.spec.ts` | Op `/` en een vacature de vijf headers van spec 13 (`content-security-policy`, `x-frame-options: DENY`, `x-content-type-options: nosniff`, `referrer-policy`, `permissions-policy`); `x-robots-tag: noindex, nofollow` op `/beheer/inloggen`, `/beheer` en `/api/cron/vacatures`; geen CSP-meldingen in de console op `/`, een vacature tijdens solliciteren en `/beheer/inloggen`. | @readonly | nee |

### 4.5 Scripts

| Script | Invoer | Uitvoer en exitcode |
|---|---|---|
| `scripts/check-launch.mjs` | repo-bestanden; vlaggen `--warn` (altijd exit 0) en `--json` | Eerste regel blijft `Livegang-check: <n> punt(en), waarvan <m> placeholder-regels.`; daarna problemen per regel-id (`✗ [K5] ...`) en notities (`· [K6] ...`). Exit 1 bij één of meer problemen. Details in §10.2. |
| `scripts/check-bundles.mjs` | `.next/diagnostics/route-bundle-stats.json` (schrijft `next build` met Turbopack in Next 16.3) en `.next/static` | Tabel per route met gzip-grootte van de first-load-JavaScript en budgetklasse; exit 1 bij overschrijding, `--warn` voor exit 0. Ontbreekt het bestand, dan een melding met de verwijzing naar `npx next experimental-analyze`. Daarnaast faalt het als een bestand in `.next/static` `sb_secret_` of een Resend-sleutel bevat (AC-13-11). |
| `scripts/lighthouse.mjs` | draaiende server (standaard `http://localhost:3100`, of `--basis=<url>`); `--alleen=home,vacature,beroep`; `--extra=<pad>,<pad>` voor informatieve pagina's van andere specs | Drie runs per pagina, mediaan, rapporten in `.playwright-mcp/lighthouse/<JJJJ-MM-DD>/`; exit 1 onder de drempels uit §8.4 voor de drie poortpagina's; extra pagina's alleen in de tabel. |
| `scripts/check-acceptatie.mjs` | `docs/specs/(0[1-9]\|1[0-4])-*.md` (spec 00 en spec 15 blijven buiten de matrix van fase 1), `docs/acceptatie/acceptatiematrix.md`, `tests/**/*.ts` | Meldt AC-id's die niet in de matrix staan, automatische rijen zonder test met dat id in de titel, tests met een onbekend id, en met `--livegang` elke rij die niet `groen`, `afgetekend` of `vervallen` is. |
| `scripts/e2e-voorbereiden.mjs` | `.env.local`, `tests/e2e/toegestane-projecten.json` | Bewaking met `controleerTestproject` (§5.2); daarna eerst alle objecten onder `cvs/applications/` in `groos-dev` verwijderen via de Storage-API en vervolgens `npm run db:seed:reset` (§5.3); dan aanmaken of hergebruiken van het beheertestaccount met TOTP, schrijven van `RUN_ID`. Exit 1 met een Nederlandse melding bij elke fout. |
| `scripts/e2e-opruimen.mjs` | zelfde | Verwijdert alle e2e-data (§5.5) en print per tabel het aantal. |

## 5 Data

Het datamodel is van spec 10. Deze sectie beschrijft alleen de testomgeving en de testdata.

### 5.1 Testomgeving

Tests draaien tegen het ontwikkelproject `groos-dev` uit B-12, met gemarkeerde testdata die na elke run verdwijnt. Een apart testschema is afgewezen: Auth, Storage en RLS hangen aan de schema's `public` en `auth`, en de app zou een tweede schemaconfiguratie nodig hebben. Een apart testproject kost een abonnement en dubbel migratiewerk; een Supabase-branch vraagt Pro en de GitHub-koppeling bij Jimmy. Beide blijven een optie voor fase 2 (§3.3).

`scripts/e2e-voorbereiden.mjs` draait vóór de build; daarna bouwt Playwright de app en start `next start` op poort 3100. Zo bevat de build de opnieuw geseede vacatures. Testvacatures maken de tests zelf tijdens de run (§5.4).

### 5.2 Bewaking tegen de verkeerde omgeving

`scripts/lib/testomgeving.mjs` exporteert `controleerTestproject(url: string): void`. De functie haalt de projectref uit `NEXT_PUBLIC_SUPABASE_URL` (`https://<ref>.supabase.co`) en stopt met de melding `Testomgeving geweigerd: project <ref> staat niet in tests/e2e/toegestane-projecten.json` als de ref niet in de lijst staat. De voorbereiding, de opruiming, `adminClient()` en de integratietests roepen hem aan vóór elke schrijfactie. De ref van `groos-dev` (`smcskfrkjgniinbhqnln`, B-12) komt in het JSON-bestand; ter controle geeft MCP `get_project_url` van de server `supabase` uit `.mcp.json` `https://smcskfrkjgniinbhqnln.supabase.co`. De ref is geen geheim en wordt gecommit. Het productieproject komt nooit in de lijst.

### 5.3 Seedcontract met spec 10

De seed is van spec 10 (`supabase/seed.sql`, spec 10 §5.11). De tests gebruiken hem zo:

| Seed | Toestand bij het seeden | Gebruik in de tests |
|---|---|---|
| 1001 tot en met 1006 | `published`, elk beroep minstens één keer (logistiek twee keer), sluitdatum 35 tot 44 dagen vooruit | overzicht, filters (verwachtingen uit AC-10-16), detail, JobPosting, sitemap, Lighthouse, formulieren |
| 1007 | `closed`, `filled`, vijf dagen geleden gesloten | alleen in de integratietest; tijdsafhankelijk, dus niet in e2e |
| 1008 | `scheduled`, publicatie twee dagen na het seeden | 404 zolang de publicatiedatum niet voorbij is |
| 1009 | `draft` | 404 |
| 1010 | `closed`, `withdrawn`, veertig dagen geleden gesloten | 404 (de cron archiveert hem) |
| testsollicitatie, inschrijving, aanvraag, bericht | adressen op `example.com` | lijsten in het beheer |

Omdat de seed relatieve tijden heeft, zet `e2e-voorbereiden.mjs` hem vóór elke build opnieuw. Na de bewaking (`controleerTestproject`, §5.2) verwijdert het script eerst alle objecten onder `cvs/applications/` in `groos-dev` via de Storage-API en draait daarna `npm run db:seed:reset`. De reset zet de relatieve datums opnieuw, dus het script verlengt geen seedvacatures. Toestanden die op een datum leunen, maken de tests zelf (§5.4). Faalt de reset, dan stopt de voorbereiding met de verwijzing naar de seedstap van spec 10.

### 5.4 Fixtures en markering

- Elke run krijgt een `RUN_ID` (tijdstempel `JJJJMMDDuummss`).
- Formulierdata gebruikt `testEmail(label)`, dus `delivered+e2e-<RUN_ID>-<label>@resend.dev`, en de naam "E2E Test".
- Testvacatures hebben een titel die begint met `E2E `. `maakTestVacature(toestand)` logt in als het e2e-beheeraccount met een aal2-sessie (`aal2SessieE2e()` uit `scripts/lib/testomgeving.mjs`: wachtwoord plus `mfa.challengeAndVerify` met `totp()`), maakt een concept met `rpc("save_vacancy", ...)` en zet de status met dezelfde acties als het beheer volgens de overgangstabel van spec 10. Datums die een actie niet zet (gesloten vijf of veertig dagen geleden) zet de helper daarna met de service-role-client. Een nieuw nummer heeft nog geen cache, dus de detailpagina toont direct de juiste toestand. Na elke mutatie roept `maakTestVacature` `POST /api/dev/revalidate` aan met Bearer `CRON_SECRET` en body `{ numbers: [nummer], kind: "visibility" }` (spec 10, B-46), zodat `/vacatures` en de sitemap zonder nieuwe build de nieuwe toestand tonen.
- Paginering: `/vacatures` toont 12 per pagina (spec 10) en de seed heeft er 6. `/vacatures?pagina=2` wordt getoetst nadat zeven testvacatures met `maakTestVacature("gepubliceerd")` zijn gemaakt (13 open, zoals AC-06-11), en daarna opgeruimd. De andere tests zien dus alleen de zes open seedvacatures, zoals de verwachtingen van AC-10-16.
- Cron: een test die een cron-effect wil zien, maakt een testvacature en roept daarna de cron-route aan; die revalideert zelf (spec 10).
- Cv-bestanden: `tests/e2e/bestanden/cv-test.pdf` (een geldige pdf van één pagina, kleiner dan 5 kB). Het bestand van 11 MB en de `.png` maakt de test tijdens de run in de outputmap.

### 5.5 Opruimen

`scripts/e2e-opruimen.mjs` (ook aangeroepen door `tests/e2e/global-teardown.ts`; aan het begin van de voorbereiding doen de Storage-opruiming en `npm run db:seed:reset` dit werk, §5.3) verwijdert in deze volgorde:

1. De paden van cv-objecten van e2e-sollicitaties ophalen en de objecten in `cvs` verwijderen.
2. Rijen in `applications`, `staff_requests` en `contact_messages` met een e-mail die begint met `delivered+e2e-`.
3. Vacatures waarvan de titel begint met `E2E `, met hun vertalingen en gekoppelde rijen.
4. Rijen in `email_log` en `activities` die naar verwijderde records verwijzen, voor zover spec 10 dat niet al via een cascade doet.

`audit_log` blijft staan: het bevat geen gegevens van echte personen en verloopt na twee jaar (B-07). Na een volledige run geeft het opruimscript voor elke tabel 0 resterende e2e-rijen.

### 5.6 Beheertestaccount met TOTP

De voorbereiding zorgt voor één beheerder `delivered+beheer-e2e@resend.dev` in `groos-dev`. Bestaan `.playwright-mcp/.auth/beheer-e2e.json` en de gebruiker, dan wordt hij hergebruikt. Anders:

1. Een oude gebruiker met dat adres verwijderen en een nieuwe maken met `auth.admin.createUser({ email, password, email_confirm: true })` en een willekeurig wachtwoord van 32 tekens.
2. Beheerrechten via `rpc("grant_admin", { p_email, p_full_name: "E2E Beheer", p_display_name: "E2E", p_role: "owner", p_phone: "+31600000099" })` (spec 10), dezelfde rol als Jimmy en Lorenzo (B-06), zodat elke beheeractie te testen is. Ook het e2e-account heeft een telefoonnummer, zodat het als contactpersoon kan publiceren; de seed kiest alleen beheerders met een telefoonnummer (B-48).
3. Inloggen met de publishable key (`signInWithPassword`), `mfa.enroll({ factorType: "totp", friendlyName: "e2e" })`, verifiëren met `mfa.challengeAndVerify` en `totp()`.
4. E-mail, wachtwoord en TOTP-geheim opslaan in `.playwright-mcp/.auth/beheer-e2e.json`.

`tests/e2e/beheer.setup.ts` logt via de echte inlogpagina in en bewaart de sessie in `.playwright-mcp/.auth/beheer.json`. Alleen `beheer/login.spec.ts` logt opnieuw in, zodat de suite onder de limieten van Supabase Auth blijft.

### 5.7 E-mail in tests

Spec 13 regelt de mail buiten productie: zonder `RESEND_API_KEY` verschijnt elke mail in de terminal, met een sleutel gaan alle mails alleen naar `EMAIL_DEV_TO` (AC-13-08). De `webServer` van Playwright zet daarom `EMAIL_DEV_TO=delivered+e2e@resend.dev`, zodat een e2e-run nooit de inbox van Djulan of `info@` vult; Resend-testadressen leveren een geslaagde aflevering zonder echte inbox. Tests controleren `email_log` en geen mailbox: per formulierrecord twee rijen (bevestiging en interne melding) met de status die spec 11 voor verstuurd of voor terminalweergave vastlegt. De echte aankomst en de spamcontrole zijn handmatig (bouwstap 6 en de pre-livegangchecklist).

### 5.8 Omgevingsvariabelen

Tests gebruiken de variabelen uit `.env.local` zoals spec 13 die vastlegt: de zes vaste uit 00 §4.5 en de optionele `EMAIL_FROM`, `EMAIL_DEV_TO` en `BOTID_DEV_BYPASS` (leeg, dus mens). Daarnaast bestaan drie variabelen die alleen in de shell van de tester staan en nooit door de app worden gelezen:

- `E2E_BASE_URL`: optioneel; de basis-URL voor een run tegen een bestaande server, preview of productie.
- `VERCEL_AUTOMATION_BYPASS_SECRET`: optioneel; de waarde van "Protection Bypass for Automation" uit de kluis (spec 13, C4), verstuurd als header `x-vercel-protection-bypass`.
- `SUPABASE_DB_URL`: verplicht voor elke lokale e2e-run, omdat `e2e-voorbereiden.mjs` `npm run db:seed:reset` draait (spec 10 §4.7); connection string van `groos-dev` (Session pooler) uit de kluis.

Spec 13 neemt `E2E_BASE_URL` en `VERCEL_AUTOMATION_BYPASS_SECRET` als commentaarregels op in `.env.example` (aanvulling op 00 §4.5, zie §12). Omdat de app ze niet leest, botsen ze niet met AC-13-12.

## 6 Tekstelementen

### 6.1 Tests lezen tekst uit dezelfde bron als de site

Locators gebruiken rollen en toegankelijke namen, met tekst uit `t("<pad>")` (messages) of uit `beheer-strings.ts` (beheer). Voorbeeld: `page.getByRole("button", { name: t("forms.apply.submit") })`, waarbij het pad het echte pad uit spec 07 is. Vaste Nederlandse zinnen in tests zijn niet toegestaan, behalve testinvoer zoals de naam "E2E Test". `data-testid` alleen waar een element geen toegankelijke naam heeft, en dan met een Nederlandse naam in kebab-case (`data-testid="vacature-resultaten"`).

Twee kenmerken nemen de tests over van andere specs: de layout van spec 01 heeft als eerste focusbaar element de skiplink met tekst `header.skipLink` naar `main#inhoud`, en `CtaButton` van spec 02 zet `data-slot="cta-button"` (aanname voor de doelgroottecontrole, zie §12).

`tests/routes.ts` bevat geen eigen lijst met paden: het leest `STATIC_ROUTES`, `ROUTES`, `paths` en `BEDANKT_SOORTEN` uit `lib/routes.ts` en `beroepen` uit `content/beroepen/index.ts` (spec 01). Alleen de verwijderde paden uit AC-01-02 en de beheerschermen van spec 08 staan er als vaste lijst in.

### 6.2 Copyregels in de livegang-check

De schrijfregels en hun controlescript zijn van spec 03 (`scripts/check-copy.mjs`, regels C-01 tot en met C-23, met C-01 voor het uitroepteken, C-02 voor gedachtestreepjes en losse koppeltekens, en C-09 en C-10 voor de aanspreekvorm per zone). De claims-checklist en `scripts/check-claims.mjs` zijn van spec 09; de claimvlaggen in `lib/claims.ts` van spec 03. Deze spec definieert die regels niet opnieuw, maar maakt er één poort van: `npm run check` draait beide scripts (K5 en K6 in §10.2) en neemt hun uitkomst over. Zo is er één bron per regel en één commando voor de livegang.

Wat `check-launch` zelf aan tekst controleert, is alleen wat niet in die scripts zit: placeholders (K4: `TODO`, `example.nl`, `example.com`, `00000000`, `lorem ipsum` en de oude voorbeeldslugs) en de namen "Wilk", "Versseput" en "jversseput" in sitetekst (K7, R-08 en B-26).

Uitzonderingen op K-regels staan in `scripts/check-launch.uitzonderingen.json` als `{ "regel": "K4", "bestand": "...", "patroon": "...", "reden": "...", "bevestigdDoor": "...", "datum": "JJJJ-MM-DD" }`. Spec 03 verwijst hiernaar voor bevestigde claims.

### 6.3 Uitvoer van de scripts

Alle meldingen zijn Nederlands, in volledige zinnen zonder uitroeptekens, met bestand, sleutel of route en een oplossing. Voorbeelden:

- `✗ [K5] check:copy meldt 2 fouten (C-02 in messages/nl/vacatures.json vacatures.leeg.intro). Draai npm run check:copy voor de details.`
- `· [K6] lib/claims.ts: 7 open claims. Laat Jimmy en Lorenzo bevestigen volgens de claims-checklist van spec 09.`
- `Budget overschreden: /[locale]/vacatures/[slug] laadt 248 kB JavaScript (gzip), budget 235 kB.`

## 7 SEO

De SEO-laag zelf is van spec 12 (`lib/seo.ts`, sitemap, robots, llms.txt, OG) en spec 01 (proxy). Deze sectie beschrijft de controles.

### 7.1 Automatische controles

| Bestand | Controle |
|---|---|
| `seo/sitemap.spec.ts` | `/sitemap.xml` geeft 200 en geldige XML. Voor elke `<loc>`: het pad geeft lokaal 200, de pagina heeft geen robots `noindex` en de canonical is gelijk aan de `<loc>`. Voor elke `<loc>` behalve `/vacatures/<slug>`: alternates voor nl, en en x-default. Voor `/vacatures/<slug>`: geen `xhtml:link`, wel `<lastmod>`. De sitemap bevat elke route uit `STATIC_ROUTES` met `published: true` in nl en en, de tien beroepspagina's en alle open vacatures uit `public_vacancies`. Hij bevat niet: gesloten, geplande en conceptvacatures (seed 1007 tot en met 1010 en de testvacatures), `/en/vacatures/*` (canonical naar de Nederlandse vacature, AC-01-22), `/bedankt/*`, `/beheer`, `/api`, URL's met queryparameters, en `/algemene-voorwaarden` zolang `getLegalDoc("terms").published` `false` is. |
| `seo/robots-llms.spec.ts` | `/robots.txt` bevat de regels `Disallow: /beheer` en `Disallow: /api/`, een `Sitemap:`-regel met een absolute URL op het domein van `site.url`, en blokkeert geen filterpagina's. `/llms.txt` geeft 200 met `text/plain`, noemt de vijf beroepen met links naar beide perspectieven, `/vacatures` en de contactgegevens, en bevat geen `TODO`. |
| `seo/metadata.spec.ts` | Voor elke sitemap-URL: één `<title>`, uniek binnen dezelfde taal (B-53), één `meta[name=description]`, `link[rel=canonical]` absoluut op het domein van `site.url`, `link[rel=alternate][hreflang]` voor nl, en en x-default, behalve op `/vacatures/<slug>`, waar geen enkele `hreflang`-link staat en de canonical gelijk is aan de `<loc>`; `og:title`, `og:description`, `og:image` absoluut, `twitter:card` `summary_large_image`. Titellengte tot 60 tekens en beschrijving van 120 tot 160 tekens zijn zachte controles (`expect.soft`). Het OG-beeld van een vacature en van home geeft 200 met `image/png`. |
| `seo/json-ld.spec.ts` | Home en `/contact`: één `EmploymentAgency` met naam, adres, telefoon, URL en logo. Elke gepubliceerde vacature: één `JobPosting` met de velden uit §4.4 (`seo/job-posting.test.ts`) en een `BreadcrumbList`. Beroepspagina's: `BreadcrumbList` en, als er een FAQ zichtbaar is, een `FAQPage` waarvan de vragen gelijk zijn aan de zichtbare vragen. Geen `ItemList` met alle vacatures op `/vacatures` (B-16). Alle `item`-URL's in breadcrumbs zijn absoluut. |
| `seo/noindex.spec.ts` | De regels uit §7.3, met zowel de meta-tag als, waar vermeld, de header. |
| `publiek/taal-en-proxy.spec.ts` | Crawlers krijgen geen geo-redirect (R-09). |

### 7.2 Handmatige controles

1. **Rich Results Test** (search.google.com/test/rich-results). Lokaal en op een beveiligde preview kan Google de pagina niet ophalen; gebruik dan het tabblad "Code" en plak de HTML uit `curl -s http://localhost:3100/vacatures/<slug>`. Doel: JobPosting en BreadcrumbList geldig zonder fouten. Waarschuwingen voor aanbevolen velden worden genoteerd met een besluit.
2. **Schema Markup Validator** (validator.schema.org) voor `EmploymentAgency` en `FAQPage`. De Rich Results Test toont FAQ-resultaten en dit subtype van LocalBusiness niet altijd; de validator controleert de syntaxis. Doel: nul fouten.
3. **OG-preview** met opengraph.xyz en de LinkedIn Post Inspector op de preview-URL (STAPPENPLAN J).
4. **Na de livegang**: Rich Results Test met de echte URL van één vacature, en de sitemap indienen in Search Console (STAPPENPLAN L). Na een paar dagen het rapport "Vacatures" controleren.

### 7.3 Noindex-regels die getest worden

| Route of situatie | Verwacht | Getest in |
|---|---|---|
| `/bedankt/*` | meta robots `noindex` | `seo/noindex.spec.ts`, na een formulierflow |
| `/beheer`, `/beheer/*` en `/api/*` | header `x-robots-tag: noindex, nofollow` (spec 13), plus meta robots `noindex` op beheerpagina's | `api/beveiliging.spec.ts`, `seo/noindex.spec.ts` |
| `/algemene-voorwaarden` zolang `getLegalDoc("terms").published` `false` is | meta robots `noindex, follow`, niet in sitemap, nergens gelinkt (AC-09-07) | `publiek/juridisch.spec.ts` |
| `/vacatures?beroep=schoonmaker` en elke andere filter | meta robots `noindex, follow`, canonical `/vacatures` (B-16) | `seo/noindex.spec.ts` |
| `/vacatures?pagina=2` | indexeerbaar, canonical naar zichzelf (B-16). `/vacatures?pagina=2` wordt getoetst nadat zeven testvacatures met `maakTestVacature("gepubliceerd")` zijn gemaakt (13 open, zoals AC-06-11), en daarna opgeruimd. | `seo/noindex.spec.ts` (test zonder `@readonly`) |
| gesloten vacature binnen 30 dagen | meta robots `noindex, follow`, geen JobPosting, niet in sitemap (B-15) | `vacatures/gesloten.spec.ts` |
| onbekend pad, gearchiveerde vacature | 404 met robots `noindex` | `publiek/navigatie.spec.ts`, `vacatures/gesloten.spec.ts` |
| preview op Vercel | header `x-robots-tag: noindex` (zet Vercel zelf) | handmatig in de checklist |
| productie | geen `x-robots-tag: noindex` op publieke routes | `npm run test:e2e:ro` tegen productie |

## 8 Toegankelijkheid en performance

### 8.1 WCAG 2.2 AA: controles

Norm: WCAG 2.2 niveau AA voor alle publieke routes en het beheer. Context/12 §3.4 legt daarbovenop het doel 7:1 voor lopende tekst en 44 tot 48 px voor knoppen.

| Criterium | Controle | Hoe |
|---|---|---|
| 1.1.1 Niet-tekstuele content | Elke `img` heeft `alt`; decoratieve iconen hebben `aria-hidden="true"`; het logo heeft een toegankelijke naam. | axe |
| 1.3.1 Info en relaties | Landmarks: precies één `header` (banner), één `main`, één `footer` (contentinfo); elke `nav` heeft een `aria-label` (hoofdmenu, footer, kruimelpad). Precies één h1. Koppen zonder overgeslagen niveau (h1, h2, h3 volgens B-05). Formuliervelden hebben een gekoppeld label; groepen (checkboxen voor beroepen) staan in een `fieldset` met `legend`. | axe, `koppen()` in `a11y/weergave.spec.ts` |
| 1.3.5 Doel van invoer | `autocomplete` op persoonsvelden: `given-name`, `family-name`, `email`, `tel`, `address-level2` (woonplaats), `organization` (bedrijfsnaam). | `a11y/weergave.spec.ts` |
| 1.4.1 Gebruik van kleur | Status van vacatures, formulierfouten en statuslabels in het beheer hebben altijd tekst of een icoon naast de kleur. | visueel protocol, handmatig |
| 1.4.3 en 1.4.6 Contrast | Tekst minimaal 4,5:1 (grote tekst 3:1); doel 7:1 voor lopende tekst. Tokenparen en drempels volgens `lib/contrast-pairs.json` (spec 02), onder meer `primary-foreground` op `primary` 7:1. | `design/contrast.test.ts`, axe op de gerenderde pagina |
| 1.4.4 en 1.4.10 Herschalen en reflow | Op 320 px breed geen horizontale scroll (`document.documentElement.scrollWidth` is niet groter dan `clientWidth`) op elke route. | `a11y/weergave.spec.ts` |
| 1.4.11 Contrast niet-tekst | Veldranden, focusring en informatieve iconen 3:1 of meer tegen hun achtergrond. Tokenparen en drempels volgens `lib/contrast-pairs.json` (spec 02), onder meer `primary-foreground` op `primary` 7:1. | `design/contrast.test.ts` |
| 1.4.12 Tekstafstand | Met geïnjecteerde CSS (regelhoogte 1,5, alinea-afstand 2em, letterafstand 0,12em, woordafstand 0,16em) heeft geen element in `main` met `overflow: hidden` een `scrollHeight` groter dan zijn `clientHeight`. | `a11y/weergave.spec.ts` (zacht) |
| 2.1.1 en 2.1.2 Toetsenbord | Alle functies bereikbaar met Tab, Enter, Spatie en Escape; geen toetsenbordval. | `a11y/toetsenbord.spec.ts`, §8.2 |
| 2.3.3 en reduced motion | Met `reducedMotion: "reduce"` heeft geen element een transform-animatie tijdens het scrollen; inhoud is zichtbaar. | `a11y/weergave.spec.ts` |
| 2.4.1 Blokken omzeilen | Eerste Tab-stop is een skiplink die naar het `id` van `main` wijst en zichtbaar wordt bij focus. | `a11y/toetsenbord.spec.ts` |
| 2.4.2 Paginatitel | Elke route een unieke `<title>` binnen dezelfde taal (B-53). | `seo/metadata.spec.ts` |
| 2.4.4 Linkdoel | Geen links met alleen "lees meer" of "bekijk" zonder context in de toegankelijke naam. | axe, plus een controle op een lijst verboden linkteksten uit messages |
| 2.4.7 Focus zichtbaar | Elk element dat focus krijgt, heeft een `outline` van minstens 2 px of een `box-shadow`. | `a11y/toetsenbord.spec.ts` |
| 2.4.11 Focus niet bedekt | Na Tab naar een element in `main` ligt het midden van dat element niet onder de vaste header of de vaste actiebalk (`document.elementFromPoint` geeft het element of een kind ervan). | `a11y/toetsenbord.spec.ts` |
| 2.5.8 Doelgrootte | Op 390 px is elk interactief element in header, main en footer minstens 24 bij 24 px, behalve links in lopende tekst. `button`, invoervelden (behalve `checkbox` en `radio`), `select` en elementen met `data-slot="cta-button"` zijn minstens 44 px hoog. Voor een `checkbox` of `radio` telt het omringende `<label>` (minstens 44 px hoog, spec 02 §4.5). Invoer met `sr-only` (1 bij 1 px) telt niet; dan telt het zichtbare label of vlak dat ermee verbonden is. | `a11y/weergave.spec.ts` |
| 3.1.1 en 3.1.2 Taal | `<html lang="nl">` op Nederlandse routes, `lang="en"` onder `/en`; Nederlandse vacaturetekst onder `/en` staat in een element met `lang="nl"`. | `a11y/weergave.spec.ts` |
| 3.2.6 Consistente hulp | Telefoon en WhatsApp staan op elke publieke pagina op dezelfde plek (header of vaste balk en footer). | visueel protocol |
| 3.3.1 en 3.3.3 Fouten | Foutmelding in tekst bij het veld via `aria-describedby`, veld met `aria-invalid="true"`, focus naar de eerste fout of de foutsamenvatting, melding met een oplossing. | `formulieren/*.spec.ts` |
| 3.3.7 Overbodige invoer | Geen formulier vraagt dezelfde gegevens twee keer. | handmatig bij review van spec 07 |
| 3.3.8 Toegankelijk inloggen | Plakken is toegestaan in wachtwoord en code; `autocomplete` `current-password` en `one-time-code`; geen puzzel of cognitieve test. | `beheer/login.spec.ts` |
| 4.1.2 Naam, rol, waarde | Menuknop heeft `aria-expanded` en `aria-controls`; accordeons gebruiken `details` en `summary` of de juiste ARIA. | axe, `a11y/toetsenbord.spec.ts` |
| 4.1.3 Statusberichten | Aantal resultaten na filteren, succes en fouten van formulieren staan in een `aria-live`-gebied of `role="status"` of `role="alert"`. | `vacatures/overzicht.spec.ts`, `formulieren/*.spec.ts` |

**Axe.** `a11y/axe.spec.ts` loopt over: alle sitemap-URL's in nl; per paginatype één URL in en; maximaal drie vacatures; de vier bedankpagina's na een flow; de 404-pagina; en de beheerschermen (inloggen, dashboard, vacaturelijst, vacatureformulier, sollicitatielijst en detail). Per URL op 390 en 1280 px, na `scrollDoor()`, en daarnaast in deze toestanden: mobiel menu open, filterpaneel open, formulier met fouten, gesloten vacature. Verwacht: nul bevindingen, ongeacht de ernst. Een uitsluiting mag alleen met een reden in `tests/e2e/a11y/uitsluitingen.ts` en wordt in de matrix genoemd.

**Zonder JavaScript.** Met `javaScriptEnabled: false` zijn op `/`, `/vacatures` en `/contact` de h1, de eerste alinea en de formulieren zichtbaar (geen `opacity: 0`). Het LCP-element en de h1 staan nooit in een reveal-animatie: de bestaande `Reveal` rendert server-side `opacity: 0`, waardoor tekst zonder JavaScript onzichtbaar is en de LCP pas na hydratie komt. Volledige zichtbaarheid van alle secties zonder JavaScript is een zachte controle met melding; de oplossing ligt bij `components/motion/*` (spec 02).

**Basistekst.** De berekende `font-size` van lopende tekst in `main` is minstens 17 px (B-28) en de regelhoogte minstens 1,5. Zachte controle in `a11y/weergave.spec.ts`.

### 8.2 Toetsenbordprotocol

Automatisch in `a11y/toetsenbord.spec.ts` op 1280 en 390 px, en één keer handmatig door de bouw-agent van stap 9 met een echte browser.

1. Laad `/`. Eerste Tab: de skiplink wordt zichtbaar. Enter: de focus staat in `main`.
2. Tab naar de menuknop (390 px). Enter opent het menu, `aria-expanded` wordt `true`, Tab blijft binnen het menu of loopt logisch door, Escape sluit het menu en zet de focus terug op de menuknop.
3. Op `/vacatures`: kies met het toetsenbord een beroep in het filter, bevestig, de resultaten veranderen en het aantal wordt voorgelezen via `aria-live`.
4. Open een vacature, Tab naar het sollicitatieformulier, verstuur leeg met Enter, de focus springt naar de eerste fout.
5. Op een beroepspagina: open en sluit een FAQ-vraag met Enter en Spatie.
6. Taalwissel met het toetsenbord.
7. In het beheer: inloggen, TOTP invullen en een status wijzigen zonder muis.

Bij elke stap: de focus is zichtbaar en wordt niet bedekt door de vaste header of actiebalk.

### 8.3 Schermlezerprotocol

Handmatig in stap 9, uitgevoerd door de bouw-agent met Djulan of door Djulan zelf, met resultaten per stap in de matrix (AC-14-31).

**VoiceOver op iOS Safari (werkzoekende, S-14-05).**

1. Home: de rotor toont koppen (één h1) en landmarks; de twee doelgroeproutes worden met hun doel voorgelezen.
2. `/vacatures`: filter op beroep; het aantal resultaten wordt voorgelezen; elke kaart heeft een kop met de functietitel en de plaats wordt genoemd.
3. Vacature: kenmerken worden als lijst voorgelezen; de bel- en WhatsApp-link noemen hun doel.
4. Solliciteren: elk veld heeft een label; verplichte velden worden als verplicht gemeld; na versturen met een fout wordt de fout voorgelezen; na succes wordt de bedankpagina voorgelezen met een h1.

**VoiceOver op macOS Safari (opdrachtgever).** `/werkgevers/personeel-aanvragen` invullen met fouten en daarna succesvol; de keuze voor meerdere beroepen wordt als groep met een legenda voorgelezen.

**Beheer.** Inloggen met TOTP op iOS; de statuslabels in de sollicitatielijst worden als tekst voorgelezen, niet alleen als kleur.

NVDA op Windows is optioneel als er een Windows-machine beschikbaar is.

### 8.4 Performancedoelen

| Meting | Drempel (poort) | Doel | Waar gemeten |
|---|---|---|---|
| Lighthouse mobiel Performance | 90 of hoger | 95 of hoger | `/`, één gepubliceerde vacature, `/werken-als/schoonmaker` |
| Lighthouse Accessibility | 90 of hoger | 100 | idem |
| Lighthouse Best Practices | 90 of hoger | 100 | idem |
| Lighthouse SEO | 90 of hoger | 100 | idem, alleen lokaal en op productie (zie hieronder) |
| LCP (lab, mobiel gesimuleerd) | 2,5 s of minder | 2,0 s of minder | Lighthouse |
| CLS | 0,1 of minder | 0,05 of minder | Lighthouse bij laden; Playwright tijdens laden en scrollen |
| TBT (labvervanger voor INP) | 200 ms of minder | 100 ms of minder | Lighthouse |
| INP (lab) | 200 ms of minder per interactie bij 4x CPU-vertraging | 100 ms of minder | `perf/interactie.spec.ts` |
| FCP | 1,8 s of minder | 1,5 s of minder | Lighthouse |
| Serverrespons | audit "server-response-time" geslaagd | | Lighthouse |

Lighthouse SEO op een preview van Vercel valt lager uit omdat Vercel daar `x-robots-tag: noindex` meestuurt. Meet SEO daarom lokaal met `next start` en na de livegang op productie. Andere specs mogen Lighthouse op meer pagina's informatief draaien; de poort geldt voor deze drie.

### 8.5 Budgetten

**JavaScript per route (first load, gzip).** Gemeten door `scripts/check-bundles.mjs` uit `.next/diagnostics/route-bundle-stats.json`. Nulmeting op 2 oktober 2026: het gedeelde framework (`/_not-found`) is 131 kB en de huidige JV-homepage 254 kB, vooral door framer-motion, base-ui en de ticker en marquee.

```js
const BUDGETTEN = [
  { klasse: "beheer", patroon: /^\/beheer/, maxKb: 350, alleenWaarschuwing: true },
  { klasse: "formulier", patroon: /^\/\[locale\]\/(vacatures\/\[slug\]|inschrijven|contact|werkgevers\/personeel-aanvragen)$/, maxKb: 235 },
  { klasse: "vacatureoverzicht", patroon: /^\/\[locale\]\/vacatures$/, maxKb: 215 },
  { klasse: "inhoud", patroon: /^\/\[locale\]/, maxKb: 200, doelKb: 170 },
];
```

De eerste klasse die past, telt. Wie een budget wil verhogen, past deze spec aan met een reden. Hulpmiddelen als een route te groot is, in deze volgorde: client-componenten kleiner maken of naar de server verplaatsen; beweging via `LazyMotion` en `m` uit framer-motion (spec 02 beslist); zware onderdelen met `next/dynamic` laden; `npx next experimental-analyze` gebruiken om de importketen te zien.

**CSS.** Alle CSS-bestanden in `.next/static` samen maximaal 35 kB gzip (melding, geen fout), gemeten door hetzelfde script.

**Fonts.** Twee families (B-28) via `next/font`, variabel, woff2. Op `/` maximaal vier `link[rel=preload][as=font]` en samen maximaal 150 kB aan fontbestanden bij de eerste weergave. Getest in `perf/netwerk.spec.ts`.

**Afbeeldingen.** Bij de lancering zijn er geen foto's (B-25); het LCP-element op home is tekst. Komen er foto's, dan via `next/image` met `sizes`, AVIF of WebP, maximaal 150 kB per afbeelding bij 390 px, en voor een LCP-afbeelding `fetchPriority="high"` of `loading="eager"` (in Next 16 is `priority` vervangen door `preload`, dat de docs alleen in uitzonderingen aanraden). `perf/netwerk.spec.ts` meldt elke afbeelding boven 150 kB en elke `img` zonder `width` en `height`.

**Derde partijen.** Op publieke pagina's alleen verzoeken naar de eigen origin, `/_vercel/insights/*` (Vercel Analytics, B-31) en de scripts van BotID op routes met een formulier. Lokaal geeft `/_vercel/insights/script.js` een 404; die regel is uitgezonderd. Geen Google Fonts-verzoeken, geen kaarten, geen trackers.

**Consolefouten.** Op elke route uit `tests/routes.ts` geen `console.error` en geen hydratiefouten, met dezelfde uitzondering voor `/_vercel/insights`.

### 8.6 Meetmethode

- **Lighthouse.** `npm run build`, `npx next start -p 3100`, dan `npm run lighthouse`. Het script zet `CHROME_PATH` op `chromium.executablePath()` uit `@playwright/test` en draait per pagina drie keer `npx --yes lighthouse <url> --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo --output=json --output=html --chrome-flags="--headless=new"`. Het neemt de mediaan op Performance en schrijft naar `.playwright-mcp/lighthouse/<JJJJ-MM-DD>/<pagina>-<run>.report.{json,html}`. De vacature-URL komt uit de sitemap. De user-agent van Lighthouse valt onder de botregel van de proxy, dus zonder geo-redirect.
- **Interactie (INP-lab).** `perf/interactie.spec.ts` zet via CDP `Emulation.setCPUThrottlingRate` op 4 en meet met een `PerformanceObserver` voor `event` (`durationThreshold: 16`) de langste interactie bij: menu openen op 390 px, een filter kiezen, een FAQ-vraag openen en typen in een veld.
- **CLS.** Dezelfde test telt `layout-shift`-entries zonder `hadRecentInput` tijdens laden en `scrollDoor()` op `/`, `/vacatures`, een vacature en een beroepspagina.
- **Velddata.** Na de livegang PageSpeed Insights; CrUX-data ontbreekt de eerste maanden voor een nieuwe site. Vercel Speed Insights zit niet in fase 1 (§12).

### 8.7 Visueel protocol

Doel: Djulan en de bouw-agents beoordelen elke pagina op 390, 768, 1280 en 1440 px voordat een stap af is. Screenshots zijn beoordelingsmateriaal, geen assertie.

**Batch met `npm run test:visueel`.** `tests/visual/visueel.spec.ts` loopt over de routes uit `tests/routes.ts` (nl volledig, en per paginatype één, drie vacatures, lokaal een gesloten testvacature, de 404-pagina, en met de beheersessie de beheerschermen op 390 en 1280 px). Per route en per breedte:

1. `page.setViewportSize({ width, height: 900 })`, `goto`, wachten op `load` en `document.fonts.ready`.
2. `scrollDoor(page)`: eerst helemaal doorscrollen, anders staan secties met reveal-animaties nog op onzichtbaar (CLAUDE.md).
3. Screenshot van de hele pagina naar `.playwright-mcp/visueel/<JJJJ-MM-DD>/<route-als-bestandsnaam>@<breedte>.png`, bijvoorbeeld `vacatures__glazenwasser-den-haag-1001@390.png`.
4. Extra toestanden op 390 px: mobiel menu open, filterpaneel open, formulier met fouten, bedankpagina.

**Interactief met Playwright MCP.** Een agent mag dezelfde stappen doen met `browser_resize`, `browser_navigate`, `browser_evaluate` (doorscrollen met `window.scrollBy` en een pauze) en `browser_take_screenshot` met `fullPage: true` en een `filename` zonder map, zodat het bestand in `.playwright-mcp/` landt. Nergens anders, ook niet in `/screenshots/`.

**Beoordeling.** De agent bekijkt elke screenshot en noteert per pagina in de matrix wat klopt en wat niet, met de breedte. Vaste punten: geen horizontale scroll; header bedekt geen inhoud; doelgroeproutes boven de vouw op 390 px; geen tekst die uit kaarten loopt; consistente afstanden; blauw alleen als accent via tokens; geen grijze JV-restanten; lege en gesloten staten zien er bedoeld uit; status niet alleen met kleur; focusring zichtbaar na Tab.

## 9 21st.dev-opdracht voor sub-agents

Niet van toepassing. Deze module levert geen zichtbare UI: ze levert configuratie, tests, scripts, protocollen en de acceptatiematrix. Er is dus geen plek in de interface waarvoor een sub-agent via `mcp__magic__search` of `mcp__magic__get_inspiration` een element zou kiezen, en `get_component` wordt in deze module nooit aangeroepen. Wel geldt het omgekeerde: elk component dat andere modules via 21st.dev ophalen, valt na aanpassing onder deze suites. Axe, de doelgroottecontrole, de controle op reduced motion, de kleurregel K14 en het JavaScript-budget per route toetsen ook die componenten, zodat een element van 21st.dev pas blijft staan als het binnen de tokens, de toegankelijkheidseisen en het budget past.

## 10 Bouwopdracht

### 10.1 Stap A: testframe (in bouwstap 1, na `.env.local` en de migraties)

> **Notitie.** Stap A en B zijn niet in bouwstap 1 en 3 gebouwd; de bouw-agent van bouwstap 3b voert ze uit (00 §1a).

1. Installeer de devDependencies uit §4.2 en draai `npx playwright install chromium webkit`.
2. Maak `vitest.config.mts`, `playwright.config.ts`, `tests/unit/stubs/server-only.ts` (een leeg `export {}`) en het ESLint-blok voor `tests/**`.
3. Voeg de scripts uit §4.2 toe aan `package.json`, inclusief de nieuwe `verify`.
4. Maak `scripts/lib/testomgeving.mjs`, `tests/e2e/toegestane-projecten.json` met de ref van `groos-dev`, `scripts/e2e-voorbereiden.mjs`, `scripts/e2e-opruimen.mjs`, `tests/e2e/global-teardown.ts` en `tests/e2e/beheer.setup.ts`. De beheer-setup wordt pas groen als spec 08 de inlogpagina heeft; tot dan staat hij op `test.skip` met een `TODO bouwstap 7`.
5. Maak de helpers uit §4.3 en de integratietests `rls.test.ts`, `storage.test.ts` en `database.test.ts`. `tests/routes.ts` volgt in bouwstap 3, zodra `lib/routes.ts` van spec 01 bestaat.

   5a. Maak `scripts/check-bundles.mjs`, `scripts/lighthouse.mjs` en `scripts/check-acceptatie.mjs` volgens §4.5, zodat ze vanaf bouwstap 1 bestaan (spec 04 tot en met 07 draaien ze in stap 4 tot en met 7).

6. Maak `docs/acceptatie/acceptatiematrix.md` uit het sjabloon in §11.2 met een rij voor elk AC-id uit spec 01 tot en met 14: volgens §11.3, en voor 02, 04 tot en met 08, 11 en 12 volgens de kolom Bewijs van §3.7 en de stap uit §3.6 (bouwstap 3b).
7. Verifieer: `npm run verify`, `npm run test`, `npm run test:integration`, `node scripts/e2e-voorbereiden.mjs`. Test de bewaking door tijdelijk een andere ref in te vullen en te zien dat het script weigert (AC-14-04).

### 10.2 Stap B: uitbreiding van `scripts/check-launch.mjs` (in bouwstap 3)

> **Notitie.** Stap A en B zijn niet in bouwstap 1 en 3 gebouwd; de bouw-agent van bouwstap 3b voert ze uit (00 §1a).

Het script blijft één ingang met dezelfde eerste regel en dezelfde vlag `--warn`; er komt `--json` bij. TypeScript-bestanden leest het met `ts.createSourceFile` uit het pakket `typescript` waar een regex niet volstaat (K2, K12, K13). Externe scripts draait het met `node:child_process` en dezelfde werkmap. De regels:

| Id | Controle | Ernst |
|---|---|---|
| K1 | Sleutelpariteit nl en en (bestaande regel), plus: geen lege waarden en geen namespaces `services`, `werkgebied`, `service` of `beheer` (AC-03-03). `app/beheer/_strings.ts`, de juridische `CONTENT`-blokken en de inline teksten van `global-error.tsx` en `global-not-found.tsx` vallen buiten deze spiegelcontrole. | probleem |
| K2 | Beroepenregister in plaats van `content/services`: `beroepen` in `content/beroepen/index.ts` bevat precies de vijf id's met `slugWerkzoekende` en `slugWerkgever` uit 00 §4.2 (constante `VERWACHTE_BEROEPEN` in het script); per id een `content/beroepen/<id>.ts` met `nl` en `en`; per id de messages-sleutels uit `BEROEP_SLEUTELS` (paden volgens spec 05). | probleem |
| K3 | Verwijderlijst van spec 01: `content/services`, `content/werkgebied`, `components/werkgebied`, `app/[locale]/diensten`, `app/[locale]/werkgebied`, `components/ui/button.tsx` en `app/[locale]/privacybeleid` bestaan niet meer. | probleem |
| K4 | Placeholders (bestaande regel uitgebreid met `example.com` en `lorem ipsum`); de scan krijgt er `emails` bij. `supabase/`, `tests/`, `scripts/`, `docs/` en `context/` vallen erbuiten. TODO-regels in `lib/claims.ts` telt K6, niet K4. | probleem |
| K5 | Copyregels: draait `node scripts/check-copy.mjs` (spec 03). Exitcode 1 geeft één probleem met het aantal fouten en de eerste vijf meldingen; waarschuwingen worden notities. | probleem, notitie |
| K6 | Claims: telt de regels met `TODO` in `lib/claims.ts` en meldt `lib/claims.ts: <n> open claims` (AC-03-12); draait `node scripts/check-claims.mjs --strict` (spec 09) en geeft een probleem bij exitcode 1. | notitie, probleem |
| K7 | Geen "Wilk", "Versseput" of "jversseput" in `messages/`, `content/`, `lib/site.ts`, `emails/` en de juridische pagina's. | probleem |
| K8 | Verplichte bestanden: het logo waar `site.logo` naar wijst; `app/[locale]/not-found.tsx`, `error.tsx`, `app/global-not-found.tsx`, `app/global-error.tsx`; `app/robots.ts`, `app/sitemap.ts`, `app/llms.txt/route.ts`; `app/icon.tsx` of een icoonbestand; `lib/routes.ts`; `app/beheer/_strings.ts`; `content/beroepen/index.ts`; minstens één migratie in `supabase/migrations/`; `supabase/seed.sql`; `vercel.ts` of `vercel.json`; `.env.example`; `playwright.config.ts`; `vitest.config.mts`. Ontbrekende `.env.local` is een notitie die naar spec 13 verwijst. | probleem, notitie |
| K9 | Env vars: `.env.example` bevat de zes vaste variabelen uit 00 §4.5 als `NAAM=`-regels; de optionele en shellvariabelen mogen als regel of commentaarregel staan; elke naam uit `process.env.X` in `app`, `components`, `lib`, `emails`, `i18n`, `proxy.ts`, `instrumentation-client.ts` en `next.config.mjs` staat in `.env.example` of is een systeemvariabele uit spec 13 §5.1 (AC-13-12); nergens staat `web3forms` of `WEB3FORMS` (B-13). | probleem |
| K10 | Geheimen (spec 13, F5): `git ls-files` bevat geen `.env`-bestand behalve `.env.example`, en geen gevolgd bestand bevat `sb_secret_`. | probleem |
| K11 | De eerste matcher sluit `beheer`, `api`, `feeds` en het BotID-voorvoegsel `149e9513-01fa-4fb0-aad4-566afd725d1b` uit; de tweede is exact `/beheer/:path*`; `proxy()` roept voor `/beheer` alleen `beheerProxy()` aan, geen next-intl, en zet geen `NEXT_LOCALE`. | probleem |
| K12 | Elke `page.tsx` onder `app/[locale]/` bevat `pageMetadata(`, `vacancyMetadata(` of `vacancyListMetadata(`; uitgezonderd `app/[locale]/[...rest]/page.tsx` en `app/[locale]/stijlgids/page.tsx`; geen `openGraph:` in een `page.tsx` (R-09). | probleem |
| K13 | Geen import van `next/link` in `app/[locale]/**` of `components/**`, behalve `components/beheer/**`. Het beheer valt buiten i18n en gebruikt wel `next/link`. | probleem |
| K14 | Kleuren alleen via tokens: geen `#` met drie tot acht hexcijfers op een woordgrens, geen `rgb(`, `rgba(`, `hsl(`, `hsla(` of `oklch(` in `.ts` en `.tsx` onder `app/` en `components/`. Uitgezonderd: `app/globals.css`, `lib/brand.ts`, `app/icon.tsx`, `app/apple-icon.tsx`, `app/**/opengraph-image.tsx`, `app/**/twitter-image.tsx`, `components/brand/**` en `emails/**`. | probleem |
| K15 | Juridische pagina's (`privacyverklaring`, `cookieverklaring`, `algemene-voorwaarden`, `klachtenregeling`) hebben in `CONTENT` een `nl`- en een `en`-blok; elk bestand in `content/pages/` heeft beide blokken (B-03). | probleem |

De oude registratieregel voor `content/services` en de notitie over Web3Forms bij `.env.local` vervallen. Zolang `scripts/check-copy.mjs` of `scripts/check-claims.mjs` nog niet bestaat (vóór bouwstap 3b), geven K5 en K6 een notitie in plaats van een probleem. De bouw-agent schrijft in dezelfde stap `tests/unit/scripts/check-launch.test.ts` met per regel één mini-repo die precies dat probleem bevat; voor K5 en K6 staat in de mini-repo een stubscript dat met exitcode 1 eindigt, en voor K10 een mini-repo met `git init` en een gevolgd `.env`. Voor K9, K11 en K12 toetst de test de regels hierboven precies:

- K9: een `.env.example` waarin één van de zes vaste variabelen ontbreekt of alleen als commentaarregel staat, geeft een probleem. Een `.env.example` met de zes als `NAAM=`-regels, `EMAIL_FROM` als regel en `E2E_BASE_URL` en `VERCEL_AUTOMATION_BYPASS_SECRET` als commentaarregel geeft er geen.
- K11: vier mini-repo's met elk één fout geven elk een probleem: een eerste matcher die `feeds` niet uitsluit, een eerste matcher zonder het BotID-voorvoegsel, een tweede matcher anders dan `/beheer/:path*`, en een `proxy()` die voor `/beheer` next-intl aanroept of `NEXT_LOCALE` zet. Een `proxy.ts` volgens de regel geeft geen probleem.
- K12: een `page.tsx` onder `app/[locale]/` zonder `pageMetadata(`, `vacancyMetadata(` of `vacancyListMetadata(` geeft een probleem, net als een `page.tsx` met `openGraph:`. `app/[locale]/[...rest]/page.tsx` en `app/[locale]/stijlgids/page.tsx` zonder aanroep geven er geen, en een pagina met alleen `vacancyMetadata(` of `vacancyListMetadata(` ook niet.

### 10.3 Tests per bouwstap

Elke bouw-agent schrijft in zijn stap de tests uit §3.6 voor zijn module, met het AC-id van zijn spec vooraan in de titel. Hij gebruikt de helpers en de mappen uit §4; nieuwe helpers komen in `tests/e2e/helpers/` met een type. Hij voegt nieuwe routes toe aan `tests/routes.ts`. Een test die op een later te bouwen module wacht, krijgt `test.fixme` met de stap waarin hij groen wordt.

### 10.4 Stap C: volledige kwaliteitsronde (bouwstap 9)

1. Vul ontbrekende tests aan tot elke AC met testsoort `unit`, `integratie`, `e2e`, `e2e-ro` of `a11y` een test heeft (`npm run check:acceptatie`).
2. Draai in deze volgorde en los op tot alles groen is: `npm run verify`; `npm run test:integration`; `npm run test:e2e`; `npm run test:a11y`; `npm run build && npx next start -p 3100` en in een tweede terminal `npm run lighthouse`; `npm run check:bundles`; `npm run test:visueel` met beoordeling; `npm run check -- --warn`.
3. Voer het toetsenbordprotocol (§8.2) en het schermlezerprotocol (§8.3) uit en noteer de uitkomst.
4. Controleer met de Supabase MCP (`get_advisors`, type `security` en `performance`) dat `groos-dev` geen fouten heeft.
5. Werk de matrix bij en zet elke rij op `groen`, `afgetekend` of `vervallen` met reden.

### 10.5 GitHub Actions

De workflow `.github/workflows/verify.yml` is van spec 13 (typecheck na `next typegen`, lint, `config:check` en `npm run check -- --warn`). Deze spec voegt na `npm run lint` één stap toe:

```yaml
      - run: npm run test
```

Motivatie: BOUWINSTRUCTIE §6 en AC-13-14 werken met een pull request per bouwstap, en Vercel bouwt elke pull request al als preview. De eenheidstests vragen geen geheimen of database en duren seconden, dus ze horen in dezelfde snelle poort. E2e, integratietests en Lighthouse draaien niet in CI (§3.2): ze hebben `groos-dev` en geheimen nodig. Na de livegang verandert de laatste stap van spec 13 in `npm run check` zonder `--warn`. Een extra job met `npm run test:e2e:ro` tegen de preview-URL (bypass-header uit spec 13, C4) is mogelijk maar niet in fase 1; die beslissing ligt bij Djulan (§12).

### 10.6 Pre-livegangchecklist

De bouw-agent kopieert deze lijst naar `docs/acceptatie/acceptatiematrix.md` onder "Livegang" en vinkt af met naam en datum. De infrastructuurstappen zelf beschrijft spec 13; hier staat alleen wat vóór het omzetten van de DNS bewezen moet zijn.

**Code en tests**
- [ ] `npm run verify`, `npm run test:integration`, `npm run test:e2e` en `npm run test:a11y` groen op localhost tegen `groos-dev`.
- [ ] `npm run check` (zonder `--warn`) geeft exit 0: geen `TODO`, geen placeholders, nul onbevestigde claimnotities.
- [ ] `npm run check:bundles` en `npm run check:acceptatie -- --livegang` geven exit 0.
- [ ] De workflow `verify` (met de stap `npm run test`) is groen op de laatste commit van `main`.

**Inhoud en claims**
- [ ] Jimmy heeft NAW, telefoonnummers, KvK, btw en openingstijden bevestigd (B-21 tot en met B-26); elke vlag in `lib/claims.ts` is bevestigd of afgewezen en vastgelegd in `docs/compliance/claims-status.md` (spec 03 en 09).
- [ ] Algemene voorwaarden: tekst geleverd en gelinkt, of route bewust niet gelinkt en niet in de sitemap (B-11).
- [ ] Privacyverklaring en cookieverklaring zijn nagekeken (spec 09).

**Data en backend (spec 10 en 13)**
- [ ] Het productieproject heeft dezelfde migraties als `groos-dev` (`supabase migration list` toont geen verschil) en geen seeddata.
- [ ] Supabase-advisors op productie zonder fouten; RLS staat aan op alle tabellen.
- [ ] Jimmy en Lorenzo hebben elk een account met TOTP en hebben één keer ingelogd.
- [ ] Het e2e-beheertestaccount bestaat niet in productie.
- [ ] Back-ups staan aan volgens het abonnement uit spec 13.
- [ ] Cron-jobs staan in Vercel en `CRON_SECRET` is gezet; één handmatige aanroep zonder geheim geeft 401.

**E-mail (spec 11 en 13)**
- [ ] Het Resend-domein `mail.groospersoneelsdiensten.nl` is geverifieerd met SPF, DKIM en DMARC.
- [ ] Elk formulier is op de preview één keer verstuurd; bevestiging en interne melding komen aan op het adres van `EMAIL_DEV_TO` met `[test voor ...]` in het onderwerp; testrecords zijn daarna verwijderd.
- [ ] De Auth-mails (uitnodiging en wachtwoord) komen aan via Resend SMTP.

**SEO**
- [ ] `site.url` in `lib/site.ts` staat op `https://www.groospersoneelsdiensten.nl` (B-02).
- [ ] Rich Results Test met code-invoer: JobPosting en BreadcrumbList zonder fouten; Schema Markup Validator: EmploymentAgency en FAQPage zonder fouten.
- [ ] OG-preview gecontroleerd met opengraph.xyz en de LinkedIn Post Inspector.
- [ ] `/sitemap.xml`, `/robots.txt` en `/llms.txt` handmatig nagelopen.

**Toegankelijkheid en performance**
- [ ] Lighthouse mobiel op de drie pagina's haalt de drempels uit §8.4 (lokaal), met rapporten in `.playwright-mcp/lighthouse/`.
- [ ] Toetsenbord- en schermlezerprotocol afgetekend.
- [ ] Visueel protocol op vier breedtes afgetekend door Djulan.

**Infra (spec 13)**
- [ ] Repo privé onder `jimmyv3-v3`, Vercel-project in het account van Jimmy met de Git-integratie, env vars in Production en Preview.
- [ ] `npm run test:e2e:ro` groen tegen de preview-URL.
- [ ] Beheer en acceptatie: Jimmy heeft het scenario S-14-07 op zijn eigen telefoon uitgevoerd op de preview.

**Na het omzetten van de DNS**
- [ ] `E2E_BASE_URL=https://www.groospersoneelsdiensten.nl npm run test:e2e:ro` groen, inclusief de controle dat productie geen `x-robots-tag: noindex` stuurt.
- [ ] Lighthouse op productie voor de drie pagina's; Rich Results Test met de echte URL van een vacature.
- [ ] Search Console en Bing volgens STAPPENPLAN L.

### 10.7 Commando's in één overzicht

| Doel | Commando |
|---|---|
| Snelle controle na elke wijziging | `npm run verify` |
| Eén suite tijdens het bouwen | `npx playwright test tests/e2e/vacatures --project=chromium` |
| Iteratie op uiterlijk en tekst | `npm run test:e2e:smoke` en `npm run test:visueel` |
| Volledige ronde | `npm run test:e2e`, `npm run test:a11y`, `npm run lighthouse`, `npm run check:bundles` |
| Tegen preview of productie | `E2E_BASE_URL=<url> npm run test:e2e:ro` |
| Testdata weghalen | `npm run test:e2e:opruimen` |
| Matrix controleren | `npm run check:acceptatie` |

## 11 Acceptatiecriteria

### 11.1 Criteria van deze module

1. **AC-14-01** (E-14-01) `npm run test` geeft exit 0; `package.json` bevat de scripts en de vier devDependencies uit §4.2 en geen andere testpakketten; `npm run verify` draait de eenheidstests.
2. **AC-14-02** (E-14-02) De eenheidstestbestanden uit §4.4 bestaan en slagen met minstens de gevallen uit die tabel.
3. **AC-14-03** (E-14-03, E-14-04, E-14-05) `npm run test:e2e` geeft op localhost tegen `groos-dev` exit 0, met rapport in `.playwright-mcp/playwright-report/index.html`.
4. **AC-14-04** (E-14-05) Met een projectref die niet in `tests/e2e/toegestane-projecten.json` staat, stopt `npm run test:e2e` met "Testomgeving geweigerd" en exit 1, zonder één geschreven record.
5. **AC-14-05** (E-14-05) Na een volledige run meldt `npm run test:e2e:opruimen` 0 resterende e2e-rijen in `applications`, `staff_requests`, `contact_messages`, 0 vacatures met titel `E2E ` en 0 e2e-objecten in `cvs`.
6. **AC-14-06** (E-14-04) `beheer.setup.ts` logt in met wachtwoord en `totp()` en bewaart `.playwright-mcp/.auth/beheer.json`; een sessie zonder TOTP-stap komt niet op `/beheer`.
7. **AC-14-07** (E-14-06) `a11y/axe.spec.ts` meldt nul bevindingen (tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`) op alle routes en toestanden uit §8.1, op 390 en 1280 px.
8. **AC-14-08** (E-14-06) Elke route uit `tests/routes.ts` heeft precies één `h1` en geen overgeslagen kopniveau.
9. **AC-14-09** (E-14-06) Op `/`, `/vacatures`, een vacature en `/contact`: eerste Tab-stop is de skiplink naar `main`; Escape sluit het menu en zet de focus op de menuknop; elk element met focus heeft een outline van 2 px of meer of een box-shadow en ligt niet onder een vaste balk.
10. **AC-14-10** (E-14-06) Op 390 px is elk interactief element in header, main en footer minstens 24 bij 24 px, behalve links in lopende tekst. `button`, invoervelden (behalve `checkbox` en `radio`), `select` en elementen met `data-slot="cta-button"` zijn minstens 44 px hoog. Voor een `checkbox` of `radio` telt het omringende `<label>` (minstens 44 px hoog, spec 02 §4.5). Invoer met `sr-only` (1 bij 1 px) telt niet; dan telt het zichtbare label of vlak dat ermee verbonden is.
11. **AC-14-11** (E-14-06) Op 320 px is `scrollWidth` niet groter dan `clientWidth` op elke route uit `tests/routes.ts`.
12. **AC-14-12** (E-14-06) Met `reducedMotion: "reduce"` animeert geen transform tijdens scrollen; zonder JavaScript zijn h1, eerste alinea en formulieren op `/`, `/vacatures` en `/contact` zichtbaar.
13. **AC-14-13** (E-14-06) `<html lang>` is `nl` op Nederlandse routes en `en` onder `/en`; op `/en/vacatures/<slug>` staat de vacaturetekst in een element met `lang="nl"`.
14. **AC-14-14** (E-14-06) `design/contrast.test.ts` slaagt met alle paren uit `lib/contrast-pairs.json`, en `lib/brand.ts` is gelijk aan de tokens.
15. **AC-14-15** (E-14-07) `npm run lighthouse` geeft voor `/`, één vacature en `/werken-als/schoonmaker` een mediaan van 90 of hoger in alle vier categorieën, met LCP 2,5 s of minder, CLS 0,1 of minder en TBT 200 ms of minder; rapporten in `.playwright-mcp/lighthouse/<datum>/`.
16. **AC-14-16** (E-14-07) `npm run check:bundles` na `npm run build` geeft exit 0 met de budgetten uit §8.5.
17. **AC-14-17** (E-14-07) `perf/interactie.spec.ts` meet bij 4x CPU-vertraging 200 ms of minder per interactie en een CLS van 0,1 of minder bij laden en scrollen.
18. **AC-14-18** (E-14-07) `perf/netwerk.spec.ts` slaagt: maximaal vier fontpreloads en 150 kB fonts op `/`, alleen toegestane origins, geen afbeelding boven 150 kB, geen consolefouten.
19. **AC-14-19** (E-14-08) `seo/sitemap.spec.ts` slaagt: elke `<loc>` geeft 200, zonder noindex, met canonical gelijk aan zichzelf en drie hreflang-alternates, behalve `/vacatures/<slug>`: daar geen `xhtml:link`, wel `<lastmod>`; de uitgesloten URL's uit §7.1 ontbreken.
20. **AC-14-20** (E-14-08) `/robots.txt` bevat de regels `Disallow: /beheer` en `Disallow: /api/` en een absolute `Sitemap:`-regel; `/llms.txt` is `text/plain`, noemt de vijf beroepen en bevat geen `TODO`.
21. **AC-14-21** (E-14-08) `seo/metadata.spec.ts` slaagt voor elke sitemap-URL volgens §7.1: `link[rel=alternate][hreflang]` voor nl, en en x-default, behalve op `/vacatures/<slug>`, waar geen enkele `hreflang`-link staat en de canonical gelijk is aan de `<loc>`.
22. **AC-14-22** (E-14-08, E-14-14) De noindex-regels uit §7.3 gelden, met als ijkpunten `/bedankt/sollicitatie`, `/beheer`, `/vacatures?beroep=schoonmaker`, `/vacatures?pagina=2`, `/algemene-voorwaarden` en de testvacature "gesloten recent". `/vacatures?pagina=2` wordt getoetst nadat zeven testvacatures met `maakTestVacature("gepubliceerd")` zijn gemaakt (13 open, zoals AC-06-11), en daarna opgeruimd.
23. **AC-14-23** (E-14-08) `seo/json-ld.spec.ts` slaagt: `EmploymentAgency` op `/` en `/contact`, `JobPosting` met de velden uit §4.4 en `BreadcrumbList` op elke gepubliceerde vacature, `FAQPage` alleen bij een zichtbare FAQ met dezelfde vragen.
24. **AC-14-24** (E-14-08) Rich Results Test met code-invoer: nul fouten voor JobPosting en BreadcrumbList op vacature 1001; Schema Markup Validator: nul fouten voor EmploymentAgency op `/` en FAQPage op een beroepspagina. Uitslag in de matrix.
25. **AC-14-25** (E-14-08) `/` met `x-vercel-ip-country: DE` geeft met een gewone user-agent 307 naar `/en` en met de user-agent van Googlebot 200 zonder `location`.
26. **AC-14-26** (E-14-09) `scripts/check-launch.test.ts` bewijst dat K1 tot en met K15 elk hun geval vinden; `npm run check -- --json` geeft geldige JSON; bij de livegang geeft `npm run check` exit 0.
27. **AC-14-27** (E-14-10) `npm run test:visueel` maakt per route uit §8.7 screenshots op 390, 768, 1280 en 1440 px in `.playwright-mcp/visueel/<datum>/` en nergens anders; op `/` bij 390 px staan beide doelgroeproutes binnen de eerste 844 px.
28. **AC-14-28** (E-14-14) `integration/rls.test.ts` en `storage.test.ts` slagen; `api/cron.spec.ts` geeft 401 zonder geheim en 200 met; `api/beveiliging.spec.ts` vindt de headers uit §4.4.
29. **AC-14-29** (E-14-12) `.github/workflows/verify.yml` bevat de stap `npm run test`; de workflow slaagt op een schone pull request en faalt als een eenheidstest faalt.
30. **AC-14-30** (E-14-11) `docs/acceptatie/acceptatiematrix.md` volgt §11.2 en `npm run check:acceptatie` geeft exit 0.
31. **AC-14-31** (E-14-06) Het schermlezerprotocol (§8.3) is uitgevoerd met VoiceOver op iOS en macOS, met per stap "goed" of een bevinding en oplossing in de matrix.
32. **AC-14-32** (E-14-13) De pre-livegangchecklist (§10.6) is volledig afgevinkt met naam en datum vóór het omzetten van de DNS.
33. **AC-14-33** (E-14-03) De e2e-suite dekt per formulier een geslaagde inzending met record en twee rijen in `email_log`, een inzending met gekoppelde fouten, en een inzending zonder JavaScript (solliciteren zonder cv).
34. **AC-14-34** (E-14-03) De e2e-suite dekt filters (met de verwachtingen van AC-10-16), paginering over twee pagina's, detail, 308 bij een afwijkende slug, de gesloten staat van een testvacature en 404 voor gesloten oude, geplande en conceptvacatures.
35. **AC-14-35** (E-14-04) De e2e-suite dekt inloggen met TOTP, de levenscyclus van een vacature met het publieke effect van elke stap en het afhandelen van een sollicitatie, het Jimmy-scenario ook op 390 px.

### 11.2 Acceptatiematrix: sjabloon

Het levende bestand is `docs/acceptatie/acceptatiematrix.md`. Het heeft drie delen.

**Deel 1, matrix.** Eén rij per AC-id uit alle specs.

| AC-id | Spec | Kern (hooguit tien woorden) | Testsoort | Bestand of protocol | Bouwstap | Status | Afgetekend |
|---|---|---|---|---|---|---|---|
| AC-nn-xx | nn | | `unit`, `integratie`, `e2e`, `e2e-ro`, `a11y`, `check`, `visueel` of `handmatig` | pad naar test of naam van protocol | 1 tot en met 10 | `open`, `groen`, `rood`, `afgetekend` of `vervallen` | naam en datum, of reden bij `vervallen` |

Betekenis van de testsoorten: `unit` en `integratie` zijn Vitest; `e2e` is Playwright en schrijft data; `e2e-ro` is Playwright met `@readonly`; `a11y` is Playwright met axe of een toetsenbordtest; `check` is een script (`check-launch`, `check-bundles`, `lighthouse`, `check-acceptatie`); `visueel` is het protocol uit §8.7; `handmatig` is een protocol met aftekening door een persoon.

**Deel 2, bouwstappenlogboek.** Per stap: datum, bouw-agent, uitgevoerde commando's met uitkomst, open punten.

**Deel 3, handmatige protocollen.** Uitkomst van het toetsenbordprotocol, het schermlezerprotocol, het Jimmy-scenario, de Rich Results Test en de spamtest, en daarna de pre-livegangchecklist.

### 11.3 Ingevulde rijen

De koppeling van R-eisen aan modules en AC's staat in spec 00 §8; deze tabellen gaan per AC.

**Spec 14.**

| AC-id | Kern | Testsoort | Bestand of protocol | Stap |
|---|---|---|---|---|
| AC-14-01 | Testframe en scripts aanwezig | check | `npm run test`, `package.json` | 1 |
| AC-14-02 | Eenheidstests uit §4.4 slagen | unit | `tests/unit/**` | 1 tot en met 9 |
| AC-14-03 | Volledige e2e-suite groen | e2e | `npm run test:e2e` | 9 |
| AC-14-04 | Bewaking weigert verkeerd project | check | `scripts/e2e-voorbereiden.mjs` | 1 |
| AC-14-05 | Geen e2e-data na een run | check | `scripts/e2e-opruimen.mjs` | 6 en 9 |
| AC-14-06 | Beheerlogin met TOTP in setup | e2e | `beheer.setup.ts`, `beheer/login.spec.ts` | 7 |
| AC-14-07 | Axe zonder bevindingen | a11y | `a11y/axe.spec.ts` | 3 tot en met 9 |
| AC-14-08 | Eén h1 en koppenvolgorde | a11y | `a11y/weergave.spec.ts` | 3 tot en met 9 |
| AC-14-09 | Skiplink, menu, focus zichtbaar en onbedekt | a11y | `a11y/toetsenbord.spec.ts` | 4 en 9 |
| AC-14-10 | Doelgrootte 24 en 44 px | a11y | `a11y/weergave.spec.ts` | 4 en 9 |
| AC-14-11 | Reflow op 320 px | a11y | `a11y/weergave.spec.ts` | 4 en 9 |
| AC-14-12 | Reduced motion en zonder JavaScript | a11y | `a11y/weergave.spec.ts` | 4 en 9 |
| AC-14-13 | Taalattributen | a11y | `a11y/weergave.spec.ts` | 5 en 9 |
| AC-14-14 | Tokencontrast en brand.ts gelijk | unit | `design/contrast.test.ts` | 2 |
| AC-14-15 | Lighthouse drie pagina's 90 of hoger | check | `npm run lighthouse` | 4, 5 en 9 |
| AC-14-16 | JavaScript-budget per route | check | `npm run check:bundles` | 9 |
| AC-14-17 | INP-lab en CLS | e2e-ro | `perf/interactie.spec.ts` | 9 |
| AC-14-18 | Fonts, derde partijen, consolefouten | e2e-ro | `perf/netwerk.spec.ts` | 9 |
| AC-14-19 | Sitemap compleet en schoon | e2e-ro | `seo/sitemap.spec.ts` | 3 en 5 |
| AC-14-20 | Robots en llms.txt | e2e-ro | `seo/robots-llms.spec.ts` | 3 |
| AC-14-21 | Metadata per sitemap-URL | e2e-ro | `seo/metadata.spec.ts` | 5 |
| AC-14-22 | Noindex-regels | e2e | `seo/noindex.spec.ts`, `api/beveiliging.spec.ts` | 5 en 7 |
| AC-14-23 | JSON-LD per paginatype | e2e-ro | `seo/json-ld.spec.ts` | 5 |
| AC-14-24 | Rich Results Test en validator | handmatig | §7.2 | 5 en 10 |
| AC-14-25 | Geen geo-redirect voor crawlers | e2e-ro | `publiek/taal-en-proxy.spec.ts` | 3 |
| AC-14-26 | Livegang-check K1 tot en met K15 | unit | `scripts/check-launch.test.ts` | 3 |
| AC-14-27 | Visueel protocol op vier breedtes | visueel | `npm run test:visueel` | 2 tot en met 9 |
| AC-14-28 | RLS, storage, cron en headers | integratie | `integration/*.test.ts`, `api/*.spec.ts` | 1, 7 |
| AC-14-29 | Eenheidstests in de workflow `verify` | check | `.github/workflows/verify.yml` | 1 |
| AC-14-30 | Matrix compleet | check | `npm run check:acceptatie` | 9 |
| AC-14-31 | Schermlezerprotocol | handmatig | §8.3 | 9 |
| AC-14-32 | Pre-livegangchecklist | handmatig | §10.6 | 10 |
| AC-14-33 | Formulieren gedekt | e2e | `formulieren/*.spec.ts` | 6 |
| AC-14-34 | Vacaturebank gedekt | e2e | `vacatures/*.spec.ts` | 5 |
| AC-14-35 | Beheer gedekt | e2e | `beheer/*.spec.ts` | 7 |

**Specs die er bij het schrijven al waren (01, 03, 09, 10, 13), plus losse rijen voor 07 en 08.** Gegroepeerd; in het levende bestand krijgt elk id een eigen rij. Waar een AC in zijn eigen spec met `curl` of SQL staat, mag de test het als code uitvoeren; de uitkomst moet dezelfde zijn.

| AC-id's | Testsoort | Bestand of protocol | Stap |
|---|---|---|---|
| AC-01-01 tot en met 03, 26 | e2e-ro | `publiek/navigatie.spec.ts` | 3 |
| AC-01-04, 24, 30, 33 | check | K1, K3, K9 en de grep- en find-commando's uit spec 01 | 3 |
| AC-01-05 | check | uitvoer van `next build` in het bouwstappenlogboek | 3 |
| AC-01-06 tot en met 09, 21 | e2e-ro | `publiek/taal-en-proxy.spec.ts` | 3 |
| AC-01-10, 12, 13, 19 | e2e-ro | `publiek/navigatie.spec.ts` | 3 |
| AC-01-11, 14, 15, 27 | a11y | `a11y/toetsenbord.spec.ts` (14 en 15 met `@mobiel`) | 3 |
| AC-01-16 tot en met 18 | e2e | `publiek/navigatie.spec.ts` met `@mobiel` (17 vanaf stap 6) | 3 en 6 |
| AC-01-20 | e2e-ro | `seo/json-ld.spec.ts` | 4 |
| AC-01-22 | e2e-ro | `seo/metadata.spec.ts` | 5 |
| AC-01-23 | e2e-ro | `perf/netwerk.spec.ts` (HTML van `/over-ons`) | 3 |
| AC-01-25, 35 | handmatig | tijdelijke foutpagina; verslag van de sub-agents | 3 |
| AC-01-28, 29 | a11y | `a11y/weergave.spec.ts` | 3 |
| AC-01-31, 32 | e2e-ro | `seo/sitemap.spec.ts`, `seo/robots-llms.spec.ts` | 3 |
| AC-01-34 | a11y en check | `a11y/axe.spec.ts`; `npm run lighthouse -- --extra=/contact,/onbekend` | 3b |
| AC-01-36, AC-01-37 | check | K2 en de grep uit spec 01 | 3b |
| AC-01-38 | handmatig | `docs/21st-keuzes.md` | 3b |
| AC-03-01, 03, 12 | check | K1, K6 | 3 |
| AC-03-02 | unit | `content/messages.test.ts` | 3 |
| AC-03-04, 05, 08, 19, 22, 23 | check | K5 en de commando's van `check:copy` | 3 en 4 |
| AC-03-06, 07, 10, 21 | e2e-ro | `publiek/copy.spec.ts` | 4 |
| AC-03-09, 16 | e2e-ro | `publiek/navigatie.spec.ts` | 3 en 4 |
| AC-03-11, 17, 24 | handmatig | vlag lokaal omzetten; tijdelijke foutpagina; goedkeuring door Djulan | 4 |
| AC-03-13 | e2e-ro | `vacatures/detail.spec.ts` | 5 |
| AC-03-14, 15 | e2e-ro | `seo/metadata.spec.ts` | 4 en 5 |
| AC-03-18 | unit | `vacatures/opmaak.test.ts` | 3 |
| AC-03-20 | e2e-ro | `publiek/taal-en-proxy.spec.ts` | 3 |
| AC-03-25, AC-03-26 | check | SQL en grep uit spec 03 | 3b |
| AC-03-27 | handmatig | `docs/21st-keuzes.md` en bouwverslag | 3b |
| AC-07-30 | handmatig | preview, regel `formulieren-per-ip` | 10 |
| AC-08-42 | e2e | `beheer/vacatures.spec.ts` | 7 |
| AC-09-01, 02, 04, 06, 07, 10, 19, 20, 21 | e2e-ro | `publiek/juridisch.spec.ts` | 8 |
| AC-09-03, 08, 11, 12, 24, 25, 26 | handmatig | bouwverslag; vlag of fase tijdelijk omzetten; `docs/compliance/*`; grep op de seed | 8 en 10 |
| AC-09-05 | e2e-ro | `perf/netwerk.spec.ts` | 9 |
| AC-09-09 | e2e-ro | `seo/sitemap.spec.ts` | 8 |
| AC-09-13, 14, 15 | e2e | `formulieren/solliciteren.spec.ts`, `formulieren/inschrijven.spec.ts`, `formulieren/zonder-js.spec.ts` | 6 en 8 |
| AC-09-16, 23, 28 | check en e2e | K4, K6; veldcontrole in `formulieren/*.spec.ts` | 8 |
| AC-09-17 | unit | `analytics.test.ts` | 8 |
| AC-09-18, 29 | check | grep uit spec 09; `npm run verify` | 8 |
| AC-09-22 | a11y en check | `a11y/axe.spec.ts`; `npm run lighthouse -- --extra=/privacyverklaring` | 9 |
| AC-09-27 | e2e-ro | `publiek/navigatie.spec.ts` | 3 |
| AC-09-30 | handmatig | `docs/21st-keuzes.md` | 8 |
| AC-10-01 tot en met 03, 25, 26 | check | Supabase CLI en MCP (`execute_sql`, `get_advisors`); grep uit spec 10 | 1 |
| AC-10-04 tot en met 07 | integratie | `integration/rls.test.ts` | 1 |
| AC-10-08 | check | `npm run db:test` | 1 |
| AC-10-09 tot en met 11, 24 | integratie | `integration/database.test.ts` (op testdata) | 1 |
| AC-10-12 tot en met 14, 19 tot en met 21 | e2e | `api/cron.spec.ts` (op testdata, niet op 1002, 1008 of de seedsollicitatie) | 1 en 6 |
| AC-10-15, 16 | e2e-ro | `vacatures/overzicht.spec.ts`, `vacatures/gesloten.spec.ts` | 5 |
| AC-10-17, 18 | unit | `vacatures/slug.test.ts`, `data/mappers.test.ts` | 1 |
| AC-10-22 | e2e | `formulieren/solliciteren.spec.ts` | 6 |
| AC-10-23 | e2e | `beheer/sollicitaties.spec.ts` | 7 |
| AC-10-27, AC-10-28, AC-10-32 | check en unit | SQL uit spec 10, `tests/unit/data/options.test.ts` | 3b |
| AC-10-29, AC-10-30, AC-10-31 | e2e | `api/cron.spec.ts` | 3b |
| AC-13-01 tot en met 06 | check | Supabase MCP en CLI, `git check-ignore` | 1 |
| AC-13-07 | handmatig | inloggen met TOTP op localhost | 7 |
| AC-13-08, 09 | handmatig | terminaluitvoer en `BOTID_DEV_BYPASS` | 6 |
| AC-13-10 | check en e2e-ro | rooktest van spec 13; `npm run test:e2e:ro` | 1 en 10 |
| AC-13-11 | check | `npm run check:bundles` | 9 |
| AC-13-12 | check | K9 | 3 |
| AC-13-13 tot en met 26, 29, 30, 32 tot en met 37 | handmatig | stappen en commando's van spec 13, pre-livegangchecklist | 10 |
| AC-13-27, 28 | e2e-ro | `api/beveiliging.spec.ts` (lokaal in stap 7, op productie in stap 10) | 7 en 10 |
| AC-13-31 | e2e-ro | `api/cron.spec.ts` (alleen de 401-test) tegen productie | 10 |
| AC-13-38 | handmatig | pre-livegangchecklist | 10 |

**Losse rijen voor 01, 06 en 10 met kern.** Deze rijen gaan voor op de gegroepeerde tabel hierboven en op de regel voor specs die er nog niet waren.

| AC-id | Kern | Testsoort | Bestand of protocol | Stap |
|---|---|---|---|---|
| AC-01-39 | 404 in server-HTML en isKnownPath | check, unit en e2e | `curl` uit spec 01, `tests/unit/routes/is-known-path.test.ts`, `publiek/taal-en-proxy.spec.ts` | 3b |
| AC-06-20 | Onbekende en niet-publieke vacatures geven 404 | check en e2e | `curl` voor `/vacatures/onzin`; Playwright (`vacatures/gesloten.spec.ts`) voor de drie seedvacatures 1008, 1009 en 1010 | 5 |
| AC-06-38 | Supabase-fout geeft foutpagina | handmatig | protocol in deel 3: dev-server op 3101 met onbereikbare Supabase-URL | 3b |
| AC-10-33 | Leesfuncties gooien bij Supabase-fout | unit | `tests/unit/data/errors.test.ts` | 3b |

**Specs die er nog niet waren (02, 04 tot en met 08, 11, 12).** De bouw-agent van bouwstap 3b zet hun AC's in de matrix bij stap 6 van §10.1, volgens de kolom "Bewijs" van §3.7 en de stap uit §3.6. Een losse rij voor 06, 07 of 08 in de tabellen hierboven gaat voor. Past een AC nergens, dan krijgt hij `handmatig` met een protocol in deel 3.

## 12 Open vragen en aannames

| Onderwerp | Aanname die de spec hanteert | Bevestigt | Wat er verandert als het anders is |
|---|---|---|---|
| Testomgeving | E2e en integratie draaien tegen `groos-dev` met gemarkeerde, zelfopruimende data en een bewaking op de projectref. | Djulan | Apart testproject of branch: alleen `toegestane-projecten.json` en `.env.local` voor tests veranderen. |
| Testframe in bouwstap 3b | Het testframe (stap A) en de uitbreiding van `check-launch` (stap B) zijn niet in bouwstap 1 en 3 gebouwd; de bouw-agent van bouwstap 3b voert ze uit (00 §1a). Daarna schrijft elke stap zijn eigen tests en maakt stap 9 de ronde af. Dit is een aanvulling op de volgorde in 00 §6. | Djulan | Alles in stap 9: modules leveren zonder tests op en stap 9 wordt veel groter. |
| `verify` met tests | `npm run verify` draait ook `npm run test`. | Djulan | Zonder: punt 1 van de definition of done noemt `npm run test` apart. |
| Testvariabelen | `E2E_BASE_URL` en `VERCEL_AUTOMATION_BYPASS_SECRET` bestaan alleen in de shell van de tester en staan in 00 §4.5 als shellvariabelen; in `.env.example` mogen ze als regel of commentaarregel staan (K9). | Djulan, spec 13 | Niet gewenst: runs tegen preview of productie gebeuren alleen via Playwright MCP met de hand. |
| Nieuwe devDependencies | `vitest`, `vite`, `@playwright/test`, `@axe-core/playwright`. Aanvulling op B-37, die nieuwe dependencies met vermelding in de modulespec toestaat. | Djulan | Zonder Vitest: eenheidstests via `node --test` met type-stripping, zonder alias voor `@/`. |
| Seed en testvacatures | De seed van spec 10 (1001 tot en met 1010) is de basis; tijdsafhankelijke toestanden en de zeven testvacatures voor paginering maken de tests zelf via `save_vacancy` met een aal2-sessie van het e2e-account, en ruimen ze daarna op. | spec 10, Djulan | Andere seed: alleen `fixtures.ts` en `e2e-voorbereiden.mjs` passen zich aan. Kan het e2e-account `save_vacancy` niet aanroepen: de fixtures schrijven met de service-role-client in één transactie via een RPC die spec 10 dan toevoegt. |
| Seed resetten vóór een run | `e2e-voorbereiden.mjs` verwijdert na de bewaking alle objecten onder `cvs/applications/` in `groos-dev` en draait daarna `npm run db:seed:reset` (spec 10), dat de relatieve datums van de seed opnieuw zet. Daarom is `SUPABASE_DB_URL` (Session pooler van `groos-dev`) verplicht in de shell bij elke lokale e2e-run (§5.8). | spec 10 | Bestaat het script niet: de voorbereiding verlengt weer de `closes_at` van 1001 tot en met 1006 en ruimt e2e-data op met `e2e-opruimen.mjs`. |
| Paginering met testvacatures | De zeven testvacatures die de pagineringstest met `maakTestVacature("gepubliceerd")` maakt, staan zonder nieuwe build op `/vacatures`. De helper schrijft buiten Next.js en roept na elke mutatie `POST /api/dev/revalidate` aan met Bearer `CRON_SECRET` en body `{ numbers: [nummer], kind: "visibility" }` (spec 10, B-46). | spec 10, Djulan | Lukt verversen zonder build niet: `e2e-voorbereiden.mjs` maakt de zeven vóór de build en de tests die op zes open seedvacatures rekenen, verwachten dan 13. |
| Resend-testadressen | Adressen als `delivered+label@resend.dev` worden geaccepteerd en geven een geslaagde aflevering. | Djulan (bij het inrichten van Resend) | Geen labels: alle tests gebruiken `delivered@resend.dev` en markeren records via de naam "E2E Test" en de `RUN_ID` in het bericht. |
| Mail tijdens e2e | `EMAIL_DEV_TO` in de `webServer` van Playwright overschrijft `.env.local`, zodat alle mails van een run naar een Resend-testadres gaan (spec 13, AC-13-08). Lokaal geldt `next start` niet als productie voor de mailregels van spec 11. | spec 11, spec 13 | Behandelt spec 11 `next start` als productie: de e2e-run draait dan zonder `RESEND_API_KEY` en controleert alleen `email_log`. |
| Copyregels en claims | `check-launch` draait `check-copy.mjs` (spec 03) en `check-claims.mjs` (spec 09) als K5 en K6 en definieert die regels niet zelf. | spec 03, spec 09 | Willen 03 en 09 hun scripts los houden: K5 en K6 vervallen en de pre-livegangchecklist noemt beide commando's apart. |
| Minimale invultijd | Spec 07 exporteert de minimale invultijd als constante in `lib/validation/*`; `wachtInvultijd()` gebruikt die. | spec 07 | Geen constante: de helper wacht vier seconden en de matrix noteert dat. |
| Kenmerk voor tests | `CtaButton` zet `data-slot="cta-button"`. | spec 02 | Zonder kenmerk: de doelgroottecontrole herkent CTA's aan hun rol en klasse, wat brozer is. |
| JavaScript-budgetten | 200 kB gzip voor inhoudspagina's (doel 170), 215 voor het vacatureoverzicht, 235 voor formulierpagina's, 350 als waarschuwing voor het beheer. Nulmeting framework 131 kB, JV-home nu 254 kB. | Djulan | Alleen de constante `BUDGETTEN` in `scripts/check-bundles.mjs` en §8.5 veranderen. |
| Bron voor de bundelmeting | `.next/diagnostics/route-bundle-stats.json` blijft bestaan in Next 16.3 met Turbopack; het bestand is niet gedocumenteerd. | Djulan | Verdwijnt het: de meting gaat via `npx next experimental-analyze --output` en het script leest die uitvoer. |
| Lighthouse-drempels | Poort 90 in alle vier categorieën (R-15, STAPPENPLAN J), doel 100 voor toegankelijkheid. | Djulan | Strenger: alleen de drempels in `scripts/lighthouse.mjs` en §8.4. |
| Velddata | Geen Vercel Speed Insights in fase 1; alleen Vercel Analytics (B-31). | Djulan | Wel: één extra dependency `@vercel/speed-insights` en een regel in de layout (spec 01 en 13). |
| CI | Alleen de stap `npm run test` in de workflow `verify` van spec 13; geen e2e in CI in fase 1. | Djulan | Wel e2e op previews: een extra job met `npm run test:e2e:ro`, `E2E_BASE_URL` uit de deployment-status en het bypass-geheim als GitHub-secret. |
| FAQ en EmploymentAgency in de Rich Results Test | Google toont FAQ-resultaten en dit subtype niet altijd; de Schema Markup Validator is daarvoor de poort. | Djulan | Toont de Rich Results Test ze wel: dan geldt ook daar nul fouten. |
