import { allProjects, getProjectCategory, fetchProjectsFromSupabase, fetchProjectById } from '../../../data/projectsData';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SiteFooter from '../../../components/SiteFooter';

const SITE_URL = 'https://adilrahman.cc';

// Required for next static export — queries Supabase for all active project routes
export async function generateStaticParams() {
  const live = await fetchProjectsFromSupabase();
  const paths = live.map((project) => ({ id: project.id }));
  paths.push({ id: 'issaa_event' });
  return paths;
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
  fileo: 'adil-rahman-3063/fileo',
};

// Deep engineering architecture profiles to provide comprehensive technical depth (eliminates thin content)
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
  fileo: {
    architecture: 'High-speed in-browser file utility and image manipulation platform built on Astro 5, Tailwind CSS v4, and WebAssembly codecs (libheif, mozjpeg). Renders zero client runtime JavaScript for static utility pages, mounting Astro Islands only when interactive processing pipelines are engaged.',
    challenges: 'Executing heavy multi-megabyte image transcoding, EXIF preservation, and color quantization directly in the browser without UI freezes or memory leaks. Leveraged Web Workers, OffscreenCanvas, and streaming chunk decoders to process files client-side with 0ms server roundtrips.',
    security: '100% client-side privacy architecture. No user files, images, or documents are ever uploaded to an external server. Engineered zero Cumulative Layout Shift (CLS = 0) with reserved-slot non-obstructive Google AdSense ad units and automated programmatic SEO landing pages.',
  },
};

export function getSaasSeoTitle(project) {
  const brand = ' | Adil Rahman';
  const maxLen = 60;

  if (project.id === 'edu-amicus-deployment') {
    return 'Edu Amicus — Cloud Architecture & Specs | Adil Rahman';
  }
  if (project.id === 'shopify') {
    return 'Shopify Theme Engineering & Specs | Adil Rahman';
  }
  if (project.id === 'membership-saas') {
    return 'AR Membership Manager — SaaS Architecture | Adil Rahman';
  }
  if (project.id === 'teledrive') {
    return 'TeleDrive — Cloud Architecture & Specs | Adil Rahman';
  }
  if (project.id === 'viewpick') {
    return 'ViewPick PWA — Architecture & Specs | Adil Rahman';
  }
  if (project.id === 'resume-editor') {
    return 'ATS Resume Engine — System Architecture | Adil Rahman';
  }
  if (project.id === 'zmr') {
    return 'ZMR Music — Audio Architecture & Specs | Adil Rahman';
  }
  if (project.id === 'redparrot-webhook') {
    return 'Red Parrot Webhook — Architecture & Specs | Adil Rahman';
  }
  if (project.id === 'redparrot') {
    return 'Red Parrot — Scheduler Architecture & Specs | Adil Rahman';
  }
  if (project.id === 'poshan') {
    return 'Poshan Abhiyaan — Architecture & Specs | Adil Rahman';
  }
  if (project.id === 'calert') {
    return 'C-Alert ML App — Architecture & Specs | Adil Rahman';
  }
  if (project.id === 'sirr') {
    return 'Sirr (سِرّ) — Architecture & System Specs | Adil Rahman';
  }
  if (project.id === 'cloudagent') {
    return 'Cloud Agent — Architecture & System Specs | Adil Rahman';
  }
  if (project.id === 'issaa') {
    return 'ISSAA Event Portal — Architecture & Specs | Adil Rahman';
  }
  if (project.id === 'fileo') {
    return 'Fileo — File Conversion Architecture & Specs | Adil Rahman';
  }

  const candidate = `${project.title} — Tech Specs${brand}`;
  if (candidate.length <= maxLen) return candidate;

  const shortCandidate = `${project.title}${brand}`;
  if (shortCandidate.length <= maxLen) return shortCandidate;

  const truncated = shortCandidate.slice(0, maxLen - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 25 ? truncated.slice(0, lastSpace) : truncated) + '...';
}

