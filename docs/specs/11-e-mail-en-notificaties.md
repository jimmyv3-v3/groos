# 11 E-mail en notificaties

| Status | Fase | Hangt af van | Bronnen |
|---|---|---|---|
| concept, ter goedkeuring aan Djulan | 1 | 10 (`email_log`, `admin_profiles`, admin-client), 07 (aanroepen in `app/actions/*`), 01 (`lib/site.ts`, `lib/routes.ts`), 02 (`lib/brand.ts`, `public/brand/logo-email.png`), 03 (toon, `lib/claims.ts`, `lib/format.ts`), 08 (`beheerUrl`, `beheerPaths`, `/beheer/auth/bevestigen`), 09 (ankers privacyverklaring), 13 (env vars, verzenddomein, SMTP, DNS) | context/11 §1.5, §2.4 (`email_log`, `admin_profiles`), §3, §6.1 tot en met §6.6, §7.4, §8.3, §11; context/09 §5, §7 (cv-uploads, toestemmingsvakjes, rechten); 00 §3.2 (B-04, B-07, B-08, B-12, B-17, B-18, B-19, B-20, B-22, B-24, B-26, B-37), 00 §4; spec 13 §5.1, §5.5, §10 A2, A8, D6, D7, E3; `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/after.md`, `.../03-file-conventions/route.md` |

## 1 Doel

Deze module levert alle e-mail van fase 1: per formulier een bevestiging aan
de inzender en een interne melding aan Groos, plus de Nederlandse teksten voor
de Auth-mails van Supabase (uitnodiging, wachtwoord herstellen en de
beveiligingsmeldingen). Alle sitemails gaan via Resend in de EU-regio en zijn
React Email-templates in de merkstijl van spec 02: wit, rustig, tekstgericht,
met een dun blauw accent en altijd een platte-tekstversie. Eén verzendfunctie
in `lib/email/send.ts` regelt de verzending, het verzendverslag in
`email_log` (ontvanger alleen als hash) en het gedrag in ontwikkeling: zonder
`RESEND_API_KEY` verschijnt elke mail in de terminal, met sleutel gaat alles
naar één testadres. Een mislukte mail laat een formulier nooit falen. Zo
werkt de hele formulierketen vanavond op localhost met de database
gekoppeld, en is de productie-instelling alleen nog een kwestie van sleutels
en DNS (spec 13).

## 2 Gebruikers en scenario's

Werkzoekende

1. S-11-01: Een glazenwasser solliciteert op vacature 1001 en vult zijn
   e-mailadres in. Binnen een minuut krijgt hij een Nederlandse bevestiging
   met zijn referentie `S-2026-0001`, de naam en het nummer van de
   contactpersoon en een link naar de privacyverklaring. Zijn bericht en
   zijn cv staan niet in de mail.
2. S-11-02: Een Poolse werkzoekende solliciteert op `/en/vacatures/...`. De
   bevestiging is in het Engels; de titel van de vacature blijft Nederlands
   (B-03).
3. S-11-03: Een werkzoekende schrijft zich in op `/inschrijven` met twee
   beroepen. De bevestiging noemt die beroepen, de toestemming voor een jaar
   bewaren en hoe hij die intrekt.

Werkgever en bezoeker

4. S-11-04: Een facilitair manager vraagt drie schoonmakers aan. Hij krijgt
   een bevestiging in u-vorm met een korte samenvatting van de aanvraag en
   het nummer voor spoed. Antwoordt hij op de mail, dan komt zijn antwoord in
   de mailbox `info@groospersoneelsdiensten.nl`.
5. S-11-05: Een bezoeker vraagt via `/contact` om terug te bellen en laat
   alleen naam en telefoonnummer achter. Er gaat geen bevestiging uit, wel
   een interne melding met het nummer.

Beheerder (Jimmy of Lorenzo)

6. S-11-06: Jimmy krijgt op zijn telefoon de melding "Nieuwe sollicitatie".
   Hij tikt op het telefoonnummer en belt de kandidaat, of tikt op de knop en
   komt na inloggen op de sollicitatie in `/beheer`.
7. S-11-07: De bevestiging aan een kandidaat komt niet aan, omdat het adres
   niet bestaat. Resend meldt een bounce via de webhook; `email_log` krijgt
   status `bounced` en het overzicht in `/beheer` toont de regel "E-mail niet
   aangekomen" (spec 08), zodat Jimmy de kandidaat belt.
8. S-11-08: Lorenzo wordt uitgenodigd voor Groos Beheer. Hij krijgt een
   Nederlandse uitnodiging vanaf `beheer@mail.groospersoneelsdiensten.nl`,
   kiest een wachtwoord en koppelt zijn authenticator-app.
9. S-11-09: Lorenzo is zijn wachtwoord vergeten en krijgt een Nederlandse
   herstelmail. Na het wijzigen krijgt hij een beveiligingsmelding.

Systeem en ontwikkelaar

10. S-11-10: Djulan test vanavond zonder Resend-sleutel. Elke mail verschijnt
    als blok in de terminal en `email_log` krijgt per mail een rij met
    `provider_message_id = 'console'`.
11. S-11-11: Djulan test met zijn eigen Resend-sleutel. Elke mail gaat alleen
    naar `EMAIL_DEV_TO`, met `[test voor <ontvanger>]` voor het onderwerp.
12. S-11-12: Resend is even onbereikbaar. De sollicitatie staat gewoon in de
    database, de kandidaat ziet de bedankpagina en `email_log` toont
    `failed`.
13. S-11-13: Een contactbericht met drie links komt binnen als spam. Er gaat
    geen enkele mail uit.
14. S-11-14: Djulan wil de templates morgen bijschaven. Hij opent
    `http://localhost:3000/api/dev/e-mail` en bekijkt elke mail in nl en en,
    als HTML en als platte tekst.

## 3 Scope

### 3.1 Wel in fase 1

| Id | Eis | Dient |
|---|---|---|
| E-11-01 | Eén verzendfunctie `sendEmail()` in `lib/email/send.ts` voor alle sitemails, met Resend (`resend` 6.x) en React Email (`@react-email/components` 1.x), afzender op `mail.groospersoneelsdiensten.nl` en reply-to `info@groospersoneelsdiensten.nl` (B-20). | R-04, R-19 |
| E-11-02 | Acht templates in `emails/*`: bevestiging en interne melding voor sollicitatie, inschrijving, personeelsaanvraag en contactbericht, met vaste bestandsnamen, props en onderwerpen. | R-04 |
| E-11-03 | Bevestigingen aan inzenders zijn in de taal van het formulier (`locale` van het record), je-vorm voor werkzoekenden en u-vorm voor opdrachtgevers en contact (B-04); interne meldingen zijn altijd Nederlands in je-vorm (spec 03). | R-07, R-13 |
| E-11-04 | Geen mail bevat ooit een cv als bijlage, de vrije tekst van de inzender, een BSN of andere gegevens die het formulier niet vraagt (B-17, B-20, context/09 §7). Bevestigingen echoën alleen waarden uit vaste lijsten, gevalideerde datums en nummers, en namen die door `safeEcho()` komen. | R-11 |
| E-11-05 | Per verzonden of gelogde mail één rij in `email_log` met `template`, `to_hash` (sha-256), `entity_type`, `entity_id`, `provider_message_id`, `status` en zo nodig `error`, zonder inhoud van de mail. | R-04, R-11 |
| E-11-06 | Een fout bij renderen, verzenden of loggen gooit nooit door naar het formulier; het record blijft staan en de status in `email_log` wordt `failed` (context/11 §6.1). | R-04 |
| E-11-07 | Ontwikkelgedrag volgens spec 13 §10 A8: zonder sleutel naar de console, met sleutel buiten productie alleen naar `EMAIL_DEV_TO`, op productie gewoon versturen. | R-17 |
| E-11-08 | De vier functies die spec 07 aanroept, met exact deze namen en argumenten: `sendApplicationEmails({ applicationId })`, `sendRegistrationEmails({ applicationId })`, `sendStaffRequestEmails({ staffRequestId })` en `sendContactEmails({ contactMessageId })` in `lib/email/forms.ts`. | R-04, R-19 |
| E-11-09 | Interne meldingen gaan naar `contact.email` (`info@`) en naar elk actief profiel in `admin_profiles` met de passende vlag `notify_applications`, `notify_staff_requests` of `notify_messages`, ontdubbeld. | R-03, R-04 |
| E-11-10 | De templates volgen de merkstijl van spec 02 (kleuren uit `lib/brand.ts`, logo `public/brand/logo-email.png`), zijn tekstgericht, werken op 320 px breed en hebben altijd een platte-tekstversie. | R-05, R-06, R-15 |
| E-11-11 | Onbevestigde claims (reactietermijn, bereikbaarheid buiten kantoortijden, kantoortijden) verschijnen alleen achter `isClaimConfirmed()` of `contact.openingHours` (B-22, spec 03). | R-12 |
| E-11-12 | De Auth-mails van Supabase (uitnodiging, wachtwoord herstellen, wachtwoord gewijzigd, authenticator-app gekoppeld en losgekoppeld) hebben Nederlandse teksten in `supabase/templates/*.html`, met links naar `/beheer/auth/bevestigen` (spec 08), verstuurd via Resend-SMTP (spec 13 D6). | R-03, R-07 |
| E-11-13 | Een webhookroute `POST /api/webhooks/resend` werkt `email_log` bij na `email.delivered`, `email.bounced`, `email.failed` en `email.suppressed`, met een gecontroleerde handtekening (`RESEND_WEBHOOK_SECRET`). | R-03, R-04 |
| E-11-14 | Een voorbeeldroute `GET /api/dev/e-mail` toont elk template met voorbeelddata in nl en en, als HTML of tekst, alleen in `next dev`. | R-17 |
| E-11-15 | Statuswijzigingen in `/beheer` versturen in fase 1 geen mail (spec 08 §3.2, B-20). | R-19, R-20 |

### 3.2 Niet in fase 1

- Mails vanuit het beheer bij een statuswijziging: uitnodiging voor een
  kennismaking, afwijzing en welkom na plaatsing (context/11 §6.6 nummers 3,
  4 en 5). E-mailen gaat in fase 1 via het eigen mailprogramma (spec 08).
- Een aparte mail aan Groos bij een mislukte verzending (context/11 nummer
  11). In fase 1 toont het overzicht in `/beheer` mislukte en gebouncete
  mails (spec 08 §4.6).
- Het weekoverzicht van verwijderde gegevens, de dagelijkse samenvatting,
  de herinnering na acht weken zonder contact en de cron-route
  `/api/cron/herinneringen` voor mail (context/11 nummers 12 en 13; fase 2,
  spec 15).
- De bevestiging na een verwijderverzoek (context/11 nummer 17): in fase 1
  bevestigen Jimmy en Lorenzo dat met een gewone mail (spec 09).
- Jobalerts met dubbele opt-in (spec 15).
- Bewerkbare onderwerpen en teksten in een `settings`-tabel en
  meldingsvoorkeuren in "Mijn profiel" (spec 08 fase 2). De vlaggen
  `notify_*` staan standaard aan en zijn in fase 1 alleen met SQL te wijzigen.
- Mail vanuit de templates aan opdrachtgevers over kandidaten.

### 3.3 Fase 2 (voorbereid)

`sendEmail()` is generiek: een nieuwe mail is één template in `emails/`, één
naam in `EmailTemplateName` en één aanroep. Voor spec 08 komt in fase 2
`sendApplicationStatusEmail({ applicationId, kind: "invitation" | "rejection",
fields })` in `lib/email/beheer.ts`, aangeroepen vanuit de statusactie van
spec 08 na een expliciete keuze in de dialoog, met `entity_type
'application'` in `email_log` en een `activities`-regel `email_sent` die de
beheeractie zelf schrijft. De rest van fase 2 (alerts, samenvatting,
weekoverzicht) volgt dezelfde vorm.

## 4 Pagina's en componenten

Deze module heeft geen publieke pagina's. Ze levert server-modules, acht
React Email-templates met gedeelde bouwstenen, twee route handlers en vijf
HTML-bestanden voor Supabase Auth.

### 4.1 Bestandsoverzicht

