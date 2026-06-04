insert into storage.buckets (id, name, public)
values ('event-posters', 'event-posters', true)
on conflict (id) do update
set public = true;

drop policy if exists "event posters are public" on storage.objects;
create policy "event posters are public" on storage.objects
  for select using (bucket_id = 'event-posters');

drop policy if exists "organizers can upload own event posters" on storage.objects;
create policy "organizers can upload own event posters" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'event-posters'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "organizers can update own event posters" on storage.objects;
create policy "organizers can update own event posters" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'event-posters'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'event-posters'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
