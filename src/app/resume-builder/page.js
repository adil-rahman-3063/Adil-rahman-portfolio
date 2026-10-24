import Link from 'next/link';
import ResumeGuideModal from '../../components/ResumeGuideModal';

const SITE_URL = 'https://adilrahman.cc';

export const metadata = {
  title: {
    absolute: 'Free ATS Resume Builder | Instant PDF Export, No Watermark',
  },
  description: 'Free interactive browser ATS resume & CV builder with live editing, custom section reordering, 6 themes, and instant PDF export. No login or watermark.',
  keywords: [
    'free ATS resume builder',
    'resume builder without watermark',
    'free online CV maker with PDF export',
    'ATS friendly resume templates',
    'markdown resume editor',
    'Adil Rahman resume editor',
  ],
  openGraph: {
    title: 'Free ATS Resume Builder | Instant PDF Export, No Watermark',
    description: 'Free interactive browser ATS resume builder with live editing, 6 themes, and instant PDF export without login or watermark.',
    url: `${SITE_URL}/resume-builder`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ATS Resume Builder | Instant PDF Export, No Watermark',
    description: 'Free interactive browser ATS resume builder. Live editing, 6 themes, zero paywall, instant PDF export.',
    creator: '@adilrahmanms',
  },
  alternates: {
    canonical: '/resume-builder',
  },
};

