import { type ReactNode } from 'react';
import { StageNav } from './StageNav';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <StageNav />
      <main className="flex-1 ml-64 overflow-y-auto" style={{ minHeight: '100vh' }}>
        <div className="p-8 max-w-5xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
