import type { VacancyDetail } from "@/lib/data/types";

/**
 * Testfixtures van de seedvacatures 1001 tot en met 1007 (supabase/seed.sql,
 * spec 10) als VacancyDetail, voor eenheidstests van spec 06 en 12 en voor
 * een lokale controle zonder database. Alleen voor tests en ontwikkeling;
 * productiecode importeert dit bestand nooit. Datums zijn relatief aan `now`,
 * net als in de seed.
 */

const DAY = 24 * 60 * 60 * 1000;
// Contactbeheerders uit admin_profiles; de publieke site toont ze niet (B-60).
const BEHEERDER_A = { name: "Beheerder A", phoneE164: "+31683351985", whatsappE164: "+31683351985", photoUrl: null };
const BEHEERDER_B = { name: "Beheerder B", phoneE164: "+31612345678", whatsappE164: null, photoUrl: null };

const OCCUPATIONS = {
  glazenwasser: { nameNl: "Glazenwasser", pluralNl: "Glazenwassers", nameEn: "Window cleaner", pluralEn: "Window cleaners" },
  schoonmaker: { nameNl: "Schoonmaker", pluralNl: "Schoonmakers", nameEn: "Cleaner", pluralEn: "Cleaners" },
  "logistiek-medewerker": {
    nameNl: "Logistiek medewerker",
    pluralNl: "Logistiek medewerkers",
    nameEn: "Logistics worker",
    pluralEn: "Logistics workers",
  },
  verhuizer: { nameNl: "Verhuizer", pluralNl: "Verhuizers", nameEn: "Mover", pluralEn: "Movers" },
  "hulpkracht-bouw-en-sloop": {
    nameNl: "Hulpkracht bouw en sloop",
    pluralNl: "Hulpkrachten bouw en sloop",
    nameEn: "Construction and demolition labourer",
    pluralEn: "Construction and demolition labourers",
  },
} as const;

type Row = Pick<
  VacancyDetail,
  | "number"
  | "slug"
  | "title"
  | "summary"
  | "intro"
  | "tasks"
  | "requirements"
  | "offer"
  | "city"
  | "citySlug"
  | "hoursMin"
  | "hoursMax"
  | "shifts"
  | "salaryMin"
  | "salaryMax"
  | "requiredQualifications"
  | "preferredQualifications"
  | "trainingOffered"
  | "minAge18"
  | "minAgeReason"
  | "isFeatured"
  | "isUrgent"
> & {
  occupation: keyof typeof OCCUPATIONS;
  publishedDaysAgo: number;
  closesInDays: number;
  contact: VacancyDetail["contact"];
  closed?: { daysAgo: number; reason: NonNullable<VacancyDetail["closeReason"]> };
};

