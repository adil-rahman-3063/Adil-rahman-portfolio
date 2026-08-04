'use client';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { reviewsApiUrl } from '../data/projectsData';

export default function ContactSection({ onGetQuote }) {
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  return (
    <section id="contact" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '32px' }}>
        <span style={{
          fontFamily: 'var(--font-handwritten)',
          fontSize: '26px',
          color: '#8C7355',
          marginRight: '8px'
        }}>
          08 // 
        </span>
        <h2 style={{
          fontFamily: 'var(--font-header)',
          fontSize: '22px',
          color: '#EFEBE9',
          fontWeight: 'bold',
          letterSpacing: '1.0px',
          margin: 0
        }}>
          CONTACT & QUOTE
        </h2>
      </div>

      <div className="contact-layout">
        {/* Contact Info Card */}
        <div className="contact-info-card">
          <h3 className="contact-info-title">// GET IN TOUCH</h3>
          <p className="contact-info-text">
            Have a project in mind or looking to hire? Feel free to reach out via email, social channels, or submit a request for a custom quote.
          </p>

          <div className="contact-links-list">
            <a href="mailto:adilrahman3063@gmail.com" className="contact-link-item">
              <span className="contact-icon">📧</span> adilrahman3063@gmail.com
            </a>
            <a href="https://wa.me/919207114070" target="_blank" rel="noreferrer" className="contact-link-item">
              <span className="contact-icon">💬</span> WhatsApp Chat (+91 9207114070)
            </a>
          </div>

          <h3 className="contact-info-title" style={{ marginTop: '24px' }}>// SOCIALS</h3>
          <div className="social-chips">
            <a href="https://github.com/adil-rahman-3063" target="_blank" rel="noreferrer" className="social-chip">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/adil-rahiman-3815b5290/" target="_blank" rel="noreferrer" className="social-chip">
              LinkedIn
            </a>
            <a href="https://x.com/adilrahmanms" target="_blank" rel="noreferrer" className="social-chip">
              X / Twitter
            </a>
            <a href="https://www.instagram.com/adil__rahman_/" target="_blank" rel="noreferrer" className="social-chip">
              Instagram
            </a>
          </div>
        </div>

        {/* Quote Launcher Card */}
        <div className="quote-launcher-card">
          <h3 className="contact-info-title">// REQUIREMENT SHEET</h3>
          <p className="contact-info-text">
            Submit your specific feature requirements, timeline constraints, and contact details to get a structured cost and architecture quote directly.
          </p>
          <button onClick={() => setShowQuoteModal(true)} className="quote-launch-btn">
            Request a Quote
          </button>
        </div>
      </div>

      {showQuoteModal && (
        <RequirementFormModal onClose={() => setShowQuoteModal(false)} />
      )}

      <style jsx global>{`
        .contact-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          width: 100%;
        }
        @media (min-width: 900px) {
          .contact-layout {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
        }

        .contact-info-card, .quote-launcher-card {
          background-color: #FAF6EE;
          border: 1.5px solid #E8DFD0;
          border-radius: 8px;
          padding: 28px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .contact-info-title {
          font-family: var(--font-header);
          font-size: 14px;
          color: #8D6E63;
          margin: 0 0 16px 0;
          font-weight: bold;
          letter-spacing: 1.0px;
        }

        .contact-info-text {
          font-family: var(--font-mono);
          font-size: 13px;
          color: #5D4037;
          line-height: 1.6;
          margin: 0 0 24px 0;
        }

        .contact-links-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .contact-link-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 13px;
          color: #3E2723;
          font-weight: bold;
          text-decoration: none;
        }
        .contact-link-item:hover { color: #8D6E63; }

        .contact-icon { font-size: 18px; }

        .social-chips {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .social-chip {
          background-color: rgba(141, 110, 99, 0.1);
          border: 1px solid #E8DFD0;
          border-radius: 20px;
          color: #8D6E63;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: bold;
          padding: 6px 14px;
          text-decoration: none;
          transition: border-color 0.2s, background-color 0.2s;
        }
        .social-chip:hover {
          border-color: #8D6E63;
          background-color: rgba(141, 110, 99, 0.2);
        }

        .quote-launch-btn {
          width: 100%;
          background-color: #8D6E63;
          color: #FAF6EE;
          border: none;
          border-radius: 30px;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: bold;
          padding: 16px;
          cursor: pointer;
          transition: background-color 0.2s, color 0.2s;
          margin-top: auto;
          text-align: center;
        }
        .quote-launch-btn:hover {
          background-color: #FAF6EE;
          color: #231513;
          border: 1.5px solid #8D6E63;
          padding: 14.5px;
        }
      `}</style>
    </section>
  );
}

