import type { Localized, WerkzoekendenCopy } from "@/content/pages/types";

/**
 * Lange tekst van /werkzoekenden (spec 05 §4.5 en §6.5). Je-vorm, B1.
 * Items met `claim` zijn extra en blijven verborgen tot de claim in lib/claims.ts bevestigd is.
 */
export const werkzoekendenPage = {
  nl: {
    hero: {
      title: "Praktisch werk in Den Haag, met een vaste contactpersoon",
      lead: "Wij helpen je aan werk als glazenwasser, schoonmaker, logistiek medewerker, verhuizer of hulpkracht in de bouw en sloop. Solliciteren is gratis en kan ook zonder cv.",
    },
    beroepen: {
      title: "Kies het werk",
      accent: "dat bij je past",
      intro: "Per beroep lees je wat je doet, wat je verdient en hoe laat je begint.",
    },
    promises: {
      title: "Wat je van ons",
      accent: "mag verwachten",
      intro: "Groos Personeelsdiensten is een uitzendbureau in Den Haag. Je spreekt steeds dezelfde twee mensen.",
      items: [
        {
          title: "Solliciteren kost niets",
          body: "Wij vragen nooit geld voor werk, voor werkkleding of voor beschermingsmiddelen.",
          icon: "check",
        },
        {
          title: "Hetzelfde loon als vaste collega's",
          body: "Volgens de wet krijg je hetzelfde loon als vaste collega's die hetzelfde werk doen. Dat geldt vanaf je eerste werkdag.",
          icon: "wage",
        },
        {
          title: "Je uurloon staat bij elke vacature",
          body: "Bij elke vacature zie je het bruto uurloon. Bruto is je loon voordat er belasting en premies af gaan.",
          icon: "payslip",
        },
        {
          title: "Eén vaste contactpersoon",
          body: "Jimmy of Lorenzo belt je en blijft je contactpersoon. Heb je een vraag over je werk, dan bel of app je gewoon.",
          icon: "phone",
        },
        {
          title: "Weekloon",
          body: "Je krijgt je loon elke week op je rekening. Op je loonstrook zie je je uren en wat je hebt verdiend.",
          icon: "payslip",
          claim: "weeklyPay",
        },
        // TODO claim certificateSupport: bevestigen welke certificaten (VCA, heftruck, IPAF) en wie de cursus betaalt (CL-11, VR-12).
        {
          title: "Hulp bij certificaten",
          body: "Heb je nog geen VCA, een diploma voor veilig werken, dan helpen wij je om het te halen. Wij vertellen je waar en wanneer je de cursus doet.",
          icon: "learn",
          claim: "certificateSupport",
        },
      ],
    },
    rights: {
      title: "Dit zijn je rechten",
      accent: "als uitzendkracht",
      intro: "Als uitzendkracht werk je via Groos bij een ander bedrijf. Dan gelden deze regels.",
      items: [
        { text: "Je tekent een uitzendovereenkomst, een contract met Groos voor werk bij een bedrijf" },
        { text: "Je krijgt hetzelfde loon als vaste collega's die hetzelfde werk doen" },
        { text: "Je krijgt 8 procent vakantiegeld bovenop je bruto loon" },
        { text: "Beschermingsmiddelen die je nodig hebt, zoals een helm of handschoenen, krijg je gratis" },
        { text: "Je betaalt nooit geld om werk te krijgen" },
        { text: "Je identiteitsbewijs en burgerservicenummer laat je pas bij de start zien, nooit online" },
        { text: "Ben je ziek, dan meld je dat bij Groos en bij het bedrijf" },
      ],
    },
    vacancies: {
      title: "Deze vacatures staan",
      accent: "nu open",
      intro: "Bij elke vacature staan het bruto uurloon, de werktijden en de plaats.",
      emptyTitle: "Er staan nu geen vacatures open",
      emptyBody: "Schrijf je in, dan bellen wij je zodra er werk is. Je kunt ons ook een WhatsApp-bericht sturen.",
    },
    compare: {
      title: "Zo werkt Groos voor werkzoekenden",
      accent: "en werkgevers",
      intro: "In de tabel zie je wat wij doen voor mensen die werk zoeken en voor bedrijven.",
      caption: "Wat Groos doet voor werkzoekenden en werkgevers",
      jobseekerTitle: "Werkzoekenden",
      employerTitle: "Werkgevers",
      jobseekerLinkLabel: "Naar de pagina voor werkzoekenden",
      employerLinkLabel: "Naar de pagina voor werkgevers",
      rows: [
        {
          label: "Wat Groos doet",
          jobseeker: "Werk zoeken dat past bij ervaring, uren en woonplaats",
          employer: "Mensen zoeken die passen bij het werk en de werktijden",
        },
        { label: "Kosten", jobseeker: "Gratis, ook inschrijven", employer: "Een uurtarief over gewerkte uren" },
        { label: "Contract", jobseeker: "Uitzendovereenkomst met Groos", employer: "Afspraken met Groos over de inzet" },
        { label: "Contact", jobseeker: "Jimmy of Lorenzo, op hun eigen nummer", employer: "Jimmy of Lorenzo, op hun eigen nummer" },
        { label: "Eerste stap", jobseeker: "Solliciteren of inschrijven", employer: "Personeel aanvragen of bellen" },
      ],
    },
    faq: {
      title: "Vragen die wij",
      accent: "vaak krijgen",
      items: [
        {
          q: "Kost solliciteren bij jullie iets?",
          a: "Nee, solliciteren en inschrijven zijn altijd gratis. Een uitzendbureau mag volgens de wet geen geld van je vragen voor werk.",
          specific: false,
        },
        {
          q: "Kan ik solliciteren zonder cv?",
          a: "Ja, een cv is niet nodig. Je naam, je telefoonnummer en je woonplaats zijn genoeg.",
          specific: false,
        },
        {
          q: "Moet ik Nederlands spreken?",
          a: "Dat hangt af van het werk, en het staat bij elke vacature. Je moet in elk geval de uitleg over veilig werken begrijpen.",
          specific: false,
        },
        {
          q: "Wat voor contract krijg ik?",
          a: "Je krijgt een uitzendovereenkomst met Groos. Groos is dan je werkgever en betaalt je loon, ook al werk je bij een ander bedrijf.",
          specific: false,
        },
        {
          q: "Krijg ik vakantiegeld en vakantiedagen?",
          a: "Ja, je krijgt 8 procent vakantiegeld over je bruto loon. Je bouwt ook vakantiedagen op als je werkt.",
          specific: false,
        },
        {
          q: "Welke papieren heb ik nodig om te beginnen?",
          a: "Bij de start neem je een geldig identiteitsbewijs, je BSN (burgerservicenummer) en je bankrekeningnummer mee. Je moet ook in Nederland mogen werken.",
          specific: false,
        },
        {
          q: "Wat gebeurt er als mijn werk stopt?",
          a: "Dan zoeken wij samen met je naar nieuw werk. Jimmy of Lorenzo belt je om te horen wat je wilt en wanneer je kunt.",
          specific: false,
        },
        // TODO claim housing: het antwoord gaat uit van "nee" (spec 09 VR-15, geen huisvesting in fase 1). Regelt Groos wel huisvesting, dan alleen met SNF-keur en een los huurcontract, en dit antwoord herschrijven.
        {
          q: "Regelen jullie ook huisvesting voor mij?",
          a: "Nee, wij regelen geen huisvesting. Je zoekt zelf een plek om te wonen. Wij zoeken wel werk dat past bij de plek waar je woont.",
          specific: false,
          claim: "housing",
        },
      ],
    },
    cta: {
      title: "Klaar voor",
      accent: "je volgende baan?",
      body: "Solliciteer in een paar minuten op een vacature of schrijf je in. Jimmy of Lorenzo belt je om kennis te maken.",
    },
  },
  en: {
    hero: {
      title: "Practical work in The Hague, with one regular contact person",
      lead: "We help you find work as a window cleaner, cleaner, logistics worker, mover or construction and demolition labourer. Applying is free and you can apply without a CV.",
    },
    beroepen: {
      title: "Choose the work",
      accent: "that suits you",
      intro: "For each job you can read what you do, what you earn and what time you start.",
    },
    promises: {
      title: "What you can",
      accent: "expect from us",
      intro: "Groos Personeelsdiensten is an employment agency in The Hague. You always speak to the same two people.",
      items: [
        {
          title: "Applying costs nothing",
          body: "We never ask for money for work, work clothes or protective equipment.",
          icon: "check",
        },
        {
          title: "The same pay as permanent colleagues",
          body: "By law you get the same pay as permanent colleagues who do the same work. This applies from your first working day.",
          icon: "wage",
        },
        {
          title: "Your hourly wage is in every job",
          body: "Every job shows the gross hourly wage. Gross is your pay before tax and contributions are taken off.",
          icon: "payslip",
        },
        {
          title: "One regular contact person",
          body: "Jimmy or Lorenzo calls you and stays your contact person. If you have a question about your work, just call or send a message.",
          icon: "phone",
        },
        {
          title: "Weekly pay",
          body: "You get your pay in your bank account every week. Your payslip shows your hours and what you have earned.",
          icon: "payslip",
          claim: "weeklyPay",
        },
        // TODO claim certificateSupport: same as nl.
        {
          title: "Help with certificates",
          body: "If you do not have a VCA safety certificate yet, we help you get one. We tell you where and when you take the course.",
          icon: "learn",
          claim: "certificateSupport",
        },
      ],
    },
    rights: {
      title: "These are your rights",
      accent: "as a temporary worker",
      intro: "As a temporary worker, you work through Groos at another company. These rules then apply.",
      items: [
        { text: "You sign an agency work contract with Groos for work at a company" },
        { text: "You get the same pay as permanent colleagues who do the same work" },
        { text: "You get 8 percent holiday pay on top of your gross pay" },
        { text: "You get the protective equipment you need, such as a helmet or gloves, for free" },
        { text: "You never pay money to get work" },
        { text: "You only show your ID and citizen service number (BSN) when you start, never online" },
        { text: "If you are ill, you report it to Groos and to the company" },
      ],
    },
    vacancies: {
      title: "These jobs are",
      accent: "open now",
      intro: "Every job shows the gross hourly wage, the working hours and the place.",
      emptyTitle: "There are no open jobs right now",
      emptyBody: "Register with us and we call you when there is work. You can also send us a WhatsApp message.",
    },
    compare: {
      title: "How Groos works for job seekers",
      accent: "and employers",
      intro: "The table shows what we do for people who are looking for work and for companies.",
      caption: "What Groos does for job seekers and employers",
      jobseekerTitle: "Job seekers",
      employerTitle: "Employers",
      jobseekerLinkLabel: "Go to the page for job seekers",
      employerLinkLabel: "Go to the page for employers",
      rows: [
        {
          label: "What Groos does",
          jobseeker: "Finding work that suits experience, hours and home town",
          employer: "Finding people who suit the work and the working hours",
        },
        { label: "Costs", jobseeker: "Free, including registration", employer: "An hourly rate for the hours worked" },
        { label: "Contract", jobseeker: "Agency work contract with Groos", employer: "Agreements with Groos about the assignment" },
        { label: "Contact", jobseeker: "Jimmy or Lorenzo, on their own number", employer: "Jimmy or Lorenzo, on their own number" },
        { label: "First step", jobseeker: "Applying or registering", employer: "Requesting staff or calling" },
      ],
    },
    faq: {
      title: "Questions we",
      accent: "often get",
      items: [
        {
          q: "Does it cost anything to apply with you?",
          a: "No, applying and registering are always free. By law, an employment agency may not ask you for money for work.",
          specific: false,
        },
        {
          q: "Can I apply without a CV?",
          a: "Yes, you do not need a CV. Your name, your phone number and your home town are enough.",
          specific: false,
        },
        {
          q: "Do I need to speak Dutch?",
          a: "That depends on the work, and it is in every job advert. You always need to understand the instructions for working safely.",
          specific: false,
        },
        {
          q: "What kind of contract do I get?",
          a: "You get an agency work contract with Groos. Groos is then your employer and pays your wage, even though you work at another company.",
          specific: false,
        },
        {
          q: "Do I get holiday pay and days off?",
          a: "Yes, you get 8 percent holiday pay on your gross pay. You also build up paid days off while you work.",
          specific: false,
        },
        {
          q: "Which documents do I need to start?",
          a: "When you start, you bring a valid ID, your citizen service number (BSN) and your bank account number. You must also be allowed to work in the Netherlands.",
          specific: false,
        },
        {
          q: "What happens when my work stops?",
          a: "Then we look for new work together with you. Jimmy or Lorenzo calls you to hear what you want and when you can work.",
          specific: false,
        },
        // TODO claim housing: same as nl.
        {
          q: "Do you also arrange housing for me?",
          a: "No, we do not arrange housing. You find a place to live yourself. We do look for work that suits the place where you live.",
          specific: false,
          claim: "housing",
        },
      ],
    },
    cta: {
      title: "Ready for",
      accent: "your next job?",
      body: "Apply for a job or register with us in a few minutes. Jimmy or Lorenzo calls you to get to know you.",
    },
  },
} satisfies Localized<WerkzoekendenCopy>;
