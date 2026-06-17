import { RouteProp, useRoute } from "@react-navigation/native";
import { Alert, Image, Pressable, Share, StyleSheet, Switch, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar, Flag, LucideProps, MapPin, Send, ShieldCheck, Users } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ComponentType } from "react";

import { AppButton } from "../components/AppButton";
import { Screen } from "../components/Screen";
import { useApp } from "../context/AppContext";
import { RootStackParamList } from "../navigation/types";
import { colors, radius, shadows, spacing } from "../theme";

export function EventDetailsScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "EventDetails">>();
  const { events, rsvps, user, toggleRsvp, createReport } = useApp();
  const event = events.find((item) => item.id === route.params.eventId);
  const rsvp = rsvps.find((item) => item.eventId === event?.id && item.userId === user?.id);
  const visibleDefault = user?.visibleRsvpsDefault ?? false;
  const [visibleRsvp, setVisibleRsvp] = useState(visibleDefault);

  useEffect(() => {
    setVisibleRsvp(rsvp?.visible ?? visibleDefault);
  }, [rsvp?.visible, visibleDefault]);

  if (!event) {
    return (
      <Screen>
        <Text style={styles.title}>Event not found</Text>
      </Screen>
    );
  }

  const currentEvent = event;
  const start = new Date(currentEvent.startsAt);

  async function report() {
    await createReport("event", currentEvent.id, "Student reported this event for review.");
    Alert.alert("Report sent", "Thanks. This event is now in the review queue.");
  }

  async function shareEvent() {
    await Share.share({
      message: `${currentEvent.title}\n${start.toLocaleDateString()} at ${start.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
      })}\n${currentEvent.venueName}\n\nFound on Happnin at UMass.`
    });
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Image source={{ uri: event.imageUrl }} style={styles.image} />
        <LinearGradient colors={["rgba(168, 85, 247, 0.08)", "rgba(5, 3, 10, 0.86)"]} style={styles.imageFade} />
      </View>
      <View style={styles.categoryRow}>
        <Text style={styles.category}>{event.category}</Text>
        {event.organizerVerified ? (
          <View style={styles.verified}>
            <ShieldCheck color={colors.green} size={16} />
            <Text style={styles.verifiedText}>Verified organizer</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.description}>{event.description}</Text>

      <View style={styles.metaBox}>
        <Meta icon={Calendar} text={`${start.toLocaleDateString()} at ${start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`} />
        <Meta icon={MapPin} text={`${event.venueName} - ${event.address}`} />
        <Meta icon={Users} text={`${event.rsvpCount} students interested`} />
      </View>

      <View style={styles.rsvpPanel}>
        <View style={styles.rsvpTop}>
          <View>
            <Text style={styles.panelTitle}>Social RSVP</Text>
            <Text style={styles.panelCopy}>Show your profile so classmates know you are going.</Text>
          </View>
          <Switch
            value={visibleRsvp}
            disabled={Boolean(rsvp)}
            onValueChange={setVisibleRsvp}
            thumbColor={colors.paper}
            trackColor={{ false: colors.paperBorder, true: colors.accentStrong }}
          />
        </View>
        <AppButton
          title={rsvp ? "Cancel RSVP" : "RSVP / I'm interested"}
          onPress={() => toggleRsvp(event.id, visibleRsvp)}
          variant={rsvp ? "secondary" : "primary"}
        />
        <AppButton title="Share event" onPress={shareEvent} variant="secondary" icon={Send} />
      </View>

      <View style={styles.attendees}>
        <Text style={styles.panelTitle}>Who's visibly going</Text>
        {event.visibleAttendees.length === 0 ? (
          <Text style={styles.panelCopy}>No visible RSVPs yet. Counts still help keep the feed active.</Text>
        ) : (
          event.visibleAttendees.map((attendee) => (
            <View key={attendee.userId} style={styles.attendee}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{attendee.fullName.charAt(0)}</Text>
              </View>
              <Text style={styles.attendeeName}>{attendee.fullName}</Text>
            </View>
          ))
        )}
      </View>

      <Pressable onPress={report} style={styles.report}>
        <Flag color={colors.danger} size={16} />
        <Text style={styles.reportText}>Report this event</Text>
      </Pressable>
    </Screen>
  );
}

function Meta({ icon: Icon, text }: { icon: ComponentType<LucideProps>; text: string }) {
  return (
    <View style={styles.metaRow}>
      <Icon color={colors.accentStrong} size={18} />
      <Text style={styles.metaText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 260,
    borderRadius: radius.lg
  },
  hero: {
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(251, 247, 255, 0.18)",
    ...shadows.paper
  },
  imageFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 120
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  category: {
    color: colors.ink,
    fontWeight: "900",
    backgroundColor: colors.paper,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.paperBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    overflow: "hidden"
  },
  verified: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(69, 245, 167, 0.12)",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  verifiedText: {
    color: colors.green,
    fontWeight: "900",
    fontSize: 12
  },
  title: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 39,
    fontWeight: "900",
    marginBottom: spacing.sm,
    letterSpacing: -0.5
  },
  description: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.md
  },
  metaBox: {
    gap: spacing.md,
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.paperBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.paperTight
  },
  metaRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center"
  },
  metaText: {
    color: colors.ink,
    fontWeight: "700",
    flex: 1
  },
  rsvpPanel: {
    gap: spacing.md,
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.paperBorder,
    ...shadows.paper
  },
  rsvpTop: {
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between"
  },
  panelTitle: {
    color: colors.ink,
    fontWeight: "900",
    fontSize: 17,
    letterSpacing: -0.2
  },
  panelCopy: {
    color: colors.inkMuted,
    lineHeight: 20,
    marginTop: spacing.xs
  },
  attendees: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.paperBorder,
    padding: spacing.md,
    ...shadows.paperTight
  },
  attendee: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    color: colors.text,
    fontWeight: "900"
  },
  attendeeName: {
    color: colors.ink,
    fontWeight: "800"
  },
  report: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.md
  },
  reportText: {
    color: colors.danger,
    fontWeight: "800"
  }
});
