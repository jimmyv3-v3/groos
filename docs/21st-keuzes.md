# Keuzes uit 21st.dev

Vastlegging van de 21st.dev-zoektochten per bouwstap. Zoeken liep via
`mcp__magic__search` (type component, limit 10) en `mcp__magic__get_inspiration`;
`get_component` alleen voor de gekozen kandidaat (budget drie in stap 2).
`get_inspiration` gaf in alle zes zoektochten vooral ruis (bookmarks, kaart,
workflow-blokken, testimonials); de keuzes leunen op `search`.

## Spec 02

Uitgevoerd op 2 oktober 2026 door zes sub-agents (SA-02-A tot en met F). De
previews zijn bekeken op metadata en beschrijving. Eén `get_component`-aanroep
gedaan (FileInput); voor header en footer is bewust niets opgehaald, omdat spec
02 §4.13 het uiterlijk volledig vastlegt en elke kandidaat Radix, een sheet of
een uitgesloten stijl meebracht.

Previewbasis: `https://cdn.21st.dev/` plus het pad.

| Plek | Kandidaten (id, naam, auteur, preview) | Keuze | get_component | Aanpassing |
|---|---|---|---|---|
| Knop (`CtaButton`) | 1323 Button (shadcn) `user_shadcn/button/default/preview.png`; 136 Button with icon (originui) `user_originui/button/button-with-icon/preview.1786740655896.png`; 15405 Button (extend-hq) `user_extend-hq/button/default/preview.1788879970364.png`; 2625 Linear Button (ln-dev7) `user_2rmPdOT0hL8MtSnYm8IpqqrYTVg/button/default/preview.1750811410454.png` | eigen primitive, cva-opbouw naar 1323, laadstaat naar 136/15405 | nee | geen Radix-Slot; varianten en maten uit §4.7; `data-slot="cta-button"`, `pending` met `LoaderCircle` |
| Badge | 3557 Badge with dot (sean0205) `sean0205/badge-1/with-dot/preview.1751391624600.png`; 521 Status Badge (serafimcloud) `user_2nElBLvklOKlAURm6W1PTu6yYFh/status-badge/default/preview.png?v=1` | eigen primitive, 3557 als referentie | nee | zes tonen op tokens, statische stip, altijd tekst |
| Chip | 3259 Chip (preetsuthar17) `preetsuthar17/chip/default/preview.1751036791280.png`; 22213 Role Filter Chips (cnippet-dev) `cnippet.dev/v-toggle-10/default/preview.1785464988753-9b6ec5e3-892f-4c68-86b6-2889d926f506.png`; 1963 Selector Chips (preetsuthar17) | eigen primitive | nee | link met `scroll={false}` of `<span>`; `ChipCheckbox` als native checkbox (GET-formulier) |
| Veld met fout en hulptekst | 25083 Email Field with Error State (cnippet-dev) `cnippet.dev/v-label-15/default/preview.1787161819293-e1478252-21f7-47fe-95d8-aad2eed1df7b.png`; 25066 Label with Helper Text (cnippet-dev) `cnippet.dev/v-label-9/...`; 25085 Multi-Field Form (cnippet-dev) | eigen `Field`-familie | nee | `aria-invalid`, `aria-describedby`, `role="alert"` |
| Textarea | 25374 Textarea with Error (bundui) | shadcn-bron, aangepast | nee | klassen gedeeld met `Input` |
| Keuzelijst | 31494 Native Select (wensity) `user_3JFJF7Mbb5ImA8DO9hE1FECx2fT/native-select/default/preview.1790327944420.webp`; 262 Select (Native) (originui) `user_originui/select-native/required-select-native/preview.png?v=1`; 22986 ReUI Native Select | shadcn `native-select`, aangepast | nee | `ChevronDown` `size-5`, veldklassen van `Input` |
| Keuzevak | 24896 Checkbox with Description (felipemenezes098); 666 Checkbox (originui) `user_originui/checkbox/with-a-label-and-a-description/preview.png?v=1` | native `.control-check` | nee | alleen opbouw van label en beschrijving overgenomen |
| Keuzerondje als kaart | 747 Radio Group card (originui) `user_originui/radio-group/card/preview.png?v=1`; 17933 Reshaped Radio (reshaped); 34719 Choicebox (halaska-studio) | native `RadioCard` | nee | `has-[:checked]` voor rand en tint |
| Bestand (`FileInput`) | **25108 File Upload Field (cnippet-dev)** `cnippet.dev/v-field-21/default/preview.1787168233005-fd95129e-a535-483d-af85-34f7a42aba91.png`; 2417 File Upload (ephraimduncan); 3180 File Uploader (itsankitverma); afgevallen 19201, 18031, 4355 | 25108 | **ja (1 van 3)** | De code bleek een gewone `<input type="file">` in Field-opmaak zonder extra pakketten. Overgenomen: label, hulptekst en foutregel. Eigen: vlak als `<label>` met stippelrand, `IconTile`, knoplook via `ctaButtonVariants`, bestandsnaam en grootte in nl-NL, verwijderknop, validatie van type en grootte via `onFileChange`. |
| Kaart | 25350 Icon Link Card (cnippet-dev) `cnippet.dev/v-card-14/default/preview.1787243179519-2718acf7-06b0-4da0-9095-4a2bc1272063.png`; 2070 Grid Feature Cards (efferd); 28299 Icon Feature Grid (felipemenezes098) | shadcn `card`, aangepast; 25350 als referentie | nee | varianten default, muted, tint, interactive; geen schaduw in rust |
| Icoontegel | geen eigen kandidaat (patroon uit 25350 en 28299) | eigen primitive | nee | lijndikte 2 (niet 1,5 zoals voorgesteld) |
| Accordion | 29230 Ghost Accordion (arihantcodes_1f7b8c4d) `user_2xmIUPynCyYHPXZPBwS1EDV1Aq8/accordion-ghost/default/preview.1790098201798.png`; 1605 Accordion Plus Minus (designali-in); 24907 Accordion with Plus/Minus Indicators (cnippet-dev) | native `<details>`, ritme naar 29230 | nee | plus draait 45 graden, `::details-content`-animatie |
| Sheet | 25002 Sheet (Different Directions) (shadcnspace) `user_38qAOtph5HovpSn2yjNYXjbTOm2/sheet-01/default/preview.1787762812125.webp`; 25010 Sheet with Scrollable Content (shadcnspace); 24837 Drawer (Base UI); afgevallen 31360 (vaul) | eigen op base-ui `Dialog` | nee | rechts en onder, sticky footer, 200 ms |
| Tabs | 11638 Tabs underline (coss.com) `coss.com/tabs/underline/preview.1774357976645.png`; 24956 Underline Tabs (cnippet-dev); 1252 Simple Tabs (k3menn) | eigen op base-ui `Tabs` | nee | underline en segmented |
| Kruimelpad | 440 Breadcrumb (originui) `user_originui/breadcrumb/with-slash/preview.1786744594052.png`; 5891 Breadcrumb (SubframeApp); 27361 primitive-breadcrumb (isaiahbjork) | eigen, naar shadcn | nee | `ChevronRight` in `text-brand-subtle` |
| Paginering | 25116 Numberless Pagination with Text (shadcnui-blocks) `shadcnui-blocks/pagination-12/...`; 27693 Default Pagination (shadcnui-blocks); 1581 Pagination (shadcn) `user_shadcn/pagination/separate/preview.png?v=1`; 25103 Numberless Pagination | eigen, markup naar 1581, mobiel naar 25116 | nee | onder 640 px vorige, status, volgende |
| Header (uiterlijk) | 21220 Centered Nav Header (olewandowski1) `7ovr/centered-nav-header/default/preview.1784732440036-897e2fca-d619-4f29-ba12-df758b1a4ee8.png`; 26888 Classic Header with Sheet Menu (ln-dev7); 841 Header (tommyjepsen) | geen; spec 02 §4.13 | nee | wit, 64 px, rand na scrollen, geen blur |
| Footer (uiterlijk) | 21474 Agency Footer (shadcnspace) `shadcnspace/footer-01/default/preview.1784818505149-ed0e668f-bd79-4049-afa0-9f56f7faeba1.png`; 28291 Footer with Navigation Grid (shadcnui-blocks); 7264 Minimal Footer (efferd) | geen; spec 02 §4.13 | nee | ijs-achtergrond, kolomkoppen zonder hoofdletters, links 44 px op mobiel |
| Tabel | 22174 Card Table (felipemenezes098) `user_felipemenezes098/table-08/default/preview.1788375888337.png`; 22189 Team Members Table (cnippet-dev); 22188 Card Frame Table (cnippet-dev) | shadcn `table`, aangepast | nee | omkaderd, kop op `bg-muted`, horizontaal scrollen |
| Toast | 24297 Toast (cnippet-dev, Base UI) `user_36Tbt0v8JdD4jEycmBFhR8tojnR/toast/default/preview.1786656804488.webp`; 27363 Sonner Toast (isaiahbjork); 19941 Sonner Toast (bundui) | eigen op base-ui `Toast` | nee | geen sonner; wit kaartje, statusicoon, 5 s |
| Skeleton | geen zoektocht nodig | shadcn `skeleton` | nee | `rounded-lg bg-muted` |
| Alert | 11329 Alert (coss.com) `coss.com/alert/success/preview.1774275779058.png`; 3587 Alert (sean0205); 29300 Icon Alert (sean0205); 334 Alert (serafimcloud) | eigen, naar shadcn | nee | vijf tonen op tokens; de aanroeper zet de rol |

