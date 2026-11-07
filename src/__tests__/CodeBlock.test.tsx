import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CodeBlock } from '../components/CodeBlock';

describe('CodeBlock', () => {
  it('renders code content', () => {
    render(<CodeBlock code="const x = 1;" language="ts" />);
    expect(screen.getByText(/const/)).toBeInTheDocument();
  });

  it('displays filename when provided', () => {
    render(<CodeBlock code="test" filename="example.ts" />);
    expect(screen.getByText('example.ts')).toBeInTheDocument();
  });

  it('shows copy button', () => {
    render(<CodeBlock code="hello world" />);
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('copies code on button click', async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator.clipboard, { writeText: writeTextMock });

    render(<CodeBlock code="copy me" />);
    await user.click(screen.getByText('Copy'));
    expect(writeTextMock).toHaveBeenCalledWith('copy me');
  });
});
