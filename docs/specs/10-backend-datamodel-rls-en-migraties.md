# 10 Backend: datamodel, RLS, storage, migraties en data-laag

| Status | Fase | Hangt af van | Bronnen |
|---|---|---|---|
| concept, ter goedkeuring aan Djulan | 1 | geen (spec 13 levert `.env.example` en de cron-configuratie in Vercel) | context/11 §1.8, §2, §3, §7, §8, §9.1; context/09 §5, §7; context/04; context/01; 00 §3.2 (B-06, B-07, B-12, B-15 tot en met B-19, B-21, B-32, B-35 tot en met B-39, B-41, B-42, B-46, B-48, B-51), 00 §4; `node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md`, `.../04-functions/revalidateTag.md`, `.../updateTag.md`, `.../after.md` |

## 1 Doel

Deze module levert de complete backend van fase 1 op het Supabase-project
`groos-dev`: het datamodel als SQL-migraties, de Row Level Security per rol,
de Storage-buckets voor cv's en beelden, de Supabase-clients voor Next.js, de
gecachte leesfuncties in `lib/data/*` waar de publieke pagina's op draaien, de
geplande taken voor de levenscyclus van vacatures en de bewaartermijnen, en
een seed waarmee localhost direct vacatures toont. Alles werkt zonder Docker
tegen een echt Supabase-project, zodat Djulan morgen alleen nog aan de
frontend hoeft te itereren. De migraties in de repo zijn de enige bron van het
schema; productie krijgt later precies dezelfde bestanden (spec 13).

## 2 Gebruikers en scenario's

Werkzoekende

1. S-10-01: Een werkzoekende opent `/vacatures` en ziet alleen vacatures die
   online staan, met filters en tellers die kloppen met de lijst.
2. S-10-02: Een werkzoekende opent een oude link naar een vacature die vorige
   week is vervuld. Hij ziet de vacature met een melding dat die gesloten is;
   na 30 dagen geeft dezelfde link een 404.
3. S-10-03: Een werkzoekende solliciteert met een cv. Het bestand gaat via een
   signed upload URL rechtstreeks naar de privébucket `cvs` en de sollicitatie
   komt als record in `applications`.

Werkgever

4. S-10-04: Een werkgever vraagt personeel aan. De aanvraag komt als record in
   `staff_requests` met een referentie zoals `P-2026-0001`.

Beheerder (Jimmy of Lorenzo)

5. S-10-05: Een beheerder logt in met wachtwoord en authenticator-app. Pas na
   de tweede stap (`aal2`) geeft de database hem toegang tot sollicitaties.
6. S-10-06: Een beheerder publiceert een vacature. De database weigert dat als
   een verplicht veld uit B-06 ontbreekt, en zet anders publicatiedatum,
   sluitdatum (45 dagen) en slug.
7. S-10-07: Een beheerder plant een vacature in voor maandag 07.00 uur. De
   geplande taak zet hem op dat moment online; de publieke view toont hem ook
   als de taak een keer te laat is.
8. S-10-08: Een beheerder bekijkt een cv. Hij krijgt een link die 60 seconden
   werkt, en de weergave komt in het logboek.

Systeem en ontwikkelaar

9. S-10-09: Elke nacht anonimiseert de bewaartermijntaak sollicitaties waarvan
   de termijn is verlopen, verwijdert de bijbehorende cv's uit Storage en
   verwijdert oude aanvragen, berichten en logregels.
10. S-10-10: Djulan zet op een laptop zonder Docker het schema neer met
    `supabase db push`, maakt een testbeheerder aan, laadt de seed en ziet op
    `http://localhost:3000/vacatures` zes testvacatures.

## 3 Scope

### 3.1 Wel in fase 1

| Id | Eis | Dient |
|---|---|---|
| E-10-01 | Het datamodel bevat precies de tien tabellen uit 00 §4.3 (`admin_profiles`, `occupations`, `vacancies`, `vacancy_translations`, `applications`, `staff_requests`, `contact_messages`, `activities`, `email_log`, `audit_log`), met de statussen uit 00 §4.3 als Postgres-enums. | R-02, R-03, R-04, R-19 |
| E-10-02 | Een vacature heeft alle velden die B-06 voor publiceren eist, een minimumleeftijd met arbo-reden (B-32) en een salaris dat altijd bruto per uur in euro is, met minimum en maximum. | R-02, R-10, R-12 |
| E-10-03 | Het vacaturenummer loopt vanaf 1001 via een sequence en is onveranderlijk; de slug is `<functie>-<plaats>-<nummer>` en wordt door een trigger opgebouwd (B-15). | R-09, R-10 |
| E-10-04 | De database dwingt de levenscyclus van B-15 af: toegestane statusovergangen, publicatiecontrole, 30 dagen zichtbaar na sluiten en daarna onzichtbaar. | R-10 |
| E-10-05 | Anonieme bezoekers lezen alleen via de view `public_vacancies` en de RLS-policies; concepten, geplande en gearchiveerde vacatures en alle persoonsgegevens zijn voor hen onbereikbaar. | R-02, R-11 |
| E-10-06 | Publieke formulieren schrijven alleen server-side met de secret key; er bestaat geen insert-policy voor anoniem. | R-04, R-11 |
| E-10-07 | Elke beheerpolicy eist een actief profiel en MFA-niveau `aal2` via `is_admin()` of `is_owner()`. | R-03, R-11 |
| E-10-08 | Bucket `cvs` is privé, maximaal 10 MB, alleen pdf, doc en docx; uploads via signed upload URL; lezen via signed URL van 60 seconden met logregel. Bucket `public-media` is openbaar, maximaal 5 MB, alleen jpg, png en webp. | R-04, R-11 |
| E-10-09 | De bewaartermijnen van B-07 worden automatisch uitgevoerd, inclusief Storage-objecten, met termijnen die op één plek staan. | R-11 |
| E-10-10 | `audit_log` kan alleen worden aangevuld; regels jonger dan 2 jaar zijn niet te wijzigen of te verwijderen. | R-11 |
| E-10-11 | `lib/data/*` levert getypeerde, gecachte leesfuncties met filters volgens B-16, caching volgens B-35 en een revalidatiehulp voor mutaties. | R-02, R-09, R-15 |
| E-10-12 | Geplande taken draaien als route handlers onder `/api/cron/*`, zijn beveiligd met `CRON_SECRET` en zijn idempotent. | R-10, R-11 |
| E-10-13 | De werkwijze werkt zonder Docker tegen `groos-dev`; migraties, seed en typegeneratie staan als commando's in deze spec. | R-17 |
| E-10-14 | `supabase/seed.sql` vult localhost met tien herkenbare testvacatures in verschillende statussen, een testsollicitatie, een testinschrijving, een testaanvraag en een testbericht, zonder echte persoonsgegevens. | R-11, R-17 |
| E-10-15 | De app gebruikt alleen de nieuwe sleutels `sb_publishable_...` en `sb_secret_...`; de secret key staat alleen in `lib/supabase/admin.ts` met `import "server-only"`. | R-11 |
| E-10-16 | Vacatureteksten staan in `vacancy_translations` met een taalkolom, zodat Engels in fase 2 geen nieuwe tabel vraagt (spec 15 voegt alleen kolommen voor publicatie en controle toe); fase 1 schrijft alleen `nl` (B-03). | R-13, R-20 |
| E-10-17 | De vaste waardensets (dienstverband, uren-buckets, diensten, opleiding, ervaring, kwalificaties, sluitreden en de overige enums) staan als enum in de database en als constante in `lib/data/options.ts`, zodat alle specs dezelfde waarden gebruiken. | R-19 |

### 3.2 Niet in fase 1

- Tabellen `locations`, `qualifications`, `vacancy_qualifications`,
  `vacancy_internal`, `vacancy_templates`, `settings`, `candidates`,
  `job_alerts` en `privacy_requests` uit context/11 §2.4. Plaats is een
  genormaliseerde tekstkolom, kwalificaties zijn een enum-array en
  bedrijfsgegevens blijven in `lib/site.ts` (00 §4.4).
- Webadres handmatig aanpassen, sjablonen, een cao-veld per vacature (B-24),
  Engelse vacatureteksten, de Google Indexing API, feeds, de dagelijkse
  samenvatting en een `before-user-created`-hook.
- Lokale Supabase-stack (`supabase start`), omdat Docker ontbreekt.

### 3.3 Fase 2 (voorbereid)

`vacancy_translations` met `locale = 'en'`, extra enum-waarden voor talen,
dienstverband `freelance` en `on_call`, de talentpool via `candidates`, en
een eigen `settings`-tabel. Elk daarvan is één nieuwe migratie.

## 4 Pagina's en componenten

Deze module heeft geen pagina's en geen UI. Ze levert modules, route handlers
en scripts die andere specs gebruiken.

### 4.1 Bestandsoverzicht

| Bestand | Soort | Gebruikt door |
|---|---|---|
| `supabase/config.toml` | CLI-configuratie (via `supabase init`); eigenaar 13; 10 levert `[db]` (major_version 17) en `[db.seed]`; de `[auth]`-blokken documenteren de gewenste waarden en worden nooit gepusht (B-39) | 10, 13 |
| `supabase/migrations/2026100220*.sql` (7 bestanden, §5.1) | schema, functies, RLS, storage, beroepen | alle |
| `supabase/migrations/20261003090000_kruiscontrole_1.sql` (§5.1) | wijzigingen uit kruiscontrole ronde 1 | alle |
| `supabase/seed.sql` | testdata, alleen `groos-dev` | 04, 05, 06, 08 |
| `supabase/seed-reset.sql` | leegt de testdata vóór een nieuwe seed, alleen `groos-dev` (§5.11) | 10, 14 |
| `supabase/tests/rls_smoke.sql` | controle van de policies via `psql` | 10, 14 |
| `lib/database.types.ts` | gegenereerd, niet met de hand wijzigen | alle |
| `lib/supabase/env.ts` | leest en controleert de env vars | 10 |
| `lib/supabase/server.ts` | sessieclient (`@supabase/ssr`) voor Server Components, Server Actions en route handlers | 07, 08 |
| `lib/supabase/browser.ts` | browserclient (signed upload, MFA-schermen) | 07, 08 |
| `lib/supabase/admin.ts` | secret key, `import "server-only"` | 07, 08, 11, cron |
| `lib/supabase/public.ts` | publishable key zonder sessie, voor gecachte data | `lib/data/*` |
| `lib/supabase/proxy.ts` | `updateSession()` voor de beheerpaden in `proxy.ts` | 01, 08 |
| `lib/supabase/cv-storage.ts` | signed upload, controle, verplaatsen, signed read, verwijderen | 07, 08, cron |
| `lib/supabase/public-media.ts` | `publicMediaUrl(path)` | 06, 08 |
| `lib/data/options.ts` | enums en vaste waardensets als constanten (client-veilig) | 06, 07, 08, 12 |
| `lib/data/types.ts` | domeintypen van de leesfuncties | 04, 05, 06, 12 |
| `lib/data/cache-tags.ts` | `VACANCIES_TAG`, `vacancyTag()` | 06, 08, 12 |
| `lib/data/vacancy-search-params.ts` | parsen en opbouwen van de filterparameters (client-veilig) | 06, 12 |
| `lib/data/vacancies.ts` | gecachte leesfuncties (server-only) | 04, 05, 06, 07, 12 |
| `lib/data/occupations.ts` | `listOccupations()` (server-only) | 01, 05, 06, 12 |
| `lib/data/revalidate.ts` | `revalidateVacancies()` (server-only) | 08, cron |
| `lib/cron/auth.ts` | `verifyCronRequest()` | cron |
| `app/api/cron/vacatures/route.ts`, `app/api/cron/bewaartermijnen/route.ts`, `app/api/cron/opruimen/route.ts` | route handlers (GET) | Vercel Cron (spec 13) |
| `app/api/dev/revalidate/route.ts` | route handler (POST) om de vacaturecache buiten productie te verversen (§4.4) | 10, 14, ontwikkelaar |
| `scripts/supabase/create-admin.mjs` | eerste beheerder aanmaken | 10, 13 |
| `scripts/supabase/seed-reset.mjs` | testdata legen en de seed opnieuw laden op `groos-dev` (§4.7) | 10, 14 |

### 4.2 Supabase-clients

Env vars (00 §4.5): `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (begint met `sb_publishable_`),
`SUPABASE_SECRET_KEY` (begint met `sb_secret_`), `CRON_SECRET` (minimaal 32
tekens). De oude `anon`- en `service_role`-sleutels worden nergens gebruikt.

```ts
// lib/supabase/env.ts
export function hasSupabaseEnv(): boolean;            // true als URL en publishable key gezet zijn
export function supabaseEnv(): { url: string; publishableKey: string };
// gooit Error("Supabase is niet geconfigureerd: zet NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local")
// leest process.env.NEXT_PUBLIC_SUPABASE_URL letterlijk, zodat Next de waarde in de browserbundle kan inlinen

// lib/supabase/server.ts   (import "server-only")
export type SupabaseServerClient = SupabaseClient<Database>;
export async function createSupabaseServerClient(): Promise<SupabaseServerClient>;
// createServerClient<Database>(url, publishableKey, { cookies: { getAll, setAll } }) met
// `const cookieStore = await cookies()`; setAll staat in try/catch, omdat Server Components
// geen cookies mogen schrijven (de sessie wordt dan door updateSession() ververst).

// lib/supabase/browser.ts   (geen "use client" nodig; alleen importeren vanuit client components)
export function createSupabaseBrowserClient(): SupabaseClient<Database>;
// createBrowserClient<Database>(url, publishableKey); @supabase/ssr houdt één instantie per tabblad aan.

// lib/supabase/admin.ts
import "server-only";
export function createSupabaseAdminClient(): SupabaseClient<Database>;
// createClient<Database>(url, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false,
// autoRefreshToken: false, detectSessionInUrl: false } }); één instantie per serverproces;
// gooit als de sleutel ontbreekt of niet met "sb_secret_" begint. Omzeilt RLS: alleen voor
// publieke formulieren (spec 07), cron, Storage-beheer en het aanmaken van beheerders.

// lib/supabase/public.ts
import "server-only";
export function createSupabasePublicClient(): SupabaseClient<Database>;
// createClient met de publishable key en dezelfde auth-opties als admin.ts. Geen cookies,
// dus bruikbaar binnen unstable_cache. Rol in Postgres: anon, dus RLS geldt.

// lib/supabase/proxy.ts
export async function updateSession(request: NextRequest): Promise<{
  response: NextResponse;          // NextResponse.next({ request }) met ververste cookies
  userId: string | null;           // claims.sub
  aal: "aal1" | "aal2" | null;     // claims.aal
}>;
// Volgt het patroon uit de Supabase-gids voor Next.js: createServerClient met
// getAll() uit request.cookies en setAll(cookiesToSet, headers) dat de cookies op request
// én response zet en de meegegeven headers kopieert; direct daarna
// `await supabase.auth.getClaims()`. Geen andere code tussen client en getClaims.
```

`updateSession()` is bedoeld voor `proxy.ts` (eigendom spec 01): paden onder
`/beheer` krijgen geen taalrouting en geen geo-redirect, wel deze
sessieverversing. Server Components kunnen geen cookies schrijven; zonder deze
stap kan een verlopen token met refresh-token-rotatie tot uitloggen leiden.
Welke paden doorsturen naar het inlogscherm bepaalt spec 08. De afstemming met
00 §4.1 is vastgelegd in B-38.

### 4.3 Data-laag: typen en leesfuncties

Alle leesfuncties in `lib/data/vacancies.ts` en `lib/data/occupations.ts`
beginnen met `import "server-only"`, lezen via `createSupabasePublicClient()`
(dus altijd door RLS heen) en geven JSON-serialiseerbare data terug: datums
als ISO-string, bedragen als `number`. `unstable_cache` slaat resultaten als
JSON op; een `Date` zou als string terugkomen.

```ts
// lib/data/options.ts (client-veilig, geen server-only)
export const OCCUPATION_SLUGS = ["glazenwasser", "schoonmaker", "logistiek-medewerker",
  "verhuizer", "hulpkracht-bouw-en-sloop"] as const;                  // gelijk aan 00 §4.2
export type OccupationSlug = (typeof OCCUPATION_SLUGS)[number];
export const CONTRACT_TYPES = ["temp_agency", "secondment", "recruitment"] as const;
export const SHIFTS = [
  { id: "early", slug: "vroeg" }, { id: "day", slug: "dag" }, { id: "evening", slug: "avond" },
  { id: "night", slug: "nacht" }, { id: "weekend", slug: "weekend" },
] as const;                                                            // id = database, slug = URL
export const HOURS_BUCKETS = [
  { id: "tot-20", min: 1, max: 20 }, { id: "20-32", min: 21, max: 31 }, { id: "32-plus", min: 32, max: 60 },
] as const;
export const EDUCATION_LEVELS = ["none", "vmbo", "mbo1", "mbo2", "mbo3", "mbo4", "havo_vwo", "hbo", "wo"] as const;
export const EXPERIENCE_LEVELS = ["none", "nice_to_have", "required"] as const;
export const QUALIFICATIONS = ["vca_basis", "vca_vol", "heftruck", "reachtruck", "ept", "ipaf", "vog",
  "rijbewijs_b", "rijbewijs_be", "rijbewijs_c", "code_95", "ras"] as const;                 // zonder "dav" (VR-13)
