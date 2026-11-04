export const dynamic = 'force-static';

export default function manifest() {
  return {
    name: 'Adil Rahman — Full-Stack & Mobile Engineer',
    short_name: 'Adil Rahman',
    description: 'Portfolio, verified case studies, and engineering services by Adil Rahman — Full-Stack Next.js, Flutter, and Shopify Engineer.',
    start_url: '/',
    display: 'standalone',
    background_color: '#231513',
    theme_color: '#231513',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/assets/og-image.png',
        sizes: '1200x630',
        type: 'image/png',
      },
    ],
  };
}
