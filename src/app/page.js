'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ParallaxBackground from '../components/ParallaxBackground';
import CozyNav from '../components/CozyNav';
import ScrollReveal from '../components/ScrollReveal';

// Section components
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ExperienceSection from '../components/ExperienceSection';
import SkillsSection from '../components/SkillsSection';
import WorkArchiveSection from '../components/WorkArchiveSection';
import LiveWorkspaceSection from '../components/LiveWorkspaceSection';
import BlogSection from '../components/BlogSection';
import ReviewsSection, { ReviewFormModal } from '../components/ReviewsSection';
import ContactSection, { RequirementFormModal } from '../components/ContactSection';
import { allProjects, projectsApiUrl, saasApiUrl } from '../data/projectsData';
import { allBlogs } from '../data/blogData';
import ProjectModal from '../components/ProjectModal';
import BlogModal from '../components/BlogModal';
import LoadingScreen from '../components/LoadingScreen';

export default function Home() {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showRequirementModal, setShowRequirementModal] = useState(false);
  const [initialQuoteText, setInitialQuoteText] = useState('');
  const [projects, setProjects] = useState(allProjects);
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [activeModalBlog, setActiveModalBlog] = useState(null);

  // Refs for each section to measure viewport positions
  const sectionRefs = [
    useRef(null), // Home / Hero
    useRef(null), // About
    useRef(null), // Experience
    useRef(null), // Skills
    useRef(null), // Work Archive
    useRef(null), // Live Workspace
    useRef(null), // Blog
    useRef(null), // Reviews
    useRef(null), // Contact
  ];

  // Fetch projects from Google Sheets Apps Script on mount
  useEffect(() => {
    const fetchProjects = async (retries = 3, delay = 500) => {
      try {
        const res = await fetch(projectsApiUrl);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const decoded = await res.json();
        const rawList = Array.isArray(decoded) ? decoded : (decoded.data || []);
        const fetched = rawList
          .map(p => ({
            id: p.id || '',
            title: p.title || '',
            subtitle: p.subtitle || '',
            status: p.status || '',
            tagline: p.tagline || '',
            description: p.description || '',
            features: typeof p.features === 'string' ? p.features.split(';').map(s => s.trim()) : (p.features || []),
            tech: typeof p.tech === 'string' ? p.tech.split(',').map(s => s.trim()) : (p.tech || []),
            links: typeof p.link_texts === 'string' && typeof p.link_urls === 'string'
              ? p.link_texts.split('|').map((t, idx) => ({ text: t.trim(), url: p.link_urls.split('|')[idx]?.trim() || '' }))
              : (p.links || []),
            categories: typeof p.categories === 'string' ? p.categories.split(',').map(s => s.trim()) : (p.categories || []),
            order: p.order !== undefined ? String(p.order) : '',
          }))
          .filter(p => p.id && p.title);
        
        // Also check if a dedicated SaaS endpoint or tab returns projects
        let saasFetched = [];
        try {
          const saasRes = await fetch(saasApiUrl);
          if (saasRes.ok) {
            const saasDecoded = await saasRes.json();
            const saasList = Array.isArray(saasDecoded) ? saasDecoded : (saasDecoded.data || []);
            // Validate: only accept if it actually returned project items (not the reviews fallback)
            if (saasList.length > 0 && saasList[0].title && !saasList[0].rating) {
              saasFetched = saasList.map(p => ({
                id: p.id || '',
                title: p.title || '',
                subtitle: p.subtitle || '',
                status: p.status || '',
                tagline: p.tagline || '',
                description: p.description || '',
                features: typeof p.features === 'string' ? p.features.split(';').map(s => s.trim()) : (p.features || []),
                tech: typeof p.tech === 'string' ? p.tech.split(',').map(s => s.trim()) : (p.tech || []),
                links: typeof p.link_texts === 'string' && typeof p.link_urls === 'string'
                  ? p.link_texts.split('|').map((t, idx) => ({ text: t.trim(), url: p.link_urls.split('|')[idx]?.trim() || '' }))
                  : (p.links || []),
                categories: typeof p.categories === 'string'
                  ? Array.from(new Set([...p.categories.split(',').map(s => s.trim()), 'saas']))
                  : Array.from(new Set([...(p.categories || []), 'saas'])),
                order: p.order !== undefined ? String(p.order) : '',
              })).filter(p => p.id && p.title);
            }
          }
        } catch (e) {
          // Dedicated SaaS endpoint not configured yet; standard projects endpoint provides SaaS projects
        }

        const projectMap = new Map();
        [...fetched, ...saasFetched].forEach(p => projectMap.set(p.id, p));
        const combined = Array.from(projectMap.values());
        
        if (combined.length > 0) {
          setProjects(combined);
          localStorage.setItem('cached_projects', JSON.stringify(combined));
        }
      } catch (e) {
        console.error('Failed to load dynamic projects:', e);
        if (retries > 0) {
          setTimeout(() => fetchProjects(retries - 1, delay * 2), delay);
        } else {
          // Fallback to localStorage cache if network fails completely
          const cached = localStorage.getItem('cached_projects');
          if (cached) {
            try {
              setProjects(JSON.parse(cached));
            } catch (err) {
              // fallback remains allProjects
            }
          }
        }
      }
    };

    // Load from cache first for instant load
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('cached_projects');
      if (cached) {
        try {
          setProjects(JSON.parse(cached));
        } catch (err) {}
      }
    }
    
    fetchProjects();
  }, []);

  // Scroll listener to update scrollOffset and active index
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrollOffset(offset);

      // Determine closest section
      let closestIndex = 0;

      let minDistance = Infinity;

      sectionRefs.forEach((ref, idx) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          // Distance from the top of the viewport
          const distance = Math.abs(rect.top - 120);
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = idx;
          }
        }
      });

      setCurrentIndex(closestIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call to set active tab
    handleScroll();

    // Check query params on startup to trigger modals
    const params = new URLSearchParams(window.location.search);
    if (params.get('review') === 'true') {
      setShowReviewModal(true);
    } else if (params.get('hire') === 'true') {
      setShowRequirementModal(true);
    }

    const blogId = params.get('blog');
    if (blogId) {
      const blog = allBlogs.find(b => b.id === blogId);
      if (blog) setActiveModalBlog(blog);
    }

    const projectId = params.get('project');
    if (projectId) {
      const project = allProjects.find(p => p.id === projectId);
      if (project) setActiveModalProject(project);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle smooth navigation when landing directly on a hash (e.g. #contact) or on layout shifts
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const targetId = hash.replace('#', '');
      const target = document.getElementById(targetId);
      if (target) {
        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - 100; // Account for cozy navbar
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth',
        });
      }
    };

    const t0 = setTimeout(handleHashNavigation, 100);
    const t1 = setTimeout(handleHashNavigation, 400);
    const t2 = setTimeout(handleHashNavigation, 900);
    const t3 = setTimeout(handleHashNavigation, 1500);

    window.addEventListener('hashchange', handleHashNavigation);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('hashchange', handleHashNavigation);
    };
  }, [projects]);

  const handleOpenProject = (project) => {
    window.history.pushState(null, '', `?project=${project.id}`);
    setActiveModalProject(project);
  };

  const handleCloseProject = () => {
    window.history.pushState(null, '', window.location.pathname);
    setActiveModalProject(null);
  };

  const handleOpenBlog = (blog) => {
    window.history.pushState(null, '', `?blog=${blog.id}`);
    setActiveModalBlog(blog);
  };

  const handleCloseBlog = () => {
    window.history.pushState(null, '', window.location.pathname);
    setActiveModalBlog(null);
  };

  const handleCloseReviewModal = () => {
    window.history.pushState(null, '', window.location.pathname);
    setShowReviewModal(false);
  };

  const handleCloseRequirementModal = () => {
    window.history.pushState(null, '', window.location.pathname);
    setShowRequirementModal(false);
  };

  // Smooth scroll helper matching Flutter ensuring visibility curves
  const scrollToSection = (index) => {
    const targetRef = sectionRefs[index];
    if (targetRef && targetRef.current) {
      const elementPosition = targetRef.current.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - 100; // Leave space for navbar

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setCurrentIndex(index);
    }
  };

  const handleGetQuote = (serviceName) => {
    window.history.pushState(null, '', '?hire=true');
    setInitialQuoteText(`I would like to get a quote for ${serviceName}.`);
    setShowRequirementModal(true);
  };

  return (
    <main className="main-viewport">
      {/* Loading splash — covers FOUC on first paint */}
      <LoadingScreen />

      {/* 1. Parallax background canvas */}
      <ParallaxBackground scrollOffset={scrollOffset} />

      {/* 2. Floating Navbar */}
      <CozyNav currentIndex={currentIndex} onTap={scrollToSection} />

      {/* 3. Main content */}
      <div className="content-container">
        {/* Section 0: Home/Hero */}
         <div ref={sectionRefs[0]} className="section-wrapper hero-wrapper">
          <HeroSection
            scrollOffset={scrollOffset}
            onNavigateSection={(idx) => scrollToSection(idx)}
            onAccessProjects={() => scrollToSection(4)}
            onContactMe={() => scrollToSection(8)}
            onGetQuote={handleGetQuote}
          />
        </div>

        <div className="max-width-limiter">
          {/* Section 1: About */}
          <div ref={sectionRefs[1]} className="section-wrapper">
            <ScrollReveal delay={80}>
              <AboutSection />
            </ScrollReveal>
          </div>

          {/* Section 2: Experience */}
          <div ref={sectionRefs[2]} className="section-wrapper">
            <ScrollReveal delay={80}>
              <ExperienceSection />
            </ScrollReveal>
          </div>

          {/* Section 3: Skills */}
          <div ref={sectionRefs[3]} className="section-wrapper">
            <ScrollReveal delay={80}>
              <SkillsSection />
            </ScrollReveal>
          </div>

          {/* Section 4: Work Archive */}
          <div ref={sectionRefs[4]} className="section-wrapper">
            <ScrollReveal delay={80}>
              <WorkArchiveSection projects={projects} onProjectClick={handleOpenProject} />
            </ScrollReveal>
          </div>

          {/* Section 5: Live Workspace */}
          <div ref={sectionRefs[5]} className="section-wrapper">
            <ScrollReveal delay={80}>
              <LiveWorkspaceSection projects={projects} />
            </ScrollReveal>
          </div>

          {/* Section 6: Blog */}
          <div ref={sectionRefs[6]} className="section-wrapper">
            <ScrollReveal delay={80}>
              <BlogSection onBlogClick={handleOpenBlog} />
            </ScrollReveal>
          </div>

          {/* Section 7: Reviews */}
          <div ref={sectionRefs[7]} className="section-wrapper">
            <ScrollReveal delay={80}>
              <ReviewsSection projects={projects} onProjectClick={handleOpenProject} />
            </ScrollReveal>
          </div>

          {/* Section 8: Contact */}
          <div ref={sectionRefs[8]} className="section-wrapper">
            <ScrollReveal delay={80}>
              <ContactSection onGetQuote={handleGetQuote} />
            </ScrollReveal>
          </div>

          {/* Footer */}
          <footer className="footer-section">
            <nav className="footer-nav" aria-label="Footer quick navigation">
              <Link href="/resume-builder" className="footer-link">Free Resume Builder</Link>
              <span className="footer-sep">·</span>
              <Link href="/services" className="footer-link">Services</Link>
              <span className="footer-sep">·</span>
              <Link href="/saas" className="footer-link">SaaS Products</Link>
              <span className="footer-sep">·</span>
              <Link href="/blog" className="footer-link">Engineering Blog</Link>
              <span className="footer-sep">·</span>
              <button type="button" onClick={() => scrollToSection(1)} className="footer-link-btn">About</button>
              <span className="footer-sep">·</span>
              <button type="button" onClick={() => scrollToSection(4)} className="footer-link-btn">Projects</button>
              <span className="footer-sep">·</span>
              <button type="button" onClick={() => scrollToSection(8)} className="footer-link-btn">Contact</button>
            </nav>
            <p className="footer-copyright">© 2026 Adil Rahman | All Rights Reserved</p>
            <p className="footer-version">MADE AND DEPLOYED BY ME // PORTFOLIO v3.0.0</p>
          </footer>
        </div>
      </div>

      {/* Query parameters triggered modal overlays */}
      {showReviewModal && (
        <ReviewFormModal
          projects={projects}
          onClose={handleCloseReviewModal}
        />
      )}

      {showRequirementModal && (
        <RequirementFormModal
          onClose={handleCloseRequirementModal}
          initialRequirement={initialQuoteText}
        />
      )}

      {activeModalProject && (
        <ProjectModal
          project={activeModalProject}
          onClose={handleCloseProject}
        />
      )}

      {activeModalBlog && (
        <BlogModal
          blog={activeModalBlog}
          onClose={handleCloseBlog}
        />
      )}

      <style jsx global>{`
        .main-viewport {
          position: relative;
          min-height: 100vh;
          width: 100%;
        }

        .content-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          padding-top: 0;
          padding-bottom: 110px;
        }

        @media (min-width: 1100px) {
          .content-container {
            padding-top: 0;
            padding-bottom: 80px;
          }
        }

        .max-width-limiter {
          width: 100%;
          max-width: 1400px;
          padding: 0 16px;
        }

        @media (min-width: 1100px) {
          .max-width-limiter {
            padding: 0 60px;
          }
        }

        .section-wrapper {
          padding: 50px 0;
          width: 100%;
        }

        .hero-wrapper {
          padding: 0;
          width: 100%;
          max-width: 100%;
        }

        .footer-section {
          padding: 40px 0;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .footer-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 6px;
        }

        .footer-link,
        .footer-link-btn {
          font-family: var(--font-mono);
          font-size: 12px;
          color: #8D6E63;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          letter-spacing: 0.5px;
          transition: color 0.2s;
        }

        .footer-link:hover,
        .footer-link-btn:hover {
          color: #FAF6EE;
        }

        .footer-sep {
          color: rgba(141, 110, 99, 0.4);
          font-size: 11px;
        }

        .footer-copyright {
          font-family: var(--font-mono);
          font-size: 13px;
          color: #BCAAA4;
        }

        .footer-version {
          font-family: var(--font-mono);
          font-size: 11px;
          color: rgba(188, 170, 164, 0.7);
        }
      `}</style>
    </main>
  );
}
