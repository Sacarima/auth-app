import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const watchdog = setTimeout(() => { if (alive) setLoading(false); }, 5000);

    (async () => {
      try {
        const { user } = await api.me();  
        if (alive) setUser(user || null);
      } catch {
        if (alive) setUser(null);         
      } finally {
        if (alive) setLoading(false);
        clearTimeout(watchdog);
      }
    })();

    return () => { alive = false; clearTimeout(watchdog); };
  }, []);

  const login = async (email, password) => {
    const { user } = await api.login(email, password);
    setUser(user);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