export const WORKPLACE_LANGUAGES = ["nl", "en", "nl_or_en"] as const;
export type WorkplaceLanguage = (typeof WORKPLACE_LANGUAGES)[number];
export const MIN_AGE_REASONS = ["work_at_height", "construction_demolition", "forklift", "night_work",
  "hazardous_substances"] as const;
export const CLOSE_REASONS = ["filled", "expired", "withdrawn", "other"] as const;
export const VACANCY_STATUSES = ["draft", "scheduled", "published", "closed", "archived"] as const;
export const APPLICATION_STATUSES = ["new", "in_progress", "invited", "placed", "rejected", "withdrawn"] as const;
export const APPLICATION_KINDS = ["vacancy", "registration"] as const;
export const APPLICATION_SOURCES = ["website", "whatsapp", "phone", "walk_in", "email", "referral", "job_board", "other"] as const;
export const STAFF_REQUEST_STATUSES = ["new", "in_progress", "quote_sent", "started", "completed", "cancelled"] as const;
export const REQUEST_DURATIONS = ["one_day", "days", "weeks", "months", "indefinite", "unknown"] as const;
export const CONTACT_TOPICS = ["job_seeker", "employer", "callback", "other"] as const;
export const MESSAGE_STATUSES = ["new", "answered", "archived", "spam"] as const;
export const PROVINCES = ["Drenthe", "Flevoland", "Friesland", "Gelderland", "Groningen", "Limburg",
  "Noord-Brabant", "Noord-Holland", "Overijssel", "Utrecht", "Zeeland", "Zuid-Holland"] as const;
export const CV_MAX_BYTES = 10 * 1024 * 1024;
export const CV_TYPES = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
} as const;
export const PUBLIC_MEDIA_MAX_BYTES = 5 * 1024 * 1024;
// Termijnen: dezelfde waarden staan in SQL (§5.6). Wijzig ze altijd op beide plekken.
export const VACANCY_DEFAULT_CLOSE_DAYS = 45;   // B-15
export const VACANCY_EXTEND_DAYS = 30;          // actie "verlengen" in spec 08
export const CLOSED_VISIBLE_DAYS = 30;          // B-15
export const RETENTION_DAYS = {
  applicationDefault: 28, applicationConsent: 365, registration: 365,
  staleReminder: 56, staleAutoClose: 84,
  staffRequest: 730, contactMessage: 182, spam: 30, emailLog: 90, auditLog: 730, pendingUploadHours: 24,
} as const;                                     // B-07
export const MINIMUM_WAGE_21_PLUS = 14.99;      // wettelijk minimumuurloon 21+, geldig vanaf 2026-07-01; bijwerken per 1 januari en 1 juli (rijksoverheid.nl)
export const VACANCY_SORTS = [{ id: "newest", slug: "nieuwste" }, { id: "salary", slug: "salaris" }, { id: "closing", slug: "sluitdatum" }] as const;   // id = VacancySort, slug = waarde van ?sortering (B-16)
export type VacancySortSlug = (typeof VACANCY_SORTS)[number]["slug"];
export type ContractType = (typeof CONTRACT_TYPES)[number];   // enzovoort voor elke lijst
export type ShiftId = (typeof SHIFTS)[number]["id"];
export type ShiftSlug = (typeof SHIFTS)[number]["slug"];
export type HoursBucketId = (typeof HOURS_BUCKETS)[number]["id"];
```

`MINIMUM_WAGE_21_PLUS` in `lib/data/options.ts` is de enige constante voor het
minimumloon (B-42); andere specs importeren hem en definiëren geen eigen waarde.

Een uren-bucket past bij een vacature als de bereiken overlappen:
`hoursMin <= bucket.max && hoursMax >= bucket.min`. Een vacature van 8 tot 40
uur valt dus in alle drie de buckets.

```ts
// lib/data/types.ts
export type VacancyState = "open" | "closed";
export type VacancyOccupation = { slug: OccupationSlug; nameNl: string; pluralNl: string; nameEn: string; pluralEn: string };
export type VacancyListItem = {
  id: string; number: number; slug: string; path: `/vacatures/${string}`;  // pad zonder taalprefix, voor Link uit @/i18n/navigation
  title: string; summary: string;                                             // summary valt terug op de eerste zinnen van intro (max 200 tekens)
  occupation: VacancyOccupation;
  city: string; citySlug: string; locationLabel: string | null;
  contractType: ContractType; hoursMin: number; hoursMax: number; shifts: ShiftId[];
  salaryMin: number; salaryMax: number;                                       // bruto per uur in euro
  isFeatured: boolean; isUrgent: boolean;
  startAsap: boolean; startDate: string | null;                               // "YYYY-MM-DD"
  publishedAt: string; closesAt: string; state: VacancyState;
};
export type VacancyContact = { name: string; phoneE164: string | null; whatsappE164: string | null; photoUrl: string | null };
export type VacancyDetail = VacancyListItem & {
  intro: string; tasks: string[]; requirements: string[]; offer: string[]; extra: string | null;
  seoTitle: string | null; seoDescription: string | null;
  postalCode: string | null; province: Province; positionsCount: number; salaryNote: string | null;
  educationLevel: EducationLevel; experienceLevel: ExperienceLevel; experienceMonths: number | null;
  requiredQualifications: Qualification[]; preferredQualifications: Qualification[]; trainingOffered: Qualification[];
  minAge18: boolean; minAgeReason: MinAgeReason | null;
  workplaceLanguage: WorkplaceLanguage | null;
  allowWhatsappApply: boolean;
  asksDrivingLicenseB: boolean;                                               // rijbewijs_b in required of preferred (B-17)
  imageUrl: string | null; contact: VacancyContact | null;
  closedAt: string | null; closeReason: CloseReason | null;                   // alleen bij state "closed"
  updatedAt: string;
};
export type VacancyFilters = {
  q?: string;                 // maximaal 80 tekens, zoekt in titel, plaats, beroep, samenvatting, intro en taken
  beroep?: OccupationSlug[];
  plaats?: string[];          // citySlug, bijvoorbeeld "den-haag"
  uren?: HoursBucketId[];
  dienst?: ShiftSlug[];
};
export type VacancySort = "newest" | "salary" | "closing";
export type VacancyListResult = {
  items: VacancyListItem[]; total: number; page: number; pageSize: number; pageCount: number;
  outOfRange: boolean;        // page > pageCount en pageCount > 0: spec 06 roept notFound() aan
};
export type VacancyFacets = {
  total: number;
  beroep: { slug: OccupationSlug; nameNl: string; count: number }[];   // volgorde: occupations.sort_order
  plaats: { slug: string; name: string; count: number }[];            // alleen plaatsen met open vacatures, aflopend op aantal
  uren: { id: HoursBucketId; count: number }[];
  dienst: { slug: ShiftSlug; count: number }[];
};
export type OccupationWithCount = VacancyOccupation & { sortOrder: number; openCount: number };
```

```ts
// lib/data/vacancies.ts
export async function getVacancyList(input: {
  filters?: VacancyFilters; sort?: VacancySort; page?: number; pageSize?: number;   // standaard newest, 1, 12
}): Promise<VacancyListResult>;
export async function getVacancyFacets(filters?: VacancyFilters): Promise<VacancyFacets>;
export async function getVacancyByNumber(number: number): Promise<VacancyDetail | null>;  // open of gesloten (<= 30 dagen), anders null
export async function getLatestVacancies(options?: { limit?: number; occupation?: OccupationSlug }): Promise<VacancyListItem[]>; // standaard 3
export async function getVacanciesByOccupation(slug: OccupationSlug, options?: { limit?: number }): Promise<{ items: VacancyListItem[]; total: number }>; // standaard 6
export async function getSimilarVacancies(number: number, options?: { limit?: number; fill?: boolean }): Promise<VacancyListItem[]>; // standaard 3, fill true
export async function listOpenVacancyParams(): Promise<{ slug: string }[]>;        // voor generateStaticParams (spec 06)
export async function getVacancySitemapEntries(): Promise<{ path: `/vacatures/${string}`; lastModified: string }[]>; // spec 12
export async function getOpenVacancyCount(): Promise<number>;

// lib/data/occupations.ts
export async function listOccupations(): Promise<OccupationWithCount[]>;          // actieve beroepen op sort_order

// lib/data/vacancy-search-params.ts (client-veilig)
export type VacancySearchState = { filters: VacancyFilters; page: number; sort: VacancySort; isFiltered: boolean };
export function parseVacancySearchParams(sp: Record<string, string | string[] | undefined>): VacancySearchState;
export function buildVacancySearchParams(state: Partial<VacancySearchState>): URLSearchParams;
export function parseVacancySlug(slug: string): number | null;                    // "glazenwasser-den-haag-1001" -> 1001
```

Gedrag:

1. **Eén bron voor de lijst.** Een interne loader `loadOpenVacancies()` haalt
   met één query alle rijen uit `public_vacancies` met `state = 'open'` op,
   met alleen de lijstkolommen (waaronder `start_asap`, `start_date` en
   `updated_at`) plus `intro` en `tasks` voor het zoeken. De loader houdt per
   rij intern `updatedAt` en de zoektekst bij (type `OpenVacancy =
   VacancyListItem & { searchText: string; updatedAt: string }`);
   `VacancyListItem` zelf verandert niet. Hij is gecachet met
   `unstable_cache(fn, ["groos:vacatures:open:v1"], { tags: [VACANCIES_TAG],
   revalidate: 3600 })`. `getVacancyList`,
   `getVacancyFacets`, `getLatestVacancies`, `getVacanciesByOccupation`,
   `getSimilarVacancies`, `listOpenVacancyParams`, `getVacancySitemapEntries`
   en `getOpenVacancyCount` filteren, sorteren en tellen in het geheugen op
   dat resultaat. `getVacancySitemapEntries()` geeft per open vacature
   `{ path, lastModified: updatedAt }`. Bij de verwachte schaal (10 tot 100
   vacatures, context/11) is dat sneller en consistenter dan losse queries, en zijn lijst en tellers
   altijd gelijk. Komen er meer dan 500 open vacatures, dan logt de loader een
   waarschuwing en moet het filteren naar de database (fase 2).
2. **Detail.** `getVacancyByNumber(n)` geeft `null` terug voor een getal dat
   geen geheel getal van minimaal 1001 is. Anders roept hij een per nummer
   gecachte loader aan: `unstable_cache(fn, ["groos:vacature", String(n),
   "v1"], { tags: [VACANCIES_TAG, vacancyTag(n)], revalidate: 3600 })`, die
   één rij uit `public_vacancies` leest (`state` open of closed). De export is
   bovendien omwikkeld met `cache()` uit React, zodat `generateMetadata` en de
   pagina in één request maar één keer lezen.
3. **Zoeken.** `q` wordt genormaliseerd met `toLowerCase()`,
   `normalize("NFD")` en het verwijderen van diakrieten; `'s-gravenhage` wordt
   `den haag`. De zoekterm wordt gesplitst op spaties (maximaal 6 woorden) en
   elk woord moet voorkomen in de genormaliseerde tekst van titel, plaats,
   beroepsnamen (nl en en), samenvatting, intro en taken. Zo werkt zoeken op
   een plaats wel, anders dan bij Wilk (context/04).
4. **Filters.** Binnen één groep is een filter OF, tussen groepen EN. Onbekende
   waarden negeert de parser (geen fout, geen 404).
5. **Tellers.** Het aantal per waarde in een groep is het aantal vacatures dat
   voldoet aan `q` en aan alle andere groepen, plus die waarde. `total` is het
   aantal na alle filters. Waarden met 0 komen mee; spec 06 bepaalt of ze
   verborgen of uitgeschakeld worden.
6. **Sorteren.** `newest`: eerst `isFeatured`, dan `publishedAt` aflopend, dan
   `number` aflopend. `salary`: `salaryMax` aflopend, daarna als newest.
   `closing`: `closesAt` oplopend.
7. **Paginering.** `pageSize` standaard 12, maximaal 48. `page` kleiner dan 1
   wordt 1.
8. **Vergelijkbaar.** `getSimilarVacancies` sluit het nummer zelf uit en
   scoort open vacatures: zelfde beroep 2 punten, zelfde plaats 1 punt.
   Hoogste score eerst, daarna newest. Met `fill: true` vult hij aan met de
   nieuwste andere vacatures als er te weinig met score 1 of hoger zijn.
9. **Zoekparameters.** `parseVacancySearchParams` leest `q`, `beroep`,
   `plaats`, `uren`, `dienst` en `pagina` (B-16), plus het optionele
   `sortering` (`nieuwste`, `salaris`, `sluitdatum`). Meerdere waarden mogen
   herhaald (`?beroep=a&beroep=b`) of met komma's. `isFiltered` is `true` als
   er een filter, zoekterm of niet-standaard sortering is, niet bij alleen
   `pagina`; spec 12 zet dan `noindex, follow`. `buildVacancySearchParams`
   schrijft de parameters in de vaste volgorde `q, beroep, plaats, uren,
   dienst, sortering, pagina` en laat standaardwaarden weg. Beide functies
   vertalen tussen `sortering` en `VacancySort` met `VACANCY_SORTS` uit
   `lib/data/options.ts`; de private `SORT_PARAM` en `SORT_VALUE` in
   `lib/data/vacancy-search-params.ts` vervallen. `VacancySort` in
   `lib/data/types.ts` blijft `"newest" | "salary" | "closing"`.
10. **Fouten.** Geeft Supabase een fout (een `error` in het antwoord of een
    mislukte fetch), dan gooien alle publieke leesfuncties (`getVacancyList`,
    `getVacancyFacets`, `getVacancyByNumber`, `getLatestVacancies`,
    `getVacanciesByOccupation`, `getSimilarVacancies`, `listOccupations`,
    `listOpenVacancyParams`, `getVacancySitemapEntries`,
    `getOpenVacancyCount`) een `Error` met de plek en de Supabase-code,
    bijvoorbeeld `public_vacancies (open): Could not find the table
    (PGRST205)`. Ze geven dan geen `[]`, `null` of `0`, en het resultaat wordt
    niet gecachet; `error.tsx` van spec 01 toont de foutpagina en een
    ISR-verversing houdt de vorige versie. Alleen als `hasSupabaseEnv()`
    onwaar is, geven ze een leeg resultaat met één `console.warn`, zodat `npm
    run build` zonder `.env.local` slaagt (B-56).
11. **Beroepen.** `listOccupations()` leest `occupations` (actief, op
    `sort_order`) via een eigen gecachte loader met tag `VACANCIES_TAG` en
    combineert dat met de tellingen uit `loadOpenVacancies()`.

Beheerschermen (spec 08) lezen niet via `lib/data/*` maar met
`createSupabaseServerClient()` rechtstreeks uit de tabellen, ongecachet. De
database levert ze de RPC's uit §5.5.

### 4.4 Caching en revalidatie (B-35)

```ts
// lib/data/cache-tags.ts
export const VACANCIES_TAG = "vacatures";
export const vacancyTag = (number: number) => `vacature:${number}` as const;

// lib/data/revalidate.ts
import "server-only";
export function revalidateVacancies(numbers: number[], kind: "content" | "visibility"): void;
```

`revalidateVacancies` roept `revalidateTag(VACANCIES_TAG, profile)` en
`revalidateTag(vacancyTag(n), profile)` per nummer aan, en daarna
`revalidatePath("/[locale]/vacatures", "layout")` en
`revalidatePath("/sitemap.xml")`. Een lege `numbers` ververst alleen de tag
`vacatures` en de paden. Het profiel is `"max"` bij `kind: "content"`
(tekst, uren, loon, vlaggen en verlengen, behalve de gevallen hieronder) en
`{ expire: 0 }` bij `kind: "visibility"` (publiceren, inplannen die online
gaat, offline halen, sluiten, archiveren, verwijderen, en elke wijziging die
de publieke staat of de slug verandert: titel of plaats van een vacature met
publieke staat open of closed, verlengen van een vacature die publiek al
closed is, terugzetten of verplaatsen van een geplande vacature die publiek al
open is). De aanroeper kiest `kind` op basis van de publieke staat vóór de
actie (spec 08 §5.3). Bij een zichtbaarheidswijziging mag de
eerstvolgende bezoeker geen oude versie zien, omdat een gesloten vacature
anders nog even met JobPosting online staat. B-35 legt
`revalidateVacancies(numbers, kind)` met `"max"` bij inhoud en `{ expire: 0 }`
bij zichtbaarheid vast. Spec 08 roept de functie aan na elke geslaagde mutatie op
`vacancies` of `vacancy_translations`; de cron-route `vacatures` doet het na
elke statuswissel. Pagina's die deze functies gebruiken worden daardoor
automatisch ISR-pagina's met een vangnet van 3600 seconden.

**Verversen buiten productie.** Na een wijziging met SQL (seed, seed-reset,
een AC-test of `execute_sql`) loopt `revalidateVacancies` niet. Daarvoor is er
`app/api/dev/revalidate/route.ts`, alleen met methode `POST`:

```ts
// app/api/dev/revalidate/route.ts
import type { NextRequest } from "next/server";
import { z } from "zod";
import { verifyCronRequest } from "@/lib/cron/auth";
import { revalidateVacancies } from "@/lib/data/revalidate";

export const dynamic = "force-dynamic";
const Body = z.object({ numbers: z.array(z.number().int()), kind: z.enum(["content", "visibility"]) });

export async function POST(request: NextRequest) {
  if (process.env.VERCEL_ENV === "production") return new Response(null, { status: 404 });
  const denied = verifyCronRequest(request);   // Bearer-controle met CRON_SECRET; 401 zonder
  if (denied) return denied;
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
  revalidateVacancies(parsed.data.numbers, parsed.data.kind);
  return Response.json({ ok: true });
}
```

