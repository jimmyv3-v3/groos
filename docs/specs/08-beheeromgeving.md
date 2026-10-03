# 08 Beheeromgeving `/beheer`

| Status | Fase | Hangt af van | Bronnen |
|---|---|---|---|
| concept, ter goedkeuring aan Djulan | 1 minimaal | 10 (datamodel, RLS, RPC's, clients, `revalidateVacancies`); gebruikt daarnaast 01 (proxy, kaders §4.21), 02 (primitives en tokens), 03 (schrijfregels, `lib/format.ts`), 13 (BotID, headers, WAF, Auth-instellingen), 14 (tests) | context/11 §3, §4, §5, §7, §8, §9.5; context/09 via samenvatting; spec 00 B-04, B-06, B-07, B-12, B-15, B-19, B-20, B-32, B-35 tot en met B-39, B-42, B-48, B-50; spec 10 §4.2 tot en met §4.5, §5.3 tot en met §5.11; spec 01 §4.12 tot en met §4.21; spec 09 §5.1 en §6.8; spec 13 §4.2, §4.4, §5.6, §10 A7; spec 14 §5.6; `node_modules/next/dist/docs/01-app/02-guides/authentication.md`, `.../03-file-conventions/proxy.md`, `.../04-functions/refresh.md`, `.../03-file-conventions/error.md`, `.../01-metadata/manifest.md`, `.../04-functions/generate-image-metadata.md` |

## 1 Doel

Deze module levert Groos Beheer: een eigen, mobielvriendelijke beheeromgeving
onder `/beheer` waarmee Jimmy en Lorenzo op hun telefoon of laptop vacatures
plaatsen en sollicitaties, personeelsaanvragen en berichten afhandelen. Inloggen
gaat met e-mail, wachtwoord en een verplichte code uit een authenticator-app;
pas daarna geeft de database data vrij. Elke wijziging loopt via een Server
Action met zod-validatie, komt in het logboek en de tijdlijn, ververst de
publieke vacaturepagina's en meldt het resultaat met een toast. De omvang is
bewust minimaal volgens B-19, zodat de bouw vanavond af is en alles daarna
zonder schemawijziging kan groeien.

## 2 Gebruikers en scenario's

Beheerder (Jimmy of Lorenzo, rol `owner`, vaak onderweg op een telefoon)

1. S-08-01: Lorenzo logt voor het eerst in. Hij kiest een wachtwoord via de link
   uit de uitnodiging, scant een QR-code met zijn authenticator-app en komt op
   het overzicht.
2. S-08-02: Jimmy opent Groos Beheer vanaf het beginscherm van zijn telefoon. Hij
   vult zijn wachtwoord en de code in en ziet direct wat er vandaag openstaat.
3. S-08-03: Jimmy plaatst in de bus een vacature voor een glazenwasser. Hij vult
   de blokken onder elkaar in, ziet bij publiceren welk verplicht veld nog
   ontbreekt en publiceert. De vacature staat direct op `/vacatures`.
4. S-08-04: Lorenzo plant een vacature in voor maandag 07.00 uur. Tot dat moment
   staat hij niet op de site.
5. S-08-05: Jimmy belt een kandidaat vanuit de lijst met sollicitaties. De
   belactie komt in de tijdlijn en de status springt van Nieuw naar In
   behandeling.
6. S-08-06: Lorenzo bekijkt het cv van een kandidaat. Hij krijgt een link die 60
   seconden werkt; de weergave komt in het logboek.
7. S-08-07: Jimmy zet een kandidaat op Uitgenodigd en schrijft een notitie, zodat
   Lorenzo weet hoe het ervoor staat.
8. S-08-08: Jimmy sluit een vacature als vervuld en verlengt een andere met 30
   dagen.
9. S-08-09: Lorenzo pakt een personeelsaanvraag op, belt de opdrachtgever en zet
   de status op Offerte verstuurd. Vanuit de aanvraag start hij een nieuwe
   vacature met beroep, plaats en uren alvast ingevuld.
10. S-08-10: Jimmy markeert een bericht met "Bel mij terug" als beantwoord nadat
    hij heeft teruggebeld.
11. S-08-11: Lorenzo is zijn wachtwoord vergeten. Hij vraagt een herstelmail aan,
    bevestigt met zijn code en kiest een nieuw wachtwoord.
12. S-08-12: Lorenzo verliest zijn telefoon. Djulan verwijdert zijn factor in het
    Supabase-dashboard en Lorenzo koppelt bij de volgende login een nieuwe app
    (procedure spec 09 §5.6a).

Ontwikkelaar en bouw-agent

13. S-08-13: Djulan logt op `http://localhost:3000/beheer` in met de
    testbeheerder die `npm run db:admin` van spec 10 aanmaakte (B-39) en ziet de
    seed van spec 10 in alle lijsten.
14. S-08-14: De e2e-suite van spec 14 logt in met wachtwoord en TOTP, bewaart de
    sessie en speelt het Jimmy-scenario op 390 px na.

## 3 Scope

### 3.1 Wel in fase 1

| Id | Eis | Dient |
|---|---|---|
| E-08-01 | `app/beheer` heeft een eigen root-layout: alleen Nederlands, `noindex, nofollow`, geen publieke header of footer, geen next-intl-provider, geen Vercel Analytics, wel een webmanifest en iconen zodat "Groos Beheer" als app op het beginscherm kan. | R-03, R-09, R-11 |
| E-08-02 | Inloggen met e-mail en wachtwoord; daarna altijd een TOTP-code (Supabase Auth MFA). Zonder geverifieerde factor dwingt het beheer eerst het koppelen af. Alle beheerdata vraagt `aal2`. | R-03, R-11 |
| E-08-03 | Toegang wordt op vier lagen gecontroleerd: de proxy (optimistisch, alleen cookies), de layout en elke pagina (`requireAdmin()`), elke Server Action (`withAdmin()`) en de RLS van spec 10. | R-03, R-11 |
| E-08-04 | Wachtwoord vergeten, nieuw wachtwoord instellen, uitloggen en overal uitloggen werken; uitnodigen gebeurt in fase 1 via het Supabase-dashboard, met een link naar `/beheer/auth/bevestigen`. | R-03 |
| E-08-05 | Mobiel eerst: onder 1024 px een vaste tabbalk met vijf items, lijsten als kaarten, op detailpagina's een vaste actiebalk met Bellen, WhatsApp, E-mailen en Status; tikdoelen minimaal 44 px; geen horizontale scroll op 390 px. | R-03, R-14 |
| E-08-06 | Het overzicht toont wat vandaag aandacht vraagt: tellers, een lijst "Vandaag te doen", recente activiteit en snelle acties. | R-03 |
| E-08-07 | Vacatures: lijst met tabbladen, filters, zoeken en sortering; aanmaken; bewerken in blokken; voorbeeld; publiceren; inplannen en inplanning annuleren; offline halen; sluiten met reden; heropenen; verlengen; archiveren; terugzetten; dupliceren; verwijderen van een concept zonder sollicitaties; uitlichten en spoed; link kopiëren en delen via WhatsApp. | R-02, R-03, R-10 |
| E-08-08 | Publiceren en inplannen controleren vooraf de verplichte velden van B-06 met `vacancy_publish_errors` en tonen per ontbrekend veld een melding; een uurloon onder het minimumloon en Geen ervaring nodig bij werken op hoogte zonder training geven een waarschuwing en geen blokkade (§5.5). | R-02, R-10, R-12 |
| E-08-09 | Statusovergangen van vacatures volgen exact de tabel van spec 10 §5.5; het beheer toont alleen acties die vanuit de huidige status zijn toegestaan. | R-10 |
| E-08-10 | Na elke vacaturemutatie roept de actie `revalidateVacancies()` van spec 10 aan (B-35, met het profiel uit spec 10), zodat de publieke site de wijziging bij het volgende bezoek toont. | R-02, R-10 |
| E-08-11 | Sollicitaties: lijst met tabbladen, filters en zoeken; detail met contactgegevens, cv via een signed URL van 60 seconden, status, toewijzen, notities, tijdlijn en bellen, WhatsApp en e-mailen die in de tijdlijn komen. | R-03, R-11 |
| E-08-12 | Personeelsaanvragen: lijst, detail, status, toewijzen, notities, contactacties en een snelkoppeling naar een nieuwe vacature. | R-03, R-04 |
| E-08-13 | Berichten: lijst met tabbladen, detail, status en contactacties. | R-03, R-04 |
| E-08-14 | Elke mutatie is een Server Action met zod-validatie; het logboek (`audit_log`) en de tijdlijn (`activities`) krijgen een regel volgens §5.4; het resultaat verschijnt als toast. | R-03, R-11, R-19 |
| E-08-15 | Alle teksten staan in `app/beheer/_strings.ts`, alleen Nederlands, in je-vorm volgens spec 03; componenten bevatten geen letterlijke tekst. | R-07 |
| E-08-16 | Componenten staan in `components/beheer/*`, zijn gebouwd op de primitives en tokens van spec 02 en voldoen aan WCAG 2.2 AA. | R-05, R-15 |
| E-08-17 | Deze module voegt geen npm-packages toe (B-37). De primitives komen uit spec 02; alleen `Dialog`, `AlertDialog` en `Menu` bouwt deze module zelf op base-ui (`@base-ui-components/react` 1.0.0-rc.0, al aanwezig) in `components/beheer/ui/`. | R-19 |
| E-08-18 | De bouw-agent zet vijf sub-agents in die via 21st.dev de elementen per plek kiezen (§9). | R-16 |
| E-08-19 | Lokaal inloggen met de testbeheerder en werken met de seed van spec 10 is in §10 stap voor stap beschreven en werkt zonder Docker. | R-17 |

### 3.2 Niet in fase 1

- Instellingen, gebruikersbeheer en uitnodigen vanuit het beheer, Mijn profiel
  (naam, foto, telefoon, meldingen), vacaturesjablonen, beroepen beheren.
- Afbeelding per vacature uploaden (B-25: er zijn nog geen foto's). Het veld
  `image_path` blijft bij opslaan ongewijzigd.
- Engelse vacatureteksten, intern blok met opdrachtgever, webadres handmatig
  aanpassen (spec 10 §3.2).
- Sollicitatie of aanvraag handmatig toevoegen, koppelen aan een andere
  vacature, omzetten van een bericht (zie §12).
- E-mails versturen vanuit het beheer (uitnodiging, afwijzing): B-20 houdt die
  buiten fase 1. E-mailen opent het eigen mailprogramma.
- CSV-export, bulkacties, privacyverzoeken, toestemming vastleggen, logboek
  bekijken, binnenkort-verwijderd-lijst, globale zoekbalk, passkeys,
  pushmeldingen, offline bewaren van concepten.

### 3.3 Fase 2 (voorbereid)

Alle routes hierboven passen onder `(app)` zonder de shell te wijzigen; de
navigatie heeft een vaste plek "Meer" voor Instellingen, Gebruikers en Privacy.
`activities` en `audit_log` vullen zich nu al, zodat logboek en tijdlijn in
fase 2 alleen een scherm vragen.

## 4 Pagina's en componenten

### 4.1 Mappen en routes

Alle paden zijn relatief aan de repo. Route groups bepalen de layout; ze komen
niet in de URL.

| Bestand | Route | Soort | Toegang |
|---|---|---|---|
| `app/beheer/layout.tsx` | alle `/beheer/*` | root-layout (S) | iedereen |
| `app/beheer/not-found.tsx`, `error.tsx` | | 404 (S), fout (C) | iedereen |
| `app/beheer/[...rest]/page.tsx` | `/beheer/<onbekend>` | roept `notFound()` aan | iedereen |
| `app/beheer/manifest.webmanifest/route.ts` | `/beheer/manifest.webmanifest` | route handler GET | publiek |
| `app/beheer/icon.tsx` | `/beheer/icon/192`, `/beheer/icon/512` | `ImageResponse` met `generateImageMetadata` | publiek |
| `app/beheer/auth/bevestigen/route.ts` | `/beheer/auth/bevestigen` | route handler GET | publiek (link uit mail) |
| `app/beheer/(auth)/layout.tsx` | | gecentreerde kaart (S) | |
| `app/beheer/(auth)/inloggen/page.tsx` | `/beheer/inloggen` | S + `LoginForm` (C) | zonder sessie |
| `app/beheer/(auth)/mfa/page.tsx` | `/beheer/mfa` | S + `MfaVerifyForm` (C) | sessie `aal1` |
| `app/beheer/(auth)/mfa/koppelen/page.tsx` | `/beheer/mfa/koppelen` | S + `MfaEnroll` (C) | sessie `aal1` zonder factor |
| `app/beheer/(auth)/wachtwoord-vergeten/page.tsx` | `/beheer/wachtwoord-vergeten` | S + `PasswordResetForm` (C) | iedereen |
| `app/beheer/(auth)/wachtwoord-instellen/page.tsx` | `/beheer/wachtwoord-instellen` | S + `PasswordSetForm` (C) | sessie (met factor: `aal2`) |
| `app/beheer/(auth)/geen-toegang/page.tsx` | `/beheer/geen-toegang` | S | sessie zonder actief profiel |
| `app/beheer/(app)/layout.tsx` | | shell met navigatie (S) | `aal2` en actief profiel |
| `app/beheer/(app)/loading.tsx` | | skelet (S) | |
| `app/beheer/(app)/page.tsx` | `/beheer` | overzicht | idem |
| `app/beheer/(app)/vacatures/page.tsx` | `/beheer/vacatures` | lijst | idem |
| `app/beheer/(app)/vacatures/nieuw/page.tsx` | `/beheer/vacatures/nieuw` | formulier | idem |
| `app/beheer/(app)/vacatures/[nummer]/page.tsx` | `/beheer/vacatures/1001` | bewerken | idem |
| `app/beheer/(app)/vacatures/[nummer]/voorbeeld/page.tsx` | `/beheer/vacatures/1001/voorbeeld` | voorbeeld | idem |
| `app/beheer/(app)/sollicitaties/page.tsx` | `/beheer/sollicitaties` | lijst | idem |
| `app/beheer/(app)/sollicitaties/[referentie]/page.tsx` | `/beheer/sollicitaties/S-2026-0001` | detail | idem |
| `app/beheer/(app)/aanvragen/page.tsx` | `/beheer/aanvragen` | lijst | idem |
| `app/beheer/(app)/aanvragen/[referentie]/page.tsx` | `/beheer/aanvragen/P-2026-0001` | detail | idem |
| `app/beheer/(app)/berichten/page.tsx` | `/beheer/berichten` | lijst | idem |
| `app/beheer/(app)/berichten/[id]/page.tsx` | `/beheer/berichten/<uuid>` | detail | idem |
| `app/beheer/(app)/meer/page.tsx` | `/beheer/meer` | menu voor de telefoon | idem |
| `app/beheer/_strings.ts` | | teksten (§6) | |
| `app/beheer/_lib/*` | | hulpcode, zie §4.2 | server of client per bestand |
| `app/beheer/_data/*` | | leesfuncties (server-only), §5.2 | |
| `app/beheer/_actions/*` | | Server Actions (`"use server"`), §5.3 | |

Mappen met een underscore zijn privé en geen route (Next.js-conventie). Statische
segmenten winnen van `[locale]`, dus `/beheer` komt nooit in de publieke
layout; `/en/beheer` geeft de 404 van spec 01.

### 4.2 Hulpcode in `app/beheer/_lib/`

```ts
// _lib/paths.ts (client-veilig)
export const beheerPaths = {
  home: "/beheer", login: "/beheer/inloggen", mfa: "/beheer/mfa", mfaEnroll: "/beheer/mfa/koppelen",
  forgot: "/beheer/wachtwoord-vergeten", setPassword: "/beheer/wachtwoord-instellen",
  noAccess: "/beheer/geen-toegang", confirm: "/beheer/auth/bevestigen", more: "/beheer/meer",
  vacancies: "/beheer/vacatures", vacancyNew: "/beheer/vacatures/nieuw",
  vacancy: (n: number) => `/beheer/vacatures/${n}` as const,
  vacancyPreview: (n: number) => `/beheer/vacatures/${n}/voorbeeld` as const,
  applications: "/beheer/sollicitaties", application: (ref: string) => `/beheer/sollicitaties/${ref}` as const,
  requests: "/beheer/aanvragen", request: (ref: string) => `/beheer/aanvragen/${ref}` as const,
  messages: "/beheer/berichten", message: (id: string) => `/beheer/berichten/${id}` as const,
} as const;
/** Alleen paden die met /beheer beginnen, zonder //, \ of schema; anders "/beheer". */
export function safeNext(value: string | null | undefined): string;
/** Productie: site.url; preview: https://${VERCEL_URL}; anders http://localhost:3000. Server-only gebruik. */
export function beheerOrigin(): string;
/** Absolute URL voor links in meldingsmails van spec 11, bijvoorbeeld beheerUrl(beheerPaths.application("S-2026-0001")). */
export function beheerUrl(path: string): string;
```

```ts
// _lib/auth.ts (import "server-only")
export type AdminProfile = {
  id: string; email: string; fullName: string; displayName: string;
  role: "owner" | "recruiter"; phoneE164: string | null; whatsappE164: string | null;
};
export type AdminContext = { supabase: SupabaseServerClient; userId: string; profile: AdminProfile };
export type SessionState =
  | { kind: "none" }
  | { kind: "aal1"; supabase: SupabaseServerClient; userId: string; hasVerifiedFactor: boolean }
  | { kind: "inactive"; supabase: SupabaseServerClient; userId: string }
  | { kind: "admin"; ctx: AdminContext };
/** Met cache() uit React: één keer per request. getClaims(), daarna het eigen profiel (leesbaar zonder aal2, spec 10 §5.8) en bij aal1 mfa.listFactors(). */
export const getSessionState: () => Promise<SessionState>;
/** Voor de (app)-layout en elke (app)-pagina. none: redirect login; aal1: redirect mfa; inactive: redirect geen-toegang. */
export async function requireAdmin(): Promise<AdminContext>;
```

```ts
// _lib/action.ts (import "server-only")
export type BeheerErrorCode =
  | "sessie_verlopen" | "mfa_vereist" | "geen_toegang" | "geen_rechten" | "ongeldig"
  | "niet_publiceerbaar" | "ongeldige_overgang" | "niet_gevonden" | "conflict" | "bot" | "onbekend";
export type ActionResult<T = undefined> =
  | { ok: true; toast: string; data?: T }
  | { ok: false; code: BeheerErrorCode; message: string; fieldErrors?: Record<string, string[]> };
/** Eerste regel van elke beheeractie. Controleert sessie, aal2, actief profiel en bij ownerOnly de rol. Vangt fouten af met mapDbError. */
export async function withAdmin<T>(
  run: (ctx: AdminContext) => Promise<ActionResult<T>>, opts?: { ownerOnly?: boolean },
): Promise<ActionResult<T>>;
/** Vertaalt Supabase- en Postgres-fouten naar BeheerErrorCode en een tekst uit S.errors (tabel §6.4). */
export function mapDbError(error: { code?: string; message?: string }): ActionResult<never>;
/** Schrijft een regel in audit_log via createSupabaseAdminClient(), voor gebeurtenissen zonder tabelwijziging (§5.4). */
export async function writeAdminAudit(input: { actorId: string; action: `admin.${string}`; changes?: Record<string, unknown> }): Promise<void>;
```

```ts
// _lib/proxy.ts (draait in proxy.ts, Node-runtime)
export async function beheerProxy(request: NextRequest): Promise<NextResponse>;
```

```ts
// _lib/format.ts (client-veilig)
export function formatPhoneNl(e164: string): string;           // +31612345678 -> "06 12 34 56 78"; +31701234567 -> "070 123 4567"; buitenland "+32 470 12 34 56" zoals ingevoerd met spaties per 3
export function whatsappHref(e164: string, text: string): string; // https://wa.me/31612345678?text=<encodeURIComponent>
export function telHref(e164: string): `tel:${string}`;
export function mailtoHref(email: string, subject: string): string;
export function formatDateTimeNl(iso: string): string;          // "2 oktober 2026, 14.05 uur" (Europe/Amsterdam)
export function formatRelativeNl(iso: string, now?: Date): string; // "vandaag 09.12 uur", "gisteren 16.40 uur", "3 dagen geleden", daarna datum
export function amsterdamLocalToIso(local: string): string;     // "2026-10-05T07:00" -> ISO in UTC met de juiste zomer- of wintertijd
export function amsterdamDateEndToIso(date: string): string;     // "2026-11-16" -> ISO van 23.59 uur Amsterdamse tijd
export function isoToAmsterdamLocal(iso: string): string;        // voor <input type="datetime-local">
export function subtractWorkdays(date: Date, days: number): Date; // slaat zaterdag en zondag over
export function greetingKey(now?: Date): "morning" | "afternoon" | "evening"; // voor 12.00, 12.00 tot 18.00, vanaf 18.00 (Amsterdam)
```

Bedragen en datums zonder tijd gaan via `formatEuro` en `formatDate` uit
`lib/format.ts` (spec 03) met locale `"nl"`.

```ts
// _lib/status.ts (client-veilig)
export type BadgeTone = "neutral" | "brand" | "info" | "success" | "warning" | "danger"; // gelijk aan Badge van spec 02
export type VacancyDisplayStatus = "draft" | "scheduled" | "published" | "expired" | "filled" | "withdrawn" | "closed_other" | "archived";
export function vacancyDisplayStatus(v: { status: VacancyStatus; closesAt: string | null; closeReason: CloseReason | null }, now?: Date): VacancyDisplayStatus;
// published met closesAt <= now en closed met reden expired: "expired"; closed: filled, withdrawn of closed_other.
export const STATUS_TONE: {
  vacancy: Record<VacancyDisplayStatus, BadgeTone>; application: Record<ApplicationStatus, BadgeTone>;
  staffRequest: Record<StaffRequestStatus, BadgeTone>; message: Record<MessageStatus, BadgeTone>;
};
export const VACANCY_ACTIONS: Record<VacancyStatus, readonly VacancyActionKey[]>; // §5.3, tabel 2
export function isPublicStatus(s: VacancyStatus): boolean;           // published of closed
```

Tonen per status, letterlijk overgenomen van de statustabel bij `Badge` van
spec 02. Elke badge heeft altijd een stip (`dot`) en tekst, zodat kleur nooit de
enige drager is. Er is geen toon `muted` en geen stippellijnrand.

| Soort | Status (label) → toon |
|---|---|
| Vacature | `draft` (Concept) neutral · `scheduled` (Gepland) info · `published` (Online) success · `expired` (Verlopen) warning · `filled` (Vervuld) warning · `withdrawn` (Ingetrokken) warning · `closed_other` (Gesloten) warning · `archived` (Gearchiveerd) neutral |
| Sollicitatie | `new` (Nieuw) brand · `in_progress` (In behandeling) info · `invited` (Uitgenodigd) info · `placed` (Geplaatst) success · `rejected` (Afgewezen) danger · `withdrawn` (Ingetrokken) neutral |
| Aanvraag | `new` (Nieuw) brand · `in_progress` (In behandeling) info · `quote_sent` (Offerte verstuurd) info · `started` (Gestart) success · `completed` (Afgerond) neutral · `cancelled` (Geannuleerd) neutral |
| Bericht | `new` (Nieuw) brand · `answered` (Beantwoord) success · `archived` (Gearchiveerd) neutral · `spam` (Spam) danger |
| Vlaggen | `featured` (Uitgelicht) brand · `urgent` (Spoed) warning |

Overige bestanden in `_lib/`: `search.ts` (`sanitizeSearch(q): string[]`:
maximaal 80 tekens, kleine letters, splitst op spaties tot maximaal drie woorden,
verwijdert `, ( ) * % \ : " '`; een woord van alleen cijfers met minimaal 6
cijfers wordt een telefoonzoekterm zonder voorloopnul) en
`validation/{auth,vacancy,application,common}.ts` (zod-schema's, §5.5).

### 4.3 Componenten in `components/beheer/`

De primitives komen uit `components/ui/*` van spec 02 (eigenaar van stijl en
API) met de namen uit de tabel. Drie interactieve onderdelen levert spec 02 niet;
die bouwt de bouw-agent van 08 op base-ui (`@base-ui-components/react`, al
aanwezig) in `components/beheer/ui/` (niet in `components/ui`, zodat het
eigenaarschap klopt).

| Primitive | Bron | Gebruikt voor |
|---|---|---|
| `CtaButton` (`variant` primary, secondary, tint, ghost, destructive, link; `size` sm, default, lg, icon) | `components/ui/cta-button.tsx` (spec 02) | alle knoppen; in het beheer alleen zonder `href`. Links met knoplook zijn `<Link>` uit `next/link` met `className={ctaButtonVariants({ variant, size })}`. |
| `Badge` | spec 02 | statusbadges en vlaggen (§4.2) |
| `Card` | spec 02 | blokken, kaarten op mobiel, tegels |
| `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableCaption` | spec 02 | lijsten vanaf 1024 px |
| `Input`, `Textarea`, `Label`, `NativeSelect`, `CheckboxField`, `RadioGroup`, `RadioCard`, `Field`, `FieldSet`, `FieldLegend`, `FieldGroup`, `FieldLabel`, `FieldDescription`, `FieldError` | spec 02 | formulieren; aan of uit (per direct, minimumleeftijd, vlaggen) is een `CheckboxField` |
| `Sheet` | spec 02 | filters op mobiel |
| `Tabs` | spec 02 | alleen voor wisselende inhoud binnen één pagina; de statustabbladen van lijsten zijn links (`StatusTabs`) |
| `Alert` | spec 02 | meldingen in de pagina: statusregel bij inloggen, `PublishChecklist`, waarschuwingen |
| `Skeleton` | spec 02 | `loading.tsx` |
| `ToastProvider`, `Toaster`, `useToast` | `components/ui/toast.tsx` (spec 02) | toasts |
| `Dialog` | `components/beheer/ui/dialog.tsx` op base-ui `Dialog` | dialogen bij vacatures (`VacancyDialogs`) |
| `AlertDialog` | `components/beheer/ui/alert-dialog.tsx` op base-ui `AlertDialog` | bevestigingen (`ConfirmDialog`) |
| `Menu` | `components/beheer/ui/menu.tsx` op base-ui `Menu` | rijacties (`VacancyActions` met `variant="menu"`) |

`Switch` vervalt; gebruik `CheckboxField`. Een eigen toaster is er niet: de
root-layout rendert `ToastProvider` en `Toaster` van spec 02 (§4.4) en
meldingen gaan via `useToast().add({ title, type: "success" | "error" })`.

Nieuwe componenten (S = server, C = client):

| Component (bestand) | S/C | Props |
|---|---|---|
| `SidebarNav` (`sidebar-nav.tsx`) | C | `{ counts: NavCounts; profile: { displayName: string; role: AdminRole } }`; `usePathname()` zet `aria-current="page"` |
| `MobileTabBar` (`mobile-tab-bar.tsx`) | C | `{ counts: NavCounts }`; vijf items: Overzicht, Vacatures, Sollicitaties, Aanvragen, Meer; `data-tabbalk`; verborgen als de pagina een `[data-actiebalk]` bevat |
| `TopBar` (`top-bar.tsx`) | S | `{ title?: string; backHref?: string }`; woordmerk van spec 02 met tekst "Beheer", op mobiel een terugknop op detailpagina's |
| `PageHeader` (`page-header.tsx`) | S | `{ title: string; description?: string; actions?: ReactNode; meta?: ReactNode }`; rendert de h1 |
| `SectionCard` (`section-card.tsx`) | S | `{ id?: string; title: string; description?: string; actions?: ReactNode; children: ReactNode }`; h2 |
| `StatusBadge` (`status-badge.tsx`) | S | `{ kind: "vacancy" \| "application" \| "staffRequest" \| "message"; status: string; size?: "sm" \| "md" }`; label uit `S.status`, toon uit `STATUS_TONE` |
| `FlagBadge` (`flag-badge.tsx`) | S | `{ flag: "featured" \| "urgent" }` |
| `StatusTabs` (`status-tabs.tsx`) | S | `{ tabs: { key: string; label: string; count: number; href: string }[]; activeKey: string; label: string }`; links met `aria-current`, horizontaal scrollbaar op mobiel |
| `ListToolbar` (`list-toolbar.tsx`) | C | `{ searchLabel: string; searchPlaceholder: string; filters: ToolbarFilter[]; sortOptions?: { value: string; label: string }[] }`; GET-formulier; op mobiel filters in een `Sheet`; zonder JavaScript werkt de knop Zoeken |
| `ResponsiveList` (`responsive-list.tsx`) | S | `{ caption: string; columns: Column<T>[]; rows: T[]; rowHref: (row: T) => string; card: (row: T) => ReactNode; empty: ReactNode }`; tabel vanaf `lg`, kaarten eronder |
| `BeheerPagination` (`beheer-pagination.tsx`) | S | `{ page: number; pageCount: number; hrefFor: (page: number) => string; label: string }`; links via `next/link`, met het uiterlijk van `Pagination` van spec 02 (die via de taalnavigatie linkt en alleen voor de publieke site is) |
| `EmptyState` (`empty-state.tsx`) | S | `{ title?: string; body: string; action?: ReactNode }` |
| `StatTile` (`stat-tile.tsx`) | S | `{ label: string; value: number; href: string; tone?: BadgeTone }` |
| `TodoList` (`todo-list.tsx`) | S | `{ groups: { key: string; title: string; items: { id: string; text: string; href: string; tone?: BadgeTone }[] }[] }` |
| `ActivityFeed` (`activity-feed.tsx`) | S | `{ items: ActivityItem[]; showEntity?: boolean; emptyText: string }`; `<ol>` met tijd in `<time dateTime>` |
| `NoteForm` (`note-form.tsx`) | C | `{ entityType: "application" \| "staff_request"; entityId: string }`; `useActionState(addNote)` |
| `ContactActions` (`contact-actions.tsx`) | C | `{ entityType: EntityType; entityId: string; phoneE164: string \| null; email: string \| null; whatsappText: string; mailSubject: string; layout: "inline" \| "bar" }`; drie `<a>`-links; `onClick` start `logContactAttempt` zonder de navigatie te blokkeren |
| `DetailActionBar` (`detail-action-bar.tsx`) | C | `{ children: ReactNode }`; `data-actiebalk`, vast onderin onder 1024 px met `padding-bottom: env(safe-area-inset-bottom)` |
| `StatusForm` (`status-form.tsx`) | C | `{ kind: "application" \| "staffRequest" \| "message"; id: string; current: string; options: string[] }`; bij een eindstatus eerst `ConfirmDialog` |
| `AssignForm` (`assign-form.tsx`) | C | `{ kind: "application" \| "staffRequest"; id: string; current: string \| null; admins: { id: string; displayName: string }[]; meId: string }`; toont alle actieve beheerders, ook zonder telefoonnummer |
| `CvButtons` (`cv-buttons.tsx`) | C | `{ applicationId: string; filename: string \| null; mime: string \| null; sizeBytes: number \| null }`; roept `openCv` aan en navigeert met `window.location.assign(url)` |
| `DefinitionList` (`definition-list.tsx`) | S | `{ items: { term: string; value: ReactNode }[] }` |
| `ConfirmDialog` (`confirm-dialog.tsx`) | C | `{ title: string; body: string; confirmLabel: string; tone?: "default" \| "destructive"; onConfirm: () => Promise<void> \| void; trigger: ReactNode; children?: ReactNode }`; op `AlertDialog` uit `components/beheer/ui/` |
| `SubmitButton` (`submit-button.tsx`) | C | `{ children: ReactNode; pendingLabel?: string } & Omit<CtaButtonProps, "href" \| "type" \| "pending" \| "pendingLabel" \| "children">`; `useFormStatus()`; rendert `<CtaButton type="submit" pending={pending} pendingLabel={pendingLabel ?? S.common.saving}>` |
| `BeheerField` (`beheer-field.tsx`) | S | `{ id: string; label: string; hint?: string; error?: string[]; required?: "always" \| "publish"; children: ReactElement }`; wrapper rond `Field`, `FieldLabel`, `FieldDescription` en `FieldError` van spec 02; koppelt `aria-describedby` en `aria-invalid`; `required: "publish"` zet het kenmerk `S.common.requiredForPublish` naast het label, zonder `required` staat er `S.common.optional` |
| `ErrorSummary` (`error-summary.tsx`) | C | `{ errors: { field: string; message: string }[] }`; `role="alert"`, krijgt focus na een mislukte verzending, links naar de velden |
| `FlashToast` (`flash-toast.tsx`) | C | geen props; leest `?melding=<sleutel>` (sleutel uit `S.toasts`), toont de toast met `useToast().add({ title, type: "success" })` en haalt de parameter weg met `router.replace` |
| `AuthCard` (`auth/auth-card.tsx`) | S | `{ title: string; intro?: string; children: ReactNode; footer?: ReactNode }` |
| `LoginForm`, `MfaVerifyForm`, `MfaEnroll`, `PasswordResetForm`, `PasswordSetForm` (`auth/*.tsx`) | C | zie §4.5 |
| `OtpField` (`auth/otp-field.tsx`) | C | `{ name: string; label: string; hint: string; error?: string[] }`; één `<input>` met `inputMode="numeric"`, `autoComplete="one-time-code"`, `pattern="[0-9]{6}"`, `maxLength={6}`, plakken toegestaan, spaties worden verwijderd |
| `VacancyForm` (`vacancy/vacancy-form.tsx`) | C | §4.7 |
| `FormBlock` (`vacancy/form-block.tsx`) | S | `{ id: string; title: string; description?: string; children: ReactNode }`; `<fieldset>` met `<legend>` als h2-stijl, ankers voor de foutlijst |
| `ListField` (`vacancy/list-field.tsx`) | C | `{ name: "tasks" \| "requirements" \| "offer"; label: string; hint: string; addLabel: string; removeLabel: string; initial: string[]; min: number; max: 10; error?: string[] }`; inputs met dezelfde `name` |
| `PublishChecklist` (`vacancy/publish-checklist.tsx`) | S | `{ errors: PublishErrorCode[]; warnings: string[] }` |
| `VacancyActions` (`vacancy/vacancy-actions.tsx`) | C | `{ vacancy: VacancyActionTarget; isOwner: boolean; variant: "menu" \| "buttons" }`; menu in de lijst, knoppen op de bewerkpagina; opent de dialogen |
| `VacancyDialogs` (`vacancy/vacancy-dialogs.tsx`) | C | publiceren, inplannen, sluiten met reden, heropenen, verlengen, archiveren, verwijderen; elk met de tekst uit `S.dialogs` |
| `PreviewBar` (`vacancy/preview-bar.tsx`) | S | `{ number: number; status: VacancyStatus }`; vaste balk bovenaan met tekst en link terug |

`NavCounts = { applicationsNew: number; requestsNew: number; messagesNew: number }`.
`ActivityItem = { id: string; kind: ActivityKind; actorName: string | null; body: string | null; payload: Record<string, unknown> | null; createdAt: string; entity?: { label: string; href: string } }`.

### 4.4 Root-layout, shell en navigatie

`app/beheer/layout.tsx` volgt spec 01 §4.21:

- `<html lang="nl">`, `<body className="min-h-dvh bg-background text-foreground font-sans antialiased">`,
  importeert `../globals.css` en de fonts van spec 02 (dezelfde `next/font`-objecten
  als de publieke layout).
- `export const metadata: Metadata = { title: { default: S.app.name, template: S.app.titleTemplate }, robots: { index: false, follow: false, nocache: true }, manifest: "/beheer/manifest.webmanifest", appleWebApp: { capable: true, title: S.app.name, statusBarStyle: "default" }, applicationName: S.app.name }`.
- `export const viewport: Viewport = { themeColor: brand.colors.background, width: "device-width", initialScale: 1, viewportFit: "cover" }`.
- Rendert `<ToastProvider>{children}<Toaster closeLabel={S.common.close} /></ToastProvider>`
  (spec 02); meldingen gaan via `useToast().add({ title, type: "success" | "error" })`.
  Geen `SiteHeader`, `SiteFooter`,
  `NextIntlClientProvider`, `Analytics` of `PrivacyAnalytics` (spec 09 E-09-15).

`app/beheer/(app)/layout.tsx` (S):

1. `const ctx = await requireAdmin()`; `const counts = await getNavCounts(ctx)`.
2. Skiplink `S.app.skipLink` naar `#inhoud`.
3. Vanaf `lg`: `SidebarNav` links (breedte 16rem, sticky), met Overzicht,
   Vacatures, Sollicitaties, Personeelsaanvragen, Berichten; badges met de
   tellers; onderin de naam van de beheerder, "Bekijk website" (`/`, nieuw
   tabblad) en een formulier met de actie `signOut`.
4. `TopBar` bovenaan (sticky, hoogte 56 px).
5. `<main id="inhoud" tabIndex={-1} className="pb-28 lg:pb-10">` met de pagina;
   breedte maximaal 72rem, zijmarge 16 px op mobiel.
6. Onder `lg`: `MobileTabBar` vast onderin. Berichten staat onder Meer; de
   badge van Meer toont het aantal nieuwe berichten.
7. `<Suspense><FlashToast /></Suspense>`.

`/beheer/meer` toont een lijst grote knoppen: Berichten (met teller),
Personeelsaanvragen, Bekijk website, Uitloggen en Overal uitloggen (met
`ConfirmDialog`). Vanaf `lg` blijft de pagina bereikbaar, maar de sidebar
linkt er niet naar.

### 4.5 Inloggen, MFA en wachtwoord

Alle auth-pagina's gebruiken `(auth)/layout.tsx`: een `AuthCard` in het midden
van een witte pagina met het woordmerk erboven, maximaal 24rem breed, zonder
navigatie. Formulieren zijn client components met `useActionState`.

**`/beheer/inloggen`** (`LoginForm`). Velden: `email` (`type="email"`,
`autoComplete="username"`, `inputMode="email"`), `password` (`type="password"`,
`autoComplete="current-password"`, knop Wachtwoord tonen), verborgen `volgende`.
Knop Inloggen; link Wachtwoord vergeten. Meldingen uit `?melding=` (`uitgelogd`,
`link-verlopen`, `wachtwoord-gewijzigd`, `sessie-verlopen`) staan als
statusregel boven het formulier. Actie `signIn` (§5.3). Het formulier post naar
`/beheer/inloggen`, het pad dat BotID en de WAF-regel `beheer-inloggen` van spec
13 bewaken.

**`/beheer/mfa`** (`MfaVerifyForm`). De pagina (S) leest `getSessionState()`:
`none` naar inloggen, `admin` naar `safeNext(volgende)`, zonder geverifieerde
factor naar koppelen. Formulier: `OtpField` met naam `code`, verborgen
`volgende`. Onder het formulier de tekst `S.auth.mfa.lostPhone` en een knop
Ander account (actie `signOut`).

**`/beheer/mfa/koppelen`** (`MfaEnroll`). Drie genummerde stappen uit
`S.auth.enroll`. Knop Koppeling starten roept `startMfaEnrollment()` aan en
toont daarna de QR-code (`next/image` met `unoptimized`, 200 bij 200 px, alt
`S.auth.enroll.qrAlt`), de sleutel in groepen van vier tekens met knop Sleutel
kopiëren, en een `OtpField`. Bevestigen roept `confirmMfaEnrollment()` aan.
Bewust een knop en geen automatische start, zodat React StrictMode niet twee
factoren aanmaakt.

**`/beheer/wachtwoord-vergeten`** (`PasswordResetForm`). Veld `email`; actie
`requestPasswordReset`; daarna altijd dezelfde bevestiging, ook voor een
onbekend adres.

**`/beheer/auth/bevestigen`** (route handler GET). Leest `token_hash`, `type`
(`invite`, `recovery` of `email`), `code` en `volgende`. Met `token_hash`:
`supabase.auth.verifyOtp({ type, token_hash })`; met `code`:
`exchangeCodeForSession(code)`. Gebruikt `createSupabaseServerClient()` (route
handlers mogen cookies schrijven). Gelukt: bij `invite` of `recovery` naar
`/beheer/wachtwoord-instellen`, anders `safeNext(volgende)`. Mislukt: naar
`/beheer/inloggen?melding=link-verlopen`. De mailtemplates van spec 11 (geplakt
in het dashboard volgens spec 13 D7) gebruiken deze link:
`{{ .SiteURL }}/beheer/auth/bevestigen?token_hash={{ .TokenHash }}&type=invite`
voor de uitnodiging en `...&type=recovery` voor wachtwoordherstel.

**`/beheer/wachtwoord-instellen`** (`PasswordSetForm`). De pagina (S) eist een
sessie. Heeft de gebruiker al een geverifieerde factor en is de sessie `aal1`,
dan eerst naar `/beheer/mfa?volgende=/beheer/wachtwoord-instellen` (Supabase
vraagt `aal2` om het wachtwoord van een MFA-account te wijzigen). Velden
`password` en `passwordConfirm` (`autoComplete="new-password"`, minimaal 12
tekens). Actie `setPassword`.

**`/beheer/geen-toegang`**. Tekst `S.auth.noAccess` en knop Uitloggen. Voor een
account dat wel kan inloggen maar geen actief profiel in `admin_profiles` heeft.

### 4.6 Overzicht `/beheer`

Van boven naar beneden:

1. `PageHeader` met h1 `S.dashboard.greeting.<greetingKey()>` met de
   `displayName`, en als acties de knoppen Nieuwe vacature en Bekijk website.
2. Tegels (`StatTile`, raster van 2 kolommen op mobiel, 5 vanaf `lg`): Nieuwe
   sollicitaties, Open aanvragen, Nieuwe berichten, Vacatures online, Sluiten
   binnen 7 dagen. Elke tegel linkt naar de gefilterde lijst.
3. `SectionCard` "Vandaag te doen" met `TodoList`, groepen in deze volgorde en
   per groep maximaal vijf regels met een link "Alle {aantal} bekijken":
   - Nog niet opgepakt: sollicitaties met status `new`, ouder dan twee
     werkdagen (`subtractWorkdays`).
   - Bijna automatisch afgesloten: sollicitaties met status `new`,
     `in_progress` of `invited` zonder contact sinds 56 dagen
     (`RETENTION_DAYS.staleReminder`), met de datum waarop de 84 dagen
     verlopen.
   - Nieuwe aanvragen: `staff_requests` met status `new`.
   - Vacatures die binnen 7 dagen sluiten: `published` met `closes_at` tussen
     nu en nu plus 7 dagen; elke regel heeft een knop 30 dagen verlengen.
   - Vandaag gepland: `scheduled` met `publish_at` vandaag; met de melding als
     `vacancy_publish_errors` niet leeg is.
   - E-mail niet aangekomen (alleen `is_owner`): `email_log` met status
     `failed` of `bounced` in de laatste 7 dagen.
   Zijn alle groepen leeg, dan `EmptyState` met `S.empty.dashboard`.
4. `SectionCard` "Recente activiteit": `ActivityFeed` met de laatste tien
   regels uit `activities`, met de naam van de beheerder en een link naar het
   onderdeel.

### 4.7 Vacatures

**Lijst `/beheer/vacatures`.**

- `PageHeader` met h1 Vacatures en knop Nieuwe vacature.
- `StatusTabs` (parameter `tab`): Online (`published`, standaard), Gepland,
  Concepten, Gesloten, Archief, Alle; tellers uit één query op `status`.
- `ListToolbar` (GET-parameters): `q` (titel of vacaturenummer), `beroep`
  (`occupations`), `contact` (beheerder), `vlag` (`uitgelicht` of `spoed`),
  `sortering` (`bewerkt` standaard, `sluitdatum`, `nummer`). Filters wissen
  zet alles terug.
- `ResponsiveList` met kolommen Titel (met nummer en vlaggen), Beroep, Plaats,
  Status, Sollicitaties, Online sinds, Sluitdatum, Contactpersoon, Laatst
  bewerkt, en een kolom Acties met `VacancyActions` (menu). Kaart op mobiel:
  titel als h3, statusbadge, plaats en nummer, sluitdatum, aantal sollicitaties
  en het actiemenu.
- `BeheerPagination` met 25 per pagina (`pagina`).
- Lege staten: geen vacatures, geen resultaat bij filters, tabblad Gepland leeg.

**Nieuw `/beheer/vacatures/nieuw` en bewerken `/beheer/vacatures/[nummer]`.**
Dezelfde `VacancyForm`. `nummer` moet een geheel getal van minimaal 1001 zijn,
anders `notFound()`. Bovenaan `PageHeader` met h1 "Nieuwe vacature" of de titel,
in de meta het nummer en de `StatusBadge`; als acties `VacancyActions` met
`variant="buttons"` (alleen bij bewerken). Daaronder, als de vacature niet
publiceerbaar is, de `PublishChecklist`.

`VacancyForm` props: `{ mode: "create" | "edit"; initial: VacancyFormValues; occupations: { slug: OccupationSlug; nameNl: string }[]; admins: { id: string; displayName: string; hasPhone: boolean }[]; status: VacancyStatus | null; publishErrors: PublishErrorCode[]; updatedAt: string | null; history: ActivityItem[] }`.
Het formulier heeft zes blokken (`FormBlock`), op mobiel onder elkaar en op
`lg` met een inhoudsopgave rechts die naar de ankers springt:

| Blok (anker) | Velden (formuliernaam = kolom uit spec 10) |
|---|---|
| Basis (`#basis`) | `occupation_slug` (select), `title`, `city`, `postal_code`, `province` (select, standaard Zuid-Holland), `location_label`, `positions_count` |
| Tekst (`#tekst`) | `summary`, `intro`, `tasks` (`ListField`, minimaal 3 om te publiceren), `requirements` (minimaal 1), `offer` (minimaal 1), `extra` |
| Arbeidsvoorwaarden (`#voorwaarden`) | `contract_type` (`RadioCard`; toont alleen `temp_agency` zolang `isClaimConfirmed("serviceForms")` uit `lib/claims.ts` onwaar is, daarna alle drie; geen eigen constante `ENABLED_CONTRACT_TYPES`), `hours_min`, `hours_max`, `shifts` (checkboxes), `salary_min`, `salary_max` (tekstveld met `inputMode="decimal"`, komma toegestaan), `salary_note`, `start_asap` (`CheckboxField`) of `start_date` |
| Eisen (`#eisen`) | `education_level`, `experience_level`, `experience_months` (alleen bij `required`), `required_qualifications`, `preferred_qualifications` (checkboxlijsten), `training_offered` (checkboxlijst; verschijnt alleen als `isClaimConfirmed("certificateSupport")` uit `lib/claims.ts` waar is; is de vlag onwaar, dan stuurt het formulier een lege lijst en negeert `saveVacancy` het veld), `min_age_18` (`CheckboxField`) met `min_age_reason` (verplicht als het vakje aan staat, B-32), `workplace_language` (select, mag leeg; opties Nederlands, Engels, Nederlands of Engels) |
| Publicatie (`#publicatie`) | `contact_admin_id` (select met alleen beheerders met `hasPhone`; standaard de ingelogde beheerder als die een telefoonnummer heeft, anders de eerste uit de lijst), `closes_at` (datum; mag alleen bij status `draft` leeg blijven, dan 45 dagen na publiceren; bij `scheduled` en `published` verplicht en vooraf gevuld met de huidige sluitdatum, en geldt minimaal morgen alleen als de ingevulde datum afwijkt van de opgeslagen sluitdatum, zodat een ongewijzigde sluitdatum geen fout geeft; bij `closed` alleen-lezen: `saveVacancy` geeft de waarde uit de database ongewijzigd mee, net als `publish_at`, en heropenen gaat via `reopenVacancy`), `is_featured`, `is_urgent`, `allow_whatsapp_apply` (`CheckboxField`); bij `scheduled` alleen-lezen "Online vanaf" met de knop Inplanning wijzigen |
| Vindbaarheid (`#vindbaarheid`) | `seo_title`, `seo_description`, standaard ingeklapt (`<details>`) |

Velden die B-06 voor publiceren eist, krijgen het kenmerk "nodig om te
publiceren" naast het label. Onder elk veld staat de hint uit
`S.vacancies.form.fields` (§6.2); deze spec is de enige bron van die hints.
Verborgen velden: `id`, `updated_at` (voor de conflictcontrole) en `intent`
(`save`, `publish`). Onderaan een vaste knoppenbalk (op mobiel boven de
safe area): bij concept Opslaan als concept en Publiceren; bij gepland Opslaan
en Nu publiceren; bij online of gesloten Wijzigingen publiceren; altijd
Voorbeeld bekijken (na de eerste keer opslaan). Wijzigingen publiceren (status
`published` of `closed`), Opslaan (status `scheduled`) en Opslaan als concept
sturen `intent = save`; alleen Publiceren bij status `draft` (en bij een nieuwe
vacature) stuurt `intent = publish`. Bij niet-opgeslagen
wijzigingen vraagt `beforeunload` om bevestiging; links binnen het beheer tonen
het dialoog `S.dialogs.unsaved`.

Onder het formulier op de bewerkpagina: `SectionCard` Geschiedenis met de
laatste tien activiteiten van deze vacature en het aantal sollicitaties met de
link Bekijk sollicitaties (`/beheer/sollicitaties?vacature=<nummer>&tab=alle`).

Voorinvullen vanuit een aanvraag: `/beheer/vacatures/nieuw?beroep=<slug>&plaats=<tekst>&uren=<getal>&start=<YYYY-MM-DD>`
vult `occupation_slug`, `city`, `hours_min` en `hours_max` en `start_date`.

**Voorbeeld `/beheer/vacatures/[nummer]/voorbeeld`.** Leest de vacature met de
sessieclient (ook concepten) via
`getVacancyPreview(ctx: AdminContext, number: number): Promise<VacancyDetail | null>`
in `app/beheer/_data/vacancies.ts`, die een `VacancyDetail` uit
`lib/data/types.ts` (spec 10) teruggeeft. `null` volgt alleen als de vacature
niet bestaat; dan roept de pagina `notFound()` aan. Regels van de omzetting:

- `state` is `"closed"` bij status `closed` of `archived` of als `publicState`
  closed is, anders `"open"`.
- `publishedAt = published_at ?? publish_at ?? updated_at`.
- `closesAt = closes_at ?? publishedAt + VACANCY_DEFAULT_CLOSE_DAYS dagen`.
- `closedAt` en `closeReason` komen uit de rij.
- `path = /vacatures/${slug}`.
- `contact` komt uit de join op `admin_profiles!contact_admin_id`.
- Ontbrekende tekst wordt `""` en ontbrekende getallen worden `0`.

Geeft `vacancy_publish_errors` geen codes terug, dan rendert de pagina de
detailinhoud van spec 06 (de sectiecomponent die de publieke vacaturepagina
gebruikt, zonder sollicitatieformulier en zonder JSON-LD), binnen
`NextIntlClientProvider locale="nl"` met alleen de namespaces `vacatures` en
`common`. Geeft `vacancy_publish_errors` wel codes terug, dan toont de pagina
onder `PreviewBar` de `PublishChecklist` en de eenvoudige weergave (h1,
`VacancyFacts` en de drie lijsten) en nooit het detailcomponent van spec 06.
Bovenaan staat altijd `PreviewBar` met `S.vacancies.preview.bar`. Niet
gecachet. Exporteert spec 06 geen herbruikbaar detailcomponent, dan toont de
pagina ook zonder publicatiefouten de eenvoudige weergave (zie §12).

### 4.8 Sollicitaties

**Lijst `/beheer/sollicitaties`.** Alleen rijen met `anonymized_at is null`.

- `StatusTabs`: Open (`new`, `in_progress`, `invited`; standaard), Nieuw, In
  behandeling, Uitgenodigd, Geplaatst, Afgewezen, Ingetrokken, Alle.
- `ListToolbar`: `q` (naam, e-mail, telefoon, referentie, woonplaats),
  `vacature` (vacaturenummer of `inschrijving` voor `kind = registration`),
  `beroep`, `cv` (`met` of `zonder`), `periode` (`7`, `30`, `90` dagen),
  `toegewezen` (beheerder of `niemand`).
- Kolommen: Naam, Vacature (titel en nummer, of "Inschrijving"), Woonplaats,
  Telefoon, Ontvangen, Status, Cv, Toegewezen aan, Bewaard tot. Kaart op
  mobiel: naam als h3, statusbadge, vacature, woonplaats, ontvangen (relatief)
  en `ContactActions` met alleen Bellen en WhatsApp.
- 25 per pagina, nieuwste eerst.

**Detail `/beheer/sollicitaties/[referentie]`.** `referentie` past op
`^S-\d{4}-\d{4,}$`, anders `notFound()`; een geanonimiseerde rij geeft ook
`notFound()`.

1. `PageHeader`: h1 `S.applications.detail.title` met de volledige naam; meta:
   statusbadge, referentie, ontvangen op, bron, en de link naar de vacature
   (`/beheer/vacatures/<nummer>`) of "Inschrijving".
2. `SectionCard` Contact: telefoon, e-mail, woonplaats, met
   `ContactActions layout="inline"`.
3. `SectionCard` Gegevens (`DefinitionList`): mag in Nederland werken,
   beschikbaar vanaf, rijbewijs B (alleen als ingevuld), beroepen
   (inschrijving), bericht, taal, toestemming om een jaar te bewaren met datum.
4. `SectionCard` Cv: `CvButtons` of de lege staat `S.empty.noCv`.
5. `SectionCard` Status en toewijzing: `StatusForm` en `AssignForm`.
6. `SectionCard` Tijdlijn: `NoteForm` bovenaan en `ActivityFeed`.
7. `SectionCard` Andere sollicitaties van deze persoon: rijen met hetzelfde
   e-mailadres of telefoonnummer, niet geanonimiseerd, behalve deze.
8. Regel onderaan: `S.applications.detail.retention` met `retain_until`.
9. `DetailActionBar` (mobiel): Bellen, WhatsApp, E-mailen en Status (springt
   naar het statusblok).

### 4.9 Personeelsaanvragen

**Lijst `/beheer/aanvragen`.** Tabs: Open (`new`, `in_progress`,
`quote_sent`, `started`; standaard), Nieuw, In behandeling, Offerte verstuurd,
Gestart, Afgerond, Geannuleerd, Alle. Toolbar: `q` (bedrijf, contactpersoon,
e-mail, telefoon, referentie, werkplaats), `beroep`, `periode`, `toegewezen`.
Kolommen: Bedrijf, Contactpersoon, Gevraagd (beroepen in meervoud plus
"Anders: ..."), Aantal, Start, Werkplaats, Ontvangen, Status, Toegewezen aan.

**Detail `/beheer/aanvragen/[referentie]`** (`^P-\d{4}-\d{4,}$`). h1 met de
bedrijfsnaam; blokken Contact (met `ContactActions`), Aanvraag
(`DefinitionList`: beroepen, aantal, start, duur, uren per week, werkplaats,
KvK-nummer, toelichting), Status en toewijzing, Tijdlijn met `NoteForm`, en
knop Vacature maken (link met de voorinvulparameters uit §4.7, eerste beroep
uit `occupation_slugs`). `DetailActionBar` op mobiel.

### 4.10 Berichten

**Lijst `/beheer/berichten`.** Tabs: Nieuw (standaard), Beantwoord,
Gearchiveerd, Spam, Alle. Toolbar: `q` (naam, e-mail, telefoon), `onderwerp`
(`contact_topic`). Kolommen: Naam, Onderwerp, Bereikbaar via (telefoon of
e-mail), Ontvangen, Status.

**Detail `/beheer/berichten/[id]`** (uuid, anders `notFound()`). h1 met de
naam; `DefinitionList` met onderwerp, telefoon, e-mail, ontvangen, bericht
(bij `callback` de zin `S.messages.detail.callback`); `ContactActions`;
statusknoppen Markeren als beantwoord, Archiveren, Markeren als spam (met
`ConfirmDialog`) en bij een andere status dan `new` Terugzetten als nieuw;
daaronder de tijdlijn zonder notitieformulier (fase 1).

### 4.11 Fout- en laadstaten

- `app/beheer/not-found.tsx`: h1 `S.notFound.title`, tekst en een link naar
  `/beheer`. Ook voor het vangnet `[...rest]`.
- `app/beheer/error.tsx` (C): props `{ error: Error & { digest?: string }; retry: () => void }`;
  h1 `S.error.title`, tekst, knop Opnieuw proberen (`retry()`), link naar het
  overzicht, en de `digest` klein onderaan.
- `app/beheer/(app)/loading.tsx`: skelet met de vorm van een paginakop en vijf
  rijen, met `S.app.loading` in een `aria-live="polite"`-element.

### 4.12 Manifest en iconen

`manifest.webmanifest/route.ts` (GET, `dynamic = "force-static"`) geeft
`Content-Type: application/manifest+json` met `{ id: "/beheer", name: "Groos Beheer", short_name: "Groos Beheer", lang: "nl", start_url: "/beheer", scope: "/beheer/", display: "standalone", background_color: brand.colors.background, theme_color: brand.colors.background, icons: [{ src: "/beheer/icon/192", sizes: "192x192", type: "image/png", purpose: "any" }, { src: "/beheer/icon/512", sizes: "512x512", type: "image/png", purpose: "maskable" }] }`.
`icon.tsx` maakt met `generateImageMetadata` de ids `192` en `512` en tekent het
beeldmerk van spec 02 gecentreerd op de primaire merkkleur uit `lib/brand.ts`,
met 20 procent witruimte (maskable).

### 4.13 Proxy

Vastgelegd in B-38: `/beheer` gaat wel door `proxy.ts`, maar nooit
door de taalrouting. Spec 01 (eigenaar van `proxy.ts`) voert dit uit zoals spec
01 §12 punt 1 al beschrijft:

```ts
// proxy.ts (spec 01), wijziging door de bouw-agent van spec 08 in overleg
export const config = {
  matcher: [
    "/((?!api|beheer|feeds|monitoring|_next|_vercel|149e9513-01fa-4fb0-aad4-566afd725d1b|opengraph-image|twitter-image|icon|apple-icon|.*\\..*).*)",
    "/beheer/:path*",
  ],
};
export default async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/beheer" || request.nextUrl.pathname.startsWith("/beheer/")) {
    return beheerProxy(request);       // uit app/beheer/_lib/proxy.ts; geen next-intl, geen geo-redirect, geen NEXT_LOCALE
  }
  // ... bestaand gedrag van spec 01
}
```

`beheerProxy(request)`:

1. `const { response, userId, aal } = await updateSession(request)` (spec 10).
2. Zet op elke uitgaande respons `X-Robots-Tag: noindex, nofollow` en
   `Cache-Control: private, no-store`.
3. POST-verzoeken met de header `next-action` krijgen nooit een redirect; de
   actie zelf geeft `sessie_verlopen` terug.
4. Publieke paden zonder controle: `/beheer/manifest.webmanifest`,
   `/beheer/icon/*`, `/beheer/auth/bevestigen`.
5. Ingangspaden `/beheer/inloggen` en `/beheer/wachtwoord-vergeten`: met
   `aal === "aal2"` naar `/beheer`, anders doorlaten.
6. Tussenpaden `/beheer/mfa`, `/beheer/mfa/koppelen`,
   `/beheer/wachtwoord-instellen`, `/beheer/geen-toegang`: zonder `userId` naar
   inloggen, anders doorlaten.
7. Alle andere paden: zonder `userId` naar
   `/beheer/inloggen?volgende=<pad en query>`, met `aal1` naar
   `/beheer/mfa?volgende=<pad en query>`, anders doorlaten.
8. Elke redirect is 307 en neemt de cookies over die `updateSession` op
   `response` zette (`response.cookies.getAll()` naar de redirect).

De proxy doet geen databasequery; de echte controle zit in `requireAdmin()`,
`withAdmin()` en de RLS.

## 5 Data

### 5.1 Tabellen en kolommen die deze module gebruikt

Het datamodel is van spec 10; hier staat alleen het gebruik. Het beheer leest en
schrijft met `createSupabaseServerClient()`, dus altijd onder de RLS met de
sessie van de beheerder. `createSupabaseAdminClient()` gebruikt het beheer
alleen in `writeAdminAudit()` en, via spec 10, in `createCvReadUrl()`.

| Tabel of functie | Lezen | Schrijven |
|---|---|---|
| `admin_profiles` | eigen profiel (ook bij `aal1`), lijst van actieve beheerders voor selects | `last_seen_at` van het eigen profiel na MFA |
| `occupations` | actieve beroepen op `sort_order` | geen |
| `vacancies` met `vacancy_translations` (`locale = 'nl'`) | lijst, detail, tellers | via `save_vacancy`, `duplicate_vacancy` en updates van `status`, `publish_at`, `closes_at`, `close_reason`, `is_featured`, `is_urgent`; delete van concepten (eigenaar) |
| `public_vacancies` | teller "Vacatures online" (`state = 'open'`) | geen |
| `applications` | lijst, detail, andere sollicitaties van dezelfde persoon | `status`, `assigned_to` |
| `staff_requests` | lijst, detail | `status`, `assigned_to` |
| `contact_messages` | lijst, detail | `status` |
| `activities` | tijdlijn, recente activiteit | insert van `note`, `call`, `whatsapp`, `email_sent`, `assigned`, `status_change` (aanvragen, berichten, vacatures) |
| `email_log` | mislukte mails op het overzicht (alleen eigenaar) | geen |
| `audit_log` | geen (fase 2) | via triggers en `writeAdminAudit()` |
| RPC `vacancy_publish_errors`, `save_vacancy`, `duplicate_vacancy`, `is_admin`, `is_owner` | ja | ja |

Vaste waardensets komen uit `lib/data/options.ts` (spec 10): `VACANCY_STATUSES`,
`CLOSE_REASONS`, `CONTRACT_TYPES`, `SHIFTS`, `EDUCATION_LEVELS`,
`EXPERIENCE_LEVELS`, `QUALIFICATIONS`, `MIN_AGE_REASONS`, `PROVINCES`,
`APPLICATION_STATUSES`, `APPLICATION_SOURCES`, `STAFF_REQUEST_STATUSES`,
`REQUEST_DURATIONS`, `CONTACT_TOPICS`, `MESSAGE_STATUSES`,
`VACANCY_DEFAULT_CLOSE_DAYS`, `VACANCY_EXTEND_DAYS`, `CLOSED_VISIBLE_DAYS`,
`RETENTION_DAYS`, `WORKPLACE_LANGUAGES` en `MINIMUM_WAGE_21_PLUS` (de enige
constante voor het minimumloon, B-42). Typen uit `lib/database.types.ts`.

### 5.2 Leesfuncties in `app/beheer/_data/` (server-only, ongecachet)

Elke functie krijgt de `AdminContext` en gebruikt `ctx.supabase`. Onafhankelijke
queries draaien met `Promise.all`. Een Supabase-fout wordt gegooid en komt in
`error.tsx`.

```ts
// _data/nav.ts
export async function getNavCounts(ctx: AdminContext): Promise<NavCounts>;
// drie head-queries: applications status new en anonymized_at is null; staff_requests status new; contact_messages status new

// _data/dashboard.ts
export async function getDashboard(ctx: AdminContext): Promise<{
  tiles: { applicationsNew: number; requestsOpen: number; messagesNew: number; vacanciesOnline: number; closingSoon: number };
  todo: { staleNew: TodoItem[]; nearAutoClose: TodoItem[]; requestsNew: TodoItem[]; closingSoon: TodoItem[];
          scheduledToday: TodoItem[]; emailFailed: TodoItem[] };   // emailFailed leeg als profiel geen owner is
  recent: ActivityItem[];
}>;

// _data/vacancies.ts
export type VacancyListRow = { id: string; number: number; status: VacancyStatus; title: string; slug: string;
  occupationSlug: OccupationSlug; city: string | null; publishedAt: string | null; publishAt: string | null;
  closesAt: string | null; closeReason: CloseReason | null; isFeatured: boolean; isUrgent: boolean;
  contactName: string | null; applicationCount: number; updatedAt: string };
export async function listVacancies(ctx: AdminContext, p: { tab: VacancyTab; q?: string; beroep?: OccupationSlug;
  contact?: string; vlag?: "uitgelicht" | "spoed"; sortering: "bewerkt" | "sluitdatum" | "nummer"; page: number })
  : Promise<{ rows: VacancyListRow[]; total: number; pageCount: number; tabCounts: Record<VacancyTab, number> }>;
export async function getVacancyForEdit(ctx: AdminContext, number: number): Promise<{ form: VacancyFormValues;
  status: VacancyStatus; publishErrors: PublishErrorCode[]; updatedAt: string; applicationCount: number;
  history: ActivityItem[]; slug: string; publicState: "open" | "closed" | null } | null>;
export async function getVacancyPreview(ctx: AdminContext, number: number): Promise<VacancyDetail | null>;
export async function listOccupationOptions(ctx: AdminContext): Promise<{ slug: OccupationSlug; nameNl: string; pluralNl: string }[]>;
export async function listAdminOptions(ctx: AdminContext): Promise<{ id: string; displayName: string; hasPhone: boolean }[]>; // hasPhone is phone_e164 is not null

// _data/applications.ts
export async function listApplications(ctx, p: { tab: ApplicationTab; q?: string; vacature?: number | "inschrijving";
  beroep?: OccupationSlug; cv?: "met" | "zonder"; periode?: 7 | 30 | 90; toegewezen?: string | "niemand"; page: number })
  : Promise<{ rows: ApplicationListRow[]; total: number; pageCount: number; tabCounts: Record<ApplicationTab, number> }>;
export async function getApplication(ctx, reference: string): Promise<ApplicationDetail | null>;

// _data/staff-requests.ts en _data/messages.ts: listStaffRequests, getStaffRequest, listMessages, getMessage met dezelfde vorm.

// _data/activities.ts
export async function listActivities(ctx, entityType: EntityType, entityId: string, limit?: number): Promise<ActivityItem[]>; // standaard 50
export async function listRecentActivities(ctx, limit?: number): Promise<ActivityItem[]>;                                  // standaard 10
```

Querypatronen (PostgREST via supabase-js):

- Vacaturelijst: `from("vacancies").select("id, number, status, occupation_slug, city, published_at, publish_at, closes_at, close_reason, is_featured, is_urgent, updated_at, contact:admin_profiles!contact_admin_id(display_name), nl:vacancy_translations!inner(title, slug), applications(count)", { count: "exact" }).eq("vacancy_translations.locale", "nl")`.
  De hint `!contact_admin_id` is nodig omdat `vacancies` drie verwijzingen naar
  `admin_profiles` heeft. Zoeken: alleen cijfers geeft `.eq("number", q)`,
  anders `.ilike("vacancy_translations.title", "%woord%")` per woord. Tabtellers:
  `select("status")` van alle rijen en tellen in het geheugen (fase 1 kleiner
  dan 500 rijen).
- Sollicitatielijst: `from("applications").select("id, reference, kind, status, source, first_name, last_name, phone_e164, email, city, created_at, cv_path, retain_until, vacancy_number, vacancy_title_snapshot, occupation_slugs, assigned:admin_profiles!assigned_to(display_name)", { count: "exact" }).is("anonymized_at", null)`;
  per zoekwoord één `.or("first_name.ilike.%w%,last_name.ilike.%w%,email.ilike.%w%,reference.ilike.%w%,city.ilike.%w%")`,
  een telefoonterm als `.ilike("phone_e164", "%<cijfers>%")`. Zoekwoorden gaan
  altijd eerst door `sanitizeSearch()`.
- Tijdlijn: `from("activities").select("id, kind, body, payload, created_at, actor:admin_profiles!actor_id(display_name)").eq("entity_type", t).eq("entity_id", id).order("created_at", { ascending: false })`.
- Vacaturedetail voor bewerken: één rij uit `vacancies` met de `nl`-vertaling,
  plus `rpc("vacancy_publish_errors", { p_vacancy_id })`.

### 5.3 Server Actions in `app/beheer/_actions/`

Elk bestand begint met `"use server"`. Elke actie volgt dezelfde vijf stappen:
(1) `withAdmin()`, (2) zod-parse van de invoer, (3) mutatie met
`ctx.supabase`, (4) tijdlijn en logboek volgens §5.4, (5) revalidatie en
`refresh()` uit `next/cache` of `redirect()`, en geeft `ActionResult` terug met
een tekst uit `S.toasts`. Acties die met `useActionState` werken hebben de
signatuur `(prev: ActionResult | null, formData: FormData) => Promise<ActionResult>`;
acties uit knoppen en dialogen krijgen een getypeerd object.

**Tabel 1: auth (`_actions/auth.ts`, zonder `withAdmin`).**

| Actie | Invoer | Gedrag |
|---|---|---|
| `signIn` | `email`, `password`, `volgende` | `isBotRequest()` (spec 13) geeft `bot`; `signInWithPassword`; daarna eigen profiel: ontbreekt of inactief, dan `signOut()` en fout `geen_toegang`; `mfa.listFactors()`: met geverifieerde TOTP naar `/beheer/mfa?volgende=`, anders naar `/beheer/mfa/koppelen` |
| `verifyMfa` | `code` (6 cijfers), `volgende` | factor uit `listFactors().data.totp[0]`; `mfa.challengeAndVerify({ factorId, code })`; gelukt: `last_seen_at = now()`, `writeAdminAudit("admin.signed_in")`, redirect `safeNext(volgende)` |
| `startMfaEnrollment` | geen | eerst elke niet-geverifieerde TOTP-factor van de gebruiker `unenroll`; dan `mfa.enroll({ factorType: "totp", friendlyName: "Groos Beheer", issuer: "Groos Beheer" })`; geeft `{ factorId, qrCode, secret }` terug |
| `confirmMfaEnrollment` | `factorId`, `code` | `challengeAndVerify`; `writeAdminAudit("admin.mfa_enrolled")`; redirect `/beheer?melding=welkom` |
| `requestPasswordReset` | `email` | begint met `isBotRequest()` (spec 13); bij een bot volgt dezelfde bevestiging `S.auth.forgot.sent` zonder aanroep van Supabase (B-50); anders `resetPasswordForEmail(email, { redirectTo: beheerOrigin() + "/beheer/auth/bevestigen?volgende=/beheer/wachtwoord-instellen" })`; geeft altijd dezelfde bevestiging, ook bij een fout van Supabase (behalve een rate limit) |
| `setPassword` | `password`, `passwordConfirm` | `auth.updateUser({ password })`; fout `weak_password` of `same_password` naar de tekst in `S.auth.errors`; `writeAdminAudit("admin.password_changed")`; zonder factor naar `/beheer/mfa/koppelen`, anders naar `/beheer?melding=wachtwoord` |
| `signOut` | `scope` (`local` of `global`) | `writeAdminAudit("admin.signed_out")` als er een sessie is; `auth.signOut({ scope })`; redirect `/beheer/inloggen?melding=uitgelogd` |

**Tabel 2: vacatures (`_actions/vacancies.ts`).** Toegestane acties per status
(`VACANCY_ACTIONS`), gelijk aan de overgangen van spec 10 §5.5:

| Status | Acties in het menu |
|---|---|
| `draft` | bewerken, voorbeeld, publiceren, inplannen, archiveren, dupliceren, verwijderen (eigenaar, zonder sollicitaties) |
| `scheduled` | bewerken, voorbeeld, nu publiceren, inplanning wijzigen, inplanning annuleren, dupliceren |
| `published` | bewerken, voorbeeld, bekijk op website, link kopiëren, delen via WhatsApp, 30 dagen verlengen, sluiten als vervuld, vacature sluiten (met reden), offline halen, uitlichten of niet meer uitlichten, spoed aan of uit, dupliceren, bekijk sollicitaties |
| `closed` | bewerken, voorbeeld, bekijk op website (zolang de publieke pagina bestaat), heropenen, archiveren, dupliceren, bekijk sollicitaties |
| `archived` | voorbeeld, terugzetten als concept, dupliceren, bekijk sollicitaties |

| Actie | Invoer (zod) | Mutatie | Revalidatie (spec 10) |
|---|---|---|---|
| `saveVacancy` | `FormData` met de velden van §4.7, `id?`, `updated_at?`, `intent` | Conflictcontrole: is `updated_at` in de database nieuwer dan het verborgen veld, dan `conflict`. `rpc("save_vacancy", { p_id, p_vacancy, p_nl })` met alle bewerkbare kolommen; `image_path` en `publish_at` uit de database ongewijzigd meegeven, bij status `closed` ook `closes_at` (§4.7), en zolang `isClaimConfirmed("certificateSupport")` onwaar is ook `training_offered` (het veld uit het formulier wordt dan genegeerd, §4.7). Is de status vóór de actie niet `draft`, dan behandelt de actie `intent = publish` als `save`. Bij `intent = publish`: daarna `vacancy_publish_errors`; leeg, dan `update status = 'published'`, anders `niet_publiceerbaar` met veldfouten (de vacature blijft opgeslagen als concept). Nieuw: `redirect(vacancy(nr) + "?melding=opgeslagen")` | `visibility` als `intent = publish` vanuit `draft`, of als `vacancy_slug` uit `save_vacancy` afwijkt van de slug vóór het opslaan en `publicState` (uit `getVacancyForEdit`) open of closed is; `visibility` ook als `closes_at` verandert terwijl `publicState` vóór de actie `closed` is; anders `content` als `publicState` open of closed is; anders geen revalidatie (B-35) |
| `publishVacancy` | `{ id }` | eerst `vacancy_publish_errors`; leeg, dan `status = 'published'` | `visibility` |
| `scheduleVacancy` | `{ id, publishAt: string (datetime-local), closesOn?: string (datum) }` | `publishAt` minimaal 5 minuten in de toekomst; `closesOn`, als die is meegegeven, moet na `publishAt` liggen, anders de veldfout `S.validation.closesBeforePublish`; publicatiefouten vooraf controleren; `status = 'scheduled'`, `publish_at = publishAt` en altijd `closes_at = closesOn ? amsterdamDateEndToIso(closesOn) : publishAt + VACANCY_DEFAULT_CLOSE_DAYS dagen`, zowel vanuit `draft` als vanuit `scheduled`. | eerste inplanning vanuit `draft`: geen (de cron van spec 10 ververst bij online gaan); een gewijzigde inplanning vanuit `scheduled`: `visibility` als `publicState` vóór de actie `open` was, anders geen revalidatie (B-35) |
| `unscheduleVacancy` | `{ id }` | `status = 'draft'` | `visibility` als `publicState` vóór de actie `open` was, anders geen revalidatie (B-35) |
| `takeOfflineVacancy` | `{ id }` | `status = 'draft'` vanuit `published` | `visibility` |
| `closeVacancy` | `{ id, reason: "filled" \| "withdrawn" \| "other" }` | `status = 'closed'`, `close_reason` | `visibility` |
| `reopenVacancy` | `{ id, closesOn: string }` | datum minimaal morgen; `status = 'published'`, `closes_at = amsterdamDateEndToIso(closesOn)` | `visibility` |
| `extendVacancy` | `{ id }` | alleen `published`; `closes_at = max(closes_at, now) + VACANCY_EXTEND_DAYS` | `visibility` als `publicState` vóór de actie `closed` was, anders `content` (B-35) |
| `archiveVacancy` | `{ id }` | vanuit `draft` of `closed`: `status = 'archived'` | `visibility` als de oude status `closed` was |
| `restoreVacancy` | `{ id }` | vanuit `archived`: `status = 'draft'` | geen |
| `duplicateVacancy` | `{ id }` | `rpc("duplicate_vacancy", { p_id })`; `redirect(vacancy(nieuw) + "?melding=gedupliceerd")` | geen |
| `deleteVacancy` | `{ id }` | `withAdmin(..., { ownerOnly: true })`; `delete().eq("id").eq("status", "draft")`; nul rijen betekent dat er sollicitaties zijn of de status anders is: fout met het dialoog Verwijderen niet mogelijk; `redirect(vacancies + "?melding=verwijderd")` | geen |
| `setVacancyFlag` | `{ id, flag: "is_featured" \| "is_urgent", value: boolean }` | update van die kolom | `content` als publiek |

Statusacties schrijven na een gelukte update een activiteit `status_change`
met `entity_type = 'vacancy'` en `payload = { from, to, reason? }`. Bij
`vacancy_invalid_transition` (twee beheerders tegelijk) geeft de actie
`ongeldige_overgang` en ververst ze de pagina.

Acties waarvan de revalidatie van `publicState` afhangt, lezen `publicState`
en de slug vóór de mutatie op dezelfde manier als `getVacancyForEdit` (§5.2).

**Tabel 3: sollicitaties, aanvragen en berichten.**

| Actie (bestand) | Invoer (zod) | Mutatie en tijdlijn |
|---|---|---|
| `setApplicationStatus` (`applications.ts`) | `{ id, status: ApplicationStatus }` | update `status`; de triggers van spec 10 schrijven `status_change` en het logboek |
| `assignApplication` (`applications.ts`) | `{ id, adminId: uuid \| null }` | update `assigned_to`; activiteit `assigned` met `payload = { to: adminId }` |
| `openCv` (`applications.ts`) | `{ applicationId, download: boolean }` | `createCvReadUrl({ supabase: ctx.supabase, applicationId, download })` van spec 10 (schrijft zelf `cv_viewed` en `application.cv_viewed`); geeft `{ url }` terug; doc en docx altijd als download |
| `setStaffRequestStatus` (`staff-requests.ts`) | `{ id, status: StaffRequestStatus }` | update `status`; activiteit `status_change` met `{ from, to }` (geen trigger voor deze tabel) |
| `assignStaffRequest` (`staff-requests.ts`) | `{ id, adminId }` | zoals bij sollicitaties |
| `setMessageStatus` (`messages.ts`) | `{ id, status: MessageStatus }` | update `status` (de trigger zet `handled_at` en `handled_by`); activiteit `status_change` |
| `addNote` (`activities.ts`) | `FormData`: `entityType` (`application` of `staff_request`), `entityId`, `body` (2 tot 4000 tekens) | insert `activities` met `kind = 'note'`; bij een sollicitatie zet de trigger `last_contact_at` en zo nodig `in_progress` |
| `logContactAttempt` (`activities.ts`) | `{ entityType, entityId, channel: "call" \| "whatsapp" \| "email" }` | insert `activities` met `kind` `call`, `whatsapp` of `email_sent`; geen toast; fouten worden alleen gelogd, de link opent altijd |

### 5.4 Logboek en tijdlijn per mutatie

| Gebeurtenis | `audit_log` | `activities` |
|---|---|---|
| insert, update of delete op `vacancies`, `applications`, `staff_requests`, `contact_messages` | trigger `write_audit_log` van spec 10 (`<entiteit>.created`, `.updated`, `.status_changed`, `.deleted`), `actor_type = admin` | zie hieronder |
| Statuswissel vacature | trigger | actie schrijft `status_change` |
| Statuswissel sollicitatie | trigger | trigger `applications_after_status_change` |
| Statuswissel aanvraag of bericht | trigger | actie schrijft `status_change` |
| Toewijzen | trigger (`.updated` met veld `assigned_to`) | actie schrijft `assigned` |
| Notitie, bellen, WhatsApp, e-mailen | geen (de trigger negeert een wijziging van alleen `last_contact_at`) | actie schrijft `note`, `call`, `whatsapp`, `email_sent` |
| Cv bekijken | `application.cv_viewed` via `createCvReadUrl` | `cv_viewed` via `createCvReadUrl` |
| Inloggen, MFA koppelen, wachtwoord wijzigen, uitloggen | `writeAdminAudit`: `admin.signed_in`, `admin.mfa_enrolled`, `admin.password_changed`, `admin.signed_out`, met `actor_type = admin`, `entity_type = 'admin_profile'`, `entity_id = userId` | geen |

`changes` bevat nooit inhoud van persoonsgegevens, alleen veldnamen en
statussen (spec 10). `ip_hash` blijft in fase 1 leeg.

### 5.5 Validatie (zod 4, `app/beheer/_lib/validation/`)

Gedeeld door client (directe feedback) en server (altijd opnieuw). Meldingen
komen uit `S.validation`.

```ts
// common.ts
export const uuid = z.uuid();
export const searchParamsSchema = z.object({ q: z.string().max(80).optional(), pagina: z.coerce.number().int().min(1).catch(1) });
export const noteSchema = z.object({ entityType: z.enum(["application", "staff_request"]), entityId: uuid,
  body: z.string().trim().min(2, S.validation.noteTooShort).max(4000, S.validation.noteTooLong) });

// auth.ts
export const loginSchema = z.object({ email: z.email(S.validation.email).transform((v) => v.trim().toLowerCase()),
  password: z.string().min(1, S.validation.required), volgende: z.string().optional() });
export const otpSchema = z.object({ code: z.string().transform((v) => v.replace(/\s/g, "")).pipe(z.string().regex(/^\d{6}$/, S.validation.otp)) });
export const passwordSchema = z.object({ password: z.string().min(12, S.auth.errors.passwordTooShort).max(72),
  passwordConfirm: z.string() }).refine((v) => v.password === v.passwordConfirm, { path: ["passwordConfirm"], message: S.auth.errors.passwordsDiffer });

// vacancy.ts
export const vacancyDraftSchema: z.ZodType<VacancyFormValues>;   // regels hieronder, alles optioneel behalve occupation_slug en title
export function publishErrorsFromValues(v: VacancyFormValues): PublishErrorCode[]; // dezelfde regels als vacancy_publish_errors, voor directe feedback
export function vacancyWarnings(v: VacancyFormValues): string[];                  // minimumloon en werken op hoogte zonder ervaring, zie hieronder
```

Regels van `vacancyDraftSchema` (gelijk aan de checks van spec 10 §5.3):
`title` 2 tot 80 tekens na trim (hint: hoogstens 60); `occupation_slug` uit
`OCCUPATION_SLUGS`; `city` 2 tot 80; `postal_code` naar hoofdletters en
`^[1-9][0-9]{3} ?[A-Z]{2}$`; `province` uit `PROVINCES`; `location_label` tot
60; `positions_count` 1 tot 99; `summary` tot 200; `intro` tot 1200; `tasks`,
`requirements`, `offer` lege regels weg, hoogstens 10 items van 1 tot 200
tekens; `extra` tot 1200; `seo_title` tot 60; `seo_description` tot 160;
`contract_type` uit `CONTRACT_TYPES`; `hours_min` en `hours_max` 1 tot 60 en
min niet boven max; `salary_min` en `salary_max` met komma of punt, 5 tot 100,
twee decimalen, min niet boven max; `salary_note` tot 200; `shifts` uit
`SHIFTS[].id`; `education_level`, `experience_level` uit hun lijsten;
`experience_months` 1 tot 120; kwalificaties uit `QUALIFICATIONS`, vereist en
pré overlappen niet; `min_age_18` aan vraagt `min_age_reason`; `start_asap`
uit vraagt `start_date`; `workplace_language` leeg of uit
`WORKPLACE_LANGUAGES`; `closes_at` als datum minimaal morgen, alleen bij status
`draft` (of een nieuwe vacature) mag het leeg zijn; bij `scheduled` en
`published` geeft een leeg veld `S.validation.closesRequired` en geldt minimaal
morgen alleen als de ingevulde datum afwijkt van de opgeslagen sluitdatum (een
ongewijzigde sluitdatum geeft geen fout); bij `closed` is `closes_at`
alleen-lezen en geeft `saveVacancy` de waarde uit de database ongewijzigd mee,
net als `publish_at` (heropenen gaat via `reopenVacancy`);
`contact_admin_id` een uuid uit de lijst met actieve beheerders met een telefoonnummer.

Publicatiecodes (`PublishErrorCode` = `title`, `city`, `hours`, `salary`,
`intro`, `tasks`, `requirements`, `offer`, `start`, `contact`, `publish_at`)
komen uit `vacancy_publish_errors` en worden per code een veldfout uit
`S.validation.publish.<code>`. Waarschuwingen (geen blokkade), getoond bij
opslaan en publiceren:

- `salary_min < MINIMUM_WAGE_21_PLUS` uit `lib/data/options.ts` (B-42) geeft
  `S.validation.belowMinimumWage` met het bedrag via `formatEuro` (VR-07 van
  spec 09).
- `experience_level = 'none'`, `min_age_reason = 'work_at_height'` en een lege
  `training_offered` geven `S.validation.noExperienceAtHeight`.

## 6 Tekstelementen

### 6.1 Mechanisme

- Alle beheerteksten staan in `app/beheer/_strings.ts` (00 §4.4 punt 5): alleen
  Nederlands, buiten `messages/` en buiten de spiegelcontrole van
  `npm run check`. `scripts/check-copy.mjs` van spec 03 scant het bestand als
  je-zone (C-01 tot en met C-20).
- Deze spec is de enige bron van de beheerhints; spec 03 §5.3 verwijst hierheen.
- Export: `export const S = { ... } as const;`, `export type BeheerStrings = typeof S;`
  en `export function fill(template: string, values: Record<string, string | number>): string`
  die `{naam}` vervangt. Plaatshouders staan tussen accolades, zodat het
  scanscript de zinnen kan lezen. Spec 14 herexporteert `S` in
  `tests/e2e/helpers/beheer-strings.ts`.
- Datums, tijden en bedragen worden vooraf geformatteerd (`formatDate`,
  `formatEuro`, `formatDateTimeNl`) en als waarde in `fill()` gezet.
- Toon volgens spec 03: je-vorm, "wij" voor Groos, korte volledige zinnen,
  geen uitroeptekens, geen streepjes in zinnen, geen woorden uit lijst A
  ("dashboard" niet als label; de rol `recruiter` heet Medewerker). Knoppen
  hebben hoogstens drie woorden. Mailonderwerpen en WhatsApp-teksten naar
  opdrachtgevers staan zonder voornaamwoord, omdat u-vorm in deze je-zone niet
  mag (C-10).
- Optielabels van de enums volgen spec 10 §6.

### 6.2 Catalogus `app/beheer/_strings.ts`

```ts
export const S = {
  app: {
    name: "Groos Beheer",
    titleTemplate: "%s · Groos Beheer",
    skipLink: "Naar de inhoud",
    loading: "Even geduld, de gegevens worden geladen.",
    viewSite: "Bekijk website",
    signOut: "Uitloggen",
    signOutEverywhere: "Overal uitloggen",
    back: "Terug",
    roleOwner: "Eigenaar",
    roleRecruiter: "Medewerker",
  },
  nav: {
    label: "Hoofdmenu",
    tabBarLabel: "Snelmenu",
    dashboard: "Overzicht",
    vacancies: "Vacatures",
    applications: "Sollicitaties",
    requests: "Aanvragen",
    requestsLong: "Personeelsaanvragen",
    messages: "Berichten",
    more: "Meer",
    newBadge: "{aantal} nieuw",
  },
  common: {
    save: "Opslaan",
    cancel: "Annuleren",
    close: "Sluiten",
    confirm: "Bevestigen",
    edit: "Bewerken",
    delete: "Verwijderen",
    search: "Zoeken",
    filters: "Filters",
    clearFilters: "Filters wissen",
    apply: "Toepassen",
    actions: "Acties",
    previous: "Vorige",
    next: "Volgende",
    pageOf: "Pagina {pagina} van {totaal}",
    viewAll: "Alle {aantal} bekijken",
    yes: "Ja",
    no: "Nee",
    notFilled: "Niet ingevuld",
    nobody: "Niemand",
    me: "Ik",
    assignToMe: "Aan mij toewijzen",
    copied: "Gekopieerd",
    saving: "Bezig met opslaan",
    requiredForPublish: "nodig om te publiceren",
    optional: "optioneel",
  },
  auth: {
    login: {
      title: "Inloggen bij Groos Beheer",
      intro: "Log in met je e-mailadres en wachtwoord. Daarna vragen wij de code uit je authenticator-app.",
      email: "E-mailadres",
      password: "Wachtwoord",
      showPassword: "Wachtwoord tonen",
      hidePassword: "Wachtwoord verbergen",
      submit: "Inloggen",
      forgot: "Wachtwoord vergeten",
    },
    mfa: {
      title: "Bevestig dat jij het bent",
      intro: "Open de authenticator-app op je telefoon. Vul de zes cijfers in die bij Groos Beheer staan.",
      code: "Code uit je authenticator-app",
      codeHint: "De code verandert elke 30 seconden. Plakken mag ook.",
      submit: "Code bevestigen",
      lostPhone: "Ben je je telefoon kwijt? Vraag de technisch beheerder om je koppeling te resetten. Daarna koppel je de app opnieuw.",
      otherAccount: "Ander account",
    },
    enroll: {
      title: "Koppel je authenticator-app",
      intro: "Groos Beheer vraagt bij elke keer inloggen een code uit een app op je telefoon. Zo komt niemand met alleen je wachtwoord bij de gegevens van kandidaten.",
      step1: "Installeer een authenticator-app, zoals Google Authenticator, Microsoft Authenticator of 1Password.",
      step2: "Tik op Koppeling starten en scan de QR-code met die app.",
      step3: "Vul de code van zes cijfers in die de app daarna toont.",
      start: "Koppeling starten",
      qrAlt: "QR-code om Groos Beheer aan je authenticator-app te koppelen",
      manualLabel: "Lukt scannen niet? Vul deze sleutel dan met de hand in de app in.",
      copySecret: "Sleutel kopiëren",
      submit: "Code bevestigen",
      restart: "Opnieuw beginnen",
    },
    forgot: {
      title: "Wachtwoord vergeten",
      intro: "Vul het e-mailadres in waarmee je inlogt. Je krijgt dan een link om een nieuw wachtwoord te kiezen.",
      submit: "Herstelmail sturen",
      sent: "Is dit adres bij Groos Beheer bekend, dan staat er binnen een paar minuten een e-mail in je inbox. De link in die e-mail werkt één keer.",
      backToLogin: "Terug naar inloggen",
    },
    setPassword: {
      title: "Kies een nieuw wachtwoord",
      intro: "Kies een wachtwoord van minimaal 12 tekens dat je nergens anders gebruikt. Een wachtwoordkluis helpt je het te onthouden.",
      password: "Nieuw wachtwoord",
      passwordConfirm: "Herhaal het wachtwoord",
      submit: "Wachtwoord opslaan",
    },
    noAccess: {
      title: "Geen toegang",
      body: "Dit account heeft geen toegang tot Groos Beheer. Neem contact op met een eigenaar als je denkt dat dit niet klopt.",
    },
    notices: {
      uitgelogd: "Je bent uitgelogd.",
      "link-verlopen": "Deze link is verlopen of al gebruikt. Vraag een nieuwe herstelmail aan.",
      "wachtwoord-gewijzigd": "Je nieuwe wachtwoord is opgeslagen. Log opnieuw in.",
      "sessie-verlopen": "Je sessie is verlopen. Log opnieuw in om verder te gaan.",
    },
    errors: {
      invalidCredentials: "Het e-mailadres of het wachtwoord klopt niet. Probeer het opnieuw of stel een nieuw wachtwoord in.",
      invalidCode: "Deze code klopt niet of is verlopen. Open je authenticator-app en vul de nieuwste code in.",
      tooManyAttempts: "Je hebt te vaak geprobeerd in te loggen. Wacht een paar minuten en probeer het daarna opnieuw.",
      deactivated: "Dit account heeft geen toegang meer tot het beheer. Neem contact op met een eigenaar.",
      passwordTooShort: "Kies een wachtwoord van minimaal 12 tekens.",
      passwordsDiffer: "De twee wachtwoorden zijn niet hetzelfde. Typ ze opnieuw.",
      passwordWeak: "Dit wachtwoord is te makkelijk te raden of is eerder gelekt. Kies een ander wachtwoord.",
      passwordSame: "Dit is je huidige wachtwoord. Kies een nieuw wachtwoord.",
      bot: "Onze beveiliging heeft dit verzoek tegengehouden. Probeer het over een paar minuten opnieuw.",
      generic: "Er ging iets mis bij het inloggen. Controleer je internetverbinding en probeer het opnieuw.",
    },
  },
  dashboard: {
    metaTitle: "Overzicht",
    greeting: { morning: "Goedemorgen, {naam}", afternoon: "Goedemiddag, {naam}", evening: "Goedenavond, {naam}" },
    newVacancy: "Nieuwe vacature",
    tiles: {
      applicationsNew: "Nieuwe sollicitaties",
      requestsOpen: "Open aanvragen",
      messagesNew: "Nieuwe berichten",
      vacanciesOnline: "Vacatures online",
      closingSoon: "Sluiten binnen 7 dagen",
    },
    todo: {
      title: "Vandaag te doen",
      staleNew: "Nog niet opgepakt",
      staleNewItem: "{naam} wacht sinds {datum} op een reactie.",
      nearAutoClose: "Bijna automatisch afgesloten",
      nearAutoCloseItem: "{naam} heeft al 8 weken geen contact gehad. Op {datum} sluit Groos Beheer deze sollicitatie automatisch af.",
      requestsNew: "Nieuwe aanvragen",
      requestsNewItem: "{bedrijf} vraagt {aantal} mensen aan.",
      closingSoon: "Sluiten binnenkort",
      closingSoonItem: "{titel} sluit op {datum}.",
      scheduledToday: "Vandaag gepland",
      scheduledTodayItem: "{titel} gaat vandaag om {tijd} online.",
      scheduledInvalidItem: "{titel} staat ingepland, maar er ontbreken nog verplichte velden. Zonder die velden gaat hij niet online.",
      emailFailed: "E-mail niet aangekomen",
      emailFailedItem: "Een e-mail over {referentie} is niet aangekomen. Bel of app de ontvanger.",
    },
    recent: "Recente activiteit",
  },
  activity: {
    note: "{naam} schreef een notitie",
    status_change: "{naam} zette de status op {status}",
    call: "{naam} startte een belactie",
    whatsapp: "{naam} opende WhatsApp",
    email_sent: "{naam} opende een e-mail",
    cv_viewed: "{naam} bekeek het cv",
    assigned: "{naam} wees dit toe aan {toegewezen}",
    consent_recorded: "{naam} legde toestemming vast",
    auto_closed: "Automatisch afgesloten na 12 weken zonder contact",
    system: "Groos Beheer",
    about: "over {onderdeel}",
  },
  vacancies: {
    metaTitle: "Vacatures",
    title: "Vacatures",
    newTitle: "Nieuwe vacature",
    tabs: { online: "Online", gepland: "Gepland", concepten: "Concepten", gesloten: "Gesloten", archief: "Archief", alle: "Alle" },
    tabsLabel: "Vacatures per status",
    searchLabel: "Zoek op titel of vacaturenummer",
    searchPlaceholder: "Bijvoorbeeld glazenwasser of 1042",
    filterOccupation: "Beroep",
    filterContact: "Contactpersoon",
    filterFlag: "Vlag",
    sortLabel: "Sorteren op",
    sort: { bewerkt: "Laatst bewerkt", sluitdatum: "Sluitdatum", nummer: "Vacaturenummer" },
    caption: "Vacatures met status, sluitdatum en aantal sollicitaties",
    columns: {
      title: "Titel", occupation: "Beroep", city: "Plaats", status: "Status", applications: "Sollicitaties",
      onlineSince: "Online sinds", closes: "Sluitdatum", contact: "Contactpersoon", updated: "Laatst bewerkt", actions: "Acties",
    },
    number: "Vacature {nummer}",
    flags: { featured: "Uitgelicht", urgent: "Spoed" },
    form: {
      toc: "Op deze pagina",
      blocks: {
        basis: { title: "Basis", description: "Wat voor werk het is en waar het is." },
        tekst: { title: "Tekst", description: "Deze tekst staat op de vacaturepagina. Schrijf in de je-vorm en houd het kort." },
        voorwaarden: { title: "Arbeidsvoorwaarden", description: "Uren, werktijden en het bruto uurloon." },
        eisen: { title: "Eisen", description: "Noem alleen wat echt nodig is voor het werk." },
        publicatie: { title: "Publicatie", description: "Wie de contactpersoon is en hoe lang de vacature online staat." },
        vindbaarheid: { title: "Vindbaarheid", description: "Dit blok is niet verplicht. Laat het leeg, dan maakt de site titel en omschrijving voor Google zelf." },
      },
      fields: {
        occupation_slug: { label: "Beroep", hint: "Kies het beroep waar deze vacature bij hoort. Dat bepaalt waar de vacature op de site verschijnt." },
        title: { label: "Functietitel", hint: "Schrijf de functie zoals een werkzoekende hem zoekt, bijvoorbeeld Orderpicker vroege dienst. De plaats komt er vanzelf bij." },
        city: { label: "Plaats", hint: "De plaats waar het werk is." },
        postal_code: { label: "Postcode", hint: "Dit veld is niet verplicht. Met een postcode toont Google de vacature op de juiste plek." },
        province: { label: "Provincie", hint: "" },
        location_label: { label: "Locatie zoals bezoekers die zien", hint: "Vul dit alleen in als je liever iets anders toont, zoals Regio Den Haag." },
        positions_count: { label: "Aantal plekken", hint: "Hoeveel mensen zoek je voor deze vacature?" },
        summary: { label: "Korte samenvatting", hint: "Eén zin over het werk, voor de vacaturekaart en Google." },
        intro: { label: "Introductie", hint: "Schrijf twee zinnen: wat je gaat doen en voor wie dit werk past. Noem de opdrachtgever alleen bij naam als die daar toestemming voor gaf." },
        tasks: { label: "Je werkdag", hint: "Eén taak per regel, kort en zonder punt. Minimaal drie taken.", add: "Taak toevoegen" },
        requirements: { label: "Wat je meebrengt", hint: "Noem alleen wat echt nodig is. Een minimumleeftijd mag alleen bij werk op hoogte, bouw en sloop, een heftruck of reachtruck, nachtwerk of gevaarlijke stoffen.", add: "Eis toevoegen" },
        offer: { label: "Wat je van ons krijgt", hint: "Noem het bruto uurloon en wat je verder echt biedt.", add: "Punt toevoegen" },
        removeItem: "Regel {nummer} verwijderen",
        extra: { label: "Extra informatie", hint: "Dit veld is niet verplicht. Vul het alleen in als er iets belangrijks ontbreekt, bijvoorbeeld over de werkplek. Noem de opdrachtgever niet bij naam, maar schrijf bijvoorbeeld een kantoorpand in Rijswijk." },
        contract_type: { label: "Dienstverband", hint: "Bij uitzendwerk kies je Uitzenden." },
        hours_min: { label: "Uren per week, minimaal", hint: "Bij een vast aantal uren vul je twee keer hetzelfde getal in." },
        hours_max: { label: "Uren per week, maximaal", hint: "" },
        shifts: { label: "Werktijden", hint: "Kies alle diensten die voorkomen." },
        salary_min: { label: "Bruto uurloon vanaf", hint: "In euro per uur, bijvoorbeeld 15,50." },
        salary_max: { label: "Bruto uurloon tot", hint: "Bij een vast uurloon vul je twee keer hetzelfde bedrag in." },
        salary_note: { label: "Toelichting bij het loon", hint: "Dit veld is niet verplicht. Noem bijvoorbeeld toeslagen voor avond- en weekendwerk." },
        start_asap: { label: "Per direct beginnen", hint: "Vink dit uit om een startdatum te kiezen." },
        start_date: { label: "Startdatum", hint: "" },
        education_level: { label: "Opleidingsniveau", hint: "Kies Geen opleiding nodig als iedereen kan solliciteren." },
        experience_level: { label: "Ervaring", hint: "Kies Geen ervaring nodig alleen als iemand zonder ervaring het werk veilig kan doen. Bij werken op hoogte mag dat alleen als Groos de training regelt." },
        experience_months: { label: "Hoeveel maanden ervaring?", hint: "" },
        required_qualifications: { label: "Vereist", hint: "Diploma's, certificaten en rijbewijzen die nodig zijn." },
        preferred_qualifications: { label: "Mooi meegenomen", hint: "Dit is niet nodig voor het werk, maar wel een pluspunt." },
        training_offered: { label: "Opleiding die Groos regelt", hint: "Vink alleen aan wat Groos voor deze vacature echt regelt." },
        min_age_18: { label: "Minimumleeftijd 18 jaar", hint: "Alleen bij een reden voor veiligheid: werken op hoogte, bouw en sloop, heftruck of reachtruck, nachtwerk of gevaarlijke stoffen." },
        min_age_reason: { label: "Reden voor de minimumleeftijd", hint: "Deze reden staat bij de vacature." },
        workplace_language: { label: "Taal op het werk", hint: "Dit veld is niet verplicht. Kies de taal die je op de werkplek nodig hebt." },
        contact_admin_id: { label: "Contactpersoon", hint: "Naam, telefoonnummer en WhatsApp van deze persoon staan bij de vacature." },
        closes_at: { label: "Sluitdatum", hint: "Bij een concept mag je dit leeg laten; de vacature sluit dan 45 dagen na het publiceren. Na deze datum gaat de vacature automatisch offline." },
        publish_at: { label: "Online vanaf", hint: "" },
        is_featured: { label: "Uitlichten", hint: "Uitgelichte vacatures staan bovenaan de lijst en op de homepage." },
        is_urgent: { label: "Spoed", hint: "Toont het label Spoed. Gebruik dit alleen als je echt snel iemand nodig hebt." },
        allow_whatsapp_apply: { label: "Solliciteren via WhatsApp", hint: "Toont een knop waarmee kandidaten de contactpersoon direct een bericht sturen." },
        seo_title: { label: "Titel in Google", hint: "Optioneel, hoogstens 45 tekens; de site zet de merknaam erachter." },
        seo_description: { label: "Omschrijving in Google", hint: "Optioneel, hoogstens 160 tekens." },
      },
      saveDraft: "Opslaan als concept",
      save: "Opslaan",
      publish: "Publiceren",
      publishNow: "Nu publiceren",
      publishChanges: "Wijzigingen publiceren",
      preview: "Voorbeeld bekijken",
      checklistTitle: "Nog nodig om te publiceren",
      warningsTitle: "Controleer dit even",
      history: "Geschiedenis",
      lastEdited: "Laatst bewerkt op {datum} door {naam}",
    },
    actions: {
      menu: "Acties voor {titel}",
      edit: "Bewerken",
      preview: "Voorbeeld bekijken",
      viewOnSite: "Bekijk op website",
      duplicate: "Dupliceren",
      publish: "Publiceren",
      publishNow: "Nu publiceren",
      schedule: "Inplannen",
      reschedule: "Inplanning wijzigen",
      unschedule: "Inplanning annuleren",
      takeOffline: "Offline halen",
      extend: "30 dagen verlengen",
      closeFilled: "Sluiten als vervuld",
      close: "Vacature sluiten",
      reopen: "Heropenen",
      archive: "Archiveren",
      restore: "Terugzetten als concept",
      delete: "Verwijderen",
      copyLink: "Link kopiëren",
      shareWhatsapp: "Delen via WhatsApp",
      shareWhatsappText: "{titel} in {plaats}, bekijk de vacature: {link}",
      viewApplications: "Bekijk sollicitaties",
      feature: "Uitlichten",
      unfeature: "Niet uitlichten",
      urgentOn: "Spoed aanzetten",
      urgentOff: "Spoed uitzetten",
    },
    preview: {
      metaTitle: "Voorbeeld van {titel}",
      bar: "Dit is een voorbeeld. Zo ziet de vacature eruit op de website.",
      barDraft: "Dit is een voorbeeld. Deze vacature staat nog niet online.",
      back: "Terug naar bewerken",
    },
  },
  applications: {
    metaTitle: "Sollicitaties",
    title: "Sollicitaties",
    tabs: { open: "Open", nieuw: "Nieuw", in_behandeling: "In behandeling", uitgenodigd: "Uitgenodigd", geplaatst: "Geplaatst", afgewezen: "Afgewezen", ingetrokken: "Ingetrokken", alle: "Alle" },
    tabsLabel: "Sollicitaties per status",
    searchLabel: "Zoek op naam, telefoon, e-mail of referentie",
    searchPlaceholder: "Bijvoorbeeld Jansen of 06 12 34 56 78",
    filterVacancy: "Vacature",
    filterRegistration: "Inschrijving zonder vacature",
    filterOccupation: "Beroep",
    filterCv: "Cv",
    cvWith: "Met cv",
    cvWithout: "Zonder cv",
    filterPeriod: "Periode",
    period: { "7": "Laatste 7 dagen", "30": "Laatste 30 dagen", "90": "Laatste 90 dagen" },
    filterAssigned: "Toegewezen aan",
    caption: "Sollicitaties met vacature, status en bewaartermijn",
    columns: {
      name: "Naam", vacancy: "Vacature", city: "Woonplaats", phone: "Telefoon", received: "Ontvangen",
      status: "Status", cv: "Cv", assigned: "Toegewezen aan", retainUntil: "Bewaard tot",
    },
    registration: "Inschrijving",
    hasCv: "Cv aanwezig",
    noCv: "Geen cv",
    detail: {
      metaTitle: "Sollicitatie van {naam}",
      title: "Sollicitatie van {naam}",
      reference: "Referentie {referentie}",
      received: "Ontvangen op {datum}",
      source: "Binnengekomen via {bron}",
      contact: "Contact",
      phone: "Telefoon",
      email: "E-mailadres",
      city: "Woonplaats",
      details: "Gegevens",
      mayWork: "Mag in Nederland werken",
      availableFrom: "Beschikbaar vanaf",
      drivingLicense: "Rijbewijs B",
      occupations: "Interesse in",
      message: "Bericht van de kandidaat",
      language: "Taal van het formulier",
      consent: "Toestemming om een jaar te bewaren (talentpool)",
      consentGiven: "Ja, gegeven op {datum}",
      cv: "Cv",
      statusAndAssign: "Status en toewijzing",
      timeline: "Tijdlijn",
      others: "Andere sollicitaties van deze persoon",
      retention: "Groos Beheer bewaart deze gegevens tot {datum} en verwijdert ze daarna automatisch.",
      whatsappText: "Hoi {voornaam}, je spreekt met {beheerder} van Groos Personeelsdiensten. Je hebt gesolliciteerd op {vacature}. Heb je even tijd om te bellen?",
      whatsappTextRegistration: "Hoi {voornaam}, je spreekt met {beheerder} van Groos Personeelsdiensten. Je hebt je bij ons ingeschreven. Heb je even tijd om te bellen?",
      mailSubject: "Je sollicitatie bij Groos Personeelsdiensten",
      mailSubjectRegistration: "Je inschrijving bij Groos Personeelsdiensten",
    },
    cv: {
      view: "Cv bekijken",
      download: "Cv downloaden",
      meta: "{bestand}, {grootte}",
      opening: "Het cv wordt geopend",
    },
  },
  requests: {
    metaTitle: "Personeelsaanvragen",
    title: "Personeelsaanvragen",
    tabs: { open: "Open", nieuw: "Nieuw", in_behandeling: "In behandeling", offerte: "Offerte verstuurd", gestart: "Gestart", afgerond: "Afgerond", geannuleerd: "Geannuleerd", alle: "Alle" },
    tabsLabel: "Aanvragen per status",
    searchLabel: "Zoek op bedrijf, naam, telefoon of referentie",
    searchPlaceholder: "Bijvoorbeeld Testbedrijf",
    caption: "Personeelsaanvragen met gevraagde beroepen en status",
    columns: {
      company: "Bedrijf", contact: "Contactpersoon", requested: "Gevraagd", headcount: "Aantal", start: "Start",
      workCity: "Werkplaats", received: "Ontvangen", status: "Status", assigned: "Toegewezen aan",
    },
    other: "Anders: {tekst}",
    asap: "Zo snel mogelijk",
    detail: {
      metaTitle: "Aanvraag van {bedrijf}",
      title: "Aanvraag van {bedrijf}",
      request: "Aanvraag",
      occupations: "Gevraagde beroepen",
      headcount: "Aantal mensen",
      start: "Start",
      duration: "Duur",
      hours: "Uren per week",
      workCity: "Werkplaats",
      kvk: "KvK-nummer",
      description: "Toelichting",
      createVacancy: "Vacature maken",
      whatsappText: "Goedendag {naam}, met {beheerder} van Groos Personeelsdiensten over de personeelsaanvraag {referentie}.",
      mailSubject: "Personeelsaanvraag {referentie} bij Groos Personeelsdiensten",
    },
  },
  messages: {
    metaTitle: "Berichten",
    title: "Berichten",
    tabs: { nieuw: "Nieuw", beantwoord: "Beantwoord", gearchiveerd: "Gearchiveerd", spam: "Spam", alle: "Alle" },
    tabsLabel: "Berichten per status",
    searchLabel: "Zoek op naam, e-mail of telefoon",
    filterTopic: "Onderwerp",
    caption: "Berichten via het contactformulier",
    columns: { name: "Naam", topic: "Onderwerp", reachable: "Bereikbaar via", received: "Ontvangen", status: "Status" },
    detail: {
      metaTitle: "Bericht van {naam}",
      title: "Bericht van {naam}",
      callback: "Deze persoon wil graag teruggebeld worden.",
      markAnswered: "Markeren als beantwoord",
      archive: "Archiveren",
      markSpam: "Markeren als spam",
      markNew: "Terugzetten als nieuw",
      reply: "Beantwoorden",
      mailSubject: "Je bericht aan Groos Personeelsdiensten",
      whatsappText: "Goedendag {naam}, met {beheerder} van Groos Personeelsdiensten over het bericht via de website.",
    },
  },
  contact: {
    call: "Bellen",
    whatsapp: "WhatsApp",
    email: "E-mailen",
    status: "Status",
    callAria: "Bel {naam} op {telefoon}",
    whatsappAria: "Stuur {naam} een WhatsApp-bericht",
    emailAria: "Mail {naam}",
  },
  notes: {
    label: "Nieuwe notitie",
    hint: "Schrijf op wat je hebt besproken en wat de volgende stap is.",
    submit: "Notitie toevoegen",
  },
  assign: { label: "Toegewezen aan", submit: "Toewijzen" },
  statusForm: { label: "Status", submit: "Status opslaan" },
  status: {
    vacancy: {
      draft: "Concept", scheduled: "Gepland", published: "Online", expired: "Verlopen", filled: "Vervuld",
      withdrawn: "Ingetrokken", closed_other: "Gesloten", archived: "Gearchiveerd",
    },
    application: { new: "Nieuw", in_progress: "In behandeling", invited: "Uitgenodigd", placed: "Geplaatst", rejected: "Afgewezen", withdrawn: "Ingetrokken" },
    staffRequest: { new: "Nieuw", in_progress: "In behandeling", quote_sent: "Offerte verstuurd", started: "Gestart", completed: "Afgerond", cancelled: "Geannuleerd" },
    message: { new: "Nieuw", answered: "Beantwoord", archived: "Gearchiveerd", spam: "Spam" },
  },
  options: {
    closeReason: { filled: "Vervuld", expired: "Verlopen", withdrawn: "Ingetrokken", other: "Anders" },
    contractType: { temp_agency: "Uitzenden", secondment: "Detachering", recruitment: "In dienst bij de opdrachtgever" },
    shift: { early: "Vroege dienst", day: "Dagdienst", evening: "Avonddienst", night: "Nachtdienst", weekend: "Weekend" },
    education: { none: "Geen opleiding nodig", vmbo: "Vmbo", mbo1: "Mbo 1", mbo2: "Mbo 2", mbo3: "Mbo 3", mbo4: "Mbo 4", havo_vwo: "Havo of vwo", hbo: "Hbo", wo: "Wo" },
    experience: { none: "Geen ervaring nodig", nice_to_have: "Ervaring is mooi meegenomen", required: "Ervaring nodig" },
    qualification: {
      vca_basis: "VCA Basis", vca_vol: "VCA VOL", heftruck: "Heftruckcertificaat", reachtruck: "Reachtruckcertificaat",
      ept: "EPT-certificaat", ipaf: "IPAF (hoogwerker)", vog: "VOG", rijbewijs_b: "Rijbewijs B", rijbewijs_be: "Rijbewijs BE",
      rijbewijs_c: "Rijbewijs C", code_95: "Code 95", ras: "RAS-vakopleiding",
    },
    minAgeReason: {
      work_at_height: "Werken op hoogte", construction_demolition: "Werk op een bouw- of sloopplaats",
      forklift: "Rijden met een heftruck of reachtruck", night_work: "Nachtwerk", hazardous_substances: "Werken met gevaarlijke stoffen",
    },
    duration: { one_day: "Eén dag", days: "Enkele dagen", weeks: "Enkele weken", months: "Enkele maanden", indefinite: "Langdurig", unknown: "Weet ik nog niet" },
    topic: { job_seeker: "Zoekt werk", employer: "Zoekt personeel", callback: "Bel mij terug", other: "Iets anders" },
    source: { website: "Website", whatsapp: "WhatsApp", phone: "Telefoon", walk_in: "Langsgekomen", email: "E-mail", referral: "Via via", job_board: "Vacaturesite", other: "Anders" },
    locale: { nl: "Nederlands", en: "Engels" },
    workplaceLanguage: { nl: "Nederlands", en: "Engels", nl_or_en: "Nederlands of Engels" },
  },
  empty: {
    dashboard: "Er staat vandaag niets open. Nieuwe sollicitaties en aanvragen verschijnen hier automatisch.",
    vacanciesNone: "Je hebt nog geen vacatures. Maak je eerste vacature aan, dan staat hij na het publiceren direct op de website.",
    vacanciesFiltered: "Er zijn geen vacatures die bij deze filters passen. Pas de filters aan of wis ze om alles te zien.",
    vacanciesScheduled: "Er staan geen vacatures ingepland. Kies bij een concept voor Inplannen om hem later automatisch online te zetten.",
    applicationsNone: "Er zijn nog geen sollicitaties binnengekomen. Zodra iemand solliciteert, zie je dat hier en krijg je een e-mail.",
    applicationsNew: "Alle nieuwe sollicitaties zijn opgepakt. Er ligt op dit moment niets op je te wachten.",
    requestsNone: "Aanvragen die opdrachtgevers via de website versturen, komen hier binnen.",
    messagesNone: "Er zijn geen nieuwe berichten. Berichten via het contactformulier verschijnen hier.",
    timeline: "Er zijn nog geen notities. Schrijf hier op wat je hebt besproken, zodat je collega weet hoe het ervoor staat.",
    search: "Niets gevonden voor {zoekterm}. Controleer de spelling of zoek op een telefoonnummer of e-mailadres.",
    others: "Deze persoon heeft niet eerder bij ons gesolliciteerd.",
    noCv: "Er is geen cv meegestuurd. Bel of app de kandidaat om de werkervaring door te nemen.",
    history: "Er is nog niets gebeurd met deze vacature.",
  },
  dialogs: {
    publish: { title: "Vacature publiceren?", body: "De vacature komt direct op de website en is daarna ook te vinden in Google.", confirm: "Publiceren" },
    schedule: { title: "Vacature inplannen?", body: "Kies wanneer de vacature online komt. Tot dat moment kun je hem nog aanpassen.", confirm: "Inplannen", publishAt: "Online vanaf", closesOn: "Sluitdatum" },
    unschedule: { title: "Inplanning annuleren?", body: "De vacature wordt weer een concept en komt niet automatisch online.", confirm: "Inplanning annuleren" },
    takeOffline: { title: "Vacature offline halen?", body: "De vacature verdwijnt van de website en wordt weer een concept. Sollicitaties die al binnen zijn, blijven bewaard.", confirm: "Offline halen" },
    closeFilled: { title: "Vacature sluiten als vervuld?", body: "De vacature verdwijnt uit het overzicht en uit Google. Wie de oude link opent, ziet dat de vacature is vervuld.", openApplications: "Er staan nog {aantal} sollicitaties open. Die rond je zelf af.", confirm: "Sluiten als vervuld" },
    close: { title: "Vacature sluiten?", body: "Kies waarom de vacature sluit. Wie de oude link opent, ziet 30 dagen lang dat de vacature gesloten is.", reason: "Reden", confirm: "Vacature sluiten" },
    reopen: { title: "Vacature heropenen?", body: "Kies een nieuwe sluitdatum. De vacature staat daarna direct weer op de website.", closesOn: "Nieuwe sluitdatum", confirm: "Heropenen" },
    extend: { title: "Vacature verlengen?", body: "De sluitdatum schuift 30 dagen op, naar {datum}.", confirm: "30 dagen verlengen" },
    archive: { title: "Vacature archiveren?", body: "De vacature verdwijnt uit je overzicht en is niet meer te vinden op de website. Je kunt hem later terugzetten als concept.", confirm: "Archiveren" },
    delete: { title: "Concept verwijderen?", body: "Dit concept wordt definitief verwijderd. Dat kun je niet ongedaan maken.", confirm: "Verwijderen" },
    deleteBlocked: { title: "Verwijderen kan niet", body: "Op deze vacature zijn sollicitaties binnengekomen. Archiveer de vacature, dan blijft de koppeling met de sollicitaties bewaard.", confirm: "Archiveren" },
    finalStatus: { title: "Sollicitatie afronden?", body: "Na het opslaan start de bewaartermijn. Zonder toestemming verwijdert Groos Beheer de gegevens over 4 weken automatisch.", confirm: "Status opslaan" },
    spam: { title: "Markeren als spam?", body: "Het bericht verdwijnt uit je overzicht en wordt na 30 dagen automatisch verwijderd.", confirm: "Markeren als spam" },
    unsaved: { title: "Wijzigingen niet opgeslagen", body: "Je hebt wijzigingen die nog niet zijn opgeslagen. Wil je deze pagina verlaten zonder op te slaan?", confirm: "Pagina verlaten", cancel: "Blijven" },
    signOutEverywhere: { title: "Overal uitloggen?", body: "Je wordt op alle apparaten uitgelogd, ook op dit apparaat. Daarna log je opnieuw in met je wachtwoord en je code.", confirm: "Overal uitloggen" },
  },
  toasts: {
    welkom: "Je authenticator-app is gekoppeld. Welkom bij Groos Beheer.",
    wachtwoord: "Je nieuwe wachtwoord is opgeslagen.",
    opgeslagen: "De vacature is opgeslagen als concept.",
    saved: "Je wijzigingen zijn opgeslagen.",
    published: "De vacature is gepubliceerd en staat nu op de website.",
    changesPublished: "Je wijzigingen staan nu op de website.",
    savedNotPublished: "De vacature is opgeslagen, maar nog niet gepubliceerd. Vul eerst de velden in die nog ontbreken.",
    scheduled: "De vacature is ingepland en verschijnt op {datum} om {tijd}.",
    unscheduled: "De inplanning is geannuleerd. De vacature is weer een concept.",
    offline: "De vacature is offline gehaald en staat weer klaar als concept.",
    filled: "De vacature is gesloten als vervuld.",
    closed: "De vacature is gesloten.",
    reopened: "De vacature staat weer online tot {datum}.",
    extended: "De sluitdatum is verlengd tot {datum}.",
    archived: "De vacature is gearchiveerd.",
    restored: "De vacature is teruggezet als concept.",
    gedupliceerd: "Er is een kopie gemaakt. Je bewerkt nu de kopie, die nog niet online staat.",
    verwijderd: "Het concept is verwijderd.",
    featured: "De vacature is uitgelicht.",
    unfeatured: "De vacature is niet meer uitgelicht.",
    urgentOn: "Het label Spoed staat aan.",
    urgentOff: "Het label Spoed staat uit.",
    linkCopied: "De link naar de vacature is gekopieerd.",
    statusChanged: "De status is gewijzigd naar {status}.",
    assigned: "Dit is nu toegewezen aan {naam}.",
    unassigned: "Niemand is nu toegewezen.",
    noteAdded: "Je notitie is toegevoegd.",
  },
  errors: {
    sessie_verlopen: "Je sessie is verlopen. Log opnieuw in om verder te gaan.",
    mfa_vereist: "Bevestig eerst je code uit de authenticator-app.",
    geen_toegang: "Dit account heeft geen toegang meer tot het beheer. Neem contact op met een eigenaar.",
    geen_rechten: "Je hebt geen rechten voor deze actie. Vraag een eigenaar om hulp.",
    ongeldig: "Niet alle velden zijn goed ingevuld. Bekijk de meldingen bij de velden.",
    niet_publiceerbaar: "De vacature is nog niet compleet. Vul de velden in die hieronder staan.",
    ongeldige_overgang: "Deze actie kan niet meer, omdat de status intussen is veranderd. De pagina is ververst.",
    niet_gevonden: "Dit onderdeel bestaat niet meer.",
    conflict: "Iemand anders heeft deze vacature intussen aangepast. Laad de pagina opnieuw en voer je wijziging nog een keer in.",
    bot: "Onze beveiliging heeft dit verzoek tegengehouden. Probeer het over een paar minuten opnieuw.",
    onbekend: "Er ging iets mis bij het opslaan. Controleer je internetverbinding en probeer het opnieuw.",
    cvFailed: "Het cv kon niet worden geopend. Probeer het opnieuw.",
    errorSummaryOne: "Eén veld is niet goed ingevuld.",
    errorSummaryMany: "Er zijn {aantal} velden niet goed ingevuld.",
  },
  validation: {
    required: "Dit veld is verplicht.",
    email: "Vul een geldig e-mailadres in, zoals naam@voorbeeld.nl.",
    otp: "Vul de zes cijfers uit je authenticator-app in.",
    titleMissing: "Vul een functietitel in.",
    titleTooLong: "Een functietitel mag hoogstens 80 tekens lang zijn. Houd hem kort, dan blijft hij leesbaar in Google.",
    occupationMissing: "Kies het beroep waar deze vacature bij hoort.",
    cityMissing: "Vul de plaats in waar het werk is.",
    postalCode: "Vul een postcode in zoals 2553 ER.",
    tooLong: "Dit veld mag hoogstens {aantal} tekens hebben.",
    listTooLong: "Een lijst mag hoogstens 10 regels hebben.",
    itemTooLong: "Een regel mag hoogstens 200 tekens hebben.",
    hoursRange: "Vul een aantal uren tussen 1 en 60 in.",
    hoursOrder: "Het minimum aantal uren is hoger dan het maximum. Controleer de uren per week.",
    salaryRange: "Vul een bruto uurloon tussen € 5,00 en € 100,00 in.",
    salaryOrder: "Het minimale uurloon is hoger dan het maximale. Controleer de bedragen.",
    positions: "Vul een aantal plekken tussen 1 en 99 in.",
    experienceMonths: "Vul een aantal maanden tussen 1 en 120 in.",
    qualificationsOverlap: "Een kwalificatie kan niet tegelijk vereist en een pré zijn.",
    minAgeReason: "Kies de reden voor de minimumleeftijd.",
    startDate: "Kies een startdatum of vink Per direct beginnen aan.",
    closesInPast: "De sluitdatum ligt in het verleden. Kies een datum na vandaag.",
    closesRequired: "Kies een sluitdatum. Bij een geplande, online of gesloten vacature kan dit veld niet leeg zijn.",
    closesBeforePublish: "De sluitdatum moet na het moment van publiceren liggen.",
    publishInPast: "Kies een moment in de toekomst om de vacature in te plannen.",
    contact: "Kies een contactpersoon.",
    noteTooShort: "Schrijf minimaal twee tekens.",
    noteTooLong: "Een notitie mag hoogstens 4000 tekens hebben.",
    belowMinimumWage: "Dit uurloon ligt onder het wettelijk minimumloon van {bedrag} per uur voor 21 jaar en ouder. Controleer het bedrag voordat je publiceert.",
    noExperienceAtHeight: "Bij werken op hoogte zet je Geen ervaring nodig alleen als Groos de training regelt. Kies anders Ervaring is mooi meegenomen of Ervaring nodig.",
    publish: {
      title: "Vul een functietitel in.",
      city: "Vul de plaats in waar het werk is.",
      hours: "Vul de uren per week in, minimaal en maximaal.",
      salary: "Vul het bruto uurloon in, vanaf en tot.",
      intro: "Schrijf een introductie van minimaal twee korte zinnen.",
      tasks: "Voeg minimaal drie taken toe bij Je werkdag.",
      requirements: "Voeg minimaal één eis toe bij Wat je meebrengt.",
      offer: "Voeg minimaal één punt toe bij Wat je van ons krijgt.",
      start: "Kies een startdatum of vink Per direct beginnen aan.",
      contact: "Kies een contactpersoon met een telefoonnummer.",
      publish_at: "Kies een moment in de toekomst om de vacature in te plannen.",
    },
  },
  notFound: { metaTitle: "Pagina niet gevonden", title: "Deze pagina bestaat niet", body: "De link klopt niet of het onderdeel is verwijderd.", home: "Naar het overzicht" },
  error: { metaTitle: "Er ging iets mis", title: "Er ging iets mis", body: "Deze pagina kon niet worden geladen. Probeer het opnieuw of ga terug naar het overzicht.", retry: "Opnieuw proberen", home: "Naar het overzicht", code: "Foutcode {code}" },
  more: { title: "Meer", metaTitle: "Meer" },
} as const;
```

`fill()` kent geen meervoudsvormen; waar een aantal de zin verandert, staan twee
waarden (`errorSummaryOne` en `errorSummaryMany`). Teksten zonder hint (`""`)
tonen geen hintregel.

### 6.3 Vaste teksten buiten `_strings.ts`

Geen. Ook `title` in metadata, `aria-label`, `alt` en `placeholder` komen uit `S`
(AC-03-22).

### 6.4 Vertaling van fouten (`mapDbError`)

| Bron | Herkenning | Code en tekst |
|---|---|---|
| Postgres `P0001` | `message` begint met `vacancy_not_publishable:` | `niet_publiceerbaar`, veldfouten per code uit `S.validation.publish` |
| `P0001` | `vacancy_invalid_transition:` | `ongeldige_overgang` |
| `P0001` | `vacancy_not_found` | `niet_gevonden` |
| `P0001` of `42501` | `not_admin`, `permission denied` | `geen_rechten` |
| `23514`, `23503`, `22P02` | check, foreign key, ongeldige invoer | `ongeldig` |
| PostgREST `PGRST116` | geen rij | `niet_gevonden` |
| Auth `invalid_credentials` | | `S.auth.errors.invalidCredentials` |
| Auth `mfa_verification_failed`, `mfa_challenge_expired` | | `S.auth.errors.invalidCode` |
| Auth `over_request_rate_limit`, status 429 | | `S.auth.errors.tooManyAttempts` |
| Auth `weak_password`, `same_password` | | `passwordWeak`, `passwordSame` |
| Auth `session_not_found`, ontbrekende claims | | `sessie_verlopen` |
| Auth `insufficient_aal` | | `mfa_vereist` |
| Overig | | `onbekend`; `console.error` met code, zonder persoonsgegevens |

## 7 SEO

- Het beheer hoort niet in zoekmachines. `metadata.robots` is
  `{ index: false, follow: false, nocache: true }` in de root-layout; de proxy en
  `next.config.mjs` (spec 13) zetten `X-Robots-Tag: noindex, nofollow`;
  `robots.ts` van spec 12 heeft `Disallow: /beheer`.
- Bewust geen `pageMetadata()`: het beheer heeft geen canonical, hreflang,
  Open Graph of Twitter nodig, en een gedeelde link mag geen voorbeeld tonen
  (zie §12). Elke pagina zet alleen `title` via `generateMetadata` of
  `metadata`, met het sjabloon `%s · Groos Beheer`.
- Geen JSON-LD, niet in `sitemap.xml` en niet in `llms.txt`.
- Geen links van de publieke site naar `/beheer`.
- Het beheer beïnvloedt wel publieke SEO: publiceren, sluiten en archiveren
  verversen de vacaturepagina's, de sitemap en de JobPosting-gegevens via
  `revalidateVacancies()` (E-08-10). Gesloten vacatures krijgen daardoor direct
  `noindex` en verliezen hun JobPosting (B-15).

## 8 Toegankelijkheid en performance

**Structuur.** Elke pagina heeft een skiplink, `<header>` (TopBar), `<nav>` met
`aria-label` `S.nav.label` (sidebar) of `S.nav.tabBarLabel` (tabbalk),
`<main id="inhoud">`, precies één h1 (in `PageHeader` of `AuthCard`), h2 per
blok (`SectionCard`, `FormBlock`) en h3 voor kaarttitels in lijsten (B-05).
Tabellen hebben een `TableCaption` (visueel verborgen) en `<th scope="col">`;
de eerste cel van een rij is een link naar het detail.

**Formulieren.** Elk veld heeft een zichtbaar label, hint en fout via
`aria-describedby`, `aria-invalid` bij een fout. Na een mislukte verzending
krijgt `ErrorSummary` de focus. Wachtwoord- en codevelden staan plakken toe
(WCAG 3.3.8); `autocomplete` is `username`, `current-password`,
`new-password` en `one-time-code`. Invoervelden hebben minimaal 16 px tekst,
zodat iOS niet inzoomt.

**Status.** Badges hebben altijd tekst en een stip; kleur is nooit de enige
drager (WCAG 1.4.1). Tellers in de navigatie hebben een tekst voor
schermlezers (`S.nav.newBadge`).

**Bediening.** Tikdoelen minimaal 44 bij 44 px; de tabbalk en actiebalk zijn
64 px hoog plus `env(safe-area-inset-bottom)` en bedekken nooit de focus
(`scroll-padding-bottom` op `html`). Dialogen (Base UI) houden de focus vast,
sluiten met Escape en zetten de focus terug op de knop die ze opende. Toasts
staan in een `aria-live="polite"`-gebied; fouten in een toast hebben ook een
zichtbare melding bij het formulier. Het hele Jimmy-scenario werkt met alleen
het toetsenbord (spec 14 §8.2 stap 7).

**Contrast en beweging.** Alleen tokens van spec 02, contrast minimaal 4,5 tot 1
voor tekst. Overgangen hoogstens 150 ms met `motion-reduce:transition-none`;
geen framer-motion in het beheer.

**Rendering en caching.** Alle beheerpagina's zijn dynamisch, omdat ze cookies
lezen; er is geen `unstable_cache` en geen `revalidate` in `app/beheer`.
Server Components standaard; client alleen voor formulieren, menu's,
dialogen, toasts en de actieve status in de navigatie. Na een mutatie roept de
actie `refresh()` aan of stuurt ze door. Queries per pagina draaien parallel;
lijsten halen hoogstens 25 rijen plus tellers op. De proxy doet geen
databasequery.

**Budget.** First-load JavaScript per beheerroute hoogstens 350 kB gzip
(waarschuwing in spec 14 §8.5); geen nieuwe packages (E-08-17).

**Afbeeldingen.** Alleen de QR-code (data-URI via `next/image` met
`unoptimized`) en het logo (inline SVG van spec 02).

## 9 21st.dev-opdracht voor sub-agents

De bouw-agent van deze spec start in stap 3 van §10 vijf sub-agents, elk met
dezelfde startinstructie:

1. Laad de tools met `ToolSearch` en de query
   `select:mcp__magic__search,mcp__magic__get_inspiration`.
2. Lees deze spec (§4 en §8), de tokens en primitives van spec 02 en
   `app/beheer/_strings.ts` als die al bestaat.
3. Zoek met `mcp__magic__search` (`type: "component"`, `limit: 8`) op elke
   zoekopdracht hieronder en met `mcp__magic__get_inspiration` op de
   inspiratievraag. Bekijk de startkandidaten en voeg betere toe.
4. Roep `get_component` niet aan. Lever een voorstel op; de bouw-agent kiest en
   haalt alleen voor de gekozen kandidaat de code op, per plek hoogstens één keer.

**Selectiecriteria voor elke plek.** Minimaal en rustig; witte achtergrond met
blauw alleen als accent via de tokens van spec 02 (`bg-primary`,
`text-primary`, `ring-ring`, merktokens); shadcn-compatibel en geschikt voor
Tailwind 4; toegankelijk (labels, focus, toetsenbord, geen informatie alleen
in kleur); werkt op 390 px met duimbediening; geen nieuwe dependency (geen
TanStack Table, react-hook-form, framer-motion, input-otp, sonner, vaul,
recharts of Radix); geen gradients, glow, glas of donker thema; past bij een
werkinstrument voor twee drukke mensen: snel, groot en duidelijk.

**Oplevering per sub-agent.** Per plek 2 tot 4 kandidaten met id, naam en
preview-URL, een korte beoordeling op de criteria en een gemotiveerde keuze,
plus de lijst met aanpassingen die de keuze nodig heeft. Is geen kandidaat
goed genoeg, dan schrijft de sub-agent "eigen primitives" met de reden.
Vastleggen in `docs/21st-keuzes.md` onder het kopje "Spec 08".

**Aanpassingsregels voor de gekozen code.** Kleuren alleen via tokens, nooit
hex, hsl of oklch; props, bestandsnamen en ankers uit §4.3 blijven gelijk;
alle tekst uit `S` in `app/beheer/_strings.ts`; server component tenzij er
interactie is; Base UI in plaats van Radix; `next/link` voor interne links;
`motion-reduce:` en hoogstens 150 ms beweging; iconen uit `lucide-react`
0.456 met lijndikte 2.

### SA-08-1 `beheer-shell` (sidebar, topbalk, tabbalk, Meer)

- Zoekopdrachten: "app sidebar navigation with badges", "admin dashboard
  sidebar layout", "mobile bottom navigation tab bar", "bottom tab bar with
  icon and label", "app shell top bar back button".
- Inspiratie: "mobile-first admin app shell with bottom tab bar on phone and
  sidebar on desktop, white background, blue accent, count badges".
- Startkandidaten:

| Id | Naam | Preview |
|---|---|---|
| 31454 | Sidebar (wensity) | https://cdn.21st.dev/wensity/sidebar/default/preview.1790303578745-d63aca4c-6635-4c7d-b8e4-4fa0a2538765.jpg |
| 29334 | Animated Sidebar (starc007) | https://cdn.21st.dev/starc007/animated-sidebar/default/preview.1790065868192-e608260d-b9c7-49c1-94e7-1915131dba73.png |
| 28489 | Sidebar with Search and Profile (uiable) | https://cdn.21st.dev/uiable/sidebar-5/default/preview.1789980815670-87ed3eb9-2efb-43b7-9754-3d5237752e44.png |
| 27897 | Mobile Navigation Tabs (shadcnui-blocks) | https://cdn.21st.dev/user_registry_shadcnui-blocks_1783488755809/tabs-08/default/preview.1789998798545.png |
| 10458 | Bottom Menu (0xUrvish) | https://cdn.21st.dev/user_0xUrvish/bottom-menu/default/preview.1788881378060.webp |

- Let op: de tabbalk toont altijd icoon en label (niet alleen bij het actieve
  item, zoals 8343 Bottom Nav Bar doet); geen promokaart of zoekveld in de
  sidebar; de sidebar klapt in fase 1 niet in.

### SA-08-2 `beheer-lijsten` (tabel, toolbar, tabbladen, kaarten)

- Zoekopdrachten: "data table with filters", "table with search and filter
  dropdown", "responsive table to cards on mobile", "segmented tabs with
  counts".
- Inspiratie: "list screen for job applications: status tabs with counts,
  search, filters in a sheet on mobile, table on desktop and cards on phone".
- Startkandidaten:

| Id | Naam | Preview |
|---|---|---|
| 28327 | Data Table (ephraimduncan) | https://cdn.21st.dev/ephraimduncan/table-05/default/preview.1789963457631-6486542d-c830-47c5-9486-a598097dfc25.png |
| 22162 | Table with Filters (felipemenezes098) | https://cdn.21st.dev/felipemenezes098/table-12/default/preview.1785127196391-7f3872fb-bffb-40da-bd37-3b3d534a3dff.png |

- Let op: deze sub-agent scout geen badges; `StatusBadge` en `FlagBadge`
  gebruiken `Badge` van spec 02 met de tonen uit §4.2. 22162 gebruikt TanStack
  Table; neem alleen de opmaak over. Filteren gebeurt met GET-parameters op de
  server, niet in de browser. De `Table`-primitive komt van spec 02; deze plek
  kiest alleen de compositie van `ResponsiveList`, `ListToolbar` en
  `StatusTabs`.

### SA-08-3 `beheer-formulier` (vacatureformulier in blokken, lijstveld, dialogen)

- Zoekopdrachten: "form layout with sections", "multi section settings form",
  "dynamic list input add remove rows", "confirmation dialog destructive",
  "sticky form footer save buttons".
- Inspiratie: "long admin form split into titled sections with a sticky save
  bar, an add-row list input and a publish checklist, usable on a phone".
- Startkandidaten:

| Id | Naam | Preview |
|---|---|---|
| 4347 | Form Layout (ephraimduncan) | https://cdn.21st.dev/larsen66/form-layout/form-sections-with-checkbox-settings/preview.1753207332517.png |
| 28366 | Settings Sidebar Layout (felipemenezes098) | https://cdn.21st.dev/felipemenezes098/settings-2/default/preview.1789971527030-4019c188-bab1-46e6-a5ef-6c6f9c23724c.png |
| 28358 | Settings Tabbed Sections (felipemenezes098) | https://cdn.21st.dev/felipemenezes098/settings-1/default/preview.1789970677195-07bb0c8b-d49b-436a-bca2-1e5f4e300ad4.png |
| 29793 | Switch List Card (sean0205) | https://cdn.21st.dev/sean0205/c-switch-6/default/preview.1790120328374-afc8f3ad-4620-4004-98e0-51896af46bad.png |

- Let op: blokken staan onder elkaar, niet in tabbladen (op een telefoon
  verlies je anders velden uit het oog); de inhoudsopgave rechts is alleen
  vanaf `lg`. Er is geen `Switch`: aan of uit is een `CheckboxField` van spec
  02, dus van 29793 telt alleen de opmaak van de lijst.

### SA-08-4 `beheer-detail` (overzicht, detailpagina's, tijdlijn, actiebalk)

- Zoekopdrachten: "stat cards KPI tiles minimal", "activity timeline feed",
  "recent activity card", "sticky bottom action bar mobile", "description list
  details card".
- Inspiratie: "detail page for a job application on a phone: contact card with
  call and WhatsApp buttons, status select, notes timeline, sticky bottom
  action bar".
- Startkandidaten:

| Id | Naam | Preview |
|---|---|---|
| 29394 | Activity Feed (felipemenezes098) | https://cdn.21st.dev/felipemenezes098/item-19/default/preview.1790072854725-2c9f1800-eac0-48d4-b0c6-11fb285f0a8a.png |
| 28340 | Activity Timeline (olewandowski1) | https://cdn.21st.dev/user_registry_7ovr_1782691739820/timeline-3/default/preview.1789994227656.png |
| 28295 | Timeline (cubby-ui) | https://cdn.21st.dev/cubby-ui/timeline/default/preview.1789960266184-d8fcdc0d-1c82-48a8-bfde-3572fb88be97.png |
| 4237 | Statistics Card 2 (sean0205) | https://cdn.21st.dev/sean0205/statistics-card-2/default/preview.1753104706690.png |

- Let op: tegels zonder grafieken of trendpijlen (geen recharts, geen
  onbewezen cijfers); de tijdlijn gebruikt `<ol>` en `<time>`.

### SA-08-5 `beheer-inloggen` (inloggen, code, koppelen met QR, wachtwoord)

- Zoekopdrachten: "login form email password minimal", "OTP input two factor
  verification code", "two factor authentication setup QR code", "password
  reset form card".
- Inspiratie: "calm login card for a small business admin, followed by an
  authenticator code step and a QR setup step with numbered instructions".
- Startkandidaten:

| Id | Naam | Preview |
|---|---|---|
| 21494 | Login with Email and Password (ephraimduncan) | https://cdn.21st.dev/ephraimduncan/login-03/default/preview.1784787523413-7054b4a2-ae6b-40a0-861e-f0ae301d5930.png |
| 28353 | Login Card (mohammadshehadeh) | https://cdn.21st.dev/hirael/login-01/default/preview.1789970497450-a11ea0dc-6634-476b-ae59-1e7d97cd2fcc.png |
| 29246 | Two-Factor Authentication Card (diarmuradi) | https://cdn.21st.dev/diarmuradi/two-factor-1/default/preview.1790055921253-c2ac6255-0397-4fd4-9511-64fe1612b7b0.png |
| 28138 | OTP Verification Card (sean0205) | https://cdn.21st.dev/sean0205/otp-verification-card/default/preview.1789956388908-e1f50239-d60b-449c-ac76-d219a08d97ea.png |

- Let op: geen social-loginknoppen, geen "onthoud mij" (de sessie blijft
  standaard), geen knop "code opnieuw sturen" (TOTP heeft dat niet); de code is
  één invoerveld van zes cijfers (`OtpField`), omdat losse vakjes slechter
  werken met plakken, wachtwoordmanagers en schermlezers. Een vakjesweergave
  mag alleen als visuele laag boven dat ene veld.

**Terugval.** Valt 21st.dev voor een plek tegen, dan bouwt de bouw-agent die
plek op de primitives van spec 02 en Base UI volgens §4.3, zonder te wachten.

## 10 Bouwopdracht

> **Notitie.** Bouwstap 7 voor deze spec is gecommit (542ded3, gemerged in 30762de). De wijzigingen uit kruiscontrole ronde 2 en 3 voert een nazorg-sub-agent in bouwstap 3b uit (00 §6).

Dit is bouwstap 7 van 00 §6. Voorwaarden: stap 1 (spec 10 en 13: `groos-dev`,
migraties, clients, `lib/data/*`, BotID-helper), stap 2 (spec 02: tokens,
fonts, primitives, logo) en stap 3 (spec 01: proxy, root-layouts, spec 03:
`lib/format.ts`). Branch `bouw/7-beheer` (spec 13).

1. **Lezen.** Spec 00 (§3 en §4), deze spec, spec 10 §4 en §5, spec 01 §4.12 tot
   en met §4.21, spec 13 §4.4 en §10 A7, spec 14 §5.6 en de Next-docs uit de
   kopregel.
2. **Teksten.** Schrijf `app/beheer/_strings.ts` volgens §6.2 met `fill()`.
   Draai `npm run check:copy` (spec 03) en los elke fout in dit bestand op.
3. **Sub-agents.** Start SA-08-1 tot en met SA-08-5 (§9) en werk ondertussen
   door aan stap 4 tot en met 6. Leg elke keuze vast in `docs/21st-keuzes.md`
   onder het kopje "Spec 08".
4. **Hulpcode.** Maak `app/beheer/_lib/{paths,auth,action,proxy,format,status,search}.ts`
   en `_lib/validation/*` volgens §4.2 en §5.5.
5. **Proxy.** Voeg in overleg met de eigenaar van spec 01 de tweede matcher en
   de tak naar `beheerProxy` toe aan `proxy.ts` (§4.13). Controleer met
   `curl -sI http://localhost:3000/beheer` en
   `curl -sI -H "x-vercel-ip-country: DE" http://localhost:3000/beheer` dat
   beide een 307 naar `/beheer/inloggen?volgende=%2Fbeheer` geven, zonder
   `NEXT_LOCALE`. De afspraak staat in B-38.
6. **Root en auth.** Maak `app/beheer/layout.tsx`, `not-found.tsx`,
   `error.tsx`, `[...rest]/page.tsx`, `manifest.webmanifest/route.ts`,
   `icon.tsx`, `auth/bevestigen/route.ts`, de `(auth)`-groep en
   `_actions/auth.ts`. Haal de `beheer.setup.ts` van spec 14 van `test.skip`.
7. **Lokaal inloggen** (eerste keer):
   1. Testbeheerder: alleen via
      `npm run db:admin -- --email <adres> --full-name <naam> --display-name <voornaam> --phone <E.164>`
      (B-39, spec 10), bijvoorbeeld met `--full-name "Jimmy (test)" --display-name Jimmy --phone +31683351985`
      en het adres van Djulan. Noteer het wachtwoord in de kluis.
   2. Seed: `psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/seed.sql`
      (of `execute_sql` via de MCP). De seed vraagt eerst een beheerder.
   3. `npm run dev`, open `http://localhost:3000/beheer`, log in, tik Koppeling
      starten, scan de QR-code, vul de code in. Je komt op het overzicht.
   4. Controle met de MCP: `select factor_type, status from auth.mfa_factors where user_id = (select id from auth.users where email = '<adres>')`
      geeft precies één rij `totp | verified`.
   5. Wachtwoord vergeten lokaal testen kan alleen met een adres dat lid is van
      de Supabase-organisatie of met Resend-SMTP (spec 13 D6). Zet in het
      dashboard van `groos-dev` de templates Invite user en Reset password op
      de links uit §4.5.
   6. Opnieuw beginnen: verwijder de factor in Authentication, Users, en log
      opnieuw in.
8. **Shell en overzicht.** `(app)/layout.tsx`, `loading.tsx`, `page.tsx`,
   `meer/page.tsx`, `_data/{nav,dashboard,activities}.ts`, en de componenten
   `SidebarNav`, `MobileTabBar`, `TopBar`, `PageHeader`, `SectionCard`,
   `StatTile`, `TodoList`, `ActivityFeed`, `FlashToast` (met `ToastProvider`,
   `Toaster` en `useToast` van spec 02), `components/beheer/ui/{dialog,alert-dialog,menu}.tsx`,
   met de keuze van SA-08-1 en SA-08-4.
9. **Lijsten.** `StatusBadge`, `FlagBadge`, `StatusTabs`, `ListToolbar`,
   `ResponsiveList`, `BeheerPagination`, `EmptyState` (keuze SA-08-2), daarna de
   vier lijstpagina's met `_data/{vacancies,applications,staff-requests,messages}.ts`.
10. **Vacatures.** `VacancyForm` met `FormBlock`, `ListField`,
    `PublishChecklist`, `VacancyActions`, `VacancyDialogs`, `PreviewBar` (keuze
    SA-08-3), de pagina's nieuw, bewerken en voorbeeld, en
    `_actions/vacancies.ts` met `revalidateVacancies()` uit
    `lib/data/revalidate.ts`. Test elke overgang uit tabel 2 op de seed.
11. **Sollicitaties, aanvragen, berichten.** Detailpagina's met
    `ContactActions`, `DetailActionBar`, `StatusForm`, `AssignForm`,
    `CvButtons`, `NoteForm`, `DefinitionList`, en `_actions/{applications,staff-requests,messages,activities}.ts`.
    Voor de cv-test: dien via `/vacatures/<slug>` (spec 07) een sollicitatie
    met `tests/e2e/bestanden/cv-test.pdf` in, of upload lokaal met
    `createCvUploadTarget` en `finalizeCvUpload`.
12. **Inloggen afmaken.** Keuze SA-08-5 toepassen op de `(auth)`-pagina's.
13. **Verifiëren.**
    - `npm run verify`, `npm run check -- --warn`, `npm run check:copy`.
    - `grep -rn "\"use server\"" app/beheer/_actions` en controleer dat elke
      export in `vacancies.ts`, `applications.ts`, `staff-requests.ts`,
      `messages.ts` en `activities.ts` begint met `return withAdmin(`.
    - Playwright (spec 14): `beheer/login.spec.ts`, `vacatures.spec.ts`,
      `sollicitaties.spec.ts`, `aanvragen.spec.ts`, `berichten.spec.ts`,
      `mobiel.spec.ts`, `api/beveiliging.spec.ts`, en de beheerschermen in
      `a11y/axe.spec.ts`.
    - Visueel op 390, 768, 1280 en 1440 px: inloggen, koppelen, overzicht,
      vacaturelijst, formulier, sollicitatielijst en detail, aanvraagdetail,
      berichten. Geen horizontale scroll; tabbalk en actiebalk bedekken
      niets.
    - Bundelcontrole `node scripts/check-bundles.mjs --warn` (spec 14).
    - Jimmy-scenario (S-14-07) door Djulan op zijn eigen telefoon via
      `http://<ip van de laptop>:3000/beheer` (tijdelijk de redirect-URL in
      Supabase toevoegen) of op de eerste preview.
14. **Afronden.** Werk de acceptatiematrix van spec 14 bij met AC-08-01 tot en met
    AC-08-42 en open de pull request met het sjabloon van spec 13.

## 11 Acceptatiecriteria

Uitgangspunt: `groos-dev` met de migraties en seed van spec 10, één testbeheerder
met rol `owner` en geverifieerde TOTP, `npm run dev` op `http://localhost:3000`.
De criteria gaan uit van de seedtoestand direct na `npm run db:seed:reset` (B-46).
AC-08-14 tot en met AC-08-23 draaien in tabelvolgorde, zodat de nieuwe vacature
in AC-08-14 nummer 1011 krijgt.

| Id | Criterium | Eis |
|---|---|---|
| AC-08-01 | `curl -sI http://localhost:3000/beheer` geeft 307 met `location: /beheer/inloggen?volgende=%2Fbeheer` en `x-robots-tag: noindex, nofollow`; met `-H "x-vercel-ip-country: DE"` is het resultaat gelijk en staat er geen `set-cookie: NEXT_LOCALE`. `/en/beheer` geeft 404. | E-08-01, E-08-03 |
| AC-08-02 | `/beheer/inloggen` heeft `<html lang="nl">`, `<meta name="robots" content="noindex, nofollow, nocache">`, `<title>Inloggen · Groos Beheer</title>` en `<link rel="manifest" href="/beheer/manifest.webmanifest">`; de pagina bevat geen publieke header, footer of Analytics-script. | E-08-01 |
| AC-08-03 | Zonder cookies geeft `/beheer/manifest.webmanifest` 200 met `content-type` `application/manifest+json`, `start_url` `/beheer`, `scope` `/beheer` (zonder slash, zie §12) en `display` `standalone`; `/beheer/icon/192` en `/beheer/icon/512` geven 200 met `image/png`. | E-08-01 |
| AC-08-04 | Inloggen met een fout wachtwoord toont `S.auth.errors.invalidCredentials` en blijft op `/beheer/inloggen`; de velden hebben `autocomplete` `username` en `current-password`. | E-08-02 |
| AC-08-05 | Met het juiste wachtwoord komt de testbeheerder op `/beheer/mfa`; een foute code toont `S.auth.errors.invalidCode`; de juiste code leidt naar `/beheer` met een h1 die met "Goede" begint. `audit_log` krijgt een regel `admin.signed_in` met `actor_type = 'admin'`. | E-08-02, E-08-14 |
| AC-08-06 | Een gebruiker zonder factor komt na het wachtwoord op `/beheer/mfa/koppelen`; na Koppeling starten staat er een `img` met alt `S.auth.enroll.qrAlt` en de sleutel; na de juiste code heeft `auth.mfa_factors` precies één rij voor die gebruiker met `status = 'verified'`, ook na twee keer Koppeling starten. | E-08-02 |
| AC-08-07 | Met een sessie op `aal1` geeft `curl` met die cookies op `/beheer/vacatures` een 307 naar `/beheer/mfa?volgende=%2Fbeheer%2Fvacatures`; een aanroep van `setApplicationStatus` met die sessie geeft `{ ok: false, code: "mfa_vereist" }` en wijzigt niets. | E-08-02, E-08-03 |
| AC-08-08 | Na `update admin_profiles set is_active = false` voor de testbeheerder komt hij na het wachtwoord op `/beheer/geen-toegang` en ziet hij geen beheerdata; terugzetten op `true` herstelt de toegang. | E-08-03 |
| AC-08-09 | Wachtwoord vergeten met een onbekend adres en met het eigen adres toont dezelfde tekst `S.auth.forgot.sent`. De link uit de mail opent `/beheer/auth/bevestigen`, vraagt de code (`/beheer/mfa?volgende=%2Fbeheer%2Fwachtwoord-instellen`) en daarna een nieuw wachtwoord; daarna werkt alleen het nieuwe wachtwoord. Een tweede klik op dezelfde link leidt naar `/beheer/inloggen?melding=link-verlopen`. | E-08-04 |
| AC-08-10 | Uitloggen leidt naar `/beheer/inloggen?melding=uitgelogd`; de cookies `sb-<ref>-auth-token*` zijn verwijderd; de terugknop naar `/beheer` geeft weer de 307 naar inloggen. Overal uitloggen maakt ook een sessie in een tweede browser ongeldig. | E-08-04 |
| AC-08-11 | Op `/beheer` tonen de tegels na de seed: Nieuwe sollicitaties 2, Open aanvragen 1, Nieuwe berichten 1, Vacatures online 6, Sluiten binnen 7 dagen 0; de badges in de navigatie tonen 2, 1 en 1. | E-08-06, E-08-19 |
| AC-08-12 | `/beheer/vacatures` toont standaard het tabblad Online met 1001 tot en met 1006; de tabbladen tonen Gepland 1, Concepten 1, Gesloten 2, Archief 0, Alle 10; 1007 heeft de badge Vervuld en 1010 Ingetrokken. Na een aanroep van `/api/cron/vacatures` (spec 10) staat 1010 onder Archief (Gesloten 1, Archief 1). | E-08-07, E-08-09 |
| AC-08-13 | `?q=1004` toont alleen 1004; `?q=orderpicker&tab=alle` toont alleen 1003; `?beroep=logistiek-medewerker&tab=alle` toont 1003, 1004 en 1008; een zoekterm zonder resultaat toont `S.empty.search` met die term. | E-08-07 |
| AC-08-14 | Een nieuwe vacature met alleen beroep en titel opslaan als concept leidt naar `/beheer/vacatures/1011` met de toast `S.toasts.opgeslagen`; in de database staat 1011 als `draft` met een `nl`-vertaling, en `audit_log` heeft `vacancy.created` met `actor_type = 'admin'`. | E-08-07, E-08-14 |
| AC-08-15 | Publiceren van 1011 met twee taken en zonder uurloon toont de meldingen `S.validation.publish.tasks` en `.salary` bij die velden en laat de status op `draft`. Na aanvullen staat 1011 op `published` met `closes_at - published_at` van 45 dagen, en staat hij bij de eerstvolgende aanvraag van `/vacatures` in de lijst, zonder herstart of wachttijd. | E-08-08, E-08-10 |
| AC-08-16 | Een uurloon vanaf € 13,50 toont de waarschuwing `S.validation.belowMinimumWage` met € 14,99; publiceren blijft mogelijk. | E-08-08 |
| AC-08-17 | De titel van 1001 wijzigen en Wijzigingen publiceren geeft de toast `S.toasts.changesPublished`; `/vacatures/glazenwasser-den-haag-1001` geeft daarna een 308 naar de nieuwe slug (spec 06). | E-08-07, E-08-10 |
| AC-08-18 | 1009 inplannen voor morgen 07.00 uur zet `status = 'scheduled'` en `publish_at` op dat moment in Amsterdamse tijd (in UTC 05.00 in de zomer, 06.00 in de winter); 1009 staat niet op `/vacatures`; Inplanning annuleren zet hem terug op `draft`. | E-08-07, E-08-09 |
| AC-08-19 | Sluiten als vervuld op 1002 zet `status = 'closed'` en `close_reason = 'filled'`; `activities` heeft een rij `entity_type = 'vacancy'`, `kind = 'status_change'` met `payload` `{"from":"published","to":"closed","reason":"filled"}`; de publieke pagina toont de gesloten melding en `noindex` bij de eerstvolgende aanvraag. | E-08-09, E-08-10, E-08-14 |
| AC-08-20 | 30 dagen verlengen op 1003 verschuift `closes_at` met precies 30 dagen en toont de toast met de nieuwe datum in de notatie "16 december 2026". | E-08-07 |
| AC-08-21 | Archiveren van 1007 zet `status = 'archived'`; `/vacatures/<slug van 1007>` geeft daarna 404. Bij een vacature met status `published` staat Archiveren niet in het menu. | E-08-09, E-08-10 |
| AC-08-22 | Dupliceren van 1005 maakt een concept met titel "Verhuizer (kopie)" en leidt naar de bewerkpagina daarvan met de toast `S.toasts.gedupliceerd`. | E-08-07 |
| AC-08-23 | Verwijderen van die kopie (eigenaar) haalt de rij weg en leidt naar `/beheer/vacatures?melding=verwijderd`; nadat de test met de service-role-client een sollicitatie (`kind = 'vacancy'`) aan concept 1009 koppelt, toont verwijderen van 1009 het dialoog `S.dialogs.deleteBlocked` en blijft de rij bestaan; daarna `npm run db:seed:reset`. | E-08-07 |
| AC-08-24 | `/beheer/vacatures/1009/voorbeeld` toont de tekst `S.vacancies.preview.barDraft` en de titel "Opperman"; zonder sessie geeft dezelfde URL een 307 naar inloggen. | E-08-03, E-08-07 |
| AC-08-25 | `/beheer/sollicitaties` toont op het tabblad Open "Test Kandidaat" (vacature 1001) en "Test Inschrijver" (Inschrijving); `?q=kandidaat` en `?q=0600000001` vinden elk alleen Test Kandidaat. | E-08-11 |
| AC-08-26 | Op het detail van Test Kandidaat heeft Bellen `href="tel:+31600000001"` en WhatsApp een `href` die begint met `https://wa.me/31600000001?text=`. Een klik op Bellen maakt een `activities`-rij met `kind = 'call'` en zet de status van `new` op `in_progress`. | E-08-05, E-08-11 |
| AC-08-27 | Status op Uitgenodigd zetten toont de toast `S.toasts.statusChanged` met "Uitgenodigd"; `activities` heeft `status_change` en `audit_log` heeft `application.status_changed`. Kiezen voor Afgewezen opent eerst `S.dialogs.finalStatus`. | E-08-11, E-08-14 |
| AC-08-28 | Een notitie van één teken geeft `S.validation.noteTooShort`; een geldige notitie staat bovenaan de tijdlijn met de `display_name` van de beheerder en geeft `kind = 'note'`. | E-08-11, E-08-14 |
| AC-08-29 | Voor een sollicitatie met een pdf opent Cv bekijken een signed URL die direct 200 geeft met `content-type: application/pdf` en na 61 seconden een fout; daarna bestaan `audit_log` `application.cv_viewed` en `activities` `cv_viewed`. Zonder cv staat `S.empty.noCv`. | E-08-11 |
| AC-08-30 | `/beheer/aanvragen` toont Testbedrijf B.V. met referentie `P-2026-0001`; status op Offerte verstuurd zetten geeft een `activities`-rij `status_change` en `audit_log` `staff_request.status_changed`; Vacature maken opent `/beheer/vacatures/nieuw?beroep=schoonmaker&plaats=Den%20Haag&uren=24` met die waarden ingevuld. | E-08-12 |
| AC-08-31 | Op het detail van het bericht van Test Bezoeker staat `S.messages.detail.callback` en een Bellen-link; Markeren als beantwoord zet `status = 'answered'`, `handled_by` op de beheerder en `handled_at` gevuld, en het bericht staat niet meer op het tabblad Nieuw. | E-08-13 |
| AC-08-32 | Een POST naar een beheeractie zonder sessiecookies (zelfde `next-action`-id, gekopieerd uit de netwerktab) geeft `code: "sessie_verlopen"` en verandert geen rij. Elke export in de vijf actiebestanden begint met `withAdmin(`. | E-08-03, E-08-14 |
| AC-08-33 | Op 390 px heeft geen beheerpagina horizontale scroll (`document.documentElement.scrollWidth <= 390`); de tabbalk heeft vijf items van minimaal 44 px hoog; op een detailpagina is de tabbalk verborgen en staat de actiebalk met Bellen, WhatsApp, E-mailen en Status onderin. `beheer/mobiel.spec.ts` slaagt. | E-08-05 |
| AC-08-34 | Axe geeft nul bevindingen op inloggen, koppelen, overzicht, vacaturelijst, vacatureformulier (ook met fouten), sollicitatielijst en sollicitatiedetail, op 390 en 1280 px. | E-08-16 |
| AC-08-35 | Inloggen, de code invullen en een status wijzigen lukt met alleen het toetsenbord; de focus is steeds zichtbaar; een dialoog sluit met Escape en zet de focus terug op de knop. | E-08-16 |
| AC-08-36 | `npm run check:copy` meldt geen fout in `app/beheer/_strings.ts`; `grep -rnE ">[A-Z][a-z]+ [a-z]+" components/beheer app/beheer --include=*.tsx` vindt geen zichtbare Nederlandse zin buiten `_strings.ts`. | E-08-15 |
| AC-08-37 | De bundelcontrole van spec 14 meldt voor `/beheer/vacatures/[nummer]` hoogstens 350 kB gzip first-load JavaScript. | E-08-16, E-08-17 |
| AC-08-38 | `git diff main -- package.json` van `bouw/7-beheer` voegt geen dependency toe. | E-08-17 |
| AC-08-39 | Na twee uur zonder activiteit (verlopen access token) laadt `/beheer` zonder opnieuw inloggen en staat er een vernieuwde `sb-<ref>-auth-token`-cookie in de respons; na nog een navigatie blijft de sessie geldig. | E-08-02, E-08-03 |
| AC-08-40 | Met een aal2-sessie geeft `/beheer/bestaat-niet` 404 met `S.notFound.title` binnen de beheerlayout en `x-robots-tag: noindex, nofollow`; zonder sessie geeft dezelfde URL 307 naar `/beheer/inloggen?volgende=%2Fbeheer%2Fbestaat-niet`. | E-08-01 |
| AC-08-41 | `docs/21st-keuzes.md` heeft een sectie "Spec 08" met per plek uit §9 twee tot vier kandidaten, de keuze en de aanpassingen; `get_component` per plek hoogstens één keer. | E-08-18 |
| AC-08-42 | Een vacature met `min_age_18` aan, `min_age_reason = 'work_at_height'`, `experience_level = 'none'` en lege `training_offered` toont bij opslaan en publiceren de waarschuwing `S.validation.noExperienceAtHeight`; publiceren blijft mogelijk. Seedvacature 1001 (`nice_to_have`) toont hem niet. | E-08-08 |

## 12 Open vragen en aannames

| Onderwerp | Aanname in deze spec | Bevestigt | Gevolg als het anders is |
|---|---|---|---|
| Vastgelegd in B-38 | `/beheer` blijft buiten de taalrouting en de geo-redirect, maar gaat wel door `proxy.ts` via een tweede matcher en een vroege tak naar `beheerProxy()` (§4.13). Reden: Server Components kunnen geen ververste sessiecookies schrijven; zonder proxy roteert Supabase het refresh-token zonder dat de browser het nieuwe krijgt, en na de hergebruiktermijn van 10 seconden is de sessie weg. Voor Jimmy en Lorenzo op hun telefoon betekent dat ieder uur opnieuw inloggen. De proxy doet alleen `updateSession()` en optimistische redirects, geen databasequery. | Djulan | Blijft `/beheer` helemaal buiten de proxy, dan komt er in de beheerlayout een client component met `createSupabaseBrowserClient()` dat tokens ververst zolang de app open staat, en vervalt de 307 uit de proxy (de layout stuurt dan door). AC-08-39 wordt dan een handmatige test. |
| Metadata zonder `pageMetadata()` | Het beheer zet alleen `title` en `robots`, zonder canonical, hreflang en Open Graph. `pageMetadata()` is voor publieke pagina's (R-09). | Djulan | Moet het toch via `pageMetadata()`, dan heeft die een optie nodig om alternates en OG uit te zetten (spec 12). |
| Plaats van de zod-schema's | Beheerschema's staan in `app/beheer/_lib/validation/` en niet in `lib/validation/*` (eigendom spec 07 volgens 00 §4.4a). B-36 blijft inhoudelijk gelijk: één gedeeld schema per formulier. | Djulan | Verplaatsen is alleen een importpad. |
| Voorbeeldweergave | `getVacancyPreview()` zet elke vacature (ook een onvolledig concept) om naar een `VacancyDetail` (spec 10) met de regels uit §4.7. Zonder publicatiefouten rendert het voorbeeld het herbruikbare detailcomponent van spec 06 zonder sollicitatieformulier en JSON-LD; met publicatiefouten altijd de `PublishChecklist` en de eenvoudige eigen weergave, omdat het detailcomponent van spec 06 volledige gegevens verwacht. | spec 06 | Exporteert spec 06 geen herbruikbaar detailcomponent, dan toont het voorbeeld altijd de eenvoudige eigen weergave (§4.7). |
| Dienstverband | Alleen Uitzenden tot claim `serviceForms`: het formulier toont bij `contract_type` alleen `temp_agency` zolang `isClaimConfirmed("serviceForms")` uit `lib/claims.ts` (spec 03) onwaar is, daarna alle drie de waarden met Uitzenden als standaard (spec 09 CL-18). Er is geen eigen constante in het beheer. | Jimmy en Lorenzo | Na bevestiging zet spec 03 de claim op waar; het formulier toont dan vanzelf alle drie, zonder codewijziging in het beheer. |
| Opleiding die Groos regelt | Het veld `training_offered` is verborgen tot de claim `certificateSupport` bevestigd is (spec 09 CL-11); daarna verschijnt het met de hint dat het alleen voor echt geregelde opleidingen is. | Jimmy en Lorenzo | Na bevestiging zet spec 03 de claim op waar; het veld verschijnt dan vanzelf, zonder codewijziging in het beheer. |
| Handmatig toevoegen | Sollicitaties of aanvragen die per telefoon of WhatsApp binnenkomen, kunnen in fase 1 niet worden ingevoerd (B-19). De bronnen `whatsapp`, `phone` en `walk_in` blijven ongebruikt. | Jimmy en Lorenzo | Wel in fase 1: één scherm `/beheer/sollicitaties/nieuw` met een actie `createApplicationManual` die met de admin-client schrijft en de velden van B-17 plus bron vraagt; ongeveer een halve dag extra. |
| E-mail vanuit het beheer | E-mailen opent het mailprogramma (`mailto:`) en komt als `email_sent` in de tijdlijn, ook als de beheerder de mail niet verstuurt. Uitnodigings- en afwijzingsmails komen in fase 2 (B-20). | Djulan | Mails in fase 1: spec 11 levert templates 3 en 4 en dit beheer een dialoog met voorbeeld. |
| Uitnodigen van beheerders | Via het Supabase-dashboard (B-19), daarna een profiel met `public.grant_admin(...)` (B-39); op `groos-dev` maakt `npm run db:admin` de testbeheerder aan. De mailtemplate gebruikt de `token_hash`-link uit §4.5. | Djulan, spec 11 en 13 | Standaardtemplate met `{{ .ConfirmationURL }}`: dan werkt de uitnodiging niet met de serverflow en moet de template alsnog worden aangepast. |
| Wachtwoord wijzigen met MFA | Supabase vraagt `aal2` om het wachtwoord van een account met een geverifieerde factor te wijzigen; daarom gaat herstel via de codestap (§4.5). | Djulan (test AC-08-09) | Vraagt Supabase dat niet, dan blijft de omweg onschuldig. |
| Sessieduur | Standaard van Supabase: geen maximale sessieduur, verversen met refresh-tokenrotatie. Jimmy en Lorenzo blijven op hun eigen telefoon ingelogd tot ze uitloggen. | Jimmy en Lorenzo, jurist (spec 09 datalekprocedure) | Kortere sessies: tijdslimiet in Supabase Auth (Pro), geen codewijziging. |
| Telefoon kwijt | In fase 1 verwijdert Djulan de factor in het dashboard (procedure spec 09 §5.6a; bij een gestolen toestel met een actieve sessie ook §5.7). Er is geen herstelcode. | Djulan | Herstelcodes of passkeys in fase 2. |
| Aantal beheerders | Twee eigenaren; de rol `recruiter` heet in de interface Medewerker en mag alles behalve verwijderen en de e-maillog zien (RLS van spec 10). | Jimmy en Lorenzo | Geen. |
| Lokaal testen op een telefoon | Via het IP-adres van de laptop met een extra redirect-URL in `groos-dev`, of op de eerste preview. | Djulan | Geen. |
| Scope van het manifest (afwijking van §4.12, nazorg 3b) | Het manifest heeft `scope: "/beheer"` zonder slash (8e784af). Een scope wordt als padvoorvoegsel vergeleken; met `/beheer/` vallen `start_url` en het overzicht op `/beheer` erbuiten, en `start_url` `/beheer/` helpt niet omdat Next `/beheer/` met een 308 naar `/beheer` stuurt. AC-08-03 toetst daarom `/beheer`; dit gaat voor de waarde `/beheer/` in §4.12. | Djulan | Geen; een scope met slash maakt van het beginschermicoon geen losse app meer. |
| Nieuwe vacature die niet publiceerbaar is (nazorg 3b) | Publiceren van een nieuwe, onvolledige vacature slaat hem op als concept en stuurt door met `?melding=savedNotPublished` (toast `S.toasts.savedNotPublished`) in plaats van `?melding=opgeslagen`, zodat de beheerder ziet dat publiceren niet lukte; de checklist toont daarna wat ontbreekt. | Djulan | Geen; alleen de melding in de URL. |
| Gearchiveerde vacature (nazorg 3b) | `VACANCY_ACTIONS` kent bij `archived` geen bewerken; de bewerkpagina toont het formulier dan alleen-lezen, zonder opslaanknop. Terugzetten als concept maakt het weer bewerkbaar. | Djulan | Geen. |
