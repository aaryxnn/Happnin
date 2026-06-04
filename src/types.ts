export type EventCategory = "Parties" | "Clubs" | "Campus" | "Sports" | "Music" | "Food" | "Nightlife";

export type InterestCategory = {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
};

export type Campus = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  allowedDomains: string[];
  latitude: number;
  longitude: number;
  status: "live" | "coming_soon";
  timezone: string;
  sortOrder?: number;
};

export type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  schoolYear: string;
  campusId: string;
  avatarUrl?: string;
  interests: string[];
  clubTags: string[];
  visibleRsvpsDefault: boolean;
  expoPushToken?: string;
};

export type Club = {
  id: string;
  campusId: string;
  name: string;
  description: string;
  logoUrl: string;
  instagram?: string;
  verified: boolean;
  interestSlugs: string[];
  isActive: boolean;
  sourceUrl?: string;
};

export type Organizer = {
  id: string;
  campusId: string;
  displayName: string;
  type: "club" | "student";
  verified: boolean;
  clubId?: string;
  ownerUserId?: string;
  proofUrl?: string;
  status: "not_requested" | "pending" | "approved" | "rejected";
};

export type HappninEvent = {
  id: string;
  campusId: string;
  organizerId: string;
  organizerName: string;
  organizerVerified: boolean;
  title: string;
  description: string;
  category: EventCategory;
  imageUrl: string;
  startsAt: string;
  endsAt?: string;
  venueName: string;
  address: string;
  latitude: number;
  longitude: number;
  status: "published" | "draft" | "cancelled";
  rsvpCount: number;
  visibleAttendees: VisibleAttendee[];
};

export type VisibleAttendee = {
  userId: string;
  fullName: string;
  avatarUrl?: string;
};

export type EventRsvp = {
  eventId: string;
  userId: string;
  visible: boolean;
  createdAt: string;
};

export type ReportTargetType = "event" | "user" | "organizer";

export type Report = {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  status: "open" | "reviewed" | "dismissed";
  createdAt: string;
};
