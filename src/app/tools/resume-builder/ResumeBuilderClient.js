'use client';

import React from 'react';
import Link from 'next/link';
import ResumeGuideModal from '../../../components/ResumeGuideModal';

export default function ResumeBuilderClient() {
  return (
    <div className="resume-builder-page">
      {/* ── Top Sticky Converter Header ── */}
      <header className="builder-top-banner">
        <div className="banner-inner">
          <div className="banner-left">
            <Link href="/" className="portfolio-link">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="#8D6E63" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Portfolio</span>
            </Link>
            <span className="banner-sep">/</span>
            <Link href="/tools" className="portfolio-link">
              <span>Tools</span>
            </Link>
            <span className="banner-sep">/</span>
            <h1 className="tool-name">Free ATS Resume & CV Builder</h1>
          </div>

          <div className="banner-center">
            <span className="pill-badge">100% Free · No Watermark · Zero Login</span>
            <ResumeGuideModal initialOpen={true} />
          </div>

          <div className="banner-right">
            <span className="banner-cta-label">Need a custom web tool or SaaS?</span>
            <Link href="/?quote=open#contact" className="hire-cta-btn">
              Hire Adil →
            </Link>
          </div>
        </div>
      </header>

      {/* ── Interactive Resume Application ── */}
      <main className="builder-frame-wrapper">
        <iframe
          src="/resume-engine/index.html"
          title="Free ATS Resume Builder by Adil Rahman"
          className="builder-iframe"
          allow="clipboard-write"
          suppressHydrationWarning
        />
      </main>
    </div>
  );
}
