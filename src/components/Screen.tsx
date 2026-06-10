import { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

import { colors, spacing } from "../theme";

type Props = PropsWithChildren<{
  scroll?: boolean;
  style?: ViewStyle;
  edges?: Edge[];
}>;

export function Screen({ children, scroll = true, style, edges = ["top"] }: Props) {
  if (!scroll) {
    return (
      <SafeAreaView style={styles.safe} edges={edges}>
        <View style={[styles.flex, style]}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <ScrollView
        contentContainerStyle={[styles.content, style]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background
  },
  flex: {
    flex: 1
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 128
  }
});
