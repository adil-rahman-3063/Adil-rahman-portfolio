'use client';
import { useEffect, useState, useRef } from 'react';

export default function LoadingScreen() {
  const [phase, setPhase] = useState('show'); // 'show' | 'fade' | 'done'
  const containerRef = useRef(null);

  useEffect(() => {
    // 1. Accessibility: Skip splash immediately if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 2. UX & Performance: Skip splash if already seen during this session
    const hasSeenSplash =
      typeof window !== 'undefined' &&
      Boolean(window.sessionStorage?.getItem('ar_splash_seen'));

    if (prefersReducedMotion || hasSeenSplash) {
      setPhase('done');
      return;
    }

    try {
      window.sessionStorage?.setItem('ar_splash_seen', '1');
    } catch (_) {
      // Ignore sessionStorage errors (e.g. strict private mode)
    }

    // 3. Initiate fade-out after brief branding reveal
    const fadeTimer = setTimeout(() => {
      setPhase('fade');
    }, 250);

    // 4. Failsafe timeout in case transitionend does not fire (e.g. background tab)
    const failsafeTimer = setTimeout(() => {
      setPhase('done');
    }, 1200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(failsafeTimer);
    };
  }, []);

  // 5. Event-driven unmount using native transitionend
  const handleTransitionEnd = (e) => {
    if (e.target === containerRef.current && e.propertyName === 'opacity') {
      setPhase('done');
    }
  };

  if (phase === 'done') return null;

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      onTransitionEnd={handleTransitionEnd}
      className={`ar-loading-screen ${phase === 'fade' ? 'ar-fade-out' : ''}`}
    >
      <span className="sr-only">Loading portfolio...</span>

      {/* Monogram */}
      <div className="ar-monogram-wrap">
        <svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          fill="none"
          className="ar-monogram-svg"
        >
          <circle
            cx="36"
            cy="36"
            r="34"
            stroke="rgba(141,110,99,0.2)"
            strokeWidth="1.5"
          />
          <circle
            cx="36"
            cy="36"
            r="34"
            stroke="#8D6E63"
            strokeWidth="1.5"
            strokeDasharray="213"
            strokeDashoffset="213"
            className="ar-circle-draw"
          />
          <text
            x="36"
            y="44"
            textAnchor="middle"
            fill="#EFEBE9"
            fontSize="26"
            fontFamily="'Special Elite', monospace"
            fontWeight="bold"
            className="ar-monogram-text"
          >
            AR
          </text>
        </svg>
      </div>

      {/* Name */}
      <div className="ar-brand-name">
        ADIL RAHMAN
      </div>

      {/* Pulsing Dots */}
      <div className="ar-dots-container" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="ar-dot"
            style={{ animationDelay: `${0.2 + i * 0.15}s` }}
          />
        ))}
      </div>

      <style>{`
        .ar-loading-screen {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: linear-gradient(160deg, #1A0A08 0%, #231513 60%, #2E1C19 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 24px;
          opacity: 1;
          transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: all;
        }

        .ar-loading-screen.ar-fade-out {
          opacity: 0;
          pointer-events: none;
        }

        .ar-monogram-wrap {
          position: relative;
        }

        .ar-monogram-svg {
          animation: loaderPulse 1.4s ease-in-out infinite;
        }

        .ar-circle-draw {
          animation: loaderCircle 1.1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .ar-brand-name {
          font-family: 'Special Elite', monospace;
          font-size: 11px;
          color: #8C7355;
          letter-spacing: 4px;
          text-transform: uppercase;
          animation: loaderFadeUp 0.6s 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .ar-dots-container {
          display: flex;
          gap: 6px;
          animation: loaderFadeUp 0.6s 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .ar-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #8D6E63;
          display: block;
          animation: loaderDot 0.9s ease-in-out infinite;
        }

        @keyframes loaderCircle {
          to { stroke-dashoffset: 0; }
        }

        @keyframes loaderPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* Modern individual CSS transforms */
        @keyframes loaderFadeUp {
          from {
            opacity: 0;
            translate: 0 8px;
          }
          to {
            opacity: 1;
            translate: 0 0;
          }
        }

        @keyframes loaderDot {
          0%, 100% {
            scale: 1 1;
            opacity: 0.4;
          }
          50% {
            scale: 1 1.6;
            opacity: 1;
          }
        }

        /* Screen reader utility */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Forced-colors / High Contrast mode */
        @media (forced-colors: active) {
          .ar-loading-screen {
            background: Canvas !important;
            forced-color-adjust: none;
          }
          .ar-circle-draw {
            stroke: CanvasText !important;
          }
          .ar-monogram-text {
            fill: CanvasText !important;
          }
          .ar-brand-name {
            color: CanvasText !important;
          }
          .ar-dot {
            background: CanvasText !important;
          }
        }

        /* Reduced motion: eliminate motion transformations */
        @media (prefers-reduced-motion: reduce) {
          .ar-loading-screen {
            transition: opacity 0.1s linear;
          }
          .ar-monogram-svg,
          .ar-circle-draw,
          .ar-brand-name,
          .ar-dots-container,
          .ar-dot {
            animation: none !important;
          }
          .ar-circle-draw {
            stroke-dashoffset: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
