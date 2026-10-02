# 06 Vacaturebank publiek: overzicht, detail en filters

| Status | Fase | Hangt af van | Bronnen |
|---|---|---|---|
| concept, ter goedkeuring aan Djulan | 1 | 10 (data-laag, view, seed), 01 (routes, i18n, kruimelpad, actiebalk, foutafhandeling), 03 (toon, `common.*`, `lib/format.ts`), 07 (`ApplySection`, `ApplyFormVacancy`), 12 (`jobPostingLd`, `vacancyListMetadata`, `vacancyMetadata`, OG-afbeelding), 02 (tokens, `CtaButton`, primitives) | context/04 (lessen, niets overgenomen), context/08 §6.2 tot en met §6.4 en §6.12, context/10 §2, §3 en §6, context/11 §2 en §3, context/13 §2 en §3, context/01, 00 §3.2 (B-03, B-04, B-05, B-15, B-16, B-17, B-21, B-25, B-32, B-35), 00 §4, `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/{permanentRedirect,generate-metadata,generate-static-params,not-found}.md`, `.../03-file-conventions/page.md`, `.../02-guides/caching-without-cache-components.md` |

## 1 Doel

Deze module levert het publieke deel van de vacaturebank: de overzichtspagina `/vacatures` met zoeken, filters, tellers, sortering en paginering, de vacaturepagina `/vacatures/[slug]` met kenmerken, tekst, sollicitatieblok, contactpersoon, delen en vergelijkbare vacatures, de gesloten staat van een vacature en de Engelse variant onder `/en`. Daarnaast levert zij de bouwstenen `VacancyCard`, `VacancyList`, `LatestVacancies` en `VacancyFacts`, die de homepage (spec 04) en de beroepspagina's (spec 05) ook gebruiken, en de volledige messages-namespace `vacatures`. Alle data komt uit de gecachte leesfuncties van spec 10; de pagina's renderen op de server, werken zonder JavaScript en zijn op een telefoon in één hand te bedienen. Zo vindt een werkzoekende in Den Haag binnen een minuut werk met een echt uurloon, en ziet Google for Jobs alleen vacatures die echt openstaan.

## 2 Gebruikers en scenario's

Werkzoekende

1. S-06-01: Een schoonmaker opent op haar telefoon `/vacatures`. Ze tikt op "Filters", vinkt "Schoonmaker" en "Avonddienst" aan en ziet in de knop onderin direct hoeveel vacatures overblijven. Na "Toon 1 vacature" staat de lijst met één kaart, met chips voor beide filters erboven.
2. S-06-02: Een orderpicker zoekt op "naaldwijk". Hij ziet de vacature in Naaldwijk, omdat het zoeken ook op plaats werkt (anders dan bij Wilk, context/04).
3. S-06-03: Een werkzoekende filtert op "Verhuizer" en "Nachtdienst" en krijgt geen resultaat. De lege staat geeft hem drie uitwegen: filters wissen, inschrijven en de pagina over werken als verhuizer.
4. S-06-04: Een glazenwasser opent `/vacatures/glazenwasser-den-haag-1001` via een WhatsApp-groep. Bovenaan ziet hij uurloon, uren, werktijden, start en het vereiste rijbewijs. Hij tikt in de vaste balk onderin op "Solliciteer direct" en komt bij het formulier.
5. S-06-05: Een werkzoekende wil liever appen. Naast het formulier tikt hij op "App Jimmy"; WhatsApp opent met een bericht waarin de titel en het nummer van de vacature al staan.
6. S-06-06: Iemand opent een link naar een vacature die vorige week is vervuld. Hij ziet de melding "Deze vacature is vervuld", geen formulier, drie vergelijkbare vacatures en een knop om zich in te schrijven. Na 30 dagen geeft dezelfde link een 404.
7. S-06-07: Een Poolse logistiek medewerker opent `/en/vacatures/orderpicker-naaldwijk-1003`. Knoppen, labels en kenmerken zijn Engels; een melding zegt dat de vacaturetekst alleen in het Nederlands is en dat hij ons in het Engels kan bellen of appen.
8. S-06-08: Een werkzoekende stuurt een vacature door aan een vriend met "Deel via WhatsApp" of kopieert de link.
9. S-06-09: Een oude link met een andere tekst in de slug (`/vacatures/glazenwasser-1001`) stuurt met een 308 door naar `/vacatures/glazenwasser-den-haag-1001`.

Werkgever

10. S-06-10: Geen eigen scenario; een werkgever die via de footer op `/vacatures` komt, ziet dezelfde pagina.

Beheerder

11. S-06-11: Jimmy publiceert in `/beheer` een vacature. Door de revalidatie van spec 10 staat hij direct op `/vacatures`, op de homepage en op de beroepspagina; hij hoeft niets te bouwen.

Zoekmachine

12. S-06-12: Googlebot leest op elke open vacature één geldige `JobPosting` en één `BreadcrumbList`. Filter-URL's krijgen `noindex, follow` met canonical `/vacatures`; `?pagina=2` is indexeerbaar met een eigen canonical.

## 3 Scope

**Wel in fase 1**

| Id | Eis | Dient |
|---|---|---|
| E-06-01 | `/vacatures` rendert op de server met `searchParams` en ondersteunt de queryparameters `q`, `beroep`, `plaats`, `uren`, `dienst`, `sortering` en `pagina` via `parseVacancySearchParams()` en `buildVacancySearchParams()` uit spec 10. | R-02, R-09 |
| E-06-02 | Het filterpaneel toont de groepen beroep, plaats, uren per week en werktijden met een teller per waarde uit `getVacancyFacets()`; waarden met 0 zijn uitgeschakeld tenzij ze aangevinkt zijn. | R-02 |
| E-06-03 | Actieve filters en de zoekterm staan als chips boven de lijst; elke chip is een link die alleen die waarde verwijdert; "Wis alle filters" gaat naar `/vacatures`. | R-02, R-15 |
| E-06-04 | Sorteren kan op "Nieuwste eerst" (standaard) en "Hoogste uurloon" (`sortering=salaris`). | R-02 |
| E-06-05 | Paginering met 12 vacatures per pagina, als gewone links `?pagina=n`; een pagina buiten bereik geeft een 404. | R-02, R-09 |
| E-06-06 | De lege staat heeft twee varianten (met filters, zonder vacatures) en biedt altijd drie uitwegen: filters wissen of bellen, inschrijven, beroepspagina's. | R-01, R-02 |
| E-06-07 | Onder `lg` zit het filterpaneel achter een knop in een modaal paneel (`Sheet` van spec 02) met een knop die het aantal resultaten toont; zonder JavaScript staat het formulier gewoon in de pagina. | R-14, R-15 |
| E-06-08 | Is er op precies één beroep gefilterd, dan staat boven de lijst een beroepsintro van twee korte alinea's met een link naar `/werken-als/<slug>`. | R-01, R-09 |
| E-06-09 | `VacancyCard` toont titel, plaats, bruto uurloon, uren per week, werktijden, start en hoogstens twee badges (Nieuw, Spoed), en heeft een volledige toegankelijke zin als linknaam. | R-02, R-15 |
| E-06-10 | `VacancyList`, `LatestVacancies` en `VacancyListSkeleton` zijn bruikbaar voor spec 04 en spec 05 met de props uit §4.6. | R-01, R-19 |
| E-06-11 | `/vacatures/[slug]` zoekt op nummer met `parseVacancySlug()` en `getVacancyByNumber()`; een afwijkende slug geeft een 308 naar de juiste slug (B-15); onbekend, gearchiveerd of langer dan 30 dagen gesloten geeft een 404. | R-09, R-10 |
| E-06-12 | De vacaturepagina toont in deze volgorde: kruimelpad, kop met nummer en datum, `VacancyFacts`, actieknoppen, lead, de secties werkdag, eisen, aanbod en extra, de stappen om te solliciteren, het sollicitatieblok `ApplySection` van spec 07 (`#solliciteren`, alleen bij een open vacature), de contactpersoon, delen, vergelijkbare vacatures, de inschrijfoproep en een link naar de beroepspagina. | R-02, R-14 |
| E-06-13 | `VacancyFacts` toont plaats, uurloon, uren per week, soort contract, werktijden, start, rijbewijs en certificaten, ervaring, aantal plekken (vanaf 2), vacaturenummer en de taal op de werkvloer (`vacancy.workplaceLanguage`, als die gevuld is). | R-02, R-12 |
| E-06-14 | De contactpersoon is de voornaam en het nummer uit `vacancy.contact` (Jimmy of Lorenzo, B-21), met bellen en WhatsApp; ontbreekt die, dan het hoofdnummer van Jimmy uit `lib/site.ts`. | R-01, R-14 |
| E-06-15 | De WhatsApp-sollicitatie gebruikt `common.whatsapp.vacatureSolliciteren` met titel en nummer, alleen als `allowWhatsappApply` waar is (B-17). | R-14 |
| E-06-16 | Een gesloten vacature (`state: "closed"`) toont een melding per sluitreden, de kenmerken, vergelijkbare vacatures en inschrijven, zonder formulier, zonder WhatsApp-sollicitatie, zonder delen, met `noindex, follow` en zonder `JobPosting` (B-15). | R-10 |
| E-06-17 | Onder `/en` zijn interface en labels Engels, staat de vacatureinhoud in een element met `lang="nl"`, staat bovenaan een melding met `role="note"` en wijst de canonical van een vacature naar de Nederlandse URL (B-03, spec 01). | R-13 |
| E-06-18 | Metadata gaat via `vacancyListMetadata()` en `vacancyMetadata()` van spec 12 (op `pageMetadata()`) met de sjablonen uit §6 en §7; een open Nederlandse vacature krijgt `JobPosting` via `jobPostingLd` uit `lib/seo.ts`; het kruimelpad levert `BreadcrumbList` via `Breadcrumbs` van spec 01. | R-09, R-10 |
| E-06-19 | Bedragen, uren, tijden en datums gaan door `lib/format.ts` (spec 03) en de ICU-zinnen in `common.format.*`, in `nl-NL` en `en-GB`. | R-07, R-13 |
| E-06-20 | Caching volgt B-35: geen eigen fetches, alleen `lib/data/*`; de vacaturepagina is ISR met `revalidate = 3600`, `generateStaticParams` via `listOpenVacancyParams()` en `dynamicParams = true`. | R-15, R-17 |
| E-06-21 | Filteren, zoeken en sorteren werken zonder JavaScript als GET-formulieren; met JavaScript verversen ze de lijst zonder volledige paginalading en met een zichtbare en voorleesbare wachtstand. | R-14, R-15 |
| E-06-22 | De namespace `vacatures` staat volledig en gespiegeld in `messages/nl/vacatures.json` en `messages/en/vacatures.json` (§6), in je-vorm, zonder Wilk-labels en zonder onbevestigde claims. | R-07, R-08, R-12, R-13 |
| E-06-23 | De pagina's halen Lighthouse mobiel 90 of hoger op een vacature, blijven binnen het JavaScript-budget van spec 14 (215 kB overzicht, 235 kB vacature) en hebben geen horizontale scroll op 390 px. | R-15 |
| E-06-24 | De bouw-agent zet per UI-plek uit §9 een sub-agent in die via 21st.dev kandidaten zoekt. | R-16 |
| E-06-25 | Alles is op localhost tegen `groos-dev` met de seed van spec 10 te controleren, zonder deploy. | R-17 |

**Niet in deze spec**

Het sollicitatieblok `ApplySection` en het formulier zelf, de Server Action, de upload en de bedankpagina (spec 07); de builders `jobPostingLd`, `breadcrumbLd` en de implementatie van `pageMetadata()`, sitemap, `llms.txt` en de OG-route (spec 12); de leesfuncties, de view en de cron (spec 10); header, footer, actiebalk en kruimelpadcomponent (spec 01); tokens en primitives (spec 02); beheerschermen (spec 08).

**Fase 2 (spec 15)**

Jobalert vanuit de lege staat en de lijst, zoeken op postcode met straal en sortering op afstand, favorieten, Engelse vacatureteksten met eigen canonical en `JobPosting`, landingspagina's per plaats (`/regio/[plaats]`), feeds.

## 4 Pagina's en componenten

### 4.1 Routes en bestanden

| Route | Bestand | Rendering | Index |
|---|---|---|---|
| `/vacatures`, `/en/vacatures` | `app/[locale]/vacatures/page.tsx` | dynamisch door `searchParams`; data uit `unstable_cache` (spec 10) | ja; met filter, zoekterm of sortering `noindex, follow`; `?pagina=n` self-canonical (B-16) |
| `/vacatures/[slug]`, `/en/vacatures/[slug]` | `app/[locale]/vacatures/[slug]/page.tsx` | ISR: `export const revalidate = 3600`, `export const dynamicParams = true`, `generateStaticParams()` | open NL: ja met `JobPosting`; gesloten: `noindex, follow`; EN: canonical naar NL |
| `/vacatures/[slug]/opengraph-image` | `app/[locale]/vacatures/[slug]/opengraph-image.tsx` (eigendom spec 12) | zie §7.6 | n.v.t. |

Er komt geen `loading.tsx` onder `app/[locale]/vacatures` (E-01-17): een `loading.tsx` laat het segment streamen, waarna `notFound()` en de 308 een status 200 zouden geven. Laadstaten lopen via `<Suspense>` binnen de pagina en via de wachtstand van §4.4.

De skeletpagina's van spec 01 (§4.20) worden vervangen; `generateStaticParams`, `dynamicParams` en `setRequestLocale` blijven.

### 4.2 `/vacatures`: opbouw van boven naar beneden

```
<Breadcrumbs items={[{ label: t("header.nav.vacatures"), href: ROUTES.vacatures }]} />
<section aria-labelledby="vacatures-titel">               paginakop, container max-w-3xl
  <h1 id="vacatures-titel">vacatures.overview.title</h1>
  <p>vacatures.overview.intro</p>
  <VacancySearchForm />                                    GET-formulier, zie §4.4
</section>
<VacancyNavigationProvider>                                client, deelt navigate() en isPending
  <div className="lg:grid lg:grid-cols-12 lg:gap-8">
    <aside className="hidden lg:block lg:col-span-4">     sticky top-20
      <VacancyFilters idPrefix="zijbalk" />                h2 "Filters" en vier fieldsets
    </aside>
    <div className="lg:col-span-8">
      <div> werkbalk                                       flex, wrap
        <VacancyFilterSheet />                             alleen onder lg
        <p role="status" aria-live="polite">resultCount</p>
        <VacancySortSelect value={sortValue} />
      </div>
      <noscript> <VacancyFilters idPrefix="noscript" /> </noscript>   alleen onder lg zichtbaar
      <VacancyActiveFilters />                             alleen als er chips zijn
      <OccupationIntro />                                  alleen bij precies één beroep
      <VacancyResultsRegion>                               client, aria-busy tijdens navigatie
        <h2 className="sr-only">vacatures.overview.resultsHeading</h2>
        <VacancyList items={list.items} headingLevel="h3" />   of <VacancyEmptyState />
      </VacancyResultsRegion>
      <VacancyPagination />                                alleen als pageCount > 1
      <VacancyRegisterPrompt />                            altijd, behalve bij de lege staat
    </div>
  </div>
</VacancyNavigationProvider>
```

Geen JSON-LD op deze pagina behalve de `BreadcrumbList` van `Breadcrumbs` (geen `ItemList`, B-16).

Paginacode (verplicht patroon):

```tsx
// app/[locale]/vacatures/page.tsx
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { resolveLocale } from "@/i18n/locale";
import { ROUTES } from "@/lib/routes";
import { parseVacancySearchParams } from "@/lib/data/vacancy-search-params";
import { getVacancyList, getVacancyFacets } from "@/lib/data/vacancies";
import { VACANCY_SORTS } from "@/lib/data/options";
import { VACANCY_PAGE_SIZE } from "@/components/vacatures/constants";

export async function generateMetadata({ params, searchParams }: PageProps<"/[locale]/vacatures">): Promise<Metadata> {
  // zie §7.1
}

export default async function VacanciesPage({ params, searchParams }: PageProps<"/[locale]/vacatures">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const state = parseVacancySearchParams(await searchParams);
  const [list, facets] = await Promise.all([
    getVacancyList({ filters: state.filters, sort: state.sort, page: state.page, pageSize: VACANCY_PAGE_SIZE }),
    getVacancyFacets(state.filters),
  ]);
  if (list.outOfRange) notFound();   // vóór elke Suspense-grens (spec 01 §4.13)
  const sortSlug = VACANCY_SORTS.find((s) => s.id === state.sort)?.slug;
  const sortValue = sortSlug === "salaris" ? "salaris" : "nieuwste";   // "sluitdatum" toont in de select "nieuwste"
  // view-modellen bouwen (§4.5) en renderen
}
```

De pagina wacht op beide leesfuncties voordat hij rendert. Ze lezen uit één gecachte loader en filteren in het geheugen (spec 10 §4.3), dus dit is snel; streamen levert hier niets op en zou de 404 bij een pagina buiten bereik breken. Er is geen `export const revalidate`: de route is dynamisch door `searchParams` en de data heeft haar eigen vangnet van 3600 seconden.

### 4.3 `/vacatures/[slug]`: opbouw van boven naar beneden

**Open vacature**

