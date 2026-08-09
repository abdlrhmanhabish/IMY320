import { useCallback, useEffect, useId, useRef, useState } from 'react';
import './Carousel.css';

export default function Carousel({
  items = [],
  renderItem,
  label = 'Carousel',
  emptyMessage = 'There is nothing to show here yet.',
  className = ''
}) {
  const [index, setIndex] = useState(0);
  const regionRef = useRef(null);
  const baseId = useId();
  const count = items.length;

  const goTo = useCallback(
    (next) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const goPrevious = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    const region = regionRef.current;
    if (!region) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      }
    };

    region.addEventListener('keydown', handleKeyDown);
    return () => region.removeEventListener('keydown', handleKeyDown);
  }, [goPrevious, goNext]);

  if (count === 0) {
    return (
      <div className={['carousel', 'carousel--empty', className].filter(Boolean).join(' ')}>
        <p className="carousel__empty">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <section
      ref={regionRef}
      className={['carousel', className].filter(Boolean).join(' ')}
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="carousel__viewport">
        {items.map((item, itemIndex) => {
          const isActive = itemIndex === index;
          return (
            <div
              key={item.id ?? itemIndex}
              id={`${baseId}-slide-${itemIndex}`}
              className={`carousel__slide ${isActive ? 'carousel__slide--active' : ''}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${itemIndex + 1} of ${count}`}
              aria-hidden={!isActive}
              inert={!isActive}
            >
              {renderItem(item, itemIndex)}
            </div>
          );
        })}
      </div>

      <p className="visually-hidden" aria-live="polite">Showing item {index + 1} of {count}</p>

      <div className="carousel__controls">
        <button
          type="button"
          className="carousel__arrow"
          onClick={goPrevious}
          aria-label="Previous item"
        >
          <ArrowIcon direction="left" />
        </button>

        <ul className="carousel__dots">
          {items.map((item, itemIndex) => (
            <li key={item.id ?? itemIndex}>
              <button
                type="button"
                className={`carousel__dot ${itemIndex === index ? 'carousel__dot--active' : ''}`}
                onClick={() => goTo(itemIndex)}
                aria-label={`Go to item ${itemIndex + 1} of ${count}`}
                aria-current={itemIndex === index ? 'true' : undefined}
              />
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="carousel__arrow"
          onClick={goNext}
          aria-label="Next item"
        >
          <ArrowIcon direction="right" />
        </button>
      </div>
    </section>
  );
}

function ArrowIcon({ direction }) {
  const points = direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 6l6 6-6 6';
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        d={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}