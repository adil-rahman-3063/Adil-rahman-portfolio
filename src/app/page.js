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
import ToolsSection from '../components/ToolsSection';
import LiveWorkspaceSection from '../components/LiveWorkspaceSection';
import BlogSection from '../components/BlogSection';
import ReviewsSection, { ReviewFormModal } from '../components/ReviewsSection';
import WorldMapSection from '../components/WorldMapSection';
import ContactSection, { RequirementFormModal } from '../components/ContactSection';
import { allProjects, fetchProjectsFromSupabase } from '../data/projectsData';
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
    useRef(null), // 0: Home / Hero
    useRef(null), // 1: About
    useRef(null), // 2: Experience
    useRef(null), // 3: Skills
    useRef(null), // 4: Work Archive
    useRef(null), // 5: Tools
    useRef(null), // 6: Live Workspace
    useRef(null), // 7: Blog
    useRef(null), // 8: Reviews
    useRef(null), // 9: Network / World Map
    useRef(null), // 10: Contact
  ];

  // Redirect admin subdomain to /admin
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hostname.toLowerCase().startsWith('admin.')) {
      window.location.replace('/admin');
    }
  }, []);

  // Fetch live projects directly from Supabase on mount
  useEffect(() => {
    // Instant cache paint
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('cached_projects');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProjects(parsed);
          }
        } catch (_) {}
      }
    }

    let isMounted = true;
    const loadLiveProjects = async () => {
      try {
        const live = await fetchProjectsFromSupabase();
        if (isMounted && Array.isArray(live) && live.length > 0) {
          setProjects(live);
          localStorage.setItem('cached_projects', JSON.stringify(live));
        }
      } catch (err) {
        console.warn('Failed to sync live projects from Supabase:', err);
      }
    };

    loadLiveProjects();
    return () => { isMounted = false; };
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
            onContactMe={() => scrollToSection(10)}
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
          <div ref={sectionRefs[4]} className="section-wrapper section-deferred">
            <ScrollReveal delay={80}>
              <WorkArchiveSection projects={projects} onProjectClick={handleOpenProject} />
            </ScrollReveal>
          </div>

          {/* Section 5: Tools */}
          <div ref={sectionRefs[5]} className="section-wrapper section-deferred">
            <ScrollReveal delay={80}>
              <ToolsSection />
            </ScrollReveal>
          </div>

          {/* Section 6: Live Workspace */}
          <div ref={sectionRefs[6]} className="section-wrapper section-deferred">
            <ScrollReveal delay={80}>
              <LiveWorkspaceSection projects={projects} />
            </ScrollReveal>
          </div>

          {/* Section 7: Blog */}
          <div ref={sectionRefs[7]} className="section-wrapper section-deferred">
            <ScrollReveal delay={80}>
              <BlogSection onBlogClick={handleOpenBlog} />
            </ScrollReveal>
          </div>

          {/* Section 8: Reviews */}
          <div ref={sectionRefs[8]} className="section-wrapper section-deferred">
            <ScrollReveal delay={80}>
              <ReviewsSection projects={projects} onProjectClick={handleOpenProject} />
            </ScrollReveal>
          </div>

          {/* Section 9: Global Network / World Map */}
          <div ref={sectionRefs[9]} className="section-wrapper section-deferred">
            <ScrollReveal delay={80}>
              <WorldMapSection />
            </ScrollReveal>
          </div>

          {/* Section 10: Contact */}
          <div ref={sectionRefs[10]} className="section-wrapper section-deferred">
            <ScrollReveal delay={80}>
              <ContactSection onGetQuote={handleGetQuote} />
            </ScrollReveal>
          </div>

          {/* Footer */}
          <footer className="footer-section">
            <nav className="footer-nav" aria-label="Footer quick navigation">
              <Link href="/project" className="footer-link">Projects Hub</Link>
              <span className="footer-sep">·</span>
              <Link href="/tools" className="footer-link">Tools</Link>
              <span className="footer-sep">·</span>
              <Link href="/tools/resume-builder" className="footer-link">Resume Builder</Link>
              <span className="footer-sep">·</span>
              <Link href="/project/saas" className="footer-link">SaaS</Link>
              <span className="footer-sep">·</span>
              <Link href="/project/freelance" className="footer-link">Freelance</Link>
              <span className="footer-sep">·</span>
              <Link href="/project/personal-project" className="footer-link">Personal</Link>
              <span className="footer-sep">·</span>
              <Link href="/services" className="footer-link">Services</Link>
              <span className="footer-sep">·</span>
              <Link href="/services/flutter-developer" className="footer-link">Flutter Developer</Link>
              <span className="footer-sep">·</span>
              <Link href="/services/nextjs-developer" className="footer-link">Next.js Developer</Link>
              <span className="footer-sep">·</span>
              <Link href="/services/shopify-developer" className="footer-link">Shopify Developer</Link>
              <span className="footer-sep">·</span>
              <Link href="/blog" className="footer-link">Blog</Link>
              <span className="footer-sep">·</span>
              <Link href="/reviews" className="footer-link">Reviews</Link>
              <span className="footer-sep">·</span>
              <Link href="/privacy" className="footer-link">Privacy</Link>
              <span className="footer-sep">·</span>
              <button type="button" onClick={() => scrollToSection(1)} className="footer-link-btn">About</button>
              <span className="footer-sep">·</span>
              <button type="button" onClick={() => scrollToSection(4)} className="footer-link-btn">Projects</button>
              <span className="footer-sep">·</span>
              <button type="button" onClick={() => scrollToSection(5)} className="footer-link-btn">Tools</button>
              <span className="footer-sep">·</span>
              <button type="button" onClick={() => scrollToSection(10)} className="footer-link-btn">Contact</button>
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

        /* Modern Web Guidance: Defer off-screen section layout/paint with intrinsic size placeholder */
        .section-wrapper.section-deferred {
          content-visibility: auto;
          contain-intrinsic-size: auto none auto 600px;
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
