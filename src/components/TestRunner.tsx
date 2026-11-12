import { useState, useCallback, useRef, useEffect } from 'react';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip';
  duration: string;
}

// Real test cases from this repository's *.test.tsx files
const mockTests: TestResult[] = [
  // StageNav.test.tsx
  { name: 'StageNav › renders all stage items', status: 'pass', duration: '23ms' },
  { name: 'StageNav › highlights active stage', status: 'pass', duration: '15ms' },
  { name: 'StageNav › keyboard navigation (Alt+Arrow)', status: 'pass', duration: '42ms' },
  // MetricCard.test.tsx
  { name: 'MetricCard › displays metric name and value', status: 'pass', duration: '18ms' },
  { name: 'MetricCard › shows correct rating badge', status: 'pass', duration: '12ms' },
  { name: 'MetricCard › renders threshold values', status: 'pass', duration: '27ms' },
  // CodeBlock.test.tsx
  { name: 'CodeBlock › renders code content', status: 'pass', duration: '8ms' },
  { name: 'CodeBlock › copies code on button click', status: 'pass', duration: '35ms' },
  // New tests
  { name: 'CodeBlock › preserves URL with // in strings', status: 'pass', duration: '11ms' },
  { name: 'CodeBlock › does not treat #fff as comment', status: 'pass', duration: '9ms' },
  { name: 'CodeBlock › renders code after block comment', status: 'pass', duration: '14ms' },
  { name: 'useLocalStorage › persists checked state', status: 'pass', duration: '19ms' },
  { name: 'NotFound › renders 404 for unknown route', status: 'pass', duration: '22ms' },
];

export function TestRunner() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [currentLine, setCurrentLine] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [results, currentLine, scrollToBottom]);

  const runTests = useCallback(() => {
    setRunning(true);
    setDone(false);
    setResults([]);
    setCurrentLine('');

    const lines = [
      '$ pnpm test',
      '',
      '  FED 全流程控制台',
      '  Vitest 5.1.0 + React Testing Library',
      '  ------------------------------------------',
    ];

    let lineIdx = 0;
    const lineInterval = setInterval(() => {
      if (lineIdx < lines.length) {
        setCurrentLine(lines[lineIdx]);
        lineIdx++;
      } else {
        clearInterval(lineInterval);
        setCurrentLine('');

        let testIdx = 0;
        const testInterval = setInterval(() => {
          if (testIdx < mockTests.length) {
            setResults((prev) => [...prev, mockTests[testIdx]]);
            testIdx++;
          } else {
            clearInterval(testInterval);
            setTimeout(() => {
              setDone(true);
              setRunning(false);
            }, 300);
          }
        }, 120);
      }
    }, 80);
  }, []);

  const passCount = results.filter((r) => r.status === 'pass').length;
  const totalTests = mockTests.length;

  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-default)' }}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: 'var(--accent-red)' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: 'var(--accent-orange)' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: 'var(--accent-green)' }} />
          </div>
          <span className="text-xs ml-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>test-runner</span>
        </div>
        <div className="flex items-center gap-3">
          {done && (
            <span className="text-xs" style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
              {passCount}/{totalTests} 通过
            </span>
          )}
          <button
            onClick={runTests}
            disabled={running}
            className="text-xs px-3 py-1 rounded font-mono transition-colors cursor-pointer disabled:cursor-not-allowed"
            style={{
              background: running ? 'var(--bg-secondary)' : 'var(--accent-green)',
              color: running ? 'var(--text-muted)' : 'var(--bg-primary)',
            }}
          >
            {running ? '运行中...' : done ? '重放' : '运行测试'}
          </button>
        </div>
      </div>

      {/* Terminal */}
      <div ref={containerRef} className="p-4 h-64 overflow-y-auto font-mono text-xs leading-relaxed">
        {currentLine && (
          <div style={{ color: 'var(--text-muted)' }}>{currentLine}</div>
        )}
        {results.map((result, i) => (
          <div key={i} className="flex items-center gap-2">
            <span style={{ color: result.status === 'pass' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              {result.status === 'pass' ? '✓' : '✗'}
            </span>
            <span style={{ color: 'var(--text-primary)' }}>{result.name}</span>
            <span style={{ color: 'var(--text-muted)' }}>{result.duration}</span>
          </div>
        ))}
        {done && (
          <>
            <div className="mt-3 pt-2 border-t" style={{ borderColor: 'var(--border-default)' }}>
              <div style={{ color: 'var(--accent-green)' }}>
                测试: {totalTests} 通过, 共 {totalTests} 个
              </div>
              <div style={{ color: 'var(--text-muted)' }}>耗时: 1.247s</div>
            </div>
          </>
        )}
        {!running && results.length === 0 && !currentLine && (
          <div style={{ color: 'var(--text-muted)' }}>
            点击「运行测试」模拟执行测试用例...
          </div>
        )}
      </div>
    </div>
  );
}
