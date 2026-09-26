import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from './Spinner.jsx';
import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  loading = false,
  disabled = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  className = '',
  type = 'button',
  ...rest
}) {
  const [ripples, setRipples] = useState([]);
  const nextRipple = useRef(0);

  // pressing the button will fell likw something as per the client request
  const press = useCallback((event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const id = nextRipple.current;
    nextRipple.current += 1;

    const size = Math.max(bounds.width, bounds.height) * 2;
    const point = {
      id,
      size,
      x: (event.clientX ?? bounds.left + bounds.width / 2) - bounds.left - size / 2,
      y: (event.clientY ?? bounds.top + bounds.height / 2) - bounds.top - size / 2,
    };

    setRipples((current) => [...current, point]);
    setTimeout(() => {
      setRipples((current) => current.filter((item) => item.id !== id));
    }, 600);
  }, []);

  const classes = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth ? 'button--full' : '',
    loading ? 'button--loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {loading && <Spinner size="sm" className="button__spinner" />}
      {!loading && iconLeft && (
        <span className="button__icon" aria-hidden="true">
          {iconLeft}
        </span>
      )}
      <span className="button__label">{children}</span>
      {iconRight && (
        <span className="button__icon" aria-hidden="true">
          {iconRight}
        </span>
      )}

      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="button__ripple"
          aria-hidden="true"
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: `${ripple.size}px`,
            height: `${ripple.size}px`,
          }}
        />
      ))}
    </>
  );

  if (to && !disabled && !loading) {
    return (
      <Link to={to} className={classes} onPointerDown={press} {...rest}>
        {content}
      </Link>
    );
  }

  if (href && !disabled && !loading) {
    const isExternal = /^(https?:)?\/\//.test(href) || href.startsWith('mailto:');

    return (
      <a
        href={href}
        className={classes}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        onPointerDown={press}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onPointerDown={press}
      {...rest}
    >
      {content}
    </button>
  );
}