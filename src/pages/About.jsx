import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../config/site.js';
import testimonials from '../data/testimonials.json';
import team from '../data/team.json';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Carousel from '../components/ui/Carousel.jsx';
import useScrollSpy from '../hooks/useScrollSpy.js';
import './About.css';


const SECTIONS = [
  { id: 'mission', label: 'Mission' },
  { id: 'values', label: 'What we believe' },
  { id: 'story', label: 'Our story' },
  { id: 'team', label: 'Leadership' },
  { id: 'learners', label: 'Learner stories' },
  { id: 'more', label: 'More about us' },
];

const VALUES = [
  {
    title: 'Teach what the job asks for',
    body: 'Every course starts from a task somebody is paid to do, not from a syllabus. If a topic will not show up in the first six months of the work, it does not make the cut.'
  },
  {
    title: 'Respect the time people have',
    body: 'Most of our learners study around a job, a commute and a family. Modules are built to be finished in one sitting, so progress survives a week that goes badly.'
  },
  {
    title: 'Show the work, not the certificate',
    body: 'Every path ends in something you can hand to an employer. The certificate is a receipt for the project, and the project is the thing that gets you the interview.'
  },
  {
    title: 'Keep the door open',
    body: 'Course pricing is published up front with no upsell at the end. Anyone who cannot pay can apply for a funded place, and we say how many we grant each quarter.'
  }
];

const INSTITUTIONAL_LINKS = [
  {
    id: 'careers',
    eyebrow: 'Work with us',
    title: 'Careers at SkillUP',
    body: 'Open roles across learning design, engineering and support, with the salary band on every listing.',
    to: '/careers',
    cta: 'See open roles',
  },
  {
    id: 'contact',
    eyebrow: 'Talk to us',
    title: 'Contact SkillUP',
    body: 'Questions about a course, a partnership or an invoice. We answer within one working day.',
    to: '/contact',
    cta: 'Send a message',
  },
  {
    id: 'press',
    eyebrow: 'For journalists',
    title: 'Press and media',
    body: 'Company facts, founder biographies, logo files and the contact for media enquiries.',
    to: '/press',
    cta: 'Open the press kit',
  },
  {
    id: 'leadership',
    eyebrow: 'Who runs it',
    title: 'Leadership team',
    body: 'The four people accountable for what gets taught here, and what each of them decides.',
    to: '/about#team',
    cta: 'Meet the team',
  }
];

