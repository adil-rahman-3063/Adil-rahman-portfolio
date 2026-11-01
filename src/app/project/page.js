import { allProjects } from '../../data/projectsData';
import ProjectsHubClient from './ProjectsHubClient';

const SITE_URL = 'https://adilrahman.cc';

export const metadata = {
  title: {
    absolute: 'Projects & Engineering Showcase | Adil Rahman',
  },
  description: 'Production-ready SaaS platforms, freelance client systems, and open-source mobile apps built by Adil Rahman across Next.js, Flutter, and Shopify.',
  openGraph: {
    title: 'Projects & Engineering Showcase | Adil Rahman',
    description: 'Production-ready SaaS platforms, freelance client systems, and open-source mobile apps built by Adil Rahman.',
    url: `${SITE_URL}/project`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects & Engineering Showcase | Adil Rahman',
    description: 'Production-ready SaaS platforms, freelance client systems, and open-source mobile apps built by Adil Rahman.',
    creator: '@adilrahmanms',
  },
  alternates: {
    canonical: '/project',
  },
};

export default function ProjectsIndexPage() {
  return <ProjectsHubClient initialProjects={allProjects} />;
}
