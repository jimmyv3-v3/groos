-- Migratie 5: RLS, policies, grants en revokes (spec 10 §5.8).
-- Functies in policies staan als (select ...), zodat Postgres ze één keer per
-- query uitrekent. Per rol en actie is er één permissive policy.

alter table public.admin_profiles enable row level security;
alter table public.occupations enable row level security;
alter table public.vacancies enable row level security;
alter table public.vacancy_translations enable row level security;
alter table public.applications enable row level security;
alter table public.staff_requests enable row level security;
alter table public.contact_messages enable row level security;
alter table public.activities enable row level security;
alter table public.email_log enable row level security;
alter table public.audit_log enable row level security;

-- admin_profiles -------------------------------------------------------------
-- Anoniem: alleen actieve profielen die contactpersoon zijn van een publieke
-- vacature, en alleen de kolommen uit de column grant hieronder.
create policy admin_profiles_select_anon on public.admin_profiles for select to anon
  using (
    is_active and exists (
      select 1 from public.vacancies v
      where v.contact_admin_id = admin_profiles.id
        and public.vacancy_public_state(v.status, v.publish_at, v.closes_at, v.closed_at) is not null
    )
  );
create policy admin_profiles_select_authenticated on public.admin_profiles for select to authenticated
  using (
    (select public.is_admin())
    or id = (select auth.uid())
    or (is_active and exists (
      select 1 from public.vacancies v
      where v.contact_admin_id = admin_profiles.id
        and public.vacancy_public_state(v.status, v.publish_at, v.closes_at, v.closed_at) is not null
    ))
  );
create policy admin_profiles_update_own on public.admin_profiles for update to authenticated
  using (id = (select auth.uid()) and (select public.is_admin()))
  with check (id = (select auth.uid()) and (select public.is_admin()));

-- occupations ----------------------------------------------------------------
create policy occupations_select_anon on public.occupations for select to anon
  using (is_active);
create policy occupations_select_authenticated on public.occupations for select to authenticated
  using (is_active or (select public.is_admin()));
create policy occupations_insert_owner on public.occupations for insert to authenticated
  with check ((select public.is_owner()));
create policy occupations_update_owner on public.occupations for update to authenticated
  using ((select public.is_owner())) with check ((select public.is_owner()));
create policy occupations_delete_owner on public.occupations for delete to authenticated
  using ((select public.is_owner()));

-- vacancies ------------------------------------------------------------------
create policy vacancies_select_anon on public.vacancies for select to anon
  using (public.vacancy_public_state(status, publish_at, closes_at, closed_at) is not null);
create policy vacancies_select_authenticated on public.vacancies for select to authenticated
  using ((select public.is_admin()) or public.vacancy_public_state(status, publish_at, closes_at, closed_at) is not null);
create policy vacancies_insert_admin on public.vacancies for insert to authenticated
  with check ((select public.is_admin()));
create policy vacancies_update_admin on public.vacancies for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy vacancies_delete_owner on public.vacancies for delete to authenticated
  using (
    (select public.is_owner())
    and status = 'draft'
    and not exists (select 1 from public.applications a where a.vacancy_id = vacancies.id)
  );

-- vacancy_translations -------------------------------------------------------
-- Zichtbaar als de vacature voor de lezer zichtbaar is (RLS van vacancies geldt
-- in de subquery).
create policy vacancy_translations_select_anon on public.vacancy_translations for select to anon
  using (exists (select 1 from public.vacancies v where v.id = vacancy_translations.vacancy_id));
create policy vacancy_translations_select_authenticated on public.vacancy_translations for select to authenticated
  using (
    (select public.is_admin())
    or exists (select 1 from public.vacancies v where v.id = vacancy_translations.vacancy_id)
  );
create policy vacancy_translations_insert_admin on public.vacancy_translations for insert to authenticated
  with check ((select public.is_admin()));
create policy vacancy_translations_update_admin on public.vacancy_translations for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy vacancy_translations_delete_admin on public.vacancy_translations for delete to authenticated
  using ((select public.is_admin()));

-- applications, staff_requests, contact_messages -----------------------------
-- Geen policy voor anon: publieke formulieren schrijven via de secret key
-- (Server Action, spec 07).
create policy applications_select_admin on public.applications for select to authenticated
  using ((select public.is_admin()));
