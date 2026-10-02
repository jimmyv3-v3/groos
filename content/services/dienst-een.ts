import {
  AlertTriangle,
  Award,
  Clock,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  UserCheck,
} from "lucide-react";
import type { ServicePage } from "./types";

// TODO: vervang deze voorbeelddienst door de eerste echte dienst. Hernoem dan
// ook het bestand en de slug (in ./index.ts, ./pages.ts en messages `services`).
// Een goed ingevuld voorbeeld van deze vorm staat in de J. Versseput-repo:
// app/[locale]/diensten/zonnepanelenreiniging/page.tsx (blok CONTENT).
const page: ServicePage = {
  stakeIcons: [TrendingDown, AlertTriangle, Clock],
  featureIcons: [Award, Sparkles, ShieldCheck, UserCheck],
  nl: {
    title: "TODO Naam van de dienst",
    metaDescription:
      "TODO Eén zin van 140 tot 160 tekens met de dienst, de doelgroep en de regio, afgesloten met een uitnodiging om een offerte aan te vragen.",
    lead: "TODO Twee tot drie zinnen die het probleem van de klant benoemen en uitleggen hoe wij dat oplossen, in de u-vorm.",
    whatTitle: "TODO Wat wij voor u doen,",
    whatAccent: "TODO accentwoorden",
    whatIntro:
      "TODO Eén of twee zinnen over de aanpak en waarom één vaste partner prettig is.",
    included: [
      "TODO Onderdeel dat bij deze dienst inbegrepen is",
      "TODO Tweede onderdeel",
      "TODO Derde onderdeel",
      "TODO Vierde onderdeel",
      "TODO Vijfde onderdeel",
    ],
    urgencyTitle: "TODO Uitstellen kost u meer dan",
    urgencyAccent: "TODO accentwoorden",
    urgencyIntro:
      "TODO Eén zin over wat er gebeurt als de klant dit laat liggen.",
    stakes: [
      {
        title: "TODO Eerste risico",
        body: "TODO Twee zinnen die dit risico concreet maken, zonder overdrijving.",
      },
      {
        title: "TODO Tweede risico",
        body: "TODO Twee zinnen die dit risico concreet maken, zonder overdrijving.",
      },
      {
        title: "TODO Derde risico",
        body: "TODO Twee zinnen die dit risico concreet maken, zonder overdrijving.",
      },
    ],
    ctaTitle: "TODO Kop van de oproep halverwege de pagina",
    ctaSubtitle:
      "TODO Eén of twee zinnen met de belofte en de reactietijd.",
    featureHeading: "Waarom kiezen voor",
    featureAccent: "TODO Bedrijfsnaam",
    features: [
      { title: "TODO Eerste voordeel", body: "TODO Eén zin die dit voordeel concreet maakt." },
      { title: "TODO Tweede voordeel", body: "TODO Eén zin die dit voordeel concreet maakt." },
      { title: "TODO Derde voordeel", body: "TODO Eén zin die dit voordeel concreet maakt." },
      { title: "TODO Vierde voordeel", body: "TODO Eén zin die dit voordeel concreet maakt." },
    ],
    faqs: [
      { q: "TODO Eerste veelgestelde vraag?", a: "TODO Antwoord in één tot drie volledige zinnen." },
      { q: "TODO Tweede veelgestelde vraag?", a: "TODO Antwoord in één tot drie volledige zinnen." },
      { q: "TODO Derde veelgestelde vraag?", a: "TODO Antwoord in één tot drie volledige zinnen." },
      { q: "TODO Vierde veelgestelde vraag?", a: "TODO Antwoord in één tot drie volledige zinnen." },
      { q: "TODO Wat kost deze dienst?", a: "TODO Waar de prijs van afhangt, met een uitnodiging voor een offerte." },
    ],
    jsonLdServiceType: "TODO Naam van de dienst",
    jsonLdDescription:
      "TODO Korte, feitelijke omschrijving van de dienst voor zoekmachines.",
  },
  en: {
    title: "TODO Service name",
    metaDescription:
      "TODO One sentence of 140 to 160 characters with the service, the audience and the region, ending with an invitation to request a quote.",
    lead: "TODO Two to three sentences that name the customer's problem and explain how we solve it.",
    whatTitle: "TODO What we do for you,",
    whatAccent: "TODO accent words",
    whatIntro:
      "TODO One or two sentences about the approach and why one dedicated partner helps.",
    included: [
      "TODO Something included in this service",
      "TODO Second item",
      "TODO Third item",
      "TODO Fourth item",
      "TODO Fifth item",
    ],
    urgencyTitle: "TODO Putting it off costs more than",
    urgencyAccent: "TODO accent words",
    urgencyIntro: "TODO One sentence about what happens if this is left undone.",
    stakes: [
      { title: "TODO First risk", body: "TODO Two sentences that make this risk concrete." },
      { title: "TODO Second risk", body: "TODO Two sentences that make this risk concrete." },
      { title: "TODO Third risk", body: "TODO Two sentences that make this risk concrete." },
    ],
    ctaTitle: "TODO Mid-page call to action heading",
    ctaSubtitle: "TODO One or two sentences with the promise and the response time.",
    featureHeading: "Why choose",
    featureAccent: "TODO Company name",
    features: [
      { title: "TODO First benefit", body: "TODO One sentence that makes this benefit concrete." },
      { title: "TODO Second benefit", body: "TODO One sentence that makes this benefit concrete." },
      { title: "TODO Third benefit", body: "TODO One sentence that makes this benefit concrete." },
      { title: "TODO Fourth benefit", body: "TODO One sentence that makes this benefit concrete." },
    ],
    faqs: [
      { q: "TODO First frequently asked question?", a: "TODO Answer in one to three full sentences." },
      { q: "TODO Second frequently asked question?", a: "TODO Answer in one to three full sentences." },
      { q: "TODO Third frequently asked question?", a: "TODO Answer in one to three full sentences." },
      { q: "TODO Fourth frequently asked question?", a: "TODO Answer in one to three full sentences." },
      { q: "TODO What does this service cost?", a: "TODO What the price depends on, with an invitation to request a quote." },
    ],
    jsonLdServiceType: "TODO Service name",
    jsonLdDescription: "TODO Short, factual description of the service for search engines.",
  },
};

export default page;
