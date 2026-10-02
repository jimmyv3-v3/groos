-- Migratie 4: view public_vacancies (spec 10 §5.7).
-- security_invoker: de RLS van de onderliggende tabellen geldt voor de lezer.

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
  v.min_age_18, v.min_age_reason, v.start_asap, v.start_date,
  v.published_at, v.closes_at, v.is_featured, v.is_urgent, v.allow_whatsapp_apply, v.image_path,
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
