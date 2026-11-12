import { CodeBlock } from '../components/CodeBlock';
import { useCheckedSet } from '../lib/useLocalStorage';

const techComparisons = [
  {
    category: '构建工具',
    options: [
      { name: 'Vite', verdict: '选用', reason: 'ESM 原生，HMR 快 10 倍，原生 TS 支持' },
      { name: 'Webpack', verdict: '弃选', reason: '成熟但 DX 较慢，配置复杂' },
    ],
  },
  {
    category: '测试框架',
    options: [
      { name: 'Vitest', verdict: '选用', reason: 'Vite 原生集成，兼容 Jest API' },
      { name: 'Jest', verdict: '弃选', reason: '较重，TS 需要 Babel 转换' },
    ],
  },
  {
    category: '样式方案',
    options: [
      { name: 'Tailwind CSS', verdict: '选用', reason: '原子化优先，设计令牌一致，包体积小' },
      { name: 'CSS Modules', verdict: '备选', reason: '隔离性好但迭代较慢' },
    ],
  },
  {
    category: '状态管理',
    options: [
      { name: 'React useState/useReducer', verdict: '选用', reason: '满足演示范围，无额外依赖' },
      { name: 'Redux / Zustand', verdict: '过度', reason: '对本应用来说过于复杂' },
    ],
  },
];

const requirementChecklist = [
  { id: 'req-react18', text: 'React 18 并发特性' },
  { id: 'req-vite7', text: 'Vite 7 ESM 构建流水线' },
  { id: 'req-ts-strict', text: 'TypeScript strict 模式' },
  { id: 'req-eslint', text: 'ESLint + Prettier 代码质量' },
  { id: 'req-vitest', text: 'Vitest + React Testing Library' },
  { id: 'req-router', text: 'React Router v7 多分区路由' },
  { id: 'req-webvitals', text: 'Web Vitals 监控 (FCP/LCP/CLS/INP/TTFB)' },
  { id: 'req-errorboundary', text: 'ErrorBoundary 运行时错误处理' },
  { id: 'req-docker', text: 'Docker 多阶段构建 + nginx' },
  { id: 'req-cicd', text: 'GitHub Actions CI/CD 流水线' },
  { id: 'req-responsive', text: '响应式设计（手机/平板/桌面）' },
  { id: 'req-a11y', text: '无障碍（ARIA 标签、键盘导航）' },
  { id: 'req-codesplit', text: '路由级代码分割' },
  { id: 'req-darkmode', text: '深色 IDE 主题 + CSS 变量' },
];

export function Requirements() {
  const [checkedSet, toggle] = useCheckedSet('requirements');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">需求与技术方案</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          拆解项目需求，做出有据可依的技术决策。
        </p>
      </div>

      {/* Requirements Checklist */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="text-xs mb-4 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          需求清单 ({checkedSet.size}/{requirementChecklist.length})
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
          技术选型矩阵
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
                      background: opt.verdict === '选用' ? 'var(--accent-green)' : opt.verdict === '弃选' ? 'var(--accent-red)' : 'var(--accent-orange)',
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
          PRD 示例片段
        </div>
        <CodeBlock
          language="markdown"
          filename="PRD.md"
          code={`# FED 全流程控制台

## 目标
构建一个交互式 Web 应用，展示前端研发全生命周期。

## 目标受众
资深前端工程师、技术负责人、工程经理

## 核心交付物
- 9 阶段交互式流程展示
- 仓库真实代码示例
- 测试运行器模拟
- CI/CD 流水线可视化
- Web Vitals 监控面板

## 验收标准
- 所有测试通过（单元 + 集成）
- Lighthouse 评分 > 95
- gzip 包体积 < 100KB
- 完整键盘无障碍`}
        />
      </div>
    </div>
  );
}
