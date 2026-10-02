import type { BeroepContent } from "@/content/beroepen/types";

export const logistiekMedewerker = {
  id: "logistiek-medewerker",
  wage: {
    starter: { min: 14.99, max: 16.5 },
    experienced: { min: 15.5, max: 18 },
    tableDate: "2026-07-01",
    checkedAt: "2026-10-02",
    reviewBy: "2027-01-01",
    sourceUrl: "https://www.awvn.nl/wml/nieuws/minimumloon-stijgt-per-juli-naar-1499-euro-per-uur/",
  },
  minAge18: "forklift",
  nl: {
    jobseeker: {
      meta: {
        title: "Werken als logistiek medewerker in Den Haag",
        description:
          "Wil je werken als logistiek medewerker of orderpicker in Den Haag? Lees wat je verdient en hoe laat je dienst begint. Solliciteren kan zonder cv.",
        keywords: [
          "logistiek medewerker vacature",
          "orderpicker vacature den haag",
          "magazijnmedewerker vacature den haag",
          "heftruckchauffeur vacatures den haag",
          "orderpicker vacatures",
          "reachtruck vacature",
        ],
      },
      hero: {
        title: "Werken als logistiek medewerker in Den Haag",
        lead: "Als logistiek medewerker verzamel je orders, pak je goederen in en laad je vrachtwagens. Je werkt in een magazijn of distributiecentrum, vaak in een vroege of late dienst.",
        facts: [
          { label: "Werktijden", value: "Vroege, late of nachtdienst" },
          { label: "Diploma", value: "Niet nodig" },
        ],
      },
      work: {
        title: "Als logistiek medewerker houd je",
        accent: "de goederen in beweging",
        intro: "Wat je precies doet, hangt af van het magazijn.",
        tasks: [
          "Orders verzamelen met een scanner",
          "Vrachtwagens laden en lossen",
          "Pakketten inpakken en labelen",
          "Rijden op een pallettruck of heftruck",
          "Karren met bloemen en planten klaarzetten",
        ],
        placesTitle: "Waar je werkt",
        places: [
          "Distributiecentra van supermarkten en webwinkels",
          "Groothandels in eten en drinken",
          "Bloemen- en plantenhandel",
        ],
      },
      requirements: {
        title: "Wat het werk",
        accent: "van je vraagt",
        items: [
          "Je staat en loopt de hele dienst",
          "Je tilt regelmatig dozen en kratten",
          "Je spreekt genoeg Nederlands of Engels voor veiligheidsinstructies",
        ],
        minAgeNote: "Rijd je op een heftruck of reachtruck, dan moet je daarvoor minimaal 18 jaar zijn.",
      },
      wage: {
        title: "Je bruto uurloon",
        accent: "in het magazijn",
        intro: "Je verdient minstens het wettelijk minimumloon, en op een heftruck of reachtruck meestal meer.",
        sourceLabel:
          "vacatures in Den Haag en het Westland in oktober 2026 en het wettelijk minimumloon per 1 juli 2026",
        extra: "Voor nachtwerk, heel vroege diensten en weekendwerk krijg je vaak een toeslag.",
      },
      schedule: {
        title: "Werken in ploegen",
        accent: "en in drukke weken",
        items: [
          {
            title: "Vroeg, laat of 's nachts",
            body: "Veel magazijnen werken in ploegen, en in de bloemenhandel begin je soms al om 05.00 uur.",
            icon: "clock",
          },
          {
            title: "Druk voor de feestdagen",
            body: "Rond Sinterklaas en Kerst is het druk, en bij bloemen rond Valentijnsdag en Moederdag.",
            icon: "season",
          },
          {
            title: "Werken in de kou",
            body: "In een koelcel is het de hele dienst koud, dus je werkt daar in warme kleding.",
            icon: "weather",
          },
        ],
      },
      certificates: {
        title: "Certificaten om",
        accent: "in de hal te rijden",
        items: [
          {
            name: "EPT-certificaat",
            need: "often",
            body: "Hiermee rijd je op een elektrische pallettruck (EPT). De training duurt meestal één dag.",
          },
          {
            name: "Heftruck- of reachtruckcertificaat",
            need: "often",
            body: "Dit heb je nodig om op een heftruck of reachtruck te rijden. Ook deze training duurt meestal één dag.",
          },
        ],
      },
      why: {
        title: "Weten wat je verdient",
        accent: "voor elke dienst",
        items: [
          {
            title: "Je uurloon staat vooraf vast",
            body: "Bij elke vacature staat het bruto uurloon, en je hoort vooraf of er toeslagen zijn.",
            icon: "wage",
          },
          {
            title: "Eén nummer voor je rooster",
            body: "Jimmy of Lorenzo is je vaste contactpersoon, ook als je andere diensten wilt.",
            icon: "phone",
          },
          {
            title: "Veilig rijden en tillen",
            body: "Werkschoenen, handschoenen en een hesje voor in de hal betaal je nooit zelf.",
            icon: "shield",
          },
        ],
      },
      career: {
        title: "Van orderpicker",
        accent: "naar teamleider",
        steps: [
          "Orderpicker",
          "EPT-chauffeur",
          "Heftruck- of reachtruckchauffeur",
          "Allround magazijnmedewerker",
          "Teamleider",
        ],
        note: "Elke stap vraagt meestal een certificaat of ervaring.",
      },
      vacancies: {
        title: "Werk in magazijnen",
        accent: "rond Den Haag",
        emptyTitle: "Nu geen magazijnwerk open",
        emptyBody:
          "In het najaar komen er vaak vacatures bij. Schrijf je in, dan bellen wij je als er magazijnwerk is.",
      },
      faq: {
        title: "Vragen over werken",
        accent: "in het magazijn",
        items: [
          {
            q: "Kan ik beginnen zonder heftruckcertificaat?",
            a: "Ja, voor orderpicken en inpakken is geen certificaat nodig. Alleen voor de heftruck of reachtruck heb je er een nodig.",
            specific: true,
          },
          {
            q: "Hoe vroeg begint mijn dienst?",
            a: "Dat hangt af van het bedrijf. In de bloemenhandel begin je soms al om 05.00 uur. De begintijd staat altijd in de vacature.",
            specific: true,
          },
          {
            q: "Werk ik in een ploegendienst?",
            a: "Vaak wel, want veel magazijnen hebben een vroege en een late dienst. Je spreekt vooraf af in welke diensten je kunt werken.",
            specific: true,
          },
          {
            q: "Hoe kom ik op een bedrijventerrein zonder auto?",
            a: "Dat verschilt per vacature, want niet elk magazijn ligt aan een busroute. Wij kijken samen met je of je op tijd kunt zijn.",
            specific: true,
          },
          {
            q: "Is het werk in een magazijn zwaar?",
            a: "Het werk is lichamelijk, want je staat en loopt de hele dienst. Wij vertellen je vooraf wat dat bedrijf van je vraagt.",
            specific: true,
          },
          {
            q: "Krijg ik hetzelfde loon als vaste collega's?",
            a: "Ja, volgens de wet krijg je hetzelfde loon als vaste collega's met hetzelfde werk. Dat geldt ook als je op een heftruck rijdt.",
            specific: false,
          },
          {
            q: "Regelen jullie vervoer naar het bedrijventerrein?",
            a: "Ja, voor sommige bedrijventerreinen rond Den Haag regelen wij vervoer. In de vacature staat of dat voor die plek geldt.",
            specific: true,
            claim: "transport",
          },
          {
            // TODO claim certificateSupport: vastleggen wie de training betaalt (CL-11); pas daarna eventueel "Je betaalt de training niet zelf." toevoegen.
            q: "Kunnen jullie mij helpen aan een heftruckcertificaat?",
            a: "Ja, als een bedrijf iemand voor de heftruck zoekt, helpen wij je het certificaat te halen. De training duurt meestal één dag. Je hoort vooraf waar en wanneer die is.",
            specific: true,
            claim: "certificateSupport",
          },
        ],
      },
      perspective: {
        text: "Personeel zoeken voor een logistiek bedrijf? Lees wat Groos voor opdrachtgevers doet.",
        linkLabel: "Naar de pagina voor werkgevers",
      },
      cta: {
        title: "Klaar voor werk",
        accent: "in het magazijn?",
        body: "Solliciteer of schrijf je in, en vertel of je al een certificaat hebt. Jimmy of Lorenzo belt je om kennis te maken.",
      },
    },
    employer: {
      meta: {
        title: "Logistiek medewerkers inhuren in Den Haag",
        description:
          "Zoekt u logistiek medewerkers voor uw magazijn in Den Haag? Groos levert orderpickers en heftruckchauffeurs voor een dag of langer. Vraag personeel aan.",
        keywords: [
          "logistiek medewerkers inhuren",
          "orderpickers inhuren den haag",
          "magazijnpersoneel inhuren den haag",
          "heftruckchauffeur inhuren",
          "uitzendbureau logistiek den haag",
        ],
        serviceType: "Uitzenden van logistiek medewerkers",
      },
      hero: {
        title: "Logistiek personeel voor uw magazijn of distributiecentrum",
        lead: "U zoekt orderpickers, magazijnmedewerkers of heftruckchauffeurs voor uw vaste ploeg of een drukke periode. Wij zoeken de mensen en bespreken vooraf de diensten, de certificaten en de startdatum.",
      },
      supply: {
        title: "Logistiek medewerkers die",
        accent: "uw orders verwerken",
        intro: "Wij leveren mensen voor het werk tussen de ontvangst en de verzending van goederen.",
        tasks: [
          "Orders verzamelen met scanner of pick-by-voice",
          "Goederen lossen, controleren en wegzetten",
          "Vrachtwagens laden volgens de laadlijst",
          "Rijden met EPT, heftruck of reachtruck",
          "Fust en karren klaarzetten in de bloemenhandel",
        ],
        clientsTitle: "Voor deze soorten bedrijven",
        clients: [
          "Logistieke dienstverleners",
          "Groothandels en foodservicebedrijven",
          "Distributiecentra van supermarkten en webwinkels",
          "Bloemen- en plantenexporteurs",
        ],
      },
      why: {
        title: "Magazijnpersoneel dat meedraait",
        accent: "in uw ploegen",
        items: [
          {
            title: "Diensten vooraf afgesproken",
            body: "Wij bespreken met u de begintijden, het aantal diensten per week en de nachtdiensten.",
            icon: "handshake",
          },
          {
            title: "Eén vaste contactpersoon",
            body: "U belt met Jimmy of Lorenzo over de planning, het rooster en wijzigingen.",
            icon: "phone",
          },
          {
            title: "Certificaten bij het voorstel",
            body: "In het voorstel ziet u welke certificaten de kandidaat heeft, zoals EPT of heftruck.",
            icon: "shield",
          },
          {
            title: "Plannen voor de piek",
            body: "Bespreek uw extra mensen voor het vierde kwartaal of Moederdag vroeg met ons, dan plannen wij mee.",
            icon: "calendar",
          },
        ],
      },
      certificates: {
        title: "Certificaten die wij",
        accent: "per kandidaat bespreken",
        intro: "Heeft de kandidaat een certificaat nog niet, dan bespreken wij met u hoe dat geregeld wordt.",
        items: [
          {
            name: "EPT-certificaat",
            need: "often",
            body: "Voor werken met een elektrische pallettruck. De training duurt meestal één dag.",
          },
          {
            name: "Heftruck- of reachtruckcertificaat",
            need: "often",
            body: "De wet vraagt deskundigheid, en in de praktijk vragen magazijnen om dit certificaat.",
          },
          {
            name: "VCA Basis",
            need: "sometimes",
            body: "Zelden nodig in distributiecentra, wel bij logistiek op industrieterreinen.",
          },
        ],
      },
      planning: {
        title: "Planning rond",
        accent: "pieken en ploegen",
        items: [
          {
            title: "Pieken in najaar en voorjaar",
            body: "Het vierde kwartaal is druk door Black Friday en Kerst. In de bloemenhandel komen Valentijnsdag en Moederdag erbij.",
            icon: "season",
          },
          {
            title: "Twee of drie ploegen",
            body: "Wij plannen mensen voor vroege, late en nachtdiensten en het weekend, in de bloemenhandel soms vanaf 05.00 uur.",
            icon: "clock",
          },
          {
            title: "Een week of een seizoen",
            body: "Medewerkers werken bij u een paar dagen, een piekperiode of langer, zoals vooraf afgesproken.",
            icon: "calendar",
          },
        ],
      },
      legal: {
        title: "Wat de wet vraagt",
        accent: "bij inlenen",
        items: [
          {
            text: "De medewerker krijgt een gelijkwaardige beloning, dus een pakket dat minstens gelijk is aan dat van uw vaste medewerkers in dezelfde functie.",
          },
          {
            text: "Volgens de Arbowet zorgt u als inlener voor instructie en een veilige werkplek, ook bij laaddocks en koelcellen.",
          },
          {
            text: "Als inlener kunt u aansprakelijk zijn voor loonheffingen die de uitlener niet afdraagt.",
          },
        ],
        wttaLinkLabel: "Wat de Wtta voor u betekent",
      },
      faq: {
        title: "Vragen over logistiek",
        accent: "personeel inhuren",
        items: [
          {
            q: "Kunnen uw mensen heftruck of reachtruck rijden?",
            a: "Dat verschilt per kandidaat. Wij vragen vooraf welke voertuigen u gebruikt en stellen kandidaten voor met het passende certificaat.",
            specific: true,
          },
          {
            q: "Kunt u extra mensen leveren in het vierde kwartaal?",
            a: "Ja, en hoe eerder u de piek met ons bespreekt, hoe beter wij kunnen plannen. Geef per week het aantal mensen en de diensten door.",
            specific: true,
          },
          {
            q: "Werken uw mensen in ploegendienst?",
            a: "Ja, wij zoeken mensen voor vroege, late en nachtdiensten. In het voorstel staat per kandidaat welke diensten die kan werken.",
            specific: true,
          },
          {
            q: "Welke beloning krijgt de medewerker?",
            a: "De medewerker krijgt een gelijkwaardige beloning. De cao of loonregeling die bij u geldt voor een vergelijkbare functie bepaalt het loon, inclusief toeslagen voor nacht en weekend.",
            specific: true,
          },
          {
            q: "Kunnen ze werken in een koelcel of vriescel?",
            a: "Ja, als de kandidaat dat vooraf weet en wil. U zorgt voor koudekleding, en wij noemen de temperatuur in het gesprek met de kandidaat.",
            specific: true,
          },
          {
            q: "Wat kost een logistiek medewerker per uur?",
            a: "Het tarief hangt af van de functie, de certificaten, de diensten en de duur. Na uw aanvraag sturen wij u een voorstel met een helder uurtarief.",
            specific: false,
          },
          {
            q: "Kunt u een heftruckcertificaat voor de kandidaat regelen?",
            a: "Ja, heeft een geschikte kandidaat het certificaat nog niet, dan kan Groos de training regelen. De training duurt meestal één dag, en wij spreken vooraf met u af wanneer.",
            specific: true,
            claim: "certificateSupport",
          },
        ],
      },
      perspective: {
        text: "Zelf werk zoeken als logistiek medewerker? Op de pagina voor werkzoekenden staat alles over het werk.",
        linkLabel: "Naar de pagina voor werkzoekenden",
      },
      cta: {
        title: "Meer mensen nodig",
        accent: "in de drukke weken?",
        body: "Vertel ons hoeveel mensen u zoekt, in welke diensten en vanaf wanneer. Wij nemen contact met u op om de planning door te nemen.",
      },
    },
  },
  en: {
    jobseeker: {
      meta: {
        title: "Work as a logistics worker in The Hague",
        description:
          "Do you want to work as a logistics worker or order picker in The Hague? Read what you earn and when your shift starts. You can apply without a CV.",
        keywords: [
          "logistics worker job",
          "order picker job the hague",
          "warehouse worker job the hague",
          "forklift driver jobs the hague",
          "warehouse job netherlands",
          "reach truck job",
        ],
      },
      hero: {
        title: "Work as a logistics worker in The Hague",
        lead: "As a logistics worker, you pick orders, pack goods and load lorries. You work in a warehouse or distribution centre, often on an early or late shift.",
        facts: [
          { label: "Working hours", value: "Early, late or night shift" },
          { label: "Diploma", value: "Not needed" },
        ],
      },
      work: {
        title: "As a logistics worker, you keep",
        accent: "the goods moving",
        intro: "Your exact tasks depend on the warehouse.",
        tasks: [
          "Picking orders with a scanner",
          "Loading and unloading lorries",
          "Packing and labelling parcels",
          "Driving a pallet truck or forklift",
          "Preparing trolleys of flowers and plants",
        ],
        placesTitle: "Where you work",
        places: [
          "Distribution centres of supermarkets and online shops",
          "Food and drink wholesalers",
          "Flower and plant trade",
        ],
      },
      requirements: {
        title: "What the work",
        accent: "asks of you",
        items: [
          "You stand and walk for the whole shift",
          "You regularly lift boxes and crates",
          "You speak enough Dutch or English for safety instructions",
        ],
        minAgeNote: "If you drive a forklift or reach truck, you must be at least 18 years old.",
      },
      wage: {
        title: "Your gross hourly wage",
        accent: "in the warehouse",
        intro: "You earn at least the statutory minimum wage, and usually more on a forklift or reach truck.",
        sourceLabel:
          "job vacancies in The Hague and the Westland in October 2026 and the statutory minimum wage as of 1 July 2026",
        extra: "Night work, very early shifts and weekend work often come with an extra allowance.",
      },
      schedule: {
        title: "Working in shifts",
        accent: "and in busy weeks",
        items: [
          {
            title: "Early, late or at night",
            body: "Many warehouses work in shifts, and in the flower trade you sometimes start at 05:00.",
            icon: "clock",
          },
          {
            title: "Busy before the holidays",
            body: "It is busy around Sinterklaas and Christmas, and for flowers around Valentine's Day and Mother's Day.",
            icon: "season",
          },
          {
            title: "Working in the cold",
            body: "In a cold store it is cold for the whole shift, so you wear warm clothes there.",
            icon: "weather",
          },
        ],
      },
      certificates: {
        title: "Certificates to drive",
        accent: "in the warehouse",
        items: [
          {
            name: "EPT certificate",
            need: "often",
            body: "This lets you drive an electric pallet truck (EPT). The training usually takes one day.",
          },
          {
            name: "Forklift or reach truck certificate",
            need: "often",
            body: "You need this to drive a forklift or reach truck. This training also usually takes one day.",
          },
        ],
      },
      why: {
        title: "Know what you earn",
        accent: "for every shift",
        items: [
          {
            title: "Your wage known up front",
            body: "Every vacancy shows the gross hourly wage, and you hear in advance about any allowances.",
            icon: "wage",
          },
          {
            title: "One number for your schedule",
            body: "Jimmy or Lorenzo is your regular contact person, also when you want other shifts.",
            icon: "phone",
          },
          {
            title: "Safe driving and lifting",
            body: "You never pay for the safety shoes, gloves or safety vest you wear in the warehouse.",
            icon: "shield",
          },
        ],
      },
      career: {
        title: "From order picker",
        accent: "to team leader",
        steps: [
          "Order picker",
          "EPT driver",
          "Forklift or reach truck driver",
          "All-round warehouse worker",
          "Team leader",
        ],
        note: "Each step usually needs a certificate or experience.",
      },
      vacancies: {
        title: "Work in warehouses",
        accent: "around The Hague",
        emptyTitle: "No warehouse work open now",
        emptyBody:
          "In autumn, new vacancies are often added. Register, and we will call you when there is warehouse work.",
      },
      faq: {
        title: "Questions about working",
        accent: "in a warehouse",
        items: [
          {
            q: "Can I start without a forklift certificate?",
            a: "Yes, picking orders and packing need no certificate. You only need one to drive a forklift or reach truck.",
            specific: true,
          },
          {
            q: "How early does my shift start?",
            a: "That depends on the company. In the flower trade you sometimes start at 05:00. The start time is always in the vacancy.",
            specific: true,
          },
          {
            q: "Will I work in shifts?",
            a: "Often yes, because many warehouses have an early and a late shift. You agree in advance which shifts you can work.",
            specific: true,
          },
          {
            q: "How do I get to a business park without a car?",
            a: "That differs per vacancy, because not every warehouse is on a bus route. We check with you whether you can arrive on time.",
            specific: true,
          },
          {
            q: "Is warehouse work heavy?",
            a: "The work is physical, because you stand and walk for the whole shift. We tell you in advance what that company expects.",
            specific: true,
          },
          {
            q: "Do I get the same wage as permanent colleagues?",
            a: "Yes, by law you get the same wage as permanent colleagues who do the same work. This also applies when you drive a forklift.",
            specific: false,
          },
          {
            q: "Do you arrange transport to the business park?",
            a: "Yes, for some business parks around The Hague we arrange transport. The vacancy shows whether this applies to that location.",
            specific: true,
            claim: "transport",
          },
          {
            q: "Can you help me get a forklift certificate?",
            a: "Yes, if a company is looking for someone for the forklift, we help you get the certificate. The training usually takes one day. You hear in advance where and when it is.",
            specific: true,
            claim: "certificateSupport",
          },
        ],
      },
      perspective: {
        text: "Looking for staff for a logistics company? Read what Groos does for clients.",
        linkLabel: "Go to the page for employers",
      },
      cta: {
        title: "Ready for work",
        accent: "in the warehouse?",
        body: "Apply or register, and tell us whether you already have a certificate. Jimmy or Lorenzo will call you to get to know you.",
      },
    },
    employer: {
      meta: {
        title: "Hire logistics workers in The Hague",
        description:
          "Are you looking for logistics workers for your warehouse in The Hague? Groos provides order pickers and forklift drivers for a day or longer. Request staff.",
        keywords: [
          "hire logistics workers",
          "hire order pickers the hague",
          "warehouse staff the hague",
          "hire forklift driver",
          "employment agency logistics the hague",
        ],
        serviceType: "Supply of temporary logistics workers",
      },
      hero: {
        title: "Logistics staff for your warehouse or distribution centre",
        lead: "You are looking for order pickers, warehouse workers or forklift drivers for your regular team or a busy period. We find the people and discuss shifts, certificates and the start date in advance.",
      },
      supply: {
        title: "Logistics workers who",
        accent: "process your orders",
        intro: "We provide people for the work between receiving goods and dispatching them.",
        tasks: [
          "Picking orders with a scanner or pick-by-voice",
          "Unloading, checking and storing goods",
          "Loading lorries according to the loading list",
          "Driving an EPT, forklift or reach truck",
          "Preparing trolleys and containers in the flower trade",
        ],
        clientsTitle: "For these types of companies",
        clients: [
          "Logistics service providers",
          "Wholesalers and foodservice companies",
          "Distribution centres of supermarkets and online shops",
          "Flower and plant exporters",
        ],
      },
      why: {
        title: "Warehouse staff who fit",
        accent: "into your shifts",
        items: [
          {
            title: "Shifts agreed in advance",
            body: "We agree the start times, the shifts per week and any night shifts with you.",
            icon: "handshake",
          },
          {
            title: "One regular contact person",
            body: "You call Jimmy or Lorenzo about planning, schedules and changes.",
            icon: "phone",
          },
          {
            title: "Certificates in the proposal",
            body: "The proposal shows which certificates the candidate holds, such as EPT or forklift.",
            icon: "shield",
          },
          {
            title: "Planning for the peak",
            body: "Discuss extra people for the fourth quarter or Mother's Day early, so we can plan with you.",
            icon: "calendar",
          },
        ],
      },
      certificates: {
        title: "Certificates we discuss",
        accent: "for each candidate",
        intro: "If a candidate does not yet hold a certificate, we discuss with you how this will be arranged.",
        items: [
          {
            name: "EPT certificate",
            need: "often",
            body: "For working with an electric pallet truck. The training usually takes one day.",
          },
          {
            name: "Forklift or reach truck certificate",
            need: "often",
            body: "The law requires competence, and in practice warehouses ask for this certificate.",
          },
          {
            name: "VCA Basic",
            need: "sometimes",
            body: "This VCA safety certificate is rarely needed in distribution centres, but often on industrial sites.",
          },
        ],
      },
      planning: {
        title: "Planning around",
        accent: "peaks and shifts",
        items: [
          {
            title: "Peaks in autumn and spring",
            body: "The fourth quarter is busy because of Black Friday and Christmas. The flower trade adds Valentine's Day and Mother's Day.",
            icon: "season",
          },
          {
            title: "Two or three shifts",
            body: "We plan people for early, late, night and weekend shifts, in the flower trade sometimes from 05:00.",
            icon: "clock",
          },
          {
            title: "A week or a season",
            body: "Workers join you for a few days, a peak period or longer, as agreed in advance.",
            icon: "calendar",
          },
        ],
      },
      legal: {
        title: "What the law requires",
        accent: "when you hire workers",
        items: [
          {
            text: "The worker receives equivalent pay, meaning a package at least equal to that of your permanent staff in the same role.",
          },
          {
            text: "Under the Working Conditions Act, you as the hirer provide instruction and a safe workplace, also at loading docks and cold stores.",
          },
          {
            text: "As the hirer, you can be liable for payroll taxes that the agency does not pay.",
          },
        ],
        wttaLinkLabel: "What the Wtta means for you",
      },
      faq: {
        title: "Questions about hiring",
        accent: "logistics staff",
        items: [
          {
            q: "Can your people drive a forklift or reach truck?",
            a: "That differs per candidate. We ask in advance which vehicles you use and propose candidates with the matching certificate.",
            specific: true,
          },
          {
            q: "Can you provide extra people in the fourth quarter?",
            a: "Yes, and the earlier you discuss the peak with us, the better we can plan. Tell us the people and shifts you need per week.",
            specific: true,
          },
          {
            q: "Do your people work in shifts?",
            a: "Yes, we look for people for early, late and night shifts. The proposal shows for each candidate which shifts they can work.",
            specific: true,
          },
          {
            q: "What pay does the worker receive?",
            a: "The worker receives equivalent pay. The collective labour agreement (cao) or pay scheme for a comparable role at your company sets the wage, including allowances for nights and weekends.",
            specific: true,
          },
          {
            q: "Can they work in a cold store or freezer?",
            a: "Yes, if the candidate knows this in advance and agrees. You provide cold weather clothing, and we tell the candidate about the temperature.",
            specific: true,
          },
          {
            q: "What does a logistics worker cost per hour?",
            a: "The rate depends on the role, the certificates, the shifts and the duration. After your request, we send you a proposal with a clear hourly rate.",
            specific: false,
          },
          {
            q: "Can you arrange a forklift certificate for the candidate?",
            a: "Yes, if a suitable candidate does not yet hold the certificate, Groos can arrange the training. The training usually takes one day, and we agree the date with you in advance.",
            specific: true,
            claim: "certificateSupport",
          },
        ],
      },
      perspective: {
        text: "Looking for work yourself as a logistics worker? The page for job seekers explains everything about the work.",
        linkLabel: "Go to the page for job seekers",
      },
      cta: {
        title: "Need more people",
        accent: "in the busy weeks?",
        body: "Tell us how many people you need, for which shifts and from when. We will contact you to go through the planning.",
      },
    },
  },
} satisfies BeroepContent;
