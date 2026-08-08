import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import './NotFound.css';

//this is a 404 page to be placholder for pgaes still to come
export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container container--narrow">
        <p className="not-found__code">404</p>
        <h1 className="not-found__heading">We cannot find that page</h1>
        <p className="not-found__lead">The link may be out of date, or the page may not be built yet. Neither is yourfault. Here is what is ready today.</p>

        <div className="not-found__actions">
          <Button to="/about" size="lg">
            Read about us
          </Button>
        </div>

        <nav className="not-found__links" aria-label="Pages that are ready">
          <h2 className="not-found__links-heading">Or try one of these</h2>
          <ul>
            <li>
              <Link to="/about#story">Our story</Link>
            </li>
            <li>
              <Link to="/about#team">Leadership</Link>
            </li>
            <li>
              <Link to="/about#learners">Learner stories</Link>
            </li>
            <li>
              <Link to="/about#more">More about us</Link>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}