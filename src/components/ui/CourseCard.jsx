import { Link } from 'react-router-dom';
import AddToCart from './AddToCart.jsx';
import Badge from './Badge.jsx';
import CourseImage from './CourseImage.jsx';
import LevelTag from './LevelTag.jsx';
import Rating from './Rating.jsx';
import { isOnSale } from '../../utils/money.js';
import './CourseCard.css';

const FLAG_TONES = { Bestseller: 'warning', New: 'info' };

// the card every course list uses: picture, title, teacher, what other learners thought and the price.
export default function CourseCard({
  course,
  headingLevel = 3,
  sizes = '(max-width: 40rem) 100vw, (max-width: 62rem) 50vw, 24rem',
  showAdd = true,
  className = '',
}) {
  const Heading = `h${headingLevel}`;

  return (
    <article className={['course-card', className].filter(Boolean).join(' ')} data-category={course.category}>
      <div className="course-card__media">
        <CourseImage course={course} decorative sizes={sizes} />
        {course.badge && (
          <Badge tone={FLAG_TONES[course.badge] ?? 'neutral'} className="course-card__flag">
            {course.badge}
          </Badge>
        )}
      </div>

      <div className="course-card__body">
        <div className="course-card__tags">
          <Badge category={course.category} />
          <LevelTag level={course.level} />
        </div>

        <Heading className="course-card__title">
          <Link to={`/courses/${course.id}`} className="course-card__link">
            {course.title}
          </Link>
        </Heading>

        <p className="course-card__instructor">{course.instructor}</p>

        <div className="course-card__proof">
          <Rating value={course.rating} count={course.reviews} />
          <span className="course-card__learners">{course.enrolled} learners</span>
        </div>
      </div>

      <div className="course-card__footer">
        <p className="course-card__price">
          <span className="course-card__price-now">{course.price}</span>
          {isOnSale(course) && (
            <>
              <span className="visually-hidden">, was </span>
              <s className="course-card__price-was">{course.listPrice}</s>
            </>
          )}
        </p>

        {showAdd && <AddToCart course={course} size="sm" variant="secondary" />}
      </div>
    </article>
  );
}

// shown while loading to occupy waiting time
export function CourseCardSkeleton() {
  return (
    <div className="course-card course-card--skeleton" aria-hidden="true">
      <span className="course-card__media skeleton" />
      <div className="course-card__body">
        <span className="skeleton skeleton--pill" />
        <span className="skeleton skeleton--title" />
        <span className="skeleton skeleton--line" />
        <span className="skeleton skeleton--short" />
      </div>
      <div className="course-card__footer">
        <span className="skeleton skeleton--price" />
        <span className="skeleton skeleton--button" />
      </div>
    </div>
  );
}