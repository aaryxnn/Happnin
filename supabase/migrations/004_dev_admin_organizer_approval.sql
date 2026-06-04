create table if not exists dev_admin_users (
  email text primary key,
  note text,
  created_at timestamptz not null default now()
);

alter table dev_admin_users enable row level security;

revoke all on table dev_admin_users from anon, authenticated;

create or replace function public.dev_approve_my_organizer_request(target_organizer_id uuid)
returns public.organizers
language plpgsql
security definer
set search_path = public
as $$
declare
  requester_email text;
  approved_organizer public.organizers;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to approve a dev organizer request.';
  end if;

  requester_email := lower(coalesce(auth.jwt() ->> 'email', ''));

  if requester_email = '' or not exists (
    select 1
    from public.dev_admin_users
    where lower(email) = requester_email
  ) then
    raise exception 'Dev admin approval is not enabled for this account.';
  end if;

  update public.organizers
  set
    verified = true,
    verification_status = 'approved',
    updated_at = now()
  where id = target_organizer_id
    and owner_user_id = auth.uid()
    and verification_status = 'pending'
  returning * into approved_organizer;

  if not found then
    raise exception 'No pending organizer request found for your account.';
  end if;

  return approved_organizer;
end;
$$;

revoke all on function public.dev_approve_my_organizer_request(uuid) from public;
grant execute on function public.dev_approve_my_organizer_request(uuid) to authenticated;
