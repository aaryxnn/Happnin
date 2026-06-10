import { Pressable, StyleSheet } from "react-native";

import { colors, radius, spacing } from "../theme";
import { Txt } from "./Txt";

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Chip({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? "button" : "text"}
      accessibilityState={{ selected }}
      style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && styles.pressed]}
    >
      <Txt variant="caption" color={selected ? colors.accentText : colors.muted}>
        {label}
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface
  },
  selected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent
  },
  pressed: {
    opacity: 0.8
  }
});
