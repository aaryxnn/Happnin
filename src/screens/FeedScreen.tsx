import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Plus, Search, SlidersHorizontal } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";

import { EventCard } from "../components/EventCard";
import { Screen } from "../components/Screen";
import { useApp } from "../context/AppContext";
import { RootStackParamList } from "../navigation/types";
import { colors, radius, shadows, spacing } from "../theme";

type DateFilter = "All" | "Tonight" | "Tomorrow" | "Weekend" | "Trending";
const dateFilters: DateFilter[] = ["All", "Tonight", "Tomorrow", "Weekend", "Trending"];

export function FeedScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { events, rsvps, user } = useApp();
  const { width } = useWindowDimensions();
  const [dateFilter, setDateFilter] = useState<DateFilter>("All");
  const [search, setSearch] = useState("");
  const compactHeader = width < 410;

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

  return (
    <Screen style={styles.screen}>
      <View style={styles.heroRow}>
        <Text
          style={[styles.title, compactHeader && styles.titleCompact]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.74}
        >
          What's <Text style={styles.titleAccent}>happnin?</Text>
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Create event"
          onPress={() => navigation.navigate("CreateEvent")}
          style={({ pressed }) => [styles.createButton, compactHeader && styles.createButtonCompact, pressed && styles.pressed]}
        >
          <LinearGradient colors={[colors.pink, colors.accent]} start={{ x: 0.16, y: 0 }} end={{ x: 0.9, y: 1 }} style={styles.createFill}>
            <Plus color={colors.text} size={30} strokeWidth={3.2} />
          </LinearGradient>
        </Pressable>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search color={colors.inkFaint} size={25} strokeWidth={2.35} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search events, people, places..."
            placeholderTextColor={colors.inkFaint}
            style={styles.searchInput}
            autoCapitalize="none"
          />
        </View>
        <Pressable style={({ pressed }) => [styles.filterButton, pressed && styles.pressed]}>
          <SlidersHorizontal color={colors.purpleGlow} size={25} strokeWidth={2.6} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        style={styles.filterScroller}
      >
        {dateFilters.map((item) => {
          const selected = dateFilter === item;
          return (
            <Pressable
              key={item}
              onPress={() => setDateFilter(item)}
              style={({ pressed }) => [styles.filterPill, selected && styles.filterPillSelected, pressed && styles.pressed]}
            >
              {selected ? (
                <LinearGradient colors={["#b026ff", colors.accentStrong]} style={StyleSheet.absoluteFillObject} />
              ) : null}
              <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{item}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

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
  screen: {
    paddingHorizontal: 18,
    paddingTop: spacing.lg
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.xs,
    marginBottom: spacing.lg
  },
  title: {
    color: colors.text,
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    fontSize: 31,
    lineHeight: 36,
    fontWeight: "900",
    letterSpacing: 0
  },
  titleAccent: {
    color: colors.pink
  },
  titleCompact: {
    fontSize: 23,
    lineHeight: 28
  },
  createButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
    flexShrink: 0,
    backgroundColor: colors.pink,
    ...shadows.glow
  },
  createButtonCompact: {
    width: 48,
    height: 48,
    borderRadius: 24
  },
  createFill: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg
  },
  searchBox: {
    minHeight: 66,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(168, 85, 247, 0.42)",
    backgroundColor: "rgba(13, 8, 24, 0.92)",
    paddingHorizontal: spacing.md
  },
  searchInput: {
    flex: 1,
    color: colors.ink,
    fontSize: 16,
    fontWeight: "800",
    outlineStyle: "none" as never
  },
  filterButton: {
    width: 66,
    height: 66,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: "rgba(168, 85, 247, 0.42)",
    backgroundColor: "rgba(18, 9, 31, 0.94)",
    alignItems: "center",
    justifyContent: "center"
  },
  filterScroller: {
    marginHorizontal: -18,
    marginBottom: spacing.md
  },
  filters: {
    gap: spacing.sm,
    paddingHorizontal: 18,
    paddingBottom: spacing.xs
  },
  filterPill: {
    minHeight: 54,
    minWidth: 82,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: "rgba(168, 85, 247, 0.46)",
    backgroundColor: "rgba(13, 8, 24, 0.82)",
    paddingHorizontal: spacing.lg
  },
  filterPillSelected: {
    borderColor: "rgba(255, 78, 205, 0.44)",
    ...shadows.glow
  },
  filterText: {
    color: colors.inkMuted,
    fontSize: 15,
    fontWeight: "900"
  },
  filterTextSelected: {
    color: colors.text
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9
  },
  empty: {
    color: colors.inkMuted,
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.paperBorder,
    padding: spacing.md,
    lineHeight: 22,
    ...shadows.paperTight
  }
});
