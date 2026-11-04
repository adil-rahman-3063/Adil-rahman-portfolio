import { allProjects, PROJECT_CATEGORIES, getCategoryProjects, getAllProjectCategoryPaths, fetchProjectsFromSupabase, fetchProjectById } from '../../../../data/projectsData';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SiteFooter from '../../../../components/SiteFooter';

const SITE_URL = 'https://adilrahman.cc';

// Required for next static export — queries Supabase at build time for complete static generation
export async function generateStaticParams() {
  const live = await fetchProjectsFromSupabase();
  return getAllProjectCategoryPaths(live);
}

// GitHub repository mapping for deep repo inspection
const githubRepoMap = {
  zmr: 'adil-rahman-3063/zmr',
  leadflow: 'adil-rahman-3063/LeadFlow_AI',
  viewpick: 'adil-rahman-3063/viewpick',
  telestore: 'adil-rahman-3063/telestore',
  teledrive: 'adil-rahman-3063/teledrive',
  'resume-editor': 'adil-rahman-3063/Resume-Editor',
  'membership-saas': 'adil-rahman-3063/Membership-app',
  calert: 'Dayal-Joy/C-Alert',
  poshan: 'adil-rahman-3063/poshan_abhiyaan',
  sirr: 'adil-rahman-3063/Sirr',
  cloudagent: 'adil-rahman-3063/cloudagent',
};

