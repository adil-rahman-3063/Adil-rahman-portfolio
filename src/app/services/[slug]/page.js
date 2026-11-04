import { allServices } from '../../../data/servicesData';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SiteFooter from '../../../components/SiteFooter';

const SITE_URL = 'https://adilrahman.cc';

export async function generateStaticParams() {
  return allServices.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = allServices.find((s) => s.slug === slug);
  if (!service) return {};

  return {
    title: {
      absolute: service.seoTitle,
    },
    description: service.metaDesc.slice(0, 155),
    keywords: [
      service.title,
      'freelance developer',
      'hire software engineer',
      'Adil Rahman services',
      slug.replace('-', ' '),
    ],
    openGraph: {
      title: service.seoTitle,
      description: service.metaDesc,
      url: `${SITE_URL}/services/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: service.seoTitle,
      description: service.metaDesc,
      creator: '@adilrahmanms',
    },
    alternates: {
      canonical: `/services/${slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = allServices.find((s) => s.slug === slug);
  if (!service) notFound();

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    serviceType: service.badge,
    description: service.metaDesc,
    provider: {
      '@type': 'Person',
      name: 'Adil Rahman',
      url: SITE_URL,
      jobTitle: 'Full-Stack & Mobile Engineer',
    },
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: service.heroTitle,
      itemListElement: (service.deliverables || []).map((item) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: item,
        },
      })),
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Portfolio',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: `${SITE_URL}/services`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: service.title,
        item: `${SITE_URL}/services/${slug}`,
      },
    ],
  };

  const faqSchema = service.directAnswer ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: service.directAnswer.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: service.directAnswer.answer,
        },
      },
    ],
  } : null;

  return (
    <div className="service-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {/* ── Navigation ── */}
      <nav className="service-nav">
        <div className="service-nav-left">
          <Link href="/" className="service-nav-link">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="#8D6E63" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Portfolio
          </Link>
          <span className="service-nav-sep">/</span>
          <Link href="/services" className="service-nav-link">
            Services
          </Link>
        </div>
        <span className="service-nav-brand">ADIL RAHMAN // HIRE</span>
      </nav>

      {/* ── Hero Section ── */}
      <header className="service-hero">
        <div className="service-container">
          <span className="service-badge">// {service.badge}</span>
          <h1 className="service-title">{service.heroTitle}</h1>
          <p className="service-subtitle">{service.heroSubtitle}</p>
          <p className="service-tagline">{service.tagline}</p>

          <div className="service-cta-row">
            <Link href="/#contact" className="btn-primary">
              Request a Custom Quote
            </Link>
            <a href="https://wa.me/919207114070" target="_blank" rel="noreferrer" className="btn-secondary">
              Chat Directly on WhatsApp ↗
            </a>
          </div>
        </div>
      </header>

      {/* ── Deliverables & Capabilities ── */}
      <main className="service-main">
        <div className="service-container">
          <section className="service-card">
            <h2 className="section-title">// SCOPE & DELIVERABLES</h2>
            <div className="deliverables-grid">
              {service.deliverables.map((item, idx) => (
                <div key={idx} className="deliverable-item">
                  <span className="deliverable-bullet">✓</span>
                  <p className="deliverable-text">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Proof of Work */}
          <section className="service-card">
            <h2 className="section-title">// PROVEN CLIENT & PORTFOLIO BUILDS</h2>
            <div className="proof-grid">
              {service.projectsFeatured.map((p, idx) => (
                <div key={idx} className="proof-item">
                  <h3 className="proof-name">{p.name}</h3>
                  <p className="proof-desc">{p.desc}</p>
                  <Link href={`/saas/${p.id}`} className="proof-link">
                    Explore Architecture & Specs →
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Direct Answer Block (AI Extractable Passage) */}
          {service.directAnswer && (
            <section className="service-card direct-answer-card">
              <h2 className="section-title">// QUICK ANSWER & TIMELINE</h2>
              <h3 className="direct-answer-question">{service.directAnswer.question}</h3>
              <p className="direct-answer-text">{service.directAnswer.answer}</p>
            </section>
          )}

          {/* Architectural Comparison Table (GEO Extraction Magnet) */}
          {service.comparisonTable && (
            <section className="service-card comparison-card">
              <h2 className="section-title">// ARCHITECTURAL COMPARISON</h2>
              <h3 className="comparison-table-title">{service.comparisonTable.title}</h3>
              <div className="table-responsive">
                <table className="geo-table">
                  <thead>
                    <tr>
                      {service.comparisonTable.headers.map((h, i) => (
                        <th key={i} className={i === 1 ? 'col-highlight' : ''}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {service.comparisonTable.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className={cIdx === 1 ? 'cell-highlight' : ''}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="comparison-summary">{service.comparisonTable.summary}</p>
            </section>
          )}

          {/* Turnaround Guarantee */}
          <section className="turnaround-card">
            <h2 className="turnaround-heading">Turnaround & Commitment</h2>
            <p className="turnaround-text">{service.turnaround}</p>
            <p className="turnaround-sub">
              Direct access via Slack, WhatsApp, or email. Daily progress updates, zero bloated agency overhead, and guaranteed milestone delivery.
            </p>
          </section>
        </div>
      </main>

      {/* ── Blog-Style Footer CTA & Site Links ── */}
      <SiteFooter
        ctaLabel="// READY TO START?"
        ctaTitle="Let's Build Your Next Project"
        ctaDesc="Submit your feature specifications, budget targets, and timeline to receive a structured architecture breakdown and quote."
        primaryBtn={{ label: "Contact Adil Rahman →", href: "/#contact" }}
        secondaryBtn={{ label: "All Services Hub", href: "/services" }}
        tertiaryBtn={{ label: "Projects Hub", href: "/project" }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');

        .service-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #1A0A08 0%, #231513 100%);
          color: #EFEBE9;
          font-family: 'Special Elite', monospace;
        }

        .service-container {
          max-width: 820px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .service-nav {
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

        .service-nav-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .service-nav-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #8D6E63;
          text-decoration: none;
          font-size: 12px;
          font-weight: bold;
          transition: color 0.2s;
        }
        .service-nav-link:hover { color: #FAF6EE; }

        .service-nav-sep {
          color: rgba(141, 110, 99, 0.4);
          font-size: 12px;
        }

        .service-nav-brand {
          font-size: 11px;
          color: rgba(141, 110, 99, 0.6);
          letter-spacing: 2px;
        }

        .service-hero {
          padding: 64px 0 44px;
          border-bottom: 1px solid rgba(141, 110, 99, 0.15);
        }

        .service-badge {
          font-size: 11px;
          color: #8D6E63;
          letter-spacing: 1.5px;
          font-weight: bold;
          display: block;
          margin-bottom: 14px;
        }

        .service-title {
          font-size: clamp(28px, 6vw, 42px);
          font-weight: bold;
          color: #FAF6EE;
          line-height: 1.25;
          margin: 0 0 12px;
          letter-spacing: 0.5px;
        }

        .service-subtitle {
          font-size: 15px;
          color: #8C7355;
          margin: 0 0 20px;
          letter-spacing: 0.5px;
        }

        .service-tagline {
          font-size: 14px;
          line-height: 1.75;
          color: #BCAAA4;
          margin: 0 0 32px;
        }

        .service-cta-row {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }

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
          padding: 15px 36px;
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

        .service-main {
          padding: 48px 0 64px;
        }

        .service-card {
          background: rgba(42, 21, 16, 0.45);
          border: 1px solid rgba(141, 110, 99, 0.22);
          border-radius: 12px;
          padding: 32px;
          margin-bottom: 24px;
        }

        .section-title {
          font-size: 13px;
          color: #8D6E63;
          letter-spacing: 1.5px;
          font-weight: bold;
          margin: 0 0 20px;
        }

        .deliverables-grid {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .deliverable-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(26, 10, 8, 0.4);
          border: 1px solid rgba(141, 110, 99, 0.15);
          border-radius: 8px;
          padding: 14px 18px;
        }

        .deliverable-bullet {
          color: #8D6E63;
          font-weight: bold;
          font-size: 14px;
        }

        .deliverable-text {
          font-size: 13px;
          line-height: 1.6;
          color: #EFEBE9;
          margin: 0;
        }

        .proof-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 650px) {
          .proof-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .proof-item {
          background: #FAF6EE;
          border: 1.5px solid #E8DFD0;
          border-radius: 8px;
          padding: 22px;
          display: flex;
          flex-direction: column;
        }

        .proof-name {
          font-size: 17px;
          color: #3E2723;
          margin: 0 0 8px;
          font-weight: bold;
        }

        .proof-desc {
          font-size: 12px;
          line-height: 1.6;
          color: #5D4037;
          margin: 0 0 16px;
          flex-grow: 1;
        }

        .proof-link {
          font-size: 11px;
          color: #8D6E63;
          text-decoration: none;
          font-weight: bold;
          align-self: flex-start;
        }
        .proof-link:hover {
          text-decoration: underline;
        }

        .direct-answer-card {
          background: rgba(42, 21, 16, 0.6);
          border: 1px solid rgba(140, 115, 85, 0.45);
        }

        .direct-answer-question {
          font-size: 17px;
          font-weight: bold;
          color: #FAF6EE;
          margin: 0 0 10px;
        }

        .direct-answer-text {
          font-size: 13.5px;
          line-height: 1.75;
          color: #D7CCC8;
          margin: 0;
        }

        .comparison-table-title {
          font-size: 16px;
          font-weight: bold;
          color: #FAF6EE;
          margin: 0 0 16px;
        }

        .table-responsive {
          overflow-x: auto;
          margin: 16px 0;
          border-radius: 8px;
          border: 1px solid rgba(141, 110, 99, 0.25);
        }

        .geo-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          text-align: left;
        }

        .geo-table th {
          padding: 12px 14px;
          background: rgba(26, 10, 8, 0.85);
          color: #BCAAA4;
          border-bottom: 1px solid rgba(141, 110, 99, 0.3);
          font-weight: bold;
          white-space: nowrap;
        }

        .geo-table td {
          padding: 12px 14px;
          border-bottom: 1px solid rgba(141, 110, 99, 0.15);
          color: #EFEBE9;
          vertical-align: top;
          line-height: 1.5;
        }

        .geo-table tr:last-child td {
          border-bottom: none;
        }

        .geo-table .col-highlight,
        .geo-table .cell-highlight {
          background: rgba(141, 110, 99, 0.15);
          color: #FAF6EE;
          font-weight: bold;
        }

        .comparison-summary {
          font-size: 13px;
          color: #8C7355;
          margin: 14px 0 0;
          line-height: 1.6;
          font-style: italic;
        }

        .turnaround-card {
          background: linear-gradient(135deg, rgba(42, 21, 16, 0.9) 0%, rgba(26, 10, 8, 0.95) 100%);
          border: 1.5px solid rgba(141, 110, 99, 0.35);
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          margin-top: 32px;
        }

        .turnaround-heading {
          font-size: 20px;
          color: #FAF6EE;
          margin: 0 0 10px;
          font-weight: bold;
        }

        .turnaround-text {
          font-size: 14px;
          color: #8C7355;
          font-weight: bold;
          margin: 0 0 12px;
        }

        .turnaround-sub {
          font-size: 13px;
          line-height: 1.6;
          color: #BCAAA4;
          max-width: 580px;
          margin: 0 auto;
        }

        .service-footer {
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
          line-height: 1.6;
          color: #BCAAA4;
          max-width: 540px;
          margin: 0 auto 28px;
        }

        @media (max-width: 600px) {
          .service-card { padding: 22px; }
          .turnaround-card { padding: 24px 18px; }
        }
      `}</style>
    </div>
  );
}
