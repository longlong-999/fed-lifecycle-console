import { useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';

const requirements = [
  { id: 1, text: 'User authentication & authorization flow', done: true },
  { id: 2, text: 'Real-time data dashboard with WebSocket', done: true },
  { id: 3, text: 'Responsive layout (mobile-first)', done: true },
  { id: 4, text: 'Dark mode support', done: true },
  { id: 5, text: 'i18n multi-language support', done: false },
  { id: 6, text: 'Performance budget: LCP < 2.5s', done: true },
  { id: 7, text: 'Accessibility WCAG 2.1 AA compliance', done: false },
  { id: 8, text: 'SEO optimization (SSR/SSG)', done: true },
];

const techComparison = [
  {
    category: 'Build Tool',
    options: [
      { name: 'Vite', verdict: 'Chosen', reasons: ['ESM-based, instant dev server start', 'HMR < 50ms regardless of app size', 'Rollup-based build with native ES modules'] },
      { name: 'Webpack', verdict: 'Rejected', reasons: ['Slower cold start on large projects', 'Complex configuration required', 'HMR degrades with project size'] },
    ],
  },
  {
    category: 'Test Framework',
    options: [
      { name: 'Vitest', verdict: 'Chosen', reasons: ['Native Vite integration, shared config', 'Built-in coverage via Istanbul/V8', 'Compatible with Jest API, easy migration'] },
      { name: 'Jest', verdict: 'Rejected', reasons: ['Requires separate transform config for Vite', 'Slower startup with Babel transform', 'No native ESM support without flags'] },
    ],
  },
  {
    category: 'State Management',
    options: [
      { name: 'React Context + useReducer', verdict: 'Chosen', reasons: ['Zero dependencies, built into React', 'Sufficient for this app complexity', 'TypeScript inference works well'] },
      { name: 'Redux Toolkit', verdict: 'Rejected', reasons: ['Overkill for current feature set', 'Additional boilerplate and dependencies', 'Steeper learning curve for new members'] },
    ],
  },
];

export function Requirements() {
  const [checklist, setChecklist] = useState(requirements);

  const toggleItem = (id: number) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Requirements & Technical Design</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Requirement decomposition, acceptance criteria, and technology selection rationale.
        </p>
      </div>

      {/* Requirements Checklist */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="text-xs mb-4 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          REQUIREMENT CHECKLIST
        </div>
        <div className="space-y-2">
          {checklist.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-3 p-2 rounded cursor-pointer transition-colors hover:bg-white/5"
            >
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggleItem(item.id)}
                className="w-4 h-4 rounded accent-green-500"
              />
              <span
                className="text-sm"
                style={{
                  color: item.done ? 'var(--text-muted)' : 'var(--text-primary)',
                  textDecoration: item.done ? 'line-through' : 'none',
                }}
              >
                {item.text}
              </span>
              {item.done && (
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(63,185,80,0.15)', color: 'var(--accent-green)' }}>
                  Done
                </span>
              )}
            </label>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-default)' }}>
          <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {checklist.filter((c) => c.done).length}/{checklist.length} completed
          </span>
          <div className="w-32 h-1.5 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(checklist.filter((c) => c.done).length / checklist.length) * 100}%`,
                background: 'var(--accent-green)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Tech Comparison Cards */}
      <div>
        <div className="text-xs mb-4 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          TECHNOLOGY SELECTION
        </div>
        <div className="space-y-6">
          {techComparison.map((comp) => (
            <div key={comp.category} className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border-default)' }}>
              <div className="px-4 py-2 border-b" style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-default)' }}>
                <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  {comp.category}
                </span>
              </div>
              <div className="grid grid-cols-2">
                {comp.options.map((opt) => (
                  <div
                    key={opt.name}
                    className="p-4 border-r last:border-r-0"
                    style={{ borderColor: 'var(--border-default)', background: opt.verdict === 'Chosen' ? 'rgba(63,185,80,0.03)' : 'transparent' }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{opt.name}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: opt.verdict === 'Chosen' ? 'rgba(63,185,80,0.15)' : 'rgba(248,81,73,0.15)',
                          color: opt.verdict === 'Chosen' ? 'var(--accent-green)' : 'var(--accent-red)',
                        }}
                      >
                        {opt.verdict}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {opt.reasons.map((reason, i) => (
                        <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                          <span style={{ color: opt.verdict === 'Chosen' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                            {opt.verdict === 'Chosen' ? '+' : '-'}
                          </span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Decision Record */}
      <CodeBlock
        filename="docs/adr/001-build-tool.md"
        language="markdown"
        code={`# ADR-001: Use Vite as Build Tool

## Status: Accepted

## Context
We need a fast, modern build tool for a React 18 SPA.
The team values developer experience and fast feedback loops.

## Decision
Adopt Vite 7 with @vitejs/plugin-react.

## Consequences
- Dev server starts in < 500ms (vs ~10s with Webpack)
- HMR updates in < 50ms regardless of app size
- Production builds use Rollup with tree-shaking
- Team needs to learn Vite-specific config (minimal)
- Some Webpack plugins have no Vite equivalent`}
      />
    </div>
  );
}