// Deep engineering architecture profiles to provide comprehensive technical depth
const technicalDeepDives = {
  zmr: {
    architecture: 'Engineered in Flutter utilizing Riverpod for immutable state management and strict unidirectional data flows. Audio processing relies on just_audio with background isolates and system-level media notification bindings for uninterrupted audio delivery on Android and iOS.',
    challenges: 'Solving streaming latency and dynamic crossfading without gap artifacts. Designed an in-memory queue manager that prefetches upcoming chunks and computes sinusoidal volume ramps across track transitions.',
    security: 'Zero external telemetry or user credential harvesting. All YouTube session cookies and streaming cache manifests are stored strictly in AES-256 encrypted device secure storage.',
  },
  poshan: {
    architecture: 'Built as an offline-first mobile healthcare tracker using Flutter and SQLite. Designed for frontline health workers in rural environments with intermittent or zero cellular connectivity.',
    challenges: 'Ensuring absolute zero data loss during synchronization handshakes. Built an automated background queuing pipeline that detects internet recovery and writes structured milestones directly into Google Sheets and Google Drive APIs.',
    security: 'Conforms to World Health Organization (WHO) child growth reference standards. Includes input validation to prevent anomalous entries and exports digitally timestamped records for administrative compliance.',
  },
  redparrot: {
    architecture: 'An institutional demo scheduling platform designed in Flutter with Supabase PostgreSQL backend integration. Orchestrates student registration, tutor availability matrices, and administrative calendars.',
    challenges: 'Eliminating concurrency collisions and duplicate booking of tutoring slots. Implemented row-level security (RLS) policies and transactional database locks to verify availability in real-time before checkout.',
    security: 'Role-based access control (RBAC) segregating student profiles, tutor schedules, and administrative operations. Reduced institutional scheduling coordination time by over 70%.',
  },
  calert: {
    architecture: 'Civic safety and incident reporting mobile system built with Flutter and on-device machine learning. Leverages dual TensorFlow Lite models running locally to detect digital image manipulation and verify report authenticity.',
    challenges: 'Preventing spoofed GPS locations and doctored media evidence. Built an integrity engine that compares hardware GPS telemetry against EXIF metadata and analyzes image noise distributions.',
    security: 'Cryptographic hashing of submitted incident evidence, immutable timestamping, and an interactive Leaflet/OpenStreetMap administrative dashboard featuring dynamic incident heatmaps.',
  },
  viewpick: {
    architecture: 'Progressive Web App (PWA) built with Flutter Web and Supabase. Combines a Tinder-style swipe interface with real-time TMDB API recommendation endpoints for fluid content curation.',
    challenges: 'Maintaining 60 FPS gesture responsiveness on mobile web viewports. Implemented virtualized card stacks, pre-cached image buffers, and optimistic UI updates for instant interactions.',
    security: 'Offline-ready PWA service worker caching previously queried movie sets. Granular filtering prevents unwanted genres or release windows from cluttering user recommendations.',
  },
  'resume-editor': {
    architecture: 'High-performance client-side resume builder built with Vanilla JavaScript, HTML5 semantic markup, and custom CSS Print stylesheets. Provides zero-dependency WYSIWYG editing with dual export engines.',
    challenges: 'Bridging the gap between high-aesthetic typography and parser-safe single-column ATS layouts. Built a sequence badge reordering engine allowing users to customize ATS parse order dynamically.',
    security: '100% privacy-preserving architecture. No user resume data is ever transmitted to a server; all documents, color themes, and spacing preferences persist strictly in localStorage.',
  },
  teledrive: {
    architecture: 'Decoupled cloud storage solution built with Next.js, Node.js, and the Telegram MTProto Client API. Converts Telegram channels into encrypted, virtually unlimited personal media drives.',
    challenges: 'Native media streaming and high-bandwidth uploads. Engineered HTTP Range request streaming for instant scrubbing of multi-gigabyte video files alongside real-time WebSocket progress tracking.',
    security: 'Self-hosted and private by design. Files live entirely within the user\'s private Telegram ecosystem without third-party cloud hosting fees or vendor lock-in.',
  },
  'membership-saas': {
    architecture: 'Full-stack multi-tenant B2B subscription and member operations SaaS built with Next.js, Supabase, and Tailwind CSS. Features isolated tenant schemas and super-admin platform governance.',
    challenges: 'Real-time two-way synchronization between web interfaces and Google Sheets. Designed automated webhooks with Cloudflare Workers to sync member status and trigger Meta WhatsApp Cloud API renewal alerts.',
    security: 'End-to-end tenant data isolation, dynamic UPI payment link generation (GPay, PhonePe, Paytm), and an on-site QR check-in scanner for real-time facility occupancy tracking.',
  },
  shopify: {
    architecture: 'Custom-engineered Shopify Liquid theme built from the ground up for a high-volume automotive brand. Modular architecture with custom Liquid sections, schema settings, and responsive styling.',
    challenges: 'Maximizing mobile conversion rates and lowering Core Web Vitals to under 1.2s LCP. Engineered lazy-loaded asset pipelines, streamlined checkout funnels, and optimized product detail pages.',
    security: 'Fully compliant with Shopify 2.0 standards, secure PCI-DSS checkout compliance, and seamless multi-device responsiveness across desktops, tablets, and smartphones.',
  },
  'edu-amicus-deployment': {
    architecture: 'Production cloud architecture, SQLite-to-Supabase migration, and edge-proxied deployment for an EdTech platform. Managed Supabase PostgreSQL with 24 relational tables, Render-hosted Dockerized FastAPI backend, Cloudflare Pages frontend, and Cloudflare R2 object storage for PDF courseware.',
    challenges: 'Preserving first-party HttpOnly session cookies across decoupled domains. Engineered a custom Cloudflare Pages Functions edge proxy with sliding-window edge rate limiting and Cloudflare Edge Cache (caches.default) to cap request quotas and prevent DDoS.',
    security: 'S3-compatible R2 document persistence, Vite build optimization with immutable asset headers, scripted production database migration pipelines, and admin onboarding with 2FA security hardening.',
  },
  sirr: {
    architecture: 'Cross-platform Islamic prayer companion built with Flutter, Provider, and Geolocator. Features real-time GPS prayer calculation, dynamic daylight-responsive period theming, precision Great Circle Kaaba navigation, and cross-platform notification scheduling across Android, iOS, and PWA.',
    challenges: 'Guaranteeing timely prayer notifications across diverse OS battery-saver restrictions. Built a resilient scheduler binding Android exact alarms with boot persistence, iOS Darwin time-sensitive notifications, and ServiceWorker web push.',
    security: 'Zero external telemetry or user data storage. All astronomical prayer coordinates and Qibla bearings compute entirely on-device with offline Aladhan API response caching.',
  },
  cloudagent: {
    architecture: 'Local-first, privacy-focused AI assistant for Google Workspace and local dev environments, built entirely in Node.js. Translates natural language into local CLI tool executions via a structured JSON command protocol with SQLite WAL database.',
    challenges: 'Integrating with Gmail, Drive, Tasks, and Calendar via the Google Workspace CLI (gws) while managing multi-model LLM fallbacks across OpenAI, Gemini, and Anthropic with automatic session recovery.',
    security: '100% local data persistence in ~/.cloudagent/history.db with WAL mode. Strict 15-second request timeouts, auto-abort error traps, and automated doctor diagnostics to verify Node, Git, and GWS credentials.',
  },
  'redparrot-webhook': {
    architecture: 'Serverless Google Apps Script backend that intercepts incoming Botbiz WhatsApp webhook payloads, parses session counts and batch completion statuses, and synchronizes student data across administrative spreadsheets.',
    challenges: 'Handling high-concurrency webhook bursts and URL-encoded WhatsApp text without duplicate updates. Implemented ScriptLock concurrency locks and smart deduplication algorithms.',
    security: 'Multi-sheet automated data pipeline exporting student records into 8-class, 12-class, 28-class, and closed batch tabs with installable event-driven onEdit trigger syncing employee updates.',
  },
  issaa: {
    architecture: 'Responsive, lightweight event registration portal integrated directly with Google Sheets for zero-backend data storage. Built with HTML5, CSS3, vanilla JavaScript, and Google Apps Script JSONP cross-origin endpoints.',
    challenges: 'Zero-latency on-site check-in verification without costly database infrastructure. Built a dynamic QR code generator that encodes registration IDs for instant scanner validation.',
    security: 'Admin gate with credential verification, offline check-in capability, and clamped Malayalam numeric selectors to prevent registration tampering.',
  },
  issaa_event: {
    architecture: 'Responsive, lightweight event registration portal integrated directly with Google Sheets for zero-backend data storage. Built with HTML5, CSS3, vanilla JavaScript, and Google Apps Script JSONP cross-origin endpoints.',
    challenges: 'Zero-latency on-site check-in verification without costly database infrastructure. Built a dynamic QR code generator that encodes registration IDs for instant scanner validation.',
    security: 'Admin gate with credential verification, offline check-in capability, and clamped Malayalam numeric selectors to prevent registration tampering.',
  },
};

