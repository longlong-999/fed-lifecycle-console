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
    // Bundle analysis (only for CI builds)
    process.env.ANALYZE && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    // Code splitting strategy
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
        },
      },
    },
    // Tree-shaking optimization
    minify: 'esbuild',
    target: 'es2020',
    // CSS code splitting
    cssCodeSplit: true,
    // Asset inlining threshold
    assetsInlineLimit: 4096,
    // Chunk size warning limit
    chunkSizeWarningLimit: 250,
  },
});`;

export function Build() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Build & Optimization</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Code splitting, tree-shaking, and bundle analysis for optimal production delivery.
        </p>
      </div>

      {/* Optimization Techniques */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="text-xs mb-4 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          OPTIMIZATION TECHNIQUES
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: 'Tree-shaking', desc: 'ESM imports allow dead code elimination. Only used exports are included in the final bundle.', impact: '-40% bundle' },
            { title: 'Code Splitting', desc: 'Manual chunks for vendor libs + route-based lazy loading for page components.', impact: '-35% initial' },
            { title: 'CSS Code Split', desc: 'Each route loads only its required CSS. Unused styles are purged at build time.', impact: '-60% CSS' },
            { title: 'Asset Optimization', desc: 'Images below 4KB inlined as base64. SVGs optimized with SVGO. Fonts subset to used glyphs.', impact: '-25% assets' },
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
        <div className="text-xs mb-4 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          BUNDLE ANALYSIS
        </div>
        <BundleChart before={beforeBundle} after={afterBundle} />
      </div>

      {/* Vite Config */}
      <CodeBlock code={viteConfig} language="typescript" filename="vite.config.ts" />
    </div>
  );
}
