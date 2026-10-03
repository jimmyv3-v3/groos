-- Migratie 3: rolfuncties, publieke staat, levenscyclus, publicatiecontrole,
-- slug, bewaartermijnen, logboek en RPC's (spec 10 §5.4 tot en met §5.6).
-- Rechten op de functies staan in migratie 5.

-- ---------------------------------------------------------------------------
-- Rollen en publieke staat (§5.4)
-- ---------------------------------------------------------------------------

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select auth.jwt() ->> 'aal'), '') = 'aal2'
     and exists (select 1 from public.admin_profiles p where p.id = (select auth.uid()) and p.is_active)
$$;

create or replace function public.is_owner() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select auth.jwt() ->> 'aal'), '') = 'aal2'
     and exists (select 1 from public.admin_profiles p
                 where p.id = (select auth.uid()) and p.is_active and p.role = 'owner')
$$;

-- Termijn "30 dagen gesloten zichtbaar" (B-15): ook in run_vacancy_lifecycle en
-- CLOSED_VISIBLE_DAYS in lib/data/options.ts.
create or replace function public.vacancy_public_state(
  p_status public.vacancy_status, p_publish_at timestamptz, p_closes_at timestamptz, p_closed_at timestamptz
) returns text language sql stable set search_path = '' as $$
  select case
    when (p_status = 'published' or (p_status = 'scheduled' and p_publish_at is not null))
         and coalesce(p_publish_at, now()) <= now() and p_closes_at > now() then 'open'
    when p_status = 'published' and p_closes_at <= now() and p_closes_at > now() - interval '30 days' then 'closed'
    when p_status = 'closed' and p_closed_at > now() - interval '30 days' then 'closed'
    else null
  end
$$;

-- ---------------------------------------------------------------------------
-- Vacatures: levenscyclus en statusovergangen (§5.5)
-- ---------------------------------------------------------------------------

create or replace function public.vacancies_before_write() returns trigger
language plpgsql set search_path = '' as $$
declare
  v_from public.vacancy_status;
begin
  if tg_op = 'UPDATE' then
    v_from := old.status;
    if new.number <> old.number then
      raise exception using errcode = 'P0001', message = 'vacancy_number_immutable';
    end if;
  end if;

  new.city := public.normalize_city(new.city);
  new.city_slug := nullif(public.slugify(new.city), '');

  if auth.uid() is not null then
    new.updated_by := auth.uid();
    if tg_op = 'INSERT' then
      new.created_by := coalesce(new.created_by, auth.uid());
    end if;
  end if;

  if tg_op = 'UPDATE' and new.status is distinct from old.status then
    if not ((v_from = 'draft' and new.status in ('scheduled', 'published', 'archived'))
         or (v_from = 'scheduled' and new.status in ('draft', 'published'))
         or (v_from = 'published' and new.status in ('draft', 'closed'))
         or (v_from = 'closed' and new.status in ('published', 'archived'))
         or (v_from = 'archived' and new.status = 'draft')) then
      raise exception using errcode = 'P0001',
        message = 'vacancy_invalid_transition:' || v_from || '_' || new.status;
    end if;
    new.status_changed_at := now();
  end if;

  if tg_op = 'INSERT' or new.status is distinct from v_from then
    if new.status = 'published' then
      new.publish_at := least(coalesce(new.publish_at, now()), now());
      new.published_at := coalesce(new.published_at, now());
      -- Termijn 45 dagen (B-15): ook VACANCY_DEFAULT_CLOSE_DAYS in lib/data/options.ts.
      if new.closes_at is null or new.closes_at <= now() then
        new.closes_at := now() + interval '45 days';
      end if;
      new.closed_at := null;
      new.close_reason := null;
      new.archived_at := null;
    elsif new.status = 'scheduled' then
      if new.publish_at is null or new.publish_at <= now() then
        raise exception using errcode = 'P0001', message = 'vacancy_not_publishable:publish_at';
      end if;
      if new.closes_at is null or new.closes_at <= new.publish_at then
        new.closes_at := new.publish_at + interval '45 days';
      end if;
      new.closed_at := null;
      new.close_reason := null;
      new.archived_at := null;
    elsif new.status = 'closed' then
      new.closed_at := coalesce(new.closed_at, now());
      new.close_reason := coalesce(new.close_reason, 'other');
    elsif new.status = 'archived' then
      new.archived_at := coalesce(new.archived_at, now());
    elsif new.status = 'draft' and tg_op = 'UPDATE' then
      new.publish_at := null;
      new.closes_at := null;
      new.closed_at := null;
      new.close_reason := null;
      new.archived_at := null;
    end if;
  end if;

  return new;
