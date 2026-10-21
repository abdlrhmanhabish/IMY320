import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import Celebration from '../components/ui/Celebration.jsx';
import Certificate from '../components/ui/Certificate.jsx';
import CourseReview from '../components/ui/CourseReview.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { coursePhoto } from '../config/photos.js';
import useAuth from '../hooks/useAuth.js';
import useProgress from '../hooks/useProgress.js';
import useToast from '../hooks/useToast.js';
import { downloadCertificate } from '../utils/certificate.js';
import { DAILY_GOAL, lessonsOf } from '../utils/progress.js';
import courses from '../data/courses.json';
import './CoursePlayer.css';

const CAPTIONS_KEY = 'skillup:captions';

function readCaptions() {
  try {
    return window.localStorage.getItem(CAPTIONS_KEY) === 'on';
  } catch {
    return false;
  }
}

export default function CoursePlayer() {
  const { courseId } = useParams();
  const location = useLocation();
  const id = Number(courseId);
  const course = courses.find((item) => item.id === id);
  const { user } = useAuth();
  const {
    isEnrolled,
    isDone,
    toggleLesson,
    progressFor,
    todayCount,
    streak,
    certificateFor,
    reviewFor,
    saveReview,
  } = useProgress();
  const { notify } = useToast();
  const lessons = useMemo(() => lessonsOf(course), [course]);
  const [activeKey, setActiveKey] = useState(null);
  const [celebrating, setCelebrating] = useState(false);
  const [note, setNote] = useState(null);
  const [moves, setMoves] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [captions, setCaptions] = useState(readCaptions);
  const stageRef = useRef(null);
  const headingRef = useRef(null);
  const sideRef = useRef(null);
  const certificateRef = useRef(null);

  useEffect(() => {
    setActiveKey(null);
    setCelebrating(false);
    setNote(null);
  }, [id]);

  // open on the first lesson that is not finished. which means returning to a course lands where the work actually is
  useEffect(() => {
    if (lessons.length === 0 || activeKey) return;
    const next = lessons.find((lesson) => !isDone(id, lesson.key));
    setActiveKey((next ?? lessons[0]).key);
  }, [lessons, activeKey, isDone, id]);

  // moving on takes the page to the top of the new lessonand the side list scrolls and the lesson stays in view
  useEffect(() => {
    if (moves === 0) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const behavior = reduce ? 'auto' : 'smooth';
    const header = document.querySelector('.navbar')?.offsetHeight ?? 64;
    const stage = stageRef.current;

    if (stage) {
      const top = stage.getBoundingClientRect().top + window.scrollY - header;
      window.scrollTo({ top: Math.max(0, top), behavior });
    }

    headingRef.current?.focus({ preventScroll: true });

    const side = sideRef.current;
    const current = side?.querySelector('[aria-current="true"]');
    if (side && current) {
      const above = current.offsetTop < side.scrollTop;
      const below = current.offsetTop + current.offsetHeight > side.scrollTop + side.clientHeight;
      if (above || below) {
        side.scrollTo({ top: Math.max(0, current.offsetTop - side.clientHeight / 3), behavior });
      }
    }
  }, [moves]);

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  if (!user) {
    return (
      <section className="section">
        <div className="container container--narrow">
          <EmptyState
            headingLevel={1}
            plain
            title="Log in to open this course"
            body="Your courses and progress are saved to your account, so they come back the moment you log in."
          >
            <Button to={{ pathname: location.pathname, search: '?auth=login' }} variant="primary" size="lg">
              Log in
            </Button>
            <Button to={`/courses/${course.id}`} variant="secondary" size="lg">
              See the course
            </Button>
          </EmptyState>
        </div>
      </section>
    );
  }

  if (!isEnrolled(id)) {
    return (
      <section className="section">
        <div className="container container--narrow">
          <EmptyState
            headingLevel={1}
            plain
            title="You do not own this course yet"
            body={`Buy ${course.title} and it appears in your learning list straight away, with every lesson unlocked.`}
          >
            <Button to={`/courses/${course.id}`} variant="primary" size="lg">
              See the course
            </Button>
            <Button to="/learning" variant="secondary" size="lg">
              My learning
            </Button>
          </EmptyState>
        </div>
      </section>
    );
  }

  const state = progressFor(id);
  const certificate = certificateFor(id);
  const activeIndex = lessons.findIndex((lesson) => lesson.key === activeKey);
  const active = lessons[activeIndex];
  const nextLesson = lessons[activeIndex + 1];
  const activeDone = active ? isDone(id, active.key) : false;

  const openLesson = (key) => {
    setNote(null);
    setActiveKey(key);
    setListOpen(false);
  };

  const toggleCaptions = () => {
    const next = !captions;
    setCaptions(next);

    try {
      window.localStorage.setItem(CAPTIONS_KEY, next ? 'on' : 'off');
    } catch {
    }
  };

  const captionLine = `${course.description[0].split('. ')[0]}.`;

  const goNext = () => {
    if (!nextLesson) return;
    setActiveKey(nextLesson.key);
    setMoves((count) => count + 1);
  };

  const complete = () => {
    if (!active || activeDone) {
      setNote(null);
      goNext();
      return;
    }

    const outcome = toggleLesson(id, active.key);

    if (outcome.courseComplete) {
      setNote(null);
      setCelebrating(true);
      return;
    }

    setNote({
      number: activeIndex + 1,
      title: active.title,
      goalReached: todayCount + 1 === DAILY_GOAL,
    });
    goNext();
  };

  const download = async () => {
    if (!certificateRef.current || !certificate){ 
      return;
    }

    setDownloading(true);
    await downloadCertificate(certificateRef.current, `SkillUP certificate ${certificate.number}`);
    setDownloading(false);

    notify({
      tone: 'success',
      title: 'Certificate downloaded',
      body: 'You will find it in your downloads folder.',
    });
  };

  return (
    <>
      <Celebration
        open={celebrating}
        wide
        eyebrow="Course complete"
        title="You earned your certificate"
        media={
          certificate && (
            <Link
              to={`/certificate/${course.id}`}
              className="player__certificate"
              aria-label="Open your certificate"
            >
              <Certificate
                ref={certificateRef}
                name={user.name}
                course={course}
                completedAt={certificate.completedAt}
                number={certificate.number}
                lessons={lessons.length}
              />
            </Link>
          )
        }
        secondaryAction={{ label: 'Back to my learning', to: '/learning' }}
        onClose={() => setCelebrating(false)}
      >
        <div className="player__certificate-actions">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={downloading}
            iconLeft={<DownloadIcon />}
            onClick={download}
          >
            Download certificate
          </Button>
          <p>
            It is also saved on <Link to="/learning#certificates">your learning page</Link>. You can
            get it again any time.
          </p>
        </div>

        <CourseReview compact review={reviewFor(id)} onSave={(review) => saveReview(id, review)} />
      </Celebration>

      <div className="player" data-category={course.category}>
        <aside ref={sideRef} className="player__side" aria-label="Course contents">
          <div className="player__side-head">
            <Link to="/learning" className="player__back">
              <BackIcon />
              My learning
            </Link>

            <h1 className="player__course-title">{course.title}</h1>
          </div>

          <div className="player__goals">
            <div className="player__goal-head">
              <span>Today&apos;s goal</span>
              <span className="player__goal-count">
                {Math.min(todayCount, DAILY_GOAL)} / {DAILY_GOAL}
              </span>
            </div>

            <div className="player__goal-pips" aria-hidden="true">
              {Array.from({ length: DAILY_GOAL }, (_, index) => (
                <span
                  key={index}
                  className={index < todayCount ? 'player__pip is-filled' : 'player__pip'}
                />
              ))}
            </div>

            {streak > 0 && (
              <p className="player__streak">
                <FlameIcon />
                {streak} {streak === 1 ? 'day' : 'days'} in a row
              </p>
            )}
          </div>

          <div className="player__progress">
            <div
              className="player__bar"
              role="progressbar"
              aria-valuenow={state.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Course progress"
            >
              <span className="player__bar-fill" style={{ width: `${state.percent}%` }} />
            </div>
            <p className="player__progress-text">
              <strong>{state.percent}% complete</strong>, {state.done} of {state.total} lessons
            </p>
          </div>

          {/* on a phone the list folds */}
          <button
            type="button"
            className="player__list-toggle"
            aria-expanded={listOpen}
            aria-controls="player-modules"
            onClick={() => setListOpen((open) => !open)}
          >
            {listOpen ? 'Hide the lesson list' : `Show all ${lessons.length} lessons`}
            <ChevronIcon open={listOpen} />
          </button>

          <ol id="player-modules" className={listOpen ? 'player__modules' : 'player__modules is-folded'}>
            {course.modules.map((module, moduleIndex) => (
              <li key={module.title} className="player__module">
                <p className="player__module-title">
                  <span>Module {moduleIndex + 1}</span>
                  {module.title}
                </p>

                <ul className="player__lessons">
                  {module.lessons.map((title, lessonIndex) => {
                    const lesson = lessons.find(
                      (item) =>
                        item.moduleIndex === moduleIndex && item.lessonIndex === lessonIndex,
                    );
                    const done = isDone(id, lesson.key);
                    const current = lesson.key === activeKey;

                    return (
                      <li key={lesson.key}>
                        <button
                          type="button"
                          className={[
                            'player__lesson',
                            current ? 'is-current' : '',
                            done ? 'is-done' : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => openLesson(lesson.key)}
                          aria-current={current ? 'true' : undefined}
                        >
                          <span className="player__lesson-mark" aria-hidden="true">
                            {done ? <TickIcon /> : null}
                          </span>
                          <span className="player__lesson-title">{title}</span>
                          <span className="visually-hidden">
                            {done ? ', finished' : ', not finished'}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </aside>

        <section ref={stageRef} className="player__stage" aria-label="Lesson">
          {note && (
            <div className="player__note" role="status">
              <span className="player__note-mark" aria-hidden="true">
                <TickIcon />
              </span>
              <div>
                <p className="player__note-title">
                  Lesson {note.number} done: {note.title}
                </p>
                <p className="player__note-next">
                  {note.goalReached && `Daily goal reached, ${DAILY_GOAL} of ${DAILY_GOAL}. `}
                  You are now on lesson {activeIndex + 1} of {lessons.length}.
                </p>
              </div>
              <button type="button" className="player__note-close" onClick={() => setNote(null)}>
                <CloseIcon />
                <span className="visually-hidden">Dismiss</span>
              </button>
            </div>
          )}

          {active && (
            <>
              <div className="player__meta">
                {/* the finish line is visible before the work starts*/}
                <Badge>
                  Lesson {activeIndex + 1} of {lessons.length}
                </Badge>
                <p className="player__module-name">{active.moduleTitle}</p>
              </div>

              <h2 ref={headingRef} tabIndex={-1} className="player__lesson-heading">
                {active.title}
              </h2>

              <div className="player__video">
                {coursePhoto(course.id) && (
                  <img
                    className="player__video-poster"
                    src={coursePhoto(course.id).large}
                    alt=""
                    width={1280}
                    height={720}
                    decoding="async"
                  />
                )}

                <p className="visually-hidden">
                  Video for {active.title}. The lesson player is a placeholder in this prototype.
                </p>

                <span className="player__video-play" aria-hidden="true">
                  <PlayIcon />
                </span>

                {captions && <p className="player__captions">{captionLine}</p>}

                <div className="player__video-bar">
                  <span className="player__video-note" aria-hidden="true">
                    The lesson player is a placeholder in this prototype
                  </span>
                  <button
                    type="button"
                    className="player__cc"
                    aria-pressed={captions}
                    onClick={toggleCaptions}
                  >
                    <CaptionsIcon />
                    Captions
                  </button>
                </div>
              </div>

              <div className="player__notes">
                <h3>About this lesson</h3>
                <p>{course.description[0]}</p>
                <p>
                  This lesson sits in {active.moduleTitle}, taught by {course.instructor}.
                  Mark it done when you have worked through it and the next one opens automatically.
                </p>
              </div>

              <div className="player__actions">
                {activeDone && !nextLesson && certificate ? (
                  <Button
                    to={`/certificate/${course.id}`}
                    variant="primary"
                    size="lg"
                    iconRight={<ArrowIcon />}
                  >
                    View your certificate
                  </Button>
                ) : (
                  <Button
                    variant={activeDone ? 'secondary' : 'primary'}
                    size="lg"
                    onClick={complete}
                    iconRight={<ArrowIcon />}
                  >
                    {activeDone
                      ? nextLesson
                        ? 'Go to next lesson'
                        : 'Finished'
                      : nextLesson
                        ? 'Mark done and continue'
                        : 'Finish the course'}
                  </Button>
                )}

                {activeDone && (
                  <button
                    type="button"
                    className="player__undo"
                    onClick={() => toggleLesson(id, active.key)}
                  >
                    Mark as not done
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      className={open ? 'player__chevron is-open' : 'player__chevron'}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CaptionsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M10.5 10.2a2.2 2.2 0 1 0 0 3.6M17 10.2a2.2 2.2 0 1 0 0 3.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d="M12 4v11M7 10l5 5 5-5M5 20h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TickIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        d="M15 18l-6-6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d="M5 12h14M13 6l6 6-6 6"
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
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
      <path d="M8 5l11 7-11 7z" fill="currentColor" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg viewBox="4 1 16 20" width="15" height="15" aria-hidden="true" focusable="false">
      <path
        d="M12 3s5 4.2 5 8.5a5 5 0 0 1-10 0C7 9.3 9 8 9 8s.3 2 1.5 2C11.7 10 12 6.5 12 3z"
        fill="currentColor"
      />
    </svg>
  );
}