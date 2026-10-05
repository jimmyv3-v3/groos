import type { BeroepContent } from "@/content/beroepen/types";

export const sloper = {
  id: "sloper",
  wage: {
    starter: { min: 15.98, max: 16.97 },
    experienced: { min: 20.02, max: 21.24 },
    tableDate: "2026-07-01",
    checkedAt: "2026-10-05",
    reviewBy: "2027-01-01",
    sourceUrl: "https://media.umbraco.io/bouwend-nederland/z0niekfd/loontabellen-bouwplaatswerknemer-cao-2025-2027-mei-2026.pdf",
  },
  minAge18: "construction_demolition",
  nl: {
    jobseeker: {
      meta: {
        title: "Werken als sloper in Den Haag",
        description:
          "Als sloper in Den Haag strip je panden en sloop je met sloophamer en slijptol. Lees wat je verdient, welke certificaten je nodig hebt en hoe je solliciteert.",
        keywords: [
          "sloper vacature den haag",
          "werken als sloper",
          "handsloper vacature",
          "sloper worden",
          "sloper uurloon",
          "sloopwerk vacatures",
        ],
      },
      hero: {
        title: "Werken als sloper in Den Haag",
        lead: "Als sloper strip je panden en sloop je met sloophamer, zaag en slijptol. Je werkt in een ploeg, vaak naast de sloopkraan.",
        facts: [{ label: "Soort werk", value: "Strippen, renovatiesloop en totaalsloop" }],
      },
      work: {
        title: "Zo haal je een pand",
        accent: "gecontroleerd uit elkaar",
        tasks: [
          "Plafonds, binnenwanden, keukens en sanitair strippen tot op het casco",
          "Wanden en vloeren slopen met sloophamer en slijptol",
          "Nat werken en stof afzuigen",
          "Hout, metaal en puin gescheiden afvoeren",
          "Deuren en kozijnen heel uitnemen voor hergebruik",
          "Naruimen en sorteren naast de sloopkraan",
        ],
        placesTitle: "Waar je sloopt en stript",
        places: [
          "Kantoren die woningen worden",
          "Huurwoningen die een nieuwe keuken en badkamer krijgen",
          "Winkels en kantoren die in gebruik blijven",
        ],
      },
      requirements: {
        title: "Wat je meebrengt",
        accent: "voor het sloopwerk",
        items: [
          "Je kent sloophamer en slijptol, of je leert ermee werken onder toezicht",
          "Je overlegt in het Nederlands of Engels met je ploeg",
          "Je hebt vaak rijbewijs B nodig, omdat de slooplocatie wisselt",
        ],
        minAgeNote: "Omdat je op een sloopplaats met lawaai en trillingen werkt, is de minimumleeftijd 18 jaar.",
      },
      wage: {
        title: "Wat je verdient als",
        accent: "nieuwkomer en met ervaring",
        intro: "Ben je nieuw in de bouw, dan begin je op hetzelfde startloon als een hulpkracht. Het verschil komt met ervaring.",
        sourceLabel: "starttabel en garantielonen voor Sloper II en Sloper I, cao Bouw en Infra, stand op 1 juli 2026",
        extra: "Na 19.00 uur en in het weekend geldt meestal een toeslag.",
      },
      schedule: {
        title: "Vroeg beginnen en soms",
        accent: "in de avond slopen",
        items: [
          {
            title: "Overdag en vroeg beginnen",
            body: "Sloopwerk gebeurt meestal tussen 07.00 en 19.00 uur, en ploegen beginnen vaak vroeg.",
            icon: "clock",
          },
          {
            title: "Soms avond of weekend",
            body: "In winkels en kantoren die in gebruik blijven, sloop je soms buiten kantooruren of in het weekend.",
            icon: "evening",
          },
          {
            title: "Ook in de bouwvak",
            body: "Strippen is binnenwerk voor het hele jaar, en in de bouwvak loopt sloop vaak door.",
            icon: "season",
          },
        ],
      },
      certificates: {
        title: "Certificaten en instructies",
        accent: "voor veilig slopen",
        items: [
          {
            name: "VCA Basis",
            need: "always",
            body: "Vrijwel elke slooplocatie vraagt dit diploma, en de cursus met examen duurt 1 dag.",
          },
          {
            name: "Asbestherkenning",
            need: "often",
            body: "In hoogstens 1 dag leer je asbest herkennen en wat je bij een vondst doet.",
          },
          {
            name: "Beschermingsmiddelen",
            need: "always",
            body: "Helm, werkschoenen S3, gehoorbescherming en adembescherming krijg je kosteloos.",
          },
        ],
      },
      why: {
        title: "Sloopwerk waarbij je vooraf",
        accent: "weet waar je aan begint",
        items: [
          {
            title: "Loon bij de vacature",
            body: "Bij elke vacature lees je het bruto uurloon, gelijk aan dat van vaste slopers met hetzelfde werk.",
            icon: "wage",
          },
          {
            title: "Je kent het pand vooraf",
            body: "Wij vertellen je vooraf waar het pand staat en of je stript of sloopt.",
            icon: "building",
          },
          {
            title: "Bellen of appen",
            body: "Onveilig werk meld je bij je leidinggevende, en ons team kun je bellen of appen.",
            icon: "phone",
          },
        ],
      },
      career: {
        title: "Van slopen onder toezicht",
        accent: "naar zelf een ploeg leiden",
        steps: ["Sloper onder toezicht", "Zelfstandig sloper", "Ploegleider sloopwerken", "Machinist of uitvoerder"],
        note: "Voor ploegleider en uitvoerder bestaan eigen opleidingen.",
      },
      vacancies: {
        title: "Vacatures in strippen en slopen",
        accent: "in Den Haag",
        emptyTitle: "Op dit moment geen sloopwerk",
        emptyBody: "Schrijf je toch in. Komt er een sloopproject, dan bellen wij je.",
      },
      faq: {
        title: "Vragen over sloophamer,",
        accent: "loon en asbest",
        items: [
          {
            q: "Wat doet een sloper anders dan een sloophulp?",
            a: "Een sloophulp ruimt op en sjouwt. Een sloper sloopt en stript zelf, met sloophamer en slijptol.",
            specific: true,
          },
          {
            q: "Verdien ik meer dan een hulpkracht?",
            a: "In je eerste jaar in de bouw niet, want het startloon is voor iedereen gelijk. Met ervaring verdien je meestal meer.",
            specific: true,
          },
          {
            q: "Sloop ik ook asbest?",
            a: "Nee, asbest verwijderen is een apart vak met eigen certificaten en hoort niet bij dit werk. Zie je verdacht materiaal, dan leg je het werk stil en meld je het.",
            specific: true,
          },
          {
            q: "Sta ik de hele dag op de sloophamer?",
            a: "Nee, want trillingen belasten je handen en armen. Je wisselt hakken af met strippen en sorteren.",
            specific: true,
          },
          {
            q: "Kan ik beginnen zonder ervaring in de sloop?",
            a: "Dat verschilt per vacature. Je werkt dan onder toezicht van een sloper die het vak kent.",
            specific: true,
          },
          {
            // TODO claim certificateSupport: hulp bij het halen van VCA of asbestherkenning, en wie de cursus betaalt
            q: "Helpen jullie mij aan VCA of een cursus asbestherkenning?",
            a: "Ja, wij helpen je om VCA Basis of asbestherkenning te halen. Wij spreken vooraf af wanneer de cursus is en wie hem betaalt.",
            specific: true,
            claim: "certificateSupport",
          },
          {
            // TODO claim transport: vervoer naar de slooplocatie
            q: "Hoe kom ik op een slooplocatie zonder eigen auto?",
            a: "Wij regelen vervoer als de slooplocatie slecht met bus of tram te bereiken is. Bij de vacature staat hoe je er komt.",
            specific: true,
            claim: "transport",
          },
          {
            q: "Kost solliciteren mij iets?",
            a: "Nee, solliciteren en inschrijven kosten niets, en een cv hoeft niet.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Slopers zoeken voor een sloopbedrijf? Lees op de werkgeverspagina hoe Groos helpt.",
        linkLabel: "Slopers inhuren via Groos",
      },
      cta: {
        title: "Wil je panden strippen",
        accent: "en slopen in Den Haag?",
        body: "Reageer op een sloopvacature of schrijf je in, dan belt ons team je.",
      },
    },
    employer: {
      meta: {
        title: "Slopers inhuren in Den Haag",
        description:
          "Zoekt u slopers voor stripwerk, renovatiesloop of totaalsloop in Den Haag? Groos bespreekt per kandidaat de ervaring en de asbestinstructie. Vraag slopers aan.",
        keywords: [
          "slopers inhuren",
          "sloper inhuren den haag",
          "handslopers inhuren",
          "uitzendbureau sloop den haag",
          "personeel voor sloopbedrijf",
        ],
        serviceType: "Uitzenden van slopers",
      },
      hero: {
        title: "Slopers voor stripwerk, renovatiesloop en totaalsloop in Den Haag",
        lead: "U zoekt slopers die zelf strippen en slopen en weten hoe zij stof en lawaai beperken. Wij bespreken per kandidaat de ervaring en de instructie over asbest.",
      },
      supply: {
        title: "Van stripwerk tot werken",
        accent: "naast de sloopkraan",
        intro: "Onze slopers voeren het sloopwerk zelf uit, volgens uw sloopplan en op aanwijzing van uw ploegleider.",
        tasks: [
          "Plafonds, binnenwanden, vloerafwerking, keukens en sanitair strippen",
          "Wanden, dekvloeren en tegelwerk slopen met een breekhamer",
          "Sparingen zagen en metalen delen doorslijpen",
          "Nat werken en afzuigen om kwartsstof te beperken",
          "Afvalstromen scheiden en materialen heel uitnemen voor hergebruik",
          "De machinist assisteren, naruimen en nathouden",
        ],
        clientsTitle: "Voor deze opdrachtgevers",
        clients: [
          "Sloopaannemers die bij pieken slopers en strippers inlenen",
          "Renovatiebedrijven die voor corporaties keukens en badkamers vervangen",
          "Bouwbedrijven die kantoren ombouwen tot woningen",
          "Bedrijven in winkelontmanteling",
        ],
      },
      why: {
        title: "Sloopwerk met vooraf besproken",
        accent: "ervaring en instructie",
        items: [
          {
            title: "Ervaring per kandidaat",
            body: "U hoort vooraf met welk gereedschap en bij welk soort sloop een kandidaat ervaring heeft.",
            icon: "person",
          },
          {
            title: "Instructie over asbest",
            body: "Wij bespreken per kandidaat of er een cursus asbestherkenning is gevolgd.",
            icon: "shield",
          },
          {
            title: "Overleg zonder taalbarrière",
            body: "De BRL SVMS-007 vraagt overleg zonder taalbarrière, dus wij bespreken per kandidaat de taal op uw werk.",
            icon: "message",
          },
          {
            title: "Bellen bij een andere planning",
            body: "Schuift uw sloopplanning, dan belt u ons team over de bezetting.",
            icon: "phone",
          },
        ],
      },
      certificates: {
        title: "Wat wij per sloper",
        accent: "met u doornemen",
        items: [
          {
            name: "VCA Basis",
            need: "always",
            body: "Vrijwel elke slooplocatie eist VCA Basis, en u hoort per kandidaat of het diploma er is.",
          },
          {
            name: "Asbestherkenning",
            need: "often",
            body: "Veel sloopbedrijven eisen dat slopers asbest herkennen, via een cursus of een eigen instructie.",
          },
          {
            name: "Persoonlijke beschermingsmiddelen",
            need: "always",
            body: "Helm, schoenen S3, gehoorbescherming en adembescherming zijn kosteloos voor de sloper.",
          },
        ],
      },
      planning: {
        title: "Planning per fase van",
        accent: "uw sloopproject",
        items: [
          {
            title: "Van strippen tot eindsloop",
            body: "U geeft per fase door hoeveel slopers u zoekt, en wij bespreken wie wanneer begint.",
            icon: "calendar",
          },
          {
            title: "Avond en weekend in overleg",
            body: "Bij winkels en kantoren die in gebruik blijven, valt sloopwerk soms buiten kantooruren of in het weekend. Meld dat bij uw aanvraag.",
            icon: "evening",
          },
          {
            title: "Doorwerken in de bouwvak",
            body: "Sloop loopt in de bouwvak vaak door, dus bespreek de zomerweken op tijd met ons team.",
            icon: "season",
          },
        ],
      },
      legal: {
        title: "Wat u als sloopbedrijf",
        accent: "vastlegt en regelt",
        items: [
          {
            text: "Werkt u met BRL SVMS-007, dan controleert en registreert u de kwalificaties van ingehuurde slopers voordat zij beginnen.",
          },
          {
            text: "Een sloper via Groos heeft recht op een gelijkwaardige beloning, minstens wat uw eigen slopers voor hetzelfde werk krijgen.",
          },
          {
            text: "Als inlener zorgt u voor instructie, maatregelen tegen kwartsstof en afwisseling bij werk met de breekhamer.",
          },
        ],
        wttaLinkLabel: "Meer over de Wtta en inlenen",
      },
      faq: {
        title: "Vragen van sloopbedrijven",
        accent: "over ingehuurde slopers",
        items: [
          {
            q: "Wat doet een sloper anders dan een hulpkracht?",
            a: "Een hulpkracht ruimt op en sjouwt op aanwijzing. Een sloper stript en sloopt zelf en assisteert de machinist.",
            specific: true,
          },
          {
            q: "Verwijderen uw slopers ook asbest?",
            a: "Nee, asbest verwijderen is een apart vak met eigen certificaten en hoort niet bij dit werk. Een sloper die verdacht materiaal ziet, legt het werk stil en meldt het.",
            specific: true,
          },
          {
            q: "Werken de slopers zelfstandig of onder toezicht?",
            a: "Dat hoort u per kandidaat vooraf. De een sloopt zelfstandig, de ander werkt naast uw eigen slopers.",
            specific: true,
          },
          {
            q: "Wat leg ik vast over ingehuurde slopers?",
            a: "Met BRL SVMS-007 legt u de kwalificaties van elke sloper vast voordat die begint. Wij nemen per kandidaat het VCA-diploma, de asbestinstructie en de ervaring met u door.",
            specific: true,
          },
          {
            // TODO claim replacement: vervanging bij uitval, met termijn
            q: "Wat doet Groos als een sloper uitvalt?",
            a: "Valt een sloper onverwacht uit, dan zoeken wij een vervanger met vergelijkbare ervaring. Wij houden u op de hoogte tot uw ploeg weer compleet is.",
            specific: false,
            claim: "replacement",
          },
          {
            q: "Wat kost het om een sloper in te huren?",
            a: "Dat hangt af van de ervaring, de werktijden en hoe lang het project loopt. U ontvangt na uw aanvraag een voorstel met het tarief per uur.",
            specific: false,
          },
          {
            q: "Welk loon krijgt een sloper via Groos?",
            a: "Minstens hetzelfde als uw eigen slopers met hetzelfde werk. Wie nieuw is in de bouw, begint het eerste jaar op het startloon.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Bent u zelf sloper en zoekt u werk? Lees de pagina voor werkzoekenden.",
        linkLabel: "Werken als sloper",
      },
      cta: {
        title: "Staat er stripwerk of sloop",
        accent: "op uw planning?",
        body: "Vertel ons welk sloopwerk het is, hoeveel mensen u zoekt en wanneer zij beginnen. Ons team neemt contact met u op.",
      },
    },
  },
  en: {
    jobseeker: {
      meta: {
        title: "Work as a demolition worker in The Hague",
        description:
          "As a demolition worker in The Hague, you strip out buildings and demolish with a breaker and angle grinder. Read what you earn and which certificates you need.",
        keywords: [
          "demolition worker jobs the hague",
          "work as a demolition worker",
          "manual demolition jobs",
          "strip-out work the hague",
          "demolition jobs netherlands",
          "praca rozbiórki holandia",
        ],
      },
      hero: {
        title: "Work as a demolition worker in The Hague",
        lead: "You strip out buildings and demolish with a breaker, saw and angle grinder. You work in a team, often beside the demolition excavator.",
        facts: [{ label: "Type of work", value: "Strip-out, renovation and complete demolition" }],
      },
      work: {
        title: "How you take a building",
        accent: "apart in a controlled way",
        tasks: [
          "Stripping ceilings, partitions, kitchens and bathrooms back to the shell",
          "Demolishing walls and floors with a breaker and angle grinder",
          "Working wet and extracting dust",
          "Removing timber, metal and rubble as separate waste",
          "Taking out doors and frames intact for reuse",
          "Clearing up and sorting beside the demolition excavator",
        ],
        placesTitle: "Where you strip out and demolish",
        places: [
          "Offices being converted into homes",
          "Rented homes getting a new kitchen and bathroom",
          "Shops and offices that stay in use",
        ],
      },
      requirements: {
        title: "What you bring",
        accent: "to demolition work",
        items: [
          "You know the breaker and angle grinder, or learn them under supervision",
          "You talk things through with your team in Dutch or English",
          "You often need driving licence B, as the demolition site changes",
        ],
        minAgeNote: "Because a demolition site means noise and vibration, the minimum age is 18.",
      },
      wage: {
        title: "What you earn as",
        accent: "a newcomer and with experience",
        intro: "If you are new to construction, you begin on the same starting wage as a labourer. The difference comes with experience.",
        sourceLabel:
          "starting table and job group pay for Sloper II and Sloper I, Bouw en Infra collective labour agreement (cao), 1 July 2026",
        extra: "Extra pay usually applies after 19:00 and at the weekend.",
      },
      schedule: {
        title: "Early starts and sometimes",
        accent: "demolition in the evening",
        items: [
          {
            title: "Daytime work, early start",
            body: "Demolition work is usually done between 07:00 and 19:00, and teams often start early.",
            icon: "clock",
          },
          {
            title: "Sometimes evenings or weekends",
            body: "In shops and offices that stay in use, you sometimes demolish outside office hours or at the weekend.",
            icon: "evening",
          },
          {
            title: "Also in the summer break",
            body: "Strip-out is indoor work all year, and demolition often continues through the construction summer break.",
            icon: "season",
          },
        ],
      },
      certificates: {
        title: "Certificates and instructions",
        accent: "for safe demolition",
        items: [
          {
            name: "VCA Basis",
            need: "always",
            body: "Almost every demolition site asks for this safety certificate. The course takes 1 day.",
          },
          {
            name: "Asbestos awareness",
            need: "often",
            body: "In 1 day at most, you learn to recognise asbestos and what to do on finding it.",
          },
          {
            name: "Protective equipment",
            need: "always",
            body: "Helmet, S3 shoes, hearing protection and respiratory protection are free for you.",
          },
        ],
      },
      why: {
        title: "Demolition work where you know",
        accent: "in advance what to expect",
        items: [
          {
            title: "Pay in the job advert",
            body: "Each job advert states the gross hourly wage, equal to that of permanent staff.",
            icon: "wage",
          },
          {
            title: "You know the building beforehand",
            body: "We tell you beforehand where the building is and whether you strip out or demolish.",
            icon: "building",
          },
          {
            title: "Phone or message us",
            body: "Report unsafe work to your supervisor, and phone or message our team with questions.",
            icon: "phone",
          },
        ],
      },
      career: {
        title: "From supervised demolition work",
        accent: "to running a team yourself",
        steps: ["Demolition worker under supervision", "Independent demolition worker", "Demolition team leader", "Excavator operator or site manager"],
        note: "Team leader and site manager have their own training courses.",
      },
      vacancies: {
        title: "Strip-out and demolition jobs",
        accent: "in The Hague",
        emptyTitle: "No demolition work at the moment",
        emptyBody: "Register anyway. When a demolition project comes up, we call you.",
      },
      faq: {
        title: "Questions about breakers,",
        accent: "pay and asbestos",
        items: [
          {
            q: "How does a demolition worker differ from a labourer?",
            a: "A labourer clears up and carries. A demolition worker strips out and demolishes, with breaker and angle grinder.",
            specific: true,
          },
          {
            q: "Do I earn more than a labourer?",
            a: "Not in your first year in construction, when everyone gets the same starting wage. With experience, you usually earn more.",
            specific: true,
          },
          {
            q: "Will I remove asbestos too?",
            a: "No, asbestos removal is a separate trade with its own certificates and not part of this work. If you see suspect material, you stop work and report it.",
            specific: true,
          },
          {
            q: "Am I on the breaker all day?",
            a: "No, vibration strains your hands and arms. You alternate breaking with stripping out and sorting.",
            specific: true,
          },
          {
            q: "Can I start without demolition experience?",
            a: "That differs per job. You then work under someone who knows the trade.",
            specific: true,
          },
          {
            q: "Can you help me get VCA or asbestos awareness training?",
            a: "Yes, we help you obtain VCA Basis or an asbestos awareness certificate. We agree in advance when the course takes place and who pays for it.",
            specific: true,
            claim: "certificateSupport",
          },
          {
            q: "How do I reach a demolition site without my own car?",
            a: "We arrange transport if the demolition site is hard to reach by bus or tram. The job advert explains how you get there.",
            specific: true,
            claim: "transport",
          },
          {
            q: "Does applying cost me anything?",
            a: "No, applying and registering cost nothing, and you can do without a CV.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Need demolition workers for your company? The employers' page explains how Groos helps.",
        linkLabel: "Hire demolition workers through Groos",
      },
      cta: {
        title: "Do you want to strip out",
        accent: "and demolish buildings in The Hague?",
        body: "Respond to a demolition job or register, and our team calls you.",
      },
    },
    employer: {
      meta: {
        title: "Hire demolition workers in The Hague",
        description:
          "Do you need demolition workers for strip-out, renovation or complete demolition in The Hague? Groos discusses experience and asbestos awareness per candidate.",
        keywords: [
          "hire demolition workers the hague",
          "demolition workers netherlands",
          "manual demolition staff",
          "strip-out workers the hague",
          "demolition employment agency the hague",
        ],
        serviceType: "Temporary staffing of demolition workers",
      },
      hero: {
        title: "Demolition workers for strip-out, renovation and complete demolition in The Hague",
        lead: "You need demolition workers who strip out and demolish themselves and know how to limit dust and noise. We discuss each candidate's experience and asbestos instruction with you.",
      },
      supply: {
        title: "From soft strip to working",
        accent: "beside the demolition excavator",
        intro: "Our people do the demolition work themselves, following your demolition plan and your team leader's directions.",
        tasks: [
          "Stripping out ceilings, partition walls, floor finishes, kitchens and bathrooms",
          "Breaking out walls, screeds and tiling with a breaker",
          "Sawing openings and cutting through metal parts",
          "Working wet and extracting to limit silica dust",
          "Separating waste streams and removing materials intact for reuse",
          "Assisting the excavator operator, clearing up and damping down",
        ],
        clientsTitle: "For these clients",
        clients: [
          "Demolition contractors hiring strip-out workers at peak times",
          "Renovation companies replacing kitchens and bathrooms for housing associations",
          "Construction companies converting offices into homes",
          "Retail disassembly companies",
        ],
      },
      why: {
        title: "Demolition work with experience",
        accent: "and instruction discussed upfront",
        items: [
          {
            title: "Experience per candidate",
            body: "You hear in advance which tools a candidate has used and in what type of demolition.",
            icon: "person",
          },
          {
            title: "Asbestos instruction",
            body: "We discuss per candidate whether an asbestos awareness course has been taken.",
            icon: "shield",
          },
          {
            title: "No language barrier",
            body: "BRL SVMS-007 requires communication without a language barrier, so we discuss the language on your site per candidate.",
            icon: "message",
          },
          {
            title: "Call when the schedule shifts",
            body: "If your demolition schedule moves, you phone our team about staffing.",
            icon: "phone",
          },
        ],
      },
      certificates: {
        title: "What we go through with you",
        accent: "for each demolition worker",
        items: [
          {
            name: "VCA Basis",
            need: "always",
            body: "Almost every demolition site requires VCA Basis, and you hear who holds the certificate.",
          },
          {
            name: "Asbestos awareness",
            need: "often",
            body: "Many demolition companies require workers to recognise asbestos, through a course or in-house instruction.",
          },
          {
            name: "Personal protective equipment",
            need: "always",
            body: "Helmet, S3 shoes, hearing protection and respiratory protection cost the worker nothing.",
          },
        ],
      },
      planning: {
        title: "Planning for each phase of",
        accent: "your demolition project",
        items: [
          {
            title: "From strip-out to final demolition",
            body: "Per phase, you tell us how many people you need, and we discuss who starts when.",
            icon: "calendar",
          },
          {
            title: "Evenings and weekends by agreement",
            body: "In shops and offices that stay in use, demolition work sometimes falls outside office hours or at the weekend. Mention this in your request.",
            icon: "evening",
          },
          {
            title: "Working through the summer break",
            body: "Demolition often continues through the construction summer break, so discuss the summer weeks with our team early.",
            icon: "season",
          },
        ],
      },
      legal: {
        title: "What you as a demolition company",
        accent: "record and arrange",
        items: [
          {
            text: "If you work with BRL SVMS-007, you check and record the qualifications of hired demolition workers before they start.",
          },
          {
            text: "A worker placed through Groos is entitled to equivalent pay, no less than your own demolition staff get for the same job.",
          },
          {
            text: "As the hirer, you arrange instruction, measures against silica dust and task rotation for work with the breaker.",
          },
        ],
        wttaLinkLabel: "More about the Wtta and hiring staff",
      },
      faq: {
        title: "Questions from demolition companies",
        accent: "about hired demolition workers",
        items: [
          {
            q: "How does a demolition worker differ from a labourer?",
            a: "A labourer clears up and carries as instructed. A demolition worker strips out and demolishes and assists the excavator operator.",
            specific: true,
          },
          {
            q: "Do your demolition workers remove asbestos as well?",
            a: "No, asbestos removal is a separate trade with its own certificates and is not part of this work. Anyone who sees suspect material stops work and reports it.",
            specific: true,
          },
          {
            q: "Do they work independently or under supervision?",
            a: "You hear that beforehand for each candidate. One demolishes independently, another works alongside your own crew.",
            specific: true,
          },
          {
            q: "What do I record about hired demolition workers?",
            a: "Under BRL SVMS-007, you record each worker's qualifications before they start. We go through each candidate's VCA certificate, asbestos instruction and experience with you.",
            specific: true,
          },
          {
            q: "What does Groos do if a demolition worker drops out?",
            a: "If a demolition worker drops out unexpectedly, we look for a replacement with comparable experience. We keep you informed until your team is complete again.",
            specific: false,
            claim: "replacement",
          },
          {
            q: "What does it cost to hire a demolition worker?",
            a: "That depends on experience, working hours and how long the project runs. Once we have your request, we send a proposal stating the rate per hour.",
            specific: false,
          },
          {
            q: "What pay does a demolition worker get through Groos?",
            a: "No less than your own crew earns for the same work. Anyone new to construction spends the first year on the starting wage.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Are you a demolition worker looking for work yourself? Read the page for job seekers.",
        linkLabel: "Work as a demolition worker",
      },
      cta: {
        title: "Is there strip-out or demolition",
        accent: "on your schedule?",
        body: "Tell us what demolition work it is, how many people you need and when they start. Our team will contact you.",
      },
    },
  },
} satisfies BeroepContent;
