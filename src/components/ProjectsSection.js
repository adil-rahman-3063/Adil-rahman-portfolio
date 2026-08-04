'use client';
import React, { useState } from 'react';

const categories = [
  { id: 'all', label: 'ALL' },
  { id: 'featured', label: 'FEATURED' },
  { id: 'mobile', label: 'MOBILE' },
  { id: 'web-backend', label: 'WEB & BACKEND' },
  { id: 'personal', label: 'PERSONAL' },
];

export default function ProjectsSection({ projects = [], onProjectClick }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProjects = projects.filter((p) => {
    // Exclude any project that has freelance category
    if (p.categories.includes('freelance')) return false;
    
    if (activeCategory === 'all') return true;
    return p.categories.includes(activeCategory);
  });

  return (
    <section id="projects" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '32px' }}>
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
          PERSONAL PROJECTS
        </h2>
      </div>

      {/* Tabs */}
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

      {/* Project Grid */}
      <div className="projects-grid">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => onProjectClick?.(project)}
            className="project-card"
          >
            <span className="project-status">{project.status}</span>
            <h3 className="project-title">{project.title}</h3>
            <span className="project-subtitle">{project.subtitle}</span>
            <p className="project-tagline">{project.tagline}</p>
            <div className="project-tech-tags">
              {project.tech.map((t, idx) => (
                <span key={idx} className="tech-tag">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .tabs-container {
          display: flex;
          gap: 8px;
          margin-bottom: 32px;
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
          padding: 8px 16px;
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
          background-color: #FAF6EE;
          border: 1.5px solid #E8DFD0;
          border-radius: 8px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.06);
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .project-card:hover {
          border-color: #8D6E63;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .project-status {
          font-family: var(--font-mono);
          font-size: 10px;
          color: #8C7355;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
          font-weight: bold;
        }

        .project-title {
          font-family: var(--font-header);
          font-size: 18px;
          color: #3E2723;
          font-weight: bold;
          margin: 0 0 4px 0;
        }

        .project-subtitle {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #8D6E63;
          margin-bottom: 16px;
        }

        .project-tagline {
          font-family: var(--font-mono);
          font-size: 12px;
          color: #5D4037;
          line-height: 1.5;
          margin: 0 0 20px 0;
          flex-grow: 1;
        }

        .project-tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .tech-tag {
          font-family: var(--font-mono);
          font-size: 10px;
          background-color: rgba(141, 110, 99, 0.1);
          color: #8D6E63;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: bold;
        }
      `}</style>
    </section>
  );
}
