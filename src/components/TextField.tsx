import { useState } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

import { colors, fonts, radius, spacing } from "../theme";
import { Txt } from "./Txt";

type Props = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
};

export function TextField({ label, error, hint, style, onFocus, onBlur, ...props }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      <Txt variant="label" color={colors.muted}>
        {label}
      </Txt>
      <TextInput
        placeholderTextColor={colors.faint}
        style={[
          styles.input,
          focused && styles.inputFocused,
          error && styles.inputError,
          style
        ]}
        autoCapitalize="none"
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
      {error ? (
        <Txt variant="caption" color={colors.danger}>
          {error}
        </Txt>
      ) : null}
      {!error && hint ? (
        <Txt variant="caption" color={colors.faint}>
          {hint}
        </Txt>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs
  },
  input: {
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    fontFamily: fonts.medium
  },
  inputFocused: {
    borderColor: colors.accent,
    backgroundColor: colors.surfaceStrong
  },
  inputError: {
    borderColor: colors.danger
  }
});
