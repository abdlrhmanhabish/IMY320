import PageHeader from '../components/layout/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import useProgress from '../hooks/useProgress.js';
import { DAILY_GOAL } from '../utils/progress.js';
import { Link } from 'react-router-dom';
import './Learning.css';

export default function Learning() {
  const { enrolled, progressFor, todayCount, goalMet, streak } = useProgress();

  if (enrolled.length === 0) {
    return (
      <>
        <PageHeader
          eyebrow="My learning"
          title="Your learning list is empty"
          lead="Courses you buy land here, with your progress saved as you go."
          backTo="/courses"
          backLabel="Back to courses"
        />

        <section className="section">
          <div className="container container--narrow learning__empty">
            <p className="learning__empty-lead">
              Finish your first lesson and this page starts tracking a streak, a daily
              goal and a progress bar for every course you own.
            </p>
            <Button to="/courses" variant="primary" size="lg">
              Find your first course
            </Button>
          </div>
        </section>
      </>
    );
  }

  const finished = enrolled.filter((course) => progressFor(course.id).complete).length;
  const inProgress = enrolled.filter((course) => {
    const state = progressFor(course.id);
    return state.started && !state.complete;
  });

  const nextUp = inProgress[0] ?? enrolled.find((course) => !progressFor(course.id).complete);

  return (
    <>
      <PageHeader
        eyebrow="My learning"
        title="Keep going"
        lead="Everything you own, with the next lesson one click away."
        backTo="/courses"
        backLabel="Back to courses"
      />

      <section className="section">
        <div className="container">
          {/* progress shows in three places at once here, the daily goal, the streak and each course bar. one number moving on its own is easy to miss */}
          <div className="learning__stats">
            <div className="learning__stat">
              <p className="learning__stat-label">Today&apos;s goal</p>
              <p className="learning__stat-value">
                {Math.min(todayCount, DAILY_GOAL)} of {DAILY_GOAL}
              </p>
              <div className="learning__goal-track" aria-hidden="true">
                {Array.from({ length: DAILY_GOAL }, (_, index) => (
                  <span
                    key={index}
                    className={index < todayCount ? 'learning__pip is-filled' : 'learning__pip'}
                  />
                ))}
              </div>
              <p className="learning__stat-note">
                {goalMet ? 'Done for today. Anything more is a bonus.' : 'Lessons finished today'}
              </p>
            </div>

            <div className="learning__stat">
              <p className="learning__stat-label">Streak</p>
              <p className="learning__stat-value">
                {streak} {streak === 1 ? 'day' : 'days'}
              </p>
              <p className="learning__stat-note">
                {streak === 0
                  ? 'Finish one lesson to start a streak'
                  : 'Come back tomorrow to keep it alive'}
              </p>
            </div>

            <div className="learning__stat">
              <p className="learning__stat-label">Courses finished</p>
              <p className="learning__stat-value">
                {finished} of {enrolled.length}
              </p>
              <p className="learning__stat-note">
                {finished === enrolled.length
                  ? 'Every course on your list is done'
                  : 'Certificates unlock at 100%'}
              </p>
            </div>
          </div>

          {nextUp && (
            <div className="learning__resume" data-category={nextUp.category}>
              <div>
                <p className="learning__resume-label">Pick up where you left off</p>
                <h2 className="learning__resume-title">{nextUp.title}</h2>
                <p className="learning__resume-meta">
                  {progressFor(nextUp.id).done} of {progressFor(nextUp.id).total} lessons done
                </p>
              </div>

              <Button to={`/learn/${nextUp.id}`} variant="primary" size="lg">
                {progressFor(nextUp.id).started ? 'Continue' : 'Start lesson one'}
              </Button>
            </div>
          )}

          <h2 className="learning__section-heading">Your courses</h2>

          <ul className="learning__list">
            {enrolled.map((course) => {
              const state = progressFor(course.id);

              return (
                <li key={course.id} className="learning__card" data-category={course.category}>
                  <div className="learning__card-head">
                    <span className="learning__tag">{course.category}</span>
                    {state.complete && <span className="learning__done-badge">Complete</span>}
                  </div>

                  <h3 className="learning__card-title">
                    <Link to={`/learn/${course.id}`}>{course.title}</Link>
                  </h3>

                  <p className="learning__card-meta">
                    {course.instructor}, {course.duration}
                  </p>

                  <div
                    className="learning__bar"
                    role="progressbar"
                    aria-valuenow={state.percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${course.title} progress`}
                  >
                    <span className="learning__bar-fill" style={{ width: `${state.percent}%` }} />
                  </div>

                  <p className="learning__card-progress">
                    {state.done} of {state.total} lessons, {state.percent}%
                  </p>

                  <Button
                    to={`/learn/${course.id}`}
                    variant={state.complete ? 'secondary' : 'primary'}
                    fullWidth
                  >
                    {state.complete ? 'Review the course' : state.started ? 'Continue' : 'Start'}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}