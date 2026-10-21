import { useParams } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { site } from '../config/site.js';
import './InfoPage.css';

// this is a placholder for pages that are still comingg

const PAGES = {
  careers: {
    eyebrow: 'Careers',
    title: `Working at ${site.name}`,
    lead: 'Open roles, how we hire and what we pay. This page is being written.',
    body: 'When it opens it will list every vacancy with its salary band, because asking candidates to guess wastes everyone time.',
  },
  press: {
    eyebrow: 'Press',
    title: 'Press and media',
    lead: 'Company facts, leadership biographies and recent coverage. This page is being written.',
    body: 'It will carry the figures journalists ask for, along with the contact for media enquiries.',
  },
  contact: {
    eyebrow: 'Contact',
    title: `Talk to ${site.name}`,
    lead: 'A contact form and our direct details. This page is being built.',
    body: 'Until it lands, the About page covers what we teach, who runs the platform and how the courses are put together.',
  },
  terms: {
    eyebrow: 'Legal',
    title: 'Terms of use',
    lead: 'The agreement between you and this site. Being drafted.',
    body: `${site.name} is a student prototype built for a university module. It is not a trading company, no course is delivered and no payment is taken.`,
  },
  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy policy',
    lead: 'What this prototype stores and what it does not. Being drafted.',
    body: 'There is no backend. Anything typed into a form stays in your own browser and is never sent anywhere. There is no analytics and no third party script.',
  },
  accessibility: {
    eyebrow: 'Legal',
    title: 'Accessibility',
    lead: 'What we have done and what is still outstanding. Being drafted.',
    body: 'Every control is reachable by keyboard with a visible focus ring, headings run in order, and body text meets a contrast ratio of at least 4.5 to 1.',
  },
};

export default function ComingSoon({ page }) {
  const params = useParams();
  const key = page ?? params.document;
  const content = PAGES[key];

  if (!content) return <UnknownPage />;

  return (
    <>
      <PageHeader eyebrow={content.eyebrow} title={content.title} lead={content.lead} />

      <section className="section section--tight">
        <div className="container info-page__note">
          <EmptyState title="Not published yet" body={content.body}>
            <Button to="/courses" variant="primary">
              Browse courses
            </Button>
            <Button to="/about" variant="secondary">
              Read about us
            </Button>
          </EmptyState>
        </div>
      </section>
    </>
  );
}

function UnknownPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="We cannot find that document"
        lead="The address may be out of date. The documents we do have are listed in the footer."
      />

      <section className="section section--tight">
        <div className="container info-page__note">
          <EmptyState
            title="Try one of these instead"
            body="Terms of use, the privacy policy and our accessibility statement are all linked from the bottom of every page."
          >
            <Button to="/" variant="primary">
              Back to home
            </Button>
          </EmptyState>
        </div>
      </section>
    </>
  );
}