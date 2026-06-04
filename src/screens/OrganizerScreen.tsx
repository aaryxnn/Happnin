import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Alert, StyleSheet, Text, View } from "react-native";
import { CalendarPlus, ShieldAlert, ShieldCheck } from "lucide-react-native";

import { AppButton } from "../components/AppButton";
import { Screen } from "../components/Screen";
import { TextField } from "../components/TextField";
import { useApp } from "../context/AppContext";
import { isDevAdminFlowEnabled } from "../lib/devAdmin";
import { RootStackParamList } from "../navigation/types";
import { colors, radius, shadows, spacing } from "../theme";
import { useState } from "react";

export function OrganizerScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, organizers, events, requestOrganizerVerification, approveOwnOrganizerForDev } = useApp();
  const [displayName, setDisplayName] = useState("");
  const [proofUrl, setProofUrl] = useState("");

  const myOrganizer = organizers.find((organizer) => organizer.ownerUserId === user?.id);
  const myEvents = events.filter((event) => event.organizerId === myOrganizer?.id);
  const canPublish = Boolean(myOrganizer?.verified);
  const canUseDevAdmin = isDevAdminFlowEnabled() && Boolean(myOrganizer && !myOrganizer.verified && myOrganizer.status === "pending");

  async function requestVerification() {
    if (!displayName.trim() || !proofUrl.trim()) {
      Alert.alert("Missing info", "Add an organizer name and a proof link.");
      return;
    }
    await requestOrganizerVerification({ displayName: displayName.trim(), proofUrl: proofUrl.trim(), type: "club" });
    Alert.alert("Request sent", "For Phase 1, an admin approves organizer requests manually in Supabase.");
  }

  async function approveInDev() {
    try {
      await approveOwnOrganizerForDev();
      Alert.alert("Organizer approved", "Your dev organizer request is verified. You can publish an event now.", [
        { text: "Not now", style: "cancel" },
        { text: "Create event", onPress: () => navigation.navigate("CreateEvent") }
      ]);
    } catch (error) {
      Alert.alert("Could not approve", error instanceof Error ? error.message : "Try again after checking dev admin setup.");
    }
  }

  return (
    <Screen>
      <Text style={styles.title}>Organizer</Text>
      <Text style={styles.copy}>Clubs and trusted students can publish public events after verification.</Text>

      {myOrganizer ? (
        <View style={styles.panel}>
          <View style={styles.statusRow}>
            {myOrganizer.verified ? <ShieldCheck color={colors.green} size={22} /> : <ShieldAlert color={colors.amber} size={22} />}
            <View style={{ flex: 1 }}>
              <Text style={styles.panelTitle}>{myOrganizer.displayName}</Text>
              <Text style={styles.status}>{myOrganizer.verified ? "Verified organizer" : `Status: ${myOrganizer.status}`}</Text>
            </View>
          </View>
          <AppButton
            title={canPublish ? "Create event" : "Waiting for approval"}
            icon={CalendarPlus}
            onPress={() => navigation.navigate("CreateEvent")}
            disabled={!canPublish}
          />
          {canUseDevAdmin ? (
            <AppButton title="Approve in dev" icon={ShieldCheck} variant="secondary" onPress={approveInDev} />
          ) : null}
        </View>
      ) : (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Request organizer verification</Text>
          <Text style={styles.status}>Use a club Instagram, website, Linktree, or officer contact as proof.</Text>
          <TextField label="Organizer or club name" value={displayName} onChangeText={setDisplayName} autoCapitalize="words" />
          <TextField label="Proof link" value={proofUrl} onChangeText={setProofUrl} placeholder="https://instagram.com/club" />
          <AppButton title="Submit for review" onPress={requestVerification} />
        </View>
      )}

      <Text style={styles.section}>Your events</Text>
      {myEvents.length === 0 ? (
        <Text style={styles.empty}>No organizer events yet.</Text>
      ) : (
        myEvents.map((event) => (
          <View key={event.id} style={styles.eventRow}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.status}>{event.status}</Text>
          </View>
        ))
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
  panel: {
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.md,
    ...shadows.soft
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md
  },
  panelTitle: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 18
  },
  status: {
    color: colors.muted,
    marginTop: spacing.xs
  },
  section: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginTop: spacing.lg,
    marginBottom: spacing.sm
  },
  empty: {
    color: colors.muted,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md
  },
  eventRow: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.md,
    marginBottom: spacing.sm
  },
  eventTitle: {
    color: colors.text,
    fontWeight: "900"
  }
});
