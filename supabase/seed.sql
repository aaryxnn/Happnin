insert into campuses (id, name, city, state, allowed_domains, latitude, longitude)
values (
  '00000000-0000-0000-0000-000000000001',
  'Demo State University',
  'College Town',
  'NY',
  array['example.edu'],
  40.73061,
  -73.935242
)
on conflict (id) do nothing;

insert into clubs (id, campus_id, name, description, logo_url, instagram, verified)
values
  (
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000001',
    'Campus Nightlife Board',
    'Student-run social events, DJ nights, and weekend pop-ups.',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    '@campusnightlife',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000001',
    'Outdoor Club',
    'Low-key hikes, bonfires, and food runs around campus.',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
    '@dsuoutdoors',
    true
  )
on conflict (id) do nothing;

insert into organizers (id, campus_id, display_name, type, verified, verification_status, club_id)
values
  (
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000001',
    'Campus Nightlife Board',
    'club',
    true,
    'approved',
    '00000000-0000-0000-0000-000000000101'
  ),
  (
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000001',
    'Outdoor Club',
    'club',
    true,
    'approved',
    '00000000-0000-0000-0000-000000000102'
  )
on conflict (id) do nothing;

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
    '00000000-0000-0000-0000-000000000301',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000201',
    'Friday Rooftop Mixer',
    'Start the weekend with a rooftop social, student DJs, mocktails, and late-night food nearby.',
    'Parties',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    now() + interval '8 hours',
    now() + interval '12 hours',
    'Union Rooftop',
    '14 Campus Walk',
    40.7311,
    -73.9363,
    'published'
  ),
  (
    '00000000-0000-0000-0000-000000000302',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000202',
    'Sunset Bonfire Shuttle',
    'Meet outside the student center. Limited shuttle seats, snacks, and a bring-a-blanket vibe.',
    'Food',
    'https://images.unsplash.com/photo-1478827387698-1527781a4887?auto=format&fit=crop&w=1200&q=80',
    now() + interval '52 hours',
    now() + interval '57 hours',
    'Student Center Loop',
    '1 Student Center',
    40.7332,
    -73.934,
    'published'
  )
on conflict (id) do nothing;
