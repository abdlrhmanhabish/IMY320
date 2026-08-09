import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import PageShell from './components/layout/PageShell.jsx';
import AuthModal from './components/auth/AuthModal.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import Landing from './pages/Landing/Landing.jsx';

export default function App() {

  const location = useLocation();
  const navigate = useNavigate();

  const authMode = new URLSearchParams(location.search).get('auth');
  const isAuthOpen = authMode === 'login' || authMode === 'signup';

  const closeAuth = () => {

    const params = new URLSearchParams(location.search);
    params.delete('auth');

    const nextSearch = params.toString();

    navigate(
      `${location.pathname}${nextSearch ? `?${nextSearch}` : ''}${location.hash}`,
      { replace: true },
    );

  };

  const setAuthMode = (nextMode) => {

    const params = new URLSearchParams(location.search);
    params.set('auth', nextMode);

    navigate(
      `${location.pathname}?${params.toString()}${location.hash}`,
      { replace: true },
    );

  };

  return (
    <>
      <PageShell>
        <ScrollToTop />
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </PageShell> 

      {isAuthOpen && (
        <AuthModal
          mode={authMode}
          onClose={closeAuth}
          onModeChange={setAuthMode}
        />
      )}
    </>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;

}