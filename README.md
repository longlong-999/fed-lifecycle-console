# FED 全流程控制台

一个全面的交互式 Web 应用，完整展示前端研发全生命周期——从需求收集到复盘沉淀。它既是一个可运行的 React 应用，也是一份面向资深前端工程师的「活的」全流程教科书。

## 技术栈

- **React 18** + **TypeScript**（strict 模式）
- **Vite 7** — 即时启动开发服务器，优化构建
- **Tailwind CSS** — 原子化样式方案
- **React Router v7** — 客户端路由
- **Vitest** + **React Testing Library** — 测试框架
- **web-vitals** — 性能监控
- **Docker** + **nginx** — 生产部署

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 生产构建
pnpm build
```

## 可用脚本

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动 Vite 开发服务器（支持 HMR） |
| `pnpm build` | TypeScript 类型检查 + 生产构建 |
| `pnpm preview` | 本地预览生产构建产物 |
| `pnpm test` | 使用 Vitest 运行全部测试 |
| `pnpm test:watch` | 监听模式运行测试 |
| `pnpm test:coverage` | 生成测试覆盖率报告 |
| `pnpm lint` | 对源文件运行 ESLint |
| `pnpm ts-check` | TypeScript 类型检查 |

## 前端全生命周期 9 个阶段

### 1. Pipeline 总览（`/overview`）
可视化流水线展示所有阶段及导航，关键指标一目了然。

### 2. 需求与技术方案（`/requirements`）
- 可交互的需求清单与验收标准
- 技术选型对比卡（Vite vs Webpack、Vitest vs Jest）
- 架构决策记录（ADR）

### 3. 工程规范（`/engineering`）
- 项目结构树与命名约定
- 真实的 ESLint、Prettier、tsconfig 配置
- 代码风格强制规则

### 4. 测试（`/testing`）
- Vitest + React Testing Library 测试代码
- 带终端动画的交互式测试运行器
- 覆盖率报告与测试策略

### 5. 构建与优化（`/build`）
- SVG Treemap 可视化 Bundle 分析
- 代码分割与 Tree-shaking 策略
- 优化前后对比

### 6. CI/CD（`/cicd`）
- GitHub Actions 流水线可视化
- 真实的 `ci.yml` 工作流配置
- Job 状态流转动画（lint → test → build → deploy）

### 7. 部署（`/deploy`）
- Docker 多阶段构建 Dockerfile
- nginx.conf 配置（gzip、缓存策略、SPA 回退）
- 部署流程图

### 8. 线上监控（`/monitoring`）
- 实时 Web Vitals 仪表盘（FCP、LCP、CLS、INP、TTFB）
- 告警阈值配置
- Error Boundary 与上报实现

### 9. 复盘沉淀（`/retrospective`）
- 按分类的最佳实践清单
- 采纳进度追踪
- 资深工程师关键经验总结

## 项目结构

```
src/
├── __tests__/          # 组件测试
├── components/         # 可复用 UI 组件
├── pages/              # 路由级页面（9 个阶段）
├── lib/                # 工具库（监控、阶段定义）
├── test/setup.ts       # Vitest 配置
├── App.tsx             # 根组件与路由
├── main.tsx            # 入口文件
└── index.css           # 全局样式与 CSS 变量
```

## 测试

本项目包含真实的组件测试：

```bash
# 运行全部测试
pnpm test

# 监听模式
pnpm test:watch

# 带覆盖率
pnpm test:coverage
```

测试文件：
- `src/__tests__/StageNav.test.tsx` — 导航组件测试
- `src/__tests__/MetricCard.test.tsx` — 指标卡片测试
- `src/__tests__/CodeBlock.test.tsx` — 代码块组件测试

## CI/CD 流水线

GitHub Actions 工作流（`.github/workflows/ci.yml`）：

1. **lint** — ESLint + TypeScript 类型检查
2. **test** — Vitest 测试 + 覆盖率报告
3. **build** — Vite 生产构建
4. **deploy** — 部署到生产环境（仅 main 分支）

## Docker 部署

```bash
# 构建 Docker 镜像
docker build -t fed-lifecycle .

# 运行容器
docker run -p 80:80 fed-lifecycle
```

Dockerfile 采用多阶段构建：
- **Stage 1**：Node.js 构建器 — 安装依赖并构建
- **Stage 2**：nginx — 以优化配置提供静态资源服务

## GitHub Pages 部署

本项目支持自动部署到 GitHub Pages（免费静态托管）。

### 配置步骤

1. 进入仓库 **Settings → Pages**
2. **Source** 选择 **GitHub Actions**
3. 推送代码到 `main` 分支即自动触发部署

### 部署流程

```
push to main → install → build (--base=/<repo>/) → SPA fallback (404.html) → upload artifact → deploy
```

- 构建命令自动追加 `--base=/<仓库名>/`，适配 Pages 子路径
- 构建后执行 `cp dist/index.html dist/404.html`，确保 SPA 路由 404 兜底
- 支持手动触发：Actions → Deploy to GitHub Pages → Run workflow

### 站点地址

```
https://<owner>.github.io/<repo>/
```

## 性能监控

使用 `web-vitals` 库追踪 Web Vitals 指标：
- FCP（First Contentful Paint）
- LCP（Largest Contentful Paint）
- CLS（Cumulative Layout Shift）
- INP（Interaction to Next Paint）
- TTFB（Time to First Byte）

实现文件：`src/lib/monitor.ts`

## 键盘导航

- `Alt + ↑` — 切换到上一阶段
- `Alt + ↓` — 切换到下一阶段

## 许可证

MIT
