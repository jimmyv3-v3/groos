// TODO (jurist): concepttekst versie 0.1, laten toetsen vóór livegang (spec 09 §12).
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { contact } from "@/lib/site";
import { resolveLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/seo";
import { getLegalDoc } from "@/lib/legal";
import { LegalPage, pickLegal, type LegalContent } from "@/components/legal/legal-page";

// Tekst uit spec 09 §6.4; ankers zijn gelijk in nl en en, zodat formulieren
// (spec 07) en e-mails (spec 11) ernaar kunnen linken. Bedrijfsgegevens komen
// uit lib/site.ts.

const KVK_NL = contact.kvk ?? "TODO KvK-nummer";
const KVK_EN = contact.kvk ?? "TODO Chamber of Commerce number";
const MAIL = `[${contact.email}](${contact.emailHref})`;
const PHONE = `[${contact.phone}](${contact.phoneHref})`;

const CONTENT: { nl: LegalContent; en: LegalContent } = {
  nl: {
    title: "Privacyverklaring",
    metaDescription:
      "Lees welke gegevens Groos Personeelsdiensten verwerkt als u solliciteert, personeel aanvraagt of contact opneemt. U leest ook hoe lang wij ze bewaren.",
    intro:
      "Groos Personeelsdiensten gebruikt gegevens van werkzoekenden, uitzendkrachten en opdrachtgevers. Hier staat welke gegevens dat zijn, waarvoor wij ze gebruiken, hoe lang wij ze bewaren en welke rechten u heeft.",
    sections: [
      {
        id: "wie-wij-zijn",
        heading: "Wie wij zijn",
        blocks: [
          "Groos Personeelsdiensten B.V. bepaalt waarvoor en hoe de persoonsgegevens in deze verklaring worden gebruikt. Wij zijn een uitzendbureau in Den Haag en werken met werkzoekenden, uitzendkrachten en opdrachtgevers.",
          {
            list: [
              `${contact.name}, ${contact.street}, ${contact.postalCode} ${contact.city}`,
              `KvK-nummer ${KVK_NL}`,
              `E-mail: ${MAIL}`,
              `Telefoon: ${PHONE}`,
            ],
          },
          "Wij hebben geen functionaris voor gegevensbescherming, omdat dat voor ons niet verplicht is. Jimmy en Lorenzo zijn het aanspreekpunt voor alle vragen over privacy.",
        ],
      },
      {
        id: "voor-wie",
        heading: "Voor wie deze verklaring geldt",
        blocks: [
          "Deze verklaring geldt voor iedereen van wie wij gegevens gebruiken, via de website of via e-mail, telefoon en WhatsApp. Dat zijn werkzoekenden, uitzendkrachten, contactpersonen bij opdrachtgevers en andere mensen die contact met ons opnemen.",
          "De artikelen voor werkzoekenden zijn informeel geschreven. In de andere artikelen spreken wij u aan met u.",
        ],
      },
      {
        id: "solliciteren",
        heading: "Als je solliciteert op een vacature",
        blocks: [
          "Solliciteer je via onze website, dan vragen wij je naam, telefoonnummer, e-mailadres en woonplaats. Ook vragen wij of je in Nederland mag werken.",
          "Je kunt zelf meer sturen, zoals je cv, een bericht en de datum waarop je kunt beginnen. Vraagt de vacature om een rijbewijs, dan vragen wij ook of je rijbewijs B hebt.",
          "Via de website vragen wij nooit om:",
          {
            list: [
              "je burgerservicenummer (BSN);",
              "een kopie van je identiteitsbewijs;",
              "je geboortedatum of nationaliteit;",
              "een foto van jezelf;",
              "gegevens over je gezondheid.",
            ],
          },
          "Wij gebruiken je gegevens om je sollicitatie te bekijken en contact met je op te nemen. Dat doen wij per telefoon, WhatsApp of e-mail.",
          "Dat mag omdat je zelf solliciteert en wij samen kijken of er een arbeidsovereenkomst kan komen. In de wet heet dat een stap vóór een overeenkomst (artikel 6 lid 1 onder b AVG).",
          "Is je sollicitatie afgerond, dan bewaren wij je gegevens nog vier weken. Zo kunnen wij vragen over je sollicitatie nog beantwoorden (gerechtvaardigd belang, artikel 6 lid 1 onder f AVG).",
          "Afgerond betekent dat je via ons aan het werk bent, dat wij je hebben afgewezen of dat je je sollicitatie hebt ingetrokken. Horen wij twaalf weken niets van je, dan ronden wij je sollicitatie ook af.",
          'Na die vier weken verwijderen wij je gegevens en je cv automatisch. Ga je via ons werken, dan lees je in het artikel "[Als je via ons gaat werken](#werken-via-groos)" welke gegevens wij dan bewaren.',
          "Wil je dat wij je ook benaderen voor ander werk? Dan kun je bij het solliciteren een los vakje aanvinken.",
          "Met dat vinkje bewaren wij je gegevens tot een jaar nadat je sollicitatie is afgerond. Dat doen wij alleen met jouw toestemming (artikel 6 lid 1 onder a AVG), en die kun je altijd intrekken.",
        ],
      },
      {
        id: "inschrijven",
        heading: "Als je je inschrijft zonder vacature",
        blocks: [
          "Schrijf je je in via de pagina [Inschrijven](/inschrijven), dan vragen wij dezelfde gegevens als bij een sollicitatie. Je kunt ons ook vertellen welk werk je zoekt.",
          "Wij gebruiken die gegevens om passend werk voor je te zoeken en je daarvoor te benaderen. Dat doen wij alleen met jouw toestemming, die je geeft met het vakje in het formulier (artikel 6 lid 1 onder a AVG).",
          "Wij bewaren je inschrijving zolang je via ons werk zoekt, en nooit langer dan een jaar.",
          "Is er twaalf weken geen contact geweest, dan sluiten wij je inschrijving af. Vier weken later verwijderen wij je gegevens automatisch.",
          `Wil je niet meer ingeschreven staan? Stuur dan een mail naar ${MAIL} of bel ons, dan verwijderen wij je gegevens.`,
          "Ben je jonger dan zestien jaar? Dan heb je toestemming van je ouder of voogd nodig om je in te schrijven.",
        ],
      },
      {
        id: "werken-via-groos",
        heading: "Als je via ons gaat werken",
        blocks: [
          "Ga je via ons aan het werk, dan hebben wij meer gegevens van je nodig. Die vragen wij in een persoonlijk gesprek en nooit via de website.",
          "Wij bekijken dan je originele identiteitsbewijs en maken er een kopie van, omdat de wet dat verplicht. Ook hebben wij je burgerservicenummer nodig voor je loon en de belasting.",
          "Kom je toch niet bij ons in dienst, dan vernietigen wij de kopie van je identiteitsbewijs binnen vier weken. Kom je wel in dienst, dan bewaren wij je personeelsgegevens zo lang als de wet voorschrijft; voor de belasting is dat zeven jaar.",
          "Wij gebruiken deze gegevens voor je arbeidsovereenkomst, je loon en onze wettelijke plichten (artikel 6 lid 1 onder b en c AVG). Voor de loonadministratie werken wij samen met TODO naam salarisadministratie.",
          "Wij geven de opdrachtgever waar je werkt alleen de gegevens die nodig zijn. Dat zijn bijvoorbeeld je naam, je werktijden en je certificaten.",
        ],
      },
      {
        id: "opdrachtgevers",
        heading: "Als u personeel aanvraagt of met ons samenwerkt",
        blocks: [
          "Vraagt u personeel aan, dan gebruiken wij uw naam, telefoonnummer en e-mailadres en de gegevens van uw bedrijf. Wij gebruiken die om uw aanvraag te behandelen, een offerte te maken en de samenwerking uit te voeren.",
          "Dat doen wij om een overeenkomst met uw bedrijf te sluiten en uit te voeren, en omdat wij zakelijk contact met u willen houden. De grondslagen zijn artikel 6 lid 1 onder b en f AVG.",
          "Wij bewaren uw aanvraag tot twee jaar na de laatste wijziging. Offertes, overeenkomsten en facturen bewaren wij zeven jaar, omdat de belastingwet dat verplicht.",
        ],
      },
      {
        id: "berichten",
        heading: "Als u ons een bericht stuurt",
        blocks: [
          "Stuurt u een bericht via het contactformulier, dan gebruiken wij uw naam, uw e-mailadres of telefoonnummer en uw bericht. Wij gebruiken die alleen om uw vraag te beantwoorden (gerechtvaardigd belang, artikel 6 lid 1 onder f AVG).",
          "Wij bewaren het bericht tot zes maanden nadat wij het hebben afgehandeld. Berichten die wij als spam herkennen, verwijderen wij na dertig dagen.",
          "Neemt u contact op via WhatsApp, dan gebruikt ook WhatsApp uw gegevens, volgens de eigen privacyverklaring van WhatsApp. Stuur via WhatsApp daarom geen kopie van uw identiteitsbewijs of andere gevoelige gegevens.",
        ],
      },
      {
        id: "e-mail",
        heading: "Bevestigingen en meldingen per e-mail",
        blocks: [
          "Na het versturen van een formulier krijgt u een bevestiging per e-mail, en Jimmy en Lorenzo krijgen een melding. Wij versturen die e-mails via Resend, vanaf servers in de Europese Unie.",
          "Een cv sturen wij nooit als bijlage mee. Jimmy en Lorenzo openen een cv alleen in onze beveiligde beheeromgeving.",
          "Van elke verstuurde e-mail bewaren wij negentig dagen een kort verzendverslag. Daarin staat niet wat er in de e-mail stond, en uw e-mailadres alleen in onherkenbare vorm.",
        ],
      },
      {
        id: "website",
        heading: "Onze website: beveiliging, statistieken en cookies",
        blocks: [
          "Onze website wordt gehost door Vercel. Bij elk bezoek verwerkt Vercel technische gegevens zoals uw IP-adres, om de website te leveren en te beveiligen.",
          "Bij het versturen van een formulier controleren wij met Vercel BotID of het verzoek van een mens komt. BotID beoordeelt daarvoor technische kenmerken van uw browser, en wij gebruiken die alleen voor deze controle.",
          "Ook bevat elk formulier een onzichtbaar controleveld en kijken wij hoe snel het is ingevuld. Dit doen wij om misbruik en spam te voorkomen (gerechtvaardigd belang, artikel 6 lid 1 onder f AVG).",
          "Om misbruik te voorkomen beperkt onze hostingpartij Vercel het aantal formulierverzendingen en inlogpogingen per IP-adres; daarvoor wordt het IP-adres kort verwerkt.",
          "Wij meten het gebruik van de website met Vercel Web Analytics. Dat werkt zonder cookies, en wij kunnen u daarmee niet herkennen bij een volgend bezoek.",
          "Wij tellen ook hoeveel formulieren er worden verstuurd, zonder namen of andere persoonsgegevens. Welke cookies wij wel gebruiken, leest u in onze [cookieverklaring](/cookieverklaring).",
        ],
      },
      {
        id: "delen",
        heading: "Met wie wij gegevens delen",
        blocks: [
          "Wij verkopen persoonsgegevens nooit. Wij delen ze alleen als dat nodig is voor ons werk of als de wet dat verplicht.",
          {
            list: [
              "Opdrachtgevers krijgen de gegevens die nodig zijn als wij iemand voorstellen voor werk. Een cv sturen wij pas door als wij dat eerst met de werkzoekende hebben besproken.",
              "Overheidsinstanties zoals de Belastingdienst, het UWV en de Nederlandse Arbeidsinspectie krijgen gegevens als de wet ons dat verplicht.",
              "Leveranciers die gegevens in onze opdracht verwerken, de verwerkers, staan hieronder.",
            ],
          },
          "Deze verwerkers werken in onze opdracht:",
          {
            list: [
              "Supabase: database en opslag van cv's, op servers in Frankfurt;",
              "Vercel: hosting van de website, beveiliging van formulieren en statistieken;",
              "Resend: versturen van e-mail;",
              "STRATO: domeinnaam en e-mailboxen, in Duitsland;",
              "Sinka B.V. (handelsnaam SKUU; TODO juridische naam bevestigen, 00 §7 punt 6): bouw en technisch beheer van de website;",
              "TODO naam salarisadministratie: loonadministratie van uitzendkrachten.",
            ],
          },
          "Met elke verwerker hebben wij een verwerkersovereenkomst. Daarin staat dat zij de gegevens alleen voor ons gebruiken en goed beveiligen.",
        ],
      },
      {
        id: "buiten-de-eu",
        heading: "Gegevens buiten de Europese Unie",
        blocks: [
          "Wij bewaren gegevens zoveel mogelijk in de Europese Unie. Onze database en de cv's staan bij Supabase op servers in Frankfurt.",
          "Supabase, Vercel en Resend zijn Amerikaanse bedrijven. Daardoor kunnen gegevens soms toch in de Verenigde Staten worden verwerkt, bijvoorbeeld bij technische ondersteuning.",
          "Voor die doorgifte gelden de afspraken uit hun verwerkersovereenkomst. Dat zijn het EU-VS Data Privacy Framework of de standaardcontractbepalingen van de Europese Commissie.",
        ],
      },
      {
        id: "bewaartermijnen",
        heading: "Hoe lang wij gegevens bewaren",
        blocks: [
          "Wij bewaren gegevens niet langer dan nodig. Het verwijderen gebeurt automatisch, ook van cv's.",
          {
            table: {
              caption: "Bewaartermijnen",
              head: ["Gegevens", "Hoe lang wij ze bewaren"],
              rows: [
                ["Sollicitatie op een vacature", "Vier weken nadat de sollicitatie is afgerond"],
                ["Sollicitatie met toestemming voor ander werk", "Een jaar nadat de sollicitatie is afgerond"],
                [
                  "Inschrijving zonder vacature",
                  "Zolang je werk zoekt en nooit langer dan een jaar; na twaalf weken zonder contact afgesloten en vier weken later verwijderd",
                ],
                ["Cv dat niet bij een verstuurde sollicitatie hoort", "24 uur"],
                ["Personeelsaanvraag", "Twee jaar na de laatste wijziging"],
                ["Bericht via het contactformulier", "Zes maanden na afhandeling; spam dertig dagen"],
                ["Verzendverslag van een e-mail", "Negentig dagen"],
                ["Logboek van de beheeromgeving", "Twee jaar"],
                ["Kopie identiteitsbewijs als je niet in dienst komt", "Hoogstens vier weken"],
                ["Personeels- en loonadministratie", "Zo lang als de wet voorschrijft; voor de belasting zeven jaar"],
                ["Klacht", "Een jaar na afhandeling"],
              ],
            },
          },
          "Een verwijderd gegeven kan nog zeven dagen in een reservekopie van de database staan. Daarna is het ook daar verdwenen.",
        ],
      },
      {
        id: "beveiliging",
        heading: "Beveiliging",
        blocks: [
          "Wij beveiligen gegevens met passende technische en organisatorische maatregelen. Alleen Jimmy en Lorenzo kunnen in de beheeromgeving, met een wachtwoord en een code uit een app op hun telefoon.",
          "Cv's staan in afgeschermde opslag en zijn alleen te openen via een link die kort geldig is. Wij leggen vast wanneer een cv is bekeken.",
          "Gaat er toch iets mis met persoonsgegevens, dan melden wij dat binnen 72 uur bij de Autoriteit Persoonsgegevens als de wet dat vraagt. Loopt u daardoor een groot risico, dan laten wij het u ook zelf weten.",
        ],
      },
      {
        id: "besluiten",
        heading: "Geen automatische besluiten",
        blocks: [
          "Wij nemen geen besluiten over mensen die alleen door een computer worden genomen. Jimmy of Lorenzo bekijkt zelf elke sollicitatie en inschrijving.",
          "Wij gebruiken geen kunstmatige intelligentie om sollicitaties te selecteren of te beoordelen. Gaan wij dat ooit wel doen, dan passen wij eerst deze verklaring aan.",
        ],
      },
      {
        id: "rechten",
        heading: "Uw rechten",
        blocks: [
          "Iedereen van wie wij gegevens gebruiken, heeft deze rechten:",
          {
            list: [
              "inzage in de gegevens die wij van u hebben;",
              "correctie van gegevens die niet kloppen;",
              "verwijdering van uw gegevens;",
              "beperking van het gebruik van uw gegevens;",
              "bezwaar tegen het gebruik van uw gegevens;",
              "uw gegevens ontvangen in een gangbaar bestand, om ze aan een ander te geven;",
              "uw toestemming intrekken, als wij gegevens op basis van toestemming gebruiken.",
            ],
          },
          `Een verzoek stuurt u naar ${MAIL} of per post naar ons adres. Wij reageren binnen een maand, en bij een ingewikkeld verzoek laten wij binnen die maand weten als wij meer tijd nodig hebben.`,
          "Wij controleren of het verzoek echt van u komt via het telefoonnummer of e-mailadres dat wij al van u hebben. Wij vragen daarvoor nooit een kopie van uw identiteitsbewijs.",
          "Soms mogen wij gegevens niet verwijderen, omdat de wet ons verplicht ze te bewaren. Dan leggen wij uit om welke gegevens het gaat en waarom.",
          "Trekt u uw toestemming in, dan stoppen wij met dat gebruik. Wat wij daarvoor met uw gegevens deden, blijft wel toegestaan.",
        ],
      },
      {
        id: "klacht",
        heading: "Een klacht over privacy",
        blocks: [
          "Bent u niet tevreden over hoe wij met uw gegevens omgaan, laat het ons dan eerst weten. Dat kan volgens onze [klachtenregeling](/klachtenregeling).",
          "U kunt ook altijd een klacht indienen bij de Autoriteit Persoonsgegevens. Dat doet u via [autoriteitpersoonsgegevens.nl](https://autoriteitpersoonsgegevens.nl).",
        ],
      },
      {
        id: "wijzigingen",
        heading: "Wijzigingen in deze verklaring",
        blocks: [
          "Wij passen deze verklaring aan als onze werkwijze of de wet verandert. Bovenaan deze pagina staan het versienummer en de datum van de huidige versie.",
          "Bij elke sollicitatie en inschrijving leggen wij vast welke versie op dat moment gold. Zo kunnen wij altijd laten zien wat wij u hebben verteld.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy statement",
    metaDescription:
      "Read which personal data Groos Personeelsdiensten processes when you apply, request staff or contact us, and how long we keep it.",
    intro:
      "Groos Personeelsdiensten uses data of job seekers, temporary workers and clients. Here you can read which data that is, what we use it for, how long we keep it and which rights you have. This is a translation of the Dutch text. If the two versions differ, the Dutch version applies.",
    sections: [
      {
        id: "wie-wij-zijn",
        heading: "Who we are",
        blocks: [
          "Groos Personeelsdiensten B.V. is the controller: we determine why and how the personal data in this statement is used. We are an employment agency in The Hague and work with job seekers, temporary workers and clients.",
          {
            list: [
              `${contact.name}, ${contact.street}, ${contact.postalCode} ${contact.city}`,
              `Chamber of Commerce number ${KVK_EN}`,
              `Email: ${MAIL}`,
              `Phone: ${PHONE}`,
            ],
          },
          "We do not have a data protection officer, because we are not required to have one. Jimmy and Lorenzo are the point of contact for all questions about privacy.",
        ],
      },
      {
        id: "voor-wie",
        heading: "Who this statement applies to",
        blocks: [
          "This statement applies to everyone whose data we use, through the website or through email, phone and WhatsApp. These are job seekers, temporary workers, contact persons at clients and other people who contact us.",
          "The Dutch version addresses job seekers informally and everyone else formally. In English we simply use you throughout.",
        ],
      },
      {
        id: "solliciteren",
        heading: "When you apply for a vacancy",
        blocks: [
          "If you apply through our website, we ask for your name, phone number, email address and place of residence. We also ask whether you are allowed to work in the Netherlands.",
          "You can choose to send more, such as your CV, a message and the date on which you can start. If the vacancy requires a driving licence, we also ask whether you have a category B licence.",
          "Through the website we never ask for:",
          {
            list: [
              "your citizen service number (BSN);",
              "a copy of your identity document;",
              "your date of birth or nationality;",
              "a photo of yourself;",
              "information about your health.",
            ],
          },
          "We use your data to review your application and to contact you. We do that by phone, WhatsApp or email.",
          "We may do so because you apply yourself and we look together at whether an employment contract can follow. In law this is called a step prior to entering into a contract (Article 6(1)(b) GDPR).",
          "Once your application has been completed, we keep your data for another four weeks. This allows us to answer any questions about your application (legitimate interest, Article 6(1)(f) GDPR).",
          "Completed means that you are working through us, that we have rejected you or that you have withdrawn your application. If we hear nothing from you for twelve weeks, we also complete your application.",
          'After those four weeks we delete your data and your CV automatically. If you start working through us, the article "[When you start working through us](#werken-via-groos)" explains which data we then keep.',
          "Would you like us to contact you about other work as well? You can tick a separate box when you apply.",
          "With that box ticked, we keep your data until one year after your application has been completed. We only do this with your consent (Article 6(1)(a) GDPR), and you can withdraw it at any time.",
        ],
      },
      {
        id: "inschrijven",
        heading: "When you register without a vacancy",
        blocks: [
          "If you register through the [Register](/inschrijven) page, we ask for the same data as for an application. You can also tell us what kind of work you are looking for.",
          "We use that data to find suitable work for you and to contact you about it. We only do this with your consent, which you give with the box in the form (Article 6(1)(a) GDPR).",
          "We keep your registration for as long as you are looking for work through us, and never longer than one year.",
          "If there has been no contact for twelve weeks, we close your registration. Four weeks later we delete your data automatically.",
          `No longer want to be registered? Send an email to ${MAIL} or call us, and we will delete your data.`,
          "Are you under sixteen? Then you need permission from your parent or guardian to register.",
        ],
      },
      {
        id: "werken-via-groos",
        heading: "When you start working through us",
        blocks: [
          "If you start working through us, we need more data from you. We ask for it in a personal meeting and never through the website.",
          "We then check your original identity document and make a copy of it, because the law requires this. We also need your citizen service number (BSN) for your wages and tax.",
          "If you do not join us after all, we destroy the copy of your identity document within four weeks. If you do join us, we keep your personnel data for as long as the law requires; for tax purposes that is seven years.",
          "We use this data for your employment contract, your wages and our legal obligations (Article 6(1)(b) and (c) GDPR). For payroll we work with TODO name of payroll provider.",
          "We only give the client where you work the data that is necessary. Examples are your name, your working hours and your certificates.",
        ],
      },
      {
        id: "opdrachtgevers",
        heading: "When you request staff or work with us",
        blocks: [
          "If you request staff, we use your name, phone number and email address and the details of your company. We use them to handle your request, prepare a quote and carry out the collaboration.",
          "We do this to enter into and perform an agreement with your company, and because we want to maintain business contact with you. The legal bases are Article 6(1)(b) and (f) GDPR.",
          "We keep your request until two years after the last change. We keep quotes, agreements and invoices for seven years, because tax law requires this.",
        ],
      },
      {
        id: "berichten",
        heading: "When you send us a message",
        blocks: [
          "If you send a message through the contact form, we use your name, your email address or phone number and your message. We only use them to answer your question (legitimate interest, Article 6(1)(f) GDPR).",
          "We keep the message until six months after we have dealt with it. Messages that we recognise as spam are deleted after thirty days.",
          "If you contact us through WhatsApp, WhatsApp also uses your data, in line with its own privacy statement. For that reason, do not send a copy of your identity document or other sensitive data through WhatsApp.",
        ],
      },
      {
        id: "e-mail",
        heading: "Confirmations and notifications by email",
        blocks: [
          "After you submit a form you receive a confirmation by email, and Jimmy and Lorenzo receive a notification. We send these emails through Resend, from servers in the European Union.",
          "We never send a CV as an attachment. Jimmy and Lorenzo only open a CV in our secure admin environment.",
          "For every email sent, we keep a short delivery record for ninety days. It does not contain what the email said, and your email address only in an unrecognisable form.",
        ],
      },
      {
        id: "website",
        heading: "Our website: security, statistics and cookies",
        blocks: [
          "Our website is hosted by Vercel. On every visit Vercel processes technical data such as your IP address, in order to deliver and secure the website.",
          "When you submit a form, we use Vercel BotID to check whether the request comes from a person. BotID assesses technical characteristics of your browser for this, and we only use them for this check.",
          "Every form also contains an invisible check field, and we look at how quickly it was filled in. We do this to prevent abuse and spam (legitimate interest, Article 6(1)(f) GDPR).",
          "To prevent abuse, our hosting provider Vercel limits the number of form submissions and login attempts per IP address; the IP address is processed briefly for this purpose.",
          "We measure the use of the website with Vercel Web Analytics. It works without cookies, and we cannot use it to recognise you on a later visit.",
          "We also count how many forms are submitted, without names or other personal data. You can read which cookies we do use in our [cookie statement](/cookieverklaring).",
        ],
      },
      {
        id: "delen",
        heading: "Who we share data with",
        blocks: [
          "We never sell personal data. We only share it when that is necessary for our work or when the law requires it.",
          {
            list: [
              "Clients receive the data they need when we propose someone for work. We only pass on a CV after we have discussed this with the job seeker first.",
              "Government bodies such as the Dutch Tax Administration (Belastingdienst), the UWV and the Netherlands Labour Authority receive data when the law requires us to provide it.",
              "Suppliers that process data on our behalf, the processors, are listed below.",
            ],
          },
          "These processors work on our behalf:",
          {
            list: [
              "Supabase: database and storage of CVs, on servers in Frankfurt;",
              "Vercel: hosting of the website, security of forms and statistics;",
              "Resend: sending email;",
              "STRATO: domain name and mailboxes, in Germany;",
              "Sinka B.V. (trading as SKUU; TODO confirm legal name, 00 §7 item 6): development and technical management of the website;",
              "TODO name of payroll provider: payroll administration for temporary workers.",
            ],
          },
          "We have a data processing agreement with every processor. It states that they only use the data for us and keep it secure.",
        ],
      },
      {
        id: "buiten-de-eu",
        heading: "Data outside the European Union",
        blocks: [
          "We store data within the European Union as much as possible. Our database and the CVs are stored with Supabase on servers in Frankfurt.",
          "Supabase, Vercel and Resend are American companies. As a result, data may sometimes still be processed in the United States, for example during technical support.",
          "Such transfers are covered by the arrangements in their data processing agreements. These are the EU-US Data Privacy Framework or the standard contractual clauses of the European Commission.",
        ],
      },
      {
        id: "bewaartermijnen",
        heading: "How long we keep data",
        blocks: [
          "We do not keep data for longer than necessary. Deletion happens automatically, including for CVs.",
          {
            table: {
              caption: "Retention periods",
              head: ["Data", "How long we keep it"],
              rows: [
                ["Application for a vacancy", "Four weeks after the application has been completed"],
                ["Application with consent for other work", "One year after the application has been completed"],
                [
                  "Registration without a vacancy",
                  "As long as you are looking for work and never longer than one year; closed after twelve weeks without contact and deleted four weeks later",
                ],
                ["CV that does not belong to a submitted application", "24 hours"],
                ["Staff request", "Two years after the last change"],
                ["Message through the contact form", "Six months after it has been dealt with; spam thirty days"],
                ["Email delivery record", "Ninety days"],
                ["Log of the admin environment", "Two years"],
                ["Copy of identity document if you do not join us", "At most four weeks"],
                ["Personnel and payroll records", "As long as the law requires; for tax purposes seven years"],
                ["Complaint", "One year after it has been dealt with"],
              ],
            },
          },
          "Deleted data may remain in a backup of the database for another seven days. After that it is gone from there as well.",
        ],
      },
      {
        id: "beveiliging",
        heading: "Security",
        blocks: [
          "We protect data with appropriate technical and organisational measures. Only Jimmy and Lorenzo can access the admin environment, with a password and a code from an app on their phone.",
          "CVs are kept in protected storage and can only be opened through a link that is valid for a short time. We record when a CV has been viewed.",
          "If something does go wrong with personal data, we report it to the Dutch Data Protection Authority (Autoriteit Persoonsgegevens) within 72 hours when the law requires it. If this puts you at high risk, we also tell you ourselves.",
        ],
      },
      {
        id: "besluiten",
        heading: "No automated decisions",
        blocks: [
          "We do not make decisions about people that are taken by a computer alone. Jimmy or Lorenzo personally reviews every application and registration.",
          "We do not use artificial intelligence to select or assess applications. If we ever start doing so, we will update this statement first.",
        ],
      },
      {
        id: "rechten",
        heading: "Your rights",
        blocks: [
          "Everyone whose data we use has these rights:",
          {
            list: [
              "access to the data we hold about you;",
              "correction of data that is incorrect;",
              "deletion of your data;",
              "restriction of the use of your data;",
              "objection to the use of your data;",
              "receiving your data in a common file format, to pass it on to someone else;",
              "withdrawing your consent, where we use data on the basis of consent.",
            ],
          },
          `Send a request to ${MAIL} or by post to our address. We respond within one month, and for a complex request we let you know within that month if we need more time.`,
          "We check that the request really comes from you through the phone number or email address we already have for you. We never ask for a copy of your identity document for this.",
          "Sometimes we are not allowed to delete data, because the law requires us to keep it. In that case we explain which data it concerns and why.",
          "If you withdraw your consent, we stop that use. What we did with your data before that remains lawful.",
        ],
      },
      {
        id: "klacht",
        heading: "A complaint about privacy",
        blocks: [
          "If you are not satisfied with how we handle your data, please let us know first. You can do so under our [complaints procedure](/klachtenregeling).",
          "You can also always lodge a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens). You can do this through [autoriteitpersoonsgegevens.nl](https://autoriteitpersoonsgegevens.nl).",
        ],
      },
      {
        id: "wijzigingen",
        heading: "Changes to this statement",
        blocks: [
          "We update this statement when our way of working or the law changes. The version number and date of the current version are shown at the top of this page.",
          "With every application and registration we record which version applied at that moment. This way we can always show what we told you.",
        ],
      },
    ],
  },
};

export async function generateMetadata({ params }: PageProps<"/[locale]/privacyverklaring">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const c = pickLegal(CONTENT, locale);
  return pageMetadata({ locale, path: getLegalDoc("privacy").path, title: c.title, description: c.metaDescription });
}

export default async function Page({ params }: PageProps<"/[locale]/privacyverklaring">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  return <LegalPage doc="privacy" content={pickLegal(CONTENT, locale)} />;
}
