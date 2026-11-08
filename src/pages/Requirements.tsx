import { CodeBlock } from '../components/CodeBlock';
import { useCheckedSet } from '../lib/useLocalStorage';

const techComparisons = [
  {
    category: 'Build Tool',
    options: [
      { name: 'Vite', verdict: 'chosen', reason: 'ESM-native, 10x faster HMR, native TS support' },
      { name: 'Webpack', verdict: 'rejected', reason: 'Mature but slower DX, complex config' },
    ],
  },
  {
    category: 'Test Framework',
    options: [
      { name: 'Vitest', verdict: 'chosen', reason: 'Native Vite integration, Jest-compatible API' },
      { name: 'Jest', verdict: 'rejected', reason: 'Heavier, requires Babel transform for TS' },
    ],
  },
  {
    category: 'Styling',
    options: [
      { name: 'Tailwind CSS', verdict: 'chosen', reason: 'Utility-first, consistent design tokens, small bundle' },
      { name: 'CSS Modules', verdict: 'alternative', reason: 'Good isolation but slower iteration' },
    ],
  },
  {
    category: 'State Management',
    options: [
      { name: 'React useState/useReducer', verdict: 'chosen', reason: 'Sufficient for demo scope, no extra deps' },
      { name: 'Redux / Zustand', verdict: 'overkill', reason: 'Unnecessary complexity for this app' },
    ],
  },
];

const requirementChecklist = [
  { id: 'req-react18', text: 'React 18 with concurrent features' },
  { id: 'req-vite7', text: 'Vite 7 with ESM build pipeline' },
  { id: 'req-ts-strict', text: 'TypeScript strict mode enabled' },
  { id: 'req-eslint', text: 'ESLint + Prettier code quality' },
  { id: 'req-vitest', text: 'Vitest + React Testing Library' },
  { id: 'req-router', text: 'React Router v7 multi-section routing' },
  { id: 'req-webvitals', text: 'Web Vitals monitoring (FCP/LCP/CLS/INP/TTFB)' },
  { id: 'req-errorboundary', text: 'ErrorBoundary for runtime error handling' },
  { id: 'req-docker', text: 'Docker multi-stage build + nginx' },
  { id: 'req-cicd', text: 'GitHub Actions CI/CD pipeline' },
  { id: 'req-responsive', text: 'Responsive design (mobile/tablet/desktop)' },
  { id: 'req-a11y', text: 'Accessibility (ARIA labels, keyboard nav)' },
  { id: 'req-codesplit', text: 'Route-level code splitting' },
  { id: 'req-darkmode', text: 'Dark IDE theme with CSS variables' },
];

export function Requirements() {
  const [checkedSet, toggle] = useCheckedSet('requirements');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Requirements & Technical Design</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Breaking down project requirements and making informed technical decisions.
        </p>
      </div>

      {/* Requirements Checklist */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="text-xs mb-4 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          REQUIREMENTS CHECKLIST ({checkedSet.size}/{requirementChecklist.length})
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {requirementChecklist.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-2 p-2 rounded cursor-pointer transition-colors"
              style={{ background: checkedSet.has(item.id) ? 'rgba(63,185,80,0.1)' : 'transparent' }}
            >
              <input
                type="checkbox"
                checked={checkedSet.has(item.id)}
                onChange={() => toggle(item.id)}
                className="rounded"
                style={{ accentColor: 'var(--accent-green)' }}
              />
              <span className="text-sm" style={{ color: checkedSet.has(item.id) ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                {item.text}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Tech Stack Decisions */}
      <div>
        <div className="text-xs mb-4 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          TECHNOLOGY SELECTION MATRIX
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {techComparisons.map((comp) => (
            <div key={comp.category} className="rounded-lg border p-4" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
              <div className="text-sm font-bold mb-3" style={{ color: 'var(--accent-blue)' }}>{comp.category}</div>
              {comp.options.map((opt) => (
                <div key={opt.name} className="flex items-start gap-2 mb-2 last:mb-0">
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-mono"
                    style={{
                      background: opt.verdict === 'chosen' ? 'var(--accent-green)' : opt.verdict === 'rejected' ? 'var(--accent-red)' : 'var(--accent-orange)',
                      color: 'var(--bg-primary)',
                    }}
                  >
                    {opt.verdict}
                  </span>
                  <div>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{opt.name}</span>
                    <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>— {opt.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* PRD Example */}
      <div>
        <div className="text-xs mb-3 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          SAMPLE PRD EXCERPT
        </div>
        <CodeBlock
          language="markdown"
          filename="PRD.md"
          code={`# FED Lifecycle Console

## Objective
Build an interactive web application showcasing the complete frontend development lifecycle.

## Target Audience
Senior Frontend Engineers, Tech Leads, Engineering Managers

## Key Deliverables
- 9-stage interactive walkthrough
- Real working code examples from this repository
- Live test runner simulation
- CI/CD pipeline visualization
- Web Vitals monitoring dashboard

## Success Criteria
- All tests passing (unit + integration)
- Lighthouse score > 95
- Bundle size < 100KB gzipped
- Full keyboard accessibility`}
        />
      </div>
    </div>
  );
}
