'use client';

import React from 'react';
import Link from 'next/link';
import ResumeGuideModal from '../../../components/ResumeGuideModal';
import SiteFooter from '../../../components/SiteFooter';

export default function ResumeBuilderClient() {
  React.useEffect(() => {
    function handleMessage(e) {
      if (e.data && e.data.type === 'RESUME_IFRAME_HEIGHT' && e.data.height) {
        const iframe = document.querySelector('.builder-iframe');
        if (iframe && e.data.height > 600) {
          iframe.style.height = `${e.data.height}px`;
          const wrapper = document.querySelector('.builder-frame-wrapper');
          if (wrapper) {
            wrapper.style.height = 'auto';
          }
        }
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

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
            <ResumeGuideModal initialOpen={false} />
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

      {/* ── Comprehensive Guide & ATS Compliance Documentation (SEO & User Authority) ── */}
      <div className="builder-guide-container">
        <div className="guide-pill-strip">
          <span className="guide-badge">✓ 100% Client-Side Privacy</span>
          <span className="guide-badge">✓ Single-Column Parser Friendly</span>
          <span className="guide-badge">✓ Zero Watermark Export</span>
          <span className="guide-badge">✓ 6 Executive Palettes</span>
          <span className="guide-badge">✓ Instant Vector PDF</span>
        </div>

        {/* ATS Compliance Standards */}
        <section>
          <h2 className="guide-heading">// ATS RESUME ENGINEERING & PARSER COMPLIANCE</h2>
          <div className="guide-grid">
            <div className="guide-card">
              <span className="guide-num">01</span>
              <h3>Single-Column Parser Flow</h3>
              <p>
                Enterprise Applicant Tracking Systems (Workday, Greenhouse, Lever, Taleo) read resume documents sequentially from top-to-bottom. Multi-column graphical layouts, tables, and text boxes frequently scramble experience dates, titles, and contact information. This builder utilizes a semantic, single-column document stream ensuring 100% parsing accuracy across every scanner.
              </p>
            </div>

            <div className="guide-card">
              <span className="guide-num">02</span>
              <h3>Impact-Driven XYZ Bullet Method</h3>
              <p>
                Recruiters and AI screening algorithms look for quantifiable impact over generic job duties. Structure every bullet using Google&apos;s proven formula: <em>&quot;Accomplished [X] as measured by [Y] by doing [Z]&quot;</em>. Focus on percentages, dollars saved, latency reduced, or revenue generated to pass initial recruiter scorecards.
              </p>
            </div>

            <div className="guide-card">
              <span className="guide-num">03</span>
              <h3>Parser-Safe Typography & Spacing</h3>
              <p>
                Non-standard fonts and decorative symbols get converted to unreadable character glyphs during automated parsing. Our engine strictly enforces universal system typefaces, standard 0.5&quot; to 0.75&quot; printable margins, and standardized section headings recognized by all major ATS parsers.
              </p>
            </div>
          </div>
        </section>

        {/* Step-by-Step Optimization Process */}
        <section>
          <h2 className="guide-heading">// HOW TO BUILD & EXPORT YOUR ATS RESUME</h2>
          <div className="guide-grid">
            <div className="guide-card">
              <span className="guide-num">01</span>
              <h3>Fill Contact & Professional Headline</h3>
              <p>
                Enter your name, email, phone number, location, and key profile links (GitHub, LinkedIn, Portfolio). Keep your headline aligned directly with target job titles to trigger keyword search matches.
              </p>
            </div>

            <div className="guide-card">
              <span className="guide-num">02</span>
              <h3>Reorder Sections for Maximum Impact</h3>
              <p>
                Use the live sequence selector to prioritize your strongest assets. Place Experience first if you have 2+ years of relevant tenure, or highlight Technical Projects and Open-Source contributions if you are transitioning careers or breaking into tech.
              </p>
            </div>

            <div className="guide-card">
              <span className="guide-num">03</span>
              <h3>Curate Theme & Export Clean Vector PDF</h3>
              <p>
                Toggle between 6 curated executive color accents (Classic Ink, Modern Teal, Deep Slate, Executive Navy, Crimson Accent, Emerald). Click &quot;Print / Save PDF&quot; for instant, client-side vector rendering without watermarks or account signups.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="guide-heading">// FREQUENTLY ASKED QUESTIONS</h2>
          <div className="faq-list">
            <div className="faq-item">
              <h3>Is this ATS resume builder truly 100% free with no watermark?</h3>
              <p>
                Yes. Unlike commercial resume services that hold your finished resume hostage behind a paywall or stamp intrusive branding watermarks, this editor was built by Adil Rahman as a free public utility. There are no subscriptions, hidden fees, or premium tiers.
              </p>
            </div>

            <div className="faq-item">
              <h3>Is my personal resume data stored on your server?</h3>
              <p>
                No. All your personal data, job descriptions, and formatting options are saved exclusively in your browser&apos;s local storage (`localStorage`). No information is ever transmitted to a remote server or sold to third-party data brokers.
              </p>
            </div>

            <div className="faq-item">
              <h3>How do automated ATS scanners evaluate this resume?</h3>
              <p>
                The underlying export engine generates standard semantic HTML and CSS print media rules with unnested text blocks. When converted to PDF, the text remains selectable vector text rather than a flattened image, allowing OCR and text extraction parsers to read every keyword seamlessly.
              </p>
            </div>

            <div className="faq-item">
              <h3>Can I edit or update my resume later?</h3>
              <p>
                Yes. Since your edits are persisted in your browser&apos;s `localStorage`, returning to this URL on the same browser will automatically load your latest saved draft, ready for fast tweaks and re-exports.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ── Footer ── */}
      <SiteFooter
        ctaLabel="// NEED A BESPOKE TOOL OR INTERNAL PLATFORM?"
        ctaTitle="Looking for Custom Web Development?"
        ctaDesc="Available to engineer high-performance web applications, specialized browser utilities, and full-stack software systems."
        primaryBtn={{ label: "Request a Custom Quote →", href: "/?quote=open#contact" }}
        secondaryBtn={{ label: "Explore Engineering Services", href: "/services" }}
        tertiaryBtn={{ label: "Projects Hub", href: "/project" }}
      />
    </div>
  );
}
