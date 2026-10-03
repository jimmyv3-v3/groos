# 07 Formulieren en leads

| Status | Fase | Hangt af van | Bronnen |
|---|---|---|---|
| concept, ter goedkeuring aan Djulan | 1 | 10 (tabellen, storage-helpers, clients), 11 (e-mailfuncties), 01 (routes, `lib/site.ts`, `lib/routes.ts`, `Breadcrumbs`), 03 (toon, `common.*`, `header.nav.*`, `lib/claims.ts`), 06 (`resolveVacancyContact`), 09 (privacyteksten, `PRIVACY_NOTICE_VERSION`), 13 (BotID, WAF) | context/11 §2.1, §6.1 tot en met §6.4, §7.3, §8.1, §8.3, §9.6; context/09 §5, §7; context/13 §4, §5, §8; context/08 §2.6, §4.2, §6.5 tot en met §6.7, §6.14; context/04 (Sollicitatieproces, Conclusie); 00 §3.2 (B-04, B-07, B-08, B-12, B-13, B-17, B-18, B-20 tot en met B-23, B-31, B-36, B-37), 00 §4; `node_modules/next/dist/docs/01-app/02-guides/forms.md`, `.../02-guides/server-actions.md`, `.../03-api-reference/04-functions/after.md`, `.../04-functions/redirect.md` |

## 1 Doel

Deze module levert de vier formulieren waarmee de site leads oplevert: solliciteren op een vacature, inschrijven zonder vacature, personeel aanvragen en een contactbericht (met "bel mij terug" als onderwerp). Elk formulier valideert met één gedeeld zod 4-schema in de browser en op de server, schrijft via een Server Action een record in Supabase (spec 10), roept de bevestiging en de interne melding van spec 11 aan en stuurt door naar een eigen bedankpagina. De cv gaat buiten de Server Action om rechtstreeks naar de privébucket `cvs`, via een signed upload URL die de server pas na de BotID-controle uitgeeft. De module levert ook de pagina's `/inschrijven`, `/werkgevers/personeel-aanvragen`, `/contact` en de vier bedankpagina's, en zet bellen en WhatsApp naast elk formulier als gelijkwaardige route. Doel is dat een werkzoekende op zijn telefoon in een paar minuten solliciteert, dat een opdrachtgever zonder drempel een aanvraag doet, en dat Jimmy en Lorenzo elk lead met een referentie in `/beheer` terugvinden.

## 2 Gebruikers en scenario's

Werkzoekende

1. S-07-01: Een glazenwasser opent op zijn telefoon `/vacatures/glazenwasser-den-haag-1001`, tikt op Solliciteren in de actiebalk, vult voornaam, achternaam, telefoon, e-mail, woonplaats en de werkrechtvraag in en verstuurt zonder cv. Hij komt op `/bedankt/sollicitatie`, ziet zijn referentie `S-2026-0001` en krijgt een bevestigingsmail.
2. S-07-02: Een schoonmaker solliciteert met een cv van 3 MB. Na het kiezen van het bestand ziet ze een voortgangsbalk en daarna de bestandsnaam met een knop Verwijder. Het bestand staat na het versturen onder `applications/<id>/` in de bucket `cvs`.
3. S-07-03: Een werkzoekende kiest een foto van zijn cv. Het formulier meldt direct dat alleen pdf en Word kunnen, zonder iets te uploaden.
4. S-07-04: Een werkzoekende zonder passende vacature schrijft zich in op `/inschrijven`, kiest Verhuizer en Logistiek medewerker en vinkt de verplichte toestemming aan. Zonder vinkje krijgt hij een foutmelding bij het vinkje.
5. S-07-05: Een werkzoekende met JavaScript uit verstuurt de sollicitatie zonder cv. De server toont fouten bij de velden of stuurt door naar de bedankpagina.
6. S-07-06: Een werkzoekende wil liever niet typen. Naast het formulier tikt hij op App ons; WhatsApp opent met "Hallo Groos, ik wil graag solliciteren op de vacature Glazenwasser (nummer 1001)."

Werkgever

7. S-07-07: Een facilitair manager vraagt op `/werkgevers/personeel-aanvragen` drie schoonmakers en één glazenwasser aan voor Rijswijk, per direct, voor enkele weken. Hij komt op `/bedankt/aanvraag` met referentie `P-2026-0001`.
8. S-07-08: Een opdrachtgever komt van `/werkgevers/verhuizers` met de knop Personeel aanvragen; het beroep Verhuizers staat al aangevinkt.

Bezoeker

9. S-07-09: Een bezoeker kiest op `/contact` het onderwerp Bel mij terug en vult alleen naam en telefoonnummer in. Jimmy krijgt een melding en de bezoeker ziet `/bedankt/contact`.
10. S-07-10: Een bezoeker vult naam, e-mail en een vraag in zonder telefoonnummer; dat is genoeg.

Systeem en beheerder

11. S-07-11: Een bot vult het verborgen veld in of verstuurt binnen drie seconden. Er komt geen record en geen mail; de bot ziet een algemene weigermelding.
12. S-07-12: Iemand tikt twee keer op Versturen bij slechte verbinding. Er komt één record, en beide verzoeken eindigen op dezelfde bedankpagina.
13. S-07-13: Een cv is geüpload maar de sollicitatie wordt nooit verstuurd. Na 24 uur verwijdert de cron-taak `opruimen` van spec 10 het bestand uit `pending/`.
14. S-07-14: Jimmy opent de sollicitatie in `/beheer`; het record heeft `source = website`, `locale`, `privacy_notice_version`, eventueel `utm` met `source = google_jobs_apply` en, als er een cv is, `cv_path`.

## 3 Scope

### 3.1 Wel in fase 1

| Id | Eis | Dient |
|---|---|---|
| E-07-01 | Vier formulieren: `ApplyForm` (ingebed op de vacaturepagina), `RegisterForm` (`/inschrijven`), `StaffRequestForm` (`/werkgevers/personeel-aanvragen`) en `ContactForm` (`/contact`), met precies de velden van B-17 en B-18. | R-01, R-04 |
| E-07-02 | Per formulier één zod 4-schema in `lib/validation/*`, gedeeld door browser en server, met foutcodes die naar messages-sleutels verwijzen. | R-04, R-19 |
| E-07-03 | Per formulier één Server Action in `app/actions/*` met de signatuur `(prev, formData) => Promise<FormState>`, aangeroepen via `useActionState`; het formulier werkt zonder JavaScript, behalve de cv-upload (B-36). | R-04, R-14, R-15 |
| E-07-04 | Elke inzending wordt een record in `applications`, `staff_requests` of `contact_messages` met de kolommen van spec 10; sollicitaties en inschrijvingen krijgen een S-referentie, aanvragen een P-referentie. | R-03, R-04 |
| E-07-05 | Na een geslaagde inzending roept de actie in `after()` de e-mailfunctie van spec 11 aan en stuurt hij door naar `/bedankt/<soort>`; een mislukte mail laat het record staan. | R-04 |
| E-07-06 | Cv-upload: client controleert type en grootte (pdf, doc, docx, 10 MB), de uploadroute geeft na BotID een signed upload URL voor `cvs/pending/`, de server controleert de bytes en verplaatst het bestand naar de sollicitatie; verweesde uploads verdwijnen na 24 uur. | R-04, R-11, R-14 |
| E-07-07 | Spambescherming in lagen: BotID (`isBotRequest()` als eerste regel), honeypot, minimale invultijd van 3 seconden, linkcontrole en op productie de WAF-regels van spec 13. Lokaal geldt alles behalve de WAF. | R-04 |
| E-07-08 | Dubbele inzendingen worden afgevangen met `submission_id`; een herhaald verzoek eindigt op dezelfde bedankpagina zonder tweede record. | R-04 |
| E-07-09 | Elk formulier toont de informatieregel van spec 09 boven de verzendknop; solliciteren heeft het optionele talentpoolvinkje, inschrijven het verplichte toestemmingsvinkje (B-08). Nooit BSN, ID, geboortedatum, nationaliteit, foto of gezondheid. | R-11 |
| E-07-10 | Naast elk formulier staan bellen en WhatsApp als gelijkwaardige route, met de voorinvulteksten van spec 03 en het nummer van de contactpersoon. | R-01, R-14 |
| E-07-11 | De pagina's `/inschrijven`, `/werkgevers/personeel-aanvragen` en `/contact` en de vier bedankpagina's (noindex, met vervolgstappen en wie belt) in nl en en. | R-01, R-13 |
| E-07-12 | Messages-namespaces `forms`, `contact` en `bedankt` met de volledige sleutelboom in nl en en, inclusief alle validatie- en foutmeldingen. | R-07, R-13 |
| E-07-13 | Analytics-events per formulier via Vercel Analytics, met alleen de eigenschappen `form`, `beroep` en `vacature` (spec 09 §4.7). | R-04, R-11 |
| E-07-14 | Toegankelijk volgens WCAG 2.2 AA: gekoppelde labels, fouten via `aria-describedby`, `aria-invalid`, focus naar de eerste fout, `role="alert"`, juiste invoertypes en `autocomplete`, alles met het toetsenbord bedienbaar. | R-15 |
| E-07-15 | Geen claim zonder bevestiging: kantoortijden verschijnen alleen als `contact.openingHours` in `lib/site.ts` gevuld is; reactietermijn en spoed buiten kantoortijden verschijnen alleen achter de claims van `lib/claims.ts`. | R-12 |
| E-07-16 | De bouw-agent zet per plek uit §9 een sub-agent in die via 21st.dev kandidaten zoekt. | R-16 |

### 3.2 Niet in fase 1

- Jobalert, vacaturemeldingen per e-mail en het derde vinkje van context/09 (fase 2, spec 15).
- Solliciteren met video, knock-outvragen, taalniveau en een tweede stap na verzenden (context/13 §4.2).
- Een apart terugbelformulier (B-18): terugbellen is een onderwerp van het contactformulier.
- Een kaart op `/contact` (opdracht Djulan).
- Een klantaccount of kandidatenomgeving.
- Turnstile of een eigen rate limiter in de app; op productie doet de WAF van spec 13 dat.

### 3.3 Fase 2

Talentpool via `candidates` (spec 10 §3.3), jobalert met dubbele opt-in, solliciteren op een Engelse vacaturetekst, en een formulier "Bewaar mijn gegevens een jaar" in de afwijzingsmail (context/11 §8.3). De schema's en de `FormState` zijn zo opgezet dat een extra veld één regel in het schema en één veld in het component is.

## 4 Pagina's en componenten

### 4.1 Bestandsoverzicht

| Bestand | Soort | Nieuw of wijzigen |
|---|---|---|
| `lib/validation/shared.ts` | client-veilig: constanten, `FormState`, helpers | nieuw |
| `lib/validation/phone.ts` | client-veilig: `normalizePhone`, `formatPhoneDisplay` | nieuw |
| `lib/validation/application.ts` | schema sollicitatie | nieuw |
| `lib/validation/registration.ts` | schema inschrijving | nieuw |
| `lib/validation/staff-request.ts` | schema aanvraag | nieuw |
| `lib/validation/contact.ts` | schema contact | nieuw |
| `lib/validation/cv-upload.ts` | schema uploadverzoek | nieuw |
| `app/actions/_shared.ts` | server-only hulpfuncties voor de acties | nieuw |
| `app/actions/apply.ts` | `submitApplication` | nieuw |
| `app/actions/register.ts` | `submitRegistration` | nieuw |
| `app/actions/staff-request.ts` | `submitStaffRequest` | nieuw |
| `app/actions/contact.ts` | `submitContactMessage` | nieuw |
| `app/api/upload/cv/route.ts` | uploadroute (POST) | nieuw |
| `components/forms/apply-section.tsx` | `ApplySection` (server) | nieuw |
| `components/forms/apply-form.tsx` | `ApplyForm` (client) | nieuw |
| `components/forms/register-form.tsx` | `RegisterForm` (client) | nieuw |
| `components/forms/staff-request-form.tsx` | `StaffRequestForm` (client) | nieuw |
| `components/forms/contact-form.tsx` | `ContactForm` (client) | nieuw |
| `components/forms/contact-aside.tsx` | `ContactAside` (server) | nieuw |
| `components/forms/tracked-contact-link.tsx` | `TrackedContactLink` (client) | nieuw |
| `components/forms/form-error-boundary.tsx` | `FormErrorBoundary` (client) | nieuw |
| `components/forms/use-form-behaviour.ts` | hook `useFormBehaviour` (client) | nieuw |
| `components/forms/fields/*.tsx` | veldcomponenten (client) | nieuw |
| `components/contact/team-contact-card.tsx` | `TeamContactCard` (server) | nieuw |
| `components/forms/bedankt-reference.tsx` | `BedanktReference` (client) | nieuw |
| `app/[locale]/inschrijven/page.tsx` | pagina | skelet van spec 01 vervangen |
| `app/[locale]/werkgevers/personeel-aanvragen/page.tsx` | pagina | skelet vervangen |
| `app/[locale]/contact/page.tsx` | pagina | skelet vervangen |
| `app/[locale]/bedankt/[soort]/page.tsx` | pagina | skelet vervangen |
| `messages/nl/forms.json`, `messages/nl/contact.json`, `messages/nl/bedankt.json` en `messages/en/forms.json`, `messages/en/contact.json`, `messages/en/bedankt.json` | namespaces `forms`, `contact`, `bedankt` (B-45) | nieuw |
| `scripts/check-copy.mjs` | alleen de tabel `ZONES` aanvullen (spec 03 §6.19 staat dat toe) | wijzigen |

`components/contact/*` en `app/actions/_shared.ts` staan niet in 00 §4.4a; deze spec claimt ze (§12).

### 4.2 Gedeelde bouwstenen die deze module gebruikt

| Bouwsteen | Eigenaar | Gebruik hier |
|---|---|---|
| `CtaButton` (`components/ui/cta-button.tsx`), volledige API in spec 02 §4.7 | 02 | verzendknop (`type="submit" size="lg"` met `pending` en `pendingLabel`), bel- en WhatsApp-knoppen (`variant="secondary"`, WhatsApp met `external` en `newTabLabel`), knoppen op bedankpagina's |
| Primitives `Field`, `FieldSet`, `FieldLegend`, `FieldDescription`, `FieldError`, `Label`, `Input`, `Textarea`, `NativeSelect`, `CheckboxField`, `RadioGroup`, `RadioCard`, `FileInput`, `Alert` (`components/ui/*`) | 02 | basis van alle veldcomponenten in §4.3 |
| `ServiceSteps` (`components/service/service-steps.tsx`), props `{id?; heading; accent?; intro?; steps: StepItem[]}` met `StepItem` uit `components/service/types.ts` | 05 | blok "Zo gaat het verder" op `/inschrijven`, `/werkgevers/personeel-aanvragen` en de bedankpagina's |
| `beroepen.<id>.enkelvoud` en `beroepen.<id>.meervoud` in messages | 05 | labels van de beroepen in `RegisterForm` en `StaffRequestForm` |
| `Breadcrumbs` (`components/sections/breadcrumbs.tsx`), props `{items: Crumb[]; className?; jsonLd?}` | 01 | kruimelpad op `/inschrijven`, `/werkgevers/personeel-aanvragen`, `/contact`; niet op bedankpagina's |
| `contact`, `whatsappLink(text?)` uit `lib/site.ts` | 01 | het ene nummer, e-mail, adres, WhatsApp-links (B-60) |
| `ROUTES`, `paths.bedankt(soort)`, `BEDANKT_SOORTEN`, `BedanktSoort` uit `lib/routes.ts` | 01 | routes en doorsturen |
| `redirect`, `Link` uit `@/i18n/navigation`; `resolveLocale` | 01 | doorsturen met behoud van `/en` |
| `pageMetadata()` uit `lib/seo.ts` | 12 | metadata van alle pagina's |
| `employmentAgencyLd()` uit `lib/seo.ts`, `JsonLd` uit `components/seo/json-ld.tsx` | 12 | JSON-LD op `/contact` |
| `isClaimConfirmed()` uit `lib/claims.ts` | 03 | spoed (`afterHoursUrgent`) en reactietermijn (`responseTime`) |
| `contact.openingHours` uit `lib/site.ts`; `formatTime` uit `lib/format.ts` | 01, 03 | kantoortijden op `/contact`, alleen als `openingHours` gevuld is |
| `common.whatsapp.*`, `common.notes.*`, `common.cta.*`, `common.a11y.*`, `common.opensInNewTab`, `common.contact.*`, `common.address.byAppointment` in messages | 03 | voorinvulteksten, notities, persoonslinks, knoppen en links (`common.cta.viewJobs`, `common.cta.whatsapp`, `common.cta.call`, `common.cta.requestStaff`, `common.cta.register`), contactgegevens |
| `header.nav.werkzoekenden`, `header.nav.inschrijven`, `header.nav.werkgevers`, `header.nav.personeelAanvragen`, `header.nav.contact` in messages | 03 | labels van de kruimelpaden |
| `forms.privacy.*` (tekst van spec 09 §6.2), `PRIVACY_NOTICE_VERSION` en ankers uit `lib/legal.ts` | 09 | informatieregel en vinkjes |
| `isBotRequest()` uit `lib/security/botid.ts`; `instrumentation-client.ts` | 13 | spamcontrole; de protect-lijst dekt `/vacatures/*`, `/inschrijven`, `/werkgevers/personeel-aanvragen`, `/contact` (ook onder `/en`) en `/api/upload/*` |
| `createSupabaseAdminClient()`, `createCvUploadTarget`, `finalizeCvUpload`, `removeApplicationFiles`, `CvUploadError` | 10 | schrijven en cv-opslag |
| `resolveVacancyContact` uit `components/vacatures/vacancy-format.ts` | 06 | contactpersoon van de vacature in `ApplySection` en `ContactAside` (§4.4, §4.5) |
| `getVacancyByNumber`, `VacancyDetail` uit `lib/data/*`; `OCCUPATION_SLUGS`, `REQUEST_DURATIONS`, `CONTACT_TOPICS`, `CV_TYPES`, `CV_MAX_BYTES` uit `lib/data/options.ts` | 10 | vacaturecontrole en waardensets |
| `sendApplicationEmails`, `sendRegistrationEmails`, `sendStaffRequestEmails`, `sendContactEmails` uit `lib/email/forms.ts` | 11 | bevestiging en interne melding (§5.6) |

