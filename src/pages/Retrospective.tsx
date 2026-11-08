import { CodeBlock } from '../components/CodeBlock';
import { useCheckedSet } from '../lib/useLocalStorage';

const practicesByStage = [
  {
    stage: 'Requirements & Design',
    items: [
      { id: 'retro-req-1', text: 'Write PRD with clear acceptance criteria before coding' },
      { id: 'retro-req-2', text: 'Conduct tech design review with team before implementation' },
      { id: 'retro-req-3', text: 'Document ADRs (Architecture Decision Records) for key choices' },
    ],
  },
  {
    stage: 'Engineering Standards',
    items: [
      { id: 'retro-eng-1', text: 'Enforce ESLint + Prettier in CI, not just locally' },
      { id: 'retro-eng-2', text: 'Use path aliases for cleaner imports' },
      { id: 'retro-eng-3', text: 'Keep component files under 200 lines' },
    ],
  },
  {
    stage: 'Testing',
    items: [
      { id: 'retro-test-1', text: 'Write tests alongside features, not after' },
      { id: 'retro-test-2', text: 'Test behavior, not implementation details' },
      { id: 'retro-test-3', text: 'Aim for meaningful coverage, not 100% number' },
    ],
  },
  {
    stage: 'Build & Optimization',
    items: [
      { id: 'retro-build-1', text: 'Measure before optimizing — use bundle analyzer' },
      { id: 'retro-build-2', text: 'Code-split at route level minimum' },
      { id: 'retro-build-3', text: 'Set performance budgets in CI' },
    ],
  },
  {
    stage: 'CI/CD',
    items: [
      { id: 'retro-ci-1', text: 'Keep CI pipeline under 5 minutes' },
      { id: 'retro-ci-2', text: 'Use caching for node_modules and build artifacts' },
      { id: 'retro-ci-3', text: 'Run tests in parallel when possible' },
    ],
  },
  {
    stage: 'Deployment',
    items: [
      { id: 'retro-deploy-1', text: 'Use multi-stage Docker builds for smaller images' },
      { id: 'retro-deploy-2', text: 'Configure proper cache headers for static assets' },
      { id: 'retro-deploy-3', text: 'Implement health check endpoints' },
    ],
  },
  {
    stage: 'Monitoring',
    items: [
      { id: 'retro-monitor-1', text: 'Set up Real User Monitoring (RUM), not just lab data' },
      { id: 'retro-monitor-2', text: 'Define alerting thresholds based on user impact' },
      { id: 'retro-monitor-3', text: 'Track error rates alongside performance metrics' },
    ],
  },
  {
    stage: 'Retrospective',
    items: [
      { id: 'retro-retro-1', text: 'Document learnings in team knowledge base' },
      { id: 'retro-retro-2', text: 'Share wins and failures transparently' },
      { id: 'retro-retro-3', text: 'Create action items with owners and deadlines' },
    ],
  },
];

const totalItems = practicesByStage.reduce((sum, s) => sum + s.items.length, 0);

const retrospectiveCode = `# Sprint Retrospective — Q4 2024

## What Went Well
- Reduced bundle size by 40% through code splitting
- CI pipeline time cut from 8min to 3min with caching
- Zero production incidents in last sprint

## What Could Improve
- Test coverage dropped to 78% — need to enforce in CI
- Some PRs stayed open too long — review SLA needed
- Documentation lagged behind feature development

## Action Items
- [ ] Add coverage gate to CI (threshold: 85%)
- [ ] Implement PR review rotation
- [ ] Schedule weekly doc-sync meetings`;

export function Retrospective() {
  const [checkedSet, toggle] = useCheckedSet('retrospective');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Retrospective & Knowledge Transfer</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Documenting learnings, sharing knowledge, and continuous improvement practices.
        </p>
      </div>

      {/* Best Practices by Stage */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="text-xs mb-4 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          SENIOR FED BEST PRACTICES ({checkedSet.size}/{totalItems})
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {practicesByStage.map((section) => (
            <div key={section.stage}>
              <div className="text-xs font-bold mb-2" style={{ color: 'var(--accent-purple)' }}>
                {section.stage}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors"
                    style={{ background: checkedSet.has(item.id) ? 'rgba(188,140,255,0.1)' : 'transparent' }}
                  >
                    <input
                      type="checkbox"
                      checked={checkedSet.has(item.id)}
                      onChange={() => toggle(item.id)}
                      className="rounded"
                      style={{ accentColor: 'var(--accent-purple)' }}
                    />
                    <span className="text-xs" style={{ color: checkedSet.has(item.id) ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Knowledge Transfer Template */}
      <div>
        <div className="text-xs mb-3 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          KNOWLEDGE TRANSFER TEMPLATE
        </div>
        <CodeBlock
          language="markdown"
          filename="HANDOFF.md"
          code={`# Project Handoff Document

## Architecture Overview
- React 18 + Vite + TypeScript
- Component library with Storybook
- API layer with React Query

## Key Decisions
1. Chose Vite over CRA for faster DX
2. Using Zustand for global state (minimal footprint)
3. Deployed via Docker to Kubernetes

## Common Pitfalls
- Hot reload breaks with circular imports
- Test mocks need to be reset between tests
- Docker build cache invalidation on lockfile changes

## Contact
- Tech Lead: @senior-fed
- On-call rotation: see PagerDuty schedule`}
        />
      </div>

      {/* Retrospective Example */}
      <div>
        <div className="text-xs mb-3 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          SPRINT RETROSPECTIVE EXAMPLE
        </div>
        <CodeBlock language="markdown" filename="RETRO.md" code={retrospectiveCode} />
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Sprint Velocity', value: '42 pts', trend: '+8%' },
          { label: 'Bug Escape Rate', value: '2.1%', trend: '-15%' },
          { label: 'Code Review Time', value: '4.2h', trend: '-22%' },
          { label: 'Deploy Frequency', value: '3.2/d', trend: '+45%' },
        ].map((metric) => (
          <div key={metric.label} className="rounded-lg border p-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{metric.label}</div>
            <div className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{metric.value}</div>
            <div className="text-xs mt-1" style={{ color: metric.trend.startsWith('+') ? 'var(--accent-green)' : 'var(--accent-blue)' }}>
              {metric.trend} vs last sprint
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
