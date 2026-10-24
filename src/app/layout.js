import { Special_Elite, La_Belle_Aurore } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const specialElite = Special_Elite({
  variable: "--font-special-elite",
  weight: "400",
  subsets: ["latin"],
});

const laBelleAurore = La_Belle_Aurore({
  variable: "--font-la-belle-aurore",
  weight: "400",
  subsets: ["latin"],
});

const SITE_URL = "https://adilrahman.cc";

export const metadata = {
  // ── Title & Description ──────────────────────────────────────────────────
  title: {
    default: "Full-Stack, Flutter & Shopify Developer | Adil Rahman",
    template: "%s | Adil Rahman",
  },
  description:
    "Hire Adil Rahman — 5.0★ full-stack, Flutter & Shopify developer. Fast 1-3 week MVP delivery, clean code & high-converting storefronts. Get a quote today.",

  // ── Keywords (long-tail & intent-driven) ─────────────────────────────────
  keywords: [
    "Adil Rahman",
    "freelance developer",
    "hire developer",
    "full-stack developer",
    "Flutter developer",
    "Shopify developer",
    "Shopify expert",
    "web developer",
    "mobile app developer",
    "React developer",
    "Next.js developer",
    "app developer for hire",
    "Shopify store developer",
    "Flutter app developer",
    "freelance web developer",
    "portfolio",
    "software developer",
    "custom app development",
    "e-commerce developer",
    "Shopify marketing",
  ],

  // ── Canonical & Author ────────────────────────────────────────────────────
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "Adil Rahman", url: SITE_URL }],
  creator: "Adil Rahman",
  publisher: "Adil Rahman",

  // ── Robots ────────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Open Graph (Facebook, LinkedIn, WhatsApp previews) ───────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Adil Rahman Portfolio",
    title: "Freelance Full-Stack, Flutter & Shopify Developer | Adil Rahman",
    description:
      "Hire Adil Rahman — 5.0★ verified full-stack, Flutter & Shopify developer. Fast 1-3 week MVP delivery, clean code & high-converting storefronts. Get a free quote.",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Adil Rahman — Full-Stack, Flutter & Shopify Developer",
      },
    ],
  },

  // ── Twitter / X Card ─────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Freelance Full-Stack, Flutter & Shopify Developer | Adil Rahman",
    description:
      "Hire Adil Rahman — 5.0★ verified full-stack, Flutter & Shopify developer. 1-3 week MVP delivery. Fast turnaround & high-converting stores.",
    images: ["/assets/og-image.png"],
    creator: "@adilrahmanms",
  },
};

// ── JSON-LD Structured Data (Person, ProfessionalService & FAQPage) ─────────
const structuredSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Adil Rahman — Software Development & Shopify Solutions",
    image: `${SITE_URL}/assets/og-image.png`,
    url: SITE_URL,
    telephone: "+919207114070",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "8",
      bestRating: "5",
      worstRating: "1",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Adil Rahman",
    url: SITE_URL,
    jobTitle: "Full-Stack Developer, Flutter Engineer & Shopify Expert",
    description:
      "Freelance full-stack, Flutter & Shopify developer building high-performance web apps, mobile apps, and custom e-commerce storefronts worldwide.",
    knowsAbout: [
      "Flutter Mobile App Development",
      "React & Next.js Full-Stack Architecture",
      "Shopify Custom Theme & Liquid Development",
      "Progressive Web Apps (PWAs)",
      "Supabase & PostgreSQL Cloud Databases",
      "Cloudflare Edge Workers & APIs",
    ],
    sameAs: [
      "https://github.com/adil-rahman-3063",
      "https://x.com/adilrahmanms",
      "https://www.linkedin.com/in/adil-rahiman-3815b5290/",
      "https://www.instagram.com/adil__rahman_/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "adilrahman3063@gmail.com",
      telephone: "+919207114070",
      url: `${SITE_URL}/?hire=true`,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How can I hire Adil Rahman for a freelance project?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can hire Adil Rahman directly through his portfolio by requesting a quote, emailing adilrahman3063@gmail.com, or contacting via WhatsApp at +91 9207114070. Typical turnarounds range from 1 to 3 weeks.",
        },
      },
      {
        "@type": "Question",
        name: "What technologies does Adil Rahman specialize in?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Adil specializes in cross-platform mobile apps with Flutter (iOS & Android), full-stack web applications with Next.js and React, custom Shopify e-commerce theme engineering with Liquid, Supabase databases, and Cloudflare Workers.",
        },
      },
      {
        "@type": "Question",
        name: "Does Adil Rahman build custom Shopify stores and themes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Adil develops custom Shopify themes, builds custom Liquid sections, optimizes store speed, and creates tailored e-commerce checkout flows.",
        },
      },
      {
        "@type": "Question",
        name: "How fast can an MVP or custom web application be delivered?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most MVP projects, progressive web apps (PWAs), and marketing websites are developed and deployed within 1 to 3 weeks.",
        },
      },
    ],
  },
];

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${specialElite.variable} ${laBelleAurore.variable}`} suppressHydrationWarning>
      <head>
        {/* Preload LCP hero image so browser fetches it immediately */}
        <link
          rel="preload"
          as="image"
          href="/assets/Filipino_Freelance_Graphic_Designer_Instagram_Post-removebg-preview.png"
        />
      </head>
      <body suppressHydrationWarning>
        {/* Google Analytics (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-9BERHTPL4Q"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9BERHTPL4Q', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        {children}
        {/* JSON-LD Structured Data for Google Knowledge Panel, Star Ratings & FAQs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredSchemas) }}
        />
      </body>
    </html>
  );
}


