'use client';
import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function BlogModal({ blog, onClose }) {
  useEffect(() => {
    // Disable body scroll when blog modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <span className="modal-meta">{blog.date} • {blog.readTime}</span>
            <h3 className="modal-title-handwritten">{blog.title}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="markdown-body">
            <ReactMarkdown>{blog.content}</ReactMarkdown>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(35, 21, 19, 0.6); /* Warm overlay tint */
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999 !important;
          padding: 24px;
        }

        .modal-content {
          background-color: #F4EFEA; /* Light Cream background */
          border: 1px solid rgba(141, 110, 99, 0.2);
          border-radius: 16px;
          width: 100%;
          max-width: 820px;
          max-height: 88vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(35, 21, 19, 0.25);
        }

        .modal-header {
          padding: 24px 32px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1.5px solid rgba(141, 110, 99, 0.15);
          background-color: rgba(244, 239, 234, 0.8);
        }

        .modal-meta {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #8C7355;
          text-transform: uppercase;
          font-weight: bold;
          letter-spacing: 0.5px;
        }

        .modal-title-handwritten {
          font-family: var(--font-header);
          font-size: 24px;
          color: #3E2723;
          margin: 6px 0 0 0;
          font-weight: bold;
          line-height: 1.2;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: #8D6E63;
          font-size: 32px;
          cursor: pointer;
          line-height: 1;
          padding: 0;
          margin-top: -4px;
          transition: color 0.2s;
        }
        .modal-close-btn:hover {
          color: #3E2723;
        }

        .modal-body {
          padding: 36px 40px;
          overflow-y: auto;
          overflow-x: hidden;
          flex-grow: 1;
          background-color: #F4EFEA;
        }

        /* Markdown body styles in light mode */
        .markdown-body {
          font-family: var(--font-mono);
          color: #3E2723;
          line-height: 1.7;
          font-size: 14px;
        }
        
        .markdown-body h1, .markdown-body h2, .markdown-body h3 {
          font-family: var(--font-header);
          color: #3E2723;
          margin-top: 24px;
          margin-bottom: 12px;
          border-bottom: 1px solid rgba(141, 110, 99, 0.15);
          padding-bottom: 6px;
        }

        .markdown-body p {
          margin-bottom: 16px;
        }

        .markdown-body ul, .markdown-body ol {
          margin-bottom: 16px;
          padding-left: 20px;
        }

        .markdown-body li {
          margin-bottom: 8px;
        }

        .markdown-body code {
          background-color: rgba(141, 110, 99, 0.08);
          color: #8D6E63;
          padding: 2px 4px;
          border-radius: 4px;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .markdown-body pre {
          white-space: pre-wrap;
          word-break: break-word;
          overflow-x: auto;
          max-width: 100%;
        }

        .markdown-body img {
          max-width: 100%;
          height: auto;
        }

        @media (max-width: 768px) {
          .modal-overlay {
            padding: 12px;
          }
          .modal-header {
            padding: 16px 20px;
          }
          .modal-body {
            padding: 20px 20px;
            overflow-x: hidden;
          }
          .markdown-body {
            font-size: 13px;
          }
          .modal-title-handwritten {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}