export default function About() {
  const sectionIds = useMemo(() => SECTIONS.map((section) => section.id), []);
  const activeSection = useScrollSpy(sectionIds);

  return (
    <div className="about">
      <section className="about__hero" id="mission" aria-labelledby="about-hero-heading">
        <div className="container">
          <p className="section__eyebrow">About {site.name}</p>
          <h1 id="about-hero-heading" className="about__hero-heading">
            We teach the skills that change what you get hired to do
          </h1>
          <p className="about__hero-lead">
            {site.name} is built for people who need one specific, practical skill and
            cannot put the rest of their life on hold to get it. Short courses, taught by
            people who still do the work, ending in something you can show an employer.
          </p>
          {/*We can add "Browse Courses option here later*/}
          <div className="about__hero-actions">
            <Button to="/about#story" size="lg">
              Read our story
            </Button>
            <Button to="/contact" size="lg" variant="secondary">
              Talk to us
            </Button>
          </div>
        </div>
      </section>

      <SubNav sections={SECTIONS} activeId={activeSection} />

      <section className="section section--raised" id="values" aria-labelledby="values-heading">
        <div className="container">
          <div className="section__header">
            <h2 id="values-heading">What we believe</h2>
            <p className="section__lead">
              Four commitments that decide what we build and what we turn down.
            </p>
          </div>

          <ul className="about__values">
            {VALUES.map((value) => (
              <li key={value.title} className="about__value">
                <h3 className="about__value-title">{value.title}</h3>
                <p className="about__value-body">{value.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="story" aria-labelledby="story-heading">
        <div className="container about__story">
          <div className="about__story-text">
            <div className="section__header">
              <h2 id="story-heading">Our story</h2>
            </div>
            <div className="stack">
              <p>
                {site.name} started in {site.founded} in {site.location}, after our
                founder spent more than a decade running graduate training at a logistics
                company. The pattern she kept seeing was the same one every time: people
                who were already good at the job, with no way to prove it to anyone
                outside the building.
              </p>
              <p>
                The courses that existed either took a year and a campus, or took an hour
                and taught nothing. There was very little in between for someone working
                full time who needed one concrete skill by the end of the quarter.
              </p>
              <p>
                So we built the thing in between. Courses are broken into modules that fit
                a real evening. Every path ends in a project rather than a quiz. Instructors
                are recruited from people currently doing the work, and we stop working with
                them if they leave the field for more than two years.
              </p>
              <p>
                Today {site.name} runs learning paths across data, web development,
                delivery management and small business finance, with more than four
                thousand learners across South Africa. We publish our completion rates
                every quarter, including the paths where they are not good enough yet.
              </p>
            </div>
          </div>

          <div className="about__story-media">
            <StoryArtwork />
            <ul className="about__facts">
              <li className="about__fact">
                <span className="about__fact-value">4,200</span>
                <span className="about__fact-label">learners enrolled</span>
              </li>
              <li className="about__fact">
                <span className="about__fact-value">61</span>
                <span className="about__fact-label">courses across 9 paths</span>
              </li>
              <li className="about__fact">
                <span className="about__fact-value">78%</span>
                <span className="about__fact-label">finish the path they start</span>
              </li>
              <li className="about__fact">
                <span className="about__fact-value">1 day</span>
                <span className="about__fact-label">median support response</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--raised" id="team" aria-labelledby="team-heading">
        <div className="container">
          <div className="section__header">
            <h2 id="team-heading">Leadership</h2>
            <p className="section__lead">
              Four people, and what each of them is accountable for.
            </p>
          </div>

          <ul className="about__team">
            {team.map((person) => (
              <li key={person.id}>
                <Card className="about__person">
                  <div className="about__person-head">
                    <Avatar name={person.name} />
                    <div>
                      <h3 className="about__person-name">{person.name}</h3>
                      <p className="about__person-role">{person.role}</p>
                    </div>
                  </div>
                  <p className="about__person-bio">{person.bio}</p>
                  <p className="about__person-focus">Owns: {person.focus}</p>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="learners" aria-labelledby="learners-heading">
        <div className="container">
          <div className="section__header">
            <h2 id="learners-heading">Learner stories</h2>
            <p className="section__lead">
              Five people who finished a path here, in their own words.
            </p>
          </div>

          <Carousel
            items={testimonials}
            label="Learner stories"
            emptyMessage="No learner stories have been published yet. Check back after this quarter's cohort finishes."
            renderItem={(item) => (
              <figure className="about__quote">
                <QuoteMark />
                <blockquote className="about__quote-text">{item.quote}</blockquote>
                <figcaption className="about__quote-person">
                  <Avatar name={item.name} />
                  <div>
                    <p className="about__quote-name">{item.name}</p>
                    <p className="about__quote-role">
                      {item.role}, {item.location}
                    </p>
                    <p className="about__quote-context">{item.context}</p>
                  </div>
                </figcaption>
              </figure>
            )}
          />
        </div>
      </section>

      <section className="section section--raised" id="more" aria-labelledby="more-heading">
        <div className="container">
          <div className="section__header">
            <h2 id="more-heading">More about {site.name}</h2>
            <p className="section__lead">
              The pages people look for when they come here. Each one is a real
              destination, not a summary.
            </p>
          </div>

          <ul className="about__links">
            {INSTITUTIONAL_LINKS.map((link) => (
              <li key={link.id}>
                <Card
                  eyebrow={link.eyebrow}
                  title={link.title}
                  to={link.to}
                  footer={<span className="about__link-cta">{link.cta}</span>}
                >
                  <p>{link.body}</p>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="about__cta" aria-labelledby="about-cta-heading">
        <div className="container container--narrow">
          <h2 id="about-cta-heading" className="about__cta-heading">
            Still deciding
          </h2>
          <p className="about__cta-lead">
            Ask us anything about how the courses work, what a path involves, or whether
            this is the right fit. We answer within one working day.
          </p>
          {/*
            Becomes "Browse courses" at /courses, with a secondary link to registration,
            once the catalogue and auth issues land.
          */}
          <div className="about__cta-actions">
            <Button to="/contact" size="lg">
              Talk to us
            </Button>
            <Link to="/careers" className="about__cta-link">
              or see open roles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SubNav({ sections, activeId }) {
  return (
    <nav className="about__subnav" aria-label="On this page">
      <div className="container">
        <ul className="about__subnav-list">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`about__subnav-link ${
                  activeId === section.id ? 'about__subnav-link--active' : ''
                }`}
                aria-current={activeId === section.id ? 'true' : undefined}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function Avatar({ name }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('');

  return (
    <span className="about__avatar" aria-hidden="true">
      {initials}
    </span>
  );
}

function QuoteMark() {
  return (
    <svg
      className="about__quote-mark"
      viewBox="0 0 32 24"
      width="32"
      height="24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 24V13.5C0 6 4.5 1 12 0v4.5C8 5.5 6 8 6 11h5v13zm18 0V13.5C18 6 22.5 1 30 0v4.5c-4 1-6 3.5-6 6.5h5v13z"
        fill="currentColor"
      />
    </svg>
  );
}

function StoryArtwork() {
  return (
    <svg
      className="about__artwork"
      viewBox="0 0 400 260"
      role="img"
      aria-label="Illustration of a learning path made of stacked modules rising from left to right"
      focusable="false"
    >
      <rect width="400" height="260" rx="12" className="about__artwork-bg" />
      <g className="about__artwork-bars">
        <rect x="36" y="168" width="52" height="60" rx="8" opacity="0.35" />
        <rect x="104" y="132" width="52" height="96" rx="8" opacity="0.5" />
        <rect x="172" y="96" width="52" height="132" rx="8" opacity="0.7" />
        <rect x="240" y="58" width="52" height="170" rx="8" opacity="0.85" />
        <rect x="308" y="28" width="52" height="200" rx="8" />
      </g>
      <g className="about__artwork-path">
        <path
          d="M62 156 L130 120 L198 84 L266 46 L334 16"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="62" cy="156" r="7" />
        <circle cx="130" cy="120" r="7" />
        <circle cx="198" cy="84" r="7" />
        <circle cx="266" cy="46" r="7" />
        <circle cx="334" cy="16" r="7" />
      </g>
    </svg>
  );
}