end $$;

create trigger vacancies_before_write before insert or update on public.vacancies
  for each row execute function public.vacancies_before_write();

-- ---------------------------------------------------------------------------
-- Slug: <functie>-<plaats>-<nummer> (B-15)
-- ---------------------------------------------------------------------------

create or replace function public.vacancy_translations_before_write() returns trigger
language plpgsql set search_path = '' as $$
declare
  v_city_slug text;
  v_number integer;
begin
  select v.city_slug, v.number into v_city_slug, v_number
  from public.vacancies v where v.id = new.vacancy_id;
  new.slug := public.vacancy_slug(new.title, v_city_slug, v_number);
  return new;
end $$;

create trigger vacancy_translations_before_write before insert or update of title on public.vacancy_translations
  for each row execute function public.vacancy_translations_before_write();

create or replace function public.vacancies_after_city_change() returns trigger
language plpgsql set search_path = '' as $$
begin
  update public.vacancy_translations t
     set slug = public.vacancy_slug(t.title, new.city_slug, new.number)
   where t.vacancy_id = new.id;
  return null;
end $$;

create trigger vacancies_after_city_change after update of city on public.vacancies
  for each row when (old.city_slug is distinct from new.city_slug)
  execute function public.vacancies_after_city_change();

-- ---------------------------------------------------------------------------
-- Publicatiecontrole (B-06)
-- ---------------------------------------------------------------------------

create or replace function public.vacancy_publish_errors(p_vacancy_id uuid) returns text[]
language sql stable set search_path = '' as $$
  select array_remove(array[
    case when t.title is null then 'title' end,
    case when v.city is null then 'city' end,
    case when v.hours_min is null or v.hours_max is null then 'hours' end,
    case when v.salary_min is null or v.salary_max is null then 'salary' end,
    case when coalesce(length(btrim(t.intro)), 0) < 20 then 'intro' end,
    case when coalesce(cardinality(t.tasks), 0) < 3 then 'tasks' end,
    case when coalesce(cardinality(t.requirements), 0) < 1 then 'requirements' end,
    case when coalesce(cardinality(t.offer), 0) < 1 then 'offer' end,
    case when not v.start_asap and v.start_date is null then 'start' end,
    case when p.id is null then 'contact' end
  ], null)
  from public.vacancies v
  left join public.vacancy_translations t on t.vacancy_id = v.id and t.locale = 'nl'
  left join public.admin_profiles p on p.id = v.contact_admin_id and p.is_active
  where v.id = p_vacancy_id
$$;

create or replace function public.assert_vacancy_publishable() returns trigger
language plpgsql set search_path = '' as $$
declare
  v_id uuid;
  v_status public.vacancy_status;
  v_errors text[];
begin
  -- Twee aparte toewijzingen: NEW heeft per tabel andere velden.
  if tg_table_name = 'vacancies' then
    v_id := new.id;
  else
    v_id := new.vacancy_id;
  end if;
  select status into v_status from public.vacancies where id = v_id;
  if v_status in ('scheduled', 'published') then
    v_errors := public.vacancy_publish_errors(v_id);
    if cardinality(v_errors) > 0 then
      raise exception using errcode = 'P0001',
        message = 'vacancy_not_publishable:' || array_to_string(v_errors, ',');
    end if;
  end if;
  return null;
