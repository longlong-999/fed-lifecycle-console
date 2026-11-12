import { CodeBlock } from '../components/CodeBlock';
import { useCheckedSet } from '../lib/useLocalStorage';

const practicesByStage = [
  {
    stage: '需求与技术方案',
    items: [
      { id: 'retro-req-1', text: '编码前编写含明确验收标准的 PRD' },
      { id: 'retro-req-2', text: '实现前与团队进行技术方案评审' },
      { id: 'retro-req-3', text: '为关键决策编写 ADR（架构决策记录）' },
    ],
  },
  {
    stage: '工程规范',
    items: [
      { id: 'retro-eng-1', text: '在 CI 中强制执行 ESLint + Prettier，而非仅本地' },
      { id: 'retro-eng-2', text: '使用路径别名简化导入' },
      { id: 'retro-eng-3', text: '组件文件控制在 200 行以内' },
    ],
  },
  {
    stage: '测试',
    items: [
      { id: 'retro-test-1', text: '随功能同步编写测试，而非事后补' },
      { id: 'retro-test-2', text: '测试行为而非实现细节' },
      { id: 'retro-test-3', text: '追求有意义的覆盖率，而非 100% 数字' },
    ],
  },
  {
    stage: '构建与优化',
    items: [
      { id: 'retro-build-1', text: '先度量再优化 — 使用 Bundle 分析器' },
      { id: 'retro-build-2', text: '至少做到路由级代码分割' },
      { id: 'retro-build-3', text: '在 CI 中设置性能预算' },
    ],
  },
  {
    stage: 'CI/CD',
    items: [
      { id: 'retro-ci-1', text: 'CI 流水线控制在 5 分钟以内' },
      { id: 'retro-ci-2', text: '对 node_modules 和构建产物使用缓存' },
      { id: 'retro-ci-3', text: '尽可能并行运行测试' },
    ],
  },
  {
    stage: '部署',
    items: [
      { id: 'retro-deploy-1', text: '使用多阶段 Docker 构建减小镜像' },
      { id: 'retro-deploy-2', text: '为静态资源配置合理的缓存头' },
      { id: 'retro-deploy-3', text: '实现健康检查端点' },
    ],
  },
  {
    stage: '监控',
    items: [
      { id: 'retro-monitor-1', text: '建立真实用户监控（RUM），而非仅实验室数据' },
      { id: 'retro-monitor-2', text: '基于用户影响定义告警阈值' },
      { id: 'retro-monitor-3', text: '同时追踪错误率与性能指标' },
    ],
  },
  {
    stage: '复盘沉淀',
    items: [
      { id: 'retro-retro-1', text: '将经验记录到团队知识库' },
      { id: 'retro-retro-2', text: '透明分享成功与失败' },
      { id: 'retro-retro-3', text: '创建有负责人和截止时间的行动项' },
    ],
  },
];

const totalItems = practicesByStage.reduce((sum, s) => sum + s.items.length, 0);

const retrospectiveCode = `# Sprint 复盘 — 2024 Q4

## 做得好的
- 通过代码分割将包体积减少 40%
- CI 流水线从 8 分钟缩短到 3 分钟（缓存优化）
- 上个 Sprint 零生产事故

## 待改进
- 测试覆盖率降至 78% — 需在 CI 中强制门槛
- 部分 PR 停留过久 — 需要 Code Review SLA
- 文档落后于功能开发

## 行动项
- [ ] CI 增加覆盖率门禁（阈值: 85%）
- [ ] 实施 PR 评审轮值
- [ ] 每周安排文档同步会`;

export function Retrospective() {
  const [checkedSet, toggle] = useCheckedSet('retrospective');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">复盘沉淀</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          记录经验、分享知识、持续改进。
        </p>
      </div>

      {/* Best Practices by Stage */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="text-xs mb-4 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          资深前端最佳实践 ({checkedSet.size}/{totalItems})
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
          交接文档模板
        </div>
        <CodeBlock
          language="markdown"
          filename="HANDOFF.md"
          code={`# 项目交接文档

## 架构概览
- React 18 + Vite + TypeScript
- 组件库配合 Storybook
- API 层使用 React Query

## 关键决策
1. 选用 Vite 替代 CRA，更快的开发体验
2. 使用 Zustand 管理全局状态（最小体积）
3. 通过 Docker 部署到 Kubernetes

## 常见陷阱
- 循环导入会导致热更新失效
- 测试 mock 需要在用例间重置
- lockfile 变更会导致 Docker 构建缓存失效

## 联系方式
- 技术负责人: @senior-fed
- 值班轮转: 见 PagerDuty 排班`}
        />
      </div>

      {/* Retrospective Example */}
      <div>
        <div className="text-xs mb-3 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          Sprint 复盘示例
        </div>
        <CodeBlock language="markdown" filename="RETRO.md" code={retrospectiveCode} />
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Sprint 速率', value: '42 pts', trend: '+8%' },
          { label: 'Bug 逃逸率', value: '2.1%', trend: '-15%' },
          { label: 'Code Review 时长', value: '4.2h', trend: '-22%' },
          { label: '部署频率', value: '3.2/天', trend: '+45%' },
        ].map((metric) => (
          <div key={metric.label} className="rounded-lg border p-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
            <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{metric.label}</div>
            <div className="text-xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{metric.value}</div>
            <div className="text-xs mt-1" style={{ color: metric.trend.startsWith('+') ? 'var(--accent-green)' : 'var(--accent-blue)' }}>
              {metric.trend} vs 上 Sprint
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
