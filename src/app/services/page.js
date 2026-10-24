import Link from 'next/link';
import { allServices } from '../../data/servicesData';

const SITE_URL = 'https://adilrahman.cc';

export const metadata = {
  title: {
    absolute: 'Software Engineering & Development Services | Adil Rahman',
  },
  description: 'Hire Adil Rahman for custom Flutter mobile apps, Next.js web applications, and Shopify store engineering. Fast 1-3 week turnaround & verified 5.0★ reviews.',
  keywords: [
    'hire freelance developer',
    'Flutter developer for hire',
    'Shopify theme developer',
    'Next.js developer freelance',
    'full stack developer portfolio',
    'Adil Rahman services',
  ],
  openGraph: {
    title: 'Software Engineering & Development Services | Adil Rahman',
    description: 'Hire Adil Rahman for custom Flutter mobile apps, Next.js web platforms, and Shopify stores. 1-3 week turnaround.',
    url: `${SITE_URL}/services`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Software Engineering & Development Services | Adil Rahman',
    description: 'Hire Adil Rahman for custom Flutter mobile apps, Next.js web platforms, and Shopify stores.',
    creator: '@adilrahmanms',
  },
  alternates: {
    canonical: '/services',
  },
};

export default function ServicesHubPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Software Engineering Services by Adil Rahman',
    description: 'Custom development services for cross-platform Flutter apps, Next.js web applications, and Shopify e-commerce.',
    itemListElement: allServices.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: service.title,
      url: `${SITE_URL}/services/${service.slug}`,
      description: service.metaDesc,
    })),
  };

  return (
    <div className="services-hub-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Top Bar ── */}
      <nav className="services-hub-nav">
        <div className="nav-container">
          <Link href="/" className="nav-back">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="#8D6E63" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Portfolio
          </Link>
          <div className="nav-links">
            <Link href="/saas" className="nav-sublink">SaaS Products</Link>
            <Link href="/blog" className="nav-sublink">Engineering Notes</Link>
          </div>
        </div>
      </nav>

      <main className="services-hub-main">
        <div className="content-container">
          {/* ── Header ── */}
          <header className="hub-header">
            <span className="hub-badge">// COMMERCIAL ENGINEERING SERVICES</span>
            <h1 className="hub-title">Hire a Battle-Tested Full-Stack Engineer</h1>
            <p className="hub-subtitle">
              Direct founder-to-developer collaboration. No agency markup, no junior handoffs.
              Specialized in production Flutter mobile apps, high-converting Shopify Liquid themes,
              and sub-second Next.js edge architectures.
            </p>
          </header>

          {/* ── Services Grid ── */}
          <section className="services-grid" aria-label="Available Services">
            {allServices.map((service) => (
              <article key={service.slug} className="service-card">
                <div className="service-card-header">
                  <span className="service-card-badge">{service.badge}</span>
                  <span className="service-turnaround-pill">{service.turnaround.split(';')[0]}</span>
                </div>

                <h2 className="service-card-title">
                  <Link href={`/services/${service.slug}`} className="service-card-link">
                    {service.heroTitle}
                  </Link>
                </h2>

                <p className="service-card-tagline">{service.tagline}</p>

                <div className="deliverables-preview">
                  <h3 className="deliverables-heading">Core Capabilities:</h3>
                  <ul className="deliverables-list">
                    {service.deliverables.slice(0, 4).map((d, i) => (
                      <li key={i} className="deliverable-item">
                        <span className="bullet">›</span> {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card-footer">
                  <Link href={`/services/${service.slug}`} className="service-cta">
                    View Scope & Pricing Details →
                  </Link>
                  <Link
                    href="/?hire=true"
                    className="service-hire-btn"
                  >
                    Get a Quote
                  </Link>
                </div>
              </article>
            ))}
          </section>

          {/* ── Client Guarantees ── */}
          <section className="guarantees-section">
            <h2 className="guarantees-title">The Engineering Standard</h2>
            <div className="guarantees-grid">
              <div className="guarantee-box">
                <span className="guarantee-num">01</span>
                <h3>1-3 Week Turnaround</h3>
                <p>Rapid iterative development with production-ready deliverables pushed every 48 hours to preview environments.</p>
              </div>
              <div className="guarantee-box">
                <span className="guarantee-num">02</span>
                <h3>Clean Architecture & Zero Lock-in</h3>
                <p>Riverpod state separation in Flutter, server actions in Next.js, and strictly documented pull requests.</p>
              </div>
              <div className="guarantee-box">
                <span className="guarantee-num">03</span>
                <h3>Direct WhatsApp & Slack Comm</h3>
                <p>Direct real-time access to the engineer building your platform. Daily async standups without account managers.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="hub-footer">
        <div className="content-container text-center">
          <p className="footer-label">// READY TO SHIP?</p>
          <h2 className="footer-title">Let’s Discuss Your Next Build</h2>
          <p className="footer-desc">
            Available for selected freelance contracts, MVPs, and long-term architectural consulting.
          </p>
          <div className="footer-cta-buttons">
            <Link
              href="/?hire=true"
              className="footer-cta-btn"
            >
              Get a Project Quote →
            </Link>
            <Link
              href="/#contact"
              className="footer-secondary-btn"
            >
              Contact Form
            </Link>
          </div>
        </div>
      </footer>

      <style>{`
        .services-hub-page {
          background-color: #1A0A08;
          color: #E8D8C8;
          min-height: 100vh;
          font-family: var(--font-special-elite, monospace), "Courier New", monospace;
        }

        .services-hub-nav {
          border-bottom: 1px solid rgba(141, 110, 99, 0.2);
          background: rgba(26, 10, 8, 0.85);
          backdrop-filter: blur(8px);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .nav-container {
          max-width: 1040px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #FAF6EE;
          text-decoration: none;
          font-size: 13px;
          transition: color 0.2s ease;
        }
        .nav-back:hover {
          color: #8D6E63;
        }

        .nav-links {
          display: flex;
          gap: 20px;
        }

        .nav-sublink {
          color: #BCAAA4;
          text-decoration: none;
          font-size: 13px;
          transition: color 0.2s ease;
        }
        .nav-sublink:hover {
          color: #FAF6EE;
        }

        .content-container {
          max-width: 1040px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .services-hub-main {
          padding: 56px 0 80px;
        }

        .hub-header {
          margin-bottom: 48px;
          text-align: center;
        }

        .hub-badge {
          display: inline-block;
          font-size: 11px;
          letter-spacing: 1.5px;
          color: #8D6E63;
          margin-bottom: 12px;
        }

        .hub-title {
          font-size: clamp(28px, 4vw, 42px);
          color: #FAF6EE;
          line-height: 1.2;
          margin: 0 0 16px;
          font-weight: bold;
        }

        .hub-subtitle {
          font-size: 15px;
          line-height: 1.6;
          color: #BCAAA4;
          max-width: 720px;
          margin: 0 auto;
        }

        .services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          margin-bottom: 64px;
        }

        .service-card {
          background: rgba(35, 21, 19, 0.6);
          border: 1px solid rgba(141, 110, 99, 0.25);
          border-radius: 12px;
          padding: 32px;
          transition: all 0.25s ease;
        }
        .service-card:hover {
          border-color: rgba(141, 110, 99, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
        }

        .service-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 14px;
        }

        .service-card-badge {
          font-size: 11px;
          letter-spacing: 1px;
          color: #8D6E63;
        }

        .service-turnaround-pill {
          font-size: 11px;
          background: rgba(141, 110, 99, 0.15);
          color: #BCAAA4;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid rgba(141, 110, 99, 0.2);
        }

        .service-card-title {
          font-size: 24px;
          margin: 0 0 14px;
          font-weight: bold;
          line-height: 1.3;
        }

        .service-card-link {
          color: #FAF6EE;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .service-card-link:hover {
          color: #8D6E63;
        }

        .service-card-tagline {
          font-size: 14px;
          line-height: 1.6;
          color: #BCAAA4;
          margin: 0 0 24px;
        }

        .deliverables-preview {
          background: rgba(26, 10, 8, 0.4);
          border: 1px dashed rgba(141, 110, 99, 0.2);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .deliverables-heading {
          font-size: 12px;
          letter-spacing: 1px;
          color: #8D6E63;
          margin: 0 0 12px;
          text-transform: uppercase;
        }

        .deliverables-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .deliverable-item {
          font-size: 13px;
          color: #E8D8C8;
          line-height: 1.5;
        }

        .bullet {
          color: #8D6E63;
          font-weight: bold;
          margin-right: 6px;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .service-cta {
          color: #FAF6EE;
          font-size: 14px;
          font-weight: bold;
          text-decoration: none;
          border-bottom: 1px solid #8D6E63;
          padding-bottom: 2px;
          transition: all 0.2s ease;
        }
        .service-cta:hover {
          color: #8D6E63;
          border-bottom-color: #FAF6EE;
        }

        .service-hire-btn {
          background: #8D6E63;
          color: #FAF6EE;
          text-decoration: none;
          padding: 8px 18px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: bold;
          transition: background 0.2s ease;
        }
        .service-hire-btn:hover {
          background: #735348;
        }

        .guarantees-section {
          border-top: 1px solid rgba(141, 110, 99, 0.2);
          padding-top: 56px;
        }

        .guarantees-title {
          font-size: 20px;
          color: #FAF6EE;
          text-align: center;
          margin: 0 0 36px;
        }

        .guarantees-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }

        .guarantee-box {
          background: rgba(35, 21, 19, 0.4);
          border: 1px solid rgba(141, 110, 99, 0.15);
          border-radius: 8px;
          padding: 24px;
        }

        .guarantee-num {
          display: block;
          font-size: 20px;
          color: #8D6E63;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .guarantee-box h3 {
          font-size: 16px;
          color: #FAF6EE;
          margin: 0 0 8px;
        }

        .guarantee-box p {
          font-size: 13px;
          line-height: 1.5;
          color: #BCAAA4;
          margin: 0;
        }

        .hub-footer {
          border-top: 1px solid rgba(141, 110, 99, 0.2);
          padding: 64px 0 80px;
          background: rgba(26, 10, 8, 0.5);
        }

        .text-center { text-align: center; }

        .footer-label {
          font-size: 11px;
          color: #8D6E63;
          letter-spacing: 1.5px;
          margin: 0 0 12px;
        }

        .footer-title {
          font-size: 24px;
          color: #FAF6EE;
          margin: 0 0 12px;
          font-weight: bold;
        }

        .footer-desc {
          font-size: 13px;
          line-height: 1.6;
          color: #BCAAA4;
          max-width: 540px;
          margin: 0 auto 28px;
        }

        .footer-cta-buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .footer-cta-btn {
          display: inline-block;
          background: #8D6E63;
          color: #FAF6EE;
          padding: 12px 28px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: bold;
          text-decoration: none;
          transition: background 0.2s ease;
        }
        .footer-cta-btn:hover {
          background: #735348;
        }

        .footer-secondary-btn {
          display: inline-block;
          border: 1px solid rgba(141, 110, 99, 0.4);
          color: #FAF6EE;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: bold;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .footer-secondary-btn:hover {
          border-color: #FAF6EE;
          background: rgba(250, 246, 238, 0.08);
        }

        @media (max-width: 600px) {
          .service-card { padding: 22px; }
          .card-footer { flex-direction: column; align-items: flex-start; }
          .service-hire-btn { width: 100%; text-align: center; }
          .footer-cta-buttons { flex-direction: column; }
          .footer-cta-btn, .footer-secondary-btn { width: 100%; text-align: center; }
        }
      `}</style>
    </div>
  );
}
