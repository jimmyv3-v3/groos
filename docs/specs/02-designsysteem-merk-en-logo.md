# 02 Designsysteem, merk en logo

| Status | Fase | Hangt af van | Bronnen |
|---|---|---|---|
| concept | 1 | geen voor de bouw; 01 levert de structuur van header, footer en layout waarin dit uiterlijk landt | context/12 (volledig), docs/MIGRATIE.md §6, bijlagen/repo-inventaris.md §2 en §6, bijlagen/samenvattingen/context-12.md, context-13.md, context-research.md, 00 §3.2 (B-01, B-05, B-25, B-28, B-29, B-34, B-36, B-37), 00 §4.4a, `node_modules/next/dist/docs` (16.3.8: font, app-icons, opengraph-image, image-response) |

Assets bij deze spec: `docs/specs/assets/logo/logo-mark.svg`, `logo-horizontaal.svg`, `logo-gestapeld.svg`, `icoon.svg`, `overzicht.svg` en `overzicht.png`.

## 1 Doel

Deze module geeft Groos een eigen, rustige identiteit: een witte site met een spaarzame touch kobaltblauw, twee lettertypes, een volledige tokenset in Tailwind 4, een kleine set toegankelijke primitives en een nieuw logo. Alles wat kleur, vorm, typografie, beweging en merk betreft, staat op één plek, zodat de paginaspecs (04 tot en met 09) alleen nog tokens en primitives gebruiken en Djulan morgen in iteratierondes één bestand aanpast in plaats van veertig. De module vervangt de grijze JV-basis en de JV-effecten (glas, gloed, raster, spotlight, marquee) door een minimaal systeem dat op een telefoon in de zon leesbaar is en dat opdrachtgevers als betrouwbaar ervaren.

## 2 Gebruikers en scenario's

Werkzoekende
1. S-02-01 Een schoonmaker opent de site op een telefoon buiten in de zon. Tekst is donker op wit (18,7:1), knoppen zijn 48 px hoog en de primaire knop is direct herkenbaar als het enige blauwe vlak in beeld.
2. S-02-02 Een logistiek medewerker met Nederlands als tweede taal leest een vacature. De letter is open en rustig (Onest 17 px), regels zijn hooguit 66 tekens breed en status staat altijd ook in tekst.
3. S-02-03 Een werkzoekende vult het sollicitatieformulier in op een oude telefoon met trage verbinding. Velden, keuzerondjes, keuzevakjes en de keuzelijst zijn native HTML en werken zonder JavaScript; alleen de cv-keuze gebruikt een klein client-component.

Opdrachtgever
4. S-02-04 Een facilitair manager bekijkt de site op een laptop. Veel witruimte, één accentkleur en een strakke kopletter zeggen dat Groos het op orde heeft.
5. S-02-05 Een opdrachtgever deelt de link in WhatsApp. De OG-afbeelding toont het logo, een heldere kop en het domein.

Beheerder
6. S-02-06 Jimmy opent `/beheer` op zijn telefoon. Statusbadges hebben een vaste kleur per betekenis en altijd een tekstlabel, tabellen scrollen horizontaal binnen hun kader en meldingen verschijnen als toast.

Bouw en iteratie
7. S-02-07 Een bouw-agent bouwt een sectie en gebruikt alleen tokenklassen (`bg-primary`, `text-muted-foreground`, `bg-brand-tint`). Het standaardpalet van Tailwind staat uit, dus een vergeten `bg-blue-500` valt meteen op.
8. S-02-08 Djulan wil morgen het blauw iets aanpassen. Hij wijzigt één token in `app/globals.css` en de hexwaarde in `lib/brand.ts`; `node scripts/check-contrast.mjs` zegt direct of alle paren nog halen.

Merk buiten het scherm
9. S-02-09 Groos laat een hesje en een bus bedrukken. Het logo werkt in één kleur, de tegel met het beeldmerk werkt op 16 px als favicon en op de borst van een hesje.

## 3 Scope

Wel in fase 1:

| Id | Eis | Dient |
|---|---|---|
| E-02-01 | De merkrichting is wit met een touch blauw (B-01, richting C zonder limoen). Het primaire blauw is Groos-kobalt `#2741C9`, dieper en rustiger dan `#3340E0` uit context/12. | R-05 |
| E-02-02 | Elke tekstkleur haalt minimaal 4,5:1, lopende tekst en de primaire knop 7:1, niet-tekst 3:1. Een script en een eenheidstest bewaken dat. | R-15, R-14 |
| E-02-03 | Tailwind 3.4 gaat naar Tailwind 4.3 met tokens via `@theme inline` in `app/globals.css`; `tailwind.config.ts` verdwijnt, `tailwind-merge` gaat naar 3.x en kent de eigen tekstgroottes (B-34). | R-19, R-17 |
| E-02-04 | Koppen in Instrument Sans, tekst in Onest via `next/font/google` (subsets latin en latin-ext), basistekst 17 px, schaal met `clamp()` (B-28). | R-05, R-14, R-15 |
| E-02-05 | Vaste regels voor ruimte, containers, grid, sectieritme, radius, schaduw, randen, focus en doelgrootte van 44 px. | R-05, R-14, R-15 |
| E-02-06 | De JV-signature-klassen verdwijnen of worden minimaal (B-29); geen glas, gloed, raster, spotlight of marquee. | R-05, R-08 |
| E-02-07 | Een set primitives in `components/ui/*` met vaste API: CtaButton (met knopvarianten), Input, Textarea, NativeSelect, Field, Checkbox, RadioGroup, FileInput, Badge, Chip, Card, IconTile, Accordion, Sheet, Tabs, Table, Breadcrumb, Pagination, Skeleton, Alert, Toaster, PhotoSlot. | R-02, R-03, R-04, R-14 |
| E-02-08 | Formulierprimitives werken zonder JavaScript (native elementen), behalve de bestandskeuze (B-36). | R-04, R-14 |
| E-02-09 | Iconen uit lucide-react 0.456 met lijndikte 2, altijd met tekstlabel of `aria-hidden` naast tekst. | R-05, R-15 |
| E-02-10 | De site oogt verzorgd zonder foto's (B-25) en heeft optionele fotoslots. | R-05, R-12 |
| E-02-11 | Beweging is subtiel (reveal en hover), werkt zonder JavaScript en respecteert `prefers-reduced-motion`. | R-15 |
| E-02-12 | Het logo van de klant (B-61): het beeldmerk één op één en vlak overgenomen, met het woordmerk in het lettertype van de site, met constructie, opbouw horizontaal en gestapeld, varianten, minimale maat, vrije ruimte en gebruik op hesje en bus. | R-06 |
| E-02-13 | Het logo is inline SVG met `currentColor` (`Logo`, `LogoMark`), plus favicon, apple-icon, `public/brand/logo.png` (512 bij 512) voor JSON-LD en een e-maillogo. | R-06, R-09 |
| E-02-14 | De fonts voor de OG-afbeelding staan met `OFL.txt` in `assets/fonts/`; opmaak en bouw van de OG-afbeelding zijn van spec 12. | R-09 |
| E-02-15 | Het uiterlijk van header, mobiel menu, actiebalk en footer ligt vast; spec 01 levert de structuur. | R-01, R-05, R-14 |
| E-02-16 | De bouw-agent zet sub-agents in die via 21st.dev per plek kandidaten zoeken binnen deze tokens. | R-16 |
| E-02-17 | Niets in kleur, letter, logo of beeld lijkt op Wilk of J. Versseput. | R-08 |
| E-02-18 | Statusbadges in het beheer hebben een vaste toon per status uit 00 §4.3. | R-03, R-15 |

Niet in fase 1: een donker thema (de `.dark`-tokens verdwijnen), illustraties, eigen iconen, animaties met getallen, een logowand of keurmerkstrook (B-24, B-26), merkregistratie en drukwerk zelf.

Fase 2 of later: fotografie (vult de fotoslots), Pantone- en folieproef voor druk en belettering, een Cyrillische preload als er Bulgaarse pagina's komen (Onest heeft de subset al).

## 4 Pagina's en componenten

### 4.1 Merkrichting en kleur

**Beoordeling van kobalt `#3340E0`.** De tint uit context/12 C haalt AAA (7,12:1), maar op wit leest hij als elektrisch violetblauw (tint 235°, lichtheid 54 %). Op grote vlakken, zoals een CTA-band, oogt hij luid en bevestigt hij het risico dat context/12 zelf noemt: het voelt als een tech-start-up. Een iets diepere en minder violette tint geeft dezelfde frisheid met meer rust. Gekozen is **Groos-kobalt `#2741C9`** (tint 230°, verzadiging 68 %, lichtheid 47 %): duidelijk blauw en geen navy, 7,82:1 in beide richtingen, ver van het azuurblauw van Randstad (`#2175D9`, 213°) en lichter dan Olympia (`#213F99`). Geen limoen en geen tweede accentkleur.

| Kandidaat | HSL | Wit erop | Op ijs `#F5F6FA` | Oordeel |
|---|---|---|---|---|
| `#3340E0` (context/12) | 235 74 % 54 % | 7,12:1 | 6,59:1 | te elektrisch op grote vlakken |
| `#2E3FD4` | 234 66 % 51 % | 7,56:1 | 7,00:1 | nog violet |
| `#2C39D1` | 235 65 % 50 % | 8,04:1 | 7,44:1 | nog violet |
| **`#2741C9`** | **230 68 % 47 %** | **7,82:1** | **7,24:1** | **gekozen: rustig, betrouwbaar, helder** |
| `#2A36C4` | 235 65 % 47 % | 8,67:1 | 8,02:1 | zwaar en violet |
| `#1F3BC6` | 230 73 % 45 % | 8,40:1 | 7,78:1 | net te zwaar voor grote vlakken |

**Palet.** Eén blauwfamilie plus neutralen en statuskleuren.

| Rol | Naam | Hex | Gebruik |
|---|---|---|---|
| Achtergrond | Wit | `#FFFFFF` | standaardachtergrond |
| Tekst en koppen | Nacht (inkt) | `#0B0F2E` | alle tekst, koppen, woordmerk |
| Hulptekst | Leigrijs | `#4B5170` | intro's, meta, labels; haalt 7,75:1 dus ook voor lopende tekst |
| Merk | Groos-kobalt | `#2741C9` | primaire knop, links, iconen, focusring en de sikkel in het logo |
| Merk sterk | Diep kobalt | `#1C2F9E` | hover, nadruk, tekst op blauwtint |
| Merk subtiel | Lichtkobalt | `#7C8AE0` | alleen decoratief of groot (3,20:1), alleen op wit |
| Blauwtint | IJsblauw | `#EEF1FD` | rustige blauwe vlakken, icoontegels, selectie |
| IJs | IJs | `#F5F6FA` | wisselende sectieachtergrond, footer, skeleton |
| Rand | Rand | `#E3E6EF` | decoratieve randen en scheidingen |
| Rand sterk | Rand sterk | `#C9CEDD` | randen van secundaire knoppen en chips |
| Veldrand | Veldrand | `#8A90AA` | randen van invoervelden (3,16:1) |
| Op blauw gedempt | Lichtblauw | `#DCE1FF` | hulptekst op een blauw vlak |
| Succes | Groen | `#16794A`, tint `#E8F5EE`, sterk `#0F5E39` | gelukt, gepubliceerd, geplaatst |
| Waarschuwing | Oker | `#B45309`, tint `#FDF3E7`, sterk `#8A3F07` | gesloten, let op |
| Fout | Rood | `#C02B2B`, tint `#FCEDED`, sterk `#9E2020` | fouten, afgewezen, spam |
| Info | Petrol | `#0E6F8C`, tint `#E6F3F7`, sterk `#0B5A72` | gepland, in behandeling; bewust geen merkblauw |
| Neutraal | Grijstint | `#F1F2F6` | neutrale badges |

**Contrasttabel.** Berekend met de WCAG 2.x-formule voor relatieve luminantie (`scripts/check-contrast.mjs`, uitgevoerd op 2 oktober 2026). Alle paren halen hun eis.

| Voorgrond | Achtergrond | Gebruik | Ratio | Eis |
|---|---|---|---|---|
| `#0B0F2E` | `#FFFFFF` | tekst en koppen op wit | 18,72:1 | 7:1 |
| `#0B0F2E` | `#F5F6FA` | tekst op ijs | 17,33:1 | 7:1 |
| `#0B0F2E` | `#EEF1FD` | tekst op blauwtint | 16,61:1 | 7:1 |
| `#4B5170` | `#FFFFFF` | intro, meta, hulptekst | 7,75:1 | 7:1 |
| `#4B5170` | `#F5F6FA` | hulptekst op ijs | 7,18:1 | 4,5:1 |
| `#4B5170` | `#EEF1FD` | hulptekst op blauwtint | 6,88:1 | 4,5:1 |
| `#2741C9` | `#FFFFFF` | link en accent op wit | 7,82:1 | 4,5:1 |
| `#2741C9` | `#F5F6FA` | link op ijs | 7,24:1 | 4,5:1 |
| `#2741C9` | `#EEF1FD` | link en icoon op blauwtint | 6,94:1 | 4,5:1 |
| `#FFFFFF` | `#2741C9` | tekst op primaire knop en blauw vlak | 7,82:1 | 4,5:1, doel 7:1 |
| `#FFFFFF` | `#1C2F9E` | knoptekst bij hover | 10,77:1 | 4,5:1 |
| `#DCE1FF` | `#2741C9` | hulptekst op blauw vlak | 6,05:1 | 4,5:1 |
| `#1C2F9E` | `#FFFFFF` | nadruk en hovertekst | 10,77:1 | 4,5:1 |
| `#1C2F9E` | `#EEF1FD` | badge merk, geselecteerde chip | 9,56:1 | 4,5:1 |
| `#7C8AE0` | `#FFFFFF` | decoratief, grote cijfers vanaf 24 px | 3,20:1 | 3:1 |
| `#8A90AA` | `#FFFFFF` | rand van invoerveld | 3,16:1 | 3:1 |
| `#2741C9` | `#FFFFFF` | focusring | 7,82:1 | 3:1 |
| `#FFFFFF` | `#16794A` | tekst op succesvlak | 5,43:1 | 4,5:1 |
| `#0F5E39` | `#E8F5EE` | badge succes | 6,99:1 | 4,5:1 |
| `#FFFFFF` | `#B45309` | tekst op waarschuwingsvlak | 5,02:1 | 4,5:1 |
| `#8A3F07` | `#FDF3E7` | badge waarschuwing | 6,85:1 | 4,5:1 |
| `#FFFFFF` | `#C02B2B` | destructieve knop | 5,80:1 | 4,5:1 |
| `#C02B2B` | `#FFFFFF` | foutmelding op wit | 5,80:1 | 4,5:1 |
| `#9E2020` | `#FCEDED` | badge fout | 6,89:1 | 4,5:1 |
| `#FFFFFF` | `#0E6F8C` | tekst op infovlak | 5,72:1 | 4,5:1 |
| `#0B5A72` | `#E6F3F7` | badge info | 6,81:1 | 4,5:1 |
| `#4B5170` | `#F1F2F6` | badge neutraal | 6,93:1 | 4,5:1 |

Regels die uit de tabel volgen: `brand-subtle` nooit voor tekst onder 24 px en nooit op ijs (2,96:1); de decoratieve `border` (1,25:1) nooit als enige grens van een bedieningselement; status nooit alleen met kleur (WCAG 1.4.1), altijd met tekst of icoon.

### 4.2 Tokenset en `app/globals.css`

Formaat: hexwaarden in `:root`, gekoppeld via `@theme inline`. Daardoor rekenen opacity-modifiers (`bg-brand/15`) via `color-mix`, en werken lokale overschrijvingen van tokens (zoals `.surface-brand`) door in alle utilities. Het standaardpalet van Tailwind staat uit (`--color-*: initial`); alleen `white` en `black` blijven. `dark:` werkt alleen onder een `.dark`-klasse die de site nooit zet, zodat klassen uit shadcn of 21st.dev niet op de systeeminstelling reageren.

Tokens in het kort (naam van de utility tussen haakjes):

| Groep | Tokens |
|---|---|
| shadcn | `background`, `foreground`, `card(-foreground)`, `popover(-foreground)`, `primary(-foreground)`, `secondary(-foreground)`, `muted(-foreground)`, `accent(-foreground)`, `destructive(-foreground)`, `border`, `input`, `ring`, `radius` |
| merk | `brand-tint`, `brand-subtle`, `brand`, `brand-strong`, `on-brand-muted`, `border-strong` |
| neutraal | `ink`, `ink-foreground`, `ice`, `neutral-tint` |
| status | `success`, `warning`, `info` elk met `-foreground`, `-tint`, `-strong`; `destructive-tint`, `destructive-strong` |
| radius | `rounded-sm` 6 px, `rounded-md` 8 px, `rounded-lg` 10 px, `rounded-xl` 14 px, `rounded-2xl` 18 px |
| tekst | `text-xs` 13 px, `text-sm` 15 px, `text-base` 17 px, `text-lead`, `text-h3`, `text-h2`, `text-h1`, `text-hero` (zie §4.4) |
| schaduw | `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, getint met nacht |
| beweging | `ease-brand` (`cubic-bezier(0.22, 1, 0.36, 1)`) |
| hulpklassen | `container`, `container-narrow`, `measure`, `section`, `section-tight`, `link`, `.surface-brand`, `.column-lines`, `.deco`, `.deco-grid`, `.deco-dots`, `.deco-glow`, `section-rule`, `.prose-groos`, `.accent-text`, `.control-check`, `.control-radio`, `.accordion-item`, `.reveal`, `.reveal-group` |

Volledige inhoud van `app/globals.css` (gecompileerd en getest met Tailwind 4.3.3 en `tw-animate-css` 1.4.0 op 2 oktober 2026):

```css
/*
  Groos designsysteem (spec 02). De enige plek voor kleur, radius, typografie,
  schaduw en beweging. Alleen een licht thema (B-01). Hexwaarden gelijk houden
  met lib/brand.ts; scripts/check-contrast.mjs controleert beide.
*/
@import "tailwindcss";
@import "tw-animate-css";

