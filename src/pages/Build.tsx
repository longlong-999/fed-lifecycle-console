import { CodeBlock } from '../components/CodeBlock';
import { BundleChart } from '../components/BundleChart';

const beforeBundle = [
  { name: 'react', size: 42000, color: '#58a6ff' },
  { name: 'react-dom', size: 120000, color: '#58a6ff' },
  { name: 'react-router', size: 38000, color: '#bc8cff' },
  { name: 'app-code', size: 85000, color: '#3fb950' },
  { name: 'vendor', size: 65000, color: '#d29922' },
  { name: 'styles', size: 18000, color: '#f85149' },
];

const afterBundle = [
  { name: 'react', size: 8200, color: '#58a6ff' },
  { name: 'react-dom', size: 32000, color: '#58a6ff' },
  { name: 'react-router', size: 12000, color: '#bc8cff' },
  { name: 'app-code', size: 28000, color: '#3fb950' },
  { name: 'vendor', size: 15000, color: '#d29922' },
  { name: 'styles', size: 6800, color: '#f85149' },
];

const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    // Bundle 分析（仅 CI 构建时启用）
    process.env.ANALYZE && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    // 代码分割策略
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
        },
      },
    },
    // Tree-shaking 优化
    minify: 'esbuild',
    target: 'es2020',
    // CSS 代码分割
    cssCodeSplit: true,
    // 资源内联阈值
    assetsInlineLimit: 4096,
    // Chunk 大小警告阈值
    chunkSizeWarningLimit: 250,
  },
});`;

export function Build() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">构建与优化</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          代码分割、Tree-shaking 与 Bundle 分析，优化生产交付。
        </p>
      </div>

      {/* Optimization Techniques */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="text-xs mb-4 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          优化手段
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: 'Tree-shaking', desc: 'ESM 导入允许死代码消除，仅使用的导出进入最终包。', impact: '-40% 包体积' },
            { title: '代码分割', desc: 'vendor 库手动分包 + 路由级懒加载页面组件。', impact: '-35% 首屏' },
            { title: 'CSS 代码分割', desc: '每个路由仅加载所需 CSS，未使用样式在构建时清除。', impact: '-60% CSS' },
            { title: '资源优化', desc: '4KB 以下图片内联 base64，SVG 用 SVGO 优化，字体子集化。', impact: '-25% 资源' },
          ].map((tech) => (
            <div key={tech.title} className="p-3 rounded border" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-primary)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{tech.title}</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(63,185,80,0.15)', color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
                  {tech.impact}
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bundle Visualization */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Bundle 分析
          </div>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(210,153,34,0.15)', color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>
            示例数据
          </span>
        </div>
        <BundleChart before={beforeBundle} after={afterBundle} />
      </div>

      {/* Vite Config */}
      <CodeBlock code={viteConfig} language="typescript" filename="vite.config.ts" />
    </div>
  );
}
