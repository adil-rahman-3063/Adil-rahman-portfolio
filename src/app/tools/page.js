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
  return <ToolsHubClient />;
}
