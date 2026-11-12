import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import type { ReactNode } from 'react';
import { StageNav } from '../components/StageNav';
import { ChecklistProvider } from '../lib/useLocalStorage';

function Wrapper({ children, initialPath = '/overview' }: { children: ReactNode; initialPath?: string }) {
  return (
    <ChecklistProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        {children}
      </MemoryRouter>
    </ChecklistProvider>
  );
}

describe('StageNav', () => {
  it('renders all stage items', () => {
    render(
      <Wrapper>
        <StageNav />
      </Wrapper>
    );
    const navButtons = screen.getAllByRole('button');
    expect(navButtons.length).toBe(9);
  });

  it('highlights active stage with aria-current', () => {
    render(
      <Wrapper initialPath="/testing">
        <StageNav />
      </Wrapper>
    );
    const activeButton = screen.getByText('测试').closest('button');
    expect(activeButton).toHaveAttribute('aria-current', 'page');
  });

  it('renders the app title', () => {
    render(
      <Wrapper>
        <StageNav />
      </Wrapper>
    );
    expect(screen.getByText('FED 全流程')).toBeInTheDocument();
  });

  it('does not show checkmark when checklist is not 100% complete', () => {
    render(
      <Wrapper>
        <StageNav />
      </Wrapper>
    );
    // With empty checklist, no stage should show ✓
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn.textContent).not.toContain('✓');
    });
  });
});
