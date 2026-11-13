'use client';
import React from 'react';
import Link from 'next/link';
import { allBlogs } from '../data/blogData';

export default function BlogSection({ onBlogClick }) {
  return (
    <section id="blog" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-handwritten)',
            fontSize: '26px',
            color: '#8C7355',
            marginRight: '8px'
          }}>
            07 // 
          </span>
          <h2 style={{
            fontFamily: 'var(--font-header)',
            fontSize: '22px',
            color: '#EFEBE9',
            fontWeight: 'bold',
            letterSpacing: '1.0px',
            margin: 0
          }}>
            LATEST ARTICLES
          </h2>
        </div>

        <Link href="/blog" className="blog-section-hub-link">
          Explore All Articles →
        </Link>
      </div>

      <div className="blogs-list">
        {allBlogs.slice(0, 5).map((blog) => (
          <div
            key={blog.id}
            onClick={() => onBlogClick?.(blog)}
            className="blog-card"
          >
            <span className="blog-date">{blog.date} • {blog.readTime}</span>
            <h3 className="blog-title">
              <Link
                href={`/blog/${blog.id}`}
                onClick={(e) => {
                  if (onBlogClick) {
                    e.preventDefault();
                    onBlogClick(blog);
                  }
                }}
                className="blog-title-link"
              >
                {blog.title}
              </Link>
            </h3>
            <p className="blog-excerpt">{blog.excerpt}</p>
            <div className="blog-action-row">
              <span className="blog-read-more">Read in Modal →</span>
              <Link
                href={`/blog/${blog.id}`}
                className="blog-direct-link"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Read complete article: ${blog.title}`}
              >
                Read Article ↗
              </Link>
            </div>
          </div>
        ))}
      </div>

      {allBlogs.length > 5 && (
        <div className="blog-more-container">
          <Link href="/blog" className="blog-more-btn">
            Read More on Blog ({allBlogs.length} Articles) →
          </Link>
        </div>
      )}

      <style jsx global>{`
        .blogs-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }

        .blog-card {
          background-color: #FAF6EE;
          border: 1.5px solid #E8DFD0;
          border-radius: 8px;
          padding: 24px;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.06);
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .blog-card:hover {
          border-color: #8D6E63;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .blog-date {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #8D6E63;
          margin-bottom: 8px;
          font-weight: bold;
        }

        .blog-title {
          font-family: var(--font-header);
          font-size: 18px;
          color: #3E2723;
          font-weight: bold;
          margin: 0 0 12px 0;
        }

        .blog-title-link,
        .blog-title-link:visited {
          color: inherit;
          text-decoration: none;
        }

        .blog-title-link:hover {
          color: #8D6E63;
        }

        .blog-excerpt {
          font-family: var(--font-mono);
          font-size: 13px;
          color: #5D4037;
          line-height: 1.6;
          margin: 0 0 16px 0;
        }

        .blog-section-hub-link,
        .blog-section-hub-link:visited {
          font-family: var(--font-mono);
          font-size: 12px;
          color: #8D6E63 !important;
          text-decoration: none !important;
          font-weight: bold;
          letter-spacing: 0.5px;
          border: 1px solid rgba(141, 110, 99, 0.35);
          padding: 6px 14px;
          border-radius: 20px;
          transition: all 0.2s;
        }
        .blog-section-hub-link:hover {
          background-color: #8D6E63;
          color: #FAF6EE !important;
          border-color: #8D6E63;
        }

        .blog-action-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 12px;
          margin-top: 4px;
        }

        .blog-read-more {
          font-family: var(--font-mono);
          font-size: 12px;
          color: #8D6E63;
          font-weight: bold;
          text-decoration: underline;
        }

        .blog-direct-link,
        .blog-direct-link:visited {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #8C7355 !important;
          text-decoration: none !important;
          font-weight: bold;
          padding: 4px 10px;
          background: rgba(141, 110, 99, 0.08);
          border: 1px solid rgba(141, 110, 99, 0.2);
          border-radius: 12px;
          transition: all 0.2s;
        }
        .blog-direct-link:hover {
          background: #8D6E63;
          color: #FAF6EE !important;
        }

        .blog-more-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          margin-top: 32px;
        }

        .blog-more-btn,
        .blog-more-btn:visited {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: bold;
          color: #FAF6EE !important;
          background-color: #231513;
          border: 1.5px solid #8D6E63;
          padding: 12px 28px;
          border-radius: 30px;
          text-decoration: none !important;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s, background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
        }

        .blog-more-btn:hover {
          background-color: #8D6E63;
          color: #FAF6EE !important;
          border-color: #FAF6EE;
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </section>
  );
}
