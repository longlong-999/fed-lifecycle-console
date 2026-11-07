import { CodeBlock } from '../components/CodeBlock';

const projectTree = `├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI pipeline
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── CodeBlock.tsx       # Syntax-highlighted code display
│   │   ├── ErrorBoundary.tsx   # React error boundary
│   │   ├── Layout.tsx          # App shell with sidebar
│   │   ├── MetricCard.tsx      # Web Vitals metric display
│   │   ├── StageNav.tsx        # Left navigation panel
│   │   └── ...
│   ├── pages/                  # Route-level page components
│   │   ├── Overview.tsx
│   │   ├── Requirements.tsx
│   │   └── ...
│   ├── lib/                    # Shared utilities
│   │   ├── monitor.ts          # Web Vitals reporting
│   │   └── stages.ts           # Stage definitions
│   ├── test/
│   │   └── setup.ts            # Vitest setup file
│   ├── App.tsx                 # Root component + routes
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── .eslintrc.json              # ESLint configuration
├── .prettierrc                 # Prettier configuration
├── tsconfig.json               # TypeScript strict config
├── vite.config.ts              # Vite + React + Vitest config
├── Dockerfile                  # Multi-stage Docker build
├── nginx.conf                  # Production nginx config
└── package.json                # Dependencies & scripts`;

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
        <h2 className="text-2xl font-bold mb-2">Engineering Standards</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Project structure, naming conventions, and toolchain configuration that enforce consistency across the team.
        </p>
      </div>

      {/* Project Structure */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="text-xs mb-4 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          PROJECT STRUCTURE
        </div>
        <pre className="text-xs leading-relaxed" style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
          {projectTree}
        </pre>
      </div>

      {/* Naming Conventions */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="text-xs mb-4 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          NAMING CONVENTIONS
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { pattern: 'PascalCase', usage: 'Components, Types, Interfaces', example: 'MetricCard.tsx, StageNavProps' },
            { pattern: 'camelCase', usage: 'Functions, Variables, Hooks', example: 'useStageNav(), formatValue()' },
            { pattern: 'kebab-case', usage: 'CSS files, Asset files', example: 'metric-card.css, logo.svg' },
            { pattern: 'UPPER_SNAKE', usage: 'Constants, Env vars', example: 'MAX_RETRIES, API_BASE_URL' },
          ].map((conv) => (
            <div key={conv.pattern} className="p-3 rounded border" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-primary)' }}>
              <div className="text-xs font-bold mb-1" style={{ color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>
                {conv.pattern}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{conv.usage}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                e.g. {conv.example}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Config Code Blocks */}
      <div className="space-y-4">
        <div className="text-xs font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          TOOLCHAIN CONFIGURATION
        </div>
        <CodeBlock code={eslintConfig} language="json" filename=".eslintrc.json" />
        <CodeBlock code={prettierConfig} language="json" filename=".prettierrc" />
        <CodeBlock code={tsconfig} language="json" filename="tsconfig.json" />
        <CodeBlock code={packageScripts} language="json" filename="package.json (scripts)" />
      </div>
    </div>
  );
}
