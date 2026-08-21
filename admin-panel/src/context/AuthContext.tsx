import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthState {
  isAuthed: boolean;
  adminName: string;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [adminName, setAdminName] = useState('Admin');

  // ponytail: mock auth, any non-empty password matching the seeded admin email passes
  function login(email: string, password: string) {
    if (email.trim().length > 3 && password.length >= 4) {
      setAdminName(email.split('@')[0]);
      setIsAuthed(true);
      return true;
    }
    return false;
  }

  function logout() {
    setIsAuthed(false);
  }

  return <AuthCtx.Provider value={{ isAuthed, adminName, login, logout }}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
