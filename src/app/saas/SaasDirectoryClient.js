'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteFooter from '../../components/SiteFooter';
import { getCategoryProjects, getProjectCategory, fetchProjectsFromSupabase } from '../../data/projectsData';

function renderProjectCard(project, defaultBadge) {
  const liveUrlLink = project.links?.find((l) => l.url?.startsWith('http') && !l.url?.includes('github.com'));
  const liveUrl = liveUrlLink ? liveUrlLink.url : null;
  const category = getProjectCategory(project.id, project);
  const detailHref = `/project/${category}/${project.id}`;

  return (
    <article key={project.id} className="saas-card-item">
      <div className="saas-card-top">
        <span className="saas-status-badge">{project.status}</span>
        <span className="saas-category-badge">{defaultBadge}</span>
      </div>

      <h3 className="saas-card-name">
        <Link href={detailHref} className="saas-card-title-link">
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
        <Link href={detailHref} className="saas-detail-btn">
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

export default function SaasDirectoryClient({ initialProjects = [] }) {
  const [projects, setProjects] = useState(initialProjects);

  useEffect(() => {
    let isMounted = true;
    const sync = async () => {
      try {
        const live = await fetchProjectsFromSupabase();
        if (isMounted && Array.isArray(live) && live.length > 0) {
          setProjects(live);
        }
      } catch (err) {
        console.warn('Saas directory sync error:', err);
      }
    };
    sync();
    return () => { isMounted = false; };
  }, []);

  const saasProjects = getCategoryProjects('saas', projects);
  const freelanceProjects = getCategoryProjects('freelance', projects);
  const personalProjects = getCategoryProjects('personal-project', projects);

  return (
    <div className="saas-directory-page">
      {/* ── Navigation ── */}
      <nav className="saas-nav">
        <div className="nav-left">
          <Link href="/" className="saas-back-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="#8D6E63" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Portfolio
          </Link>
          <span className="crumb-sep">/</span>
          <Link href="/project" className="saas-back-link">
            Projects Hub
          </Link>
        </div>
        <span className="saas-nav-brand">ADIL RAHMAN // SAAS DIRECTORY</span>
      </nav>

      {/* ── Hub Redirection Notice ── */}
      <div className="hub-notice-bar">
        <span>PROJECTS DIRECTORY HAS EXPANDED:</span>
        <Link href="/project" className="hub-notice-link">
          Explore All Categories at /project →
        </Link>
      </div>

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

          {/* Quick category filter links */}
          <div className="category-quick-bar">
            <span className="filter-title">EXPLORE BY CATEGORY:</span>
            <div className="filter-chips">
              <Link href="/project/saas" className="filter-chip active">
                SaaS Platforms ({saasProjects.length})
              </Link>
              <Link href="/project/freelance" className="filter-chip">
                Freelance Client Builds ({freelanceProjects.length})
              </Link>
              <Link href="/project/personal-project" className="filter-chip">
                Personal & Open-Source ({personalProjects.length})
              </Link>
              <Link href="/tools" className="filter-chip">
                Tools
              </Link>
              <Link href="/project" className="filter-chip">
                View All ({projects.length})
              </Link>
            </div>
          </div>

          <div className="saas-header-line" />
        </div>
      </header>

      {/* ── SaaS Directory Main Content ── */}
      <main className="saas-main">
        <div className="saas-grid-container">

          {/* Section 1: Flagship SaaS & Cloud Platforms */}
          <section className="saas-tier-section" id="saas-platforms">
            <div className="tier-header">
              <div className="tier-header-row">
                <div>
                  <span className="tier-badge">CATEGORY 01</span>
                  <h2 className="saas-section-subtitle">// CLOUD SAAS & B2B PLATFORMS</h2>
                </div>
                <Link href="/project/saas" className="tier-chip-link">
                  Dedicated /project/saas Directory →
                </Link>
              </div>
              <p className="tier-desc">
                Production-grade multi-tenant software, member management, and automated subscription operations.
              </p>
            </div>
            <div className="saas-cards-grid">
              {saasProjects.map((project) => renderProjectCard(project, 'B2B / SAAS'))}
            </div>
          </section>

          {/* Section 2: Freelance Client Builds */}
          <section className="saas-tier-section" id="freelance-systems">
            <div className="tier-header">
              <div className="tier-header-row">
                <div>
                  <span className="tier-badge">CATEGORY 02</span>
                  <h2 className="saas-section-subtitle">// FREELANCE & CLIENT SYSTEMS</h2>
                </div>
                <Link href="/project/freelance" className="tier-chip-link">
                  View All Freelance ({freelanceProjects.length}) →
                </Link>
              </div>
              <p className="tier-desc">
                Custom Shopify storefronts, dynamic QR event verification portals, and institutional scheduling software.
              </p>
            </div>
            <div className="saas-cards-grid">
              {freelanceProjects.map((project) => renderProjectCard(project, 'CLIENT // BESPOKE'))}
            </div>
          </section>

          {/* Section 3: Personal & Open-Source Projects */}
          <section className="saas-tier-section" id="personal-projects">
            <div className="tier-header">
              <div className="tier-header-row">
                <div>
                  <span className="tier-badge">CATEGORY 03</span>
                  <h2 className="saas-section-subtitle">// PERSONAL & OPEN-SOURCE PROJECTS</h2>
                </div>
                <Link href="/project/personal-project" className="tier-chip-link">
                  View All Personal ({personalProjects.length}) →
                </Link>
              </div>
              <p className="tier-desc">
                Gesture-based mobile audio engines, offline-first healthcare trackers, on-device AI deepfake forensics, and tools.
              </p>
            </div>
            <div className="saas-cards-grid">
              {personalProjects.map((project) => renderProjectCard(project, 'PERSONAL // LABS'))}
            </div>
          </section>

          {/* Engineering Philosophy Guide Section */}
          <section className="saas-philosophy-card">
            <h2 className="phil-heading">// SAAS ARCHITECTURE & ENGINEERING STANDARDS</h2>
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
        ctaLabel="// HAVE A SAAS IDEA?"
        ctaTitle="Need a Custom Software Solution Built?"
        ctaDesc="Available for freelance full-stack software development, MVPs, cross-platform apps, and automated workflows."
        primaryBtn={{ label: "Discuss Your SaaS Project →", href: "/?quote=open#contact" }}
        secondaryBtn={{ label: "View Developer Services", href: "/services" }}
        tertiaryBtn={{ label: "All Projects Hub", href: "/project" }}
      />
    </div>
  );
}
