// TODO (jurist): concepttekst versie 0.1, laten toetsen vóór livegang (spec 09 §12).
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { contact } from "@/lib/site";
import { resolveLocale } from "@/i18n/locale";
import { pageMetadata } from "@/lib/seo";
import { getLegalDoc } from "@/lib/legal";
import { LegalPage, pickLegal, type LegalContent } from "@/components/legal/legal-page";

// Tekst uit spec 09 §6.5. De cookietabel volgt de waarneming in de browser
// (spec 09 §10 blok B stap 2); die waarneming wordt herhaald op de eerste
// preview-deploy, omdat Analytics en BotID in ontwikkeling niet draaien.

const MAIL = `[${contact.email}](${contact.emailHref})`;

const CONTENT: { nl: LegalContent; en: LegalContent } = {
  nl: {
    title: "Cookieverklaring",
    metaDescription:
      "Groos Personeelsdiensten gebruikt alleen cookies die nodig zijn en meet bezoek zonder cookies. Hier leest u welke cookies dat zijn en waarom.",
    intro:
      "Op deze pagina leest u welke cookies onze website gebruikt en waarom. Wij gebruiken alleen cookies die nodig zijn, daarom vragen wij u niet om toestemming.",
    sections: [
      {
        id: "wat-zijn-cookies",
        heading: "Wat cookies zijn",
        blocks: [
          "Een cookie is een klein tekstbestand dat een website op uw computer of telefoon opslaat. Daarmee onthoudt de website bijvoorbeeld welke taal u heeft gekozen.",
        ],
      },
      {
        id: "welke-cookies",
        heading: "Welke cookies wij gebruiken",
        blocks: [
          "Onze website gebruikt alleen functionele cookies. Die zijn nodig om de website goed te laten werken, en daarvoor is volgens de Telecommunicatiewet geen toestemming nodig.",
          {
            table: {
              caption: "Cookies op deze website",
              head: ["Naam", "Waarvoor", "Hoe lang", "Soort"],
              rows: [
                [
                  "NEXT_LOCALE",
                  "Onthoudt of u de website in het Nederlands of in het Engels bekijkt. U krijgt deze cookie alleen als u een taal kiest, of als u de website voor het eerst van buiten Nederland en België bezoekt.",
                  "Een jaar",
                  "Functioneel",
                ],
                [
                  "sb-…-auth-token",
                  "Houdt Jimmy en Lorenzo ingelogd in de beheeromgeving. Bezoekers van de website krijgen deze cookie niet.",
                  "Tot het uitloggen; TODO maximale duur na waarneming invullen",
                  "Functioneel",
                ],
              ],
            },
          },
        ],
      },
      {
        id: "statistieken",
        heading: "Statistieken zonder cookies",
        blocks: [
          "Wij meten het bezoek aan onze website met Vercel Web Analytics. Dat werkt zonder cookies en zonder iets op uw apparaat op te slaan.",
          "Wij zien daardoor hoeveel pagina's er worden bekeken en hoeveel formulieren er worden verstuurd. Wij kunnen u daarmee niet herkennen en niet volgen op andere websites.",
        ],
      },
      {
        id: "beveiliging",
        heading: "Beveiliging van formulieren",
        blocks: [
          // TODO (Djulan): zin "Daarbij plaatsen wij geen cookies." bevestigen met de waarneming op de eerste preview-deploy (spec 09 §12, BotID).
          "Bij het versturen van een formulier controleert Vercel BotID of het verzoek van een mens komt. Daarbij plaatsen wij geen cookies.",
          "Meer hierover leest u in onze [privacyverklaring](/privacyverklaring#website).",
        ],
      },
      {
        id: "geen-tracking",
        heading: "Geen advertentiecookies en geen inhoud van anderen",
        blocks: [
          "Wij gebruiken geen advertentiecookies en geen pixels van sociale media. Ook staan er op onze website geen ingesloten kaarten, video's of berichten van andere websites.",
          "Klikt u op een link naar bijvoorbeeld Google Maps, WhatsApp of LinkedIn, dan komt u op een andere website. Die website heeft eigen cookies en een eigen cookieverklaring.",
        ],
      },
      {
        id: "zelf-regelen",
        heading: "Cookies zelf verwijderen",
        blocks: [
          "U kunt cookies altijd verwijderen of blokkeren in de instellingen van uw browser. Verwijdert u de taalcookie, dan ziet u de website weer in de standaardtaal.",
        ],
      },
      {
        id: "wijzigingen",
        heading: "Wijzigingen",
        blocks: [
          "Gaan wij ooit cookies gebruiken waarvoor toestemming nodig is, dan vragen wij u die eerst. Deze verklaring passen wij dan ook aan.",
        ],
      },
      {
        id: "vragen",
        heading: "Vragen",
        blocks: [`Heeft u een vraag over cookies, mail dan naar ${MAIL}. Wij helpen u graag verder.`],
      },
    ],
  },
  en: {
    title: "Cookie statement",
    metaDescription:
      "Groos Personeelsdiensten only uses cookies that are necessary and measures visits without cookies. Read which cookies these are and why.",
    intro:
      "On this page you can read which cookies our website uses and why. We only use cookies that are necessary, which is why we do not ask for your consent. This is a translation of the Dutch text. If the two versions differ, the Dutch version applies.",
    sections: [
      {
        id: "wat-zijn-cookies",
        heading: "What cookies are",
        blocks: [
          "A cookie is a small text file that a website stores on your computer or phone. It lets the website remember, for example, which language you have chosen.",
        ],
      },
      {
        id: "welke-cookies",
        heading: "Which cookies we use",
        blocks: [
          "Our website only uses functional cookies. They are needed for the website to work properly, and under the Dutch Telecommunications Act no consent is required for them.",
          {
            table: {
              caption: "Cookies on this website",
              head: ["Name", "Purpose", "Duration", "Type"],
              rows: [
                [
                  "NEXT_LOCALE",
                  "Remembers whether you view the website in Dutch or in English. You only receive this cookie if you choose a language, or if you visit the website for the first time from outside the Netherlands and Belgium.",
                  "One year",
                  "Functional",
                ],
                [
                  "sb-…-auth-token",
                  "Keeps Jimmy and Lorenzo logged in to the admin environment. Visitors to the website do not receive this cookie.",
                  "Until logging out; TODO fill in the maximum duration after observation",
                  "Functional",
                ],
              ],
            },
          },
        ],
      },
      {
        id: "statistieken",
        heading: "Statistics without cookies",
        blocks: [
          "We measure visits to our website with Vercel Web Analytics. It works without cookies and without storing anything on your device.",
          "This shows us how many pages are viewed and how many forms are submitted. We cannot use it to recognise you or to follow you on other websites.",
        ],
      },
      {
        id: "beveiliging",
        heading: "Security of forms",
        blocks: [
          "When you submit a form, Vercel BotID checks whether the request comes from a person. We do not place any cookies for this.",
          "You can read more about this in our [privacy statement](/privacyverklaring#website).",
        ],
      },
      {
        id: "geen-tracking",
        heading: "No advertising cookies and no content from others",
        blocks: [
          "We do not use advertising cookies or social media pixels. Our website also contains no embedded maps, videos or posts from other websites.",
          "If you click a link to, for example, Google Maps, WhatsApp or LinkedIn, you go to another website. That website has its own cookies and its own cookie statement.",
        ],
      },
      {
        id: "zelf-regelen",
        heading: "Deleting cookies yourself",
        blocks: [
          "You can always delete or block cookies in your browser settings. If you delete the language cookie, you will see the website in the default language again.",
        ],
      },
      {
        id: "wijzigingen",
        heading: "Changes",
        blocks: [
          "If we ever start using cookies that require consent, we will ask you for it first. We will then also update this statement.",
        ],
      },
      {
        id: "vragen",
        heading: "Questions",
        blocks: [`Do you have a question about cookies? Send an email to ${MAIL}. We are happy to help.`],
      },
    ],
  },
};

export async function generateMetadata({ params }: PageProps<"/[locale]/cookieverklaring">): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  const c = pickLegal(CONTENT, locale);
  return pageMetadata({ locale, path: getLegalDoc("cookies").path, title: c.title, description: c.metaDescription });
}

export default async function Page({ params }: PageProps<"/[locale]/cookieverklaring">) {
  const { locale: raw } = await params;
  const locale = resolveLocale(raw);
  setRequestLocale(locale);
  return <LegalPage doc="cookies" content={pickLegal(CONTENT, locale)} />;
}
