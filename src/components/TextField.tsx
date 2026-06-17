import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

import { colors, radius, spacing } from "../theme";

type Props = TextInputProps & {
  label: string;
  tone?: "dark" | "light";
};

export function TextField({ label, style, tone = "dark", ...props }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, tone === "light" && styles.labelLight]}>{label}</Text>
      <TextInput
        placeholderTextColor={tone === "light" ? colors.inkFaint : colors.faint}
        style={[styles.input, tone === "light" && styles.inputLight, style]}
        autoCapitalize="none"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: -0.12
  },
  labelLight: {
    color: colors.inkMuted
  },
  input: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.paperBorder,
    backgroundColor: colors.paper,
    color: colors.ink,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    fontWeight: "800"
  },
  inputLight: {
    backgroundColor: colors.paperSoft
  }
});
