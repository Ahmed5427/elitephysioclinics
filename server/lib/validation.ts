import { z } from 'zod';

const CONDITION_SLUGS = [
  'back-pain-sciatica', 'neck-pain-whiplash', 'arthritis', 'sports-injuries',
  'work-related-injury', 'muscle-tendon-ligament', 'ankle-knee', 'frozen-shoulder',
  'tennis-elbow', 'post-surgery-rehab', 'disc-prolapses', 'other',
] as const;

const UK_PHONE_REGEX = /^(\+44|0)[\s\-]?[\d\s\-]{9,12}$/;

export const bookingSchema = z.object({
  patientName: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or fewer'),
  patientPhone: z.string().regex(UK_PHONE_REGEX, 'Please enter a valid UK phone number'),
  patientEmail: z.string().email('Please enter a valid email address'),
  conditionSlug: z.enum(CONDITION_SLUGS, { message: 'Please select a valid condition' }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export function formatZodErrors(error: z.ZodError): { field: string; message: string }[] {
  return error.issues.map(e => ({
    field: e.path.join('.'),
    message: e.message,
  }));
}

export function isDateInBookingWindow(dateStr: string): boolean {
  const date = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 28);

  return date >= today && date <= maxDate;
}

export function isSunday(dateStr: string): boolean {
  const date = new Date(dateStr + 'T12:00:00');
  return date.getDay() === 0;
}
