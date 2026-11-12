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
          node-version: 22
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
          node-version: 22
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
          node-version: 22
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
        <h2 className="text-2xl font-bold mb-2">CI/CD 流水线</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          GitHub Actions 自动化 — 每次推送和 PR 自动执行 Lint、测试、构建与部署。
        </p>
      </div>

      {/* Pipeline Visualization */}
      <PipelineViz />

      {/* Pipeline Explanation */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="text-xs mb-4 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          流水线阶段
        </div>
        <div className="space-y-3">
          {[
            { stage: 'lint', desc: 'ESLint + TypeScript 类型检查，在测试前捕获代码质量和类型错误。', time: '~20s' },
            { stage: 'test', desc: 'Vitest 单元与集成测试，含覆盖率报告。需 lint 先通过。', time: '~45s' },
            { stage: 'build', desc: 'Vite 生产构建，生成带内容哈希的优化资源用于缓存。', time: '~30s' },
            { stage: 'deploy', desc: '仅 main 分支执行，下载构建产物并部署到生产环境。', time: '~15s' },
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
