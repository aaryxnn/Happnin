import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Clock, MapPin, ShieldCheck, Users } from "lucide-react-native";
import { Image, Pressable, StyleSheet, View } from "react-native";

import { RootStackParamList } from "../navigation/types";
import { colors, radius, shadows, spacing } from "../theme";
import { HappninEvent } from "../types";
import { Badge } from "./PageElements";
import { Txt } from "./Txt";

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
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Txt variant="caption" color={colors.accentText}>
            {event.organizerName.charAt(0).toUpperCase()}
          </Txt>
        </View>
        <View style={styles.headerText}>
          <View style={styles.organizerRow}>
            <Txt variant="label" numberOfLines={1} style={styles.organizerName}>
              {event.organizerName}
            </Txt>
            {event.organizerVerified ? <ShieldCheck color={colors.accent} size={14} /> : null}
          </View>
          <Txt variant="caption" color={colors.faint} numberOfLines={1}>
            {event.venueName}
          </Txt>
        </View>
        <Badge label={event.category} tone="accent" />
      </View>

      <Image source={{ uri: event.imageUrl }} style={styles.poster} resizeMode="cover" />

      <View style={styles.body}>
        <View style={styles.dateRow}>
          <Txt variant="overline" color={colors.accentText}>
            {start
              .toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
              .toUpperCase()}
            {"  •  "}
            {start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }).toUpperCase()}
          </Txt>
          {isRsvpd ? (
            <Txt variant="overline" color={colors.success}>
              GOING
            </Txt>
          ) : null}
        </View>

        <Txt variant="h2" numberOfLines={2}>
          {event.title}
        </Txt>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Users color={colors.faint} size={15} strokeWidth={2.2} />
            <Txt variant="caption" color={colors.muted}>
              {event.rsvpCount} going
            </Txt>
          </View>
          <View style={styles.metaItem}>
            <Clock color={colors.faint} size={15} strokeWidth={2.2} />
            <Txt variant="caption" color={colors.muted}>
              {relativeDay(start)}
            </Txt>
          </View>
          <View style={[styles.metaItem, styles.venue]}>
            <MapPin color={colors.faint} size={15} strokeWidth={2.2} />
            <Txt variant="caption" color={colors.muted} numberOfLines={1}>
              {event.address}
            </Txt>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date: Date) {
  const start = startOfDay(date);
  start.setDate(start.getDate() - start.getDay());
  return start;
}

function relativeDay(date: Date) {
  const today = startOfDay(new Date());
  const target = startOfDay(date);
  const diffDays = Math.round((target.getTime() - today.getTime()) / MS_PER_DAY);

  if (diffDays < 0) return "Happening now";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";

  const weekDelta = Math.round((startOfWeek(target).getTime() - startOfWeek(today).getTime()) / (7 * MS_PER_DAY));
  if (weekDelta === 0) {
    return `This ${date.toLocaleDateString(undefined, { weekday: "long" })} (${diffDays} days left)`;
  }

  return `In ${diffDays} days`;
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderRadius: radius.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...shadows.card
  },
  pressed: {
    opacity: 0.95
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  headerText: {
    flex: 1,
    gap: 1
  },
  organizerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs
  },
  organizerName: {
    flexShrink: 1
  },
  poster: {
    width: "100%",
    aspectRatio: 4 / 5,
    backgroundColor: colors.surfaceStrong
  },
  body: {
    padding: spacing.md,
    gap: spacing.xs
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  meta: {
    gap: spacing.xs,
    marginTop: spacing.xxs
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  venue: {
    flexShrink: 1
  }
});
