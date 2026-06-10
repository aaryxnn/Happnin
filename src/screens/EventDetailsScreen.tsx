import { RouteProp, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar, Flag, LucideProps, MapPin, Send, ShieldCheck, Users } from "lucide-react-native";
import { ComponentType, useEffect, useState } from "react";
import { Alert, ImageBackground, Pressable, Share, StyleSheet, Switch, View } from "react-native";

import { AppButton } from "../components/AppButton";
import { Badge, Divider, EmptyState, Panel } from "../components/PageElements";
import { Screen } from "../components/Screen";
import { Txt } from "../components/Txt";
import { useApp } from "../context/AppContext";
import { RootStackParamList } from "../navigation/types";
import { colors, gradients, radius, spacing } from "../theme";

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
        <EmptyState title="Event not found" copy="This event may have been removed." />
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
    <Screen style={styles.screen}>
      <ImageBackground source={{ uri: event.imageUrl }} style={styles.hero} imageStyle={styles.heroImage}>
        <LinearGradient colors={gradients.scrim} style={styles.scrim} />
        <View style={styles.heroTop}>
          <Badge label={event.category} tone="accent" />
          {event.organizerVerified ? (
            <Badge label="Verified" tone="success" icon={<ShieldCheck color={colors.success} size={12} />} />
          ) : null}
        </View>
        <View style={styles.heroBottom}>
          <Txt variant="overline" color={colors.accentText}>
            {start.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}
          </Txt>
          <Txt variant="display">{event.title}</Txt>
          <Txt variant="bodyStrong" color={colors.muted}>
            by {event.organizerName}
          </Txt>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <Txt variant="body" color={colors.muted} style={styles.description}>
          {event.description}
        </Txt>

        <Panel style={styles.metaBox}>
          <Meta
            icon={Calendar}
            label="When"
            value={`${start.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} · ${start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`}
          />
          <Divider />
          <Meta icon={MapPin} label="Where" value={`${event.venueName}\n${event.address}`} />
          <Divider />
          <Meta icon={Users} label="Interest" value={`${event.rsvpCount} students interested`} />
        </Panel>

        <Panel style={styles.rsvpPanel}>
          <View style={styles.rsvpTop}>
            <View style={styles.rsvpText}>
              <Txt variant="title">Show I'm going</Txt>
              <Txt variant="caption" color={colors.muted}>
                Make your profile visible on this event.
              </Txt>
            </View>
            <Switch
              value={visibleRsvp}
              disabled={Boolean(rsvp)}
              onValueChange={setVisibleRsvp}
              thumbColor={colors.text}
              trackColor={{ false: colors.surfaceSoft, true: colors.accent }}
            />
          </View>
          <AppButton
            title={rsvp ? "Cancel RSVP" : "RSVP — I'm interested"}
            onPress={() => toggleRsvp(event.id, visibleRsvp)}
            variant={rsvp ? "secondary" : "primary"}
          />
          <AppButton title="Share event" onPress={shareEvent} variant="ghost" icon={Send} />
        </Panel>

        <Txt variant="h3" style={styles.sectionTitle}>
          Who's going
        </Txt>
        {event.visibleAttendees.length === 0 ? (
          <EmptyState title="No visible RSVPs yet" copy="Private RSVPs still count toward event interest." />
        ) : (
          <Panel style={styles.attendees}>
            {event.visibleAttendees.map((attendee, index) => (
              <View key={attendee.userId}>
                {index > 0 ? <Divider style={styles.attendeeDivider} /> : null}
                <View style={styles.attendee}>
                  <View style={styles.avatar}>
                    <Txt variant="label" color={colors.accentText}>
                      {attendee.fullName.charAt(0).toUpperCase()}
                    </Txt>
                  </View>
                  <Txt variant="bodyStrong">{attendee.fullName}</Txt>
                </View>
              </View>
            ))}
          </Panel>
        )}

        <Pressable onPress={report} style={styles.report} accessibilityRole="button">
          <Flag color={colors.faint} size={15} />
          <Txt variant="caption" color={colors.faint}>
            Report this event
          </Txt>
        </Pressable>
      </View>
    </Screen>
  );
}

function Meta({ icon: Icon, label, value }: { icon: ComponentType<LucideProps>; label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <View style={styles.metaIcon}>
        <Icon color={colors.accentText} size={18} strokeWidth={2.2} />
      </View>
      <View style={styles.metaText}>
        <Txt variant="overline" color={colors.faint}>
          {label.toUpperCase()}
        </Txt>
        <Txt variant="bodyStrong">{value}</Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
    paddingTop: 0
  },
  hero: {
    height: 340,
    justifyContent: "space-between",
    padding: spacing.lg
  },
  heroImage: {
    backgroundColor: colors.surfaceStrong
  },
  scrim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  heroBottom: {
    gap: spacing.xs
  },
  content: {
    padding: spacing.md,
    gap: spacing.md
  },
  description: {
    marginTop: spacing.xxs
  },
  metaBox: {
    gap: spacing.md
  },
  metaRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center"
  },
  metaIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  metaText: {
    flex: 1,
    gap: 2
  },
  rsvpPanel: {
    gap: spacing.md
  },
  rsvpTop: {
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    alignItems: "center"
  },
  rsvpText: {
    flex: 1,
    gap: spacing.xxs
  },
  sectionTitle: {
    marginTop: spacing.xs
  },
  attendees: {
    gap: 0
  },
  attendee: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xs
  },
  attendeeDivider: {
    marginVertical: spacing.xxs
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  report: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md
  }
});
