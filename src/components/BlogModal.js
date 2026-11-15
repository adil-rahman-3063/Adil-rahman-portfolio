'use client';
import React, { useEffect, useRef } from 'react';
import { renderMarkdown } from '../lib/renderMarkdown';

export default function BlogModal({ blog, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }

    const handleCancel = (e) => {
      e.preventDefault();
      onClose();
    };

    dialog?.addEventListener('cancel', handleCancel);

    return () => {
      dialog?.removeEventListener('cancel', handleCancel);
      if (dialog?.open) {
        dialog.close();
      }
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="blog-modal-title"
      className="modal-dialog-root"
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <span className="modal-meta">{blog.date} • {blog.readTime}</span>
            <h3 id="blog-modal-title" className="modal-title-handwritten">{blog.title}</h3>
          </div>
          <button
            type="button"
            aria-label="Close blog modal"
            className="modal-close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="markdown-body">
            {renderMarkdown(blog?.content)}
          </div>
        </div>
      </div>

      <style jsx global>{`
        dialog.modal-dialog-root {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          max-width: none;
          max-height: none;
          background: transparent;
          border: none;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          overscroll-behavior: contain;
          margin: 0;
          z-index: 99999;
        }

        dialog.modal-dialog-root::backdrop {
          overflow: hidden;
          overscroll-behavior: contain;
          background-color: rgba(35, 21, 19, 0.6);
          backdrop-filter: blur(4px);
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
          scrollbar-width: thin;
          scrollbar-color: #8D6E63 transparent;
          overscroll-behavior: contain;
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

        .markdown-body blockquote {
          border-left: 3px solid #8D6E63;
          background-color: rgba(141, 110, 99, 0.08);
          padding: 10px 14px;
          margin: 16px 0;
          border-radius: 0 6px 6px 0;
          font-style: italic;
          color: #5D4037;
        }

        .markdown-body table,
        .markdown-body .blog-table {
          width: 100%;
          border-collapse: collapse;
          margin: 0;
          font-size: 13px;
        }

        .markdown-body .blog-table-wrapper {
          width: 100%;
          overflow-x: auto;
          margin: 20px 0;
          border-radius: 8px;
          border: 1px solid rgba(141, 110, 99, 0.2);
          background: #FAF6EE;
        }

        .markdown-body th,
        .markdown-body .blog-table th {
          background-color: rgba(141, 110, 99, 0.15);
          padding: 10px 14px;
          border-bottom: 2px solid rgba(141, 110, 99, 0.25);
          text-align: left;
          font-weight: bold;
          color: #3E2723;
        }

        .markdown-body td,
        .markdown-body .blog-table td {
          padding: 10px 14px;
          border-bottom: 1px solid rgba(141, 110, 99, 0.15);
          color: #4E342E;
        }

        .markdown-body .blog-table tr:last-child td {
          border-bottom: none;
        }

        .markdown-body .blog-p {
          margin-bottom: 16px;
        }

        .markdown-body .blog-h2,
        .markdown-body .blog-h3 {
          font-family: var(--font-header);
          color: #3E2723;
          margin-top: 24px;
          margin-bottom: 12px;
          border-bottom: 1px solid rgba(141, 110, 99, 0.15);
          padding-bottom: 6px;
        }

        .markdown-body .blog-list,
        .markdown-body .blog-ol {
          margin-bottom: 16px;
          padding-left: 24px;
        }

        .markdown-body .blog-li,
        .markdown-body .blog-ol-li {
          margin-bottom: 8px;
          color: #4E342E;
        }

        .markdown-body .blog-inline-code {
          background-color: rgba(141, 110, 99, 0.1);
          color: #8D6E63;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 13px;
        }

        .markdown-body .blog-code-pre {
          background-color: #231513;
          color: #FAF6EE;
          padding: 16px 20px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 18px 0;
          font-size: 12.5px;
          line-height: 1.6;
        }

        .markdown-body .blog-link {
          color: #8D6E63;
          text-decoration: underline;
          font-weight: bold;
        }
        .markdown-body .blog-link:hover {
          color: #3E2723;
        }

        .markdown-body .blog-blockquote {
          border-left: 3px solid #8D6E63;
          background-color: rgba(141, 110, 99, 0.08);
          padding: 12px 18px;
          margin: 20px 0;
          border-radius: 0 8px 8px 0;
          color: #5D4037;
        }

        .markdown-body .blog-blockquote-p {
          margin-bottom: 8px;
        }
        .markdown-body .blog-blockquote-p:last-child {
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          dialog.modal-dialog-root {
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
    </dialog>
  );
}
