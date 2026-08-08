import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import PageShell from './components/layout/PageShell.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import Landing from './pages/Landing/Landing';

export default function App() {
  return (
    <PageShell>
      <ScrollToTop />
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Landing />} />
      </Routes>
    </PageShell>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

}