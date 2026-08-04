'use client';
import React from 'react';
import { allBlogs } from '../data/blogData';

export default function BlogSection({ onBlogClick }) {
  return (
    <section id="blog" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '32px' }}>
        <span style={{
          fontFamily: 'var(--font-handwritten)',
          fontSize: '26px',
          color: '#8C7355',
          marginRight: '8px'
        }}>
          06 // 
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

      <div className="blogs-list">
        {allBlogs.map((blog) => (
          <div
            key={blog.id}
            onClick={() => onBlogClick?.(blog)}
            className="blog-card"
          >
            <span className="blog-date">{blog.date} • {blog.readTime}</span>
            <h3 className="blog-title">{blog.title}</h3>
            <p className="blog-excerpt">{blog.excerpt}</p>
            <span className="blog-read-more">Read Article →</span>
          </div>
        ))}
      </div>

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

        .blog-excerpt {
          font-family: var(--font-mono);
          font-size: 13px;
          color: #5D4037;
          line-height: 1.6;
          margin: 0 0 16px 0;
        }

        .blog-read-more {
          font-family: var(--font-mono);
          font-size: 12px;
          color: #8D6E63;
          font-weight: bold;
          text-decoration: underline;
        }
      `}</style>
    </section>
  );
}
