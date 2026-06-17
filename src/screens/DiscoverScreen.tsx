import { Pressable, StyleSheet, Text, View } from "react-native";
import { Music, Pizza, Trophy, UsersRound } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

import { AppButton } from "../components/AppButton";
import { EventCard } from "../components/EventCard";
import { Screen } from "../components/Screen";
import { useApp } from "../context/AppContext";
import { categories, colors, radius, shadows, spacing } from "../theme";
import { EventCategory } from "../types";
import { useState } from "react";

export function DiscoverScreen() {
  const { events, rsvps } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const trending = [...events].sort((a, b) => b.rsvpCount - a.rsvpCount).slice(0, 2);
  const categoryEvents = selectedCategory
    ? events
        .filter((event) => event.status === "published")
        .filter((event) => event.category === selectedCategory)
        .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    : [];

  if (selectedCategory) {
    return (
      <Screen>
        <Text style={styles.title}>{selectedCategory}</Text>
        <Text style={styles.copy}>{categoryEvents.length} live events in this scene.</Text>
        <View style={styles.backButton}>
          <AppButton title="Back to scenes" variant="secondary" onPress={() => setSelectedCategory(null)} />
        </View>
        {categoryEvents.length === 0 ? (
          <Text style={styles.empty}>No {selectedCategory.toLowerCase()} events yet.</Text>
        ) : (
          categoryEvents.map((event) => (
            <EventCard key={event.id} event={event} isRsvpd={rsvps.some((rsvp) => rsvp.eventId === event.id)} />
          ))
        )}
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>Discover</Text>
      <Text style={styles.copy}>Browse by scene, then jump into the events with the most campus energy.</Text>

      <View style={styles.grid}>
        {categories.map((category, index) => (
          <Pressable
            key={category}
            style={({ pressed }) => [
              styles.tile,
              { transform: [{ rotate: index % 2 === 0 ? "-1deg" : "1deg" }] },
              pressed && styles.tilePressed
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <LinearGradient colors={["rgba(251, 247, 255, 0.98)", "rgba(242, 236, 255, 0.9)"]} style={styles.tileFill} />
            {index % 4 === 0 ? <UsersRound color={colors.accent} size={22} /> : null}
            {index % 4 === 1 ? <Music color={colors.pink} size={22} /> : null}
            {index % 4 === 2 ? <Trophy color={colors.lime} size={22} /> : null}
            {index % 4 === 3 ? <Pizza color={colors.amber} size={22} /> : null}
            <Text style={styles.tileText}>{category}</Text>
            <Text style={styles.tileCount}>{events.filter((event) => event.category === category).length} live</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.section}>Trending now</Text>
      {trending.map((event) => (
        <EventCard key={event.id} event={event} isRsvpd={rsvps.some((rsvp) => rsvp.eventId === event.id)} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 36,
    fontWeight: "900",
    marginBottom: spacing.sm,
    letterSpacing: -0.55
  },
  copy: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23,
    marginBottom: spacing.md
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg
  },
  tile: {
    width: "48%",
    minHeight: 128,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.paperBorder,
    backgroundColor: colors.paper,
    padding: spacing.md,
    justifyContent: "space-between",
    overflow: "hidden",
    ...shadows.paperTight
  },
  tileFill: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  tilePressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.82
  },
  tileText: {
    color: colors.ink,
    fontWeight: "900",
    fontSize: 18,
    letterSpacing: -0.25
  },
  tileCount: {
    color: colors.inkMuted,
    fontWeight: "800"
  },
  section: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: spacing.md
  },
  backButton: {
    marginBottom: spacing.md
  },
  empty: {
    color: colors.inkMuted,
    backgroundColor: colors.paper,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.paperBorder,
    padding: spacing.md,
    lineHeight: 22,
    ...shadows.paperTight
  }
});
