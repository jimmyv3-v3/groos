-- Migratie 8: wijzigingen uit kruiscontrole ronde 1 (spec 10 §5.1, bouwstap 3b).
-- Bestaande migraties blijven ongewijzigd (B-39). Punten (1) tot en met (8)
-- volgen de nummering van spec 10 §5.1.

-- ---------------------------------------------------------------------------
-- (1) Bewaartermijn: registratietak (B-07). Een inschrijving blijft 365 dagen
-- na de toestemming bewaard, of 28 dagen na afsluiten (handmatig of
-- automatisch na 12 weken zonder contact) als dat eerder is.
-- ---------------------------------------------------------------------------
create or replace function public.application_retain_until(
  p_kind public.application_kind, p_created_at timestamptz, p_last_contact_at timestamptz,
  p_completed_at timestamptz, p_consent boolean, p_consent_at timestamptz
) returns timestamptz language sql immutable set search_path = '' as $$
  select case
    when p_kind = 'registration' then least(coalesce(p_consent_at, p_created_at) + interval '365 days',
         coalesce(p_completed_at, coalesce(p_last_contact_at, p_created_at) + interval '84 days') + interval '28 days')
    when p_completed_at is not null then p_completed_at + case when p_consent then interval '365 days' else interval '28 days' end
    else coalesce(p_last_contact_at, p_created_at) + interval '84 days'
         + case when p_consent then interval '365 days' else interval '28 days' end
  end
$$;

-- ---------------------------------------------------------------------------
-- (2) Referenties: lpad zonder afkappen vanaf nummer 10000
-- (S-\d{4}-\d{4,} en P-\d{4}-\d{4,}). Het volgnummer wordt alleen bij
-- een insert opgehaald, zodat updates geen nummers verbruiken.
-- ---------------------------------------------------------------------------
create or replace function public.applications_before_write() returns trigger
language plpgsql set search_path = '' as $$
declare
  v_n bigint;
  v_status_changed boolean := false;
begin
  if tg_op = 'INSERT' then
    v_n := nextval('public.application_reference_seq');
    new.reference := 'S-' || to_char(now() at time zone 'Europe/Amsterdam', 'YYYY') || '-'
      || lpad(v_n::text, greatest(4, length(v_n::text)), '0');
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

create or replace function public.staff_requests_before_write() returns trigger
language plpgsql set search_path = '' as $$
declare
  v_n bigint;
begin
  if tg_op = 'INSERT' then
    v_n := nextval('public.staff_request_reference_seq');
    new.reference := 'P-' || to_char(now() at time zone 'Europe/Amsterdam', 'YYYY') || '-'
      || lpad(v_n::text, greatest(4, length(v_n::text)), '0');
  elsif new.status is distinct from old.status then
    new.status_changed_at := now();
  end if;
  new.email := lower(btrim(new.email));
  -- Termijn 730 dagen (B-07): ook RETENTION_DAYS.staffRequest.
  new.retain_until := new.status_changed_at + interval '730 days';
  return new;
end $$;

-- ---------------------------------------------------------------------------
-- (3) Taal op het werk: nullable, niet verplicht om te publiceren.
-- ---------------------------------------------------------------------------
create type public.workplace_language as enum ('nl', 'en', 'nl_or_en');
alter table public.vacancies add column workplace_language public.workplace_language;

-- ---------------------------------------------------------------------------
-- (4) Kwalificaties zonder 'dav' (VR-13). De view gaat eerst weg; per kolom
-- eerst de standaard eraf, dan het nieuwe type, dan de standaard terug.
-- ---------------------------------------------------------------------------
drop view public.public_vacancies;

alter type public.qualification rename to qualification_old;
create type public.qualification as enum ('vca_basis', 'vca_vol', 'heftruck', 'reachtruck', 'ept', 'ipaf', 'vog',
  'rijbewijs_b', 'rijbewijs_be', 'rijbewijs_c', 'code_95', 'ras');

-- De drie kolommen in één alter table per stap: de check vacancies_quals_disjoint
-- vergelijkt twee van deze kolommen en wordt pas na alle typewijzigingen opnieuw gebouwd.
alter table public.vacancies
  alter column required_qualifications drop default,
  alter column preferred_qualifications drop default,
  alter column training_offered drop default;
alter table public.vacancies
  alter column required_qualifications
    type public.qualification[] using required_qualifications::text[]::public.qualification[],
  alter column preferred_qualifications
    type public.qualification[] using preferred_qualifications::text[]::public.qualification[],
  alter column training_offered
    type public.qualification[] using training_offered::text[]::public.qualification[];
alter table public.vacancies
  alter column required_qualifications set default '{}',
  alter column preferred_qualifications set default '{}',
  alter column training_offered set default '{}';

drop type public.qualification_old;

