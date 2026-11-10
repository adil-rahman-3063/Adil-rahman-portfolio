import { supabase } from '../lib/supabaseClient.js';

export const WORKER_GATEWAY_URL = 'https://adil-portfolio-worker.adilrahman3063.workers.dev';
export const reviewsApiUrl = `${WORKER_GATEWAY_URL}/api/reviews`;
export const projectsApiUrl = `${WORKER_GATEWAY_URL}/api/projects?action=getProjects`;
export const saasApiUrl = `${WORKER_GATEWAY_URL}/api/projects?action=getSaas`;

export const SUPABASE_REST_URL = 'https://vtkhqhaagczyzckpglhn.supabase.co/rest/v1/projects?select=*&order=order.asc.nullslast';
export const SUPABASE_ANON_KEY = 'sb_publishable__qZFf0Z2_zIxUZt4Yh01Kw_orF2mym7';

/**
 * Normalizes raw project record from Supabase table into unified structure.
 */
export function normalizeProject(p) {
  if (!p) return null;

  // Features
  let features = [];
  if (Array.isArray(p.features)) {
    features = p.features;
  } else if (typeof p.features === 'string') {
    features = p.features
      .split(';')
      .map((f) => f.trim())
      .filter(Boolean);
  }

  // Tech
  let tech = [];
  if (Array.isArray(p.tech)) {
    tech = p.tech;
  } else if (typeof p.tech === 'string') {
    const delim = p.tech.includes(';') ? ';' : ',';
    tech = p.tech
      .split(delim)
      .map((t) => t.trim().replace(/^\[|\]$/g, ''))
      .filter(Boolean);
  }

  // Links
  let links = [];
  if (Array.isArray(p.links)) {
    links = p.links;
  } else if (p.link_texts && p.link_urls && p.link_texts !== 'null' && p.link_urls !== 'null') {
    const delim = p.link_texts.includes('|') ? '|' : (p.link_texts.includes(',') ? ',' : null);
    if (delim) {
      const texts = p.link_texts.split(delim).map((t) => t.trim());
      const urls = p.link_urls.split(delim).map((u) => u.trim());
      texts.forEach((txt, i) => {
        if (txt && urls[i] && txt !== 'null' && urls[i] !== 'null') {
          links.push({ text: txt, url: urls[i] });
        }
      });
    } else {
      links.push({ text: p.link_texts.trim(), url: p.link_urls.trim() });
    }
  }

  // Categories
  let categories = [];
  if (Array.isArray(p.categories)) {
    categories = p.categories.map((c) => String(c).trim().toLowerCase());
  } else if (typeof p.categories === 'string') {
    categories = p.categories
      .split(',')
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean);
  }

  return {
    id: p.id,
    title: p.title || '',
    subtitle: p.subtitle || '',
    status: p.status || '',
    tagline: p.tagline || '',
    description: p.description || '',
    features,
    tech,
    links,
    categories,
    order: String(p.order ?? ''),
  };
}

/**
 * Pre-synced snapshot from Supabase projects table.
 * Used for zero-latency static generation, SEO pre-rendering, and offline builds.
 */
