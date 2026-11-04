'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteFooter from '../../components/SiteFooter';
import { getCategoryProjects, fetchProjectsFromSupabase } from '../../data/projectsData';

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

      <h3 className="project-card-name">
        <Link href={projectHref} className="project-card-title-link">
          {project.title}
        </Link>
      </h3>
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

export default function ProjectsHubClient({ initialProjects = [] }) {
  const [projects, setProjects] = useState(initialProjects);

  // Sync live from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    const sync = async () => {
      try {
        const live = await fetchProjectsFromSupabase();
        if (isMounted && Array.isArray(live) && live.length > 0) {
          setProjects(live);
        }
      } catch (err) {
        console.warn('Live fetch warning in projects hub:', err);
      }
    };
    sync();
    return () => { isMounted = false; };
  }, []);

  const saasProjects = getCategoryProjects('saas', projects);
  const freelanceProjects = getCategoryProjects('freelance', projects);
  const personalProjects = getCategoryProjects('personal-project', projects);

  return (
    <div className="projects-hub-page">
      {/* ── Navigation ── */}
      <nav className="projects-nav">
        <Link href="/" className="projects-back-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="#8D6E63" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Portfolio
        </Link>
        <span className="projects-nav-brand">ADIL RAHMAN // PROJECTS HUB</span>
      </nav>

      {/* ── Header ── */}
      <header className="projects-header">
        <div className="projects-header-inner">
          <span className="projects-tag">// REPOSITORY & WORK ARCHIVE</span>
          <h1 className="projects-title">Featured Projects & Systems</h1>
          <p className="projects-excerpt">
            Explore live multi-tenant SaaS products, freelance client storefronts, and open-source mobile tools engineered for scale, speed, and real-world utility.
          </p>

          {/* ── Category Quick-Filter Switcher ── */}
          <div className="category-switcher-bar">
            <span className="switcher-label">EXPLORE BY CATEGORY:</span>
            <div className="switcher-chips">
              <span className="switcher-chip active">All Projects ({projects.length})</span>
              <Link href="/project/saas" className="switcher-chip">
                SaaS & Cloud Apps ({saasProjects.length})
              </Link>
              <Link href="/project/freelance" className="switcher-chip">
                Freelance & Client ({freelanceProjects.length})
              </Link>
              <Link href="/project/personal-project" className="switcher-chip">
                Personal & Open-Source ({personalProjects.length})
              </Link>
            </div>
          </div>

          <div className="projects-author-card">
            <p className="projects-author-text">
              Every system featured here was designed, developed, or deployed by <strong>Adil Rahman</strong>. 
              Covering Flutter mobile apps, multi-tenant Next.js platforms with Supabase edge layers, 
              custom Shopify Liquid architectures, and high-performance offline PWAs. Click any project for complete system specs, challenges, and live URLs.
            </p>
          </div>

          <div className="projects-header-line" />
        </div>
      </header>

      {/* ── Projects Sections ── */}
      <main className="projects-main">
        <div className="projects-grid-container">

          {/* Category 1: SaaS & Cloud Platforms */}
          {saasProjects.length > 0 && (
            <section className="category-tier-section" id="saas">
              <div className="tier-header">
                <div className="tier-title-row">
                  <div>
                    <span className="tier-badge">CATEGORY 01</span>
                    <h2 className="tier-heading">// SAAS & CLOUD PLATFORMS</h2>
                  </div>
                  <Link href="/project/saas" className="tier-view-all-link">
                    View All SaaS ({saasProjects.length}) →
                  </Link>
                </div>
                <p className="tier-desc">
                  Multi-tenant subscription software, membership management, and cloud apps.
                </p>
              </div>
              <div className="projects-cards-grid">
                {saasProjects.map((project) => renderProjectCard(project, 'saas', 'SAAS // B2B'))}
              </div>
            </section>
          )}

          {/* Category 2: Freelance & Client Work */}
          {freelanceProjects.length > 0 && (
            <section className="category-tier-section" id="freelance">
              <div className="tier-header">
                <div className="tier-title-row">
                  <div>
                    <span className="tier-badge">CATEGORY 02</span>
                    <h2 className="tier-heading">// FREELANCE & CLIENT SYSTEMS</h2>
                  </div>
                  <Link href="/project/freelance" className="tier-view-all-link">
                    View All Freelance ({freelanceProjects.length}) →
                  </Link>
                </div>
                <p className="tier-desc">
                  High-converting custom Shopify storefronts, ticket verification portals with dynamic QR generation, and institutional demo schedulers.
                </p>
              </div>
              <div className="projects-cards-grid">
                {freelanceProjects.map((project) => renderProjectCard(project, 'freelance', 'CLIENT // BESPOKE'))}
              </div>
            </section>
          )}

          {/* Category 3: Personal & Open-Source Projects */}
          {personalProjects.length > 0 && (
            <section className="category-tier-section" id="personal">
              <div className="tier-header">
                <div className="tier-title-row">
                  <div>
                    <span className="tier-badge">CATEGORY 03</span>
                    <h2 className="tier-heading">// PERSONAL & OPEN-SOURCE PROJECTS</h2>
                  </div>
                  <Link href="/project/personal-project" className="tier-view-all-link">
                    View All Personal ({personalProjects.length}) →
                  </Link>
                </div>
                <p className="tier-desc">
                  Gesture-based mobile audio engines, offline-first healthcare trackers, on-device AI deepfake forensics, and creative experiments.
                </p>
              </div>
              <div className="projects-cards-grid">
                {personalProjects.map((project) => renderProjectCard(project, 'personal-project', 'PERSONAL // LABS'))}
              </div>
            </section>
          )}

          {/* Architecture & Engineering Standards */}
          <section className="projects-philosophy-card">
            <h2 className="phil-heading">// ENGINEERING & ARCHITECTURE PILLARS</h2>
            <div className="phil-grid">
              <div className="phil-col">
                <span className="phil-num">01</span>
                <h3>Zero Lock-In Data Architecture</h3>
                <p>
                  Platforms like AR Membership Manager sync directly with Google Sheets and Supabase. Clients retain full ownership of their member records and operational telemetry without vendor lock-in.
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

      {/* ── Blog-Style Footer CTA & Site Links ── */}
      <SiteFooter
        ctaLabel="// READY TO BUILD A PRODUCTION SYSTEM?"
        ctaTitle="Need a Production System Engineered?"
        ctaDesc="Available for full-stack Next.js platforms, cross-platform Flutter mobile applications, and custom Shopify storefronts worldwide."
        primaryBtn={{ label: "Request a Custom Quote →", href: "/?quote=open#contact" }}
        secondaryBtn={{ label: "Explore Engineering Services", href: "/services" }}
      />
    </div>
  );
}