/* dark: werkt alleen onder een .dark-klasse, die de site nooit zet. Zo
   reageren shadcn-klassen met dark: niet op de systeeminstelling. */
@custom-variant dark (&:where(.dark, .dark *));

:root {
  color-scheme: light;

  --background: #ffffff;
  --foreground: #0b0f2e;
  --card: #ffffff;
  --card-foreground: #0b0f2e;
  --popover: #ffffff;
  --popover-foreground: #0b0f2e;

  --primary: #2741c9;
  --primary-foreground: #ffffff;
  --secondary: #eef1fd;
  --secondary-foreground: #1c2f9e;
  --muted: #f5f6fa;
  --muted-foreground: #4b5170;
  --accent: #eef1fd;
  --accent-foreground: #1c2f9e;
  --destructive: #c02b2b;
  --destructive-foreground: #ffffff;

  --border: #e3e6ef;
  --border-strong: #c9cedd;
  --input: #8a90aa;
  --ring: #2741c9;

  --brand-tint: #eef1fd;
  --brand-subtle: #7c8ae0;
  --brand: #2741c9;
  --brand-strong: #1c2f9e;
  --on-brand-muted: #dce1ff;

  --ink: #0b0f2e;
  --ink-foreground: #ffffff;
  --ice: #f5f6fa;

  --success: #16794a;
  --success-foreground: #ffffff;
  --success-tint: #e8f5ee;
  --success-strong: #0f5e39;
  --warning: #b45309;
  --warning-foreground: #ffffff;
  --warning-tint: #fdf3e7;
  --warning-strong: #8a3f07;
  --destructive-tint: #fceded;
  --destructive-strong: #9e2020;
  --info: #0e6f8c;
  --info-foreground: #ffffff;
  --info-tint: #e6f3f7;
  --info-strong: #0b5a72;
  --neutral-tint: #f1f2f6;

  --radius: 0.625rem;
}

@theme inline {
  /* Alleen merktokens: het standaardpalet van Tailwind staat uit. */
  --color-*: initial;
  --color-white: #ffffff;
  --color-black: #000000;

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-destructive-tint: var(--destructive-tint);
  --color-destructive-strong: var(--destructive-strong);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-brand: var(--brand);
  --color-brand-tint: var(--brand-tint);
  --color-brand-subtle: var(--brand-subtle);
  --color-brand-strong: var(--brand-strong);
  --color-on-brand-muted: var(--on-brand-muted);
  --color-ink: var(--ink);
  --color-ink-foreground: var(--ink-foreground);
  --color-ice: var(--ice);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-success-tint: var(--success-tint);
  --color-success-strong: var(--success-strong);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-warning-tint: var(--warning-tint);
  --color-warning-strong: var(--warning-strong);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-info-tint: var(--info-tint);
  --color-info-strong: var(--info-strong);
  --color-neutral-tint: var(--neutral-tint);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);

  --font-sans: var(--font-onest), ui-sans-serif, system-ui, sans-serif;
  --font-display: var(--font-instrument), var(--font-onest), ui-sans-serif, system-ui, sans-serif;

  --text-xs: 0.8125rem;
  --text-xs--line-height: 1.45;
  --text-sm: 0.9375rem;
  --text-sm--line-height: 1.5;
  --text-base: 1.0625rem;
  --text-base--line-height: 1.65;
  --text-lead: clamp(1.125rem, 1.07rem + 0.25vw, 1.25rem);
  --text-lead--line-height: 1.6;
  --text-h3: clamp(1.1875rem, 1.12rem + 0.3vw, 1.375rem);
  --text-h3--line-height: 1.3;
  --text-h3--letter-spacing: -0.01em;
  --text-h3--font-weight: 600;
  --text-h2: clamp(1.625rem, 1.3rem + 1.4vw, 2.375rem);
  --text-h2--line-height: 1.15;
  --text-h2--letter-spacing: -0.015em;
  --text-h2--font-weight: 600;
  --text-h1: clamp(2rem, 1.5rem + 2.4vw, 3.25rem);
  --text-h1--line-height: 1.08;
  --text-h1--letter-spacing: -0.02em;
  --text-h1--font-weight: 600;
  --text-hero: clamp(2.375rem, 1.6rem + 3.4vw, 4.25rem);
  --text-hero--line-height: 1.04;
  --text-hero--letter-spacing: -0.025em;
  --text-hero--font-weight: 600;

  --shadow-xs: 0 1px 2px 0 rgb(11 15 46 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(11 15 46 / 0.06), 0 1px 2px -1px rgb(11 15 46 / 0.06);
  --shadow-md: 0 6px 16px -4px rgb(11 15 46 / 0.08), 0 2px 4px -2px rgb(11 15 46 / 0.06);
  --shadow-lg: 0 16px 40px -12px rgb(11 15 46 / 0.16), 0 4px 8px -4px rgb(11 15 46 / 0.06);

  --ease-brand: cubic-bezier(0.22, 1, 0.36, 1);

  /* Alleen voor de oude JV-secties; vervalt in bouwstap 4. */
  --tracking-brand: 0.22em;
}

@layer base {
  *,
  ::before,
  ::after {
    border-color: var(--border);
  }
  html {
    background-color: var(--background);
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }
  body {
    background-color: var(--background);
    color: var(--foreground);
    font-family: var(--font-sans);
    font-size: var(--text-base);
    line-height: var(--text-base--line-height);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
  h1,
  h2,
  h3 {
    font-family: var(--font-display);
    font-weight: 600;
    color: var(--foreground);
    text-wrap: balance;
  }
  h1 {
    font-size: var(--text-h1);
    line-height: var(--text-h1--line-height);
    letter-spacing: var(--text-h1--letter-spacing);
  }
  h2 {
    font-size: var(--text-h2);
    line-height: var(--text-h2--line-height);
    letter-spacing: var(--text-h2--letter-spacing);
  }
  h3 {
    font-size: var(--text-h3);
    line-height: var(--text-h3--line-height);
    letter-spacing: var(--text-h3--letter-spacing);
  }
  p {
    text-wrap: pretty;
  }
  :focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }
  ::selection {
    background-color: color-mix(in oklab, var(--brand) 18%, transparent);
    color: var(--ink);
  }
  [id] {
    scroll-margin-top: 5.5rem;
  }
  @supports (interpolate-size: allow-keywords) {
    :root {
      interpolate-size: allow-keywords;
    }
  }
}

