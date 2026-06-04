import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

import { demoCampus, demoClubs, demoEvents, demoInterestCategories, demoOrganizers, demoProfile } from "../data/mockData";
import { isDevAdminFlowEnabled } from "../lib/devAdmin";
import { isAllowedStudentEmail } from "../lib/domain";
import { registerForPushNotifications, scheduleEventReminder } from "../lib/notifications";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import {
  groupClubInterestSlugs,
  mapCampus,
  mapClub,
  mapEvent,
  mapInterestCategory,
  mapOrganizer,
  mapRsvp,
  mapUserProfile
} from "../lib/supabaseMappers";
import {
  Campus,
  Club,
  EventCategory,
  EventRsvp,
  HappninEvent,
  InterestCategory,
  Organizer,
  Report,
  UserProfile
} from "../types";

type CreateEventInput = {
  title: string;
  description: string;
  category: EventCategory;
  startsAt: string;
  venueName: string;
  address: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
};

type EventPosterUploadInput = {
  uri: string;
  mimeType?: string;
  fileName?: string;
};

type OrganizerRequestInput = {
  displayName: string;
  type: "club" | "student";
  proofUrl: string;
};

type AppContextValue = {
  loading: boolean;
  isDemoMode: boolean;
  dataError: string | null;
  user: UserProfile | null;
  campus: Campus;
  interestCategories: InterestCategory[];
  clubs: Club[];
  organizers: Organizer[];
  events: HappninEvent[];
  rsvps: EventRsvp[];
  reports: Report[];
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: (profile: Pick<UserProfile, "fullName" | "schoolYear" | "interests" | "clubTags">) => Promise<void>;
  updateProfileSettings: (settings: Pick<UserProfile, "visibleRsvpsDefault">) => Promise<void>;
  toggleRsvp: (eventId: string, visible: boolean) => Promise<void>;
  createReport: (targetType: Report["targetType"], targetId: string, reason: string) => Promise<void>;
  requestOrganizerVerification: (input: OrganizerRequestInput) => Promise<void>;
  approveOwnOrganizerForDev: () => Promise<void>;
  uploadEventPoster: (input: EventPosterUploadInput) => Promise<string>;
  createEvent: (input: CreateEventInput) => Promise<void>;
  refreshData: () => Promise<void>;
  currentOrganizer: Organizer | undefined;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

const profileStorageKey = "happnin.profile";
const rsvpStorageKey = "happnin.rsvps";
const demoEmail = demoProfile.email.toLowerCase();

function isDemoEmail(email: string) {
  return email.trim().toLowerCase() === demoEmail;
}

function isLocalDemoUser(userId?: string) {
  return userId === demoProfile.id;
}

function getEmailDomain(email: string) {
  return email.trim().toLowerCase().split("@")[1] ?? "";
}

export function AppProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [campus, setCampus] = useState<Campus>(demoCampus);
  const [interestCategories, setInterestCategories] = useState<InterestCategory[]>(demoInterestCategories);
  const [clubs, setClubs] = useState<Club[]>(demoClubs);
  const [events, setEvents] = useState<HappninEvent[]>(demoEvents);
  const [rsvps, setRsvps] = useState<EventRsvp[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [organizers, setOrganizers] = useState<Organizer[]>(demoOrganizers);

  const isDemoMode = !isSupabaseConfigured || isLocalDemoUser(user?.id);

  useEffect(() => {
    async function hydrate() {
      try {
        if (supabase) {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;

          if (data.session?.user) {
            await loadSupabaseData(data.session.user.id);
            return;
          }
        }

        const [storedProfile, storedRsvps] = await Promise.all([
          AsyncStorage.getItem(profileStorageKey),
          AsyncStorage.getItem(rsvpStorageKey)
        ]);

        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile) as UserProfile;
          setUser(parsedProfile);
        }
        if (storedRsvps) setRsvps(JSON.parse(storedRsvps));
      } catch (error) {
        setDataError(error instanceof Error ? error.message : "Could not load Happnin data.");
      } finally {
        setLoading(false);
      }
    }

    hydrate();

    if (!supabase) return;

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadSupabaseData(session.user.id).catch((error) => {
          setDataError(error instanceof Error ? error.message : "Could not refresh Happnin data.");
        });
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !isLocalDemoUser(user.id)) return;
    AsyncStorage.setItem(rsvpStorageKey, JSON.stringify(rsvps)).catch(() => undefined);
  }, [rsvps, user]);

  const currentOrganizer = useMemo(
    () => organizers.find((organizer) => organizer.ownerUserId === user?.id),
    [organizers, user?.id]
  );

  async function loadSupabaseData(userId: string) {
    if (!supabase) return;
    setDataError(null);

    const { data: authUserData, error: authUserError } = await supabase.auth.getUser();
    if (authUserError) throw authUserError;

    const { data: profileRow, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) throw profileError;

    const resolvedProfileRow = profileRow ?? (await createMissingProfile(userId, authUserData.user.email ?? ""));

    const nextProfile = mapUserProfile(resolvedProfileRow);
    const campusId = nextProfile.campusId;

    const [campusResult, interestsResult, clubsResult, organizersResult, eventsResult, rsvpsResult] = await Promise.all([
      supabase.from("campuses").select("*").eq("id", campusId).single(),
      supabase.from("interest_categories").select("*").order("sort_order", { ascending: true }),
      supabase
        .from("clubs")
        .select("*")
        .eq("campus_id", campusId)
        .eq("verified", true)
        .eq("is_active", true)
        .order("name"),
      supabase.from("organizers").select("*").eq("campus_id", campusId).order("created_at", { ascending: false }),
      supabase.from("event_feed").select("*").eq("campus_id", campusId).order("starts_at", { ascending: true }),
      supabase.from("event_rsvps").select("*").eq("user_id", userId)
    ]);

    if (campusResult.error) throw campusResult.error;
    if (interestsResult.error) throw interestsResult.error;
    if (clubsResult.error) throw clubsResult.error;
    if (organizersResult.error) throw organizersResult.error;
    if (eventsResult.error) throw eventsResult.error;
    if (rsvpsResult.error) throw rsvpsResult.error;

    const clubIds = (clubsResult.data ?? []).map((club) => club.id);
    let interestSlugsByClub: Record<string, string[]> = {};
    if (clubIds.length > 0) {
      const { data: clubInterestRows, error: clubInterestError } = await supabase
        .from("club_interest_categories")
        .select("club_id, interest_categories(slug)")
        .in("club_id", clubIds);
      if (clubInterestError) throw clubInterestError;
      interestSlugsByClub = groupClubInterestSlugs((clubInterestRows ?? []) as Parameters<typeof groupClubInterestSlugs>[0]);
    }

    setUser(nextProfile);
    setCampus(mapCampus(campusResult.data));
    setInterestCategories((interestsResult.data ?? []).map(mapInterestCategory));
    setClubs((clubsResult.data ?? []).map((club) => mapClub(club, interestSlugsByClub[club.id] ?? [])));
    setOrganizers((organizersResult.data ?? []).map(mapOrganizer));
    setEvents((eventsResult.data ?? []).map(mapEvent));
    setRsvps((rsvpsResult.data ?? []).map(mapRsvp));
  }

  async function createMissingProfile(userId: string, email: string) {
    if (!supabase) throw new Error("Supabase is not configured.");
    const domain = getEmailDomain(email);
    const { data: campusRow, error: campusError } = await supabase
      .from("campuses")
      .select("*")
      .contains("allowed_domains", [domain])
      .eq("status", "live")
      .single();

    if (campusError) throw campusError;

    const { data: insertedProfile, error: insertError } = await supabase
      .from("users")
      .insert({
        id: userId,
        email,
        campus_id: campusRow.id
      })
      .select("*")
      .single();

    if (insertError) throw insertError;

    await supabase.from("notification_preferences").upsert({ user_id: userId }).throwOnError();
    return insertedProfile;
  }

  async function refreshData() {
    if (!user || isLocalDemoUser(user.id) || !supabase) return;
    await loadSupabaseData(user.id);
  }

  async function persistProfile(profile: UserProfile | null) {
    setUser(profile);
    if (profile && isLocalDemoUser(profile.id)) {
      await AsyncStorage.setItem(profileStorageKey, JSON.stringify(profile));
    } else {
      await AsyncStorage.removeItem(profileStorageKey);
    }
  }

  async function enterLocalDemo(email: string, fullName = "") {
    const expoPushToken = await registerForPushNotifications().catch(() => undefined);
    setCampus(demoCampus);
    setInterestCategories(demoInterestCategories);
    setClubs(demoClubs);
    setEvents(demoEvents);
    setOrganizers(demoOrganizers);
    await persistProfile({
      ...demoProfile,
      email: email.trim().toLowerCase(),
      fullName,
      expoPushToken
    });
  }

  async function signIn(email: string, password: string) {
    if (!isAllowedStudentEmail(email)) {
      throw new Error("Use your approved school email to join Happnin.");
    }

    if (isDemoEmail(email)) {
      await enterLocalDemo(email, demoProfile.fullName);
      return;
    }

    if (!supabase) {
      throw new Error("Supabase is not configured for real UMass login yet.");
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error("Could not load your Supabase account.");
    await loadSupabaseData(data.user.id);
  }

  async function signUp(email: string, password: string) {
    if (!isAllowedStudentEmail(email)) {
      throw new Error("Use your approved school email to join Happnin.");
    }

    if (isDemoEmail(email)) {
      await enterLocalDemo(email);
      return;
    }

    if (!supabase) {
      throw new Error("Supabase is not configured for real UMass signup yet.");
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    if (!data.session || !data.user) {
      throw new Error("CONFIRM_EMAIL");
    }

    await loadSupabaseData(data.user.id);
  }

  async function signOut() {
    if (supabase && !isLocalDemoUser(user?.id)) await supabase.auth.signOut();
    await persistProfile(null);
    setCampus(demoCampus);
    setInterestCategories(demoInterestCategories);
    setClubs(demoClubs);
    setEvents(demoEvents);
    setOrganizers(demoOrganizers);
    setRsvps([]);
  }

  async function completeOnboarding(
    profile: Pick<UserProfile, "fullName" | "schoolYear" | "interests" | "clubTags">
  ) {
    if (!user) return;
    const nextProfile = {
      ...user,
      ...profile,
      visibleRsvpsDefault: false
    };

    if (supabase && !isLocalDemoUser(nextProfile.id)) {
      const { error } = await supabase.from("users").upsert({
        id: nextProfile.id,
        email: nextProfile.email,
        full_name: nextProfile.fullName,
        school_year: nextProfile.schoolYear,
        campus_id: nextProfile.campusId,
        interests: nextProfile.interests,
        club_tags: nextProfile.clubTags,
        visible_rsvps_default: nextProfile.visibleRsvpsDefault,
        expo_push_token: nextProfile.expoPushToken
      });
      if (error) throw error;
    }

    await persistProfile(nextProfile);
  }

  async function updateProfileSettings(settings: Pick<UserProfile, "visibleRsvpsDefault">) {
    if (!user) return;

    const nextProfile = {
      ...user,
      ...settings
    };

    if (supabase && !isLocalDemoUser(nextProfile.id)) {
      const { error } = await supabase
        .from("users")
        .update({
          visible_rsvps_default: nextProfile.visibleRsvpsDefault
        })
        .eq("id", nextProfile.id);
      if (error) throw error;
    }

    await persistProfile(nextProfile);
  }

  async function toggleRsvp(eventId: string, visible: boolean) {
    if (!user) return;
    const existing = rsvps.find((rsvp) => rsvp.eventId === eventId && rsvp.userId === user.id);
    const event = events.find((item) => item.id === eventId);

    if (existing) {
      setRsvps((current) => current.filter((rsvp) => !(rsvp.eventId === eventId && rsvp.userId === user.id)));
      setEvents((current) =>
        current.map((item) =>
          item.id === eventId
            ? {
                ...item,
                rsvpCount: Math.max(0, item.rsvpCount - 1),
                visibleAttendees: item.visibleAttendees.filter((attendee) => attendee.userId !== user.id)
              }
            : item
        )
      );

      if (supabase && !isLocalDemoUser(user.id)) {
        const { error } = await supabase.from("event_rsvps").delete().eq("event_id", eventId).eq("user_id", user.id);
        if (error) throw error;
        await refreshData();
      }
      return;
    }

    const nextRsvp: EventRsvp = {
      eventId,
      userId: user.id,
      visible,
      createdAt: new Date().toISOString()
    };

    setRsvps((current) => [...current, nextRsvp]);
    setEvents((current) =>
      current.map((item) =>
        item.id === eventId
          ? {
              ...item,
              rsvpCount: item.rsvpCount + 1,
              visibleAttendees: visible
                ? [...item.visibleAttendees, { userId: user.id, fullName: user.fullName || "You" }]
                : item.visibleAttendees
            }
          : item
      )
    );

    if (supabase && !isLocalDemoUser(user.id)) {
      const { error } = await supabase.from("event_rsvps").insert({
        event_id: eventId,
        user_id: user.id,
        visible
      });
      if (error) throw error;
      await refreshData();
    }

    if (event) await scheduleEventReminder(event.title, event.startsAt).catch(() => undefined);
  }

  async function createReport(targetType: Report["targetType"], targetId: string, reason: string) {
    if (!user) return;
    const report: Report = {
      id: `report-${Date.now()}`,
      reporterId: user.id,
      targetType,
      targetId,
      reason,
      status: "open",
      createdAt: new Date().toISOString()
    };

    setReports((current) => [report, ...current]);
    if (supabase && !isLocalDemoUser(user.id)) {
      const { error } = await supabase.from("reports").insert({
        reporter_id: report.reporterId,
        target_type: report.targetType,
        target_id: report.targetId,
        reason: report.reason,
        status: report.status
      });
      if (error) throw error;
    }
  }

  async function requestOrganizerVerification(input: OrganizerRequestInput) {
    if (!user) return;
    const organizer: Organizer = {
      id: `org-${Date.now()}`,
      campusId: user.campusId,
      displayName: input.displayName,
      type: input.type,
      verified: false,
      ownerUserId: user.id,
      proofUrl: input.proofUrl,
      status: "pending"
    };

    setOrganizers((current) => [organizer, ...current]);
    if (supabase && !isLocalDemoUser(user.id)) {
      const { error } = await supabase.from("organizers").insert({
        campus_id: organizer.campusId,
        display_name: organizer.displayName,
        type: organizer.type,
        owner_user_id: organizer.ownerUserId,
        proof_url: organizer.proofUrl,
        verification_status: organizer.status,
        verified: organizer.verified
      });
      if (error) throw error;
      await refreshData();
    }
  }

  async function approveOwnOrganizerForDev() {
    if (!user || !isDevAdminFlowEnabled()) return;
    const organizer = organizers.find((item) => item.ownerUserId === user.id && item.status === "pending");

    if (!organizer) {
      throw new Error("No pending organizer request found for your account.");
    }

    setOrganizers((current) =>
      current.map((item) =>
        item.id === organizer.id
          ? {
              ...item,
              verified: true,
              status: "approved"
            }
          : item
      )
    );

    if (supabase && !isLocalDemoUser(user.id)) {
      const { error } = await supabase.rpc("dev_approve_my_organizer_request", {
        target_organizer_id: organizer.id
      });
      if (error) {
        await refreshData();
        throw error;
      }
      await refreshData();
    }
  }

  async function uploadEventPoster(input: EventPosterUploadInput) {
    if (!user) throw new Error("Log in before uploading an event poster.");

    if (!supabase || isLocalDemoUser(user.id)) {
      return input.uri;
    }

    const fileExtension = input.fileName?.split(".").pop()?.toLowerCase() ?? input.mimeType?.split("/").pop() ?? "jpg";
    const objectPath = `${user.id}/${Date.now()}.${fileExtension}`;
    const response = await fetch(input.uri);
    const blob = await response.blob();

    const { error } = await supabase.storage.from("event-posters").upload(objectPath, blob, {
      cacheControl: "3600",
      contentType: input.mimeType ?? "image/jpeg",
      upsert: false
    });

    if (error) throw error;

    const { data } = supabase.storage.from("event-posters").getPublicUrl(objectPath);
    return data.publicUrl;
  }

  async function createEvent(input: CreateEventInput) {
    if (!user) return;
    const organizer = organizers.find((item) => item.ownerUserId === user.id && item.verified);

    if (!organizer) {
      throw new Error("Only verified organizers can publish public events.");
    }

    const event: HappninEvent = {
      id: `event-${Date.now()}`,
      campusId: user.campusId,
      organizerId: organizer.id,
      organizerName: organizer.displayName,
      organizerVerified: organizer.verified,
      title: input.title,
      description: input.description,
      category: input.category,
      imageUrl: input.imageUrl,
      startsAt: input.startsAt,
      venueName: input.venueName,
      address: input.address,
      latitude: input.latitude,
      longitude: input.longitude,
      status: "published",
      rsvpCount: 0,
      visibleAttendees: []
    };

    setEvents((current) => [event, ...current]);
    if (supabase && !isLocalDemoUser(user.id)) {
      const { error } = await supabase.from("events").insert({
        campus_id: event.campusId,
        organizer_id: event.organizerId,
        title: event.title,
        description: event.description,
        category: event.category,
        image_url: event.imageUrl,
        starts_at: event.startsAt,
        venue_name: event.venueName,
        address: event.address,
        latitude: event.latitude,
        longitude: event.longitude,
        status: event.status
      });
      if (error) throw error;
      await refreshData();
    }
  }

  const value: AppContextValue = {
    loading,
    isDemoMode,
    dataError,
    user,
    campus,
    interestCategories,
    clubs,
    organizers,
    events,
    rsvps,
    reports,
    signIn,
    signUp,
    signOut,
    completeOnboarding,
    updateProfileSettings,
    toggleRsvp,
    createReport,
    requestOrganizerVerification,
    approveOwnOrganizerForDev,
    uploadEventPoster,
    createEvent,
    refreshData,
    currentOrganizer
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
}
