import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { TimeSlot } from '../../lib/types';

interface TimeSlotPickerProps {
  date: string;
  selectedTime: string;
  onSelect: (time: string) => void;
  isMobile: boolean;
}

function formatTime12h(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ date, selectedTime, onSelect, isMobile }) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }

    setLoading(true);
    setError('');

    fetch(`/api/availability?date=${date}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.message || data.error);
          setSlots([]);
        } else {
          setSlots(data.slots || []);
        }
      })
      .catch(() => {
        setError('Failed to load available times. Please try again.');
        setSlots([]);
      })
      .finally(() => setLoading(false));
  }, [date]);

  if (!date) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      style={{ marginTop: 24 }}
    >
      <div style={{
        fontSize: 11,
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 600,
        color: 'rgba(36,120,212,0.7)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase' as const,
        marginBottom: 14,
      }}>
        Select Time
      </div>

      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '24px 0',
          fontSize: 13,
          color: 'rgba(240,245,251,0.4)',
          fontFamily: 'Outfit, sans-serif',
        }}>
          Loading available times...
        </div>
      )}

      {error && (
        <p style={{ fontSize: 12, color: '#e55', fontFamily: 'Outfit, sans-serif' }}>{error}</p>
      )}

      {!loading && !error && slots.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: 6,
        }}>
          {slots.map((slot) => {
            const isSelected = slot.startTime === selectedTime;
            return (
              <button
                key={slot.startTime}
                disabled={!slot.available}
                onClick={() => onSelect(slot.startTime)}
                style={{
                  padding: '10px 8px',
                  border: isSelected
                    ? '1px solid #2478d4'
                    : '1px solid rgba(255,255,255,0.06)',
                  background: isSelected
                    ? 'rgba(36,120,212,0.15)'
                    : slot.available
                      ? 'rgba(255,255,255,0.02)'
                      : 'rgba(255,255,255,0.01)',
                  color: !slot.available
                    ? 'rgba(240,245,251,0.2)'
                    : isSelected
                      ? '#2478d4'
                      : 'rgba(240,245,251,0.7)',
                  fontSize: 12,
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: slot.available ? 'pointer' : 'not-allowed',
                  textAlign: 'center' as const,
                  transition: 'all 0.2s ease',
                  opacity: slot.available ? 1 : 0.45,
                  textDecoration: slot.available ? 'none' : 'line-through',
                }}
              >
                {formatTime12h(slot.startTime)} – {formatTime12h(slot.endTime)}
              </button>
            );
          })}
        </div>
      )}

      {!loading && !error && slots.length === 0 && date && (
        <p style={{ fontSize: 13, color: 'rgba(240,245,251,0.35)', fontFamily: 'Outfit, sans-serif' }}>
          No time slots available for this date.
        </p>
      )}
    </motion.div>
  );
};
