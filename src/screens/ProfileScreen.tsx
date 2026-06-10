import { LogOut, ShieldCheck } from "lucide-react-native";
import { Alert, StyleSheet, Switch, View } from "react-native";

import { AppButton } from "../components/AppButton";
import { Chip } from "../components/Chip";
import { Badge, Divider, EmptyState, Panel, SectionHeader } from "../components/PageElements";
import { Screen } from "../components/Screen";
import { Txt } from "../components/Txt";
import { useApp } from "../context/AppContext";
import { colors, radius, spacing } from "../theme";

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
          <Txt variant="h1" color={colors.accentText}>
            {user.fullName.charAt(0).toUpperCase()}
          </Txt>
        </View>
        <View style={styles.headerText}>
          <Txt variant="h1" numberOfLines={1}>
            {user.fullName}
          </Txt>
          <Txt variant="caption" color={colors.muted} numberOfLines={1}>
            {user.email}
          </Txt>
          <View style={styles.headerBadges}>
            <Badge label={user.schoolYear} tone="accent" />
            {isDemoMode ? <Badge label="Demo" tone="neutral" /> : null}
          </View>
        </View>
      </View>

      <Panel style={styles.panel}>
        <Txt variant="title">Privacy</Txt>
        <View style={styles.settingRow}>
          <View style={styles.settingText}>
            <Txt variant="bodyStrong">Visible RSVP by default</Txt>
            <Txt variant="caption" color={colors.muted}>
              {user.visibleRsvpsDefault ? "New RSVPs show your profile." : "New RSVPs stay private."}
            </Txt>
          </View>
          <Switch
            value={user.visibleRsvpsDefault}
            onValueChange={(visibleRsvpsDefault) => updateProfileSettings({ visibleRsvpsDefault })}
            thumbColor={colors.text}
            trackColor={{ false: colors.surfaceSoft, true: colors.accent }}
          />
        </View>
      </Panel>

      <View style={styles.sectionWrap}>
        <SectionHeader title="Interests" />
        {interestNames.length === 0 ? (
          <EmptyState title="No interests yet" copy="Add interests to improve your recommendations." />
        ) : (
          <View style={styles.wrap}>
            {interestNames.map((interest) => (
              <Chip key={interest} label={interest} selected />
            ))}
          </View>
        )}
      </View>

      <View style={styles.sectionWrap}>
        <SectionHeader title="Clubs you follow" />
        {user.clubTags.length === 0 ? (
          <EmptyState title="No clubs yet" copy="Follow clubs to make your feed more relevant." />
        ) : (
          <View style={styles.wrap}>
            {user.clubTags.map((club) => (
              <Chip key={club} label={club} selected />
            ))}
          </View>
        )}
      </View>

      <View style={styles.sectionWrap}>
        <SectionHeader title="Verified clubs on campus" />
        <Panel style={styles.clubsPanel}>
          {clubs.map((club, index) => (
            <View key={club.id}>
              {index > 0 ? <Divider style={styles.clubDivider} /> : null}
              <View style={styles.clubRow}>
                <View style={styles.clubText}>
                  <Txt variant="bodyStrong">{club.name}</Txt>
                  <Txt variant="caption" color={colors.muted} numberOfLines={2}>
                    {club.description}
                  </Txt>
                </View>
                {club.verified ? <ShieldCheck color={colors.accent} size={18} /> : null}
              </View>
            </View>
          ))}
        </Panel>
      </View>

      <View style={styles.logout}>
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
      </View>
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
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  headerText: {
    flex: 1,
    gap: spacing.xxs
  },
  headerBadges: {
    flexDirection: "row",
    gap: spacing.xs,
    marginTop: spacing.xxs
  },
  panel: {
    gap: spacing.sm
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  settingText: {
    flex: 1,
    gap: spacing.xxs
  },
  sectionWrap: {
    marginTop: spacing.lg
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs
  },
  clubsPanel: {
    gap: 0
  },
  clubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm
  },
  clubDivider: {
    marginVertical: spacing.xxs
  },
  clubText: {
    flex: 1,
    gap: 2
  },
  logout: {
    marginTop: spacing.xl
  }
});