```
<Breadcrumbs items={[{ label: header.nav.vacatures, href: ROUTES.vacatures }, { label: vacancy.title, href: vacancy.path }]} />
<OnlyDutchNotice />                         alleen locale "en"
<article lang={locale === "en" ? "nl" : undefined} aria-labelledby="vacature-titel">   zie §4.9 voor lang
  <VacancyHeader />                         h1 "{title} in {city}", regel "Vacature 1001" en "Geplaatst op ...",
                                            badges (Nieuw, Spoed)
  <VacancyFacts variant="full" workplaceLanguage={vacancy.workplaceLanguage} />   sr-only h2, <dl> in raster 1 kolom, sm 2 kolommen
  <VacancyActions />                        CtaButton "Solliciteer direct" naar #solliciteren,
                                            secundair "App {name}" en "Bel {name}"
  <p class="lead">{vacancy.intro}</p>       lead uit de database
  <Image />                                 alleen als vacancy.imageUrl bestaat (§4.10)
  <div className="lg:grid lg:grid-cols-12 lg:gap-10">
    <div className="lg:col-span-8">
      <VacancyBody />                       h2 Je werkdag, Wat je meebrengt, Wat je van ons krijgt, Meer over dit werk
      <ServiceSteps id="zo-solliciteer-je" heading={detail.sections.howTo} steps={3 stappen} />
      <ApplySection vacancy={vacancy} locale={locale} />   alleen bij state "open"; components/forms/apply-section.tsx (spec 07):
                                            section#solliciteren, h2, ApplyForm, ContactAside met WhatsApp en bellen
      <VacancyContactCard />                h2 Vragen over deze vacature
      <VacancyShare />                      h2 Deel deze vacature
    </div>
    <aside className="hidden lg:block lg:col-span-4">
      <VacancyApplyAside />                 sticky top-20: h2 In het kort, uurloon, uren, start, knop, WhatsApp
    </aside>
  </div>
</article>
<Suspense fallback={<VacancyListSkeleton count={3} />}>
  <SimilarVacancies />                      h2 Vergelijkbare vacatures, 3 kaarten, link naar alle vacatures
</Suspense>
<VacancyRegisterPrompt />                   h2 en knop "Schrijf je in" naar /inschrijven
<p><Link href={paths.werkenAls(vacancy.occupation.slug)}>{t("detail.occupationPageLink", { occupation })}</Link></p>
{ld && <JsonLd data={ld} />}                alleen locale "nl" (§7.4)
```

Tot bouwstap 6 (spec 07) staat op de plek van `ApplySection` `<section id="solliciteren"><p>TODO formulier uit spec 07</p></section>`, zodat het anker werkt en `npm run check` de TODO vindt. In de link naar de beroepspagina is `{occupation}` de enkelvoudsnaam uit `beroepen.<id>.enkelvoud` met een kleine eerste letter.

Op mobiel is de vaste sollicitatiebalk de actiebalk van spec 01 in variant `vacature` (Bel ons (`common.cta.call`) en Solliciteer direct (`common.cta.apply`) naar `#solliciteren`, spec 01 §4.6). Deze spec bouwt geen tweede vaste balk; zij levert het anker en de controle in AC-06-16. Op `lg` en breder is `VacancyApplyAside` de vaste sollicitatiebalk.

**Gesloten vacature** (`vacancy.state === "closed"`)

```
<Breadcrumbs ... />
<OnlyDutchNotice />                         alleen locale "en"
<article aria-labelledby="vacature-titel">
  <VacancyHeader closed />                  h1 zoals open, zonder badges
  <VacancyClosedNotice />                   h2 per sluitreden, één alinea, "Gesloten op {date}"
  <VacancyFacts variant="compact" workplaceLanguage={vacancy.workplaceLanguage} />   zonder start en zonder aantal plekken
</article>
<div id="solliciteren">                     anker voor de actiebalk van spec 01
  <Suspense fallback={<VacancyListSkeleton count={3} />}><SimilarVacancies /></Suspense>
  <VacancyRegisterPrompt />                 h2 en knop "Schrijf je in"
  <p><Link href={paths.vacaturesVoorBeroep(vacancy.occupation.slug)}>detail.closed.occupationLink</Link></p>
</div>
```

Geen intro, taken, eisen, aanbod, formulier, WhatsApp-sollicitatie of delen; geen `JobPosting`.

Paginacode (verplicht patroon):

```tsx
// app/[locale]/vacatures/[slug]/page.tsx
import { notFound, permanentRedirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { localizedPath } from "@/lib/seo";
import { getVacancyByNumber, listOpenVacancyParams } from "@/lib/data/vacancies";
import { parseVacancySlug } from "@/lib/data/vacancy-search-params";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return listOpenVacancyParams();          // [{ slug }]; de taal komt uit de layout
}

export default async function VacancyPage({ params }: PageProps<"/[locale]/vacatures/[slug]">) {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const number = parseVacancySlug(slug);
  if (number === null) notFound();
  const vacancy = await getVacancyByNumber(number);   // React cache(): één lezing met generateMetadata
  if (!vacancy) notFound();
  if (vacancy.slug !== slug) permanentRedirect(localizedPath(locale, vacancy.path));   // 308 (B-15)
  // render open of gesloten
}
```

`permanentRedirect` uit `next/navigation` geeft buiten een stream een 308 (`04-functions/permanentRedirect.md`). Hij staat vóór elke `<Suspense>`. De pagina leest geen `searchParams`, zodat hij statisch blijft; queryparameters zoals `utm_source` gaan bij de 308 verloren, wat aanvaardbaar is omdat Google for Jobs de canonieke URL gebruikt. Een slug met hoofdletters (`Glazenwasser-den-haag-1001`) geeft dus ook een 308 naar de kleine letters.

### 4.4 Interactie op `/vacatures` zonder en met JavaScript

**Zonder JavaScript.** Elk formulier is een `<form method="get" action={localizedPath(locale, "/vacatures")}>`:

| Formulier | Velden | Verborgen velden (houden de rest vast) |
|---|---|---|
| `VacancySearchForm` | `q` (`type="search"`, `maxLength={80}`, `autoComplete="off"`, `enterKeyHint="search"`) | alle waarden van `beroep`, `plaats`, `uren`, `dienst` en `sortering` |
| `VacancyFilters` | checkboxes `beroep`, `plaats`, `uren`, `dienst` (zelfde naam per groep, waarde = slug of id) en een knop "Filters toepassen" in `<noscript>` | `q`, `sortering` |
| `VacancySortSelect` | `<select name="sortering">` met `nieuwste` en `salaris`, en een knop in `<noscript>` | `q` en alle filterwaarden |

Geen formulier stuurt `pagina` mee, dus elke wijziging begint op pagina 1. De verborgen velden komen uit `buildVacancySearchParams(state)` van spec 10, zonder `pagina`. Standaardwaarden (`sortering=nieuwste`) laat die functie al weg.

Onder `lg` staat zonder JavaScript een tweede `VacancyFilters` (`idPrefix="noscript"`) in een `<noscript>` onder de werkbalk, omdat het modale paneel JavaScript vraagt.

**Met JavaScript.** `VacancyNavigationProvider` (client) levert via React-context:

```ts
type VacancyNavigation = {
  isPending: boolean;
  navigate: (params: URLSearchParams, mode?: "replace" | "push") => void;
};
// navigate: startTransition(() => router[mode](qs ? `/vacatures?${qs}` : "/vacatures", { scroll: false }))
// router = useRouter() uit "@/i18n/navigation", zodat /en behouden blijft
export function useVacancyNavigation(): VacancyNavigation;
```

- Checkbox wijzigen: `navigate(params, "replace")` direct, op desktop en in het paneel. De checkboxen zijn gecontroleerd met `useOptimistic` op de waarden uit de props, zodat het vinkje meteen staat terwijl de server de nieuwe lijst rendert.
- Zoeken: `onSubmit` voorkomt de standaardactie en roept `navigate(params, "push")` aan, zodat de terugknop werkt.
- Sorteren: `onChange` van de `<select>` roept `navigate(params, "replace")` aan.
- Paginering en chips zijn gewone `Link`-elementen uit `@/i18n/navigation`; die scrollen naar boven.
- `VacancyResultsRegion` zet `aria-busy={isPending}` op de resultaten en geeft na 250 ms wachten een dunne voortgangsbalk boven de lijst (`bg-primary`, hoogte 2 px, `motion-reduce:animate-none`) en `opacity-60` op de lijst. Er wordt niets vervangen door een skelet, zodat de lijst niet verspringt.
- Het element met `role="status"` en `aria-live="polite"` in de werkbalk toont na elke navigatie de nieuwe teller, zodat een schermlezer het resultaat hoort.
- De focus blijft na een filterwijziging op de checkbox die gewijzigd is; na een zoekopdracht zet `VacancySearchForm` de focus op het statuselement niet, maar laat hem in het zoekveld.

**Mobiel paneel** (`VacancyFilterSheet`, onder `lg`): een knop "Filters" of "Filters (2)" (minimaal 44 px hoog, `SheetTrigger`) opent de `Sheet` van spec 02 met `SheetContent side="right"` (volle hoogte, breedte zoals spec 02 die vastlegt) en `closeLabel` uit `labels.close` ("Sluiten"). Kop: `SheetHeader` met `SheetTitle` "Filters". Inhoud: `VacancyFilters idPrefix="paneel"`. `SheetFooter` met twee knoppen: "Wis alle filters" (link naar `/vacatures`, secundair) en "Toon 3 vacatures" (`CtaButton`, sluit het paneel). De tekst van die knop komt als kant-en-klare string uit de server en ververst mee met elke navigatie. Focusval, Escape, focus terug naar de trigger, scrollvergrendeling en de beweging (200 ms, uit bij `prefers-reduced-motion`) levert de `Sheet`; deze module gebruikt geen eigen base-ui `Dialog` voor het paneel.

### 4.5 View-modellen en opmaak

Tekst gaat als props van server naar client (spec 01 §4.3). De server bouwt per groep een `FilterGroup` en per chip een `ActiveFilterChip`:

```ts
// components/vacatures/types.ts (client-veilig, alleen typen)
import type { VacancyListItem, VacancyDetail } from "@/lib/data/types";
import type { WorkplaceLanguage } from "@/lib/data/options";   // spec 10, geen eigen type
export type VacancyCardVariant = "default" | "compact";
export type FilterGroupName = "beroep" | "plaats" | "uren" | "dienst";
export type FilterOption = { value: string; label: string; count: number; checked: boolean; countAria: string };
export type FilterGroup = { name: FilterGroupName; legend: string; options: FilterOption[]; collapseAfter?: number; moreLabel?: string };
export type ActiveFilterChip = { key: string; label: string; href: string; removeLabel: string };
export type HiddenField = [name: string, value: string];
```

Regels voor de groepen:

| Groep | Opties en volgorde | Label | Bron teller |
|---|---|---|---|
| `beroep` | altijd de vijf uit `facets.beroep` (volgorde `occupations.sort_order`) | `beroepen.<id>.enkelvoud` (spec 05) | `facets.beroep[].count` |
| `plaats` | alleen plaatsen met open vacatures, aflopend op aantal (spec 10); de eerste 6 zichtbaar, de rest in een `<details>` met `<summary>` "Toon alle plaatsen"; een aangevinkte plaats staat altijd in de eerste groep | `displayCity(name, locale)` | `facets.plaats[].count` |
| `uren` | `tot-20`, `20-32`, `32-plus` uit `HOURS_BUCKETS` | `vacatures.filters.uren.options.<id>` | `facets.uren[].count` |
| `dienst` | `vroeg`, `dag`, `avond`, `nacht`, `weekend` uit `SHIFTS` (URL-slug) | `vacatures.filters.dienst.options.<slug>` | `facets.dienst[].count` |

Elke optie is een ui-`CheckboxField` van spec 02: het hele rijtje is het label (`min-h-11`). Een optie met `count === 0` die niet aangevinkt is, krijgt `disabled`; de teller staat zichtbaar achter het label (`Schoonmaker 2`, in `tabular-nums text-muted-foreground`) en voor schermlezers in `countAria` ("2 vacatures").

Chips: per waarde in `state.filters` één chip met het label van de optie, plus een chip "Zoekterm: {query}" als `q` gevuld is. `href` is `buildVacancySearchParams` van de huidige staat zonder die waarde en zonder `pagina`, als pad met `localizedPath`. `removeLabel` is `vacatures.filters.removeChip` met het label; `VacancyActiveFilters` geeft `href` en `removeLabel` door aan de `Chip` van spec 02. Na de chips staat de link "Wis alle filters" naar `/vacatures`.

**Opmaakhulp** `components/vacatures/vacancy-format.ts` (`import "server-only"`):

```ts
export type VacancyFormatters = {
  wage(min: number, max: number): string;          // common.format.wageRange of .wagePerHour (min === max), bedragen via formatEuro
  hours(min: number, max: number): string;         // common.format.hoursRange of .hoursPerWeek
  shifts(ids: ShiftId[]): string;                  // labels uit vacatures.filters.dienst.options in de volgorde van SHIFTS, gescheiden door ", ";
                                                   // het eerste label zoals het is, de volgende met toLocaleLowerCase(locale); leeg: vacatures.facts.shiftsNone
  start(asap: boolean, date: string | null): string;   // vacatures.card.startAsap of .startFrom met formatDate
  city(city: string): string;                      // displayCity
  date(iso: string): string;                       // formatDate(iso, locale)
  phone(e164: string): string;                     // displayPhone
};
export const getVacancyFormatters: (locale: Locale) => Promise<VacancyFormatters>;   // React cache() per verzoek
export function displayCity(city: string, locale: Locale): string;   // en: "Den Haag" wordt "The Hague"; overige plaatsen ongewijzigd
export function displayPhone(e164: string): string;                  // eerst people uit lib/site.ts (phone.display), dan +316xxxxxxxx als "06 xx xx xx xx", anders e164
export function isNewVacancy(publishedAt: string, now?: Date): boolean;   // jonger dan NEW_BADGE_DAYS
export function todayInAmsterdam(): string;                          // "YYYY-MM-DD" in Europe/Amsterdam
export async function getVacancySeoParts(vacancy: VacancyDetail, locale: Locale): Promise<{ city: string; hours: string; wage: string; startDate: string | null; start: string }>;
```

`getVacancySeoParts()` levert de waarden voor `generateMetadata` (§7.2) en `jobPostingLd` (§7.4), zodat metadata en JSON-LD dezelfde tekst gebruiken. Regels:

- `city = displayCity(vacancy.city, locale)`;
- `hours` met `common.format.hoursPerWeek` of `hoursRange`;
- `wage` met `common.format.wagePerHour` of `wageRange` en `formatEuro`;
- `startDate = !vacancy.startAsap && vacancy.startDate && vacancy.startDate > todayInAmsterdam() ? formatDate(vacancy.startDate, locale) : null`;
- `start = startDate ? t("vacatures.meta.startDateSentence", { date: startDate }) : t("vacatures.meta.startAsapSentence")`.

Bedragen, datums en tijden komen alleen uit `formatEuro`, `formatDate` en `formatNumber` van `lib/format.ts` (spec 03); deze module bouwt geen eigen formatter en gebruikt geen ICU-getalskeletten. Voorbeelden: NL "€ 16,08 tot € 17,50 bruto per uur", "32 tot 40 uur per week", "Vanaf 12 oktober 2026"; EN "€16.08 to €17.50 gross per hour", "32 to 40 hours per week", "From 12 October 2026".

**Constanten** `components/vacatures/constants.ts`: `VACANCY_PAGE_SIZE = 12`, `NEW_BADGE_DAYS = 7`, `MAX_BADGES = 2`, `PLACES_VISIBLE = 6`, `SIMILAR_LIMIT = 3`, `LATEST_DEFAULT_LIMIT = 3`.

### 4.6 Componenten (alle in `components/vacatures/`)

