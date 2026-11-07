import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { StageNav } from '../components/StageNav';

describe('StageNav', () => {
  it('renders all stage items', () => {
    render(
      <MemoryRouter initialEntries={['/overview']}>
        <StageNav />
      </MemoryRouter>
    );
    const navButtons = screen.getAllByRole('button');
    expect(navButtons.length).toBe(9);
  });

  it('highlights active stage with aria-current', () => {
    render(
      <MemoryRouter initialEntries={['/testing']}>
        <StageNav />
      </MemoryRouter>
    );
    const activeButton = screen.getByText('Testing').closest('button');
    expect(activeButton).toHaveAttribute('aria-current', 'page');
  });

  it('renders the app title', () => {
    render(
      <MemoryRouter initialEntries={['/overview']}>
        <StageNav />
      </MemoryRouter>
    );
    expect(screen.getByText('FED LIFECYCLE')).toBeInTheDocument();
  });
});
