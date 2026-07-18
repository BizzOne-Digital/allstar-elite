import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ae_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user: u } = res.data;
    localStorage.setItem('ae_token', token);
    localStorage.setItem('ae_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    const { token, user: u } = res.data;
    localStorage.setItem('ae_token', token);
    localStorage.setItem('ae_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('ae_token');
    localStorage.removeItem('ae_user');
    setUser(null);
  };

  const updateUser = (u) => {
    localStorage.setItem('ae_user', JSON.stringify(u));
    setUser(u);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
