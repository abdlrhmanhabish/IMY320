import courses from '../data/courses.json';

const DEFAULT_MIN_DELAY = 600;
const DEFAULT_MAX_DELAY = 900;

function delay(min = DEFAULT_MIN_DELAY, max = DEFAULT_MAX_DELAY) {
  const ms = min + Math.random() * (max - min);
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function respondWith(value, { min, max } = {}) {
  await delay(min, max);
  return value;
}

export async function getCourses() {
  return respondWith(courses);
}

// an unknown id resolves to null and the page can tell "no such course" apart from "the request failed"
export async function getCourseById(id) {
  const course = courses.find((item) => String(item.id) === String(id));
  return respondWith(course ?? null, { min: 350, max: 650 });
}

const SESSION_KEY = 'skillup:session';
const ACCOUNTS_KEY = 'skillup:accounts';

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
    // without storage the session only lasts until the tab closes
  }
}

export function clearSession() {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
  }
}

function readAccounts() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(ACCOUNTS_KEY) ?? '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } 
  catch {
    return {};
  }
}

function saveAccount(email, name) {
  try {
    const accounts = readAccounts();
    accounts[email] = { name };
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } 
  catch {}
}

// an email like khalid.ahmed@company.co.za appears as Khalid Ahmed on the certificate
function nameFromEmail(email) {
  return email.split('@')[0].split(/[._-]+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

export async function login({ email, password }) {
  await delay();

  const address = email.trim().toLowerCase();

  if (address === 'locked@skillup.example') {
    throw new Error('That account is locked. Reset your password to unlock it.');
  }

  if (password.length < 8) {
    throw new Error('That email and password do not match an account.');
  }

  const known = readAccounts()[address];
  const user = { email: address, name: known?.name || nameFromEmail(address) || address };
  writeSession(user);
  return user;
}

export async function register({ firstName, lastName, email, password }) {
  await delay();

  const address = email.trim().toLowerCase();
  const taken = address === 'taken@skillup.example' || Boolean(readAccounts()[address]);

  if (taken) {
    throw new Error('An account already uses that email. Log in instead.');
  }

  if (password.length < 8) {
    throw new Error('Pick a password that meets all four requirements.');
  }

  const user = { email: address, name: `${firstName.trim()} ${lastName.trim()}`.trim() };
  saveAccount(address, user.name);
  writeSession(user);
  return user;
}

const ORDERS_KEY = 'skillup:orders';

function readOrders() {
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function placeOrder({ items, total, saving, card, email }) {
  await delay(1400, 2000);

  if (String(card ?? '').replace(/\s/g, '').endsWith('0000')) {
    throw new Error('Your bank declined that card. Try another card or use a different method.');
  }

  const order = {
    reference: `SU-${Date.now().toString(36).toUpperCase().slice(-6)}`,
    placedAt: new Date().toISOString(),
    account: email,
    items: items.map((item) => ({ id: item.id, title: item.title, price: item.price })),
    total,
    saving,
  };

  try {
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...readOrders()]));
  } catch {
  }

  return order;
}