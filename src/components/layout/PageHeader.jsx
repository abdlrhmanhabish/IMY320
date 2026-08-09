import { Link } from 'react-router-dom';
import './PageHeader.css';


export default function PageHeader({ eyebrow, title, lead, backTo = '/about', backLabel = 'Back to About' }) {
  return (
    <header className="page-header">
      <div className="container">
        <Link to={backTo} className="page-header__back">
          <svg
            className="page-header__back-icon"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            aria-hidden="true"
            focusable="false"
          >
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
        {eyebrow && <p className="section__eyebrow">{eyebrow}</p>}
        <h1 className="page-header__title">{title}</h1>
        {lead && <p className="page-header__lead">{lead}</p>}
      </div>
    </header>
  );
}