-- ---------------------------------------------------------------------------
-- (5) View public_vacancies opnieuw, met workplace_language en een
-- published_at die ook voor een geplande, al open vacature gevuld is.
-- ---------------------------------------------------------------------------
create view public.public_vacancies with (security_invoker = true) as
select
  v.id, v.number, t.slug, t.title, t.summary, t.intro, t.tasks, t.requirements, t.offer, t.extra,
  t.seo_title, t.seo_description,
  v.occupation_slug, o.name_nl as occupation_name_nl, o.plural_nl as occupation_plural_nl,
  o.name_en as occupation_name_en, o.plural_en as occupation_plural_en,
  v.city, v.city_slug, v.postal_code, v.province, v.location_label, v.positions_count,
  v.contract_type, v.hours_min, v.hours_max, v.shifts, v.salary_min, v.salary_max, v.salary_note,
  v.education_level, v.experience_level, v.experience_months,
  v.required_qualifications, v.preferred_qualifications, v.training_offered,
  v.min_age_18, v.min_age_reason, v.start_asap, v.start_date, v.workplace_language,
  coalesce(v.published_at, v.publish_at) as published_at, v.closes_at, v.is_featured, v.is_urgent, v.allow_whatsapp_apply, v.image_path,
  c.display_name as contact_name, c.phone_e164 as contact_phone, c.whatsapp_e164 as contact_whatsapp,
  c.photo_path as contact_photo_path,
  s.state,
  case when s.state = 'closed' then coalesce(v.closed_at, v.closes_at) end as closed_at,
  case when s.state = 'closed' then coalesce(v.close_reason, 'expired') end as close_reason,
  greatest(v.updated_at, t.updated_at) as updated_at
from public.vacancies v
cross join lateral (select public.vacancy_public_state(v.status, v.publish_at, v.closes_at, v.closed_at) as state) s
join public.vacancy_translations t on t.vacancy_id = v.id and t.locale = 'nl'
join public.occupations o on o.slug = v.occupation_slug
left join public.admin_profiles c on c.id = v.contact_admin_id and c.is_active
where s.state is not null;

grant select on public.public_vacancies to anon;
grant select on public.public_vacancies to authenticated;

-- ---------------------------------------------------------------------------
-- (6) save_vacancy met workplace_language en de closes_at-regel.
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
      min_age_reason, start_asap, start_date, workplace_language, publish_at, closes_at, is_featured, is_urgent,
      allow_whatsapp_apply, contact_admin_id, image_path)
    values (
      v.occupation_slug, v.city, v.postal_code, coalesce(v.province, 'Zuid-Holland'), v.location_label,
      coalesce(v.positions_count, 1), coalesce(v.contract_type, 'temp_agency'),
      v.hours_min, v.hours_max, coalesce(v.shifts, '{}'), v.salary_min, v.salary_max, v.salary_note,
      coalesce(v.education_level, 'none'), coalesce(v.experience_level, 'none'), v.experience_months,
      coalesce(v.required_qualifications, '{}'), coalesce(v.preferred_qualifications, '{}'),
      coalesce(v.training_offered, '{}'), coalesce(v.min_age_18, false), v.min_age_reason,
      coalesce(v.start_asap, true), v.start_date, v.workplace_language, v.publish_at, v.closes_at,
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
      workplace_language = v.workplace_language,
      publish_at = v.publish_at,
      -- Een leeg veld wist de sluitdatum van een geplande, gepubliceerde of gesloten vacature niet.
      closes_at = case when x.status in ('scheduled', 'published', 'closed')
                       then coalesce(v.closes_at, x.closes_at) else v.closes_at end,
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

-- duplicate_vacancy kopieert "dezelfde velden" (spec 10 §5.5), dus ook de nieuwe kolom.
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
    min_age_reason, start_asap, start_date, workplace_language, is_featured, is_urgent, allow_whatsapp_apply,
    contact_admin_id, image_path)
  select
    s.occupation_slug, s.city, s.postal_code, s.province, s.location_label, s.positions_count, s.contract_type,
    s.hours_min, s.hours_max, s.shifts, s.salary_min, s.salary_max, s.salary_note, s.education_level,
    s.experience_level, s.experience_months, s.required_qualifications, s.preferred_qualifications,
    s.training_offered, s.min_age_18, s.min_age_reason, s.start_asap, s.start_date, s.workplace_language, false, s.is_urgent,
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
-- (7) Bewaartermijn van bestaande rijen opnieuw berekenen.
-- ---------------------------------------------------------------------------
update public.applications set retain_until = public.application_retain_until(kind,
  created_at, last_contact_at, completed_at, retention_consent, retention_consent_at);

-- ---------------------------------------------------------------------------
-- (8) Publicatiecontrole: een contactpersoon met telefoonnummer is verplicht (B-21).
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
    case when p.id is null or p.phone_e164 is null then 'contact' end
  ], null)
  from public.vacancies v
  left join public.vacancy_translations t on t.vacancy_id = v.id and t.locale = 'nl'
  left join public.admin_profiles p on p.id = v.contact_admin_id and p.is_active
  where v.id = p_vacancy_id
$$;
