import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion';

// Floating particle
const Particle: React.FC<{ seed: number }> = ({ seed }) => {
  const frame = useCurrentFrame();

  const x = ((seed * 137.508) % 1) * 100;
  const speed = 0.04 + ((seed * 73.1) % 1) * 0.08;
  const size = 1.5 + ((seed * 31.7) % 1) * 4;
  const isBlue = seed % 3 === 0;
  const delay = (seed * 17) % 80;

  const yBase = ((seed * 23.4) % 1) * 100;
  const y = (yBase + frame * speed) % 110 - 5;

  const opacity = interpolate(
    frame,
    [delay, delay + 25, 155, 180],
    [0, isBlue ? 0.55 : 0.35, isBlue ? 0.55 : 0.35, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        borderRadius: '50%',
        background: isBlue ? '#2478d4' : '#6ab0d9',
        opacity,
        boxShadow: `0 0 ${size * 3}px ${isBlue ? 'rgba(36,120,212,0.5)' : 'rgba(106,176,217,0.4)'}`,
      }}
    />
  );
};

// Aurora band drifting
const AuroraBand: React.FC<{ seed: number; color: string }> = ({ seed, color }) => {
  const frame = useCurrentFrame();
  const yBase = seed * 33;
  const y = yBase + Math.sin(frame / 80 + seed * 2) * 4;
  const opacity = 0.07 + Math.sin(frame / 60 + seed) * 0.03;

  return (
    <div
      style={{
        position: 'absolute',
        left: '-20%',
        right: '-20%',
        top: `${y}%`,
        height: '25%',
        background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
        opacity,
        transform: `rotate(${Math.sin(frame / 120 + seed) * 1.5}deg)`,
      }}
    />
  );
};

// Blue sweep line
const SweepLine: React.FC<{ startFrame: number; fromRight?: boolean; top: string; opacity?: number }> = ({
  startFrame,
  fromRight,
  top,
  opacity = 0.5,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, startFrame + 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [startFrame + 55, startFrame + 100], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: fromRight ? 'auto' : 0,
        right: fromRight ? 0 : 'auto',
        width: `${progress * 100}%`,
        height: 1,
        background: fromRight
          ? 'linear-gradient(to left, transparent 0%, rgba(36,120,212,0.8) 60%, rgba(36,120,212,0.3) 100%)'
          : 'linear-gradient(to right, transparent 0%, rgba(36,120,212,0.8) 60%, rgba(36,120,212,0.3) 100%)',
        opacity: fadeOut * opacity,
      }}
    />
  );
};

// Animated decorative ring
const DecorRing: React.FC<{ size: number; x: string; y: string; delay: number }> = ({ size, x, y, delay }) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame: frame - delay, fps: 30, config: { damping: 120, stiffness: 60 } });
  const rotate = frame * 0.15;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`,
        opacity: 0.18,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 1}
          fill="none"
          stroke="#2478d4"
          strokeWidth="0.5"
          strokeDasharray="4 8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 3}
          fill="none"
          stroke="rgba(36,120,212,0.4)"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
};

// Medical cross
const MedCross: React.FC<{ x: string; y: string; size: number; delay: number }> = ({ x, y, size, delay }) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame: frame - delay, fps: 30, config: { damping: 200, stiffness: 50 } });
  const pulse = 0.3 + Math.sin(frame / 25) * 0.05;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: pulse,
      }}
    >
      <div style={{ position: 'absolute', left: '50%', top: 0, width: 1, height: '100%', background: '#2478d4', transform: 'translateX(-50%)' }} />
      <div style={{ position: 'absolute', top: '50%', left: 0, height: 1, width: '100%', background: '#2478d4', transform: 'translateY(-50%)' }} />
    </div>
  );
};

export const HeroComposition: React.FC = () => {
  const frame = useCurrentFrame();

  // Overall fade-in
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  // Radial pulse
  const pulseScale = 0.92 + Math.sin(frame / 40) * 0.08;
  const pulseOpacity = 0.12 + Math.sin(frame / 40) * 0.04;

  // Background gradient shift
  const gradAngle = 130 + Math.sin(frame / 120) * 15;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradAngle}deg, #06091a 0%, #0d2547 35%, #1a3d6b 65%, #0d1e3c 100%)`,
        opacity: fadeIn,
        overflow: 'hidden',
      }}
    >
      {/* Aurora bands */}
      <AuroraBand seed={0.15} color="rgba(36,80,160,0.6)" />
      <AuroraBand seed={0.48} color="rgba(91,163,232,0.3)" />
      <AuroraBand seed={0.75} color="rgba(36,80,160,0.5)" />

      {/* Large radial glow center */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${pulseScale})`,
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,61,107,0.4) 0%, rgba(13,30,60,0) 70%)',
          opacity: pulseOpacity * 5,
        }}
      />

      {/* Particles */}
      {Array.from({ length: 28 }, (_, i) => <Particle key={i} seed={i + 1} />)}

      {/* Sweep lines */}
      <SweepLine startFrame={5} top="38%" />
      <SweepLine startFrame={20} fromRight top="62%" opacity={0.4} />
      <SweepLine startFrame={70} top="44%" opacity={0.3} />
      <SweepLine startFrame={95} fromRight top="56%" opacity={0.35} />
      <SweepLine startFrame={130} top="40%" opacity={0.25} />
      <SweepLine startFrame={150} fromRight top="60%" opacity={0.2} />

      {/* Decorative rings */}
      <DecorRing size={140} x="12%" y="20%" delay={15} />
      <DecorRing size={80} x="88%" y="78%" delay={25} />
      <DecorRing size={200} x="92%" y="18%" delay={8} />

      {/* Medical crosses */}
      <MedCross x="85%" y="22%" size={50} delay={20} />
      <MedCross x="15%" y="75%" size={32} delay={35} />

      {/* Corner brackets */}
      {[
        { top: 28, left: 28, borderStyle: 'Top Left', bTop: true, bLeft: true },
        { top: 28, right: 28, borderStyle: 'Top Right', bTop: true, bRight: true },
        { bottom: 28, left: 28, borderStyle: 'Bottom Left', bBottom: true, bLeft: true },
        { bottom: 28, right: 28, borderStyle: 'Bottom Right', bBottom: true, bRight: true },
      ].map((corner, i) => {
        const opacity = interpolate(frame, [30 + i * 8, 55 + i * 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: corner.top,
              bottom: corner.bottom,
              left: corner.left,
              right: corner.right,
              width: 50,
              height: 50,
              borderTop: corner.bTop ? '1px solid rgba(36,120,212,0.45)' : 'none',
              borderBottom: corner.bBottom ? '1px solid rgba(36,120,212,0.45)' : 'none',
              borderLeft: corner.bLeft ? '1px solid rgba(36,120,212,0.45)' : 'none',
              borderRight: corner.bRight ? '1px solid rgba(36,120,212,0.45)' : 'none',
              opacity,
            }}
          />
        );
      })}

      {/* Fine horizontal grid lines */}
      {[15, 30, 50, 70, 85].map((top, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${top}%`,
            height: 1,
            background: 'rgba(36,120,212,0.04)',
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
