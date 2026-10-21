import { useEffect, useId, useRef, useState } from 'react';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import Modal from '../ui/Modal.jsx';
import useAuth from '../../hooks/useAuth.js';
import { site } from '../../config/site.js';
import { readLastEmail, rememberEmail } from '../../utils/storage.js';
import { emailProblem } from '../../utils/validate.js';
import './AuthModal.css';

export default function AuthModal({ mode = 'login', onClose, onModeChange, enrollTitle }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(() => (mode === 'login' ? readLastEmail() : ''));
  const [confirmed, setConfirmed] = useState(null);
  const isSignup = mode === 'signup';
  const titleId = useId();
  const contentRef = useRef(null);
  const shownMode = useRef(mode);

  useEffect(() => {
    if (shownMode.current === mode) return;
    shownMode.current = mode;
    contentRef.current?.querySelector('input')?.focus();
  }, [mode]);

  return (
    <Modal
      onClose={onClose}
      labelledBy={titleId}
      className="auth-modal"
      overlayClassName="modal--sheet"
      closeLabel="Close dialog"
    >
      <aside className="auth-modal__promo">
        <div className="auth-modal__promo-copy">
          {isSignup ? (
            <>
              <p className="auth-modal__eyebrow">Create your account</p>
              <p className="auth-modal__headline">Join 4,200 learners already building career skills.</p>
              <p className="auth-modal__lede">
                Save your progress, keep your certificates and enrol faster from any device.
              </p>
            </>
          ) : (
            <>
              <p className="auth-modal__eyebrow">Welcome back</p>
              <p className="auth-modal__headline">Continue your learning with {site.name}.</p>
              <p className="auth-modal__lede">
                Pick up where you left off. Your courses and certificates are waiting.
              </p>
            </>
          )}
        </div>

        <AuthIllustration mode={mode} />
      </aside>

      <div ref={contentRef} className="auth-modal__content">
        {confirmed ? (
          <AuthConfirmation
            headingId={titleId}
            user={confirmed.user}
            wasSignup={confirmed.wasSignup}
            enrollTitle={enrollTitle}
            onDone={onClose}
          />
        ) : isSignup ? (
          <SignupForm
            headingId={titleId}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            email={email}
            setEmail={setEmail}
            onSuccess={(user) => setConfirmed({ user, wasSignup: true })}
            onSwitchMode={() => onModeChange('login')}
          />
        ) : (
          <LoginForm
            headingId={titleId}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            email={email}
            setEmail={setEmail}
            onSuccess={(user) => setConfirmed({ user, wasSignup: false })}
            onSwitchMode={() => onModeChange('signup')}
          />
        )}
      </div>
    </Modal>
  );
}

function AuthConfirmation({ headingId, user, wasSignup, enrollTitle, onDone }) {
  const doneRef = useRef(null);

  useEffect(() => {
    doneRef.current?.focus();
  }, []);

  return (
    <div className="auth-confirm" role="status">
      <span className="auth-confirm__badge" aria-hidden="true">
        <span className="auth-confirm__ring" />
        <CheckIcon />
      </span>

      <h2 id={headingId} ref={doneRef} tabIndex={-1} className="auth-confirm__heading">
        {wasSignup ? 'Your account is ready' : `Welcome back, ${user.name}`}
      </h2>

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
          <strong>{enrollTitle}</strong> is waiting for you.
        </p>
      )}

      <Button variant="primary" size="lg" fullWidth onClick={onDone}>
        Start learning
      </Button>

      <button type="button" className="auth-confirm__stay" onClick={onDone}>
        Stay on this page
      </button>
    </div>
  );
}

