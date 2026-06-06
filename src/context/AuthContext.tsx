'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { api, ApiResponse } from '@/lib/api';
import {
  clearStoredAuth,
  getStoredAuth,
  setStoredAuth,
} from '@/lib/auth-storage';
import { User } from '@/lib/types';

interface AuthUserPayload {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<User>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: {
    name: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }) => Promise<User>;
  isAuthenticated: () => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapAuthUser = (data: AuthUserPayload): User => ({
  _id: data.id,
  name: data.name,
  email: data.email,
  role: data.role,
  isActive: true,
  createdAt: '',
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const persist = useCallback((newToken: string, newUser: User, remember = true) => {
    setStoredAuth(newToken, JSON.stringify(newUser), remember);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = useCallback(() => Boolean(token && user), [token, user]);

  useEffect(() => {
    const init = async () => {
      const { token: storedToken, userJson } = getStoredAuth();

      if (!storedToken || !userJson) {
        setLoading(false);
        return;
      }

      setToken(storedToken);
      setUser(JSON.parse(userJson) as User);

      try {
        const res = await api.get<AuthUserPayload>('/auth/me', storedToken);
        const mapped = mapAuthUser(res);
        setUser(mapped);

        const { isPersistent } = getStoredAuth();
        setStoredAuth(storedToken, JSON.stringify(mapped), isPersistent);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [logout]);

  const login = async (email: string, password: string, remember = true) => {
    const res = await api.post<ApiResponse<AuthUserPayload>>('/auth/login', { email, password });
    if (!res.token) throw new Error('No token received');
    const mapped = mapAuthUser(res.data);
    persist(res.token, mapped, remember);
    return mapped;
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    await api.post<ApiResponse<AuthUserPayload>>('/auth/register', data);
  };

  const updateProfile = async (data: {
    name: string;
    email: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }) => {
    if (!token) throw new Error('Not authenticated');
    const payload = { ...data };
    if (!payload.newPassword) {
      delete payload.currentPassword;
      delete payload.newPassword;
      delete payload.confirmPassword;
    }
    const res = await api.put<AuthUserPayload>('/auth/me', payload, token);
    const mapped = mapAuthUser(res);
    const { isPersistent } = getStoredAuth();
    setStoredAuth(token, JSON.stringify(mapped), isPersistent);
    setUser(mapped);
    return mapped;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