| Naam | Bestand | S/C | Props |
|---|---|---|---|
| `VacancyCard` | `vacancy-card.tsx` | S (async) | `{ vacancy: VacancyListItem; locale: Locale; variant?: VacancyCardVariant; headingLevel?: "h2" \| "h3"; now?: Date }` |
| `VacancyList` | `vacancy-list.tsx` | S (async) | `{ items: VacancyListItem[]; locale: Locale; variant?: VacancyCardVariant; headingLevel?: "h2" \| "h3"; className?: string; ariaLabelledBy?: string }` |
| `VacancyListSkeleton` | `vacancy-list-skeleton.tsx` | S | `{ count?: number; variant?: VacancyCardVariant; className?: string }` |
| `LatestVacancies` | `latest-vacancies.tsx` | S (async) | `{ locale: Locale; heading: string; headingId: string; intro?: string; occupation?: OccupationSlug; limit?: number; variant?: VacancyCardVariant; viewAll?: { href: AppPath; label: string } \| false; emptyText?: string }` |
| `VacancyFacts` | `vacancy-facts.tsx` | S (async) | `{ vacancy: VacancyDetail; locale: Locale; variant?: "full" \| "compact"; workplaceLanguage?: WorkplaceLanguage \| null; headingId?: string }` |
| `VacancySearchForm` | `vacancy-search-form.tsx` | C | `{ action: string; defaultQuery: string; hidden: HiddenField[]; labels: { form: string; label: string; placeholder: string; submit: string } }` |
| `VacancyFilters` | `vacancy-filters.tsx` | C | `{ action: string; groups: FilterGroup[]; hidden: HiddenField[]; idPrefix: string; labels: { heading: string; apply: string }; headingLevel?: "h2" }` |
| `VacancyFilterSheet` | `vacancy-filter-sheet.tsx` | C | `{ action: string; groups: FilterGroup[]; hidden: HiddenField[]; activeCount: number; showResultsLabel: string; clearHref: string; labels: { open: string; openWithCount: string; title: string; close: string; clearAll: string; heading: string; apply: string } }` |
| `VacancySortSelect` | `vacancy-sort-select.tsx` | C | `{ action: string; value: "nieuwste" \| "salaris"; hidden: HiddenField[]; labels: { label: string; apply: string; options: { nieuwste: string; salaris: string } } }` |
| `VacancyNavigationProvider`, `useVacancyNavigation`, `VacancyResultsRegion` | `vacancy-navigation.tsx` | C | provider `{ children: ReactNode }`; region `{ children: ReactNode; labelledBy: string; updatingLabel: string }` |
| `VacancyActiveFilters` | `vacancy-active-filters.tsx` | S | `{ chips: ActiveFilterChip[]; clearHref: string; labels: { list: string; clearAll: string } }` |
| `VacancyPagination` | `vacancy-pagination.tsx` | S (async) | `{ state: VacancySearchState; pageCount: number; locale: Locale }` |
| `VacancyEmptyState` | `vacancy-empty-state.tsx` | S (async) | `{ variant: "filtered" \| "none"; locale: Locale; occupation?: OccupationSlug; clearHref: string }` |
| `OccupationIntro` | `occupation-intro.tsx` | S (async) | `{ occupation: OccupationSlug; locale: Locale }` |
| `VacancyRegisterPrompt` | `vacancy-register-prompt.tsx` | S (async) | `{ locale: Locale; headingId: string }` |
| `VacancyHeader` | `vacancy-header.tsx` | S (async) | `{ vacancy: VacancyDetail; locale: Locale; closed?: boolean }` |
| `VacancyActions` | `vacancy-actions.tsx` | S (async) | `{ vacancy: VacancyDetail; locale: Locale; contact: ResolvedVacancyContact }` |
| `VacancyBody` | `vacancy-body.tsx` | S (async) | `{ vacancy: VacancyDetail; locale: Locale }` |
| `VacancyContactCard` | `vacancy-contact-card.tsx` | S (async) | `{ vacancy: VacancyDetail; locale: Locale; contact: ResolvedVacancyContact }` |
| `VacancyShare` | `vacancy-share.tsx` | S (async) | `{ vacancy: VacancyDetail; locale: Locale; url: string }` |
| `CopyLinkButton` | `copy-link-button.tsx` | C | `{ url: string; labels: { copy: string; copied: string; failed: string; linkLabel: string } }` |
| `NativeShareButton` | `native-share-button.tsx` | C | `{ url: string; title: string; text: string; label: string }` |
| `VacancyApplyAside` | `vacancy-apply-aside.tsx` | S (async) | `{ vacancy: VacancyDetail; locale: Locale; contact: ResolvedVacancyContact }` |
| `VacancyClosedNotice` | `vacancy-closed-notice.tsx` | S (async) | `{ vacancy: VacancyDetail; locale: Locale }` |
| `SimilarVacancies` | `similar-vacancies.tsx` | S (async) | `{ number: number; locale: Locale; headingId: string }` |
| `OnlyDutchNotice` | `only-dutch-notice.tsx` | S (async) | `{ locale: Locale }`; rendert `null` bij `nl` |

`ResolvedVacancyContact` staat in `vacancy-format.ts`:

```ts
export type ResolvedVacancyContact = {
  name: string;            // vacancy.contact.name, bijvoorbeeld "Jimmy"; terugval people[0].firstName
  phoneE164: string;       // vacancy.contact.phoneE164; terugval contact.phoneE164 uit lib/site.ts
  phoneDisplay: string;    // displayPhone(phoneE164)
  whatsappE164: string | null;   // vacancy.contact.whatsappE164; terugval contact.phoneE164 (hoofdnummer, B-21)
  photoUrl: string | null;
};
export function resolveVacancyContact(vacancy: VacancyDetail): ResolvedVacancyContact;
```

`resolveVacancyContact()` wordt ook door `ApplySection` (spec 07) gebruikt, zodat actieknoppen, contactkaart en sollicitatieblok dezelfde persoon en hetzelfde nummer tonen.

`Breadcrumbs` (spec 01, `components/sections/breadcrumbs.tsx`) en `ServiceSteps` (`components/service/service-steps.tsx`, props `{ id?; heading; accent?; intro?; steps: StepItem[] }` met `StepItem = { title; body; icon? }` uit `components/service/types.ts`, spec 05) worden hergebruikt. CtaButton (volledige API in spec 02 §4.7) uit `components/ui/cta-button.tsx` is de enige knop met merkstijl. `JsonLd` uit `components/seo/json-ld.tsx`. Het sollicitatieblok is `ApplySection` uit `components/forms/apply-section.tsx` (spec 07); deze module bouwt geen eigen sollicitatieblok.

**Primitives van spec 02**

| Component | Primitive uit `components/ui/*` (spec 02) | Afspraak |
|---|---|---|
| `VacancyCard` | `Card variant="interactive"` met `Badge` | `className="p-5"`; de titellink is de uitgerekte link (`after:absolute after:inset-0`); badges zie §4.7 |
| `VacancyListSkeleton` | `Skeleton` | zelfde afmetingen als de kaart |
| `VacancyFilterSheet` | `Sheet`, `SheetTrigger`, `SheetContent side="right"`, `SheetHeader`, `SheetTitle`, `SheetFooter` | breedte van spec 02; `closeLabel` uit `labels.close` |
| `VacancyFilters` (opties) | `CheckboxField` | rij `min-h-11`, teller `tabular-nums text-muted-foreground`, `disabled` bij `count === 0` (tenzij aangevinkt) |
| `VacancySortSelect` | `Label` en `NativeSelect` | native `<select name="sortering">` |
| `VacancySearchForm` | `Label` en `Input` | `type="search"` |
| `VacancyActiveFilters` | `Chip` met `href` en `removeLabel` | één chip per waarde, plus de link "Wis alle filters" |
| `VacancyPagination` | `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`, `PaginationStatus` | labels uit `vacatures.pagination` |
| `VacancyClosedNotice` | `Alert tone="warning" icon={CircleOff} titleAs="h2" titleId="vacature-gesloten-titel"` | binnen `<section aria-labelledby="vacature-gesloten-titel">`; de h2 is de titel van de `Alert` (spec 02 §4.7); geen `role="region"` |
| `OnlyDutchNotice` | `Alert tone="info" icon={Languages}` | `role="note"` |
| `VacancyFacts` | `Card variant="muted"` | `<dl>` binnen de kaart |

Geen eigen `article`-klassen voor kaarten en geen eigen base-ui `Dialog` voor het filterpaneel; de `Sheet` van spec 02 levert dat.

### 4.7 `VacancyCard` en `VacancyList` in detail

```
<li>                                                   VacancyList: <ul role="list" className="grid gap-4 md:grid-cols-2">
  <Card variant="interactive" className="p-5">            spec 02; focus volgens spec 02 §4.5
    <h3>                                               headingLevel
      <Link href={vacancy.path} aria-label={card.ariaLabel} className="after:absolute after:inset-0">
        {vacancy.title}                                lang="nl" onder /en
      </Link>
    </h3>
    <Badge tone="warning">Spoed</Badge> <Badge tone="brand">Nieuw</Badge>   alleen als er badges zijn, hoogstens 2: Spoed eerst, dan Nieuw
    <dl className="meta">                              per regel een Lucide-icoon (aria-hidden) en een sr-only <dt>
      Plaats         MapPin       {city}
      Uurloon        Euro         {wage}
      Uren           Clock        {hours}
      Werktijden     CalendarDays {shifts}
      Start          CirclePlay   {start}
    </dl>
    <p>{vacancy.summary}</p>                           alleen variant "default", line-clamp-2, lang="nl" onder /en
  </Card>
</li>
```

- De hele kaart is klikbaar via de uitgerekte link; er is maar één link per kaart, dus geen dubbele focusstop.
- `aria-label` van de link is `vacatures.card.ariaLabel`, bijvoorbeeld "Glazenwasser in Den Haag. € 16,08 tot € 17,50 bruto per uur. 32 tot 40 uur per week. Per direct." Badges staan niet in de linknaam maar als tekst in de kaart, zodat ze in de leesvolgorde volgen.
- Badges: `Badge` van spec 02, "Spoed" (tone `warning`) als `isUrgent`, "Nieuw" (tone `brand`) als `isNewVacancy(publishedAt)`. Hoogstens `MAX_BADGES`. Gesloten vacatures krijgen geen badge. "Uitgelicht" is geen badge: `isFeatured` werkt alleen op de sortering (spec 10).
- Focus volgens spec 02 §4.5: `Card variant="interactive"` toont de focusring van de link op de kaart; geen eigen `focus-within:ring-2 ring-ring`.
- De start op de kaart komt uit `startAsap` en `startDate` van `VacancyListItem` (spec 10).
- `headingLevel` is standaard `h3` (B-05: kaarttitels onder een sectie-h2). Op `/vacatures` hangt de lijst onder de sr-only h2 "Gevonden vacatures".
- Iconen uit lucide 0.456 met lijndikte 2; geen beelden op de kaart (B-25).
- `VacancyList` met `items.length === 0` rendert niets; de lege staat is de taak van de aanroeper.

### 4.8 `LatestVacancies` (voor spec 04 en spec 05)

```tsx
<section aria-labelledby={headingId}>
  <h2 id={headingId}>{heading}</h2>
  {intro && <p>{intro}</p>}
  <VacancyList items={items} locale={locale} variant={variant} headingLevel="h3" />
  {viewAll !== false && <Link href={viewAll?.href ?? defaultHref}>{viewAll?.label ?? t("common.cta.viewAllJobs")}</Link>}
</section>
```

- Data: met `occupation` `getVacanciesByOccupation(occupation, { limit })`, anders `getLatestVacancies({ limit })`; `limit` standaard `LATEST_DEFAULT_LIMIT` (3).
- `defaultHref`: met `occupation` `paths.vacaturesVoorBeroep(occupation)`, anders `/vacatures`. De standaardtekst met beroep is `vacatures.latest.viewOccupation` met `{occupation}` in kleine letters.
- Zonder vacatures: `<p>{emptyText ?? t("vacatures.latest.empty")}</p>` en een `CtaButton variant="secondary"` "Schrijf je in" naar `/inschrijven`; de sectie blijft staan, zodat de pagina niet verspringt.
- Fouten worden niet afgevangen. Bij een fout tijdens een ISR-verversing houdt Next de vorige versie; bij de eerste render vangt `error.tsx` van spec 01 de fout op.
- Spec 04 en 05 zetten de component in `<Suspense fallback={<VacancyListSkeleton count={limit} variant={variant} />}>` en kiezen zelf `heading`, `headingId` en `intro` uit hun eigen namespace.

### 4.9 `VacancyFacts`

Een `<section aria-labelledby={headingId}>` met een sr-only h2 (`vacatures.facts.heading`) en een `<dl>` met per rij een icoon, `<dt>` en `<dd>`. Rijen in vaste volgorde; een rij zonder waarde vervalt.

| Rij | `<dt>` (sleutel) | `<dd>` | Variant compact |
|---|---|---|---|
| Plaats | `facts.labels.city` | `locationLabel ?? city`, plus postcode als die er is | ja |
| Uurloon | `facts.labels.wage` | `wage(salaryMin, salaryMax)`; daaronder `salaryNote` in kleine tekst | ja |
| Uren per week | `facts.labels.hours` | `hours(hoursMin, hoursMax)` | ja |
| Soort contract | `facts.labels.contract` | `facts.contract.<contractType>` | ja |
| Werktijden | `facts.labels.shifts` | `shifts(shifts)` | ja |
| Start | `facts.labels.start` | `start(startAsap, startDate)` | nee |
| Rijbewijs en certificaten | `facts.labels.qualifications` | lijst: per vereiste kwalificatie `facts.qualifications.required`, per pré `facts.qualifications.preferred`, per opleiding `facts.qualifications.training`; geen enkele: `facts.qualifications.none` | ja |
| Taal op de werkvloer | `facts.labels.language` | `facts.languageOptions.<workplaceLanguage>` | ja |
| Ervaring | `facts.labels.experience` | `facts.experience.<experienceLevel>`; bij `required` met `experienceMonths` `facts.experience.requiredMonths` | nee |
| Aantal plekken | `facts.labels.positions` | `facts.positions` met `count`, alleen bij `positionsCount >= 2` | nee |
| Vacaturenummer | `facts.labels.number` | het nummer | ja |

Namen van kwalificaties: `facts.qualificationNames.<qualification>`. De rij taal rendert alleen als `workplaceLanguage` gevuld is; de pagina geeft `vacancy.workplaceLanguage` door (type `WorkplaceLanguage` uit `lib/data/options.ts`, spec 10). De minimumleeftijd staat niet in het kenmerkenblok maar als laatste punt onder "Wat je meebrengt" (§4.10), omdat de reden erbij hoort (B-32).

Opmaak: `Card variant="muted"` van spec 02; op een telefoon één kolom met labels links (ongeveer 40 procent breedte), vanaf `sm` twee kolommen.

### 4.10 Overige onderdelen van de vacaturepagina

- **`VacancyHeader`**: h1 `vacatures.detail.heading` ("Glazenwasser in Den Haag", `id="vacature-titel"`). Daaronder één regel met `detail.number` en `detail.postedOn` met `formatDate(publishedAt)`. Badges zoals op de kaart, niet bij een gesloten vacature.
- **`VacancyActions`**: `CtaButton href="#solliciteren"` met `common.cta.apply`; daarnaast `CtaButton variant="secondary" external newTabLabel={t("common.opensInNewTab")}` met `common.cta.whatsappPerson` naar `whatsappLink(t("common.whatsapp.vacatureSolliciteren", { title, number }), { display, e164: contact.whatsappE164 })` (alleen als `allowWhatsappApply` waar is en er een WhatsApp-nummer is); en een `tel:`-link `common.cta.callPerson` met `aria-label` `common.a11y.callPerson`. Op een telefoon staan de drie onder elkaar op volle breedte, vanaf `sm` naast elkaar.
- **Lead**: `vacancy.intro` als `<p>` met grotere tekst.
- **Beeld**: alleen als `vacancy.imageUrl` bestaat: `next/image` met `sizes="(min-width: 1024px) 66vw, 100vw"`, verhouding 16 bij 9, `alt` `detail.imageAlt`. Er zijn bij de lancering geen foto's (B-25); zonder beeld is er geen lege ruimte.
- **`VacancyBody`**: vier secties, elk `<section aria-labelledby>` met een h2; de lijsten en `extra` staan per sectie in een `div` met `prose-groos` (spec 02):
  1. `detail.sections.tasks` met `vacancy.tasks` als `<ul>`.
  2. `detail.sections.requirements` met `vacancy.requirements` als `<ul>`; als `minAge18` waar is komt als laatste punt `detail.minAge.<minAgeReason>` (B-32).
  3. `detail.sections.offer` met `vacancy.offer` als `<ul>`; als `salaryNote` gevuld is komt die als laatste punt.
  4. `detail.sections.extra` met `vacancy.extra`, alleen als die gevuld is; alinea's gesplitst op een lege regel.
- **Zo solliciteer je**: `ServiceSteps` met `id="zo-solliciteer-je"`, `heading` `detail.sections.howTo` en de drie stappen uit `detail.howTo.steps` (iconen `Send`, `Phone`, `CalendarCheck`). Er staat geen reactietermijn in (claim `responseTime` is niet bevestigd, spec 03).
- **Sollicitatieblok**: bij `state === "open"` rendert de pagina `<ApplySection vacancy={vacancy} locale={locale} />` uit `components/forms/apply-section.tsx` (spec 07). Die levert `<section id="solliciteren">`, de h2 (`forms.apply.title` plus `forms.apply.accent`), de intro, `ApplyForm` en `ContactAside` met WhatsApp en bellen (B-17: gelijkwaardige routes) en de privacyregel boven de verzendknop. Tot bouwstap 6 staat daar `<section id="solliciteren"><p>TODO formulier uit spec 07</p></section>`.
- **`VacancyContactCard`**: h2 `detail.sections.contact`, foto als `photoUrl` bestaat (`next/image`, 64 bij 64, `alt` met de naam), anders een cirkel met de eerste letter (`aria-hidden`), de naam, `detail.contact.body` en twee knoppen: bellen en `common.cta.whatsappPerson` met `common.whatsapp.vacatureVraag`. De rol uit `common.people.<id>.role` toont deze kaart niet, omdat `VacancyContact` geen `PersonId` kent en de rollen nog `TODO` zijn.
- **`VacancyShare`**: h2 `detail.sections.share` en drie knoppen naast elkaar: een link `detail.share.whatsapp` naar `https://wa.me/?text=<encodeURIComponent(detail.share.whatsappText)>` (geen nummer, de gebruiker kiest zelf een contact), `CopyLinkButton` en `NativeShareButton`. `CopyLinkButton` gebruikt `navigator.clipboard.writeText(url)`; na succes 2 seconden `detail.share.copied` met `role="status"`; bij een fout `detail.share.failed` en een geselecteerd alleen-lezen invoerveld met de URL. `NativeShareButton` rendert alleen als `navigator.share` bestaat (na hydratatie, dus eerst `null`). De `url` is `absoluteUrl(localizedPath(locale, vacancy.path))`. Geen externe scripts of iframes (AC-09-05).
- **`VacancyApplyAside`** (lg en breder, `sticky top-20`): h2 `detail.aside.heading`, uurloon, uren en start in grote tekst, `CtaButton` naar `#solliciteren` en de WhatsApp-link als `CtaButton variant="secondary" external newTabLabel={t("common.opensInNewTab")}` met `common.whatsapp.vacatureSolliciteren` (zelfde voorwaarde als in `VacancyActions`). Dit is de vaste sollicitatiebalk op desktop.
- **`SimilarVacancies`**: `getSimilarVacancies(number, { limit: SIMILAR_LIMIT, fill: true })`; h2 `detail.similar.title`, `VacancyList` met `headingLevel="h3"` en een link `common.cta.viewAllJobs` naar `/vacatures`. Zonder resultaten rendert hij niets.
- **`VacancyClosedNotice`**: `<section aria-labelledby="vacature-gesloten-titel">` met daarin `<Alert tone="warning" icon={CircleOff} titleAs="h2" titleId="vacature-gesloten-titel" title={t("detail.closed.filled.title")}>` van spec 02 (§4.7); geen `role="region"`, omdat `section` met `aria-labelledby` al een regio is. De titel van de `Alert` is de h2 `detail.closed.filled.title` (bij `closeReason === "filled"`) of `detail.closed.other.title` (overige redenen), daaronder de bijbehorende `body` en `detail.closed.closedOn` met `formatDate(closedAt)`. De melding heeft altijd tekst en icoon, nooit alleen kleur (WCAG 1.4.1).
- **`OnlyDutchNotice`**: `Alert tone="info" icon={Languages} role="note"` van spec 02 met `vacatures.detail.onlyDutch`, plus de belknop met het hoofdnummer. Alleen bij `locale === "en"`.