// ─── Shared Modal Shell ────────────────────────────────────────────────────────
function ModalShell({ onClose, title, headerComment, children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet-panel" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />

        <div className="sheet-header">
          <div>
            <p className="sheet-header-comment">{headerComment}</p>
            <h3 className="sheet-title">{title}</h3>
          </div>
          <button className="sheet-close-btn" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 1L17 17M17 1L1 17" stroke="#8D6E63" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="sheet-divider" />
        <div className="sheet-body">{children}</div>
      </div>

      <style jsx global>{`
        .sheet-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(10, 4, 3, 0.72);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          animation: overlayFadeIn 0.25s ease;
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .sheet-panel {
          width: 100%;
          max-width: 560px;
          max-height: 92vh;
          overflow-y: auto;
          background: linear-gradient(160deg, #2A1510 0%, #1A0A08 60%, #120806 100%);
          border: 1px solid rgba(141, 110, 99, 0.3);
          border-bottom: none;
          border-radius: 20px 20px 0 0;
          box-shadow: 0 -8px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(141,110,99,0.1) inset;
          padding: 0 0 40px 0;
          animation: sheetSlideUp 0.32s cubic-bezier(0.32, 0.72, 0, 1);
          scrollbar-width: thin;
          scrollbar-color: #8D6E63 transparent;
        }
        @keyframes sheetSlideUp {
          from { transform: translateY(100%); opacity: 0.4; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .sheet-panel::-webkit-scrollbar { width: 4px; }
        .sheet-panel::-webkit-scrollbar-track { background: transparent; }
        .sheet-panel::-webkit-scrollbar-thumb { background: #8D6E63; border-radius: 2px; }

        @media (min-width: 600px) {
          .sheet-overlay { align-items: center; }
          .sheet-panel {
            border-radius: 16px;
            border: 1px solid rgba(141, 110, 99, 0.3);
            max-height: 88vh;
            animation: sheetFadeScale 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          @keyframes sheetFadeScale {
            from { transform: scale(0.94) translateY(12px); opacity: 0; }
            to   { transform: scale(1)    translateY(0);    opacity: 1; }
          }
        }

        .sheet-handle {
          width: 40px;
          height: 4px;
          background: rgba(141, 110, 99, 0.35);
          border-radius: 2px;
          margin: 14px auto 0;
        }
        @media (min-width: 600px) { .sheet-handle { display: none; } }

        .sheet-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 24px 28px 0;
          gap: 16px;
        }

        .sheet-header-comment {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #8D6E63;
          margin: 0 0 6px 0;
          letter-spacing: 0.5px;
        }

        .sheet-title {
          font-family: var(--font-header);
          font-size: 20px;
          color: #EFEBE9;
          font-weight: bold;
          letter-spacing: 0.5px;
          margin: 0;
        }

        .sheet-close-btn {
          background: rgba(141, 110, 99, 0.12);
          border: 1px solid rgba(141, 110, 99, 0.25);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          margin-top: 2px;
        }
        .sheet-close-btn:hover {
          background: rgba(141, 110, 99, 0.25);
          border-color: #8D6E63;
        }

        .sheet-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(141,110,99,0.3) 30%, rgba(141,110,99,0.3) 70%, transparent);
          margin: 20px 0 0;
        }

        .sheet-body { padding: 24px 28px 0; }

        .sheet-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .sheet-form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .sheet-form-label {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: bold;
          color: #8D6E63;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .sheet-form-input {
          background: rgba(250, 246, 238, 0.05);
          border: 1.5px solid rgba(141, 110, 99, 0.25);
          border-radius: 10px;
          padding: 12px 16px;
          font-family: var(--font-mono);
          font-size: 13px;
          color: #EFEBE9;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          width: 100%;
          box-sizing: border-box;
        }
        .sheet-form-input::placeholder { color: rgba(188, 170, 164, 0.45); }
        .sheet-form-input:focus {
          border-color: #8D6E63;
          background: rgba(250, 246, 238, 0.08);
          box-shadow: 0 0 0 3px rgba(141, 110, 99, 0.12);
        }
        textarea.sheet-form-input {
          resize: vertical;
          min-height: 110px;
          line-height: 1.6;
        }

        .sheet-star-row { display: flex; gap: 6px; }
        .sheet-star-btn {
          background: transparent;
          border: none;
          font-size: 28px;
          cursor: pointer;
          padding: 0 2px;
          line-height: 1;
          transition: transform 0.15s, color 0.15s;
          color: #8C7355;
        }
        .sheet-star-btn:hover { transform: scale(1.2); }
        .sheet-star-btn.empty { color: rgba(141, 110, 99, 0.3); }

        .sheet-submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #8D6E63 0%, #6D4C41 100%);
          color: #FAF6EE;
          border: none;
          border-radius: 30px;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 0.5px;
          padding: 16px;
          cursor: pointer;
          margin-top: 8px;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(141, 110, 99, 0.3);
        }
        .sheet-submit-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(141, 110, 99, 0.4);
        }
        .sheet-submit-btn:active:not(:disabled) { transform: translateY(0); }
        .sheet-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .sheet-error {
          background: rgba(211, 47, 47, 0.12);
          border: 1px solid rgba(211, 47, 47, 0.4);
          color: #ef9a9a;
          padding: 12px 16px;
          border-radius: 8px;
          font-family: var(--font-mono);
          font-size: 12px;
          line-height: 1.5;
        }

        .sheet-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 32px 0 8px;
          gap: 12px;
        }

        .sheet-success-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(141, 110, 99, 0.15);
          border: 1.5px solid rgba(141, 110, 99, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          margin-bottom: 4px;
          animation: successPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes successPop {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }

        .sheet-success h4 {
          font-family: var(--font-header);
          font-size: 20px;
          color: #EFEBE9;
          margin: 0;
          font-weight: bold;
        }

        .sheet-success p {
          font-family: var(--font-mono);
          font-size: 13px;
          color: #BCAAA4;
          line-height: 1.6;
          margin: 0;
          max-width: 320px;
        }

        .sheet-success-close-btn {
          background: rgba(141, 110, 99, 0.15);
          border: 1px solid rgba(141, 110, 99, 0.35);
          border-radius: 30px;
          color: #EFEBE9;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: bold;
          padding: 12px 28px;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.2s;
        }
        .sheet-success-close-btn:hover { background: rgba(141, 110, 99, 0.28); }
      `}</style>
    </div>,
    document.body
  );
}

