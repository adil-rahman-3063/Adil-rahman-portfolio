export const allBlogs = [
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