const PASSWORD_RULES = [
  { id: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { id: 'number', label: 'One number', test: (v) => /\d/.test(v) },
  { id: 'upper', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { id: 'special', label: 'One special character', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export function SignupForm({
  showPassword,
  setShowPassword,
  email,
  setEmail,
  onSuccess,
  onSwitchMode,
  heading = 'Sign up for free',
  submitLabel = 'Create account',
  headingId,
  HeadingTag = 'h2',
}) {
  const { register, status, error, resetError } = useAuth();
  const [values, setValues] = useState({ firstName: '', lastName: '', password: '' });
  const [touched, setTouched] = useState({});
  const [attempts, setAttempts] = useState(0);
  const messageRef = useRef(null);
  const focusMessage = useRef(false);
  const isLoading = status === 'loading';

  useEffect(() => {
    resetError();
  }, [resetError]);

  useEffect(() => {
    if (focusMessage.current && messageRef.current) {
      focusMessage.current = false;
      messageRef.current.focus();
    }
  });

  const fieldErrors = {
    firstName: values.firstName.trim() ? '' : 'Enter your first name.',
    lastName: values.lastName.trim() ? '' : 'Enter your last name.',
    email: emailProblem(email),
    password: PASSWORD_RULES.every((rule) => rule.test(values.password))
      ? ''
      : 'Your password does not meet all four requirements yet.',
  };

  const labels = { firstName: 'first name', lastName: 'last name', email: 'email address', password: 'password' };
  const missing = Object.keys(fieldErrors).filter((field) => fieldErrors[field]);
  const summary = attempts > 0 && missing.length > 0
    ? `Check your ${joinWords(missing.map((field) => labels[field]))}.`
    : '';

  const change = (field) => (event) => {
    resetError();
    if (field === 'email') setEmail(event.target.value);
    else setValues((current) => ({ ...current, [field]: event.target.value }));
  };

  const blur = (field) => (event) => {
    if (event.target.value.trim()){ 
      setTouched((current) => ({ ...current, [field]: true }));
    }
  };
  const shows = (field) => touched[field] || attempts > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ firstName: true, lastName: true, email: true, password: true });
    setAttempts((count) => count + 1);

    if (missing.length > 0) {
      focusMessage.current = true;
      return;
    }

    try {
      const user = await register({ ...values, email });
      onSuccess(user);
    } catch {
      focusMessage.current = true;
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <HeadingTag id={headingId} className="auth-form__heading">
        {heading}
      </HeadingTag>

      <FormMessage ref={messageRef} message={error || summary} />

      <div className="auth-form__pair">
        <Input
          label="First name"
          placeholder="First name"
          autoComplete="given-name"
          icon={<UserIcon />}
          value={values.firstName}
          onChange={change('firstName')}
          onBlur={blur('firstName')}
          error={shows('firstName') ? fieldErrors.firstName : ''}
          valid={!fieldErrors.firstName}
        />
        <Input
          label="Last name"
          placeholder="Last name"
          autoComplete="family-name"
          icon={<UserIcon />}
          value={values.lastName}
          onChange={change('lastName')}
          onBlur={blur('lastName')}
          error={shows('lastName') ? fieldErrors.lastName : ''}
          valid={!fieldErrors.lastName}
        />
      </div>

      <Input
        label="Email address"
        type="email"
        inputMode="email"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="you@example.com"
        autoComplete="email"
        icon={<MailIcon />}
        value={email}
        onChange={change('email')}
        onBlur={blur('email')}
        error={shows('email') ? fieldErrors.email : ''}
        valid={!fieldErrors.email}
      />

      <PasswordInput
        label="Password"
        placeholder="Create a password"
        autoComplete="new-password"
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        value={values.password}
        onChange={change('password')}
        onBlur={blur('password')}
        error={shows('password') ? fieldErrors.password : ''}
      />

      <ul className="auth-form__rules" aria-label="Password requirements">
        {PASSWORD_RULES.map((rule) => {
          const met = rule.test(values.password);
          return (
            <li key={rule.id} className={met ? 'is-met' : undefined}>
              {rule.label}
              <span className="visually-hidden">{met ? ', met' : ', not met yet'}</span>
            </li>
          );
        })}
      </ul>

      <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}>
        {isLoading ? 'Creating account' : submitLabel}
      </Button>

      <Divider />

      <ProviderButtons />

      <p className="auth-form__switchline">
        Already have an account?{' '}
        <button type="button" className="auth-form__switch" onClick={onSwitchMode}>
          Log in
        </button>
      </p>
    </form>
  );
}

export function LoginForm({
  showPassword,
  setShowPassword,
  email,
  setEmail,
  onSuccess,
  onSwitchMode,
  heading = 'Log in to your account',
  submitLabel = 'Log in',
  headingId,
  HeadingTag = 'h2',
}) {
  const { login, status, error, resetError } = useAuth();
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({});
  const [attempts, setAttempts] = useState(0);
  const [notice, setNotice] = useState('');
  const [remember, setRemember] = useState(true);
  const [knownEmail] = useState(() => Boolean(email));
  const messageRef = useRef(null);
  const focusMessage = useRef(false);
  const isLoading = status === 'loading';

  useEffect(() => {
    resetError();
  }, [resetError]);

  useEffect(() => {
    if (focusMessage.current && messageRef.current) {
      focusMessage.current = false;
      messageRef.current.focus();
    }
  });

  const fieldErrors = {
    email: emailProblem(email),
    password: password ? '' : 'Enter your password.',
  };

  const labels = { email: 'email address', password: 'password' };
  const missing = Object.keys(fieldErrors).filter((field) => fieldErrors[field]);
  const summary = attempts > 0 && missing.length > 0
    ? `Check your ${joinWords(missing.map((field) => labels[field]))}.`
    : '';
  const shows = (field) => touched[field] || attempts > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ email: true, password: true });
    setAttempts((count) => count + 1);

    if (missing.length > 0) {
      focusMessage.current = true;
      return;
    }

    try {
      const user = await login({ email, password });
      rememberEmail(remember ? user.email : '');
      onSuccess(user);
    } catch {
      focusMessage.current = true;
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <HeadingTag id={headingId} className="auth-form__heading">
        {heading}
      </HeadingTag>

      <FormMessage ref={messageRef} message={error || summary} />

      {notice && (
        <p className="auth-form__notice" role="status">
          {notice}
        </p>
      )}

      <Input
        label="Email address"
        type="email"
        inputMode="email"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="you@example.com"
        autoComplete="email"
        icon={<MailIcon />}
        value={email}
        onChange={(event) => {
          resetError();
          setEmail(event.target.value);
        }}
        onBlur={(event) => {
          if (event.target.value.trim()){ 
            setTouched((current) => ({ ...current, email: true }));
          }
        }}
        error={shows('email') ? fieldErrors.email : ''}
        valid={!fieldErrors.email}
      />

      <PasswordInput
        label="Password"
        placeholder="Your password"
        autoComplete="current-password"
        data-autofocus={knownEmail || undefined}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        value={password}
        onChange={(event) => {
          resetError();
          setPassword(event.target.value);
        }}
        error={shows('password') ? fieldErrors.password : ''}
      />

      <div className="auth-form__row">
        <label className="auth-form__remember">
          <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />
          <span>Remember me</span>
        </label>

        <button
          type="button"
          className="auth-form__switch"
          onClick={() =>
            setNotice(
              emailProblem(email)
                ? 'Enter your email address above first, then select this again.'
                : `If ${email.trim()} has an account, a reset link is on its way.`,
            )
          }
        >
          Forgot password?
        </button>
      </div>

      <Button type="submit" variant="primary" size="lg" fullWidth loading={isLoading}>
        {isLoading ? 'Logging in' : submitLabel}
      </Button>

      <Divider />

      <ProviderButtons />

      <p className="auth-form__switchline">
        Don&apos;t have an account?{' '}
        <button type="button" className="auth-form__switch" onClick={onSwitchMode}>
          Sign up
        </button>
      </p>
    </form>
  );
}