**Taal op `/en`.** Alles wat uit de database komt, staat in een element met `lang="nl"`: de h1, de lead, de lijsten, `extra`, `salaryNote` en op kaarten de titel en de samenvatting. Labels, knoppen, kenmerkwaarden die uit messages komen (contract, werktijden, start) en de beroepsnamen (`beroepen.<id>.enkelvoud`) zijn Engels. Plaatsnamen blijven zoals ze zijn, behalve Den Haag, dat "The Hague" wordt (spec 03 §6.18). `ApplyForm` krijgt de Engelse labels uit `forms` (spec 07).

## 5 Data

### 5.1 Leesfuncties (spec 10, ongewijzigd gebruikt)

| Functie | Gebruikt in |
|---|---|
| `getVacancyList({ filters, sort, page, pageSize })` | `/vacatures` |
| `getVacancyFacets(filters)` | `/vacatures` |
| `getVacancyByNumber(number)` | `/vacatures/[slug]` (pagina, `generateMetadata`), OG-afbeelding (spec 12) |
| `getSimilarVacancies(number, { limit, fill })` | `SimilarVacancies` |
| `getLatestVacancies({ limit, occupation })` | `LatestVacancies` zonder beroep |
| `getVacanciesByOccupation(slug, { limit })` | `LatestVacancies` met beroep |
| `listOpenVacancyParams()` | `generateStaticParams` |
| `parseVacancySearchParams(sp)`, `buildVacancySearchParams(state)`, `parseVacancySlug(slug)` | beide pagina's en alle formulieren |

Typen uit `lib/data/types.ts`: `VacancyListItem`, `VacancyDetail`, `VacancyContact`, `VacancyFilters`, `VacancySort`, `VacancyListResult`, `VacancyFacets`, `VacancySearchState` (uit `vacancy-search-params.ts`). Constanten uit `lib/data/options.ts`: `OCCUPATION_SLUGS`, `SHIFTS`, `HOURS_BUCKETS`, `QUALIFICATIONS`, `MIN_AGE_REASONS`, `CONTRACT_TYPES`, `CLOSED_VISIBLE_DAYS`, `VACANCY_SORTS`. Deze module leest nooit rechtstreeks uit Supabase en maakt geen eigen client.

Filtergedrag (uit spec 10, hier herhaald omdat de UI erop leunt): OF binnen een groep, EN tussen groepen; onbekende waarden negeert de parser; de teller per waarde negeert de eigen groep; `pagina` kleiner dan 1 wordt 1; `outOfRange` is waar als `page > pageCount` en `pageCount > 0`. Op `?pagina=2` zonder vacatures (`pageCount === 0`) is `outOfRange` onwaar; de pagina toont dan de lege staat. Bij `outOfRange` roept de pagina `notFound()` aan vóór elke `Suspense`-grens: status 404 en `noindex`, de inhoud van de 404 verschijnt in de browser (B-55).

Sortering in de UI: `sortering=nieuwste` (standaard, eerst `isFeatured`, dan nieuwste) en `sortering=salaris` (hoogste `salaryMax` eerst). De parser kent ook `sluitdatum`; die waarde werkt in de URL, maar staat niet in de keuzelijst (de `<select>` toont dan "Nieuwste eerst").

### 5.2 Wat deze module van spec 10 extra nodig heeft

| Behoefte | Waarom | Levering door spec 10 | Als het veld leeg is |
|---|---|---|---|
| Taal op de werkvloer per vacature | Kenmerkenblok (opdracht, context/13 §3.7) | Migratie `20261003090000_kruiscontrole_1.sql`: enum `workplace_language` (`nl`, `en`, `nl_or_en`) en kolom `vacancies.workplace_language` (nullable), in de view en in `VacancyDetail` als `workplaceLanguage: WorkplaceLanguage \| null`; `WorkplaceLanguage` komt uit `lib/data/options.ts`. Spec 08 voegt het veld toe aan het formulier. De pagina geeft `vacancy.workplaceLanguage` door aan `VacancyFacts`. | De rij rendert niet; een taaleis staat dan als tekst onder "Wat je meebrengt" (VR-03) |

`startAsap` en `startDate` in `VacancyListItem` levert spec 10; deze module voegt daarvoor niets toe aan `lib/data/*`.

### 5.3 Afleidingen in deze module

| Waarde | Regel |
|---|---|
| Badge Nieuw | `now - publishedAt < NEW_BADGE_DAYS` dagen, berekend bij het renderen (ISR, dus hoogstens een uur afwijking) |
| Badge Spoed | `isUrgent` |
| Gesloten | `vacancy.state === "closed"` |
| Sluitreden-tekst | `closeReason === "filled"` geeft de variant `filled`, `expired`, `withdrawn` en `other` geven `other` |
| Contactpersoon | `resolveVacancyContact()` (§4.6) |
| WhatsApp-sollicitatie zichtbaar | `state === "open" && allowWhatsappApply && contact.whatsappE164 !== null` |
| Beroepsintro | `state.filters.beroep?.length === 1` |
| Lege staat | `list.total === 0`: variant `filtered` als `state.isFiltered` waar is (ook bij alleen een zoekterm), anders `none` |
| Aantal actieve filters | aantal waarden in `beroep`, `plaats`, `uren`, `dienst`, plus 1 als `q` gevuld is |

### 5.4 Sollicitatieblok (eigendom spec 07)

Deze spec rendert alleen bij `state === "open"`:

```tsx
<ApplySection vacancy={vacancy} locale={locale} />
```

`ApplySection` bouwt daaruit de prop van `ApplyForm` volgens spec 07: `ApplyFormVacancy = { number; title; occupationSlug; asksDrivingLicenseB }`. De Server Action zoekt de vacature opnieuw op nummer en controleert of hij open is; de vacature-id gaat dus niet door de browser.

### 5.5 Validatie van invoer

Er is geen eigen zod-schema: de enige invoer op deze pagina's zijn queryparameters, en `parseVacancySearchParams` (spec 10) normaliseert ze (`q` hoogstens 80 tekens, onbekende waarden weg). Het zoekveld heeft `maxLength={80}`. De slug wordt alleen via `parseVacancySlug` gelezen.

## 6 Tekstelementen

Toon en aanspreekvorm volgen spec 03: je-vorm op `/vacatures` en `/vacatures/[slug]`, B1, alinea's van twee zinnen, geen uitroeptekens, geen streepjes in zinnen. De namespace `vacatures` is van deze spec (00 §4.4a) en staat in `CLIENT_NAMESPACES` (spec 01), maar clientcomponenten krijgen hun tekst bij voorkeur als props. Gebruikte sleutels van andere eigenaars: `header.nav.vacatures` (01, kruimelpad), `beroepen.<id>.enkelvoud` (05), `common.cta.{apply, register, viewAllJobs, callPerson, whatsappPerson}`, `common.whatsapp.{vacatureSolliciteren, vacatureVraag}`, `common.a11y.callPerson`, `common.opensInNewTab`, `common.loading`, `common.format.{wagePerHour, wageRange, hoursPerWeek, hoursRange}` (03) en `forms.*` (07).

Niets komt van Wilk: de secties heten niet "Wat ga je doen?", "Wat vragen wij?", "Wat bieden wij?" of "Interesse?", het paneel heet niet "Filter vacatures" en er is geen knop "Reset filters" (context/04, R-08). Er staan geen claims in die spec 03 als onbevestigd markeert: geen reactietermijn, weekloon, 24/7, cao of keurmerk.

### 6.1 Sleutelboom NL (inhoud van `messages/nl/vacatures.json`, getoond onder de sleutel `vacatures`; het bestand zelf heeft die sleutel niet, B-47)

```json
{
  "vacatures": {
    "meta": {
      "title": "Vacatures in Den Haag en omgeving",
      "description": "Bekijk de open vacatures van Groos in Den Haag en omgeving, met uurloon en werktijden. Je solliciteert in een paar minuten, ook zonder cv.",
      "titlePaged": "Vacatures in Den Haag en omgeving, pagina {page}",
      "descriptionPaged": "Pagina {page} van de open vacatures van Groos in Den Haag en omgeving, met uurloon en werktijden. Je solliciteert in een paar minuten, ook zonder cv.",
      "detailTitle": "{title} in {city}",
      "detailDescription": "{title} in {city} voor {hours}, {wage}. {start} Solliciteer bij Groos, ook zonder cv.",
      "detailDescriptionShort": "{title} in {city} voor {hours}, {wage}. Solliciteer bij Groos, ook zonder cv.",
      "startAsapSentence": "Je kunt direct beginnen.",
      "startDateSentence": "Je begint vanaf {date}.",
      "closedTitleFilled": "{title} in {city} (vervuld)",
      "closedTitleOther": "{title} in {city} (gesloten)",
      "closedDescriptionFilled": "Deze vacature is vervuld. Bekijk vergelijkbaar werk als {occupation} of schrijf je in bij Groos.",
      "closedDescriptionOther": "Deze vacature staat niet meer open. Bekijk vergelijkbaar werk als {occupation} of schrijf je in bij Groos.",
      "ogAlt": "Vacature {title} in {city} bij Groos Personeelsdiensten, met uren en bruto uurloon"
    },
    "og": {
      "label": "Vacature",
      "closed": "Deze vacature is gesloten"
    },
    "overview": {
      "title": "Vacatures in Den Haag en omgeving",
      "intro": "Hier vind je het werk dat wij nu hebben voor glazenwassers, schoonmakers, logistiek medewerkers, verhuizers en hulpkrachten in de bouw en sloop. Bij elke vacature zie je meteen het bruto uurloon, de uren en de werktijden.",
      "resultsHeading": "Gevonden vacatures",
      "resultCount": "{count, plural, =0 {Geen vacatures gevonden} one {# vacature gevonden} other {# vacatures gevonden}}",
      "resultCountQuery": "{count, plural, =0 {Geen vacatures gevonden voor “{query}”} one {# vacature gevonden voor “{query}”} other {# vacatures gevonden voor “{query}”}}",
      "pageStatus": "Pagina {page} van {pageCount}",
      "updating": "De lijst wordt bijgewerkt"
    },
    "search": {
      "form": "Vacatures zoeken",
      "label": "Zoek op functie of plaats",
      "placeholder": "Bijvoorbeeld schoonmaker of Rijswijk",
      "submit": "Zoeken"
    },
    "filters": {
      "heading": "Filters",
      "open": "Filters",
      "openWithCount": "Filters ({count})",
      "sheetTitle": "Filters",
      "close": "Sluiten",
      "showResults": "{count, plural, =0 {Geen vacatures} one {Toon # vacature} other {Toon # vacatures}}",
      "apply": "Filters toepassen",
      "clearAll": "Wis alle filters",
      "activeList": "Actieve filters",
      "removeChip": "Verwijder filter {label}",
      "queryChip": "Zoekterm: {query}",
      "optionCount": "{count, plural, =0 {geen vacatures} one {# vacature} other {# vacatures}}",
      "beroep": { "legend": "Beroep" },
      "plaats": { "legend": "Plaats", "more": "Toon alle plaatsen" },
      "uren": {
        "legend": "Uren per week",
        "options": { "tot-20": "Tot en met 20 uur", "20-32": "21 tot en met 31 uur", "32-plus": "32 uur of meer" }
      },
      "dienst": {
        "legend": "Werktijden",
        "options": { "vroeg": "Vroege dienst", "dag": "Dagdienst", "avond": "Avonddienst", "nacht": "Nachtdienst", "weekend": "Weekend" }
      }
    },
    "sort": {
      "label": "Sorteren",
      "apply": "Sorteren",
      "options": { "nieuwste": "Nieuwste eerst", "salaris": "Hoogste uurloon" }
    },
    "pagination": {
      "label": "Pagina's met vacatures",
      "previous": "Vorige pagina",
      "next": "Volgende pagina",
      "page": "Pagina {page}"
    },
    "empty": {
      "filtered": {
        "title": "Geen vacatures met deze filters",
        "body": "Met deze zoekterm of filters vinden wij nu geen werk. Wis een filter of schrijf je in, dan bellen wij je zodra er iets past."
      },
      "none": {
        "title": "Er staan nu geen vacatures online",
        "body": "Op dit moment hebben wij geen open vacatures op de site. Schrijf je in, dan bellen wij je zodra er werk is dat bij je past."
      },
      "occupationLink": "Lees over werken als {occupation}",
      "occupationsLabel": "Werk per beroep"
    },
    "registerPrompt": {
      "title": "Schrijf je in voor nieuw werk",
      "body": "Je hoeft niet te wachten op de juiste vacature. Schrijf je in en vertel welk werk je zoekt, dan bellen wij je zodra er iets past."
    },
    "beroepIntro": {
      "heading": "Werken als {occupation}",
      "link": "Alles over werken als {occupation}",
      "items": {
        "glazenwasser": {
          "paragraphs": [
            "Als glazenwasser maak je ramen, kozijnen en gevels van kantoren en winkels schoon. Je werkt meestal overdag en begint vaak al om 07.00 uur.",
            "Werk je op hoogte, dan is de minimumleeftijd 18 jaar. Bij elke vacature staat welk rijbewijs of certificaat je nodig hebt."
          ]
        },
        "schoonmaker": {
          "paragraphs": [
            "Als schoonmaker houd je kantoren, scholen of woningen schoon en netjes. Veel werk is vroeg in de ochtend of in de avond, na kantoortijd.",
            "Er is werk voor een paar uur per week en voor bijna een volle week. Bij elke vacature zie je de uren en werktijden meteen staan."
          ]
        },
        "logistiek-medewerker": {
          "paragraphs": [
            "Als logistiek medewerker verzamel je bestellingen, laad je vrachtwagens en houd je het magazijn op orde. Je werkt vaak in vroege of late diensten, soms ook op zaterdag.",
            "Heb je een certificaat voor heftruck, reachtruck of EPT, dan heb je meer keus. Bij elke vacature staat of je dat nodig hebt."
          ]
        },
        "verhuizer": {
          "paragraphs": [
            "Als verhuizer pak je inboedels in, draag je meubels en zet je alles op het nieuwe adres weer neer. Je werkt in een ploeg en begint meestal vroeg.",
            "Het meeste werk is aan het begin en het eind van de maand. Met rijbewijs B kun je ook de verhuisbus rijden."
          ]
        },
        "hulpkracht-bouw-en-sloop": {
          "paragraphs": [
            "Als hulpkracht in de bouw en sloop help je vakmensen op de bouwplaats. Je ruimt op, voert afval af en zorgt dat het materiaal klaarstaat.",
            "Op een bouw- of sloopplaats is de minimumleeftijd 18 jaar. Vraagt de opdrachtgever een VCA-diploma, dan staat dat bij de vacature."
          ]
        }
      }
    },
    "card": {
      "ariaLabel": "{title} in {city}. {wage}. {hours}. {start}.",
      "cityLabel": "Plaats",
      "wageLabel": "Uurloon",
      "hoursLabel": "Uren",
      "shiftsLabel": "Werktijden",
      "startLabel": "Start",
      "startAsap": "Per direct",
      "startFrom": "Vanaf {date}",
      "badges": { "new": "Nieuw", "urgent": "Spoed" }
    },
    "latest": {
      "empty": "Er staan nu geen vacatures online. Schrijf je in, dan bellen wij je zodra er werk is.",
      "viewOccupation": "Bekijk alle vacatures als {occupation}"
    },
    "facts": {
      "heading": "Kenmerken van deze vacature",
      "labels": {
        "city": "Plaats",
        "wage": "Uurloon",
        "hours": "Uren per week",
        "contract": "Soort contract",
        "shifts": "Werktijden",
        "start": "Start",
        "qualifications": "Rijbewijs en certificaten",
        "language": "Taal op de werkvloer",
        "experience": "Ervaring",
        "positions": "Aantal plekken",
        "number": "Vacaturenummer"
      },
      "contract": {
        "temp_agency": "Uitzenden via Groos",
        "secondment": "Detachering via Groos",
        "recruitment": "In dienst bij de opdrachtgever"
      },
      "shiftsNone": "In overleg",
      "qualifications": {
        "required": "{name} nodig",
        "preferred": "{name} is een pluspunt",
        "training": "{name}: wij regelen de opleiding",
        "none": "Geen rijbewijs of certificaat nodig"
      },
      "qualificationNames": {
        "vca_basis": "VCA Basis",
        "vca_vol": "VCA VOL",
        "heftruck": "Heftruckcertificaat",
        "reachtruck": "Reachtruckcertificaat",
        "ept": "EPT-certificaat",
        "ipaf": "IPAF (hoogwerker)",
        "vog": "VOG",
        "rijbewijs_b": "Rijbewijs B",
        "rijbewijs_be": "Rijbewijs BE",
        "rijbewijs_c": "Rijbewijs C",
        "code_95": "Code 95",
        "ras": "RAS-vakopleiding"
      },
      "experience": {
        "none": "Geen ervaring nodig",
        "nice_to_have": "Ervaring is mooi meegenomen",
        "required": "Ervaring nodig",
        "requiredMonths": "{months, plural, one {# maand ervaring nodig} other {# maanden ervaring nodig}}"
      },
      "languageOptions": {
        "nl": "Nederlands",
        "en": "Engels",
        "nl_or_en": "Nederlands of Engels"
      },
      "positions": "{count, plural, one {# plek} other {# plekken}}"
    },
    "detail": {
      "heading": "{title} in {city}",
      "number": "Vacature {number}",
      "postedOn": "Geplaatst op {date}",
      "imageAlt": "{title} in {city}",
      "actionsLabel": "Solliciteren of contact opnemen",
      "onlyDutch": "Deze vacature is alleen in het Nederlands beschikbaar. Heb je vragen, bel of app ons gerust.",
      "sections": {
        "tasks": "Je werkdag",
        "requirements": "Wat je meebrengt",
        "offer": "Wat je van ons krijgt",
        "extra": "Meer over dit werk",
        "howTo": "Zo solliciteer je",
        "contact": "Vragen over deze vacature",
        "share": "Deel deze vacature"
      },
      "howTo": {
        "steps": [
          { "title": "Je solliciteert", "body": "Je vult het formulier in, stuurt een WhatsApp-bericht of belt ons. Een cv is niet nodig." },
          { "title": "Wij bellen je", "body": "Wij bellen je om kennis te maken en je vragen te beantwoorden. Samen kijken wij of het werk bij je past." },
          { "title": "Je begint", "body": "Past het werk, dan spreken wij samen je eerste werkdag af. Je hoort van ons waar en hoe laat je begint." }
        ]
      },
      "contact": {
        "body": "{name} is je contactpersoon voor deze vacature. Bel of app gerust, ook als je twijfelt of het werk bij je past."
      },
      "share": {
        "whatsapp": "Deel via WhatsApp",
        "whatsappText": "Bekijk deze vacature van Groos: {title} in {city}. {url}",
        "copy": "Kopieer link",
        "copied": "Link gekopieerd",
        "failed": "Kopiëren lukte niet. Selecteer de link en kopieer hem zelf.",
        "linkLabel": "Link naar deze vacature",
        "native": "Delen"
      },
      "aside": {
        "heading": "In het kort"
      },
      "minAge": {
        "work_at_height": "Omdat je op hoogte werkt, is de minimumleeftijd 18 jaar.",
        "construction_demolition": "Omdat je op een bouw- of sloopplaats werkt, is de minimumleeftijd 18 jaar.",
        "forklift": "Omdat je met een heftruck of reachtruck rijdt, is de minimumleeftijd 18 jaar.",
        "night_work": "Omdat je ook 's nachts werkt, is de minimumleeftijd 18 jaar.",
        "hazardous_substances": "Omdat je met gevaarlijke stoffen werkt, is de minimumleeftijd 18 jaar."
      },
      "closed": {
        "filled": {
          "title": "Deze vacature is vervuld",
          "body": "Wij hebben voor dit werk iemand gevonden. Hieronder staat vergelijkbaar werk waarop je wel kunt solliciteren."
        },
        "other": {
          "title": "Deze vacature staat niet meer open",
          "body": "Op deze vacature kun je niet meer solliciteren. Hieronder staat vergelijkbaar werk dat nu wel openstaat."
        },
        "closedOn": "Gesloten op {date}",
        "occupationLink": "Bekijk al het werk als {occupation}"
      },
      "similar": {
        "title": "Vergelijkbare vacatures"
      },
      "occupationPageLink": "Lees meer over werken als {occupation}"
    }
  }
}
```

