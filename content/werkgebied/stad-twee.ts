import type { City } from "./types";

// TODO: vervang door de tweede stad uit het werkgebied, in de vorm van ./stad-een.ts.
const city: City = {
  slug: "stad-twee",
  name: "TODO Stad twee",
  province: "TODO Provincie",
  nl: {
    metaTitle: "TODO Hoofddienst TODO Stad twee",
    metaDescription:
      "TODO Metaomschrijving van 140 tot 160 tekens met de dienst, de stad en een lokaal detail.",
    keywords: ["TODO dienst stad"],
    h1: "TODO Hoofddiensten in TODO Stad twee",
    lead: "TODO Twee zinnen met een lokaal detail.",
    imageAlt: "TODO Beschrijving van de foto",
    introBody: ["TODO Eerste lokale alinea.", "TODO Tweede lokale alinea."],
    faq: [
      { q: "TODO Lokale vraag 1?", a: "TODO Antwoord." },
      { q: "TODO Lokale vraag 2?", a: "TODO Antwoord." },
      { q: "TODO Lokale vraag 3?", a: "TODO Antwoord." },
    ],
  },
  en: {
    metaTitle: "TODO Main service TODO City two",
    metaDescription:
      "TODO Meta description of 140 to 160 characters with the service, the city and a local detail.",
    keywords: ["TODO service city"],
    h1: "TODO Main services in TODO City two",
    lead: "TODO Two sentences with a local detail.",
    imageAlt: "TODO Description of the photo",
    introBody: ["TODO First local paragraph.", "TODO Second local paragraph."],
    faq: [
      { q: "TODO Local question 1?", a: "TODO Answer." },
      { q: "TODO Local question 2?", a: "TODO Answer." },
      { q: "TODO Local question 3?", a: "TODO Answer." },
    ],
  },
};

export default city;