end $$;

create constraint trigger vacancies_publishable after insert or update on public.vacancies
  deferrable initially deferred for each row execute function public.assert_vacancy_publishable();
create constraint trigger vacancy_translations_publishable after insert or update on public.vacancy_translations
  deferrable initially deferred for each row when (new.locale = 'nl')
  execute function public.assert_vacancy_publishable();

-- ---------------------------------------------------------------------------
-- Sollicitaties (B-07)
-- ---------------------------------------------------------------------------

-- Termijnen 28, 84 en 365 dagen: ook RETENTION_DAYS in lib/data/options.ts.
create or replace function public.application_retain_until(
  p_kind public.application_kind, p_created_at timestamptz, p_last_contact_at timestamptz,
  p_completed_at timestamptz, p_consent boolean, p_consent_at timestamptz
) returns timestamptz language sql immutable set search_path = '' as $$
  select case
    when p_kind = 'registration' then coalesce(p_consent_at, p_created_at) + interval '365 days'
    when p_completed_at is not null then p_completed_at + case when p_consent then interval '365 days' else interval '28 days' end
    else coalesce(p_last_contact_at, p_created_at) + interval '84 days'
         + case when p_consent then interval '365 days' else interval '28 days' end
  end
$$;

create or replace function public.applications_before_write() returns trigger
language plpgsql set search_path = '' as $$
declare
  v_status_changed boolean := false;
begin
  if tg_op = 'INSERT' then
    new.reference := 'S-' || to_char(now() at time zone 'Europe/Amsterdam', 'YYYY') || '-'
      || lpad(nextval('public.application_reference_seq')::text, 4, '0');
    if new.status in ('placed', 'rejected', 'withdrawn') then
      new.completed_at := coalesce(new.completed_at, now());
    end if;
  elsif new.status is distinct from old.status then
    v_status_changed := true;
  end if;

  new.email := lower(btrim(new.email));

  if v_status_changed then
    new.status_changed_at := now();
    if auth.uid() is not null then
      new.last_contact_at := now();
    end if;
    if new.status in ('placed', 'rejected', 'withdrawn') then
      if old.status not in ('placed', 'rejected', 'withdrawn') then
        new.completed_at := now();
      end if;
    else
      new.completed_at := null;
    end if;
  end if;

  if new.retention_consent then
    if new.retention_consent_at is null then
      new.retention_consent_at := now();
      new.retention_consent_source := coalesce(new.retention_consent_source, 'form');
    end if;
  else
    new.retention_consent_at := null;
    new.retention_consent_source := null;
  end if;

  if new.anonymized_at is null then
    new.retain_until := public.application_retain_until(
      new.kind, new.created_at, new.last_contact_at, new.completed_at,
      new.retention_consent, new.retention_consent_at);
  end if;

  return new;
end $$;

create trigger applications_before_write before insert or update on public.applications
  for each row execute function public.applications_before_write();

create or replace function public.applications_after_status_change() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.status is distinct from old.status and auth.uid() is not null then
    insert into public.activities (entity_type, entity_id, kind, payload, actor_id)
    values ('application', new.id, 'status_change',
            jsonb_build_object('from', old.status, 'to', new.status), auth.uid());
  end if;
  return null;
end $$;

create trigger applications_after_status_change after update of status on public.applications
  for each row execute function public.applications_after_status_change();

create or replace function public.assert_occupation_slugs() returns trigger
language plpgsql set search_path = '' as $$
begin
  if exists (
    select 1 from unnest(new.occupation_slugs) as s(slug)
    where not exists (select 1 from public.occupations o where o.slug = s.slug)
  ) then
    raise exception using errcode = '23503', message = 'unknown_occupation';
  end if;
  return new;
