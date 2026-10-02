-- RLS-rooktest (spec 10 §10 stap 13). Draai met `npm run db:test` tegen
-- groos-dev, na migraties en seed. Alles staat in één transactie die eindigt
-- met rollback; elk geval gooit een exception als de uitkomst niet klopt.
-- Dekt AC-10-04 tot en met AC-10-08 en AC-10-21.

begin;

-- Testaccounts (verdwijnen bij de rollback).
insert into auth.users (id, email, aud, role) values
  ('00000000-0000-4000-8000-0000000000a1', 'rls-owner@example.com', 'authenticated', 'authenticated'),
  ('00000000-0000-4000-8000-0000000000a2', 'rls-recruiter@example.com', 'authenticated', 'authenticated'),
  ('00000000-0000-4000-8000-0000000000a3', 'rls-inactief@example.com', 'authenticated', 'authenticated');
insert into public.admin_profiles (id, email, full_name, display_name, role, is_active) values
  ('00000000-0000-4000-8000-0000000000a1', 'rls-owner@example.com', 'RLS Owner', 'Owner', 'owner', true),
  ('00000000-0000-4000-8000-0000000000a2', 'rls-recruiter@example.com', 'RLS Recruiter', 'Recruiter', 'recruiter', true),
  ('00000000-0000-4000-8000-0000000000a3', 'rls-inactief@example.com', 'RLS Inactief', 'Inactief', 'owner', false);

-- Verwachte aantallen als postgres, voor de vergelijking hieronder.
do $$ begin perform set_config('rls.applications', (select count(*)::text from public.applications), true); end $$;

-- ---------------------------------------------------------------------------
-- Anoniem (AC-10-04 tot en met AC-10-07)
-- ---------------------------------------------------------------------------
set local role anon;
do $$ begin perform set_config('request.jwt.claims', '{"role":"anon"}', true); end $$;

do $$
declare
  v_open int[];
  v_closed int[];
begin
  select array_agg(number order by number) into v_open from public.public_vacancies where state = 'open';
  select array_agg(number order by number) into v_closed from public.public_vacancies where state = 'closed';
  if v_open is distinct from array[1001, 1002, 1003, 1004, 1005, 1006] then
    raise exception 'AC-10-04: open vacatures %', v_open;
  end if;
  if v_closed is distinct from array[1007] then
    raise exception 'AC-10-04: gesloten vacatures %', v_closed;
  end if;
  if exists (select 1 from public.vacancies where status = 'draft') then
    raise exception 'AC-10-05: anon ziet een concept';
  end if;
end $$;

do $$
begin
  begin
    perform 1 from public.applications;
    raise exception 'AC-10-05: anon kan applications lezen';
  exception when insufficient_privilege then null;
  end;
  begin
    perform 1 from public.audit_log;
    raise exception 'AC-10-05: anon kan audit_log lezen';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.contact_messages (name, phone_e164, topic) values ('Anoniem', '+31600000009', 'callback');
    raise exception 'AC-10-06: anon kan in contact_messages schrijven';
  exception when insufficient_privilege then null;
  end;
  begin
    perform email from public.admin_profiles;
    raise exception 'AC-10-07: anon kan admin_profiles.email lezen';
  exception when insufficient_privilege then null;
  end;
  if not exists (select 1 from public.admin_profiles) then
    raise exception 'AC-10-07: anon ziet geen enkele contactpersoon';
  end if;
  if exists (
    select 1 from public.admin_profiles p
    where not exists (
      select 1 from public.vacancies v
      where v.contact_admin_id = p.id and v.number between 1001 and 1007
    )
  ) then
    raise exception 'AC-10-07: anon ziet een profiel dat geen contactpersoon is van een publieke vacature';
  end if;
end $$;

reset role;

-- ---------------------------------------------------------------------------
-- Beheerders (AC-10-08)
-- ---------------------------------------------------------------------------
set local role authenticated;

-- Actief profiel met alleen aal1: niets.
do $$ begin perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000a1","role":"authenticated","aal":"aal1"}', true); end $$;
do $$
begin
  if (select count(*) from public.applications) <> 0 then
    raise exception 'AC-10-08: aal1 ziet sollicitaties';
  end if;
  if not exists (select 1 from public.admin_profiles where id = '00000000-0000-4000-8000-0000000000a1') then
    raise exception 'AC-10-08: aal1 ziet zijn eigen profiel niet';
  end if;
end $$;

-- Eigenaar met aal2: alle sollicitaties en het logboek.
do $$ begin perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000a1","role":"authenticated","aal":"aal2"}', true); end $$;
do $$
begin
  if (select count(*) from public.applications) <> current_setting('rls.applications')::bigint then
    raise exception 'AC-10-08: owner met aal2 ziet niet alle sollicitaties';
  end if;
  if (select count(*) from public.audit_log) = 0 then
    raise exception 'AC-10-08: owner ziet geen audit_log';
  end if;
end $$;

-- Inactief profiel met aal2: niets.
do $$ begin perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000a3","role":"authenticated","aal":"aal2"}', true); end $$;
do $$
begin
  if (select count(*) from public.applications) <> 0 then
    raise exception 'AC-10-08: inactief profiel ziet sollicitaties';
  end if;
end $$;

-- Recruiter met aal2: sollicitaties wel, logboek niet.
do $$ begin perform set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-0000000000a2","role":"authenticated","aal":"aal2"}', true); end $$;
do $$
begin
  if (select count(*) from public.applications) <> current_setting('rls.applications')::bigint then
    raise exception 'AC-10-08: recruiter ziet niet alle sollicitaties';
  end if;
  if (select count(*) from public.audit_log) <> 0 then
    raise exception 'AC-10-08: recruiter ziet audit_log';
  end if;
end $$;

reset role;
do $$ begin perform set_config('request.jwt.claims', '', true); end $$;

-- ---------------------------------------------------------------------------
-- Logboek (AC-10-21), als postgres
-- ---------------------------------------------------------------------------
do $$
declare
  v_result jsonb;
begin
  begin
    update public.audit_log set action = 'x.y';
    raise exception 'AC-10-21: update op audit_log lukte';
  exception when raise_exception then
    if sqlerrm like 'AC-10-21%' then raise; end if;
  end;
  begin
    delete from public.audit_log where occurred_at > now() - interval '1 day';
    raise exception 'AC-10-21: delete van een recente regel lukte';
  exception when raise_exception then
    if sqlerrm like 'AC-10-21%' then raise; end if;
  end;

  insert into public.audit_log (occurred_at, actor_type, action) values (now() - interval '3 years', 'system', 'test.oud');
  insert into public.email_log (template, to_hash, created_at)
  values ('test', repeat('0', 64), now() - interval '91 days');
  v_result := public.purge_logs();
  if exists (select 1 from public.audit_log where action = 'test.oud') then
    raise exception 'AC-10-21: oude auditregel staat er nog (%)', v_result;
  end if;
  if exists (select 1 from public.email_log where template = 'test') then
    raise exception 'AC-10-21: oude e-maillogregel staat er nog (%)', v_result;
  end if;
end $$;

select 'rls_smoke: alle gevallen geslaagd' as resultaat;

rollback;
