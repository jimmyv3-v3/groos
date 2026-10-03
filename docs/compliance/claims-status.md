# Claimstatus

Claims-checklist van spec 09 §6.9 (R-12). Gebruik bij elke tekstronde
(messages, `content/`, juridische pages, e-mails van spec 11, seed-vacatures):

1. Draai `npm run check -- --warn` (TODO's) en `npm run check:claims` (claims en
   vacatureregels).
2. Loop elke treffer langs de tabel hieronder en kies: laten staan (de claim is
   bevestigd en hier vastgelegd), herschrijven naar de toegestane vorm, of
   markeren met `TODO`.
3. Een bevestiging van Jimmy of Lorenzo legt Djulan hier vast (datum, wie, bron)
   en, als het een besluit is, in de beslissingslog van spec 00.
4. Vacatures in de database loopt Djulan na bij de eerste vijf echte vacatures;
   daarna houden Jimmy en Lorenzo zich aan de vacatureregels VR-01 tot en met
   VR-15 (spec 09 §6.8).

Status: `open` (nog niet bevestigd, alleen de toegestane vorm gebruiken),
`bevestigd` of `afgewezen`.

| Id | Onderwerp | Nu toegestaan | Niet toegestaan tot bevestiging | Bevestigt | Status | Datum | Wie | Bron |
|---|---|---|---|---|---|---|---|---|
| CL-01 | Keurmerken (SNA, NEN 4400-1, VCU) | niets | elk keurmerk, logo of "gecertificeerd" | Jimmy en Lorenzo, met registerlink | open | | | |
| CL-02 | Brancheorganisatie (ABU, NBBU) | niets | "lid van", "aangesloten bij" | Jimmy en Lorenzo | open | | | |
| CL-03 | Cao | gelijkwaardige beloning (art. 8 Waadi, B-24) | "volgens de cao", cao-namen als toepasselijk | Jimmy, Lorenzo, jurist | open | | | |
| CL-04 | Wtta-status, toelating, registernummer | alleen via `WttaStatus` en `/werkgevers/wtta` | elke andere vermelding | Jimmy en Lorenzo (`WTTA` in `lib/legal.ts`) | open (fase `preparing`) | | | |
| CL-05 | Reactietermijn | klachtenregeling: vijf werkdagen (B-10) | "binnen één werkdag", "binnen 24 uur", "direct antwoord" | Jimmy en Lorenzo | open | | | |
| CL-06 | Bereikbaarheid | kantoortijden zodra bevestigd (B-22) | "24/7", "dag en nacht", "altijd bereikbaar" | Jimmy en Lorenzo | open | | | |
| CL-07 | Cijfers | vijf beroepen, twee vaste contactpersonen, Den Haag (B-26) | aantallen kandidaten, plaatsingen, opdrachtgevers, jaren ervaring | Jimmy en Lorenzo | open | | | |
| CL-08 | Klantnamen, logo's, citaten, reviews | niets | elke naam of quote zonder schriftelijke toestemming | Jimmy en Lorenzo | open | | | |
| CL-09 | Snelheid van levering | niets | "vandaag nog personeel", "binnen een dag iemand" | Jimmy en Lorenzo | open | | | |
| CL-10 | Uitbetaling | niets | "wekelijks uitbetaald" | Jimmy en Lorenzo | open | | | |
| CL-11 | Opleidingen die Groos regelt of betaalt | niets | "wij regelen je VCA", "gratis heftruckcursus" | Jimmy en Lorenzo | open | | | |
| CL-12 | Gratis inschrijven en solliciteren | altijd (art. 9 Waadi) | n.v.t. | n.v.t. | bevestigd (wettelijk) | 2026-10-02 | spec 09 | art. 9 Waadi |
| CL-13 | "Geen ervaring nodig" | per vacature als het klopt | bij werken op hoogte zonder geregelde training | Jimmy of Lorenzo per vacature | open | | | |
| CL-14 | Werkgebied | Den Haag en omgeving | "heel Nederland", "landelijk" | Jimmy en Lorenzo | open | | | |
| CL-15 | Relatie met J. Versseput | niets (B-26) | elke vermelding | Jimmy | open | | | |
| CL-16 | Superlatieven | niets | "de beste", "nummer 1", "goedkoopste" | n.v.t. | vast | | | |
| CL-17 | Gelijke behandeling | de zin uit spec 09 §6.8 | n.v.t. | n.v.t. | vast | | | |
| CL-18 | Dienstvormen | uitzenden | detacheren, werving en selectie, payrolling | Jimmy en Lorenzo | open | | | |
| CL-19 | Huisvesting en vervoer | niets | "huisvesting geregeld", "vervoer van en naar het werk" | Jimmy en Lorenzo | open | | | |
| CL-20 | Talen die Groos spreekt | Nederlands, Engels | andere talen | Jimmy en Lorenzo | open | | | |
| CL-21 | Kantoor en bezoek | "bezoek op afspraak" (B-23) | "loop gerust binnen" | Jimmy | open | | | |
| CL-22 | G-rekening, verzekeringen, VOG | niets | "wij hebben een g-rekening", "volledig verzekerd" | Jimmy en Lorenzo | open | | | |

## Open punten uit de juridische teksten (stand 2 oktober 2026)

| Onderwerp | Waar | Bevestigt |
|---|---|---|
| Concepten versie 0.1 van privacyverklaring, cookieverklaring en klachtenregeling | `app/[locale]/{privacyverklaring,cookieverklaring,klachtenregeling}/page.tsx`, `lib/legal.ts` | jurist |
| Termijnen klachtenregeling (vijf werkdagen, vier weken) | `app/[locale]/klachtenregeling/page.tsx` | Jimmy en Lorenzo |
| Tekst algemene voorwaarden | `app/[locale]/algemene-voorwaarden/page.tsx` | Jimmy of jurist |
| Wtta-fase `preparing` | `lib/legal.ts` | Jimmy en Lorenzo |
| KvK- en btw-nummer | `lib/site.ts` | Jimmy |
| Naam salarisadministratie | privacyverklaring artikel 5 en 10 | Jimmy en Lorenzo |
| Juridische naam ontwikkelaar (Sinka B.V.) | privacyverklaring artikel 10, `verwerkersovereenkomsten.md` | Djulan |
| Maximale duur Supabase-sessiecookie | cookieverklaring artikel 2 | bouw-agent (waarneming) |
| BotID zonder cookies | cookieverklaring artikel 4 | Djulan (eerste preview-deploy) |