end $$;

create trigger applications_assert_occupation_slugs before insert or update of occupation_slugs on public.applications
  for each row execute function public.assert_occupation_slugs();
create trigger staff_requests_assert_occupation_slugs before insert or update of occupation_slugs on public.staff_requests
  for each row execute function public.assert_occupation_slugs();

-- ---------------------------------------------------------------------------
-- Aanvragen en berichten
-- ---------------------------------------------------------------------------

create or replace function public.staff_requests_before_write() returns trigger
language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    new.reference := 'P-' || to_char(now() at time zone 'Europe/Amsterdam', 'YYYY') || '-'
      || lpad(nextval('public.staff_request_reference_seq')::text, 4, '0');
  elsif new.status is distinct from old.status then
    new.status_changed_at := now();
  end if;
  new.email := lower(btrim(new.email));
  -- Termijn 730 dagen (B-07): ook RETENTION_DAYS.staffRequest.
  new.retain_until := new.status_changed_at + interval '730 days';
  return new;
end $$;

create trigger staff_requests_before_write before insert or update on public.staff_requests
  for each row execute function public.staff_requests_before_write();

create or replace function public.contact_messages_before_write() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.email := lower(btrim(new.email));
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    if tg_op = 'UPDATE' then
      new.status_changed_at := now();
    end if;
    if new.status in ('answered', 'archived') then
      new.handled_at := now();
      new.handled_by := coalesce(auth.uid(), new.handled_by);
    end if;
  end if;
  -- Termijnen 30 en 182 dagen: ook RETENTION_DAYS.spam en .contactMessage.
  if new.status = 'spam' then
    new.retain_until := new.status_changed_at + interval '30 days';
  else
    new.retain_until := coalesce(new.handled_at, new.created_at) + interval '182 days';
  end if;
  return new;
end $$;

create trigger contact_messages_before_write before insert or update on public.contact_messages
  for each row execute function public.contact_messages_before_write();

-- ---------------------------------------------------------------------------
-- Activiteiten
-- ---------------------------------------------------------------------------

create or replace function public.activities_after_insert() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.entity_type = 'application' and new.kind in ('note', 'call', 'whatsapp', 'email_sent') then
    update public.applications a
       set last_contact_at = now(),
           status = case when a.status = 'new' then 'in_progress'::public.application_status else a.status end
     where a.id = new.entity_id;
  end if;
  return null;
end $$;

create trigger activities_after_insert after insert on public.activities
  for each row execute function public.activities_after_insert();

create or replace function public.delete_entity_activities() returns trigger
language plpgsql set search_path = '' as $$
begin
  delete from public.activities a
   where a.entity_type = tg_argv[0]::public.entity_type and a.entity_id = old.id;
  return null;
end $$;

create trigger vacancies_delete_activities after delete on public.vacancies
  for each row execute function public.delete_entity_activities('vacancy');
create trigger applications_delete_activities after delete on public.applications
  for each row execute function public.delete_entity_activities('application');
create trigger staff_requests_delete_activities after delete on public.staff_requests
  for each row execute function public.delete_entity_activities('staff_request');
create trigger contact_messages_delete_activities after delete on public.contact_messages
  for each row execute function public.delete_entity_activities('contact_message');

-- ---------------------------------------------------------------------------
-- Logboek
-- ---------------------------------------------------------------------------

create or replace function public.write_audit_log() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  v_entity text := tg_argv[0];
  v_actor uuid := auth.uid();
  v_actor_type public.audit_actor;
  v_old jsonb;
  v_new jsonb;
  v_fields text[];
  v_action text;
  v_entity_id uuid;
  v_changes jsonb;
