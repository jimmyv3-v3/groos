# Samenvatting context/08 Tekstelementen-inventaris

## Feiten
- Inventaris J. Versseput (commit d1ed483): ca. 11.250 Nederlandse woorden. Interface 1.440, acht dienstpagina's 6.060 (600 tot 1.030 per pagina), vijf stadspagina's 1.280 (235 tot 280 uniek), privacy 830, voorwaarden 1.650.
- Drie tekstmechanismen (messages, CONTENT per pagina, data-overlay); Groos krijgt een vierde uit de database.
- Koppen: h1 plus h2 in twee delen (titel en accent) die samen één zin vormen. JV gebruikt h3 op kaarten.
- Dienstpagina-template: lead van 35 tot 60 woorden, 5 tot 7 bullets, drie urgentiekaarten, CTA-band, vier kaarten "Waarom", 6 tot 8 FAQ's, formulier, JSON-LD Service.
- Offerteformulier post client-side naar Web3Forms zonder API-route, upload, bevestigingsmail, spambescherming of bedankt-URL.
- JV mist 404, cookiebanner, contactpagina en bedankpagina; hardcoded Nederlands verschijnt op /en; SITE_URL staat op vijf plekken; dienst- en stadspagina's verliezen hreflang.
- next-intl: NL op root, EN onder /en met Nederlandse slugs; geo-redirect buiten NL en BE.

## Besluiten en voorstellen (met wie moet bevestigen)
- Navigatie Vacatures, Werkzoekenden, Werkgevers, Over ons, Contact; header met "Bekijk vacatures" en "Personeel aanvragen" (Djulan).
- Sitemap §7 met prioriteiten, aangevuld met actieve vacatures, noindex voor bedankpagina's en querystrings, SITE_URL op één plek (Djulan; 03 leidend).
- Nieuwe elementen §6: bereikbaarheidsregel, drie WhatsApp-voorinvulteksten, 404 en 500, laadstaten, melding bij onvertaalde vacatures. Overzicht met zes filters, ICU-meervoud, lege staat met drie uitwegen en beroepsintro van 40 tot 60 woorden. Kaart met badges en samenvatting van maximaal 20 woorden. Detail met lead van 30 tot 45 woorden, negen kenmerklabels, vijf h2-secties, JobPosting en dynamisch OG-beeld (Djulan; 06 leidend voor velden).
- Sollicitatieformulier kort, cv optioneel, toestemming met privacylink plus losse talentpool-toestemming; bedankpagina's noindex (Djulan, Jimmy en Lorenzo).
- §6.12 verlopen vacature: melding bovenaan, één zin met alternatief, vergelijkbare vacatures, knop open sollicitatie, formulier verdwijnt. Technisch: validThrough in het verleden, markup weg of later 404 of 410 (Djulan).
- Beroepspagina's 5 × 2 op dienstpagina-template; geen urgentiecopy voor werkzoekenden; live vacatures alleen op de W-pagina (Djulan).
- Alleen verifieerbare cijfers, logo's en citaten met toestemming, kernwaarden en vier beloftes (Jimmy en Lorenzo).
- Cookiemelding weglaten zonder cookies; klachtenregeling optioneel (Djulan en jurist). Engelse slugs via pathnames of Nederlands (Djulan).

## Aannames in het document
- Jimmy is mogelijk Jimmy Versseput (zelfde nummer en LinkedIn bij JV); niet bevestigd.
- Wtta per 1 januari 2027 en AP-bewaartermijnen (4 weken, met toestemming 1 jaar) komen uit secundaire bronnen.
- Groos heeft bezoekadres, kantoortijden, twee contactpersonen met foto, vijf vaste beroepen en Supabase; kandidaten solliciteren mobiel en vaak zonder cv.

## Open vragen (sectie "Te verifiëren" en wat je zelf ziet)
- §8: aanspreekvorm, h3-regel, identiteit Jimmy, Wtta-registratie, keurmerken en cao, dienstvormen, beloftes, invulling 24/7, extra talen, werkgebied, bewaartermijnen, e-maildomein.
- Eigen: /vacatures/[slug]/solliciteren als route of sectie (03 noemt hem niet); vacaturetitel h2 of h3; sortering "Dichtbij" vraagt locatie; talentpooltermijn.

## Relevant voor specs (per modulenummer uit docs/HANDOVER.md §4)
- 01: §7 noindex-regels, navigatie, EN-slugs; routes uit 03. 02: accentkop-patroon, ServiceSteps, h3-besluit.
- 03: §5 mapping, sleutelvoorstellen (common.cta.viewJobs, whatsapp.*, jobs.onlyDutch), lengtes; toon via 07.
- 04: §4.1, hero met twee deuren, twee werkwijzen, twee FAQ-sets. 05: §6.8 tot 6.10.
- 06: §6.2 tot 6.4, §6.12. 07: §2.6, §4.2, §6.5 tot 6.7. 08 en 11: §6.15. 09: §6.17. 10: velden per taal, sitemap uit database.
- 12: §2.5, JSON-LD (EmploymentAgency, JobPosting, twee FAQPage), §6.12, dynamisch OG. 13: SITE_URL, e-maildomein. 14: aria-teksten, laadstaten, geen NL op /en. 15: §6.11, §4.5.

## Tegenstrijdigheden (met docs/HANDOVER.md, docs/HANDOVER-2.md, CLAUDE.md of andere contextbestanden die je kent)
- HANDOVER §4 verwijst voor routes naar 08 §7; README en HANDOVER-2 maken 03 leidend. Afwijkingen in 08: /open-sollicitatie (03: /inschrijven), /personeel/[beroep] (03: /werkgevers/[beroep]), /uitzendbureau/[stad] (03: /regio/[plaats]). 08 mist /werkgevers/wtta, /cookieverklaring en /klachtenregeling. BOUWINSTRUCTIE §4 en MIGRATIE gebruiken nog de 08-routes.
- Koppen: CLAUDE.md en README staan alleen h1 en h2 toe; 08 wil h3 op kaarten.
- Aanspreekvorm: 08 adviseert je/u; CLAUDE.md laat werkzoekenden open; 07 is leidend maar ontbreekt nog.
- 08 maakt cookieverklaring en klachtenregeling voorwaardelijk; 03 en 09 zetten beide als route.
- Verlopen vacatures: 08 laat de keuze open; 10 kiest 410 of 404 na 30 dagen met standaard 45 dagen; 11 noemt 60 dagen en elders zes maanden.
- Lange tekst: 08 beveelt CONTENT in page.tsx aan, CLAUDE.md schrijft content/ voor.
