'use client';

import React from 'react';
import Link from 'next/link';

export default function ToolsHubClient() {
  return (
    <div className="tools-hub-page">
      {/* ── Navigation ── */}
      <nav className="tools-nav">
        <div className="nav-left">
          <Link href="/" className="back-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="#8D6E63" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Portfolio
          </Link>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">Tools Directory</span>
        </div>
        <span className="nav-brand">ADIL RAHMAN // TOOLS</span>
      </nav>

      {/* ── Header ── */}
      <header className="tools-header">
        <div className="tools-header-inner">
          <span className="tools-tag">// DEVELOPER UTILITIES & INTERACTIVE APPS</span>
          <h1 className="tools-title">Free Developer & Productivity Tools</h1>
          <p className="tools-excerpt">
            High-utility browser applications engineered for speed, privacy, and zero data lock-in. 100% free with client-side execution, instant export, and no paywalls or watermarks.
          </p>

          <div className="tools-header-line" />
        </div>
      </header>

      {/* ── Main Grid ── */}
      <main className="tools-main">
        <div className="tools-grid-container">

          {/* Tool Card: Free ATS Resume Builder */}
          <article className="tool-card featured-card">
            <div className="tool-card-top">
              <span className="status-badge">100% FREE // BROWSER UTILITY</span>
              <span className="category-badge">CAREER // RESUME</span>
            </div>

            <h2 className="tool-name">
              <Link href="/tools/resume-builder" className="tool-title-link">
                Free ATS Resume & CV Builder
              </Link>
            </h2>
            <div className="tool-subtitle">Interactive ATS Resume & Design PDF Engine // Vanilla JS</div>

            <p className="tool-desc">
              A client-side, zero-dependency resume builder featuring live WYSIWYG editing, parser-safe single-column ATS export with custom section sequence badges, 6 curated theme palettes, and instant localStorage persistence. No account required, no watermark, zero tracking.
            </p>

            <div className="tool-features-list">
              <div className="feature-item">
                <span className="bullet">✓</span>
                <span><strong>Dual Export Engines:</strong> Aesthetic two-column Design PDF + single-column ATS parser-safe PDF.</span>
              </div>
              <div className="feature-item">
                <span className="bullet">✓</span>
                <span><strong>Interactive Sequence Badges:</strong> Drag and reorder sections to optimize ATS rank.</span>
              </div>
              <div className="feature-item">
                <span className="bullet">✓</span>
                <span><strong>6 Theme Palettes:</strong> Real-time typography and palette syncing with CSS custom properties.</span>
              </div>
              <div className="feature-item">
                <span className="bullet">✓</span>
                <span><strong>100% Privacy-Preserving:</strong> Resume data never touches external servers; saved in local storage.</span>
              </div>
            </div>

            <div className="tool-tech-pills">
              <span className="tech-pill">Vanilla JavaScript</span>
              <span className="tech-pill">HTML5 Semantic</span>
              <span className="tech-pill">Print CSS Engines</span>
              <span className="tech-pill">LocalStorage API</span>
              <span className="tech-pill">ATS Parser Tested</span>
            </div>

            <div className="tool-actions">
              <Link href="/tools/resume-builder" className="btn-launch">
                Launch Free Builder ↗
              </Link>
              <Link href="/project/personal-project/resume-editor" className="btn-specs">
                Architecture & System Specs →
              </Link>
            </div>
          </article>

          {/* Need a Custom Tool CTA */}
          <div className="tools-bottom-cta">
            <h2 className="bottom-cta-heading">Need a Custom Web Tool or SaaS Utility?</h2>
            <p className="bottom-cta-sub">
              Available to design and deploy specialized web applications, calculation engines, client portals, and automation utilities.
            </p>
            <div className="bottom-cta-actions">
              <Link href="/services" className="cta-btn-primary">
                Explore Engineering Services →
              </Link>
              <Link href="/?quote=open#contact" className="cta-btn-secondary">
                Request a Custom Quote ↗
              </Link>
            </div>
          </div>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="tools-footer">
        <div className="footer-links-row">
          <Link href="/" className="footer-link">Portfolio Home</Link>
          <span className="footer-sep">·</span>
          <Link href="/project" className="footer-link">Projects Hub</Link>
          <span className="footer-sep">·</span>
          <Link href="/tools/resume-builder" className="footer-link">Resume Builder</Link>
          <span className="footer-sep">·</span>
          <Link href="/project/saas" className="footer-link">SaaS Platforms</Link>
          <span className="footer-sep">·</span>
          <Link href="/services" className="footer-link">Services</Link>
          <span className="footer-sep">·</span>
          <Link href="/blog" className="footer-link">Blog</Link>
        </div>
        <p className="footer-copy">© 2026 Adil Rahman | Engineered with Next.js, Vanilla JS & Cloudflare</p>
      </footer>
    </div>
  );
}
