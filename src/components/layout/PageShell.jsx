import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import './PageShell.css';

export default function PageShell({ children }) {
  return (
    <div className="page-shell">
      <a href="#main-content" className="page-shell__skip">
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content" className="page-shell__main" tabIndex={-1}>
        {children}
      </main>

      <Footer />
    </div>
  );
}