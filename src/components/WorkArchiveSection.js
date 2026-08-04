'use client';
import React, { useState } from 'react';

const categories = [
  { id: 'all', label: 'ALL' },
  { id: 'featured', label: 'FEATURED' },
  { id: 'mobile', label: 'MOBILE' },
  { id: 'web-backend', label: 'WEB & BACKEND' },
  { id: 'personal', label: 'PERSONAL' },
];

export default function WorkArchiveSection({ projects = [], onProjectClick }) {
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter personal projects (exclude freelance)
  const personalProjects = projects.filter((p) => {
    if (p.categories.includes('freelance')) return false;
    if (activeCategory === 'all') return true;
    return p.categories.includes(activeCategory);
  });

  // Filter freelance projects
  const freelanceProjects = projects.filter((p) => p.categories.includes('freelance'));

  return (
    <section id="work-archive" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '40px' }}>
        <span style={{
          fontFamily: 'var(--font-handwritten)',
          fontSize: '26px',
          color: '#8C7355',
          marginRight: '8px'
        }}>
          04 // 
        </span>
        <h2 style={{
          fontFamily: 'var(--font-header)',
          fontSize: '22px',
          color: '#EFEBE9',
          fontWeight: 'bold',
          letterSpacing: '1.0px',
          margin: 0
        }}>
          WORK ARCHIVE
        </h2>
      </div>

      {/* SUBSECTION 1: PERSONAL PROJECTS */}
      <div className="archive-subsection-title">// PERSONAL PROJECTS</div>
      
      {/* Filter Tabs for Personal Projects */}
      <div className="tabs-container">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Personal Projects Grid */}
      <div className="projects-grid" style={{ marginBottom: '48px' }}>
        {personalProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => onProjectClick?.(project)}
            className="project-card"
          >
            <div className="project-status-text">
              {project.status.toUpperCase()} // {project.subtitle.toUpperCase()}
            </div>
            <h3 className="project-card-title">{project.title}</h3>
            <p className="project-card-desc">{project.tagline}</p>
            {project.tech && project.tech.length > 0 && (
              <div className="project-card-tech-box">
                {project.tech.join('; ')}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* SUBSECTION 2: FREELANCE PROJECTS */}
      <div className="archive-subsection-title">// FREELANCE PROJECTS</div>

      {/* Freelance Projects Grid */}
      <div className="projects-grid">
        {freelanceProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => onProjectClick?.(project)}
            className="project-card"
          >
            <div className="project-status-text">
              {project.status.toUpperCase()} // {project.subtitle.toUpperCase()}
            </div>
            <h3 className="project-card-title">{project.title}</h3>
            <p className="project-card-desc">{project.tagline}</p>
            {project.tech && project.tech.length > 0 && (
              <div className="project-card-tech-box">
                {project.tech.join('; ')}
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx global>{`
        .archive-subsection-title {
          font-family: var(--font-mono);
          font-size: 13px;
          color: #8C7355;
          margin-bottom: 24px;
          font-weight: bold;
          letter-spacing: 0.5px;
        }

        .tabs-container {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          overflow-x: auto;
          padding-bottom: 8px;
        }
        .tabs-container::-webkit-scrollbar {
          height: 4px;
        }
        .tabs-container::-webkit-scrollbar-thumb {
          background-color: #8C7355;
          border-radius: 2px;
        }

        .tab-btn {
          background: transparent;
          border: 1.5px solid #E8DFD0;
          border-radius: 20px;
          color: #BCAAA4;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: bold;
          padding: 8px 18px;
          cursor: pointer;
          white-space: nowrap;
          transition: border-color 0.2s, color 0.2s, background-color 0.2s;
        }
        .tab-btn:hover, .tab-btn.active {
          border-color: #8D6E63;
          color: #FAF6EE;
        }
        .tab-btn.active {
          background-color: #8D6E63;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          width: 100%;
        }
        @media (min-width: 600px) {
          .projects-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 900px) {
          .projects-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }

        .project-card {
          background-color: rgba(35, 21, 19, 0.4); /* Dark translucent background */
          border: 1px solid rgba(141, 110, 99, 0.4); /* Cozy theme brown border */
          border-radius: 8px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .project-card:hover {
          border-color: #8D6E63;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
          transform: translateY(-2px);
        }

        .project-status-text {
          font-family: var(--font-mono);
          font-size: 10px;
          color: #8C7355;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
          font-weight: bold;
        }

        .project-card-title {
          font-family: var(--font-header);
          font-size: 20px;
          color: #FAF6EE;
          font-weight: bold;
          margin: 0 0 12px 0;
        }

        .project-card-desc {
          font-family: var(--font-mono);
          font-size: 12px;
          color: #BCAAA4;
          line-height: 1.6;
          margin: 0 0 24px 0;
          flex-grow: 1;
        }

        .project-card-tech-box {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #8C7355;
          border: 1px solid rgba(141, 110, 99, 0.4);
          border-radius: 4px;
          padding: 6px 12px;
          align-self: flex-start;
          line-height: 1.4;
        }
      `}</style>
    </section>
  );
}
