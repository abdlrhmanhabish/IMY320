import { useId } from 'react';
import './Input.css';

export default function Input({
  label,
  hint,
  error,
  valid = false,
  optional = false,
  icon,
  end,
  multiline = false,
  rows = 4,
  id,
  className = '',
  ...rest
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const Element = multiline ? 'textarea' : 'input';

  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ');
  const showTick = valid && !error && !end && String(rest.value ?? '').trim() !== '';

  const classes = ['input', error ? 'input--error' : '', showTick ? 'input--valid' : '', className]
    .filter(Boolean)
    .join(' ');

  const fieldClasses = [
    'input__field',
    icon ? 'input__field--icon' : '',
    end || showTick ? 'input__field--end' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <label className="input__label" htmlFor={inputId}>
        {label}
        {optional && <span className="input__optional">Optional</span>}
      </label>

      {hint && (
        <p id={hintId} className="input__hint">
          {hint}
        </p>
      )}

      <div className="input__control">
        {icon && (
          <span className="input__icon" aria-hidden="true">
            {icon}
          </span>
        )}

        <Element
          id={inputId}
          className={fieldClasses}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy || undefined}
          rows={multiline ? rows : undefined}
          {...rest}
        />

        {showTick && (
          <span className="input__tick" aria-hidden="true">
            <TickIcon />
          </span>
        )}

        {end && <span className="input__end">{end}</span>}
      </div>

      <p id={errorId} className="input__error" aria-live="polite">
        {error}
      </p>
    </div>
  );
}

function TickIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
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