# Technische inventaris groos-personeelsdiensten (stand 2 oktober 2026)

Repo: `/Users/djulangem/Developer/groos-personeelsdiensten`. Next.js 16.3 App Router, React 19, next-intl 4, Tailwind 3.4, shadcn-stijl. Alle bedrijfstekst staat op TODO (`npm run check --warn`: 24 punten, 491 placeholder-regels). Legenda: † = sleutel of waarde is nu TODO; S = server component, C = `"use client"`.

## 1. Routes

| Bestand | Pad | generateMetadata | JSON-LD | Leest |
|---|---|---|---|---|
| `app/[locale]/layout.tsx` | wrapper | `metadataBase=SITE_URL`, `title.default=meta.titleDefault`, `title.template=meta.titleTemplate`, `description=meta.description`, robots index/follow, `applicationName=contact.shortName`; `viewport.themeColor=brand.colors.background`; `generateStaticParams` per locale | `Organization` (`organizationLd`), `WebSite` (`websiteLd`) | messages `meta`, `lib/site.contact`, `lib/brand`; font Inter → `--font-sans`; `<Analytics/>` |
| `app/[locale]/page.tsx` | `/`, `/en` | `pageMetadata({path:"/", title:meta.titleDefault, description:meta.description, keywords:meta.keywords, absoluteTitle:true})` | `LocalBusiness` (type uit `site.schemaType`) + `FAQPage` uit `home.faq.items` | messages `home`, `meta`; stapelt alle secties (§2) |
| `app/[locale]/diensten/[slug]/page.tsx` | `/diensten/<slug>` | `dynamicParams=false`; params uit `services`; `pageMetadata(copy.title, copy.metaDescription)` | `Service` (`serviceLd`), `BreadcrumbList` (Home › Diensten `/#diensten` › titel), `FAQPage` (`copy.faqs`) | `content/services` (index + `getServicePage`), messages `common.nav` |
| `app/[locale]/werkgebied/page.tsx` | `/werkgebied` | `pageMetadata(werkgebied.overview.metaTitle, .metaDescription)` | `BreadcrumbList` (Home › Werkgebied) | `cities`, `getCity`; messages `werkgebied.*`, `common.nav`, `service.breadcrumbAria` |
| `app/[locale]/werkgebied/[stad]/page.tsx` | `/werkgebied/<slug>` | `dynamicParams=false`; params uit `cities`; `pageMetadata(city.metaTitle, city.metaDescription, city.keywords)` | via `CityPage`: `LocalBusiness` met `areaServed:{@type:City}`, `BreadcrumbList`, `FAQPage` | `content/werkgebied` |
| `app/[locale]/privacybeleid/page.tsx` | `/privacybeleid` | `pageMetadata` uit `CONTENT[locale]` | geen | `CONTENT={nl,en}` in de page (15 artikelen, `updatedAt`†), `contact` |
| `app/[locale]/algemene-voorwaarden/page.tsx` | `/algemene-voorwaarden` | idem | geen | 13 artikelkoppen, alle teksten † ; `articlePrefix` "Artikel "/"Article " |
| `app/sitemap.ts` | `/sitemap.xml` | n.v.t. | n.v.t. | `STATIC_PATHS=["/","/werkgebied","/privacybeleid","/algemene-voorwaarden"]` + `services` + `cities`; per locale één entry met `alternates.languages` (+ `x-default`); priority 1 / 0.8 diensten / 0.7 werkgebied / 0.4; `changeFrequency` weekly voor "/", anders monthly |
| `app/robots.ts` | `/robots.txt` | | | allow `/`, sitemap, host |
| `app/llms.txt/route.ts` | `/llms.txt` | `force-static` | | `nl.json` (`meta.description`, `services.<slug>.title/summary`), `services`, `cities`, `contact` |
| `app/icon.tsx`, `app/apple-icon.tsx` | 64×64 / 180×180 PNG | | | `brand.initials`, `brand.colors` † |
| `app/opengraph-image.tsx`, `app/twitter-image.tsx` | 1200×630 | | | `meta.ogHeadline`†, `meta.ogSubline`†, `brand.colors`, `contact.shortName` |

