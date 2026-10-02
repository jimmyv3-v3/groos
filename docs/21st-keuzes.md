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

## Spec 07

Uitgevoerd op 2 oktober 2026. Plek A en B door twee sub-agents (search en
get_inspiration); plek C, E en F door de bouw-agent zelf, omdat het maximum
aan gelijktijdige sub-agents bereikt was. `get_inspiration` gaf op alle vijf
plekken alleen ruis (kaart, workflowblok, raster, testimonials). Geen enkele
`get_component`-aanroep: elke gekozen richting is gebouwd op de bestaande
primitives van spec 02 (`Field`, `RadioCard`, `CheckboxField`, `FileInput`,
`Alert`, `CtaButton`), omdat de kandidaten react-aria, Base UI, Radix of
react-hook-form meebrachten of alleen losse voorbeeldvelden waren.

Previewbasis: `https://cdn.21st.dev/` plus het pad.

| Plek | Kandidaten (id, naam, auteur, preview) | Keuze | get_component | Aanpassing |
|---|---|---|---|---|
| A, formulierlayout en velden | 18215 Field (intentui) `intentui/field/default/preview.1784763783724-c7511438-b16c-41ba-a15e-b2d08960a004.png`; 11454 Field (coss.com, Base UI) `coss.com/field/with-error/preview.1774281231358.png`; 25083 Email Field with Error State (cnippet-dev) `cnippet.dev/v-label-15/default/preview.1787161819293-e1478252-21f7-47fe-95d8-aad2eed1df7b.png`; 2420 Form (ephraimduncan) `user_2vZexZytBe3Vo4fbfmzWgvCugbB/form/default/preview.1748455892661.png` | eigen veldcomponenten op `Field`; volgorde label, invoer, hint, fout naar 11454; fieldset en legend naar 18215 | nee | 18215 vraagt react-aria, 11454 Base UI en eigen validatie, 2420 react-hook-form. Eén kolom van 36rem, voor- en achternaam naast elkaar vanaf 640 px, `content-start` zodat invoervelden gelijk staan, "(niet verplicht)" in plaats van een sterretje, `ErrorSummary` als `Alert` bovenaan |
| B, keuzevelden | 28339 Radio Group in Card with Separators (sean0205) `sean0205/c-radio-group-8/default/preview.1789968749944-7bd46931-8046-44a4-96a6-5c8ddac332e2.png`; 28351 Icon Card Radio Group (sean0205) `sean0205/c-radio-group-11/default/preview.1789970436414-cd5c2144-a9e6-4fa5-9508-88315025a867.png`; 747 Radio Group card (originui) `user_originui/radio-group/card/preview.png?v=1`; 1708 Choicebox (shugar) `user_2uAqrF8oLIpxBVD9ZqYRYLfhKZ1/choicebox/default/preview.1742567225909.png` | native `RadioCard` en `CheckboxField` van spec 02, kaartvorm naar 28339, raster van 2 bij 2 naar 28351 | nee | Alle kandidaten waarschijnlijk Radix (`button role=radio`), dus zonder JavaScript onbruikbaar. Ja/nee in twee kolommen, onderwerp van contact 2 bij 2 vanaf 640 px, beroepen als kaarten met `has-[:checked]:bg-brand-tint` |
| C, bestandsupload | 27137 File Upload (uvain) `user_3AAcYdXInfTxs5akkUBbQIUQdhX/file-upload/default/preview.1789406886621.png`; 25108 File Upload Field (cnippet-dev) `cnippet.dev/v-field-21/default/preview.1787168233005-fd95129e-a535-483d-af85-34f7a42aba91.png`; 29444 File Upload Progress List (sean0205) `sean0205/c-progress-5/default/preview.1790079529036-25abb550-cbca-42d7-b2e4-ff034ab9244e.png`; 19201 File Dropzone (joyco) `joyco/file-dropzone/default/preview.1783712252441.png` | dunne voortgangsbalk met percentage onder de bestandsregel naar 29444, rond de bestaande `FileInput` (25108, spec 02) | nee (spec) | native `<progress>` in `bg-brand`, `motion-reduce:transition-none`, voortgang voor schermlezers in stappen van 25 procent via `aria-live`, fouten via `FieldError` |
| E, succesmelding | 23623 Success Alert (cnippet-dev) `user_36Tbt0v8JdD4jEycmBFhR8tojnR/v-alert-5/default/preview.1788363461574.png`; 334 Alert (serafimcloud) `user_2nElBLvklOKlAURm6W1PTu6yYFh/alert/success-alert/preview.png?v=1`; 29300 Icon Alert (sean0205) `sean0205/icon-alert/default/preview.1790062428178-f29a3df0-34e6-4c7a-b90a-b943010d2327.png`; 26911 Centered Contact Form (ln-dev7) | kopblok van de bedankpagina naar 23623 (icoon, titel, tekst), `FormAlert` op de `Alert` van spec 02 | nee | `CircleCheck` in een ronde `bg-brand-tint`, geen animatie of confetti; referentie vet en `tabular-nums`; bel- en WhatsApp-knoppen onder de foutmelding |
| F, contactkaarten | 5689 Contact Card (efferd) `sshahaider/contact-card/default/preview.1755584847121.png`; 28619 Team Member Cards (olewandowski1) `7ovr/team-1/default/preview.1789992680141-6fcb7a8f-2722-4bed-82a5-708a6ffdfb96.png`; 27904 Centered Contact Form (ln-dev7) `ln-dev7/contact-01/default/preview.1789819769701-36011358-a4c4-4a59-9010-76215de9d861.png`; 25224 Contact 01 (shadcnspace) | `ContactPersonCard` naar 28619 zonder foto en sociale knoppen; gegevensblok en `ContactAside` naar 5689 | nee | cirkel met beginletter in `bg-brand-tint`, nummer als `tel:`-link, knoppen via `TrackedContactLink`; gegevens als `<dl>` met icoontegels; aside op `bg-ice` |
