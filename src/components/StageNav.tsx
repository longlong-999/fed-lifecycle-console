import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useCallback, useMemo } from 'react';
import { stages } from '../lib/stages';
import { useCheckedCount } from '../lib/useLocalStorage';

interface StageNavProps {
  onClose?: () => void;
}

// Total items per checklist stage (must match the page definitions)
const CHECKLIST_TOTALS: Record<string, number> = {
  requirements: 14,
  retrospective: 24,
};

export function StageNav({ onClose }: StageNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Subscribe to shared store for real-time counts
  const reqCount = useCheckedCount('requirements');
  const retroCount = useCheckedCount('retrospective');

  const currentPath = location.pathname;

  // Keyboard navigation: Alt+Arrow keys
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      const currentIdx = stages.findIndex((s) => s.path === currentPath);
      let nextIdx: number;
      if (e.key === 'ArrowDown') {
        nextIdx = currentIdx < stages.length - 1 ? currentIdx + 1 : 0;
      } else {
        nextIdx = currentIdx > 0 ? currentIdx - 1 : stages.length - 1;
      }
      navigate(stages[nextIdx].path);
    }
  }, [currentPath, navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Determine completion: 100% of checklist must be checked
  const isStageComplete = useMemo(() => {
    return (id: string): boolean => {
      if (id === 'requirements') {
        const total = CHECKLIST_TOTALS[id] ?? 0;
        return total > 0 && reqCount >= total;
      }
      if (id === 'retrospective') {
        const total = CHECKLIST_TOTALS[id] ?? 0;
        return total > 0 && retroCount >= total;
      }
      return false;
    };
  }, [reqCount, retroCount]);

  return (
    <aside className="h-screen flex flex-col border-r overflow-y-auto" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}>
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg" style={{ color: 'var(--accent-green)' }}>⚡</span>
            <h1 className="text-sm font-bold tracking-wide" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              FED 全流程
            </h1>
          </div>
          {/* Close button for mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded cursor-pointer lg:hidden"
              style={{ color: 'var(--text-muted)' }}
              aria-label="关闭导航"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>资深前端指南</p>
      </div>

      {/* Stage List */}
      <nav className="flex-1 p-3 space-y-1">
        {stages.map((stage, index) => {
          const isActive = currentPath === stage.path;
          const isComplete = isStageComplete(stage.id);

          return (
            <button
              key={stage.id}
              onClick={() => {
                navigate(stage.path);
                onClose?.();
              }}
              aria-current={isActive ? 'page' : undefined}
              className="w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-3 group cursor-pointer"
              style={{
                background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--accent-green)' : '2px solid transparent',
              }}
            >
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono"
                style={{
                  background: isComplete ? 'var(--accent-green)' : isActive ? 'var(--accent-blue)' : 'var(--bg-primary)',
                  color: isComplete || isActive ? 'var(--bg-primary)' : 'var(--text-muted)',
                }}
              >
                {isComplete ? '✓' : index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm font-medium truncate"
                  style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                >
                  {stage.label}
                </div>
                <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                  {stage.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t text-xs" style={{ borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}>
        <div className="flex items-center gap-1.5 mb-1">
          <span style={{ color: 'var(--accent-green)' }}>●</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>Alt+↑↓ 切换阶段</span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)' }}>v1.0.0 · React + Vite</div>
      </div>
    </aside>
  );
}
