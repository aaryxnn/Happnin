import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { MapView, Marker } from "../components/NativeMap";
import { useApp } from "../context/AppContext";
import { RootStackParamList } from "../navigation/types";
import { colors, radius, shadows, spacing } from "../theme";

export function MapScreen() {
  const { campus, events } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const publishedEvents = events.filter((event) => event.status === "published");

  return (
    <View style={styles.container}>
      {MapView && Marker ? (
        <MapView
          style={styles.map}
          userInterfaceStyle="dark"
          initialRegion={{
            latitude: campus.latitude,
            longitude: campus.longitude,
            latitudeDelta: 0.035,
            longitudeDelta: 0.035
          }}
        >
          {publishedEvents.map((event) => (
            <Marker
              key={event.id}
              coordinate={{ latitude: event.latitude, longitude: event.longitude }}
              title={event.title}
              description={event.venueName}
              pinColor={colors.accentStrong}
              onCalloutPress={() => navigation.navigate("EventDetails", { eventId: event.id })}
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.webMap}>
          <Text style={styles.webMapTitle}>{campus.shortName} event map</Text>
          <Text style={styles.webMapCopy}>Native map preview is available on iOS and Android.</Text>
          <View style={styles.webPinList}>
            {publishedEvents.slice(0, 5).map((event) => (
              <Pressable
                key={event.id}
                onPress={() => navigation.navigate("EventDetails", { eventId: event.id })}
                style={({ pressed }) => [styles.webPin, pressed && styles.webPinPressed]}
              >
                <View style={styles.webPinDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.webPinTitle} numberOfLines={1}>
                    {event.title}
                  </Text>
                  <Text style={styles.webPinVenue} numberOfLines={1}>
                    {event.venueName}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      <View style={styles.sheet}>
        <Text style={styles.title}>Campus map</Text>
        <Text style={styles.copy}>Simple pins for Phase 1. Heatmaps and friend movement come later.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  map: {
    flex: 1
  },
  webMap: {
    flex: 1,
    justifyContent: "center",
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.backgroundRaised
  },
  webMapTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.4
  },
  webMapCopy: {
    color: colors.muted,
    lineHeight: 21
  },
  webPinList: {
    gap: spacing.sm
  },
  webPin: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.paperBorder,
    borderRadius: radius.md,
    backgroundColor: colors.paper,
    padding: spacing.md
  },
  webPinPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }]
  },
  webPinDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.pink
  },
  webPinTitle: {
    color: colors.ink,
    fontWeight: "900"
  },
  webPinVenue: {
    color: colors.inkMuted,
    marginTop: 2
  },
  sheet: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: 100,
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.paperBorder,
    padding: spacing.md,
    ...shadows.paper
  },
  title: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.25
  },
  copy: {
    color: colors.inkMuted,
    marginTop: spacing.xs,
    lineHeight: 20
  }
});
