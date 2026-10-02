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

## Spec 04

Bouwstap 4, homepage en `/over-ons`. Eén scout-sub-agent deed voor alle acht
plekken van §9.2 tot en met §9.9 de zoekopdrachten (`search`, type component,
limit 10) en `get_inspiration`. `get_inspiration` gaf alleen ongerelateerde
bladwijzers. Geen enkele kandidaat was zonder uitgesloten onderdelen (foto's,
eyebrows, framer-motion, clientstate, gloed), dus alle plekken zijn gebouwd op
`Card`, `IconTile`, `CtaButton`, `Accordion`, `SectionHeading` en het recept
van de blauwe afsluiter. Er is in deze stap **geen** `get_component` gedaan
(0 van 2): ook voor de hero en het vragenblok was de code vooral beeld- en
clientlogica die eruit zou moeten.

Previewbasis: `https://cdn.21st.dev/` plus het pad.

| Plek | Kandidaten (id, naam, auteur, preview) | Keuze | get_component | Aanpassing |
|---|---|---|---|---|
| SA-04-A Hero (`HomeHero`) | **19078** Split Hero With Image Cards (felipemenezes098) `felipemenezes098/hero-08/default/preview.1783679118535.png`; 1122 Hero with text and two button (tommyjepsen) `user_tommyjepsen/hero-with-text-and-two-button/default/preview.png`; 612 Hero 45 (shadcnblockscom); 18890 Feature Hero (uilayout.contact) `uilayout.contact/feature-hero/default/preview.1783645224682.png` | 19078 als opzet (kop, twee gelijke kaarten), belknop naar 1122 | nee | geen foto's, avatars of cijferclaim; deuren als `bg-brand-tint pattern-oo`, beroepen als `CtaButton secondary sm`, belknop secundair met `Phone`; op 390 px compacter (pt-4, mt-5) en een rij zonder schuifbalk om binnen 844 px te blijven |
| SA-04-B Vacatures (`HomeVacancies`) | 8862 Cards Grid (kavikatiyar) `kavikatiyar/cards-grid/default/preview.1760425786559.png`; 8725 Job Listing (educalvolpz) `larsen66/job-listing/default/preview.1760167097573.png`; 8461 Card Grid (ravikatiyar162) | 8862 alleen als referentie voor de kaartdichtheid | nee | de kaart is van spec 06; omlijsting op `bg-ice` met kop links en link naar alles eronder |
| SA-04-C Beroepen (`HomeBeroepen`) | **28163** Features Grid (shadcnui-blocks) `shadcnui-blocks/features-01/...`; 18890 Feature Hero (3 + 2 indeling); 2070 Grid Feature Cards (efferd) `user_2tWTE0rCrloVAVylFPYfp10xU92/grid-feature-cards/default/preview.1789739376715.png`; 28299 Icon Feature Grid (felipemenezes098) | 28163 voor de kaart, 3 + 2 via `lg:grid-cols-6` | nee | twee tekstlinks per kaart met `ArrowRight`, `min-h-11`; geen patroon in de kaart |
| SA-04-D Stappen (`HowItWorks`) | **26891** How It Works Steps (ln-dev7) `ln-dev7/how-it-works-09/...`; 19863 How It Works Timeline (olewandowski1); 26902 Vertical How It Works Timeline (ln-dev7); 28381 Process Timeline (shadcnui-blocks) | typografie van 26891 in de verticale opbouw van 19863 | nee | geen kicker en geen verbindingslijn; cijfer `text-h1 text-brand-subtle aria-hidden`, `<ol>` voor de nummering, één secundaire knop per spoor |
| SA-04-E Personen (`HomePeople`, `AboutPeople`) | **28542** Team Section (efferd) `user_2tWTE0rCrloVAVylFPYfp10xU92/team-2/default/preview.1789986437032.png`; 17430 Reshaped Avatar (reshaped) `larsen66/reshaped-avatar/initials/preview.1783346696619.png`; 34164 Avatar (appica-dev); 28619 Team Member Cards (olewandowski1) | rustige opzet van 28542 met de initiaal van 17430 | nee | de kaart is `ContactPersonCard` van spec 07 (hier als stub); raster `sm:grid-cols-2 lg:max-w-4xl` |
| SA-04-F Vragen (`HomeFaq`) | **26656** FAQ Two Column (mohammadshehadeh) `user_registry_hirael_1783483345472/faq-05/default/preview.1788855440271.webp`; 29953 FAQ Tabs Card (arihantcodes_1f7b8c4d) `arihantcodes_1f7b8c4d/faq-tabs-card/...`; 24859 Categorized FAQ (educalvolpz); 28210 Categorized FAQ (diarmuradi); 27097 afgevallen (kolom per categorie) | opzet van 26656 (kop links, vragen rechts) met de wissel van 29953 | nee | wissel als twee native keuzerondjes op `bg-muted`, gekozen label `bg-background shadow-xs`; zichtbaarheid met `group-has-[#faq-tab-werkgever:checked]/faq`; `Accordion` op `<details>` |
| SA-04-G Afsluiter (`CtaBand`) | **1414** Call to action (tommyjepsen) `user_tommyjepsen/call-to-action/default/preview.1786552329192.png`; 28155 CTA Section (shadcndesign); 18475 Call to Action (felipemenezes098) `felipemenezes098/cta-01/default/preview.1783582022910.png` | opbouw van 1414 met het blauwe vlak van 28155 | nee | `.surface-brand pattern-oo rounded-2xl`, nummer als onderstreepte link in de zin, geen badge |
| SA-04-H Over ons (`AboutStory`, `AboutArea`, `AboutApproach`) | 28310 Split Content Section (felipemenezes098); 6289 About Section (uilayout.contact); 2202 About 3 (shadcnblockscom); 6906 About (prebuiltui); aanvullend 5689 Contact Card (efferd) | 28310 voor kop en tekst naast elkaar, 5689 voor het adresblok, 28163 voor de vier kaarten | nee | geen beelden, logo's of cijfers; adres als `Card variant="tint"` met `<address>` uit `lib/site.ts` |
