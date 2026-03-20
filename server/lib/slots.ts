import type { TimeSlot, ClinicHours } from '../types';
import { getBookingsByDate } from './store';

const CLINIC_HOURS: Record<string, ClinicHours | null> = {
  Monday: { start: '16:30', end: '21:00' },
  Tuesday: { start: '16:30', end: '21:00' },
  Wednesday: { start: '16:30', end: '21:00' },
  Thursday: { start: '16:30', end: '21:00' },
  Friday: { start: '16:30', end: '21:00' },
  Saturday: { start: '08:00', end: '21:00' },
  Sunday: null,
};

const SLOT_DURATION = 30;

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60);
  const newM = total % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

export function getDayOfWeek(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export function getDayClinicHours(dateStr: string): ClinicHours | null {
  const day = getDayOfWeek(dateStr);
  return CLINIC_HOURS[day] || null;
}

export function generateSlotsForDate(dateStr: string): TimeSlot[] {
  const hours = getDayClinicHours(dateStr);
  if (!hours) return [];

  const slots: TimeSlot[] = [];
  let current = hours.start;

  while (current < hours.end) {
    const end = addMinutes(current, SLOT_DURATION);
    if (end <= hours.end) {
      slots.push({ startTime: current, endTime: end, available: true });
    }
    current = end;
  }

  return slots;
}

export function getAvailableSlots(dateStr: string): TimeSlot[] {
  const slots = generateSlotsForDate(dateStr);
  const bookings = getBookingsByDate(dateStr);
  const bookedTimes = new Set(bookings.map(b => b.startTime));

  return slots.map(slot => ({
    ...slot,
    available: !bookedTimes.has(slot.startTime),
  }));
}
