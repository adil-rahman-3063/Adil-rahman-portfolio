'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

  // Navigation tab: 'overview' | 'requirements' | 'projects' | 'reviews'
  const [activeTab, setActiveTab] = useState('overview');

  // Database records
  const [requirements, setRequirements] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [projects, setProjects] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState(null);

  // Search queries
  const [reqSearch, setReqSearch] = useState('');
  const [projSearch, setProjSearch] = useState('');
  const [reviewFilter, setReviewFilter] = useState('all'); // 'all' | 'approved' | 'pending'

  // Modals & Editing states
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [showAddReview, setShowAddReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // Form templates
  const initialProjectForm = {
    id: '',
    title: '',
    subtitle: '',
    status: 'Featured // Live',
    tagline: '',
    description: '',
    features: '',
    tech: '',
    link_texts: 'Live Application',
    link_urls: '',
    categories: 'featured, web-Full-Stack',
    order: 1,
  };
  const [projectForm, setProjectForm] = useState(initialProjectForm);

  const initialReviewForm = {
    name: '',
    role: '',
    rating: 5,
    review: '',
    project: 'shopify',
    approved: true,
  };
  const [reviewForm, setReviewForm] = useState(initialReviewForm);

  // Check auth session on mount
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

  // Fetch all tables when logged in
  useEffect(() => {
    if (session) {
      fetchAllData();
    }
  }, [session]);

  const fetchAllData = async () => {
    setDataLoading(true);
    setActionMsg(null);
    try {
      const [reqRes, revRes, projRes] = await Promise.all([
        supabase.from('requirements').select('*').order('created_at', { ascending: false }),
        supabase.from('reviews').select('*').order('created_at', { ascending: false }),
        supabase.from('projects').select('*').order('order', { ascending: true }),
      ]);

      if (reqRes.data) setRequirements(reqRes.data);
      if (revRes.data) setReviews(revRes.data);
      if (projRes.data) setProjects(projRes.data);
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err) {
      setLoginError(err.message || 'Invalid email or password');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const notify = (msg) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(null), 4000);
  };

  // ─── PROJECT CRUD ─────────────────────────────────────────────────────────────
  const openEditProject = (proj) => {
    setEditingProject(proj);
    setProjectForm({
      id: proj.id,
      title: proj.title || '',
      subtitle: proj.subtitle || '',
      status: proj.status || '',
      tagline: proj.tagline || '',
      description: proj.description || '',
      features: proj.features || '',
      tech: proj.tech || '',
      link_texts: proj.link_texts || '',
      link_urls: proj.link_urls || '',
      categories: proj.categories || '',
      order: proj.order !== undefined ? proj.order : 0,
    });
    setShowAddProject(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!projectForm.id.trim() || !projectForm.title.trim()) {
      alert('Project ID and Title are required.');
      return;
    }

    const payload = {
      id: projectForm.id.trim().toLowerCase(),
      title: projectForm.title.trim(),
      subtitle: projectForm.subtitle.trim(),
      status: projectForm.status.trim(),
      tagline: projectForm.tagline.trim(),
      description: projectForm.description.trim(),
      features: projectForm.features.trim(),
      tech: projectForm.tech.trim(),
      link_texts: projectForm.link_texts.trim(),
      link_urls: projectForm.link_urls.trim(),
      categories: projectForm.categories.trim(),
      order: Number(projectForm.order) || 0,
    };

    if (editingProject) {
      // UPDATE
      const { error } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', editingProject.id);

      if (error) {
        alert('Update failed: ' + error.message);
        return;
      }

      // Also update saas table if exists
      if (payload.categories.toLowerCase().includes('saas')) {
        await supabase.from('saas').upsert([payload]);
      } else {
        await supabase.from('saas').delete().eq('id', payload.id);
      }

      setProjects(projects.map((p) => (p.id === editingProject.id ? { ...p, ...payload } : p)));
      notify(`Project "${payload.title}" updated successfully!`);
    } else {
      // INSERT NEW
      const { error, data } = await supabase.from('projects').insert([payload]).select();
      if (error) {
        alert('Creation failed: ' + error.message);
        return;
      }
      if (payload.categories.toLowerCase().includes('saas')) {
        await supabase.from('saas').upsert([payload]);
      }
      setProjects([...projects, data[0]]);
      notify(`Project "${payload.title}" added to Supabase!`);
    }

    setShowAddProject(false);
    setEditingProject(null);
    setProjectForm(initialProjectForm);
  };

  const handleDeleteProject = async (id, title) => {
    if (!confirm(`Are you sure you want to permanently delete "${title || id}"?`)) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) {
      await supabase.from('saas').delete().eq('id', id);
      setProjects(projects.filter((p) => p.id !== id));
      notify(`Project "${id}" deleted.`);
    } else {
      alert('Delete failed: ' + error.message);
    }
  };

  // ─── REVIEW CRUD ──────────────────────────────────────────────────────────────
  const openEditReview = (rev) => {
    setEditingReview(rev);
    setReviewForm({
      name: rev.name || '',
      role: rev.role || '',
      rating: Number(rev.rating) || 5,
      review: rev.review || '',
      project: rev.project || '',
      approved: Boolean(rev.approved),
    });
    setShowAddReview(true);
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.review.trim()) {
      alert('Reviewer Name and Review text are required.');
      return;
    }

    const payload = {
      name: reviewForm.name.trim(),
      role: reviewForm.role.trim(),
      rating: Number(reviewForm.rating) || 5,
      review: reviewForm.review.trim(),
      project: reviewForm.project.trim(),
      approved: Boolean(reviewForm.approved),
    };

    if (editingReview) {
      // UPDATE
      const { error } = await supabase.from('reviews').update(payload).eq('id', editingReview.id);
      if (error) {
        alert('Update failed: ' + error.message);
        return;
      }
      setReviews(reviews.map((r) => (r.id === editingReview.id ? { ...r, ...payload } : r)));
      notify(`Review from "${payload.name}" updated!`);
    } else {
      // INSERT NEW
      const { data, error } = await supabase.from('reviews').insert([payload]).select();
      if (error) {
        alert('Insert failed: ' + error.message);
        return;
      }
      setReviews([data[0], ...reviews]);
      notify(`Verified review added!`);
    }

    setShowAddReview(false);
    setEditingReview(null);
    setReviewForm(initialReviewForm);
  };

  const toggleApproval = async (id, currentVal) => {
    const { error } = await supabase
      .from('reviews')
      .update({ approved: !currentVal })
      .eq('id', id);
    if (!error) {
      setReviews(reviews.map((r) => (r.id === id ? { ...r, approved: !currentVal } : r)));
      notify(!currentVal ? 'Review approved for public display!' : 'Review hidden from public.');
    }
  };

  const handleDeleteReview = async (id, name) => {
    if (!confirm(`Delete review from "${name}"?`)) return;
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (!error) {
      setReviews(reviews.filter((r) => r.id !== id));
      notify('Review deleted.');
    }
  };

  // ─── REQUIREMENT / INQUIRY CRUD ───────────────────────────────────────────────
  const handleDeleteRequirement = async (id, name) => {
    if (!confirm(`Delete inquiry #${id} from "${name}"?`)) return;
    const { error } = await supabase.from('requirements').delete().eq('id', id);
    if (!error) {
      setRequirements(requirements.filter((r) => r.id !== id));
      notify(`Inquiry #${id} deleted.`);
    }
  };

  // Filtered queries
  const filteredRequirements = useMemo(() => {
    if (!reqSearch.trim()) return requirements;
    const q = reqSearch.toLowerCase();
    return requirements.filter(
      (r) =>
        (r.name || '').toLowerCase().includes(q) ||
        (r.email || '').toLowerCase().includes(q) ||
        (r.phone || '').toLowerCase().includes(q) ||
        (r.instagram || '').toLowerCase().includes(q) ||
        (r.requirement || '').toLowerCase().includes(q)
    );
  }, [requirements, reqSearch]);

  const filteredProjects = useMemo(() => {
    if (!projSearch.trim()) return projects;
    const q = projSearch.toLowerCase();
    return projects.filter(
      (p) =>
        (p.id || '').toLowerCase().includes(q) ||
        (p.title || '').toLowerCase().includes(q) ||
        (p.tech || '').toLowerCase().includes(q) ||
        (p.categories || '').toLowerCase().includes(q)
    );
  }, [projects, projSearch]);

  const filteredReviews = useMemo(() => {
    if (reviewFilter === 'approved') return reviews.filter((r) => r.approved);
    if (reviewFilter === 'pending') return reviews.filter((r) => !r.approved);
    return reviews;
  }, [reviews, reviewFilter]);

  // Loading screen
  if (authLoading) {
    return (
      <div className="admin-loading-screen">
        <div className="terminal-box">
          <span className="blink">&gt;</span> CONNECTING TO SUPABASE GATEWAY...
        </div>
      </div>
    );
  }

  // ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
  if (!session) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="login-badge">// ADMIN CONTROL PORTAL</div>
          <h1 className="login-title">admin.adilrahman.cc</h1>
          <p className="login-desc">Sign in with your Supabase account to manage client inquiries, portfolio projects, and reviews.</p>

          {loginError && <div className="alert-error">{loginError}</div>}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>ADMIN EMAIL</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adilrahman3063@gmail.com"
                className="styled-input"
              />
            </div>

            <div className="form-group">
              <label>PASSWORD</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="styled-input"
              />
            </div>

            <button type="submit" disabled={loginLoading} className="gold-btn full-width">
              {loginLoading ? 'AUTHENTICATING...' : 'ACCESS DASHBOARD'}
            </button>
          </form>

          <div className="login-footer">
            <Link href="https://adilrahman.cc" className="back-link">
              ← Return to Public Portfolio (adilrahman.cc)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD INTERFACE ──────────────────────────────────────────────────────
  return (
    <div className="admin-container">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="nav-left">
          <span className="dot-active">●</span>
          <span className="nav-title">ADIL RAHMAN // ADMIN</span>
          <span className="subdomain-badge">admin.adilrahman.cc</span>
        </div>

        <div className="nav-right">
          <span className="user-email">{session.user.email}</span>
          <Link href="https://adilrahman.cc" target="_blank" className="nav-link-btn">
            Live Site ↗
          </Link>
          <button onClick={handleSignOut} className="logout-btn">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="main-content">
        {actionMsg && <div className="toast-notification">✓ {actionMsg}</div>}

        {/* Tab Selector */}
        <div className="tabs-header">
          <button
            className={`tab-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Activity Overview
          </button>
          <button
            className={`tab-item ${activeTab === 'requirements' ? 'active' : ''}`}
            onClick={() => setActiveTab('requirements')}
          >
            📋 Inquiries &amp; Leads ({requirements.length})
          </button>
          <button
            className={`tab-item ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            🚀 Projects ({projects.length})
          </button>
          <button
            className={`tab-item ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            ⭐ Reviews ({reviews.length})
          </button>
        </div>

        {/* ─── TAB 1: OVERVIEW & HOMEPAGE ACTIVITY ───────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="overview-section">
            {/* KPI Cards */}
            <div className="kpi-grid">
              <div className="kpi-card highlight" onClick={() => setActiveTab('requirements')}>
                <div className="kpi-label">TOTAL CLIENT INQUIRIES</div>
                <div className="kpi-val">{requirements.length}</div>
                <div className="kpi-sub">From Quote Form &amp; AI Chat</div>
              </div>

              <div className="kpi-card" onClick={() => setActiveTab('reviews')}>
                <div className="kpi-label">VERIFIED REVIEWS</div>
                <div className="kpi-val">{reviews.length}</div>
                <div className="kpi-sub">
                  {reviews.filter((r) => r.approved).length} Approved / {reviews.filter((r) => !r.approved).length} Pending
                </div>
              </div>

              <div className="kpi-card" onClick={() => setActiveTab('projects')}>
                <div className="kpi-label">PORTFOLIO PROJECTS</div>
                <div className="kpi-val">{projects.length}</div>
                <div className="kpi-sub">Active in Supabase</div>
              </div>

              <div className="kpi-card">
                <div className="kpi-label">SYSTEM GATEWAY</div>
                <div className="kpi-val status-green">ONLINE</div>
                <div className="kpi-sub">Supabase PostgREST + Edge</div>
              </div>
            </div>

            {/* Recent Inquiries Alert Box */}
            <div className="panel-box">
              <div className="panel-header">
                <div>
                  <h3 className="panel-title">⚡ Latest Client Inquiries (Recent 5)</h3>
                  <p className="panel-desc">Real-time quote submissions and AI tool captures sent through the homepage.</p>
                </div>
                <button onClick={fetchAllData} className="refresh-btn">
                  ↻ Refresh Now
                </button>
              </div>

              {requirements.length === 0 ? (
                <div className="empty-panel">No client inquiries received yet.</div>
              ) : (
                <div className="recent-inquiries-stream">
                  {requirements.slice(0, 5).map((req) => {
                    const cleanPhone = (req.phone || '').replace(/[^\d+]/g, '');
                    const waLink = cleanPhone ? `https://wa.me/${cleanPhone.replace('+', '')}` : null;

                    return (
                      <div key={req.id} className="stream-item">
                        <div className="stream-header">
                          <span className="client-badge">Client #{req.id}</span>
                          <span className="stream-name">{req.name}</span>
                          <span className="stream-date">{new Date(req.created_at).toLocaleString()}</span>
                        </div>

                        <div className="stream-contacts">
                          {req.email && (
                            <span className="contact-tag">
                              ✉ <a href={`mailto:${req.email}`}>{req.email}</a>
                            </span>
                          )}
                          {req.phone && (
                            <span className="contact-tag">
                              📞 {req.phone}
                              {waLink && (
                                <a href={waLink} target="_blank" rel="noreferrer" className="wa-btn">
                                  WhatsApp ↗
                                </a>
                              )}
                            </span>
                          )}
                          {req.instagram && <span className="contact-tag">📷 {req.instagram}</span>}
                        </div>

                        <p className="stream-text">{req.requirement}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 2: INQUIRIES & LEADS ───────────────────────────────────────── */}
        {activeTab === 'requirements' && (
          <div className="requirements-section">
            <div className="section-bar">
              <div className="bar-info">
                <h2>Client Requirements &amp; Quotes</h2>
                <p>Every lead submitted through the portfolio quote sheet or AI assistant.</p>
              </div>

              <div className="bar-actions">
                <input
                  type="text"
                  placeholder="Search by name, email, details..."
                  value={reqSearch}
                  onChange={(e) => setReqSearch(e.target.value)}
                  className="search-input"
                />
                <button onClick={fetchAllData} className="refresh-btn">
                  ↻ Refresh
                </button>
              </div>
            </div>

            {dataLoading ? (
              <div className="data-loader">Loading records from Supabase...</div>
            ) : filteredRequirements.length === 0 ? (
              <div className="empty-panel">No inquiries matching your query.</div>
            ) : (
              <div className="cards-stack">
                {filteredRequirements.map((req) => {
                  const cleanPhone = (req.phone || '').replace(/[^\d+]/g, '');
                  const waLink = cleanPhone ? `https://wa.me/${cleanPhone.replace('+', '')}` : null;

                  return (
                    <div key={req.id} className="data-card">
                      <div className="card-top">
                        <div className="card-identity">
                          <span className="lead-tag">INQUIRY #{req.id}</span>
                          <span className="lead-name">{req.name}</span>
                          <span className="lead-time">{new Date(req.created_at).toLocaleString()}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteRequirement(req.id, req.name)}
                          className="danger-btn"
                          title="Delete Lead"
                        >
                          Delete
                        </button>
                      </div>

                      <div className="contacts-row">
                        {req.email && (
                          <div className="contact-pill">
                            <strong>Email:</strong> <a href={`mailto:${req.email}`}>{req.email}</a>
                          </div>
                        )}
                        {req.phone && (
                          <div className="contact-pill">
                            <strong>Phone:</strong> <span>{req.phone}</span>
                            {waLink && (
                              <a href={waLink} target="_blank" rel="noreferrer" className="wa-btn">
                                Open WhatsApp ↗
                              </a>
                            )}
                          </div>
                        )}
                        {req.instagram && (
                          <div className="contact-pill">
                            <strong>Instagram:</strong>{' '}
                            <a href={`https://instagram.com/${req.instagram.replace('@', '')}`} target="_blank" rel="noreferrer">
                              {req.instagram}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="req-box">
                        <div className="req-label">// REQUIREMENT DETAILS:</div>
                        <div className="req-content">{req.requirement}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: PROJECTS (ADD, EDIT, TABLE) ──────────────────────────────── */}
        {activeTab === 'projects' && (
          <div className="projects-section">
            <div className="section-bar">
              <div className="bar-info">
                <h2>Portfolio Projects Database</h2>
                <p>Manage, add, and update values in your projects table. Changes reflect on the live site.</p>
              </div>

              <div className="bar-actions">
                <input
                  type="text"
                  placeholder="Filter projects by title, tech..."
                  value={projSearch}
                  onChange={(e) => setProjSearch(e.target.value)}
                  className="search-input"
                />
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setProjectForm(initialProjectForm);
                    setShowAddProject(true);
                  }}
                  className="gold-btn"
                >
                  + Add Project
                </button>
                <button onClick={fetchAllData} className="refresh-btn">
                  ↻ Refresh
                </button>
              </div>
            </div>

            {/* Project Edit / Create Modal */}
            {showAddProject && (
              <div className="modal-backdrop">
                <div className="modal-window wide">
                  <div className="modal-header">
                    <h3>{editingProject ? `Edit Project: ${editingProject.title}` : 'Add New Project'}</h3>
                    <button onClick={() => setShowAddProject(false)} className="close-btn">✕</button>
                  </div>

                  <form onSubmit={handleSaveProject} className="modal-form">
                    <div className="grid-2">
                      <div className="form-group">
                        <label>UNIQUE ID (lowercase, no spaces) *</label>
                        <input
                          type="text"
                          required
                          disabled={!!editingProject}
                          value={projectForm.id}
                          onChange={(e) => setProjectForm({ ...projectForm, id: e.target.value })}
                          placeholder="e.g. zmr, viewpick, new-saas"
                          className="styled-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>PROJECT TITLE *</label>
                        <input
                          type="text"
                          required
                          value={projectForm.title}
                          onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                          placeholder="e.g. ZMR Music"
                          className="styled-input"
                        />
                      </div>
                    </div>

                    <div className="grid-3">
                      <div className="form-group">
                        <label>SUBTITLE</label>
                        <input
                          type="text"
                          value={projectForm.subtitle}
                          onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                          placeholder="e.g. Flutter Mobile Client"
                          className="styled-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>STATUS</label>
                        <input
                          type="text"
                          value={projectForm.status}
                          onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                          placeholder="Featured // Complete"
                          className="styled-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>DISPLAY ORDER</label>
                        <input
                          type="number"
                          value={projectForm.order}
                          onChange={(e) => setProjectForm({ ...projectForm, order: Number(e.target.value) })}
                          placeholder="1"
                          className="styled-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>CATEGORIES (comma-separated: featured, web-Full-Stack, mobile, saas, personal, freelance)</label>
                      <input
                        type="text"
                        value={projectForm.categories}
                        onChange={(e) => setProjectForm({ ...projectForm, categories: e.target.value })}
                        placeholder="featured, web-Full-Stack, personal"
                        className="styled-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>TECH STACK (comma-separated)</label>
                      <input
                        type="text"
                        value={projectForm.tech}
                        onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                        placeholder="Flutter, Riverpod, Supabase, Cloudflare Workers"
                        className="styled-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>ONE-LINE TAGLINE</label>
                      <input
                        type="text"
                        value={projectForm.tagline}
                        onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })}
                        placeholder="High-performance client focused on sleek background audio."
                        className="styled-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>DESCRIPTION (FULL OVERVIEW)</label>
                      <textarea
                        rows={3}
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        placeholder="Detailed project summary..."
                        className="styled-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>FEATURES (separate each bullet with a semicolon ; )</label>
                      <textarea
                        rows={3}
                        value={projectForm.features}
                        onChange={(e) => setProjectForm({ ...projectForm, features: e.target.value })}
                        placeholder="Feature one; Feature two; Feature three..."
                        className="styled-input"
                      />
                    </div>

                    <div className="grid-2">
                      <div className="form-group">
                        <label>LINK TEXT(S) (e.g. Live Site or GitHub Repository)</label>
                        <input
                          type="text"
                          value={projectForm.link_texts}
                          onChange={(e) => setProjectForm({ ...projectForm, link_texts: e.target.value })}
                          placeholder="Live Application"
                          className="styled-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>LINK URL(S)</label>
                        <input
                          type="text"
                          value={projectForm.link_urls}
                          onChange={(e) => setProjectForm({ ...projectForm, link_urls: e.target.value })}
                          placeholder="https://..."
                          className="styled-input"
                        />
                      </div>
                    </div>

                    <div className="modal-actions">
                      <button type="button" onClick={() => setShowAddProject(false)} className="cancel-btn">
                        Cancel
                      </button>
                      <button type="submit" className="gold-btn">
                        {editingProject ? 'Save Changes' : 'Create Project'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Projects Table */}
            {dataLoading ? (
              <div className="data-loader">Loading projects...</div>
            ) : filteredProjects.length === 0 ? (
              <div className="empty-panel">No projects found.</div>
            ) : (
              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>Order</th>
                      <th style={{ width: '110px' }}>ID</th>
                      <th>Title &amp; Subtitle</th>
                      <th>Status</th>
                      <th>Categories</th>
                      <th>Tech Stack</th>
                      <th style={{ width: '130px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((proj) => (
                      <tr key={proj.id}>
                        <td className="bold-gold">{proj.order}</td>
                        <td><code>{proj.id}</code></td>
                        <td>
                          <div className="table-title">{proj.title}</div>
                          {proj.subtitle && <div className="table-subtitle">{proj.subtitle}</div>}
                        </td>
                        <td><span className="badge-status">{proj.status}</span></td>
                        <td><span className="category-text">{proj.categories}</span></td>
                        <td className="tech-cell">{proj.tech}</td>
                        <td className="actions-cell">
                          <button onClick={() => openEditProject(proj)} className="edit-btn">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteProject(proj.id, proj.title)} className="danger-btn">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 4: REVIEWS (ADD, EDIT, APPROVAL) ───────────────────────────── */}
        {activeTab === 'reviews' && (
          <div className="reviews-section">
            <div className="section-bar">
              <div className="bar-info">
                <h2>Client Testimonials &amp; Reviews</h2>
                <p>Toggle approval to display on the live site, edit review content, or add new testimonials.</p>
              </div>

              <div className="bar-actions">
                <select
                  value={reviewFilter}
                  onChange={(e) => setReviewFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Reviews ({reviews.length})</option>
                  <option value="approved">Approved Only</option>
                  <option value="pending">Pending Only</option>
                </select>

                <button
                  onClick={() => {
                    setEditingReview(null);
                    setReviewForm(initialReviewForm);
                    setShowAddReview(true);
                  }}
                  className="gold-btn"
                >
                  + Add Review
                </button>
                <button onClick={fetchAllData} className="refresh-btn">
                  ↻ Refresh
                </button>
              </div>
            </div>

            {/* Review Edit / Create Modal */}
            {showAddReview && (
              <div className="modal-backdrop">
                <div className="modal-window">
                  <div className="modal-header">
                    <h3>{editingReview ? `Edit Review from ${editingReview.name}` : 'Add Verified Review'}</h3>
                    <button onClick={() => setShowAddReview(false)} className="close-btn">✕</button>
                  </div>

                  <form onSubmit={handleSaveReview} className="modal-form">
                    <div className="grid-2">
                      <div className="form-group">
                        <label>CLIENT NAME *</label>
                        <input
                          type="text"
                          required
                          value={reviewForm.name}
                          onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                          placeholder="e.g. Aslam Bin Kader"
                          className="styled-input"
                        />
                      </div>

                      <div className="form-group">
                        <label>ROLE / COMPANY</label>
                        <input
                          type="text"
                          value={reviewForm.role}
                          onChange={(e) => setReviewForm({ ...reviewForm, role: e.target.value })}
                          placeholder="e.g. CEO at T2 Autohaus"
                          className="styled-input"
                        />
                      </div>
                    </div>

                    <div className="grid-2">
                      <div className="form-group">
                        <label>RATING</label>
                        <select
                          value={reviewForm.rating}
                          onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                          className="styled-input"
                        >
                          <option value={5}>5 Stars ★★★★★</option>
                          <option value={4}>4 Stars ★★★★☆</option>
                          <option value={3}>3 Stars ★★★☆☆</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>LINKED PROJECT ID</label>
                        <select
                          value={reviewForm.project}
                          onChange={(e) => setReviewForm({ ...reviewForm, project: e.target.value })}
                          className="styled-input"
                        >
                          <option value="">-- None / General --</option>
                          {projects.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.title} ({p.id})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>REVIEW TEXT *</label>
                      <textarea
                        rows={4}
                        required
                        value={reviewForm.review}
                        onChange={(e) => setReviewForm({ ...reviewForm, review: e.target.value })}
                        placeholder="Write client testimonial here..."
                        className="styled-input"
                      />
                    </div>

                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={reviewForm.approved}
                          onChange={(e) => setReviewForm({ ...reviewForm, approved: e.target.checked })}
                        />
                        <span>Approved for live website display</span>
                      </label>
                    </div>

                    <div className="modal-actions">
                      <button type="button" onClick={() => setShowAddReview(false)} className="cancel-btn">
                        Cancel
                      </button>
                      <button type="submit" className="gold-btn">
                        {editingReview ? 'Save Changes' : 'Add Review'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Reviews Grid */}
            {dataLoading ? (
              <div className="data-loader">Loading reviews...</div>
            ) : filteredReviews.length === 0 ? (
              <div className="empty-panel">No reviews matching the filter.</div>
            ) : (
              <div className="reviews-grid">
                {filteredReviews.map((rev) => (
                  <div key={rev.id} className="review-box">
                    <div className="review-top">
                      <div>
                        <div className="rev-name">{rev.name}</div>
                        <div className="rev-role">{rev.role || 'Client'}</div>
                        <div className="stars">{'★'.repeat(rev.rating || 5)}</div>
                      </div>

                      <div className="rev-status-controls">
                        <button
                          onClick={() => toggleApproval(rev.id, rev.approved)}
                          className={`status-btn ${rev.approved ? 'live' : 'hidden'}`}
                        >
                          {rev.approved ? '✓ Approved' : '⏳ Pending'}
                        </button>
                      </div>
                    </div>

                    <p className="rev-quote">"{rev.review}"</p>

                    <div className="rev-bottom">
                      <span className="project-tag">
                        Project: <strong>{rev.project || 'General'}</strong>
                      </span>
                      <div className="rev-actions">
                        <button onClick={() => openEditReview(rev)} className="edit-btn">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteReview(rev.id, rev.name)} className="danger-btn">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <style jsx>{`
        .admin-loading-screen,
        .admin-login-wrapper {
          min-height: 100vh;
          background: #0c0706;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          color: #efebe9;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .terminal-box {
          font-family: monospace;
          color: #d4a373;
          font-size: 1.1rem;
          letter-spacing: 0.1em;
        }

        .blink {
          animation: blink 1s infinite;
        }

        @keyframes blink {
          50% { opacity: 0; }
        }

        .admin-login-card {
          width: 100%;
          max-width: 420px;
          background: #180e0c;
          border: 1px solid rgba(212, 163, 115, 0.2);
          border-radius: 8px;
          padding: 36px 30px;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.7);
        }

        .login-badge {
          font-family: monospace;
          color: #d4a373;
          font-size: 0.75rem;
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
          color: #a89f91;
          font-size: 0.88rem;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group label {
          display: block;
          font-family: monospace;
          color: #d4a373;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          margin-bottom: 6px;
        }

        .styled-input {
          width: 100%;
          background: #231513;
          border: 1px solid rgba(212, 163, 115, 0.2);
          border-radius: 6px;
          padding: 10px 14px;
          color: #fff;
          font-size: 0.92rem;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }

        .styled-input:focus {
          border-color: #d4a373;
        }

        .gold-btn {
          background: #d4a373;
          color: #180e0c;
          font-weight: 700;
          border: none;
          border-radius: 6px;
          padding: 10px 18px;
          cursor: pointer;
          font-size: 0.88rem;
          letter-spacing: 0.04em;
          transition: opacity 0.2s;
        }

        .gold-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .gold-btn.full-width {
          width: 100%;
          padding: 12px;
        }

        .alert-error {
          background: rgba(220, 53, 69, 0.2);
          border: 1px solid #dc3545;
          color: #ff8585;
          padding: 10px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          margin-bottom: 16px;
        }

        .login-footer {
          margin-top: 24px;
          text-align: center;
        }

        .back-link {
          color: #a89f91;
          font-size: 0.82rem;
          text-decoration: none;
        }

        .back-link:hover {
          color: #d4a373;
        }

        /* ─── DASHBOARD SHELL ─── */
        .admin-container {
          min-height: 100vh;
          background: #0d0706;
          color: #efebe9;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 28px;
          background: #180e0c;
          border-bottom: 1px solid rgba(212, 163, 115, 0.2);
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dot-active {
          color: #28a745;
          font-size: 0.9rem;
        }

        .nav-title {
          font-family: monospace;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #fff;
        }

        .subdomain-badge {
          background: rgba(212, 163, 115, 0.15);
          border: 1px solid rgba(212, 163, 115, 0.3);
          color: #d4a373;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-family: monospace;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .user-email {
          color: #a89f91;
          font-size: 0.85rem;
          font-family: monospace;
        }

        .nav-link-btn {
          color: #d4a373;
          text-decoration: none;
          font-size: 0.82rem;
          padding: 6px 12px;
          border: 1px solid rgba(212, 163, 115, 0.3);
          border-radius: 4px;
        }

        .logout-btn {
          background: transparent;
          border: 1px solid rgba(220, 53, 69, 0.4);
          color: #ff8585;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.82rem;
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 28px 24px;
        }

        .toast-notification {
          background: rgba(40, 167, 69, 0.2);
          border: 1px solid #28a745;
          color: #92f7a9;
          padding: 10px 16px;
          border-radius: 6px;
          margin-bottom: 20px;
          font-size: 0.9rem;
        }

        .tabs-header {
          display: flex;
          gap: 10px;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(212, 163, 115, 0.15);
          padding-bottom: 8px;
          overflow-x: auto;
        }

        .tab-item {
          background: transparent;
          border: none;
          color: #a89f91;
          font-weight: 600;
          font-size: 0.92rem;
          padding: 10px 18px;
          border-radius: 6px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .tab-item.active {
          background: #231513;
          color: #d4a373;
          border: 1px solid rgba(212, 163, 115, 0.3);
        }

        /* ─── OVERVIEW SECTION ─── */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }

        .kpi-card {
          background: #180e0c;
          border: 1px solid rgba(212, 163, 115, 0.15);
          border-radius: 8px;
          padding: 20px;
          cursor: pointer;
          transition: transform 0.2s, border-color 0.2s;
        }

        .kpi-card:hover {
          transform: translateY(-2px);
          border-color: #d4a373;
        }

        .kpi-card.highlight {
          border-color: rgba(212, 163, 115, 0.4);
          background: linear-gradient(145deg, #201311, #180e0c);
        }

        .kpi-label {
          font-family: monospace;
          color: #d4a373;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }

        .kpi-val {
          font-size: 2.2rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }

        .kpi-val.status-green {
          color: #28a745;
          font-size: 1.8rem;
        }

        .kpi-sub {
          font-size: 0.8rem;
          color: #8c8273;
        }

        .panel-box {
          background: #180e0c;
          border: 1px solid rgba(212, 163, 115, 0.15);
          border-radius: 8px;
          padding: 24px;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .panel-title {
          margin: 0 0 4px 0;
          font-size: 1.25rem;
          color: #fff;
        }

        .panel-desc {
          margin: 0;
          color: #8c8273;
          font-size: 0.85rem;
        }

        .recent-inquiries-stream {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .stream-item {
          background: #231513;
          border-left: 3px solid #d4a373;
          border-radius: 0 6px 6px 0;
          padding: 14px 18px;
        }

        .stream-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .client-badge {
          background: #120a08;
          color: #d4a373;
          font-family: monospace;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .stream-name {
          font-weight: 700;
          color: #fff;
          font-size: 0.95rem;
        }

        .stream-date {
          color: #8c8273;
          font-size: 0.78rem;
          margin-left: auto;
        }

        .stream-contacts {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }

        .contact-tag {
          font-size: 0.82rem;
          color: #efebe9;
        }

        .contact-tag a {
          color: #d4a373;
          text-decoration: none;
        }

        .wa-btn {
          background: rgba(37, 211, 102, 0.2);
          color: #25d366 !important;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.75rem;
          margin-left: 6px;
        }

        .stream-text {
          margin: 0;
          color: #d1c7bc;
          font-size: 0.88rem;
          line-height: 1.4;
        }

        /* ─── SECTION HEADERS & ACTIONS ─── */
        .section-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .bar-info h2 {
          margin: 0 0 4px 0;
          font-size: 1.4rem;
          color: #fff;
        }

        .bar-info p {
          margin: 0;
          color: #8c8273;
          font-size: 0.86rem;
        }

        .bar-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .search-input {
          background: #180e0c;
          border: 1px solid rgba(212, 163, 115, 0.25);
          border-radius: 6px;
          padding: 8px 12px;
          color: #fff;
          font-size: 0.85rem;
          width: 240px;
          outline: none;
        }

        .filter-select {
          background: #180e0c;
          border: 1px solid rgba(212, 163, 115, 0.25);
          border-radius: 6px;
          padding: 8px 12px;
          color: #fff;
          font-size: 0.85rem;
          outline: none;
        }

        .refresh-btn {
          background: #180e0c;
          border: 1px solid rgba(212, 163, 115, 0.3);
          color: #d4a373;
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .data-loader,
        .empty-panel {
          padding: 36px;
          text-align: center;
          color: #8c8273;
          background: #180e0c;
          border-radius: 8px;
        }

        /* ─── CARDS STACK (REQUIREMENTS) ─── */
        .cards-stack {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .data-card {
          background: #180e0c;
          border: 1px solid rgba(212, 163, 115, 0.15);
          border-radius: 8px;
          padding: 20px;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .card-identity {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .lead-tag {
          background: #231513;
          color: #d4a373;
          font-family: monospace;
          font-size: 0.75rem;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .lead-name {
          font-weight: 700;
          font-size: 1.05rem;
          color: #fff;
        }

        .lead-time {
          color: #8c8273;
          font-size: 0.8rem;
        }

        .contacts-row {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .contact-pill {
          background: #231513;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .contact-pill a {
          color: #d4a373;
          text-decoration: none;
        }

        .req-box {
          background: #120a08;
          border-left: 3px solid #d4a373;
          padding: 12px 14px;
          border-radius: 0 6px 6px 0;
        }

        .req-label {
          font-family: monospace;
          font-size: 0.7rem;
          color: #d4a373;
          margin-bottom: 4px;
          letter-spacing: 0.05em;
        }

        .req-content {
          color: #efebe9;
          font-size: 0.92rem;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        /* ─── PROJECTS TABLE & ACTIONS ─── */
        .table-wrapper {
          overflow-x: auto;
          background: #180e0c;
          border: 1px solid rgba(212, 163, 115, 0.15);
          border-radius: 8px;
        }

        .custom-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.88rem;
        }

        .custom-table th,
        .custom-table td {
          padding: 12px 14px;
          border-bottom: 1px solid rgba(212, 163, 115, 0.1);
        }

        .custom-table th {
          background: #231513;
          color: #d4a373;
          font-family: monospace;
          font-size: 0.76rem;
          letter-spacing: 0.06em;
        }

        .bold-gold {
          color: #d4a373;
          font-weight: 700;
        }

        .table-title {
          font-weight: 700;
          color: #fff;
        }

        .table-subtitle {
          color: #8c8273;
          font-size: 0.78rem;
        }

        .badge-status {
          background: rgba(212, 163, 115, 0.15);
          color: #d4a373;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .category-text {
          color: #a89f91;
          font-size: 0.8rem;
        }

        .tech-cell {
          max-width: 220px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #a89f91;
        }

        .actions-cell {
          display: flex;
          gap: 6px;
          justify-content: center;
        }

        .edit-btn {
          background: #231513;
          border: 1px solid rgba(212, 163, 115, 0.4);
          color: #d4a373;
          padding: 4px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.78rem;
        }

        .danger-btn {
          background: transparent;
          border: 1px solid rgba(220, 53, 69, 0.4);
          color: #ff8585;
          padding: 4px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.78rem;
        }

        /* ─── REVIEWS GRID ─── */
        .reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 16px;
        }

        .review-box {
          background: #180e0c;
          border: 1px solid rgba(212, 163, 115, 0.15);
          border-radius: 8px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .review-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .rev-name {
          font-weight: 700;
          color: #fff;
          font-size: 1rem;
        }

        .rev-role {
          color: #8c8273;
          font-size: 0.8rem;
        }

        .stars {
          color: #d4a373;
          font-size: 0.85rem;
          margin-top: 2px;
        }

        .status-btn {
          border: none;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.78rem;
          cursor: pointer;
          font-weight: 600;
        }

        .status-btn.live {
          background: rgba(40, 167, 69, 0.2);
          color: #75e68d;
        }

        .status-btn.hidden {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
        }

        .rev-quote {
          color: #d1c7bc;
          font-size: 0.9rem;
          line-height: 1.5;
          margin: 0 0 16px 0;
          flex-grow: 1;
        }

        .rev-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(212, 163, 115, 0.1);
          padding-top: 10px;
        }

        .project-tag {
          font-size: 0.78rem;
          color: #8c8273;
        }

        .rev-actions {
          display: flex;
          gap: 6px;
        }

        /* ─── MODAL DIALOGS ─── */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 999;
        }

        .modal-window {
          background: #180e0c;
          border: 1px solid #d4a373;
          border-radius: 8px;
          padding: 28px;
          width: 100%;
          max-width: 550px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
        }

        .modal-window.wide {
          max-width: 760px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .modal-header h3 {
          margin: 0;
          color: #fff;
          font-size: 1.25rem;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: #8c8273;
          font-size: 1.2rem;
          cursor: pointer;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
        }

        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #efebe9;
          font-size: 0.9rem;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 12px;
        }

        .cancel-btn {
          background: transparent;
          border: 1px solid rgba(212, 163, 115, 0.3);
          color: #a89f91;
          padding: 10px 16px;
          border-radius: 6px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .grid-2,
          .grid-3 {
            grid-template-columns: 1fr;
          }
          .navbar {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }
          .nav-right {
            width: 100%;
            justify-content: space-between;
          }
          .search-input {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
