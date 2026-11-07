import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)' }}>
          <div className="text-center p-8 rounded-lg border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--accent-red)' }}>
            <div className="text-2xl mb-4" style={{ color: 'var(--accent-red)' }}>
              Runtime Error Caught
            </div>
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
              The ErrorBoundary caught an unexpected error. Check the console for details.
            </p>
            <pre
              className="text-left p-4 rounded text-xs overflow-auto max-w-lg"
              style={{ background: 'var(--bg-primary)', color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}
            >
              {this.state.error?.message}
            </pre>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-4 px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer"
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
