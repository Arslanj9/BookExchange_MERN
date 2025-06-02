import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!token && !!user);

  // Add token validation
  const validateToken = async () => {
    if (!token) return false;
    try {
      const response = await fetch('http://localhost:3000/api/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Token validation failed');
      }

      const data = await response.json();
      return data.valid;
    } catch (error) {
      console.error('Token validation error:', error);
      logout(); // Clear invalid authentication state
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (token && user) {
        const isValid = await validateToken();
        setIsAuthenticated(isValid);
      } else {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, [token, user]);

  useEffect(() => {
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [token, user]);

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    token,
    user,
    isAuthenticated,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}