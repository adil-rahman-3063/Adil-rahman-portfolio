'use client';
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ProjectModal({ project, onClose }) {
  const [activeTab, setActiveTab] = useState('notes'); // notes | readme | preview
  const [readme, setReadme] = useState('');
  const [loadingReadme, setLoadingReadme] = useState(false);

  // GitHub repository path mapping
  const githubRepoMap = {
    zmr: 'adil-rahman-3063/zmr',
    leadflow: 'adil-rahman-3063/LeadFlow_AI',
    viewpick: 'adil-rahman-3063/viewpick',
    telestore: 'adil-rahman-3063/telestore',
    calert: 'Dayal-Joy/C-Alert',
    poshan: 'adil-rahman-3063/poshan_abhiyaan',
  };

  const repoPath = githubRepoMap[project.id];
  const liveUrlLink = project.links?.find((l) => l.url.startsWith('http') && !l.url.includes('github.com'));
  const liveUrl = liveUrlLink ? liveUrlLink.url : null;
  const isShopify = liveUrl && liveUrl.includes('myshopify.com');

  useEffect(() => {
    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (activeTab === 'readme' && repoPath && !readme) {
      setLoadingReadme(true);
      const fetchReadme = async () => {
        try {
          let response = await fetch(`https://raw.githubusercontent.com/${repoPath}/main/README.md`);
          if (!response.ok) {
            response = await fetch(`https://raw.githubusercontent.com/${repoPath}/master/README.md`);
          }
          if (response.ok) {
            const text = await response.text();
            setReadme(text);
          } else {
            setReadme('Could not load README from GitHub.');
          }
        } catch (e) {
          setReadme('Failed to fetch README.');
        } finally {
          setLoadingReadme(false);
        }
      };
      fetchReadme();
    }
  }, [activeTab, repoPath, readme]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header containing Tabs & Close button */}
        <div className="modal-header">
          <div className="modal-tabs">
            <button
              onClick={() => setActiveTab('notes')}
              className={`modal-tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
            >
              <span className="tab-icon">📖</span> Developer Notes
            </button>
            {repoPath && (
              <button
                onClick={() => setActiveTab('readme')}
                className={`modal-tab-btn ${activeTab === 'readme' ? 'active' : ''}`}
              >
                <span className="tab-icon">📄</span> README.md
              </button>
            )}
            {liveUrl && (
              <button
                onClick={() => setActiveTab('preview')}
                className={`modal-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
              >
                <span className="tab-icon">💻</span> Interactive Preview
              </button>
            )}
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {activeTab === 'notes' && (
            <div className="notes-tab">
              {/* Title Section */}
              <div className="title-section">
                <h2 className="project-title-handwritten">{project.title}</h2>
                <div className="project-subtitle-mono">{project.subtitle} // {project.status}</div>
              </div>

              <hr className="modal-divider" />

              <p className="notes-desc">{project.description}</p>
              
              {project.features && project.features.length > 0 && (
                <div className="features-section">
                  <h4 className="notes-section-title">// DEVELOPMENT NOTES & INTEGRATIONS</h4>
                  <ul className="notes-list">
                    {project.features.map((feat, idx) => (
                      <li key={idx} className="notes-list-item">
                        <span className="bullet">✍</span>
                        <span className="list-text">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.tech && project.tech.length > 0 && (
                <div className="tech-section">
                  <h4 className="notes-section-title">// TECHNOLOGY COMPONENT TAGS</h4>
                  <div className="tech-block-pill">
                    {project.tech.join('; ')}
                  </div>
                </div>
              )}

              {project.links && project.links.length > 0 && (
                <div className="modal-footer">
                  {project.links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="footer-action-btn"
                    >
                      {link.text.toUpperCase()} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'readme' && (
            <div className="readme-tab">
              {loadingReadme ? (
                <div className="loading-state">Loading repository README...</div>
              ) : (
                <div className="markdown-body">
                  <ReactMarkdown>{readme}</ReactMarkdown>
                </div>
              )}
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="preview-tab">
              {isShopify ? (
                <div className="shopify-block">
                  <div className="shopify-icon">🏪</div>
                  <h3>Shopify Storefront Preview</h3>
                  <p>
                    For checkout security and domain protection, Shopify storefronts do not allow embedding inside live preview frames.
                  </p>
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="footer-action-btn"
                    style={{ display: 'inline-block', alignSelf: 'center' }}
                  >
                    OPEN STOREFRONT ↗
                  </a>
                </div>
              ) : (
                <iframe
                  src={liveUrl}
                  title={`${project.title} Live Preview`}
                  className="preview-iframe"
                />
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(35, 21, 19, 0.6); /* Warm overlay tint */
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999 !important; /* Ensure it floats above the cozy nav capsule */
          padding: 24px;
        }

        .modal-content {
          background-color: #F4EFEA; /* Light Cream background matching original design */
          border: 1px solid rgba(141, 110, 99, 0.2);
          border-radius: 16px;
          width: 100%;
          max-width: 820px;
          max-height: 88vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(35, 21, 19, 0.25);
        }

        .modal-header {
          padding: 16px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1.5px solid rgba(141, 110, 99, 0.15);
          background-color: rgba(244, 239, 234, 0.8);
        }

        .modal-tabs {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .modal-tab-btn {
          background: transparent;
          border: 1px solid transparent;
          border-radius: 20px;
          padding: 8px 16px;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: bold;
          color: #8D6E63;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease-in-out;
        }
        .modal-tab-btn:hover {
          color: #3E2723;
        }
        .modal-tab-btn.active {
          color: #3E2723;
          background-color: #E8DFD0;
          border-color: #8D6E63;
        }

        .tab-icon {
          font-size: 14px;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: #8D6E63;
          font-size: 28px;
          cursor: pointer;
          line-height: 1;
          padding: 0 4px;
          transition: color 0.2s;
        }
        .modal-close-btn:hover {
          color: #3E2723;
        }

        .modal-body {
          padding: 36px 40px;
          overflow-y: auto;
          flex-grow: 1;
          background-color: #F4EFEA;
        }

        /* Title and Subtitle */
        .title-section {
          margin-bottom: 20px;
        }

        .project-title-handwritten {
          font-family: var(--font-handwritten);
          font-size: 42px;
          color: #3E2723;
          margin: 0 0 6px 0;
          font-weight: normal;
          line-height: 1.1;
        }

        .project-subtitle-mono {
          font-family: var(--font-mono);
          font-size: 12px;
          color: #8C7355;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .modal-divider {
          border: 0;
          height: 1.5px;
          background-color: rgba(141, 110, 99, 0.15);
          margin: 0 0 24px 0;
        }

        /* Notes Tab Content */
        .notes-tab {
          display: flex;
          flex-direction: column;
        }

        .notes-desc {
          font-family: var(--font-mono);
          font-size: 14px;
          color: #3E2723;
          line-height: 1.6;
          margin: 0 0 28px 0;
        }

        .notes-section-title {
          font-family: var(--font-mono);
          font-size: 12px;
          color: #8C7355;
          margin: 0 0 16px 0;
          font-weight: bold;
          letter-spacing: 0.5px;
        }

        .features-section {
          margin-bottom: 28px;
        }

        .notes-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .notes-list-item {
          font-family: var(--font-mono);
          font-size: 13px;
          color: #5D4037;
          line-height: 1.6;
          display: flex;
          align-items: flex-start;
        }

        .notes-list-item .bullet {
          color: #8C7355;
          margin-right: 12px;
          font-size: 12px;
          margin-top: 2px;
        }

        .notes-list-item .list-text {
          flex: 1;
        }

        /* Tech block styling matching screenshot single-pill */
        .tech-section {
          margin-bottom: 32px;
        }

        .tech-block-pill {
          font-family: var(--font-mono);
          font-size: 13px;
          color: #5D4037;
          border: 1px solid #8D6E63;
          border-radius: 6px;
          padding: 10px 16px;
          background-color: #FDFBF7;
          display: inline-block;
          line-height: 1.4;
        }

        /* Modal Footer Action Button */
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: auto;
          padding-top: 12px;
        }

        .footer-action-btn {
          background-color: #FAF6EE;
          border: 1.5px solid #8D6E63;
          border-radius: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: bold;
          color: #3E2723;
          padding: 12px 24px;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.2s, color 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .footer-action-btn:hover {
          background-color: #8D6E63;
          color: #FAF6EE;
        }

        /* Readme Tab */
        .readme-tab {
          font-family: var(--font-mono);
          color: #3E2723;
          background-color: #FDFBF7;
          border: 1px solid rgba(141, 110, 99, 0.15);
          border-radius: 8px;
          padding: 24px;
          min-height: 300px;
        }

        .loading-state {
          font-family: var(--font-mono);
          color: #8D6E63;
          text-align: center;
          padding: 60px 0;
        }

        /* Markdown body overrides inside light cream mode */
        .markdown-body h1, .markdown-body h2, .markdown-body h3 {
          color: #3E2723;
          font-family: var(--font-header);
          margin-top: 24px;
          margin-bottom: 12px;
          border-bottom: 1px solid rgba(141, 110, 99, 0.15);
          padding-bottom: 6px;
        }
        .markdown-body p, .markdown-body li {
          line-height: 1.6;
          font-size: 13px;
          color: #5D4037;
        }
        .markdown-body a {
          color: #8D6E63;
          text-decoration: underline;
        }
        .markdown-body code {
          background-color: rgba(141, 110, 99, 0.08);
          color: #8D6E63;
          padding: 2px 4px;
          border-radius: 4px;
        }

        /* Interactive Preview Frame */
        .preview-tab {
          width: 100%;
          height: 480px;
        }

        .preview-iframe {
          width: 100%;
          height: 100%;
          border: 1px solid rgba(141, 110, 99, 0.15);
          background-color: white;
          border-radius: 8px;
        }

        .shopify-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 100%;
          padding: 40px;
          background-color: #FDFBF7;
          border: 1px solid rgba(141, 110, 99, 0.15);
          border-radius: 8px;
        }

        .shopify-icon {
          font-size: 54px;
          margin-bottom: 16px;
        }

        .shopify-block h3 {
          font-family: var(--font-header);
          font-size: 20px;
          color: #3E2723;
          margin: 0 0 12px 0;
          border-bottom: none;
        }

        .shopify-block p {
          font-family: var(--font-mono);
          font-size: 13px;
          color: #8D6E63;
          max-width: 450px;
          margin: 0 0 24px 0;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
