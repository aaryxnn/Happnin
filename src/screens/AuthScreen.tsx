import { LinearGradient } from "expo-linear-gradient";
import { Mail } from "lucide-react-native";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from "react-native";

import { AppButton } from "../components/AppButton";
import { Badge } from "../components/PageElements";
import { TextField } from "../components/TextField";
import { Txt } from "../components/Txt";
import { useApp } from "../context/AppContext";
import { formatAllowedDomains } from "../lib/domain";
import { colors, gradients, radius, spacing } from "../theme";

export function AuthScreen() {
  const { signIn, signUp, campus, isDemoMode } = useApp();
  const [email, setEmail] = useState("student@example.edu");
  const [password, setPassword] = useState("happnin123");
  const [mode, setMode] = useState<"signIn" | "signUp">("signUp");
  const [loading, setLoading] = useState(false);

  async function submit() {
    try {
      setLoading(true);
      if (mode === "signUp") await signUp(email, password);
      else await signIn(email, password);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Try again.";
      if (message === "CONFIRM_EMAIL") {
        setMode("signIn");
        Alert.alert("Check your UMass email", "Confirm your Happnin account in the email from Supabase, then come back and log in.");
      } else if (message.toLowerCase().includes("invalid login credentials")) {
        Alert.alert("Could not log in", "Double-check your email/password. If you just signed up, confirm the Supabase email first.");
      } else {
        Alert.alert("Could not continue", message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={gradients.hero} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboard} keyboardVerticalOffset={12}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.inner}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.hero}>
              <View style={styles.brandRow}>
                <View style={styles.logoMark}>
                  <Txt variant="h3" color={colors.onAccent}>
                    H
                  </Txt>
                </View>
                <Txt variant="h3">Happnin</Txt>
              </View>

              <Txt variant="display" style={styles.headline}>
                Everything happening on campus, in one place.
              </Txt>
              <Txt variant="body" color={colors.muted}>
                Discover student events, RSVP in a tap, and follow the clubs you care about at {campus.name}.
              </Txt>
              <Badge label={isDemoMode ? "Demo mode" : "Connected"} tone={isDemoMode ? "accent" : "success"} />
            </View>

            <View style={styles.form}>
              <View style={styles.modeTabs}>
                <ModeTab label="Sign up" active={mode === "signUp"} onPress={() => setMode("signUp")} />
                <ModeTab label="Log in" active={mode === "signIn"} onPress={() => setMode("signIn")} />
              </View>

              <TextField
                label="School email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoComplete="email"
                hint={`Allowed domains: ${formatAllowedDomains()}`}
              />
              <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry autoComplete="password" />
              <AppButton
                title={mode === "signUp" ? "Create account" : "Log in"}
                onPress={submit}
                loading={loading}
                icon={Mail}
              />
              <Txt variant="caption" color={colors.faint} center>
                Use student@example.edu for the local demo.
              </Txt>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

function ModeTab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.modeTab, active && styles.modeTabActive]}>
        <Txt variant="label" color={active ? colors.text : colors.faint}>
          {label}
        </Txt>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  keyboard: {
    flex: 1
  },
  inner: {
    flexGrow: 1,
    justifyContent: "space-between",
    padding: spacing.lg,
    paddingTop: 72,
    paddingBottom: 40,
    gap: spacing.xl
  },
  hero: {
    gap: spacing.md
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center"
  },
  headline: {
    fontSize: 38,
    lineHeight: 44
  },
  form: {
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md
  },
  modeTabs: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xxs
  },
  modeTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderRadius: radius.sm
  },
  modeTabActive: {
    backgroundColor: colors.surfaceStrong
  }
});
