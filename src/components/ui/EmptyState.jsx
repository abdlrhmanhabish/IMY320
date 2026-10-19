import './EmptyState.css';

// the panel for every moment a page has nothing to list yet
export default function EmptyState({
  art,
  title,
  body,
  children,
  headingLevel = 2,
  plain = false,
  className = '',
}) {
  const Heading = `h${headingLevel}`;
  const classes = ['empty-state', plain ? 'empty-state--plain' : '', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {art && <div className="empty-state__art">{art}</div>}
      <Heading className="empty-state__title">{title}</Heading>
      {body && <p className="empty-state__body">{body}</p>}
      {children && <div className="empty-state__actions">{children}</div>}
    </div>
  );
}