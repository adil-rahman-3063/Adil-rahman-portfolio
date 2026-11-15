import React from 'react';

// ── Shared Markdown → JSX Renderer ──────────────────────────────────────────
export function renderMarkdown(md) {
  if (!md) return [];
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
