import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import { Badge } from "../components/PageElements";
import { Txt } from "../components/Txt";
import { useApp } from "../context/AppContext";
import { RootStackParamList } from "../navigation/types";
import { colors, radius, shadows, spacing } from "../theme";

export function MapScreen() {
  const { campus, events } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const published = events.filter((event) => event.status === "published");

  return (
    <View style={styles.container}>
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
        {published.map((event) => (
          <Marker
            key={event.id}
            coordinate={{ latitude: event.latitude, longitude: event.longitude }}
            title={event.title}
            description={event.venueName}
            pinColor={colors.accent}
            onCalloutPress={() => navigation.navigate("EventDetails", { eventId: event.id })}
          />
        ))}
      </MapView>

      <SafeAreaView style={styles.topBar} edges={["top"]} pointerEvents="box-none">
        <View style={styles.titlePill}>
          <Txt variant="label">Campus map</Txt>
          <Badge label={`${published.length} live`} tone="accent" />
        </View>
      </SafeAreaView>

      <View style={styles.sheet}>
        <Txt variant="h3">Find events near you</Txt>
        <Txt variant="caption" color={colors.muted} style={styles.sheetCopy}>
          Tap a pin, then open its callout to see full event details.
        </Txt>
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
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center"
  },
  titlePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    ...shadows.soft
  },
  sheet: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: 100,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xxs,
    ...shadows.card
  },
  sheetCopy: {
    marginTop: spacing.xxs
  }
});
