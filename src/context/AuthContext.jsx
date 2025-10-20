import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { loginRequest, logoutRequest } from '../api/auth.js';

export const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = 'mobinhost-erp-token';
const USER_STORAGE_KEY = 'mobinhost-erp-user';

export function AuthProvider({ children }) {
  const getStoredToken = () => (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null);
  const [token, setToken] = useState(getStoredToken);
  const getStoredUser = () => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  };
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { token: newToken, user: userProfile } = await loginRequest(credentials);
      setToken(newToken);
      setUser(userProfile);
      return { token: newToken, user: userProfile };
    } catch (err) {
      setError(err.message || 'Unable to login');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await logoutRequest();
    } catch (err) {
      // swallow request errors to ensure UI state resets
    } finally {
      setToken(null);
      setUser(null);
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      loading,
      error,
      isAuthenticated: Boolean(token)
    }),
    [token, user, login, logout, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
