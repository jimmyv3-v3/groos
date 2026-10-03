# Handover 2: de contextbank

Opgesteld op 2 oktober 2026 door de contextsessie. Dit is een aanvulling op
[`HANDOVER.md`](HANDOVER.md); die blijft je opdracht. Hier staat wat de
contextsessie heeft opgeleverd, wat daarin leidend is en wat nog open staat.

## Wat er ligt

`context/` bevat 15 documenten en een map `research/`. Ze zijn gemaakt door
tien onderzoeksagents. Het overzicht per bestand staat in
[`context/README.md`](../context/README.md). Elk document heeft een sectie
"Bronnen" en een sectie "Te verifiëren".

## Leesvolgorde

1. `context/README.md`: inventaris en welke bron leidend is
2. `00` bedrijf, `02` doelgroepen, `03` contact en sitemap
3. `07` tone of voice en `research/jversseput-schrijfstijl-analyse.md`
4. `06` vacaturevelden, daarna `11` backend en beheer
5. `08` tekstelementen, `09` juridisch, `10` SEO
6. `01` beroepen, `12` branding, `13` concurrentie, `04` en `05` Wilk

## Correcties op HANDOVER.md

- **Routes:** de moduletabel verwijst naar `context/08 §7`. Gebruik
  `context/03`. Die voegt de twee verschillende voorstellen uit 08 en 10 samen:
  `/werken-als/[beroep]`, `/werkgevers/[beroep]`, `/inschrijven`,
  `/werkgevers/personeel-aanvragen`, `/werkgevers/wtta`.
- **Vacaturebank (modules 06, 07 en 10):** gebruik `context/06` voor velden,
  keuzelijsten, filters, formulieren en de JobPosting-mapping. De velden in
  `11 §2` zijn een concept; de rest van 11 blijft geldig.
- **Toon (module 03):** gebruik `context/07`. Dat document gaat boven de
  toonadviezen in 01, 08 en 13.
- **E-maildomein:** dit is niet alleen een afwijking in de naam. Het domein
  zonder "s" heeft geen mailserver (gecontroleerd met `dig`).
  `groospersoneelsdiensten.nl` met "s" staat sinds 11 september 2026 bij STRATO
  en heeft een werkende MX. Ga daarvan uit, maar laat het bevestigen.

## Harde regels voor elke spec

- Niets van Wilk overnemen. `04`, `05` en `research/wilk/` zijn bedoeld om te
  begrijpen hoe het werkt, niet om te kopiëren.
- Schrijf in de methode van J. Versseput: alinea's van twee zinnen (eerst een
  bewering, dan een concreet detail), zinnen van ongeveer 15 woorden, "wij",
  geen uitroeptekens. Voor werkzoekenden taalniveau B1.
- Keurmerken, cao en Wtta-status pas tonen als ze echt rond zijn.
- De branding mag niet lijken op Wilk of op J. Versseput.

## Voorstellen die een beslissing nodig hebben

| Onderwerp | Voorstel | Bron |
|---|---|---|
| Aanspreekvorm | "je" voor werkzoekenden, "u" voor opdrachtgevers | 07 |
| Merk | Richting A "Signaal": geel `#FFCD00` met inkt `#0F1B2D`. Geel nooit als tekst op wit | 12 |
| Backend | Supabase Pro in de EU (Frankfurt), eigen `/beheer`, Resend, BotID, Vercel Cron | 11 |
| Solliciteren | Kort formulier, cv optioneel, WhatsApp en bellen als gelijkwaardige route | 06, 13 |
| Talen | NL en EN bij lancering, later PL, BG, TR en RO voor de kandidaatpagina's | 02, 10 |
| h3-koppen | CLAUDE.md noemt alleen h1 en h2, maar J. Versseput gebruikt h3 op kaarten | 08 |
| Indeed | Gratis bereik via een XML-feed bestaat sinds 31 maart 2026 niet meer. Feed alleen als het betaald wordt | 10, 11 |

## Urgent voor Jimmy en Lorenzo

- **Wtta:** aanmelden voor de overgangsregeling kan van 1 november tot en met
  31 december 2026. Nog onduidelijk is of een bureau dat net gestart is dat mag.
  De waarborgsom is € 50.000 bij een voorlopige toelating en later € 100.000.
- **Adres:** Hugo Coenraadspad 6 is in de BAG een woning. Op de site komt
  "bezoek op afspraak" en in het Google Bedrijfsprofiel wordt het adres
  verborgen.
- **Openingstijden en 24/7:** de tekst uit de briefing staat letterlijk zo bij
  Wilk. Laat bevestigen dat het de echte tijden zijn en schrijf het in eigen
  woorden.
- **Nog onbekend:** KvK, btw, achternamen en foto's, keurmerken, ABU of NBBU,
  huisvesting en vervoer, welke talen ze zelf spreken.

## Status

- **Klaar:** 00 tot en met 05, 08 tot en met 13, en `research/`.
- **In de maak:** 06 (vacaturevelden), 07 (tone of voice) en 14 (alle open
  vragen gebundeld). Ze komen in `context/` met deze bestandsnamen. Begin pas
  aan de modules 03, 06, 07, 08 en 10 uit HANDOVER §4 als ze er staan.
- `context/` is nog niet gecommit. Commit het pas als 06, 07 en 14 er zijn.
