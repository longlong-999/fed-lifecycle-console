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
    label: 'Pipeline Overview',
    icon: '◈',
    description: 'Full lifecycle pipeline visualization',
  },
  {
    id: 'requirements',
    path: '/requirements',
    label: 'Requirements & Design',
    icon: '◇',
    description: 'Requirement analysis & technical proposals',
  },
  {
    id: 'engineering',
    path: '/engineering',
    label: 'Engineering Standards',
    icon: '⬡',
    description: 'Project init, ESLint, Prettier, tsconfig',
  },
  {
    id: 'testing',
    path: '/testing',
    label: 'Testing',
    icon: '◉',
    description: 'Vitest + React Testing Library',
  },
  {
    id: 'build',
    path: '/build',
    label: 'Build & Optimization',
    icon: '⬢',
    description: 'Code splitting, tree-shaking, bundle analysis',
  },
  {
    id: 'cicd',
    path: '/cicd',
    label: 'CI/CD',
    icon: '⟐',
    description: 'GitHub Actions pipeline automation',
  },
  {
    id: 'deploy',
    path: '/deploy',
    label: 'Deployment',
    icon: '▲',
    description: 'Docker multi-stage build + nginx',
  },
  {
    id: 'monitoring',
    path: '/monitoring',
    label: 'Monitoring',
    icon: '◐',
    description: 'Web Vitals, error tracking, alerting',
  },
  {
    id: 'retrospective',
    path: '/retrospective',
    label: 'Retrospective',
    icon: '✦',
    description: 'Best practices & lessons learned',
  },
];
