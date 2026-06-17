import { Pressable, StyleSheet, Text } from "react-native";

import { colors, radius, spacing } from "../theme";

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && styles.pressed]}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.paperBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.paperTint
  },
  selected: {
    backgroundColor: colors.background,
    borderColor: "rgba(251, 247, 255, 0.44)"
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.88
  },
  text: {
    color: colors.inkMuted,
    fontWeight: "900",
    fontSize: 13,
    letterSpacing: -0.15
  },
  selectedText: {
    color: colors.text
  }
});
