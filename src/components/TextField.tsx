import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

import { colors, radius, spacing } from "../theme";

type Props = TextInputProps & {
  label: string;
};

export function TextField({ label, style, ...props }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.faint}
        style={[styles.input, style]}
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
    fontWeight: "800"
  },
  input: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: "rgba(18, 9, 31, 0.9)",
    color: colors.text,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    fontWeight: "700"
  }
});
