import { Search, Sparkles } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";

import { Chip } from "../components/Chip";
import { EventCard } from "../components/EventCard";
import { Badge, EmptyState, Panel, SectionHeader } from "../components/PageElements";
import { Screen } from "../components/Screen";
import { Txt } from "../components/Txt";
import { useApp } from "../context/AppContext";
import { colors, radius, spacing } from "../theme";

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

  const firstName = user?.fullName?.split(" ")[0] ?? "there";
  const totalLive = events.filter((event) => event.status === "published").length;
  const nextEvent = publishedEvents[0];

  return (
    <Screen>
      <View style={styles.topBar}>
        <View>
          <Txt variant="overline" color={colors.faint}>
            {campus.shortName.toUpperCase()}
          </Txt>
          <Txt variant="h1">Hey {firstName}</Txt>
        </View>
        <Badge label="Live" tone="hot" icon={<View style={styles.dot} />} />
      </View>

      <Panel style={styles.hero} elevated>
        <View style={styles.heroRow}>
          <Sparkles color={colors.accentText} size={18} />
          <Txt variant="label" color={colors.accentText}>
            What's happening
          </Txt>
        </View>
        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Txt variant="display">{totalLive}</Txt>
            <Txt variant="caption" color={colors.muted}>
              live events
            </Txt>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Txt variant="display">{nextEvent ? formatSoon(nextEvent.startsAt) : "--"}</Txt>
            <Txt variant="caption" color={colors.muted}>
              until next
            </Txt>
          </View>
        </View>
      </Panel>

      <View style={styles.searchBar}>
        <Search color={colors.faint} size={18} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search events, venues, clubs"
          placeholderTextColor={colors.faint}
          style={styles.searchInput}
          returnKeyType="search"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        style={styles.filterScroll}
      >
        {dateFilters.map((item) => (
          <Chip key={item} label={item} selected={dateFilter === item} onPress={() => setDateFilter(item)} />
        ))}
      </ScrollView>

      <SectionHeader title={dateFilter === "All" ? "Upcoming" : dateFilter} />

      {publishedEvents.length === 0 ? (
        <EmptyState
          title="Nothing here yet"
          copy="Try a different filter or clear your search. New events show up as organizers post them."
          icon={<Sparkles color={colors.accentText} size={22} />}
        />
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

function formatSoon(startsAt: string) {
  const start = new Date(startsAt).getTime();
  const diffHours = Math.max(0, Math.round((start - Date.now()) / (60 * 60 * 1000)));
  if (diffHours < 24) return `${diffHours}h`;
  return `${Math.round(diffHours / 24)}d`;
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: spacing.md
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.hot
  },
  hero: {
    marginBottom: spacing.md,
    gap: spacing.md,
    overflow: "hidden"
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center"
  },
  stat: {
    flex: 1,
    gap: spacing.xxs
  },
  statDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: colors.borderSoft,
    marginHorizontal: spacing.md
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 50,
    marginBottom: spacing.md
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 15
  },
  filterScroll: {
    marginHorizontal: -spacing.md,
    marginBottom: spacing.xs
  },
  filters: {
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs
  }
});
