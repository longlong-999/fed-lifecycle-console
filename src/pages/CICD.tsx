import { CodeBlock } from '../components/CodeBlock';
import { PipelineViz } from '../components/PipelineViz';

const ciYaml = `name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm ts-check

  test:
    name: Unit & Integration Tests
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:coverage
      - uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  build:
    name: Production Build
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  deploy:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/
      - name: Deploy
        run: echo "Deploying to production..."`;

export function CICD() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">CI/CD Pipeline</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          GitHub Actions automation — lint, test, build, and deploy on every push and pull request.
        </p>
      </div>

      {/* Pipeline Visualization */}
      <PipelineViz />

      {/* Pipeline Explanation */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="text-xs mb-4 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          PIPELINE STAGES
        </div>
        <div className="space-y-3">
          {[
            { stage: 'lint', desc: 'ESLint + TypeScript type checking. Catches code quality issues and type errors before tests run.', time: '~20s' },
            { stage: 'test', desc: 'Vitest unit and integration tests with coverage reporting. Requires lint to pass first.', time: '~45s' },
            { stage: 'build', desc: 'Production build with Vite. Generates optimized assets with content hashes for caching.', time: '~30s' },
            { stage: 'deploy', desc: 'Only runs on main branch. Downloads build artifact and deploys to production environment.', time: '~15s' },
          ].map((item) => (
            <div key={item.stage} className="flex items-start gap-4 p-3 rounded" style={{ background: 'var(--bg-primary)' }}>
              <span className="text-xs font-bold px-2 py-1 rounded self-start" style={{ background: 'var(--bg-tertiary)', color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>
                {item.stage}
              </span>
              <div className="flex-1">
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
              <span className="text-xs self-center" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CI YAML */}
      <CodeBlock code={ciYaml} language="yaml" filename=".github/workflows/ci.yml" />
    </div>
  );
}
