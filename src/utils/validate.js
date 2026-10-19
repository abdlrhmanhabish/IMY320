export function cleanEmail(value) {
  return String(value ?? '').trim().toLowerCase();
}

export function emailProblem(value, emptyMessage = 'Enter your email address.') {
  const email = String(value ?? '').trim();

  if (!email){ 
    return emptyMessage;
  }
  if (/\s/.test(email)){ 
    return 'An email address cannot have spaces in it.';
  }

  const atIndex = email.indexOf('@');
  if (atIndex === -1){ 
    return 'The email looks incomplete. Check for a missing @';
  }
  if (email.indexOf('@', atIndex + 1) !== -1){ 
    return 'An email address must only have one @.';
  }
  if (atIndex === 0){ 
    return 'Add the handle before the @, like name@example.com.';
  }

  const domain = email.slice(atIndex + 1);

  if (!domain){ 
    return 'Add the part after the @, like gmail.com.';
  }
  if (domain.startsWith('.') || !/\.[^.]{2,}$/.test(domain)) {
    return 'The part after the @ looks incomplete. It should look like gmail.com.';
  }
  return '';
}