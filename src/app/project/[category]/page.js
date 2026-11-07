import { allProjects, PROJECT_CATEGORIES, getCategoryProjects } from '../../../data/projectsData';
import { notFound } from 'next/navigation';
import CategoryDirectoryClient from './CategoryDirectoryClient';

const SITE_URL = 'https://adilrahman.cc';

export async function generateStaticParams() {
  return [
    { category: 'saas' },
    { category: 'niche-sites' },
    { category: 'niche-site' },
    { category: 'freelance' },
    { category: 'personal-project' },
    { category: 'personal' },
  ];
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const normCategory = category === 'personal' ? 'personal-project' : (category === 'niche-site' ? 'niche-sites' : category);
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
  const normCategory = category === 'personal' ? 'personal-project' : (category === 'niche-site' ? 'niche-sites' : category);
  const cat = PROJECT_CATEGORIES[normCategory];

  if (!cat) notFound();

  const projects = getCategoryProjects(normCategory);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: cat.name,
    description: cat.metaDesc || cat.tagline,
    url: `${SITE_URL}/project/${normCategory}`,
    mainEntity: {
      '@type': 'ItemList',
      name: `${cat.name} Portfolio Projects`,
      itemListElement: (projects || []).map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: p.title,
        url: `${SITE_URL}/project/${normCategory}/${p.id}`,
      })),
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
        name: 'Projects',
        item: `${SITE_URL}/project`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: cat.name,
        item: `${SITE_URL}/project/${normCategory}`,
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
      <CategoryDirectoryClient
        category={category}
        initialProjects={projects}
        allInitialProjects={allProjects}
      />
    </>
  );
}
