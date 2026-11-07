import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MetricCard } from '../components/MetricCard';

describe('MetricCard', () => {
  const defaultProps = {
    name: 'LCP',
    value: '2.1',
    rating: 'good' as const,
    threshold: { good: 2500, poor: 4000, unit: 'ms' },
  };

  it('displays metric name and value', () => {
    render(<MetricCard {...defaultProps} />);
    expect(screen.getByText('LCP')).toBeInTheDocument();
    expect(screen.getByText('2.1')).toBeInTheDocument();
  });

  it('shows correct rating badge for good', () => {
    render(<MetricCard {...defaultProps} />);
    expect(screen.getByText('Good')).toBeInTheDocument();
  });

  it('shows needs-improvement badge', () => {
    render(
      <MetricCard
        name="CLS"
        value="0.15"
        rating="needs-improvement"
        threshold={{ good: 0.1, poor: 0.25, unit: '' }}
      />
    );
    expect(screen.getByText('Needs Improvement')).toBeInTheDocument();
  });

  it('renders threshold values', () => {
    render(<MetricCard {...defaultProps} />);
    expect(screen.getByText(/Good: ≤2500ms/)).toBeInTheDocument();
    expect(screen.getByText(/Poor: ≥4000ms/)).toBeInTheDocument();
  });
});
