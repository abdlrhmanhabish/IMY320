import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import CourseCard, { CourseCardSkeleton } from '../components/ui/CourseCard.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { getCourses } from '../utils/fakeApi.js';
import { matchCourses } from '../utils/search.js';
import useAuth from '../hooks/useAuth.js';
import useProgress from '../hooks/useProgress.js';
import './Courses.css';

const SORTS = [
  { value: 'popular', label: 'Most popular' },
  { value: 'rating', label: 'Top rated' },
  { value: 'price-low', label: 'Price, low to high' },
  { value: 'price-high', label: 'Price, high to low' },
];

const CATEGORIES = ['Data', 'Finance', 'Development', 'Management'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const SUGGESTIONS = ['Beginner', 'SQL', 'Python', 'Spreadsheets', 'Git', 'Presenting'];

// four rows of three at a time. A long catalogue never turns into one endless scroll
const PAGE_SIZE = 12;

function parsePrice(priceText) {
  const number = Number(String(priceText).replace(/[^\d.]/g, ''));
  return Number.isNaN(number) ? 0 : number;
}

function sortCourses(list, sortBy) {
  return [...list].sort((a, b) => {
    if (sortBy === 'rating'){
      return Number(b.rating) - Number(a.rating);
    } 
    if (sortBy === 'price-low'){ 
      return parsePrice(a.price) - parsePrice(b.price);
    }
    if (sortBy === 'price-high'){ 
      return parsePrice(b.price) - parsePrice(a.price);
    }
    return (
      Number(String(b.reviews).replace(/[^\d]/g, '')) -
      Number(String(a.reviews).replace(/[^\d]/g, ''))
    );
  });
}

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enrolled, progressFor } = useProgress();
  const rawQuery = searchParams.get('q') || '';

  // the search term lives in the URL so a filtered catalogue can be linked and shared
  const updateQuery = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set('q', value);
    } else {
      next.delete('q');
    }
    setSearchParams(next, { replace: true });
  };

  const [status, setStatus] = useState('loading');
  const [courses, setCourses] = useState([]);
  const [sortBy, setSortBy] = useState('popular');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [shownFor, setShownFor] = useState('');
  const firstNewRef = useRef(null);

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

  const searched = useMemo(() => matchCourses(courses, rawQuery), [courses, rawQuery]);

  const results = useMemo(() => {
    const filtered = searched.full.filter(
      (course) =>
        (category === 'all' || course.category === category) &&
        (level === 'all' || course.level === level),
    );
    return sortCourses(filtered, sortBy);
  }, [searched, category, level, sortBy]);

  // a new search or filter starts the list from the top again
  const filterKey = `${rawQuery}|${category}|${level}|${sortBy}`;
  if (shownFor !== filterKey) {
    setShownFor(filterKey);
    setVisible(PAGE_SIZE);
  }

  const query = rawQuery.trim();
  const filtersOn = category !== 'all' || level !== 'all';
  const shown = results.slice(0, visible);
  const remaining = results.length - shown.length;

  const clearFilters = () => {
    setCategory('all');
    setLevel('all');
  };

  const clearAll = () => {
    clearFilters();
    updateQuery('');
  };

  const showMore = () => {
    firstNewRef.current = shown.length;
    setVisible((count) => count + PAGE_SIZE);
  };

  // keyboard users land on the first course that just appeared instead of back at the button
  useEffect(() => {
    if (firstNewRef.current === null){ 
      return;
    }
    const links = document.querySelectorAll('.catalogue__grid .course-card__link');
    links[firstNewRef.current]?.focus();
    firstNewRef.current = null;
  }, [visible]);

  const openSignup = () => {
    const search = new URLSearchParams(searchParams);
    search.set('auth', 'signup');
    navigate({ pathname: '/courses', search: `?${search.toString()}` });
  };

  const resume =
    enrolled.find((course) => progressFor(course.id).started && !progressFor(course.id).complete) ??
    enrolled.find((course) => !progressFor(course.id).complete);

  const countText =
    status === 'ready'
      ? `${results.length} ${results.length === 1 ? 'course' : 'courses'}${query ? ` for "${query}"` : ''}`
      : 'Loading courses';

  return (
    <>
      <PageHeader
        title="All courses"
        className="catalogue__header"
        aside={
          <>
            <p aria-live="polite" className="catalogue__count">
              {countText}
            </p>

            {(filtersOn || query) && status === 'ready' && (
              <button className="catalogue__clear" type="button" onClick={clearAll}>
                Clear search and filters
              </button>
            )}
          </>
        }
      >
        <div className="catalogue__toolbar">
          <form role="search" className="catalogue__search" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="catalogue-search" className="visually-hidden">
              Search the catalogue
            </label>
            <SearchIcon />
            <input
              id="catalogue-search"
              type="search"
              className="catalogue__search-input"
              placeholder="Search by skill, topic or teacher"
              value={rawQuery}
              onChange={(event) => updateQuery(event.target.value)}
            />
            {rawQuery && (
              <button type="button" className="catalogue__search-clear" onClick={() => updateQuery('')}>
                Clear
                <span className="visually-hidden"> the search</span>
              </button>
            )}
          </form>

          <div className="catalogue__filters" role="group" aria-label="Filter and sort the courses">
            <FilterSelect label="Category" value={category} onChange={setCategory}>
              <option value="all">All</option>
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect label="Level" value={level} onChange={setLevel}>
              <option value="all">Any</option>
              {LEVELS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect label="Sort" value={sortBy} onChange={setSortBy} wide>
              {SORTS.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </FilterSelect>
          </div>
        </div>
      </PageHeader>

      <section className="catalogue" aria-label="Courses">
        <div className="container">
          {status === 'loading' && (
            <div className="catalogue__grid">
              {Array.from({ length: 6 }, (_, index) => (
                <CourseCardSkeleton key={index} />
              ))}
              <p className="visually-hidden">Loading the catalogue</p>
            </div>
          )}

          {status === 'error' && (
            <EmptyState
              title="We could not load the catalogue"
              body="Something went wrong on our side. Try again in a moment."
            >
              <Button variant="secondary" onClick={loadCourses}>
                Try again
              </Button>
            </EmptyState>
          )}

          {status === 'ready' && results.length === 0 && (
            <NoResults
              query={query}
              searched={searched}
              filtersOn={filtersOn}
              onClearFilters={clearFilters}
              onClearAll={clearAll}
              onSuggest={updateQuery}
            />
          )}

          {status === 'ready' && results.length > 0 && (
            <>
              <ul className="catalogue__grid">
                {shown.map((course) => (
                  <li key={course.id}>
                    <CourseCard course={course} headingLevel={2} />
                  </li>
                ))}
              </ul>

              {remaining > 0 && (
                <div className="catalogue__more">
                  <p className="catalogue__more-note">
                    Showing {shown.length} of {results.length} courses
                  </p>
                  <Button variant="secondary" onClick={showMore}>
                    Show {Math.min(remaining, PAGE_SIZE)} more {remaining === 1 ? 'course' : 'courses'}
                  </Button>
                </div>
              )}
            </>
          )}

          {status === 'ready' &&
            (user ? (
              <aside className="catalogue__banner" aria-labelledby="catalogue-banner-heading">
                <div>
                  <h2 id="catalogue-banner-heading" className="catalogue__banner-heading">
                    {resume ? `Pick up ${resume.title}` : `Signed in as ${user.name}`}
                  </h2>
                  <p className="catalogue__banner-text">
                    {resume
                      ? 'Your place is saved. Carry on from the lesson you stopped at.'
                      : 'Every course you buy appears in My learning with your progress saved.'}
                  </p>
                </div>
                <Button to={resume ? `/learn/${resume.id}` : '/learning'} variant="secondary">
                  Continue learning
                </Button>
              </aside>
            ) : (
              <aside className="catalogue__banner" aria-labelledby="catalogue-banner-heading">
                <div>
                  <h2 id="catalogue-banner-heading" className="catalogue__banner-heading">
                    New to SkillUP?
                  </h2>
                  <p className="catalogue__banner-text">
                    Create a free account to save your progress and keep every certificate you earn.
                  </p>
                </div>
                <Button variant="primary" onClick={openSignup}>
                  Create free account
                </Button>
              </aside>
            ))}
        </div>
      </section>
    </>
  );
}

function FilterSelect({ label, value, onChange, wide = false, children }) {
  return (
    <label className={wide ? 'catalogue__filter catalogue__filter--wide' : 'catalogue__filter'}>
      <span className="catalogue__filter-label">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
      <ChevronIcon />
    </label>
  );
}

// an empty list always says why it is empty and offers a way forward
function NoResults({ query, searched, filtersOn, onClearFilters, onClearAll, onSuggest }) {
  if (searched.full.length > 0 && filtersOn) {
    return (
      <EmptyState
        title="No match with these filters"
        body={
          query
            ? `There are courses for "${query}", but none at this category or level.`
            : 'No course fits this category and level together yet.'
        }
      >
        <Button variant="primary" onClick={onClearFilters}>
          Clear the filters
        </Button>
      </EmptyState>
    );
  }

  return (
    <div className="catalogue__empty">
      <EmptyState
        title={<>Nothing matches &ldquo;{query}&rdquo; yet</>}
        body="Check the spelling or try a shorter search. These searches all find courses:"
      >
        <ul className="catalogue__suggestions" aria-label="Suggested searches">
          {SUGGESTIONS.map((suggestion) => (
            <li key={suggestion}>
              <button type="button" className="catalogue__suggestion" onClick={() => onSuggest(suggestion)}>
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
        <Button variant="secondary" onClick={onClearAll}>
          Show every course
        </Button>
      </EmptyState>

      {searched.partial.length > 0 && (
        <section className="catalogue__partial" aria-labelledby="partial-heading">
          <h2 id="partial-heading" className="catalogue__partial-heading">
            These match some of your words
          </h2>
          <ul className="catalogue__grid">
            {searched.partial.slice(0, 3).map((course) => (
              <li key={course.id}>
                <CourseCard course={course} headingLevel={3} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg className="catalogue__search-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M16.5 16.5L21 21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg className="catalogue__filter-chevron" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
