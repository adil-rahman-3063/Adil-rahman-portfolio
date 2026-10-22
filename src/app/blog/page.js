import { allBlogs } from '../../data/blogData';
import Link from 'next/link';

const SITE_URL = 'https://adilrahman.cc';

export const metadata = {
  title: 'Blog & Articles | Adil Rahman',
  description: 'Technical articles, engineering insights, and development deep-dives by Adil Rahman covering Flutter, PWAs, full-stack web, and hardware workarounds.',
  openGraph: {
    title: 'Blog & Articles | Adil Rahman',
    description: 'Technical articles, engineering insights, and development deep-dives by Adil Rahman.',
    url: `${SITE_URL}/blog`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog & Articles | Adil Rahman',
    description: 'Technical articles, engineering insights, and development deep-dives by Adil Rahman.',
    creator: '@adilrahmanms',
  },
  alternates: {
    canonical: '/blog',
  },
};

export default function BlogIndexPage() {
  return (
    <div className="blog-index-page">
      {/* ── Navigation ── */}
      <nav className="blog-nav">
        <Link href="/" className="blog-back-link">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="#8D6E63" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Portfolio
        </Link>
        <span className="blog-nav-brand">ADIL RAHMAN</span>
      </nav>

      {/* ── Header ── */}
      <header className="blog-header">
        <div className="blog-header-inner">
          <span className="blog-tag">// ARTICLES & THOUGHTS</span>
          <h1 className="blog-title">Engineering Stories & Notes</h1>
          <p className="blog-excerpt">
            Behind-the-scenes engineering write-ups, experiments, and technical deep-dives into mobile architectures, PWAs, and full-stack solutions.
          </p>
          <div className="blog-header-line" />
        </div>
      </header>

      {/* ── Blog Posts List ── */}
      <main className="blog-main">
        <div className="blog-list-container">
          {allBlogs.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="blog-card-link">
              <article className="blog-card">
                <div className="blog-card-meta">
                  <span className="blog-date">{post.date}</span>
                  <span className="blog-meta-sep">·</span>
                  <span className="blog-read-time">{post.readTime}</span>
                </div>
                <h2 className="blog-card-title">{post.title}</h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <span className="blog-read-cta">
                  Read Article →
                </span>
              </article>
            </Link>
          ))}
        </div>
      </main>

      {/* ── Footer CTA ── */}
      <div className="blog-footer-cta">
        <div className="blog-footer-cta-inner">
          <p className="blog-footer-label">// LOOKING FOR A DEVELOPER?</p>
          <h3 className="blog-footer-title">Let&apos;s Build Something Together</h3>
          <p className="blog-footer-desc">
            Available for freelance full-stack, mobile (Flutter), Shopify storefronts, and MVP builds worldwide.
          </p>
          <Link href="/#contact" className="blog-cta-btn">Get In Touch</Link>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');

        .blog-index-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #1A0A08 0%, #231513 100%);
          color: #EFEBE9;
          font-family: 'Special Elite', monospace;
        }

        .blog-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(141, 110, 99, 0.15);
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(26, 10, 8, 0.9);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .blog-back-link {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #8D6E63;
          text-decoration: none;
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 0.5px;
          transition: color 0.2s;
        }
        .blog-back-link:hover { color: #EFEBE9; }
        .blog-back-link:hover svg path { stroke: #EFEBE9; }

        .blog-nav-brand {
          font-size: 11px;
          color: rgba(141, 110, 99, 0.5);
          letter-spacing: 2px;
        }

        .blog-header {
          padding: 64px 24px 32px;
        }

        .blog-header-inner {
          max-width: 760px;
          margin: 0 auto;
        }

        .blog-tag {
          font-size: 11px;
          color: #8D6E63;
          letter-spacing: 1.5px;
          font-weight: bold;
          display: block;
          margin-bottom: 12px;
        }

        .blog-title {
          font-size: 32px;
          line-height: 1.3;
          color: #FAF6EE;
          margin: 0 0 16px;
          letter-spacing: 0.5px;
        }

        .blog-excerpt {
          font-size: 14px;
          line-height: 1.7;
          color: #BCAAA4;
          margin: 0 0 32px;
        }

        .blog-header-line {
          height: 1px;
          background: rgba(141, 110, 99, 0.2);
          width: 100%;
        }

        .blog-main {
          padding: 16px 24px 64px;
        }

        .blog-list-container {
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .blog-card-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }

        .blog-card {
          background-color: #FAF6EE;
          border: 1.5px solid #E8DFD0;
          border-radius: 8px;
          padding: 28px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
          display: flex;
          flex-direction: column;
        }

        .blog-card:hover {
          border-color: #8D6E63;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .blog-card-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: #8D6E63;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }

        .blog-meta-sep {
          color: rgba(141, 110, 99, 0.4);
        }

        .blog-card-title {
          font-size: 19px;
          color: #3E2723;
          margin: 0 0 12px;
          line-height: 1.4;
          font-weight: bold;
        }

        .blog-card-excerpt {
          font-size: 13px;
          line-height: 1.6;
          color: #5D4037;
          margin: 0 0 20px;
        }

        .blog-read-cta {
          font-size: 12px;
          color: #8D6E63;
          font-weight: bold;
          letter-spacing: 0.5px;
          display: inline-block;
          align-self: flex-start;
          transition: transform 0.2s;
        }

        .blog-card:hover .blog-read-cta {
          transform: translateX(4px);
        }

        .blog-footer-cta {
          border-top: 1px solid rgba(141, 110, 99, 0.15);
          padding: 56px 24px;
          background: rgba(26, 10, 8, 0.5);
        }

        .blog-footer-cta-inner {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }

        .blog-footer-label {
          font-size: 11px;
          color: #8D6E63;
          letter-spacing: 1.5px;
          margin: 0 0 12px;
        }

        .blog-footer-title {
          font-size: 24px;
          color: #FAF6EE;
          margin: 0 0 12px;
        }

        .blog-footer-desc {
          font-size: 13px;
          line-height: 1.6;
          color: #BCAAA4;
          margin: 0 0 28px;
        }

        .blog-cta-btn {
          display: inline-block;
          background-color: #FAF6EE;
          color: #3E2723;
          padding: 12px 28px;
          border-radius: 4px;
          text-decoration: none;
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 0.5px;
          transition: background-color 0.2s, color 0.2s, transform 0.2s;
        }

        .blog-cta-btn:hover {
          background-color: #8D6E63;
          color: #FAF6EE;
          transform: translateY(-1px);
        }

        @media (max-width: 600px) {
          .blog-title {
            font-size: 24px;
          }
          .blog-card {
            padding: 20px;
          }
          .blog-card-title {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
