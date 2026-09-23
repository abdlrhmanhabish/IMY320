import { useEffect, useMemo, useRef } from 'react';
import Button from './Button.jsx';
import useFocusTrap from '../../hooks/useFocusTrap.js';
import './Celebration.css';

const PIECE_COUNT = 70;
const PALETTE = ['#4f46e5', '#12b76a', '#f79009', '#2e90fa', '#e8c15c', '#a5b4fc'];
 
// quiet ticks the whole way through then everything at once on the last step
function makePieces() {
  return Array.from({ length: PIECE_COUNT }, (_, index) => ({
    id: index,
    left: Math.random() * 100,
    delay: Math.random() * 0.9,
    duration: 2.4 + Math.random() * 1.8,
    drift: Math.round((Math.random() - 0.5) * 220),
    spin: Math.round(360 + Math.random() * 900),
    size: 6 + Math.round(Math.random() * 7),
    colour: PALETTE[index % PALETTE.length],
    round: index % 4 === 0,
  }));
}

export default function Celebration({
  open,
  eyebrow,
  title,
  body,
  stat,
  statLabel,
  primaryAction,
  secondaryAction,
  onClose,
}) {
  const panelRef = useRef(null);
  const pieces = useMemo(() => (open ? makePieces() : []), [open]);

  useFocusTrap(panelRef, open, onClose);

  useEffect(() => {
    if (!open) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="celebration">
      <div className="celebration__confetti" aria-hidden="true">
        {pieces.map((piece) => (
          <span
            key={piece.id}
            className={piece.round ? 'celebration__piece celebration__piece--round' : 'celebration__piece'}
            style={{
              left: `${piece.left}%`,
              width: `${piece.size}px`,
              height: `${piece.round ? piece.size : piece.size * 1.8}px`,
              backgroundColor: piece.colour,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              '--drift': `${piece.drift}px`,
              '--spin': `${piece.spin}deg`,
            }}
          />
        ))}
      </div>

      <section
        ref={panelRef}
        className="celebration__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="celebration-title"
      >
        <span className="celebration__badge" aria-hidden="true">
          <TrophyIcon />
        </span>

        {eyebrow && <p className="celebration__eyebrow">{eyebrow}</p>}

        <h2 id="celebration-title" className="celebration__title">
          {title}
        </h2>

        {stat && (
          <p className="celebration__stat">
            <span className="celebration__stat-value">{stat}</span>
            {statLabel && <span className="celebration__stat-label">{statLabel}</span>}
          </p>
        )}

        {body && <p className="celebration__body">{body}</p>}

        {/* the next step lives inside the celebration so the momentum has somewhere to go the second the confetti stops */}
        <div className="celebration__actions">
          {primaryAction && (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              to={primaryAction.to}
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </Button>
          )}

          {secondaryAction && (
            <Button
              variant="secondary"
              fullWidth
              to={secondaryAction.to}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true" focusable="false">
      <path
        d="M7 4h10v5a5 5 0 0 1-10 0z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M7 6H4.5a3 3 0 0 0 3 3M17 6h2.5a3 3 0 0 1-3 3M12 14v3M9 20h6M10 17h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}