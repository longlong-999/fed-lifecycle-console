import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { NotFound } from '../pages/NotFound';

describe('NotFound page', () => {
  it('renders 404 for unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/some/unknown/path']}>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('displays the current path', () => {
    render(
      <MemoryRouter initialEntries={['/nonexistent']}>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText('/nonexistent')).toBeInTheDocument();
  });

  it('has a back to overview button', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText('Back to Overview')).toBeInTheDocument();
  });
});
