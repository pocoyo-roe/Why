import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';

import type { Booking } from '../../booking';
import { Button, EmptyState, styles as ui } from '../../components/ui';
import { formatDate, formatTimeRange } from '../../format';
import { useBookings } from '../../store/BookingsStore';
import { usePalette } from '../../theme';

export default function BookingsScreen() {
  const palette = usePalette();
  const { bookings, loaded } = useBookings();
  const [now, setNow] = useState(() => Date.now());
  // Re-check the time whenever the tab is shown, so finished sessions move to "Past".
  useFocusEffect(useCallback(() => setNow(Date.now()), []));

  if (loaded && bookings.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.background }}>
        <EmptyState
          icon="ticket-outline"
          title="No bookings yet"
          body="When you book a session it will appear here."
          action={<Button label="Book a session" icon="calendar" onPress={() => router.navigate('/')} />}
        />
      </View>
    );
  }

  const byStart = (a: Booking, b: Booking) => +new Date(a.session.start) - +new Date(b.session.start);
  const upcoming = bookings.filter((b) => +new Date(b.session.start) > now && b.status === 'confirmed').sort(byStart);
  const past = bookings
    .filter((b) => !upcoming.includes(b))
    .sort(byStart)
    .reverse();

  const sections = [
    { title: 'UPCOMING', data: upcoming },
    { title: 'PAST & CANCELLED', data: past },
  ].filter((s) => s.data.length > 0);

  return (
    <SectionList
      style={{ backgroundColor: palette.background }}
      contentContainerStyle={styles.content}
      sections={sections}
      keyExtractor={(b) => b.id}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section }) => (
        <Text style={[ui.label, styles.sectionTitle, { color: palette.muted }]}>{section.title}</Text>
      )}
      ItemSeparatorComponent={() => <View style={styles.gap} />}
      renderItem={({ item }) => <BookingCard booking={item} faded={!upcoming.includes(item)} />}
    />
  );
}

function BookingCard({ booking, faded }: { booking: Booking; faded: boolean }) {
  const palette = usePalette();
  const start = new Date(booking.session.start);
  const cancelled = booking.status === 'cancelled';
  return (
    <Pressable
      onPress={() => router.push(`/booking/${booking.id}`)}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: palette.card, borderColor: palette.border, opacity: faded ? 0.6 : pressed ? 0.75 : 1 },
      ]}
    >
      <View style={[styles.date, { backgroundColor: palette.accentSoft }]}>
        <Text style={[styles.dateDay, { color: palette.accent }]}>{start.getDate()}</Text>
        <Text style={[styles.dateMonth, { color: palette.accent }]}>
          {start.toLocaleDateString('en-GB', { month: 'short' })}
        </Text>
      </View>
      <View style={styles.main}>
        <Text style={[styles.title, { color: palette.text }]}>{booking.session.title}</Text>
        <Text style={[styles.meta, { color: palette.muted }]}>
          {formatDate(booking.session.start, 'short')} · {formatTimeRange(booking.session)}
        </Text>
        <Text style={[styles.meta, { color: cancelled ? palette.danger : palette.muted }]}>
          {cancelled ? 'Cancelled' : `${booking.guests} ${booking.guests === 1 ? 'person' : 'people'}`}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={palette.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  sectionTitle: { marginTop: 8, marginBottom: 10 },
  gap: { height: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  date: { width: 54, height: 58, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dateDay: { fontSize: 22, fontWeight: '700' },
  dateMonth: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  main: { flex: 1, gap: 2 },
  title: { fontSize: 16, fontWeight: '600' },
  meta: { fontSize: 14 },
});
