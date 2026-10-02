-- Seed voor groos-dev (spec 10 §5.11). Draait nooit op productie.
-- Idempotent: vaste nummers en on conflict do nothing. Vraagt eerst een
-- beheerder (npm run db:admin), omdat elke vacature een contactpersoon heeft.
-- Alle teksten zijn testteksten; er zit geen echte opdrachtgever of persoon achter.

begin;

-- 1. Beroepen: dezelfde upsert als migratie 7, zodat de seed ook los werkt.
insert into public.occupations (slug, name_nl, plural_nl, name_en, plural_en, sort_order) values
  ('glazenwasser', 'Glazenwasser', 'Glazenwassers', 'Window cleaner', 'Window cleaners', 1),
  ('schoonmaker', 'Schoonmaker', 'Schoonmakers', 'Cleaner', 'Cleaners', 2),
  ('logistiek-medewerker', 'Logistiek medewerker', 'Logistiek medewerkers', 'Logistics worker', 'Logistics workers', 3),
  ('verhuizer', 'Verhuizer', 'Verhuizers', 'Mover', 'Movers', 4),
  ('hulpkracht-bouw-en-sloop', 'Hulpkracht bouw en sloop', 'Hulpkrachten bouw en sloop',
   'Construction and demolition labourer', 'Construction and demolition labourers', 5)
on conflict (slug) do nothing;

do $$
declare
  v_a uuid;
  v_b uuid;
  d constant interval := interval '1 day';
  v_extra constant text := 'Dit is een testvacature voor de ontwikkelomgeving. Er zit geen echte opdrachtgever achter.';
