# Verwerkingsregister Groos Personeelsdiensten

Register van verwerkingsactiviteiten (art. 30 AVG), opgesteld volgens spec 09
§5.4. Dit document bevat geen persoonsgegevens en mag daarom in de repo staan.
Djulan houdt het bij; Jimmy is verantwoordelijk voor de inhoud.

Stand: concept 0.1 van 2 oktober 2026, ter toetsing door de jurist.

## Verwerkingsverantwoordelijke

| Onderdeel | Gegevens |
|---|---|
| Naam | Groos Personeelsdiensten B.V. |
| Adres | Hugo Coenraadspad 6, 2553 ER Den Haag |
| KvK | TODO KvK-nummer (Jimmy) |
| Contact | info@groospersoneelsdiensten.nl, onderwerp "Privacy" |
| Aanspreekpunt | Jimmy (bestuurder, TODO bevestigen), met Lorenzo als vervanger |
| Functionaris gegevensbescherming | Geen; niet verplicht bij deze schaal (TODO jurist bevestigt) |

Doorgifte buiten de EU staat per verwerker in
[verwerkersovereenkomsten.md](verwerkersovereenkomsten.md). Beveiliging staat in
artikel 13 van de privacyverklaring en in spec 10 (RLS, MFA, privébucket).
Bewaartermijnen volgen spec 09 §5.3 en B-07; de privacyverklaring (artikel 12)
gebruikt exact dezelfde termijnen.

## Verwerkingen

| Nr | Verwerking | Doel en grondslag | Betrokkenen en gegevens | Ontvangers en verwerkers | Bewaartermijn |
|---|---|---|---|---|---|
| V-01 | Sollicitaties via de website | Sollicitatie behandelen; art. 6 lid 1 b, na afronding f | Werkzoekenden: naam, telefoon, e-mail, woonplaats, werkrecht ja of nee, rijbewijs B, beschikbaarheid, bericht, cv | Jimmy, Lorenzo; opdrachtgever na overleg; Supabase, Vercel, Resend, STRATO, ontwikkelaar | 4 weken na afronding; zie spec 09 §5.3 |
| V-02 | Talentpool | Benaderen voor ander werk; art. 6 lid 1 a | Als V-01, plus moment en bron van toestemming | Als V-01 | 1 jaar na afronding |
| V-03 | Inschrijvingen (`/inschrijven`) | Passend werk zoeken en benaderen; art. 6 lid 1 a | Als V-01, plus gewenste beroepen | Als V-01 | maximaal 1 jaar, eerder bij 12 weken zonder contact |
| V-04 | Personeelsaanvragen | Aanvraag, offerte, samenwerking; art. 6 lid 1 b en f | Contactpersonen opdrachtgevers: naam, telefoon, e-mail, bedrijfsgegevens, KvK | Jimmy, Lorenzo; Supabase, Vercel, Resend, STRATO, ontwikkelaar | 2 jaar |
| V-05 | Contactberichten | Vraag beantwoorden; art. 6 lid 1 f | Afzenders: naam, e-mail of telefoon, onderwerp, bericht | Als V-04 | 6 maanden; spam 30 dagen |
| V-06 | Contact per telefoon, WhatsApp en e-mail | Bereikbaarheid; art. 6 lid 1 b en f | Iedereen die contact opneemt: naam, nummer, inhoud | Jimmy, Lorenzo; STRATO (mail); WhatsApp (Meta, rol TODO jurist) | als de verwerking waar het bij hoort |
| V-07 | Bevestigings- en meldingsmails | Ontvangst bevestigen, beheerders informeren; art. 6 lid 1 b en f | Ontvangers: e-mailadres, naam; `email_log` met gehasht adres zonder inhoud | Resend, STRATO | `email_log` 90 dagen; mailbox 4 weken |
| V-08 | Beheeromgeving | Beveiligde toegang en verantwoording; art. 6 lid 1 f | Beheerders: naam, e-mail, wachtwoordhash, TOTP-factor, sessies, `audit_log` met gehasht IP | Supabase, Vercel, ontwikkelaar | `audit_log` 2 jaar; account zolang actief |
| V-09 | Contactpersoon bij vacatures | Kandidaten een vast aanspreekpunt geven; art. 6 lid 1 f, met instemming van Jimmy en Lorenzo | Jimmy en Lorenzo: voornaam, telefoon, WhatsApp, eventueel foto | Openbaar op de site; Supabase, Vercel | zolang zij beheerder zijn |
| V-10 | Beveiliging van de website | Misbruik en spam voorkomen; art. 6 lid 1 f | Bezoekers: IP-adres voor rate limiting per IP-adres (Vercel Firewall, spec 13 §5.6), browserkenmerken (BotID), honeypot en invultijd, tijdstippen | Vercel | volgens Vercel (TODO termijn logs controleren) |
| V-11 | Websitestatistieken | Gebruik meten zonder cookies; art. 6 lid 1 f | Bezoekers: paginabezoek zonder identificatie, conversie-events zonder persoonsgegevens | Vercel | geaggregeerd |
| V-12 | Intake en identificatie | Wettelijke identificatie en werkrecht; art. 6 lid 1 c (art. 7c Waadi, Wav, Wet LB) | Kandidaten: ID-kopie, BSN, werkvergunning | Jimmy, Lorenzo; salarisadministratie TODO | 4 weken als niet in dienst |
| V-13 | Personeels- en loonadministratie | Arbeidsovereenkomst en loon; art. 6 lid 1 b en c | Uitzendkrachten: NAW, BSN, bank, uren, loon, contracten | Salarisadministratie TODO, Belastingdienst, UWV, opdrachtgever (uren) | 7 jaar |
| V-14 | Opdrachtgeversadministratie | Offertes, contracten, facturen; art. 6 lid 1 b en c | Contactpersonen opdrachtgevers | Boekhouder TODO | 7 jaar |
| V-15 | Klachten | Klacht behandelen; art. 6 lid 1 f | Indieners en betrokkenen: naam, contact, inhoud klacht | Jimmy, Lorenzo | 1 jaar na afhandeling |
| V-16 | Verzoeken en datalekken | Verantwoording AVG; art. 6 lid 1 c | Verzoekers: naam, contact, soort verzoek; datalekken: beschrijving zonder onnodige persoonsgegevens | Jimmy, Lorenzo, ontwikkelaar; AP bij melding | 2 en 5 jaar |