// Per-project SEO metadata
export async function generateMetadata({ params }) {
  const { category, id } = await params;
  const project = allProjects.find((p) => p.id === id || (id === 'issaa_event' && p.id === 'issaa')) || (await fetchProjectById(id));
  if (!project) return {};

  const normCategory = category === 'personal' ? 'personal-project' : category;
  const cat = PROJECT_CATEGORIES[normCategory];
  const catName = cat ? cat.name : 'Projects';

  const cleanTitle = `${project.title} — ${catName} | Adil Rahman`.slice(0, 60);
  const cleanDescription = (project.tagline || project.description || '').slice(0, 155);

  return {
    title: {
      absolute: cleanTitle,
    },
    description: cleanDescription,
    keywords: [
      project.title,
      `${project.title} ${catName}`,
      'Adil Rahman portfolio',
      'full-stack engineering',
      ...(project.tech || []),
    ],
    openGraph: {
      title: cleanTitle,
      description: cleanDescription,
      url: `${SITE_URL}/project/${category}/${id}`,
      type: 'website',
      siteName: 'Adil Rahman // Projects',
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description: cleanDescription,
      creator: '@adilrahmanms',
    },
    alternates: {
      canonical: `/project/${normCategory}/${id}`,
    },
  };
}

// JSON-LD SoftwareApplication Schema
function ProjectJsonLd({ project, categorySlug }) {
  const liveUrl = project.links?.find((l) => l.url?.startsWith('http') && !l.url?.includes('github.com'))?.url || `${SITE_URL}/project/${categorySlug}/${project.id}`;
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    headline: project.subtitle,
    description: project.description || project.tagline,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: 'Adil Rahman',
      url: SITE_URL,
    },
    url: liveUrl,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function ProjectDetailPage({ params }) {
  const { category, id } = await params;
  const project = allProjects.find((p) => p.id === id || (id === 'issaa_event' && p.id === 'issaa')) || (await fetchProjectById(id));

  if (!project) notFound();

  const normCategory = category === 'personal' ? 'personal-project' : category;
  const cat = PROJECT_CATEGORIES[normCategory];

  const deepDive = technicalDeepDives[project.id] || {
    architecture: project.description || `Built with modern full-stack architecture using ${project.tech?.join(', ') || 'modern frameworks'}. Designed for high availability, sub-second latency, and scalable clean code maintainability.`,
    challenges: (project.features && project.features.length > 0)
      ? project.features.slice(0, 2).join('; ')
      : (project.tagline || 'Balancing client requirements, rapid development turnaround, and strict performance metrics.'),
    security: (project.features && project.features.length > 2)
      ? project.features.slice(2).join('; ')
      : 'Conforms to production security standards, input sanitization, and secure state handling.',
  };

  const githubRepo = githubRepoMap[id];
  const liveUrlLink = project.links?.find((l) => l.url?.startsWith('http') && !l.url?.includes('github.com'));
  const liveUrl = liveUrlLink ? liveUrlLink.url : null;

  // Related projects in the same category
  const relatedProjects = getCategoryProjects(normCategory)
    .filter((p) => p.id !== id)
    .slice(0, 3);

  return (
    <div className="project-detail-page">
      <ProjectJsonLd project={project} categorySlug={normCategory} />

      {/* ── Navigation ── */}
      <nav className="project-nav">
        <div className="nav-breadcrumbs">
          <Link href="/project" className="nav-crumb">
            Projects
          </Link>
          <span className="crumb-sep">/</span>
          {cat ? (
            <Link href={`/project/${normCategory}`} className="nav-crumb">
              {cat.navLabel || cat.name}
            </Link>
          ) : (
            <span className="nav-crumb">All</span>
          )}
          <span className="crumb-sep">/</span>
          <span className="crumb-active">{project.title}</span>
        </div>

        <Link href="/" className="nav-home-btn">
          Portfolio
        </Link>
      </nav>

      {/* ── Main Container ── */}
      <main className="project-content">
        <div className="project-inner">

          {/* Header Banner */}
          <header className="project-header">
            <div className="header-badges">
              <span className="badge-status">{project.status}</span>
              {cat && (
                <Link href={`/project/${normCategory}`} className="badge-category-link">
                  {cat.badge}
                </Link>
              )}
            </div>

            <h1 className="project-title">{project.title}</h1>
            <p className="project-subtitle">{project.subtitle}</p>

            <p className="project-tagline">{project.tagline}</p>

            {/* Quick Action Links */}
            <div className="action-links-row">
              {liveUrl && (
                <a href={liveUrl} target="_blank" rel="noreferrer" className="btn-launch">
                  Launch Live App ↗
                </a>
              )}
              {githubRepo && (
                <a href={`https://github.com/${githubRepo}`} target="_blank" rel="noreferrer" className="btn-github">
                  Inspect Source on GitHub ↗
                </a>
              )}
              <Link href="/?hire=true" className="btn-discuss">
                Hire for Similar Project
              </Link>
            </div>
          </header>

          <hr className="section-divider" />

          {/* Deep Architectural Breakdown */}
          <section className="architecture-section">
            <h2 className="section-title">// SYSTEM ARCHITECTURE & ENGINEERING SPECS</h2>
            
            <div className="architecture-grid">
              <div className="arch-card">
                <div className="card-num">01</div>
                <h3>Technical Architecture</h3>
                <p>{deepDive.architecture}</p>
              </div>

              <div className="arch-card">
                <div className="card-num">02</div>
                <h3>Engineering Challenges</h3>
                <p>{deepDive.challenges}</p>
              </div>

              <div className="arch-card">
                <div className="card-num">03</div>
                <h3>Security & Data Integrity</h3>
                <p>{deepDive.security}</p>
              </div>
            </div>
          </section>

          {/* Full Description & Features */}
          <section className="features-section">
            <h2 className="section-title">// KEY SYSTEM CAPABILITIES & FEATURES</h2>
            <p className="description-text">{project.description}</p>

            {project.features && project.features.length > 0 && (
              <ul className="features-list">
                {project.features.map((feature, idx) => (
                  <li key={idx} className="feature-item">
                    <span className="feature-bullet">▸</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Tech Stack Chips */}
          {project.tech && project.tech.length > 0 && (
            <section className="tech-section">
              <h2 className="section-title">// TECHNOLOGIES & LIBRARIES DEPLOYED</h2>
              <div className="tech-pills-row">
                {project.tech.map((tech, idx) => (
                  <span key={idx} className="tech-chip">{tech}</span>
                ))}
              </div>
            </section>
          )}

          {/* Related Projects in Category */}
          {relatedProjects.length > 0 && (
            <section className="related-section">
              <div className="related-header">
                <h2 className="section-title">// MORE {cat?.name?.toUpperCase() || 'PROJECTS'}</h2>
                {cat && (
                  <Link href={`/project/${normCategory}`} className="related-view-all">
                    View All {cat.name} →
                  </Link>
                )}
              </div>
              <div className="related-grid">
                {relatedProjects.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/project/${normCategory}/${rel.id}`}
                    className="related-card"
                  >
                    <span className="related-status">{rel.status}</span>
                    <h3 className="related-title">{rel.title}</h3>
                    <p className="related-desc">{rel.tagline || rel.description}</p>
                    <span className="related-link-text">View Architecture →</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      {/* ── Blog-Style Footer CTA & Site Links ── */}
      <SiteFooter
        ctaLabel="// LOOKING TO BUILD SOMETHING SIMILAR?"
        ctaTitle="Let's Discuss Your Project Scope"
        ctaDesc="Available for freelance full-stack software development, MVPs, cross-platform apps, and automated workflows."
        primaryBtn={{ label: "Get in Touch with Adil", href: "/?hire=true" }}
        secondaryBtn={cat ? { label: `Back to ${cat.name}`, href: `/project/${normCategory}` } : { label: "All Projects Hub", href: "/project" }}
        tertiaryBtn={cat ? { label: "All Projects Hub", href: "/project" } : null}
      />
    </div>
  );
}
