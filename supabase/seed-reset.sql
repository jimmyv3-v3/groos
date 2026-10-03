-- Seed-reset voor groos-dev (spec 10 §5.11, B-46). Draait nooit op productie.
-- Leegt de testdata zodat supabase/seed.sql daarna de relatieve datums opnieuw
-- zet. Weigert als er vacatures zijn zonder seedtekst ("Testvacature." aan het
-- begin van een samenvatting). admin_profiles en audit_log blijven staan; de
-- vertalingen verdwijnen via de cascade op vacancy_translations.
-- Gebruik: npm run db:seed:reset (draait dit bestand en daarna seed.sql).

begin;

do $$
begin
  if exists (select 1 from public.vacancies)
     and not exists (select 1 from public.vacancy_translations where summary like 'Testvacature.%') then
    raise exception 'seed-reset geweigerd: geen seeddata gevonden';
  end if;
end $$;

delete from public.activities;
delete from public.email_log;
delete from public.applications;
delete from public.staff_requests;
delete from public.contact_messages;
delete from public.vacancies;

commit;
