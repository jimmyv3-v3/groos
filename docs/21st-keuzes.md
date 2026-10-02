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

## Spec 08

Uitgevoerd op 2 oktober 2026 door vijf sub-agents (SA-08-1 tot en met 5,
spec 08 §9). Zij zochten met `mcp__magic__search` (type component, limit 8)
en `mcp__magic__get_inspiration`, en riepen `get_component` niet aan. De
inspiratievraag gaf bij alle vijf vooral ruis (Map, N8N Workflow Block,
Testimonials). De bouw-agent haalde daarna precies twee keer code op, elk
voor een andere plek. Alle andere plekken zijn eigen primitives op spec 02
en Base UI, omdat de kandidaten inklappen, motion, Radix, input-otp,
TanStack Table of een donker thema meebrachten.

Previewbasis: `https://cdn.21st.dev/` plus het pad.

| Plek | Kandidaten (id, naam, auteur, preview) | Keuze | get_component | Aanpassing |
|---|---|---|---|---|
| Sidebar (`SidebarNav`) | 31454 Sidebar (wensity) `wensity/sidebar/default/preview.1790303578745-d63aca4c-6635-4c7d-b8e4-4fa0a2538765.jpg`; 29334 Animated Sidebar (starc007); 28489 Sidebar with Search and Profile (uiable); 19361 Sidebar Light (inference-sh) | eigen primitives | nee | 31454 en 29334 klappen in en animeren; 28489 heeft zoekveld en promokaart. Vast 16rem, `aria-current`, teller met sr-only tekst, naam, Bekijk website en uitloggen onderin |
| Topbalk (`TopBar`) | 14820 WhatsaaS App Shell (jasonmohab-ali); 248 go-back-button (originui); 1697 Back Button (ozantekin) | eigen primitives | nee | 56 px, woordmerk met "Beheer", terugknop 44 px alleen onder lg (client `BackButton` bepaalt het bovenliggende pad) |
| Tabbalk (`MobileTabBar`) | 27897 Mobile Navigation Tabs (shadcnui-blocks) `user_registry_shadcnui-blocks_1783488755809/tabs-08/default/preview.1789998798545.png`; 10458 Bottom Menu (0xUrvish); 8343 Bottom Nav Bar (arunachalam) | eigen primitives | nee | 27897 is een tabs-widget, 10458 en 8343 gebruiken framer-motion en tonen niet altijd het label. Vijf links, icoon plus label, 64 px plus safe area, verborgen bij `[data-actiebalk]` |
| Meer (`/beheer/meer`) | 24986 Icon with Title Tabs (felipemenezes098); 28366 Settings Sidebar Layout (felipemenezes098) | eigen primitives (`MoreList`) | nee | rijen van 56 px met icoon, teller en chevron; Overal uitloggen via `ConfirmDialog` |
| Tabel (`ResponsiveList`, vanaf lg) | 28327 Data Table (ephraimduncan) `ephraimduncan/table-05/default/preview.1789963457631-6486542d-c830-47c5-9486-a598097dfc25.png`; 22162 Table with Filters (felipemenezes098) `felipemenezes098/table-12/default/preview.1785127196391-7f3872fb-bffb-40da-bd37-3b3d534a3dff.png`; 22189 Team Members Table (cnippet-dev); 19767 Table card (cnippet-dev) | eigen op `Table` van spec 02, opmaak naar 22162 | nee | geen TanStack; kop op `bg-muted`, dunne rijlijnen, caption sr-only, eerste cel linkt naar het detail |
| Kaarten op mobiel | geen bruikbare kandidaat (5737, 8862 zijn presentatiekaarten, 8862 met framer-motion) | eigen primitives | nee | `<ul>` met kaarten, h3 met stretched link, acties met `relative z-10` |
| Toolbar (`ListToolbar`) | 22162 (opmaak); 7466 Flexi Filter Table (ruixen.ui); 8103 Data Table Filter (uniquesonu, cmdk); 27325 Advanced Filter Builder | eigen primitives | nee | GET-formulier met `role="search"`; filters naast het zoekveld vanaf lg, onder lg in een `Sheet`; zonder JavaScript werkt Zoeken |
| Statustabbladen (`StatusTabs`) | 29425 Tabs with Count Badge (coss.com) `user_cosscom/tabs-count-badge/default/preview.1790091610035.webp`; 24959 Tabs with Count Badges (felipemenezes098) `user_felipemenezes098/tabs-07/default/preview.1787140972943.webp`; 26923 Segmented Tabs (micka_design) | eigen, opmaak naar 24959 | nee | links met `aria-current` in plaats van tabs-rol, teller als pil, 44 px hoog, horizontaal scrollbaar |
| Paginering en lege staat | 28327 (opmaak paginering) | eigen primitives | nee | `BeheerPagination` met `next/link`; `EmptyState` als gestippeld kader zonder illustratie |
| Formulierblokken (`FormBlock`) | 4347 Form Layout (ephraimduncan) `larsen66/form-layout/form-sections-with-checkbox-settings/preview.1753207332517.png`; 4348 Form sections with side labels; 28366 Settings Sidebar Layout; 28358 Settings Tabbed Sections | 4347 als layoutreferentie | nee | `<fieldset>` met legend die een h2 bevat, blokken onder elkaar (geen tabs), inhoudsopgave rechts vanaf lg |
| Lijstveld (`ListField`) | 7766 Interactive List (ravikatiyar162); 29175 Drag Item (ai2); 123 Input with end add-on (originui); 29793 Switch List Card (sean0205) | eigen primitives | nee | inputs met dezelfde name, verwijderen 44 px, focus naar nieuwe of vorige regel, hoogstens 10 |
| Knoppenbalk formulier | 10233 Button Save; 1632 Save Button | eigen primitives | nee | onder lg vast onderin met `data-actiebalk` en safe area, vanaf lg sticky |
| Bevestigingsdialoog (`AlertDialog`, `ConfirmDialog`) | **26651 Base Alert Dialog (soralabs)** `user_registry_soralabs_1783519534815/base-alert-dialog/default/preview.1788855607957.webp`; 702 Alert Dialog (shadcn, Radix); 1631 Unsave Popup (KarrixLee) | 26651 | **ja** | opbouw van kop, beschrijving en voetbalk overgenomen; motion, 3D, blur en het Radix-Slot-knopje weg; base-ui uit het bestaande pakket; knoppen via `CtaButton`; 150 ms opacity met `motion-reduce` |
| Publicatiechecklist | 29338 Destructive Alert with Action List (sean0205) | eigen op `Alert` van spec 02 | nee | toon warning in plaats van danger, elk item linkt naar het veld |
| Tegel (`StatTile`) | 4237 Statistics Card 2 (sean0205) `sean0205/statistics-card-2/default/preview.1753104706690.png`; 4245 Statistics Card 10 (sean0205); 4403 Stats cards with links (ephraimduncan, recharts) | eigen primitives | nee | geen trend of grafiek; hele tegel is een link, accentstreep per toon |
| Tijdlijn (`ActivityFeed`) | **29394 Activity Feed (felipemenezes098)** `felipemenezes098/item-19/default/preview.1790072854725-2c9f1800-eac0-48d4-b0c6-11fb285f0a8a.png`; 28340 Activity Timeline (olewandowski1); 28295 Timeline (cubby-ui); 28482 Recent Activity Card | 29394 | **ja** | rijopbouw (icoontegel, titel, toelichting, tijd) overgenomen; `<ol>` en `<time dateTime>`, lucide-iconen, tokens, geen Radix-`Item` of `Separator` |
| Actiebalk (`DetailActionBar`) | 8343 Bottom Nav Bar; 10458 Bottom Menu; 26780 Expandable Action Bar; 2694 Dynamic Action | eigen primitives | nee | vier cellen (Bellen, WhatsApp, E-mailen, Status), 64 px plus safe area |
| Gegevenslijst (`DefinitionList`) | 25162 Key Value List (corr) `corr/key-value-list/default/preview.1787189617848-bb669db1-507e-4735-98b1-cb353d268401.png` | eigen, opmaak naar 25162 | nee | `<dl>`, op mobiel term boven waarde |
| Vandaag te doen (`TodoList`) | 27738 Task List Card (tailwind-admin) | eigen primitives | nee | geen checkboxes of avatars; elke regel is een link, verlengknop waar nodig |
| Inloggen (`AuthCard`, `LoginForm`) | 21494 Login with Email and Password (ephraimduncan) `ephraimduncan/login-03/default/preview.1784787523413-7054b4a2-ae6b-40a0-861e-f0ae301d5930.png`; 28353 Login Card (mohammadshehadeh); 25290 Login Form Card (felipemenezes098) | 21494 als layoutreferentie | nee | wit, smal, gecentreerd; geen social-knoppen of onthoud-mij; wachtwoord tonen met `aria-pressed` |
| Codeveld (`OtpField`) | 28138 OTP Verification Card (sean0205); 28263 OTP Input Field (sean0205); 29287 OTP field (coss.com); 29246 Two-Factor Authentication Card (diarmuradi) | eigen primitives | nee | één veld met `one-time-code`, `inputMode="numeric"`, plakken toegestaan; vakjeslook alleen via letterafstand en monospace |
| Koppelen met QR (`MfaEnroll`) | 5751 Enable 2FA Card (ahmedmayara) `ahmedmayara/enable-2fa-card/default/preview.1755731021760.png`; 29246 Two-Factor Authentication Card (diarmuradi) | 5751 als layout, sleutelveld naar 29246 | nee | genummerde `<ol>`, QR via `next/image` met `unoptimized`, sleutel in groepen van vier met kopieerknop en `aria-live` |
| Wachtwoord (`PasswordResetForm`, `PasswordSetForm`) | 29241 New Password Form (diarmuradi) `diarmuradi/new-password-2/default/preview.1790055859735-5f70af03-ac9f-415e-bcc9-f89edf9f70ea.png`; 28480 Reset Password Card (diarmuradi); 25092 Reset Password Email Link (felipemenezes098) | eigen, 29241 als referentie | nee | vlakke primaire knop, `new-password`, hint met minimaal 12 tekens |
