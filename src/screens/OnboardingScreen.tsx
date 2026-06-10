import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { AppButton } from "../components/AppButton";
import { Chip } from "../components/Chip";
import { EmptyState, PageHeader } from "../components/PageElements";
import { Screen } from "../components/Screen";
import { TextField } from "../components/TextField";
import { Txt } from "../components/Txt";
import { useApp } from "../context/AppContext";
import { colors, spacing } from "../theme";

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
      <PageHeader
        eyebrow={campus.name}
        title="Build your profile"
        copy="Tell us a bit about you so your feed starts in the right place."
      />

      <TextField label="Full name" value={fullName} onChangeText={setFullName} autoCapitalize="words" placeholder="Your name" />

      <Section title="School year" />
      <View style={styles.wrap}>
        {years.map((year) => (
          <Chip key={year} label={year} selected={schoolYear === year} onPress={() => setSchoolYear(year)} />
        ))}
      </View>

      <Section title="Interests" caption="Pick a few — you can change these later." />
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

      <Section title="Suggested clubs" caption={`${filteredClubs.length} match your interests · optional`} />
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
      {filteredClubs.length === 0 ? <EmptyState title="No clubs match yet" copy="Try another search or clear an interest." /> : null}

      <View style={styles.cta}>
        <AppButton title="Enter Happnin" onPress={finish} />
      </View>
    </Screen>
  );
}

function Section({ title, caption }: { title: string; caption?: string }) {
  return (
    <View style={styles.section}>
      <Txt variant="h3">{title}</Txt>
      {caption ? (
        <Txt variant="caption" color={colors.faint} style={styles.caption}>
          {caption}
        </Txt>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm
  },
  caption: {
    marginTop: spacing.xxs
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs
  },
  cta: {
    marginTop: spacing.xl
  }
});
