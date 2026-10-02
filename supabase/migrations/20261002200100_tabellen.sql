-- Migratie 2: tabellen, indexen en updated_at-triggers (spec 10 §5.3).
-- Telefoon altijd in E.164, e-mail altijd in kleine letters. Een check op een
-- nullable kolom geldt alleen als de kolom gevuld is.

create table public.admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null check (email = lower(email) and length(email) <= 254),
  full_name text not null check (length(btrim(full_name)) between 1 and 120),
  display_name text not null check (length(btrim(display_name)) between 1 and 40),
  phone_e164 text check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  whatsapp_e164 text check (whatsapp_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  photo_path text check (photo_path ~ '^contacts/[0-9a-f-]{36}\.(jpg|png|webp)$'),
  role public.admin_role not null default 'owner',
  is_active boolean not null default true,
  notify_applications boolean not null default true,
  notify_staff_requests boolean not null default true,
  notify_messages boolean not null default true,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.occupations (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name_nl text not null,
  plural_nl text not null,
  name_en text not null,
  plural_en text not null,
  sort_order smallint not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vacancies (
  id uuid primary key default gen_random_uuid(),
  number integer not null unique default nextval('public.vacancy_number_seq'),
  status public.vacancy_status not null default 'draft',
  occupation_slug text not null references public.occupations (slug) on update cascade,
  city text check (length(city) between 2 and 80),
  city_slug text,                                                   -- trigger
  postal_code text check (postal_code ~ '^[1-9][0-9]{3} ?[A-Z]{2}$'),
  province text not null default 'Zuid-Holland' check (province in ('Drenthe','Flevoland','Friesland','Gelderland',
    'Groningen','Limburg','Noord-Brabant','Noord-Holland','Overijssel','Utrecht','Zeeland','Zuid-Holland')),
  location_label text check (length(location_label) <= 60),
  positions_count smallint not null default 1 check (positions_count between 1 and 99),
  contract_type public.contract_type not null default 'temp_agency',
  hours_min smallint check (hours_min between 1 and 60),
  hours_max smallint check (hours_max between 1 and 60),
  shifts public.shift[] not null default '{}',
  salary_min numeric(6,2) check (salary_min between 5 and 100),     -- bruto per uur, euro
  salary_max numeric(6,2) check (salary_max between 5 and 100),
  salary_note text check (length(salary_note) <= 200),
  education_level public.education_level not null default 'none',
  experience_level public.experience_level not null default 'none',
  experience_months smallint check (experience_months between 1 and 120),
  required_qualifications public.qualification[] not null default '{}',
  preferred_qualifications public.qualification[] not null default '{}',
  training_offered public.qualification[] not null default '{}',   -- "wij regelen de opleiding"
  min_age_18 boolean not null default false,
  min_age_reason public.min_age_reason,
  start_asap boolean not null default true,
  start_date date,
  publish_at timestamptz,
  published_at timestamptz,                                         -- eerste keer online; datePosted
  closes_at timestamptz,                                            -- validThrough
  closed_at timestamptz,
  close_reason public.vacancy_close_reason,
  archived_at timestamptz,
  status_changed_at timestamptz not null default now(),
  is_featured boolean not null default false,
  is_urgent boolean not null default false,
  allow_whatsapp_apply boolean not null default true,
  contact_admin_id uuid references public.admin_profiles (id) on delete set null,
  image_path text check (image_path ~ '^vacancies/[0-9a-f-]{36}\.(jpg|png|webp)$'),
  created_by uuid references public.admin_profiles (id) on delete set null,
  updated_by uuid references public.admin_profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vacancies_hours_order check (hours_min is null or hours_max is null or hours_min <= hours_max),
  constraint vacancies_salary_order check (salary_min is null or salary_max is null or salary_min <= salary_max),
  constraint vacancies_min_age check (not min_age_18 or min_age_reason is not null),
  constraint vacancies_start check ((start_asap and start_date is null) or (not start_asap and start_date is not null)),
  constraint vacancies_quals_disjoint check (not (required_qualifications && preferred_qualifications)),
  constraint vacancies_live_has_close_date check (status not in ('scheduled','published','closed') or closes_at is not null),
  constraint vacancies_scheduled_has_publish_at check (status <> 'scheduled' or publish_at is not null),
  constraint vacancies_closed_has_reason check (status <> 'closed' or (closed_at is not null and close_reason is not null))
);

create table public.vacancy_translations (
  vacancy_id uuid not null references public.vacancies (id) on delete cascade,
  locale public.app_locale not null default 'nl',
  title text not null check (length(btrim(title)) between 2 and 80),     -- alleen de functie, zonder plaats
  slug text not null default '',                                            -- trigger
  summary text check (length(summary) <= 200),
  intro text check (length(intro) <= 1200),
  tasks text[] not null default '{}' check (cardinality(tasks) <= 10 and public.text_items_valid(tasks, 200)),
  requirements text[] not null default '{}' check (cardinality(requirements) <= 10 and public.text_items_valid(requirements, 200)),
  offer text[] not null default '{}' check (cardinality(offer) <= 10 and public.text_items_valid(offer, 200)),
  extra text check (length(extra) <= 1200),
  seo_title text check (length(seo_title) <= 60),
  seo_description text check (length(seo_description) <= 160),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (vacancy_id, locale)
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default '',                  -- trigger: S-2026-0001
  kind public.application_kind not null default 'vacancy',
  vacancy_id uuid references public.vacancies (id) on delete restrict,
  vacancy_number integer,                                     -- momentopname
  vacancy_title_snapshot text check (length(vacancy_title_snapshot) <= 80),
  occupation_slugs text[] not null default '{}',              -- interesse; bij een vacature het beroep daarvan
  status public.application_status not null default 'new',
  source public.application_source not null default 'website',
  first_name text check (length(btrim(first_name)) between 1 and 80),
  last_name text check (length(btrim(last_name)) between 1 and 120),   -- inclusief tussenvoegsel
  email text check (email = lower(email) and length(email) <= 254 and position('@' in email) > 1),
  phone_e164 text check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  city text check (length(btrim(city)) between 2 and 80),
  may_work_in_nl boolean,                                     -- B-17 ja of nee
  available_from date,
  has_driving_license_b boolean,
  message text check (length(message) <= 2000),
  cv_path text check (cv_path ~ '^applications/[0-9a-f-]{36}/[0-9a-f-]{36}\.(pdf|doc|docx)$'),
  cv_filename text check (length(cv_filename) <= 200),
  cv_mime text,
  cv_size integer check (cv_size between 1 and 10485760),
  locale public.app_locale not null default 'nl',
  utm jsonb check (utm is null or jsonb_typeof(utm) = 'object'),
  assigned_to uuid references public.admin_profiles (id) on delete set null,
  retention_consent boolean not null default false,
  retention_consent_at timestamptz,
  retention_consent_source public.consent_source,
  privacy_notice_version text check (length(privacy_notice_version) <= 40),
  submission_id uuid unique,                                  -- dubbele inzending afvangen
  status_changed_at timestamptz not null default now(),
  last_contact_at timestamptz,
  completed_at timestamptz,                                   -- start bewaartermijn
  retain_until timestamptz not null default now(),            -- trigger
  anonymized_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint applications_vacancy_kind check (kind <> 'vacancy' or vacancy_id is not null),
  constraint applications_registration_consent check (kind <> 'registration' or retention_consent or anonymized_at is not null),
  constraint applications_person check (anonymized_at is not null or (first_name is not null and last_name is not null and phone_e164 is not null)),
  constraint applications_website_fields check (source <> 'website' or anonymized_at is not null
    or (email is not null and city is not null and may_work_in_nl is not null)),
  constraint applications_cv_complete check ((cv_path is null) = (cv_size is null))
);

create table public.staff_requests (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default '',                  -- trigger: P-2026-0001
  status public.staff_request_status not null default 'new',
  company_name text not null check (length(btrim(company_name)) between 2 and 120),
  kvk_number text check (kvk_number ~ '^[0-9]{8}$'),
  contact_name text not null check (length(btrim(contact_name)) between 2 and 120),
  email text not null check (email = lower(email) and length(email) <= 254 and position('@' in email) > 1),
  phone_e164 text not null check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  occupation_slugs text[] not null default '{}',
  occupation_other text check (length(btrim(occupation_other)) between 2 and 120),
  headcount smallint not null check (headcount between 1 and 500),
  start_asap boolean not null default true,
  start_date date,
  duration public.request_duration not null default 'unknown',
  hours_per_week smallint check (hours_per_week between 1 and 60),
  work_city text not null check (length(btrim(work_city)) between 2 and 80),
  description text check (length(description) <= 2000),
  locale public.app_locale not null default 'nl',
  utm jsonb check (utm is null or jsonb_typeof(utm) = 'object'),
  assigned_to uuid references public.admin_profiles (id) on delete set null,
  privacy_notice_version text check (length(privacy_notice_version) <= 40),
  submission_id uuid unique,
  status_changed_at timestamptz not null default now(),
  retain_until timestamptz not null default now(),            -- trigger
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint staff_requests_occupation check (cardinality(occupation_slugs) > 0 or occupation_other is not null),
  constraint staff_requests_start check ((start_asap and start_date is null) or (not start_asap and start_date is not null))
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  status public.message_status not null default 'new',
  name text not null check (length(btrim(name)) between 2 and 120),
  email text check (email = lower(email) and length(email) <= 254 and position('@' in email) > 1),
  phone_e164 text check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  topic public.contact_topic not null default 'other',
  message text check (length(message) <= 2000),
  locale public.app_locale not null default 'nl',
  privacy_notice_version text check (length(privacy_notice_version) <= 40),
  submission_id uuid unique,
  handled_by uuid references public.admin_profiles (id) on delete set null,
  handled_at timestamptz,
  status_changed_at timestamptz not null default now(),
  retain_until timestamptz not null default now(),            -- trigger
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contact_messages_reachable check (email is not null or phone_e164 is not null),
  constraint contact_messages_callback check (topic <> 'callback' or phone_e164 is not null),
  constraint contact_messages_body check (topic = 'callback' or (message is not null and length(btrim(message)) >= 2))
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  entity_type public.entity_type not null,
  entity_id uuid not null,
  kind public.activity_kind not null,
  body text check (length(body) <= 4000),
  payload jsonb,
  actor_id uuid default auth.uid() references public.admin_profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.email_log (
  id bigint generated always as identity primary key,
  template text not null check (length(template) <= 60),
  to_hash text not null check (to_hash ~ '^[0-9a-f]{64}$'),   -- sha-256 van het kleine-letteradres (spec 11)
  entity_type public.entity_type,
  entity_id uuid,
  provider_message_id text,
  status public.email_status not null default 'queued',
  error text check (length(error) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  actor_id uuid,
  actor_type public.audit_actor not null,
  action text not null check (action ~ '^[a-z_]+\.[a-z_]+$'),
  entity_type text,
  entity_id uuid,
  changes jsonb,                                              -- veldnamen en statussen, nooit inhoud van persoonsgegevens
  ip_hash text
);

-- Indexen (naast primaire sleutels en unique).
create index vacancies_status_publish_idx on public.vacancies (status, publish_at);
create index vacancies_status_closes_idx on public.vacancies (status, closes_at);
create index vacancies_occupation_idx on public.vacancies (occupation_slug);
create index vacancies_city_slug_idx on public.vacancies (city_slug);
create index vacancies_contact_idx on public.vacancies (contact_admin_id);
create index vacancies_created_by_idx on public.vacancies (created_by);
create index vacancies_updated_by_idx on public.vacancies (updated_by);
create unique index vacancy_translations_locale_slug_key on public.vacancy_translations (locale, slug);
create index applications_status_created_idx on public.applications (status, created_at desc);
create index applications_vacancy_idx on public.applications (vacancy_id);
create index applications_email_idx on public.applications (email);
create index applications_phone_idx on public.applications (phone_e164);
create index applications_retain_idx on public.applications (retain_until) where anonymized_at is null;
create index applications_assigned_idx on public.applications (assigned_to);
create index staff_requests_status_created_idx on public.staff_requests (status, created_at desc);
create index staff_requests_retain_idx on public.staff_requests (retain_until);
create index staff_requests_assigned_idx on public.staff_requests (assigned_to);
create index contact_messages_status_created_idx on public.contact_messages (status, created_at desc);
create index contact_messages_retain_idx on public.contact_messages (retain_until);
create index contact_messages_handled_by_idx on public.contact_messages (handled_by);
create index activities_entity_idx on public.activities (entity_type, entity_id, created_at desc);
create index activities_actor_idx on public.activities (actor_id);
create index email_log_created_idx on public.email_log (created_at);
create index email_log_entity_idx on public.email_log (entity_type, entity_id);
create index audit_log_occurred_idx on public.audit_log (occurred_at);
create index audit_log_entity_idx on public.audit_log (entity_type, entity_id);

-- updated_at bij elke update (alle tabellen behalve activities en audit_log).
create trigger admin_profiles_set_updated_at before update on public.admin_profiles
  for each row execute function public.set_updated_at();
create trigger occupations_set_updated_at before update on public.occupations
  for each row execute function public.set_updated_at();
create trigger vacancies_set_updated_at before update on public.vacancies
  for each row execute function public.set_updated_at();
create trigger vacancy_translations_set_updated_at before update on public.vacancy_translations
  for each row execute function public.set_updated_at();
create trigger applications_set_updated_at before update on public.applications
  for each row execute function public.set_updated_at();
create trigger staff_requests_set_updated_at before update on public.staff_requests
  for each row execute function public.set_updated_at();
create trigger contact_messages_set_updated_at before update on public.contact_messages
  for each row execute function public.set_updated_at();
create trigger email_log_set_updated_at before update on public.email_log
  for each row execute function public.set_updated_at();
