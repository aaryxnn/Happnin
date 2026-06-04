create extension if not exists "pgcrypto";

create type organizer_type as enum ('club', 'student');
create type organizer_status as enum ('not_requested', 'pending', 'approved', 'rejected');
create type event_status as enum ('draft', 'published', 'cancelled');
create type report_target_type as enum ('event', 'user', 'organizer');
create type report_status as enum ('open', 'reviewed', 'dismissed');

create table campuses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  state text not null,
  allowed_domains text[] not null,
  latitude double precision not null,
  longitude double precision not null,
  created_at timestamptz not null default now()
);

create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  school_year text not null default '',
  campus_id uuid references campuses(id) on delete restrict,
  avatar_url text,
  interests text[] not null default '{}',
  club_tags text[] not null default '{}',
  visible_rsvps_default boolean not null default false,
  expo_push_token text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table clubs (
  id uuid primary key default gen_random_uuid(),
  campus_id uuid not null references campuses(id) on delete cascade,
  name text not null,
  description text not null default '',
  logo_url text,
  instagram text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table organizers (
  id uuid primary key default gen_random_uuid(),
  campus_id uuid not null references campuses(id) on delete cascade,
  display_name text not null,
  type organizer_type not null,
  verified boolean not null default false,
  verification_status organizer_status not null default 'pending',
  club_id uuid references clubs(id) on delete set null,
  owner_user_id uuid references users(id) on delete cascade,
  proof_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  campus_id uuid not null references campuses(id) on delete cascade,
  organizer_id uuid not null references organizers(id) on delete restrict,
  title text not null,
  description text not null,
  category text not null,
  image_url text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue_name text not null,
  address text not null,
  latitude double precision not null,
  longitude double precision not null,
  status event_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table event_images (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table event_rsvps (
  event_id uuid not null references events(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  visible boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references users(id) on delete cascade,
  target_type report_target_type not null,
  target_id uuid not null,
  reason text not null,
  status report_status not null default 'open',
  created_at timestamptz not null default now()
);

create table notification_preferences (
  user_id uuid primary key references users(id) on delete cascade,
  event_reminders boolean not null default true,
  trending_nearby boolean not null default true,
  organizer_updates boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index events_campus_starts_at_idx on events (campus_id, starts_at);
create index events_status_idx on events (status);
create index rsvps_user_idx on event_rsvps (user_id);
create index organizers_owner_idx on organizers (owner_user_id);

alter table campuses enable row level security;
alter table users enable row level security;
alter table clubs enable row level security;
alter table organizers enable row level security;
alter table events enable row level security;
alter table event_images enable row level security;
alter table event_rsvps enable row level security;
alter table reports enable row level security;
alter table notification_preferences enable row level security;

create policy "campuses are readable" on campuses for select using (true);
create policy "clubs are readable" on clubs for select using (true);
create policy "published events are readable" on events for select using (status = 'published');
create policy "event images are readable" on event_images for select using (true);
create policy "visible rsvps are readable" on event_rsvps for select using (visible = true);

create policy "users can read own profile" on users for select using (auth.uid() = id);
create policy "users can update own profile" on users for update using (auth.uid() = id);
create policy "users can create own profile" on users for insert with check (auth.uid() = id);

create policy "organizers are readable" on organizers for select using (true);
create policy "users can request organizer verification" on organizers
  for insert with check (auth.uid() = owner_user_id and verified = false);
create policy "users can update own pending organizer" on organizers
  for update using (auth.uid() = owner_user_id and verified = false);

create policy "verified organizers can create events" on events
  for insert with check (
    exists (
      select 1 from organizers
      where organizers.id = organizer_id
        and organizers.owner_user_id = auth.uid()
        and organizers.verified = true
    )
  );

create policy "verified organizers can update own events" on events
  for update using (
    exists (
      select 1 from organizers
      where organizers.id = organizer_id
        and organizers.owner_user_id = auth.uid()
        and organizers.verified = true
    )
  );

create policy "users can manage own rsvps" on event_rsvps
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users can create reports" on reports
  for insert with check (auth.uid() = reporter_id);
create policy "users can read own reports" on reports
  for select using (auth.uid() = reporter_id);

create policy "users can manage own notification prefs" on notification_preferences
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  matched_campus_id uuid;
  email_domain text;
begin
  email_domain := split_part(new.email, '@', 2);

  select id into matched_campus_id
  from campuses
  where email_domain = any(allowed_domains)
  limit 1;

  if matched_campus_id is null then
    raise exception 'Email domain is not allowed for Happnin';
  end if;

  insert into public.users (id, email, campus_id)
  values (new.id, new.email, matched_campus_id);

  insert into public.notification_preferences (user_id)
  values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
