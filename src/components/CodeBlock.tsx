import { useState, useCallback, type ReactNode } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = 'typescript', filename }: CodeBlockProps) {
  const [copyState, setCopyState] = useState<'idle' | 'success' | 'fail'>('idle');

  const handleCopy = useCallback(() => {
    const fallbackCopy = (text: string): boolean => {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        return ok;
      } catch {
        return false;
      }
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code)
        .then(() => {
          setCopyState('success');
          setTimeout(() => setCopyState('idle'), 2000);
        })
        .catch(() => {
          if (fallbackCopy(code)) {
            setCopyState('success');
            setTimeout(() => setCopyState('idle'), 2000);
          } else {
            setCopyState('fail');
            setTimeout(() => setCopyState('idle'), 2000);
          }
        });
    } else {
      if (fallbackCopy(code)) {
        setCopyState('success');
        setTimeout(() => setCopyState('idle'), 2000);
      } else {
        setCopyState('fail');
        setTimeout(() => setCopyState('idle'), 2000);
      }
    }
  }, [code]);

  const copyLabel = copyState === 'success' ? '✓ Copied' : copyState === 'fail' ? 'Copy Failed' : 'Copy';
  const copyBg = copyState === 'success' ? 'var(--accent-green)' : copyState === 'fail' ? 'var(--accent-red)' : 'var(--bg-secondary)';
  const copyColor = copyState === 'idle' ? 'var(--text-secondary)' : 'var(--bg-primary)';

  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-primary)' }}>
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-default)' }}
      >
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          {filename || language}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs px-2 py-1 rounded transition-colors cursor-pointer"
          style={{ background: copyBg, color: copyColor, fontFamily: 'var(--font-mono)' }}
        >
          {copyLabel}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs leading-relaxed" style={{ fontFamily: 'var(--font-mono)' }}>
        <code style={{ color: 'var(--text-primary)' }}>
          {highlightSyntax(code, language)}
        </code>
      </pre>
    </div>
  );
}

// ---- Syntax Highlighter ----

interface Token {
  start: number;
  end: number;
  type: 'string' | 'comment' | 'keyword' | 'type' | 'number';
}

const KEYWORD_RE = /\b(import|export|from|const|let|var|function|return|if|else|switch|case|break|default|class|extends|interface|type|enum|async|await|new|try|catch|throw|typeof|instanceof|void|null|undefined|true|false|this|super|static|readonly|public|private|protected)\b/;
const TYPE_RE = /\b(string|number|boolean|any|never|unknown|object|Array|Promise|Record|Partial|Required|Pick|Omit)\b/;
const NUMBER_RE = /\b\d+\.?\d*\b/;

function isJsLike(lang: string): boolean {
  return ['typescript', 'ts', 'javascript', 'js', 'tsx', 'jsx', 'json'].includes(lang);
}

function isShellLike(lang: string): boolean {
  return ['shell', 'bash', 'sh', 'yaml', 'yml', 'dockerfile', 'nginx', 'toml'].includes(lang);
}

function tokenizeLine(line: string, language: string): Token[] {
  const tokens: Token[] = [];
  const jsLike = isJsLike(language);
  const shellLike = isShellLike(language);
  let i = 0;

  while (i < line.length) {
    // 1. String literals — skip content inside, no comment detection
    if (line[i] === '"' || line[i] === "'" || line[i] === '`') {
      const quote = line[i];
      const start = i;
      i++;
      while (i < line.length) {
        if (line[i] === '\\') {
          i += 2;
          continue;
        }
        if (line[i] === quote) {
          i++;
          break;
        }
        i++;
      }
      tokens.push({ start, end: i, type: 'string' });
      continue;
    }

    // 2. Line comments: // (JS-like only)
    if (jsLike && line[i] === '/' && line[i + 1] === '/') {
      tokens.push({ start: i, end: line.length, type: 'comment' });
      break; // rest of line is comment
    }

    // 3. Block comments: /* ... */ (JS-like)
    if (jsLike && line[i] === '/' && line[i + 1] === '*') {
      const start = i;
      i += 2;
      while (i < line.length) {
        if (line[i] === '*' && line[i + 1] === '/') {
          i += 2;
          break;
        }
        i++;
      }
      tokens.push({ start, end: i, type: 'comment' });
      // Continue processing rest of line after block comment
      continue;
    }

    // 4. Shell/YAML # comments (only in shell-like languages)
    if (shellLike && line[i] === '#') {
      tokens.push({ start: i, end: line.length, type: 'comment' });
      break;
    }

    // 5. Keywords, types, numbers (only outside strings/comments)
    const rest = line.slice(i);

    const kwMatch = rest.match(KEYWORD_RE);
    const typeMatch = rest.match(TYPE_RE);
    const numMatch = rest.match(NUMBER_RE);

    // Find earliest match
    let earliest: { index: number; length: number; type: Token['type'] } | null = null;

    if (kwMatch && kwMatch.index !== undefined) {
      earliest = { index: kwMatch.index, length: kwMatch[0].length, type: 'keyword' };
    }
    if (typeMatch && typeMatch.index !== undefined) {
      if (!earliest || typeMatch.index < earliest.index) {
        earliest = { index: typeMatch.index, length: typeMatch[0].length, type: 'type' };
      }
    }
    if (numMatch && numMatch.index !== undefined) {
      if (!earliest || numMatch.index < earliest.index) {
        earliest = { index: numMatch.index, length: numMatch[0].length, type: 'number' };
      }
    }

    if (earliest && earliest.index === 0) {
      tokens.push({ start: i, end: i + earliest.length, type: earliest.type });
      i += earliest.length;
    } else {
      i++;
    }
  }

  return tokens;
}

function getColorForType(type: string): string {
  switch (type) {
    case 'keyword': return '#ff7b72';
    case 'string': return '#a5d6ff';
    case 'number': return '#79c0ff';
    case 'type': return '#ffa657';
    case 'comment': return '#6e7681';
    default: return '#e6edf3';
  }
}

function highlightSyntax(code: string, language: string): ReactNode[] {
  const lines = code.split('\n');
  return lines.map((line, lineIdx) => {
    const tokens = tokenizeLine(line, language);
    const parts: ReactNode[] = [];
    let cursor = 0;
    let key = 0;

    for (const token of tokens) {
      if (token.start > cursor) {
        parts.push(<span key={`p-${lineIdx}-${key++}`}>{line.slice(cursor, token.start)}</span>);
      }
      parts.push(
        <span
          key={`p-${lineIdx}-${key++}`}
          style={{
            color: getColorForType(token.type),
            fontStyle: token.type === 'comment' ? 'italic' : undefined,
          }}
        >
          {line.slice(token.start, token.end)}
        </span>
      );
      cursor = token.end;
    }

    if (cursor < line.length) {
      parts.push(<span key={`p-${lineIdx}-${key++}`}>{line.slice(cursor)}</span>);
    }

    if (parts.length === 0) {
      parts.push('');
    }

    return (
      <span key={`line-${lineIdx}`}>
        {parts}
        {lineIdx < lines.length - 1 ? '\n' : ''}
      </span>
    );
  });
}
