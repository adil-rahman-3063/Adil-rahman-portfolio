'use client';

import React from 'react';
import Link from 'next/link';
import SiteFooter from '../../components/SiteFooter';

export default function PrivacyClient() {
  return (
    <div className="privacy-page">
      {/* Navigation */}
      <nav className="privacy-nav">
        <Link href="/" className="privacy-back-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="#8D6E63" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Portfolio
        </Link>
        <span className="privacy-brand">ADIL RAHMAN // PRIVACY &amp; DATA TRANSPARENCY</span>
      </nav>

      {/* Header */}
      <header className="privacy-header">
        <div className="privacy-header-inner">
          <div className="privacy-tag-row">
            <span className="privacy-badge">// LEGAL &amp; ARCHITECTURAL DISCLOSURE</span>
            <span className="privacy-badge highlight">PRIVACY-BY-DESIGN</span>
            <span className="privacy-badge">VERSION 3.0.0</span>
          </div>

          <h1 className="privacy-title">Privacy Policy &amp; Zero-Knowledge Architecture</h1>
          <p className="privacy-lead">
            Every subsystem, edge handler, client-side utility, and database table deployed across <strong>adilrahman.cc</strong> has been intentionally engineered to respect user sovereignty. We operate under a strict standard: zero tracking cookies, zero session recording, and zero IP address logging.
          </p>

          <div className="privacy-meta-bar">
            <div className="meta-item">
              <span className="meta-label">DATA CONTROLLER</span>
              <span className="meta-val">Adil Rahman</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">EFFECTIVE DATE</span>
              <span className="meta-val">November 10, 2026</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">COMPLIANCE STANDARDS</span>
              <span className="meta-val">GDPR · CCPA/CPRA · DPDP Act 2023 · PECR</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">RAW MARKDOWN COPY</span>
              <a href="/privacy.md" target="_blank" rel="noreferrer" className="meta-link">
                /privacy.md ↗
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="privacy-main">
        <div className="privacy-container">

          {/* Highlights Grid */}
          <section className="privacy-pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon">🛡️</div>
              <h2 className="pillar-title">Zero Tracking Cookies</h2>
              <p className="pillar-desc">
                No third-party advertising pixels (Meta, TikTok, LinkedIn) or cross-site tracking scripts. No intrusive cookie banners required.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon">🌐</div>
              <h2 className="pillar-title">IP-Free Edge Telemetry</h2>
              <p className="pillar-desc">
                Coarse country codes (<code className="code-span">cf-ipcountry</code>) are evaluated in volatile RAM by Cloudflare edge nodes. Raw IP addresses are discarded immediately.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon">⚡</div>
              <h2 className="pillar-title">100% In-Browser Utilities</h2>
              <p className="pillar-desc">
                Tools like our ATS Resume Builder and Fileo process files and text purely in client device memory via WebAssembly and Canvas. Zero server uploads.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon">🔒</div>
              <h2 className="pillar-title">Statutory Compliance</h2>
              <p className="pillar-desc">
                Engineered for full compliance with the European Union GDPR, California CCPA/CPRA, UK Data Protection Act, and the Indian DPDP Act 2023.
              </p>
            </div>
          </section>

          {/* Table of Contents */}
          <nav className="privacy-toc" aria-label="Privacy policy table of contents">
            <h2 className="toc-title">// TABLE OF CONTENTS</h2>
            <ol className="toc-list">
              <li><a href="#section-1">1. Architectural Philosophy &amp; PbD Framework</a></li>
              <li><a href="#section-2">2. Data Controller Identity &amp; Contact Details</a></li>
              <li><a href="#section-3">3. Edge Network Telemetry &amp; Global Map Telemetry</a></li>
              <li><a href="#section-4">4. Information You Voluntarily Provide</a></li>
              <li><a href="#section-5">5. Data We Strictly Do Not Collect</a></li>
              <li><a href="#section-6">6. Client-Side Browser Storage Disclosure</a></li>
              <li><a href="#section-7">7. Sub-Processors &amp; Infrastructure Partners</a></li>
              <li><a href="#section-8">8. International Legal Bases for Processing (GDPR)</a></li>
              <li><a href="#section-9">9. Your Global Privacy Rights &amp; How to Exercise Them</a></li>
              <li><a href="#section-10">10. California Consumer Privacy Rights (CCPA / CPRA)</a></li>
              <li><a href="#section-11">11. India Digital Personal Data Protection Act (DPDP)</a></li>
              <li><a href="#section-12">12. In-Browser Client-Side Tools Privacy (Fileo &amp; Resume)</a></li>
              <li><a href="#section-13">13. Security Countermeasures, Encryption &amp; Data Retention</a></li>
              <li><a href="#section-14">14. Contact &amp; Data Protection Officer Channel</a></li>
            </ol>
          </nav>

          {/* Section 1 */}
          <article className="policy-block" id="section-1">
            <h2 className="policy-h2">1. Architectural Philosophy &amp; Privacy-by-Design Framework</h2>
            <p>
              In modern web development, privacy is all too frequently treated as an afterthought—an obligatory legal disclaimer layered on top of aggressive user surveillance, tracking pixels, and invasive profiling scripts.
            </p>
            <p>
              This platform was built upon a fundamentally different engineering standard: <strong>Privacy by Architecture</strong>. We adhere strictly to the foundational principles of Privacy by Design (PbD):
            </p>
            <ul className="policy-list">
              <li><strong>Proactive, Not Reactive:</strong> Our systems discard volatile user identifiers at the network boundary before data ever touches persistent storage.</li>
              <li><strong>Privacy as the Default:</strong> Visitors do not need to navigate complex opt-out menus or decline dark patterns. Maximum privacy is active automatically.</li>
              <li><strong>Zero-Sum Rejection:</strong> You enjoy rich, interactive 60 FPS interfaces, dynamic contribution maps, and free browser utilities without trading away your personal data.</li>
              <li><strong>Open Verification:</strong> Our portfolio codebases are documented and publicly viewable on GitHub, enabling independent technical verification of our privacy assertions.</li>
            </ul>
          </article>

          {/* Section 2 */}
          <article className="policy-block" id="section-2">
            <h2 className="policy-h2">2. Data Controller Identity &amp; Contact Details</h2>
            <p>
              The natural person determining the purposes and technical means of data processing for this website is:
            </p>
            <div className="contact-box">
              <p><strong>Data Controller:</strong> Adil Rahman</p>
              <p><strong>Professional Role:</strong> Full-Stack Software Engineer &amp; Mobile Applications Developer</p>
              <p><strong>Location:</strong> Thrissur, Kerala, India — PIN 680001</p>
              <p><strong>Email:</strong> <a href="mailto:adilrahman3063@gmail.com">adilrahman3063@gmail.com</a></p>
              <p><strong>Direct / WhatsApp Channel:</strong> +91 9207114070</p>
            </div>
          </article>

          {/* Section 3 */}
          <article className="policy-block" id="section-3">
            <h2 className="policy-h2">3. Edge Network Telemetry &amp; The Global Visitor Map</h2>
            <p>
              The homepage features an interactive <strong>Global Network Telemetry Map</strong> (Section 09) that visualizes visitor density across world regions using a GitHub contribution graph aesthetic. Here is the technical breakdown of how this operates without violating personal privacy:
            </p>
            <ul className="policy-list">
              <li><strong>Zero HTML5 Location Requests:</strong> The Site never calls <code className="code-span">navigator.geolocation</code>. You will never be prompted to grant location access.</li>
              <li><strong>Volatile Edge Extraction:</strong> Cloudflare edge nodes inspect incoming TCP packets in volatile RAM to extract the coarse two-letter country code (<code className="code-span">cf-ipcountry</code>, e.g., <code className="code-span">IN</code>, <code className="code-span">US</code>, <code className="code-span">DE</code>).</li>
              <li><strong>Immediate IP Purge:</strong> The user&apos;s IP address is discarded immediately at the edge. It is <strong>never</strong> recorded in database logs, never written to disk, and never stored.</li>
              <li><strong>Atomic Counter Aggregation:</strong> The database receives only the country code to increment an aggregate counter (<code className="code-span">visitor_countries</code>). Thousands of users share the exact same country designation, ensuring statistical anonymity.</li>
              <li><strong>ePrivacy Directive Compliance:</strong> Because no persistent identifier is placed on your device and only anonymous aggregated counters are maintained, this telemetry is legally exempt from cookie consent banner mandates under the ePrivacy Directive (Directive 2002/58/EC) and UK PECR.</li>
            </ul>
          </article>

          {/* Section 4 */}
          <article className="policy-block" id="section-4">
            <h2 className="policy-h2">4. Information You Voluntarily Provide</h2>
            <p>We process personal data solely when you intentionally and directly supply it to us:</p>
            <ul className="policy-list">
              <li><strong>Project Quote Inquiries (<code className="code-span">?hire=true</code>):</strong> When you request a project estimate, we collect your name, email, phone/WhatsApp number, and project scope details solely to evaluate the technical requirements and send a customized commercial proposal.</li>
              <li><strong>Client Reviews &amp; Testimonials (<code className="code-span">?review=true</code>):</strong> When submitting feedback, we collect your author name, professional title, star rating, and review text. By submitting, you grant affirmative consent to display this feedback publicly. You may request its modification or deletion at any time.</li>
              <li><strong>Direct Electronic Correspondence:</strong> Inquiries sent via email (<code className="code-span">adilrahman3063@gmail.com</code>) or WhatsApp are retained strictly as necessary to answer your questions and fulfill contractual obligations.</li>
            </ul>
          </article>

          {/* Section 5 */}
          <article className="policy-block" id="section-5">
            <h2 className="policy-h2">5. Data We Strictly Do Not Collect</h2>
            <p>To eliminate ambiguity, our infrastructure explicitly rejects the following invasive practices:</p>
            <ul className="policy-list">
              <li><strong>No Third-Party Retargeting Pixels:</strong> We do not load the Meta (Facebook) Pixel, Google Ads Remarketing, LinkedIn Insight, or TikTok pixels.</li>
              <li><strong>No Session Recording:</strong> We do not run session replay trackers (Hotjar, FullStory, Microsoft Clarity) that capture mouse paths or keystrokes.</li>
              <li><strong>No Device Fingerprinting:</strong> We do not execute canvas rendering hashes, WebGL queries, or audio context tests to identify your hardware.</li>
              <li><strong>No Data Broking:</strong> We do not sell, rent, license, or trade visitor data under any circumstances.</li>
              <li><strong>No Sensitive Special Category Data:</strong> We never collect religious beliefs, political affiliations, genetic data, or biometric records.</li>
            </ul>
          </article>

          {/* Section 6 */}
          <article className="policy-block" id="section-6">
            <h2 className="policy-h2">6. Client-Side Browser Storage Disclosure</h2>
            <p>We utilize client-side storage mechanisms purely for zero-latency operational performance:</p>
            <div className="table-wrapper">
              <table className="policy-table">
                <thead>
                  <tr>
                    <th>Storage Key</th>
                    <th>Mechanism</th>
                    <th>Operational Purpose</th>
                    <th>Retention Period</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code className="code-span">cached_projects</code></td>
                    <td><code className="code-span">localStorage</code></td>
                    <td>Caches Supabase portfolio projects to ensure instantaneous page rendering on repeat visits.</td>
                    <td>Persistent until cleared.</td>
                  </tr>
                  <tr>
                    <td><code className="code-span">cached_reviews</code></td>
                    <td><code className="code-span">localStorage</code></td>
                    <td>Caches client testimonials to eliminate flash-of-unrendered-content (FOUC) on slow networks.</td>
                    <td>Persistent until cleared.</td>
                  </tr>
                  <tr>
                    <td><code className="code-span">ar_visitor_logged_code</code></td>
                    <td><code className="code-span">sessionStorage</code></td>
                    <td>Stores current coarse country code to prevent duplicate database increment pings during a single browsing session.</td>
                    <td>Session only (purged on tab close).</td>
                  </tr>
                  <tr>
                    <td><code className="code-span">resumeDraft_*</code></td>
                    <td><code className="code-span">localStorage</code></td>
                    <td>Saves draft resume content in <code className="code-span">/tools/resume-builder</code> entirely within your local browser. Never transmitted to our servers.</td>
                    <td>Persistent locally on your device only.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          {/* Section 7 */}
          <article className="policy-block" id="section-7">
            <h2 className="policy-h2">7. Sub-Processors &amp; Infrastructure Partners</h2>
            <p>Our website utilizes vetted technical sub-processors adhering to stringent security and privacy standards:</p>
            <ul className="policy-list">
              <li><strong>Cloudflare, Inc. (USA):</strong> Provides edge routing, DDoS defense, SSL/TLS certificates, and transient country code extraction. Certified under EU-U.S. Data Privacy Framework and ISO 27001.</li>
              <li><strong>Supabase, Inc. (Singapore / Global):</strong> Managed PostgreSQL hosting, Row-Level Security, and encrypted REST APIs. SOC2 Type II certified and GDPR compliant.</li>
              <li><strong>Google LLC (Google Workspace):</strong> Direct business email infrastructure for <code className="code-span">adilrahman3063@gmail.com</code>.</li>
              <li><strong>Meta Platforms, Inc. (WhatsApp API):</strong> Direct user-initiated customer communication via WhatsApp.</li>
            </ul>
          </article>

          {/* Section 8 */}
          <article className="policy-block" id="section-8">
            <h2 className="policy-h2">8. International Legal Bases for Processing (GDPR)</h2>
            <p>Under Article 6 of the General Data Protection Regulation (Regulation (EU) 2016/679), processing is anchored to the following lawful grounds:</p>
            <ul className="policy-list">
              <li><strong>Contractual Necessity (Article 6(1)(b) GDPR):</strong> When you request project estimates, processing your details is necessary to prepare technical deliverables and commercial scopes.</li>
              <li><strong>Legitimate Interests (Article 6(1)(f) GDPR):</strong> We process edge network traffic headers to defend against cyber threats and display high-level aggregate traffic statistics without overriding your fundamental freedoms.</li>
              <li><strong>Explicit Consent (Article 6(1)(a) GDPR):</strong> When you submit a public review or testimonial, you affirmatively consent to its display. You may withdraw consent at any time.</li>
            </ul>
          </article>

          {/* Section 9 */}
          <article className="policy-block" id="section-9">
            <h2 className="policy-h2">9. Your Global Privacy Rights &amp; How to Exercise Them</h2>
            <p>Regardless of where you reside, we respect your statutory rights regarding your personal information:</p>
            <ul className="policy-list">
              <li><strong>Right to Access:</strong> Request a complete copy of any data we hold about you.</li>
              <li><strong>Right to Rectification:</strong> Update or correct inaccurate records.</li>
              <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request the permanent deletion of your project inquiry or review.</li>
              <li><strong>Right to Restrict or Object:</strong> Restrict processing or object to processing based on legitimate interests.</li>
              <li><strong>Right to Data Portability:</strong> Receive your submitted data in a standard machine-readable format (JSON/CSV).</li>
            </ul>
            <p>
              To exercise any of these rights, email <a href="mailto:adilrahman3063@gmail.com" className="body-link">adilrahman3063@gmail.com</a>. All verified requests are fulfilled within <strong>30 calendar days</strong> with zero administrative fees.
            </p>
          </article>

          {/* Section 10 */}
          <article className="policy-block" id="section-10">
            <h2 className="policy-h2">10. California Consumer Privacy Rights (CCPA / CPRA)</h2>
            <p>
              Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):
            </p>
            <ul className="policy-list">
              <li><strong>No Sale or Sharing of Personal Data:</strong> We have never sold, rented, or shared personal data with data brokers or advertising networks.</li>
              <li><strong>No Cross-Context Behavioral Advertising:</strong> We do not track California consumers across third-party websites.</li>
              <li><strong>Consumer Rights:</strong> California residents have the right to know, delete, correct, and be free from discrimination for exercising statutory privacy rights.</li>
            </ul>
          </article>

          {/* Section 11 */}
          <article className="policy-block" id="section-11">
            <h2 className="policy-h2">11. India Digital Personal Data Protection Act (DPDP Act 2023)</h2>
            <p>
              As an engineer operating from Kerala, India, our data stewardship conforms strictly to India&apos;s Digital Personal Data Protection Act:
            </p>
            <ul className="policy-list">
              <li><strong>Purpose Limitation:</strong> Personal data submitted through voluntary inquiry forms is used solely to evaluate and deliver software services.</li>
              <li><strong>Data Fiduciary Responsibility:</strong> Adil Rahman acts as the responsible Data Fiduciary, ensuring bank-grade encryption and technical safeguards.</li>
              <li><strong>Grievance Redressal:</strong> Grievances can be submitted directly to <code className="code-span">adilrahman3063@gmail.com</code> with direct resolution within 30 days.</li>
            </ul>
          </article>

          {/* Section 12 */}
          <article className="policy-block" id="section-12">
            <h2 className="policy-h2">12. In-Browser Client-Side Tools Privacy (Fileo &amp; Resume Builder)</h2>
            <p>Our interactive portfolio tools operate under strict client-side zero-server paradigms:</p>
            <ul className="policy-list">
              <li><strong>Free ATS Resume Builder (<code className="code-span">/tools/resume-builder</code>):</strong> Runs 100% in client memory using Vanilla JS and CSS print stylesheets. Your resume text, personal contacts, and job history are never uploaded to any server or database.</li>
              <li><strong>Fileo Platform (<code className="code-span">fileo.cc</code>):</strong> Decodes HEIC, WebP, AVIF, and subtitles locally via WebAssembly (<code className="code-span">libheif</code>) and Canvas. Zero file uploads, 0ms server delay, and zero cloud storage liability.</li>
            </ul>
          </article>

          {/* Section 13 */}
          <article className="policy-block" id="section-13">
            <h2 className="policy-h2">13. Security Countermeasures, Encryption &amp; Data Retention</h2>
            <p>
              We maintain rigorous technical security protocols:
            </p>
            <ul className="policy-list">
              <li><strong>TLS 1.3 Encryption:</strong> All transport is strictly enforced over HTTPS with HSTS headers.</li>
              <li><strong>PostgreSQL Row-Level Security:</strong> Supabase database tables enforce strict tenant access controls.</li>
              <li><strong>Retention Limits:</strong> Commercial project inquiries are retained for up to 24 months for warranty and accounting compliance, after which they are purged. Anonymous aggregated visitor counts are kept for historical traffic analysis.</li>
            </ul>
          </article>

          {/* Section 14 */}
          <article className="policy-block" id="section-14">
            <h2 className="policy-h2">14. Contact &amp; Data Protection Officer Channel</h2>
            <p>
              For any questions regarding this Privacy Policy or to request immediate deletion of any submitted information, please reach out directly:
            </p>
            <div className="contact-box">
              <p><strong>Adil Rahman</strong> — Full-Stack Developer &amp; Data Controller</p>
              <p>Email: <a href="mailto:adilrahman3063@gmail.com">adilrahman3063@gmail.com</a></p>
              <p>Phone / WhatsApp: <a href="https://wa.me/919207114070" target="_blank" rel="noreferrer">+91 9207114070</a></p>
              <p>GitHub: <a href="https://github.com/adil-rahman-3063" target="_blank" rel="noreferrer">github.com/adil-rahman-3063</a></p>
              <p>Address: Thrissur, Kerala, India — 680001</p>
            </div>
          </article>

        </div>
      </main>

      <SiteFooter
        ctaLabel="// TRANSPARENT, PRODUCTION-TESTED SOFTWARE"
        ctaTitle="Ready to Engineer Your Next Platform?"
        ctaDesc="Get in touch for custom mobile apps, SaaS platforms, or high-conversion storefronts engineered with privacy and speed."
        primaryBtn={{ label: 'Contact Adil', href: '/#contact' }}
        secondaryBtn={{ label: 'Projects Hub', href: '/project' }}
      />

      <style jsx>{`
        .privacy-page {
          min-height: 100vh;
          background-color: #120A08;
          color: #FAF6EE;
          display: flex;
          flex-direction: column;
        }

        /* Nav */
        .privacy-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid rgba(141, 110, 99, 0.2);
          background: rgba(18, 10, 8, 0.95);
          backdrop-filter: blur(8px);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .privacy-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: #BCAAA4;
          text-decoration: none;
          transition: color 0.2s;
        }
        .privacy-back-link:hover {
          color: #FAF6EE;
        }

        .privacy-brand {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 1px;
          color: #8D6E63;
        }

        /* Header */
        .privacy-header {
          padding: 56px 24px 40px;
          border-bottom: 1px solid rgba(141, 110, 99, 0.2);
          background: linear-gradient(180deg, rgba(26, 12, 9, 0.8) 0%, rgba(18, 10, 8, 1) 100%);
        }

        .privacy-header-inner {
          max-width: 900px;
          margin: 0 auto;
        }

        .privacy-tag-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .privacy-badge {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.8px;
          color: #8D6E63;
          background: rgba(141, 110, 99, 0.12);
          border: 1px solid rgba(141, 110, 99, 0.25);
          padding: 3px 8px;
          border-radius: 4px;
        }

        .privacy-badge.highlight {
          color: #0A7C5A;
          background: rgba(10, 124, 90, 0.15);
          border-color: rgba(10, 124, 90, 0.4);
          font-weight: bold;
        }

        .privacy-title {
          font-family: var(--font-header);
          font-size: 34px;
          line-height: 1.25;
          color: #FAF6EE;
          margin: 0 0 16px 0;
          font-weight: bold;
        }

        @media (max-width: 640px) {
          .privacy-title {
            font-size: 26px;
          }
        }

        .privacy-lead {
          font-family: var(--font-mono);
          font-size: 14px;
          line-height: 1.8;
          color: #D7CCC8;
          margin: 0 0 28px 0;
          max-width: 820px;
        }

        .privacy-lead strong {
          color: #FAF6EE;
        }

        .privacy-meta-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          padding: 16px 20px;
          background: rgba(42, 21, 16, 0.4);
          border: 1px solid rgba(141, 110, 99, 0.2);
          border-radius: 8px;
        }

        @media (max-width: 768px) {
          .privacy-meta-bar {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .privacy-meta-bar {
            grid-template-columns: 1fr;
          }
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .meta-label {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.8px;
          color: #8D6E63;
        }

        .meta-val {
          font-family: var(--font-mono);
          font-size: 12px;
          color: #FAF6EE;
          font-weight: bold;
        }

        .meta-link {
          font-family: var(--font-mono);
          font-size: 12px;
          color: #0A7C5A;
          text-decoration: underline;
        }

        /* Main Content */
        .privacy-main {
          flex: 1;
          padding: 48px 24px 80px;
        }

        .privacy-container {
          max-width: 900px;
          margin: 0 auto;
        }

        /* Pillars Grid */
        .privacy-pillars-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 40px;
        }

        @media (max-width: 640px) {
          .privacy-pillars-grid {
            grid-template-columns: 1fr;
          }
        }

        .pillar-card {
          background: rgba(30, 16, 12, 0.6);
          border: 1px solid rgba(141, 110, 99, 0.25);
          border-radius: 10px;
          padding: 20px 22px;
        }

        .pillar-icon {
          font-size: 24px;
          margin-bottom: 10px;
        }

        .pillar-title {
          font-family: var(--font-header);
          font-size: 16px;
          color: #FAF6EE;
          margin: 0 0 8px 0;
        }

        .pillar-desc {
          font-family: var(--font-mono);
          font-size: 12px;
          line-height: 1.6;
          color: #BCAAA4;
          margin: 0;
        }

        /* Table of Contents */
        .privacy-toc {
          background: rgba(22, 11, 9, 0.8);
          border: 1px solid rgba(141, 110, 99, 0.25);
          border-radius: 10px;
          padding: 24px 28px;
          margin-bottom: 48px;
        }

        .toc-title {
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 1px;
          color: #8D6E63;
          margin: 0 0 16px 0;
        }

        .toc-list {
          margin: 0;
          padding-left: 20px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px 24px;
        }

        @media (max-width: 640px) {
          .toc-list {
            grid-template-columns: 1fr;
          }
        }

        .toc-list li {
          font-family: var(--font-mono);
          font-size: 12px;
          color: #BCAAA4;
        }

        .toc-list a {
          color: #BCAAA4;
          text-decoration: none;
          transition: color 0.15s;
        }
        .toc-list a:hover {
          color: #FAF6EE;
          text-decoration: underline;
        }

        /* Policy Blocks */
        .policy-block {
          margin-bottom: 44px;
          padding-bottom: 36px;
          border-bottom: 1px dashed rgba(141, 110, 99, 0.2);
        }

        .policy-block:last-of-type {
          border-bottom: none;
        }

        .policy-h2 {
          font-family: var(--font-header);
          font-size: 20px;
          color: #FAF6EE;
          margin: 0 0 16px 0;
          letter-spacing: 0.5px;
          scroll-margin-top: 80px;
        }

        .policy-block p {
          font-family: var(--font-mono);
          font-size: 14px;
          line-height: 1.85;
          color: #D7CCC8;
          margin: 0 0 16px 0;
        }

        .policy-block strong {
          color: #FAF6EE;
        }

        .policy-list {
          margin: 0 0 20px 0;
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .policy-list li {
          font-family: var(--font-mono);
          font-size: 13.5px;
          line-height: 1.75;
          color: #BCAAA4;
        }

        .code-span {
          font-family: var(--font-mono);
          font-size: 12px;
          background: rgba(141, 110, 99, 0.18);
          border: 1px solid rgba(141, 110, 99, 0.35);
          color: #FAF6EE;
          padding: 2px 5px;
          border-radius: 4px;
        }

        .body-link {
          color: #8D6E63;
          text-decoration: underline;
        }
        .body-link:hover {
          color: #FAF6EE;
        }

        .contact-box {
          background: rgba(42, 21, 16, 0.4);
          border: 1px solid rgba(141, 110, 99, 0.25);
          border-radius: 8px;
          padding: 20px 24px;
          margin-top: 14px;
        }

        .contact-box p {
          font-family: var(--font-mono);
          font-size: 13px;
          margin: 0 0 8px 0;
          color: #BCAAA4;
        }

        .contact-box p:last-child {
          margin-bottom: 0;
        }

        .contact-box a {
          color: #0A7C5A;
          text-decoration: underline;
        }

        /* Table */
        .table-wrapper {
          overflow-x: auto;
          margin: 20px 0;
          border-radius: 8px;
          border: 1px solid rgba(141, 110, 99, 0.25);
        }

        .policy-table {
          width: 100%;
          border-collapse: collapse;
          font-family: var(--font-mono);
          font-size: 12px;
          text-align: left;
        }

        .policy-table th {
          background: rgba(42, 21, 16, 0.8);
          color: #FAF6EE;
          padding: 12px 14px;
          border-bottom: 1px solid rgba(141, 110, 99, 0.3);
          font-weight: bold;
        }

        .policy-table td {
          padding: 12px 14px;
          border-bottom: 1px solid rgba(141, 110, 99, 0.15);
          color: #D7CCC8;
          line-height: 1.6;
        }

        .policy-table tr:last-child td {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
}

