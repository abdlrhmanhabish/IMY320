import { Link } from 'react-router-dom';
import './PageHeader.css';

export default function PageHeader({ eyebrow, title, lead, backTo, backLabel, aside, children, className = '' }) {
  return (
    <header className={['page-header', className].filter(Boolean).join(' ')}>
      <div className="container">
        {backTo && (
          <Link to={backTo} className="page-header__back">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
              <path
                d="M15 18l-6-6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {backLabel}
          </Link>
        )}

        {eyebrow && <p className="page-header__eyebrow">{eyebrow}</p>}

        <div className="page-header__title-row">
          <h1 className="page-header__title">{title}</h1>
          {aside && <div className="page-header__aside">{aside}</div>}
        </div>

        {lead && <p className="page-header__lead">{lead}</p>}
        {children}
      </div>
    </header>
  );
}