# Samenvatting context/10-seo-en-vindbaarheid.md

## Feiten
- Peildatum 2 oktober 2026. Supabase voedt pagina, JSON-LD, sitemap, Indexing API en feeds.
- Zoekwoorden uit autocomplete, volumes geschat. Werkzoekenden: "uitzendbureau den haag" hoog, schoonmaak middel tot hoog, logistiek middel, overige beroepen laag; modifiers parttime, avond, zonder diploma, leeftijd. Werkgevers: "personeel inhuren" middel, branchetermen laag. "glazenwasser inhuren" is consumentenintentie.
- Google for Jobs werkt in Nederland. Verplicht: title (alleen functietitel), description in HTML, datePosted, hiringOrganization, jobLocation (werkplek), validThrough bij einddatum. Aanbevolen: baseSalary (echt loon, HOUR), employmentType (TEMPORARY plus FULL_TIME of PART_TIME), directApply, "no requirements". Markup alleen op de detailpagina.
- Indexing API: alleen JobPosting, 200 verzoeken per dag, meer vraagt goedkeuring, serviceaccount als eigenaar in Search Console. Sollicitatieklikken krijgen utm_source=google_jobs_apply.
- Indeed Single-Source Feed Policy sinds 31 maart 2026: single-source XML-feeds alleen zichtbaar als gesponsord; toepassing op eigen NL-feeds onzeker. Werkzoeken.nl weigert feeds onder 25 vacatures.
- Hugo Coenraadspad 6 is in de BAG een woning. Eigen reviews geven geen sterren. Googlebot crawlt vanaf VS-adressen; JV stuurt die naar /en.

## Besluiten en voorstellen (met wie moet bevestigen)
- Slug functie-plaats-id met 308 bij titelwijziging; filters noindex, follow met canonical naar /vacatures; paginering self-canonical (03, Djulan).
- Levenscyclus: open is 200 met JobPosting, sitemap en URL_UPDATED; vervuld 30 dagen 200 met melding, noindex follow, zonder markup; daarna 410 of 404 plus URL_DELETED. Standaard validThrough 45 dagen. Djulan; termijn Jimmy en Lorenzo.
- Aparte vacaturesitemap met lastmod uit updated_at; Indexing API via Supabase-webhook. Djulan.
- Eén feedroute met adapters; prioriteit Google for Jobs 1, Indeed 2, overige 3. Indeed-budget: Jimmy en Lorenzo.
- Bedrijfsprofiel: categorie Uitzendbureau, adres verbergen met servicegebied, kantoortijden als openingstijden, 24/7 in beschrijving, één primair nummer. Reviews aan beide doelgroepen, geen aggregateRating. Jimmy en Lorenzo.
- EmploymentAgency-schema op home en contact, geo weglaten bij verborgen adres. Djulan.
- Meta-sjablonen: titels tot 60 tekens, descriptions 150 tot 155 tekens, bandbreedtes met "tot", dynamische OG-afbeelding per vacature. Djulan en copy-spec.
- Talen: NL en EN volledig, Engelse vacatures alleen bij echte vertaling, PL en RO pas als Groos ze kan bedienen. Paden via pathnames, hreflang met x-default naar NL, geen IP-redirect. Djulan (paden), Jimmy en Lorenzo (talen).
- robots.txt blokkeert beheer en API, niet filterpagina's. Cookieloze analytics met conversie-events.

## Aannames in het document
- Groos is juridisch werkgever; anonieme opdrachtgever via "confidential".
- Formulier op de vacaturepagina (directApply true).
- Domein, logo, OG-beeld, loon en telefoonnummer zijn placeholders.
- Alle descriptions in de u-vorm, ook voor werkzoekenden.
- Servicegebied zeven gemeenten; areaServed noemt er zes.

## Open vragen (sectie "Te verifiëren" en wat je zelf ziet)
- Uit het document: zoekvolumes, domein, bezoek op het adres, primair nummer, Indeed-beleid NL, koppeling Werk.nl, feedspecificaties, Indexing API-quotum, ISO 6523-code, Bedrijfsprofielcategorieën, PL en RO, reactietijdbeloftes, JV-indexering.
- Zelf gezien: Indexing API fase 1 of 2; Wtta-datum in teksten; /feeds in robots.txt; 410 of 404; veldnamen per taal; bron voor {startmoment}.

## Relevant voor specs (per modulenummer uit docs/HANDOVER.md §4)
- 01: URL-structuur, filters, hreflang, pathnames, geen geo-redirect.
- 03 en 05: zoekwoordclusters, drempelverlagers, geen klantnamen; beroepspagina's met live vacatures.
- 06 en 07: slug met id, interne links, vervulde pagina; directApply, utm, conversie-events.
- 08 en 10: statusflow, validThrough, updated_at, webhook, teksten per taal, feedtoggles.
- 12: JobPosting, EmploymentAgency, sitemaps, Indexing API, meta-sjablonen, Bedrijfsprofiel, NAP, reviews, robots.
- 13 tot 15: Google Cloud-project, Search Console, domein, Rich Results Test; fase 2 feeds, regiopagina's, PL en RO, Engelse vacatures.

## Tegenstrijdigheden (met docs/HANDOVER.md, docs/HANDOVER-2.md, CLAUDE.md of andere contextbestanden die je kent)
- Routes: 10 gebruikt /beroepen/[beroep], /werkgevers/[branche] en /personeel-aanvragen; 03 is leidend met /werken-als/[beroep], /werkgevers/[beroep meervoud] en /werkgevers/personeel-aanvragen.
- Stadspagina's: 10 en 03 /regio/[plaats], BOUWINSTRUCTIE §4.8 /uitzendbureau/[stad].
- Indeed: 10 laat open dat eigen feeds buiten het beleid vallen; 11 zegt dat ze eind 2026 verdwijnen; HANDOVER-2 stelt gratis feedbereik op nul.
- Indexing API: 10 maakt het kern van de levenscyclus, 11 §9.2 zet het in fase 2. Feeds: 10 zonder fasering, HANDOVER §4 module 15 fase 2.
- Talen: 10 noemt PL en RO; 02 en HANDOVER-2 noemen PL, BG, TR en RO; 02 noemt de Bulgaarse groep de grootste.
- Aanspreekvorm: 10 schrijft alle descriptions in de u-vorm; HANDOVER-2 en 11 stellen "je" voor werkzoekenden voor.
- Gelokaliseerde paden: 10 presenteert pathnames als opzet; 03 en BOUWINSTRUCTIE §7 noemen het open.
- Wtta: 10 §2 "vanaf 2027", de description "vanaf 2028"; 09 geeft wet 2027, inleenplicht 2028, register juli 2027.
- 10 noemt middleware; CLAUDE.md werkt met proxy.ts. 11 geeft na archiveren een 404 zonder termijn.