begin
  v_actor_type := case
    when v_actor is not null then 'admin'
    when tg_op = 'INSERT' and v_entity in ('application', 'staff_request', 'contact_message') then 'public'
    else 'system'
  end::public.audit_actor;

  if tg_op = 'INSERT' then
    v_new := to_jsonb(new);
    v_action := v_entity || '.created';
    v_entity_id := (v_new ->> 'id')::uuid;
  elsif tg_op = 'DELETE' then
    v_old := to_jsonb(old);
    v_action := v_entity || '.deleted';
    v_entity_id := (v_old ->> 'id')::uuid;
  else
    v_old := to_jsonb(old);
    v_new := to_jsonb(new);
    v_entity_id := (v_new ->> 'id')::uuid;
    if v_old ->> 'anonymized_at' is null and v_new ->> 'anonymized_at' is not null then
      v_action := v_entity || '.anonymized';
    elsif (v_old ->> 'status') is distinct from (v_new ->> 'status') then
      v_action := v_entity || '.status_changed';
      v_changes := jsonb_build_object('from', v_old ->> 'status', 'to', v_new ->> 'status');
    else
      select array_agg(k order by k) into v_fields
      from jsonb_object_keys(v_new) as k
      where k <> 'updated_at' and (v_old -> k) is distinct from (v_new -> k);
      -- Niet loggen als alleen updated_at, last_contact_at of retain_until veranderde.
      if v_fields is null
         or not exists (select 1 from unnest(v_fields) f where f not in ('last_contact_at', 'retain_until')) then
        return null;
      end if;
      v_action := v_entity || '.updated';
      v_changes := jsonb_build_object('fields', to_jsonb(v_fields));
    end if;
  end if;

  insert into public.audit_log (actor_id, actor_type, action, entity_type, entity_id, changes)
  values (v_actor, v_actor_type, v_action, v_entity, v_entity_id, v_changes);
  return null;
end $$;

create trigger vacancies_audit after insert or update or delete on public.vacancies
  for each row execute function public.write_audit_log('vacancy');
create trigger applications_audit after insert or update or delete on public.applications
  for each row execute function public.write_audit_log('application');
create trigger staff_requests_audit after insert or update or delete on public.staff_requests
  for each row execute function public.write_audit_log('staff_request');
create trigger contact_messages_audit after insert or update or delete on public.contact_messages
  for each row execute function public.write_audit_log('contact_message');

-- Termijn 2 jaar (B-07): ook purge_logs en RETENTION_DAYS.auditLog.
create or replace function public.audit_log_protect() returns trigger
language plpgsql set search_path = '' as $$
begin
  if tg_op = 'UPDATE' then
    raise exception 'audit_log kan alleen worden aangevuld';
  end if;
  if old.occurred_at > now() - interval '2 years' then
    raise exception 'regels in audit_log blijven twee jaar bewaard';
  end if;
  return old;
end $$;

create trigger audit_log_protect before update or delete on public.audit_log
  for each row execute function public.audit_log_protect();

-- ---------------------------------------------------------------------------
-- RPC's voor de beheeromgeving (spec 08). Security invoker: RLS geldt.
-- ---------------------------------------------------------------------------

create or replace function public.save_vacancy(p_id uuid, p_vacancy jsonb, p_nl jsonb)
returns table (vacancy_id uuid, vacancy_number integer, vacancy_slug text)
language plpgsql set search_path = '' as $$
#variable_conflict use_column
declare
  v public.vacancies;
  t public.vacancy_translations;
  v_id uuid;
  v_number integer;
