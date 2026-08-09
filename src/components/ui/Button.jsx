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
    </>
  );

  if (to && !disabled && !loading) {
    return (
      <Link to={to} className={classes} {...rest}>
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
      {...rest}
    >
      {content}
    </button>
  );
}