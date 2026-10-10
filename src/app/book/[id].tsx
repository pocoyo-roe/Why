import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, type ComponentProps } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { BookingError, bookingService, type Session } from '../../booking';
import { Button, Card, DemoBanner, EmptyState, Row, styles as ui } from '../../components/ui';
import { BUSINESS } from '../../config';
import { formatDate, formatPrice, formatTimeRange } from '../../format';
import { useBookings } from '../../store/BookingsStore';
import { usePalette } from '../../theme';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function BookScreen() {
  const palette = usePalette();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { loaded } = useBookings();
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    bookingService
      .getSession(id)
      .then(setSession)
      .catch(() => setSession(null));
  }, [id]);

  // Wait for saved details too, so the form can start pre-filled.
  if (session === undefined || !loaded) {
    return <ActivityIndicator style={{ flex: 1, backgroundColor: palette.background }} color={palette.accent} />;
  }
  if (session === null) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.background }}>
        <EmptyState
          icon="calendar-clear"
          title="Session not found"
          body="It may have been removed from the timetable."
        />
      </View>
    );
  }
  return <BookingForm session={session} />;
}

function BookingForm({ session }: { session: Session }) {
  const palette = usePalette();
  const { customer: saved, book } = useBookings();
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState(saved.name);
  const [email, setEmail] = useState(saved.email);
  const [phone, setPhone] = useState(saved.phone);
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isPrivate = session.kind === 'private';
  const maxGuests = isPrivate ? session.capacity : session.spacesLeft;
  const total = isPrivate ? session.pricePence : session.pricePence * guests;
  const errors = {
    name: !name.trim() ? 'Enter your name' : '',
    email: !EMAIL.test(email.trim()) ? 'Enter a valid email address' : '',
    phone: phone.replace(/\D/g, '').length < 10 ? 'Enter a phone number we can reach you on' : '',
  };
  const valid = !errors.name && !errors.email && !errors.phone;

  const submit = async () => {
    setShowErrors(true);
    setError('');
    if (!valid) return;
    setSubmitting(true);
    try {
      const booking = await book({
        sessionId: session.id,
        guests,
        customer: { name: name.trim(), email: email.trim(), phone: phone.trim() },
      });
      router.replace(`/booking/${booking.id}?new=1`);
    } catch (e) {
      setError(e instanceof BookingError ? e.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  const field = (
    label: string,
    value: string,
    onChange: (text: string) => void,
    fieldError: string,
    props: Partial<ComponentProps<typeof TextInput>>,
  ) => (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: palette.text }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholderTextColor={palette.muted}
        style={[
          styles.input,
          {
            color: palette.text,
            backgroundColor: palette.card,
            borderColor: showErrors && fieldError ? palette.danger : palette.border,
          },
        ]}
        accessibilityLabel={label}
        {...props}
      />
      {showErrors && fieldError ? (
        <Text style={[styles.fieldError, { color: palette.danger }]}>{fieldError}</Text>
      ) : null}
    </View>
  );

  return (
    <ScrollView
      style={{ backgroundColor: palette.background }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <DemoBanner />
      <Card>
        <Text style={[styles.title, { color: palette.text }]}>{session.title}</Text>
        <Row icon="calendar-outline">{formatDate(session.start)}</Row>
        <Row icon="time-outline">
          {formatTimeRange(session)} ({session.durationMinutes} min)
        </Row>
        <Text style={[styles.description, { color: palette.muted }]}>{session.description}</Text>
      </Card>

      <View style={styles.section}>
        <Text style={[ui.label, { color: palette.muted }]}>
          {isPrivate ? 'HOW MANY IN YOUR GROUP?' : 'HOW MANY PEOPLE?'}
        </Text>
        <Card style={styles.stepperCard}>
          <Stepper value={guests} min={1} max={maxGuests} onChange={setGuests} />
          <Text style={[styles.stepperHint, { color: palette.muted }]}>
            {isPrivate
              ? `Up to ${session.capacity} people`
              : `${formatPrice(session.pricePence)} each · ${session.spacesLeft} left`}
          </Text>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={[ui.label, { color: palette.muted }]}>YOUR DETAILS</Text>
        {field('Full name', name, setName, errors.name, { autoComplete: 'name', textContentType: 'name' })}
        {field('Email', email, setEmail, errors.email, {
          autoComplete: 'email',
          textContentType: 'emailAddress',
          keyboardType: 'email-address',
          autoCapitalize: 'none',
        })}
        {field('Mobile number', phone, setPhone, errors.phone, {
          autoComplete: 'tel',
          textContentType: 'telephoneNumber',
          keyboardType: 'phone-pad',
        })}
      </View>

      <Card>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: palette.text }]}>Total</Text>
          <Text style={[styles.total, { color: palette.text }]}>{formatPrice(total)}</Text>
        </View>
        <Text style={[styles.policy, { color: palette.muted }]}>{BUSINESS.cancellationPolicy}</Text>
      </Card>

      {error ? (
        <View style={[styles.errorBox, { backgroundColor: palette.accentSoft }]}>
          <Ionicons name="alert-circle" size={18} color={palette.danger} />
          <Text style={[styles.errorText, { color: palette.danger }]}>{error}</Text>
        </View>
      ) : null}

      <Button label={`Confirm booking · ${formatPrice(total)}`} onPress={submit} loading={submitting} />
    </ScrollView>
  );
}

function Stepper({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const palette = usePalette();
  const button = (icon: 'remove' | 'add', next: number, label: string) => {
    const disabled = next < min || next > max;
    return (
      <Pressable
        onPress={() => onChange(next)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={[styles.stepButton, { borderColor: palette.border, opacity: disabled ? 0.35 : 1 }]}
      >
        <Ionicons name={icon} size={22} color={palette.accent} />
      </Pressable>
    );
  };
  return (
    <View style={styles.stepper}>
      {button('remove', value - 1, 'One fewer person')}
      <Text style={[styles.stepValue, { color: palette.text }]} accessibilityLiveRegion="polite">
        {value} {value === 1 ? 'person' : 'people'}
      </Text>
      {button('add', value + 1, 'One more person')}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 18, paddingBottom: 48 },
  title: { fontSize: 22, fontWeight: '700' },
  description: { fontSize: 15, lineHeight: 21 },
  section: { gap: 10 },
  stepperCard: { alignItems: 'center' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepValue: { fontSize: 18, fontWeight: '600', minWidth: 100, textAlign: 'center' },
  stepperHint: { fontSize: 13 },
  field: { gap: 6 },
  fieldLabel: { fontSize: 15, fontWeight: '500' },
  input: { fontSize: 16, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
  fieldError: { fontSize: 13 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  totalLabel: { fontSize: 17, fontWeight: '600' },
  total: { fontSize: 24, fontWeight: '700' },
  policy: { fontSize: 13, lineHeight: 18 },
  errorBox: { flexDirection: 'row', gap: 8, padding: 12, borderRadius: 12, alignItems: 'center' },
  errorText: { fontSize: 14, fontWeight: '600', flex: 1 },
});
