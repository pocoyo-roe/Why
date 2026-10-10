import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { bookingService, type Session } from '../../booking';
import { Button, DemoBanner, EmptyState } from '../../components/ui';
import { formatDate, formatPrice, formatTimeRange, isSameDay } from '../../format';
import { usePalette } from '../../theme';

const DAYS_AHEAD = 14;

function nextDays(): Date[] {
  const today = new Date();
  return Array.from(
    { length: DAYS_AHEAD },
    (_, i) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + i),
  );
}

export default function SessionsScreen() {
  const palette = usePalette();
  const days = useMemo(() => nextDays(), []);
  const [selected, setSelected] = useState(days[0]);
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    let active = true;
    setError(false);
    bookingService
      .listSessions(selected)
      .then((result) => active && setSessions(result))
      .catch(() => active && setError(true));
    return () => {
      active = false;
    };
  }, [selected]);

  // Reload whenever the screen is shown, so spaces left stay current after booking.
  useFocusEffect(load);

  const selectDay = (day: Date) => {
    // Re-selecting the current day wouldn't trigger a reload, so don't clear the list.
    if (isSameDay(day, selected)) return;
    setSessions(null);
    setSelected(day);
  };

  return (
    <FlatList
      style={{ backgroundColor: palette.background }}
      contentContainerStyle={styles.content}
      data={sessions ?? []}
      keyExtractor={(s) => s.id}
      ListHeaderComponent={
        <View style={styles.header}>
          <DemoBanner />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.days}>
            {days.map((day) => {
              const active = isSameDay(day, selected);
              return (
                <Pressable
                  key={day.toISOString()}
                  onPress={() => selectDay(day)}
                  accessibilityRole="button"
                  accessibilityLabel={formatDate(day)}
                  accessibilityState={{ selected: active }}
                  style={[
                    styles.day,
                    active
                      ? { backgroundColor: palette.accent, borderColor: palette.accent }
                      : { backgroundColor: palette.card, borderColor: palette.border },
                  ]}
                >
                  <Text style={[styles.dayName, { color: active ? palette.accentText : palette.muted }]}>
                    {isSameDay(day, days[0]) ? 'Today' : day.toLocaleDateString('en-GB', { weekday: 'short' })}
                  </Text>
                  <Text style={[styles.dayNumber, { color: active ? palette.accentText : palette.text }]}>
                    {day.getDate()}
                  </Text>
                  <Text style={[styles.dayName, { color: active ? palette.accentText : palette.muted }]}>
                    {day.toLocaleDateString('en-GB', { month: 'short' })}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <Text style={[styles.dateTitle, { color: palette.text }]}>{formatDate(selected)}</Text>
        </View>
      }
      ListEmptyComponent={
        error ? (
          <EmptyState
            icon="cloud-offline"
            title="Couldn't load the timetable"
            body="Check your internet connection and try again."
            action={<Button label="Try again" icon="refresh" onPress={load} />}
          />
        ) : sessions === null ? (
          <ActivityIndicator style={styles.loading} color={palette.accent} />
        ) : (
          <EmptyState icon="moon" title="No more sessions this day" body="Pick another day to see what's available." />
        )
      }
      renderItem={({ item }) => <SessionCard session={item} />}
    />
  );
}

function SessionCard({ session }: { session: Session }) {
  const palette = usePalette();
  const soldOut = session.spacesLeft === 0;
  const fewLeft = session.kind === 'shared' && !soldOut && session.spacesLeft <= 3;
  const availability = soldOut
    ? session.kind === 'private'
      ? 'Booked'
      : 'Sold out'
    : session.kind === 'private'
      ? 'Available'
      : `${session.spacesLeft} space${session.spacesLeft === 1 ? '' : 's'} left`;

  return (
    <Pressable
      onPress={() => router.push(`/book/${session.id}`)}
      disabled={soldOut}
      accessibilityRole="button"
      accessibilityLabel={`${session.title}, ${formatTimeRange(session)}, ${availability}`}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: palette.card, borderColor: palette.border, opacity: soldOut ? 0.55 : pressed ? 0.75 : 1 },
      ]}
    >
      <View style={styles.cardMain}>
        <Text style={[styles.time, { color: palette.text }]}>{formatTimeRange(session)}</Text>
        <View style={styles.titleRow}>
          <Ionicons
            name={session.kind === 'private' ? 'key' : 'people'}
            size={15}
            color={session.kind === 'private' ? palette.accent : palette.muted}
          />
          <Text style={[styles.title, { color: palette.text }]}>{session.title}</Text>
        </View>
        <Text
          style={[styles.availability, { color: soldOut ? palette.muted : fewLeft ? palette.accent : palette.success }]}
        >
          {availability}
        </Text>
      </View>
      <View style={styles.cardSide}>
        <Text style={[styles.price, { color: palette.text }]}>{formatPrice(session.pricePence)}</Text>
        <Text style={[styles.per, { color: palette.muted }]}>
          {session.kind === 'private' ? 'per group' : 'per person'}
        </Text>
        {!soldOut && <Ionicons name="chevron-forward" size={18} color={palette.muted} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  header: { gap: 14 },
  days: { gap: 8 },
  day: {
    width: 60,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    gap: 2,
  },
  dayName: { fontSize: 12, fontWeight: '600' },
  dayNumber: { fontSize: 20, fontWeight: '700' },
  dateTitle: { fontSize: 20, fontWeight: '700', marginTop: 4 },
  loading: { marginTop: 48 },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 12,
  },
  cardMain: { flex: 1, gap: 4 },
  cardSide: { alignItems: 'flex-end', justifyContent: 'center', gap: 2 },
  time: { fontSize: 18, fontWeight: '700' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontSize: 15, fontWeight: '500' },
  availability: { fontSize: 14, fontWeight: '600' },
  price: { fontSize: 18, fontWeight: '700' },
  per: { fontSize: 12 },
});
