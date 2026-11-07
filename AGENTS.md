# 项目上下文

## 技术栈

- **核心**: React 18, Vite 7, TypeScript (strict)
- **UI**: Tailwind CSS 4
- **路由**: React Router v7
- **测试**: Vitest 5 + React Testing Library
- **监控**: web-vitals
- **部署**: Docker multi-stage + nginx

## 目录结构

```
├── .github/workflows/  # CI/CD
│   └── ci.yml          # GitHub Actions: lint → test → build → deploy
├── scripts/            # 构建与启动脚本
├── server/             # Express 服务端
├── src/
│   ├── __tests__/      # 组件测试 (StageNav, MetricCard, CodeBlock)
│   ├── components/     # 可复用组件
│   │   ├── BundleChart.tsx    # 构建产物可视化
│   │   ├── CodeBlock.tsx      # 语法高亮代码块
│   │   ├── ErrorBoundary.tsx  # React 错误边界
│   │   ├── Layout.tsx         # 应用外壳
│   │   ├── MetricCard.tsx     # Web Vitals 指标卡
│   │   ├── PipelineViz.tsx    # CI/CD 流水线动画
│   │   ├── StageNav.tsx       # 左侧阶段导航
│   │   └── TestRunner.tsx     # 模拟测试运行器
│   ├── pages/          # 路由页面 (9 个阶段)
│   ├── lib/            # 工具库
│   │   ├── monitor.ts  # Web Vitals 上报封装
│   │   └── stages.ts   # 阶段定义
│   ├── test/setup.ts   # Vitest 配置
│   ├── App.tsx         # 根组件 + 路由
│   ├── main.tsx        # 入口
│   └── index.css       # 全局样式
├── Dockerfile          # 多阶段构建
├── nginx.conf          # 生产 nginx 配置
├── vitest.config.ts    # Vitest 配置
├── vite.config.ts      # Vite 配置
└── tsconfig.json       # TypeScript strict 配置
```

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。

## 开发命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 生产构建 |
| `pnpm test` | 运行测试 |
| `pnpm test:coverage` | 测试覆盖率 |
| `pnpm lint` | ESLint 检查 |
| `pnpm ts-check` | TypeScript 类型检查 |

## 编码规范

- TypeScript `strict` 模式，禁止隐式 `any`
- 函数参数必须标注类型
- 使用 Tailwind CSS + CSS 变量进行样式开发
- 组件使用 PascalCase，函数/变量使用 camelCase
