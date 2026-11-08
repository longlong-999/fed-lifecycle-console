import { useState, useEffect, useCallback } from 'react';
import { MetricCard } from '../components/MetricCard';
import { CodeBlock } from '../components/CodeBlock';
import { getMetricThreshold } from '../lib/monitor';

interface MetricData {
  name: string;
  value: string;
  numericValue: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

function generateMetric(name: string): MetricData {
  const threshold = getMetricThreshold(name);
  let value: number;
  const rand = Math.random();

  if (rand < 0.6) {
    value = Math.random() * threshold.good;
  } else if (rand < 0.9) {
    value = threshold.good + Math.random() * (threshold.poor - threshold.good);
  } else {
    value = threshold.poor + Math.random() * threshold.poor * 0.3;
  }

  const rating = value <= threshold.good ? 'good' : value <= threshold.poor ? 'needs-improvement' : 'poor';

  return {
    name,
    value: name === 'CLS' ? value.toFixed(3) : Math.round(value).toString(),
    numericValue: value,
    rating,
  };
}

const monitorCode = `import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

type ReportCallback = (metric: Metric) => void;

let reportFn: ReportCallback = (metric) => {
  const body = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
    timestamp: Date.now(),
  };

  // Send to analytics endpoint
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/vitals', JSON.stringify(body));
  }
};

// Allow replacing the report function (for testing)
export function setReportFunction(fn: ReportCallback): void {
  reportFn = fn;
}

export function initMonitoring(): void {
  onFCP((m) => reportFn(m));
  onLCP((m) => reportFn(m));
  onCLS((m) => reportFn(m));
  onINP((m) => reportFn(m));
  onTTFB((m) => reportFn(m));
}`;

const errorBoundaryCode = `import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Report to error tracking service (Sentry, etc.)
    console.error('[ErrorBoundary]', error, errorInfo);
    reportError({ error, componentStack: errorInfo.componentStack });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}`;

export function Monitoring() {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const refreshMetrics = useCallback(() => {
    const names = ['FCP', 'LCP', 'CLS', 'INP', 'TTFB'];
    const newMetrics = names.map(generateMetric);
    setMetrics(newMetrics);
    setLastUpdate(new Date());
  }, []);

  useEffect(() => {
    refreshMetrics();
    const interval = setInterval(refreshMetrics, 5000);
    return () => clearInterval(interval);
  }, [refreshMetrics]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Online Monitoring</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Web Vitals real-time metrics, error boundary strategy, and alerting thresholds.
        </p>
      </div>

      {/* Web Vitals Dashboard */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            WEB VITALS — LIVE METRICS
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(210,153,34,0.15)', color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>
              Simulated Data
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Last update: {lastUpdate.toLocaleTimeString()}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent-green)' }} />
              <span className="text-xs" style={{ color: 'var(--accent-green)' }}>Live</span>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.name}
              name={metric.name}
              value={metric.value}
              rating={metric.rating}
              threshold={getMetricThreshold(metric.name)}
            />
          ))}
        </div>
      </div>

      {/* Alert Thresholds */}
      <div className="rounded-lg border p-6" style={{ borderColor: 'var(--border-default)', background: 'var(--bg-card)' }}>
        <div className="text-xs mb-4 font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          ALERT THRESHOLDS
        </div>
        <table className="w-full text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border-default)' }}>
              <th className="text-left py-2 px-3" style={{ color: 'var(--text-muted)' }}>Metric</th>
              <th className="text-left py-2 px-3" style={{ color: 'var(--accent-green)' }}>Good</th>
              <th className="text-left py-2 px-3" style={{ color: 'var(--accent-orange)' }}>Needs Improvement</th>
              <th className="text-left py-2 px-3" style={{ color: 'var(--accent-red)' }}>Poor</th>
              <th className="text-left py-2 px-3" style={{ color: 'var(--text-muted)' }}>Alert Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'FCP', good: '≤ 1.8s', ni: '1.8s - 3.0s', poor: '> 3.0s', action: 'PageSpeed audit' },
              { name: 'LCP', good: '≤ 2.5s', ni: '2.5s - 4.0s', poor: '> 4.0s', action: 'Optimize images/fonts' },
              { name: 'CLS', good: '≤ 0.1', ni: '0.1 - 0.25', poor: '> 0.25', action: 'Reserve layout space' },
              { name: 'INP', good: '≤ 200ms', ni: '200ms - 500ms', poor: '> 500ms', action: 'Debounce handlers' },
              { name: 'TTFB', good: '≤ 800ms', ni: '800ms - 1.8s', poor: '> 1.8s', action: 'CDN / cache review' },
            ].map((row) => (
              <tr key={row.name} className="border-b" style={{ borderColor: 'var(--border-default)' }}>
                <td className="py-2 px-3 font-bold" style={{ color: 'var(--text-primary)' }}>{row.name}</td>
                <td className="py-2 px-3" style={{ color: 'var(--accent-green)' }}>{row.good}</td>
                <td className="py-2 px-3" style={{ color: 'var(--accent-orange)' }}>{row.ni}</td>
                <td className="py-2 px-3" style={{ color: 'var(--accent-red)' }}>{row.poor}</td>
                <td className="py-2 px-3" style={{ color: 'var(--text-secondary)' }}>{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Code */}
      <div className="space-y-4">
        <div className="text-xs font-bold tracking-wider" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          IMPLEMENTATION
        </div>
        <CodeBlock code={monitorCode} language="typescript" filename="src/lib/monitor.ts" />
        <CodeBlock code={errorBoundaryCode} language="typescript" filename="src/components/ErrorBoundary.tsx" />
      </div>
    </div>
  );
}
