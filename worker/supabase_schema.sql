-- ==============================================================================
-- SUPABASE POSTGRESQL SCHEMA & DATA FOR ADIL RAHMAN PORTFOLIO
-- (Row Level Security Disabled for Full Open Public Read/Write Access)
-- ==============================================================================
-- Paste this script into Supabase SQL Editor:
-- https://supabase.com/dashboard/project/vtkhqhaagczyzckpglhn/sql
-- ==============================================================================

-- 1. DROP EXISTING CONSTRAINTS / POLICIES IF ANY AND PREPARE TABLES
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  status TEXT,
  tagline TEXT,
  description TEXT,
  features TEXT,
  tech TEXT,
  link_texts TEXT,
  link_urls TEXT,
  categories TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.saas (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  status TEXT,
  tagline TEXT,
  description TEXT,
  features TEXT,
  tech TEXT,
  link_texts TEXT,
  link_urls TEXT,
  categories TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  rating NUMERIC DEFAULT 5,
  review TEXT NOT NULL,
  project TEXT,
  approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS public.requirements (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  instagram TEXT,
  requirement TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ==============================================================================
-- 2. DISABLE ROW LEVEL SECURITY (RLS) FOR FULL PUBLIC ACCESS
-- ==============================================================================
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.saas DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.requirements DISABLE ROW LEVEL SECURITY;

-- Grants full permissions to anon and authenticated roles
GRANT ALL ON TABLE public.projects TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.saas TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.reviews TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.requirements TO anon, authenticated, service_role;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Helpful indexes for query performance
CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects ("order");
CREATE INDEX IF NOT EXISTS idx_reviews_project ON public.reviews (project);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requirements_created_at ON public.requirements (created_at DESC);

-- ==============================================================================
-- 3. INSERT / SEED PORTFOLIO PROJECTS (Portfolio Reviews - Projects.csv)
-- ==============================================================================

INSERT INTO public.projects (id, title, subtitle, status, tagline, description, features, tech, link_texts, link_urls, categories, "order")
VALUES ('zmr', 'ZMR Music', 'Premium YouTube Music Client // Flutter', 'Featured // Complete', 'Premium, high-performance YouTube Music client focused on sleek background audio and gesture navigation.', 'A gorgeous, high-fidelity YouTube Music client designed to provide a premium gesture-based mobile audio experience.', 'Dynamic discovery home feed with category filtering chips and Quick Picks.; Advanced playback with integrated crossfade, gapless playback, and volume normalization.; Full background playback with system lock screen media controls.; Fully local secure session handling (YouTube cookies saved locally, never sent to external servers).', 'Flutter; Riverpod; just_audio; Supabase; Cloudflare Workers', 'GitHub Repository', 'https://github.com/adil-rahman-3063/zmr', 'featured, mobile, personal', 1)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  status = EXCLUDED.status,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  tech = EXCLUDED.tech,
  link_texts = EXCLUDED.link_texts,
  link_urls = EXCLUDED.link_urls,
  categories = EXCLUDED.categories,
  "order" = EXCLUDED."order";

INSERT INTO public.projects (id, title, subtitle, status, tagline, description, features, tech, link_texts, link_urls, categories, "order")
VALUES ('viewpick', 'ViewPick', 'Tinder-Style Movie Discovery PWA // Flutter Web', 'Featured // Live', 'Interactive movie discovery PWA leveraging a Tinder-style swipe interface with smart recommendations.', 'A creative web app and PWA designed to overhaul standard movie searching with responsive swipe discovery card stacks.', 'Swipe Right to watchlist, Swipe Left to skip, with a dynamic TMDB recommendation engine.; Granular preference filters (avoid specific years, genres, or languages).; Comprehensive details: trailers, cast details, plots, and streaming providers.; Optimistic UI state syncing and local database caching for near-instant offline load times.', 'Flutter Web; Supabase; TMDB API; Firebase Analytics; PWA Manifest', 'Live Application', 'https://viewpick.vercel.app', 'featured, web-backend, personal', 3)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  status = EXCLUDED.status,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  tech = EXCLUDED.tech,
  link_texts = EXCLUDED.link_texts,
  link_urls = EXCLUDED.link_urls,
  categories = EXCLUDED.categories,
  "order" = EXCLUDED."order";

INSERT INTO public.projects (id, title, subtitle, status, tagline, description, features, tech, link_texts, link_urls, categories, "order")
VALUES ('calert', 'C-Alert', 'B.Tech Main Project // Flutter App', 'B.Tech Main Project // Finished', 'High-performance incident reporting mobile app leveraging TFLite deepfake detection and GPS verification.', 'A community-driven incident reporting mobile application that empowers citizens to report incidents with AI forensics and cryptographic integrity.', 'AI Forensic Analysis: Dual-model TensorFlow Lite (Base + Hyperreal) to identify deepfakes and manipulated evidence.; Secure Camera Engine: Custom capturing with orientation normalization.; Location Verification Protocol: Parallel GPS and EXIF metadata verification to catch spoofed locations.; Authorities Command Center: Intelligent incident case management portal with performance optimizations.; Crime Mapping: Real-time dynamic heatmaps of community incident reports.', 'Flutter; TensorFlow Lite; Supabase; OpenStreetMap; Provider', 'GitHub Repository', 'https://github.com/Dayal-Joy/C-Alert', 'featured, mobile, personal', 5)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  status = EXCLUDED.status,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  tech = EXCLUDED.tech,
  link_texts = EXCLUDED.link_texts,
  link_urls = EXCLUDED.link_urls,
  categories = EXCLUDED.categories,
  "order" = EXCLUDED."order";

INSERT INTO public.projects (id, title, subtitle, status, tagline, description, features, tech, link_texts, link_urls, categories, "order")
VALUES ('poshan', 'Poshan Abhiyaan', 'B.Tech Mini Project // Flutter App', 'B.Tech Mini Project // Stable', 'Nutrition Tracker built for health workers to track child nutrition metrics via Google Sheets/Drive.', 'An app for health administrators and parents to track children''s nutritional and developmental growth metrics.', 'Track nutrition milestones, vaccination histories, and medical checklists.; Google API integrations syncing data directly to Google Sheets, Drive, and Calendars.', 'Flutter; Google Sheets API; Google Drive API; Calendar API', 'GitHub Source', 'https://github.com/adil-rahman-3063/poshan_abhiyaan', 'mobile, personal', 6)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  status = EXCLUDED.status,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  tech = EXCLUDED.tech,
  link_texts = EXCLUDED.link_texts,
  link_urls = EXCLUDED.link_urls,
  categories = EXCLUDED.categories,
  "order" = EXCLUDED."order";

INSERT INTO public.projects (id, title, subtitle, status, tagline, description, features, tech, link_texts, link_urls, categories, "order")
VALUES ('redparrot', 'Red Parrot Scheduler', 'Demo Session Scheduler // Institutional Use', 'Stable // Active Use', 'Institution Demo Scheduler simplifying class tracking and slot booking for administrators and students.', 'A production demo scheduling software used by the Red Parrot educational institution to register and coordinate student tutoring slots.', 'Allows seamless scheduling and real-time slot checking.; Reduces administrative friction and calendar overlap automatically.; Secure coordinator dash panel to handle institutional registrations.', 'Flutter; Supabase DB; UI/UX Figma Architecture', 'Code Status Details', 'https://github.com/adil-rahman-3063', 'mobile, freelance', 7)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  status = EXCLUDED.status,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  tech = EXCLUDED.tech,
  link_texts = EXCLUDED.link_texts,
  link_urls = EXCLUDED.link_urls,
  categories = EXCLUDED.categories,
  "order" = EXCLUDED."order";

INSERT INTO public.projects (id, title, subtitle, status, tagline, description, features, tech, link_texts, link_urls, categories, "order")
VALUES ('shopify', 'Custom Shopify Theme Development', 'Shopify storefront for automotive brand', 'Complete // Live Production', 'Built and customized a modern Shopify storefront for an automotive accessories brand, delivering a responsive and high-performance e-commerce experience.', 'Built and customized a modern Shopify storefront for an automotive accessories brand. Involved extensive theme customization, creating reusable sections, redesigning key pages, and optimizing the shopping experience across devices.', 'Extensive Liquid theme customization and custom section building.; Device responsiveness optimization and layout refinements.; Shopping checkout funnel customization and conversion optimization.; Collaborated closely on feedback cycles to deliver bespoke e-commerce workflows.', 'Shopify; Liquid; HTML5; CSS3; JavaScript; Git; Shopify CLI', 'Live Storefront', 'https://t2autohaus.myshopify.com/', 'freelance', 8)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  status = EXCLUDED.status,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  tech = EXCLUDED.tech,
  link_texts = EXCLUDED.link_texts,
  link_urls = EXCLUDED.link_urls,
  categories = EXCLUDED.categories,
  "order" = EXCLUDED."order";

INSERT INTO public.projects (id, title, subtitle, status, tagline, description, features, tech, link_texts, link_urls, categories, "order")
VALUES ('cloudagent', 'Cloud Agent', 'Local-First Workspace AI Assistant // Node.js', 'Production // Active Development', 'A privacy-focused, local-first AI assistant for Google Workspace (Gmail, Drive, Calendar) and local dev environments, built entirely in Node.js.', 'CloudAgent translates natural language into secure, local tool executions via a structured JSON command system. Integrates with Gmail, Drive, Calendar, and Tasks via the Google Workspace CLI (gws), with multi-model LLM fallback and a Flutter desktop dashboard.', 'Local-First & Secure: prompts translated to local API commands via secure JSON structure.; Google Workspace Integration via gws CLI (Gmail, Drive, Tasks, Calendar).; Session Resumption & Multi-Model Fallbacks: resumes chat on startup and falls back through OpenAI, Gemini, Anthropic if rate-limited.; 15-Second Request Timeouts with auto-abort and fallback switching.; Offline Diagnostics & Health Check: doctor commands verify Node, Git, and GWS credentials.; System & Git Orchestration: handles filesystem navigation and git staging/committing/pushing.; Flutter Desktop Dashboard with responsive widgets and smooth slide-and-fade transitions.; Local SQLite DB (WAL Mode) stored at ~/.cloudagent/history.db.', 'Node.js; SQLite3; Google Workspace CLI (gws); OpenRouter API; Gemini API; Git; Flutter', 'GitHub Source', 'https://github.com/adil-rahman-3063/cloudagent', 'personal', 10)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  status = EXCLUDED.status,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  tech = EXCLUDED.tech,
  link_texts = EXCLUDED.link_texts,
  link_urls = EXCLUDED.link_urls,
  categories = EXCLUDED.categories,
  "order" = EXCLUDED."order";

INSERT INTO public.projects (id, title, subtitle, status, tagline, description, features, tech, link_texts, link_urls, categories, "order")
VALUES ('issaa', 'ISSAA മഹാ സംഗമം', 'Event Registration System // HTML/CSS/JS', 'Complete // Private Event', 'Responsive, lightweight event registration portal integrated directly with Google Sheets for zero-backend data storage.', 'A custom-built event registration system with QR-based check-in, an admin dashboard, and a Malayalam-first registration form, using Google Sheets as a serverless database.', 'Cross-origin database integration writing directly to Google Sheets via a secure JSONP (GET-based) script architecture that bypasses CORS limitations.; Fully responsive dark glassmorphic UI, with tables collapsing into responsive cards on mobile.; Secure admin dashboard with Google Sheets-backed credential verification and persistent localStorage login state.; Dynamic QR code generator encoding each participant''s unique Registration ID for offline, on-site verification.; Clamped Malayalam numeric selectors with dynamic range limits and auto-updating total fields.', 'HTML5; CSS3; Vanilla JavaScript; Google Apps Script; Google Sheets API; qrcode.min.js', 'Live site', 'https://issaa.onrender.com/', 'web-Full-Stack, freelance', 9)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  status = EXCLUDED.status,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  tech = EXCLUDED.tech,
  link_texts = EXCLUDED.link_texts,
  link_urls = EXCLUDED.link_urls,
  categories = EXCLUDED.categories,
  "order" = EXCLUDED."order";

INSERT INTO public.projects (id, title, subtitle, status, tagline, description, features, tech, link_texts, link_urls, categories, "order")
VALUES ('redparrot-webhook', 'Red Parrot WhatsApp & Sheets Sync', 'WhatsApp Webhook & Google Sheets Automation // Apps Script', 'Production // Active Use', 'Serverless WhatsApp webhook parser & multi-spreadsheet synchronization engine.', 'A serverless Google Apps Script backend that intercepts incoming Botbiz WhatsApp webhook payloads, parses session counts and batch completion statuses, and synchronizes student data across administrative spreadsheets.', 'Webhook payload parser handling URL-encoded text, emojis, and multi-line session reports from WhatsApp.; Multi-sheet automated data pipeline exporting student records into 8-class, 12-class, 28-class, and closed batch certificate tabs.; Installable event-driven onEdit trigger syncing employee updates back to main administrative sheets with automated date-stamping.; Smart deduplication logic distinguishing between parent-level feedback tracking and individual student certificate workflows.; Automated logging system for execution auditing, error catching, and concurrency locking via ScriptLock', 'Google Apps Script; JavaScript; Google Sheets API; Webhooks; Botbiz API', NULL, NULL, 'backend, freelance', 11)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  status = EXCLUDED.status,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  tech = EXCLUDED.tech,
  link_texts = EXCLUDED.link_texts,
  link_urls = EXCLUDED.link_urls,
  categories = EXCLUDED.categories,
  "order" = EXCLUDED."order";

INSERT INTO public.projects (id, title, subtitle, status, tagline, description, features, tech, link_texts, link_urls, categories, "order")
VALUES ('teledrive', 'TeleDrive', 'Telegram-Backed Cloud Storage // Next.js', 'Featured // Active Development', 'Self-hosted app that turns Telegram into effectively unlimited, private cloud storage for your photos and videos.', 'A self-hosted, open-source web app that runs on localhost and uses your own Telegram account as a free, unlimited storage backend — giving it a polished modern interface for uploading, organizing, and streaming media as if it were on a local drive.', 'Drag-and-drop upload straight into your own Telegram channels.; Full-screen media viewer with native video streaming via instant-scrubbing HTTP Range requests.; Real-time upload progress over WebSockets.; Intelligent local caching for instant reloads of previously viewed files.; Collections with sub-collections for organizing large libraries.; Fully self-hosted — data never leaves your own Telegram account.', 'Next.js; Node.js; Telegram Client API (MTProto); WebSockets; [Tailwind CSS]', 'Live site', 'https://teledrive-web.pages.dev', 'featured, web-Full-Stack, personal', 2)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  status = EXCLUDED.status,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  tech = EXCLUDED.tech,
  link_texts = EXCLUDED.link_texts,
  link_urls = EXCLUDED.link_urls,
  categories = EXCLUDED.categories,
  "order" = EXCLUDED."order";

INSERT INTO public.projects (id, title, subtitle, status, tagline, description, features, tech, link_texts, link_urls, categories, "order")
VALUES ('sirr', 'Sirr (سِرّ)', 'Islamic Prayer Times & Qibla Companion // Flutter', 'Featured // Complete', 'Modern, cross-platform Islamic prayer companion with dynamic daylight-responsive theming and precision Qibla compass.', 'A beautifully designed, cross-platform Islamic prayer companion built with Flutter. Features real-time GPS prayer calculations, dynamic daylight-responsive theming that adapts ambient colors throughout the day, hardware-calibrated Qibla navigation, and cross-platform notification scheduling across mobile and web.', 'Dynamic Prayer-Period Theming: Automatically transitions color schemes across Fajr, Dhuhr, Asr, Maghrib, and Isha paired with Amiri Arabic typography.; Precision Qibla Compass: Real-time Great Circle bearing calculations to the Holy Kaaba with hardware magnetometer and Web DeviceOrientation calibration.; Cross-Platform Notification Engine: Native Android exact alarms with boot persistence, iOS Darwin time-sensitive notifications, and ServiceWorker-backed PWA web push.; Infinite Day Browser: Seamless swipe navigation across past/future dates with Aladhan API caching and live flip-clock countdown timers.; Responsive Layout: Adaptive multi-column dashboard for desktop/tablets and smooth single-column flow for mobile.', 'Flutter; Dart; Provider; REST APIs; Geolocator; Flutter Local Notifications; ServiceWorker API; Google Fonts', 'GitHub Repository | Live Site', 'https://github.com/adil-rahman-3063/Sirr | https://sirr-5hr.pages.dev', 'featured, mobile, personal', 4)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  status = EXCLUDED.status,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  tech = EXCLUDED.tech,
  link_texts = EXCLUDED.link_texts,
  link_urls = EXCLUDED.link_urls,
  categories = EXCLUDED.categories,
  "order" = EXCLUDED."order";

INSERT INTO public.projects (id, title, subtitle, status, tagline, description, features, tech, link_texts, link_urls, categories, "order")
VALUES ('resume-editor', 'Resume Editor', 'Interactive Resume & ATS PDF Engine // Vanilla JS', 'Featured // Complete', 'Modern browser-based resume editor with live WYSIWYG editing, dynamic color theming, and dual PDF export engines.', 'A client-side, zero-dependency resume builder featuring high-aesthetic designed PDF generation, parser-safe ATS-friendly PDF export with custom sequence ordering, 6 curated theme palettes, and instant localStorage persistence.', 'Dual PDF Export Modes: High-aesthetic two-column Design PDF with custom palette gradients and parser-safe single-column ATS PDF.; Custom ATS Section Ordering: Interactive sequence badges allowing users to customize section hierarchy for ATS parsing.; Dynamic Theme & Palette Customizer: Real-time sidebar and main document color customization with 6 curated presets and live CSS variable syncing.; In-Place WYSIWYG Editing: Direct inline editing, section and bullet point reordering (▲/▼), dynamic spacers, and floating selection formatting toolbar (Bold, Italic, Grey highlight, Links).; Privacy-First & Offline Storage: 100% client-side architecture with automatic localStorage persistence and reset capabilities.', 'HTML5; CSS3; Vanilla JavaScript; Google Fonts; LocalStorage API; Print CSS', 'GitHub Repository', 'https://github.com/adil-rahman-3063/Resume-Editor', 'featured, web-Full-Stack, personal', 12)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  status = EXCLUDED.status,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  tech = EXCLUDED.tech,
  link_texts = EXCLUDED.link_texts,
  link_urls = EXCLUDED.link_urls,
  categories = EXCLUDED.categories,
  "order" = EXCLUDED."order";

INSERT INTO public.projects (id, title, subtitle, status, tagline, description, features, tech, link_texts, link_urls, categories, "order")
VALUES ('membership-saas', 'AR Membership Manager', 'Universal B2B Subscription & Member Operations SaaS // Next.js', 'Featured // Live Production SaaS', 'Universal B2B subscription & member management platform with Google Sheets two-way sync, mobile QR check-ins, and automated WhatsApp billing.', 'A multi-tenant B2B membership management platform built for gyms, clubs, studios, co-working spaces, and any subscription-based business. Features complete tenant isolation with Supabase super admin governance, real-time Google Sheets member database syncing, mobile QR check-in engine, Meta WhatsApp Cloud API reminder campaigns, and direct UPI payment links.', 'Multi-Tenant Platform Governance: Super admin account management, subscription tracking, and tenant controls powered by Supabase.; Google Sheets Two-Way Member Sync: Zero-lockin member operations synchronizing directly with each business''s Google Sheet.; Instant Mobile Turnstile & QR Check-in: Real-time QR and phone check-in engine with live occupancy counting.; Automated WhatsApp Campaign Engine: Meta WhatsApp Cloud API integration dispatching payment reminders and renewal alerts.; Direct UPI & Gateway Billing: Dynamic UPI deep links (GPay, PhonePe, Paytm) and automated billing funnels embedded in reminders.; Universal Business Adaptation: Configurable tier structures and billing cycles tailored for any membership or subscription model.', 'Next.js, React, Supabase, Google Sheets API, Meta WhatsApp API, Cloudflare Workers, Tailwind CSS', 'Live Application', 'https://ar-membership-manager.pages.dev', 'saas, featured, web-Full-Stack', 1)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  status = EXCLUDED.status,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  tech = EXCLUDED.tech,
  link_texts = EXCLUDED.link_texts,
  link_urls = EXCLUDED.link_urls,
  categories = EXCLUDED.categories,
  "order" = EXCLUDED."order";

-- ==============================================================================
-- 4. INSERT / SEED SAAS PRODUCTS
-- ==============================================================================

INSERT INTO public.saas (id, title, subtitle, status, tagline, description, features, tech, link_texts, link_urls, categories, "order")
VALUES ('membership-saas', 'AR Membership Manager', 'Universal B2B Subscription & Member Operations SaaS // Next.js', 'Featured // Live Production SaaS', 'Universal B2B subscription & member management platform with Google Sheets two-way sync, mobile QR check-ins, and automated WhatsApp billing.', 'A multi-tenant B2B membership management platform built for gyms, clubs, studios, co-working spaces, and any subscription-based business. Features complete tenant isolation with Supabase super admin governance, real-time Google Sheets member database syncing, mobile QR check-in engine, Meta WhatsApp Cloud API reminder campaigns, and direct UPI payment links.', 'Multi-Tenant Platform Governance: Super admin account management, subscription tracking, and tenant controls powered by Supabase.; Google Sheets Two-Way Member Sync: Zero-lockin member operations synchronizing directly with each business''s Google Sheet.; Instant Mobile Turnstile & QR Check-in: Real-time QR and phone check-in engine with live occupancy counting.; Automated WhatsApp Campaign Engine: Meta WhatsApp Cloud API integration dispatching payment reminders and renewal alerts.; Direct UPI & Gateway Billing: Dynamic UPI deep links (GPay, PhonePe, Paytm) and automated billing funnels embedded in reminders.; Universal Business Adaptation: Configurable tier structures and billing cycles tailored for any membership or subscription model.', 'Next.js, React, Supabase, Google Sheets API, Meta WhatsApp API, Cloudflare Workers, Tailwind CSS', 'Live Application', 'https://ar-membership-manager.pages.dev', 'saas, featured, web-Full-Stack', 1)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  status = EXCLUDED.status,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  features = EXCLUDED.features,
  tech = EXCLUDED.tech,
  link_texts = EXCLUDED.link_texts,
  link_urls = EXCLUDED.link_urls,
  categories = EXCLUDED.categories,
  "order" = EXCLUDED."order";

-- ==============================================================================
-- 5. INSERT / SEED VERIFIED REVIEWS (Portfolio Reviews - Reviews.csv)
--    Uses unique project IDs ('shopify', 'issaa') instead of non-unique order numbers
-- ==============================================================================

INSERT INTO public.reviews (name, role, rating, review, project, approved, created_at)
SELECT 'aslambinkader', 'CEO', 5, 'I had a great experience working with Adil Rehman on the T2 Autohaus website. From the beginning, he understood the vision of creating a professional automotive brand and delivered a clean, modern Shopify store that reflects our business well.

He was responsive, patient with revisions, and always willing to implement changes until everything matched what we wanted. The website is well-structured, easy to navigate, and provides a solid foundation for our growing business.

I appreciate his professionalism, communication, and commitment throughout the project. I would confidently recommend Adil Rehman to anyone looking for a reliable Shopify website developer.

Thank you, Adil, for helping bring the T2 Autohaus vision to life. I wish you continued success.', 'shopify', true, '2026-07-15 02:42:04+00'
WHERE NOT EXISTS (SELECT 1 FROM public.reviews WHERE name = 'aslambinkader' AND review = 'I had a great experience working with Adil Rehman on the T2 Autohaus website. From the beginning, he understood the vision of creating a professional automotive brand and delivered a clean, modern Shopify store that reflects our business well.

He was responsive, patient with revisions, and always willing to implement changes until everything matched what we wanted. The website is well-structured, easy to navigate, and provides a solid foundation for our growing business.

I appreciate his professionalism, communication, and commitment throughout the project. I would confidently recommend Adil Rehman to anyone looking for a reliable Shopify website developer.

Thank you, Adil, for helping bring the T2 Autohaus vision to life. I wish you continued success.');

INSERT INTO public.reviews (name, role, rating, review, project, approved, created_at)
SELECT 'Mohamed Musthafa', 'Retired Teacher (Govt)', 5, 'Wonderful Excellent', 'issaa', true, '2026-08-13 11:22:03+00'
WHERE NOT EXISTS (SELECT 1 FROM public.reviews WHERE name = 'Mohamed Musthafa' AND review = 'Wonderful Excellent');

INSERT INTO public.reviews (name, role, rating, review, project, approved, created_at)
SELECT 'Basil', 'Merchant navy', 5, 'A huge congratulations and heartfelt thanks for creating the registration app for our Alumni Program!

The effort you put into developing this app, along with your innovative ideas and smooth implementation, made the entire registration process seamless and impressive. It’s truly commendable to see someone of your age take such initiative and execute it so brilliantly.

Keep shining, keep innovating, and continue setting the bar high! Wishing you all the best for your future endeavors.', 'issaa', true, '2026-08-13 18:43:45+00'
WHERE NOT EXISTS (SELECT 1 FROM public.reviews WHERE name = 'Basil' AND review = 'A huge congratulations and heartfelt thanks for creating the registration app for our Alumni Program!

The effort you put into developing this app, along with your innovative ideas and smooth implementation, made the entire registration process seamless and impressive. It’s truly commendable to see someone of your age take such initiative and execute it so brilliantly.

Keep shining, keep innovating, and continue setting the bar high! Wishing you all the best for your future endeavors.');