const ROWS: Row[] = [
  {
    number: 1001,
    slug: "glazenwasser-den-haag-1001",
    title: "Glazenwasser",
    summary: "Testvacature. Je wast ramen van kantoren en winkels in Den Haag, in een vaste ploeg.",
    intro:
      "Je maakt ramen en kozijnen van kantoren en winkels in Den Haag schoon. Je werkt overdag in een ploeg van drie collega's en begint om 07.00 uur.",
    tasks: [
      "Ramen wassen met een telescopisch wassysteem",
      "Kozijnen en deuren afnemen",
      "Werken vanaf een hoogwerker als dat nodig is",
      "De bus netjes achterlaten aan het eind van de dag",
    ],
    requirements: ["Je hebt rijbewijs B", "Je kunt goed tegen werken op hoogte"],
    offer: [
      "Een bruto uurloon tussen € 16,08 en € 17,50",
      "8 procent vakantiegeld bovenop je loon",
      "Wij regelen de IPAF-training als je die nog niet hebt",
    ],
    occupation: "glazenwasser",
    city: "Den Haag",
    citySlug: "den-haag",
    hoursMin: 32,
    hoursMax: 40,
    shifts: ["early", "day"],
    salaryMin: 16.08,
    salaryMax: 17.5,
    requiredQualifications: ["rijbewijs_b"],
    preferredQualifications: ["vca_basis", "ipaf"],
    trainingOffered: ["ipaf"],
    minAge18: true,
    minAgeReason: "work_at_height",
    isFeatured: true,
    isUrgent: false,
    publishedDaysAgo: 5,
    closesInDays: 40,
    contact: BEHEERDER_A,
  },
  {
    number: 1002,
    slug: "schoonmaker-kantoren-rijswijk-1002",
    title: "Schoonmaker kantoren",
    summary: "Testvacature. Je maakt 's avonds kantoren schoon in Rijswijk, 12 tot 20 uur per week.",
    intro:
      "Je maakt na kantoortijd werkplekken, keukens en toiletten schoon. Je werkt op maandag tot en met vrijdag tussen 18.00 en 22.00 uur.",
    tasks: ["Bureaus en vloeren schoonmaken", "Keukens en toiletten schoonmaken en bijvullen", "Afval scheiden en wegbrengen"],
    requirements: ["Je bent betrouwbaar en werkt graag zelfstandig"],
    offer: [
      "Een bruto uurloon tussen € 15,52 en € 16,08",
      "Een toeslag voor uren na 21.30 uur volgens de cao van de opdrachtgever",
      "Een vaste contactpersoon bij Groos",
    ],
    occupation: "schoonmaker",
    city: "Rijswijk",
    citySlug: "rijswijk",
    hoursMin: 12,
    hoursMax: 20,
    shifts: ["evening"],
    salaryMin: 15.52,
    salaryMax: 16.08,
    requiredQualifications: [],
    preferredQualifications: [],
    trainingOffered: [],
    minAge18: false,
    minAgeReason: null,
    isFeatured: false,
    isUrgent: false,
    publishedDaysAgo: 2,
    closesInDays: 43,
    contact: BEHEERDER_B,
  },
  {
    number: 1003,
    slug: "orderpicker-naaldwijk-1003",
    title: "Orderpicker",
    summary: "Testvacature. Je verzamelt bestellingen in een magazijn in Naaldwijk, ook op zaterdag.",
    intro:
      "Je verzamelt orders met een scanner en zet ze klaar voor de vrachtwagen. Je begint vroeg, meestal om 06.00 uur, en werkt ook op zaterdag.",
    tasks: [
      "Orders verzamelen met een scanner",
      "Rijden met een elektrische pallettruck",
      "Karren klaarzetten voor transport",
      "Het magazijn opgeruimd houden",
    ],
    requirements: ["Je kunt vroeg beginnen en op zaterdag werken"],
    offer: [
      "Een bruto uurloon tussen € 14,99 en € 16,20",
      "Wij regelen je EPT-certificaat als je dat nog niet hebt",
      "Werkschoenen en handschoenen krijg je kosteloos",
    ],
    occupation: "logistiek-medewerker",
    city: "Naaldwijk",
    citySlug: "naaldwijk",
    hoursMin: 32,
    hoursMax: 40,
    shifts: ["early", "weekend"],
    salaryMin: 14.99,
    salaryMax: 16.2,
    requiredQualifications: [],
    preferredQualifications: ["ept"],
    trainingOffered: ["ept"],
    minAge18: false,
    minAgeReason: null,
    isFeatured: false,
    isUrgent: true,
    publishedDaysAgo: 1,
    closesInDays: 44,
    contact: BEHEERDER_A,
  },
  {
    number: 1004,
    slug: "heftruckchauffeur-zoetermeer-1004",
    title: "Heftruckchauffeur",
    summary: "Testvacature. Je rijdt heftruck in een distributiecentrum in Zoetermeer, in vroege en late diensten.",
    intro:
      "Je laadt en lost vrachtwagens en zet pallets op de juiste plek in het magazijn. Je werkt de ene week vroeg en de andere week laat.",
    tasks: ["Vrachtwagens laden en lossen", "Pallets in de stellingen zetten", "Voorraad tellen", "Schade aan goederen melden"],
    requirements: ["Je hebt een geldig heftruckcertificaat", "Je kunt in wisselende diensten werken"],
    offer: [
      "Een bruto uurloon tussen € 15,60 en € 17,80",
      "Een toeslag voor late diensten volgens de cao van de opdrachtgever",
      "8 procent vakantiegeld bovenop je loon",
    ],
    occupation: "logistiek-medewerker",
    city: "Zoetermeer",
    citySlug: "zoetermeer",
    hoursMin: 36,
    hoursMax: 40,
    shifts: ["early", "evening"],
    salaryMin: 15.6,
    salaryMax: 17.8,
    requiredQualifications: ["heftruck"],
    preferredQualifications: [],
    trainingOffered: [],
    minAge18: true,
    minAgeReason: "forklift",
    isFeatured: false,
    isUrgent: false,
    publishedDaysAgo: 10,
    closesInDays: 35,
    contact: BEHEERDER_B,
  },
  {
    number: 1005,
    slug: "verhuizer-den-haag-1005",
    title: "Verhuizer",
    summary: "Testvacature. Je helpt bij verhuizingen van gezinnen en kantoren in Den Haag en omgeving.",
    intro:
      "Je pakt inboedels in, draagt meubels naar buiten en zet alles op het nieuwe adres weer neer. Je werkt in een ploeg en begint meestal om 07.30 uur.",
    tasks: [
      "Meubels demonteren en weer opbouwen",
      "Dozen en meubels sjouwen en in de wagen zetten",
      "Zorgen dat niets beschadigt",
      "Klanten netjes te woord staan",
    ],
    requirements: ["Je kunt de hele dag fysiek werken"],
    offer: ["Een bruto uurloon tussen € 14,99 en € 16,00", "Werk op zaterdag als je dat wilt", "Een vaste contactpersoon bij Groos"],
    occupation: "verhuizer",
    city: "Den Haag",
    citySlug: "den-haag",
    hoursMin: 24,
    hoursMax: 40,
    shifts: ["day", "weekend"],
    salaryMin: 14.99,
    salaryMax: 16,
    requiredQualifications: [],
    preferredQualifications: ["rijbewijs_b"],
    trainingOffered: [],
    minAge18: false,
    minAgeReason: null,
    isFeatured: true,
    isUrgent: false,
    publishedDaysAgo: 3,
    closesInDays: 42,
    contact: BEHEERDER_A,
  },
  {
    number: 1006,
    slug: "hulpkracht-sloop-den-haag-1006",
    title: "Hulpkracht sloop",
    summary: "Testvacature. Je helpt bij het strippen en slopen van woningen in Den Haag.",
    intro:
      "Je haalt keukens, plafonds en vloeren uit woningen die worden gerenoveerd. Je werkt van 07.00 tot 16.00 uur in een vaste ploeg.",
    tasks: ["Keukens en plafonds verwijderen", "Sloopafval scheiden en afvoeren", "De werkplek veilig en opgeruimd houden"],
    requirements: ["Je hebt VCA Basis of wilt het halen", "Je stopt en meldt het als je asbest vermoedt"],
    offer: [
      "Een bruto uurloon tussen € 15,98 en € 17,00",
      "Wij regelen de VCA-cursus als je die nog niet hebt",
      "Beschermingsmiddelen krijg je kosteloos",
    ],
    occupation: "hulpkracht-bouw-en-sloop",
    city: "Den Haag",
    citySlug: "den-haag",
    hoursMin: 40,
    hoursMax: 40,
    shifts: ["day"],
    salaryMin: 15.98,
    salaryMax: 17,
    requiredQualifications: ["vca_basis"],
    preferredQualifications: [],
    trainingOffered: ["vca_basis"],
    minAge18: true,
    minAgeReason: "construction_demolition",
    isFeatured: false,
    isUrgent: false,
    publishedDaysAgo: 7,
    closesInDays: 38,
    contact: BEHEERDER_B,
  },
  {
    number: 1007,
    slug: "opleveringsschoonmaker-delft-1007",
    title: "Opleveringsschoonmaker",
    summary: "Testvacature. Je maakt nieuwbouwwoningen in Delft schoon voor de oplevering.",
    intro:
      "Je verwijdert bouwstof, verfspatten en kitresten in nieuwe woningen. Je werkt overdag in een ploeg die per project werkt.",
    tasks: ["Ramen en kozijnen schoonmaken", "Vloeren stofvrij maken", "Sanitair en keukens schoonmaken"],
    requirements: ["Je werkt nauwkeurig"],
    offer: ["Een bruto uurloon tussen € 16,08 en € 16,70", "8 procent vakantiegeld bovenop je loon"],
    occupation: "schoonmaker",
    city: "Delft",
    citySlug: "delft",
    hoursMin: 32,
    hoursMax: 38,
    shifts: ["day"],
    salaryMin: 16.08,
    salaryMax: 16.7,
    requiredQualifications: [],
    preferredQualifications: ["vca_basis"],
    trainingOffered: [],
    minAge18: false,
    minAgeReason: null,
    isFeatured: false,
    isUrgent: false,
    publishedDaysAgo: 25,
    closesInDays: 20,
    contact: BEHEERDER_A,
    closed: { daysAgo: 5, reason: "filled" },
  },
];

