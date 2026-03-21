import { z } from 'zod';
import { CONDITION_SLUGS } from './constants';

const UK_PHONE_REGEX = /^(\+44|0)[\s\-]?[\d\s\-]{9,12}$/;

export const conditionSchema = z.object({
  conditionSlug: z.string().min(1, 'Please select a condition').refine(
    val => CONDITION_SLUGS.includes(val),
    'Please select a valid condition'
  ),
});

export const patientSchema = z.object({
  patientName: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or fewer'),
  patientPhone: z.string().regex(UK_PHONE_REGEX, 'Please enter a valid UK phone number (e.g. +44 7700 900123)'),
  patientEmail: z.string().email('Please enter a valid email address'),
  consent: z.literal(true, { message: 'You must consent to the privacy policy to proceed' }),
});

export type ConditionInput = z.infer<typeof conditionSchema>;
export type PatientInput = z.infer<typeof patientSchema>;