Toelichting:

- `detailDescription` bevat `{start}` als hele zin (`startAsapSentence` of `startDateSentence`); de zin wordt in code ingevoegd, niet in losse stukken opgebouwd (spec 03 regel 8).
- `{occupation}` krijgt het enkelvoud uit `beroepen.<id>.enkelvoud` in kleine letters (spec 03 §6.17), ook in `detail.occupationPageLink`.
- `vacatures.meta` bevat precies de sleutels die `VacancyMetaKey` van spec 12 noemt; `vacatures.og.label` en `vacatures.og.closed` gebruikt de OG-route van spec 12. Het sollicitatieblok heeft geen sleutels in `vacatures`: de kop en de intro komen uit `forms.apply` (spec 07).
- De `onlyDutch`-waarde in NL wordt nooit getoond, maar moet bestaan voor de spiegeling.
- `facts.contract.secondment` bevat het woord "Detachering". `npm run check:claims` (spec 09, CL-18) meldt dat als treffer; dat is bedoeld, omdat de waarde alleen verschijnt als Jimmy in `/beheer` dat contract kiest, en spec 08 die keuze pas aanbiedt na de claim `serviceForms`.
- `facts.qualifications.training` belooft alleen wat per vacature in `training_offered` is aangevinkt (VR-12). De regel verschijnt alleen als spec 08 het veld aanbiedt, dus na bevestiging van de claim `certificateSupport` (CL-11).

### 6.2 Sleutelboom EN (inhoud van `messages/en/vacatures.json`, getoond onder de sleutel `vacatures`; het bestand zelf heeft die sleutel niet, B-47)

Zelfde sleutels, soorten en arraylengtes; Brits Engels, zinshoofdletters, geen samentrekkingen (spec 03 §6.18).

```json
{
  "vacatures": {
    "meta": {
      "title": "Jobs in The Hague and surroundings",
      "description": "See the open jobs at Groos in The Hague and the surrounding area, with hourly wage and working hours. You can apply in a few minutes, no CV needed.",
      "titlePaged": "Jobs in The Hague and surroundings, page {page}",
      "descriptionPaged": "Page {page} of the open jobs at Groos in The Hague and the surrounding area, with hourly wage and working hours. You can apply in a few minutes, no CV needed.",
      "detailTitle": "{title} in {city}",
      "detailDescription": "{title} in {city} for {hours}, {wage}. {start} Apply at Groos, no CV needed.",
      "detailDescriptionShort": "{title} in {city} for {hours}, {wage}. Apply at Groos, no CV needed.",
      "startAsapSentence": "You can start straight away.",
      "startDateSentence": "You start from {date}.",
      "closedTitleFilled": "{title} in {city} (filled)",
      "closedTitleOther": "{title} in {city} (closed)",
      "closedDescriptionFilled": "This job has been filled. See similar work as a {occupation} or register with Groos.",
      "closedDescriptionOther": "This job is no longer open. See similar work as a {occupation} or register with Groos.",
      "ogAlt": "Job {title} in {city} at Groos Personeelsdiensten, with hours and gross hourly wage"
    },
    "og": {
      "label": "Job",
      "closed": "This job is closed"
    },
    "overview": {
      "title": "Jobs in The Hague and surroundings",
      "intro": "Here you find the work we have right now for window cleaners, cleaners, logistics workers, movers and construction and demolition labourers. Every job shows the gross hourly wage, the hours and the working times straight away.",
      "resultsHeading": "Jobs found",
      "resultCount": "{count, plural, =0 {No jobs found} one {# job found} other {# jobs found}}",
      "resultCountQuery": "{count, plural, =0 {No jobs found for “{query}”} one {# job found for “{query}”} other {# jobs found for “{query}”}}",
      "pageStatus": "Page {page} of {pageCount}",
      "updating": "The list is being updated"
    },
    "search": {
      "form": "Search jobs",
      "label": "Search by job or place",
      "placeholder": "For example cleaner or Rijswijk",
      "submit": "Search"
    },
    "filters": {
      "heading": "Filters",
      "open": "Filters",
      "openWithCount": "Filters ({count})",
      "sheetTitle": "Filters",
      "close": "Close",
      "showResults": "{count, plural, =0 {No jobs} one {Show # job} other {Show # jobs}}",
      "apply": "Apply filters",
      "clearAll": "Clear all filters",
      "activeList": "Active filters",
      "removeChip": "Remove filter {label}",
      "queryChip": "Search term: {query}",
      "optionCount": "{count, plural, =0 {no jobs} one {# job} other {# jobs}}",
      "beroep": { "legend": "Occupation" },
      "plaats": { "legend": "Place", "more": "Show all places" },
      "uren": {
        "legend": "Hours per week",
        "options": { "tot-20": "Up to 20 hours", "20-32": "21 to 31 hours", "32-plus": "32 hours or more" }
      },
      "dienst": {
        "legend": "Working times",
        "options": { "vroeg": "Early shift", "dag": "Day shift", "avond": "Evening shift", "nacht": "Night shift", "weekend": "Weekend" }
      }
    },
    "sort": {
      "label": "Sort",
      "apply": "Sort",
      "options": { "nieuwste": "Newest first", "salaris": "Highest hourly wage" }
    },
    "pagination": {
      "label": "Pages of jobs",
      "previous": "Previous page",
      "next": "Next page",
      "page": "Page {page}"
    },
    "empty": {
      "filtered": {
        "title": "No jobs with these filters",
        "body": "We have no work right now that matches this search or these filters. Remove a filter or register, and we will call you as soon as something fits."
      },
      "none": {
        "title": "There are no jobs online right now",
        "body": "At the moment we have no open jobs on the site. Register with us, and we will call you as soon as there is work that suits you."
      },
      "occupationLink": "Read about working as a {occupation}",
      "occupationsLabel": "Work by occupation"
    },
    "registerPrompt": {
      "title": "Register for new work",
      "body": "You do not have to wait for the right job. Register and tell us what work you are looking for, and we will call you as soon as something fits."
    },
    "beroepIntro": {
      "heading": "Working as a {occupation}",
      "link": "All about working as a {occupation}",
      "items": {
        "glazenwasser": {
          "paragraphs": [
            "As a window cleaner you clean windows, frames and facades of offices and shops. You usually work during the day and often start at 07:00.",
            "If you work at height, the minimum age is 18. Every job shows which driving licence or certificate you need."
          ]
        },
        "schoonmaker": {
          "paragraphs": [
            "As a cleaner you keep offices, schools or homes clean and tidy. A lot of the work is early in the morning or in the evening, after office hours.",
            "There is work for a few hours a week and for almost a full week. Every job shows the hours and working times straight away."
          ]
        },
        "logistiek-medewerker": {
          "paragraphs": [
            "As a logistics worker you pick orders, load lorries and keep the warehouse in order. You often work early or late shifts, sometimes on Saturdays too.",
            "With a certificate for a forklift, reach truck or pallet truck you have more choice. Every job shows whether you need one."
          ]
        },
        "verhuizer": {
          "paragraphs": [
            "As a mover you pack belongings, carry furniture and set everything up again at the new address. You work in a team and usually start early.",
            "Most of the work is at the start and the end of the month. With a category B driving licence you can also drive the removal van."
          ]
        },
        "hulpkracht-bouw-en-sloop": {
          "paragraphs": [
            "As a construction and demolition labourer you support skilled workers on site. You clear up, remove waste and make sure materials are ready.",
            "On a construction or demolition site the minimum age is 18. If the client asks for a VCA safety certificate, the job says so."
          ]
        }
      }
    },
    "card": {
      "ariaLabel": "{title} in {city}. {wage}. {hours}. {start}.",
      "cityLabel": "Place",
      "wageLabel": "Hourly wage",
      "hoursLabel": "Hours",
      "shiftsLabel": "Working times",
      "startLabel": "Start",
      "startAsap": "Immediately",
      "startFrom": "From {date}",
      "badges": { "new": "New", "urgent": "Urgent" }
    },
    "latest": {
      "empty": "There are no jobs online right now. Register with us, and we will call you as soon as there is work.",
      "viewOccupation": "See all jobs as a {occupation}"
    },
    "facts": {
      "heading": "Key facts about this job",
      "labels": {
        "city": "Place",
        "wage": "Hourly wage",
        "hours": "Hours per week",
        "contract": "Type of contract",
        "shifts": "Working times",
        "start": "Start",
        "qualifications": "Driving licence and certificates",
        "language": "Language at work",
        "experience": "Experience",
        "positions": "Number of places",
        "number": "Job number"
      },
      "contract": {
        "temp_agency": "Agency work through Groos",
        "secondment": "Secondment through Groos",
        "recruitment": "Employed by the client"
      },
      "shiftsNone": "By arrangement",
      "qualifications": {
        "required": "{name} required",
        "preferred": "{name} is a plus",
        "training": "{name}: we arrange the training",
        "none": "No driving licence or certificate needed"
      },
      "qualificationNames": {
        "vca_basis": "VCA Basic safety certificate",
        "vca_vol": "VCA Full safety certificate",
        "heftruck": "Forklift certificate",
        "reachtruck": "Reach truck certificate",
        "ept": "Electric pallet truck certificate",
        "ipaf": "IPAF (aerial work platform)",
        "vog": "Certificate of conduct (VOG)",
        "rijbewijs_b": "Driving licence category B",
        "rijbewijs_be": "Driving licence category BE",
        "rijbewijs_c": "Driving licence category C",
        "code_95": "Code 95",
        "ras": "RAS vocational training"
      },
      "experience": {
        "none": "No experience needed",
        "nice_to_have": "Experience is welcome",
        "required": "Experience required",
        "requiredMonths": "{months, plural, one {# month of experience required} other {# months of experience required}}"
      },
      "languageOptions": {
        "nl": "Dutch",
        "en": "English",
        "nl_or_en": "Dutch or English"
      },
      "positions": "{count, plural, one {# place} other {# places}}"
    },
    "detail": {
      "heading": "{title} in {city}",
      "number": "Job {number}",
      "postedOn": "Posted on {date}",
      "imageAlt": "{title} in {city}",
      "actionsLabel": "Apply or get in touch",
      "onlyDutch": "This job is only available in Dutch. If you have a question, call or message us and we will help you in English.",
      "sections": {
        "tasks": "Your working day",
        "requirements": "What you bring",
        "offer": "What you get from us",
        "extra": "More about this work",
        "howTo": "How to apply",
        "contact": "Questions about this job",
        "share": "Share this job"
      },
      "howTo": {
        "steps": [
          { "title": "You apply", "body": "You fill in the form, send a WhatsApp message or call us. You do not need a CV." },
          { "title": "We call you", "body": "We call you to get to know you and answer your questions. Together we see whether the work suits you." },
          { "title": "You start", "body": "If the work suits you, we agree your first working day together. We tell you where and what time you start." }
        ]
      },
      "contact": {
        "body": "{name} is your contact person for this job. Feel free to call or message, also if you are not sure the work suits you."
      },
      "share": {
        "whatsapp": "Share on WhatsApp",
        "whatsappText": "Take a look at this job at Groos: {title} in {city}. {url}",
        "copy": "Copy link",
        "copied": "Link copied",
        "failed": "Copying did not work. Select the link and copy it yourself.",
        "linkLabel": "Link to this job",
        "native": "Share"
      },
      "aside": {
        "heading": "At a glance"
      },
      "minAge": {
        "work_at_height": "Because you work at height, the minimum age is 18.",
        "construction_demolition": "Because you work on a construction or demolition site, the minimum age is 18.",
        "forklift": "Because you drive a forklift or reach truck, the minimum age is 18.",
        "night_work": "Because you also work at night, the minimum age is 18.",
        "hazardous_substances": "Because you work with hazardous substances, the minimum age is 18."
      },
      "closed": {
        "filled": {
          "title": "This job has been filled",
          "body": "We have found someone for this work. Below you find similar work you can still apply for."
        },
        "other": {
          "title": "This job is no longer open",
          "body": "You can no longer apply for this job. Below you find similar work that is open now."
        },
        "closedOn": "Closed on {date}",
        "occupationLink": "See all work as a {occupation}"
      },
      "similar": {
        "title": "Similar jobs"
      },
      "occupationPageLink": "Read more about working as a {occupation}"
    }
  }
}
```

De Engelse h1 op een vacature bestaat uit de Nederlandse titel en de plaats ("Glazenwasser in The Hague"). Het woord "in" valt binnen de h1 die `lang="nl"` krijgt; dat is aanvaardbaar, omdat de titel zelf Nederlands is. Wil Djulan dit zuiverder, dan krijgt alleen `{title}` een `<span lang="nl">` en de h1 zelf geen `lang` (§12).

### 6.3 Geen tekst in componenten

Aria-labels, schermlezerteksten, alt-teksten, de WhatsApp-tekst en de foutmelding bij kopiëren komen uit messages. De enige tekst die niet uit messages komt, is data uit de database (titel, plaats, lijsten) en de plaatsnaam "The Hague" in `displayCity`, die als vaste vertaling van een eigennaam in code staat (een kaart `{ "Den Haag": "The Hague" }` in `vacancy-format.ts`).

## 7 SEO

### 7.1 `/vacatures`