| Bestand | Soort | Nieuw of wijzigen |
|---|---|---|
| `lib/email/types.ts` | typen, client-veilig | nieuw |
| `lib/email/config.ts` | afzender, reply-to, modus (`import "server-only"`) | nieuw |
| `lib/email/send.ts` | `sendEmail()` (`import "server-only"`) | nieuw |
| `lib/email/log.ts` | `hashRecipients()`, `writeEmailLog()`, `cleanError()` | nieuw |
| `lib/email/sanitize.ts` | `safeEcho()`, `cleanSubject()` (client-veilig, geen imports) | nieuw |
| `lib/email/recipients.ts` | `internalRecipients()` | nieuw |
| `lib/email/company.ts` | `emailCompany()`, `emailLinks()` | nieuw |
| `lib/email/forms.ts` | de vier functies voor spec 07 | nieuw (vervangt de stub van spec 07 §10 stap 5) |
| `lib/email/webhook.ts` | `verifyResendWebhook()`, `applyWebhookEvent()` | nieuw |
| `emails/theme.ts` | kleuren en maten uit `lib/brand.ts` | nieuw |
| `emails/types.ts` | `EmailLocale`, `EmailCompany`, `EmailLinks` | nieuw |
| `emails/components/fill.ts` | `fill()` voor `{plaatshouders}` | nieuw |
| `emails/components/email-layout.tsx` | `EmailLayout` | nieuw |
| `emails/components/email-text.tsx` | `EmailText`, `EmailLink`, `EmailButton`, `EmailSubheading` | nieuw |
| `emails/components/fact-list.tsx` | `FactList` | nieuw |
| `emails/components/email-signoff.tsx` | `EmailSignoff` | nieuw |
| `emails/components/email-footer.tsx` | `EmailFooter` | nieuw |
| `emails/application-confirmation.tsx` | template 1 | nieuw |
| `emails/registration-confirmation.tsx` | template 2 | nieuw |
| `emails/staff-request-confirmation.tsx` | template 3 | nieuw |
| `emails/contact-confirmation.tsx` | template 4 | nieuw |
| `emails/application-notification.tsx` | template 5 | nieuw |
| `emails/registration-notification.tsx` | template 6 | nieuw |
| `emails/staff-request-notification.tsx` | template 7 | nieuw |
| `emails/contact-notification.tsx` | template 8 | nieuw |
| `emails/index.ts` | register `EMAIL_TEMPLATES` | nieuw |
| `emails/previews.ts` | voorbeeldprops (alleen `example.com`) | nieuw |
| `app/api/webhooks/resend/route.ts` | `POST` | nieuw |
| `app/api/dev/e-mail/route.ts` | `GET`, alleen in ontwikkeling | nieuw |
| `supabase/templates/invite.html`, `recovery.html`, `password-changed.html`, `mfa-factor-enrolled.html`, `mfa-factor-unenrolled.html` | Auth-mails | nieuw |
| `tests/unit/email/{verzenden,templates,opschonen,webhook}.test.ts` | Vitest (spec 14) | nieuw |

`emails/*` en `lib/email/*` zijn van deze spec (00 §4.4a).
`supabase/templates/*` staat niet in 00 §4.4a; deze spec claimt het (§12).

### 4.2 Gedeelde bouwstenen die deze module gebruikt

| Bouwsteen | Eigenaar | Gebruik hier |
|---|---|---|
| `createSupabaseAdminClient()` uit `lib/supabase/admin.ts` | 10 | records lezen, `email_log` schrijven en bijwerken, `admin_profiles` lezen |
| `hasSupabaseEnv()` uit `lib/supabase/env.ts` | 10 | voorbeeldroute zonder database |
| `Database`, `EntityType` (uit `lib/database.types.ts`), `REQUEST_DURATIONS`, `CONTACT_TOPICS`, `OccupationSlug`, `RequestDuration`, `ContactTopic` uit `lib/data/options.ts` | 10 | typen en waardensets |
| `contact`, `people`, `site` uit `lib/site.ts` | 01 | afzenderblok, hoofdnummer, `info@`, namen Jimmy en Lorenzo |
| `ROUTES` uit `lib/routes.ts`; `localizedPath(locale, path)` uit `lib/seo.ts` | 01, 12 | links naar privacyverklaring, vacatures, inschrijven, personeel aanvragen |
| `brand.colors` uit `lib/brand.ts`; `public/brand/logo-email.png` (480 bij 200) | 02 | kleuren en logo |
| `isClaimConfirmed("responseTime")`, `isClaimConfirmed("afterHoursUrgent")` uit `lib/claims.ts` | 03 | zinnen achter een vlag |
| `formatDate(value, locale)`, `formatTime(value, locale)` uit `lib/format.ts` | 03 | datums en kantoortijden |
| `formatPhoneDisplay(e164)` uit `lib/validation/phone.ts` | 07 | telefoonnummers in mails |
| `beheerUrl(path)`, `beheerPaths` en `beheerOrigin()` uit `app/beheer/_lib/paths.ts` | 08 | knoppen in interne meldingen en de basis-URL van alle links |
| `/beheer/auth/bevestigen` (route handler, `token_hash` en `type`) | 08 | links in de Auth-mails |
| Anker `#solliciteren`, `#inschrijven`, `#opdrachtgevers`, `#berichten` op `/privacyverklaring` | 09 | privacylink per mail |
| `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_DEV_TO`, `RESEND_WEBHOOK_SECRET`; systeemvariabelen `VERCEL`, `VERCEL_ENV`, `NODE_ENV` | 13 | modus en afzender |

Bestaat `formatDate` of `formatPhoneDisplay` nog niet als deze module wordt
gebouwd, dan gebruikt de bouw-agent de signatuur hierboven en maakt hij de
helper volgens de spec van de eigenaar; hij bouwt geen eigen variant.

### 4.3 Typen (`lib/email/types.ts`)

```ts
import type { ReactElement } from "react";

export const EMAIL_TEMPLATE_NAMES = [
  "application-confirmation", "application-notification",
  "registration-confirmation", "registration-notification",
  "staff-request-confirmation", "staff-request-notification",
  "contact-confirmation", "contact-notification",
] as const;
export type EmailTemplateName = (typeof EMAIL_TEMPLATE_NAMES)[number];

/** Waarde voor email_log.entity_type (enum entity_type van spec 10). */
export type EmailEntity = { type: "application" | "staff_request" | "contact_message"; id: string };

export type SendEmailInput = {
  template: EmailTemplateName;
  to: string[];                 // gevalideerde adressen, kleine letters, ontdubbeld, 1 tot 20
  subject: string;              // gaat door cleanSubject()
  react: ReactElement;          // een template uit emails/
  entity: EmailEntity | null;   // null: mail zonder record, entity_type en entity_id leeg in email_log
  idempotencyKey?: string;      // standaard `${template}/${entity.id}`, bij entity null `${template}/${crypto.randomUUID()}`
  headers?: Record<string, string>; // alleen List-Unsubscribe en List-Unsubscribe-Post, nooit met persoonsgegevens
};

export type SendEmailResult =
  | { status: "sent"; providerId: string }
  | { status: "console" }
  | { status: "failed"; error: string };
```

`headers` is alleen bedoeld voor `List-Unsubscribe` en
`List-Unsubscribe-Post` en bevat nooit persoonsgegevens. Is `entity` `null`,
dan schrijft `writeEmailLog` `entity_type` en `entity_id` leeg, en is de
standaard `idempotencyKey` `${template}/${crypto.randomUUID()}`. De acht
formuliermails van fase 1 geven altijd een `entity` mee en geen `headers`.

Spec 15 voegt in fase 2 `job-alert-confirm`, `job-alert-digest`,
`job-alert-reconfirm` en `stale-reminder` toe aan `EMAIL_TEMPLATE_NAMES`, met
eigen idempotentiesleutels.

### 4.4 Configuratie en modus (`lib/email/config.ts`)

```ts
import "server-only";
export const EMAIL_FROM_DEFAULT = "Groos Personeelsdiensten <website@mail.groospersoneelsdiensten.nl>";
export const EMAIL_REPLY_TO: string;            // = contact.email uit lib/site.ts
export type EmailMode =
  | { mode: "send"; from: string }              // productie
  | { mode: "redirect"; from: string; devTo: string }
  | { mode: "console"; reason: "no_key" | "no_dev_to"; onVercel: boolean }
  | { mode: "misconfigured"; error: "RESEND_API_KEY ontbreekt" };
export function emailMode(env?: NodeJS.ProcessEnv): EmailMode;
```

`emailMode()` leest de omgeving bij elke aanroep (niet bij het laden van de
module), zodat tests de variabelen per geval kunnen zetten.

| `RESEND_API_KEY` | `VERCEL_ENV` | `EMAIL_DEV_TO` | Modus | Afzender |
|---|---|---|---|---|
| leeg | `production` | genegeerd | `misconfigured` | geen |
| leeg | anders of niet gezet | genegeerd | `console`, reden `no_key` | geen |
| gezet | `production` | genegeerd | `send` | `EMAIL_FROM_DEFAULT` (`EMAIL_FROM` wordt genegeerd) |
| gezet | anders of niet gezet | geldig adres | `redirect` | `EMAIL_FROM` als die gezet is, anders `EMAIL_FROM_DEFAULT` |
| gezet | anders of niet gezet | leeg of ongeldig | `console`, reden `no_dev_to`, één keer per proces `console.warn("[e-mail] EMAIL_DEV_TO ontbreekt, niets verstuurd")` | geen |

Alleen `VERCEL_ENV === "production"` geldt als productie. `next start` op
localhost is dus geen productie; zo gaan ook e2e-tests van spec 14 nooit
naar echte adressen. `onVercel` is `process.env.VERCEL === "1"`.

### 4.5 Verzendfunctie (`lib/email/send.ts`)

```ts
import "server-only";
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult>;
```

Gedrag, in deze volgorde. De functie gooit nooit; elke stap staat in
`try`/`catch`.

1. **Controle.** `to` wordt naar kleine letters gezet, ontdubbeld en
   gefilterd op `z.email()`; is de lijst daarna leeg, dan `console.warn`
   met alleen de templatenaam en resultaat `failed` met fout `geen geldige
   ontvanger`, zonder rij in `email_log`.
2. **Renderen.** `const html = await render(input.react)` en
   `const text = toPlainText(html, PLAIN_TEXT_OPTIONS)`, beide uit
   `@react-email/components` (die het pakket `@react-email/render` opnieuw
   exporteert). `PLAIN_TEXT_OPTIONS` zet koppen niet in hoofdletters:
   `{ selectors: ["h1", "h2", "h3"].map((selector) => ({ selector, options: { uppercase: false } })) }`.
   Een renderfout geeft `failed` met fout `render`.
3. **Onderwerp.** `subject = cleanSubject(input.subject)` (§4.7).
4. **Modus** uit `emailMode()`:
   - `misconfigured`: `console.error("[e-mail] RESEND_API_KEY ontbreekt op productie")`, resultaat `failed`.
   - `console`: niets versturen. Is `onVercel` onwaar, dan één blok in de
     terminal: eerste regel `[e-mail] aan <to, kommagescheiden> · onderwerp <subject> · template <template>`,
     daarna `text`, daarna een regel van 40 keer `=`. Is `onVercel` waar,
     dan alleen `[e-mail] template <template> · niet verstuurd (<reason>)`,
     zonder adres of tekst, omdat Vercel-logs geen persoonsgegevens horen
     te bevatten. Resultaat `console`.
   - `redirect`: verzenden naar `[devTo]` met onderwerp
     `[test voor ${to.join(", ")}] ${subject}`.
   - `send`: verzenden naar `to`.
5. **Verzenden** met één `Resend`-instantie per proces
   (`new Resend(process.env.RESEND_API_KEY)`, pas aangemaakt bij de eerste
   verzending):

   ```ts
   // één keer bepaald, vóór de eerste poging, zodat de nieuwe poging dezelfde sleutel gebruikt
   const idempotencyKey = input.idempotencyKey ?? (input.entity
     ? `${input.template}/${input.entity.id}`
     : `${input.template}/${crypto.randomUUID()}`);
   const { data, error } = await resend.emails.send(
     { from, to, subject, html, text, replyTo: EMAIL_REPLY_TO,
       tags: [{ name: "template", value: input.template }],
       ...(input.headers ? { headers: input.headers } : {}) },
     { idempotencyKey },
   );
   ```

   Geen `cc`, geen `bcc`, geen `attachments`; `headers` alleen zoals in §4.3
   (`List-Unsubscribe` en `List-Unsubscribe-Post`), nooit met
   persoonsgegevens. Geeft Resend een fout met `statusCode` 429 of 500 en
   hoger, of gooit de aanroep (netwerk), dan wacht de functie 1.000 ms en
   probeert hij het één keer opnieuw met dezelfde idempotentiesleutel.
   Daarna: `data.id` geeft `sent`, anders `failed` met
   `cleanError(error.message)`.
6. **Loggen.** `writeEmailLog()` (§4.6) met het resultaat. Een fout bij het
   loggen geeft alleen `console.error("[e-mail] email_log schrijven mislukt", { template, pgCode })`.
7. **Fouten melden.** Bij `failed`: `console.error("[e-mail] verzenden mislukt", { template, entity: entity?.type ?? null, error })`
   zonder adres.

De idempotentiesleutel voorkomt een dubbele mail als de functie voor
hetzelfde record twee keer wordt aangeroepen binnen 24 uur (bewaartijd van
Resend).

### 4.6 Verzendverslag (`lib/email/log.ts`)

```ts
import "server-only";
/** sha-256 (hex, 64 tekens) van de adressen in kleine letters, gesorteerd en met "," verbonden. */
export function hashRecipients(to: string[]): string;
export async function writeEmailLog(row: {
  template: EmailTemplateName; to: string[]; entity: EmailEntity | null; result: SendEmailResult;
}): Promise<void>;
/** Haalt e-mailadressen uit een foutmelding (vervangen door "[adres]") en kort in tot 500 tekens. */
export function cleanError(message: string | undefined): string;
```

`hashRecipients` gebruikt `createHash("sha256")` uit `node:crypto`. Bij één
ontvanger is de hash dus de sha-256 van dat adres (spec 10 §5.3); bij een
interne melding aan meerdere adressen die van de gesorteerde lijst. In de
modus `redirect` en `console` wordt de oorspronkelijke ontvanger gehasht,
niet `EMAIL_DEV_TO`, zodat tests hetzelfde verslag zien als productie.

| `result.status` | `email_log.status` | `provider_message_id` | `error` |
|---|---|---|---|
| `sent` | `sent` | `data.id` van Resend | leeg |
| `console` | `queued` | `console` | leeg |
| `failed` | `failed` | leeg | `cleanError(...)` |

