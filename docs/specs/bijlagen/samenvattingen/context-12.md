# Samenvatting context/12-branding-richting.md

## Feiten
- 18 bureaus onderzocht. Blauw is overvol (9 van 18), rood en oranje bezet, donkergroen lokaal van Wilk en Uniwest. Vrij: geel als hoofdkleur, steenrood, ultramarijn. Limoen alleen als accent.
- Groos betekent trots (Zeeuws, Rotterdams, Afrikaans), met bijsmaak ijdel. Naamgenoten: conceptstore GROOS Rotterdam met hetzelfde verhaal, Jeugdpraktijk Groos in Den Haag, Groei Personeelsdiensten in Zwolle; groos.nl is bezet.
- groospersoneelsdiensten.nl (met s) staat sinds 11 september 2026 bij STRATO met mailserver; de variant zonder s uit de briefing is vrij, dus dat e-mailadres werkt niet.
- A Signaal: geel #FFCD00 met inkt #0F1B2D. B Baksteen: steenrood #A63A1F met leisteen #1E2A33.
- C Kobalt, volledige set: primair kobalt #3340E0 (HSL 235 74% 54%; wit op kobalt 7,1:1 AAA); secundair nacht #0B0F2E (233 61% 11%; op wit 18,7:1); accent limoen #C8F23A (74 88% 59%; nacht op limoen 14,5:1, limoen op kobalt 5,5:1, op wit 1,3:1 dus nooit op wit); neutraal licht ijs #F5F6FA (228 33% 97%); neutraal tekst leigrijs #4B5170 (230 20% 37%; op ijs 7,2:1 AAA); donker thema nacht met licht kobalt #8C95FF (235 100% 77%; 7,0:1). Kop Instrument Sans Bold op breedte 75 tot 100, tekst Onest met Cyrillisch. Risico's: valt minder op, oogt als techstart-up, limoen streng doseren.
- Logo: werkt in één kleur, op 24 px en op een hesje. A: GROOS in kapitalen met reflectorstreep door beide O's, G-monogram in gele tegel. B: Groos in Fraunces, G uit blokjes als metselwerk. C: groos in kleine letters met de o's als schakels; beeldmerk een G als doorlopende pijl in een cirkel met limoenstip; varianten kobalt op wit, wit op kobalt, limoen alleen op donker.
- Contrast (WCAG 2.2): tekst 4,5:1, lopende tekst 7:1, niet-tekst 3:1, kleur nooit als enige drager, doelgrootte 24 px, advies 44 tot 48 px. Basistekst 17 tot 18 px, geen gewicht onder 400, subset latin-ext. Signaalkleuren nooit als tekst op wit.
- §6.1 bevat alleen shadcn-tokens voor A plus success, warning en ink. Scores: A 40, B 36, C 35.

## Besluiten en voorstellen (met wie moet bevestigen)
- Voorstel A; de klant kiest via Djulan. Voorwaarden: geel alleen als signaal, nooit tekst op wit, geen fluor, geen waarschuwingsstrepen, geen helder blauw ernaast.
- Licht thema standaard, donker als optie (Djulan).
- Trots-verhaal op de over-ons-pagina; e-mailadres met s bevestigen en variant zonder s registreren; merkenonderzoek BOIP en EUIPO klasse 35 (klant).
- Vervolg: logo-schetsen, proefpagina in de zon, drukproef, fotoshoot (klant).

## Aannames in het document
- Het e-mailadres in de briefing is een tikfout en het domein met s is van de klant.
- Werkzoekers lezen vooral mobiel en buiten; Jimmy, Lorenzo en medewerkers mogen gefotografeerd worden.
- Scores zijn een teaminschatting; Pantone 116 C is indicatief; keurmerken zijn onbekend.

## Open vragen (sectie "Te verifiëren" en wat je zelf ziet)
- Uit §8: e-maildomein, merkrecht, Vlaams gebruik van groos, font-stretch bij Archivo, logo-oppervlak op hesjes, Wtta en verplichte keurmerken.
- Zelf gezien: geen tokenset voor C, die moet spec 02 afleiden. Wordt een donker thema geleverd? Is Djulans touch blauw alleen accent of ook knopkleur, en hoort limoen erbij? Blauwe keurmerklogo's vallen bij een blauw merk minder op.

## Relevant voor specs (per modulenummer uit docs/HANDOVER.md §4)
- 02: kleuren, typografie, logo, tokens, contrast, iconen, beeldtaal.
- 03: trots-verhaal, voorbeeldzinnen, je en u.
- 04 en 05: eigen foto's met correcte beschermingsmiddelen, keurmerkstrook.
- 07 en 14: statuskleuren met tekst of icoon, knoppen 44 tot 48 px, AA en AAA, latin-ext.
- 09: merkenonderzoek, Wtta, zichtbare keurmerken.
- 12 en 13: naamverwarring met naamgenoten; domein met en zonder s, STRATO.
- 01 en 15: fontsubsets per locale, Onest voor Cyrillisch.

## Tegenstrijdigheden (met docs/HANDOVER.md, docs/HANDOVER-2.md, CLAUDE.md of andere contextbestanden die je kent)
- Djulan vraagt wit met een touch blauw; context/12, HANDOVER §6, HANDOVER-2 en MIGRATIE §6 gaan uit van A (geel). Het document noemt blauw overvol, scoort C het laagst en sluit bij A helder blauw uit. C is het aanknopingspunt, maar limoen is niet gevraagd.
- HANDOVER §3 en CLAUDE.md verwachten --brand-subtle, --brand en --brand-strong; §6.1 levert ze niet.
- Fontcheck op Next.js 16.2.9, terwijl deze repo op 16.3.8 draait.
- De briefing noemt groos Vlaams; de bronnen bevestigen alleen Zeeuws.
