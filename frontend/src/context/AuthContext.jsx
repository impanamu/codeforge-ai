import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('codeforge_token') || null);
  const [loading, setLoading] = useState(true);
  const [selectedRepositoryId, setSelectedRepositoryId] = useState(() => {
    return localStorage.getItem('codeforge_active_repo') || null;
  });

  // Verify and fetch user when token changes or on initial mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
        } catch (error) {
          console.error('Failed to authenticate user session:', error);
          localStorage.removeItem('codeforge_token');
          setToken(null);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const selectRepo = (id) => {
    if (id) {
      localStorage.setItem('codeforge_active_repo', id);
      setSelectedRepositoryId(id);
    } else {
      localStorage.removeItem('codeforge_active_repo');
      setSelectedRepositoryId(null);
    }
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      const newToken = data.access_token;
      localStorage.setItem('codeforge_token', newToken);
      setToken(newToken);
      
      const userData = await authApi.getMe();
      setUser(userData);
      setLoading(false);
      return userData;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      await authApi.register(userData);
      // Auto login after registration
      const result = await login({ email: userData.email, password: userData.password });
      return result;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('codeforge_token');
    localStorage.removeItem('codeforge_active_repo');
    setToken(null);
    setUser(null);
    setSelectedRepositoryId(null);
  };

  // Called by OAuthCallbackPage after reading JWT from URL fragment
  const loginWithToken = (rawToken) => {
    localStorage.setItem('codeforge_token', rawToken);
    setToken(rawToken);  // triggers the useEffect above which fetches /users/me
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    selectedRepositoryId,
    selectRepo,
    login,
    register,
    logout,
    loginWithToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