// ─── Requirement Quote Form Modal ──────────────────────────────────────────────
export function RequirementFormModal({ onClose, initialRequirement = '' }) {
  const [name, setName]             = useState('');
  const [phone, setPhone]           = useState('');
  const [requirement, setRequirement] = useState(initialRequirement);
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const [errorMsg, setErrorMsg]     = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !requirement) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      await fetch(reviewsApiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          type: 'requirement',
          name: name.trim(),
          phone: phone.trim(),
          requirement: requirement.trim(),
        }),
      });
      setSuccess(true);
    } catch (err) {
      setErrorMsg('Submission failed. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell onClose={onClose} title="REQUEST A QUOTE" headerComment="// REQUIREMENT SHEET">
      {success ? (
        <div className="sheet-success">
          <div className="sheet-success-icon">✓</div>
          <h4>Requirement Sent!</h4>
          <p>Your workspace specifications have been submitted. I will review and get back to you shortly.</p>
          <button onClick={onClose} className="sheet-success-close-btn">Close</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="sheet-form">
          {errorMsg && <div className="sheet-error">{errorMsg}</div>}

          <div className="sheet-form-group">
            <label className="sheet-form-label">Your Name</label>
            <input
              type="text" required value={name}
              onChange={(e) => setName(e.target.value)}
              className="sheet-form-input" placeholder="e.g. Jane Doe"
            />
          </div>

          <div className="sheet-form-group">
            <label className="sheet-form-label">Phone / WhatsApp</label>
            <input
              type="tel" required value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="sheet-form-input" placeholder="e.g. +1 234 567 890"
            />
          </div>

          <div className="sheet-form-group">
            <label className="sheet-form-label">Project Requirements</label>
            <textarea
              required rows={5} value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              className="sheet-form-input"
              placeholder="Describe what you want to build (features, deadline, platforms, budget range)..."
            />
          </div>

          <button type="submit" disabled={loading} className="sheet-submit-btn">
            {loading ? 'Submitting...' : 'Submit Requirements'}
          </button>
        </form>
      )}
    </ModalShell>
  );
}
