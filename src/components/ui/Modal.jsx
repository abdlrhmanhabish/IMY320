import { useEffect, useRef } from 'react';
import useFocusTrap from '../../hooks/useFocusTrap.js';
import './Modal.css';

// the shell every dialog shares: a scrim + a focus trap + Escape to close and a page that stays put behind it
//the close button comes last in the markup which allows focus to starts on the content, but it is drawn in the top corner
export default function Modal({
  open = true,
  onClose,
  labelledBy,
  describedBy,
  className = '',
  overlayClassName = '',
  backdrop = null,
  closeLabel = 'Close',
  children,
}) {
  const panelRef = useRef(null);

  useFocusTrap(panelRef, open, onClose);

  useEffect(() => {
    if (!open) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open){ 
    return null;
  }

  return (
    <div className={['modal', overlayClassName].filter(Boolean).join(' ')}>
      <button
        type="button"
        className="modal__scrim"
        onClick={onClose}
        tabIndex={-1}
        aria-hidden="true"
      />

      {backdrop}

      <section
        ref={panelRef}
        className={['modal__panel', className].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
      >
        {children}

        <button type="button" className="modal__close" onClick={onClose}>
          <CloseIcon />
          <span className="visually-hidden">{closeLabel}</span>
        </button>
      </section>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}