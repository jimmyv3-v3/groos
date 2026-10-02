import {
  AlertTriangle,
  Award,
  Clock,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  UserCheck,
} from "lucide-react";
import type { ServiceCopy, ServicePage } from "./types";

/**
 * Lege dienstpagina voor het startpunt van de repo, zodat elke dienst in de
 * lijst al een werkende pagina heeft. Vervang elk bestand dat dit gebruikt door
 * echte content in de vorm van ./dienst-een.ts en verwijder dit bestand zodra
 * geen enkele dienst het nog importeert.
 */
function nlCopy(name: string): ServiceCopy {
  return {
    title: `TODO ${name}`,
    metaDescription: `TODO Metaomschrijving voor ${name} van 140 tot 160 tekens.`,
    lead: `TODO Introductie van ${name} in twee tot drie zinnen.`,
    whatTitle: "TODO Wat wij voor u doen,",
    whatAccent: "TODO accentwoorden",
    whatIntro: "TODO Eén of twee zinnen over de aanpak.",
    included: ["TODO Onderdeel 1", "TODO Onderdeel 2", "TODO Onderdeel 3", "TODO Onderdeel 4"],
    urgencyTitle: "TODO Uitstellen kost u meer dan",
    urgencyAccent: "TODO accentwoorden",
    urgencyIntro: "TODO Eén zin over het risico van niets doen.",
    stakes: [
      { title: "TODO Risico 1", body: "TODO Twee zinnen over dit risico." },
      { title: "TODO Risico 2", body: "TODO Twee zinnen over dit risico." },
      { title: "TODO Risico 3", body: "TODO Twee zinnen over dit risico." },
    ],
    ctaTitle: "TODO Kop van de tussentijdse oproep",
    ctaSubtitle: "TODO Belofte en reactietijd in één of twee zinnen.",
    featureHeading: "Waarom kiezen voor",
    featureAccent: "TODO Bedrijfsnaam",
    features: [
      { title: "TODO Voordeel 1", body: "TODO Eén zin." },
      { title: "TODO Voordeel 2", body: "TODO Eén zin." },
      { title: "TODO Voordeel 3", body: "TODO Eén zin." },
      { title: "TODO Voordeel 4", body: "TODO Eén zin." },
    ],
    faqs: [
      { q: "TODO Vraag 1?", a: "TODO Antwoord." },
      { q: "TODO Vraag 2?", a: "TODO Antwoord." },
      { q: "TODO Vraag 3?", a: "TODO Antwoord." },
    ],
    jsonLdServiceType: `TODO ${name}`,
    jsonLdDescription: `TODO Feitelijke omschrijving van ${name}.`,
  };
}

function enCopy(name: string): ServiceCopy {
  return {
    title: `TODO ${name}`,
    metaDescription: `TODO Meta description for ${name}, 140 to 160 characters.`,
    lead: `TODO Introduction to ${name} in two to three sentences.`,
    whatTitle: "TODO What we do for you,",
    whatAccent: "TODO accent words",
    whatIntro: "TODO One or two sentences about the approach.",
    included: ["TODO Item 1", "TODO Item 2", "TODO Item 3", "TODO Item 4"],
    urgencyTitle: "TODO Putting it off costs more than",
    urgencyAccent: "TODO accent words",
    urgencyIntro: "TODO One sentence about the risk of doing nothing.",
    stakes: [
      { title: "TODO Risk 1", body: "TODO Two sentences about this risk." },
      { title: "TODO Risk 2", body: "TODO Two sentences about this risk." },
      { title: "TODO Risk 3", body: "TODO Two sentences about this risk." },
    ],
    ctaTitle: "TODO Mid-page call to action heading",
    ctaSubtitle: "TODO Promise and response time in one or two sentences.",
    featureHeading: "Why choose",
    featureAccent: "TODO Company name",
    features: [
      { title: "TODO Benefit 1", body: "TODO One sentence." },
      { title: "TODO Benefit 2", body: "TODO One sentence." },
      { title: "TODO Benefit 3", body: "TODO One sentence." },
      { title: "TODO Benefit 4", body: "TODO One sentence." },
    ],
    faqs: [
      { q: "TODO Question 1?", a: "TODO Answer." },
      { q: "TODO Question 2?", a: "TODO Answer." },
      { q: "TODO Question 3?", a: "TODO Answer." },
    ],
    jsonLdServiceType: `TODO ${name}`,
    jsonLdDescription: `TODO Factual description of ${name}.`,
  };
}

export function placeholderService(name: { nl: string; en: string }): ServicePage {
  return {
    stakeIcons: [TrendingDown, AlertTriangle, Clock],
    featureIcons: [Award, Sparkles, ShieldCheck, UserCheck],
    nl: nlCopy(name.nl),
    en: enCopy(name.en),
  };
}
