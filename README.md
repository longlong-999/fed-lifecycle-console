# FED Lifecycle Console

A comprehensive, interactive web application that demonstrates the complete frontend development lifecycle — from requirements gathering to retrospective. Built as both a functional React application and a living textbook for senior frontend engineers.

## Tech Stack

- **React 18** + **TypeScript** (strict mode)
- **Vite 7** — instant dev server, optimized builds
- **Tailwind CSS** — utility-first styling
- **React Router v7** — client-side routing
- **Vitest** + **React Testing Library** — testing framework
- **web-vitals** — performance monitoring
- **Docker** + **nginx** — production deployment

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server with HMR |
| `pnpm build` | TypeScript check + production build |
| `pnpm preview` | Preview production build locally |
| `pnpm test` | Run all tests with Vitest |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Generate test coverage report |
| `pnpm lint` | Run ESLint on source files |
| `pnpm ts-check` | TypeScript type checking |

## The 9 Stages of Frontend Lifecycle

### 1. Pipeline Overview (`/overview`)
Visual pipeline showing all stages with navigation. Key metrics at a glance.

### 2. Requirements & Technical Design (`/requirements`)
- Interactive requirement checklist with acceptance criteria
- Technology comparison cards (Vite vs Webpack, Vitest vs Jest)
- Architecture Decision Records (ADR)

### 3. Engineering Standards (`/engineering`)
- Project structure tree with naming conventions
- Real ESLint, Prettier, and tsconfig configurations
- Code style enforcement rules

### 4. Testing (`/testing`)
- Vitest + React Testing Library test code
- Interactive test runner with terminal animation
- Coverage reporting and test strategy

### 5. Build & Optimization (`/build`)
- Bundle analysis with SVG treemap visualization
- Code splitting and tree-shaking strategies
- Before/after optimization comparison

### 6. CI/CD (`/cicd`)
- GitHub Actions pipeline visualization
- Real `ci.yml` workflow configuration
- Job status animation (lint → test → build → deploy)

### 7. Deployment (`/deploy`)
- Docker multi-stage build Dockerfile
- nginx.conf with gzip, caching, SPA fallback
- Deployment flow diagram

### 8. Monitoring (`/monitoring`)
- Live Web Vitals dashboard (FCP, LCP, CLS, INP, TTFB)
- Alert threshold configuration
- Error boundary and reporting implementation

### 9. Retrospective (`/retrospective`)
- Best practices checklist by category
- Adoption progress tracking
- Key takeaways for senior engineers

## Project Structure

```
src/
├── __tests__/          # Component tests
├── components/         # Reusable UI components
├── pages/              # Route-level pages (9 stages)
├── lib/                # Utilities (monitoring, stage definitions)
├── test/setup.ts       # Vitest setup
├── App.tsx             # Root component with routes
├── main.tsx            # Entry point
└── index.css           # Global styles with CSS variables
```

## Testing

This project includes real component tests:

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# With coverage
pnpm test:coverage
```

Test files:
- `src/__tests__/StageNav.test.tsx` — Navigation component tests
- `src/__tests__/MetricCard.test.tsx` — Metric display tests
- `src/__tests__/CodeBlock.test.tsx` — Code block component tests

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`):

1. **lint** — ESLint + TypeScript type checking
2. **test** — Vitest with coverage reporting
3. **build** — Production build with Vite
4. **deploy** — Deploy to production (main branch only)

## Docker Deployment

```bash
# Build Docker image
docker build -t fed-lifecycle .

# Run container
docker run -p 80:80 fed-lifecycle
```

The Dockerfile uses multi-stage builds:
- **Stage 1**: Node.js builder — installs deps and builds
- **Stage 2**: nginx — serves static assets with optimized config

## Performance Monitoring

Web Vitals are tracked using the `web-vitals` library:
- FCP (First Contentful Paint)
- LCP (Largest Contentful Paint)
- CLS (Cumulative Layout Shift)
- INP (Interaction to Next Paint)
- TTFB (Time to First Byte)

Implementation: `src/lib/monitor.ts`

## Keyboard Navigation

- `Alt + ↑` — Navigate to previous stage
- `Alt + ↓` — Navigate to next stage

## License

MIT
