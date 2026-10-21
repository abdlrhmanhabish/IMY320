import './Badge.css';

export default function Badge({ children, tone = 'neutral', category, className = '' }) {
  const classes = ['badge', `badge--${category ? 'category' : tone}`, className].filter(Boolean).join(' ');

  return (
    <span className={classes} data-category={category}>
      {children ?? category}
    </span>
  );
}