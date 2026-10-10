import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, EmptyState, Row, styles as ui } from '../../components/ui';
import { BUSINESS } from '../../config';
import { formatDate, formatPrice, formatTimeRange } from '../../format';
import { useBookings } from '../../store/BookingsStore';
import { usePalette } from '../../theme';

function confirmCancel(onConfirm: () => void) {
  const message = BUSINESS.cancellationPolicy;
  if (Platform.OS === 'web') {
    if (window.confirm(`Cancel this booking?\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert('Cancel this booking?', message, [
    { text: 'Keep booking', style: 'cancel' },
    { text: 'Cancel booking', style: 'destructive', onPress: onConfirm },
  ]);
}

export default function BookingScreen() {
  const palette = usePalette();
  const { id, new: isNew } = useLocalSearchParams<{ id: string; new?: string }>();
  const { bookings, loaded, cancel } = useBookings();
  const [cancelling, setCancelling] = useState(false);
  const [now] = useState(() => Date.now());
  const booking = bookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.background }}>
        {loaded && (
          <EmptyState icon="ticket" title="Booking not found" body="It may have been removed from this phone." />
        )}
      </View>
    );
  }

  const { session } = booking;
  const upcoming = new Date(session.start).getTime() > now;
  const cancelled = booking.status === 'cancelled';

  const onCancel = () =>
    confirmCancel(async () => {
      setCancelling(true);
      try {
        await cancel(booking.id);
      } catch {
        const message = `We couldn't cancel this booking. Please contact us at ${BUSINESS.email}.`;
        if (Platform.OS === 'web') window.alert(message);
        else Alert.alert('Something went wrong', message);
      } finally {
        setCancelling(false);
      }
    });

  return (
    <ScrollView style={{ backgroundColor: palette.background }} contentContainerStyle={styles.content}>
      {isNew && !cancelled && (
        <View style={styles.hero}>
          <View style={[styles.heroIcon, { backgroundColor: palette.successSoft }]}>
            <Ionicons name="checkmark" size={36} color={palette.success} />
          </View>
          <Text style={[styles.heroTitle, { color: palette.text }]}>You&apos;re booked in</Text>
          <Text style={[styles.heroBody, { color: palette.muted }]}>
            We&apos;ve saved this booking in the app. See you at the sauna!
          </Text>
        </View>
      )}

      {cancelled && (
        <View style={[styles.status, { backgroundColor: palette.accentSoft }]}>
          <Ionicons name="close-circle" size={18} color={palette.danger} />
          <Text style={[styles.statusText, { color: palette.danger }]}>This booking was cancelled</Text>
        </View>
      )}

      <Card>
        <Text style={[styles.title, { color: palette.text }]}>{session.title}</Text>
        <Row icon="calendar-outline">{formatDate(session.start)}</Row>
        <Row icon="time-outline">{formatTimeRange(session)}</Row>
        <Row icon="people-outline">
          {booking.guests} {booking.guests === 1 ? 'person' : 'people'}
        </Row>
        <Row icon="card-outline">{formatPrice(booking.totalPence)}</Row>
        <Row icon="pricetag-outline">Reference {booking.reference}</Row>
        {BUSINESS.address ? <Row icon="location-outline">{BUSINESS.address}</Row> : null}
      </Card>

      <Card>
        <Text style={[ui.label, { color: palette.muted }]}>BOOKED BY</Text>
        <Row icon="person-outline">{booking.customer.name}</Row>
        <Row icon="mail-outline">{booking.customer.email}</Row>
        <Row icon="call-outline">{booking.customer.phone}</Row>
      </Card>

      {upcoming && !cancelled && (
        <Card>
          <Text style={[ui.label, { color: palette.muted }]}>BEFORE YOU COME</Text>
          <Row icon="alarm-outline">{BUSINESS.arrival}</Row>
          <Row icon="bag-handle-outline">Bring: {BUSINESS.whatToBring.join(', ').toLowerCase()}.</Row>
        </Card>
      )}

      <View style={styles.actions}>
        {isNew ? <Button label="Done" onPress={() => router.dismissTo('/bookings')} /> : null}
        {upcoming && !cancelled && (
          <Button label="Cancel booking" variant="danger" onPress={onCancel} loading={cancelling} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16, paddingBottom: 48 },
  hero: { alignItems: 'center', gap: 8, paddingVertical: 12 },
  heroIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontSize: 24, fontWeight: '700' },
  heroBody: { fontSize: 15, textAlign: 'center' },
  status: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12 },
  statusText: { fontSize: 15, fontWeight: '600' },
  title: { fontSize: 20, fontWeight: '700' },
  actions: { gap: 12 },
});
