# Privacy Policy & Architectural Data Transparency Disclosure

**Effective Date:** November 10, 2026  
**Last Updated:** November 10, 2026  
**Domain & Platform:** [https://adilrahman.cc](https://adilrahman.cc) (including all associated subdomains, edge endpoints, and web utilities)  
**Data Controller:** Adil Rahman (Independent Full-Stack Software Engineer & Mobile Developer)  
**Official Contact:** [adilrahman3063@gmail.com](mailto:adilrahman3063@gmail.com) | +91 9207114070  
**Jurisdiction:** India / International Compliance (GDPR, UK GDPR, CCPA/CPRA, CalOPPA, PECR, Indian DPDP Act 2023)

---

## Table of Contents
1. [Introduction and Architectural Philosophy](#1-introduction-and-architectural-philosophy)
2. [Data Controller Identity & Contact Details](#2-data-controller-identity--contact-details)
3. [The Zero-Knowledge & Privacy-by-Design Framework](#3-the-zero-knowledge--privacy-by-design-framework)
4. [Edge Network Telemetry & The Global Visitor Map](#4-edge-network-telemetry--the-global-visitor-map)
5. [Information You Voluntarily Provide](#5-information-you-voluntarily-provide)
6. [Data We Strictly Do Not Collect](#6-data-we-strictly-do-not-collect)
7. [Client-Side Browser Storage (Cookies & Local Storage)](#7-client-side-browser-storage-cookies--local-storage)
8. [Sub-Processors and Infrastructure Service Providers](#8-sub-processors-and-infrastructure-service-providers)
9. [Legal Bases for Data Processing (GDPR / UK GDPR)](#9-legal-bases-for-data-processing-gdpr--uk-gdpr)
10. [Your International Privacy Rights](#10-your-international-privacy-rights)
11. [Specific Disclosures for California Residents (CCPA/CPRA)](#11-specific-disclosures-for-california-residents-ccpacpra)
12. [Compliance with India's Digital Personal Data Protection Act (DPDP)](#12-compliance-with-indias-digital-personal-data-protection-act-dpdp)
13. [In-Browser Tools & Client-Side Utility Privacy (Fileo & Resume Builder)](#13-in-browser-tools--client-side-utility-privacy-fileo--resume-builder)
14. [Security Architecture, Encryption & Data Retention](#14-security-architecture-encryption--data-retention)
15. [Third-Party External Links & Portfolio Demonstrations](#15-third-party-external-links--portfolio-demonstrations)
16. [Children's Online Privacy Protection Act (COPPA)](#16-childrens-online-privacy-protection-act-coppa)
17. [Amendments and Version History](#17-amendments-and-version-history)
18. [Contact & Data Protection Officer Inquiries](#18-contact--data-protection-officer-inquiries)

---

## 1. Introduction and Architectural Philosophy

Welcome to the personal engineering portfolio, software showcases, and developer utilities platform of **Adil Rahman** accessible at [https://adilrahman.cc](https://adilrahman.cc) ("the Site", "we", "our", "us"). 

In modern web development, privacy is all too frequently treated as an afterthought—an obligatory legal disclaimer layered on top of aggressive user surveillance, tracking pixels, and invasive profiling scripts. 

This platform was built upon a fundamentally different engineering standard: **Privacy by Architecture**. 

Every subsystem, database table, client-side script, and edge handler deployed across `adilrahman.cc` has been deliberately engineered to minimize or entirely eliminate the harvesting of personal identifiable information (PII). We believe you should be able to explore technical case studies, run in-browser utilities, evaluate service offerings, and review code architectures without surrendering your digital identity, browsing history, or personal sovereignty.

This Privacy Policy constitutes a legally binding and technically transparent disclosure describing the categories of data processed through your interaction with the Site, the strict operational boundaries under which technical operations proceed, and your rights under global privacy frameworks including the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA/CPRA), and the Indian Digital Personal Data Protection Act (DPDP Act 2023).

---

## 2. Data Controller Identity & Contact Details

The natural person determining the purposes and means of any data processing activities carried out through this website (the "Data Controller") is:

* **Name:** Adil Rahman
* **Professional Capacity:** Full-Stack Software Engineer & Mobile Applications Developer
* **Primary Physical Jurisdiction:** Thrissur, Kerala, India
* **Primary Communications Email:** [adilrahman3063@gmail.com](mailto:adilrahman3063@gmail.com)
* **Official Website:** [https://adilrahman.cc](https://adilrahman.cc)
* **Direct Verification & Support Channel:** WhatsApp / Phone: +91 9207114070

If you have questions regarding this policy, requests to exercise your statutory rights, or inquiries concerning our system architectures, you may contact the Data Controller directly using the channels above.

---

## 3. The Zero-Knowledge & Privacy-by-Design Framework

Our engineering paradigm adheres to the seven foundational principles of Privacy by Design (PbD):

1. **Proactive not Reactive; Preventative not Remedial:** Our infrastructure prevents privacy violations from occurring by discarding volatile identifiers before data enters our storage tiers.
2. **Privacy as the Default Setting:** You are not required to opt out of tracking, decline tracking cookies, or navigate deceptive "Accept All" dark patterns. Strict privacy is active out of the box.
3. **Privacy Embedded into Design:** Client-side compute, edge extraction, and localized browser memory are prioritized over centralized server logging.
4. **Full Functionality — Positive-Sum, not Zero-Sum:** You enjoy 60 FPS interfaces, dynamic interactive telemetry maps, and free browser utilities without sacrificing your personal data.
5. **End-to-End Security — Full Lifecycle Protection:** Data transmitted in voluntary communications is encrypted via TLS 1.3 in transit and protected by PostgreSQL Row-Level Security (RLS) at rest.
6. **Visibility and Transparency — Keep it Open:** The codebases powering this portfolio are open-source and documented in public GitHub repositories, allowing independent verification of our privacy claims.
7. **Respect for User Privacy — Keep it User-Centric:** No marketing retargeting lists, no data broking, and zero advertising pixels are embedded on this platform.

---

## 4. Edge Network Telemetry & The Global Visitor Map

A featured interactive component of this website is the **Global Network Telemetry Map** (located in Section 09 on the homepage), which renders a real-time, contribution-graph style representation of visitor density across world regions. 

Because traditional web analytics tools (e.g., Google Analytics, Meta Pixel, Hotjar) compromise user privacy by capturing raw IP addresses, canvas fingerprints, and browsing journeys across the web, we developed a proprietary, 100% privacy-preserving edge counter architecture.

### 4.1 How Country Detection Functions (Without HTML5 Geolocation Prompts)
* **Zero Browser Permission Popups:** The Site **never** invokes the browser's HTML5 Geolocation API (`navigator.geolocation`). You will never receive a prompt asking for permission to "Know your location".
* **Edge Inspection in Volatile Memory:** When your browser requests assets from `adilrahman.cc`, your connection routes through the Cloudflare global edge network. Cloudflare edge servers inspect the IP packet header in volatile memory (RAM) to determine the coarse, two-letter country code (ISO-3166 alpha-2, e.g., `IN`, `US`, `DE`, `GB`) via the `cf-ipcountry` protocol header.
* **Immediate Discard of IP Addresses:** The raw IP address is discarded immediately at the network edge. It is **never** written to disk, never forwarded to our Supabase database, never concatenated into logs, and never made accessible to the site administrator.

### 4.2 Aggregated Atomic Counter Storage
* Once the coarse two-letter country code is resolved (e.g., `IN`), our backend executes an atomic increment counter on our Supabase database:
  $$\text{Count}_{\text{country}} \leftarrow \text{Count}_{\text{country}} + 1$$
* The database schema stores solely:
  - `country_code` (TEXT, Primary Key, e.g., `'IN'`)
  - `count` (INTEGER, cumulative visits)
  - `last_visited` (TIMESTAMPTZ, timestamp of the most recent increment)
* **Statistical Anonymity:** Because thousands of individual users share the exact same coarse country designation, it is mathematically and forensically impossible to reconstruct individual browsing habits, identities, or physical coordinates from this aggregated counter.
* **Session Deduplication:** To prevent repeated page refreshes from distorting the counter, the client checks `sessionStorage.getItem('ar_visitor_logged_code')`. This session key persists strictly within your local browser tab and expires automatically when your browsing session terminates.

### 4.3 Legal Exemption from Cookie Banners
Because this architecture:
1. Does not store, read, or track persistent tracking identifiers across domains;
2. Uses purely anonymous, aggregated counters; and
3. Relies strictly on transient edge network headers;

It complies fully with the **ePrivacy Directive (Directive 2002/58/EC)**, PECR (UK), and Article 5(3) exemptions. No intrusive cookie consent banner is legally required or implemented.

---

## 5. Information You Voluntarily Provide

We only collect and process personal data that you intentionally and voluntarily transmit to us.

### 5.1 Project Quote Inquiries & Client Requirements Form
When you request a freelance project estimate or scope a build via our modal dialog (`?hire=true`), we collect:
* **Your Name / Company Designation:** Used to address you professionally in correspondence.
* **Email Address or Phone / WhatsApp Number:** Used exclusively to transmit the customized project proposal, deliverables breakdown, and timeline.
* **Project Specifications & Scope Notes:** Technical features, timeline expectations, budget corridors, and reference links you submit.
* **Intended Use:** This data is stored within our secure Supabase database and used solely for contract evaluation, proposal generation, and direct bilateral communications. It is never sold, shared with marketing agencies, or added to automated promotional newsletter blasts.

### 5.2 Client Reviews & Testimonials
When clients or collaborators submit public feedback via our Review Form (`?review=true`), we collect:
* **Author Name & Professional Role / Organization:** Displayed publicly on the homepage reviews carousel to establish professional credibility.
* **Star Rating (1–5) and Review Narrative:** Your subjective feedback regarding project execution, responsiveness, code quality, and delivery.
* **Associated Project Identifier:** Mapping the feedback to a verified build (e.g., Shopify theme development, mobile app delivery).
* **Consent:** By clicking "Submit Review", you explicitly consent to the public publication of your supplied feedback on `adilrahman.cc`. You retain the right to have your testimonial modified or permanently removed at any time upon request.

### 5.3 Direct Electronic Communications
If you communicate directly with Adil Rahman via email (`adilrahman3063@gmail.com`), WhatsApp (+91 9207114070), LinkedIn, or GitHub, we retain those communication transcripts solely for the duration necessary to satisfy your project requirements, maintain professional accounting records, or fulfill contractual warranties.

---

## 6. Data We Strictly Do Not Collect

To provide absolute clarity, our platform explicitly rejects the following invasive monitoring practices:

* **No Cross-Site Tracking Pixels:** We do not embed the Meta (Facebook) Pixel, TikTok Pixel, LinkedIn Insight Tag, Pinterest Tag, or any advertising retargeting snippets.
* **No Behavioral Session Recording:** We do not execute session replay software (such as Hotjar, FullStory, or Microsoft Clarity) that records mouse movements, scrolling paths, or form keystrokes.
* **No Canvas or Audio Fingerprinting:** We do not analyze browser canvas rendering quirks, WebGL extensions, or audio context latency to construct unique hardware signatures.
* **No Invasive Device Telemetry:** We do not inspect your device battery status, accelerometer, ambient light sensors, or local network topology.
* **No Automated Credit or Background Profiling:** We perform no automated credit checks or behavioral algorithmic evaluations.
* **No Sensitive Special Category Data:** We never request, process, or record data revealing racial or ethnic origin, political opinions, religious beliefs, trade union membership, genetic or biometric data, health status, or sexual orientation.

---

## 7. Client-Side Browser Storage (Cookies & Local Storage)

This website utilizes minimal client-side browser storage technologies (`localStorage` and `sessionStorage`) strictly for operational performance, zero-latency caching, and layout preservation.

### 7.1 Complete Storage Inventory

| Key Name | Storage Mechanism | Purpose & Architectural Function | Lifetime / Duration | Exemption Status |
| :--- | :--- | :--- | :--- | :--- |
| `cached_projects` | `localStorage` | Caches pre-rendered portfolio project records from Supabase to guarantee instantaneous paint speeds on repeat visits. | Persistent until manually cleared or cache invalidation. | Strictly Necessary / Functional |
| `cached_reviews` | `localStorage` | Caches public client testimonials to eliminate flash-of-unrendered-content (FOUC) while offline or on slow connections. | Persistent until cleared. | Strictly Necessary / Functional |
| `ar_visitor_logged_code` | `sessionStorage` | Remembers your coarse country code for the active browsing session to prevent duplicate increment pings to the database. | Session only (purged immediately upon closing the tab/browser). | Strictly Necessary / Functional |
| `resumeDraft_*` | `localStorage` | Stored exclusively on `/tools/resume-builder` to preserve your draft resume text and formatting in your local memory. Never sent to any server. | Persistent locally on your device only. | User-Directed Functional Storage |

### 7.2 How to Control or Flush Browser Storage
You can inspect, block, or delete any storage keys created by this website at any time via your browser settings:
* **Chromium (Chrome, Brave, Edge):** Press `F12` &rarr; Navigate to **Application** &rarr; **Storage** &rarr; Click **Clear site data**.
* **Firefox:** Press `F12` &rarr; Navigate to **Storage** &rarr; Right-click `adilrahman.cc` &rarr; Click **Delete All**.
* **Safari:** Preferences &rarr; **Privacy** &rarr; **Manage Website Data** &rarr; Search for `adilrahman.cc` &rarr; Click **Remove**.

---

## 8. Sub-Processors and Infrastructure Service Providers

To maintain 99.99% availability, lightning-fast edge delivery, and secure database persistence, we partner with industry-leading infrastructure providers. Each sub-processor has been audited for compliance with strict international data protection standards:

### 8.1 Cloudflare, Inc.
* **Corporate Headquarters:** 101 Townsend St, San Francisco, CA 94107, USA.
* **Operational Scope:** DNS resolution, DDoS defense, SSL/TLS certificate termination, static asset CDN distribution, and edge header routing (`cf-ipcountry`).
* **Privacy Standard:** Certified under the EU-U.S. Data Privacy Framework (DPF) and ISO/IEC 27001. Cloudflare processes incoming traffic at regional edge facilities without retaining payload data unless required for immediate security filtering.
* **Policy Reference:** [Cloudflare Privacy Policy](https://www.cloudflare.com/privacypolicy/)

### 8.2 Supabase, Inc.
* **Corporate Headquarters:** 970 Toa Payoh North, Singapore.
* **Operational Scope:** Cloud PostgreSQL database hosting, Row-Level Security (RLS) enforcement, and encrypted REST endpoints for project directories, customer reviews, and project requests.
* **Privacy Standard:** SOC2 Type II certified, GDPR compliant, enterprise-grade TLS encryption in transit and AES-256 encryption at rest.
* **Policy Reference:** [Supabase Privacy Policy](https://supabase.com/privacy)

### 8.3 Google LLC (Google Workspace & Search Console)
* **Corporate Headquarters:** 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA.
* **Operational Scope:** Direct email correspondence (`adilrahman3063@gmail.com`) and search index performance auditing via Google Search Console.
* **Privacy Standard:** ISO 27001 certified, EU Model Contract Clauses, robust anti-spam and transport encryption.
* **Policy Reference:** [Google Privacy Policy](https://policies.google.com/privacy)

### 8.4 Meta Platforms, Inc. (WhatsApp Cloud API)
* **Corporate Headquarters:** 1 Hacker Way, Menlo Park, CA 94025, USA.
* **Operational Scope:** Optional, user-initiated direct messaging support via WhatsApp (+91 9207114070).
* **Privacy Standard:** End-to-end encryption for peer communications; enterprise API security for automated webhooks.
* **Policy Reference:** [WhatsApp Privacy Policy](https://www.whatsapp.com/legal/privacy-policy)

---

## 9. Legal Bases for Data Processing (GDPR / UK GDPR)

Under Article 6 of the General Data Protection Regulation (Regulation (EU) 2016/679) and UK GDPR, any processing of personal data must be anchored to an explicit lawful basis. Our processing activities align with the following grounds:

1. **Contractual Necessity (Article 6(1)(b) GDPR):**  
   When you submit a project requirement, budget estimate, or service inquiry, processing your contact information and technical specifications is strictly necessary to prepare a commercial proposal, calculate turnaround schedules, and perform pre-contractual steps at your direct request.
2. **Legitimate Interests (Article 6(1)(f) GDPR):**  
   We process technical request headers (such as user-agent and coarse country codes in volatile memory) under our legitimate interest to:
   - Defend our servers against malicious DDoS attacks, scraping bots, and brute-force injections.
   - Display aggregate global traffic density on our interactive network map.
   - Deliver optimized responsive assets tailored to your device's screen dimensions and modern image format support (WebP/AVIF).  
   *Balancing Test:* Because IP addresses are purged instantly and only high-level aggregate counts are stored, our legitimate interest does not override your fundamental privacy rights or freedoms.
3. **Explicit Consent (Article 6(1)(a) GDPR):**  
   When you voluntarily submit a public review or testimonial on the website, you provide explicit, affirmative consent for your name, role, and feedback text to be displayed publicly. You may withdraw this consent at any time.

---

## 10. Your International Privacy Rights

Regardless of your geographic location, we respect your comprehensive rights regarding any personal data we hold about you. Under the GDPR, UK Data Protection Act, and applicable international laws, you are entitled to:

1. **Right of Access (Article 15 GDPR):** You have the right to request a formal copy of any personal data we maintain concerning you, alongside verification of the categories processed, purposes, and retention periods.
2. **Right to Rectification (Article 16 GDPR):** You have the right to require that we rectify inaccurate or incomplete personal records concerning you (e.g., updating a submitted project scope or changing a testimonial attribution).
3. **Right to Erasure ("Right to be Forgotten", Article 17 GDPR):** You have the right to demand the permanent deletion of your personal records from our database systems without undue delay, provided the data is no longer necessary for contractual or statutory compliance.
4. **Right to Restriction of Processing (Article 18 GDPR):** You have the right to suspend active processing of your data while an accuracy dispute or legal challenge is evaluated.
5. **Right to Data Portability (Article 20 GDPR):** You have the right to receive your voluntarily provided data in a structured, commonly used, machine-readable format (JSON or CSV) or have it transferred directly to another controller.
6. **Right to Object (Article 21 GDPR):** You have the right to object at any time to processing grounded in legitimate interests. We will immediately cease processing unless compelling legitimate grounds override your objection.
7. **Right to Withdraw Consent (Article 7(3) GDPR):** Where processing is grounded in consent (such as public testimonials), you may withdraw your consent at any time without affecting the lawfulness of processing undertaken prior to withdrawal.
8. **Right to Lodge a Complaint:** You retain the statutory right to lodge a formal complaint with a competent supervisory authority in your country of residence, workplace, or place of alleged infringement (e.g., the Information Commissioner's Office (ICO) in the UK, the Data Protection Commission (DPC) in Ireland, or the CNIL in France).

To exercise any of these rights, email your request directly to **[adilrahman3063@gmail.com](mailto:adilrahman3063@gmail.com)**. We respond to and execute all verified statutory requests within **30 calendar days** free of charge.

---

## 11. Specific Disclosures for California Residents (CCPA/CPRA)

Under the **California Consumer Privacy Act of 2018 (CCPA)**, as amended by the **California Privacy Rights Act of 2020 (CPRA)** (Cal. Civ. Code § 1798.100 et seq.), California residents are granted specific transparency disclosures and consumer rights:

### 11.1 Categories of Personal Information Collected (Past 12 Months)
* **Identifiers:** Name, email address, phone number (collected only when voluntarily submitted via contact or review forms).
* **Internet or Other Electronic Network Activity:** Coarse country codes (e.g., `US`) aggregated at the edge; zero IP addresses or granular browsing histories are recorded.
* **Commercial Information:** Project scope descriptions, accepted quote values, and commercial communications regarding freelance deliverables.
* **Sensitive Personal Information:** We **never** collect Social Security numbers, driver's licenses, biometric records, precise geolocation, financial card passwords, or racial/ethnic backgrounds.

### 11.2 "Do Not Sell or Share My Personal Information"
* **We do not sell personal information.** We have never sold, rented, leased, or monetized personal information to third parties, data brokers, or advertising networks for monetary or other valuable consideration.
* **We do not share personal information for cross-context behavioral advertising.** We do not track users across disparate websites to serve targeted ads.
* Consequently, we have not provided an opt-out link for selling/sharing because the practice is fundamentally non-existent across our entire technical infrastructure.

### 11.3 California Consumer Rights
California residents have the right to know, delete, correct, and limit the use of their sensitive personal information, as well as the right to be free from discrimination for exercising any CCPA/CPRA right. Requests can be submitted via email to [adilrahman3063@gmail.com](mailto:adilrahman3063@gmail.com).

---

## 12. Compliance with India's Digital Personal Data Protection Act (DPDP)

As an independent software developer operating from Kerala, India, our data governance adheres strictly to the **Digital Personal Data Protection Act, 2023 (DPDP Act)**:

1. **Purpose Limitation:** Any personal digital data collected through voluntary project submissions is processed solely for the clear, specific purpose for which you provided it.
2. **Data Minimization:** We do not harvest extraneous identifiers or background device logs.
3. **Data Security Safeguards:** We employ industry-standard encryption, Row-Level Security, and restricted API credentials to protect personal data from unauthorized access or exfiltration.
4. **Data Fiduciary Accountability:** Adil Rahman acts as the responsible Data Fiduciary. You may contact us at any time to inspect your records, demand erasure, or address privacy concerns.
5. **Grievance Redressal:** If you have an unresolved grievance concerning our handling of your personal data, you may submit a formal complaint to our Data Protection Contact at `adilrahman3063@gmail.com`. You retain the right to escalate unresolved grievances to the Data Protection Board of India.

---

## 13. In-Browser Tools & Client-Side Utility Privacy (Fileo & Resume Builder)

Our portfolio features several interactive software tools and showcases that operate under special, client-side zero-server privacy paradigms:

### 13.1 Free ATS Resume & CV Builder (`/tools/resume-builder`)
* **100% Client-Side In-Memory Execution:** The resume editor is built with pure vanilla JavaScript, HTML5, and CSS print stylesheets.
* **Zero Document Uploads:** When you compose your resume, import text, or generate a PDF, **no text, contact information, job history, or educational credentials are ever transmitted to our server, Supabase, or any third party**.
* **Local Storage Persistence:** All document revisions are saved strictly within your own device's `localStorage` (`resumeDraft_*`). If you clear your browser cache or open the tool in an Incognito window, your resume data ceases to exist on that device.
* **Export Engines:** PDF rendering executes via native browser `window.print()` or client-side Canvas rendering without external server roundtrips.

### 13.2 Fileo In-Browser Utilities Platform (`https://fileo.cc`)
* **WebAssembly & Canvas Client Decoding:** Fileo converts images (HEIC, WebP, AVIF, PNG, JPG), vectors (SVG), and subtitle files (SRT, VTT) entirely within the user's browser memory utilizing client-side WebAssembly (`libheif`), OffscreenCanvas, and Web Streams.
* **Absolute File Privacy:** Files you select or drag onto the dropzone are **never uploaded to any server or cloud bucket**. Your sensitive photos, receipts, documents, and subtitles remain 100% private on your machine.
* **Zero CLS & Clean AdSense Monetization:** Display advertising on Fileo adheres to Google AdSense guidelines with pre-reserved slot heights preventing Cumulative Layout Shift (CLS = 0).

---

## 14. Security Architecture, Encryption & Data Retention

We maintain stringent technical, procedural, and organizational security countermeasures to safeguard the integrity and confidentiality of our systems:

### 14.1 Technical Security Controls
* **Transport Encryption (TLS 1.3):** All traffic between your browser and `adilrahman.cc` is enforced over HTTPS utilizing Modern TLS 1.3 encryption with strict HTTP Strict Transport Security (HSTS) headers.
* **PostgreSQL Row-Level Security (RLS):** Our Supabase database tables enforce strict database-level access policies. Anonymous clients are restricted from reading private project submissions or modifying core directories.
* **Edge Proxy Protections:** Cloudflare Edge Web Application Firewall (WAF) mitigates malicious automated bots, Layer 7 DDoS bursts, cross-site scripting (XSS), and SQL injection attempts before requests reach application runtimes.
* **Secure API Key Segregation:** Public anonymous client keys (`anon-key`) are strictly isolated from elevated service role secrets. Service role keys are never bundled into client-side JavaScript or committed to version control.

### 14.2 Data Retention Standards
* **Voluntary Project Inquiries:** Retained within our secure Supabase database for a maximum period of **24 months** following project resolution or negotiation completion, after which records are purged during routine database pruning.
* **Published Client Testimonials:** Retained indefinitely while the referenced build remains active in our portfolio, or until the author requests modification or removal.
* **Aggregated Country Counters:** Non-identifiable, cumulative numerical counts are maintained indefinitely to preserve historical network traffic trends.
* **Browser Session Storage:** Cleared automatically when you close your browser tab.

---

## 15. Third-Party External Links & Portfolio Demonstrations

Our website contains links directing you to external websites, third-party software repositories (e.g., GitHub), client production storefronts (e.g., Shopify automotive websites), social media platforms (LinkedIn, X/Twitter, Instagram), and live hosted web applications (Vercel, Cloudflare Pages, Railway).

Please be advised that once you navigate away from `adilrahman.cc`, our Privacy Policy ceases to apply. We have no direct operational control over the content, tracking technologies, or privacy practices of external third-party domains. We strongly encourage you to review the individual privacy policies of any external destination you visit.

---

## 16. Children's Online Privacy Protection Act (COPPA)

Our website and services are intended exclusively for general commercial audiences, technology professionals, adult students, business founders, and clients seeking bespoke software engineering. We do not knowingly solicit, collect, or process personal information from children under the age of 13 (or under 16 within the European Economic Area). 

If we discover that personal data pertaining to a child under the statutory age of consent has been inadvertently submitted through our contact forms without verifiable parental authorization, we will immediately take steps to permanently delete that information from our storage systems. If you suspect that a minor has submitted personal information to us, please notify us immediately at [adilrahman3063@gmail.com](mailto:adilrahman3063@gmail.com).

---

## 17. Amendments and Version History

Technology, statutory regulations, and our software architectures evolve over time. We reserve the right to modify, amend, or update this Privacy Policy at our discretion to reflect technical upgrades, new portfolio features, or evolving legal frameworks.

When updates occur, we will revise the **"Last Updated"** timestamp at the top of this document. Any modifications become effective immediately upon publication on this page. We encourage you to review this policy periodically to remain informed regarding our privacy standards.

### Version History
* **v3.0.0 (November 10, 2026):** Comprehensive architectural expansion detailing zero-knowledge edge country telemetry (`cf-ipcountry`), Supabase atomic counter persistence, in-browser client utilities (Fileo & Resume Builder), and full alignment with DPDP Act 2023, GDPR, and CCPA/CPRA.
* **v2.0.0 (October 2026):** Updated to incorporate Supabase PostgreSQL data persistence, client review collection terms, and Cloudflare Pages edge deployments.
* **v1.0.0 (July 2026):** Initial formal privacy policy publication for `adilrahman.cc`.

---

## 18. Contact & Data Protection Officer Inquiries

If you have questions, feedback, or statutory requests concerning this Privacy Policy, our zero-knowledge architectures, or the processing of your data, please contact the Data Controller directly:

* **Attn:** Adil Rahman (Data Controller)
* **Email:** [adilrahman3063@gmail.com](mailto:adilrahman3063@gmail.com)
* **Phone / WhatsApp:** +91 9207114070
* **Official Website:** [https://adilrahman.cc](https://adilrahman.cc)
* **Postal Address:** Thrissur, Kerala, India — PIN 680001

*All verified privacy inquiries, access requests, or deletion notices are processed and fulfilled within 30 calendar days.*

