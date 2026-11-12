interface MetricCardProps {
  name: string;
  value: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  threshold: { good: number; poor: number; unit: string };
}

export function MetricCard({ name, value, rating, threshold }: MetricCardProps) {
  const ratingColor = rating === 'good' ? 'var(--accent-green)' : rating === 'needs-improvement' ? 'var(--accent-orange)' : 'var(--accent-red)';
  const ratingLabel = rating === 'good' ? '良好' : rating === 'needs-improvement' ? '待优化' : '较差';

  return (
    <div
      className="rounded-lg p-5 border transition-all duration-200 hover:scale-[1.02]"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-default)' }}
      data-testid="metric-card"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold tracking-wider" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
          {name}
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: `${ratingColor}20`, color: ratingColor }}
        >
          {ratingLabel}
        </span>
      </div>
      <div className="text-3xl font-bold mb-2" style={{ color: ratingColor, fontFamily: 'var(--font-mono)' }}>
        {value}
        {threshold.unit && <span className="text-sm ml-1" style={{ color: 'var(--text-muted)' }}>{threshold.unit}</span>}
      </div>
      <div className="flex gap-4 text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        <span>良好: ≤{threshold.good}{threshold.unit}</span>
        <span>较差: ≥{threshold.poor}{threshold.unit}</span>
      </div>
      <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            background: ratingColor,
            width: `${Math.min(100, (parseFloat(value) / threshold.poor) * 100)}%`,
          }}
        />
      </div>
    </div>
  );
}
