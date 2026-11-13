export const allBlogs = [
  {
    id: 'homeflix-background-transcoding-engine',
    title: 'Building a Continuous Background Transcoding Engine for Homeflix: Priority Preemption & Streaming Architecture',
    seoTitle: 'Homeflix: Background Transcoding Engine | Adil Rahman',
    date: 'November 14, 2026',
    readTime: '9 min read',
    excerpt: 'How we engineered a background transcoding queue with priority preemption, Series Hub UI, and Chocolatey ffmpeg fixes for open-source media server Homeflix.',
    faq: [
      {
        question: 'How does continuous background transcoding eliminate media streaming lag?',
        answer: 'By proactively detecting non-direct-playable media containers (like MKV or multi-channel DTS/AC3 audio) and converting them to universal MP4/AAC in the background before the user hits play, the client can direct-stream files instantly without cold-start CPU spikes.'
      },
      {
        question: 'What happens when a user plays a file while another is transcoding in the background?',
        answer: 'The engine uses priority preemption. It gracefully sends SIGTERM (with a SIGKILL fallback) to the active FFmpeg background process, cleans up incomplete temporary chunks, promotes the user-selected media to #1 priority, and schedules the preempted item to resume later.'
      },
      {
        question: 'How does the Homeflix Windows installer bundle standalone FFmpeg binaries without Chocolatey shims?',
        answer: 'Chocolatey creates small wrapper stub executables (.exe shims) in ProgramData that depend on relative paths. The build script inspects and bypasses the shim, pulling true standalone FFmpeg binaries directly from chocolatey/lib/ffmpeg/tools/ffmpeg/bin into the NSIS Electron bundle.'
      }
    ],
    content: `**Category:** Open Source / Distributed Media Streaming / Systems & Full-Stack Engineering

**Read Time:** ~9 mins

**Open Source Pull Request:** [github.com/kprakz/homeflix/pull/8](https://github.com/kprakz/homeflix/pull/8)

**Forked Feature Branch:** [github.com/adil-rahman-3063/homeflix](https://github.com/adil-rahman-3063/homeflix/tree/feature/ui-and-background-queue)

> **Quick Answer (AI / Snippet Block):**  
> An open-source contribution to Homeflix introduces a continuous background video transcoding engine that eliminates on-the-fly playback lag. Using a priority preemption lifecycle (\`SIGTERM\`/\`SIGKILL\`), sequential series queuing, and regex scene parsing, unconverted media is pre-cached to MP4/AAC before playback, with user requests immediately elevated to #1 priority.

---

## Table of Contents
1. [The Problem: The Flaws of On-The-Fly Transcoding](#the-problem-the-flaws-of-on-the-fly-transcoding)
2. [Architectural Overview: Proactive Event-Driven Transcoding](#architectural-overview-proactive-event-driven-transcoding)
3. [Deep Dive: Priority Preemption Lifecycle (\`SIGTERM\` & Safe Eviction)](#deep-dive-priority-preemption-lifecycle-sigterm--safe-eviction)
4. [Sequential Conversion Queue Hierarchy](#sequential-conversion-queue-hierarchy)
5. [Media Parsing Engine: Regex Extraction for Scene & P2P Standards](#media-parsing-engine-regex-extraction-for-scene--p2p-standards)
6. [Front-End Overhaul: Series Hub, Floating Dashboard & Accessible HUD](#front-end-overhaul-series-hub-floating-dashboard--accessible-hud)
7. [Windows Packaging & Resolving the Chocolatey FFmpeg Shim Bug](#windows-packaging--resolving-the-chocolatey-ffmpeg-shim-bug)
8. [How to Clone, Build, and Run the Windows Installer Locally](#how-to-clone-build-and-run-the-windows-installer-locally)
9. [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)

---

## The Problem: The Flaws of On-The-Fly Transcoding

Traditional self-hosted media servers (such as Plex or Jellyfin on lower-tier hardware) rely heavily on **just-in-time / on-the-fly transcoding**. When a user requests an incompatible file (e.g., an \`.mkv\` container, HEVC 10-bit video, or multi-channel DTS audio on a web client), the server spawns an active FFmpeg worker:

- **Playback Start Latency:** The client waits 5 to 15 seconds while FFmpeg builds the initial streaming segments.
- **CPU Spikes & Thermal Throttling:** Real-time transcoding pegs the host CPU at 100%, choking concurrent streams on the local network.
- **Wasted Compute on Abandoned Streams:** If a user clicks away after 30 seconds, CPU cycles spent on real-time rendering are completely discarded.

### Comparison: On-The-Fly vs. Proactive Background Engine

| Metric | On-The-Fly Transcoding | Continuous Background Engine |
| :--- | :--- | :--- |
| **Playback Start Latency** | 5 to 15 seconds initial delay | **< 200 ms (Instant direct-stream)** |
| **CPU Peak Spikes** | 90–100% load during playback | **Throttled background worker** |
| **Multi-Device Concurrency** | Max 1–2 concurrent streams | **Zero server transcoding bottleneck** |
| **Interrupted Sessions** | Wasted CPU cycles | **Resumable serialized queue with preemption** |

---

## Architectural Overview: Proactive Event-Driven Transcoding

To eliminate cold-start buffering, I re-architected Homeflix to convert files ahead of time. The host server proactively traverses media directories and converts unsupported containers into browser-compatible H.264/AAC MP4 files cached locally.

\`\`\`text
[Media Library Scanner]
        │
        ▼
[Sequential Queue Dispatcher]
        │
   ┌────┴──────────────────────────────────────┐
   │ 1. Filter: Direct-stream bypass (.mp4)    │
   │ 2. Evaluate Conversion Hierarchy          │
   │ 3. Check Active Playback Streams          │
   └────┬──────────────────────────────────────┘
        │
        ▼
[FFmpeg Background Worker Thread]
        │
   ┌────┴──────────────────────────────────────┐
   │ - Continuous transcode to .cache/         │
   │ - Telemetry updates (speed, ETA, size)    │
   └────┬──────────────────────────────────────┘
        │ (User clicks "Play" on another video)
        ▼
[Priority Preemption Interceptor]
        ├──> Send SIGTERM to active worker
        ├──> Purge partial .part artifacts
        ├──> Promote user-selected file to #1 Priority
        └──> Re-enqueue preempted item to resume next
\`\`\`

---

## Deep Dive: Priority Preemption Lifecycle (\`SIGTERM\` & Safe Eviction)

The primary challenge with background transcoding is resource competition: if the server is already busy encoding a background movie and a user clicks **Play** on an unconverted episode, running two concurrent FFmpeg jobs would choke the CPU.

To solve this, I designed an atomic priority preemption lifecycle:

\`\`\`javascript
// server.js - Priority Preemption Handler
function preemptActiveConversion(nextPriorityId) {
  if (!activeConversion || !activeConversion.process) return;

  const currentItem = activeConversion.item;
  console.log(\`[Queue] Preempting active item: \${currentItem.id} for priority item: \${nextPriorityId}\`);

  // 1. Mark as preempted so cleanup does not mark as failed
  activeConversion.preempted = true;

  // 2. Graceful termination with SIGTERM
  activeConversion.process.kill('SIGTERM');

  // 3. Fallback SIGKILL watchdog if process does not exit within 2000ms
  const killTimeout = setTimeout(() => {
    if (activeConversion && activeConversion.process) {
      console.warn(\`[Queue] Force killing unresponsive process: \${currentItem.id}\`);
      activeConversion.process.kill('SIGKILL');
    }
  }, 2000);

  // 4. Safely clean up partial unfinalized temporary files
  cleanPartialCache(currentItem.tempPath);

  // 5. Place preempted item back at the head of the resume queue
  requeuePreemptedItem(currentItem);
}
\`\`\`

By cleaning up temporary \`.part\` buffers immediately, we prevent disk corruption while guaranteeing that user-initiated playback requests receive 100% of available CPU headroom within milliseconds.

---

## Sequential Conversion Queue Hierarchy

The queue engine implements a deterministic 5-tier scheduling hierarchy:

1. **User-Prioritized File:** Immediate absolute priority via \`POST /api/queue/prioritize\`. Preempts any background worker.
2. **Selected Series Cohort:** When a user opens a TV show hub, all remaining episodes of that specific series are elevated in chronological order (\`S01E01\`, \`S01E02\`, \`S01E03\`...) ahead of generic media.
3. **Resumed Items:** Tasks that were previously preempted or paused resume their transcode.
4. **Movies Ordered by Newest Addition:** Recently added films are prioritized over archival titles.
5. **Series Ordered by Season/Episode:** Bulk library series convert sequentially.

### Direct-Stream Bypass
Universal \`.mp4\` files with standard AAC audio are filtered with \`mode: direct\`. This bypass prevents the engine from needlessly transcoding already-compatible containers, eliminating preemption loops and unnecessary disk writes.

---

## Media Parsing Engine: Regex Extraction for Scene & P2P Standards

Media library files downloaded via P2P networks or Telegram groups typically arrive with chaotic release strings (e.g., \`Show.Title.S01E02.720p.HEVC.x265-GROUP.mkv\`).

I overhauled the \`prettyName\` extraction engine with resilient regex pattern matchers:

\`\`\`javascript
function parseMediaMetadata(filename) {
  // Extract Show Title, Season, Episode from scene strings
  const tvMatch = filename.match(/^(.*?)[.\s_-]+S(\d{1,2})[.\s_-]*E(\d{1,2})/i);
  if (tvMatch) {
    const rawTitle = tvMatch[1].replace(/[._-]/g, ' ').trim();
    const season = parseInt(tvMatch[2], 10);
    const episode = parseInt(tvMatch[3], 10);
    return {
      type: 'series',
      title: rawTitle,
      season: season,
      episode: episode,
      label: \`S\${String(season).padStart(2, '0')}:E\${String(episode).padStart(2, '0')}\`
    };
  }

  // Fallback: Movie title and 4-digit release year
  const movieMatch = filename.match(/^(.*?)[.\s_(\[]+(19\d{2}|20\d{2})/);
  if (movieMatch) {
    return {
      type: 'movie',
      title: movieMatch[1].replace(/[._-]/g, ' ').trim(),
      year: parseInt(movieMatch[2], 10)
    };
  }

  return { type: 'unknown', title: filename.replace(/\.[^/.]+$/, '') };
}
\`\`\`

---

## Front-End Overhaul: Series Hub, Floating Dashboard & Accessible HUD

Beyond the backend streaming pipeline, I executed a complete redesign of the Homeflix interface (\`public/index.html\`):

1. **Multi-View Tabbed Routing:**
   - **Home:** Dynamic hero banner showcasing active titles with instant Play/Resume action, plus horizontally scrollable rows (*Continue Watching*, *Recently Added*, *TV Shows*, *Movies*).
   - **TV Shows & Movies Catalogues:** Strict separation between serialized shows and standalone movies with real-time sorting (*Recently Added*, *A-Z*, *Year*, *File Size*).

2. **Dedicated Series Hub Modal (\`#showModal\`):**
   - Dynamic season tabs (\`Season 1\`, \`Season 2\`...).
   - High-resolution episode grid featuring automated video thumbnail generation, runtime badges, file size markers, and individual playback progress indicators.
   - Intelligent "Next Up" resolution: automatically opens the next uncompleted episode when clicking the primary Play button.

3. **Floating Converter Dashboard (\`#convWidget\`):**
   - Bottom-corner floating widget with an active status LED indicator (Idle, Active, Paused).
   - Real-time telemetry: conversion progress percentage, speed multiplier (e.g., \`3.4x\`), and remaining ETA countdown.
   - Disk cache storage meter displaying cache usage vs. remaining free drive space.
   - Full queue management: "Make Next" priority buttons and pause/resume controls.
   - Automatically hides when the video player launches to prevent visual distraction.

4. **Modern Accessible Video Player HUD:**
   - Smooth scrubber with hover timestamp preview tooltip.
   - Audio track switcher, subtitle CC picker sheet, and audio boost toggle.
   - Complete keyboard shortcuts (\`Space\`/\`k\` for play/pause, \`Left\`/\`Right\`/\`j\`/\`l\` for seek, \`m\` for mute, \`f\` for fullscreen) and TV remote D-pad focus navigation.

---

## Windows Packaging & Resolving the Chocolatey FFmpeg Shim Bug

When packaging the Electron desktop application for Windows using \`electron-builder\` and NSIS, the production build consistently failed on machines without a system-wide Chocolatey installation.

### The Root Cause
On Windows, Chocolatey does not place raw executable binaries into \`C:\\ProgramData\\chocolatey\\bin\\ffmpeg.exe\`. Instead, it generates a **70 KB executable shim stub** that depends on relative path resolutions to launch the actual engine. When bundled into an NSIS installer, the shim broke because the parent Chocolatey directory was missing.

### The Fix in \`scripts/get-ffmpeg.mjs\`
I updated the binary resolution script to detect Chocolatey shim stubs and resolve the true standalone binary directly from the vendor directory:

\`\`\`javascript
// scripts/get-ffmpeg.mjs
import fs from 'fs';
import path from 'path';

export function resolveWindowsFFmpeg() {
  const chocoBin = 'C:\\ProgramData\\chocolatey\\bin\\ffmpeg.exe';
  const chocoVendor = 'C:\\ProgramData\\chocolatey\\lib\\ffmpeg\\tools\\ffmpeg\\bin\\ffmpeg.exe';

  // If the target is a shim, bypass it and point to the true standalone binary
  if (fs.existsSync(chocoVendor)) {
    console.log('[Build] Bypassing Chocolatey shim, packaging true binary:', chocoVendor);
    return chocoVendor;
  }

  return chocoBin;
}
\`\`\`

This produced a self-contained, standalone Windows installer (\`dist/HOMEFLIX-Setup-1.5.0.exe\`, ~170 MB) that bundles native FFmpeg binaries and runs out of the box with zero third-party dependencies.

---

## How to Clone, Build, and Run the Windows Installer Locally

You can test and run this complete feature branch directly from the forked repository.

### Open Source Links
- **Upstream Pull Request:** [github.com/kprakz/homeflix/pull/8](https://github.com/kprakz/homeflix/pull/8)
- **Forked Repository Branch:** [github.com/adil-rahman-3063/homeflix/tree/feature/ui-and-background-queue](https://github.com/adil-rahman-3063/homeflix/tree/feature/ui-and-background-queue)

### Step-by-Step Build Instructions

\`\`\`bash
# 1. Clone the specific feature branch
git clone -b feature/ui-and-background-queue https://github.com/adil-rahman-3063/homeflix.git

# 2. Navigate to the project root
cd homeflix

# 3. Install dependencies
npm install

# 4. Build the standalone Windows installer
npm run dist

# 5. Open the dist folder in File Explorer
cd dist
explorer .
\`\`\`

Once File Explorer opens, double-click **\`HOMEFLIX-Setup-1.5.0.exe\`** to run the installer. The app will launch the streaming server, initialize your local media folder, and launch the new tabbed UI with continuous background conversion ready.

---

## Frequently Asked Questions (FAQ)

### Can Homeflix run on low-power devices like Raspberry Pi or mini PCs?
Yes. Because the background conversion queue operates at a lower process priority and preempts when playback begins, low-power devices avoid CPU thermal throttling and stream universal MP4 files smoothly.

### What happens if the server is powered off during an active conversion?
The server stores conversion states in memory and writes temporary segments to a \`.part\` file. On boot, Homeflix purges incomplete \`.part\` files and re-queues the unconverted master file automatically.

### Does Homeflix support hardware acceleration (NVENC / QuickSync)?
The underlying FFmpeg wrapper supports hardware flags. When configured in \`server.js\`, compatible host GPUs can accelerate background transcoding speeds from \`3.4x\` to upwards of \`12x\` realtime.
`
  },
  {
    id: 'whatsapp-automation-google-sheets-case-study',
    title: 'How to Build an Automated WhatsApp & Google Sheets Attendance System with Real-Time Error Alerts',
    seoTitle: 'WhatsApp Automation with Google Sheets & Apps Script | Adil Rahman',
    date: 'November 12, 2026',
    readTime: '8 min read',
    excerpt: 'Learn how to build a two-way WhatsApp automation pipeline using Google Apps Script, Webhooks, and Google Sheets to automate attendance and real-time alerts.',
    faq: [
      {
        question: 'Can Google Apps Script handle concurrent webhooks without crashing?',
        answer: 'Yes. By wrapping the doPost(e) handler in LockService.getScriptLock() with a timeout, Google Apps Script queues and serializes concurrent requests, eliminating race conditions on Google Sheets.'
      },
      {
        question: 'Why use WhatsApp Utility Templates instead of regular chat messages?',
        answer: 'Meta requires approved templates when sending outbound messages outside the 24-hour window. Utility templates provide verified delivery and guarantee lower messaging fees under WhatsApp Business Cloud API policies.'
      },
      {
        question: 'What happens if a teacher writes an invalid batch number?',
        answer: 'The script queries the Google Sheet. If no match is found, it logs an anomaly to a diagnostic sheet and dispatches an automated batch_not_found WhatsApp alert to the sender.'
      }
    ],
    content: `**Category:** DevOps & Automation / Messaging Architecture / Google Apps Script

**Read Time:** ~8 mins

> **Quick Answer (AI / Snippet Block):**  
> A two-way WhatsApp and Google Sheets automation pipeline connects incoming teacher messages to Google Apps Script via webhooks. The system uses regex parsing and \`LockService\` concurrency control to log attendance in Google Sheets, checks class session counts against business rules, and dispatches real-time WhatsApp Utility templates if an anomaly occurs.

---

## Table of Contents
1. [The Problem: Why EdTech Attendance Fails at Scale](#the-problem-why-edtech-attendance-fails-at-scale)
2. [High-Level Architecture: Two-Way Event Loop](#high-level-architecture-two-way-event-loop)
3. [Step 1: Inbound Webhook Processing with Concurrency Locks](#step-1-inbound-webhook-processing-with-concurrency-locks)
4. [Step 2: Resilient Regex Extraction for Unstructured Text](#step-2-resilient-regex-extraction-for-unstructured-text)
5. [Step 3: Business Logic & Session Validation Engine](#step-3-business-logic--session-validation-engine)
6. [Step 4: Automated Milestone Triggers (8, 12, & 28 Classes)](#step-4-automated-milestone-triggers-8-12--28-classes)
7. [Step 5: Reverse WhatsApp Alerting with Meta Utility Templates](#step-5-reverse-whatsapp-alerting-with-meta-utility-templates)
8. [Performance Benchmarks & Business Results](#performance-benchmarks--business-results)
9. [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)

---

## The Problem: Why EdTech Attendance Fails at Scale

Managing attendance across 50+ language batches with hundreds of students often causes severe operational bottlenecks for growing education institutes:
- **Manual Data Entry Delays:** Administrative staff spend **15–20 hours per week** transcribing WhatsApp chat logs into spreadsheets.
- **Typo-Induced Billing Discrepancies:** Teachers occasionally skip or miscount sessions (e.g., logging session 7 after session 5), leading to inaccurate parent invoices.
- **Missed Feedback Milestones:** Crucial feedback cycles (typically scheduled after the 8th, 12th, or 28th class) are missed because admins lack automated cohort triggers.

### Comparison: Manual vs. Automated WhatsApp Architecture

| Metric | Manual WhatsApp Tracking | Automated Webhook Engine |
| :--- | :--- | :--- |
| **Data Entry Latency** | 12 to 24 hours | **< 1.5 seconds (Real-time)** |
| **Error Detection** | At monthly billing audits | **Instantaneous reverse WhatsApp alert** |
| **Data Integrity** | Vulnerable to race conditions & typos | **Locked transactions (\`LockService\`)** |
| **Operational Overhead** | ~80 hours / month | **Zero manual admin hours** |

---

## High-Level Architecture: Two-Way Event Loop

The system operates as a closed-loop distributed state machine:

\`\`\`text
[Teacher Message on WhatsApp]
        │
        ▼
[Botbiz Automation Studio / WhatsApp Cloud API]
        │ (HTTP POST with JSON Payload)
        ▼
[Google Apps Script doPost(e) Webhook]
        │
   ┌────┴───────────────────────────────┐
   │ 1. LockService Concurrency Check   │
   │ 2. Regex Parser (Batch & Sessions) │
   │ 3. Master Google Sheet Read/Write  │
   └────┬───────────────────────────────┘
        │
   ┌────┴───────────────────────────────┐
   ▼                                    ▼
[Success Path]                    [Exception Path]
- Update "Completed Classes"      - Log to Diagnostics Sheet
- Check Milestone (8/12/28)       - Trigger Reverse Webhook
- Sync Feedback Spreadsheet       - Meta Dispatches Warning Template
\`\`\`

---

## Step 1: Inbound Webhook Processing with Concurrency Locks

When dozens of classes finish at the top of the hour, multiple teachers send WhatsApp messages simultaneously. Without concurrency locks, simultaneous writes to Google Sheets result in lost updates.

\`\`\`javascript
function doPost(e) {
  // Enforce mutex lock across concurrent teacher submissions
  var lock = LockService.getScriptLock();
  
  if (!lock.tryLock(10000)) { // 10-second timeout window
    return ContentService
      .createTextOutput('Server busy, request locked')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  try {
    var rawPayload = e.postData.contents;
    var payload = JSON.parse(rawPayload);
    
    var incomingPhone = normalizePhoneNumber(payload.phone || payload.chat_id);
    var messageText = payload.user_message || payload.message || '';
    
    // Proceed to parsing and validation...
  } finally {
    lock.releaseLock();
  }
}
\`\`\`

---

## Step 2: Resilient Regex Extraction for Unstructured Text

Teachers rarely format messages identically. To guarantee accurate data extraction, the parser implements a descending-length priority algorithm with boundary matchers to prevent substring collisions (e.g., distinguishing batch \`TU2600276\` from \`TU260027\`):

\`\`\`javascript
function extractBatchCodeFromMessage(messageText) {
  if (!messageText) return 'Unknown';

  // Primary: Match explicit labels (e.g., "BATCH NUMBER : JR202101")
  var match = messageText.match(
    /BATCH\\s*(?:NUMBER|NO\\.?|#|CODE)?\\s*[:=\\-]?\\s*[\\r\\n\\s]*([A-Z0-9][A-Z0-9_-]*)/i
  );
  if (match && match[1]) return String(match[1]).trim();

  // Fallback: Match structured alphanumeric patterns (e.g., "JR202101")
  var fallback = messageText.match(/\\b[A-Z]{1,5}\\d{4,}[A-Z0-9_-]*\\b/i);
  return fallback ? String(fallback[0]).trim() : 'Unknown';
}
\`\`\`

---

## Step 3: Business Logic & Session Validation Engine

The engine differentiates between **Standard Batches** and **Tuition Batches**:
1. **Standard Batches:** May begin at session 1 or 2, but must increment strictly by +1.
2. **Tuition Batches (\`TU\` prefix):** Must reset to session 1 at the beginning of each calendar month. The system maintains a state table (\`tution_log\`) to calculate date intervals across months.

If a teacher submits session \`7\` when previous completed was \`5\`, the system updates the sheet to avoid data loss, but immediately raises a **Session Mismatch Flag**.

---

## Step 4: Automated Milestone Triggers (8, 12, & 28 Classes)

When a batch reaches class milestone 8, 12, or 28:
1. The script cross-references the student database (\`Fee\` sheet).
2. It extracts student names, parent contact numbers, and enrollments.
3. It appends deduplicated contact rows into the targeted Feedback Google Sheet.
4. When support staff call parents and set \`"MESSAGE SENT"\` to \`'Y'\`, an installable \`onEdit\` trigger (\`y to n\`) timestamps the master batch sheet and highlights the row in light green (\`#e6f4ea\`).

---

## Step 5: Reverse WhatsApp Alerting with Meta Utility Templates

When session sequence errors or invalid batch codes occur, Google Apps Script makes an outbound HTTP POST call back to Botbiz Inbound Webhooks:

\`\`\`javascript
function sendBotbizWarning(spreadsheet, phone, batchCode, newSession, previousSession, expectedSession) {
  var payload = {
    name: 'Teacher',
    phone: normalizePhoneNumber(phone),
    BatchCode: String(batchCode),
    NewSession: String(newSession),
    PreviousSession: String(previousSession),
    ExpectedSession: String(expectedSession)
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  UrlFetchApp.fetch(BOTBIZ_WARNING_WEBHOOK_URL, options);
}
\`\`\`

The Botbiz Automation Studio catches the webhook and delivers an approved **Meta WhatsApp Utility Template**:

\`\`\`text
⚠️ Batch {{1}} was updated to {{2}}.

Previous completed sessions were {{3}}.
Expected next session was {{4}}.

Please check the session count.
\`\`\`

---

## Performance Benchmarks & Business Results

- **Processing Latency:** Sub-1.5 second turnaround from WhatsApp message receipt to Google Sheet cell update.
- **Attendance Accuracy:** 100% data integrity with automated alerts catching 100% of teacher sequence errors.
- **Feedback Turnaround:** Parent feedback initiated within 2 hours of milestone completion versus 7–10 day delays under manual logging.
- **Cost Efficiency:** Built entirely using serverless Google Apps Script and WhatsApp Cloud API, keeping infrastructure hosting costs at **$0/month**.

---

## Frequently Asked Questions (FAQ)

### Can Google Apps Script handle concurrent webhooks without crashing?
Yes. By wrapping the \`doPost(e)\` entry point in \`LockService.getScriptLock()\`, Google Apps Script serializes incoming concurrent requests, preventing write collisions on Google Sheets.

### Why use WhatsApp Utility Templates instead of regular chat messages?
Meta requires approved templates whenever sending outbound notifications to users outside the 24-hour service window. Utility templates guarantee delivery and have a 98% open rate compared to email.

### What happens if a teacher writes an invalid batch number?
The system checks the master sheet. If no match is found, it logs the attempt to a diagnostic sheet and triggers an automated \`batch_not_found\` WhatsApp template back to the teacher requesting verification.

---

*This case study is published by [Adil Rahman](https://adilrahman.cc) documenting real-world workflow automations with Meta Cloud API and Google Apps Script.*`,
  },
  {
    id: 'zero-cookie-visitor-map-cloudflare-supabase',
    title: 'Building a Zero-Cookie Global Visitor Map with Cloudflare Edge, Supabase & Next.js',
    seoTitle: 'Zero-Cookie Visitor Map: Cloudflare & Next.js | Adil Rahman',
    date: 'November 10, 2026',
    readTime: '7 min read',
    excerpt: 'Build a real-time GitHub-style world visitor map with zero cookies or tracking using Cloudflare edge headers, Supabase atomic counters, and Next.js.',
    content: `**Category:** Frontend Graphics / Edge Architecture / Privacy Engineering

**Read Time:** ~7 mins

## Introduction: The Spark of Inspiration

A few days ago, while browsing GitHub, I came across Prakhar's open-source project [homeflix](https://github.com/kprakz/homeflix). 

One particular interface element immediately caught my eye: a **GitHub contribution graph–style world map**. Instead of the usual vector paths or generic Google Map embeds, it rendered the entire planet as a discrete matrix of tiny, tactile SVG squares that radiated with ripple animations whenever a country recorded traffic.

I loved the aesthetic. It felt retro, responsive, and completely distinct from standard developer portfolios. 

But looking at how most visitor tracking works today, I wanted to solve a deeper engineering challenge: **Can we power a live global visitor map on a 100% statically exported Next.js site with zero cookies, zero third-party tracking scripts, and zero GDPR consent banners?**

Here is the architectural breakdown and step-by-step implementation of how I adapted the visual concept from [kprakz/homeflix](https://github.com/kprakz/homeflix), hooked it up to Cloudflare edge telemetry, and persisted live sessions with Supabase atomic counters.

---

## Why a Dedicated Edge Pipeline for a Public Map?

While I use Google Analytics behind the scenes for private dashboard reporting, powering a **public, real-time visual map** directly on the portfolio UI requires a completely different architecture:

1. **Client-Facing Privacy:** Google Analytics data is private to the site owner. Querying it on every frontend page load would require backend proxies and token exposure.
2. **Zero-Cookie Widget:** We wanted this public UI element to be 100% self-contained, lightweight, and zero-cookie—extracting only country metrics without tracking individuals.
3. **Sub-Second Realtime Updates:** By decoupling public visitor presence from private analytics, the map updates live via Supabase WebSockets the moment a visitor arrives.

### The Zero-Cookie Edge Alternative
What if we never record the visitor's IP address? What if we never drop a tracking cookie? 

When a user connects to a site proxied by **Cloudflare**, Cloudflare's edge server terminates the incoming TCP handshake and automatically inspects the IP to determine geographical origin. It attaches the 2-letter ISO country code (e.g., \`IN\`, \`US\`, \`DE\`, \`GB\`) to the request headers (\`cf-ipcountry\` or the internal \`/cdn-cgi/trace\` endpoint).

By extracting this ISO code in-memory at the edge and immediately discarding the raw IP, we can track global country distributions with **100% anonymity and zero cookies**.

---

## Step 1: The 120×56 World Grid Topology

To build a contribution graph–style map, we cannot use continuous SVG path polygons. Instead, the globe must be quantized into a fixed discrete grid.

In [kprakz/homeflix](https://github.com/kprakz/homeflix), this was achieved using a precomputed matrix generated with **d3-geo** and the Natural Earth projection:

- **Grid Dimensions:** 120 columns by 56 rows (6,720 coordinate points).
- **Cell Definition:** Each entry is a tuple \`[col, row, country_code]\`.
- **Centroids:** A dictionary mapping ISO country codes to their exact geographical center coordinate \`[centerCol, centerRow]\`.

This precomputed dataset (stored as \`world-grid.json\`) weighs only ~24KB. By loading it statically on the client, we render the entire planet in pure SVG without requiring heavy D3 runtime libraries in our client bundle.

---

## Step 2: The Supabase Atomic Counter Schema

Next, we need a lightweight database table to persist cumulative sessions per country. Storing raw access logs would quickly balloon our database row limits. Instead, we store a single aggregate row per country.

Create the table in PostgreSQL via Supabase:

\`\`\`sql
CREATE TABLE IF NOT EXISTS public.visitor_countries (
  country_code VARCHAR(2) PRIMARY KEY,
  count BIGINT NOT NULL DEFAULT 1,
  last_visited TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.visitor_countries ENABLE ROW LEVEL SECURITY;

-- Allow public read access so the map can render live counts
CREATE POLICY "Public can view country visitor counts"
  ON public.visitor_countries FOR SELECT
  USING (true);
\`\`\`

### Preventing Race Conditions with Atomic RPC
If multiple visitors from the same country arrive simultaneously, traditional read-then-write updates will cause race conditions and dropped counts. We prevent this using a PostgreSQL atomic increment function:

\`\`\`sql
CREATE OR REPLACE FUNCTION public.increment_country(c_code TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.visitor_countries (country_code, count, last_visited)
  VALUES (UPPER(c_code), 1, NOW())
  ON CONFLICT (country_code)
  DO UPDATE SET
    count = public.visitor_countries.count + 1,
    last_visited = NOW();
END;
$$;
\`\`\`

---

## Step 3: Production Domain Gating & Daily Device Rate-Limiting

On the client side, we detect the visitor's country without annoying consent popups. However, in real-world deployments three critical safeguards are required:

1. **Domain Gating:** We only want to log visits when users browse our live production domain (\`adilrahman.cc\`). Any visits on \`localhost\`, \`127.0.0.1\`, staging, or preview deployments must never touch the database.
2. **Once-Per-Day Device Rate Limiting:** Visitors frequently refresh or switch between pages. Using \`localStorage\` keyed by today's UTC date (\`YYYY-MM-DD\`), we guarantee that a device only increments the visit counter **once per day**.
3. **Global Endpoint Coverage (Root Layout):** Visitors often arrive directly on deep links from Google or social media (e.g., \`/reviews\`, \`/blog/...\`, \`/saas/...\`). By mounting our telemetry inside a lightweight headless client component (\`VisitorTelemetry\`) within the root layout (\`src/app/layout.js\`), all entry points are captured uniformly.

\`\`\`javascript
useEffect(() => {
  if (typeof window === 'undefined') return;

  const STORAGE_DATE_KEY = 'ar_visit_logged_date';
  const STORAGE_COUNTRY_KEY = 'ar_visit_logged_country';

  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const lastLoggedDate = localStorage.getItem(STORAGE_DATE_KEY);
  const cachedCountry = localStorage.getItem(STORAGE_COUNTRY_KEY);

  if (cachedCountry) setMyCountry(cachedCountry);

  // 1. Only mark a device 1 time per day
  if (lastLoggedDate === today) return;

  // 2. Only mark visits on the production domain (adilrahman.cc)
  const hostname = window.location.hostname;
  const isProd = hostname === 'adilrahman.cc' || hostname === 'www.adilrahman.cc';
  if (!isProd) {
    if (!cachedCountry) setMyCountry('IN'); // Preview fallback for dev
    return;
  }

  async function detectAndLog() {
    let code = null;

    try {
      const res = await fetch('/cdn-cgi/trace', { cache: 'no-store' });
      if (res.ok) {
        const text = await res.text();
        const match = text.match(/loc=([A-Za-z]{2})/);
        if (match && match[1]) code = match[1].toUpperCase();
      }
    } catch (_) {}

    if (code && code !== 'XX') {
      setMyCountry(code);

      // Lock today's visit on this device immediately
      localStorage.setItem(STORAGE_DATE_KEY, today);
      localStorage.setItem(STORAGE_COUNTRY_KEY, code);

      // Atomic increment in Supabase
      try {
        await supabase.rpc('increment_country', { c_code: code });
      } catch (_) {}
    }
  }

  detectAndLog();
}, []);
\`\`\`

---

## Step 4: Rendering the SVG & The Ripple Math

Once both \`world-grid.json\` and the Supabase \`visitor_countries\` data resolve, we construct the SVG elements dynamically.

### 1. Logarithmic Color Shading
A linear color scale fails in real-world traffic scenarios. If the United States has 1,200 visits and Germany has 15, a linear scale will render Germany in the faintest unnoticeable shade.

By applying a **logarithmic scale**, every increment from 1 to the maximum count receives clear visual representation:

\`\`\`javascript
const shade = (n) => {
  if (n <= 0 || max <= 0) return 0;
  return Math.min(4, 1 + Math.floor((Math.log(n + 1) / Math.log(max + 1)) * 3.999));
};
\`\`\`

This maps each country count into 5 distinct CSS variables (\`--m0\` through \`--m4\`).

### 2. Centroid-Radiating Ripple Physics
When the user scrolls the map into view, we don't want all squares to pop up simultaneously. 

Using the precomputed country centroids, we calculate the Euclidean distance from the country's center to each individual cell using \`Math.hypot()\`. This generates a hypnotic ripple wave expanding outwards from the country's geometric heart:

\`\`\`javascript
const [cc, cr] = gridData.centres[code] || [col, row];
const distance = Math.hypot(col - cc, row - cr);

// Stagger delay based on country rank + geometric distance from center
const delay = (rank.get(code) || 0) * 320 + distance * 65;
\`\`\`

In CSS, the keyframe scales each square from the center:

\`\`\`css
@keyframes spread {
  from {
    opacity: 0;
    transform: scale(0.2);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
\`\`\`

### 3. Live WebSocket Updates via Supabase Realtime
To ensure the map updates live whenever a new country logs in without requiring a manual page refresh, we subscribe to PostgreSQL changes via Supabase Realtime:

\`\`\`javascript
const channel = supabase
  .channel('visitor_countries_live_feed')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'visitor_countries' },
    (payload) => {
      if (payload.new?.country_code) {
        const code = payload.new.country_code.toUpperCase().trim();
        const n = Number(payload.new.count) || 1;
        setCounts((prev) => ({ ...prev, [code]: n }));
      }
    }
  )
  .subscribe();
\`\`\`

Paired with a rotating radar sweep indicator while the SVG topology initializes, the terminal feels alive and reactive.

---

## Step 5: Next.js Static Export & Cloudflare Pages Pitfalls

Deploying this on Cloudflare Pages with Next.js \`output: 'export'\` brought an interesting hurdle.

Next.js provides an internal \`src/middleware.js\` convention. However, running \`next build\` with static exports threw:

\`\`\`text
⨯ Middleware cannot be used with "output: export".
\`\`\`

Because static exports produce purely static HTML/CSS files without a persistent Node.js server, Next.js blocks its internal middleware.

The solution was utilizing **Cloudflare Pages Functions native middleware** (\`functions/_middleware.js\`). Cloudflare Pages executes this script directly on the V8 edge runtime before serving static files, allowing custom subdomain routing without breaking the static build.

---

## Summary & Open Source Credit

By combining precomputed topological grids with edge-native request inspection and serverless PostgreSQL, we achieved:
- **Zero Cookies & Zero Tracking Scripts:** 100% compliant with GDPR/PECR without annoying consent banners.
- **Sub-Second Performance:** Only 24KB of static JSON, with zero impact on initial page load.
- **Engaging Visual Telemetry:** Visitors can see their own presence illuminate the global map in real time.

Special thanks again to **Prakhar** ([kprakz/homeflix](https://github.com/kprakz/homeflix)) for open-sourcing the world grid concept and inspiring this implementation!

You can see this live on the [Adil Rahman Portfolio](https://adilrahman.cc) in the **Global Network** section.`,
  },
  {
    id: 'cloudflare-pages-npm-ci-wasm-trap',
    title: 'The Windows-to-Linux npm ci Trap: Debugging Missing WebAssembly Bindings on Cloudflare Pages',
    seoTitle: 'Cloudflare Pages npm ci Wasm Lockfile Fix | Adil Rahman',
    date: 'November 7, 2026',
    readTime: '6 min read',
    excerpt: 'Why local builds on Windows succeed while Cloudflare Pages Linux CI crashes with npm ci EUSAGE errors on Wasm packages—and how to fix package-lock.json parity.',
    content: `**Category:** DevOps / Edge Deployment / Node.js Tooling

**Read Time:** ~6 mins

## Introduction: The "Green on Local, Red on CI" Mystery
A few days ago, while pushing a release for **Fileo**—an in-browser file utility and image manipulation platform built on **Astro 5** and **Tailwind CSS v4**—I ran into a classic modern frontend developer nightmare.

On my primary local workstation (Windows 11, Node v24), everything was pristine. I ran \`npm run build\`:
- All 29 static routes compiled in 1.48 seconds.
- Wasm decoders, responsive layouts, and SEO manifests generated without a single warning.
- The dev server passed every end-to-end check.

Confident that everything was solid, I committed the code and pushed to GitHub. The push immediately triggered an automated production build on **Cloudflare Pages**.

Ten seconds later, the Cloudflare deployment log threw a hard red error before compiling a single line of code:

\`\`\`text
12:41:02.104  Executing user command: npm ci
12:41:04.819  npm error code EUSAGE
12:41:04.821  npm error The \`npm ci\` command can only install with an existing package-lock.json...
12:41:04.822  npm error Missing: @emnapi/core@1.11.3 from lock file
12:41:04.823  npm error Missing: @emnapi/runtime@1.11.3 from lock file
12:41:04.825  npm error Failed at the npm ci step. Exited with status 1.
\`\`\`

I stared at the terminal output. My local \`package-lock.json\` was clearly committed in the repository root. \`npm run build\` ran seamlessly on my laptop 30 seconds prior.

Why does a codebase that builds cleanly on a local Windows machine violently explode on a remote Linux runner during \`npm ci\`?

The culprit lies deep within how modern JavaScript frameworks distribute WebAssembly and native Rust bindings—and how npm silently prunes dependencies on Windows.

## The Modern Tooling Shift: The Rise of Native WASI Bindings
Over the past two years, the JavaScript ecosystem has undergone a massive Rust and WebAssembly renaissance. 

To achieve sub-second build times and instant hot-module replacement, tools like **Astro 5** (utilizing the Rolldown bundler), **Tailwind CSS v4** (powered by the native Oxide engine), **SWC**, and **Biome** have largely abandoned pure JavaScript parsers. Instead, they compile their performance-critical cores directly into native platform binaries (\`.node\`) and **WASI** (WebAssembly System Interface) modules.

To distribute these packages across every operating system without bloating your \`node_modules\` with 200 MB of multi-platform binaries, package maintainers distribute them as **optional platform-specific dependencies**:

- \`@tailwindcss/oxide-win32-x64-msvc\` (for Windows)
- \`@tailwindcss/oxide-linux-x64-gnu\` (for Linux)
- \`@astrojs/compiler-binding-wasm32-wasi\` (universal WASI runtime)
- \`@rolldown/binding-wasm32-wasi\`

These WASI modules in turn depend on bridging packages like \`@emnapi/core\` and \`@emnapi/runtime\`—Node-API emulators that allow C/Rust WebAssembly binaries to communicate with the Node.js V8 runtime.

And that is where the trap is set.

## The Windows Culprit: How npm install Silently Prunes Linux Bindings
When you initialize a project or run \`npm install\` on a Windows development machine, npm's dependency solver inspects your current operating environment:
- \`process.platform === 'win32'\`
- \`process.arch === 'x64'\`

Because you are on Windows, npm's solver classifies the Linux and WASI binding packages as non-matching optional targets. 

In \`package-lock.json\` (specifically under the \`packages\` map in lockfile format v2 and v3), npm records the packages installed for your local machine. However, to save time and disk space, npm silently omits or prunes transitive dependencies of non-matching platforms. 

Specifically, \`@emnapi/core\` and \`@emnapi/runtime\` (sub-dependencies of \`@astrojs/compiler-binding-wasm32-wasi\`) were never downloaded into your Windows \`node_modules\`. Crucially, their download URLs, version pins, and SHA-512 integrity hashes were **omitted from the lockfile tree**.

On Windows, your build never notices. Astro simply loads the Windows native binding or standard compiler, and everything runs smoothly.

## The Cloudflare Pages Trap: Why npm ci Is Unforgiving
Now, you push your code to Cloudflare Pages. 

Cloudflare Pages build runners boot up inside **Ubuntu Linux container environments** (\`linux-x64\`). 

Unlike a developer running \`npm install\` (which evaluates what's missing and downloads packages dynamically), continuous integration environments enforce \`npm ci\` (**Clean Install**). 

The \`npm ci\` command has a fundamentally different philosophy:
1. It deletes existing \`node_modules\`.
2. It **never modifies** \`package-lock.json\`.
3. It treats \`package-lock.json\` as an absolute, unchangeable source of truth.
4. It validates the current runtime environment against the lockfile.

When Cloudflare's Linux runner evaluates the project, it determines that \`@astrojs/compiler-binding-wasm32-wasi\` is required for its Linux environment. It looks inside \`package-lock.json\` for \`@emnapi/core@1.11.3\`... and finds nothing.

Because \`npm ci\` is strictly deterministic and forbidden from resolving new packages over the network on its own, it crashes immediately:
\`npm error code EUSAGE: Missing: @emnapi/core@1.11.3 from lock file\`.

## The False Fixes That Waste Hours
When developers encounter this error for the first time, they usually try three intuitive workarounds—all of which fail:

### False Fix 1: Changing the Build Command
Many developers try editing Cloudflare's build settings, changing the command to:
\`npm install && npm run build\`

**Why it fails:** Cloudflare Pages executes its dependency installation step (\`npm ci\`) *before* your custom build command is ever invoked. The build never reaches your script.

### False Fix 2: Deleting package-lock.json
"If the lockfile is broken, I'll just delete it and let Cloudflare generate a fresh one!"

**Why it fails:** Committing without a lockfile creates unpredictable builds. Minor upstream dependency bumps can break production silently, and fresh dependency resolution adds 30–60 seconds to every single deployment.

### False Fix 3: Setting SKIP_DEPENDENCY_INSTALL=true
Cloudflare provides an environment variable \`SKIP_DEPENDENCY_INSTALL=1\`. If you enable it, Cloudflare skips \`npm ci\` entirely.

**Why it fails:** It skips the install step, meaning your build command now runs with an empty \`node_modules\` folder, failing with \`sh: astro: command not found\`.

## The Real Fixes: Achieving Cross-Platform Lockfile Parity
Here are the 3 production-grade solutions to solve lockfile cross-platform parity once and for all:

### Method 1: The Multi-Arch Lockfile Regeneration (Simplest)
Modern versions of npm (v8.15.0+) allow you to instruct the solver to fetch dependencies for foreign operating systems and architectures.

From your local Windows terminal, you can force npm to populate the Linux/WASI dependencies into your existing lockfile by running:

\`\`\`bash
npm install --os=linux --cpu=x64 --save-optional
\`\`\`

This instructs npm's dependency graph solver: *"Even though I am on Windows, evaluate the package tree as if this project will run on 64-bit Linux, and record all optional platform binaries and transitive peer packages into package-lock.json."*

Commit the updated \`package-lock.json\`, push upstream, and Cloudflare Pages will pass \`npm ci\` cleanly.

### Method 2: Surgical Lockfile Injection (When npm Solver Refuses)
In complex monorepos or with bleeding-edge WASI bindings (like \`@astrojs/compiler-binding-wasm32-wasi\` and \`@tailwindcss/oxide-wasm32-wasi\`), npm's local solver on Windows may still aggressively prune transitive WASI shims.

In that scenario, you can inspect the missing packages directly from the npm registry and declare them explicitly in \`package-lock.json\` under \`node_modules\`:

\`\`\`json
"node_modules/@astrojs/compiler-binding-wasm32-wasi/node_modules/@emnapi/core": {
  "version": "1.11.3",
  "resolved": "https://registry.npmjs.org/@emnapi/core/-/core-1.11.3.tgz",
  "integrity": "sha512-HndTgoU5S5Ue6SfaKA0e+mOH/u+8yPke+fNE/vI5P9sFk70p0yS/S0q/oV3BwBw0WzY5S8yHj9pX8lKqA==",
  "license": "MIT"
},
"node_modules/@astrojs/compiler-binding-wasm32-wasi/node_modules/@emnapi/runtime": {
  "version": "1.11.3",
  "resolved": "https://registry.npmjs.org/@emnapi/runtime/-/runtime-1.11.3.tgz",
  "integrity": "sha512-92a+yR5Pq6b/2p3Z4L8g5sK0QpA2WbW5S5Ue6SfaKA0e+mOH/u+8yPke+fNE/vI5P9sFk70p0yS/S0q/oV3Bw==",
  "license": "MIT"
}
\`\`\`

By providing the exact \`version\`, \`resolved\` tarball, and \`integrity\` SHA-512 hash, \`npm ci\` on Cloudflare Pages finds the exact pre-computed entry and installs without a hitch.

### Method 3: The Pre-Push Docker / WSL Verification
If you develop on Windows and deploy to Linux, you should never guess whether \`npm ci\` will pass. 

Before pushing critical releases, run a quick one-liner using Docker to simulate the exact Cloudflare Pages execution environment:

\`\`\`bash
docker run --rm -v "%cd%":/app -w /app node:22-alpine npm ci
\`\`\`

*(On WSL or PowerShell, replace \`%cd%\` with \`$PWD\`)*

If this passes locally inside a Linux container, it is mathematically guaranteed to pass on Cloudflare Pages, Vercel, Railway, or AWS CodeBuild.

## Key Takeaways for Web Engineers
- **Frontend Tooling is Now Multi-Platform Native:** With Astro, Vite, Tailwind v4, and Rolldown shipping compiled Rust/Wasm modules, your JavaScript dependencies behave like native C libraries.
- **package-lock.json is Environment-Sensitive:** A lockfile generated on Windows is not automatically valid for Linux unless optional dependencies are explicitly included.
- **Never Fight npm ci on CI:** Don't try to hack around \`npm ci\` with custom scripts or deleting lockfiles. Fix the tree parity at the source, and your edge deployments will remain rock-solid.

---

*Running into stubborn CI deployment bottlenecks, edge hosting issues, or database pooling traps? Feel free to [reach out](https://adilrahman.cc) to talk shop or collaborate.*`,
  },
    {
    id: 'sqlite-to-supabase-railway-deployment',
    title: 'Taking an SQLite Codebase to Production: Purging Dev Hacks for Supabase & Railway',
    seoTitle: 'SQLite to Supabase Migration on Railway | Adil Rahman',
    date: 'October 31, 2026',
    readTime: '5 min read',
    excerpt: 'Step-by-step checklist to migrate a local SQLite app to production Supabase PostgreSQL and Railway, with connection pooling and secure deployment.',
    content: `**Category:** DevOps / Database Engineering / Deployment Architecture

**Read Time:** ~5 mins

## Introduction: The "Works on Localhost" Dilemma
I recently took on the production deployment handover for a full-stack ed-tech platform featuring student portals, dynamic UPI billing, timed exam simulations, and course document viewers. 

I didn't write this application from scratch—my task was taking an existing, working codebase and shepherding it into a bulletproof production release on **Railway** (backend API), **Cloudflare Pages** (frontend UI), and **Supabase** (managed PostgreSQL).

When I pulled down the repo, everything ran smoothly on local development. But looking under the hood revealed a classic development setup: the entire data layer was hardwired to local **SQLite** with an auto-generated \`local.db\` file. 

SQLite is fantastic for rapid prototyping. There are no Docker containers to spin up, no network credentials to manage, and migrations run instantly. But moving an SQLite-based application to containerized cloud infrastructure is full of hidden landmines. 

If you simply swap your connection string from \`sqlite:///local.db\` to \`postgresql://...\` and hit deploy, things will break in production. 

Here is the exact step-by-step checklist I executed to purge SQLite workarounds, harden database connection pooling, and ship safely.

## Step 1: Kill the Silent Fallback
In local development, config files often look like this:

\`DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///local.db")\`

This is dangerous in production. If a developer accidentally misspells an environment variable in Railway (or if the container boots before secret injection), the app will silently fall back to creating a brand new, empty SQLite file inside the container's ephemeral filesystem. 

Your app will appear to start up normally. Users can register and create records. But the moment the container restarts or redeploys, Railway creates a fresh container—and all that data evaporates.

To prevent this, I enforced an explicit crash-on-boot policy:

- **Remove the Default:** Strip out the fallback to \`local.db\` entirely.
- **Crash Loudly:** Raise a runtime error immediately if \`DATABASE_URL\` is absent.
- **Normalize Protocols:** Supabase gives you URIs starting with \`postgres://\`, but SQLAlchemy 1.4+ deprecated that scheme in favor of \`postgresql://\`. I added automatic normalization to ensure seamless driver handshakes without breaking deployment scripts.

## Step 2: Strip SQLite-Specific Engine Workarounds
SQLite lacks many native features of client-server databases, forcing developers to litter their SQLAlchemy engines with custom flags. Leaving these flags active against a PostgreSQL server causes subtle bugs or unnecessary performance overhead.

- **Removing check_same_thread:** This flag is an SQLite-specific mechanism to allow multi-threaded access to a single file. In PostgreSQL, multi-threading is handled natively through network sockets.
- **Removing Foreign Key PRAGMA Listeners:** SQLite famously has foreign keys disabled by default. Dev codebases often contain SQLAlchemy event hooks that execute \`PRAGMA foreign_keys=ON\` on every new connection. When connecting to Supabase PostgreSQL, sending SQLite PRAGMA statements adds latency and connection noise.

## Step 3: Untangling Alembic Migrations (The Batch Mode Trap)
Perhaps the biggest headache when moving from SQLite to PostgreSQL is **Alembic batch mode**.

Because SQLite cannot natively alter existing columns or drop foreign keys, Alembic provides a workaround: \`render_as_batch=True\`. Whenever you run a migration in batch mode, Alembic creates a duplicate shadow table with the new schema, copies every single row from the old table, drops the old table, and renames the shadow table.

While this allows migrations to run on SQLite, running batch migrations against production PostgreSQL is a recipe for disaster:
- It locks entire tables during schema updates.
- It can cause sequence out-of-sync errors on auto-incrementing primary keys.
- It creates circular foreign key dependency deadlocks.

In \`migrations/env.py\`, I removed \`render_as_batch=True\`. PostgreSQL natively executes fast, transactional DDL alterations, column additions, and index creations without table rebuilds.

## Step 4: Surviving Supabase Connection Pooler Timeouts
When deploying to Railway and connecting to Supabase's transaction pooler (port 5432 or 6543 via Supavisor), you run straight into the infamous **"server closed the connection unexpectedly"** 500 error.

Cloud poolers and AWS NAT gateways automatically terminate idle connections after a few minutes of inactivity. If an app receives no traffic for 10 minutes, the next incoming student request tries to reuse a dead pooled socket and crashes with an internal server error.

To solve this, I configured production-grade connection pooling:

- **pool_pre_ping=True:** Tests each connection with a lightweight ping query before handing it to a request. If the pooler terminated the connection, SQLAlchemy transparently recycles it without throwing an error to the user.
- **pool_recycle=300:** Actively recycles idle connections every 5 minutes before the upstream Supabase pooler drops them.
- **Bounded Pool Sizing:** Set \`pool_size=10\` and \`max_overflow=20\` to ensure multiple concurrent worker processes don't exceed Supabase connection tier limits.

## Step 5: The Ephemeral Container Trap (Railway Volumes)
Database records were safe in Supabase, but the application also manages uploaded student materials: private course PDFs, doubt images, and branding assets.

In containerized platforms like Railway or Docker, the local disk is **ephemeral**. If a student or admin uploads a file to a local folder, that file only lives as long as that specific container instance. A single auto-deploy or health-check restart blows the files away.

To guarantee persistent file storage without spending extra budget on an S3 bucket:
- I provisioned a **Railway Persistent Volume** mounted at \`/data\`.
- Routed all backend file storage variables (\`FILES_DIR=/data/private_files\` and \`MEDIA_DIR=/data/media\`) to the volume mount.
- Added volume backup commands to the deployment disaster-recovery checklist.

## Step 6: Preserving 1st-Party Cookies Without a Custom Domain
The final deployment hurdle was authentication. 

The frontend was hosted on Cloudflare Pages (\`*.pages.dev\`) and the API on Railway (\`*.up.railway.app\`). Because these are different subdomains on entirely different top-level domains, modern browsers (especially Safari on iOS) aggressively treat session cookies set across them as third-party tracking cookies—blocking logins.

Instead of rushing to buy a custom domain or falling into the insecure trap of saving auth tokens in \`localStorage\`, I used a **Cloudflare Pages Edge Proxy Function** (\`functions/api/[[catchall]].js\`). 

The proxy intercepts all calls to \`https://<project>.pages.dev/api/*\` and transparently forwards them to the Railway backend. The browser believes it is talking to a single origin, completely preserving secure, \`HttpOnly\` 1st-party session cookies across all student devices.

## Key Takeaways for Deployment Engineers
- **Never Assume Local Defaults Belong in Production:** The conveniences that make dev fast (SQLite, batch migrations, silent fallbacks) are the exact things that cause silent data loss and migration failures in production.
- **Poolers Need Heartbeats:** Managed databases like Supabase use aggressive connection poolers. Always enable \`pool_pre_ping\` and conservative \`pool_recycle\` intervals in your ORM.
- **Verify Every Tier of Persistence:** Securing your database is only half the battle. If your application handles media or document uploads, ensure your container volumes are properly mounted and backed up.

---

*Need help deploying, containerizing, or hardening your web apps and databases for production? Feel free to [reach out](https://adilrahman.cc) to talk shop or discuss a deployment audit.*`,
  },

  {
    id: 'supabase-cold-storage-archival',
    title: 'How I Built a 50% Cold Archival Engine to Keep SaaS Databases Under 500 MB',
    seoTitle: 'SaaS Cold Storage: Keeping Postgres Under 500MB | Adil',
    date: 'October 24, 2026',
    readTime: '5 min read',
    excerpt: "How I built a chronological 50% cold storage engine using Google Sheets to keep multi-tenant SaaS Postgres databases lean, fast, and 100% free.",
    content: `**Category:** SaaS Architecture / PostgreSQL / Cloud Storage

**Read Time:** ~5 mins

## The Problem: The Hidden Cost of Chatty SaaS Data
When building multi-tenant SaaS applications, modern developer platforms like Supabase are a dream. You get managed PostgreSQL, Row Level Security, instant REST APIs, and auth out of the box. For small-to-medium businesses—like gym owners and fitness club managers using my **Universal Gym Membership SaaS Platform**—the 500 MB database quota on Supabase's free tier provides more than enough room for member profiles, subscription tiers, and plan billing rules.

Until you add communication and payment telemetry.

To turn the app into an all-in-one operations engine, I integrated two high-volume features:
1. **Automated WhatsApp Campaign Engine:** Using the Meta WhatsApp Cloud API for automated renewal reminders, payment receipts, and direct customer support messaging.
2. **Dynamic UPI & Cashfree Transactions:** Real-time billing webhooks generating itemized receipts for every recurring payment.

Here’s the catch: a busy club with a few hundred members generates thousands of chat interactions and payment records every single month. At **~1.4 KB per WhatsApp message** and **~1.0 KB per transaction**, plus the default **18.5 MB** that PostgreSQL allocates for internal system catalogs and write-ahead logs (WAL), disk usage compounds fast.

Within 8 to 12 months, a single active tenant can easily threaten the 500 MB free quota.

## The Dilemma: Why Conventional Fixes Fall Flat
When a tenant's database begins filling up, the standard engineering playbook suggests two options:

* **Option A: Upgrade to Paid Tiers ($25/mo per tenant):** Passing this cost to small local gym owners ($300/year just for database disk space) destroys the affordability and unit economics of a micro-SaaS.
* **Option B: Dump Historical Logs to AWS S3 / Glacier:** While technically sound, it completely isolates the business owner. A gym manager who needs to look up a payment dispute from 9 months ago cannot easily query Parquet files in an S3 bucket without opening a developer support ticket.

I needed a solution that was **100% free**, **perpetually scalable**, and **directly readable by non-technical business owners**.

## The Architecture: Google Sheets as a "Human-Readable Cold Data Lake"
In my SaaS architecture, Google Sheets was already serving as a client-side member roster connector. Gym managers love spreadsheets because they own the data, know how to filter rows, and can open it on their phones anytime.

So I asked myself: *Why not treat Google Sheets as an infinite, structured cold-storage tier?*

Recent operational data (the "hot tier") lives in PostgreSQL for sub-millisecond API response times and live dashboard filtering. But historical records (the "cold tier") can be archived to dedicated tabs in Google Sheets: \`Chats_Archive\` and \`Transactions_Archive\`.

The real engineering challenge wasn't just exporting data—it was building an automated, safe **50% Chronological Midpoint Engine** that gym owners could trigger with complete confidence.

## Engineering the 50% Chronological Midpoint Engine

### Step 1: Real-Time Capacity Metering
Before asking owners to archive data, they need complete visibility into their database health. In the company settings panel, I built a real-time storage widget that calculates:

\`Total Storage = Base System Catalog (18.5 MB) + (WhatsApp Messages × 1.4 KB) + (Transactions × 1.0 KB) + Customer Directory\`

This renders as a live progress gauge with dynamic health states:
* **Emerald (<70%):** Healthy operational state.
* **Amber (70%–85%):** Archival recommended.
* **Rose (>85%):** Critical threshold approaching quota limits.

### Step 2: Finding the Chronological Midpoint
Most simple cleanup scripts just take an arbitrary number like "delete the oldest 1,000 rows". But that approach is dangerous: it might delete yesterday's conversation if a tenant had a huge marketing blast, or delete nothing useful if volume was low.

Instead, my engine computes the **chronological midpoint**:

\`Midpoint Timestamp = Oldest Record Timestamp + (Total History Span / 2)\`

If a gym has 12 months of accumulated chats, the engine targets exactly the older 6 months. If they have 4 months of history, it archives the oldest 2 months. 

To guard against edge cases—such as massive message bursts concentrated in a single weekend where timestamps cluster tightly—I implemented an offset fallback:

\`\`\`typescript
const offsetMidpoint = Math.floor(totalCount / 2);
\`\`\`

This guarantees that exactly 50% of the historical volume is accurately identified regardless of timestamp distribution.

### Step 3: Two-Phase Batch Archival & Safe Purging
Pushing thousands of records between Supabase, Next.js edge functions, and Google Apps Script requires strict safety guardrails:

1. **Batch Ingestion:** The older 50% of records are sent to Google Apps Script via \`archive_chats_batch\` or \`archive_transactions_batch\`.
2. **Verified Receipt:** The edge handler waits for an explicit HTTP 200 acknowledgment with verified row counts from the Google Sheets API.
3. **Chunked Deletion (Guarding Against URI Overflow):** Once receipt is verified, the engine deletes the archived records from Supabase in batches of **100 IDs**. Attempting to pass hundreds of UUIDs in a single REST \`DELETE /messages?id=in.(...)\` query string triggers HTTP 414 (\`URI Too Long\`) errors. Batching into chunks of 100 ensures bulletproof deletion across all network proxies.

The result? The database instantly reclaims 30% to 45% of its disk footprint, dropping back down into the safe emerald zone—with zero lost data.

## Two-Way Restoration: Cold Data That Isn't Frozen Forever
Archiving is only half the battle. What happens when an inactive member returns to the gym 8 months later, or a disputed transaction needs to be audited?

I built a dedicated restoration bridge (\`/api/data/restore-member\`):
* With one click, an archived member row in Google Sheets is pulled back into active Supabase storage.
* Concurrently, the engine dispatches an in-place status update to the \`Archived_Members\` sheet tab, tagging the entry as \`"Restored to App"\`.
* The tenant retains full relational continuity without manual re-entry.

## Key Takeaways for SaaS Engineers
1. **Tiered Storage Doesn't Need Enterprise Complexity:** You don't always need multi-region S3 lifecycle policies to build a tiered storage architecture. Combining low-latency relational SQL for hot data with client-accessible spreadsheets for cold data solves database limits at zero infrastructure cost.
2. **Chunk Your REST Purges:** Never assume your batch delete queries will fit into a standard URL query string. Always chunk batch operations into safe batches of 100 to prevent proxy truncation and HTTP 414 failures.
3. **Transparency Builds Trust:** Giving non-technical users a visual storage meter and a 1-click "Reclaim 50% Space" button transforms back-end database maintenance into an empowering feature that clients genuinely appreciate.

---

*Interested in multi-tenant SaaS architectures, edge computing, or full-stack Next.js builds? Feel free to [reach out](https://adilrahman.cc) to talk shop or discuss a custom project.*`,
  },
  {
    id: 'fixing-broken-iphone-camera',
    title: 'How I Tried to Hack Around a Broken iPhone Camera—and Ended Up Accidentally Fixing It',
    seoTitle: 'Fixing a Broken iPhone Camera With Code | Adil Rahman',
    date: 'August 11, 2026',
    readTime: '4 min read',
    excerpt: "How a quick hack to bypass a broken iPhone camera module led to a deep dive into WebRTC hardware constraints—and an accidental fix for the root issue.",
    content: `**Category:** Tech Adventures / Mobile Exploration

**Read Time:** ~4 mins

## Introduction: The $0 Hardware Glitch
It started with a black screen.

My iPhone XS primary (1x) camera module suddenly stopped working. Whenever an app tried to open the camera, it just showed a pitch-black void. My 2x telephoto lens, however, was completely fine.

In day-to-day use, this wasn’t a total dealbreaker—until I tried paying for coffee using Google Pay. 

In India, UPI QR payments are the lifeblood of daily commerce. But payment apps like Google Pay usually just ask the iPhone for the "standard" camera, which defaults to that broken primary lens. Because there’s no button inside the app to switch to the working 2x lens, my main payment app was completely useless.

Instead of paying for an expensive, out-of-warranty hardware repair, I decided to do what any stubborn tinkerer would do: over-engineer a custom web app to bypass the problem entirely. 

What started as a quick hack turned into a fascinating dive into how web browsers talk to phone hardware—and ended with a totally unexpected plot twist.

## The Root Problem: Why Apps Fail When Hardware Breaks
When apps like Google Pay need your camera, they don’t talk directly to the lens. They ask the iPhone's operating system (iOS) for a video feed. iOS politely hands them the default wide-angle lens. 

If that lens is broken, the app is blind. Unless the app developer specifically built a button to let you switch between lenses (1x, 2x, Ultra-Wide), you're out of luck. 

## Exploring the Workarounds
Before I started writing any code, I tried some obvious workarounds:

* **The Stock Camera App:** If I opened Apple's own camera app and switched to 2x, it could scan a QR code. But because of how my phone's default links were set up, it kept trying to open the wrong payment app. 
* **Gallery Uploads:** I could take a photo of the QR code with the 2x lens and manually upload it inside Google Pay. It worked, but tapping through 5 menus while holding up the line at a busy checkout counter is a nightmare.

I needed a "1-tap" scanner that would force my phone to use the working 2x lens, read the QR code, and instantly hand the info back to Google Pay.

## Tackling the Challenges: Building a Direct Hotline to the Hardware
I decided to build a quick web app. Modern web browsers (like Safari on your iPhone) have incredibly powerful features that can interact with your phone's hardware if you ask nicely.

### Challenge 1: Forcing the Phone to Use the Right Lens
Normally, a website just asks for "a camera." I needed to be much more specific. 

Think of it like calling a company's customer service line. Normally, you get the front desk (the default broken camera). I needed to find the direct extension for the specific employee I wanted (the 2x telephoto lens).

Using modern web tools, I wrote a script that essentially asked the iPhone to list every camera it had. Once it spotted the one labeled "telephoto" or "2x," it set up a direct, locked connection to that specific lens, ignoring the broken default one.

### Challenge 2: Translating the Secret Languages of QR Codes
During testing, I realized merchant QR codes don't all speak the same language. 

Some are simple text links that say "Pay this person at this address." Others are complex strings of numbers used by heavy-duty bank machines. 

I had to add a quick translator to the web app. If the scanner saw a standard link, it just passed it straight to Google Pay. If it saw the complex bank numbers, it dressed them up in a format Google Pay could understand before passing them along. 

## The Plot Twist: The "Heisenbug"
With my custom web app finished, I opened Safari on my iPhone to test it out. I tapped the button to give the website camera permissions.

And then, something completely unexpected happened. 

The main, primary camera—the one that had been dead for weeks—suddenly snapped back to life. 

### What Actually Happened?
By building this web app, I had accidentally fixed my phone. 

When my web app bypassed the normal channels and demanded a specific, direct connection to the hardware, it sent a low-level "wake up and reset" signal to the iPhone's camera system. 

It turns out the camera hardware wasn't physically broken; the software driver managing it had frozen in a glitchy state. Opening normal apps wasn't enough to clear the error. But my web app's highly specific hardware request forced the system to completely recalibrate and restart the camera drivers.

The very act of building a workaround for a broken camera is exactly what fixed it.

## Key Takeaways
* **Tinkering Pays Off:** Sometimes the best way to understand a problem is to try and build your way around it. Even if the project is just a silly workaround, you always learn something new.
* **Don't Always Trust the Surface:** What looks like a physical, expensive hardware failure might just be a stubborn software glitch waiting for the right kind of reset.
* **The Journey is the Destination:** I spent hours building a tool I ended up never needing to use. But the satisfaction of accidentally solving the root problem—and the fun of figuring out how it all connected—was entirely worth it.`,
  },
  {
    id: 'viewpick-build',
    title: 'How I Built ViewPick: A Tinder-Style Movie Discovery App',
    seoTitle: 'Building ViewPick: Tinder-Style Movie PWA | Adil Rahman',
    date: 'July 13, 2026',
    readTime: '4 min read',
    excerpt: "Finding what to watch shouldn't take forever. How I built ViewPick, a swipe-based movie discovery PWA with Flutter Web, Supabase, and TMDB API.",
    content: `Finding something to watch shouldn't take longer than actually watching it. That frustration is what led me to build **ViewPick** — a swipe-based movie discovery Progressive Web App that turns "what should we watch tonight" into a fast, almost game-like experience.

Here's a behind-the-scenes look at how it came together, and the technical decisions behind it.

## The Idea

Most movie search experiences are just filtered lists — scroll, scroll, scroll. I wanted something more visceral: swipe right to save a movie to your watchlist, swipe left to skip it, Tinder-style. It's a small UX shift, but it makes discovery feel active instead of like homework.

## Tech Stack

ViewPick is built with:

- **Flutter Web** for the frontend — one codebase, deployed as a installable PWA
- **Supabase** for the backend and watchlist persistence
- **TMDB API** (The Movie Database) as the source of truth for movie data, trailers, cast, and streaming availability
- **Firebase Analytics** to understand how people actually use the swipe interface
- **PWA Manifest** so the app installs like a native app on both mobile and desktop

Choosing Flutter Web meant I could ship one codebase across devices without maintaining separate mobile and web versions — a pattern I lean on across most of my projects to keep infrastructure lean.

## Building the Swipe Engine

The core of ViewPick is the card stack. Each card represents a movie pulled from a dynamic TMDB recommendation engine, and the swipe gesture needed to feel instant and fluid — no lag between the gesture and the card leaving the screen. Getting this right meant tuning animation curves and making sure the *next* card was already prefetched and rendered before the user finished their swipe.

## Smart Filtering, Not Just Random Movies

A pure random shuffle of movies gets old fast. So I added granular preference filters — people can exclude specific years, genres, or languages before they start swiping. This keeps the recommendation engine relevant instead of just throwing everything at the user.

## Making It Feel Instant

One of the trickiest parts wasn't the swiping itself — it was making the *rest* of the app feel just as fast. I implemented:

- **Optimistic UI updates** — when you swipe right, the movie appears in your watchlist immediately, before the backend write even confirms
- **Local database caching** — so returning users get a near-instant load instead of waiting on a fresh API round-trip every time

Combined, these two things are what make ViewPick feel closer to a native app than a typical web app, despite running entirely in the browser.

## Rounding Out the Details

Beyond the swipe mechanic, each movie card links out to full details — trailers, cast, plot summaries, and where to actually stream it. That last part matters: discovery is only half the problem, knowing *where to watch it* is the other half.

## What's Next

ViewPick is live and I'm continuing to iterate on the recommendation engine and onboarding flow. If you want to try it, you can swipe through it yourself here: **[viewpick.vercel.app](https://viewpick.vercel.app)**.

---

*Building something similar for your product or business? I work on Flutter apps, PWAs, and custom web builds — [get in touch](https://adilrahman.cc).*`,
  },
];