Niet aanwezig: `not-found.tsx`, `error.tsx`, `loading.tsx`, `manifest`, `app/api/*`, route handlers behalve llms.txt. `next.config.mjs`: `reactStrictMode`, `turbopack.root`, `images.formats avif/webp`, `optimizePackageImports:["lucide-react"]`, `redirects()` leeg.

## 2. Componenten

### components/sections

| Export (bestand) | S/C | Props | Messages | Registers / data | ID of anker |
|---|---|---|---|---|---|
| `SiteHeader` (site-header) | C | geen | `header.*`, `common.nav.*`, `common.cta.requestQuote/callUs/quote`, `services.<slug>.title/summary` | `nav`, `contact`, `services` | links `/#top`, `/#contact`; mobiel menu `id="mobile-menu"`; vaste balk onderin (bel + WhatsApp) |
| `Hero` (hero) | C | geen | `home.hero.title` (rich `<accent>`), `home.hero.intro`, `home.values`, `common.cta.requestQuote/callDirect` | `contact.phoneHref`; bevat `SegmentAccordion` (lg+) | `id="top"`; CTA naar `#contact` |
| `Clients` | S | geen | `home.clientsAriaLabel` | `clients` (null bij lege lijst) | geen |
| `SegmentAccordion` | C | geen | `home.segments.<id>.title/blurb` | `segments` | geen |
| `Metrics` | S | geen | `home.metricLabels[]`, `home.metricsAriaLabel` | `metrics` (CountUp) | geen |
| `TrustBar` | S | geen | `home.trustBar.ariaLabel`, `.items[]` | `usps` | geen |
| `ServiceTicker` | C | geen | `home.ticker.ariaLabel/lead/srSentence/words[]/viewAll` | geen | link `#diensten` |
| `Services` | C | geen | `home.servicesSection.*`, `services.<slug>.title/summary` | `services` | `id="diensten"`; kaarten met `.spotlight` |
| `Process` | S | geen | `home.process.title/accent/intro/steps[]` | `steps` | `id="werkwijze"` |
| `Projects` | S | geen | `home.projects.titleLead/titleAccent/intro/<altKey>` | `projectPhotos` | `id="projecten"` |
| `Proof` | S | geen | `home.proof.quote/author/role` | `Monogram` | `id="ervaring"` |
| `Assurance` | S | geen | `home.assurance.*` | `assurances`, `certification` | `id="kwaliteit"` |
| `About` | S | geen | `home.about.title` (rich), `p1`, `p2`, `location{city}` | `contact.city`, `Monogram` watermerk | `id="over-ons"` |
| `Faq` (**default export**) | S | geen | `home.faq.heading/headingAccent/items[]` | native `<details>` | geen id (`aria-labelledby="faq-heading"`) |
| `OfferteForm` | C | geen | `home.contactForm.*` | `contact`; `process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`; POST naar `api.web3forms.com/submit` | `id="contact"` |
| `SiteFooter` | S | geen | `footer.*`, `services.<slug>.title` | `contact`, `socials`, `services`, `cities`; links `/privacybeleid`, `/algemene-voorwaarden`, `/werkgebied` | geen |
| `SectionHeading` | S | `{title: string; accent?: string; intro?: ReactNode; align?: "left"\|"center"; className?: string}` | geen | geen | geen |

Formulier (`OfferteForm`): velden `naam*`, `bedrijf`, `email*`, `telefoon`, `plaats`, `opdrachtgever` (select uit `clientTypes`), `bericht`, `akkoord*`, honeypot `botcheck`; validatie client-side (regex e-mail), geen schema-library.

### components/service

