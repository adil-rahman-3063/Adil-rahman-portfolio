import PrivacyClient from './PrivacyClient';

const SITE_URL = 'https://adilrahman.cc';

export const metadata = {
  title: {
    absolute: 'Privacy Policy & Zero-Knowledge Architecture | Adil Rahman',
  },
  description: 'Comprehensive privacy policy and technical architectural disclosure for adilrahman.cc. Privacy by design, zero-knowledge telemetry, and client-side processing.',
  keywords: [
    'Adil Rahman privacy policy',
    'zero-knowledge architecture',
    'privacy by design',
    'GDPR compliance developer portfolio',
    'CCPA transparency disclosure',
    'IP-free edge telemetry',
  ],
  openGraph: {
    title: 'Privacy Policy & Zero-Knowledge Architecture | Adil Rahman',
    description: 'Learn how adilrahman.cc protects visitor sovereignty with privacy-by-design architectures, edge telemetry, and zero tracking cookies.',
    url: `${SITE_URL}/privacy`,
    type: 'website',
    siteName: 'Adil Rahman // Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy & Zero-Knowledge Architecture | Adil Rahman',
    description: 'Privacy-by-design, edge telemetry, and zero tracking cookies on adilrahman.cc.',
    creator: '@adilrahmanms',
  },
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  const privacySchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy & Architecture Disclosure',
    headline: 'Privacy Policy & Zero-Knowledge Architecture of Adil Rahman',
    description: 'Formal privacy policy and technical architecture transparency disclosure for adilrahman.cc.',
    url: `${SITE_URL}/privacy`,
    datePublished: '2026-07-01',
    dateModified: '2026-11-10',
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Person',
      name: 'Adil Rahman',
      url: SITE_URL,
    },
    author: {
      '@type': 'Person',
      name: 'Adil Rahman',
      url: SITE_URL,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Portfolio',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Privacy Policy',
        item: `${SITE_URL}/privacy`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PrivacyClient />
    </>
  );
}
