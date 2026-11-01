import { allProjects } from '../../data/projectsData';
import SaasDirectoryClient from './SaasDirectoryClient';

const SITE_URL = 'https://adilrahman.cc';

export const metadata = {
  title: {
    absolute: 'SaaS Products & Cloud Apps | Adil Rahman',
  },
  description: 'Production-ready SaaS products, B2B membership management platforms, offline PWAs, and custom cloud apps built by Adil Rahman.',
  openGraph: {
    title: 'SaaS Products & Cloud Applications | Adil Rahman',
    description: 'Production-ready SaaS products, B2B membership management platforms, offline PWAs, and custom cloud apps built by Adil Rahman.',
    url: `${SITE_URL}/saas`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaaS Products & Cloud Applications | Adil Rahman',
    description: 'Production-ready SaaS products, B2B platforms, offline PWAs, and custom cloud apps built by Adil Rahman.',
    creator: '@adilrahmanms',
  },
  alternates: {
    canonical: '/project/saas',
  },
};

export default function SaasDirectoryPage() {
  return <SaasDirectoryClient initialProjects={allProjects} />;
}
