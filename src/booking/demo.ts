import AsyncStorage from '@react-native-async-storage/async-storage';

import { BookingError, type Booking, type BookingRequest, type BookingService, type Session } from './types';

/**
 * A made-up timetable so the app can be tried before it's connected to a real
 * booking system. Bookings only exist on this phone.
 */

const CAPACITY = 8;
const TAKEN_KEY = 'demo.taken.v1';

type Slot = { kind: Session['kind']; time: string };

const WEEKDAY: Slot[] = [
  { kind: 'shared', time: '07:00' },
  { kind: 'shared', time: '08:30' },
  { kind: 'private', time: '12:00' },
  { kind: 'private', time: '14:00' },
  { kind: 'shared', time: '17:30' },
  { kind: 'shared', time: '19:00' },
  { kind: 'shared', time: '20:30' },
];

const WEEKEND: Slot[] = [
  { kind: 'shared', time: '08:00' },
  { kind: 'shared', time: '09:30' },
  { kind: 'shared', time: '11:00' },
  { kind: 'private', time: '13:00' },
  { kind: 'shared', time: '15:00' },
  { kind: 'shared', time: '16:30' },
  { kind: 'shared', time: '18:00' },
];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function dayKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Small stable number from a string, so demo occupancy looks realistic but doesn't change. */
function hash(text: string) {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return Math.abs(h);
}

async function loadTaken(): Promise<Record<string, number>> {
  try {
    const raw = await AsyncStorage.getItem(TAKEN_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function saveTaken(taken: Record<string, number>) {
  await AsyncStorage.setItem(TAKEN_KEY, JSON.stringify(taken));
}

function buildDay(date: Date, taken: Record<string, number>): Session[] {
  const weekend = date.getDay() === 0 || date.getDay() === 6;
  return (weekend ? WEEKEND : WEEKDAY).map(({ kind, time }) => {
    const [h, m] = time.split(':').map(Number);
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m);
    const id = `${kind}-${dayKey(date)}-${time.replace(':', '')}`;
    // Pretend other customers have already booked some spaces.
    const booked =
      kind === 'shared'
        ? Math.min(CAPACITY, (hash(id) % 9) + (taken[id] ?? 0))
        : hash(id) % 3 === 0
          ? CAPACITY
          : (taken[id] ?? 0);
    return kind === 'shared'
      ? {
          id,
          kind,
          title: 'Shared session',
          description: 'Sauna and cold plunge with up to 7 others. Book a space for each person.',
          start: start.toISOString(),
          durationMinutes: 60,
          pricePence: 1500,
          capacity: CAPACITY,
          spacesLeft: CAPACITY - booked,
        }
      : {
          id,
          kind,
          title: 'Private hire',
          description: `The whole sauna for your group of up to ${CAPACITY}. One price, however many come.`,
          start: start.toISOString(),
          durationMinutes: 90,
          pricePence: 9000,
          capacity: CAPACITY,
          spacesLeft: booked > 0 ? 0 : CAPACITY,
        };
  });
}

function dateFromId(id: string): Date | null {
  const match = /-(\d{4})-(\d{2})-(\d{2})-\d{4}$/.exec(id);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

export class DemoBookingService implements BookingService {
  readonly isDemo = true;

  async listSessions(date: Date) {
    const now = Date.now();
    return buildDay(date, await loadTaken()).filter((s) => new Date(s.start).getTime() > now);
  }

  async getSession(id: string) {
    const date = dateFromId(id);
    if (!date) return null;
    return buildDay(date, await loadTaken()).find((s) => s.id === id) ?? null;
  }

  async createBooking({ sessionId, guests, customer }: BookingRequest): Promise<Booking> {
    const session = await this.getSession(sessionId);
    if (!session || new Date(session.start).getTime() < Date.now()) {
      throw new BookingError('That session is no longer available.');
    }
    const needed = session.kind === 'private' ? session.capacity : guests;
    if (session.spacesLeft < needed) {
      throw new BookingError(
        session.spacesLeft === 0 ? 'Sorry, that session has just sold out.' : `Only ${session.spacesLeft} spaces left.`,
      );
    }

    const taken = await loadTaken();
    taken[sessionId] = (taken[sessionId] ?? 0) + needed;
    await saveTaken(taken);

    return {
      id: `${sessionId}-${Date.now().toString(36)}`,
      reference: `DEMO-${Date.now().toString(36).slice(-5).toUpperCase()}`,
      session: { ...session, spacesLeft: session.spacesLeft - needed },
      guests,
      totalPence: session.kind === 'private' ? session.pricePence : session.pricePence * guests,
      customer,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
  }

  async cancelBooking(booking: Booking) {
    const taken = await loadTaken();
    const freed = booking.session.kind === 'private' ? booking.session.capacity : booking.guests;
    taken[booking.session.id] = Math.max(0, (taken[booking.session.id] ?? 0) - freed);
    await saveTaken(taken);
  }
}
