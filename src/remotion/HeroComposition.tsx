import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
} from 'remotion';

// ── Animated Vertebrae Column ──────────────────────────────────────────────
const VerticalSpineDecor: React.FC<{ x: string; yStart: string; delay?: number }> = ({ x, yStart, delay = 30 }) => {
  const frame = useCurrentFrame();
  const radii = [2, 3.5, 5, 7, 8.5, 9, 8.5, 7, 5, 3.5, 2, 1.5];
  const startOpacity = interpolate(frame, [delay, delay + 50], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  let cy = 0;
  const dots = radii.map((r, i) => {
    const prev = radii[i - 1] ?? r;
    const spacing = (r + prev) * 1.7;
    cy += i === 0 ? 0 : spacing;
    const wavePhase = frame / 32 + i * 0.65;
    const wave = Math.sin(wavePhase);
    const xOff = Math.sin(frame / 90 + i * 0.4) * 2.5;
    return { cx: 20 + xOff, cy: cy + radii[0], r, wave };
  });

  const totalH = cy + radii[radii.length - 1] * 3 + 20;

  return (
    <div style={{
      position: 'absolute', left: x, top: yStart,
      transform: 'translateX(-50%)',
      opacity: startOpacity * 0.25,
    }}>
      <svg width={42} height={totalH} viewBox={`0 0 42 ${totalH}`}>
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            fill={`rgba(36,120,212,${0.55 + d.wave * 0.25})`}
            style={{ filter: `blur(${d.r > 6 ? 0.5 : 0}px)` }}
          />
        ))}
      </svg>
    </div>
  );
};

// ── Body Silhouette Outline ────────────────────────────────────────────────
const BodyOutline: React.FC<{ x: string; y: string; size: number; delay: number; flip?: boolean }> = ({
  x, y, size, delay, flip = false,
}) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame: frame - delay, fps: 30, config: { damping: 150, stiffness: 25 } });
  const floatY = Math.sin(frame / 115 + delay * 0.15) * 10;
  const floatX = Math.cos(frame / 140 + delay * 0.1) * 5;
  const opacity = interpolate(frame, [delay, delay + 50], [0, 0.1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const s = size;

  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `translate(-50%, -50%) scale(${scale}) translate(${floatX}px, ${floatY}px) ${flip ? 'scaleX(-1)' : ''}`,
      opacity,
      filter: 'drop-shadow(0 0 12px rgba(36,120,212,0.3))',
    }}>
      <svg width={s} height={s * 1.55} viewBox="0 0 200 310">
        {/* Outer ring */}
        <circle cx="100" cy="100" r="96" fill="none" stroke="#2d78c8" strokeWidth="1.5" strokeDasharray="6 10" />
        {/* Body outline */}
        <path
          d="M100,40 C114,38 132,46 138,58 C143,68 141,82 138,96 C135,108 130,118 128,130 C127,144 127,158 126,165 L74,165 C73,158 73,144 72,130 C70,118 65,108 62,96 C59,82 57,68 62,58 C68,46 86,38 100,40Z"
          fill="none" stroke="#2d78c8" strokeWidth="2"
        />
        {/* Left wing outline */}
        <path
          d="M66,46 C52,58 44,75 48,92 C50,102 57,110 60,120"
          fill="none" stroke="#4a90d9" strokeWidth="1.5" strokeLinecap="round"
        />
        {/* Right wing outline */}
        <path
          d="M134,46 C148,58 156,75 152,92 C150,102 143,110 140,120"
          fill="none" stroke="#4a90d9" strokeWidth="1.5" strokeLinecap="round"
        />
        {/* Spine dots */}
        {[50, 60, 70, 82, 94, 106, 117, 128, 137, 145, 152, 158].map((yy, i) => {
          const r = i < 2 ? 2 : i < 4 ? 4.5 : i < 8 ? 6 : 3.5;
          return <circle key={i} cx="101" cy={yy} r={r} fill="#2478d4" opacity="0.7" />;
        })}
      </svg>
    </div>
  );
};

