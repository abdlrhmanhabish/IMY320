import { useEffect, useId, useRef, useState } from 'react';
import Button from '../ui/Button.jsx';
import useFocusTrap from '../../hooks/useFocusTrap.js';
import useAuth from '../../hooks/useAuth.js';
import { site } from '../../config/site.js';
import './AuthModal.css';


export default function AuthModal({ mode = 'login', onClose, onModeChange, enrollTitle }) {
  const panelRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [confirmed, setConfirmed] = useState(null);
  const isSignup = mode === 'signup';
  const titleId = useId();
  const leadId = useId();

  useFocusTrap(panelRef, true, onClose);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className="auth-modal">
      <button
        type="button"
        className="auth-modal__scrim"
        onClick={onClose}
        tabIndex={-1}
        aria-hidden="true"
      />

      <section
        ref={panelRef}
        className={`auth-modal__dialog ${isSignup ? 'auth-modal__dialog--signup' : 'auth-modal__dialog--login'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={leadId}
      >
        <button type="button" className="auth-modal__close" onClick={onClose} aria-label="Close dialog">
          <CloseIcon />
        </button>

        <aside className={`auth-modal__promo ${isSignup ? 'auth-modal__promo--signup' : 'auth-modal__promo--login'}`}>
          <div className="auth-modal__promo-copy">
            {isSignup ? (
              <>
                <p className="auth-modal__eyebrow">Create your account</p>
                <h2 id={titleId} className="auth-modal__headline">
                  Join millions of learners and start today.
                </h2>
                <p id={leadId} className="auth-modal__lede">
                  Build a profile, save your progress, and enroll faster from any device.
                </p>
              </>
            ) : (
              <>
                <p className="auth-modal__eyebrow">Welcome back!</p>
                <h2 id={titleId} className="auth-modal__headline">
                  Continue your learning journey with {site.name}.
                </h2>
                <p id={leadId} className="auth-modal__lede">
                  Pick up where you left off and access your saved courses in one place.
                </p>
              </>
            )}
          </div>

          <AuthIllustration mode={mode} />
        </aside>

        <div className="auth-modal__content">
          {confirmed ? (
            <AuthConfirmation
              user={confirmed.user}
              wasSignup={confirmed.wasSignup}
              enrollTitle={enrollTitle}
              onDone={onClose}
            />
          ) : isSignup ? (
            <SignupForm
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              email={email}
              setEmail={setEmail}
              onSuccess={(user) => setConfirmed({ user, wasSignup: true })}
              onSwitchMode={() => onModeChange('login')}
            />
          ) : (
            <LoginForm
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              email={email}
              setEmail={setEmail}
              onSuccess={(user) => setConfirmed({ user, wasSignup: false })}
              onSwitchMode={() => onModeChange('signup')}
            />
          )}
        </div>
      </section>
    </div>
  );
}

function AuthConfirmation({ user, wasSignup, enrollTitle, onDone }) {
  const doneRef = useRef(null);

  useEffect(() => {
    doneRef.current?.focus();
  }, []);

  return (
    <div className="auth-confirm" role="status">
      <span className="auth-confirm__badge" aria-hidden="true">
        <CheckIcon />
      </span>

      <h3 ref={doneRef} tabIndex={-1} className="auth-confirm__heading">
        {wasSignup ? 'Your account is ready' : `Welcome back, ${user.name}`}
      </h3>

      <p className="auth-confirm__body">
        {wasSignup ? (
          <>
            We created an account for <strong>{user.email}</strong> and signed you in.
          </>
        ) : (
          <>
            You are signed in as <strong>{user.email}</strong>.
          </>
        )}
      </p>

      {enrollTitle && (
        <p className="auth-confirm__enroll">
          You are enrolled in <strong>{enrollTitle}</strong>. It is now in your learning
          list.
        </p>
      )}

      <Button variant="primary" size="lg" fullWidth onClick={onDone}>
        Start learning
      </Button>
    </div>
  );
}

const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { id: 'number', label: 'One number', test: (v) => /\d/.test(v) },
  { id: 'upper', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { id: 'special', label: 'One special character', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

function SignupForm({
  showPassword,
  setShowPassword,
  email,
  setEmail,
  onSuccess,
  onSwitchMode,
}) {
  const { register, status, error, resetError } = useAuth();
  const [values, setValues] = useState({ firstName: '', lastName: '', password: '' });
  const [touched, setTouched] = useState({});
  const isLoading = status === 'loading';

  const fieldErrors = {
    firstName: values.firstName.trim() ? '' : 'Enter your first name.',
    lastName: values.lastName.trim() ? '' : 'Enter your last name.',
    email: !email.trim()
      ? 'Enter your email address.'
      : isEmail(email)
        ? ''
        : 'That address is missing an @ or a domain.',
    password: PASSWORD_RULES.every((rule) => rule.test(values.password))
      ? ''
      : 'Your password does not meet all four requirements yet.',
  };

  const change = (field) => (event) => {
    resetError();
    if (field === 'email') setEmail(event.target.value);
    else setValues((current) => ({ ...current, [field]: event.target.value }));
  };

  const blur = (field) => () => setTouched((current) => ({ ...current, [field]: true }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ firstName: true, lastName: true, email: true, password: true });

    if (Object.values(fieldErrors).some(Boolean)) return;

    try {
      const user = await register({ ...values, email });
      onSuccess(user);
    } catch {
    }
  };

  return (
    <form className="auth-modal__form" onSubmit={handleSubmit} noValidate>
      <div className="auth-modal__form-head">
        <h3>Sign up for free</h3>
      </div>

      <div className="auth-modal__name-grid">
        <TextField
          label="First name"
          placeholder="Enter first name"
          autoComplete="given-name"
          icon={<UserIcon />}
          value={values.firstName}
          onChange={change('firstName')}
          onBlur={blur('firstName')}
          error={touched.firstName ? fieldErrors.firstName : ''}
        />
        <TextField
          label="Last name"
          placeholder="Enter last name"
          autoComplete="family-name"
          icon={<UserIcon />}
          value={values.lastName}
          onChange={change('lastName')}
          onBlur={blur('lastName')}
          error={touched.lastName ? fieldErrors.lastName : ''}
        />
      </div>

      <TextField
        label="Email address"
        type="email"
        placeholder="Enter your email"
        autoComplete="email"
        icon={<MailIcon />}
        value={email}
        onChange={change('email')}
        onBlur={blur('email')}
        error={touched.email ? fieldErrors.email : ''}
      />

      <PasswordField
        label="Password"
        placeholder="Create a password"
        autoComplete="new-password"
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        icon={<LockIcon />}
        value={values.password}
        onChange={change('password')}
        onBlur={blur('password')}
      />

      <ul className="auth-modal__rules" aria-label="Password requirements">
        {PASSWORD_RULES.map((rule) => {
          const met = rule.test(values.password);
          return (
            <li
              key={rule.id}
              className={met ? 'auth-modal__rule--met' : undefined}
              data-met={met ? 'true' : 'false'}
            >
              {rule.label}
              <span className="visually-hidden">{met ? ', met' : ', not met yet'}</span>
            </li>
          );
        })}
      </ul>

      <FormError message={error} />

      <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}>
        {isLoading ? 'Creating account' : 'Create account'}
      </Button>

      <Divider />

      <ProviderButtons />

      <p className="auth-modal__switchline">
        Already have an account?{' '}
        <button type="button" className="auth-modal__switch" onClick={onSwitchMode}>
          Log in
        </button>
      </p>
    </form>
  );
}

function LoginForm({
  showPassword,
  setShowPassword,
  email,
  setEmail,
  onSuccess,
  onSwitchMode,
}) {
  const { login, status, error, resetError } = useAuth();
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({});
  const [notice, setNotice] = useState('');
  const isLoading = status === 'loading';

  const fieldErrors = {
    email: !email.trim()
      ? 'Enter your email address.'
      : isEmail(email)
        ? ''
        : 'That address is missing an @ or a domain.',
    password: password ? '' : 'Enter your password.'
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ email: true, password: true });

    if (Object.values(fieldErrors).some(Boolean)) return;

    try {
      const user = await login({ email, password });
      onSuccess(user);
    } catch {
    }
  };

  return (
    <form className="auth-modal__form" onSubmit={handleSubmit} noValidate>
      <div className="auth-modal__form-head">
        <h3>Log in to your account</h3>
      </div>

      <TextField
        label="Email address"
        type="email"
        placeholder="Enter your email"
        autoComplete="email"
        icon={<MailIcon />}
        value={email}
        onChange={(event) => {
          resetError();
          setEmail(event.target.value);
        }}
        onBlur={() => setTouched((c) => ({ ...c, email: true }))}
        error={touched.email ? fieldErrors.email : ''}
      />

      <PasswordField
        label="Password"
        placeholder="Enter your password"
        autoComplete="current-password"
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        icon={<LockIcon />}
        value={password}
        onChange={(event) => {
          resetError();
          setPassword(event.target.value);
        }}
        onBlur={() => setTouched((c) => ({ ...c, password: true }))}
        error={touched.password ? fieldErrors.password : ''}
      />

      <div className="auth-modal__login-row">
        <label className="auth-modal__remember">
          <input type="checkbox" defaultChecked />
          <span>Remember me</span>
        </label>

        <button
          type="button"
          className="auth-modal__switch"
          onClick={() =>
            setNotice(
              isEmail(email)
                ? `If ${email.trim()} has an account, a reset link is on its way.`
                : 'Enter your email address above first, then select this again.',
            )
          }
        >
          Forgot password?
        </button>
      </div>

      {notice && (
        <p className="auth-modal__notice" role="status">
          {notice}
        </p>
      )}

      <FormError message={error} />

      <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}>
        {isLoading ? 'Logging in' : 'Log in'}
      </Button>

      <Divider />

      <ProviderButtons />

      <p className="auth-modal__switchline">
        Don&apos;t have an account?{' '}
        <button type="button" className="auth-modal__switch" onClick={onSwitchMode}>
          Sign up
        </button>
      </p>
    </form>
  );
}


function FormError({ message }) {
  if (!message) return null;

  return (
    <p className="auth-modal__error" role="alert">
      {message}
    </p>
  );
}

function ProviderButtons() {
  const [notice, setNotice] = useState('');

  const providers = [
    { name: 'Google', icon: <GoogleIcon /> },
    { name: 'Microsoft', icon: <MicrosoftIcon /> },
    { name: 'Apple', icon: <AppleIcon /> }
  ];

  return (
    <>
      <div className="auth-modal__providers">
        {providers.map((provider) => (
          <Button
            key={provider.name}
            variant="secondary"
            fullWidth
            className="auth-modal__provider"
            iconLeft={provider.icon}
            onClick={() =>
              setNotice(
                `${provider.name} sign in is not connected in this prototype. Use the email form above.`,
              )
            }
          >
            Continue with {provider.name}
          </Button>
        ))}
      </div>

      {notice && (
        <p className="auth-modal__notice" role="status">
          {notice}
        </p>
      )}
    </>
  );
}

function TextField({
  label,
  icon,
  type = 'text',
  placeholder,
  autoComplete,
  value,
  onChange,
  onBlur,
  error,
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="auth-field">
      <label className="auth-field__label" htmlFor={id}>
        {label}
      </label>

      <div className="auth-field__control">
        <span className="auth-field__icon" aria-hidden="true">
          {icon}
        </span>

        <input
          id={id}
          className={`auth-field__input ${error ? 'auth-field__input--error' : ''}`}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
        />
      </div>

      <p id={errorId} className="auth-field__error" aria-live="polite">{error}</p>
    </div>
  );
}

function PasswordField({
  label,
  icon,
  placeholder,
  autoComplete,
  showPassword,
  setShowPassword,
  value,
  onChange,
  onBlur,
  error
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="auth-field">
      <label className="auth-field__label" htmlFor={id}>
        {label}
      </label>

      <div className="auth-field__control auth-field__control--password">
        <span className="auth-field__icon" aria-hidden="true">
          {icon}
        </span>

        <input
          id={id}
          className={`auth-field__input auth-field__input--password ${
            error ? 'auth-field__input--error' : ''
          }`}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
        />

        <button
          type="button"
          className="auth-field__reveal"
          onClick={() => setShowPassword((current) => !current)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      <p id={errorId} className="auth-field__error" aria-live="polite">
        {error}
      </p>
    </div>
  );
}

function Divider() {
  return (
    <div className="auth-modal__divider" aria-hidden="true">
      <span>or continue with</span>
    </div>
  );
}

function AuthIllustration({ mode }) {
  const isSignup = mode === 'signup';

  return (
    <svg
      className="auth-modal__art"
      viewBox="0 0 360 280"
      role="img"
      aria-label={isSignup ? 'Illustration for account creation' : 'Illustration for returning users'}
    >
      <defs>
        <linearGradient id="auth-glow" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="100%" stopColor="#eff6ff" />
        </linearGradient>
        <linearGradient id="auth-book" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>

      <ellipse cx="180" cy="230" rx="120" ry="28" fill="rgba(37,99,235,0.08)" />
      <circle cx="280" cy="78" r="44" fill="rgba(37,99,235,0.08)" />
      <circle cx="90" cy="214" r="22" fill="rgba(37,99,235,0.08)" />

      <rect x="78" y="154" width="150" height="78" rx="14" fill="#1e40af" transform="rotate(-8 78 154)" />
      <rect x="92" y="164" width="144" height="72" rx="12" fill="url(#auth-glow)" transform="rotate(-8 92 164)" />
      <rect x="108" y="178" width="64" height="58" rx="8" fill="#ffffff" transform="rotate(-8 108 178)" />
      <circle cx="140" cy="202" r="16" fill="#bfdbfe" transform="rotate(-8 140 202)" />
      <path
        d="M112 189h48M112 199h48M112 209h36"
        stroke="#93c5fd"
        strokeWidth="4"
        strokeLinecap="round"
        transform="rotate(-8 112 189)"
      />

      <rect x="182" y="118" width="66" height="100" rx="12" fill="url(#auth-book)" transform="rotate(12 182 118)" />
      <rect x="194" y="108" width="58" height="94" rx="10" fill="#1d4ed8" transform="rotate(12 194 108)" />
      <rect x="208" y="98" width="54" height="84" rx="10" fill="#2563eb" transform="rotate(12 208 98)" />

      <rect x="254" y="170" width="36" height="54" rx="8" fill="#93c5fd" />
      <rect x="258" y="132" width="28" height="44" rx="8" fill="#dbeafe" />
      <path d="M266 132c0-18 20-18 20 0" fill="none" stroke="#1d4ed8" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M274 152l12 0"
        stroke="#1d4ed8"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <path
        d="M68 220c12-34 42-52 80-52 23 0 44 7 61 21"
        fill="none"
        stroke="#bfdbfe"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M60 220c12-34 42-52 80-52 23 0 44 7 61 21"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M300 74h16M308 66v16"
        stroke="#1d4ed8"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {isSignup ? (
        <circle cx="64" cy="66" r="20" fill="#dbeafe" />
      ) : (
        <path
          d="M58 66l16-10 16 10-16 10-16-10z"
          fill="#dbeafe"
        />
      )}
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false">
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M5 19c1.8-3.2 4.6-5 7-5s5.2 1.8 7 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
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

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d="M3 3l18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M2 12s3.6-7 10-7c1.8 0 3.5.4 5 1.1M22 12s-3.6 7-10 7c-1.8 0-3.5-.4-5-1.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path d="M21.6 12.3c0-.7-.1-1.4-.2-2H12v3.8h5.5c-.2 1.2-.9 2.2-1.9 2.9v2.4h3c1.8-1.7 3-4.2 3-7.1z" fill="#4285F4" />
      <path d="M12 22c2.5 0 4.6-.8 6.2-2.2l-3-2.4c-.8.5-1.8.8-3.2.8-2.4 0-4.4-1.6-5.1-3.9H3.8v2.4C5.4 19.6 8.5 22 12 22z" fill="#34A853" />
      <path d="M6.9 14.3c-.2-.7-.4-1.4-.4-2.3s.2-1.6.4-2.3V7.3H3.8C3.2 8.5 2.8 10 2.8 12s.4 3.5 1 4.7l3.1-2.4z" fill="#FBBC05" />
      <path d="M12 6.1c1.4 0 2.7.5 3.7 1.4l2.8-2.8C16.6 3.3 14.5 2.5 12 2.5 8.5 2.5 5.4 4.9 3.8 8.3l3.1 2.4C7.6 7.7 9.6 6.1 12 6.1z" fill="#EA4335" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="8" height="8" fill="#f25022" />
      <rect x="13" y="3" width="8" height="8" fill="#7fba00" />
      <rect x="3" y="13" width="8" height="8" fill="#00a4ef" />
      <rect x="13" y="13" width="8" height="8" fill="#ffb900" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d="M16.3 13.1c0-2.2 1.8-3.3 1.9-3.4-1-.9-2.6-1-3.1-1.1-1.3-.1-2.5.8-3.1.8-.6 0-1.7-.8-2.8-.8-1.5 0-2.9.9-3.7 2.3-1.6 2.8-.4 6.9 1.1 9.2.8 1.1 1.7 2.4 2.9 2.4 1.1 0 1.5-.7 2.9-.7 1.4 0 1.8.7 3 0 1.2-.7 2-1.8 2.7-3-.2-.1-2.9-1.1-2.9-4.7z"
        fill="currentColor"
      />
      <path
        d="M14.8 4.9c.7-.9 1.1-2.1 1-3.3-1 .1-2.2.6-3 1.4-.7.8-1.2 2-1 3.2 1.1.1 2.2-.5 3-1.3z"
        fill="currentColor"
      />
    </svg>
  );
}