| Export | S/C | Props | Messages | Anker |
|---|---|---|---|---|
| `ServiceHero` | S | `{breadcrumb: {label: string; href?: string}[]; title: string; lead: string; image?: string; imageAlt?: string}` | `service.breadcrumbAria`, `common.cta.requestQuote/callDirect`; `contact.phoneHref` | CTA `#offerte` |
| `ServiceCta` | S | `{title: string; subtitle?: string}` | `common.cta.*`, `service.ctaNote` | CTA `#offerte` |
| `ServiceFaq` | C | `{items: FaqItem[]; heading?: string}`, `FaqItem={q,a}` | `service.faqHeading` | `id="faq"` |
| `ServiceFeatureGrid` | S | `{id?: string; heading: string; accent?: string; intro?: string; features: {icon: LucideIcon; title: string; body: string}[]}` | geen | `id` prop |
| `ServiceSteps` | S | `{id?: string; heading: string; accent?: string; intro?: string; steps: {title: string; description: string; icon?: LucideIcon}[]}` | geen | `id` prop |

### components/werkgebied, legal, brand, motion, seo

| Export | S/C | Props | Gebruikt |
|---|---|---|---|
| `CityPage` | S | `{city: CityView; locale: string}` | `werkgebied.city.{partnerIn,servicesIn,servicesIntro,moreAbout,whyIn,faqHeading,ctaTitle,ctaSubtitle,features.<local\|quality\|team\|partner>.title/body}`, `werkgebied.navLabel`, `common.nav.home`, `services.<slug>.title`; `services`; eigen `#offerte`-wrapper |
| `LegalPage` | S | `{title: string; intro: string; updatedAt: string; sections: LegalSection[]; articlePrefix?: string}`; `LegalBlock = string \| {list: string[]}`; `LegalSection = {heading: string; blocks: LegalBlock[]}` | `legal.updatedAt{date}`, `legal.contactQuestion`, `legal.contactCta`; CTA `/#contact`; `.hairline`, `.bg-grid` |
| `Monogram` | S | `{className?: string; idSuffix?: string; title?: string}` | SVG met `brand.initials`, `aria-label=contact.shortName` † |
| `Wordmark` | S | `{className?: string; idSuffix?: string; showDescriptor?: boolean}` | `Monogram` + `contact.shortName` + `brand.descriptor` † |
| `Reveal` | C | `{children; delay?=0; y?=22; scale?=0.97; className?; as?: "div"\|"section"\|"li"\|"span"\|"h2"\|"p"}` | framer-motion whileInView, once, margin -80px, reduced-motion → fade |
| `RevealGroup` | C | `{children; className?; stagger?=0.1; delayChildren?=0.05}` | stagger-container |
| `RevealItem` | C | `{children; className?; as?: "div"\|"li"\|"span"}` | kind van RevealGroup |
| `CountUp` | C | `{value: number; prefix?; suffix?; duration?=1.6; className?}` | telt op in view, `nl-NL`-notatie |
| `JsonLd` | S | `{data: Record<string,unknown> \| Record<string,unknown>[]}` | `<script type="application/ld+json">`, escapet `<` |

### components/ui

| Export | S/C | Props / opmerkingen |
|---|---|---|
| `CtaButton` | S | `{children; href?; onClick?; className?; size?: "sm"\|"default"\|"lg"; variant?: "primary"\|"secondary"; type?; disabled?; ariaLabel?}`. `href` met `/` → `Link` (i18n); anker/`tel:`/`mailto:` → `<a>`; anders `<button>`. Pilvorm (`rounded-full`). Enige merk-CTA. |
| `Button`, `buttonVariants` | S | shadcn/cva: `variant primary\|outline\|ghost\|link`, `size default\|sm\|lg\|icon`, `asChild`. **Nergens geïmporteerd.** |
| `LanguageToggle` | C | `{className?}`; `common.languageSwitcher.label`; zet cookie `NEXT_LOCALE` (1 jaar); verbergt zich bij één locale |
| `Marquee` | C | `{duration?=20; pauseOnHover?; direction?: left\|right\|up\|down; fade?=true; fadeAmount?=10}` + div-attributen; dupliceert kinderen |
| `MenuToggleIcon` | C | `{open?; className?; duration?=300}` |
| `NavigationMenu*` | C | base-ui wrappers: `NavigationMenu, List, Item, Trigger, Content, Link, Portal, Positioner, Popup, Viewport, navigationMenuTriggerStyle` |
| `useScroll(threshold=10)` | C | hook, true na scrollen |

