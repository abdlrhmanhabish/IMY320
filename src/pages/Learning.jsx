import PageHeader from '../components/layout/PageHeader.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import CourseImage from '../components/ui/CourseImage.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import LevelTag from '../components/ui/LevelTag.jsx';
import { FirstWinArt } from '../components/ui/SpotArt.jsx';
import useAuth from '../hooks/useAuth.js';
import useProgress from '../hooks/useProgress.js';
import { DAILY_GOAL } from '../utils/progress.js';
import { Link } from 'react-router-dom';
import './Learning.css';

export default function Learning() {
  const { user } = useAuth();
  const { enrolled, progressFor, todayCount, goalMet, streak, certificateFor, reviewFor } = useProgress();

  if (!user) {
    return (
      <>
        <PageHeader title="My learning" />

        <section className="section section--tight">
          <div className="container container--narrow">
            <EmptyState
              art={<FirstWinArt />}
              title="Log in to see your learning"
              body="Your courses, progress and certificates are saved to your account. Nothing of yours shows on this device until you log in. Your data stay private on a shared computer."
            >
              <Button to={{ pathname: '/learning', search: '?auth=login' }} variant="primary" size="lg">
                Log in
              </Button>
              <Button to={{ pathname: '/learning', search: '?auth=signup' }} variant="secondary" size="lg">
                Create an account
              </Button>
            </EmptyState>

            <p className="learning__aside-link">
              <Link to="/courses" className="text-link">
                Or browse the catalogue first
              </Link>
            </p>
          </div>
        </section>
      </>
    );
  }

  if (enrolled.length === 0) {
    return (
      <>
        <PageHeader title="My learning" />

        <section className="section section--tight">
          <div className="container container--narrow">
            <EmptyState
              art={<FirstWinArt />}
              title="Your learning list is empty"
              body="Courses you buy land here. Finish your first lesson and this page starts tracking a streak, a daily goal and your progress in every course."
            >
              <Button to="/courses" variant="primary" size="lg">
                Find your first course
              </Button>
            </EmptyState>
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
  const nextState = nextUp ? progressFor(nextUp.id) : null;

  const certificates = enrolled
    .map((course) => ({ course, certificate: certificateFor(course.id) }))
    .filter((entry) => entry.certificate);

  return (
    <>
      <PageHeader
        title="My learning"
        lead={`Welcome back, ${user.name.split(' ')[0]}. Your progress saves after every lesson.`}
      />

      <section className="section section--tight">
        <div className="container">
          {/* progress shows in three places at once here, the daily goal, the streak and each course bar. one number moving on its own is easy to miss */}
          <ul className="learning__stats">
            <li className="learning__stat">
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
            </li>

            <li className="learning__stat">
              <p className="learning__stat-label">Streak</p>
              <p className="learning__stat-value">
                {streak} {streak === 1 ? 'day' : 'days'}
              </p>
              <p className="learning__stat-note">
                {streak === 0 ? 'Finish one lesson to start a streak' : 'Come back tomorrow to keep it going'}
              </p>
            </li>

            <li className="learning__stat">
              <p className="learning__stat-label">Courses done</p>
              <p className="learning__stat-value">
                {finished} of {enrolled.length}
              </p>
              <p className="learning__stat-note">
                {finished === enrolled.length ? 'Every course on your list is done' : 'Certificates unlock at 100%'}
              </p>
            </li>
          </ul>

          {nextUp && (
            <div className="learning__resume" data-category={nextUp.category}>
              <div className="learning__resume-thumb">
                <CourseImage course={nextUp} decorative sizes="10rem" />
              </div>

              <div className="learning__resume-text">
                <p className="learning__resume-label">
                  {nextState.started ? 'Pick up where you left off' : 'Ready when you are'}
                </p>
                <h2 className="learning__resume-title">{nextUp.title}</h2>
                <div className="learning__bar" aria-hidden="true">
                  <span className="learning__bar-fill" style={{ width: `${nextState.percent}%` }} />
                </div>
                <p className="learning__resume-meta">
                  {nextState.percent}% complete, {nextState.done} of {nextState.total} lessons
                </p>
              </div>

              <Button to={`/learn/${nextUp.id}`} variant="primary" size="lg">
                {nextState.started ? 'Continue learning' : 'Start lesson one'}
              </Button>
            </div>
          )}

          <div className="learning__section-head">
            <h2 className="learning__section-heading">Your courses</h2>
            <Link to="/courses" className="text-link learning__head-link">
              Browse more courses
            </Link>
          </div>

          <ul className="learning__list">
            {enrolled.map((course) => {
              const state = progressFor(course.id);
              const review = reviewFor(course.id);

              return (
                <li key={course.id} className="learning__card" data-category={course.category}>
                  <div className="learning__card-media">
                    <CourseImage course={course} decorative sizes="(max-width: 40rem) 100vw, 24rem" />
                    {state.complete && (
                      <Badge tone="success" className="learning__card-flag">
                        Complete
                      </Badge>
                    )}
                  </div>

                  <div className="learning__card-body">
                    <div className="learning__card-head">
                      <Badge category={course.category} />
                      <LevelTag level={course.level} />
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
                      <strong>{state.percent}% complete</strong>
                      <span>
                        {state.done} of {state.total} lessons
                      </span>
                    </p>

                    {review && <p className="learning__card-rated">You rated it {review.rating} of 5</p>}
                  </div>

                  <div className="learning__card-actions">
                    {state.complete ? (
                      <>
                        <Button to={`/certificate/${course.id}`} variant="secondary" fullWidth>
                          View certificate
                        </Button>
                        <Link to={`/learn/${course.id}`} className="text-link learning__card-link">
                          Review the lessons
                        </Link>
                      </>
                    ) : (
                      <Button to={`/learn/${course.id}`} variant="secondary" fullWidth>
                        {state.started ? 'Continue' : 'Start the course'}
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="learning__browse">
            <span className="learning__browse-icon" aria-hidden="true">
              <PlusIcon />
            </span>
            <div className="learning__browse-text">
              <h3 className="learning__browse-title">Add another course</h3>
              <p>Every course comes with lifetime access and a certificate at the end.</p>
            </div>
            <Button to="/courses" variant="secondary">
              Browse courses
            </Button>
          </div>

          <section id="certificates" className="learning__certificates" aria-labelledby="certificates-heading">
            <h2 id="certificates-heading" className="learning__section-heading">
              Certificates
            </h2>

            {certificates.length === 0 ? (
              <p className="learning__certificates-empty">
                Finish every lesson in a course and its certificate appears here, ready to download.
              </p>
            ) : (
              <ul className="learning__certificate-list">
                {certificates.map(({ course, certificate }) => (
                  <li key={course.id} className="learning__certificate">
                    <span className="learning__certificate-icon" aria-hidden="true">
                      <RibbonIcon />
                    </span>
                    <div className="learning__certificate-text">
                      <p className="learning__certificate-title">{course.title}</p>
                      <p className="learning__certificate-meta">
                        {new Date(certificate.completedAt).toLocaleDateString('en-ZA', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                        , {certificate.number}
                      </p>
                    </div>
                    <Button to={`/certificate/${course.id}`} variant="secondary" size="sm">
                      View and download
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </section>
    </>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function RibbonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <circle cx="12" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8.5 14l-1.5 7 5-2.5 5 2.5-1.5-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}