export const allProjects = [
  {
    "id": "fileo",
    "title": "Fileo",
    "subtitle": "In-Browser File Utilities & Ad Platform // Astro 5",
    "status": "Production // Monetized & Live",
    "tagline": "100% in-browser, privacy-first file conversion and utilities platform monetized with display advertising.",
    "description": "An ad-monetized, browser-based file conversion and utility platform engineered with Astro 5, Tailwind CSS v4, and client-side WebAssembly. Delivers zero-server image, subtitle, and vector processing directly inside user memory without uploads or server costs.",
    "features": [
      "100% In-Browser Processing: Decodes HEIC, WebP, AVIF, and subtitles locally via Canvas, libheif Wasm, and Web Streams with zero server file transfers.",
      "Universal Auto-Detect Converter: Drag-and-drop input zone that automatically detects file types and generates optimized target formats.",
      "Client-Side Batch Compression & ZIP: In-browser image compression with real-time size breakdown and multi-file client-zip bundling.",
      "SVG Vectorizer Engine: Integrated imagetracerjs engine converting bitmap logos, icons, and illustrations into clean SVG paths.",
      "Optimized AdSense Architecture: High-viewability non-obstructive IAB ad placements (leaderboard, sticky sidebar 300x250) with zero Cumulative Layout Shift (CLS).",
      "Comprehensive Programmatic SEO: 29 statically compiled routes with JSON-LD structured data (SoftwareApplication, HowTo, FAQPage) and AI agent discovery manifests (llms.txt, pricing.md)."
    ],
    "tech": [
      "Astro 5",
      "Tailwind CSS v4",
      "WebAssembly (Wasm)",
      "Canvas API",
      "Google AdSense",
      "Cloudflare Pages",
      "client-zip",
      "jspdf"
    ],
    "links": [
      {
        "text": "Live Site",
        "url": "https://fileo.cc"
      },
      {
        "text": "GitHub Repository",
        "url": "https://github.com/adil-rahman-3063/fileo"
      }
    ],
    "categories": [
      "featured",
      "niche-sites",
      "niche",
      "web-full-stack"
    ],
    "order": "1"
  },
  {
    "id": "zmr",
    "title": "ZMR Music",
    "subtitle": "Premium YouTube Music Client // Flutter",
    "status": "Featured // Complete",
    "tagline": "Premium, high-performance YouTube Music client focused on sleek background audio and gesture navigation.",
    "description": "A gorgeous, high-fidelity YouTube Music client designed to provide a premium gesture-based mobile audio experience.",
    "features": [
      "Dynamic discovery home feed with category filtering chips and Quick Picks.",
      "Advanced playback with integrated crossfade, gapless playback, and volume normalization.",
      "Full background playback with system lock screen media controls.",
      "Fully local secure session handling (YouTube cookies saved locally, never sent to external servers)."
    ],
    "tech": [
      "Flutter",
      "Riverpod",
      "just_audio",
      "Supabase",
      "Cloudflare Workers"
    ],
    "links": [
      {
        "text": "GitHub Repository",
        "url": "https://github.com/adil-rahman-3063/zmr"
      }
    ],
    "categories": [
      "featured",
      "mobile",
      "personal"
    ],
    "order": "1"
  },
  {
    "id": "membership-saas",
    "title": "AR Membership Manager",
    "subtitle": "Universal B2B Subscription & Member Operations SaaS // Next.js",
    "status": "Featured // Live SaaS",
    "tagline": "Universal B2B subscription & member management platform with Google Sheets two-way sync, mobile QR check-ins, and automated WhatsApp billing.",
    "description": "A multi-tenant B2B membership management platform built for gyms, clubs, studios, co-working spaces, and any subscription-based business. Features complete tenant isolation with Supabase super admin governance, real-time Google Sheets member database syncing, mobile QR check-in engine, Meta WhatsApp Cloud API reminder campaigns, and direct UPI payment links.",
    "features": [
      "Multi-Tenant Platform Governance: Super admin account management, subscription tracking, and tenant controls powered by Supabase.",
      "Google Sheets Two-Way Member Sync: Zero-lockin member operations synchronizing directly with each business's Google Sheet.",
      "Instant Mobile Turnstile & QR Check-in: Real-time QR and phone check-in engine with live occupancy counting.",
      "Automated WhatsApp Campaign Engine: Meta WhatsApp Cloud API integration dispatching payment reminders and renewal alerts.",
      "Direct UPI & Gateway Billing: Dynamic UPI deep links (GPay, PhonePe, Paytm) and automated billing funnels embedded in reminders.",
      "Universal Business Adaptation: Configurable tier structures and billing cycles tailored for any membership or subscription model."
    ],
    "tech": [
      "Next.js",
      "React",
      "Supabase",
      "Google Sheets API",
      "Meta WhatsApp API",
      "Cloudflare Workers",
      "Tailwind CSS"
    ],
    "links": [
      {
        "text": "Live Application",
        "url": "https://ar-membership-manager.pages.dev"
      }
    ],
    "categories": [
      "saas",
      "featured",
      "web-full-stack"
    ],
    "order": "1"
  },
  {
    "id": "edu-amicus-deployment",
    "title": "Edu Amicus – Cloud Migration & Production Deployment",
    "subtitle": "Full-Stack Cloud Architecture & Database Migration (Freelance)",
    "status": "Featured // Live",
    "tagline": "Production cloud architecture, SQLite-to-Supabase migration, and edge-proxied deployment for an EdTech platform.",
    "description": "Freelance DevOps and cloud engineering engagement for Edu Amicus Academia. Successfully transitioned the client's platform from a local development environment into a production-ready, decoupled cloud architecture. Migrated legacy SQLite storage into a managed Supabase PostgreSQL cluster with 24+ relational tables and automated connection pooling. Containerized the FastAPI backend with Docker for deployment on Render, integrated Cloudflare R2 object storage for persistent PDF courseware, and deployed the React frontend on Cloudflare Pages. Built a custom Cloudflare Pages Functions edge proxy to seamlessly preserve first-party HttpOnly session cookies across decoupled origins, while adding sliding-window edge rate limiting and Cloudflare Edge Caching to cap quota usage and slash backend traffic.",
    "features": [
      "Migrated legacy SQLite to managed Supabase PostgreSQL with 24 relational tables and connection pooling",
      "Dockerized FastAPI backend with dynamic port management and deployed to Render",
      "Architected Cloudflare Pages edge proxy function preserving first-party HttpOnly session cookies across decoupled domains",
      "Integrated Cloudflare R2 object storage with S3-compatible API for PDF courseware and student document persistence",
      "Implemented edge-level sliding window rate limiting and Cloudflare Edge Cache (caches.default) to cap request quotas and prevent DDoS",
      "Designed Vite build rules with immutable asset headers to eliminate redundant static asset fetching",
      "Scripted production database migration pipelines and admin onboarding with 2FA security hardening",
      "Configured reverse-proxy forwarding with resilient timeout handling and CORS mitigation"
    ],
    "tech": [
      "Docker",
      "Supabase PostgreSQL",
      "Cloudflare Pages",
      "Cloudflare R2",
      "Render",
      "FastAPI",
      "Python",
      "React",
      "Vite"
    ],
    "links": [
      {
        "text": "Live Application",
        "url": "https://amicus-ui.pages.dev"
      }
    ],
    "categories": [
      "featured",
      "freelance",
      "web-full-stack"
    ],
    "order": "1"
  },
  {
    "id": "teledrive",
    "title": "TeleDrive",
    "subtitle": "Telegram-Backed Cloud Storage // Next.js",
    "status": "Featured // Active Development",
    "tagline": "Self-hosted app that turns Telegram into effectively unlimited, private cloud storage for your photos and videos.",
    "description": "A self-hosted, open-source web app that runs on localhost and uses your own Telegram account as a free, unlimited storage backend — giving it a polished modern interface for uploading, organizing, and streaming media as if it were on a local drive.",
    "features": [
      "Drag-and-drop upload straight into your own Telegram channels.",
      "Full-screen media viewer with native video streaming via instant-scrubbing HTTP Range requests.",
      "Real-time upload progress over WebSockets.",
      "Intelligent local caching for instant reloads of previously viewed files.",
      "Collections with sub-collections for organizing large libraries.",
      "Fully self-hosted — data never leaves your own Telegram account."
    ],
    "tech": [
      "Next.js",
      "Node.js",
      "Telegram Client API (MTProto)",
      "WebSockets",
      "Tailwind CSS"
    ],
    "links": [
      {
        "text": "Live site",
        "url": "https://teledrive-web.pages.dev"
      }
    ],
    "categories": [
      "featured",
      "web-full-stack",
      "personal"
    ],
    "order": "2"
  },
  {
    "id": "viewpick",
    "title": "ViewPick",
    "subtitle": "Tinder-Style Movie Discovery PWA // Flutter Web",
    "status": "Featured // Live",
    "tagline": "Interactive movie discovery PWA leveraging a Tinder-style swipe interface with smart recommendations.",
    "description": "A creative web app and PWA designed to overhaul standard movie searching with responsive swipe discovery card stacks.",
    "features": [
      "Swipe Right to watchlist, Swipe Left to skip, with a dynamic TMDB recommendation engine.",
      "Granular preference filters (avoid specific years, genres, or languages).",
      "Comprehensive details: trailers, cast details, plots, and streaming providers.",
      "Optimistic UI state syncing and local database caching for near-instant offline load times."
    ],
    "tech": [
      "Flutter Web",
      "Supabase",
      "TMDB API",
      "Firebase Analytics",
      "PWA Manifest"
    ],
    "links": [
      {
        "text": "Live Application",
        "url": "https://viewpick.vercel.app"
      }
    ],
    "categories": [
      "featured",
      "web-backend",
      "personal"
    ],
    "order": "3"
  },
  {
    "id": "sirr",
    "title": "Sirr (سِرّ)",
    "subtitle": "Islamic Prayer Times & Qibla Companion // Flutter",
    "status": "Featured // Complete",
    "tagline": "Modern, cross-platform Islamic prayer companion with dynamic daylight-responsive theming and precision Qibla compass.",
    "description": "A beautifully designed, cross-platform Islamic prayer companion built with Flutter. Features real-time GPS prayer calculations, dynamic daylight-responsive theming that adapts ambient colors throughout the day, hardware-calibrated Qibla navigation, and cross-platform notification scheduling across mobile and web.",
    "features": [
      "Dynamic Prayer-Period Theming: Automatically transitions color schemes across Fajr, Dhuhr, Asr, Maghrib, and Isha paired with Amiri Arabic typography.",
      "Precision Qibla Compass: Real-time Great Circle bearing calculations to the Holy Kaaba with hardware magnetometer and Web DeviceOrientation calibration.",
      "Cross-Platform Notification Engine: Native Android exact alarms with boot persistence, iOS Darwin time-sensitive notifications, and ServiceWorker-backed PWA web push.",
      "Infinite Day Browser: Seamless swipe navigation across past/future dates with Aladhan API caching and live flip-clock countdown timers.",
      "Responsive Layout: Adaptive multi-column dashboard for desktop/tablets and smooth single-column flow for mobile."
    ],
    "tech": [
      "Flutter",
      "Dart",
      "Provider",
      "REST APIs",
      "Geolocator",
      "Flutter Local Notifications",
      "ServiceWorker API",
      "Google Fonts"
    ],
    "links": [
      {
        "text": "GitHub Repository",
        "url": "https://github.com/adil-rahman-3063/Sirr"
      },
      {
        "text": "Live Site",
        "url": "https://sirr-5hr.pages.dev"
      }
    ],
    "categories": [
      "featured",
      "mobile",
      "personal"
    ],
    "order": "4"
  },
  {
    "id": "calert",
    "title": "C-Alert",
    "subtitle": "B.Tech Main Project // Flutter App",
    "status": "B.Tech Main Project // Finished",
    "tagline": "High-performance incident reporting mobile app leveraging TFLite deepfake detection and GPS verification.",
    "description": "A community-driven incident reporting mobile application that empowers citizens to report incidents with AI forensics and cryptographic integrity.",
    "features": [
      "AI Forensic Analysis: Dual-model TensorFlow Lite (Base + Hyperreal) to identify deepfakes and manipulated evidence.",
      "Secure Camera Engine: Custom capturing with orientation normalization.",
      "Location Verification Protocol: Parallel GPS and EXIF metadata verification to catch spoofed locations.",
      "Authorities Command Center: Intelligent incident case management portal with performance optimizations.",
      "Crime Mapping: Real-time dynamic heatmaps of community incident reports."
    ],
    "tech": [
      "Flutter",
      "TensorFlow Lite",
      "Supabase",
      "OpenStreetMap",
      "Provider"
    ],
    "links": [
      {
        "text": "GitHub Repository",
        "url": "https://github.com/Dayal-Joy/C-Alert"
      }
    ],
    "categories": [
      "featured",
      "mobile",
      "personal"
    ],
    "order": "5"
  },
  {
    "id": "poshan",
    "title": "Poshan Abhiyaan",
    "subtitle": "B.Tech Mini Project // Flutter App",
    "status": "B.Tech Mini Project // Stable",
    "tagline": "Nutrition Tracker built for health workers to track child nutrition metrics via Google Sheets/Drive.",
    "description": "An app for health administrators and parents to track children's nutritional and developmental growth metrics.",
    "features": [
      "Track nutrition milestones, vaccination histories, and medical checklists.",
      "Google API integrations syncing data directly to Google Sheets, Drive, and Calendars."
    ],
    "tech": [
      "Flutter",
      "Google Sheets API",
      "Google Drive API",
      "Calendar API"
    ],
    "links": [
      {
        "text": "GitHub Source",
        "url": "https://github.com/adil-rahman-3063/poshan_abhiyaan"
      }
    ],
    "categories": [
      "mobile",
      "personal"
    ],
    "order": "6"
  },
  {
    "id": "redparrot",
    "title": "Red Parrot Scheduler",
    "subtitle": "Demo Session Scheduler // Institutional Use",
    "status": "Stable // Active Use",
    "tagline": "Institution Demo Scheduler simplifying class tracking and slot booking for administrators and students.",
    "description": "A production demo scheduling software used by the Red Parrot educational institution to register and coordinate student tutoring slots.",
    "features": [
      "Allows seamless scheduling and real-time slot checking.",
      "Reduces administrative friction and calendar overlap automatically.",
      "Secure coordinator dash panel to handle institutional registrations."
    ],
    "tech": [
      "Flutter",
      "Supabase DB",
      "UI/UX Figma Architecture"
    ],
    "links": [
      {
        "text": "Code Status Details",
        "url": "https://github.com/adil-rahman-3063"
      }
    ],
    "categories": [
      "mobile",
      "freelance"
    ],
    "order": "7"
  },
  {
    "id": "shopify",
    "title": "Custom Shopify Theme Development",
    "subtitle": "Shopify storefront for automotive brand",
    "status": "Complete // Live Production",
    "tagline": "Built and customized a modern Shopify storefront for an automotive accessories brand, delivering a responsive and high-performance e-commerce experience.",
    "description": "Built and customized a modern Shopify storefront for an automotive accessories brand. Involved extensive theme customization, creating reusable sections, redesigning key pages, and optimizing the shopping experience across devices.",
    "features": [
      "Extensive Liquid theme customization and custom section building.",
      "Device responsiveness optimization and layout refinements.",
      "Shopping checkout funnel customization and conversion optimization.",
      "Collaborated closely on feedback cycles to deliver bespoke e-commerce workflows."
    ],
    "tech": [
      "Shopify",
      "Liquid",
      "HTML5",
      "CSS3",
      "JavaScript",
      "Git",
      "Shopify CLI"
    ],
    "links": [
      {
        "text": "Live Storefront",
        "url": "https://t2autohaus.myshopify.com/"
      }
    ],
    "categories": [
      "freelance"
    ],
    "order": "8"
  },
  {
    "id": "issaa",
    "title": "ISSAA മഹാ സംഗമം",
    "subtitle": "Event Registration System // HTML/CSS/JS",
    "status": "Complete // Private Event",
    "tagline": "Responsive, lightweight event registration portal integrated directly with Google Sheets for zero-backend data storage.",
    "description": "A custom-built event registration system with QR-based check-in, an admin dashboard, and a Malayalam-first registration form, using Google Sheets as a serverless database.",
    "features": [
      "Cross-origin database integration writing directly to Google Sheets via a secure JSONP (GET-based) script architecture that bypasses CORS limitations.",
      "Fully responsive dark glassmorphic UI, with tables collapsing into responsive cards on mobile.",
      "Secure admin dashboard with Google Sheets-backed credential verification and persistent localStorage login state.",
      "Dynamic QR code generator encoding each participant's unique Registration ID for offline, on-site verification.",
      "Clamped Malayalam numeric selectors with dynamic range limits and auto-updating total fields."
    ],
    "tech": [
      "HTML5",
      "CSS3",
      "Vanilla JavaScript",
      "Google Apps Script",
      "Google Sheets API",
      "qrcode.min.js"
    ],
    "links": [
      {
        "text": "Live site",
        "url": "https://issaa.onrender.com/"
      }
    ],
    "categories": [
      "web-full-stack",
      "freelance"
    ],
    "order": "9"
  },
  {
    "id": "cloudagent",
    "title": "Cloud Agent",
    "subtitle": "Local-First Workspace AI Assistant // Node.js",
    "status": "Production // Active Development",
    "tagline": "A privacy-focused, local-first AI assistant for Google Workspace (Gmail, Drive, Calendar) and local dev environments, built entirely in Node.js.",
    "description": "CloudAgent translates natural language into secure, local tool executions via a structured JSON command system. Integrates with Gmail, Drive, Calendar, and Tasks via the Google Workspace CLI (gws), with multi-model LLM fallback and a Flutter desktop dashboard.",
    "features": [
      "Local-First & Secure: prompts translated to local API commands via secure JSON structure.",
      "Google Workspace Integration via gws CLI (Gmail, Drive, Tasks, Calendar).",
      "Session Resumption & Multi-Model Fallbacks: resumes chat on startup and falls back through OpenAI, Gemini, Anthropic if rate-limited.",
      "15-Second Request Timeouts with auto-abort and fallback switching.",
      "Offline Diagnostics & Health Check: doctor commands verify Node, Git, and GWS credentials.",
      "System & Git Orchestration: handles filesystem navigation and git staging/committing/pushing.",
      "Flutter Desktop Dashboard with responsive widgets and smooth slide-and-fade transitions.",
      "Local SQLite DB (WAL Mode) stored at ~/.cloudagent/history.db."
    ],
    "tech": [
      "Node.js",
      "SQLite3",
      "Google Workspace CLI (gws)",
      "OpenRouter API",
      "Gemini API",
      "Git",
      "Flutter"
    ],
    "links": [
      {
        "text": "GitHub Source",
        "url": "https://github.com/adil-rahman-3063/cloudagent"
      }
    ],
    "categories": [
      "personal"
    ],
    "order": "10"
  },
  {
    "id": "redparrot-webhook",
    "title": "Red Parrot WhatsApp & Sheets Sync",
    "subtitle": "WhatsApp Webhook & Google Sheets Automation // Apps Script",
    "status": "Production // Active Use",
    "tagline": "Serverless WhatsApp webhook parser & multi-spreadsheet synchronization engine.",
    "description": "A serverless Google Apps Script backend that intercepts incoming Botbiz WhatsApp webhook payloads, parses session counts and batch completion statuses, and synchronizes student data across administrative spreadsheets.",
    "features": [
      "Webhook payload parser handling URL-encoded text, emojis, and multi-line session reports from WhatsApp.",
      "Multi-sheet automated data pipeline exporting student records into 8-class, 12-class, 28-class, and closed batch certificate tabs.",
      "Installable event-driven onEdit trigger syncing employee updates back to main administrative sheets with automated date-stamping.",
      "Smart deduplication logic distinguishing between parent-level feedback tracking and individual student certificate workflows.",
      "Automated logging system for execution auditing, error catching, and concurrency locking via ScriptLock"
    ],
    "tech": [
      "Google Apps Script",
      "JavaScript",
      "Google Sheets API",
      "Webhooks",
      "Botbiz API"
    ],
    "links": [],
    "categories": [
      "backend",
      "freelance"
    ],
    "order": "11"
  },
  {
    "id": "resume-editor",
    "title": "Resume Editor",
    "subtitle": "Interactive Resume & ATS PDF Engine // Vanilla JS",
    "status": "Featured // Complete",
    "tagline": "Modern browser-based resume editor with live WYSIWYG editing, dynamic color theming, and dual PDF export engines.",
    "description": "A client-side, zero-dependency resume builder featuring high-aesthetic designed PDF generation, parser-safe ATS-friendly PDF export with custom sequence ordering, 6 curated theme palettes, and instant localStorage persistence.",
    "features": [
      "Dual PDF Export Modes: High-aesthetic two-column Design PDF with custom palette gradients and parser-safe single-column ATS PDF.",
      "Custom ATS Section Ordering: Interactive sequence badges allowing users to customize section hierarchy for ATS parsing.",
      "Dynamic Theme & Palette Customizer: Real-time sidebar and main document color customization with 6 curated presets and live CSS variable syncing.",
      "In-Place WYSIWYG Editing: Direct inline editing, section and bullet point reordering (▲/▼), dynamic spacers, and floating selection formatting toolbar (Bold, Italic, Grey highlight, Links).",
      "Privacy-First & Offline Storage: 100% client-side architecture with automatic localStorage persistence and reset capabilities."
    ],
    "tech": [
      "HTML5",
      "CSS3",
      "Vanilla JavaScript",
      "Google Fonts",
      "LocalStorage API",
      "Print CSS"
    ],
    "links": [
      {
        "text": "GitHub Repository",
        "url": "https://github.com/adil-rahman-3063/Resume-Editor"
      }
    ],
    "categories": [
      "featured",
      "web-full-stack",
      "personal"
    ],
    "order": "12"
  }
];

