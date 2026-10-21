import { useRef, useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import Certificate from '../components/ui/Certificate.jsx';
import CourseReview from '../components/ui/CourseReview.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import useAuth from '../hooks/useAuth.js';
import useProgress from '../hooks/useProgress.js';
import useToast from '../hooks/useToast.js';
import { downloadCertificate } from '../utils/certificate.js';
import { lessonsOf } from '../utils/progress.js';
import courses from '../data/courses.json';
import './CertificatePage.css';

export default function CertificatePage() {
  const { courseId } = useParams();
  const location = useLocation();
  const course = courses.find((item) => item.id === Number(courseId));
  const { user } = useAuth();
  const { isEnrolled, progressFor, certificateFor, reviewFor, saveReview } = useProgress();
  const { notify } = useToast();
  const paperRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!course) {
    return <Navigate to="/learning" replace />;
  }

  if (!user) {
    return (
      <Waiting
        heading="Log in to see your certificate"
        body="Certificates are saved to your account, so they are there on any device once you log in."
      >
        <Button to={{ pathname: location.pathname, search: '?auth=login' }} variant="primary" size="lg">
          Log in
        </Button>
        <Button to="/courses" variant="secondary" size="lg">
          Browse courses
        </Button>
      </Waiting>
    );
  }

  const certificate = certificateFor(course.id);

  if (!isEnrolled(course.id) || !certificate) {
    const state = progressFor(course.id);

    return (
      <Waiting
        heading="Finish the course to earn this certificate"
        body={
          isEnrolled(course.id)
            ? `You have done ${state.done} of ${state.total} lessons in ${course.title}. The certificate appears the moment the last one is marked done.`
            : `${course.title} comes with a certificate once every lesson is done.`
        }
      >
        {isEnrolled(course.id) ? (
          <Button to={`/learn/${course.id}`} variant="primary" size="lg">
            Continue the course
          </Button>
        ) : (
          <Button to={`/courses/${course.id}`} variant="primary" size="lg">
            See the course
          </Button>
        )}
        <Button to="/learning" variant="secondary" size="lg">
          My learning
        </Button>
      </Waiting>
    );
  }

  const date = new Date(certificate.completedAt).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const download = async () => {
    setDownloading(true);
    await downloadCertificate(paperRef.current, `SkillUP certificate ${certificate.number}`);
    setDownloading(false);

    notify({
      tone: 'success',
      title: 'Certificate downloaded',
      body: 'You will find it in your downloads folder.',
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Certificate of completion"
        title={course.title}
        lead={`Earned on ${date}. Download it for your CV or print it for your manager.`}
        backTo="/learning"
        backLabel="Back to my learning"
      />

      <section className="section section--tight certificate-page">
        <div className="container certificate-page__layout">
          <div className="certificate-page__paper">
            <Certificate
              ref={paperRef}
              name={user.name}
              course={course}
              completedAt={certificate.completedAt}
              number={certificate.number}
              lessons={lessonsOf(course).length}
            />
          </div>

          <aside className="certificate-page__side" aria-label="Certificate actions">
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

            <Button variant="secondary" fullWidth iconLeft={<PrintIcon />} onClick={() => window.print()}>
              Print
            </Button>

            <dl className="certificate-page__facts">
              <div>
                <dt>Certificate number</dt>
                <dd>{certificate.number}</dd>
              </div>
              <div>
                <dt>Awarded to</dt>
                <dd>{user.name}</dd>
              </div>
              <div>
                <dt>Instructor</dt>
                <dd>{course.instructor}</dd>
              </div>
            </dl>

            <CourseReview
              compact
              review={reviewFor(course.id)}
              onSave={(review) => saveReview(course.id, review)}
            />
          </aside>
        </div>
      </section>
    </>
  );
}

function Waiting({ heading, body, children }) {
  return (
    <section className="section">
      <div className="container container--narrow">
        <EmptyState headingLevel={1} plain title={heading} body={body}>
          {children}
        </EmptyState>
      </div>
    </section>
  );
}

function PrintIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d="M7 9V3.5h10V9M7 17H4.5V10a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v7H17M7 14h10v6.5H7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
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