## 3. Sleutelboom messages/nl.json (160 paden, 9 arrays, 208 tekstwaarden; en.json gespiegeld)

Notatie `a.{b,c}` = `a.b`, `a.c`. `[n]` = array met lengte n. Interpolaties tussen `{}`.

- `common.languageSwitcher.{label, nl, en}`
- `common.cta.{requestQuote, quote, callUs, callDirect}`
- `common.nav.{home, services, method, projects, about, contact}`
- `meta.{titleDefault†, titleTemplate† ("%s · …"), description†, keywords[3]†, ogHeadline†, ogSubline†}`
- `legal.{updatedAt{date}, contactQuestion, contactCta}`
- `service.{breadcrumbAria, faqHeading, ctaNote†}`
- `werkgebied.navLabel`
- `werkgebied.overview.{metaTitle, metaDescription†, titleLead†, titleAccent†, intro†, viewCity{city}, notListed†, cta}`
- `werkgebied.city.{partnerIn, servicesIn, servicesIntro†, moreAbout, whyIn†, faqHeading{city}, ctaTitle{city}†, ctaSubtitle†}`
- `werkgebied.city.features.{local, quality, team, partner}.{title, body}` (alleen `local.title` en `partner.title` zijn af; `body` gebruikt `{city}`)
- `header.{mainMenu, openMenu, closeMenu, mobileMenu, quickContact, callAria{phone}, whatsappAria}`
- `footer.{description†, responsePromise†, allAreas, rights{year,name}, privacy, terms}`, `footer.columns.{services, workArea, contact}`
- `services.{dienst-een, dienst-twee, dienst-drie, dienst-vier}.{title†, summary†}`
- `home.hero.{title† (rich <accent>), intro†}`
- `home.values[4]†` (strings), `home.metricLabels[3]†` (strings)
- `home.trustBar.{ariaLabel, items[4]†}` items = `{title, body}`
- `home.segments.{ariaLabel, doelgroep-1, doelgroep-2, doelgroep-3, doelgroep-4}`; elke doelgroep `.{title†, blurb†}`
- `home.{metricsAriaLabel, clientsAriaLabel}`
- `home.ticker.{ariaLabel, lead†, srSentence{words}†, words[5]†, viewAll}`
- `home.servicesSection.{ariaLabel, title†, accent†, intro†, moreAbout}`
- `home.process.{title†, accent†, intro†, steps[4]†}` steps = `{title, body}`
- `home.projects.{titleLead†, titleAccent†, intro†, altDefault†}`
- `home.proof.{quote†, author†, role†}`
- `home.assurance.{certTitle†, certBody†, certAlt†, heading†, headingAccent†, intro†, items[4]†}` items = `{title, body}`
- `home.about.{title† (rich), p1†, p2†, location{city}†}`
- `home.faq.{heading, headingAccent, items[6]†}` items = `{q, a}`
- `home.contactForm.{heading† (rich), intro†, benefitResponse†, benefitFree, srResponseTime, srCosts, successTitle, successBody†, legend, optional, clientTypePlaceholder, clientTypes[3], submit, submitting, errorNotConfigured, errorGeneric}`
- `home.contactForm.labels.{name, company, email, phone, place, clientType, message, consent}`
- `home.contactForm.placeholders.{name, company, email, phone, place, message}`
- `home.contactForm.clientTypes[i] = {value, label}`: particulier, zakelijk, anders (niet TODO, wel JV-specifiek)
- `home.contactForm.errors.{name, emailRequired, emailInvalid, consent}`

Rich-tekst: alleen `home.hero.title`, `home.about.title`, `home.contactForm.heading` gebruiken `<accent>`; andere accentkoppen splitsen in `title`+`accent` of `heading`+`headingAccent`.

## 4. lib, i18n en proxy

