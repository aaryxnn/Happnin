import { ComponentType } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LucideProps } from "lucide-react-native";

import { colors, gradients, radius, shadows, spacing } from "../theme";
import { Txt } from "./Txt";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: ComponentType<LucideProps>;
};

const fgColor: Record<Variant, string> = {
  primary: colors.onAccent,
  secondary: colors.text,
  ghost: colors.text,
  danger: colors.danger
};

export function AppButton({ title, onPress, variant = "primary", disabled, loading, icon: Icon }: Props) {
  const isDisabled = disabled || loading;
  const fg = fgColor[variant];

  const content = (
    <View style={styles.inner}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {Icon ? <Icon color={fg} size={18} strokeWidth={2.4} /> : null}
          <Txt variant="title" color={fg}>
            {title}
          </Txt>
        </>
      )}
    </View>
  );

  if (variant === "primary") {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        style={({ pressed }) => [styles.shadow, pressed && styles.pressed, isDisabled && styles.disabled]}
      >
        <LinearGradient colors={gradients.accent} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.button}>
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && styles.pressed,
        isDisabled && styles.disabled
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg
  },
  shadow: {
    borderRadius: radius.md,
    ...shadows.accent
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs
  },
  secondary: {
    backgroundColor: colors.surfaceStrong,
    borderWidth: 1,
    borderColor: colors.borderStrong
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border
  },
  danger: {
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.danger
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }]
  },
  disabled: {
    opacity: 0.45
  }
});
