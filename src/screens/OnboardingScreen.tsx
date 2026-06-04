import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { AppButton } from "../components/AppButton";
import { Chip } from "../components/Chip";
import { Screen } from "../components/Screen";
import { TextField } from "../components/TextField";
import { useApp } from "../context/AppContext";
import { colors, radius, shadows, spacing } from "../theme";

const years = ["Freshman", "Sophomore", "Junior", "Senior", "Grad"];

export function OnboardingScreen() {
  const { completeOnboarding, clubs, campus, interestCategories } = useApp();
  const [fullName, setFullName] = useState("");
  const [schoolYear, setSchoolYear] = useState("Sophomore");
  const [interests, setInterests] = useState<string[]>(["social-nightlife", "music-performance"]);
  const [clubTags, setClubTags] = useState<string[]>([]);
  const [clubSearch, setClubSearch] = useState("");

  const filteredClubs = clubs
    .filter((club) => {
      const term = clubSearch.trim().toLowerCase();
      const matchesSearch =
        !term || [club.name, club.description, club.instagram ?? ""].join(" ").toLowerCase().includes(term);
      const matchesInterest =
        interests.length === 0 || club.interestSlugs.some((interestSlug) => interests.includes(interestSlug));
      return matchesSearch && matchesInterest;
    })
    .slice(0, clubSearch.trim() ? 30 : 12);

  function toggleInterest(category: string) {
    setInterests((current) =>
      current.includes(category) ? current.filter((item) => item !== category) : [...current, category]
    );
  }

  function toggleClub(name: string) {
    setClubTags((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));
  }

  async function finish() {
    if (!fullName.trim()) {
      Alert.alert("Add your name", "Your profile needs a name before you can enter the feed.");
      return;
    }

    await completeOnboarding({ fullName: fullName.trim(), schoolYear, interests, clubTags });
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{campus.name}</Text>
        <Text style={styles.title}>Set your campus signal.</Text>
        <Text style={styles.copy}>Pick broad interests first, then follow a few clubs that match your campus life.</Text>
      </View>

      <TextField label="Full name" value={fullName} onChangeText={setFullName} autoCapitalize="words" />

      <Text style={styles.section}>School year</Text>
      <View style={styles.wrap}>
        {years.map((year) => (
          <Chip key={year} label={year} selected={schoolYear === year} onPress={() => setSchoolYear(year)} />
        ))}
      </View>

      <Text style={styles.section}>Interests</Text>
      <View style={styles.wrap}>
        {interestCategories.map((category) => (
          <Chip
            key={category.slug}
            label={category.name}
            selected={interests.includes(category.slug)}
            onPress={() => toggleInterest(category.slug)}
          />
        ))}
      </View>

      <View style={styles.clubHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.section}>Suggested clubs</Text>
          <Text style={styles.hint}>Optional. Pick any you are part of or want to follow.</Text>
        </View>
        <Text style={styles.count}>{filteredClubs.length}</Text>
      </View>
      <TextField
        label="Search clubs"
        value={clubSearch}
        onChangeText={setClubSearch}
        placeholder="Ski, radio, cultural, business..."
      />
      <View style={styles.wrap}>
        {filteredClubs.map((club) => (
          <Chip key={club.id} label={club.name} selected={clubTags.includes(club.name)} onPress={() => toggleClub(club.name)} />
        ))}
      </View>
      {filteredClubs.length === 0 ? <Text style={styles.empty}>No clubs match yet. Try another search or clear an interest.</Text> : null}

      <View style={styles.cta}>
        <AppButton title="Enter Happnin" onPress={finish} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.md,
    ...shadows.soft
  },
  eyebrow: {
    color: colors.accent,
    fontWeight: "900"
  },
  title: {
    color: colors.text,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900"
  },
  copy: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23
  },
  section: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
    marginTop: spacing.lg,
    marginBottom: spacing.sm
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.sm
  },
  clubHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm
  },
  hint: {
    color: colors.muted,
    lineHeight: 20
  },
  count: {
    color: colors.accent,
    fontWeight: "900"
  },
  empty: {
    color: colors.muted,
    marginTop: spacing.sm,
    lineHeight: 20
  },
  cta: {
    marginTop: spacing.xl
  }
});
