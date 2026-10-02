# Privacyprocedures (fase 1, handmatig)

Opgesteld volgens spec 09 §5.6 tot en met §5.8. In fase 1 zijn er geen
beheerschermen voor privacyverzoeken (B-19); alles loopt volgens deze werkwijze.
Bewaartermijnen staan in [verwerkingsregister.md](verwerkingsregister.md), de
verwerkers in [verwerkersovereenkomsten.md](verwerkersovereenkomsten.md).

## Rollen

| Wie | Rol |
|---|---|
| Jimmy | Verantwoordelijk; ontvangt, beslist, antwoordt en registreert |
| Lorenzo | Vervangt Jimmy; behandelt klachten over Jimmy |
| Djulan (ontwikkelaar) | Voert technische stappen uit binnen vijf werkdagen na een vraag van Jimmy |
| Jurist | Adviseert bij bezwaar, beperking en twijfel over een melding |

## Procedure voor verzoeken van betrokkenen

De wettelijke termijn is één maand na ontvangst, met twee maanden verlenging bij
complexe verzoeken als de verzoeker dat binnen de eerste maand hoort (art. 12
lid 3 AVG).

1. **Ontvangen en registreren (dag 0).** Een verzoek kan binnenkomen per mail,
   telefoon, post of WhatsApp. Wie het ontvangt, zet het dezelfde dag in het
   verzoekenregister met datum, soort, kanaal, naam, contactgegeven en uiterste
   datum (ontvangst plus een maand).
2. **Bevestigen en controleren (binnen 3 werkdagen).** Jimmy bevestigt de
   ontvangst en controleert de identiteit via een kanaal dat al bekend is:
   terugbellen op het bekende nummer of antwoorden op het bekende e-mailadres.
   Nooit om een kopie van een identiteitsbewijs vragen.
3. **Gegevens zoeken.** Djulan zoekt in de productiedatabase via de SQL-editor
   van het Supabase-dashboard, met de kolomnamen van spec 10:

   ```sql
   -- vervang beide waarden; telefoon in E.164, bijvoorbeeld +31612345678
   select 'application' as soort, id, created_at, status, first_name, last_name, email, phone_e164, cv_path
     from applications where lower(email) = lower('naam@voorbeeld.nl') or phone_e164 = '+31612345678';
   select 'staff_request' as soort, id, created_at, status, contact_name, email, phone_e164
     from staff_requests where lower(email) = lower('naam@voorbeeld.nl') or phone_e164 = '+31612345678';
   select 'contact_message' as soort, id, created_at, status, name, email, phone_e164
     from contact_messages where lower(email) = lower('naam@voorbeeld.nl') or phone_e164 = '+31612345678';
   select * from activities where entity_id in ('<id uit de queries hierboven>');
   ```

   Jimmy en Lorenzo zoeken zelf in de mailbox `info@` en in WhatsApp.
   `email_log` bevat geen inhoud en alleen gehashte adressen; die vervalt na 90
   dagen en hoeft niet te worden opgezocht.
4. **Uitvoeren per soort verzoek.**
   - *Inzage of overdraagbaarheid*: Djulan exporteert de rijen als JSON en
     downloadt eventuele cv's via het Storage-scherm. Jimmy stuurt het overzicht
     aan het bekende adres, als pdf of JSON, zonder gegevens van anderen.
   - *Correctie*: Jimmy past het aan in `/beheer` als het veld daar bewerkbaar
     is; anders Djulan via SQL.
   - *Verwijdering*: eerst de cv-bestanden verwijderen via de Storage API of het
     Storage-scherm (nooit met SQL in `storage.objects`, context/11 §7.3), daarna
     de rijen in `activities` en de hoofdtabel. Djulan voegt een regel toe aan
     `audit_log` met actie `privacy.erased`, het soort record en het id, zonder
     persoonsgegevens. Jimmy en Lorenzo verwijderen bijbehorende mails en
     WhatsApp-gesprekken. Gegevens die de wet laat bewaren (loonadministratie,
     facturen) blijven staan; dat staat in het antwoord.
   - *Intrekken van talentpooltoestemming*: Djulan zet `retention_consent` op
     false, waarna spec 10 `retain_until` opnieuw berekent. Bij een inschrijving
     betekent intrekken verwijderen.
   - *Bezwaar of beperking*: Jimmy beoordeelt het met de jurist als het niet
     eenvoudig is.
5. **Antwoorden (uiterlijk de datum uit stap 1).** Jimmy antwoordt schriftelijk
   wat er is gedaan, met de vermelding dat reservekopieën na zeven dagen zijn
   verdwenen.
6. **Afsluiten.** Het register krijgt de datum van afhandeling en wat er is
   gedaan.

## Procedure bij een datalek

Een datalek is elke inbreuk waarbij persoonsgegevens verloren gaan of bij iemand
terechtkomen die ze niet mag zien. Voorbeelden: een telefoon of laptop met een
actieve beheersessie raakt kwijt, een mail met kandidaatgegevens gaat naar de
verkeerde persoon, een sleutel zoals `SUPABASE_SECRET_KEY` komt in een commit of
chat terecht, een beheerdersaccount wordt overgenomen, of een leverancier meldt
een eigen lek.

