import { allProjects, PROJECT_CATEGORIES, getCategoryProjects } from '../../../data/projectsData';
import { notFound } from 'next/navigation';
import CategoryDirectoryClient from './CategoryDirectoryClient';

const SITE_URL = 'https://adilrahman.cc';

export async function generateStaticParams() {
  return [
    { category: 'saas' },
    { category: 'freelance' },
    { category: 'personal-project' },
    { category: 'personal' },
  ];
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const normCategory = category === 'personal' ? 'personal-project' : category;
  const cat = PROJECT_CATEGORIES[normCategory];
  if (!cat) return {};

  const cleanTitle = cat.metaTitle || `${cat.name} | Projects by Adil Rahman`;
  const cleanDescription = cat.metaDesc || cat.tagline;

  return {
    title: {
      absolute: cleanTitle,
    },
    description: cleanDescription,
    keywords: [
      cat.name,
      `Adil Rahman ${cat.name}`,
      `${category} software development`,
      'full-stack engineering',
      'portfolio projects',
    ],
    openGraph: {
      title: cleanTitle,
      description: cleanDescription,
      url: `${SITE_URL}/project/${category}`,
      type: 'website',
      siteName: 'Adil Rahman // Projects',
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description: cleanDescription,
      creator: '@adilrahmanms',
    },
    alternates: {
      canonical: `/project/${normCategory}`,
    },
  };
}

export default async function ProjectCategoryPage({ params }) {
  const { category } = await params;
  const normCategory = category === 'personal' ? 'personal-project' : category;
  const cat = PROJECT_CATEGORIES[normCategory];

  if (!cat) notFound();

  const projects = getCategoryProjects(normCategory);

  return (
    <CategoryDirectoryClient
      category={category}
      initialProjects={projects}
      allInitialProjects={allProjects}
    />
  );
}
