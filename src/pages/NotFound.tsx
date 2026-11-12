import { useLocation, useNavigate } from 'react-router-dom';

export function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div
        className="text-6xl font-bold mb-4"
        style={{ color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}
      >
        404
      </div>
      <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        页面未找到
      </h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        路径 <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'var(--bg-tertiary)', fontFamily: 'var(--font-mono)', color: 'var(--accent-orange)' }}>{location.pathname}</code> 不存在。
      </p>
      <button
        onClick={() => navigate('/overview')}
        className="px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer"
        style={{ background: 'var(--accent-green)', color: 'var(--bg-primary)' }}
      >
        返回总览
      </button>
    </div>
  );
}