De eerste regel maakt de route op productie onvindbaar; lokaal en op previews
vraagt hij dezelfde Bearer-header als de cron-routes. Een lege `numbers`
ververst alleen de tag `vacatures` en de paden. Voorbeeld, in een shell met
`set -a; . ./.env.local; set +a` (B-51), zodat `$CRON_SECRET` gezet is:

```
curl -X POST -H "Authorization: Bearer $CRON_SECRET" -H 'content-type: application/json' -d '{"numbers":[1002],"kind":"visibility"}' http://localhost:3000/api/dev/revalidate
```

### 4.5 Storage-helpers

```ts
// lib/supabase/cv-storage.ts
import "server-only";
export type CvExtension = keyof typeof CV_TYPES;
export class CvUploadError extends Error {
  code: "invalid_path" | "not_found" | "too_large" | "type_mismatch" | "storage";
}
export async function createCvUploadTarget(ext: CvExtension): Promise<{
  path: string; token: string; signedUrl: string; contentType: string;
}>;
// path = `pending/${crypto.randomUUID()}.${ext}`; admin.storage.from("cvs").createSignedUploadUrl(path).
// Geldig twee uur, één pad. De uploadroute van spec 07 geeft `path`, `signedUrl` en `contentType`
// aan de browser, die uploadt met een XHR PUT naar `signedUrl` en de header `content-type` uit
// `CV_TYPES` (niet `file.type`). `token` blijft op de server. Reden: Android geeft bij docx soms
// een leeg type terug, en de bucket weigert dan het bestand.
export async function finalizeCvUpload(input: {
  pendingPath: string; applicationId: string; originalName?: string;
}): Promise<{ cvPath: string; cvFilename: string | null; cvMime: string; cvSize: number }>;
// 1. pendingPath moet passen op ^pending/[0-9a-f-]{36}\.(pdf|doc|docx)$, anders invalid_path.
// 2. Download via de admin-client; ontbreekt het bestand: not_found. Groter dan CV_MAX_BYTES: too_large.
// 3. Eerste bytes controleren: pdf begint met 25 50 44 46 2D, doc met D0 CF 11 E0 A1 B1 1A E1,
//    docx met 50 4B 03 04. Klopt het niet bij de extensie: type_mismatch en het bestand wordt verwijderd.
// 4. move(pendingPath, `applications/${applicationId}/${uuid}.${ext}`).
// 5. cvFilename = originalName zonder pad, maximaal 200 tekens, anders null.
export async function createCvReadUrl(input: {
  supabase: SupabaseServerClient; applicationId: string; download?: boolean;
}): Promise<string>;
// 1. supabase.rpc("is_admin") moet true zijn, anders Error("not_admin").
// 2. Leest cv_path en cv_filename via de sessieclient (RLS).
// 3. Signed URL van 60 seconden via de admin-client; bij doc, docx of download: true met
//    { download: cv_filename ?? true }, zodat Word-bestanden niet in de browser openen.
// 4. Schrijft activities (kind cv_viewed) via de sessieclient en audit_log
//    (action application.cv_viewed, actor = claims.sub) via de admin-client.
export async function removeApplicationFiles(applicationIds: string[]): Promise<{ removedIds: string[] }>;
// Per id: list(`applications/${id}`) en remove van alle gevonden paden. Ids waarbij
// Storage een fout geeft, komen niet in removedIds; die worden de volgende nacht opnieuw geprobeerd.
export async function removeStalePendingUploads(olderThanHours?: number): Promise<{ removed: number }>;
// list("pending", { limit: 1000, sortBy: { column: "created_at", order: "asc" } }) en remove
// van alles met created_at ouder dan olderThanHours (standaard 24).

// lib/supabase/public-media.ts (client-veilig)
export function publicMediaUrl(path: string | null): string | null;
// `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public-media/${path}`
```

Bestanden worden altijd via de Storage API verwijderd, nooit met SQL op
`storage.objects` (dan blijft het bestand bestaan, context/11 §7.3).

### 4.6 Cron-routes

| Route | Schema (UTC) | Doet | Antwoord |
|---|---|---|---|
| `/api/cron/vacatures` | `*/15 * * * *` | `rpc("run_vacancy_lifecycle")`: gepland naar online, verlopen naar gesloten (`expired`), gesloten langer dan 30 dagen naar gearchiveerd; daarna `revalidateVacancies(nummers, "visibility")` als er iets veranderde | `{ ok, published: number[], closed: number[], archived: number[], ranAt }` |
| `/api/cron/bewaartermijnen` | `0 2 * * *` | `rpc("auto_close_stale_applications")`; in batches van 200 de sollicitaties met `retain_until <= now()` en `anonymized_at is null`: eerst `removeApplicationFiles`, dan `rpc("anonymize_applications", { p_ids })` voor de gelukte ids; daarna `rpc("purge_expired_records")` | `{ ok, autoClosed, anonymized, staffRequestsDeleted, contactMessagesDeleted, ranAt }` |
| `/api/cron/opruimen` | `30 2 * * *` | `removeStalePendingUploads(24)` en `rpc("purge_logs")` (e-maillog ouder dan 90 dagen, auditlog ouder dan 2 jaar) | `{ ok, pendingRemoved, emailLogDeleted, auditLogDeleted, ranAt }` |

Elke route:

```ts
export const dynamic = "force-dynamic";
export const maxDuration = 60;
export async function GET(request: NextRequest) {
  const denied = verifyCronRequest(request);
  if (denied) return denied;
  // werk via createSupabaseAdminClient(); fouten: console.error en Response.json({ ok: false, error }, { status: 500 })
}

// lib/cron/auth.ts
export function verifyCronRequest(request: Request): Response | null;
// 500 als CRON_SECRET ontbreekt of korter is dan 32 tekens; 401 als de header
// Authorization niet exact `Bearer ${CRON_SECRET}` is (vergelijken met crypto.timingSafeEqual
// op gelijke lengte); anders null. Vercel Cron stuurt deze header zelf mee.
```

Idempotentie: elke stap selecteert alleen rijen die nog in de beginstatus
staan (`scheduled` met `publish_at <= now()`, `published` met `closes_at <=
now()`, `anonymized_at is null`, `retain_until <= now()`). Een tweede aanroep
direct na de eerste verandert niets en geeft lege lijsten en nullen terug.
Een geplande vacature die niet aan B-06 voldoet, wordt overgeslagen en komt
als `vacancy.publish_failed` in `audit_log`.

De cron-configuratie zelf (`crons` in `vercel.ts` of `vercel.json`) is van
spec 13. Elk kwartier draaien vraagt Vercel Pro. Op Hobby kan alleen dagelijks;
dan blijft het gedrag correct, omdat de view verlopen en geplande vacatures
zelf op tijd afhandelt, en is alleen de cache maximaal een uur oud.

### 4.7 Scripts

`scripts/supabase/create-admin.mjs` (Node 24, geen extra packages):

```
npm run db:admin -- --email <adres> --full-name "Jimmy (test)" --display-name Jimmy \
  --phone +31683351985 [--whatsapp +31683351985] [--role owner|recruiter] [--password <min 12 tekens>]
```

1. `process.loadEnvFile(".env.local")`, daarna een client met de secret key.
2. Zoekt de gebruiker op e-mailadres; bestaat hij niet, dan
   `auth.admin.createUser({ email, password, email_confirm: true })`. Zonder
   `--password` maakt het script een wachtwoord van 20 tekens en toont het
   één keer in de terminal.
3. `rpc("grant_admin", { p_email, p_full_name, p_display_name, p_role,
   p_phone, p_whatsapp })`.
4. Meldt dat de gebruiker bij de eerste keer inloggen op `/beheer` de
   authenticator-app koppelt (scherm van spec 08). Zonder `aal2` geeft de
   database geen beheerdata.

`scripts/supabase/seed-reset.mjs` (Node 24, geen extra packages), via
`npm run db:seed:reset`:

1. Leest `SUPABASE_DB_URL` uit de shell. Ontbreekt die of bevat hij de ref
   `smcskfrkjgniinbhqnln` niet, dan stopt het script met exitcode 1 en de
   melding "Seed-reset gestopt: SUPABASE_DB_URL wijst niet naar groos-dev
   (ref smcskfrkjgniinbhqnln). Dit script draait alleen op het
   ontwikkelproject."
2. Draait daarna `psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f
   supabase/seed-reset.sql -f supabase/seed.sql` met `spawnSync` uit
   `node:child_process` en `stdio: "inherit"`. Ontbreekt `psql` (`ENOENT`),
   dan meldt het script "psql ontbreekt. Draai de inhoud van
   supabase/seed-reset.sql en daarna supabase/seed.sql via execute_sql van de
   MCP (B-39)." en stopt met exitcode 1.
3. Toont na een geslaagde run het commando om de cache te verversen (B-46),
   voorafgegaan door de regel "Laad eerst de lokale waarden: set -a; .
   ./.env.local; set +a" (B-51):
   `curl -X POST -H "Authorization: Bearer $CRON_SECRET" -H 'content-type:
   application/json' -d '{"numbers":[],"kind":"visibility"}'
   http://localhost:3000/api/dev/revalidate` (§4.4).

npm-scripts in `package.json`:

```json
"db:push": "supabase db push --linked",
"db:types": "supabase gen types typescript --linked --schema public > lib/database.types.ts",
"db:admin": "node scripts/supabase/create-admin.mjs",
"db:seed:reset": "node scripts/supabase/seed-reset.mjs",
"db:test": "psql \"$SUPABASE_DB_URL\" -v ON_ERROR_STOP=1 -f supabase/tests/rls_smoke.sql"
```

`SUPABASE_DB_URL` is alleen een shellvariabele van de ontwikkelaar (de
connection string uit het dashboard, Session pooler). Hij komt niet in
`.env.local` en niet in de app.

## 5 Data

### 5.1 Migraties en volgorde

| Volgorde | Bestand | Inhoud |
|---|---|---|
| 1 | `supabase/migrations/20261002200000_basis.sql` | extensie `unaccent`, hulpfuncties, enums, sequences |
| 2 | `supabase/migrations/20261002200100_tabellen.sql` | tien tabellen, indexen, `updated_at`-triggers |
| 3 | `supabase/migrations/20261002200200_functies_en_triggers.sql` | rolfuncties, levenscyclus, publicatiecontrole, slug, bewaartermijnen, logboek, RPC's |
| 4 | `supabase/migrations/20261002200300_view_public_vacancies.sql` | view `public_vacancies` |
| 5 | `supabase/migrations/20261002200400_rls_en_rechten.sql` | RLS aan, policies, grants en revokes |
| 6 | `supabase/migrations/20261002200500_storage.sql` | buckets `cvs` en `public-media` met policies |
| 7 | `supabase/migrations/20261002200600_beroepen.sql` | de vijf beroepen (ook nodig in productie) |
| 8 | `supabase/migrations/20261003090000_kruiscontrole_1.sql` | wijzigingen uit kruiscontrole ronde 1 (zie hieronder) |

Conventies: Engelse tabel- en kolomnamen; `uuid` als primaire sleutel behalve
`occupations` (natuurlijke sleutel `slug`, 00 §4.2) en de logtabellen
(`bigint identity`); elke functie heeft `set search_path = ''` en gebruikt
volledig gekwalificeerde namen; `security definer` alleen waar genoemd.
Migraties worden nooit achteraf gewijzigd; een correctie is een nieuwe
migratie met een latere tijdstempel.

Bouwstap 1 is gecommit en `groos-dev` heeft de migraties. Wijzigingen uit
kruiscontrole ronde 1 komen in bouwstap 3b (00 §6) in
`supabase/migrations/20261003090000_kruiscontrole_1.sql`; bestaande
migratiebestanden blijven ongewijzigd (B-39). Inhoud: (1)
`application_retain_until` met de nieuwe registratietak; (2)
`applications_before_write` en `staff_requests_before_write` met `lpad` zonder
afkappen; (3) enum `workplace_language` en kolom
`vacancies.workplace_language`; (4) enum `qualification` zonder `dav` (hernoem
het oude type, maak het nieuwe, zet per kolom (`required_qualifications`,
`preferred_qualifications`, `training_offered`) eerst `alter column <kolom>
drop default`, dan `alter column <kolom> type public.qualification[] using
<kolom>::text[]::public.qualification[]` en dan `alter column <kolom> set
default '{}'`, drop het oude type; de view gaat eerst weg); (5) view
`public_vacancies` opnieuw met `v.workplace_language` en
`coalesce(v.published_at, v.publish_at) as published_at`; na `create view
public.public_vacancies with (security_invoker = true) as ...` volgen opnieuw
`grant select on public.public_vacancies to anon;` en `grant select on
public.public_vacancies to authenticated;` (§5.8); (6) `save_vacancy`
met `workplace_language` en de `closes_at`-regel; (7) `update
public.applications set retain_until = public.application_retain_until(kind,
created_at, last_contact_at, completed_at, retention_consent,
retention_consent_at)` voor bestaande rijen; (8) `vacancy_publish_errors`
opnieuw met `case when p.id is null or p.phone_e164 is null then 'contact'
end`, zodat een publiceerbare vacature altijd een contactpersoon met
telefoonnummer heeft (B-21). Daarna `npm run db:types` en `npm run
db:seed:reset` (§4.7, §5.11).

De paragrafen §5.2 tot en met §5.7 beschrijven het schema zoals het na deze
migratie is; een commentaarregel in de SQL noemt wat uit
`20261003090000_kruiscontrole_1.sql` komt.

### 5.2 Migratie 1: basis

```sql
create extension if not exists unaccent with schema extensions;

create or replace function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;

create or replace function public.slugify(p_text text) returns text
language sql stable set search_path = '' as $$
  select trim(both '-' from regexp_replace(lower(extensions.unaccent(coalesce(p_text, ''))), '[^a-z0-9]+', '-', 'g'))
$$;

create or replace function public.normalize_city(p_city text) returns text
language sql immutable set search_path = '' as $$
  select case
    when p_city is null or btrim(p_city) = '' then null
    when lower(btrim(p_city)) in ('den haag', '''s-gravenhage', 's-gravenhage', 'gravenhage', 'the hague') then 'Den Haag'
    else regexp_replace(btrim(p_city), '\s+', ' ', 'g')
  end
$$;

create or replace function public.text_items_valid(p_items text[], p_max_len integer) returns boolean
language sql immutable set search_path = '' as $$
  select coalesce(bool_and(length(btrim(i)) between 1 and p_max_len), true) from unnest(p_items) as i
$$;

create or replace function public.vacancy_slug(p_title text, p_city_slug text, p_number integer) returns text
language sql stable set search_path = '' as $$
  with t as (select public.slugify(p_title) as s)
  select concat_ws('-',
    nullif(t.s, ''),
    case when p_city_slug is null or t.s like '%' || p_city_slug then null else p_city_slug end,
    p_number::text)
  from t
$$;

create type public.admin_role as enum ('owner', 'recruiter');
create type public.app_locale as enum ('nl', 'en');
create type public.vacancy_status as enum ('draft', 'scheduled', 'published', 'closed', 'archived');
create type public.vacancy_close_reason as enum ('filled', 'expired', 'withdrawn', 'other');
create type public.contract_type as enum ('temp_agency', 'secondment', 'recruitment');
create type public.shift as enum ('early', 'day', 'evening', 'night', 'weekend');
create type public.education_level as enum ('none', 'vmbo', 'mbo1', 'mbo2', 'mbo3', 'mbo4', 'havo_vwo', 'hbo', 'wo');
create type public.experience_level as enum ('none', 'nice_to_have', 'required');
-- zonder 'dav' sinds 20261003090000_kruiscontrole_1.sql (VR-13)
create type public.qualification as enum ('vca_basis', 'vca_vol', 'heftruck', 'reachtruck', 'ept', 'ipaf', 'vog',
  'rijbewijs_b', 'rijbewijs_be', 'rijbewijs_c', 'code_95', 'ras');
-- toegevoegd in 20261003090000_kruiscontrole_1.sql
create type public.workplace_language as enum ('nl', 'en', 'nl_or_en');
create type public.min_age_reason as enum ('work_at_height', 'construction_demolition', 'forklift', 'night_work', 'hazardous_substances');
create type public.application_kind as enum ('vacancy', 'registration');
create type public.application_status as enum ('new', 'in_progress', 'invited', 'placed', 'rejected', 'withdrawn');
create type public.application_source as enum ('website', 'whatsapp', 'phone', 'walk_in', 'email', 'referral', 'job_board', 'other');
create type public.consent_source as enum ('form', 'phone', 'email', 'in_person');
create type public.staff_request_status as enum ('new', 'in_progress', 'quote_sent', 'started', 'completed', 'cancelled');
create type public.request_duration as enum ('one_day', 'days', 'weeks', 'months', 'indefinite', 'unknown');
create type public.contact_topic as enum ('job_seeker', 'employer', 'callback', 'other');
create type public.message_status as enum ('new', 'answered', 'archived', 'spam');
create type public.entity_type as enum ('vacancy', 'application', 'staff_request', 'contact_message');
create type public.activity_kind as enum ('note', 'status_change', 'call', 'whatsapp', 'email_sent', 'cv_viewed',
  'assigned', 'consent_recorded', 'auto_closed');
create type public.email_status as enum ('queued', 'sent', 'delivered', 'bounced', 'failed');
create type public.audit_actor as enum ('admin', 'system', 'public');

create sequence public.vacancy_number_seq start with 1001 minvalue 1001;
create sequence public.application_reference_seq;
create sequence public.staff_request_reference_seq;
```

