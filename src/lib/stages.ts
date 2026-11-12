export interface Stage {
  id: string;
  path: string;
  label: string;
  icon: string;
  description: string;
}

export const stages: Stage[] = [
  {
    id: 'overview',
    path: '/overview',
    label: '全流程总览',
    icon: '◈',
    description: '研发全生命周期流水线',
  },
  {
    id: 'requirements',
    path: '/requirements',
    label: '需求与技术方案',
    icon: '◇',
    description: '需求拆解与技术选型',
  },
  {
    id: 'engineering',
    path: '/engineering',
    label: '工程规范',
    icon: '⬡',
    description: '项目初始化、ESLint、Prettier、tsconfig',
  },
  {
    id: 'testing',
    path: '/testing',
    label: '测试',
    icon: '◉',
    description: 'Vitest + React Testing Library',
  },
  {
    id: 'build',
    path: '/build',
    label: '构建与优化',
    icon: '⬢',
    description: '代码分割、Tree-shaking、Bundle 分析',
  },
  {
    id: 'cicd',
    path: '/cicd',
    label: 'CI/CD',
    icon: '⟐',
    description: 'GitHub Actions 流水线自动化',
  },
  {
    id: 'deploy',
    path: '/deploy',
    label: '部署',
    icon: '▲',
    description: 'Docker 多阶段构建 + nginx',
  },
  {
    id: 'monitoring',
    path: '/monitoring',
    label: '线上监控',
    icon: '◐',
    description: 'Web Vitals、错误追踪、告警',
  },
  {
    id: 'retrospective',
    path: '/retrospective',
    label: '复盘沉淀',
    icon: '◆',
    description: '最佳实践与经验总结',
  },
];
