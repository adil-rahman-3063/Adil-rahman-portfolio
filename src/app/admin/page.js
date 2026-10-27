'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Auth form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMessage, setAuthMessage] = useState(null);

  // Dashboard state
  const [activeTab, setActiveTab] = useState('requirements'); // 'requirements' | 'reviews' | 'projects'
  const [requirements, setRequirements] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [projects, setProjects] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState(null);

  // New review form
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', role: '', rating: 5, review: '', project: 'shopify' });

  // New project form
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({
    id: '',
    title: '',
    subtitle: '',
    status: 'Featured // Live',
    tagline: '',
    description: '',
    features: '',
    tech: '',
    link_texts: '',
    link_urls: '',
    categories: 'featured, web-Full-Stack',
    order: 1,
  });

  // Check auth on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch data when logged in or tab changes
  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session, activeTab]);

  const fetchDashboardData = async () => {
    setDataLoading(true);
    setActionMsg(null);
    try {
      if (activeTab === 'requirements') {
        const { data, error } = await supabase
          .from('requirements')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) setRequirements(data);
      } else if (activeTab === 'reviews') {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) setReviews(data);
      } else if (activeTab === 'projects') {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('order', { ascending: true });
        if (!error && data) setProjects(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err) {
      setLoginError(err.message || 'Invalid credentials or login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // Reviews actions
  const toggleReviewApproval = async (id, currentVal) => {
    const { error } = await supabase
      .from('reviews')
      .update({ approved: !currentVal })
      .eq('id', id);
    if (!error) {
      setReviews(reviews.map((r) => (r.id === id ? { ...r, approved: !currentVal } : r)));
      setActionMsg('Review status updated!');
    }
  };

  const deleteReview = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (!error) {
      setReviews(reviews.filter((r) => r.id !== id));
      setActionMsg('Review deleted.');
    }
  };

  const handleCreateReview = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('reviews').insert([
      {
        name: newReview.name,
        role: newReview.role,
        rating: Number(newReview.rating) || 5,
        review: newReview.review,
        project: newReview.project,
        approved: true,
      },
    ]).select();

    if (!error && data) {
      setReviews([data[0], ...reviews]);
      setShowAddReview(false);
      setNewReview({ name: '', role: '', rating: 5, review: '', project: 'shopify' });
      setActionMsg('New review added successfully!');
    } else {
      alert('Failed to add review: ' + (error?.message || 'Unknown error'));
    }
  };

  // Requirements actions
  const deleteRequirement = async (id) => {
    if (!confirm('Delete this client requirement lead?')) return;
    const { error } = await supabase.from('requirements').delete().eq('id', id);
    if (!error) {
      setRequirements(requirements.filter((r) => r.id !== id));
      setActionMsg('Requirement lead deleted.');
    }
  };

  // Projects actions
  const deleteProject = async (id) => {
    if (!confirm(`Delete project "${id}" permanently?`)) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) {
      setProjects(projects.filter((p) => p.id !== id));
      setActionMsg('Project deleted.');
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.id.trim() || !newProject.title.trim()) {
      alert('ID and Title are required.');
      return;
    }

    const { data, error } = await supabase.from('projects').insert([
      {
        id: newProject.id.trim().toLowerCase(),
        title: newProject.title.trim(),
        subtitle: newProject.subtitle.trim(),
        status: newProject.status.trim(),
        tagline: newProject.tagline.trim(),
        description: newProject.description.trim(),
        features: newProject.features.trim(),
        tech: newProject.tech.trim(),
        link_texts: newProject.link_texts.trim(),
        link_urls: newProject.link_urls.trim(),
        categories: newProject.categories.trim(),
        order: Number(newProject.order) || 0,
      },
    ]).select();

    if (!error && data) {
      setProjects([...projects, data[0]]);
      setShowAddProject(false);
      setActionMsg('Project created successfully!');
    } else {
      alert('Failed to create project: ' + (error?.message || 'Unknown error'));
    }
  };

  if (authLoading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-terminal-loader">
          <span className="cursor-blink">&gt;</span> AUTHENTICATING ACCESS...
        </div>
      </div>
    );
  }

  // ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
  if (!session) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="login-header">
            <div className="login-badge">// ADMIN ACCESS GATEWAY</div>
            <h1 className="login-title">admin.adilrahman.cc</h1>
            <p className="login-desc">Sign in with your Supabase credentials to manage inquiries, reviews, and portfolio projects.</p>
          </div>

          {loginError && <div className="admin-alert-error">{loginError}</div>}
          {authMessage && <div className="admin-alert-success">{authMessage}</div>}

          <form onSubmit={handleAuth} className="admin-form">
            <div className="admin-input-group">
              <label>ADMIN EMAIL</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adilrahman3063@gmail.com"
                className="admin-input"
              />
            </div>

            <div className="admin-input-group">
              <label>PASSWORD</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="admin-input"
              />
            </div>

            <button type="submit" disabled={loginLoading} className="admin-primary-btn">
              {loginLoading ? 'AUTHENTICATING...' : 'LOGIN TO ADMIN CONSOLE'}
            </button>
          </form>

          <div className="login-footer">
            <div className="public-return-link">
              <Link href="https://adilrahman.cc">← Return to public portfolio (adilrahman.cc)</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── LOGGED IN DASHBOARD ──────────────────────────────────────────────────────
  return (
    <div className="admin-dashboard-wrapper">
      {/* Top Navigation */}
      <header className="admin-header">
        <div className="admin-header-brand">
          <span className="admin-status-indicator">●</span>
          <span className="admin-header-title">ADMIN CONSOLE</span>
          <span className="admin-domain-chip">admin.adilrahman.cc</span>
        </div>

        <div className="admin-header-user">
          <span className="admin-user-email">{session.user.email}</span>
          <Link href="https://adilrahman.cc" target="_blank" className="admin-view-site-btn">
            View Live Site ↗
          </Link>
          <button onClick={handleSignOut} className="admin-logout-btn">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="admin-main">
        {actionMsg && <div className="admin-toast-banner">{actionMsg}</div>}

        {/* Tab Navigation */}
        <nav className="admin-tab-nav">
          <button
            className={`admin-tab-btn ${activeTab === 'requirements' ? 'active' : ''}`}
            onClick={() => setActiveTab('requirements')}
          >
            📋 Inquiries &amp; Leads ({requirements.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            ⭐ Reviews ({reviews.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            🚀 Projects ({projects.length})
          </button>
        </nav>

        {/* Tab 1: Requirements / Quotes */}
        {activeTab === 'requirements' && (
          <section className="admin-section">
            <div className="section-toolbar">
              <div>
                <h2>Client Requirements &amp; Quotes</h2>
                <p>Leads captured via the Request a Quote form and AI Chat assistant.</p>
              </div>
              <button onClick={fetchDashboardData} className="admin-refresh-btn">
                ↻ Refresh
              </button>
            </div>

            {dataLoading ? (
              <div className="admin-data-loader">Loading records from Supabase...</div>
            ) : requirements.length === 0 ? (
              <div className="admin-empty-state">No inquiries received yet.</div>
            ) : (
              <div className="requirements-list">
                {requirements.map((req) => {
                  const cleanPhone = (req.phone || '').replace(/[^\d+]/g, '');
                  const waLink = cleanPhone ? `https://wa.me/${cleanPhone.replace('+', '')}` : null;

                  return (
                    <div key={req.id} className="admin-card requirement-card">
                      <div className="card-top-bar">
                        <div className="card-client-meta">
                          <span className="client-id-badge">#{req.id}</span>
                          <span className="client-name">{req.name}</span>
                          <span className="client-date">{new Date(req.created_at).toLocaleString()}</span>
                        </div>
                        <button onClick={() => deleteRequirement(req.id)} className="admin-delete-btn" title="Delete lead">
                          Delete
                        </button>
                      </div>

                      <div className="client-contacts-grid">
                        {req.email && (
                          <div className="contact-chip">
                            <strong>Email:</strong> <a href={`mailto:${req.email}`}>{req.email}</a>
                          </div>
                        )}
                        {req.phone && (
                          <div className="contact-chip">
                            <strong>Phone/WA:</strong> <span>{req.phone}</span>
                            {waLink && (
                              <a href={waLink} target="_blank" rel="noreferrer" className="wa-direct-btn">
                                Open WhatsApp ↗
                              </a>
                            )}
                          </div>
                        )}
                        {req.instagram && (
                          <div className="contact-chip">
                            <strong>Instagram:</strong>{' '}
                            <a href={`https://instagram.com/${req.instagram.replace('@', '')}`} target="_blank" rel="noreferrer">
                              {req.instagram}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="requirement-body">
                        <div className="body-label">REQUIREMENT DETAILS:</div>
                        <p className="body-text">{req.requirement}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Tab 2: Reviews */}
        {activeTab === 'reviews' && (
          <section className="admin-section">
            <div className="section-toolbar">
              <div>
                <h2>Verified Reviews &amp; Testimonials</h2>
                <p>Public reviews appear on the site when "Approved" is toggled on.</p>
              </div>
              <div className="toolbar-actions">
                <button onClick={() => setShowAddReview(!showAddReview)} className="admin-action-btn">
                  {showAddReview ? 'Cancel' : '+ Add Review'}
                </button>
                <button onClick={fetchDashboardData} className="admin-refresh-btn">
                  ↻ Refresh
                </button>
              </div>
            </div>

            {showAddReview && (
              <form onSubmit={handleCreateReview} className="admin-inline-form">
                <h3>Add New Verified Review</h3>
                <div className="form-row">
                  <input
                    type="text"
                    required
                    placeholder="Client Name"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Role / Title (e.g. CEO, Merchant Navy)"
                    value={newReview.role}
                    onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                  />
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Linked Project ID (e.g. shopify, issaa)"
                    value={newReview.project}
                    onChange={(e) => setNewReview({ ...newReview, project: e.target.value })}
                  />
                </div>
                <textarea
                  required
                  rows={3}
                  placeholder="Review content..."
                  value={newReview.review}
                  onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                />
                <button type="submit" className="admin-primary-btn form-submit">
                  Save Review
                </button>
              </form>
            )}

            {dataLoading ? (
              <div className="admin-data-loader">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="admin-empty-state">No reviews in database.</div>
            ) : (
              <div className="reviews-admin-grid">
                {reviews.map((rev) => (
                  <div key={rev.id} className="admin-card review-admin-card">
                    <div className="card-top-bar">
                      <div>
                        <span className="client-name">{rev.name}</span>
                        <span className="client-role">({rev.role || 'Client'})</span>
                        <div className="star-rating">{'★'.repeat(rev.rating || 5)}</div>
                      </div>
                      <div className="review-ctrl-btns">
                        <button
                          onClick={() => toggleReviewApproval(rev.id, rev.approved)}
                          className={`approval-toggle-btn ${rev.approved ? 'approved' : 'pending'}`}
                        >
                          {rev.approved ? '✓ Approved' : '⏳ Pending'}
                        </button>
                        <button onClick={() => deleteReview(rev.id)} className="admin-delete-btn">
                          Delete
                        </button>
                      </div>
                    </div>

                    <p className="admin-review-text">"{rev.review}"</p>

                    <div className="review-admin-footer">
                      <span className="meta-project">
                        Linked Project: <strong>{rev.project || 'None'}</strong>
                      </span>
                      <span className="meta-date">{new Date(rev.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tab 3: Projects */}
        {activeTab === 'projects' && (
          <section className="admin-section">
            <div className="section-toolbar">
              <div>
                <h2>Portfolio Projects</h2>
                <p>All projects stored in Supabase with descriptions, tech tags, and categories.</p>
              </div>
              <div className="toolbar-actions">
                <button onClick={() => setShowAddProject(!showAddProject)} className="admin-action-btn">
                  {showAddProject ? 'Cancel' : '+ Add Project'}
                </button>
                <button onClick={fetchDashboardData} className="admin-refresh-btn">
                  ↻ Refresh
                </button>
              </div>
            </div>

            {showAddProject && (
              <form onSubmit={handleCreateProject} className="admin-inline-form">
                <h3>Add New Project</h3>
                <div className="form-row">
                  <input
                    type="text"
                    required
                    placeholder="Unique ID (e.g. zmr, viewpick)"
                    value={newProject.id}
                    onChange={(e) => setNewProject({ ...newProject, id: e.target.value })}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Title (e.g. ZMR Music)"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Subtitle (e.g. Flutter Mobile Client)"
                    value={newProject.subtitle}
                    onChange={(e) => setNewProject({ ...newProject, subtitle: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Order (e.g. 1)"
                    value={newProject.order}
                    onChange={(e) => setNewProject({ ...newProject, order: Number(e.target.value) })}
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Status (e.g. Featured // Complete)"
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Categories (e.g. featured, mobile, personal, saas)"
                    value={newProject.categories}
                    onChange={(e) => setNewProject({ ...newProject, categories: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Tech (comma-separated: Flutter, Supabase, Node)"
                    value={newProject.tech}
                    onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Short tagline..."
                  value={newProject.tagline}
                  onChange={(e) => setNewProject({ ...newProject, tagline: e.target.value })}
                />
                <textarea
                  rows={3}
                  placeholder="Detailed description..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
                <button type="submit" className="admin-primary-btn form-submit">
                  Save Project to Supabase
                </button>
              </form>
            )}

            {dataLoading ? (
              <div className="admin-data-loader">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="admin-empty-state">No projects in database.</div>
            ) : (
              <div className="projects-admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Categories</th>
                      <th>Tech</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((proj) => (
                      <tr key={proj.id}>
                        <td>{proj.order}</td>
                        <td><code>{proj.id}</code></td>
                        <td><strong>{proj.title}</strong></td>
                        <td><span className="status-tag">{proj.status}</span></td>
                        <td>{proj.categories}</td>
                        <td className="tech-cell">{proj.tech}</td>
                        <td>
                          <button onClick={() => deleteProject(proj.id)} className="admin-delete-btn">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>

      <style jsx>{`
        .admin-loading-screen,
        .admin-login-wrapper {
          min-height: 100vh;
          background: #0d0706;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          color: #efebe9;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .admin-terminal-loader {
          font-family: monospace;
          color: #d4a373;
          letter-spacing: 0.1em;
          font-size: 1.1rem;
        }

        .cursor-blink {
          animation: blink 1s infinite;
        }

        @keyframes blink {
          50% { opacity: 0; }
        }

        .admin-login-card {
          width: 100%;
          max-width: 440px;
          background: #180e0c;
          border: 1px solid rgba(212, 163, 115, 0.2);
          border-radius: 8px;
          padding: 36px 32px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
        }

        .login-badge {
          font-family: monospace;
          font-size: 0.75rem;
          color: #d4a373;
          letter-spacing: 0.15em;
          margin-bottom: 8px;
        }

        .login-title {
          font-size: 1.7rem;
          margin: 0 0 8px 0;
          color: #fff;
          font-weight: 700;
        }

        .login-desc {
          font-size: 0.88rem;
          color: #a89f91;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .admin-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .admin-input-group label {
          display: block;
          font-family: monospace;
          font-size: 0.75rem;
          color: #d4a373;
          letter-spacing: 0.1em;
          margin-bottom: 6px;
        }

        .admin-input {
          width: 100%;
          background: #231513;
          border: 1px solid rgba(212, 163, 115, 0.2);
          border-radius: 6px;
          padding: 12px 14px;
          color: #fff;
          font-size: 0.95rem;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }

        .admin-input:focus {
          border-color: #d4a373;
        }

        .admin-primary-btn {
          background: #d4a373;
          color: #180e0c;
          font-weight: 700;
          border: none;
          border-radius: 6px;
          padding: 12px 20px;
          cursor: pointer;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          transition: opacity 0.2s;
        }

        .admin-primary-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .admin-alert-error {
          background: rgba(220, 53, 69, 0.15);
          border: 1px solid #dc3545;
          color: #ff8585;
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 0.85rem;
          margin-bottom: 16px;
        }

        .admin-alert-success {
          background: rgba(40, 167, 69, 0.15);
          border: 1px solid #28a745;
          color: #75e68d;
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 0.85rem;
          margin-bottom: 16px;
        }

        .login-footer {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          text-align: center;
        }

        .toggle-signup-btn {
          background: transparent;
          border: none;
          color: #a89f91;
          font-size: 0.82rem;
          cursor: pointer;
          text-decoration: underline;
        }

        .public-return-link a {
          color: #d4a373;
          text-decoration: none;
          font-size: 0.85rem;
        }

        /* Dashboard View */
        .admin-dashboard-wrapper {
          min-height: 100vh;
          background: #0d0706;
          color: #efebe9;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 28px;
          background: #180e0c;
          border-bottom: 1px solid rgba(212, 163, 115, 0.2);
        }

        .admin-header-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .admin-status-indicator {
          color: #28a745;
          font-size: 0.9rem;
        }

        .admin-header-title {
          font-family: monospace;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #fff;
        }

        .admin-domain-chip {
          background: rgba(212, 163, 115, 0.15);
          border: 1px solid rgba(212, 163, 115, 0.3);
          color: #d4a373;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-family: monospace;
        }

        .admin-header-user {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .admin-user-email {
          color: #a89f91;
          font-size: 0.85rem;
          font-family: monospace;
        }

        .admin-view-site-btn {
          color: #d4a373;
          text-decoration: none;
          font-size: 0.85rem;
          padding: 6px 12px;
          border: 1px solid rgba(212, 163, 115, 0.3);
          border-radius: 4px;
        }

        .admin-logout-btn {
          background: transparent;
          border: 1px solid rgba(220, 53, 69, 0.4);
          color: #ff8585;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .admin-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 28px 24px;
        }

        .admin-toast-banner {
          background: rgba(40, 167, 69, 0.2);
          border: 1px solid #28a745;
          color: #a3f7b5;
          padding: 10px 16px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 0.9rem;
        }

        .admin-tab-nav {
          display: flex;
          gap: 10px;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(212, 163, 115, 0.15);
          padding-bottom: 8px;
        }

        .admin-tab-btn {
          background: transparent;
          border: none;
          color: #a89f91;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 10px 18px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .admin-tab-btn.active {
          background: #231513;
          color: #d4a373;
          border: 1px solid rgba(212, 163, 115, 0.3);
        }

        .section-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-toolbar h2 {
          margin: 0 0 4px 0;
          font-size: 1.4rem;
          color: #fff;
        }

        .section-toolbar p {
          margin: 0;
          color: #8c8273;
          font-size: 0.88rem;
        }

        .toolbar-actions {
          display: flex;
          gap: 10px;
        }

        .admin-action-btn,
        .admin-refresh-btn {
          background: #231513;
          border: 1px solid rgba(212, 163, 115, 0.3);
          color: #d4a373;
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .admin-card {
          background: #180e0c;
          border: 1px solid rgba(212, 163, 115, 0.15);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 16px;
        }

        .card-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .card-client-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .client-id-badge {
          background: #231513;
          color: #d4a373;
          font-family: monospace;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .client-name {
          font-weight: 700;
          font-size: 1.05rem;
          color: #fff;
        }

        .client-date {
          color: #8c8273;
          font-size: 0.8rem;
        }

        .client-contacts-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 14px;
        }

        .contact-chip {
          background: #231513;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .contact-chip a {
          color: #d4a373;
          text-decoration: none;
        }

        .wa-direct-btn {
          background: rgba(37, 211, 102, 0.2);
          color: #25d366 !important;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.75rem;
          margin-left: 4px;
        }

        .requirement-body {
          background: #120a08;
          border-left: 3px solid #d4a373;
          padding: 12px 14px;
          border-radius: 0 6px 6px 0;
        }

        .body-label {
          font-family: monospace;
          font-size: 0.7rem;
          color: #d4a373;
          margin-bottom: 4px;
          letter-spacing: 0.05em;
        }

        .body-text {
          margin: 0;
          color: #efebe9;
          font-size: 0.92rem;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        .admin-delete-btn {
          background: transparent;
          border: 1px solid rgba(220, 53, 69, 0.3);
          color: #ff8585;
          padding: 4px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.78rem;
        }

        .approval-toggle-btn {
          border: none;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          font-weight: 600;
        }

        .approval-toggle-btn.approved {
          background: rgba(40, 167, 69, 0.2);
          color: #75e68d;
        }

        .approval-toggle-btn.pending {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
        }

        .reviews-admin-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 16px;
        }

        .star-rating {
          color: #d4a373;
          font-size: 0.9rem;
          margin-top: 2px;
        }

        .admin-review-text {
          color: #d1c7bc;
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 10px 0 14px 0;
        }

        .review-admin-footer {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #8c8273;
          border-top: 1px solid rgba(212, 163, 115, 0.1);
          padding-top: 8px;
        }

        .admin-inline-form {
          background: #180e0c;
          border: 1px solid #d4a373;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .admin-inline-form h3 {
          margin: 0 0 8px 0;
          color: #d4a373;
          font-size: 1.1rem;
        }

        .form-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .form-row input,
        .form-row select,
        .admin-inline-form textarea {
          flex: 1;
          min-width: 180px;
          background: #231513;
          border: 1px solid rgba(212, 163, 115, 0.2);
          border-radius: 6px;
          padding: 10px 12px;
          color: #fff;
          font-size: 0.88rem;
          outline: none;
        }

        .form-submit {
          align-self: flex-start;
          margin-top: 4px;
        }

        .projects-admin-table-wrap {
          overflow-x: auto;
          background: #180e0c;
          border: 1px solid rgba(212, 163, 115, 0.15);
          border-radius: 8px;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.88rem;
        }

        .admin-table th,
        .admin-table td {
          padding: 12px 14px;
          border-bottom: 1px solid rgba(212, 163, 115, 0.1);
        }

        .admin-table th {
          background: #231513;
          color: #d4a373;
          font-family: monospace;
          font-size: 0.78rem;
          letter-spacing: 0.05em;
        }

        .status-tag {
          background: rgba(212, 163, 115, 0.15);
          color: #d4a373;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .tech-cell {
          max-width: 250px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #a89f91;
        }
      `}</style>
    </div>
  );
}