export function fixtureVacancies(now: Date = new Date()): VacancyDetail[] {
  const at = (days: number) => new Date(now.getTime() + days * DAY).toISOString();
  return ROWS.map(({ occupation, publishedDaysAgo, closesInDays, closed, ...row }) => ({
    ...row,
    id: `00000000-0000-4000-8000-00000000${row.number}`,
    path: `/vacatures/${row.slug}` as const,
    occupation: { slug: occupation, ...OCCUPATIONS[occupation] },
    locationLabel: null,
    contractType: "temp_agency",
    publishedAt: at(-publishedDaysAgo),
    closesAt: at(closesInDays),
    state: closed ? "closed" : "open",
    extra: null,
    seoTitle: null,
    seoDescription: null,
    postalCode: null,
    province: "Zuid-Holland",
    positionsCount: 1,
    salaryNote: null,
    educationLevel: "none",
    experienceLevel: "none",
    experienceMonths: null,
    startAsap: true,
    startDate: null,
    workplaceLanguage: null,
    allowWhatsappApply: true,
    asksDrivingLicenseB:
      row.requiredQualifications.includes("rijbewijs_b") || row.preferredQualifications.includes("rijbewijs_b"),
    imageUrl: null,
    closedAt: closed ? at(-closed.daysAgo) : null,
    closeReason: closed ? closed.reason : null,
    updatedAt: at(-publishedDaysAgo),
  }));
}

export function fixtureVacancy(number: number, now?: Date): VacancyDetail {
  const found = fixtureVacancies(now).find((v) => v.number === number);
  if (!found) throw new Error(`Geen fixture voor vacature ${number}`);
  return found;
}
