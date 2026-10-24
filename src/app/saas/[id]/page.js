import { allProjects } from '../../../data/projectsData';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const SITE_URL = 'https://adilrahman.cc';

// Required for next static export — generates a route for each project
export async function generateStaticParams() {
  return allProjects.map((project) => ({ id: project.id }));
}

// GitHub repository mapping for deep repo inspection
const githubRepoMap = {
  zmr: 'adil-rahman-3063/zmr',
  leadflow: 'adil-rahman-3063/LeadFlow_AI',
  viewpick: 'adil-rahman-3063/viewpick',
  telestore: 'adil-rahman-3063/telestore',
  teledrive: 'adil-rahman-3063/teledrive',
  'resume-editor': 'adil-rahman-3063/Resume-Editor',
  'membership-saas': 'adil-rahman-3063/Membership-app',
  calert: 'Dayal-Joy/C-Alert',
  poshan: 'adil-rahman-3063/poshan_abhiyaan',
};

// Per-SaaS SEO metadata
export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = allProjects.find((p) => p.id === id);
  if (!project) return {};

  const cleanTitle = `${project.title} — SaaS & Cloud App | Adil Rahman`.slice(0, 60);
  const cleanDescription = (project.tagline || project.description || '').slice(0, 155);

  return {
    title: {
      absolute: cleanTitle,
    },
    description: cleanDescription,
    keywords: [
      project.title,
      `${project.title} SaaS`,
      'Adil Rahman SaaS',
      'full-stack SaaS development',
      'cloud software',
      ...(project.tech || []),
    ],
    openGraph: {
      title: cleanTitle,
      description: cleanDescription,
      url: `${SITE_URL}/saas/${id}`,
      type: 'website',
      siteName: 'Adil Rahman Portfolio & SaaS',
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description: cleanDescription,
      creator: '@adilrahmanms',
    },
    alternates: {
      canonical: `/saas/${id}`,
    },
  };
}

