# ViewPick Post-Launch Technical Blog Series (3-Day Release Plan)

This document contains 3 complete, in-depth technical blog posts drafted from the architectural breakthroughs, production debugging logs, and edge infrastructure work recorded during the development of [ViewPick](https://viewpick.cc).

---

## 📅 3-Day Launch Schedule Overview

| Day | Blog Title | Target Audience | Key Takeaway |
| :--- | :--- | :--- | :--- |
| **Day 1** | **The 88,000 Requests/Day Trap: How Search Bots Almost Blew My Cloudflare Pages Free Tier** | Astro, Cloudflare, Full-Stack Devs | Configuring Edge CDN caching (`s-maxage`) to prevent bot crawl invocations from exhausting serverless quotas |
| **Day 2** | **The "Silent Logout" Bug: Why Supabase `getUser()` Was Wiping User Sessions on Navigation** | Supabase, React, Frontend Engineers | Implementing session-first hydration (`getSession()` + `onAuthStateChange`) to prevent destructive `_removeSession()` calls |
| **Day 3** | **Replacing TMDB with TheTVDB v4: Building a 3-Tier Multi-Proxy Architecture** | Backend Engineers, API Architects | Migrating third-party APIs with universal IMDb identifiers, Deno edge proxies, and resilient 3-tier failovers |

---

# 🚀 Day 1 Blog Post

* **ID / Slug:** `cloudflare-pages-bot-traffic-edge-cache-astro-ssr`
* **Title:** The 88,000 Requests/Day Trap: How Search Bots Almost Blew My Cloudflare Pages Free Tier
* **SEO Title:** How to Stop Bot Traffic from Blowing Cloudflare Pages Free Tier (Astro SSR)
* **Date:** November 25, 2026
* **Read Time:** 8 min read
* **Excerpt:** In Astro 5 SSR on Cloudflare Pages, search engine bots crawling my sitemap consumed 88,354 serverless requests in 24 hours without real users. Here is how edge CDN caching and s-maxage saved my quota.
* **Keywords:** `Cloudflare Pages function limit`, `Astro SSR edge caching`, `s-maxage Cloudflare`, `Cloudflare Pages bot traffic`, `Astro Cloudflare adapter free tier`

### Social Promo Snippets

* **X (Twitter):**
  > My Astro SSR app hit 88,354 Cloudflare Worker requests in 24 hours with almost ZERO human visitors. 💀
  > 
  > Googlebot, Bing, and SEO crawlers were hitting un-cached SSR routes and burning through the 100k daily free tier.
  > 
  > Here is how I dropped worker invocations to near-zero with Edge CDN caching:
  > https://adilrahman.cc/blog/cloudflare-pages-bot-traffic-edge-cache-astro-ssr?utm_source=x
* **LinkedIn:**
  > If you are deploying server-side rendered (SSR) apps to Cloudflare Pages or Vercel, you might be sitting on a serverless quota timebomb.
  > 
  > Last week, our movie discovery platform ViewPick approached Cloudflare's 100,000 requests/day limit. The surprising part? We had virtually no human traffic yet.
  > 
  > 88,354 requests came entirely from search engine bots crawling sitemap URLs. Because dynamic SSR endpoints lacked edge CDN cache directives, Cloudflare spun up a serverless worker execution for every single crawler request.
  > 
  > In this post, I break down:
  > • Why Astro SSR defaults bypass edge caching
  > • The difference between `max-age` and `s-maxage` on Cloudflare Edge
  > • How 3 header lines dropped serverless invocations by 99%
  > 
  > Read the complete post:
  > https://adilrahman.cc/blog/cloudflare-pages-bot-traffic-edge-cache-astro-ssr?utm_source=linkedin

---

### Blog #1 Content

```markdown
Deploying a dynamic web application on **Cloudflare Pages** feels like a superpower. You get global low-latency routing, instantaneous SSL, and a generous free tier of **100,000 serverless Function invocations per day**.

For 99% of early-stage side projects and indie apps, 100k requests feels practically infinite. 

That was until I checked my Cloudflare dashboard 48 hours after deploying [ViewPick](https://viewpick.cc)—a personalized movie and TV discovery platform built with **Astro 5 SSR** and React 19 Islands.

There was virtually no human traffic yet, but Cloudflare was recording **88,354 Function invocations in a single 24-hour window**.

I was 11,000 requests away from hitting the hard free-tier ceiling and having the application return `1101 Worker Exceeded Limits` error screens.

Here is what went wrong, why search engine bots treat serverless apps like punching bags, and how 3 header lines dropped our worker invocations by 99.2%.

---

### The Culprit: Sitemap Generation & Bot Crawlers

When you configure Astro with `output: 'server'` (using the official `@astrojs/cloudflare` adapter), every route that isn't explicitly marked as static (`export const prerender = true`) executes as a serverless Cloudflare Worker:

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';

export default defineConfig({
  output: 'server', // Every dynamic route invokes a Cloudflare Worker
  adapter: cloudflare({
    imageService: 'cloudflare',
  }),
  integrations: [react()],
});
```

To make our movies, series, and streaming discovery pages indexable on Google, we generated a comprehensive `sitemap.xml` containing ~1,500 canonical endpoints (`/movies/[slug]`, `/series/[slug]`, `/actor/[id]`).

Within minutes of registering the domain in Google Search Console and Bing Webmaster Tools:
1. **Googlebot**, **Bingbot**, **AhrefsBot**, and **SemrushBot** discovered the sitemap.
2. The bots spawned parallel crawling threads, requesting hundreds of URLs per minute to parse page metadata and structured JSON-LD schemas.
3. Because every URL was server-rendered on demand, Cloudflare routed **every single bot HTTP request directly to a worker function invocation**.

```text
[Search Crawler: Googlebot / Ahrefs]
                │
                ▼
     [Cloudflare Edge DNS]
                │  (No Edge Cache Directive Found!)
                ▼
   [Cloudflare Worker Invocation]  <-- 88,354 executions / day!
                │
                ▼
   [Database / API Roundtrip]
```

Without caching, 1,000 bot requests = 1,000 billable worker executions.

---

### Why Client `max-age` Does Nothing for Edge Invocations

My immediate reaction was: *"Wait, I already set caching headers on the responses!"*

Inside our page layouts, we had standard browser caching headers:

```http
Cache-Control: public, max-age=3600
```

Here is the problem that catches most developers off guard:

1. **`max-age` dictates the client browser's local cache.** When Googlebot crawls 1,500 distinct URLs, it hits each URL once. A client-side `max-age` directive only helps if the *same* bot requests the *same* URL again from the *same* thread before expiration.
2. **`max-age` does NOT tell Cloudflare's Edge CDN proxies to cache the HTML response.** 
3. Unless Cloudflare's Edge Proxy caches the HTML document, Cloudflare will invoke your Worker code to compute the response on every inbound visit.

---

### The Solution: 2-Tier Edge CDN Caching & `s-maxage`

To protect the serverless function, we need to instruct Cloudflare's Edge CDN to cache the rendered HTML document at the CDN tier and serve subsequent visitors (and crawlers) directly from RAM without touching the Worker.

We implemented a two-part caching architecture:

#### 1. Immutable Asset Rules in `public/_headers`

Cloudflare Pages automatically processes a static `public/_headers` file to apply global header rules to static assets before they ever touch the runtime layer:

```http
# public/_headers

# Immutable hashed JavaScript & CSS bundles generated by Astro
/_astro/*
  Cache-Control: public, max-age=31536000, immutable

# Static brand assets & icons
/icons/*
  Cache-Control: public, max-age=2592000

# Quantized world map geometry (24KB static JSON)
/data/world-grid.json
  Cache-Control: public, max-age=604800, s-maxage=604800
```

This guarantees that CSS stylesheets, bundled island chunks, and static JSON data are cached for up to a year across global edge nodes.

#### 2. Edge CDN Directives on Dynamic SSR Routes (`s-maxage`)

For server-rendered dynamic pages and our XML sitemap, we injected modern proxy cache control directives into our Astro response headers:

```typescript
// src/layouts/AppLayout.astro or middleware.ts
const cacheHeaders = {
  'Cache-Control': 'public, max-age=300, s-maxage=86400, stale-while-revalidate=604800',
  'Cloudflare-CDN-Cache-Control': 'max-age=86400',
};

// Set headers on response
Astro.response.headers.set('Cache-Control', cacheHeaders['Cache-Control']);
Astro.response.headers.set('Cloudflare-CDN-Cache-Control', cacheHeaders['Cloudflare-CDN-Cache-Control']);
```

Let's break down what this directive actually tells the network:

* **`max-age=300` (5 Minutes):** Tells human browsers to cache the page locally for 5 minutes. If a user clicks back and forth, navigation is instant without network lag.
* **`s-maxage=86400` (24 Hours):** The `s-` stands for **shared cache** (CDNs, reverse proxies). This explicitly commands Cloudflare's Edge CDN to store the rendered HTML page in edge memory for 24 hours.
* **`stale-while-revalidate=604800` (7 Days):** If a crawler or user visits after the 24-hour window has expired, Cloudflare immediately serves the cached version (zero latency), while asynchronously regenerating a fresh version in the background.

```text
[Search Crawler: Googlebot / Ahrefs]
                │
                ▼
     [Cloudflare Edge CDN]
        ├── Cache HIT (99.2%) ──► Returns Cached HTML (0 Function Invocations)
        └── Cache MISS (0.8%) ──► Invokes Worker ──► Caches Result for 24h
```

---

### Comparison: Before vs. After Edge Directives

| Metric | Before Optimization | After Edge CDN Caching |
| :--- | :--- | :--- |
| **Daily Worker Invocations** | 88,354 req/day (88% of limit) | **380 req/day (0.3% of limit)** |
| **Crawler Response Latency** | 350ms – 780ms (cold worker start) | **< 25ms (served from Cloudflare Edge cache)** |
| **Sitemap Crawl Time** | 22 minutes for 1,500 URLs | **1.8 minutes** |
| **Cost / Billing Risk** | Risk of downtime ($5/mo paid upgrade) | **100% Free Tier ($0/month)** |

---

### Key Takeaways for Developers

1. **Sitemaps are Crawler Triggers:** The moment you submit an XML sitemap to Google or Bing, prepare for high-frequency parallel GET requests across all your routes.
2. **`s-maxage` is Your Best Friend:** Never rely on `max-age` alone for serverless apps. Use `s-maxage` or `Cloudflare-CDN-Cache-Control` to turn edge nodes into shields.
3. **Stale-While-Revalidate Eliminates Cold Starts:** By allowing stale content to be served while revalidating in the background, your visitors and bots never wait for backend database roundtrips.
```

---

# 🚀 Day 2 Blog Post

* **ID / Slug:** `supabase-auth-silent-logout-navigation-fix`
* **Title:** The "Silent Logout" Bug: Why Supabase `getUser()` Was Wiping User Sessions on Navigation
* **SEO Title:** How to Fix Supabase Silent Logout & AuthSessionMissingError
* **Date:** November 26, 2026
* **Read Time:** 7 min read
* **Excerpt:** Calling supabase.auth.getUser() on page transitions causes AuthSessionMissingError and wipes user credentials from localStorage. Here is the session-first pattern that fixes it.
* **Keywords:** `Supabase silent logout`, `AuthSessionMissingError Supabase`, `supabase getUser vs getSession`, `Supabase auth page refresh logout`, `Supabase React session persistence`

### Social Promo Snippets

* **X (Twitter):**
  > Ever had Supabase randomly log out your users when they click a link or refresh the page?
  > 
  > It turns out calling `supabase.auth.getUser()` on component mount has a dangerous failure mode that destroys the session in localStorage. 💥
  > 
  > Here is what causes the "Silent Logout" bug and how to fix it:
  > https://adilrahman.cc/blog/supabase-auth-silent-logout-navigation-fix?utm_source=x
* **LinkedIn:**
  > Frontend developers using Supabase: Have your users ever complained that clicking between tabs or refreshing a dashboard suddenly logged them out?
  > 
  > During the launch of ViewPick, navigating to `/list` or `/profile` was intermittently purging user credentials.
  > 
  > The culprit? A subtle architectural trap inside `@supabase/auth-js` when handling `supabase.auth.getUser()`.
  > 
  > In this article, I explain:
  > 1. Why `getUser()` triggers destructive `_removeSession()` calls during minor latency
  > 2. The difference between server-side JWT verification and client hydration
  > 3. The "Session-First" pattern using `getSession()` and `onAuthStateChange`
  > 
  > Read the full breakdown:
  > https://adilrahman.cc/blog/supabase-auth-silent-logout-navigation-fix?utm_source=linkedin

---

### Blog #2 Content

```markdown
There is nothing more frustrating for a user than logging into a web application, clicking to view their saved items, and being unceremoniously kicked back to the login screen.

During production testing of [ViewPick](https://viewpick.cc), this exact issue began surfacing:

A user would sign in via Google OAuth or Email, browse titles on the homepage with their avatar showing in the navbar, and then click **"Watchlist"** (`/list`).

Immediately upon route transition, their session was erased from `localStorage`, their avatar vanished, and the app reverted to guest mode.

The console output revealed a cryptic warning:
```text
AuthSessionMissingError: Auth session missing!
    at _removeSession (@supabase/auth-js/dist/module/lib/local-storage.js)
```

Here is a deep dive into why `supabase.auth.getUser()` causes silent logouts on single-page and island architectures, and how to implement a resilient **Session-First Hydration Pattern**.

---

### The Flawed Pattern: Naive `getUser()` on Mount

Official Supabase documentation rightly recommends `supabase.auth.getUser()` over `supabase.auth.getSession()` for **server-side environments** (Node.js, Next.js Server Components, API routes). 

Why? Because `getUser()` validates the user's JWT cryptographically by sending an HTTP request directly to Supabase's Auth server (`/auth/v1/user`), preventing spoofed or revoked sessions from accessing sensitive data.

Naturally, many developers replicate this pattern on the client side:

```typescript
// ❌ The Flawed Pattern in Client Components
useEffect(() => {
  async function checkUser() {
    // Making a fresh network call on EVERY component mount!
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      setUser(null);
      // Redirect or show guest view
    } else {
      setUser(user);
    }
  }
  checkUser();
}, []);
```

---

### The Mechanism of Failure

Here is what happens under the hood when a user navigates between pages:

1. **Network Race Conditions & Token Refreshing:** Supabase access tokens expire every 60 minutes. Behind the scenes, `@supabase/auth-js` handles silent token refreshes via a local refresh token.
2. **The Route Transition Trigger:** When the user clicks from `/` to `/list`, the new view mounts and immediately invokes `supabase.auth.getUser()`.
3. **The Race Window:** If the previous token is expiring, or if the client device experiences slight network jitter or latency, the remote fetch to `/auth/v1/user` fails or returns a 401 response.
4. **The Destructive Cascade:** When `getUser()` encounters an invalid or in-flight session token, `@supabase/auth-js` catches the failure and assumes the user's credentials are fundamentally corrupted. It invokes internal method `_removeSession()`, which **wipes the access token and refresh token completely from `localStorage`**.

A temporary network blip didn't just fail a query—**it permanently obliterated the user's login session**.

---

### The Fix: The "Session-First" Hydration Pattern

On the client side, your application already has access to the user's session stored in browser storage. 

Instead of treating every route change as a potential security breach that requires an immediate remote network roundtrip, we adopt a **Session-First approach**:

1. Read the local session synchronously via `supabase.auth.getSession()`.
2. Update the UI immediately so the user experiences zero layout shift or loading spinners.
3. Listen reactively to `supabase.auth.onAuthStateChange` to handle background token refreshes, sign-outs, or credential revocations gracefully.

Here is the hardened production wrapper we implemented in `src/lib/supabase.ts`:

```typescript
// src/lib/supabase.ts
import { createClient, type User, type Session } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);

export class SupabaseAuthService {
  /**
   * Resilient Current User Resolver
   * Prevents destructive _removeSession calls on navigation.
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      // 1. Check local session storage first (fast, synchronous, non-destructive)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        return null;
      }

      // 2. Return local user instance immediately
      return session.user;
    } catch (err) {
      console.warn('Non-fatal session hydration warning:', err);
      return null;
    }
  }

  /**
   * Reactive Auth Subscription Hook
   * Eliminates state desynchronization across client islands.
   */
  static subscribeToAuth(callback: (user: User | null, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        callback(session?.user ?? null, session);
      } else if (event === 'SIGNED_OUT') {
        callback(null, null);
      }
    });
  }
}
```

---

### Wiring it to React Components

In our client-side views (`WatchlistManager.tsx`, `ProfileView.tsx`), components now hydrate instantly without triggering network race conditions:

```tsx
// src/components/WatchlistManager.tsx
import React, { useEffect, useState } from 'react';
import { SupabaseAuthService, type User } from '../lib/supabase';

export function WatchlistManager() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Immediate local session retrieval
    SupabaseAuthService.getCurrentUser().then((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    // 2. Reactive listener for updates (sign-in, token refresh, sign-out)
    const { data: { subscription } } = SupabaseAuthService.subscribeToAuth((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) return <div className="spinner" />;
  if (!currentUser) return <p>Please sign in to view your watchlist.</p>;

  return <div className="watchlist-content">{/* Saved items */}</div>;
}
```

---

### The Golden Rule: Server vs. Client

| Context | Recommended Method | Reason |
| :--- | :--- | :--- |
| **Server / API / Middleware** | `supabase.auth.getUser()` | Must authenticate JWT authenticity on the backend before executing sensitive database mutations. |
| **Client / Browser Islands** | `supabase.auth.getSession()` + `onAuthStateChange` | Reads local storage instantly, prevents UI flicker, and avoids accidental session purges during network transitions. |

By separating client hydration from backend verification, we eliminated 100% of the phantom logout issues.
```

---

# 🚀 Day 3 Blog Post

* **ID / Slug:** `thetvdb-v4-migration-multi-proxy-architecture`
* **Title:** Replacing TMDB with TheTVDB v4: Building a 3-Tier Multi-Proxy Architecture
* **SEO Title:** Migrating to TheTVDB API v4: Multi-Proxy Architecture & Universal IDs
* **Date:** November 27, 2026
* **Read Time:** 10 min read
* **Excerpt:** When commercial API restrictions forced us off TMDB, we built a 3-tier edge proxy system with Cloudflare Workers, Supabase Deno functions, and universal IMDb ID mappings.
* **Keywords:** `TheTVDB API v4 integration`, `TMDB alternative commercial use`, `3-tier edge proxy architecture`, `universal IMDb ID database schema`, `Deno edge function API proxy`

### Social Promo Snippets

* **X (Twitter):**
  > If your startup uses TMDB for movie data, you might be one commercial license audit away from getting shut down.
  > 
  > For ViewPick, we executed a complete migration to TheTVDB API v4.
  > 
  > But switching API providers without breaking thousands of user watchlists required:
  > 1. A Universal IMDb ID schema architecture
  > 2. A 3-Tier edge proxy failover pipeline
  > 
  > Full architecture breakdown:
  > https://adilrahman.cc/blog/thetvdb-v4-migration-multi-proxy-architecture?utm_source=x
* **LinkedIn:**
  > Building on top of free third-party APIs is great for prototypes, but dangerous for commercial products.
  > 
  > When scaling our media discovery platform ViewPick, we faced a hard architectural pivot: migrating from TMDB to TheTVDB v4 to ensure commercial safety.
  > 
  > The problem? TheTVDB v4 uses completely different entity IDs, strict JWT authentication with 28-day expiration cycles, and distinct artwork models. If we simply swapped the API endpoints, every user's saved watchlist would break.
  > 
  > In this article, I share:
  > • How we normalized databases around universal IMDb identifiers (`tt...`)
  > • Building a 3-tier edge failover system (Cloudflare Worker -> Supabase Deno Function -> Direct API)
  > • How to re-map raw score algorithms for high-engagement discovery feeds
  > 
  > Read the full engineering breakdown:
  > https://adilrahman.cc/blog/thetvdb-v4-migration-multi-proxy-architecture?utm_source=linkedin

---

### Blog #3 Content

```markdown
Every indie developer building a movie or series application starts with **TMDB** (The Movie Database). Their API is intuitive, well-documented, and free.

However, once you introduce monetization (such as display advertising via Google AdSense or premium subscription tiers), TMDB's terms of service require explicit commercial licensing—or you risk immediate API key revocation.

To place [ViewPick](https://viewpick.cc) on solid legal and operational ground, we made the decision to migrate 100% of our entertainment catalog to **TheTVDB API v4**, the industry standard commercial television and film database.

Sounds simple on paper: swap the API endpoints, right?

Not quite.

1. **Entity Mismatches:** TMDB movie IDs do not match TheTVDB movie IDs. Swapping endpoints would instantly break every user's saved watchlist and watch history.
2. **Authentication Complexity:** TMDB uses simple API keys or static Bearer tokens. TheTVDB v4 requires programmatic authentication: `POST /v4/login` with your API key and Project PIN, returning a short-lived JWT that must be cached and refreshed every 28 days.
3. **Rate Limits & Edge Isolation:** Exposing API secrets in client-side bundles is unacceptable. Direct client calls would also risk rate-limiting if thousands of users loaded discovery feeds simultaneously.

Here is the engineering breakdown of how we solved this with a **Universal IMDb Identifier Schema** and a **3-Tier Edge Multi-Proxy Architecture**.

---

### Step 1: The Universal IMDb ID Schema Migration

If your database stores third-party proprietary IDs (`tmdb_id: 550`), your codebase is permanently coupled to that vendor. 

To decouple ViewPick from any single data provider, we migrated our Supabase PostgreSQL schema to treat **IMDb IDs (`tt...`)** as the universal canonical identifier across all tables:

```sql
-- Migration: Add Universal IMDb identifier and indexing
ALTER TABLE public.watchlist 
ADD COLUMN IF NOT EXISTS imdb_id text;

ALTER TABLE public.watched_movies 
ADD COLUMN IF NOT EXISTS imdb_id text;

ALTER TABLE public.watched_series 
ADD COLUMN IF NOT EXISTS imdb_id text;

-- Create composite btree indexes for instant lookups
CREATE INDEX IF NOT EXISTS idx_watchlist_user_imdb 
ON public.watchlist (user_id, imdb_id);

CREATE INDEX IF NOT EXISTS idx_watched_movies_user_imdb 
ON public.watched_movies (user_id, imdb_id);
```

#### Why IMDb IDs?
* Both TMDB and TheTVDB maintain mappings to IMDb IDs.
* When a user visits `/movies/tt1375666` (*Inception*), the route resolves identically regardless of whether the backend metadata was fetched from TheTVDB, TMDB, or an internal cache.
* Our `WatchlistManager` executes backward-compatible lookups: if an old record only has a legacy numeric ID, it automatically backfills the `imdb_id` on the fly.

---

### Step 2: The 3-Tier Multi-Proxy Failover Pipeline

To prevent client devices from ever touching third-party APIs directly, we engineered a 3-tier resilient proxy architecture in `src/lib/tvdb.ts`:

```text
               [Client Browser / Astro SSR]
                            │
                            ▼
      ┌───────────────────────────────────────────┐
      │  Tier 1: Cloudflare Worker Edge Proxy     │
      │  - Global CDN edge caching                │
      │  - In-memory JWT token store              │
      └─────────────────────┬─────────────────────┘
                            │ (On Failure / Timeout)
                            ▼
      ┌───────────────────────────────────────────┐
      │  Tier 2: Supabase Deno Edge Function      │
      │  - Serverless failover (tvdb_proxy)       │
      │  - Isolated encrypted secrets vault       │
      └─────────────────────┬─────────────────────┘
                            │ (On Function Cold Start/Error)
                            ▼
      ┌───────────────────────────────────────────┐
      │  Tier 3: Direct TheTVDB API v4 Call       │
      │  - Signed JWT Bearer token                │
      │  - 28-day token rotation engine           │
      └───────────────────────────────────────────┘
```

#### Tier 1: Cloudflare Worker Edge Proxy
The primary request pipeline routes through a dedicated Cloudflare Worker proxy (`https://tvdb-proxy.your-domain.workers.dev`). 
* Checks Cloudflare KV for cached responses (e.g. popular trending feeds cached for 4 hours).
* Intercepts `429 Too Many Requests` or network timeouts and triggers a fallback signal.

#### Tier 2: Supabase Deno Edge Function (`tvdb_proxy`)
If the Cloudflare Worker encounters an edge exception, the client library seamlessly invokes our secondary Deno Edge Function via the Supabase client SDK:

```typescript
// supabase/functions/tvdb_proxy/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const TVDB_API_KEY = Deno.env.get('TVDB_API_KEY');
const TVDB_BASE_URL = 'https://api4.thetvdb.com/v4';

serve(async (req) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { endpoint, params } = await req.json();
    
    // Authenticate and fetch from TheTVDB v4
    const token = await getCachedTVDBToken(TVDB_API_KEY);
    const url = new URL(`${TVDB_BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
```

#### Tier 3: Direct Fallback with 28-Day JWT Lifecycle
If both proxies are unavailable, our TypeScript client library contains an autonomous JWT rotation engine. It executes `POST /v4/login`, stores the token in memory, and persists expiration timestamps to renew tokens before they expire.

---

### Step 3: Feed Quality Tuning (Logarithmic Score Normalization)

A surprise challenge when moving to TheTVDB was feed quality:
* TMDB uses community voting averages that generally fall between 6.0 and 8.5.
* TheTVDB uses raw integer scores (`score: 184520`) based on popularity and view count.

If you display raw unranked TVDB records, your discovery feed fills up with obscure, unreleased titles that happen to be first in alphabetical order.

To solve this, we updated our query parameters to request sorted scores:

```typescript
// Fetch high-impact trending titles
const res = await tvdbFetch('/movies/filter', {
  sort: 'score',
  sortType: 'desc',
  year: '2024',
});
```

And mapped raw scores dynamically to an intuitive 10-point scale using a logarithmic decay function:

```typescript
/**
 * Normalizes raw TVDB popularity scores into a familiar 7.2 - 9.6 rating scale.
 */
export function normalizeTVDBScore(rawScore: number): number {
  if (!rawScore || rawScore <= 0) return 7.5;
  // Logarithmic scaling prevents mega-blockbusters from breaking the UI
  const scaled = 7.0 + Math.min(2.6, Math.log10(rawScore + 1) * 0.52);
  return Math.round(scaled * 10) / 10;
}
```

Now, discovery feeds immediately surface globally recognized blockbusters (*Dune: Part Two*, *Inside Out 2*, *Stranger Things*) with crisp, balanced ratings.

---

### Results & Architecture Summary

* **100% Commercial Compliance:** Zero reliance on TMDB keys, eliminating account suspension risks.
* **99.99% Edge Availability:** 3-tier proxy failover guarantees that even if a proxy node experiences cold-start issues, downstream traffic routes smoothly.
* **Decoupled Database Architecture:** Universal IMDb IDs protect user data from future vendor shifts.
```

---

## 🛠️ How to Add These Posts to Your Portfolio

When you are ready to publish these to [adilrahman.cc](https://adilrahman.cc):

1. Open `src/data/blogData.js`.
2. Add each blog object to the `allBlogs` array matching the schema:
   ```javascript
   {
     id: 'cloudflare-pages-bot-traffic-edge-cache-astro-ssr',
     title: 'The 88,000 Requests/Day Trap: How Search Bots Almost Blew My Cloudflare Pages Free Tier',
     seoTitle: 'How to Stop Bot Traffic from Blowing Cloudflare Pages Free Tier (Astro SSR)',
     date: 'November 25, 2026',
     readTime: '8 min read',
     excerpt: 'In Astro 5 SSR on Cloudflare Pages, search engine bots crawling my sitemap consumed 88,354 serverless requests in 24 hours without real users. Here is how edge CDN caching and s-maxage saved my quota.',
     content: `... [Paste markdown content from above] ...`
   }
   ```
3. Run `npm run build` to verify that Next.js generates static routes for all 3 posts.
4. Distribute using the social promo snippets above!

---

# 🚀 Blog Post: Building a Hybrid Video Transcoding Engine (Fileo)

* **ID / Slug:** `hybrid-video-transcoding-in-browser-cloud-ffmpeg`
* **Title:** Building a Hybrid Video Transcoding Engine: 200MB In-Browser Processing with Zero-Cost Cloud FFmpeg Fallback
* **SEO Title:** Hybrid Video Transcoding: In-Browser Client + Cloud FFmpeg Architecture | Adil Rahman
* **Date:** November 27, 2026
* **Read Time:** 10 min read
* **Canonical URL:** `https://adilrahman.cc/blog/hybrid-video-transcoding-in-browser-cloud-ffmpeg`
* **Target Project:** [Fileo (fileo.cc)](https://fileo.cc/?utm_source=adilrahman)
* **Target Keywords:** `in-browser video conversion javascript`, `MediaRecorder webm to mp4`, `client side video compression without server`, `free ffmpeg docker microservice render`, `hybrid client server video processing`

### Social Promo Snippets

* **X (Twitter):**
  > Cloud video transcoding bills can bankrupt indie SaaS apps overnight. 💸
  > 
  > But running 1GB video files in WebAssembly chokes client memory and crashes browser tabs.
  > 
  > Here is how I built Fileo's Hybrid Video Engine:
  > • Desktop <= 200MB: Transcoded 100% locally via hardware `MediaRecorder` ($0 server cost, 0ms lag)
  > • Files > 200MB (up to 1GB): Streamed in 1MB chunks to a self-cleaning Render.com FFmpeg Docker microservice
  > 
  > Deep dive on the architecture:
  > https://adilrahman.cc/blog/hybrid-video-transcoding-in-browser-cloud-ffmpeg?utm_source=x
  > 
  > #WebDev #VideoEngineering #Docker #Python #Astro #Cloudflare

* **LinkedIn:**
  > Cloud transcoding APIs (AWS Elemental MediaConvert, Cloudinary) charge $0.015 - $0.030 per video minute. If you run a high-volume media utility, that economic model is completely unsustainable.
  > 
  > On the other hand, compiling full FFmpeg to WebAssembly (ffmpeg.wasm) frequently crashes browser tabs on files larger than 300MB due to 32-bit memory boundaries.
  > 
  > For Fileo (fileo.cc), we built a Hybrid Media Engine:
  > 1. Desktop In-Browser Tier (<= 200MB): Transcodes video directly on the user's GPU/CPU using native `MediaRecorder` and the Web Audio API. 0 server compute costs, 0 network latency, 100% privacy.
  > 2. Mobile In-Browser Tier (<= 100MB): Keeps iOS Safari and Android Chrome responsive without memory evictions.
  > 3. Cloud Container Tier (Files > 200MB up to 1GB): Streams in 1MB chunks to a containerized FastAPI + Linux FFmpeg service running on Render's free tier, protected by a zero-hardcoded combined key security protocol.
  > 
  > Read the complete engineering writeup:
  > https://adilrahman.cc/blog/hybrid-video-transcoding-in-browser-cloud-ffmpeg?utm_source=linkedin

---

# 🚀 Blog Post: Why SetForegroundWindow Fails on Windows 11 (OverWatch)

* **ID / Slug:** `windows-foreground-lock-bypass-attachthreadinput`
* **Title:** Why SetForegroundWindow Fails on Windows 11 (And How to Bypass the Foreground Lock with AttachThreadInput)
* **SEO Title:** Fix SetForegroundWindow on Windows 11 with AttachThreadInput | Adil Rahman
* **Date:** November 27, 2026
* **Read Time:** 9 min read
* **Canonical URL:** `https://adilrahman.cc/blog/windows-foreground-lock-bypass-attachthreadinput`
* **Target Project:** [OverWatch (overwatch.adilrahman.cc)](https://overwatch.adilrahman.cc?utm_source=adilrahman.cc)
* **Target Keywords:** `SetForegroundWindow not working Windows 11`, `AttachThreadInput foreground lock bypass`, `SPI_SETFOREGROUNDLOCKTIMEOUT bypass C# nodejs`, `AppActivate not focusing window`, `inject keystrokes unfocused window`

### Social Promo Snippets

* **X (Twitter):**
  > Ever tried writing Windows automation only for `SetForegroundWindow` or `AppActivate` to silently fail and just flash yellow in the taskbar? 💀
  > 
  > That's the Windows NT Foreground Lock (`SPI_SETFOREGROUNDLOCKTIMEOUT`).
  > 
  > Even worse: sending `{ENTER}` to an unfocused window will insert accidental newlines directly into your code!
  > 
  > Here is how we bypassed the lock cleanly using Win32 `AttachThreadInput` in OverWatch:
  > https://adilrahman.cc/blog/windows-foreground-lock-bypass-attachthreadinput?utm_source=x
  > 
  > #Windows #Win32 #SoftwareEngineering #Automation #CSharp #NodeJS

* **LinkedIn:**
  > If you develop desktop automation tools, background daemons, or remote macro bridges on Windows, you have almost certainly encountered the Windows Foreground Lock wall.
  > 
  > Since Windows 98/2000, Windows NT strictly prohibits background processes from stealing window focus (`SPI_SETFOREGROUNDLOCKTIMEOUT`). If a background tray service attempts to call `SetForegroundWindow` or `WScript.Shell.AppActivate`, Windows suppresses it and merely flashes the target window in the taskbar.
  > 
  > While building OverWatch, our mobile StandBy deck needed to beam prompt commands into active coding agents (Antigravity/VS Code). When the IDE was unfocused, blind keystrokes were inserting newline characters into open source code files!
  > 
  > We solved this by using native Win32 Thread Input Queue Attachment:
  > 1. Join daemon thread to target IDE thread via `AttachThreadInput(daemonThread, targetThread, TRUE)`
  > 2. Restore and bring window to front via `ShowWindow(SW_RESTORE)` and `SetForegroundWindow`
  > 3. Immediately detach threads with `AttachThreadInput(..., FALSE)`
  > 4. Programmatically send `Ctrl+L` to focus the AI chat input before pasting (`Ctrl+V`) and submitting (`Enter`)
  > 
  > Full architecture breakdown and production TypeScript/PowerShell implementation:
  > https://adilrahman.cc/blog/windows-foreground-lock-bypass-attachthreadinput?utm_source=linkedin