function joinWords(words) {
  if (words.length < 2){ 
    return words.join('');
  }
  return `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`;
}

function FormMessage({ message, ref }) {
  if (!message) return null;

  return (
    <p ref={ref} className="auth-form__error" role="alert" tabIndex={-1}>
      <AlertIcon />
      {message}
    </p>
  );
}

function PasswordInput({ showPassword, setShowPassword, ...rest }) {
  return (
    <Input
      {...rest}
      type={showPassword ? 'text' : 'password'}
      icon={<LockIcon />}
      end={
        <button
          type="button"
          className="auth-form__reveal"
          onClick={() => setShowPassword((current) => !current)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-pressed={showPassword}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      }
    />
  );
}

function ProviderButtons() {
  const [notice, setNotice] = useState('');

  const providers = [
    { name: 'Google', icon: <GoogleIcon /> },
    { name: 'Microsoft', icon: <MicrosoftIcon /> },
    { name: 'Apple', icon: <AppleIcon /> },
  ];

  return (
    <>
      <div className="auth-form__providers">
        {providers.map((provider) => (
          <Button
            key={provider.name}
            variant="secondary"
            className="auth-form__provider"
            iconLeft={provider.icon}
            onClick={() =>
              setNotice(
                `${provider.name} sign in is not connected in this prototype. Use the email form above.`,
              )
            }
          >
            <span className="visually-hidden">Continue with </span>
            {provider.name}
          </Button>
        ))}
      </div>

      {notice && (
        <p className="auth-form__notice" role="status">
          {notice}
        </p>
      )}
    </>
  );
}

function Divider() {
  return (
    <div className="auth-form__divider" aria-hidden="true">
      <span>or continue with</span>
    </div>
  );
}

function AuthIllustration({ mode }) {
  const isSignup = mode === 'signup';

  return (
    <svg
      className="auth-modal__art auth-art"
      viewBox="0 0 360 280"
      role="img"
      aria-label={isSignup ? 'Illustration for account creation' : 'Illustration for returning users'}
    >
      <ellipse cx="180" cy="230" rx="120" ry="28" className="auth-art__blob" />
      <circle cx="280" cy="78" r="44" className="auth-art__blob" />
      <circle cx="90" cy="214" r="22" className="auth-art__blob" />

      <rect x="78" y="154" width="150" height="78" rx="14" className="auth-art__deep" transform="rotate(-8 78 154)" />
      <rect x="92" y="164" width="144" height="72" rx="12" className="auth-art__pale" transform="rotate(-8 92 164)" />
      <rect x="108" y="178" width="64" height="58" rx="8" className="auth-art__paper" transform="rotate(-8 108 178)" />
      <circle cx="140" cy="202" r="16" className="auth-art__soft" transform="rotate(-8 140 202)" />
      <path
        d="M112 189h48M112 199h48M112 209h36"
        className="auth-art__rule"
        strokeWidth="4"
        strokeLinecap="round"
        transform="rotate(-8 112 189)"
      />

      <rect x="182" y="118" width="66" height="100" rx="12" className="auth-art__mid" transform="rotate(12 182 118)" />
      <rect x="194" y="108" width="58" height="94" rx="10" className="auth-art__deep" transform="rotate(12 194 108)" />
      <rect x="208" y="98" width="54" height="84" rx="10" className="auth-art__accent" transform="rotate(12 208 98)" />

      <rect x="254" y="170" width="36" height="54" rx="8" className="auth-art__soft" />
      <rect x="258" y="132" width="28" height="44" rx="8" className="auth-art__pale" />
      <path d="M266 132c0-18 20-18 20 0" className="auth-art__line" strokeWidth="4" strokeLinecap="round" />
      <path d="M274 152l12 0" className="auth-art__line" strokeWidth="4" strokeLinecap="round" />

      <path
        d="M68 220c12-34 42-52 80-52 23 0 44 7 61 21"
        className="auth-art__track"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M60 220c12-34 42-52 80-52 23 0 44 7 61 21"
        className="auth-art__path"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M300 74h16M308 66v16" className="auth-art__line" strokeWidth="4" strokeLinecap="round" />

      {isSignup ? (
        <circle cx="64" cy="66" r="20" className="auth-art__pale" />
      ) : (
        <path d="M58 66l16-10 16 10-16 10-16-10z" className="auth-art__pale" />
      )}
    </svg>
  );
}

function CheckIcon({ size = 26 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
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

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7.5v5.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1.2" fill="currentColor" />
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