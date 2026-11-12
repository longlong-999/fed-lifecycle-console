import { useState, useEffect } from 'react';

interface PipelineJob {
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  duration?: string;
}

export function PipelineViz() {
  const [jobs, setJobs] = useState<PipelineJob[]>([
    { name: 'lint', status: 'pending' },
    { name: 'type-check', status: 'pending' },
    { name: 'test', status: 'pending' },
    { name: 'build', status: 'pending' },
    { name: 'deploy', status: 'pending' },
  ]);

  const [running, setRunning] = useState(false);

  const runPipeline = () => {
    setRunning(true);
    setJobs([
      { name: 'lint', status: 'pending' },
      { name: 'type-check', status: 'pending' },
      { name: 'test', status: 'pending' },
      { name: 'build', status: 'pending' },
      { name: 'deploy', status: 'pending' },
    ]);

    const durations = ['12s', '8s', '34s', '22s', '15s'];
    let i = 0;

    const next = () => {
      if (i >= 5) {
        setRunning(false);
        return;
      }
      setJobs((prev) => prev.map((j, idx) => (idx === i ? { ...j, status: 'running' } : j)));
      setTimeout(() => {
        setJobs((prev) =>
          prev.map((j, idx) => (idx === i ? { ...j, status: 'success', duration: durations[i] } : j))
        );
        i++;
        setTimeout(next, 200);
      }, 800 + Math.random() * 400);
    };

    next();
  };

  useEffect(() => {
    const timer = setTimeout(runPipeline, 500);
    return () => clearTimeout(timer);
  }, [runPipeline]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'success': return 'var(--accent-green)';
      case 'running': return 'var(--accent-blue)';
      case 'failed': return 'var(--accent-red)';
      default: return 'var(--text-muted)';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'success': return '✓';
      case 'running': return '◌';
      case 'failed': return '✗';
      default: return '○';
    }
  };

  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'var(--border-default)', background: 'var(--bg-tertiary)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
            GitHub Actions — CI Pipeline
          </span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            main
          </span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(88,166,255,0.15)', color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>
            演示
          </span>
        </div>
        <button
          onClick={runPipeline}
          disabled={running}
          className="text-xs px-3 py-1 rounded font-medium transition-colors cursor-pointer disabled:opacity-50"
          style={{
            background: 'var(--accent-blue)',
            color: 'var(--bg-primary)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {running ? '运行中...' : '重放'}
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between">
          {jobs.map((job, i) => (
            <div key={job.name} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold border-2 transition-all duration-300"
                  style={{
                    borderColor: getStatusColor(job.status),
                    color: getStatusColor(job.status),
                    background: job.status === 'running' ? 'rgba(88,166,255,0.1)' : 'transparent',
                    animation: job.status === 'running' ? 'pulse 1.5s infinite' : 'none',
                  }}
                >
                  {getStatusIcon(job.status)}
                </div>
                <span className="text-xs mt-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {job.name}
                </span>
                {job.duration && (
                  <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {job.duration}
                  </span>
                )}
              </div>
              {i < jobs.length - 1 && (
                <div className="flex-1 mx-2 h-0.5 min-w-[20px]" style={{
                  background: job.status === 'success' ? 'var(--accent-green)' : 'var(--border-default)',
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
