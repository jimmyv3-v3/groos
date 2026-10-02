import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { contact } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";

// TODO (juridisch): overgenomen uit J. Versseput en algemeen gemaakt. Controleer of
// de lijst met gegevens en verwerkers klopt voor dit bedrijf (formulier via
// Web3Forms, hosting en statistieken via Vercel) en laat het document vóór
// livegang nakijken. Bedrijfsgegevens komen automatisch uit lib/site.ts.

type LegalContent = {
  title: string;
  metaDescription: string;
  intro: string;
  updatedAt: string;
  sections: LegalSection[];
};

const CONTENT: { nl: LegalContent; en: LegalContent } = {
  nl: {
    title: "Privacybeleid",
    metaDescription:
      `Lees hoe ${contact.shortName} uw persoonsgegevens verwerkt en beschermt, in overeenstemming met de AVG.`,
    intro: `${contact.name} hecht grote waarde aan de bescherming van uw persoonsgegevens. In dit privacybeleid leggen wij helder uit welke gegevens wij verwerken, met welk doel en welke rechten u heeft. Wij verwerken uw gegevens in overeenstemming met de Algemene Verordening Gegevensbescherming.`,
    updatedAt: "TODO datum van publicatie",
    sections: [
      {
        heading: "Wie wij zijn",
        blocks: [
          `${contact.name} is de verwerkingsverantwoordelijke voor de verwerking van uw persoonsgegevens. Onze gegevens zijn:`,
          {
            list: [
              `${contact.name}, gevestigd te ${contact.city}.`,
              `Kamer van Koophandel: ${contact.kvk}.`,
              `E-mail: ${contact.email}.`,
              `Telefoon: ${contact.phone}.`,
            ],
          },
          "Wij hebben geen functionaris voor de gegevensbescherming aangesteld. Voor vragen over privacy kunt u contact met ons opnemen via bovenstaande gegevens.",
        ],
      },
      {
        heading: "Welke persoonsgegevens wij verwerken",
        blocks: [
          "Wij verwerken de persoonsgegevens die u aan ons verstrekt en die nodig zijn voor onze dienstverlening. Afhankelijk van de situatie gaat het om:",
          {
            list: [
              "voor- en achternaam en, bij zakelijke klanten, de bedrijfsnaam;",
              "het adres waar de werkzaamheden plaatsvinden, de postcode en de plaats;",
              "contactgegevens zoals telefoonnummer en e-mailadres;",
              "gegevens over de aangevraagde of uitgevoerde werkzaamheden;",
              "factuur- en betaalgegevens;",
              "foto's die u ons stuurt ten behoeve van de offerte en de uitvoering, waarop in beginsel geen personen herkenbaar zijn;",
              "technische gegevens van uw bezoek aan onze website, zoals uw IP-adres en apparaatgegevens.",
            ],
          },
        ],
      },
      {
        heading: "Hoe wij uw gegevens verkrijgen",
        blocks: [
          "Wij ontvangen uw gegevens doordat u deze zelf aan ons verstrekt, bijvoorbeeld via het offerteformulier, per telefoon, per e-mail of via WhatsApp. Daarnaast worden bij een bezoek aan onze website automatisch enkele technische gegevens vastgelegd.",
        ],
      },
      {
        heading: "Doeleinden en grondslagen",
        blocks: [
          "Wij verwerken uw persoonsgegevens uitsluitend voor duidelijk omschreven doeleinden en op basis van een wettelijke grondslag:",
          {
            list: [
              "het opstellen van een offerte en het uitvoeren van de overeenkomst, op grond van de uitvoering van de overeenkomst;",
              "contact met u opnemen en u informeren over uw aanvraag of opdracht, op grond van de uitvoering van de overeenkomst of ons gerechtvaardigd belang;",
              "het voeren van onze administratie en facturatie, op grond van een wettelijke verplichting;",
              "het verbeteren van onze dienstverlening en website, op grond van ons gerechtvaardigd belang;",
              "het versturen van informatie of aanbiedingen, uitsluitend wanneer u daarvoor toestemming heeft gegeven.",
            ],
          },
        ],
      },
      {
        heading: "Bijzondere persoonsgegevens en minderjarigen",
        blocks: [
          "Wij verwerken geen bijzondere categorieën van persoonsgegevens. Onze website en dienstverlening zijn niet gericht op personen jonger dan zestien jaar. Meent u dat wij zonder de juiste toestemming gegevens van een minderjarige hebben verwerkt, neem dan contact met ons op, dan verwijderen wij deze.",
        ],
      },
      {
        heading: "Geautomatiseerde besluitvorming",
        blocks: [
          "Wij nemen geen besluiten op basis van geautomatiseerde verwerkingen die voor u gevolgen kunnen hebben.",
        ],
      },
      {
        heading: "Hoe lang wij uw gegevens bewaren",
        blocks: [
          "Wij bewaren uw persoonsgegevens niet langer dan noodzakelijk is voor de doeleinden waarvoor zij zijn verzameld:",
          {
            list: [
              "offerteaanvragen die niet tot een opdracht leiden, bewaren wij maximaal twaalf maanden;",
              "klant- en contactgegevens bewaren wij gedurende de looptijd van de relatie en een redelijke periode daarna;",
              "factuur- en administratiegegevens bewaren wij zeven jaar, conform de wettelijke fiscale bewaarplicht.",
            ],
          },
        ],
      },
      {
        heading: "Delen met derden",
        blocks: [
          "Wij verstrekken uw gegevens uitsluitend aan derden wanneer dit nodig is voor de uitvoering van de overeenkomst of om te voldoen aan een wettelijke verplichting.",
          "Met partijen die in onze opdracht gegevens verwerken, zoals onze hosting-, formulier-, e-mail- en boekhoudleveranciers, sluiten wij een verwerkersovereenkomst. Wij verkopen uw gegevens nooit aan derden.",
        ],
      },
      {
        heading: "Cookies en websitestatistieken",
        blocks: [
          "Onze website maakt gebruik van functionele cookies die nodig zijn om de site goed te laten werken, en van privacyvriendelijke statistieken via Vercel Analytics om het gebruik van de website te meten. Hierbij worden geen gegevens aan derden verkocht.",
          "U kunt cookies altijd weigeren of verwijderen via de instellingen van uw browser.",
        ],
      },
      {
        heading: "Doorgifte buiten de Europese Economische Ruimte",
        blocks: [
          "Wij verwerken uw gegevens in beginsel binnen de Europese Economische Ruimte. Wanneer gegevens toch daarbuiten worden verwerkt, zorgen wij voor passende waarborgen zoals de wet die voorschrijft.",
        ],
      },
      {
        heading: "Beveiliging",
        blocks: [
          "Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te beschermen tegen verlies en ongeoorloofd gebruik. Mocht er ondanks onze maatregelen sprake zijn van een datalek met een risico voor uw rechten, dan handelen wij conform de wettelijke meldplicht.",
        ],
      },
      {
        heading: "Uw rechten",
        blocks: [
          "U heeft op grond van de wet de volgende rechten met betrekking tot uw persoonsgegevens:",
          {
            list: [
              "het recht op inzage in de gegevens die wij van u verwerken;",
              "het recht op rectificatie van onjuiste gegevens;",
              "het recht op verwijdering van uw gegevens;",
              "het recht op beperking van de verwerking;",
              "het recht van bezwaar tegen de verwerking;",
              "het recht op overdraagbaarheid van uw gegevens;",
              "het recht om een gegeven toestemming weer in te trekken.",
            ],
          },
          `U kunt een verzoek indienen via ${contact.email}. Wij reageren binnen één maand. Ter controle kunnen wij u vragen zich te identificeren.`,
        ],
      },
      {
        heading: "Klacht bij de Autoriteit Persoonsgegevens",
        blocks: [
          "Bent u het niet eens met de manier waarop wij met uw gegevens omgaan, dan heeft u het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens via autoriteitpersoonsgegevens.nl.",
        ],
      },
      {
        heading: "Wijzigingen in dit privacybeleid",
        blocks: [
          "Wij kunnen dit privacybeleid van tijd tot tijd aanpassen. De meest recente versie vindt u altijd op onze website.",
        ],
      },
      {
        heading: "Contact",
        blocks: [
          `Heeft u vragen over dit privacybeleid of over de verwerking van uw gegevens, neem dan contact met ons op via ${contact.email} of ${contact.phone}.`,
        ],
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    metaDescription:
      `Read how ${contact.shortName} processes and protects your personal data, in accordance with the GDPR.`,
    intro: `${contact.name} attaches great importance to the protection of your personal data. In this privacy policy we explain clearly which data we process, for what purpose and which rights you have. We process your data in accordance with the General Data Protection Regulation (GDPR).`,
    updatedAt: "TODO publication date",
    sections: [
      {
        heading: "Who we are",
        blocks: [
          `${contact.name} is the data controller for the processing of your personal data. Our details are:`,
          {
            list: [
              `${contact.name}, established in ${contact.city}.`,
              `Chamber of Commerce: ${contact.kvk}.`,
              `Email: ${contact.email}.`,
              `Telephone: ${contact.phone}.`,
            ],
          },
          "We have not appointed a data protection officer. For questions about privacy you can contact us using the details above.",
        ],
      },
      {
        heading: "Which personal data we process",
        blocks: [
          "We process the personal data that you provide to us and that is necessary for our services. Depending on the situation, this concerns:",
          {
            list: [
              "first name and surname and, in the case of business clients, the company name;",
              "the address where the work takes place, the postal code and the town;",
              "contact details such as telephone number and email address;",
              "information about the requested or completed work;",
              "invoicing and payment details;",
              "photographs you send us for the purposes of the quotation and the execution of the work, on which in principle no individuals are identifiable;",
              "technical data relating to your visit to our website, such as your IP address and device data.",
            ],
          },
        ],
      },
      {
        heading: "How we obtain your data",
        blocks: [
          "We receive your data because you provide it to us yourself, for example through the quote form, by telephone, by email or via WhatsApp. In addition, some technical data is recorded automatically when you visit our website.",
        ],
      },
      {
        heading: "Purposes and legal bases",
        blocks: [
          "We process your personal data solely for clearly defined purposes and on the basis of a legal basis:",
          {
            list: [
              "preparing a quotation and performing the agreement, on the basis of the performance of the agreement;",
              "contacting you and informing you about your request or assignment, on the basis of the performance of the agreement or our legitimate interest;",
              "maintaining our administration and invoicing, on the basis of a legal obligation;",
              "improving our services and website, on the basis of our legitimate interest;",
              "sending information or offers, solely where you have given your consent for this.",
            ],
          },
        ],
      },
      {
        heading: "Special categories of personal data and minors",
        blocks: [
          "We do not process special categories of personal data. Our website and services are not directed at persons under the age of sixteen. If you believe that we have processed the data of a minor without the appropriate consent, please contact us and we will delete it.",
        ],
      },
      {
        heading: "Automated decision-making",
        blocks: [
          "We do not make decisions on the basis of automated processing that may have consequences for you.",
        ],
      },
      {
        heading: "How long we retain your data",
        blocks: [
          "We do not retain your personal data for longer than is necessary for the purposes for which it was collected:",
          {
            list: [
              "quotation requests that do not lead to an assignment are retained for a maximum of twelve months;",
              "customer and contact details are retained for the duration of the relationship and for a reasonable period thereafter;",
              "invoicing and administrative data is retained for seven years, in accordance with the statutory tax retention obligation.",
            ],
          },
        ],
      },
      {
        heading: "Sharing with third parties",
        blocks: [
          "We only provide your data to third parties where this is necessary for the performance of the agreement or in order to comply with a legal obligation.",
          "With parties that process data on our behalf, such as our hosting, form, email and accounting providers, we conclude a data processing agreement. We never sell your data to third parties.",
        ],
      },
      {
        heading: "Cookies and website statistics",
        blocks: [
          "Our website uses functional cookies that are necessary for the site to work properly, and privacy-friendly statistics via Vercel Analytics to measure use of the website. No data is sold to third parties in this process.",
          "You can always refuse or delete cookies through the settings of your browser.",
        ],
      },
      {
        heading: "Transfers outside the European Economic Area",
        blocks: [
          "In principle we process your data within the European Economic Area. Where data is nevertheless processed outside it, we ensure appropriate safeguards as prescribed by law.",
        ],
      },
      {
        heading: "Security",
        blocks: [
          "We take appropriate technical and organisational measures to protect your personal data against loss and unauthorised use. If, despite our measures, a data breach occurs that poses a risk to your rights, we act in accordance with the statutory notification obligation.",
        ],
      },
      {
        heading: "Your rights",
        blocks: [
          "Under the law you have the following rights with regard to your personal data:",
          {
            list: [
              "the right of access to the data that we process about you;",
              "the right to rectification of inaccurate data;",
              "the right to erasure of your data;",
              "the right to restriction of the processing;",
              "the right to object to the processing;",
              "the right to data portability of your data;",
              "the right to withdraw consent that has been given.",
            ],
          },
          `You can submit a request via ${contact.email}. We will respond within one month. For verification purposes we may ask you to identify yourself.`,
        ],
      },
      {
        heading: "Complaint to the Dutch Data Protection Authority",
        blocks: [
          "If you do not agree with the way in which we handle your data, you have the right to lodge a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens) via autoriteitpersoonsgegevens.nl.",
        ],
      },
      {
        heading: "Changes to this privacy policy",
        blocks: [
          "We may amend this privacy policy from time to time. You will always find the most recent version on our website.",
        ],
      },
      {
        heading: "Contact",
        blocks: [
          `If you have questions about this privacy policy or about the processing of your data, please contact us via ${contact.email} or ${contact.phone}.`,
        ],
      },
    ],
  },
};

function pick(locale: string): LegalContent {
  return CONTENT[(locale as "nl" | "en") in CONTENT ? (locale as "nl" | "en") : "nl"];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = pick(locale);
  return pageMetadata({
    locale,
    path: "/privacybeleid",
    title: c.title,
    description: c.metaDescription,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = pick(locale);
  return (
    <LegalPage
      title={c.title}
      intro={c.intro}
      updatedAt={c.updatedAt}
      sections={c.sections}
    />
  );
}
