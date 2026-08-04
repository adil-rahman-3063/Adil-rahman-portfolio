'use client';
import React from 'react';

export default function FreelanceSection({ projects = [], onProjectClick }) {
  // Filter projects by freelance category
  const freelanceProjects = projects.filter((p) => p.categories.includes('freelance'));

  if (freelanceProjects.length === 0) return null;

  return (
    <section id="freelance" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '32px' }}>
        <span style={{
          fontFamily: 'var(--font-handwritten)',
          fontSize: '26px',
          color: '#8C7355',
          marginRight: '8px'
        }}>
          05 // 
        </span>
        <h2 style={{
          fontFamily: 'var(--font-header)',
          fontSize: '22px',
          color: '#EFEBE9',
          fontWeight: 'bold',
          letterSpacing: '1.0px',
          margin: 0
        }}>
          FREELANCE CLIENT WORK
        </h2>
      </div>

      {/* Grid of freelance client projects */}
      <div className="projects-grid">
        {freelanceProjects.map((project) => (
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
    </section>
  );
}
