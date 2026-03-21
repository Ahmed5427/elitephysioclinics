import { Router } from 'express';
import { bookingSchema, formatZodErrors, isDateInBookingWindow, isSunday } from '../lib/validation';
import { createBooking, isSlotAvailable } from '../lib/store';
import { getDayClinicHours } from '../lib/slots';
import { sendBookingNotification } from '../lib/whatsapp';
import type { BookingWithCondition } from '../types';

const CONDITIONS: Record<string, string> = {
  'back-pain-sciatica': 'Back Pain and Sciatica',
  'neck-pain-whiplash': 'Neck Pain and Whiplash',
  'arthritis': 'Arthritis',
  'sports-injuries': 'Sports Injuries',
  'work-related-injury': 'Work Related Injury or Pain',
  'muscle-tendon-ligament': 'Muscles, Tendons and Ligaments Injuries',
  'ankle-knee': 'Ankle and Knee Injuries/Problems',
  'frozen-shoulder': 'Frozen Shoulder',
  'tennis-elbow': 'Tennis Elbow',
  'post-surgery-rehab': 'Rehabilitation Following Surgery',
  'disc-prolapses': 'Disc Prolapses',
  'other': 'Other',
};

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export const bookRouter = Router();

bookRouter.post('/book', (req, res) => {
  const result = bookingSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: formatZodErrors(result.error),
    });
  }

  const data = result.data;

  if (!isDateInBookingWindow(data.date)) {
    return res.status(400).json({
      error: 'Invalid date',
      message: 'Date must be within the next 4 weeks and not in the past',
    });
  }

  if (isSunday(data.date)) {
    return res.status(400).json({
      error: 'Invalid date',
      message: 'The clinic is closed on Sundays',
    });
  }

  const hours = getDayClinicHours(data.date);
  if (!hours) {
    return res.status(400).json({
      error: 'Invalid date',
      message: 'No clinic hours available for this date',
    });
  }

  if (data.startTime < hours.start || data.startTime >= hours.end) {
    return res.status(400).json({
      error: 'Invalid time',
      message: `Time must be between ${hours.start} and ${hours.end}`,
    });
  }

  if (!isSlotAvailable(data.date, data.startTime)) {
    return res.status(409).json({
      error: 'Time slot already booked',
      message: `The selected time slot on ${data.date} at ${data.startTime} is no longer available. Please select a different time.`,
    });
  }

  const booking = createBooking(data);
  const endTime = addMinutes(booking.startTime, 30);
  const conditionTitle = CONDITIONS[booking.conditionSlug] || booking.conditionSlug;

  const bookingResponse: BookingWithCondition = {
    ...booking,
    conditionTitle,
    endTime,
  };

  // Fire-and-forget WhatsApp notification
  sendBookingNotification(bookingResponse).catch(() => {});

  return res.status(201).json({ booking: bookingResponse });
});
