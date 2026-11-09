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

// ---- Syntax Highlighter (O(n) single-pass tokenizer) ----

interface Token {
  start: number;
  end: number;
  type: 'string' | 'comment' | 'keyword' | 'type' | 'number' | 'md-heading' | 'md-bold' | 'md-italic' | 'md-code' | 'md-link' | 'md-list' | 'md-quote';
}

const KEYWORDS = new Set([
  'import', 'export', 'from', 'const', 'let', 'var', 'function', 'return',
  'if', 'else', 'switch', 'case', 'break', 'default', 'class', 'extends',
  'interface', 'type', 'enum', 'async', 'await', 'new', 'try', 'catch',
  'throw', 'typeof', 'instanceof', 'void', 'null', 'undefined', 'true',
  'false', 'this', 'super', 'static', 'readonly', 'public', 'private',
  'protected', 'for', 'while', 'do', 'of', 'in', 'yield', 'delete',
]);

const TYPES = new Set([
  'string', 'number', 'boolean', 'any', 'never', 'unknown', 'object',
  'Array', 'Promise', 'Record', 'Partial', 'Required', 'Pick', 'Omit',
]);

function isJsLike(lang: string): boolean {
  return ['typescript', 'ts', 'javascript', 'js', 'tsx', 'jsx', 'json'].includes(lang);
}

function isShellLike(lang: string): boolean {
  return ['shell', 'bash', 'sh', 'yaml', 'yml', 'dockerfile', 'nginx', 'toml'].includes(lang);
}

function isMarkdown(lang: string): boolean {
  return lang === 'markdown' || lang === 'md';
}

// ---- JS/TS/Shell/JSON tokenizer (O(n) single pass) ----

function tokenizeLine(line: string, language: string): Token[] {
  if (isMarkdown(language)) {
    return tokenizeMarkdownLine(line);
  }

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

    // 5. Identifiers/keywords (O(1) set lookup)
    if (/[a-zA-Z_$]/.test(line[i])) {
      const start = i;
      while (i < line.length && /[a-zA-Z0-9_$]/.test(line[i])) {
        i++;
      }
      const word = line.slice(start, i);
      if (KEYWORDS.has(word)) {
        tokens.push({ start, end: i, type: 'keyword' });
      } else if (TYPES.has(word)) {
        tokens.push({ start, end: i, type: 'type' });
      }
      continue;
    }

    // 6. Numbers
    if (/[0-9]/.test(line[i])) {
      const start = i;
      while (i < line.length && /[0-9.]/.test(line[i])) {
        i++;
      }
      tokens.push({ start, end: i, type: 'number' });
      continue;
    }

    // 7. Other characters — skip
    i++;
  }

  return tokens;
}

// ---- Markdown line tokenizer (O(n)) ----

function tokenizeMarkdownLine(line: string): Token[] {
  const tokens: Token[] = [];

  // Heading: # / ## / ### etc at start of line
  const headingMatch = line.match(/^(#{1,6})\s/);
  if (headingMatch) {
    tokens.push({ start: 0, end: headingMatch[1].length, type: 'md-heading' });
  }

  // Blockquote: > at start
  if (line.startsWith('> ')) {
    tokens.push({ start: 0, end: 1, type: 'md-quote' });
  }

  // List item: - / * / 1. at start
  if (/^(\s*[-*]|\s*\d+\.)\s/.test(line)) {
    const listMatch = line.match(/^(\s*[-*]|\s*\d+\.)\s/);
    if (listMatch) {
      tokens.push({ start: 0, end: listMatch[1].length, type: 'md-list' });
    }
  }

  // Inline tokens: **bold**, *italic*, `code`, [text](url)
  let i = 0;
  while (i < line.length) {
    // Inline code: `...`
    if (line[i] === '`') {
      const start = i;
      i++;
      while (i < line.length && line[i] !== '`') {
        i++;
      }
      if (i < line.length) {
        i++; // consume closing `
        tokens.push({ start, end: i, type: 'md-code' });
      }
      continue;
    }

    // Bold: **...**
    if (line[i] === '*' && line[i + 1] === '*') {
      const start = i;
      i += 2;
      while (i < line.length - 1) {
        if (line[i] === '*' && line[i + 1] === '*') {
          i += 2;
          tokens.push({ start, end: i, type: 'md-bold' });
          break;
        }
        i++;
      }
      continue;
    }

    // Italic: *...*
    if (line[i] === '*' && line[i + 1] !== '*') {
      const start = i;
      i++;
      while (i < line.length) {
        if (line[i] === '*' && line[i - 1] !== '*') {
          i++;
          tokens.push({ start, end: i, type: 'md-italic' });
          break;
        }
        i++;
      }
      continue;
    }

    // Link: [text](url)
    if (line[i] === '[') {
      const start = i;
      let j = i + 1;
      while (j < line.length && line[j] !== ']') {
        j++;
      }
      if (j < line.length && line[j + 1] === '(') {
        let k = j + 2;
        while (k < line.length && line[k] !== ')') {
          k++;
        }
        if (k < line.length) {
          tokens.push({ start, end: k + 1, type: 'md-link' });
          i = k + 1;
          continue;
        }
      }
    }

    i++;
  }

  return tokens;
}

// ---- Render ----

const TOKEN_COLORS: Record<string, string> = {
  string: '#a5d6ff',
  comment: '#8b949e',
  keyword: '#ff7b72',
  type: '#79c0ff',
  number: '#79c0ff',
  'md-heading': '#ff7b72',
  'md-bold': '#ffa657',
  'md-italic': '#a5d6ff',
  'md-code': '#7ee787',
  'md-link': '#79c0ff',
  'md-list': '#d2a8ff',
  'md-quote': '#8b949e',
};

function highlightSyntax(code: string, language: string): ReactNode[] {
  const lines = code.split('\n');

  return lines.map((line, lineIdx) => {
    const tokens = tokenizeLine(line, language);

    if (tokens.length === 0) {
      return (
        <span key={lineIdx}>
          {line}
          {lineIdx < lines.length - 1 ? '\n' : ''}
        </span>
      );
    }

    const parts: ReactNode[] = [];
    let lastEnd = 0;

    tokens.forEach((token, tokenIdx) => {
      // Text before this token
      if (token.start > lastEnd) {
        parts.push(line.slice(lastEnd, token.start));
      }
      // Token text
      parts.push(
        <span key={`${lineIdx}-${tokenIdx}`} style={{ color: TOKEN_COLORS[token.type] }}>
          {line.slice(token.start, token.end)}
        </span>
      );
      lastEnd = token.end;
    });

    // Remaining text after last token
    if (lastEnd < line.length) {
      parts.push(line.slice(lastEnd));
    }

    return (
      <span key={lineIdx}>
        {parts}
        {lineIdx < lines.length - 1 ? '\n' : ''}
      </span>
    );
  });
}
