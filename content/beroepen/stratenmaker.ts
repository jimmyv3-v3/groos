import type { BeroepContent } from "@/content/beroepen/types";

export const stratenmaker = {
  id: "stratenmaker",
  wage: {
    starter: { min: 15.98, max: 16.97 },
    experienced: { min: 20.02, max: 22.68 },
    tableDate: "2026-07-01",
    checkedAt: "2026-10-05",
    reviewBy: "2027-01-01",
    sourceUrl: "https://media.umbraco.io/bouwend-nederland/z0niekfd/loontabellen-bouwplaatswerknemer-cao-2025-2027-mei-2026.pdf",
  },
  minAge18: "construction_demolition",
  nl: {
    jobseeker: {
      meta: {
        title: "Werken als stratenmaker in Den Haag",
        description:
          "Wil je als stratenmaker aan de slag in Den Haag? Lees wat het vak inhoudt, wat je verdient en hoe je zonder ervaring begint als opperman bestratingen.",
        keywords: [
          "stratenmaker vacature den haag",
          "stratenmaker salaris",
          "opperman stratenmaker gezocht",
          "stratenmaker zonder ervaring",
          "stratenmaker worden",
          "opperman bestratingen",
        ],
      },
      hero: {
        title: "Werken als stratenmaker in Den Haag",
        lead: "Als stratenmaker leg je klinkers en tegels, stel je banden en zorg je dat het regenwater wegloopt. Je werkt met een ploeg op straat, steeds vaker met een machine.",
        facts: [{ label: "Zonder ervaring", value: "Start als opperman bestratingen" }],
      },
      work: {
        title: "Van zandbed tot",
        accent: "ingeveegde straat",
        intro: "Jij maakt zelf het eindproduct, een straat of stoep die vlak ligt.",
        tasks: [
          "Het zandbed verdichten en strak afreien",
          "Klinkers en tegels in verband leggen",
          "Banden en kolken op hoogte stellen",
          "Afschot maken voor de waterafvoer",
          "Passtukken knippen of nat zagen",
          "Straten met machine, klem of vacuümunit",
          "Aftrillen en invegen met voegzand",
        ],
        placesTitle: "Hier werk je",
        places: [
          "Straten, stoepen en fietspaden",
          "Pleinen en parkeerterreinen",
          "Sleuven die dicht moeten na kabel- en leidingwerk",
        ],
      },
      requirements: {
        title: "Wat je meebrengt",
        accent: "als stratenmaker of opperman",
        items: [
          "Voor zelfstandig straatwerk heb je ervaring of een mbo-opleiding nodig",
          "Zonder ervaring begin je als opperman bestratingen",
          "Je werkt graag buiten, ook gebukt en op je knieën",
          "Veel vacatures vragen rijbewijs B",
        ],
        minAgeNote: "Omdat je op een bouwplaats of langs de weg werkt, is de minimumleeftijd 18 jaar.",
      },
      wage: {
        title: "Van startloon naar",
        accent: "het loon van een vakman",
        intro:
          "Kom je van buiten de bouw, dan start je als opperman bestratingen op het startloon. Het tweede bedrag is voor een stratenmaker met ervaring.",
        sourceLabel: "cao Bouw en Infra, garantieloon per 1 januari 2026 en starttabel per 1 juli 2026",
      },
      schedule: {
        title: "Werktijden van een straatploeg",
        accent: "door het jaar heen",
        items: [
          {
            title: "Vroeg beginnen",
            body: "Je werkt doordeweeks en begint vroeg, vaak om 07.00 uur. Werk aan de weg is soms in de avond of nacht.",
            icon: "early",
          },
          {
            title: "Vorst en sneeuw",
            body: "Bij vorst of sneeuw kan het straatwerk stilliggen. Vraag ons team wat dat voor je uren betekent.",
            icon: "weather",
          },
          {
            title: "Projecten en bouwvak",
            body: "Je staat vaak weken tot maanden op één werk. In de zomer kent de bouw drie weken bouwvak.",
            icon: "calendar",
          },
        ],
      },
      certificates: {
        title: "Diploma's en cursussen",
        accent: "voor werk aan de straat",
        items: [
          {
            name: "VCA Basis",
            need: "often",
            body: "Bijna elk infrabedrijf vraagt dit diploma voor veilig werken. Het examen kan ook in het Engels.",
          },
          {
            name: "Veilig werken langs de weg",
            need: "often",
            body: "Deze cursus volg je voordat je naast het verkeer werkt.",
          },
          {
            name: "Beschermingsmiddelen",
            need: "always",
            body: "Werkschoenen S3, kniebeschermers, handschoenen en gehoorbescherming kosten je niets.",
          },
        ],
      },
      why: {
        title: "Straatwerk met heldere afspraken",
        accent: "over loon en materieel",
        items: [
          {
            title: "Het uurloon staat erbij",
            body: "Wat je bruto per uur verdient, staat in de vacature. Dat is hetzelfde als een vaste collega voor dit werk krijgt.",
            icon: "wage",
          },
          {
            title: "Duidelijk voor je begint",
            body: "Vooraf hoor je waar en hoe laat je begint, en of er machinaal gestraat wordt.",
            icon: "tools",
          },
          {
            title: "Ons team aan de lijn",
            body: "Heb je een vraag over het werk, bel of app dan ons team.",
            icon: "phone",
          },
        ],
      },
      career: {
        title: "De route van opperman",
        accent: "naar zelfstandig stratenmaker",
        steps: ["Opperman bestratingen", "Stratenmaker", "Allround stratenmaker", "Ploegleider"],
        note: "Het vak leer je in de ploeg of met een opleiding naast je werk.",
      },
      vacancies: {
        title: "Vacatures voor stratenmakers",
        accent: "en oppermannen in Den Haag",
        emptyTitle: "Nu geen vacature in het straatwerk",
        emptyBody: "Schrijf je toch in. Zoekt een straatploeg iemand, dan bellen wij je.",
      },
      faq: {
        title: "Vragen over het vak",
        accent: "van stratenmaker en opperman",
        items: [
          {
            q: "Kan ik zonder ervaring als stratenmaker beginnen?",
            a: "Ja, dan begin je als opperman bestratingen en leer je het vak in de ploeg. Zelfstandig straten vraagt ervaring of een opleiding.",
            specific: true,
          },
          {
            q: "Moet ik alle stenen met de hand leggen?",
            a: "Nee, machinaal straten is de norm en een machine of klem tilt de stenen. Handwerk blijft er waar het niet anders kan, en bukken en knielen hoort erbij.",
            specific: true,
          },
          {
            q: "Heb ik een diploma nodig om te straten?",
            a: "Nee, dat is niet wettelijk verplicht. Bedrijven vragen wel ervaring of een mbo-opleiding op niveau 2 of 3.",
            specific: true,
          },
          {
            q: "Heb ik VCA nodig voor straatwerk?",
            a: "Meestal wel. In de vacature staat of je ook de cursus veilig werken langs de weg nodig hebt.",
            specific: true,
          },
          {
            q: "Hoe lang blijf ik op het startloon?",
            a: "Het startloon geldt hoogstens één jaar en alleen voor wie nieuw is in de bouw. Daarna krijg je het loon van je functie.",
            specific: true,
          },
          {
            // TODO claim certificateSupport: hulp bij VCA en de cursus veilig werken langs de weg, en wie de cursus betaalt
            q: "Helpen jullie mij aan VCA of de cursus voor werk langs de weg?",
            a: "Ja, wij helpen je om VCA Basis en de cursus veilig werken langs de weg te halen. Vooraf spreken wij af wanneer de cursus is en wie hem betaalt.",
            specific: true,
            claim: "certificateSupport",
          },
          {
            // TODO claim transport: vervoer naar het werk
            q: "Hoe kom ik zonder auto bij het werk?",
            a: "Is een werk met bus of tram slecht te bereiken, dan regelen wij vervoer ernaartoe. Hoe je er komt, lees je in de vacature.",
            specific: true,
            claim: "transport",
          },
          {
            q: "Moet ik betalen om me in te schrijven?",
            a: "Nee, inschrijven en solliciteren kosten je niets. Een cv heb je ook niet nodig.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Stratenmakers zoeken voor een bestratingsbedrijf of infraproject? Lees hoe inhuren via Groos werkt.",
        linkLabel: "Naar de pagina voor werkgevers",
      },
      cta: {
        title: "Leg jij straks klinkers",
        accent: "in en rond Den Haag?",
        body: "Solliciteer of laat je gegevens achter. Ons team belt je over straatwerk dat bij je past.",
      },
    },
    employer: {
      meta: {
        title: "Stratenmakers inhuren in Den Haag",
        description:
          "Zoekt u stratenmakers of oppermannen voor straatwerk in Den Haag en omgeving? Groos bespreekt vooraf ervaring, machinaal straten en veilig werken langs de weg.",
        keywords: [
          "stratenmakers inhuren",
          "uitzendbureau stratenmaker",
          "machinaal stratenmaker",
          "opperman bestratingen inhuren",
          "stratenmakers den haag",
        ],
        serviceType: "Uitzenden van stratenmakers",
      },
      hero: {
        title: "Stratenmakers en oppermannen voor uw straatwerk in Den Haag",
        lead: "U zoekt een stratenmaker die zelfstandig een vak dichtstraat, of een opperman voor uw ploeg. Wij bespreken vooraf de ervaring per kandidaat en hoe er gestraat wordt.",
      },
      supply: {
        title: "Straatwerk dat onze mensen",
        accent: "voor u uitvoeren",
        intro:
          "Een stratenmaker maakt het werk af, en een opperman bestratingen voert materiaal aan en doet het grondwerk.",
        tasks: [
          "Het zandbed verdichten en op hoogte afreien",
          "Straten in verband, met de hand of machinaal",
          "Banden stellen met klem of vacuümunit",
          "Kolken en putten op hoogte stellen",
          "Passtukken knippen of nat zagen",
          "Aftrillen, invegen en schoon opleveren",
          "Herstraten na riool-, kabel- en leidingwerk",
        ],
        clientsTitle: "Voor deze opdrachtgevers",
        clients: [
          "Bestratingsbedrijven die een ploeg aanvullen",
          "Aannemers bij rioolvervanging en herinrichting",
          "Kabel- en leidingaannemers met sleuven die dicht moeten",
        ],
      },
      why: {
        title: "Straatwerk volgens uw plan,",
        accent: "machinaal waar het kan",
        items: [
          {
            title: "Ervaring per kandidaat besproken",
            body: "Wij vragen elke kandidaat naar verbanden, banden stellen en machinaal straten. U hoort vooraf wat iemand zelfstandig kan.",
            icon: "person",
          },
          {
            title: "Veilig naast het verkeer",
            body: "Per kandidaat bespreken wij VCA Basis en de cursus veilig werken langs de weg.",
            icon: "safety",
          },
          {
            title: "Uw materieel, uw instructie",
            body: "U levert de klem, vacuümunit of bestratingsmachine en geeft daar instructie op. Wij bespreken vooraf welk deel machinaal gaat.",
            icon: "tools",
          },
          {
            title: "Eén team voor uw planning",
            body: "Over uren, weer en de volgende fase belt u met ons team.",
            icon: "phone",
          },
        ],
      },
      certificates: {
        title: "Papieren voor straatwerk",
        accent: "in de openbare ruimte",
        items: [
          {
            name: "VCA Basis",
            need: "often",
            body: "De meeste infrabedrijven vragen dit basisdiploma voor veilig werken.",
          },
          {
            name: "Veilig werken langs de weg",
            need: "often",
            body: "Deze cursus is voor wie naast het verkeer werkt. Wij melden vooraf of de kandidaat hem heeft gevolgd.",
          },
          {
            name: "Persoonlijke beschermingsmiddelen",
            need: "always",
            body: "Werkschoenen S3, kniebeschermers, handschoenen en gehoor- en adembescherming kosten de medewerker niets.",
          },
        ],
      },
      planning: {
        title: "Inzet per fase,",
        accent: "ook bij vorst en bouwvak",
        items: [
          {
            title: "Weken tot maanden op één werk",
            body: "Straatwerk loopt per project en per fase, vaak weken tot maanden.",
            icon: "calendar",
          },
          {
            title: "Vorst en sneeuw",
            body: "Bij vorst of sneeuw kan het werk stilliggen. U laat ons weten of de ploeg begint.",
            icon: "weather",
          },
          {
            title: "Bouwvak en avondwerk",
            body: "Geef vooraf aan of uw project in de bouwvak doorloopt en of er avond- of nachtwerk bij hoort.",
            icon: "season",
          },
        ],
      },
      legal: {
        title: "Uw plichten bij loon",
        accent: "en fysieke belasting",
        items: [
          {
            text: "Er geldt een gelijkwaardige beloning, dus de medewerker verdient niet minder dan uw eigen stratenmakers in dezelfde functie.",
          },
          {
            text: "Fysieke belasting mag volgens het Arbobesluit geen gevaar opleveren. U organiseert het werk zo dat hulpmiddelen het zware tillen beperken.",
          },
          {
            text: "In uw straatwerkplan legt u vooraf vast welk deel machinaal gaat en welk deel met de hand.",
          },
          {
            text: "De Arbeidsinspectie controleert straatwerk op fysieke belasting. Bij een overtreding kan zij het werk stilleggen en een boete opleggen.",
          },
        ],
        wttaLinkLabel: "Naar de uitleg over de Wtta",
      },
      faq: {
        title: "Vragen van opdrachtgevers",
        accent: "over stratenmakers inhuren",
        items: [
          {
            q: "Kunnen uw stratenmakers machinaal straten?",
            a: "Dat verschilt per kandidaat. U hoort vooraf of iemand ervaring heeft met een klem, vacuümunit of bestratingsmachine.",
            specific: true,
          },
          {
            q: "Wie levert de klem of de vacuümunit?",
            a: "Het materieel hoort bij uw werk, dus u levert het en geeft de instructie.",
            specific: true,
          },
          {
            q: "Mag er nog met de hand gestraat worden?",
            a: "Handwerk mag alleen waar het aantoonbaar niet anders kan. In de branche is machinaal of mechanisch straten het uitgangspunt.",
            specific: true,
          },
          {
            q: "Kan ik ook een opperman bestratingen aanvragen?",
            a: "Ja, u vraagt een stratenmaker, een opperman of allebei aan. Vertel ons hoe uw ploeg nu is samengesteld.",
            specific: true,
          },
          {
            // TODO claim replacement: vervanging bij uitval, met termijn
            q: "Wat doet Groos als een stratenmaker uitvalt?",
            a: "Valt iemand onverwacht uit, dan zoeken wij een vervanger met vergelijkbare ervaring. Wij bellen u over de stand van zaken.",
            specific: false,
            claim: "replacement",
          },
          {
            q: "Wat betaal ik voor een stratenmaker via Groos?",
            a: "Dat verschilt per functie, opperman of zelfstandig stratenmaker, en per project. U krijgt na de aanvraag een voorstel met het uurtarief.",
            specific: false,
          },
          {
            q: "Wat verdient de stratenmaker die bij mij werkt?",
            a: "De medewerker verdient minstens het loon van uw eigen mensen in dezelfde functie. Wie nieuw is in de bouw begint op een startloon.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Zelf werk zoeken als stratenmaker of opperman? De pagina voor werkzoekenden beschrijft het vak en het loon.",
        linkLabel: "Naar de pagina voor werkzoekenden",
      },
      cta: {
        title: "Moet er binnenkort bestrating",
        accent: "gelegd of hersteld worden?",
        body: "Beschrijf in uw aanvraag het werk, het aantal mensen en de startdatum. Ons team belt u daarna over ervaring en materieel.",
      },
    },
  },
  en: {
    jobseeker: {
      meta: {
        title: "Work as a street paver in The Hague",
        description:
          "Want to work as a street paver in The Hague? Read what the trade involves, what you earn and how to start as a paving labourer without experience.",
        keywords: [
          "street paver jobs",
          "street paver jobs the hague",
          "street paver salary",
          "paving labourer jobs",
          "paver jobs netherlands",
          "praca brukarz holandia",
        ],
      },
      hero: {
        title: "Work as a street paver in The Hague",
        lead: "As a street paver, you lay clay pavers and slabs, set kerbs and make sure rainwater runs off. You work outdoors in a crew, increasingly by machine.",
        facts: [{ label: "Without experience", value: "Start as a paving labourer" }],
      },
      work: {
        title: "From bedding sand to",
        accent: "a finished street",
        intro: "You make the end product, a street or pavement that lies flat.",
        tasks: [
          "Compacting and screeding the bedding sand",
          "Laying pavers and slabs in a pattern",
          "Setting kerbs and gullies to level",
          "Building in a fall for drainage",
          "Splitting or wet cutting blocks",
          "Machine laying with a clamp or vacuum lifter",
          "Compacting and sweeping in jointing sand",
        ],
        placesTitle: "Where you work",
        places: [
          "Streets, pavements and cycle paths",
          "Squares and car parks",
          "Trenches left by cable and pipe work",
        ],
      },
      requirements: {
        title: "What you bring",
        accent: "as a paver or labourer",
        items: [
          "Independent paving takes experience or vocational training (mbo)",
          "Without experience, you start as a paving labourer",
          "You like working outside, also bent over or kneeling",
          "Many jobs ask for a B driving licence",
        ],
        minAgeNote: "You work on building sites or beside the road, so the minimum age is 18.",
      },
      wage: {
        title: "From starting wage to",
        accent: "a skilled paver's pay",
        intro:
          "Coming from outside construction, you begin as a paving labourer on the starting wage. The second amount is for an experienced paver.",
        sourceLabel: "Bouw en Infra collective labour agreement (cao), wage tables of 1 January and 1 July 2026",
      },
      schedule: {
        title: "A paving crew's hours",
        accent: "through the year",
        items: [
          {
            title: "An early start",
            body: "You work on weekdays and start early, often at 07:00. Roadworks sometimes run in the evening or overnight.",
            icon: "early",
          },
          {
            title: "Frost and snow",
            body: "In frost or snow, paving work can come to a stop. Ask our team what that means for your hours.",
            icon: "weather",
          },
          {
            title: "Projects and summer break",
            body: "You often spend weeks or months on one site. Summer brings a three-week break (bouwvak).",
            icon: "calendar",
          },
        ],
      },
      certificates: {
        title: "Certificates and courses",
        accent: "for paving work",
        items: [
          {
            name: "VCA Basis",
            need: "often",
            body: "Almost every civil engineering contractor asks for this safety certificate. The exam is also available in English.",
          },
          {
            name: "Roadside safety course",
            need: "often",
            body: "You take this course before working next to traffic.",
          },
          {
            name: "Protective equipment",
            need: "always",
            body: "S3 work shoes, knee pads, gloves and hearing protection cost you nothing.",
          },
        ],
      },
      why: {
        title: "Paving work with clear agreements",
        accent: "on pay and equipment",
        items: [
          {
            title: "The hourly wage is listed",
            body: "Each advert gives the gross hourly wage. You get what a permanent colleague earns for that work.",
            icon: "wage",
          },
          {
            title: "Clear before you start",
            body: "You hear in advance where and when you start, and whether laying is by machine.",
            icon: "tools",
          },
          {
            title: "Our team on the phone",
            body: "Call or message our team with questions about the work.",
            icon: "phone",
          },
        ],
      },
      career: {
        title: "The route from labourer",
        accent: "to independent paver",
        steps: ["Paving labourer", "Street paver", "All-round paver", "Team leader"],
        note: "You learn the trade in the crew or through training alongside work.",
      },
      vacancies: {
        title: "Jobs for street pavers",
        accent: "and labourers in The Hague",
        emptyTitle: "No paving jobs right now",
        emptyBody: "Register anyway. When a paving crew needs someone, we call you.",
      },
      faq: {
        title: "Questions about the trade",
        accent: "of paver and labourer",
        items: [
          {
            q: "Can I become a paver without experience?",
            a: "Yes, you start as a paving labourer and learn the trade in the crew. Working independently takes experience or training.",
            specific: true,
          },
          {
            q: "Do I lay every block by hand?",
            a: "No, machine laying is the norm, so a machine or clamp lifts the blocks. Hand laying remains where nothing else works, and you still bend and kneel.",
            specific: true,
          },
          {
            q: "Do I need a diploma for paving?",
            a: "No, the law does not require one. Companies do ask for experience or vocational training (mbo level 2 or 3).",
            specific: true,
          },
          {
            q: "Do I need VCA for paving work?",
            a: "Usually yes. The advert says whether you also need the roadside safety course.",
            specific: true,
          },
          {
            q: "How long do I stay on the starting wage?",
            a: "It applies for one year at most and only to newcomers in construction. After that, the wage for your job applies.",
            specific: true,
          },
          {
            q: "Can you help me get VCA or the roadside safety course?",
            a: "Yes, we help you get VCA Basis and the roadside safety course. We agree in advance when the course takes place and who pays for it.",
            specific: true,
            claim: "certificateSupport",
          },
          {
            q: "How do I get to the site without a car?",
            a: "If a site is hard to reach by bus or tram, we arrange transport there. The job advert tells you how to get to the site.",
            specific: true,
            claim: "transport",
          },
          {
            q: "Do I have to pay to register?",
            a: "No, registering and applying are free, and no CV is needed.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Need street pavers for a paving company or civil engineering project? Read how hiring through Groos works.",
        linkLabel: "Go to the page for employers",
      },
      cta: {
        title: "Will you be laying pavers",
        accent: "in and around The Hague?",
        body: "Apply or leave your details. Our team calls you about paving work that suits you.",
      },
    },
    employer: {
      meta: {
        title: "Hire street pavers in The Hague",
        description:
          "Do you need street pavers or paving labourers in and around The Hague? Groos discusses experience, machine laying and roadside safety with you in advance.",
        keywords: [
          "hire street pavers",
          "street pavers the hague",
          "paving crew hire",
          "paving labourers hire",
          "employment agency paving the hague",
        ],
        serviceType: "Temporary staffing of street pavers",
      },
      hero: {
        title: "Street pavers and paving labourers for your project in The Hague",
        lead: "You need a paver who can lay a section independently, or a labourer for your crew. We discuss each candidate's experience and the laying method in advance.",
      },
      supply: {
        title: "Paving work our people",
        accent: "carry out for you",
        intro: "A paver finishes the job, and a paving labourer brings in materials and does the groundwork.",
        tasks: [
          "Compacting and screeding the bedding sand",
          "Laying in a pattern, by hand or machine",
          "Setting kerbs with a clamp or vacuum lifter",
          "Setting gullies and inspection chambers to level",
          "Splitting or wet cutting blocks",
          "Compacting, sweeping in sand and handing over clean",
          "Relaying after sewer, cable and pipe work",
        ],
        clientsTitle: "For these clients",
        clients: [
          "Paving contractors adding to a crew",
          "Contractors on sewer replacement and street redesign",
          "Cable and pipeline contractors with trenches to relay",
        ],
      },
      why: {
        title: "Paving to your plan,",
        accent: "by machine where possible",
        items: [
          {
            title: "Experience discussed per candidate",
            body: "We ask each candidate about laying patterns, setting kerbs and machine laying. You hear in advance what someone can do independently.",
            icon: "person",
          },
          {
            title: "Safe next to traffic",
            body: "For each candidate, we discuss VCA Basis and the roadside safety course.",
            icon: "safety",
          },
          {
            title: "Your equipment, your instruction",
            body: "You provide the clamp, vacuum lifter or paving machine and give instruction on it. We agree beforehand which part is laid by machine.",
            icon: "tools",
          },
          {
            title: "One team for your planning",
            body: "You call our team about hours, weather and the next phase.",
            icon: "phone",
          },
        ],
      },
      certificates: {
        title: "Paperwork for paving",
        accent: "in public space",
        items: [
          {
            name: "VCA Basis",
            need: "often",
            body: "Most civil engineering contractors ask for this basic safety certificate.",
          },
          {
            name: "Roadside safety course",
            need: "often",
            body: "This course is for anyone working next to traffic. We tell you beforehand if the candidate has taken it.",
          },
          {
            name: "Personal protective equipment",
            need: "always",
            body: "S3 work shoes, knee pads, gloves and hearing and respiratory protection cost the worker nothing.",
          },
        ],
      },
      planning: {
        title: "Staffing per phase,",
        accent: "also in frost and summer break",
        items: [
          {
            title: "One site for weeks or months",
            body: "Paving runs per project and per phase, often for weeks or months.",
            icon: "calendar",
          },
          {
            title: "Frost and snow",
            body: "In frost or snow, the work can stop. You let us know whether the crew starts.",
            icon: "weather",
          },
          {
            title: "Summer break and evening work",
            body: "Tell us in advance whether your project runs through the summer break (bouwvak) or includes evening or night work.",
            icon: "season",
          },
        ],
      },
      legal: {
        title: "Your duties on pay",
        accent: "and physical strain",
        items: [
          {
            text: "Equivalent pay applies, so the worker earns no less than your own pavers in the same role.",
          },
          {
            text: "Under the Working Conditions Decree (Arbobesluit), physical strain must not put workers at risk. You organise the work so that lifting aids limit heavy lifting.",
          },
          {
            text: "In your paving work plan (straatwerkplan), you record in advance which part is laid by machine and which by hand.",
          },
          {
            text: "The Netherlands Labour Authority checks paving work for physical strain. In case of a breach, it can stop the work and impose a fine.",
          },
        ],
        wttaLinkLabel: "Go to the Wtta explanation",
      },
      faq: {
        title: "Questions from clients",
        accent: "about hiring street pavers",
        items: [
          {
            q: "Can your street pavers lay by machine?",
            a: "That differs per candidate. You hear in advance whether someone has experience with a clamp, vacuum lifter or paving machine.",
            specific: true,
          },
          {
            q: "Who provides the clamp or vacuum lifter?",
            a: "The equipment belongs to your site, so you provide it and give the instruction.",
            specific: true,
          },
          {
            q: "Is laying by hand still allowed?",
            a: "Hand laying is only allowed where there is demonstrably no other way. Machine or mechanical laying is the starting point in the sector.",
            specific: true,
          },
          {
            q: "Can I also request a paving labourer?",
            a: "Yes, you can request a paver, a labourer or both. Tell us how your crew is made up now.",
            specific: true,
          },
          {
            q: "What does Groos do if a paver drops out?",
            a: "If someone drops out unexpectedly, we look for a replacement with similar experience. We call you about where things stand.",
            specific: false,
            claim: "replacement",
          },
          {
            q: "What do I pay for a street paver through Groos?",
            a: "That differs per role, paving labourer or independent paver, and per project. After your request, you get a proposal stating the hourly rate.",
            specific: false,
          },
          {
            q: "What does the paver working for me earn?",
            a: "The worker earns at least the wage of your own people in the same role. Newcomers to construction begin on a starting wage.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Are you looking for paving work yourself? The page for job seekers describes the trade and the pay.",
        linkLabel: "Go to the page for job seekers",
      },
      cta: {
        title: "Does paving need laying",
        accent: "or repairing soon?",
        body: "In your request, describe the work, the crew you need and the start date. Our team then calls you about experience and equipment.",
      },
    },
  },
} satisfies BeroepContent;