| Situatie | Titel (`title`) | Beschrijving | Canonical en hreflang | Robots |
|---|---|---|---|---|
| zonder parameters of `?pagina=1` | `vacatures.meta.title` | `vacatures.meta.description` | `/vacatures`; alternates nl, en, x-default | index, follow |
| `?pagina=n` (n ≥ 2), geen filter | `vacatures.meta.titlePaged` | `vacatures.meta.descriptionPaged` | `/vacatures?pagina=n`; alternates met dezelfde query | index, follow |
| `isFiltered` (filter, zoekterm of niet-standaard sortering) | `vacatures.meta.title` | `vacatures.meta.description` | `/vacatures` | `noindex, follow` |

```ts
export async function generateMetadata({ params, searchParams }: PageProps<"/[locale]/vacatures">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const state = parseVacancySearchParams(await searchParams);
  const t = await getTranslations({ locale, namespace: "vacatures.meta" });
  return vacancyListMetadata({ locale, t, page: state.page, isFiltered: state.isFiltered });
}
```

`vacancyListMetadata()` (spec 12) kiest titel, beschrijving, canonical, hreflang en robots volgens de tabel. `pageMetadata()` zet het merk erachter met `brandedTitle()` (spec 12). Geen JSON-LD behalve `BreadcrumbList` (Home, Vacatures). Op `/en/vacatures` gelden dezelfde regels met Engelse teksten (spec 01 §4.11.6).

### 7.2 `/vacatures/[slug]`

| Situatie | Titel | Beschrijving | Canonical | Hreflang | Robots | JSON-LD |
|---|---|---|---|---|---|---|
| open, `nl` | `seoTitle` of `vacatures.meta.detailTitle` | `seoDescription` of `vacatures.meta.detailDescription` (§7.3) | zichzelf | geen (`languages: false`) | index, follow | `JobPosting`, `BreadcrumbList` |
| open, `en` | `vacatures.meta.detailTitle` (Engelse plaatsnaam) | Engelse `detailDescription` | NL-URL `https://www.groospersoneelsdiensten.nl/vacatures/<slug>` | geen | standaard (index, follow; de canonical bundelt) | `BreadcrumbList` |
| gesloten, `nl` en `en` | `closedTitleFilled` of `closedTitleOther` | `closedDescriptionFilled` of `closedDescriptionOther` | zichzelf (`en`: NL-URL) | geen | `noindex, follow` | `BreadcrumbList` |
| gearchiveerd, ouder dan 30 dagen gesloten, onbekend | n.v.t. | n.v.t. | n.v.t. | n.v.t. | 404 met `noindex` (spec 01) | geen |

`generateMetadata` roept dezelfde `getVacancyByNumber()` aan (React `cache()`, dus één lezing) en geeft het resultaat van `vacancyMetadata()` (spec 12) terug, zoals spec 12 §10 stap 4:

```ts
export async function generateMetadata({ params }: PageProps<"/[locale]/vacatures/[slug]">): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale = resolveLocale(raw);
  const number = parseVacancySlug(slug);
  const vacancy = number ? await getVacancyByNumber(number) : null;
  if (!vacancy) return {};
  const t = await getTranslations({ locale, namespace: "vacatures.meta" });
  const { city, hours, wage, startDate } = await getVacancySeoParts(vacancy, locale);
  return vacancyMetadata({ locale, vacancy, t, city, hours, wage, startDate });
}
```

Bij een afwijkende slug geeft hij de metadata van de juiste vacature terug; de pagina stuurt door. Bij `null` geeft hij `{}` terug en roept de pagina `notFound()` aan. `vacancyMetadata()` zet zelf `languages: false`, de canonical naar de NL-URL op `/en`, `noindex` bij een gesloten vacature en de OG-afbeelding met `ogAlt`.

### 7.3 Beschrijving van een vacature

`vacancyMetadata()` (spec 12) voert deze regels uit met de sjablonen uit §6.

1. Als `seoDescription` gevuld is, die gebruiken.
2. Anders `detailDescription` met `title`, `city` (`displayCity`), `hours`, `wage` en `start` (`startAsapSentence` of `startDateSentence` met `formatDate`).
3. Is de uitkomst langer dan 160 tekens, dan `detailDescriptionShort` (het startmoment valt weg, spec 03 §7).
4. Is ook die langer dan 160 tekens, dan `summary` van de vacature, afgekapt op het laatste hele woord onder 157 tekens plus "...". Dit komt alleen voor bij een zeer lange titel.

Voorbeeld voor 1001: "Glazenwasser in Den Haag voor 32 tot 40 uur per week, € 16,08 tot € 17,50 bruto per uur. Je kunt direct beginnen. Solliciteer bij Groos, ook zonder cv." (151 tekens).

### 7.4 `JobPosting`

Alleen als `locale === "nl"` en `vacancy.state === "open"`. De builder `jobPostingLd` staat in `lib/seo.ts` en is van spec 12, met de veldmapping van spec 12 §5.3 en context/10 §3. Deze spec roept hem zo aan:

```tsx
const { hours, wage, start } = await getVacancySeoParts(vacancy, locale);
const ld = jobPostingLd({
  vacancy,
  labels: {
    tasks: t("detail.sections.tasks"),
    requirements: t("detail.sections.requirements"),
    offer: t("detail.sections.offer"),
    extra: t("detail.sections.extra"),
  },
  facts: [hours, wage, start],
  minAgeSentence: vacancy.minAge18 && vacancy.minAgeReason ? t(`detail.minAge.${vacancy.minAgeReason}`) : null,
});
```

De pagina geeft de minimumleeftijdzin mee als `minAgeSentence`; `salaryNote` haalt de builder zelf uit `vacancy`. Beide komen als laatste `<li>` onder requirements en offer, zoals op de pagina. Wat de builder uit `vacancy` haalt en waar het voor dient: `title` (alleen de functie), `intro`, `tasks`, `requirements`, `offer`, `extra`, `salaryNote` en de minimumleeftijdzin voor `description` als HTML met `<p>`, `<ul>` en `<li>`; `publishedAt` voor `datePosted`; `closesAt` voor `validThrough`; `contractType`, `hoursMin` en `hoursMax` voor `employmentType`; `city`, `postalCode` en `province` voor `jobLocation`; `salaryMin` en `salaryMax` voor `baseSalary` in EUR per `HOUR`; `number` voor `identifier`; `educationLevel`, `experienceLevel` en `experienceMonths` voor de eisen; `positionsCount` en `startDate` voor `totalJobOpenings` en `jobStartDate`; `directApply: true`, omdat het formulier op de pagina staat. Geen `JobPosting` op `/vacatures`, op beroepspagina's, op `/inschrijven`, op gesloten vacatures en op `/en` (context/10 §3, spec 01 §4.11.6).

### 7.5 Kruimelpad

Via `Breadcrumbs` van spec 01, dus zichtbaar spoor en `BreadcrumbList` uit dezelfde gegevens: `/vacatures` is Home, Vacatures; een vacature is Home, Vacatures, {titel}. De pagina roept `breadcrumbLd` niet zelf aan.

### 7.6 Open Graph per vacature (inhoud; route van spec 12)

`app/[locale]/vacatures/[slug]/opengraph-image.tsx` (spec 12) leest `getVacancyByNumber(parseVacancySlug(slug))` en toont, op 1200 bij 630 met de tokens en het logo van spec 02:

| Regel | Inhoud | Voorbeeld |
|---|---|---|
| 1, groot | `title` | Glazenwasser |
| 2 | `displayCity(city, locale)` | Den Haag |
| 3, accent | `wage(salaryMin, salaryMax)` | € 16,08 tot € 17,50 bruto per uur |
| 4 | `hours(hoursMin, hoursMax)` | 32 tot 40 uur per week |
| voet | logo en `contact.shortName` | Groos Personeelsdiensten |

Bij `null` (gearchiveerd of onbekend) valt de route terug op de algemene OG-afbeelding van spec 12. Spec 12 regelt de OG-route, met `displayCity` voor de plaatsnaam en `vacatures.og.label` en `vacatures.og.closed` uit §6. De route heeft de taalprefix nodig en gaat dus door de proxy (spec 01 §4.12).

### 7.7 Sitemap en `llms.txt`

Spec 12 neemt `/vacatures` op via `STATIC_ROUTES` (spec 01) en de open vacatures via `getVacancySitemapEntries()` (spec 10), alleen als NL-URL. Niet in de sitemap: filter- en pagineringsURL's, gesloten vacatures, `/en/vacatures/*`. Vacatures in `llms.txt` beslist spec 12.

## 8 Toegankelijkheid en performance

**Landmarks en koppen**

- Eén h1 per pagina. Op `/vacatures`: h1 in de paginakop, h2 "Filters" in de zijbalk (in het paneel de `SheetTitle`), sr-only h2 "Gevonden vacatures", h2 voor de beroepsintro, de lege staat en de inschrijfoproep, h3 voor kaarttitels (B-05).
- Op een vacature: h1 titel, h2 per sectie (kenmerken sr-only, werkdag, eisen, aanbod, extra, zo solliciteer je, solliciteren, vragen, delen, in het kort, vergelijkbare vacatures), h3 voor stappen en kaarttitels.
- Navigaties met eigen naam: kruimelpad (spec 01), paginering `vacatures.pagination.label`. De chips staan in een `<ul aria-label="Actieve filters">`.

**Formulieren**

- Elke checkboxgroep is een `<fieldset>` met `<legend>`; elke checkbox heeft een eigen `<label>` met tekst en teller, en `aria-describedby` naar de sr-only teller (`countAria`).
- Het zoekveld heeft een zichtbaar `<label>`; het formulier heeft `role="search"` en `aria-label` `vacatures.search.form`.
- De sorteerkeuze is een native `<select>` met zichtbaar label.
- Doelen minimaal 44 bij 44 px: checkboxrijen, chips, paginering, knoppen in het paneel, deelknoppen.

**Status en focus**

- Resultatenteller in `role="status"` met `aria-live="polite"` (WCAG 4.1.3); tijdens navigatie `aria-busy="true"` op de resultaten en `vacatures.overview.updating` in een sr-only live-regio.
- De link "Solliciteer direct" springt naar `#solliciteren`, de sectie van `ApplySection` (spec 07) met `scroll-mt-24`, zodat de sticky header de kop niet bedekt.
- Paginering: huidige pagina met `aria-current="page"`, vorige en volgende als link of, aan de rand, als `<span aria-disabled="true">`.
- `CopyLinkButton` meldt het resultaat in `role="status"`.

**Taal en kleur**

- Nederlandse database-inhoud onder `/en` in een element met `lang="nl"` (WCAG 3.1.2, spec 14).
- Kleuren alleen via tokens van spec 02 (`bg-card`, `border-border`, `text-muted-foreground`, `bg-primary`, `ring-ring`); badges hebben tekst, niet alleen kleur. Contrast AA; de teller naast een filterlabel minimaal 4,5:1.
- Beweging: hover op de kaart (rand), het paneel (200 ms) en de voortgangsbalk; alles met `motion-reduce:transition-none` of `motion-reduce:animate-none`. Geen framer-motion in deze module.

**Performance**

- Server components overal, behalve de clienteilanden `VacancySearchForm`, `VacancyFilters`, `VacancyFilterSheet`, `VacancySortSelect`, `VacancyNavigationProvider`, `VacancyResultsRegion`, `CopyLinkButton`, `NativeShareButton` en `ApplyForm` (spec 07). Geen clientside datafetches.
- `/vacatures` is dynamisch, maar leest alleen uit de gecachte loader van spec 10 (één query per cache-miss voor lijst en tellers samen). De vacaturepagina is ISR met `revalidate = 3600` en de tags `vacatures` en `vacature:<nummer>`; mutaties in `/beheer` en de cron verversen via `revalidateVacancies()` (spec 10).
- `generateStaticParams` prerendert open vacatures per taal; nieuwe vacatures renderen bij het eerste bezoek (`dynamicParams = true`).
- Geen beelden boven de vouw (B-25); als er een vacaturebeeld is, staat het na de kenmerken en de knoppen en is het niet het LCP-element. Het LCP-element op een vacature is de h1 of de lead.
- Het skelet `VacancyListSkeleton` heeft dezelfde afmetingen als de kaarten (geen CLS) en een sr-only `common.loading` in `aria-live="polite"`.
- Budgetten (spec 14 §8.5): first-load JavaScript gzip hoogstens 215 kB op `/[locale]/vacatures` en 235 kB op `/[locale]/vacatures/[slug]`.

**Foutstaten**

| Situatie | Gedrag |
|---|---|
| Supabase-fout tijdens renderen | `lib/data/*` gooit een `Error`; `app/[locale]/error.tsx` (spec 01) toont de foutpagina met "Probeer opnieuw" en het telefoonnummer. Bij een ISR-verversing houdt Next de vorige versie. Een Supabase-fout geeft de foutpagina, nooit de lege staat of een 404 (B-56, AC-06-38). |
| `.env.local` ontbreekt | `listOpenVacancyParams()` geeft `[]` (de build lukt); een bezoek aan `/vacatures` toont de foutpagina met de melding van `supabaseEnv()` in de serverlog. |
| Pagina buiten bereik | `notFound()`: 404 van spec 01. |
| Slug zonder geldig nummer, gearchiveerd, ouder dan 30 dagen gesloten, gepland, concept | `notFound()`: 404. |
| Kopiëren mislukt | melding en een geselecteerd invoerveld met de link. |
| Netwerkfout tijdens clientnavigatie | Next valt terug op een volledige paginalading; geen eigen afhandeling. |

## 9 21st.dev-opdracht voor sub-agents

### 9.1 Werkwijze voor alle sub-agents

De bouw-agent van stap 5 start de sub-agents hieronder tegelijk, zodra §4 in code als werkende structuur op de bestaande primitives staat (data, routes, formulieren zonder opmaak). De logica, props, `id`'s en messages bouwt hij intussen zelf; de sub-agents leveren alleen de visuele keuze.

- **Tools laden**: `ToolSearch` met `select:mcp__magic__search,mcp__magic__get_inspiration`.
- **Zoeken**: `mcp__magic__search` met `type: "component"` en `limit: 10`, met elk van de opgegeven formuleringen (Engels werkt het best); `mcp__magic__get_inspiration` met de opgegeven beschrijvingen. Zoeken op thema's levert niets op (00 §4.6); tokens komen uit spec 02.
- **Selectiecriteria**: minimaal en rustig; witte achtergrond; blauw accent alleen via tokens van spec 02 (`bg-primary`, `text-primary`, `ring-ring`, `border-primary`); past bij de boodschap van de plek (eerlijk, concreet, snel solliciteren met de duim); shadcn-compatibel met Tailwind 4 en `cn()`; toegankelijk (toetsenbord, juiste rollen, zichtbare focus, doelen van 44 px); werkt als server component of met een klein clienteiland; geen nieuwe dependencies (geen Radix-pakketten, geen framer-motion, geen vaul; base-ui 1.0.0-rc.0 en lucide 0.456 zijn er al); geen glass, gloed, 3D-kanteling, raster of marquee (B-29); geen afbeeldingen of avatars als verplicht onderdeel (B-25).
- **Oplevering** (als tekst aan de bouw-agent): 2 tot 4 kandidaten met id, naam en preview-URL, per kandidaat twee zinnen over wat bruikbaar is en wat niet, één gemotiveerde keuze, en of `get_component` nodig is. Geen bruikbare kandidaat: het advies om op de primitives te bouwen, met de punten uit de kandidaten die wel inspireren.
- **Vastleggen**: Vastleggen in `docs/21st-keuzes.md` onder het kopje "Spec 06": per plek de kandidaten (id, naam, preview-URL), de keuze, wel of geen `get_component` en de aanpassingen.
- **Code ophalen**: `mcp__magic__get_component` alleen voor de gekozen kandidaat, hoogstens één keer per plek, en alleen als het overnemen van structuur of interactie echt tijd scheelt. Voor kenmerkenblok en lege staat is dat zelden zo. Chips en paginering scout niemand: daarvoor zijn de primitives van spec 02 (§4.6).
- **Aanpassingsregels**: kleuren en radius alleen via tokens van spec 02; componentnamen, props en `id`'s uit §4.6 blijven gelijk (`solliciteren`, `zo-solliciteer-je`, `vacature-titel`, `vacatures-titel`); alle tekst via messages of props; server component tenzij interactie; de primitives van spec 02 (§4.6, onder meer `Sheet` voor het paneel) in plaats van Radix, vaul of een eigen base-ui `Dialog`; `Link` uit `@/i18n/navigation`; native `<input type="checkbox">`, `<select>` en `<form method="get">` blijven, zodat alles zonder JavaScript werkt; iconen uit lucide 0.456 met lijndikte 2; `prefers-reduced-motion` gerespecteerd; geen eyebrows of labels boven koppen; geen uppercase.
- **Valt 21st.dev tegen**, dan bouwt de agent op `CtaButton`, de tokens en de primitives van spec 02 en native formulierelementen.

### 9.2 Sub-agent `scout-vacaturekaart`: `VacancyCard`, `VacancyList`, `VacancyListSkeleton`

Boodschap: in één blik zien wat je verdient, hoeveel uur en waar, zonder ruis.

- `search`: "job listing card"; "job card with salary hours location"; "list item card with icon meta row"; "skeleton card loading".
- `get_inspiration`: "minimal white job card showing hourly wage, hours per week, location and start date with small status badges, whole card clickable"; "compact job list for a staffing agency, two columns on tablet, no images".
- Specifiek: kenmerkregels met icoon links, hoogstens twee badges, één link per kaart, geen bewaarknop, geen logo of foto.

