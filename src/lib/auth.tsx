'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User } from './types';
import { users } from './data';
import { LoadingSpinner } from '@/components/loading-spinner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, role: 'educator' | 'student') => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Simulate checking for a logged-in user in session storage
    try {
        const storedUser = sessionStorage.getItem('trailblazer-user');
        if (storedUser) {
            const parsedUser: User = JSON.parse(storedUser);
            setUser(parsedUser);
        }
    } catch (e) {
        console.error("Could not parse user from sessionStorage", e);
        sessionStorage.removeItem('trailblazer-user');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && !user && pathname !== '/') {
        router.push('/');
    }
    if (!loading && user && pathname === '/') {
        router.push(`/${user.role}/dashboard`);
    }
  }, [user, loading, pathname, router]);

  const login = (email: string, role: 'educator' | 'student'): boolean => {
    const foundUser = users.find(u => u.email === email && u.role === role);
    if (foundUser) {
      setUser(foundUser);
      sessionStorage.setItem('trailblazer-user', JSON.stringify(foundUser));
      router.push(`/${foundUser.role}/dashboard`);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('trailblazer-user');
    router.push('/');
  };

  const value = { user, isAuthenticated: !!user, loading, login, logout };

  if (loading) {
     return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
