// COURSE DETAIL PAGE
// Everything a learner needs before they commit: what the course covers, how it is
// structured, who teaches it, and what other learners said.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import useAuth from '../hooks/useAuth.js';
import useScrollSpy from '../hooks/useScrollSpy.js';
import { getCourseById, getCourses } from '../utils/fakeApi.js';
import './CourseDetail.css';

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'curriculum', label: 'Curriculum' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'instructor', label: 'Instructor' },
  { id: 'reviews', label: 'Reviews' },
];

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [related, setRelated] = useState([]);
  // loading | ready | missing | error
  const [status, setStatus] = useState('loading');
  const [enrolled, setEnrolled] = useState(false);
  const [pendingEnrol, setPendingEnrol] = useState(false);

  // the sections only exist once the course has loaded, so the scroll spy has to
  // wait for them before it starts observing
  const sectionIds = useMemo(
    () => (status === 'ready' ? SECTIONS.map((section) => section.id) : []),
    [status],
  );
  const activeSection = useScrollSpy(sectionIds);

  // the same fake backend the landing page uses so loading and error states are real
  const loadCourse = useCallback(() => {
    let active = true;

    setStatus('loading');
    setEnrolled(false);
    setPendingEnrol(false);

    Promise.all([getCourseById(courseId), getCourses()])
      .then(([found, all]) => {
        if (!active) return;

        if (!found) {
          setCourse(null);
          setRelated([]);
          setStatus('missing');
          return;
        }

        setCourse(found);
        setRelated(pickRelated(all, found));
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      });

    return () => {
      active = false;
    };
  }, [courseId]);

  useEffect(() => loadCourse(), [loadCourse]);

  // somebody who signed up from this page is enrolled by the time the modal closes
  useEffect(() => {
    if (user && pendingEnrol) {
      setEnrolled(true);
      setPendingEnrol(false);
    }
  }, [user, pendingEnrol]);

  // signed out learners go through the existing sign up modal, which carries the
  // course id so the confirmation can name it
  const handleEnrol = () => {
    if (!user) {
      setPendingEnrol(true);
      navigate({
        pathname: location.pathname,
        search: `?auth=signup&enroll=${courseId}`,
      });
      return;
    }

    setEnrolled(true);
  };

  if (status === 'loading') {
    return <CourseDetailSkeleton />;
  }

  if (status === 'error') {
    return (
      <CourseDetailMessage
        heading="We could not load this course"
        body="The connection dropped somewhere between here and the catalogue. Nothing is wrong with your account."
      >
        <Button variant="primary" onClick={loadCourse}>
          Try again
        </Button>
        <Button to="/" variant="secondary">
          Back to home
        </Button>
      </CourseDetailMessage>
    );
  }

  if (status === 'missing') {
    return (
      <CourseDetailMessage
        heading="That course is not in the catalogue"
        body="The link may be out of date, or the course may have been retired. The featured courses on the home page are all live."
      >
        <Button to="/" variant="primary">
          See featured courses
        </Button>
        <Button to="/courses" variant="secondary">
          Go to the catalogue
        </Button>
      </CourseDetailMessage>
    );
  }

  const totalLessons = course.modules.reduce(
    (count, module) => count + module.lessons.length,
    0,
  );

  return (
    <article className="course-detail">
      <header className="course-detail__hero">
        <div className="container">
          <nav className="course-detail__crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/courses">Courses</Link>
              </li>
              <li aria-current="page">{course.category}</li>
            </ol>
          </nav>

          <div className="course-detail__hero-grid">
            <div className="course-detail__hero-main">
              <p className="section__eyebrow">{course.category}</p>
              <h1 className="course-detail__title">{course.title}</h1>
              <p className="course-detail__tagline">{course.tagline}</p>
              <p className="course-detail__summary">{course.summary}</p>

              <ul className="course-detail__facts">
                <li>
                  <Stars rating={Number(course.rating)} />
                  <span>
                    <strong>{course.rating}</strong> ({course.reviews} reviews)
                  </span>
                </li>
                <li>{course.enrolled} learners enrolled</li>
                <li>{course.duration} of video</li>
                <li>{course.level}</li>
                <li>Updated {course.updated}</li>
              </ul>

              <p className="course-detail__byline">
                Taught by <strong>{course.instructor}</strong>, {course.role}
              </p>
            </div>

            {/* the enrolment panel sticks to the viewport on wide screens */}
            <aside className="course-detail__panel" aria-labelledby="enrol-heading">
              <h2 id="enrol-heading" className="visually-hidden">
                Enrol in this course
              </h2>

              <p className="course-detail__price">{course.price}</p>
              <p className="course-detail__price-note">
                One payment. Lifetime access, including future updates.
              </p>

              {enrolled ? (
                <div className="course-detail__enrolled" role="status">
                  <p className="course-detail__enrolled-heading">You are enrolled</p>
                  <p>
                    {course.title} is in your learning list. Module one is ready when you
                    are.
                  </p>
                </div>
              ) : (
                <Button variant="primary" size="lg" fullWidth onClick={handleEnrol}>
                  {user ? 'Enrol now' : 'Sign up and enrol'}
                </Button>
              )}

              <ul className="course-detail__includes">
                {course.includes.map((item) => (
                  <li key={item}>
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="course-detail__guarantee">
                Not the right fit? Full refund within 14 days, no questions asked.
              </p>
            </aside>
          </div>
        </div>
      </header>

      {/* in page navigation, the same pattern the About page uses */}
      <nav className="course-detail__subnav" aria-label="Sections of this course page">
        <div className="container">
          <ul>
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={
                    activeSection === section.id
                      ? 'course-detail__subnav-link is-active'
                      : 'course-detail__subnav-link'
                  }
                  aria-current={activeSection === section.id ? 'true' : undefined}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="course-detail__body">
        <div className="container">
          <section id="overview" className="course-detail__section" aria-labelledby="overview-heading">
            <h2 id="overview-heading">What you will be able to do</h2>

            <ul className="course-detail__outcomes">
              {course.outcomes.map((outcome) => (
                <li key={outcome}>
                  <CheckIcon />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>

            <div className="course-detail__prose">
              {course.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section id="curriculum" className="course-detail__section" aria-labelledby="curriculum-heading">
            <h2 id="curriculum-heading">Curriculum</h2>
            <p className="course-detail__section-lead">
              {course.modules.length} modules · {totalLessons} lessons · {course.duration}{' '}
              in total
            </p>

            <Curriculum modules={course.modules} />
          </section>

          <section id="requirements" className="course-detail__section" aria-labelledby="requirements-heading">
            <h2 id="requirements-heading">Before you start</h2>

            <div className="course-detail__two-up">
              <div>
                <h3>What you need</h3>
                <ul className="course-detail__list">
                  {course.requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3>Who this is for</h3>
                <ul className="course-detail__list">
                  {course.audience.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="instructor" className="course-detail__section" aria-labelledby="instructor-heading">
            <h2 id="instructor-heading">Your instructor</h2>

            <div className="course-detail__instructor">
              <span className="course-detail__avatar" aria-hidden="true">
                {initialsOf(course.instructor)}
              </span>

              <div>
                <p className="course-detail__instructor-name">{course.instructor}</p>
                <p className="course-detail__instructor-role">{course.role}</p>
                <p className="course-detail__instructor-credential">
                  {course.instructorCredential}
                </p>
                <p className="course-detail__instructor-bio">{course.instructorBio}</p>
              </div>
            </div>
          </section>

          <section id="reviews" className="course-detail__section" aria-labelledby="reviews-heading">
            <h2 id="reviews-heading">What learners said</h2>

            <div className="course-detail__reviews">
              <div className="course-detail__score">
                <p className="course-detail__score-value">{course.rating}</p>
                <Stars rating={Number(course.rating)} />
                <p className="course-detail__score-count">{course.reviews} reviews</p>

                <ul className="course-detail__breakdown">
                  {course.ratingBreakdown.map((row) => (
                    <li key={row.stars}>
                      <span className="course-detail__breakdown-label">
                        {row.stars} star
                      </span>
                      <span className="course-detail__meter">
                        <span
                          className="course-detail__meter-fill"
                          style={{ width: `${row.share}%` }}
                        />
                      </span>
                      <span className="course-detail__breakdown-share">{row.share}%</span>
                    </li>
                  ))}
                </ul>
              </div>

              <ul className="course-detail__review-list">
                {course.learnerReviews.map((review) => (
                  <li key={review.name} className="course-detail__review">
                    <Stars rating={review.rating} />
                    <p className="course-detail__review-body">&ldquo;{review.body}&rdquo;</p>
                    <p className="course-detail__review-author">
                      {review.name}, <span>{review.role}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {related.length > 0 && (
            <section className="course-detail__section" aria-labelledby="related-heading">
              <h2 id="related-heading">Learners also took</h2>

              <div className="course-detail__related">
                {related.map((item) => (
                  <Card
                    key={item.id}
                    eyebrow={item.category}
                    title={item.title}
                    to={`/courses/${item.id}`}
                    footer={
                      <div className="course-detail__related-footer">
                        <span className="course-detail__related-price">{item.price}</span>
                        <span>{item.duration}</span>
                      </div>
                    }
                  >
                    <p>{item.summary}</p>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* on small screens the panel scrolls away, so the price and action come back */}
      <div className="course-detail__sticky-bar">
        <div>
          <p className="course-detail__sticky-price">{course.price}</p>
          <p className="course-detail__sticky-title">{course.title}</p>
        </div>

        {enrolled ? (
          <span className="course-detail__sticky-enrolled">Enrolled</span>
        ) : (
          <Button variant="primary" onClick={handleEnrol}>
            {user ? 'Enrol now' : 'Sign up and enrol'}
          </Button>
        )}
      </div>
    </article>
  );
}

// the first module is open so the page never starts as a wall of closed rows
function Curriculum({ modules }) {
  const [openIndexes, setOpenIndexes] = useState(() => new Set([0]));

  const toggle = (index) => {
    setOpenIndexes((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const allOpen = openIndexes.size === modules.length;

  const toggleAll = () => {
    setOpenIndexes(allOpen ? new Set() : new Set(modules.map((_, index) => index)));
  };

  return (
    <div className="course-detail__curriculum">
      <div className="course-detail__curriculum-actions">
        <button type="button" className="course-detail__text-button" onClick={toggleAll}>
          {allOpen ? 'Collapse all modules' : 'Expand all modules'}
        </button>
      </div>

      <ol className="course-detail__modules">
        {modules.map((module, index) => {
          const isOpen = openIndexes.has(index);
          const panelId = `module-panel-${index}`;

          return (
            <li key={module.title} className="course-detail__module">
              <h3 className="course-detail__module-heading">
                <button
                  type="button"
                  className="course-detail__module-toggle"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(index)}
                >
                  <ChevronIcon open={isOpen} />
                  <span className="course-detail__module-number">
                    Module {index + 1}
                  </span>
                  <span className="course-detail__module-title">{module.title}</span>
                  <span className="course-detail__module-meta">
                    {module.lessons.length} lessons · {module.duration}
                  </span>
                </button>
              </h3>

              {isOpen && (
                <ul id={panelId} className="course-detail__lessons">
                  {module.lessons.map((lesson) => (
                    <li key={lesson}>
                      <PlayIcon />
                      {lesson}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function CourseDetailMessage({ heading, body, children }) {
  return (
    <section className="section">
      <div className="container container--narrow course-detail__message">
        <h1>{heading}</h1>
        <p>{body}</p>
        <div className="course-detail__message-actions">{children}</div>
      </div>
    </section>
  );
}

function CourseDetailSkeleton() {
  return (
    <div className="course-detail__hero">
      <div className="container">
        <div className="course-detail__hero-grid" aria-hidden="true">
          <div className="course-detail__skeleton">
            <span className="course-detail__skeleton-line course-detail__skeleton-line--short" />
            <span className="course-detail__skeleton-line course-detail__skeleton-line--title" />
            <span className="course-detail__skeleton-line" />
            <span className="course-detail__skeleton-line" />
            <span className="course-detail__skeleton-line course-detail__skeleton-line--short" />
          </div>

          <div className="course-detail__skeleton course-detail__skeleton--panel">
            <span className="course-detail__skeleton-line course-detail__skeleton-line--title" />
            <span className="course-detail__skeleton-line" />
            <span className="course-detail__skeleton-block" />
            <span className="course-detail__skeleton-line" />
            <span className="course-detail__skeleton-line course-detail__skeleton-line--short" />
          </div>
        </div>

        <p className="visually-hidden">Loading this course</p>
      </div>
    </div>
  );
}

function Stars({ rating }) {
  const rounded = Math.round(rating);

  return (
    <span className="course-detail__stars">
      <span className="course-detail__stars-row" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon key={star} filled={star <= rounded} />
        ))}
      </span>
      <span className="visually-hidden">{rating} out of 5</span>
    </span>
  );
}

function StarIcon({ filled }) {
  return (
    <svg
      className={filled ? 'course-detail__star is-filled' : 'course-detail__star'}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="course-detail__check"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M20 6L9 17l-5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      className={open ? 'course-detail__chevron is-open' : 'course-detail__chevron'}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M9 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      className="course-detail__play"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 5l11 7-11 7z" fill="currentColor" />
    </svg>
  );
}

// same category first, then anything else, so the row is never empty
function pickRelated(all, current) {
  const others = all.filter((item) => item.id !== current.id);
  const sameCategory = others.filter((item) => item.category === current.category);
  const rest = others.filter((item) => item.category !== current.category);

  return [...sameCategory, ...rest].slice(0, 3);
}

function initialsOf(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}
