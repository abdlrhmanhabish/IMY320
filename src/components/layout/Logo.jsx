import './Logo.css';
import { Link } from 'react-router-dom';
import { site } from '../../config/site.js';

export default function Logo({ className = '' }) {
  return (
    <Link to="/" className={['logo', className].filter(Boolean).join(' ')}>
      <svg
        className="logo__mark"
        viewBox="0 0 32 32"
        width="28"
        height="28"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="2" y="18" width="7" height="12" rx="2" fill="currentColor" opacity="0.45" />
        <rect x="12.5" y="11" width="7" height="19" rx="2" fill="currentColor" opacity="0.7" />
        <rect x="23" y="2" width="7" height="28" rx="2" fill="currentColor" />
      </svg>
      <span className="logo__word">{site.name}</span>
    </Link>
  );
}