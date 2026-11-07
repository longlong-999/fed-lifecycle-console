import { useState } from 'react';

interface Practice {
  id: string;
  text: string;
  category: string;
  checked: boolean;
}

const initialPractices: Practice[] = [
  { id: 'r1', text: 'Write ADR (Architecture Decision Records) for every major tech choice', category: 'Requirements', checked: false },
  { id: 'r2', text: 'Define acceptance criteria before starting implementation', category: 'Requirements', checked: false },
  { id: 'r3', text: 'Conduct spike investigations for unknown technical risks', category: 'Requirements', checked: false },
  { id: 'e1', text: 'Enforce strict TypeScript — no `any` types in production code', category: 'Engineering', checked: false },
  { id: 'e2', text: 'Use ESLint + Prettier with pre-commit hooks (husky + lint-staged)', category: 'Engineering', checked: false },
  { id: 'e3', text: 'Maintain a living style guide / component library documentation', category: 'Engineering', checked: false },
  { id: 'e4', text: 'Establish clear directory conventions (components/, pages/, lib/)', category: 'Engineering', checked: false },
  { id: 't1', text: 'Aim for >80% statement coverage, but prioritize critical path tests', category: 'Testing', checked: false },
  { id: 't2', text: 'Write tests alongside features, not as an afterthought', category: 'Testing', checked: false },
  { id: 't3', text: 'Use React Testing Library over Enzyme for user-centric assertions', category: 'Testing', checked: false },
  { id: 't4', text: 'Include accessibility tests (axe-core) in the test suite', category: 'Testing', checked: false },
  { id: 'b1', text: 'Set and enforce bundle size budgets in CI', category: 'Build', checked: false },
  { id: 'b2', text: 'Use rollup-plugin-visualizer to track bundle composition over time', category: 'Build', checked: false },
  { id: 'b3', text: 'Implement route-based code splitting for all page components', category: 'Build', checked: false },
  { id: 'c1', text: 'CI pipeline should complete in under 5 minutes', category: 'CI/CD', checked: false },
  { id: 'c2', text: 'Require passing CI before merge — no exceptions', category: 'CI/CD', checked: false },
  { id: 'c3', text: 'Use preview deployments for PR review (Vercel/Netlify pattern)', category: 'CI/CD', checked: false },
  { id: 'd1', text: 'Multi-stage Docker builds to minimize production image size', category: 'Deploy', checked: false },
  { id: 'd2', text: 'Content-hashed filenames with 1-year cache headers for static assets', category: 'Deploy', checked: false },
  { id: 'd3', text: 'Implement health check endpoints for load balancer probes', category: 'Deploy', checked: false },
  { id: 'm1', text: 'Monitor Core Web Vitals in production with real user metrics (RUM)', category: 'Monitor', checked: false },
  { id: 'm2', text: 'Set up error tracking (Sentry) with source maps for stack traces', category: 'Monitor', checked: false },
  { id: 'm3', text: 'Define SLOs for performance metrics and alert on breaches', category: 'Monitor', checked: false },
  { id: 'p1', text: 'Conduct blameless postmortems for every production incident', category: 'Retro', checked: false },
  { id: 'p2', text: 'Document lessons learned in a shared knowledge base', category: 'Retro', checked: false },
  { id: 'p3', text: 'Regular tech debt sprints — allocate 20% of each quarter', category: 'Retro', checked: false },
];

export function Retrospective() {
  const [practices, setPractices] = useState(initialPractices);

  const togglePractice = (id: string) => {
    setPractices((prev) => prev.map((p) => (p.id === id ? { ...p, checked: !p.checked } : p)));
  };

  const categories = [...new Set(practices.map((p) => p.category))];
  const completedCount = practices.filter((p) => p.checked).length;
  const totalCount = practices.length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Retrospective & Best Practices</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Senior FED best practices checklist — actionable items distilled from real project experience.
        </p>
      </div>

      {/* Progress */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            ADOPTION PROGRESS
          </span>
          <span className="text-sm font-bold" style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
            {completedCount}/{totalCount}
          </span>
        </div>
        <div className="h-2 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${(completedCount / totalCount) * 100}%`,
              background: 'var(--accent-green)',
            }}
          />
        </div>
        <div className="flex gap-4 mt-3">
          {categories.map((cat) => {
            const catPractices = practices.filter((p) => p.category === cat);
            const catDone = catPractices.filter((p) => p.checked).length;
            return (
              <span key={cat} className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {cat}: {catDone}/{catPractices.length}
              </span>
            );
          })}
        </div>
      </div>

      {/* Checklist by Category */}
      {categories.map((category) => {
        const catPractices = practices.filter((p) => p.category === category);
        const catDone = catPractices.filter((p) => p.checked).length;

        return (
          <div key={category} className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border-default)' }}>
            <div
              className="flex items-center justify-between px-4 py-2 border-b"
              style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-default)' }}
            >
              <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                {category.toUpperCase()}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {catDone}/{catPractices.length}
              </span>
            </div>
            <div className="p-2">
              {catPractices.map((practice) => (
                <label
                  key={practice.id}
                  className="flex items-center gap-3 p-2 rounded cursor-pointer transition-colors hover:bg-white/5"
                >
                  <input
                    type="checkbox"
                    checked={practice.checked}
                    onChange={() => togglePractice(practice.id)}
                    className="w-4 h-4 rounded accent-green-500"
                  />
                  <span
                    className="text-sm"
                    style={{
                      color: practice.checked ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: practice.checked ? 'line-through' : 'none',
                    }}
                  >
                    {practice.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      })}

      {/* Key Takeaway */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--accent-green)', background: 'rgba(63,185,80,0.05)' }}>
        <div className="text-xs font-bold tracking-wider mb-3" style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
          KEY TAKEAWAY
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          The mark of a senior frontend engineer is not just writing code — it's building systems that make
          writing good code the path of least resistance. Every configuration, every CI check, every monitoring
          alert is an investment in team velocity and product reliability. The goal is to make the right thing
          the easy thing.
        </p>
      </div>
    </div>
  );
}