Primitives: de veldcomponenten bouwen op de primitives van spec 02 (`components/ui/*`); welke primitive elk veld rendert staat in §4.3. Uiterlijk, focus en foutkleur komen uit die primitives; deze module voegt geen eigen stijlklassen voor velden toe. Geen nieuwe UI-dependency.

### 4.3 Veldcomponenten (`components/forms/fields/*`, alle client)

De veldcomponenten zijn de gedragslaag boven de primitives van spec 02: zij zetten de vaste id's, vertalen foutcodes naar tekst en koppelen het veld aan `useFormBehaviour`. Uiterlijk komt uit de primitives. Vaste id's: invoer `${formId}-${name}`, hint `${formId}-${name}-hint`, fout `${formId}-${name}-error`. `aria-describedby` bevat de hint-id en, bij een fout, de fout-id (in die volgorde). Bij een fout krijgt de invoer `aria-invalid="true"` en `Field` `invalid`. Geen sterretje: verplichte velden krijgen `required` en `aria-required="true"`; optionele velden krijgen achter het label "(niet verplicht)" / "(optional)" uit `forms.common.optionalMark` (waarde "niet verplicht" / "optional"; de haakjes zet het component). Iconen: `CircleAlert` bij fouten en `LoaderCircle` tijdens verzenden (beide via de primitives van spec 02).

| Component | Bestand | Props en opbouw |
|---|---|---|
| `TextField` | `text-field.tsx` | `{formId: string; name: string; label: string; hint?: string; error?: string; required?: boolean; type?: "text" \| "email" \| "tel" \| "number" \| "date"; autoComplete?: string; inputMode?: "text" \| "email" \| "tel" \| "numeric"; defaultValue?: string; min?: string; max?: string; maxLength?: number; autoFocus?: boolean; onChange?: () => void}`; rendert `Field`, `Label`, `Input`, `FieldDescription` (hint) en `FieldError` (fout) |
| `TextareaField` | `textarea-field.tsx` | `{formId; name; label; hint?; error?; required?; defaultValue?; maxLength: number; rows?: number (standaard 4); autoFocus?}`; rendert `Field`, `Label`, `Textarea`, `FieldDescription` en `FieldError`; toont geen teller, wel `maxLength` |
| `ChoiceField` | `choice-field.tsx` | `{formId; name; legend: string; hint?; error?; required?; options: {value: string; label: string; hint?: string}[]; defaultValue?: string; layout?: "row" \| "stack"; onValueChange?: (v: string) => void}`; rendert `RadioGroup` met per optie een `RadioCard` (`id` `${formId}-${name}-${value}`); elke `RadioCard` krijgt `invalid={!!error}`, `describedBy` met de hint-id en bij een fout ook de fout-id (gescheiden door een spatie), en `onChange={(e) => onValueChange?.(e.target.value)}` (API van `RadioCard` in spec 02); `layout="row"` is `orientation="horizontal"`, `layout="stack"` is `orientation="vertical"` |
| `CheckboxGroupField` | `checkbox-group-field.tsx` | `{formId; name; legend; hint?; error?; options: {value: string; label: string}[]; defaultValue?: string[]; onValuesChange?: (v: string[]) => void}`; rendert `FieldSet` met `FieldLegend` zonder variant (standaard `"label"`) en per optie de ui-`CheckboxField` (`id` `${formId}-${name}-${value}`) met dezelfde `name`, zodat `formData.getAll(name)` werkt |
| `ConsentField` | `consent-field.tsx` | `{formId; name; label: React.ReactNode; hint?: string; error?: string; required?: boolean; defaultChecked?: boolean}`; rendert de ui-`CheckboxField` (`description` is de hint, `invalid` en `describedBy` uit de fout); waarde `"on"`; nooit vooraf aangevinkt, `defaultChecked` alleen voor het terugzetten na een serverfout. Gebruikt voor het talentpoolvinkje en het toestemmingsvinkje |
| `SelectField` | `select-field.tsx` | `{formId; name; label; hint?; error?; options: {value: string; label: string}[]; defaultValue?: string}`; rendert `Field`, `Label`, `NativeSelect` met `NativeSelectOption`, `FieldDescription` en `FieldError` |
| `CvUpload` | `cv-upload.tsx` | `{formId: string; form: "apply" \| "register"; error?: string; onStateChange?: (s: CvUploadState) => void}`; rendert na hydratatie `FileInput` (zonder `name`, labels uit `forms.jobseeker.cv.*`) en voegt zelf de upload, een `<progress>` en de verborgen velden toe; zie §4.8 |
| `FormMeta` | `form-meta.tsx` | `{locale: Locale; submissionId?: string}`; verborgen velden, zie §5.2 |
| `Honeypot` | `honeypot.tsx` | `{label: string}`; veld `website`, zie §5.5 |
| `PrivacyNotice` | `privacy-notice.tsx` | `{text: React.ReactNode}`; één `<p>` direct boven de knop, `text-sm text-muted-foreground`, link onderstreept |
| `FormAlert` | `form-alert.tsx` | `{message: string; showContact?: boolean; contactLinks?: React.ReactNode}`; rendert `<Alert tone="danger" role="alert">` met de melding en daaronder eventueel de contactlinks |
| `ErrorSummary` | `error-summary.tsx` | `{count: number; text: string}`; rendert `<Alert tone="danger" role="alert">`, bovenaan het formulier, alleen bij status `invalid` |
| `SubmitButton` | `submit-button.tsx` | `{label: string; pendingLabel: string; pending: boolean}`; rendert `<CtaButton type="submit" size="lg" pending={pending} pendingLabel={pendingLabel} className="w-full sm:w-auto">{label}</CtaButton>` zonder eigen spinner; `CtaButton` zet bij `pending` `disabled`, `aria-busy`, `LoaderCircle` en de `role="status"` met `pendingLabel` |

`useFormBehaviour` (hook in `components/forms/use-form-behaviour.ts`):

```ts
export function useFormBehaviour<V>(input: {
  formId: FormId;
  schema: z.ZodType;                       // het gedeelde schema van het formulier
  state: FormState<V>;
  analytics: { form: FormId; beroep?: OccupationSlug; vacature?: number };
  isBusy?: () => boolean;                  // bijvoorbeeld cv nog aan het uploaden
  onBusy?: () => void;                     // toont de cv-fout cvUploading
}): {
  formRef: React.RefObject<HTMLFormElement | null>;
  errors: FieldErrors;                     // clientfouten gaan voor serverfouten
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onFieldChange: (name: string) => void;   // wist de fout van dat veld na de eerste poging
  onFirstInteraction: () => void;          // event form_start, één keer per paginaweergave
};
```

Gedrag: `onSubmit` stopt het verzenden met `preventDefault()` als `isBusy()` waar is of als `schema.safeParse(formDataToRecord(new FormData(form), ARRAY_FIELDS))` faalt; dan zet hij de clientfouten, stuurt hij `form_invalid` en zet hij de focus op het eerste ongeldige veld in DOM-volgorde. Als de server `invalid` teruggeeft, zet een effect de focus op dezelfde manier. Na de eerste poging valideert het formulier een veld opnieuw bij `change`, zodat een fout verdwijnt zodra hij is opgelost; het toont nooit fouten voordat iemand op versturen heeft gedrukt. Het formulier heeft altijd `noValidate`, zodat de browser geen eigen meldingen toont en de serverfouten ook zonder JavaScript zichtbaar worden.

### 4.4 `ApplySection` en `ApplyForm` (op de vacaturepagina)

Spec 06 bezit `/vacatures/[slug]` en plaatst `<ApplySection vacancy={vacancy} locale={locale} />` alleen als `vacancy.state === "open"`. `ApplySection` is het enige blok met `section#solliciteren`; spec 06 plaatst het en heeft geen eigen sollicitatieblok. De sticky knop van de actiebalk (spec 01, variant `vacature`) linkt naar `#solliciteren`.

`ApplySection` (server, `components/forms/apply-section.tsx`):

```ts
type ApplySectionProps = { vacancy: VacancyDetail; locale: Locale };
```

| Volgorde | Inhoud |
|---|---|
| 1 | `<section id="solliciteren" aria-labelledby="solliciteren-titel" className="scroll-mt-24">` |
| 2 | h2 `forms.apply.title` plus accent `forms.apply.accent`; daaronder `forms.apply.intro` (zonder parameter, "Ons team belt of appt je", B-60) en `forms.apply.vacancyLine` met `{title}` en `{number}` |
| 3 | Raster: onder `lg` één kolom met eerst een compacte strook `ContactAside` (twee knoppen naast elkaar) en dan het formulier; vanaf `lg` twee kolommen, formulier 7/12 links en `ContactAside` 5/12 rechts, `sticky top-24` |
| 4 | `<FormErrorBoundary form="apply"><ApplyForm vacancy={applyVacancy} locale={locale} /></FormErrorBoundary>` |

`ApplyForm` (client):

```ts
export type ApplyFormVacancy = {
  number: number; title: string; occupationSlug: OccupationSlug; asksDrivingLicenseB: boolean;
};
type ApplyFormProps = { vacancy: ApplyFormVacancy; locale: Locale };
```

`ApplySection` bouwt `applyVacancy` uit `VacancyDetail` (`number`, `title`, `occupation.slug`, `asksDrivingLicenseB`), zodat er geen persoonsgegevens van de contactpersoon in de clientbundel komen. Het formulier bindt het vacaturenummer met `submitApplication.bind(null, vacancy.number)`; `bind` werkt ook zonder JavaScript (Next-gids forms).

Volgorde van de velden (één kolom, ook op desktop, maximaal 36rem breed):

1. `ErrorSummary` (alleen bij fouten).
2. Voornaam en achternaam, vanaf 640 px naast elkaar.
3. Telefoonnummer.
4. E-mailadres.
5. Woonplaats.
6. "Mag je in Nederland werken?" (ja, nee); bij "nee" verschijnt met JavaScript de hint `noHint` onder de keuze.
7. "Heb je rijbewijs B?" (ja, nee), alleen als `vacancy.asksDrivingLicenseB`.
8. Beschikbaar vanaf (`type="date"`, `min` vandaag, `max` vandaag plus 365 dagen).
9. `CvUpload` met daaronder `forms.jobseeker.cv.noCv`.
10. "Wil je nog iets vertellen?" (bericht).
11. Talentpoolvinkje (`ConsentField`) `forms.privacy.talentPool.label` met hint (B-08).
12. `Honeypot`, `FormMeta`.
13. `FormAlert` bij status `error`.
14. `PrivacyNotice` met `forms.privacy.applyNotice`, link naar `/privacyverklaring#solliciteren`.
15. `SubmitButton` met `forms.apply.submit` en `forms.apply.submitting`.

### 4.5 `ContactAside` en `TrackedContactLink`

`ContactAside` (server, `components/forms/contact-aside.tsx`):

```ts
type ContactAsideProps = {
  form: FormId;
  locale: Locale;
  title: string;                       // forms.<form>.alternatives.title
  body: string;                        // forms.<form>.alternatives.body
  whatsappText: string;                // uit common.whatsapp.*
  persons: { name: string; phone: Phone; whatsapp: boolean }[];
  analytics?: { beroep?: OccupationSlug; vacature?: number };
  variant?: "strip" | "panel";         // strip onder lg, panel vanaf lg
};
```

Rendert `<aside aria-label={forms.common.alternativesLabel}>` met h3 `title` (B-05: titel van een item binnen de sectie), alinea `body` en twee knoppen naar het ene nummer van het team (B-60), beide `CtaButton variant="secondary"` via `TrackedContactLink`. De prop `persons` bestaat niet meer; `whatsapp?: boolean` (standaard waar) verbergt de WhatsApp-knop:

- Bellen: `href={contact.phoneHref}`, label `common.cta.call` en `aria-label` `common.a11y.call` met `{phone}` (`contact.phone`); icoon `Phone`.
- WhatsApp, alleen als `whatsapp` waar is: `href={whatsappLink(whatsappText)}`, `external` en `newTabLabel={t("common.opensInNewTab")}`, label `common.cta.whatsapp` en geen `ariaLabel`; de toegankelijke naam is het label plus `newTabLabel` (B-54); icoon `MessageCircle`.

Iconen uit Lucide 0.456 met `aria-hidden`.

WhatsApp en tekst per formulier (bellen en appen gaan altijd naar het hoofdnummer, B-60):

| Formulier | `whatsapp` | `whatsappText` |
|---|---|---|
| `apply` | `vacancy.allowWhatsappApply` | `common.whatsapp.vacatureSolliciteren` met `{title}` en `{number}` |
| `register` | altijd | `common.whatsapp.werkzoekende` |
| `staffRequest` | altijd | `common.whatsapp.werkgever` |
| `contact` | niet gebruikt; `/contact` heeft eigen kaarten (§4.9) | `common.whatsapp.algemeen` |

Bij `apply` levert `resolveVacancyContact` het nummer al als weergave (`phoneDisplay`) en als E.164 (`phoneE164`); deze module formatteert dat nummer niet opnieuw.

`TrackedContactLink` (client): `{href: string; label: string; ariaLabel?: string; kind: "call" | "whatsapp"; form: FormId; beroep?: OccupationSlug; vacature?: number; external?: boolean; newTabLabel?: string; className?: string}`; rendert `<CtaButton variant="secondary" href={href} ariaLabel={ariaLabel} external={external} newTabLabel={newTabLabel} className={className} onClick={...}>` en roept bij klikken `track(kind === "call" ? "call_click" : "whatsapp_click", props)` aan.

### 4.6 `/inschrijven`

`app/[locale]/inschrijven/page.tsx` (server, statisch, `setRequestLocale(locale)`).

