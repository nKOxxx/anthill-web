import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ email: 'demo@anthill.com', role: 'admin' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // DEMO MODE: Auto-set dummy token
    const demoToken = 'demo-token-for-testing';
    localStorage.setItem('token', demoToken);
    api.setToken(demoToken);
  }, []);

  const fetchUser = async () => {
    try {
      const data = await api.request('/auth/me');
      setUser(data.user);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email) => {
    return api.login(email);
  };

  const verifyMagicLink = async (token) => {
    const data = await api.verifyMagicLink(token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    verifyMagicLink,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;
