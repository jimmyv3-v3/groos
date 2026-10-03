import type { BeroepContent } from "@/content/beroepen/types";

export const glazenwasser = {
  id: "glazenwasser",
  wage: {
    starter: { min: 16.08, max: 16.7 },
    experienced: { min: 17.7, max: 18.44 },
    tableDate: "2026-01-01",
    checkedAt: "2026-10-02",
    reviewBy: "2027-01-01",
    sourceUrl: "https://www.schoonmakendnederland.nl/kennisbank/artikel/2025/11/03/cao-loon-gaat-per-1-januari-2026-omhoog-dit-zijn-de-nieuwe-loontabellen",
  },
  minAge18: "work_at_height",
  nl: {
    jobseeker: {
      meta: {
        title: "Werken als glazenwasser in Den Haag",
        description:
          "Wil je werken als glazenwasser in Den Haag? Lees wat het werk op hoogte inhoudt, wat je verdient en hoe laat je begint. Solliciteren kan zonder cv.",
        keywords: [
          "glazenwasser vacature den haag",
          "glazenwasser worden",
          "werk als glazenwasser",
          "glazenwasser zonder ervaring",
          "glazenwasser rijbewijs b",
        ],
      },
      hero: {
        title: "Werken als glazenwasser in Den Haag",
        lead: "Als glazenwasser maak je ramen en gevels schoon bij kantoren, winkels en woningen in Den Haag. Je werkt overdag in een ploeg, deels op hoogte.",
        facts: [
          { label: "Werktijden", value: "Meestal vanaf 07.00 uur" },
          { label: "Werkplek", value: "Buiten, deels op hoogte" },
        ],
      },
      work: {
        title: "Zo ziet je werk als",
        accent: "glazenwasser eruit",
        intro: "Je werkt op een vaste route langs huizen en winkels, of een paar dagen bij één groot gebouw.",
        tasks: [
          "Ramen, kozijnen en deuren wassen",
          "Hoge ramen wassen met een lange wasstok",
          "Werken op een ladder of in een hoogwerker",
          "Zonnepanelen en dakgoten schoonmaken",
          "De bus en de ladders netjes houden",
        ],
        placesTitle: "Waar je werkt",
        places: ["Kantoren en hoge flats", "Winkelstraten, vaak voor openingstijd", "Woonwijken en daken met zonnepanelen"],
      },
      requirements: {
        title: "Wat je meebrengt",
        accent: "om hoog te werken",
        items: [
          "Je hebt geen last van hoogtevrees",
          "Je hebt rijbewijs B als je de bus rijdt",
          "Je spreekt genoeg Nederlands of Engels voor veiligheidsinstructies",
        ],
        minAgeNote: "Omdat je op hoogte werkt, moet je minimaal 18 jaar zijn.",
      },
      wage: {
        title: "Wat een glazenwasser",
        accent: "per uur verdient",
        intro: "Via Groos krijg je hetzelfde loon als vaste glazenwassers die hetzelfde werk doen.",
        sourceLabel:
          "loontabel van de cao Schoonmaak- en Glazenwassersbedrijf, Glazenwasser I en II, per 1 januari 2026",
        extra: "Voor werk in de avond of het weekend gelden vaak toeslagen.",
      },
      schedule: {
        title: "Je dag begint vroeg,",
        accent: "het weer telt mee",
        items: [
          {
            title: "Vroeg op pad",
            body: "Je begint meestal om 07.00 uur, bij winkels vaak voordat de deuren opengaan.",
            icon: "clock",
          },
          {
            title: "Druk in voorjaar en zomer",
            body: "In deze maanden laten veel mensen hun ramen en zonnepanelen schoonmaken. In de winter is het rustiger.",
            icon: "season",
          },
          {
            title: "Minder werk bij slecht weer",
            body: "Bij vorst, storm of zware regen is een ladder niet veilig, dus werk je minder.",
            icon: "weather",
          },
        ],
      },
      certificates: {
        title: "Certificaten voor werk",
        accent: "op ladder en hoogwerker",
        // TODO RAS-basisvakopleiding Glasbewassing: bevestigen of die voor uitzendkrachten via Groos geldt (spec 05 §6.6); pas daarna als certificaat toevoegen, zonder belofte over wie hem betaalt.
        items: [
          {
            name: "VCA Basis",
            need: "often",
            body: "VCA is een diploma voor veilig werken. Je haalt het met een korte cursus en een examen.",
          },
          {
            name: "IPAF",
            need: "sometimes",
            body: "Je haalt IPAF in een cursus van 1 dag. Het bewijs blijft daarna 5 jaar geldig.",
          },
        ],
      },
      why: {
        title: "Werk op hoogte met",
        accent: "duidelijke afspraken",
        items: [
          {
            title: "Je uurloon vooraf bekend",
            body: "Bij elke vacature staat het bruto uurloon, dus je weet vooraf wat je verdient.",
            icon: "wage",
          },
          {
            title: "Een vaste contactpersoon",
            body: "Ons team belt je als er werk is. Met vragen kun je ons ook zelf bellen.",
            icon: "phone",
          },
          {
            title: "Veilig de ladder op",
            body: "Wij vertellen je vooraf met welke methode je werkt en welke certificaten nodig zijn.",
            icon: "shield",
          },
        ],
      },
      career: {
        title: "Je groeit door met",
        accent: "nieuwe methodes en certificaten",
        steps: ["Glazenwasser", "Allround glazenwasser", "Gevelbehandelaar", "Meewerkend ploegleider"],
        note: "Met IPAF en meer ervaring kun je meer soorten werk doen.",
      },
      vacancies: {
        title: "Vacatures voor glazenwassers",
        accent: "in Den Haag",
        emptyTitle: "Nu geen vacature voor glazenwassers",
        emptyBody: "In het voorjaar komt er vaak nieuw werk bij. Schrijf je in, dan bellen wij je.",
      },
      faq: {
        title: "Vragen over hoogte, weer",
        accent: "en je rijbewijs",
        items: [
          {
            q: "Moet ik tegen hoogte kunnen?",
            a: "Ja, een deel van het werk doe je op een ladder of in een hoogwerker. Met een lange wasstok werk je vanaf de grond.",
            specific: true,
          },
          {
            q: "Werk ik ook als het regent of vriest?",
            a: "Bij lichte regen gaat het werk meestal gewoon door. Bij vorst of storm schuift de klus naar een andere dag.",
            specific: true,
          },
          {
            q: "Heb ik een rijbewijs nodig?",
            a: "Dat hangt af van de vacature. Rijd je de bus met ladders naar de route, dan heb je rijbewijs B nodig.",
            specific: true,
          },
          {
            q: "Wat is IPAF en wanneer heb ik het nodig?",
            a: "IPAF is een bewijs dat je veilig met een hoogwerker werkt. Je hebt het nodig bij gebouwen hoger dan ongeveer 13,5 meter.",
            specific: true,
          },
          {
            q: "Kan ik glazenwasser worden zonder ervaring?",
            a: "Dat hangt af van de vacature. Sommige bedrijven leren je het vak samen met een ervaren collega op de route.",
            specific: true,
          },
          {
            q: "Kost werken via Groos mij iets?",
            a: "Nee, solliciteren en inschrijven zijn gratis. Ook handschoenen, werkschoenen en een harnas voor werk op hoogte betaal je niet zelf.",
            specific: false,
          },
          {
            q: "Helpen jullie mij aan VCA of IPAF?",
            a: "Ja, heb je nog geen VCA of IPAF, dan helpen wij je het te halen. Wij spreken vooraf af wanneer de cursus is en wie hem betaalt.",
            specific: true,
            claim: "certificateSupport",
          },
        ],
      },
      perspective: {
        text: "Personeel zoeken voor een glazenwassersbedrijf? Lees wat Groos voor opdrachtgevers doet.",
        linkLabel: "Naar de pagina voor werkgevers",
      },
      cta: {
        title: "Wil je werken als glazenwasser",
        accent: "in een vaste ploeg?",
        body: "Solliciteer op een vacature of schrijf je in. Ons team belt je over routes en werktijden die bij je passen.",
      },
    },
    employer: {
      meta: {
        title: "Personeel voor glazenwasserijen in Den Haag",
        description:
          "Zoekt u personeel voor uw glazenwasserij in Den Haag en omgeving? Groos levert glazenwassers voor een dag, een paar weken of langer. Vraag personeel aan.",
        keywords: [
          "glazenwassers inhuren den haag",
          "uitzendkracht glazenwasser",
          "personeel glazenwasserij",
          "glasbewassing personeel",
          "uitzendbureau glazenwassers den haag",
        ],
        serviceType: "Uitzenden van glazenwassers",
      },
      hero: {
        title: "Uitzendkrachten voor uw glazenwassersbedrijf in Den Haag",
        lead: "U wilt glazenwassers die veilig op hoogte werken en zelfstandig hun route rijden. Wij zoeken de mensen en bespreken vooraf welke certificaten en ervaring het werk vraagt.",
      },
      supply: {
        title: "Wat onze glazenwassers",
        accent: "op uw objecten doen",
        intro:
          "Wij bespreken per object de methode en de werkhoogte met u, zodat de medewerker met het juiste materiaal begint.",
        tasks: [
          "Glas, kozijnen en deuren wassen aan binnen- en buitenzijde",
          "Werken met een telescopisch wassysteem tot 13,5 meter",
          "Werken vanaf ladders en vanuit een hoogwerker",
          "Zonnepanelen reinigen en dakgoten schoonmaken",
          "De bus met ladders en watertank naar de route rijden",
        ],
        clientsTitle: "Voor deze soorten bedrijven",
        clients: [
          "Glazenwassers- en gevelonderhoudsbedrijven",
          "Schoonmaakbedrijven met een afdeling glasbewassing",
          "Bedrijven in zonnepaneelreiniging en dakgootonderhoud",
        ],
      },
      why: {
        title: "Glazenwassers die u",
        accent: "op hoogte kunt inzetten",
        items: [
          {
            title: "Afspraken over methode en hoogte",
            body: "Wij vragen vooraf naar uw objecten, de werkhoogte en uw methodes. Daarna stellen wij passende kandidaten voor.",
            icon: "handshake",
          },
          {
            title: "Eén vast team",
            body: "U belt met ons team, ook als het weer uw planning omgooit. Wij kennen uw aanvraag.",
            icon: "phone",
          },
          {
            title: "Certificaten per kandidaat zichtbaar",
            body: "Bij elk voorstel ziet u of iemand VCA, IPAF of rijbewijs B heeft.",
            icon: "shield",
          },
          {
            title: "Netjes bij uw klanten",
            body: "U vertelt ons wat u bij uw klanten verwacht, zoals werkkleding. Wij geven dat vooraf door.",
            icon: "person",
          },
        ],
      },
      certificates: {
        title: "Certificaten die wij per kandidaat",
        accent: "met u bespreken",
        // TODO RAS-basisvakopleiding Glasbewassing: bevestigen of die voor uitzendkrachten via Groos geldt (spec 05 §6.6); pas daarna toevoegen.
        items: [
          {
            name: "VCA Basis",
            need: "often",
            body: "Basiscertificaat voor veilig werken, vaak gevraagd bij zakelijke objecten en gevelwerk.",
          },
          {
            name: "Rijbewijs B",
            need: "often",
            body: "Nodig als de medewerker de bus rijdt. Voor een aanhanger met hoogwerker of waterkar is BE nodig.",
          },
          {
            name: "IPAF",
            need: "sometimes",
            body: "Nodig voor wie een hoogwerker bedient, zoals bij werk boven ongeveer 13,5 meter. De cursus duurt 1 dag.",
          },
        ],
      },
      planning: {
        title: "Planning rond het",
        accent: "voorjaar en het weer",
        items: [
          {
            title: "Piek in voorjaar en zomer",
            body: "De meeste vraag komt in voorjaar en zomer. Bij vorst of storm schuift het werk naar een andere dag.",
            icon: "season",
          },
          {
            title: "Vroege starts bij winkels",
            body: "Medewerkers beginnen meestal om 07.00 uur, bij winkelstraten vaak voor openingstijd. Zaterdagwerk spreken wij vooraf af.",
            icon: "clock",
          },
          {
            title: "Inzet per klus of seizoen",
            body: "U leent een glazenwasser in voor een losse klus, een paar weken of een heel seizoen.",
            icon: "calendar",
          },
        ],
      },
      legal: {
        title: "Gelijke beloning en",
        accent: "veilig werken op hoogte",
        items: [
          {
            text: "De uitzendkracht krijgt een gelijkwaardige beloning: loon, toeslagen en vakantiegeld zijn samen minstens gelijk aan die van uw vaste glazenwassers.",
          },
          {
            text: "Als inlener zorgt u volgens de Arbowet voor instructie over ladders, valbeveiliging en de hoogwerker. Beschermingsmiddelen zijn kosteloos voor de medewerker.",
          },
          {
            text: "Als inlener kunt u aansprakelijk zijn voor loonheffingen die een uitzendbureau niet afdraagt.",
          },
        ],
        wttaLinkLabel: "Wat de Wtta voor u betekent",
      },
      faq: {
        title: "Vragen van glazenwassersbedrijven",
        accent: "over inlenen",
        items: [
          {
            q: "Hebben uw glazenwassers VCA en IPAF?",
            a: "Dat verschilt per kandidaat en staat in elk voorstel. Vraagt het werk een hoogwerker, dan stellen wij alleen kandidaten met IPAF voor.",
            specific: true,
          },
          {
            q: "Kan de medewerker zelf de bus rijden?",
            a: "Ja, als de kandidaat rijbewijs B heeft, en dat staat in het voorstel. Geef in uw aanvraag aan of de medewerker zelfstandig een route rijdt.",
            specific: true,
          },
          {
            q: "Wat als het weer tegenzit?",
            a: "Bij vorst, storm of zware regen is werken op hoogte niet veilig. U bepaalt of de klus doorgaat, en wij verschuiven de inzet in overleg.",
            specific: true,
          },
          {
            // TODO inleenduur in de glazenwassersbranche (maximaal 12 maanden, 7,5 procent-regel) laten toetsen tegen de cao Schoonmaak- en Glazenwassersbedrijf 2026-2028; tot dan zonder getal.
            q: "Hoe lang mag ik een glazenwasser inlenen?",
            a: "Dat bepaalt u in principe zelf. De cao van uw bedrijf kan wel een grens stellen aan de inleenduur, en dat bespreken wij vooraf.",
            specific: true,
          },
          {
            q: "Wat kost een glazenwasser via Groos?",
            a: "Het tarief hangt af van de functie, de uren en de duur van de inzet. Na uw aanvraag sturen wij een voorstel met een helder uurtarief.",
            specific: false,
          },
          {
            q: "Wie is mijn contactpersoon bij Groos?",
            a: "U heeft contact met ons team. Wij regelen uw aanvraag en blijven uw aanspreekpunt zolang de glazenwassers bij u werken.",
            specific: false,
          },
          {
            q: "Regelt u vervanging als een glazenwasser uitvalt?",
            a: "Ja, valt een glazenwasser onverwacht uit, dan zoeken wij een vervanger met dezelfde certificaten. Wij houden u op de hoogte tot de route weer loopt.",
            specific: false,
            claim: "replacement",
          },
        ],
      },
      perspective: {
        text: "Zelf werk zoeken als glazenwasser? Op de pagina voor werkzoekenden staat alles over het werk.",
        linkLabel: "Naar de pagina voor werkzoekenden",
      },
      cta: {
        title: "Extra glazenwassers nodig",
        accent: "voor het voorjaar?",
        body: "Vertel ons hoeveel glazenwassers u zoekt en vanaf wanneer. Wij nemen contact met u op om de planning door te nemen.",
      },
    },
  },
  en: {
    jobseeker: {
      meta: {
        title: "Work as a window cleaner in The Hague",
        description:
          "Do you want to work as a window cleaner in The Hague? Read what the work at height involves, what you earn and when you start. You can apply without a CV.",
        keywords: [
          "window cleaner jobs the hague",
          "become a window cleaner",
          "window cleaning work",
          "window cleaner no experience",
          "window cleaner driving licence",
        ],
      },
      hero: {
        title: "Work as a window cleaner in The Hague",
        lead: "As a window cleaner, you clean windows and facades at offices, shops and homes in The Hague. You work in a team, partly at height.",
        facts: [
          { label: "Working hours", value: "Usually from 07:00" },
          { label: "Workplace", value: "Outdoors, partly at height" },
        ],
      },
      work: {
        title: "This is your work as",
        accent: "a window cleaner",
        intro: "You work on a regular round past houses and shops, or for a few days at one large building.",
        tasks: [
          "Washing windows, frames and doors",
          "Washing high windows with a long pole",
          "Working on a ladder or in a lifting platform",
          "Cleaning solar panels and gutters",
          "Keeping the van and the ladders tidy",
        ],
        placesTitle: "Where you work",
        places: ["Offices and tall flats", "Shopping streets, often before opening time", "Residential areas and roofs with solar panels"],
      },
      requirements: {
        title: "What you bring",
        accent: "to work at height",
        items: [
          "You are not afraid of heights",
          "You have driving licence B if you drive the van",
          "You speak enough Dutch or English for safety instructions",
        ],
        minAgeNote: "Because you work at height, you must be at least 18 years old.",
      },
      wage: {
        title: "What a window cleaner",
        accent: "earns per hour",
        intro: "Through Groos, you earn the same as permanent window cleaners who do the same work.",
        sourceLabel:
          "wage table of the cleaning and window cleaning collective labour agreement (cao), Window cleaner I and II, 1 January 2026",
        extra: "Work in the evening or at the weekend often comes with extra pay.",
      },
      schedule: {
        title: "Your day starts early,",
        accent: "the weather plays a part",
        items: [
          {
            title: "Out early",
            body: "You usually start at 07:00, at shops often before the doors open.",
            icon: "clock",
          },
          {
            title: "Busy in spring and summer",
            body: "In these months, many people have their windows and solar panels cleaned. Winter is quieter.",
            icon: "season",
          },
          {
            title: "Less work in bad weather",
            body: "In frost, storms or heavy rain, a ladder is not safe, so you work less.",
            icon: "weather",
          },
        ],
      },
      certificates: {
        title: "Certificates for work",
        accent: "on ladders and platforms",
        items: [
          {
            name: "VCA Basis",
            need: "often",
            body: "The VCA safety certificate is a diploma for safe work. You get it with a short course and an exam.",
          },
          {
            name: "IPAF",
            need: "sometimes",
            body: "You get IPAF in a 1 day course. The certificate then stays valid for 5 years.",
          },
        ],
      },
      why: {
        title: "Work at height with",
        accent: "clear agreements",
        items: [
          {
            title: "Your hourly wage up front",
            body: "Every job shows the gross hourly wage, so you know in advance what you earn.",
            icon: "wage",
          },
          {
            title: "One regular contact person",
            body: "Our team calls you when there is work. You can also call us with questions.",
            icon: "phone",
          },
          {
            title: "Safely up the ladder",
            body: "We tell you in advance which method you use and which certificates you need.",
            icon: "shield",
          },
        ],
      },
      career: {
        title: "You grow with",
        accent: "new methods and certificates",
        steps: ["Window cleaner", "All-round window cleaner", "Facade cleaner", "Working crew leader"],
        note: "With IPAF and more experience, you can do more kinds of work.",
      },
      vacancies: {
        title: "Jobs for window cleaners",
        accent: "in The Hague",
        emptyTitle: "No window cleaner jobs right now",
        emptyBody: "New work often comes in during spring. Register with us, and we call you.",
      },
      faq: {
        title: "Questions about height, weather",
        accent: "and your licence",
        items: [
          {
            q: "Do I need to cope with heights?",
            a: "Yes, you do part of the work on a ladder or in a lifting platform. With a long washing pole, you work from the ground.",
            specific: true,
          },
          {
            q: "Do I also work when it rains or freezes?",
            a: "In light rain, the work usually goes on as normal. In frost or storms, the job moves to another day.",
            specific: true,
          },
          {
            q: "Do I need a driving licence?",
            a: "That depends on the job. If you drive the van with ladders to the round, you need a category B licence.",
            specific: true,
          },
          {
            q: "What is IPAF and when do I need it?",
            a: "IPAF is proof that you work safely with a lifting platform. You need it for buildings higher than about 13.5 metres.",
            specific: true,
          },
          {
            q: "Can I become a window cleaner without experience?",
            a: "That depends on the job. Some companies teach you the trade together with an experienced colleague on the round.",
            specific: true,
          },
          {
            q: "Does working through Groos cost me anything?",
            a: "No, applying and registering are free. You also do not pay for gloves, safety shoes or a harness for work at height.",
            specific: false,
          },
          {
            q: "Can you help me get VCA or IPAF?",
            a: "Yes, if you do not have VCA or IPAF yet, we help you get it. We agree in advance when the course is and who pays for it.",
            specific: true,
            claim: "certificateSupport",
          },
        ],
      },
      perspective: {
        text: "Looking for staff for a window cleaning company? Read what Groos does for clients.",
        linkLabel: "Go to the page for employers",
      },
      cta: {
        title: "Do you want to clean windows",
        accent: "in a regular team?",
        body: "Apply for a job or register with us. Our team calls you about rounds and hours that suit you.",
      },
    },
    employer: {
      meta: {
        title: "Staff for window cleaning companies in The Hague",
        description:
          "Do you need staff for your window cleaning company in The Hague? Groos provides window cleaners for a day, a few weeks or longer. Request staff.",
        keywords: [
          "hire window cleaners the hague",
          "temporary window cleaner",
          "staff window cleaning company",
          "window cleaning staff",
          "employment agency window cleaners the hague",
        ],
        serviceType: "Supplying temporary window cleaners",
      },
      hero: {
        title: "Temporary workers for your window cleaning company in The Hague",
        lead: "You want window cleaners who work safely at height and drive their round on their own. We find the people and agree in advance which certificates and experience the work requires.",
      },
      supply: {
        title: "What our window cleaners",
        accent: "do at your sites",
        intro: "We discuss the method and working height for each site with you, so the worker brings the right equipment.",
        tasks: [
          "Washing glass, frames and doors inside and out",
          "Working with a water-fed pole system up to 13.5 metres",
          "Working from ladders and from a lifting platform",
          "Cleaning solar panels and gutters",
          "Driving the van with ladders to the round",
        ],
        clientsTitle: "For these types of companies",
        clients: [
          "Window cleaning and facade maintenance companies",
          "Cleaning companies with a window cleaning department",
          "Solar panel cleaning and gutter maintenance companies",
        ],
      },
      why: {
        title: "Window cleaners you can",
        accent: "deploy at height",
        items: [
          {
            title: "Agreements on method and height",
            body: "We ask in advance about your sites, the working height and your methods. We then propose suitable candidates.",
            icon: "handshake",
          },
          {
            title: "Two regular contact persons",
            body: "You call our team, also when the weather upsets your planning. We know your request.",
            icon: "phone",
          },
          {
            title: "Certificates visible per candidate",
            body: "Each proposal shows whether someone has VCA, IPAF or a category B driving licence.",
            icon: "shield",
          },
          {
            title: "Neat work for your customers",
            body: "You tell us what you expect at your customers, such as workwear. We pass that on in advance.",
            icon: "person",
          },
        ],
      },
      certificates: {
        title: "Certificates we discuss",
        accent: "with you per candidate",
        items: [
          {
            name: "VCA Basis",
            need: "often",
            body: "The basic VCA safety certificate, often asked for at commercial sites and facade work.",
          },
          {
            name: "Driving licence B",
            need: "often",
            body: "Needed if the worker drives the van. A trailer with a platform or water cart requires a BE licence.",
          },
          {
            name: "IPAF",
            need: "sometimes",
            body: "Needed to operate a lifting platform, for example above about 13.5 metres. The course takes 1 day.",
          },
        ],
      },
      planning: {
        title: "Planning around",
        accent: "spring and the weather",
        items: [
          {
            title: "Peak in spring and summer",
            body: "Most demand comes in spring and summer. In frost or storms, the work moves to another day.",
            icon: "season",
          },
          {
            title: "Early starts at shops",
            body: "Workers usually start at 07:00, at shopping streets often before opening time. We agree Saturday work in advance.",
            icon: "clock",
          },
          {
            title: "Assignments per job or season",
            body: "You hire a window cleaner for a single job, a few weeks or a whole season.",
            icon: "calendar",
          },
        ],
      },
      legal: {
        title: "Equal pay and",
        accent: "safe work at height",
        items: [
          {
            text: "The temporary worker receives equivalent pay: wage, allowances and holiday pay together are at least equal to those of your permanent window cleaners.",
          },
          {
            text: "As the hirer, you provide instruction on ladders, fall protection and the platform under the Dutch Working Conditions Act. Protective equipment is free for the worker.",
          },
          {
            text: "As the hirer, you can be liable for wage taxes that an employment agency does not pay.",
          },
        ],
        wttaLinkLabel: "What the Wtta means for you",
      },
      faq: {
        title: "Questions from window cleaning companies",
        accent: "about hiring",
        items: [
          {
            q: "Do your window cleaners have VCA and IPAF?",
            a: "That differs per candidate and is stated in every proposal. If the work needs a lifting platform, we only propose candidates with IPAF.",
            specific: true,
          },
          {
            q: "Can the worker drive the van?",
            a: "Yes, if the candidate has a category B licence, which the proposal states. Tell us in your request whether the worker drives a round alone.",
            specific: true,
          },
          {
            q: "What if the weather is bad?",
            a: "In frost, storms or heavy rain, working at height is not safe. You decide whether the job goes ahead, and we move the assignment in consultation.",
            specific: true,
          },
          {
            q: "How long may I hire a window cleaner?",
            a: "In principle, you decide that yourself. The collective labour agreement (cao) of your company can limit the hiring period, and we discuss this in advance.",
            specific: true,
          },
          {
            q: "What does a window cleaner through Groos cost?",
            a: "The rate depends on the role, the hours and the length of the assignment. After your request, we send a proposal with a clear hourly rate.",
            specific: false,
          },
          {
            q: "Who is my contact person at Groos?",
            a: "You deal with our team. We handle your request and remain your contact for as long as the window cleaners work for you.",
            specific: false,
          },
          {
            q: "Do you arrange a replacement if a window cleaner drops out?",
            a: "Yes, if a window cleaner drops out unexpectedly, we look for a replacement with the same certificates. We keep you informed until the round runs again.",
            specific: false,
            claim: "replacement",
          },
        ],
      },
      perspective: {
        text: "Looking for work as a window cleaner yourself? The page for job seekers explains the work.",
        linkLabel: "Go to the page for job seekers",
      },
      cta: {
        title: "Need extra window cleaners",
        accent: "for the spring?",
        body: "Tell us how many window cleaners you need and from when. We contact you to go through the planning.",
      },
    },
  },
} satisfies BeroepContent;
