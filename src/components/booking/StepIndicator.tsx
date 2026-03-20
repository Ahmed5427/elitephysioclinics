import React from 'react';
import { CheckCircle } from 'lucide-react';

const STEPS = ['Condition', 'Date & Time', 'Your Details'];

interface StepIndicatorProps {
  currentStep: number;
  isMobile: boolean;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, isMobile }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: isMobile ? 4 : 8,
      marginBottom: isMobile ? 28 : 40,
    }}>
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <React.Fragment key={i}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? 6 : 10,
            }}>
              <div style={{
                width: isMobile ? 28 : 32,
                height: isMobile ? 28 : 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isMobile ? 11 : 13,
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 600,
                background: isActive ? '#2478d4' : isCompleted ? 'rgba(36,120,212,0.2)' : 'rgba(255,255,255,0.05)',
                color: isActive ? '#0d1e3c' : isCompleted ? '#2478d4' : 'rgba(240,245,251,0.35)',
                border: isActive ? 'none' : `1px solid ${isCompleted ? 'rgba(36,120,212,0.3)' : 'rgba(240,245,251,0.1)'}`,
                transition: 'all 0.3s ease',
              }}>
                {isCompleted ? <CheckCircle size={isMobile ? 14 : 16} /> : stepNum}
              </div>
              {!isMobile && (
                <span style={{
                  fontSize: 12,
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#f0f5fb' : isCompleted ? 'rgba(36,120,212,0.7)' : 'rgba(240,245,251,0.3)',
                  letterSpacing: '0.06em',
                  transition: 'all 0.3s ease',
                }}>
                  {label}
                </span>
              )}
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                width: isMobile ? 24 : 48,
                height: 1,
                background: isCompleted ? 'rgba(36,120,212,0.4)' : 'rgba(240,245,251,0.1)',
                transition: 'background 0.3s ease',
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