### 5.3 Migratie 2: tabellen

Elke tabel met een kolom `updated_at` (alle behalve `activities` en
`audit_log`) krijgt de trigger `set_updated_at` (before update). Telefoon
staat altijd in E.164 (`^\+[1-9][0-9]{7,14}$`), e-mail altijd in kleine
letters. Een check op een nullable kolom geldt alleen als de kolom gevuld is.

```sql
create table public.admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null check (email = lower(email) and length(email) <= 254),
  full_name text not null check (length(btrim(full_name)) between 1 and 120),
  display_name text not null check (length(btrim(display_name)) between 1 and 40),
  phone_e164 text check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  whatsapp_e164 text check (whatsapp_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  photo_path text check (photo_path ~ '^contacts/[0-9a-f-]{36}\.(jpg|png|webp)$'),
  role public.admin_role not null default 'owner',
  is_active boolean not null default true,
  notify_applications boolean not null default true,
  notify_staff_requests boolean not null default true,
  notify_messages boolean not null default true,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.occupations (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name_nl text not null, plural_nl text not null,
  name_en text not null, plural_en text not null,
  sort_order smallint not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vacancies (
  id uuid primary key default gen_random_uuid(),
  number integer not null unique default nextval('public.vacancy_number_seq'),
  status public.vacancy_status not null default 'draft',
  occupation_slug text not null references public.occupations (slug) on update cascade,
  city text check (length(city) between 2 and 80),
  city_slug text,                                                   -- trigger
  postal_code text check (postal_code ~ '^[1-9][0-9]{3} ?[A-Z]{2}$'),
  province text not null default 'Zuid-Holland' check (province in ('Drenthe','Flevoland','Friesland','Gelderland',
    'Groningen','Limburg','Noord-Brabant','Noord-Holland','Overijssel','Utrecht','Zeeland','Zuid-Holland')),
  location_label text check (length(location_label) <= 60),
  positions_count smallint not null default 1 check (positions_count between 1 and 99),
  contract_type public.contract_type not null default 'temp_agency',
  hours_min smallint check (hours_min between 1 and 60),
  hours_max smallint check (hours_max between 1 and 60),
  shifts public.shift[] not null default '{}',
  salary_min numeric(6,2) check (salary_min between 5 and 100),     -- bruto per uur, euro
  salary_max numeric(6,2) check (salary_max between 5 and 100),
  salary_note text check (length(salary_note) <= 200),
  education_level public.education_level not null default 'none',
  experience_level public.experience_level not null default 'none',
  experience_months smallint check (experience_months between 1 and 120),
  required_qualifications public.qualification[] not null default '{}',
  preferred_qualifications public.qualification[] not null default '{}',
  training_offered public.qualification[] not null default '{}',   -- "wij regelen de opleiding"
  min_age_18 boolean not null default false,
  min_age_reason public.min_age_reason,
  start_asap boolean not null default true,
  start_date date,
  workplace_language public.workplace_language,                    -- nullable, niet verplicht om te publiceren (kruiscontrole_1)
  publish_at timestamptz,
  published_at timestamptz,                                         -- eerste keer online; datePosted
  closes_at timestamptz,                                            -- validThrough
  closed_at timestamptz,
  close_reason public.vacancy_close_reason,
  archived_at timestamptz,
  status_changed_at timestamptz not null default now(),
  is_featured boolean not null default false,
  is_urgent boolean not null default false,
  allow_whatsapp_apply boolean not null default true,
  contact_admin_id uuid references public.admin_profiles (id) on delete set null,
  image_path text check (image_path ~ '^vacancies/[0-9a-f-]{36}\.(jpg|png|webp)$'),
  created_by uuid references public.admin_profiles (id) on delete set null,
  updated_by uuid references public.admin_profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vacancies_hours_order check (hours_min is null or hours_max is null or hours_min <= hours_max),
  constraint vacancies_salary_order check (salary_min is null or salary_max is null or salary_min <= salary_max),
  constraint vacancies_min_age check (not min_age_18 or min_age_reason is not null),
  constraint vacancies_start check ((start_asap and start_date is null) or (not start_asap and start_date is not null)),
  constraint vacancies_quals_disjoint check (not (required_qualifications && preferred_qualifications)),
  constraint vacancies_live_has_close_date check (status not in ('scheduled','published','closed') or closes_at is not null),
  constraint vacancies_scheduled_has_publish_at check (status <> 'scheduled' or publish_at is not null),
  constraint vacancies_closed_has_reason check (status <> 'closed' or (closed_at is not null and close_reason is not null))
);

create table public.vacancy_translations (
  vacancy_id uuid not null references public.vacancies (id) on delete cascade,
  locale public.app_locale not null default 'nl',
  title text not null check (length(btrim(title)) between 2 and 80),     -- alleen de functie, zonder plaats
  slug text not null default '',                                            -- trigger
  summary text check (length(summary) <= 200),
  intro text check (length(intro) <= 1200),
  tasks text[] not null default '{}' check (cardinality(tasks) <= 10 and public.text_items_valid(tasks, 200)),
  requirements text[] not null default '{}' check (cardinality(requirements) <= 10 and public.text_items_valid(requirements, 200)),
  offer text[] not null default '{}' check (cardinality(offer) <= 10 and public.text_items_valid(offer, 200)),
  extra text check (length(extra) <= 1200),
  seo_title text check (length(seo_title) <= 60),
  seo_description text check (length(seo_description) <= 160),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (vacancy_id, locale)
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default '',                  -- trigger: S-2026-0001
  kind public.application_kind not null default 'vacancy',
  vacancy_id uuid references public.vacancies (id) on delete restrict,
  vacancy_number integer,                                     -- momentopname
  vacancy_title_snapshot text check (length(vacancy_title_snapshot) <= 80),
  occupation_slugs text[] not null default '{}',              -- interesse; bij een vacature het beroep daarvan
  status public.application_status not null default 'new',
  source public.application_source not null default 'website',
  first_name text check (length(btrim(first_name)) between 1 and 80),
  last_name text check (length(btrim(last_name)) between 1 and 120),   -- inclusief tussenvoegsel
  email text check (email = lower(email) and length(email) <= 254 and position('@' in email) > 1),
  phone_e164 text check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  city text check (length(btrim(city)) between 2 and 80),
  may_work_in_nl boolean,                                     -- B-17 ja of nee
  available_from date,
  has_driving_license_b boolean,
  message text check (length(message) <= 2000),
  cv_path text check (cv_path ~ '^applications/[0-9a-f-]{36}/[0-9a-f-]{36}\.(pdf|doc|docx)$'),
  cv_filename text check (length(cv_filename) <= 200),
  cv_mime text,
  cv_size integer check (cv_size between 1 and 10485760),
  locale public.app_locale not null default 'nl',
  utm jsonb check (utm is null or jsonb_typeof(utm) = 'object'),
  assigned_to uuid references public.admin_profiles (id) on delete set null,
  retention_consent boolean not null default false,
  retention_consent_at timestamptz,
  retention_consent_source public.consent_source,
  privacy_notice_version text check (length(privacy_notice_version) <= 40),
  submission_id uuid unique,                                  -- dubbele inzending afvangen
  status_changed_at timestamptz not null default now(),
  last_contact_at timestamptz,
  completed_at timestamptz,                                   -- start bewaartermijn
  retain_until timestamptz not null default now(),            -- trigger
  anonymized_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint applications_vacancy_kind check (kind <> 'vacancy' or vacancy_id is not null),
  constraint applications_registration_consent check (kind <> 'registration' or retention_consent or anonymized_at is not null),
  constraint applications_person check (anonymized_at is not null or (first_name is not null and last_name is not null and phone_e164 is not null)),
  constraint applications_website_fields check (source <> 'website' or anonymized_at is not null
    or (email is not null and city is not null and may_work_in_nl is not null)),
  constraint applications_cv_complete check ((cv_path is null) = (cv_size is null))
);

create table public.staff_requests (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default '',                  -- trigger: P-2026-0001
  status public.staff_request_status not null default 'new',
  company_name text not null check (length(btrim(company_name)) between 2 and 120),
  kvk_number text check (kvk_number ~ '^[0-9]{8}$'),
  contact_name text not null check (length(btrim(contact_name)) between 2 and 120),
  email text not null check (email = lower(email) and length(email) <= 254 and position('@' in email) > 1),
  phone_e164 text not null check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  occupation_slugs text[] not null default '{}',
  occupation_other text check (length(btrim(occupation_other)) between 2 and 120),
  headcount smallint not null check (headcount between 1 and 500),
  start_asap boolean not null default true,
  start_date date,
  duration public.request_duration not null default 'unknown',
  hours_per_week smallint check (hours_per_week between 1 and 60),
  work_city text not null check (length(btrim(work_city)) between 2 and 80),
  description text check (length(description) <= 2000),
  locale public.app_locale not null default 'nl',
  utm jsonb check (utm is null or jsonb_typeof(utm) = 'object'),
  assigned_to uuid references public.admin_profiles (id) on delete set null,
  privacy_notice_version text check (length(privacy_notice_version) <= 40),
  submission_id uuid unique,
  status_changed_at timestamptz not null default now(),
  retain_until timestamptz not null default now(),            -- trigger
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint staff_requests_occupation check (cardinality(occupation_slugs) > 0 or occupation_other is not null),
  constraint staff_requests_start check ((start_asap and start_date is null) or (not start_asap and start_date is not null))
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  status public.message_status not null default 'new',
  name text not null check (length(btrim(name)) between 2 and 120),
  email text check (email = lower(email) and length(email) <= 254 and position('@' in email) > 1),
  phone_e164 text check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  topic public.contact_topic not null default 'other',
  message text check (length(message) <= 2000),
  locale public.app_locale not null default 'nl',
  privacy_notice_version text check (length(privacy_notice_version) <= 40),
  submission_id uuid unique,
  handled_by uuid references public.admin_profiles (id) on delete set null,
  handled_at timestamptz,
  status_changed_at timestamptz not null default now(),
  retain_until timestamptz not null default now(),            -- trigger
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contact_messages_reachable check (email is not null or phone_e164 is not null),
  constraint contact_messages_callback check (topic <> 'callback' or phone_e164 is not null),
  constraint contact_messages_body check (topic = 'callback' or (message is not null and length(btrim(message)) >= 2))
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  entity_type public.entity_type not null,
  entity_id uuid not null,
  kind public.activity_kind not null,
  body text check (length(body) <= 4000),
  payload jsonb,
  actor_id uuid default auth.uid() references public.admin_profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.email_log (
  id bigint generated always as identity primary key,
  template text not null check (length(template) <= 60),
  to_hash text not null check (to_hash ~ '^[0-9a-f]{64}$'),   -- sha-256 van het kleine-letteradres (spec 11)
  entity_type public.entity_type,
  entity_id uuid,
  provider_message_id text,
  status public.email_status not null default 'queued',
  error text check (length(error) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  actor_id uuid,
  actor_type public.audit_actor not null,
  action text not null check (action ~ '^[a-z_]+\.[a-z_]+$'),
  entity_type text,
  entity_id uuid,
  changes jsonb,                                              -- veldnamen en statussen, nooit inhoud van persoonsgegevens
  ip_hash text
);
```

Indexen (naast primaire sleutels en `unique`):

```sql
create index vacancies_status_publish_idx on public.vacancies (status, publish_at);
create index vacancies_status_closes_idx on public.vacancies (status, closes_at);
create index vacancies_occupation_idx on public.vacancies (occupation_slug);
create index vacancies_city_slug_idx on public.vacancies (city_slug);
create index vacancies_contact_idx on public.vacancies (contact_admin_id);
create index vacancies_created_by_idx on public.vacancies (created_by);
create index vacancies_updated_by_idx on public.vacancies (updated_by);
create unique index vacancy_translations_locale_slug_key on public.vacancy_translations (locale, slug);
create index applications_status_created_idx on public.applications (status, created_at desc);
create index applications_vacancy_idx on public.applications (vacancy_id);
create index applications_email_idx on public.applications (email);
create index applications_phone_idx on public.applications (phone_e164);
create index applications_retain_idx on public.applications (retain_until) where anonymized_at is null;
create index applications_assigned_idx on public.applications (assigned_to);
create index staff_requests_status_created_idx on public.staff_requests (status, created_at desc);
create index staff_requests_retain_idx on public.staff_requests (retain_until);
create index staff_requests_assigned_idx on public.staff_requests (assigned_to);
create index contact_messages_status_created_idx on public.contact_messages (status, created_at desc);
create index contact_messages_retain_idx on public.contact_messages (retain_until);
create index contact_messages_handled_by_idx on public.contact_messages (handled_by);
create index activities_entity_idx on public.activities (entity_type, entity_id, created_at desc);
create index activities_actor_idx on public.activities (actor_id);
create index email_log_created_idx on public.email_log (created_at);
create index email_log_entity_idx on public.email_log (entity_type, entity_id);
create index audit_log_occurred_idx on public.audit_log (occurred_at);
create index audit_log_entity_idx on public.audit_log (entity_type, entity_id);
```

### 5.4 Migratie 3: rolfuncties en publieke staat

```sql
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select auth.jwt() ->> 'aal'), '') = 'aal2'
     and exists (select 1 from public.admin_profiles p where p.id = (select auth.uid()) and p.is_active)
$$;

create or replace function public.is_owner() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select auth.jwt() ->> 'aal'), '') = 'aal2'
     and exists (select 1 from public.admin_profiles p
                 where p.id = (select auth.uid()) and p.is_active and p.role = 'owner')
$$;

create or replace function public.vacancy_public_state(
  p_status public.vacancy_status, p_publish_at timestamptz, p_closes_at timestamptz, p_closed_at timestamptz
) returns text language sql stable set search_path = '' as $$
  select case
    when (p_status = 'published' or (p_status = 'scheduled' and p_publish_at is not null))
         and coalesce(p_publish_at, now()) <= now() and p_closes_at > now() then 'open'
    when p_status = 'published' and p_closes_at <= now() and p_closes_at > now() - interval '30 days' then 'closed'
    when p_status = 'closed' and p_closed_at > now() - interval '30 days' then 'closed'
    else null
  end
$$;
```

Rollen: Jimmy en Lorenzo zijn allebei `owner` (B-06). `recruiter` bestaat
voor een latere medewerker en mag alles behalve verwijderen en de logboeken
lezen.

### 5.5 Migratie 3: triggers, regels en RPC's

**Statusovergangen vacature.** Toegestaan, anders fout
`vacancy_invalid_transition:<van>_<naar>`:

| Van | Naar |
|---|---|
| `draft` | `scheduled`, `published`, `archived` |
| `scheduled` | `draft`, `published` |
| `published` | `draft` (offline halen), `closed` |
| `closed` | `published` (heropenen), `archived` |
| `archived` | `draft` (terugzetten) |

Bij `insert` is elke status toegestaan (seed en migraties); de beheerschermen
maken altijd een concept.

```sql
create or replace function public.vacancies_before_write() returns trigger
language plpgsql set search_path = '' as $$
declare v_from public.vacancy_status := case when tg_op = 'UPDATE' then old.status end;
begin
  if tg_op = 'UPDATE' and new.number <> old.number then
    raise exception using errcode = 'P0001', message = 'vacancy_number_immutable';
  end if;
  new.city := public.normalize_city(new.city);
  new.city_slug := nullif(public.slugify(new.city), '');
  if auth.uid() is not null then
    new.updated_by := auth.uid();
    if tg_op = 'INSERT' then new.created_by := coalesce(new.created_by, auth.uid()); end if;
  end if;
  if tg_op = 'UPDATE' and new.status is distinct from old.status then
    if not ((v_from = 'draft' and new.status in ('scheduled','published','archived'))
         or (v_from = 'scheduled' and new.status in ('draft','published'))
         or (v_from = 'published' and new.status in ('draft','closed'))
         or (v_from = 'closed' and new.status in ('published','archived'))
         or (v_from = 'archived' and new.status = 'draft')) then
      raise exception using errcode = 'P0001', message = 'vacancy_invalid_transition:' || v_from || '_' || new.status;
    end if;
    new.status_changed_at := now();
  end if;
  if tg_op = 'INSERT' or new.status is distinct from v_from then
    if new.status = 'published' then
      new.publish_at := least(coalesce(new.publish_at, now()), now());
      new.published_at := coalesce(new.published_at, now());
      if new.closes_at is null or new.closes_at <= now() then new.closes_at := now() + interval '45 days'; end if;
      new.closed_at := null; new.close_reason := null; new.archived_at := null;
    elsif new.status = 'scheduled' then
      if new.publish_at is null or new.publish_at <= now() then
        raise exception using errcode = 'P0001', message = 'vacancy_not_publishable:publish_at';
      end if;
      if new.closes_at is null or new.closes_at <= new.publish_at then new.closes_at := new.publish_at + interval '45 days'; end if;
      new.closed_at := null; new.close_reason := null; new.archived_at := null;
    elsif new.status = 'closed' then
      new.closed_at := coalesce(new.closed_at, now());
      new.close_reason := coalesce(new.close_reason, 'other');
    elsif new.status = 'archived' then
      new.archived_at := coalesce(new.archived_at, now());
    elsif new.status = 'draft' and tg_op = 'UPDATE' then
      new.publish_at := null; new.closes_at := null; new.closed_at := null; new.close_reason := null; new.archived_at := null;
    end if;
  end if;
  return new;
end $$;
create trigger vacancies_before_write before insert or update on public.vacancies
  for each row execute function public.vacancies_before_write();
```

