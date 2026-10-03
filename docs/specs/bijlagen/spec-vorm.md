# Spec-vorm (verplicht voor elke spec in docs/specs/)

Bestandsnaam: `docs/specs/<nn>-<module>.md`. Taal: Nederlands. Zakelijk, volledige
zinnen, geen uitroeptekens, geen gedachtestreepjes in zinnen, geen eyebrows.
Verwijs naar andere specs als `spec 10 §5` en naar bronnen als `context/11 §4.2`.
Elke eis en elk acceptatiecriterium krijgt een id, zodat spec 00 ze kan traceren.

```
# <nn> <Module>

| Status | Fase | Hangt af van | Bronnen |
|---|---|---|---|
| concept | 1 | 01, 03 | context/.., docs/MIGRATIE.md §.. |

## 1 Doel
Eén alinea: wat deze module oplevert en waarom.

## 2 Gebruikers en scenario's
Per gebruiker (werkgever, werkzoekende, beheerder) de scenario's die deze module
dekt, als genummerde lijst S-<nn>-01 enzovoort.

## 3 Scope
Wat wel, wat niet, wat fase 2 is. Eisen als E-<nn>-01 enzovoort.

## 4 Pagina's en componenten
Per pagina of scherm: route, sectievolgorde van boven naar beneden, welke
bestaande bouwsteen (uit de repo-inventaris) wordt hergebruikt met welke props,
en wat nieuw is. Nieuwe componenten: naam, bestand, props, client of server.

## 5 Data
Tabellen, velden, typen, verplicht of optioneel, validatieregels (zod), statussen.
Verwijs naar spec 10 voor het datamodel; herhaal alleen wat deze module nodig heeft.

## 6 Tekstelementen
Welke sleutels in messages/<locale>.json (exacte paden), welke bestanden in
content/, welke structurele data in lib/site.ts. Verwijs naar spec 03 voor toon
en aanspreekvorm. Geef Nederlandse voorbeeldcopy waar dat de bouw versnelt
(koppen, CTA-labels, lege staten, foutmeldingen), volgens de schrijfregels.

## 7 SEO
Titel- en beschrijvingssjabloon, canonical, hreflang, noindex-regels, JSON-LD
(welke builder, welke velden), sitemap en llms.txt.

## 8 Toegankelijkheid en performance
Landmarks, koppenstructuur, focus, labels, contrast, reduced motion, server of
client, caching en revalidatie, afbeeldingen.

## 9 21st.dev-opdracht voor sub-agents
Welke sub-agents de bouw-agent spawnt, met per sub-agent: de zoekopdrachten
voor `search` en `get_inspiration` (meerdere formuleringen), de
selectiecriteria (minimaal, wit, blauw accent, shadcn-compatibel, geen extra
dependencies), wat ze opleveren (voorstel met id's en preview-URL's, geen code
ophalen zonder keuze) en de aanpassingsregels (tokens, props, i18n, server en
client, reduced motion). `get_component` alleen voor de gekozen kandidaat.
Als 21st.dev niets bruikbaars geeft: bouwen op de bestaande primitives.

## 10 Bouwopdracht
Genummerde stappen voor de bouw-agent: bestanden die worden aangemaakt of
gewijzigd, volgorde, afhankelijkheden op andere specs, commando's om te
verifiëren (`npm run verify`, `npm run check`, Playwright op 390/768/1280/1440).

## 11 Acceptatiecriteria
Genummerde, toetsbare criteria AC-<nn>-01 enzovoort. Elk criterium beschrijft
een waarneembaar resultaat (URL, element, record, e-mail, meting).

## 12 Open vragen en aannames
Tabel: onderwerp, aanname die de spec hanteert, wie bevestigt (Djulan, Jimmy,
Lorenzo), wat er verandert als het anders is.
```
