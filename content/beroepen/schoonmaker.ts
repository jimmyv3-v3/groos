import type { BeroepContent } from "@/content/beroepen/types";

export const schoonmaker = {
  id: "schoonmaker",
  wage: {
    starter: { min: 15.52, max: 16.08 },
    experienced: { min: 17.05, max: 17.7 },
    tableDate: "2026-01-01",
    checkedAt: "2026-10-02",
    reviewBy: "2027-01-01",
    sourceUrl: "https://www.schoonmakendnederland.nl/kennisbank/artikel/2025/11/03/cao-loon-gaat-per-1-januari-2026-omhoog-dit-zijn-de-nieuwe-loontabellen",
  },
  minAge18: null,
  nl: {
    jobseeker: {
      meta: {
        title: "Werken als schoonmaker in Den Haag",
        description:
          "Wil je werken als schoonmaker in Den Haag, in de ochtend, de avond of het weekend? Lees wat je verdient en hoe je begint. Solliciteren kan zonder cv.",
        keywords: [
          "schoonmaker vacature den haag",
          "schoonmaak vacature den haag",
          "schoonmaakwerk ochtend",
          "schoonmaakwerk avond",
          "schoonmaakwerk weekend",
          "schoonmaakwerk bijbaan",
          "opleveringsschoonmaak vacature",
        ],
      },
      hero: {
        title: "Werken als schoonmaker in Den Haag",
        lead: "Als schoonmaker houd je kantoren, scholen, hotels en nieuwe woningen in Den Haag schoon. Je werkt vaak vroeg, in de avond of in het weekend.",
        facts: [
          { label: "Werktijden", value: "Ochtend, avond of weekend" },
          { label: "Diploma", value: "Niet nodig" },
        ],
      },
      work: {
        title: "Zo ziet schoonmaakwerk eruit",
        accent: "in de ochtend en avond",
        intro: "Je werkt meestal een paar uur op één adres, vaak alleen.",
        tasks: [
          "Bureaus en deurklinken afnemen",
          "Toiletten schoonmaken en papier bijvullen",
          "Stofzuigen en dweilen, soms met een machine",
          "Trappenhuizen van woongebouwen bijhouden",
          "Bouwstof weghalen in een nieuw huis",
        ],
        placesTitle: "Waar je schoonmaakt",
        places: ["Kantoren en scholen", "Zorginstellingen en hotels", "Nieuwe woningen na de bouw"],
      },
      requirements: {
        title: "Wat je meebrengt voor",
        accent: "schoonmaakwerk",
        items: [
          "Je werkt zelfstandig, vaak alleen",
          "Je kunt vroeg of laat op de dag werken",
          "Je spreekt genoeg Nederlands of Engels voor instructies",
          "Je staat en loopt bijna de hele dienst",
        ],
      },
      wage: {
        title: "Dit verdien je met",
        accent: "schoonmaakwerk in Den Haag",
        intro: "Je verdient minstens hetzelfde als een vaste schoonmaker bij het bedrijf waar je werkt.",
        sourceLabel: "loontabel van de cao Schoonmaak- en Glazenwassersbedrijf, loongroep 1 en 2, per 1 januari 2026",
        extra: "Voor heel vroege uren, late uren en weekenduren gelden vaak toeslagen.",
      },
      schedule: {
        title: "Werktijden die vaak buiten",
        accent: "kantoortijd vallen",
        items: [
          {
            title: "Ochtend of avond",
            body: "Kantoren maak je meestal schoon van 05.00 tot 09.00 uur of van 17.00 tot 22.00 uur.",
            icon: "clock",
          },
          {
            title: "Drukke weken",
            body: "Scholen krijgen in de zomervakantie een grote schoonmaak, dus dan is er extra werk.",
            icon: "season",
          },
          {
            title: "Het hele jaar binnen",
            body: "Je werkt binnen, dus regen, wind of kou verandert je rooster niet.",
            icon: "weather",
          },
        ],
      },
      // TODO bevestigen: geldt de RAS-basisvakopleiding Schoonmaak (cao, binnen 12 maanden, kosteloos en in werktijd) ook voor uitzendkrachten via Groos? Pas na bevestiging als item toevoegen, zonder belofte over wie hem regelt.
      certificates: {
        title: "Papieren die",
        accent: "soms nodig zijn",
        items: [
          {
            name: "VOG",
            need: "sometimes",
            body: "Een VOG is een verklaring van de overheid over je gedrag. Je vraagt hem aan bij de gemeente.",
          },
          {
            name: "VCA Basis",
            need: "sometimes",
            body: "VCA is een diploma voor veilig werken op een bouwplaats. Je haalt het met een cursus en een examen.",
          },
        ],
      },
      why: {
        title: "Uren die passen bij",
        accent: "je eigen week",
        items: [
          {
            title: "Vooraf weten wat je verdient",
            body: "Bij elke vacature staan het bruto uurloon en de werktijden, dus je ziet of het past.",
            icon: "wage",
          },
          {
            title: "Eén vaste contactpersoon",
            body: "Wil je meer uren of andere tijden, bel dan ons team.",
            icon: "phone",
          },
          {
            title: "Gratis handschoenen en werkschoenen",
            body: "Je betaalt nooit zelf voor handschoenen of werkschoenen die je voor het werk nodig hebt.",
            icon: "shield",
          },
        ],
      },
      career: {
        title: "Doorgroeien van schoonmaker",
        accent: "naar objectleider",
        steps: ["Schoonmaker", "Allround schoonmaker", "Vloerenspecialist", "Meewerkend teamleider", "Objectleider"],
        note: "Met ervaring kun je vloeren met machines behandelen of een team leiden.",
      },
      vacancies: {
        title: "Schoonmaakvacatures in Den Haag",
        accent: "die nu openstaan",
        emptyTitle: "Er staat nu geen schoonmaakwerk open",
        emptyBody: "Schoonmaakwerk komt vaak kort voor de start binnen. Schrijf je in, dan bellen wij je als er werk is.",
      },
      faq: {
        title: "Wat schoonmakers ons",
        accent: "vaak vragen",
        items: [
          {
            q: "Kan ik alleen 's ochtends of 's avonds werken?",
            a: "Ja, vaak wel. Veel kantoren laten schoonmaken als er niemand is. Vertel ons welke tijden je kunt, dan zoeken wij werk dat past.",
            specific: true,
          },
          {
            q: "Kan ik meer uren krijgen door adressen te combineren?",
            a: "Soms wel. Twee adressen dicht bij elkaar geven samen een langere werkdag. Wij kijken met je mee, maar het aantal uren verschilt.",
            specific: true,
          },
          {
            q: "Heb ik een VOG nodig?",
            a: "Dat hangt van het adres af. Scholen en zorginstellingen vragen vaak een VOG, kantoren meestal niet. Als het nodig is, staat het in de vacature.",
            specific: true,
          },
          {
            q: "Krijg ik extra geld voor avond- of weekendwerk?",
            a: "Vaak wel. Voor heel vroege uren, late uren en weekenduren krijg je meestal een toeslag. De hoogte hangt af van het bedrijf.",
            specific: true,
          },
          {
            q: "Werk ik alleen of met collega's?",
            a: "Dat verschilt per adres. In een kantoor werk je vaak alleen. Bij een oplevering of in een hotel werk je in een groep.",
            specific: true,
          },
          {
            q: "Moet ik een cv hebben?",
            a: "Nee, een cv is niet nodig. Heb je eerder schoongemaakt, in een hotel of bij mensen thuis, vertel dat dan aan de telefoon.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Personeel zoeken voor een schoonmaakbedrijf? Lees wat Groos voor opdrachtgevers doet.",
        linkLabel: "Naar de pagina voor werkgevers",
      },
      cta: {
        title: "Zoek je schoonmaakwerk",
        accent: "dat bij je dag past?",
        body: "Solliciteer op een vacature of schrijf je in met je naam en telefoonnummer. Daarna hoor je van ons.",
      },
    },
    employer: {
      meta: {
        title: "Schoonmakers inhuren in Den Haag",
        description:
          "Zoekt u schoonmakers voor uw bedrijf, hotel of school in Den Haag? Groos levert mensen voor een dag, een paar weken of langer. Vraag vrijblijvend personeel aan.",
        keywords: [
          "schoonmakers inhuren den haag",
          "schoonmaakpersoneel den haag",
          "uitzendbureau den haag schoonmaak",
          "opleveringsschoonmaak personeel",
          "interieurverzorger inhuren",
          "uitzendkracht schoonmaak",
        ],
        serviceType: "Uitzenden van schoonmakers",
      },
      hero: {
        title: "Schoonmaakpersoneel voor uw bedrijf in Den Haag",
        lead: "U zoekt schoonmakers voor vroege of late diensten, de vakantieperiode of een oplevering. Wij zoeken de mensen en stemmen het object, de werktijden en de startdatum vooraf met u af.",
      },
      supply: {
        title: "Wat onze schoonmakers",
        accent: "op uw objecten doen",
        intro: "Wij bespreken vooraf per object de ruimtes, de middelen en de tijden.",
        tasks: [
          "Bureaus, vloeren en sanitair reinigen volgens uw werkprogramma",
          "Pantry's schoonmaken en voorraden bijvullen",
          "Algemene ruimtes en trappenhuizen bijhouden",
          "Bouwstof en kitresten verwijderen bij een oplevering",
          "Hotelkamers opmaken en gangen schoonhouden",
        ],
        clientsTitle: "Voor wie wij schoonmakers zoeken",
        clients: [
          "Schoonmaakbedrijven met vaste objecten",
          "Hotels en zorginstellingen",
          "Scholen en kinderopvang",
          "Woningcorporaties en VvE-beheerders",
          "Bouwbedrijven voor opleveringen",
        ],
      },
      why: {
        title: "Schoonmakers die passen bij",
        accent: "uw objecten en tijden",
        items: [
          {
            title: "Afspraken per object",
            body: "Wij noteren vooraf per object de ronde, de sleutelafspraken en de middelen voor de medewerker.",
            icon: "handshake",
          },
          {
            title: "Eén vast team",
            body: "U heeft contact met ons team, ook als het rooster op een object verandert.",
            icon: "phone",
          },
          {
            title: "Kandidaten die zelfstandig werken",
            body: "Bij elk voorstel hoort u waar de kandidaat eerder schoonmaakte en of dat alleen was.",
            icon: "shield",
          },
          {
            title: "Vroege en late diensten",
            body: "Wij zoeken mensen die om 05.00 uur kunnen beginnen of tot 22.00 uur kunnen werken.",
            icon: "calendar",
          },
        ],
      },
      // TODO bevestigen: geldt de RAS-basisvakopleiding Schoonmaak voor uitzendkrachten via Groos, en wie regelt hem? Pas daarna als item toevoegen.
      certificates: {
        title: "Certificaten die wij",
        accent: "per kandidaat bespreken",
        intro: "Voor schoonmaakwerk is geen diploma nodig. Welke papieren uw object vraagt, bespreken wij per kandidaat.",
        items: [
          {
            name: "VOG",
            need: "sometimes",
            body: "Scholen, zorginstellingen en ambassades vragen vaak een Verklaring Omtrent het Gedrag. De kandidaat vraagt die zelf aan.",
          },
          {
            name: "VCA Basis",
            need: "sometimes",
            body: "Dit certificaat is vaak een eis bij opleveringsschoonmaak op een bouwplaats. Wij melden per kandidaat of het er al is.",
          },
        ],
      },
      planning: {
        title: "Wanneer opdrachtgevers",
        accent: "extra schoonmakers inzetten",
        items: [
          {
            title: "Drukke periodes",
            body: "Scholen krijgen in de zomervakantie een grote schoonmaak, en rond de maandwisseling komt schoonmaak bij einde huur.",
            icon: "season",
          },
          {
            title: "Vroeg, laat en weekend",
            body: "Kantoorschoonmaak loopt meestal van 05.00 tot 09.00 uur of van 17.00 tot 22.00 uur.",
            icon: "clock",
          },
          {
            title: "Duur van de inzet",
            body: "U zet een schoonmaker in voor één oplevering, een vakantieperiode of een ronde van maanden.",
            icon: "calendar",
          },
        ],
      },
      legal: {
        title: "Zo zijn loon en veiligheid",
        accent: "wettelijk geregeld",
        items: [
          {
            text: "Volgens de wet krijgt de medewerker gelijkwaardige beloning, dus een pakket dat minstens even goed is als dat van uw eigen schoonmakers.",
          },
          {
            text: "U zorgt als inlener voor instructie over de schoonmaakmiddelen en voor een veilige werkplek, zoals de Arbowet vraagt.",
          },
          {
            text: "Als inlener kunt u aansprakelijk zijn voor loonheffingen die niet zijn afgedragen. Wij leggen bij de aanvraag uit hoe dat werkt.",
          },
        ],
        wttaLinkLabel: "Wat de Wtta voor u betekent",
      },
      faq: {
        title: "Vragen van opdrachtgevers",
        accent: "in de schoonmaak",
        items: [
          // TODO bevestigen (jurist, cao Schoonmaak 2026-2028): de 7,5 procent-regel voor bedrijven vanaf € 10 miljoen omzet en de inleenduur van 12 maanden. Tot die tijd geen getallen in het antwoord.
          {
            q: "Mag ik als groot schoonmaakbedrijf uitzendkrachten inzetten?",
            a: "Ja, dat mag, maar de cao van de schoonmaakbranche kan het aandeel uitzenduren en de duur van een inzet beperken. Wij bespreken vooraf welke regels voor uw bedrijf gelden.",
            specific: true,
          },
          {
            q: "Heeft de medewerker een VOG?",
            a: "Dat verschilt per kandidaat. Vraagt uw object een VOG, dan nemen wij dat op in de aanvraag en hoort u vooraf of de kandidaat die al heeft.",
            specific: true,
          },
          {
            q: "Werken uw mensen ook vroeg of laat?",
            a: "Ja, schoonmaakwerk valt meestal buiten kantoortijd. Wij stellen alleen kandidaten voor die op de tijden van uw object kunnen werken.",
            specific: true,
          },
          {
            q: "Kunt u vervanging leveren bij ziekte?",
            a: "Ja, valt een schoonmaker op uw object uit door ziekte of vakantie, dan zoeken wij een vervanger en houden wij u op de hoogte.",
            specific: true,
            claim: "replacement",
          },
          {
            q: "Kan een schoonmaker meerdere objecten op een dag doen?",
            a: "Ja, als de objecten dicht bij elkaar liggen en de tijden op elkaar aansluiten. Wij kijken bij de aanvraag of zo'n combinatie past.",
            specific: true,
          },
          {
            q: "Wat kost een schoonmaker via Groos?",
            a: "Het tarief hangt af van het aantal uren, de werktijden, het object en de duur van de inzet. Na uw aanvraag krijgt u een voorstel met een helder uurtarief.",
            specific: false,
          },
          {
            q: "Wie is mijn contactpersoon bij Groos?",
            a: "U heeft contact met ons team. Wij nemen de aanvraag met u door en blijven daarna uw vaste aanspreekpunt.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Zelf werk zoeken als schoonmaker? Op de pagina voor werkzoekenden staat alles over het werk.",
        linkLabel: "Naar de pagina voor werkzoekenden",
      },
      cta: {
        title: "Een schoonmaker nodig",
        accent: "voor vervanging of oplevering?",
        body: "Vertel ons om welk object het gaat, op welke tijden en vanaf wanneer. Wij nemen contact met u op en stellen kandidaten voor.",
      },
    },
  },
  en: {
    jobseeker: {
      meta: {
        title: "Work as a cleaner in The Hague",
        description:
          "Do you want to work as a cleaner in The Hague, in the morning, the evening or at weekends? Read what you earn and how to start. You can apply without a CV.",
        keywords: [
          "cleaner jobs the hague",
          "cleaning jobs the hague",
          "early morning cleaning job",
          "evening cleaning job",
          "weekend cleaning job",
          "part time cleaning job",
          "post construction cleaning job",
        ],
      },
      hero: {
        title: "Work as a cleaner in The Hague",
        lead: "As a cleaner, you keep offices, schools, hotels and new homes in The Hague clean. You often work early, in the evening or at weekends.",
        facts: [
          { label: "Working hours", value: "Morning, evening or weekend" },
          { label: "Diploma", value: "Not needed" },
        ],
      },
      work: {
        title: "What cleaning work looks like",
        accent: "in the morning and evening",
        intro: "You usually work a few hours at one address, often alone.",
        tasks: [
          "Wipe desks and door handles",
          "Clean toilets and refill paper",
          "Vacuum and mop, sometimes with a machine",
          "Keep stairwells of apartment buildings clean",
          "Remove building dust in a new home",
        ],
        placesTitle: "Where you clean",
        places: ["Offices and schools", "Care homes and hotels", "New homes after building work"],
      },
      requirements: {
        title: "What you bring to",
        accent: "cleaning work",
        items: [
          "You work independently, often alone",
          "You can work early or late in the day",
          "You speak enough Dutch or English for instructions",
          "You stand and walk for almost the whole shift",
        ],
      },
      wage: {
        title: "What you earn with",
        accent: "cleaning work in The Hague",
        intro: "You earn at least the same as a permanent cleaner at the company where you work.",
        sourceLabel: "pay table of the cleaning and window cleaning collective labour agreement (cao), pay groups 1 and 2, 1 January 2026",
        extra: "Extra pay often applies for very early, late and weekend hours.",
      },
      schedule: {
        title: "Working hours that are often",
        accent: "outside office hours",
        items: [
          {
            title: "Morning or evening",
            body: "You usually clean offices from 05:00 to 09:00 or from 17:00 to 22:00.",
            icon: "clock",
          },
          {
            title: "Busy weeks",
            body: "Schools get a big clean in the summer holiday, so there is extra work then.",
            icon: "season",
          },
          {
            title: "Indoors all year",
            body: "You work indoors, so rain, wind or cold does not change your schedule.",
            icon: "weather",
          },
        ],
      },
      // TODO confirm: does the RAS basic cleaning course (cao) apply to temporary workers through Groos? Add as an item only after confirmation.
      certificates: {
        title: "Papers that",
        accent: "are sometimes needed",
        items: [
          {
            name: "VOG (certificate of conduct)",
            need: "sometimes",
            body: "A VOG is a statement from the Dutch government about your conduct. You apply for it at your municipality.",
          },
          {
            name: "VCA Basis",
            need: "sometimes",
            body: "The VCA safety certificate is for working safely on a building site. You get it with a course and an exam.",
          },
        ],
      },
      why: {
        title: "Hours that fit",
        accent: "your own week",
        items: [
          {
            title: "Know your pay in advance",
            body: "Every job shows the gross hourly wage and the working hours, so you can see if it fits.",
            icon: "wage",
          },
          {
            title: "One regular contact person",
            body: "If you want more hours or different times, call our team.",
            icon: "phone",
          },
          {
            title: "Free gloves and work shoes",
            body: "You never pay for the gloves or work shoes you need for the work.",
            icon: "shield",
          },
        ],
      },
      career: {
        title: "Grow from cleaner",
        accent: "to site supervisor",
        steps: ["Cleaner", "All round cleaner", "Floor care specialist", "Working team leader", "Site supervisor"],
        note: "With experience you can treat floors with machines or lead a team.",
      },
      vacancies: {
        title: "Cleaning jobs in The Hague",
        accent: "that are open now",
        emptyTitle: "No cleaning work open right now",
        emptyBody: "Cleaning work often comes in shortly before the start. Register with us and we will call you when there is work.",
      },
      faq: {
        title: "What cleaners",
        accent: "often ask us",
        items: [
          {
            q: "Can I work only in the morning or evening?",
            a: "Yes, often. Many offices are cleaned when nobody is there. Tell us which times you can work, and we will look for work that fits.",
            specific: true,
          },
          {
            q: "Can I get more hours by combining addresses?",
            a: "Sometimes, yes. Two addresses close together can make a longer working day. We look at it with you, but the hours differ.",
            specific: true,
          },
          {
            q: "Do I need a VOG?",
            a: "That depends on the address. Schools and care homes often ask for a VOG, offices usually do not. If you need one, the job says so.",
            specific: true,
          },
          {
            q: "Do I get extra pay for evening or weekend work?",
            a: "Often, yes. For very early, late and weekend hours you usually get extra pay. The amount depends on the company.",
            specific: true,
          },
          {
            q: "Do I work alone or with colleagues?",
            a: "That differs per address. In an office you often work alone. On a new build site or in a hotel you work in a group.",
            specific: true,
          },
          {
            q: "Do I need a CV?",
            a: "No, you do not need a CV. If you have cleaned before, in a hotel or in people's homes, tell us on the phone.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Looking for staff for a cleaning company? Read what Groos does for clients.",
        linkLabel: "Go to the page for employers",
      },
      cta: {
        title: "Looking for cleaning work",
        accent: "that fits your day?",
        body: "Apply for a job or register with your name and phone number. After that, you will hear from us.",
      },
    },
    employer: {
      meta: {
        title: "Hire cleaners in The Hague",
        description:
          "Do you need cleaners for your company, hotel or school in The Hague? Groos supplies people for a day, a few weeks or longer. Request staff without obligation.",
        keywords: [
          "hire cleaners the hague",
          "cleaning staff the hague",
          "employment agency cleaning the hague",
          "post construction cleaning staff",
          "temporary office cleaners",
          "temporary cleaning staff",
        ],
        serviceType: "Supplying temporary cleaners",
      },
      hero: {
        title: "Cleaning staff for your company in The Hague",
        lead: "You need cleaners for early or late shifts, the holiday period or a handover clean. We find the people and agree the site, the working hours and the start date with you in advance.",
      },
      supply: {
        title: "What our cleaners",
        accent: "do at your sites",
        intro: "We discuss the rooms, products and times for each site in advance.",
        tasks: [
          "Cleaning desks, floors and toilets according to your work schedule",
          "Cleaning kitchens and restocking supplies",
          "Maintaining shared areas and stairwells",
          "Removing building dust and sealant residue at handover",
          "Making up hotel rooms and keeping corridors clean",
        ],
        clientsTitle: "Who we find cleaners for",
        clients: [
          "Cleaning companies with regular sites",
          "Hotels and care institutions",
          "Schools and childcare",
          "Housing associations and property managers",
          "Builders needing handover cleaning",
        ],
      },
      why: {
        title: "Cleaners who fit",
        accent: "your sites and hours",
        items: [
          {
            title: "Arrangements for each site",
            body: "For each site we note the round, the key arrangements and the products for the worker in advance.",
            icon: "handshake",
          },
          {
            title: "Two regular contact persons",
            body: "You deal with our team, also when the schedule at a site changes.",
            icon: "phone",
          },
          {
            title: "Candidates who work independently",
            body: "With every proposal you hear where the candidate cleaned before and whether that was alone.",
            icon: "shield",
          },
          {
            title: "Early and late shifts",
            body: "We look for people who can start at 05:00 or work until 22:00.",
            icon: "calendar",
          },
        ],
      },
      // TODO confirm: does the RAS basic cleaning course apply to temporary workers through Groos, and who arranges it? Add as an item only after that.
      certificates: {
        title: "Certificates we discuss",
        accent: "for each candidate",
        intro: "Cleaning work does not require a diploma. We discuss the papers your site asks for candidate by candidate.",
        items: [
          {
            name: "VOG",
            need: "sometimes",
            body: "Schools, care institutions and embassies often ask for a certificate of conduct (VOG). The candidate applies for it personally.",
          },
          {
            name: "VCA Basis",
            need: "sometimes",
            body: "The VCA safety certificate is often required for handover cleaning on a building site. We state for each candidate whether they hold it.",
          },
        ],
      },
      planning: {
        title: "When clients bring in",
        accent: "extra cleaners",
        items: [
          {
            title: "Busy periods",
            body: "Schools get a big clean in the summer holiday, and end of tenancy cleaning peaks around the turn of the month.",
            icon: "season",
          },
          {
            title: "Early, late and weekend",
            body: "Office cleaning usually runs from 05:00 to 09:00 or from 17:00 to 22:00.",
            icon: "clock",
          },
          {
            title: "Length of the assignment",
            body: "You bring in a cleaner for one handover, a holiday period or a round lasting months.",
            icon: "calendar",
          },
        ],
      },
      legal: {
        title: "How pay and safety",
        accent: "are set by law",
        items: [
          {
            text: "By law, the worker receives equivalent pay, which means a package at least as good as that of your own cleaners.",
          },
          {
            text: "As the hirer, you provide instructions about the cleaning products and a safe workplace, as the Working Conditions Act (Arbowet) requires.",
          },
          {
            text: "As the hirer, you can be liable for payroll taxes that have not been paid. When you make a request, we explain how this works.",
          },
        ],
        wttaLinkLabel: "What the Wtta means for you",
      },
      faq: {
        title: "Questions from clients",
        accent: "in the cleaning sector",
        items: [
          // TODO confirm (lawyer, cleaning cao 2026 to 2028): the 7.5 percent rule for companies with a turnover of €10 million or more and the 12 month hiring limit. No figures in the answer until then.
          {
            q: "Can a large cleaning company use temporary workers?",
            a: "Yes, but the collective labour agreement (cao) of the cleaning sector can limit the share of temporary hours and the length of an assignment. We discuss the rules for your company in advance.",
            specific: true,
          },
          {
            q: "Does the worker have a VOG?",
            a: "That differs per candidate. If your site asks for a VOG, we include it in the request and you hear in advance whether the candidate has one.",
            specific: true,
          },
          {
            q: "Do your people also work early or late?",
            a: "Yes, cleaning work usually falls outside office hours. We only propose candidates who can work at the times of your site.",
            specific: true,
          },
          {
            q: "Can you provide a replacement in case of illness?",
            a: "Yes, if a cleaner at your site drops out because of illness or holiday, we look for a replacement and keep you informed.",
            specific: true,
            claim: "replacement",
          },
          {
            q: "Can one cleaner cover several sites in a day?",
            a: "Yes, if the sites are close together and the times connect. When you make a request, we check whether such a combination works.",
            specific: true,
          },
          {
            q: "What does a cleaner through Groos cost?",
            a: "The rate depends on the number of hours, the working hours, the site and the length of the assignment. After your request, you receive a proposal with a clear hourly rate.",
            specific: false,
          },
          {
            q: "Who is my contact person at Groos?",
            a: "You deal with our team. We go through the request with you and remain your regular point of contact after that.",
            specific: false,
          },
        ],
      },
      perspective: {
        text: "Looking for work as a cleaner yourself? The page for job seekers has everything about the work.",
        linkLabel: "Go to the page for job seekers",
      },
      cta: {
        title: "Need a cleaner",
        accent: "for cover or a handover?",
        body: "Tell us which site it is, at what times and from when. We will contact you and propose candidates.",
      },
    },
  },
} satisfies BeroepContent;
