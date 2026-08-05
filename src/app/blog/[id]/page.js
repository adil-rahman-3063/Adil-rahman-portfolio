import { allBlogs } from '../../../data/blogData';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const SITE_URL = 'https://adilrahman.cc';

// Required for next static export — generates a route for each blog post
export async function generateStaticParams() {
  return allBlogs.map((post) => ({ id: post.id }));
}

// Per-post SEO metadata
export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = allBlogs.find((p) => p.id === id);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${id}`,
      type: 'article',
      publishedTime: post.date,
      authors: ['Adil Rahman'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      creator: '@adilrahmanms',
    },
    alternates: { canonical: `/blog/${id}` },
  };
}

// ── Simple Markdown → JSX Renderer ──────────────────────────────────────────
function renderMarkdown(md) {
  const lines = md.split('\n');
  const elements = [];
  let listItems = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(<ul key={key++} className="blog-list">{listItems}</ul>);
      listItems = [];
    }
  };

  const inlineRender = (text) => {
    // Single capturing group only — no nested groups — avoids undefined split parts
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
    return parts.filter(Boolean).map((part, i) => {
      if (!part) return null;
      if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
      if (/^\*[^*]+\*$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) return <a key={i} href={linkMatch[2]} target="_blank" rel="noreferrer" className="blog-link">{linkMatch[1]}</a>;
      return part;
    });
  };

  for (const line of lines) {
    if (line.startsWith('# ')) {
      flushList();
      elements.push(<h1 key={key++} className="blog-h1">{inlineRender(line.slice(2))}</h1>);
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={key++} className="blog-h2">{inlineRender(line.slice(3))}</h2>);
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={key++} className="blog-h3">{inlineRender(line.slice(4))}</h3>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      listItems.push(<li key={key++} className="blog-li">{inlineRender(line.slice(2))}</li>);
    } else if (line.trim() === '---') {
      flushList();
      elements.push(<hr key={key++} className="blog-hr" />);
    } else if (line.trim() === '') {
      flushList();
    } else {
      flushList();
      elements.push(<p key={key++} className="blog-p">{inlineRender(line)}</p>);
    }
  }
  flushList();
  return elements;
}

// ── JSON-LD Article Schema ───────────────────────────────────────────────────
function ArticleJsonLd({ post }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: 'Adil Rahman',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: 'Adil Rahman',
      url: SITE_URL,
    },
    datePublished: post.date,
    url: `${SITE_URL}/blog/${post.id}`,
    mainEntityOfPage: `${SITE_URL}/blog/${post.id}`,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Page Component ───────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }) {
  const { id } = await params;
  const post = allBlogs.find((p) => p.id === id);
  if (!post) notFound();

  const rendered = renderMarkdown(post.content);

  return (
    <>
      <ArticleJsonLd post={post} />
      <div className="blog-page">
        {/* ── Navigation ───────────────────────────────────────────────── */}
        <nav className="blog-nav">
          <Link href="/" className="blog-back-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="#8D6E63" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Portfolio
          </Link>
          <span className="blog-nav-brand">ADIL RAHMAN</span>
        </nav>

        {/* ── Header ───────────────────────────────────────────────────── */}
        <header className="blog-header">
          <div className="blog-header-inner">
            <div className="blog-meta-row">
              <span className="blog-tag">// BLOG</span>
              <span className="blog-meta-sep">·</span>
              <span className="blog-date">{post.date}</span>
              <span className="blog-meta-sep">·</span>
              <span className="blog-read-time">{post.readTime}</span>
            </div>
            <h1 className="blog-title">{post.title}</h1>
            <p className="blog-excerpt">{post.excerpt}</p>
            <div className="blog-header-line" />
          </div>
        </header>

        {/* ── Content ──────────────────────────────────────────────────── */}
        <article className="blog-article">
          <div className="blog-content">
            {rendered}
          </div>
        </article>

        {/* ── Footer CTA ───────────────────────────────────────────────── */}
        <div className="blog-footer-cta">
          <div className="blog-footer-cta-inner">
            <p className="blog-footer-label">// ENJOYED THIS?</p>
            <h3 className="blog-footer-title">Let's Build Something Together</h3>
            <p className="blog-footer-desc">Have a project in mind? I'm available for freelance work — Flutter, Shopify, full-stack web apps.</p>
            <Link href="/#contact" className="blog-cta-btn">Get In Touch</Link>
          </div>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');

          .blog-page {
            min-height: 100vh;
            background: linear-gradient(180deg, #1A0A08 0%, #231513 100%);
            color: #EFEBE9;
            font-family: 'Special Elite', monospace;
          }

          /* Nav */
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

          /* Header */
          .blog-header {
            padding: 64px 24px 48px;
            border-bottom: 1px solid rgba(141, 110, 99, 0.12);
          }

          .blog-header-inner {
            max-width: 720px;
            margin: 0 auto;
          }

          .blog-meta-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 24px;
          }

          .blog-tag {
            font-size: 11px;
            color: #8D6E63;
            letter-spacing: 1px;
            font-weight: bold;
          }

          .blog-meta-sep {
            color: rgba(141, 110, 99, 0.4);
            font-size: 11px;
          }

          .blog-date,
          .blog-read-time {
            font-size: 11px;
            color: #8C7355;
            letter-spacing: 0.5px;
          }

          .blog-title {
            font-size: clamp(26px, 5vw, 42px);
            font-weight: bold;
            color: #EFEBE9;
            line-height: 1.25;
            letter-spacing: 0.3px;
            margin-bottom: 20px;
          }

          .blog-excerpt {
            font-size: 15px;
            color: #BCAAA4;
            line-height: 1.75;
            margin-bottom: 32px;
          }

          .blog-header-line {
            height: 1px;
            background: linear-gradient(90deg, rgba(141,110,99,0.4), transparent);
          }

          /* Article */
          .blog-article {
            padding: 48px 24px 80px;
          }

          .blog-content {
            max-width: 720px;
            margin: 0 auto;
          }

          /* Markdown Elements */
          .blog-h1 {
            font-size: 30px;
            color: #EFEBE9;
            margin: 40px 0 16px;
            line-height: 1.3;
            border-bottom: 1px solid rgba(141, 110, 99, 0.2);
            padding-bottom: 12px;
          }

          .blog-h2 {
            font-size: 22px;
            color: #D7CCC8;
            margin: 36px 0 14px;
            line-height: 1.35;
          }

          .blog-h3 {
            font-size: 18px;
            color: #BCAAA4;
            margin: 28px 0 10px;
          }

          .blog-p {
            font-size: 15px;
            color: #BCAAA4;
            line-height: 1.85;
            margin-bottom: 20px;
          }

          .blog-p strong {
            color: #EFEBE9;
            font-weight: bold;
          }

          .blog-p em {
            color: #D7CCC8;
            font-style: italic;
          }

          .blog-list {
            list-style: none;
            padding: 0;
            margin: 0 0 24px 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .blog-li {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            font-size: 15px;
            color: #BCAAA4;
            line-height: 1.75;
          }

          .blog-li::before {
            content: '▸';
            color: #8D6E63;
            flex-shrink: 0;
            margin-top: 2px;
            font-size: 12px;
          }

          .blog-li strong { color: #EFEBE9; }

          .blog-hr {
            border: none;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(141,110,99,0.3) 40%, rgba(141,110,99,0.3) 60%, transparent);
            margin: 40px 0;
          }

          .blog-link {
            color: #8D6E63;
            text-decoration: underline;
            text-decoration-color: rgba(141, 110, 99, 0.35);
            text-underline-offset: 3px;
            transition: color 0.2s, text-decoration-color 0.2s;
          }
          .blog-link:hover {
            color: #EFEBE9;
            text-decoration-color: rgba(239, 235, 233, 0.5);
          }

          /* Footer CTA */
          .blog-footer-cta {
            padding: 0 24px 80px;
          }

          .blog-footer-cta-inner {
            max-width: 720px;
            margin: 0 auto;
            background: linear-gradient(135deg, rgba(42, 21, 16, 0.8) 0%, rgba(26, 10, 8, 0.9) 100%);
            border: 1px solid rgba(141, 110, 99, 0.25);
            border-radius: 16px;
            padding: 40px;
            text-align: center;
          }

          .blog-footer-label {
            font-size: 11px;
            color: #8D6E63;
            letter-spacing: 1px;
            margin-bottom: 12px;
          }

          .blog-footer-title {
            font-size: 24px;
            color: #EFEBE9;
            margin-bottom: 12px;
            font-weight: bold;
          }

          .blog-footer-desc {
            font-size: 14px;
            color: #8C7355;
            line-height: 1.7;
            margin-bottom: 28px;
          }

          .blog-cta-btn {
            display: inline-block;
            background: linear-gradient(135deg, #8D6E63 0%, #6D4C41 100%);
            color: #FAF6EE;
            text-decoration: none;
            border-radius: 30px;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 0.5px;
            padding: 14px 32px;
            transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
            box-shadow: 0 4px 16px rgba(141, 110, 99, 0.3);
          }
          .blog-cta-btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(141, 110, 99, 0.4);
          }
        `}</style>
      </div>
    </>
  );
}