begin
  if not public.is_admin() then
    raise exception using errcode = '42501', message = 'not_admin';
  end if;

  v := jsonb_populate_record(null::public.vacancies, coalesce(p_vacancy, '{}'::jsonb));
  t := jsonb_populate_record(null::public.vacancy_translations, coalesce(p_nl, '{}'::jsonb));

  if v.occupation_slug is null
     or not exists (select 1 from public.occupations o where o.slug = v.occupation_slug) then
    raise exception using errcode = '23503', message = 'unknown_occupation';
  end if;

  if p_id is null then
    insert into public.vacancies (
      occupation_slug, city, postal_code, province, location_label, positions_count, contract_type,
      hours_min, hours_max, shifts, salary_min, salary_max, salary_note, education_level, experience_level,
      experience_months, required_qualifications, preferred_qualifications, training_offered, min_age_18,
      min_age_reason, start_asap, start_date, publish_at, closes_at, is_featured, is_urgent,
      allow_whatsapp_apply, contact_admin_id, image_path)
    values (
      v.occupation_slug, v.city, v.postal_code, coalesce(v.province, 'Zuid-Holland'), v.location_label,
      coalesce(v.positions_count, 1), coalesce(v.contract_type, 'temp_agency'),
      v.hours_min, v.hours_max, coalesce(v.shifts, '{}'), v.salary_min, v.salary_max, v.salary_note,
      coalesce(v.education_level, 'none'), coalesce(v.experience_level, 'none'), v.experience_months,
      coalesce(v.required_qualifications, '{}'), coalesce(v.preferred_qualifications, '{}'),
      coalesce(v.training_offered, '{}'), coalesce(v.min_age_18, false), v.min_age_reason,
      coalesce(v.start_asap, true), v.start_date, v.publish_at, v.closes_at,
      coalesce(v.is_featured, false), coalesce(v.is_urgent, false), coalesce(v.allow_whatsapp_apply, true),
      v.contact_admin_id, v.image_path)
    returning id, number into v_id, v_number;
  else
    update public.vacancies x set
      occupation_slug = v.occupation_slug,
      city = v.city,
      postal_code = v.postal_code,
      province = coalesce(v.province, 'Zuid-Holland'),
      location_label = v.location_label,
      positions_count = coalesce(v.positions_count, 1),
      contract_type = coalesce(v.contract_type, 'temp_agency'),
      hours_min = v.hours_min,
      hours_max = v.hours_max,
      shifts = coalesce(v.shifts, '{}'),
      salary_min = v.salary_min,
      salary_max = v.salary_max,
      salary_note = v.salary_note,
      education_level = coalesce(v.education_level, 'none'),
      experience_level = coalesce(v.experience_level, 'none'),
      experience_months = v.experience_months,
      required_qualifications = coalesce(v.required_qualifications, '{}'),
      preferred_qualifications = coalesce(v.preferred_qualifications, '{}'),
      training_offered = coalesce(v.training_offered, '{}'),
      min_age_18 = coalesce(v.min_age_18, false),
      min_age_reason = v.min_age_reason,
      start_asap = coalesce(v.start_asap, true),
      start_date = v.start_date,
      publish_at = v.publish_at,
      closes_at = v.closes_at,
      is_featured = coalesce(v.is_featured, false),
      is_urgent = coalesce(v.is_urgent, false),
      allow_whatsapp_apply = coalesce(v.allow_whatsapp_apply, true),
      contact_admin_id = v.contact_admin_id,
      image_path = v.image_path
    where x.id = p_id
    returning x.id, x.number into v_id, v_number;
    if v_id is null then
      raise exception using errcode = 'P0002', message = 'vacancy_not_found';
    end if;
  end if;

  insert into public.vacancy_translations as vt (
    vacancy_id, locale, title, summary, intro, tasks, requirements, offer, extra, seo_title, seo_description)
  values (
    v_id, 'nl', t.title, t.summary, t.intro, coalesce(t.tasks, '{}'), coalesce(t.requirements, '{}'),
    coalesce(t.offer, '{}'), t.extra, t.seo_title, t.seo_description)
  on conflict (vacancy_id, locale) do update set
    title = excluded.title,
    summary = excluded.summary,
    intro = excluded.intro,
    tasks = excluded.tasks,
    requirements = excluded.requirements,
    offer = excluded.offer,
    extra = excluded.extra,
    seo_title = excluded.seo_title,
    seo_description = excluded.seo_description;

  return query
    select v_id, v_number, s.slug
    from public.vacancy_translations s
    where s.vacancy_id = v_id and s.locale = 'nl';
