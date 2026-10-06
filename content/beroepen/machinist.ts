import type { BeroepContent } from "@/content/beroepen/types";

export const machinist = {
  id: "machinist",
  wage: {
    starter: { min: 20.02, max: 22.68 },
    experienced: { min: 22.68, max: 23.78 },
    tableDate: "2026-01-01",
    checkedAt: "2026-10-05",
    reviewBy: "2027-01-01",
    sourceUrl: "https://media.umbraco.io/bouwend-nederland/z0niekfd/loontabellen-bouwplaatswerknemer-cao-2025-2027-mei-2026.pdf",
  },
  minAge18: "construction_demolition",
  nl: {
    jobseeker: {
      meta: {
        title: "Werken als machinist grondverzet in Den Haag",
        description:
          "Werken als machinist grondverzet in Den Haag? Lees wat je verdient op graafmachine, minigraver of shovel en welke papieren de wet en bedrijven vragen.",
        keywords: [
          "machinist grondverzet vacatures",
          "kraanmachinist vacature",
          "shovelmachinist vacature",
          "minigraver machinist gezocht",
          "machinist grondverzet salaris",
          "kraanmachinist vacature den haag",
        ],
      },
      hero: {
        title: "Werken als machinist grondverzet in Den Haag",
        lead: "Als machinist grondverzet bedien je zelfstandig een graafmachine, minigraver of shovel. Het is een vak, dus je hebt ervaring of een diploma nodig.",
        facts: [
          { label: "Nodig", value: "Ervaring of diploma" },
          { label: "Certificaat", value: "VCA Basis" },
        ],
      },
      work: {
        title: "Graven, laden en afwerken",
        accent: "precies op hoogte",
        tasks: [
          "Bouwputten ontgraven met een rupskraan",
          "Rioolsleuven graven met een mobiele graafmachine",
          "Huisaansluitingen graven met een minigraver",
          "Vrachtwagens laden en egaliseren met een shovel",
          "Taluds afwerken met GPS en 3D-besturing",
          "Aanbouwdelen wisselen en slopen met sorteergrijper of hamer",
          "Je machine dagelijks nalopen en smeren",
        ],
        placesTitle: "Waar je werkt",
        places: ["Riolering, kabels en leidingen in de stad", "Bouwrijp maken en wegenbouw", "Sloopprojecten en depots"],
      },
      requirements: {
        title: "Wat je meebrengt",
        accent: "naar de cabine",
        items: [
          "Je hebt ervaring op de machine of een machinistendiploma",
          "Je hebt VCA Basis en rijbewijs B, en voor de openbare weg rijbewijs T",
          "Je leest een tekening en graaft zorgvuldig rond leidingen",
          "Je spreekt Nederlands of de taal van de ploeg",
        ],
        minAgeNote: "Omdat je met een machine op een bouwplaats werkt, moet je minimaal 18 jaar zijn.",
      },
      wage: {
        title: "Je uurloon hangt af",
        accent: "van machine en diploma",
        intro: "Een erkend machinistendiploma telt zwaarder mee dan je jaren ervaring.",
        sourceLabel: "garantielonen van de cao Bouw en Infra per 1 januari 2026",
        extra: "Voor overuren, nachtwerk en weekendwerk gelden vaak toeslagen.",
        rangeLabel: "Bruto uurloon op eenvoudig materieel of met weinig ervaring, voor 21 jaar en ouder",
        experiencedLabel: "Zelfstandig op de machine, met of zonder diploma",
      },
      schedule: {
        title: "Wanneer je werkt",
        accent: "en wanneer het werk stilligt",
        items: [
          {
            title: "Vroeg in de cabine",
            body: "De meeste ploegen beginnen rond 07.00 uur.",
            icon: "early",
          },
          {
            title: "Vorst en seizoen",
            body: "Bij strenge vorst ligt grondwerk soms stil, en van voorjaar tot najaar is het druk.",
            icon: "weather",
          },
          {
            title: "Nacht en weekend",
            body: "Werk aan wegen, spoor en riolering gebeurt soms in de nacht of het weekend.",
            icon: "evening",
          },
        ],
      },
      certificates: {
        title: "Wat de wet vraagt",
        accent: "en wat bedrijven vragen",
        items: [
          {
            name: "Bewijs van deskundigheid",
            need: "always",
            body: "De wet noemt geen vast pasje, maar eist dat je de machine aantoonbaar veilig bedient. Meestal toon je dat aan met een diploma of certificaat.",
          },
          {
            name: "VCA Basis",
            need: "always",
            body: "De wet vraagt het niet, maar opdrachtgevers in bouw, sloop en infra eisen het.",
          },
          {
            name: "Registratie voor hijsen (TCVT RA)",
            need: "sometimes",
            body: "Hijs je op een bouwplaats lasten met een machine vanaf 10 tonmeter, dan is deze registratie verplicht. Leidingen leggen in je eigen sleuf valt daarbuiten.",
          },
        ],
      },
      why: {
        title: "Voor je instapt weet je",
        accent: "welke machine en welk loon",
        items: [
          {
            title: "Je uurloon staat erbij",
            body: "Bij elke vacature staat het bruto uurloon. Je krijgt hetzelfde als vaste machinisten met hetzelfde werk.",
            icon: "wage",
          },
          {
            title: "Je machines tellen mee",
            body: "Wij vragen naar de machines waarop je hebt gewerkt en naar je papieren.",
            icon: "tools",
          },
          {
            title: "Je weet waar je moet zijn",
            body: "Vooraf hoor je het adres en de begintijd. Met vragen bel of app je ons team.",
            icon: "route",
          },
        ],
      },
      career: {
        title: "Doorgroeien in het grondverzet",
        accent: "van minigraver tot uitvoerder",
        steps: [
          "Grondwerker",
          "Machinist op minigraver of mobiele graafmachine",
          "Allround machinist met GPS",
          "Ploegleider of uitvoerder",
        ],
      },
      vacancies: {
        title: "Werk op graafmachine en shovel",
        accent: "rond Den Haag",
        emptyTitle: "Nu geen vacatures voor machinisten",
        emptyBody: "Schrijf je toch in, dan bellen wij je als er werk voor je machine is.",
      },
      faq: {
        title: "Vragen over diploma's,",
        accent: "hijsen en je uurloon",
        items: [
          {
            q: "Kan ik machinist worden zonder ervaring of diploma?",
            a: "Nee, zonder ervaring of diploma begin je niet op een machine. Volg een opleiding, of begin als grondwerker en groei door.",
            specific: true,
          },
          {
            q: "Is er een verplicht certificaat voor de graafmachine?",
            a: "Nee, de wet noemt geen vast diploma of pasje. Bedrijven vragen er wel om als bewijs.",
            specific: true,
          },
          {
            q: "Hoe lang is mijn registratie voor hijsen geldig?",
            a: "De registratie is vijf jaar geldig. Voor verlenging volg je twee bijscholingsdagen en toon je praktijkervaring aan.",
            specific: true,
          },
          {
            // TODO claim certificateSupport: hulp bij het verlengen van de hijsregistratie, en wie de bijscholing betaalt
            q: "Helpen jullie bij het verlengen van mijn registratie?",
            a: "Ja, wij vertellen je waar en wanneer je de bijscholingsdagen kunt volgen.",
            specific: true,
            claim: "certificateSupport",
          },
          {
            q: "Waarom verschilt het uurloon per vacature?",
            a: "Je krijgt het loon van de vaste machinisten bij dat bedrijf. Dat loon verschilt per bedrijf, per machine en per diploma.",
            specific: true,
          },
          {
            q: "Kan ik werken met een buitenlands machinistenbewijs?",
            a: "Voor gewoon graafwerk bestaat geen vaste erkenning, dus het bedrijf beoordeelt je bewijs. Voor hijswerk heb je de Nederlandse registratie nodig.",
            specific: true,
          },
          {
            q: "Kost het geld om bij Groos te solliciteren?",
            a: "Nee, je betaalt niets voor een sollicitatie of inschrijving, en een cv hoeft niet.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Een machinist nodig voor een project? Kijk op de pagina voor werkgevers.",
        linkLabel: "Naar de pagina voor werkgevers",
      },
      cta: {
        title: "Zoek je werk in de cabine",
        accent: "van een graafmachine of shovel?",
        body: "Solliciteer of schrijf je in. Ons team belt je over je machines en je papieren.",
      },
    },
    employer: {
      meta: {
        title: "Machinisten grondverzet inhuren in Den Haag",
        description:
          "Zoekt u een machinist voor graafmachine, minigraver, shovel of sloopkraan in Den Haag? Groos bespreekt per machine de papieren en het hijswerk. Vraag aan.",
        keywords: [
          "machinist inhuren",
          "kraanmachinist inhuren",
          "machinist grondverzet inhuren",
          "shovelmachinist inhuren",
          "uitzendbureau grondverzet den haag",
        ],
        serviceType: "Uitzenden van machinisten grondverzet",
      },
      hero: {
        title: "Machinisten voor uw graafmachine, shovel of sloopkraan",
        lead: "U zoekt een machinist die zelfstandig graaft, laadt en afwerkt. Wij bespreken vooraf de machine, het hijswerk en de papieren die daarbij horen.",
      },
      supply: {
        title: "Wat onze machinisten",
        accent: "op uw machine doen",
        intro: "Onze machinisten werken zelfstandig op rupskraan, mobiele graafmachine, minigraver of shovel.",
        tasks: [
          "Bouwputten, cunetten en sleuven ontgraven",
          "Taluds en funderingen profileren en op hoogte afwerken",
          "Vrachtwagens en dumpers laden en het depot bijhouden",
          "Werken met GPS en 3D-besturing volgens uw tekening of model",
          "Graven rond kabels en leidingen volgens uw KLIC-gegevens",
          "Slopen met sorteergrijper, schaar of hamer",
          "De machine dagelijks controleren en gebreken melden",
        ],
        clientsTitle: "Voor deze soorten bedrijven",
        clients: [
          "Aannemers in grond-, weg- en waterbouw",
          "Sloopbedrijven",
          "Loonbedrijven en grondverzetbedrijven",
          "Kabel- en leidingaannemers",
        ],
      },
      why: {
        title: "Wij bespreken per machine",
        accent: "wat de kandidaat aantoonbaar kan",
        items: [
          {
            title: "Diploma's en ervaring vooraf bekend",
            body: "Wij vragen elke kandidaat naar papieren en machines. U hoort de uitkomst voordat de machinist begint.",
            icon: "document",
          },
          {
            title: "Hijswerk meldt u vooraf",
            body: "Moet de machinist hijsen, dan bespreken wij of de kandidaat de registratie daarvoor heeft.",
            icon: "check",
          },
          {
            title: "Instructie op uw machine",
            body: "U instrueert de machinist op uw machine en uw project, zoals de wet van de inlener vraagt.",
            icon: "safety",
          },
          {
            title: "Ons team aan de lijn",
            body: "Over de dagen, de uren en de machinist belt u met ons team.",
            icon: "phone",
          },
        ],
      },
      certificates: {
        title: "Diploma, registratie en rijbewijs",
        accent: "die wij per kandidaat bespreken",
        items: [
          {
            name: "Aantoonbare deskundigheid",
            need: "always",
            body: "De wet schrijft geen pasje voor, maar eist deskundigheid die aantoonbaar is. Meestal is dat een machinistendiploma of certificaat.",
          },
          {
            name: "VCA Basis",
            need: "always",
            body: "Dit is geen wettelijke eis, wel de standaard op bouwplaatsen en infraprojecten.",
          },
          {
            name: "Rijbewijs T",
            need: "often",
            body: "Dit is verplicht als de machinist met een mobiele graafmachine of shovel over de openbare weg rijdt.",
          },
          {
            name: "Registratie voor hijsen (TCVT RA)",
            need: "sometimes",
            body: "Dit is verplicht bij hijsen op een bouwplaats met een machine vanaf 10 tonmeter. Leidingen leggen in de eigen ontgraving is uitgezonderd.",
          },
        ],
      },
      planning: {
        title: "Plannen rond het seizoen,",
        accent: "afsluitingen en vorst",
        items: [
          {
            title: "Drukte van voorjaar tot najaar",
            body: "Werk aan wegen en riolering in de stad valt vaak in de zomer, als er minder verkeer is.",
            icon: "season",
          },
          {
            title: "Nacht en weekend bij afsluitingen",
            body: "Werkt u tijdens een afsluiting in de nacht of het weekend, meld dat dan bij uw aanvraag.",
            icon: "evening",
          },
          {
            title: "Vorst kan het werk stilleggen",
            body: "Ligt het werk stil door vorst, dan bespreken wij met u de geplande dagen.",
            icon: "weather",
          },
        ],
      },
      legal: {
        title: "Wie wat regelt",
        accent: "bij loon, instructie en graafmelding",
        items: [
          {
            text: "De machinist krijgt een gelijkwaardige beloning, minstens gelijk aan het pakket van uw eigen machinisten met hetzelfde werk.",
          },
          {
            text: "De Arbowet vraagt dat u de machinist instrueert over uw machine, uw project en de risico's daar.",
          },
          {
            text: "Bij mechanisch graven doet de grondroerder de graafmelding, dus u of uw hoofdaannemer. De werkinstructie krijgt de machinist van u.",
          },
        ],
        wttaLinkLabel: "Meer over de Wtta voor inleners",
      },
      faq: {
        title: "Vragen over machines,",
        accent: "hijswerk en uurtarief",
        items: [
          {
            q: "Op welke machines kunnen uw machinisten werken?",
            a: "Dat verschilt per kandidaat. Wie jaren op een rupskraan werkt, is niet vanzelf thuis op een minigraver of shovel.",
            specific: true,
          },
          {
            q: "Waarom wilt u vooraf weten of er gehesen wordt?",
            a: "Voor hijsen op een bouwplaats met een machine vanaf 10 tonmeter is een registratie in het register van kraanmachinisten verplicht. Niet elke machinist heeft die.",
            specific: true,
          },
          {
            q: "Werken uw machinisten met GPS en 3D-besturing?",
            a: "Dat vragen wij per kandidaat na. Vertel ons met welk systeem uw machine werkt.",
            specific: true,
          },
          {
            q: "Kan de machinist ook sloopwerk doen?",
            a: "Ja, als de kandidaat ervaring heeft met sorteergrijper, schaar of hamer. Ziet de machinist materiaal dat op asbest lijkt, dan stopt die en meldt het bij uw uitvoerder.",
            specific: true,
          },
          {
            // TODO claim replacement: vervanging bij uitval van een machinist, met termijn
            q: "Wat gebeurt er als de machinist uitvalt?",
            a: "Dan zoeken wij een vervanger met ervaring op dezelfde machine en houden wij u op de hoogte.",
            specific: false,
            claim: "replacement",
          },
          {
            q: "Wat bepaalt het uurtarief van een machinist?",
            a: "De machine, het hijswerk, de werktijden en de duur bepalen samen het tarief. Na uw aanvraag krijgt u een voorstel waarin het uurtarief staat.",
            specific: false,
          },
          {
            q: "Hoe wordt het loon van de machinist vastgesteld?",
            a: "De machinist krijgt minstens wat uw eigen machinisten voor hetzelfde werk krijgen. Een erkend machinistendiploma telt mee in de indeling.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Zelf werk zoeken op een graafmachine of shovel? Kijk op de pagina voor werkzoekenden.",
        linkLabel: "Naar de pagina voor werkzoekenden",
      },
      cta: {
        title: "Staat er een machine klaar",
        accent: "zonder machinist?",
        body: "Vertel ons welke machine het is, of er gehesen wordt en vanaf wanneer. Ons team belt u om de papieren en de planning door te spreken.",
      },
    },
  },
  en: {
    jobseeker: {
      meta: {
        title: "Work as an excavator operator in The Hague",
        description:
          "Work as an excavator operator in The Hague? Read what you earn on an excavator, mini excavator or wheel loader and which papers the law and companies ask for.",
        keywords: [
          "excavator operator jobs netherlands",
          "excavator operator jobs the hague",
          "plant operator jobs netherlands",
          "wheel loader operator jobs",
          "mini excavator operator jobs",
          "operator koparki holandia praca",
        ],
      },
      hero: {
        title: "Work as an excavator operator in The Hague",
        lead: "As an excavator operator, you run an excavator, mini excavator or wheel loader independently. This skilled trade requires experience or a diploma.",
        facts: [
          { label: "Required", value: "Experience or diploma" },
          { label: "Certificate", value: "VCA Basis" },
        ],
      },
      work: {
        title: "Digging, loading and finishing",
        accent: "exactly to level",
        tasks: [
          "Excavating building pits with a tracked excavator",
          "Sewer trenches with a wheeled excavator",
          "House connections with a mini excavator",
          "Loading lorries and levelling with a wheel loader",
          "Finishing slopes with GPS and 3D machine control",
          "Changing attachments and demolishing with a sorting grab or breaker",
          "Checking and greasing your machine daily",
        ],
        placesTitle: "Where you work",
        places: ["Sewers, cables and pipes in the city", "Site preparation and road building", "Demolition projects and depots"],
      },
      requirements: {
        title: "What you bring",
        accent: "into the cab",
        items: [
          "You have experience on the machine or an operator diploma",
          "You hold VCA Basis, a B licence and a T licence for public roads",
          "You read drawings and dig carefully around pipes",
          "You speak Dutch or the team's language",
        ],
        minAgeNote: "Because you work with a machine on a construction site, you must be at least 18.",
      },
      wage: {
        title: "Your hourly wage depends",
        accent: "on machine and diploma",
        intro: "A recognised operator diploma outweighs your years of experience.",
        sourceLabel: "job group wages, Bouw en Infra collective labour agreement (cao), 1 January 2026",
        extra: "Overtime, night work and weekend work often carry extra pay.",
        rangeLabel: "Gross hourly wage on simple machines or with little experience, aged 21 and over",
        experiencedLabel: "Working independently on the machine, with or without a diploma",
      },
      schedule: {
        title: "When you work",
        accent: "and when work stops",
        items: [
          {
            title: "Early in the cab",
            body: "Most teams start around 07:00.",
            icon: "early",
          },
          {
            title: "Frost and season",
            body: "Severe frost can stop groundworks, and spring to autumn is busy.",
            icon: "weather",
          },
          {
            title: "Nights and weekends",
            body: "Roads, railways and sewers are sometimes worked on at night or at weekends.",
            icon: "evening",
          },
        ],
      },
      certificates: {
        title: "What the law requires",
        accent: "and what companies ask for",
        items: [
          {
            name: "Proof of competence",
            need: "always",
            body: "The law sets no licence card, but you must be able to show safe operation. A diploma or certificate usually does that.",
          },
          {
            name: "VCA Basis",
            need: "always",
            body: "The law does not require it, but construction, demolition and civil engineering clients do.",
          },
          {
            name: "Registration for lifting (TCVT RA)",
            need: "sometimes",
            body: "Lifting loads on a construction site with a machine of 10 tonne-metres or more requires this registration. Laying pipes in your own trench is exempt.",
          },
        ],
      },
      why: {
        title: "Before you climb in, you know",
        accent: "the machine and the wage",
        items: [
          {
            title: "Your hourly wage is stated",
            body: "Every job advert states the gross hourly wage, the same as for permanent operators.",
            icon: "wage",
          },
          {
            title: "Your machines count",
            body: "We ask which machines you know and which papers you hold.",
            icon: "tools",
          },
          {
            title: "You know where to be",
            body: "You hear the address and start time beforehand. Call or message our team with questions.",
            icon: "route",
          },
        ],
      },
      career: {
        title: "Moving up in earthmoving",
        accent: "from mini excavator to site manager",
        steps: [
          "Groundworker",
          "Operator on a mini or wheeled excavator",
          "All-round operator with GPS",
          "Team leader or site manager",
        ],
      },
      vacancies: {
        title: "Work on excavators and wheel loaders",
        accent: "around The Hague",
        emptyTitle: "No operator jobs right now",
        emptyBody: "Register anyway, and we call you when work for your machine comes up.",
      },
      faq: {
        title: "Questions about diplomas,",
        accent: "lifting and your wage",
        items: [
          {
            q: "Can I start as an excavator operator without experience?",
            a: "No, not without experience or a diploma. Take a training course first, or start as a groundworker and move up.",
            specific: true,
          },
          {
            q: "Is there a mandatory certificate for excavators?",
            a: "No, the law names no fixed diploma or card. Companies do ask for one as proof.",
            specific: true,
          },
          {
            q: "How long is my registration for lifting valid?",
            a: "It is valid for five years. Renewal takes two refresher days and proof of practical experience.",
            specific: true,
          },
          {
            q: "Do you help me renew my registration?",
            a: "Yes, we tell you where and when you can take the refresher days.",
            specific: true,
            claim: "certificateSupport",
          },
          {
            q: "Why does the hourly wage differ per job?",
            a: "You get the wage of that company's permanent operators. That wage differs per company, per machine and per diploma.",
            specific: true,
          },
          {
            q: "Can I work with a foreign operator certificate?",
            a: "Ordinary excavation work has no fixed recognition procedure, so the company assesses your proof. Lifting work requires the Dutch registration.",
            specific: true,
          },
          {
            q: "Does applying through Groos cost money?",
            a: "No, you pay nothing to apply or register, and no CV is needed.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Need an operator for a project? See the page for employers.",
        linkLabel: "Go to the page for employers",
      },
      cta: {
        title: "Looking for work in the cab",
        accent: "of an excavator or wheel loader?",
        body: "Apply or register. Our team calls you about your machines and your papers.",
      },
    },
    employer: {
      meta: {
        title: "Hire excavator operators in The Hague",
        description:
          "Need an operator for an excavator, mini excavator, wheel loader or demolition machine in The Hague? Groos discusses papers and lifting work per machine.",
        keywords: [
          "hire excavator operator",
          "excavator operator hire the hague",
          "plant operator agency netherlands",
          "wheel loader operator hire",
          "earthmoving staff the hague",
        ],
        serviceType: "Temporary staffing of excavator operators",
      },
      hero: {
        title: "Operators for your excavator, wheel loader or demolition machine",
        lead: "You need an operator who digs, loads and finishes independently. We discuss the machine, the lifting work and the papers in advance.",
      },
      supply: {
        title: "What our operators",
        accent: "do on your machine",
        intro: "Our operators run tracked, wheeled and mini excavators and wheel loaders.",
        tasks: [
          "Excavating building pits, road beds and trenches",
          "Shaping slopes and foundations and finishing to level",
          "Loading lorries and dumpers and managing the stockpile",
          "GPS and 3D machine control from your drawing or model",
          "Digging around cables and pipes from your KLIC data",
          "Demolition with a sorting grab, shear or breaker",
          "Checking the machine daily and reporting defects",
        ],
        clientsTitle: "For these types of companies",
        clients: [
          "Groundworks and civil engineering contractors",
          "Demolition companies",
          "Earthmoving and agricultural contractors",
          "Cable and pipeline contractors",
        ],
      },
      why: {
        title: "We discuss machine by machine",
        accent: "what the candidate can demonstrate",
        items: [
          {
            title: "Diplomas and experience known beforehand",
            body: "We ask every candidate about papers and machines. You hear the outcome before the operator starts.",
            icon: "document",
          },
          {
            title: "You report lifting work upfront",
            body: "If the operator has to lift, we discuss whether the candidate holds the registration for it.",
            icon: "check",
          },
          {
            title: "Instruction on your machine",
            body: "You instruct the operator on your machine and project, as the law requires of the hirer.",
            icon: "safety",
          },
          {
            title: "Our team on the line",
            body: "You call our team about the days, the hours and the operator.",
            icon: "phone",
          },
        ],
      },
      certificates: {
        title: "Diploma, registration and licence",
        accent: "that we discuss per candidate",
        items: [
          {
            name: "Demonstrable competence",
            need: "always",
            body: "The law prescribes no licence card, but requires competence that can be demonstrated. That is usually an operator diploma or certificate.",
          },
          {
            name: "VCA Basis",
            need: "always",
            body: "The law does not require it, but it is the standard on construction and civil engineering sites.",
          },
          {
            name: "T driving licence",
            need: "often",
            body: "This is mandatory if the operator drives a wheeled excavator or wheel loader on public roads.",
          },
          {
            name: "Registration for lifting (TCVT RA)",
            need: "sometimes",
            body: "Lifting on a construction site with a machine of 10 tonne-metres or more requires it. Laying pipes in the operator's own excavation is exempt.",
          },
        ],
      },
      planning: {
        title: "Planning for the season,",
        accent: "road closures and frost",
        items: [
          {
            title: "Busy from spring to autumn",
            body: "City work on roads and sewers often falls in summer, when there is less traffic.",
            icon: "season",
          },
          {
            title: "Nights and weekends during closures",
            body: "Mention night or weekend work during a closure in your request.",
            icon: "evening",
          },
          {
            title: "Frost can stop the work",
            body: "If frost stops the work, we discuss the planned days with you.",
            icon: "weather",
          },
        ],
      },
      legal: {
        title: "Who arranges what",
        accent: "for pay, instruction and the KLIC request",
        items: [
          {
            text: "The operator receives equivalent pay, at least the package of your own operators for the same work.",
          },
          {
            text: "The Working Conditions Act (Arbowet) requires you to instruct the operator on your machine, project and risks.",
          },
          {
            text: "For mechanical digging, the excavating party submits the utility location request (KLIC), so you or your main contractor. You give the operator the work instructions.",
          },
        ],
        wttaLinkLabel: "More about the Wtta for hirers",
      },
      faq: {
        title: "Questions about machines,",
        accent: "lifting work and hourly rate",
        items: [
          {
            q: "Which machines can your operators work on?",
            a: "That differs per candidate. Years on a tracked excavator do not make someone at home on a mini excavator or wheel loader.",
            specific: true,
          },
          {
            q: "Why do you ask beforehand whether there is lifting?",
            a: "Lifting on a construction site with a machine of 10 tonne-metres or more requires registration in the Dutch crane operator register. Not every operator has it.",
            specific: true,
          },
          {
            q: "Do your operators work with GPS and 3D machine control?",
            a: "We ask each candidate about that. Tell us which system your machine uses.",
            specific: true,
          },
          {
            q: "Can the operator also do demolition work?",
            a: "Yes, if the candidate has experience with a sorting grab, shear or breaker. An operator who sees material that looks like asbestos stops and reports it to your site manager.",
            specific: true,
          },
          {
            q: "What happens if the operator drops out?",
            a: "We then look for a replacement with experience on the same machine and keep you informed.",
            specific: false,
            claim: "replacement",
          },
          {
            q: "What determines the hourly rate for an operator?",
            a: "The machine, lifting work, working hours and duration together set the rate. After your request, you receive a proposal stating the hourly rate.",
            specific: false,
          },
          {
            q: "How is the operator's pay set?",
            a: "The operator receives at least what your own operators receive for the same work. A recognised operator diploma counts in the grading.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Looking for work on an excavator yourself? See the page for job seekers.",
        linkLabel: "Go to the page for job seekers",
      },
      cta: {
        title: "Is a machine standing ready",
        accent: "without an operator?",
        body: "Tell us the machine, whether lifting is involved and the start date. Our team calls you to go through papers and planning.",
      },
    },
  },
} satisfies BeroepContent;
