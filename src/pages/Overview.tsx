import { useNavigate } from 'react-router-dom';
import { stages } from '../lib/stages';

export function Overview() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          全流程总览
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          前端研发全生命周期 — 从需求到复盘。每个阶段都是下方流水线中可点击的节点。
        </p>
      </div>

      {/* Pipeline Visualization */}
      <div className="rounded-lg border p-4 sm:p-8" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="text-xs mb-6 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          FED 研发流水线
        </div>

        {/* Small screen: vertical list */}
        <div className="flex flex-col gap-2 sm:hidden">
          {stages.map((stage, index) => (
            <button
              key={stage.id}
              onClick={() => navigate(stage.path)}
              className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-white/5 cursor-pointer text-left"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold border-2 flex-shrink-0"
                style={{
                  background: 'var(--bg-primary)',
                  borderColor: 'var(--accent-green)',
                  color: 'var(--accent-green)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {stage.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {stage.label}
                </div>
                <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                  {stage.description}
                </div>
              </div>
              <span className="text-xs flex-shrink-0 font-mono" style={{ color: 'var(--text-muted)' }}>
                {String(index + 1).padStart(2, '0')}
              </span>
            </button>
          ))}
        </div>

        {/* Medium+ screen: horizontal pipeline */}
        <div className="relative hidden sm:block">
          {/* Connection line */}
          <div className="absolute top-6 left-6 right-6 h-0.5" style={{ background: 'var(--border-default)' }} />

          <div className="relative flex justify-between">
            {stages.map((stage, index) => (
              <button
                key={stage.id}
                onClick={() => navigate(stage.path)}
                className="flex flex-col items-center group cursor-pointer"
                style={{ width: `${100 / stages.length}%` }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-200 group-hover:scale-110 z-10"
                  style={{
                    background: 'var(--bg-secondary)',
                    borderColor: 'var(--accent-green)',
                    color: 'var(--accent-green)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {stage.icon}
                </div>
                <span className="text-xs mt-3 text-center font-medium leading-tight" style={{ color: 'var(--text-secondary)' }}>
                  {stage.label}
                </span>
                <span className="text-xs mt-1 text-center" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stage Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stages.map((stage) => (
          <button
            key={stage.id}
            onClick={() => navigate(stage.path)}
            className="text-left rounded-lg border p-4 transition-all duration-200 hover:border-green-500/50 hover:scale-[1.02] cursor-pointer"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-default)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg" style={{ color: 'var(--accent-green)' }}>{stage.icon}</span>
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{stage.label}</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stage.description}</p>
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: '阶段数', value: '9', color: 'var(--accent-green)' },
          { label: '测试覆盖率', value: '94%', color: 'var(--accent-blue)', note: '目标值' },
          { label: 'Bundle (gzip)', value: '48KB', color: 'var(--accent-purple)', note: '目标值' },
          { label: 'Lighthouse', value: '98', color: 'var(--accent-orange)', note: '目标值' },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-lg border p-4 text-center flex-1 min-w-[120px]"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-default)' }}
          >
            <div className="text-2xl font-bold" style={{ color: metric.color, fontFamily: 'var(--font-mono)' }}>
              {metric.value}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {metric.label}
              {'note' in metric && metric.note && (
                <span className="ml-1.5 text-xs px-1 py-0.5 rounded" style={{ background: 'rgba(210,153,34,0.15)', color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>
                  {metric.note}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