end $$;

create or replace function public.duplicate_vacancy(p_id uuid)
returns table (vacancy_id uuid, vacancy_number integer)
language plpgsql set search_path = '' as $$
#variable_conflict use_column
declare
  v_id uuid;
  v_number integer;
begin
  if not public.is_admin() then
    raise exception using errcode = '42501', message = 'not_admin';
  end if;

  insert into public.vacancies (
    occupation_slug, city, postal_code, province, location_label, positions_count, contract_type,
    hours_min, hours_max, shifts, salary_min, salary_max, salary_note, education_level, experience_level,
    experience_months, required_qualifications, preferred_qualifications, training_offered, min_age_18,
    min_age_reason, start_asap, start_date, is_featured, is_urgent, allow_whatsapp_apply,
    contact_admin_id, image_path)
  select
    s.occupation_slug, s.city, s.postal_code, s.province, s.location_label, s.positions_count, s.contract_type,
    s.hours_min, s.hours_max, s.shifts, s.salary_min, s.salary_max, s.salary_note, s.education_level,
    s.experience_level, s.experience_months, s.required_qualifications, s.preferred_qualifications,
    s.training_offered, s.min_age_18, s.min_age_reason, s.start_asap, s.start_date, false, s.is_urgent,
    s.allow_whatsapp_apply, s.contact_admin_id, s.image_path
  from public.vacancies s
  where s.id = p_id
  returning id, number into v_id, v_number;

  if v_id is null then
    raise exception using errcode = 'P0002', message = 'vacancy_not_found';
  end if;

  insert into public.vacancy_translations (
    vacancy_id, locale, title, summary, intro, tasks, requirements, offer, extra, seo_title, seo_description)
  select v_id, s.locale, left(s.title, 72) || ' (kopie)', s.summary, s.intro, s.tasks, s.requirements,
         s.offer, s.extra, s.seo_title, s.seo_description
  from public.vacancy_translations s
  where s.vacancy_id = p_id;

  return query select v_id, v_number;
end $$;

-- ---------------------------------------------------------------------------
-- Systeemfuncties (alleen service_role, zie migratie 5)
-- ---------------------------------------------------------------------------

create or replace function public.run_vacancy_lifecycle()
returns table (event text, vacancy_number integer)
language plpgsql security definer set search_path = '' as $$
#variable_conflict use_column
declare
  r record;
  v_errors text[];
begin
  -- 1. Gepland naar online, als de vacature aan B-06 voldoet.
  for r in
    select v.id, v.number from public.vacancies v
    where v.status = 'scheduled' and v.publish_at <= now()
    order by v.publish_at
    for update
  loop
    v_errors := public.vacancy_publish_errors(r.id);
    if coalesce(cardinality(v_errors), 0) = 0 then
      update public.vacancies set status = 'published' where id = r.id;
      event := 'published';
      vacancy_number := r.number;
      return next;
    else
      insert into public.audit_log (actor_type, action, entity_type, entity_id, changes)
      values ('system', 'vacancy.publish_failed', 'vacancy', r.id, jsonb_build_object('errors', to_jsonb(v_errors)));
    end if;
  end loop;

  -- 2. Verlopen naar gesloten.
  return query
    with u as (
      update public.vacancies
         set status = 'closed', close_reason = 'expired', closed_at = closes_at
       where status = 'published' and closes_at <= now()
      returning number
    )
    select 'closed'::text, u.number from u;

  -- 3. Langer dan 30 dagen gesloten naar gearchiveerd (B-15).
  return query
    with u as (
      update public.vacancies
         set status = 'archived'
       where status = 'closed' and closed_at <= now() - interval '30 days'
      returning number
    )
    select 'archived'::text, u.number from u;
