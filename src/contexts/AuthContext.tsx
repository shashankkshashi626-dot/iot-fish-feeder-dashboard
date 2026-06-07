import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (email: string, name: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({ success: false, message: '' }),
  register: async () => ({ success: false, message: '' }),
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.full_name || '',
        password: '',
      });
    }
  });
}, []);
  const login = useCallback(async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  if (data.user) {
    setUser({
      id: data.user.id,
      email: data.user.email || '',
      name: data.user.user_metadata?.full_name || '',
      password: '',
    });
  }

  return { success: true, message: 'Welcome back!' };
}, []);

 const register = useCallback(async (email: string, name: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  console.log("SIGNUP DATA:", data);
  console.log("SIGNUP ERROR:", error);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Account created successfully" };
}, []);

 const logout = useCallback(async () => {
  await supabase.auth.signOut();
  setUser(null);
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
