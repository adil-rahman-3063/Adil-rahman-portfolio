'use client';
import React, { useState, useEffect } from 'react';
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
        // Fallback to cache if network fails completely
        const cached = localStorage.getItem('cached_reviews');
        if (cached) {
          try {
            setReviews(JSON.parse(cached));
          } catch (err) {}
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load from cache first for instant load
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('cached_reviews');
      if (cached) {
        try {
          setReviews(JSON.parse(cached));
        } catch (err) {}
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
          .reviews-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 900px) {
          .reviews-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
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

        .review-rating {
          font-size: 16px;
          margin-bottom: 12px;
        }

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

// Review submission Modal
export function ReviewFormModal({ onClose }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !role || !review) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const body = {
        name: name.trim(),
        role: role.trim(),
        rating: rating,
        review: review.trim(),
      };

      // Submit via POST using no-cors mode, matching Flutter's apps script submit helper
      await fetch(reviewsApiUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(body),
      });

      // Since no-cors doesn't let us read response body or status, we assume success on resolve
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
          <h3 className="modal-title" style={{ marginTop: 0 }}>Write a Review</h3>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {success ? (
            <div className="success-block">
              <span className="success-icon">✓</span>
              <h4>Thank you!</h4>
              <p>Your review has been successfully submitted and will be live shortly.</p>
              <button onClick={onClose} className="shopify-btn" style={{ marginTop: '16px' }}>Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="review-form">
              {errorMsg && <div className="error-alert">{errorMsg}</div>}

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role & Company</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-input"
                  placeholder="e.g. CEO at TechCorp"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rating</label>
                <div className="star-rating-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="star-btn"
                    >
                      {star <= rating ? '★' : '☆'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Your Review</label>
                <textarea
                  required
                  rows={4}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="form-input"
                  placeholder="Write your experience working with me..."
                />
              </div>

              <button type="submit" disabled={loading} className="form-submit-btn">
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </div>

      <style jsx global>{`
        .review-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          font-family: var(--font-mono);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-label {
          font-size: 12px;
          color: #BCAAA4;
          font-weight: bold;
        }

        .form-input {
          background-color: #FAF6EE;
          border: 1.5px solid #E8DFD0;
          border-radius: 6px;
          padding: 10px 14px;
          font-family: var(--font-mono);
          font-size: 13px;
          color: #3E2723;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          border-color: #8D6E63;
        }

        .star-rating-selector {
          display: flex;
          gap: 8px;
        }

        .star-btn {
          background: transparent;
          border: none;
          font-size: 24px;
          color: #8C7355;
          cursor: pointer;
          padding: 0;
        }

        .form-submit-btn {
          background-color: #8D6E63;
          color: #FAF6EE;
          border: none;
          border-radius: 30px;
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: bold;
          padding: 14px;
          cursor: pointer;
          margin-top: 12px;
          transition: background-color 0.2s;
        }
        .form-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .form-submit-btn:hover:not(:disabled) {
          background-color: #FAF6EE;
          color: #231513;
        }

        .success-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 24px 0;
          font-family: var(--font-mono);
        }

        .success-icon {
          font-size: 48px;
          color: #8C7355;
          margin-bottom: 12px;
        }

        .success-block h4 {
          font-family: var(--font-header);
          font-size: 18px;
          color: #EFEBE9;
          margin: 0 0 8px 0;
        }

        .success-block p {
          font-size: 13px;
          color: #BCAAA4;
          line-height: 1.5;
          margin: 0;
        }

        .error-alert {
          background-color: rgba(211, 47, 47, 0.2);
          border: 1px solid #d32f2f;
          color: #ef5350;
          padding: 12px;
          border-radius: 6px;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
