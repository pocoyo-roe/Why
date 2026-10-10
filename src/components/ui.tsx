import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { bookingService } from '../booking';
import { usePalette } from '../theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

export function Button({
  label,
  icon,
  onPress,
  disabled,
  loading,
  variant = 'primary',
}: {
  label: string;
  icon?: IconName;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}) {
  const palette = usePalette();
  const colors = {
    primary: { bg: palette.accent, fg: palette.accentText, border: palette.accent },
    secondary: { bg: palette.card, fg: palette.text, border: palette.border },
    danger: { bg: palette.card, fg: palette.danger, border: palette.border },
  }[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          opacity: disabled ? 0.45 : pressed ? 0.8 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.fg} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={18} color={colors.fg} />}
          <Text style={[styles.buttonText, { color: colors.fg }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

/** Reminds everyone (including you) that bookings aren't real until a booking system is connected. */
export function DemoBanner() {
  const palette = usePalette();
  if (!bookingService.isDemo) return null;
  return (
    <View style={[styles.banner, { backgroundColor: palette.warningSoft }]}>
      <Ionicons name="construct" size={16} color={palette.warning} />
      <Text style={[styles.bannerText, { color: palette.warning }]}>
        Demo timetable. Bookings made here aren&apos;t real yet.
      </Text>
    </View>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: IconName;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  const palette = usePalette();
  return (
    <View style={styles.empty}>
      <View style={[styles.emptyIcon, { backgroundColor: palette.accentSoft }]}>
        <Ionicons name={icon} size={30} color={palette.accent} />
      </View>
      <Text style={[styles.emptyTitle, { color: palette.text }]}>{title}</Text>
      <Text style={[styles.emptyBody, { color: palette.muted }]}>{body}</Text>
      {action}
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: object }) {
  const palette = usePalette();
  return (
    <View style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }, style]}>{children}</View>
  );
}

export function Row({ icon, children }: { icon: IconName; children: ReactNode }) {
  const palette = usePalette();
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={palette.muted} style={styles.rowIcon} />
      <Text style={[styles.rowText, { color: palette.text }]}>{children}</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 50,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  buttonText: { fontSize: 16, fontWeight: '600' },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
  },
  bannerText: { fontSize: 13, fontWeight: '600', flex: 1 },
  card: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 10 },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  rowIcon: { marginTop: 2 },
  rowText: { fontSize: 15, lineHeight: 22, flex: 1 },
  empty: { alignItems: 'center', paddingHorizontal: 32, paddingTop: 56, gap: 10 },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  emptyBody: { fontSize: 15, lineHeight: 21, textAlign: 'center', marginBottom: 8 },
  label: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
});