// Per-SaaS SEO metadata
export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = allProjects.find((p) => p.id === id || (id === 'issaa_event' && p.id === 'issaa')) || (await fetchProjectById(id));
  if (!project) return {};

  const cleanTitle = getSaasSeoTitle(project);
  const cleanDescription = (project.tagline || project.description || '').slice(0, 155);
  const primaryCat = getProjectCategory(project.id, project);

  return {
    title: {
      absolute: cleanTitle,
    },
    description: cleanDescription,
    keywords: [
      project.title,
      `${project.title} architecture`,
      'Adil Rahman portfolio',
      'full-stack engineering',
      ...(project.tech || []),
    ],
    openGraph: {
      title: cleanTitle,
      description: cleanDescription,
      url: `${SITE_URL}/saas/${id}`,
      type: 'website',
      siteName: 'Adil Rahman Portfolio',
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description: cleanDescription,
      creator: '@adilrahmanms',
    },
    alternates: {
      canonical: `/project/${primaryCat}/${project.id}`,
    },
  };
}

// ── JSON-LD SoftwareApplication Schema ───────────────────────────────────────
function SoftwareJsonLd({ project }) {
  const liveUrl = project.links?.find((l) => l.url?.startsWith('http') && !l.url?.includes('github.com'))?.url || `${SITE_URL}/saas/${project.id}`;
  
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    headline: project.subtitle,
    description: project.tagline || project.description,
    applicationCategory: 'BusinessApplication',
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
    keywords: (project.tech || []).join(', '),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Portfolio',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Projects',
        item: `${SITE_URL}/project`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.title,
        item: `${SITE_URL}/saas/${project.id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

export default async function SaasDetailPage({ params }) {
  const { id } = await params;
  const project = allProjects.find((p) => p.id === id);
  if (!project) notFound();

  const repoPath = githubRepoMap[project.id];
  const liveUrlLink = project.links?.find((l) => l.url?.startsWith('http') && !l.url?.includes('github.com'));
  const liveUrl = liveUrlLink ? liveUrlLink.url : null;
  const githubLink = project.links?.find((l) => l.url?.includes('github.com'))?.url || (repoPath ? `https://github.com/${repoPath}` : null);

  const deepDive = technicalDeepDives[project.id] || {
    architecture: project.description,
    challenges: 'Optimizing end-to-end responsiveness and establishing predictable data pipelines under peak concurrent loads.',
    security: 'Engineered with zero-trust principles, local persistence guards, and strictly validated input protocols.',
  };
  const relatedProjects = allProjects.filter((p) => p.id !== project.id).slice(0, 3);

  return (
    <>
      <SoftwareJsonLd project={project} />
      <div className="saas-page">
        {/* ── Navigation ── */}
        <nav className="saas-nav">
          <div className="saas-nav-left">
            <Link href="/" className="saas-nav-link">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="#8D6E63" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Portfolio
            </Link>
            <span className="saas-nav-sep">/</span>
            <Link href="/saas" className="saas-nav-link">
              All SaaS
            </Link>
          </div>
          <span className="saas-nav-brand">ADIL RAHMAN // SAAS</span>
        </nav>

        {/* ── Hero / Header ── */}
        <header className="saas-hero">
          <div className="saas-container">
            <div className="saas-meta-badge-row">
              <span className="saas-badge">// CLOUD APPLICATION</span>
              <span className="saas-status-pill">{project.status}</span>
            </div>

            <h1 className="saas-title">{project.title}</h1>
            <p className="saas-subtitle">{project.subtitle}</p>

            <p className="saas-tagline">{project.tagline || project.description}</p>

            {/* Action Buttons */}
            <div className="saas-cta-group">
              {liveUrl && (
                <a href={liveUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  Launch Live Application ↗
                </a>
              )}
              {githubLink && (
                <a href={githubLink} target="_blank" rel="noreferrer" className="btn-secondary">
                  View Source on GitHub ↗
                </a>
              )}
              <Link href="/#contact" className="btn-outline">
                Request Custom SaaS Build
              </Link>
            </div>
          </div>
        </header>

        {/* ── Main Content ── */}
        <main className="saas-main">
          <div className="saas-container">
            {/* Overview Card */}
            <section className="saas-card">
              <h2 className="section-heading">// ARCHITECTURAL OVERVIEW</h2>
              <p className="section-body">{project.description}</p>
            </section>

            {/* Deep-Dive Technical Architecture & Engineering Breakdown */}
            <section className="saas-card">
              <h2 className="section-heading">// ENGINEERING SPECIFICATIONS & SYSTEM DESIGN</h2>
              <div className="deepdive-grid">
                <div className="deepdive-item">
                  <h3 className="deepdive-title">01 / System Architecture & Data Topology</h3>
                  <p className="deepdive-text">{deepDive.architecture}</p>
                </div>
                <div className="deepdive-item">
                  <h3 className="deepdive-title">02 / Technical Challenges & Performance Solutions</h3>
                  <p className="deepdive-text">{deepDive.challenges}</p>
                </div>
                <div className="deepdive-item">
                  <h3 className="deepdive-title">03 / Security Model & Data Resilience</h3>
                  <p className="deepdive-text">{deepDive.security}</p>
                </div>
              </div>
            </section>

            {/* Key Features */}
            {project.features && project.features.length > 0 && (
              <section className="saas-card">
                <h2 className="section-heading">// CORE CAPABILITIES & SYSTEM FEATURES</h2>
                <div className="features-grid">
                  {project.features.map((feat, idx) => (
                    <div key={idx} className="feature-item">
                      <span className="feature-number">{String(idx + 1).padStart(2, '0')}.</span>
                      <p className="feature-text">{feat}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tech Stack */}
            {project.tech && project.tech.length > 0 && (
              <section className="saas-card">
                <h2 className="section-heading">// TECHNOLOGY COMPONENT STACK</h2>
                <div className="tech-chips-list">
                  {project.tech.map((techItem, idx) => (
                    <span key={idx} className="tech-chip">
                      {techItem}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Production Engineering Quality Standards Card */}
            <section className="saas-card quality-card">
              <h2 className="section-heading">// PRODUCTION STANDARDS & QUALITY ASSURANCE</h2>
              <p className="section-body">
                This project was engineered adhering to production-ready principles: modular component separation, comprehensive linting and typing guards, sub-100ms interaction latency, and rigorous offline fallback testing. Designed and deployed with clean documentation and reproducible environments.
              </p>
            </section>

            {/* Related Applications Internal Linking Grid (Resolves Orphan Pages) */}
            <section className="saas-card related-showcase-card">
              <h2 className="section-heading">// EXPLORE MORE SOFTWARE & SAAS BUILDS</h2>
              <div className="related-projects-grid">
                {relatedProjects.map((rel) => (
                  <article key={rel.id} className="related-project-card">
                    <span className="related-status">{rel.status}</span>
                    <h3 className="related-title">
                      <Link href={`/saas/${rel.id}`} className="related-link">
                        {rel.title}
                      </Link>
                    </h3>
                    <p className="related-desc">{rel.tagline || rel.description}</p>
                    <Link href={`/saas/${rel.id}`} className="related-btn">
                      System Architecture →
                    </Link>
                  </article>
                ))}
              </div>
            </section>

            {/* Launch Banner if live */}
            {liveUrl && (
              <section className="launch-banner">
                <div className="launch-banner-inner">
                  <h2 className="launch-heading">Try {project.title} Directly in Your Browser</h2>
                  <p className="launch-sub">
                    This software is live, tested, and actively deployed. Test out its features, response times, and interactive workflows directly.
                  </p>
                  <a href={liveUrl} target="_blank" rel="noreferrer" className="btn-primary large">
                    Open {project.title} Live App ↗
                  </a>
                </div>
              </section>
            )}
          </div>
        </main>

        {/* ── Blog-Style Footer CTA & Site Links ── */}
        <SiteFooter
          ctaLabel="// LOOKING TO BUILD A SAAS PRODUCT?"
          ctaTitle="Need a Custom MVP or Enterprise Platform?"
          ctaDesc="I build high-performance web applications, multi-tenant B2B architectures, Flutter cross-platform PWAs, and custom SaaS tools with rapid turnaround."
          primaryBtn={{ label: "Get a Development Quote →", href: "/#contact" }}
          secondaryBtn={{ label: "Explore Other SaaS Projects", href: "/project/saas" }}
          tertiaryBtn={{ label: "All Projects Hub", href: "/project" }}
        />
      </div>
    </>
  );
}