// ── Floating Particle (original) ───────────────────────────────────────────
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
    <div style={{
      position: 'absolute', left: `${x}%`, top: `${y}%`,
      width: size, height: size, borderRadius: '50%',
      background: isBlue ? '#2478d4' : '#6ab0d9',
      opacity,
      boxShadow: `0 0 ${size * 3}px ${isBlue ? 'rgba(36,120,212,0.5)' : 'rgba(106,176,217,0.4)'}`,
    }} />
  );
};

// ── Aurora Band ────────────────────────────────────────────────────────────
const AuroraBand: React.FC<{ seed: number; color: string }> = ({ seed, color }) => {
  const frame = useCurrentFrame();
  const yBase = seed * 33;
  const y = yBase + Math.sin(frame / 80 + seed * 2) * 4;
  const opacity = 0.07 + Math.sin(frame / 60 + seed) * 0.03;

  return (
    <div style={{
      position: 'absolute', left: '-20%', right: '-20%', top: `${y}%`,
      height: '25%',
      background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
      opacity,
      transform: `rotate(${Math.sin(frame / 120 + seed) * 1.5}deg)`,
    }} />
  );
};

// ── Sweep Line ─────────────────────────────────────────────────────────────
const SweepLine: React.FC<{ startFrame: number; fromRight?: boolean; top: string; opacity?: number }> = ({
  startFrame, fromRight, top, opacity = 0.5,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, startFrame + 45], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [startFrame + 55, startFrame + 100], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      position: 'absolute', top,
      left: fromRight ? 'auto' : 0,
      right: fromRight ? 0 : 'auto',
      width: `${progress * 100}%`, height: 1,
      background: fromRight
        ? 'linear-gradient(to left, transparent 0%, rgba(36,120,212,0.8) 60%, rgba(36,120,212,0.3) 100%)'
        : 'linear-gradient(to right, transparent 0%, rgba(36,120,212,0.8) 60%, rgba(36,120,212,0.3) 100%)',
      opacity: fadeOut * opacity,
    }} />
  );
};

