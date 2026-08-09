
import { primaryNav } from '../../config/site.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useFocusTrap from '../../hooks/useFocusTrap.js';
import Button from '../ui/Button.jsx';
import Logo from './Logo.jsx';
import './Navbar.css';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

 
  useEffect(() => {
    if (!drawerOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);


  useEffect(() => {
    const media = window.matchMedia('(min-width: 48rem)');
    const handleChange = (event) => {
      if (event.matches) closeDrawer();
    };
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [closeDrawer]);

  const handleSearch = (event) => {
    event.preventDefault();
    closeDrawer();
    const trimmed = query.trim();
    navigate(trimmed ? `/courses?q=${encodeURIComponent(trimmed)}` : '/courses');
  };

  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <div className="navbar__start">
          <button
            type="button"
            className="navbar__toggle"
            aria-expanded={drawerOpen}
            aria-controls="navbar-drawer"
            onClick={() => setDrawerOpen((open) => !open)}
          >
            <MenuIcon open={drawerOpen} />
            <span className="visually-hidden">
              {drawerOpen ? 'Close main menu' : 'Open main menu'}
            </span>
          </button>

          <Logo />
        </div>
        <nav className="navbar__nav" aria-label="Primary">
          <ul className="navbar__links">
            {primaryNav.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <form className="navbar__search" role="search" onSubmit={handleSearch}>
          <label htmlFor="navbar-search" className="visually-hidden">
            Search courses
          </label>
          <SearchIcon />
          <input
            id="navbar-search"
            type="search"
            className="navbar__search-input"
            placeholder="What do you want to learn?"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" className="visually-hidden">
            Search
          </button>
        </form>

        <div className="navbar__end">
          <Button to="/auth" variant="ghost" size="sm">
            Log in
          </Button>
          <Button to="/auth" variant="primary" size="sm">
            Sign up
          </Button>
        </div>
      </div>

      <MobileDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
      />
    </header>
  );
}

function MobileDrawer({ open, onClose, query, setQuery, onSearch }) {
  const panelRef = useRef(null);

  useFocusTrap(panelRef, open, onClose);

  if (!open) return null;

  return (
    <div className="navbar__drawer-wrap">
      <button
        type="button"
        className="navbar__scrim"
        onClick={onClose}
        tabIndex={-1}
        aria-hidden="true"
      />

      <div
        id="navbar-drawer"
        ref={panelRef}
        className="navbar__drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
      >
        <form className="navbar__drawer-search" role="search" onSubmit={onSearch}>
          <label htmlFor="drawer-search" className="visually-hidden">
            Search courses
          </label>
          <SearchIcon />
          <input
            id="drawer-search"
            type="search"
            className="navbar__search-input"
            placeholder="What do you want to learn?"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" className="visually-hidden">
            Search
          </button>
        </form>

        <nav aria-label="Primary, mobile">
          <ul className="navbar__drawer-links">
            {primaryNav.map((item) => (
              <li key={item.label}>
                <NavLink to={item.to} className="navbar__drawer-link" onClick={onClose}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/about" className="navbar__drawer-link" onClick={onClose}>
                About us
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="navbar__drawer-actions">
          <Button to="/auth" variant="secondary" fullWidth onClick={onClose}>
            Log in
          </Button>
          <Button to="/auth" variant="primary" fullWidth onClick={onClose}>
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
}

function MenuIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="navbar__search-icon"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M16.5 16.5L21 21"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