`published_at` blijft de eerste publicatiedatum, ook na offline halen en
opnieuw publiceren, zodat `datePosted` niet kunstmatig ververst.

**Slug.** Trigger `vacancy_translations_before_write` (before insert or
update of `title`) leest `city_slug` en `number` van de vacature en zet
`new.slug := public.vacancy_slug(new.title, city_slug, number)`. Trigger
`vacancies_after_city_change` (after update of `city` on `vacancies`) werkt de
slug van alle vertalingen bij. Voorbeelden: titel "Glazenwasser", plaats
"Den Haag", nummer 1001 geeft `glazenwasser-den-haag-1001`; titel
"Glazenwasser Den Haag" geeft dezelfde slug, omdat de plaats niet dubbel
wordt opgenomen; zonder plaats geeft hij `glazenwasser-1001`.

**Publicatiecontrole (B-06).**

```sql
create or replace function public.vacancy_publish_errors(p_vacancy_id uuid) returns text[]
language sql stable set search_path = '' as $$
  select array_remove(array[
    case when t.title is null then 'title' end,
    case when v.city is null then 'city' end,
    case when v.hours_min is null or v.hours_max is null then 'hours' end,
    case when v.salary_min is null or v.salary_max is null then 'salary' end,
    case when coalesce(length(btrim(t.intro)), 0) < 20 then 'intro' end,
    case when coalesce(cardinality(t.tasks), 0) < 3 then 'tasks' end,
    case when coalesce(cardinality(t.requirements), 0) < 1 then 'requirements' end,
    case when coalesce(cardinality(t.offer), 0) < 1 then 'offer' end,
    case when not v.start_asap and v.start_date is null then 'start' end,
    -- telefoonnummer verplicht sinds 20261003090000_kruiscontrole_1.sql, punt (8) (B-21)
    case when p.id is null or p.phone_e164 is null then 'contact' end
  ], null)
  from public.vacancies v
  left join public.vacancy_translations t on t.vacancy_id = v.id and t.locale = 'nl'
  left join public.admin_profiles p on p.id = v.contact_admin_id and p.is_active
  where v.id = p_vacancy_id
$$;

create or replace function public.assert_vacancy_publishable() returns trigger
language plpgsql set search_path = '' as $$
declare v_id uuid; v_status public.vacancy_status; v_errors text[];
begin
  v_id := case when tg_table_name = 'vacancies' then new.id else new.vacancy_id end;
  select status into v_status from public.vacancies where id = v_id;
  if v_status in ('scheduled', 'published') then
    v_errors := public.vacancy_publish_errors(v_id);
    if cardinality(v_errors) > 0 then
      raise exception using errcode = 'P0001', message = 'vacancy_not_publishable:' || array_to_string(v_errors, ',');
    end if;
  end if;
  return null;
end $$;
create constraint trigger vacancies_publishable after insert or update on public.vacancies
  deferrable initially deferred for each row execute function public.assert_vacancy_publishable();
create constraint trigger vacancy_translations_publishable after insert or update on public.vacancy_translations
  deferrable initially deferred for each row when (new.locale = 'nl') execute function public.assert_vacancy_publishable();
```

De sluitdatum (standaard 45 dagen) en het publicatiemoment zet de
before-trigger zelf. De controle is uitgesteld tot het einde van de
transactie, zodat een vacature en haar tekst in één transactie kunnen worden
opgeslagen en gepubliceerd (seed, `save_vacancy`).

**RPC's voor spec 08** (security invoker, dus RLS geldt; `execute` alleen
voor `authenticated`):

| Functie | Doet |
|---|---|
| `save_vacancy(p_id uuid, p_vacancy jsonb, p_nl jsonb) returns table (vacancy_id uuid, vacancy_number integer, vacancy_slug text)` | Controleert `is_admin()` (anders `not_admin`). Leest beide jsonb's met `jsonb_populate_record`. Bij `p_id is null` een insert in `vacancies`, anders een update (`vacancy_not_found` als er geen rij is). Bewerkbare kolommen: `occupation_slug, city, postal_code, province, location_label, positions_count, contract_type, hours_min, hours_max, shifts, salary_min, salary_max, salary_note, education_level, experience_level, experience_months, required_qualifications, preferred_qualifications, training_offered, min_age_18, min_age_reason, start_asap, start_date, workplace_language, publish_at, closes_at, is_featured, is_urgent, allow_whatsapp_apply, contact_admin_id, image_path`. Not-null-kolommen krijgen bij een lege waarde de standaard via `coalesce`. Bij een bestaande vacature met status `scheduled`, `published` of `closed` geldt `closes_at := coalesce(<invoer>, v.closes_at)`, zodat een leeg veld de sluitdatum niet wist. `workplace_language` mag leeg blijven en is niet verplicht om te publiceren. Daarna een upsert van de `nl`-vertaling (`title, summary, intro, tasks, requirements, offer, extra, seo_title, seo_description`). Status wijzigt niet via deze functie. `p_vacancy` bevat altijd alle bewerkbare velden. |
| `duplicate_vacancy(p_id uuid) returns table (vacancy_id uuid, vacancy_number integer)` | Maakt een concept met dezelfde velden en tekst; titel `left(title, 72) || ' (kopie)'`; `is_featured` uit; publicatievelden leeg. |
| `vacancy_publish_errors(p_vacancy_id uuid) returns text[]` | Zoals hierboven; spec 08 toont de fouten vooraf. |

Statuswijzigingen doet spec 08 met een gewone update (`status`,
`close_reason`, `publish_at`, `closes_at`); de triggers regelen de rest.

**Foutcodes** (in `message` van de exception; spec 08 vertaalt ze in
`app/beheer/_strings.ts`): `vacancy_not_publishable:<codes>` met codes
`title, city, hours, salary, intro, tasks, requirements, offer, start,
contact, publish_at`; `vacancy_invalid_transition:<van>_<naar>`;
`vacancy_number_immutable`; `vacancy_not_found`; `not_admin`;
`unknown_occupation`. Postgres-codes: `23505` voor een dubbele
`submission_id`, `23514` voor een check, `42501` voor ontbrekende rechten.

**Sollicitaties.**

```sql
create or replace function public.application_retain_until(
  p_kind public.application_kind, p_created_at timestamptz, p_last_contact_at timestamptz,
  p_completed_at timestamptz, p_consent boolean, p_consent_at timestamptz
) returns timestamptz language sql immutable set search_path = '' as $$
  select case
    when p_kind = 'registration' then least(coalesce(p_consent_at, p_created_at) + interval '365 days',
         coalesce(p_completed_at, coalesce(p_last_contact_at, p_created_at) + interval '84 days') + interval '28 days')
    when p_completed_at is not null then p_completed_at + case when p_consent then interval '365 days' else interval '28 days' end
    else coalesce(p_last_contact_at, p_created_at) + interval '84 days'
         + case when p_consent then interval '365 days' else interval '28 days' end
  end
$$;
```

De registratietak komt uit `20261003090000_kruiscontrole_1.sql` (B-07): een
inschrijving blijft 365 dagen na de toestemming bewaard, of 28 dagen na
afsluiten (handmatig of automatisch na 12 weken zonder contact) als dat eerder
is. Zolang een inschrijving open is, rekent de functie met het moment van
automatisch afsluiten.

Trigger `applications_before_write` (before insert or update):

1. De functie declareert `v_n bigint := nextval('public.application_reference_seq');`.
   Bij insert: `reference := 'S-' || to_char(now() at time zone 'Europe/Amsterdam', 'YYYY') || '-' || lpad(v_n::text, greatest(4, length(v_n::text)), '0')`.
   Zo kapt `lpad` vanaf nummer 10000 niet af; de referentie past op
   `^S-\d{4}-\d{4,}$`.
2. `email := lower(btrim(email))`.
3. Statuswissel: `status_changed_at := now()`; als `auth.uid()` gevuld is ook
   `last_contact_at := now()`.
4. Naar `placed`, `rejected` of `withdrawn` (vanuit een open status of bij
   insert): `completed_at := now()`. Terug naar een open status:
   `completed_at := null`. Een met de hand gezette `completed_at` op een
   afgeronde sollicitatie blijft staan (nodig voor tests).
5. `retention_consent` wordt true en `retention_consent_at` is leeg:
   `retention_consent_at := now()` en `retention_consent_source :=
   coalesce(retention_consent_source, 'form')`. Wordt hij false: beide leeg.
6. Zolang `anonymized_at` leeg is: `retain_until :=
   public.application_retain_until(...)`.

Trigger `applications_after_status_change` (after update, security definer):
bij een statuswissel met `auth.uid()` gevuld een regel in `activities` met
`kind = 'status_change'` en `payload = {"from": ..., "to": ...}`.

Trigger `assert_occupation_slugs` (before insert or update op `applications`
en `staff_requests`): elke waarde in `occupation_slugs` moet in `occupations`
bestaan, anders `unknown_occupation` (code `23503`).

**Aanvragen en berichten.** `staff_requests_before_write` declareert
`v_n bigint := nextval('public.staff_request_reference_seq');` en zet bij
insert `reference := 'P-' || <jaar> || '-' || lpad(v_n::text, greatest(4,
length(v_n::text)), '0')`, passend op `^P-\d{4}-\d{4,}$`; verder `email` naar kleine letters, `status_changed_at`
bij een statuswissel, `retain_until := status_changed_at + interval '730
days'`. `contact_messages_before_write`: `email` naar kleine letters,
statuswissel zet `status_changed_at`; naar `answered` of `archived` zet
`handled_at := now()` en `handled_by := coalesce(auth.uid(), handled_by)`;
`retain_until := status_changed_at + interval '30 days'` bij `spam`, anders
`coalesce(handled_at, created_at) + interval '182 days'`.

**Activiteiten.** Trigger `activities_after_insert` (security definer): bij
`entity_type = 'application'` en `kind` in `note, call, whatsapp,
email_sent` zet hij op die sollicitatie `last_contact_at = now()` en, als de
status `new` is, de status op `in_progress`. Trigger `delete_entity_activities`
(after delete op `vacancies`, `applications`, `staff_requests`,
`contact_messages`) verwijdert de activiteiten van die rij.

**Logboek.** Trigger `write_audit_log` (security definer, argument
`vacancy`, `application`, `staff_request` of `contact_message`) op insert,
update en delete van de vier tabellen. Actie `<entiteit>.created`,
`.status_changed` (`changes = {"from","to"}`), `.updated` (`changes =
{"fields": [...]}`, alleen kolomnamen, en niet als alleen `updated_at`,
`last_contact_at` of `retain_until` veranderde), `.anonymized` (als
`anonymized_at` gevuld raakt) of `.deleted`. `actor_type` is `admin` als
`auth.uid()` gevuld is, `public` bij een insert zonder gebruiker op
`applications`, `staff_requests` of `contact_messages`, en anders `system`.

```sql
create or replace function public.audit_log_protect() returns trigger
language plpgsql set search_path = '' as $$
begin
  if tg_op = 'UPDATE' then raise exception 'audit_log kan alleen worden aangevuld'; end if;
  if old.occurred_at > now() - interval '2 years' then
    raise exception 'regels in audit_log blijven twee jaar bewaard';
  end if;
  return old;
end $$;
create trigger audit_log_protect before update or delete on public.audit_log
  for each row execute function public.audit_log_protect();
```

**Systeemfuncties** (security definer; `revoke execute ... from public,
anon, authenticated` en `grant execute ... to service_role`):

| Functie | Doet |
|---|---|
| `run_vacancy_lifecycle() returns table (event text, vacancy_number integer)` | 1. Per `scheduled` met `publish_at <= now()`: als `vacancy_publish_errors` leeg is status `published` en een rij `('published', nummer)`, anders een `audit_log`-regel `vacancy.publish_failed` met de foutcodes. 2. `published` met `closes_at <= now()` wordt `closed` met `close_reason = 'expired'` en `closed_at = closes_at`. 3. `closed` met `closed_at <= now() - interval '30 days'` wordt `archived`. Gebruik `#variable_conflict use_column`. |
| `auto_close_stale_applications() returns integer` | Status `new`, `in_progress` of `invited`, niet geanonimiseerd, en `coalesce(last_contact_at, created_at) < now() - interval '84 days'`: `kind = 'registration'` wordt `withdrawn`, de rest `rejected`. Per rij een activiteit `auto_closed` met body "Automatisch afgesloten na 12 weken zonder contact." |
| `anonymize_applications(p_ids uuid[]) returns integer` | Alleen rijen uit `p_ids` met `anonymized_at is null` en `retain_until <= now()`: maakt `first_name, last_name, email, phone_e164, city, may_work_in_nl, available_from, has_driving_license_b, message, utm, cv_path, cv_filename, cv_mime, cv_size, assigned_to` leeg en zet `anonymized_at = now()`; verwijdert de activiteiten van die rijen. Vacature, status, bron, beroepen en datums blijven voor statistiek. |
| `purge_expired_records() returns jsonb` | Verwijdert `staff_requests` en `contact_messages` met `retain_until <= now()`; geeft `{"staff_requests": n, "contact_messages": n}`. |
| `purge_logs() returns jsonb` | Verwijdert `email_log` ouder dan 90 dagen en `audit_log` ouder dan 2 jaar; geeft de aantallen. |
| `grant_admin(p_email text, p_full_name text, p_display_name text, p_role public.admin_role default 'owner', p_phone text default null, p_whatsapp text default null) returns uuid` | Zoekt `auth.users` op e-mailadres (fout als die niet bestaat) en maakt of werkt het profiel bij met `is_active = true`; `whatsapp_e164 = coalesce(p_whatsapp, p_phone)`. |

### 5.6 Termijnen op één plek

| Termijn | Waarde | SQL | TypeScript |
|---|---|---|---|
| Sluitdatum na publicatie (B-15) | 45 dagen | `vacancies_before_write` | `VACANCY_DEFAULT_CLOSE_DAYS` |
| Gesloten zichtbaar (B-15) | 30 dagen | `vacancy_public_state`, `run_vacancy_lifecycle` | `CLOSED_VISIBLE_DAYS` |
| Sollicitatie na eindstatus (B-07) | 28 dagen | `application_retain_until` | `RETENTION_DAYS.applicationDefault` |
| Met talentpool-toestemming (B-07) | 365 dagen | idem | `applicationConsent` |
| Inschrijving (B-07) | 365 dagen na toestemming, of 28 dagen na afsluiten (handmatig of automatisch na 12 weken zonder contact) als dat eerder is | idem | `registration`, `applicationDefault`, `staleAutoClose` |
| Herinnering zonder contact (B-07) | 56 dagen | alleen dashboardfilter in spec 08 | `staleReminder` |
| Automatisch afsluiten (B-07) | 84 dagen | `auto_close_stale_applications`, `application_retain_until` | `staleAutoClose` |
| Personeelsaanvraag (B-07) | 730 dagen na laatste statuswissel | `staff_requests_before_write` | `staffRequest` |
| Contactbericht (B-07) | 182 dagen na afhandeling | `contact_messages_before_write` | `contactMessage` |
| Spam (context/11 §8.1) | 30 dagen | idem | `spam` |
| E-maillog (B-07) | 90 dagen | `purge_logs` | `emailLog` |
| Auditlog (B-07) | 2 jaar | `purge_logs`, `audit_log_protect` | `auditLog` |
| Losse uploads | 24 uur | cron `opruimen` | `pendingUploadHours` |

Een gewijzigde termijn is een nieuwe migratie die de functie vervangt, plus
dezelfde wijziging in `lib/data/options.ts` en de tekst van spec 09.

### 5.7 Migratie 4: view `public_vacancies`

```sql
create view public.public_vacancies with (security_invoker = true) as
select
  v.id, v.number, t.slug, t.title, t.summary, t.intro, t.tasks, t.requirements, t.offer, t.extra,
  t.seo_title, t.seo_description,
  v.occupation_slug, o.name_nl as occupation_name_nl, o.plural_nl as occupation_plural_nl,
  o.name_en as occupation_name_en, o.plural_en as occupation_plural_en,
  v.city, v.city_slug, v.postal_code, v.province, v.location_label, v.positions_count,
  v.contract_type, v.hours_min, v.hours_max, v.shifts, v.salary_min, v.salary_max, v.salary_note,
  v.education_level, v.experience_level, v.experience_months,
  v.required_qualifications, v.preferred_qualifications, v.training_offered,
  v.min_age_18, v.min_age_reason, v.start_asap, v.start_date, v.workplace_language,
  coalesce(v.published_at, v.publish_at) as published_at, v.closes_at, v.is_featured, v.is_urgent, v.allow_whatsapp_apply, v.image_path,
  c.display_name as contact_name, c.phone_e164 as contact_phone, c.whatsapp_e164 as contact_whatsapp,
  c.photo_path as contact_photo_path,
  s.state,
  case when s.state = 'closed' then coalesce(v.closed_at, v.closes_at) end as closed_at,
  case when s.state = 'closed' then coalesce(v.close_reason, 'expired') end as close_reason,
  greatest(v.updated_at, t.updated_at) as updated_at
from public.vacancies v
cross join lateral (select public.vacancy_public_state(v.status, v.publish_at, v.closes_at, v.closed_at) as state) s
join public.vacancy_translations t on t.vacancy_id = v.id and t.locale = 'nl'
join public.occupations o on o.slug = v.occupation_slug
left join public.admin_profiles c on c.id = v.contact_admin_id and c.is_active
where s.state is not null;
```

De view is `security_invoker`, dus de RLS van de onderliggende tabellen
geldt voor wie hem leest. De Supabase-advisor meldt daardoor geen
`security_definer_view`.

