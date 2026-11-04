'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteFooter from '../../../components/SiteFooter';
import { PROJECT_CATEGORIES, getCategoryProjects, fetchProjectsFromSupabase } from '../../../data/projectsData';

function renderProjectCard(project, categorySlug, defaultBadge) {
  const liveUrlLink = project.links?.find((l) => l.url?.startsWith('http') && !l.url?.includes('github.com'));
  const liveUrl = liveUrlLink ? liveUrlLink.url : null;
  const projectHref = `/project/${categorySlug}/${project.id}`;

  return (
    <article key={project.id} className="project-card-item">
      <div className="project-card-top">
        <span className="project-status-badge">{project.status}</span>
        <span className="project-category-badge">{defaultBadge}</span>
      </div>

      <h2 className="project-card-name">
        <Link href={projectHref} className="project-card-title-link">
          {project.title}
        </Link>
      </h2>
      <div className="project-card-subtitle">{project.subtitle}</div>

      <p className="project-card-description">{project.tagline || project.description}</p>

      {project.tech && project.tech.length > 0 && (
        <div className="project-card-tech">
          {project.tech.map((t, i) => (
            <span key={i} className="tech-pill">{t}</span>
          ))}
        </div>
      )}

      <div className="project-card-actions">
        <Link href={projectHref} className="project-detail-btn">
          System Architecture & Specs →
        </Link>
        {liveUrl && (
          <a href={liveUrl} target="_blank" rel="noreferrer" className="project-live-btn">
            Launch Live App ↗
          </a>
        )}
      </div>
    </article>
  );
}

