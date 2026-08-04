'use client';
import React, { useState } from 'react';
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
            <a href="mailto:adilrahman.cc@gmail.com" className="contact-link-item">
              <span className="contact-icon">📧</span> adilrahman.cc@gmail.com
            </a>
            <a href="https://wa.me/917592963063" target="_blank" rel="noreferrer" className="contact-link-item">
              <span className="contact-icon">💬</span> WhatsApp Chat (+91 7592963063)
            </a>
          </div>

          <h3 className="contact-info-title" style={{ marginTop: '24px' }}>// SOCIALS</h3>
          <div className="social-chips">
            <a href="https://github.com/adil-rahman-3063" target="_blank" rel="noreferrer" className="social-chip">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/adil-rahman-" target="_blank" rel="noreferrer" className="social-chip">
              LinkedIn
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-chip">
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
        .contact-link-item:hover {
          color: #8D6E63;
        }

        .contact-icon {
          font-size: 18px;
        }

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

// Requirement Quote submission Form Modal
export function RequirementFormModal({ onClose, initialRequirement = '' }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [requirement, setRequirement] = useState(initialRequirement);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !requirement) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const body = {
        type: 'requirement',
        name: name.trim(),
        phone: phone.trim(),
        requirement: requirement.trim(),
      };

      await fetch(reviewsApiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(body),
      });

      setSuccess(true);
    } catch (err) {
      setErrorMsg('Submission failed. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title" style={{ marginTop: 0 }}>Request a Quote</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {success ? (
            <div className="success-block">
              <span className="success-icon">✓</span>
              <h4>Requirement Submitted!</h4>
              <p>Your workspace specifications have been sent. I will get back to you shortly.</p>
              <button onClick={onClose} className="shopify-btn" style={{ marginTop: '16px' }}>Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="review-form">
              {errorMsg && <div className="error-alert">{errorMsg}</div>}

              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                  placeholder="e.g. +1 234 567 890"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Project Requirements</label>
                <textarea
                  required
                  rows={5}
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  className="form-input"
                  placeholder="Describe what you want to build (features, deadline, platforms)..."
                />
              </div>

              <button type="submit" disabled={loading} className="form-submit-btn">
                {loading ? 'Submitting...' : 'Submit Requirements'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
