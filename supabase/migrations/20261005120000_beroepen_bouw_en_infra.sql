-- Migratie: vijf beroepen in bouw, sloop en infra erbij (spec 00 §4.2) en de
-- kwalificaties die vacatures in die beroepen vragen. Referentiedata die ook
-- productie nodig heeft; de seed herhaalt de beroepen idempotent.

insert into public.occupations (slug, name_nl, plural_nl, name_en, plural_en, sort_order) values
  ('grondwerker', 'Grondwerker', 'Grondwerkers', 'Groundworker', 'Groundworkers', 6),
  ('sloper', 'Sloper', 'Slopers', 'Demolition worker', 'Demolition workers', 7),
  ('bouwopruimer', 'Bouwopruimer', 'Bouwopruimers', 'Construction site cleaner', 'Construction site cleaners', 8),
  ('machinist', 'Machinist', 'Machinisten', 'Excavator operator', 'Excavator operators', 9),
  ('stratenmaker', 'Stratenmaker', 'Stratenmakers', 'Street paver', 'Street pavers', 10)
on conflict (slug) do nothing;

-- Kwalificaties. Elke waarde komt direct na een bestaande waarde, zodat de
-- volgorde in de beheerformulieren logisch blijft: poortinstructie bij VCA,
-- machinistenpapieren bij de andere machines, rijbewijs T bij de rijbewijzen
-- en de instructies voor weg, graven en asbest achteraan. Een nieuwe waarde is
-- pas na de commit te gebruiken; deze migratie gebruikt ze daarom zelf niet.
alter type public.qualification add value if not exists 'gpi' after 'vca_vol';
alter type public.qualification add value if not exists 'tcvt' after 'ipaf';
alter type public.qualification add value if not exists 'machinist_diploma' after 'ipaf';
alter type public.qualification add value if not exists 'rijbewijs_t' after 'rijbewijs_c';
alter type public.qualification add value if not exists 'asbestherkenning' after 'ras';
alter type public.qualification add value if not exists 'zorgvuldig_graven' after 'ras';
alter type public.qualification add value if not exists 'werken_langs_de_weg' after 'ras';
