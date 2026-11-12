interface BundleItem {
  name: string;
  size: number;
  color: string;
}

interface BundleChartProps {
  before: BundleItem[];
  after: BundleItem[];
}

export function BundleChart({ before, after }: BundleChartProps) {
  const maxBefore = Math.max(...before.map((b) => b.size));
  const maxAfter = Math.max(...after.map((b) => b.size));
  const maxVal = Math.max(maxBefore, maxAfter);

  const totalBefore = before.reduce((sum, b) => sum + b.size, 0);
  const totalAfter = after.reduce((sum, b) => sum + b.size, 0);
  const reduction = ((1 - totalAfter / totalBefore) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded" style={{ background: 'var(--accent-red)', opacity: 0.6 }} />
          <span style={{ color: 'var(--text-secondary)' }}>优化前: {(totalBefore / 1024).toFixed(1)} KB</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded" style={{ background: 'var(--accent-green)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>优化后: {(totalAfter / 1024).toFixed(1)} KB</span>
        </div>
        <div
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: 'rgba(63, 185, 80, 0.15)', color: 'var(--accent-green)' }}
        >
          -{reduction}%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="text-xs mb-3 font-medium" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            优化前
          </div>
          <div className="space-y-2">
            {before.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-xs w-24 truncate" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  {item.name}
                </span>
                <div className="flex-1 h-5 rounded" style={{ background: 'var(--bg-tertiary)' }}>
                  <div
                    className="h-full rounded transition-all duration-1000"
                    style={{
                      width: `${(item.size / maxVal) * 100}%`,
                      background: `${item.color}80`,
                    }}
                  />
                </div>
                <span className="text-xs w-16 text-right" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {(item.size / 1024).toFixed(1)}K
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs mb-3 font-medium" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            优化后
          </div>
          <div className="space-y-2">
            {after.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-xs w-24 truncate" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  {item.name}
                </span>
                <div className="flex-1 h-5 rounded" style={{ background: 'var(--bg-tertiary)' }}>
                  <div
                    className="h-full rounded transition-all duration-1000"
                    style={{
                      width: `${(item.size / maxVal) * 100}%`,
                      background: item.color,
                    }}
                  />
                </div>
                <span className="text-xs w-16 text-right" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {(item.size / 1024).toFixed(1)}K
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Treemap visualization */}
      <div>
        <div className="text-xs mb-3 font-medium" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          BUNDLE TREEMAP (After Optimization)
        </div>
        <div className="flex h-32 rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border-default)' }}>
          {after.map((item) => {
            const pct = (item.size / totalAfter) * 100;
            return (
              <div
                key={item.name}
                className="flex flex-col items-center justify-center border-r last:border-r-0 transition-all duration-300 hover:brightness-125"
                style={{
                  width: `${pct}%`,
                  background: `${item.color}30`,
                  borderColor: 'var(--border-default)',
                }}
                title={`${item.name}: ${(item.size / 1024).toFixed(1)}KB (${pct.toFixed(1)}%)`}
              >
                <span className="text-xs font-bold" style={{ color: item.color, fontFamily: 'var(--font-mono)' }}>
                  {pct > 8 ? item.name : ''}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {pct > 5 ? `${pct.toFixed(0)}%` : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