Insert via `createSupabaseAdminClient().from("email_log").insert({ template,
to_hash, entity_type, entity_id, provider_message_id, status, error })`.
Is `entity` `null`, dan zijn `entity_type` en `entity_id` leeg (`null`).
`email_log` is alleen voor eigenaren leesbaar (spec 10 §5.8); de site
schrijft met de secret key. De rij bevat nooit onderwerp, tekst, naam of
adres. Opschonen na 90 dagen doet `purge_logs()` van spec 10.

### 4.7 Opschonen van tekst (`lib/email/sanitize.ts`)

```ts
/** Waarde die veilig terug mag naar een extern adres, anders null. */
export function safeEcho(value: string | null | undefined, maxLength = 60): string | null;
/** Eén regel, witruimte samengevoegd, hoogstens 150 tekens. */
export function cleanSubject(subject: string): string;
```

`safeEcho` geeft `null` als de waarde leeg is, langer is dan `maxLength`,
niet past op `^[\p{L}\p{M}0-9 '’&().,-]+$` (vlag `u`), of past op
`/(https?:|www\.|@|\.[a-z]{2,}(\b|\/))/i`. Zo kan niemand via een formulier
een link of reclametekst laten versturen vanaf het domein van Groos
(context/11 §6.4, "geen echo"). Gebruik: voornaam in de aanhef (maximaal 40),
bedrijfsnaam en plaats van het werk in de samenvatting van de aanvraag.
Interne meldingen gaan alleen naar Groos zelf en tonen namen, plaats en
"ander werk" ongefilterd, wel via `cleanSubject` in het onderwerp.

### 4.8 Ontvangers van interne meldingen (`lib/email/recipients.ts`)

```ts
import "server-only";
export type NotifyFlag = "notify_applications" | "notify_staff_requests" | "notify_messages";
export async function internalRecipients(flag: NotifyFlag): Promise<string[]>;
```

Leest `admin_profiles` met `select("email").eq("is_active", true).eq(flag,
true)` via de admin-client, voegt `contact.email` toe, zet alles in kleine
letters, ontdubbelt en sorteert. Een leesfout geeft alleen `[contact.email]`
met een `console.error`. Koppeling: sollicitaties en inschrijvingen gebruiken
`notify_applications`, aanvragen `notify_staff_requests`, berichten
`notify_messages`.

### 4.9 Bedrijfsblok en links (`lib/email/company.ts`)

```ts
import "server-only";
export function emailCompany(locale: EmailLocale): EmailCompany;
export function emailLinks(locale: EmailLocale): EmailLinks;
export function emailOrigin(): string;   // = beheerOrigin() van spec 08
```

```ts
// emails/types.ts
export type EmailLocale = "nl" | "en";
export type EmailCompany = {
  legalName: string;        // contact.name, "Groos Personeelsdiensten B.V."
  street: string; postalCode: string; city: string;
  phoneDisplay: string;     // contact.phone, "06 52 54 95 39"
  phoneHref: string;        // contact.phoneHref
  email: string;            // contact.email
  websiteUrl: string;       // emailOrigin() + localizedPath(locale, "/")
  websiteLabel: string;     // site.url zonder "https://", "www.groospersoneelsdiensten.nl"
  kvk: string | null;       // contact.kvk, alleen als gevuld
  officeHours: string | null; // alleen als contact.openingHours gevuld is: nl "maandag tot en met vrijdag van 07.00 tot 18.00 uur", en "Monday to Friday, 07:00 to 18:00", tijden via formatTime
  logoUrl: string;          // emailOrigin() + "/brand/logo-email.png"
};
export type EmailLinks = {
  privacy: Record<"solliciteren" | "inschrijven" | "opdrachtgevers" | "berichten", string>; // origin + localizedPath(locale, ROUTES.privacyverklaring) + "#anker"
  vacancies: string;        // origin + localizedPath(locale, ROUTES.vacatures)
  register: string;         // origin + localizedPath(locale, ROUTES.inschrijven)
  staffRequest: string;     // origin + localizedPath(locale, ROUTES.personeelAanvragen)
};
```

`emailOrigin()` geeft op productie `site.url`, op een preview
`https://${VERCEL_URL}` en anders `http://localhost:3000`. Het logo laadt
daardoor lokaal alleen in de voorbeeldroute; in een echte inbox toont de mail
dan de alt-tekst, wat bewust is.

### 4.10 Functies voor spec 07 (`lib/email/forms.ts`)

```ts
import "server-only";
export async function sendApplicationEmails(input: { applicationId: string }): Promise<void>;
export async function sendRegistrationEmails(input: { applicationId: string }): Promise<void>;
export async function sendStaffRequestEmails(input: { staffRequestId: string }): Promise<void>;
export async function sendContactEmails(input: { contactMessageId: string }): Promise<void>;
```

Spec 07 roept ze aan in `after()` (spec 07 §5.5 stap 9) en wacht erop met
`await`. Elke functie staat volledig in `try`/`catch`, gooit nooit en
verstuurt eerst de bevestiging en daarna de interne melding, na elkaar (niet
parallel, om onder de verzendlimiet van Resend te blijven). Ze schrijven geen
`activities`: de trigger `activities_after_insert` van spec 10 zou een
sollicitatie bij `email_sent` anders op `in_progress` zetten, terwijl
niemand nog contact heeft gehad.

**`sendApplicationEmails`**

1. Lees via de admin-client:
   ```ts
   from("applications").select(`id, reference, kind, first_name, last_name, email, phone_e164, city,
     may_work_in_nl, available_from, has_driving_license_b, message, cv_path, retention_consent,
     locale, utm, vacancy_number, vacancy_title_snapshot, anonymized_at,
     vacancy:vacancies(city, contact:admin_profiles!contact_admin_id(display_name, phone_e164, whatsapp_e164, is_active))`)
     .eq("id", applicationId).single()
   ```
   Stop met `console.warn` als het record ontbreekt, `kind` niet `vacancy`
   is of `anonymized_at` gevuld is.
