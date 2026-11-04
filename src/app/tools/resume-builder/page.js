import ResumeBuilderClient from './ResumeBuilderClient';

const SITE_URL = 'https://adilrahman.cc';

export const metadata = {
  title: {
    absolute: 'Free ATS Resume Builder | Instant PDF Export, No Watermark',
  },
  description: 'Free interactive browser ATS resume & CV builder with live editing, custom section reordering, 6 themes, and instant PDF export. No login or watermark.',
  keywords: [
    'free ATS resume builder',
    'resume builder without watermark',
    'free online CV maker with PDF export',
    'ATS friendly resume templates',
    'markdown resume editor',
    'Adil Rahman resume editor',
    'developer tools',
  ],
  openGraph: {
    title: 'Free ATS Resume Builder | Instant PDF Export, No Watermark',
    description: 'Free interactive browser ATS resume builder with live editing, 6 themes, and instant PDF export without login or watermark.',
    url: `${SITE_URL}/tools/resume-builder`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ATS Resume Builder | Instant PDF Export, No Watermark',
    description: 'Free interactive browser ATS resume builder. Live editing, 6 themes, zero paywall, instant PDF export.',
    creator: '@adilrahmanms',
  },
  alternates: {
    canonical: '/tools/resume-builder',
  },
};

export default function ToolsResumeBuilderPage() {
  const webAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Free ATS Resume & CV Builder',
    url: `${SITE_URL}/tools/resume-builder`,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    description: 'Client-side zero-dependency ATS resume editor with live WYSIWYG editing, 6 curated theme palettes, and dual PDF export engines.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: 'Adil Rahman',
      url: SITE_URL,
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is this ATS resume builder truly 100% free with no watermark?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Unlike commercial resume services that hold your finished resume hostage behind a paywall, this editor is 100% free with zero watermarks or subscriptions.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is my personal resume data stored on your server?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. All personal resume data, bullet points, and formatting choices are stored exclusively in your browser localStorage without being sent to external databases.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do automated ATS scanners evaluate this resume layout?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The builder generates a semantic, single-column document stream without multi-column table traps or text boxes, ensuring 100% parsing accuracy across Workday, Lever, Greenhouse, and Taleo.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ResumeBuilderClient />
    </>
  );
}
