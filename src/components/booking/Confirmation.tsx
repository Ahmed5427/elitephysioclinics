import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import type { BookingWithCondition } from '../../lib/types';

interface ConfirmationProps {
  booking: BookingWithCondition;
  onBookAnother: () => void;
  isMobile: boolean;
}

function formatTime12h(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

function formatDateHuman(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export const Confirmation: React.FC<ConfirmationProps> = ({ booking, onBookAnother, isMobile }) => {
  const reference = booking.id.substring(0, 8).toUpperCase();

  const details = [
    { label: 'Booking Reference', value: reference },
    { label: 'Patient', value: booking.patientName },
    { label: 'Condition', value: booking.conditionTitle },
    { label: 'Date', value: formatDateHuman(booking.date) },
    { label: 'Time', value: `${formatTime12h(booking.startTime)} – ${formatTime12h(booking.endTime)}` },
    { label: 'Email', value: booking.patientEmail },
    { label: 'Phone', value: booking.patientPhone },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ textAlign: 'center' }}
    >
      {/* Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, duration: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'rgba(201,160,66,0.12)',
          border: '2px solid rgba(201,160,66,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}
      >
        <CheckCircle size={32} color="#c9a042" />
      </motion.div>

      <h3 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: isMobile ? 28 : 36,
        fontWeight: 300,
        color: '#faf6ef',
        marginBottom: 8,
      }}>
        Booking <em style={{ color: '#c9a042' }}>Confirmed!</em>
      </h3>
      <p style={{
        fontSize: 13,
        color: 'rgba(250,246,239,0.45)',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 300,
        marginBottom: 32,
        lineHeight: 1.6,
      }}>
        Your appointment has been successfully booked.
      </p>

      {/* Details card */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(201,160,66,0.13)',
        padding: isMobile ? '20px' : '28px 32px',
        textAlign: 'left',
        marginBottom: 28,
      }}>
        {details.map(({ label, value }, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              gap: isMobile ? 2 : 8,
              padding: '10px 0',
              borderBottom: i < details.length - 1 ? '1px solid rgba(201,160,66,0.08)' : 'none',
            }}
          >
            <span style={{
              fontSize: 11,
              color: 'rgba(201,160,66,0.6)',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
            }}>
              {label}
            </span>
            <span style={{
              fontSize: 13,
              color: label === 'Booking Reference' ? '#c9a042' : 'rgba(250,246,239,0.75)',
              fontFamily: label === 'Booking Reference' ? 'monospace' : 'Outfit, sans-serif',
              fontWeight: label === 'Booking Reference' ? 700 : 400,
              letterSpacing: label === 'Booking Reference' ? '0.08em' : 0,
            }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={onBookAnother}
        className="btn-primary"
        style={{
          width: isMobile ? '100%' : 'auto',
          background: '#c9a042',
          color: '#0a1f13',
          border: 'none',
          padding: '14px 32px',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase' as const,
          fontFamily: 'Outfit, sans-serif',
          cursor: 'pointer',
          borderRadius: 2,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}
      >
        Book Another Appointment <ArrowRight size={13} />
      </button>
    </motion.div>
  );
};
