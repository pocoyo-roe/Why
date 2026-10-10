import { DemoBookingService } from './demo';
import type { BookingService } from './types';

export * from './types';

/**
 * The booking system the app talks to. Swap the demo for a real connection
 * once you've chosen a booking system (see README.md).
 */
export const bookingService: BookingService = new DemoBookingService();
