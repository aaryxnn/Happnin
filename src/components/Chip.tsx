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
    borderColor: colors.borderSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: "rgba(18, 9, 31, 0.86)"
  },
  selected: {
    backgroundColor: "rgba(168, 85, 247, 0.94)",
    borderColor: colors.purpleGlow,
    shadowColor: colors.pink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 3
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.88
  },
  text: {
    color: colors.muted,
    fontWeight: "900",
    fontSize: 13
  },
  selectedText: {
    color: colors.text
  }
});
