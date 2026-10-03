# Samenvatting context/13-concurrentie-en-inspiratie.md

## Feiten
- Onderzoek op 2 oktober 2026 naar 16 bureausites; Timing en Olympia alleen via zoekresultaten.
- Nichebewijs: Randstad 14 schoonmaak- en 10 bouwvacatures tegenover 741 logistiek, Tempo-Team 32 en 26 tegenover 1.470. Geen groot bureau kent een categorie glazenwasser, verhuizer of sloophulp.
- Marktstandaard: salaris en uren op kaart en detail, cv optioneel, WhatsApp als kanaal, reactie binnen 24 uur, JobPosting met baseSalary en validThrough. Anti-patronen: verplicht account, geboortedatum in stap 1, verplichte marketing-opt-in, verouderde vacatures, emoji's.
- Alleen Randstad publiceert omrekenfactoren (uitzenden 2,5, detacheren 2,8, payroll 1,85, W&S 25%). Prestatie (Den Haag) claimt 24/7 en levering binnen 24 uur, dezelfde belofte als Groos.
- Relevante keurmerken: SNA, ABU of NBBU, VCU, SNF, Wtta; OTTO linkt badges naar openbare registers. Negatieve reviews gaan over onbereikbare coördinatoren, positieve noemen recruiters bij naam.
- Geen onderzochte site biedt Turks of Arabisch. "Je" is universeel voor werkzoekenden; alleen Start People gebruikt "u" voor werkgevers.
- Het document bevat twee FAQ-lijsten (23 vragen werkzoekenden, 20 werkgevers), een microcopy-catalogus en 25 aanbevelingen.

## Besluiten en voorstellen (met wie moet bevestigen)
Alles is voorstel; niets is besloten.
1. Gesplitste hero met twee deuren (vijf beroepstegels; aanvraagknop plus telefoon), geen zoekbalk als hero, vertrouwensstrook met drie beloftes. Djulan (04), Jimmy en Lorenzo voor de beloftes.
2. Solliciteren in één scherm: voornaam, telefoon met landcode, woonplaats, startmoment, optioneel talen; cv optioneel, geen account, Bel en App naast het formulier. Djulan (07).
3. Blue-collarfilters (functie, afstand, uren, werktijden, rijbewijs, taal, cv, VCA), filterchips bij weinig vacatures, kaart met uurloon, uren en maximaal twee badges. Djulan (06).
4. Detailpagina met kenmerkenblok bovenaan, sticky knoppenbalk mobiel, gesloten vacatures blijven bereikbaar, automatisch sluiten na 60 dagen. Djulan (06, 12).
5. Personeel aanvragen in twee stappen waarbij stap 1 compleet is, spoedknop, vergelijkingstabel in u-vorm, tariefopbouw zonder factor. Jimmy en Lorenzo (diensten, factor), Djulan (07).
6. Je voor werkzoekenden, u voor werkgevers, geen emoji's. Context/07 beslist.
7. Talen: NL en EN volledig, daarna kandidaatpagina's in Pools, Roemeens, Turks en Arabisch (RTL). Djulan en Jimmy.
8. Keurmerken alleen met registerlink, anti-fraudezin, Google-reviews vanaf dag één naast formulieren. Jimmy en Lorenzo.
9. Jobalert per e-mail en optioneel WhatsApp, zonder geboortedatum. Fase 2.

## Aannames in het document
- Jimmy en Lorenzo willen met foto, voornaam en direct mobiel nummer op home, vacature, formulier en contact.
- De 24/7-bereikbaarheid is echt (microcopy "dag en nacht").
- Groos biedt in elk geval uitzenden; andere vormen onbekend. Uitbetaling wekelijks of per vier weken.

## Open vragen (sectie "Te verifiëren" en wat je zelf ziet)
- Uit §12: keurmerken; Wtta-route voor een startend bureau; ABU- of NBBU-cao; g-rekeningpercentage; diensten; reactietermijnen per kanaal; wie 24/7 opneemt; uitbetalingsritme; talen van Jimmy en Lorenzo; huisvesting; externe cijfers ongecontroleerd; e-maildomein.
- Zelf gezien: WhatsApp-nummer onbekend (context/03); jobalert via WhatsApp vraagt opt-in en een berichtenbeleid bij Meta.

## Relevant voor specs (per modulenummer uit docs/HANDOVER.md §4)
- 03: je/u, register, microcopy §8, FAQ-strekkingen §7 (ondergeschikt aan context/07).
- 04: hero, vertrouwensstrook, sectievolgorde (§1.4, §11).
- 05: beroepspagina's met kant voor beide doelgroepen; badges per beroep.
- 06: facetten, kaart, lege staat, detailvolgorde, gesloten vacatures (§2, §3).
- 07: velden van sollicitatie, inschrijven en aanvraag; validatie en bevestigingen (§4.5, §5.6, §8).
- 09: AVG-checkbox, marketing apart, anti-fraudezin, keurmerken met registerlink, Wtta-data.
- 10, 11: statussen, bevestigingsmails met termijnen. 12: JobPosting, FAQPage, landingspagina's. 15: jobalert, stadspagina's, extra talen.

## Tegenstrijdigheden (met docs/HANDOVER.md, docs/HANDOVER-2.md, CLAUDE.md of andere contextbestanden die je kent)
- Statussen (nieuw, gebeld, op gesprek, geplaatst, afgewezen) wijken af van de enum application_status in context/11; 11 is leidend.
- Talen: 13 noemt Arabisch, HANDOVER-2 en context/02 noemen Bulgaars.
- Landingspagina's als `/vacatures/schoonmaker/den-haag` passen niet in de leidende sitemap van context/03 (`/vacatures/[functie-plaats-id]`, `/werken-als/[beroep]`, `/regio/[plaats]` fase 2).
- "Ik ga akkoord met de privacyverklaring" botst met context/09, dat een kennisnameformulering zonder toestemming voorschrijft.
- Sluittermijn 60 dagen klopt met context/11, maar context/10 rekent met 45 dagen.
- Gesloten vacatures blijven online, terwijl context/10 verwijderen (404 of 410) of validThrough in het verleden beschrijft; spec 12 moet kiezen.
- Wtta-waarborgsom € 100.000 in 13; HANDOVER-2 noemt € 50.000 voorlopig, later € 100.000.
- 13 bouwt op 24/7, terwijl HANDOVER-2 en context/03 die tekst als Wilk-formulering markeren die eerst bevestigd moet worden.
