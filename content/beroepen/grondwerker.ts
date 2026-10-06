import type { BeroepContent } from "@/content/beroepen/types";

export const grondwerker = {
  id: "grondwerker",
  wage: {
    starter: { min: 15.98, max: 16.97 },
    experienced: { min: 18.95, max: 21.24 },
    tableDate: "2026-07-01",
    checkedAt: "2026-10-05",
    reviewBy: "2027-01-01",
    sourceUrl: "https://media.umbraco.io/bouwend-nederland/z0niekfd/loontabellen-bouwplaatswerknemer-cao-2025-2027-mei-2026.pdf",
  },
  minAge18: "construction_demolition",
  nl: {
    jobseeker: {
      meta: {
        title: "Werken als grondwerker in Den Haag",
        description:
          "Wil je werken als grondwerker in Den Haag? Lees wat je in de sleuf doet, wat je verdient met en zonder ervaring en welke instructies je nodig hebt.",
        keywords: [
          "grondwerker vacature",
          "grondwerker den haag",
          "grondwerker salaris per uur",
          "grondwerker zonder ervaring",
          "vacature grondwerker gww",
          "grondwerker uitzendbureau",
        ],
      },
      hero: {
        title: "Werken als grondwerker in Den Haag",
        lead: "Als grondwerker graaf je sleuven, leg je kabels en leidingen met de schop vrij en vul je de sleuf weer aan. De ploeg is klein en werkt buiten.",
        facts: [{ label: "Begintijd", value: "Meestal 07.00 uur" }],
      },
      work: {
        title: "Wat je doet in",
        accent: "en rond de sleuf",
        intro: "Je doet het handwerk waar de graafmachine niet kan of mag komen.",
        tasks: [
          "Sleuven met de hand graven en op diepte afwerken",
          "Kabels en leidingen met de schop vrijgraven",
          "De machinist aanwijzingen geven bij het graven",
          "Helpen bij riool, putten en huisaansluitingen",
          "Mantelbuizen en kabels in de sleuf leggen",
          "De sleuf in lagen aanvullen en verdichten",
        ],
        placesTitle: "Waar je werkt",
        places: [
          "Straten die een nieuw riool krijgen",
          "Stoepen waar kabels of glasvezel komen",
          "Terreinen die bouwrijp worden gemaakt",
        ],
      },
      requirements: {
        title: "Wat je meebrengt",
        accent: "voor werk in de sleuf",
        items: [
          "Je werkt het hele jaar buiten en graaft, tilt en bukt veel",
          "Je begrijpt een veiligheidsuitleg (toolbox) in het Nederlands of het Engels",
          "Twijfel je over een kabel of leiding, dan stop je met graven",
          "Veel bedrijven vragen rijbewijs B",
        ],
        minAgeNote: "Voor werk in een sleuf op een bouwplaats is de minimumleeftijd 18 jaar.",
      },
      wage: {
        title: "Eerlijk over je loon",
        accent: "met en zonder ervaring",
        intro:
          "Heb je nog niet in de bouw gewerkt, dan begin je meestal op het startloon van een hulpkracht. Pas met ervaring wordt je uurloon hoger.",
        sourceLabel: "starttabel en garantielonen van groep A tot en met C, cao Bouw en Infra, per 1 juli 2026",
        extra: "Nachtwerk en weekendwerk leveren vaak een toeslag op.",
      },
      schedule: {
        title: "Om 07.00 uur op het werk,",
        accent: "ook in de winter",
        items: [
          {
            title: "Dagwerk, soms nacht of weekend",
            body: "De ploeg start meestal om 07.00 uur. Bij werk aan wegen, riool of kabels komt nacht- en weekendwerk voor.",
            icon: "early",
          },
          {
            title: "Stil bij vorst en storm",
            body: "Bevroren grond, storm of een sleuf vol water leggen het werk stil.",
            icon: "weather",
          },
          {
            title: "Bouwvak in de zomer",
            body: "In de bouwvak nemen veel ploegen drie weken vrij.",
            icon: "season",
          },
        ],
      },
      certificates: {
        title: "Certificaten en instructies",
        accent: "voor veilig graven",
        items: [
          {
            name: "VCA Basis",
            need: "always",
            body: "Dit veiligheidsdiploma is in de praktijk bij vrijwel elke aannemer nodig.",
          },
          {
            name: "Beschermingsmiddelen",
            need: "always",
            body: "Werkschoenen S3, helm, signaalkleding en gehoorbescherming krijg je kosteloos.",
          },
          {
            name: "Instructie zorgvuldig graven",
            need: "often",
            body: "Je leert hoe je schade aan kabels en leidingen voorkomt, als toolbox of cursus.",
          },
        ],
      },
      why: {
        title: "Duidelijke afspraken voordat",
        accent: "je de sleuf in gaat",
        items: [
          {
            title: "Je uurloon staat erbij",
            body: "In de vacature staat je bruto uurloon. Je verdient minstens wat vaste collega's voor dat werk krijgen.",
            icon: "wage",
          },
          {
            title: "Je kent de werkplek vooraf",
            body: "Vooraf hoor je de straat, de starttijd en bij wie je je meldt.",
            icon: "route",
          },
          {
            title: "Vragen over uren of loon",
            body: "Bel of app ons team, ook tijdens een project.",
            icon: "message",
          },
        ],
      },
      career: {
        title: "Van de schop naar",
        accent: "een eigen vak",
        steps: ["Grondwerker", "Vakman gww", "Stratenmaker, rioolwerker, kabelwerker of machinist", "Ploegleider"],
        note: "Voor vakman gww combineer je een opleiding met je werk.",
      },
      vacancies: {
        title: "Vacatures voor grondwerkers",
        accent: "in Den Haag en omgeving",
        emptyTitle: "Nu geen grondwerk in de vacatures",
        emptyBody: "Inschrijven kan wel. Start er een project met grondwerk, dan bellen wij je.",
      },
      faq: {
        title: "Vragen over graven,",
        accent: "loon en ervaring",
        items: [
          {
            q: "Waarom graaf ik met de schop naast een graafmachine?",
            a: "Bij kabels en leidingen is de machine te grof. Je graaft eerst met de hand een proefsleuf om te zien wat er ligt.",
            specific: true,
          },
          {
            q: "Moet ik zelf een graafmelding doen?",
            a: "Nee, dat doet het bedrijf. Jij werkt met de tekening die op het werk ligt.",
            specific: true,
          },
          {
            q: "Is het loon van een grondwerker hoger dan dat van een hulpkracht?",
            a: "Niet als de bouw nieuw voor je is, want het startloon is gelijk. Later telt je vakkennis mee en loopt je uurloon op.",
            specific: true,
          },
          {
            q: "Kan ik beginnen als ik nog niet in een sleuf heb gewerkt?",
            a: "Dat verschilt per vacature. Daarin staat of het bedrijf ervaring vraagt.",
            specific: true,
          },
          {
            // TODO claim certificateSupport: hulp bij VCA en de instructie zorgvuldig graven, en wie de cursus betaalt
            q: "Helpen jullie mij aan VCA?",
            a: "Ja, mis je VCA of de instructie zorgvuldig graven, dan helpen wij je die te halen. Wij spreken vooraf af wie de cursus betaalt.",
            specific: true,
            claim: "certificateSupport",
          },
          {
            q: "Gaat het werk door als het vriest?",
            a: "Nee, bij bevroren grond ligt het graven stil. Vraag ons vooraf wat dat voor je loon betekent.",
            specific: true,
          },
          {
            // TODO claim transport: vervoer naar wisselende werkplekken
            q: "Hoe kom ik zonder auto op het werk?",
            a: "Wij regelen vervoer als je de werkplek met bus of tram niet op tijd haalt. In de vacature staat hoe je er komt.",
            specific: true,
            claim: "transport",
          },
          {
            q: "Zijn er kosten als ik via Groos solliciteer?",
            a: "Nee, voor solliciteren en inschrijven vragen wij geen geld. Een cv hoeft er niet bij.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Zoek je zelf grondwerkers voor een project? Lees dan de pagina voor werkgevers.",
        linkLabel: "Bekijk de pagina voor werkgevers",
      },
      cta: {
        title: "Klaar om de schop",
        accent: "in de grond te zetten?",
        body: "Kies een vacature of schrijf je in, een cv hoeft niet. Daarna belt ons team om te horen wat je zoekt.",
      },
    },
    employer: {
      meta: {
        title: "Grondwerkers inhuren in Den Haag",
        description:
          "Zoekt u grondwerkers voor riolering, kabels en leidingen of bouwrijp maken in Den Haag? Groos bespreekt vooraf instructies en ervaring. Vraag personeel aan.",
        keywords: [
          "grondwerker inhuren",
          "grondwerkers gezocht",
          "gww personeel",
          "uitzendbureau grondwerk den haag",
          "grondwerkers voor riool en kabelwerk",
        ],
        serviceType: "Uitzenden van grondwerkers",
      },
      hero: {
        title: "Grondwerkers voor riool, kabels en leidingen in Den Haag",
        lead: "U zoekt grondwerkers die bij kabels en leidingen met de hand graven. Wij bespreken vooraf welke instructies en certificaten uw werk vraagt.",
      },
      supply: {
        title: "Wat onze grondwerkers",
        accent: "in en rond uw sleuf doen",
        intro: "Zij doen het handwerk waar uw machine niet kan of mag komen.",
        tasks: [
          "Sleuven en gaten met de hand graven en op diepte afwerken",
          "Kabels en leidingen voorsteken en vrijgraven in proefsleuven",
          "Uw machinist bijstaan met aanwijzen en seinen",
          "Helpen bij rioolwerk, kolken, putten en huisaansluitingen",
          "Mantelbuizen, kabels en glasvezel leggen en afdekken",
          "Sleuven in lagen aanvullen en verdichten",
        ],
        clientsTitle: "Voor deze soorten bedrijven",
        clients: [
          "Gww-aannemers die riolering vervangen",
          "Kabel- en leidingaannemers",
          "Aannemers van warmtenetten en glasvezel",
          "Stratenmakers en grondverzetbedrijven",
        ],
      },
      why: {
        title: "Met de hand graven",
        accent: "waar kabels en leidingen liggen",
        items: [
          {
            title: "Instructies per kandidaat besproken",
            body: "Bij elke kandidaat vragen wij naar VCA, de instructie zorgvuldig graven en ervaring met riool of kabels.",
            icon: "shield",
          },
          {
            title: "Uw tekening en uw ploegleider",
            body: "Onze grondwerkers werken met uw gebiedsinformatie en volgen uw ploegleider. Bij twijfel over een kabel stoppen zij met graven.",
            icon: "safety",
          },
          {
            title: "Bellen over planning en bezetting",
            body: "Schuift de start op of verandert de bezetting, dan belt u ons team.",
            icon: "phone",
          },
          {
            title: "Meer mensen in een drukke fase",
            body: "Vraagt het sleufwerk een tijd meer mensen, dan overleggen wij dat vooraf met u.",
            icon: "calendar",
          },
        ],
      },
      certificates: {
        title: "Instructies en certificaten",
        accent: "per kandidaat besproken",
        items: [
          {
            name: "VCA Basis",
            need: "always",
            body: "Bijna elke opdrachtgever in de infra vraagt dit diploma.",
          },
          {
            name: "Persoonlijke beschermingsmiddelen",
            need: "always",
            body: "De medewerker betaalt niets voor schoenen S3, helm, signaalkleding en gehoorbescherming.",
          },
          {
            name: "Instructie zorgvuldig graven (CROW 500)",
            need: "often",
            body: "Dit is geen wettelijk persoonscertificaat, maar opdrachtgevers vragen de instructie vaak als toolbox of cursus.",
          },
          {
            name: "GPI",
            need: "often",
            body: "Deze online poortinstructie is 12 maanden geldig. Veel grote aannemers vragen erom.",
          },
          {
            name: "BEI of VIAG",
            need: "sometimes",
            body: "Deze instructie is nodig bij werk aan of bij stroom- en gasnetten.",
          },
        ],
      },
      planning: {
        title: "Planning rond project,",
        accent: "vorst en verschoven uren",
        items: [
          {
            title: "Start om 07.00 uur",
            body: "De werkdag begint doorgaans om 07.00 uur, van maandag tot en met vrijdag.",
            icon: "early",
          },
          {
            title: "Nacht en weekend bij infra",
            body: "Staat er nacht- of weekendwerk in uw bestek, geef dat dan door bij de aanvraag.",
            icon: "evening",
          },
          {
            title: "Vorst, bouwvak en projectduur",
            body: "Het werk loopt het hele jaar door, met een dip bij vorst. De bouwvak plannen wij vooraf met u.",
            icon: "season",
          },
        ],
      },
      legal: {
        title: "Loon, graafmelding",
        accent: "en een veilige sleuf",
        items: [
          {
            text: "Voor de grondwerker geldt gelijkwaardige beloning, dus loon en toeslagen zijn samen niet lager dan bij uw eigen mensen in dezelfde functie.",
          },
          {
            text: "De graafmelding doet de grondroerder, dus u of uw hoofdaannemer. Die zorgt ook dat de gebiedsinformatie op het werk ligt.",
          },
          {
            text: "De Arbowet legt de veilige werkplek en de instructie bij u als inlener. Een sleuf moet daarom gestut zijn of onder talud staan.",
          },
        ],
        wttaLinkLabel: "Lees wat de Wtta verandert",
      },
      faq: {
        title: "Vragen van aannemers",
        accent: "over grondwerkers inlenen",
        items: [
          {
            q: "Wie doet de graafmelding als ik grondwerkers inleen?",
            a: "Dat blijft de grondroerder doen, dus u of uw hoofdaannemer. Onze grondwerkers werken met de tekening die op het werk ligt.",
            specific: true,
          },
          {
            q: "Hebben uw grondwerkers de instructie zorgvuldig graven gevolgd?",
            a: "Niet iedere kandidaat heeft die instructie gehad, en dat hoort u vooraf van ons. Heeft u een bewijs nodig, zet dat dan in uw aanvraag.",
            specific: true,
          },
          {
            q: "Mogen uw grondwerkers bij gas- en stroomnetten werken?",
            a: "Daar is vaak een BEI- of VIAG-instructie voor nodig. Zonder aanwijzing werkt de medewerker alleen onder toezicht.",
            specific: true,
          },
          {
            q: "Bedienen uw grondwerkers ook een minigraver?",
            a: "Nee, dat is het werk van een machinist, die u apart aanvraagt. Verdichten met een trilplaat hoort wel bij grondwerk.",
            specific: true,
          },
          {
            // TODO claim replacement: vervanging bij uitval, met termijn
            q: "Wat doet u als een grondwerker uitvalt?",
            a: "Dan zoeken wij een vervanger met dezelfde instructies. Wij laten u weten wanneer uw ploeg weer compleet is.",
            specific: false,
            claim: "replacement",
          },
          {
            q: "Welk uurtarief rekent u voor een grondwerker?",
            a: "Ervaring, werktijden en projectduur bepalen het tarief. Het uurtarief staat in het voorstel dat u na uw aanvraag krijgt.",
            specific: false,
          },
          {
            q: "Welk loon krijgt een grondwerker op mijn project?",
            a: "Het uurloon ligt niet onder dat van uw eigen grondwerkers met dezelfde taken. Iemand met jaren in de sleuf verdient meer dan een nieuwkomer.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Zoekt u zelf werk als grondwerker? Lees dan de pagina voor werkzoekenden.",
        linkLabel: "Bekijk de pagina voor werkzoekenden",
      },
      cta: {
        title: "Grondwerkers nodig voordat",
        accent: "de eerste sleuf opengaat?",
        body: "Geef door hoeveel mensen u in de sleuf nodig heeft en wanneer het werk start. Daarna nemen wij contact op over de instructies en de begintijd.",
      },
    },
  },
  en: {
    jobseeker: {
      meta: {
        title: "Work as a groundworker in The Hague",
        description:
          "Do you want to work as a groundworker in The Hague? Read what you do in the trench, what you earn with and without experience and which instructions you need.",
        keywords: [
          "groundworker jobs the hague",
          "groundworker jobs netherlands",
          "groundworker hourly pay",
          "groundworker without experience",
          "civil engineering jobs the hague",
          "groundworker employment agency",
        ],
      },
      hero: {
        title: "Work as a groundworker in The Hague",
        lead: "As a groundworker, you dig trenches, expose cables and pipes with a shovel and backfill the trench afterwards. The crew is small and works outside.",
        facts: [{ label: "Start time", value: "Usually 07:00" }],
      },
      work: {
        title: "What you do in",
        accent: "and around the trench",
        intro: "You dig by hand where the excavator cannot or may not go.",
        tasks: [
          "Digging trenches by hand and trimming them to depth",
          "Exposing cables and pipes with a shovel",
          "Guiding the excavator operator during digging",
          "Helping with sewers, manholes and house connections",
          "Laying ducts and cables in the trench",
          "Backfilling and compacting the trench in layers",
        ],
        placesTitle: "Where you work",
        places: [
          "Streets getting a new sewer",
          "Pavements where cables or fibre go in",
          "Sites being prepared for building",
        ],
      },
      requirements: {
        title: "What you bring",
        accent: "to work in the trench",
        items: [
          "You work outside all year and dig, lift and bend a lot",
          "You understand a toolbox talk in Dutch or English",
          "You stop digging when unsure about a cable or pipe",
          "A category B driving licence is often required",
        ],
        minAgeNote: "For work in a trench on a construction site, the minimum age is 18.",
      },
      wage: {
        title: "Honest about your pay",
        accent: "with and without experience",
        intro:
          "As a newcomer to construction, you usually start on a general labourer's starting wage. Your hourly wage only rises with experience.",
        sourceLabel: "starting table and wages for job groups A to C, Bouw en Infra collective labour agreement (cao), 1 July 2026",
        extra: "Night and weekend work often brings extra pay.",
      },
      schedule: {
        title: "On site at 07:00,",
        accent: "in winter too",
        items: [
          {
            title: "Mostly day work",
            body: "The crew usually starts at 07:00. Night and weekend work comes up on roads, sewers and cables.",
            icon: "early",
          },
          {
            title: "Frost and storms stop work",
            body: "Frozen ground, a storm or a trench full of water stops the work.",
            icon: "weather",
          },
          {
            title: "Summer construction break",
            body: "During the construction break (bouwvak), many crews take three weeks off.",
            icon: "season",
          },
        ],
      },
      certificates: {
        title: "Certificates and instructions",
        accent: "for safe digging",
        items: [
          {
            name: "VCA Basis",
            need: "always",
            body: "In practice, nearly every contractor requires this Dutch safety certificate.",
          },
          {
            name: "Protective equipment",
            need: "always",
            body: "You get S3 safety boots, a helmet, hearing protection and high visibility clothing free of charge.",
          },
          {
            name: "Careful digging instruction",
            need: "often",
            body: "A toolbox talk or course teaches you to prevent damage to cables and pipes.",
          },
        ],
      },
      why: {
        title: "Clear agreements before",
        accent: "you step into the trench",
        items: [
          {
            title: "The wage is in the advert",
            body: "The advert shows your gross hourly wage. It is at least what permanent colleagues get for that work.",
            icon: "wage",
          },
          {
            title: "You know the workplace beforehand",
            body: "Beforehand, you hear the street, your start time and your contact on site.",
            icon: "route",
          },
          {
            title: "Questions about hours or pay",
            body: "Phone or message our team, also during a project.",
            icon: "message",
          },
        ],
      },
      career: {
        title: "From the shovel to",
        accent: "a trade of your own",
        steps: [
          "Groundworker",
          "Skilled civil engineering operative",
          "Street paver, pipe layer, cable layer or excavator operator",
          "Team leader",
        ],
        note: "You become a skilled operative by combining a course with work.",
      },
      vacancies: {
        title: "Groundworker jobs",
        accent: "in and around The Hague",
        emptyTitle: "No groundwork jobs right now",
        emptyBody: "You can register anyway. When a groundwork project starts, we call you.",
      },
      faq: {
        title: "Questions about digging,",
        accent: "pay and experience",
        items: [
          {
            q: "Why do I dig with a shovel beside an excavator?",
            a: "Near cables and pipes, the machine is too rough. You first dig a trial hole by hand to see what is there.",
            specific: true,
          },
          {
            q: "Do I submit the excavation notification myself?",
            a: "No, the company does that. You work from the drawing kept on site.",
            specific: true,
          },
          {
            q: "Is a groundworker's wage higher than a general labourer's?",
            a: "Not if construction is new to you, because the starting wage is the same. Later your trade knowledge counts and your hourly wage goes up.",
            specific: true,
          },
          {
            q: "Can I start if I have never worked in a trench?",
            a: "That differs per job. Each advert states whether experience is required.",
            specific: true,
          },
          {
            q: "Do you help me get VCA?",
            a: "Yes, if you do not have VCA or the careful digging instruction, we help you get them. We agree beforehand who pays for the course.",
            specific: true,
            claim: "certificateSupport",
          },
          {
            q: "Does the work go on when it freezes?",
            a: "No, digging stops when the ground is frozen. Ask us beforehand what that means for your pay.",
            specific: true,
          },
          {
            q: "How do I get to work without a car?",
            a: "We arrange transport if you cannot reach the workplace on time by bus or tram. The job advert says how you get there.",
            specific: true,
            claim: "transport",
          },
          {
            q: "Are there costs when I apply through Groos?",
            a: "No, we charge nothing for applying or registering. A CV is not needed either.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Do you need groundworkers for a project yourself? Then read the page for employers.",
        linkLabel: "View the page for employers",
      },
      cta: {
        title: "Ready to put a shovel",
        accent: "in the ground?",
        body: "Pick a job or register, no CV needed. Our team then phones you about the work you want.",
      },
    },
    employer: {
      meta: {
        title: "Hire groundworkers in The Hague",
        description:
          "Do you need groundworkers for sewers, cables and pipes or site preparation in The Hague? Groos discusses instructions and experience in advance. Request staff.",
        keywords: [
          "hire groundworkers the hague",
          "groundworkers wanted",
          "civil engineering staff",
          "groundwork employment agency the hague",
          "groundworkers for sewer and cable work",
        ],
        serviceType: "Temporary staffing of groundworkers",
      },
      hero: {
        title: "Groundworkers for sewers, cables and pipes in The Hague",
        lead: "You need groundworkers who dig by hand near cables and pipes. Beforehand, we go through the instructions and certificates your work requires.",
      },
      supply: {
        title: "What our groundworkers",
        accent: "do in and around your trench",
        intro: "They do the hand digging where your machine cannot or may not go.",
        tasks: [
          "Digging trenches and holes by hand and trimming them to depth",
          "Locating and exposing cables and pipes in trial holes",
          "Assisting your excavator operator by guiding and signalling",
          "Helping with sewer work, gullies, manholes and house connections",
          "Laying and covering ducts, cables and fibre",
          "Backfilling trenches in layers and compacting them",
        ],
        clientsTitle: "For these types of companies",
        clients: [
          "Civil engineering contractors replacing sewers",
          "Cable and pipe contractors",
          "Contractors for district heating and fibre",
          "Paving and earthmoving companies",
        ],
      },
      why: {
        title: "Hand digging where",
        accent: "cables and pipes lie",
        items: [
          {
            title: "Instructions discussed per candidate",
            body: "With every candidate, we ask about VCA, the careful digging instruction and experience with sewers or cables.",
            icon: "shield",
          },
          {
            title: "Your drawing and your team leader",
            body: "Our groundworkers work from your utility information and follow your team leader. If unsure about a cable, they stop digging.",
            icon: "safety",
          },
          {
            title: "Call us about planning and staffing",
            body: "If the start moves or the staffing changes, you call our team.",
            icon: "phone",
          },
          {
            title: "More people in a busy phase",
            body: "If the trench work needs more people for a while, we agree that beforehand.",
            icon: "calendar",
          },
        ],
      },
      certificates: {
        title: "Instructions and certificates",
        accent: "discussed for each candidate",
        items: [
          {
            name: "VCA Basis",
            need: "always",
            body: "Almost every infrastructure client asks for this safety certificate.",
          },
          {
            name: "Personal protective equipment",
            need: "always",
            body: "The worker pays nothing for S3 safety boots, helmet, hearing protection and high visibility clothing.",
          },
          {
            name: "Careful digging instruction (CROW 500)",
            need: "often",
            body: "This is not a statutory personal certificate, but clients often ask for it as a toolbox talk or course.",
          },
          {
            name: "GPI",
            need: "often",
            body: "This online site induction is valid for 12 months. Many large contractors ask for it.",
          },
          {
            name: "BEI or VIAG",
            need: "sometimes",
            body: "This instruction is needed for work on or near electricity and gas networks.",
          },
        ],
      },
      planning: {
        title: "Planning around project,",
        accent: "frost and shifted hours",
        items: [
          {
            title: "Start at 07:00",
            body: "The working day generally starts at 07:00, Monday to Friday.",
            icon: "early",
          },
          {
            title: "Nights and weekends in infrastructure",
            body: "If your contract specification includes night or weekend work, tell us in your request.",
            icon: "evening",
          },
          {
            title: "Frost, summer break and project length",
            body: "The work continues all year, with a dip during frost. We plan the summer construction break with you beforehand.",
            icon: "season",
          },
        ],
      },
      legal: {
        title: "Pay, excavation notification",
        accent: "and a safe trench",
        items: [
          {
            text: "Equivalent pay applies to the groundworker, so wages and allowances are at least those of your own people in the same role.",
          },
          {
            text: "The excavating party, so you or your main contractor, submits the excavation notification (KLIC) and keeps the utility information on site.",
          },
          {
            text: "The Arbowet (Working Conditions Act) makes a safe workplace and instruction your responsibility. A trench must therefore be shored or battered back.",
          },
        ],
        wttaLinkLabel: "Read what the Wtta changes",
      },
      faq: {
        title: "Questions from contractors",
        accent: "about hiring groundworkers",
        items: [
          {
            q: "Who submits the excavation notification when I hire groundworkers?",
            a: "The excavating party keeps doing that, so you or your main contractor. Our groundworkers work from the drawing kept on site.",
            specific: true,
          },
          {
            q: "Have your groundworkers had the careful digging instruction?",
            a: "Not every candidate has had it, and we tell you so beforehand. If you need proof, put that in your request.",
            specific: true,
          },
          {
            q: "May your groundworkers work near gas and electricity networks?",
            a: "That often requires a BEI or VIAG instruction. Without a formal designation, the worker only works under supervision.",
            specific: true,
          },
          {
            q: "Do your groundworkers also operate a mini excavator?",
            a: "No, that is the work of an excavator operator, whom you request separately. Compacting with a plate compactor is part of groundwork.",
            specific: true,
          },
          {
            q: "What do you do if a groundworker drops out?",
            a: "We then look for a replacement with the same instructions. We let you know when your crew is complete again.",
            specific: false,
            claim: "replacement",
          },
          {
            q: "What hourly rate do you charge for a groundworker?",
            a: "Experience, working hours and project length set the rate. The hourly rate is in the proposal you get after your request.",
            specific: false,
          },
          {
            q: "What wage does a groundworker get on my project?",
            a: "The hourly wage is not below that of your own groundworkers with the same tasks. Someone with years in the trench earns more than a newcomer.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Do you want to do groundwork yourself? Then go to our page for job seekers.",
        linkLabel: "View the page for job seekers",
      },
      cta: {
        title: "Need groundworkers before",
        accent: "the first trench is opened?",
        body: "Let us know how many people you need in the trench and from when. We then get in touch about instructions and start time.",
      },
    },
  },
} satisfies BeroepContent;