begin
  select id into v_a from public.admin_profiles where is_active order by created_at limit 1;
  if v_a is null then
    raise exception 'Maak eerst een beheerder aan met npm run db:admin (spec 10, bouwopdracht stap 10).';
  end if;
  select id into v_b from public.admin_profiles where is_active and id <> v_a order by created_at limit 1;
  v_b := coalesce(v_b, v_a);

  -- 2. Vacatures (tabel A). Alle contract_type temp_agency, education_level none.
  insert into public.vacancies (
    number, status, occupation_slug, city, contract_type, hours_min, hours_max, shifts, salary_min, salary_max,
    education_level, experience_level, required_qualifications, preferred_qualifications, training_offered,
    min_age_18, min_age_reason, publish_at, published_at, closes_at, closed_at, close_reason,
    is_featured, is_urgent, contact_admin_id)
  values
    (1001, 'published', 'glazenwasser', 'Den Haag', 'temp_agency', 32, 40, '{early,day}', 16.08, 17.50,
     'none', 'none', '{rijbewijs_b}', '{vca_basis,ipaf}', '{ipaf}',
     true, 'work_at_height', now() - 5 * d, now() - 5 * d, now() + 40 * d, null, null,
     true, false, v_a),
    (1002, 'published', 'schoonmaker', 'Rijswijk', 'temp_agency', 12, 20, '{evening}', 15.52, 16.08,
     'none', 'none', '{}', '{}', '{}',
     false, null, now() - 2 * d, now() - 2 * d, now() + 43 * d, null, null,
     false, false, v_b),
    (1003, 'published', 'logistiek-medewerker', 'Naaldwijk', 'temp_agency', 32, 40, '{early,weekend}', 14.99, 16.20,
     'none', 'none', '{}', '{ept}', '{ept}',
     false, null, now() - 1 * d, now() - 1 * d, now() + 44 * d, null, null,
     false, true, v_a),
    (1004, 'published', 'logistiek-medewerker', 'Zoetermeer', 'temp_agency', 36, 40, '{early,evening}', 15.60, 17.80,
     'none', 'none', '{heftruck}', '{}', '{}',
     true, 'forklift', now() - 10 * d, now() - 10 * d, now() + 35 * d, null, null,
     false, false, v_b),
    (1005, 'published', 'verhuizer', 'Den Haag', 'temp_agency', 24, 40, '{day,weekend}', 14.99, 16.00,
     'none', 'none', '{}', '{rijbewijs_b}', '{}',
     false, null, now() - 3 * d, now() - 3 * d, now() + 42 * d, null, null,
     true, false, v_a),
    (1006, 'published', 'hulpkracht-bouw-en-sloop', 'Den Haag', 'temp_agency', 40, 40, '{day}', 15.98, 17.00,
     'none', 'none', '{vca_basis}', '{}', '{vca_basis}',
     true, 'construction_demolition', now() - 7 * d, now() - 7 * d, now() + 38 * d, null, null,
     false, false, v_b),
    (1007, 'closed', 'schoonmaker', 'Delft', 'temp_agency', 32, 38, '{day}', 16.08, 16.70,
     'none', 'none', '{}', '{vca_basis}', '{}',
     false, null, now() - 25 * d, now() - 25 * d, now() + 20 * d, now() - 5 * d, 'filled',
     false, false, v_a),
    (1008, 'scheduled', 'logistiek-medewerker', 'Honselersdijk', 'temp_agency', 24, 40, '{early}', 14.99, 16.04,
     'none', 'none', '{}', '{}', '{}',
     false, null, now() + 2 * d, null, now() + 47 * d, null, null,
     false, false, v_b),
    (1009, 'draft', 'hulpkracht-bouw-en-sloop', 'Leidschendam', 'temp_agency', 40, 40, '{day}', 16.97, 18.95,
     'none', 'none', '{vca_basis}', '{}', '{}',
     true, 'construction_demolition', null, null, null, null, null,
     false, false, v_a),
    (1010, 'closed', 'verhuizer', 'Wassenaar', 'temp_agency', 16, 24, '{day}', 14.99, 15.80,
     'none', 'none', '{}', '{}', '{}',
     false, null, now() - 80 * d, now() - 80 * d, now() - 35 * d, now() - 40 * d, 'withdrawn',
     false, false, v_b)
  on conflict (number) do nothing;

  -- 3. Teksten (tabel B), alleen nl.
  insert into public.vacancy_translations (vacancy_id, locale, title, summary, intro, tasks, requirements, offer, extra)
  select v.id, 'nl', b.title, b.summary, b.intro, b.tasks, b.requirements, b.offer, v_extra
  from (values
    (1001, 'Glazenwasser',
     'Testvacature. Je wast ramen van kantoren en winkels in Den Haag, in een vaste ploeg.',
     'Je maakt ramen en kozijnen van kantoren en winkels in Den Haag schoon. Je werkt overdag in een ploeg van drie collega''s en begint om 07.00 uur.',
     array['Ramen wassen met een telescopisch wassysteem', 'Kozijnen en deuren afnemen',
           'Werken vanaf een hoogwerker als dat nodig is', 'De bus netjes achterlaten aan het eind van de dag'],
     array['Je hebt rijbewijs B', 'Je kunt goed tegen werken op hoogte'],
     array['Een bruto uurloon tussen € 16,08 en € 17,50', '8 procent vakantiegeld bovenop je loon',
           'Wij regelen de IPAF-training als je die nog niet hebt']),
    (1002, 'Schoonmaker kantoren',
     'Testvacature. Je maakt ''s avonds kantoren schoon in Rijswijk, 12 tot 20 uur per week.',
     'Je maakt na kantoortijd werkplekken, keukens en toiletten schoon. Je werkt op maandag tot en met vrijdag tussen 18.00 en 22.00 uur.',
     array['Bureaus en vloeren schoonmaken', 'Keukens en toiletten schoonmaken en bijvullen', 'Afval scheiden en wegbrengen'],
     array['Je bent betrouwbaar en werkt graag zelfstandig'],
     array['Een bruto uurloon tussen € 15,52 en € 16,08',
           'Een toeslag voor uren na 21.30 uur volgens de cao van de opdrachtgever', 'Een vaste contactpersoon bij Groos']),
    (1003, 'Orderpicker',
     'Testvacature. Je verzamelt bestellingen in een magazijn in Naaldwijk, ook op zaterdag.',
     'Je verzamelt orders met een scanner en zet ze klaar voor de vrachtwagen. Je begint vroeg, meestal om 06.00 uur, en werkt ook op zaterdag.',
     array['Orders verzamelen met een scanner', 'Rijden met een elektrische pallettruck',
           'Karren klaarzetten voor transport', 'Het magazijn opgeruimd houden'],
     array['Je kunt vroeg beginnen en op zaterdag werken'],
     array['Een bruto uurloon tussen € 14,99 en € 16,20', 'Wij regelen je EPT-certificaat als je dat nog niet hebt',
           'Werkschoenen en handschoenen krijg je kosteloos']),
    (1004, 'Heftruckchauffeur',
     'Testvacature. Je rijdt heftruck in een distributiecentrum in Zoetermeer, in vroege en late diensten.',
     'Je laadt en lost vrachtwagens en zet pallets op de juiste plek in het magazijn. Je werkt de ene week vroeg en de andere week laat.',
     array['Vrachtwagens laden en lossen', 'Pallets in de stellingen zetten', 'Voorraad tellen', 'Schade aan goederen melden'],
     array['Je hebt een geldig heftruckcertificaat', 'Je kunt in wisselende diensten werken'],
     array['Een bruto uurloon tussen € 15,60 en € 17,80',
           'Een toeslag voor late diensten volgens de cao van de opdrachtgever', '8 procent vakantiegeld bovenop je loon']),
    (1005, 'Verhuizer',
     'Testvacature. Je helpt bij verhuizingen van gezinnen en kantoren in Den Haag en omgeving.',
     'Je pakt inboedels in, draagt meubels naar buiten en zet alles op het nieuwe adres weer neer. Je werkt in een ploeg en begint meestal om 07.30 uur.',
     array['Meubels demonteren en weer opbouwen', 'Dozen en meubels sjouwen en in de wagen zetten',
           'Zorgen dat niets beschadigt', 'Klanten netjes te woord staan'],
     array['Je kunt de hele dag fysiek werken'],
     array['Een bruto uurloon tussen € 14,99 en € 16,00', 'Werk op zaterdag als je dat wilt',
           'Een vaste contactpersoon bij Groos']),
    (1006, 'Hulpkracht sloop',
     'Testvacature. Je helpt bij het strippen en slopen van woningen in Den Haag.',
     'Je haalt keukens, plafonds en vloeren uit woningen die worden gerenoveerd. Je werkt van 07.00 tot 16.00 uur in een vaste ploeg.',
     array['Keukens en plafonds verwijderen', 'Sloopafval scheiden en afvoeren', 'De werkplek veilig en opgeruimd houden'],
     array['Je hebt VCA Basis of wilt het halen', 'Je stopt en meldt het als je asbest vermoedt'],
     array['Een bruto uurloon tussen € 15,98 en € 17,00', 'Wij regelen de VCA-cursus als je die nog niet hebt',
           'Beschermingsmiddelen krijg je kosteloos']),
    (1007, 'Opleveringsschoonmaker',
     'Testvacature. Je maakt nieuwbouwwoningen in Delft schoon voor de oplevering.',
     'Je verwijdert bouwstof, verfspatten en kitresten in nieuwe woningen. Je werkt overdag in een ploeg die per project werkt.',
     array['Ramen en kozijnen schoonmaken', 'Vloeren stofvrij maken', 'Sanitair en keukens schoonmaken'],
     array['Je werkt nauwkeurig'],
     array['Een bruto uurloon tussen € 16,08 en € 16,70', '8 procent vakantiegeld bovenop je loon']),
    (1008, 'Medewerker bloemenlogistiek',
     'Testvacature. Je zet bloemen en planten klaar voor transport in Honselersdijk.',
     'Je verwerkt bloemen en planten en zet ze op karren klaar voor de klant. Je begint vroeg, meestal om 05.00 uur.',
     array['Karren laden met bloemen en planten', 'Labels controleren', 'Fust sorteren'],
     array['Je kunt vroeg beginnen'],
     array['Een bruto uurloon tussen € 14,99 en € 16,04',
           'Een toeslag voor vroege uren volgens de cao van de opdrachtgever']),
    (1009, 'Opperman',
     'Testvacature. Je helpt metselaars op een bouwplaats in Leidschendam.',
     'Je zorgt dat metselaars altijd stenen en specie bij de hand hebben. Je werkt buiten, van 07.00 tot 16.00 uur.',
     array['Specie mengen', 'Stenen aangeven', 'De steiger opgeruimd houden'],
     array['Je hebt VCA Basis'],
     array['Een bruto uurloon tussen € 16,97 en € 18,95', 'Beschermingsmiddelen krijg je kosteloos']),
    (1010, 'Bijrijder verhuizingen',
     'Testvacature. Je rijdt mee met verhuizingen in Wassenaar.',
     'Je helpt de chauffeur met laden, lossen en de weg vinden. Je werkt overdag, vaak aan het begin en eind van de maand.',
     array['Laden en lossen', 'Navigeren onderweg', 'Meubels inpakken'],
     array['Je bent op tijd en werkt zorgvuldig'],
     array['Een bruto uurloon tussen € 14,99 en € 15,80', 'Een vaste contactpersoon bij Groos'])
  ) as b(number, title, summary, intro, tasks, requirements, offer)
  join public.vacancies v on v.number = b.number
  on conflict (vacancy_id, locale) do nothing;

  -- 4. Volgende vacature krijgt een nummer na 1010.
  perform setval('public.vacancy_number_seq', greatest((select max(number) from public.vacancies), 1010));

  -- 5. Overige testdata (tabel C), alle adressen op example.com.
  insert into public.applications (
    kind, vacancy_id, vacancy_number, vacancy_title_snapshot, occupation_slugs, source, first_name, last_name,
    email, phone_e164, city, may_work_in_nl, has_driving_license_b, message, privacy_notice_version, submission_id)
  select 'vacancy', v.id, 1001, 'Glazenwasser', '{glazenwasser}', 'website', 'Test', 'Kandidaat',
         'test.kandidaat@example.com', '+31600000001', 'Den Haag', true, true,
         'Testsollicitatie uit de seed. Dit is geen echte persoon.', 'seed',
         '00000000-0000-4000-8000-000000000001'
  from public.vacancies v where v.number = 1001
  on conflict (submission_id) do nothing;

  insert into public.applications (
    kind, occupation_slugs, source, first_name, last_name, email, phone_e164, city, may_work_in_nl,
    retention_consent, privacy_notice_version, submission_id)
  values ('registration', '{schoonmaker,glazenwasser}', 'website', 'Test', 'Inschrijver',
          'test.inschrijver@example.com', '+31600000002', 'Delft', true,
          true, 'seed', '00000000-0000-4000-8000-000000000002')
  on conflict (submission_id) do nothing;

  insert into public.staff_requests (
    company_name, contact_name, email, phone_e164, occupation_slugs, headcount, duration, hours_per_week,
    work_city, description, privacy_notice_version, submission_id)
  values ('Testbedrijf B.V.', 'Test Opdrachtgever', 'test.opdrachtgever@example.com', '+31700000001',
          '{schoonmaker}', 3, 'weeks', 24, 'Den Haag', 'Testaanvraag uit de seed.', 'seed',
          '00000000-0000-4000-8000-000000000003')
  on conflict (submission_id) do nothing;

  insert into public.contact_messages (name, phone_e164, topic, privacy_notice_version, submission_id)
  values ('Test Bezoeker', '+31600000003', 'callback', 'seed', '00000000-0000-4000-8000-000000000004')
  on conflict (submission_id) do nothing;
end $$;

commit;
