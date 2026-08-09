//this is basically our backend

import courses from '../data/courses.json';

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

export async function getCourses() {
  return respondWith(courses);
}

const SESSION_KEY = 'skillup:session';

export function readSession() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(user) {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    // the storage can be unavailable in private browsing so using a session is a convenienc e
  }
}

export function clearSession() {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
  }
}


 // if you are a marker just use email locked@skillup.example to test filed login. 
 // cause any other email with a long password scuceeds
 
export async function login({ email, password }) {
  await delay();

  if (isFailureModeOn()) {
    throw new Error('We could not reach the sign in service. Please try again.');
  }

  if (email.trim().toLowerCase() === 'locked@skillup.example') {
    throw new Error('That account is locked. Reset your password to unlock it.');
  }

  if (password.length < 8) {
    throw new Error('That email and password do not match an account.');
  }

  const user = { email: email.trim(), name: email.trim().split('@')[0] };
  writeSession(user);
  return user;
}

// creates an account. An address already in use is rejected. 
export async function register({ firstName, lastName, email, password }) {
  await delay();

  if (isFailureModeOn()) {
    throw new Error('We could not reach the sign up service. Please try again.');
  }

  if (email.trim().toLowerCase() === 'taken@skillup.example') {
    throw new Error('An account already uses that email. Log in instead.');
  }

  if (password.length < 8) {
    throw new Error('Pick a password that meets all four requirements.');
  }

  const user = { email: email.trim(), name: `${firstName} ${lastName}`.trim() };
  writeSession(user);
  return user;
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