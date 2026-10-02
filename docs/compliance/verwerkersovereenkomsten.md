# Verwerkers en verwerkersovereenkomsten

Opgesteld volgens spec 09 §5.5. Dit is de enige plek voor de status van de
verwerkersovereenkomsten; spec 13 verwijst hiernaar. Djulan houdt de status bij,
Jimmy tekent. Alle productieaccounts staan op naam van Groos (B-12).

Status: `open`, `aangevraagd` of `getekend (datum)`. Vóór de productie-livegang
(bouwstap 10) staat bij Supabase, Vercel, Resend, STRATO en de ontwikkelaar
"getekend" met datum (AC-09-25). Er komen geen echte persoonsgegevens in
productie zolang een overeenkomst open staat (E-09-19).

| Verwerker | Wat | Locatie en doorgifte | Overeenkomst en hoe | Wie tekent | Uiterlijk | Status |
|---|---|---|---|---|---|---|
| Supabase Inc. | Database, Auth, Storage: alle formuliergegevens, cv's, beheerdersaccounts | Project in eu-central-1 (Frankfurt). Toegang vanuit de VS bij ondersteuning mogelijk; standaardcontractbepalingen in de DPA | DPA van Supabase (supabase.com/legal/dpa). Het project ontstaat via de Vercel Marketplace (B-12): controleren of de DPA dan ook geldt en zo nodig een getekend exemplaar aanvragen via het Supabase-dashboard | Jimmy, als eigenaar van de organisatie | vóór de eerste echte sollicitatie in productie (bouwstap 10) | open |
| Vercel Inc. | Hosting, functies, logs, BotID, Web Analytics | Wereldwijd netwerk; functieregio volgens spec 13; EU-VS Data Privacy Framework of standaardcontractbepalingen volgens de DPA | DPA van Vercel (vercel.com/legal/dpa), onderdeel van de voorwaarden van het Pro-account | Jimmy, als eigenaar van het Vercel-account | bij het aanmaken van het Pro-account | open |
| Resend | Versturen van bevestigingen, meldingen en Auth-mails | Verzendregio eu-west-1 (Ierland); Amerikaans bedrijf; doorgifte volgens de DPA | DPA van Resend (resend.com/legal/dpa); juridische entiteit controleren (TODO) | Jimmy, als eigenaar van het Resend-account | vóór de eerste echte mail | open |
| STRATO AG | Domein, DNS, mailboxen `info@` met meldingsmails en correspondentie | Duitsland, binnen de EU | Overeenkomst voor verwerking in opdracht in het STRATO-klantenpaneel | Jimmy, als houder van het domein | direct | open |
| Ontwikkelaar: Sinka B.V. (handelsnaam SKUU; TODO juridische naam bevestigen, 00 §7 punt 6) | Bouw en technisch beheer; toegang tot Supabase, Vercel en Resend; uitvoeren van privacyverzoeken in fase 1 | Nederland | Verwerkersovereenkomst op basis van een model (bijvoorbeeld NLdigital). Vastleggen: alleen op instructie van Groos, geheimhouding, geen kopieën van productiedata op eigen apparaten, datalekmelding aan Groos binnen 24 uur | Jimmy namens Groos en Djulan namens de ontwikkelaar | vóór de ontwikkelaar productietoegang krijgt | open |
| Salarisadministratie of backoffice (TODO naam) | Loonadministratie uitzendkrachten | TODO | DPA van de leverancier | Jimmy | vóór de eerste uitzendkracht | open |
| Boekhouder (TODO naam) | Facturen en administratie | TODO | DPA of opdrachtbevestiging met verwerkersclausule | Jimmy | vóór de eerste factuur | open |

## Geen verwerker, met reden

- **GitHub**: de repo bevat geen persoonsgegevens. Regel: geen echte namen,
  adressen of cv's in code, seed, tests, issues of commits.
- **Supabase-organisatie Groos Personeelsdiensten** (gratis plan, eigenaar
  Djulan) met project `groos-dev` (B-12): alleen fictieve gegevens (E-09-22).
  Testmail gaat naar `delivered@resend.dev` of naar eigen adressen van Djulan.
- **WhatsApp (Meta)**: Jimmy en Lorenzo gebruiken het als communicatiemiddel. De
  jurist beoordeelt de rol en of WhatsApp Business met zakelijke voorwaarden
  nodig is (TODO jurist).
- **Google Bedrijfsprofiel**: bevat geen gegevens van kandidaten.

## Organisatorisch

In Supabase, Vercel en Resend staat het e-mailadres van Jimmy als eigenaar en dat
van Djulan als lid, zodat beveiligingsmeldingen van leveranciers bij beiden
aankomen (spec 13). Een melding van een verwerker over een datalek start de
procedure in [procedures.md](procedures.md#procedure-bij-een-datalek).

## Logboek

| Datum | Verwerker | Wijziging | Door |
|---|---|---|---|
| 2026-10-02 | alle | Document aangemaakt, alle statussen open | bouw-agent spec 09 |
