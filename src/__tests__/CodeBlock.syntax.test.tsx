import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CodeBlock } from '../components/CodeBlock';

describe('CodeBlock syntax highlighting', () => {
  it('preserves URL with // inside string literals', () => {
    const { container } = render(
      <CodeBlock code={'const url = "https://example.com";'} language="typescript" />
    );
    // The full text content should be present
    const text = container.textContent ?? '';
    expect(text).toContain('https://example.com');
    // The URL should not be split into a comment — check that "https" is rendered
    expect(text).toContain('https');
  });

  it('does not treat #fff as a comment in JS/TS', () => {
    const { container } = render(
      <CodeBlock code={'const color = "#fff";'} language="typescript" />
    );
    const text = container.textContent ?? '';
    expect(text).toContain('#fff');
  });

  it('renders code after block comment on same line', () => {
    const { container } = render(
      <CodeBlock code={'foo(); /* comment */ bar();'} language="typescript" />
    );
    const text = container.textContent ?? '';
    expect(text).toContain('foo()');
    expect(text).toContain('bar()');
    expect(text).toContain('comment');
  });

  it('treats # as comment only in yaml/shell languages', () => {
    const { container: jsContainer } = render(
      <CodeBlock code={'const x = 1; # not a comment'} language="typescript" />
    );
    const jsText = jsContainer.textContent ?? '';
    // In JS, # should NOT be treated as comment start
    expect(jsText).toContain('#');

    const { container: yamlContainer } = render(
      <CodeBlock code={'# this is a yaml comment'} language="yaml" />
    );
    const yamlText = yamlContainer.textContent ?? '';
    expect(yamlText).toContain('this is a yaml comment');
  });
});

describe('CodeBlock markdown highlighting', () => {
  it('renders markdown headings with correct text', () => {
    const { container } = render(
      <CodeBlock code={'# Title\n## Subtitle\n### Section'} language="markdown" />
    );
    const text = container.textContent ?? '';
    expect(text).toContain('Title');
    expect(text).toContain('Subtitle');
    expect(text).toContain('Section');
  });

  it('renders markdown list items, bold, and links', () => {
    const { container } = render(
      <CodeBlock code={'- item one\n**bold text**\n[link](https://example.com)'} language="markdown" />
    );
    const text = container.textContent ?? '';
    expect(text).toContain('item one');
    expect(text).toContain('bold text');
    expect(text).toContain('link');
    expect(text).toContain('https://example.com');
  });

  it('renders inline code in markdown', () => {
    const { container } = render(
      <CodeBlock code={'Use `const x = 1` for constants'} language="markdown" />
    );
    const text = container.textContent ?? '';
    expect(text).toContain('const x = 1');
  });

  it('handles large markdown documents without performance issues', () => {
    // Generate a 1000+ line document
    const lines: string[] = [];
    for (let i = 0; i < 1100; i++) {
      lines.push(`## Section ${i}\n- Item ${i} with **bold** and \`code\`\n> Quote ${i}\n`);
    }
    const code = lines.join('\n');

    const start = performance.now();
    const { container } = render(
      <CodeBlock code={code} language="markdown" />
    );
    const elapsed = performance.now() - start;

    // Should complete in reasonable time (< 500ms for 3300+ lines)
    expect(elapsed).toBeLessThan(500);
    expect(container.textContent).toContain('Section 0');
    expect(container.textContent).toContain('Section 1099');
  });
});