### lib/site.ts

| Export | Type | Inhoud nu |
|---|---|---|
| `site` | `{url, logo, schemaType, areaServed: readonly string[]} as const` | `https://www.example.nl`†, `/brand/logo.png`†, `"LocalBusiness"`†, `["TODO Plaats","Nederland"]` |
| `contact` | `{name, shortName, phone, phoneHref, whatsapp, whatsappHref, email, emailHref, kvk, btw?: string, street?: string, postalCode?: string, city} as const` | alles †; `whatsappHref` = `wa.me/<E164>?text=…offerte…` |
| `Social`, `socials` | `{platform: "linkedin"\|"instagram"\|"facebook"; href}[]` | leeg |
| `nav` | `readonly {key, href}[]` | `services→/#diensten, method→/#werkwijze, projects→/#projecten, about→/#over-ons, contact→/#contact` (eerste entry = uitklapmenu) |
| `Metric`, `metrics` | `{value: number; prefix?; suffix?}[]` | `10+`, `100+`, `5` † |
| `usps` | `{icon: LucideIcon}[4]` | Award, ShieldCheck, Sparkles, MapPin |
| `Segment`, `segments` | `{id; icon; image?; focus?}[4]` | `doelgroep-1..4` † |
| `steps` | `{n: string; icon}[4]` | 01–04 |
| `assurances` | `{icon}[4]` | |
| `certification` | `{src?: string}` | leeg |
| `Client`, `clients` | `{name; src?}[5]` | † |
| `ProjectPhoto`, `projectPhotos` | `{src?; altKey}[8]` | alle `altDefault` |

### lib/seo.ts

| Functie | Signatuur | Doet |
|---|---|---|
| `SITE_URL` | `string` | `site.url` |
| `localizedPath(locale, path): string` | | nl → pad zelf, en → `/en<pad>` |
| `absoluteUrl(path): string` | | `SITE_URL + path` |
| `alternatesFor(locale, path): Metadata["alternates"]` | | canonical + `languages` {nl, en, x-default} |
| `pageMetadata({locale, path, title, description, keywords?, absoluteTitle?=false}): Metadata` | | title (`"<title> · shortName"` tenzij absolute), alternates, `openGraph` (type website, locale `nl_NL`/`en_US`, `images:[/opengraph-image 1200×630]`), `twitter summary_large_image` |
| `organizationLd(description)` | → `Record<string,unknown>` | Organization met `logo`, `sameAs`, `contactPoint` |
| `websiteLd(locale)` | | WebSite, `inLanguage` |
| `localBusinessLd({description, path, areaServed?})` | | `@type=site.schemaType`, address (`PostalAddress` NL), `identifier` KvK, `image` = OG |
| `serviceLd({name, serviceType, description, path})` | | Service met `provider` |
| `breadcrumbLd(items: {name, path}[])` | | BreadcrumbList (paden gelokaliseerd meegeven) |
| `faqLd(items: {q, a}[])` | | FAQPage |

### lib/brand.ts

`brand = { initials: "TB"†, descriptor: "TODO DESCRIPTOR B.V."†, colors: { background "#ffffff", foreground "#0a0a0a", muted "#737373", accent "#171717" } } as const`. Gebruikt door icons, OG, `themeColor`, Monogram, Wordmark. Moet gelijk blijven aan de CSS-tokens.

### i18n en proxy

| Bestand | Inhoud |
|---|---|
| `i18n/routing.ts` | `routing = defineRouting({locales:["nl","en"], defaultLocale:"nl", localePrefix:"as-needed", localeDetection:false})`; `type Locale`; `DEFAULT_LOCALE_COUNTRIES = ["NL","BE"]` |
| `i18n/navigation.ts` | `{Link, redirect, usePathname, useRouter, getPathname} = createNavigation(routing)` |
| `i18n/request.ts` | laadt `messages/<locale>.json`, valt terug op nl |
| `proxy.ts` | `config.matcher = ["/((?!api\|_next\|_vercel\|opengraph-image\|twitter-image\|icon\|apple-icon\|.*\\..*).*)"]`. Gedrag: (1) cookie `NEXT_LOCALE=en` op nl-pad → redirect naar `/en…`; (2) geen cookie, nl-pad, geen bot (UA-regex `bot\|crawl\|spider\|slurp\|facebookexternalhit\|whatsapp\|linkedin\|embedly\|preview\|lighthouse`) en `x-vercel-ip-country` buiten NL/BE → redirect naar `/en` + cookie 1 jaar; (3) anders next-intl middleware. Eentalig → alleen next-intl. |

