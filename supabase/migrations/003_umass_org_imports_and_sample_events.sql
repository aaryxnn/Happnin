alter table clubs
  add column if not exists source_system text,
  add column if not exists external_id text,
  add column if not exists source_url text,
  add column if not exists imported_at timestamptz,
  add column if not exists last_seen_at timestamptz,
  add column if not exists is_active boolean not null default true;

alter table events
  add column if not exists seed_rsvp_count integer not null default 0;

create table if not exists interest_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  sort_order integer not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists club_interest_categories (
  club_id uuid not null references clubs(id) on delete cascade,
  interest_category_id uuid not null references interest_categories(id) on delete cascade,
  primary key (club_id, interest_category_id)
);

create table if not exists campus_org_imports (
  id uuid primary key default gen_random_uuid(),
  campus_id uuid not null references campuses(id) on delete cascade,
  external_source text not null,
  external_id text not null,
  name text not null,
  short_name text,
  description text not null default '',
  source_url text,
  source_category_names text[] not null default '{}',
  suggested_interest_slugs text[] not null default '{}',
  review_status text not null default 'pending' check (review_status in ('pending', 'approved', 'rejected')),
  published_club_id uuid references clubs(id) on delete set null,
  imported_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique (campus_id, external_source, external_id)
);

create index if not exists clubs_campus_active_verified_idx on clubs (campus_id, is_active, verified, name);
create unique index if not exists clubs_campus_source_key on clubs (campus_id, source_system, external_id)
  where source_system is not null and external_id is not null;
create index if not exists club_interest_category_idx on club_interest_categories (interest_category_id, club_id);
create index if not exists campus_org_imports_review_idx on campus_org_imports (campus_id, review_status, name);

alter table interest_categories enable row level security;
alter table club_interest_categories enable row level security;
alter table campus_org_imports enable row level security;

drop policy if exists "clubs are readable" on clubs;
create policy "active verified clubs are readable" on clubs
  for select using (verified = true and is_active = true);

drop policy if exists "interest categories are readable" on interest_categories;
create policy "interest categories are readable" on interest_categories
  for select using (true);

drop policy if exists "club interest categories are readable" on club_interest_categories;
create policy "club interest categories are readable" on club_interest_categories
  for select using (
    exists (
      select 1 from clubs
      where clubs.id = club_interest_categories.club_id
        and clubs.verified = true
        and clubs.is_active = true
    )
  );

insert into interest_categories (id, slug, name, sort_order)
values
  ('21111111-1111-1111-1111-111111111001', 'sports-fitness', 'Sports & Fitness', 1),
  ('21111111-1111-1111-1111-111111111002', 'music-performance', 'Music & Performance', 2),
  ('21111111-1111-1111-1111-111111111003', 'arts-media', 'Arts & Media', 3),
  ('21111111-1111-1111-1111-111111111004', 'cultural-identity', 'Cultural & Identity', 4),
  ('21111111-1111-1111-1111-111111111005', 'academic', 'Academic', 5),
  ('21111111-1111-1111-1111-111111111006', 'business-career', 'Business & Career', 6),
  ('21111111-1111-1111-1111-111111111007', 'tech-gaming', 'Tech & Gaming', 7),
  ('21111111-1111-1111-1111-111111111008', 'service-advocacy', 'Service & Advocacy', 8),
  ('21111111-1111-1111-1111-111111111009', 'greek-life', 'Greek Life', 9),
  ('21111111-1111-1111-1111-111111111010', 'social-nightlife', 'Social & Nightlife', 10),
  ('21111111-1111-1111-1111-111111111011', 'food-lifestyle', 'Food & Lifestyle', 11),
  ('21111111-1111-1111-1111-111111111012', 'spiritual-wellness', 'Spiritual & Wellness', 12)
on conflict (id) do update
set slug = excluded.slug,
  name = excluded.name,
  sort_order = excluded.sort_order;

