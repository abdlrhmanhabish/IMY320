import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Celebration from '../components/ui/Celebration.jsx';
import { coursePhoto } from '../config/photos.js';
import useAuth from '../hooks/useAuth.js';
import useCart from '../hooks/useCart.js';
import useProgress from '../hooks/useProgress.js';
import { placeOrder } from '../utils/fakeApi.js';
import { formatRand } from '../utils/money.js';
import './Checkout.css';

// shown while the payment is in flight
const WAITING_LINES = [
  'Learners who finish their first lesson on day one are far more likely to finish the course.',
  'Short sessions beat long ones. Twenty minutes a day builds a skill faster than a weekend binge.',
  'Every course here was built by somebody doing the job right now.',
];

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
const onlyDigits = (value) => value.replace(/\D/g, '');

function formatCardNumber(value) {
  return onlyDigits(value).slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value) {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, total, subtotal, saving, clear } = useCart();
  const { enrol } = useProgress();

  const [stage, setStage] = useState('form');
  const [order, setOrder] = useState(null);
  const [failure, setFailure] = useState('');
  const [celebrating, setCelebrating] = useState(false);
  const [waitingLine] = useState(
    () => WAITING_LINES[Math.floor(Math.random() * WAITING_LINES.length)],
  );

  const [values, setValues] = useState({
    email: user?.email ?? '',
    name: user?.name ?? '',
    card: '',
    expiry: '',
    cvc: '',
  });
  const [touched, setTouched] = useState({});

  // paying empties the cart. For tht reason the receipt needs its own copy of what was bought or it would render against an empty list
  const purchased = useRef([]);

  const fieldErrors = {
    email: !values.email.trim()
      ? 'Enter the email your course access should go to.'
      : isEmail(values.email)
        ? ''
        : 'That address is missing an @ or a domain.',
    name: values.name.trim() ? '' : 'Enter the name on the card.',
    card:
      onlyDigits(values.card).length === 16 ? '' : 'Enter the 16 digits on the front of the card.',
    expiry: /^\d{2}\/\d{2}$/.test(values.expiry) ? '' : 'Use the MM/YY format.',
    cvc: onlyDigits(values.cvc).length >= 3 ? '' : 'Enter the 3 digits on the back.',
  };

  useEffect(() => {
    if (items.length === 0 && stage === 'form') {
      navigate('/cart', { replace: true });
    }
  }, [items.length, stage, navigate]);

  const change = (field) => (event) => {
    const raw = event.target.value;
    const next =
      field === 'card'
        ? formatCardNumber(raw)
        : field === 'expiry'
          ? formatExpiry(raw)
          : field === 'cvc'
            ? onlyDigits(raw).slice(0, 4)
            : raw;

    setFailure('');
    setValues((current) => ({ ...current, [field]: next }));
  };

  const blur = (field) => () => setTouched((current) => ({ ...current, [field]: true }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ email: true, name: true, card: true, expiry: true, cvc: true });

    if (Object.values(fieldErrors).some(Boolean)) return;

    purchased.current = items;
    setStage('paying');
    setFailure('');

    try {
      const placed = await placeOrder({ items, total, saving, card: values.card });

      enrol(items);
      clear();
      setOrder(placed);
      setStage('done');
      setCelebrating(true);
    } catch (caught) {
      setFailure(caught.message);
      setStage('form');
    }
  };

  if (stage === 'paying') {
    return (
      <section className="checkout__waiting" aria-live="polite">
        <div className="container container--narrow">
          <span className="checkout__waiting-ring" aria-hidden="true" />
          <h1 className="checkout__waiting-title">Confirming your payment</h1>
          <p className="checkout__waiting-line">{waitingLine}</p>
          <p className="checkout__waiting-note">Do not close this tab.</p>
        </div>
      </section>
    );
  }

  if (stage === 'done' && order) {
    const bought = purchased.current;
    const first = bought[0];

    return (
      <>
        <Celebration
          open={celebrating}
          eyebrow="Payment complete"
          image={first ? coursePhoto(first.id)?.large : undefined}
          title="You are in. Time to learn."
          stat={`${bought.length} ${bought.length === 1 ? 'course' : 'courses'} unlocked`}
          statLabel={
            order.saving > 0
              ? `You saved ${formatRand(order.saving)} on this order`
              : 'Lifetime access, including every future update'
          }
          body="Everything you bought is now in your learning list, ready from lesson one."
          primaryAction={
            first
              ? { label: `Start ${first.title}`, to: `/learn/${first.id}` }
              : { label: 'Go to my learning', to: '/learning' }
          }
          secondaryAction={{ label: 'View my learning list', to: '/learning' }}
          onClose={() => setCelebrating(false)}
        />

        <section className="section">
          <div className="container container--narrow checkout__receipt">
            <span className="checkout__receipt-mark" aria-hidden="true">
              <TickIcon />
            </span>

            <h1>Order {order.reference}</h1>
            <p className="checkout__receipt-lead">
              A copy of this receipt is on its way to {values.email}.
            </p>

            <ul className="checkout__receipt-list">
              {bought.map((course) => (
                <li key={course.id}>
                  <span>{course.title}</span>
                  <span>{course.price}</span>
                </li>
              ))}
            </ul>

            <p className="checkout__receipt-total">
              <span>Paid</span>
              <span>{formatRand(order.total)}</span>
            </p>

            <div className="checkout__receipt-actions">
              <Button to="/learning" variant="primary" size="lg">
                Go to my learning
              </Button>
              <Button to="/courses" variant="secondary">
                Keep browsing
              </Button>
            </div>

            <p className="checkout__guarantee">
              Changed your mind? Full refund within 14 days, no questions asked.
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <section className="section">
      <div className="container checkout__layout">
        <div className="checkout__main">
          <nav className="checkout__crumbs" aria-label="Breadcrumb">
            <Link to="/cart">Cart</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Payment</span>
          </nav>

          <h1 className="checkout__title">Payment</h1>
          <p className="checkout__lead">
            One step. Your courses unlock the moment this goes through.
          </p>

          <form className="checkout__form" onSubmit={handleSubmit} noValidate>
            <fieldset className="checkout__fieldset">
              <legend>Where should access go?</legend>

              <Field
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={change('email')}
                onBlur={blur('email')}
                error={touched.email ? fieldErrors.email : ''}
              />
            </fieldset>

            <fieldset className="checkout__fieldset">
              <legend>Card details</legend>

              <Field
                label="Name on card"
                autoComplete="cc-name"
                placeholder="As printed on the card"
                value={values.name}
                onChange={change('name')}
                onBlur={blur('name')}
                error={touched.name ? fieldErrors.name : ''}
              />

              <Field
                label="Card number"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="4242 4242 4242 4242"
                value={values.card}
                onChange={change('card')}
                onBlur={blur('card')}
                error={touched.card ? fieldErrors.card : ''}
                hint="Any 16 digits work here. A number ending in 0000 is declined on purpose."
              />

              <div className="checkout__pair">
                <Field
                  label="Expiry"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  value={values.expiry}
                  onChange={change('expiry')}
                  onBlur={blur('expiry')}
                  error={touched.expiry ? fieldErrors.expiry : ''}
                />

                <Field
                  label="CVC"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="123"
                  value={values.cvc}
                  onChange={change('cvc')}
                  onBlur={blur('cvc')}
                  error={touched.cvc ? fieldErrors.cvc : ''}
                />
              </div>
            </fieldset>

            {failure && (
              <p className="checkout__failure" role="alert">
                {failure}
              </p>
            )}

            {/* the amount sits on the button itself. nobody should have to look somewhere else to know what they are about to be charged */}
            <Button type="submit" variant="primary" size="lg" fullWidth>
              Pay {formatRand(total)}
            </Button>

            <p className="checkout__secure">
              <LockIcon />
              This is a prototype. No card is stored and no money moves.
            </p>
          </form>
        </div>

        <aside className="checkout__summary" aria-labelledby="checkout-summary-heading">
          <h2 id="checkout-summary-heading">Order summary</h2>

          <ul className="checkout__summary-list">
            {items.map((course) => (
              <li key={course.id}>
                <span>{course.title}</span>
                <span>{course.price}</span>
              </li>
            ))}
          </ul>

          <dl className="checkout__summary-totals">
            {saving > 0 && (
              <>
                <div>
                  <dt>Full price</dt>
                  <dd className="checkout__struck">{formatRand(subtotal)}</dd>
                </div>
                <div className="checkout__saving">
                  <dt>You save</dt>
                  <dd>{formatRand(saving)}</dd>
                </div>
              </>
            )}
            <div className="checkout__grand">
              <dt>Total</dt>
              <dd>{formatRand(total)}</dd>
            </div>
          </dl>

          <p className="checkout__guarantee">
            <ShieldIcon />
            Full refund within 14 days, no questions asked.
          </p>
        </aside>
      </div>
    </section>
  );
}

function Field({ label, hint, error, ...rest }) {
  const id = `checkout-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`;

  return (
    <div className="checkout__field">
      <label htmlFor={id}>{label}</label>

      {hint && (
        <p className="checkout__hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}

      <input
        id={id}
        className={error ? 'checkout__input checkout__input--error' : 'checkout__input'}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={hint ? `${id}-hint` : undefined}
        {...rest}
      />

      <p className="checkout__error" aria-live="polite">
        {error}
      </p>
    </div>
  );
}

function TickIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10V8a4 4 0 0 1 8 0v2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}