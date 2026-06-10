import { ComponentType, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
  GraduationCap,
  LucideProps,
  Moon,
  Music,
  PartyPopper,
  Trophy,
  UsersRound,
  UtensilsCrossed
} from "lucide-react-native";

import { AppButton } from "../components/AppButton";
import { EventCard } from "../components/EventCard";
import { EmptyState, PageHeader, SectionHeader } from "../components/PageElements";
import { Screen } from "../components/Screen";
import { Txt } from "../components/Txt";
import { useApp } from "../context/AppContext";
import { categories, colors, radius, spacing } from "../theme";
import { EventCategory } from "../types";

const categoryIcons: Record<string, ComponentType<LucideProps>> = {
  Parties: PartyPopper,
  Clubs: UsersRound,
  Campus: GraduationCap,
  Sports: Trophy,
  Music: Music,
  Food: UtensilsCrossed,
  Nightlife: Moon
};

export function DiscoverScreen() {
  const { events, rsvps } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const trending = [...events]
    .filter((event) => event.status === "published")
    .sort((a, b) => b.rsvpCount - a.rsvpCount)
    .slice(0, 2);
  const categoryEvents = selectedCategory
    ? events
        .filter((event) => event.status === "published")
        .filter((event) => event.category === selectedCategory)
        .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    : [];

  if (selectedCategory) {
    return (
      <Screen>
        <PageHeader title={selectedCategory} copy={`${categoryEvents.length} upcoming in this category.`} />
        <View style={styles.backButton}>
          <AppButton title="All categories" variant="secondary" onPress={() => setSelectedCategory(null)} />
        </View>
        {categoryEvents.length === 0 ? (
          <EmptyState title={`No ${selectedCategory.toLowerCase()} events yet`} copy="Check another category or come back later." />
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
      <PageHeader title="Discover" copy="Browse by category or see what's trending across campus." />

      <View style={styles.grid}>
        {categories.map((category) => {
          const Icon = categoryIcons[category] ?? UsersRound;
          const count = events.filter((event) => event.status === "published" && event.category === category).length;
          return (
            <Pressable
              key={category}
              style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
              onPress={() => setSelectedCategory(category)}
              accessibilityRole="button"
            >
              <View style={styles.iconWrap}>
                <Icon color={colors.accentText} size={20} strokeWidth={2.2} />
              </View>
              <View>
                <Txt variant="title">{category}</Txt>
                <Txt variant="caption" color={colors.faint}>
                  {count} {count === 1 ? "event" : "events"}
                </Txt>
              </View>
            </Pressable>
          );
        })}
      </View>

      <SectionHeader title="Trending now" />
      {trending.length === 0 ? (
        <EmptyState title="Nothing trending yet" copy="Events gain momentum as students RSVP." />
      ) : (
        trending.map((event) => (
          <EventCard key={event.id} event={event} isRsvpd={rsvps.some((rsvp) => rsvp.eventId === event.id)} />
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg
  },
  tile: {
    width: "48.5%",
    minHeight: 120,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: spacing.md,
    justifyContent: "space-between"
  },
  tilePressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }]
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  backButton: {
    marginBottom: spacing.md
  }
});