insert into campus_org_imports (
  campus_id,
  external_source,
  external_id,
  name,
  short_name,
  description,
  source_url,
  source_category_names,
  suggested_interest_slugs,
  review_status
)
values
  ('11111111-1111-1111-1111-111111111111', 'umass_engage_sample', 'ski-board', 'UMass Ski and Board Club', 'Ski & Board', 'Snow trips, watch parties, and winter social events for UMass students.', 'https://umassamherst.campuslabs.com/engage/organizations', array['Sports & Recreation'], array['sports-fitness', 'social-nightlife'], 'approved'),
  ('11111111-1111-1111-1111-111111111111', 'umass_engage_sample', 'running-club', 'UMass Running Club', 'Running Club', 'Group runs, races, and casual fitness meetups around Amherst.', 'https://umassamherst.campuslabs.com/engage/organizations', array['Sports & Recreation'], array['sports-fitness'], 'approved'),
  ('11111111-1111-1111-1111-111111111111', 'umass_engage_sample', 'wmua', 'WMUA 91.1 FM', 'WMUA', 'Student radio, music programming, live sessions, and campus media.', 'https://umassamherst.campuslabs.com/engage/organizations', array['Arts & Media Council'], array['music-performance', 'arts-media'], 'approved'),
  ('11111111-1111-1111-1111-111111111111', 'umass_engage_sample', 'theatre-guild', 'UMass Theatre Guild', 'Theatre Guild', 'Student-led theatre productions, open mics, and performance workshops.', 'https://umassamherst.campuslabs.com/engage/organizations', array['Arts & Media Council'], array['arts-media', 'music-performance'], 'approved'),
  ('11111111-1111-1111-1111-111111111111', 'umass_engage_sample', 'african-student-association', 'African Student Association', 'ASA', 'Cultural programming, socials, and community events celebrating African student life.', 'https://umassamherst.campuslabs.com/engage/organizations', array['Cultural Council'], array['cultural-identity', 'social-nightlife'], 'approved'),
  ('11111111-1111-1111-1111-111111111111', 'umass_engage_sample', 'latinx-american-cultural-center', 'Latinx American Cultural Collective', 'LACC', 'Cultural nights, mixers, and student community events.', 'https://umassamherst.campuslabs.com/engage/organizations', array['Cultural Council'], array['cultural-identity', 'social-nightlife'], 'approved'),
  ('11111111-1111-1111-1111-111111111111', 'umass_engage_sample', 'isenberg-marketing-club', 'Isenberg Marketing Club', 'Marketing Club', 'Career mixers, brand workshops, and student networking events.', 'https://umassamherst.campuslabs.com/engage/organizations', array['Academic Council'], array['business-career', 'academic'], 'approved'),
  ('11111111-1111-1111-1111-111111111111', 'umass_engage_sample', 'hackumass', 'HackUMass', 'HackUMass', 'Hackathons, tech nights, and builder meetups for students.', 'https://umassamherst.campuslabs.com/engage/organizations', array['Academic Council'], array['tech-gaming', 'academic'], 'approved'),
  ('11111111-1111-1111-1111-111111111111', 'umass_engage_sample', 'umass-esports', 'UMass Esports', 'Esports', 'Gaming tournaments, watch parties, and community play nights.', 'https://umassamherst.campuslabs.com/engage/organizations', array['Sports & Recreation'], array['tech-gaming', 'sports-fitness', 'social-nightlife'], 'approved'),
  ('11111111-1111-1111-1111-111111111111', 'umass_engage_sample', 'permaculture', 'UMass Permaculture', 'Permaculture', 'Food systems, sustainability workshops, and community garden events.', 'https://umassamherst.campuslabs.com/engage/organizations', array['Service & Engagement Council'], array['service-advocacy', 'food-lifestyle'], 'approved'),
  ('11111111-1111-1111-1111-111111111111', 'umass_engage_sample', 'campus-foodies', 'Campus Foodies at UMass', 'Campus Foodies', 'Food crawls, tasting nights, and student-made restaurant guides.', 'https://umassamherst.campuslabs.com/engage/organizations', array['Special Interest'], array['food-lifestyle', 'social-nightlife'], 'approved'),
  ('11111111-1111-1111-1111-111111111111', 'umass_engage_sample', 'mindfulness-club', 'UMass Mindfulness Club', 'Mindfulness', 'Meditation sessions, wellness socials, and study-break events.', 'https://umassamherst.campuslabs.com/engage/organizations', array['Religious & Spiritual Council'], array['spiritual-wellness'], 'approved')
on conflict (campus_id, external_source, external_id) do update
set name = excluded.name,
  short_name = excluded.short_name,
  description = excluded.description,
  source_url = excluded.source_url,
  source_category_names = excluded.source_category_names,
  suggested_interest_slugs = excluded.suggested_interest_slugs,
  review_status = excluded.review_status,
  last_seen_at = now();

