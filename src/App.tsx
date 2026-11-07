import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Overview } from './pages/Overview';
import { Requirements } from './pages/Requirements';
import { Engineering } from './pages/Engineering';
import { Testing } from './pages/Testing';
import { Build } from './pages/Build';
import { CICD } from './pages/CICD';
import { Deploy } from './pages/Deploy';
import { Monitoring } from './pages/Monitoring';
import { Retrospective } from './pages/Retrospective';

export default function App() {
  return (
    <Layout>
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
      </Routes>
    </Layout>
  );
}