| Id | Naam | Preview |
|---|---|---|
| 8725 | Job Listing (educalvolpz) | https://21st.dev/@educalvolpz/components/job-listing |
| 7464 | Opportunity Card (ravikatiyar162) | https://21st.dev/@ravikatiyar162/components/card-12 |
| 19988 | Card Skeleton (uiable) | https://21st.dev/@uiable/components/uiable-skeleton-card |

Het skelet bouwt op `Skeleton` van spec 02 en wordt niet gescout. Let op: 5642 (reuno-ui, Joblisting) en 8123 (Animated Card) hebben modale animaties en 3D-kanteling; niet kiezen.

### 9.3 Sub-agent `scout-filters`: `VacancyFilters`, `VacancyFilterSheet`, `VacancySortSelect`

Boodschap: weinig keuzes, duidelijke tellers, op de telefoon met één duim te bedienen.

- `search`: "filter sidebar checkbox facets"; "checkbox group with counts"; "mobile filter drawer sheet"; "category page filters with chips and sort".
- `get_inspiration`: "minimal job board filter sidebar with checkbox groups and result counts per option, collapsible long list"; "mobile filter sheet sliding from the right with a sticky footer button showing the number of results".
- Specifiek: fieldsets met legend, teller rechts naast het label, uitklapbare lijst voor plaatsen; paneel met kop, scrollende inhoud en vaste voet; native select voor sorteren.

| Id | Naam | Preview |
|---|---|---|
| 29395 | Ecommerce Category Page (mohammadshehadeh) | https://21st.dev/@mohammadshehadeh/components/ecommerce-04 |
| 11400 | Checkbox Group op Base UI (coss.com) | https://21st.dev/@coss.com/components/checkbox-group |
| 25106 | Checkbox Group met show more (edwinvakayil) | https://21st.dev/@edwinvakayil/components/checkbox-group |

Het paneel is `Sheet` van spec 02 en wordt niet gescout. 29395 is het beste voorbeeld van de hele opbouw (zijbalk, chips, sortering, lege staat, mobiel paneel); neem de indeling over, niet de e-commercevelden. 25106 gebruikt animaties met veren; alleen de structuur van "toon meer" is bruikbaar.

### 9.4 Sub-agent `scout-zoeken-chips`: alleen het zoekveld van `VacancySearchForm`

Boodschap: zoeken op wat je kent (een functie of een plaats). De chips van `VacancyActiveFilters` zijn de `Chip` van spec 02 en worden niet gescout.

- `search`: "search input with button"; "search field with icon".
- `get_inspiration`: "large minimal search field with leading search icon and attached submit button for a job search page".
- Specifiek: invoerveld van minimaal 48 px hoog met zichtbaar label, gebouwd op `Label` en `Input` van spec 02.

| Id | Naam | Preview |
|---|---|---|
| 26737 | Button Group Input (uiable) | https://21st.dev/@uiable/components/button-group-input |
| 159 | Input met zoekicoon en knop (originui) | https://21st.dev/@originui/components/input |

### 9.5 Sub-agent `scout-lijstranden`: `VacancyEmptyState`, `VacancyRegisterPrompt`, `OccupationIntro`

Boodschap: nooit een doodlopende weg; altijd een volgende stap. De paginering is de `Pagination` van spec 02 en wordt niet gescout.

- `search`: "empty state no results"; "empty state with actions"; "call to action block".
- `get_inspiration`: "friendly empty search results state with three clear actions, clear filters, register and browse by category, white background".
- Specifiek: lege staat met icoon, h2, één alinea en drie acties; inschrijfoproep als rustig vlak met één knop; beroepsintro als korte tekst met één link.

| Id | Naam | Preview |
|---|---|---|
| 19746 | Empty (cnippet-dev) | https://21st.dev/@cnippet-dev/components/cnippet-empty |
| 1435 | Empty State (serafimcloud) | https://21st.dev/@serafimcloud/components/empty-state |

### 9.6 Sub-agent `scout-kenmerken`: `VacancyFacts`, `VacancyHeader`, `VacancyApplyAside`

Boodschap: alle harde feiten bovenaan, eerlijk en in vaste volgorde.

- `search`: "description list key value details"; "key value list"; "sticky sidebar card"; "job details summary".
- `get_inspiration`: "job detail key facts block as a definition list with icons: location, hourly wage, hours, shifts, start date, certificates"; "sticky apply card in a sidebar with salary, hours and one primary button".
- Specifiek: `<dl>` met icoon per rij, twee kolommen vanaf `sm`; de zijbalkkaart sticky met één primaire knop.

| Id | Naam | Preview |
|---|---|---|
| 25162 | Key Value List (corr) | https://21st.dev/@corr/components/key-value-list |
| 29471 | Article With Author Sidebar (olewandowski1) | https://21st.dev/@olewandowski1/components/article-5 |
| 2304 | List 2 (shadcnblockscom) | https://21st.dev/@shadcnblockscom/components/list-2 |

### 9.7 Sub-agent `scout-vacaturedetail`: `VacancyShare` en de compositie van `VacancyContactCard` en `VacancyClosedNotice`

Boodschap: een echt gezicht en een echt nummer, delen in de app die iedereen gebruikt, en bij een gesloten vacature meteen een alternatief.

- `search`: "copy link button"; "share button copy link".
- `get_inspiration`: "inline notice that a job is closed with a link to similar jobs"; "share row with WhatsApp link and copy link button with copied feedback".
- Specifiek: initialen in plaats van foto als er geen foto is; kopieerknop met statusmelding; melding met icoon en neutrale rand.

| Id | Naam | Preview |
|---|---|---|
| 27943 | Copy Link Button (uiable) | https://21st.dev/@uiable/components/button-copy |

`VacancyClosedNotice`, `OnlyDutchNotice` en de kaartvorm volgen `Alert` van spec 02 en `ContactPersonCard` van spec 07 en worden niet gescout; de actiebalk is van spec 01. 10388 (Social Share Button) verbergt de kanalen achter een animatie en noemt WhatsApp niet; niet kiezen. `VacancyContactCard` volgt het uiterlijk van `ContactPersonCard` (spec 07).

## 10 Bouwopdracht

> **Notitie.** Bouwstap 5 voor deze spec is gecommit (8a89ebe, gemerged in b12c48d). De wijzigingen uit kruiscontrole ronde 2 en 3 voert een nazorg-sub-agent in bouwstap 3b uit (00 §6).

Bouwstap 5 uit 00 §6, samen met spec 12. Voorwaarden: stap 1 (spec 10: migraties, seed, `lib/data/*` met zes open seedvacatures), stap 2 (spec 02: tokens, `CtaButton`), stap 3 (spec 01: routes, `Breadcrumbs`, `lib/routes.ts`, `lib/site.ts`, `i18n/*`, actiebalk; spec 03: `lib/format.ts`, `common.*`) en stap 4 (spec 05: `beroepen.<id>.*`). `ApplySection` van spec 07 staat op de detailpagina alleen bij `state === "open"`; spec 04 en 05 gebruiken `LatestVacancies` en `VacancyList`. Bouwstap 3b controleert dat (B-52). Lees vooraf `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/{permanentRedirect,generate-metadata,generate-static-params,not-found}.md` en `.../03-file-conventions/page.md`.

1. **Data.** Gebruik de typen en leesfuncties van spec 10 zoals ze zijn, ook `WorkplaceLanguage` uit `lib/data/options.ts`; deze module voegt niets toe aan `lib/data/*` (§5.2).
2. **Messages.** Zet de sleutelboom van §6.1 in `messages/nl/vacatures.json` en van §6.2 in `messages/en/vacatures.json` (B-45); het bestand bevat de inhoud onder `vacatures`, zonder die buitenste sleutel, met behoud van wat er al staat. Controleer dat `common.format.*`, `common.whatsapp.vacatureSolliciteren`, `common.whatsapp.vacatureVraag`, `common.cta.*`, `common.a11y.callPerson`, `common.opensInNewTab` en `common.loading` van spec 03 bestaan. `npm run check -- --warn` mag geen sleutelfouten geven.
3. **Hulpbestanden.** Maak `components/vacatures/types.ts`, `constants.ts` en `vacancy-format.ts` (§4.5, §4.6).
4. **Kaart en lijst.** Maak `vacancy-card.tsx`, `vacancy-list.tsx`, `vacancy-list-skeleton.tsx` en `latest-vacancies.tsx` (§4.7, §4.8).
5. **Overzicht.** Maak `vacancy-navigation.tsx`, `vacancy-search-form.tsx`, `vacancy-filters.tsx`, `vacancy-filter-sheet.tsx`, `vacancy-sort-select.tsx`, `vacancy-active-filters.tsx`, `vacancy-pagination.tsx`, `vacancy-empty-state.tsx`, `occupation-intro.tsx` en `vacancy-register-prompt.tsx`. Vervang het skelet `app/[locale]/vacatures/page.tsx` door de pagina van §4.2 met `generateMetadata` volgens §7.1.
6. **Detail.** Maak `vacancy-header.tsx`, `vacancy-facts.tsx`, `vacancy-actions.tsx`, `vacancy-body.tsx`, `vacancy-contact-card.tsx`, `vacancy-share.tsx`, `copy-link-button.tsx`, `native-share-button.tsx`, `vacancy-apply-aside.tsx`, `vacancy-closed-notice.tsx`, `similar-vacancies.tsx` en `only-dutch-notice.tsx`. Vervang het skelet `app/[locale]/vacatures/[slug]/page.tsx` door de pagina van §4.3 met `generateStaticParams`, `dynamicParams = true`, `revalidate = 3600` en `generateMetadata` volgens §7.2 en §7.3. Zet op de plek van `ApplySection` de TODO-sectie uit de inleiding van deze paragraaf.
7. **SEO-koppeling.** Gebruik `vacancyListMetadata()` en `vacancyMetadata()` van spec 12 (§7.1, §7.2) en neem `JsonLd` met `jobPostingLd` op volgens §7.4. Lever de OG-inhoud van §7.6 aan spec 12.
8. **Sub-agents.** Start de zes sub-agents uit §9 tegelijk zodra stap 4 tot en met 6 functioneel staan; verwerk hun keuzes binnen de regels van §9.1. Haal hoogstens één component per plek op met `get_component`.
9. **Verifiëren in code.**

```bash
npm run typecheck
npm run verify
npm run check -- --warn                    # geen sleutel- of registratiefouten; alleen de TODO van stap 6 (ApplyForm) tot spec 07 klaar is
npm run build && npm run start             # productieserver op http://localhost:3000
```

10. **Verifiëren in HTTP.**

```bash
B=http://localhost:3000
for u in /vacatures /en/vacatures "/vacatures?beroep=logistiek-medewerker" "/vacatures?q=den+haag" \
  "/vacatures?dienst=weekend&sortering=salaris" /vacatures/glazenwasser-den-haag-1001 \
  /en/vacatures/glazenwasser-den-haag-1001 /vacatures/glazenwasser-1001 /vacatures/onzin \
  /vacatures/opperman-leidschendam-1009 /vacatures/bijrijder-verhuizingen-wassenaar-1010 "/vacatures?pagina=9"; do
  echo "$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' "$B$u") $u"; done
curl -s "$B/vacatures?beroep=schoonmaker" | grep -o '<meta name="robots"[^>]*>'
curl -s "$B/vacatures/glazenwasser-den-haag-1001" | grep -c '"@type":"JobPosting"'
curl -s "$B/en/vacatures/glazenwasser-den-haag-1001" | grep -o '<link rel="canonical"[^>]*>'
```

11. **Visueel.** Playwright op 390, 768, 1280 en 1440 px voor `/vacatures`, `/vacatures?beroep=verhuizer&dienst=nacht` (lege staat), `/vacatures/glazenwasser-den-haag-1001`, `/en/vacatures/glazenwasser-den-haag-1001` en een gesloten testvacature (`maakTestVacature("gesloten-recent")` van spec 14, of 1007 binnen 25 dagen na het seeden). Op 390 px ook het geopende filterpaneel. Scroll elke pagina eerst door. Screenshots alleen in `.playwright-mcp/`.
12. **Tests.** Schrijf of vul de tests van spec 14 voor deze module: `tests/e2e/vacatures/overzicht.spec.ts`, `detail.spec.ts` en `gesloten.spec.ts`, en de eenheidstests `tests/unit/vacatures/status.test.ts` en een nieuwe `tests/unit/vacatures/format.test.ts` voor `displayCity`, `displayPhone`, `isNewVacancy` en de beschrijvingsinkorting van §7.3. Elke testtitel begint met het AC-id. Labels in tests komen uit `messages/`.
13. **Lighthouse en budget.** `npm run lighthouse -- --alleen=vacature` en `npm run check:bundles` (spec 14).
14. **Afsluiten.** Noteer in spec 00 de stand (stap 5, deel 06 klaar), toegepaste sub-agentkeuzes, de afspraken met spec 12 en eventuele afwijkingen.

## 11 Acceptatiecriteria

Alle criteria gelden op localhost met de productieserver tegen `groos-dev` met de seed van spec 10, tenzij anders vermeld. De criteria gaan uit van de seedtoestand direct na `npm run db:seed:reset` (B-46). Testvacatures komen uit de helpers van spec 14.

