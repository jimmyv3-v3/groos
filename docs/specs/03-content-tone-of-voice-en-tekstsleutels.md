# 03 Contentstrategie, tone of voice en tekstsleutels

| Status | Fase | Hangt af van | Bronnen |
|---|---|---|---|
| concept | 1 | 01 | `context/research/jversseput-schrijfstijl-analyse.md` (hoofdbron), `context/08` §4 tot en met §6, `context/13` §7 en §8, `context/00`, `context/01`, `context/02`, `context/03`, `context/09` (via `bijlagen/samenvattingen/context-09.md`), `context/10` §6, `docs/HANDOVER-2.md`, `CLAUDE.md`, spec 00 §3.2 en §4 |

## 1 Doel

Deze spec legt vast hoe alle tekst op de site van Groos Personeelsdiensten klinkt,
hoe hij wordt geschreven en gecontroleerd, en waar hij in de code staat. Hij levert
vier dingen: (1) de tone of voice voor werkzoekenden en opdrachtgevers met een
aanspreekvorm per route, (2) toetsbare schrijfregels, een woordenlijst, sjablonen,
een claimbeleid en lengtes die voor alle tekst gelden, ook in `content/`, in de
database en in e-mails, (3) de messages-architectuur met de volledige Nederlandse en
Engelse sleutelboom van de namespaces `common`, `meta`, `header`, `footer`,
`notFound` en `error`, en (4) de werkwijze en het controlescript waarmee de
bouw-agents vanavond de copy schrijven. Het doel is dat elke pagina in de methode
van J. Versseput klinkt, met eigen inhoud, zonder claims die Groos niet kan
waarmaken, en dat een agent of script dat kan nagaan.

## 2 Gebruikers en scenario's

**Werkzoekende**

- S-03-01: Een Haagse werkzoekende met Nederlands als tweede taal opent op zijn
  telefoon `/werken-als/schoonmaker`. Hij begrijpt in B1-taal wat het werk is, wat
  hij verdient en hoe hij solliciteert, en elk vakwoord wordt in dezelfde zin
  uitgelegd.
- S-03-02: Een werkzoekende tikt bij een vacature op "App ons". WhatsApp opent met
  een vooringevuld bericht waarin de titel en het nummer van de vacature staan.
- S-03-03: Een Engelstalige werkzoekende op `/en` leest alle interfacetekst in het
  Engels, met dezelfde opbouw en dezelfde knoppen als de Nederlandse site.
- S-03-04: Een bezoeker volgt een oude link naar een vacature die niet meer bestaat.
  Hij krijgt een 404-pagina die in twee zinnen uitlegt wat er aan de hand is en vier
  duidelijke vervolgstappen biedt.

**Opdrachtgever**

- S-03-05: Een planner van een schoonmaakbedrijf leest `/werkgevers/schoonmakers` in
  een rustige u-vorm. Hij ziet concrete feiten en geen beloftes over termijnen,
  keurmerken of bereikbaarheid die nog niet bevestigd zijn.
- S-03-06: Een opdrachtgever controleert in de footer de bedrijfsgegevens (naam met
  B.V., adres met de zin over bezoek op afspraak, KvK en btw) voordat hij personeel
  aanvraagt.

**Beheerder**

- S-03-07: Jimmy schrijft in `/beheer` een vacature en volgt de korte schrijfhints:
  een intro van twee zinnen, taken als korte regels en een bruto uurloon.
- S-03-08: Jimmy en Lorenzo krijgen via Djulan de lijst open claims uit
  `lib/claims.ts`. Na bevestiging zet de bouw-agent één vlag op `true` en verschijnt
  de bijbehorende tekst op alle plekken tegelijk.

**Bouwteam**

- S-03-09: Een bouw-agent schrijft met de contentbrief uit §10.3 de copy voor één
  beroep, draait `npm run check:copy` en levert Nederlands en Engels aan in dezelfde
  sleutels.
- S-03-10: Djulan leest de Nederlandse copy per pagina en keurt goed of geeft één
  ronde correcties, zonder dat hij zelf op toon, notatie of verboden woorden hoeft te
  letten.

## 3 Scope

### 3.1 Wel in deze spec

- Tone of voice, aanspreekvorm per route, B1-regels, schrijfregels, notatie,
  woordenlijst, beroepsnamen, verboden woorden, sjablonen, claimbeleid en lengtes.
  Deze gelden voor alle tekst: messages, `content/`, juridische pagina's,
  `app/beheer/_strings.ts`, e-mails en vacatureteksten in de database.
- De messages-architectuur: namespaces, naamgeving, rich text, ICU, arrays,
  spiegeling en de Engelse versie.
- De sleutels en de copy (NL en EN) van `common`, `meta`, `header`, `footer`,
  `notFound` en `error`.
- Nieuwe bestanden: `lib/claims.ts`, `lib/format.ts`,
  `scripts/check-copy.mjs` met fixtures, en het npm-script `check:copy`.
- De werkwijze voor het schrijven van de copy in bouwstap 4 tot en met 8.

### 3.2 Niet in deze spec (andere eigenaar volgens 00 §4.4a)

- De copy van `home`, `about` (spec 04), `werkzoekenden`, `werkgevers`, `beroepen`
  en `content/beroepen`, `content/pages` (spec 05), `vacatures` (spec 06), `forms`,
  `contact`, `bedankt` (spec 07), `legal` en de juridische teksten (spec 09),
  e-mails (spec 11) en beheerteksten (spec 08). Die specs schrijven de tekst volgens
  deze spec.
- Structuur en uiterlijk van header, footer, 404 en foutpagina (spec 01 en 02).
- De wettelijke vermeldingen in de footer (`FooterLegal`, `WttaStatus`, sleutels
  `legal.footer.*`, `legal.wtta.*`, `legal.nav.*`), de Wtta-fase in `lib/legal.ts`,
  de juridische claims-checklist (CL-01 tot en met CL-22), de regels voor
  vacatureteksten (VR-01 tot en met VR-15) en `npm run check:claims` (spec 09).
- De poortcontrole `npm run check` met de regels K1 tot en met K15 (spec 14).
- `lib/site.ts` (spec 01), `lib/seo.ts` en de JSON-LD (spec 12),
  `scripts/check-launch.mjs` (spec 14).

### 3.3 Fase 2

Extra talen (Pools, Bulgaars, Turks, Roemeens), Engelse vacatureteksten, jobalert-
en regiocopy (spec 15). De regels uit deze spec gelden dan ook; de woordenlijst krijgt
dan per taal een kolom.

### 3.4 Eisen

| Id | Eis | Dient |
|---|---|---|
| E-03-01 | Elke tekst volgt de aanspreekvorm per route uit §6.2: je voor werkzoekenden, u voor opdrachtgevers, wij voor Groos. | R-01, R-07 |
| E-03-02 | Tekst voor werkzoekenden is B1 volgens §6.4. | R-07, R-14 |
| E-03-03 | De schrijfregels zijn als checklist vastgelegd (§6.5) en voor zover mogelijk door `npm run check:copy` te controleren (§6.19). | R-07, R-19 |
| E-03-04 | Cijfers, bedragen, tijden en datums volgen één notatie (§6.6), via `lib/format.ts` waar de waarde uit data komt. | R-07, R-02 |
| E-03-05 | Er is één woordenlijst met vaste termen en beroepsnamen in NL en EN (§6.7, §6.8). | R-07, R-13, R-19 |
| E-03-06 | Verboden woorden en vage claims komen niet op de site (§6.9). | R-07, R-12 |
| E-03-07 | Copy wordt geschreven met de sjablonen uit §6.10, in eigen woorden, zonder tekst van J. Versseput of Wilk. | R-07, R-08 |
| E-03-08 | Claims volgen het claimbeleid (§6.11); onbevestigde claims staan achter een vlag in `lib/claims.ts` en zijn met TODO gemarkeerd. | R-12 |
| E-03-09 | Elke pagina en elk element blijft binnen de lengtes van §6.12. | R-07, R-15 |
| E-03-10 | Messages volgen de architectuur van §6.13; nl en en zijn gespiegeld. | R-13, R-19 |
| E-03-11 | `common`, `meta`, `header`, `footer`, `notFound` en `error` bevatten exact de sleutelboom van §6.14 en §6.15. | R-07, R-09, R-13 |
| E-03-12 | De JV-sleutels uit §6.16 zijn verwijderd. | R-08 |
| E-03-13 | WhatsApp-links openen met een vooringevulde tekst per context, ook per vacature met titel en nummer (§6.17). | R-01, R-14 |
| E-03-14 | De Engelse versie is van menselijke kwaliteit, met dezelfde sleutels (§6.18). | R-13 |
| E-03-15 | Toegankelijkheidsteksten (aria, alt, schermlezertekst) staan in messages en zijn beschrijvend (§8). | R-15 |
| E-03-16 | Vacatureteksten in de database volgen de veldregels van §5.3. | R-02, R-03, R-10 |
| E-03-17 | Titel- en beschrijvingssjablonen per paginatype volgen §7. | R-09 |
| E-03-18 | De copy wordt in de bouw geschreven met contentbrieven, gecontroleerd en gelezen volgens §10.2. | R-07, R-17 |
| E-03-19 | Deze module heeft geen UI en zet dus geen 21st.dev-sub-agents in (§9). | R-16 |

## 4 Pagina's en componenten

### 4.1 Geen eigen pagina's

Deze module levert geen route en geen component. Haar uitvoer zit in messages, drie
nieuwe bestanden en de regels die andere specs toepassen.

### 4.2 Nieuwe bestanden

| Bestand | Inhoud | Server of client | Sectie |
|---|---|---|---|
| `lib/claims.ts` | Vlaggen voor claims die op bevestiging wachten, plus twee helpers | beide (geen imports) | §5.1 |
| `lib/format.ts` | Notatiehelpers voor bedragen, tijden, datums en getallen | beide (alleen `import type`) | §5.2 |
| `scripts/check-copy.mjs` | Controlescript voor de schrijfregels, zonder dependencies | Node 24 | §6.19 |
| `scripts/fixtures/check-copy/fout.json` en `goed.json` | Testinvoer voor het script | n.v.t. | §6.19 |
| `package.json` | Script `"check:copy": "node scripts/check-copy.mjs"` | n.v.t. | §10.1 |

### 4.3 Afnemers van de sleutels uit deze spec

| Afnemer (eigenaar) | Sleutels |
|---|---|
| `components/sections/site-header.tsx`, het mobiele menu (`components/sections/header/mobile-menu.tsx`) en de actiebalk (`components/sections/header/action-bar.tsx`) (01, 02) | `header.*`, `common.cta.{viewJobs, requestStaff, register, contact, apply, call, whatsapp}`, `common.whatsapp.{algemeen, werkzoekende, werkgever}`, `common.opensInNewTab`, `beroepen.<id>.{enkelvoud, meervoud}` (spec 05) |
| `components/sections/site-footer.tsx` (01, 02) | `footer.*`, `header.nav.*` (linklabels), `common.address.byAppointment`, `common.contact.*` (kantoortijden via `common.contact.officeHoursValue`, §6.14), `common.a11y.*`; de wettelijke vermeldingen en de juridische links komen uit `FooterLegal` (spec 09) met `legal.nav.*` en `legal.footer.*`; de Wtta-regel staat binnen `FooterLegal` als `WttaStatus` (spec 09, `legal.wtta.*`). De footer heeft geen eigen sleutels voor KvK, btw of juridische links |
| `components/ui/language-toggle.tsx` (02) | `common.languageSwitcher.*` |
| `app/[locale]/not-found.tsx` (01) | `notFound.*` |
| `app/[locale]/error.tsx` (01, client) | `error.*` |
| `components/sections/breadcrumbs.tsx` (01) | `common.breadcrumbs.*`, labels uit `header.nav.*` |
| `app/[locale]/layout.tsx` (01) | `meta.{titleDefault, titleTemplate, description, organizationDescription}`, `header.skipLink` |
| `app/opengraph-image.tsx`, `app/llms.txt/route.ts` (12) | `meta.{ogHeadline, ogSubline, description, organizationDescription}` |
| Elke CTA in specs 04 tot en met 07 via `CtaButton` (02) | `common.cta.*`, `common.notes.*` |
| Elke WhatsApp-link (04, 05, 06, 07) | `common.whatsapp.*` met de helper `whatsappLink(text?, phone?)` uit `lib/site.ts` (spec 01) |
| Contactpersonen (04, 06, 07) | `common.people.<id>.role`, `common.cta.{callPerson, whatsappPerson}`, `common.a11y.*` met `people` uit `lib/site.ts` |
| Vacaturekenmerken en kaarten (06) | `common.format.*` met `lib/format.ts` |

## 5 Data

### 5.1 `lib/claims.ts`

Eén schakelaar per claim die pas op de site mag na bevestiging door Jimmy en Lorenzo
(R-12, B-22, B-24, B-26). Messages kunnen geen commentaar bevatten; daarom staat de
TODO hier, en blijft de tekst zelf schoon. De bevestiging zelf (datum, wie, bron)
legt Djulan vast in `docs/compliance/claims-status.md` volgens de claims-checklist
van spec 09; elke vlag noemt de CL-id uit die checklist. Wtta-status, toelating en
registernummer hebben hier geen vlag: die lopen alleen via `WTTA` in `lib/legal.ts`
en de component `WttaStatus` (spec 09, CL-04).

```ts
/**
 * Schakelaars voor claims die pas zichtbaar worden na bevestiging (spec 03 §6.11).
 * Bevestiging vastleggen in docs/compliance/claims-status.md (spec 09 §6.9).
 * Daarna: vlag op true, datum en bron in het commentaar, "TODO" weg, en zo nodig
 * de uitzondering in scripts/check-launch.uitzonderingen.json (spec 14).
 * Een afgewezen claim blijft false, krijgt "afgewezen <datum>" en de copy gaat weg.
 */
const flags = {
  afterHoursUrgent: false, // TODO bevestigen (CL-06, B-22): buiten kantoortijden bereikbaar voor spoed, en via welk nummer
  responseTime: false, // TODO bevestigen (CL-05): reactie binnen één werkdag op sollicitaties en aanvragen; noemt nooit een levertermijn (B-49)
  deliverySpeed: false, // TODO bevestigen (CL-09, B-49): hoe snel Groos iemand kan laten beginnen, met termijn
  personalIntake: false, // TODO bevestigen (werkwijze): elke kandidaat wordt vóór plaatsing persoonlijk gesproken
  weeklyPay: false, // TODO bevestigen (CL-10): uitbetaling per week
  replacement: false, // TODO bevestigen (werkwijze): vervanging bij uitval, met termijn
  certificateSupport: false, // TODO bevestigen (CL-11): hulp bij VCA, heftruck of IPAF, en wie betaalt
  travelAllowance: false, // TODO bevestigen (VR-07): reiskostenvergoeding als vaste regel
  housing: false, // TODO bevestigen (CL-19): regelt Groos huisvesting (ja met keurmerk, of nee)
  transport: false, // TODO bevestigen (CL-19): vervoer naar het werk
  languagesSpoken: false, // TODO bevestigen (CL-20): andere talen dan Nederlands en Engels die Jimmy en Lorenzo spreken
  serviceForms: false, // TODO bevestigen (CL-18): ook detacheren, werving en selectie of payrolling
  noStartNoCost: false, // TODO bevestigen (werkwijze): opdrachtgever betaalt niets als niemand start
  cao: false, // TODO bevestigen (CL-02, CL-03, B-24): toegepaste cao en lidmaatschap ABU of NBBU
  keurmerk: false, // TODO bevestigen (CL-01, B-24): SNA-keurmerk, NEN 4400-1 of VCU, met registerlink
  gAccount: false, // TODO bevestigen (CL-22): g-rekening
  insurance: false, // TODO bevestigen (CL-22): aansprakelijkheidsverzekering
  invoicing: false, // TODO bevestigen (werkwijze): urenregistratie en factuurritme
  foundingStory: false, // TODO bevestigen (CL-07): oprichtingsjaar en eigen werkervaring van Jimmy en Lorenzo
  workArea: false, // TODO bevestigen (CL-14): plaatsnamen buiten Den Haag en omgeving
  testimonials: false, // TODO bevestigen (CL-08, B-26): alleen echte citaten met naam en toestemming
  clientLogos: false, // TODO bevestigen (CL-08, B-26): alleen logo's met toestemming
};

export type ClaimKey = keyof typeof flags;

/** Bewust als boolean getypeerd (geen `as const`), zodat vergelijkingen de typecheck doorstaan. */
export const claims: Readonly<Record<ClaimKey, boolean>> = flags;

export function isClaimConfirmed(key: ClaimKey): boolean {
  return claims[key];
}

/** Filtert items (FAQ, kaarten, bullets) die een onbevestigde claim dragen. */
export function withConfirmedClaims<T extends { claim?: ClaimKey }>(
  items: readonly T[],
): T[] {
  return items.filter((item) => item.claim === undefined || claims[item.claim]);
}
```

