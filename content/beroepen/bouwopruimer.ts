import type { BeroepContent } from "@/content/beroepen/types";

export const bouwopruimer = {
  id: "bouwopruimer",
  wage: {
    starter: { min: 15.98, max: 16.97 },
    experienced: { min: 18.95, max: 18.95 },
    tableDate: "2026-07-01",
    checkedAt: "2026-10-05",
    reviewBy: "2027-01-01",
    sourceUrl: "https://media.umbraco.io/bouwend-nederland/z0niekfd/loontabellen-bouwplaatswerknemer-cao-2025-2027-mei-2026.pdf",
  },
  minAge18: "construction_demolition",
  nl: {
    jobseeker: {
      meta: {
        title: "Werken als bouwopruimer in Den Haag",
        description:
          "Als bouwopruimer in Den Haag houd je de bouwplaats veilig en schoon. Lees wat je doet, wat je verdient en waarom je VCA nodig hebt. Reageren kan zonder cv.",
        keywords: [
          "bouwopruimer vacature",
          "bouwopruimer den haag",
          "bouwopruimers gezocht",
          "bouwopruimer uurloon",
          "opruimer bouw",
          "bouwplaats opruimen",
          "bouwhulp den haag",
        ],
      },
      hero: {
        title: "Werken als bouwopruimer in Den Haag",
        lead: "Als bouwopruimer houd je een hele bouwplaats veilig en begaanbaar. Je haalt afval weg, scheidt het en brengt materiaal naar de goede plek.",
        facts: [
          { label: "Certificaat", value: "VCA Basis" },
          { label: "Diploma", value: "Niet nodig" },
        ],
      },
      work: {
        title: "Wat je op de bouwplaats",
        accent: "opruimt, scheidt en verplaatst",
        intro: "Je werkt voor alle ploegen en krijgt je taken van de uitvoerder.",
        tasks: [
          "Looproutes, trappenhuizen en vluchtwegen vrijhouden",
          "Afval scheiden in hout, puin, gips, folie en metaal",
          "Bigbags vullen en een volle container melden",
          "Materiaal naar boven brengen met bouwlift of palletwagen",
          "De keet en de toiletten schoonhouden",
          "Een woning of verdieping bezemschoon achterlaten",
        ],
        placesTitle: "Projecten waar je werkt",
        places: ["Nieuwbouw van woontorens en appartementen", "Renovatie van bewoonde flats", "Panden waar net gestript is"],
      },
      requirements: {
        title: "Wat je meebrengt om",
        accent: "een bouwplaats netjes te houden",
        items: [
          "Je ziet zelf wat er moet gebeuren en wacht niet op een opdracht",
          "Je loopt, tilt, bukt en veegt een groot deel van de dag",
          "Je begrijpt een veiligheidsinstructie in het Nederlands of Engels",
        ],
        minAgeNote: "Je werkt op een bouwplaats en moet daarom minimaal 18 jaar zijn.",
      },
      wage: {
        title: "Je uurloon in je eerste jaar",
        accent: "en daarna",
        intro: "Heb je nog niet eerder in de bouw gewerkt, dan begin je op het startloon, dat na een halfjaar stijgt. Na een jaar krijg je het hogere bedrag.",
        sourceLabel: "starttabel en garantieloon groep A van de cao Bouw en Infra, 1 juli 2026",
        extra: "Voor uren buiten je rooster krijg je meestal een toeslag.",
        experiencedLabel: "Na je eerste jaar in de bouw",
      },
      schedule: {
        title: "Vroeg beginnen, vaak",
        accent: "op vaste dagen",
        items: [
          {
            title: "Start rond 07.00 uur",
            body: "Je begint meestal rond 07.00 uur, tegelijk met de andere ploegen.",
            icon: "clock",
          },
          {
            title: "Lang op één project",
            body: "Je werkt vaak weken of maanden op één project, elke dag of op vaste dagen.",
            icon: "calendar",
          },
          {
            title: "Ook werk in de winter",
            body: "Opruimen in de afbouw is binnenwerk en gaat bij kou meestal door.",
            icon: "weather",
          },
        ],
      },
      certificates: {
        title: "Wat je nodig hebt voordat",
        accent: "je de bouwplaats op mag",
        intro: "Voor dit werk heb je geen diploma nodig.",
        items: [
          {
            name: "VCA Basis",
            need: "always",
            body: "Met VCA laat je zien dat je de veiligheidsregels kent. Je haalt het met een examen en het blijft tien jaar geldig.",
          },
          {
            name: "Poortinstructie",
            need: "often",
            body: "Op veel grote bouwplaatsen volg je vooraf een online instructie van ongeveer 25 minuten.",
          },
          {
            name: "Beschermingsmiddelen",
            need: "always",
            body: "Een helm, veiligheidsschoenen, handschoenen en een hesje krijg je kosteloos.",
          },
        ],
      },
      why: {
        title: "Bezemschoon werken begint",
        accent: "met heldere afspraken",
        items: [
          {
            title: "Het uurloon staat erbij",
            body: "In elke vacature lees je het bruto uurloon. Je krijgt hetzelfde als een opruimer in dienst van het bouwbedrijf.",
            icon: "wage",
          },
          {
            title: "Je weet waar je je meldt",
            body: "Vooraf krijg je het adres, je begintijd en de naam van de uitvoerder.",
            icon: "route",
          },
          {
            title: "Appen of bellen met ons team",
            body: "Zit je met een vraag over je rooster of je uren, dan app of bel je ons team.",
            icon: "message",
          },
        ],
      },
      career: {
        title: "Van opruimen naar",
        accent: "bouwlift of vak",
        steps: ["Bouwopruimer", "Bouwliftbediener of ploegleider", "Opperman of sloper", "Vakman na een opleiding"],
        note: "Voor een vak als timmeren of metselen volg je eerst een opleiding.",
      },
      vacancies: {
        title: "Vacatures voor bouwopruimers",
        accent: "in en rond Den Haag",
        emptyTitle: "Nu geen opruimwerk in de bouw",
        emptyBody: "Laat je gegevens achter, dan hoor je van ons als er opruimwerk is.",
      },
      faq: {
        title: "Vragen over opruimen,",
        accent: "bouwstof en de bouwlift",
        items: [
          {
            q: "Is een bouwopruimer hetzelfde als een hulpkracht?",
            a: "Nee, een hulpkracht helpt één vakman of ploeg. Jij werkt voor de hele bouwplaats.",
            specific: true,
          },
          {
            q: "Maak ik ook woningen schoon voor de oplevering?",
            a: "Je laat een woning bezemschoon achter, dus zonder afval en geveegd. Stofvrij maken is daarna werk voor een opleveringsschoonmaker.",
            specific: true,
          },
          {
            q: "Waarom mag ik niet droog vegen?",
            a: "Stof van steen en beton is schadelijk als je het inademt. Daarom zuig je of maak je de vloer eerst nat.",
            specific: true,
          },
          {
            q: "Mag ik de bouwlift bedienen?",
            a: "Dat mag pas als je er op dat project uitleg over hebt gehad.",
            specific: true,
          },
          {
            q: "Verdien ik meteen het hogere uurloon?",
            a: "Nee, als nieuwkomer in de bouw begin je op het startloon. Je eigen uurloon staat in de vacature.",
            specific: true,
          },
          {
            // TODO claim certificateSupport: hulp bij het halen van VCA, en wie de cursus betaalt
            q: "Kan ik VCA via jullie halen?",
            a: "Ja, wij helpen je aan een cursus en een examen voor VCA Basis. Wij vertellen je vooraf waar en wanneer dat is.",
            specific: true,
            claim: "certificateSupport",
          },
          {
            // TODO claim transport: vervoer naar de bouwplaats
            q: "Hoe kom ik op de bouwplaats als ik geen auto heb?",
            a: "Is de bouwplaats slecht te bereiken met tram of bus, dan regelen wij vervoer. Hoe je er komt, lees je in de vacature.",
            specific: true,
            claim: "transport",
          },
          {
            q: "Betaal ik iets als ik me inschrijf?",
            a: "Nee, je betaalt niets voor je inschrijving of je sollicitatie, en een cv hoeft niet.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Bouwopruimers inhuren voor een project in Den Haag? Lees wat Groos voor aannemers doet.",
        linkLabel: "Naar de pagina voor werkgevers",
      },
      cta: {
        title: "Wil je een bouwplaats",
        accent: "opgeruimd en veilig houden?",
        body: "Reageer op een vacature of laat je nummer achter, dan belt ons team je.",
      },
    },
    employer: {
      meta: {
        title: "Bouwopruimers inhuren in Den Haag",
        description:
          "Zoekt u bouwopruimers voor uw bouwplaats in Den Haag? Groos levert mensen die looproutes vrijhouden, afval scheiden en bezemschoon opleveren. Vraag ze aan.",
        keywords: [
          "bouwopruimers inhuren",
          "bouwopruimer den haag",
          "bouwplaats opruimen",
          "afval scheiden bouwplaats",
          "bouwhulp inhuren den haag",
          "uitzendbureau bouw den haag",
        ],
        serviceType: "Uitzenden van bouwopruimers",
      },
      hero: {
        title: "Bouwopruimers voor uw bouwplaats in Den Haag",
        lead: "Orde en netheid is op een bouwplaats een veiligheidseis. Onze bouwopruimers houden looproutes vrij, scheiden afval en leveren bezemschoon op.",
      },
      supply: {
        title: "Opruimen, afval scheiden en transport",
        accent: "voor de hele bouwplaats",
        intro: "Onze bouwopruimers werken voor alle ploegen en krijgen hun opdrachten van uw uitvoerder.",
        tasks: [
          "Verdiepingen, trappenhuizen en vluchtwegen vrijmaken van afval",
          "Afval van alle onderaannemers per stroom naar de container brengen",
          "Afvalpunten bijhouden en een volle container op tijd melden",
          "Materiaal verdelen met bouwlift, palletwagen of steekwagen",
          "Vloeren zuigen voordat de stukadoor of tegelzetter begint",
          "Woningen bezemschoon opleveren voor de opleveringsschoonmaak",
        ],
        clientsTitle: "Bedrijven die bouwopruimers inlenen",
        clients: [
          "Hoofdaannemers in woningbouw en utiliteitsbouw",
          "Renovatie- en transformatiebedrijven",
          "Sloop- en stripbedrijven",
          "Afbouwbedrijven en installateurs",
        ],
      },
      why: {
        title: "Een opgeruimde bouwplaats is",
        accent: "een veilige bouwplaats",
        items: [
          {
            title: "Looproutes en vluchtwegen eerst",
            body: "Afval en losse kabels zijn struikelgevaar, dus de ronde begint bij looproutes, trappenhuizen en vluchtwegen.",
            icon: "safety",
          },
          {
            title: "Afval per stroom gescheiden",
            body: "U geeft aan welke stromen u scheidt, zoals hout, puin, gips, folie en metaal.",
            icon: "check",
          },
          {
            title: "Opruimer, hulpkracht of schoonmaker",
            body: "Zoekt u handen voor een vakman, dan past een hulpkracht bouw en sloop beter. Voor stofvrij opleveren vraagt u opleveringsschoonmaak aan.",
            icon: "person",
          },
          {
            title: "Eén team voor dagen en uren",
            body: "Wilt u een dag erbij of een andere begintijd, dan belt of appt u ons team.",
            icon: "phone",
          },
        ],
      },
      certificates: {
        title: "Certificaten en instructies",
        accent: "die wij vooraf afstemmen",
        items: [
          {
            name: "VCA Basis",
            need: "always",
            body: "Bij elk voorstel hoort u of de kandidaat VCA Basis heeft en tot wanneer het geldig is.",
          },
          {
            name: "Poortinstructie",
            need: "often",
            body: "Wij stemmen af wie de generieke poortinstructie regelt. De instructie van het project geeft u zelf.",
          },
          {
            name: "Persoonlijke beschermingsmiddelen",
            need: "always",
            body: "Helm, veiligheidsschoenen, handschoenen en hesje kosten de medewerker niets. Wij spreken af wie ze levert.",
          },
        ],
      },
      planning: {
        title: "Vaste dagen, elke dag of",
        accent: "extra voor de oplevering",
        items: [
          {
            title: "Vaste opruimdagen of dagelijks",
            body: "U kiest voor vaste opruimdagen per week of voor iemand die elke dag meeloopt.",
            icon: "calendar",
          },
          {
            title: "Pieken bij afbouw en oplevering",
            body: "Extra vraag ontstaat bij de overgang naar afbouw, vlak voor de oplevering en voor een audit op netheid. Bespreek die weken op tijd met ons.",
            icon: "season",
          },
          {
            title: "Begin rond 07.00 uur",
            body: "De werkdag start meestal rond 07.00 uur. Opruimen in de afbouw is binnenwerk en loopt in de winter door.",
            icon: "clock",
          },
        ],
      },
      legal: {
        title: "Wat de regels vragen over",
        accent: "loon, netheid en afval",
        items: [
          {
            text: "De medewerker heeft recht op gelijkwaardige beloning, dus minstens het pakket van uw eigen mensen met hetzelfde werk.",
          },
          {
            text: "Het Arbobesluit vraagt dat werkplekken schoon, zo veel mogelijk stofvrij en ordelijk zijn. Als inlener geeft u de instructie op de bouwplaats en houdt u de werkplek veilig.",
          },
          {
            text: "Het Besluit bouwwerken leefomgeving vraagt dat gevaarlijk afval en een aantal andere stromen op het bouwterrein worden gescheiden.",
          },
        ],
        wttaLinkLabel: "Naar de uitleg over de Wtta",
      },
      faq: {
        title: "Vragen van uitvoerders over",
        accent: "opruimen en afval scheiden",
        items: [
          {
            q: "Wanneer loont een bouwopruimer naast mijn eigen ploegen?",
            a: "Een bouwopruimer loont als uw ploegen opruimen, scheiden en intern transport er niet meer bij kunnen doen. Dat speelt vooral op hoogbouw en op projecten met veel onderaannemers.",
            specific: true,
          },
          {
            q: "Scheiden uw mensen het afval in onze stromen?",
            a: "Ja, u vertelt welke stromen u scheidt en waar de containers staan. Gevaarlijk afval zoals kitkokers en verfresten houdt de medewerker apart.",
            specific: true,
          },
          {
            q: "Wie geeft de instructie voor de bouwlift?",
            a: "Die instructie komt van u of van de liftverhuurder. Zonder instructie bedient de medewerker de lift niet.",
            specific: true,
          },
          {
            q: "Vegen uw mensen droog?",
            a: "Nee, droog vegen laat schadelijk bouwstof opwaaien. De medewerker zuigt met een bouwstofzuiger of maakt de vloer eerst nat.",
            specific: true,
          },
          {
            // TODO claim replacement: vervanging bij uitval, met termijn
            q: "Wat doet u als de bouwopruimer een dag uitvalt?",
            a: "Meldt de medewerker zich af, dan zoeken wij een vervanger en hoort u van ons hoe het staat. Zo gaat de opruimronde door.",
            specific: false,
            claim: "replacement",
          },
          {
            q: "Welk uurloon krijgt een bouwopruimer?",
            a: "Het loon is minstens gelijk aan dat van een opruimer in uw eigen dienst. Een nieuwkomer begint bij een bouwbedrijf op het startloon en krijgt na een jaar meer.",
            specific: false,
          },
          {
            q: "Wat kost het om een bouwopruimer in te lenen?",
            a: "De prijs volgt uit het loon, het aantal dagen en de looptijd. U krijgt na de aanvraag een voorstel waarin het uurtarief staat.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Zelf aan de slag als bouwopruimer? Het loon en de werktijden staan op de pagina voor werkzoekenden.",
        linkLabel: "Naar de pagina voor werkzoekenden",
      },
      cta: {
        title: "Afval gescheiden en elke verdieping",
        accent: "bezemschoon voor de oplevering?",
        body: "Laat ons weten op welke dagen u iemand zoekt en welke afvalstromen u scheidt. Daarna bespreken wij de instructies en de startdatum.",
      },
    },
  },
  en: {
    jobseeker: {
      meta: {
        title: "Work as a construction site cleaner in The Hague",
        description:
          "As a construction site cleaner in The Hague, you keep the site safe and tidy. Read what you do, what you earn and why you need VCA. Apply without a CV.",
        keywords: [
          "construction site cleaner jobs",
          "construction site cleaner the hague",
          "construction cleaner jobs netherlands",
          "construction site cleaner hourly wage",
          "site labourer jobs the hague",
          "construction site housekeeping jobs",
          "vca certificate the hague",
        ],
      },
      hero: {
        title: "Work as a construction site cleaner in The Hague",
        lead: "As a site cleaner, you keep a whole construction site safe and walkable. You clear waste, sort it and move materials into place.",
        facts: [
          { label: "Certificate", value: "VCA Basic" },
          { label: "Diploma", value: "Not needed" },
        ],
      },
      work: {
        title: "What you clear, sort",
        accent: "and move on site",
        intro: "You work for every crew, under the site manager.",
        tasks: [
          "Keeping walkways, stairwells and escape routes clear",
          "Sorting waste into timber, rubble, plasterboard, plastic and metal",
          "Filling bulk bags and reporting a full skip",
          "Moving materials upstairs by hoist or pallet truck",
          "Keeping the site cabin and toilets clean",
          "Leaving a home or floor broom clean",
        ],
        placesTitle: "Projects you work on",
        places: ["New residential towers and apartments", "Renovation of occupied flats", "Buildings that have just been stripped out"],
      },
      requirements: {
        title: "What you bring to",
        accent: "keep a site tidy",
        items: [
          "You see what needs doing without being told",
          "You walk, lift, bend and sweep most of the day",
          "You understand a safety briefing in Dutch or English",
        ],
        minAgeNote: "You work on a construction site, which is why the minimum age is 18.",
      },
      wage: {
        title: "Your hourly wage in year one",
        accent: "and after that",
        intro: "If construction is new to you, you begin on the starting wage, which rises after six months. After a year, you get the higher amount.",
        sourceLabel: "starting table and group A wage, Bouw en Infra collective labour agreement (cao), 1 July 2026",
        extra: "Hours outside your rota usually earn extra pay.",
        experiencedLabel: "After your first year in construction",
      },
      schedule: {
        title: "An early start, often",
        accent: "on fixed days",
        items: [
          {
            title: "Starting at around 07:00",
            body: "You usually start at around 07:00, like the other crews.",
            icon: "clock",
          },
          {
            title: "Long on one project",
            body: "A project often lasts weeks or months, daily or on fixed days.",
            icon: "calendar",
          },
          {
            title: "Work in winter too",
            body: "Clearing up during fit-out is indoor work and usually continues in the cold.",
            icon: "weather",
          },
        ],
      },
      certificates: {
        title: "What you need before",
        accent: "you go on site",
        intro: "You need no diploma for this work.",
        items: [
          {
            name: "VCA Basic",
            need: "always",
            body: "The VCA certificate shows you know the safety rules. You pass an exam, and it is valid for ten years.",
          },
          {
            name: "Site induction",
            need: "often",
            body: "Many large sites first ask for an online induction of about 25 minutes.",
          },
          {
            name: "Protective equipment",
            need: "always",
            body: "You get a hard hat, safety boots, gloves and a high-visibility vest for free.",
          },
        ],
      },
      why: {
        title: "Broom clean work starts",
        accent: "with clear agreements",
        items: [
          {
            title: "The wage is stated",
            body: "The gross hourly wage is in every job advert. You get the same as the contractor's own site cleaners.",
            icon: "wage",
          },
          {
            title: "You know where to report",
            body: "Beforehand, you get the address, your start time and the site manager's name.",
            icon: "route",
          },
          {
            title: "Message or call our team",
            body: "With a question about your rota or hours, you message or call our team.",
            icon: "message",
          },
        ],
      },
      career: {
        title: "From clearing up",
        accent: "to the hoist or a trade",
        steps: ["Construction site cleaner", "Hoist operator or team leader", "Bricklayer's mate or demolition worker", "Skilled trade after training"],
        note: "A trade such as carpentry or bricklaying starts with a training course.",
      },
      vacancies: {
        title: "Site cleaner jobs",
        accent: "in and around The Hague",
        emptyTitle: "No site cleaning work right now",
        emptyBody: "Leave your details and you will hear from us when a site needs someone.",
      },
      faq: {
        title: "Questions about clearing up,",
        accent: "dust and the hoist",
        items: [
          {
            q: "Is a site cleaner the same as a labourer?",
            a: "No, a labourer helps one tradesperson or crew. You work for the whole site.",
            specific: true,
          },
          {
            q: "Do I also clean homes before handover?",
            a: "You leave a home broom clean, so free of waste and swept. Making it dust-free is then work for a post-construction cleaner.",
            specific: true,
          },
          {
            q: "Why can I not sweep dry?",
            a: "Dust from stone and concrete is harmful to breathe in. So you vacuum or wet the floor first.",
            specific: true,
          },
          {
            q: "May I operate the construction hoist?",
            a: "Only once you have been shown how on that project.",
            specific: true,
          },
          {
            q: "Do I get the higher wage straight away?",
            a: "No, as a newcomer you begin on the starting wage. The job advert states your hourly wage.",
            specific: true,
          },
          {
            q: "Can I get my VCA through you?",
            a: "Yes, we help you find a course and an exam for VCA Basic. We tell you in advance where and when it takes place.",
            specific: true,
            claim: "certificateSupport",
          },
          {
            q: "How do I reach the site if I have no car?",
            a: "If the site is hard to reach by tram or bus, we arrange transport. The job advert explains how you get there.",
            specific: true,
            claim: "transport",
          },
          {
            q: "Do I pay anything when I register?",
            a: "No, you pay nothing to register or apply, and you need no CV.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Hiring site cleaners for a project in The Hague? Read what Groos does for contractors.",
        linkLabel: "Go to the page for employers",
      },
      cta: {
        title: "Do you want to keep a site",
        accent: "tidy and safe?",
        body: "Apply for a job or leave your number, and our team will call you.",
      },
    },
    employer: {
      meta: {
        title: "Hire construction site cleaners in The Hague",
        description:
          "Do you need construction site cleaners in The Hague? Groos provides people who keep walkways clear, sort waste and leave floors broom clean. Request staff.",
        keywords: [
          "hire construction site cleaners",
          "construction site cleaner the hague",
          "construction site housekeeping",
          "waste separation on site",
          "hire site labourers the hague",
          "construction employment agency the hague",
        ],
        serviceType: "Temporary staffing of construction site cleaners",
      },
      hero: {
        title: "Site cleaners for your construction site in The Hague",
        lead: "On a construction site, good housekeeping is a safety requirement. Our site cleaners keep walkways clear, sort waste and leave floors broom clean.",
      },
      supply: {
        title: "Clearing up, waste separation and transport",
        accent: "for the whole site",
        intro: "Our site cleaners work for every crew, under your site manager.",
        tasks: [
          "Clearing floors, stairwells and escape routes of waste",
          "Sorting all subcontractors' waste into the skip per stream",
          "Managing waste points and reporting a full skip",
          "Distributing materials by hoist, pallet truck or sack truck",
          "Vacuuming floors before the plasterer or tiler starts",
          "Leaving homes broom clean for the final clean",
        ],
        clientsTitle: "Who hires site cleaners",
        clients: [
          "Main contractors in housing and commercial building",
          "Renovation and conversion companies",
          "Demolition and strip-out companies",
          "Fit-out contractors and installers",
        ],
      },
      why: {
        title: "A tidy construction site is",
        accent: "a safe construction site",
        items: [
          {
            title: "Walkways and escape routes first",
            body: "Waste and loose cables are a trip hazard, so the round starts with walkways, stairwells and escape routes.",
            icon: "safety",
          },
          {
            title: "Waste sorted by stream",
            body: "You tell us which streams you separate, such as timber, rubble, plasterboard, plastic and metal.",
            icon: "check",
          },
          {
            title: "Site cleaner, labourer or final clean",
            body: "If you need hands for a tradesperson, a construction and demolition labourer fits better. For a dust-free handover, you request post-construction cleaning.",
            icon: "person",
          },
          {
            title: "One team for days and hours",
            body: "For an extra day or another start time, you call or message our team.",
            icon: "phone",
          },
        ],
      },
      certificates: {
        title: "Certificates and inductions",
        accent: "we agree in advance",
        items: [
          {
            name: "VCA Basic",
            need: "always",
            body: "With each proposal, you hear whether the candidate holds VCA Basic and until when.",
          },
          {
            name: "Site induction",
            need: "often",
            body: "We agree who arranges the generic site induction. You give the project induction yourself.",
          },
          {
            name: "Personal protective equipment",
            need: "always",
            body: "Hard hat, safety boots, gloves and high-visibility vest cost the worker nothing. We agree who supplies them.",
          },
        ],
      },
      planning: {
        title: "Fixed days, every day or",
        accent: "extra before handover",
        items: [
          {
            title: "Fixed clearing days or daily",
            body: "You choose fixed clearing days each week or someone on site every day.",
            icon: "calendar",
          },
          {
            title: "Peaks at fit-out and handover",
            body: "Extra demand comes with the move to fit-out, just before handover and ahead of a tidiness audit. Tell us about those weeks early.",
            icon: "season",
          },
          {
            title: "Starting at around 07:00",
            body: "The day usually starts at around 07:00. Clearing up during fit-out is indoor work and continues through winter.",
            icon: "clock",
          },
        ],
      },
      legal: {
        title: "What the rules require on",
        accent: "pay, tidiness and waste",
        items: [
          {
            text: "The worker is entitled to equivalent pay, so at least the package of your own staff doing the same work.",
          },
          {
            text: "The Working Conditions Decree (Arbobesluit) requires workplaces to be clean, as dust-free as possible and orderly. As the hirer, you give the site instruction and keep the workplace safe.",
          },
          {
            text: "The Dutch building decree (Bbl) requires hazardous waste and several other streams to be separated on site.",
          },
        ],
        wttaLinkLabel: "See the explanation of the Wtta",
      },
      faq: {
        title: "Site managers ask about",
        accent: "clearing up and sorting waste",
        items: [
          {
            q: "When does a separate site cleaner pay off?",
            a: "A site cleaner pays off once your crews can no longer fit in clearing up, sorting and internal transport. That mostly happens on high-rise and with many subcontractors.",
            specific: true,
          },
          {
            q: "Do your people sort waste into our streams?",
            a: "Yes, you tell us your streams and where the skips are. Hazardous waste such as sealant tubes and paint residue is kept apart.",
            specific: true,
          },
          {
            q: "Who gives the hoist instruction?",
            a: "That instruction comes from you or the hoist hire company. Without it, the worker does not operate the hoist.",
            specific: true,
          },
          {
            q: "Do your people sweep dry?",
            a: "No, dry sweeping raises harmful dust. The worker uses a site vacuum or wets the floor first.",
            specific: true,
          },
          {
            q: "What do you do if the site cleaner is absent for a day?",
            a: "If the worker reports absent, we look for a replacement and let you know where things stand. That way the clearing round carries on.",
            specific: false,
            claim: "replacement",
          },
          {
            q: "What hourly wage does a site cleaner get?",
            a: "The wage at least equals that of a site cleaner on your own payroll. A newcomer to construction begins on the starting wage and earns more after a year.",
            specific: false,
          },
          {
            q: "What does hiring a site cleaner cost?",
            a: "The price follows from the wage, the days and the project length. Following your request, we send a proposal stating the hourly rate.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Looking for work as a site cleaner yourself? The pay and working hours are on the page for job seekers.",
        linkLabel: "Go to the page for job seekers",
      },
      cta: {
        title: "Waste sorted and every floor",
        accent: "broom clean before handover?",
        body: "Tell us which days you need someone and which waste streams you separate. We then discuss inductions and the start date.",
      },
    },
  },
} satisfies BeroepContent;
