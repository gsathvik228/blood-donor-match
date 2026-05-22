import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('bdm_token');
    const savedUser = localStorage.getItem('bdm_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (newToken, donor) => {
    setToken(newToken);
    setUser(donor);
    localStorage.setItem('bdm_token', newToken);
    localStorage.setItem('bdm_user', JSON.stringify(donor));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('bdm_token');
    localStorage.removeItem('bdm_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
