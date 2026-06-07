import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '../types';
import { getCurrentUser, setCurrentUser } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (email: string, name: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({ success: false, message: '' }),
  register: async () => ({ success: false, message: '' }),
  logout: () => {},
});

import { login as storageLogin, registerUser as storageRegister } from '../utils/storage';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getCurrentUser);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 600));
    const result = storageLogin(email, password);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  }, []);

  const register = useCallback(async (email: string, name: string, password: string) => {
    await new Promise(r => setTimeout(r, 600));
    return storageRegister(email, name, password);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
