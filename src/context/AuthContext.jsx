import { useCallback, useMemo, useState } from 'react';
import { AuthContext } from './authContext.js';
import {
  clearSession,
  login as apiLogin,
  readSession,
  register as apiRegister,
} from '../utils/fakeApi.js';

// these are z simulatedd sessions

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSession());
  const [status, setStatus] = useState(() => (readSession() ? 'authenticated' : 'idle'));
  const [error, setError] = useState('');

  const run = useCallback(async (action, payload) => {
    setStatus('loading');
    setError('');

    try {
      const nextUser = await action(payload);
      setUser(nextUser);
      setStatus('authenticated');
      return nextUser;
    } catch (caught) {
      setError(caught.message);
      setStatus('error');
      throw caught;
    }
  }, []);

  const login = useCallback((payload) => run(apiLogin, payload), [run]);
  const register = useCallback((payload) => run(apiRegister, payload), [run]);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setStatus('idle');
    setError('');
  }, []);

  const resetError = useCallback(() => {
    setError('');
    setStatus((current) => (current === 'error' ? 'idle' : current));
  }, []);

  const value = useMemo(
    () => ({ user, status, error, login, register, logout, resetError }),
    [user, status, error, login, register, logout, resetError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}