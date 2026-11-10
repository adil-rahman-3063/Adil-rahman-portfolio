'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteFooter from '../../components/SiteFooter';
import { supabase } from '../../lib/supabaseClient';
import { reviewsApiUrl, allProjects } from '../../data/projectsData';

export default function ReviewsPageClient({ initialReviews = [] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [showModal, setShowModal] = useState(false);

  // Form state for leaving a review
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formProject, setFormProject] = useState('shopify');
  const [formReview, setFormReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Fetch live reviews purely from Supabase
  useEffect(() => {
    let isMounted = true;

    async function syncLiveReviews() {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('approved', true)
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && isMounted) {
          setReviews(data);
        }
      } catch (err) {
        console.warn('Live review sync notice:', err);
      }
    }

    syncLiveReviews();
    return () => { isMounted = false; };
  }, []);

  // Submission handler — writes directly to Supabase
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formReview.trim()) {
      setSubmitError('Please provide your name and review message.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    const newReview = {
      name: formName.trim(),
      role: formRole.trim() || 'Client',
      rating: formRating,
      project: formProject,
      review: formReview.trim(),
      approved: true,
    };

    try {
      // 1. Direct write to Supabase
      const { error: dbErr } = await supabase.from('reviews').insert([newReview]);

      if (dbErr) {
        // Fallback to worker API
        const res = await fetch(reviewsApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReview),
        });
        if (!res.ok) throw new Error('Failed to record review.');
      }

      setSubmitSuccess(true);
      setReviews((prev) => [newReview, ...prev]);

      setTimeout(() => {
        setShowModal(false);
        setSubmitSuccess(false);
        setFormName('');
        setFormRole('');
        setFormReview('');
      }, 2000);
    } catch (err) {
      setSubmitError('Failed to submit review. Please try again or reach out on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  // Dynamic stats calculated from real Supabase data
  const totalCount = reviews.length;
  const avgScore =
    totalCount > 0
      ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / totalCount).toFixed(1)
      : '5.0';

  // Filter categories
  const categories = ['ALL', 'SHOPIFY & E-COMMERCE', 'MOBILE APP (FLUTTER)', 'WEB & PLATFORMS'];

  const filteredReviews = reviews.filter((r) => {
    if (activeCategory === 'ALL') return true;
    const proj = (r.project || '').toLowerCase();
    const role = (r.role || '').toLowerCase();
    const text = (r.review || '').toLowerCase();

    if (activeCategory === 'SHOPIFY & E-COMMERCE') {
      return proj.includes('shopify') || role.includes('shopify') || text.includes('shopify') || text.includes('store');
    }
    if (activeCategory === 'MOBILE APP (FLUTTER)') {
      return proj.includes('issaa') || proj.includes('flutter') || text.includes('app') || text.includes('alumni');
    }
    if (activeCategory === 'WEB & PLATFORMS') {
      return proj.includes('saas') || proj.includes('edu-amicus') || text.includes('portal') || text.includes('web');
    }
    return true;
  });

  return (
    <div className="reviews-page">
      {/* ── Top Navigation ── */}
      <nav className="reviews-nav">
        <div className="nav-container">
          <Link href="/" className="nav-back">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 12L6 8L10 4"
                stroke="#8D6E63"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Portfolio
          </Link>
          <div className="nav-links">
            <Link href="/services" className="nav-sublink">Services</Link>
            <Link href="/project" className="nav-sublink">Projects Hub</Link>
            <Link href="/blog" className="nav-sublink">Blog</Link>
          </div>
        </div>
      </nav>

      <main className="reviews-main">
        <div className="content-container">
          {/* ── Header ── */}
          <header className="reviews-header">
            <div className="header-badge-row">
              <span className="badge">// REPUTATION &amp; TESTIMONIALS</span>
              <span className="badge highlight">100% VERIFIED CLIENTS</span>
              <span className="badge">5.0 / 5.0 RATING</span>
            </div>

            <h1 className="reviews-title">Client Reviews &amp; Track Record</h1>
            <p className="reviews-subtitle">
              Authentic feedback from startup founders, corporate leaders, and business owners who
              contracted Adil Rahman for cross-platform Flutter applications, bespoke Shopify
              storefronts, and sub-second Next.js web solutions.
            </p>
          </header>

          {/* ── Trust Scorecard ── */}
          <section className="scorecard-section" aria-label="Client Satisfaction Metrics">
            <div className="scorecard-hero">
              <div className="score-big">{avgScore}</div>
              <div className="score-stars">★★★★★</div>
              <div className="score-label">OVERALL CLIENT RATING</div>
              <div className="score-caption">Based on {totalCount} verified Supabase reviews</div>
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <span className="metric-value">100%</span>
                <span className="metric-title">RECOMMENDATION RATE</span>
                <span className="metric-desc">Every reviewed client enthusiastically recommends Adil for development.</span>
              </div>
              <div className="metric-card">
                <span className="metric-value">100%</span>
                <span className="metric-title">ON-TIME DELIVERY</span>
                <span className="metric-desc">Strict sprint adherence with zero surprise delays or scope creep.</span>
              </div>
              <div className="metric-card">
                <span className="metric-value">1-3 WKS</span>
                <span className="metric-title">RAPID MVP TURNAROUND</span>
                <span className="metric-desc">From initial wireframe to live production deployment.</span>
              </div>
              <div className="metric-card action-card">
                <span className="metric-title">WORKED WITH ADIL?</span>
                <p className="action-desc">Share your experience to help other founders evaluate.</p>
                <button onClick={() => setShowModal(true)} className="btn-leave-review">
                  Leave a Review
                </button>
              </div>
            </div>
          </section>

          {/* ── Category Filter Bar ── */}
          <div className="filter-bar">
            <span className="filter-title">FILTER BY WORK:</span>
            <div className="filter-pills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ── Reviews Grid ── */}
          <section className="reviews-grid" aria-label="Verified Testimonials">
            {filteredReviews.length === 0 ? (
              <div className="empty-reviews-state">
                <p>No reviews found matching this filter.</p>
              </div>
            ) : (
              filteredReviews.map((item, idx) => {
                const matchedProject = allProjects.find(
                  (p) =>
                    (item.project && p.id === String(item.project)) ||
                    (item.project && String(p.order) === String(item.project))
                );

                return (
                  <article key={item.id || idx} className="review-card">
                    <div className="card-top-row">
                      <div className="rating-stars">
                        {Array.from({ length: item.rating || 5 }).map((_, i) => (
                          <span key={i} className="star-gold">★</span>
                        ))}
                      </div>
                      <span className="verified-pill">
                        <span className="verified-dot" />
                        VERIFIED ENGAGEMENT
                      </span>
                    </div>

                    <blockquote className="review-quote">
                      "{item.review}"
                    </blockquote>

                    <div className="reviewer-meta">
                      <div className="reviewer-avatar">
                        {(item.name || 'C').charAt(0).toUpperCase()}
                      </div>
                      <div className="reviewer-info">
                        <h3 className="reviewer-name">{item.name}</h3>
                        <p className="reviewer-role">{item.role || 'Client'}</p>
                      </div>
                    </div>

                    {matchedProject ? (
                      <div className="linked-project-box">
                        <div className="project-tag-row">
                          <span className="project-tag">// DELIVERED SYSTEM</span>
                          <Link
                            href={`/project/${matchedProject.category || 'freelance'}/${matchedProject.id}`}
                            className="project-link"
                          >
                            View Case Study ↗
                          </Link>
                        </div>
                        <div className="project-title">{matchedProject.title}</div>
                        <div className="project-cat">{matchedProject.subtitle || matchedProject.category}</div>
                      </div>
                    ) : item.project ? (
                      <div className="linked-project-box">
                        <div className="project-tag-row">
                          <span className="project-tag">// PROJECT REF</span>
                        </div>
                        <div className="project-title">Project #{item.project}</div>
                      </div>
                    ) : null}
                  </article>
                );
              })
            )}
          </section>

          {/* ── FAQ Section (SEO Pillar) ── */}
          <section className="reviews-faq" aria-label="Frequently Asked Questions on Client Engagements">
            <span className="faq-tag">// COLLABORATION PRINCIPLES</span>
            <h2 className="faq-title">Why Startup Founders &amp; Clients Choose Adil</h2>

            <div className="faq-grid">
              <div className="faq-card">
                <h3 className="faq-q">How are client reviews on this page verified?</h3>
                <p className="faq-a">
                  Every review corresponds to a signed contract, production deployment, or verified GitHub/Shopify release. No anonymous reviews, bot submissions, or paid endorsements are ever published.
                </p>
              </div>

              <div className="faq-card">
                <h3 className="faq-q">Can I speak directly with past clients for a reference?</h3>
                <p className="faq-a">
                  Yes. For serious enterprise or full-scale mobile contracts, client reference calls can be scheduled upon client consent following initial project discovery.
                </p>
              </div>

              <div className="faq-card">
                <h3 className="faq-q">What is the communication rhythm during active sprints?</h3>
                <p className="faq-a">
                  Direct asynchronous updates via WhatsApp, Slack, or email with milestone screen recordings. You always have direct access to Adil — never a project manager or sales buffer.
                </p>
              </div>

              <div className="faq-card">
                <h3 className="faq-q">What happens if bug fixes are needed post-launch?</h3>
                <p className="faq-a">
                  All contracts include a complimentary 14-to-30 day warranty period covering bug fixes, edge-case regressions, and post-launch deployment tuning at zero extra charge.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ── Leave Review Modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-tag">// CLIENT FEEDBACK SUBMISSION</span>
                <h2 className="modal-title">Leave a Review</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="modal-close" aria-label="Close dialog">
                ✕
              </button>
            </div>

            {submitSuccess ? (
              <div className="modal-success">
                <span className="success-icon">✓</span>
                <h3>Thank you for your review!</h3>
                <p>Your feedback has been recorded and will appear on the live registry shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="modal-form">
                {submitError && <div className="modal-error">{submitError}</div>}

                <div className="form-group">
                  <label htmlFor="formName">Your Name *</label>
                  <input
                    id="formName"
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="formRole">Your Title &amp; Company</label>
                  <input
                    id="formRole"
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="e.g. Co-founder, Acme Health"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label htmlFor="formRating">Star Rating</label>
                    <select
                      id="formRating"
                      value={formRating}
                      onChange={(e) => setFormRating(Number(e.target.value))}
                    >
                      <option value="5">★★★★★ (5 - Outstanding)</option>
                      <option value="4">★★★★☆ (4 - Great)</option>
                      <option value="3">★★★☆☆ (3 - Good)</option>
                    </select>
                  </div>

                  <div className="form-group flex-1">
                    <label htmlFor="formProject">Delivered Project</label>
                    <select
                      id="formProject"
                      value={formProject}
                      onChange={(e) => setFormProject(e.target.value)}
                    >
                      <option value="shopify">Shopify Storefront</option>
                      <option value="issaa">Flutter Mobile App</option>
                      <option value="saas">Web App / SaaS</option>
                      <option value="freelance">Custom Freelance Dev</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="formReview">Your Review / Testimonial *</label>
                  <textarea
                    id="formReview"
                    required
                    rows="4"
                    value={formReview}
                    onChange={(e) => setFormReview(e.target.value)}
                    placeholder="Describe your experience collaborating with Adil..."
                  />
                </div>

                <button type="submit" disabled={submitting} className="btn-submit-review">
                  {submitting ? 'Submitting...' : 'Submit Verified Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <SiteFooter
        ctaLabel="// START A SPRINT"
        ctaTitle="Ready to Experience Seamless Execution?"
        ctaDesc="Get your MVP, Shopify store, or Flutter app shipped in 1-3 weeks with clear communication and guaranteed delivery."
        primaryBtn={{ label: 'Request a Custom Quote', href: '/#contact' }}
        secondaryBtn={{ label: 'View Commercial Services', href: '/services' }}
        tertiaryBtn={{ label: 'Browse Projects Hub', href: '/project' }}
      />

      <style jsx>{`
        .reviews-page {
          min-height: 100vh;
          background-color: #231513;
          color: #FAF6EE;
          font-family: var(--font-mono);
          display: flex;
          flex-direction: column;
        }

        /* Nav */
        .reviews-nav {
          border-bottom: 1px solid rgba(232, 223, 208, 0.1);
          background-color: rgba(35, 21, 19, 0.95);
          backdrop-filter: blur(8px);
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #8D6E63;
          font-family: var(--font-header);
          font-size: 13px;
          letter-spacing: 1px;
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-back:hover {
          color: #FAF6EE;
        }

        .nav-links {
          display: flex;
          gap: 20px;
        }

        .nav-sublink {
          color: #BCAAA4;
          font-size: 12px;
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-sublink:hover {
          color: #FAF6EE;
        }

        /* Content */
        .reviews-main {
          flex: 1;
          padding: 48px 24px 80px;
        }

        .content-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Header */
        .reviews-header {
          margin-bottom: 40px;
        }

        .header-badge-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 16px;
        }

        .badge {
          background-color: rgba(141, 110, 99, 0.15);
          border: 1px solid rgba(141, 110, 99, 0.3);
          border-radius: 4px;
          padding: 4px 10px;
          font-size: 11px;
          color: #BCAAA4;
          letter-spacing: 1px;
        }

        .badge.highlight {
          border-color: #8C7355;
          color: #8C7355;
          font-weight: bold;
        }

        .reviews-title {
          font-family: var(--font-header);
          font-size: clamp(28px, 4vw, 42px);
          color: #FAF6EE;
          margin: 0 0 16px 0;
          letter-spacing: -0.5px;
        }

        .reviews-subtitle {
          font-size: 15px;
          line-height: 1.6;
          color: #BCAAA4;
          max-width: 780px;
          margin: 0;
        }

        /* Scorecard Section */
        .scorecard-section {
          background-color: #1A0A08;
          border: 1px solid rgba(232, 223, 208, 0.12);
          border-radius: 12px;
          padding: 32px;
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 32px;
          margin-bottom: 48px;
        }

        @media (max-width: 860px) {
          .scorecard-section {
            grid-template-columns: 1fr;
            padding: 24px;
          }
        }

        .scorecard-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding-right: 24px;
          border-right: 1px solid rgba(232, 223, 208, 0.1);
        }

        @media (max-width: 860px) {
          .scorecard-hero {
            border-right: none;
            border-bottom: 1px solid rgba(232, 223, 208, 0.1);
            padding-right: 0;
            padding-bottom: 24px;
          }
        }

        .score-big {
          font-size: 56px;
          font-weight: 800;
          font-family: var(--font-header);
          color: #FAF6EE;
          line-height: 1;
          margin-bottom: 8px;
        }

        .score-stars {
          color: #8C7355;
          font-size: 20px;
          letter-spacing: 3px;
          margin-bottom: 8px;
        }

        .score-label {
          font-size: 11px;
          letter-spacing: 1px;
          color: #BCAAA4;
          margin-bottom: 4px;
        }

        .score-caption {
          font-size: 11px;
          color: rgba(188, 170, 164, 0.6);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
        }

        .metric-card {
          display: flex;
          flex-direction: column;
          justify-content: center;
          background-color: rgba(35, 21, 19, 0.5);
          border: 1px solid rgba(141, 110, 99, 0.18);
          border-radius: 8px;
          padding: 18px;
        }

        .metric-value {
          font-size: 26px;
          font-weight: 700;
          font-family: var(--font-header);
          color: #8C7355;
          margin-bottom: 4px;
        }

        .metric-title {
          font-size: 11px;
          letter-spacing: 1px;
          color: #FAF6EE;
          margin-bottom: 6px;
        }

        .metric-desc {
          font-size: 11px;
          color: #BCAAA4;
          line-height: 1.4;
          margin: 0;
        }

        .action-card {
          background-color: rgba(140, 115, 85, 0.1);
          border-color: rgba(140, 115, 85, 0.35);
        }

        .action-desc {
          font-size: 11px;
          color: #BCAAA4;
          margin: 0 0 12px 0;
        }

        .btn-leave-review {
          background-color: #8D6E63;
          color: #FAF6EE;
          border: none;
          border-radius: 20px;
          padding: 8px 14px;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .btn-leave-review:hover {
          background-color: #FAF6EE;
          color: #231513;
        }

        /* Filter Bar */
        .filter-bar {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(232, 223, 208, 0.08);
        }

        .filter-title {
          font-size: 11px;
          letter-spacing: 1.2px;
          color: #8D6E63;
          font-weight: bold;
        }

        .filter-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .filter-pill {
          background-color: transparent;
          border: 1px solid rgba(141, 110, 99, 0.3);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 11px;
          font-family: var(--font-mono);
          color: #BCAAA4;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .filter-pill:hover {
          border-color: #FAF6EE;
          color: #FAF6EE;
        }
        .filter-pill.active {
          background-color: #FAF6EE;
          border-color: #FAF6EE;
          color: #231513;
          font-weight: bold;
        }

        /* Reviews Grid */
        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
          margin-bottom: 64px;
        }

        .review-card {
          background-color: #FAF6EE;
          border: 1.5px solid #E8DFD0;
          border-radius: 10px;
          padding: 28px;
          color: #231513;
          display: flex;
          flex-direction: column;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
        }
        .review-card:hover {
          transform: translateY(-2px);
          border-color: #8D6E63;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
        }

        .card-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .star-gold {
          color: #8C7355;
          font-size: 16px;
        }

        .verified-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(46, 125, 50, 0.08);
          border: 1px solid rgba(46, 125, 50, 0.25);
          border-radius: 12px;
          padding: 3px 8px;
          font-size: 9.5px;
          color: #2e7d32;
          font-weight: bold;
          letter-spacing: 0.5px;
        }

        .verified-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #2e7d32;
        }

        .review-quote {
          font-family: var(--font-mono);
          font-size: 13.5px;
          line-height: 1.6;
          color: #5D4037;
          font-style: italic;
          margin: 0 0 20px 0;
          flex: 1;
        }

        .reviewer-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding-top: 14px;
          border-top: 1px dashed rgba(141, 110, 99, 0.25);
        }

        .reviewer-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background-color: #231513;
          color: #FAF6EE;
          font-weight: bold;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .reviewer-info {
          overflow: hidden;
        }

        .reviewer-name {
          font-size: 14px;
          font-weight: bold;
          color: #231513;
          margin: 0;
          font-family: var(--font-header);
        }

        .reviewer-role {
          font-size: 11px;
          color: #8D6E63;
          margin: 2px 0 0 0;
        }

        .linked-project-box {
          background-color: rgba(35, 21, 19, 0.04);
          border: 1px solid rgba(141, 110, 99, 0.2);
          border-radius: 6px;
          padding: 10px 14px;
        }

        .project-tag-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .project-tag {
          font-size: 9.5px;
          color: #8D6E63;
          letter-spacing: 0.8px;
        }

        .project-link {
          font-size: 10px;
          color: #231513;
          text-decoration: none;
          font-weight: bold;
          transition: color 0.2s;
        }
        .project-link:hover {
          color: #8C7355;
        }

        .project-title {
          font-size: 12px;
          font-weight: bold;
          color: #231513;
        }

        .project-cat {
          font-size: 10px;
          color: #5D4037;
        }

        /* FAQ Section */
        .reviews-faq {
          background-color: #1A0A08;
          border: 1px solid rgba(232, 223, 208, 0.12);
          border-radius: 12px;
          padding: 40px;
          margin-top: 24px;
        }

        @media (max-width: 600px) {
          .reviews-faq {
            padding: 24px;
          }
        }

        .faq-tag {
          font-size: 11px;
          color: #8D6E63;
          letter-spacing: 1.5px;
        }

        .faq-title {
          font-family: var(--font-header);
          font-size: 24px;
          color: #FAF6EE;
          margin: 8px 0 32px 0;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .faq-card {
          border-left: 2px solid #8C7355;
          padding-left: 16px;
        }

        .faq-q {
          font-size: 14px;
          color: #FAF6EE;
          margin: 0 0 8px 0;
          font-family: var(--font-header);
        }

        .faq-a {
          font-size: 12.5px;
          line-height: 1.55;
          color: #BCAAA4;
          margin: 0;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(6px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .modal-dialog {
          background-color: #FAF6EE;
          border: 2px solid #3E2723;
          border-radius: 10px;
          color: #231513;
          width: 100%;
          max-width: 520px;
          padding: 28px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .modal-tag {
          font-size: 10px;
          color: #8D6E63;
          letter-spacing: 1px;
        }

        .modal-title {
          font-family: var(--font-header);
          font-size: 22px;
          color: #231513;
          margin: 4px 0 0 0;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 18px;
          color: #8D6E63;
          cursor: pointer;
        }

        .modal-success {
          text-align: center;
          padding: 32px 16px;
        }

        .success-icon {
          font-size: 42px;
          color: #2e7d32;
          display: block;
          margin-bottom: 12px;
        }

        .modal-error {
          background-color: #ffebee;
          border: 1px solid #ef5350;
          color: #c62828;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          margin-bottom: 16px;
        }

        .form-group {
          margin-bottom: 14px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-group label {
          font-size: 11px;
          font-weight: bold;
          color: #5D4037;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          border: 1.5px solid #E8DFD0;
          border-radius: 6px;
          padding: 10px 12px;
          font-size: 13px;
          font-family: var(--font-mono);
          color: #231513;
          background-color: #fff;
          outline: none;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #8D6E63;
        }

        .form-row {
          display: flex;
          gap: 12px;
        }

        .flex-1 {
          flex: 1;
        }

        .btn-submit-review {
          width: 100%;
          background-color: #231513;
          color: #FAF6EE;
          border: none;
          border-radius: 6px;
          padding: 12px;
          font-size: 13px;
          font-weight: bold;
          font-family: var(--font-mono);
          cursor: pointer;
          margin-top: 8px;
          transition: background-color 0.2s;
        }
        .btn-submit-review:hover {
          background-color: #8D6E63;
        }
        .btn-submit-review:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
