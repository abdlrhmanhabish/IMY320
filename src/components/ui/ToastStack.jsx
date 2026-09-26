import { Link } from 'react-router-dom';
import './ToastStack.css';

// dis is deliberately small
export default function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="toast-stack" role="region" aria-label="Notifications">
      <div className="visually-hidden" aria-live="polite">
        {toasts.map((toast) => (
          <p key={toast.id}>
            {toast.title}. {toast.body}
          </p>
        ))}
      </div>

      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.tone ?? 'success'}`}
          data-testid="toast"
        >
          <span className="toast__mark" aria-hidden="true">
            {toast.tone === 'error' ? <AlertIcon /> : <TickIcon />}
          </span>
          <div className="toast__body">
            <p className="toast__title">{toast.title}</p>
            {toast.body && <p className="toast__text">{toast.body}</p>}

            {toast.action && (
              <Link className="toast__action" to={toast.action.to} onClick={() => onDismiss(toast.id)}>
                {toast.action.label}
              </Link>
            )}
          </div>
          <button
            type="button"
            className="toast__close"
            onClick={() => onDismiss(toast.id)}
            aria-label={`Dismiss: ${toast.title}`}
          >
            <CloseIcon />
          </button>
        </div>
      ))}
    </div>
  );
}

function TickIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path d="M12 7v6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.3" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}