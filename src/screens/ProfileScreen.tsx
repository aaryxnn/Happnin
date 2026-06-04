import { Alert, StyleSheet, Switch, Text, View } from "react-native";
import { LogOut, ShieldCheck } from "lucide-react-native";

import { AppButton } from "../components/AppButton";
import { Chip } from "../components/Chip";
import { Screen } from "../components/Screen";
import { useApp } from "../context/AppContext";
import { colors, radius, shadows, spacing } from "../theme";

export function ProfileScreen() {
  const { user, clubs, signOut, isDemoMode, updateProfileSettings, interestCategories } = useApp();

  if (!user) return null;

  const interestNames = user.interests.map(
    (interest) => interestCategories.find((category) => category.slug === interest)?.name ?? interest
  );

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.fullName.charAt(0)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{user.fullName}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Campus profile</Text>
        <Text style={styles.rowText}>{user.schoolYear}</Text>
        <Text style={styles.rowText}>
          Choose whether new RSVPs start visible. You can still change visibility before RSVP'ing to each event.
        </Text>
        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingLabel}>Visible RSVP default</Text>
            <Text style={styles.settingHint}>{user.visibleRsvpsDefault ? "New RSVPs show your profile." : "New RSVPs stay private."}</Text>
          </View>
          <Switch
            value={user.visibleRsvpsDefault}
            onValueChange={(visibleRsvpsDefault) => updateProfileSettings({ visibleRsvpsDefault })}
            thumbColor={colors.text}
            trackColor={{ false: colors.surfaceSoft, true: colors.accentStrong }}
          />
        </View>
      </View>

      <Text style={styles.section}>Your interests</Text>
      <View style={styles.wrap}>
        {interestNames.map((interest) => (
          <Chip key={interest} label={interest} selected />
        ))}
      </View>

      <Text style={styles.section}>Club tags</Text>
      <View style={styles.wrap}>
        {user.clubTags.map((club) => (
          <Chip key={club} label={club} selected />
        ))}
      </View>

      <Text style={styles.section}>Verified clubs on campus</Text>
      {clubs.map((club) => (
        <View key={club.id} style={styles.clubRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.clubName}>{club.name}</Text>
            <Text style={styles.clubDescription}>{club.description}</Text>
          </View>
          {club.verified ? <ShieldCheck color={colors.green} size={20} /> : null}
        </View>
      ))}

      {isDemoMode ? <Text style={styles.demo}>Demo mode is active until Supabase env vars are added.</Text> : null}
      <AppButton
        title="Log out"
        variant="secondary"
        icon={LogOut}
        onPress={() => {
          Alert.alert("Log out?", "You can come back with your school email.", [
            { text: "Cancel", style: "cancel" },
            { text: "Log out", style: "destructive", onPress: signOut }
          ]);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accentStrong,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.glow
  },
  avatarText: {
    color: colors.background,
    fontSize: 30,
    fontWeight: "900"
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "900"
  },
  email: {
    color: colors.muted,
    fontWeight: "700"
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.soft
  },
  panelTitle: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 18
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingTop: spacing.sm
  },
  rowText: {
    color: colors.muted,
    lineHeight: 21
  },
  settingLabel: {
    color: colors.text,
    fontWeight: "900"
  },
  settingHint: {
    color: colors.muted,
    marginTop: spacing.xs,
    lineHeight: 19
  },
  section: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    marginTop: spacing.lg,
    marginBottom: spacing.sm
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  clubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.card,
    marginBottom: spacing.sm
  },
  clubName: {
    color: colors.text,
    fontWeight: "900"
  },
  clubDescription: {
    color: colors.muted,
    marginTop: spacing.xs,
    lineHeight: 20
  },
  demo: {
    color: colors.amber,
    fontWeight: "800",
    marginVertical: spacing.md
  }
});
