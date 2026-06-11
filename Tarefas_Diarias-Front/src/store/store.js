import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/auth';

// ─── Auth Context ────────────────────────────────────────────────────────────

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());

  useEffect(() => {
    const syncUser = () => setUser(authService.getCurrentUser());
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  const login = useCallback(async (email, senha) => {
    const loggedUser = await authService.login({ email, senha });
    setUser(loggedUser);
    return loggedUser;
  }, []);

  const register = useCallback(async (payload) => {
    const created = await authService.register(payload);
    setUser(created);
    return created;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext deve ser usado dentro de <AuthProvider>');
  return ctx;
};

// Re-export for convenience
export { AuthContext };