`coalesce(v.published_at, v.publish_at) as published_at` zorgt dat een
geplande vacature die al open is (de cron heeft hem nog niet op `published`
gezet) een `datePosted` heeft. De view staat in deze vorm opnieuw in
`20261003090000_kruiscontrole_1.sql`, direct gevolgd door dezelfde grants op
`public_vacancies` voor `anon` en `authenticated` als in §5.8.

### 5.8 Migratie 5: RLS en rechten

RLS staat aan op alle tien tabellen (`alter table ... enable row level
security`). In policies staat `(select public.is_admin())` en `(select
auth.uid())` tussen haakjes met `select`, zodat Postgres ze één keer per
query uitrekent.

| Tabel | anon | authenticated, `is_admin()` | alleen `is_owner()` |
|---|---|---|---|
| `admin_profiles` | select van actieve profielen die contactpersoon zijn van een publieke vacature; alleen kolommen `id, display_name, phone_e164, whatsapp_e164, photo_path, is_active` (column grant) | select alles; update van het eigen profiel (`id = auth.uid()`), alleen de kolommen uit de column grant; ieder ingelogd account leest ook zijn eigen rij zonder `aal2` | geen insert of delete via de API; profielen ontstaan via `grant_admin` |
| `occupations` | select waar `is_active` | select alles | insert, update, delete |
| `vacancies` | select waar `vacancy_public_state(...) is not null` | select alles (of publiek), insert, update | delete waar `status = 'draft'` en geen sollicitatie verwijst |
| `vacancy_translations` | select als de vacature voor de lezer zichtbaar is (`exists` op `vacancies`, RLS van `vacancies` geldt in de subquery) | select, insert, update, delete | |
| `applications` | geen | select, insert, update | delete |
| `staff_requests` | geen | select, insert, update | delete |
| `contact_messages` | geen | select, insert, update | delete |
| `activities` | geen | select; insert met `actor_id = auth.uid()` | update, delete |
| `email_log` | geen | geen | select |
| `audit_log` | geen | geen | select |

Een ingelogde gebruiker met alleen `aal1` valt onder dezelfde voorwaarden als
anoniem, plus zijn eigen profielrij. Per rol en actie is er één permissive
policy (de select-policy voor `authenticated` combineert `is_admin()` met de
publieke voorwaarde), zodat de advisor geen `multiple_permissive_policies`
meldt.

Rechten in dezelfde migratie:

```sql
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
grant select on public.occupations, public.vacancies, public.vacancy_translations, public.public_vacancies to anon;
grant select (id, display_name, phone_e164, whatsapp_e164, photo_path, is_active) on public.admin_profiles to anon;
grant select on public.public_vacancies to authenticated;
revoke insert, update, delete on public.admin_profiles from authenticated;
grant update (full_name, display_name, phone_e164, whatsapp_e164, photo_path,
  notify_applications, notify_staff_requests, notify_messages, last_seen_at) on public.admin_profiles to authenticated;
revoke insert, update, delete on public.email_log, public.audit_log from authenticated;
alter default privileges for role postgres in schema public revoke all on tables from anon;
-- systeemfuncties uit §5.5: revoke execute from public, anon, authenticated; grant execute to service_role
-- save_vacancy, duplicate_vacancy, vacancy_publish_errors: revoke from public, anon; grant to authenticated
```

Publieke formulieren (spec 07) schrijven via `createSupabaseAdminClient()`.
Dat is een bewuste keuze boven een insert-policy voor anoniem: de
publishable key is openbaar, dus een policy zou rechtstreekse inserts via de
REST API toestaan buiten BotID, honeypot, invultijd, rate limit en de
zod-validatie om. De Server Action is de enige deur, en die controleert alles
voordat hij schrijft.

### 5.9 Migratie 6: storage

```sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('cvs', 'cvs', false, 10485760, array['application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('public-media', 'public-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
```

| Bucket | Mappen | anon | beheerder (`is_admin()`) | eigenaar |
|---|---|---|---|---|
| `cvs` (privé) | `pending/<uuid>.<ext>`, `applications/<sollicitatie-id>/<uuid>.<ext>` | geen policy; uploaden alleen met een signed upload token dat de server na BotID uitgeeft | select (signed URL maken), insert in `applications/` | delete |
| `public-media` (openbaar) | `contacts/`, `vacancies/`, `occupations/` | lezen via de publieke URL, geen policy nodig | insert, update, delete in die drie mappen | |

Policies op `storage.objects`, bijvoorbeeld:

```sql
create policy cvs_admin_select on storage.objects for select to authenticated
  using (bucket_id = 'cvs' and (select public.is_admin()));
create policy cvs_admin_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'cvs' and (select public.is_admin()) and (storage.foldername(name))[1] = 'applications');
create policy cvs_owner_delete on storage.objects for delete to authenticated
  using (bucket_id = 'cvs' and (select public.is_owner()));
create policy public_media_admin_write on storage.objects for insert to authenticated
  with check (bucket_id = 'public-media' and (select public.is_admin())
              and (storage.foldername(name))[1] in ('contacts', 'vacancies', 'occupations'));
-- plus update en delete voor public-media met dezelfde voorwaarde
```

Bestandsnamen zijn altijd een UUID; de originele naam staat alleen in
`applications.cv_filename`. Cv's gaan nooit als bijlage mee in e-mail (B-20).

### 5.10 Migratie 7: beroepen

```sql
insert into public.occupations (slug, name_nl, plural_nl, name_en, plural_en, sort_order) values
  ('glazenwasser', 'Glazenwasser', 'Glazenwassers', 'Window cleaner', 'Window cleaners', 1),
  ('schoonmaker', 'Schoonmaker', 'Schoonmakers', 'Cleaner', 'Cleaners', 2),
  ('logistiek-medewerker', 'Logistiek medewerker', 'Logistiek medewerkers', 'Logistics worker', 'Logistics workers', 3),
  ('verhuizer', 'Verhuizer', 'Verhuizers', 'Mover', 'Movers', 4),
  ('hulpkracht-bouw-en-sloop', 'Hulpkracht bouw en sloop', 'Hulpkrachten bouw en sloop',
   'Construction and demolition labourer', 'Construction and demolition labourers', 5)
on conflict (slug) do nothing;
```

### 5.11 Seed (`supabase/seed.sql`, alleen `groos-dev`)

De seed staat in één transactie, is opnieuw uit te voeren (vaste nummers en
`on conflict do nothing`) en stopt met een duidelijke melding als er nog geen
actieve beheerder met telefoonnummer is (B-48). Hij begint met dezelfde
upsert van de vijf beroepen als migratie 7, zodat hij ook los werkt.

```sql
begin;
-- 1. beroepen: dezelfde insert als migratie 7
do $$
declare v_a uuid; v_b uuid;
begin
  select id into v_a from public.admin_profiles where is_active and phone_e164 is not null order by created_at limit 1;
  if v_a is null then
    raise exception 'Maak eerst een beheerder met telefoonnummer aan met npm run db:admin -- ... --phone <E.164> (spec 10, bouwopdracht stap 10).';
  end if;
  select id into v_b from public.admin_profiles where is_active and phone_e164 is not null and id <> v_a order by created_at limit 1;
  v_b := coalesce(v_b, v_a);
  -- 2. insert into public.vacancies (number, status, occupation_slug, city, contract_type, hours_min, hours_max,
  --    shifts, salary_min, salary_max, education_level, experience_level, required_qualifications,
  --    preferred_qualifications, training_offered, min_age_18, min_age_reason, publish_at, published_at,
  --    closes_at, closed_at, close_reason, is_featured, is_urgent, contact_admin_id) values (...tabel A...)
  --    on conflict (number) do nothing;
  -- 3. insert into public.vacancy_translations (vacancy_id, locale, title, summary, intro, tasks, requirements,
  --    offer, extra) select v.id, 'nl', ... from (values ...tabel B...) join public.vacancies v using (number)
  --    on conflict (vacancy_id, locale) do nothing;
  -- 4. perform setval('public.vacancy_number_seq', greatest((select max(number) from public.vacancies), 1010));
  -- 5. testsollicitatie, testinschrijving, testaanvraag en testbericht (tabel C)
end $$;
commit;
```

Tabel A (vacatures; `d` is `interval '1 day'`, alle `contract_type =
temp_agency` en `education_level = none`; `experience_level = nice_to_have`
bij 1001, anders `none`):

| Nr | Status en datums | Beroep | Plaats | Uren | Loon | Diensten | Kwalificaties (vereist / pré / opleiding) | 18+ | Vlag | Contact |
|---|---|---|---|---|---|---|---|---|---|---|
| 1001 | published, publish_at en published_at now() minus 5 d, closes_at now() plus 40 d | glazenwasser | Den Haag | 32 tot 40 | 16,08 tot 17,50 | early, day | rijbewijs_b / vca_basis, ipaf / | work_at_height | featured | v_a |
| 1002 | published, min 2 d, plus 43 d | schoonmaker | Rijswijk | 12 tot 20 | 15,52 tot 16,08 | evening | geen | nee | | v_b |
| 1003 | published, min 1 d, plus 44 d | logistiek-medewerker | Naaldwijk | 32 tot 40 | 14,99 tot 16,20 | early, weekend | / ept / | nee | urgent | v_a |
| 1004 | published, min 10 d, plus 35 d | logistiek-medewerker | Zoetermeer | 36 tot 40 | 15,60 tot 17,80 | early, evening | heftruck / / | forklift | | v_b |
| 1005 | published, min 3 d, plus 42 d | verhuizer | Den Haag | 24 tot 40 | 14,99 tot 16,00 | day, weekend | / rijbewijs_b / | nee | featured | v_a |
| 1006 | published, min 7 d, plus 38 d | hulpkracht-bouw-en-sloop | Den Haag | 40 tot 40 | 15,98 tot 17,00 | day | vca_basis / / | construction_demolition | | v_b |
| 1007 | closed, filled, published min 25 d, closes_at plus 20 d, closed_at min 5 d | schoonmaker | Delft | 32 tot 38 | 16,08 tot 16,70 | day | / vca_basis / | nee | | v_a |
| 1008 | scheduled, publish_at now() plus 2 d, closes_at plus 47 d | logistiek-medewerker | Honselersdijk | 24 tot 40 | 14,99 tot 16,04 | early | geen | nee | | v_b |
| 1009 | draft, geen datums | hulpkracht-bouw-en-sloop | Leidschendam | 40 tot 40 | 16,97 tot 18,95 | day | vca_basis / / | construction_demolition | | v_a |
| 1010 | closed, withdrawn, published min 80 d, closes_at min 35 d, closed_at min 40 d | verhuizer | Wassenaar | 16 tot 24 | 14,99 tot 15,80 | day | geen | nee | | v_b |

