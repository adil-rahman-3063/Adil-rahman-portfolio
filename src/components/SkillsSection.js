'use client';
import React from 'react';

const skillsData = [
  {
    title: 'MOBILE DEV',
    items: ['Flutter & Dart', 'Native Integrations', 'PWA & Responsive Web', 'Local Storage & Caching'],
  },
  {
    title: 'BACKEND & DB',
    items: ['Supabase (PostgreSQL)', 'Firebase Suite', 'FastAPI (Python)', 'RESTful APIs'],
  },
  {
    title: 'WEB & UI/UX',
    items: ['HTML5 / CSS3 / Vanilla JS', 'Modern Responsive Design', 'Glassmorphism & Shadows', 'Figma UI/UX Mockups'],
  },
  {
    title: 'AI & WORKFLOW',
    items: ['OpenAI API Integrations', 'Multilingual NLP parsing', 'Git / GitHub Actions', 'Linux CLI / Scripting'],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Section Title */}
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '36px' }}>
        <span style={{
          fontFamily: 'var(--font-handwritten)',
          fontSize: '26px',
          color: '#8C7355',
          marginRight: '8px'
        }}>
          03 // 
        </span>
        <h2 style={{
          fontFamily: 'var(--font-header)',
          fontSize: '22px',
          color: '#EFEBE9',
          fontWeight: 'bold',
          letterSpacing: '1.0px',
          margin: 0
        }}>
          TECH STACK & SKILLS
        </h2>
      </div>

      {/* Grid of Columns */}
      <div className="skills-columns-grid">
        {skillsData.map((col, i) => (
          <div key={i} className="skill-column">
            <h3 className="skill-column-title">{col.title}</h3>
            <div className="skill-column-divider" />
            <ul className="skill-column-list">
              {col.items.map((item, j) => (
                <li key={j} className="skill-column-item">
                  <span className="skill-item-bullet">-</span>
                  <span className="skill-item-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Separator Line */}
      <div className="skills-bottom-divider" />

      <style jsx global>{`
        .skills-columns-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          width: 100%;
        }
        @media (min-width: 600px) {
          .skills-columns-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
        }
        @media (min-width: 900px) {
          .skills-columns-grid {
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 48px;
          }
        }

        .skill-column {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
        }

        .skill-column-title {
          font-family: var(--font-header);
          font-size: 15px;
          color: #8C7355; /* vintage gold */
          font-weight: bold;
          letter-spacing: 1.0px;
          margin: 0 0 8px 0;
          text-transform: uppercase;
        }

        .skill-column-divider {
          width: 100%;
          height: 1.5px;
          background-color: rgba(232, 223, 208, 0.15); /* light paper border opacity */
          margin-bottom: 20px;
        }

        .skill-column-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        .skill-column-item {
          font-family: var(--font-mono);
          font-size: 13px;
          color: #EFEBE9; /* light cream text */
          line-height: 1.5;
          display: flex;
          align-items: flex-start;
        }

        .skill-item-bullet {
          color: #8C7355;
          font-weight: bold;
          margin-right: 10px;
        }

        .skill-item-text {
          flex: 1;
        }

        .skills-bottom-divider {
          width: 100%;
          height: 1.5px;
          background-color: rgba(232, 223, 208, 0.15);
          margin-top: 36px;
        }
      `}</style>
    </section>
  );
}