insert into clubs (id, campus_id, name, description, logo_url, instagram, verified, source_system, external_id, source_url, imported_at, last_seen_at, is_active)
values
  ('11111111-1111-1111-1111-111111111201', '11111111-1111-1111-1111-111111111111', 'UMass Nightlife Board', 'Student-run social events, themed nights, and weekend campus pop-ups.', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80', '@umassnightlife', true, 'happnin_seed', 'nightlife-board', null, now(), now(), true),
  ('11111111-1111-1111-1111-111111111202', '11111111-1111-1111-1111-111111111111', 'UMass Outing Club', 'Outdoor trips, bonfires, hikes, and low-key social hangs around Amherst.', 'https://images.unsplash.com/photo-1478827387698-1527781a4887?auto=format&fit=crop&w=900&q=80', '@umassoutingclub', true, 'happnin_seed', 'outing-club', null, now(), now(), true),
  ('11111111-1111-1111-1111-111111111203', '11111111-1111-1111-1111-111111111111', 'UMass Dance Collective', 'Workshops, socials, and performance nights for the UMass dance community.', 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80', '@umassdance', true, 'happnin_seed', 'dance-collective', null, now(), now(), true),
  ('11111111-1111-1111-1111-111111111204', '11111111-1111-1111-1111-111111111111', 'UMass Ski and Board Club', 'Snow trips, winter socials, and watch parties for UMass students.', 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=900&q=80', '@umassskiandboard', true, 'umass_engage_sample', 'ski-board', 'https://umassamherst.campuslabs.com/engage/organizations', now(), now(), true),
  ('11111111-1111-1111-1111-111111111205', '11111111-1111-1111-1111-111111111111', 'UMass Running Club', 'Group runs, race weekends, and casual fitness meetups around Amherst.', 'https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=900&q=80', '@umassrunningclub', true, 'umass_engage_sample', 'running-club', 'https://umassamherst.campuslabs.com/engage/organizations', now(), now(), true),
  ('11111111-1111-1111-1111-111111111206', '11111111-1111-1111-1111-111111111111', 'WMUA 91.1 FM', 'Student radio, live sessions, DJ workshops, and campus media events.', 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80', '@wmua', true, 'umass_engage_sample', 'wmua', 'https://umassamherst.campuslabs.com/engage/organizations', now(), now(), true),
  ('11111111-1111-1111-1111-111111111207', '11111111-1111-1111-1111-111111111111', 'UMass Theatre Guild', 'Student-led theatre productions, open mics, and performance workshops.', 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&w=900&q=80', '@umasstheatreguild', true, 'umass_engage_sample', 'theatre-guild', 'https://umassamherst.campuslabs.com/engage/organizations', now(), now(), true),
  ('11111111-1111-1111-1111-111111111208', '11111111-1111-1111-1111-111111111111', 'African Student Association', 'Cultural programming, socials, and community events celebrating African student life.', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80', '@umassasa', true, 'umass_engage_sample', 'african-student-association', 'https://umassamherst.campuslabs.com/engage/organizations', now(), now(), true),
  ('11111111-1111-1111-1111-111111111209', '11111111-1111-1111-1111-111111111111', 'Latinx American Cultural Collective', 'Cultural nights, mixers, and student community events.', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80', '@umasslacc', true, 'umass_engage_sample', 'latinx-american-cultural-center', 'https://umassamherst.campuslabs.com/engage/organizations', now(), now(), true),
  ('11111111-1111-1111-1111-111111111210', '11111111-1111-1111-1111-111111111111', 'Isenberg Marketing Club', 'Career mixers, brand workshops, and student networking events.', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80', '@isenbergmarketing', true, 'umass_engage_sample', 'isenberg-marketing-club', 'https://umassamherst.campuslabs.com/engage/organizations', now(), now(), true),
  ('11111111-1111-1111-1111-111111111211', '11111111-1111-1111-1111-111111111111', 'HackUMass', 'Hackathons, tech nights, and builder meetups for students.', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80', '@hackumass', true, 'umass_engage_sample', 'hackumass', 'https://umassamherst.campuslabs.com/engage/organizations', now(), now(), true),
  ('11111111-1111-1111-1111-111111111212', '11111111-1111-1111-1111-111111111111', 'UMass Esports', 'Gaming tournaments, watch parties, and community play nights.', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80', '@umassesports', true, 'umass_engage_sample', 'umass-esports', 'https://umassamherst.campuslabs.com/engage/organizations', now(), now(), true),
  ('11111111-1111-1111-1111-111111111213', '11111111-1111-1111-1111-111111111111', 'UMass Permaculture', 'Food systems, sustainability workshops, and community garden events.', 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80', '@umasspermaculture', true, 'umass_engage_sample', 'permaculture', 'https://umassamherst.campuslabs.com/engage/organizations', now(), now(), true),
  ('11111111-1111-1111-1111-111111111214', '11111111-1111-1111-1111-111111111111', 'Campus Foodies at UMass', 'Food crawls, tasting nights, and student-made restaurant guides.', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80', '@umassfoodies', true, 'umass_engage_sample', 'campus-foodies', 'https://umassamherst.campuslabs.com/engage/organizations', now(), now(), true),
  ('11111111-1111-1111-1111-111111111215', '11111111-1111-1111-1111-111111111111', 'UMass Mindfulness Club', 'Meditation sessions, wellness socials, and study-break events.', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80', '@umassmindful', true, 'umass_engage_sample', 'mindfulness-club', 'https://umassamherst.campuslabs.com/engage/organizations', now(), now(), true)
on conflict (id) do update
set campus_id = excluded.campus_id,
  name = excluded.name,
  description = excluded.description,
  logo_url = excluded.logo_url,
  instagram = excluded.instagram,
  verified = excluded.verified,
  source_system = excluded.source_system,
  external_id = excluded.external_id,
  source_url = excluded.source_url,
  imported_at = coalesce(clubs.imported_at, excluded.imported_at),
  last_seen_at = excluded.last_seen_at,
  is_active = excluded.is_active;

insert into club_interest_categories (club_id, interest_category_id)
values
  ('11111111-1111-1111-1111-111111111201', '21111111-1111-1111-1111-111111111010'),
  ('11111111-1111-1111-1111-111111111201', '21111111-1111-1111-1111-111111111002'),
  ('11111111-1111-1111-1111-111111111202', '21111111-1111-1111-1111-111111111001'),
  ('11111111-1111-1111-1111-111111111202', '21111111-1111-1111-1111-111111111011'),
  ('11111111-1111-1111-1111-111111111203', '21111111-1111-1111-1111-111111111002'),
  ('11111111-1111-1111-1111-111111111203', '21111111-1111-1111-1111-111111111003'),
  ('11111111-1111-1111-1111-111111111204', '21111111-1111-1111-1111-111111111001'),
  ('11111111-1111-1111-1111-111111111204', '21111111-1111-1111-1111-111111111010'),
  ('11111111-1111-1111-1111-111111111205', '21111111-1111-1111-1111-111111111001'),
  ('11111111-1111-1111-1111-111111111206', '21111111-1111-1111-1111-111111111002'),
  ('11111111-1111-1111-1111-111111111206', '21111111-1111-1111-1111-111111111003'),
  ('11111111-1111-1111-1111-111111111207', '21111111-1111-1111-1111-111111111003'),
  ('11111111-1111-1111-1111-111111111208', '21111111-1111-1111-1111-111111111004'),
  ('11111111-1111-1111-1111-111111111208', '21111111-1111-1111-1111-111111111010'),
  ('11111111-1111-1111-1111-111111111209', '21111111-1111-1111-1111-111111111004'),
  ('11111111-1111-1111-1111-111111111209', '21111111-1111-1111-1111-111111111010'),
  ('11111111-1111-1111-1111-111111111210', '21111111-1111-1111-1111-111111111006'),
  ('11111111-1111-1111-1111-111111111210', '21111111-1111-1111-1111-111111111005'),
  ('11111111-1111-1111-1111-111111111211', '21111111-1111-1111-1111-111111111007'),
  ('11111111-1111-1111-1111-111111111211', '21111111-1111-1111-1111-111111111005'),
  ('11111111-1111-1111-1111-111111111212', '21111111-1111-1111-1111-111111111007'),
  ('11111111-1111-1111-1111-111111111212', '21111111-1111-1111-1111-111111111010'),
  ('11111111-1111-1111-1111-111111111213', '21111111-1111-1111-1111-111111111008'),
  ('11111111-1111-1111-1111-111111111213', '21111111-1111-1111-1111-111111111011'),
  ('11111111-1111-1111-1111-111111111214', '21111111-1111-1111-1111-111111111011'),
  ('11111111-1111-1111-1111-111111111214', '21111111-1111-1111-1111-111111111010'),
  ('11111111-1111-1111-1111-111111111215', '21111111-1111-1111-1111-111111111012')
on conflict do nothing;

insert into organizers (id, campus_id, display_name, type, verified, verification_status, club_id)
values
  ('11111111-1111-1111-1111-111111111304', '11111111-1111-1111-1111-111111111111', 'UMass Ski and Board Club', 'club', true, 'approved', '11111111-1111-1111-1111-111111111204'),
  ('11111111-1111-1111-1111-111111111305', '11111111-1111-1111-1111-111111111111', 'UMass Running Club', 'club', true, 'approved', '11111111-1111-1111-1111-111111111205'),
  ('11111111-1111-1111-1111-111111111306', '11111111-1111-1111-1111-111111111111', 'WMUA 91.1 FM', 'club', true, 'approved', '11111111-1111-1111-1111-111111111206'),
  ('11111111-1111-1111-1111-111111111307', '11111111-1111-1111-1111-111111111111', 'UMass Theatre Guild', 'club', true, 'approved', '11111111-1111-1111-1111-111111111207'),
  ('11111111-1111-1111-1111-111111111308', '11111111-1111-1111-1111-111111111111', 'African Student Association', 'club', true, 'approved', '11111111-1111-1111-1111-111111111208'),
  ('11111111-1111-1111-1111-111111111309', '11111111-1111-1111-1111-111111111111', 'Latinx American Cultural Collective', 'club', true, 'approved', '11111111-1111-1111-1111-111111111209'),
  ('11111111-1111-1111-1111-111111111310', '11111111-1111-1111-1111-111111111111', 'Isenberg Marketing Club', 'club', true, 'approved', '11111111-1111-1111-1111-111111111210'),
  ('11111111-1111-1111-1111-111111111311', '11111111-1111-1111-1111-111111111111', 'HackUMass', 'club', true, 'approved', '11111111-1111-1111-1111-111111111211'),
  ('11111111-1111-1111-1111-111111111312', '11111111-1111-1111-1111-111111111111', 'UMass Esports', 'club', true, 'approved', '11111111-1111-1111-1111-111111111212'),
  ('11111111-1111-1111-1111-111111111313', '11111111-1111-1111-1111-111111111111', 'UMass Permaculture', 'club', true, 'approved', '11111111-1111-1111-1111-111111111213'),
  ('11111111-1111-1111-1111-111111111314', '11111111-1111-1111-1111-111111111111', 'Campus Foodies at UMass', 'club', true, 'approved', '11111111-1111-1111-1111-111111111214'),
  ('11111111-1111-1111-1111-111111111315', '11111111-1111-1111-1111-111111111111', 'UMass Mindfulness Club', 'club', true, 'approved', '11111111-1111-1111-1111-111111111215')
on conflict (id) do update
set campus_id = excluded.campus_id,
  display_name = excluded.display_name,
  type = excluded.type,
  verified = excluded.verified,
  verification_status = excluded.verification_status,
  club_id = excluded.club_id;

insert into events (
  id, campus_id, organizer_id, title, description, category, image_url, starts_at, ends_at,
  venue_name, address, latitude, longitude, status, seed_rsvp_count
)
values
  ('11111111-1111-1111-1111-111111111401', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111301', 'UMass Friday Social', 'A campus-first Friday night social with student DJs, photo moments, and late-night food nearby.', 'Parties', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80', now() + interval '8 hours', now() + interval '12 hours', 'Campus Center', '1 Campus Center Way, Amherst, MA', 42.3910, -72.5267, 'published', 134),
  ('11111111-1111-1111-1111-111111111402', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111303', 'Beginner Dance Social', 'Beginner-friendly dance workshop followed by an open social. No partner or experience needed.', 'Clubs', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80', now() + interval '28 hours', now() + interval '31 hours', 'Student Union Ballroom', '41 Campus Center Way, Amherst, MA', 42.3902, -72.5273, 'published', 58),
  ('11111111-1111-1111-1111-111111111403', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111302', 'Amherst Sunset Bonfire Meetup', 'Meet near Haigis Mall for a low-key outdoor hang, snacks, and rides to a nearby bonfire spot.', 'Food', 'https://images.unsplash.com/photo-1478827387698-1527781a4887?auto=format&fit=crop&w=1200&q=80', now() + interval '52 hours', now() + interval '57 hours', 'Haigis Mall', 'Haigis Mall, Amherst, MA', 42.3860, -72.5307, 'published', 82),
  ('11111111-1111-1111-1111-111111111404', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111304', 'Ski Lodge Kickoff Party', 'Meet the Ski and Board crew before winter trip signups open. Music, trip previews, and giveaways.', 'Parties', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80', now() + interval '32 hours', now() + interval '36 hours', 'Student Union Cape Cod Lounge', '41 Campus Center Way, Amherst, MA', 42.3902, -72.5273, 'published', 117),
  ('11111111-1111-1111-1111-111111111405', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111305', 'Golden Hour 5K Social Run', 'A no-pressure group run ending with smoothies and music outside the Rec Center.', 'Sports', 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=80', now() + interval '18 hours', now() + interval '20 hours', 'Recreation Center', '161 Commonwealth Ave, Amherst, MA', 42.3915, -72.5302, 'published', 46),
  ('11111111-1111-1111-1111-111111111406', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111306', 'WMUA Basement Sessions', 'Live student bands, short DJ sets, and a campus radio hang for anyone who wants new music.', 'Music', 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80', now() + interval '10 hours', now() + interval '13 hours', 'Student Union Radio Studio', '41 Campus Center Way, Amherst, MA', 42.3902, -72.5273, 'published', 73),
  ('11111111-1111-1111-1111-111111111407', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111307', 'Open Mic Night at Herter', 'A casual performance night for scenes, monologues, music, poetry, and friends cheering friends on.', 'Campus', 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80', now() + interval '50 hours', now() + interval '53 hours', 'Herter Hall', '161 Presidents Dr, Amherst, MA', 42.3896, -72.5294, 'published', 39),
  ('11111111-1111-1111-1111-111111111408', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111308', 'Afrobeats Night', 'A cultural social with Afrobeats, snacks, dancing, and community tables from student groups.', 'Nightlife', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80', now() + interval '56 hours', now() + interval '60 hours', 'Campus Center Auditorium', '1 Campus Center Way, Amherst, MA', 42.3910, -72.5267, 'published', 156),
  ('11111111-1111-1111-1111-111111111409', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111309', 'Noche de Comunidad', 'Music, food, games, and a relaxed cultural mixer for students across campus.', 'Food', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80', now() + interval '30 hours', now() + interval '34 hours', 'Wilder Hall', '221 Stockbridge Rd, Amherst, MA', 42.3897, -72.5247, 'published', 91),
  ('11111111-1111-1111-1111-111111111410', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111310', 'Brand Battle Workshop', 'Teams build a mini campaign in one hour, then pitch for prizes and pizza.', 'Clubs', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80', now() + interval '74 hours', now() + interval '77 hours', 'Isenberg Hub', '121 Presidents Dr, Amherst, MA', 42.3865, -72.5248, 'published', 33),
  ('11111111-1111-1111-1111-111111111411', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111311', 'Late Night Build Jam', 'A beginner-friendly mini hack night with snacks, project ideas, and teams forming on the spot.', 'Clubs', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80', now() + interval '82 hours', now() + interval '88 hours', 'Integrative Learning Center', '650 N Pleasant St, Amherst, MA', 42.3916, -72.5256, 'published', 64),
  ('11111111-1111-1111-1111-111111111412', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111312', 'Valorant Watch Party', 'Watch finals on the big screen, play side matches, and meet other campus gamers.', 'Nightlife', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80', now() + interval '12 hours', now() + interval '16 hours', 'Worcester Commons', '669 N Pleasant St, Amherst, MA', 42.3931, -72.5282, 'published', 128),
  ('11111111-1111-1111-1111-111111111413', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111313', 'Garden Dinner Prep Night', 'Help prep a community dinner with campus-grown produce, then eat together after.', 'Food', 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80', now() + interval '42 hours', now() + interval '45 hours', 'Franklin Permaculture Garden', 'Amherst, MA', 42.3848, -72.5279, 'published', 52),
  ('11111111-1111-1111-1111-111111111414', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111314', 'Downtown Amherst Food Crawl', 'A walking food crawl with student favorites, shared orders, and a dessert stop.', 'Food', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80', now() + interval '76 hours', now() + interval '80 hours', 'Downtown Amherst Common', 'Boltwood Ave, Amherst, MA', 42.3759, -72.5199, 'published', 104),
  ('11111111-1111-1111-1111-111111111415', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111315', 'Sunday Reset Meditation', 'A calm reset before the week: guided meditation, tea, and quiet study time.', 'Campus', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80', now() + interval '60 hours', now() + interval '62 hours', 'Old Chapel', '144 Hicks Way, Amherst, MA', 42.3869, -72.5295, 'published', 27)
on conflict (id) do update
set campus_id = excluded.campus_id,
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
  status = excluded.status,
  seed_rsvp_count = excluded.seed_rsvp_count;

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
  (e.seed_rsvp_count + count(r.user_id))::integer as rsvp_count,
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