Tabel B (teksten; elke vacature krijgt als `extra`: "Dit is een
testvacature voor de ontwikkelomgeving. Er zit geen echte opdrachtgever
achter."; elke samenvatting begint met "Testvacature."):

| Nr | Titel | Samenvatting | Intro | Taken | Eisen | Aanbod |
|---|---|---|---|---|---|---|
| 1001 | Glazenwasser | Testvacature. Je wast ramen van kantoren en winkels in Den Haag, in een vaste ploeg. | Je maakt ramen en kozijnen van kantoren en winkels in Den Haag schoon. Je werkt overdag in een ploeg van drie collega's en begint om 07.00 uur. | Ramen wassen met een telescopisch wassysteem; Kozijnen en deuren afnemen; Werken vanaf een hoogwerker als dat nodig is; De bus netjes achterlaten aan het eind van de dag | Je hebt rijbewijs B; Je kunt goed tegen werken op hoogte | Een bruto uurloon tussen € 16,08 en € 17,50; 8 procent vakantiegeld bovenop je loon; Een vaste contactpersoon bij Groos |
| 1002 | Schoonmaker kantoren | Testvacature. Je maakt 's avonds kantoren schoon in Rijswijk, 12 tot 20 uur per week. | Je maakt na kantoortijd werkplekken, keukens en toiletten schoon. Je werkt op maandag tot en met vrijdag tussen 18.00 en 22.00 uur. | Bureaus en vloeren schoonmaken; Keukens en toiletten schoonmaken en bijvullen; Afval scheiden en wegbrengen | Je bent betrouwbaar en werkt graag zelfstandig | Een bruto uurloon tussen € 15,52 en € 16,08; Een toeslag voor uren na 21.30 uur gelijk aan die van vaste collega's; Een vaste contactpersoon bij Groos |
| 1003 | Orderpicker | Testvacature. Je verzamelt bestellingen in een magazijn in Naaldwijk, ook op zaterdag. | Je verzamelt orders met een scanner en zet ze klaar voor de vrachtwagen. Je begint vroeg, meestal om 06.00 uur, en werkt ook op zaterdag. | Orders verzamelen met een scanner; Rijden met een elektrische pallettruck; Karren klaarzetten voor transport; Het magazijn opgeruimd houden | Je kunt vroeg beginnen en op zaterdag werken | Een bruto uurloon tussen € 14,99 en € 16,20; 8 procent vakantiegeld bovenop je loon; Werkschoenen en handschoenen krijg je kosteloos |
| 1004 | Heftruckchauffeur | Testvacature. Je rijdt heftruck in een distributiecentrum in Zoetermeer, in vroege en late diensten. | Je laadt en lost vrachtwagens en zet pallets op de juiste plek in het magazijn. Je werkt de ene week vroeg en de andere week laat. | Vrachtwagens laden en lossen; Pallets in de stellingen zetten; Voorraad tellen; Schade aan goederen melden | Je hebt een geldig heftruckcertificaat; Je kunt in wisselende diensten werken | Een bruto uurloon tussen € 15,60 en € 17,80; Een toeslag voor late diensten gelijk aan die van vaste collega's; 8 procent vakantiegeld bovenop je loon |
| 1005 | Verhuizer | Testvacature. Je helpt bij verhuizingen van gezinnen en kantoren in Den Haag en omgeving. | Je pakt inboedels in, draagt meubels naar buiten en zet alles op het nieuwe adres weer neer. Je werkt in een ploeg en begint meestal om 07.30 uur. | Meubels demonteren en weer opbouwen; Dozen en meubels sjouwen en in de wagen zetten; Zorgen dat niets beschadigt; Klanten netjes te woord staan | Je kunt de hele dag fysiek werken | Een bruto uurloon tussen € 14,99 en € 16,00; Werk op zaterdag als je dat wilt; Een vaste contactpersoon bij Groos |
| 1006 | Hulpkracht sloop | Testvacature. Je helpt bij het strippen en slopen van woningen in Den Haag. | Je haalt keukens, plafonds en vloeren uit woningen die worden gerenoveerd. Je werkt van 07.00 tot 16.00 uur in een vaste ploeg. | Keukens en plafonds verwijderen; Sloopafval scheiden en afvoeren; De werkplek veilig en opgeruimd houden | Je hebt VCA Basis of wilt het halen; Je stopt en meldt het als je asbest vermoedt | Een bruto uurloon tussen € 15,98 en € 17,00; 8 procent vakantiegeld bovenop je loon; Beschermingsmiddelen krijg je kosteloos |
| 1007 | Opleveringsschoonmaker | Testvacature. Je maakt nieuwbouwwoningen in Delft schoon voor de oplevering. | Je verwijdert bouwstof, verfspatten en kitresten in nieuwe woningen. Je werkt overdag in een ploeg die per project werkt. | Ramen en kozijnen schoonmaken; Vloeren stofvrij maken; Sanitair en keukens schoonmaken | Je werkt nauwkeurig | Een bruto uurloon tussen € 16,08 en € 16,70; 8 procent vakantiegeld bovenop je loon |
| 1008 | Medewerker bloemenlogistiek | Testvacature. Je zet bloemen en planten klaar voor transport in Honselersdijk. | Je verwerkt bloemen en planten en zet ze op karren klaar voor de klant. Je begint vroeg, meestal om 05.00 uur. | Karren laden met bloemen en planten; Labels controleren; Fust sorteren | Je kunt vroeg beginnen | Een bruto uurloon tussen € 14,99 en € 16,04; Een toeslag voor vroege uren gelijk aan die van vaste collega's |
| 1009 | Opperman | Testvacature. Je helpt metselaars op een bouwplaats in Leidschendam. | Je zorgt dat metselaars altijd stenen en specie bij de hand hebben. Je werkt buiten, van 07.00 tot 16.00 uur. | Specie mengen; Stenen aangeven; De steiger opgeruimd houden | Je hebt VCA Basis | Een bruto uurloon tussen € 16,97 en € 18,95; Beschermingsmiddelen krijg je kosteloos |
| 1010 | Bijrijder verhuizingen | Testvacature. Je rijdt mee met verhuizingen in Wassenaar. | Je helpt de chauffeur met laden, lossen en de weg vinden. Je werkt overdag, vaak aan het begin en eind van de maand. | Laden en lossen; Navigeren onderweg; Meubels inpakken | Je bent op tijd en werkt zorgvuldig | Een bruto uurloon tussen € 14,99 en € 15,80; Een vaste contactpersoon bij Groos |

(Puntkomma's scheiden de lijstitems in deze tabel; in SQL is elke lijst een
`array['...', '...']`.)

Tabel C (overige testdata, alle adressen op `example.com`):

| Tabel | Waarden |
|---|---|
| `applications` | `kind vacancy`, vacature 1001 (`vacancy_number 1001`, `vacancy_title_snapshot 'Glazenwasser'`, `occupation_slugs '{glazenwasser}'`), `source website`, Test Kandidaat, `test.kandidaat@example.com`, `+31600000001`, Den Haag, `may_work_in_nl true`, `has_driving_license_b true`, bericht "Testsollicitatie uit de seed. Dit is geen echte persoon.", `privacy_notice_version 'seed'`, `submission_id '00000000-0000-4000-8000-000000000001'` |
| `applications` | `kind registration`, Test Inschrijver, `test.inschrijver@example.com`, `+31600000002`, Delft, `may_work_in_nl true`, `occupation_slugs '{schoonmaker,glazenwasser}'`, `retention_consent true`, `submission_id '...0002'` |
| `staff_requests` | Testbedrijf B.V., Test Opdrachtgever, `test.opdrachtgever@example.com`, `+31700000001`, `occupation_slugs '{schoonmaker}'`, `headcount 3`, `duration weeks`, `hours_per_week 24`, `work_city 'Den Haag'`, toelichting "Testaanvraag uit de seed.", `submission_id '...0003'` |
| `contact_messages` | Test Bezoeker, `+31600000003`, `topic callback`, `submission_id '...0004'` |

De seed kiest alleen actieve beheerders met een telefoonnummer als
contactpersoon (B-48); `npm run db:admin` zet dat met `--phone`.

**Seed-reset (`supabase/seed-reset.sql`, alleen `groos-dev`).** De seed is
idempotent maar laat bestaande rijen staan, zodat de relatieve datums na een
paar dagen verlopen en testmutaties blijven hangen. `npm run db:seed:reset`
(§4.7) leegt daarom eerst de testdata en laadt dan de seed opnieuw.
`seed-reset.sql` is één transactie:

```sql
begin;
do $$
begin
  if exists (select 1 from public.vacancies) and not exists (select 1 from public.vacancy_translations where summary like 'Testvacature.%') then raise exception 'seed-reset geweigerd: geen seeddata gevonden'; end if;
end $$;
delete from public.activities; delete from public.email_log; delete from public.applications; delete from public.staff_requests; delete from public.contact_messages; delete from public.vacancies;
commit;
```

De vertalingen verdwijnen via de cascade op `vacancy_translations`;
`admin_profiles` en `audit_log` blijven staan. De seed zet daarna de
relatieve datums opnieuw en de sequence op 1010 (stap 4 van de seed, met een
lege tabel geeft `greatest` 1010). Daarna ververs je de cache met `POST
/api/dev/revalidate` en body `{"numbers":[],"kind":"visibility"}` (§4.4,
B-46). Zonder `psql` gaat dezelfde SQL via `execute_sql` van de MCP (B-39).

De seed en de seed-reset draaien nooit op productie. Productie krijgt alleen
migraties (spec 13).

## 6 Tekstelementen

Deze module is eigenaar van geen enkele messages-namespace en geen
`content/`-bestand. De tabellen hieronder zijn invoer voor spec 06
(`vacatures`-labels in messages), spec 07 (`forms`) en spec 08
(`app/beheer/_strings.ts`); die specs bepalen de sleutels. Toon volgt spec
03: je-vorm voor werkzoekenden, u-vorm voor opdrachtgevers.

| Waardenset | Waarde: voorgesteld Nederlands label |
|---|---|
| `contract_type` | `temp_agency`: Uitzenden; `secondment`: Detachering; `recruitment`: In dienst bij de opdrachtgever |
| `shift` (URL-slug) | `early` (vroeg): Vroege dienst; `day` (dag): Dagdienst; `evening` (avond): Avonddienst; `night` (nacht): Nachtdienst; `weekend` (weekend): Weekend |
| uren-bucket | `tot-20`: Tot en met 20 uur; `20-32`: 21 tot en met 31 uur; `32-plus`: 32 uur of meer |
| `education_level` | Geen opleiding nodig, Vmbo, Mbo 1, Mbo 2, Mbo 3, Mbo 4, Havo of vwo, Hbo, Wo |
| `experience_level` | Geen ervaring nodig; Ervaring is mooi meegenomen; Ervaring nodig |
| `qualification` | VCA Basis; VCA VOL; Heftruckcertificaat; Reachtruckcertificaat; EPT-certificaat; IPAF (hoogwerker); VOG; Rijbewijs B; Rijbewijs BE; Rijbewijs C; Code 95; RAS-vakopleiding |
| `workplace_language` | `nl`: Nederlands; `en`: Engels; `nl_or_en`: Nederlands of Engels |
| `close_reason` | `filled`: Vervuld; `expired`: Verlopen; `withdrawn`: Ingetrokken; `other`: Anders |
| `request_duration` | Eén dag; Enkele dagen; Enkele weken; Enkele maanden; Langdurig; Weet ik nog niet |
| `contact_topic` | `job_seeker`: Ik zoek werk; `employer`: Ik zoek personeel; `callback`: Bel mij terug; `other`: Iets anders |
| `application_source` | Website, WhatsApp, Telefoon, Langsgekomen, E-mail, Via via, Vacaturesite, Anders |

Zinnen bij `min_age_reason` (B-32), voor de vacaturepagina in je-vorm:

| Waarde | Zin |
|---|---|
| `work_at_height` | Omdat je op hoogte werkt, is de minimumleeftijd 18 jaar. |
| `construction_demolition` | Omdat je op een bouw- of sloopplaats werkt, is de minimumleeftijd 18 jaar. |
| `forklift` | Omdat je met een heftruck of reachtruck rijdt, is de minimumleeftijd 18 jaar. |
| `night_work` | Omdat je ook 's nachts werkt, is de minimumleeftijd 18 jaar. |
| `hazardous_substances` | Omdat je met gevaarlijke stoffen werkt, is de minimumleeftijd 18 jaar. |

De seedteksten in §5.11 volgen de schrijfregels: alinea's van twee zinnen,
je-vorm, B1, geen uitroeptekens, geen streepjes in zinnen en geen
onbevestigde claims (geen weekloon, geen reactietermijn, geen cao van Groos).

## 7 SEO

Deze module levert de data; de metadata en JSON-LD zijn van spec 06 en 12.

| Behoefte (B-15, R-10) | Bron |
|---|---|
| `JobPosting.title` | `title` (alleen de functie, check op 80 tekens) |
| `description` | `intro`, `tasks`, `requirements`, `offer`, `extra` |
| `datePosted` | `publishedAt` (eerste publicatie, verandert niet bij heropenen; valt terug op `publish_at` als de cron een geplande vacature nog niet heeft gepubliceerd) |
| `validThrough` | `closesAt` |
| `employmentType` | `contractType` en `hoursMin`, `hoursMax` |
| `jobLocation` | `city`, `postalCode`, `province`, land NL |
| `baseSalary` | `salaryMin`, `salaryMax`, altijd EUR per uur (`HOUR`) |
| `identifier` | `number` |
| `educationRequirements`, `experienceRequirements` | `educationLevel`, `experienceLevel`, `experienceMonths` |
| `totalJobOpenings`, `jobStartDate` | `positionsCount`, `startDate` |
| Gesloten: `noindex, follow`, geen JobPosting, niet in de sitemap | `state === "closed"` in `VacancyDetail`; `getVacancySitemapEntries()` bevat alleen open vacatures |
| 404 na 30 dagen en bij archiveren | `getVacancyByNumber()` geeft `null` |
| 308 bij een afwijkende slug | `parseVacancySlug()` geeft het nummer; spec 06 vergelijkt met `slug` |
| Filterpagina's `noindex, follow` (B-16) | `isFiltered` uit `parseVacancySearchParams()` |
| Sitemap `lastModified` | `updated_at` van vacature of tekst, de laatste van de twee |

`/api/*` valt buiten de proxy en hoort in `robots.txt` onder `Disallow`
(spec 12).

## 8 Toegankelijkheid en performance

Toegankelijkheid is niet van toepassing; er is geen UI. Wel draagt de data
bij: `asksDrivingLicenseB` laat spec 07 alleen relevante velden tonen, en
foutcodes zijn stabiel zodat spec 08 begrijpelijke meldingen kan geven.

Performance:

1. Eén query per cache-miss voor alle publieke lijsten, en één per
   vacaturedetail. Supabase staat in `eu-central-1`; de Vercel-functies horen
   in `fra1` (spec 13).
2. Lijstpagina's renderen server-side met data uit `unstable_cache`
   (revalidate 3600 en tags); er zijn geen client-side datafetches nodig.
3. `generateStaticParams` gebruikt `listOpenVacancyParams()`; nieuwe
   vacatures komen erbij via `dynamicParams = true` (B-35).
4. Indexen dekken elke foreign key en elk filter van de cron-taken; de
   performance-advisor van Supabase mag geen `unindexed_foreign_keys` melden.
5. Cv's gaan nooit door een Vercel-functie bij het uploaden (signed upload
   URL), zodat de bodylimiet van 4,5 MB niet speelt. Alleen
   `finalizeCvUpload` leest het bestand één keer voor de controle.
6. De secret key en `lib/data/vacancies.ts` komen nooit in een clientbundel
   (`import "server-only"`).

## 9 21st.dev-opdracht voor sub-agents

Niet van toepassing. Deze module levert alleen database, Storage,
server-modules, route handlers en scripts, zonder één zichtbaar element; er
valt in 21st.dev niets te kiezen dat hier past. De bouw-agent van deze module
spawnt daarom geen sub-agents voor 21st.dev en roept `search`,
`get_inspiration` en `get_component` niet aan. De UI die deze data toont
(vacaturekaarten, filters, formulieren, beheer) krijgt haar 21st.dev-opdracht
in spec 06, 07 en 08.

## 10 Bouwopdracht

Werk in deze volgorde; dit is stap 1 van 00 §6, samen met spec 13.

Bouwstap 1 is gecommit en `groos-dev` heeft de migraties. Wijzigingen uit
kruiscontrole ronde 1 komen in bouwstap 3b (00 §6) in
`supabase/migrations/20261003090000_kruiscontrole_1.sql`; bestaande
migratiebestanden blijven ongewijzigd (B-39). Inhoud: (1)
`application_retain_until` met de nieuwe registratietak; (2)
`applications_before_write` en `staff_requests_before_write` met `lpad` zonder
afkappen; (3) enum `workplace_language` en kolom
`vacancies.workplace_language`; (4) enum `qualification` zonder `dav` (hernoem
het oude type, maak het nieuwe, zet per kolom (`required_qualifications`,
`preferred_qualifications`, `training_offered`) eerst `alter column <kolom>
drop default`, dan `alter column <kolom> type public.qualification[] using
<kolom>::text[]::public.qualification[]` en dan `alter column <kolom> set
default '{}'`, drop het oude type; de view gaat eerst weg); (5) view
`public_vacancies` opnieuw met `v.workplace_language` en
`coalesce(v.published_at, v.publish_at) as published_at`; na `create view
public.public_vacancies with (security_invoker = true) as ...` volgen opnieuw
`grant select on public.public_vacancies to anon;` en `grant select on
public.public_vacancies to authenticated;` (§5.8); (6) `save_vacancy`
met `workplace_language` en de `closes_at`-regel; (7) `update
public.applications set retain_until = public.application_retain_until(kind,
created_at, last_contact_at, completed_at, retention_consent,
retention_consent_at)` voor bestaande rijen; (8) `vacancy_publish_errors`
opnieuw met `case when p.id is null or p.phone_e164 is null then 'contact'
end`, zodat een publiceerbare vacature altijd een contactpersoon met
telefoonnummer heeft (B-21). Daarna `npm run db:types` en `npm run
db:seed:reset` (§4.7, §5.11).

> **Notitie.** Bouwstap 1 is gecommit. De correctiemigratie (met de punten (4) en (5) zoals hierboven), `VACANCY_SORTS`, de seed-reset, `/api/dev/revalidate` en de wijzigingen uit ronde 3 aan de seed (B-48, 1001 `nice_to_have`) voert de bouw-agent van bouwstap 3b uit.

> **Nazorg 3b.** Verwijder in `lib/data/vacancies.ts` de functie `logFailure` en de catch-blokken met "mislukt, leeg resultaat" (in `loadOpenVacancies`, `getVacancyByNumber` en `loadOccupationsSafe`) en in `lib/data/occupations.ts` de catch met "beroepen laden mislukt, leeg resultaat"; vervang het kopcommentaar van `lib/data/vacancies.ts` over zacht falen door een verwijzing naar §4.3 punt 10 en B-56. Schrijf `tests/unit/data/errors.test.ts` (AC-10-33).

1. **Project.** Het project `groos-dev` bestaat al (B-12): organisatie Groos
   Personeelsdiensten (gratis plan), regio eu-central-1, ref
   `smcskfrkjgniinbhqnln`, URL `https://smcskfrkjgniinbhqnln.supabase.co`. Maak
   geen nieuw project aan. Lees via de projectgebonden MCP-server `supabase` uit
   `.mcp.json`; databasewachtwoord in de kluis.
2. **Sleutels.** Haal in het dashboard (Project Settings, API Keys) de
   publishable key en een nieuwe secret key op. Zet in `.env.local`:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
   `SUPABASE_SECRET_KEY` en `CRON_SECRET` (`openssl rand -hex 32`). Spec 13
   werkt `.env.example` bij.
3. **Packages.** `npm install @supabase/supabase-js@^2 @supabase/ssr@^0.12
   zod@^4` (B-37). `server-only` staat al in `package.json` (B-37).
4. **CLI.** `supabase init` (de CLI 2.104 staat globaal; `npx
   supabase@2.104.0` werkt ook). Zet in `supabase/config.toml`:
   `[db] major_version = 17`; `[db.seed] enabled = true, sql_paths =
   ["./seed.sql"]`; `[auth] site_url = "http://localhost:3000"`,
   `additional_redirect_urls = ["http://localhost:3000/beheer/**"]`,
   `enable_signup = false`, `enable_refresh_token_rotation = true`,
   `refresh_token_reuse_interval = 10`; `[auth.email] enable_signup = false`;
   `[auth.mfa.totp] enroll_enabled = true, verify_enabled = true`. Spec 13 is
   eigenaar van dit bestand; de `[auth]`-blokken documenteren de gewenste
   waarden en worden nooit gepusht (B-39).
5. **Migraties.** Schrijf de zeven bestanden uit §5.1 met de inhoud van §5.2
   tot en met §5.10. Schrijf ook `supabase/seed.sql` (§5.11) en
   `supabase/tests/rls_smoke.sql` (stap 13).
6. **Koppelen en pushen.** `supabase link --project-ref smcskfrkjgniinbhqnln`,
   daarna `supabase db push --linked --dry-run` en `supabase db push --linked`
   zonder seed (geen `--include-seed`, de seed heeft eerst een beheerder nodig). Gebruik
   voor dit project alleen de CLI voor migraties, niet `apply_migration` van
   de projectgebonden MCP; die schrijft een eigen versienummer in de migratiehistorie, waarna
   `db push` afwijkt. De MCP mag wel lezen (`list_tables`, `execute_sql`) en
   `get_advisors` draaien.
7. **Auth-instellingen.** Auth-instellingen volgens spec 13 §10 A2
   (dashboard); geen `supabase config push`. Eigen SMTP via Resend regelt spec
   11 en 13; tot dan stuurt Supabase alleen mail naar leden van de organisatie.
8. **Typen.** `npm run db:types`. Controleer dat `lib/database.types.ts` de
   view `public_vacancies` en de functies uit §5.5 bevat. Draai dit na elke
   nieuwe migratie opnieuw.
9. **Clients.** Maak `lib/supabase/env.ts`, `server.ts`, `browser.ts`,
   `admin.ts`, `public.ts`, `proxy.ts` en `public-media.ts` volgens §4.2 en
   §4.5. Geef spec 01 door dat `proxy.ts` voor `/beheer` `updateSession()`
   aanroept en daar geen taalrouting doet.
10. **Beheerder.** Schrijf `scripts/supabase/create-admin.mjs` en de
    npm-scripts (§4.7). Maak een testbeheerder aan op een adres van Djulan,
    bijvoorbeeld `npm run db:admin -- --email <adres> --full-name "Jimmy
    (test)" --display-name Jimmy --phone +31683351985`. Een tweede
    testbeheerder (Lorenzo) is optioneel; zonder tweede gebruikt de seed
    overal de eerste.
11. **Seed.** Voer `supabase/seed.sql` uit met `psql "$SUPABASE_DB_URL" -v
    ON_ERROR_STOP=1 -f supabase/seed.sql`, of plak de inhoud in
    `execute_sql` van de MCP. Schrijf ook `supabase/seed-reset.sql` en
    `scripts/supabase/seed-reset.mjs` (§4.7, §5.11); later laad je de
    testdata opnieuw met `npm run db:seed:reset`.
12. **Data-laag.** Maak `lib/data/options.ts`, `types.ts`, `cache-tags.ts`,
    `vacancy-search-params.ts`, `vacancies.ts`, `occupations.ts` en
    `revalidate.ts` volgens §4.3 en §4.4, en `lib/supabase/cv-storage.ts`
    volgens §4.5.
13. **RLS-test.** Schrijf `supabase/tests/rls_smoke.sql`: één transactie die
    eindigt met `rollback`, met per geval een `do`-blok dat een exception
    gooit als de uitkomst niet klopt. Rollen wisselen met `set local role
    anon` of `authenticated` en `select set_config('request.jwt.claims',
    json_build_object('sub', <id>, 'role', 'authenticated', 'aal',
    'aal2')::text, true)`. Gevallen: alles uit AC-10-04 tot en met AC-10-08
    en AC-10-21. Draai `npm run db:test`.
