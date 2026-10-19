import { useId, useState } from 'react';
import Button from './Button.jsx';
import './CourseReview.css';

const WORDS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

export default function CourseReview({ review, onSave, compact = false }) {
  const [editing, setEditing] = useState(!review);
  const [rating, setRating] = useState(review?.rating ?? 0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState(review?.comment ?? '');
  const [problem, setProblem] = useState('');
  const [justSaved, setJustSaved] = useState(false);
  const name = useId();
  const commentId = useId();

  if (!editing && review) {
    return (
      <div className={compact ? 'review review--compact' : 'review'} role="status">
        <p className="review__heading">{justSaved ? 'Thanks for your review' : 'Your review'}</p>
        <p className="review__given">
          <Stars value={review.rating} />
          <span>
            {review.rating} of 5, {WORDS[review.rating].toLowerCase()}
          </span>
        </p>
        {review.comment && <p className="review__comment">&ldquo;{review.comment}&rdquo;</p>}
        <button type="button" className="review__edit" onClick={() => setEditing(true)}>
          Change your review
        </button>
      </div>
    );
  }

  const shown = hovered || rating;

  const submit = (event) => {
    event.preventDefault();

    if (!rating) {
      setProblem('Pick a star rating first.');
      return;
    }

    onSave({ rating, comment });
    setJustSaved(true);
    setEditing(false);
  };

  return (
    <form className={compact ? 'review review--compact' : 'review'} onSubmit={submit} noValidate>
      <fieldset className="review__stars-field">
        <legend className="review__heading">Rate this course</legend>

        <div className="review__stars" onMouseLeave={() => setHovered(0)}>
          {[1, 2, 3, 4, 5].map((value) => (
            <label
              key={value}
              className={value <= shown ? 'review__star is-on' : 'review__star'}
              onMouseEnter={() => setHovered(value)}
            >
              <input
                type="radio"
                name={name}
                value={value}
                checked={rating === value}
                onChange={() => {
                  setRating(value);
                  setProblem('');
                }}
              />
              <StarIcon />
              <span className="visually-hidden">
                {value} {value === 1 ? 'star' : 'stars'}, {WORDS[value].toLowerCase()}
              </span>
            </label>
          ))}

          <span className="review__word" aria-hidden="true">
            {WORDS[shown]}
          </span>
        </div>
      </fieldset>

      <label className="review__label" htmlFor={commentId}>
        What worked, and what would you change? <span>Optional</span>
      </label>
      <textarea
        id={commentId}
        className="review__comment-box"
        rows={compact ? 2 : 3}
        maxLength={500}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />

      {problem && (
        <p className="review__problem" role="alert">
          {problem}
        </p>
      )}

      <Button type="submit" variant="secondary" fullWidth={compact}>
        {review ? 'Save changes' : 'Send review'}
      </Button>
    </form>
  );
}

function Stars({ value }) {
  return (
    <span className="review__stars-static" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= value ? 'review__star is-on' : 'review__star'}>
          <StarIcon />
        </span>
      ))}
    </span>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
      <path
        d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}