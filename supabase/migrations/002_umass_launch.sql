alter table campuses
  add column if not exists slug text,
  add column if not exists short_name text,
  add column if not exists status text not null default 'coming_soon',
  add column if not exists timezone text not null default 'America/New_York',
  add column if not exists sort_order integer not null default 100;

update campuses
set
  slug = coalesce(slug, lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))),
  short_name = coalesce(short_name, name);

alter table campuses alter column slug set not null;
alter table campuses alter column short_name set not null;

create unique index if not exists campuses_slug_key on campuses (slug);
create index if not exists campuses_status_sort_idx on campuses (status, sort_order);
create index if not exists events_campus_status_starts_at_idx on events (campus_id, status, starts_at);
create index if not exists events_campus_category_starts_at_idx on events (campus_id, category, starts_at);
create index if not exists event_rsvps_event_idx on event_rsvps (event_id);

insert into campuses (id, slug, short_name, name, city, state, allowed_domains, latitude, longitude, status, timezone, sort_order)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'umass-amherst',
    'UMass',
    'University of Massachusetts Amherst',
    'Amherst',
    'MA',
    array['umass.edu'],
    42.3868,
    -72.5301,
    'live',
    'America/New_York',
    1
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'amherst-college',
    'Amherst',
    'Amherst College',
    'Amherst',
    'MA',
    array['amherst.edu'],
    42.3709,
    -72.5160,
    'coming_soon',
    'America/New_York',
    2
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'smith-college',
    'Smith',
    'Smith College',
    'Northampton',
    'MA',
    array['smith.edu'],
    42.3181,
    -72.6381,
    'coming_soon',
    'America/New_York',
    3
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'mount-holyoke',
    'Mount Holyoke',
    'Mount Holyoke College',
    'South Hadley',
    'MA',
    array['mtholyoke.edu'],
    42.2568,
    -72.5745,
    'coming_soon',
    'America/New_York',
    4
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'hampshire-college',
    'Hampshire',
    'Hampshire College',
    'Amherst',
    'MA',
    array['hampshire.edu'],
    42.3264,
    -72.5320,
    'coming_soon',
    'America/New_York',
    5
  )
on conflict (id) do update
set
  slug = excluded.slug,
  short_name = excluded.short_name,
  name = excluded.name,
  city = excluded.city,
  state = excluded.state,
  allowed_domains = excluded.allowed_domains,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  status = excluded.status,
  timezone = excluded.timezone,
  sort_order = excluded.sort_order;

create or replace view event_feed as
select
  e.id,
  e.campus_id,
  e.organizer_id,
  o.display_name as organizer_name,
  o.verified as organizer_verified,
  e.title,
  e.description,
  e.category,
  e.image_url,
  e.starts_at,
  e.ends_at,
  e.venue_name,
  e.address,
  e.latitude,
  e.longitude,
  e.status,
  e.created_at,
  count(r.user_id)::integer as rsvp_count,
  coalesce(
    jsonb_agg(
      distinct jsonb_build_object(
        'user_id', u.id,
        'full_name', u.full_name,
        'avatar_url', u.avatar_url
      )
    ) filter (where r.visible = true and u.id is not null),
    '[]'::jsonb
  ) as visible_attendees
from events e
join organizers o on o.id = e.organizer_id
left join event_rsvps r on r.event_id = e.id
left join users u on u.id = r.user_id and r.visible = true
where e.status = 'published'
group by e.id, o.display_name, o.verified;

grant select on event_feed to anon, authenticated;

