import { allBlogs } from '../../../data/blogData';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import SiteFooter from '../../../components/SiteFooter';

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
  const metaTitle = post.seoTitle || `${post.title} | Adil Rahman`;
  return {
    title: {
      absolute: metaTitle,
    },
    description: post.excerpt,
    openGraph: {
      title: metaTitle,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${id}`,
      type: 'article',
      publishedTime: post.date,
      authors: ['Adil Rahman'],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
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
  let orderedListItems = [];
  let blockquoteLines = [];
  let inTable = false;
  let tableHeader = [];
  let tableRows = [];
  let inCodeBlock = false;
  let codeLines = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(<ul key={key++} className="blog-list">{listItems}</ul>);
      listItems = [];
    }
  };

  const flushOrderedList = () => {
    if (orderedListItems.length > 0) {
      elements.push(<ol key={key++} className="blog-ol">{orderedListItems}</ol>);
      orderedListItems = [];
    }
  };

  const flushBlockquote = () => {
    if (blockquoteLines.length > 0) {
      elements.push(
        <blockquote key={key++} className="blog-blockquote">
          {blockquoteLines.map((bLine, i) => (
            <p key={i} className="blog-blockquote-p">{inlineRender(bLine)}</p>
          ))}
        </blockquote>
      );
      blockquoteLines = [];
    }
  };

  const flushTable = () => {
    if (inTable && tableHeader.length > 0) {
      elements.push(
        <div key={key++} className="blog-table-wrapper">
          <table className="blog-table">
            <thead>
              <tr>
                {tableHeader.map((h, i) => (
                  <th key={i}>{inlineRender(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((c, ci) => (
                    <td key={ci}>{inlineRender(c)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    inTable = false;
    tableHeader = [];
    tableRows = [];
  };

  const flushAll = () => {
    flushList();
    flushOrderedList();
    flushBlockquote();
    flushTable();
  };

  const inlineRender = (text) => {
    // Single capturing group only — matches bold, italic, links, and inline code
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\)|`[^`]+`)/g);
    return parts.filter(Boolean).map((part, i) => {
      if (!part) return null;
      if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
      if (/^\*[^*]+\*$/.test(part)) return <em key={i}>{part.slice(1, -1)}</em>;
      if (/^`[^`]+`$/.test(part)) return <code key={i} className="blog-inline-code">{part.slice(1, -1)}</code>;
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) return <a key={i} href={linkMatch[2]} target="_blank" rel="noreferrer" className="blog-link">{linkMatch[1]}</a>;
      return part;
    });
  };

  for (const line of lines) {
    if (line.startsWith('```')) {
      flushAll();
      if (inCodeBlock) {
        elements.push(
          <pre key={key++} className="blog-code-pre">
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    const trimmed = line.trim();

    // Table row detection (| col | col |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 2) {
      // Check if it's separator row: | :--- | :--- |
      if (/^\|[\s\-:]+(\|[\s\-:]+)+\|$/.test(trimmed)) {
        continue;
      }
      flushList();
      flushOrderedList();
      flushBlockquote();
      const cells = trimmed.slice(1, -1).split('|').map((s) => s.trim());
      if (!inTable) {
        inTable = true;
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Blockquote (> text)
    if (trimmed.startsWith('>')) {
      flushList();
      flushOrderedList();
      flushTable();
      blockquoteLines.push(trimmed.replace(/^>\s?/, ''));
      continue;
    } else if (blockquoteLines.length > 0) {
      flushBlockquote();
    }

    // Unordered List
    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushOrderedList();
      flushTable();
      flushBlockquote();
      listItems.push(<li key={key++} className="blog-li">{inlineRender(line.slice(2))}</li>);
      continue;
    } else if (listItems.length > 0) {
      flushList();
    }

    // Ordered List (1. , 2. )
    const olMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      flushList();
      flushTable();
      flushBlockquote();
      orderedListItems.push(<li key={key++} className="blog-ol-li">{inlineRender(olMatch[2])}</li>);
      continue;
    } else if (orderedListItems.length > 0) {
      flushOrderedList();
    }

    if (line.startsWith('# ')) {
      flushAll();
      elements.push(<h2 key={key++} className="blog-h2">{inlineRender(line.slice(2))}</h2>);
    } else if (line.startsWith('## ')) {
      flushAll();
      elements.push(<h2 key={key++} className="blog-h2">{inlineRender(line.slice(3))}</h2>);
    } else if (line.startsWith('### ')) {
      flushAll();
      elements.push(<h3 key={key++} className="blog-h3">{inlineRender(line.slice(4))}</h3>);
    } else if (line.trim() === '---') {
      flushAll();
      elements.push(<hr key={key++} className="blog-hr" />);
    } else if (line.trim() === '') {
      flushAll();
    } else {
      flushAll();
      elements.push(<p key={key++} className="blog-p">{inlineRender(line)}</p>);
    }
  }

  flushAll();
  if (inCodeBlock && codeLines.length > 0) {
    elements.push(
      <pre key={key++} className="blog-code-pre">
        <code>{codeLines.join('\n')}</code>
      </pre>
    );
  }
  return elements;
}

// ── JSON-LD Article & Breadcrumb Schema ───────────────────────────────────────
function ArticleJsonLd({ post }) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: [
      post.image || `${SITE_URL}/assets/og-image.png`,
    ],
    author: {
      '@type': 'Person',
      name: 'Adil Rahman',
      url: SITE_URL,
      jobTitle: 'Full-Stack Developer, Flutter Engineer & Shopify Expert',
    },
    publisher: {
      '@type': 'Person',
      name: 'Adil Rahman',
      url: SITE_URL,
    },
    datePublished: post.date,
    dateModified: post.dateModified || post.date,
    url: `${SITE_URL}/blog/${post.id}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.id}`,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${SITE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${SITE_URL}/blog/${post.id}`,
      },
    ],
  };

  const schemas = [articleSchema, breadcrumbSchema];

  if (post.faq && Array.isArray(post.faq) && post.faq.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
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

        {/* ── Footer CTA & Site Links ── */}
        <SiteFooter
          ctaLabel="// ENJOYED THIS?"
          ctaTitle="Let's Build Something Together"
          ctaDesc="Have a project in mind? I'm available for freelance work — Flutter, Shopify, full-stack web apps."
          primaryBtn={{ label: "Get In Touch", href: "/#contact" }}
          secondaryBtn={{ label: "Back to Blog", href: "/blog" }}
          tertiaryBtn={{ label: "Projects Hub", href: "/project" }}
        />

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

          .blog-inline-code {
            font-family: var(--font-mono);
            font-size: 13px;
            background: rgba(141, 110, 99, 0.18);
            border: 1px solid rgba(141, 110, 99, 0.35);
            color: #EFEBE9;
            padding: 2px 6px;
            border-radius: 4px;
            word-break: break-word;
          }

          .blog-code-pre {
            background: #140806;
            border: 1px solid rgba(141, 110, 99, 0.25);
            border-radius: 8px;
            padding: 18px 22px;
            overflow-x: auto;
            margin: 24px 0;
            font-family: var(--font-mono);
            font-size: 13px;
            line-height: 1.65;
            color: #FAF6EE;
          }

          .blog-code-pre code {
            font-family: inherit;
            color: inherit;
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

          /* Table Styles */
          .blog-table-wrapper {
            width: 100%;
            overflow-x: auto;
            margin: 28px 0;
            border-radius: 8px;
            border: 1px solid rgba(141, 110, 99, 0.25);
            background: #140806;
          }

          .blog-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 14px;
          }

          .blog-table th {
            background: rgba(141, 110, 99, 0.18);
            color: #EFEBE9;
            padding: 14px 16px;
            font-weight: bold;
            border-bottom: 1px solid rgba(141, 110, 99, 0.35);
            letter-spacing: 0.5px;
          }

          .blog-table td {
            padding: 12px 16px;
            color: #BCAAA4;
            border-bottom: 1px solid rgba(141, 110, 99, 0.15);
            line-height: 1.6;
          }

          .blog-table tr:last-child td {
            border-bottom: none;
          }

          .blog-table tr:hover td {
            background: rgba(141, 110, 99, 0.08);
          }

          /* Blockquote / AI Snippet Callout */
          .blog-blockquote {
            border-left: 3px solid #8D6E63;
            background: rgba(141, 110, 99, 0.1);
            padding: 16px 20px;
            margin: 24px 0;
            border-radius: 0 8px 8px 0;
            color: #D7CCC8;
          }

          .blog-blockquote-p {
            font-size: 14px;
            line-height: 1.7;
            color: #D7CCC8;
            margin: 0 0 8px 0;
          }

          .blog-blockquote-p:last-child {
            margin-bottom: 0;
          }

          .blog-blockquote-p strong {
            color: #EFEBE9;
          }

          /* Ordered List */
          .blog-ol {
            padding: 0;
            margin: 0 0 24px 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            list-style-type: decimal;
            color: #8D6E63;
          }

          .blog-ol-li {
            font-size: 15px;
            color: #BCAAA4;
            line-height: 1.75;
            padding-left: 4px;
          }

          .blog-ol-li strong {
            color: #EFEBE9;
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
