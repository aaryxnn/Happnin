import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar, MapPin, ShieldCheck, Users } from "lucide-react-native";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";

import { RootStackParamList } from "../navigation/types";
import { colors, radius, shadows, spacing } from "../theme";
import { HappninEvent } from "../types";

type Props = {
  event: HappninEvent;
  isRsvpd?: boolean;
};

export function EventCard({ event, isRsvpd }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const start = new Date(event.startsAt);

  return (
    <Pressable
      onPress={() => navigation.navigate("EventDetails", { eventId: event.id })}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <ImageBackground source={{ uri: event.imageUrl }} imageStyle={styles.image} style={styles.imageWrap}>
        <LinearGradient
          colors={["rgba(5, 3, 10, 0)", "rgba(5, 3, 10, 0.42)", "rgba(5, 3, 10, 0.96)"]}
          style={styles.overlay}
        />
        <View style={styles.topRow}>
          <View style={styles.category}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
          {isRsvpd ? (
            <View style={styles.rsvpPill}>
              <Text style={styles.rsvpText}>RSVP'd</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.when}>
            {start.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} at{" "}
            {start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
          </Text>
          <Text style={styles.title}>{event.title}</Text>
          <View style={styles.organizerRow}>
            {event.organizerVerified ? <ShieldCheck color={colors.green} size={16} /> : null}
            <Text style={styles.organizer}>{event.organizerName}</Text>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Users color={colors.lime} size={16} />
          <Text style={styles.metaText}>{event.rsvpCount} interested</Text>
        </View>
        <View style={styles.metaItem}>
          <MapPin color={colors.pink} size={16} />
          <Text style={styles.metaText}>{event.venueName}</Text>
        </View>
        <View style={styles.metaItem}>
          <Calendar color={colors.accent} size={16} />
          <Text style={styles.metaText}>{timeUntil(start)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

function timeUntil(date: Date) {
  const diff = date.getTime() - Date.now();
  if (diff <= 0) return "Starting soon";
  const hours = Math.round(diff / (60 * 60 * 1000));
  if (hours < 24) return `${hours}h away`;
  const days = Math.round(hours / 24);
  return `${days}d away`;
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderRadius: radius.lg,
    backgroundColor: colors.cardElevated,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    marginBottom: spacing.lg,
    ...shadows.glow
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.92
  },
  imageWrap: {
    height: 244,
    justifyContent: "space-between",
    padding: spacing.md
  },
  image: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  category: {
    backgroundColor: "rgba(168, 85, 247, 0.92)",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.purpleGlow
  },
  categoryText: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 12
  },
  rsvpPill: {
    backgroundColor: "rgba(255, 78, 205, 0.24)",
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.pink
  },
  rsvpText: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 12
  },
  titleWrap: {
    gap: spacing.sm
  },
  when: {
    color: colors.purpleGlow,
    fontWeight: "900",
    fontSize: 12
  },
  title: {
    color: colors.text,
    fontSize: 27,
    lineHeight: 31,
    fontWeight: "900"
  },
  organizerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  organizer: {
    color: colors.text,
    fontWeight: "800",
    opacity: 0.92
  },
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.card
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(251, 247, 255, 0.04)",
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    maxWidth: "100%"
  },
  metaText: {
    color: colors.muted,
    fontWeight: "800",
    fontSize: 12,
    flexShrink: 1
  }
});
