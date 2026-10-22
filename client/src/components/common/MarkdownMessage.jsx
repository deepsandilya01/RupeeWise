import React from 'react';

/**
 * Helper to render inline markdown: **bold**, *italic*, `code`
 */
function renderInline(text, keyPrefix = 'inline') {
  if (!text) return null;

  const tokens = [];
  let idx = 0;
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(
        <span key={`${keyPrefix}-t-${idx++}`}>
          {text.substring(lastIndex, match.index)}
        </span>
      );
    }

    const matchedStr = match[0];
    if (matchedStr.startsWith('**') && matchedStr.endsWith('**')) {
      const inner = matchedStr.slice(2, -2);
      tokens.push(
        <strong key={`${keyPrefix}-b-${idx++}`} className="font-bold text-[#073746]">
          {inner}
        </strong>
      );
    } else if (matchedStr.startsWith('`') && matchedStr.endsWith('`')) {
      const inner = matchedStr.slice(1, -1);
      tokens.push(
        <code
          key={`${keyPrefix}-c-${idx++}`}
          className="px-1 py-0.5 rounded bg-black/5 font-mono text-[11px] text-[#073746]"
        >
          {inner}
        </code>
      );
    } else if (matchedStr.startsWith('*') && matchedStr.endsWith('*')) {
      const inner = matchedStr.slice(1, -1);
      tokens.push(
        <em key={`${keyPrefix}-i-${idx++}`} className="italic text-gray-700">
          {inner}
        </em>
      );
    }

    lastIndex = match.index + matchedStr.length;
  }

  if (lastIndex < text.length) {
    tokens.push(
      <span key={`${keyPrefix}-end-${idx++}`}>
        {text.substring(lastIndex)}
      </span>
    );
  }

  return tokens.length > 0 ? tokens : text;
}

/**
 * Formats a block of text containing markdown elements (headers, lists, bold)
 * into semantic, accessible, theme-aligned React elements.
 */
export const MarkdownMessage = ({ content = '', className = '' }) => {
  if (!content) return null;

  // Split into lines
  const lines = content.split('\n');
  const elements = [];
  let currentList = null; // { type: 'ul' | 'ol', items: [] }

  const flushList = (key) => {
    if (!currentList) return;
    if (currentList.type === 'ul') {
      elements.push(
        <ul key={`ul-${key}`} className="my-2 space-y-1.5 pl-0.5">
          {currentList.items.map((item, i) => (
            <li key={`uli-${i}`} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F35C48] mt-1.5 flex-shrink-0" />
              <span className="flex-1 leading-relaxed">{renderInline(item, `uli-${i}`)}</span>
            </li>
          ))}
        </ul>
      );
    } else if (currentList.type === 'ol') {
      elements.push(
        <ol key={`ol-${key}`} className="my-2 space-y-1.5 pl-0.5">
          {currentList.items.map((item, i) => (
            <li key={`oli-${i}`} className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[#0C3846] text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                {i + 1}
              </span>
              <span className="flex-1 leading-relaxed">{renderInline(item, `oli-${i}`)}</span>
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Empty lines flush active lists
    if (!trimmed) {
      flushList(i);
      continue;
    }

    // Unordered bullet list items (*, -, •)
    const bulletMatch = trimmed.match(/^[\*\-•]\s+(.*)$/);
    if (bulletMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList(i);
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(bulletMatch[1]);
      continue;
    }

    // Ordered list items (1., 2., etc.)
    const orderedMatch = trimmed.match(/^\d+[\.\)]\s+(.*)$/);
    if (orderedMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList(i);
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(orderedMatch[1]);
      continue;
    }

    // If regular line, flush any active list first
    flushList(i);

    // Headers (###, ##, #)
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={`h4-${i}`} className="text-xs font-extrabold text-[#073746] mt-3 mb-1 uppercase tracking-wider">
          {renderInline(trimmed.replace(/^###\s+/, ''), `h4-${i}`)}
        </h4>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-sm font-extrabold text-[#073746] mt-3.5 mb-1.5">
          {renderInline(trimmed.replace(/^##\s+/, ''), `h3-${i}`)}
        </h3>
      );
    } else if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-base font-extrabold text-[#073746] mt-4 mb-2">
          {renderInline(trimmed.replace(/^#\s+/, ''), `h2-${i}`)}
        </h2>
      );
    } else {
      // Normal paragraph
      elements.push(
        <p key={`p-${i}`} className="my-1.5 leading-relaxed text-inherit">
          {renderInline(trimmed, `p-${i}`)}
        </p>
      );
    }
  }

  // Flush any list remaining at the end
  flushList(lines.length);

  return <div className={`markdown-message-body ${className}`}>{elements}</div>;
};

export default MarkdownMessage;
