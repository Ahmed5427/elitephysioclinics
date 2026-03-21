import { Router } from 'express';
import { getAvailableSlots, getDayClinicHours, getDayOfWeek } from '../lib/slots';
import { isDateInBookingWindow, isSunday } from '../lib/validation';

export const availabilityRouter = Router();

availabilityRouter.get('/availability', (req, res) => {
  const date = req.query.date as string;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({
      error: 'Invalid date',
      message: 'Date must be in YYYY-MM-DD format',
    });
  }

  if (!isDateInBookingWindow(date)) {
    return res.status(400).json({
      error: 'Invalid date',
      message: 'Date must be within the next 4 weeks and not in the past',
    });
  }

  if (isSunday(date)) {
    return res.status(400).json({
      error: 'Invalid date',
      message: 'The clinic is closed on Sundays',
    });
  }

  const hours = getDayClinicHours(date);
  if (!hours) {
    return res.status(400).json({
      error: 'Invalid date',
      message: 'No clinic hours available for this date',
    });
  }

  const slots = getAvailableSlots(date);

  return res.json({
    date,
    dayOfWeek: getDayOfWeek(date),
    clinicHours: hours,
    slots,
  });
});