| Stap | Wanneer | Wie | Wat |
|---|---|---|---|
| 1 Melden | direct | wie het ontdekt | Belt Jimmy en Djulan (Lorenzo als Jimmy onbereikbaar is) en noteert het tijdstip van ontdekking; dat is het begin van de 72 uur. |
| 2 Inperken | binnen enkele uren | Djulan | Sessies intrekken en het account blokkeren (`admin_profiles.is_active = false`, uitloggen in Supabase Auth, TOTP-factor resetten); gelekte sleutels roteren (`SUPABASE_SECRET_KEY`, `RESEND_API_KEY`, `CRON_SECRET`) in Supabase, Resend en Vercel en opnieuw deployen. Bij een verkeerd verstuurde mail vraagt Jimmy de ontvanger de mail te verwijderen en dat te bevestigen. |
| 3 Beoordelen | binnen 24 uur | Jimmy en Djulan | Welke gegevens, van hoeveel mensen, hoe gevoelig (cv's en contactgegevens tellen zwaar), en is het risico voor die mensen klein of groot. Gebruik de uitleg van de AP over de meldplicht datalekken. |
| 4 Melden bij de AP | binnen 72 uur na ontdekking | Jimmy, met technische informatie van Djulan | Via het meldloket datalekken op autoriteitpersoonsgegevens.nl, tenzij het lek waarschijnlijk geen risico oplevert. Is nog niet alles bekend, dan toch melden en later aanvullen. |
| 5 Betrokkenen informeren | zonder onnodige vertraging, bij groot risico | Jimmy | Per mail of telefoon in gewone taal: wat er is gebeurd, welke gegevens, wat Groos heeft gedaan en wat zij zelf kunnen doen. |
| 6 Vastleggen | altijd, ook zonder melding | Jimmy | In het datalekregister: datum ontdekking, beschrijving, soorten gegevens, aantal betrokkenen, gevolgen, maatregelen, wel of niet gemeld en waarom. |
| 7 Evalueren | binnen 2 weken | Jimmy en Djulan | Wat voorkomt herhaling; vastleggen in het register. |

Een verwerker meldt een lek aan Groos volgens zijn DPA; die melding komt binnen
op het eigenaarsadres van Jimmy en bij Djulan en start dezelfde procedure.

## Klachten

Klachten volgen de [klachtenregeling](/klachtenregeling) op de site: een
inhoudelijke reactie binnen vijf werkdagen, een eindreactie uiterlijk vier weken
na ontvangst (TODO Jimmy en Lorenzo bevestigen, B-10). Jimmy of Lorenzo
behandelt de klacht; gaat de klacht over een van hen, dan behandelt de ander
hem. Elke klacht komt in het klachtenregister.

## Registers buiten de code

Het verzoekenregister, het datalekregister en het klachtenregister bevatten
persoonsgegevens. Ze staan daarom niet in de repo en in fase 1 niet in Supabase,
maar in één spreadsheet "Groos privacyregisters" met drie tabbladen in een eigen
opslag van Groos (TODO Jimmy: welke dienst), alleen toegankelijk voor Jimmy en
Lorenzo.

### Sjabloon tabblad Verzoeken

| nummer | ontvangen op | kanaal | soort (inzage, correctie, verwijdering, bezwaar, beperking, overdracht, intrekken) | naam | contactgegeven | identiteit gecontroleerd via | uiterste datum | behandelaar | afgehandeld op | wat gedaan |
|---|---|---|---|---|---|---|---|---|---|---|

### Sjabloon tabblad Datalekken

| nummer | ontdekt op | ontdekt door | beschrijving | soorten gegevens | aantal betrokkenen | risico | maatregelen | gemeld bij AP (datum en meldnummer of reden van niet melden) | betrokkenen geïnformeerd | evaluatie |
|---|---|---|---|---|---|---|---|---|---|---|

### Sjabloon tabblad Klachten

| nummer | ontvangen op | kanaal | naam en contact | onderwerp | behandelaar | reactie verstuurd op | uitkomst | afgehandeld op |
|---|---|---|---|---|---|---|---|---|

## Waarneming van cookies en opslag

De cookietabel in de cookieverklaring berust op een waarneming in de browser
(spec 09 §10 blok B stap 4). Vercel Web Analytics en BotID draaien niet in
ontwikkeling. Herhaal de waarneming daarom op de eerste preview-deploy (spec 13):

1. Open `/`, `/vacatures`, een vacature, `/inschrijven`, `/contact` en
   `/privacyverklaring`, in beide talen.
2. Lees na het laden `document.cookie`, `Object.keys(localStorage)` en
   `Object.keys(sessionStorage)` uit en controleer met `curl -sI` op `Set-Cookie`.
3. Controleer met de netwerkweergave dat er geen verzoeken gaan naar andere
   domeinen dan het eigen domein, Supabase (alleen bij een cv-upload) en
   `/_vercel/*`.
4. Log in op `/beheer` met het testaccount en noteer naam en `Max-Age` of
   `Expires` van de Supabase-cookies.
5. Pas de cookietabel aan (`app/[locale]/cookieverklaring/page.tsx`), verwijder
   de TODO's daar als alles bekend is, en verhoog de versie in `lib/legal.ts`.
   Verschijnt er een cookie die niet functioneel is, stop dan en leg het aan
   Djulan voor, omdat B-09 dan niet meer klopt.

| Datum | Omgeving | Waargenomen | Door |
|---|---|---|---|
| (volgt) | eerste preview-deploy | | |
