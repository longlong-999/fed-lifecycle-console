import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

type ReportCallback = (metric: Metric) => void;

let reportFn: ReportCallback = (metric: Metric) => {
  const body = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
    timestamp: Date.now(),
  };

  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon('/api/vitals', JSON.stringify(body));
  }

  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`);
  }
};

export function setReportFunction(fn: ReportCallback): void {
  reportFn = fn;
}

function handleMetric(metric: Metric): void {
  reportFn(metric);
}

export function initMonitoring(): void {
  if (typeof window === 'undefined') return;

  onFCP(handleMetric);
  onLCP(handleMetric);
  onCLS(handleMetric);
  onINP(handleMetric);
  onTTFB(handleMetric);
}

export function getRatingColor(rating: string): string {
  switch (rating) {
    case 'good': return '#3fb950';
    case 'needs-improvement': return '#d29922';
    case 'poor': return '#f85149';
    default: return '#8b949e';
  }
}

export function getMetricThreshold(name: string): { good: number; poor: number; unit: string } {
  switch (name) {
    case 'FCP': return { good: 1800, poor: 3000, unit: 'ms' };
    case 'LCP': return { good: 2500, poor: 4000, unit: 'ms' };
    case 'CLS': return { good: 0.1, poor: 0.25, unit: '' };
    case 'INP': return { good: 200, poor: 500, unit: 'ms' };
    case 'TTFB': return { good: 800, poor: 1800, unit: 'ms' };
    default: return { good: 0, poor: 0, unit: '' };
  }
}
