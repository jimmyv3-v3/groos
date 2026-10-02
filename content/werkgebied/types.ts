/**
 * Tekst van één stadspagina in één taal. Elke stad krijgt eigen, unieke content
 * (lead, lokale alinea's en FAQ), zodat het geen dunne doorway-pagina's worden.
 */
export type CityCopy = {
  /** Afwijkende weergavenaam in deze taal, bijvoorbeeld "The Hague". */
  name?: string;
  /** Bijvoorbeeld "<dienst> <stad>"; de merknaam wordt automatisch toegevoegd. */
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  lead: string;
  imageAlt: string;
  /** Twee alinea's met echte lokale details: wijken, type panden, klanten. */
  introBody: string[];
  /** Drie of vier lokale vragen. */
  faq: { q: string; a: string }[];
};

export type City = {
  slug: string;
  name: string;
  province: string;
  /** Optionele heroafbeelding uit /public. */
  image?: string;
  nl: CityCopy;
  /** Engelse versie. Ontbreekt die, dan valt de pagina terug op Nederlands. */
  en?: CityCopy;
};

/** Samengevoegde weergave van één stad in één taal. */
export type CityView = Omit<City, "nl" | "en"> & CityCopy & { name: string };
