import type { Booking } from '../types';

const bookings = new Map<string, Booking>();

export function createBooking(data: Omit<Booking, 'id' | 'status' | 'createdAt'>): Booking {
  const booking: Booking = {
    ...data,
    id: crypto.randomUUID(),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  bookings.set(booking.id, booking);
  return booking;
}

export function getBookingById(id: string): Booking | undefined {
  return bookings.get(id);
}

export function getAllBookings(): Booking[] {
  return Array.from(bookings.values()).sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });
}

export function getBookingsByDate(date: string): Booking[] {
  return Array.from(bookings.values()).filter(
    b => b.date === date && b.status === 'confirmed'
  );
}

export function isSlotAvailable(date: string, startTime: string): boolean {
  return !Array.from(bookings.values()).some(
    b => b.date === date && b.startTime === startTime && b.status === 'confirmed'
  );
}

export function cancelBooking(id: string): Booking | null {
  const booking = bookings.get(id);
  if (!booking) return null;
  booking.status = 'cancelled';
  return booking;
}
