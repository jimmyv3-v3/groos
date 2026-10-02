import type { Localized, WttaCopy } from "@/content/pages/types";

/**
 * Lange tekst van /werkgevers/wtta (spec 05 §4.7 en §6.5). U-vorm, feiten uit context/09 §1 en §4
 * (peildatum 2 oktober 2026). De status van Groos staat hier nergens; die komt alleen uit WttaStatus (CL-04).
 */
export const wttaPage = {
  nl: {
    // TODO bijwerken na elke mijlpaal uit de tijdlijn en uiterlijk op 31 december 2026; dan ook de datum in sources.intro aanpassen.
    reviewedAt: "2026-10-02",
    hero: {
      title: "Wat de Wtta betekent als u personeel inleent",
      lead: "Vanaf 1 januari 2028 mag u alleen nog inlenen bij een uitlener met een toelating of ontheffing, of bij een uitlener onder de overgangsregeling. Op deze pagina leest u wat er verandert en hoe u een uitzendbureau controleert.",
    },
    about: {
      title: "Wat de Wtta",
      accent: "voor de uitleenmarkt regelt",
      paragraphs: [
        "De Wet toelating terbeschikkingstelling van arbeidskrachten (Wtta) voegt een toelatingsplicht toe aan de Waadi, de wet die het uitlenen van arbeidskrachten regelt. Een uitlener mag dan alleen nog werknemers uitlenen met een toelating of ontheffing, of zolang hij onder de overgangsregeling valt.",
        "De Nederlandse Autoriteit Uitleenmarkt (NAU) beoordeelt of een uitlener aan de eisen voldoet. Zij kijkt onder meer naar de afdracht van loonheffingen, de identificatie van medewerkers, een waarborgsom en een inspectierapport.",
      ],
    },
    timeline: {
      title: "Zo verloopt de invoering",
      accent: "van de Wtta",
      intro: "De data komen uit de officiële bronnen onderaan deze pagina.",
      items: [
        {
          date: "2026-11-01",
          dateLabel: "1 november tot en met 31 december 2026",
          title: "Aanmelden voor de overgangsregeling",
          body: "Bestaande uitleners melden zich in deze periode aan via toelatinguitleenmarkt.nl. Wie zich op tijd aanmeldt, mag tijdens de beoordeling blijven uitlenen.",
          source: "toelatinguitleenmarkt.nl, geraadpleegd 2 oktober 2026",
        },
        {
          date: "2027-01-01",
          title: "De Wtta treedt in werking",
          body: "Het nieuwe hoofdstuk 3a van de Waadi gaat gelden en het toelatingsstelsel start.",
          source: "wetten.overheid.nl, geraadpleegd 2 oktober 2026",
        },
        {
          date: "2027-05-01",
          dateLabel: "1 mei tot en met 30 juni 2027",
          title: "Uitleners vragen hun toelating aan",
          body: "In deze periode dienen uitleners hun aanvraag voor een toelating of ontheffing in bij de NAU.",
          source: "toelatinguitleenmarkt.nl, geraadpleegd 2 oktober 2026",
        },
        {
          date: "2027-07-01",
          title: "Het openbare register gaat online",
          body: "De NAU begint met beoordelen en publiceert het openbare register. U zoekt daar gratis op welke status een uitlener heeft.",
          source: "toelatinguitleenmarkt.nl, geraadpleegd 2 oktober 2026",
        },
        {
          date: "2028-01-01",
          title: "De handhaving start",
          body: "Vanaf deze datum mag u alleen inlenen bij een toegelaten uitlener, een uitlener met ontheffing of een uitlener onder de overgangsregeling. De Nederlandse Arbeidsinspectie controleert dit.",
          source: "toelatinguitleenmarkt.nl (inleners), geraadpleegd 2 oktober 2026",
        },
        {
          date: "2028-01-01",
          title: "De Waadi-registratie bij de KvK vervalt",
          body: "Artikel 7a van de Waadi, de huidige registratieplicht, vervalt op deze datum.",
          source: "wetten.overheid.nl, geraadpleegd 2 oktober 2026",
        },
      ],
    },
    hirer: {
      title: "Wat u als inlener",
      accent: "zelf regelt",
      intro: "Deze punten komen uit de checklist voor inleners van de NAU.",
      items: [
        { text: "Leg vóór de start vast welke medewerker via welke uitlener bij u werkt." },
        { text: "Controleer vanaf 1 juli 2027 de status van de uitlener in het openbare register." },
        { text: "Spreek in het contract af dat de toelating de hele looptijd geldig blijft, en wat er gebeurt als die vervalt." },
        { text: "Werkt een medewerker via meer dan één uitlener bij u, leg dan ook dat vast en controleer elke uitlener." },
      ],
    },
    check: {
      title: "Zo controleert u",
      accent: "een uitzendbureau",
      intro: "Doe deze controle voordat een medewerker bij u begint.",
      steps: [
        {
          title: "Zoek de uitlener op",
          body: "Zoek het uitzendbureau op in het openbare register van de NAU via toelatinguitleenmarkt.nl.",
        },
        {
          title: "Bekijk status en datum",
          body: "Kijk of de uitlener is toegelaten, een ontheffing heeft of onder de overgangsregeling valt, en vanaf welke datum.",
        },
        {
          title: "Zet een melding aan",
          body: "Meld u aan voor berichten over deze uitlener, zodat u een schorsing of intrekking tot 4 weken vooraf ziet.",
        },
      ],
    },
    status: {
      title: "Waar Groos",
      accent: "nu staat",
      intro: "Hieronder staat de actuele fase van Groos Personeelsdiensten. Wij passen deze tekst aan zodra er iets verandert.",
    },
    liability: {
      title: "Aansprakelijkheid voor",
      accent: "loonheffingen en btw",
      intro: "Naast de Wtta blijft de inlenersaansprakelijkheid gelden.",
      paragraphs: [
        "Volgens artikel 34 van de Invorderingswet is een inlener aansprakelijk voor loonheffingen en btw die een uitlener niet afdraagt.",
        "U beperkt dat risico met een goede administratie, een verklaring betalingsgedrag van de uitlener en een storting op diens g-rekening. Een g-rekening is een geblokkeerde rekening voor het deel van de factuur dat bestemd is voor loonheffingen en btw.",
      ],
    },
    faq: {
      title: "Vragen over",
      accent: "de Wtta",
      items: [
        {
          q: "Vanaf wanneer moet ik een uitlener controleren?",
          a: "Vanaf 1 juli 2027, want dan gaat het openbare register online. Vanaf 1 januari 2028 mag u alleen nog inlenen bij een uitlener met een geldige status.",
          specific: false,
        },
        {
          q: "Wat gebeurt er als ik inleen bij een uitlener zonder toelating?",
          a: "Dan riskeert u een boete en moet u de samenwerking stoppen. De hoogte van de boetes ligt nog niet vast.",
          specific: false,
        },
        {
          q: "Geldt de Wtta ook voor één uitzendkracht voor één dag?",
          a: "Ja, de Wtta geldt voor elke vorm van inlenen, hoe kort ook. Ook voor één dag komt een uitzendkracht na 1 januari 2028 alleen via een uitlener met een geldige status.",
          specific: false,
        },
        {
          q: "Wat is de overgangsregeling precies?",
          a: "Bestaande uitleners die zich tussen 1 november en 31 december 2026 aanmelden, vallen onder de overgangsregeling. Zij mogen blijven uitlenen terwijl de NAU hun aanvraag beoordeelt, ook na 1 januari 2028.",
          specific: false,
        },
        {
          q: "Waar vind ik het openbare register?",
          a: "Het register staat vanaf 1 juli 2027 op toelatinguitleenmarkt.nl, de site van de NAU. Raadplegen is gratis.",
          specific: false,
        },
      ],
    },
    sources: {
      title: "Bronnen",
      intro: "Wij hebben deze bronnen geraadpleegd op 2 oktober 2026.",
      items: [
        { label: "Toelatinguitleenmarkt.nl, informatie voor inleners", href: "https://www.toelatinguitleenmarkt.nl/inleners" },
        {
          label: "Toelatinguitleenmarkt.nl, checklist voor inleners",
          href: "https://www.toelatinguitleenmarkt.nl/inleners/checklist-wat-moet-u-doen-als-inlener",
        },
        {
          label: "Toelatinguitleenmarkt.nl, controleren of een uitlener is toegelaten",
          href: "https://www.toelatinguitleenmarkt.nl/inleners/hoe-controleert-u-of-een-uitlener-is-toegelaten",
        },
        {
          label: "Toelatinguitleenmarkt.nl, aanmelden voor de overgangsregeling",
          href: "https://www.toelatinguitleenmarkt.nl/uitleners/welke-soorten-aanvraag-zijn-er/aanmelden-voor-de-overgangsregeling",
        },
        { label: "Wetten.overheid.nl, Waadi met hoofdstuk 3a", href: "https://wetten.overheid.nl/BWBR0009616/" },
        {
          label: "Belastingdienst, inlenersaansprakelijkheid",
          href: "https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/aangifte_betalen_en_toezicht/aansprakelijkheid/inlenersaansprakelijkheid/inlenersaansprakelijkheid",
        },
      ],
    },
    cta: {
      title: "Vragen over inlenen",
      accent: "via Groos?",
      body: "Bel of mail ons. Wij leggen u uit hoe wij werken en wat u vooraf van ons krijgt.",
    },
  },
  en: {
    // TODO update after every milestone in the timeline and no later than 31 December 2026; also update the date in sources.intro.
    reviewedAt: "2026-10-02",
    hero: {
      title: "What the Wtta means when you hire agency staff",
      lead: "From 1 January 2028, you may only hire staff from an agency that has an admission or exemption, or from an agency under the transitional scheme. On this page you can read what changes and how to check an employment agency.",
    },
    about: {
      title: "What the Wtta",
      accent: "sets out for staffing agencies",
      paragraphs: [
        "The Wtta (Wet toelating terbeschikkingstelling van arbeidskrachten), the Dutch act on the admission of agencies that supply workers, adds an admission requirement to the Waadi, the Dutch act that regulates the supply of workers by agencies. An agency may then only supply workers with an admission or exemption, or as long as it falls under the transitional scheme.",
        "The Nederlandse Autoriteit Uitleenmarkt (NAU), the new Dutch authority that admits agencies to the market, assesses whether an agency meets the requirements. It looks at matters such as the payment of payroll taxes, the identification of workers, a deposit and an inspection report.",
      ],
    },
    timeline: {
      title: "How the Wtta",
      accent: "comes into force",
      intro: "The dates come from the official sources at the bottom of this page.",
      items: [
        {
          date: "2026-11-01",
          dateLabel: "1 November to 31 December 2026",
          title: "Registering for the transitional scheme",
          body: "Existing agencies register during this period via toelatinguitleenmarkt.nl. Agencies that register in time may continue to supply workers during the assessment.",
          source: "toelatinguitleenmarkt.nl, accessed 2 October 2026",
        },
        {
          date: "2027-01-01",
          title: "The Wtta comes into force",
          body: "The new chapter 3a of the Waadi takes effect and the admission system starts.",
          source: "wetten.overheid.nl, accessed 2 October 2026",
        },
        {
          date: "2027-05-01",
          dateLabel: "1 May to 30 June 2027",
          title: "Agencies apply for admission",
          body: "During this period, agencies submit their application for admission or exemption to the NAU.",
          source: "toelatinguitleenmarkt.nl, accessed 2 October 2026",
        },
        {
          date: "2027-07-01",
          title: "The public register goes online",
          body: "The NAU starts its assessments and publishes the public register. There you can look up the status of an agency free of charge.",
          source: "toelatinguitleenmarkt.nl, accessed 2 October 2026",
        },
        {
          date: "2028-01-01",
          title: "Enforcement starts",
          body: "From this date, you may only hire staff from an admitted agency, an agency with an exemption or an agency under the transitional scheme. The Netherlands Labour Authority enforces this.",
          source: "toelatinguitleenmarkt.nl (hirers), accessed 2 October 2026",
        },
        {
          date: "2028-01-01",
          title: "Waadi registration with the Chamber of Commerce (KvK) ends",
          body: "Article 7a of the Waadi, the current registration requirement, ends on this date.",
          source: "wetten.overheid.nl, accessed 2 October 2026",
        },
      ],
    },
    hirer: {
      title: "What you arrange",
      accent: "as the hirer",
      intro: "These points come from the NAU checklist for hirers.",
      items: [
        { text: "Before the start, record which worker works for you through which agency." },
        { text: "From 1 July 2027, check the status of the agency in the public register." },
        { text: "Agree in the contract that the admission stays valid for the whole term, and what happens if it lapses." },
        { text: "If a worker comes to you through more than one agency, record this too and check every agency." },
      ],
    },
    check: {
      title: "How to check",
      accent: "an employment agency",
      intro: "Carry out this check before a worker starts with you.",
      steps: [
        {
          title: "Look up the agency",
          body: "Search for the employment agency in the public register of the NAU via toelatinguitleenmarkt.nl.",
        },
        {
          title: "Check status and date",
          body: "See whether the agency is admitted, has an exemption or falls under the transitional scheme, and from which date.",
        },
        {
          title: "Turn on notifications",
          body: "Sign up for updates about this agency, so you see a suspension or withdrawal up to 4 weeks in advance.",
        },
      ],
    },
    status: {
      title: "Where Groos",
      accent: "stands today",
      intro: "Below you can see the current phase of Groos Personeelsdiensten. We update this text as soon as something changes.",
    },
    liability: {
      title: "Liability for",
      accent: "payroll taxes and VAT",
      intro: "Hirer liability continues to apply alongside the Wtta.",
      paragraphs: [
        "Under article 34 of the Collection of State Taxes Act (Invorderingswet), a hirer is liable for payroll taxes and VAT that an agency fails to pay.",
        "You limit this risk with good records, a statement of payment history from the agency and a payment into its G account (g-rekening). A G account is a blocked bank account for the part of the invoice that is meant for payroll taxes and VAT.",
      ],
    },
    faq: {
      title: "Questions about",
      accent: "the Wtta",
      items: [
        {
          q: "From when do I need to check an agency?",
          a: "From 1 July 2027, because that is when the public register goes online. From 1 January 2028, you may only hire staff from an agency with a valid status.",
          specific: false,
        },
        {
          q: "What happens if I hire from an agency without admission?",
          a: "Then you risk a fine and you must stop working with that agency. The amounts of the fines have not been set yet.",
          specific: false,
        },
        {
          q: "Does the Wtta also apply to one temporary worker for one day?",
          a: "Yes, the Wtta applies to every form of hiring agency staff, however short. After 1 January 2028, even a worker for one day must come through an agency with a valid status.",
          specific: false,
        },
        {
          q: "What exactly is the transitional scheme?",
          a: "Existing agencies that register between 1 November and 31 December 2026 fall under the transitional scheme. They may continue to supply workers while the NAU assesses their application, also after 1 January 2028.",
          specific: false,
        },
        {
          q: "Where can I find the public register?",
          a: "From 1 July 2027, the register is on toelatinguitleenmarkt.nl, the website of the NAU. Consulting it is free of charge.",
          specific: false,
        },
      ],
    },
    sources: {
      title: "Sources",
      intro: "We consulted these sources on 2 October 2026.",
      items: [
        { label: "Toelatinguitleenmarkt.nl, information for hirers (Dutch)", href: "https://www.toelatinguitleenmarkt.nl/inleners" },
        {
          label: "Toelatinguitleenmarkt.nl, checklist for hirers (Dutch)",
          href: "https://www.toelatinguitleenmarkt.nl/inleners/checklist-wat-moet-u-doen-als-inlener",
        },
        {
          label: "Toelatinguitleenmarkt.nl, checking whether an agency is admitted (Dutch)",
          href: "https://www.toelatinguitleenmarkt.nl/inleners/hoe-controleert-u-of-een-uitlener-is-toegelaten",
        },
        {
          label: "Toelatinguitleenmarkt.nl, registering for the transitional scheme (Dutch)",
          href: "https://www.toelatinguitleenmarkt.nl/uitleners/welke-soorten-aanvraag-zijn-er/aanmelden-voor-de-overgangsregeling",
        },
        { label: "Wetten.overheid.nl, the Waadi including chapter 3a (Dutch)", href: "https://wetten.overheid.nl/BWBR0009616/" },
        {
          label: "Dutch Tax Administration, hirer liability (Dutch)",
          href: "https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/aangifte_betalen_en_toezicht/aansprakelijkheid/inlenersaansprakelijkheid/inlenersaansprakelijkheid",
        },
      ],
    },
    cta: {
      title: "Questions about hiring staff",
      accent: "through Groos?",
      body: "Call or email us. We explain how we work and what you receive from us in advance.",
    },
  },
} satisfies Localized<WttaCopy>;
