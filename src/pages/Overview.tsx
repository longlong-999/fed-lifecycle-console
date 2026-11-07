import { useNavigate } from 'react-router-dom';
import { stages } from '../lib/stages';

export function Overview() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Pipeline Overview
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Complete frontend development lifecycle — from requirements to retrospective.
          Each stage is a clickable node in the pipeline below.
        </p>
      </div>

      {/* Pipeline Visualization */}
      <div className="rounded-lg border p-8" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="text-xs mb-6 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          FED LIFECYCLE PIPELINE
        </div>

        <div className="relative">
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
      <div className="grid grid-cols-3 gap-4">
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
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Stages', value: '9', color: 'var(--accent-green)' },
          { label: 'Test Coverage', value: '94%', color: 'var(--accent-blue)' },
          { label: 'Bundle Size', value: '48KB', color: 'var(--accent-purple)' },
          { label: 'Lighthouse', value: '98', color: 'var(--accent-orange)' },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-lg border p-4 text-center"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-default)' }}
          >
            <div className="text-2xl font-bold" style={{ color: metric.color, fontFamily: 'var(--font-mono)' }}>
              {metric.value}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
