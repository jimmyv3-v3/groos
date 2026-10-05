-- Migratie 9: tweestapsverificatie is per account optioneel (B-62).
-- Een beheerder zonder geverifieerde factor werkt met alleen een wachtwoord
-- (aal1). Wie een authenticator-app heeft gekoppeld, heeft nog steeds aal2
-- nodig. Vervangt de vaste aal2-eis in is_admin() en is_owner() uit migratie 3;
-- de rechten op beide functies blijven die van migratie 5.

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select (coalesce((select auth.jwt() ->> 'aal'), '') = 'aal2'
          or not exists (select 1 from auth.mfa_factors f
                         where f.user_id = (select auth.uid()) and f.status = 'verified'))
     and exists (select 1 from public.admin_profiles p where p.id = (select auth.uid()) and p.is_active)
$$;

create or replace function public.is_owner() returns boolean
language sql stable security definer set search_path = '' as $$
  select (coalesce((select auth.jwt() ->> 'aal'), '') = 'aal2'
          or not exists (select 1 from auth.mfa_factors f
                         where f.user_id = (select auth.uid()) and f.status = 'verified'))
     and exists (select 1 from public.admin_profiles p
                 where p.id = (select auth.uid()) and p.is_active and p.role = 'owner')
$$;