Gebruik: messages-waarden met een claim worden alleen gerenderd als de vlag `true` is
(`{isClaimConfirmed("afterHoursUrgent") && <p>{t("common.contact.afterHours")}</p>}`).
Kantoortijden hebben geen vlag: die verschijnen pas als `contact.openingHours` in
`lib/site.ts` (spec 01) gevuld is, en dat veld draagt daar de TODO (B-22).
Items in arrays (in messages of in `content/`) mogen een veld `claim` hebben met een
`ClaimKey`; renderers filteren met `withConfirmedClaims`. Een array uit messages komt
binnen via `t.raw("pad") as Array<{ q: string; a: string; claim?: ClaimKey }>` (of
het type van die lijst). `npm run check` telt via K6 (spec 14) de
TODO-regels in dit bestand, zodat de livegang pas groen is als elke claim bevestigd
of afgewezen is. Spec 12 neemt `openingHoursSpecification` in de JSON-LD alleen op
als `contact.openingHours` gevuld is.

### 5.2 `lib/format.ts`

Alle getallen, bedragen, tijden en datums die uit data komen, gaan door deze helpers.
In messages staan alleen de woorden eromheen (`common.format.*`); de helpers geven een
string die als ICU-parameter wordt doorgegeven. Geen ICU-datum- of getalskeletten in
messages, omdat next-intl `en` als Amerikaans formatteert en deze site Brits Engels
gebruikt.

```ts
import type { Locale } from "@/i18n/routing";

const TAG: Record<Locale, string> = { nl: "nl-NL", en: "en-GB" };

/** nl: "€ 16,08" (vaste spatie), "€ 50.000"; en: "€16.08", "€50,000". */
export function formatEuro(amount: number, locale: Locale): string;
/** "07:00" of "07:00:00" wordt nl "07.00", en "07:00". */
export function formatTime(value: string, locale: Locale): string;
/** nl "2 oktober 2026", en "2 October 2026"; met weekday: "vrijdag 2 oktober 2026". */
export function formatDate(value: Date | string, locale: Locale, opts?: { weekday?: boolean }): string;
/** nl "1.250", en "1,250". */
export function formatNumber(value: number, locale: Locale): string;
```

Regels: bedragen onder 1.000 altijd met twee decimalen, gehele bedragen vanaf 1.000
zonder decimalen. `formatDate` gebruikt `Intl.DateTimeFormat` met
`{ day: "numeric", month: "long", year: "numeric" }` en tijdzone `Europe/Amsterdam`.
Het bestand importeert alleen types, zodat het ook met `node` (type stripping in
Node 24) te testen is (AC-03-18). Spec 06 en 11 gebruiken deze helpers en bouwen geen
eigen formatters.

### 5.3 Tekst in de database

Vacatureteksten schrijft Jimmy of Lorenzo in `/beheer`. De velden staan in spec 10
(`vacancy_translations`: `title`, `summary`, `intro`, `tasks`, `requirements`,
`offer`, `extra`, `seo_title`, `seo_description`; `vacancies.salary_note`). De
juridische regels voor vacatureteksten (VR-01 tot en met VR-15) staan in spec 09
§6.8 en gaan voor; deze tabel voegt toon en lengte toe. De hints onder de velden
schrijft en toont spec 08, in je-vorm en volgens de regels van deze tabel; de tekst
staat alleen in `app/beheer/_strings.ts`.

| Veld (inhoud) | Regel | Lengte | Hint voor `/beheer` |
|---|---|---|---|
| Titel | Functienaam zoals werkzoekenden zoeken (woordenlijst §6.8); geen plaats, loon, "(m/v)" of hoofdletters behalve het eerste woord; hoogstens één toevoeging zoals "vroege dienst" | 1 tot 6 woorden, hoogstens 60 tekens | tekst in `app/beheer/_strings.ts` (spec 08) |
| Intro | Twee zinnen in je-vorm: wat het werk is, en voor wie het past (AS-02) | 25 tot 50 woorden | tekst in `app/beheer/_strings.ts` (spec 08) |
| Taken | Minimaal drie (B-06); elke regel begint met een werkwoord of zelfstandig naamwoord, zonder punt | 3 tot 7 regels van 4 tot 12 woorden | tekst in `app/beheer/_strings.ts` (spec 08) |
| Eisen | Alleen objectieve eisen die nodig zijn voor het werk; taal concreet ("Je spreekt Nederlands of Engels"). Een minimumleeftijd van 18 jaar alleen bij werk op hoogte, bouw en sloop, een heftruck of reachtruck, nachtwerk of gevaarlijke stoffen (B-32). | 1 tot 6 regels | tekst in `app/beheer/_strings.ts` (spec 08) |
| Aanbod | Feiten: bruto uurloon, uren, soort contract; reiskosten en weekloon alleen als het voor deze vacature klopt | 1 tot 6 regels | tekst in `app/beheer/_strings.ts` (spec 08) |
| Samenvatting | Eén zin in je-vorm voor de vacaturekaart | hoogstens 20 woorden | tekst in `app/beheer/_strings.ts` (spec 08) |
| Extra | Optioneel; alinea's van twee zinnen | hoogstens 80 woorden | tekst in `app/beheer/_strings.ts` (spec 08) |
| Toelichting loon | Eén zin, bijvoorbeeld over toeslagen of vakantiegeld | hoogstens 20 woorden | tekst in `app/beheer/_strings.ts` (spec 08) |
| SEO-titel en -beschrijving | Alleen invullen als de standaard uit §7 niet past; zelfde regels | 45 en 160 tekens (eigen deel; de site zet de merknaam erachter). De databasegrens van 60 tekens (spec 10) blijft. | tekst in `app/beheer/_strings.ts` (spec 08) |

Verboden in vacatureteksten: alles uit §6.9, plus "fysiek sterk" zonder concrete eis
(schrijf "Je kunt de hele dag staan en tillen tot 25 kilo"), "jong team",
nationaliteit, geslacht en "native speaker". De beroepsnamen in de tabel
`occupations` (spec 10) zijn exact de namen uit §6.8.

## 6 Tekstelementen

### 6.1 Tone of voice voor twee doelgroepen

Groos spreekt als een klein Haags bureau met twee vaste gezichten. De stem is rustig,
volwassen en concreet: korte, volledige zinnen, eerst een bewering en dan het bewijs.
Er wordt nooit geroepen. Nadruk komt uit feiten (een bedrag, een tijd, een naam) en
niet uit bijvoeglijke naamwoorden. Dat is de methode van J. Versseput
(schrijfstijlanalyse §1 tot en met §7); de inhoud is eigen.

| | Werkzoekenden | Opdrachtgevers |
|---|---|---|
| Aanspreekvorm | je (en "wij" voor Groos) | u (en "wij" voor Groos) |
| Taalniveau | B1 (§6.4) | helder zakelijk Nederlands |
| Zinslengte | gemiddeld hoogstens 15, maximaal 22 woorden | gemiddeld 12 tot 18, maximaal 30 woorden |
| Wat de lezer wil weten | Kan ik snel beginnen, wat verdien ik, wie belt me terug | Krijg ik snel betrouwbare mensen, wat kost het, ben ik juridisch veilig |
| Toon | Positief, geruststellend, gelijkwaardig | Zakelijk, voorspelbaar, zonder hype |
| Urgentie | Nooit; geen druk en geen angst | Spaarzaam: hoogstens één risico- of urgentieblok per pagina (AS-05, AS-06) |
| Bewijs | Uurloon, werktijden, wat je meeneemt, wie je belt | Termijnen, werkwijze, contactpersoon, wettelijke regels |
| Vermijden | Vakjargon zonder uitleg, moeilijke woorden, beloftes over loon of uren die niet in de vacature staan | Superlatieven, keurmerken of termijnen zonder bevestiging, "wij ontzorgen" |

### 6.2 Aanspreekvorm per route (B-04)

| Route | Vorm | Toelichting |
|---|---|---|
| `/` | wij en u; je binnen het werkzoekendenblok | Een blok wisselt alleen van vorm als het zichtbaar over die doelgroep gaat (eigen kop) |
| `/vacatures`, `/vacatures/[slug]` | je | Ook de lege staat, filters en de melding bij een gesloten vacature |
| `/inschrijven` | je | |
| `/werkzoekenden` | je | |
| `/werken-als/[beroep]` | je | |
| `/werkgevers` | u | |
| `/werkgevers/[beroep]` | u | |
| `/werkgevers/personeel-aanvragen` | u | |
| `/werkgevers/wtta` | u | |
| `/over-ons` | wij en u; je binnen een werkzoekendenblok | |
| `/contact` | wij en u; formulierlabels zonder voornaamwoord waar dat kan | Het keuzeblok "Ik zoek werk" gebruikt je |
| `/privacyverklaring` | wij en u; je in het deel voor sollicitanten | Eigenaar spec 09 |
| `/cookieverklaring`, `/klachtenregeling` | wij en u, bij voorkeur zonder voornaamwoord | Eigenaar spec 09 |
| `/algemene-voorwaarden` | u | Tekst van de klant (B-11) |
| `/bedankt/sollicitatie`, `/bedankt/inschrijving` | je | Eigenaar spec 07 |
| `/bedankt/aanvraag`, `/bedankt/contact` | u | Eigenaar spec 07 |
| 404 en foutpagina | zonder voornaamwoord; "ons" mag | §6.14 |
| Header en footer | zonder voornaamwoord; footerbeschrijving in wij-zinnen | |
| Metabeschrijving | volgt de doelgroep van de pagina; home zonder voornaamwoord | §7 |
| E-mails | kandidaat je; opdrachtgever en contact u; interne melding je | Eigenaar spec 11 |
| `/beheer/*` | je | Alleen Nederlands (B-19) |
| WhatsApp-voorinvultekst | ik (stem van de bezoeker) | §6.17 |
| FAQ-vraag | ik, mijn, jullie (stem van de bezoeker) | Het antwoord volgt de vorm van de pagina |

Regel: één vorm per tekstwaarde en per sectie. Nooit je en u in één string.

### 6.3 Wij, niet we

Groos noemt zichzelf altijd "wij", ook in je-copy. "We" komt in geen enkele
sitetekst voor. "Ons" en "onze" zijn gewoon toegestaan.

Motivering: HANDOVER-2 legt "wij" vast als harde regel. Op gedeelde pagina's wisselen
u-blokken en je-blokken elkaar af, en één vaste vorm voor de afzender houdt de stem
herkenbaar. "Wij" is even kort en voor een B1-lezer even bekend als "we". Eén vaste
vorm is bovendien met een script te controleren (C-07). "Wij" klinkt alleen stijf in
een stijve zin; schrijf daarom korte, actieve zinnen zoals "Wij bellen je terug."
Uitzondering: letterlijke citaten van echte mensen (B-26). In het Engels is het "we".

### 6.4 B1 voor werkzoekenden

Deze regels gelden in elke je-zone (§6.19).

1. Zinnen gemiddeld hoogstens 15 woorden en nooit meer dan 22.
2. Eén boodschap per zin en hoogstens één bijzin.
3. Actief schrijven met het onderwerp vooraan: "Wij bellen je", niet "Je wordt
   gebeld".
4. Een werkwoord in plaats van een zelfstandig naamwoord: "solliciteren", niet "het
   indienen van een sollicitatie".
5. Elk vakwoord bij het eerste gebruik uitleggen in dezelfde of de volgende zin:
   VCA ("een diploma voor veilig werken"), cao, BSN, loonstrook, uitzendovereenkomst,
   gelijk loon, fase A.
6. Concreet: bedrag, tijd, plaats, aantal uren.
7. Geen beeldspraak of spreekwoorden, behalve heel gangbare uitdrukkingen zoals "aan
   de slag".
8. Geen afkortingen behalve de lijst in §6.7; die worden bij het eerste gebruik
   uitgelegd.
9. Geen dubbele ontkenning; een ontkenning staat vroeg in de zin.
10. Positief en geruststellend; nooit druk of angst.
11. Lijsten vanaf drie onderdelen als opsomming.
12. "Je", niet "jij", behalve voor nadruk; "jouw" alleen voor nadruk.
13. Moeilijke woorden vervangen (C-13, waarschuwing):

| Niet | Wel |
|---|---|
| beschikbaarheid | wanneer je kunt werken |
| inzetbaar zijn | kunnen werken |
| werkzaamheden | werk, taken |
| dienstverband, arbeidsovereenkomst | contract |
| kwalificaties, competenties | diploma's en certificaten, wat je kunt |
| indien | als |
| conform | volgens |
| reeds | al |
| aanvangen | beginnen |
| verstrekken, ter beschikking stellen | geven |
| woonachtig | wonen |
| dient te | moet |
| wensen | willen |
| trachten | proberen |
| inzake, omtrent, ten aanzien van | over |
| accuraat | precies |
| representatief | netjes |

### 6.5 Schrijfregels als checklist

Elke regel heeft een controle: een script (S, met regel-id uit §6.19), de reviewer
(R) of beide.

| Nr | Regel | Controle |
|---|---|---|
| 1 | Geen uitroeptekens, ook niet in het Engels. | S C-01 |
| 2 | Geen gedachtestreepjes of koppeltekens om zinsdelen te verbinden. Een bereik schrijf je met "tot" (07.00 tot 18.00 uur). Koppeltekens in samenstellingen mogen (e-mail, VCA-diploma, WhatsApp-bericht). | S C-02 |
| 3 | Zinnen gemiddeld 12 tot 18 woorden, maximaal 30; in je-zones gemiddeld hoogstens 15, maximaal 22. | S C-03, C-04 |
| 4 | Alinea's van twee zinnen: eerst een bewering, dan een concreet detail of een geruststelling. Drie zinnen mag; vier niet. | S C-05, R |
| 5 | Geen fragmenten in lopende tekst: elke zin heeft een onderwerp en een persoonsvorm. Geen losse "Ja." of "Zeker.", geen "Snel. Eerlijk. Lokaal.", geen vraag-antwoordtruc als "Het resultaat? Tevreden klanten." Uitgezonderd zijn labels, badges, opsommingspunten, tabelwaarden, knoppen en koppen. | S C-06, R |
| 6 | Koppen (h1, h2, h3) zijn één goedlopende zin of zinsdeel dat zonder opmaak klopt, in zinshoofdletters, zonder punt aan het eind en zonder dubbele punt. Een vraagkop eindigt op een vraagteken. | S C-15 |
| 7 | Een h2 bestaat uit twee delen, `title` en `accent`, die samen één zin vormen; het accent is het slot (1 tot 5 woorden). Geen eyebrow, kicker of label boven een kop. Een stapnummer mag als los cijfer naast een stap staan, nooit als tekstlabel zoals "Stap 1" boven de kop. | S C-15, R |
| 8 | Knoppen hebben 1 tot 3 woorden met een werkwoord (gebiedende wijs of infinitief): "Bekijk vacatures", "Personeel aanvragen". De belofte staat als microcopy naast de knop, nooit op de knop. Tekstlinks hebben 2 tot 6 woorden en zeggen waar ze heen gaan; nooit "klik hier" of een losse "lees meer". | S C-14, C-11 |
| 9 | FAQ-vraag in de stem van de bezoeker ("Kan ik ook zonder cv solliciteren?"), 4 tot 12 woorden, eindigt op een vraagteken. Het antwoord begint met het antwoord ("Ja, …", "Nee, …", of direct het feit) en volgt dan met een concreet feit en eventueel een aanbod. | S C-16, C-06, R |
| 10 | Wij voor Groos, nooit "we" en nooit "men". | S C-07, C-08 |
| 11 | Eén aanspreekvorm per string en de juiste vorm per route (§6.2). | S C-09, C-10 |
| 12 | Elke belofte is concreet (termijn, bedrag, procedure of naam) en staat in het claimbeleid (§6.11). | R, `lib/claims.ts` |
| 13 | Elke vaste formule hoogstens één keer per pagina: "zodat", "van … tot …", "juist", "In plaats van", "één vast aanspreekpunt", "denken met u mee", een staartbijzin (ZS-08). | R |
| 14 | Opsommingen in lopende tekst hebben drie of vier leden met komma's en "en"; vanaf vijf leden een lijst. Geen drieslag van losse bijvoeglijke naamwoorden. | R |
| 15 | Geen "&" in lopende tekst, geen emoji, geen hoofdletterwoorden. | S C-08, C-20 |
| 16 | Urgentie en risico alleen richting opdrachtgevers, hoogstens één blok per pagina; richting werkzoekenden positief. | R |
| 17 | Vakjargon in dezelfde zin uitleggen. | R |
| 18 | Notatie volgens §6.6. | S C-17 |
| 19 | Geen tekst van Wilk of J. Versseput, ook geen kopnamen of structuurlabels. | S C-21, R |
| 20 | Elke string is vertaalbaar en staat in messages, `content/` of `_strings.ts`; geen tekst in componenten. | R, AC-03-22 |
| 21 | Dubbele punt in lopende tekst hoogstens één keer per pagina. | R |
| 22 | Geen negatieve parallellen als kop ("Geen gedoe, wel resultaat"). De constructie "Niet pas …, maar nu al …" hoogstens één keer, alleen richting opdrachtgevers. | R |

### 6.6 Notatie van cijfers, bedragen, tijden en datums

