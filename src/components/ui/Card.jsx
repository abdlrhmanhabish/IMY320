import { Link } from 'react-router-dom';
import './Card.css';

export default function Card({
  children,
  media,
  title,
  eyebrow,
  footer,
  to,
  as: Element = 'div',
  className = '',
  ...rest
}) {
  const classes = ['card', to ? 'card--linked' : '', className].filter(Boolean).join(' ');

  return (
    <Element className={classes} {...rest}>
      {media && <div className="card__media">{media}</div>}

      <div className="card__body">
        {eyebrow && <p className="card__eyebrow">{eyebrow}</p>}

        {title && (
          <h3 className="card__title">
            {to ? (
              <Link to={to} className="card__link">
                {title}
              </Link>
            ) : (
              title
            )}
          </h3>
        )}

        {children && <div className="card__content">{children}</div>}
      </div>

      {footer && <div className="card__footer">{footer}</div>}
    </Element>
  );
}