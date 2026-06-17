import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Bookmark, Check, Clock, MapPin, MoreVertical, ShieldCheck, Users } from "lucide-react-native";
import { GestureResponderEvent, Image, Pressable, StyleSheet, Text, View } from "react-native";

import { useApp } from "../context/AppContext";
import { RootStackParamList } from "../navigation/types";
import { colors, radius, shadows, spacing } from "../theme";
import { EventCategory, HappninEvent } from "../types";

type Props = {
  event: HappninEvent;
  isRsvpd?: boolean;
};

const categoryTone: Record<EventCategory, string> = {
  Parties: colors.lime,
  Clubs: colors.pink,
  Campus: colors.purpleGlow,
  Sports: colors.amber,
  Music: colors.lime,
  Food: colors.amber,
  Nightlife: colors.pink
};

export function EventCard({ event, isRsvpd }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { toggleRsvp, user } = useApp();
  const start = new Date(event.startsAt);
  const end = event.endsAt ? new Date(event.endsAt) : null;
  const organizerInitial = event.organizerName.trim().charAt(0).toUpperCase() || "H";
  const tone = categoryTone[event.category] ?? colors.purpleGlow;
  const posterAccent = event.category === "Parties" || event.category === "Nightlife" ? colors.pink : tone;
  const posterWords = getPosterWords(event);

  async function handleRsvp(pressEvent: GestureResponderEvent) {
    pressEvent.stopPropagation();
    await toggleRsvp(event.id, user?.visibleRsvpsDefault ?? false);
  }

  return (
    <Pressable
      onPress={() => navigation.navigate("EventDetails", { eventId: event.id })}
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <LinearGradient colors={["rgba(11, 7, 22, 0.99)", "rgba(19, 10, 33, 0.98)"]} style={styles.cardFill}>
        <View style={styles.header}>
          <View style={[styles.avatar, { borderColor: tone }]}>
            <Text style={styles.avatarText}>{organizerInitial}</Text>
          </View>
          <View style={styles.headerText}>
            <View style={styles.organizerLine}>
              <Text style={styles.organizerName} numberOfLines={1}>
                {event.organizerName}
              </Text>
              {event.organizerVerified ? <ShieldCheck color={colors.accent} size={17} strokeWidth={3} /> : null}
            </View>
            <Text style={styles.venueName} numberOfLines={1}>
              {event.venueName}
            </Text>
          </View>
          <View style={styles.category}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
          <MoreVertical color={colors.inkFaint} size={23} strokeWidth={2.7} />
        </View>

        <View style={styles.posterFrame}>
          <Image source={{ uri: event.imageUrl }} style={styles.poster} resizeMode="cover" />
          <LinearGradient
            pointerEvents="none"
            colors={["rgba(5, 3, 10, 0.24)", "rgba(5, 3, 10, 0.46)", "rgba(5, 3, 10, 0.72)"]}
            locations={[0, 0.58, 1]}
            style={styles.posterShade}
          />
          <View pointerEvents="none" style={styles.posterCopy}>
            <Text style={[styles.posterIcon, { color: tone }]}>{posterWords.mark}</Text>
            <Text style={styles.posterHeadline} numberOfLines={1} adjustsFontSizeToFit>
              {posterWords.lineOne}
            </Text>
            <Text style={[styles.posterHeadlineAccent, { color: posterAccent }]} numberOfLines={1} adjustsFontSizeToFit>
              {posterWords.lineTwo}
            </Text>
            <Text style={styles.posterKicker} numberOfLines={1}>
              {event.venueName.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.detailTop}>
            <View style={styles.dateBlock}>
              <Text style={styles.dateText}>{formatDate(start)}</Text>
              <Text style={styles.timeRange}>{formatTimeRange(start, end)}</Text>
            </View>
            <View style={styles.actions}>
              <Pressable
                onPress={handleRsvp}
                style={({ pressed }) => [styles.rsvpPill, isRsvpd && styles.rsvpPillActive, pressed && styles.actionPressed]}
              >
                <Text style={[styles.rsvpText, isRsvpd && styles.rsvpTextActive]}>
                  {isRsvpd ? "GOING" : "I'M INTERESTED"}
                </Text>
                {isRsvpd ? <Check color={colors.lime} size={18} strokeWidth={3.2} /> : null}
              </Pressable>
              <View style={styles.bookmark}>
                <Bookmark color={colors.purpleGlow} size={28} strokeWidth={2.5} />
              </View>
            </View>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {event.title}
          </Text>

          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Users color={colors.inkFaint} size={19} strokeWidth={2.4} />
              <Text style={styles.metaText}>{event.rsvpCount} interested</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.metaItem}>
              <Clock color={colors.inkFaint} size={19} strokeWidth={2.4} />
              <Text style={styles.metaText}>{formatShortTime(start)}</Text>
            </View>
            <View style={styles.separator} />
            <View style={[styles.metaItem, styles.metaLocation]}>
              <MapPin color={colors.inkFaint} size={19} strokeWidth={2.4} />
              <Text style={styles.metaText} numberOfLines={1}>
                {event.venueName}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function getPosterWords(event: HappninEvent) {
  if (event.category === "Parties" || event.category === "Nightlife") {
    return { lineOne: "NIGHT", lineTwo: "SHIFT", mark: "*" };
  }
  if (event.category === "Clubs") {
    return { lineOne: "BUILD", lineTwo: "THE FUTURE", mark: "</>" };
  }
  if (event.category === "Food") {
    return { lineOne: "FOOD", lineTwo: "CRAWL", mark: "." };
  }
  if (event.category === "Sports") {
    return { lineOne: "GAME", lineTwo: "NIGHT", mark: "!" };
  }
  if (event.category === "Music") {
    return { lineOne: "LIVE", lineTwo: "SET", mark: "~" };
  }
  return { lineOne: "CAMPUS", lineTwo: "DROP", mark: "#" };
}

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }).toUpperCase();
}

