import { allBlogs } from '../data/blogData';
import { allProjects, PROJECT_CATEGORIES, getProjectCategory, fetchProjectsFromSupabase } from '../data/projectsData';
import { allServices } from '../data/servicesData';

/**
 * sitemap.js — Next.js file convention
 * Generates /sitemap.xml at build time.
 * Submit this URL to Google Search Console:
 *   https://adilrahman.cc/sitemap.xml
 *
 * `force-static` is required when using `output: 'export'` in next.config.mjs
 */
export const dynamic = "force-static";

const SITE_URL = "https://adilrahman.cc";

export default async function sitemap() {
  const projectsList = await fetchProjectsFromSupabase();

  const blogRoutes = allBlogs.map((post) => ({
    url: `${SITE_URL}/blog/${post.id}`,
    lastModified: new Date(post.date ? (Date.parse(post.date) || Date.now()) : Date.now()),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Category index routes: /project/saas, /project/freelance, /project/personal-project
  const projectCategoryRoutes = Object.keys(PROJECT_CATEGORIES).map((catSlug) => ({
    url: `${SITE_URL}/project/${catSlug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Individual project routes: /project/[category]/[id]
  const projectDetailRoutes = projectsList.map((project) => {
    const category = getProjectCategory(project.id, project);
    return {
      url: `${SITE_URL}/project/${category}/${project.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.85,
    };
  });

  // Legacy saas routes (preserved so already-indexed search links remain active)
  const legacySaasRoutes = projectsList.map((project) => ({
    url: `${SITE_URL}/saas/${project.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  const serviceRoutes = allServices.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/project`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/saas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/tools/resume-builder`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/resume-builder`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...projectCategoryRoutes,
    ...projectDetailRoutes,
    ...serviceRoutes,
    ...blogRoutes,
    ...legacySaasRoutes,
  ];
}