| Onderwerp | Nederlands | Engels | Niet |
|---|---|---|---|
| Bedrag | € 16,08 (euroteken, vaste spatie, komma, twee decimalen) | €16.08 | €16,08, 16,08 euro, € 16,- |
| Groot bedrag | € 50.000 | €50,000 | € 50.000,- |
| Uurloon | € 16,08 bruto per uur | €16.08 gross per hour | p/u, per uur zonder "bruto" |
| Bandbreedte | € 16,08 tot € 16,70 bruto per uur | €16.08 to €16.70 gross per hour | een streepje tussen de twee bedragen |
| Uren | 38 uur per week; 24 tot 38 uur per week | 38 hours per week | 24-38 uur |
| Tijd | 07.00 uur | 07:00 | 7u, 07:00 uur, 7.00u |
| Tijdvak | 07.00 tot 18.00 uur | 07:00 to 18:00 | 07.00-18.00 |
| Dagen | maandag tot en met vrijdag | Monday to Friday | ma-vr, ma t/m vr |
| Datum | 2 oktober 2026; vrijdag 2 oktober 2026 | 2 October 2026 | 02-10-2026, 2/10 |
| Telefoon | 06 83 35 19 85 | +31 6 83 35 19 85 | 0683351985 |
| Postcode | 2553 ER Den Haag | 2553 ER The Hague | 2553ER |
| Percentage | lopende tekst: 8 procent; tabel of label: 8% | 8 percent; 8% | 8 % |
| Leeftijd | 18 jaar | 18 years | achttien jaar |
| Bestand | 10 MB | 10 MB | 10mb |
| Vacaturenummer | vacature 1042 | job 1042 | #1042 |

Getallen: cijfers voor alles wat een lezer vergelijkt of uitrekent (uren, euro's,
dagen, weken, kilometers, leeftijd, aantallen mensen). Woorden voor één tot en met
twaalf in andere gevallen ("vijf beroepen", "twee vaste contactpersonen"). "Één"
krijgt accenten als het om het getal gaat. Data-waarden lopen via `lib/format.ts`
(§5.2); tekst met vaste getallen volgt deze tabel.

### 6.7 Woordenlijst

| Begrip | Gebruik | Niet gebruiken |
|---|---|---|
| Bedrijfsnaam | "Groos Personeelsdiensten B.V." in juridische vermeldingen (footer, privacy, voorwaarden); "Groos Personeelsdiensten" bij de eerste vermelding op een pagina, in titels en in de OG-afbeelding; daarna "Groos" | GROOS, Groos BV, Groos PD, "Groos' werkwijze" (schrijf "de werkwijze van Groos") |
| Wat Groos is | uitzendbureau | uitzendorganisatie, recruitmentbureau, personeelsbureau, detacheerder (tenzij claim `serviceForms`) |
| Het bedrijf waar iemand werkt | u-copy: opdrachtgever; je-copy: "het bedrijf waar je werkt", na de eerste keer mag "de opdrachtgever"; juridisch: inlener, met uitleg | klant (dat is de klant van de opdrachtgever), werkgever in lopende tekst |
| Doelgroeplabel opdrachtgevers | "Werkgevers" in navigatie, route en kopjes als "Voor werkgevers" (00 §4.1) | |
| Doelgroeplabel werkzoekenden | werkzoekenden | sollicitanten, talenten |
| De persoon die Groos stuurt | u-copy: medewerker; formeel (FAQ, Wtta, contract): uitzendkracht; collectief: personeel, mensen | flexkracht, flexer, inleenkracht, krachten, personeelsleden, handjes |
| Iemand die Groos voorstelt | kandidaat (alleen u-copy en beheer) | kandidaat in je-copy (schrijf "je") |
| Op een vacature reageren | solliciteren, sollicitatie | reageren, applyen |
| Zonder vacature aanmelden | inschrijven, inschrijving (`/inschrijven`); "open sollicitatie" alleen als synoniem in h1 en meta van `/inschrijven` | registreren, aanmelden |
| Aanbod van werk | vacature (in de interface); werk, baan (lopende je-tekst) | job, functie (als synoniem voor vacature) |
| Soort contract | je-copy: contract, soort contract; u-copy en beheer: dienstverband; juridisch: uitzendovereenkomst, met uitleg | arbeidsrelatie |
| Geld voor de werkzoekende | uurloon (altijd met "bruto"), loon; "salaris" alleen in een FAQ-vraag in de stem van de bezoeker en in meta keywords | verdiensten, beloning (behalve "gelijkwaardige beloning" in u-copy) |
| Geld voor de opdrachtgever | tarief, uurtarief | factor, marge (tenzij bevestigd) |
| Gelijk loon | je-copy: "hetzelfde loon als vaste collega's die hetzelfde werk doen"; u-copy: "gelijkwaardige beloning", met uitleg (B-24) | inlenersbeloning |
| Tijd | werktijden, dienst (vroege dienst, avonddienst), rooster, uren per week, per direct, startdatum | shift |
| Administratie | loonstrook, vakantiegeld, reiskostenvergoeding (claim `travelAllowance`) | salarisstrook, payslip |
| Veiligheid | persoonlijke beschermingsmiddelen, werkschoenen, VCA ("een diploma voor veilig werken") | PBM's (zonder uitleg) |
| Plaats | Den Haag, "Den Haag en omgeving"; plaatsnamen buiten Den Haag alleen bij een vacature daar of na claim `workArea` | 's-Gravenhage (behalve in de KvK-gegevens), Haaglanden (tot `workArea` bevestigd is) |
| Contact | e-mail, e-mailadres, WhatsApp, telefoonnummer, contactpersoon | email, Whatsapp, mobiel nummer |
| Beheer | beheeromgeving, beheer | dashboard (alleen als schermtitel in `/beheer`) |
| Toegestane afkortingen | B.V., KvK, btw, cv, cao, VCA, IPAF, EPT, VOG, BSN, UWV, AVG, ABU, NBBU, SNA, NEN, NAU, Wtta, Waadi, MB, km | o.a., i.v.m., m.b.t., d.m.v., t.b.v., bijv., evt., ca., z.s.m., etc., enz., incl., excl. |
| Spelling | cv, cv's, e-mail, btw, cao, fulltime, parttime, per direct, WhatsApp | CV, E-mail, BTW, CAO, full-time |

