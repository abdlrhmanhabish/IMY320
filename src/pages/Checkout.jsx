import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginForm, SignupForm } from '../components/auth/AuthModal.jsx';
import Button from '../components/ui/Button.jsx';
import Celebration from '../components/ui/Celebration.jsx';
import CourseImage from '../components/ui/CourseImage.jsx';
import Input from '../components/ui/Input.jsx';
import StepBar from '../components/ui/StepBar.jsx';
import useAuth from '../hooks/useAuth.js';
import useCart from '../hooks/useCart.js';
import useProgress from '../hooks/useProgress.js';
import useToast from '../hooks/useToast.js';
import { placeOrder } from '../utils/fakeApi.js';
import { formatRand } from '../utils/money.js';
import { readLastEmail } from '../utils/storage.js';
import { emailProblem } from '../utils/validate.js';
import './Checkout.css';

// shown while the payment is in flight
const WAITING_LINES = [
  'Learners who finish their first lesson on day one are far more likely to finish the course.',
  'Short sessions beat long ones. Twenty minutes a day builds a skill faster than a weekend binge.',
  'Every course here was built by somebody doing the job right now.',
];

const onlyDigits = (value) => value.replace(/\D/g, '');

function formatCardNumber(value) {
  return onlyDigits(value).slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value) {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function cardProblem(value) {
  const digits = onlyDigits(value).length;
  if (digits === 0){ 
    return 'Enter the 16 digits on the front of the card.';
  }
  if (digits < 16){ 
    return `That is ${digits} ${digits === 1 ? 'digit' : 'digits'}. A card number has 16.`;
  }
  return '';
}

function expiryProblem(value) {
  if (!value) return 'Enter the expiry date, like 08/28.';

  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return 'Use the MM/YY format, like 08/28.';

  const month = Number(match[1]);
  if (month < 1 || month > 12) return 'The month must be between 01 and 12.';

  const now = new Date();
  const firstDayAfter = new Date(2000 + Number(match[2]), month, 1);
  if (firstDayAfter <= new Date(now.getFullYear(), now.getMonth(), 1)) {
    return 'That card has expired. Check the date or use another card.';
  }

  return '';
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, total, subtotal, saving, clear } = useCart();
  const { enrol, enrolled } = useProgress();

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
  const [filledFor, setFilledFor] = useState(user?.email ?? null);

  // somebody who signs in on this page still gets their details filled in
  if (user && filledFor !== user.email) {
    setFilledFor(user.email);
    setValues((current) => ({
      ...current,
      email: current.email || user.email,
      name: current.name || user.name,
    }));
  }

  // paying empties the cart. For tht reason the receipt needs its own copy of what was bought or it would render against an empty list
  const purchased = useRef([]);
  const ownedBefore = useRef(0);

  useEffect(() => {
    if (items.length === 0 && stage === 'form') {
      navigate('/cart', { replace: true });
    }
  }, [items.length, stage, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [user, stage]);

  const fieldErrors = {
    email: emailProblem(values.email, 'Enter the email your receipt should go to.'),
    name: values.name.trim() ? '' : 'Enter the name as it is printed on the card.',
    card: cardProblem(values.card),
    expiry: expiryProblem(values.expiry),
    cvc: onlyDigits(values.cvc).length >= 3 ? '' : 'Enter the 3 digits on the back of the card.',
  };

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

  // an empty field waits for the pay button before it shows a message
  const blur = (field) => (event) => {
    if (event.target.value.trim()) setTouched((current) => ({ ...current, [field]: true }));
  };
  const errorFor = (field) => (touched[field] ? fieldErrors[field] : '');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ email: true, name: true, card: true, expiry: true, cvc: true });

    if (!user) return;

    const firstProblem = Object.keys(fieldErrors).find((field) => fieldErrors[field]);
    if (firstProblem) {
      document.getElementById(`checkout-${firstProblem}`)?.focus();
      return;
    }

    purchased.current = items;
    ownedBefore.current = enrolled.length;
    setStage('paying');
    setFailure('');

    try {
      const placed = await placeOrder({ items, total, saving, card: values.card, email: user.email });

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
          <p className="checkout__waiting-note">This takes a few seconds. Please keep this tab open.</p>
        </div>
      </section>
    );
  }

  if (stage === 'done' && order) {
    const bought = purchased.current;
    const first = bought[0];
    const ownedNow = ownedBefore.current + bought.length;
    const startTo = first ? `/learn/${first.id}` : '/learning';

    return (
      <>
        <Celebration
          open={celebrating}
          eyebrow="Payment complete"
          title="You are in. Time to learn."
          stat={`${bought.length} ${bought.length === 1 ? 'course' : 'courses'} unlocked`}
          statLabel={
            order.saving > 0
              ? `You saved ${formatRand(order.saving)} on this order`
              : 'Lifetime access, including every future update'
          }
          primaryAction={{ label: 'Start learning', to: startTo, icon: <ArrowIcon /> }}
          secondaryAction={{ label: 'View my learning list', to: '/learning' }}
          onClose={() => setCelebrating(false)}
        >
          <MovingIn courses={bought} ownedNow={ownedNow} />
        </Celebration>

        <section className="section section--tight">
          <div className="container container--narrow checkout__done">
            <StepBar current={3} signedIn complete />

            <div className="checkout__done-head">
              <span className="checkout__done-mark" aria-hidden="true">
                <TickIcon />
              </span>
              <h1 className="checkout__done-title">You are enrolled</h1>
              <p className="checkout__done-lead">
                Order {order.reference}. A receipt is on its way to {values.email}.
              </p>
            </div>

            <div className="checkout__done-card">
              <ul className="checkout__done-list">
                {bought.map((course) => (
                  <li key={course.id} className="checkout__done-item">
                    <span className="checkout__done-thumb">
                      <CourseImage course={course} decorative sizes="6rem" />
                    </span>
                    <span className="checkout__done-text">
                      <span className="checkout__done-name">{course.title}</span>
                      <span className="checkout__done-meta">
                        {course.instructor}, {course.duration}
                      </span>
                    </span>
                    <span className="checkout__done-price">{course.price}</span>
                  </li>
                ))}
              </ul>

              <p className="checkout__done-total">
                <span>Paid</span>
                <span>{formatRand(order.total)}</span>
              </p>
            </div>

            <div className="checkout__done-actions">
              <Button to={startTo} variant="primary" size="lg" iconRight={<ArrowIcon />}>
                Start learning
              </Button>
              <Button to="/learning" variant="secondary" size="lg">
                Go to my learning
              </Button>
            </div>

            {first && bought.length > 1 && (
              <p className="checkout__done-note">
                Start learning opens {first.title}. The other courses are waiting in My learning.
              </p>
            )}

            <p className="checkout__guarantee checkout__guarantee--center">
              <ShieldIcon />
              Changed your mind? Full refund within 14 days, no questions asked.
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <section className="section section--tight">
      <div className="container checkout__layout">
        <div className="checkout__main">
          <Link to="/cart" className="checkout__back">
            <BackIcon />
            Back to cart
          </Link>

          <StepBar current={user ? 2 : 1} signedIn={Boolean(user)} />

          {/* on a phone the summary sits folded at the top*/}
          <details className="checkout__mobile-summary">
            <summary>
              <span>Order summary</span>
              <span className="checkout__mobile-total">
                {items.length} {items.length === 1 ? 'course' : 'courses'}, {formatRand(total)}
                <ChevronIcon />
              </span>
            </summary>
            <OrderLines items={items} subtotal={subtotal} saving={saving} total={total} />
          </details>

          {user ? (
            <>
              <h1 className="checkout__title">Payment</h1>
              <p className="checkout__lead">
                Signed in as <strong>{user.email}</strong>. Your courses unlock the moment this goes through.
              </p>

              <form className="checkout__form" onSubmit={handleSubmit} noValidate>
                <fieldset className="checkout__group">
                  <legend className="checkout__legend">Receipt</legend>

                  <Input
                    id="checkout-email"
                    label="Email address"
                    hint="We send the receipt here."
                    type="email"
                    inputMode="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={change('email')}
                    onBlur={blur('email')}
                    error={errorFor('email')}
                    valid={!fieldErrors.email}
                  />
                </fieldset>

                <fieldset className="checkout__group">
                  <legend className="checkout__legend">Card details</legend>

                  <Input
                    id="checkout-name"
                    label="Name on card"
                    autoComplete="cc-name"
                    placeholder="As printed on the card"
                    value={values.name}
                    onChange={change('name')}
                    onBlur={blur('name')}
                    error={errorFor('name')}
                    valid={!fieldErrors.name}
                  />

                  <Input
                    id="checkout-card"
                    label="Card number"
                    hint="Any 16 digits work in this prototype."
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="1234 5678 9012 3456"
                    icon={<CardIcon />}
                    value={values.card}
                    onChange={change('card')}
                    onBlur={blur('card')}
                    error={errorFor('card')}
                    valid={!fieldErrors.card}
                  />

                  <div className="checkout__pair">
                    <Input
                      id="checkout-expiry"
                      label="Expiry date"
                      hint="Month and year"
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      value={values.expiry}
                      onChange={change('expiry')}
                      onBlur={blur('expiry')}
                      error={errorFor('expiry')}
                      valid={!fieldErrors.expiry}
                    />

                    <Input
                      id="checkout-cvc"
                      label="Security code"
                      hint="3 digits on the back"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="123"
                      value={values.cvc}
                      onChange={change('cvc')}
                      onBlur={blur('cvc')}
                      error={errorFor('cvc')}
                      valid={!fieldErrors.cvc}
                    />
                  </div>
                </fieldset>

                {failure && (
                  <p className="checkout__failure" role="alert">
                    {failure}
                  </p>
                )}

                {/* the last thing read before paying says exactly what happens next */}
                <p className="checkout__confirm">
                  You pay <strong>{formatRand(total)}</strong> once for {items.length}{' '}
                  {items.length === 1 ? 'course' : 'courses'}. They unlock in My learning straight after.
                </p>

                {/* the amount sits on the button itself. nobody should have to look somewhere else to know what they are about to be charged */}
                <Button type="submit" variant="primary" size="lg" fullWidth iconLeft={<LockIcon />}>
                  Pay {formatRand(total)}
                </Button>

                <p className="checkout__secure">This is a prototype, so no money moves.</p>
              </form>
            </>
          ) : (
            <SignInStep />
          )}
        </div>

        <aside className="checkout__summary" aria-labelledby="checkout-summary-heading">
          <div className="checkout__summary-core">
            <h2 id="checkout-summary-heading">Order summary</h2>
            <OrderLines items={items} subtotal={subtotal} saving={saving} total={total} />
          </div>

          <div className="checkout__safety">
            <span className="checkout__safety-icon" aria-hidden="true">
              <LockIcon />
            </span>
            <div>
              <p className="checkout__safety-title">Safe checkout</p>
              <p className="checkout__safety-text">
                You pay while signed in and the courses go straight to your account. Card details
                are used for this order only and are never saved.
              </p>
            </div>
          </div>

          <p className="checkout__guarantee">
            <ShieldIcon />
            Full refund within 14 days, no questions asked.
          </p>
        </aside>
      </div>
    </section>
  );
}

