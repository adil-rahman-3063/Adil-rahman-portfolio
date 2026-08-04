import { Special_Elite, La_Belle_Aurore } from "next/font/google";
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
    default: "Adil Rahman | Full-Stack, Flutter & Shopify Developer",
    template: "%s | Adil Rahman",
  },
  description:
    "Hire Adil Rahman — expert full-stack, Flutter & Shopify developer. I build high-performance web apps, mobile apps, and Shopify stores. Available for freelance projects worldwide.",

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
    title: "Adil Rahman | Full-Stack, Flutter & Shopify Developer",
    description:
      "Hire Adil Rahman — expert full-stack, Flutter & Shopify developer. I build high-performance web apps, mobile apps, and Shopify stores. Available for freelance projects worldwide.",
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
    title: "Adil Rahman | Full-Stack, Flutter & Shopify Developer",
    description:
      "Hire Adil Rahman — expert full-stack, Flutter & Shopify developer. Web apps, mobile apps, Shopify stores. Freelance projects worldwide.",
    images: ["/assets/og-image.png"],
    creator: "@adilrahmanms",
  },

  // ── Google Search Console verification ───────────────────────────────────
  // TODO: Replace the placeholder below with your real token from
  // Search Console → Add property → HTML tag method.
  // verification: {
  //   google: "YOUR_GOOGLE_VERIFICATION_TOKEN",
  // },
};

// ── JSON-LD Structured Data (Person schema) ────────────────────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Adil Rahman",
  url: SITE_URL,
  jobTitle: "Full-Stack Developer & Shopify Expert",
  description:
    "Freelance full-stack, Flutter & Shopify developer available for web apps, mobile apps, and e-commerce projects worldwide.",
  knowsAbout: [
    "Flutter",
    "React",
    "Next.js",
    "Shopify",
    "Web Development",
    "Mobile App Development",
    "E-commerce",
  ],
  // Add your social profile URLs here for Knowledge Panel eligibility:
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${specialElite.variable} ${laBelleAurore.variable}`}>
      <body>
        {children}
        {/* JSON-LD Structured Data for Google Knowledge Panel */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}


