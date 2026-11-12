import { useState, type ReactNode } from 'react';
import { StageNav } from './StageNav';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop: fixed visible; mobile: drawer */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <StageNav onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto lg:ml-0" style={{ minHeight: '100vh' }}>
        {/* Mobile header with hamburger */}
        <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 border-b lg:hidden" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-default)' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded cursor-pointer"
            style={{ background: 'var(--bg-tertiary)' }}
            aria-label="打开导航"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <span className="text-xs font-bold tracking-wider" style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>
            FED 全流程
          </span>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
