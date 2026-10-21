// carts and progress belong to an account

const PREFIX = 'skillup';

export const GUEST = 'guest';
export function ownerOf(user) {
  return user?.email ? user.email.trim().toLowerCase() : GUEST;
}

function keyFor(name, owner) {
  return `${PREFIX}:${name}:${owner}`;
}

export function readSaved(name, owner, fallback) {
  try {
    const raw = window.localStorage.getItem(keyFor(name, owner));
    return raw ? JSON.parse(raw) : fallback;
  } 
  catch {
    return fallback;
  }
}

export function writeSaved(name, owner, value) {
  try {
    window.localStorage.setItem(keyFor(name, owner), JSON.stringify(value));
  } 
  catch {
    // private browsers may block writes, the data only lasts until the tab closes
  }
}

export function removeSaved(name, owner) {
  try {
    window.localStorage.removeItem(keyFor(name, owner));
  } 
  catch {
  }
}

const LAST_EMAIL = `${PREFIX}:last-email`;

// the log in form fills in the address used last time (only when "Remember me" was ticked)
export function readLastEmail() {
  try {
    return window.localStorage.getItem(LAST_EMAIL) ?? '';
  } 
  catch {
    return '';
  }
}

export function rememberEmail(email) {
  try {
    if (email){ 
      window.localStorage.setItem(LAST_EMAIL, email);
    }
    else { 
      window.localStorage.removeItem(LAST_EMAIL);
    }
  } 
  catch {
  }
}

export function moveSharedData(name) {
  try {
    const raw = window.localStorage.getItem(`${PREFIX}:${name}`);
    if (raw === null){ 
      return;
    }
    window.localStorage.removeItem(`${PREFIX}:${name}`);
    if (window.localStorage.getItem(keyFor(name, GUEST)) === null) {
      window.localStorage.setItem(keyFor(name, GUEST), raw);
    }
  } 
  catch {
  }
}