## Spec 09

Uitgevoerd op 2 oktober 2026 door sub-agent legal-layout (spec 09 §9): tien
`search`-aanroepen en drie `get_inspiration`-aanroepen. `get_inspiration` gaf
weer vooral ruis (bookmarks); relevant waren alleen 18113 en 22596 (desktop),
851 en 14029 (mobiel) en 11651, 19791 en 18307 (tabel). Geen `get_component`:
geen kandidaat was beter dan de eigen opzet uit spec 09 §4.3.

Previewbasis: `https://cdn.21st.dev/` plus het pad.

| Plek | Kandidaten (id, naam, auteur, preview) | Keuze | get_component | Aanpassing |
|---|---|---|---|---|
| Inhoudsopgave desktop (sticky, actief artikel) | 18113 Table of Contents (mohammadshehadeh) `hirael/toc/default/preview.1784488118775-d628fbab-89b8-465c-9b1e-fe98616e5e2c.png`; 34516 Table of Contents (appica-dev) `user_registry_appica-dev_1790790016927/toc/default/preview.1790808454423.webp`; 18123 Table of Contents (inference-sh) `inference-sh/table-of-contents/default/preview.1784718030348-03461537-ce39-4fc3-bf13-9623dd5e947b.png`; 23065 ReUI Scrollspy (sean0205) `larsen66/reui-scrollspy/variant-2/preview.1785348454728-85f10233-3e13-4e8c-99a4-09f279b397bd.png`; afgevallen 22596, 31745, 23554, 21517, 29334, 19371 | eigen `LegalToc`, 18113 als visuele referentie | nee | 18113 komt het dichtst bij (scroll-spy met linkerrail), maar markeert met een bewegende indicator; dat botst met de rustige beweging en voegt niets toe aan de toegankelijkheid. 18123 scrollt de lijst zelf en 34516 is een algemene scroll-spy; geen van drieën toont zeker ankerlinks zonder JavaScript en `aria-current`. Eigen opzet: `<nav><ol>` met ankers, IntersectionObserver (`-112px 0px -60% 0px`), `aria-current="location"`, actieve link `text-foreground font-medium` met `border-brand` links, alleen `motion-safe:transition-colors`; bij een laag scherm scrollt alleen het blok (`max-h`) |
| Inhoudsopgave mobiel (inklapbaar) | 19705/19706 Collapsible (cnippet-dev, Base UI) `user_36Tbt0v8JdD4jEycmBFhR8tojnR/cnippet-collapsible/team/preview.1787334321385.png`; 31385 Collapsible (wensity) `wensity/collapsible/default/preview.1790298260182-1d15cf9e-9eb7-4a33-85ca-07be6b28fb83.png`; 847 Collapsible (shadcn) `user_shadcn/collapsible/default/preview.1786653073791.png`; 851 Disclosure (ibelick) `user_motion_primitives/disclosure/851/preview.png`; afgevallen 14029, 25011, 15168, 25016, 973 | native `<details>` met `LegalToc variant="inline"` | nee | Alle kandidaten zijn JavaScript-primitives met hoogte-animatie; bij 19705 was niet vast te stellen welke Base UI-versie hij importeert. `<details>` werkt zonder JavaScript en geeft toetsenbord- en schermlezergedrag gratis. Van 31385 en 847 alleen de vorm: volle summary-rij met label en chevron die onder `motion-safe:` draait, dunne rand, geen schaduw |
| Tabelblok (cookies, bewaartermijnen) | 87/86/89 Table (originui) `user_originui/table/table-without-horizontal-dividers/preview.png?v=1`; 22164 Invoice Table (felipemenezes098) `felipemenezes098/table-01/default/preview.1785127541946-d91599e8-fb10-4510-b02f-bd092e715171.png`; 22165 Striped Table (felipemenezes098) `felipemenezes098/table-04/default/preview.1785127716683-a3d4b9be-653c-4cb2-ab4a-d2c557bca23b.png`; 19789/19791 Table (cnippet-dev) `user_36Tbt0v8JdD4jEycmBFhR8tojnR/cnippet-table/users/preview.1785864850736.png`; afgevallen 1050, 22167, 25153, 10378, 29311, 7460, 7457, 7476, 4782 | eigen `LegalTable` (gewone `<table>`) | nee | Statische leestekst vraagt alleen `<caption>`, `<th scope="col">` en een scrollbare wrapper met `role="region"`. Vorm naar originui 86/87 en het caption-patroon van 22164: kop op `bg-muted`, rijlijnen in `border-border`, ruime cellen, geen hover, zebra of schaduw. Twee kolommen passen op 390 px; vanaf drie kolommen scrollt alleen de tabel |
