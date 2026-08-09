// LANDING PAGE
// Author: Cleopatra K
// Date: 2026-08-08

import './Landing.css';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import heroImage from '../../assets/hero-career.jpg';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import { site } from '../../config/site.js';
import { getCourses } from '../../utils/fakeApi.js';
import microsoftLogo from '../../assets/microsoft.png';
import awsLogo from '../../assets/aws.png';
import googleLogo from '../../assets/google.png';
import metaLogo from '../../assets/meta.png';
import salesforceLogo from '../../assets/salesforce.png';

const categories = ['All', 'Data', 'Finance', 'Development', 'Management'];

const partnerLogos = [
  { src: microsoftLogo, alt: 'Microsoft', wide: true },
  { src: googleLogo, alt: 'Google', wide: false },
  { src: metaLogo, alt: 'Meta', wide: true },
  { src: awsLogo, alt: 'Amazon Web Services', wide: false },
  { src: salesforceLogo, alt: 'Salesforce', wide: true }
];

// the minimal functionality of our page
export default function Landing() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState('loading');
  const navigate = useNavigate();
  const location = useLocation();

  // the courses load through fakeApi so the skeleton error and empty states are all real 
  const loadCourses = useCallback(() => {
    let active = true;

    setStatus('loading');
    getCourses()
      .then((data) => {
        if (!active) return;
        setCourses(data);
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => loadCourses(), [loadCourses]);

  const filteredCourses = courses.filter(
    (course) => selectedCategory === 'All' || course.category === selectedCategory,
  );

  const openSignup = (courseId) => {
    const search = courseId ? `?auth=signup&enroll=${courseId}` : '?auth=signup';
    navigate({ pathname: location.pathname, search });
  };

  // the basic Jakobs law UI of the landing page
  return (
    <div className="landing-page">
      {/* HERO SECTION */}
      <section className="hero container">
        <div className="hero-content">
          <span className="section-label">Career Skills Training</span>
          <h1 className="hero-title">Learn skills. Build your career.</h1>
          <p className="hero-description">
            Practical, short courses taught by people who do the work. Every learning
            path ends in a real project you can show an employer.
          </p>

          <div className="hero-buttons">
            <Button to="/courses" variant="primary" size="lg">
              Explore courses
            </Button>
            <Button
              onClick={() => openSignup()}
              variant="secondary"
              size="lg"
            >
              Join {site.name}
            </Button>
          </div>

          <div className="hero-stats">
            <div>
              <strong>4,200+</strong> Learners
            </div>
            <div>
              <strong>78%</strong> Finish rate
            </div>
            <div>
              <strong>4.8</strong> Average rating
            </div>
          </div>
        </div>

        <div className="hero-image-container">
          <img
            src={heroImage}
            alt="A person working through a course on a laptop"
            className="hero-img"
            width="1024"
            height="1024"
          />
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <h2>How {site.name} works</h2>
          <p className="subtitle">Four steps to building skills that count</p>

          <ol className="steps-grid">
            <li className="step-card">
              <span className="step-number">1</span>
              <h3>Pick a path</h3>
              <p>Select a goal-oriented career path instead of guessing random courses.</p>
            </li>

            <li className="step-card">
              <span className="step-number">2</span>
              <h3>Bite-sized modules</h3>
              <p>Study in short, focused evening modules built around working schedules.</p>
            </li>

            <li className="step-card">
              <span className="step-number">3</span>
              <h3>Build a project</h3>
              <p>Complete a practical project reviewed by industry practitioners.</p>
            </li>

            <li className="step-card">
              <span className="step-number">4</span>
              <h3>Show employers</h3>
              <p>Share your certificate and completed project link directly on your CV.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* COURSES CATALOGUE */}
      <section id="courses" className="courses-section container">
        <h2>Featured courses</h2>
        <p className="subtitle">Practical courses designed for real workplace demands</p>

        <div className="category-tabs" role="group" aria-label="Filter courses by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        <div aria-live="polite">
          {status === 'loading' && <CourseSkeletons />}

          {status === 'error' && (
            <div className="courses-message">
              <h3>We could not load the courses</h3>
              <p>
                Something went wrong on our side. The rest of the site still works while
                we sort it out.
              </p>
              <Button variant="secondary" onClick={loadCourses}>
                Try again
              </Button>
            </div>
          )}

          {status === 'ready' && filteredCourses.length === 0 && (
            <div className="courses-message">
              <h3>Nothing in {selectedCategory} yet</h3>
              <p>
                We have not published a course in this category so far. Everything else is
                still there.
              </p>
              <Button variant="secondary" onClick={() => setSelectedCategory('All')}>
                Show all courses
              </Button>
            </div>
          )}

          {status === 'ready' && filteredCourses.length > 0 && (
            <div className="courses-grid">
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  eyebrow={course.category}
                  title={course.title}
                  to={`/courses/${course.id}`}
                  footer={
                    <div className="card-footer-content">
                      <span className="price">{course.price}</span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => openSignup(course.id)}
                      >
                        Enroll
                      </Button>
                    </div>
                  }
                >
                  <p className="instructor-info">
                    {course.instructor}, <span>{course.role}</span>
                  </p>
                  <div className="course-details">
                    <span>
                      {course.rating} out of 5 ({course.reviews} reviews)
                    </span>
                    <span>{course.duration}</span>
                    <span>{course.level}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* EXPLORE MORE COURSES ACTION */}
        <div className="explore-more-container">
          <Button to="/courses" variant="secondary" size="lg">
            Explore all courses
          </Button>
        </div>
      </section>

      {/* CERTIFICATIONS / PARTNERS TRUST ROW */}
      <section className="certifications-section">
        <div className="container">
          <p className="certifications-title">
            Our courses prepare you for certifications from
          </p>
          <ul className="certifications-logos">
            {partnerLogos.map((logo) => (
              <li key={logo.alt}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={`cert-logo ${logo.wide ? 'cert-logo-large' : ''}`}
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
          {/*
            These are other companies' trademarks. we must say that to keep the section honest,
            because none of them really endorse this student prototype 
          */}
          <p className="certifications-note">
            All logos are trademarks of their respective owners and are shown to name the
            certifications our courses cover. No endorsement is implied.
          </p>
        </div>
      </section>
    </div>
  );
}

/** Placeholder cards shown while the catalogue is loading. */
function CourseSkeletons() {
  return (
    <div className="courses-grid">
      {[0, 1, 2].map((key) => (
        <div key={key} className="course-skeleton" aria-hidden="true">
          <span className="course-skeleton__line course-skeleton__line--short" />
          <span className="course-skeleton__line course-skeleton__line--title" />
          <span className="course-skeleton__line" />
          <span className="course-skeleton__line course-skeleton__line--short" />
          <span className="course-skeleton__footer" />
        </div>
      ))}
      <p className="visually-hidden">Loading courses</p>
    </div>
  );
}
