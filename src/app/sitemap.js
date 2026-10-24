import { allBlogs } from '../data/blogData';
import { allProjects } from '../data/projectsData';
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

export default function sitemap() {
  const blogRoutes = allBlogs.map((post) => ({
    url: `${SITE_URL}/blog/${post.id}`,
    lastModified: new Date(post.date ? (Date.parse(post.date) || Date.now()) : Date.now()),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const saasRoutes = allProjects.map((project) => ({
    url: `${SITE_URL}/saas/${project.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  const saaRoutes = allProjects.map((project) => ({
    url: `${SITE_URL}/saa/${project.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
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
      url: `${SITE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/saas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/saa`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/resume-builder`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...serviceRoutes,
    ...saasRoutes,
    ...saaRoutes,
    ...blogRoutes,
  ];
}
