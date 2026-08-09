import './Spinner.css';

export default function Spinner({ size = 'md', label, className = '' }) {
  const classes = ['spinner', `spinner--${size}`, className].filter(Boolean).join(' ');

  return (
    <span
      className={classes}
      role={label ? 'status' : undefined}
      aria-hidden={label ? undefined : 'true'}
    >
      <span className="spinner__circle" />
      {label && <span className="visually-hidden">{label}</span>}
    </span>
  );
}