end $$;

create or replace function public.auto_close_stale_applications() returns integer
language plpgsql security definer set search_path = '' as $$
declare
  v_count integer;
begin
  -- Termijn 84 dagen (B-07): ook RETENTION_DAYS.staleAutoClose.
  with stale as (
    update public.applications a
       set status = case when a.kind = 'registration'
                         then 'withdrawn'::public.application_status
                         else 'rejected'::public.application_status end
     where a.status in ('new', 'in_progress', 'invited')
       and a.anonymized_at is null
       and coalesce(a.last_contact_at, a.created_at) < now() - interval '84 days'
    returning a.id
  ), logged as (
    insert into public.activities (entity_type, entity_id, kind, body, actor_id)
    select 'application', stale.id, 'auto_closed',
           'Automatisch afgesloten na 12 weken zonder contact.', null
    from stale
    returning 1
  )
  select count(*) into v_count from logged;
  return v_count;
end $$;

create or replace function public.anonymize_applications(p_ids uuid[]) returns integer
language plpgsql security definer set search_path = '' as $$
declare
  v_count integer;
begin
  with anonymized as (
    update public.applications a set
      first_name = null, last_name = null, email = null, phone_e164 = null, city = null,
      may_work_in_nl = null, available_from = null, has_driving_license_b = null, message = null,
      utm = null, cv_path = null, cv_filename = null, cv_mime = null, cv_size = null,
      assigned_to = null, anonymized_at = now()
    where a.id = any(p_ids) and a.anonymized_at is null and a.retain_until <= now()
    returning a.id
  ), removed as (
    delete from public.activities x
     where x.entity_type = 'application' and x.entity_id in (select id from anonymized)
  )
  select count(*) into v_count from anonymized;
  return v_count;
end $$;

create or replace function public.purge_expired_records() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_staff integer;
  v_messages integer;
begin
  with d as (delete from public.staff_requests where retain_until <= now() returning 1)
  select count(*) into v_staff from d;
  with d as (delete from public.contact_messages where retain_until <= now() returning 1)
  select count(*) into v_messages from d;
  return jsonb_build_object('staff_requests', v_staff, 'contact_messages', v_messages);
end $$;

create or replace function public.purge_logs() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_email integer;
  v_audit integer;
begin
  -- Termijnen 90 dagen en 2 jaar (B-07): ook RETENTION_DAYS.emailLog en .auditLog.
  with d as (delete from public.email_log where created_at < now() - interval '90 days' returning 1)
  select count(*) into v_email from d;
  with d as (delete from public.audit_log where occurred_at <= now() - interval '2 years' returning 1)
  select count(*) into v_audit from d;
  return jsonb_build_object('email_log', v_email, 'audit_log', v_audit);
end $$;

create or replace function public.grant_admin(
  p_email text, p_full_name text, p_display_name text, p_role public.admin_role default 'owner',
  p_phone text default null, p_whatsapp text default null
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_email text := lower(btrim(p_email));
begin
  select u.id into v_id from auth.users u where lower(u.email) = v_email;
  if v_id is null then
    raise exception using errcode = 'P0002', message = 'user_not_found:' || v_email;
  end if;

  insert into public.admin_profiles as p (id, email, full_name, display_name, role, phone_e164, whatsapp_e164, is_active)
  values (v_id, v_email, p_full_name, p_display_name, coalesce(p_role, 'owner'), p_phone,
          coalesce(p_whatsapp, p_phone), true)
  on conflict (id) do update set
    email = excluded.email,
    full_name = excluded.full_name,
    display_name = excluded.display_name,
    role = excluded.role,
    phone_e164 = coalesce(excluded.phone_e164, p.phone_e164),
    whatsapp_e164 = coalesce(excluded.whatsapp_e164, p.whatsapp_e164),
    is_active = true;

  return v_id;
end $$;
