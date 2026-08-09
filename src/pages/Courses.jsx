import { useSearchParams } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import './InfoPage.css';

//the course catalogue placholder
export default function Courses() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  return (
    <>
      <PageHeader
        eyebrow="Courses"
        title="The full catalogue is on its way"
        lead="Browsing, filtering and enrolment arrive with the catalogue. The four featured courses on the home page show what the listings will look like."
        backTo="/"
        backLabel="Back to home"
      />

      <section className="section">
        <div className="container">
          <div className="info-page__callout">
            {query ? (
              <>
                <h2 className="info-page__callout-heading">
                  We saved your search for &ldquo;{query}&rdquo;
                </h2>
                <p className="info-page__callout-body">
                  When the catalogue opens, this search will run across every course and
                  learning path. Until then, the featured courses on the home page are the
                  best place to look.
                </p>
              </>
            ) : (
              <>
                <h2 className="info-page__callout-heading">Nothing to browse yet</h2>
                <p className="info-page__callout-body">
                  The catalogue opens with courses across data, finance, development and
                  management. The featured selection on the home page is live already.
                </p>
              </>
            )}

            <div className="info-page__callout-actions">
              <Button to="/" variant="primary">
                See featured courses
              </Button>
              <Button to="/about" variant="secondary">
                Read about us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}