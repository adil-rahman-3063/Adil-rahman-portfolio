/**
 * robots.js — Next.js file convention
 * Generates /robots.txt at build time.
 *
 * `force-static` is required when using `output: 'export'` in next.config.mjs
 */
export const dynamic = "force-static";

const SITE_URL = "https://adilrahman.cc";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Disallow nothing — the whole portfolio should be indexed.
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
