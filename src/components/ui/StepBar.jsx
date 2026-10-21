import './StepBar.css';

// the way from a full cart to an unlocked course. signing in counts as done as soon as there is a session
export default function StepBar({ current, signedIn = false, complete = false }) {
  const steps = [
    { label: 'Cart' },
    { label: signedIn ? 'Signed in' : 'Sign in', done: signedIn },
    { label: 'Payment' },
    { label: 'Done' },
  ];

  return (
    <ol className="step-bar" aria-label="Steps to enrol">
      {steps.map((step, index) => {
        const done = complete || index < current || (step.done && index !== current);
        const state = done ? 'done' : index === current ? 'current' : 'next';

        return (
          <li
            key={step.label}
            className={`step-bar__step is-${state}`}
            aria-current={index === current ? 'step' : undefined}
          >
            <span className="step-bar__mark" aria-hidden="true">
              {done ? <TickIcon /> : index + 1}
            </span>
            <span className="step-bar__label">
              {step.label}
              {done && <span className="visually-hidden">, done</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function TickIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}