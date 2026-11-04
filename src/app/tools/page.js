import ToolsHubClient from './ToolsHubClient';

const SITE_URL = 'https://adilrahman.cc';

export const metadata = {
  title: {
    absolute: 'Developer & Productivity Tools | Adil Rahman',
  },
  description: 'Interactive web tools, ATS-friendly resume builders, and developer utilities engineered by Adil Rahman. 100% free, client-side, zero login.',
  openGraph: {
    title: 'Developer & Productivity Tools | Adil Rahman',
    description: 'Interactive web tools, ATS-friendly resume builders, and developer utilities engineered by Adil Rahman.',
    url: `${SITE_URL}/tools`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Developer & Productivity Tools | Adil Rahman',
    description: 'Interactive web tools and utilities engineered by Adil Rahman.',
    creator: '@adilrahmanms',
  },
  alternates: {
    canonical: '/tools',
  },
};

export default function ToolsHubPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Developer & Productivity Tools',
    description: 'Interactive web tools, ATS-friendly resume builders, and developer utilities engineered by Adil Rahman. 100% free, client-side, zero login.',
    url: `${SITE_URL}/tools`,
    mainEntity: {
      '@type': 'ItemList',
      name: 'Developer Tools by Adil Rahman',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Free ATS Resume & CV Builder',
          description: 'Client-side ATS resume builder featuring live WYSIWYG editing, dual export engines, 6 themes, and zero login.',
          url: `${SITE_URL}/tools/resume-builder`,
        },
      ],
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
        name: 'Tools',
        item: `${SITE_URL}/tools`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ToolsHubClient />
    </>
  );
}