/**
 * Fetches all active projects live from Supabase.
 * Allows adding new projects to Supabase without touching codebase.
 */
export async function fetchProjectsFromSupabase() {
  let remoteList = null;

  // 1. Try Supabase JS client
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order', { ascending: true, nullsFirst: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        remoteList = data.map(normalizeProject);
      }
    }
  } catch (err) {
    console.warn('Supabase JS client query warning:', err);
  }

  // 2. Direct REST API fallback
  if (!remoteList) {
    try {
      const res = await fetch(SUPABASE_REST_URL, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          remoteList = data.map(normalizeProject);
        }
      }
    } catch (err) {
      console.warn('Supabase REST fallback query warning:', err);
    }
  }

  if (remoteList && remoteList.length > 0) {
    const remoteIds = new Set(remoteList.map((p) => p.id));
    const missingLocal = allProjects.filter((p) => !remoteIds.has(p.id));
    return [...remoteList, ...missingLocal];
  }

  // 3. Static snapshot fallback
  return allProjects;
}

/**
 * Fetch a single project by ID from Supabase (with fallback to local snapshot).
 */
export async function fetchProjectById(id) {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) {
        return normalizeProject(data);
      }
    }
  } catch (err) {
    console.warn(`fetchProjectById(${id}) Supabase warning:`, err);
  }

  return allProjects.find((p) => p.id === id || (id === 'issaa_event' && p.id === 'issaa')) || null;
}

