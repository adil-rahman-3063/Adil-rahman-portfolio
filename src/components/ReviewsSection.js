'use client';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { reviewsApiUrl } from '../data/projectsData';

const defaultReviews = [
  {
    name: 'aslambinkader',
    role: 'CEO',
    rating: 5,
    review: 'I had a great experience working with Adil Rehman on the T2 Autohaus website. From the beginning, he understood the vision of creating a professional automotive brand and delivered a clean, modern Shopify store that reflects our business well. He was responsive, patient with revisions, and always willing to implement changes until everything matched what we wanted. The website is well-structured, easy to navigate, and provides a solid foundation for our growing business. I appreciate his professionalism, communication, and commitment throughout the project. I would confidently recommend Adil Rehman to anyone looking for a reliable Shopify website developer. Thank you, Adil, for helping bring the T2 Autohaus vision to life. I wish you continued success.'
  }
];

export default function ReviewsSection() {
  const [reviews, setReviews] = useState(defaultReviews);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchReviews = async (retries = 3, delay = 500) => {
    try {
      const res = await fetch(reviewsApiUrl);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.data || []);
      
      if (list.length > 0) {
        setReviews(list);
        localStorage.setItem('cached_reviews', JSON.stringify(list));
      }
    } catch (e) {
      console.error('Failed to fetch reviews:', e);
      if (retries > 0) {
        setTimeout(() => fetchReviews(retries - 1, delay * 2), delay);
      } else {
        const cached = localStorage.getItem('cached_reviews');
        if (cached) {
          try { setReviews(JSON.parse(cached)); } catch (err) {}
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('cached_reviews');
      if (cached) {
        try { setReviews(JSON.parse(cached)); } catch (err) {}
      }
    }
    fetchReviews();
  }, []);

  return (
    <section id="reviews" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div className="reviews-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-handwritten)',
            fontSize: '26px',
            color: '#8C7355',
            marginRight: '8px'
          }}>
            07 // 
          </span>
          <h2 style={{
            fontFamily: 'var(--font-header)',
            fontSize: '22px',
            color: '#EFEBE9',
            fontWeight: 'bold',
            letterSpacing: '1.0px',
            margin: 0
          }}>
            CLIENT REVIEWS
          </h2>
        </div>

        <button onClick={() => setShowModal(true)} className="leave-review-btn">
          Leave a Review
        </button>
      </div>

      {isLoading ? (
        <div className="loading-state">Fetching latest testimonials...</div>
      ) : reviews.length === 0 ? (
        <div className="empty-reviews-state">
          <p>No reviews yet. Be the first to leave a review!</p>
        </div>
      ) : (
        <div className="reviews-grid">
          {reviews.map((r, idx) => (
            <div key={idx} className="review-card">
              <div className="review-rating">
                {Array.from({ length: r.rating || 5 }).map((_, starIdx) => (
                  <span key={starIdx} style={{ color: '#8C7355' }}>★</span>
                ))}
                {Array.from({ length: 5 - (r.rating || 5) }).map((_, starIdx) => (
                  <span key={starIdx} style={{ color: '#E8DFD0' }}>★</span>
                ))}
              </div>
              <p className="review-text">"{r.review}"</p>
              <div className="review-author">
                <span className="author-name">{r.name}</span>
                <span className="author-role">{r.role}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ReviewFormModal
          onClose={() => {
            setShowModal(false);
            fetchReviews();
          }}
        />
      )}

      <style jsx global>{`
        .reviews-header {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }
        @media (min-width: 900px) {
          .reviews-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .leave-review-btn {
          background-color: #8D6E63;
          color: #FAF6EE;
          border: none;
          border-radius: 30px;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: bold;
          padding: 12px 18px;
          cursor: pointer;
          align-self: flex-start;
          transition: background-color 0.2s;
        }
        .leave-review-btn:hover {
          background-color: #FAF6EE;
          color: #231513;
        }

        .reviews-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          width: 100%;
        }
        @media (min-width: 600px) {
          .reviews-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (min-width: 900px) {
          .reviews-grid { grid-template-columns: 1fr 1fr 1fr; }
        }

        .review-card {
          background-color: #FAF6EE;
          border: 1.5px solid #E8DFD0;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .review-card:hover {
          border-color: #8D6E63;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .review-rating { font-size: 16px; margin-bottom: 12px; }

        .review-text {
          font-family: var(--font-mono);
          font-size: 13px;
          color: #5D4037;
          line-height: 1.5;
          margin: 0 0 16px 0;
          flex-grow: 1;
          font-style: italic;
        }

        .review-author {
          display: flex;
          flex-direction: column;
          border-top: 1px solid #E8DFD0;
          padding-top: 12px;
        }

        .author-name {
          font-family: var(--font-header);
          font-size: 14px;
          color: #3E2723;
          font-weight: bold;
        }

        .author-role {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #8D6E63;
          margin-top: 2px;
        }

        .empty-reviews-state {
          text-align: center;
          padding: 40px;
          font-family: var(--font-mono);
          color: #BCAAA4;
        }
      `}</style>
    </section>
  );
}

// ─── Shared Modal Shell ────────────────────────────────────────────────────────
function ModalShell({ onClose, title, headerComment, children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!mounted || !document?.body) return null;

  return ReactDOM.createPortal(
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drag handle */}
        <div className="sheet-handle" />

        {/* Header */}
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

        {/* Divider */}
        <div className="sheet-divider" />

        {/* Body */}
        <div className="sheet-body">
          {children}
        </div>
      </div>

      <style jsx global>{`
        /* ── Overlay ── */
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

        /* ── Sheet Panel ── */
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

        /* On desktop → centered modal instead of bottom sheet */
        @media (min-width: 600px) {
          .sheet-overlay {
            align-items: center;
          }
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

        /* ── Drag handle ── */
        .sheet-handle {
          width: 40px;
          height: 4px;
          background: rgba(141, 110, 99, 0.35);
          border-radius: 2px;
          margin: 14px auto 0;
        }
        @media (min-width: 600px) {
          .sheet-handle { display: none; }
        }

        /* ── Header ── */
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

        /* ── Divider ── */
        .sheet-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(141,110,99,0.3) 30%, rgba(141,110,99,0.3) 70%, transparent);
          margin: 20px 0 0;
        }

        /* ── Body ── */
        .sheet-body {
          padding: 24px 28px 0;
        }

        /* ── Form elements ── */
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
        .sheet-form-input::placeholder {
          color: rgba(188, 170, 164, 0.45);
        }
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

        /* ── Star rating ── */
        .sheet-star-row {
          display: flex;
          gap: 6px;
        }
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
        .sheet-star-btn:hover {
          transform: scale(1.2);
        }
        .sheet-star-btn.empty {
          color: rgba(141, 110, 99, 0.3);
        }

        /* ── Submit button ── */
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
        .sheet-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .sheet-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* ── Error alert ── */
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

        /* ── Success state ── */
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
        .sheet-success-close-btn:hover {
          background: rgba(141, 110, 99, 0.28);
        }
      `}</style>
    </div>,
    document.body
  );
}

