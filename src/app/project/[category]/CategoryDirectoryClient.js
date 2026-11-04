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