/**
 * Dynamically tests whether a project belongs to a category slug based on its categories in Supabase.
 */
export function projectBelongsToCategory(project, categorySlug) {
  if (!project) return false;
  const cats = Array.isArray(project.categories)
    ? project.categories.map((c) => c.toLowerCase().trim())
    : String(project.categories || '').toLowerCase().split(',').map((c) => c.trim());

  const slug = categorySlug === 'personal' ? 'personal-project' : (categorySlug === 'niche-site' ? 'niche-sites' : categorySlug);

  if (slug === 'saas') {
    return cats.includes('saas');
  }
  if (slug === 'niche-sites') {
    return cats.includes('niche-sites') || cats.includes('niche-site') || cats.includes('niche');
  }
  if (slug === 'freelance') {
    return cats.includes('freelance');
  }
  if (slug === 'personal-project' || slug === 'personal') {
    return cats.includes('personal');
  }
  return cats.includes(slug);
}

export const PROJECT_CATEGORIES = {
  saas: {
    slug: 'saas',
    name: 'SaaS & Cloud Apps',
    navLabel: 'SaaS',
    badge: 'SAAS // CLOUD PLATFORMS',
    tagline: 'Multi-tenant subscription platforms and full-stack cloud products built by Adil Rahman.',
    description: 'Explore live, multi-tenant B2B platforms and automated billing software engineered for scale, responsiveness, and zero data lock-in.',
    metaTitle: 'SaaS Products & Cloud Applications | Adil Rahman',
    metaDesc: 'Explore production-ready SaaS platforms and B2B membership management engines engineered by Adil Rahman.',
    get projectIds() {
      return allProjects.filter((p) => projectBelongsToCategory(p, 'saas')).map((p) => p.id);
    },
  },
  'niche-sites': {
    slug: 'niche-sites',
    name: 'Niche Sites & Digital Utilities',
    navLabel: 'Niche Sites',
    badge: 'NICHE SITES // AD-MONETIZED',
    tagline: 'High-utility programmatic web tools, privacy-first conversion engines, and ad-monetized niche platforms.',
    description: 'Explore high-volume digital utility platforms, client-side conversion tools, and ad-monetized niche sites engineered with Astro, WebAssembly, and programmatic SEO.',
    metaTitle: 'Niche Sites & Digital Utilities | Projects by Adil Rahman',
    metaDesc: 'Explore high-utility web tools, in-browser conversion engines, and programmatic ad-monetized niche platforms built by Adil Rahman.',
    get projectIds() {
      return allProjects.filter((p) => projectBelongsToCategory(p, 'niche-sites')).map((p) => p.id);
    },
  },
  freelance: {
    slug: 'freelance',
    name: 'Freelance & Client Systems',
    navLabel: 'Freelance',
    badge: 'CLIENT // FREELANCE BUILDS',
    tagline: 'Bespoke client solutions, custom e-commerce storefronts, and institutional scheduling portals.',
    description: 'Production client builds, custom Shopify Liquid storefronts, dynamic QR ticket verification portals, and institutional scheduling software deployed for real businesses.',
    metaTitle: 'Freelance Projects & Client Solutions | Adil Rahman',
    metaDesc: 'Production client builds, custom Shopify storefronts, dynamic QR event engines, and institutional portals built by Adil Rahman.',
    get projectIds() {
      return allProjects.filter((p) => projectBelongsToCategory(p, 'freelance')).map((p) => p.id);
    },
  },
  'personal-project': {
    slug: 'personal-project',
    name: 'Personal & Open-Source Projects',
    navLabel: 'Personal',
    badge: 'PERSONAL // OPEN-SOURCE',
    tagline: 'Independent software tools, background audio clients, AI forensic apps, and developer utilities.',
    description: 'Curated personal projects, open-source software, high-performance Flutter mobile apps, on-device machine learning experiments, and browser tools built for creative utility.',
    metaTitle: 'Personal Projects & Open-Source Apps | Adil Rahman',
    metaDesc: 'Independent mobile apps, YouTube Music streaming clients, TFLite deepfake forensics, and open-source tools by Adil Rahman.',
    get projectIds() {
      return allProjects.filter((p) => projectBelongsToCategory(p, 'personal-project')).map((p) => p.id);
    },
  },
};

