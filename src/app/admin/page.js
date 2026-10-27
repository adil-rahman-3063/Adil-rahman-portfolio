'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import './admin.css';

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
    </div>
  );
}
