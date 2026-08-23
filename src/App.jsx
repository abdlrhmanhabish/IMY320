import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import PageShell from './components/layout/PageShell.jsx';
import AuthModal from './components/auth/AuthModal.jsx';
import About from './pages/About.jsx';
import Courses from './pages/Courses.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import ComingSoon from './pages/ComingSoon.jsx';
import NotFound from './pages/NotFound.jsx';
import Landing from './pages/Landing/Landing.jsx';
import courses from './data/courses.json';

export default function App() {

  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const authMode = searchParams.get('auth');
  const isAuthOpen = authMode === 'login' || authMode === 'signup';

  const enrollId = searchParams.get('enroll');
  const enrollTitle = enrollId
    ? courses.find((course) => String(course.id) === enrollId)?.title
    : undefined;

  const closeAuth = () => {

    const params = new URLSearchParams(location.search);
    params.delete('auth');
    params.delete('enroll');

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
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/careers" element={<ComingSoon page="careers" />} />
          <Route path="/press" element={<ComingSoon page="press" />} />
          <Route path="/contact" element={<ComingSoon page="contact" />} />
          <Route path="/legal/:document" element={<ComingSoon />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageShell> 

      {isAuthOpen && (
        <AuthModal
          mode={authMode}
          onClose={closeAuth}
          onModeChange={setAuthMode}
          enrollTitle={enrollTitle}
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