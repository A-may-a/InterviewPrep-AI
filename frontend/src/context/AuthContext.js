// frontend/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      authAPI.getCurrentUser()
        .then(res => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('authToken');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (email, password, name) => {
    try {
      setError(null);
      const res = await authAPI.register(email, password, name);
      localStorage.setItem('authToken', res.data.access_token);
      // The backend now returns a user object in the response
      const userData = res.data.user || { email, name };
      setUser(userData);
      return userData;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await authAPI.login(email, password);
      localStorage.setItem('authToken', res.data.access_token);
      // The backend now returns a user object in the response
      const userData = res.data.user || { email };
      setUser(userData);
      return userData;
    } catch (err) {
      const msg = err.response?.data?.detail || 'Login failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
