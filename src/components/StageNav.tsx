import { useLocation, useNavigate } from 'react-router-dom';
import { stages } from '../lib/stages';
import { useEffect } from 'react';

export function StageNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const currentIndex = stages.findIndex((s) => s.path === currentPath);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'ArrowDown') {
        e.preventDefault();
        const next = Math.min(currentIndex + 1, stages.length - 1);
        navigate(stages[next].path);
      } else if (e.altKey && e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = Math.max(currentIndex - 1, 0);
        navigate(stages[prev].path);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, navigate]);

  return (
    <nav
      className="fixed left-0 top-0 h-full w-64 flex flex-col border-r overflow-y-auto"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}
      aria-label="Stage navigation"
    >
      <div className="p-5 border-b" style={{ borderColor: 'var(--border-default)' }}>
        <h1 className="text-sm font-bold tracking-wider" style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
          FED LIFECYCLE
        </h1>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          Senior Engineer Console
        </p>
      </div>

      <div className="flex-1 py-4">
        {stages.map((stage, index) => {
          const isActive = currentPath === stage.path;
          const isCompleted = index < currentIndex;

          return (
            <button
              key={stage.id}
              onClick={() => navigate(stage.path)}
              className="w-full text-left px-5 py-3 flex items-center gap-3 transition-all duration-150 cursor-pointer border-l-2"
              style={{
                background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                borderColor: isActive ? 'var(--accent-green)' : 'transparent',
                borderLeftColor: isActive ? 'var(--accent-green)' : 'transparent',
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: isCompleted ? 'var(--accent-green)' : isActive ? 'var(--bg-primary)' : 'var(--bg-primary)',
                  color: isCompleted ? 'var(--bg-primary)' : isActive ? 'var(--accent-green)' : 'var(--text-muted)',
                  border: `1px solid ${isCompleted ? 'var(--accent-green)' : isActive ? 'var(--accent-green)' : 'var(--border-default)'}`,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {isCompleted ? '✓' : stage.icon}
              </span>
              <div className="min-w-0">
                <div
                  className="text-xs font-medium truncate"
                  style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                >
                  {stage.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t text-xs" style={{ borderColor: 'var(--border-default)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        <div>Alt+↑↓ Navigate</div>
        <div className="mt-1">v1.0.0 · React 18 + Vite</div>
      </div>
    </nav>
  );
}
