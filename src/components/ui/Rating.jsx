import './Rating.css';

const STARS = [1, 2, 3, 4, 5];

// the score, the stars and how many people gave it. 
export default function Rating({ value, count, size = 'sm', showScore = true, long = false, className = '' }) {
  const score = Number(value);
  const classes = ['rating', `rating--${size}`, className].filter(Boolean).join(' ');

  return (
    <span className={classes}>
      {showScore && (
        <span className="rating__score" aria-hidden="true">
          {score.toFixed(1)}
        </span>
      )}

      <span className="rating__stars" aria-hidden="true">
        <span className="rating__row">
          {STARS.map((star) => (
            <StarIcon key={star} />
          ))}
        </span>
        <span className="rating__row rating__row--filled" style={{ width: `${(score / 5) * 100}%` }}>
          {STARS.map((star) => (
            <StarIcon key={star} />
          ))}
        </span>
      </span>

      {count && (
        <span className="rating__count" aria-hidden="true">
          ({count}
          {long ? ' reviews' : ''})
        </span>
      )}

      <span className="visually-hidden">
        Rated {score} out of 5{count ? ` from ${count} reviews` : ''}
      </span>
    </span>
  );
}

function StarIcon() {
  return (
    <svg className="rating__star" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2.8l2.75 5.6 6.15.9-4.45 4.35 1.05 6.1L12 16.9l-5.5 2.85 1.05-6.1L3.1 9.3l6.15-.9z" />
    </svg>
  );
}