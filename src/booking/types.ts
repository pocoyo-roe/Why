export type SessionKind = 'shared' | 'private';

/** One bookable slot in the timetable. */
export type Session = {
  id: string;
  kind: SessionKind;
  title: string;
  description: string;
  /** ISO 8601 date-time. */
  start: string;
  durationMinutes: number;
  /** Shared: price per person. Private: price for the whole sauna. In pence. */
  pricePence: number;
  /** Total spaces. A private hire uses all of them. */
  capacity: number;
  spacesLeft: number;
};

export type Customer = {
  name: string;
  email: string;
  phone: string;
};

export type Booking = {
  id: string;
  /** The booking system's own reference, shown to the customer. */
  reference: string;
  session: Session;
  /** People attending. For a private hire this is the group size. */
  guests: number;
  totalPence: number;
  customer: Customer;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
};

export type BookingRequest = {
  sessionId: string;
  guests: number;
  customer: Customer;
};

/**
 * Everything the app needs from a booking system. To connect your website's
 * booking system, write a class that implements this and talks to its API,
 * then switch to it in src/booking/index.ts. See README.md.
 */
export interface BookingService {
  /** True while the app is showing made-up demo data. */
  readonly isDemo: boolean;
  listSessions(date: Date): Promise<Session[]>;
  getSession(id: string): Promise<Session | null>;
  createBooking(request: BookingRequest): Promise<Booking>;
  cancelBooking(booking: Booking): Promise<void>;
}

export class BookingError extends Error {}
