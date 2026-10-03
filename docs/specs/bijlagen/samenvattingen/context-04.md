# Samenvatting context/04: vacaturebank Wilk

## Feiten
- Peildatum 2 oktober 2026. WordPress met plugin Uitzendplaats v2, filteren en solliciteren via AJAX. Geen formulier verstuurd.
- 306 vacatures, maar 53 unieke titels en 48 teksten: één tekst per plaats gekopieerd. Match met Groos: glazenwasser 0, verhuizer 0, schoonmaker 6, logistiek 76, bouw en sloop 28.
- Filters op sector, functie, werkverband en regio met live tellers; OF binnen een groep, EN ertussen; status niet in de URL. Zoeken werkt niet op plaats; postcode met straal alleen in de backend. Geen sortering.
- Kaart: plaats, uren, salaris en teaser; geen werkverband of datum. Lege staat één zin.
- Detail: extra h1 in de tekst, formulier op mobiel vijf schermhoogtes laag zonder sticky knop, willekeurige gerelateerde vacatures, breadcrumbs alleen in JSON-LD.
- Slug zonder plaats; meta uit één sjabloon; JobPosting plus ItemList van alles, met herdateerde datePosted, verlopen validThrough, niet-standaard employmentType en generieke adressen.
- Formulier: alleen voornaam en e-mail verplicht, cv optioneel, geen captcha, lege bedankpagina. WhatsApp zonder vooringevulde tekst. Eén recruiter op alles. Jobalert onbereikbaar, alleen e-mailveld.
- Taxonomie rommelig (Den Haag in drie spellingen, zzp in functienamen). Salaris zonder euroteken, in de tekst alleen "marktconform". Je-vorm met vaste mal. Mobiel horizontaal scrollen, filters vóór de lijst. GA-cookies zonder banner.

## Besluiten en voorstellen (met wie moet bevestigen)
Geen besluiten. Voorstellen (Djulan bevestigt, tenzij anders vermeld):
- Datamodel: titel, functie, sector, plaats, regio, werkverband, uren en salaris met eenheid, opleiding, publicatie- en sluitdatum, recruiter, tekst (via context/06).
- Kenmerkenblok plus werkverband en startdatum; datum of "nieuw" op de kaart.
- Facetten met tellers, filters in de URL, zoeken op plaats en beroep, postcode met straal, sortering op datum, afstand en salaris.
- Eén vacature per opdracht of met meerdere werkplekken (Djulan, Jimmy).
- Vaste tekstmal met eigen labels, je-vorm (via context/07).
- Kort formulier met naam, telefoon en optioneel cv, onzichtbare botbescherming; WhatsApp en bellen gelijkwaardig, bericht vooringevuld; bedankpagina met vervolgstap en bevestigingsmail; op mobiel sticky sollicitatieknop en filterpaneel achter een knop.
- Jimmy en Lorenzo als contactpersoon per beroep (Jimmy, Lorenzo).
- Jobalert met criteria; lege staat met suggesties en open sollicitatie; gerelateerd op beroep of regio.
- SEO: unieke description, plaats in de slug, zichtbare breadcrumb, pagina's per beroep en stad, JobPosting met echte werklocatie en werkende validThrough.
- Salaris bruto met euroteken en eenheid, cao bij naam (Jimmy); cookieloze analytics; bewaartermijn cv's; één h1, kaarttitel als kop.

## Aannames in het document
- Wilk beheert vacatures in Uitzendplaats; niet bevestigd.
- Groos bouwt Next.js met Supabase.
- Matching is eigen indeling; snelheid één meting; datePosted vermoedelijk bulkbewerking; adressen pluginstandaard.

## Open vragen (sectie "Te verifiëren" en wat je zelf ziet)
Uit het document: herkomst vacatures; bevestigingsmail; zichtbaarheid van de jobalert-link; inhoud van de bedankpagina na een echte sollicitatie; echte plaatsingsdatum.
Zelf gezien: verplicht contactveld; meerdere werkplekken; coördinaten voor afstand; cv-limiet 2 of 10 MB; favorieten; welke cao; jobalert fase 1 of 2; context/06 ontbreekt nog.

## Relevant voor specs (per modulenummer uit docs/HANDOVER.md §4)
- 01: plaats en id in de slug, breadcrumb, open sollicitatie in header.
- 02: kenmerkenblok, filtersheet, sticky knop.
- 03: tekstmal, je-vorm, concrete bedragen.
- 05: beroepspagina's met live vacatures.
- 06: overzicht, filters, kaart, detail, lege staat, gerelateerd, sortering.
- 07: kort formulier, cv optioneel, WhatsApp vooringevuld, bedankpagina.
- 08: genormaliseerde lijsten, salarisvalidatie, sluitdatum.
- 09: cookieloze analytics, bewaartermijn.
- 10: veldenlijst, werkverband los van functie, coördinaten.
- 11: bevestigingsmail, jobalert.
- 12: correcte JobPosting, unieke meta, validThrough, geen ItemList.
- 14: geen horizontaal scrollen, één h1.
- 15: jobalert, stadspagina's.

## Tegenstrijdigheden (met docs/HANDOVER.md, docs/HANDOVER-2.md, CLAUDE.md of andere contextbestanden die je kent)
- Filters indexeerbaar (04) tegenover noindex (context/10).
- Naam en telefoon verplicht (04) tegenover e-mail (context/11).
- Meerdere werkplekken (04) tegenover één locatie (context/11).
- Kaarttitel als kop, dus h3 (04) tegenover alleen h1 en h2 (CLAUDE.md, open in HANDOVER-2).
- Cao bij naam (04) tegenover alleen als die rond is (HANDOVER-2).
- Je-vorm (04, HANDOVER-2) tegenover u-vorm in meta-sjablonen (context/10).
- Jobalert direct (04) tegenover fase 2 (BOUWINSTRUCTIE, context/11).
- HANDOVER §4 noemt 04 als bron voor module 06; HANDOVER-2 maakt het ontbrekende context/06 leidend.
- Sluitdatum 45 dagen (context/10) tegenover 60 (context/11).
