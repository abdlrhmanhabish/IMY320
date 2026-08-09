//this is basically our backend

const DEFAULT_MIN_DELAY = 600;
const DEFAULT_MAX_DELAY = 900;
const FAILURE_MODE_KEY = 'skillup:force-api-failure';

function delay(min = DEFAULT_MIN_DELAY, max = DEFAULT_MAX_DELAY) {
  const ms = min + Math.random() * (max - min);
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function isFailureModeOn() {
  try {
    return window.localStorage.getItem(FAILURE_MODE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function forceApiFailure(on = true) {
  try {
    window.localStorage.setItem(FAILURE_MODE_KEY, String(Boolean(on)));
  } catch {
  }
  return isFailureModeOn();
}

if (typeof window !== 'undefined') {
  window.forceApiFailure = forceApiFailure;
}

export async function respondWith(value, { min, max } = {}) {
  await delay(min, max);
  if (isFailureModeOn()) {
    throw new Error('The server did not respond. Check your connection and try again.');
  }
  return value;
}

export async function respondWithError(message = 'Something went wrong on our side.') {
  await delay();
  throw new Error(message);
}

export async function sendContactMessage({ name, email, topic, message }) {
  await delay();

  if (isFailureModeOn()) {
    throw new Error('We could not reach the message service. Please try again.');
  }

  if (email.toLowerCase().endsWith('@example.com')) {
    throw new Error(
      'We could not deliver to that address. Use an address you can receive replies on.',
    );
  }

  const reference = `SU-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  try {
    const existing = JSON.parse(window.localStorage.getItem('skillup:messages') ?? '[]');
    existing.push({ reference, name, email, topic, message, sentAt: new Date().toISOString() });
    window.localStorage.setItem('skillup:messages', JSON.stringify(existing));
  } catch {
  }

  return { reference, receivedAt: new Date().toISOString() };
}