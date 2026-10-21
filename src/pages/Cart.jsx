import { Link } from 'react-router-dom';
import { formatRand, discountPercent, isOnSale } from '../utils/money.js';
import PageHeader from '../components/layout/PageHeader.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import CourseImage from '../components/ui/CourseImage.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import LevelTag from '../components/ui/LevelTag.jsx';
import { EmptyCartArt } from '../components/ui/SpotArt.jsx';
import StepBar from '../components/ui/StepBar.jsx';
import useAuth from '../hooks/useAuth.js';
import useCart from '../hooks/useCart.js';
import useToast from '../hooks/useToast.js';
import './Cart.css';

export default function Cart() {
  const { user } = useAuth();
  const { items, subtotal, total, saving, remove } = useCart();
  const { notify } = useToast();

  const removeItem = (course) => {
    remove(course.id);
    notify({
      tone: 'info',
      title: 'Removed from cart',
      body: course.title,
    });
  };

  if (items.length === 0) {
    return (
      <>
        <PageHeader title="Your cart" backTo="/courses" backLabel="Back to courses" />

        <section className="section section--tight">
          <div className="container container--narrow">
            <EmptyState
              art={<EmptyCartArt />}
              title="Your cart is empty"
              body="Courses you add wait here until you are ready to pay. The catalogue has short, practical courses in data, finance, development and management."
            >
              <Button to="/courses" variant="primary" size="lg">
                Browse the catalogue
              </Button>
            </EmptyState>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Your cart"
        lead={`${items.length} ${items.length === 1 ? 'course' : 'courses'}. Nothing is charged until the payment step.`}
        backTo="/courses"
        backLabel="Back to courses"
      />

      <section className="section section--tight">
        <div className="container cart__layout">
          <div className="cart__main">
            <StepBar current={0} signedIn={Boolean(user)} />

            <ul className="cart__list">
              {items.map((course) => (
                <li key={course.id} className="cart__row" data-category={course.category}>
                  <Link to={`/courses/${course.id}`} className="cart__thumb" tabIndex={-1} aria-hidden="true">
                    <CourseImage course={course} decorative sizes="9rem" />
                  </Link>

                  <div className="cart__row-main">
                    <div className="cart__tags">
                      <Badge category={course.category} />
                      <LevelTag level={course.level} />
                    </div>

                    <h2 className="cart__row-title">
                      <Link to={`/courses/${course.id}`}>{course.title}</Link>
                    </h2>

                    <p className="cart__row-meta">
                      {course.instructor}, {course.duration}
                    </p>
                  </div>

                  <div className="cart__row-side">
                    <p className="cart__price">
                      <span className="cart__price-now">{course.price}</span>
                      {isOnSale(course) && (
                        <>
                          <span className="visually-hidden">, was </span>
                          <s className="cart__price-was">{course.listPrice}</s>
                          <span className="cart__price-off">{discountPercent(course)}% off</span>
                        </>
                      )}
                    </p>

                    <button type="button" className="cart__remove" onClick={() => removeItem(course)}>
                      <TrashIcon />
                      Remove
                      <span className="visually-hidden"> {course.title}</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <Link to="/courses" className="text-link cart__more">
              Add another course
            </Link>
          </div>

          <aside className="cart__summary" aria-labelledby="cart-summary-heading">
            <h2 id="cart-summary-heading" className="cart__summary-heading">
              Order summary
            </h2>

            <dl className="cart__totals">
              {saving > 0 && (
                <>
                  <div>
                    <dt>Full price</dt>
                    <dd className="cart__struck">{formatRand(subtotal)}</dd>
                  </div>

                  {/* Using rand amounts is better here. a percentage alone is harder to feel than an amount */}
                  <div className="cart__saving-row">
                    <dt>You save</dt>
                    <dd>{formatRand(saving)}</dd>
                  </div>
                </>
              )}

              <div className="cart__total-row">
                <dt>Total</dt>
                <dd>{formatRand(total)}</dd>
              </div>
            </dl>

            <Button to="/checkout" variant="primary" size="lg" fullWidth>
              {user ? 'Continue to payment' : 'Continue to sign in'}
            </Button>

            <p className="cart__reassure">
              {user
                ? 'You will not be charged yet.'
                : 'You sign in before you pay. Your cart stays as it is.'}
            </p>

            <ul className="cart__promises">
              <li>
                <TickIcon />
                Full refund within 14 days
              </li>
              <li>
                <TickIcon />
                Lifetime access, including updates
              </li>
              <li>
                <TickIcon />
                Certificate on completion
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}

function TickIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        d="M20 6L9 17l-5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}