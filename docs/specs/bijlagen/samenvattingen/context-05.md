# Samenvatting context/05-referentie-wilk-site.md

## Feiten

- Analyse van wilkpersoneelsdiensten.nl zonder de vacaturebank (context/04). Letterlijke tekst alleen in research/wilk/site-content-verbatim.md.
- Familiebedrijf in De Lier, drie teamleden, 306 vacatures, vrijwel alle in Zuid-Holland ondanks de claim heel Nederland. VCU en NBBU zijn van een ongenoemde backofficepartner; StiPP staat als certificaat.
- WordPress met Uitzendplaats-plugin aan een recruitment-CRM, GA4, geen paginacache. Lighthouse mobiel: prestaties 42, LCP 8,6 s (lazy geladen logo), CLS 0,957 (gedraaide h1), SEO 100.
- Veel lege maar indexeerbare pluginpagina's, leeg vakgebiedenoverzicht, homepage met driemaal hetzelfde sectorblok, sectoren overal anders opgesomd.
- Eén generiek contactformulier voor drie doelgroepen met verplichte bedrijfsnaam en twee velden met dezelfde veldnaam. Inschrijven zonder verplichte achternaam of telefoon, Engels privacylabel, knop heet solliciteren.
- SEO: geen og:image, geen LocalBusiness of EmploymentAgency, sameAs naar een oude V.O.F., robots.txt 404.
- Alleen een privacyverklaring; geen voorwaarden of cookiebanner terwijl GA4 en Maps zonder toestemming laden.
- Toon: je en u door elkaar, fragmenten, uitroeptekens, typfouten. Sterk: vacatures overal binnen één klik, contact per rol met WhatsApp, één consequente werknemersbelofte.

## Besluiten en voorstellen (met wie moet bevestigen)

Besluit: niets van Wilk overnemen (team). Dertien voorstellen:

1. Twee routes vanaf hero en header (Djulan).
2. Volwaardige werkgeverspagina met dienstvormen, stappen, doorlooptijd (dienstvormen: Jimmy en Lorenzo).
3. Apart aanvraagformulier met plannervelden plus terugbelverzoek (Djulan).
4. Beroepspagina's voor de vijf startberoepen (Djulan).
5. Alleen echte keurmerken met uitleg en registerlink; Wtta-status als signaal (Jimmy en Lorenzo).
6. Foto's en verhaal van Jimmy en Lorenzo (zijzelf).
7. Reviews vanaf dag één, geen verzonnen cijfers (Jimmy en Lorenzo).
8. Eén aanspreekvorm per doelgroep, foutloze tekst (Djulan).
9. Techniek: next/image, next/font, LCP niet lazy, cookietoestemming met Consent Mode, Maps na klik, robots.txt, EmploymentAgency en LocalBusiness, JobPosting uit Supabase (Djulan).
10. Bedankpagina's met inhoud en noindex, geen lege profielpagina's, privacytekst bij elk formulier (Djulan).
11. Meertaligheid voor werkzoekenden (Jimmy en Lorenzo).
12. Lokale vindbaarheid met echte inhoud, geen duplicatie per plaats (Djulan).
13. De 24/7-belofte concreet maken (Jimmy en Lorenzo).

De voorbeeldcopy moet nog met de klant worden afgestemd.

## Aannames in het document

- Groos biedt uitzenden en mogelijk detacheren, werving en selectie of zzp-bemiddeling.
- Groos start met vijf beroepen in Den Haag; Jimmy en Lorenzo zijn de gezichten.
- Wtta in werking op 1 januari 2027, aanmelden van 1 november 2026 tot 1 januari 2027.
- Server-HTML en één Lighthouse-run zijn representatief.
- Groos krijgt Next.js met Supabase; J. Versseput is voorbeeld voor tweetaligheid.

## Open vragen (sectie "Te verifiëren" en wat je zelf ziet)

Uit het document: browsercheck van het driedubbele blok en lege vakgebied, veldfout niet getest, cookiebanner bevestigen, SNA-registratie en backofficepartner van Wilk, aantal medewerkers, Wtta-data, dienstvormen en keurmerken van Groos, meertaligheid, openingstijden en 24/7 van Groos gelijk aan Wilk.

Eigen observaties: de Wilk-specifieke controles raken de specs niet. Onbeslist is of het terugbelverzoek een apart formulier wordt (03 noemt het niet), of een beroepspagina één of twee pagina's is (03 kiest twee), en of Groos een cookiebanner nodig heeft (09 adviseert cookieloze analytics).

## Relevant voor specs (per modulenummer uit docs/HANDOVER.md §4)

- 01: twee routes in de header, geen lege pagina's in de sitemap.
- 03: één aanspreekvorm per doelgroep, geen fragmenten of uitroeptekens.
- 04: hero met twee routes, geen herhaalde blokken, LCP-beeld niet lazy.
- 05: beroepspagina's met echte tekst.
- 06: JobPosting per vacature, geen duplicatie per plaats.
- 07: apart werkgeversformulier, terugbelverzoek, verplichte achternaam en telefoon, privacytekst, bedankpagina's noindex.
- 09: voorwaarden, cookieverklaring, keurmerken alleen met bewijs en registerlink, Wtta-status.
- 12: EmploymentAgency en LocalBusiness met adres en openingstijden, og:image overal, robots.txt met sitemap.
- 13: paginacache, lokale fonts.
- 14: doelen voor LCP en CLS, alt-teksten, contrast.
- 15: meertaligheid, stadspagina's met echte inhoud.

## Tegenstrijdigheden (met docs/HANDOVER.md, docs/HANDOVER-2.md, CLAUDE.md of andere contextbestanden die je kent)

- Voorstel 9 wil cookietoestemming met Consent Mode; 09 (leidend) adviseert cookieloze analytics zonder banner, zoals J. Versseput (08).
- Voorstel 4 beschrijft één beroepspagina voor beide doelgroepen; 03 (leidend) kiest /werken-als/[beroep] en /werkgevers/[beroep].
- Wtta-venster tot 1 januari 2027 zonder voorbehoud; 09 en HANDOVER-2 zeggen tot en met 31 december 2026 en twijfelen of een starter mag aanmelden.
- Zzp-bemiddeling als dienstvorm staat nergens anders; 00 gaat uit van uitzenden.
