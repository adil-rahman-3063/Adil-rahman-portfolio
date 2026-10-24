import { allProjects } from '../../data/projectsData';
import Link from 'next/link';

const SITE_URL = 'https://adilrahman.cc';

export const metadata = {
  title: {
    absolute: 'SaaS Products & Cloud Apps | Adil Rahman',
  },
  description: 'Production-ready SaaS products, B2B membership management platforms, offline PWAs, and custom cloud apps built by Adil Rahman.',
  openGraph: {
    title: 'SaaS Products & Cloud Applications | Adil Rahman',
    description: 'Production-ready SaaS products, B2B membership management platforms, offline PWAs, and custom cloud apps built by Adil Rahman.',
    url: `${SITE_URL}/saas`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaaS Products & Cloud Applications | Adil Rahman',
    description: 'Production-ready SaaS products, B2B platforms, offline PWAs, and custom cloud apps built by Adil Rahman.',
    creator: '@adilrahmanms',
  },
  alternates: {
    canonical: '/saas',
  },
};

function renderProjectCard(project, defaultBadge) {
  const liveUrlLink = project.links?.find((l) => l.url?.startsWith('http') && !l.url?.includes('github.com'));
  const liveUrl = liveUrlLink ? liveUrlLink.url : null;

  return (
    <article key={project.id} className="saas-card-item">
      <div className="saas-card-top">
        <span className="saas-status-badge">{project.status}</span>
        <span className="saas-category-badge">{defaultBadge}</span>
      </div>

      <h3 className="saas-card-name">
        <Link href={`/saas/${project.id}`} className="saas-card-title-link">
          {project.title}
        </Link>
      </h3>
      <div className="saas-card-subtitle">{project.subtitle}</div>

      <p className="saas-card-description">{project.tagline || project.description}</p>

      {project.tech && project.tech.length > 0 && (
        <div className="saas-card-tech">
          {project.tech.map((t, i) => (
            <span key={i} className="tech-pill">{t}</span>
          ))}
        </div>
      )}

      <div className="saas-card-actions">
        <Link href={`/saas/${project.id}`} className="saas-detail-btn">
          System Architecture & Specs →
        </Link>
        {liveUrl && (
          <a href={liveUrl} target="_blank" rel="noreferrer" className="saas-live-btn">
            Launch Live App ↗
          </a>
        )}
      </div>
    </article>
  );
}

