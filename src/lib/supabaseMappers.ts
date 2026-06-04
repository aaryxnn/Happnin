import {
  Campus,
  Club,
  EventCategory,
  EventRsvp,
  HappninEvent,
  InterestCategory,
  Organizer,
  UserProfile
} from "../types";

type CampusRow = {
  id: string;
  slug: string | null;
  name: string;
  short_name: string | null;
  city: string;
  state: string;
  allowed_domains: string[];
  latitude: number;
  longitude: number;
  status: "live" | "coming_soon";
  timezone: string | null;
  sort_order: number | null;
};

type UserRow = {
  id: string;
  email: string;
  full_name: string;
  school_year: string;
  campus_id: string;
  avatar_url: string | null;
  interests: string[] | null;
  club_tags: string[] | null;
  visible_rsvps_default: boolean;
  expo_push_token: string | null;
};

type ClubRow = {
  id: string;
  campus_id: string;
  name: string;
  description: string;
  logo_url: string | null;
  instagram: string | null;
  verified: boolean;
  is_active?: boolean | null;
  source_url?: string | null;
};

type InterestCategoryRow = {
  id: string;
  slug: string;
  name: string;
  sort_order: number | null;
};

type ClubInterestRow = {
  club_id: string;
  interest_categories:
    | {
        slug: string;
      }
    | Array<{
        slug: string;
      }>
    | null;
};

type OrganizerRow = {
  id: string;
  campus_id: string;
  display_name: string;
  type: "club" | "student";
  verified: boolean;
  club_id: string | null;
  owner_user_id: string | null;
  proof_url: string | null;
  verification_status: "not_requested" | "pending" | "approved" | "rejected";
};

type EventFeedRow = {
  id: string;
  campus_id: string;
  organizer_id: string;
  organizer_name: string;
  organizer_verified: boolean;
  title: string;
  description: string;
  category: EventCategory;
  image_url: string | null;
  starts_at: string;
  ends_at: string | null;
  venue_name: string;
  address: string;
  latitude: number;
  longitude: number;
  status: "published" | "draft" | "cancelled";
  rsvp_count: number | null;
  visible_attendees:
    | Array<{
        user_id?: string;
        userId?: string;
        full_name?: string;
        fullName?: string;
        avatar_url?: string;
        avatarUrl?: string;
      }>
    | null;
};

type RsvpRow = {
  event_id: string;
  user_id: string;
  visible: boolean;
  created_at: string;
};

export function mapCampus(row: CampusRow): Campus {
  return {
    id: row.id,
    slug: row.slug ?? row.id,
    name: row.name,
    shortName: row.short_name ?? row.name,
    city: row.city,
    state: row.state,
    allowedDomains: row.allowed_domains,
    latitude: row.latitude,
    longitude: row.longitude,
    status: row.status,
    timezone: row.timezone ?? "America/New_York",
    sortOrder: row.sort_order ?? undefined
  };
}

export function mapUserProfile(row: UserRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    schoolYear: row.school_year,
    campusId: row.campus_id,
    avatarUrl: row.avatar_url ?? undefined,
    interests: row.interests ?? [],
    clubTags: row.club_tags ?? [],
    visibleRsvpsDefault: row.visible_rsvps_default,
    expoPushToken: row.expo_push_token ?? undefined
  };
}

export function mapInterestCategory(row: InterestCategoryRow): InterestCategory {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    sortOrder: row.sort_order ?? 100
  };
}

export function mapClub(row: ClubRow, interestSlugs: string[] = []): Club {
  return {
    id: row.id,
    campusId: row.campus_id,
    name: row.name,
    description: row.description,
    logoUrl: row.logo_url ?? "",
    instagram: row.instagram ?? undefined,
    verified: row.verified,
    interestSlugs,
    isActive: row.is_active ?? true,
    sourceUrl: row.source_url ?? undefined
  };
}

export function groupClubInterestSlugs(rows: ClubInterestRow[]) {
  return rows.reduce<Record<string, string[]>>((acc, row) => {
    const category = Array.isArray(row.interest_categories) ? row.interest_categories[0] : row.interest_categories;
    const slug = category?.slug;
    if (!slug) return acc;
    acc[row.club_id] = [...(acc[row.club_id] ?? []), slug];
    return acc;
  }, {});
}

export function mapOrganizer(row: OrganizerRow): Organizer {
  return {
    id: row.id,
    campusId: row.campus_id,
    displayName: row.display_name,
    type: row.type,
    verified: row.verified,
    clubId: row.club_id ?? undefined,
    ownerUserId: row.owner_user_id ?? undefined,
    proofUrl: row.proof_url ?? undefined,
    status: row.verification_status
  };
}

export function mapEvent(row: EventFeedRow): HappninEvent {
  return {
    id: row.id,
    campusId: row.campus_id,
    organizerId: row.organizer_id,
    organizerName: row.organizer_name,
    organizerVerified: row.organizer_verified,
    title: row.title,
    description: row.description,
    category: row.category,
    imageUrl:
      row.image_url ??
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    startsAt: row.starts_at,
    endsAt: row.ends_at ?? undefined,
    venueName: row.venue_name,
    address: row.address,
    latitude: row.latitude,
    longitude: row.longitude,
    status: row.status,
    rsvpCount: row.rsvp_count ?? 0,
    visibleAttendees: (row.visible_attendees ?? []).map((attendee) => ({
      userId: attendee.userId ?? attendee.user_id ?? "",
      fullName: attendee.fullName ?? attendee.full_name ?? "Student",
      avatarUrl: attendee.avatarUrl ?? attendee.avatar_url ?? undefined
    }))
  };
}

export function mapRsvp(row: RsvpRow): EventRsvp {
  return {
    eventId: row.event_id,
    userId: row.user_id,
    visible: row.visible,
    createdAt: row.created_at
  };
}
