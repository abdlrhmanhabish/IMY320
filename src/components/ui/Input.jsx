import { useId } from 'react';
import './Input.css';

export default function Input({
  label,
  hint,
  error,
  required = false,
  multiline = false,
  rows = 5,
  id,
  className = '',
  ...rest
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const describedBy = [hint ? hintId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ');

  const Element = multiline ? 'textarea' : 'input';

  return (
    <div className={['input', className].filter(Boolean).join(' ')}>
      <label className="input__label" htmlFor={inputId}>
        {label}
        {required && (
          <span className="input__required">
            <span aria-hidden="true">*</span>
            <span className="visually-hidden">required</span>
          </span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="input__hint">
          {hint}
        </p>
      )}

      <Element
        id={inputId}
        className={`input__control ${error ? 'input__control--error' : ''}`}
        required={required}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy || undefined}
        rows={multiline ? rows : undefined}
        {...rest}
      />

      <p id={errorId} className="input__error" aria-live="polite">
        {error}
      </p>
    </div>
  );
}