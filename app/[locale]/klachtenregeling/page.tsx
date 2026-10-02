// TODO (jurist): concepttekst versie 0.1, laten toetsen vóór livegang (spec 09 §12).
// TODO (Jimmy en Lorenzo): termijnen van vijf werkdagen en vier weken bevestigen (B-10).
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { contact } from "@/lib/site";
import { resolveLocale } from "@/i18n/locale";
import { ROUTES } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { LegalPage, pickLegal, type LegalContent } from "@/components/legal/legal-page";

// Tekst uit spec 09 §6.6.

const MAIL = `[${contact.email}](${contact.emailHref})`;
const PHONE = `[${contact.phone}](${contact.phoneHref})`;
const ADDRESS = `${contact.name}, ${contact.street}, ${contact.postalCode} ${contact.city}`;

const CONTENT: { nl: LegalContent; en: LegalContent } = {
  nl: {
    title: "Klachtenregeling",
    metaDescription:
      "Heeft u een klacht over Groos Personeelsdiensten? Hier leest u hoe u die indient, wie hem behandelt en wanneer u antwoord krijgt.",
    intro:
      "Wij willen dat iedereen goed wordt behandeld door Groos Personeelsdiensten. Bent u toch niet tevreden, dan leest u hier hoe u een klacht indient en wat wij ermee doen.",
    sections: [
      {
        id: "voor-wie",
        heading: "Voor wie deze regeling geldt",
        blocks: [
          "Deze regeling geldt voor werkzoekenden, uitzendkrachten, opdrachtgevers en iedereen die met ons te maken heeft. U kunt een klacht indienen over hoe wij u hebben behandeld, over onze werkwijze of over iemand die voor Groos werkt.",
        ],
      },
      {
        id: "onderwerpen",
        heading: "Waarover u een klacht kunt indienen",
        blocks: [
          "U kunt bijvoorbeeld een klacht indienen over:",
          {
            list: [
              "de manier waarop wij met u communiceren;",
              "de afhandeling van een sollicitatie, inschrijving of aanvraag;",
              "het gebruik van uw persoonsgegevens;",
              "ongelijke behandeling of discriminatie;",
              "uw arbeidsvoorwaarden of de veiligheid tijdens uw werk via Groos.",
            ],
          },
          "Gaat uw klacht over de werkplek bij een opdrachtgever, dan bespreken wij die ook met de opdrachtgever. Dat doen wij alleen als u dat goed vindt.",
        ],
      },
      {
        id: "indienen",
        heading: "Hoe u een klacht indient",
        blocks: [
          `Stuur uw klacht per e-mail naar ${MAIL} met als onderwerp "Klacht". U kunt ook een brief sturen naar ${ADDRESS}.`,
          `Belt u liever, dan kan dat via ${PHONE}. Wij schrijven uw klacht dan op en sturen u die ter controle.`,
          "Zet in uw klacht in elk geval:",
          {
            list: [
              "uw naam en hoe wij u kunnen bereiken;",
              "waar de klacht over gaat en wanneer het gebeurde;",
              "wat u van ons verwacht.",
            ],
          },
        ],
      },
      {
        id: "behandeling",
        heading: "Wat wij met uw klacht doen",
        blocks: [
          "Binnen vijf werkdagen na ontvangst krijgt u van ons een inhoudelijke reactie. Hebben wij meer tijd nodig, dan laten wij dat binnen die vijf werkdagen weten, met de reden en een nieuwe datum.",
          "Die nieuwe datum ligt nooit later dan vier weken na ontvangst van uw klacht. Aan het eind krijgt u altijd schriftelijk wat wij hebben besloten en waarom.",
        ],
      },
      {
        id: "behandelaar",
        heading: "Wie uw klacht behandelt",
        blocks: ["Jimmy of Lorenzo behandelt uw klacht. Gaat de klacht over een van hen, dan behandelt de ander hem."],
      },
      {
        id: "vertrouwelijk",
        heading: "Vertrouwelijk en zonder nadeel",
        blocks: [
          "Wij behandelen uw klacht vertrouwelijk en delen hem alleen met wie nodig is voor een oplossing. Een klacht indienen heeft geen nadelige gevolgen voor uw werk of voor onze samenwerking.",
          "Een klacht indienen kost u niets.",
        ],
      },
      {
        id: "vastleggen",
        heading: "Hoe wij klachten vastleggen",
        blocks: [
          "Wij leggen elke klacht en de afhandeling vast in een klachtenregister. Wij bewaren die gegevens tot een jaar nadat de klacht is afgehandeld.",
        ],
      },
      {
        id: "niet-eens",
        heading: "Als u het niet eens bent met onze reactie",
        blocks: [
          "Groos is niet aangesloten bij een geschillencommissie. Bent u het niet eens met onze reactie, dan kunt u naar de bevoegde rechter.",
          "Voor sommige klachten kunt u ook terecht bij een andere instantie:",
          {
            list: [
              "over privacy bij de [Autoriteit Persoonsgegevens](https://autoriteitpersoonsgegevens.nl);",
              "over discriminatie bij het [College voor de Rechten van de Mens](https://www.mensenrechten.nl);",
              "over onderbetaling of onveilig werk bij de [Nederlandse Arbeidsinspectie](https://www.nlarbeidsinspectie.nl).",
            ],
          },
        ],
      },
      {
        id: "wijzigingen",
        heading: "Wijzigingen",
        blocks: [
          "Wij passen deze regeling aan als onze werkwijze of de wet verandert. Bovenaan staan het versienummer en de datum van de huidige versie.",
        ],
      },
    ],
  },
  en: {
    title: "Complaints procedure",
    metaDescription:
      "Do you have a complaint about Groos Personeelsdiensten? Read how to submit it, who handles it and when you will receive an answer.",
    intro:
      "We want everyone to be treated well by Groos Personeelsdiensten. If you are not satisfied, you can read here how to submit a complaint and what we do with it. This is a translation of the Dutch text. If the two versions differ, the Dutch version applies.",
    sections: [
      {
        id: "voor-wie",
        heading: "Who this procedure applies to",
        blocks: [
          "This procedure applies to job seekers, temporary workers, clients and everyone who deals with us. You can submit a complaint about how we treated you, about our way of working or about someone who works for Groos.",
        ],
      },
      {
        id: "onderwerpen",
        heading: "What you can complain about",
        blocks: [
          "For example, you can submit a complaint about:",
          {
            list: [
              "the way we communicate with you;",
              "the handling of an application, registration or request;",
              "the use of your personal data;",
              "unequal treatment or discrimination;",
              "your terms of employment or safety during your work through Groos.",
            ],
          },
          "If your complaint concerns the workplace at a client, we also discuss it with the client. We only do so if you agree.",
        ],
      },
      {
        id: "indienen",
        heading: "How to submit a complaint",
        blocks: [
          `Send your complaint by email to ${MAIL} with the subject "Complaint". You can also send a letter to ${ADDRESS}.`,
          `If you prefer to call, you can do so on ${PHONE}. We will then write down your complaint and send it to you to check.`,
          "Please include at least:",
          {
            list: [
              "your name and how we can reach you;",
              "what the complaint is about and when it happened;",
              "what you expect from us.",
            ],
          },
        ],
      },
      {
        id: "behandeling",
        heading: "What we do with your complaint",
        blocks: [
          "Within five working days of receipt you will receive a substantive response from us. If we need more time, we let you know within those five working days, with the reason and a new date.",
          "That new date is never later than four weeks after we received your complaint. At the end you always receive our decision and the reasons for it in writing.",
        ],
      },
      {
        id: "behandelaar",
        heading: "Who handles your complaint",
        blocks: ["Jimmy or Lorenzo handles your complaint. If the complaint concerns one of them, the other one handles it."],
      },
      {
        id: "vertrouwelijk",
        heading: "Confidential and without disadvantage",
        blocks: [
          "We treat your complaint confidentially and only share it with those who need it to find a solution. Submitting a complaint has no negative consequences for your work or for our collaboration.",
          "Submitting a complaint costs you nothing.",
        ],
      },
      {
        id: "vastleggen",
        heading: "How we record complaints",
        blocks: [
          "We record every complaint and how it was handled in a complaints register. We keep that data until one year after the complaint has been dealt with.",
        ],
      },
      {
        id: "niet-eens",
        heading: "If you disagree with our response",
        blocks: [
          "Groos is not affiliated with a disputes committee. If you disagree with our response, you can go to the competent court.",
          "For some complaints you can also turn to another body:",
          {
            list: [
              "about privacy, the Dutch Data Protection Authority ([Autoriteit Persoonsgegevens](https://autoriteitpersoonsgegevens.nl));",
              "about discrimination, the Netherlands Institute for Human Rights ([College voor de Rechten van de Mens](https://www.mensenrechten.nl));",
              "about underpayment or unsafe work, the [Netherlands Labour Authority](https://www.nlarbeidsinspectie.nl).",
            ],
          },
        ],
      },
      {
        id: "wijzigingen",
        heading: "Changes",
        blocks: [
          "We update this procedure when our way of working or the law changes. The version number and date of the current version are shown at the top.",
        ],
      },
    ],
  },
};

export async function generateMetadata({ params }: PageProps<"/[locale]/klachtenregeling">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const c = pickLegal(CONTENT, locale);
  return pageMetadata({ locale, path: ROUTES.klachtenregeling, title: c.title, description: c.metaDescription });
}

export default async function Page({ params }: PageProps<"/[locale]/klachtenregeling">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  const articlePrefix = locale === "en" ? "Article " : "Artikel ";
  return <LegalPage doc="complaints" content={pickLegal(CONTENT, locale)} articlePrefix={articlePrefix} />;
}
