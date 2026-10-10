import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Category, Why } from '../data/whys';
import { CATEGORY_COLORS, CATEGORY_ICONS, usePalette } from '../theme';

export function tapFeedback() {
  if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
}

export function CategoryTag({ category }: { category: Category }) {
  const color = CATEGORY_COLORS[category];
  return (
    <View style={[styles.tag, { backgroundColor: color + '22' }]}>
      <Ionicons name={CATEGORY_ICONS[category]} size={12} color={color} />
      <Text style={[styles.tagText, { color }]}>{category}</Text>
    </View>
  );
}

export function UnsettledTag() {
  const palette = usePalette();
  return (
    <View style={[styles.tag, { backgroundColor: palette.warningSoft }]}>
      <Ionicons name="help-circle" size={12} color={palette.warning} />
      <Text style={[styles.tagText, { color: palette.warning }]}>Still a mystery</Text>
    </View>
  );
}

export function WhyCard({ why }: { why: Why }) {
  const palette = usePalette();
  return (
    <Pressable
      onPress={() => router.push(`/why/${why.id}`)}
      accessibilityRole="link"
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: palette.card, borderColor: palette.border, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={styles.tagRow}>
        <CategoryTag category={why.category} />
        {why.unsettled && <UnsettledTag />}
      </View>
      <Text style={[styles.cardTitle, { color: palette.text }]}>{why.question}</Text>
      <Text style={[styles.cardBody, { color: palette.muted }]} numberOfLines={2}>
        {why.short}
      </Text>
    </Pressable>
  );
}

export function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const palette = usePalette();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[
        styles.chip,
        active
          ? { backgroundColor: palette.accent, borderColor: palette.accent }
          : { backgroundColor: palette.card, borderColor: palette.border },
      ]}
    >
      <Text style={[styles.chipText, { color: active ? palette.accentText : palette.text }]}>{label}</Text>
    </Pressable>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  body: string;
  action?: ReactNode;
}) {
  const palette = usePalette();
  return (
    <View style={styles.empty}>
      <View style={[styles.emptyIcon, { backgroundColor: palette.accentSoft }]}>
        <Ionicons name={icon} size={32} color={palette.accent} />
      </View>
      <Text style={[styles.emptyTitle, { color: palette.text }]}>{title}</Text>
      <Text style={[styles.emptyBody, { color: palette.muted }]}>{body}</Text>
      {action}
    </View>
  );
}

export function PrimaryButton({
  label,
  icon,
  onPress,
  disabled,
}: {
  label: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  disabled?: boolean;
}) {
  const palette = usePalette();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: palette.accent, opacity: disabled ? 0.4 : pressed ? 0.8 : 1 },
      ]}
    >
      {icon && <Ionicons name={icon} size={18} color={palette.accentText} />}
      <Text style={[styles.buttonText, { color: palette.accentText }]}>{label}</Text>
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 8,
  },
  cardTitle: { fontSize: 17, fontWeight: '600', lineHeight: 23 },
  cardBody: { fontSize: 14, lineHeight: 20 },
  tagRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  tagText: { fontSize: 12, fontWeight: '600' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipText: { fontSize: 14, fontWeight: '500' },
  empty: { alignItems: 'center', paddingHorizontal: 32, paddingTop: 64, gap: 10 },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  emptyBody: { fontSize: 15, lineHeight: 21, textAlign: 'center', marginBottom: 8 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
  },
  buttonText: { fontSize: 16, fontWeight: '600' },
});
