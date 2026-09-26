import { Link } from 'react-router-dom';
import { formatRand, discountPercent, isOnSale } from '../utils/money.js';
import PageHeader from '../components/layout/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import useCart from '../hooks/useCart.js';
import useToast from '../hooks/useToast.js';
import './Cart.css';

export default function Cart() {
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
        <PageHeader
          eyebrow="Cart"
          title="Your cart is empty"
          lead="Courses you add will wait here until you are ready to check out."
          backTo="/courses"
          backLabel="Back to courses"
        />

        <section className="section">
          <div className="container container--narrow cart__empty">
            <p>
              Nothing here yet. The catalogue has short, practical courses across data, finance, development and management.
            </p>
            <Button to="/courses" variant="primary" size="lg">
              Browse the catalogue
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Cart"
        title={`${items.length} ${items.length === 1 ? 'course' : 'courses'} in your cart`}
        lead="Check the list, then continue to payment. Nothing is charged until the last step."
        backTo="/courses"
        backLabel="Back to courses"
      />

      <section className="section">
        <div className="container cart__layout">
          <div>
            <ul className="cart__list">
              {items.map((course) => (
                <li key={course.id} className="cart__row" data-category={course.category}>
                  <div className="cart__row-main">
                    <span className="cart__tag">{course.category}</span>

                    <h2 className="cart__row-title">
                      <Link to={`/courses/${course.id}`}>{course.title}</Link>
                    </h2>

                    <p className="cart__row-meta">
                      {course.instructor}, {course.duration}, {course.level}
                    </p>

                    <button
                      type="button"
                      className="cart__remove"
                      onClick={() => removeItem(course)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="cart__row-price">
                    <p className="cart__price-now">{course.price}</p>

                    {isOnSale(course) && (
                      <>
                        <p className="cart__price-was">{course.listPrice}</p>
                        <p className="cart__price-off">{discountPercent(course)}% off</p>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
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
              Continue to payment
            </Button>

            <p className="cart__reassure">You will not be charged yet.</p>

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