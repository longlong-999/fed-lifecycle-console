import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  retryKey: number;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, retryKey: 0 };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, retryKey: 0 };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      retryKey: prev.retryKey + 1,
    }));
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)' }}>
          <div className="text-center p-8 rounded-lg border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--accent-red)' }}>
            <div className="text-2xl mb-4" style={{ color: 'var(--accent-red)' }}>
              捕获到运行时错误
            </div>
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
              ErrorBoundary 捕获了一个未预期的错误，请查看控制台了解详情。
            </p>
            <pre
              className="text-left p-4 rounded text-xs overflow-auto max-w-lg"
              style={{ background: 'var(--bg-primary)', color: 'var(--accent-red)', fontFamily: 'var(--font-mono)' }}
            >
              {this.state.error?.message}
            </pre>
            <button
              onClick={this.handleRetry}
              className="mt-4 px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer"
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }}
            >
              重试
            </button>
          </div>
        </div>
      );
    }

    return (
      <div key={this.state.retryKey}>
        {this.props.children}
      </div>
    );
  }
}
