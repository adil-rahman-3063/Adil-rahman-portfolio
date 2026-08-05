'use client';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [phase, setPhase] = useState('show'); // 'show' | 'fade' | 'done'

  useEffect(() => {
    // Start fading after 1.1s
    const fadeTimer = setTimeout(() => setPhase('fade'), 1100);
    // Unmount after fade completes (0.6s transition)
    const doneTimer = setTimeout(() => setPhase('done'), 1700);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'linear-gradient(160deg, #1A0A08 0%, #231513 60%, #2E1C19 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        opacity: phase === 'fade' ? 0 : 1,
        transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: phase === 'fade' ? 'none' : 'all',
      }}
    >
      {/* Monogram */}
      <div style={{ position: 'relative' }}>
        <svg
          width="72" height="72" viewBox="0 0 72 72" fill="none"
          style={{ animation: 'loaderPulse 1.4s ease-in-out infinite' }}
        >
          <circle cx="36" cy="36" r="34" stroke="rgba(141,110,99,0.2)" strokeWidth="1.5" />
          <circle
            cx="36" cy="36" r="34"
            stroke="#8D6E63" strokeWidth="1.5"
            strokeDasharray="213"
            strokeDashoffset="213"
            style={{ animation: 'loaderCircle 1.1s cubic-bezier(0.4, 0, 0.2, 1) forwards' }}
          />
          <text
            x="36" y="44"
            textAnchor="middle"
            fill="#EFEBE9"
            fontSize="26"
            fontFamily="'Special Elite', monospace"
            fontWeight="bold"
          >
            AR
          </text>
        </svg>
      </div>

      {/* Name */}
      <div style={{
        fontFamily: "'Special Elite', monospace",
        fontSize: '11px',
        color: '#8C7355',
        letterSpacing: '4px',
        textTransform: 'uppercase',
        animation: 'loaderFadeUp 0.6s 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
      }}>
        ADIL RAHMAN
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: '6px', animation: 'loaderFadeUp 0.6s 0.5s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            width: '5px', height: '5px',
            borderRadius: '50%',
            background: '#8D6E63',
            display: 'block',
            animation: `loaderDot 0.9s ${0.2 + i * 0.15}s ease-in-out infinite`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes loaderCircle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes loaderPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes loaderFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes loaderDot {
          0%, 100% { transform: scaleY(1); opacity: 0.4; }
          50%       { transform: scaleY(1.6); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
