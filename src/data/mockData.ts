import { Campus, Club, HappninEvent, InterestCategory, Organizer, UserProfile } from "../types";

const now = Date.now();
const hours = (value: number) => new Date(now + value * 60 * 60 * 1000).toISOString();

export const demoCampus: Campus = {
  id: "campus-demo",
  slug: "demo-state",
  name: "Demo State University",
  shortName: "Demo State",
  city: "College Town",
  state: "NY",
  allowedDomains: ["example.edu"],
  latitude: 40.73061,
  longitude: -73.935242,
  status: "live",
  timezone: "America/New_York",
  sortOrder: 0
};

export const demoClubs: Club[] = [
  {
    id: "club-nightlife",
    campusId: demoCampus.id,
    name: "Campus Nightlife Board",
    description: "Student-run social events, DJ nights, and weekend pop-ups.",
    logoUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    instagram: "@campusnightlife",
    verified: true,
    interestSlugs: ["social-nightlife", "music-performance"],
    isActive: true
  },
  {
    id: "club-outdoors",
    campusId: demoCampus.id,
    name: "Outdoor Club",
    description: "Low-key hikes, bonfires, and food runs around campus.",
    logoUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
    instagram: "@dsuoutdoors",
    verified: true,
    interestSlugs: ["sports-fitness", "food-lifestyle"],
    isActive: true
  },
  {
    id: "club-salsa",
    campusId: demoCampus.id,
    name: "Salsa Society",
    description: "Dance socials and beginner-friendly workshops.",
    logoUrl:
      "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=600&q=80",
    instagram: "@salsadsu",
    verified: true,
    interestSlugs: ["music-performance", "arts-media", "cultural-identity"],
    isActive: true
  }
];

export const demoInterestCategories: InterestCategory[] = [
  { id: "interest-sports-fitness", slug: "sports-fitness", name: "Sports & Fitness", sortOrder: 1 },
  { id: "interest-music-performance", slug: "music-performance", name: "Music & Performance", sortOrder: 2 },
  { id: "interest-arts-media", slug: "arts-media", name: "Arts & Media", sortOrder: 3 },
  { id: "interest-cultural-identity", slug: "cultural-identity", name: "Cultural & Identity", sortOrder: 4 },
  { id: "interest-academic", slug: "academic", name: "Academic", sortOrder: 5 },
  { id: "interest-business-career", slug: "business-career", name: "Business & Career", sortOrder: 6 },
  { id: "interest-tech-gaming", slug: "tech-gaming", name: "Tech & Gaming", sortOrder: 7 },
  { id: "interest-service-advocacy", slug: "service-advocacy", name: "Service & Advocacy", sortOrder: 8 },
  { id: "interest-greek-life", slug: "greek-life", name: "Greek Life", sortOrder: 9 },
  { id: "interest-social-nightlife", slug: "social-nightlife", name: "Social & Nightlife", sortOrder: 10 },
  { id: "interest-food-lifestyle", slug: "food-lifestyle", name: "Food & Lifestyle", sortOrder: 11 },
  { id: "interest-spiritual-wellness", slug: "spiritual-wellness", name: "Spiritual & Wellness", sortOrder: 12 }
];

export const demoOrganizers: Organizer[] = [
  {
    id: "org-nightlife",
    campusId: demoCampus.id,
    displayName: "Campus Nightlife Board",
    type: "club",
    verified: true,
    clubId: "club-nightlife",
    status: "approved"
  },
  {
    id: "org-outdoors",
    campusId: demoCampus.id,
    displayName: "Outdoor Club",
    type: "club",
    verified: true,
    clubId: "club-outdoors",
    status: "approved"
  },
  {
    id: "org-salsa",
    campusId: demoCampus.id,
    displayName: "Salsa Society",
    type: "club",
    verified: true,
    clubId: "club-salsa",
    status: "approved"
  }
];

export const demoProfile: UserProfile = {
  id: "demo-user",
  email: "student@example.edu",
  fullName: "Taylor Student",
  schoolYear: "Sophomore",
  campusId: demoCampus.id,
  interests: ["social-nightlife", "music-performance", "food-lifestyle"],
  clubTags: ["Campus Nightlife Board", "Outdoor Club"],
  visibleRsvpsDefault: false
};

export const demoEvents: HappninEvent[] = [
  {
    id: "event-1",
    campusId: demoCampus.id,
    organizerId: "org-nightlife",
    organizerName: "Campus Nightlife Board",
    organizerVerified: true,
    title: "Friday Rooftop Mixer",
    description:
      "Start the weekend with a rooftop social, student DJs, mocktails, and late-night food nearby. Bring your student ID.",
    category: "Parties",
    imageUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&h=1125&q=80",
    startsAt: hours(8),
    endsAt: hours(12),
    venueName: "Union Rooftop",
    address: "14 Campus Walk",
    latitude: 40.7311,
    longitude: -73.9363,
    status: "published",
    rsvpCount: 126,
    visibleAttendees: [
      { userId: "u1", fullName: "Maya P." },
      { userId: "u2", fullName: "Jordan K." },
      { userId: "u3", fullName: "Chris L." }
    ]
  },
  {
    id: "event-2",
    campusId: demoCampus.id,
    organizerId: "org-salsa",
    organizerName: "Salsa Society",
    organizerVerified: true,
    title: "Beginner Salsa Social",
    description:
      "No partner needed. We will teach the basics for 30 minutes, then open the floor for a casual social.",
    category: "Clubs",
    imageUrl:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&h=1125&q=80",
    startsAt: hours(28),
    endsAt: hours(31),
    venueName: "Arts Hall Studio B",
    address: "201 Arts Hall",
    latitude: 40.7288,
    longitude: -73.9326,
    status: "published",
    rsvpCount: 42,
    visibleAttendees: [{ userId: "u4", fullName: "Nia R." }]
  },
  {
    id: "event-3",
    campusId: demoCampus.id,
    organizerId: "org-outdoors",
    organizerName: "Outdoor Club",
    organizerVerified: true,
    title: "Sunset Bonfire Shuttle",
    description:
      "Meet outside the student center. We have limited shuttle seats, snacks, and a bring-a-blanket vibe.",
    category: "Food",
    imageUrl:
      "https://images.unsplash.com/photo-1478827387698-1527781a4887?auto=format&fit=crop&w=900&h=1125&q=80",
    startsAt: hours(52),
    endsAt: hours(57),
    venueName: "Student Center Loop",
    address: "1 Student Center",
    latitude: 40.7332,
    longitude: -73.934,
    status: "published",
    rsvpCount: 78,
    visibleAttendees: [
      { userId: "u5", fullName: "Sam B." },
      { userId: "u6", fullName: "Ari C." }
    ]
  },
  {
    id: "event-4",
    campusId: demoCampus.id,
    organizerId: "org-nightlife",
    organizerName: "Campus Nightlife Board",
    organizerVerified: true,
    title: "Late Night Food Crawl",
    description:
      "Four student-favorite food spots, one walking route, and group discounts for anyone who RSVPs.",
    category: "Nightlife",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&h=1125&q=80",
    startsAt: hours(72),
    endsAt: hours(76),
    venueName: "Main Gate",
    address: "Main Gate Plaza",
    latitude: 40.7292,
    longitude: -73.9375,
    status: "published",
    rsvpCount: 91,
    visibleAttendees: [{ userId: "u7", fullName: "Dev A." }]
  }
];
