import PageHeader from '../components/layout/PageHeader.jsx';
import { credits, photographyCredits } from '../config/credits.js';
import './Credits.css';

export default function Credits() {
  return (
    <>
      <PageHeader
        title="Credits"
        lead="The libraries, photos and drawings this site is built from, and the people who made them."
      />

      <div className="section section--tight">
        <div className="container">
          <div className="credits">
            <section className="credits__section" aria-labelledby="credits-built">
              <h2 id="credits-built" className="credits__heading">
                Built with
              </h2>

              <ul className="credits__list">
                {credits.map((credit) => (
                  <li key={credit.name} className="credits__row">
                    <a className="credits__name" href={credit.url} target="_blank" rel="noopener noreferrer">
                      {credit.name}
                    </a>
                    <div>
                      <p className="credits__purpose">{credit.purpose}</p>
                      <p className="credits__licence">Licence: {credit.licence}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="credits__section" aria-labelledby="credits-photos">
              <h2 id="credits-photos" className="credits__heading">
                Photography
              </h2>
              <p className="credits__intro">
                All photos were sourced through Wikimedia Commons. Photos under CC BY were cropped and resized
                to fit the layout.
              </p>

              <ul className="credits__list">
                {photographyCredits.map((photo) => (
                  <li key={photo.url} className="credits__row">
                    <a className="credits__name" href={photo.url} target="_blank" rel="noopener noreferrer">
                      {photo.usedFor}
                    </a>
                    <p className="credits__purpose">
                      Photo by {photo.author},{' '}
                      <a href={photo.licenceUrl} target="_blank" rel="noopener noreferrer">
                        {photo.licence}
                      </a>
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="credits__section" aria-labelledby="credits-content">
              <h2 id="credits-content" className="credits__heading">
                About the content
              </h2>
              <p className="credits__intro">
                Team profiles, instructors, employee figures and learner testimonials on this site are fictional
                examples made for this prototype. They do not describe real people or real outcomes.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}