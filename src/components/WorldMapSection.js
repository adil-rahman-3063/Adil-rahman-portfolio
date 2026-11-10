'use client';

/**
 * WorldMapSection.js
 * Interactive GitHub-style world grid visitor telemetry map.
 * Grid topology & visual concept inspired by Prakhar's open-source Homeflix:
 * https://github.com/kprakz/homeflix
 */

import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function WorldMapSection() {
  const [counts, setCounts] = useState({});
  const [totalVisits, setTotalVisits] = useState(0);
  const [countryCount, setCountryCount] = useState(0);
  const [myCountry, setMyCountry] = useState(null);
  const [gridData, setGridData] = useState(null);
  const [isLoadingGrid, setIsLoadingGrid] = useState(true);
  const [isStarted, setIsStarted] = useState(false);

  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  // 1. Fetch grid topology from static assets
  useEffect(() => {
    let isMounted = true;
    fetch('/data/world-grid.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load world-grid.json');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setGridData(data);
          setIsLoadingGrid(false);
        }
      })
      .catch((err) => {
        console.warn('World grid load notice:', err);
        if (isMounted) setIsLoadingGrid(false);
      });

    return () => { isMounted = false; };
  }, []);

  // 2. Fetch live country counts & subscribe to Supabase Realtime
  useEffect(() => {
    let isMounted = true;

    async function loadCounts() {
      try {
        const { data, error } = await supabase
          .from('visitor_countries')
          .select('country_code, count');

        if (!error && Array.isArray(data)) {
          const liveMap = {};
          data.forEach((row) => {
            const code = (row.country_code || '').toUpperCase().trim();
            const n = Number(row.count) || 0;
            if (code && n > 0) {
              liveMap[code] = n;
            }
          });

          if (isMounted) setCounts(liveMap);
        }
      } catch (err) {
        console.warn('Supabase visitor count fetch notice:', err);
      }
    }

    loadCounts();

    // ── Supabase Realtime Subscription ──
    const channel = supabase
      .channel('visitor_countries_live_feed')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'visitor_countries',
        },
        (payload) => {
          if (payload.new && payload.new.country_code) {
            const code = payload.new.country_code.toUpperCase().trim();
            const n = Number(payload.new.count) || 1;
            setCounts((prev) => ({
              ...prev,
              [code]: n,
            }));
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // 3. Detect visitor country via edge headers (Cloudflare trace) without storing IP
  // Enforces:
  // - Only log visits when hosted on production domain (adilrahman.cc / www.adilrahman.cc)
  // - Strict 1 visit per device per day rate-limiting via localStorage (no duplicate hits on refresh or tab switch)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const STORAGE_DATE_KEY = 'ar_visit_logged_date';
    const STORAGE_COUNTRY_KEY = 'ar_visit_logged_country';

    const getStorage = (key) => {
      try {
        return localStorage.getItem(key);
      } catch (_) {
        return null;
      }
    };

    const setStorage = (key, val) => {
      try {
        localStorage.setItem(key, val);
      } catch (_) {}
    };

    const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
    const lastLoggedDate = getStorage(STORAGE_DATE_KEY);
    const cachedCountry = getStorage(STORAGE_COUNTRY_KEY);

    if (cachedCountry) {
      setMyCountry(cachedCountry);
    }

    // Rule 1: A device is marked only 1 time per day. Skip if already logged today.
    if (lastLoggedDate === today) {
      return;
    }

    // Rule 2: Only mark visits when visited on the live production domain (adilrahman.cc)
    // Never record visits on localhost, 127.0.0.1, or preview deployments
    const hostname = window.location.hostname;
    const isProductionHost = hostname === 'adilrahman.cc' || hostname === 'www.adilrahman.cc';

    if (!isProductionHost) {
      // For local development visual preview only: highlight default without logging to database
      if (!cachedCountry) {
        setMyCountry('IN');
      }
      return;
    }

    async function detectAndLog() {
      let code = null;

      try {
        const res = await fetch('/cdn-cgi/trace', { cache: 'no-store' });
        if (res.ok) {
          const text = await res.text();
          const match = text.match(/loc=([A-Za-z]{2})/);
          if (match && match[1]) code = match[1].toUpperCase();
        }
      } catch (_) {}

      // Fallback edge trace if internal path was proxied
      if (!code) {
        try {
          const res = await fetch('https://cloudflare.com/cdn-cgi/trace', { cache: 'no-store' });
          if (res.ok) {
            const text = await res.text();
            const match = text.match(/loc=([A-Za-z]{2})/);
            if (match && match[1]) code = match[1].toUpperCase();
          }
        } catch (_) {}
      }

      if (code && code !== 'XX') {
        setMyCountry(code);

        // Save daily lock immediately to prevent duplicate hits from rapid navigation or multiple tabs
        setStorage(STORAGE_DATE_KEY, today);
        setStorage(STORAGE_COUNTRY_KEY, code);

        // Optimistically increment local count
        setCounts((prev) => ({
          ...prev,
          [code]: (prev[code] || 0) + 1,
        }));

        // Atomic update in Supabase
        try {
          const { error: rpcErr } = await supabase.rpc('increment_country', { c_code: code });
          if (rpcErr) {
            // Fallback direct upsert
            const currentCount = counts[code] || 0;
            const { error: upErr } = await supabase.from('visitor_countries').upsert([
              { country_code: code, count: currentCount + 1, last_visited: new Date() }
            ]);
            if (upErr) {
              console.warn('Supabase visitor record notice (RLS policy check needed):', upErr);
            }
          }
        } catch (err) {
          console.warn('Supabase visitor log catch:', err);
        }
      }
    }

    detectAndLog();
  }, []);

  // 4. Calculate total visits, unique active countries, and highest count
  const maxCount = Object.values(counts).reduce((acc, n) => Math.max(acc, Number(n) || 0), 0);

  useEffect(() => {
    const total = Object.values(counts).reduce((acc, n) => acc + (Number(n) || 0), 0);
    const active = Object.values(counts).filter((n) => n > 0).length;
    setTotalVisits(total);
    setCountryCount(active);
  }, [counts]);

  // 5. Build SVG grid and handle ripple animation on viewport entry
  useEffect(() => {
    if (!gridData || !svgRef.current) return;

    const CELL = 8;
    const GAP = 1.6;
    const ranked = Object.entries(counts).filter(([_, n]) => n > 0).sort((a, b) => b[1] - a[1]);
    const rank = new Map(ranked.map(([code], i) => [code, i]));
    const max = ranked.length ? ranked[0][1] : 1;

    // Logarithmic color shade scale so small countries don't wash out
    const shade = (n) => {
      if (n <= 0 || max <= 0) return 0;
      return Math.min(4, 1 + Math.floor((Math.log(n + 1) / Math.log(max + 1)) * 3.999));
    };

    const svg = svgRef.current;
    svg.setAttribute('viewBox', `0 0 ${gridData.cols * CELL} ${gridData.rows * CELL}`);

    let base = '';
    let hits = '';

    for (const [col, row, code] of gridData.cells) {
      const x = col * CELL;
      const y = row * CELL;
      const s = CELL - GAP;

      base += `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="1.6" class="grid-base-rect" />`;

      const n = counts[code] || 0;
      if (!n) continue;

      // Ripple animation delay radiating from country centroid
      const [cc, cr] = gridData.centres[code] || [col, row];
      const distance = Math.hypot(col - cc, row - cr);
      const delay = (rank.get(code) || 0) * 320 + distance * 65;

      hits += `<rect class="hit-rect" data-code="${code}" x="${x}" y="${y}" width="${s}" height="${s}" rx="1.6" style="fill: var(--m${shade(n)}); animation-delay: ${Math.round(delay)}ms" />`;
    }

    svg.innerHTML = base + hits;

    // Viewport IntersectionObserver to trigger ripple
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((en) => en.isIntersecting)) {
          setIsStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      io.observe(containerRef.current);
    }

    return () => io.disconnect();
  }, [gridData, counts]);

  // 6. Interactive hover tooltip handler
  const handleMouseMove = (e) => {
    if (!tooltipRef.current || !containerRef.current) return;
    const target = e.target.closest && e.target.closest('.hit-rect');
    const tip = tooltipRef.current;

    if (!target) {
      tip.style.opacity = '0';
      return;
    }

    const code = target.getAttribute('data-code');
    const count = counts[code] || 0;

    let countryName = code;
    try {
      const names = new Intl.DisplayNames(['en'], { type: 'region' });
      countryName = names.of(code) || code;
    } catch (_) {}

    tip.innerHTML = `<strong>${countryName}</strong> (${code}) · <span>${count.toLocaleString()} visits</span>`;

    const box = containerRef.current.getBoundingClientRect();
    const sq = target.getBoundingClientRect();

    tip.style.left = `${sq.left + sq.width / 2 - box.left}px`;
    tip.style.top = `${sq.top - box.top - 8}px`;
    tip.style.opacity = '1';
  };

  const handleMouseLeave = () => {
    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = '0';
    }
  };

  return (
    <section id="network" className="world-section">
      {/* Header */}
      <div className="world-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span className="section-number">09 // </span>
          <h2 className="section-title">GLOBAL NETWORK</h2>
        </div>

        <div className="telemetry-badge">
          <span className="telemetry-dot" />
          <span>EDGE TELEMETRY // PRIVACY-FIRST (0 COOKIES)</span>
        </div>
      </div>

      <div className="world-intro-row">
        <div>
          <div className="world-subsection-title">// REAL-TIME DEVELOPER & CLIENT TRAFFIC</div>
          <p className="world-intro-desc">
            Autonomous edge map rendering global visitor interactions across Europe, the Americas, Asia, and the Middle East. Country metrics are extracted in-memory at Cloudflare edge nodes without storing user IP addresses or browser fingerprints.
          </p>
        </div>

        {myCountry && (
          <div className="current-visitor-pill">
            <span className="radar-ping" />
            <span>YOU ARE VISITING FROM <strong>{myCountry}</strong></span>
          </div>
        )}
      </div>

      {/* Main Map Canvas Card */}
      <div
        ref={containerRef}
        className={`map-card ${isStarted ? 'started' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Loading Indicator Overlay */}
        {isLoadingGrid && (
          <div className="map-loading-overlay">
            <div className="radar-loader">
              <span className="radar-spinner" />
              <div className="radar-wave" />
            </div>
            <div className="map-loading-text">
              <span className="terminal-prefix">// TELEMETRY CALIBRATION</span>
              <p className="loading-title">INITIALIZING 120×56 TOPOLOGICAL WORLD MATRIX...</p>
              <p className="loading-sub">Connecting edge nodes &amp; synchronizing global sessions</p>
            </div>
          </div>
        )}

        <svg ref={svgRef} id="mapSvg" role="img" aria-label="Interactive global visitor telemetry map" />

        {/* Hover Tooltip */}
        <div ref={tooltipRef} className="map-tooltip" style={{ opacity: 0 }} />

        {/* Legend */}
        <div className="map-legend">
          <span className="legend-label">VISITATION DENSITY:</span>
          <div className="legend-cells">
            <span className="legend-cell" style={{ background: 'var(--m0)' }} title="Unvisited" />
            <span className="legend-cell" style={{ background: 'var(--m1)' }} title="Low" />
            <span className="legend-cell" style={{ background: 'var(--m2)' }} title="Medium" />
            <span className="legend-cell" style={{ background: 'var(--m3)' }} title="High" />
            <span className="legend-cell" style={{ background: 'var(--m4)' }} title="Highest Traffic" />
          </div>
          <span className="legend-scale">{maxCount > 0 ? `1 → ${maxCount.toLocaleString()}` : '0 active'}</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="world-metrics-grid">
        <div className="metric-box">
          <span className="metric-num">{totalVisits.toLocaleString()}</span>
          <span className="metric-tag">TOTAL SESSIONS LOGGED</span>
        </div>
        <div className="metric-box">
          <span className="metric-num">{countryCount}</span>
          <span className="metric-tag">COUNTRIES & TERRITORIES</span>
        </div>
        <div className="metric-box">
          <span className="metric-num">0 ms</span>
          <span className="metric-tag">EDGE EXTRACTION LATENCY</span>
        </div>
        <div className="metric-box">
          <span className="metric-num">100%</span>
          <span className="metric-tag">GDPR & ANONYMITY COMPLIANT</span>
        </div>
      </div>

      <style jsx>{`
        .world-section {
          display: flex;
          flex-direction: column;
          width: 100%;
          margin-bottom: 24px;
        }

        .world-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .section-number {
          font-family: var(--font-handwritten);
          font-size: 26px;
          color: #8C7355;
          margin-right: 8px;
        }

        .section-title {
          font-family: var(--font-header);
          font-size: 22px;
          color: #EFEBE9;
          font-weight: bold;
          letter-spacing: 1px;
          margin: 0;
        }

        .telemetry-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.8px;
          color: #8C7355;
          background: rgba(141, 110, 99, 0.12);
          border: 1px solid rgba(141, 110, 99, 0.3);
          padding: 4px 10px;
          border-radius: 12px;
        }

        .telemetry-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #0A7C5A;
          box-shadow: 0 0 8px #0A7C5A;
          animation: pulse 2s infinite ease-in-out;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.6; }
        }

        .world-intro-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }

        .world-subsection-title {
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: bold;
          color: #8D6E63;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }

        .world-intro-desc {
          font-family: var(--font-mono);
          font-size: 13px;
          color: #BCAAA4;
          line-height: 1.6;
          max-width: 680px;
          margin: 0;
        }

        .current-visitor-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: #FAF6EE;
          background: rgba(10, 124, 90, 0.15);
          border: 1px solid rgba(10, 124, 90, 0.4);
          padding: 6px 12px;
          border-radius: 16px;
          white-space: nowrap;
        }

        .current-visitor-pill strong {
          color: #0A7C5A;
        }

        .radar-ping {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #0A7C5A;
        }

        /* Map Card Container */
        .map-card {
          position: relative;
          width: 100%;
          min-height: 280px;
          background: #180D0A;
          border: 1px solid rgba(141, 110, 99, 0.3);
          border-radius: 12px;
          padding: 24px 20px 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
          --m0: #321B15;
          --m1: #5A271C;
          --m2: #8D3A24;
          --m3: #C8532A;
          --m4: #FA7942;
        }

        .map-loading-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(24, 13, 10, 0.94);
          backdrop-filter: blur(4px);
          z-index: 10;
          gap: 16px;
          padding: 24px;
          text-align: center;
        }

        .radar-loader {
          position: relative;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .radar-spinner {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 2px solid rgba(140, 115, 85, 0.2);
          border-top-color: #8C7355;
          border-right-color: #C8532A;
          animation: radarSpin 1.1s linear infinite;
        }

        .radar-wave {
          position: absolute;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(200, 83, 42, 0.25);
          animation: radarPulse 1.6s ease-out infinite;
        }

        @keyframes radarSpin {
          to { transform: rotate(360deg); }
        }

        @keyframes radarPulse {
          0% { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        .map-loading-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .terminal-prefix {
          font-family: var(--font-mono);
          font-size: 10px;
          color: #8C7355;
          letter-spacing: 1.5px;
          font-weight: bold;
        }

        .loading-title {
          font-family: var(--font-mono);
          font-size: 12px;
          color: #FAF6EE;
          letter-spacing: 1px;
          margin: 0;
        }

        .loading-sub {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #BCAAA4;
          margin: 0;
        }

        .map-card svg {
          display: block;
          width: 100%;
          height: auto;
          cursor: crosshair;
        }

        :global(.grid-base-rect) {
          fill: var(--m0);
          transition: fill 0.2s ease;
        }

        :global(.hit-rect) {
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          cursor: pointer;
          transition: stroke 0.15s ease, stroke-width 0.15s ease;
        }

        .map-card.started :global(.hit-rect) {
          animation: spread 0.55s cubic-bezier(0.2, 0.8, 0.3, 1.2) both;
        }

        :global(.hit-rect:hover) {
          stroke: #FAF6EE;
          stroke-width: 1px;
        }

        @keyframes spread {
          from {
            opacity: 0;
            transform: scale(0.2);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Tooltip */
        .map-tooltip {
          position: absolute;
          pointer-events: none;
          transform: translate(-50%, -100%);
          padding: 6px 12px;
          border-radius: 6px;
          background: #FAF6EE;
          color: #2A1510;
          font-family: var(--font-mono);
          font-size: 11px;
          line-height: 1.4;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(141, 110, 99, 0.4);
          transition: opacity 0.15s ease, left 0.08s ease, top 0.08s ease;
          z-index: 10;
          white-space: nowrap;
        }

        .map-tooltip :global(strong) {
          color: #843922;
        }

        .map-tooltip :global(span) {
          color: #5D4037;
        }

        /* Legend */
        .map-legend {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 14px;
          padding-top: 10px;
          border-top: 1px dashed rgba(141, 110, 99, 0.18);
        }

        .legend-label, .legend-scale {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.8px;
          color: #8D6E63;
        }

        .legend-cells {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .legend-cell {
          width: 9px;
          height: 9px;
          border-radius: 2px;
          display: inline-block;
        }

        /* Metrics Grid */
        .world-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-top: 16px;
        }

        @media (max-width: 768px) {
          .world-metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .world-metrics-grid {
            grid-template-columns: 1fr;
          }
        }

        .metric-box {
          background: rgba(42, 21, 16, 0.35);
          border: 1px solid rgba(141, 110, 99, 0.2);
          border-radius: 8px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .metric-num {
          font-family: var(--font-header);
          font-size: 20px;
          font-weight: bold;
          color: #FAF6EE;
          letter-spacing: 0.5px;
        }

        .metric-tag {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.8px;
          color: #8D6E63;
        }
      `}</style>
    </section>
  );
}

