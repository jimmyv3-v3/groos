import type { Localized, WerkgeversCopy } from "@/content/pages/types";

/**
 * Lange tekst van /werkgevers (spec 05 §4.6 en §6.5). U-vorm.
 * Items met `claim` zijn extra en blijven verborgen tot de claim in lib/claims.ts bevestigd is.
 */
export const werkgeversPage = {
  nl: {
    hero: {
      title: "Personeel voor praktisch werk in Den Haag en omgeving",
      lead: "Wij leveren mensen voor schoonmaak en glasbewassing, logistiek en verhuizen, en bouw, sloop en infra. U regelt uw aanvraag met één vast aanspreekpunt in Den Haag.",
    },
    supply: {
      title: "Dit regelt Groos",
      accent: "voor uw bedrijf",
      intro: "Groos Personeelsdiensten is een uitzendbureau in Den Haag. Wij regelen het contract, het loon en de administratie van de mensen die bij u werken.",
      items: [
        {
          title: "Eén vaste contactpersoon",
          body: "Ons team neemt uw aanvraag aan en blijft uw aanspreekpunt zolang de inzet loopt.",
          icon: "phone",
        },
        // Werkwijze zonder getal (categorie B, spec 05 §6.5). Een harde belofte van persoonlijke screening valt onder claim personalIntake.
        {
          title: "Kandidaten na een gesprek",
          body: "Wij spreken kandidaten eerst over het werk, de werktijden en hun ervaring. Daarna stellen wij aan u voor wie bij de opdracht past.",
          icon: "person",
          claim: "personalIntake",
        },
        {
          title: "Contract en loon via Groos",
          body: "Groos is de werkgever van de uitzendkracht en betaalt het loon en het vakantiegeld. U betaalt een uurtarief over de gewerkte uren.",
          icon: "payslip",
        },
        // TODO claim replacement: termijn voor vervanging bevestigen en dan in de tekst noemen.
        {
          title: "Vervanging bij uitval",
          body: "Valt een medewerker onverwacht uit, dan zoeken wij een vervanger. Wij houden u op de hoogte tot de nieuwe medewerker begint.",
          icon: "team",
          claim: "replacement",
        },
      ],
    },
    beroepen: {
      title: "Mensen voor tien soorten",
      accent: "praktisch werk",
      intro: "Per beroep leest u welke taken de medewerkers doen en welke certificaten vaak gevraagd worden.",
    },
    agency: {
      title: "Uitzenden",
      accent: "in het kort",
      intro: "Bij uitzenden werkt een medewerker van Groos tijdelijk in uw bedrijf.",
      items: [
        {
          term: "Werkgever van de medewerker",
          description: "Groos Personeelsdiensten is de werkgever. U geeft leiding op de werkplek en verdeelt het werk.",
        },
        {
          term: "Wanneer handig",
          description: "Bij drukte, seizoenswerk of vervanging, of als u eerst wilt zien of iemand bij uw team past.",
        },
        {
          term: "Hoe u betaalt",
          description: "Een uurtarief over de gewerkte uren, volgens een voorstel dat u vooraf van ons krijgt.",
        },
        {
          term: "Veiligheid op de werkplek",
          description: "Volgens de Arbowet zorgt u als inlener voor instructie en een veilige werkplek.",
        },
      ],
    },
    legal: {
      title: "Wat de wet vraagt",
      accent: "van ons en van u",
      intro: "Uitzenden heeft eigen regels voor loon, veiligheid en belastingen. Wij leggen ze u vooraf uit.",
      items: [
        {
          text: "Een uitzendkracht krijgt een gelijkwaardige beloning, dus minimaal hetzelfde loon als uw medewerkers in een vergelijkbare functie. U geeft ons daarvoor vóór de start uw loonschaal en toeslagen door.",
        },
        {
          text: "Als inlener bent u volgens de Invorderingswet aansprakelijk voor loonheffingen en btw die een uitlener niet afdraagt.",
        },
        {
          text: "Volgens de Arbowet geldt u als werkgever voor de veiligheid op de werkplek.",
        },
        {
          text: "Wij beoordelen iedere kandidaat op wat het werk vraagt. Verzoeken die mensen uitsluiten op grond van afkomst, leeftijd, geslacht of geloof wijzen wij af.",
        },
      ],
      wttaLinkLabel: "Wat de Wtta voor inleners betekent",
    },
    compare: {
      title: "Groos werkt voor werkgevers",
      accent: "en werkzoekenden",
      intro: "In de tabel ziet u wat wij doen voor werkgevers en voor mensen die werk zoeken.",
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
        { label: "Contact", jobseeker: "Ons team, op één vast nummer", employer: "Ons team, op één vast nummer" },
        { label: "Eerste stap", jobseeker: "Solliciteren of inschrijven", employer: "Personeel aanvragen of bellen" },
      ],
    },
    faq: {
      title: "Antwoorden op vragen",
      accent: "van opdrachtgevers",
      items: [
        {
          q: "Wat kost een uitzendkracht via Groos?",
          a: "Het tarief hangt af van het beroep, het aantal uren, de werktijden en de duur van de inzet. Na uw aanvraag sturen wij u een voorstel met een helder uurtarief.",
          specific: false,
        },
        {
          q: "Voor hoe lang kan ik iemand inhuren?",
          a: "Dat bepaalt u zelf. Sommige opdrachtgevers hebben iemand een dag nodig, anderen een paar maanden. Wij stemmen de inzet af op uw planning.",
          specific: false,
        },
        {
          q: "Wie is mijn contactpersoon bij Groos?",
          a: "U heeft contact met ons team, en dat blijft zo zolang de inzet loopt. U belt of appt ons op één vast nummer.",
          specific: false,
        },
        {
          q: "Wie zorgt voor veiligheid op de werkplek?",
          a: "Dat doet u als inlener, volgens de Arbowet. U geeft ons vooraf de risico's van het werk door, en wij geven die voor de start door aan de medewerker.",
          specific: false,
        },
        {
          q: "Welke certificaten hebben uw medewerkers?",
          a: "Dat verschilt per beroep en per kandidaat. In de bouw en sloop wordt vaak een VCA-diploma voor veilig werken gevraagd. Wij noemen de certificaten bij elk voorstel.",
          specific: false,
        },
        {
          q: "Spreken uw medewerkers Nederlands?",
          a: "Dat verschilt per kandidaat. Bij elk voorstel vertellen wij u welke talen iemand spreekt.",
          specific: false,
        },
        {
          q: "Hoe gaat Groos om met gelijke behandeling?",
          a: "Wij kiezen kandidaten op ervaring, certificaten en de werktijden die zij kunnen werken. Een verzoek om mensen uit te sluiten op grond van afkomst, leeftijd, geslacht of geloof voeren wij niet uit.",
          specific: false,
        },
        // TODO claim responseTime: termijn bevestigen (CL-05, CL-09); nu staat er "uiterlijk de volgende werkdag".
        {
          q: "Hoe snel kunt u iemand sturen?",
          a: "Wij reageren uiterlijk de volgende werkdag op uw aanvraag. Hoe snel iemand kan beginnen, hangt af van het beroep, de werktijden en de certificaten die het werk vraagt.",
          specific: false,
          claim: "responseTime",
        },
        {
          q: "Betaal ik als er niemand start?",
          a: "Nee, u betaalt alleen voor uren die een medewerker echt heeft gewerkt. Start er niemand, dan krijgt u ook geen factuur.",
          specific: false,
          claim: "noStartNoCost",
        },
      ],
    },
    cta: {
      title: "Heeft u",
      accent: "binnenkort extra mensen nodig?",
      body: "Vertel ons wie u zoekt en vanaf wanneer. Wij nemen contact met u op om de aanvraag door te nemen.",
    },
  },
  en: {
    hero: {
      title: "Staff for practical work in and around The Hague",
      lead: "We provide people for cleaning and window cleaning, logistics and removals, and construction, demolition and groundworks. You arrange your request through one regular contact in The Hague.",
    },
    supply: {
      title: "What Groos arranges",
      accent: "for your business",
      intro: "Groos Personeelsdiensten is an employment agency in The Hague. We arrange the contract, the pay and the administration for the people who work for you.",
      items: [
        {
          title: "One regular contact person",
          body: "Our team takes your request and stays your point of contact for as long as the assignment runs.",
          icon: "phone",
        },
        {
          title: "Candidates after a conversation",
          body: "We first talk to candidates about the work, the working hours and their experience. Then we introduce the people who suit the assignment.",
          icon: "person",
          claim: "personalIntake",
        },
        {
          title: "Contract and pay through Groos",
          body: "Groos is the employer of the temporary worker and pays the wage and holiday pay. You pay an hourly rate for the hours worked.",
          icon: "payslip",
        },
        // TODO claim replacement: same as nl.
        {
          title: "Cover if someone drops out",
          body: "If a worker drops out unexpectedly, we look for a replacement. We keep you informed until the new worker starts.",
          icon: "team",
          claim: "replacement",
        },
      ],
    },
    beroepen: {
      title: "People for ten kinds",
      accent: "of practical work",
      intro: "For each job you can read what the workers do and which certificates are often required.",
    },
    agency: {
      title: "Agency work",
      accent: "in brief",
      intro: "With agency work, a worker employed by Groos works temporarily in your business.",
      items: [
        {
          term: "Employer of the worker",
          description: "Groos Personeelsdiensten is the employer. You manage the work on site and decide who does what.",
        },
        {
          term: "When it helps",
          description: "In busy periods, for seasonal work or cover, or when you first want to see whether someone fits your team.",
        },
        {
          term: "How you pay",
          description: "An hourly rate for the hours worked, based on a proposal you receive from us in advance.",
        },
        {
          term: "Safety at work",
          description: "Under the Working Conditions Act (Arbowet), you as the hirer provide instruction and a safe workplace.",
        },
      ],
    },
    legal: {
      title: "What the law asks",
      accent: "of us and of you",
      intro: "Agency work has its own rules on pay, safety and taxes. We explain them to you in advance.",
      items: [
        {
          text: "A temporary worker receives equivalent pay, which means at least the same wage as your own staff in a comparable role. For this, you give us your pay scale and allowances before the start.",
        },
        {
          text: "Under the Collection of State Taxes Act (Invorderingswet), you as the hirer are liable for payroll taxes and VAT that an agency fails to pay.",
        },
        {
          text: "Under the Working Conditions Act, you count as the employer for safety at the workplace.",
        },
        {
          text: "We assess every candidate on what the work requires. We turn down requests that exclude people on the basis of origin, age, gender or religion.",
        },
      ],
      wttaLinkLabel: "What the Wtta means for hirers",
    },
    compare: {
      title: "Groos works for employers",
      accent: "and job seekers",
      intro: "The table shows what we do for employers and for people who are looking for work.",
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
        { label: "Contact", jobseeker: "Our team, on one fixed number", employer: "Our team, on one fixed number" },
        { label: "First step", jobseeker: "Applying or registering", employer: "Requesting staff or calling" },
      ],
    },
    faq: {
      title: "Answers to questions",
      accent: "from clients",
      items: [
        {
          q: "What does a temporary worker from Groos cost?",
          a: "The rate depends on the job, the number of hours, the working hours and the length of the assignment. After your request, we send you a proposal with a clear hourly rate.",
          specific: false,
        },
        {
          q: "How long can I hire someone for?",
          a: "You decide. Some clients need someone for one day, others for a few months. We plan the assignment around your schedule.",
          specific: false,
        },
        {
          q: "Who is my contact person at Groos?",
          a: "You deal with our team, and that stays the same for as long as the assignment runs. You call or message us on one fixed number.",
          specific: false,
        },
        {
          q: "Who is responsible for safety at work?",
          a: "You are, as the hirer, under the Working Conditions Act. You tell us the risks of the work in advance, and we pass them on to the worker before the start.",
          specific: false,
        },
        {
          q: "Which certificates do your workers have?",
          a: "That differs per job and per candidate. In construction and demolition, clients often ask for a VCA safety certificate. We list the certificates in every proposal.",
          specific: false,
        },
        {
          q: "Do your workers speak Dutch?",
          a: "That differs per candidate. With every proposal, we tell you which languages someone speaks.",
          specific: false,
        },
        {
          q: "How does Groos deal with equal treatment?",
          a: "We select candidates on experience, certificates and the hours they can work. We do not act on a request to exclude people on the basis of origin, age, gender or religion.",
          specific: false,
        },
        // TODO claim responseTime: same as nl.
        {
          q: "How quickly can you send someone?",
          a: "We respond to your request by the next working day at the latest. How quickly someone can start depends on the job, the working hours and the certificates the work requires.",
          specific: false,
          claim: "responseTime",
        },
        {
          q: "Do I pay if nobody starts?",
          a: "No, you only pay for hours that a worker has actually worked. If nobody starts, you do not receive an invoice.",
          specific: false,
          claim: "noStartNoCost",
        },
      ],
    },
    cta: {
      title: "Do you need",
      accent: "extra people soon?",
      body: "Tell us who you are looking for and from when. We contact you to go through the request.",
    },
  },
} satisfies Localized<WerkgeversCopy>;