// ── Decorative Ring ────────────────────────────────────────────────────────
const DecorRing: React.FC<{ size: number; x: string; y: string; delay: number }> = ({ size, x, y, delay }) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame: frame - delay, fps: 30, config: { damping: 120, stiffness: 60 } });
  const rotate = frame * 0.15;

  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: size, height: size,
      transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`,
      opacity: 0.18,
    }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 1} fill="none" stroke="#2478d4" strokeWidth="0.5" strokeDasharray="4 8" />
        <circle cx={size / 2} cy={size / 2} r={size / 3} fill="none" stroke="rgba(36,120,212,0.4)" strokeWidth="0.5" />
      </svg>
    </div>
  );
};

// ── Glowing Orb ────────────────────────────────────────────────────────────
const GlowOrb: React.FC<{ x: string; y: string; size: number; delay: number; color?: string }> = ({
  x, y, size, delay, color = 'rgba(36,120,212,0.18)',
}) => {
  const frame = useCurrentFrame();
  const pulse = 0.8 + Math.sin(frame / 55 + delay) * 0.2;
  const opacity = interpolate(frame, [delay, delay + 40], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: size, height: size,
      transform: `translate(-50%, -50%) scale(${pulse})`,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      opacity,
      pointerEvents: 'none',
    }} />
  );
};

// ── Main Composition ───────────────────────────────────────────────────────
export const HeroComposition: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const pulseScale = 0.92 + Math.sin(frame / 40) * 0.08;
  const pulseOpacity = 0.12 + Math.sin(frame / 40) * 0.04;
  const gradAngle = 130 + Math.sin(frame / 120) * 15;

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(${gradAngle}deg, #06091a 0%, #0d2547 35%, #1a3d6b 65%, #0d1e3c 100%)`,
      opacity: fadeIn,
      overflow: 'hidden',
    }}>
      {/* Aurora bands */}
      <AuroraBand seed={0.15} color="rgba(36,80,160,0.6)" />
      <AuroraBand seed={0.48} color="rgba(91,163,232,0.3)" />
      <AuroraBand seed={0.75} color="rgba(36,80,160,0.5)" />

      {/* Large radial glow center */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: `translate(-50%, -50%) scale(${pulseScale})`,
        width: 800, height: 800, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(26,61,107,0.4) 0%, rgba(13,30,60,0) 70%)',
        opacity: pulseOpacity * 5,
      }} />

      {/* Glowing orbs */}
      <GlowOrb x="15%"  y="25%"  size={350} delay={10} color="rgba(36,90,200,0.15)" />
      <GlowOrb x="85%"  y="70%"  size={400} delay={20} color="rgba(36,120,212,0.13)" />
      <GlowOrb x="80%"  y="18%"  size={280} delay={5}  color="rgba(70,150,220,0.1)" />
      <GlowOrb x="20%"  y="80%"  size={300} delay={35} color="rgba(36,80,180,0.12)" />

      {/* Body silhouette outlines */}
      <BodyOutline x="5%"   y="50%"  size={160} delay={22} />
      <BodyOutline x="95%"  y="50%"  size={130} delay={30} flip />

      {/* Animated vertebrae columns on sides */}
      <VerticalSpineDecor x="4%"  yStart="12%" delay={35} />
      <VerticalSpineDecor x="96%" yStart="15%" delay={45} />

      {/* Particles */}
      {Array.from({ length: 28 }, (_, i) => <Particle key={i} seed={i + 1} />)}

      {/* Sweep lines */}
      <SweepLine startFrame={5}   top="38%" />
      <SweepLine startFrame={20}  fromRight top="62%" opacity={0.4} />
      <SweepLine startFrame={70}  top="44%"  opacity={0.3} />
      <SweepLine startFrame={95}  fromRight top="56%" opacity={0.35} />
      <SweepLine startFrame={130} top="40%"  opacity={0.25} />
      <SweepLine startFrame={150} fromRight top="60%" opacity={0.2} />

      {/* Decorative rings */}
      <DecorRing size={140} x="12%" y="20%" delay={15} />
      <DecorRing size={80}  x="88%" y="78%" delay={25} />
      <DecorRing size={200} x="92%" y="18%" delay={8}  />

      {/* Corner brackets */}
      {[
        { top: 28,    left: 28,  bTop: true,    bLeft: true   },
        { top: 28,    right: 28, bTop: true,    bRight: true  },
        { bottom: 28, left: 28,  bBottom: true, bLeft: true   },
        { bottom: 28, right: 28, bBottom: true, bRight: true  },
      ].map((corner, i) => {
        const opacity = interpolate(frame, [30 + i * 8, 55 + i * 8], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        });
        return (
          <div key={i} style={{
            position: 'absolute',
            top: corner.top, bottom: corner.bottom,
            left: corner.left, right: corner.right,
            width: 50, height: 50,
            borderTop:    corner.bTop    ? '1px solid rgba(36,120,212,0.45)' : 'none',
            borderBottom: corner.bBottom ? '1px solid rgba(36,120,212,0.45)' : 'none',
            borderLeft:   corner.bLeft   ? '1px solid rgba(36,120,212,0.45)' : 'none',
            borderRight:  corner.bRight  ? '1px solid rgba(36,120,212,0.45)' : 'none',
            opacity,
          }} />
        );
      })}

      {/* Fine horizontal grid lines */}
      {[15, 30, 50, 70, 85].map((top, i) => (
        <div key={i} style={{
          position: 'absolute', left: 0, right: 0, top: `${top}%`,
          height: 1, background: 'rgba(36,120,212,0.04)',
        }} />
      ))}
    </AbsoluteFill>
  );
};
