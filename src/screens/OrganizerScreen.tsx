import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CalendarPlus, ShieldAlert, ShieldCheck } from "lucide-react-native";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { AppButton } from "../components/AppButton";
import { Badge, EmptyState, PageHeader, Panel, SectionHeader } from "../components/PageElements";
import { Screen } from "../components/Screen";
import { TextField } from "../components/TextField";
import { Txt } from "../components/Txt";
import { useApp } from "../context/AppContext";
import { isDevAdminFlowEnabled } from "../lib/devAdmin";
import { RootStackParamList } from "../navigation/types";
import { colors, radius, spacing } from "../theme";

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
      <PageHeader title="Organizer" copy="Verified clubs and trusted students can publish events to the campus feed." />

      {myOrganizer ? (
        <Panel style={styles.panel} elevated>
          <View style={styles.statusRow}>
            <View style={styles.statusIcon}>
              {myOrganizer.verified ? (
                <ShieldCheck color={colors.success} size={22} />
              ) : (
                <ShieldAlert color={colors.warning} size={22} />
              )}
            </View>
            <View style={styles.statusText}>
              <Txt variant="h3">{myOrganizer.displayName}</Txt>
              <View style={styles.badgeRow}>
                <Badge
                  label={myOrganizer.verified ? "Verified" : myOrganizer.status}
                  tone={myOrganizer.verified ? "success" : "accent"}
                />
              </View>
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
        </Panel>
      ) : (
        <Panel style={styles.panel}>
          <Txt variant="h3">Request verification</Txt>
          <Txt variant="caption" color={colors.muted}>
            Use a club Instagram, website, Linktree, or officer contact as proof.
          </Txt>
          <TextField label="Organizer or club name" value={displayName} onChangeText={setDisplayName} autoCapitalize="words" placeholder="UMass Ski Club" />
          <TextField label="Proof link" value={proofUrl} onChangeText={setProofUrl} placeholder="https://instagram.com/club" keyboardType="url" />
          <AppButton title="Submit for review" onPress={requestVerification} />
        </Panel>
      )}

      <View style={styles.sectionWrap}>
        <SectionHeader title="Your events" />
        {myEvents.length === 0 ? (
          <EmptyState title="No events yet" copy="Once you're verified, events you create show up here." />
        ) : (
          myEvents.map((event) => (
            <Panel key={event.id} style={styles.eventRow}>
              <Txt variant="title" numberOfLines={1} style={styles.eventTitle}>
                {event.title}
              </Txt>
              <Badge label={event.status} tone={event.status === "published" ? "success" : "neutral"} />
            </Panel>
          ))
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  panel: {
    gap: spacing.md
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceStrong,
    alignItems: "center",
    justifyContent: "center"
  },
  statusText: {
    flex: 1,
    gap: spacing.xs
  },
  badgeRow: {
    flexDirection: "row"
  },
  sectionWrap: {
    marginTop: spacing.lg
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  eventTitle: {
    flex: 1
  }
});