// ─── Review Form Modal ─────────────────────────────────────────────────────────
export function ReviewFormModal({ onClose }) {
  const [name, setName]     = useState('');
  const [role, setRole]     = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !role || !review) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      await fetch(reviewsApiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ name: name.trim(), role: role.trim(), rating, review: review.trim() }),
      });
      setSuccess(true);
    } catch (err) {
      setErrorMsg('Submission failed. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell onClose={onClose} title="LEAVE A REVIEW" headerComment="// CLIENT TESTIMONIAL">
      {success ? (
        <div className="sheet-success">
          <div className="sheet-success-icon">★</div>
          <h4>Thank You!</h4>
          <p>Your review has been submitted and will appear on the site shortly.</p>
          <button onClick={onClose} className="sheet-success-close-btn">Close</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="sheet-form">
          {errorMsg && <div className="sheet-error">{errorMsg}</div>}

          <div className="sheet-form-group">
            <label className="sheet-form-label">Full Name</label>
            <input
              type="text" required value={name}
              onChange={(e) => setName(e.target.value)}
              className="sheet-form-input" placeholder="e.g. John Doe"
            />
          </div>

          <div className="sheet-form-group">
            <label className="sheet-form-label">Role & Company</label>
            <input
              type="text" required value={role}
              onChange={(e) => setRole(e.target.value)}
              className="sheet-form-input" placeholder="e.g. CEO at TechCorp"
            />
          </div>

          <div className="sheet-form-group">
            <label className="sheet-form-label">Rating</label>
            <div className="sheet-star-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star} type="button"
                  onClick={() => setRating(star)}
                  className={`sheet-star-btn${star > rating ? ' empty' : ''}`}
                >
                  {star <= rating ? '★' : '☆'}
                </button>
              ))}
            </div>
          </div>

          <div className="sheet-form-group">
            <label className="sheet-form-label">Your Review</label>
            <textarea
              required rows={4} value={review}
              onChange={(e) => setReview(e.target.value)}
              className="sheet-form-input"
              placeholder="Write about your experience working with Adil..."
            />
          </div>

          <button type="submit" disabled={loading} className="sheet-submit-btn">
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}
    </ModalShell>
  );
}