insert into clubs (id, campus_id, name, description, logo_url, instagram, verified)
values
  (
    '11111111-1111-1111-1111-111111111201',
    '11111111-1111-1111-1111-111111111111',
    'UMass Nightlife Board',
    'Student-run social events, themed nights, and weekend campus pop-ups.',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',
    '@umassnightlife',
    true
  ),
  (
    '11111111-1111-1111-1111-111111111202',
    '11111111-1111-1111-1111-111111111111',
    'UMass Outing Club',
    'Outdoor trips, bonfires, hikes, and low-key social hangs around Amherst.',
    'https://images.unsplash.com/photo-1478827387698-1527781a4887?auto=format&fit=crop&w=900&q=80',
    '@umassoutingclub',
    true
  ),
  (
    '11111111-1111-1111-1111-111111111203',
    '11111111-1111-1111-1111-111111111111',
    'UMass Dance Collective',
    'Workshops, socials, and performance nights for the UMass dance community.',
    'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80',
    '@umassdance',
    true
  )
on conflict (id) do update
set
  campus_id = excluded.campus_id,
  name = excluded.name,
  description = excluded.description,
  logo_url = excluded.logo_url,
  instagram = excluded.instagram,
  verified = excluded.verified;

insert into organizers (id, campus_id, display_name, type, verified, verification_status, club_id)
values
  (
    '11111111-1111-1111-1111-111111111301',
    '11111111-1111-1111-1111-111111111111',
    'UMass Nightlife Board',
    'club',
    true,
    'approved',
    '11111111-1111-1111-1111-111111111201'
  ),
  (
    '11111111-1111-1111-1111-111111111302',
    '11111111-1111-1111-1111-111111111111',
    'UMass Outing Club',
    'club',
    true,
    'approved',
    '11111111-1111-1111-1111-111111111202'
  ),
  (
    '11111111-1111-1111-1111-111111111303',
    '11111111-1111-1111-1111-111111111111',
    'UMass Dance Collective',
    'club',
    true,
    'approved',
    '11111111-1111-1111-1111-111111111203'
  )
on conflict (id) do update
set
  campus_id = excluded.campus_id,
  display_name = excluded.display_name,
  type = excluded.type,
  verified = excluded.verified,
  verification_status = excluded.verification_status,
  club_id = excluded.club_id;

insert into events (
  id,
  campus_id,
  organizer_id,
  title,
  description,
  category,
  image_url,
  starts_at,
  ends_at,
  venue_name,
  address,
  latitude,
  longitude,
  status
)
values
  (
    '11111111-1111-1111-1111-111111111401',
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111301',
    'UMass Friday Social',
    'A campus-first Friday night social with student DJs, photo moments, and late-night food nearby.',
    'Parties',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    now() + interval '8 hours',
    now() + interval '12 hours',
    'Campus Center',
    '1 Campus Center Way, Amherst, MA',
    42.3910,
    -72.5267,
    'published'
  ),
  (
    '11111111-1111-1111-1111-111111111402',
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111303',
    'Beginner Dance Social',
    'Beginner-friendly dance workshop followed by an open social. No partner or experience needed.',
    'Clubs',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    now() + interval '28 hours',
    now() + interval '31 hours',
    'Student Union Ballroom',
    '41 Campus Center Way, Amherst, MA',
    42.3902,
    -72.5273,
    'published'
  ),
  (
    '11111111-1111-1111-1111-111111111403',
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111302',
    'Amherst Sunset Bonfire Meetup',
    'Meet near Haigis Mall for a low-key outdoor hang, snacks, and rides to a nearby bonfire spot.',
    'Food',
    'https://images.unsplash.com/photo-1478827387698-1527781a4887?auto=format&fit=crop&w=1200&q=80',
    now() + interval '52 hours',
    now() + interval '57 hours',
    'Haigis Mall',
    'Haigis Mall, Amherst, MA',
    42.3860,
    -72.5307,
    'published'
  )
on conflict (id) do update
set
  campus_id = excluded.campus_id,
  organizer_id = excluded.organizer_id,
  title = excluded.title,
  description = excluded.description,
  category = excluded.category,
  image_url = excluded.image_url,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  venue_name = excluded.venue_name,
  address = excluded.address,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  status = excluded.status;
