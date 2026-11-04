'use client';
import React from 'react';
import Link from 'next/link';

export default function ToolsSection() {
  return (
    <section id="tools" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
            TOOLS
          </h2>
        </div>
        <Link
          href="/tools"
          className="view-all-tools-chip"
          style={{ color: '#8D6E63', textDecoration: 'none' }}
        >
          Explore Tools Hub (/tools) →
        </Link>
      </div>

      <div className="tools-subsection-title">// BROWSER UTILITIES & DEVELOPER APPS</div>

      {/* Tools Grid */}
      <div className="tools-grid">
        {/* Tool Card: Resume Builder */}
        <div className="tool-card featured-tool-card">
          <div className="tool-card-top">
            <span className="tool-status-text">100% FREE // ACTIVE TOOL</span>
            <span className="tool-badge">NO WATERMARK · ZERO LOGIN</span>
          </div>

          <h3 className="tool-card-title">
            <Link
              href="/tools/resume-builder"
              className="tool-card-title-link"
              style={{ color: '#FAF6EE', textDecoration: 'none' }}
            >
              Free ATS Resume & CV Builder
            </Link>
          </h3>
          <div className="tool-card-subtitle">
            Interactive ATS Resume & Design PDF Engine // Vanilla JS
          </div>

          <p className="tool-card-desc">
            Modern browser-based resume builder featuring live WYSIWYG editing, parser-safe single-column ATS export with custom section sequence badges, 6 curated theme palettes, and instant offline localStorage persistence. Zero login, zero paywalls, zero watermarks.
          </p>

          <div className="tool-tech-pills">
            <span className="tech-pill">Vanilla JavaScript</span>
            <span className="tech-pill">Print CSS Engines</span>
            <span className="tech-pill">ATS Safe Parser</span>
            <span className="tech-pill">6 Theme Palettes</span>
            <span className="tech-pill">LocalStorage API</span>
            <span className="tech-pill">100% Client-Side</span>
          </div>

          <div className="tool-card-actions">
            <Link
              href="/tools/resume-builder"
              className="tool-launch-btn"
              style={{ color: '#FAF6EE', textDecoration: 'none' }}
            >
              Launch Free Builder ↗
            </Link>
            <Link
              href="/project/personal-project/resume-editor"
              className="tool-specs-btn"
              style={{ color: '#8C7355', textDecoration: 'none' }}
            >
              Technical Architecture & Specs →
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .tools-subsection-title {
          font-family: var(--font-mono);
          font-size: 13px;
          color: #8C7355;
          margin-bottom: 24px;
          font-weight: bold;
          letter-spacing: 0.5px;
        }

        .view-all-tools-chip,
        .view-all-tools-chip:visited {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #8D6E63 !important;
          text-decoration: none !important;
          font-weight: bold;
          border: 1px solid rgba(141, 110, 99, 0.35);
          padding: 4px 12px;
          border-radius: 16px;
          transition: all 0.2s;
        }
        .view-all-tools-chip:hover {
          background-color: #8D6E63;
          color: #FAF6EE !important;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          width: 100%;
        }

        .tool-card {
          background-color: rgba(35, 21, 19, 0.45);
          border: 1px solid rgba(141, 110, 99, 0.35);
          border-radius: 8px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .tool-card:hover {
          border-color: #8D6E63;
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.4);
          transform: translateY(-2px);
        }

        .featured-tool-card {
          border-left: 3px solid #8C7355;
        }

        .tool-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tool-status-text {
          font-family: var(--font-mono);
          font-size: 10px;
          color: #8C7355;
          letter-spacing: 0.8px;
          font-weight: bold;
        }

        .tool-badge {
          font-family: var(--font-mono);
          font-size: 9px;
          color: #FAF6EE;
          background: rgba(140, 115, 85, 0.3);
          border: 1px solid rgba(140, 115, 85, 0.6);
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.8px;
        }

        .tool-card-title {
          font-family: var(--font-header);
          font-size: 22px;
          color: #FAF6EE !important;
          font-weight: bold;
          margin: 0 0 6px 0;
        }

        .tool-card-title-link,
        .tool-card-title-link:visited {
          color: #FAF6EE !important;
          text-decoration: none !important;
          transition: color 0.2s;
        }
        .tool-card-title-link:hover {
          color: #D7CCC8 !important;
        }

        .tool-card-subtitle {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: #8C7355;
          margin-bottom: 14px;
        }

        .tool-card-desc {
          font-family: var(--font-mono);
          font-size: 13px;
          color: #BCAAA4;
          line-height: 1.65;
          margin: 0 0 20px 0;
        }

        .tool-tech-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 22px;
        }

        .tech-pill {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: #FAF6EE;
          background: rgba(141, 110, 99, 0.15);
          border: 1px solid rgba(141, 110, 99, 0.35);
          padding: 3px 8px;
          border-radius: 4px;
        }

        .tool-card-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-top: 16px;
          border-top: 1px dashed rgba(141, 110, 99, 0.2);
          flex-wrap: wrap;
        }

        .tool-launch-btn,
        .tool-launch-btn:visited {
          font-family: var(--font-mono);
          font-size: 12px;
          background: #8D6E63;
          color: #FAF6EE !important;
          padding: 7px 18px;
          border-radius: 16px;
          text-decoration: none !important;
          font-weight: bold;
          transition: opacity 0.2s;
        }
        .tool-launch-btn:hover {
          opacity: 0.85;
        }

        .tool-specs-btn,
        .tool-specs-btn:visited {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: #8C7355 !important;
          text-decoration: none !important;
          font-weight: bold;
          transition: color 0.2s;
        }
        .tool-specs-btn:hover {
          color: #FAF6EE !important;
        }
      `}</style>
    </section>
  );
}