export default function CategoryDirectoryClient({ category, initialProjects = [], allInitialProjects = [] }) {
  const [allProjectsList, setAllProjectsList] = useState(allInitialProjects);

  // Sync live from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    const sync = async () => {
      try {
        const live = await fetchProjectsFromSupabase();
        if (isMounted && Array.isArray(live) && live.length > 0) {
          setAllProjectsList(live);
        }
      } catch (err) {
        console.warn('Live fetch warning in category directory:', err);
      }
    };
    sync();
    return () => { isMounted = false; };
  }, []);

  const normCategory = category === 'personal' ? 'personal-project' : category;
  const cat = PROJECT_CATEGORIES[normCategory] || PROJECT_CATEGORIES['personal-project'];

  const projects = getCategoryProjects(normCategory, allProjectsList);
  const saasCount = getCategoryProjects('saas', allProjectsList).length;
  const freelanceCount = getCategoryProjects('freelance', allProjectsList).length;
  const personalCount = getCategoryProjects('personal-project', allProjectsList).length;

  return (
    <div className="category-directory-page">
      {/* ── Navigation ── */}
      <nav className="category-nav">
        <div className="nav-left">
          <Link href="/project" className="category-back-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="#8D6E63" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All Projects
          </Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{cat.name}</span>
        </div>
        <Link href="/" className="category-home-link">
          Portfolio
        </Link>
      </nav>

      {/* ── Header ── */}
      <header className="category-header">
        <div className="category-header-inner">
          <span className="category-tag">// {cat.badge}</span>
          <h1 className="category-title">{cat.name}</h1>
          <p className="category-excerpt">{cat.description}</p>

          {/* ── Category Switcher Chips ── */}
          <div className="category-switcher-bar">
            <span className="switcher-label">FILTER CATEGORIES:</span>
            <div className="switcher-chips">
              <Link href="/project" className="switcher-chip">
                All Projects ({allProjectsList.length})
              </Link>
              <Link
                href="/project/saas"
                className={`switcher-chip ${normCategory === 'saas' ? 'active' : ''}`}
              >
                SaaS & Cloud Apps ({saasCount})
              </Link>
              <Link
                href="/project/freelance"
                className={`switcher-chip ${normCategory === 'freelance' ? 'active' : ''}`}
              >
                Freelance & Client ({freelanceCount})
              </Link>
              <Link
                href="/project/personal-project"
                className={`switcher-chip ${normCategory === 'personal-project' ? 'active' : ''}`}
              >
                Personal & Open-Source ({personalCount})
              </Link>
            </div>
          </div>

          <div className="category-stats-bar">
            <div className="stat-pill">
              <span className="stat-label">COUNT</span>
              <span className="stat-val">{projects.length} System{projects.length === 1 ? '' : 's'}</span>
            </div>
            <div className="stat-pill">
              <span className="stat-label">ENGINEER</span>
              <span className="stat-val">Adil Rahman</span>
            </div>
            <div className="stat-pill">
              <span className="stat-label">SOURCE</span>
              <span className="stat-val">Live Supabase Database</span>
            </div>
          </div>

          <div className="category-header-line" />
        </div>
      </header>

      {/* ── Projects Grid ── */}
      <main className="category-main">
        <div className="category-grid-container">
          {projects.length === 0 ? (
            <div className="no-projects-msg">
              <p>No projects found in this category yet.</p>
              <Link href="/project" className="btn-return">
                Back to Projects Hub
              </Link>
            </div>
          ) : (
            <div className="category-cards-grid">
              {projects.map((project) =>
                renderProjectCard(project, normCategory, cat.badge)
              )}
            </div>
          )}

          {/* ── Category Architecture & Engineering Standards (SEO & Technical Substance) ── */}
          {normCategory === 'saas' && (
            <section className="projects-philosophy-card">
              <h2 className="phil-heading">// MULTI-TENANT SAAS ENGINEERING PRINCIPLES</h2>
              <div className="phil-grid">
                <div className="phil-col">
                  <span className="phil-num">01</span>
                  <h3>Tenant Schema Isolation & Strict RLS</h3>
                  <p>
                    Every multi-tenant platform engineered by Adil Rahman implements Row-Level Security (RLS) directly in PostgreSQL. Tenants are cryptographically segmented to guarantee zero data bleeding, with sub-millisecond query execution across high-concurrency environments.
                  </p>
                </div>
                <div className="phil-col">
                  <span className="phil-num">02</span>
                  <h3>Event-Driven Webhooks & Billing Pipelines</h3>
                  <p>
                    Decoupled webhooks integrate with UPI payment networks, Stripe, and Razorpay. Background reconciliation engines handle recurring subscriptions, proration, and payment failures automatically, triggering instant transactional notifications via WhatsApp and email.
                  </p>
                </div>
                <div className="phil-col">
                  <span className="phil-num">03</span>
                  <h3>Edge-Cached Global Infrastructure</h3>
                  <p>
                    Built with Next.js App Router and Cloudflare Edge Proxies. Static assets, API route caching, and sliding-window rate limiting prevent DDoS attacks and provide sub-50ms Time to First Byte (TTFB) for users across mobile and desktop.
                  </p>
                </div>
              </div>
            </section>
          )}

          {normCategory === 'freelance' && (
            <section className="projects-philosophy-card">
              <h2 className="phil-heading">// FREELANCE DELIVERY & CLIENT COLLABORATION STANDARDS</h2>
              <div className="phil-grid">
                <div className="phil-col">
                  <span className="phil-num">01</span>
                  <h3>Rapid 1–3 Week MVP Delivery</h3>
                  <p>
                    Tight sprint cadences turn early Figma wireframes and client requirements into live, production-grade applications. Zero agency overhead means direct Slack or WhatsApp communication with the engineer writing your code.
                  </p>
                </div>
                <div className="phil-col">
                  <span className="phil-num">02</span>
                  <h3>Clean Code & Zero Vendor Lock-in</h3>
                  <p>
                    Every project is delivered with structured Git repositories, clean pull requests, environment variable templates, and automated Docker build pipelines so internal teams can take over maintenance effortlessly.
                  </p>
                </div>
                <div className="phil-col">
                  <span className="phil-num">03</span>
                  <h3>Performance & Conversion Optimization</h3>
                  <p>
                    Custom Liquid themes and responsive web applications engineered for sub-1.2s Largest Contentful Paint (LCP) and 90+ Google PageSpeed scores, maximizing conversion funnels and mobile user retention.
                  </p>
                </div>
              </div>
            </section>
          )}

          {normCategory === 'personal-project' && (
            <section className="projects-philosophy-card">
              <h2 className="phil-heading">// OPEN-SOURCE & SYSTEMS ARCHITECTURE PHILOSOPHY</h2>
              <div className="phil-grid">
                <div className="phil-col">
                  <span className="phil-num">01</span>
                  <h3>Offline-First & Privacy Preserving</h3>
                  <p>
                    Utilities engineered with zero third-party telemetry. Core calculations, astronomical coordinate algorithms, and document manipulations run entirely client-side using device storage and on-device WebAssembly.
                  </p>
                </div>
                <div className="phil-col">
                  <span className="phil-num">02</span>
                  <h3>Cross-Platform Native Compilations</h3>
                  <p>
                    Leveraging Flutter and modern web stacks to compile high-performance binaries across Android, iOS, and Progressive Web Apps from single, maintainable codebases without sacrificing 60 FPS gesture responsiveness.
                  </p>
                </div>
                <div className="phil-col">
                  <span className="phil-num">03</span>
                  <h3>Public Auditable Codebases</h3>
                  <p>
                    Complete source code for developer tools and open-source mobile projects is publicly hosted on GitHub with transparent release notes, MIT licensing, and documented issue trackers.
                  </p>
                </div>
              </div>
            </section>
          )}

        </div>
      </main>

      {/* ── Blog-Style Footer CTA & Site Links ── */}
      <SiteFooter
        ctaLabel="// NEED A SIMILAR SYSTEM ENGINEERED?"
        ctaTitle={`Ready to Build Your ${cat.name} Product?`}
        ctaDesc="Adil Rahman is available for custom contract software engineering, mobile development, and full-stack SaaS builds."
        primaryBtn={{ label: "Request a Custom Quote →", href: "/?quote=open#contact" }}
        secondaryBtn={{ label: "Explore Engineering Services", href: "/services" }}
        tertiaryBtn={{ label: "All Projects Hub", href: "/project" }}
      />
    </div>
  );
}
