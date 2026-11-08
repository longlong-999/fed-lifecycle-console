import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initMonitoring } from './lib/monitor';

// Route-level code splitting
const Overview = lazy(() => import('./pages/Overview').then((m) => ({ default: m.Overview })));
const Requirements = lazy(() => import('./pages/Requirements').then((m) => ({ default: m.Requirements })));
const Engineering = lazy(() => import('./pages/Engineering').then((m) => ({ default: m.Engineering })));
const Testing = lazy(() => import('./pages/Testing').then((m) => ({ default: m.Testing })));
const Build = lazy(() => import('./pages/Build').then((m) => ({ default: m.Build })));
const CICD = lazy(() => import('./pages/CICD').then((m) => ({ default: m.CICD })));
const Deploy = lazy(() => import('./pages/Deploy').then((m) => ({ default: m.Deploy })));
const Monitoring = lazy(() => import('./pages/Monitoring').then((m) => ({ default: m.Monitoring })));
const Retrospective = lazy(() => import('./pages/Retrospective').then((m) => ({ default: m.Retrospective })));
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

// Initialize Web Vitals monitoring
initMonitoring();

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-sm" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        Loading...
      </div>
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Navigate to="/overview" replace />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/requirements" element={<Requirements />} />
              <Route path="/engineering" element={<Engineering />} />
              <Route path="/testing" element={<Testing />} />
              <Route path="/build" element={<Build />} />
              <Route path="/cicd" element={<CICD />} />
              <Route path="/deploy" element={<Deploy />} />
              <Route path="/monitoring" element={<Monitoring />} />
              <Route path="/retrospective" element={<Retrospective />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
