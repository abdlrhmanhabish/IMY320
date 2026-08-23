import { useMemo, useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import { getCourses } from '../utils/fakeApi.js';
import useAuth from '../hooks/useAuth.js';
import './InfoPage.css';

const SORTS = [
  { value: 'popular', label: 'Most popular' },
  { value: 'rating', label: 'Top rated' },
  { value: 'price-low', label: 'Price: low to high' },
  { value: 'price-high', label: 'Price: high to low' },
];

const CATEGORIES = ['All', 'Data', 'Finance', 'Development', 'Management'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

function parsePrice(priceText) {
  const number = Number(String(priceText).replace(/[^\d.]/g, ''));
  return Number.isNaN(number) ? 0 : number;
}

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const rawQuery = searchParams.get('q') || '';
  const query = rawQuery.trim().toLowerCase();

  //the search term lives in the URL so a filtered catalogue can be linked and shared
  const updateQuery = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set('q', value);
    } 
    else {
      next.delete('q');
    }
    setSearchParams(next, { replace: true });
  };

  const [status, setStatus] = useState('loading');
  const [courses, setCourses] = useState([]);
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevels, setSelectedLevels] = useState([]);

  const loadCourses = useCallback(() => {
    let alive = true;
    setStatus('loading');

    getCourses()
      .then((data) => {
        if (!alive) return;
        setCourses(data);
        setStatus('ready');
      })
      .catch(() => {
        if (alive) setStatus('error');
      });

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => loadCourses(), [loadCourses]);

  const filteredAndSorted = useMemo(() => {
    const bySearch = courses.filter((course) => {
      if (!query) return true;
      const haystack = [
        course.title,
        course.category,
        course.level,
        course.instructor,
        course.summary,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });

    const byCategory = bySearch.filter(
      (course) => selectedCategory === 'All' || course.category === selectedCategory
    );

    const byLevel = byCategory.filter(
      (course) => selectedLevels.length === 0 || selectedLevels.includes(course.level)
    );

    const sorted = [...byLevel].sort((a, b) => {
      if (sortBy === 'rating') return Number(b.rating) - Number(a.rating);
      if (sortBy === 'price-low') return parsePrice(a.price) - parsePrice(b.price);
      if (sortBy === 'price-high') return parsePrice(b.price) - parsePrice(a.price);
      return (
        Number(String(b.reviews).replace(/[^\d]/g, '')) -
        Number(String(a.reviews).replace(/[^\d]/g, ''))
      );
    });

    return sorted;
  }, [courses, query, selectedCategory, selectedLevels, sortBy]);

  const hasNarrowing = Boolean(query) || selectedCategory !== 'All' || selectedLevels.length > 0;

  const clearAll = () => {
    setSelectedCategory('All');
    setSelectedLevels([]);
    updateQuery('');
  };

  const toggleLevel = (level) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((item) => item !== level) : [...prev, level]
    );
  };

  const openSignup = (courseId) => {
    const search = new URLSearchParams(searchParams);
    search.set('auth', 'signup');
    if (courseId) search.set('enroll', String(courseId));
    navigate({ pathname: '/courses', search: `?${search.toString()}` });
  };

  return (
    <>
      <PageHeader
        eyebrow="Courses"
        title="Browse the full course catalogue"
        lead="Find practical, short courses by category, level and learner feedback."
        backTo="/"
        backLabel="Back to home"
      />

      <section className="section">
        <div className="container">
          <nav className="courses-page__crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="courses-page__crumb-sep" aria-hidden="true">
              /
            </span>
            <span aria-current="page">Courses</span>
          </nav>

          <div className="courses-page__layout">
            <div>
              <form role="search" className="courses-page__search" onSubmit={(event) => event.preventDefault()}>
                <label htmlFor="catalogue-search" className="courses-page__search-label">Search the catalogue</label>
                <div className="courses-page__search-field">
                  <input
                    id="catalogue-search"
                    type="search"
                    className="courses-page__search-input"
                    placeholder="Search by title, topic, level or instructor"
                    value={rawQuery}
                    onChange={(event) => updateQuery(event.target.value)}
                  />
                  {rawQuery && (
                    <button type="button" className="courses-page__search-clear" onClick={() => updateQuery('')}>Clear</button>
                  )}
                </div>
              </form>

              <div className="courses-page__controls" aria-label="Sort and filter controls">
                <div className="courses-page__control-group" role="group" aria-label="Sort">
                  {SORTS.map((sort) => (
                    <button
                      key={sort.value}
                      type="button"
                      className={`courses-page__chip ${sortBy === sort.value ? 'is-active' : ''}`}
                      aria-pressed={sortBy === sort.value}
                      onClick={() => setSortBy(sort.value)}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>

                <fieldset className="courses-page__control-block">
                  <legend>Category</legend>
                  <div className="courses-page__options-row">
                    {CATEGORIES.map((category) => (
                      <label key={category} className="courses-page__choice">
                        <input
                          type="radio"
                          name="course-category"
                          checked={selectedCategory === category}
                          onChange={() => setSelectedCategory(category)}
                        />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="courses-page__control-block">
                  <legend>Level</legend>
                  <div className="courses-page__options-row">
                    {LEVELS.map((level) => (
                      <label key={level} className="courses-page__choice">
                        <input
                          type="checkbox"
                          checked={selectedLevels.includes(level)}
                          onChange={() => toggleLevel(level)}
                        />
                        <span>{level}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              <div className="courses-page__results-bar">
                <p aria-live="polite" className="courses-page__results-note">
                  {status === 'ready'
                    ? `${filteredAndSorted.length} ${
                        filteredAndSorted.length === 1 ? 'course' : 'courses'
                      }${query ? ` matching "${rawQuery.trim()}"` : ''}`
                    : 'Loading results'}
                </p>

                {hasNarrowing && status === 'ready' && (
                  <button className="courses-page__reset" type="button" onClick={clearAll}>Clear search and filters</button>
                )}
              </div>

              {status === 'loading' && <p>Loading catalogue...</p>}

              {status === 'error' && (
                <div className="info-page__callout">
                  <h2 className="info-page__callout-heading">We could not load the catalogue</h2>
                  <p className="info-page__callout-body">
                    Something went wrong on our side. Try again in a moment.
                  </p>
                  <div className="info-page__callout-actions">
                    <Button variant="secondary" onClick={loadCourses}>
                      Try again
                    </Button>
                  </div>
                </div>
              )}

              {status === 'ready' && filteredAndSorted.length === 0 && (
                <div className="info-page__callout">
                  <h2 className="info-page__callout-heading">No matching courses yet</h2>
                  <p className="info-page__callout-body">
                    Nothing in the catalogue matches every filter you have set.
                  </p>
                  <div className="info-page__callout-actions">
                    <Button variant="primary" onClick={clearAll}>Clear search and filters</Button>
                  </div>
                </div>
              )}

              {status === 'ready' && filteredAndSorted.length > 0 && (
                <ul className="courses-page__list">
                  {filteredAndSorted.map((course) => (
                    <li key={course.id} className="courses-page__row" data-category={course.category}>
                      <Link to={`/courses/${course.id}`} className="courses-page__row-link">
                        <div className="courses-page__row-head">
                          <span className="courses-page__tag">{course.category}</span>
                          <span className="courses-page__meta">
                            {course.duration}, {course.level}
                          </span>
                        </div>
                        <h2 className="courses-page__row-title">{course.title}</h2>
                        <p className="courses-page__row-summary">{course.summary}</p>
                        <p className="courses-page__row-meta">
                          {course.rating} rating ({course.reviews} reviews), {course.instructor}
                        </p>
                        <p className="courses-page__row-price">{course.price}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>


            <aside className="courses-page__sticky-panel" aria-labelledby="catalogue-panel-heading">
              {user ? (
                <>
                  <h2 id="catalogue-panel-heading">Signed in as {user.name}</h2>
                  <p>Open any course in the list to see the full curriculum and enrol.</p>
                  <Button to="/about" variant="secondary" size="lg">How our courses work</Button>
                </>
              ) : (
                <>
                  <h2 id="catalogue-panel-heading">Start learning this week</h2>
                  <p>Create an account to save courses and enrol directly from any listing.</p>
                  <Button size="lg" onClick={() => openSignup()}>Create free account</Button>
                </>
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}