| Volgorde | Inhoud | Bouwsteen |
|---|---|---|
| 1 | Kruimelpad Werkzoekenden, Inschrijven | `Breadcrumbs` met `items=[{label: header.nav.werkzoekenden, href: ROUTES.werkzoekenden}, {label: header.nav.inschrijven, href: ROUTES.inschrijven}]` |
| 2 | h1 `forms.register.title`, lead `forms.register.intro`, lijst van drie punten `forms.register.benefits[]` met icoon `Check` | eigen markup |
| 3 | Onder `lg`: `ContactAside` als strook | `ContactAside variant="strip"` |
| 4 | h2 `forms.register.formTitle` plus accent `formAccent`; formulier links (7/12), `ContactAside variant="panel"` rechts vanaf `lg`; onder de aside de link `forms.register.jobsLink` naar `/vacatures` | `RegisterForm` in `FormErrorBoundary` |
| 5 | Zo gaat het na je inschrijving | `ServiceSteps id="zo-gaat-het" heading={steps.title} accent={steps.accent} steps={items}` (`items` zijn `StepItem`'s met `title` en `body`) |

`RegisterForm` (client), props `{ locale: Locale; occupationOptions: {value: OccupationSlug; label: string}[] }`. De pagina bouwt `occupationOptions` op de server uit `beroepen.<id>.enkelvoud` (spec 05), omdat `beroepen` niet in `CLIENT_NAMESPACES` staat. Velden in volgorde: voornaam, achternaam, telefoon, e-mail, woonplaats, werkrechtvraag, "In welk werk heb je interesse?" (`CheckboxGroupField` met de vijf beroepen uit `occupationOptions`), rijbewijs B (altijd zichtbaar, niet verplicht), beschikbaar vanaf, `CvUpload`, bericht, verplicht toestemmingsvinkje (`ConsentField`) `forms.privacy.registerConsent.label` met hint, honeypot, meta, `FormAlert`, `PrivacyNotice` met `forms.privacy.registerNotice` en link naar `/privacyverklaring#inschrijven`, knop `forms.register.submit`.

Met JavaScript leest het formulier bij het laden `?beroep=<id>` uit de URL en vinkt dat beroep aan als het een geldige id is (links vanaf `/werken-als/[beroep]`).

### 4.7 `/werkgevers/personeel-aanvragen`

`app/[locale]/werkgevers/personeel-aanvragen/page.tsx` (server, statisch).

| Volgorde | Inhoud | Bouwsteen |
|---|---|---|
| 1 | Kruimelpad Werkgevers, Personeel aanvragen | `Breadcrumbs` met `items=[{label: header.nav.werkgevers, href: ROUTES.werkgevers}, {label: header.nav.personeelAanvragen, href: ROUTES.personeelAanvragen}]` |
| 2 | h1 `forms.staffRequest.title`, lead `forms.staffRequest.intro`, regel `common.notes.noObligationEmployer` | eigen markup |
| 3 | Spoedregel: `common.notes.urgentEmployer` ("Heeft u snel mensen nodig? Bel ons dan direct.") met een belknop naar `contact.phoneHref` (label `common.cta.call`, `aria-label` `common.a11y.call`); de zin `common.contact.afterHours` alleen bij `isClaimConfirmed("afterHoursUrgent")` | eigen markup, `CtaButton variant="secondary"` |
| 4 | h2 `formTitle` plus `formAccent`; `StaffRequestForm` links, `ContactAside` rechts vanaf `lg`, als strook erboven onder `lg` | `StaffRequestForm` in `FormErrorBoundary` |
| 5 | Zo gaat het na uw aanvraag | `ServiceSteps id="zo-gaat-het" heading={steps.title} accent={steps.accent} steps={items}` |

`StaffRequestForm` (client), props `{ locale: Locale; occupationOptions: {value: OccupationSlug; label: string}[] }`; de pagina bouwt `occupationOptions` op de server uit `beroepen.<id>.meervoud` (spec 05). Twee `<fieldset>`'s op één pagina, zonder stappen. Beide fieldsets (`forms.staffRequest.groups.company` en `forms.staffRequest.groups.request`) gebruiken `FieldLegend variant="group"`:

1. Legend `forms.staffRequest.groups.company`: bedrijfsnaam, uw naam, telefoonnummer, e-mailadres, KvK-nummer (niet verplicht).
2. Legend `forms.staffRequest.groups.request`: welk personeel (vijf beroepen uit `occupationOptions`), ander werk (tekstveld, niet verplicht), aantal mensen (`type="number"`, `inputMode="numeric"`, `min=1 max=500`, standaard 1), vanaf wanneer (keuze zo snel mogelijk of vanaf een datum; met JavaScript verschijnt het datumveld alleen bij "vanaf een datum", zonder JavaScript staat het er altijd), duur (`SelectField`, standaard `unknown`), uren per week (niet verplicht), plaats van het werk, toelichting.

Daarna honeypot, meta, `FormAlert`, `PrivacyNotice` met `forms.privacy.staffRequestNotice` (link `/privacyverklaring#opdrachtgevers`), knop `forms.staffRequest.submit`. Met JavaScript vinkt het formulier `?beroep=<id>` aan (links vanaf `/werkgevers/[beroep]`).

Waarom geen twee stappen (context/13 §5.6): zonder JavaScript en met één Server Action is één pagina met twee groepen eenvoudiger en even kort; alle velden van groep 2 behalve beroep, aantal, start en plaats zijn niet verplicht.

### 4.8 Cv-upload (`CvUpload`)

Toestanden (`CvUploadState`): `idle`, `uploading { name; percent }`, `done { name; path }`, `error { code }`.

1. **Zonder JavaScript.** Het component weet via een `hydrated`-vlag (`useSyncExternalStore` met server-snapshot `false`) of het in de browser draait. Server-HTML en no-JS tonen alleen label en `forms.jobseeker.cv.noJs`, zonder bestandsveld. Zo kan niemand zonder JavaScript een bestand kiezen dat niet aankomt.
2. **Kiezen.** Na hydratatie rendert het component `FileInput` van spec 02 met `id={`${formId}-cv`}`, zonder `name` (zodat het bestand nooit in de FormData van de Server Action komt, limiet 1 MB), `accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"`, `maxSizeMb={10}`, `invalid` en `describedBy` uit de fout, en `labels={{ choose: cv.choose, change: cv.change, remove: cv.removeAria (met {name}) of cv.remove zonder bestand, hint: cv.hint }}` uit `forms.jobseeker.cv.*`. Uiterlijk, icoon, bestandsnaam en verwijderknop komen uit `FileInput`.
3. **Clientcontrole.** `FileInput` meldt via `onFileChange(file, problem)` het probleem `"type"` (fout `cvType`) of `"size"` (fout `cvTooLarge`). `CvUpload` controleert daarnaast de extensie uit de bestandsnaam (kleine letters, `pdf`, `doc` of `docx`), omdat die als `ext` naar de route gaat, en `file.size` van 1 tot `CV_MAX_BYTES`. Bij een fout wordt het veld leeggemaakt en gebeurt er geen verzoek.
4. **Doel vragen.** `fetch("/api/upload/cv", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ext, size }) })`. BotID voegt in de browser zijn kenmerken toe, omdat `/api/upload/*` in de protect-lijst van spec 13 staat. Antwoord 403 geeft `cvUploadFailed`; 400 geeft de code uit het antwoord.
5. **Uploaden.** Een `XMLHttpRequest` met `PUT` naar `signedUrl`, header `content-type` gelijk aan `contentType` uit het antwoord (dus uit `CV_TYPES`, niet `file.type`, omdat Android bij docx soms een leeg type geeft) en header `x-upsert: false`, body het bestand. `xhr.upload.onprogress` zet `percent`. Een `AbortController` breekt af bij Verwijder of als het component verdwijnt. Status 200 geeft `done`; elke andere status of een netwerkfout `cvUploadFailed`. Zie §12 over deze keuze tegenover `uploadToSignedUrl`.
6. **Klaar.** `FileInput` toont de bestandsnaam en de verwijderknop; `CvUpload` voegt zelf de verborgen velden `cvPath` (het `pending/`-pad) en `cvFilename` (de originele naam, maximaal 200 tekens) toe en toont `forms.jobseeker.cv.uploaded`. Event `cv_upload`.
7. **Verwijderen of vervangen.** `onFileChange(null, null)` breekt een lopende upload af en leegt de verborgen velden en de toestand. Het oude bestand blijft in `pending/` staan; de cron-taak `opruimen` van spec 10 verwijdert het na 24 uur. Anoniem verwijderen in de bucket kan niet en hoort ook niet.
8. **Bezig bij versturen.** Zolang de toestand `uploading` is, stopt `useFormBehaviour` het verzenden en toont het `cvUploading` bij het cv-veld.

Voortgang: `CvUpload` zet onder `FileInput` een eigen `<progress max={100} value={percent}>` met zichtbaar label, plus `aria-live="polite"` met `forms.jobseeker.cv.uploading` in stappen van 25 procent, zodat een schermlezer niet elke procent hoort.

### 4.9 `/contact`

`app/[locale]/contact/page.tsx` (server, statisch). Wij en u (B-04); het keuzeblok voor werkzoekenden in je-vorm.

Bovenaan de pagina staat `<JsonLd data={employmentAgencyLd({ locale, description: tMeta("organizationDescription") })} />` met `tMeta = await getTranslations({ locale, namespace: "meta" })`.

| Volgorde | Inhoud | Bouwsteen |
|---|---|---|
| 1 | Kruimelpad Contact | `Breadcrumbs items=[{label: header.nav.contact, href: ROUTES.contact}]` |
| 2 | h1 `contact.title`, lead `contact.intro` | eigen markup |
| 3 | h2 `contact.people.title` plus accent ("Kom in contact met" en "ons team"), alinea `contact.people.intro`, één contactblok | `TeamContactCard` |
| 4 | h2 `contact.details.title` plus accent; definitielijst (`<dl>`): adres met label `common.contact.address` (`contact.street`, `contact.postalCode contact.city`) en daaronder `common.address.byAppointment`; e-mail met label `common.contact.email` als `mailto:`-link; algemeen nummer (`contact.details.phone`) als `tel:`-link; kantoortijden alleen als `contact.openingHours` in `lib/site.ts` gevuld is, met `common.contact.officeHours` en `common.contact.officeHoursValue` (`{opens}`, `{closes}` via `formatTime`); spoed: `common.contact.afterHours` alleen bij `isClaimConfirmed("afterHoursUrgent")`; KvK (`contact.details.kvk`) alleen als `contact.kvk` gevuld is | eigen markup |
| 5 | h2 `contact.choice.title` plus accent; twee kaarten met h3: werkzoekende (links `common.cta.viewJobs` naar `/vacatures` en `common.cta.register` naar `/inschrijven`) en werkgever (link `common.cta.requestStaff` naar `/werkgevers/personeel-aanvragen`) | eigen markup, `CtaButton` |
| 6 | `<section id="contactformulier">` met h2 `contact.form.title` plus accent, intro, `ContactForm` | `ContactForm` in `FormErrorBoundary` |

`TeamContactCard` (server, `components/contact/team-contact-card.tsx`, vervangt `ContactPersonCard`, B-60): props `{ locale: Locale; heading?: "h3"; body?: string; whatsappText?: string; form?: FormId; analytics?: { beroep?; vacature? } }`. Rendert optioneel een h3 met `common.team.title` ("Kom in contact met ons team") en de alinea `body`, het hoofdnummer `contact.phone` als `tel:`-link, het e-mailadres als `mailto:`-link en drie knoppen: `common.cta.call` met `ariaLabel` `common.a11y.call`, `common.cta.whatsapp` zonder `ariaLabel`, met `external` en `newTabLabel={t("common.opensInNewTab")}` (B-54) en `common.whatsapp.algemeen` als standaard voorinvultekst, en `common.cta.email`. Bellen en WhatsApp gaan via `TrackedContactLink` (standaard `form: "contact"`). Geen persoonsnamen, initialen, foto's of tweede nummer. Dezelfde kaart staat op `/`, `/over-ons` en, met `heading="h3"` en `vacatures.detail.contact.body`, op de vacaturepagina.

`ContactForm` (client), props `{ locale: Locale }`. Velden: naam, telefoonnummer, e-mailadres (hint bij telefoon: één van beide is genoeg), onderwerp (`ChoiceField` met vier opties in een raster van 2 bij 2 vanaf 640 px), bericht. Met JavaScript:

- toont het onder het onderwerp de hint uit `forms.contactForm.topicHints`: de sleutel is `jobseeker` voor de enumwaarde `job_seeker` (die waarde verandert niet) en gelijk aan de waarde voor `employer`, `callback` en `other`; bij `job_seeker` en `employer` met een link naar `/inschrijven` of `/werkgevers/personeel-aanvragen`;
- maakt het bij `callback` het bericht niet verplicht (label houdt `optionalMark`, hint `hintCallback`) en het telefoonnummer wel;
- leest het `?onderwerp=` uit de URL: `werk` wordt `job_seeker`, `personeel` wordt `employer`, `bel-mij-terug` wordt `callback`, `anders` wordt `other`. Header, footer of andere specs mogen zo naar `/contact?onderwerp=bel-mij-terug#contactformulier` linken.

Zonder JavaScript zijn alle velden zichtbaar en beslist de server.

### 4.10 Bedankpagina's

Spec 01 legt de route vast als `app/[locale]/bedankt/[soort]/page.tsx`, statisch, `generateStaticParams` met `BEDANKT_SOORTEN`, `dynamicParams = false`, robots `noindex, follow`. Mapping van soort naar sleutel: `sollicitatie` naar `bedankt.application`, `inschrijving` naar `bedankt.registration`, `aanvraag` naar `bedankt.staffRequest`, `contact` naar `bedankt.contact`.

| Volgorde | Inhoud |
|---|---|
| 1 | Geen kruimelpad (spec 01 §4.9). `<section>` met icoon `CircleCheck` in het merkblauw (`aria-hidden`), h1 `bedankt.<key>.title` en alinea `intro` |
| 2 | `BedanktReference` (client, binnen `<Suspense fallback={null}>`): leest `ref` uit `useSearchParams()` en toont `bedankt.<key>.reference` alleen als de waarde past op `^S-\d{4}-\d{4,6}$` (sollicitatie, inschrijving) of `^P-\d{4}-\d{4,6}$` (aanvraag). Props `{ template: string; pattern: "S" \| "P" }`, waarbij `template` de vertaalde zin is met `{reference}` vervangen door `__REF__`. Bij contact niet gerenderd |
| 3 | `whoCalls` zonder parameter ("Ons team …", B-60) |
| 4 | Notitie: bij sollicitatie en inschrijving `common.notes.responseJobseeker`, bij aanvraag `common.notes.responseEmployer`, alleen bij `isClaimConfirmed("responseTime")`; bij aanvraag daarnaast `common.notes.urgentEmployer` ("Heeft u snel mensen nodig? Bel ons dan direct.") met een belknop `common.cta.call` naar `contact.phoneHref` (`CtaButton variant="secondary"`) |
| 5 | `ServiceSteps` met `heading={steps.title} accent={steps.accent} steps={items}` uit `bedankt.<key>.steps` (niet bij contact) |
| 6 | Knoppen en links per soort, zie de tabel hieronder. De WhatsApp-knop is `CtaButton variant="secondary"` met `external` en `newTabLabel={t("common.opensInNewTab")}`, label `common.cta.whatsapp` en voorinvultekst `common.whatsapp.werkzoekende` (sollicitatie, inschrijving) of `common.whatsapp.werkgever` (aanvraag) |

| Soort | Knoppen en links in rij 6 |
|---|---|
| `sollicitatie`, `inschrijving` | `common.cta.viewJobs` naar `/vacatures`; WhatsApp-knop met `common.cta.whatsapp` |
| `aanvraag` | WhatsApp-knop met `common.cta.whatsapp`; link `bedankt.staffRequest.employersLink` naar `/werkgevers`. De belknop `common.cta.call` staat al bij de spoedregel in rij 4 en komt er niet nog een keer |
| `contact` | link `bedankt.contact.homeLink` naar `/`; `common.cta.viewJobs` naar `/vacatures`; `common.cta.requestStaff` naar `/werkgevers/personeel-aanvragen` |

De referentie komt in de URL (`/bedankt/sollicitatie?ref=S-2026-0001`). Dat is geen persoonsgegeven en `analyticsBeforeSend` van spec 09 haalt de parameter weg uit analytics. De pagina zoekt het record nooit op, zodat niemand via een geraden referentie gegevens ziet. Zonder JavaScript is de referentie niet zichtbaar; de bevestigingsmail noemt hem wel (spec 11).

### 4.11 `FormErrorBoundary`

Client-klasse met `getDerivedStateFromError`. Vangt fouten die React uit een Server Action doorgeeft als het verzoek zelf mislukt: een 429 van de WAF, een netwerkfout, of "Failed to find Server Action" na een nieuwe deploy (Next-gids server-actions, Deployment considerations). Fallback: `FormAlert` met `forms.common.networkError`, de knop `forms.common.retry` die de boundary reset (de ingevulde waarden zijn dan weg; daarom staat in de melding ook het alternatief bellen of appen) en de belknop naar `contact.phoneHref`. `console.error` met alleen het formulier-id. Props `{ form: FormId; children: React.ReactNode }`.

## 5 Data

### 5.1 Gedeelde typen en constanten (`lib/validation/shared.ts`, client-veilig)

```ts
import { z } from "zod";
export const FORM_IDS = ["apply", "register", "staffRequest", "contact"] as const;
export type FormId = (typeof FORM_IDS)[number];
export const MIN_FILL_MS = 3000;                 // spec 14 gebruikt deze constante in wachtInvultijd()
export const MESSAGE_MAX = 2000;
export const LINK_LIMIT = 3;                     // vanaf 3 links in vrije tekst geldt een inzending als spam
export const ARRAY_FIELDS = ["occupations"] as const;

export type FieldErrors = Partial<Record<string, string>>;           // veldnaam -> foutcode
export type FormValues = Partial<Record<string, string | string[]>>;  // ruwe invoer voor defaultValue
export type FormState =
  | { status: "idle" }
  | { status: "invalid"; fieldErrors: FieldErrors; values: FormValues }
  | { status: "error"; error: "blocked" | "generic" | "vacancyClosed"; values: FormValues; fieldErrors?: FieldErrors };
export const initialFormState: FormState = { status: "idle" };

export function formDataToRecord(fd: FormData, arrayKeys: readonly string[]): Record<string, unknown>;
// lege strings worden undefined; arrayKeys via getAll; sleutels die met $ACTION_ beginnen vallen weg
export function toFieldErrors(error: z.ZodError): FieldErrors;   // eerste issue per pad; pad[0] is de veldnaam
export function valuesForState(record: Record<string, unknown>): FormValues;
// alleen strings en string-arrays; nooit cvPath, submissionId of website; teksten ingekort tot 2.000 tekens
export function todayAmsterdam(): string;                       // "YYYY-MM-DD" in Europe/Amsterdam
export function addDays(isoDate: string, days: number): string;
export function countLinks(text: string | undefined): number;    // telt http(s):// en www.

export const metaSchema = z.object({
  submissionId: z.uuid().optional(),
  fillMs: z.coerce.number().int().nonnegative().optional(),
  locale: z.enum(["nl", "en"]).default("nl"),
  utmSource: z.string().max(100).optional(),
  utmMedium: z.string().max(100).optional(),
  utmCampaign: z.string().max(100).optional(),
  website: z.string().max(200).optional(),                     // honeypot; inhoud wordt in de actie gecontroleerd
});
```

Na een fout geeft de actie `values` terug en zetten de velden die als `defaultValue` of `defaultChecked`. React 19 zet het formulier na een actie terug naar de standaardwaarden; zo blijft de invoer staan, ook zonder JavaScript.

### 5.2 Verborgen velden (`FormMeta`)

| Veld | Gevuld door | Doel |
|---|---|---|
| `locale` | server (prop) | taal van record, mail en doorsturen |
| `submissionId` | client bij het laden: `crypto.randomUUID()`, bewaard in `useRef` zodat hij gelijk blijft bij een nieuwe poging | `submission_id`; zonder JavaScript maakt de server er een |
| `fillMs` | client bij versturen: `performance.now()` min het moment van laden | minimale invultijd zonder klokverschil |
| `utmSource`, `utmMedium`, `utmCampaign` | client bij het laden uit `utm_source`, `utm_medium`, `utm_campaign` in de URL | `utm` (spec 13 G6: `google_jobs_apply`) |

Pagina's zijn statisch of ISR, dus deze waarden worden nooit op de server gerenderd; anders zou elke bezoeker dezelfde `submissionId` krijgen.

### 5.3 Telefoon (`lib/validation/phone.ts`)

```ts
export function normalizePhone(input: string): `+${string}` | null;
export function formatPhoneDisplay(e164: string): string;
```

`normalizePhone`: verwijdert spaties, punten, koppeltekens, haakjes en schuine strepen. `00` aan het begin wordt `+`. Begint het met `+`, dan moet het passen op `^\+[1-9][0-9]{7,14}$`; bij `+31` moeten er na `+31` precies 9 cijfers staan en geen extra 0 (`+310612...` wordt `+31612...`). Begint het met `0` en zijn het 10 cijfers, dan wordt het `+31` plus de cijfers zonder de eerste 0. Negen cijfers die met `6` beginnen worden `+316...`. Anders `null`. Geen extra package (B-37, spec 10 §12).

`formatPhoneDisplay`: `+316XXXXXXXX` wordt `06 XX XX XX XX`; `+3170XXXXXXX` wordt `070 XXX XX XX`; een ander `+31`-nummer wordt `0` plus de cijfers in groepen van 3, 3 en 3; andere landen blijven E.164 met een spatie na de landcode.

### 5.4 Schema's per formulier

Alle tekstvelden worden getrimd. De foutcode is een sleutel onder de errors van het formulier: `forms.jobseeker.errors` (apply, register), `forms.staffRequest.errors`, `forms.contactForm.errors`. Elke errors-map bevat ook `blocked` en `generic`; de types dwingen dat af met `satisfies Record<ErrorCode, string>` in een testbestand (§10 stap 12).

**`lib/validation/application.ts`**: `applicationSchema = jobseekerBaseSchema.extend({...}).and(metaSchema)`; `export type ApplicationInput = z.output<typeof applicationSchema>`.

| Veld (FormData) | Type na parse | Verplicht | Regels | Foutcode |
|---|---|---|---|---|
| `firstName` | string | ja | 1 tot 80 tekens | `firstNameRequired`, `firstNameTooLong` |
| `lastName` | string | ja | 1 tot 120 tekens, inclusief tussenvoegsel | `lastNameRequired`, `lastNameTooLong` |
| `phone` | E.164-string | ja | `normalizePhone` geeft niet `null` | `phoneRequired`, `phoneInvalid` |
| `email` | string, kleine letters | ja | `z.email()`, hoogstens 254 tekens | `emailRequired`, `emailInvalid` |
| `city` | string | ja | 2 tot 80 tekens | `cityRequired`, `cityInvalid` |
| `mayWorkInNl` | boolean | ja | `"yes"` of `"no"` | `mayWorkInNlRequired` |
| `hasDrivingLicenseB` | boolean of undefined | nee | `"yes"` of `"no"` | `drivingLicenseInvalid` |
| `availableFrom` | `"YYYY-MM-DD"` of undefined | nee | `z.iso.date()`, vanaf `todayAmsterdam()`, tot en met vandaag plus 365 | `availableFromInvalid`, `availableFromPast`, `availableFromTooFar` |
| `message` | string of undefined | nee | hoogstens 2.000 tekens | `messageTooLong` |
| `cvPath` | string of undefined | nee | `^pending\/[0-9a-f-]{36}\.(pdf\|doc\|docx)$` | `cvUploadExpired` |
| `cvFilename` | string of undefined | nee | hoogstens 200 tekens, alleen het laatste deel na `/` of `\` | geen (wordt ingekort) |
| `retentionConsent` | boolean | nee | `"on"` wordt true, ontbreken false | geen |
| meta | zie §5.1 | | | |

Het vacaturenummer zit niet in het schema; het komt via `bind` binnen en wordt in de actie gecontroleerd. Velden als BSN, geboortedatum, nationaliteit of foto bestaan niet; onbekende sleutels laat `z.object` weg (standaard `strip`).

**`lib/validation/registration.ts`**: dezelfde basis zonder vacature, plus:

| Veld | Type | Verplicht | Regels | Foutcode |
|---|---|---|---|---|
| `occupations` | `OccupationSlug[]` | nee | elk in `OCCUPATION_SLUGS`, ontdubbeld, hoogstens 5 | `occupationsInvalid` |
| `hasDrivingLicenseB` | boolean of undefined | nee | zoals hierboven | `drivingLicenseInvalid` |
| `retentionConsent` | `true` | ja | `"on"` wordt true; daarna `z.literal(true)` (spec 09 §5.2) | `registerConsentRequired`, getoond met `forms.privacy.registerConsent.error` (er is geen sleutel onder `forms.jobseeker.errors`) |

**`lib/validation/staff-request.ts`**:

| Veld | Type | Verplicht | Regels | Foutcode |
|---|---|---|---|---|
| `companyName` | string | ja | 2 tot 120 tekens | `companyNameRequired`, `companyNameInvalid` |
| `contactName` | string | ja | 2 tot 120 tekens | `contactNameRequired`, `contactNameInvalid` |
| `phone` | E.164 | ja | als hierboven | `phoneRequired`, `phoneInvalid` |
| `email` | string | ja | als hierboven | `emailRequired`, `emailInvalid` |
| `kvkNumber` | string of undefined | nee | spaties weg, `^[0-9]{8}$` | `kvkInvalid` |
| `occupations` | `OccupationSlug[]` | zie regel | elk in `OCCUPATION_SLUGS` | `occupationsInvalid` |
| `occupationOther` | string of undefined | zie regel | 2 tot 120 tekens | `occupationOtherInvalid` |
| `headcount` | number | ja | geheel getal 1 tot 500 | `headcountRequired`, `headcountInvalid` |
| `start` | `"asap"` of `"date"` | ja | | `startRequired` |
| `startDate` | `"YYYY-MM-DD"` of undefined | bij `date` | geldige datum, vanaf vandaag | `startDateRequired`, `startDateInvalid`, `startDatePast` |
| `duration` | `RequestDuration` | nee | in `REQUEST_DURATIONS`, standaard `unknown` | `durationInvalid` |
| `hoursPerWeek` | number of undefined | nee | geheel getal 1 tot 60 | `hoursInvalid` |
| `workCity` | string | ja | 2 tot 80 tekens | `workCityRequired`, `workCityInvalid` |
| `description` | string of undefined | nee | hoogstens 2.000 tekens | `descriptionTooLong` |

Regel (`superRefine`): minstens één beroep of `occupationOther`, anders `occupationsRequired` op `occupations` (spiegelt de check `staff_requests_occupation`). Bij `start = "asap"` wordt `startDate` genegeerd (check `staff_requests_start`).

**`lib/validation/contact.ts`**:

| Veld | Type | Verplicht | Regels | Foutcode |
|---|---|---|---|---|
| `name` | string | ja | 2 tot 120 tekens | `nameRequired`, `nameInvalid` |
| `phone` | E.164 of undefined | zie regel | als hierboven | `phoneInvalid`, `phoneRequiredForCallback` |
| `email` | string of undefined | zie regel | als hierboven | `emailInvalid` |
| `topic` | `ContactTopic` | ja | in `CONTACT_TOPICS` | `topicRequired` |
| `message` | string of undefined | zie regel | 2 tot 2.000 tekens | `messageRequired`, `messageTooLong` |

Regels: zonder telefoon en zonder e-mail krijgen beide velden `reachRequired` (check `contact_messages_reachable`); bij `callback` zonder telefoon `phoneRequiredForCallback` (check `contact_messages_callback`); bij een ander onderwerp zonder bericht `messageRequired` (check `contact_messages_body`).

**`lib/validation/cv-upload.ts`**: `cvUploadRequestSchema = z.object({ ext: z.enum(["pdf","doc","docx"], { error: "cvType" }), size: z.number().int().min(1, { error: "cvType" }).max(CV_MAX_BYTES, { error: "cvTooLarge" }) })`.

### 5.5 Server Actions

Gedeelde stappen in `app/actions/_shared.ts` (`import "server-only"`):

```ts
export async function guardSubmission(meta: { website?: string; fillMs?: number }, texts: (string | undefined)[]): Promise<"ok" | "blocked">;
// 1. await isBotRequest() -> "blocked"
// 2. website gevuld -> "blocked"
// 3. fillMs aanwezig en < MIN_FILL_MS -> "blocked" (ontbreekt fillMs, dan alleen zonder JavaScript: geen controle)
// 4. countLinks over texts >= LINK_LIMIT -> "blocked" (contact: zie submitContactMessage)
export function buildUtm(meta: { utmSource?: string; utmMedium?: string; utmCampaign?: string }): { source?: string; medium?: string; campaign?: string } | null;
// kleine letters, alleen [a-z0-9._-], hoogstens 100 tekens; null als alles leeg is
export async function findBySubmissionId(table: "applications" | "staff_requests" | "contact_messages", id: string): Promise<{ id: string; reference: string | null } | null>;
export function logFormFailure(form: FormId, code: string, detail?: { pgCode?: string }): void;
// console.error met alleen formulier, code en Postgres-code; nooit invoer of persoonsgegevens
export async function trackSubmit(props: { form: FormId; beroep?: OccupationSlug; vacature?: number }): Promise<void>;
// track("form_submit", props) uit @vercel/analytics/server; fouten worden ingeslikt
```

**`submitApplication(vacancyNumber: number, prev: FormState, formData: FormData): Promise<FormState>`** (`app/actions/apply.ts`, `"use server"`):

1. `const raw = formDataToRecord(formData, ARRAY_FIELDS)`; `guardSubmission(raw, [raw.message])`; bij `blocked`: `logFormFailure("apply", "blocked")` en `{ status: "error", error: "blocked", values }`.
2. `applicationSchema.safeParse(raw)`; bij fouten `{ status: "invalid", fieldErrors: toFieldErrors(e), values }`.
3. `submissionId = data.submissionId ?? crypto.randomUUID()`. Bestaat al een record met dit id (`findBySubmissionId`), dan direct naar stap 10 met die referentie.
4. `const vacancy = await getVacancyByNumber(vacancyNumber)`; `null` of `state !== "open"` geeft `{ status: "error", error: "vacancyClosed", values }`.
5. `const applicationId = crypto.randomUUID()`.
6. Als `cvPath`: `finalizeCvUpload({ pendingPath: cvPath, applicationId, originalName: cvFilename })`. `CvUploadError` met `invalid_path` of `not_found` wordt veldfout `cvUploadExpired`, `too_large` wordt `cvTooLarge`, `type_mismatch` wordt `cvType`, `storage` wordt `cvUploadFailed`; het resultaat is `{ status: "invalid", fieldErrors: { cv: code }, values }` zonder `cvPath`.
7. Insert via `createSupabaseAdminClient().from("applications").insert({...}).select("reference").single()` met de kolommen uit §5.7.
8. Fout `23505` op `submission_id`: `removeApplicationFiles([applicationId])` als er een cv is verplaatst, record opzoeken en naar stap 10. Elke andere fout: bestanden opruimen, `logFormFailure("apply", "insert", { pgCode })`, `{ status: "error", error: "generic", values }`.
9. `after(async () => { await sendApplicationEmails({ applicationId }); await trackSubmit({ form: "apply", beroep: vacancy.occupation.slug, vacature: vacancy.number }); })`.
10. Buiten elke `try`: `redirect({ href: { pathname: paths.bedankt("sollicitatie"), query: { ref: reference } }, locale })`.

**`submitRegistration(prev, formData)`** (`app/actions/register.ts`): dezelfde stappen zonder vacature; `kind = 'registration'`; e-mail via `sendRegistrationEmails`; doorsturen naar `paths.bedankt("inschrijving")`; analytics met `beroep` alleen als er precies één beroep gekozen is.

**`submitStaffRequest(prev, formData)`** (`app/actions/staff-request.ts`): guard met `[description, occupationOther]`, schema, idempotentie, insert in `staff_requests` met `.select("id, reference").single()`, `after` met `sendStaffRequestEmails({ staffRequestId: id })` en `trackSubmit`, doorsturen naar `paths.bedankt("aanvraag")` met `ref`.

**`submitContactMessage(prev, formData)`** (`app/actions/contact.ts`): guard zonder de linkcontrole; schema; idempotentie; bevat het bericht `LINK_LIMIT` of meer links, dan insert met `status = 'spam'` en geen e-mail (context/11 §6.4, spam wordt na 30 dagen opgeruimd door spec 10); anders insert met de standaardstatus `new` en `after` met `sendContactEmails({ contactMessageId: id })` en `trackSubmit`. Doorsturen naar `paths.bedankt("contact")` zonder parameters.

Revalidatie: geen. Geen publieke pagina toont sollicitaties, aanvragen of berichten, en de beheerschermen van spec 08 lezen ongecachet met de sessieclient (spec 10 §4.3). De acties roepen dus geen `revalidateTag` of `revalidatePath` aan; `redirect` levert de bedankpagina in dezelfde roundtrip.

### 5.6 Uploadroute `POST /api/upload/cv`

`app/api/upload/cv/route.ts`, `export const dynamic = "force-dynamic"`, `runtime = "nodejs"`. Valt buiten de proxy-matcher (spec 01), wel onder BotID (spec 13 §4.4) en de WAF-regel `upload-per-ip` (spec 13 §5.6).

1. `if (await isBotRequest())` geeft 403 `{ "error": "blocked" }`.
2. Header `origin` moet gelijk zijn aan `request.nextUrl.origin`, anders 403 `{ "error": "blocked" }`.
3. `cvUploadRequestSchema.safeParse(await request.json())`; fout geeft 400 `{ "error": "cvType" }` of `{ "error": "cvTooLarge" }`.
4. `createCvUploadTarget(ext)` (spec 10 §4.5) geeft 200 `{ "path", "signedUrl", "contentType" }`; het `token` blijft op de server, het zit al in `signedUrl`.
5. Een fout geeft 500 `{ "error": "cvUploadFailed" }` en `console.error` zonder invoer.

Elk antwoord heeft `Cache-Control: no-store`. De route schrijft niets in de database; een upload zonder sollicitatie blijft hoogstens 24 uur in `pending/` (spec 10, cron `opruimen`, `RETENTION_DAYS.pendingUploadHours`).

### 5.7 Kolommen per insert (spec 10 §5.3)

| Tabel | Kolom | Waarde |
|---|---|---|
| `applications` | `id` | `applicationId` (bij inschrijving ook vooraf gemaakt, voor het cv-pad) |
| | `kind` | `'vacancy'` of `'registration'` |
| | `vacancy_id`, `vacancy_number`, `vacancy_title_snapshot` | uit `VacancyDetail` (`id`, `number`, `title` ingekort tot 80); bij inschrijving `null` |
| | `occupation_slugs` | `[vacancy.occupation.slug]` of de gekozen beroepen |
| | `source` | `'website'` |
| | `first_name`, `last_name`, `email`, `phone_e164`, `city`, `may_work_in_nl` | uit het schema |
| | `available_from` | datum of `null` |
| | `has_driving_license_b` | bij sollicitatie alleen als `vacancy.asksDrivingLicenseB`, anders `null`; bij inschrijving de keuze of `null` |
| | `message` | tekst of `null` |
| | `cv_path`, `cv_filename`, `cv_mime`, `cv_size` | uit `finalizeCvUpload`, anders `null` |
| | `locale` | `locale` |
| | `utm` | `buildUtm(...)` |
| | `retention_consent` | vinkje; de trigger zet `retention_consent_at` en `retention_consent_source = 'form'` |
| | `privacy_notice_version` | `PRIVACY_NOTICE_VERSION` |
| | `submission_id` | `submissionId` |
| `staff_requests` | `company_name`, `contact_name`, `email`, `phone_e164`, `kvk_number`, `occupation_slugs`, `occupation_other`, `headcount`, `start_asap`, `start_date`, `duration`, `hours_per_week`, `work_city`, `description`, `locale`, `utm`, `privacy_notice_version`, `submission_id` | uit het schema; `start_asap = start === "asap"`, `start_date` alleen bij `date` |
| `contact_messages` | `name`, `email`, `phone_e164`, `topic`, `message`, `locale`, `privacy_notice_version`, `submission_id`, eventueel `status = 'spam'` | uit het schema |

Referenties: de triggers van spec 10 zetten `S-<jaar>-<0001>` op `applications` en `P-<jaar>-<0001>` op `staff_requests`. `contact_messages` heeft geen referentie. De logboekregel `<entiteit>.created` met `actor_type = 'public'` schrijft de trigger `write_audit_log`; deze module schrijft geen `activities`.

### 5.8 E-mail (eigenaar spec 11)

Deze module verwacht in `lib/email/forms.ts`:

```ts
export async function sendApplicationEmails(input: { applicationId: string }): Promise<void>;
export async function sendRegistrationEmails(input: { applicationId: string }): Promise<void>;
export async function sendStaffRequestEmails(input: { staffRequestId: string }): Promise<void>;
export async function sendContactEmails(input: { contactMessageId: string }): Promise<void>;
```

Afspraken: elke functie leest het record zelf met de admin-client, kiest de taal uit `locale`, stuurt de bevestiging naar de inzender (alleen als er een e-mailadres is) en de interne melding naar de actieve beheerders met de juiste `notify_*`-vlag, schrijft per mail een rij in `email_log`, gooit nooit een fout en zet nooit een cv als bijlage of de vrije tekst in de bevestiging (B-20, context/11 §6.4). Kiest spec 11 andere namen of argumenten, dan past de bouw-agent alleen de aanroep in stap 9 van §5.5 aan.

### 5.9 Analytics (B-31, spec 09 §4.7)

| Event | Waar | Eigenschappen |
|---|---|---|
| `form_start` | client, eerste focus in het formulier, één keer per paginaweergave | `form`; bij apply ook `beroep`, `vacature` |
| `form_invalid` | client, als de clientcontrole het verzenden stopt of de server `invalid` teruggeeft | `form` |
| `cv_upload` | client, na een geslaagde upload | `form` |
| `form_submit` | server, in `after()` via `@vercel/analytics/server` | `form`, `beroep` (één id of weggelaten), `vacature` (alleen apply) |
| `call_click`, `whatsapp_click` | client, `TrackedContactLink` | `form`, en bij apply `beroep` en `vacature` |

Nooit naam, e-mail, telefoon, woonplaats, vrije tekst, bestandsnaam of referentie. `form_submit` aan de serverkant telt ook inzendingen zonder JavaScript. Custom events vragen Vercel Pro; lokaal schrijft `track` alleen naar de console.

## 6 Tekstelementen

Toon volgt spec 03: je-vorm en B1 voor `forms.jobseeker`, `forms.apply`, `forms.register`, `contact.choice.jobseeker`, `bedankt.application` en `bedankt.registration`; u-vorm voor `forms.staffRequest`, `forms.contactForm`, `contact` (behalve het je-blok) en `bedankt.staffRequest` en `bedankt.contact`. "Wij", nooit "we". De teksten onder `forms.privacy` zijn letterlijk die van spec 09 §6.2. Er staat geen `TODO` in deze namespaces: onbevestigde claims worden niet hier geschreven. Kantoortijden komen uit `common.contact.*` en verschijnen alleen als `contact.openingHours` in `lib/site.ts` gevuld is; spoed en reactietermijn komen uit `common.*` achter `lib/claims.ts`. Beroepsnamen komen uit `beroepen.<id>.enkelvoud` en `.meervoud` (spec 05), persoonslinks uit `common.cta.*` en `common.a11y.*` (spec 03).

Zones voor `npm run check:copy`: de bouw-agent vult `ZONES` in `scripts/check-copy.mjs` aan met je: `forms.jobseeker`, `forms.apply`, `forms.register`, `forms.privacy.applyNotice`, `forms.privacy.registerNotice`, `forms.privacy.talentPool`, `forms.privacy.registerConsent`, `bedankt.application`, `bedankt.registration`; u: `forms.staffRequest`, `forms.contactForm`, `forms.privacy.staffRequestNotice`, `forms.privacy.contactNotice`, `contact.meta`, `contact.intro`, `contact.people`, `contact.details`, `contact.choice.title`, `contact.choice.accent`, `contact.choice.employer`, `contact.form`, `bedankt.staffRequest`, `bedankt.contact`. `contact.choice.jobseeker` en `forms.contactForm.topicHints.jobseeker` vallen al onder de marker `jobseeker`. `forms.common` is neutraal.

### 6.1 Sleutelboom NL

```json
{
  "forms": {
    "common": {
      "optionalMark": "niet verplicht",
      "errorSummary": "{count, plural, =0 {Alle velden zijn goed ingevuld.} one {Eén veld klopt nog niet. Bij het veld staat wat er mis is.} other {# velden kloppen nog niet. Bij elk veld staat wat er mis is.}}",
      "submittingStatus": "Het formulier wordt verstuurd.",
      "networkError": "Het versturen is niet gelukt door een verbindingsprobleem. Probeer het opnieuw of neem telefonisch contact op.",
      "retry": "Probeer opnieuw",
      "honeypotLabel": "Laat dit veld leeg",
      "alternativesLabel": "Andere manieren om contact op te nemen",
      "selectPlaceholder": "Maak een keuze"
    },
    "privacy": {
      "applyNotice": "Wij gebruiken je gegevens voor deze sollicitatie. In onze <link>privacyverklaring</link> lees je hoe lang wij ze bewaren en wat je rechten zijn.",
      "registerNotice": "Wij gebruiken je gegevens om passend werk voor je te zoeken. In onze <link>privacyverklaring</link> lees je hoe lang wij ze bewaren en wat je rechten zijn.",
      "staffRequestNotice": "Wij gebruiken uw gegevens alleen om uw aanvraag te behandelen. In onze <link>privacyverklaring</link> leest u hoe wij daarmee omgaan.",
      "contactNotice": "Wij gebruiken uw gegevens alleen om uw bericht te beantwoorden. In onze <link>privacyverklaring</link> leest u hoe wij daarmee omgaan.",
      "talentPool": {
        "label": "Bewaar mijn gegevens een jaar, zodat Groos mij kan benaderen voor ander passend werk.",
        "hint": "Dit is niet verplicht. Je kunt deze toestemming altijd intrekken met een mail naar {email}."
      },
      "registerConsent": {
        "label": "Ik geef Groos toestemming om mijn gegevens een jaar te bewaren en mij te benaderen voor passend werk.",
        "hint": "Zonder deze toestemming kunnen wij je inschrijving niet bewaren. Je kunt hem altijd intrekken via {email}.",
        "error": "Vink dit vakje aan om je in te schrijven."
      }
    },
    "jobseeker": {
      "fields": {
        "firstName": { "label": "Voornaam" },
        "lastName": { "label": "Achternaam", "hint": "Met tussenvoegsel, bijvoorbeeld van Dijk." },
        "phone": { "label": "Telefoonnummer", "hint": "Hierop bellen of appen wij je. Een buitenlands nummer kan ook." },
        "email": { "label": "E-mailadres", "hint": "Hierop sturen wij je een bevestiging." },
        "city": { "label": "Woonplaats", "hint": "Zo zoeken wij werk dat goed te bereiken is." },
        "mayWorkInNl": {
          "legend": "Mag je in Nederland werken?",
          "yes": "Ja",
          "no": "Nee",
          "noHint": "Solliciteer gerust. Wij bekijken samen met je wat er mogelijk is."
        },
        "hasDrivingLicenseB": { "legend": "Heb je rijbewijs B?", "yes": "Ja", "no": "Nee" },
        "availableFrom": { "label": "Beschikbaar vanaf", "hint": "Laat dit leeg als je direct kunt beginnen." },
        "message": { "label": "Wil je nog iets vertellen?", "hint": "Bijvoorbeeld welk werk je eerder hebt gedaan of op welke dagen je kunt werken." }
      },
      "cv": {
        "label": "Cv toevoegen",
        "hint": "Een pdf of Word-bestand van hoogstens 10 MB.",
        "choose": "Kies bestand",
        "change": "Kies een ander bestand",
        "remove": "Verwijder",
        "removeAria": "Verwijder {name}",
        "uploading": "{name} wordt geüpload, {percent} procent klaar.",
        "uploaded": "{name} is toegevoegd.",
        "noCv": "Heb je geen cv? Dat is geen probleem. Vertel dan kort welk werk je eerder hebt gedaan.",
        "noJs": "Een cv toevoegen lukt alleen als JavaScript aan staat. Je kunt je cv ook later aan ons geven."
      },
      "errors": {
        "firstNameRequired": "Vul je voornaam in.",
        "firstNameTooLong": "Je voornaam mag hoogstens 80 tekens hebben.",
        "lastNameRequired": "Vul je achternaam in.",
        "lastNameTooLong": "Je achternaam mag hoogstens 120 tekens hebben.",
        "phoneRequired": "Vul je telefoonnummer in, dan kunnen wij je bellen.",
        "phoneInvalid": "Dit telefoonnummer klopt niet. Schrijf het zoals 06 12345678 of met een landcode zoals +48.",
        "emailRequired": "Vul je e-mailadres in, dan sturen wij je een bevestiging.",
        "emailInvalid": "Dit e-mailadres klopt niet. Schrijf het zoals naam@voorbeeld.nl.",
        "cityRequired": "Vul je woonplaats in.",
        "cityInvalid": "Een woonplaats heeft 2 tot 80 tekens.",
        "mayWorkInNlRequired": "Kies ja of nee.",
        "drivingLicenseInvalid": "Kies ja of nee.",
        "availableFromInvalid": "Deze datum klopt niet. Kies een datum of laat het veld leeg.",
        "availableFromPast": "Kies een datum vanaf vandaag.",
        "availableFromTooFar": "Kies een datum binnen een jaar.",
        "messageTooLong": "Je bericht is te lang. Gebruik hoogstens 2.000 tekens.",
        "occupationsInvalid": "Kies een beroep uit de lijst.",
        "cvType": "Dit bestand kunnen wij niet openen. Kies een pdf of een Word-bestand.",
        "cvTooLarge": "Dit bestand is groter dan 10 MB. Kies een kleiner bestand.",
        "cvUploadFailed": "Het uploaden is niet gelukt. Controleer je internet en probeer het opnieuw.",
        "cvUploadExpired": "Je cv is niet goed aangekomen. Kies het bestand opnieuw.",
        "cvUploading": "Je cv wordt nog geüpload. Wacht even en verstuur dan opnieuw.",
        "vacancyClosed": "Deze vacature is net gesloten. Bekijk de andere vacatures of schrijf je in.",
        "blocked": "Wij konden het formulier niet versturen. Probeer het over een minuut opnieuw, of bel of app ons.",
        "generic": "Het versturen is niet gelukt. Probeer het opnieuw, of bel of app ons."
      }
    },
    "apply": {
      "title": "Solliciteer op",
      "accent": "deze vacature",
      "intro": "Je bent in een paar minuten klaar en een cv is niet nodig. Ons team belt of appt je om kennis te maken.",
      "vacancyLine": "Je solliciteert op {title}, vacature {number}.",
      "submit": "Verstuur sollicitatie",
      "submitting": "Bezig met versturen",
      "alternatives": {
        "title": "Liever bellen of appen?",
        "body": "Dat kan ook. Noem dan vacature {number}, zodat wij weten waar het over gaat."
      }
    },
    "register": {
      "meta": {
        "title": "Inschrijven of open solliciteren",
        "description": "Schrijf je in bij Groos en vertel welk werk je zoekt en wanneer je kunt beginnen. Inschrijven kost niets en een cv is niet nodig."
      },
      "title": "Schrijf je in voor werk",
      "intro": "Staat er geen vacature tussen die bij je past? Schrijf je dan één keer in, dan bellen wij je zodra er passend werk is.",
      "benefits": [
        "Inschrijven kost je niets",
        "Een cv is niet nodig",
        "Je hebt één vast aanspreekpunt"
      ],
      "formTitle": "Vertel ons",
      "formAccent": "welk werk je zoekt",
      "fields": {
        "occupations": {
          "legend": "In welk werk heb je interesse?",
          "hint": "Kies één of meer beroepen, of sla dit over als je het nog niet weet."
        }
      },
      "submit": "Schrijf je in",
      "submitting": "Bezig met versturen",
      "alternatives": {
        "title": "Liever bellen of appen?",
        "body": "Vertel aan de telefoon of via WhatsApp welk werk je zoekt. Dat werkt net zo goed."
      },
      "jobsLink": "Bekijk eerst de vacatures",
      "steps": {
        "title": "Zo gaat het",
        "accent": "na je inschrijving",
        "items": [
          { "title": "Wij bellen je", "body": "Wij bellen of appen je om te horen welk werk je zoekt." },
          { "title": "Wij zoeken passend werk", "body": "Wij kijken welk werk past bij je ervaring, je uren en waar je woont." },
          { "title": "Je begint met werken", "body": "Wij spreken je eerste werkdag af en vertellen wat je meeneemt." }
        ]
      }
    },
    "staffRequest": {
      "meta": {
        "title": "Personeel aanvragen",
        "description": "Vertel ons welke mensen u zoekt, vanaf wanneer en voor hoe lang. Wij nemen daarna contact met u op om uw aanvraag te bespreken."
      },
      "title": "Personeel aanvragen",
      "intro": "Vertel ons welke mensen u zoekt, vanaf wanneer en voor hoe lang. Wij nemen daarna contact met u op om de aanvraag door te nemen.",
      "formTitle": "Vertel ons",
      "formAccent": "wie u zoekt",
      "groups": { "company": "Uw gegevens", "request": "Uw aanvraag" },
      "fields": {
        "companyName": { "label": "Bedrijfsnaam" },
        "contactName": { "label": "Uw naam" },
        "phone": { "label": "Telefoonnummer", "hint": "Op dit nummer bellen wij u over de aanvraag." },
        "email": { "label": "E-mailadres", "hint": "Hierop sturen wij u een bevestiging." },
        "kvkNumber": { "label": "KvK-nummer", "hint": "Acht cijfers, alleen als u het bij de hand heeft." },
        "occupations": { "legend": "Welk personeel zoekt u?", "hint": "U kunt meer dan één beroep kiezen." },
        "occupationOther": { "label": "Ander werk", "hint": "Zoekt u iemand voor ander werk? Beschrijf het hier kort." },
        "headcount": { "label": "Aantal mensen" },
        "start": { "legend": "Vanaf wanneer?", "asap": "Zo snel mogelijk", "date": "Vanaf een datum" },
        "startDate": { "label": "Startdatum" },
        "duration": {
          "label": "Voor hoe lang ongeveer?",
          "options": {
            "one_day": "Eén dag",
            "days": "Enkele dagen",
            "weeks": "Enkele weken",
            "months": "Enkele maanden",
            "indefinite": "Langdurig",
            "unknown": "Weet ik nog niet"
          }
        },
        "hoursPerWeek": { "label": "Uren per week per persoon", "hint": "Een schatting is genoeg." },
        "workCity": { "label": "Plaats van het werk" },
        "description": { "label": "Toelichting", "hint": "Bijvoorbeeld de werktijden, de taken of eisen zoals VCA of een rijbewijs." }
      },
      "errors": {
        "companyNameRequired": "Vul de naam van uw bedrijf in.",
        "companyNameInvalid": "Een bedrijfsnaam heeft 2 tot 120 tekens.",
        "contactNameRequired": "Vul uw naam in.",
        "contactNameInvalid": "Een naam heeft 2 tot 120 tekens.",
        "phoneRequired": "Vul uw telefoonnummer in, dan kunnen wij u bellen.",
        "phoneInvalid": "Dit telefoonnummer klopt niet. Schrijf het zoals 070 1234567 of 06 12345678.",
        "emailRequired": "Vul uw e-mailadres in, dan sturen wij u een bevestiging.",
        "emailInvalid": "Dit e-mailadres klopt niet. Schrijf het zoals naam@bedrijf.nl.",
        "kvkInvalid": "Een KvK-nummer heeft acht cijfers. Laat het veld leeg als u het niet weet.",
        "occupationsRequired": "Kies minstens één beroep of beschrijf het werk bij ander werk.",
        "occupationsInvalid": "Kies een beroep uit de lijst.",
        "occupationOtherInvalid": "Beschrijf het werk in 2 tot 120 tekens.",
        "headcountRequired": "Vul in hoeveel mensen u nodig heeft.",
        "headcountInvalid": "Vul een aantal van 1 tot 500 in.",
        "startRequired": "Kies zo snel mogelijk of vanaf een datum.",
        "startDateRequired": "Kies een startdatum.",
        "startDateInvalid": "Deze datum klopt niet. Kies een andere datum.",
        "startDatePast": "Kies een datum vanaf vandaag.",
        "durationInvalid": "Kies een duur uit de lijst.",
        "hoursInvalid": "Vul een aantal uren van 1 tot 60 in.",
        "workCityRequired": "Vul de plaats in waar het werk is.",
        "workCityInvalid": "Een plaatsnaam heeft 2 tot 80 tekens.",
        "descriptionTooLong": "Uw toelichting is te lang. Gebruik hoogstens 2.000 tekens.",
        "blocked": "Wij konden uw aanvraag niet versturen. Probeer het over een minuut opnieuw of bel ons.",
        "generic": "Het versturen is niet gelukt. Probeer het opnieuw of bel ons."
      },
      "submit": "Verstuur aanvraag",
      "submitting": "Bezig met versturen",
      "alternatives": {
        "title": "Liever direct overleggen?",
        "body": "Bel of app ons team. Wij nemen uw aanvraag dan telefonisch met u door."
      },
      "steps": {
        "title": "Zo gaat het",
        "accent": "na uw aanvraag",
        "items": [
          { "title": "Wij bellen u", "body": "Wij bespreken met u de taken, de werktijden en de startdatum." },
          { "title": "U krijgt een voorstel", "body": "Wij stellen medewerkers voor en sturen u een voorstel met een helder uurtarief." },
          { "title": "De medewerker begint", "body": "Op de afgesproken dag begint de medewerker, en wij blijven uw aanspreekpunt." }
        ]
      }
    },
    "contactForm": {
      "fields": {
        "name": { "label": "Naam" },
        "phone": { "label": "Telefoonnummer", "hint": "Vul een telefoonnummer of een e-mailadres in, of allebei." },
        "email": { "label": "E-mailadres" },
        "topic": {
          "legend": "Waar gaat uw vraag over?",
          "options": {
            "job_seeker": "Ik zoek werk",
            "employer": "Ik zoek personeel",
            "callback": "Bel mij terug",
            "other": "Iets anders"
          }
        },
        "message": { "label": "Uw bericht", "hintCallback": "Dit veld is niet verplicht. Schrijf erbij wanneer wij u het beste kunnen bellen." }
      },
      "topicHints": {
        "jobseeker": "Zoek je werk? Dan kun je je ook direct <link>inschrijven</link>.",
        "employer": "Zoekt u personeel? Dan kunt u ook direct <link>personeel aanvragen</link>.",
        "callback": "Wij bellen u terug op het nummer dat u hierboven invult.",
        "other": "Schrijf in uw bericht waar wij u mee kunnen helpen."
      },
      "errors": {
        "nameRequired": "Vul uw naam in.",
        "nameInvalid": "Een naam heeft 2 tot 120 tekens.",
        "reachRequired": "Vul een telefoonnummer of een e-mailadres in.",
        "phoneInvalid": "Dit telefoonnummer klopt niet. Schrijf het zoals 06 12345678.",
        "phoneRequiredForCallback": "Vul uw telefoonnummer in, dan bellen wij u terug.",
        "emailInvalid": "Dit e-mailadres klopt niet. Schrijf het zoals naam@voorbeeld.nl.",
        "topicRequired": "Kies waar uw vraag over gaat.",
        "messageRequired": "Schrijf kort waar uw vraag over gaat.",
        "messageTooLong": "Uw bericht is te lang. Gebruik hoogstens 2.000 tekens.",
        "blocked": "Wij konden uw bericht niet versturen. Probeer het over een minuut opnieuw of bel ons.",
        "generic": "Het versturen is niet gelukt. Probeer het opnieuw of bel ons."
      },
      "submit": "Verstuur bericht",
      "submitting": "Bezig met versturen"
    }
  },
  "contact": {
    "meta": {
      "title": "Contact",
      "description": "Bel, app of mail het team van Groos Personeelsdiensten in Den Haag. Stuur een bericht via het formulier of maak een afspraak om langs te komen."
    },
    "title": "Contact met Groos Personeelsdiensten",
    "intro": "Bij Groos spreekt u altijd iemand van ons team. Bel of app ons, of stuur een bericht via het formulier.",
    "people": {
      "title": "Kom in contact met",
      "accent": "ons team",
      "intro": "Ons team is bereikbaar op één nummer, ook via WhatsApp. U kunt ons ook een e-mail sturen."
    },
    "details": {
      "title": "Gegevens van",
      "accent": "Groos Personeelsdiensten",
      "phone": "Algemeen nummer",
      "kvk": "KvK-nummer"
    },
    "choice": {
      "title": "Waar kunnen wij",
      "accent": "u mee helpen?",
      "jobseeker": {
        "title": "Ik zoek werk",
        "body": "Bekijk de vacatures of schrijf je in, ook zonder cv."
      },
      "employer": {
        "title": "Ik zoek personeel",
        "body": "Vertel ons wie u zoekt en vanaf wanneer. Een aanvraag doen is vrijblijvend."
      }
    },
    "form": {
      "title": "Stuur ons",
      "accent": "een bericht",
      "intro": "Kies waar uw vraag over gaat. Wij antwoorden per e-mail of bellen u terug."
    }
  },
  "bedankt": {
    "application": {
      "metaTitle": "Bedankt voor je sollicitatie",
      "title": "Bedankt voor je sollicitatie",
      "intro": "Wij hebben je sollicitatie goed ontvangen. Je krijgt ook een bevestiging per e-mail.",
      "reference": "Je referentienummer is {reference}.",
      "whoCalls": "Ons team belt of appt je om kennis te maken. Houd je telefoon bij de hand.",
      "steps": {
        "title": "Zo gaat het",
        "accent": "verder",
        "items": [
          { "title": "Wij bekijken je sollicitatie", "body": "Wij leggen je gegevens naast de vacature." },
          { "title": "Wij bellen of appen je", "body": "Wij bespreken je ervaring, je uren en wanneer je kunt beginnen." },
          { "title": "Je begint met werken", "body": "Past het werk, dan spreken wij je eerste werkdag af." }
        ]
      }
    },
    "registration": {
      "metaTitle": "Bedankt voor je inschrijving",
      "title": "Bedankt voor je inschrijving",
      "intro": "Wij hebben je inschrijving goed ontvangen. Je krijgt ook een bevestiging per e-mail.",
      "reference": "Je referentienummer is {reference}.",
      "whoCalls": "Ons team belt of appt je om te horen welk werk je zoekt.",
      "steps": {
        "title": "Zo gaat het",
        "accent": "verder",
        "items": [
          { "title": "Wij bellen je", "body": "Wij bespreken welk werk je zoekt en wanneer je kunt werken." },
          { "title": "Wij zoeken passend werk", "body": "Wij kijken welk werk past bij je ervaring en waar je woont." },
          { "title": "Je begint met werken", "body": "Is er passend werk, dan spreken wij je eerste werkdag af." }
        ]
      }
    },
    "staffRequest": {
      "metaTitle": "Bedankt voor uw aanvraag",
      "title": "Bedankt voor uw aanvraag",
      "intro": "Wij hebben uw aanvraag goed ontvangen. U krijgt ook een bevestiging per e-mail.",
      "reference": "Uw referentienummer is {reference}.",
      "whoCalls": "Ons team neemt contact met u op om de aanvraag door te nemen.",
      "steps": {
        "title": "Zo gaat het",
        "accent": "verder",
        "items": [
          { "title": "Wij bellen u", "body": "Wij bespreken de taken, de werktijden en de startdatum." },
          { "title": "U krijgt een voorstel", "body": "Wij stellen medewerkers voor met een helder uurtarief." },
          { "title": "De medewerker begint", "body": "Op de afgesproken dag begint de medewerker." }
        ]
      },
      "employersLink": "Terug naar werkgevers"
    },
    "contact": {
      "metaTitle": "Bedankt voor uw bericht",
      "title": "Bedankt voor uw bericht",
      "intro": "Wij hebben uw bericht goed ontvangen. Heeft u een e-mailadres ingevuld, dan krijgt u ook een bevestiging per e-mail.",
      "whoCalls": "Ons team beantwoordt uw bericht. Heeft u om terugbellen gevraagd, dan bellen wij u op het nummer dat u heeft ingevuld.",
      "homeLink": "Naar de homepage"
    }
  }
}
```

Parameters: `{name}` is alleen nog een bestandsnaam (cv); persoonsnamen komen niet voor (B-60); `{email}` is `contact.email`; `{phone}` is `Phone.display`; `{number}` en `{title}` komen uit de vacature; `{reference}` vult `BedanktReference` in; `{percent}` is een geheel getal. De link in `forms.privacy.*` gaat naar `/privacyverklaring` met het anker uit §4.4 tot en met §4.9; in `forms.contactForm.topicHints` naar `/inschrijven` of `/werkgevers/personeel-aanvragen`.

### 6.2 Sleutelboom EN

```json
{
  "forms": {
    "common": {
      "optionalMark": "optional",
      "errorSummary": "{count, plural, =0 {All fields are filled in correctly.} one {One field is not correct yet. The field shows what is wrong.} other {# fields are not correct yet. Each field shows what is wrong.}}",
      "submittingStatus": "The form is being sent.",
      "networkError": "Sending failed because of a connection problem. Please try again or contact us by phone.",
      "retry": "Try again",
      "honeypotLabel": "Leave this field empty",
      "alternativesLabel": "Other ways to get in touch",
      "selectPlaceholder": "Make a choice"
    },
    "privacy": {
      "applyNotice": "We use your details for this application. Read in our <link>privacy statement</link> how long we keep them and what your rights are.",
      "registerNotice": "We use your details to find suitable work for you. Read in our <link>privacy statement</link> how long we keep them and what your rights are.",
      "staffRequestNotice": "We only use your details to handle your request. Read in our <link>privacy statement</link> how we handle them.",
      "contactNotice": "We only use your details to answer your message. Read in our <link>privacy statement</link> how we handle them.",
      "talentPool": {
        "label": "Keep my details for one year so Groos can contact me about other suitable work.",
        "hint": "This is optional. You can withdraw your consent at any time by emailing {email}."
      },
      "registerConsent": {
        "label": "I give Groos permission to keep my details for one year and to contact me about suitable work.",
        "hint": "Without this permission we cannot keep your registration. You can withdraw it at any time via {email}.",
        "error": "Tick this box to register."
      }
    },
    "jobseeker": {
      "fields": {
        "firstName": { "label": "First name" },
        "lastName": { "label": "Last name", "hint": "Including any prefix, for example van Dijk." },
        "phone": { "label": "Phone number", "hint": "We call or message you on this number. A foreign number is fine." },
        "email": { "label": "Email address", "hint": "We send your confirmation to this address." },
        "city": { "label": "Town or city", "hint": "This helps us find work that is easy to reach." },
        "mayWorkInNl": {
          "legend": "Are you allowed to work in the Netherlands?",
          "yes": "Yes",
          "no": "No",
          "noHint": "Please apply anyway. We will look at the options together with you."
        },
        "hasDrivingLicenseB": { "legend": "Do you have a category B driving licence?", "yes": "Yes", "no": "No" },
        "availableFrom": { "label": "Available from", "hint": "Leave this empty if you can start straight away." },
        "message": { "label": "Anything else you would like to tell us?", "hint": "For example what work you have done before or which days you can work." }
      },
      "cv": {
        "label": "Add your CV",
        "hint": "A PDF or Word file of up to 10 MB.",
        "choose": "Choose file",
        "change": "Choose another file",
        "remove": "Remove",
        "removeAria": "Remove {name}",
        "uploading": "{name} is uploading, {percent} percent done.",
        "uploaded": "{name} has been added.",
        "noCv": "No CV? That is fine. Just tell us briefly what work you have done before.",
        "noJs": "Adding a CV only works with JavaScript switched on. You can also give us your CV later."
      },
      "errors": {
        "firstNameRequired": "Please enter your first name.",
        "firstNameTooLong": "Your first name can be at most 80 characters.",
        "lastNameRequired": "Please enter your last name.",
        "lastNameTooLong": "Your last name can be at most 120 characters.",
        "phoneRequired": "Please enter your phone number so we can call you.",
        "phoneInvalid": "This phone number is not correct. Write it like 06 12345678 or with a country code such as +48.",
        "emailRequired": "Please enter your email address so we can send you a confirmation.",
        "emailInvalid": "This email address is not correct. Write it like name@example.com.",
        "cityRequired": "Please enter your town or city.",
        "cityInvalid": "A town or city has 2 to 80 characters.",
        "mayWorkInNlRequired": "Please choose yes or no.",
        "drivingLicenseInvalid": "Please choose yes or no.",
        "availableFromInvalid": "This date is not correct. Choose a date or leave the field empty.",
        "availableFromPast": "Choose a date from today onwards.",
        "availableFromTooFar": "Choose a date within one year.",
        "messageTooLong": "Your message is too long. Use at most 2,000 characters.",
        "occupationsInvalid": "Choose an occupation from the list.",
        "cvType": "We cannot open this file. Choose a PDF or a Word file.",
        "cvTooLarge": "This file is larger than 10 MB. Choose a smaller file.",
        "cvUploadFailed": "The upload did not work. Check your internet connection and try again.",
        "cvUploadExpired": "Your CV did not arrive properly. Please choose the file again.",
        "cvUploading": "Your CV is still uploading. Wait a moment and then send again.",
        "vacancyClosed": "This job has just closed. Look at our other jobs or register with us.",
        "blocked": "We could not send the form. Try again in a minute, or call or message us.",
        "generic": "Sending did not work. Please try again, or call or message us."
      }
    },
    "apply": {
      "title": "Apply for",
      "accent": "this job",
      "intro": "It only takes a few minutes and you do not need a CV. Our team will call or message you to get to know you.",
      "vacancyLine": "You are applying for {title}, job {number}.",
      "submit": "Send application",
      "submitting": "Sending",
      "alternatives": {
        "title": "Prefer to call or message?",
        "body": "That works too. Mention job {number} so we know what it is about."
      }
    },
    "register": {
      "meta": {
        "title": "Register or apply openly",
        "description": "Register with Groos and tell us what work you are looking for and when you can start. Registering is free and you do not need a CV."
      },
      "title": "Register for work",
      "intro": "Can you not find a job that suits you? Register once and we will call you as soon as there is suitable work.",
      "benefits": [
        "Registering is free",
        "You do not need a CV",
        "You have one dedicated point of contact"
      ],
      "formTitle": "Tell us",
      "formAccent": "what work you are looking for",
      "fields": {
        "occupations": {
          "legend": "What work are you interested in?",
          "hint": "Choose one or more occupations, or skip this if you are not sure yet."
        }
      },
      "submit": "Register",
      "submitting": "Sending",
      "alternatives": {
        "title": "Prefer to call or message?",
        "body": "Tell us by phone or WhatsApp what work you are looking for. That works just as well."
      },
      "jobsLink": "View the jobs first",
      "steps": {
        "title": "What happens",
        "accent": "after you register",
        "items": [
          { "title": "We call you", "body": "We call or message you to hear what work you are looking for." },
          { "title": "We look for suitable work", "body": "We look at which work fits your experience, your hours and where you live." },
          { "title": "You start working", "body": "We agree on your first working day and tell you what to bring." }
        ]
      }
    },
    "staffRequest": {
      "meta": {
        "title": "Request staff",
        "description": "Tell us which people you need, from when and for how long. We will then contact you to discuss your request and the start date of the work."
      },
      "title": "Request staff",
      "intro": "Tell us which people you need, from when and for how long. We will then contact you to go through the request.",
      "formTitle": "Tell us",
      "formAccent": "who you need",
      "groups": { "company": "Your details", "request": "Your request" },
      "fields": {
        "companyName": { "label": "Company name" },
        "contactName": { "label": "Your name" },
        "phone": { "label": "Phone number", "hint": "We call you on this number about the request." },
        "email": { "label": "Email address", "hint": "We send your confirmation to this address." },
        "kvkNumber": { "label": "Chamber of Commerce (KvK) number", "hint": "Eight digits, only if you have it to hand." },
        "occupations": { "legend": "What staff do you need?", "hint": "You can choose more than one occupation." },
        "occupationOther": { "label": "Other work", "hint": "Do you need someone for other work? Describe it briefly here." },
        "headcount": { "label": "Number of people" },
        "start": { "legend": "From when?", "asap": "As soon as possible", "date": "From a date" },
        "startDate": { "label": "Start date" },
        "duration": {
          "label": "For roughly how long?",
          "options": {
            "one_day": "One day",
            "days": "A few days",
            "weeks": "A few weeks",
            "months": "A few months",
            "indefinite": "Long term",
            "unknown": "Not sure yet"
          }
        },
        "hoursPerWeek": { "label": "Hours per week per person", "hint": "An estimate is fine." },
        "workCity": { "label": "Place of work" },
        "description": { "label": "Further details", "hint": "For example working hours, tasks or requirements such as VCA or a driving licence." }
      },
      "errors": {
        "companyNameRequired": "Please enter the name of your company.",
        "companyNameInvalid": "A company name has 2 to 120 characters.",
        "contactNameRequired": "Please enter your name.",
        "contactNameInvalid": "A name has 2 to 120 characters.",
        "phoneRequired": "Please enter your phone number so we can call you.",
        "phoneInvalid": "This phone number is not correct. Write it like 070 1234567 or 06 12345678.",
        "emailRequired": "Please enter your email address so we can send you a confirmation.",
        "emailInvalid": "This email address is not correct. Write it like name@company.com.",
        "kvkInvalid": "A KvK number has eight digits. Leave the field empty if you do not know it.",
        "occupationsRequired": "Choose at least one occupation or describe the work under other work.",
        "occupationsInvalid": "Choose an occupation from the list.",
        "occupationOtherInvalid": "Describe the work in 2 to 120 characters.",
        "headcountRequired": "Please enter how many people you need.",
        "headcountInvalid": "Enter a number from 1 to 500.",
        "startRequired": "Choose as soon as possible or from a date.",
        "startDateRequired": "Choose a start date.",
        "startDateInvalid": "This date is not correct. Choose another date.",
        "startDatePast": "Choose a date from today onwards.",
        "durationInvalid": "Choose a duration from the list.",
        "hoursInvalid": "Enter a number of hours from 1 to 60.",
        "workCityRequired": "Please enter the place where the work is.",
        "workCityInvalid": "A place name has 2 to 80 characters.",
        "descriptionTooLong": "Your details are too long. Use at most 2,000 characters.",
        "blocked": "We could not send your request. Try again in a minute or call us.",
        "generic": "Sending did not work. Please try again or call us."
      },
      "submit": "Send request",
      "submitting": "Sending",
      "alternatives": {
        "title": "Prefer to talk directly?",
        "body": "Call or message our team. We will then go through your request with you by phone."
      },
      "steps": {
        "title": "What happens",
        "accent": "after your request",
        "items": [
          { "title": "We call you", "body": "We discuss the tasks, the working hours and the start date with you." },
          { "title": "You receive a proposal", "body": "We put forward workers and send you a proposal with a clear hourly rate." },
          { "title": "The worker starts", "body": "On the agreed day the worker starts, and we remain your contact." }
        ]
      }
    },
    "contactForm": {
      "fields": {
        "name": { "label": "Name" },
        "phone": { "label": "Phone number", "hint": "Enter a phone number or an email address, or both." },
        "email": { "label": "Email address" },
        "topic": {
          "legend": "What is your question about?",
          "options": {
            "job_seeker": "I am looking for work",
            "employer": "I am looking for staff",
            "callback": "Call me back",
            "other": "Something else"
          }
        },
        "message": { "label": "Your message", "hintCallback": "This field is optional. Let us know what time suits you for a call." }
      },
      "topicHints": {
        "jobseeker": "Looking for work? You can also <link>register</link> straight away.",
        "employer": "Looking for staff? You can also <link>request staff</link> straight away.",
        "callback": "We will call you back on the number you enter above.",
        "other": "Tell us in your message how we can help you."
      },
      "errors": {
        "nameRequired": "Please enter your name.",
        "nameInvalid": "A name has 2 to 120 characters.",
        "reachRequired": "Please enter a phone number or an email address.",
        "phoneInvalid": "This phone number is not correct. Write it like 06 12345678.",
        "phoneRequiredForCallback": "Please enter your phone number so we can call you back.",
        "emailInvalid": "This email address is not correct. Write it like name@example.com.",
        "topicRequired": "Choose what your question is about.",
        "messageRequired": "Briefly describe what your question is about.",
        "messageTooLong": "Your message is too long. Use at most 2,000 characters.",
        "blocked": "We could not send your message. Try again in a minute or call us.",
        "generic": "Sending did not work. Please try again or call us."
      },
      "submit": "Send message",
      "submitting": "Sending"
    }
  },
  "contact": {
    "meta": {
      "title": "Contact",
      "description": "Call, message or email the team of Groos Personeelsdiensten in The Hague. Send a message using the form or make an appointment to visit."
    },
    "title": "Contact Groos Personeelsdiensten",
    "intro": "At Groos you always speak to someone from our team. Call or message us, or send a message using the form.",
    "people": {
      "title": "Get in touch with",
      "accent": "our team",
      "intro": "Our team can be reached on one number, also through WhatsApp. You can also send us an email."
    },
    "details": {
      "title": "Details of",
      "accent": "Groos Personeelsdiensten",
      "phone": "Main number",
      "kvk": "Chamber of Commerce (KvK) number"
    },
    "choice": {
      "title": "How can we",
      "accent": "help you?",
      "jobseeker": {
        "title": "I am looking for work",
        "body": "View the jobs or register with us, even without a CV."
      },
      "employer": {
        "title": "I am looking for staff",
        "body": "Tell us who you need and from when. Submitting a request places you under no obligation."
      }
    },
    "form": {
      "title": "Send us",
      "accent": "a message",
      "intro": "Choose what your question is about. We reply by email or call you back."
    }
  },
  "bedankt": {
    "application": {
      "metaTitle": "Thank you for your application",
      "title": "Thank you for your application",
      "intro": "We have received your application. You will also get a confirmation by email.",
      "reference": "Your reference number is {reference}.",
      "whoCalls": "Our team will call or message you to get to know you. Keep your phone close by.",
      "steps": {
        "title": "What happens",
        "accent": "next",
        "items": [
          { "title": "We review your application", "body": "We compare your details with the job." },
          { "title": "We call or message you", "body": "We discuss your experience, your hours and when you can start." },
          { "title": "You start working", "body": "If the job suits you, we agree on your first working day." }
        ]
      }
    },
    "registration": {
      "metaTitle": "Thank you for registering",
      "title": "Thank you for registering",
      "intro": "We have received your registration. You will also get a confirmation by email.",
      "reference": "Your reference number is {reference}.",
      "whoCalls": "Our team will call or message you to hear what work you are looking for.",
      "steps": {
        "title": "What happens",
        "accent": "next",
        "items": [
          { "title": "We call you", "body": "We discuss what work you are looking for and when you can work." },
          { "title": "We look for suitable work", "body": "We look at which work fits your experience and where you live." },
          { "title": "You start working", "body": "When there is suitable work, we agree on your first working day." }
        ]
      }
    },
    "staffRequest": {
      "metaTitle": "Thank you for your request",
      "title": "Thank you for your request",
      "intro": "We have received your request. You will also get a confirmation by email.",
      "reference": "Your reference number is {reference}.",
      "whoCalls": "Our team will contact you to go through the request.",
      "steps": {
        "title": "What happens",
        "accent": "next",
        "items": [
          { "title": "We call you", "body": "We discuss the tasks, the working hours and the start date." },
          { "title": "You receive a proposal", "body": "We put forward workers with a clear hourly rate." },
          { "title": "The worker starts", "body": "On the agreed day the worker starts." }
        ]
      },
      "employersLink": "Back to employers"
    },
    "contact": {
      "metaTitle": "Thank you for your message",
      "title": "Thank you for your message",
      "intro": "We have received your message. If you entered an email address, you will also get a confirmation by email.",
      "whoCalls": "Our team will answer your message. If you asked us to call you back, we will call the number you entered.",
      "homeLink": "Go to the homepage"
    }
  }
}
```

### 6.3 Overige tekst

- WhatsApp-voorinvulteksten: `common.whatsapp.vacatureSolliciteren`, `common.whatsapp.werkzoekende`, `common.whatsapp.werkgever` en `common.whatsapp.algemeen` (spec 03 §6.17); deze module maakt geen eigen voorinvultekst.
- Contactlinks: `common.cta.call`, `common.cta.whatsapp`, `common.cta.email`, `common.a11y.call`, `common.team.title` en `common.opensInNewTab` (spec 03).
- Contactgegevens op `/contact`: `common.contact.address`, `common.contact.email`, `common.contact.officeHours`, `common.contact.officeHoursValue`, `common.contact.afterHours` en `common.address.byAppointment` (spec 03).
- Notities: `common.notes.noObligationEmployer` en `common.notes.urgentEmployer` zonder vlag; `common.notes.responseJobseeker` en `responseEmployer` alleen bij `responseTime`.
- Beroepsnamen: `beroepen.<id>.enkelvoud` en `.meervoud` (spec 05).
- Kruimelpaden: `header.nav.werkzoekenden`, `header.nav.inschrijven`, `header.nav.werkgevers`, `header.nav.personeelAanvragen` en `header.nav.contact`; knoppen en links: `common.cta.viewJobs`, `common.cta.whatsapp`, `common.cta.call`, `common.cta.requestStaff` en `common.cta.register` (spec 03). Deze module heeft daarvoor geen eigen sleutels; alleen `bedankt.staffRequest.employersLink` en `bedankt.contact.homeLink` zijn van deze module.
- Geen tekst in componenten: ook `aria-label`, placeholders en de fallback van `FormErrorBoundary` komen uit messages (spec 03 §6.13).

## 7 SEO

| Pagina | Titel (via `pageMetadata`) | Beschrijving | Index | JSON-LD |
|---|---|---|---|---|
| `/inschrijven` | `forms.register.meta.title` | `forms.register.meta.description` | ja, in sitemap en `llms.txt` via `lib/routes.ts` (spec 01) | `BreadcrumbList` via `Breadcrumbs` |
| `/werkgevers/personeel-aanvragen` | `forms.staffRequest.meta.title` | `forms.staffRequest.meta.description` | ja | `BreadcrumbList` via `Breadcrumbs` |
| `/contact` | `contact.meta.title` | `contact.meta.description` | ja | BreadcrumbList via Breadcrumbs; EmploymentAgency via `employmentAgencyLd` (builder spec 12), gerenderd door deze pagina |
| `/bedankt/*` | `bedankt.<key>.metaTitle` | `bedankt.<key>.intro` | `noindex, follow` via `pageMetadata({ ..., noindex: true })`, niet in sitemap of `llms.txt` | geen |
| `/vacatures/[slug]` met formulier | spec 06 | spec 06 | spec 06 | `JobPosting` met `directApply: true` (spec 12); het formulier op de pagina rechtvaardigt dat |

Bedankpagina's: `pageMetadata({ locale, path: paths.bedankt(soort), title, description, noindex: true })` met de bestaande titel (`bedankt.<key>.metaTitle`) en beschrijving (`bedankt.<key>.intro`); er komt geen eigen `robots`-object over de uitkomst heen.

`generateMetadata` gebruikt `getTranslations({ locale, namespace })` met de locale uit `params` (spec 01 §4.11.5). Canonical en hreflang komen uit `pageMetadata()`. De uploadroute en de acties hebben geen eigen URL in de sitemap; `/api` staat in `robots.txt` onder `Disallow` (spec 12).

## 8 Toegankelijkheid en performance

**Structuur.** Eén h1 per pagina; secties met h2 (`title` plus `accent`); asides, kaarten en stappen met h3 (B-05). Elk formulier is een `<form>` met `aria-labelledby` naar de h2 van zijn sectie. Groepen (werkrecht, rijbewijs, beroepen, start, onderwerp, gegevens) staan in `<fieldset>` met `<legend>`.

**Labels en invoer.** Elk veld heeft een zichtbaar `<label>`; placeholders vervangen nooit een label. Invoertypes en `autocomplete`:

| Veld | `type` | `autocomplete` | `inputMode` |
|---|---|---|---|
| Voornaam | text | `given-name` | |
| Achternaam | text | `family-name` | |
| Naam (contact), Uw naam (aanvraag) | text | `name` | |
| Telefoonnummer | tel | `tel` | `tel` |
| E-mailadres | email | `email` | `email` |
| Woonplaats | text | `address-level2` | |
| Bedrijfsnaam | text | `organization` | |
| KvK-nummer | text | `off` | `numeric` |
| Plaats van het werk | text | `off` | |
| Aantal mensen, uren | number | `off` | `numeric` |
| Datums | date | `off` | |
| Honeypot `website` | text | `off` | |

**Fouten.** Fouttekst staat direct onder het veld in `FieldError` (spec 02: `text-destructive` met icoon `CircleAlert`; kleur is nooit de enige drager, WCAG 1.4.1), gekoppeld via `aria-describedby`; het veld krijgt `aria-invalid="true"`. Bovenaan staat `ErrorSummary` met `role="alert"`. Na een mislukte poging gaat de focus naar het eerste ongeldige veld; zonder JavaScript krijgt dat veld `autoFocus` in de server-HTML. Globale fouten (`blocked`, `generic`, `vacancyClosed`) staan in `FormAlert` met `role="alert"` boven de verzendknop, met daaronder bel- en WhatsApp-links.

**Status.** Tijdens verzenden rendert `CtaButton` een `role="status"` met `pendingLabel` (`forms.<form>.submitting`); de cv-voortgang in `aria-live="polite"`.

**Toetsenbord en doelgrootte.** Alle bediening met Tab, Shift+Tab, spatie en pijltjes (native radio's en checkboxes). Klikvlakken minimaal 44 bij 44 px (WCAG 2.5.8 vraagt 24). Zichtbare focus volgens spec 02 §4.5; geen eigen ring-klassen. De actiebalk van spec 01 schuift weg zodra een veld focus heeft.

**Honeypot.** `<div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">` met label `forms.common.honeypotLabel` en `<input name="website" tabIndex={-1} autoComplete="off">`. Niet `display: none`, omdat sommige bots die velden overslaan.

**Reduced motion.** Geen animaties behalve de spinner van `CtaButton` (`motion-safe:animate-spin`) en de voortgangsbalk (`motion-reduce:transition-none`). Formulieren staan nooit in een `Reveal`, zodat ze zonder JavaScript zichtbaar zijn (spec 14 §8.1).

**Contrast.** Hints en de informatieregel in `text-muted-foreground` met minimaal 4,5:1 (spec 02); foutkleur `destructive` op wit minimaal 4,5:1.

**Server en client.** Pagina's en `ApplySection`, `ContactAside`, `ContactPersonCard` zijn server components; alleen de formulieren, velden, `TrackedContactLink`, `FormErrorBoundary` en `BedanktReference` zijn client. Clienttekst komt uit de namespace `forms`, die al in `CLIENT_NAMESPACES` van spec 01 staat; `bedankt` en `contact` gaan als props mee.

**Performance.** Formulierpagina's blijven binnen 235 kB JavaScript gzip (spec 14 §8.5). zod 4 en de velden laden alleen op formulierpagina's; `ApplyForm` laadt op de vacaturepagina met `next/dynamic` alleen als dat het budget redt, anders gewoon. Het cv gaat nooit door een Vercel-functie (signed upload URL), dus de bodylimieten van 1 MB (Server Actions) en 4,5 MB (functies) spelen niet. E-mail en analytics lopen in `after()`, zodat de bezoeker niet wacht. Geen extra dependencies: `zod` staat in B-37, `@vercel/analytics` is er al.

## 9 21st.dev-opdracht voor sub-agents

De bouw-agent van deze module spawnt per plek hieronder één sub-agent. Elke sub-agent laadt de tools met ToolSearch `select:mcp__magic__search,mcp__magic__get_inspiration`, draait `search` met `type: "component"` op alle genoemde formuleringen en `get_inspiration` op de genoemde vraag, en roept `get_component` niet aan tijdens het kiezen.

**Gemeenschappelijke selectiecriteria.** Minimaal en rustig op een witte achtergrond; blauw alleen als accent en alleen via de tokens van spec 02 (`primary`, `ring`, de merktokens); geen glas, gloed, bewegende randen, rasters of donkere vlakken (B-29); shadcn-compatibel en op Tailwind 4; native formulierelementen of de bestaande `@base-ui-components/react` 1.0.0-rc.0, geen nieuwe dependency zonder reden (geen react-dropzone, geen extra Radix- of Base UI-versie, geen framer-motion in formulieren); toegankelijk met gekoppelde labels, `aria-describedby`, `aria-invalid` en zichtbare focus; werkt op 390 px met één kolom; past bij de boodschap van de plek: drempelloos en geruststellend voor werkzoekenden, zakelijk en voorspelbaar voor opdrachtgevers.

**Oplevering per sub-agent.** Twee tot vier kandidaten met id, naam en preview-URL, per kandidaat twee zinnen over fit en risico, en een gemotiveerde keuze. Daarna vraagt de bouw-agent `get_component` op voor alleen de gekozen kandidaat. `get_component` hoogstens één keer per plek. Bij twijfel of als niets past: bouwen op de eigen veldcomponenten uit §4.3. Vastleggen in `docs/21st-keuzes.md` onder het kopje "Spec 07": per plek de kandidaten (id, naam, preview-URL), de keuze en de aanpassingen.

**Aanpassingsregels.** Kleuren alleen via tokens, nooit hex of hsl; de props, namen en sectie-id's uit deze spec blijven leidend (`#solliciteren`, `#contactformulier`, `#zo-gaat-het`); alle demotekst vervangen door messages-sleutels (spec 03 §9); server component tenzij er interactie is; `prefers-reduced-motion` respecteren; native `name`-attributen behouden zodat progressive enhancement werkt; geen gecontroleerde invoer die zonder JavaScript leeg blijft.

| Sub-agent | Plek | `search` (type component) | `get_inspiration` | Startkandidaten (id, naam, preview) |
|---|---|---|---|---|
| A, formulierlayout | `ErrorSummary` en de kolomindeling van de vier formulieren | "job application form with file upload"; "contact form minimal"; "form error summary alert"; "form with contact sidebar two columns" | "accessible mobile-first job application form layout, white background, blue accent, error summary at the top" | 2420 Form (ephraimduncan), https://cdn.21st.dev/user_2vZexZytBe3Vo4fbfmzWgvCugbB/form/default/preview.1748455892661.png |
| C, bestandsupload | voortgang en fouttoestand rond `FileInput` in `CvUpload` (het veld zelf is van spec 02) | "file upload with progress bar"; "upload error retry file type size"; "single file upload with remove button" | "single CV upload on mobile with progress, file name, remove button and clear errors for wrong type and size" | 27137 File Upload (uvain), https://cdn.21st.dev/user_3AAcYdXInfTxs5akkUBbQIUQdhX/file-upload/default/preview.1789406886621.png; 25108 File Upload Field (cnippet-dev), https://cdn.21st.dev/cnippet.dev/v-field-21/default/preview.1787168233005-fd95129e-a535-483d-af85-34f7a42aba91.png; 19201 File Dropzone (joyco), https://cdn.21st.dev/joyco/file-dropzone/default/preview.1783712252441.png |
| E, succesmelding | kopblok van de bedankpagina's | "success confirmation thank you message"; "thank you page after form submission" | "calm thank you page after a job application with reference number, next steps and call or WhatsApp buttons" | 26911 Centered Contact Form (ln-dev7, alleen de bevestigingstoestand), https://cdn.21st.dev/user_2rmPdOT0hL8MtSnYm8IpqqrYTVg/contact-16/default/preview.1789036558657.webp |
| F, contactkaarten | `ContactPersonCard`, `ContactAside`, gegevensblok op `/contact` | "team contact card with phone"; "contact card details icons form"; "team member cards avatar name"; "contact section with form and details" | "two personal contact cards with first name, phone and WhatsApp buttons next to a contact form, white and minimal" | 5689 Contact Card (efferd), https://cdn.21st.dev/sshahaider/contact-card/default/preview.1755584847121.png; 28619 Team Member Cards (olewandowski1), https://cdn.21st.dev/7ovr/team-1/default/preview.1789992680141-6fcb7a8f-2722-4bed-82a5-708a6ffdfb96.png; 27904 Centered Contact Form (ln-dev7), https://cdn.21st.dev/ln-dev7/contact-01/default/preview.1789819769701-36011358-a4c4-4a59-9010-76215de9d861.png |

Specifiek per plek: A scout alleen de kolomindeling van de vier formulieren en `ErrorSummary`, en kiest geen kandidaat die zijn eigen validatiebibliotheek meeneemt (react-hook-form valt af; de validatie is zod plus `useActionState`). Er is geen sub-agent voor keuzevelden: de veldcomponenten van §4.3 bouwen op de primitives van spec 02. Er gaat geen `get_component` naar een primitive van spec 02 (`Field`, `RadioCard`, `CheckboxField`, `FileInput`). C kijkt alleen naar de voortgang en de fouttoestand rond `FileInput`, zonder `get_component`; het veld zelf en de uploadlogica blijven die van spec 02 en §4.8 (XHR naar de signed URL). E scout alleen het kopblok van de bedankpagina's en mag geen confetti of feestelijke animatie hebben. `FormAlert` is `Alert` van spec 02 en wordt niet gescout; voor E geldt geen `get_component`. Er is geen sub-agent voor `ServiceSteps`; die vorm is van spec 05. Sub-agent F blijft de enige die de personenkaart (`ContactPersonCard`) scout. F toont geen foto's zolang die er niet zijn (B-25) en geen socialmediaknoppen.

## 10 Bouwopdracht

> **Notitie.** Bouwstap 6 voor deze spec is gecommit (99e1a03, gemerged in f20eea8). De wijzigingen uit kruiscontrole ronde 2 en 3 voert een nazorg-sub-agent in bouwstap 3b uit (00 §6).

Dit is bouwstap 6 van 00 §6, samen met spec 11. Voorwaarden: spec 10 (tabellen, `lib/supabase/*`, `lib/data/*`, `cv-storage.ts`) en spec 13 (`isBotRequest`, `instrumentation-client.ts`, `next.config.mjs`) zijn klaar; spec 01 heeft de skeletpagina's, `lib/site.ts` en `lib/routes.ts` gezet; spec 09 heeft `lib/legal.ts`.

1. **Lezen.** 00 §3 en §4, deze spec, spec 10 §4.2 tot en met §4.5 en §5.3, spec 09 §4.8 en §6.2, spec 13 §4.4 en §5.6, spec 01 §4.9, §4.11 en §4.16, spec 03 §6.10 tot en met §6.17, en `node_modules/next/dist/docs/01-app/02-guides/forms.md` en `server-actions.md`.
2. **Messages.** Zet `forms`, `contact` en `bedankt` uit §6.1 en §6.2 in `messages/nl/forms.json`, `messages/nl/contact.json` en `messages/nl/bedankt.json` en hun Engelse tegenhangers `messages/en/forms.json`, `messages/en/contact.json` en `messages/en/bedankt.json` (B-45). Bestaan die bestanden nog niet, maak ze dan en voeg per taal de imports toe aan `messages/<locale>/index.ts` (00 §4.4 punt 1). Vervang een eventueel `forms.privacy`-blok van spec 09 niet; de tekst is gelijk. Vul `ZONES` in `scripts/check-copy.mjs` aan (§6). Draai `npm run check -- --warn` en `npm run check:copy`.
3. **Validatie.** Maak `lib/validation/shared.ts`, `phone.ts`, `application.ts`, `registration.ts`, `staff-request.ts`, `contact.ts` en `cv-upload.ts` (§5.1 tot en met §5.4). Gebruik zod 4: `z.email()`, `z.uuid()`, `z.iso.date()`, `{ error: "<code>" }`, `z.flattenError` of eigen `toFieldErrors`.
4. **Uploadroute.** Maak `app/api/upload/cv/route.ts` (§5.6). Test met `curl -X POST localhost:3000/api/upload/cv -H 'origin: http://localhost:3000' -H 'content-type: application/json' -d '{"ext":"pdf","size":1000}'`: 200 met `signedUrl`; met `"ext":"exe"` 400.
5. **Acties.** Maak `app/actions/_shared.ts`, `apply.ts`, `register.ts`, `staff-request.ts` en `contact.ts` (§5.5, §5.7). Bestaat `lib/email/forms.ts` van spec 11 nog niet, maak dan tijdelijk een stub met dezelfde exports die alleen `console.info` doet, met `// TODO spec 11` erboven; spec 11 vervangt hem in dezelfde bouwstap.
6. **Velden en hook.** Maak `components/forms/fields/*` en `use-form-behaviour.ts` (§4.3) op de primitives van spec 02, met de keuzes van sub-agents A en C. Leg de keuzes van alle sub-agents vast in `docs/21st-keuzes.md` onder "Spec 07" (§9).
7. **Formulieren.** Maak `ApplyForm`, `RegisterForm`, `StaffRequestForm`, `ContactForm`, `ContactAside`, `TrackedContactLink`, `FormErrorBoundary` en `ApplySection` (§4.4 tot en met §4.11).
8. **Pagina's.** Vervang de skeletten van `/inschrijven`, `/werkgevers/personeel-aanvragen`, `/contact` en `/bedankt/[soort]` (§4.6, §4.7, §4.9, §4.10), met `generateMetadata` volgens §7. Laat routeconfiguratie, `generateStaticParams`, `dynamicParams` en `setRequestLocale` van spec 01 staan. Werk `ContactPersonCard` in `components/contact/contact-person-card.tsx` bij volgens §4.9 als het bestand bestaat; maak het alleen als het ontbreekt. Maak `BedanktReference`.
9. **Vacaturepagina.** Geef spec 06 door dat `<ApplySection vacancy={vacancy} locale={locale} />` onder de vacaturetekst komt, alleen bij `state === "open"`. `ApplySection` staat op de vacaturepagina alleen bij `state === "open"`; bouwstap 3b controleert dat (B-52).
10. **Lokaal testen.** `npm run dev`. Verstuur elk formulier met `delivered+handmatig@resend.dev`. Controleer met de Supabase MCP (`execute_sql`) het record, de referentie en `email_log`. Herhaal met `BOTID_DEV_BYPASS=BAD-BOT` in `.env.local` (formulier geweigerd met `blocked`), daarna weer leeg. Test zonder JavaScript in de browser (DevTools, JavaScript uit): contact, aanvraag en sollicitatie zonder cv.
11. **Upload testen.** Een pdf van 3 MB komt onder `applications/<id>/`; een `.png` en een bestand van 11 MB worden in de browser geweigerd; een `.exe` hernoemd tot `.pdf` levert `cvType` op (spec 10 `type_mismatch`). Controleer in Storage dat het pending-bestand weg is na het versturen.
12. **Tests (spec 14 §4.4).** `tests/unit/validation/{sollicitatie,inschrijving,personeelsaanvraag,contact}.test.ts`, plus `tests/unit/validation/phone.test.ts` (`normalizePhone("06 12345678")` geeft `+31612345678`; `"0031 6 1234 5678"` geeft `+31612345678`; `"+48 512 345 678"` geeft `+48512345678`; `"12345"` geeft `null`) en een typetest die controleert dat elke foutcode uit de schema's in `messages/nl/forms.json` bestaat (`registerConsentRequired` als `forms.privacy.registerConsent.error`). E2e: `tests/e2e/formulieren/{solliciteren,inschrijven,personeel-aanvragen,contact,zonder-js}.spec.ts` met `wachtInvultijd()` (gebruikt `MIN_FILL_MS`) en locators via `t("forms.apply.submit")` en dergelijke.
13. **Visueel.** Playwright op 390, 768, 1280 en 1440 px voor `/inschrijven`, `/werkgevers/personeel-aanvragen`, `/contact`, een vacature met formulier, elk formulier met fouten en de vier bedankpagina's. Scroll eerst door (spec 14 `scrollDoor`).
14. **Verifiëren.** `npm run verify`, `npm run check -- --warn`, `npm run check:copy`, `npm run test`, `npx playwright test tests/e2e/formulieren --project=chromium`, `npx playwright test tests/e2e/a11y --grep @a11y`, `node scripts/check-bundles.mjs` voor de formulierpagina's.

## 11 Acceptatiecriteria

| Id | Criterium | Eis | Dient |
|---|---|---|---|
| AC-07-01 | Op `http://localhost:3000/vacatures/glazenwasser-den-haag-1001` levert een sollicitatie met alleen de verplichte velden (zonder cv) een doorverwijzing naar `/bedankt/sollicitatie?ref=S-<jaar>-<nnnn>` en een rij in `applications` met `kind = 'vacancy'`, `vacancy_number = 1001`, `vacancy_title_snapshot = 'Glazenwasser'`, `occupation_slugs = '{glazenwasser}'`, `source = 'website'`, `status = 'new'` en `privacy_notice_version` gelijk aan `PRIVACY_NOTICE_VERSION`. | E-07-01, E-07-03, E-07-04 | R-04 |
| AC-07-02 | Dezelfde sollicitatie met een geldige pdf van 3 MB geeft `cv_path` onder `applications/<id>/`, `cv_mime = 'application/pdf'` en `cv_size` gelijk aan de bestandsgrootte; `select count(*) from storage.objects where bucket_id = 'cvs' and name like 'pending/%' and created_at > now() - interval '5 minutes'` geeft 0 voor dat bestand. | E-07-06 | R-04, R-11 |
| AC-07-03 | Een `.png` of een pdf van 11 MB wordt in de browser geweigerd met de tekst van `forms.jobseeker.errors.cvType` of `cvTooLarge`, zonder verzoek naar `/api/upload/cv` (netwerkpaneel). Een `.exe` hernoemd tot `.pdf` geeft na versturen `cvType` bij het cv-veld en geen record. | E-07-06 | R-11 |
| AC-07-04 | `POST /api/upload/cv` met `{"ext":"pdf","size":1000}` geeft lokaal 200 met `path` onder `pending/` en een `signedUrl`; met `BOTID_DEV_BYPASS=BAD-BOT` 403 `{"error":"blocked"}`; zonder geldige `origin` 403; met `{"ext":"exe","size":1}` 400. | E-07-06, E-07-07 | R-04, R-11 |
| AC-07-05 | Op `/inschrijven` geeft versturen zonder toestemmingsvinkje de tekst "Vink dit vakje aan om je in te schrijven." bij het vinkje en geen record, ook met JavaScript uit; met vinkje en twee beroepen een rij met `kind = 'registration'`, `retention_consent = true`, `retention_consent_source = 'form'`, `occupation_slugs` met beide id's en een doorverwijzing naar `/bedankt/inschrijving?ref=S-...`. | E-07-01, E-07-09 | R-04, R-11 |
| AC-07-06 | Op `/werkgevers/personeel-aanvragen` levert een aanvraag met drie schoonmakers en één glazenwasser, per direct, `duration = weeks`, een rij in `staff_requests` met `occupation_slugs = '{schoonmaker,glazenwasser}'`, `headcount` zoals ingevuld, `start_asap = true`, `start_date` leeg en een referentie `P-<jaar>-<nnnn>`; de browser staat op `/bedankt/aanvraag?ref=P-...`. | E-07-01, E-07-04 | R-04 |
| AC-07-07 | `/werkgevers/personeel-aanvragen?beroep=verhuizer` toont met JavaScript het vinkje Verhuizers aangevinkt; `/inschrijven?beroep=schoonmaker` het vinkje Schoonmaker. | E-07-01 | R-01 |
| AC-07-08 | Op `/contact` met onderwerp "Bel mij terug", alleen naam en telefoonnummer: rij in `contact_messages` met `topic = 'callback'`, `email` en `message` leeg, doorverwijzing naar `/bedankt/contact`. Zonder telefoon en zonder e-mail: `forms.contactForm.errors.reachRequired` bij beide velden en geen record. Met alleen naam, e-mail, onderwerp "Iets anders" en een bericht: een record. | E-07-01, E-07-02 | R-04 |
| AC-07-09 | Per geslaagde inzending met een e-mailadres staan er na hoogstens 30 seconden twee rijen in `email_log` met `entity_id` gelijk aan het record (bevestiging en interne melding, templatenamen van spec 11); bij een contactbericht zonder e-mailadres één rij. Geen enkele mail heeft een bijlage. | E-07-05 | R-04 |
| AC-07-10 | Met het honeypotveld `website` ingevuld (via DevTools) of met `fillMs` onder 3000 geeft elk formulier `FormAlert` met de tekst van `blocked` en komt er geen record. Een contactbericht met drie links komt binnen met `status = 'spam'` en zonder rij in `email_log`. | E-07-07 | R-04 |
| AC-07-11 | Twee POST-verzoeken met dezelfde `submissionId` (Playwright, tweemaal versturen via `page.evaluate`) leveren één record; beide eindigen op dezelfde bedankpagina met dezelfde `ref`. | E-07-08 | R-04 |
| AC-07-12 | Met JavaScript uit in Playwright (`javaScriptEnabled: false`) slagen contact, aanvraag en sollicitatie zonder cv; een leeg verzonden sollicitatie toont serverfouten bij voornaam, achternaam, telefoon, e-mail, woonplaats en werkrecht, met de eerder ingevulde waarden nog in de velden en `autofocus` op het eerste ongeldige veld. Het cv-blok toont `forms.jobseeker.cv.noJs` en geen bestandsveld. | E-07-03, E-07-14 | R-14, R-15 |
| AC-07-13 | Een sollicitatie op een vacature die tussen laden en versturen gesloten is (`update vacancies set status = 'closed', close_reason = 'filled' where number = 1002` en daarna `curl -X POST -H "Authorization: Bearer $CRON_SECRET" -H 'content-type: application/json' -d '{"numbers":[1002],"kind":"visibility"}' http://localhost:3000/api/dev/revalidate`) geeft `forms.jobseeker.errors.vacancyClosed` en geen record; daarna `npm run db:seed:reset`. | E-07-03 | R-10 |
| AC-07-14 | Elk ongeldig veld heeft `aria-invalid="true"` en een `aria-describedby` dat de id van zijn fouttekst bevat; na een mislukte poging heeft het eerste ongeldige veld de focus (`document.activeElement`); `ErrorSummary` heeft `role="alert"`. | E-07-14 | R-15 |
| AC-07-15 | `a11y/axe.spec.ts` geeft nul bevindingen op `/inschrijven`, `/werkgevers/personeel-aanvragen`, `/contact`, een vacature met formulier, de vier bedankpagina's en elk formulier in de toestand met fouten, op 390 en 1280 px. | E-07-14 | R-15 |
| AC-07-16 | Alle velden zijn met alleen het toetsenbord in te vullen en te versturen; de invoertypes en `autocomplete`-waarden zijn exact die van §8 (Playwright leest `type`, `autocomplete` en `inputmode` van elk veld). | E-07-14 | R-14, R-15 |
| AC-07-17 | Het schema van de sollicitatie heeft geen sleutel `bsn`, `birthDate`, `dateOfBirth`, `nationality`, `photo` of `gender`; een POST met zulke velden levert een record zonder die gegevens (tabel heeft geen kolommen) en zonder fout. | E-07-09 | R-11 |
| AC-07-18 | Op een vacaturepagina staat direct boven de verzendknop de tekst van `forms.privacy.applyNotice` met een link naar `/privacyverklaring#solliciteren`; het talentpoolvinkje is standaard niet aangevinkt; aangevinkt geeft het `retention_consent = true`. Op `/werkgevers/personeel-aanvragen` en `/contact` staat de u-variant zonder vinkje. | E-07-09 | R-11 |
| AC-07-19 | Naast elk formulier staan bellen en WhatsApp: op vacature 1001 heeft de WhatsApp-link een `href` die begint met `https://wa.me/31683351985?text=` (contactpersoon uit de seed) en waarvan de gedecodeerde tekst "Glazenwasser" en "1001" bevat; op `/inschrijven` de tekst van `common.whatsapp.werkzoekende`, op `/werkgevers/personeel-aanvragen` die van `common.whatsapp.werkgever`; op `/en/...` de Engelse tekst. | E-07-10 | R-01, R-14 |
| AC-07-20 | `/bedankt/sollicitatie`, `/bedankt/inschrijving`, `/bedankt/aanvraag` en `/bedankt/contact` geven 200 met `<meta name="robots" content="noindex, follow">`, één h1 en geen kruimelpad, en staan niet in `/sitemap.xml`. `/bedankt/sollicitatie?ref=S-2026-0001` toont "Je referentienummer is S-2026-0001."; `?ref=<script>` toont geen referentie. `/bedankt/onbekend` geeft 404. | E-07-11 | R-09, R-04 |
| AC-07-21 | Na een sollicitatie op `/en/vacatures/<slug>` staat de browser op `/en/bedankt/sollicitatie`, het record heeft `locale = 'en'` en de foutmeldingen op `/en` komen uit `messages/en/forms.json`. | E-07-11, E-07-12 | R-13 |
| AC-07-22 | Een sollicitatie geopend via `?utm_source=google_jobs_apply` levert `utm = {"source":"google_jobs_apply"}`; zonder UTM-parameters is `utm` leeg. | E-07-04 | R-10 |
| AC-07-23 | In het netwerkpaneel bevatten de analytics-verzoeken alleen de events uit §5.9 met de eigenschappen `form`, `beroep` en `vacature`; geen naam, e-mail, telefoon, woonplaats, bestandsnaam of referentie (controle op de eerste preview, lokaal via de consolelog van `track`). | E-07-13 | R-11 |
| AC-07-24 | Met alle vlaggen in `lib/claims.ts` op `false` en `contact.openingHours` leeg staat op `/contact`, `/werkgevers/personeel-aanvragen` en de bedankpagina's geen kantoortijd, geen "spoed buiten kantoortijden" en geen reactietermijn; met `contact.openingHours = { days: "ma-vr", opens: "07:00", closes: "18:00" }` verschijnt "Maandag tot en met vrijdag van 07.00 tot 18.00 uur" op `/contact`. | E-07-15 | R-12 |
| AC-07-25 | `/contact` toont één teamblok met het hoofdnummer als `tel:`-link, één WhatsApp-knop en het e-mailadres, zonder persoonsnamen en zonder het nummer 06 52 54 95 39 (B-60), het adres met "Langskomen kan alleen op afspraak.", het e-mailadres als `mailto:`-link en het formulier onder `#contactformulier`; geen kaart of iframe van een derde partij. | E-07-10, E-07-11 | R-01, R-11 |
| AC-07-26 | `npm run check -- --warn` meldt geen sleutelverschil voor `forms`, `contact` en `bedankt`; `npm run check:copy` geeft geen fouten in deze namespaces (geen uitroepteken, geen streepje tussen zinsdelen, geen "we", geen je in een u-zone). | E-07-12 | R-07, R-13 |
| AC-07-27 | De JavaScript-omvang van `/inschrijven`, `/werkgevers/personeel-aanvragen`, `/contact` en een vacaturepagina blijft onder 235 kB gzip volgens `scripts/check-bundles.mjs`. | E-07-01 | R-15 |
| AC-07-28 | `grep -rn "SUPABASE_SECRET_KEY\|createSupabaseAdminClient" components` geeft niets; `app/actions/_shared.ts` begint met `import "server-only"`; geen FormData van een Server Action is groter dan 1 MB, omdat het bestandsveld geen `name` heeft. | E-07-03, E-07-06 | R-11 |
| AC-07-29 | Een mislukte e-mailverzending (bijvoorbeeld een ongeldige `RESEND_API_KEY` lokaal) laat het record bestaan en de bezoeker gewoon op de bedankpagina uitkomen; `email_log` toont `failed`. | E-07-05 | R-04 |
| AC-07-30 | Op de preview, met de regel `formulieren-per-ip` actief voor preview (spec 13 §5.6, AC-13-30), krijgt de 21e formulierverzending binnen 10 minuten vanaf één IP-adres een 429, en toont het formulier de fallback van `FormErrorBoundary` met `forms.common.networkError` en een belknop. | E-07-07 | R-04 |
| AC-07-31 | Met `allow_whatsapp_apply = false` op 1001 heeft `section#solliciteren` geen link naar `wa.me`. | E-07-10 | R-01, R-14 |
| AC-07-32 | `docs/21st-keuzes.md` heeft een sectie "Spec 07" met per plek uit §9 twee tot vier kandidaten (id, naam, preview-URL), de keuze en de aanpassingen; per plek hoogstens één `get_component`. | E-07-16 | R-16 |

## 12 Open vragen en aannames

| Onderwerp | Aanname in deze spec | Bevestigt | Gevolg als het anders is |
|---|---|---|---|
| Formulieren zonder JavaScript op productie | Vastgelegd in B-36: BotID weigert op Vercel een formulier dat zonder JavaScript wordt verstuurd; die bezoeker ziet de weigermelding met bellen en WhatsApp. Lokaal en in de e2e-tests werkt progressive enhancement volledig. | Djulan (B-36) | Zoals B-36: `guardSubmission` slaat BotID over als `fillMs` ontbreekt, met meer spamrisico. |
| Upload via XHR | Terugvaloptie voor §4.8: lukt een rauwe `PUT` met `XMLHttpRequest` naar de `signedUrl` niet tegen Storage, dan `uploadToSignedUrl(path, token, new File([file], name, { type: contentType }), { contentType })` (spec 10 §4.5) met een voortgang zonder percentage. | Djulan | De uploadroute geeft dan ook `token` terug. |
| Eén pagina voor de aanvraag | Geen twee stappen (context/13 §5.6); twee fieldsets op één pagina. | Djulan | Twee stappen: één extra client-toestand, dezelfde actie en hetzelfde schema. |
| Beroepen bij inschrijven | Niet verplicht, om de drempel laag te houden. | Jimmy en Lorenzo | Verplicht: `.min(1)` en een foutcode `occupationsRequired` in `forms.jobseeker.errors`. |
| Rijbewijs bij inschrijven | Altijd zichtbaar en niet verplicht, zoals B-17 vastlegt. | Jimmy en Lorenzo, jurist (B-17) | Weglaten: één veld uit schema en formulier. |
| Werkrecht "nee" | Solliciteren blijft mogelijk; de hint nodigt uit om toch te solliciteren (context/09 §8). | jurist | Andere tekst in `noHint`. |
| Reactietermijn | Nergens zonder vlag; de bedankpagina's tonen `common.notes.response*` alleen bij `responseTime`. | Jimmy en Lorenzo | Vlag op `true` in `lib/claims.ts`. |
| Referentie op de bedankpagina | Komt als `?ref=` mee en wordt client-side getoond, omdat de bedankpagina statisch is (spec 01). Zonder JavaScript geen referentie op de pagina, wel in de mail. | Djulan | Dynamische pagina met `searchParams`: `BedanktReference` wordt server-side. |
| E-mailfuncties | Namen en argumenten van §5.8; spec 11 bevestigt of kiest andere. | spec 11 | Alleen de aanroepen in `app/actions/*`. |
| Custom events | Vercel Analytics custom events werken alleen op Vercel Pro in Jimmy's team. | Jimmy | Zonder Pro alleen paginaweergaven; de bedankpagina's tellen dan als conversie. |
| Nieuwe bestanden buiten 00 §4.4a | Deze spec claimt `components/contact/*` en `app/actions/_shared.ts`. Spec 04 mag `ContactPersonCard` hergebruiken op `/over-ons`. | master-agent | Bij een andere eigenaar alleen een verplaatsing. |
| Spam in sollicitaties en aanvragen | Vanaf drie links in vrije tekst wordt een sollicitatie of aanvraag geweigerd met `blocked`, omdat die tabellen geen status `spam` hebben; een contactbericht komt binnen als `spam` zonder mail. | Jimmy en Lorenzo | Grens is één constante `LINK_LIMIT`. |
| Minimale invultijd | 3 seconden, gemeten in de browser (`fillMs`). | Djulan | Alleen `MIN_FILL_MS`. |
| Contactpersoon bij solliciteren | `ApplySection` en `ContactAside` tonen altijd het team met het hoofdnummer uit `contact` in `lib/site.ts` (B-60); `resolveVacancyContact` is vervallen en de contactbeheerder van een vacature blijft alleen in `/beheer` zichtbaar. | Djulan | Geen. |
