'use client';
import React, { useState } from 'react';
import { allProjects } from '../data/projectsData';

export default function LiveWorkspaceSection({ projects = [] }) {
  // Filter projects that have live website urls
  const webProjects = projects.filter((p) =>
    p.links.some((l) => l.url.startsWith('http') && !l.url.includes('github.com'))
  );

  const [selectedProject, setSelectedProject] = useState(null);

  React.useEffect(() => {
    if (!selectedProject && webProjects.length > 0) {
      setSelectedProject(webProjects[0]);
    }
  }, [webProjects, selectedProject]);

  if (webProjects.length === 0) return null;

  const liveLink = selectedProject
    ? selectedProject.links.find((l) => l.url.startsWith('http') && !l.url.includes('github.com'))
    : null;
  const liveUrl = liveLink ? liveLink.url : '';
  const isShopify = liveUrl && liveUrl.includes('myshopify.com');

  return (
    <section id="workspace" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
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
          LIVE WORKSPACE PREVIEW
        </h2>
      </div>

      <div className="workspace-layout">
        {/* Left selector */}
        <div className="workspace-selector">
          <span className="selector-title">// SELECT PROJECT WEB LIVE VIEW</span>
          <div className="selector-list">
            {webProjects.map((p) => {
              const isSelected = selectedProject?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className={`selector-item ${isSelected ? 'active' : ''}`}
                >
                  <div className={`radio-dot ${isSelected ? 'checked' : ''}`} />
                  <div className="selector-info">
                    <span className="selector-item-title">{p.title}</span>
                    <span className="selector-item-tech">{p.tech.slice(0, 3).join(' • ')}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right browser mockup */}
        <div className="workspace-preview-window">
          {/* Mock Browser Bar */}
          <div className="browser-mock-bar">
            <span className="browser-arrow">◀</span>
            <span className="browser-arrow">▶</span>
            <div className="browser-url-container">
              <span className="browser-lock-icon">🔒</span>
              <span className="browser-url-text">{liveUrl}</span>
            </div>
            <span className="browser-refresh">↻</span>
          </div>

          {/* Browser Content */}
          <div className="browser-mock-body">
            {isShopify ? (
              <div className="shopify-block-ws">
                <span className="shopify-ws-icon">🏪</span>
                <h3>Shopify Storefront Preview</h3>
                <p>
                  For checkout security and domain protection, Shopify storefronts do not allow embedding inside live preview frames.
                </p>
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shopify-ws-btn"
                >
                  Open Storefront ↗
                </a>
              </div>
            ) : (
              liveUrl && (
                <iframe
                  src={liveUrl}
                  title={`${selectedProject?.title} Live Workspace`}
                  className="workspace-iframe"
                />
              )
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .workspace-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          width: 100%;
        }
        @media (min-width: 900px) {
          .workspace-layout {
            grid-template-columns: 3fr 5fr;
            gap: 40px;
          }
        }

        .workspace-selector {
          display: flex;
          flex-direction: column;
        }

        .selector-title {
          font-family: var(--font-header);
          font-size: 13px;
          color: #8D6E63;
          margin-bottom: 16px;
          font-weight: bold;
        }

        .selector-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .selector-item {
          background: transparent;
          border: 1.5px solid #E8DFD0;
          border-radius: 8px;
          padding: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: left;
          transition: background-color 0.25s, border-color 0.25s;
        }
        .selector-item.active {
          background-color: #FAF6EE;
          border-color: #8D6E63;
        }

        .radio-dot {
          width: 16px;
          height: 16px;
          border: 2px solid #BCAAA4;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .radio-dot.checked {
          border-color: #8D6E63;
          background-color: #8D6E63;
        }
        .radio-dot.checked::after {
          content: '';
          width: 6px;
          height: 6px;
          background-color: #FAF6EE;
          border-radius: 50%;
        }

        .selector-info {
          display: flex;
          flex-direction: column;
        }

        .selector-item-title {
          font-family: var(--font-mono);
          font-size: 14px;
          font-weight: bold;
          color: #EFEBE9;
        }
        .selector-item.active .selector-item-title {
          color: #3E2723;
        }

        .selector-item-tech {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #BCAAA4;
          margin-top: 4px;
        }
        .selector-item.active .selector-item-tech {
          color: #5D4037;
        }

        /* Preview Window */
        .workspace-preview-window {
          height: 420px;
          background-color: white;
          border-radius: 8px;
          border: 2px solid #E8DFD0;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .browser-mock-bar {
          background-color: #F5F5F5;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1.5px solid #E8DFD0;
        }

        .browser-arrow {
          font-size: 11px;
          color: #BCAAA4;
          cursor: pointer;
        }

        .browser-url-container {
          flex-grow: 1;
          background-color: white;
          border: 1.5px solid #E8DFD0;
          border-radius: 4px;
          padding: 4px 10px;
          display: flex;
          align-items: center;
          gap: 6px;
          max-width: 80%;
        }

        .browser-lock-icon {
          font-size: 10px;
        }

        .browser-url-text {
          font-family: sans-serif;
          font-size: 11px;
          color: #8D6E63;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .browser-refresh {
          font-size: 14px;
          color: #BCAAA4;
          cursor: pointer;
        }

        .browser-mock-body {
          flex-grow: 1;
          width: 100%;
          position: relative;
        }

        .workspace-iframe {
          width: 100%;
          height: 100%;
          border: none;
          background-color: white;
        }

        /* Shopify specific block */
        .shopify-block-ws {
          background-color: #231513;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 24px;
        }

        .shopify-ws-icon {
          font-size: 54px;
          color: #8C7355;
          margin-bottom: 16px;
        }

        .shopify-block-ws h3 {
          font-family: var(--font-header);
          font-size: 18px;
          color: #EFEBE9;
          font-weight: bold;
          margin: 0 0 8px 0;
        }

        .shopify-block-ws p {
          font-family: var(--font-mono);
          font-size: 12px;
          color: #BCAAA4;
          max-width: 400px;
          margin: 0 0 24px 0;
          line-height: 1.5;
        }

        .shopify-ws-btn {
          background-color: #8D6E63;
          color: #FAF6EE;
          border: none;
          border-radius: 30px;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: bold;
          padding: 12px 20px;
          text-decoration: none;
          display: inline-block;
          transition: background-color 0.2s;
        }
        .shopify-ws-btn:hover {
          background-color: #FAF6EE;
          color: #231513;
        }
      `}</style>
    </section>
  );
}