export default function SaasDirectoryPage() {
  // Group all projects into clear architectural tiers
  const cloudSaas = allProjects.filter((p) =>
    ['membership-saas', 'teledrive', 'resume-editor', 'viewpick'].includes(p.id)
  );

  const mobileSystems = allProjects.filter((p) =>
    ['zmr', 'calert', 'poshan', 'redparrot'].includes(p.id)
  );

  const enterprisePortals = allProjects.filter((p) =>
    ['shopify', 'issaa_event'].includes(p.id)
  );

  return (
    <div className="saas-directory-page">
      {/* ── Navigation ── */}
      <nav className="saas-nav">
        <Link href="/" className="saas-back-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="#8D6E63" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Portfolio
        </Link>
        <span className="saas-nav-brand">ADIL RAHMAN // SAAS HUB</span>
      </nav>

      {/* ── Header ── */}
      <header className="saas-header">
        <div className="saas-header-inner">
          <span className="saas-tag">// CLOUD SOFTWARE, MVPS & SAAS PLATFORMS</span>
          <h1 className="saas-title">Production SaaS & Software Directory</h1>
          <p className="saas-excerpt">
            Explore live, multi-tenant B2B platforms, privacy-first cloud tools, progressive web apps, and automated billing software engineered for scale, responsiveness, and zero data lock-in.
          </p>

          <div className="saas-author-card">
            <p className="saas-author-text">
              Every software product here was architected, coded, and deployed from scratch by <strong>Adil Rahman</strong>. 
              Featuring decoupled multi-tenant architectures, Google Sheets two-way sync, Meta WhatsApp Cloud API automation, 
              Supabase edge data layers, and privacy-preserving client-side engines. Click into any application for comprehensive architectural specs, live URLs, and technical documentation.
            </p>
          </div>

          <div className="saas-header-line" />
        </div>
      </header>

      {/* ── SaaS Directory Main Content ── */}
      <main className="saas-main">
        <div className="saas-grid-container">

          {/* Section 1: Flagship SaaS & Cloud Platforms */}
          <section className="saas-tier-section">
            <div className="tier-header">
              <span className="tier-badge">TIER 01</span>
              <h2 className="saas-section-subtitle">// CLOUD SAAS & B2B PLATFORMS</h2>
              <p className="tier-desc">
                Production-grade multi-tenant software, distributed cloud storage interfaces, and browser-based developer productivity tools.
              </p>
            </div>
            <div className="saas-cards-grid">
              {cloudSaas.map((project) => renderProjectCard(project, 'B2B / SAAS'))}
            </div>
          </section>

          {/* Section 2: Mobile Systems & AI-Powered PWAs */}
          <section className="saas-tier-section">
            <div className="tier-header">
              <span className="tier-badge">TIER 02</span>
              <h2 className="saas-section-subtitle">// MOBILE SYSTEMS & OFFLINE PWAS</h2>
              <p className="tier-desc">
                Cross-platform mobile applications, offline-first health trackers, on-device AI forensic engines, and educational schedulers.
              </p>
            </div>
            <div className="saas-cards-grid">
              {mobileSystems.map((project) => renderProjectCard(project, 'MOBILE / APP'))}
            </div>
          </section>

          {/* Section 3: Enterprise Client Portals & E-Commerce */}
          <section className="saas-tier-section">
            <div className="tier-header">
              <span className="tier-badge">TIER 03</span>
              <h2 className="saas-section-subtitle">// CLIENT PORTALS & BESPOKE COMMERCE</h2>
              <p className="tier-desc">
                High-converting custom Shopify storefronts, ticket verification portals with dynamic QR generation, and Google Sheets integrations.
              </p>
            </div>
            <div className="saas-cards-grid">
              {enterprisePortals.map((project) => renderProjectCard(project, 'ENTERPRISE / WEB'))}
            </div>
          </section>

          {/* Engineering Philosophy Guide Section (Resolves Thin Content) */}
          <section className="saas-philosophy-card">
            <h2 className="phil-heading">// SAAS ARCHITECTURE & ENGINEERING STANDARDS</h2>
            <div className="phil-grid">
              <div className="phil-col">
                <span className="phil-num">01</span>
                <h3>Zero Lock-In Data Architecture</h3>
                <p>
                  Rather than forcing clients into proprietary database silos, platforms like AR Membership Manager and Poshan Abhiyaan sync bi-directionally with Google Sheets and Supabase. Clients retain full ownership of their member records and operational telemetry without vendor lock-in.
                </p>
              </div>
              <div className="phil-col">
                <span className="phil-num">02</span>
                <h3>Edge Speed & Serverless Resilience</h3>
                <p>
                  Deploying on Cloudflare Workers and Next.js edge runtimes delivers sub-50ms API responses globally. Real-time WebSockets, MTProto Telegram streaming, and client-side encryption guarantee enterprise-tier security without bulky server maintenance overhead.
                </p>
              </div>
              <div className="phil-col">
                <span className="phil-num">03</span>
                <h3>Automated Workflows & Low-Friction Ops</h3>
                <p>
                  Bespoke integrations with Meta WhatsApp Cloud API and UPI deep linking automate payment reminders, check-ins, and ticket verifications. Workflows run autonomously without human intervention, reducing administrative labor by over 80%.
                </p>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* ── Footer CTA ── */}
      <footer className="saas-footer-cta">
        <div className="saas-footer-inner">
          <p className="footer-label">// HAVE A SAAS IDEA?</p>
          <h2 className="footer-title">Need a Custom Software Solution Built?</h2>
          <p className="footer-desc">
            Available for freelance full-stack software development, MVPs, cross-platform apps, and automated workflows.
          </p>
          <div className="footer-buttons">
            <Link href="/?hire=true" className="btn-primary">
              Discuss Your SaaS Project
            </Link>
            <Link href="/services" className="btn-secondary">
              View Developer Services
            </Link>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');

        .saas-directory-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #1A0A08 0%, #231513 100%);
          color: #EFEBE9;
          font-family: 'Special Elite', monospace;
        }

        .saas-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(141, 110, 99, 0.15);
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(26, 10, 8, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .saas-back-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #8D6E63;
          text-decoration: none;
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 0.5px;
          transition: color 0.2s;
        }
        .saas-back-link:hover { color: #EFEBE9; }
        .saas-back-link:hover svg path { stroke: #EFEBE9; }

        .saas-nav-brand {
          font-size: 11px;
          color: rgba(141, 110, 99, 0.5);
          letter-spacing: 2px;
        }

        .saas-header {
          padding: 64px 24px 32px;
        }

        .saas-header-inner {
          max-width: 820px;
          margin: 0 auto;
        }

        .saas-tag {
          font-size: 11px;
          color: #8D6E63;
          letter-spacing: 1.5px;
          font-weight: bold;
          display: block;
          margin-bottom: 12px;
        }

        .saas-title {
          font-size: clamp(26px, 5vw, 36px);
          line-height: 1.3;
          color: #FAF6EE;
          margin: 0 0 16px;
          letter-spacing: 0.5px;
          font-weight: bold;
        }

        .saas-excerpt {
          font-size: 14px;
          line-height: 1.7;
          color: #BCAAA4;
          margin: 0 0 24px;
        }

        .saas-author-card {
          background: rgba(42, 21, 16, 0.45);
          border: 1px solid rgba(141, 110, 99, 0.2);
          border-radius: 8px;
          padding: 18px 22px;
          margin-bottom: 32px;
        }

        .saas-author-text {
          font-size: 13px;
          line-height: 1.7;
          color: #D7CCC8;
          margin: 0;
        }
        .saas-author-text strong { color: #FAF6EE; }

        .saas-header-line {
          height: 1px;
          background: rgba(141, 110, 99, 0.2);
          width: 100%;
        }

        .saas-main {
          padding: 24px 24px 64px;
        }

        .saas-grid-container {
          max-width: 820px;
          margin: 0 auto;
        }

        .saas-tier-section {
          margin-bottom: 56px;
        }

        .tier-header {
          margin-bottom: 24px;
        }

        .tier-badge {
          display: inline-block;
          font-size: 10px;
          letter-spacing: 1px;
          font-weight: bold;
          color: #8D6E63;
          background: rgba(141, 110, 99, 0.15);
          border: 1px solid rgba(141, 110, 99, 0.3);
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .tier-desc {
          font-size: 13px;
          color: #BCAAA4;
          margin: 6px 0 0;
          line-height: 1.6;
        }

        .saas-section-subtitle {
          font-size: 15px;
          color: #FAF6EE;
          letter-spacing: 1px;
          font-weight: bold;
          margin: 4px 0 0;
        }

        .saas-philosophy-card {
          background: rgba(35, 21, 19, 0.7);
          border: 1px solid rgba(141, 110, 99, 0.25);
          border-radius: 10px;
          padding: 36px 32px;
          margin: 60px 0 32px;
        }

        .phil-heading {
          font-size: 13px;
          color: #8D6E63;
          letter-spacing: 1.5px;
          font-weight: bold;
          margin: 0 0 28px;
        }

        .phil-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
        }

        .phil-col {
          display: flex;
          flex-direction: column;
        }

        .phil-num {
          font-size: 16px;
          color: #8D6E63;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .phil-col h3 {
          font-size: 14px;
          color: #FAF6EE;
          margin: 0 0 10px;
          font-weight: bold;
        }

        .phil-col p {
          font-size: 12px;
          color: #BCAAA4;
          line-height: 1.65;
          margin: 0;
        }

        .saas-cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        .saas-card-item {
          background: #FAF6EE;
          border: 1.5px solid #E8DFD0;
          border-radius: 10px;
          padding: 28px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }
        .saas-card-item:hover {
          border-color: #8D6E63;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
        }

        .saas-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .saas-status-badge {
          font-size: 10px;
          color: #8D6E63;
          font-weight: bold;
          letter-spacing: 0.5px;
        }

        .saas-category-badge {
          font-size: 10px;
          background: rgba(141, 110, 99, 0.15);
          color: #5D4037;
          border-radius: 12px;
          padding: 2px 8px;
          font-weight: bold;
          letter-spacing: 0.5px;
        }

        .saas-card-name {
          font-size: 20px;
          color: #3E2723;
          margin: 0 0 6px;
          font-weight: bold;
        }

        .saas-card-title-link {
          color: #3E2723;
          text-decoration: none;
        }
        .saas-card-title-link:hover {
          color: #8D6E63;
        }

        .saas-card-subtitle {
          font-size: 12px;
          color: #8C7355;
          margin-bottom: 14px;
        }

        .saas-card-description {
          font-size: 13px;
          line-height: 1.65;
          color: #5D4037;
          margin: 0 0 18px;
        }

        .saas-card-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 22px;
        }

        .tech-pill {
          background: rgba(141, 110, 99, 0.1);
          border: 1px solid rgba(141, 110, 99, 0.2);
          border-radius: 12px;
          color: #5D4037;
          font-size: 11px;
          padding: 3px 10px;
        }

        .saas-card-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: auto;
          flex-wrap: wrap;
        }

        .saas-detail-btn {
          font-size: 12px;
          background: #8D6E63;
          color: #FAF6EE;
          text-decoration: none;
          font-weight: bold;
          padding: 9px 18px;
          border-radius: 20px;
          letter-spacing: 0.5px;
          transition: background 0.2s;
        }
        .saas-detail-btn:hover {
          background: #6D4C41;
        }

        .saas-live-btn {
          font-size: 12px;
          color: #8D6E63;
          text-decoration: none;
          font-weight: bold;
          border: 1px solid rgba(141, 110, 99, 0.4);
          padding: 8px 16px;
          border-radius: 20px;
          transition: all 0.2s;
        }
        .saas-live-btn:hover {
          background: rgba(141, 110, 99, 0.1);
          border-color: #8D6E63;
        }

        /* Footer CTA */
        .saas-footer-cta {
          border-top: 1px solid rgba(141, 110, 99, 0.15);
          padding: 56px 24px;
          background: rgba(26, 10, 8, 0.5);
        }

        .saas-footer-inner {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }

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
          margin: 0 0 28px;
        }

        .footer-buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-block;
          background-color: #FAF6EE;
          color: #3E2723;
          padding: 12px 28px;
          border-radius: 4px;
          text-decoration: none;
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 0.5px;
          transition: all 0.2s;
        }
        .btn-primary:hover {
          background-color: #8D6E63;
          color: #FAF6EE;
          transform: translateY(-1px);
        }

        .btn-secondary {
          display: inline-block;
          border: 1px solid rgba(141, 110, 99, 0.4);
          color: #FAF6EE;
          padding: 12px 24px;
          border-radius: 4px;
          text-decoration: none;
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 0.5px;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          border-color: #FAF6EE;
          background: rgba(250, 246, 238, 0.08);
        }
      `}</style>
    </div>
  );
}
