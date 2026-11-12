import { CodeBlock } from '../components/CodeBlock';
import { TestRunner } from '../components/TestRunner';

const stageNavTest = `import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StageNav } from '../components/StageNav';
import { describe, it, expect } from 'vitest';

describe('StageNav', () => {
  it('renders all stage items', () => {
    render(
      <MemoryRouter initialEntries={['/overview']}>
        <StageNav />
      </MemoryRouter>
    );
    const navItems = screen.getAllByRole('button');
    expect(navItems.length).toBe(9);
  });

  it('highlights active stage', () => {
    render(
      <MemoryRouter initialEntries={['/testing']}>
        <StageNav />
      </MemoryRouter>
    );
    const activeItem = screen.getByText('测试');
    expect(activeItem.closest('button')).toHaveAttribute(
      'aria-current', 'page'
    );
  });
});`;

const metricCardTest = `import { render, screen } from '@testing-library/react';
import { MetricCard } from '../components/MetricCard';
import { describe, it, expect } from 'vitest';

describe('MetricCard', () => {
  const defaultProps = {
    name: 'LCP',
    value: '2.1',
    rating: 'good' as const,
    threshold: { good: 2500, poor: 4000, unit: 'ms' },
  };

  it('displays metric name and value', () => {
    render(<MetricCard {...defaultProps} />);
    expect(screen.getByText('LCP')).toBeInTheDocument();
    expect(screen.getByText('2.1')).toBeInTheDocument();
  });

  it('shows correct rating badge', () => {
    render(<MetricCard {...defaultProps} />);
    expect(screen.getByText('良好')).toBeInTheDocument();
  });

  it('renders threshold values', () => {
    render(<MetricCard {...defaultProps} />);
    expect(screen.getByText(/良好: ≤2500ms/)).toBeInTheDocument();
    expect(screen.getByText(/较差: ≥4000ms/)).toBeInTheDocument();
  });
});`;

const codeBlockTest = `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CodeBlock } from '../components/CodeBlock';
import { describe, it, expect, vi } from 'vitest';

describe('CodeBlock', () => {
  it('renders code content', () => {
    render(<CodeBlock code="const x = 1;" language="ts" />);
    expect(screen.getByText(/const x = 1;/)).toBeInTheDocument();
  });

  it('copies code on button click', async () => {
    const user = userEvent.setup();
    Object.assign(navigator.clipboard, {
      writeText: vi.fn().mockResolvedValue(undefined),
    });
    render(<CodeBlock code="hello" />);
    await user.click(screen.getByText('复制'));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello');
  });
});`;

export function Testing() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">测试阶段</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Vitest + React Testing Library 进行单元与集成测试。以下为仓库真实测试代码。
        </p>
      </div>

      {/* Test Strategy */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="text-xs mb-4 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          测试策略
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { type: '单元测试', desc: '独立函数、Hooks、工具', coverage: '94%', color: 'var(--accent-green)', note: '目标值' },
            { type: '组件测试', desc: '渲染、交互、无障碍', coverage: '88%', color: 'var(--accent-blue)', note: '目标值' },
            { type: '集成测试', desc: '路由导航、数据流', coverage: '76%', color: 'var(--accent-purple)', note: '目标值' },
          ].map((item) => (
            <div key={item.type} className="p-3 rounded border" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-primary)' }}>
              <div className="text-sm font-bold mb-1" style={{ color: item.color }}>{item.type}</div>
              <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{item.desc}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                覆盖率: {item.coverage}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Test Runner */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            交互式测试运行器
          </div>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(88,166,255,0.15)', color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>
            演示回放
          </span>
        </div>
        <TestRunner />
      </div>

      {/* Real Test Code */}
      <div className="space-y-4">
        <div className="text-xs font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          仓库真实测试代码
        </div>
        <CodeBlock code={stageNavTest} language="typescript" filename="src/__tests__/StageNav.test.tsx" />
        <CodeBlock code={metricCardTest} language="typescript" filename="src/__tests__/MetricCard.test.tsx" />
        <CodeBlock code={codeBlockTest} language="typescript" filename="src/__tests__/CodeBlock.test.tsx" />
      </div>
    </div>
  );
}
