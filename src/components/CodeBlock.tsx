import { useState, useCallback, type ReactNode } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export function CodeBlock({ code, language = 'typescript', filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-primary)' }}>
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-default)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            {filename || language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs px-2 py-1 rounded transition-colors cursor-pointer"
          style={{
            background: copied ? 'var(--accent-green)' : 'var(--bg-secondary)',
            color: copied ? 'var(--bg-primary)' : 'var(--text-secondary)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {copied ? '✓ Copied' : 'Copy'}
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

function highlightSyntax(code: string, _language: string): ReactNode[] {
  const lines = code.split('\n');
  return lines.map((line, i) => {
    const parts: ReactNode[] = [];
    const remaining = line;
    let key = 0;

    // Comments
    const commentMatch = remaining.match(/^(.*?)(\/\/.*$|\/\*.*?\*\/|#.*$)/);
    if (commentMatch) {
      const before = commentMatch[1];
      const comment = commentMatch[2];
      if (before) parts.push(...colorizeLine(before, key));
      parts.push(
        <span key={`c-${i}-${key++}`} style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
          {comment}
        </span>
      );
    } else {
      parts.push(...colorizeLine(remaining, key));
    }

    return (
      <span key={`line-${i}`}>
        {parts}
        {i < lines.length - 1 ? '\n' : ''}
      </span>
    );
  });
}

function colorizeLine(line: string, startKey: number): ReactNode[] {
  const parts: ReactNode[] = [];
  let key = startKey;

  // Simple token-based highlighting
  let lastIndex = 0;
  const tokens: { start: number; end: number; type: string }[] = [];

  let match;
  const combinedRegex = /(["'`])(?:(?!\1|\\).|\\.)*?\1|\/\/.*$|\/\*.*?\*\/|#.*$|\b(import|export|from|const|let|var|function|return|if|else|switch|case|break|default|class|extends|interface|type|enum|async|await|new|try|catch|throw|typeof|instanceof|void|null|undefined|true|false|this|super|static|readonly|public|private|protected)\b|\b(string|number|boolean|any|never|unknown|object|Array|Promise|Record|Partial|Required|Pick|Omit)\b|\b(\d+\.?\d*)\b/g;

  while ((match = combinedRegex.exec(line)) !== null) {
    const text = match[0];
    let tokenType: string;
    if (text.startsWith('"') || text.startsWith("'") || text.startsWith('`')) {
      tokenType = 'string';
    } else if (text.startsWith('//') || text.startsWith('/*') || text.startsWith('#')) {
      tokenType = 'comment';
    } else if (match[2]) {
      tokenType = 'keyword';
    } else if (match[3]) {
      tokenType = 'type';
    } else if (match[4]) {
      tokenType = 'number';
    } else {
      continue;
    }
    tokens.push({ start: match.index, end: match.index + text.length, type: tokenType });
  }

  for (const token of tokens) {
    if (token.start > lastIndex) {
      parts.push(<span key={`t-${key++}`}>{line.slice(lastIndex, token.start)}</span>);
    }
    const color = getColorForType(token.type);
    parts.push(
      <span key={`t-${key++}`} style={{ color }}>
        {line.slice(token.start, token.end)}
      </span>
    );
    lastIndex = token.end;
  }

  if (lastIndex < line.length) {
    parts.push(<span key={`t-${key++}`}>{line.slice(lastIndex)}</span>);
  }

  if (parts.length === 0) {
    parts.push(line);
  }

  return parts;
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
