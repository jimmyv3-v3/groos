import type { City } from "./types";

// TODO: vervang door de belangrijkste stad uit het werkgebied (slug = stadsnaam
// in kleine letters met koppeltekens, bijvoorbeeld "den-haag"). Voorbeeld van
// goed ingevulde lokale content: lib/werkgebied.ts in de J. Versseput-repo.
const city: City = {
  slug: "stad-een",
  name: "TODO Stad één",
  province: "TODO Provincie",
  nl: {
    metaTitle: "TODO Hoofddienst TODO Stad één",
    metaDescription:
      "TODO Metaomschrijving van 140 tot 160 tekens met de dienst, de stad en een kenmerkend lokaal detail, afgesloten met een uitnodiging voor een offerte.",
    keywords: ["TODO dienst stad", "TODO tweede dienst stad"],
    h1: "TODO Hoofddiensten in TODO Stad één",
    lead: "TODO Twee zinnen die laten zien dat wij deze stad en haar type panden of klanten kennen.",
    imageAlt: "TODO Beschrijving van de foto van deze stad",
    introBody: [
      "TODO Eerste alinea met echte lokale details, zoals wijken, type panden en de klanten die wij hier bedienen.",
      "TODO Tweede alinea over welke diensten wij hier leveren en in welk ritme.",
    ],
    faq: [
      { q: "TODO Werken jullie in heel TODO Stad één en omgeving?", a: "TODO Antwoord met de omliggende plaatsen." },
      { q: "TODO Lokale vraag over deze stad?", a: "TODO Antwoord in één tot drie zinnen." },
      { q: "TODO Hoe snel kunnen jullie hier starten?", a: "TODO Antwoord met de reactietijd." },
    ],
  },
  en: {
    metaTitle: "TODO Main service TODO City one",
    metaDescription:
      "TODO Meta description of 140 to 160 characters with the service, the city and a local detail, ending with an invitation to request a quote.",
    keywords: ["TODO service city", "TODO second service city"],
    h1: "TODO Main services in TODO City one",
    lead: "TODO Two sentences showing that we know this city and its buildings or customers.",
    imageAlt: "TODO Description of the photo of this city",
    introBody: [
      "TODO First paragraph with real local details.",
      "TODO Second paragraph about the services we provide here.",
    ],
    faq: [
      { q: "TODO Do you work throughout TODO City one?", a: "TODO Answer with the surrounding towns." },
      { q: "TODO Local question about this city?", a: "TODO Answer in one to three sentences." },
      { q: "TODO How quickly can you start here?", a: "TODO Answer with the response time." },
    ],
  },
};

export default city;
