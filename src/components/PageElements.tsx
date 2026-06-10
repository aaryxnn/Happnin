import { PropsWithChildren, ReactNode } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { colors, radius, shadows, spacing } from "../theme";
import { Txt } from "./Txt";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  copy?: string;
  right?: ReactNode;
};

export function PageHeader({ eyebrow, title, copy, right }: PageHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          {eyebrow ? (
            <Txt variant="overline" color={colors.accentText} style={styles.eyebrow}>
              {eyebrow.toUpperCase()}
            </Txt>
          ) : null}
          <Txt variant="display">{title}</Txt>
        </View>
        {right ? <View>{right}</View> : null}
      </View>
      {copy ? (
        <Txt variant="body" color={colors.muted} style={styles.copy}>
          {copy}
        </Txt>
      ) : null}
    </View>
  );
}

export function Panel({
  children,
  style,
  elevated
}: PropsWithChildren<{ style?: ViewStyle; elevated?: boolean }>) {
  return <View style={[styles.panel, elevated && shadows.soft, style]}>{children}</View>;
}

export function SectionHeader({
  title,
  action,
  onAction
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.section}>
      <Txt variant="h2">{title}</Txt>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button">
          <Txt variant="label" color={colors.accentText}>
            {action}
          </Txt>
        </Pressable>
      ) : null}
    </View>
  );
}

type Tone = "neutral" | "accent" | "success" | "hot" | "danger";

const toneMap: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: colors.surfaceStrong, fg: colors.muted },
  accent: { bg: colors.accentSoft, fg: colors.accentText },
  success: { bg: colors.successSoft, fg: colors.success },
  hot: { bg: colors.hotSoft, fg: colors.hot },
  danger: { bg: colors.dangerSoft, fg: colors.danger }
};

export function Badge({ label, tone = "neutral", icon }: { label: string; tone?: Tone; icon?: ReactNode }) {
  const palette = toneMap[tone];
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      {icon}
      <Txt variant="overline" color={palette.fg}>
        {label.toUpperCase()}
      </Txt>
    </View>
  );
}

export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[styles.divider, style]} />;
}

export function EmptyState({ title, copy, icon }: { title: string; copy?: string; icon?: ReactNode }) {
  return (
    <View style={styles.empty}>
      {icon ? <View style={styles.emptyIcon}>{icon}</View> : null}
      <Txt variant="h3" center>
        {title}
      </Txt>
      {copy ? (
        <Txt variant="body" color={colors.muted} center>
          {copy}
        </Txt>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.sm,
    marginBottom: spacing.lg
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md
  },
  headerText: {
    flex: 1,
    gap: spacing.xs
  },
  eyebrow: {
    marginBottom: spacing.xxs
  },
  copy: {
    maxWidth: "95%"
  },
  panel: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    marginTop: spacing.xs
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.pill
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSoft
  },
  empty: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
    alignItems: "center"
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs
  }
});