function OrderLines({ items, subtotal, saving, total }) {
  return (
    <>
      <ul className="checkout__summary-list">
        {items.map((course) => (
          <li key={course.id}>
            <span className="checkout__summary-thumb">
              <CourseImage course={course} decorative sizes="4rem" />
            </span>
            <span className="checkout__summary-name">{course.title}</span>
            <span className="checkout__summary-price">{course.price}</span>
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
    </>
  );
}

// the account step sits inside checkout
function SignInStep() {
  const { notify } = useToast();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState(readLastEmail);
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef(null);
  const shownMode = useRef(mode);

  useEffect(() => {
    if (shownMode.current === mode) return;
    shownMode.current = mode;
    formRef.current?.querySelector('input')?.focus();
  }, [mode]);

  const signedIn = (user) => {
    notify({
      tone: 'success',
      title: `Signed in as ${user.name}`,
      body: 'Your cart came with you. One step left before your courses unlock.',
    });
  };

  return (
    <>
      <h1 className="checkout__title">Sign in to continue</h1>
      <p className="checkout__lead">
        Your courses are saved to your account, so we ask you to sign in before you pay. Your cart
        stays exactly as it is.
      </p>

      <div ref={formRef} className="checkout__signin">
        {mode === 'login' ? (
          <LoginForm
            heading="Log in to your account"
            submitLabel="Log in and continue"
            email={email}
            setEmail={setEmail}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            onSuccess={signedIn}
            onSwitchMode={() => setMode('signup')}
          />
        ) : (
          <SignupForm
            heading="Create your account"
            submitLabel="Create account and continue"
            email={email}
            setEmail={setEmail}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            onSuccess={signedIn}
            onSwitchMode={() => setMode('login')}
          />
        )}
      </div>
    </>
  );
}

// the new courses slide into the learning list
function MovingIn({ courses, ownedNow }) {
  return (
    <div className="checkout__moving">
      <p className="checkout__moving-head">
        <span>My learning</span>
        <span className="checkout__moving-count">
          {ownedNow} {ownedNow === 1 ? 'course' : 'courses'}
        </span>
      </p>

      <ul className="checkout__moving-list">
        {courses.map((course, index) => (
          <li
            key={course.id}
            className="checkout__moving-item"
            data-category={course.category}
            style={{ '--order': index }}
          >
            <span className="checkout__moving-thumb">
              <CourseImage course={course} decorative sizes="4.5rem" />
            </span>
            <span className="checkout__moving-title">{course.title}</span>
            <span className="checkout__moving-tag">Added</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        d="M15 18l-6-6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg className="checkout__chevron" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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

function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <rect x="3" y="5.5" width="18" height="13" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M3 10h18M7 15h3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
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