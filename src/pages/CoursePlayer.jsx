import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Celebration from '../components/ui/Celebration.jsx';
import useProgress from '../hooks/useProgress.js';
import useToast from '../hooks/useToast.js';
import { DAILY_GOAL, lessonsOf } from '../utils/progress.js';
import courses from '../data/courses.json';
import './CoursePlayer.css';

export default function CoursePlayer() {
  const { courseId } = useParams();
  const id = Number(courseId);
  const course = courses.find((item) => item.id === id);
  const { isEnrolled, isDone, toggleLesson, progressFor, todayCount, streak } = useProgress();
  const { notify } = useToast();
  const lessons = useMemo(() => lessonsOf(course), [course]);
  const [activeKey, setActiveKey] = useState(null);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    setActiveKey(null);
    setCelebrating(false);
  }, [id]);

  // open on the first lesson that is not finished. which means returning to a course lands where the work actually is
  useEffect(() => {
    if (lessons.length === 0 || activeKey) return;
    const next = lessons.find((lesson) => !isDone(id, lesson.key));
    setActiveKey((next ?? lessons[0]).key);
  }, [lessons, activeKey, isDone, id]);

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  if (!isEnrolled(id)) {
    return (
      <section className="section">
        <div className="container container--narrow player__locked">
          <h1>You do not own this course yet</h1>
          <p>
            Buy {course.title} and it appears in your learning list straight away, with every lesson unlocked.
          </p>
          <div className="player__locked-actions">
            <Button to={`/courses/${course.id}`} variant="primary" size="lg">
              See the course
            </Button>
            <Button to="/learning" variant="secondary">
              My learning
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const state = progressFor(id);
  const activeIndex = lessons.findIndex((lesson) => lesson.key === activeKey);
  const active = lessons[activeIndex];
  const nextLesson = lessons[activeIndex + 1];
  const activeDone = active ? isDone(id, active.key) : false;

  const complete = () => {
    if (!active || activeDone) {
      if (nextLesson) setActiveKey(nextLesson.key);
      return;
    }

    const outcome = toggleLesson(id, active.key);

    if (outcome.courseComplete) {
      setCelebrating(true);
      return;
    }

    // small and quiet on purpose
    const nowToday = todayCount + 1;

    if (nowToday === DAILY_GOAL) {
      notify({
        tone: 'success',
        title: `Daily goal reached, ${DAILY_GOAL} of ${DAILY_GOAL}`,
        body: 'Anything past this is a bonus. Your streak is safe for today.',
        duration: 6000,
      });
    } else {
      notify({
        tone: 'success',
        title: 'Lesson done',
        body: active.title,
        duration: 2600,
      });
    }

    if (nextLesson) setActiveKey(nextLesson.key);
  };

  return (
    <>
      <Celebration
        open={celebrating}
        eyebrow="Course complete"
        title="That is the whole course."
        stat={`${state.total} of ${state.total} lessons`}
        statLabel={`${course.title}, finished`}
        body="Your certificate is on your learning page, and the course stays open for as long as you want it."
        primaryAction={{ label: 'Back to my learning', to: '/learning' }}
        secondaryAction={{ label: 'Find your next course', to: '/courses' }}
        onClose={() => setCelebrating(false)}
      />

      <div className="player">
        <aside className="player__side" aria-label="Course contents">
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
              {state.done} of {state.total} lessons, {state.percent}%
            </p>
          </div>

          <ol className="player__modules">
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
                          onClick={() => setActiveKey(lesson.key)}
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

        <main className="player__stage">
          {active && (
            <>
              <div className="player__meta">
                {/* the finish line is visible before the work starts*/}
                <p className="player__position">
                  Lesson {activeIndex + 1} of {lessons.length}
                </p>
                <p className="player__module-name">{active.moduleTitle}</p>
              </div>

              <h2 className="player__lesson-heading">{active.title}</h2>

              <div className="player__video" role="img" aria-label="Lesson video placeholder">
                <span className="player__video-play" aria-hidden="true">
                  <PlayIcon />
                </span>
                <p className="player__video-note">
                  The lesson player is a placeholder in this prototype
                </p>
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
        </main>
      </div>
    </>
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
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
      <path
        d="M12 3s5 4.2 5 8.5a5 5 0 0 1-10 0C7 9.3 9 8 9 8s.3 2 1.5 2C11.7 10 12 6.5 12 3z"
        fill="currentColor"
      />
    </svg>
  );
}