import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { bookingService, type Booking, type BookingRequest, type Customer } from '../booking';

type State = {
  bookings: Booking[];
  /** Remembered so the customer doesn't retype their details every time. */
  customer: Customer;
};

type Store = State & {
  loaded: boolean;
  book: (request: BookingRequest) => Promise<Booking>;
  cancel: (bookingId: string) => Promise<void>;
};

const STORAGE_KEY = 'roe.bookings.v1';
const EMPTY: State = { bookings: [], customer: { name: '', email: '', phone: '' } };

const BookingsContext = createContext<Store | null>(null);

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setState({ ...EMPTY, ...JSON.parse(raw) });
      })
      .catch((error) => console.warn('Could not load bookings', error))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    // Don't overwrite stored bookings with the empty initial state before it has loaded.
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((error) =>
      console.warn('Could not save bookings', error),
    );
  }, [state, loaded]);

  const book = useCallback(async (request: BookingRequest) => {
    const booking = await bookingService.createBooking(request);
    setState((s) => ({ bookings: [booking, ...s.bookings], customer: request.customer }));
    return booking;
  }, []);

  const cancel = useCallback(
    async (bookingId: string) => {
      const booking = state.bookings.find((b) => b.id === bookingId);
      if (!booking) return;
      await bookingService.cancelBooking(booking);
      setState((s) => ({
        ...s,
        bookings: s.bookings.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b)),
      }));
    },
    [state.bookings],
  );

  const value = useMemo<Store>(() => ({ ...state, loaded, book, cancel }), [state, loaded, book, cancel]);

  return <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>;
}

export function useBookings(): Store {
  const store = useContext(BookingsContext);
  if (!store) throw new Error('useBookings must be used inside BookingsProvider');
  return store;
}
