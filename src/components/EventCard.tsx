import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Clock, MapPin, ShieldCheck, Users } from "lucide-react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

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
  const organizerInitial = event.organizerName.trim().charAt(0).toUpperCase() || "H";

  return (
    <Pressable
      onPress={() => navigation.navigate("EventDetails", { eventId: event.id })}
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{organizerInitial}</Text>
        </View>
        <View style={styles.headerText}>
          <View style={styles.organizerLine}>
            <Text style={styles.organizerName} numberOfLines={1}>
              {event.organizerName}
            </Text>
            {event.organizerVerified ? <ShieldCheck color={colors.green} size={14} strokeWidth={2.6} /> : null}
          </View>
          <Text style={styles.venueName} numberOfLines={1}>
            {event.venueName}
          </Text>
        </View>
        <View style={styles.category}>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>
      </View>

      <Image source={{ uri: event.imageUrl }} style={styles.poster} resizeMode="cover" />

      <View style={styles.body}>
        <View style={styles.dateRow}>
          <Text style={styles.when}>
            {start.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }).toUpperCase()}
            {"  /  "}
            {start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }).toUpperCase()}
          </Text>
          {isRsvpd ? (
            <View style={styles.rsvpPill}>
              <Text style={styles.rsvpText}>GOING</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Users color={colors.accentStrong} size={15} strokeWidth={2.4} />
            <Text style={styles.metaText}>{event.rsvpCount} interested</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock color={colors.pink} size={15} strokeWidth={2.4} />
            <Text style={styles.metaText}>{relativeDay(start)}</Text>
          </View>
          <View style={styles.metaItem}>
            <MapPin color={colors.lime} size={15} strokeWidth={2.4} />
            <Text style={styles.metaText} numberOfLines={1}>
              {event.address}
            </Text>
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
    return `This ${date.toLocaleDateString(undefined, { weekday: "long" })}`;
  }

  return `In ${diffDays} days`;
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderRadius: radius.lg,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.paperBorder,
    marginBottom: spacing.lg,
    ...shadows.paper
  },
  pressed: {
    transform: [{ scale: 0.992 }],
    opacity: 0.95
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.paper
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900"
  },
  headerText: {
    flex: 1,
    gap: 2,
    minWidth: 0
  },
  organizerLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  organizerName: {
    color: colors.ink,
    flexShrink: 1,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: -0.18
  },
  venueName: {
    color: colors.inkMuted,
    fontSize: 12,
    fontWeight: "800"
  },
  category: {
    backgroundColor: colors.paperSoft,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.paperBorder,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  categoryText: {
    color: colors.accentStrong,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: -0.08
  },
  poster: {
    width: "100%",
    aspectRatio: 4 / 5,
    backgroundColor: colors.surfaceStrong
  },
  body: {
    gap: spacing.xs,
    padding: spacing.md,
    backgroundColor: colors.paper
  },
  dateRow: {
    minHeight: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  when: {
    color: colors.accentStrong,
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.3
  },
  rsvpPill: {
    backgroundColor: colors.lime,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4
  },
  rsvpText: {
    color: colors.ink,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.2
  },
  title: {
    color: colors.ink,
    fontSize: 25,
    lineHeight: 29,
    fontWeight: "900",
    letterSpacing: -0.4
  },
  meta: {
    gap: spacing.xs,
    marginTop: spacing.xs
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    minWidth: 0
  },
  metaText: {
    color: colors.inkMuted,
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 18
  }
});