## 5. Content-registers

### content/services

```ts
type ServiceCopy = {
  title; metaDescription; lead; imageAlt?;
  whatTitle; whatAccent; whatIntro; included: string[];
  extra?: { title; accent?; intro; items: string[] };
  steps?: { heading; accent?; intro?; items: { title; description }[] };
  urgencyTitle; urgencyAccent; urgencyIntro; stakes: { title; body }[];   // precies 3
  ctaTitle; ctaSubtitle;
  featureHeading; featureAccent; features: { title; body }[];           // precies 4
  faqs: { q; a }[]; jsonLdServiceType; jsonLdDescription;
};  // alle velden string tenzij anders vermeld
type ServicePage = { stakeIcons: LucideIcon[]; featureIcons: LucideIcon[]; stepIcons?: LucideIcon[]; image?: string; nl: ServiceCopy; en?: ServiceCopy };
type ServiceListItem = { slug: string; icon: LucideIcon };
```

- `index.ts`: `services: ServiceListItem[]` = `dienst-een` (Sparkles), `dienst-twee` (Wrench), `dienst-drie` (ShieldCheck), `dienst-vier` (CalendarClock). Client-veilig (geen tekst).
- `pages.ts`: `servicePages: Record<string, ServicePage>` en `getServicePage(slug, locale): {page, copy} | undefined`; `copy = (locale==="en" && page.en) || page.nl`. Alleen server-side importeren.
- `dienst-een.ts` is volledig uitgeschreven sjabloon (†); `dienst-twee/drie/vier.ts` gebruiken `placeholderService({nl, en})` uit `_placeholder.ts` (3 stakes, 4 features, 3 faqs). Geen `extra`, `steps`, `stepIcons` of `image` ingevuld.
- Dienst toevoegen = slug+icoon in `index.ts`, `services.<slug>.{title,summary}` in beide messages, `content/services/<slug>.ts`, registreren in `pages.ts`.

### content/werkgebied

```ts
type CityCopy = { name?; metaTitle; metaDescription; keywords: string[]; h1; lead; imageAlt; introBody: string[]; faq: { q; a }[] };
type City = { slug; name; province; image?; nl: CityCopy; en?: CityCopy };
type CityView = Omit<City,"nl"|"en"> & CityCopy & { name: string };
```

`index.ts`: `cities: City[] = [stadEen, stadTwee]`; `getCity(slug, locale): CityView | undefined` (zelfde en→nl-fallback, `name` uit copy of city). Stadsbestanden volledig †.

### Afgeleiden

`app/sitemap.ts` en `app/llms.txt/route.ts` importeren `services` en `cities` rechtstreeks; nieuwe routes buiten de registers moeten handmatig in `STATIC_PATHS` en in llms.txt. `SiteFooter`, `SiteHeader`, `Services`, `CityPage` lezen ook `services`; footer leest `cities`.

## 6. Design tokens en fonts

### CSS-variabelen (HSL-tripletten zonder `hsl()`)

