import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card, Row, styles as ui } from '../../components/ui';
import { BUSINESS } from '../../config';
import { usePalette } from '../../theme';

export default function InfoScreen() {
  const palette = usePalette();
  const links: { icon: ComponentProps<typeof Ionicons>['name']; label: string; url: string }[] = [
    { icon: 'globe-outline', label: BUSINESS.website.replace(/^https?:\/\//, ''), url: BUSINESS.website },
    ...(BUSINESS.email
      ? [{ icon: 'mail-outline' as const, label: BUSINESS.email, url: `mailto:${BUSINESS.email}` }]
      : []),
    ...(BUSINESS.phone
      ? [{ icon: 'call-outline' as const, label: BUSINESS.phone, url: `tel:${BUSINESS.phone.replace(/\s/g, '')}` }]
      : []),
    ...(BUSINESS.address
      ? [
          {
            icon: 'location-outline' as const,
            label: BUSINESS.address,
            url: `https://maps.google.com/?q=${encodeURIComponent(BUSINESS.address)}`,
          },
        ]
      : []),
  ];

  return (
    <ScrollView style={{ backgroundColor: palette.background }} contentContainerStyle={styles.content}>
      <View style={[styles.hero, { backgroundColor: palette.accent }]}>
        <Ionicons name="flame" size={28} color={palette.accentText} />
        <Text style={[styles.heroTitle, { color: palette.accentText }]}>{BUSINESS.name}</Text>
        <Text style={[styles.heroTagline, { color: palette.accentText }]}>{BUSINESS.tagline}</Text>
        <Text style={[styles.heroBody, { color: palette.accentText }]}>{BUSINESS.about}</Text>
      </View>

      <Card>
        <Text style={[ui.label, { color: palette.muted }]}>WHAT TO BRING</Text>
        {BUSINESS.whatToBring.map((item) => (
          <Row key={item} icon="checkmark-circle-outline">
            {item}
          </Row>
        ))}
      </Card>

      <Card>
        <Text style={[ui.label, { color: palette.muted }]}>GOOD TO KNOW</Text>
        {[BUSINESS.arrival, ...BUSINESS.goodToKnow, BUSINESS.cancellationPolicy].map((item) => (
          <Row key={item} icon="information-circle-outline">
            {item}
          </Row>
        ))}
      </Card>

      <Card style={styles.linksCard}>
        <Text style={[ui.label, styles.linksLabel, { color: palette.muted }]}>GET IN TOUCH</Text>
        {links.map((link) => (
          <Pressable
            key={link.url}
            onPress={() => Linking.openURL(link.url).catch(() => {})}
            accessibilityRole="link"
            style={({ pressed }) => [styles.link, { borderTopColor: palette.border, opacity: pressed ? 0.6 : 1 }]}
          >
            <Ionicons name={link.icon} size={20} color={palette.accent} />
            <Text style={[styles.linkText, { color: palette.text }]}>{link.label}</Text>
            <Ionicons name="open-outline" size={16} color={palette.muted} />
          </Pressable>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 48 },
  hero: { borderRadius: 20, padding: 20, gap: 6 },
  heroTitle: { fontSize: 26, fontWeight: '700', marginTop: 4 },
  heroTagline: { fontSize: 15, fontWeight: '600', opacity: 0.9 },
  heroBody: { fontSize: 15, lineHeight: 21, opacity: 0.9, marginTop: 6 },
  linksCard: { paddingBottom: 4, gap: 0 },
  linksLabel: { marginBottom: 6 },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  linkText: { fontSize: 16, flex: 1 },
});
