import { CodeBlock } from '../components/CodeBlock';

const projectTree = `├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI 流水线
├── src/
│   ├── components/             # 可复用 UI 组件
│   │   ├── CodeBlock.tsx       # 语法高亮代码块
│   │   ├── ErrorBoundary.tsx   # React 错误边界
│   │   ├── Layout.tsx          # 应用外壳（侧栏布局）
│   │   ├── MetricCard.tsx      # Web Vitals 指标卡
│   │   ├── StageNav.tsx        # 左侧导航面板
│   │   └── ...
│   ├── pages/                  # 路由级页面组件
│   │   ├── Overview.tsx
│   │   ├── Requirements.tsx
│   │   └── ...
│   ├── lib/                    # 共享工具库
│   │   ├── monitor.ts          # Web Vitals 上报
│   │   └── stages.ts           # 阶段定义
│   ├── test/
│   │   └── setup.ts            # Vitest 配置
│   ├── App.tsx                 # 根组件 + 路由
│   ├── main.tsx                # 入口文件
│   └── index.css               # 全局样式
├── .eslintrc.json              # ESLint 配置
├── .prettierrc                 # Prettier 配置
├── tsconfig.json               # TypeScript strict 配置
├── vite.config.ts              # Vite + React + Vitest 配置
├── Dockerfile                  # 多阶段 Docker 构建
├── nginx.conf                  # 生产 nginx 配置
└── package.json                # 依赖与脚本`;

const eslintConfig = `{
  "root": true,
  "env": { "browser": true, "es2020": true },
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": ["./tsconfig.json"]
  },
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_"
    }],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}`;

const prettierConfig = `{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always",
  "endOfLine": "lf"
}`;

const tsconfig = `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}`;

const packageScripts = `{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src/ --ext .ts,.tsx",
    "lint:fix": "eslint src/ --ext .ts,.tsx --fix",
    "format": "prettier --write src/",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "ts-check": "tsc --noEmit"
  }
}`;

export function Engineering() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">工程规范</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          项目结构、命名约定与工具链配置，确保团队一致性。
        </p>
      </div>

      {/* Project Structure */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="text-xs mb-4 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          项目结构
        </div>
        <pre className="text-xs leading-relaxed" style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
          {projectTree}
        </pre>
      </div>

      {/* Naming Conventions */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="text-xs mb-4 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          命名约定
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { pattern: 'PascalCase', usage: '组件、类型、接口', example: 'MetricCard.tsx, StageNavProps' },
            { pattern: 'camelCase', usage: '函数、变量、Hooks', example: 'useStageNav(), formatValue()' },
            { pattern: 'kebab-case', usage: 'CSS 文件、资源文件', example: 'metric-card.css, logo.svg' },
            { pattern: 'UPPER_SNAKE', usage: '常量、环境变量', example: 'MAX_RETRIES, API_BASE_URL' },
          ].map((conv) => (
            <div key={conv.pattern} className="p-3 rounded border" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-primary)' }}>
              <div className="text-xs font-bold mb-1" style={{ color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>
                {conv.pattern}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{conv.usage}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                如 {conv.example}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Config Code Blocks */}
      <div className="space-y-4">
        <div className="text-xs font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          工具链配置
        </div>
        <CodeBlock code={eslintConfig} language="json" filename=".eslintrc.json" />
        <CodeBlock code={prettierConfig} language="json" filename=".prettierrc" />
        <CodeBlock code={tsconfig} language="json" filename="tsconfig.json" />
        <CodeBlock code={packageScripts} language="json" filename="package.json (scripts)" />
      </div>
    </div>
  );
}