create policy applications_insert_admin on public.applications for insert to authenticated
  with check ((select public.is_admin()));
create policy applications_update_admin on public.applications for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy applications_delete_owner on public.applications for delete to authenticated
  using ((select public.is_owner()));

create policy staff_requests_select_admin on public.staff_requests for select to authenticated
  using ((select public.is_admin()));
create policy staff_requests_insert_admin on public.staff_requests for insert to authenticated
  with check ((select public.is_admin()));
create policy staff_requests_update_admin on public.staff_requests for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy staff_requests_delete_owner on public.staff_requests for delete to authenticated
  using ((select public.is_owner()));

create policy contact_messages_select_admin on public.contact_messages for select to authenticated
  using ((select public.is_admin()));
create policy contact_messages_insert_admin on public.contact_messages for insert to authenticated
  with check ((select public.is_admin()));
create policy contact_messages_update_admin on public.contact_messages for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy contact_messages_delete_owner on public.contact_messages for delete to authenticated
  using ((select public.is_owner()));

-- activities -----------------------------------------------------------------
create policy activities_select_admin on public.activities for select to authenticated
  using ((select public.is_admin()));
create policy activities_insert_admin on public.activities for insert to authenticated
  with check ((select public.is_admin()) and actor_id = (select auth.uid()));
create policy activities_update_owner on public.activities for update to authenticated
  using ((select public.is_owner())) with check ((select public.is_owner()));
create policy activities_delete_owner on public.activities for delete to authenticated
  using ((select public.is_owner()));

-- email_log, audit_log: alleen lezen door de eigenaar --------------------------
create policy email_log_select_owner on public.email_log for select to authenticated
  using ((select public.is_owner()));
create policy audit_log_select_owner on public.audit_log for select to authenticated
  using ((select public.is_owner()));

-- Rechten op tabellen ----------------------------------------------------------
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
grant select on public.occupations, public.vacancies, public.vacancy_translations, public.public_vacancies to anon;
grant select (id, display_name, phone_e164, whatsapp_e164, photo_path, is_active) on public.admin_profiles to anon;
grant select on public.public_vacancies to authenticated;
revoke insert, update, delete on public.admin_profiles from authenticated;
grant update (full_name, display_name, phone_e164, whatsapp_e164, photo_path,
  notify_applications, notify_staff_requests, notify_messages, last_seen_at) on public.admin_profiles to authenticated;
revoke insert, update, delete on public.email_log, public.audit_log from authenticated;
alter default privileges for role postgres in schema public revoke all on tables from anon;

-- Rechten op functies ----------------------------------------------------------
-- Systeemfuncties: alleen service_role (cron en scripts via de secret key).
revoke execute on function public.run_vacancy_lifecycle() from public, anon, authenticated;
revoke execute on function public.auto_close_stale_applications() from public, anon, authenticated;
revoke execute on function public.anonymize_applications(uuid[]) from public, anon, authenticated;
revoke execute on function public.purge_expired_records() from public, anon, authenticated;
revoke execute on function public.purge_logs() from public, anon, authenticated;
revoke execute on function public.grant_admin(text, text, text, public.admin_role, text, text) from public, anon, authenticated;
grant execute on function public.run_vacancy_lifecycle() to service_role;
grant execute on function public.auto_close_stale_applications() to service_role;
grant execute on function public.anonymize_applications(uuid[]) to service_role;
grant execute on function public.purge_expired_records() to service_role;
grant execute on function public.purge_logs() to service_role;
grant execute on function public.grant_admin(text, text, text, public.admin_role, text, text) to service_role;

-- RPC's voor de beheeromgeving: alleen ingelogde gebruikers (de functies
-- controleren zelf is_admin()). vacancy_publish_errors draait ook in de
-- publicatietrigger, dus service_role houdt het recht.
revoke execute on function public.save_vacancy(uuid, jsonb, jsonb) from public, anon;
revoke execute on function public.duplicate_vacancy(uuid) from public, anon;
revoke execute on function public.vacancy_publish_errors(uuid) from public, anon;
grant execute on function public.save_vacancy(uuid, jsonb, jsonb) to authenticated;
grant execute on function public.duplicate_vacancy(uuid) to authenticated;
grant execute on function public.vacancy_publish_errors(uuid) to authenticated, service_role;
