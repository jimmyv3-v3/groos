# 13 Infrastructuur, lokale omgeving, deployment, domein, DNS en e-mailrecords

| Status | Fase | Hangt af van | Bronnen |
|---|---|---|---|
| concept, ter goedkeuring aan Djulan | 1 | geen; raakt 01, 07, 08, 10, 11, 12 en 14 | docs/STAPPENPLAN.md §A, E, K, L, M; docs/HANDOVER.md §3; docs/BOUWINSTRUCTIE.md §4.7 en §4.10; context/11 §1.5, §1.6, §6.4, §6.5, §7, §8.2, §11; context/03; context/10 §5 en §8; context/09 (verwerkers); spec 00 §3 en §4; `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`; `.../05-config/01-next-config-js/headers.md`; DNS-opvraging van 2 oktober 2026 |

## 1 Doel

Deze spec levert het fundament waarop alle andere modules draaien: een lokale
ontwikkelomgeving die vanavond zonder Docker volledig werkt tegen het bestaande
Supabase-project `groos-dev`, en daarna in vaste volgorde de privérepo op
GitHub, het Vercel-project in Jimmy's account, het productieproject van
Supabase via de Vercel Marketplace, het domein `www.groospersoneelsdiensten.nl`
met DNS bij STRATO, het verzenddomein van Resend, de beveiligingslaag
(headers, CSP, BotID, WAF, `CRON_SECRET`, geheimbeheer), de registraties bij
Google en Bing na livegang en de overdracht van accounts en kosten. De
volgorde volgt de briefing: eerst alles op localhost goed met gekoppelde
database (R-17), de Vercel-deploy met domein als allerlaatste stap.

## 2 Gebruikers en scenario's

**Djulan (ontwikkelaar, SKUU)**

- S-13-01 Djulan werkt vanavond tegen het bestaande project `groos-dev` (ref
  `smcskfrkjgniinbhqnln`) in de organisatie Groos Personeelsdiensten, regio
  eu-central-1, vult `.env.local` en ziet op `http://localhost:3000` data uit
  de database, zonder Docker.
- S-13-02 Djulan logt lokaal in op `/beheer` als eerste beheerder, met
  wachtwoord en een code uit zijn authenticator-app.
- S-13-03 Djulan pusht per bouwstap een branch naar de privérepo van Jimmy,
  opent een pull request en krijgt een beveiligde preview op Vercel die tegen
  `groos-dev` draait.
- S-13-04 Djulan zet op de dag van livegang het domein om zonder dat de
  mailbox `info@groospersoneelsdiensten.nl` één bericht mist.

**Bouw-agent (Claude)**

- S-13-05 De bouw-agent maakt een migratie (spec 10), past die met de
  Supabase CLI toe op `groos-dev`, genereert de types en ziet `npm run
  typecheck` slagen.
- S-13-06 De bouw-agent test formulieren lokaal zonder Resend-sleutel: de mail
  verschijnt in de terminal en gaat nergens heen.

**Jimmy en Lorenzo (eigenaren en beheerders)**

- S-13-07 Jimmy bekijkt een preview op zijn telefoon na inloggen bij Vercel;
  Lorenzo krijgt een kijklink of een gratis kijkersplek.
- S-13-08 Jimmy ontvangt na livegang een uitnodiging voor Groos Beheer, met
  een mail die via Resend vanaf het eigen domein komt en niet in spam belandt.
- S-13-09 Jimmy is eigenaar van GitHub, Vercel, Supabase, Resend, STRATO en de
  Google-accounts, kent de maandkosten en heeft de verwerkersovereenkomsten.

**Werkzoekende en werkgever (indirect)**

- S-13-10 Een werkzoekende verstuurt op productie een sollicitatie; BotID,
  honeypot en de WAF-regel houden bots tegen, de bevestiging komt aan met SPF,
  DKIM en DMARC in orde.

**Systeem**

- S-13-11 Vercel Cron roept elk kwartier de vacaturetaak aan met
  `Authorization: Bearer <CRON_SECRET>`; zonder die header weigert de route.
- S-13-12 Google vindt na livegang de sitemap via Search Console en toont
  vacatures in Google for Jobs; het Bedrijfsprofiel toont een servicegebied
  zonder huisadres.

## 3 Scope

### 3.1 Wel in deze spec

Deel A tot en met H in §10, de configuratiebestanden in §4, de tabellen met
omgevingsvariabelen, DNS-records, WAF-regels, cron-schema's, accounts en kosten
in §5.

### 3.2 Niet in deze spec

- Inhoud van migraties, seed, RLS, cron-routes en `lib/supabase/*`: spec 10.
  Deze spec geeft alleen de commando's en de werkwijze zonder Docker.
- Inhoud en teksten van e-mails, `lib/email/*`: spec 11. Deze spec legt het
  gedrag in ontwikkeling vast (§10 A8) en de SMTP- en DNS-kant.
- Server Actions, uploadroute en formulieren: spec 07. Deze spec levert BotID
  en de WAF-regels die daarop werken.
- `proxy.ts` en de matcher: spec 01. `robots.ts`, `sitemap.ts` en JSON-LD:
  spec 12. Testopzet en acceptatiematrix: spec 14.

### 3.3 Fase 2

Google Indexing API (Google Cloud-serviceaccount, nieuwe variabele
`GOOGLE_INDEXING_SERVICE_ACCOUNT`), XML-feeds onder `/feeds` met eigen
cache-instellingen, pushmeldingen, een apart previewproject in de organisatie
van Groos, passkeys zodra Supabase ze stabiel levert, Deep Analysis van BotID.

### 3.4 Eisen