## Bewaartermijnen in detail (spec 09 §5.3)

| Gegevens | Termijn | Start | Wat er gebeurt |
|---|---|---|---|
| Sollicitatie op een vacature zonder talentpool | 4 weken | `completed_at` (status `placed`, `rejected` of `withdrawn`) | Cv uit bucket `cvs` en record verwijderd of geanonimiseerd (keuze spec 10) |
| Sollicitatie met talentpooltoestemming | 1 jaar | `completed_at` | idem |
| Sollicitatie of inschrijving zonder contact | herinnering na 8 weken; automatisch afgesloten na 12 weken; daarna 4 weken | `last_contact_at` of `created_at` | na 12 weken `rejected` of `withdrawn`; 28 dagen later geanonimiseerd, cv verwijderd |
| Inschrijving via `/inschrijven` | 365 dagen na toestemming, of 28 dagen na afsluiten als dat eerder is | `retention_consent_at`; `completed_at` | Geanonimiseerd en cv verwijderd |
| Cv-upload zonder sollicitatie (`pending/`) | 24 uur | upload | Bestand verwijderd |
| Personeelsaanvraag | 2 jaar | laatste statuswijziging | Verwijderd |
| Contactbericht | 6 maanden; spam 30 dagen | `answered` of `archived`; `spam` | Verwijderd |
| `email_log` | 90 dagen | verzending | Verwijderd |
| `audit_log` | 2 jaar | gebeurtenis | Verwijderd |
| Back-ups Supabase | 7 dagen | back-up | Overschreven door Supabase (Pro) |
| Meldingsmails in `info@` | 4 weken | ontvangst | Handmatig: maandelijks opruimen in de map "Website" |
| Klachtdossier | 1 jaar | afhandeling | Handmatig |
| Verzoekenregister | 2 jaar | afhandeling | Handmatig |
| Datalekregister | 5 jaar | registratie | Handmatig |
| Kopie ID bij intake, niet in dienst | maximaal 4 weken | opname | Vernietigd (buiten de website) |
| Personeels- en loonadministratie | 7 jaar (fiscaal); ID-kopie werknemer 5 jaar na einde dienstverband | einde dienstverband | Buiten de website |

De termijnen voor meldingsmails, klachtdossier, verzoekenregister en
datalekregister zijn een aanvulling op B-07 (TODO Jimmy, Lorenzo en jurist
bevestigen).
