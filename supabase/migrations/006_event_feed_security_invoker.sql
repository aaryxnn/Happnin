drop policy if exists "visible attendee profiles are readable" on users;
create policy "visible attendee profiles are readable" on users
  for select using (
    exists (
      select 1
      from event_rsvps
      where event_rsvps.user_id = users.id
        and event_rsvps.visible = true
    )
  );

create or replace view public.event_feed
with (security_invoker = true)
as
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

grant select on public.event_feed to anon, authenticated;
