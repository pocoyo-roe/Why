import type { Session } from './booking';

const LOCALE = 'en-GB';

export function formatPrice(pence: number): string {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: pence % 100 === 0 ? 0 : 2,
  }).format(pence / 100);
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' });
}

export function formatTimeRange(session: Session): string {
  const end = new Date(new Date(session.start).getTime() + session.durationMinutes * 60_000);
  return `${formatTime(session.start)}–${formatTime(end.toISOString())}`;
}

export function formatDate(iso: string | Date, style: 'long' | 'short' = 'long'): string {
  return new Date(iso).toLocaleDateString(
    LOCALE,
    style === 'long'
      ? { weekday: 'long', day: 'numeric', month: 'long' }
      : { weekday: 'short', day: 'numeric', month: 'short' },
  );
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
