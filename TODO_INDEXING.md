# 📋 Google Search Console Indexing Action Plan

This checklist separates **brand-new URLs** that need manual indexing from **already-indexed URLs**, helping you stay within Google Search Console's daily inspection quota (~10–12 URLs/day).

---

## ⚡ Daily Quota Strategy

> **Google Search Console Quota Limit**: Google typically allows **10 to 12 manual "Request Indexing"** submissions per 24-hour period per property. Do not submit URLs that are already indexed, or you will hit `Quota Exceeded` and delay new pages.

1. **First Action (Instant)**: Resubmit your sitemap at **Search Console > Sitemaps > `https://adilrahman.cc/sitemap.xml`** (This notifies Googlebot of all 48 pages without consuming your daily quota).
2. **Day 1 Inspection**: Submit **Batch 1 (New URLs)** using the URL Inspection bar at the top of GSC.
3. **Day 2 Inspection (Optional)**: Submit **Batch 2 (Core Updated URLs)** to fast-track newly added `WebSite` and `Breadcrumb` schemas.

---

## 🟢 Batch 1: Brand New URLs to Request First (Today)

These URLs were newly created or published recently and require an initial manual crawl request in GSC:

- [ ] `https://adilrahman.cc/blog/homeflix-background-transcoding-engine`
  - **Type**: New Open-Source Engineering Blog Post (Published Nov 14, 2026)
  - **Target Keywords**: *Homeflix background transcoding, priority preemption media server, self-hosted streaming server FFmpeg*
- [x] `https://adilrahman.cc/blog/whatsapp-automation-google-sheets-case-study`
  - **Type**: New Technical Blog Post (Published Nov 12, 2026)
  - **Target Keywords**: *WhatsApp automation Google Sheets, LockService Apps Script, automated attendance system*

- [x] `https://adilrahman.cc/blog/zero-cookie-visitor-map-cloudflare-supabase`
  - **Type**: New Technical Blog Post (Published Nov 10, 2026)
  - **Target Keywords**: *zero-cookie visitor map, Cloudflare edge Supabase map, Next.js country telemetry*
- [x] `https://adilrahman.cc/blog/cloudflare-pages-npm-ci-wasm-trap`
  - **Type**: New Technical Blog Post (Published Nov 7, 2026)
  - **Target Keywords**: *Cloudflare Pages npm ci Wasm, missing WebAssembly bindings Cloudflare*
- [x] `https://adilrahman.cc/project/niche-sites/fileo`
  - **Type**: New Project Case Study
  - **Target Keywords**: *Fileo in-browser file converter, Astro 5 Wasm utility platform*
- [x] `https://adilrahman.cc/project/niche-sites`
  - **Type**: New Project Category Hub
  - **Target Keywords**: *niche sites portfolio, monetized web utilities*
- [x] `https://adilrahman.cc/reviews`
  - **Type**: Dedicated Reviews & Testimonials Hub
  - **Target Keywords**: *Adil Rahman reviews, verified Flutter developer testimonials, 5.0 star software engineer ratings*
- [x] `https://adilrahman.cc/privacy`
  - **Type**: Dedicated Privacy Policy & Architecture Disclosure
  - **Target Keywords**: *Adil Rahman privacy policy, zero-knowledge telemetry disclosure*

---

## 🟡 Batch 2: Core Updated URLs (Submit Tomorrow or if Quota Remains)

These URLs were already active, but were updated with new structured data (`WebSite` schema, `BreadcrumbList`, crawlable hero links, and keyword anchor text) to accelerate rich snippet updates:

- [x] `https://adilrahman.cc/`
  - **Update**: Injected `WebSite` schema for Google Site Name verification ("Adil Rahman"), crawlable `<a href>` Hero CTAs, and footer deep links.
- [x] `https://adilrahman.cc/blog`
  - **Update**: Injected `CollectionPage` and `BreadcrumbList` schema.
- [x] `https://adilrahman.cc/services/flutter-developer`
  - **Update**: Linked directly in footer and Hero cards with keyword anchor text.
- [x] `https://adilrahman.cc/services/shopify-developer`
  - **Update**: Linked directly in footer and Hero cards with keyword anchor text.
- [x] `https://adilrahman.cc/services/nextjs-developer`
  - **Update**: Linked directly in footer and Hero cards with keyword anchor text.

---

## ⚪ Already Indexed / Do NOT Waste Quota On These

Googlebot already has these pages in its index. Resubmitting your `sitemap.xml` will keep them updated automatically. **Do not use manual URL Inspection requests on these**:

### Historical Blog Posts
- `https://adilrahman.cc/blog/sqlite-to-supabase-railway-deployment`
- `https://adilrahman.cc/blog/supabase-cold-storage-archival`
- `https://adilrahman.cc/blog/fixing-broken-iphone-camera`
- `https://adilrahman.cc/blog/viewpick-build`

### Hubs & Tools
- `https://adilrahman.cc/project`
- `https://adilrahman.cc/services`
- `https://adilrahman.cc/tools`
- `https://adilrahman.cc/tools/resume-builder`

### Category Hubs
- `https://adilrahman.cc/project/saas`
- `https://adilrahman.cc/project/freelance`
- `https://adilrahman.cc/project/personal-project`

### Established Project Case Studies
- `https://adilrahman.cc/project/freelance/edu-amicus-deployment`
- `https://adilrahman.cc/project/saas/membership-saas`
- `https://adilrahman.cc/project/personal-project/zmr`
- `https://adilrahman.cc/project/personal-project/poshan`
- `https://adilrahman.cc/project/personal-project/calert`
- `https://adilrahman.cc/project/personal-project/viewpick`
- `https://adilrahman.cc/project/personal-project/resume-editor`
- `https://adilrahman.cc/project/personal-project/sirr`
- `https://adilrahman.cc/project/personal-project/teledrive`

---

## 🛠️ Step-by-Step Google Search Console Submission Guide

1. **Submit / Refresh Sitemap**:
   - Open [Google Search Console](https://search.google.com/search-console).
   - In the left sidebar, click **Indexing** > **Sitemaps**.
   - Under *Add a new sitemap*, enter `sitemap.xml` and click **Submit**.
   - Verify the status displays a green **Success**.

2. **Inspect & Request Indexing for Batch 1**:
   - Paste the first URL from **Batch 1** into the top search bar (*"Inspect any URL in 'adilrahman.cc'"*).
   - Press `Enter` and wait for the live test.
   - Click the **Request Indexing** button.
   - Repeat for the remaining URLs in **Batch 1** until done.

3. **Verify Indexing Status (48–72 Hours)**:
   - Check **Indexing** > **Pages** report.
   - Newly requested URLs typically appear under *"Indexed, not submitted in sitemap"* or *"Submitted and indexed"*.

