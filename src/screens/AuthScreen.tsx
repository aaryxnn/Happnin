import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { Mail } from "lucide-react-native";

import { AppButton } from "../components/AppButton";
import { TextField } from "../components/TextField";
import { useApp } from "../context/AppContext";
import { formatAllowedDomains } from "../lib/domain";
import { colors, radius, shadows, spacing } from "../theme";

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
    <LinearGradient colors={["#05030a", "#160727", "#3b0764", "#08040f"]} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboard} keyboardVerticalOffset={12}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.inner}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.hero}>
              <View style={styles.logoPill}>
                <Text style={styles.logo}>Happnin</Text>
              </View>
              <Text style={styles.headline}>Find the night before it finds your group chat.</Text>
              <Text style={styles.copy}>
                Events, clubs, parties, campus pop-ups, and nightlife for {campus.name}. Student email required.
              </Text>
              <Text style={styles.demo}>
                {isDemoMode ? "Demo mode" : "Supabase connected"}: use student@example.edu for the local demo.
              </Text>
            </View>

            <View style={styles.form}>
              <TextField label={`School email (${formatAllowedDomains()})`} value={email} onChangeText={setEmail} />
              <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
              <AppButton
                title={mode === "signUp" ? "Create account" : "Log in"}
                onPress={submit}
                loading={loading}
                icon={Mail}
              />
              <AppButton
                title={mode === "signUp" ? "I already have an account" : "Create a new account"}
                onPress={() => setMode(mode === "signUp" ? "signIn" : "signUp")}
                variant="ghost"
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
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
    paddingTop: 64,
    paddingBottom: 32,
    gap: spacing.xl
  },
  hero: {
    gap: spacing.md
  },
  logo: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
  },
  logoPill: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    backgroundColor: "rgba(168, 85, 247, 0.28)",
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadows.soft
  },
  headline: {
    color: colors.text,
    fontSize: 42,
    lineHeight: 46,
    fontWeight: "900"
  },
  copy: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23
  },
  demo: {
    color: colors.amber,
    fontWeight: "800"
  },
  form: {
    gap: spacing.md,
    backgroundColor: "rgba(8, 4, 15, 0.78)",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.md,
    ...shadows.glow
  }
});
