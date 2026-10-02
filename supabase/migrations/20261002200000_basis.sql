-- Migratie 1: basis (spec 10 §5.2).
-- Extensie unaccent, hulpfuncties, enums en sequences.

create extension if not exists unaccent with schema extensions;

create or replace function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

create or replace function public.slugify(p_text text) returns text
language sql stable set search_path = '' as $$
  select trim(both '-' from regexp_replace(lower(extensions.unaccent(coalesce(p_text, ''))), '[^a-z0-9]+', '-', 'g'))
$$;

create or replace function public.normalize_city(p_city text) returns text
language sql immutable set search_path = '' as $$
  select case
    when p_city is null or btrim(p_city) = '' then null
    when lower(btrim(p_city)) in ('den haag', '''s-gravenhage', 's-gravenhage', 'gravenhage', 'the hague') then 'Den Haag'
    else regexp_replace(btrim(p_city), '\s+', ' ', 'g')
  end
$$;

create or replace function public.text_items_valid(p_items text[], p_max_len integer) returns boolean
language sql immutable set search_path = '' as $$
  select coalesce(bool_and(length(btrim(i)) between 1 and p_max_len), true) from unnest(p_items) as i
$$;

create or replace function public.vacancy_slug(p_title text, p_city_slug text, p_number integer) returns text
language sql stable set search_path = '' as $$
  with t as (select public.slugify(p_title) as s)
  select concat_ws('-',
    nullif(t.s, ''),
    case when p_city_slug is null or t.s like '%' || p_city_slug then null else p_city_slug end,
    p_number::text)
  from t
$$;

create type public.admin_role as enum ('owner', 'recruiter');
create type public.app_locale as enum ('nl', 'en');
create type public.vacancy_status as enum ('draft', 'scheduled', 'published', 'closed', 'archived');
create type public.vacancy_close_reason as enum ('filled', 'expired', 'withdrawn', 'other');
create type public.contract_type as enum ('temp_agency', 'secondment', 'recruitment');
create type public.shift as enum ('early', 'day', 'evening', 'night', 'weekend');
create type public.education_level as enum ('none', 'vmbo', 'mbo1', 'mbo2', 'mbo3', 'mbo4', 'havo_vwo', 'hbo', 'wo');
create type public.experience_level as enum ('none', 'nice_to_have', 'required');
create type public.qualification as enum ('vca_basis', 'vca_vol', 'heftruck', 'reachtruck', 'ept', 'ipaf', 'vog',
  'rijbewijs_b', 'rijbewijs_be', 'rijbewijs_c', 'code_95', 'ras', 'dav');
create type public.min_age_reason as enum ('work_at_height', 'construction_demolition', 'forklift', 'night_work', 'hazardous_substances');
create type public.application_kind as enum ('vacancy', 'registration');
create type public.application_status as enum ('new', 'in_progress', 'invited', 'placed', 'rejected', 'withdrawn');
create type public.application_source as enum ('website', 'whatsapp', 'phone', 'walk_in', 'email', 'referral', 'job_board', 'other');
create type public.consent_source as enum ('form', 'phone', 'email', 'in_person');
create type public.staff_request_status as enum ('new', 'in_progress', 'quote_sent', 'started', 'completed', 'cancelled');
create type public.request_duration as enum ('one_day', 'days', 'weeks', 'months', 'indefinite', 'unknown');
create type public.contact_topic as enum ('job_seeker', 'employer', 'callback', 'other');
create type public.message_status as enum ('new', 'answered', 'archived', 'spam');
create type public.entity_type as enum ('vacancy', 'application', 'staff_request', 'contact_message');
create type public.activity_kind as enum ('note', 'status_change', 'call', 'whatsapp', 'email_sent', 'cv_viewed',
  'assigned', 'consent_recorded', 'auto_closed');
create type public.email_status as enum ('queued', 'sent', 'delivered', 'bounced', 'failed');
create type public.audit_actor as enum ('admin', 'system', 'public');

create sequence public.vacancy_number_seq start with 1001 minvalue 1001;
create sequence public.application_reference_seq;
create sequence public.staff_request_reference_seq;
