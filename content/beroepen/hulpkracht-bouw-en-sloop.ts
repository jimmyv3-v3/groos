import type { BeroepContent } from "@/content/beroepen/types";

export const hulpkrachtBouwEnSloop = {
  id: "hulpkracht-bouw-en-sloop",
  wage: {
    starter: { min: 15.98, max: 17 },
    experienced: { min: 19, max: 21.5 },
    tableDate: "2026-07-01",
    checkedAt: "2026-10-02",
    reviewBy: "2027-01-01",
    sourceUrl: "https://media.umbraco.io/bouwend-nederland/z0niekfd/loontabellen-bouwplaatswerknemer-cao-2025-2027-mei-2026.pdf",
  },
  minAge18: "construction_demolition",
  nl: {
    jobseeker: {
      meta: {
        title: "Werken als hulpkracht bouw en sloop in Den Haag",
        description:
          "Wil je werken als hulpkracht in de bouw en sloop in Den Haag? Lees wat je verdient, hoe laat je begint en waarom je VCA nodig hebt. Solliciteren kan zonder cv.",
        keywords: [
          "hulpkracht bouw",
          "opperman vacature",
          "sloper vacature den haag",
          "bouw vacature zonder ervaring",
          "vca halen den haag",
          "bouwplaatsmedewerker",
        ],
      },
      hero: {
        title: "Werken als hulpkracht in de bouw en sloop in Den Haag",
        lead: "Als hulpkracht in de bouw en sloop help je vakmensen op de bouwplaats, bijvoorbeeld met opruimen en stenen aangeven. Je werkt buiten in een ploeg, meestal van 07.00 tot 16.00 uur.",
        facts: [{ label: "Certificaat", value: "VCA Basis" }],
      },
      work: {
        title: "Wat je doet op de bouwplaats",
        accent: "en bij sloopwerk",
        intro:
          "Je helpt metselaars, timmerlieden en stratenmakers, zodat zij door kunnen werken.",
        tasks: [
          "De bouwplaats opruimen en materiaal aanvoeren",
          "Als opperman specie mengen en stenen aangeven",
          "Plafonds, vloeren en keukens eruit halen (strippen)",
          "Sloopafval scheiden en containers vullen",
          "Graven en aanvullen bij grondwerk",
        ],
        placesTitle: "Waar je werkt",
        places: ["Nieuwbouw van woningen", "Renovatie van flats en huurwoningen", "Sloopprojecten en straatwerk"],
      },
      requirements: {
        title: "Wat je meebrengt",
        accent: "naar de bouwplaats",
        items: [
          "Je werkt buiten en kunt de hele dag tillen, bukken en staan",
          "Je spreekt genoeg Nederlands of Engels voor veiligheidsinstructies",
          "Je werkt nooit met asbest. Zie je materiaal dat erop lijkt, dan stop je en meld je het.",
        ],
        minAgeNote: "Omdat je in de bouw en sloop werkt, moet je minimaal 18 jaar zijn.",
      },
      wage: {
        title: "Wat je verdient",
        accent: "als hulpkracht in de bouw",
        intro: "Als nieuwkomer begin je meestal op een startloon, en met ervaring verdien je meer.",
        sourceLabel: "starttabel en garantielonen van de cao Bouw en Infra per 1 juli 2026",
        extra: "Voor overuren en werk op zaterdag gelden vaak toeslagen.",
      },
      schedule: {
        title: "Je werkdag begint",
        accent: "vroeg in de ochtend",
        items: [
          {
            title: "Vroeg beginnen, vroeg klaar",
            body: "Meestal werk je van 07.00 tot 16.00 uur, soms vanaf 06.30 uur.",
            icon: "clock",
          },
          {
            title: "Drukke maanden en bouwvak",
            body: "Van voorjaar tot najaar is het druk, en in de bouwvakantie gaat sloopwerk vaak door.",
            icon: "season",
          },
          {
            title: "Vorst en zware regen",
            body: "Bij vorst of zware regen ligt het werk soms stil, maar bij lichte regen werk je door.",
            icon: "weather",
          },
        ],
      },
      certificates: {
        title: "Welke certificaten je",
        accent: "nodig hebt in de bouw",
        items: [
          {
            name: "VCA Basis",
            need: "always",
            body: "VCA is een diploma voor veilig werken. Je doet een korte cursus en een examen, ook in het Engels, Pools, Turks of Bulgaars.",
          },
          {
            name: "Beschermingsmiddelen",
            need: "always",
            body: "Werkschoenen S3, een helm, een hesje en handschoenen krijg je kosteloos.",
          },
          {
            name: "Asbestherkenning",
            need: "sometimes",
            body: "Bij sloopwerk vraagt een bedrijf soms om deze korte cursus, waarin je leert wanneer je moet stoppen.",
          },
        ],
      },
      why: {
        title: "Veilig beginnen op",
        accent: "de bouwplaats",
        items: [
          {
            title: "Je weet wat je verdient",
            body: "Het bruto uurloon staat bij elke vacature, en je verdient hetzelfde als vaste collega's met hetzelfde werk.",
            icon: "wage",
          },
          {
            title: "Je weet waar je heen gaat",
            body: "Voor je eerste werkdag hoor je het adres, de begintijd en bij wie je je meldt.",
            icon: "safety",
          },
          {
            title: "Bellen met Jimmy of Lorenzo",
            body: "Ook tijdens een project bel of app je Jimmy of Lorenzo met je vragen.",
            icon: "phone",
          },
        ],
      },
      career: {
        title: "Van hulpkracht groei je",
        accent: "door naar vakman",
        steps: ["Hulpkracht", "Opperman of sloper", "Metselaar of stratenmaker na een opleiding", "Ploegleider"],
        note: "Voor een vak als metselaar volg je eerst een opleiding.",
      },
      vacancies: {
        title: "Vacatures in de bouw",
        accent: "en sloop in Den Haag",
        emptyTitle: "Nu geen vacatures in de bouw",
        emptyBody: "Schrijf je toch in. Komt er werk in de bouw vrij, dan bellen wij je.",
      },
      faq: {
        title: "Vragen over werken",
        accent: "op de bouwplaats",
        items: [
          {
            q: "Heb ik VCA nodig?",
            a: "Ja, op bijna elke bouwplaats heb je een VCA-diploma nodig. In de vacature staat of het bedrijf erom vraagt.",
            specific: true,
          },
          {
            // TODO claim certificateSupport: hulp bij het halen van VCA, en wie de cursus betaalt
            q: "Kunnen jullie me helpen om VCA te halen?",
            a: "Ja, wij helpen je om je VCA-diploma te halen. Wij vertellen je waar en wanneer je de cursus en het examen kunt doen.",
            specific: true,
            claim: "certificateSupport",
          },
          {
            q: "Werk ik ook met asbest?",
            a: "Nee, je werkt nooit met asbest. Zie je materiaal dat erop lijkt, dan stop je en meld je het bij je leidinggevende.",
            specific: true,
          },
          {
            q: "Hoe laat begint mijn werkdag?",
            a: "Meestal om 07.00 uur, soms al om 06.30 uur. In de vacature staat hoe laat de ploeg begint en stopt.",
            specific: true,
          },
          {
            q: "Kan ik in de bouw beginnen zonder ervaring?",
            a: "Dat hangt af van de vacature. Voor een deel van het werk vraagt een bouwbedrijf geen ervaring, wel een VCA-diploma.",
            specific: true,
          },
          {
            q: "Kan ik doorgroeien naar vakman?",
            a: "Ja, met een opleiding kun je bijvoorbeeld metselaar, stratenmaker of timmerman worden. Vertel ons in het eerste gesprek wat je later wilt.",
            specific: true,
          },
          {
            // TODO claim transport: vervoer naar de bouwplaats
            q: "Hoe kom ik op de bouwplaats zonder auto?",
            a: "Wij regelen vervoer naar de bouwplaats als die slecht met bus of tram te bereiken is. In de vacature staat hoe je er komt.",
            specific: true,
            claim: "transport",
          },
          {
            q: "Kost solliciteren bij jullie iets?",
            a: "Nee, solliciteren en inschrijven zijn gratis. Je hebt ook geen cv nodig, want aan de telefoon vertel je waar je al hebt gewerkt.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Personeel zoeken voor een bouw- of sloopbedrijf? Lees wat Groos voor opdrachtgevers doet.",
        linkLabel: "Naar de pagina voor werkgevers",
      },
      cta: {
        title: "Wil je aan de slag",
        accent: "op de bouwplaats?",
        body: "Solliciteer op een vacature of schrijf je in. Jimmy of Lorenzo belt je daarna om kennis te maken.",
      },
    },
    employer: {
      meta: {
        title: "Hulpkrachten bouw en sloop inhuren in Den Haag",
        description:
          "Zoekt u hulpkrachten, oppermannen of slopers voor uw bouwplaats in Den Haag? Groos levert mensen voor een dag, een paar weken of langer. Vraag personeel aan.",
        keywords: [
          "hulpkrachten bouw inhuren",
          "opperman inhuren",
          "sloper inhuren den haag",
          "uitzendbureau bouw den haag",
          "bouwplaatsmedewerker uitzendkracht",
        ],
        serviceType: "Uitzenden van hulpkrachten bouw en sloop",
      },
      hero: {
        title: "Hulpkrachten voor uw bouwplaats of sloopproject",
        lead: "U zoekt hulpkrachten, oppermannen of slopers die veilig meewerken op uw project. Wij bespreken vooraf welke certificaten nodig zijn en hoe laat de ploeg begint.",
      },
      supply: {
        title: "Wat onze hulpkrachten",
        accent: "op uw project doen",
        intro: "Onze medewerkers ondersteunen uw vakmensen en houden de bouwplaats op orde.",
        tasks: [
          "De bouwplaats opruimen en materiaal aan- en afvoeren",
          "Specie mengen en stenen aangeven aan metselaars of stratenmakers",
          "Plafonds, vloerbedekking, keukens en sanitair strippen",
          "Sloopafval scheiden en containers vullen",
          "Graven en aanvullen bij grondwerk, kabels en leidingen",
        ],
        clientsTitle: "Voor deze soorten bedrijven",
        clients: [
          "Bouwbedrijven en onderaannemers in de woningbouw",
          "Sloop- en renovatiebedrijven",
          "Stratenmakers en bedrijven in grond-, weg- en waterbouw",
          "Afbouw- en steigerbedrijven",
        ],
      },
      why: {
        title: "Hulpkrachten die veilig werken",
        accent: "volgens uw regels",
        items: [
          {
            title: "VCA per kandidaat besproken",
            body: "Wij vragen elke kandidaat naar het VCA-diploma en de ervaring. Voor de start hoort u wie er komt.",
            icon: "shield",
          },
          {
            title: "Uw projectinstructie geldt",
            body: "Onze hulpkrachten volgen uw instructies en de aanwijzingen van uw uitvoerder. Met asbest werken zij nooit.",
            icon: "safety",
          },
          {
            title: "Korte lijn met Jimmy of Lorenzo",
            body: "Over de planning, de uren en de mensen op uw project belt u met Jimmy of Lorenzo.",
            icon: "phone",
          },
          {
            title: "Mee met de fasen van uw project",
            body: "Heeft u voor het strippen of de sloopfase meer mensen nodig, dan bespreken wij dat vooraf.",
            icon: "calendar",
          },
        ],
      },
      certificates: {
        title: "Certificaten die wij",
        accent: "per kandidaat bespreken",
        items: [
          {
            name: "VCA Basis",
            need: "always",
            body: "Het VCA-diploma laat zien dat de medewerker de basisregels voor veilig werken kent.",
          },
          {
            name: "Persoonlijke beschermingsmiddelen",
            need: "always",
            body: "Werkschoenen S3, helm, hesje en gehoor- en stofbescherming zijn altijd kosteloos voor de medewerker.",
          },
          {
            name: "Asbestherkenning",
            need: "sometimes",
            body: "Bij sloopwerk vraagt u soms om deze korte cursus, zodat de medewerker verdacht materiaal herkent.",
          },
        ],
      },
      planning: {
        title: "Planning rond seizoen,",
        accent: "weer en projectduur",
        items: [
          {
            title: "Meer vraag buiten de winter",
            body: "De meeste vraag is er tussen voorjaar en najaar, en in de bouwvak loopt sloop vaak door.",
            icon: "season",
          },
          {
            title: "Begintijd 07.00 uur",
            body: "Een werkdag loopt meestal van 07.00 tot 16.00 uur, en wij spreken af bij wie de medewerker zich meldt.",
            icon: "clock",
          },
          {
            title: "Weken of maanden op één project",
            body: "Hulpkrachten blijven vaak weken of maanden op hetzelfde project, tot de fase klaar is.",
            icon: "calendar",
          },
        ],
      },
      legal: {
        title: "Zekerheid over loon",
        accent: "en veiligheid",
        items: [
          {
            text: "De medewerker krijgt een gelijkwaardige beloning. Dat is een pakket dat minstens gelijk is aan dat van uw vaste mensen in dezelfde functie.",
          },
          {
            text: "Volgens de Arbowet zorgt u als inlener voor instructie en een veilige werkplek. U vertelt ons vooraf welke risico's uw bouwplaats heeft.",
          },
          {
            text: "Bij inlenersaansprakelijkheid kan de Belastingdienst u aanspreken als loonheffingen voor een uitzendkracht niet zijn betaald.",
          },
        ],
        wttaLinkLabel: "Lees meer over de Wtta",
      },
      faq: {
        title: "Vragen over hulpkrachten",
        accent: "op uw bouwplaats",
        items: [
          {
            q: "Hebben uw hulpkrachten een VCA-diploma?",
            a: "Dat bespreken wij per kandidaat. Vraagt uw project VCA Basis, dan hoort u voor de start of de kandidaat een geldig diploma heeft.",
            specific: true,
          },
          {
            q: "Mogen uw mensen met asbest werken?",
            a: "Nee, nooit. Onze hulpkrachten werken niet met asbest. Zien zij materiaal dat erop lijkt, dan stoppen zij en melden zij het bij uw uitvoerder.",
            specific: true,
          },
          {
            q: "Wie levert de beschermingsmiddelen?",
            a: "Dat spreken wij vooraf met u af. Of Groos ze levert of u, voor de medewerker zijn ze altijd kosteloos.",
            specific: true,
          },
          {
            q: "Kunnen ze weken op hetzelfde project blijven?",
            a: "Ja, u bepaalt hoe lang de inzet duurt, van een paar dagen tot de hele ruwbouw. Wie lang blijft, kent uw bouwplaats en uw uitvoerder.",
            specific: true,
          },
          {
            // TODO claim replacement: vervanging bij uitval, met termijn
            q: "Wat gebeurt er als een hulpkracht uitvalt?",
            a: "Valt een medewerker onverwacht uit, dan zoeken wij een vervanger en houden wij u op de hoogte. Zo blijft uw ploeg op sterkte.",
            specific: false,
            claim: "replacement",
          },
          {
            q: "Wat kost een hulpkracht via Groos?",
            a: "Het tarief hangt af van de functie, de uren, de begintijd en de duur van het project. Na uw aanvraag krijgt u een voorstel met een uurtarief.",
            specific: false,
          },
          {
            q: "Welk loon krijgt de medewerker?",
            a: "De medewerker krijgt een gelijkwaardige beloning, dus minstens wat uw vaste mensen in dezelfde functie krijgen. Een nieuwkomer in de bouw verdient minder dan een ervaren opperman of sloper.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Zelf werk zoeken als hulpkracht bouw en sloop? Op de pagina voor werkzoekenden staat alles over het werk.",
        linkLabel: "Naar de pagina voor werkzoekenden",
      },
      cta: {
        title: "Hulpkrachten nodig",
        accent: "voor uw volgende project?",
        body: "Vertel ons hoeveel mensen u zoekt en vanaf wanneer. Wij nemen contact met u op om de certificaten en de begintijd door te nemen.",
      },
    },
  },
  en: {
    jobseeker: {
      meta: {
        title: "Work as a construction and demolition labourer",
        description:
          "Do you want to work as a construction and demolition labourer in The Hague? Read what you earn, when you start and why you need VCA. Apply without a CV.",
        keywords: [
          "construction labourer jobs the hague",
          "bricklayer's mate jobs",
          "demolition worker jobs the hague",
          "construction jobs without experience",
          "vca certificate the hague",
          "praca budowa holandia",
        ],
      },
      hero: {
        title: "Work as a construction and demolition labourer in The Hague",
        lead: "As a construction and demolition labourer, you help skilled workers on site, for example by clearing up. You work outside in a team, usually from 07:00 to 16:00.",
        facts: [{ label: "Certificate", value: "VCA safety certificate" }],
      },
      work: {
        title: "What you do on the building site",
        accent: "and in demolition",
        intro: "You help bricklayers, carpenters and paviours keep working.",
        tasks: [
          "Clearing up the site and bringing in materials",
          "Mixing mortar and passing bricks as a bricklayer's mate",
          "Removing ceilings, floors and kitchens (stripping)",
          "Sorting demolition waste and filling skips",
          "Digging and backfilling during groundwork",
        ],
        placesTitle: "Where you work",
        places: ["New homes being built", "Renovation of flats and rented homes", "Demolition and paving projects"],
      },
      requirements: {
        title: "What you bring",
        accent: "to the building site",
        items: [
          "You work outside and can lift, bend and stand all day",
          "You speak enough Dutch or English for safety instructions",
          "You never work with asbestos. If you see material that looks like it, you stop and report it.",
        ],
        minAgeNote: "Because you work in construction and demolition, you must be at least 18 years old.",
      },
      wage: {
        title: "What you earn",
        accent: "in construction",
        intro: "Newcomers usually start on a starting wage, and with experience you earn more.",
        sourceLabel: "starting table and job group wages, Bouw en Infra collective labour agreement (cao), 1 July 2026",
        extra: "Extra pay often applies for overtime and work on Saturdays.",
      },
      schedule: {
        title: "Your working day starts",
        accent: "early in the morning",
        items: [
          {
            title: "Start early, finish early",
            body: "You usually work from 07:00 to 16:00, sometimes from 06:30.",
            icon: "clock",
          },
          {
            title: "Busy months and summer break",
            body: "It is busy from spring to autumn, and demolition often continues in the summer break.",
            icon: "season",
          },
          {
            title: "Frost and heavy rain",
            body: "In frost or heavy rain, work sometimes stops, but in light rain you keep working.",
            icon: "weather",
          },
        ],
      },
      certificates: {
        title: "Which certificates you",
        accent: "need in construction",
        items: [
          {
            name: "VCA Basis",
            need: "always",
            body: "The VCA safety certificate shows you can work safely. You take a short course and an exam, also in English, Polish, Turkish or Bulgarian.",
          },
          {
            name: "Protective equipment",
            need: "always",
            body: "You get S3 work shoes, a helmet, a high visibility vest and gloves free of charge.",
          },
          {
            name: "Asbestos awareness",
            need: "sometimes",
            body: "For demolition work, a company sometimes asks for this short course on when to stop.",
          },
        ],
      },
      why: {
        title: "A safe start on",
        accent: "the building site",
        items: [
          {
            title: "You know what you earn",
            body: "Every job advert shows the gross hourly wage, which is the same as for permanent colleagues.",
            icon: "wage",
          },
          {
            title: "You know where to go",
            body: "Before day one, you hear the address, start time and who to report to.",
            icon: "safety",
          },
          {
            title: "Call Jimmy or Lorenzo",
            body: "During a project, you call or message Jimmy or Lorenzo with your questions.",
            icon: "phone",
          },
        ],
      },
      career: {
        title: "From labourer you grow",
        accent: "into a skilled trade",
        steps: ["Labourer", "Bricklayer's mate or demolition worker", "Bricklayer or paviour after training", "Crew leader"],
        note: "A skilled trade starts with a training course.",
      },
      vacancies: {
        title: "Jobs in construction",
        accent: "and demolition in The Hague",
        emptyTitle: "No construction jobs right now",
        emptyBody: "You can still register. When construction work comes up, we call you.",
      },
      faq: {
        title: "Questions about working",
        accent: "on a building site",
        items: [
          {
            q: "Do I need VCA?",
            a: "Yes, almost every building site asks for a VCA safety certificate. The job advert says whether the company needs it.",
            specific: true,
          },
          {
            q: "Can you help me get my VCA?",
            a: "Yes, we help you get your VCA safety certificate. We tell you where and when you can take the course and the exam.",
            specific: true,
            claim: "certificateSupport",
          },
          {
            q: "Will I work with asbestos?",
            a: "No, you never work with asbestos. If you see material that looks like it, you stop and tell your supervisor.",
            specific: true,
          },
          {
            q: "What time does my day start?",
            a: "Usually at 07:00, sometimes already at 06:30. The job advert says what time the team starts and stops.",
            specific: true,
          },
          {
            q: "Can I start in construction without experience?",
            a: "That depends on the job. For some work, a company asks for no experience, only a VCA safety certificate.",
            specific: true,
          },
          {
            q: "Can I grow into a skilled trade?",
            a: "Yes, with training you can become a bricklayer, paviour or carpenter. Tell us in the first conversation what you want.",
            specific: true,
          },
          {
            q: "How do I get to the site without a car?",
            a: "We arrange transport to the building site if it is hard to reach by bus or tram. The job advert says how you get there.",
            specific: true,
            claim: "transport",
          },
          {
            q: "Does it cost anything to apply with you?",
            a: "No, applying and registering are free. You do not need a CV, because you tell us on the phone where you have worked.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Looking for staff for a construction or demolition company? Read what Groos does for clients.",
        linkLabel: "Go to the page for employers",
      },
      cta: {
        title: "Do you want to start",
        accent: "on a building site?",
        body: "Apply for a job or register. Jimmy or Lorenzo then calls you to get to know you.",
      },
    },
    employer: {
      meta: {
        title: "Hire construction and demolition labourers",
        description:
          "Do you need labourers, bricklayers' mates or demolition workers in The Hague? Groos provides people for a day, a few weeks or longer. Request staff.",
        keywords: [
          "hire construction labourers the hague",
          "bricklayer's mate hire",
          "demolition workers the hague",
          "construction employment agency the hague",
          "temporary construction workers",
        ],
        serviceType: "Temporary staffing of construction and demolition labourers",
      },
      hero: {
        title: "Labourers for your building site or demolition project",
        lead: "You need labourers, bricklayers' mates or demolition workers who work safely on your project. We discuss in advance which certificates are needed and when the team starts.",
      },
      supply: {
        title: "What our labourers",
        accent: "do on your project",
        intro: "Our workers support your skilled staff and keep the building site in order.",
        tasks: [
          "Clearing up the site and moving materials in and out",
          "Mixing mortar and passing bricks to bricklayers or paviours",
          "Stripping ceilings, floor coverings, kitchens and bathrooms",
          "Sorting demolition waste and filling skips",
          "Digging and backfilling for groundwork, cables and pipes",
        ],
        clientsTitle: "For these types of companies",
        clients: [
          "Construction companies and subcontractors in housebuilding",
          "Demolition and renovation companies",
          "Paving contractors and civil engineering companies",
          "Finishing and scaffolding companies",
        ],
      },
      why: {
        title: "Labourers who work safely",
        accent: "according to your rules",
        items: [
          {
            title: "VCA discussed per candidate",
            body: "We ask every candidate about their VCA safety certificate and experience. Before the start, you hear who is coming.",
            icon: "shield",
          },
          {
            title: "Your site instructions apply",
            body: "Our labourers follow your instructions and the directions of your site manager. They never work with asbestos.",
            icon: "safety",
          },
          {
            title: "Direct contact with Jimmy or Lorenzo",
            body: "You call Jimmy or Lorenzo about the planning, the hours and the people on your project.",
            icon: "phone",
          },
          {
            title: "Following your project phases",
            body: "If you need more people for the strip-out or the demolition phase, we discuss that with you in advance.",
            icon: "calendar",
          },
        ],
      },
      certificates: {
        title: "Certificates we discuss",
        accent: "for each candidate",
        items: [
          {
            name: "VCA Basis",
            need: "always",
            body: "The VCA safety certificate shows that the worker knows the basic rules for working safely.",
          },
          {
            name: "Personal protective equipment",
            need: "always",
            body: "S3 work shoes, helmet, high visibility vest and hearing and dust protection are always free for the worker.",
          },
          {
            name: "Asbestos awareness",
            need: "sometimes",
            body: "For demolition work, you sometimes ask for this short course, so the worker recognises suspicious material.",
          },
        ],
      },
      planning: {
        title: "Planning around season,",
        accent: "weather and project length",
        items: [
          {
            title: "More demand outside winter",
            body: "Most demand falls between spring and autumn, and demolition often continues in the summer break.",
            icon: "season",
          },
          {
            title: "Start time 07:00",
            body: "A working day usually runs from 07:00 to 16:00, and we agree who the worker reports to.",
            icon: "clock",
          },
          {
            title: "Weeks or months on one project",
            body: "Labourers often stay on the same project for weeks or months, until the phase is finished.",
            icon: "calendar",
          },
        ],
      },
      legal: {
        title: "Certainty about pay",
        accent: "and safety",
        items: [
          {
            text: "The worker receives equivalent pay, a package at least equal to that of your permanent staff in the same role.",
          },
          {
            text: "Under the Working Conditions Act (Arbowet), you as the hirer provide instruction and a safe workplace. You tell us the risks of your site in advance.",
          },
          {
            text: "Under hirer's liability, the Tax Administration can hold you liable if payroll taxes for a temporary worker have not been paid.",
          },
        ],
        wttaLinkLabel: "Read more about the Wtta",
      },
      faq: {
        title: "Questions about labourers",
        accent: "on your building site",
        items: [
          {
            q: "Do your labourers have a VCA certificate?",
            a: "We discuss that per candidate. If your project requires VCA Basis, you hear before the start whether the candidate holds a valid certificate.",
            specific: true,
          },
          {
            q: "Are your people allowed to work with asbestos?",
            a: "No, never. If our labourers see material that looks like asbestos, they stop and report it to your site manager.",
            specific: true,
          },
          {
            q: "Who provides the protective equipment?",
            a: "We agree that with you in advance. Whether Groos or you provide it, it is always free of charge for the worker.",
            specific: true,
          },
          {
            q: "Can they stay on the same project for weeks?",
            a: "Yes, you decide how long the assignment lasts, from a few days to the whole shell construction. Someone who stays longer knows your site and your site manager.",
            specific: true,
          },
          {
            q: "What happens if a labourer drops out?",
            a: "If a worker drops out unexpectedly, we look for a replacement and keep you informed. That way your team stays at full strength.",
            specific: false,
            claim: "replacement",
          },
          {
            q: "What does a labourer through Groos cost?",
            a: "The rate depends on the role, the hours, the start time and the length of the project. After your request, you receive a proposal with an hourly rate.",
            specific: false,
          },
          {
            q: "What pay does the worker receive?",
            a: "The worker receives equivalent pay, so at least what your permanent staff in the same role receive. A newcomer to construction earns less than an experienced demolition worker.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Looking for work as a construction and demolition labourer? The page for job seekers has everything about the work.",
        linkLabel: "Go to the page for job seekers",
      },
      cta: {
        title: "Do you need labourers",
        accent: "for your next project?",
        body: "Tell us how many people you need and from when. We will contact you to go through the certificates and the start time.",
      },
    },
  },
} satisfies BeroepContent;
