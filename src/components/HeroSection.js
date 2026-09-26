'use client';
import React, { useEffect, useState, useRef } from 'react';
import TechMarquee from './TechMarquee';
import InteractiveChatSection from './InteractiveChatSection';

export default function HeroSection({ onAccessProjects, onContactMe, onGetQuote, onNavigateSection }) {
  const [logsLeft, setLogsLeft] = useState([]);
  const [logsRight, setLogsRight] = useState([]);

  // Refs for the 3 distinct viewports
  const landingRef = useRef(null);
  const chatRef = useRef(null);
  const servicesRef = useRef(null);

  const [landingVisible, setLandingVisible] = useState(true);
  const [chatVisible, setChatVisible] = useState(false);
  const [servicesVisible, setServicesVisible] = useState(false);

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
      '[client] user viewport: active',
      '[analytics] session started: 26d51d8d',
    ];

    const rightLogsList = [
      '[dart vm] connecting to dev service...',
      '[dart vm] debugger listening on ws://127.0.0.1:58115',
      '[flutter] building widget tree (hero_section.dart)...',
      '[flutter] frame count: 60fps stable',
      '[api] GET /api/v1/projects -> 200 OK (42ms)',
      '[api] GET /api/v1/experience -> 200 OK (28ms)',
      '[engine] rendering interface elements...',
      '[engine] dynamic scale calculated: 1.0',
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

  // Intersection Observer for the 3 Viewports to trigger fade in/out
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: [0.15, 0.4, 0.7],
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        const isVisible = entry.intersectionRatio >= 0.25;
        if (entry.target === landingRef.current) {
          setLandingVisible(isVisible);
        } else if (entry.target === chatRef.current) {
          setChatVisible(isVisible);
        } else if (entry.target === servicesRef.current) {
          setServicesVisible(isVisible);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    if (landingRef.current) observer.observe(landingRef.current);
    if (chatRef.current) observer.observe(chatRef.current);
    if (servicesRef.current) observer.observe(servicesRef.current);

    return () => observer.disconnect();
  }, []);

  const scrollToViewport = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
      title: 'E-Commerce Website Development',
      desc: 'Custom or Shopify e-commerce stores designed to convert visitors into customers.',
      quote: 'E-Commerce Website Development',
    },
  ];

  return (
    <div className="hero-viewport-stack">
      {/* Background Console Logs */}
      <div className="console-logs-layer">
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

      {/* ─────────────────────────────────────────────────────────────
          VIEWPORT 1: LANDING HERO VIEWPORT
      ───────────────────────────────────────────────────────────── */}
      <section
        ref={landingRef}
        className={`viewport-screen landing-screen ${landingVisible ? 'screen-active' : 'screen-faded'}`}
      >
        <div className="hero-content-wrapper">
          <div className="hero-avatar">
            <img
              src="/assets/Filipino_Freelance_Graphic_Designer_Instagram_Post-removebg-preview.png"
              alt="Adil Rahman Portrait"
              className="hero-avatar-img"
              fetchPriority="high"
              width="420"
              height="560"
              decoding="async"
            />
          </div>

          <div className="hero-text-block">
            <span className="hero-greeting">Adil Rahman</span>
            <h1 className="hero-headline">
              Your go-to developer
              <br />
              for App, Web & E-Commerce
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

        {/* Snapping Scroll Cue to Viewport 2 */}
        <button
          onClick={() => scrollToViewport(chatRef)}
          className="viewport-scroll-cue"
          aria-label="Scroll to AI Assistant"
        >
          <span className="cue-text">Ask AI Assistant</span>
          <span className="cue-arrow">↓</span>
        </button>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          VIEWPORT 2: INTERACTIVE CHAT SCREEN VIEWPORT
      ───────────────────────────────────────────────────────────── */}
      <section
        ref={chatRef}
        className={`viewport-screen chat-screen ${chatVisible ? 'screen-active' : 'screen-faded'}`}
      >
        <div className="viewport-inner-centered">
          <InteractiveChatSection
            onGetQuote={onGetQuote}
            onAccessProjects={onAccessProjects}
            onNavigateSection={onNavigateSection}
          />
        </div>

        {/* Snapping Scroll Cue to Viewport 3 */}
        <button
          onClick={() => scrollToViewport(servicesRef)}
          className="viewport-scroll-cue"
          aria-label="Scroll to Services"
        >
          <span className="cue-text">My Services</span>
          <span className="cue-arrow">↓</span>
        </button>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          VIEWPORT 3: SERVICES VIEWPORT & MARQUEE
      ───────────────────────────────────────────────────────────── */}
      <section
        ref={servicesRef}
        className={`viewport-screen services-screen ${servicesVisible ? 'screen-active' : 'screen-faded'}`}
      >
        <div className="services-container">
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
                  onClick={() => onGetQuote?.(s.quote)}
                  className="service-card-btn"
                >
                  Get a Quote
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee Ticker at the bottom of the Services Viewport */}
        <div className="marquee-wrapper">
          <TechMarquee />
        </div>
      </section>

      <style jsx global>{`
        .hero-viewport-stack {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* ─── FULL VIEWPORT SCREENS (SNAP & FADE) ─── */
        .viewport-screen {
          min-height: 100vh;
          min-height: 100dvh;
          width: 100%;
          scroll-snap-align: start;
          scroll-snap-stop: normal;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          box-sizing: border-box;
          padding: 80px 20px 40px;
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @media (min-width: 1100px) {
          .viewport-screen {
            padding: 100px 40px 60px;
          }
        }

        .screen-active {
          opacity: 1;
          transform: scale(1) translateY(0);
          filter: blur(0px);
          pointer-events: auto;
        }

        .screen-faded {
          opacity: 0.18;
          transform: scale(0.97) translateY(12px);
          filter: blur(1.5px);
          pointer-events: none;
        }

        .viewport-inner-centered {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Viewport Scroll Down Cue */
        .viewport-scroll-cue {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 11px;
          color: rgba(188, 170, 164, 0.7);
          transition: color 0.2s, transform 0.2s;
          z-index: 10;
        }

        .viewport-scroll-cue:hover {
          color: #FAF6EE;
          transform: translateX(-50%) translateY(2px);
        }

        .cue-arrow {
          font-size: 14px;
          animation: cueBounce 2s infinite ease-in-out;
        }

        @keyframes cueBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }

        /* Ambient Console Logs */
        .console-logs-layer {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.035;
          z-index: 0;
        }

        .logs-left,
        .logs-right {
          position: absolute;
          width: 320px;
          height: 220px;
          display: none;
          flex-direction: column;
          justify-content: flex-end;
          font-family: var(--font-mono);
          font-size: 11px;
          color: #BCAAA4;
          gap: 6px;
        }

        @media (min-width: 1200px) {
          .logs-left,
          .logs-right {
            display: flex;
          }
        }

        .logs-left {
          left: 40px;
          top: 120px;
          text-align: left;
        }

        .logs-right {
          right: 40px;
          top: 140px;
          text-align: right;
        }

        /* ─── SCREEN 1: HERO CONTENT ─── */
        .hero-content-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          width: 100%;
          max-width: 1400px;
          margin: auto 0;
          position: relative;
          z-index: 1;
        }

        @media (min-width: 1100px) {
          .hero-content-wrapper {
            flex-direction: row;
            align-items: center;
            gap: 60px;
          }
        }

        .hero-avatar {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          max-width: 320px;
        }

        @media (min-width: 1100px) {
          .hero-avatar {
            flex: 4;
            max-width: none;
            justify-content: flex-start;
          }
        }

        .hero-avatar-img {
          width: 100%;
          max-width: 320px;
          height: auto;
          max-height: 460px;
          object-fit: contain;
          filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.35));
        }

        @media (min-width: 1100px) {
          .hero-avatar-img {
            max-width: 440px;
            max-height: 560px;
          }
        }

        .hero-text-block {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          width: 100%;
        }

        @media (min-width: 1100px) {
          .hero-text-block {
            flex: 5;
          }
        }

        .hero-greeting {
          font-family: var(--font-handwritten);
          font-size: 22px;
          color: #8C7355;
          margin-bottom: 12px;
        }

        @media (min-width: 1100px) {
          .hero-greeting {
            font-size: 28px;
          }
        }

        .hero-headline {
          font-family: var(--font-header);
          font-size: 26px;
          color: #EFEBE9;
          font-weight: bold;
          line-height: 1.25;
          margin: 0 0 18px 0;
        }

        @media (min-width: 768px) {
          .hero-headline {
            font-size: 34px;
          }
        }

        @media (min-width: 1100px) {
          .hero-headline {
            font-size: 40px;
          }
        }

        .hero-description {
          font-family: var(--font-mono);
          font-size: 13px;
          color: #BCAAA4;
          line-height: 1.65;
          margin: 0 0 28px 0;
          max-width: 580px;
        }

        @media (min-width: 1100px) {
          .hero-description {
            font-size: 15px;
          }
        }

        .hero-cta-buttons {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .hero-btn-primary {
          background-color: #8D6E63;
          color: #FAF6EE;
          border: none;
          border-radius: 30px;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: bold;
          padding: 15px 28px;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(141, 110, 99, 0.3);
        }

        .hero-btn-primary:hover {
          background-color: #FAF6EE;
          color: #231513;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
        }

        @media (min-width: 1100px) {
          .hero-btn-primary {
            padding: 17px 32px;
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
          transition: color 0.2s;
        }

        .hero-btn-link:hover {
          color: #8C7355;
        }

        /* ─── SCREEN 2: CHAT SCREEN ─── */
        .chat-screen {
          justify-content: center;
        }

        /* ─── SCREEN 3: SERVICES SCREEN ─── */
        .services-screen {
          justify-content: space-between;
          padding-bottom: 0 !important;
        }

        .services-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 1100px;
          width: 100%;
          text-align: center;
          margin: auto 0;
          padding: 20px 0;
        }

        .services-title {
          font-family: var(--font-header);
          font-size: 34px;
          color: #EFEBE9;
          font-weight: 600;
          margin: 0 0 14px 0;
          letter-spacing: 0.5px;
        }

        @media (min-width: 768px) {
          .services-title {
            font-size: 44px;
          }
        }

        @media (min-width: 1100px) {
          .services-title {
            font-size: 52px;
          }
        }

        .services-subtitle {
          font-family: var(--font-mono);
          font-size: 13px;
          color: #BCAAA4;
          line-height: 1.55;
          max-width: 720px;
          margin: 0 auto 36px auto;
        }

        @media (min-width: 1100px) {
          .services-subtitle {
            font-size: 15px;
          }
        }

        .services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          width: 100%;
        }

        @media (min-width: 768px) {
          .services-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
          }
        }

        @media (min-width: 1100px) {
          .services-grid {
            gap: 24px;
          }
        }

        .service-card {
          background-color: rgba(59, 37, 33, 0.55);
          border: 1.5px solid rgba(232, 223, 208, 0.25);
          border-radius: 14px;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          width: 100%;
          transition: background-color 0.25s, border-color 0.25s, box-shadow 0.25s, transform 0.25s;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .service-card:hover {
          background-color: rgba(59, 37, 33, 0.85);
          border-color: #8D6E63;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
          transform: translateY(-4px);
        }

        .service-icon {
          font-size: 26px;
          background-color: rgba(141, 110, 99, 0.15);
          border: 1px solid rgba(141, 110, 99, 0.3);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .service-card-title {
          font-family: var(--font-header);
          font-size: 16px;
          color: #EFEBE9;
          font-weight: bold;
          margin: 0 0 10px 0;
          line-height: 1.3;
        }

        .service-card-desc {
          font-family: var(--font-mono);
          font-size: 12px;
          color: #BCAAA4;
          line-height: 1.5;
          margin: 0 0 22px 0;
          flex-grow: 1;
        }

        .service-card-btn {
          width: 100%;
          background: transparent;
          border: 1.5px solid #8D6E63;
          border-radius: 30px;
          color: #EFEBE9;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: bold;
          padding: 12px 0;
          cursor: pointer;
          transition: background-color 0.2s, color 0.2s, border-color 0.2s;
        }

        .service-card-btn:hover {
          background-color: #8D6E63;
          color: #FAF6EE;
          border-color: #8D6E63;
        }

        /* Marquee section at bottom of services viewport */
        .marquee-wrapper {
          width: 100%;
          position: relative;
          z-index: 1;
          margin-top: auto;
        }
      `}</style>
    </div>
  );
}
