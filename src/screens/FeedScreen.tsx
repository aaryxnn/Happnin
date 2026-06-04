import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Chip } from "../components/Chip";
import { EventCard } from "../components/EventCard";
import { Screen } from "../components/Screen";
import { TextField } from "../components/TextField";
import { useApp } from "../context/AppContext";
import { colors, radius, shadows, spacing } from "../theme";

type DateFilter = "All" | "Tonight" | "Tomorrow" | "Weekend" | "Trending";
const dateFilters: DateFilter[] = ["All", "Tonight", "Tomorrow", "Weekend", "Trending"];

export function FeedScreen() {
  const { events, rsvps, user, campus } = useApp();
  const [dateFilter, setDateFilter] = useState<DateFilter>("All");
  const [search, setSearch] = useState("");

  const publishedEvents = events
    .filter((event) => event.status === "published")
    .filter((event) => event.campusId === user?.campusId)
    .filter((event) => matchesDateFilter(event.startsAt, dateFilter))
    .filter((event) => {
      const term = search.trim().toLowerCase();
      if (!term) return true;
      return [event.title, event.venueName, event.organizerName, event.category]
        .join(" ")
        .toLowerCase()
        .includes(term);
    })
    .sort((a, b) => {
      if (dateFilter === "Trending") {
        return b.rsvpCount - a.rsvpCount || new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
      }
      return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
    });
  const totalEvents = publishedEvents.length;
  const nextEvent = publishedEvents[0];

  return (
    <Screen>
      <LinearGradient colors={["#3b0764", "#1b0733", "#08040f"]} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.livePill}>
            <Text style={styles.liveDot}>●</Text>
            <Text style={styles.eyebrow}>{campus.shortName}</Text>
          </View>
          <Text style={styles.count}>{totalEvents} live</Text>
        </View>
        <Text style={styles.title}>What's happnin?</Text>
        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{events.filter((event) => event.status === "published").length}</Text>
            <Text style={styles.statLabel}>campus drops</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{nextEvent ? formatSoon(nextEvent.startsAt) : "--"}</Text>
            <Text style={styles.statLabel}>next up</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.searchWrap}>
        <TextField label="Search events" value={search} onChangeText={setSearch} placeholder="DJ night, Campus Center, clubs..." />
      </View>

      <View style={styles.filters}>
        {dateFilters.map((item) => (
          <Chip key={item} label={item} selected={dateFilter === item} onPress={() => setDateFilter(item)} />
        ))}
      </View>

      {publishedEvents.length === 0 ? (
        <Text style={styles.empty}>No events match this filter yet. Try All or clear your search.</Text>
      ) : (
        publishedEvents.map((event) => (
          <EventCard key={event.id} event={event} isRsvpd={rsvps.some((rsvp) => rsvp.eventId === event.id)} />
        ))
      )}
    </Screen>
  );
}

function matchesDateFilter(startsAt: string, filter: DateFilter) {
  if (filter === "All" || filter === "Trending") return true;

  const eventDate = new Date(startsAt);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(todayStart.getDate() + 1);
  const dayAfterTomorrow = new Date(todayStart);
  dayAfterTomorrow.setDate(todayStart.getDate() + 2);

  if (filter === "Tonight") {
    const tonightEnd = new Date(tomorrowStart);
    tonightEnd.setHours(5, 0, 0, 0);
    return eventDate >= now && eventDate <= tonightEnd;
  }

  if (filter === "Tomorrow") {
    return eventDate >= tomorrowStart && eventDate < dayAfterTomorrow;
  }

  const day = eventDate.getDay();
  return eventDate >= now && [5, 6, 0].includes(day);
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    ...shadows.glow
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 0
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(251, 247, 255, 0.08)",
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  liveDot: {
    color: colors.lime,
    fontSize: 10
  },
  eyebrow: {
    color: colors.text,
    fontWeight: "900"
  },
  count: {
    color: colors.muted,
    fontWeight: "900",
    fontSize: 12
  },
  title: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900"
  },
  statRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  stat: {
    flex: 1,
    backgroundColor: "rgba(5, 3, 10, 0.44)",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.sm
  },
  statValue: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 18
  },
  statLabel: {
    color: colors.muted,
    fontWeight: "800",
    fontSize: 12,
    marginTop: spacing.xs
  },
  searchWrap: {
    marginBottom: spacing.lg
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  empty: {
    color: colors.muted,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    lineHeight: 22
  }
});

function formatSoon(startsAt: string) {
  const start = new Date(startsAt).getTime();
  const diffHours = Math.max(0, Math.round((start - Date.now()) / (60 * 60 * 1000)));
  if (diffHours < 24) return `${diffHours}h`;
  return `${Math.round(diffHours / 24)}d`;
}