| Token | `:root` | `.dark` |
|---|---|---|
| `--background` / `--foreground` | `0 0% 100%` / `0 0% 4%` | `0 0% 5%` / `0 0% 92%` |
| `--card` / `--card-foreground` | `0 0% 98%` / `0 0% 4%` | `0 0% 8%` / `0 0% 92%` |
| `--popover` / `--popover-foreground` | `0 0% 100%` / `0 0% 4%` | `0 0% 7%` / `0 0% 92%` |
| `--primary` / `--primary-foreground` | `0 0% 9%` / `0 0% 98%` | `0 0% 92%` / `0 0% 7%` |
| `--secondary` / `--secondary-foreground` | `0 0% 96%` / `0 0% 9%` | `0 0% 12%` / `0 0% 92%` |
| `--muted` / `--muted-foreground` | `0 0% 95%` / `0 0% 42%` | `0 0% 13%` / `0 0% 60%` |
| `--accent` / `--accent-foreground` | `0 0% 95%` / `0 0% 9%` | `0 0% 13%` / `0 0% 92%` |
| `--destructive` / `--destructive-foreground` | `0 72% 48%` / `0 0% 98%` | niet overschreven |
| `--border` / `--input` / `--ring` | `0 0% 89%` / `0 0% 85%` / `0 0% 25%` | `0 0% 17%` / `0 0% 20%` / `0 0% 70%` |
| `--radius` | `0.5rem` | niet overschreven |
| `--brand-subtle` / `--brand` / `--brand-strong` | `0 0% 55%` / `0 0% 25%` / `0 0% 4%` | `0 0% 50%` / `0 0% 75%` / `0 0% 96%` |
| `--font-display` | `var(--font-sans)` | |

`.dark` wordt nergens gezet (`darkMode: ["class"]`); de site is nu licht en volledig grijs.

### Signature-klassen (`@layer components` / `utilities`)

`.accent-text` (kleur `--brand`), `.glass-panel` (card 92 % + rand + blur 14px), `.logo-mono` (grayscale, opacity .6), `.hairline` (uitvloeiende lijn), `.blend-top` (mask), `.bg-grid` (56px-raster met radiale mask), `.spotlight::before` (radiale gloed op `--mx/--my`, zichtbaar bij hover), plus `::selection` en `prefers-reduced-motion` die alle animaties uitschakelt.

### tailwind.config.ts

`content` = app, components, lib. `container`: centered, padding 1.25rem (lg 2rem), `2xl: 1240px`. Kleuren: `border, input, ring, background, foreground, primary, secondary, muted, accent, destructive, card, popover` (elk `hsl(var(--x))`, met `.foreground`-variant) en `brand.{DEFAULT, subtle, strong}`. `borderRadius lg/md/sm` = `--radius` / −2px / −4px. `fontFamily.sans = var(--font-sans)`, `fontFamily.display = var(--font-display), var(--font-sans)`. `letterSpacing.brand = 0.22em`. Keyframes/animaties: `light-sweep`, `glow-pulse`, `shimmer`, `fade-up`, `marquee`. Geen plugins (geen `tailwindcss-animate`).

### Fonts

`app/[locale]/layout.tsx`: alleen `Inter` via `next/font/google` (`variable: "--font-sans"`, `display: swap`), op `<html className={sans.variable}>`, body `font-sans antialiased`. Geen display-font geladen (`--font-display` valt terug) †. `components.json`: style default, `baseColor neutral`, `cssVariables true`, `rsc true`, aliassen `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`, `@/lib/hooks`.

## 7. scripts/check-launch.mjs (`npm run check`, `-- --warn` = exit 0)

| # | Controle | Regel |
|---|---|---|
| 1 | Sleutelpariteit | Bouwt per `messages/*.json` een shape-map (pad → `leaf` of `array(n)`, recursief in arrays); elk verschil in aanwezigheid of soort tussen het eerste bestand en de andere is een probleem (arrays moeten dus dezelfde lengte hebben). |
| 2 | Registratie | Slugs via regex `slug: "…"` uit `content/services/index.ts`; elke slug moet als `"<slug>"` in `pages.ts` staan en `services.<slug>.title` in elke locale hebben; `services.*`-sleutels zonder dienst worden als notitie gemeld. |
| 3 | Placeholders | Scant `app, components, content, lib, messages, i18n, proxy.ts` (`.ts/.tsx/.json/.css`) per regel op `\bTODO\b`, `www.example.nl\|info@example.nl`, `00000000`, `\b(dienst\|stad)-(een\|twee\|drie\|vier)\b`; telt per bestand. |
| 4 | Bestanden | `public/brand/logo.png` verplicht; `.env.local` ontbrekend is een notitie. |

