import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken = decodeToken(token);
      setUser(decodedToken);
      setRole(getUserRole(decodedToken));
      console.log('decodedToken:', decodedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const decodeToken = (token) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  };

  const getUserRole = (decodedToken) => {
    const roleKey = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    return decodedToken?.[roleKey] || null;
  };

  const login = async (userData) => {
    try {
      const result = await authService.login(userData);
      const { accessToken, refreshToken } = result.token;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      const decodedToken = decodeToken(accessToken);
      setUser(decodedToken);
      setRole(getUserRole(decodedToken));
      setIsAuthenticated(true);
      
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
