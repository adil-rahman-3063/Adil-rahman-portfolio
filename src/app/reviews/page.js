import { fetchReviewsFromSupabase } from '../../data/reviewsData';
import ReviewsPageClient from './ReviewsPageClient';

const SITE_URL = 'https://adilrahman.cc';

export const metadata = {
  title: {
    absolute: 'Verified Client Reviews & Testimonials (5.0★) | Adil Rahman',
  },
  description:
    'Read 100% verified 5-star client reviews for Adil Rahman. Direct feedback from CEOs, founders, and leaders on custom Flutter mobile apps, Shopify storefronts, and Next.js platforms.',
  keywords: [
    'Adil Rahman reviews',
    'Adil Rahman testimonials',
    'hire Flutter developer reviews',
    'Shopify developer feedback',
    'freelance full stack engineer ratings',
    'Kerala freelance developer reviews',
    'software contractor testimonials',
  ],
  openGraph: {
    title: 'Verified Client Reviews & Testimonials (5.0★) | Adil Rahman',
    description:
      'Direct feedback from startup founders, CEOs, and organization leaders who hired Adil Rahman for production Flutter apps, Shopify stores, and Next.js edge architectures.',
    url: `${SITE_URL}/reviews`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verified Client Reviews & Testimonials (5.0★) | Adil Rahman',
    description:
      '5.0★ verified ratings across custom mobile apps, Shopify e-commerce, and high-performance web engineering.',
    creator: '@adilrahmanms',
  },
  alternates: {
    canonical: '/reviews',
  },
};

export default async function ReviewsPage() {
  const reviews = await fetchReviewsFromSupabase();

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / totalReviews).toFixed(1)
      : '5.0';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE_URL}/#service`,
        name: 'Adil Rahman - Full-Stack & Flutter Developer',
        url: SITE_URL,
        image: `${SITE_URL}/assets/Gemini_Generated_Image_cfgv0jcfgv0jcfgv-removebg-preview.png`,
        telephone: '+919207114070',
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IN',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: avgRating,
          bestRating: '5',
          worstRating: '1',
          ratingCount: String(totalReviews || 1),
          reviewCount: String(totalReviews || 1),
        },
        review: reviews.map((r) => ({
          '@type': 'Review',
          author: {
            '@type': 'Person',
            name: r.name,
            jobTitle: r.role || 'Client',
          },
          datePublished: r.created_at ? r.created_at.split('T')[0] : '2024-09-15',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: String(r.rating || 5),
            bestRating: '5',
            worstRating: '1',
          },
          reviewBody: r.review,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/reviews#breadcrumb`,
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
            name: 'Client Reviews',
            item: `${SITE_URL}/reviews`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReviewsPageClient initialReviews={reviews} />
    </>
  );
}
