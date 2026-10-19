import { useEffect, useId, useMemo } from 'react';
import Button from './Button.jsx';
import Modal from './Modal.jsx';
import useToast from '../../hooks/useToast.js';
import './Celebration.css';

const PIECE_COUNT = 70;
const PALETTE = ['#0f766e', '#12b76a', '#f79009', '#2e90fa', '#e8c15c', '#d946ef'];

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
  media,
  children,
  wide = false,
  primaryAction,
  secondaryAction,
  onClose,
}) {
  const pieces = useMemo(() => (open ? makePieces() : []), [open]);
  const { dismissAll } = useToast();
  const titleId = useId();

  useEffect(() => {
    if (open){ 
      dismissAll();
    }
  }, [open, dismissAll]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      overlayClassName="celebration"
      className={wide ? 'celebration__panel celebration__panel--wide' : 'celebration__panel'}
      backdrop={<Confetti pieces={pieces} />}
    >
      {media ? (
        <div className="celebration__custom-media">{media}</div>
      ) : (
        <span className="celebration__badge" aria-hidden="true">
          <TrophyIcon />
        </span>
      )}

      {eyebrow && <p className="celebration__eyebrow">{eyebrow}</p>}

      <h2 id={titleId} className="celebration__title">
        {title}
      </h2>

      {stat && (
        <p className="celebration__stat">
          <span className="celebration__stat-value">{stat}</span>
          {statLabel && <span className="celebration__stat-label">{statLabel}</span>}
        </p>
      )}

      {children}

      {body && <p className="celebration__body">{body}</p>}

      <div className="celebration__actions">
        {primaryAction && (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            to={primaryAction.to}
            onClick={primaryAction.onClick}
            iconRight={primaryAction.icon}
          >
            {primaryAction.label}
          </Button>
        )}

        {secondaryAction && (
          <Button variant="secondary" fullWidth to={secondaryAction.to} onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </Modal>
  );
}

function Confetti({ pieces }) {
  return (
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