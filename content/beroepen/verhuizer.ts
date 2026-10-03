import type { BeroepContent } from "@/content/beroepen/types";

export const verhuizer = {
  id: "verhuizer",
  wage: {
    starter: { min: 14.99, max: 16 },
    experienced: { min: 16, max: 20 },
    tableDate: "2026-07-01",
    checkedAt: "2026-10-02",
    reviewBy: "2027-01-01",
    sourceUrl: "https://www.caoberoepsgoederenvervoer.nl/tln-functieloonschalen-per-1-januari-2026/",
  },
  minAge18: null,
  nl: {
    jobseeker: {
      meta: {
        title: "Werken als verhuizer in Den Haag",
        description:
          "Wil je werken als verhuizer in Den Haag? Lees wat het werk inhoudt, wat je verdient en waarom de maandwisseling druk is. Solliciteren kan zonder cv.",
        keywords: [
          "verhuizer vacatures den haag",
          "verhuizer vacatures",
          "werken als verhuizer",
          "bijrijder vacatures den haag",
          "verhuisbedrijf vacatures",
          "sjouwer vacature",
          "verhuishulp bijbaan",
          "chauffeur verhuiswagen vacature",
        ],
      },
      hero: {
        title: "Werken als verhuizer in Den Haag",
        lead: "Als verhuizer pak je spullen in en draag je meubels van het oude naar het nieuwe adres. Je begint vroeg en werkt in een ploeg.",
        facts: [
          { label: "Werktijden", value: "Start om 07.00 uur of eerder" },
          { label: "Diploma", value: "Niet nodig" },
        ],
      },
      work: {
        title: "Een werkdag",
        accent: "als verhuizer",
        tasks: [
          "Dozen inpakken, labelen en weer uitpakken",
          "Kasten en bedden uit elkaar halen en weer opbouwen",
          "Meubels en dozen dragen, ook via smalle trappen",
          "Een verhuislift bedienen nadat je uitleg hebt gekregen",
          "Naast de chauffeur meerijden en helpen met inparkeren",
        ],
        placesTitle: "Waar je werkt",
        places: ["Woningen in en rond Den Haag", "Kantoren, scholen en archieven", "Huizen van expats en diplomaten"],
      },
      requirements: {
        title: "Wat je meebrengt",
        accent: "als verhuizer",
        items: [
          "Je kunt de hele dag tillen en dragen, ook op trappen",
          "Je werkt netjes in het huis van een ander",
          "Rijbewijs B alleen als je de verhuisbus rijdt",
        ],
      },
      // TODO bevestigen: in welke TLN-functieloonschaal (A, B of C) verhuizers en bijrijders vallen (context/01 §Te verifiëren).
      wage: {
        title: "Dit verdien je",
        accent: "met verhuiswerk",
        intro: "Het precieze bruto uurloon staat bij elke vacature.",
        sourceLabel:
          "functieloonschalen van de cao Beroepsgoederenvervoer per 1 januari 2026 en het wettelijk minimumloon per 1 juli 2026",
        extra: "Voor overuren en werk op zaterdag gelden vaak toeslagen.",
      },
      schedule: {
        title: "Vroeg beginnen en",
        accent: "drukke maandwisselingen",
        items: [
          {
            title: "Je dag begint vroeg",
            body: "Je start meestal om 07.00 uur bij de wagen, en de dag duurt zo lang als de klus.",
            icon: "clock",
          },
          {
            title: "Het drukst in de zomer",
            body: "In de zomer en aan het eind van elke maand is er het meeste verhuiswerk.",
            icon: "season",
          },
          {
            title: "Ook bij regen of kou",
            body: "Een verhuizing gaat ook door als het regent of vriest, dus neem kleding voor nat weer mee.",
            icon: "weather",
          },
        ],
      },
      // TODO claim certificateSupport: "Wil je rijbewijs BE of C halen, dan kijken wij samen met je hoe dat kan."
      certificates: {
        title: "Papieren die",
        accent: "soms gevraagd worden",
        items: [
          {
            name: "Rijbewijs B",
            need: "plus",
            body: "Met rijbewijs B rijd je een verhuisbus tot 3.500 kilo, en je haalt het met rijlessen en een examen.",
          },
          {
            name: "VOG",
            need: "sometimes",
            body: "Een VOG is een verklaring van de overheid over je gedrag, die je bij de gemeente aanvraagt.",
          },
        ],
      },
      why: {
        title: "Hard werken met",
        accent: "een eerlijk uurloon",
        items: [
          {
            title: "Gelijk loon",
            body: "Draag je dezelfde meubels als de vaste verhuizers, dan krijg je volgens de wet ook hetzelfde loon.",
            icon: "wage",
          },
          {
            title: "Een vaste contactpersoon",
            body: "Jimmy of Lorenzo vertelt je vooraf waar de wagen staat en hoe laat je begint.",
            icon: "phone",
          },
          {
            title: "Werkschoenen zonder kosten",
            body: "Beschermende spullen zoals werkschoenen en handschoenen kosten je niets, net als solliciteren.",
            icon: "shield",
          },
        ],
      },
      career: {
        title: "Zo groei je door",
        accent: "in het verhuisvak",
        steps: ["Verhuishulp", "Verhuizer", "Allround verhuizer of liftbediener", "Ploegleider"],
      },
      vacancies: {
        title: "Vacatures voor verhuizers en bijrijders",
        accent: "in Den Haag",
        emptyTitle: "Er staat nu geen verhuisvacature open",
        emptyBody:
          "Rond het eind van de maand komen er vaak nieuwe vacatures bij. Schrijf je in, dan bellen wij je als er werk is.",
      },
      faq: {
        title: "Vragen over werken",
        accent: "als verhuizer",
        items: [
          {
            q: "Hoe zwaar is het werk als verhuizer?",
            a: "Het werk is zwaar, want je tilt en draagt bijna de hele dag. Een kast of wasmachine til je samen met een collega.",
            specific: true,
          },
          {
            q: "Waarom is het rond het eind van de maand zo druk?",
            a: "Veel huurcontracten stoppen of beginnen op de eerste van de maand. Daarom zoeken verhuisbedrijven in die dagen vaak extra mensen.",
            specific: true,
          },
          {
            q: "Heb ik een rijbewijs nodig?",
            a: "Nee, voor inpakken en dragen heb je geen rijbewijs nodig. Rijd je zelf de verhuisbus, dan heb je rijbewijs B nodig.",
            specific: true,
          },
          {
            q: "Werk ik ook in het weekend?",
            a: "Ja, dat kan, vooral bij kantoren en scholen. Die verhuizen vaak op zaterdag, zodat ze op maandag weer open zijn.",
            specific: true,
          },
          {
            q: "Kan ik als verhuishulp een paar dagen per maand werken?",
            a: "Ja, want veel verhuiswerk komt per dag of per klus. Vertel ons welke dagen je kunt, dan kijken wij wat past.",
            specific: true,
          },
          {
            q: "Kost solliciteren bij jullie iets?",
            a: "Nee, solliciteren en inschrijven zijn gratis. Een cv hoeft niet, want wij vragen je aan de telefoon welk zwaar werk je eerder deed.",
            specific: false,
          },
          {
            q: "Krijg ik mijn loon elke week?",
            a: "Ja, je krijgt je loon elke week op je rekening. Op je loonstrook zie je je uren, je toeslagen voor overuren en je vakantiegeld.",
            specific: false,
            claim: "weeklyPay",
          },
        ],
      },
      perspective: {
        text: "Personeel zoeken voor een verhuisbedrijf? Lees wat Groos voor opdrachtgevers doet.",
        linkLabel: "Naar de pagina voor werkgevers",
      },
      cta: {
        title: "Wil je meehelpen",
        accent: "bij de volgende verhuizing?",
        body: "Schrijf je in en vertel welke dagen je kunt. Jimmy of Lorenzo belt je als een ploeg iemand zoekt.",
      },
    },
    employer: {
      meta: {
        title: "Personeel voor verhuisbedrijven in Den Haag",
        description:
          "Zoekt u personeel voor uw verhuisbedrijf in Den Haag en omgeving? Groos levert verhuizers voor een dag, een paar weken of langer. Vraag personeel aan.",
        keywords: [
          "verhuizers inhuren den haag",
          "personeel verhuisbedrijf",
          "uitzendkrachten verhuisbedrijf",
          "bijrijder inhuren",
          "verhuishulp inhuren",
          "uitzendbureau verhuizers den haag",
        ],
        serviceType: "Uitzenden van verhuizers",
      },
      hero: {
        title: "Verhuizers voor uw verhuisbedrijf in Den Haag",
        lead: "Rond de maandwisseling en in de zomer heeft u vaak meer mensen nodig dan uw vaste ploeg. Wij zoeken verhuizers en bijrijders die vroeg beginnen en netjes werken.",
      },
      supply: {
        title: "Wat onze verhuizers",
        accent: "voor u doen",
        intro: "Wij bespreken vooraf welke klussen op uw planning staan en wat de medewerker moet kunnen.",
        tasks: [
          "Inboedels inpakken, labelen en weer uitpakken",
          "Kasten, bedden en bureaus demonteren en monteren",
          "Meubels en dozen dragen en de wagen veilig stuwen",
          "De verhuislift bedienen na instructie",
          "Archieven en bureaus verplaatsen bij een kantoorverhuizing",
        ],
        clientsTitle: "Voor deze soorten bedrijven",
        clients: [
          "Verhuisbedrijven voor particulieren",
          "Internationale verhuizers voor expats en diplomaten",
          "Projectverhuizers voor kantoren, scholen en overheid",
        ],
      },
      why: {
        title: "Verhuizers die netjes werken",
        accent: "bij uw klanten thuis",
        items: [
          {
            title: "Vooraf afgestemd op de klus",
            body: "Wij bespreken de taken, de werktijden en of de medewerker moet rijden of een lift bedienen.",
            icon: "handshake",
          },
          {
            title: "Twee vaste contactpersonen",
            body: "U belt met Jimmy of Lorenzo, die uw aanvraag van begin tot eind regelen.",
            icon: "phone",
          },
          {
            title: "Groos regelt contract en loon",
            body: "De medewerker werkt via Groos, dat het contract, het loon en de loonstrook regelt.",
            icon: "shield",
          },
          {
            title: "Uw werkwijze vooraf bekend",
            body: "Wij vertellen elke kandidaat hoe u bij klanten thuis werkt, zoals het afdekken van vloeren.",
            icon: "team",
          },
        ],
      },
      certificates: {
        title: "Rijbewijzen en certificaten",
        accent: "per kandidaat besproken",
        items: [
          {
            name: "Rijbewijs B, BE of C",
            need: "plus",
            body: "B is genoeg voor een verhuisbus tot 3.500 kilo, BE voor een ladderlift op een aanhanger en C met code 95 voor een bakwagen.",
          },
          {
            name: "VOG",
            need: "sometimes",
            body: "Sommige ambassades en overheidsgebouwen vragen een VOG, en het aanvragen daarvan kost tijd.",
          },
        ],
      },
      planning: {
        title: "Plannen rond",
        accent: "de drukke dagen",
        items: [
          {
            title: "Piek rond de maandwisseling",
            body: "De laatste en eerste dagen van de maand zijn het drukst, en in de zomer duurt die drukte weken.",
            icon: "season",
          },
          {
            title: "Vroege start en lange dagen",
            body: "Uw ploeg begint om 07.00 uur of eerder, en een verhuisdag duurt tot de klus af is.",
            icon: "clock",
          },
          {
            title: "Per dag of per seizoen",
            body: "U vraagt mensen aan voor één drukke zaterdag, een maandwisseling of de hele zomer.",
            icon: "calendar",
          },
        ],
      },
      legal: {
        title: "Wat u als inlener",
        accent: "moet weten",
        items: [
          {
            text: "De medewerker krijgt gelijkwaardige beloning, dus minimaal hetzelfde loon als uw eigen verhuizers in dezelfde functie.",
          },
          {
            text: "Volgens de Arbowet zorgt u als inlener voor instructie en een veilige werkplek, ook bij de verhuislift.",
          },
          {
            text: "Betaalt een uitzendbureau de loonheffingen niet af, dan kan de Belastingdienst u als inlener aansprakelijk stellen.",
          },
        ],
        wttaLinkLabel: "Naar de uitleg over de Wtta",
      },
      faq: {
        title: "Vragen over het inhuren",
        accent: "van verhuizers",
        items: [
          {
            q: "Kunt u extra verhuizers leveren rond de maandwisseling?",
            a: "Ja, wij zoeken extra mensen voor die drukke dagen, maar een vast aantal beloven wij niet. Hoe eerder u uw planning doorgeeft, hoe meer tijd wij hebben.",
            specific: true,
          },
          {
            q: "Kunnen uw verhuizers een verhuislift bedienen?",
            a: "Dat verschilt per kandidaat, en wij vermelden wie al met een verhuislift heeft gewerkt. De instructie op uw eigen lift geeft uw ploegleider.",
            specific: true,
          },
          {
            q: "Kan de medewerker ook de verhuisbus rijden?",
            a: "Ja, als de kandidaat rijbewijs B heeft, want dat is genoeg voor een bus tot 3.500 kilo. Geef in uw aanvraag aan wat er gereden moet worden.",
            specific: true,
          },
          {
            q: "Spreken uw verhuizers Engels bij verhuizingen voor expats?",
            a: "Dat bespreken wij per kandidaat. Spreekt uw klant vooral Engels, noem dat dan in uw aanvraag, dan houden wij er rekening mee.",
            specific: true,
          },
          {
            q: "Werken uw mensen ook in de avond of het weekend?",
            a: "Ja, als dat vooraf is afgesproken, want kantoorverhuizingen vallen vaak op zaterdag of in de avond. Dan gelden vaak toeslagen, net als voor uw eigen mensen.",
            specific: true,
          },
          {
            q: "Wat kost een verhuizer via Groos?",
            a: "Het tarief hangt af van de functie, de uren, de werktijden en de duur van de inzet. Na uw aanvraag sturen wij u een voorstel met een helder uurtarief.",
            specific: false,
          },
          {
            q: "Wat als een verhuizer op de verhuisdag uitvalt?",
            a: "Dan zoeken wij een vervanger en houden wij u op de hoogte. Belt een medewerker 's ochtends af, dan hoort u dat direct van Jimmy of Lorenzo.",
            specific: true,
            claim: "replacement",
          },
        ],
      },
      perspective: {
        text: "Zelf werk zoeken als verhuizer? Op de pagina voor werkzoekenden staat alles over het werk.",
        linkLabel: "Naar de pagina voor werkzoekenden",
      },
      cta: {
        title: "Extra verhuizers nodig",
        accent: "rond de maandwisseling?",
        body: "Vertel ons op welke dagen u mensen nodig heeft en of er gereden moet worden. Wij nemen daarna contact met u op.",
      },
    },
  },
  en: {
    jobseeker: {
      meta: {
        title: "Work as a mover in The Hague",
        description:
          "Do you want to work as a mover in The Hague? Read what the work involves, what you earn and why the end of the month is busy. You can apply without a CV.",
        keywords: [
          "mover jobs the hague",
          "removals jobs the hague",
          "working as a mover",
          "driver's mate jobs the hague",
          "removal company jobs",
          "removals labourer job",
          "moving helper side job",
          "removal van driver job",
        ],
      },
      hero: {
        title: "Work as a mover in The Hague",
        lead: "As a mover you pack things and carry furniture from the old address to the new one. You start early and work in a team.",
        facts: [
          { label: "Working hours", value: "Start at 07:00 or earlier" },
          { label: "Diploma", value: "Not needed" },
        ],
      },
      work: {
        title: "A working day",
        accent: "as a mover",
        tasks: [
          "Packing, labelling and unpacking boxes",
          "Taking wardrobes and beds apart and putting them back",
          "Carrying furniture and boxes, also up narrow stairs",
          "Operating a furniture lift after you have been shown how",
          "Riding next to the driver and helping with parking",
        ],
        placesTitle: "Where you work",
        places: ["Homes in and around The Hague", "Offices, schools and archives", "Homes of expats and diplomats"],
      },
      requirements: {
        title: "What you bring",
        accent: "as a mover",
        items: [
          "You can lift and carry all day, also on stairs",
          "You work carefully in someone else's home",
          "Driving licence B only if you drive the removal van",
        ],
      },
      wage: {
        title: "What you earn",
        accent: "with removals work",
        intro: "The exact gross hourly wage is shown with every job.",
        sourceLabel:
          "pay scales of the collective labour agreement (cao) for road haulage as of 1 January 2026 and the statutory minimum wage as of 1 July 2026",
        extra: "Overtime and Saturday work often come with extra pay.",
      },
      schedule: {
        title: "Early starts and",
        accent: "busy month ends",
        items: [
          {
            title: "Your day starts early",
            body: "You usually start at the van at 07:00, and the day lasts as long as the job.",
            icon: "clock",
          },
          {
            title: "Busiest in the summer",
            body: "There is the most removals work in the summer and at the end of every month.",
            icon: "season",
          },
          {
            title: "Also in rain or cold",
            body: "A move also goes ahead when it rains or freezes, so bring clothes for wet weather.",
            icon: "weather",
          },
        ],
      },
      certificates: {
        title: "Papers that are",
        accent: "sometimes asked for",
        items: [
          {
            name: "Driving licence B",
            need: "plus",
            body: "With licence B you can drive a removal van up to 3,500 kilos, and you get it with lessons and an exam.",
          },
          {
            name: "Certificate of conduct (VOG)",
            need: "sometimes",
            body: "A VOG is a government statement about your behaviour, which you request at the town hall.",
          },
        ],
      },
      why: {
        title: "Hard work with",
        accent: "a fair hourly wage",
        items: [
          {
            title: "Equal pay",
            body: "If you carry the same furniture as the company's own movers, the law says you get the same wage.",
            icon: "wage",
          },
          {
            title: "One regular contact person",
            body: "Jimmy or Lorenzo tells you in advance where the van is and what time you start.",
            icon: "phone",
          },
          {
            title: "Free work shoes",
            body: "Protective items such as work shoes and gloves cost you nothing, and neither does applying.",
            icon: "shield",
          },
        ],
      },
      career: {
        title: "How you can grow",
        accent: "in the removals trade",
        steps: ["Moving helper", "Mover", "All-round mover or lift operator", "Crew leader"],
      },
      vacancies: {
        title: "Jobs for movers and driver's mates",
        accent: "in The Hague",
        emptyTitle: "There is no removals job open right now",
        emptyBody:
          "New jobs often come in around the end of the month. Register, and we will call you when there is work.",
      },
      faq: {
        title: "Questions about working",
        accent: "as a mover",
        items: [
          {
            q: "How heavy is the work as a mover?",
            a: "The work is heavy, because you lift and carry almost all day. You lift a wardrobe or washing machine together with a colleague.",
            specific: true,
          },
          {
            q: "Why is the end of the month so busy?",
            a: "Many rental contracts end or start on the first of the month. On those days removal companies often look for extra people.",
            specific: true,
          },
          {
            q: "Do I need a driving licence?",
            a: "No, you do not need a licence for packing and carrying. If you drive the removal van yourself, you need driving licence B.",
            specific: true,
          },
          {
            q: "Do I also work at the weekend?",
            a: "Yes, that is possible, mostly with offices and schools. They often move on a Saturday, so that they can open again on Monday.",
            specific: true,
          },
          {
            q: "Can I work as a moving helper a few days a month?",
            a: "Yes, because much removals work comes per day or per job. Tell us your free days, and we will see what fits.",
            specific: true,
          },
          {
            q: "Does it cost anything to apply with you?",
            a: "No, applying and registering are free. You do not need a CV, because we ask on the phone about heavy work you did before.",
            specific: false,
          },
          {
            q: "Do I get paid every week?",
            a: "Yes, you get your wage in your bank account every week. Your payslip shows your hours, your extra pay for overtime and your holiday pay.",
            specific: false,
            claim: "weeklyPay",
          },
        ],
      },
      perspective: {
        text: "Looking for staff for a removal company? Read what Groos does for clients.",
        linkLabel: "Go to the page for employers",
      },
      cta: {
        title: "Do you want to help",
        accent: "with the next move?",
        body: "Register and tell us which days you can work. Jimmy or Lorenzo will call you when a team needs someone.",
      },
    },
    employer: {
      meta: {
        title: "Staff for removal companies in The Hague",
        description:
          "Are you looking for staff for your removal company in The Hague and the surrounding area? Groos provides movers for a day, a few weeks or longer. Request staff.",
        keywords: [
          "hire movers the hague",
          "staff for removal company",
          "temporary workers removal company",
          "hire driver's mate",
          "hire moving helpers",
          "employment agency movers the hague",
        ],
        serviceType: "Provision of temporary movers",
      },
      hero: {
        title: "Movers for your removal company in The Hague",
        lead: "Around the turn of the month and in summer you often need more people than your own team. We find movers and driver's mates who start early and work carefully.",
      },
      supply: {
        title: "What our movers",
        accent: "do for you",
        intro: "We discuss in advance which jobs are planned and what the worker needs to do.",
        tasks: [
          "Packing, labelling and unpacking household goods",
          "Dismantling and reassembling wardrobes, beds and desks",
          "Carrying furniture and boxes and loading the van securely",
          "Operating the furniture lift after instruction",
          "Moving archives and desks in office relocations",
        ],
        clientsTitle: "For these types of companies",
        clients: [
          "Removal companies for private households",
          "International movers for expats and diplomats",
          "Project movers for offices, schools and government",
        ],
      },
      why: {
        title: "Movers who work carefully",
        accent: "in your customers' homes",
        items: [
          {
            title: "Agreed in advance for the job",
            body: "We discuss the tasks, the working hours and whether the worker needs to drive or operate a lift.",
            icon: "handshake",
          },
          {
            title: "Two regular contact persons",
            body: "You deal with Jimmy or Lorenzo, who handle your request from start to finish.",
            icon: "phone",
          },
          {
            title: "Groos handles contract and pay",
            body: "The worker works through Groos, which arranges the contract, the wages and the payslip.",
            icon: "shield",
          },
          {
            title: "Your methods explained upfront",
            body: "We tell every candidate how you work in customers' homes, such as covering floors.",
            icon: "team",
          },
        ],
      },
      certificates: {
        title: "Driving licences and certificates",
        accent: "discussed per candidate",
        items: [
          {
            name: "Driving licence B, BE or C",
            need: "plus",
            body: "B is enough for a removal van up to 3,500 kilos, BE for a ladder lift on a trailer and C with code 95 for a box truck.",
          },
          {
            name: "Certificate of conduct (VOG)",
            need: "sometimes",
            body: "Some embassies and government buildings ask for a VOG, which takes time to obtain.",
          },
        ],
      },
      planning: {
        title: "Planning around",
        accent: "the busy days",
        items: [
          {
            title: "Peak around the turn of the month",
            body: "The last and first days of the month are busiest, and summer stays busy for weeks.",
            icon: "season",
          },
          {
            title: "Early starts and long days",
            body: "Your team starts at 07:00 or earlier, and a moving day lasts until the job is done.",
            icon: "clock",
          },
          {
            title: "Per day or per season",
            body: "You can request people for one busy Saturday, a month end or the whole summer.",
            icon: "calendar",
          },
        ],
      },
      legal: {
        title: "What you need to know",
        accent: "as the hirer",
        items: [
          {
            text: "The worker receives equal pay, which means at least the same wage as your own movers in the same role.",
          },
          {
            text: "Under the Working Conditions Act you provide instruction and a safe workplace, also at the lift.",
          },
          {
            text: "If an agency does not pay the wage taxes, the Tax Administration can hold you liable as the hirer.",
          },
        ],
        wttaLinkLabel: "Read the explanation of the Wtta",
      },
      faq: {
        title: "Questions about hiring",
        accent: "movers",
        items: [
          {
            q: "Can you provide extra movers around the turn of the month?",
            a: "Yes, we look for extra people for those busy days, but we do not promise a fixed number. The sooner you share your planning, the more time we have.",
            specific: true,
          },
          {
            q: "Can your movers operate a furniture lift?",
            a: "That differs per candidate, and we state who has already worked with a furniture lift. Your crew leader gives the instruction on your own lift.",
            specific: true,
          },
          {
            q: "Can the worker also drive the removal van?",
            a: "Yes, if the candidate holds licence B, which covers a van up to 3,500 kilos. Please state in your request what needs to be driven.",
            specific: true,
          },
          {
            q: "Do your movers speak English for expat moves?",
            a: "We discuss that per candidate. If your customer mainly speaks English, mention it in your request and we will take it into account.",
            specific: true,
          },
          {
            q: "Do your people also work in the evening or at the weekend?",
            a: "Yes, if agreed in advance, because office relocations often take place on a Saturday or in the evening. Extra pay often applies, just as for your own staff.",
            specific: true,
          },
          {
            q: "What does a mover through Groos cost?",
            a: "The rate depends on the role, the hours, the working times and the length of the assignment. After your request we send you a proposal with a clear hourly rate.",
            specific: false,
          },
          {
            q: "What if a mover drops out on the moving day?",
            a: "Then we look for a replacement and keep you informed. If a worker calls in sick in the morning, you hear it straight away from Jimmy or Lorenzo.",
            specific: true,
            claim: "replacement",
          },
        ],
      },
      perspective: {
        text: "Looking for work as a mover yourself? The page for job seekers explains everything about the work.",
        linkLabel: "Go to the page for job seekers",
      },
      cta: {
        title: "Need extra movers",
        accent: "around the turn of the month?",
        body: "Tell us on which days you need people and whether there is driving involved. We will then contact you.",
      },
    },
  },
} satisfies BeroepContent;