| Id | Eis | Dient |
|---|---|---|
| E-13-01 | De lokale omgeving werkt zonder Docker tegen het bestaande project `groos-dev` (ref `smcskfrkjgniinbhqnln`) in de organisatie Groos Personeelsdiensten, regio eu-central-1. Commando's die Docker vragen (`supabase start`, `supabase db diff`, `supabase db pull`, `supabase db reset` zonder `--linked`) komen in geen enkele instructie voor. | R-17 |
| E-13-02 | Migraties gaan alleen met `supabase db push --linked` vanuit `supabase/migrations/` naar een project; de MCP wordt alleen gebruikt om te lezen (`list_tables`, `get_advisors`, `generate_typescript_types`, `get_project_url`) en om de seed met `execute_sql` te draaien als `psql` ontbreekt. Productie krijgt nooit seed-data. | R-17, R-19 |
| E-13-03 | `.env.example` bevat precies de variabelen uit §5.1 met uitleg; de code leest geen andere variabelen dan die en de systeemvariabelen van Vercel en Node. | R-19 |
| E-13-04 | In ontwikkeling gaat zonder `RESEND_API_KEY` elke mail naar de console; met sleutel gaat elke mail alleen naar `EMAIL_DEV_TO`. Op productie wordt `EMAIL_DEV_TO` genegeerd. | R-04, R-17 |
| E-13-05 | BotID werkt lokaal (in `next dev` en `next start` standaard als mens, met `BOTID_DEV_BYPASS` te simuleren) en op Vercel echt, via één helper `isBotRequest()`. | R-04 |
| E-13-06 | Vanaf het moment dat de remote bestaat, staat de code in een privérepo `jimmyv3-v3/groos-personeelsdiensten`; `skuu-os` is collaborator; elke bouwstap gaat dan via een eigen branch en pull request met een groene `verify`-workflow. | R-18 |
| E-13-07 | Het Vercel-project staat in een Pro-team van Jimmy, gekoppeld via de Git-integratie, met Node 24.x en functieregio `fra1`. Er wordt nooit `vercel link` gedraaid vanaf deze laptop. | R-18 |
| E-13-08 | De projectconfiguratie staat in `vercel.ts` met `@vercel/config` (regio's en cron-taken). | R-10, R-11 |
| E-13-09 | Previews zijn alleen zichtbaar na inloggen bij Vercel of via een kijklink, krijgen `noindex` en draaien tegen `groos-dev`, nooit tegen productiedata. | R-11 |
| E-13-10 | Vercel Web Analytics (cookieloos) staat aan; er komt geen ander analytisch script. | R-11 |
| E-13-11 | Het productieproject van Supabase is via de Vercel Marketplace in het team van Jimmy aangemaakt, op Pro, regio Frankfurt, met aanmelden uit, TOTP aan, SMTP via Resend en dagelijkse back-ups. | R-03, R-11 |
| E-13-12 | DNS blijft bij STRATO. Voor de site veranderen alleen de A-record van het kale domein, de AAAA-record en de CNAME van `www`; voor Resend en Search Console komen er records bij; MX, DKIM, DMARC, autoconfig en DNSSEC blijven ongewijzigd. `www` is het hoofdadres; het kale domein stuurt met 308 door. | R-09, R-18 |
| E-13-13 | Resend verstuurt vanaf `mail.groospersoneelsdiensten.nl` (regio `eu-west-1`) met SPF en DKIM op dat subdomein; DMARC van het hoofddomein (`p=reject`) slaagt; open- en kliktracking staan uit. | R-04, R-11 |
| E-13-14 | `next.config.mjs` zet securityheaders en een CSP zonder nonce op alle routes, en `X-Robots-Tag: noindex, nofollow` op `/beheer` en `/api`. | R-03, R-09, R-11 |
| E-13-15 | WAF-regels beperken publieke formulierverzendingen en inlogpogingen per IP-adres. | R-03, R-04 |
| E-13-16 | Elke cron-route weigert een verzoek zonder geldige `Authorization: Bearer <CRON_SECRET>` met 401. | R-11 |
| E-13-17 | Geheimen staan alleen in Vercel (gemarkeerd als gevoelig), in `.env.local` en in een gedeelde wachtwoordkluis; nooit in de repo, in een pull request of in een chat. | R-11 |
| E-13-18 | Na livegang zijn Search Console (domeineigendom), de sitemap, Bing Webmaster Tools en een Google Bedrijfsprofiel met verborgen adres ingericht, en is één vacature als geldig JobPosting gecontroleerd. | R-09, R-10 |
| E-13-19 | Alle accounts staan op naam van Groos (Jimmy als eigenaar), met tweestapsverificatie, verwerkersovereenkomsten en een kostenoverzicht van ongeveer 45 tot 65 dollar per maand. | R-11, R-18 |
| E-13-20 | Het domein wordt pas aan productie gekoppeld als bouwstap 1 tot en met 9 uit spec 00 §6 groen zijn. | R-17 |

## 4 Pagina's en componenten

Deze module heeft geen pagina's. Hieronder staan de bestanden die zij aanmaakt
of wijzigt. Bestaande bouwstenen uit de repo-inventaris blijven ongemoeid,
behalve `next.config.mjs`, `.env.example`, `.gitignore` en `package.json`.

### 4.1 Overzicht

| Bestand | Actie | Eigenaar | Inhoud |
|---|---|---|---|
| `.env.example` | vervangen | 13 | §5.2 |
| `next.config.mjs` | wijzigen | 13 | §4.2 |
| `vercel.ts` | nieuw | 13 | §4.3 |
| `instrumentation-client.ts` | nieuw | 13 | §4.4 (BotID op de client) |
| `lib/security/botid.ts` | nieuw | 13 | §4.4 (`isBotRequest()`) |
| `supabase/config.toml` | nieuw via `supabase init` | 13 | §4.5 |
| `package.json` | wijzigen | 13 (scripts `db:*`, `botid`, `@vercel/config`) | §4.6 |
| `.github/workflows/verify.yml` | nieuw | 13 (spec 14 mag jobs toevoegen) | §4.7 |
| `.github/pull_request_template.md` | nieuw | 13 | §6.2 |
| `.gitignore` | wijzigen | 13 | §4.8 |
| `docs/infra/dns-inventaris.md` | nieuw tijdens Deel E | 13 | §10 E1 |
| `docs/infra/overdracht.md` | nieuw tijdens Deel H | 13 | §10 H4, zonder geheimen |

`instrumentation-client.ts`, `lib/security/botid.ts`, `supabase/config.toml`
en `.github/*` staan niet in de eigenaarschapstabel van spec 00 §4.4a; deze
spec claimt ze (zie §12).

### 4.2 `next.config.mjs`

Doelversie. De bestaande opties blijven; nieuw zijn `poweredByHeader`,
`images.remotePatterns`, `experimental.globalNotFound`, `headers()`, de
CSP-uitbreiding voor de Vercel-toolbar op previews en de BotID-wrapper.

```js
import createNextIntlPlugin from "next-intl/plugin";
import { withBotId } from "botid/next/config";

const withNextIntl = createNextIntlPlugin();
const isDev = process.env.NODE_ENV === "development";
const onVercel = process.env.VERCEL === "1";

// Alleen op previews: de Vercel-toolbar (opmerkingen, kijklinks) laadt van
// vercel.live. Productie houdt de strenge CSP.
const isPreview = process.env.VERCEL_ENV === "preview";
const toolbar = isPreview ? " https://vercel.live" : "";

// Herkomst van het Supabase-project van deze omgeving (dev, preview of
// productie). Nodig voor de cv-upload vanuit de browser (signed upload URL),
// de Supabase-client in /beheer en beelden uit de bucket public-media.
const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
  : null;
const supabaseSrc = supabaseOrigin ? ` ${supabaseOrigin}` : "";

// CSP zonder nonce: een nonce dwingt dynamische rendering af voor elke pagina
// (zie de Next.js-gids content-security-policy). De site leunt op statische
// pagina's en unstable_cache (B-35), dus 'unsafe-inline' voor scripts.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}${toolbar}`,
  `style-src 'self' 'unsafe-inline'${toolbar}`,
  `img-src 'self' data: blob:${supabaseSrc}${isPreview ? " https://vercel.live https://vercel.com" : ""}`,
  `font-src 'self'${isPreview ? " https://vercel.live https://assets.vercel.com" : ""}`,
  `connect-src 'self'${supabaseSrc}${isDev ? " ws://localhost:* https://va.vercel-scripts.com" : ""}${isPreview ? " https://vercel.live wss://ws-us3.pusher.com" : ""}`,
  `frame-src 'self'${toolbar}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Alleen op Vercel (https); next start op localhost draait over http.
  ...(!isDev && onVercel ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: { root: import.meta.dirname },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseOrigin
      ? [new URL(`${supabaseOrigin}/storage/v1/object/public/public-media/**`)]
      : [],
  },
  // globalNotFound: 404 voor URL's buiten de proxy (spec 01 §4.13)
  experimental: { optimizePackageImports: ["lucide-react"], globalNotFound: true },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/beheer/:path*", headers: noindex },
      { source: "/api/:path*", headers: noindex },
    ];
  },
  // Groos had geen eerdere site; voeg hier 308-regels toe als URL's later
  // veranderen. Kaal domein naar www regelt Vercel (Deel E), niet deze lijst.
  async redirects() {
    return [];
  },
};

// withBotId als buitenste laag. BotID voegt eigen rewrites en headers toe voor
// zijn pad (/149e9513-01fa-4fb0-aad4-566afd725d1b/...); die komen na de onze en
// winnen daar (bij gelijke sleutel telt de laatste, zie de Next.js-docs over
// headers). Zo krijgt alleen dat pad frame-ancestors 'self'.
export default withBotId(withNextIntl(nextConfig));
```

Toelichting per keuze:

- Strict-Transport-Security zet Vercel zelf op alle domeinen
  (`max-age=63072000`). Geen `includeSubDomains` of `preload`, omdat
  `autoconfig.groospersoneelsdiensten.nl` naar STRATO wijst.
- `frame-src 'self'` en `worker-src 'self' blob:` zijn er voor het
  BotID-script. Vraagt dat script op de preview iets anders (§11 AC-13-27),
  dan voegt de bouw-agent alleen die ene bron toe, met een commentaarregel
  erboven.
- `upgrade-insecure-requests` staat alleen op Vercel aan (`onVercel`):
  `next start` op localhost draait over http en zou anders elke subresource
  naar https sturen.
- Alleen op previews (`VERCEL_ENV === "preview"`) komen de bronnen van de
  Vercel-toolbar erbij: `https://vercel.live` in `script-src`, `connect-src`
  (plus `wss://ws-us3.pusher.com`), `img-src` (plus `https://vercel.com`),
  `style-src`, `font-src` (plus `https://assets.vercel.com`) en `frame-src`.
  Zo werken kijklinks en opmerkingen (§10 C6, AC-13-27). Productie houdt de
  strenge CSP.
- `experimental.globalNotFound` geeft een 404 voor URL's buiten de proxy
  (spec 01 §4.13).
- Een kaart of video van een derde partij komt er niet; wie er een toevoegt,
  breidt `frame-src` gericht uit.
- Gebruikt spec 08 Supabase Realtime, dan komt `wss://<ref>.supabase.co` in
  `connect-src` (afgeleid van `supabaseOrigin`).

### 4.3 `vercel.ts`

**Keuze: `vercel.ts` met `@vercel/config`, niet `vercel.json`.** Motivatie:

1. Vercel raadt `vercel.ts` sinds 2026 aan als standaard voor
   projectconfiguratie; de Git-integratie compileert het bij elke build naar
   `vercel.json`.
2. Het bestand valt onder `tsconfig.json` (`**/*.ts`), dus `npm run
   typecheck` vangt een tikfout in een sleutel of cron-object op voordat Vercel
   bouwt. Bij `vercel.json` merk je dat pas in de buildlog.
3. De configuratie is klein (regio en cron), dus het risico van een pakket in
   versie 0.x is beperkt; we pinnen exact op `0.8.0`.

Terugvaloptie: geeft `npx @vercel/config validate` een fout die niet in één
stap op te lossen is, of toont de buildlog op Vercel dat `vercel.ts` niet wordt
gelezen terwijl het de configuratie als default export levert, dan vervangt de bouw-agent het door `vercel.json` met exact dezelfde
inhoud (`{"regions":["fra1"],"crons":[...]}`), verwijdert hij
`@vercel/config` en noteert hij dat in spec 00. Beide bestanden tegelijk mag
niet.

```ts
import type { VercelConfig } from "@vercel/config/v1";

// Projectconfiguratie voor Vercel (spec 13). Cron-tijden zijn UTC; Vercel Cron
// draait alleen op productie en stuurt "Authorization: Bearer <CRON_SECRET>".
// De routes zelf staan in app/api/cron/* (spec 10).
const config: VercelConfig = {
  framework: "nextjs",
  regions: ["fra1"],
  crons: [
    { path: "/api/cron/vacatures", schedule: "*/15 * * * *" },
    { path: "/api/cron/bewaartermijnen", schedule: "0 2 * * *" },
    { path: "/api/cron/opruimen", schedule: "30 2 * * *" },
  ],
};

export default config;
```

De cron-lijst volgt spec 10 §4.6 en B-41: drie taken.
`/api/cron/herinneringen` vervalt (fase 2). Bouwt spec 10 een route niet of
onder een andere naam, dan past de bouw-agent alleen deze lijst aan; elke `path` moet een
bestand `app<path>/route.ts` hebben (AC-13-16).

### 4.4 BotID: `instrumentation-client.ts` en `lib/security/botid.ts`

`instrumentation-client.ts` (client, draait voor de hydratatie op elke pagina):

```ts
// BotID op de client (spec 13). Beschermt de POST-verzoeken van de publieke
// formulieren (Server Actions posten naar de pagina zelf), de uploadroute en
// het inloggen in het beheer. De server controleert met isBotRequest().
import { initBotId } from "botid/client/core";

const FORM_PAGES = [
  "/vacatures/*",
  "/inschrijven",
  "/werkgevers/personeel-aanvragen",
  "/contact",
];

initBotId({
  protect: [
    ...FORM_PAGES.flatMap((path) => [
      { path, method: "POST" },
      { path: `/en${path}`, method: "POST" },
    ]),
    { path: "/api/upload/*", method: "POST" },
    { path: "/beheer/inloggen", method: "POST" },
    { path: "/beheer/wachtwoord-vergeten", method: "POST" },
  ],
});
```

`lib/security/botid.ts` (server, `import "server-only"`):

```ts
import "server-only";
import { checkBotId } from "botid/server";

type Bypass = "HUMAN" | "BAD-BOT" | "GOOD-BOT";

/**
 * True als BotID het verzoek als bot ziet. Buiten Vercel (next dev én
 * next start op localhost) geeft BotID standaard "mens"; met
 * BOTID_DEV_BYPASS=BAD-BOT simuleer je een bot. Op Vercel (VERCEL=1) is de
 * controle echt en wordt BOTID_DEV_BYPASS genegeerd.
 */
export async function isBotRequest(): Promise<boolean> {
  const onVercel = process.env.VERCEL === "1";
  const raw = process.env.BOTID_DEV_BYPASS;
  const bypass: Bypass | undefined =
    !onVercel && (raw === "HUMAN" || raw === "BAD-BOT" || raw === "GOOD-BOT") ? raw : undefined;
  const result = await checkBotId({
    developmentOptions: { isDevelopment: !onVercel, bypass },
  });
  return result.isBot;
}
```

Waarom de helper: `checkBotId()` behandelt `next start` op localhost als
productie (`NODE_ENV=production`) en vraagt dan een OIDC-token van Vercel, wat
een fout geeft. De helper maakt dat onderscheid op `VERCEL` in plaats van op
`NODE_ENV`. Spec 07 roept `isBotRequest()` aan als eerste regel van elke
publieke Server Action en van de uploadroute; spec 08 doet dat in de
inlogactie. Een geweigerd verzoek geeft dezelfde foutstatus als een
spamverdacht verzoek (tekst in spec 07).

Het BotID-voorvoegsel `/149e9513-01fa-4fb0-aad4-566afd725d1b` mag nooit door
de taal-proxy; de matcher van spec 01 §4.12 sluit het uit.

### 4.5 `supabase/config.toml`

Aangemaakt met `npx supabase init` (vragen over VS Code- en Deno-instellingen
met N beantwoorden). Alleen deze waarden zijn van belang; de rest van het
bestand betreft de lokale stack en blijft standaard.

```toml
project_id = "groos-personeelsdiensten"

[db.seed]
enabled = true
sql_paths = ["./seed.sql"]
```

`supabase init` maakt ook `supabase/.gitignore` met `.temp` en `.branches`;
die blijft. `supabase config push` wordt nooit gedraaid (B-39); de
`[auth]`-blokken documenteren alleen. Auth, e-mailtemplates en SMTP worden per
project in het dashboard ingesteld (§10 A2 en D5 tot en met D7).

### 4.6 `package.json`

- Dependency: `botid` `^1.5.11` (B-37).
- Devdependency: `@vercel/config` exact `0.8.0` (B-37, zie §4.3).
- Scripts (toevoegen, bestaande blijven):

```json
{
  "db:status": "supabase migration list --linked",
  "db:push": "supabase db push --linked",
  "db:types": "supabase gen types typescript --linked --schema public > lib/database.types.ts",
  "config:check": "npx @vercel/config validate"
}
```

De scripts gebruiken de Supabase CLI uit het PATH (2.104 op deze laptop). Is
die er niet, dan werkt `npx supabase <commando>` (B-37).

### 4.7 `.github/workflows/verify.yml`

Een lichte controle op elke pull request en elke push naar `main`. De build
zelf draait op Vercel, omdat die de database nodig heeft.

```yaml
name: verify
on:
  pull_request:
  push:
    branches: [main]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npx next typegen
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run config:check
      - run: npm run check -- --warn
```

`next typegen` maakt `next-env.d.ts` en de routetypes aan, die in de repo
genegeerd worden. Spec 14 mag jobs toevoegen (bijvoorbeeld Playwright tegen de
preview-URL met de bypass-header uit §10 C4).

### 4.8 `.gitignore`

Toevoegen:

```
# ruwe input met persoonsgegevens (WhatsApp-exports, notities)
context/_input/

# lokale artefacten van de Supabase CLI
supabase/.temp/
```

`.env*.local` en `.vercel` staan er al. Of `context/` verder gecommit wordt,
beslist Djulan (spec 00 §7 punt 4).

## 5 Data

Deze module heeft geen eigen tabellen. Ze gebruikt `admin_profiles` (spec 10)
voor de eerste beheerder en `storage.buckets` voor een controle. De gegevens
hieronder zijn configuratie.

### 5.1 Omgevingsvariabelen (definitief voor fase 1)

| Variabele | Soort | Development (`.env.local`) | Preview (Vercel) | Production (Vercel) | Bron | Gebruikt door |
|---|---|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | publiek | `https://smcskfrkjgniinbhqnln.supabase.co` | idem als dev | URL van `groos-prod` | dev: MCP `get_project_url`; prod: Marketplace zet hem | `lib/supabase/*` (10), `next.config.mjs` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | publiek | `sb_publishable_…` van `groos-dev` | idem als dev | Marketplace | dev: dashboard, Project Settings, API Keys; prod: Marketplace, anders handmatig uit het dashboard (D2) | `lib/supabase/*` (10) |
| `SUPABASE_SECRET_KEY` | geheim, alleen server | `sb_secret_…` van `groos-dev` | idem als dev, gevoelig | Marketplace | dev: dashboard, API Keys, Secret keys; prod: Marketplace, anders handmatig uit het dashboard (D2) | `lib/supabase/admin.ts` (10) |
| `RESEND_API_KEY` | geheim | leeg, of eigen sleutel van Djulan | sleutel `groos-preview`, gevoelig | sleutel `groos-productie`, gevoelig | Resend, API Keys | `lib/email/*` (11) |
| `CRON_SECRET` | geheim | `openssl rand -hex 32` | eigen waarde, gevoelig | eigen waarde, gevoelig | zelf genereren | `app/api/cron/*` (10), Vercel Cron |
| `EMAIL_FROM` | optioneel | `"Groos Personeelsdiensten <onboarding@resend.dev>"` (met aanhalingstekens) als er een sleutel is | leeg | niet zetten | vaste waarde | `lib/email/*` (11): vervangt het standaard afzenderadres |
| `EMAIL_DEV_TO` | optioneel | e-mailadres van het eigen Resend-account van Djulan | het e-mailadres van Djulan (gedeelde testinbox), gevoelig | nooit (wordt genegeerd) | vaste waarde | `lib/email/*` (11), §10 A8 |
| `BOTID_DEV_BYPASS` | optioneel, alleen lokaal | leeg (mens) of `BAD-BOT` om te testen | n.v.t. | n.v.t. | vaste waarde | `lib/security/botid.ts` |
| `RESEND_WEBHOOK_SECRET` | geheim | leeg | leeg | gezet (signing secret van de webhook uit §5.5), gevoelig | Resend, Webhooks | `/api/webhooks/resend` (11) |

Systeemvariabelen die de code mag lezen zonder vermelding in `.env.example`:
`NODE_ENV`, `VERCEL` (`"1"` op Vercel), `VERCEL_ENV` (`production`,
`preview`, `development`), `VERCEL_URL`, `NEXT_RUNTIME`. De Marketplace zet
daarnaast `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`,
`POSTGRES_USER`, `POSTGRES_HOST`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE`,
`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` en `SUPABASE_JWT_SECRET` in
Production. De code gebruikt die niet; ze blijven staan omdat de integratie ze
beheert. `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` verdwijnt (B-13).

Regels: een `NEXT_PUBLIC_`-variabele bevat nooit een geheim; gevoelige
variabelen zijn in Vercel als "Sensitive" gemarkeerd (alleen Preview en
Production; Development wordt in Vercel niet gebruikt); na een wijziging in
Vercel volgt een nieuwe deploy.

**Shellvariabelen.** Deze variabelen worden nooit door de app gelezen. Ze
staan alleen in de shell van wie de opdracht draait (met `export` of vóór de
opdracht), niet in `.env.local` en niet in Vercel. In `.env.example` staan ze
als commentaarregel (§5.2).

| Variabele | Waarde | Bron | Gebruikt door |
|---|---|---|---|
| `SUPABASE_DB_URL` | connection string van `groos-dev` (Session pooler), met het databasewachtwoord | dashboard, Connect; wachtwoord uit de kluis ("groos-dev database") | seed met `psql` (§10 A7), `npm run db:test` en `npm run db:seed:reset` (spec 10), `scripts/e2e-voorbereiden.mjs` (spec 14) |
| `SUPABASE_DB_PASSWORD` | databasewachtwoord van het project dat je koppelt | kluis | `supabase link` (§10 A4 en D4), alleen in die ene opdracht |
| `E2E_BASE_URL` | basis-URL voor de end-to-end-tests: `http://localhost:3000` of een preview-URL | zelf zetten | Playwright (spec 14) |
| `VERCEL_AUTOMATION_BYPASS_SECRET` | bypass-waarde voor beveiligde previews | Vercel, Deployment Protection (§10 C4); kluis | Playwright en `curl` met header `x-vercel-protection-bypass` (spec 14, AC-13-10, AC-13-17) |

### 5.2 Inhoud van `.env.example`

```bash
# Groos Personeelsdiensten: omgevingsvariabelen (spec 13 §5.1).
# Lokaal: kopieer naar .env.local en vul in. .env.local staat in .gitignore.
# Vercel: Production krijgt de Supabase-waarden van de Marketplace-integratie;
# Preview krijgt de waarden van groos-dev. Geheimen markeren als Sensitive.

# Supabase (lokaal en Preview: project groos-dev, regio eu-central-1).
# Dashboard > Project Settings > API Keys. Gebruik de nieuwe sleutels
# (sb_publishable_ en sb_secret_), niet anon of service_role.
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
# Alleen server-side (lib/supabase/admin.ts). Nooit met NEXT_PUBLIC_ ervoor.
SUPABASE_SECRET_KEY=

# Resend. Leeg laten in ontwikkeling: mails verschijnen dan in de terminal.
# Met een sleutel in ontwikkeling gaan alle mails alleen naar EMAIL_DEV_TO.
RESEND_API_KEY=
# Alleen ontwikkeling: afzender zolang het eigen domein niet geverifieerd is.
# Met aanhalingstekens, bijvoorbeeld:
# EMAIL_FROM="Groos Personeelsdiensten <onboarding@resend.dev>"
EMAIL_FROM=
# Alleen ontwikkeling en preview: elk bericht gaat naar dit adres. Op
# productie wordt deze variabele genegeerd.
EMAIL_DEV_TO=

# Geheim voor Vercel Cron en handmatige aanroepen van /api/cron/*.
# Genereer met: openssl rand -hex 32
CRON_SECRET=

# Alleen lokaal: simuleer BotID. Leeg = mens, BAD-BOT = bot, GOOD-BOT = bekende bot.
BOTID_DEV_BYPASS=

# Signing secret van de Resend-webhook (/api/webhooks/resend). Alleen in
# Vercel Production; lokaal en Preview leeg.
RESEND_WEBHOOK_SECRET=

# Shellvariabelen (spec 13 §5.1). De app leest ze nooit; zet ze alleen in de
# shell van wie de opdracht draait, niet in .env.local.
# Connection string van groos-dev (Session pooler) voor de seed met psql.
# SUPABASE_DB_URL=
# Databasewachtwoord voor supabase link, alleen in die ene opdracht.
# SUPABASE_DB_PASSWORD=
# Basis-URL voor Playwright: http://localhost:3000 of een preview-URL.
# E2E_BASE_URL=
# Bypass-waarde voor beveiligde previews (header x-vercel-protection-bypass).
# VERCEL_AUTOMATION_BYPASS_SECRET=
```

### 5.3 Supabase-projecten

| Kenmerk | `groos-dev` | `groos-prod` |
|---|---|---|
| Organisatie | Groos Personeelsdiensten (dev, eigenaar Djulan) | door de Marketplace gemaakte organisatie bij het Vercel-team van Groos, eigenaar Jimmy |
| Ref | `smcskfrkjgniinbhqnln` | `<PROD_REF>`, bekend na D1 |
| Regio | `eu-central-1` (Frankfurt) | `eu-central-1` (Frankfurt) |
| Plan | Free | Pro, 25 dollar per maand inclusief 10 dollar compute-tegoed |
| Data | alleen testdata, nooit echte persoonsgegevens | echte data |
| Gebruikt door | localhost en Vercel Preview | Vercel Production |
| Migraties | `db push --linked`; seed apart na de eerste beheerder (A7) | `db push --linked`, nooit seed |
| Site URL Auth | `http://localhost:3000` | `https://www.groospersoneelsdiensten.nl` |
| Redirect URL's | `http://localhost:3000/beheer/**`, `https://*-<groos-team>.vercel.app/beheer/**` | `https://www.groospersoneelsdiensten.nl/beheer/**`; tot livegang ook `https://groos-personeelsdiensten.vercel.app/beheer/**` |
| SMTP | ingebouwd: de standaardmailer bezorgt alleen bij leden van de organisatie Groos Personeelsdiensten; na de Resend-verificatie optioneel Resend met sleutel `groos-dev-smtp` | Resend, sleutel `groos-supabase-smtp` |
| Back-ups | niet nodig, alleen testdata | dagelijks, 7 dagen (Pro) |

`<groos-team>` is de slug van het Vercel-team van Groos (§10 C1).

### 5.4 DNS

**Stand op 2 oktober 2026 (publieke opvraging met `dig`).** Volledig noteren
gebeurt in §10 E1 vanuit het STRATO-klantenlogin, want daar staan ook records
die je niet kunt opvragen.

| Naam | Type | Waarde |
|---|---|---|
| `groospersoneelsdiensten.nl` | NS | `docks16.rzone.de`, `shades16.rzone.de` (STRATO) |
| `groospersoneelsdiensten.nl` | DS (bij SIDN) | `40904 8 2 0EA39626…7A801F0F`: DNSSEC staat aan |
| `groospersoneelsdiensten.nl` | A | `217.160.0.154` |
| `groospersoneelsdiensten.nl` | AAAA | `2001:8d8:100f:f000::200` |
| `groospersoneelsdiensten.nl` | MX | `5 smtp.rzone.de.` |
| `*.groospersoneelsdiensten.nl` | MX | `5 smtp.rzone.de.` (wildcard) |
| `groospersoneelsdiensten.nl` | TXT | geen (dus ook geen SPF) |
| `www` | CNAME | `groospersoneelsdiensten.nl.` |
| `autoconfig` | CNAME | `autoconfigure.strato.de.` |
| `_autodiscover._tcp` | SRV | `0 100 443 autoconfigure.strato.de.` |
| `_dmarc` | TXT | `v=DMARC1;p=reject;` |
| `_domainkey` | TXT | `o=~; t=y; r=dkim@rzone.de` |
| `strato-dkim-0002._domainkey` | TXT | `v=DKIM1; k=rsa; p=…` (sleutel van STRATO) |
| `strato-dkim-0003._domainkey` | TXT | `v=DKIM1; k=ed25519; p=…` (sleutel van STRATO) |
| CAA | geen | |

**Keuze: DNS blijft bij STRATO.** Alleen drie records voor Vercel veranderen;
alles voor de mailbox blijft. Motivatie:

1. Het domein heeft een werkende STRATO-mailbox met DKIM (twee sleutels),
   DMARC `p=reject`, een wildcard-MX, autoconfig en autodiscover. Bij een
   verhuizing naar Vercel DNS moet dat allemaal foutloos opnieuw, en STRATO kan
   eigen records later niet meer zelf bijwerken.
2. DNSSEC staat aan. Nameservers wisselen vraagt eerst DNSSEC uitzetten en
   wachten tot de DS-record bij SIDN verlopen is; een fout daarin maakt het
   hele domein onbereikbaar, ook de mail.
3. Vercel heeft voor deze site alleen een A-record en een CNAME nodig; Vercel
   schrijft zelf dat dan niets anders hoeft te verhuizen.
4. Resend en Search Console vragen een paar records op subdomeinen en het
   hoofddomein, die STRATO ook aankan.

Bij J. Versseput staan de nameservers wel bij Vercel; dat was daar een
domein zonder DNSSEC met mail bij Mijndomein. Voor Groos wijken we daar bewust
van af. Plan B staat in §10 E8.

**Doelrecords bij STRATO.**

| Naam | Type | Waarde | Wanneer | Doel |
|---|---|---|---|---|
| `groospersoneelsdiensten.nl` | A | waarde die Vercel toont onder Settings, Domains (meestal `76.76.21.21`) | livegang | kaal domein, Vercel stuurt met 308 naar `www` |
| `groospersoneelsdiensten.nl` | AAAA | verwijderen | livegang | botst met Vercel |
| `www` | CNAME | projectspecifieke waarde uit Vercel (vorm `<hash>.vercel-dns-0xx.com`) | livegang | hoofdadres |
| `send.mail` | MX | `10 feedback-smtp.eu-west-1.amazonses.com` (exact zoals Resend toont) | vroeg (§10 E3) | bounces van Resend |
| `send.mail` | TXT | `v=spf1 include:amazonses.com ~all` (exact zoals Resend toont) | vroeg | SPF voor Resend |
| `resend._domainkey.mail` | TXT | `p=MIGfMA0G…` (sleutel uit Resend) | vroeg | DKIM voor Resend |
| `groospersoneelsdiensten.nl` | TXT | `google-site-verification=…` | vroeg (§10 G1) | Search Console |
| alle records uit de tabel hierboven behalve A, AAAA en `www` | | ongewijzigd | nooit wijzigen | mail en DNSSEC |

DMARC: de bestaande `_dmarc` met `p=reject` geldt ook voor
`mail.groospersoneelsdiensten.nl` (geen `sp=`). Resend tekent met
`d=mail.groospersoneelsdiensten.nl` en gebruikt `send.mail` als
bounce-domein; beide zijn in de relaxte modus gelijkgericht met het
hoofddomein, dus DMARC slaagt. We passen de DMARC-record niet aan.

### 5.5 Resend

| Instelling | Waarde |
|---|---|
| Account | op `info@groospersoneelsdiensten.nl`, eigenaar Jimmy; Djulan als lid als het plan dat toelaat |
| Plan | Free (3.000 mails per maand, 100 per dag) bij lancering; Pro (20 dollar) als de daglimiet knelt of als de EU-regio alleen op Pro kan |
| Domein | `mail.groospersoneelsdiensten.nl`, regio `eu-west-1` (Ierland) |
| Tracking | open tracking uit, click tracking uit (B-09) |
| API-sleutels | `groos-productie` (Sending access, alleen dit domein) voor Vercel Production; `groos-preview` voor Vercel Preview; `groos-supabase-smtp` voor SMTP van `groos-prod`; `groos-dev-smtp` optioneel voor `groos-dev` |
| Afzender Auth-mails | `Groos Personeelsdiensten <beheer@mail.groospersoneelsdiensten.nl>` |
| Afzender sitemails | domein `mail.groospersoneelsdiensten.nl`, adres en naam volgens spec 11, `reply-to` `info@groospersoneelsdiensten.nl` (B-20) |
| Webhook | `https://www.groospersoneelsdiensten.nl/api/webhooks/resend`, gebeurtenissen `email.delivered`, `email.bounced`, `email.complained`, `email.failed`, `email.suppressed`; het signing secret gaat als `RESEND_WEBHOOK_SECRET` in Vercel Production |

### 5.6 WAF-regels (Vercel Firewall, project `groos-personeelsdiensten`)

| Naam | Voorwaarden (allemaal waar) | Actie | Start |
|---|---|---|---|
| `formulieren-per-ip` | methode `POST`; header `next-action` bestaat; pad begint niet met `/beheer` | rate limit 20 per 600 seconden per IP, daarna 429 | `log` tijdens previewtests, `rate_limit` bij livegang |
| `upload-per-ip` | methode `POST`; pad begint met `/api/upload` | rate limit 20 per 600 seconden per IP, 429 | idem |
| `beheer-inloggen` | methode `POST`; pad is `/beheer/inloggen`, `/beheer/mfa`, `/beheer/mfa/koppelen` of `/beheer/wachtwoord-vergeten` | rate limit 10 per 600 seconden per IP, daarna 429 | direct `rate_limit` (B-50) |
| `scanners` | pad in `/wp-admin`, `/wp-login.php`, `/xmlrpc.php`, `/.env`, `/.git/config`, `/phpmyadmin` | deny | `log` een week, dan `deny` |

Waarom 20 en niet 5: kandidaten delen soms één IP-adres (huisvesting, wifi op
een werkplek) en een sollicitatie met cv kost twee verzoeken. Na twee weken
logdata kan de grens naar 10. De beheerde regelset "Bot Protection" blijft
uit, omdat linkvoorbeelden van WhatsApp en LinkedIn voor gedeelde vacatures
belangrijk zijn; "AI Bots" staat op `log`. Rate-limitregels kosten op Pro
ongeveer 0,50 dollar per miljoen toegestane verzoeken.

### 5.7 Cron-schema

| Route (spec 10) | Schema (UTC) | Nederlandse tijd |
|---|---|---|
| `/api/cron/vacatures` | `*/15 * * * *` | elk kwartier |
| `/api/cron/bewaartermijnen` | `0 2 * * *` | 03.00 (winter) of 04.00 (zomer) |
| `/api/cron/opruimen` | `30 2 * * *` | 03.30 (winter) of 04.30 (zomer) |

`/api/cron/herinneringen` vervalt (fase 2, B-41).

Contract voor elke cron-route (spec 10 bouwt het): methode `GET`; eerste
controle `authorization === "Bearer " + process.env.CRON_SECRET` met een
vergelijking in constante tijd (`crypto.timingSafeEqual`); anders `401`;
idempotent; `export const maxDuration = 60`, tenzij de spec van de route een
hogere waarde met reden noemt (spec 15: `jobalerts` 300); antwoord `200` met een korte
JSON-samenvatting zonder persoonsgegevens.

### 5.8 Accounts en kosten

| Dienst | Account en eigenaar | Plan | Kosten per maand | Toegang Djulan | Verwerkersovereenkomst |
|---|---|---|---|---|---|
| GitHub | `jimmyv3-v3` (Jimmy) | Free | 0 | collaborator `skuu-os` | n.v.t. (geen persoonsgegevens in de repo) |
| Vercel | team "Groos Personeelsdiensten", eigenaar Jimmy | Pro | 20 dollar (platformfee met één plek en 20 dollar tegoed) | Member tijdens de bouw (20 dollar extra) of gratis Viewer | Vercel DPA (onderdeel van de voorwaarden, downloaden en bewaren) |
| Supabase productie | organisatie via de Marketplace, eigenaar Jimmy | Pro | 25 dollar, via de Vercel-factuur | Developer | Supabase DPA (dashboard, Organization, Legal Documents) |
| Supabase ontwikkeling | organisatie Groos Personeelsdiensten, Djulan | Free | 0 | eigenaar | n.v.t., alleen testdata |
| Resend | Groos (`info@`), eigenaar Jimmy | Free | 0 (Pro 20 dollar) | lid of via de kluis | Resend DPA |
| STRATO | Jimmy (domein en mail) | bestaand pakket | bestaand | via Jimmy | STRATO verwerkersovereenkomst (klantenlogin) |
| Google Search Console en Bedrijfsprofiel | Google-account van Groos | gratis | 0 | gebruiker of beheerder | n.v.t. |
| Bing Webmaster Tools | via hetzelfde Google-account | gratis | 0 | gebruiker | n.v.t. |
| Wachtwoordkluis | gedeelde kluis "Groos" (bijvoorbeeld Bitwarden of 1Password) | bestaand of gratis | 0 tot enkele euro's | lid | n.v.t. |
| Sinka B.V. (handelsnaam SKUU) | ontwikkelaar met toegang tot productiedata | n.v.t. | n.v.t. | n.v.t. | verwerkersovereenkomst tussen Groos en Sinka B.V. |

Totaal voor Groos: 45 dollar per maand in de basis (Vercel 20, Supabase 25,
Resend 0), 65 dollar met een Member-plek voor Djulan of met Resend Pro, 85
dollar met beide. Domein en mail bij STRATO lopen al. Exclusief btw.

## 6 Tekstelementen

Deze module voegt geen tekst toe aan `messages/`, `content/` of `lib/site.ts`.
Wel de volgende teksten buiten de site.

### 6.1 Auth-mails en afzender

De Nederlandse onderwerpen en teksten van de Supabase Auth-mails (Invite user,
Reset password en de drie Security notifications) staan in
`supabase/templates/*.html` (spec 11 §6.10) en worden in beide projecten
geplakt onder Authentication, Emails (§10 A2 en D7). Afzendernaam
overal "Groos Personeelsdiensten".

### 6.2 Pull request-sjabloon (`.github/pull_request_template.md`)

```markdown
### Wat deze pull request doet

Bouwstap en specs: (bijvoorbeeld stap 6, spec 07 en 11)

### Controle

- [ ] `npm run verify` slaagt lokaal
- [ ] `npm run check -- --warn` gedraaid; nieuwe TODO's zijn bewust
- [ ] Migraties: toegepast op groos-dev en getest op de preview
- [ ] Migraties: vóór het mergen toegepast op productie (alleen na livegang)
- [ ] Visueel gecontroleerd op 390, 768, 1280 en 1440 px (als er UI is)
- [ ] Geen geheimen in code, tests of beschrijving

### Acceptatiecriteria

(lijst van AC-id's die deze pull request groen maakt)
```

Commitberichten: Nederlands, kort en beschrijvend (BOUWINSTRUCTIE §6).

### 6.3 Beschrijving Google Bedrijfsprofiel

De beschrijving staat in spec 12 §6.5.

## 7 SEO

- **Hoofdhost.** `https://www.groospersoneelsdiensten.nl` is het enige
  canonieke adres; `site.url` in `lib/site.ts` (spec 01) heeft die waarde.
  Het kale domein en `http://` sturen met 308 door naar `https://www`.
- **Previews.** Vercel zet zelf `X-Robots-Tag: noindex` op alle
  niet-productiedeploys; daarnaast staan ze achter Vercel Authentication. De
  productie-URL op `vercel.app` heeft dezelfde canonicals naar `www`.
- **Niet-publieke paden.** `/beheer/**` en `/api/**` krijgen
  `X-Robots-Tag: noindex, nofollow` via `next.config.mjs` (§4.2), naast de
  metadata van spec 08 en de regels in `robots.ts` van spec 12.
- **Geen geo-redirect voor crawlers**: blijft zoals `proxy.ts` het regelt
  (spec 01). De CSP en headers veranderen niets aan wat crawlers zien.
- **Registraties na livegang** (Search Console, sitemap, Bing, Bedrijfsprofiel,
  controle Google for Jobs): §10 Deel G. Inhoud van sitemap, robots en
  JobPosting: spec 12.

## 8 Toegankelijkheid en performance

- **Regio.** Functies in `fra1`, database in Frankfurt: een query kost dan
  enkele milliseconden in plaats van een oversteek. Dat helpt de Lighthouse-eis
  van R-15 op vacaturepagina's.
- **Statisch blijft statisch.** De CSP zonder nonce laat statische pagina's
  en `unstable_cache` (B-35) intact; een nonce zou elke pagina dynamisch maken.
- **Lettertypen en beelden.** `font-src 'self'` past bij `next/font`
  (zelf gehost). Beelden uit Supabase lopen via `/_next/image` met
  `remotePatterns`, dus AVIF en WebP.
- **Scripts.** Alleen Vercel Analytics (cookieloos, eigen domein) en het
  kleine BotID-script; geen tag manager.
- **Toegankelijkheid.** Deze module heeft geen UI. De headers mogen geen
  bestaande functies breken (fonts, iconen, OG-afbeeldingen); dat toetst
  AC-13-27. De 429-pagina van de WAF is van Vercel; spec 07 toont bij een
  mislukte actie een eigen, gelabelde foutmelding.

## 9 21st.dev-opdracht voor sub-agents

Niet van toepassing. Deze module levert configuratie, accounts, DNS en
beveiliging en heeft geen enkel scherm of component dat een bezoeker of
beheerder ziet; er is dus geen plek waarvoor 21st.dev een element kan
aanleveren. De bouw-agent van deze module spawnt daarom geen 21st.dev-sub-agents
en roept `search`, `get_inspiration` en `get_component` niet aan.

## 10 Bouwopdracht

Legenda: **[Djulan]** vraagt een login, akkoord of handeling van Djulan;
**[Jimmy]** idem van Jimmy; **[agent]** kan de bouw-agent zelf. Deel A hoort
bij bouwstap 1. Deel B, E1, E2, E3 en G1 mogen zodra Jimmy toegang geeft. C1
tot en met C4 en C6 mogen daarna voor previews (B-14); de productiebuild van
`main` faalt dan tot D2, en dat is verwacht. D, E4 tot en met E9, F3 en de
productiedeploy horen bij bouwstap 10. Deel G (behalve G1) volgt na livegang,
Deel H bij de overdracht.

### Deel A. Localhost volledig werkend met gekoppelde database (vanavond)

**A0 Voorwaarden.**

1. [agent] `node -v` geeft `v24.x`; `supabase --version` geeft 2.104 of hoger;
   `docker` is niet nodig en wordt niet gebruikt.
2. [Djulan] `supabase login` in een terminal (opent de browser). Zonder deze
   login werken `link`, `db push` en `gen types` niet; zie A5 stap 5.
3. [agent] `/mcp` geauthenticeerd voor de projectgebonden server `supabase`
   uit `.mcp.json`; `get_project_url` werkt.
4. [Djulan] Een authenticator-app op de telefoon en een wachtwoordkluis.
5. Nooit uitvoeren: `supabase start`, `supabase stop`, `supabase db diff`,
   `supabase db pull`, `supabase db reset` (met of zonder `--linked`),
   `supabase config push`, `vercel link`, `vercel env pull`.
6. [agent] `psql` is geïnstalleerd (`psql --version`); anders draait de seed
   via `execute_sql`.

**A1 `groos-dev` controleren.**

1. [Djulan] Het databasewachtwoord van `groos-dev` staat in de kluis als
   "groos-dev database". Staat het er niet, dan zet Djulan het opnieuw
   (dashboard, Database, Settings, Reset database password) en bewaart het
   daar.
2. [agent] MCP `get_project_url` (server `supabase` uit `.mcp.json`) geeft
   `https://smcskfrkjgniinbhqnln.supabase.co`.

**A2 Auth-instellingen `groos-dev`** [Djulan, dashboard, Authentication].

1. Sign In / Providers: "Allow new users to sign up" (aanmelden) uit; Email
   aan; minimale wachtwoordlengte 12.
2. Sessions: refresh-tokenrotatie aan met reuse interval 10 s.
3. Sign In / Providers, Email: Email OTP Expiration 86400 s.
4. Multi-Factor: MFA TOTP enroll en verify aan.
5. URL Configuration: Site URL en Redirect URLs volgens §5.3 (de
   `vercel.app`-URL pas zodra de teamslug bekend is).
6. Plak de templates Invite user en Reset password plus de drie Security
   notifications uit `supabase/templates/*.html` (spec 11 §6.10) in
   Authentication, Emails.

**A3 `.env.local` vullen** [agent, waarden van Djulan].

1. `cp .env.example .env.local` (nadat `.env.example` uit §5.2 er staat).
2. `NEXT_PUBLIC_SUPABASE_URL` uit MCP `get_project_url`.
3. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` uit MCP `get_publishable_keys`
   (de `sb_publishable_`-sleutel) of het dashboard.
4. [Djulan] `SUPABASE_SECRET_KEY`: dashboard, Project Settings, API Keys,
   Secret keys, de standaardsleutel kopiëren. Nooit in de chat plakken;
   rechtstreeks in `.env.local`.
5. `CRON_SECRET=$(openssl rand -hex 32)`.
6. `EMAIL_FROM`, `EMAIL_DEV_TO`, `RESEND_API_KEY`: zie A8.
7. Controle: `git check-ignore -q .env.local && echo genegeerd` drukt
   "genegeerd" af.
8. `test ! -e .env && echo geen-env` drukt `geen-env` af; lokale waarden staan
   alleen in `.env.local`.
9. Laad in elke nieuwe terminal waarin je AC-opdrachten met `curl` draait eerst
   de lokale waarden: `set -a; . ./.env.local; set +a` (B-51).

**A4 Supabase in de repo** [agent].

1. `npx supabase init` (N op de vragen), daarna `supabase/config.toml` volgens
   §4.5.
2. `SUPABASE_DB_PASSWORD='<uit de kluis>' npx supabase link --project-ref smcskfrkjgniinbhqnln`
   (het wachtwoord alleen in die ene opdracht, niet in een bestand).
3. Controle: `cat supabase/.temp/project-ref` geeft `smcskfrkjgniinbhqnln`.

**A5 Migraties** [agent; de SQL-bestanden komen uit spec 10; de seed volgt in A7].

1. `npm run db:status` (lokale en remote versies naast elkaar).
2. `npx supabase db push --linked --dry-run` en controleer de lijst.
3. `npx supabase db push --linked`.
4. Controle met de MCP: `list_tables` (schema `public`) toont de tien tabellen
   uit spec 00 §4.3; `execute_sql` met
   `select id, public from storage.buckets order by id` geeft `cvs | false` en
   `public-media | true`; `get_advisors` type `security` geeft geen melding
   met niveau ERROR.
4a. [agent] REST-controle direct na `npx supabase db push --linked`: de `curl`
   op `occupations` uit A10 stap 1 geeft de vijf id's (AC-13-05). Geeft hij
   `{"code":"PGRST205",...}`, dan: (a) `cat supabase/.temp/project-ref` moet
   `smcskfrkjgniinbhqnln` geven, anders eerst A4 stap 2 (wachtwoord van Djulan
   uit de kluis) en daarna stap 1 tot en met 3; (b) MCP `execute_sql` met
   `select to_regclass('public.occupations'), to_regclass('public.public_vacancies')`;
   geeft dat `null`, dan `npm run db:status` en `npx supabase db push --linked`;
   (c) bestaan beide, dan zet [Djulan] in het dashboard onder Project Settings,
   Data API de Data API aan met `public` in Exposed schemas, en voert de agent
   via MCP `execute_sql` `notify pgrst, 'reload schema';` uit (B-57). Daarna de
   REST-controle opnieuw. Pas als die slaagt, volgen A6, A7 (seed) en AC-10-03.
5. Zonder CLI-login stopt de bouw-agent en vraagt Djulan om `supabase login`
   (A0 stap 2).
6. Elke latere migratie: `npx supabase migration new <naam>`, SQL schrijven,
   stap 2 en 3, dan A6.

**A6 Types** [agent].

1. `npm run db:types` schrijft `lib/database.types.ts` (eigenaar spec 10).
   Zonder CLI-login: MCP `generate_typescript_types` en het resultaat in dat
   bestand zetten.
2. `npm run typecheck` slaagt.

**A7 Eerste beheerder met MFA.**

1. [agent] `npm run db:admin -- --email <adres van Djulan> --full-name "Jimmy (test)" --display-name Jimmy --phone +31683351985`
   (gelijk aan spec 08 en 10; de seed kiest dit profiel als contactpersoon,
   AC-11-03).
2. [agent] seed: `psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/seed.sql`
   (of `execute_sql`), daarna `npm run db:types`.
3. [Djulan] Zodra spec 08 gebouwd is: `http://localhost:3000/beheer/inloggen`,
   inloggen, de QR-code scannen, de code invullen. Controle [agent]:
   `select factor_type, status from auth.mfa_factors where user_id = (select id from auth.users where email = '<…>')`
   geeft `totp | verified`.
4. Jimmy en Lorenzo krijgen in `groos-dev` een account met
   `npm run db:admin -- --email <adres> --full-name <naam> --display-name <voornaam> --phone <nummer> --password <uit de kluis>`,
   zonder uitnodigingsmail. Ze loggen op de preview in en koppelen daar hun
   authenticator-app. Uitnodigen en wachtwoordherstel per mail worden alleen
   op localhost en in productie getest.

**A8 Resend in ontwikkeling.** Contract voor `lib/email/*` (spec 11 bouwt het):

| Situatie | Gedrag |
|---|---|
| Geen `RESEND_API_KEY` (standaard vanavond) | Geen netwerkverzoek. De app logt per mail één blok in de terminal: `[e-mail] aan <ontvanger> · onderwerp <onderwerp> · template <naam>` plus de platte tekst. De actie slaagt gewoon. |
| Sleutel aanwezig, `VERCEL_ENV` is niet `production`, `EMAIL_DEV_TO` gezet | Elke mail gaat alleen naar `EMAIL_DEV_TO`; het onderwerp krijgt `[test voor <oorspronkelijke ontvanger>] ` ervoor; cc en bcc vervallen. Afzender is `EMAIL_FROM` als die gezet is. |
| Sleutel aanwezig, niet productie, `EMAIL_DEV_TO` leeg | Terug naar consolegedrag met één waarschuwing `[e-mail] EMAIL_DEV_TO ontbreekt, niets verstuurd`. Zo gaat lokaal nooit mail naar een vreemd adres. |
| `VERCEL_ENV` is `production` | Gewone verzending vanaf het eigen domein; `EMAIL_DEV_TO` en `EMAIL_FROM` worden genegeerd. |

Vanavond: [Djulan] kiest zelf of hij met een eigen Resend-sleutel test. Dan
`RESEND_API_KEY=<eigen sleutel>`,
`EMAIL_FROM="Groos Personeelsdiensten <onboarding@resend.dev>"` en
`EMAIL_DEV_TO=<adres van zijn Resend-account>` (Resend bezorgt vanaf
`onboarding@resend.dev` alleen aan dat adres).

**A9 BotID lokaal** [agent].

1. `npm install botid@^1.5.11`; bestanden uit §4.4; `next.config.mjs` uit
   §4.2.
2. `npm run dev`: een formulier versturen lukt. In de terminal kan BotID
   melden dat het als mens doorlaat omdat er geen bypass is ingesteld; dat is
   verwacht. (pas in bouwstap 6, als er formulieren zijn)
3. `BOTID_DEV_BYPASS=BAD-BOT` in `.env.local`, dev-server herstarten: hetzelfde
   formulier wordt geweigerd met de foutmelding van spec 07. Daarna de regel
   weer leegmaken. (pas in bouwstap 6, als er formulieren zijn)
4. `npm run build && npm start`: een formulier versturen lukt zonder
   OIDC-fout (de helper behandelt alles buiten Vercel als ontwikkeling).
   (pas in bouwstap 6, als er formulieren zijn)

**A10 Draaien en rooktest** [agent].

1. `npm run dev`, daarna in een tweede terminal de rooktest:

```bash
BASE=http://localhost:3000
for p in / /en /sitemap.xml /robots.txt /llms.txt /opengraph-image /icon /bestaat-niet; do
  printf "%-22s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' "$BASE$p")"
done
env_val() { grep "^$1=" .env.local | cut -d= -f2- | tr -d '"'; }
curl -s "$(env_val NEXT_PUBLIC_SUPABASE_URL)/rest/v1/occupations?select=slug" \
  -H "apikey: $(env_val NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)"
```

   Na bouwstap 1 verwacht: 200 voor de eerste zeven paden, 404 voor
   `/bestaat-niet`, en een JSON-lijst met precies de vijf id's uit spec 00 §4.2.

2. Na bouwstap 9, voor de deploy, de volledige rooktest (AC-13-10):

| Pad | Verwacht |
|---|---|
| `/`, `/en`, `/vacatures`, `/werkzoekenden`, `/werkgevers`, `/inschrijven`, `/over-ons`, `/contact`, `/privacyverklaring`, `/cookieverklaring`, `/klachtenregeling` | 200 |
| `/werken-als/glazenwasser` en de andere vier `/werken-als/<id>` | 200 |
| `/werkgevers/glazenwassers` en de andere vier werkgeversslugs | 200 |
| `/werkgevers/personeel-aanvragen`, `/werkgevers/wtta` | 200 |
| `/vacatures/<slug van een gepubliceerde seedvacature>` | 200 |
| `/vacatures/andere-tekst-<nummer van die vacature>` | 308 met `Location` naar de juiste slug |
| `/vacatures/bestaat-niet-999999` | 404 met `<meta name="robots" content="noindex"/>` |
| `/vacatures/onzin` | 404, en de HTML bevat "Deze pagina bestaat niet of niet meer" (B-55) |
| `/bedankt/sollicitatie` | 200 met `noindex` in de robots-meta |
| `/diensten/dienst-een`, `/werkgebied`, `/privacybeleid` | 404 |
| `/beheer` | 3xx naar `/beheer/inloggen` |
| `/api/cron/vacatures` zonder header | 401 |
| `/api/cron/vacatures` met `-H "Authorization: Bearer $(env_val CRON_SECRET)"` | 200 |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/opengraph-image`, `/icon` | 200 |

3. Headers: `curl -sI $BASE/ | grep -iE "content-security-policy|x-frame-options|x-content-type-options|referrer-policy|permissions-policy"`
   toont alle vijf; `curl -sI $BASE/beheer/inloggen | grep -i x-robots-tag`
   toont `noindex, nofollow`.
4. Geheim niet in de client: `npm run build` en daarna
   `grep -rlE "sb_secret_|re_[A-Za-z0-9]{20,}" .next/static || echo schoon`
   geeft "schoon".

### Deel B. GitHub

1. [Jimmy] Ingelogd als `jimmyv3-v3`: nieuwe repository
   `groos-personeelsdiensten`, **Private**, zonder README, `.gitignore` of
   licentie. Settings, Collaborators, Add people: `skuu-os`.
2. [agent] Uitnodiging accepteren: `gh api user/repository_invitations`
   (id noteren) en `gh api -X PATCH user/repository_invitations/<id>`.
3. [Djulan] Beslis wat mee gaat in de eerste push: `docs/HANDOVER-2.md`,
   `docs/specs/` en `context/` zonder `context/_input/` (zie §4.8). Controle
   [agent]: `git status --short` toont geen `.env.local` en geen
   `context/_input`. Controle [agent] vóór stap 4: `git ls-files docs/specs | wc -l`
   is gelijk aan `find docs/specs -type f | wc -l`, en
   `git ls-files docs/HANDOVER-2.md` geeft het bestand (B-58). `context/` gaat
   mee volgens B-58, zonder `context/_input/`.
4. [agent] `git remote add origin https://github.com/jimmyv3-v3/groos-personeelsdiensten.git`
   en `git push -u origin main`.
5. [agent] Repo-instellingen via `gh` of het dashboard: standaardbranch
   `main`; alleen "Squash merging" aan; "Automatically delete head branches"
   aan; Dependabot alerts aan; secret scanning en push protection aan als de
   instellingen dat voor een privérepo aanbieden. Branch-regels voor
   privérepo's vragen GitHub Pro; zonder Pro geldt de afspraak dat niemand
   rechtstreeks naar `main` pusht.
6. Branches, één per bouwstap uit spec 00 §6:
   `bouw/1-backend` (13, 10), `bouw/2-design` (02), `bouw/3-structuur` (01, 03),
   `bouw/3b-nazorg` (10, 14, 09 blok A, 03, nazorg 01, 02, 03 en 13 deel A),
   `bouw/4-paginas` (04, 05), `bouw/5-vacatures` (06, 12),
   `bouw/6-formulieren` (07, 11), `bouw/7-beheer` (08), `bouw/8-juridisch` (09),
   `bouw/9-kwaliteit` (14), `bouw/10-livegang` (13). Iteratierondes:
   `iteratie/<jjjj-mm-dd>-<onderwerp>`. Elke branch eindigt in een pull request
   naar `main` met het sjabloon uit §6.2; mergen na een groene `verify` en
   de poort uit spec 00 §6. Werk dat vóór de remote lokaal is gecommit
   (branch `bouw/fase-1`), gaat in de eerste push mee naar `main`.
7. Workflow en sjabloon uit §4.7 en §6.2 gaan mee in `bouw/1-backend`.

### Deel C. Vercel (bouwstap 10, previews mogen eerder volgens B-14)

**C1 Team** [Jimmy]. Maak in zijn eigen Vercel-account een team "Groos
Personeelsdiensten" op Pro, met de facturatie op Groos. Een apart team houdt
de kosten van J. Versseput en Groos gescheiden en geeft Groos een eigen
Supabase-organisatie via de Marketplace (één op één met het team). Noteer de
teamslug als `<groos-team>`.

**C2 Leden** [Jimmy]. Djulan als Member (20 dollar per maand, nodig om
instellingen, variabelen en firewall te beheren); Lorenzo als Viewer (gratis,
kan previews bekijken en opmerkingen plaatsen). Commits van `skuu-os` deployen
zonder lidmaatschapscontrole, omdat de repo onder een persoonlijk GitHub-account
staat.

**C3 Project importeren** [Jimmy, of Djulan na C2].

1. Add New, Project, GitHub. Installeer de Vercel GitHub App op
   `jimmyv3-v3` met "Only select repositories": `groos-personeelsdiensten`.
2. Projectnaam `groos-personeelsdiensten`, Framework Next.js, Root `./`,
   build en install standaard. Geen variabelen invullen in dit scherm.
3. De eerste productiebuild faalt omdat de Supabase-variabelen ontbreken. Dat
   is verwacht; hij wordt in D2 opnieuw gestart.

**C4 Projectinstellingen** [Djulan].

| Plek in Vercel | Instelling |
|---|---|
| Build and Deployment | Node.js Version 24.x (volgt ook uit `engines`) |
| Functions | Function Region Frankfurt `fra1` (ook in `vercel.ts`); Fluid compute aan |
| Environment Variables | Preview volgens §5.1 (alle branches); Production `RESEND_API_KEY`, `CRON_SECRET` en `RESEND_WEBHOOK_SECRET`; geheimen als Sensitive |
| Deployment Protection | Vercel Authentication, Standard Protection; Protection Bypass for Automation aan (de waarde staat als `VERCEL_AUTOMATION_BYPASS_SECRET` in het project en gaat in de kluis voor Playwright met header `x-vercel-protection-bypass`) |
| Security | OIDC Federation aan (standaard; BotID heeft het nodig) |
| Advanced | Skew Protection aan (Server Actions blijven werken tijdens een nieuwe deploy) |
| Git | Production Branch `main` |
| Analytics | Web Analytics aanzetten; Speed Insights uit |
| Notifications | mislukte deploys en mislukte cron-taken naar Djulan en Jimmy |

**C5 Configuratie in de repo.** `vercel.ts` (§4.3) gaat mee in
`bouw/10-livegang` of eerder. Na de eerste geslaagde productiedeploy toont
Settings, Cron Jobs de drie taken.

**C6 Previews delen.** Jimmy logt in bij Vercel; Lorenzo als Viewer of via
een kijklink uit de Vercel-toolbar ("Share"). Formulieren op een preview
schrijven naar `groos-dev`.

**C7 Nooit vanaf deze laptop:** `vercel link`, `vercel env pull`,
`vercel deploy`. De Vercel CLI is daar ingelogd in het SKUU-team. Alles gaat
via Git en het dashboard.

### Deel D. Productie-Supabase via de Vercel Marketplace

**D1 Aanmaken** [Jimmy, of Djulan als Member]. In het team "Groos
Personeelsdiensten": Storage (of Integrations), Supabase, Create. Naam
`groos-prod`, regio Frankfurt (`eu-central-1`), plan Pro. Biedt het scherm
Frankfurt niet aan, dan stoppen en Djulan inlichten (R-11).

**D2 Koppelen.** Connect Project, `groos-personeelsdiensten`, alleen de
omgeving **Production** aanvinken. Controle: onder Environment Variables staan
voor Production `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
en `SUPABASE_SECRET_KEY`; Preview houdt de waarden van `groos-dev`. Ontbreekt
een van deze drie of bevat hij een legacy-sleutel (`eyJ…` in plaats van
`sb_publishable_` of `sb_secret_`), voeg hem dan handmatig toe voor Production
met de waarde uit het dashboard van `groos-prod` (Project Settings, API Keys),
`SUPABASE_SECRET_KEY` als Sensitive. De door de integratie beheerde variabelen
blijven staan; de code leest ze niet. Daarna de mislukte productiedeploy
opnieuw starten (Redeploy).

**D3 Toegang Djulan.** In het Supabase-dashboard van de nieuwe organisatie,
Team, Invite: e-mailadres van Djulan als Developer. Niet-Vercel-leden worden
niet gesynchroniseerd, maar werken gewoon. De Supabase MCP van deze laptop ziet
het project alleen als Djulan lid is.

**D4 Migraties naar productie** [agent, met Djulan].

```bash
SUPABASE_DB_PASSWORD='<prod uit de kluis>' npx supabase link --project-ref <PROD_REF>
cat supabase/.temp/project-ref          # moet <PROD_REF> zijn
npm run db:status
npx supabase db push --linked --dry-run
npx supabase db push --linked           # nooit --include-seed
SUPABASE_DB_PASSWORD='<dev uit de kluis>' npx supabase link --project-ref smcskfrkjgniinbhqnln
cat supabase/.temp/project-ref          # terug op smcskfrkjgniinbhqnln
```

Referentiedata die productie nodig heeft (de vijf beroepen) staat in een
migratie, niet in de seed (spec 10). Na de push: Advisors (Security en
Performance) in het dashboard zonder ERROR.

Werkwijze daarna, per pull request met een migratie: eerst op `groos-dev`
(A5), testen op de preview, vlak voor het mergen naar productie pushen (D4),
dan mergen. Migraties zijn achterwaarts verenigbaar: eerst uitbreiden, dan
deployen, pas in een volgende migratie opruimen.

**D5 Auth-instellingen productie** [Djulan, dashboard, Authentication].
Dezelfde volledige lijst als A2, met de waarden van `groos-prod`:

1. Sign In / Providers: aanmelden uit; Email aan; minimale wachtwoordlengte
   12; "Leaked password protection" aan (Pro).
2. Sessions: refresh-tokenrotatie aan met reuse interval 10 s.
3. Sign In / Providers, Email: Email OTP Expiration 86400 s.
4. Multi-Factor: MFA TOTP enroll en verify aan.
5. URL Configuration: Site URL en Redirect URLs volgens §5.3; de tijdelijke
   `vercel.app`-URL na livegang verwijderen.

**D6 SMTP via Resend** (na E3, als het domein geverifieerd is).

1. Authentication, Emails, SMTP Settings, Enable custom SMTP.
2. Sender email `beheer@mail.groospersoneelsdiensten.nl`, sender name
   "Groos Personeelsdiensten", host `smtp.resend.com`, poort `465`, gebruiker
   `resend`, wachtwoord de sleutel `groos-supabase-smtp`.
3. Rate limit voor e-mails op 30 per uur laten staan.
4. Optioneel dezelfde instellingen in `groos-dev` met sleutel
   `groos-dev-smtp`, zodat uitnodigingen ook aan niet-leden van de organisatie
   Groos Personeelsdiensten bezorgd worden.

**D7 Mailteksten.** Plak de templates Invite user en Reset password plus de
drie Security notifications uit `supabase/templates/*.html` (spec 11 §6.10) in
Authentication, Emails van `groos-prod`.

**D8 Back-ups en kosten.** Pro maakt dagelijks een back-up met zeven dagen
bewaartijd; geen Point in Time Recovery (kost veel en botst met korte
bewaartermijnen). De dag na D1 controleren onder Database, Backups.
Herstelprocedure: Database, Backups, Restore; daarna meteen
`/api/cron/bewaartermijnen` handmatig aanroepen, omdat een herstelde back-up
gegevens kan terugbrengen die al verwijderd hadden moeten zijn. Spend cap aan
laten. SSL enforcement aan.

**D9 Oude sleutels.** Werkt productie een week zonder fouten, dan onder API
Keys de legacy JWT-sleutels (`anon`, `service_role`) uitzetten. De code
gebruikt alleen de nieuwe sleutels.

**D10 Verwerkersovereenkomst.** Organization, Legal Documents, DPA aanvragen
en ondertekenen op naam van Groos; bewaren bij de overdrachtsdocumenten. Of
de DPA via de Marketplace hetzelfde geldt, vragen we bij die stap aan Supabase
(context/11, te verifiëren).

**D11 Beheerders** (na E6, als `www` live is). Authentication, Users, Invite
user voor Jimmy en Lorenzo; daarna in de SQL-editor
`select public.grant_admin('<adres>', '<volledige naam>', 'Jimmy', 'owner', '+31683351985');`
en voor Lorenzo met zijn eigen gegevens; bij de eerste login de
authenticator-app koppelen.

### Deel E. Domein, DNS en e-mailrecords

**E1 Inventaris** [Djulan met Jimmy, vóór elke wijziging]. In het
STRATO-klantenlogin onder Domeinen, het domein, DNS: van elk onderdeel (A,
AAAA, CNAME, MX, TXT, SPF, DKIM, DMARC, SRV, subdomeinen, DNSSEC) een
schermafdruk en een tekstregel in `docs/infra/dns-inventaris.md`, met datum.
Vul de publieke stand uit §5.4 aan met wat alleen het klantenlogin toont.
Controleer ook dat het domein met "s" van Groos is en welke mailbox
`info@` gebruikt (B-02).

**E2 Keuze.** DNS blijft bij STRATO (§5.4). Djulan bevestigt; plan B in E8.

**E3 Resend-verzenddomein** (vroeg, raakt site en mailbox niet).

1. [Jimmy of Djulan] Resend-account volgens §5.5; Domains, Add Domain,
   `mail.groospersoneelsdiensten.nl`, regio `eu-west-1`.
2. [Djulan met STRATO-toegang] De drie records die Resend toont toevoegen
   (`send.mail` MX en TXT, `resend._domainkey.mail` TXT), exact zoals getoond.
   Waar STRATO eerst een subdomein vraagt, eerst `mail` en dan `send.mail`
   aanmaken.
3. In Resend "Verify"; wachten tot de status Verified is (meestal binnen een
   uur, maximaal 72 uur).
4. Open tracking en click tracking uit. API-sleutels volgens §5.5 aanmaken en
   in de kluis zetten; `groos-preview` en `groos-productie` in Vercel (C4).

**E4 Domeinen in Vercel** (bouwstap 10, vóór het omzetten). Settings, Domains:
`www.groospersoneelsdiensten.nl` toevoegen (Production); daarna
`groospersoneelsdiensten.nl` toevoegen met "Redirect to
www.groospersoneelsdiensten.nl", status 308. Vercel toont de A-waarde en de
projectspecifieke CNAME; noteer beide in `docs/infra/dns-inventaris.md`.

**E5 Voorwaarden voor omzetten.** Alle AC's van bouwstap 1 tot en met 9 groen
(E-13-20); `site.url` is `https://www.groospersoneelsdiensten.nl`; de
productiedeploy van `main` werkt op de `vercel.app`-URL (inloggen bij Vercel);
D1 tot en met D7 klaar; E3 Verified.

**E6 Omzetten** [Djulan met STRATO-toegang, op een werkdag voor 16.00 uur].

1. A-record van het kale domein naar de waarde uit Vercel.
2. AAAA-record van het kale domein verwijderen.
3. CNAME van `www` naar de projectspecifieke waarde uit Vercel.
4. Niets anders aanraken; DNSSEC blijft aan.
5. Wachten tot Settings, Domains voor beide domeinen "Valid Configuration" en
   een certificaat toont (meestal binnen een uur; de TTL bij STRATO is kort).

**E7 Controles direct na het omzetten** (AC-13-23 tot en met AC-13-25).

```bash
D=groospersoneelsdiensten.nl
dig +short A $D; dig +short AAAA $D; dig +short CNAME www.$D
dig +short MX $D; dig +short TXT _dmarc.$D; dig +short DS $D
curl -sI https://$D | grep -iE "^HTTP|^location"
curl -sI http://www.$D | grep -iE "^HTTP|^location"
curl -sI https://www.$D | head -1
curl -s -o /dev/null -w '%{http_code}' -X POST https://www.groospersoneelsdiensten.nl/api/dev/revalidate
```

De laatste opdracht geeft `404` (B-46).

Daarna een mail van een extern adres aan `info@` sturen en van `info@`
antwoorden; beide komen binnen vijf minuten aan. Dan de beheerders uitnodigen
(D11) en de tijdelijke `vercel.app`-redirect-URL in Supabase verwijderen.

**E8 Plan B: nameservers naar Vercel DNS.** Alleen als STRATO een van deze
dingen niet toelaat: de AAAA-record van het kale domein verwijderen, een CNAME
op `www`, een MX op `send.mail`, of een TXT op `resend._domainkey.mail`.
Werkwijze: (1) alle records uit `docs/infra/dns-inventaris.md` in Vercel DNS
aanmaken, inclusief wildcard-MX, beide STRATO-DKIM-sleutels, `_domainkey`,
`_dmarc`, `autoconfig`, `_autodiscover._tcp` en de Resend-records; (2) DNSSEC
bij STRATO uitzetten en 48 uur wachten tot de DS-record bij SIDN weg is
(`dig +short DS groospersoneelsdiensten.nl` leeg); (3) nameservers naar
`ns1.vercel-dns.com` en `ns2.vercel-dns.com`; (4) E7 opnieuw. Deze route
noteert de bouw-agent als afwijking in spec 00, met reden.

**E9 Domein zonder "s"** (aanbeveling, niet blokkerend). De variant van het
domein zonder "s" na "personeel" is al geregistreerd (DNS bij Mijndomein) en
staat op het Vercel-project. Djulan zet die variant in Vercel om naar een
redirect (308) naar `www.groospersoneelsdiensten.nl`. Dat vangt typefouten in
de briefing en op visitekaartjes op.

### Deel F. Beveiliging

**F1 Headers en CSP.** `next.config.mjs` volgens §4.2. Controle op de preview
met Playwright: geen CSP-meldingen in de console op `/`, een vacaturepagina
tijdens het versturen van het sollicitatieformulier en `/beheer/inloggen`
(AC-13-27). Op productie: securityheaders.com geeft minimaal een A.

**F2 BotID.** §4.4 en A9. Op Vercel werkt Basic zonder dashboardinstelling;
Deep Analysis blijft uit (kost 1 dollar per 1.000 controles). Komt er toch
spam door, dan eerst de logboeken bekijken en pas daarna Deep Analysis
overwegen (Djulan beslist).

**F3 WAF.** Regels uit §5.6 via Firewall, Rules in het dashboard (niet met de
CLI vanaf deze laptop). Elke regel eerst als `log`; tijdens het testen op de
preview met een extra voorwaarde `environment = preview` op de gewenste actie
zetten en controleren (AC-13-30); bij livegang de omgevingsvoorwaarde
verwijderen en publiceren. "Attack Challenge Mode" alleen bij een lopende
aanval, door Jimmy of Djulan.

**F4 `CRON_SECRET`.** Drie verschillende waarden (lokaal, Preview,
Production), elk 64 hextekens. Contract in §5.7. Vercel Cron stuurt de header
zelf zodra de variabele in het project staat.

**F5 Geheimbeheer.**

1. Eén gedeelde kluis "Groos" met: databasewachtwoorden van beide projecten,
   de vier Resend-sleutels, de drie `CRON_SECRET`-waarden, de
   bypass-waarde voor previews, herstelcodes van alle accounts.
2. Geheimen gaan alleen van de kluis naar Vercel of `.env.local`; nooit in
   een commit, pull request, issue, chatbericht of screenshot.
3. Roteren bij een vermoedelijk lek: Supabase (API Keys, nieuwe secret key
   aanmaken, in Vercel zetten, redeployen, oude intrekken), Resend (nieuwe
   sleutel, Vercel bijwerken, oude verwijderen), `CRON_SECRET` (nieuwe waarde,
   redeploy). Daarna een regel in `docs/infra/overdracht.md` met datum en
   reden, zonder de waarde.
4. Spec 14 voegt aan `scripts/check-launch.mjs` een controle toe die faalt als
   `git ls-files` een `.env`-bestand anders dan `.env.example` bevat of als een
   gevolgd bestand `sb_secret_` bevat.

**F6 Supabase-hardening (samenvatting).** Aanmelden uit; TOTP verplicht voor
alle beheerdata via `aal2` in de RLS (spec 10); SSL enforcement aan; legacy
sleutels uit (D9); Studio-toegang alleen voor Djulan en Jimmy, niet voor
dagelijks werk (context/11 §1.5).

**F7 Bewaken.** Vercel Notifications (C4) voor mislukte deploys en cron-taken;
Supabase stuurt Pro-meldingen over gebruik. Eén keer per week in de eerste
maand: Vercel Logs (fouten), Firewall (hits per regel), Resend (bounces).

### Deel G. Na livegang

**G1 Search Console** (de TXT mag vroeg, samen met E3). [Jimmy of Djulan]
Domeineigendom `groospersoneelsdiensten.nl` met de TXT-record op het kale
domein bij STRATO. Lukt een TXT op het kale domein daar niet, dan een
URL-voorvoegsel-eigendom `https://www.groospersoneelsdiensten.nl/` met de
HTML-tag via `metadata.verification.google` in `app/[locale]/layout.tsx`
(eigenaar spec 01). Jimmy is eigenaar, Djulan volledige gebruiker.

**G2 Sitemap.** `https://www.groospersoneelsdiensten.nl/sitemap.xml` indienen;
de status wordt "Geslaagd".

**G3 URL-inspectie** van `/`, `/vacatures`, één vacature en
`/werken-als/glazenwasser`: "URL staat op Google" of "indexering aangevraagd",
en bij de vacature het verbeteringsitem "Vacature" als geldig.

**G4 Bing Webmaster Tools.** Importeren vanuit Search Console; de sitemap komt
mee. Bing Places later vanuit het Bedrijfsprofiel importeren.

**G5 Google Bedrijfsprofiel** [Jimmy, met Djulan].

| Veld | Waarde |
|---|---|
| Naam | Groos Personeelsdiensten B.V. (exact als `lib/site.ts`) |
| Categorie | primair "Uitzendbureau" |
| Adres | Hugo Coenraadspad 6, 2553 ER Den Haag invoeren voor verificatie, daarna verbergen (B-23) |
| Servicegebied | Den Haag, tot de claim `workArea` bevestigd is (B-43); daarna ook Rijswijk, Delft, Westland, Zoetermeer, Leidschendam-Voorburg en Wassenaar |
| Telefoon | 06 52 54 95 39 (B-66) |
| Website | `https://www.groospersoneelsdiensten.nl/?utm_source=google&utm_medium=organic&utm_campaign=bedrijfsprofiel` |
| Openingstijden | pas invullen als B-22 bevestigd is |
| Diensten | de vijf beroepen in het meervoud uit spec 00 §4.2 |
| Beschrijving | spec 12 §6.5 |

Verificatie gaat waarschijnlijk via een video; plan die met Jimmy.

**G6 Google for Jobs.** Bij de eerste echte vacature: Rich Results Test op de
URL geeft "Vacature" geldig zonder fouten; na een paar dagen toont Search
Console onder Verbeteringen het rapport "Vacatures". Zoek daarna op
"vacature glazenwasser Den Haag" (of het beroep van die vacature) en kijk of
de vacature in het vacatureblok staat. Klikken via Google krijgen
`utm_source=google_jobs_apply`; spec 07 bewaart die in `applications.utm`.

**G7 Na een week.** Vercel Analytics (bezoek en conversie-events per formulier)
en Search Console (Pagina's, Vacatures) bekijken; bevindingen naar Djulan.

### Deel H. Eigendom, kosten en overdracht

**H1 Eigendom.** Volgens §5.8: elke dienst op naam van Groos met Jimmy als
eigenaar; Lorenzo krijgt toegang waar dat gratis is (Vercel Viewer, Search
Console gebruiker, Bedrijfsprofiel beheerder).

**H2 Kosten.** Jimmy bevestigt vóór D1 en C1 de bedragen uit §5.8. Vercel en
Supabase komen samen op de Vercel-factuur van het team Groos.

**H3 Verwerkersovereenkomsten.** Vercel, Supabase, Resend en STRATO (met Groos
als verwerkingsverantwoordelijke), plus een overeenkomst tussen Groos en
Sinka B.V. (handelsnaam SKUU), omdat Djulan bij productiedata kan. De lijst
van verwerkers in de privacyverklaring is van spec 09 en moet met deze lijst overeenkomen.

**H4 Overdracht** (STAPPENPLAN M). Djulan maakt `docs/infra/overdracht.md`
(zonder geheimen) met: per dienst de eigenaar, het plan, de kosten, wie
tweestapsverificatie heeft (verplicht voor alle eigenaren), waar de
herstelcodes staan (kluis), de afspraak wie de site technisch beheert, en de
procedures uit D4, D8 en F5. `docs/infra/overdracht.md` verwijst naar
`docs/compliance/verwerkersovereenkomsten.md` (spec 09); daar staat voor
Vercel, Supabase, Resend, STRATO en Sinka B.V. de status met datum.

**H5 Na de overdracht.** Djulan blijft Member als er een onderhoudsafspraak
is, anders Viewer of geen toegang. `groos-dev` blijft voor previews en
onderhoud zolang Djulan onderhoudt; stopt dat, dan maakt Groos een eigen
previewproject (fase 2) en verwijdert Djulan `groos-dev` na akkoord.

### Volgorde en poorten

| Stap | Delen | Poort |
|---|---|---|
| Bouwstap 1 | A0 tot en met A10, behalve A7 stap 3 en A9 stap 2 tot en met 4; §4.1 tot en met §4.8 | AC-13-01 tot en met AC-13-06, AC-13-11, AC-13-12 |
| Nazorg ronde 1 en 2 (bouwstap 3b, 00 §1a) | Eerst A5 stap 1 tot en met 4a (schemacontrole, B-57); daarna §4.2 (`next.config.mjs` met de toolbarbronnen voor previews) en §5.2 (`.env.example`) opnieuw toepassen; daarna `npm run verify` en de headercontrole uit A10 stap 3 | AC-13-04 en AC-13-05 vóór elke andere nazorg; AC-13-01 tot en met AC-13-06 opnieuw |
| Zodra Jimmy toegang geeft | B, E1, E2, E3, G1 (alleen de TXT) | AC-13-13, AC-13-14 |
| Previews (na Deel B, B-14) | C1 tot en met C4, C6 | AC-13-17; AC-13-18 zodra bouwstap 6 klaar is |
| Bouwstap 6 (na spec 07 en 11) | A9 stap 2 tot en met 4 | AC-13-08, AC-13-09 |
| Bouwstap 7 (na spec 08) | A7 stap 3 | AC-13-07 |
| Na bouwstap 9 | A10 volledige rooktest | AC-13-10 |
| Bouwstap 10 | C5, D1 tot en met D10, E4 tot en met E7, D11, F | AC-13-15, AC-13-16, AC-13-19 tot en met AC-13-31, AC-13-37, AC-13-38 |
| Na livegang | G | AC-13-32 tot en met AC-13-34 |
| Overdracht | H | AC-13-35, AC-13-36 |

Na elke stap `npm run verify`; na wijzigingen in `next.config.mjs` ook de
headercontrole uit A10 stap 3.

## 11 Acceptatiecriteria

- AC-13-01 MCP `get_project_url` (projectgebonden server `supabase` uit
  `.mcp.json`) geeft `https://smcskfrkjgniinbhqnln.supabase.co`; het dashboard
  toont organisatie Groos Personeelsdiensten, regio eu-central-1 en status
  healthy. Dekt: E-13-01.
- AC-13-02 `.env.local` bevat de vijf vaste variabelen met waarden;
  `git check-ignore -q .env.local` geeft exitcode 0; `git ls-files | grep -E "^\.env"`
  geeft alleen `.env.example`; `test ! -e .env && echo geen-env` drukt
  `geen-env` af. Dekt: E-13-03, E-13-17.
- AC-13-03 `npm run db:status` toont voor `groos-dev` elke lokale migratie ook
  als remote, zonder verschil. Dekt: E-13-02.
- AC-13-04 In `groos-dev` bestaan de tien tabellen uit spec 00 §4.3 in schema
  `public`; `storage.buckets` geeft `cvs` met `public = false` en
  `public-media` met `public = true`; de security-advisors geven geen ERROR. Dekt: E-13-01, E-13-02.
- AC-13-05 De REST-aanroep uit A10 stap 1 op `occupations` geeft precies de
  vijf id's `glazenwasser`, `schoonmaker`, `logistiek-medewerker`,
  `verhuizer` en `hulpkracht-bouw-en-sloop`. Dekt: E-13-01, E-13-02.
- AC-13-06 `lib/database.types.ts` is gegenereerd uit `groos-dev` en
  `npm run typecheck` slaagt. Dekt: E-13-01, E-13-02.
- AC-13-07 Djulan heeft in `groos-dev` een gebruiker met een rij in
  `admin_profiles` (rol `owner`) en een TOTP-factor met status `verified`;
  inloggen op `http://localhost:3000/beheer/inloggen` vraagt na het wachtwoord
  de code (na bouwstap 7). Dekt: E-13-01.
- AC-13-08 Zonder `RESEND_API_KEY` verschijnt bij een lokale
  formulierinzending per mail een `[e-mail]`-blok in de terminal en gaat er
  geen verzoek naar `api.resend.com`; met sleutel en `EMAIL_DEV_TO` komen alle
  mails alleen op dat adres binnen, met `[test voor …]` in het onderwerp. Dekt: E-13-04.
- AC-13-09 Lokaal met `BOTID_DEV_BYPASS=BAD-BOT` wordt een formulier
  geweigerd en ontstaat er geen record; zonder die waarde ontstaat het record;
  onder `npm start` treedt geen OIDC-fout op. Dekt: E-13-05.
- AC-13-10 De volledige rooktest uit A10 stap 2 geeft voor elk pad de
  verwachte status, op localhost en daarna op de preview-URL met de
  bypass-header. Dekt: E-13-09, E-13-14, E-13-16, E-13-20.
- AC-13-11 Na `npm run build` geeft
  `grep -rlE "sb_secret_|re_[A-Za-z0-9]{20,}" .next/static` geen treffers. Dekt: E-13-17.
- AC-13-12 Elke naam uit
  `grep -rhoE "process\.env\.[A-Z0-9_]+" app components lib emails i18n proxy.ts instrumentation-client.ts next.config.mjs | sort -u`
  staat in `.env.example` of is een van `NODE_ENV`, `VERCEL`, `VERCEL_ENV`,
  `VERCEL_URL`, `NEXT_RUNTIME`. Dekt: E-13-03.
- AC-13-13 `gh repo view jimmyv3-v3/groos-personeelsdiensten --json visibility`
  geeft `PRIVATE`; `gh api repos/jimmyv3-v3/groos-personeelsdiensten/collaborators/skuu-os/permission`
  geeft minstens `write`. Dekt: E-13-06.
- AC-13-14 Vanaf het moment dat de remote bestaat, is elke bouwstap als pull
  request vanaf een `bouw/`-branch gemerged; de workflow `verify` is op elk
  van die pull requests groen. Dekt: E-13-06.
- AC-13-15 Het project `groos-personeelsdiensten` staat in het team van Groos
  (Pro); de buildlog toont Node 24; `curl -sI https://www.groospersoneelsdiensten.nl/api/cron/vacatures | grep -i x-vercel-id`
  bevat `fra1`. Dekt: E-13-07, E-13-08.
- AC-13-16 `npm run config:check` slaagt; voor elk `path` in `vercel.ts`
  bestaat `app<path>/route.ts`; na de eerste productiedeploy toont Settings,
  Cron Jobs dezelfde taken en schema's als §5.7. Dekt: E-13-08, E-13-16.
- AC-13-17 Een preview-URL zonder Vercel-login of bypass-header geeft 401 of
  een doorverwijzing naar de Vercel-login; met de bypass-header geeft hij 200
  en `x-robots-tag: noindex`. Dekt: E-13-09.
- AC-13-18 Een testsollicitatie op een preview levert een rij in
  `applications` van `groos-dev` en geen rij in `groos-prod`. Dekt: E-13-09.
- AC-13-19 `groos-prod` staat in regio `eu-central-1` op Pro in de
  Marketplace-organisatie van het team Groos; `npm run db:status` gelinkt aan
  productie toont geen verschil met de repo; er staan geen seedvacatures in
  `vacancies`. Dekt: E-13-02, E-13-11.
- AC-13-20 `curl -s -X POST "$PROD_URL/auth/v1/signup" -H "apikey: <publishable>" -H "Content-Type: application/json" -d '{"email":"test@example.org","password":"Lang-genoeg-123"}'`
  geeft een fout dat aanmelden uitgeschakeld is; de Site URL is
  `https://www.groospersoneelsdiensten.nl`. Dekt: E-13-11.
- AC-13-21 Een wachtwoordherstel voor Jimmy komt binnen vanaf
  `beheer@mail.groospersoneelsdiensten.nl`; de headers tonen `dkim=pass`
  met `header.d=mail.groospersoneelsdiensten.nl` en `dmarc=pass`. Dekt: E-13-11, E-13-13.
- AC-13-22 Een dag na D1 toont Database, Backups in `groos-prod` minstens één
  dagelijkse back-up. Dekt: E-13-11.
- AC-13-23 Na E6: `dig +short A groospersoneelsdiensten.nl` geeft de waarde
  uit Vercel; `dig +short AAAA` is leeg; `dig +short CNAME www.groospersoneelsdiensten.nl`
  geeft de waarde uit Vercel; `dig +short MX` geeft `5 smtp.rzone.de.`;
  `_dmarc` geeft `v=DMARC1;p=reject;`; `dig +short DS` geeft nog de DS-record. Dekt: E-13-12.
- AC-13-24 `https://groospersoneelsdiensten.nl` en `http://www.groospersoneelsdiensten.nl`
  geven 308 met `Location: https://www.groospersoneelsdiensten.nl/…`;
  `https://www.groospersoneelsdiensten.nl/` geeft 200 met een geldig
  certificaat. Dekt: E-13-12.
- AC-13-25 Na E6 komt een externe mail aan `info@groospersoneelsdiensten.nl`
  binnen vijf minuten aan, en een antwoord vanaf `info@` komt bij Gmail binnen
  met `dmarc=pass`. Dekt: E-13-12.
- AC-13-26 Resend toont `mail.groospersoneelsdiensten.nl` als Verified in
  `eu-west-1`, met open en click tracking uit; een bevestigingsmail van
  productie scoort op mail-tester.com 9 of hoger en toont `spf=pass`,
  `dkim=pass` en `dmarc=pass`. Dekt: E-13-13.
- AC-13-27 Op `https://www.groospersoneelsdiensten.nl/` staan
  `content-security-policy`, `x-frame-options: DENY`,
  `x-content-type-options: nosniff`, `referrer-policy` en
  `permissions-policy`; securityheaders.com geeft minimaal A; Playwright ziet
  geen CSP-meldingen in de console op `/`, op een vacaturepagina tijdens het
  versturen van het formulier (preview, BotID actief) en op `/beheer/inloggen`;
  op de preview opent de toolbar zonder CSP-meldingen. Dekt: E-13-14.
- AC-13-28 `/beheer/inloggen`, `/beheer` en `/api/cron/vacatures` geven
  `x-robots-tag: noindex, nofollow`. Dekt: E-13-14.
- AC-13-29 BotID werkt op de preview: het sollicitatieformulier slaagt vanuit
  een gewone browser; een `curl -X POST` die een echte inzending naspeelt
  (zelfde `next-action`-id, bypass-header en formulierdata, gekopieerd uit de
  netwerktab) wordt door `isBotRequest()` geweigerd en levert geen record op;
  ook met cookie `NEXT_LOCALE=en` en header `x-vercel-ip-country: PL` slaagt de
  sollicitatie op de preview. Dekt: E-13-05.
- AC-13-30 Met de regel `formulieren-per-ip` actief voor preview krijgt de
  21e POST met `next-action`-header binnen tien minuten vanaf één IP-adres
  een 429; de Firewall-pagina toont die treffers. Dekt: E-13-15.
- AC-13-31 `curl -s -o /dev/null -w "%{http_code}" https://www.groospersoneelsdiensten.nl/api/cron/vacatures`
  geeft 401; de cron-logboeken in Vercel tonen voor `/api/cron/vacatures`
  elke vijftien minuten een 200. Dekt: E-13-16.
- AC-13-32 Search Console toont het domeineigendom als geverifieerd en de
  sitemap met status "Geslaagd"; de Rich Results Test geeft voor één
  productievacature "Vacature" geldig. Dekt: E-13-18.
- AC-13-33 Bing Webmaster Tools toont de site als geverifieerd met de sitemap. Dekt: E-13-18.
- AC-13-34 Het Bedrijfsprofiel staat online met categorie Uitzendbureau, een
  verborgen adres, het servicegebied uit G5 en dezelfde naam en hetzelfde
  telefoonnummer als `lib/site.ts`. Dekt: E-13-18.
- AC-13-35 `docs/infra/overdracht.md` bestaat, bevat geen geheimen
  (`grep -cE "sb_secret_|sb_publishable_|re_[A-Za-z0-9]{20,}|[0-9a-f]{64}" docs/infra/overdracht.md`
  geeft 0) en noemt per dienst uit §5.8 de eigenaar, het plan en de status
  van tweestapsverificatie. Dekt: E-13-17, E-13-19.
- AC-13-36 `docs/infra/overdracht.md` verwijst naar
  `docs/compliance/verwerkersovereenkomsten.md` (spec 09); daar staat voor
  Vercel, Supabase, Resend, STRATO en Sinka B.V. de status met datum. Dekt: E-13-19.
- AC-13-37 De DNS-wijziging van E6 is pas gedaan nadat de acceptatiematrix
  van spec 14 groen was; de pull request van `bouw/10-livegang` verwijst naar
  dat resultaat. Dekt: E-13-20.
- AC-13-38 Settings, Analytics van het Vercel-project toont Web Analytics aan;
  de HTML van `https://www.groospersoneelsdiensten.nl/` laadt
  `/_vercel/insights/script.js` en geen ander analytisch script
  (`curl -s https://www.groospersoneelsdiensten.nl/ | grep -ciE "googletagmanager|google-analytics"`
  geeft 0). Dekt: E-13-10.

## 12 Open vragen en aannames

| Onderwerp | Aanname in deze spec | Bevestigt | Gevolg als het anders is |
|---|---|---|---|
| Vercel-team | Nieuw Pro-team "Groos Personeelsdiensten" in Jimmy's account, los van J. Versseput. | Jimmy | Bestaand team van Jimmy: geen extra platformfee, wel gedeelde factuur en de Supabase-organisatie bij dat team. Is zijn huidige team Hobby, dan moet het naar Pro (commercieel gebruik). |
| Plek voor Djulan | Member tijdens de bouw (20 dollar per maand). | Jimmy | Viewer: Jimmy voert C3, C4, D1, D2, E4 en F3 zelf uit tijdens een gedeeld scherm. |
| Previews en data | Previews draaien tegen `groos-dev`, in de dev-organisatie Groos Personeelsdiensten van Djulan. | Djulan | Previews tegen productie: D2 ook Preview aanvinken; testdata vóór livegang opruimen; na livegang niet meer testen op previews. |
| DNS | Blijft bij STRATO; plan B is Vercel DNS met DNSSEC eerst uit. | Djulan, Jimmy (toegang STRATO) | Plan B: E8 en een notitie in spec 00. |
| DMARC | De bestaande `p=reject` blijft ongewijzigd, zonder rapportadres. | Jimmy | Rapporten gewenst: `rua=mailto:` toevoegen aan dezelfde record. |
| Resend | Eigen account van Groos, Free, regio `eu-west-1`. | Jimmy | EU-regio alleen op Pro: Pro nemen (plus 20 dollar), niet uitwijken naar de VS (R-11). |
| Eigenaarschap BotID | `instrumentation-client.ts` en `lib/security/botid.ts` zijn van spec 13; spec 07 en 08 roepen `isBotRequest()` aan. | kruiscontrole met 07 en 08 | Legt spec 07 het anders vast: één eigenaar kiezen, protect-lijst blijft gelijk. |
| Uploadroute | Een API-route onder `/api/upload/` (spec 07). | spec 07 | Upload via een Server Action op de vacaturepagina: regel `/api/upload/*` vervalt uit BotID en WAF. |
| Inlogpad beheer | `/beheer/inloggen`, met dezelfde WAF-regel voor `/beheer/mfa`, `/beheer/mfa/koppelen` en `/beheer/wachtwoord-vergeten` (B-50). | spec 08 | Ander pad: BotID-lijst, WAF-regel en AC-13-27 en AC-13-28 aanpassen. |
| Cron-routes | Drie routes van spec 10 §4.6 (`vacatures`, `bewaartermijnen`, `opruimen`); `herinneringen` is fase 2 (B-41). | spec 10 | Lijst in `vercel.ts` en §5.7 volgt spec 10. |
| Seed en referentiedata | De vijf beroepen staan in een migratie; `seed.sql` bevat alleen testdata en is idempotent. | spec 10 | Beroepen alleen in de seed: aparte SQL voor productie, eenmalig via de SQL-editor. |
| Beheerders | Profielen ontstaan met `npm run db:admin` (A7) en `public.grant_admin(...)` (D11) uit spec 10. | spec 10 | Wijzigt de signatuur in spec 10, dan volgen A7 en D11. |
| `vercel.ts` | `@vercel/config` 0.8.0 werkt met de Git-integratie. | Djulan | Terugval naar `vercel.json` volgens §4.3. |
| Sleutels via de Marketplace | De Supabase-integratie zet voor Production `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` en `SUPABASE_SECRET_KEY` met de nieuwe sleutels (`sb_publishable_`, `sb_secret_`). | controle in D2 | Ontbreekt een variabele of is het een legacy-sleutel (`eyJ…`): handmatig toevoegen uit het dashboard van `groos-prod` (D2); de beheerde variabelen blijven staan. |
| Eerste beheerder op `groos-dev` | `npm run db:admin` maakt met het adres van Djulan het profiel "Jimmy (test)" aan, gelijk aan spec 08 en 10; de seed kiest dit profiel als contactpersoon (AC-11-03). | spec 10 en 11 | Andere naam of telefoon in spec 10: A7 stap 1 volgt. |
| CSP en BotID | Het BotID-script werkt met `frame-src 'self'` en `worker-src 'self' blob:`. | test op de preview (AC-13-27) | Ontbrekende bron gericht toevoegen; lukt dat niet, CSP tijdelijk als `Content-Security-Policy-Report-Only` en een notitie in spec 00. |
| `context/_input/` | Gaat niet in Git (persoonsgegevens). | Djulan | Wel committen: alleen in deze privérepo, en vermelden in de overdracht. |
| Eerste push | `docs/specs/`, `docs/HANDOVER-2.md` en `context/` (zonder `context/_input/`) gaan mee in de eerste push; de agent controleert dat vóór Deel B stap 4 (B-58). | Djulan | `context/` blijft lokaal: alleen de laatste zin van Deel B stap 3 vervalt; de controle op `docs/specs` en `docs/HANDOVER-2.md` blijft. |
| Data API `groos-dev` | De Data API staat aan met `public` in Exposed schemas, zodat de REST-controle uit A5 stap 4a en de app de tabellen en de view `public_vacancies` zien (B-57). | Djulan | Staat hij uit of mist `public`: PGRST205 op elke REST-aanroep; A5 stap 4a (c) herstelt dat. |
| Domein zonder "s" | Aanbevolen om te registreren en door te sturen. | Jimmy | Niet registreren: geen gevolg voor de bouw. |
| Google-account | Search Console en Bedrijfsprofiel op een Google-account van Groos (bijvoorbeeld op `info@`). | Jimmy | Persoonlijk account van Jimmy: werkt, maar overdracht is lastiger. |
| Openingstijden in het Bedrijfsprofiel | Pas na bevestiging (B-22). | Jimmy en Lorenzo | Geen gevolg voor de bouw. |
| Servicegebied in het Bedrijfsprofiel | Alleen Den Haag tot de claim `workArea` bevestigd is (B-43). | Jimmy en Lorenzo | Bevestigd: de zes andere plaatsen uit G5 toevoegen. |