// ── JSON-LD SoftwareApplication Schema ───────────────────────────────────────
function SoftwareJsonLd({ project }) {
  const liveUrl = project.links?.find((l) => l.url?.startsWith('http') && !l.url?.includes('github.com'))?.url || `${SITE_URL}/saas/${project.id}`;
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    headline: project.subtitle,
    description: project.tagline || project.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
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
    url: liveUrl,
    keywords: (project.tech || []).join(', '),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function SaasDetailPage({ params }) {
  const { id } = await params;
  const project = allProjects.find((p) => p.id === id);
  if (!project) notFound();

  const repoPath = githubRepoMap[project.id];
  const liveUrlLink = project.links?.find((l) => l.url?.startsWith('http') && !l.url?.includes('github.com'));
  const liveUrl = liveUrlLink ? liveUrlLink.url : null;
  const githubLink = project.links?.find((l) => l.url?.includes('github.com'))?.url || (repoPath ? `https://github.com/${repoPath}` : null);

  return (
    <>
      <SoftwareJsonLd project={project} />
      <div className="saas-page">
        {/* ── Navigation ── */}
        <nav className="saas-nav">
          <div className="saas-nav-left">
            <Link href="/" className="saas-nav-link">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="#8D6E63" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Portfolio
            </Link>
            <span className="saas-nav-sep">/</span>
            <Link href="/saas" className="saas-nav-link">
              All SaaS
            </Link>
          </div>
          <span className="saas-nav-brand">ADIL RAHMAN // SAAS</span>
        </nav>

        {/* ── Hero / Header ── */}
        <header className="saas-hero">
          <div className="saas-container">
            <div className="saas-meta-badge-row">
              <span className="saas-badge">// CLOUD APPLICATION</span>
              <span className="saas-status-pill">{project.status}</span>
            </div>

            <h1 className="saas-title">{project.title}</h1>
            <p className="saas-subtitle">{project.subtitle}</p>

            <p className="saas-tagline">{project.tagline || project.description}</p>

            {/* Action Buttons */}
            <div className="saas-cta-group">
              {liveUrl && (
                <a href={liveUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  Launch Live Application ↗
                </a>
              )}
              {githubLink && (
                <a href={githubLink} target="_blank" rel="noreferrer" className="btn-secondary">
                  View Source on GitHub ↗
                </a>
              )}
              <Link href="/#contact" className="btn-outline">
                Request Custom SaaS Build
              </Link>
            </div>
          </div>
        </header>

        {/* ── Main Content ── */}
        <main className="saas-main">
          <div className="saas-container">
            {/* Overview Card */}
            <section className="saas-card">
              <h2 className="section-heading">// ARCHITECTURAL OVERVIEW</h2>
              <p className="section-body">{project.description}</p>
            </section>

            {/* Key Features */}
            {project.features && project.features.length > 0 && (
              <section className="saas-card">
                <h2 className="section-heading">// CORE CAPABILITIES & SYSTEM FEATURES</h2>
                <div className="features-grid">
                  {project.features.map((feat, idx) => (
                    <div key={idx} className="feature-item">
                      <span className="feature-number">{String(idx + 1).padStart(2, '0')}.</span>
                      <p className="feature-text">{feat}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tech Stack */}
            {project.tech && project.tech.length > 0 && (
              <section className="saas-card">
                <h2 className="section-heading">// TECHNOLOGY COMPONENT STACK</h2>
                <div className="tech-chips-list">
                  {project.tech.map((techItem, idx) => (
                    <span key={idx} className="tech-chip">
                      {techItem}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Launch Banner if live */}
            {liveUrl && (
              <section className="launch-banner">
                <div className="launch-banner-inner">
                  <h2 className="launch-heading">Try {project.title} Directly in Your Browser</h2>
                  <p className="launch-sub">
                    This software is live, tested, and actively deployed. Test out its features, response times, and interactive workflows directly.
                  </p>
                  <a href={liveUrl} target="_blank" rel="noreferrer" className="btn-primary large">
                    Open {project.title} Live App ↗
                  </a>
                </div>
              </section>
            )}
          </div>
        </main>

        {/* ── Footer CTA ── */}
        <footer className="saas-footer-cta">
          <div className="saas-container text-center">
            <p className="footer-label">// LOOKING TO BUILD A SAAS PRODUCT?</p>
            <h2 className="footer-title">Need a Custom MVP or Enterprise Platform?</h2>
            <p className="footer-desc">
              I build high-performance web applications, multi-tenant B2B architectures, Flutter cross-platform PWAs, and custom SaaS tools with rapid turnaround.
            </p>
            <div className="footer-btn-row">
              <Link href="/#contact" className="btn-primary">
                Get a Development Quote
              </Link>
              <Link href="/saas" className="btn-secondary">
                Explore Other SaaS Projects
              </Link>
            </div>
          </div>
        </footer>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');

          .saas-page {
            min-height: 100vh;
            background: linear-gradient(180deg, #1A0A08 0%, #231513 100%);
            color: #EFEBE9;
            font-family: 'Special Elite', monospace;
          }

          .saas-container {
            max-width: 820px;
            margin: 0 auto;
            padding: 0 24px;
          }

          /* Nav */
          .saas-nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 18px 28px;
            border-bottom: 1px solid rgba(141, 110, 99, 0.2);
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(26, 10, 8, 0.92);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
          }

          .saas-nav-left {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .saas-nav-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: #8D6E63;
            text-decoration: none;
            font-size: 12px;
            font-weight: bold;
            transition: color 0.2s;
          }
          .saas-nav-link:hover { color: #FAF6EE; }

          .saas-nav-sep {
            color: rgba(141, 110, 99, 0.4);
            font-size: 12px;
          }

          .saas-nav-brand {
            font-size: 11px;
            color: rgba(141, 110, 99, 0.6);
            letter-spacing: 2px;
          }

          /* Hero */
          .saas-hero {
            padding: 64px 0 40px;
            border-bottom: 1px solid rgba(141, 110, 99, 0.15);
          }

          .saas-meta-badge-row {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
            flex-wrap: wrap;
          }

          .saas-badge {
            font-size: 11px;
            color: #8D6E63;
            letter-spacing: 1.5px;
            font-weight: bold;
          }

          .saas-status-pill {
            font-size: 10px;
            color: #8C7355;
            background: rgba(141, 110, 99, 0.12);
            border: 1px solid rgba(141, 110, 99, 0.3);
            border-radius: 12px;
            padding: 3px 10px;
            letter-spacing: 0.5px;
          }

          .saas-title {
            font-size: clamp(28px, 6vw, 44px);
            font-weight: bold;
            color: #FAF6EE;
            line-height: 1.25;
            margin: 0 0 12px;
            letter-spacing: 0.5px;
          }

          .saas-subtitle {
            font-size: 14px;
            color: #8C7355;
            margin: 0 0 20px;
            letter-spacing: 0.5px;
          }

          .saas-tagline {
            font-size: 15px;
            line-height: 1.7;
            color: #BCAAA4;
            margin: 0 0 32px;
          }

          .saas-cta-group {
            display: flex;
            align-items: center;
            gap: 14px;
            flex-wrap: wrap;
          }

          /* Buttons */
          .btn-primary {
            display: inline-block;
            background: linear-gradient(135deg, #8D6E63 0%, #6D4C41 100%);
            color: #FAF6EE;
            text-decoration: none;
            border-radius: 30px;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 0.5px;
            padding: 13px 26px;
            transition: all 0.2s;
            box-shadow: 0 4px 14px rgba(141, 110, 99, 0.3);
            border: none;
          }
          .btn-primary:hover {
            opacity: 0.95;
            transform: translateY(-1px);
            box-shadow: 0 6px 18px rgba(141, 110, 99, 0.4);
          }
          .btn-primary.large {
            padding: 15px 32px;
            font-size: 13px;
          }

          .btn-secondary {
            display: inline-block;
            background: rgba(42, 21, 16, 0.7);
            border: 1px solid rgba(141, 110, 99, 0.35);
            color: #FAF6EE;
            text-decoration: none;
            border-radius: 30px;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 0.5px;
            padding: 12px 24px;
            transition: all 0.2s;
          }
          .btn-secondary:hover {
            border-color: #8D6E63;
            background: rgba(141, 110, 99, 0.2);
            transform: translateY(-1px);
          }

          .btn-outline {
            display: inline-block;
            border: 1px solid rgba(141, 110, 99, 0.25);
            color: #BCAAA4;
            text-decoration: none;
            border-radius: 30px;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 0.5px;
            padding: 12px 22px;
            transition: all 0.2s;
          }
          .btn-outline:hover {
            color: #FAF6EE;
            border-color: #FAF6EE;
          }

          /* Main */
          .saas-main {
            padding: 48px 0 64px;
          }

          .saas-card {
            background: rgba(42, 21, 16, 0.45);
            border: 1px solid rgba(141, 110, 99, 0.22);
            border-radius: 12px;
            padding: 32px;
            margin-bottom: 24px;
          }

          .section-heading {
            font-size: 13px;
            color: #8D6E63;
            letter-spacing: 1.5px;
            font-weight: bold;
            margin: 0 0 16px;
          }

          .section-body {
            font-size: 14px;
            line-height: 1.8;
            color: #D7CCC8;
            margin: 0;
          }

          /* Features */
          .features-grid {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .feature-item {
            display: flex;
            align-items: flex-start;
            gap: 14px;
            background: rgba(26, 10, 8, 0.4);
            border: 1px solid rgba(141, 110, 99, 0.15);
            border-radius: 8px;
            padding: 16px 20px;
          }

          .feature-number {
            font-size: 13px;
            color: #8D6E63;
            font-weight: bold;
            flex-shrink: 0;
            margin-top: 1px;
          }

          .feature-text {
            font-size: 13px;
            line-height: 1.65;
            color: #EFEBE9;
            margin: 0;
          }

          /* Tech Chips */
          .tech-chips-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }

          .tech-chip {
            background: rgba(141, 110, 99, 0.12);
            border: 1px solid rgba(141, 110, 99, 0.3);
            border-radius: 20px;
            color: #FAF6EE;
            font-size: 12px;
            padding: 6px 16px;
            letter-spacing: 0.5px;
          }

          /* Launch Banner */
          .launch-banner {
            margin-top: 36px;
            background: linear-gradient(135deg, rgba(42, 21, 16, 0.9) 0%, rgba(26, 10, 8, 0.95) 100%);
            border: 1.5px solid rgba(141, 110, 99, 0.4);
            border-radius: 16px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
          }

          .launch-heading {
            font-size: 22px;
            color: #FAF6EE;
            margin: 0 0 12px;
            font-weight: bold;
          }

          .launch-sub {
            font-size: 13px;
            line-height: 1.65;
            color: #BCAAA4;
            max-width: 560px;
            margin: 0 auto 24px;
          }

          /* Footer CTA */
          .saas-footer-cta {
            border-top: 1px solid rgba(141, 110, 99, 0.15);
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
            line-height: 1.65;
            color: #BCAAA4;
            max-width: 580px;
            margin: 0 auto 28px;
          }

          .footer-btn-row {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 14px;
            flex-wrap: wrap;
          }

          @media (max-width: 600px) {
            .saas-card { padding: 22px; }
            .launch-banner { padding: 28px 20px; }
          }
        `}</style>
      </div>
    </>
  );
}
