import { useState, useCallback, useRef, useEffect } from 'react';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip';
  duration: string;
}

const mockTests: TestResult[] = [
  { name: 'StageNav renders all stage items', status: 'pass', duration: '23ms' },
  { name: 'StageNav highlights active stage', status: 'pass', duration: '15ms' },
  { name: 'StageNav keyboard navigation (Alt+Arrow)', status: 'pass', duration: '42ms' },
  { name: 'MetricCard displays correct rating color', status: 'pass', duration: '18ms' },
  { name: 'MetricCard shows threshold values', status: 'pass', duration: '12ms' },
  { name: 'MetricCard progress bar width calculation', status: 'pass', duration: '27ms' },
  { name: 'CodeBlock renders code content', status: 'pass', duration: '8ms' },
  { name: 'CodeBlock copy button works', status: 'pass', duration: '35ms' },
  { name: 'CodeBlock syntax highlighting', status: 'pass', duration: '19ms' },
  { name: 'ErrorBoundary catches render errors', status: 'pass', duration: '31ms' },
  { name: 'ErrorBoundary displays fallback UI', status: 'pass', duration: '14ms' },
  { name: 'ErrorBoundary retry resets state', status: 'pass', duration: '22ms' },
];

export function TestRunner() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [currentLine, setCurrentLine] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const runTests = useCallback(() => {
    setResults([]);
    setRunning(true);
    setDone(false);
    setCurrentLine('');

    const lines = [
      '$ vitest run',
      '',
      ' DEV  v5.1.0 /workspace/projects',
      '',
    ];

    let lineIndex = 0;
    let testIndex = 0;

    const timer = setInterval(() => {
      if (lineIndex < lines.length) {
        setCurrentLine(lines[lineIndex]);
        lineIndex++;
      } else if (testIndex < mockTests.length) {
        const test = mockTests[testIndex];
        setResults((prev) => [...prev, test]);
        testIndex++;
      } else {
        clearInterval(timer);
        setRunning(false);
        setDone(true);
        setCurrentLine('');
      }
    }, 120);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [results, currentLine]);

  const passCount = results.filter((r) => r.status === 'pass').length;
  const totalCount = results.length;

  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-primary)' }}>
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-default)' }}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: 'var(--accent-red)' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: 'var(--accent-orange)' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: 'var(--accent-green)' }} />
          </div>
          <span className="text-xs ml-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Terminal — vitest
          </span>
        </div>
        <button
          onClick={runTests}
          disabled={running}
          className="text-xs px-3 py-1 rounded font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: running ? 'var(--bg-secondary)' : 'var(--accent-green)',
            color: running ? 'var(--text-muted)' : 'var(--bg-primary)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {running ? 'Running...' : done ? 'Re-run' : 'Run Tests'}
        </button>
      </div>

      <div
        ref={containerRef}
        className="p-4 h-80 overflow-y-auto"
        style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}
      >
        {results.length === 0 && !running && (
          <div style={{ color: 'var(--text-muted)' }}>
            Click "Run Tests" to simulate vitest execution...
          </div>
        )}

        {currentLine && (
          <div style={{ color: 'var(--text-secondary)' }}>{currentLine}</div>
        )}

        {results.map((result, i) => (
          <div key={i} className="flex items-center gap-2 py-0.5">
            <span style={{ color: result.status === 'pass' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {result.status === 'pass' ? '✓' : result.status === 'fail' ? '✗' : '○'}
            </span>
            <span style={{ color: 'var(--text-primary)' }}>{result.name}</span>
            <span style={{ color: 'var(--text-muted)' }}>{result.duration}</span>
          </div>
        ))}

        {done && (
          <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--border-default)' }}>
            <div style={{ color: 'var(--accent-green)' }}>
              Tests {totalCount} passed ({(totalCount * 35).toFixed(0)}ms)
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              Test Files  4 passed (4)
            </div>
            <div className="mt-2" style={{ color: 'var(--text-secondary)' }}>
              <span className="inline-block mr-4">Stmts: <span style={{ color: 'var(--accent-green)' }}>94.2%</span></span>
              <span className="inline-block mr-4">Branch: <span style={{ color: 'var(--accent-green)' }}>88.5%</span></span>
              <span className="inline-block mr-4">Funcs: <span style={{ color: 'var(--accent-green)' }}>91.7%</span></span>
              <span className="inline-block">Lines: <span style={{ color: 'var(--accent-green)' }}>95.1%</span></span>
            </div>
          </div>
        )}

        {running && (
          <div className="flex items-center gap-1 mt-1">
            <span className="inline-block w-2 h-4 animate-pulse" style={{ background: 'var(--accent-green)' }} />
          </div>
        )}
      </div>

      {done && (
        <div className="px-4 py-2 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-secondary)' }}>
          <span className="text-xs" style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
            {passCount}/{totalCount} passed
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Coverage: 94.2%
          </span>
        </div>
      )}
    </div>
  );
}