function formatTimeRange(start: Date, end: Date | null) {
  if (!end) return formatClock(start);
  return `${formatClock(start)} - ${formatClock(end)}`;
}

function formatShortTime(date: Date) {
  return formatClock(date).replace(":00", "");
}

function formatClock(date: Date) {
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }).toUpperCase();
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(168, 85, 247, 0.48)",
    backgroundColor: "#090511",
    marginBottom: 18,
    ...shadows.paper
  },
  cardFill: {
    padding: 10
  },
  pressed: {
    transform: [{ scale: 0.992 }],
    opacity: 0.96
  },
  header: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xs
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.2,
    backgroundColor: "rgba(18, 9, 31, 0.86)",
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    color: colors.text,
    fontSize: 20,
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
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0
  },
  venueName: {
    color: colors.inkMuted,
    fontSize: 15,
    fontWeight: "700"
  },
  category: {
    minHeight: 42,
    minWidth: 92,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(168, 85, 247, 0.16)",
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: "rgba(168, 85, 247, 0.34)",
    paddingHorizontal: spacing.md
  },
  categoryText: {
    color: colors.purpleGlow,
    fontSize: 15,
    fontWeight: "900"
  },
  posterFrame: {
    width: "100%",
    aspectRatio: 1.86,
    overflow: "hidden",
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.32)",
    backgroundColor: colors.surfaceStrong
  },
  poster: {
    width: "100%",
    height: "100%"
  },
  posterShade: {
    ...StyleSheet.absoluteFillObject
  },
  posterCopy: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg
  },
  posterIcon: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    fontSize: 26,
    fontWeight: "900",
    opacity: 0.88
  },
  posterHeadline: {
    color: colors.text,
    fontSize: 52,
    lineHeight: 55,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0
  },
  posterHeadlineAccent: {
    marginTop: -8,
    fontSize: 45,
    lineHeight: 48,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 0
  },
  posterKicker: {
    color: colors.text,
    marginTop: spacing.xs,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    textAlign: "center",
    opacity: 0.86
  },
  body: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm
  },
  detailTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md
  },
  dateBlock: {
    width: 132,
    gap: 3
  },
  dateText: {
    color: colors.pink,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0
  },
  timeRange: {
    color: colors.inkMuted,
    fontSize: 14,
    fontWeight: "800"
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  rsvpPill: {
    minHeight: 38,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: "rgba(168, 85, 247, 0.58)",
    backgroundColor: "rgba(29, 16, 48, 0.42)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: 12
  },
  rsvpPillActive: {
    borderColor: "rgba(182, 255, 92, 0.48)",
    backgroundColor: "rgba(182, 255, 92, 0.1)"
  },
  rsvpText: {
    color: colors.purpleGlow,
    fontSize: 11,
    fontWeight: "900"
  },
  rsvpTextActive: {
    color: colors.lime
  },
  actionPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9
  },
  bookmark: {
    width: 30,
    height: 38,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    color: colors.ink,
    fontSize: 25,
    lineHeight: 30,
    fontWeight: "900",
    letterSpacing: 0
  },
  meta: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    minWidth: 0
  },
  metaLocation: {
    flex: 1
  },
  metaText: {
    color: colors.inkMuted,
    flexShrink: 1,
    fontSize: 14,
    fontWeight: "800"
  },
  separator: {
    width: 1,
    height: 22,
    backgroundColor: "rgba(132, 115, 156, 0.42)"
  }
});
