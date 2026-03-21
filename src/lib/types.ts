export interface Condition {
  slug: string;
  title: string;
  description: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface Booking {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  conditionSlug: string;
  date: string;
  startTime: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface BookingWithCondition extends Booking {
  conditionTitle: string;
  endTime: string;
}

export interface BookingRequest {
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  conditionSlug: string;
  date: string;
  startTime: string;
}

export interface AvailabilityResponse {
  date: string;
  dayOfWeek: string;
  clinicHours: {
    start: string;
    end: string;
  };
  slots: TimeSlot[];
}

export interface ApiError {
  error: string;
  message?: string;
  details?: { field: string; message: string }[];
}

export interface ClinicHours {
  start: string;
  end: string;
}