Exitcode 1 bij ≥1 probleem. Huidige stand: 24 punten.

## 8. Dependencies (geïnstalleerd)

| Pakket | Versie | Opmerking |
|---|---|---|
| next / eslint-config-next | 16.3.8 | App Router, Turbopack, `proxy.ts`; `next lint` bestaat niet |
| react / react-dom | 19.3.0 | |
| next-intl | 4.14.9 | `createNextIntlPlugin` in next.config |
| framer-motion | 12.43.0 | |
| lucide-react | **0.456.0, bewust vast** | nieuwere versies missen de social-iconen (Facebook, Instagram, Linkedin in footer) |
| tailwindcss / postcss / autoprefixer | 3.4.19 / 8.5.28 / 10.6.1 | Tailwind 3, geen v4 |
| typescript | 5.9.3 | strict, `@/*` → root |
| @base-ui-components/react | 1.0.0-rc.0 (exact gepind) | navigation-menu |
| @radix-ui/react-slot | 1.3.3 | alleen door ongebruikte `Button` |
| class-variance-authority / clsx / tailwind-merge | 0.7.1 / 2.1.1 / 2.6.1 | |
| @vercel/analytics | 2.0.1 | |
| eslint | 9.39.5 | flat config, negeert `context/**` |

`engines.node = 24.x` (lokaal v24.13.1). Scripts: `dev`, `build`, `start`, `lint` (`eslint .`), `typecheck`, `check`, `verify`. Env: alleen `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` (`.env.example`). Geen tests, geen CI, geen `.github`.

## 9. Wat ontbreekt voor Groos (nieuw te specificeren)

| Ontbreekt | Stand nu |
|---|---|
| Vacatures (`/vacatures`, `/vacatures/[slug]`, filters, JobPosting-JSON-LD) | geen route, geen type, geen builder in `lib/seo.ts` |
| Supabase of enige database/ORM/auth | nergens; geen `@supabase/*`, prisma, drizzle, next-auth |
| `/beheer` (admin), `noindex`-paden | geen route; `proxy.ts` sluit alleen `api`, `_next`, `_vercel`, metadata-routes en bestanden uit |
| Server actions, API-routes, `"use server"` | geen; enige netwerkactie is client-side fetch naar Web3Forms |
| zod of andere schema-validatie | geen; formulier valideert handmatig |
| Sollicitatieformulier, cv-upload, open sollicitatie, Storage | geen |
| Werkgevers/werkzoekenden-splitsing (twee doelgroepen, twee registers, je/u-vorm) | één register `content/services` vanuit opdrachtgeversperspectief |
| Routes `/werkgevers`, `/werkzoekenden`, `/personeel/[beroep]`, `/werken-als/[beroep]`, `/over-ons`, `/contact`, `/uitzendbureau/[stad]` | niet aanwezig; over-ons en contact zijn ankers op home |
| E-mail versturen (Resend/nodemailer), notificaties | geen |
| `not-found.tsx`, `error.tsx`, `loading.tsx`, `manifest` | geen |
| Echte identiteit: kleuren, display-font, logo, OG-opmaak, favicon-PNG, foto's (`public/*` leeg) | alles neutraal grijs en TODO; `brand.ts` moet mee |
| Bedrijfsgegevens (naam, KvK, btw, adres, telefoon, mail, domein, socials, schemaType, areaServed) | alles TODO in `lib/site.ts` |
| Juridische teksten voor sollicitanten en cv-bewaartermijn, algemene voorwaarden | privacy generiek uit JV; AV volledig leeg |
| Dark mode activeren of verwijderen | `.dark`-tokens bestaan, worden niet gebruikt |
| `next/image` | geen enkele `<Image>`; alle beelden via `<img>` met eslint-disable |
| Tests, CI, Playwright-config, redirects | niet aanwezig |
