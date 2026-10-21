// COURSE DETAIL PAGE
// Everything a learner needs before they commit: what the course covers, how it is
// structured, who teaches it, and what other learners said.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import AddToCart from '../components/ui/AddToCart.jsx';
import CourseCard from '../components/ui/CourseCard.jsx';
import CourseImage from '../components/ui/CourseImage.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import LevelTag from '../components/ui/LevelTag.jsx';
import Rating from '../components/ui/Rating.jsx';
import useCart from '../hooks/useCart.js';
import useProgress from '../hooks/useProgress.js';
import useScrollSpy from '../hooks/useScrollSpy.js';
import useToast from '../hooks/useToast.js';
import { getCourseById, getCourses } from '../utils/fakeApi.js';
import { formatRand, savingOn, discountPercent, isOnSale } from '../utils/money.js';
import './CourseDetail.css';

const SECTIONS = [
  { id: 'overview', label: "What you'll learn" },
  { id: 'curriculum', label: 'Course content' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'instructor', label: 'Instructor' },
  { id: 'reviews', label: 'Reviews' },
];

const FLAG_TONES = { Bestseller: 'warning', New: 'info' };

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { has, add } = useCart();
  const { isEnrolled } = useProgress();
  const { notify } = useToast();
  const heroRef = useRef(null);
  const buyRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [related, setRelated] = useState([]);
  // loading | ready | missing | error
  const [status, setStatus] = useState('loading');
  const [compact, setCompact] = useState(false);
  const [barShown, setBarShown] = useState(true);

  // the sections only exist once the course has loaded, so the scroll spy has to
  // wait for them before it starts observing
  const sectionIds = useMemo(
    () => (status === 'ready' ? SECTIONS.map((section) => section.id) : []),
    [status],
  );
  const activeSection = useScrollSpy(sectionIds);

  // loading, a missing course and a failed request each get their own screen
  const loadCourse = useCallback(() => {
    let active = true;

    setStatus('loading');

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

  // once the top of the page scrolls away, the buying panel drops its picture and list to fit beside the content
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setCompact(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { rootMargin: '-64px 0px 0px 0px' },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [status]);

  useEffect(() => {
    const buy = buyRef.current;
    if (!buy || typeof IntersectionObserver === 'undefined'){ 
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => setBarShown(!entry.isIntersecting));
    observer.observe(buy);
    return () => observer.disconnect();
  }, [status]);

  // straight to payment, adding it on the way so the cart and the checkout agree
  const buyNow = () => {
    if (!has(course.id)) add(course);
    navigate('/checkout');
  };

  const share = async () => {
    const link = window.location.href.split('#')[0];
    try {
      await navigator.clipboard.writeText(link);
      notify({ tone: 'success', title: 'Link copied', body: 'Paste it anywhere to share this course.' });
    } 
    catch {
      notify({ tone: 'info', title: 'Copy this link to share the course', body: link });
    }
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
        <Button to="/courses" variant="secondary">
          Go to the catalogue
        </Button>
      </CourseDetailMessage>
    );
  }

  if (status === 'missing') {
    return (
      <CourseDetailMessage
        heading="That course is not in the catalogue"
        body="The link may be out of date, or the course may have been retired. Every live course is in the catalogue."
      >
        <Button to="/courses" variant="primary">
          Go to the catalogue
        </Button>
        <Button to="/" variant="secondary">
          Back to home
        </Button>
      </CourseDetailMessage>
    );
  }

  const totalLessons = course.modules.reduce((count, module) => count + module.lessons.length, 0);
  const owned = isEnrolled(course.id);

  return (
    <article className="course-detail">
      <div className="container course-detail__layout">
        <header ref={heroRef} className="course-detail__hero">
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

          <div className="course-detail__tags">
            <Badge category={course.category} />
            <LevelTag level={course.level} />
            {course.badge && <Badge tone={FLAG_TONES[course.badge] ?? 'neutral'}>{course.badge}</Badge>}
          </div>

          <h1 className="course-detail__title">{course.title}</h1>
          <p className="course-detail__tagline">{course.tagline}</p>
          <p className="course-detail__summary">{course.summary}</p>

          <ul className="course-detail__facts">
            <li>
              <Rating value={course.rating} count={course.reviews} size="md" long />
            </li>
            <li>
              <UsersIcon />
              {course.enrolled} learners
            </li>
            <li>
              <ClockIcon />
              {course.duration} of video
            </li>
            <li>
              <CalendarIcon />
              Updated {course.updated}
            </li>
          </ul>

          <p className="course-detail__byline">
            Taught by <a href="#instructor">{course.instructor}</a>, {course.role}
          </p>

          {/* the outline sits in the first screen. This way the page never looks finished before it is */}
          <div className="course-detail__outline">
            <div className="course-detail__outline-head">
              <h2 className="course-detail__outline-heading">What is inside</h2>
              <p className="course-detail__outline-count">
                {course.modules.length} modules, {totalLessons} lessons
              </p>
            </div>

            <ol className="course-detail__outline-list">
              {course.modules.map((module, index) => (
                <li key={module.title}>
                  <span className="course-detail__outline-number">{index + 1}</span>
                  <span className="course-detail__outline-title">{module.title}</span>
                  <span className="course-detail__outline-meta">{module.lessons.length} lessons</span>
                </li>
              ))}
            </ol>

            <a href="#curriculum" className="text-link course-detail__outline-link">
              See every lesson
            </a>
          </div>
        </header>

        {/* the buying panel stays beside the content the whole way down on a wide screen */}
        <aside
          className={compact ? 'course-detail__panel is-compact' : 'course-detail__panel'}
          aria-labelledby="buy-heading"
        >
          <h2 id="buy-heading" className="visually-hidden">
            Buy this course
          </h2>

          <div className="course-detail__panel-media">
            <CourseImage course={course} eager sizes="(max-width: 64rem) 100vw, 22rem" />
          </div>

          <div className="course-detail__panel-body">
            <p className="course-detail__panel-title" aria-hidden="true">
              {course.title}
            </p>

            <p className="course-detail__price-row">
              <span className="course-detail__price">{course.price}</span>
              {isOnSale(course) && (
                <>
                  <span className="visually-hidden">, was </span>
                  <s className="course-detail__price-was">{course.listPrice}</s>
                </>
              )}
            </p>

            {isOnSale(course) && (
              <p className="course-detail__price-save">
                Save {formatRand(savingOn(course))}, {discountPercent(course)}% off
              </p>
            )}

            <div ref={buyRef}>
              {owned ? (
                <div className="course-detail__owned" role="status">
                  <p className="course-detail__owned-heading">You own this course</p>
                  <Button to={`/learn/${course.id}`} variant="primary" size="lg" fullWidth>
                    Go to the course
                  </Button>
                </div>
              ) : (
                <div className="course-detail__buy-actions">
                  <AddToCart course={course} size="lg" fullWidth />
                  <Button variant="secondary" size="lg" fullWidth onClick={buyNow}>
                    Buy now
                  </Button>
                </div>
              )}
            </div>

            <p className="course-detail__price-note">One payment. Lifetime access, including future updates.</p>

            <button type="button" className="course-detail__share" onClick={share}>
              <ShareIcon />
              Share this course
            </button>

            <div className="course-detail__panel-extra">
              <h3 className="course-detail__includes-heading">This course includes</h3>
              <ul className="course-detail__includes">
                {course.includes.map((item) => (
                  <li key={item}>
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="course-detail__guarantee">
                <ShieldIcon />
                Full refund within 14 days, no questions asked.
              </p>
            </div>
          </div>
        </aside>

        <div className="course-detail__main">
          {/* in page navigation, the same pattern the About page uses */}
          <nav className="course-detail__subnav" aria-label="Sections of this course page">
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
          </nav>

          <section id="overview" className="course-detail__section" aria-labelledby="overview-heading">
            <h2 id="overview-heading">What you&apos;ll learn</h2>

            <ul className="course-detail__outcomes">
              {course.outcomes.map((outcome) => (
                <li key={outcome}>
                  <CheckIcon />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="curriculum" className="course-detail__section" aria-labelledby="curriculum-heading">
            <h2 id="curriculum-heading">Course content</h2>
            <Curriculum modules={course.modules} totalLessons={totalLessons} duration={course.duration} />
          </section>

          <section id="requirements" className="course-detail__section" aria-labelledby="requirements-heading">
            <h2 id="requirements-heading">Requirements</h2>
            <ul className="course-detail__list">
              {course.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2 className="course-detail__subheading">Who this course is for</h2>
            <ul className="course-detail__list">
              {course.audience.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="course-detail__section" aria-labelledby="description-heading">
            <h2 id="description-heading">Description</h2>
            <div className="course-detail__prose">
              {course.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
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
                <p className="course-detail__instructor-credential">{course.instructorCredential}</p>
              </div>
            </div>

            <p className="course-detail__instructor-bio">{course.instructorBio}</p>
          </section>

          <section id="reviews" className="course-detail__section" aria-labelledby="reviews-heading">
            <h2 id="reviews-heading">What learners said</h2>

            <div className="course-detail__reviews">
              <div className="course-detail__score">
                <p className="course-detail__score-value">{course.rating}</p>
                <Rating value={course.rating} size="lg" showScore={false} />
                <p className="course-detail__score-count">{course.reviews} reviews</p>

                <ul className="course-detail__breakdown" aria-label="How learners rated it">
                  {course.ratingBreakdown.map((row) => (
                    <li key={row.stars}>
                      <span className="course-detail__breakdown-label">{row.stars} star</span>
                      <span className="course-detail__meter" aria-hidden="true">
                        <span className="course-detail__meter-fill" style={{ width: `${row.share}%` }} />
                      </span>
                      <span className="course-detail__breakdown-share">{row.share}%</span>
                    </li>
                  ))}
                </ul>
              </div>

              <ul className="course-detail__review-list">
                {course.learnerReviews.map((review) => (
                  <li key={review.name} className="course-detail__review">
                    <div className="course-detail__review-head">
                      <span className="course-detail__review-avatar" aria-hidden="true">
                        {initialsOf(review.name)}
                      </span>
                      <p className="course-detail__review-author">
                        {review.name}
                        <span>{review.role}</span>
                      </p>
                    </div>
                    <Rating value={review.rating} showScore={false} />
                    <p className="course-detail__review-body">{review.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section className="course-detail__related" aria-labelledby="related-heading">
          <div className="container">
            <h2 id="related-heading">Learners also took</h2>

            <ul className="course-detail__related-grid">
              {related.map((item) => (
                <li key={item.id}>
                  <CourseCard course={item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* on small screens the panel scrolls away, so the price and action come back */}
      <div
        className={barShown ? 'course-detail__sticky-bar' : 'course-detail__sticky-bar is-hidden'}
        inert={!barShown}
      >
        <div className="course-detail__sticky-text">
          <p className="course-detail__sticky-price">{course.price}</p>
          <p className="course-detail__sticky-title">{course.title}</p>
        </div>

        {owned ? (
          <Button to={`/learn/${course.id}`} variant="primary">
            Go to the course
          </Button>
        ) : (
          <AddToCart course={course} />
        )}
      </div>
    </article>
  );
}

// the first module is open so the page never starts as a wall of closed rows
function Curriculum({ modules, totalLessons, duration }) {
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
      <div className="course-detail__curriculum-bar">
        <p className="course-detail__section-lead">
          {modules.length} modules, {totalLessons} lessons, {duration} in total
        </p>
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
                  <span className="course-detail__module-text">
                    <span className="course-detail__module-number">Module {index + 1}</span>
                    <span className="course-detail__module-title">{module.title}</span>
                  </span>
                  <span className="course-detail__module-meta">
                    {module.lessons.length} lessons, {module.duration}
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
      <div className="container container--narrow">
        <EmptyState headingLevel={1} title={heading} body={body} plain>
          {children}
        </EmptyState>
      </div>
    </section>
  );
}

// the same layout as the loaded page, so nothing jumps when the course arrives
function CourseDetailSkeleton() {
  return (
    <div className="course-detail">
      <div className="container course-detail__layout" aria-hidden="true">
        <div className="course-detail__hero course-detail__hero--skeleton">
          <span className="skeleton course-detail__sk-crumbs" />
          <span className="skeleton skeleton--pill" />
          <span className="skeleton skeleton--heading" />
          <span className="skeleton skeleton--heading course-detail__sk-half" />
          <span className="skeleton skeleton--line" />
          <span className="skeleton skeleton--short" />
          <span className="skeleton course-detail__sk-outline" />
        </div>

        <div className="course-detail__panel course-detail__panel--skeleton">
          <span className="course-detail__panel-media skeleton" />
          <div className="course-detail__panel-body">
            <span className="skeleton course-detail__sk-price" />
            <span className="skeleton skeleton--block" />
            <span className="skeleton skeleton--block" />
            <span className="skeleton skeleton--line" />
          </div>
        </div>
      </div>

      <p className="visually-hidden">Loading this course</p>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg className="course-detail__check" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
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

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <circle cx="9" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M2.5 19c1.2-3 3.7-4.5 6.5-4.5s5.3 1.5 6.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c1.6.6 2.8 2 3.5 4.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7.5V12l3 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <circle cx="18" cy="5" r="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="6" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="19" r="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" fill="none" stroke="currentColor" strokeWidth="2" />
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
      <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="course-detail__play" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
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