2. Contactpersoon: is `vacancy.contact` actief en is `phone_e164` gevuld,
   dan `display_name` en `formatPhoneDisplay(phone_e164)`; anders "Jimmy of Lorenzo" (en: "Jimmy
   or Lorenzo") via `new Intl.ListFormat(locale, { type: "disjunction" })`
   over `people` en het hoofdnummer `contact.phone`.
3. Bevestiging alleen als `email` gevuld is: template
   `application-confirmation` met de props uit §5.3, onderwerp via
   `applicationConfirmationSubject(props)`, entity
   `{ type: "application", id }`.
4. Interne melding: `internalRecipients("notify_applications")`, template
   `application-notification`, entity gelijk.

**`sendRegistrationEmails`**: als hierboven met `kind = 'registration'`,
zonder vacature. Beroepen: `occupation_slugs` vertaald via één query
`from("occupations").select("slug, name_nl, name_en").in("slug",
occupation_slugs)` in de volgorde van `sort_order`. Templates
`registration-confirmation` en `registration-notification`.

**`sendStaffRequestEmails`**: lees `staff_requests` (`id, reference,
company_name, kvk_number, contact_name, email, phone_e164, occupation_slugs,
occupation_other, headcount, start_asap, start_date, duration, hours_per_week,
work_city, description, locale, utm`) en de beroepen met `plural_nl` en
`plural_en`. Bevestiging naar `email` (altijd gevuld), interne melding via
`notify_staff_requests`. Templates `staff-request-confirmation` en
`staff-request-notification`, entity `{ type: "staff_request", id }`.

**`sendContactEmails`**: lees `contact_messages` (`id, name, email,
phone_e164, topic, message, locale, status`). Bij `status = 'spam'` stopt de
functie zonder mail (spec 07 roept hem dan ook niet aan). Bevestiging alleen
als `email` gevuld is; interne melding via `notify_messages`. Templates
`contact-confirmation` en `contact-notification`, entity
`{ type: "contact_message", id }`.

Het veld `message` of `description` wordt alleen gelezen om `hasMessage` of
`hasDescription` te bepalen; de inhoud gaat nooit een template in.

### 4.11 Webhook (`app/api/webhooks/resend/route.ts`)

`export const dynamic = "force-dynamic"`, `export const runtime = "nodejs"`.
`/api` valt buiten de proxy (spec 01) en heeft `X-Robots-Tag: noindex`
(spec 13).

```ts
// lib/email/webhook.ts
import "server-only";
export type ResendWebhookEvent = {
  type: "email.sent" | "email.delivered" | "email.delivery_delayed" | "email.bounced" | "email.complained"
    | "email.failed" | "email.suppressed" | "email.opened" | "email.clicked" | "email.received" | "email.scheduled";
  created_at: string;
  data: { email_id: string; bounce?: { message?: string; type?: string } };
};
/** Standard Webhooks (Svix): HMAC-SHA256 over `${id}.${timestamp}.${body}` met de base64-sleutel na "whsec_". */
export function verifyResendWebhook(input: {
  body: string; id: string | null; timestamp: string | null; signature: string | null; secret: string; now?: number;
}): ResendWebhookEvent;   // gooit Error("invalid_signature") of Error("stale_timestamp")
export async function applyWebhookEvent(event: ResendWebhookEvent): Promise<{ updated: number }>;
```

`verifyResendWebhook` gebruikt alleen `node:crypto` (geen extra package,
B-37): de sleutel is `Buffer.from(secret.replace(/^whsec_/, ""), "base64")`;
de verwachte handtekening is `HMAC-SHA256(sleutel, `${id}.${timestamp}.${body}`)`
in base64; de header `svix-signature` bevat één of meer waarden `v1,<base64>`
gescheiden door spaties, en één ervan moet gelijk zijn
(`crypto.timingSafeEqual` op gelijke lengte). Een tijdstempel die meer dan
300 seconden van `now` afwijkt geeft `stale_timestamp`.

`POST`:

1. Is `RESEND_WEBHOOK_SECRET` leeg, dan 404 `{ "error": "not_configured" }`.
2. `const body = await request.text()`; verifiëren met de headers
   `svix-id`, `svix-timestamp` en `svix-signature`. Fout geeft 401
   `{ "error": "invalid_signature" }`, zonder iets te loggen behalve de code.
3. `applyWebhookEvent(event)` met de admin-client:

   | Gebeurtenis | Update op `email_log` waar `provider_message_id = data.email_id` |
   |---|---|
   | `email.delivered` | `status = 'delivered'`, alleen als de huidige status `queued` of `sent` is |
   | `email.bounced` | `status = 'bounced'`, `error = cleanError(data.bounce?.message ?? "bounced")` |
   | `email.failed`, `email.suppressed` | `status = 'failed'`, `error = cleanError(type)` |
   | `email.complained` | status blijft, `error = 'complained'` |
   | overige | niets |

   `updated_at` zet de trigger van spec 10.
4. Antwoord 200 `{ "ok": true, "updated": n }`, ook als er geen rij bij
   hoort. Een databasefout geeft 500, zodat Resend het later opnieuw
   probeert.

Spec 13 richt de webhook in Resend in (§5.5) met de gebeurtenissen
`email.delivered`, `email.bounced`, `email.complained`, `email.failed` en
`email.suppressed`. Op localhost komt geen webhook binnen; de tests van
§10 stap 12 roepen de handler direct aan.

### 4.12 Voorbeeldroute (`app/api/dev/e-mail/route.ts`)

`GET`, `export const dynamic = "force-dynamic"`. Als `process.env.NODE_ENV
!== "development"`: direct 404 met lege body. Anders:

| Query | Antwoord |
|---|---|
| geen `template` | HTML-pagina (Nederlands) met per template en per taal twee links: HTML en tekst. Interne meldingen alleen `nl`. |
| `template=<naam>&locale=nl\|en` | HTML van het template met `previewProps` uit `emails/previews.ts`, `content-type: text/html; charset=utf-8` |
| idem met `&format=text` | de platte tekst, `text/plain; charset=utf-8` |
| `&variant=<naam>` | alternatieve props uit `previews.ts`, bijvoorbeeld `callback` bij `contact-confirmation`, `consent` bij `application-confirmation`, `claims` (alle vlaggen aan) |

Onbekend template of taal: 404. De route leest de database niet en verstuurt
niets. Zo kan Djulan morgen de copy en de stijl bijwerken zonder formulieren
in te vullen.

### 4.13 Opbouw en uiterlijk van de templates

Alle templates gebruiken alleen `Html`, `Head`, `Preview`, `Body`,
`Container`, `Section`, `Heading`, `Text`, `Link`, `Button`, `Img` en `Hr`
uit `@react-email/components`, met inline `style`-objecten uit
`emails/theme.ts`. Geen Tailwind in mails, geen webfonts, geen
achtergrondafbeeldingen.

```ts
// emails/theme.ts
import { brand } from "@/lib/brand";
export const emailTheme = {
  color: {
    page: brand.colors.ice, card: brand.colors.background, text: brand.colors.foreground,
    muted: brand.colors.muted, brand: brand.colors.brand, brandStrong: brand.colors.brandStrong,
    tint: brand.colors.brandTint, border: brand.colors.border, onBrand: brand.colors.background,
  },
  font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  size: { body: 16, small: 13, h1: 24, h2: 17 },
  lineHeight: { body: 1.55, heading: 1.3 },
  width: 600,
} as const;
```

| Component | Props | Uiterlijk |
|---|---|---|
| `EmailLayout` | `{ locale: EmailLocale; preview: string; heading: string; company: EmailCompany; footerNote: string; children: React.ReactNode }` | `<Html lang={locale} dir="ltr">`; `<Head>` met `<meta name="color-scheme" content="light">` en `<meta name="supported-color-schemes" content="light">`; `<Preview>`; body in `page` met 24 px boven en onder; `Container` van maximaal 600 px, wit, rand 1 px `border`, hoek 12 px; bovenaan een balk van 4 px in `brand` (de touch van blauw); daarbinnen 32 px boven en 24 px opzij; `Img` `logoUrl` 160 bij 67 px met alt `company.legalName`; h1 `heading` in 24 px, gewicht 600, kleur `text`; `children`; `Hr` in `border`; `EmailFooter` |
| `EmailText` | `{ children; muted?: boolean; size?: "body" \| "small" }` | `<Text>` 16 px, regelhoogte 1,55, marge 0 0 16 px; `muted` in `muted` |
| `EmailSubheading` | `{ children }` | `<Heading as="h2">` 17 px, gewicht 600, marge 24 px 0 8 px |
| `EmailLink` | `{ href; children }` | kleur `brand`, onderstreept |
| `EmailButton` | `{ href; children }` | `<Button>` met achtergrond `brand`, tekst wit 16 px gewicht 600, padding 13 px 22 px (minimaal 44 px hoog), hoek 999 px, marge 8 px 0 24 px; altijd met een tekstlink of nummer ernaast in de lopende tekst, zodat de mail zonder knop werkt |
| `FactList` | `{ title?: string; facts: { label: string; value: React.ReactNode }[] }` | optioneel `EmailSubheading`; daarna een `Section` met achtergrond `tint`, hoek 8 px, padding 16 px; per feit één `<Text>` met `<strong>{label}:</strong> {value}`; geen tabellen, zodat de platte tekst netjes blijft |
| `EmailSignoff` | `{ locale }` | drie regels uit de copy: groet, "Jimmy en Lorenzo", "Groos Personeelsdiensten" |
| `EmailFooter` | `{ locale; company: EmailCompany; note: string }` | 13 px in `muted`: `legalName`; `street`, `postalCode city`, met "Langskomen kan alleen op afspraak." (adresregel uit §6.9); telefoon als `tel:`-link; e-mail als `mailto:`-link; website als link; KvK-regel alleen als `kvk` gevuld is; kantoortijden alleen als `officeHours` gevuld is; daarna `note` |

`fill(template, values)` in `emails/components/fill.ts` vervangt
`{sleutel}` door de waarde en laat een onbekende sleutel staan, zodat de test
van §10 stap 12 hem vindt. Elk template exporteert:

```ts
export type <Naam>Props = { ... };                           // §5.3
export function <naam>Subject(props: <Naam>Props): string;   // fill + cleanSubject
export default function <Naam>(props: <Naam>Props): React.ReactElement;
```

`emails/index.ts`:

```ts
export type TemplateEntry<P> = {
  Component: (props: P) => React.ReactElement;
  subject: (props: P) => string;
  locales: readonly EmailLocale[];     // interne meldingen alleen ["nl"]
};
export const EMAIL_TEMPLATES: { [K in EmailTemplateName]: TemplateEntry<any> };
```

## 5 Data

### 5.1 Tabellen die deze module gebruikt (spec 10)

| Tabel | Kolommen | Lezen of schrijven |
|---|---|---|
| `applications` | zie §4.10 | lezen (admin-client) |
| `staff_requests` | zie §4.10 | lezen |
| `contact_messages` | zie §4.10 | lezen |
| `vacancies`, `admin_profiles` (contactpersoon) | `city`; `display_name`, `phone_e164`, `whatsapp_e164`, `is_active` | lezen |
| `occupations` | `slug`, `name_nl`, `name_en`, `plural_nl`, `plural_en`, `sort_order` | lezen |
| `admin_profiles` (ontvangers) | `email`, `is_active`, `notify_applications`, `notify_staff_requests`, `notify_messages` | lezen |
| `email_log` | `template`, `to_hash`, `entity_type`, `entity_id`, `provider_message_id`, `status`, `error` | insert (verzenden), update (webhook) |

Geen migratie: alle kolommen bestaan in spec 10 §5.3. De statussen zijn de
enum `email_status` (`queued`, `sent`, `delivered`, `bounced`, `failed`).
`template` heeft maximaal 60 tekens; de langste naam
(`staff-request-confirmation`) heeft er 26.

### 5.2 Templates in één oogopslag

| Nr | `template` (`email_log`) | Bestand | Ontvanger | Taal | Wanneer | Afzender | Reply-to |
|---|---|---|---|---|---|---|---|
| 1 | `application-confirmation` | `emails/application-confirmation.tsx` | kandidaat, als e-mail gevuld | `locale` | na sollicitatie | `EMAIL_FROM_DEFAULT` | `info@` |
| 2 | `registration-confirmation` | `emails/registration-confirmation.tsx` | inschrijver | `locale` | na inschrijving | idem | `info@` |
| 3 | `staff-request-confirmation` | `emails/staff-request-confirmation.tsx` | opdrachtgever | `locale` | na aanvraag | idem | `info@` |
| 4 | `contact-confirmation` | `emails/contact-confirmation.tsx` | afzender, als e-mail gevuld | `locale` | na contactbericht, niet bij spam | idem | `info@` |
| 5 | `application-notification` | `emails/application-notification.tsx` | `info@` en beheerders met `notify_applications` | nl | na sollicitatie | idem | `info@` |
| 6 | `registration-notification` | `emails/registration-notification.tsx` | idem | nl | na inschrijving | idem | `info@` |
| 7 | `staff-request-notification` | `emails/staff-request-notification.tsx` | `info@` en beheerders met `notify_staff_requests` | nl | na aanvraag | idem | `info@` |
| 8 | `contact-notification` | `emails/contact-notification.tsx` | `info@` en beheerders met `notify_messages` | nl | na contactbericht, niet bij spam | idem | `info@` |
| A1 | Supabase `invite` | `supabase/templates/invite.html` | nieuwe beheerder | nl | uitnodigen in het dashboard | `beheer@mail.groospersoneelsdiensten.nl` (SMTP, spec 13 D6) | geen |
| A2 | Supabase `recovery` | `supabase/templates/recovery.html` | beheerder | nl | wachtwoord vergeten | idem | geen |
| A3 | Supabase `password_changed` | `supabase/templates/password-changed.html` | beheerder | nl | na wachtwoordwijziging | idem | geen |
| A4 | Supabase `mfa_factor_enrolled` | `supabase/templates/mfa-factor-enrolled.html` | beheerder | nl | na koppelen app | idem | geen |
| A5 | Supabase `mfa_factor_unenrolled` | `supabase/templates/mfa-factor-unenrolled.html` | beheerder | nl | na loskoppelen app | idem | geen |

Wat er nooit in een mail mag, voor alle templates: een cv of ander bestand
als bijlage of als link naar Storage; de vrije tekst van `message`,
`description` of `occupation_other` in een bevestiging; BSN, geboortedatum,
nationaliteit, identiteitsbewijs, foto of gezondheid (die bestaan ook niet in
de tabellen); notities en statussen uit het beheer; onbevestigde claims
(CL-01 tot en met CL-22 van spec 09) buiten de vlaggen; tracking-pixels en
herschreven links (open- en kliktracking staan uit, spec 13 §5.5).

### 5.3 Props per template

Gemeenschappelijk voor elk template: `locale: EmailLocale` (bij interne
meldingen altijd `"nl"`) en `company: EmailCompany`.

| Template | Overige props |
|---|---|
| `ApplicationConfirmation` | `greetingName: string \| null` (`safeEcho(first_name, 40)`); `reference: string`; `vacancyTitle: string` (`vacancy_title_snapshot`); `vacancyNumber: number`; `vacancyCity: string \| null` (`vacancies.city`); `contactName: string`; `contactPhoneDisplay: string`; `phoneDisplay: string` (`formatPhoneDisplay(phone_e164)`); `hasCv: boolean`; `retentionConsent: boolean`; `showResponseTime: boolean` (`isClaimConfirmed("responseTime")`); `links: Pick<EmailLinks, "privacy" \| "vacancies">` |
| `RegistrationConfirmation` | `greetingName`; `reference`; `occupationLabels: string[]` (enkelvoud in de taal van de mail, volgorde `sort_order`); `phoneDisplay`; `hasCv`; `showResponseTime`; `links: Pick<EmailLinks, "privacy" \| "vacancies">` |
| `StaffRequestConfirmation` | `greetingName` (`safeEcho(contact_name, 40)`); `reference`; `companyName: string \| null` (`safeEcho`); `occupationLabels: string[]` (meervoud); `hasOtherOccupation: boolean`; `headcount: number`; `start: { asap: true } \| { asap: false; dateLabel: string }` (`formatDate(start_date, locale)`); `duration: RequestDuration`; `hoursPerWeek: number \| null`; `workCity: string \| null` (`safeEcho`); `showResponseTime`; `showAfterHours: boolean` (`isClaimConfirmed("afterHoursUrgent")`); `links: Pick<EmailLinks, "privacy">` |
| `ContactConfirmation` | `greetingName` (`safeEcho(name, 40)`); `topic: ContactTopic`; `links: Pick<EmailLinks, "privacy" \| "register" \| "staffRequest">` |
| `ApplicationNotification` | `reference`; `fullName: string`; `phone: { display: string; href: string } \| null`; `whatsappHref: string \| null` (`https://wa.me/<e164 zonder +>`); `email: string \| null`; `city: string \| null`; `mayWorkInNl: boolean \| null`; `hasDrivingLicenseB: boolean \| null`; `availableFromLabel: string \| null`; `hasCv`; `hasMessage: boolean`; `retentionConsent`; `formLocale: EmailLocale`; `utmSource: string \| null`; `vacancyTitle`; `vacancyNumber`; `beheerLink: string` (`beheerUrl(beheerPaths.application(reference))`) |
| `RegistrationNotification` | als `ApplicationNotification` zonder `vacancyTitle`, `vacancyNumber` en `retentionConsent`, plus `occupationLabels: string[]` (Nederlands enkelvoud) |
| `StaffRequestNotification` | `reference`; `companyName: string`; `kvkNumber: string \| null`; `contactName: string`; `phone`; `whatsappHref`; `email: string`; `occupationLabels: string[]` (Nederlands meervoud); `occupationOther: string \| null`; `headcount`; `start` (Nederlandse datum); `duration`; `hoursPerWeek`; `workCity: string`; `hasDescription: boolean`; `formLocale`; `utmSource`; `beheerLink` (`beheerPaths.request(reference)`) |
| `ContactNotification` | `name: string`; `phone`; `whatsappHref`; `email: string \| null`; `topic: ContactTopic`; `hasMessage: boolean`; `formLocale`; `beheerLink` (`beheerPaths.message(id)`) |

`utmSource` is `utm.source` als die op `^[a-z0-9._-]{1,100}$` past, anders
`null`.

### 5.4 Waardensets in mails

Labels voor `duration` en `topic` staan in de copy van het template en zijn
letterlijk gelijk aan `forms.staffRequest.fields.duration.options` en
`forms.contactForm.fields.topic.options` van spec 07:

| Waarde | nl | en |
|---|---|---|
| `one_day`, `days`, `weeks`, `months`, `indefinite`, `unknown` | Eén dag; Enkele dagen; Enkele weken; Enkele maanden; Langdurig; Weet ik nog niet | One day; A few days; A few weeks; A few months; Long term; Not sure yet |
| `job_seeker`, `employer`, `callback`, `other` | Ik zoek werk; Ik zoek personeel; Bel mij terug; Iets anders | I am looking for work; I am looking for staff; Call me back; Something else |

Beroepsnamen komen uit `occupations` (spec 10 §5.10), dus dezelfde namen als
op vacaturepagina's en in het beheer.

### 5.5 Auth-mails: koppeling met Supabase

Variabelen die de HTML-bestanden gebruiken: `{{ .SiteURL }}`,
`{{ .TokenHash }}` en `{{ .Email }}`. Links:

| Template | Link |
|---|---|
| `invite.html` | `{{ .SiteURL }}/beheer/auth/bevestigen?token_hash={{ .TokenHash }}&type=invite` |
| `recovery.html` | `{{ .SiteURL }}/beheer/auth/bevestigen?token_hash={{ .TokenHash }}&type=recovery` |
| beveiligingsmeldingen | geen knop; link naar `{{ .SiteURL }}/beheer/inloggen` als tekst |

`{{ .ConfirmationURL }}` wordt niet gebruikt, omdat de route van spec 08 met
`token_hash` werkt en zo ook op een andere browser of telefoon slaagt.

### 5.6 Auth-mails in het dashboard

`supabase/templates/*.html` is de bron van de Auth-mailteksten. Deze spec
voegt niets toe aan `supabase/config.toml`. Djulan plakt de vijf bestanden per
project in het dashboard onder Authentication, Emails: voor `groos-dev` bij
spec 13 A2, voor productie bij spec 13 D7. Wijzigt een tekst, dan wijzigt
eerst het bestand in de repo en daarna het dashboard van beide projecten.

| Plek in het dashboard (Authentication, Emails) | Bestand | Onderwerp |
|---|---|---|
| Templates, Invite user | `invite.html` | Je bent uitgenodigd voor Groos Beheer |
| Templates, Reset password | `recovery.html` | Stel een nieuw wachtwoord in voor Groos Beheer |
| Security notifications, wachtwoord gewijzigd (aanzetten) | `password-changed.html` | Je wachtwoord voor Groos Beheer is gewijzigd |
| Security notifications, authenticator-app gekoppeld (aanzetten) | `mfa-factor-enrolled.html` | Er is een authenticator-app gekoppeld aan Groos Beheer |
| Security notifications, authenticator-app losgekoppeld (aanzetten) | `mfa-factor-unenrolled.html` | Er is een authenticator-app losgekoppeld van Groos Beheer |

De geldigheid van 24 uur voor de links in uitnodiging en herstelmail zet
Djulan in het dashboard: Email OTP Expiration op 86400 seconden (onder
Authentication, Sign In / Providers, Email). Supabase kent één instelling voor
beide mails. `supabase config push` draait niet (spec 13, B-39).

## 6 Tekstelementen

Mailtekst staat in de templates zelf, als `const COPY = { nl: {...}, en:
{...} } as const` bovenin elk bestand in `emails/` (interne meldingen alleen
`nl`), vergelijkbaar met de juridische pagina's (00 §4.4 punt 6). Ze staat
niet in `messages/`, omdat mails buiten een request van next-intl worden
gerenderd en de gespiegelde namespaces dan groeien met tekst die de site niet
toont. `scripts/check-copy.mjs` van spec 03 leest `emails/**/*.tsx` al mee
(C-01, C-02, C-07, C-11, C-20). Toon volgt spec 03 §6.2: kandidaat je,
opdrachtgever en contact u, interne melding je; altijd "wij"; alinea's van
twee zinnen; geen uitroeptekens en geen streepjes tussen zinsdelen.
Plaatshouders staan tussen `{}` en worden met `fill()` ingevuld.

Hieronder staat per template de volledige tekst, blok voor blok in de
volgorde van de mail. Een blok met "als" verschijnt alleen onder die
voorwaarde.

### 6.1 Template 1: `application-confirmation` (je)

| Blok | nl | en |
|---|---|---|
| onderwerp | Wij hebben je sollicitatie ontvangen ({reference}) | We have received your application ({reference}) |
| preview | Je sollicitatie op {vacancyTitle} is goed aangekomen. Hier lees je wat er nu gebeurt. | Your application for {vacancyTitle} has arrived safely. Here is what happens next. |
| h1 | Bedankt voor je sollicitatie | Thank you for your application |
| aanhef | Hoi {greetingName}, (zonder naam: Hoi,) | Hi {greetingName}, (without name: Hi,) |
| ontvangen | Wij hebben je sollicitatie op {vacancyTitle} in {vacancyCity} goed ontvangen. Je referentienummer is {reference}. (zonder plaats: "op {vacancyTitle} goed ontvangen") | We have received your application for {vacancyTitle} in {vacancyCity}. Your reference number is {reference}. (without town: "for {vacancyTitle}") |
| vervolg | {contactName} bekijkt je sollicitatie en neemt daarna contact met je op. Dat doen wij vanaf {contactPhoneDisplay}, dus sla dat nummer op in je telefoon. | {contactName} will review your application and then get in touch with you. We will call or message you from {contactPhoneDisplay}, so save that number in your phone. |
| vervolg als `showResponseTime` (vervangt het blok hierboven) | {contactName} bekijkt je sollicitatie en belt of appt je binnen één werkdag. Dat doen wij vanaf {contactPhoneDisplay}, dus sla dat nummer op in je telefoon. | {contactName} will review your application and call or message you within one working day. We will contact you from {contactPhoneDisplay}, so save that number in your phone. |
| `FactList` titel | Wat wij van je hebben ontvangen | What we received from you |
| feiten | Referentienummer: {reference}; Vacature: {vacancyTitle} (vacature {vacancyNumber}); Telefoonnummer: {phoneDisplay}; Cv: Toegevoegd of Niet toegevoegd | Reference number: {reference}; Job: {vacancyTitle} (job {vacancyNumber}); Phone number: {phoneDisplay}; CV: Added or Not added |
| aanvullen | Klopt je telefoonnummer niet, of wil je iets aanvullen? Bel of app ons dan op {companyPhone} en noem je referentienummer. | Is your phone number wrong, or would you like to add something? Call or message us on {companyPhone} and mention your reference number. |
| knop | Bekijk meer vacatures (naar `links.vacancies`) | View more jobs |
| privacy, zonder toestemming | Wij bewaren je gegevens tot vier weken nadat je sollicitatie is afgerond. In onze privacyverklaring lees je hoe wij met je gegevens omgaan. | We keep your details until four weeks after your application has been completed. Read in our privacy statement how we handle your details. |
| privacy, met `retentionConsent` | Je hebt ons toestemming gegeven om je gegevens een jaar te bewaren voor ander werk. Wil je dat niet meer, mail dan naar {companyEmail} en wij passen het aan. | You have given us permission to keep your details for one year for other work. If you no longer want this, email {companyEmail} and we will change it. |
| privacy, met `retentionConsent` (tweede alinea) | In onze privacyverklaring lees je hoe wij met je gegevens omgaan. Daar staat ook hoe je ze laat verwijderen. | Read in our privacy statement how we handle your details. It also explains how to have them deleted. |
| groet | Met vriendelijke groet, / Jimmy en Lorenzo / Groos Personeelsdiensten | Kind regards, / Jimmy and Lorenzo / Groos Personeelsdiensten |
| voetnoot | Je krijgt deze e-mail omdat je via onze website hebt gesolliciteerd. | You are receiving this email because you applied through our website. |

Het woord "privacyverklaring" (en: "privacy statement") is een link naar
`links.privacy.solliciteren`. `{companyPhone}` en `{companyEmail}` komen uit
`company`.

### 6.2 Template 2: `registration-confirmation` (je)

| Blok | nl | en |
|---|---|---|
| onderwerp | Wij hebben je inschrijving ontvangen ({reference}) | We have received your registration ({reference}) |
| preview | Je inschrijving bij Groos is goed aangekomen. Wij bellen of appen je om kennis te maken. | Your registration with Groos has arrived safely. We will call or message you to get to know you. |
| h1 | Bedankt voor je inschrijving | Thank you for registering |
| aanhef | Hoi {greetingName}, (zonder naam: Hoi,) | Hi {greetingName}, (without name: Hi,) |
| ontvangen | Wij hebben je inschrijving goed ontvangen. Je referentienummer is {reference}. | We have received your registration. Your reference number is {reference}. |
| vervolg | Jimmy of Lorenzo belt of appt je om te horen welk werk je zoekt. Is er passend werk, dan nemen wij opnieuw contact met je op. | Jimmy or Lorenzo will call or message you to hear what work you are looking for. When there is suitable work, we will contact you again. |
| vervolg als `showResponseTime` | Jimmy of Lorenzo belt of appt je binnen één werkdag om te horen welk werk je zoekt. Is er passend werk, dan nemen wij opnieuw contact met je op. | Jimmy or Lorenzo will call or message you within one working day to hear what work you are looking for. When there is suitable work, we will contact you again. |
| `FactList` titel | Wat wij van je hebben ontvangen | What we received from you |
| feiten | Referentienummer: {reference}; Interesse in: {occupationLabels} (lijst met "en", leeg: Nog niet gekozen); Telefoonnummer: {phoneDisplay}; Cv: Toegevoegd of Niet toegevoegd | Reference number: {reference}; Interested in: {occupationLabels} (list with "and", empty: Not chosen yet); Phone number: {phoneDisplay}; CV: Added or Not added |
| aanvullen | Klopt je telefoonnummer niet, of wil je iets aanvullen? Bel of app ons dan op {companyPhone} en noem je referentienummer. | Is your phone number wrong, or would you like to add something? Call or message us on {companyPhone} and mention your reference number. |
| knop | Bekijk vacatures (naar `links.vacancies`) | View jobs |
| toestemming | Je hebt ons toestemming gegeven om je gegevens een jaar te bewaren en je te benaderen voor werk. Hebben wij twaalf weken geen contact gehad, dan sluiten wij je inschrijving af. | You have given us permission to keep your details for one year and to contact you about work. If we have had no contact for twelve weeks, we close your registration. |
| intrekken | Wil je niet meer ingeschreven staan? Mail dan naar {companyEmail}, dan verwijderen wij je gegevens. | Do you no longer want to be registered? Email {companyEmail} and we will delete your details. |
| privacy | In onze privacyverklaring lees je hoe wij met je gegevens omgaan. Daar staat ook hoe lang wij ze bewaren. | Read in our privacy statement how we handle your details. It also explains how long we keep them. |
| groet | als template 1 | as template 1 |
| voetnoot | Je krijgt deze e-mail omdat je je via onze website hebt ingeschreven. | You are receiving this email because you registered through our website. |

Privacylink: `links.privacy.inschrijven`. De lijst met beroepen wordt gemaakt
met `new Intl.ListFormat(locale, { type: "conjunction" })`.

### 6.3 Template 3: `staff-request-confirmation` (u)

| Blok | nl | en |
|---|---|---|
| onderwerp | Wij hebben uw personeelsaanvraag ontvangen ({reference}) | We have received your staff request ({reference}) |
| preview | Uw aanvraag is goed aangekomen. Wij nemen contact met u op om hem door te nemen. | Your request has arrived safely. We will contact you to go through it. |
| h1 | Bedankt voor uw aanvraag | Thank you for your request |
| aanhef | Beste {greetingName}, (zonder naam: Goedendag,) | Dear {greetingName}, (without name: Hello,) |
| ontvangen | Wij hebben uw aanvraag voor personeel goed ontvangen. Uw referentienummer is {reference}. | We have received your request for staff. Your reference number is {reference}. |
| vervolg | Jimmy of Lorenzo neemt contact met u op om de aanvraag door te nemen. Wij bespreken dan de taken, de werktijden en de startdatum. | Jimmy or Lorenzo will contact you to go through the request. We will then discuss the tasks, the working hours and the start date. |
| vervolg als `showResponseTime` | Jimmy of Lorenzo belt u binnen één werkdag om de aanvraag door te nemen. Wij bespreken dan de taken, de werktijden en de startdatum. | Jimmy or Lorenzo will call you within one working day to go through the request. We will then discuss the tasks, the working hours and the start date. |
| spoed | Heeft u snel mensen nodig? Bel ons dan direct op {companyPhone}. | Do you need people at short notice? Then call us directly on {companyPhone}. |
| spoed als `showAfterHours` (vervangt het blok hierboven) | Heeft u snel mensen nodig? Bel ons dan direct op {companyPhone}, ook buiten kantoortijden. | Do you need people at short notice? Then call us directly on {companyPhone}, also outside office hours. |
| `FactList` titel | Uw aanvraag in het kort | Your request in brief |
| feiten | Referentienummer: {reference}; Bedrijf: {companyName} (alleen als niet leeg); Personeel: {occupationLabels} (met "en"; met `hasOtherOccupation` erachter: "en ander werk", alleen ander werk: Ander werk); Aantal mensen: {headcount}; Start: Zo snel mogelijk of Vanaf {dateLabel}; Duur: label uit §5.4; Uren per week per persoon: {hoursPerWeek} (alleen als gevuld); Plaats van het werk: {workCity} (alleen als niet leeg) | Reference number: {reference}; Company: {companyName}; Staff: {occupationLabels} ("and other work", only other work: Other work); Number of people: {headcount}; Start: As soon as possible or From {dateLabel}; Duration: label from §5.4; Hours per week per person: {hoursPerWeek}; Place of work: {workCity} |
| correctie | Klopt er iets niet in deze samenvatting? Antwoord dan op deze e-mail of bel ons, en noem uw referentienummer. | Is something in this summary not correct? Reply to this email or call us, and mention your reference number. |
| privacy | Wij gebruiken uw gegevens alleen om uw aanvraag te behandelen. In onze privacyverklaring leest u hoe wij daarmee omgaan. | We only use your details to handle your request. Read in our privacy statement how we handle them. |
| groet | als template 1 | as template 1 |
| voetnoot | U krijgt deze e-mail omdat u via onze website personeel heeft aangevraagd. | You are receiving this email because you requested staff through our website. |

Privacylink: `links.privacy.opdrachtgevers`. Geen knop: de opdrachtgever
heeft niets te doen behalve wachten of bellen.

### 6.4 Template 4: `contact-confirmation` (u)

| Blok | nl | en |
|---|---|---|
| onderwerp | Wij hebben uw bericht ontvangen | We have received your message |
| preview | Uw bericht aan Groos Personeelsdiensten is goed aangekomen. | Your message to Groos Personeelsdiensten has arrived safely. |
| h1 | Bedankt voor uw bericht | Thank you for your message |
| aanhef | Beste {greetingName}, (zonder naam: Goedendag,) | Dear {greetingName}, (without name: Hello,) |
| ontvangen, bij `callback` | Wij hebben uw verzoek om terug te bellen goed ontvangen. Jimmy of Lorenzo belt u op het nummer dat u heeft ingevuld. | We have received your request to be called back. Jimmy or Lorenzo will call you on the number you entered. |
| ontvangen, bij de andere onderwerpen | Wij hebben uw bericht goed ontvangen. Jimmy of Lorenzo leest het en antwoordt u per e-mail of telefoon. | We have received your message. Jimmy or Lorenzo will read it and reply by email or phone. |
| `FactList` (zonder titel) | Onderwerp: label uit §5.4 | Subject: label from §5.4 |
| verwijzing bij `job_seeker` | Zoekt u werk? Dan kunt u zich ook direct inschrijven op onze website. | Looking for work? You can also register on our website straight away. |
| verwijzing bij `employer` | Zoekt u personeel? Dan kunt u ook direct personeel aanvragen op onze website. | Looking for staff? You can also request staff on our website straight away. |
| haast | Heeft u haast? Bel ons dan op {companyPhone}. | Are you in a hurry? Then call us on {companyPhone}. |
| privacy | Wij gebruiken uw gegevens alleen om uw bericht te beantwoorden. In onze privacyverklaring leest u hoe wij daarmee omgaan. | We only use your details to answer your message. Read in our privacy statement how we handle them. |
| groet | als template 1 | as template 1 |
| voetnoot | U krijgt deze e-mail omdat u via onze website een bericht heeft gestuurd. | You are receiving this email because you sent us a message through our website. |

Links: "inschrijven" (en: "register") naar `links.register`, "personeel
aanvragen" (en: "request staff") naar `links.staffRequest`, privacy naar
`links.privacy.berichten`. Het onderwerp van de mail noemt geen naam en geen
bericht.

### 6.5 Template 5: `application-notification` (intern, nl, je)

| Blok | Tekst |
|---|---|
| onderwerp | Nieuwe sollicitatie: {fullName} op {vacancyTitle} ({vacancyNumber}) |
| preview | Referentie {reference}. Bel de kandidaat of open de sollicitatie in Groos Beheer. |
| h1 | Nieuwe sollicitatie |
| inleiding | {fullName} heeft gesolliciteerd op {vacancyTitle}, vacature {vacancyNumber}. De sollicitatie staat in Groos Beheer onder {reference}. |
| `FactList` titel | Gegevens van de kandidaat |
| feiten | Naam: {fullName}; Telefoon: {phone.display} (link `tel:`); WhatsApp: Stuur een bericht (link `whatsappHref`); E-mail: {email} (link `mailto:`, of Niet ingevuld); Woonplaats: {city}; Mag in Nederland werken: Ja of Nee; Rijbewijs B: Ja of Nee (alleen als gevraagd); Beschikbaar vanaf: {availableFromLabel} of Direct of niet ingevuld; Cv: Ja, open het in Groos Beheer of Nee; Bericht: Ja, lees het in Groos Beheer of Nee; Een jaar bewaren voor ander werk: Ja of Nee; Taal van het formulier: Nederlands of Engels; Herkomst: {utmSource} (alleen als gevuld) |
| knop | Open de sollicitatie (naar `beheerLink`) |
| Engels formulier, als `formLocale` `en` | De kandidaat gebruikte de Engelse website. De bevestiging is daarom in het Engels verstuurd. |
| geen bijlagen | Deze melding bevat bewust geen cv en geen bericht. Die open je veilig in Groos Beheer, na inloggen met je code. |
| voetnoot | Deze melding gaat naar {companyEmail} en naar beheerders die meldingen voor sollicitaties aan hebben staan. |

Geen groet: het is een systeemmelding. Zonder werkrecht (`mayWorkInNl`
onwaar) staat er geen extra waarschuwing; de beoordeling is aan Jimmy en
Lorenzo (spec 07, hint `noHint`).

### 6.6 Template 6: `registration-notification` (intern, nl, je)

| Blok | Tekst |
|---|---|
| onderwerp | Nieuwe inschrijving: {fullName} ({reference}) |
| preview | {fullName} heeft zich ingeschreven zonder vacature. Bel of open de inschrijving in Groos Beheer. |
| h1 | Nieuwe inschrijving |
| inleiding | {fullName} heeft zich ingeschreven zonder vacature. De inschrijving staat in Groos Beheer onder {reference}. |
| `FactList` titel | Gegevens van de werkzoekende |
| feiten | Naam; Telefoon; WhatsApp; E-mail; Woonplaats; Interesse in: {occupationLabels} of Nog niet gekozen; Mag in Nederland werken; Rijbewijs B (alleen als ingevuld); Beschikbaar vanaf; Cv; Bericht; Taal van het formulier; Herkomst (zelfde vorm als template 5) |
| knop | Open de inschrijving |
| Engels formulier | De werkzoekende gebruikte de Engelse website. De bevestiging is daarom in het Engels verstuurd. |
| geen bijlagen | als template 5 |
| voetnoot | als template 5 |

### 6.7 Template 7: `staff-request-notification` (intern, nl, je)

| Blok | Tekst |
|---|---|
| onderwerp | Nieuwe personeelsaanvraag: {companyName} ({reference}) |
| preview | {companyName} zoekt {headcount} mensen in {workCity}. Bel de opdrachtgever of open de aanvraag. |
| h1 | Nieuwe personeelsaanvraag |
| inleiding | {companyName} heeft personeel aangevraagd via de website. De aanvraag staat in Groos Beheer onder {reference}. |
| `FactList` titel | De aanvraag |
| feiten | Bedrijf: {companyName}; KvK-nummer: {kvkNumber} (alleen als gevuld); Contactpersoon: {contactName}; Telefoon (link `tel:`); WhatsApp (link); E-mail (link `mailto:`); Personeel: {occupationLabels}; Ander werk: {occupationOther} (alleen als gevuld); Aantal mensen: {headcount}; Start: Zo snel mogelijk of Vanaf {datum}; Duur: label; Uren per week per persoon (alleen als gevuld); Plaats van het werk: {workCity}; Toelichting: Ja, lees het in Groos Beheer of Nee; Taal van het formulier; Herkomst (alleen als gevuld) |
| knop | Open de aanvraag |
| Engels formulier | De opdrachtgever gebruikte de Engelse website. De bevestiging is daarom in het Engels verstuurd. |
| geen bijlagen | De toelichting staat niet in deze melding. Die lees je in Groos Beheer, na inloggen met je code. |
| voetnoot | Deze melding gaat naar {companyEmail} en naar beheerders die meldingen voor aanvragen aan hebben staan. |

### 6.8 Template 8: `contact-notification` (intern, nl, je)

| Blok | Tekst |
|---|---|
| onderwerp, bij `callback` | Terugbelverzoek van {name} |
| onderwerp, anders | Nieuw bericht via de website van {name} |
| preview, bij `callback` | {name} wil teruggebeld worden. Het nummer staat in deze melding. |
| preview, anders | Onderwerp: {topicLabel}. Lees het bericht in Groos Beheer. |
| h1 | Terugbelverzoek of Nieuw bericht |
| inleiding, bij `callback` | {name} vraagt om teruggebeld te worden op {phone.display}. Het verzoek staat ook in Groos Beheer bij Berichten. |
| inleiding, anders | {name} heeft een bericht gestuurd via het contactformulier. Het onderwerp is {topicLabel}. |
| `FactList` (zonder titel) | Naam; Telefoon (link, of Niet ingevuld); WhatsApp (alleen met telefoon); E-mail (link, of Niet ingevuld); Onderwerp: {topicLabel}; Bericht: Ja, lees het in Groos Beheer of Nee; Taal van het formulier |
| knop | Open het bericht |
| geen bijlagen | Deze melding bevat bewust niet de tekst van het bericht. Die lees je in Groos Beheer, na inloggen met je code. |
| voetnoot | Deze melding gaat naar {companyEmail} en naar beheerders die meldingen voor berichten aan hebben staan. |

### 6.9 Gedeelde copy in de bouwstenen

Deze tekst staat als `COPY` in de bestanden onder `emails/components/` en
geldt voor alle templates.

| Bouwsteen en blok | nl | en |
|---|---|---|
| `EmailSignoff` | Met vriendelijke groet, / Jimmy en Lorenzo / Groos Personeelsdiensten | Kind regards, / Jimmy and Lorenzo / Groos Personeelsdiensten |
| `EmailFooter` adresregel | {street}, {postalCode} {city}. Langskomen kan alleen op afspraak. | {street}, {postalCode} {city}. Visits are by appointment only. |
| `EmailFooter` contactregel | Telefoon {phoneDisplay} · E-mail {email} · {websiteLabel} | Phone {phoneDisplay} · Email {email} · {websiteLabel} |
| `EmailFooter` KvK, als gevuld | KvK-nummer {kvk} | Chamber of Commerce (KvK) number {kvk} |
| `EmailFooter` kantoortijden, als gevuld | Kantoortijden: {officeHours} | Office hours: {officeHours} |
| `FactList` ja en nee | Ja; Nee | Yes; No |
| Lege waarde | Niet ingevuld | Not filled in |
| Taal van het formulier (alleen intern) | Nederlands; Engels | n.v.t. |
| Logo, alt-tekst | Groos Personeelsdiensten | Groos Personeelsdiensten |

De middenpunt (U+00B7) scheidt alleen losse gegevens in de voettekst en
staat nooit tussen zinsdelen.

### 6.10 Auth-mails (nl, je, `supabase/templates/*.html`)

Alle vijf gebruiken hetzelfde HTML-skelet: tabelopmaak van 600 px, witte
kaart op `#F5F6FA`, blauwe balk van 4 px in `#2741C9`, systeemlettertype,
tekst `#0B0F2E` in 16 px, voettekst `#4B5170` in 13 px. De hexwaarden zijn
die van `lib/brand.ts` (`ice`, `brand`, `foreground`, `muted`); wijzigt spec 02
een kleur, dan wijzigt deze spec de HTML mee. Geen afbeeldingen, zodat de
mail ook zonder geladen plaatjes duidelijk is.

```html
<!doctype html>
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="color-scheme" content="light"><title>Groos Beheer</title></head>
<body style="margin:0;padding:24px 0;background:#F5F6FA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0B0F2E;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border:1px solid #E3E6EF;border-radius:12px;overflow:hidden;">
<tr><td style="height:4px;background:#2741C9;font-size:0;line-height:0;">&nbsp;</td></tr>
<tr><td style="padding:32px 24px;">
<p style="margin:0 0 24px;font-size:15px;font-weight:600;">Groos Personeelsdiensten</p>
<h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;font-weight:600;"><!-- KOP --></h1>
<!-- ALINEA'S: <p style="margin:0 0 16px;font-size:16px;line-height:1.55;"> -->
<!-- KNOP: <a href="..." style="display:inline-block;background:#2741C9;color:#FFFFFF;text-decoration:none;font-weight:600;font-size:16px;padding:13px 22px;border-radius:999px;">...</a> -->
</td></tr>
<tr><td style="padding:16px 24px 24px;border-top:1px solid #E3E6EF;font-size:13px;line-height:1.5;color:#4B5170;">
Groos Personeelsdiensten B.V., Den Haag. Deze e-mail is verstuurd vanuit Groos Beheer, de beheeromgeving van onze website.
</td></tr>
</table></td></tr></table>
</body></html>
```

**A1 `invite.html`.** Onderwerp: Je bent uitgenodigd voor Groos Beheer.

| Blok | Tekst |
|---|---|
| h1 | Welkom bij Groos Beheer |
| alinea | Je hebt toegang gekregen tot Groos Beheer, de beheeromgeving van de website van Groos Personeelsdiensten. Met de knop hieronder kies je eerst een wachtwoord van minimaal 12 tekens. |
| knop | Wachtwoord kiezen (link uit §5.5) |
| alinea | Daarna koppel je een authenticator-app op je telefoon, zoals Google Authenticator of Microsoft Authenticator. Die app geeft je bij elke keer inloggen een code van zes cijfers. |
| alinea | De link werkt één keer en verloopt na 24 uur. Is hij verlopen, vraag dan een nieuwe uitnodiging aan bij wie jou heeft uitgenodigd. |
| alinea | Werkt de knop niet? Kopieer dan deze link en plak hem in je browser: (link als tekst) |
| alinea | Verwachtte je deze e-mail niet? Dan kun je hem negeren, want zonder de knop gebeurt er niets. |

**A2 `recovery.html`.** Onderwerp: Stel een nieuw wachtwoord in voor Groos
Beheer.

| Blok | Tekst |
|---|---|
| h1 | Nieuw wachtwoord instellen |
| alinea | Wij kregen een verzoek om het wachtwoord van je account voor Groos Beheer te herstellen. Met de knop hieronder kies je een nieuw wachtwoord. |
| knop | Nieuw wachtwoord kiezen (link uit §5.5) |
| alinea | Voordat je een nieuw wachtwoord kiest, vraagt Groos Beheer de code uit je authenticator-app. De link werkt één keer en verloopt na 24 uur. |
| alinea | Werkt de knop niet? Kopieer dan deze link en plak hem in je browser: (link als tekst) |
| alinea | Heb je dit niet zelf aangevraagd? Dan kun je deze e-mail negeren, want je wachtwoord verandert pas als je op de knop drukt. |

**A3 `password-changed.html`.** Onderwerp: Je wachtwoord voor Groos Beheer is
gewijzigd.

| Blok | Tekst |
|---|---|
| h1 | Je wachtwoord is gewijzigd |
| alinea | Het wachtwoord van je account {{ .Email }} voor Groos Beheer is zojuist gewijzigd. Heb je dat zelf gedaan, dan hoef je niets te doen. |
| alinea | Heb je je wachtwoord niet zelf gewijzigd? Neem dan direct contact op met Djulan van SKUU, de technisch beheerder van de website. |
| alinea | Inloggen doe je op {{ .SiteURL }}/beheer/inloggen. |

**A4 `mfa-factor-enrolled.html`.** Onderwerp: Er is een authenticator-app
gekoppeld aan Groos Beheer.

| Blok | Tekst |
|---|---|
| h1 | Authenticator-app gekoppeld |
| alinea | Aan je account {{ .Email }} voor Groos Beheer is zojuist een authenticator-app gekoppeld. Heb je dat zelf gedaan, dan hoef je niets te doen. |
| alinea | Heb je dit niet zelf gedaan? Neem dan direct contact op met Djulan van SKUU, de technisch beheerder van de website. |

**A5 `mfa-factor-unenrolled.html`.** Onderwerp: Er is een authenticator-app
losgekoppeld van Groos Beheer.

| Blok | Tekst |
|---|---|
| h1 | Authenticator-app losgekoppeld |
| alinea | Van je account {{ .Email }} voor Groos Beheer is zojuist een authenticator-app losgekoppeld. Bij de volgende keer inloggen vraagt Groos Beheer je om opnieuw een app te koppelen. |
| alinea | Heb je dit niet zelf gedaan? Neem dan direct contact op met Djulan van SKUU, de technisch beheerder van de website. |

Kent het dashboard voor een beveiligingsmelding geen `{{ .Email }}`, dan
vervalt "{{ .Email }}" en wordt de zin "Op je account voor Groos Beheer is
zojuist ...". De mails voor aanmelden, magic link, e-mailwijziging en
herauthenticatie worden niet gebruikt (aanmelden staat uit, geen magic link,
geen e-mailwijziging in fase 1) en krijgen geen eigen tekst.

## 7 SEO

Niet van toepassing op de inhoud: mails worden niet geïndexeerd. Wel:

- `/api/webhooks/resend` en `/api/dev/e-mail` vallen onder `/api`, dus buiten
  de proxy, met `X-Robots-Tag: noindex, nofollow` (spec 13) en
  `Disallow: /api` in `robots.txt` (spec 12). Ze staan niet in de sitemap of
  `llms.txt`.
- Links in mails gaan naar de canonieke, gelokaliseerde URL's
  (`localizedPath`), zonder UTM-parameters en zonder klikregistratie, zodat
  Analytics geen persoonsgebonden herkomst krijgt.

## 8 Toegankelijkheid en performance

**Toegankelijkheid van mails.**

- `<html lang>` gelijk aan de taal van de mail; één h1; `FactList`-titels als
  h2; geen tabellen voor inhoud (React Email gebruikt
  `role="presentation"` voor opmaaktabellen).
- Lettergrootte minimaal 16 px voor tekst en 13 px voor de voettekst;
  regelhoogte 1,5 of meer; kolom van maximaal 600 px die op 320 px schaalt.
- Contrast volgens spec 02: tekst `foreground` op wit 7:1 of meer, `muted`
  op wit en op `tint` minimaal 4,5:1, witte knoptekst op `brand` minimaal
  4,5:1. Links zijn onderstreept, zodat kleur niet de enige drager is.
- Elke knop heeft een tekst die zegt wat er gebeurt ("Open de sollicitatie",
  "Wachtwoord kiezen") en staat naast informatie die ook zonder knop werkt;
  telefoonnummers zijn `tel:`-links.
- Het logo heeft als alt-tekst de bedrijfsnaam; de mail is volledig leesbaar
  met geblokkeerde afbeeldingen.
- Elke mail heeft een platte-tekstversie (`text`), afgeleid van dezelfde
  HTML, zonder koppen in hoofdletters.
- Alleen een licht kleurschema (`color-scheme: light`); clients met een
  donkere modus kunnen kleuren omdraaien, het contrast blijft dan bij
  zwart op wit of wit op zwart.

**Performance en betrouwbaarheid.**

- Verzenden gebeurt in `after()` (spec 07), dus de bezoeker wacht er nooit
  op. Twee mails na elkaar duren samen ongeveer 0,5 tot 1 seconde.
- Eén `Resend`-instantie per proces; één database-insert per mail; geen
  extra leesquery's buiten de drie of vier uit §4.10.
- Renderen gebeurt op de server met de Node-variant van
  `@react-email/render`. De templates komen nooit in een clientbundel:
  `lib/email/*` begint met `import "server-only"` en geen client component
  importeert `emails/*`.
- Eén nieuwe poging bij 429, 5xx of een netwerkfout; daarna `failed`. De
  idempotentiesleutel voorkomt een dubbele mail bij een tweede poging.
- De webhookroute antwoordt binnen 1 seconde met één update per gebeurtenis.

## 9 21st.dev-opdracht voor sub-agents

Niet van toepassing. Deze module maakt e-mails met React Email en een paar
server-modules zonder zichtbaar element op de site. Componenten van 21st.dev
zijn gebouwd voor de browser: ze leunen op Tailwind-klassen, CSS-variabelen,
flexbox, grid en vaak op JavaScript of animaties, en dat alles werkt niet of
slecht in mailprogramma's als Outlook en Gmail, die alleen inline stijlen en
tabelopmaak betrouwbaar tonen. Een kandidaat uit 21st.dev zou dus volledig
herschreven moeten worden en levert niets op boven de primitives van
`@react-email/components` met de tokens uit `lib/brand.ts`. De bouw-agent van
deze module spawnt daarom geen sub-agents en roept `search`,
`get_inspiration` en `get_component` niet aan. De voorbeeldroute uit §4.12 is
een ontwikkelhulp zonder ontwerp.

## 10 Bouwopdracht

> **Notitie.** Bouwstap 6 voor deze spec is gecommit (99e1a03, gemerged in f20eea8). Bouwstap 3b voert de nazorg uit (00 §6, B-52).

Dit is bouwstap 6 van 00 §6, samen met spec 07. Voorwaarden: spec 10
(tabellen, `lib/supabase/admin.ts`, `lib/data/options.ts`), spec 01
(`lib/site.ts`, `lib/routes.ts`), spec 02 (`lib/brand.ts`,
`public/brand/logo-email.png`), spec 03 (`lib/claims.ts`, `lib/format.ts`) en
spec 08 voor `app/beheer/_lib/paths.ts`. Bestaat `paths.ts` nog niet, maak dan
alleen dat bestand volgens spec 08 §4.2; spec 08 neemt het over.

1. **Lezen.** 00 §3 en §4, deze spec, spec 07 §5.5 en §5.8, spec 10 §5.3
   (`email_log`, `admin_profiles`) en §5.8, spec 13 §5.1, §5.5 en §10 A8, D6,
   D7, spec 08 §4.2 en §4.5, en `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/after.md`.
2. **Packages.** `npm install resend@^6 @react-email/components@^1` (B-37).
   Controleer met `npm ls @react-email/render` dat versie 2.x in de boom zit.
   Geen andere packages.
3. **Typen en configuratie.** Maak `lib/email/types.ts`, `config.ts`,
   `sanitize.ts`, `log.ts` (§4.3 tot en met §4.7).
4. **Verzenden.** Maak `lib/email/send.ts` (§4.5) en `recipients.ts`,
   `company.ts` (§4.8, §4.9).
5. **Bouwstenen.** Maak `emails/theme.ts`, `emails/types.ts` en
   `emails/components/*` (§4.13).
6. **Templates.** Maak de acht templates met `COPY` uit §6.1 tot en met
   §6.8 en de gedeelde copy uit §6.9, `emails/previews.ts` (alle adressen op `example.com`, namen "Test
   Kandidaat", "Testbedrijf B.V.", varianten `consent`, `callback`, `claims`,
   `noName`, `en`) en `emails/index.ts`.
7. **Formulierfuncties.** Maak `lib/email/forms.ts` (§4.10). Vervang de stub
   die spec 07 in stap 5 maakte; de exports zijn gelijk, dus `app/actions/*`
   verandert niet. Staat er nog `// TODO spec 11`, haal die weg.
8. **Voorbeeldroute.** Maak `app/api/dev/e-mail/route.ts` (§4.12). Open
   `http://localhost:3000/api/dev/e-mail` en bekijk alle templates in nl en en
   op 1280 px en, met DevTools, op 390 en 320 px.
9. **Webhook.** Maak `lib/email/webhook.ts` en
   `app/api/webhooks/resend/route.ts` (§4.11). Geef spec 13 door dat de
   webhook wordt gebouwd, zodat `RESEND_WEBHOOK_SECRET` in §5.1 blijft.
10. **Auth-templates.** Maak de vijf bestanden in `supabase/templates/` met
    het skelet en de teksten van §6.10. `supabase/config.toml` verandert niet
    (§5.6).
11. **Auth-templates toepassen.** Plak de vijf bestanden (Invite user, Reset
    password en de drie Security notifications uit §6.10) in het dashboard van
    `groos-dev` (spec 13 A2); geen `supabase config push` (B-39). Gebruik de
    onderwerpen uit §5.6 en zet Email OTP Expiration op 86400 seconden.
    Controleer daarna in het dashboard onder Authentication, Emails dat Invite
    user en Reset password de Nederlandse tekst tonen, en onder Security
    notifications de drie meldingen. Productie volgt in spec 13 D7 met dezelfde
    bestanden.
12. **Tests (Vitest, spec 14).**
    - `tests/unit/email/verzenden.test.ts`: `emailMode()` voor elke rij van
      de tabel in §4.4; `sendEmail()` met een mock van `resend` en van
      `createSupabaseAdminClient`: console zonder sleutel (geen aanroep,
      rij `queued`/`console`), redirect met `[test voor ...]`, 500 gevolgd
      door 200 (twee aanroepen, `sent`), twee keer 500 (`failed`), gooiende
      Supabase-insert (geen exception naar buiten).
    - `tests/unit/email/templates.test.ts`: render elk template in elke
      toegestane taal met `previewProps` en elke variant via
      `React.createElement`; controleer dat HTML en tekst geen `{` of `}`
      bevatten, geen `!`, geen U+2013 of U+2014, geen " - ", geen
      "we " in nl, geen tekst uit het `message`-veld van de voorbeelddata
      ("GEHEIME TESTTEKST"), dat `lang` klopt, dat de tekstversie de
      referentie bevat en dat het onderwerp korter is dan 150 tekens.
    - `tests/unit/email/opschonen.test.ts`: `safeEcho("Jan")` geeft "Jan";
      `safeEcho("Bezoek www.spam.nl")`, `safeEcho("a@b.nl")` en
      `safeEcho("http://x")` geven `null`; `safeEcho("Anne-Marie")` en
      `safeEcho("D'Souza")` blijven staan; `cleanError` vervangt adressen;
      `hashRecipients(["B@x.nl", "a@x.nl"])` is gelijk aan
      `hashRecipients(["a@x.nl", "b@x.nl"])` en 64 hextekens lang.
    - `tests/unit/email/webhook.test.ts`: een payload getekend met een
      testsleutel slaagt; een gewijzigde body, een verkeerde sleutel en een
      tijdstempel van 10 minuten oud falen; de `POST`-handler geeft 404
      zonder `RESEND_WEBHOOK_SECRET` en 401 bij een ongeldige handtekening.
13. **Lokaal testen zonder sleutel.** `.env.local` zonder `RESEND_API_KEY`.
    Verstuur elk formulier van spec 07. Controleer per inzending het blok in
    de terminal en met de Supabase MCP (`execute_sql`):
    `select template, status, provider_message_id, entity_type from email_log order by id desc limit 8`.
14. **Lokaal testen met sleutel.** `RESEND_API_KEY`, `EMAIL_FROM` en
    `EMAIL_DEV_TO` volgens spec 13 A8. Verstuur een sollicitatie in nl, een
    in en en een aanvraag. Controleer in de inbox van `EMAIL_DEV_TO` het
    onderwerp met `[test voor ...]`, de opmaak in Gmail op telefoon en
    desktop, de platte tekst ("Origineel weergeven") en dat er geen bijlage
    is. Zet daarna `RESEND_API_KEY` op een ongeldige waarde en controleer
    `failed` in `email_log` en de bedankpagina.
15. **Interne ontvangers.** Zet met SQL `notify_applications = false` voor
    het testprofiel, verstuur een sollicitatie en controleer in de terminal
    dat alleen `info@groospersoneelsdiensten.nl` in de lijst staat; zet de
    vlag terug.
16. **Verifiëren.** `npm run verify`, `npm run check -- --warn`,
    `npm run check:copy`, `npm run test`, `npx playwright test tests/e2e/formulieren --project=chromium`
    (twee rijen in `email_log` per formulier, spec 14 §5.7) en
    `grep -rn "attachments" lib/email emails` (geen treffers). Faalt
    `next build` met een melding over `react-dom/server` in een
    servercomponent, voeg dan in overleg met spec 13
    `serverExternalPackages: ["@react-email/components", "@react-email/render"]`
    toe aan `next.config.mjs` en noteer dat in 00 §7.
17. **Productie (bouwstap 10, spec 13).** Na E3 (domein geverifieerd): de
    sleutel `groos-productie` in Vercel, SMTP volgens D6, de Auth-templates
    volgens D7, de webhook met `RESEND_WEBHOOK_SECRET`. Daarna één echte
    sollicitatie met het eigen adres van Djulan en controle in Gmail op
    "spf=pass", "dkim=pass" en "dmarc=pass" (Origineel weergeven), en één
    uitnodiging in productie.

## 11 Acceptatiecriteria

| Id | Criterium | Dient |
|---|---|---|
| AC-11-01 | Zonder `RESEND_API_KEY` geeft een sollicitatie op `http://localhost:3000/vacatures/glazenwasser-den-haag-1001` twee blokken `[e-mail] aan ... · onderwerp ... · template ...` in de terminal (`application-confirmation` en `application-notification`), geen verzoek naar `api.resend.com` en twee rijen in `email_log` met `status = 'queued'`, `provider_message_id = 'console'`, `entity_type = 'application'` en `entity_id` gelijk aan het record. | E-11-05, E-11-07 |
| AC-11-02 | Met sleutel en `EMAIL_DEV_TO` komen beide mails alleen op het adres van `EMAIL_DEV_TO` binnen, met onderwerp `[test voor test.kandidaat@example.com] Wij hebben je sollicitatie ontvangen (S-2026-....)`; `email_log` toont `sent` met een id van Resend. | E-11-01, E-11-07 |
| AC-11-03 | De bevestiging bevat de referentie, de vacaturetitel en het nummer, de naam en het nummer van de contactpersoon (vacature 1001 uit de seed: "Jimmy" en 06 83 35 19 85), een link naar `/privacyverklaring#solliciteren` en de afzender `Groos Personeelsdiensten` met reply-to `info@groospersoneelsdiensten.nl`. | E-11-02, E-11-04 |
| AC-11-04 | Een sollicitatie met het bericht "GEHEIME TESTTEKST" en een cv geeft een bevestiging en een interne melding zonder die tekst (HTML en platte tekst doorzocht), zonder bijlage (`Content-Disposition: attachment` ontbreekt in de bron) en zonder link naar Supabase Storage. | E-11-04 |
| AC-11-05 | Een sollicitatie vanaf `/en/vacatures/<slug>` geeft een Engelse bevestiging (`<html lang="en">`, onderwerp "We have received your application") en een Nederlandse interne melding met de regel "De kandidaat gebruikte de Engelse website." | E-11-03 |
| AC-11-06 | Een inschrijving met beroepen schoonmaker en glazenwasser geeft `registration-confirmation` met "Interesse in: Glazenwasser en Schoonmaker" (volgorde `sort_order`), de toestemmingsalinea en een link naar `/privacyverklaring#inschrijven`. | E-11-02 |
| AC-11-07 | Een aanvraag met bedrijfsnaam "Bezoek www.spam.nl" geeft een bevestiging zonder regel "Bedrijf" en zonder de tekst "www.spam.nl"; de interne melding toont de bedrijfsnaam wel. Een voornaam "http://x" geeft de aanhef "Hoi," zonder naam. | E-11-04 |
| AC-11-08 | Een contactbericht met onderwerp "Bel mij terug" zonder e-mailadres geeft precies één rij in `email_log` (`contact-notification`) met onderwerp "Terugbelverzoek van <naam>"; een spambericht (drie links) geeft nul rijen. | E-11-02, E-11-08 |
| AC-11-09 | De interne melding gaat naar `info@groospersoneelsdiensten.nl` plus elk actief profiel met de juiste `notify_*`-vlag, zonder dubbele adressen; met `notify_applications = false` voor alle profielen staat alleen `info@` in de terminalregel `aan`. | E-11-09 |
| AC-11-10 | De knop in `application-notification` linkt naar `http://localhost:3000/beheer/sollicitaties/S-2026-....` (lokaal) en op productie naar `https://www.groospersoneelsdiensten.nl/beheer/sollicitaties/...`; het telefoonnummer is een `tel:+31...`-link. | E-11-09 |
| AC-11-11 | Met een ongeldige `RESEND_API_KEY` en `EMAIL_DEV_TO` gezet blijft de sollicitatie bewaard, komt de bezoeker op `/bedankt/sollicitatie` en staat in `email_log` `status = 'failed'` met een `error` zonder e-mailadres. | E-11-06 |
| AC-11-12 | Met `VERCEL_ENV=production` en zonder sleutel (test met `emailMode()`) is de modus `misconfigured` en wordt niets verstuurd; met `VERCEL_ENV=production` en sleutel worden `EMAIL_DEV_TO` en `EMAIL_FROM` genegeerd. | E-11-07 |
| AC-11-13 | Met alle vlaggen in `lib/claims.ts` op `false` bevat geen enkele mail "binnen één werkdag", "buiten kantoortijden" of een kantoortijd; met `responseTime` op `true` (variant `claims` in de voorbeeldroute) staat "binnen één werkdag" in templates 1, 2 en 3. | E-11-11 |
| AC-11-14 | `npm run test` slaagt voor de vier testbestanden van §10 stap 12, inclusief: geen open plaatshouder, geen uitroepteken, geen gedachtestreepje en geen "we" in nl in alle templates en varianten. | E-11-02, E-11-10 |
| AC-11-15 | `npm run check:copy` meldt geen fout in `emails/**/*.tsx`; `npm run check -- --warn` meldt geen "Wilk" of "Versseput" in `emails/` (K7). | E-11-02 |
| AC-11-16 | `http://localhost:3000/api/dev/e-mail` toont een lijst met alle acht templates; elk template rendert als HTML en als tekst in de toegestane talen; onder `npm start` geeft dezelfde URL 404. | E-11-14 |
| AC-11-17 | Op 320 px breed (Gmail-app of DevTools op de voorbeeldroute) heeft geen mail een horizontale scroll; tekst is minimaal 16 px; het logo heeft alt-tekst; elke mail heeft een `text`-deel (zichtbaar via "Origineel weergeven"). | E-11-10 |
| AC-11-18 | `POST /api/webhooks/resend` zonder `RESEND_WEBHOOK_SECRET` geeft 404; met secret en ongeldige handtekening 401; met een geldig getekende `email.bounced` voor een bestaande `provider_message_id` 200 en daarna `status = 'bounced'` in `email_log`, zichtbaar in het overzicht van `/beheer` onder "E-mail niet aangekomen" (spec 08). | E-11-13 |
| AC-11-19 | Een `email.delivered` na `email.bounced` verandert de status niet terug; een tweede identieke gebeurtenis verandert niets (idempotent). | E-11-13 |
| AC-11-20 | `email_log` bevat geen kolom met inhoud, en `select to_hash from email_log` geeft alleen waarden van 64 hextekens; `to_hash` van een bevestiging is gelijk aan `encode(sha256('test.kandidaat@example.com'), 'hex')`. | E-11-05 |
| AC-11-21 | Na het plakken van de templates in het dashboard van `groos-dev` toont het dashboard voor Invite user het onderwerp "Je bent uitgenodigd voor Groos Beheer"; een uitnodiging (na SMTP via Resend, spec 13 D6 stap 4) komt aan met de Nederlandse tekst, en de knop leidt via `/beheer/auth/bevestigen?token_hash=...&type=invite` naar `/beheer/wachtwoord-instellen`. | E-11-12 |
| AC-11-22 | Wachtwoord vergeten op `/beheer/wachtwoord-vergeten` geeft de Nederlandse herstelmail met een link `.../beheer/auth/bevestigen?token_hash=...&type=recovery`; na het wijzigen komt de melding "Je wachtwoord voor Groos Beheer is gewijzigd". | E-11-12 |
| AC-11-23 | Een statuswijziging van een sollicitatie in `/beheer` (bijvoorbeeld naar `rejected`) maakt geen nieuwe rij in `email_log` en verstuurt geen mail. | E-11-15 |
| AC-11-24 | Op productie (bouwstap 10) toont een echte bevestiging in Gmail "spf=pass", "dkim=pass" met `d=mail.groospersoneelsdiensten.nl` en "dmarc=pass", en komt hij niet in de spammap. | E-11-01 |
| AC-11-25 | `grep -rn "import \"server-only\"" lib/email/{config,send,log,recipients,company,forms,webhook}.ts` vindt alle zeven bestanden; geen bestand onder `components/` of `app/[locale]/` importeert uit `emails/` of `lib/email/`. | E-11-01 |

## 12 Open vragen en aannames

| Onderwerp | Aanname in deze spec | Bevestigt | Gevolg als het anders is |
|---|---|---|---|
| Afzenderadres sitemails | `Groos Personeelsdiensten <website@mail.groospersoneelsdiensten.nl>` met reply-to `info@`. Spec 13 laat adres en naam aan deze spec. | Djulan, Jimmy | Alleen `EMAIL_FROM_DEFAULT`. |
| Webhook in fase 1 | Wordt gebouwd, zodat bounces in het overzicht van spec 08 verschijnen. `RESEND_WEBHOOK_SECRET` blijft in spec 13 §5.1. | kruiscontrole met spec 13 | Zonder webhook blijven rijen op `sent`; route en variabele vervallen, spec 08 toont dan alleen `failed`. |
| Mail na mislukte verzending | Geen aparte mail aan Groos in fase 1; het overzicht van `/beheer` toont `failed` en `bounced`. Context/11 stelde template 11 voor de MVP voor. | Jimmy en Lorenzo | Eén extra template `delivery-failed` en een aanroep vanuit `applyWebhookEvent`. |
| Teksten buiten `messages/` | Gesloten: vastgelegd in 00 §4.4 punt 7 en B-45. Mailcopy staat als `COPY` in `emails/*.tsx`, net als de juridische pagina's. | Djulan, spec 03 | In `messages/`: een eigen namespace `emails` in nl en en, en `getTranslations({ locale })` in `lib/email/forms.ts`. |
| Echo van gegevens | Bevestigingen tonen alleen telefoon, referentie, vacature, vaste keuzes en namen die `safeEcho` doorlaat; geen woonplaats, bericht of toelichting. Context/11 §6.6 noemde titel, plaats en samenvatting; de plaats van de kandidaat is weggelaten omdat het vrije tekst is. | Jimmy en Lorenzo, jurist | Meer echo: één regel per veld in het template. |
| Persoonsgegevens in interne meldingen | De melding bevat naam, telefoon, e-mail en woonplaats, maar geen cv, bericht of toelichting. Mails in `info@` blijven daardoor vier weken beperkt tot contactgegevens (spec 09 V-07). | Jimmy en Lorenzo, jurist | Alleen referentie en knop: de feitenlijst wordt korter, de beheerlink blijft. |
| `to_hash` bij meerdere ontvangers | Eén rij per interne melding met de hash van de gesorteerde lijst, zodat spec 07 en 14 twee rijen per formulier tellen. | Djulan | Eén rij per ontvanger: AC-07-09 en spec 14 §5.7 tellen dan meer rijen. |
| Status in consolemodus | `queued` met `provider_message_id = 'console'`. Spec 14 §5.7 laat deze keuze aan spec 11. | spec 14 | Alleen de tabel in §4.6 en AC-11-01. |
| Productiecriterium | Alleen `VERCEL_ENV === "production"` verstuurt echt; `next start` lokaal geldt niet als productie. | Djulan, spec 14 | Geen gevolg voor tests zolang `EMAIL_DEV_TO` in de `webServer` staat. |
| Contactpersoon in de bevestiging | De contactpersoon van de vacature (`contact_admin_id`) als die actief is en `phone_e164` gevuld heeft, anders "Jimmy of Lorenzo" met het hoofdnummer. | Jimmy en Lorenzo | Altijd het hoofdnummer: één regel in `forms.ts`. |
| Geldigheid van Auth-links | 24 uur voor uitnodiging en herstel: Djulan zet Email OTP Expiration in het dashboard op 86400 seconden (§5.6); Supabase kent één instelling voor beide. | Djulan | Korter: tekst "verloopt na 24 uur" aanpassen in A1 en A2. |
| `supabase/templates/` | Deze spec claimt `supabase/templates/*` (staat niet in 00 §4.4a) als bron van de Auth-mailteksten; Djulan plakt ze per project in het dashboard (spec 13 A2, D7). `supabase/config.toml` krijgt geen blokken van deze spec (B-39). | master-agent | Bij een andere eigenaar alleen verplaatsen. |
| Beveiligingsmeldingen | Supabase biedt meldingen voor gewijzigd wachtwoord en voor het koppelen en loskoppelen van een factor, met `{{ .Email }}`. Context/11 noemde ze als template 16. | Djulan (controle in het dashboard) | Bestaan ze niet: A3 tot en met A5 vervallen, geen andere gevolgen. |
| Contact bij misbruik | De beveiligingsmeldingen noemen "Djulan van SKUU" als technisch beheerder (spec 09, incidentplan). | Djulan, Jimmy | Andere naam of een telefoonnummer: drie HTML-bestanden. |
| Links in mails van scanners | Virusscanners (Safe Links) kunnen de link uit de uitnodiging vooraf openen. De route van spec 08 verifieert de `token_hash` direct bij GET, waardoor zo'n scanner de link kan opgebruiken. | spec 08, Djulan | Spec 08 toont eerst een pagina met een knop die de verificatie doet; de mailtekst blijft gelijk. |
| Webfonts | Geen Instrument Sans of Onest in mails, alleen een systeemlettertype; mailprogramma's laden webfonts onbetrouwbaar. | Djulan | `<Font>` van React Email met Onest als eerste keuze in `EmailLayout`. |
| Verzendlimiet Resend Free | 100 mails per dag en 3.000 per maand; met twee mails per formulier zijn dat ongeveer 50 formulieren per dag. | Jimmy (spec 13 §5.5) | Bij krapte Resend Pro (20 dollar per maand); geen codewijziging. |
| `react-dom/server` in de serverlaag | `@react-email/render` werkt in Server Actions en route handlers van Next 16 zonder extra instelling. | test in §10 stap 16 | Anders `serverExternalPackages` in `next.config.mjs` (spec 13). |
| Cron `herinneringen` | `/api/cron/herinneringen` is fase 2 (spec 15); spec 13 heeft drie crons. In fase 1 verstuurt geen cron-taak mail. | spec 13, spec 15 | Een herinnering per mail na acht weken (B-07) is een fase 2-template met een eigen route. |
| Statusmails vanuit het beheer | Geen in fase 1 (spec 08 §3.2, B-20). Fase 2 krijgt `sendApplicationStatusEmail` (§3.3). | Jimmy en Lorenzo | In fase 1: twee templates en een keuze in de statusdialoog van spec 08. |
