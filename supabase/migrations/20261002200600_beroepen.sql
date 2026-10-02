-- Migratie 7: de vijf beroepen (spec 10 §5.10, spec 00 §4.2).
-- Referentiedata die ook productie nodig heeft; de seed herhaalt dit idempotent.

insert into public.occupations (slug, name_nl, plural_nl, name_en, plural_en, sort_order) values
  ('glazenwasser', 'Glazenwasser', 'Glazenwassers', 'Window cleaner', 'Window cleaners', 1),
  ('schoonmaker', 'Schoonmaker', 'Schoonmakers', 'Cleaner', 'Cleaners', 2),
  ('logistiek-medewerker', 'Logistiek medewerker', 'Logistiek medewerkers', 'Logistics worker', 'Logistics workers', 3),
  ('verhuizer', 'Verhuizer', 'Verhuizers', 'Mover', 'Movers', 4),
  ('hulpkracht-bouw-en-sloop', 'Hulpkracht bouw en sloop', 'Hulpkrachten bouw en sloop',
   'Construction and demolition labourer', 'Construction and demolition labourers', 5)
on conflict (slug) do nothing;
