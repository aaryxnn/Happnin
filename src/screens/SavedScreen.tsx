import { StyleSheet, Text } from "react-native";

import { EventCard } from "../components/EventCard";
import { Screen } from "../components/Screen";
import { useApp } from "../context/AppContext";
import { colors, radius, spacing } from "../theme";

export function SavedScreen() {
  const { events, rsvps } = useApp();
  const savedEvents = events.filter((event) => rsvps.some((rsvp) => rsvp.eventId === event.id));

  return (
    <Screen>
      <Text style={styles.title}>Your RSVPs</Text>
      <Text style={styles.copy}>Events you are interested in, with reminders scheduled when possible.</Text>
      {savedEvents.length === 0 ? (
        <Text style={styles.empty}>No RSVPs yet. Find one event that feels worth texting the group chat about.</Text>
      ) : (
        savedEvents.map((event) => <EventCard key={event.id} event={event} isRsvpd />)
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 36,
    fontWeight: "900",
    marginBottom: spacing.sm
  },
  copy: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23,
    marginBottom: spacing.md
  },
  empty: {
    color: colors.muted,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.md,
    lineHeight: 22
  }
});
