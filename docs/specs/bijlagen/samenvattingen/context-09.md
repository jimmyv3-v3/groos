## Feiten

- Peildatum 2 oktober 2026; geen juridisch advies.
- Wtta: in werking 2027, handhaving 2028. Aanmelden overgangsregeling november en december 2026, toelating aanvragen mei en juni 2027, openbaar NAU-register vanaf 1 juli 2027. Waarborgsom € 100.000, starters € 50.000, plus VOG RP en inspectierapport of SNA-keurmerk.
- Waadi-registratie bij KvK verplicht tot 2028; ID-kopie maximaal 4 weken (art. 7c); geen kosten voor de uitzendkracht (art. 9).
- Cao voor Uitzendkrachten geldt alleen voor ABU- en NBBU-leden; AVV-besluit onbekend. Anders gelden art. 8 Waadi en het wettelijk regime. Lidmaatschap pas na SNA, dat drie maanden uitleenactiviteit vraagt.
- Wet meer zekerheid flexwerkers: gelijkwaardige arbeidsvoorwaarden per 31 december 2026, geen nuluren per 2028.
- AVG: verwerkers Supabase, Vercel, e-mailprovider en analytics, elk met DPA. Grondslag sollicitatie: precontractueel of gerechtvaardigd belang; talentpool en meldingen: toestemming. Bewaren 4 weken, met toestemming 1 jaar, automatisch verwijderen.
- Cookies: functioneel en privacyvriendelijke analytics zonder toestemming; marketingpixels met banner.
- AI Act: hoog-risico-plichten pas 2 december 2027; art. 22 AVG verbiedt automatische afwijzing.
- Discriminatieverbod geldt onverkort; minimumleeftijd 18 mag met arbo-reden. Minimumuurloon 21+ € 14,99.
- Verplicht op de site (art. 3:15d BW): naam met B.V., adres, e-mail, KvK, btw, privacyverklaring. Wenselijk: cookieverklaring, voorwaarden, klachtenregeling, Wtta-status, salaris per vacature.

## Besluiten en voorstellen (met wie moet bevestigen)

- Wtta-status, keurmerken en cao alleen tonen als ze gelden, met copy per fase (Jimmy en Lorenzo).
- Nooit online BSN of ID vragen; identificatie bij intake (team).
- Formulier: naam, contact, woonplaats, beroep, beschikbaarheid, werkrechtvraag, cv optioneel; geen nationaliteit, geboortedatum, pasfoto of gezondheid (jurist).
- Drie losse vakjes, niet vooraf aangevinkt: kennisname privacyverklaring, talentpool 1 jaar, vacaturemeldingen (jurist).
- Cv-opslag: EU-regio, private bucket, RLS, signed URLs, whitelist, UUID-namen, nooit als mailbijlage (team).
- Cookieloze analytics zonder banner, wel cookieverklaring (Jimmy en Lorenzo).
- Menselijke beoordeling, bruto uurloon per vacature, geen nulurenbeloftes, discriminerende verzoeken weigeren, voorkeur NBBU (Jimmy en Lorenzo).

## Aannames in het document

- De AP-lijn van 4 weken en 1 jaar: secundaire bronnen (AP-pagina's gaven 403).
- Bewaartermijn voor actief ingeschreven werkzoekenden: aanname.
- Toelatingsnummer in de footer: interpretatie van art. 3:15d BW.
- Een net gestart bureau kan zich aanmelden voor de overgangsregeling.
- Boetebedragen, lidmaatschapskosten (2018) en de verlenging voor Oekraïners: secundaire bronnen.
- Btw-verlegging geldt waarschijnlijk niet voor logistiek en verhuizen; StiPP en bpfBOUW ongecheckt.

## Open vragen (sectie "Te verifiëren" en wat je zelf ziet)

Veertien verificatiepunten in het document (starters en overgangsregeling, kosten en boetes, toelatingsnummer, AVV, pensioen, bewaartermijnen, woonadres) en een checklist voor Jimmy en Lorenzo (registratie, Wtta-route, cao, fiscaal, verzekeringen, huisvesting, opleidingen, AI, tooling).

Wat ik zelf zie:

- Web3Forms, Resend en BotID ontbreken bij de verwerkers; context/11 wil BotID in de privacyverklaring.
- Of `/cookieverklaring` bij lancering bestaat zonder cookies.
- Wie voorwaarden en klachtenregeling schrijft en wanneer.
- Inschrijven zonder vacature heeft nog geen bewaartermijn.

## Relevant voor specs (per modulenummer uit docs/HANDOVER.md §4)

- 01: juridische routes, `/werkgevers/wtta`, footer met B.V., adres, KvK, btw, Wtta-status.
- 03 en 05: schrijfregels (geen leeftijd, gender of vage fysieke termen, 18+ met reden, altijd uurloon).
- 06: salaris verplicht, eerlijk contracttype, minimumleeftijd.
- 07: dataminimalisatie, drie vakjes, werkrechtvraag, cv optioneel.
- 08: inzagelogging, verwijderverzoeken, menselijke beoordeling.
- 09: privacyverklaring, cookieverklaring, voorwaarden, klachtenregeling, Wtta-copy.
- 10: EU-regio, private bucket, RLS, signed URLs, retentie-automatisering.
- 11: toestemming vacaturemeldingen, geen cv als bijlage.
- 12: `baseSalary` in JobPosting, NAU-registerlink.
- 13: DPA's, EU-regio's, verwerkingsregister.
- 14: WCAG 2.1 AA, acceptatietest footer en vinkjes.
- 15: jobalert met dubbele opt-in, AI-transparantie.

## Tegenstrijdigheden (met docs/HANDOVER.md, docs/HANDOVER-2.md, CLAUDE.md of andere contextbestanden die je kent)

- Privacyvinkje: 09 wil een kennisnamevinkje, context/11 alleen informatietekst, context/08 een toestemmingsvinkje.
- Cao: context/01 presenteert de uitzend-cao als geldend, context/10 en 08 stellen "volgens de cao" voor; 09 staat dat alleen toe bij lidmaatschap of AVV.
- Functie-eisen: context/01 noemt "fysiek sterk", VCA en rijbewijs als standaard; 09 wil alleen objectieve, noodzakelijke eisen.
- Overgangsregeling: context/01 beperkt die tot uitleners zonder SNA; 09 noemt alle bestaande uitleners.
- Verwerkers: 09 mist Web3Forms, waarmee HANDOVER en BOUWINSTRUCTIE bij vroege livegang rekenen.
- Kantoor: context/11 maakt Hugo Coenraadspad 6 standaard uitnodigingslocatie; 09 en HANDOVER-2 zien een woning met bezoek op afspraak.
- Geen conflict met CLAUDE.md.