@layer components {
  /* Accentwoorden in koppen via <accent> in messages. */
  .accent-text {
    color: var(--brand);
  }

  /* Blauw vlak: zet de tokens binnen het vlak om, zodat knoppen, tekst,
     iconen en focus vanzelf wit worden. Hooguit één per pagina. */
  .surface-brand {
    --background: #2741c9;
    --foreground: #ffffff;
    --card: #2741c9;
    --card-foreground: #ffffff;
    --muted-foreground: #dce1ff;
    --primary: #ffffff;
    --primary-foreground: #1c2f9e;
    --brand: #ffffff;
    --brand-strong: #eef1fd;
    --brand-subtle: #aab4f0;
    --brand-tint: rgb(255 255 255 / 0.12);
    --border: rgb(255 255 255 / 0.2);
    --border-strong: rgb(255 255 255 / 0.5);
    --ring: #ffffff;
    background-color: #2741c9;
    color: #ffffff;
  }

  /* Decoratie achter inhoud: altijd flauw, altijd uitlopend, nooit een gekleurd
     vlak. De lijnkleur is het border-token, dus binnen .surface-brand wordt
     alles vanzelf wit op lage dekking.

     ColumnLines (components/ui/column-lines.tsx): een veld van dunne
     verticale kolomlijnen, gecentreerd, met een radiale uitloop. De wrapper
     isoleert, zodat het veld achter de inhoud maar boven de eigen achtergrond
     ligt. --cl-at verplaatst het middelpunt van de uitloop. */
  .column-lines {
    position: relative;
    isolation: isolate;
  }
  .column-lines-field {
    position: absolute;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
    border-radius: inherit;
    -webkit-mask-image: radial-gradient(ellipse at var(--cl-at, 50% 50%), #000 var(--cl-fade-start, 30%), transparent var(--cl-fade-end, 70%));
    mask-image: radial-gradient(ellipse at var(--cl-at, 50% 50%), #000 var(--cl-fade-start, 30%), transparent var(--cl-fade-end, 70%));
  }
  .column-lines-field::before {
    content: "";
    position: absolute;
    inset-block: 0;
    left: 50%;
    width: calc(var(--cl-width, 80px) * var(--cl-count, 14) + 1px);
    translate: -50% 0;
    background-image:
      repeating-linear-gradient(to right, var(--border) 0 1px, transparent 1px var(--cl-width, 80px)),
      repeating-linear-gradient(
        to right,
        color-mix(in oklab, var(--border) 34%, transparent) 0,
        transparent calc(var(--cl-width, 80px) * 0.8),
        transparent var(--cl-width, 80px)
      );
  }

  /* GridPattern (components/ui/grid-pattern.tsx): fijn ruitjesraster of
     stippenraster met een radiale uitloop. De ouder is relative en isolate. */
  .deco {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    border-radius: inherit;
    -webkit-mask-image: radial-gradient(ellipse var(--deco-shape, 70% 80%) at var(--deco-at, 50% 0%), #000 8%, transparent 72%);
    mask-image: radial-gradient(ellipse var(--deco-shape, 70% 80%) at var(--deco-at, 50% 0%), #000 8%, transparent 72%);
  }
  .deco-grid {
    background-image:
      linear-gradient(to right, var(--border) 1px, transparent 1px),
      linear-gradient(to bottom, var(--border) 1px, transparent 1px);
    background-size: var(--deco-size, 40px) var(--deco-size, 40px);
    background-position: center top;
  }
  .deco-dots {
    background-image: radial-gradient(circle, var(--border-strong) 1px, transparent 1.5px);
    background-size: var(--deco-size, 20px) var(--deco-size, 20px);
    background-position: center top;
  }

  /* Zachte gloed in de blauwtint rechts: twee grote radiale verlopen die
     binnen het vlak aan alle kanten tot niets uitlopen, dus zonder rand of band. */
  .deco-glow {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background-image:
      radial-gradient(ellipse 46% 50% at 90% 46%, var(--brand-tint), transparent 72%),
      radial-gradient(ellipse 26% 32% at 70% 34%, color-mix(in oklab, var(--brand-subtle) 14%, transparent), transparent 70%);
  }

  /* Lange tekst: juridische pagina's en vacatureteksten. */
  .prose-groos {
    max-width: 66ch;
  }
  .prose-groos > * + * {
    margin-top: 1em;
  }
  .prose-groos h2 {
    margin-top: 2.25em;
    font-size: 1.5rem;
    line-height: 1.25;
  }
  .prose-groos h3 {
    margin-top: 1.75em;
    font-size: 1.1875rem;
    line-height: 1.3;
  }
  .prose-groos ul,
  .prose-groos ol {
    padding-left: 1.25em;
  }
  .prose-groos ul {
    list-style: disc;
  }
  .prose-groos ol {
    list-style: decimal;
  }
  .prose-groos li + li {
    margin-top: 0.4em;
  }
  .prose-groos li::marker {
    color: var(--brand-subtle);
  }
  .prose-groos a {
    color: var(--brand);
    text-decoration: underline;
    text-decoration-color: color-mix(in oklab, var(--brand) 40%, transparent);
    text-underline-offset: 0.2em;
  }
  .prose-groos a:hover {
    color: var(--brand-strong);
    text-decoration-color: currentColor;
  }

  /* Native keuzevakjes en keuzerondjes: werken zonder JavaScript (B-36). */
  .control-check,
  .control-radio {
    appearance: none;
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
    border: 1.5px solid var(--input);
    background-color: var(--background);
    background-position: center;
    background-repeat: no-repeat;
    transition: background-color 150ms, border-color 150ms;
  }
  .control-check {
    border-radius: 0.3125rem;
  }
  .control-radio {
    border-radius: 9999px;
  }
  .control-check:checked {
    border-color: var(--primary);
    background-color: var(--primary);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5 10.5l3 3 7-7' fill='none' stroke='%23ffffff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-size: 100% 100%;
  }
  .control-radio:checked {
    border: 6px solid var(--primary);
  }
  .control-check[aria-invalid="true"],
  .control-radio[aria-invalid="true"] {
    border-color: var(--destructive);
  }
  .control-check:disabled,
  .control-radio:disabled {
    border-color: var(--border-strong);
    background-color: var(--muted);
    cursor: not-allowed;
  }
  @media (forced-colors: active) {
    .control-check,
    .control-radio {
      appearance: auto;
    }
  }

  /* Uitklapblok op <details>: hoogte-animatie waar de browser dat kan. */
  .accordion-item::details-content {
    block-size: 0;
    overflow-y: clip;
    transition:
      block-size 200ms var(--ease-brand),
      content-visibility 200ms allow-discrete;
  }
  .accordion-item[open]::details-content {
    block-size: auto;
  }
}

@utility container {
  margin-inline: auto;
  padding-inline: 1.25rem;
  max-width: 80rem;
  @media (width >= 64rem) {
    padding-inline: 2rem;
  }
}

@utility container-narrow {
  width: 100%;
  margin-inline: auto;
  padding-inline: 1.25rem;
  max-width: 48rem;
}

@utility measure {
  max-width: 66ch;
}

/* Eén witte pagina: secties scheiden met ruimte, haarlijnen en kaarten. */
@utility section {
  padding-block: clamp(3.25rem, 2.5rem + 3vw, 5rem);
}

/* Haarlijn op containerbreedte boven een sectie: de scheiding tussen secties
   op de beroeps- en dienstpagina's, in plaats van een achtergrondband. */
@utility section-rule {
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    inset-inline: 1.25rem;
    height: 1px;
    background-color: var(--border);
    @media (width >= 64rem) {
      inset-inline: max(2rem, calc((100% - 80rem) / 2 + 2rem));
    }
  }
}

@utility section-tight {
  padding-block: clamp(2.5rem, 2rem + 2vw, 4rem);
}

@utility link {
  color: var(--brand);
  text-decoration-line: underline;
  text-decoration-color: color-mix(in oklab, var(--brand) 40%, transparent);
  text-underline-offset: 0.2em;
  &:hover {
    color: var(--brand-strong);
    text-decoration-color: currentColor;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}

/* Reveal zonder JavaScript: scroll-gedreven CSS. Zonder ondersteuning, zonder
   JavaScript of met reduced motion staat de inhoud gewoon zichtbaar. */
@keyframes reveal-in {
  from {
    opacity: 0;
    transform: translateY(var(--reveal-y, 12px));
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .reveal {
      animation: reveal-in linear both;
      animation-timeline: view();
      animation-range: entry calc(5% + var(--reveal-index, 0) * 6%) cover calc(22% + var(--reveal-index, 0) * 6%);
    }
    .reveal-group > :nth-child(2) { --reveal-index: 1; }
    .reveal-group > :nth-child(3) { --reveal-index: 2; }
    .reveal-group > :nth-child(4) { --reveal-index: 3; }
    .reveal-group > :nth-child(5) { --reveal-index: 4; }
    .reveal-group > :nth-child(n + 6) { --reveal-index: 5; }
  }
}
```

### 4.3 `lib/brand.ts`, `lib/contrast-pairs.json` en het contrastscript

`lib/brand.ts` houdt de hexwaarden voor plekken zonder CSS-variabelen (favicon, apple-icon, OG-afbeelding, e-mail, `viewport.themeColor`). De sleutels `background`, `foreground`, `muted` en `accent` blijven bestaan, omdat de OG-afbeelding van spec 12 en de layout van spec 01 ze gebruiken. `initials` vervalt.

```ts
/**
 * Merkwaarden voor plekken waar CSS-variabelen niet werken: OG-afbeelding,
 * favicon, apple-icon, e-mail en themakleur. Houd de hexwaarden gelijk aan
 * app/globals.css; scripts/check-contrast.mjs controleert dat.
 */
export const brand = {
  wordmark: "groos",
  descriptor: "Personeelsdiensten",
  colors: {
    background: "#FFFFFF",
    foreground: "#0B0F2E",
    muted: "#4B5170",
    accent: "#2741C9",
    brand: "#2741C9",
    brandStrong: "#1C2F9E",
    brandTint: "#EEF1FD",
    brandSubtle: "#7C8AE0",
    onBrandMuted: "#DCE1FF",
    ice: "#F5F6FA",
    border: "#E3E6EF",
    input: "#8A90AA",
    success: "#16794A",
    warning: "#B45309",
    danger: "#C02B2B",
    info: "#0E6F8C",
  },
} as const;

export type BrandColor = keyof typeof brand.colors;
```

`lib/contrast-pairs.json` is de enige bron van de contrastparen. `scripts/check-contrast.mjs` (deze spec) en `tests/unit/design/contrast.test.ts` (spec 14) lezen hem allebei.

```json
{
  "$comment": "Contrastparen uit spec 02 §4.1. Gelezen door scripts/check-contrast.mjs en tests/unit/design/contrast.test.ts (spec 14).",
  "pairs": [
    {
      "fg": "foreground",
      "bg": "background",
      "min": 7,
      "use": "tekst en koppen op wit"
    },
    {
      "fg": "foreground",
      "bg": "ice",
      "min": 7,
      "use": "tekst op ijs"
    },
    {
      "fg": "foreground",
      "bg": "brand-tint",
      "min": 7,
      "use": "tekst op blauwtint"
    },
    {
      "fg": "muted-foreground",
      "bg": "background",
      "min": 7,
      "use": "intro, meta en hulptekst op wit"
    },
    {
      "fg": "muted-foreground",
      "bg": "muted",
      "min": 4.5,
      "use": "hulptekst op ijs"
    },
    {
      "fg": "muted-foreground",
      "bg": "brand-tint",
      "min": 4.5,
      "use": "hulptekst op blauwtint"
    },
    {
      "fg": "brand",
      "bg": "background",
      "min": 4.5,
      "use": "link en accent op wit"
    },
    {
      "fg": "brand",
      "bg": "ice",
      "min": 4.5,
      "use": "link op ijs"
    },
    {
      "fg": "brand",
      "bg": "brand-tint",
      "min": 4.5,
      "use": "link en icoon op blauwtint"
    },
    {
      "fg": "primary-foreground",
      "bg": "primary",
      "min": 7,
      "use": "tekst op primaire knop en blauw vlak"
    },
    {
      "fg": "primary-foreground",
      "bg": "brand-strong",
      "min": 4.5,
      "use": "tekst op knop bij hover"
    },
    {
      "fg": "on-brand-muted",
      "bg": "brand",
      "min": 4.5,
      "use": "hulptekst op blauw vlak"
    },
    {
      "fg": "brand-strong",
      "bg": "background",
      "min": 4.5,
      "use": "nadruk en hovertekst"
    },
    {
      "fg": "brand-strong",
      "bg": "brand-tint",
      "min": 4.5,
      "use": "badge merk, chip geselecteerd"
    },
    {
      "fg": "brand-subtle",
      "bg": "background",
      "min": 3,
      "use": "decoratief en grote cijfers, alleen op wit"
    },
    {
      "fg": "input",
      "bg": "background",
      "min": 3,
      "use": "rand van invoerveld"
    },
    {
      "fg": "ring",
      "bg": "background",
      "min": 3,
      "use": "focusring"
    },
    {
      "fg": "success-foreground",
      "bg": "success",
      "min": 4.5,
      "use": "tekst op succesvlak"
    },
    {
      "fg": "success-strong",
      "bg": "success-tint",
      "min": 4.5,
      "use": "badge succes"
    },
    {
      "fg": "warning-foreground",
      "bg": "warning",
      "min": 4.5,
      "use": "tekst op waarschuwingsvlak"
    },
    {
      "fg": "warning-strong",
      "bg": "warning-tint",
      "min": 4.5,
      "use": "badge waarschuwing"
    },
    {
      "fg": "destructive-foreground",
      "bg": "destructive",
      "min": 4.5,
      "use": "tekst op destructieve knop"
    },
    {
      "fg": "destructive",
      "bg": "background",
      "min": 4.5,
      "use": "foutmelding op wit"
    },
    {
      "fg": "destructive-strong",
      "bg": "destructive-tint",
      "min": 4.5,
      "use": "badge fout"
    },
    {
      "fg": "info-foreground",
      "bg": "info",
      "min": 4.5,
      "use": "tekst op infovlak"
    },
    {
      "fg": "info-strong",
      "bg": "info-tint",
      "min": 4.5,
      "use": "badge info"
    },
    {
      "fg": "muted-foreground",
      "bg": "neutral-tint",
      "min": 4.5,
      "use": "badge neutraal"
    }
  ],
  "brandToToken": {
    "background": "background",
    "foreground": "foreground",
    "muted": "muted-foreground",
    "accent": "brand",
    "brand": "brand",
    "brandStrong": "brand-strong",
    "brandTint": "brand-tint",
    "brandSubtle": "brand-subtle",
    "onBrandMuted": "on-brand-muted",
    "ice": "ice",
    "border": "border",
    "input": "input",
    "success": "success",
    "warning": "warning",
    "danger": "destructive",
    "info": "info"
  }
}
```

`scripts/check-contrast.mjs`:

```js
// Contrastcontrole voor de tokens van spec 02 en gelijkheid van lib/brand.ts
// met app/globals.css. Gebruik: node scripts/check-contrast.mjs
import { readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const { pairs, brandToToken } = JSON.parse(read("lib/contrast-pairs.json"));
const root = read("app/globals.css").match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
const tokens = Object.fromEntries(
  [...root.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)].map(([, k, v]) => [k, v.toLowerCase()]),
);
const brand = Object.fromEntries(
  [...read("lib/brand.ts").matchAll(/(\w+):\s*"(#[0-9a-fA-F]{6})"/g)].map(([, k, v]) => [k, v.toLowerCase()]),
);

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map((v) => lin(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

let fails = 0;
for (const { fg, bg, min, use } of pairs) {
  const a = tokens[fg];
  const b = tokens[bg];
  if (!a || !b) {
    console.log(`ONTBREEKT --${fg} of --${bg}`);
    fails++;
    continue;
  }
  const r = ratio(a, b);
  if (r < min) fails++;
  console.log(`${r >= min ? "ok    " : "FAALT "} --${fg} op --${bg}: ${r.toFixed(2)}:1, minimaal ${min}:1 (${use})`);
}
for (const [key, token] of Object.entries(brandToToken)) {
  if (brand[key] !== tokens[token]) {
    console.log(`VERSCHIL lib/brand.ts ${key} = ${brand[key]}, --${token} = ${tokens[token]}`);
    fails++;
  }
}
console.log(fails ? `\n${fails} probleem of problemen.` : "\nAlle contrastparen en merkwaarden kloppen.");
process.exit(fails ? 1 : 0);
```

Het script draait zonder dependencies met `node scripts/check-contrast.mjs` en eindigt met exitcode 1 bij een paar onder de drempel of een verschil tussen `lib/brand.ts` en de tokens. Spec 14 mag het opnemen in `npm run check`.

### 4.4 Typografie

**Fonts** in `lib/fonts.ts` (font-definitiebestand volgens de Next-docs, zodat `app/[locale]/layout.tsx`, `app/beheer/layout.tsx`, `app/global-error.tsx` en `app/global-not-found.tsx` dezelfde instantie gebruiken):

```ts
import { Instrument_Sans, Onest } from "next/font/google";

/** Lopende tekst en interface. Onest heeft ook Cyrillisch; dat wordt niet vooraf geladen. */
export const fontSans = Onest({
  subsets: ["latin", "latin-ext"],
  variable: "--font-onest",
  display: "swap",
});

/** Koppen en woordmerk. Variabel gewicht 400 tot 700, standaardbreedte. */
export const fontDisplay = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument",
  display: "swap",
});
```

De variabelen heten `--font-onest` en `--font-instrument`, zodat `@theme inline` ze zonder kringverwijzing koppelt aan `--font-sans` en `--font-display`. De utilities blijven `font-sans` en `font-display`. In de layout: `<html className={cn(fontSans.variable, fontDisplay.variable)}>` en `<body className="... bg-background font-sans text-foreground antialiased">` (structuur bij spec 01). De breedte-as van Instrument Sans wordt niet geladen; koppen staan op breedte 100.

**Schaal.** Mobiel eerst, vloeiend tussen 390 en 1440 px.

| Token | Waarde | Op 390 px | Op 1440 px | Regelhoogte | Spatiëring | Gewicht | Gebruik |
|---|---|---|---|---|---|---|---|
| `text-hero` | `clamp(2.375rem, 1.6rem + 3.4vw, 4.25rem)` | 38 px | 68 px | 1,04 | -0,025 em | 600 | alleen de h1 van de homepage |
| `text-h1` | `clamp(2rem, 1.5rem + 2.4vw, 3.25rem)` | 33 px | 52 px | 1,08 | -0,02 em | 600 | h1 van alle andere pagina's |
| `text-h2` | `clamp(1.625rem, 1.3rem + 1.4vw, 2.375rem)` | 26 px | 38 px | 1,15 | -0,015 em | 600 | sectiekoppen |
| `text-h3` | `clamp(1.1875rem, 1.12rem + 0.3vw, 1.375rem)` | 19 px | 22 px | 1,3 | -0,01 em | 600 | itemtitels (B-05) |
| `text-lead` | `clamp(1.125rem, 1.07rem + 0.25vw, 1.25rem)` | 18 px | 20 px | 1,6 | 0 | 400 | intro onder h1 en h2 |
| `text-base` | `1.0625rem` | 17 px | 17 px | 1,65 | 0 | 400 | lopende tekst |
| `text-sm` | `0.9375rem` | 15 px | 15 px | 1,5 | 0 | 400 of 500 | labels, navigatie, meta |
| `text-xs` | `0.8125rem` | 13 px | 13 px | 1,45 | 0 | 500 | badges, juridische regel |

Regels:
- Koppen: `font-display`, gewicht 600, `text-wrap: balance`, kleur `foreground`. Geen gewicht onder 400 in de hele site; `font-light` verdwijnt.
- Tekst: Onest 400, nadruk 600, interface en knoppen 500. Getallen in lonen, uren en tabellen met `tabular-nums`.
- Maximale regellengte: lopende tekst `measure` (66 tekens), intro's `max-w-[60ch]`, koppen `max-w-[22ch]` voor h1 en `max-w-[28ch]` voor h2 waar ze los staan.
- Accentwoord in een kop via `<accent>` in messages en de klasse `.accent-text` (kobalt). Het accent draagt geen informatie die een schermlezer mist (spec 03).
- Geen hoofdletterlabels met ruime spatiëring boven koppen (B-05). `tracking-brand` blijft alleen tot stap 4 voor de oude secties.

### 4.5 Ruimte, layout en vorm

| Onderwerp | Regel |
|---|---|
| Spatiëring | Tailwind 4-schaal (0,25 rem per stap). Binnen een kaart `gap-4`, tussen kop en tekst `mt-4`, tussen sectiekop en inhoud `mt-10 md:mt-14`. |
| Containers | `container`: volle breedte, gecentreerd, maximaal 80 rem (1280 px inclusief marge), zijmarge 20 px en vanaf 1024 px 32 px. `container-narrow`: maximaal 48 rem voor bedankpagina's en formulieren. Juridische pagina's gebruiken `container` met `prose-groos` (spec 09). |
| Grid | Kaarten: 1 kolom, vanaf `md` 2, vanaf `lg` 3, `gap-4 md:gap-6`. Detailpagina's: hoofdkolom en zijkolom `lg:grid-cols-[minmax(0,1fr)_22rem] gap-10`. |
| Sectieritme | Eén achtergrond: elke publieke pagina staat op wit, zonder afwisselende grijze of getinte banden; alleen de footer is een grijs vlak (`bg-ice`). `section`: verticale ruimte `clamp(3.25rem, 2.5rem + 3vw, 5rem)` (52 tot 80 px). `section-tight` voor korte blokken: 40 tot 64 px. Secties scheiden met ruimte, kaarten en haarlijnen: de sectiecomponenten van spec 05 dragen `section-rule`, een haarlijn op containerbreedte boven de sectie. Hooguit één `.surface-brand` per pagina, als kaart op wit. |
| Radius | Knoppen en velden `rounded-lg` (10 px); kaarten, panelen en sheets `rounded-2xl` (18 px); icoontegels `rounded-lg` of `rounded-xl`; badges en chips `rounded-full`. Geen pilvormige hoofdknoppen meer. |
| Schaduw | Kaarten standaard zonder schaduw, alleen een rand van 1 px in `border-border`. `shadow-xs` op primaire knop, velden en de deuren van de hero, `shadow-md` op een kaart bij hover (met `motion-safe:hover:-translate-y-0.5`), `shadow-lg` op popovers, sheets en toasts. |
| Randen | 1 px. Decoratief `border-border`; knoppen en chips `border-border-strong`; velden `border-input`; tabelregels `border-border`. |
| Focus | Overal `:focus-visible` met een omlijning van 2 px in `--ring` (kobalt) op 2 px afstand. Velden tonen focus met een kobaltrand en een ring van 4 px op 15 % dekking. Binnen `.surface-brand` wordt de ring wit. |
| Doelgrootte | Elke knop, elk veld, elke keuzelijst en elk element met `data-slot="cta-button"` is op 390 px minstens 44 px hoog. Keuzevakjes en keuzerondjes zijn 20 px, maar hun klikbare label is minstens 44 px hoog. Links in lopende tekst zijn uitgezonderd. |
| Ankers | `scroll-margin-top: 5.5rem` op elk element met `id`, zodat de vaste header van 64 px niets afdekt. |

### 4.6 Signature-klassen (B-29)

| Klasse of effect | Besluit | Gevolg voor componenten (stap 2) |
|---|---|---|
| `.accent-text` | blijft, kleur `--brand` | geen; koppen met `<accent>` worden kobalt |
| `.glass-panel` | vervalt | `site-header.tsx` (actiebalk), `offerte-form.tsx` en `assurance.tsx`: vervangen door `border border-border bg-card` |
| `.logo-mono` | vervalt (geen logowand, B-26) | `clients.tsx` gebruikt hem tot spec 04 de sectie verwijdert; klasse doet dan niets |
| `.hairline` | vervalt | `legal-page.tsx` en `service-steps.tsx`: vervangen door `h-px bg-border` |
| `.bg-grid` | vervalt | `legal-page.tsx`, `metrics.tsx`, `service-ticker.tsx`, `werkgebied/page.tsx`: klasse weghalen |
| `.spotlight` | vervalt | `services.tsx`: klasse en de muisvolger weghalen |
| `.blend-top` | vervalt (ongebruikt) | geen |
| `animate-glow-pulse`, `light-sweep`, `shimmer`, `fade-up`, `marquee` | vervallen met `tailwind.config.ts` | `hero.tsx`: de gloeiende achtergrond-div weghalen |
| Radiale gloed via `hsl(var(--brand)/…)` | vervalt | de divs in `hero.tsx:30`, `assurance.tsx:25`, `service-cta.tsx:21`, `service-ticker.tsx:60` en `service-hero.tsx:30` weghalen |
| Verloop via `hsl(var(--muted))` | vervalt | `projects.tsx:43` en `segment-accordion.tsx:36,90`: `bg-muted` |
| Gloed-hoverschaduw | vervalt | `button.tsx:13` (bestand verdwijnt), `trust-bar.tsx:36`: `hover:shadow-[…]` weghalen |
| Nieuw: `.surface-brand` | het enige blauwe vlak, zet tokens lokaal om | CTA-band van spec 04 en 05 |
| `.pattern-oo` | vervallen (3 oktober 2026): het patroon kwam uit een logoconcept dat is afgevallen | vervangen door `ColumnLines` of `GridPattern`, of door niets |
| Nieuw: decoratie (`.column-lines`, `.deco`, `.deco-grid`, `.deco-dots`, `.deco-glow`) | dunne kolomlijnen, een fijn ruitjesraster, een stippenraster of een zachte gloed, altijd in het border-token of de blauwtint op lage dekking en altijd radiaal uitlopend, nooit een gekleurd vlak | `ColumnLines` (`components/ui/column-lines.tsx`) op de blauwe afsluiter; `GridPattern` (`components/ui/grid-pattern.tsx`) in de twee brede beroepskaarten en in `PhotoSlot`; de hero heeft drie achtergronden ter keuze (`none`, `grid`, `glow`, standaard `none`). Hooguit twee of drie per pagina, nooit achter lopende tekst op volle sterkte |
| Nieuw: `section-rule` | haarlijn op containerbreedte boven een sectie | de sectiecomponenten van spec 05 en de formuliersectie van `/contact` |
| Nieuw: `.prose-groos` | opmaak voor lange tekst | juridische pagina's (09), vacaturetekst (06) |

`Marquee` (`components/ui/marquee.tsx`) en `CountUp` (`components/motion/count-up.tsx`) vervallen; ze worden verwijderd in dezelfde stap waarin spec 04 `Clients` en `Metrics` verwijdert (stap 4). Er komt geen ticker, marquee of telanimatie terug.

### 4.7 Componenten

Algemeen: server component tenzij anders vermeld; alle tekst komt via props (labels, aria-teksten), zodat dezelfde primitives werken met messages op de publieke site en met `app/beheer/_strings.ts` in het beheer; kleuren alleen via tokens; `cn()` uit `@/lib/utils`; iconen uit lucide-react 0.456 met `aria-hidden` als er tekst naast staat. Er komt geen Radix-pakket en geen `button.tsx`: knoppen lopen via `CtaButton` en `ctaButtonVariants`, en interactieve primitives gebruiken `@base-ui-components/react` 1.0.0-rc.0, dat al geïnstalleerd is (spec 01 doet hetzelfde voor menu en navigatie).

**Toevoegen met de shadcn-CLI** (alleen componenten zonder extra pakketten en zonder `button.tsx`; de bron is de stijl `new-york`, Tailwind 4):

```bash
npx shadcn@latest add input textarea native-select card table skeleton
```

De overige primitives schrijft de bouw-agent zelf, met de shadcn-bron (`https://ui.shadcn.com/r/styles/new-york-v4/<naam>.json`) als referentie voor opbouw en `data-slot`-namen, maar zonder `radix-ui`, `sonner` of `next-themes`.

#### CtaButton en knoppen

Bestand `components/ui/cta-button.tsx` (S). Bestaande props blijven gelijk; nieuw zijn de varianten `tint`, `ghost`, `destructive` en `link`, de maat `icon`, en de props `external`, `newTabLabel`, `pending` en `pendingLabel`. Dit is de definitieve API; het bestand exporteert `CtaButton` en `ctaButtonVariants`.

```ts
type CtaButtonProps = {
  children: ReactNode;
  href?: string;                 // "/…" wordt Link uit @/i18n/navigation, anders <a>; zonder href een <button>
  onClick?: () => void;
  className?: string;
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "primary" | "secondary" | "tint" | "ghost" | "destructive" | "link";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  ariaLabel?: string;
  external?: boolean;            // target="_blank" rel="noopener noreferrer" (WhatsApp, externe links)
  newTabLabel?: string;          // met external: <span className="sr-only"> {newTabLabel}</span>
  pending?: boolean;             // LoaderCircle met motion-safe:animate-spin, aria-busy="true" en disabled
  pendingLabel?: string;         // met pending: <span role="status" className="sr-only">{pendingLabel}</span>
};
export const ctaButtonVariants: (opts: { variant?: …; size?: …; className?: string }) => string; // cva
```

- Elk gerenderd element krijgt `data-slot="cta-button"` (spec 14 meet daarop de doelgrootte).
- `external` zet `target="_blank" rel="noopener noreferrer"` en rendert bij `newTabLabel` na de tekst `<span className="sr-only"> {newTabLabel}</span>`. Aanroepers geven `t("common.opensInNewTab")`.
- `pending` toont `LoaderCircle` (`aria-hidden`) met `motion-safe:animate-spin`, zet `aria-busy="true"` en `disabled` en rendert `<span role="status" className="sr-only">{pendingLabel}</span>`.
- Basis: `inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-[background-color,border-color,color,box-shadow] duration-150 ease-brand motion-safe:active:translate-y-px [&_svg]:size-[1.125rem] [&_svg]:shrink-0 aria-disabled:pointer-events-none aria-disabled:opacity-50`.
- Maten: `sm` `h-11 px-4 text-sm lg:h-10` (alleen headerknop en compacte plekken); `default` `h-12 px-5 text-base`; `lg` `h-14 px-7 text-base`; `icon` `size-11`.
- Varianten:

| Variant | Klassen | Gebruik |
|---|---|---|
| `primary` | `bg-primary text-primary-foreground shadow-xs hover:bg-brand-strong` | één primaire knop per doelgroepblok; de hero van spec 04 heeft er twee (één per deur) naast de headerknop |
| `secondary` | `border border-border-strong bg-background text-foreground hover:border-brand hover:text-brand-strong` | tweede actie, bellen, WhatsApp |
| `tint` | `bg-brand-tint text-brand-strong hover:bg-brand/15` | rustige actie, filters |
| `ghost` | `text-foreground hover:bg-muted hover:text-brand-strong` | menu, iconknoppen, beheer |
| `destructive` | `bg-destructive text-destructive-foreground hover:bg-destructive-strong` | verwijderen en archiveren in het beheer |
| `link` | `h-auto px-0 text-brand underline-offset-4 hover:underline` | tekstknop |

- Binnen `.surface-brand` wordt `primary` vanzelf een witte knop met kobalt tekst en `secondary` een witte omlijnde knop.
- `disabled` op een link zet `aria-disabled="true"` en `tabIndex={-1}`; op een knop het attribuut `disabled`.
- `ariaLabel` begint met het zichtbare label (WCAG 2.5.3, B-54); een knop waarvan de naam gelijk is aan het label krijgt geen `ariaLabel`.
- Publieke formulieren gebruiken `CtaButton type="submit" size="lg"` voor verzenden; het beheer gebruikt dezelfde component, alleen zonder `href`. Links met knoplook in het beheer zijn `next/link` met `ctaButtonVariants`. Chip, Breadcrumb en Pagination zijn alleen voor de publieke site.

#### Velden

| Component | Bestand | S/C | API | Uiterlijk |
|---|---|---|---|---|
| `Input` | `components/ui/input.tsx` (shadcn) | S | `React.ComponentProps<"input">` | `h-12 w-full rounded-lg border border-input bg-background px-3.5 text-base text-foreground shadow-xs placeholder:text-muted-foreground transition-[border-color,box-shadow] focus-visible:outline-hidden focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/15 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/15 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground`. 17 px voorkomt zoomen in iOS. |
| `Textarea` | `components/ui/textarea.tsx` (shadcn) | S | `React.ComponentProps<"textarea">` | als `Input`, met `min-h-32 py-3 resize-y`. |
| `NativeSelect`, `NativeSelectOption`, `NativeSelectOptGroup` | `components/ui/native-select.tsx` (shadcn) | S | `React.ComponentProps<"select">` en `"option"`, `"optgroup"` | als `Input`, met `appearance-none pr-10` en `ChevronDown` `size-5 text-muted-foreground` rechts. Er komt geen Radix- of base-ui-Select op de publieke site: native werkt zonder JavaScript en toont op een telefoon de eigen keuzelijst. |
| `Label` | `components/ui/label.tsx` (eigen) | S | `React.ComponentProps<"label">` | `text-sm font-medium text-foreground`. |
| `Field`, `FieldSet`, `FieldLegend`, `FieldGroup`, `FieldLabel`, `FieldDescription`, `FieldError` | `components/ui/field.tsx` (eigen, naar shadcn `field`) | S | `Field`: `{ invalid?: boolean; children; className? }` zet `data-invalid`; `FieldError`: `{ id: string; children? }` rendert `<p id role="alert">` met `CircleAlert` `size-4`; `FieldLegend`: `{ variant?: "label" \| "group" } & ComponentProps<"legend">`; overige: HTML-props van hun element | `Field` `grid gap-2`; `FieldGroup` `grid gap-6`; `FieldDescription` `text-sm text-muted-foreground`; `FieldError` `flex gap-1.5 text-sm font-medium text-destructive`; `FieldLegend` heeft de prop `variant?: "label" \| "group"`: standaard `"label"` met `text-sm font-medium text-foreground` (gelijk aan `Label`); `"group"` met `font-display text-h3 font-semibold text-foreground` voor groepstitels van een formulier. Optionele velden krijgen achter het label de tekst van `forms.common.optionalMark` tussen haakjes ("(niet verplicht)" / "(optional)"); geen sterretje. |
| `Checkbox`, `CheckboxField` | `components/ui/checkbox.tsx` (eigen) | S | `Checkbox`: `Omit<React.ComponentProps<"input">, "type">`; `CheckboxField`: `{ id; name; label: ReactNode; description?: ReactNode; value?; defaultChecked?; required?; invalid?; describedBy?; disabled?: boolean; checked?: boolean; onChange?: React.ChangeEventHandler<HTMLInputElement> }` | native `<input type="checkbox" className="control-check">`; `CheckboxField` is een `<label>` `flex min-h-11 cursor-pointer items-start gap-3 py-2` met het vakje `mt-0.5`. |
| `RadioGroup`, `RadioCard` | `components/ui/radio-group.tsx` (eigen) | S | `RadioGroup`: `{ legend: ReactNode; description?: ReactNode; error?: ReactNode; errorId?: string; orientation?: "vertical" \| "horizontal"; children; className? }` rendert `<fieldset>` en `<legend>`; de `<legend>` rendert als `FieldLegend variant="label"`; `RadioCard`: `{ id; name; value; label: ReactNode; description?: ReactNode; defaultChecked?: boolean; checked?: boolean; required?: boolean; disabled?: boolean; invalid?: boolean; describedBy?: string; onChange?: React.ChangeEventHandler<HTMLInputElement> }` | `RadioCard` is een `<label>` `flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border border-input bg-background px-4 py-3 has-[:checked]:border-primary has-[:checked]:bg-brand-tint has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring`, met `<input type="radio" className="control-radio mt-0.5">`. Het native `<input type="radio">` krijgt `aria-invalid={invalid || undefined}`, `aria-describedby={describedBy}`, `checked` en `onChange` als die zijn meegegeven. Horizontaal: `grid grid-cols-2 gap-3` (bijvoorbeeld "Mag je in Nederland werken?" ja of nee). |
| `FileInput` | `components/ui/file-input.tsx` (eigen) | C | `{ id: string; name?: string; accept: string; maxSizeMb?: number; required?: boolean; disabled?: boolean; invalid?: boolean; describedBy?: string; labels: { choose: string; change: string; remove: string; hint: string }; onFileChange?: (file: File \| null, problem: "type" \| "size" \| null) => void; className?: string }` | Een `<label>` als vlak: `flex min-h-20 items-center gap-4 rounded-xl border-2 border-dashed border-border-strong bg-muted/60 p-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring`. Links een `IconTile` met `Upload`; rechts `labels.choose` als knoplook (`ctaButtonVariants({ variant: "secondary", size: "sm" })`) en `labels.hint` in `text-sm text-muted-foreground`. Na een keuze: rand vol `border-brand bg-brand-tint`, icoon `FileText`, bestandsnaam (afgekapt) en grootte in `nl-NL` ("1,2 MB"), en een knop `ghost icon` met `X` en `aria-label={labels.remove}`. Het native veld is visueel verborgen (`sr-only`) maar focusbaar. `name` is optioneel; zonder `name` komt het bestand niet in de FormData. Slepen en neerzetten is een verbetering, geen vereiste. Het component valideert type en grootte en meldt dat via `onFileChange`; de upload zelf (signed URL) is van spec 07. |

#### Weergave

| Component | Bestand | S/C | API | Uiterlijk |
|---|---|---|---|---|
| `Badge` | `components/ui/badge.tsx` (eigen) | S | `export type BadgeTone = "neutral" \| "brand" \| "info" \| "success" \| "warning" \| "danger"`; `{ tone?: BadgeTone; size?: "sm" \| "md"; icon?: LucideIcon; children; className? } & ComponentProps<"span">` | `inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap`; `sm` `h-6 px-2.5 text-xs`, `md` `h-7 px-3 text-sm`; tonen: neutral `bg-neutral-tint text-muted-foreground`, brand `bg-brand-tint text-brand-strong`, info `bg-info-tint text-info-strong`, success `bg-success-tint text-success-strong`, warning `bg-warning-tint text-warning-strong`, danger `bg-destructive-tint text-destructive-strong`. Elke badge heeft altijd een stip (`dot`): `size-1.5 rounded-full bg-current` met `aria-hidden`, vóór de tekst. Altijd met tekst. |
| `Chip` | `components/ui/chip.tsx` (eigen) | S | `Chip`: `{ children; href?: string; selected?: boolean; count?: number; removeLabel?: string; className? }` (link via `Link` met `scroll={false}`, anders `<span>`) | `inline-flex h-11 items-center gap-2 rounded-full border border-border-strong bg-background px-4 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand-strong md:h-10`; geselecteerd `border-brand bg-brand-tint text-brand-strong` met `Check` `size-4` en `aria-current="true"` op een link; met `removeLabel` een `X` en `<span className="sr-only">{removeLabel}</span>`; `count` in `tabular-nums text-muted-foreground`. Er is geen `ChipCheckbox`. |
| `Card` en delen | `components/ui/card.tsx` (shadcn, aangepast) | S | `Card`: `{ variant?: "default" \| "muted" \| "tint" \| "interactive" } & ComponentProps<"div">`; `CardHeader`, `CardContent`, `CardFooter`, `CardDescription`; `CardTitle`: `{ as?: "h2" \| "h3" \| "p" }`, standaard `h3` (B-05) | basis `flex flex-col gap-4 rounded-2xl border p-6 md:p-7 bg-card text-card-foreground`; default `border-border`; muted `border-transparent bg-muted`; tint `border-transparent bg-brand-tint`; interactive `relative border-border transition-[border-color,box-shadow,translate] duration-200 hover:border-brand/40 hover:shadow-md motion-safe:hover:-translate-y-0.5 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-ring`. Bij een klikbare kaart krijgt de hoofdlink `after:absolute after:inset-0` (één link per kaart, geen geneste links). `CardTitle` `text-h3`; `CardDescription` `text-base text-muted-foreground`; `CardFooter` `mt-auto`. |
| `IconTile` | `components/ui/icon-tile.tsx` (eigen) | S | `{ icon: LucideIcon; size?: "md" \| "lg"; tone?: "tint" \| "brand" \| "plain"; className? }` | `md` `size-11 rounded-lg` met icoon `size-5`; `lg` `size-14 rounded-xl` met icoon `size-6`; tint `bg-brand-tint text-brand ring-1 ring-inset ring-brand/10`, brand `bg-primary text-primary-foreground`, plain `text-brand`. Icoon `strokeWidth={2}` en `aria-hidden`. |
| `ColumnLines` | `components/ui/column-lines.tsx` (eigen, naar 21st.dev 29768) | S | `{ columnWidth?: number; columnCount?: number; radialFadeStart?: number; radialFadeEnd?: number; className?: string; children?: ReactNode }` (standaard 80, 14, 30, 70) | Wrapper `.column-lines` (`relative`, `isolate`) met een `aria-hidden` veld `.column-lines-field` achter de kinderen: lijnen van 1 px in `--border` via `repeating-linear-gradient`, gecentreerd, `columnWidth` maal `columnCount` breed, met een radiale `mask-image` van `radialFadeStart` tot `radialFadeEnd` procent. Geen JavaScript. `--cl-at` in `className` verplaatst het middelpunt van de uitloop (bijvoorbeeld `[--cl-at:100%_0%]`). Binnen `.surface-brand` worden de lijnen wit op lage dekking. |
| `GridPattern` | `components/ui/grid-pattern.tsx` (eigen) | S | `{ variant?: "grid" \| "dots"; fade?: "top" \| "center" \| "top-right" \| "top-left" \| "right"; size?: number; className?: string }` | `aria-hidden` laag `.deco` met `.deco-grid` (ruitjes in `--border`) of `.deco-dots` (stippen in `--border-strong`), radiaal uitlopend vanaf `fade`. De ouder is `relative isolate`. Hooguit twee of drie per pagina. |
| `Accordion`, `AccordionItem` | `components/ui/accordion.tsx` (eigen, native `<details>`) | S | `Accordion`: `{ children; className? }`; `AccordionItem`: `{ title: ReactNode; children; name?: string; defaultOpen?: boolean; headingLevel?: "h2" \| "h3"; id?: string; className? }` | lijst `divide-y divide-border border-y border-border`; item `<details className="accordion-item group" name={name}>`; `<summary>` `flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-display text-h3 [&::-webkit-details-marker]:hidden`; rechts `span.grid.size-8.place-items-center.rounded-full.bg-brand-tint.text-brand` met `Plus` `size-4` die bij openen 45 graden draait (`group-open:rotate-45 motion-reduce:transition-none`); inhoud `pb-5 pr-12 text-base`. Met dezelfde `name` gaat steeds één item open. Zonder `headingLevel` staat de titel in een `<span>`, omdat `summary` de rol knop heeft; met `headingLevel` komt er een kop in de `summary`. Antwoorden staan in de DOM, zodat FAQPage-tekst (spec 12) zichtbaar is. |
| `Skeleton` | `components/ui/skeleton.tsx` (shadcn) | S | `ComponentProps<"div">` | `animate-pulse rounded-lg bg-muted`; zonder animatie bij reduced motion (globale regel). |
| `Alert` | `components/ui/alert.tsx` (eigen, naar shadcn `alert`) | S | `{ tone?: "neutral" \| "info" \| "success" \| "warning" \| "danger"; icon?: LucideIcon \| false; title?: ReactNode; titleAs?: "p" \| "h2" \| "h3"; titleId?: string; children; className? } & ComponentProps<"div">` (de aanroeper zet `role="status"` of `role="alert"`). De titel rendert als `<{titleAs} id={titleId} className="font-semibold">` met `titleAs` standaard `"p"`. Is de titel een kop van de sectie, dan geeft de aanroeper `titleAs="h2"` en een `titleId` voor `aria-labelledby` mee; een kop gaat nooit als `title` binnen een `<p>`. | `flex gap-3 rounded-xl border px-4 py-3.5 text-base`; info `border-info/25 bg-info-tint text-info-strong` met `Info`; success `border-success/25 bg-success-tint text-success-strong` met `CircleCheck`; warning `border-warning/25 bg-warning-tint text-warning-strong` met `TriangleAlert`; danger `border-destructive/25 bg-destructive-tint text-destructive-strong` met `CircleAlert`; neutral `border-border bg-muted text-foreground` met `Info`. Voor formulierfeedback, de melding bij een gesloten vacature en de melding dat vacaturetekst Nederlands is (B-03). |
| `PhotoSlot` | `components/ui/photo-slot.tsx` (eigen) | S | `{ src?: string; alt: string; ratio?: "4/5" \| "3/2" \| "1/1" \| "16/9"; sizes: string; priority?: boolean; fallback?: ReactNode; className? }` | `relative overflow-hidden rounded-2xl bg-brand-tint` met de gekozen `aspect-[…]`. Met `src` een `next/image` met `fill`, `object-cover` en `sizes`; zonder `src` het `fallback` (bijvoorbeeld initialen) gecentreerd op een uitlopend stippenraster (`GridPattern`), en dan `aria-hidden` op het vlak. |

#### Navigatie en overlays

| Component | Bestand | S/C | API | Uiterlijk |
|---|---|---|---|---|
| `Sheet` en delen | `components/ui/sheet.tsx` (eigen, base-ui `Dialog`) | C | `Sheet` (`Dialog.Root`), `SheetTrigger`, `SheetClose`; `SheetContent`: `{ side?: "right" \| "bottom"; closeLabel: string; children; className? }`; `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetFooter` | backdrop `fixed inset-0 bg-ink/40` met fade; right `fixed inset-y-0 right-0 w-full sm:max-w-md bg-background shadow-lg`; bottom `fixed inset-x-0 bottom-0 max-h-[85dvh] rounded-t-2xl bg-background shadow-lg`; schuiven 200 ms `ease-brand` via `data-[starting-style]` en `data-[ending-style]`, uit bij reduced motion; header `border-b p-5`, footer `sticky bottom-0 border-t bg-background p-5`; sluitknop `CtaButton variant="ghost" size="icon"` met `X` en `aria-label={closeLabel}`. Voor de filters van `/vacatures` op mobiel (spec 06). Het filterformulier zelf werkt ook zonder sheet (spec 06). |
| `Tabs` en delen | `components/ui/tabs.tsx` (eigen, base-ui `Tabs`) | C | `Tabs`, `TabsList`: `{ variant?: "underline" \| "segmented" }`, `TabsTrigger`, `TabsContent` | underline: lijst `flex gap-6 border-b border-border`, trigger `relative h-12 text-base font-medium text-muted-foreground data-[active]:text-foreground` met een streep van 2 px `bg-brand` onder de actieve (base-ui rc.0 zet `data-active` op de actieve tab); segmented: lijst `inline-flex rounded-lg bg-muted p-1`, trigger `h-10 rounded-md px-4 data-[active]:bg-background data-[active]:shadow-xs`. Niet voor inhoud die zonder JavaScript zichtbaar moet zijn of geïndexeerd moet worden. |
| `Table` en delen | `components/ui/table.tsx` (shadcn) | S | shadcn-API (`Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`) | wrapper `relative w-full overflow-x-auto rounded-xl border border-border`; `thead` `bg-muted`; `th` `h-11 px-4 text-left text-xs font-medium text-muted-foreground`; `td` `px-4 py-3 align-middle text-sm`; rij `border-b border-border hover:bg-muted/60 data-[state=selected]:bg-brand-tint`; getallen `text-right tabular-nums`. |
| `Breadcrumb` en delen | `components/ui/breadcrumb.tsx` (eigen, naar shadcn) | S | `Breadcrumb`: `{ label: string } & ComponentProps<"nav">`; `BreadcrumbList` (`ol`), `BreadcrumbItem`, `BreadcrumbLink`: `{ href: string }` (rendert `Link`), `BreadcrumbPage`, `BreadcrumbSeparator` | `flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground`; links `hover:text-brand-strong hover:underline underline-offset-4`; scheiding `ChevronRight` `size-3.5 text-brand-subtle` (`aria-hidden`; op ijs `text-muted-foreground`); huidige pagina `font-medium text-foreground line-clamp-1` met `aria-current="page"`. `Breadcrumbs` van spec 01 is opgebouwd uit deze delen. |
| `Pagination` en delen | `components/ui/pagination.tsx` (eigen, naar shadcn) | S | `Pagination`: `{ label: string }`; `PaginationContent`, `PaginationItem`, `PaginationLink`: `{ href: string; isActive?: boolean; children }`, `PaginationPrevious` en `PaginationNext`: `{ href?: string; label: string }` (zonder `href` uitgeschakeld), `PaginationEllipsis`: `{ label: string }`, `PaginationStatus`: `{ children }` | links via `Link`; nummers `size-11 rounded-lg text-sm font-medium tabular-nums hover:bg-muted`; actief `border border-brand/30 bg-brand-tint text-brand-strong` met `aria-current="page"`; vorige en volgende `h-11 px-3` met `ChevronLeft` en `ChevronRight`. Onder 640 px alleen vorige, `PaginationStatus` (bijvoorbeeld "Pagina 2 van 5") en volgende. |
| `ToastProvider`, `Toaster`, `useToast` | `components/ui/toast.tsx` (eigen, base-ui `Toast`) | C | `ToastProvider` is `Toast.Provider` rond het beheer; `Toaster`: `{ closeLabel: string }` rendert `Toast.Portal`, `Toast.Viewport` en per melding `Toast.Root` met `Title`, `Description` en `Close`; `useToast()` geeft `Toast.useToastManager()` door, met `add({ title, description?, type?: "success" \| "error" })` | onderaan in het midden (mobiel) of rechtsonder (vanaf `md`), `rounded-xl border border-border bg-popover p-4 shadow-lg`, icoon `CircleCheck` in `text-success` of `CircleAlert` in `text-destructive`, 5 seconden zichtbaar, `aria-live="polite"`. Alleen in het beheer (spec 08 zet `ToastProvider` en `Toaster` in `app/beheer/layout.tsx`); de publieke site meldt resultaten in de pagina met `Alert`. |

Bestaande primitives:
- `LanguageToggle` (uiterlijk): een groep `inline-flex items-center gap-1` met `Languages` `size-4 text-brand` (`aria-hidden`), daarna twee links `inline-flex h-11 min-w-11 items-center justify-center rounded-lg px-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-brand-strong lg:h-10 lg:min-w-10`. De actieve link (`aria-current="true"`) is `text-foreground` met een streep van 2 px `bg-brand` onder de tekst. Gedrag bij spec 01.
- `NavigationMenu*` (base-ui, uiterlijk): trigger via `navigationMenuTriggerStyle` `inline-flex h-10 items-center gap-1 rounded-lg px-3 text-sm font-medium text-foreground hover:bg-muted hover:text-brand-strong data-[popup-open]:bg-muted`, plus `data-[active]:text-brand-strong` en voor links met `aria-current="page"` dezelfde kleur met een streep van 2 px eronder; popup `rounded-xl border border-border bg-popover p-2 shadow-lg`.
- `MenuToggleIcon` en `useScroll`: blijven tot spec 01 ze verwijdert.

#### Statusbadges in het beheer

Spec 08 bouwt `StatusBadge` en `FlagBadge` in `components/beheer/` op `Badge` met deze tonen en neemt de tabel letterlijk over (labels in `app/beheer/_strings.ts`):

| Entiteit | Status → toon |
|---|---|
| Vacature | `draft` neutral · `scheduled` info · `published` success · `expired` warning · `filled` warning · `withdrawn` warning · `closed_other` warning · `archived` neutral |
| Sollicitatie | `new` brand · `in_progress` info · `invited` info · `placed` success · `rejected` danger · `withdrawn` neutral |
| Aanvraag | `new` brand · `in_progress` info · `quote_sent` info · `started` success · `completed` neutral · `cancelled` neutral |
| Bericht | `new` brand · `answered` success · `archived` neutral · `spam` danger |
| Vlaggen | `featured` (Uitgelicht) brand · `urgent` (Spoed) warning |

Op de publieke site: spec 06 gebruikt `Badge` voor Nieuw (brand) en Spoed (warning); gesloten vacatures krijgen geen badge.

### 4.8 Iconen

- lucide-react 0.456 (vast), lijndikte 2 (standaard), `size-5` (20 px) in interface en lijsten, `size-6` in icoontegels `lg`, `size-4` in badges en chips.
- Kleur: `text-brand` voor informatieve iconen, `text-muted-foreground` naast hulptekst, nooit een eigen kleur.
- Een icoon staat nooit alleen zonder toegankelijke naam: naast tekst `aria-hidden`, in een iconknop een `aria-label`.
- Voorstel aan spec 01 voor de beroepen (namen gecontroleerd in 0.456): `glazenwasser` `Droplets`, `schoonmaker` `SprayCan`, `logistiek-medewerker` `Forklift`, `verhuizer` `Truck`, `hulpkracht-bouw-en-sloop` `HardHat`. Overige vaste iconen: `Phone`, `MessageCircle` (WhatsApp), `Mail`, `MapPin`, `Clock`, `Euro`, `CalendarDays`, `Briefcase`, `Users`, `ArrowRight`, `ChevronRight`, `Check`, `X`, `Plus`, `Search`, `SlidersHorizontal`, `Upload`, `FileText`, `Info`, `CircleAlert`, `TriangleAlert`, `CircleCheck`, `LoaderCircle`, `Languages`, socials `Linkedin`, `Instagram`, `Facebook`.
- `CircleAlert` en `LoaderCircle` zijn de namen die spec 06, 07 en 08 gebruiken (niet `AlertCircle`, `Loader2`).

### 4.9 Beeld zonder foto's (B-25)

Er zijn geen foto's en er komen geen stockfoto's. De site oogt toch verzorgd door:
1. **Typografie als beeld.** Een grote hero-kop (`text-hero`) met veel lucht eromheen, korte intro in `text-lead` en ruime secties.
2. **Witruimte en ritme.** De hele pagina staat op wit; secties scheiden met ruimte, haarlijnen en kaarten. Elke sectie heeft één kop, één intro en één blok inhoud.
3. **Kaarten met een rand.** Kaarten zijn wit met een rand van 1 px; een blauwtint blijft voor icoontegels en een enkele accentkaart (loonindicatie, inschrijfoproep). Hooguit één `.surface-brand` per pagina voor de afsluitende oproep, als kaart op wit.
4. **Lijniconen in tegels.** `IconTile` bij beroepen, stappen en kenmerken; stappen krijgen een cijfer in een cirkel met rand (`size-9` of `size-10`, `border-border-strong`, cijfer in `text-brand`), verbonden door een haarlijn.
5. **Uitlopende rasters.** `ColumnLines` en `GridPattern` (§4.6): kolomlijnen, een ruitjesraster of een stippenraster in het border-token, radiaal uitlopend, hooguit twee of drie per pagina en nooit als vlak.
6. **Mensen zonder foto.** Jimmy en Lorenzo als initialen ("J" en "L") in een cirkel van 56 px `bg-brand-tint text-brand-strong font-display text-h3`, met voornaam en telefoonnummer ernaast.

Fotoslots: `PhotoSlot` met `ratio` 4/5 voor portretten en 3/2 voor werkfoto's. Komen er foto's, dan alleen eigen beelden met correcte beschermingsmiddelen (context/12 §3.2), in `public/` en via `next/image`.

### 4.10 Beweging (B-29)

- **Reveal zonder JavaScript.** `components/motion/reveal.tsx` wordt een server component. `Reveal`, `RevealGroup` en `RevealItem` houden hun props (`delay`, `y`, `scale`, `className`, `as`, `stagger`, `delayChildren`), maar renderen nu een element met de klasse `reveal` (en `reveal-group` voor de groep), het attribuut `data-reveal` en de inline variabele `--reveal-y` (standaard 12 px). De animatie is scroll-gedreven CSS (`animation-timeline: view()`, zie §4.2). Zonder ondersteuning, zonder JavaScript of met reduced motion is de inhoud direct zichtbaar. `scale`, `delay`, `stagger` en `delayChildren` worden genegeerd; de volgorde in een groep komt uit `:nth-child`.
- **Nooit in een reveal**: de h1, de eerste alinea, het LCP-element en alles boven de vouw op 390 px (spec 14).
- **Hover**: kleur en rand in 150 ms `ease-brand`; interactieve kaarten krijgen `shadow-md`; een pijl in een link schuift 2 px op (`group-hover:translate-x-0.5 motion-reduce:transform-none`).
- **Overlays**: sheet en mobiel menu 200 ms; accordion 200 ms via `::details-content` waar de browser dat kan.
- **Niet**: marquee, ticker, telanimaties, parallax, gloed, spotlight, autoplay, schaalanimaties.
- `framer-motion` is na stap 4 niet meer nodig in `components/motion/*`. Als dan geen enkel bestand het nog importeert, gaat het uit `package.json`.

### 4.11 Logo (R-06)

**Het logo van de klant (B-61).** De klant heeft zijn logo gekozen: een beeldmerk in de vorm van een G met links een sikkel. De site neemt alleen de vorm van dat beeldmerk over, één op één, en zet die vlak. Het zilver, het reliëf, de schaduw en het zwarte vlak van het aangeleverde beeld vervallen, en de letters van dat beeld zijn niet overgenomen. Het beeldmerk is de hoofdletter van het woord: het logo leest als G (het beeldmerk) plus de letters "roos", met de beschrijver "Personeelsdiensten" als tweede regel. Een beeldmerk naast het volledige woord bestaat niet meer. Er zijn geen andere logo-ontwerpen meer; eerdere concepten en varianten zijn verwijderd.

**Het beeldmerk** (`docs/specs/assets/logo/logo-mark.svg`, vak van 90,55 bij 100 eenheden) bestaat uit vier delen:

| Deel | Vorm | Kleur |
|---|---|---|
| Bovenboog | Vlakke balk bovenaan (rechte bovenrand, rechte rechterrand, rechte onderrand) die links met een vloeiende boog naar beneden loopt en in een punt eindigt. | nacht `#0B0F2E` |
| Kom | Linksonder: een punt die naar rechtsonder uitloopt in een vlakke balk met een rechte rechterrand, op de basislijn. | nacht `#0B0F2E` |
| Rechterblok | Horizontale balk naar binnen met daaronder de stam; de stam is rechtsonder schuin afgesneden en eindigt links in een punt op de basislijn. | nacht `#0B0F2E` |
| Sikkel | Links, tussen bovenboog en kom: een smalle maan met twee scherpe punten. | kobalt `#2741C9` |

Constructie: de vorm is overgetrokken van het aangeleverde beeld (voorvlak van de letter, zonder de schaduw) en daarna opnieuw opgebouwd als schone geometrie. Rechte randen zijn rechte lijnen, horizontaal en verticaal precies langs de assen; elke boog is één kubische curve; de overgang van balk naar boog is vloeiend; punten en hoeken zijn scherp. De kom en het rechterblok delen één basislijn. De tussenruimtes tussen de delen zijn die van het aangeleverde beeld. Gemeten afwijking ten opzichte van het beeld: langs de randen hooguit 0,2 procent van de breedte van het beeldmerk, bij de vier scherpe punten naar schatting 0,3 procent. Het beeldmerk wordt niet hertekend, vereenvoudigd of "verbeterd"; wie de vorm wijzigt, doet dat alleen in `logo-mark.svg`.

**Optische versie voor kleine maten** (`logo-mark-klein.svg`). Onder ongeveer 48 px beeldmerkhoogte (header, footer, tegel, favicon) lopen de tussenruimtes van het beeldmerk dicht en gaan de punten rafelen. Daarvoor is er een tweede tekening met hetzelfde silhouet en dezelfde verhoudingen:
- de rechte randen van de G staan op het raster van de referentiemaat (beeldmerk 38 px hoog, één pixel is 100/38 = 2,63 eenheden): de balken zijn 6, 5 en 7 px hoog en de stam is 7 px breed, het beeldmerk is 34 px breed;
- de spitse staarten van de bovenboog en de kom en de punt van de stam zijn stomp gemaakt;
- de sikkel houdt zijn vorm en staat op 90 procent, naar zijn buitenrand toe, zodat beide tussenruimtes minstens 5,4 eenheden zijn (2 px op de referentiemaat; in het beeldmerk één op één 3,4 tot 4,6 eenheden).

Het beeldmerk één op één blijft de meester voor grote toepassingen: de OG-afbeelding, `public/brand/logo.png`, `logo.svg`, het e-maillogo, drukwerk en het overzicht. De componenten kiezen met de prop `optical` (standaard `true`).

**Letters en beschrijver.**
- De letters "roos" staan in kleine letters uit Onest, gewicht 575, omgezet naar contouren (Onest valt onder de SIL Open Font License, die gebruik in een logo toestaat). Onest is gekozen boven Instrument Sans na vergelijking op header-maat en op vier keer die maat: de ronde o sluit aan bij de ronde kom van de G, waar de ovale o van Instrument Sans de G breed laat lijken. Alles in nacht; alleen de sikkel is kobalt.
- Verhouding: de x-hoogte is 27 px op een beeldmerk van 38 px (1,41, zoals een hoofdletter naast kleine letters). De letters staan op de basislijn van het beeldmerk (de onderkant van de kom en van de stam). De stam van de r is 6 px, gelijk aan de bovenbalk van de G. Tussen het beeldmerk en de r zit 2 px wit, optisch gelijk aan het wit tussen r en o.
- Beschrijver "Personeelsdiensten" in Onest 500, kapitaalhoogte 10 px, basislijn 15 px onder die van het woord, kleur leigrijs, uitgevuld over de volle breedte van het woord (spatiëring 0,039 em) en links gelijk met het beeldmerk.

**Opbouw.** Elk kader heeft een marge van 2 px (5,26 eenheden, ruim 5 procent van de hoogte) links, rechts en boven en 3 px onder, zodat geen rand van het logo op de rand van het kader valt en wordt afgesneden. De maten in px gelden op de referentiemaat.

| Opbouw | Bestand | Regel |
|---|---|---|
| Met beschrijver | `logo-horizontaal.svg` (kader 143 bij 58 px) | G plus "roos" op één regel, de beschrijver eronder. Footer, e-mail, offertes. |
| Zonder beschrijver | afgeleid (kader 143 bij 43 px) | Alleen de regel G plus "roos". Dit is het logo in de header; in een header van 64 px met een rand van 1 px staat het beeldmerk op y 12 tot 50. |
| Gestapeld | `logo-gestapeld.svg` | Dezelfde opbouw met 16 eenheden extra vrije ruimte rondom, voor plaatsing op een vlak. Er is geen aparte opbouw met het beeldmerk boven het woord meer. |
| Icoon | `icoon.svg` (64 bij 64) | Kobalt tegel met hoekstraal 16 en het beeldmerk (optische versie) in wit van 34 bij 38, dus 59 procent van de hoogte, gecentreerd op hele pixels. Scherp op 1x zijn de maten 64 en 32 px. |

**Varianten** (overzicht in `docs/specs/assets/logo/overzicht.svg` en `overzicht.png`).

| Variant | Gebruik |
|---|---|
| Kleur op wit: G en letters in nacht, alleen de sikkel in kobalt | standaard: header, footer, documenten |
| Wit op kobalt: alles wit, ook de sikkel | `.surface-brand`, social banners, bus in kobalt |
| Eén kleur nacht of zwart | stempel, fax, gravure, hesje op fluorgeel of oranje |
| Eén kleur wit | donkere jassen, folie op donkere ruiten |
| Icoon (kobalt tegel met wit beeldmerk) | favicon, apple-icon, app-iconen van het beheer, socialprofielen, WhatsApp-profiel, borst van het hesje |
| Met beschrijver (lockup) | footer, e-mail, offertes, bus |
| Gestapeld (met vrije ruimte) | plaatsing op een vlak, drukwerk |
| Alleen het beeldmerk op de tegel | alle vierkante plekken: favicon, apple-icon, app-iconen, `public/brand/logo-mark.svg`, `public/brand/logo.png` (512 bij 512, voor JSON-LD), profielbeelden, de visual op de homepage |

Op kobalt is alles wit, ook de sikkel. Een sikkel in de lichte tint `#DCE1FF` leest op kleine maten als een drukfout, en de tussenruimtes houden de sikkel al los van de G. De witte tegel met het beeldmerk in kleur bestaat alleen in het overzicht: op 16 px valt de sikkel daar weg en op een donkere tabbalk is het een wit vlak. De kobalt tegel houdt op 16 en 32 px een gesloten, herkenbare G.

**Maten en vrije ruimte.**
- Logo zonder beschrijver: op de site altijd op de referentiemaat (beeldmerk 38 px, kader 143 bij 43 px), op mobiel en op desktop. Minimaal 24 px beeldmerkhoogte op scherm, in druk 8 mm.
- Logo met beschrijver: op de site op de referentiemaat (kader 143 bij 58 px, kapitaalhoogte van de beschrijver 10 px); niet kleiner dan dat, in druk 15 mm hoog.
- Los beeldmerk minimaal 24 px hoog; tegel minimaal 16 px (alleen favicon), verder 24 px.
- Vrije ruimte rondom het logo: de hoogte van de "o" (x-hoogte), gemeten vanaf het logo zelf en niet vanaf het kader; rondom het losse beeldmerk en de tegel: een kwart van de breedte.
- Hele pixels: het logo is een blokelement met vaste breedte en hoogte in hele pixels en staat met flex-centrering in zijn link, zodat x, y, breedte en hoogte hele getallen zijn en de balken van de G op 1x scherpe randen van één pixel hebben.
- Niet doen: het beeldmerk los naast het volledige woord "Groos" zetten, het beeldmerk hertekenen, spiegelen of draaien, de delen losmaken of de tussenruimtes dichtzetten, de sikkel anders kleuren dan kobalt of de logokleur, het woordmerk vervormen of uitrekken, schaduw, verloop of reliëf toevoegen, de beschrijver los zetten van het woordmerk, het logo op een foto zonder rustig vlak plaatsen.

**Hesje en bus.**
- Hesje (EN ISO 20471): borst links de tegel van 50 mm of het horizontale logo van 80 mm breed in één kleur nacht; rug de lockup met beschrijver van 250 mm breed in één kleur nacht. Nooit over de reflecterende banden, en binnen het maximale bedrukte oppervlak dat de leverancier per klasse opgeeft.
- Bus (wit): zijkant de lockup in kleur, 600 tot 900 mm breed, met daaronder het domein en het hoofdnummer in Onest Medium; achterkant het horizontale logo en het nummer. Optioneel één kobaltband van 150 mm onderlangs. De foliekleur voor `#2741C9` wordt met een proef bepaald.

**Implementatie.**
1. `components/brand/logo-paths.json`: gegenereerd uit de vijf bronbestanden met `node scripts/extract-logo.mjs`. Velden: `mark { viewBox, width, height, g, crescent }` (één op één), `markSmall { viewBox, g, crescent }` (optische versie), `wordmark { transform, roos }`, `descriptor { transform, d }`, `text { optical, master }` (de verschuiving van het tekstblok: bij het beeldmerk één op één 1,07 eenheid naar rechts, omdat de stam van de G in de optische versie op het raster staat), `horizontal { wordmark, lockup }` en `stacked { wordmark, lockup }` met elk `{ viewBox, width, height }` (het kader met marge en de maat in px op de referentiemaat) en `tile { viewBox: "0 0 64 64", size: 64, rx: 16, mark }`.
2. `components/brand/logo.tsx` (S):

```ts
type LogoProps = {
  variant?: "wordmark" | "lockup";     // standaard "wordmark": G plus "roos"; "lockup" zet de beschrijver eronder
  layout?: "horizontal" | "stacked";   // standaard "horizontal"; "stacked": dezelfde opbouw met extra vrije ruimte
  tone?: "brand" | "mono";             // brand: sikkel in fill-brand, de rest currentColor; mono: alles currentColor
  optical?: boolean;                   // standaard true: optische versie van het beeldmerk; false: één op één, voor groot gebruik
  className?: string;                  // zonder: de referentiemaat (143 bij 43 of 58 px); anders "h-… w-auto"
  title?: string;                      // standaard contact.shortName
  decorative?: boolean;                // true: aria-hidden, voor een logo in een link met eigen aria-label
};
```

Rendert `<svg viewBox=… width height overflow="visible" shape-rendering="geometricPrecision" role="img" aria-label={title} focusable="false" className={cn("block shrink-0 text-foreground", className)}>` met de twee paden van het beeldmerk (de G `fill-current`, de sikkel `fill-brand` of `fill-current`) en een groep voor het tekstblok (de letters "roos" in `fill-current`, en bij `lockup` de beschrijver in `fill-muted-foreground` of `fill-current`). De letters zijn paden; de toegankelijke naam "Groos Personeelsdiensten" komt uit `aria-label`. Binnen `.surface-brand` wordt het logo vanzelf wit, omdat `--brand` daar wit is en de tekstkleur ook.

3. `components/brand/logo-mark.tsx` (S): `LogoMark({ variant?: "mark" | "tile"; tone?: "brand" | "mono"; optical?: boolean; className?; title?; decorative? })`. `mark`: de G `fill-current` (standaard `text-foreground`) en de sikkel `fill-brand`, kader 39 bij 43 px; `tile`: `<rect rx="16" className="fill-current">` (standaard `text-brand`) van 64 px met het beeldmerk in `fill-background`. `optical` is standaard `true`.
4. Compatibiliteit: `components/brand/wordmark.tsx` houdt `Wordmark({ className?, idSuffix?, showDescriptor? })`, rendert `<Logo variant={showDescriptor ? "lockup" : "wordmark"} decorative />` en heeft `showDescriptor = false` als standaard (header zonder beschrijver, footer met `showDescriptor`). `components/brand/monogram.tsx` houdt `Monogram({ className?, idSuffix?, title? })` en rendert `<LogoMark variant="mark" />`. Beide wrappers blijven zolang andere specs ze aanroepen.
5. `scripts/brand-assets.mjs` maakt met `sharp` (devDependency `sharp@^0.35.5`, dezelfde versie die Next al meebrengt) uit `logo-paths.json` en de kleuren uit `lib/brand.ts`, die het leest met dezelfde reguliere expressie als `check-contrast.mjs` (een `.mjs`-script kan `lib/brand.ts` in deze repo niet importeren, omdat Node `.ts` hier als CommonJS behandelt): `public/brand/logo.png` (512 bij 512, alleen het beeldmerk één op één op de kobalt tegel; voor `site.logo` en `organizationLd`), `public/brand/logo-email.png` (480 bij 200, wit, het logo met beschrijver in kleur; voor spec 11, weergave op 160 px breed), `public/brand/logo.svg` (het logo met beschrijver in kleur, kader met marge), `public/brand/logo-mark.svg` (kobalt tegel met wit beeldmerk, optische versie) en het overzicht `docs/specs/assets/logo/overzicht.svg` en `overzicht.png`. Draaien met `node scripts/brand-assets.mjs`; de bestanden worden gecommit.
6. `components/brand/logo-svg.ts` levert de SVG-data-URI's voor plekken zonder CSS: `tileDataUri({ rounded?, optical? })` (standaard optisch), `markDataUri({ g?, crescent?, optical? })`, `logoDataUri({ optical? })` (standaard één op één) en de verhoudingen `markRatio` en `logoRatio` van de kaders inclusief marge. `app/icon.tsx` (64 bij 64) en `app/apple-icon.tsx` (180 bij 180) gebruiken `tileDataUri` in een `ImageResponse` uit `next/og`. Favicon: kobalt tegel met hoekstraal 16/64 en het witte beeldmerk van 34 bij 38 px op hele pixels; apple-icon: volle kobalt vierkant zonder hoekstraal (iOS rondt zelf af). `app/beheer/icon.tsx` zet het witte beeldmerk op ongeveer 58 procent van een kobalt vlak (192 optisch, 512 één op één, maskable). Geen `app/icon.png` of `favicon.ico` ernaast.
7. Het beeldmerk wijzigen: de paden `mark-g` en `mark-crescent` in `logo-mark.svg` aanpassen (en in `logo-horizontaal.svg` en `logo-gestapeld.svg`, die dezelfde paden bevatten) en de optische versie in `logo-mark-klein.svg` en `icoon.svg` opnieuw afleiden; daarna `node scripts/extract-logo.mjs` en `node scripts/brand-assets.mjs`. De letters wijzigen: de paden `wordmark-roos` en `descriptor-text` in `logo-horizontaal.svg` en `logo-gestapeld.svg`; de regels voor lettertype, gewicht, raster en marge staan in het commentaar van `scripts/extract-logo.mjs`.


### 4.12 Fonts voor de OG-afbeelding

- Opmaak en bouw van de OG-afbeelding: zie spec 12 §4.6 (eigenaar OG-afbeeldingen); het logo komt als SVG uit `components/brand/logo-svg.ts` (`logoDataUri`).
- De fonts blijven van deze spec en staan in `assets/fonts/` (statische TTF, OFL): `assets/fonts/InstrumentSans-SemiBold.ttf`, `assets/fonts/Onest-Regular.ttf` en `assets/fonts/Onest-Medium.ttf`. Het script zet ook `assets/fonts/OFL.txt` neer, met de licentietekst van beide families. Ophalen (stap 2):

```bash
mkdir -p assets/fonts
curl -s "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@600" -A "Wget/1.0" | grep -oE "https://[^)]*\.ttf" | head -1 | xargs curl -s -o assets/fonts/InstrumentSans-SemiBold.ttf
curl -s "https://fonts.googleapis.com/css2?family=Onest:wght@400" -A "Wget/1.0" | grep -oE "https://[^)]*\.ttf" | head -1 | xargs curl -s -o assets/fonts/Onest-Regular.ttf
curl -s "https://fonts.googleapis.com/css2?family=Onest:wght@500" -A "Wget/1.0" | grep -oE "https://[^)]*\.ttf" | head -1 | xargs curl -s -o assets/fonts/Onest-Medium.ttf
{ curl -s https://raw.githubusercontent.com/google/fonts/main/ofl/instrumentsans/OFL.txt; printf "\n\n"; curl -s https://raw.githubusercontent.com/google/fonts/main/ofl/onest/OFL.txt; } > assets/fonts/OFL.txt
```

Gecontroleerd op 2 oktober 2026: deze aanroep geeft volledige statische TTF's (Instrument Sans 600 is 48,7 kB, met latin-ext). Samen blijven ze ruim onder de bundelgrens van 500 kB van `ImageResponse`. Beide OFL-adressen gaven op die datum een 200.

### 4.13 Uiterlijk van header, menu, actiebalk en footer

De structuur (onderdelen, volgorde, gedrag) is van spec 01; dit is het uiterlijk.

**Header.** `sticky top-0 z-50 h-16 bg-background` met `border-b border-transparent` die na 8 px scrollen `border-border` wordt. Geen transparantie, geen blur, geen schaduw. Inhoud in `container flex h-full items-center justify-between gap-4`. Logo: `Wordmark` zonder beschrijver op de referentiemaat (kader 143 bij 43 px, beeldmerk 38 px, op mobiel en desktop gelijk), in een link `flex items-center` met `aria-label` `header.homeAria`. Hoofdmenu (vanaf `lg`): items volgens `navigationMenuTriggerStyle` (§4.7); een actief item krijgt `text-brand-strong` en een streep van 2 px `bg-brand` onder de tekst. Rechts: vanaf `lg` de telefoonlink als `CtaButton variant="ghost" size="icon"` met `Phone` in `text-brand` en `aria-label` `header.callAria`; vanaf `xl` `variant="ghost" size="sm"` met `Phone` en het nummer. Daarna `LanguageToggle` en `CtaButton size="sm"` als primaire knop. Menuknop op mobiel: `CtaButton variant="ghost" size="icon"`.

**Mobiel menu.** Schermvullend `bg-background`, eigen kopregel van 64 px met logo en sluitknop (`ghost`, `icon`). Hoofditems `font-display text-h3 py-4 border-b border-border`; uitklapgroepen met `ChevronDown` die 180 graden draait; subitems `text-base py-3 pl-1` met het beroepsicoon in `text-brand`. Onderaan, vast binnen het venster: twee `CtaButton`'s van volle breedte (`secondary` en `primary`, maat `default`), daaronder de belregel, de WhatsApp-link en `LanguageToggle` in `text-sm`. Openen met een fade van 150 ms.

**Actiebalk (mobiel).** `fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden`, `grid grid-cols-2 gap-3`; links `CtaButton variant="secondary"`, rechts `CtaButton variant="primary"`, beide maat `default` (48 px) met icoon. De ruimte voor de actiebalk onderaan de pagina komt van de spacer in spec 01 §4.22.

**Footer.** `border-t border-border bg-ice` (het enige grijze vlak van de site), binnen `container pt-14 lg:pt-20`. Raster `grid gap-10 lg:grid-cols-12`. Merkblok `lg:col-span-4`: `Wordmark showDescriptor` op de referentiemaat (kader 143 bij 58 px), de omschrijving in `text-sm text-muted-foreground max-w-xs` en de socials. Navigatie `grid gap-10 sm:grid-cols-3 lg:col-span-5`. Contactblok `lg:col-span-3` met `<address>` en de regels met `Phone`, `MessageCircle` en `Mail` in `text-brand`; de contactregels staan niet meer in het merkblok. Kolomkoppen zijn `h2` met `font-sans text-sm font-semibold text-foreground mb-3` (geen hoofdletters, geen spatiëring). Links `inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-brand-strong lg:min-h-0 lg:py-1`. Adres in `<address className="not-italic text-sm text-muted-foreground">`. Socials (alleen als ze er zijn) als `CtaButton variant="ghost" size="icon"` met rand `border border-border-strong`. Onderbalk: `mt-12 flex flex-col gap-3 border-t border-border pt-6 pb-8 text-xs text-muted-foreground md:flex-row md:justify-between`.

**Blauwe afsluiter (recept voor spec 04 en 05).** `<section className="section-tight"><div className="container"><ColumnLines columnWidth={56} columnCount={40} radialFadeStart={0} radialFadeEnd={62} className="surface-brand rounded-2xl p-8 [--cl-at:100%_0%] md:p-12 lg:p-14">` (witte kolomlijnen op lage dekking die vanuit de rechterbovenhoek uitlopen) met een h2, een `text-lead`-alinea (kleur volgt `muted-foreground`, op blauw `#DCE1FF`) en twee `CtaButton`'s (`primary` wordt wit, `secondary` wordt wit omlijnd).

### 4.14 Stijlgids (alleen ontwikkeling)

`app/[locale]/stijlgids/page.tsx` (S) toont alle tokens, de typografische schaal, alle varianten van `CtaButton`, de velden in een demoformulier (`method="get"`, zonder JavaScript bruikbaar), badges in alle tonen, chips, kaarten, accordion, sheet, tabs, tabel, kruimelpad, paginering, alert, skeleton, `PhotoSlot`, het logo in alle varianten (op wit, in `.surface-brand`, in één kleur) en de blauwe afsluiter. De pagina roept `notFound()` aan als `process.env.NODE_ENV === "production"`, heeft `robots: { index: false, follow: false }` en staat niet in sitemap of `llms.txt`. Tekst staat in de page zelf (alleen Nederlands, buiten messages). Dit is de plek voor de visuele controle van stap 2 en voor de iteratierondes van morgen.

## 5 Data

Deze module leest of schrijft geen database. Ze gebruikt alleen de statusnamen uit 00 §4.3 voor de toonverdeling van badges (§4.7). De kolommen en enums zijn van spec 10, de Nederlandse labels van spec 08.

Gegevens in bestanden:

| Bestand | Inhoud | Lezers |
|---|---|---|
| `lib/brand.ts` | woordmerk, beschrijver, hexkleuren | layout (`themeColor`), icon-routes, OG (12), e-mail (11) |
| `lib/contrast-pairs.json` | contrastparen en koppeling merk naar token | `scripts/check-contrast.mjs`, `tests/unit/design/contrast.test.ts` (14) |
| `components/brand/logo-paths.json` | logopaden en viewBoxen | `Logo`, `LogoMark`, icon-routes, `scripts/brand-assets.mjs`, OG (12) |
| `lib/fonts.ts` | `fontSans`, `fontDisplay` | alle root-layouts |

## 6 Tekstelementen

Deze module bezit geen messages-namespace. Primitives krijgen alle zichtbare en verborgen tekst via props; de aanroeper haalt die uit de messages van zijn eigen namespace of uit `app/beheer/_strings.ts`.

| Prop | Bron (eigenaar) | Voorbeeld |
|---|---|---|
| `Logo title` | `contact.shortName` uit `lib/site.ts` (01) | Groos Personeelsdiensten |
| link om het logo (`aria-label`) | `header.homeAria` (03) | Groos Personeelsdiensten, naar de homepage |
| `Breadcrumb label` | `common.breadcrumbs.label` (03) | Kruimelpad |
| `SheetContent closeLabel`, `Toaster closeLabel` | `header.closeMenu` (03) of de namespace van de pagina | Sluiten |
| `Pagination label`, `PaginationPrevious label`, `PaginationNext label`, `PaginationStatus` | `vacatures.*` (06) | Paginering · Vorige · Volgende · Pagina 2 van 5 |
| `FileInput labels` | `forms.jobseeker.cv.*` (07) | `choose` Kies bestand · `remove` Verwijder · `hint` Een pdf of Word-bestand van hoogstens 10 MB. |
| `Chip removeLabel` | `vacatures.filters.removeChip` (06) | Verwijder filter Schoonmaker |
| `CtaButton pendingLabel` | `common.loading` (03) of de verzendtekst van het formulier (07) | Bezig met laden |
| `CtaButton newTabLabel` | `common.opensInNewTab` (03) | (opent in een nieuw venster) |

De tekst van de stijlgids staat in de page en volgt de schrijfregels. Voorbeeld voor het demoblok:
- Kop: "Zo ziet een formulier van Groos eruit"
- Intro: "Elk veld heeft een label en een duidelijke foutmelding. Je kunt het formulier ook zonder JavaScript gebruiken."
- Foutmelding: "Vul je telefoonnummer in, dan kunnen wij je bellen."
- Melding succes: "Gelukt, wij hebben je gegevens ontvangen. Jimmy of Lorenzo belt je om kennis te maken."

## 7 SEO

- `viewport.themeColor` blijft `brand.colors.background` (`#FFFFFF`).
- `app/icon.tsx` en `app/apple-icon.tsx` leveren PNG's; Next zet de `<link rel="icon">` en `<link rel="apple-touch-icon">` zelf. Beide routes staan al buiten de proxy-matcher.
- `public/brand/logo.png` (512 bij 512) is het logo voor `organizationLd` via `site.logo` (01, 12); `npm run check` controleert dat het bestand bestaat.
- De OG-opmaak staat in spec 12 §4.6; deze spec levert daarvoor de fonts in `assets/fonts/` (§4.12) en het woordmerk in `components/brand/logo-paths.json`.
- Fonts met `display: "swap"` en de automatische fallback van `next/font`, zodat koppen niet verspringen (CLS).
- `/stijlgids` is nooit indexeerbaar: 404 in productie, `noindex` in ontwikkeling, niet in sitemap of `llms.txt`.

## 8 Toegankelijkheid en performance

- Contrast volgens §4.1, bewaakt door `scripts/check-contrast.mjs` en spec 14.
- Focus altijd zichtbaar (`:focus-visible`, 2 px kobalt, 7,82:1). Velden gebruiken `outline-hidden` (Tailwind 4: onzichtbaar, maar zichtbaar in de modus met geforceerde kleuren) samen met hun kobaltrand en ring; nooit `outline-none` zonder vervanging.
- Doelgroottes volgens §4.5.
- Kleur nooit als enige drager: badges, foutmeldingen en actieve menu-items hebben tekst, icoon of streep.
- Koppen: de basisstijl van h1, h2 en h3 hangt aan het element; klassen alleen om de grootte te kiezen (`text-hero` op de home-h1), niet om een `p` als kop te laten lijken.
- Formulieren: native velden, `aria-invalid` en `aria-describedby` naar `FieldError` en `FieldDescription`; foutmeldingen met `role="alert"`; `RadioGroup` als `fieldset` met `legend`.
- Reduced motion: reveal, overgangen en animaties staan uit; `scroll-behavior` wordt `auto`.
- `forced-colors`: keuzevakjes en keuzerondjes vallen terug op de systeemweergave.
- Server components standaard. Client alleen voor `FileInput`, `Sheet`, `Tabs` en `Toaster` (en de header-eilanden van spec 01). `Reveal` is geen client component meer, wat framer-motion uit de publieke bundel haalt.
- Twee fontfamilies, elk variabel en met twee subsets vooraf geladen (latin en latin-ext). Geen andere webfonts.
- Geen afbeeldingen nodig voor het ontwerp; het patroon is een kleine inline SVG in CSS.

## 9 21st.dev-opdracht voor sub-agents

**Werkwijze voor de bouw-agent van stap 2.** Laad de tools met `ToolSearch` `"select:mcp__magic__search,mcp__magic__get_inspiration"`. Spawn de vijf sub-agents hieronder tegelijk, direct nadat `app/globals.css` en `lib/fonts.ts` staan. Elke sub-agent:
1. doet `mcp__magic__search` met `type: "component"` en `limit: 10` voor elke opgegeven formulering, en `mcp__magic__get_inspiration` met de opgegeven beschrijving (zonder `context`; de resultaten daarvan waren op 2 oktober 2026 rommelig, dus `search` weegt zwaarder);
2. bekijkt de preview-afbeeldingen van de beste treffers;
3. levert 2 tot 4 kandidaten per plek met id, naam, auteur en preview-URL, plus een gemotiveerde keuze of de conclusie "eigen primitive volstaat";
4. roept **nooit** `get_component` aan. Dat doet alleen de bouw-agent, voor de gekozen kandidaat, met een budget van **twee** retrievals in deze stap, in volgorde `FileInput`, `Sheet`. Voor alle andere plekken bouwt de agent op de shadcn-bron en de eigen primitives, met de preview als visuele referentie.

Primitives worden alleen in deze spec gescout; paginaspecs scouten composities. SA-02-E (header, actiebalk en footer) vervalt: die plekken scout spec 01 §9.2 tot en met §9.4, binnen het uiterlijk van §4.13.

De bouw-agent legt de uitkomst vast in `docs/21st-keuzes.md` onder het kopje "Spec 02": per plek de kandidaten, de keuze, wel of geen `get_component`, en wat er is aangepast.

**Selectiecriteria voor elke plek.** Minimaal en rustig; witte achtergrond; blauw accent alleen via tokens (`bg-primary`, `text-brand`, `bg-brand-tint`, `ring-ring`); past bij de boodschap van de plek (nuchter, betrouwbaar, snel contact); shadcn-compatibel met Tailwind 4 en `cn()`; toegankelijk (toetsenbord, aria, zichtbare focus, 44 px); geen nieuwe dependencies, dus geen `radix-ui`, `vaul`, `sonner`, `motion` of `framer-motion` in nieuwe primitives, wel `@base-ui-components/react` 1.0.0-rc.0 en lucide-react 0.456; geen glas, gloed, verloop, raster, spotlight, marquee of neonkleur (B-29); formulierelementen moeten native blijven (B-36).

**Aanpassingsregels.** Kleuren, radius en schaduw alleen via de tokens uit §4.2 (het standaardpalet staat uit, dus `zinc-*`, `neutral-*` en `blue-*` uit een 21st.dev-component moeten worden vervangen); de namen en props uit §4.7 blijven gelijk; sectie-id's van bestaande componenten blijven; alle tekst via props of messages; server component tenzij er interactie is; `Link` uit `@/i18n/navigation`; iconen uit lucide 0.456 met lijndikte 2; `prefers-reduced-motion` gerespecteerd; geen eyebrows of labels boven koppen (B-05).

**Valt 21st.dev tegen**, dan bouwt de agent op de shadcn-bron en de primitives uit §4.7. Dat is geen blokkade voor de stap.

**SA-02-A Knoppen, badges en chips** (`CtaButton`, `Badge`, `Chip`)
- `search`: "minimal button with icon shadcn"; "button loading state spinner"; "status badge with dot"; "soft pill badge tones"; "filter chips toggle tags"; "removable filter chip".
- `get_inspiration`: "calm button set for a white website with one blue accent: primary, outline, soft tint, ghost"; "status badges for an admin list: new, in progress, placed, rejected".
- Startkandidaten (gevonden op 2 oktober 2026):

| Plek | Id | Naam (auteur) | Preview |
|---|---|---|---|
| knop | 1323 | Button (shadcn) | https://cdn.21st.dev/user_shadcn/button/default/preview.png |
| knop | 136 | Button met icoon (originui) | https://cdn.21st.dev/user_originui/button/button-with-icon/preview.1786740655896.png |
| knop | 2625 | Linear Button (ln-dev7) | https://cdn.21st.dev/user_2rmPdOT0hL8MtSnYm8IpqqrYTVg/button/default/preview.1750811410454.png |
| badge | 3557 | Badge met stip (sean0205) | https://cdn.21st.dev/sean0205/badge-1/with-dot/preview.1751391624600.png |
| badge | 521 | Status Badge (serafimcloud) | https://cdn.21st.dev/user_2nElBLvklOKlAURm6W1PTu6yYFh/status-badge/default/preview.png?v=1 |
| chip | 3259 | Chip (preetsuthar17) | https://cdn.21st.dev/preetsuthar17/chip/default/preview.1751036791280.png |
| chip | 22213 | Role Filter Chips (cnippet-dev) | https://cdn.21st.dev/cnippet.dev/v-toggle-10/default/preview.1785464988753-9b6ec5e3-892f-4c68-86b6-2889d926f506.png |

- Specifiek: de knop is geen pil; geen arcering of gloed (13568 "Minimal Button" valt daarom af); de badge heeft geen pulserende stip.

**SA-02-B Formulierprimitives** (`Input`, `Textarea`, `NativeSelect`, `Field`, `Checkbox`, `RadioCard`, `FileInput`)
- `search`: "input field with label and error message"; "native select"; "checkbox with label and description"; "radio group cards yes no"; "file upload dropzone input"; "cv upload single file".
- `get_inspiration`: "accessible job application form fields on mobile, large inputs, clear inline errors"; "single file upload for a CV with file name and remove button".
- Startkandidaten:

| Plek | Id | Naam (auteur) | Preview |
|---|---|---|---|
| veld met fout | 25083 | Email Field with Error State (cnippet-dev) | https://cdn.21st.dev/cnippet.dev/v-label-15/default/preview.1787161819293-e1478252-21f7-47fe-95d8-aad2eed1df7b.png |
| veld met hulptekst | 25066 | Label with Helper Text (cnippet-dev) | https://cdn.21st.dev/cnippet.dev/v-label-9/default/preview.1787156368260-532a5e86-8fbc-474e-bf44-f34fe6b58b23.png |
| keuzelijst | 262 | Select (Native) (originui) | https://cdn.21st.dev/user_originui/select-native/required-select-native/preview.png?v=1 |
| keuzelijst | 31494 | Native Select (wensity) | https://cdn.21st.dev/user_3JFJF7Mbb5ImA8DO9hE1FECx2fT/native-select/default/preview.1790327944420.webp |
| keuzevak | 24896 | Checkbox with Description (felipemenezes098) | https://cdn.21st.dev/user_felipemenezes098/checkbox-02/default/preview.1787744641167.webp |
| keuzerondje | 747 | Radio Group als kaart (originui) | https://cdn.21st.dev/user_originui/radio-group/card/preview.png?v=1 |
| keuzerondje | 17933 | Reshaped Radio (reshaped) | https://cdn.21st.dev/larsen66/reshaped-radio/cards/preview.1783441236441.png |
| bestand | 19201 | File Dropzone (joyco) | https://cdn.21st.dev/joyco/file-dropzone/default/preview.1783712252441.png |
| bestand | 18031 | Animated File Upload (educalvolpz) | https://cdn.21st.dev/educlopez/animated-file-upload/default/preview.1783571477956.png |
| bestand | 4355 | File Upload (ephraimduncan) | https://cdn.21st.dev/larsen66/file-upload-1/multi-file-dropzone/preview.1753209223376.png |

- Specifiek: één bestand, geen afbeeldingsvoorbeeld, geen voortgangsbalk met nepwaarden; keuzevakjes en keuzerondjes alleen als visuele referentie, want de bouw is native (`control-check`, `control-radio`). Kandidaten op Radix of een andere base-ui-versie worden alleen visueel gebruikt.

**SA-02-C Kaarten, icoontegels en accordion** (`Card`, `IconTile`, `Accordion`)
- `search`: "feature card with icon minimal"; "icon link card"; "faq accordion minimal plus icon"; "ghost accordion borderless".
- `get_inspiration`: "five profession cards with a line icon, white cards with a thin border on a light grey section"; "FAQ list with plus icon on a white page".
- Startkandidaten:

| Plek | Id | Naam (auteur) | Preview |
|---|---|---|---|
| kaart | 25350 | Icon Link Card (cnippet-dev) | https://cdn.21st.dev/cnippet.dev/v-card-14/default/preview.1787243179519-2718acf7-06b0-4da0-9095-4a2bc1272063.png |
| kaarten | 2070 | Grid Feature Cards (efferd) | https://cdn.21st.dev/user_2tWTE0rCrloVAVylFPYfp10xU92/grid-feature-cards/default/preview.1789739376715.png |
| kaarten | 28299 | Icon Feature Grid (felipemenezes098) | https://cdn.21st.dev/felipemenezes098/content-09/default/preview.1789960680853-9ebfa8cd-a2db-4f86-bdfe-947ffcc7bad7.png |
| accordion | 1605 | Accordion Plus Minus (designali-in) | https://cdn.21st.dev/user_2rO0IUQINTfBex4xN8Ghho5dpr4/accordion-plus-minus/accordion-plus-minus/preview.png?v=1 |
| accordion | 29230 | Ghost Accordion (arihantcodes_1f7b8c4d) | https://cdn.21st.dev/user_2xmIUPynCyYHPXZPBwS1EDV1Aq8/accordion-ghost/default/preview.1790098201798.png |
| accordion | 24907 | Accordion with Plus/Minus Indicators (cnippet-dev) | https://cdn.21st.dev/user_36Tbt0v8JdD4jEycmBFhR8tojnR/v-accordion-5/default/preview.1787744030659.png |

- Specifiek: kaarten zonder schaduw in rust en zonder schreefkop; de accordion blijft native `<details>`, de kandidaat levert alleen ritme en icoon.

**SA-02-D Navigatieprimitives** (`Sheet`, `Tabs`, `Breadcrumb`, `Pagination`)
- `search`: "filter sheet mobile drawer"; "bottom sheet filters"; "underline tabs"; "breadcrumb"; "pagination with previous next"; "pagination page x of y".
- `get_inspiration`: "mobile filter panel for a job board that slides up from the bottom with an apply button"; "simple pagination for a job list, previous and next with page numbers".
- Startkandidaten:

| Plek | Id | Naam (auteur) | Preview |
|---|---|---|---|
| sheet | 25002 | Sheet (Different Directions) (shadcnspace) | https://cdn.21st.dev/user_38qAOtph5HovpSn2yjNYXjbTOm2/sheet-01/default/preview.1787762812125.webp |
| sheet | 25010 | Sheet with Scrollable Content (shadcnspace) | https://cdn.21st.dev/user_38qAOtph5HovpSn2yjNYXjbTOm2/sheet-02/default/preview.1787762237746.webp |
| sheet | 31360 | Drawer (wensity) | https://cdn.21st.dev/user_3JFJF7Mbb5ImA8DO9hE1FECx2fT/drawer/default/preview.1790329202394.webp |
| kruimelpad | 440 | Breadcrumb (originui) | https://cdn.21st.dev/user_originui/breadcrumb/with-slash/preview.1786744594052.png |
| kruimelpad | 5891 | Breadcrumb (SubframeApp) | https://cdn.21st.dev/larsen66/breadcrumb/default/preview.1755898058615.png |
| paginering | 1581 | Pagination (shadcn) | https://cdn.21st.dev/user_shadcn/pagination/separate/preview.png?v=1 |
| paginering | 25116 | Numberless Pagination with Text (shadcnui-blocks) | https://cdn.21st.dev/shadcnui-blocks/pagination-12/default/preview.1787170013867-56acf64a-63c8-48c2-bb22-8730a2988c54.png |
| paginering | 27693 | Default Pagination (shadcnui-blocks) | https://cdn.21st.dev/shadcnui-blocks/pagination-01/default/preview.1789797367860-ee522ddb-9403-4b33-9960-bbac879e62ff.png |

- Specifiek: de sheet draait op base-ui `Dialog` (geen `vaul`); paginering zijn echte links met `?pagina=n` (B-16).

**SA-02-E** vervalt (zie de werkwijze hierboven).

**SA-02-F Beheerprimitives** (`Table`, `Toaster`, `Skeleton`, `Alert`)
- `search`: "data table with status badges admin"; "card table"; "toast notification"; "inline alert info success warning".
- `get_inspiration`: "mobile friendly admin list of job applications with status badges and quick actions".
- Startkandidaten:

| Plek | Id | Naam (auteur) | Preview |
|---|---|---|---|
| tabel | 22174 | Card Table (felipemenezes098) | https://cdn.21st.dev/user_felipemenezes098/table-08/default/preview.1788375888337.png |
| tabel | 22189 | Team Members Table (cnippet-dev) | https://cdn.21st.dev/cnippet.dev/v-table-6/default/preview.1785135810405-98114e13-3fa4-479d-b4ec-ff4fe7da01f2.png |
| toast | 27363 | Sonner Toast (isaiahbjork) | https://cdn.21st.dev/user_2tkbBPFWYn8YMjZNHwgIuP3yzvd/primitive-sonner/default/preview.1789737198718.webp |
| toast | 19945 | Sonner Success Toast (bundui) | https://cdn.21st.dev/user_bundui/toast2/default/preview.1784801803633.png |

- Specifiek: toasts zijn alleen visuele referentie, de bouw is base-ui `Toast` (geen `sonner`); tabellen zonder avatarfoto's.

## 10 Bouwopdracht

> **Notitie.** De wijzigingen aan `RadioCard`, `FieldLegend` en de regel voor `ariaLabel` uit kruiscontrole ronde 3 voert de nazorg-sub-agent van bouwstap 3b uit (00 §6, B-52).

> **Notitie.** Bouwstap 2 is gecommit. De wijzigingen uit kruiscontrole ronde 1 (CtaButton-props, CheckboxField-props, FileInput `name` optioneel, ChipCheckbox weg, Badge-tonen, LanguageToggle, footer en header, `OFL.txt`) voert de bouw-agent van bouwstap 3b als nazorg uit (00 §6), samen met de wijzigingen uit kruiscontrole ronde 2: `titleAs` en `titleId` in `components/ui/alert.tsx` en de nieuwe succesmelding in `app/[locale]/stijlgids/page.tsx`.

Dit is bouwstap 2 uit 00 §6. Voorwaarde: stap 1 is klaar en de werkboom is gecommit, zodat de upgrade-diff te beoordelen is.

1. **Tailwind 4.** Draai `npx @tailwindcss/upgrade@4.3.3`. Laat het de klassen in `app/`, `components/` en `lib/` omzetten (onder meer `shadow-sm` naar `shadow-xs`, `rounded` naar `rounded-sm`, `outline-none` naar `outline-hidden`, `flex-shrink-0` naar `shrink-0`). Controleer de diff op logica; alleen klassen mogen wijzigen.
2. **Pakketten.** `npm i -D tailwindcss@^4.3.3 @tailwindcss/postcss@^4.3.3 sharp@^0.35.5 && npm i tailwind-merge@^3.7.0 tw-animate-css@^1.4.0 && npm uninstall autoprefixer`. `postcss.config.mjs` wordt `export default { plugins: { "@tailwindcss/postcss": {} } };`. Verwijder `tailwind.config.ts` als de upgrade dat niet deed.
3. **Tokens.** Schrijf `app/globals.css` exact als in §4.2 (ook als de upgrade er iets anders van maakte).
4. **`lib/utils.ts`:**

```ts
import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Eigen tekstgroottes uit app/globals.css. Zonder deze regel ziet tailwind-merge
// "text-h2" als een kleur en valt hij weg naast "text-foreground" (getest met 3.7.0).
const twMerge = extendTailwindMerge({
  extend: { theme: { text: ["hero", "h1", "h2", "h3", "lead"] } },
});

/** Voeg Tailwind-klassen samen; bij conflicten wint de laatste. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

5. **`components.json`:**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": { "config": "", "css": "app/globals.css", "baseColor": "neutral", "cssVariables": true, "prefix": "" },
  "iconLibrary": "lucide",
  "aliases": { "components": "@/components", "utils": "@/lib/utils", "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/lib/hooks" }
}
```

6. **Merk en contrast.** Schrijf `lib/brand.ts`, `lib/contrast-pairs.json` en `scripts/check-contrast.mjs` (§4.3). Draai `node scripts/check-contrast.mjs`; exitcode 0.
7. **Fonts.** Schrijf `lib/fonts.ts` (§4.4) en zet in `app/[locale]/layout.tsx` de twee fontvariabelen op `<html>` en `bg-background font-sans text-foreground antialiased` op `<body>`; haal de `Inter`-import weg. Spec 01 herschrijft de layout in stap 3 en neemt dit over.
8. **21st.dev.** Spawn de sub-agents uit §9 en wacht op hun voorstellen voordat je primitives afmaakt.
9. **shadcn.** `npx shadcn@latest add input textarea native-select card table skeleton`. Controleer daarna met `git diff app/globals.css` dat de CLI de tokens niet heeft aangepast; zo wel, zet de versie uit §4.2 terug. Controleer dat `package.json` geen nieuwe pakketten kreeg.
10. **Primitives.** Pas de toegevoegde bestanden aan volgens §4.7 en schrijf `cta-button.tsx` (met `ctaButtonVariants` en `data-slot`), `label.tsx`, `field.tsx`, `checkbox.tsx`, `radio-group.tsx`, `file-input.tsx`, `badge.tsx`, `chip.tsx`, `icon-tile.tsx`, `accordion.tsx`, `alert.tsx`, `photo-slot.tsx`, `sheet.tsx`, `tabs.tsx`, `breadcrumb.tsx`, `pagination.tsx` en `toast.tsx`. Verwijder `components/ui/button.tsx` en `@radix-ui/react-slot` (in lijn met spec 01). Pas `navigation-menu.tsx` en `language-toggle.tsx` alleen in uiterlijk aan.
11. **Logo.** Draai `node scripts/extract-logo.mjs` (§4.11), schrijf `components/brand/logo.tsx` en `logo-mark.tsx`, en zet `wordmark.tsx` en `monogram.tsx` om naar wrappers (§4.11).
12. **Assets.** Schrijf `scripts/brand-assets.mjs` (§4.11 punt 5) en draai het. Haal de fonts en `OFL.txt` op voor `assets/fonts/` (§4.12).
13. **Iconen.** Herschrijf `app/icon.tsx` en `app/apple-icon.tsx` (§4.11 punt 6).
14. **Migratie van bestaande componenten.** Voer de tabel uit §4.6 uit. Daarna geven deze zoekopdrachten niets meer: `grep -rn "hsl(var(" app components lib` en `grep -rnE "glass-panel|spotlight|bg-grid|logo-mono|blend-top|hairline|animate-glow-pulse" app components`. `SectionHeading` krijgt `text-h2` voor de kop en `text-lead text-muted-foreground max-w-[60ch]` voor de intro, met gelijke props.
15. **Beweging.** Herschrijf `components/motion/reveal.tsx` als server component (§4.10) met gelijke exports en props.
16. **Stijlgids.** Maak `app/[locale]/stijlgids/page.tsx` (§4.14).
17. **CLAUDE.md** (alleen de feiten die deze stap verandert): in "Stack en commando's" Tailwind CSS 4; in "Design tokens" dat tokens in `app/globals.css` staan via `@theme inline` en er geen `tailwind.config.ts` en geen `.dark` meer is; de signature-klassen worden `.accent-text`, `.surface-brand`, `.pattern-oo`, `.prose-groos`.
18. **Verifiëren.** `npm run verify`; `node scripts/check-contrast.mjs`; `npm run check -- --warn` zonder punten uit `lib/brand.ts`, `app/icon.tsx`, `app/apple-icon.tsx` of `components/brand/`; `node -e "import('./lib/utils.ts').then(m => console.log(m.cn('text-h2', 'text-foreground')))"` toont beide klassen (of de gelijkwaardige Vitest-test van spec 14); Playwright op 390, 768, 1280 en 1440 px van `/` en `/stijlgids`, eerst helemaal doorscrollen, screenshots alleen in `.playwright-mcp/`.
19. **Na stap 4.** Controleer dat `marquee.tsx` en `count-up.tsx` weg zijn en dat niets `framer-motion` meer importeert; zo ja, `npm uninstall framer-motion`. Haal `--tracking-brand` uit `app/globals.css` als niets het meer gebruikt.

Afhankelijkheden: spec 01 neemt `lib/fonts.ts`, `Wordmark`, `CtaButton`, `navigationMenuTriggerStyle` en de breadcrumb-delen over in stap 3; spec 06, 07 en 08 gebruiken de primitives in stap 5 tot en met 7; spec 11 gebruikt `public/brand/logo-email.png`; spec 12 bouwt de OG-afbeelding met `assets/fonts/` en `logo-paths.json`; spec 14 leest `lib/contrast-pairs.json`.

## 11 Acceptatiecriteria

| Id | Criterium | Eis |
|---|---|---|
| AC-02-01 | `node scripts/check-contrast.mjs` eindigt met exitcode 0 en de regel "Alle contrastparen en merkwaarden kloppen."; elk paar uit `lib/contrast-pairs.json` staat met "ok" in de uitvoer. | E-02-01, E-02-02 |
| AC-02-02 | `package.json` heeft `tailwindcss` ^4.3, `@tailwindcss/postcss`, `tailwind-merge` ^3.7, `tw-animate-css` en devDependency `sharp`; het heeft geen `autoprefixer`, `@radix-ui/react-slot`, `radix-ui`, `sonner` of `next-themes`; `tailwind.config.ts` bestaat niet. | E-02-03, E-02-07 |
| AC-02-03 | `npm run verify` slaagt na stap 2. | E-02-03 |
| AC-02-04 | Op `http://localhost:3000/` geeft `getComputedStyle(document.documentElement).getPropertyValue("--brand").trim()` de waarde `#2741c9`, en `app/globals.css` bevat geen `.dark`-blok. | E-02-01 |
| AC-02-05 | Op `http://localhost:3000/` is `getComputedStyle(document.body).fontSize` `17px` en bevat `fontFamily` "Onest"; de `fontFamily` van de `h1` bevat "Instrument Sans". | E-02-04 |
| AC-02-06 | `grep -rnE "(bg\|text\|border\|ring\|fill\|stroke\|from\|to)-(slate\|gray\|zinc\|neutral\|stone\|red\|orange\|amber\|yellow\|lime\|green\|emerald\|teal\|cyan\|sky\|blue\|indigo\|violet\|purple\|fuchsia\|pink\|rose)-[0-9]{2,3}" app components` geeft geen treffers. | E-02-01, E-02-17 |
| AC-02-07 | `grep -rn "hsl(var(" app components lib` en `grep -rnE "glass-panel\|spotlight\|bg-grid\|logo-mono\|blend-top\|hairline\|animate-glow-pulse" app components` geven geen treffers. | E-02-06 |
| AC-02-08 | `cn("text-h2", "text-foreground")` geeft `"text-h2 text-foreground"` en `cn("text-sm", "text-h3")` geeft `"text-h3"`. | E-02-03 |
| AC-02-09 | Op `/` bij 1280 px staat in de header een `svg` met `role="img"` of een link met `aria-label` rond een decoratieve `svg`; de `svg` is 28 px hoog, bij 390 px 26 px; er is een pad met de klasse `fill-brand`. | E-02-12, E-02-13, E-02-15 |
| AC-02-10 | Op `/stijlgids` hebben alle paden van het logo binnen `.surface-brand` een berekende `fill` van `rgb(255, 255, 255)`, en het logo met `tone="mono"` heeft alleen paden in `currentColor`. | E-02-12, E-02-13 |
| AC-02-11 | `public/brand/logo.png` is een PNG van 512 bij 512, `public/brand/logo-email.png` een PNG van 480 bij 200 (gemeten met `sharp(...).metadata()`), en `public/brand/logo.svg` en `logo-mark.svg` bestaan; `npm run check -- --warn` meldt geen ontbrekend logo. | E-02-13 |
| AC-02-12 | `GET /icon` geeft 200 met `content-type: image/png` en 64 bij 64 px; `GET /apple-icon` 200 en 180 bij 180 px; beide tonen een kobalt vlak met het witte beeldmerk. | E-02-13 |
| AC-02-13 | Op `/stijlgids`: na Tab naar de eerste `CtaButton` is de berekende `outline` `2px solid rgb(39, 65, 201)` met `outline-offset` `2px`; na focus in een `Input` is `border-color` `rgb(39, 65, 201)`. | E-02-05 |
| AC-02-14 | Op `/stijlgids` bij 390 px is elk element met `data-slot="cta-button"`, elke `input` (behalve checkbox, radio en `sr-only`), elke `textarea`, elke `select`, elke chip, paginalink, `RadioCard` en elk label van `CheckboxField` minstens 44 px hoog. | E-02-05, E-02-07 |
| AC-02-15 | Met JavaScript uit (`javaScriptEnabled: false`) kan op `/stijlgids` het demoformulier een keuzevak aanvinken, een `RadioCard` kiezen, een optie in `NativeSelect` kiezen en versturen; de gekozen waarden staan daarna in de query van de URL. | E-02-08 |
| AC-02-16 | Met `reducedMotion: "reduce"` en ook met JavaScript uit hebben alle elementen met `data-reveal` op `/` direct na het laden `opacity: 1`, zonder te scrollen. | E-02-11 |
| AC-02-17 | Op `/` en `/stijlgids` bij 390 px is `document.documentElement.scrollWidth` niet groter dan 390. | E-02-05 |
| AC-02-18 | Na `npm run build && npm start` geeft `GET /stijlgids` een 404; met `npm run dev` geeft hij 200 met `<meta name="robots" content="noindex, nofollow">`. | E-02-07 |
| AC-02-19 | Bij 390 px is de header 64 px hoog, de menuknop 44 bij 44 px, zijn de knoppen van de actiebalk 48 px hoog en hebben de footerlinks een hoogte van minstens 44 px; de footer heeft `background-color` `rgb(245, 246, 250)`. | E-02-15 |
| AC-02-20 | `docs/21st-keuzes.md` heeft een sectie "Spec 02" met per plek uit §9 de kandidaten (id, naam, preview-URL), de keuze en de aanpassingen, en er zijn hooguit twee `get_component`-aanroepen gedaan. | E-02-16 |
| AC-02-21 | `docs/specs/assets/logo/logo-mark.svg`, `logo-horizontaal.svg`, `logo-gestapeld.svg`, `icoon.svg` en `overzicht.svg` bestaan en zijn geldige XML, `overzicht.png` bestaat, en er staan geen andere logo-ontwerpen in die map; `components/brand/logo-paths.json` noemt de vier bronbestanden als `source` en `node scripts/extract-logo.mjs` laat het bestand ongewijzigd. | E-02-12 |
| AC-02-22 | `assets/fonts/InstrumentSans-SemiBold.ttf`, `Onest-Regular.ttf` en `Onest-Medium.ttf` bestaan, elk kleiner dan 100 kB, en `assets/fonts/OFL.txt` bestaat. | E-02-14 |
| AC-02-23 | Op `/stijlgids` staan zes badges in de tonen neutral, brand, info, success, warning en danger, elk met een tekstlabel; de tabel van §4.7 voor statusbadges is in spec 08 overgenomen (kruiscontrole). | E-02-18 |
| AC-02-24 | Lighthouse mobiel op de productiebuild van `/` na stap 4: Cumulative Layout Shift 0,05 of lager, en geen verzoek naar `fonts.googleapis.com` of `fonts.gstatic.com` vanuit de browser. | E-02-04, E-02-11 |
| AC-02-25 | `grep -rnE "strokeWidth=\\{(0\|1)(\\.[0-9]+)?\\}" app components` geeft geen treffers, alle iconen komen uit `lucide-react` (versie 0.456.0 in `package-lock.json`), en op `/stijlgids` heeft elk `svg` van Lucide naast tekst `aria-hidden="true"`. | E-02-09 |
| AC-02-26 | `public/` bevat na stap 2 geen fotobestanden (`.jpg`, `.jpeg`, `.webp`, `.avif`) buiten `public/brand/`; op `/stijlgids` toont `PhotoSlot` zonder `src` het fallbackvlak in `bg-brand-tint` met `aria-hidden="true"` en met `src` een `img` van `next/image` met `sizes`. | E-02-10 |

## 12 Open vragen en aannames

| Onderwerp | Aanname in deze spec | Bevestigt | Gevolg als het anders is |
|---|---|---|---|
| Merkrichting (B-01) | Wit met kobalt, richting C zonder limoen. | Jimmy en Lorenzo via Djulan | Alleen tokens in `app/globals.css`, `lib/brand.ts`, fonts en logo wijzigen. |
| Tint van het blauw | `#2741C9` in plaats van `#3340E0` (rustiger, 7,82:1). | Djulan | Eén token en één hexwaarde; het contrastscript toetst opnieuw. |
| Logo | Besloten (B-61): het beeldmerk van de klant, één op één en vlak, met het woordmerk in het lettertype van de site. | Jimmy en Lorenzo via Djulan | Een wijziging van het beeldmerk: de paden in `docs/specs/assets/logo/logo-mark.svg` en de drie andere bronbestanden aanpassen, daarna `node scripts/extract-logo.mjs` en `node scripts/brand-assets.mjs` draaien. |
| Merkrecht | Geen onderzoek gedaan; context/12 §4.3 noemt naamgenoten. | Jimmy (specialist BOIP en EUIPO, klasse 35) | Vóór belettering van bus en hesjes laten toetsen. |
| Druk en folie | Pantone en foliekleur voor `#2741C9` volgen uit een proef. | Jimmy | Geen gevolg voor de site. |
| Nieuwe pakketten (B-37) | `tw-animate-css` 1.4 en devDependency `sharp` 0.35.5 zijn nodig en hier vermeld; geen `radix-ui`, `sonner` of `next-themes`. | Djulan | Zonder `sharp`: PNG's eenmalig met de hand maken. |
| Primitives op base-ui | `Sheet`, `Tabs` en `Toaster` draaien op `@base-ui-components/react` 1.0.0-rc.0, net als de navigatie van spec 01. | Djulan | Bij een upgrade naar `@base-ui/react` 1.x veranderen alleen deze wrappers. |
| Geen `button.tsx` | Knoppen lopen via `CtaButton` en `ctaButtonVariants`; spec 01 verwijdert `button.tsx` (AC-01-04) en dat blijft zo. In het beheer is `CtaButton` alleen een knop zonder `href`; links met knoplook zijn `next/link` met `ctaButtonVariants`. | kruiscontrole | Geen. |
| 21st.dev-budget | Hooguit twee `get_component`-aanroepen (`FileInput`, `Sheet`); header, actiebalk en footer scout spec 01. | kruiscontrole | Een derde aanroep vraagt een nieuwe afspraak in §9 en AC-02-20. |
| Nazorg bouwstap 2 | De wijzigingen uit kruiscontrole ronde 1 en ronde 2 (`titleAs` en `titleId` in `Alert`, nieuwe succesmelding in de stijlgids) voert de bouw-agent van bouwstap 3b uit; de wijzigingen uit ronde 3 (`RadioCard`-props, `FieldLegend variant`, regel voor `ariaLabel`) voert de nazorg-sub-agent van bouwstap 3b uit (§10, 00 §6, B-52). | bouw-agent stap 3b | Blijft het liggen, dan wijken de primitives af van §4.7, falen AC-02-14 en AC-02-19 mogelijk, staat er een kop als `<p>` in een `Alert`, missen keuzerondjes `aria-invalid` en `aria-describedby` en is de legend van een `RadioGroup` zo groot als een h3. |
| Accordion | Native `<details>` in plaats van Radix of base-ui, zodat FAQ-tekst zonder JavaScript in de DOM staat; titels standaard zonder kop in `summary`, met `headingLevel` als optie (aanname bij B-05). | Djulan | Met kopelementen: `headingLevel="h3"` meegeven. |
| Select | Op de publieke site alleen `NativeSelect`. | Djulan | Een base-ui-Select alleen in het beheer, als spec 08 dat vraagt. |
| Reveal | Scroll-gedreven CSS zonder JavaScript; browsers zonder ondersteuning tonen de inhoud zonder animatie. | Djulan | Met framer-motion terug: inhoud moet dan server-side zichtbaar blijven (spec 14). |
| Fontvariabelen | `--font-onest` en `--font-instrument` in `lib/fonts.ts`, gekoppeld aan `font-sans` en `font-display`; CLAUDE.md noemde `--font-sans` en `--font-display` in de layout. | Djulan | Geen gevolg voor klassen. |
| Header zonder beschrijver | `Wordmark` heeft nu standaard geen beschrijver; de footer zet `showDescriptor`. | Djulan | Met beschrijver in de header: lockup op 40 px, beschrijver dan erg klein. |
| Stijlgids | `app/[locale]/stijlgids` alleen in ontwikkeling (404 in productie); routes zijn van spec 01. | Djulan, spec 01 | Zonder stijlgids: visuele controle op de echte pagina's. |
| Doelgrootte bij keuzevakjes | Keuzevakjes en keuzerondjes zijn 20 px met een label van 44 px; spec 14 meet het label. | spec 14 | Anders faalt de doelgroottetest op native keuzevakjes. |
| Logo-PNG voor e-mail | `public/brand/logo-email.png` (480 bij 200) is het logo in alle mails van spec 11. | spec 11 | Een andere maat vraagt een regel in `brand-assets.mjs`. |
| OG-fonts | Statische TTF's en `OFL.txt` in `assets/fonts/` (eigendom fonts: deze spec); opmaak en bouw van de OG-afbeelding zijn van spec 12 §4.6. | spec 12 | Zonder eigen fonts valt `ImageResponse` terug op de standaardletter. |
| Iconen beroepen | Voorstel `Droplets`, `SprayCan`, `Forklift`, `Truck`, `HardHat`. | spec 01 | Spec 01 mag andere Lucide-iconen kiezen; het type blijft `LucideIcon`. |