Engelse termen: employment agency, client (opdrachtgever), employers (navigatie),
job seekers, temporary worker (uitzendkracht), logistics worker (logistiek
medewerker, zoals in de seed van spec 10), staff, apply, register, job, contract,
hourly wage (always "gross"), rate, shift, payslip, holiday pay, travel allowance,
collective labour agreement (cao, bij eerste gebruik "collective labour agreement
(cao)"), VCA safety certificate, Chamber of Commerce (KvK), VAT, The Hague, email, CV.

### 6.8 Beroepsnamen en synoniemen

De id's en slugs staan in 00 §4.2. Lopende tekst gebruikt de naam in kleine letters;
labels en kaarttitels beginnen met een hoofdletter. De tabel `occupations` (spec 10)
bewaart de namen met een hoofdletter (`name_nl`, `plural_nl`, `name_en`, `plural_en`)
en bevat precies de waarden hieronder; in een zin mag de code ze met
`toLocaleLowerCase()` omzetten, omdat geen van de namen een eigennaam bevat.

| Id | NL enkelvoud | NL meervoud | EN enkelvoud | EN meervoud | Synoniemen (toegestaan waar het werk dat is) | Niet gebruiken |
|---|---|---|---|---|---|---|
| `glazenwasser` | glazenwasser | glazenwassers | window cleaner | window cleaners | glasbewasser (u-copy), allround glazenwasser, gevelreiniger, hoogwerkermedewerker, zonnepanelenreiniger, leerling glazenwasser | glasreiniger, glazenwasster |
| `schoonmaker` | schoonmaker | schoonmakers | cleaner | cleaners | schoonmaakmedewerker, kantoorschoonmaker, opleveringsschoonmaker, bouwschoonmaker, interieurverzorger (u-copy), housekeeping medewerker (hotel) | schoonmaakster, poetsvrouw, werkster |
| `logistiek-medewerker` | logistiek medewerker | logistiek medewerkers | logistics worker | logistics workers | orderpicker, magazijnmedewerker, inpakker, expeditiemedewerker, heftruckchauffeur, reachtruckchauffeur, laad- en losmedewerker; EN: warehouse worker, order picker | logistieke medewerker, magazijnier, warehouse medewerker |
| `verhuizer` | verhuizer | verhuizers | mover | movers | bijrijder, verhuishulp, inboedelverhuizer, projectverhuizer, kantoorverhuizer, liftbediener | sjouwer (alleen als zoekterm in meta keywords) |
| `hulpkracht-bouw-en-sloop` | hulpkracht bouw en sloop | hulpkrachten bouw en sloop | construction and demolition labourer | construction and demolition labourers | bouwplaatsmedewerker, opperman, sloper, sloophulp, bouwvakhelper; in een zin mag "hulpkracht in de bouw en sloop" | asbestsaneerder (alleen met DAV en bevestiging), bouwvakker, "bouw & sloop" |

Sectornamen in een opsomming: glasbewassing, schoonmaak, logistiek, verhuizen, bouw
en sloop (EN: window cleaning, cleaning, logistics, removals, construction and
demolition). De Engelse naam van `hulpkracht-bouw-en-sloop` is definitief
"construction and demolition labourer" en "construction and demolition labourers";
spec 01, 05 en 10 gebruiken dezelfde waarden. Synoniemen staan in de copy alleen waar ze echt over dat werk gaan, en
hoogstens twee keer per pagina; ze dienen de vindbaarheid (zoektermen in context/01).

### 6.9 Verboden woorden en vage claims

Lijst A (fout, C-11): komt nergens op de site.

| Soort | Woorden |
|---|---|
| Superlatieven en onbewezen claims | de beste, beste uitzendbureau, nummer 1, nr. 1, marktleider, toonaangevend, uniek, de enige, 100%, gegarandeerd, garantie, razendsnel, supersnel |
| Bereikbaarheid zonder bevestiging | 24/7, dag en nacht, altijd bereikbaar, binnen 24 uur, binnen een uur |
| Hype en AI-taal | ontzorgen, ontzorging, naadloos, passie, gepassioneerd, gedreven, dynamisch, uitdagend, innovatief, oplossingsgericht, synergie, toegevoegde waarde, hoogwaardig, one-stop-shop, ontdek, duik in, moeiteloos, zorgeloos, cruciaal, essentieel, in het hart van |
| Woorden buiten de woordenlijst | flexkracht, flexer, inleenkracht, personeelslid, handjes, matchen, match, talenten, recruiter, recruitment, staffing, workforce, jobs (in NL-tekst) |
| Discriminatie en vage eisen | (m/v), (m/v/x), man/vrouw, jong team, jonge, Nederlandse nationaliteit, native speaker, moedertaal, schoonmaakster, allochtoon |
| Stijl | men, &, klik hier, middels, teneinde, derhalve, alsmede, thans, doch |
| Relaties | J. Versseput, Versseput, Wilk (B-26, R-08) |

Uitzonderingen op lijst A: de wetsnaam "Wet meer zekerheid flexwerkers" op
`/werkgevers/wtta` en in juridische tekst; "talentpool" alleen in de privacyverklaring
en in beheer, met uitleg.

Lijst B (waarschuwing, C-12): mag alleen met een concreet feit in dezelfde tekstwaarde.
snel, flexibel, betrouwbaar, kwaliteit, professioneel, persoonlijk, op maat, altijd,
nooit (als belofte), de juiste, ervaren, zo snel mogelijk, direct aan het werk, geen
ervaring nodig, student, fysiek sterk, toewijding.

Engelse lijst A (C-11 op `messages/en/*.json`): best, number one, leading, unique, guaranteed,
guarantee, 24/7, around the clock, seamless, passionate, dynamic, innovative, synergy,
hassle-free, discover, dive into, crucial, essential, flex worker, talent, recruiter.

### 6.10 Sjablonen

Vertaald uit de schrijfstijlanalyse §13 naar Groos, met eigen voorbeelden. Alles
tussen accolades vult de schrijver in. Een voorbeeld met een claim draagt de marker
`[TODO claim <sleutel>]`; dat deel mag pas live na bevestiging (§6.11).

**Zinssjablonen**

| Id | Functie | Patroon | Voorbeeld u-vorm | Voorbeeld je-vorm |
|---|---|---|---|---|
| ZS-01 | Positioneringskop (h1 home) | {Wat Groos is} voor <accent>{kern}</accent> {plaats} | Uitzendbureau voor <accent>praktisch werk</accent> in Den Haag | (gedeelde kop, zonder voornaamwoord) |
| ZS-02 | h2 met belofte als slot | {Onderwerp} {werkwoord of die} + accent {belofte} | Uw aanvraag regelt u <accent>met één telefoontje</accent> | Solliciteren kan ook <accent>zonder cv</accent> |
| ZS-03 | Tweeslag of van-tot | {Resultaat}, <accent>{voordeel}</accent>; Van {minimum} tot <accent>{maximum}</accent> | Van één dag tot <accent>een heel seizoen</accent> | Vroeg of laat, <accent>werk dat bij je dag past</accent> |
| ZS-04 | Vraagkop bij formulier of CTA | {Vraag met} <accent>{gewenste toestand}</accent>? | Heeft u <accent>volgende week</accent> extra mensen nodig? | Wil je <accent>volgende week</accent> aan het werk? |
| ZS-05 | Contrast met "In plaats van" | In plaats van {omweg}, {één vaste oplossing}. | In plaats van zelf te werven en na te bellen, legt u uw vraag bij één vast aanspreekpunt. | In plaats van overal los te solliciteren, praat je met één contactpersoon die werk voor je zoekt. |
| ZS-06 | Handeling met gevolg | Wij {handeling met concreet middel}, zodat {resultaat voor de lezer}. | Wij bespreken vooraf de taken en werktijden met u, zodat de medewerker op de eerste dag weet wat het werk is. | Wij spreken vooraf je uren en je reistijd af, zodat je weet waar je aan toe bent. |
| ZS-07 | Bereik met van-tot | {Belofte}, van {kleinste geval} tot {grootste geval}. | Wij leveren mensen voor korte en lange klussen, van één schoonmaker voor een oplevering tot een ploeg verhuizers voor een kantoorverhuizing. | Bij ons vind je allerlei praktisch werk, van ramen wassen tot orderpicken. |
| ZS-08 | Staartbijzin (hoogstens één per pagina) | …, {kwaliteit} van {bron van vertrouwen}. | …, met twee vaste contactpersonen die uw bedrijf kennen. | …, met een contactpersoon die je gewoon kunt bellen. |
| ZS-09 | Kwaliteit die gelijk blijft | {Wat wij doen} zolang {de inzet loopt}, zodat {constante uitkomst}. | Wij houden contact zolang de inzet loopt, zodat de laatste week net zo goed gaat als de eerste. | Wij bellen je ook als je al aan het werk bent, om te horen hoe het gaat. |
| ZS-10 | Vast aanspreekpunt | {U of je} heeft contact met {naam of rol}, die {volledige belofte}. | U heeft contact met Jimmy of Lorenzo, die uw aanvraag van begin tot eind regelt. | Je hebt één vaste contactpersoon, Jimmy of Lorenzo, die je belt als er werk voor je is. |
| ZS-11 | Geruststelling bij een risico | {Risico}, dan {opvang} en {nette afhandeling}. | Valt een medewerker onverwacht uit, dan zoeken wij een vervanger en houden wij u op de hoogte. [TODO claim replacement] | Gaat er iets mis op je werk, bel ons dan, dan zoeken wij samen een oplossing. |
| ZS-12 | Regel of norm plus maatregel | Volgens {wet of bevestigde norm} {concrete maatregel}. | Volgens de wet krijgt elke uitzendkracht hetzelfde loon als uw vaste medewerkers in dezelfde functie. | Volgens de wet krijg je hetzelfde loon als vaste collega's die hetzelfde werk doen. |
| ZS-13 | Probleemherkenning (alleen u) | {Probleem} merkt u pas als {gevolg zichtbaar is}. | Een tekort aan mensen merkt u pas echt als het werk blijft liggen. | Niet gebruiken; schrijf positief (ZS-06). |
| ZS-14 | Nadruk met "juist" | Juist {moment of groep} {wat er op het spel staat}. | Juist rond de maandwisseling heeft een verhuisbedrijf extra handen nodig. | Juist als je nog geen ervaring hebt, helpt een vaste contactpersoon die je kunt bellen. |
| ZS-15 | Metabeschrijving in drie delen | {Vraag of bewering met onderwerp en plaats}. {Concreet feit}. {Oproep}. | Wilt u schoonmakers inhuren in Den Haag en omgeving? Groos levert mensen voor een dag, een paar weken of langer. Vraag vrijblijvend personeel aan. | Wil je werken als schoonmaker in Den Haag? Lees wat het werk inhoudt, wat je verdient en hoe laat je begint. Solliciteren kan zonder cv. |
| ZS-16 | Knop plus belofte als microcopy | Knop {werkwoord} {object}; belofte als losse zin ernaast | Knop "Personeel aanvragen" met "Een aanvraag doen is vrijblijvend." | Knop "Solliciteer direct" met "Je kunt ook zonder cv solliciteren." |
| ZS-17 | Foutmelding | {Wat er mis is}. {Wat de lezer nu kan doen}. | Vul uw telefoonnummer in, dan kunnen wij u terugbellen. | Dit bestand is groter dan 10 MB. Kies een kleiner bestand of stuur je cv via WhatsApp. |
| ZS-18 | Succesmelding | Bedankt voor {uw of je} {actie}. {Vervolgstap}. | Bedankt voor uw aanvraag. Wij nemen contact met u op om de details te bespreken. | Bedankt voor je sollicitatie. Jimmy of Lorenzo belt je om kennis te maken. |

**Alineasjablonen**

| Id | Functie | Patroon | Voorbeeld u-vorm | Voorbeeld je-vorm |
|---|---|---|---|---|
| AS-01 | Hero-intro, twee zinnen | Wij {kernbelofte}. {Eén vast aanspreekpunt voor reikwijdte}. | Wij zoeken mensen voor glasbewassing, schoonmaak, logistiek, verhuizen en bouw en sloop. U regelt uw aanvraag met één vast aanspreekpunt in Den Haag. | Zoek je werk als glazenwasser, schoonmaker of in een magazijn? Wij helpen je aan werk bij een bedrijf in en rond Den Haag. |
| AS-02 | Lead: wens, oplossing, afzender | {U wilt of je wilt} {uitkomst}, zonder {pijnpunt}. Wij {oplossing}. | U wilt glazenwassers die meteen kunnen meedraaien, zonder zelf te werven. Wij zoeken de mensen en stemmen de startdatum met u af. | Je wilt werk waar je snel kunt beginnen, zonder lang te wachten. Wij kijken samen met je welk werk past bij je ervaring, je uren en waar je woont. |
| AS-03 | Intro met contrast | In plaats van {omweg}, {één vaste route}. Wij {kennen situatie} en {belofte}. | In plaats van zelf vacatures te plaatsen en roosters rond te krijgen, legt u uw vraag bij ons neer. Wij kennen het werk en zoeken mensen die bij uw team passen. | In plaats van overal los te solliciteren, schrijf je je één keer in. Wij bellen je zodra er werk is dat bij je past. |
| AS-04 | Eigen aanpak | Elke {situatie} vraagt {iets eigens}. Wij {bespreken}, {kiezen} en {blijven betrokken}. | Elke opdracht vraagt om een eigen aanpak. Wij bespreken het werk, de werktijden en de eisen, en kiezen daarna de mensen met de juiste ervaring. | Elk werk vraagt iets anders van je. Wij vertellen je vooraf wat je gaat doen, hoe laat je begint en wat je meeneemt. |
| AS-05 | Risico-alinea, drie zinnen (alleen u) | {Oorzaak met gevolg}. Hoe langer {…}, hoe {erger}. {Kleine oplossing nu voorkomt groot probleem later}. | Open diensten komen nu bij uw vaste mensen terecht, die daardoor steeds vaker overwerken. Hoe langer dat duurt, hoe groter de kans dat iemand uitvalt. Eén extra medewerker op het juiste moment houdt de planning overeind. | Niet gebruiken. |
| AS-06 | Urgentie-intro (alleen u, spaarzaam) | {Probleem} kost u {iets concreets}. Dat merkt u niet {later}, maar nu, {bij elk moment}. | Een ploeg die te klein is, kost u elke week geld. Dat merkt u niet aan het eind van het jaar, maar nu, bij elke klus die blijft liggen. | Niet gebruiken. |
| AS-07 | Procesintro en stapzin | Van {eerste stap} tot {laatste stap} {houden wij overzicht}, zodat {geruststelling}. Stap: {Wij of u of je} {handeling} {wat vast is}. | Intro: Van uw eerste telefoontje tot de evaluatie na de eerste week houden wij het overzicht, zodat u zich op uw eigen werk kunt richten. Stap: U vertelt ons welke mensen u zoekt, vanaf wanneer en voor hoe lang. | Intro: Van je sollicitatie tot je eerste werkdag weet je steeds wat de volgende stap is. Stap: Wij bellen je om te horen welk werk je zoekt en wanneer je kunt beginnen. |
| AS-08 | FAQ-antwoord | {Direct antwoord met komma}. {Concreet feit}. {Aanbod of voorbehoud}. | Vraag: "Voor hoe lang kan ik iemand inhuren?" Antwoord: "Dat bepaalt u zelf. Sommige opdrachtgevers hebben iemand een dag nodig, anderen een paar maanden. Wij stemmen de inzet af op uw planning." | Vraag: "Kan ik ook zonder cv solliciteren?" Antwoord: "Ja, een cv is niet nodig. Je vult je naam, je telefoonnummer en je woonplaats in, en wij bespreken je ervaring aan de telefoon." |
| AS-09 | Prijs- en start-FAQ | {Tarief of loon} hangt af van {A}, {B}, {C} en {D}. {Oproep}, dan {heldere uitkomst}. | Prijs: "Het tarief hangt af van het beroep, het aantal uren, de werktijden en de duur van de inzet. Na uw aanvraag sturen wij u een voorstel met een helder uurtarief." Start: "Na uw aanvraag nemen wij contact met u op om de details te bespreken. Daarna stellen wij mensen voor die op de gewenste datum kunnen beginnen." | Loon: "Je uurloon staat bij elke vacature. Het is hetzelfde loon als vaste collega's in dezelfde functie verdienen." Start: "Na je sollicitatie bellen wij je om kennis te maken. Past het werk, dan spreken wij samen je eerste werkdag af." |
| AS-10 | Regiopagina (fase 2) | {Plaats} {echt lokaal kenmerk}. Wij {belofte}, van {plek A} tot {plek B}. | Alleen met geverifieerde lokale feiten (spec 15); nu niet gebruiken. | idem |
| AS-11 | CTA-band en formulierintro | h2 vraagkop (ZS-04) plus twee zinnen: actie en vervolgstap | h2 "Heeft u <accent>binnenkort</accent> extra mensen nodig?" Tekst: "Vertel ons wie u zoekt en vanaf wanneer. Wij nemen contact met u op om de aanvraag door te nemen." | h2 "Klaar voor <accent>je volgende baan</accent>?" Tekst: "Solliciteer in een paar minuten, ook zonder cv. Jimmy of Lorenzo belt je om kennis te maken." |
| AS-12 | Herkomst (over ons) | {Wie en wanneer}. {Waarom}. Daarna: {mensen en ambitie}. | Groos is in {jaar} in Den Haag opgericht door Jimmy en Lorenzo. Zij wilden een bureau waar opdrachtgevers en werkzoekenden steeds dezelfde mensen spreken. [TODO claim foundingStory] | Gedeelde pagina; je alleen in een werkzoekendenblok. |

Het accent in een h2 staat aan het slot en komt dan uit twee sleutels (`title`,
`accent`). Alleen een h1 of een vraagkop met het accent in het midden gebruikt de
rich-text-tag `<accent>` (§6.13).

### 6.11 Claimbeleid (R-12, B-22, B-24, B-26)

De juridische claims-checklist van spec 09 (§6.9, CL-01 tot en met CL-22, met
`npm run check:claims` en `docs/compliance/claims-status.md`) is leidend voor wat
wettelijk mag. Deze paragraaf vertaalt die naar de copy: welke zinnen een schrijver
nu mag gebruiken en hoe hij een claim markeert die nog wacht. Bij verschil geldt
spec 09.

| Categorie | Wat | Bron of grond | Hoe |
|---|---|---|---|
| A. Mag nu (feit) | Vijf beroepen; vestiging in Den Haag; Jimmy en Lorenzo als twee vaste contactpersonen met hun 06-nummers; bezoek op afspraak | context/00, B-21, B-23, B-26 | Gewoon schrijven |
| A. Mag nu (wet) | Solliciteren en inschrijven kosten de werkzoekende niets (art. 9 Waadi); hetzelfde loon als vaste collega's (gelijkwaardige beloning, art. 8 Waadi); persoonlijke beschermingsmiddelen zijn gratis voor de werknemer; vakantiegeld; Groos vraagt nooit geld voor werk; werving zonder onderscheid naar afkomst, geslacht of leeftijd | B-24, context/09, context/01 | Gewoon schrijven, zonder cao-naam |
| A. Mag nu (product) | Cv is niet verplicht; solliciteren kan ook via WhatsApp of telefoon; bruto uurloon staat bij elke vacature; een aanvraag is vrijblijvend; de site is in het Nederlands en Engels | B-06, B-17, B-03 | Gewoon schrijven |
| A. Alleen via component | Wtta-status, toelating en registernummer | B-24, spec 09 CL-04 | Nooit in eigen copy; alleen `WttaStatus` (footer en `/werkgevers/wtta`) met de fase uit `lib/legal.ts` |
| B. Werkwijze zonder getal | Wij bellen je om kennis te maken; wij zoeken met je mee; wij bespreken de taken vooraf; wij stellen kandidaten voor; wij sturen een voorstel met een uurtarief | context/13 §8.5, schrijfstijlanalyse §13 | Mag nu; Jimmy en Lorenzo lezen elke werkwijzezin mee in de reviewronde (§10.2) |
| C. Pas na bevestiging | Kantoortijden, spoed buiten kantoortijden, elke reactietermijn, elke levertermijn (`deliverySpeed`), persoonlijke screening als belofte, weekloon, vervanging bij uitval, hulp bij certificaten, reiskosten, huisvesting, vervoer, talen van Jimmy en Lorenzo, andere dienstvormen, "niemand gestart, niets betalen", cao-naam en lidmaatschap, keurmerk, g-rekening, verzekering, facturatie, oprichtingsverhaal, werkgebied met plaatsnamen, citaten, logo's | B-22, B-24, B-26, spec 09 §6.9, context/08 §8, context/13 §12 | Achter een vlag in `lib/claims.ts` (§5.1), kantoortijden via `contact.openingHours` in `lib/site.ts`; bevestiging in `docs/compliance/claims-status.md` |
| D. Nooit | De relatie met J. Versseput; superlatieven (§6.9); cijfers zonder bron; teksten of structuurlabels van Wilk; "24/7" of de briefingzin over openingstijden letterlijk; beloftes over loon boven de vacature; "geen taal nodig" als algemene belofte (alleen per vacature) | B-26, R-08, HANDOVER-2 | Niet schrijven; C-11 vangt een deel |

Markering per plek:

1. **Messages.** De copy staat er schoon in; het component toont hem alleen bij
   `isClaimConfirmed("<sleutel>")`. Een array-item krijgt `"claim": "<sleutel>"` in nl
   en en (zelfde waarde, zodat de pariteitscontrole slaagt).
2. **`content/*.ts`.** Een item (FAQ, kaart, bullet) krijgt `claim: "<sleutel>"` en wordt
   gefilterd met `withConfirmedClaims`. Een losse zin die niet te filteren is, wordt
   niet geschreven; de bedoelde tekst staat als commentaar
   `// TODO claim <sleutel>: "<zin>"` naast de veilige versie.
3. **Voorbeeldcopy in specs en contentbrieven.** Marker `[TODO claim <sleutel>]`.
4. **Database.** Jimmy of Lorenzo schrijft per vacature alleen wat voor die vacature
   klopt; de hints in `/beheer` herinneren daaraan (§5.3).

`npm run check` vindt elke open claim via K6 (spec 14) in de TODO-regels van
`lib/claims.ts` en via K4 in de TODO-commentaren in `content/`; `npm run check:claims` (spec 09) toont daarnaast
elke claimzin in de tekst, ook de geschakelde.

FAQ-onderwerpen en hun claimstatus (strekking uit context/13 §7, in eigen woorden te
schrijven door spec 04 en 05):

| Onderwerp (werkzoekende) | Status | Onderwerp (opdrachtgever) | Status |
|---|---|---|---|
| Kost solliciteren iets | A | Hoe snel kunt u iemand sturen | C `responseTime` (antwoord noemt alleen de reactietermijn; een levertermijn vraagt `deliverySpeed`, B-49) |
| Heb ik een cv nodig | A | Bent u buiten kantoortijden bereikbaar | C `afterHoursUrgent` |
| Moet ik Nederlands spreken | A (per vacature) | Wat kost een uitzendkracht | A (algemeen, zonder factor) |
| Hoe snel hoor ik iets | C `responseTime` | Betaal ik als niemand start | C `noStartNoCost` |
| Wat verdien ik | A | Verschil uitzenden en detacheren | C `serviceForms` |
| Wanneer word ik betaald | C `weeklyPay` | Wat als iemand uitvalt | C `replacement` |
| Wat voor contract krijg ik | A (uitzendovereenkomst); fasen C `cao` | Wie is mijn contactpersoon | A |
| Krijg ik vakantiegeld | A | Hoe kiest u kandidaten | B; screening als belofte C `personalIntake` |
| Wat als ik ziek ben | B (melden bij Groos en het bedrijf); doorbetaling C `cao` | Wie zorgt voor veiligheid | A (Arbowet) |
| Bouw ik pensioen op | C `cao` | Hebben uw mensen VCA | A (per vacature); hulp C `certificateSupport` |
| Heb ik VCA nodig | A (per vacature); hulp C `certificateSupport` | Inlenersaansprakelijkheid en g-rekening | C `gAccount`, `keurmerk` |
| Krijg ik werkkleding en beschermingsmiddelen | A | Welke keurmerken en cao heeft Groos | C `keurmerk`, `cao` |
| Heb ik een rijbewijs nodig, krijg ik reiskosten | A (per vacature); C `travelAllowance` | Kan ik iemand later zelf in dienst nemen | C (algemene voorwaarden, B-11) |
| Welke papieren heb ik nodig | A (ID, BSN en rekeningnummer bij de start, nooit online) | Voor welke periode kan ik inhuren | A |
| Regelen jullie huisvesting | C `housing` | Hoe werkt facturatie | C `invoicing` |
| Krijg ik hetzelfde loon als vaste collega's | A | Spreken uw medewerkers Nederlands | A (per kandidaat) |
| Wat als de opdracht stopt | B | Levert u ook voor één dag | A (B-18 duur); spoedzin zonder termijn A (B-22); een levertermijn C `deliverySpeed` |
| Hoe dien ik een klacht in | A (B-10) | Hoe gaat Groos om met gelijke behandeling | A |

### 6.12 Lengtes per paginatype en per element

Per pagina (zichtbare copy zonder header, footer en formuliervelden):

| Paginatype | Woorden | Opmerking |
|---|---|---|
| Home `/` | 500 tot 800 | Twee FAQ-sets samen hoogstens 10 vragen |
| `/werkzoekenden` | 600 tot 900 | |
| `/werken-als/[beroep]` | 500 tot 800 | Minstens 60% uniek ten opzichte van de andere vier; minstens 3 van de 5 tot 7 FAQ's beroepsspecifiek |
| `/werkgevers` | 700 tot 1.000 | |
| `/werkgevers/[beroep]` | 500 tot 800 | Zelfde uniciteitsregel; eigen CTA-kop en eigen "waarom"-kop per beroep |
| `/werkgevers/wtta` | 500 tot 900 | Kennispagina |
| `/werkgevers/personeel-aanvragen` | 80 tot 200 naast het formulier | |
| `/inschrijven` | 120 tot 250 naast het formulier | |
| `/vacatures` | 40 tot 120 | Intro en lege staat |
| `/vacatures/[slug]` | 200 tot 450 | Uit de database (§5.3) |
| `/over-ons` | 300 tot 500 | |
| `/contact` | 80 tot 200 | |
| Bedankpagina | 40 tot 100 | |
| 404 en foutpagina | 20 tot 45 | |
| Juridisch | geen maximum | Zinnen hoogstens 35 woorden, alinea's hoogstens drie zinnen |
| E-mail | 50 tot 150 | Eén vervolgstap |

Per element:

| Element | Lengte |
|---|---|
| h1 | 3 tot 10 woorden; home hoogstens 12 |
| h2 (`title` plus `accent`) | 3 tot 10 woorden; accent 1 tot 5 woorden |
| h3 (kaart, stap, kenmerk) | 2 tot 6 woorden |
| Hero-intro of lead | 2 zinnen, 25 tot 50 woorden (je: 20 tot 40) |
| Sectie-intro | 1 tot 2 zinnen, 15 tot 35 woorden |
| Kaarttekst | 1 tot 2 zinnen, 12 tot 30 woorden |
| Opsommingspunt | 3 tot 14 woorden, zonder punt |
| Stap | titel 2 tot 5 woorden; tekst 1 zin van 10 tot 22 woorden |
| FAQ-vraag | 4 tot 12 woorden |
| FAQ-antwoord | 2 tot 3 zinnen, 20 tot 60 woorden, hoogstens 70 |
| Knop | 1 tot 3 woorden |
| Tekstlink | 2 tot 6 woorden |
| Microcopy bij een knop | 1 zin, 5 tot 14 woorden |
| Helptekst bij een veld | 1 zin, hoogstens 15 woorden |
| Foutmelding | 1 tot 2 zinnen, hoogstens 20 woorden |
| Badge of label | 1 tot 4 woorden, zonder punt |
| Meta title (eigen deel, zonder " \| Groos Personeelsdiensten") | bij voorkeur 25 tot 45 tekens, hoogstens 52 tekens; korte paginanamen (Contact, Over ons, Personeel aanvragen, Inlenen en de Wtta, Werk vinden via Groos, juridische documenten) mogen korter (B-44) |
| Meta description | 120 tot 160 tekens, 2 zinnen, slot is een oproep |
| OG-kop en OG-subregel | hoogstens 60 en 110 tekens |
| Alt-tekst | 5 tot 15 woorden; beschrijft wat het beeld laat zien, zonder "afbeelding van" |
| WhatsApp-voorinvultekst | hoogstens 160 tekens |

### 6.13 Messages-architectuur

**Namespaces en eigenaars** (00 §4.4 en §4.4a):

| Namespace | Eigenaar | Aanspreekzone |
|---|---|---|
| `common`, `meta`, `header`, `footer`, `notFound`, `error` | 03 | neutraal; sleutels met marker `Jobseeker` of `Employer` volgen die doelgroep |
| `home`, `about` | 04 | neutraal met markers |
| `werkzoekenden` | 05 | je |
| `werkgevers` | 05 | u |
| `beroepen` | 05 | blokken `jobseeker` (je) en `employer` (u) |
| `vacatures` | 06 | je |
| `forms`, `contact`, `bedankt` | 07 | per formulier of pagina via markers (§6.19) |
| `legal` | 09 | neutraal |

`bedankt` is een namespace van spec 07 (00 §4.4 en §4.4a). Vervallen namespaces:
§6.16.

**Naamgeving van sleutels**

1. Sleutels in camelCase, en binnen één object in één taal. Nieuwe objecten van deze
   spec gebruiken Engels (`common.cta.viewJobs`); paden die een componentspec al
   vastlegt, gaan voor, ook als ze Nederlands zijn (`header.nav.overOns`,
   `common.whatsapp.werkzoekende`, `footer.columns.groos` uit spec 01). Namespaces
   blijven zoals in 00 §4.4. Beroep-id's uit 00 §4.2 zijn sleutels zoals ze zijn
   (`beroepen.logistiek-medewerker`).
2. Een sectie is een object met vaste namen: `title`, `accent`, `intro`, `items`,
   `steps`, `faq`. Een kop met accent aan het slot heeft altijd `title` plus `accent`.
3. Lijsten: `items[]` met `{ title, body }`, `steps[]` met `{ title, body }`,
   `faq.items[]` met `{ q, a }`; elk item mag `claim` hebben (§6.11).
4. Paginametadata: `<namespace>.meta.title` en `<namespace>.meta.description`.
5. Toegankelijkheidsteksten: in `common.a11y` of met achtervoegsel `Aria`.
6. Doelgroepmarker: een sleutel in een neutrale namespace met tekst voor één doelgroep
   eindigt op `Jobseeker` of `Employer`, of staat onder een object `jobseeker` of
   `employer` (Nederlandse paden: `werkzoekende` of `werkgever` in de sleutelnaam).
7. Knoppen zijn stringwaarden direct onder een object `cta` dat zelf geen sleutel
   `title` heeft, en sleutels die `submit` of `retry` heten. `submitting` en
   `pending` zijn statusteksten, geen knoppen. Een sleutel die op `Link` eindigt is
   altijd een tekstlink, ook onder `cta`. Een sectieobject `cta` met `title`,
   `accent` en `body` (CTA-band, zoals `home.cta` en `about.cta`) is geen knop.
   Tekstlinks eindigen verder op `Link`, staan onder een object `links` of `nav`, of
   heten `home`.
8. Geen zinnen opbouwen uit losse sleutels; een hele zin is één sleutel met
   parameters.

**Rich text.** Toegestane tags: `<accent>` (accentkleur uit spec 02), `<link>` (een
inline link, bijvoorbeeld naar de privacyverklaring) en `<strong>`. Hoogstens één
`<accent>` per string. Gebruik met `t.rich("pad", { accent: (c) => <span
className="…">{c}</span>, link: (c) => <Link href="…">{c}</Link> })`. Geen andere HTML
in messages.

**ICU.** Parameters in camelCase: `{count}`, `{name}`, `{phone}`, `{email}`,
`{title}`, `{number}`, `{occupation}`, `{occupationPlural}`, `{city}`, `{date}`,
`{amount}`, `{min}`, `{max}`, `{hours}`, `{time}`, `{start}`, `{end}`, `{year}`,
`{subject}`. Meervoud altijd met `=0`, `one` en `other` en met `#`, bijvoorbeeld
`"{count, plural, =0 {Geen vacatures gevonden} one {# vacature gevonden} other {# vacatures gevonden}}"`.
Bedragen, tijden en datums komen als string uit `lib/format.ts`; `count` blijft een
getal. Geen `select` op geslacht.

**Arrays en `lib/site.ts`.** Een array die op index gekoppeld is aan een vaste lijst in
`lib/site.ts` (iconen, stappen) heeft in nl en en dezelfde lengte, en de lijst in
`lib/site.ts` noemt het messagespad in commentaar. Koppeling aan een register gaat via
het id als sleutel, niet via de index (`beroepen.<id>`, niet `beroepen[2]`).

**Spiegeling.** `messages/nl/*.json` en `messages/en/*.json` (één bestand per namespace,
B-45) hebben exact dezelfde sleutels,
soorten en arraylengtes (`npm run check`, K1 van spec 14). Elke Engelse waarde is vertaald;
alleen eigennamen, merknamen en taalnamen mogen gelijk zijn (C-19). Waarden met
`claim` hebben in beide talen dezelfde claimsleutel.

**Lange tekst in `content/`.** Per bestand een `nl`- en een `en`-blok van hetzelfde
type; alleen server-side importeren. Dezelfde schrijfregels, met claims zoals in
§6.11.

**Geen tekst in componenten.** Ook aria-labels, alt-teksten, placeholders,
foutmeldingen in een `catch`, e-mailonderwerpen en de WhatsApp-tekst komen uit
messages, `content/`, `_strings.ts` of `emails/` (lessen uit context/08 §2.7).

### 6.14 Sleutelboom NL

Exacte inhoud van deze namespaces; elk bovenste object is één bestand
`messages/nl/<namespace>.json` (EN: `messages/en/<namespace>.json`) zonder de
namespace als wrapper (B-47). Bestanden: `common.json`, `meta.json`, `header.json`,
`footer.json`, `notFound.json`, `error.json` (B-45).
Claimvelden staan in §6.11; de sleutels waarvan de weergave achter een vlag zit,
staan onder het blok.

```json
{
  "common": {
    "cta": {
      "viewJobs": "Bekijk vacatures",
      "viewJob": "Bekijk vacature",
      "viewAllJobs": "Bekijk alle vacatures",
      "apply": "Solliciteer direct",
      "register": "Schrijf je in",
      "requestStaff": "Personeel aanvragen",
      "call": "Bel ons",
      "callPerson": "Bel {name}",
      "whatsapp": "App ons",
      "whatsappPerson": "App {name}",
      "email": "Mail ons",
      "contact": "Neem contact op",
      "readMoreLink": "Lees meer over {subject}"
    },
    "whatsapp": {
      "algemeen": "Hallo Groos, ik heb een vraag.",
      "werkzoekende": "Hallo Groos, ik zoek werk en wil graag meer weten.",
      "werkzoekendeBeroep": "Hallo Groos, ik zoek werk als {occupation}.",
      "werkgever": "Hallo Groos, ik zoek personeel en wil graag een aanvraag bespreken.",
      "werkgeverBeroep": "Hallo Groos, ik zoek {occupationPlural} en wil graag een aanvraag bespreken.",
      "vacatureSolliciteren": "Hallo Groos, ik wil graag solliciteren op de vacature {title} (nummer {number}).",
      "vacatureVraag": "Hallo Groos, ik heb een vraag over de vacature {title} (nummer {number})."
    },
    "opensInNewTab": "(opent in een nieuw venster)",
    "languageSwitcher": {
      "label": "Taal kiezen",
      "nl": "Nederlands",
      "en": "English"
    },
    "breadcrumbs": {
      "label": "Kruimelpad",
      "home": "Home"
    },
    "address": {
      "byAppointment": "Langskomen kan alleen op afspraak."
    },
    "people": {
      "jimmy": {
        "role": "Contactpersoon"
      },
      "lorenzo": {
        "role": "Contactpersoon"
      }
    },
    "loading": "Bezig met laden",
    "a11y": {
      "callPerson": "Bel {name} op {phone}",
      "emailAddress": "Mail naar {email}"
    },
    "contact": {
      "phone": "Telefoon",
      "whatsapp": "WhatsApp",
      "email": "E-mail",
      "address": "Adres",
      "contactPersons": "Contactpersonen",
      "officeHours": "Kantoortijden",
      "officeHoursValue": "Maandag tot en met vrijdag van {opens} tot {closes} uur",
      "afterHours": "Buiten kantoortijden zijn wij bereikbaar voor spoed."
    },
    "notes": {
      "freeJobseeker": "Solliciteren en inschrijven kost je niets.",
      "cvOptionalJobseeker": "Je kunt ook zonder cv solliciteren.",
      "responseJobseeker": "Je hoort binnen één werkdag van ons.",
      "noObligationEmployer": "Een aanvraag doen is vrijblijvend.",
      "responseEmployer": "U hoort binnen één werkdag van ons.",
      "urgentEmployer": "Heeft u snel mensen nodig? Bel ons dan direct."
    },
    "labels": {
      "faq": "Veelgestelde vragen"
    },
    "format": {
      "wagePerHour": "{amount} bruto per uur",
      "wageRange": "{min} tot {max} bruto per uur",
      "hoursPerWeek": "{hours} uur per week",
      "hoursRange": "{min} tot {max} uur per week",
      "time": "{time} uur",
      "timeRange": "{start} tot {end} uur"
    }
  },
  "meta": {
    "titleDefault": "Uitzendbureau in Den Haag | Groos Personeelsdiensten",
    "titleTemplate": "%s | Groos Personeelsdiensten",
    "description": "Groos is een uitzendbureau in Den Haag voor glasbewassing, schoonmaak, logistiek, verhuizen, bouw en sloop. Bekijk de vacatures of vraag personeel aan.",
    "organizationDescription": "Groos Personeelsdiensten B.V. is een uitzendbureau in Den Haag. Wij leveren glazenwassers, schoonmakers, logistiek medewerkers, verhuizers en hulpkrachten bouw en sloop aan opdrachtgevers.",
    "keywords": [
      "uitzendbureau Den Haag",
      "vacatures Den Haag",
      "glazenwasser vacature Den Haag",
      "schoonmaak vacature Den Haag",
      "orderpicker vacature Den Haag",
      "verhuizer vacature Den Haag",
      "opperman vacature Den Haag",
      "personeel inhuren Den Haag",
      "uitzendkrachten Den Haag"
    ],
    "ogHeadline": "Werk en personeel in Den Haag, met vaste contactpersonen",
    "ogSubline": "Wij helpen werkzoekenden en bedrijven in vijf praktische beroepen."
  },
  "header": {
    "skipLink": "Ga direct naar de inhoud",
    "homeAria": "Groos Personeelsdiensten, naar de homepage",
    "mainMenu": "Hoofdmenu",
    "openMenu": "Menu openen",
    "closeMenu": "Menu sluiten",
    "mobileMenu": "Menu",
    "callAria": "Bel ons op {phone}",
    "actionBar": "Snel contact",
    "nav": {
      "vacatures": "Vacatures",
      "werkzoekenden": "Werkzoekenden",
      "werkgevers": "Werkgevers",
      "overOns": "Over ons",
      "contact": "Contact",
      "inschrijven": "Inschrijven",
      "alleWerkzoekenden": "Alles voor werkzoekenden",
      "personeelAanvragen": "Personeel aanvragen",
      "wtta": "Inlenen en de Wtta",
      "alleWerkgevers": "Alles voor werkgevers"
    },
    "menu": {
      "beroepenWerkzoekenden": "Werken als",
      "beroepenWerkgevers": "Personeel per beroep"
    }
  },
  "footer": {
    "description": "Groos Personeelsdiensten is een uitzendbureau uit Den Haag voor praktisch werk. Wij brengen werkzoekenden en opdrachtgevers in vijf beroepen bij elkaar.",
    "navLabel": "Overzicht van de site",
    "columns": {
      "werkzoekenden": "Werkzoekenden",
      "werkgevers": "Werkgevers",
      "groos": "Groos",
      "contact": "Contact"
    },
    "rights": "© {year} {name}"
  },
  "notFound": {
    "metaTitle": "Pagina niet gevonden",
    "title": "Deze pagina bestaat niet of niet meer",
    "body": "Misschien is de link verouderd of is de vacature al vervuld. Hieronder staan de pagina's die bezoekers het vaakst zoeken.",
    "linksLabel": "Veelgezochte pagina's",
    "links": {
      "vacatures": "Bekijk vacatures",
      "personeel": "Personeel aanvragen",
      "contact": "Neem contact op"
    },
    "home": "Ga naar de homepage"
  },
  "error": {
    "metaTitle": "Er ging iets mis",
    "title": "Er ging iets mis bij het laden van deze pagina",
    "body": "Probeer het over een paar seconden opnieuw. Lukt het dan nog niet, bel ons dan op {phone}.",
    "retry": "Probeer opnieuw",
    "home": "Ga naar de homepage",
    "code": "Foutcode {digest}"
  }
}
```

Weergave achter een voorwaarde: `common.contact.officeHours` en
`common.contact.officeHoursValue` alleen als `contact.openingHours` in `lib/site.ts`
gevuld is (B-22). De footer en `/contact` lezen allebei
`common.contact.officeHoursValue`, met `{opens}` en `{closes}` via `formatTime`; er
is geen aparte footersleutel voor kantoortijden. Verder `common.contact.afterHours`
(vlag `afterHoursUrgent`), `common.notes.responseJobseeker` en `responseEmployer`
(`responseTime`).

De footer krijgt daarnaast de wettelijke vermeldingen van spec 09: `FooterLegal`
(naam met B.V., adres, KvK, btw en de juridische links met `legal.nav.<id>`) en
`WttaStatus`. Die sleutels staan in `legal` en worden hier niet herhaald.

Toelichting bij keuzes:

- `callPerson` en `whatsappPerson` met `{name}` vervangen vaste sleutels als
  `callJimmy`: de voornamen en nummers komen uit `people` in `lib/site.ts`, zodat een
  nieuwe contactpersoon geen nieuwe sleutels vraagt. Op de site staat dan "Bel Jimmy"
  en "Bel Lorenzo".
- `call` en `whatsapp` gaan naar het hoofdnummer (Jimmy, B-21). De rol bij een
  persoon is voorlopig "Contactpersoon"; de echte rol (bijvoorbeeld oprichter) volgt
  als Jimmy en Lorenzo die opgeven (§12).
- De taalnamen staan in hun eigen taal ("Nederlands", "English"), in beide bestanden
  gelijk; dat is de gangbare vorm voor een taalwissel.
- `common.notes.responseJobseeker` ("Je hoort binnen één werkdag van ons.") en
  `common.notes.responseEmployer` ("U hoort binnen één werkdag van ons.") zijn
  bewust anders geformuleerd dan de eerdere zinnen, omdat die vrijwel letterlijk in
  de JV-repo staan (R-08). In het Engels zijn beide "You will hear from us within one
  working day."; dat de twee Engelse waarden gelijk zijn, is toegestaan. Beide blijven
  achter de claim `responseTime`.
- `common.notes.urgentEmployer` belooft geen levertijd ("snel", niet "vandaag of
  morgen"); een levertermijn mag pas na bevestiging (claim `deliverySpeed`, B-22,
  B-49).
- Een laadtekst voor schermlezers gebruikt `common.loading`; er komt geen
  `common.a11y.loading`.
- `footer.rights` heeft geen zin "Alle rechten voorbehouden": dat is een fragment en
  juridisch niet nodig. `{name}` is `contact.name`.
- Juridische paginanamen staan niet in `header` of `footer`; footer en kruimelpaden
  gebruiken `legal.nav.<id>` van spec 09 via `FooterLegal` (besloten in de
  kruiscontrole, §12).
- De paden van `header`, `footer`, `notFound`, `error` en een deel van `common` volgen
  spec 01 §6; deze spec levert de definitieve tekst.
- Het adres en de namen komen uit `contact` in `lib/site.ts`:
  `contact.name` = "Groos Personeelsdiensten B.V.", `contact.shortName` =
  "Groos Personeelsdiensten" (woordenlijst §6.7).

### 6.15 Sleutelboom EN

Exacte inhoud van deze namespaces; elk bovenste object is één bestand
`messages/nl/<namespace>.json` (EN: `messages/en/<namespace>.json`) zonder de
namespace als wrapper (B-47). Bestanden in `messages/en/`: `common.json`,
`meta.json`, `header.json`, `footer.json`, `notFound.json`, `error.json` (B-45).

```json
{
  "common": {
    "cta": {
      "viewJobs": "View jobs",
      "viewJob": "View job",
      "viewAllJobs": "View all jobs",
      "apply": "Apply now",
      "register": "Register",
      "requestStaff": "Request staff",
      "call": "Call us",
      "callPerson": "Call {name}",
      "whatsapp": "WhatsApp us",
      "whatsappPerson": "WhatsApp {name}",
      "email": "Email us",
      "contact": "Contact us",
      "readMoreLink": "Read more about {subject}"
    },
    "whatsapp": {
      "algemeen": "Hello Groos, I have a question.",
      "werkzoekende": "Hello Groos, I am looking for work and would like to know more.",
      "werkzoekendeBeroep": "Hello Groos, I am looking for work as a {occupation}.",
      "werkgever": "Hello Groos, I am looking for staff and would like to discuss a request.",
      "werkgeverBeroep": "Hello Groos, I am looking for {occupationPlural} and would like to discuss a request.",
      "vacatureSolliciteren": "Hello Groos, I would like to apply for the job {title} (number {number}).",
      "vacatureVraag": "Hello Groos, I have a question about the job {title} (number {number})."
    },
    "opensInNewTab": "(opens in a new window)",
    "languageSwitcher": {
      "label": "Choose language",
      "nl": "Nederlands",
      "en": "English"
    },
    "breadcrumbs": {
      "label": "Breadcrumb",
      "home": "Home"
    },
    "address": {
      "byAppointment": "Visits are by appointment only."
    },
    "people": {
      "jimmy": {
        "role": "Contact person"
      },
      "lorenzo": {
        "role": "Contact person"
      }
    },
    "loading": "Loading",
    "a11y": {
      "callPerson": "Call {name} on {phone}",
      "emailAddress": "Email {email}"
    },
    "contact": {
      "phone": "Phone",
      "whatsapp": "WhatsApp",
      "email": "Email",
      "address": "Address",
      "contactPersons": "Contacts",
      "officeHours": "Office hours",
      "officeHoursValue": "Monday to Friday from {opens} to {closes}",
      "afterHours": "Outside office hours we can be reached for urgent requests."
    },
    "notes": {
      "freeJobseeker": "Applying and registering with us is free of charge.",
      "cvOptionalJobseeker": "You can also apply without a CV.",
      "responseJobseeker": "You will hear from us within one working day.",
      "noObligationEmployer": "Submitting a request places you under no obligation.",
      "responseEmployer": "You will hear from us within one working day.",
      "urgentEmployer": "Do you need people at short notice? Then call us directly."
    },
    "labels": {
      "faq": "Frequently asked questions"
    },
    "format": {
      "wagePerHour": "{amount} gross per hour",
      "wageRange": "{min} to {max} gross per hour",
      "hoursPerWeek": "{hours} hours per week",
      "hoursRange": "{min} to {max} hours per week",
      "time": "{time}",
      "timeRange": "{start} to {end}"
    }
  },
  "meta": {
    "titleDefault": "Employment agency in The Hague | Groos Personeelsdiensten",
    "titleTemplate": "%s | Groos Personeelsdiensten",
    "description": "Groos is an employment agency in The Hague for window cleaning, cleaning, logistics, removals, construction and demolition. View our jobs or request staff.",
    "organizationDescription": "Groos Personeelsdiensten B.V. is an employment agency in The Hague. We provide window cleaners, cleaners, logistics workers, movers and construction and demolition labourers to clients.",
    "keywords": [
      "employment agency The Hague",
      "jobs in The Hague",
      "window cleaner jobs The Hague",
      "cleaning jobs The Hague",
      "warehouse jobs The Hague",
      "mover jobs The Hague",
      "construction labourer jobs The Hague",
      "hire staff The Hague",
      "temporary workers The Hague"
    ],
    "ogHeadline": "Work and staff in The Hague, with dedicated contacts",
    "ogSubline": "We help job seekers and businesses in five hands-on occupations."
  },
  "header": {
    "skipLink": "Skip to content",
    "homeAria": "Groos Personeelsdiensten, go to the homepage",
    "mainMenu": "Main menu",
    "openMenu": "Open menu",
    "closeMenu": "Close menu",
    "mobileMenu": "Menu",
    "callAria": "Call us on {phone}",
    "actionBar": "Quick contact",
    "nav": {
      "vacatures": "Jobs",
      "werkzoekenden": "Job seekers",
      "werkgevers": "Employers",
      "overOns": "About us",
      "contact": "Contact",
      "inschrijven": "Register",
      "alleWerkzoekenden": "Everything for job seekers",
      "personeelAanvragen": "Request staff",
      "wtta": "Hiring and the Wtta",
      "alleWerkgevers": "Everything for employers"
    },
    "menu": {
      "beroepenWerkzoekenden": "Work as",
      "beroepenWerkgevers": "Staff by occupation"
    }
  },
  "footer": {
    "description": "Groos Personeelsdiensten is an employment agency in The Hague for hands-on work. We bring job seekers and clients together in five occupations.",
    "navLabel": "Site overview",
    "columns": {
      "werkzoekenden": "Job seekers",
      "werkgevers": "Employers",
      "groos": "Groos",
      "contact": "Contact"
    },
    "rights": "© {year} {name}"
  },
  "notFound": {
    "metaTitle": "Page not found",
    "title": "This page does not exist or no longer exists",
    "body": "The link may be out of date, or the job may already be filled. Below are the pages visitors look for most often.",
    "linksLabel": "Popular pages",
    "links": {
      "vacatures": "View jobs",
      "personeel": "Request staff",
      "contact": "Contact us"
    },
    "home": "Go to the homepage"
  },
  "error": {
    "metaTitle": "Something went wrong",
    "title": "Something went wrong while loading this page",
    "body": "Please try again in a few seconds. If it still does not work, call us on {phone}.",
    "retry": "Try again",
    "home": "Go to the homepage",
    "code": "Error code {digest}"
  }
}
```

### 6.16 Vervallen JV-sleutels en mapping

Deze sleutels uit de startcommit verdwijnen. Kolom "nieuw" geeft de vervanger voor de
componenten die ze nog lezen.

| Oud | Nieuw | Wie past de lezer aan |
|---|---|---|
| `common.cta.requestQuote` | `common.cta.requestStaff` | 01 (header) |
| `common.cta.quote` | `common.cta.whatsapp` | 01 (actiebalk) |
| `common.cta.callUs` | `common.cta.call` | 01 |
| `common.cta.callDirect` | vervalt; vervangen door `common.cta.call` (B-54) | 04, 05 |
| `common.nav.*` (hele object) | `header.nav.*` en `common.breadcrumbs.home` | 01 (`nav` in `lib/site.ts`) |
| `meta.*` | zelfde sleutels met nieuwe tekst; `keywords` gaat van 3 naar 9; nieuw `organizationDescription` | 01, 12 |
| `header.callAria` | zelfde sleutel, nieuwe tekst | |
| `header.quickContact` | `header.actionBar` | 01 |
| `header.whatsappAria` | vervalt; WhatsApp-links krijgen `common.opensInNewTab` | 01 |
| `footer.responsePromise` | vervalt; `common.notes.responseEmployer` achter vlag `responseTime` | 01 |
| `footer.columns.services`, `footer.columns.workArea`, `footer.allAreas` | `footer.columns.{werkzoekenden, werkgevers, groos}` | 01 |
| `footer.privacy`, `footer.terms` | `legal.nav.privacy`, `legal.nav.terms` via `FooterLegal` | 09, 01 |
| `service.breadcrumbAria` | `common.breadcrumbs.label` | 01, 05 |
| `service.faqHeading` | `common.labels.faq` of een eigen kop per pagina | 05 |
| `service.ctaNote` | `common.notes.*` | 05 |
| namespace `service` | vervalt | 01 |
| namespace `werkgebied` | vervalt (B-30; regiopagina's in fase 2 krijgen een eigen namespace in spec 15) | 01 |
| namespace `services` | vervalt; beroepsnamen in `beroepen` | 01, 05 |
| `home.*` (JV-structuur) | vervangen door spec 04; `home.contactForm.*` gaat naar `forms` (spec 07) | 04, 07 |
| `legal.contactQuestion`, `legal.contactCta`, `legal.updatedAt` | De huidige tekst komt uit J. Versseput; spec 09 §6.1 levert nieuwe tekst en vervangt `updatedAt` door `versionLine` (R-08) | 09 |

### 6.17 WhatsApp-voorinvulteksten

| Context | Sleutel | Waar | Parameters |
|---|---|---|---|
| Algemeen | `common.whatsapp.algemeen` | actiebalk (variant `algemeen`), footer, contact, 404 | geen |
| Werkzoekende algemeen | `common.whatsapp.werkzoekende` | actiebalk (variant `werkzoekende`), `/werkzoekenden`, `/inschrijven`, werkzoekendenblok home | geen |
| Werkzoekende per beroep | `common.whatsapp.werkzoekendeBeroep` | `/werken-als/[beroep]` | `occupation` = enkelvoud in kleine letters (§6.8) |
| Opdrachtgever algemeen | `common.whatsapp.werkgever` | actiebalk (variant `aanvraag`), `/werkgevers`, werkgeversblok home | geen |
| Opdrachtgever per beroep | `common.whatsapp.werkgeverBeroep` | `/werkgevers/[beroep]` | `occupationPlural` = meervoud in kleine letters |
| Solliciteren op een vacature | `common.whatsapp.vacatureSolliciteren` | `/vacatures/[slug]`, sticky balk en naast het formulier | `title` = vacaturetitel, `number` = vacaturenummer |
| Vraag over een vacature | `common.whatsapp.vacatureVraag` | contactblok van de vacature | idem |

De URL wordt `https://wa.me/<nummer zonder plus>?text=<encodeURIComponent(tekst)>`,
gebouwd met `whatsappLink(text?, phone?)` uit `lib/site.ts` (spec 01); zonder
tweede argument is het nummer het hoofdnummer van Jimmy (B-21). `occupation` en
`occupationPlural` zijn `beroepen.<id>.enkelvoud` en `.meervoud` (spec 05) met
`toLocaleLowerCase()`. De tekst volgt de
taal van de pagina. Voorbeeld: "Hallo Groos, ik wil graag solliciteren op de vacature
Orderpicker vroege dienst (nummer 1042)." De oude vaste offertetekst in
`contact.whatsappHref` vervalt (spec 01).

### 6.18 De Engelse versie

- **Kwaliteit.** Menselijk Engels, geen letterlijke vertaling en geen ongeziene
  machinevertaling. De vertaler schrijft de betekenis opnieuw op, met dezelfde
  structuur, dezelfde sleutels, dezelfde parameters en dezelfde tags.
- **Variant.** Brits Engels (labour, organise, centre), zinshoofdletters in koppen,
  geen samentrekkingen (do not, we are), geen uitroeptekens en geen gedachtestreepjes.
- **Stem.** "We" voor Groos en "you" voor beide doelgroepen. Het verschil tussen de
  doelgroepen blijft in woordkeus: eenvoudig Engels op B1-niveau voor werkzoekenden
  (veel lezers hebben Engels als tweede taal), zakelijk voor opdrachtgevers.
- **Termen.** Woordenlijst §6.7 en §6.8. Nederlandse begrippen zonder goed equivalent
  blijven staan met uitleg bij het eerste gebruik: cao ("collective labour agreement
  (cao)"), Wtta, KvK, BSN ("citizen service number (BSN)"), VCA ("VCA safety
  certificate"). "Den Haag" wordt "The Hague"; straatnamen, eigennamen en de
  bedrijfsnaam blijven gelijk.
- **Notatie.** §6.6, kolom Engels; via `lib/format.ts` met `en-GB`.
- **Paden** blijven Nederlands (B-03). Vacatureteksten zijn alleen Nederlands; de
  melding daarover staat in `vacatures` (spec 06).
- **Werkwijze.** De Engelse tekst ontstaat pas uit de goedgekeurde of voorlopig
  definitieve Nederlandse tekst (§10.2). Na elke Nederlandse wijziging past dezelfde
  vertaler de Engelse waarde aan in dezelfde commit.

### 6.19 Controle: `npm run check` en `npm run check:copy`

**`npm run check`** (`scripts/check-launch.mjs`, eigenaar spec 14) is de poort voor
de livegang, met de regels K1 tot en met K15 uit spec 14 §10.2. Voor de copy tellen
vier daarvan:

- K1: sleutelpariteit en arraylengtes tussen nl en en, geen lege waarden en geen
  vervallen namespaces.
- K5: draait `node scripts/check-copy.mjs` (deze spec). Een fout van het script is een
  probleem en blokkeert de livegang; waarschuwingen worden notities.
- K6: telt de open claims (regels met `TODO`) in `lib/claims.ts`, meldt
  `lib/claims.ts: <n> open claims` en draait `node scripts/check-claims.mjs --strict`
  (`check:claims`, spec 09).
- K7: geen "Wilk", "Versseput" of "jversseput" in `messages/`, `content/`,
  `lib/site.ts`, `emails/` en de juridische pagina's.

Zolang `scripts/check-copy.mjs` of `scripts/check-claims.mjs` nog niet bestaat, geven
K5 en K6 een notitie in plaats van een probleem (spec 14 §10.2).

**`npm run check:copy`** (nieuw, eigenaar 03) voert de copyregels C-01 tot en met C-23
uit: tekenregels, zinslengte, alinea's, fragmenten, "we", aanspreekvorm, verboden
woorden, notatie, knoplabels, koppen, FAQ, rich text, vertaling en lengtes. Het is
hetzelfde script dat `npm run check` als K5 draait; een schrijver ziet met
`npm run check:copy` dus dezelfde fouten als de poort.
Het script heet `scripts/check-copy.mjs` en draait op Node zonder dependencies. Exitcode 1 bij een fout; `-- --warn` geeft alleen waarschuwingen;
`-- --report` drukt per namespace en per bestand het aantal strings, de gemiddelde
zinslengte en het aandeel tweezinswaarden af; `-- --compare <map>` vergelijkt met
brontekst (C-21). Waarden die "TODO" bevatten, slaat het script over voor de
stijlregels.

Bronnen die het script leest: `messages/<locale>/*.json`, `content/**`,
`app/beheer/_strings.ts` en de `COPY`-blokken in `emails/*.tsx` (00 §4.4 punt 7),
plus de `CONTENT`-blokken van de juridische pagina's (00 §4.4 punt 6).

| Bron | Hoe | Zone |
|---|---|---|
| `messages/nl/*.json`, `messages/en/*.json` (B-45) | Alle stringwaarden met hun sleutelpad | per sleutelpad (zie zones) |
| `content/**/*.ts` | Stringliterals (dubbele aanhalingstekens of backticks zonder `${`) met minstens 3 woorden en een kleine letter; regels met `import`, `className`, `href`, `src` en commentaar worden overgeslagen | per bestand of per blok `jobseeker:` of `employer:` |
| `app/[locale]/{privacyverklaring,cookieverklaring,algemene-voorwaarden,klachtenregeling}/page.tsx` | Idem, binnen `CONTENT` | juridisch: C-03 grens 35, C-05 uit, C-10 uit; C-09 (je en u in één waarde) blijft gelden. De vorm per artikel (je voor werkzoekenden, anders u, spec 09 §6) controleert de reviewer. |
| `app/beheer/_strings.ts` | Idem | je, alleen nl |
| `COPY`-blokken in `emails/*.tsx` (00 §4.4 punt 7) | Idem, binnen `COPY` | alleen C-01, C-02, C-07, C-11, C-20 |

Zones: je-zone zijn de namespaces `werkzoekenden` en `vacatures`, elk sleutelpad met
segment `jobseeker` of achtervoegsel `Jobseeker` (of `werkzoekende` in de sleutelnaam),
`content/pages/werkzoekenden.ts`,
blokken `jobseeker:` in `content/beroepen/*.ts` en `app/beheer/_strings.ts`. U-zone
zijn de namespace `werkgevers`, elk sleutelpad met segment `employer` of achtervoegsel
`Employer` (of `werkgever` in de sleutelnaam), `content/pages/werkgevers.ts`, `content/pages/wtta.ts` en blokken
`employer:`. De eigenaren van `forms`, `bedankt` en `contact` (spec 07) gebruiken
dezelfde markers, of de bouw-agent vult de tabel `ZONES` bovenin het script aan. De
rest is neutraal: daar mag u, je alleen met een marker. `common.cta`, `header.nav` en
`common.whatsapp` zijn uitgezonderd van de zoneregel (C-10), niet van C-09. De
marker in de sleutelnaam geldt niet voor `header.nav.werkzoekenden` en
`header.nav.werkgevers`, omdat dat labels zonder voornaamwoord zijn.

| Id | Regel | Bereik | Ernst |
|---|---|---|---|
| C-01 | Geen uitroepteken (U+0021) | alle copy | fout |
| C-02 | Geen en-streepje (U+2013) of em-streepje (U+2014); geen koppelteken met spaties eromheen; geen streepje tussen twee getallen | alle copy | fout |
| C-03 | Zin langer dan 30 woorden (neutraal en u), 22 (je) of 35 (juridisch) | nl | fout |
| C-04 | Gemiddelde zinslengte per namespace of bestand boven 18 (neutraal en u) of 15 (je) | nl | waarschuwing |
| C-05 | Waarde met meer dan drie zinnen | nl en en, niet juridisch | waarschuwing |
| C-06 | Zin van één woord, zoals een losse "Ja." of "Zeker." | nl en en, niet bij labels, knoppen, koppen | fout |
| C-07 | Het woord "we" | nl | fout |
| C-08 | "men", "&" in een zin, verboden afkortingen (§6.7) | nl | fout |
| C-09 | je-vorm (je, jij, jou, jouw) en u-vorm (u, uw) in één waarde | nl | fout |
| C-10 | u-vorm in een je-zone of je-vorm in een u-zone of in een neutrale waarde zonder marker | nl | fout |
| C-11 | Woord uit lijst A (§6.9), NL en EN | nl en en | fout |
| C-12 | Woord uit lijst B (§6.9) | nl | waarschuwing |
| C-13 | Moeilijk woord (§6.4) in een je-zone | nl | waarschuwing |
| C-14 | Knoplabel met meer dan drie woorden; tekstlink met meer dan zes (knop en tekstlink volgens §6.13 regel 7: alleen stringwaarden direct onder een `cta` zonder `title`, en `submit` en `retry`; nooit `submitting`, `pending` of een sleutel op `Link`) | nl en en | fout |
| C-15 | Kop (`title` met `accent`, of sleutel `title` of `metaTitle`) eindigt op een punt of bevat een dubbele punt; `title` plus `accent` meer dan 12 woorden | nl en en | fout; lengte waarschuwing |
| C-16 | FAQ-vraag (`q`) eindigt niet op een vraagteken | nl en en | fout |
| C-17 | Euroteken direct voor een cijfer, tijd met dubbele punt, "7u", "p/u", "ma-vr" | nl | fout |
| C-18 | Meer dan één `<accent>`, of een andere tag dan `accent`, `link`, `strong` | nl en en | fout |
| C-19 | Engelse waarde gelijk aan de Nederlandse bij vier woorden of meer | en | waarschuwing |
| C-20 | Emoji (Unicode `Extended_Pictographic`) | alle copy | fout |
| C-21 | Reeks van acht gelijke woorden met de vergelijkingsbron (standaard de JV-repo `messages/nl.json` en `app/[locale]/**/page.tsx`, plus `context/research/wilk/*` en `context/05-referentie-wilk-site.md`) | nl | fout, alleen met `--compare` |
| C-22 | Metabeschrijving (`meta.description` en `*.meta.description`, behalve `bedankt` en `notFound`) buiten 120 tot 160 tekens | nl en en | waarschuwing |
| C-23 | WhatsApp-voorinvultekst (`common.whatsapp.*`) langer dan 160 tekens | nl en en | fout |

Zinnen splitsen op punt, vraagteken of uitroepteken gevolgd door een spatie en een
hoofdletter; afkortingen uit de toegestane lijst splitsen niet. Woorden tellen op
witruimte.

Fixtures: `scripts/fixtures/check-copy/fout.json` bevat per regel C-01 tot en met
C-20, C-22 en C-23 één foute waarde; `node scripts/check-copy.mjs --fixture fout.json`
meldt elk van die regels precies één keer (C-21 alleen met `--compare`);
`--fixture goed.json` meldt niets. In `fout.json` is de regel-id het bovenste
sleutelsegment, met daaronder het sleutelpad dat de regel nodig heeft (bijvoorbeeld
`C-16.faq.items[0].q` of `C-23.common.whatsapp.algemeen`); in fixturemodus haalt het
script dat eerste segment weg voordat het zones en sleutelregels toepast. `goed.json`
bevat de sleutelboom van §6.14. Voor C-14 bevat `goed.json` daarnaast een CTA-band
`{ "cta": { "title": "Eén telefoontje is genoeg", "body": "..." } }`,
`common.cta.readMoreLink` met "Lees meer over {subject}" en een `submitting` met
vier woorden ("Bezig met het versturen"); geen van de drie geeft een melding van
C-14. `fout.json` heeft onder C-14 een knop `cta.apply` met vier woorden
(`C-14.cta.apply`: "Solliciteer direct bij Groos").

## 7 SEO

- **Standaardtitel en merkachtervoegsel.** `meta.titleDefault` is de absolute titel
  van `/`. `pageMetadata()` zet het merkachtervoegsel zelf met `brandedTitle()`
  (" | Groos Personeelsdiensten", of " | Groos" als het totaal boven 60 tekens komt)
  en geeft een absolute titel terug; `meta.titleTemplate`
  (`"%s | Groos Personeelsdiensten"`) blijft alleen als vangnet voor pagina's zonder
  `pageMetadata()` (B-44). Het scheidingsteken is de verticale streep met een spatie
  aan beide kanten, zoals context/10 §6 en spec 01 §6 vragen; het is geen
  gedachtestreepje. `pageMetadata()` (spec 12) gebruikt dezelfde volledige titel voor
  `og:title`, zodat titel en OG-titel gelijk zijn; de repo gebruikt nu nog een
  middenpunt.
- **Beschrijving.** `meta.description` voor `/`, `meta.organizationDescription` voor
  de JSON-LD van Organization en EmploymentAgency en voor `llms.txt` (spec 12).
- **OG.** `meta.ogHeadline` en `meta.ogSubline` voor `app/opengraph-image.tsx`. Die
  route leest alleen `messages/nl/meta.json`; spec 12 beslist of `/en` een eigen OG-beeld krijgt.
- **Keywords.** Negen termen per taal, uit de zoektermen van context/01; weinig
  SEO-waarde, wel consistent.
- **Sjablonen per paginatype.** De eigenaar van de namespace vult de sleutels; titels
  zijn het eigen deel zonder het achtervoegsel.

| Paginatype | Titel NL | Titel EN | Beschrijving (sjabloon ZS-15) | Vorm |
|---|---|---|---|---|
| `/vacatures` | Vacatures in Den Haag en omgeving | Jobs in The Hague and surroundings | Bekijk de open vacatures van Groos in Den Haag en omgeving, met uurloon en werktijden. Je solliciteert in een paar minuten, ook zonder cv. | je |
| `/vacatures/[slug]` | {Titel} in {plaats} | {Title} in {city} | {Titel} in {plaats} voor {uren}, {uurloon}. {Startmoment}. Solliciteer bij Groos, ook zonder cv. | je |
| Gesloten vacature | {Titel} in {plaats} (vervuld) | {Title} in {city} (filled) | Deze vacature is vervuld. Bekijk vergelijkbaar werk als {beroep} of schrijf je in bij Groos. | je |
| `/inschrijven` | Inschrijven of open solliciteren | Register or apply openly | Schrijf je in bij Groos en vertel welk werk je zoekt en wanneer je kunt beginnen. Inschrijven kost niets en een cv is niet nodig. | je |
| `/werkzoekenden` | Werk vinden via Groos | Find work through Groos | Zo vind je via Groos praktisch werk in en rond Den Haag. Lees hoe solliciteren werkt, wat je verdient en wat je rechten zijn. | je |
| `/werken-als/[beroep]` | Werken als {beroep} in Den Haag | Work as a {occupation} in The Hague | Wil je werken als {beroep} in Den Haag? Lees wat het werk inhoudt, wat je verdient en hoe laat je begint. Solliciteren kan zonder cv. | je |
| `/werkgevers` | Personeel inhuren in Den Haag | Hire staff in The Hague | Groos levert medewerkers voor glasbewassing, schoonmaak, logistiek, verhuizen, bouw en sloop in Den Haag en omgeving. Vraag vrijblijvend personeel aan. | u |
| `/werkgevers/[beroep]` | zie spec 05 §6.6 (metatitels) en §7.1 (beschrijvingssjabloon) | idem | idem | u |
| `/werkgevers/personeel-aanvragen` | Personeel aanvragen | Request staff | Vertel ons welke mensen u zoekt, vanaf wanneer en voor hoe lang. Wij nemen daarna contact met u op om uw aanvraag te bespreken. | u |
| `/werkgevers/wtta` | Inlenen en de Wtta | Hiring and the Wtta | Vanaf 2028 mag u alleen inlenen bij een toegelaten uitlener. Lees wat de Wtta voor uw bedrijf betekent en hoe u de status van een uitzendbureau controleert. | u |
| `/over-ons` | Over ons | About us | Groos Personeelsdiensten is een Haags uitzendbureau voor praktisch werk in vijf beroepen. Lees wie Jimmy en Lorenzo zijn en hoe wij werken. | neutraal |
| `/contact` | Contact | Contact | Bel, app of mail Jimmy en Lorenzo van Groos Personeelsdiensten in Den Haag. Stuur een bericht via het formulier of maak een afspraak om langs te komen. | neutraal |
| Juridisch | documentnaam (`legal.nav.<id>`, spec 09) | idem | Eén feitelijke zin over de inhoud, plus wie het document beheert. | neutraal |
| Bedankpagina | Bedankt voor je sollicitatie, enzovoort | Thank you for your application | Niet nodig (noindex), wel een titel | per doelgroep |
| 404 | `notFound.metaTitle` | idem | Niet nodig (noindex) | neutraal |

Beschrijvingen zijn uniek per pagina, 120 tot 160 tekens, zonder uitroepteken of
streepje (C-22). Valt een beschrijving met een lange beroepsnaam boven 160 tekens, dan
vervalt "en omgeving". Bij een vacature valt eerst het startmoment weg als de
uitkomst te lang is; spec 06 bouwt die inkorting in. Pagina's met `noindex` hoeven
geen beschrijving van 120 tekens. JSON-LD-teksten (FAQPage, JobPosting, Service) gebruiken dezelfde
copy als de pagina; nooit een aparte, hardgecodeerde Nederlandse tekst.

## 8 Toegankelijkheid en performance

- Alle aria-labels, schermlezerteksten en alt-teksten komen uit messages
  (`common.a11y`, `header.*`, `*Aria`). Geen tekst in componenten.
- Linkteksten zeggen waar ze heen gaan (`readMoreLink` met onderwerp, nooit "klik
  hier"). Telefoonlinks tonen het nummer en hebben `aria-label` uit
  `common.a11y.callPerson`. Een WhatsApp-link opent in een nieuw venster en heeft de
  schermlezertekst `common.opensInNewTab`.
- De taalwissel toont "Nederlands" met `lang="nl"` en "English" met `lang="en"`
  (WCAG 3.1.2).
- Koppen blijven zonder opmaak volledige, leesbare zinnen; het accent is alleen kleur
  en draagt geen informatie die een schermlezer mist.
- Copy staat in zinshoofdletters. Geen `uppercase` op koppen of lopende tekst, omdat
  schermlezers hoofdletterwoorden soms spellen; spec 02 houdt zich daaraan.
- B1 voor werkzoekenden ondersteunt WCAG 3.1.5 (leesniveau); afkortingen worden bij
  het eerste gebruik uitgelegd.
- Foutmeldingen zijn concreet en zeggen wat de lezer nu kan doen (ZS-17); spec 07
  koppelt ze met `role="alert"` en `aria-describedby`.
- Performance: lange tekst staat in `content/` en wordt alleen server-side
  geïmporteerd. Elk messages-bestand blijft onder 60 KB. `NextIntlClientProvider`
  krijgt alleen de namespaces in `CLIENT_NAMESPACES`: zie spec 01 §4.11.4 (common,
  error, forms, vacatures). `header` hoort er niet bij; de header en het mobiele menu
  krijgen hun teksten als props vanuit een server component. `lib/claims.ts` en
  `lib/format.ts` hebben geen runtime-dependencies. `check:copy` draait alleen lokaal en
  in de controle, nooit in de app.

## 9 21st.dev-opdracht voor sub-agents

Niet van toepassing. Deze module levert schrijfregels, tekstsleutels, twee kleine
hulpbestanden en een controlescript, maar geen enkel zichtbaar component of
paginalayout. De plekken waar deze tekst verschijnt (header, footer, 404, foutpagina,
knoppen) zijn van spec 01 en 02, die daarvoor hun eigen 21st.dev-sub-agents inzetten.
Eén regel uit deze spec geldt wel voor elke 21st.dev-component die een andere spec
overneemt: de demotekst van de component wordt volledig vervangen door
messages-sleutels volgens §6.13, en geen enkele voorbeeldzin, label of knoptekst uit
21st.dev blijft staan.

## 10 Bouwopdracht

> **Notitie.** Bouwstap 3 is gecommit (16c35a6), zonder `scripts/check-copy.mjs`. Stap 5 van §10.1 (`check:copy`) en de wijzigingen uit kruiscontrole ronde 1 en 2 (onder meer `common.notes.*`) voert de bouw-agent van bouwstap 3b uit (00 §6).

### 10.1 Bouwstap 3 (samen met spec 01)

1. Lees 00 §3 en §4, deze spec en spec 01 (`nav`, `people`, `whatsappLink`, `contact.openingHours` in
   `lib/site.ts`).
2. Vervang in `messages/nl/*.json` en `messages/en/*.json` de namespaces `common`, `meta`,
   `header` en `footer` door §6.14 en §6.15, en voeg `notFound` en `error` toe.
3. Verwijder de namespaces `service`, `werkgebied` en `services` en de vervallen
   sleutels uit §6.16, in dezelfde commit waarin spec 01 de oude routes en componenten
   weghaalt; anders breekt de build. Componenten die nog oude sleutels lezen, krijgen
   de nieuwe sleutel uit de mapping.
4. Maak `lib/claims.ts` (§5.1) en `lib/format.ts` (§5.2).
5. Maak `scripts/check-copy.mjs` met de regels C-01 tot en met C-23, de zones en de
   rapportage (§6.19), plus `scripts/fixtures/check-copy/fout.json` en `goed.json`.
   Voeg in `package.json` toe: `"check:copy": "node scripts/check-copy.mjs"`.
6. Draai `npm run check -- --warn` (geen sleutelverschillen), `npm run check:copy`
   (geen fouten in de namespaces van deze spec), `npm run verify`.

### 10.2 Copy schrijven (bouwstap 4 tot en met 8)

De bouw-agent van elke stap met copy (04, 05, 06, 07, 09, 11) zet sub-agents in met een
contentbrief (§10.3). Volgorde per pagina of per beroep:

1. **Brief.** De bouw-agent vult de contentbrief in vanuit zijn eigen spec en deze
   spec.
2. **Schrijver NL** (sub-agent, één per pagina of per beroep; voor de beroepen één per
   beroep die beide perspectieven schrijft, eerst `jobseeker`, dan `employer`): schrijft
   de Nederlandse copy in de sleutels of het `content/`-bestand, met de sjablonen uit
   §6.10.
3. **Zelfcontrole.** `npm run check:copy` zonder fouten; waarschuwingen nalopen.
4. **Humanizer.** De schrijver roept de skill `humanizer` aan op zijn tekst als
   reviewlijst tegen AI-patronen (opgeblazen woorden, valse drieslagen, negatieve
   parallellen, vage bronnen). De skill mag geen streepjes, uitroeptekens of een
   lossere toon invoeren; bij twijfel wint deze spec.
5. **B1-lezer** (sub-agent, alleen je-pagina's): leest als werkzoekende met Nederlands
   als tweede taal op B1-niveau en markeert elk woord of elke zin die hij niet in één
   keer begrijpt. De schrijver vervangt of legt uit.
6. **Claimcontrole** (sub-agent, één per batch): draait `npm run check:claims`
   (spec 09), legt elke belofte naast §6.11, de checklist van spec 09 en
   `lib/claims.ts`, voegt ontbrekende `claim`-velden en vlaggen toe en levert de lijst
   open claims voor Jimmy en Lorenzo.
7. **Vertaler EN** (sub-agent per batch): schrijft de Engelse waarden volgens §6.18.
   Daarna `npm run check` (pariteit) en `npm run check:copy`.
8. **Visuele controle** op 390, 768, 1280 en 1440 px: geen afgebroken knoppen, geen
   koppen die over meer dan drie regels lopen op 390 px.
9. **Lezen.** Djulan leest de Nederlandse copy per pagina (BOUWINSTRUCTIE §4.3) en
   geeft één ronde correcties; de schrijver verwerkt die in NL en EN. Jimmy en Lorenzo
   krijgen via Djulan de lijst open claims en de beroepsfeiten (preview-deploy mag, B-14).
   De bouw-agent noteert de goedkeuring met datum in 00 §7.

Parallel: de vijf beroepen en de vaste pagina's (home, werkzoekenden, werkgevers,
wtta, over ons, contact) kunnen tegelijk; de vertaler start per batch zodra die batch
door stap 3 tot en met 6 is.

### 10.3 Contentbrief (sjabloon)

```
Contentbrief: <route of beroep>
Routes:            <bijvoorbeeld /werken-als/verhuizer en /en/werken-als/verhuizer>
Eigenaar sleutels: <spec en sleutelpaden of content-bestand>
Doelgroep en vorm: <werkzoekende, je, B1 | opdrachtgever, u | gedeeld, wij en u> (spec 03 §6.2)
Doel van de lezer: <per sectie, uit de spec van de pagina>
Secties en sleutels: <volgorde van boven naar beneden, met sleutelpaden>
Lengtes:           <per sectie en totaal, spec 03 §6.12>
Sjablonen:         <welke ZS en AS per sectie, spec 03 §6.10>
Feiten met bron:   <context/01 §<beroep>: taken, titels, certificaten, roosters, loonindicatie; context/02>
Claims:            <toegestaan A en B; vlaggen C met sleutel, spec 03 §6.11>
Zoektermen:        <uit context/01 Zoektermen; in h1, eerste alinea, één h2 en meta>
Woorden:           <woordenlijst §6.7 en §6.8; welke synoniemen hier passen>
FAQ:               <aantal, welke beroepsspecifiek, strekking uit context/13 §7 in eigen woorden>
Niet doen:         <niets van Wilk of J. Versseput; geen formule twee keer; geen urgentie richting werkzoekenden>
Oplevering:        <NL in de sleutels; lijst gebruikte claims; uitvoer van check:copy; daarna EN>
```

### 10.4 Verifiëren

- `npm run check -- --warn`: geen sleutelverschillen; de open claims staan in de lijst.
- `npm run check:copy` na elke batch; `npm run check:copy -- --report` voor de
  statistiek; `npm run check:copy -- --compare` eenmalig na bouwstap 4.
- `node scripts/check-copy.mjs --fixture fout.json` en `--fixture goed.json`.
- `npm run check:claims` (spec 09) na elke batch copy.
- `npm run verify`.
- Playwright op 390, 768, 1280 en 1440 px voor de tekstcontroles in §11.

## 11 Acceptatiecriteria

| Id | Criterium | Eis | Dient |
|---|---|---|---|
| AC-03-01 | `npm run check -- --warn` meldt geen sleutelverschil tussen `messages/nl/*.json` en `messages/en/*.json`. | E-03-10 | R-13 |
| AC-03-02 | De namespaces `common`, `meta`, `header`, `footer`, `notFound` en `error` bevatten in beide bestanden exact de sleutelpaden van §6.14 (een script vergelijkt de lijst van paden). | E-03-11 | R-19 |
| AC-03-03 | Geen van de sleutelnamen `requestQuote`, `quote`, `callUs`, `services`, `method`, `projects`, `allAreas`, `responsePromise`, `workArea`, `quickContact` en `whatsappAria` komt als sleutel voor in `messages/nl/*.json` of `messages/en/*.json` (een `grep` per naam, tussen aanhalingstekens en gevolgd door een dubbele punt, geeft niets), en de namespaces `service`, `werkgebied` en `services` ontbreken. | E-03-12 | R-08 |
| AC-03-04 | `npm run check:copy` eindigt na bouwstap 4 met exitcode 0. | E-03-03, E-03-18 | R-07 |
| AC-03-05 | `node scripts/check-copy.mjs --fixture fout.json` meldt elk van de regels C-01 tot en met C-20, C-22 en C-23 precies één keer en C-21 niet (C-21 alleen met `--compare`); `--fixture goed.json` meldt niets. | E-03-03 | R-07, R-19 |
| AC-03-06 | Playwright op `/`, `/werkzoekenden`, `/werken-als/glazenwasser`, `/werkgevers`, `/werkgevers/glazenwassers`, `/vacatures`, `/contact` en de `/en`-varianten: `document.body.innerText` bevat geen uitroepteken, geen en-streepje of em-streepje en geen koppelteken met spaties eromheen. | E-03-03, E-03-14 | R-07 |
| AC-03-07 | Playwright: `main` op `/werkgevers` en `/werkgevers/*` bevat geen los woord je, jij, jou of jouw; `main` op `/werkzoekenden`, `/werken-als/*`, `/vacatures` en `/inschrijven` bevat geen los woord u of uw (hoofdletterongevoelig). | E-03-01 | R-01, R-07 |
| AC-03-08 | `messages/nl/*.json` en alle `content/**/*.ts` bevatten het losse woord "we" niet. | E-03-01, E-03-03 | R-07 |
| AC-03-09 | De footer op `/` toont de tekst van `footer.description`, de kolomkoppen uit `footer.columns`, in de contactkolom de tekst van `common.address.byAppointment` ("Langskomen kan alleen op afspraak.") en de regel "© 2026 Groos Personeelsdiensten B.V." (jaar van de build); op `/en` dezelfde onderdelen in het Engels. De wettelijke vermeldingen toetst AC-09-10. | E-03-11, E-03-14 | R-07, R-12 |
| AC-03-10 | Met alle vlaggen in `lib/claims.ts` op `false` en `contact.openingHours` op `undefined` staat op geen enkele route uit de sitemap de tekst van `common.contact.officeHoursValue`, `common.contact.afterHours`, `common.notes.responseJobseeker` of `common.notes.responseEmployer`, en nergens "24/7" of "dag en nacht". | E-03-06, E-03-08 | R-12 |
| AC-03-11 | Met `contact.openingHours` op `undefined` tonen de footer en `/contact` geen tekst van `common.contact.officeHoursValue`; met `{ days: "ma-vr", opens: "07:00", closes: "18:00" }` tonen ze via `common.contact.officeHoursValue` "Maandag tot en met vrijdag van 07.00 tot 18.00 uur" (en op `/en` en `/en/contact` "Monday to Friday from 07:00 to 18:00"). | E-03-04, E-03-08 | R-12 |
| AC-03-12 | `npm run check -- --warn` noemt `lib/claims.ts` met het aantal open claims zolang er een TODO-vlag staat. | E-03-08 | R-12 |
| AC-03-13 | Op een gepubliceerde vacature uit de seed heeft de WhatsApp-link een `href` die begint met `https://wa.me/31683351985?text=` en waarvan de gedecodeerde tekst de titel en het nummer van die vacature bevat; op `/werkgevers/personeel-aanvragen` staat de tekst van `common.whatsapp.werkgever` in de WhatsApp-link van de actiebalk; op `/en/werkgevers/personeel-aanvragen` de Engelse tekst. | E-03-13 | R-01, R-14 |
| AC-03-14 | De `<title>` van `/` is exact "Uitzendbureau in Den Haag \| Groos Personeelsdiensten"; de `<title>` van `/contact` eindigt op " \| Groos Personeelsdiensten"; `/en` heeft "Employment agency in The Hague \| Groos Personeelsdiensten". | E-03-17 | R-09 |
| AC-03-15 | Een script over `sitemap.xml` op localhost vindt voor elke URL een meta description van 120 tot 160 tekens zonder uitroepteken en zonder streepje. | E-03-09, E-03-17 | R-09 |
| AC-03-16 | `/deze-pagina-bestaat-niet` geeft status 404, één h1 met de tekst van `notFound.title` en links naar `/vacatures`, `/werkgevers/personeel-aanvragen`, `/contact` en `/`; onder `/en` dezelfde opbouw in het Engels. | E-03-11, E-03-14 | R-07, R-13 |
| AC-03-17 | Een fout in een testsegment toont de foutpagina met de h1 uit `error.title`, een knop "Probeer opnieuw" die `retry()` aanroept en een telefoonlink naar het hoofdnummer. | E-03-11, E-03-15 | R-15 |
| AC-03-18 | `node -e` met dynamische import van `lib/format.ts` geeft: `formatEuro(16.08,"nl")` is "€ 16,08" met een vaste spatie, `formatEuro(16.08,"en")` is "€16.08", `formatTime("07:00:00","nl")` is "07.00", `formatDate("2026-10-02","nl")` is "2 oktober 2026" en `formatDate("2026-10-02","en")` is "2 October 2026". | E-03-04 | R-07 |
| AC-03-19 | `npm run check:copy -- --report` toont voor elke namespace een gemiddelde zinslengte van hoogstens 18 woorden (je-zones hoogstens 15), en voor `content/beroepen` en `content/pages` een aandeel waarden van twee zinnen van minstens 50%. | E-03-02, E-03-03 | R-07 |
| AC-03-20 | De taalwissel is een groep met `aria-label` "Taal kiezen" op nl en "Choose language" op en; de twee links hebben als toegankelijke naam "Nederlands" met `lang="nl"` en "English" met `lang="en"`. | E-03-15 | R-13, R-15 |
| AC-03-21 | Op `/en`, `/en/vacatures` en `/en/werkgevers` bevatten header, footer en knoppen geen enkele waarde uit `messages/nl/*.json` die verschilt van de Engelse waarde. | E-03-10, E-03-14 | R-13 |
| AC-03-22 | `grep` op componenten (`components/**/*.tsx`, `app/**/*.tsx` buiten juridische `CONTENT` en `app/beheer/_strings.ts`) vindt geen zichtbare Nederlandse of Engelse zin als letterlijke string in JSX, `aria-label`, `alt` of `placeholder`. | E-03-10, E-03-15 | R-13, R-15 |
| AC-03-23 | `npm run check:copy -- --compare` vindt geen reeks van acht woorden die gelijk is aan tekst van J. Versseput of Wilk. | E-03-07 | R-08 |
| AC-03-24 | 00 §7 bevat de datum waarop Djulan de Nederlandse copy heeft goedgekeurd, en de lijst open claims is aan Jimmy en Lorenzo voorgelegd. | E-03-08, E-03-18 | R-07, R-12 |
| AC-03-25 | `select slug, name_nl, plural_nl, name_en, plural_en from occupations` op `groos-dev` geeft precies de vijf rijen van §6.8 (met hoofdletter); `messages/nl/beroepen.json` en `messages/en/beroepen.json` hebben per id `enkelvoud` en `meervoud` gelijk aan §6.8; `grep -rniwE "glasreiniger\|schoonmaakster\|poetsvrouw\|logistieke medewerker\|magazijnier\|bouwvakker" messages content` geeft niets. | E-03-05 | R-07, R-13 |
| AC-03-26 | `app/beheer/_strings.ts` heeft voor elk veld uit §5.3 een hint met de lengte uit die tabel (SEO-titel: hoogstens 45 tekens, B-44), en in `supabase/seed.sql` heeft elke vacature een titel van 1 tot 6 woorden en hoogstens 60 tekens zonder plaatsnaam of "(m/v)" en 3 tot 7 taken. | E-03-16 | R-02, R-03, R-10 |
| AC-03-27 | `docs/21st-keuzes.md` heeft geen sectie "Spec 03", en het bouwverslag van bouwstap 3 en 3b noemt voor spec 03 geen aanroep van `mcp__magic__*`. | E-03-19 | R-16 |

## 12 Open vragen en aannames

| Onderwerp | Aanname in deze spec | Bevestigt | Gevolg als het anders is |
|---|---|---|---|
| Wij of we in je-copy | Overal "wij", nooit "we" (§6.3) | Djulan | Regel C-07 vervalt voor je-zones; geen andere wijziging |
| Aanspreekvorm | Je voor werkzoekenden, u voor opdrachtgevers, per route volgens §6.2 (B-04) | Djulan | Alles u: alleen copy en de zones in `check-copy.mjs` |
| Opdrachtgever of werkgever | "Werkgevers" als label en route, "opdrachtgever" in lopende u-tekst, "het bedrijf waar je werkt" in je-tekst | Djulan | Woordenlijst en lijst A aanpassen |
| Merknaam en scheidingsteken in titels | `contact.shortName` is "Groos Personeelsdiensten"; `pageMetadata()` zet het achtervoegsel met `brandedTitle()`: " \| Groos Personeelsdiensten", of " \| Groos" als het totaal boven 60 tekens komt (B-44, spec 12); `meta.titleTemplate` is alleen een vangnet; het eigen deel is bij voorkeur 25 tot 45 tekens, hoogstens 52 tekens; korte paginanamen (Contact, Over ons, Personeel aanvragen, Inlenen en de Wtta, Werk vinden via Groos, juridische documenten) mogen korter (B-44) | Djulan, spec 12 | Bij een middenpunt of een ander achtervoegsel: `titleTemplate`, `titleDefault` en AC-03-14 aanpassen |
| Engels | Brits Engels; "temporary worker", "mover", "logistics worker"; taalnamen in eigen taal | Djulan | Alleen §6.15 en de woordenlijst |
| Claims | Alle punten van categorie C staan op `false` tot bevestiging; categorie B mag nu met meelezen | Jimmy en Lorenzo | Vlaggen omzetten of copy verwijderen; geen structuurwijziging |
| Kantoortijden en spoed | Niet zichtbaar tot bevestiging (B-22); footer en `/contact` tonen `common.contact.officeHoursValue` alleen als `contact.openingHours` gevuld is; de spoedzin `common.notes.urgentEmployer` belooft geen levertijd | Jimmy | `contact.openingHours` in `lib/site.ts` vullen en vlag `afterHoursUrgent` |
| Reactietermijn | "Binnen één werkdag" als voorlopige tekst achter vlag `responseTime` (CL-05); die vlag dekt alleen de reactietermijn en nooit een levertermijn (B-49) | Jimmy en Lorenzo | Andere termijn: alleen de twee notes-waarden |
| Levertermijn | Geen copy noemt hoe snel Groos iemand kan laten beginnen; een termijn staat achter de aparte vlag `deliverySpeed` (CL-09, B-49), en de spoedzin `common.notes.urgentEmployer` blijft zonder termijn | Jimmy en Lorenzo | Bevestigd: vlag `deliverySpeed` op `true`, en de FAQ's "Hoe snel kunt u iemand sturen" en "Levert u ook voor één dag" krijgen de termijn |
| Bezoek op afspraak | Formulering "Langskomen kan alleen op afspraak." als volledige zin; spec 01 had "Bezoek op afspraak" als voorbeeld (B-23) | Jimmy | Alleen `common.address.byAppointment` |
| Eigenaarschap nieuwe bestanden | Gesloten (kruiscontrole ronde 1): `lib/claims.ts`, `lib/format.ts` en `scripts/check-copy.mjs` zijn van spec 03; 00 §4.4 en §4.4a zijn aangevuld | master-agent (besloten) | Geen |
| `bedankt` | Gesloten (kruiscontrole ronde 1): namespace van spec 07; 00 §4.4 en §4.4a zijn aangevuld | master-agent (besloten) | Geen |
| Beroepsnamen in messages | Spec 05 levert per id `beroepen.<id>.enkelvoud` en `.meervoud` met hoofdletter in nl en en (paden uit spec 01 §6) met de waarden uit §6.8; in een zin met `toLocaleLowerCase()` | spec 05 | Andere paden: alleen de afnemers in §4.3; de waarden blijven |
| Engelse naam hulpkracht | Gesloten (kruiscontrole ronde 1): definitief "construction and demolition labourer" en "construction and demolition labourers" (§6.8), zoals in de seed van spec 10 | Djulan (besloten) | Geen |
| Footervermeldingen volgens spec 01 | Gesloten (kruiscontrole ronde 1): de footer gebruikt `FooterLegal` van spec 09 met `legal.nav.*` en `legal.footer.*`; `footer` krijgt geen sleutels voor KvK, btw of juridische links | master-agent (besloten) | Geen |
| Rol van Jimmy en Lorenzo | `common.people.<id>.role` is "Contactpersoon" tot de echte rol bekend is | Jimmy en Lorenzo | Alleen die twee waarden |
| `people`, `whatsappLink` en `openingHours` | Spec 01 levert in `lib/site.ts` `people` (`PersonId` jimmy en lorenzo, `firstName`, `phone`), `whatsappLink(text?, phone?)` en `contact.openingHours` | spec 01 | Andere namen: alleen de afnemers in §4.3 en §6.17 |
| Vacaturetitel | De titel in de database bevat geen plaats; de plaats is een eigen veld (spec 10 legt dat vast in `vacancy_translations.title`) | spec 06 | Neemt spec 06 de plaats in de getoonde titel op, dan vervalt `in {plaats}` in het metasjabloon |
| Doelgroepblokken in `content/beroepen` | Spec 05 gebruikt de sleutels `jobseeker` en `employer` voor de twee perspectieven | spec 05 | De zones in `check-copy.mjs` krijgen de andere namen |
| Claims in twee lagen | `lib/claims.ts` schakelt de weergave; de bevestiging zelf staat in `docs/compliance/claims-status.md` en `npm run check:claims` (spec 09) | master-agent bij de kruiscontrole | Kiest de kruiscontrole één laag, dan vervalt `lib/claims.ts` en wordt onbevestigde copy niet geschreven |
| Engelse beroepsnaam | "Logistics worker" zoals in de seed van spec 10; "warehouse worker" als synoniem | Djulan | Alleen seed en woordenlijst |
| Procenten | In lopende tekst "8 procent", in tabellen en labels "8%" (sluit aan bij spec 09 en de seed van spec 10) | Djulan | Alleen §6.6 |
| Context 07 | Ontbreekt nog (B-33); deze spec steunt op de schrijfstijlanalyse en context/08 en /13 | Djulan | Afstemronde kan woordenlijst, lijst A en sjablonen wijzigen |
| `check:copy` naast `check` en `check:claims` | Gesloten (kruiscontrole ronde 1, spec 14 §10.2): `npm run check` draait `check:copy` als K5 (fouten zijn een probleem en blokkeren de livegang), K6 telt de open claims in `lib/claims.ts` en draait `check:claims`, K7 controleert op Wilk en Versseput | spec 14 (besloten) | Geen |
| OG-beeld per taal | `opengraph-image.tsx` blijft Nederlands; spec 12 beslist over een Engelse variant | spec 12 | Extra route of parameter |
