import MapView, { Marker } from "react-native-maps";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useApp } from "../context/AppContext";
import { RootStackParamList } from "../navigation/types";
import { colors, radius, shadows, spacing } from "../theme";

export function MapScreen() {
  const { campus, events } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        userInterfaceStyle="light"
        initialRegion={{
          latitude: campus.latitude,
          longitude: campus.longitude,
          latitudeDelta: 0.035,
          longitudeDelta: 0.035
        }}
      >
        {events
          .filter((event) => event.status === "published")
          .map((event) => (
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
