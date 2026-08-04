'use client';
import React, { useEffect, useState, useRef } from 'react';
import TechMarquee from './TechMarquee';

export default function HeroSection({ scrollOffset, onAccessProjects, onContactMe, onGetQuote }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [logsLeft, setLogsLeft] = useState([]);
  const [logsRight, setLogsRight] = useState([]);

  // Responsive check
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1100);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Background Console Log simulator
  useEffect(() => {
    const leftLogsList = [
      '[system] initializing local dev server...',
      '[vite] v6.0.2 ready in 184ms',
      '[vite] local: http://localhost:5173/',
      '[compiler] compiling web entrypoint...',
      '[compiler] web entrypoint compiled successfully (482ms)',
      '[vite] hot update: main.dart recompiled',
      '[client] connected to WebSocket stream',
      '[client] mounting portfolio app...',
      '[client] state initialized successfully',
      '[client] user viewport: desktop (1920x1080)',
      '[analytics] session started: 26d51d8d',
    ];

    const rightLogsList = [
      '[dart vm] connecting to dev service...',
      '[dart vm] debugger listening on ws://127.0.0.1:58115',
      '[flutter] building widget tree (hero_section.dart)...',
      '[flutter] frame count: 60fps stable',
      '[api] GET /api/v1/projects -> 200 OK (42ms)',
      '[api] GET /api/v1/experience -> 200 OK (28ms)',
      '[engine] rendering silhouette fragments...',
      '[engine] current animation phase: mobile_frame',
      '[engine] dynamic scale calculated: 0.88',
      '[system] memory usage: 244MB / 8.0GB',
    ];

    setLogsLeft(leftLogsList.slice(0, 4));
    setLogsRight(rightLogsList.slice(0, 4));

    let idxLeft = 4;
    let idxRight = 4;

    const interval = setInterval(() => {
      setLogsLeft((prev) => {
        const next = [...prev, leftLogsList[idxLeft]];
        idxLeft = (idxLeft + 1) % leftLogsList.length;
        if (next.length > 8) next.shift();
        return next;
      });

      setLogsRight((prev) => {
        const next = [...prev, rightLogsList[idxRight]];
        idxRight = (idxRight + 1) % rightLogsList.length;
        if (next.length > 8) next.shift();
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Helper values for scroll calculation
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const seqHeight = vh * 3.5;
  const maxPinDistance = seqHeight - vh;
  const progress = Math.min(Math.max(scrollOffset / (maxPinDistance || 1), 0), 1);
  const pinnedOffset = Math.min(Math.max(scrollOffset, 0), maxPinDistance);

  // Animation interpolation helpers
  const getLocalP = (p, start, end) => {
    if (p < start) return 0.0;
    if (p > end) return 1.0;
    return (p - start) / (end - start);
  };

  const ease = (t) => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };

  const p1 = ease(getLocalP(progress, 0.0, 0.15));
  const p2 = ease(getLocalP(progress, 0.15, 0.25));
  const p3 = ease(getLocalP(progress, 0.25, 0.45));
  const p5 = ease(getLocalP(progress, 0.60, 0.75));

  const textOpacity = 1.0 - p1;
  const phoneOpacity = p2 * (1.0 - p5);

  // Render service cards grid
  const renderServiceCardsGrid = (opacityVal) => {
    const services = [
      {
        icon: '📱',
        title: 'Mobile App Development',
        desc: 'Custom iOS and Android apps built with Flutter for a flawless native experience.',
        quote: 'Mobile App Development',
      },
      {
        icon: '🌐',
        title: 'Web Development',
        desc: 'High-performance business websites and scalable web applications.',
        quote: 'Web Development',
      },
      {
        icon: '🏪',
        title: 'Shopify Store Setup',
        desc: 'Custom e-commerce stores designed to convert visitors into customers.',
        quote: 'Shopify Store Setup',
      },
    ];

    return (
      <div className="services-container" style={{ opacity: opacityVal }}>
        <h2 className="services-title">My services.</h2>
        <p className="services-subtitle">
          From scalable architecture to seamless user experiences, I offer end-to-end development solutions designed to elevate your business. Whether you need a native mobile app, a complex web platform, or a high-converting e-commerce store, I bring your ideas to life.
        </p>

        <div className="services-grid">
          {services.map((s, idx) => (
            <div key={idx} className="service-card">
              <div className="service-icon">{s.icon}</div>
              <h3 className="service-card-title">{s.title}</h3>
              <p className="service-card-desc">{s.desc}</p>
              <button
                disabled={opacityVal < 0.5}
                onClick={() => onGetQuote?.(s.quote)}
                className="service-card-btn"
              >
                Get a Quote
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Static/Mobile Hero Content
  const renderStaticHeroContent = (textOp, avatarOp, offsetDx = 0) => {
    return (
      <div className="hero-content-wrapper" style={{ opacity: textOp }}>
        <div
          className="hero-avatar"
          style={{
            transform: `translateX(${offsetDx}px)`,
            opacity: avatarOp,
          }}
        >
          <img
            src="/assets/Filipino_Freelance_Graphic_Designer_Instagram_Post-removebg-preview.png"
            alt="Adil Rahman Portrait"
            className="hero-avatar-img"
          />
        </div>

        <div className="hero-text-block">
          <span className="hero-greeting">Adil Rahman</span>
          <h1 className="hero-headline">
            Your go-to developer
            <br />
            for App, Web & Shopify
            <br />
            solutions
          </h1>
          <p className="hero-description">
            Bringing your ideas to life by building fast, modern applications,
            business websites, and custom e-commerce stores that help startups
            and businesses launch quickly.
          </p>
          <div className="hero-cta-buttons">
            <button onClick={onContactMe} className="hero-btn-primary">
              Contact me
            </button>
            <button onClick={onAccessProjects} className="hero-btn-link">
              View projects
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Flying fragments definition & animation logic
  const getFragmentStyle = (f, p3Val, p5Val) => {
    // interpolation calculations matching flutter's _AnimatedBuildSequence layout
    const startX = f.mX;
    const startY = f.mY;
    const startW = f.mW;
    const startH = f.mH;

    const endX = f.dX;
    const endY = f.dY;
    const endW = f.dW;
    const endH = f.dH;

    // Explode positions
    const explodeRadius = f.explodeRadius;
    const explodeAngle = f.explodeAngle;
    const expX = (typeof window !== 'undefined' ? window.innerWidth : 1200) / 2 + Math.cos(explodeAngle) * explodeRadius;
    const expY = (typeof window !== 'undefined' ? window.innerHeight : 800) / 2 + Math.sin(explodeAngle) * explodeRadius;

    let currentX, currentY, currentW, currentH;
    let isCode = false;
    let rotation = 0;
    let opacity = 1.0;

    if (p3Val > 0.0 && p3Val < 1.0) {
      if (p3Val < 0.5) {
        const t = p3Val * 2;
        currentX = startX + (expX - startX) * t;
        currentY = startY + (expY - startY) * t;
        currentW = startW + (80 - startW) * t;
        currentH = startH + (80 - startH) * t;
        isCode = t > 0.5;
        rotation = t * 180;
      } else {
        const t = (p3Val - 0.5) * 2;
        currentX = expX + (endX - expX) * t;
        currentY = expY + (endY - expY) * t;
        currentW = 80 + (endW - 80) * t;
        currentH = 80 + (endH - 80) * t;
        isCode = t < 0.5;
        rotation = (1.0 - t) * 180;
      }
    } else if (p3Val === 1.0) {
      currentX = endX;
      currentY = endY;
      currentW = endW;
      currentH = endH;
      if (p5Val > 0.0) {
        const expX2 = window.innerWidth / 2 + Math.cos(explodeAngle + Math.PI) * explodeRadius;
        const expY2 = window.innerHeight / 2 + Math.sin(explodeAngle + Math.PI) * explodeRadius;
        currentX = endX + (expX2 - endX) * p5Val;
        currentY = endY + (expY2 - endY) * p5Val;
        rotation = p5Val * 180;
        opacity = 1.0 - p5Val;
        isCode = p5Val > 0.2;
      }
    } else {
      currentX = startX;
      currentY = startY;
      currentW = startW;
      currentH = startH;
    }

    return {
      position: 'absolute',
      left: `${currentX - currentW / 2}px`,
      top: `${currentY - currentH / 2}px`,
      width: `${currentW}px`,
      height: `${currentH}px`,
      transform: `rotate(${rotation}deg)`,
      opacity: opacity,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'none',
      zIndex: 10,
      pointerEvents: 'none',
      ...(isCode
        ? {
            backgroundColor: 'rgba(232, 223, 208, 0.3)',
            border: '1.5px solid #8D6E63',
            borderRadius: '16px',
          }
        : {}),
    };
  };



  // Pinned desktop sequence layout
  const cx = (typeof window !== 'undefined' ? window.innerWidth : 1200) / 2;
  const cy = (typeof window !== 'undefined' ? window.innerHeight : 800) / 2;

  // Fragments matching Flutter definition relative to center cx, cy
  const fragments = [
    {
      mX: cx + 40,
      mY: cy - 280,
      mW: 60,
      mH: 24,
      dX: cx + 180,
      dY: cy - 200,
      dW: 300,
      dH: 24,
      codeSymbol: '</>',
      explodeAngle: 0.2 * Math.PI,
      explodeRadius: 420,
      render: (isMob) =>
        isMob ? (
          <span className="frag-icon">☰</span>
        ) : (
          <div className="frag-menu">
            <span>HOME</span>
            <span>ABOUT</span>
            <span>EXPERIENCE</span>
            <span>PROJECTS</span>
          </div>
        ),
    },
    {
      mX: cx - 100,
      mY: cy - 280,
      mW: 48,
      mH: 48,
      dX: cx - 400,
      dY: cy - 200,
      dW: 48,
      dH: 48,
      codeSymbol: '{ }',
      explodeAngle: 0.8 * Math.PI,
      explodeRadius: 360,
      render: () => <div className="frag-avatar-initials">AR</div>,
    },
    {
      mX: cx + 100,
      mY: cy - 100,
      mW: 130,
      mH: 130,
      dX: cx - 280,
      dY: cy + 20,
      dW: 240,
      dH: 240,
      codeSymbol: '[]',
      explodeAngle: 1.2 * Math.PI,
      explodeRadius: 460,
      render: () => (
        <img
          src="/assets/Filipino_Freelance_Graphic_Designer_Instagram_Post-removebg-preview.png"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          alt="Avatar fragment"
        />
      ),
    },
    {
      mX: cx,
      mY: cy + 70,
      mW: 232,
      mH: 100,
      dX: cx + 100,
      dY: cy - 60,
      dW: 380,
      dH: 80,
      codeSymbol: '=>',
      explodeAngle: 1.6 * Math.PI,
      explodeRadius: 500,
      render: () => (
        <span className="frag-headline">
          Your go-to developer for App, Web & Shopify solutions
        </span>
      ),
    },
    {
      mX: cx,
      mY: cy + 150,
      mW: 232,
      mH: 60,
      dX: cx + 100,
      dY: cy + 30,
      dW: 380,
      dH: 60,
      codeSymbol: '()',
      explodeAngle: 0.5 * Math.PI,
      explodeRadius: 400,
      render: () => (
        <span className="frag-desc">
          Bringing your ideas to life by building fast, modern applications, business websites, and custom e-commerce stores that help startups and businesses launch quickly.
        </span>
      ),
    },
    {
      mX: cx,
      mY: cy + 214,
      mW: 140,
      mH: 48,
      dX: cx - 20,
      dY: cy + 104,
      dW: 160,
      dH: 48,
      codeSymbol: '< >',
      explodeAngle: 1.8 * Math.PI,
      explodeRadius: 440,
      render: () => <div className="frag-btn-mock">Contact me</div>,
    },
  ];

  // Dynamic frame dimensions morphing phone -> browser
  const frameWidth = 280 + (880 - 280) * p3;
  const frameHeight = 640 + (520 - 640) * p3;
  const frameRadius = 56 + (20 - 56) * p3;

  return (
    <>
      {!isDesktop ? (
        <div className="hero-section-static">
          {renderStaticHeroContent(1.0, 1.0)}
          <div style={{ height: '40px' }} />
          <TechMarquee />
        </div>
      ) : (
        <div className="hero-sequence-container" style={{ height: `${seqHeight}px` }}>
          <div className="hero-pinned-viewport" style={{ top: 0 }}>
            {/* Background Logs */}
            {progress < 0.75 && (
              <div className="console-logs-layer" style={{ opacity: (1.0 - p5) * 0.02 }}>
                <div className="logs-left">
                  {logsLeft.map((l, idx) => (
                    <div key={idx}>{l}</div>
                  ))}
                </div>
                <div className="logs-right">
                  {logsRight.map((l, idx) => (
                    <div key={idx}>{l}</div>
                  ))}
                </div>
              </div>
            )}

            {/* 1. Static intro text (fading out) */}
            {textOpacity > 0 && (
              <div className="static-intro-wrapper">
                {renderStaticHeroContent(textOpacity, textOpacity, (cx - (window.innerWidth * 3) / 8 / 2) * p1)}
              </div>
            )}

            {/* 2. Pinned Animated Sequence Mockups */}
            {progress > 0.15 && progress < 0.75 && (
              <div className="morph-sequence-wrapper" style={{ opacity: phoneOpacity }}>
                {/* Outline Frame Mockup */}
                <div
                  className="morphing-frame"
                  style={{
                    width: `${frameWidth}px`,
                    height: `${frameHeight}px`,
                    borderRadius: `${frameRadius}px`,
                    left: `${cx - frameWidth / 2}px`,
                    top: `${cy - frameHeight / 2}px`,
                  }}
                >
                  {p3 < 0.95 && (
                    <div className="phone-status-bar" style={{ opacity: 1.0 - p3 }}>
                      <div className="dynamic-island" />
                      <span className="status-time">09:41</span>
                      <span className="status-icons">📶 🔋</span>
                    </div>
                  )}
                </div>

                {/* Render Flying Fragments */}
                {fragments.map((f, idx) => {
                  const isCodeStyle = progress > 0.25 && progress < 0.45 && p3 > 0.1 && p3 < 0.9;
                  const fStyle = getFragmentStyle(f, p3, p5);

                  return (
                    <div key={idx} style={fStyle}>
                      {isCodeStyle ? (
                        <span className="frag-code-symbol">{f.codeSymbol}</span>
                      ) : (
                        f.render(p3 < 0.5)
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Dynamic scroll text explanations */}
            {progress > 0.15 && progress < 0.75 && (
              <div className="scroll-captions" style={{ opacity: phoneOpacity }}>
                {p3 < 0.4 && <div className="caption-text">FLUTTER · DART</div>}
                {p3 >= 0.4 && p3 < 0.8 && <div className="caption-text">FLUTTER · REACT · WEB</div>}
                {p3 >= 0.8 && <div className="caption-text">APP · WEB · COMMERCE</div>}
              </div>
            )}

            {/* 3. Services card grid shown on frame exit */}
            {progress > 0.6 && (
              <div className="services-scroller">
                {renderServiceCardsGrid(p5)}
              </div>
            )}

            {/* Persistent bottom marquee */}
            <div
              className="marquee-wrapper"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                opacity: p5 > 0 ? 1.0 : 1.0 - p1,
              }}
            >
              <TechMarquee />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Desktop Pinned Layout */
        .hero-sequence-container {
          position: relative;
          width: 100%;
          overflow: visible;
        }

        .hero-pinned-viewport {
          position: sticky;
          height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        /* Static Layout Styles */
        .hero-section-static {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding-top: 40px;
        }

        .hero-content-wrapper {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 40px;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (min-width: 1100px) {
          .hero-content-wrapper {
            flex-direction: row;
            align-items: center;
            height: 100%;
          }
        }

        .hero-avatar {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
          width: 100%;
        }

        @media (min-width: 1100px) {
          .hero-avatar {
            flex: 3;
            height: 700px;
            justify-content: flex-start;
          }
        }

        .hero-avatar-img {
          height: 100%;
          max-height: 400px;
          object-fit: contain;
        }

        @media (min-width: 1100px) {
          .hero-avatar-img {
            max-height: 700px;
            transform: translate(-80px, -20px);
          }
        }

        .hero-text-block {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        @media (min-width: 1100px) {
          .hero-text-block {
            flex: 5;
          }
        }

        .hero-greeting {
          font-family: var(--font-handwritten);
          font-size: 18px;
          color: #8C7355;
          margin-bottom: 12px;
        }

        @media (min-width: 1100px) {
          .hero-greeting {
            font-size: 24px;
          }
        }

        .hero-headline {
          font-family: var(--font-header);
          font-size: 22px;
          color: #EFEBE9;
          font-weight: bold;
          line-height: 1.2;
          margin: 0 0 20px 0;
        }

        @media (min-width: 1100px) {
          .hero-headline {
            font-size: 36px;
          }
        }

        .hero-description {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #BCAAA4;
          line-height: 1.6;
          margin: 0 0 32px 0;
        }

        @media (min-width: 1100px) {
          .hero-description {
            font-size: 14px;
          }
        }

        .hero-cta-buttons {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .hero-btn-primary {
          background-color: #8D6E63;
          color: #FAF6EE;
          border: none;
          border-radius: 30px;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: bold;
          padding: 16px 26px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .hero-btn-primary:hover {
          background-color: #FAF6EE;
          color: #231513;
        }
        @media (min-width: 1100px) {
          .hero-btn-primary {
            padding: 18px 32px;
            font-size: 14px;
          }
        }

        .hero-btn-link {
          background: transparent;
          border: none;
          color: #FAF6EE;
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: bold;
          text-decoration: underline;
          cursor: pointer;
        }
        @media (min-width: 1100px) {
          .hero-btn-link {
            font-size: 15px;
          }
        }

        /* Console Logs Styles */
        .console-logs-layer {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.04;
        }

        .logs-left, .logs-right {
          position: absolute;
          width: 320px;
          height: 220px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          font-family: var(--font-mono);
          font-size: 11px;
          color: #BCAAA4;
          gap: 6px;
        }

        .logs-left {
          left: 40px;
          bottom: 120px;
          text-align: left;
        }

        .logs-right {
          right: 40px;
          top: 140px;
          text-align: right;
        }

        /* Morphing Sequence Styles */
        .static-intro-wrapper {
          position: absolute;
          top: 0;
          left: 60px;
          right: 60px;
          height: 100%;
          display: flex;
          align-items: center;
        }

        .morph-sequence-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }

        .morphing-frame {
          position: absolute;
          border: 3px solid #8D6E63;
          background-color: rgba(59, 37, 33, 0.35);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          transition: none;
        }

        .phone-status-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          padding: 8px 24px;
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 11px;
          color: #EFEBE9;
        }

        .dynamic-island {
          position: absolute;
          top: 17px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 22px;
          border-radius: 12px;
          background-color: #231513;
          border: 1px solid rgba(232, 223, 208, 0.2);
        }

        /* Fragment Items Stylings */
        .frag-icon {
          font-size: 24px;
          color: #BCAAA4;
        }

        .frag-menu {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          font-family: var(--font-mono);
          font-size: 14px;
          color: #BCAAA4;
          width: 100%;
        }

        .frag-avatar-initials {
          width: 100%;
          height: 100%;
          background-color: #8D6E63;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-header);
          font-size: 20px;
          color: #FAF6EE;
        }

        .frag-headline {
          font-family: var(--font-header);
          font-size: 22px;
          color: #EFEBE9;
          font-weight: bold;
          text-align: center;
          line-height: 1.1;
        }

        .frag-desc {
          font-family: var(--font-mono);
          font-size: 12px;
          color: #BCAAA4;
          text-align: center;
          line-height: 1.5;
        }

        .frag-btn-mock {
          width: 100%;
          height: 100%;
          background-color: rgba(232, 223, 208, 0.3);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          color: #EFEBE9;
          font-size: 16px;
        }

        .frag-code-symbol {
          font-family: var(--font-mono);
          font-size: 28px;
          color: #8D6E63;
          font-weight: bold;
        }

        .scroll-captions {
          position: absolute;
          width: 100%;
          text-align: center;
          bottom: 12%;
          left: 0;
        }

        .caption-text {
          font-family: var(--font-mono);
          font-size: 16px;
          color: #BCAAA4;
          letter-spacing: 2px;
          font-weight: bold;
        }

        /* Services cards */
        .services-scroller {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
        }

        .services-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 1000px;
          padding: 40px 24px;
          text-align: center;
        }

        .services-title {
          font-family: var(--font-header);
          font-size: 54px;
          color: #EFEBE9;
          font-weight: 600;
          margin: 0 0 12px 0;
        }

        @media (min-width: 1100px) {
          .services-title {
            font-size: 60px;
          }
        }

        .services-subtitle {
          font-family: var(--font-mono);
          font-size: 16px;
          color: #BCAAA4;
          line-height: 1.25;
          max-width: 700px;
          margin: 0 auto 48px auto;
        }

        @media (min-width: 1100px) {
          .services-subtitle {
            font-size: 18px;
          }
        }

        .services-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
        }

        @media (min-width: 900px) {
          .services-grid {
            flex-direction: row;
            justify-content: center;
          }
        }

        .service-card {
          background-color: rgba(59, 37, 33, 0.6);
          border: 1.5px solid rgba(232, 223, 208, 0.4);
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          width: 100%;
          transition: background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
        }

        @media (min-width: 900px) {
          .service-card {
            width: 280px;
          }
        }

        .service-card:hover {
          background-color: rgba(59, 37, 33, 0.9);
          border-color: #8D6E63;
          box-shadow: 0 4px 10px rgba(141, 110, 99, 0.1);
        }

        .service-icon {
          font-size: 28px;
          background-color: rgba(141, 110, 99, 0.1);
          padding: 12px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .service-card-title {
          font-family: var(--font-header);
          font-size: 16px;
          color: #EFEBE9;
          font-weight: bold;
          margin: 0 0 12px 0;
        }

        .service-card-desc {
          font-family: var(--font-mono);
          font-size: 12px;
          color: #BCAAA4;
          line-height: 1.5;
          margin: 0 0 24px 0;
        }

        .service-card-btn {
          width: 100%;
          background: transparent;
          border: 1.5px solid #8D6E63;
          border-radius: 30px;
          color: #8D6E63;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: bold;
          padding: 16px 0;
          cursor: pointer;
          transition: background-color 0.2s, color 0.2s;
        }

        .service-card:hover .service-card-btn {
          background-color: #8D6E63;
          color: #FAF6EE;
        }
      `}</style>
    </>
  );
}
