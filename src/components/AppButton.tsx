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
        <ActivityIndicator color={variant === "primary" ? colors.background : colors.text} />
      ) : (
        <View style={styles.inner}>
          {Icon ? <Icon color={variant === "primary" ? colors.text : colors.text} size={18} strokeWidth={2.5} /> : null}
          <Text style={[styles.text, variant === "primary" && styles.primaryText]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    ...shadows.soft
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  primary: {
    backgroundColor: colors.accent,
    borderColor: colors.purpleGlow,
    shadowColor: colors.pink,
    shadowOpacity: 0.22
  },
  secondary: {
    backgroundColor: colors.cardElevated,
    borderColor: colors.borderSoft
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: colors.borderSoft,
    shadowOpacity: 0
  },
  danger: {
    backgroundColor: "rgba(255, 107, 138, 0.1)",
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
    fontSize: 15
  },
  primaryText: {
    color: colors.text
  }
});
