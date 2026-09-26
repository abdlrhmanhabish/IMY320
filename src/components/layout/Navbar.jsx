
import { primaryNav } from '../../config/site.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import useFocusTrap from '../../hooks/useFocusTrap.js';
import useAuth from '../../hooks/useAuth.js';
import useCart from '../../hooks/useCart.js';
import useTheme from '../../hooks/useTheme.js';
import Button from '../ui/Button.jsx';
import Logo from './Logo.jsx';
import './Navbar.css';

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { theme, toggle: toggleTheme } = useTheme();

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const authLink = (mode) => ({
    pathname: location.pathname,
    search: `?auth=${mode}`,
  });
 
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

            <li>
              <NavLink
                to="/learning"
                className={({ isActive }) =>
                  `navbar__link ${isActive ? 'navbar__link--active' : ''}`
                }
              >
                My learning
              </NavLink>
            </li>
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

        {/* this swaps for z signed in user name once a session exists */}
        <div className="navbar__end">
          <button
            type="button"
            className="navbar__theme"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <CartButton count={count} />

          {user ? (
            <>
              <span className="navbar__user" title={user.email}>
                {user.name}
              </span>
              <Button variant="secondary" size="sm" onClick={logout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button to={authLink('login')} variant="ghost" size="sm">
                Log in
              </Button>
              <Button to={authLink('signup')} variant="primary" size="sm">
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>

      <MobileDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        authLink={authLink}
        user={user}
        onLogout={logout}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </header>
  );
}

function MobileDrawer({ open, onClose, query, setQuery, onSearch, authLink, user, onLogout, theme, onToggleTheme }) {
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
              <NavLink to="/learning" className="navbar__drawer-link" onClick={onClose}>
                My learning
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart" className="navbar__drawer-link" onClick={onClose}>
                Cart
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="navbar__drawer-link" onClick={onClose}>
                About us
              </NavLink>
            </li>
          </ul>
        </nav>

        <button type="button" className="navbar__drawer-theme" onClick={onToggleTheme}>
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        </button>

        <div className="navbar__drawer-actions">
          {user ? (
            <>
              <p className="navbar__drawer-user">Signed in as {user.name}</p>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => {
                  onLogout();
                  onClose();
                }}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button to={authLink('login')} variant="secondary" fullWidth onClick={onClose}>
                Log in
              </Button>
              <Button to={authLink('signup')} variant="primary" fullWidth onClick={onClose}>
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CartButton({ count }) {
  const [bumping, setBumping] = useState(false);
  const previous = useRef(count);

  useEffect(() => {
    if (count > previous.current) {
      setBumping(true);
      const timer = setTimeout(() => setBumping(false), 500);
      previous.current = count;
      return () => clearTimeout(timer);
    }

    previous.current = count;
    return undefined;
  }, [count]);

  return (
    <Link to="/cart" className="navbar__cart" aria-label={`Cart, ${count} ${count === 1 ? 'course' : 'courses'}`}>
      <CartIcon />
      {count > 0 && (
        <span className={bumping ? 'navbar__cart-badge is-bumping' : 'navbar__cart-badge'} aria-hidden="true">
          {count}
        </span>
      )}
    </Link>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" focusable="false">
      <path
        d="M20 14.5A8.2 8.2 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        d="M3 4h2.2l2.1 10.2a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 2-1.5L20.5 8H6.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.4" fill="currentColor" />
      <circle cx="17" cy="20" r="1.4" fill="currentColor" />
    </svg>
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
