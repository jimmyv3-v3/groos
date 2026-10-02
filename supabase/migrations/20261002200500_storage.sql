-- Migratie 6: Storage-buckets en policies (spec 10 §5.9).
-- cvs: privé, 10 MB, pdf, doc en docx. Uploaden alleen met een signed upload
-- token dat de server na BotID uitgeeft; lezen via signed URL van 60 seconden.
-- public-media: openbaar, 5 MB, jpg, png en webp, mappen contacts, vacancies
-- en occupations. Bestanden altijd via de Storage API verwijderen.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('cvs', 'cvs', false, 10485760, array['application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('public-media', 'public-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Eén policy per actie voor beide buckets samen (geen meervoudige permissive
-- policies). Anon heeft geen policy: publieke beelden gaan via de publieke URL.
create policy groos_objects_select on storage.objects for select to authenticated
  using (
    (select public.is_admin())
    and (
      bucket_id = 'cvs'
      or (bucket_id = 'public-media' and (storage.foldername(name))[1] in ('contacts', 'vacancies', 'occupations'))
    )
  );

create policy groos_objects_insert on storage.objects for insert to authenticated
  with check (
    (select public.is_admin())
    and (
      (bucket_id = 'cvs' and (storage.foldername(name))[1] = 'applications')
      or (bucket_id = 'public-media' and (storage.foldername(name))[1] in ('contacts', 'vacancies', 'occupations'))
    )
  );

create policy groos_objects_update on storage.objects for update to authenticated
  using (
    (select public.is_admin())
    and bucket_id = 'public-media' and (storage.foldername(name))[1] in ('contacts', 'vacancies', 'occupations')
  )
  with check (
    (select public.is_admin())
    and bucket_id = 'public-media' and (storage.foldername(name))[1] in ('contacts', 'vacancies', 'occupations')
  );

create policy groos_objects_delete on storage.objects for delete to authenticated
  using (
    (bucket_id = 'cvs' and (select public.is_owner()))
    or (
      bucket_id = 'public-media' and (select public.is_admin())
      and (storage.foldername(name))[1] in ('contacts', 'vacancies', 'occupations')
    )
  );
