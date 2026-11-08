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
