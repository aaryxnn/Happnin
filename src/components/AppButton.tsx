import { ComponentType } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { LucideProps } from "lucide-react-native";

import { colors, radius, shadows, spacing } from "../theme";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  loading?: boolean;
  icon?: ComponentType<LucideProps>;
};

export function AppButton({ title, onPress, variant = "primary", disabled, loading, icon: Icon }: Props) {
  const foreground =
    variant === "secondary" ? colors.ink : variant === "danger" ? colors.danger : colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled
      ]}
    >
      {loading ? (
        <ActivityIndicator color={foreground} />
      ) : (
        <View style={styles.inner}>
          {Icon ? <Icon color={foreground} size={18} strokeWidth={2.5} /> : null}
          <Text style={[styles.text, variant === "secondary" && styles.secondaryText, variant === "danger" && styles.dangerText]}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    borderWidth: 1
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  primary: {
    backgroundColor: colors.background,
    borderColor: "rgba(251, 247, 255, 0.42)",
    ...shadows.paperTight
  },
  secondary: {
    backgroundColor: colors.paperSoft,
    borderColor: colors.paperBorder,
    ...shadows.paperTight
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "rgba(251, 247, 255, 0.34)",
    shadowOpacity: 0
  },
  danger: {
    backgroundColor: "rgba(255, 107, 138, 0.12)",
    borderColor: colors.danger,
    shadowOpacity: 0
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9
  },
  disabled: {
    opacity: 0.68
  },
  text: {
    color: colors.text,
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: -0.2
  },
  secondaryText: {
    color: colors.ink
  },
  dangerText: {
    color: colors.danger
  }
});
