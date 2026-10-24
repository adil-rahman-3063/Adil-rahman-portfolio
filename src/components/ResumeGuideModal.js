'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ResumeGuideModal({ initialOpen = true, triggerButtonText = '📖 How to Use' }) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const modalNode = isOpen && mounted ? (
    <div className="guide-modal-overlay" onClick={() => setIsOpen(false)}>
      <div
        className="guide-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-modal-title"
      >
            {/* Modal Header */}
            <div className="guide-modal-header">
              <div className="header-text-block">
                <span className="guide-tag">// QUICK START GUIDE</span>
                <h2 id="guide-modal-title" className="guide-title">
                  How to Use This ATS Resume Studio
                </h2>
                <p className="guide-subtitle">
                  A 60-second walkthrough on inline editing, ATS ordering, blank spaces, and PDF exports.
                </p>
              </div>
              <button
                type="button"
                className="guide-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close Guide"
              >
                ✕
              </button>
            </div>

            {/* Modal Content Grid */}
            <div className="guide-modal-body">
              <div className="guide-cards-grid">
                {/* 1. Inline Text Editing */}
                <div className="guide-step-card">
                  <div className="step-badge-row">
                    <span className="step-num">01</span>
                    <span className="step-badge">DIRECT EDIT</span>
                  </div>
                  <h3 className="step-title">Click & Edit Any Text</h3>
                  <p className="step-desc">
                    Click directly on any text — your name, role titles, companies, dates, summaries, and skills.
                    Everything is interactive WYSIWYG. Formatting toolbar appears on text selection.
                  </p>
                </div>

                {/* 2. Reordering points */}
                <div className="guide-step-card">
                  <div className="step-badge-row">
                    <span className="step-num">02</span>
                    <span className="step-badge">▲ ▼ REORDER</span>
                  </div>
                  <h3 className="step-title">Move Points Up & Down</h3>
                  <p className="step-desc">
                    Hover over any bullet point or experience block to reveal the <kbd className="guide-kbd">▲</kbd> and <kbd className="guide-kbd">▼</kbd> buttons.
                    Move items up or down instantly without cutting & pasting.
                  </p>
                </div>

                {/* 3. Blank Spaces */}
                <div className="guide-step-card">
                  <div className="step-badge-row">
                    <span className="step-num">03</span>
                    <span className="step-badge">+ SPACER</span>
                  </div>
                  <h3 className="step-title">Add Blank Space to Align</h3>
                  <p className="step-desc">
                    Click <span className="guide-inline-btn">+ Add blank space</span> at the bottom of any section.
                    This adds an adjustable vertical spacer so left & right columns align perfectly across printed pages.
                  </p>
                </div>

                {/* 4. ATS Sequencing */}
                <div className="guide-step-card">
                  <div className="step-badge-row">
                    <span className="step-num">04</span>
                    <span className="step-badge">ATS # ORDER</span>
                  </div>
                  <h3 className="step-title">Change ATS Parse Ordering</h3>
                  <p className="step-desc">
                    Notice the <span className="guide-ats-pill">ATS # 2</span> badge beside each section title?
                    Type a new number inside to customize the exact scanning sequence when generating your ATS PDF.
                  </p>
                </div>

                {/* 5. Theme Colors */}
                <div className="guide-step-card">
                  <div className="step-badge-row">
                    <span className="step-num">05</span>
                    <span className="step-badge">🎨 PALETTES</span>
                  </div>
                  <h3 className="step-title">Colors & Theming</h3>
                  <p className="step-desc">
                    Click the floating <span className="guide-colors-pill">🎨 Colors</span> button on the top-left of the document.
                    Select from 6 curated palettes (Teal, Forest, Slate, Burgundy, Charcoal) or input custom HEX colors.
                  </p>
                </div>

                {/* 6. Dual PDF Export */}
                <div className="guide-step-card highlight-card">
                  <div className="step-badge-row">
                    <span className="step-num">06</span>
                    <span className="step-badge">DUAL EXPORT</span>
                  </div>
                  <h3 className="step-title">Download Design vs ATS PDF</h3>
                  <p className="step-desc">
                    <strong>Design PDF:</strong> 2-column aesthetic for human hiring managers & emails.<br />
                    <strong>ATS PDF:</strong> 1-column parser-safe layout for job portals (Workday, Greenhouse).
                    <em>Tip: In print preview, turn off &ldquo;Headers and footers&rdquo;.</em>
                  </p>
                </div>
              </div>

              {/* Pro Tip Callout */}
              <div className="guide-pro-tip">
                <span className="tip-icon">💾</span>
                <p>
                  <strong>100% Private & Auto-Saved:</strong> Your data autosaves as you type into your browser&apos;s localStorage.
                  No account needed. Click <strong>Reset</strong> in the top toolbar to restore sample data anytime.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="guide-modal-footer">
              <div className="footer-left-info">
                <span>Press <kbd className="guide-kbd">Esc</kbd> anytime to dismiss</span>
              </div>
              <button
                type="button"
                className="guide-dismiss-btn"
                onClick={() => setIsOpen(false)}
              >
                Got It, Start Building Resume →
              </button>
            </div>
          </div>
        </div>
  ) : null;

  return (
    <>
      {/* ── Trigger button in top navigation ── */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="guide-trigger-btn"
        aria-label="Open Resume Builder Guide"
      >
        <span className="guide-icon">💡</span>
        <span>How to Use</span>
      </button>

      {/* ── Portal Modal Overlay Directly to Document Body ── */}
      {mounted && typeof document !== 'undefined' && createPortal(modalNode, document.body)}

      <style jsx global>{`
        .guide-trigger-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(141, 110, 99, 0.2);
          border: 1px solid rgba(141, 110, 99, 0.4);
          color: #FAF6EE;
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .guide-trigger-btn:hover {
          background: #8D6E63;
          border-color: #FAF6EE;
          transform: translateY(-1px);
        }

        .guide-icon {
          font-size: 13px;
        }

        .guide-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(10, 5, 4, 0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          overflow-y: auto;
          box-sizing: border-box;
          animation: guideFadeIn 0.2s ease-out;
        }

        @keyframes guideFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .guide-modal-card {
          background: #1A0A08;
          border: 1.5px solid rgba(141, 110, 99, 0.45);
          border-radius: 14px;
          width: 100%;
          max-width: 860px;
          max-height: 88vh;
          margin: auto;
          display: flex;
          flex-direction: column;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(141, 110, 99, 0.25);
          overflow: hidden;
          animation: guideSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          color: #E8D8C8;
          font-family: var(--font-special-elite, monospace), "Courier New", monospace;
          box-sizing: border-box;
        }

        @keyframes guideSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .guide-modal-header {
          padding: 24px 28px 18px;
          border-bottom: 1px solid rgba(141, 110, 99, 0.25);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          background: rgba(35, 21, 19, 0.5);
        }

        .guide-tag {
          font-size: 11px;
          letter-spacing: 1.5px;
          color: #8D6E63;
          display: block;
          margin-bottom: 6px;
        }

        .guide-title {
          font-size: clamp(20px, 3vw, 24px);
          color: #FAF6EE;
          margin: 0 0 6px;
          font-weight: bold;
          line-height: 1.25;
        }

        .guide-subtitle {
          font-size: 13px;
          color: #BCAAA4;
          margin: 0;
          line-height: 1.45;
        }

        .guide-close-btn {
          background: rgba(141, 110, 99, 0.15);
          border: 1px solid rgba(141, 110, 99, 0.3);
          color: #FAF6EE;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .guide-close-btn:hover {
          background: #8D6E63;
          color: #FFF;
          transform: rotate(90deg);
        }

        .guide-modal-body {
          padding: 24px 28px;
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .guide-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }

        .guide-step-card {
          background: rgba(35, 21, 19, 0.45);
          border: 1px solid rgba(141, 110, 99, 0.2);
          border-radius: 10px;
          padding: 18px;
          transition: border-color 0.2s ease;
        }
        .guide-step-card:hover {
          border-color: rgba(141, 110, 99, 0.45);
        }

        .highlight-card {
          background: rgba(42, 21, 16, 0.65);
          border-color: rgba(141, 110, 99, 0.35);
        }

        .step-badge-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .step-num {
          font-size: 12px;
          color: #8D6E63;
          font-weight: bold;
          font-family: monospace;
        }

        .step-badge {
          font-size: 9px;
          letter-spacing: 0.8px;
          background: rgba(141, 110, 99, 0.2);
          color: #D7CCC8;
          padding: 2px 7px;
          border-radius: 10px;
          border: 1px solid rgba(141, 110, 99, 0.25);
        }

        .step-title {
          font-size: 15px;
          color: #FAF6EE;
          margin: 0 0 8px;
          font-weight: bold;
        }

        .step-desc {
          font-size: 12.5px;
          line-height: 1.55;
          color: #BCAAA4;
          margin: 0;
        }

        .guide-kbd {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          padding: 1px 4px;
          font-family: monospace;
          font-size: 11px;
          color: #FAF6EE;
        }

        .guide-inline-btn {
          background: #202328;
          border: 1px solid #34373D;
          color: #D7CCC8;
          border-radius: 4px;
          padding: 1px 6px;
          font-size: 11px;
          font-family: monospace;
        }

        .guide-ats-pill {
          background: #181B20;
          border: 1px solid #35A897;
          color: #35A897;
          border-radius: 3px;
          padding: 1px 5px;
          font-size: 10px;
          font-weight: bold;
          font-family: monospace;
        }

        .guide-colors-pill {
          background: rgba(16, 18, 21, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #FAF6EE;
          border-radius: 4px;
          padding: 1px 6px;
          font-size: 11px;
        }

        .guide-pro-tip {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(141, 110, 99, 0.12);
          border: 1px dashed rgba(141, 110, 99, 0.35);
          border-radius: 8px;
          padding: 14px 18px;
        }

        .tip-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .guide-pro-tip p {
          margin: 0;
          font-size: 12.5px;
          line-height: 1.5;
          color: #D7CCC8;
        }

        .guide-modal-footer {
          padding: 18px 28px;
          border-top: 1px solid rgba(141, 110, 99, 0.25);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          background: rgba(35, 21, 19, 0.5);
        }

        .footer-left-info {
          font-size: 12px;
          color: #8D6E63;
        }

        .guide-dismiss-btn {
          background: #8D6E63;
          color: #FAF6EE;
          border: none;
          padding: 10px 22px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .guide-dismiss-btn:hover {
          background: #735348;
          transform: translateY(-1px);
        }

        @media (max-width: 650px) {
          .guide-modal-header,
          .guide-modal-body,
          .guide-modal-footer {
            padding: 16px 20px;
          }
          .guide-cards-grid {
            grid-template-columns: 1fr;
          }
          .footer-left-info {
            display: none;
          }
          .guide-dismiss-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}