14. **Cron.** Maak `lib/cron/auth.ts` en de drie routes uit §4.6. Geef spec 13
    de `crons`-lijst door (B-41): `/api/cron/vacatures` op `*/15 * * * *`,
    `/api/cron/bewaartermijnen` op `0 2 * * *`, `/api/cron/opruimen` op `30 2
    * * *`. Test lokaal, in een shell met `set -a; . ./.env.local; set +a`
    (B-51), met `curl -H "Authorization: Bearer $CRON_SECRET"
    http://localhost:3000/api/cron/vacatures`. Maak ook
    `app/api/dev/revalidate/route.ts` (§4.4) en test die met het voorbeeld
    uit §4.4.
15. **Advisors.** Draai `get_advisors` (security en performance) via de MCP
    en los elke melding van niveau ERROR op met een nieuwe migratie.
16. **Verifiëren.** `npm run typecheck`, `npm run verify` en `npm run check`
    (geen nieuwe punten uit deze bestanden). Start `npm run dev` en controleer
    met een tijdelijk serverscript of in een pagina van spec 06 dat
    `getVacancyList()` zes vacatures geeft.
17. **Productie (later, spec 13).** Nieuw project in de organisatie van Jimmy,
    `supabase link --project-ref <prod>`, `supabase db push --linked`, geen
    seed, `grant_admin` voor de echte accounts van Jimmy en Lorenzo, en de
    auth-instellingen met de productie-URL in plaats van localhost.

## 11 Acceptatiecriteria

| Id | Eis | Criterium |
|---|---|---|
| AC-10-01 | E-10-13 | `supabase migration list --linked` toont de acht migraties uit §5.1 (de zeven van bouwstap 1 en `20261003090000_kruiscontrole_1.sql`) lokaal en op `groos-dev` met dezelfde versies; `supabase db push --linked --dry-run` meldt niets te doen. |
| AC-10-02 | E-10-01 | `select relname, relrowsecurity from pg_class where relnamespace = 'public'::regnamespace and relkind = 'r'` geeft precies de tien tabellen uit E-10-01, alle met `relrowsecurity = true`. |
| AC-10-03 | E-10-14 | Na de seed geeft `select status, count(*) from vacancies group by status` 6 keer `published`, 2 keer `closed`, 1 keer `scheduled` en 1 keer `draft`; `occupations` heeft 5 rijen. |
| AC-10-04 | E-10-05 | `curl "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/public_vacancies?select=number,state&order=number" -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"` geeft 1001 tot en met 1006 met `state` open en 1007 met `state` closed, en niets anders. De opdracht draait ná de correctiemigratie, in een shell met `set -a; . ./.env.local; set +a` (B-51). |
| AC-10-05 | E-10-05 | Dezelfde curl op `/rest/v1/vacancies?status=eq.draft` geeft `[]`; op `/rest/v1/applications` en `/rest/v1/audit_log` geeft hij een fout met code `42501`. |
| AC-10-06 | E-10-06 | Een POST met de publishable key naar `/rest/v1/contact_messages` geeft code `42501` en schrijft geen rij. |
| AC-10-07 | E-10-05 | `/rest/v1/admin_profiles?select=email` met de publishable key geeft `42501`; `?select=display_name,phone_e164` geeft alleen profielen die contactpersoon zijn van 1001 tot en met 1007. |
| AC-10-08 | E-10-07 | In `rls_smoke.sql` ziet een actief profiel met `aal1` 0 rijen in `applications`, met `aal2` 2 rijen; een inactief profiel met `aal2` ziet 0 rijen; een `recruiter` met `aal2` ziet 0 rijen in `audit_log`, een `owner` meer dan 0. |
| AC-10-09 | E-10-03 | Een nieuwe vacature krijgt het eerstvolgende nummer na 1010. Een vertaling met titel "Glazenwasser" op een vacature met plaats `'s-Gravenhage` geeft `city = 'Den Haag'` en slug `glazenwasser-den-haag-<nummer>`; een titelwijziging werkt de slug bij. `update vacancies set number = 5 where number = 1001` faalt met `vacancy_number_immutable`. |
| AC-10-10 | E-10-02, E-10-04 | Een concept met twee taken op `published` zetten faalt bij commit met `vacancy_not_publishable:tasks`; met drie taken lukt het, en dan is `published_at` gezet en `closes_at - published_at` 45 dagen (afwijking minder dan 1 minuut). |
| AC-10-11 | E-10-04 | `update vacancies set status = 'archived' where number = 1001` faalt met `vacancy_invalid_transition:published_archived`. |
| AC-10-12 | E-10-12 | `curl http://localhost:3000/api/cron/vacatures` zonder header geeft 401; met `Authorization: Bearer $CRON_SECRET` geeft hij 200 met `{"ok":true}` en de lijsten `published`, `closed` en `archived`. De opdracht draait in een shell met `set -a; . ./.env.local; set +a` (B-51). |
| AC-10-13 | E-10-04, E-10-12 | Na `update vacancies set publish_at = now() - interval '1 minute' where number = 1008` (het mag; de trigger controleert alleen bij de overgang naar `scheduled`) zet de eerste cron-aanroep 1008 op `published` en 1010 op `archived`; een tweede aanroep direct daarna geeft drie lege lijsten. |
| AC-10-14 | E-10-04 | Na `update vacancies set closes_at = now() - interval '1 minute' where number = 1002` toont `public_vacancies` 1002 met `state = 'closed'` en `close_reason = 'expired'` nog vóór de cron; na de cron is de status `closed` met `closed_at` gelijk aan die `closes_at`. |
| AC-10-15 | E-10-04, E-10-11 | `getVacancyByNumber(1007)` geeft `state: "closed"` en `closeReason: "filled"`; `getVacancyByNumber(1009)` en `getVacancyByNumber(1010)` geven `null`; `getVacancyByNumber(42)` geeft `null` zonder query. |
| AC-10-16 | E-10-11 | `getVacancyList({ filters: { beroep: ["logistiek-medewerker"] } })` geeft 1003 en 1004 met `total` 2; `{ q: "den haag" }` geeft 1001, 1005 en 1006; `{ dienst: ["weekend"] }` geeft 1003 en 1005. In `getVacancyFacets({ beroep: ["schoonmaker"] })` is de teller van `schoonmaker` 1 en van `glazenwasser` ook 1 (tellers per groep negeren de eigen groep). |
| AC-10-17 | E-10-11 | `parseVacancySearchParams({ beroep: ["schoonmaker", "onzin"], pagina: "0" })` geeft `filters.beroep = ["schoonmaker"]`, `page = 1`, `isFiltered = true`; `parseVacancySearchParams({ pagina: "2" })` geeft `isFiltered = false`; `parseVacancySlug("glazenwasser-den-haag-1001")` geeft 1001 en `parseVacancySlug("glazenwasser")` geeft `null`. |
| AC-10-18 | E-10-11 | `lib/data/vacancies.ts` en `occupations.ts` gebruiken `unstable_cache` met tag `vacatures` (en `vacature:<nummer>` voor het detail) en `revalidate: 3600`; `revalidateVacancies([1001], "visibility")` roept `revalidateTag` aan met `{ expire: 0 }` (controle met een unit-test met een mock van `next/cache`, of codecontrole door spec 14). |
| AC-10-19 | E-10-09 | Na `update applications set status = 'rejected' where email = 'test.kandidaat@example.com'` en daarna `update applications set completed_at = now() - interval '40 days' where email = 'test.kandidaat@example.com'` staat `retain_until` in het verleden; na `/api/cron/bewaartermijnen` zijn `first_name`, `email`, `phone_e164` en `cv_path` leeg, is `anonymized_at` gezet en geeft `select count(*) from storage.objects where bucket_id = 'cvs' and name like 'applications/<id>/%'` 0. |
| AC-10-20 | E-10-09 | Een sollicitatie met `last_contact_at = now() - interval '85 days'` en status `new` staat na de bewaartermijntaak op `rejected` (bij `kind vacancy`) of `withdrawn` (bij `registration`), met een activiteit `auto_closed`. |
| AC-10-21 | E-10-10 | Als `postgres`: `update audit_log set action = 'x.y'` faalt; `delete from audit_log where occurred_at > now() - interval '1 day'` faalt; een regel van 3 jaar oud (ingevoegd met expliciete `occurred_at`) verdwijnt na `/api/cron/opruimen`, net als een `email_log`-regel met `created_at` van 91 dagen geleden. |
| AC-10-22 | E-10-08 | `createCvUploadTarget("pdf")` geeft een pad onder `pending/`; uploaden van een pdf van 11 MB of van een `.exe` als `application/pdf` naar dat token wordt door Storage of door `finalizeCvUpload` (`type_mismatch`) geweigerd; een geldige pdf staat na `finalizeCvUpload` onder `applications/<id>/`. |
| AC-10-23 | E-10-08 | De URL van `createCvReadUrl` geeft direct 200 en na 61 seconden een fout; na de aanroep staat er een `audit_log`-regel `application.cv_viewed` en een activiteit `cv_viewed` bij die sollicitatie. |
| AC-10-24 | E-10-01 | Een tweede insert in `applications` met dezelfde `submission_id` faalt met `23505`; een `registration` met `retention_consent = false` faalt met `23514`. |
| AC-10-25 | E-10-15 | `grep -rn "SUPABASE_SECRET_KEY" app components lib` vindt alleen `lib/supabase/admin.ts`, en dat bestand begint met `import "server-only"`; een import van `admin.ts` in een client component laat `npm run build` falen. |
| AC-10-26 | E-10-05, E-10-13 | `npm run verify` slaagt met de nieuwe bestanden, en `get_advisors` (security en performance) geeft geen meldingen van niveau ERROR. |
| AC-10-27 | E-10-16 | Na de seed geeft `select locale, count(*) from vacancy_translations group by locale` alleen `nl` met 10, en `locale` hoort bij de unieke sleutel met `vacancy_id`. |
| AC-10-28 | E-10-17 | `tests/unit/data/options.test.ts` toont dat elke constante in `lib/data/options.ts` dezelfde waarden heeft als de enum in `lib/database.types.ts`. |
| AC-10-29 | E-07-06 | Een object in `cvs/pending/` ouder dan 24 uur is na `/api/cron/opruimen` weg en `pendingRemoved` is minstens 1. |
| AC-10-30 | E-10-09 | Een inschrijving met `last_contact_at = now() - interval '85 days'` heeft na `/api/cron/bewaartermijnen` status `withdrawn` en `retain_until = completed_at + 28 dagen`; na die datum is ze geanonimiseerd en is het cv weg. |
| AC-10-31 | E-10-11 | Lokaal geeft `POST http://localhost:3000/api/dev/revalidate` met body `{"numbers":[1002],"kind":"visibility"}` zonder Bearer 401 en met `Authorization: Bearer $CRON_SECRET` 200 met `{"ok":true}`; met `VERCEL_ENV=production` geeft dezelfde aanroep 404. De opdracht draait in een shell met `set -a; . ./.env.local; set +a` (B-51). |
| AC-10-32 | E-10-14 | `npm run db:seed:reset` met een `SUPABASE_DB_URL` zonder `smcskfrkjgniinbhqnln` stopt met een Nederlandse melding en raakt geen database; op `groos-dev` geeft het daarna dezelfde tellingen als AC-10-03 en AC-10-27, staan `admin_profiles` en `audit_log` er nog, en heeft een nieuwe vacature het nummer 1011. |
| AC-10-33 | E-10-11 | `tests/unit/data/errors.test.ts` mockt de Supabase-client zodat elke query `{ data: null, error: { message: "x", code: "PGRST205" } }` geeft; `getVacancyList`, `getVacancyByNumber`, `getLatestVacancies` en `listOccupations` gooien dan een `Error` waarvan de tekst `PGRST205` bevat, en geven geen `[]` of `null`. Met `hasSupabaseEnv()` onwaar geven `listOpenVacancyParams` en `getVacancySitemapEntries` `[]` zonder fout. |

## 12 Open vragen en aannames

| Onderwerp | Aanname in deze spec | Bevestigt | Gevolg als het anders is |
|---|---|---|---|
| `/beheer` en `proxy.ts` (afstemming met 00 §4.1) | Vastgelegd in B-38. | Djulan, spec 01 en 08 | Helemaal buiten de matcher: spec 08 moet sessies op een andere manier verversen, met risico op onverwacht uitloggen. |
| Project `groos-dev` | Bestaat (B-12, besloten), organisatie Groos Personeelsdiensten, gratis plan, ref `smcskfrkjgniinbhqnln`. | Djulan | Ander project: alleen `.env.local` en de link. |
| Tabellen buiten 00 §4.3 | Geen `locations`, `qualifications`, `settings`, `vacancy_internal`, sjablonen of verzoekenregister in fase 1. Plaats is tekst met normalisatie (Den Haag in één spelling), kwalificaties zijn een enum-array. | Djulan | Extra tabellen zijn aparte migraties; de data-laag verandert niet. |
| Dienstverband | Alleen `temp_agency`, `secondment` en `recruitment`; geen zzp, oproep of stage. | Jimmy en Lorenzo | Eén `alter type ... add value` plus label en JobPosting-mapping. |
| Automatisch afsluiten | De regel van 12 weken zonder contact geldt voor inschrijvingen (B-07) én voor sollicitaties op een vacature (context/11 §8.1); status `withdrawn` bij een inschrijving, `rejected` bij een sollicitatie. Anders blijven sollicitaties zonder eindstatus onbeperkt staan. | Jimmy, Lorenzo, jurist | Alleen inschrijvingen: één voorwaarde in `auto_close_stale_applications`. |
| Inschrijving | 365 dagen na toestemming, of 28 dagen na afsluiten (handmatig of automatisch na 12 weken zonder contact) als dat eerder is (B-07). Verlengen kan pas met "toestemming vastleggen" in fase 2. | jurist | Andere termijn: `application_retain_until` in een nieuwe migratie. |
| Anonimiseren in plaats van verwijderen | Verlopen sollicitaties worden geanonimiseerd (cv, notities en persoonsgegevens weg, statistiek blijft). Aanvragen en berichten worden verwijderd. | jurist | Volledig verwijderen: `anonymize_applications` wordt een delete. |
| Spam bij berichten | 30 dagen na markeren (context/11), niet genoemd in B-07. | Jimmy en Lorenzo | Constante aanpassen. |
| Gesloten naar archief | Na 30 dagen (B-15), niet na 90 dagen zoals context/11 voorstelde. | Jimmy en Lorenzo | Constante in twee functies. |
| Cao per vacature | Geen veld; `salary_note` en de aanbodlijst dekken toeslagen (B-24). | Jimmy | Nieuwe kolom `cao_name`. |
| Uren-buckets | Tot en met 20, 21 tot en met 31 en 32 uur of meer, op basis van overlap. | Djulan | Alleen `HOURS_BUCKETS`. |
| Werkrecht | `may_work_in_nl` is ja of nee (B-17); context/09 stelde ook "weet ik niet" voor. | jurist | Boolean wordt een enum. |
| Minimumloon | `MINIMUM_WAGE_21_PLUS = 14.99` (geldig vanaf 1 juli 2026) is de enige constante (B-42), voor een waarschuwing in spec 08; de database dwingt alleen 5 tot 100 euro af (jeugdloon blijft mogelijk). | Djulan | Bijwerken per 1 januari en 1 juli. |
| Vercel Cron | Elk kwartier vraagt Vercel Pro in Jimmy's account. | Jimmy | Op Hobby dagelijks; de view houdt het gedrag correct, de cache is hooguit een uur oud. |
| Beroepen in migratie én seed | De vijf beroepen staan in migratie 7, omdat productie ze nodig heeft, en de seed herhaalt ze idempotent. | Djulan | Geen. |
| Seedvolgorde | De seed vraagt eerst een actieve beheerder met telefoonnummer, omdat vacatures een contactpersoon met telefoonnummer nodig hebben (B-06, B-21, B-48). | Djulan | Geen. |
| Contactpersoon met telefoon | Een vacature is pas publiceerbaar als de contactpersoon actief is en een telefoonnummer heeft (B-21, punt (8) van de correctiemigratie). | Jimmy en Lorenzo | Zonder telefoonnummer: punt (8) vervalt en spec 06 moet een vacature zonder belknop tonen. |
| Seed-reset | `npm run db:seed:reset` leegt op `groos-dev` alle vacatures, sollicitaties, aanvragen, berichten, activiteiten en het e-maillog, en weigert als de ref ontbreekt of als er vacatures zonder seedtekst zijn. `admin_profiles` en `audit_log` blijven. | Djulan | Echte testdata op `groos-dev` die moet blijven: de controle op `Testvacature.%` houdt de reset tegen; dan alleen de seed draaien. |
| Dev-revalidatieroute | `/api/dev/revalidate` bestaat op elke omgeving behalve productie (`VERCEL_ENV`), achter `CRON_SECRET` (B-46). | Djulan | Ook niet op previews: de eerste regel geeft ook 404 bij `VERCEL_ENV === "preview"`, en de route werkt alleen lokaal. |
| Auth-mail in ontwikkeling | Zonder eigen SMTP mailt Supabase alleen leden van de organisatie; het script maakt daarom een bevestigde gebruiker met wachtwoord aan. | Djulan | Met Resend-SMTP (spec 11, 13) kan ook uitnodigen per mail. |
| Telefoonnormalisatie | De database eist E.164; spec 07 normaliseert Nederlandse nummers zonder extra package (B-37). | spec 07 | Met `libphonenumber-js` moet B-37 worden aangevuld. |