| Id | Criterium | Eis |
|---|---|---|
| AC-06-01 | `/vacatures` toont na het seeden de zes kaarten 1001 tot en met 1006 en de teller "6 vacatures gevonden" in een element met `role="status"`; 1007 tot en met 1010 staan er niet in. | E-06-01, E-06-09 |
| AC-06-02 | `/vacatures` zonder `sortering` toont de kaarten in de volgorde 1005, 1001, 1003, 1002, 1006, 1004 (uitgelicht eerst, dan nieuwste); `/vacatures?sortering=salaris` in de volgorde 1004, 1001, 1006, 1003, 1002, 1005. | E-06-04 |
| AC-06-03 | `/vacatures?beroep=logistiek-medewerker` toont 1003 en 1004; `?q=den+haag` toont 1001, 1005 en 1006; `?q=naaldwijk` toont 1003; `?dienst=weekend` toont 1003 en 1005; `?beroep=schoonmaker&dienst=avond` toont 1002. | E-06-01 |
| AC-06-04 | Op `/vacatures?beroep=schoonmaker` staat in de groep Beroep bij Schoonmaker de teller 1 en bij Glazenwasser ook 1 (de eigen groep telt niet mee); in de groep Werktijden is "Nachtdienst" uitgeschakeld (teller 0). | E-06-02 |
| AC-06-05 | Op `/vacatures?beroep=schoonmaker&q=kantoren` staan boven de lijst twee chips, "Schoonmaker" en "Zoekterm: kantoren", plus de link "Wis alle filters" naar `/vacatures`; de chip "Schoonmaker" linkt naar `/vacatures?q=kantoren` en zijn toegankelijke naam bevat "Verwijder filter Schoonmaker" (`removeLabel` van de `Chip`). | E-06-03 |
| AC-06-06 | Met `javaScriptEnabled: false` op 1280 px: "Logistiek medewerker" aanvinken en "Filters toepassen" leidt naar `/vacatures?beroep=logistiek-medewerker` met twee kaarten; daarna zoeken op "zoetermeer" leidt naar een URL met `q=zoetermeer` en `beroep=logistiek-medewerker` en toont 1004. Op 390 px staat zonder JavaScript het filterformulier in de pagina. | E-06-07, E-06-21 |
| AC-06-07 | Met JavaScript op 1280 px: een klik op "Verhuizer" verandert de URL in `/vacatures?beroep=verhuizer` zonder volledige paginalading (geen `load`-event), de lijst toont 1005 en de statustekst wordt "1 vacature gevonden". | E-06-21 |
| AC-06-08 | Op 390 px is de zijbalk niet zichtbaar; de knop "Filters" is minimaal 44 px hoog en opent een `[role="dialog"]` met de titel "Filters". Na het aanvinken van "Schoonmaker" toont de voetknop "Toon 1 vacature"; Escape sluit het paneel en de focus staat weer op de knop, die nu "Filters (1)" heet. | E-06-07 |
| AC-06-09 | `/vacatures?beroep=verhuizer&dienst=nacht` toont de h2 "Geen vacatures met deze filters", een link naar `/vacatures`, een link naar `/inschrijven` en een link naar `/werken-als/verhuizer`; er is geen kaart en geen paginering. | E-06-06 |
| AC-06-10 | `/vacatures?beroep=glazenwasser` toont boven de lijst de h2 "Werken als glazenwasser" met twee alinea's en een link naar `/werken-als/glazenwasser`; `/vacatures?beroep=glazenwasser&beroep=schoonmaker` toont geen beroepsintro. | E-06-08 |
| AC-06-11 | Met 13 open vacatures (seed plus zeven testvacatures van spec 14) toont `/vacatures` 12 kaarten en een `nav` "Pagina's met vacatures" met een link naar `/vacatures?pagina=2`; `/vacatures?pagina=2` toont 1 kaart, heeft `<link rel="canonical" href=".../vacatures?pagina=2">` en geen robots `noindex`; `/vacatures?pagina=3` geeft 404. | E-06-05 |
| AC-06-12 | `/vacatures?beroep=schoonmaker`, `/vacatures?q=test` en `/vacatures?sortering=salaris` hebben `<meta name="robots" content="noindex, follow">` en canonical `https://www.groospersoneelsdiensten.nl/vacatures`; `/vacatures` heeft geen `noindex` en alternates voor nl, en en x-default. De pagina bevat geen JSON-LD met `"@type":"ItemList"`. | E-06-18 |
| AC-06-13 | De kaart van 1003 toont de titel als h3-link naar `/vacatures/orderpicker-naaldwijk-1003`, de teksten "Naaldwijk", "€ 14,99 tot € 16,20 bruto per uur", "32 tot 40 uur per week", "Vroege dienst, weekend" en "Per direct", en de badges "Spoed" en "Nieuw"; de kaart van 1004 heeft geen badge. De link heeft een toegankelijke naam die met "Orderpicker in Naaldwijk. € 14,99 tot € 16,20 bruto per uur." begint. | E-06-09, E-06-19 |
| AC-06-14 | `/vacatures/glazenwasser-den-haag-1001` geeft 200 met één h1 "Glazenwasser in Den Haag", een kruimelpad met Home, Vacatures en Glazenwasser, en een `dl` met de labels Plaats, Uurloon, Uren per week, Soort contract, Werktijden, Start, Rijbewijs en certificaten, Ervaring en Vacaturenummer; onder Rijbewijs en certificaten staan "Rijbewijs B nodig", "VCA Basis is een pluspunt" en "IPAF (hoogwerker) is een pluspunt". De regel "wij regelen de opleiding" (`facts.qualifications.training`) wordt getest met `maakTestVacature` (spec 14), niet met de seed. | E-06-12, E-06-13 |
| AC-06-15 | Op 1001 staan de h2's "Je werkdag", "Wat je meebrengt", "Wat je van ons krijgt", "Zo solliciteer je", "Solliciteer op deze vacature" (uit `forms.apply.title` plus `forms.apply.accent`, spec 07), "Vragen over deze vacature", "Deel deze vacature" en "Vergelijkbare vacatures"; het laatste punt onder "Wat je meebrengt" is "Omdat je op hoogte werkt, is de minimumleeftijd 18 jaar."; de pagina bevat geen van de teksten "Wat ga je doen", "Wat vragen wij", "Wat bieden wij" en "Interesse". | E-06-12, E-06-22 |
| AC-06-16 | Op 390 px op 1001 toont de actiebalk van spec 01 de teksten van `common.cta.call` ("Bel ons") en `common.cta.apply` ("Solliciteer direct"); een tik op "Solliciteer direct" scrollt naar `section#solliciteren`, waarvan de bovenkant niet onder de sticky header valt. Op 1280 px staat rechts een sticky blok "In het kort" met een link naar `#solliciteren` dat na 1500 px scrollen nog zichtbaar is. | E-06-12 |
| AC-06-17 | Op 1001 heeft de WhatsApp-sollicitatielink een `href` die begint met `https://wa.me/31683351985?text=` en waarvan de gedecodeerde tekst "Glazenwasser" en "1001" bevat; de belknop heeft `href="tel:` gevolgd door het nummer van de contactpersoon uit de seed en de tekst "Bel" gevolgd door de voornaam. | E-06-14, E-06-15 |
| AC-06-18 | Op 1001 bevat `section#solliciteren` het formulier van spec 07 (vanaf stap 6) en de WhatsApp- en belknop; "Kopieer link" schrijft `https://www.groospersoneelsdiensten.nl/vacatures/glazenwasser-den-haag-1001` (of de localhost-variant volgens `site.url`) naar het klembord en toont "Link gekopieerd" in een `role="status"`; "Deel via WhatsApp" linkt naar `https://wa.me/?text=` met de vacature-URL in de tekst. | E-06-12 |
| AC-06-19 | `/vacatures/glazenwasser-1001` en `/vacatures/Glazenwasser-den-haag-1001` geven 308 naar `/vacatures/glazenwasser-den-haag-1001`; `/en/vacatures/glazenwasser-1001` geeft 308 naar `/en/vacatures/glazenwasser-den-haag-1001`. | E-06-11 |
| AC-06-20 | `/vacatures/onzin` geeft 404 met `<h1` en "Deze pagina bestaat niet of niet meer" in de server-HTML (proxy, B-55). `/vacatures/opperman-leidschendam-1009` (concept), `/vacatures/medewerker-bloemenlogistiek-honselersdijk-1008` (gepland) en `/vacatures/bijrijder-verhuizingen-wassenaar-1010` (40 dagen gesloten) geven 404 met `<meta name="robots" content="noindex"/>` en tonen in de browser (Playwright, JavaScript aan) de h1 "Deze pagina bestaat niet of niet meer" binnen header en footer. | E-06-11 |
| AC-06-21 | Een testvacature "gesloten-recent" met reden `filled` geeft 200, toont de h2 "Deze vacature is vervuld" en "Gesloten op" met een datum, heeft `noindex, follow`, bevat geen `form`, geen WhatsApp-sollicitatielink, geen sectie "Deel deze vacature" en geen JSON-LD met `"@type":"JobPosting"`, en toont een h2 "Vergelijkbare vacatures" met minstens één kaart en een link naar `/inschrijven`. Met reden `withdrawn` is de h2 "Deze vacature staat niet meer open". Een testvacature "gesloten-oud" geeft 404. | E-06-16 |
| AC-06-22 | `/vacatures/glazenwasser-den-haag-1001` bevat precies één JSON-LD met `"@type":"JobPosting"` met `title` "Glazenwasser", `datePosted`, `validThrough`, `baseSalary.value.minValue` 16.08, `maxValue` 17.5, `unitText` "HOUR", `jobLocation.address.addressLocality` "Den Haag", `identifier.value` "1001" en `directApply` true, en één `BreadcrumbList` met drie items. De Rich Results Test met code-invoer meldt geen fouten. | E-06-18 |
| AC-06-23 | `/vacatures/glazenwasser-den-haag-1001` heeft canonical naar zichzelf en geen `<link rel="alternate" hreflang>`; de `<title>` begint met "Glazenwasser in Den Haag" en de beschrijving is "Glazenwasser in Den Haag voor 32 tot 40 uur per week, € 16,08 tot € 17,50 bruto per uur. Je kunt direct beginnen. Solliciteer bij Groos, ook zonder cv." | E-06-18 |
| AC-06-24 | `/en/vacatures/glazenwasser-den-haag-1001` heeft `<html lang="en">`, een zichtbaar element met `role="note"` met de tekst "This job is only available in Dutch.", de h1 en de takenlijst binnen een element met `lang="nl"`, de labels "Hourly wage" en "Hours per week", de waarde "€16.08 to €17.50 gross per hour", canonical `https://www.groospersoneelsdiensten.nl/vacatures/glazenwasser-den-haag-1001`, geen hreflang en geen `JobPosting`. | E-06-17, E-06-19 |
| AC-06-25 | Op `/en/vacatures` zijn de h1 "Jobs in The Hague and surroundings", de filterlegenda's en de knoppen Engels; de kaarttitels hebben `lang="nl"`; de kaart van 1001 toont "The Hague". | E-06-17 |
| AC-06-26 | Na publicatie van een nieuwe vacature in `/beheer` (of met `maakTestVacature("gepubliceerd")`) staat die zonder nieuwe build binnen één verzoek op `/vacatures` en is zijn detailpagina 200; na sluiten als vervuld toont de detailpagina bij het volgende verzoek de gesloten staat. | E-06-20 |
| AC-06-27 | `next build` toont `/[locale]/vacatures` als dynamisch en `/[locale]/vacatures/[slug]` als ISR met de zes open seedvacatures per taal (12 pagina's) en revalidatie 1h; `find 'app/[locale]/vacatures' -name loading.tsx` geeft niets. | E-06-20 |
| AC-06-28 | `LatestVacancies` met `occupation="logistiek-medewerker"` rendert een h2, twee kaarten (1003, 1004) en een link naar `/vacatures?beroep=logistiek-medewerker`; met `occupation="glazenwasser"` en limiet 3 één kaart; met een beroep zonder open vacatures de tekst uit `vacatures.latest.empty` en een link naar `/inschrijven`. | E-06-10 |
| AC-06-29 | `messages/nl/vacatures.json` en `messages/en/vacatures.json` hebben dezelfde sleutels en arraylengtes (`npm run check`); `npm run check:copy` (spec 03) meldt in `vacatures` geen uitroepteken, geen gedachtestreepje en geen los woord u of uw. | E-06-22 |
| AC-06-30 | Met axe (spec 14) op `/vacatures`, het geopende filterpaneel, `/vacatures?beroep=verhuizer&dienst=nacht` en 1001 geen fouten van niveau serious of critical; elke checkbox heeft een label en hoort bij een `fieldset` met `legend`; tijdens een filternavigatie heeft de resultatenregio `aria-busy="true"`. | E-06-21, E-06-23 |
| AC-06-31 | Op 390, 768, 1280 en 1440 px geldt op `/vacatures` en 1001 `document.documentElement.scrollWidth <= window.innerWidth`. | E-06-23 |
| AC-06-32 | `npm run lighthouse -- --alleen=vacature` haalt op 1001 mobiel 90 of hoger in alle vier categorieën; `npm run check:bundles` blijft onder 215 kB voor `/[locale]/vacatures` en 235 kB voor `/[locale]/vacatures/[slug]`. | E-06-23 |
| AC-06-33 | Met `prefers-reduced-motion: reduce` is `parseFloat(getComputedStyle(el).transitionDuration)` van het filterpaneel hoogstens 0,00001 (seconden; Chromium geeft `1e-06s` door de globale regel van spec 02 §4.2), of is `transition-property` `none`; `grep -rl "framer-motion" components/vacatures` geeft niets. | E-06-21 |
| AC-06-34 | `grep -rn "createClient\|createSupabase" components/vacatures 'app/[locale]/vacatures'` geeft niets: deze module leest alleen via `lib/data/*`. | E-06-20 |
| AC-06-35 | Het verslag van elke sub-agent uit §9 noemt 2 tot 4 kandidaten met id, naam en preview-URL en een gemotiveerde keuze; `docs/21st-keuzes.md` heeft het kopje "Spec 06" met per plek de kandidaten (id, naam, preview-URL), de keuze, wel of geen `get_component` en de aanpassingen; per plek hoogstens één `get_component`. | E-06-24 |
| AC-06-36 | Alle criteria hierboven zijn uitgevoerd op `http://localhost:3000` (of 3100 voor Playwright) tegen `groos-dev`, zonder Vercel-deploy. | E-06-25 |
| AC-06-37 | Op `/vacatures/glazenwasser-den-haag-1001` staan links naar `/werken-als/glazenwasser` en `/inschrijven`. | E-06-12 |
| AC-06-38 | Met `NEXT_PUBLIC_SUPABASE_URL=https://aaaaaaaaaaaaaaaaaaaa.supabase.co npx next dev -p 3101` (een project dat niet bestaat; de shellwaarde gaat voor `.env.local`) toont `/vacatures` in de browser de foutpagina van spec 01 (h1 "Er ging iets mis bij het laden van deze pagina" en de knop "Probeer opnieuw") en niet de lege staat "Er staan nu geen vacatures online"; `/vacatures/glazenwasser-den-haag-1001` toont dezelfde foutpagina en geen 404 (B-56). | E-06-20 |

## 12 Open vragen en aannames

| Onderwerp | Aanname in deze spec | Bevestigt | Gevolg als het anders is |
|---|---|---|---|
| Laadstaten (afwijking van de opdracht, niet van een B-besluit) | Geen `loading.tsx` met skeletons, omdat spec 01 (E-01-17, §4.14) dat verbiedt: streamen breekt de 404 en de 308. Skeletons alleen als `Suspense`-terugval voor `SimilarVacancies` en `LatestVacancies`; op `/vacatures` een wachtstand met `aria-busy` en een voortgangsbalk. | Djulan | Met `loading.tsx` moeten `notFound()` en `permanentRedirect` in een proxyregel of route handler, en geeft AC-06-19 tot en met AC-06-21 een andere status. |
| Sectiekoppen (afwijking van de opdracht) | "Je werkdag", "Wat je meebrengt", "Wat je van ons krijgt" en "Zo solliciteer je" in plaats van "wat ga je doen", "wat vragen we", "wat bieden we" en "hoe solliciteer je", omdat Wilk precies die koppen gebruikt (context/04, R-08). | Djulan | Alleen `vacatures.detail.sections.*` en AC-06-15. |
| Taal op de werkvloer | Spec 10 levert de kolom `vacancies.workplace_language` (nullable) en `VacancyDetail.workplaceLanguage` met het type `WorkplaceLanguage` uit `lib/data/options.ts` (§5.2); de pagina geeft `vacancy.workplaceLanguage` door aan `VacancyFacts`. Is het veld leeg, dan rendert de rij niet en staat een taaleis als tekst onder "Wat je meebrengt" (VR-03). | Djulan | Taal verplicht maken: alleen spec 08 en 10. |
| Sticky sollicitatiebalk op mobiel | Dat is de actiebalk van spec 01 in variant `vacature` (Bel ons (`common.cta.call`) en Solliciteer direct (`common.cta.apply`)). Deze spec bouwt geen tweede vaste balk. Bij een gesloten vacature wijst `#solliciteren` naar het blok met vergelijkbare vacatures en inschrijven. | Djulan, spec 01 | Wil Djulan een eigen balk met titel en uurloon, dan moet de actiebalk van spec 01 op vacaturepagina's verdwijnen (variant `geen`). |
| Prop van `ApplyForm` | Spec 07 is eigenaar: `ApplyFormVacancy = { number; title; occupationSlug; asksDrivingLicenseB }`. Deze spec rendert alleen `<ApplySection vacancy={vacancy} locale={locale} />` (§5.4). | spec 07 | Geen gevolg voor deze spec. |
| Hreflang in de sitemap voor vacatures | Besloten (kruiscontrole ronde 1): vacature-URL's staan in de sitemap als NL-URL zonder alternates (spec 01); spec 14 past `seo/sitemap.spec.ts` daarop aan. | gesloten | Geen. |
| WhatsApp-helper | Besloten (kruiscontrole ronde 1): `whatsappLink(text?, phone?)` uit `lib/site.ts` (spec 01 is eigenaar), met de teksten `common.whatsapp.vacatureSolliciteren` en `common.whatsapp.vacatureVraag` (spec 03). | gesloten | Geen. |
| Opmaak | `lib/format.ts` van spec 03 (`en-GB`) in plaats van `format.number(..., "euro")` uit `i18n/formats.ts` van spec 01, omdat spec 03 het Britse formaat vastlegt. | kruiscontrole | Alleen `vacancy-format.ts`. |
| Badge Nieuw | Tot 7 dagen na `publishedAt` (context/08 §6.3); "Uitgelicht" krijgt geen badge. | Jimmy en Lorenzo | Constante `NEW_BADGE_DAYS`. |
| Badge Spoed | Alleen voor werkzoekenden zichtbaar als vlag op de kaart; geen urgentiecopy (spec 03: geen druk voor werkzoekenden). | Djulan | Badge weglaten: één regel in `VacancyCard`. |
| Sortering | Alleen "Nieuwste eerst" en "Hoogste uurloon" in de keuzelijst; `sluitdatum` werkt alleen in de URL. Sorteren geldt als filter (`noindex`, spec 10 §12). | Djulan | Derde optie: één sleutel en één `<option>`. |
| Filtergroepen | Beroep, plaats, uren en werktijden (B-16). Geen filters op rijbewijs, VCA, taal of soort contract, al stelt context/13 §2.5 ze voor; bij 10 tot 100 vacatures maken meer groepen het paneel langer dan de lijst. | Djulan | Extra groep vraagt een parameter in spec 10 (`vacancy-search-params.ts`) en een facet. |
| Plaatsen in het filter | De eerste zes zichtbaar, de rest onder "Toon alle plaatsen". | Djulan | Constante `PLACES_VISIBLE`. |
| Contactpersoon zonder profiel | Terugval op Jimmy met het hoofdnummer (B-21). | Jimmy | Alleen `resolveVacancyContact`. |
| Rol van de contactpersoon | Niet getoond: `VacancyContact` kent geen `PersonId` en `common.people.<id>.role` is nog `TODO`. | Jimmy en Lorenzo | Rol tonen: spec 10 levert een koppeling naar `PersonId` of de rol in `admin_profiles`. |
| Engelse h1 | De h1 krijgt `lang="nl"` als geheel, ook het woord "in". | Djulan | Alleen `{title}` in een `<span lang="nl">`. |
| Opleidingsregel bij kwalificaties | `facts.qualifications.training` verschijnt alleen als spec 08 het veld `training_offered` aanbiedt, dus na bevestiging van de claim `certificateSupport` (CL-11). | Jimmy en Lorenzo | Zonder bevestiging toont geen vacature de regel; alleen spec 08 verandert. |
| Contracttype-labels | `secondment` en `recruitment` hebben labels, maar spec 08 biedt ze pas aan na de claim `serviceForms` (CL-18); "vaste baan" komt niet voor (VR-08). | Jimmy en Lorenzo | Labels aanpassen in §6.1 en §6.2. |
| Vacaturebeeld | Alleen tonen als `imageUrl` bestaat, na de kenmerken en de knoppen; bij de lancering zijn er geen foto's (B-25). | Jimmy en Lorenzo | Geen beeld op de pagina: één regel in de pagina. |
| UTM bij de 308 | Queryparameters gaan bij de 308 verloren, omdat de vacaturepagina statisch blijft zonder `searchParams`. | Djulan | Behouden vraagt de redirect in de proxy of een dynamische pagina. |
| Gesloten en 404 | 30 dagen zichtbaar met melding, daarna 404 via `notFound()` (B-15); geen 410. | Jimmy en Lorenzo (termijn) | Termijn in spec 10 (`CLOSED_VISIBLE_DAYS`). |

Afwijkingen van B-01 tot en met B-37: geen. De afwijkingen van de opdracht (laadstaten, sectiekoppen, mobiele balk) staan hierboven met hun reden.