/**
 * Filter projects for a given category slug.
 * Supports passing custom dynamic project list or defaults to allProjects.
 */
export function getCategoryProjects(categorySlug, list = allProjects) {
  const normSlug = categorySlug === 'personal' ? 'personal-project' : categorySlug;
  return list.filter((p) => projectBelongsToCategory(p, normSlug));
}

/**
 * Resolves primary category slug for project ID based purely on its Supabase categories.
 */
export function getProjectCategory(projectId, project = null) {
  const target = project || allProjects.find((p) => p.id === projectId || (projectId === 'issaa_event' && p.id === 'issaa'));
  if (target) {
    if (projectBelongsToCategory(target, 'saas')) return 'saas';
    if (projectBelongsToCategory(target, 'niche-sites')) return 'niche-sites';
    if (projectBelongsToCategory(target, 'freelance')) return 'freelance';
    if (projectBelongsToCategory(target, 'personal-project')) return 'personal-project';
  }
  return 'personal-project';
}

/**
 * Returns all (category, id) pairs for static parameter generation.
 */
export function getAllProjectCategoryPaths(list = allProjects) {
  const paths = [];
  for (const catSlug of ['saas', 'niche-sites', 'freelance', 'personal-project']) {
    const catList = getCategoryProjects(catSlug, list);
    for (const proj of catList) {
      paths.push({ category: catSlug, id: proj.id });
    }
  }
  return paths;
}