export default function ResumeBuilderPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Free ATS Resume & CV Builder',
    url: `${SITE_URL}/resume-builder`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    description: 'Client-side zero-dependency ATS resume editor with live WYSIWYG editing, 6 curated theme palettes, and dual PDF export engines.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: 'Adil Rahman',
      url: SITE_URL,
    },
  };

  return (
    <div className="resume-builder-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Top Sticky Converter Header ── */}
      <header className="builder-top-banner">
        <div className="banner-inner">
          <div className="banner-left">
            <Link href="/" className="portfolio-link">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="#8D6E63" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Adil Rahman</span>
            </Link>
            <span className="banner-sep">/</span>
            <span className="tool-name">Free ATS Resume Engine</span>
          </div>

          <div className="banner-center">
            <span className="pill-badge">100% Free · No Watermark · Zero Login</span>
            <ResumeGuideModal initialOpen={true} />
          </div>

          <div className="banner-right">
            <span className="banner-cta-label">Need a custom SaaS or web app?</span>
            <Link href="/?hire=true" className="hire-cta-btn">
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

      {/* ── Dynamic Iframe Height Listener ── */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('message', function(e) {
              if (e.data && e.data.type === 'RESUME_IFRAME_HEIGHT' && e.data.height) {
                var iframe = document.querySelector('.builder-iframe');
                if (iframe) {
                  iframe.style.height = e.data.height + 'px';
                }
              }
            });
          `,
        }}
      />

      {/* ── Footer shown when scrolling to the end ── */}
      <footer className="builder-footer">
        <div className="footer-content-inner">
          {/* Guide / Feature Pillars */}
          <div className="footer-guide-section">
            <span className="footer-badge">// FREE ATS RESUME & CV ENGINE</span>
            <h2 className="footer-guide-title">Why Use This Free ATS Resume Studio?</h2>
            <div className="features-grid">
              <div className="feat-col">
                <span className="feat-num">01</span>
                <h3>Zero Paywalls & No Watermarks</h3>
                <p>
                  Built by a developer for job seekers. No subscriptions, no surprise credit card forms, and clean unbranded PDF exports.
                </p>
              </div>
              <div className="feat-col">
                <span className="feat-num">02</span>
                <h3>Single-Column ATS Parser Safety</h3>
                <p>
                  Semantic hierarchy, customizable section sequences, and clean text streams that pass applicant tracking systems (Greenhouse, Lever, Workday).
                </p>
              </div>
              <div className="feat-col">
                <span className="feat-num">03</span>
                <h3>100% Client-Side Privacy</h3>
                <p>
                  Your employment history and contact info stay in your browser. All draft state is stored in your private localStorage.
                </p>
              </div>
            </div>
          </div>

          {/* Hire / SaaS CTA Banner */}
          <div className="footer-cta-card">
            <p className="cta-label">// LOOKING FOR A DEVELOPER?</p>
            <h3 className="cta-title">Need a Custom Web App, Mobile App, or SaaS?</h3>
            <p className="cta-sub">
              I architect end-to-end software solutions — from cross-platform Flutter mobile apps to multi-tenant Next.js platforms.
            </p>
            <div className="cta-actions">
              <Link href="/?hire=true" className="btn-hire-footer">
                Hire Adil / Get a Quote →
              </Link>
              <Link href="/services" className="btn-services-footer">
                View Engineering Services
              </Link>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="footer-bottom-bar">
            <nav className="footer-nav-links" aria-label="Footer quick navigation">
              <Link href="/" className="footer-link">Portfolio</Link>
              <span className="footer-sep">·</span>
              <Link href="/services" className="footer-link">Services</Link>
              <span className="footer-sep">·</span>
              <Link href="/saas" className="footer-link">SaaS Products</Link>
              <span className="footer-sep">·</span>
              <Link href="/blog" className="footer-link">Engineering Blog</Link>
            </nav>
            <p className="footer-copy">© 2026 Adil Rahman | All Rights Reserved</p>
            <p className="footer-tagline">MADE AND DEPLOYED BY ME // PORTFOLIO v3.0.0</p>
          </div>
        </div>
      </footer>

      <style>{`
        .resume-builder-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #14161A;
          color: #ECEBE6;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          overflow-x: hidden;
        }

        .builder-top-banner {
          background: rgba(16, 18, 21, 0.95);
          border-bottom: 1px solid rgba(141, 110, 99, 0.25);
          backdrop-filter: blur(8px);
          position: sticky;
          top: 0;
          z-index: 100;
          height: 48px;
          display: flex;
          align-items: center;
        }

        .banner-inner {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
        }

        .banner-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .portfolio-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #FAF6EE;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
        }
        .portfolio-link:hover {
          color: #8D6E63;
        }

        .banner-sep {
          color: rgba(141, 110, 99, 0.4);
        }

        .tool-name {
          color: #8D6E63;
          font-weight: 500;
        }

        .banner-center {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pill-badge {
          background: rgba(141, 110, 99, 0.15);
          border: 1px solid rgba(141, 110, 99, 0.3);
          color: #D7CCC8;
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 12px;
          letter-spacing: 0.3px;
        }

        .banner-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .banner-cta-label {
          color: #BCAAA4;
          font-size: 12px;
        }

        .hire-cta-btn {
          background: #8D6E63;
          color: #FAF6EE;
          text-decoration: none;
          padding: 5px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          transition: background 0.2s;
        }
        .hire-cta-btn:hover {
          background: #A1887F;
        }

        .builder-frame-wrapper {
          width: 100%;
          background: #F5F4EF;
          display: flex;
          justify-content: center;
          position: relative;
        }

        .builder-iframe {
          width: 100%;
          height: 960px;
          border: none;
          display: block;
          transition: height 0.15s ease;
        }

        /* ── Footer ── */
        .builder-footer {
          background: #101215;
          border-top: 1px solid rgba(141, 110, 99, 0.2);
          padding: 64px 20px 48px;
        }

        .footer-content-inner {
          max-width: 1080px;
          margin: 0 auto;
        }

        .footer-guide-section {
          margin-bottom: 56px;
        }

        .footer-badge {
          font-size: 11px;
          color: #8D6E63;
          letter-spacing: 1.5px;
          font-family: monospace;
          display: block;
          margin-bottom: 12px;
        }

        .footer-guide-title {
          font-size: 26px;
          color: #FAF6EE;
          margin: 0 0 32px;
          font-weight: bold;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .feat-col {
          background: rgba(35, 21, 19, 0.35);
          border: 1px solid rgba(141, 110, 99, 0.2);
          border-radius: 8px;
          padding: 24px;
        }

        .feat-num {
          font-family: monospace;
          font-size: 18px;
          color: #8D6E63;
          font-weight: bold;
          display: block;
          margin-bottom: 8px;
        }

        .feat-col h3 {
          font-size: 16px;
          color: #FAF6EE;
          margin: 0 0 10px;
        }

        .feat-col p {
          font-size: 13px;
          line-height: 1.6;
          color: #BCAAA4;
          margin: 0;
        }

        .footer-cta-card {
          background: linear-gradient(135deg, rgba(42, 21, 16, 0.8) 0%, rgba(26, 10, 8, 0.95) 100%);
          border: 1px solid rgba(141, 110, 99, 0.35);
          border-radius: 12px;
          padding: 36px 32px;
          text-align: center;
          margin-bottom: 56px;
        }

        .cta-label {
          font-size: 11px;
          color: #8D6E63;
          letter-spacing: 1.5px;
          font-family: monospace;
          margin: 0 0 12px;
        }

        .cta-title {
          font-size: 22px;
          color: #FAF6EE;
          margin: 0 0 12px;
          font-weight: bold;
        }

        .cta-sub {
          font-size: 14px;
          line-height: 1.6;
          color: #BCAAA4;
          max-width: 600px;
          margin: 0 auto 24px;
        }

        .cta-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .btn-hire-footer {
          background: #8D6E63;
          color: #FAF6EE;
          text-decoration: none;
          padding: 11px 24px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: bold;
          transition: background 0.2s;
        }
        .btn-hire-footer:hover {
          background: #735348;
        }

        .btn-services-footer {
          background: transparent;
          border: 1px solid rgba(141, 110, 99, 0.4);
          color: #FAF6EE;
          text-decoration: none;
          padding: 10px 22px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: bold;
          transition: all 0.2s;
        }
        .btn-services-footer:hover {
          border-color: #FAF6EE;
          background: rgba(250, 246, 238, 0.05);
        }

        .footer-bottom-bar {
          border-top: 1px solid rgba(141, 110, 99, 0.15);
          padding-top: 32px;
          text-align: center;
        }

        .footer-nav-links {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .footer-link {
          color: #FAF6EE;
          text-decoration: none;
          font-size: 13px;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: #8D6E63;
        }

        .footer-sep {
          color: rgba(141, 110, 99, 0.4);
        }

        .footer-copy {
          font-size: 12px;
          color: #BCAAA4;
          margin: 0 0 6px;
        }

        .footer-tagline {
          font-size: 10px;
          letter-spacing: 1.5px;
          color: rgba(141, 110, 99, 0.6);
          margin: 0;
          font-family: monospace;
        }

        @media (max-width: 768px) {
          .pill-badge,
          .banner-cta-label {
            display: none;
          }
          .footer-cta-card {
            padding: 24px 18px;
          }
        }
      `}</style>
    </div>
  );
}
