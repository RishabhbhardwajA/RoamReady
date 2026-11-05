'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginDemoCustomer: () => Promise<void>;
  loginDemoAdmin: () => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('roamready_token');
    const storedUser = localStorage.getItem('roamready_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data.success) {
        const { user: userData, token: userToken } = res.data.data;
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('roamready_token', userToken);
        localStorage.setItem('roamready_user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const loginDemoCustomer = async () => {
    await login('traveler@roamready.com', 'TravelGear2026!');
  };

  const loginDemoAdmin = async () => {
    await login('admin@roamready.com', 'TravelGear2026!');
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      const res = await apiClient.post('/auth/register', { name, email, password, phone });
      if (res.data.success) {
        const { user: userData, token: userToken } = res.data.data;
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('roamready_token', userToken);
        localStorage.setItem('roamready_user', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Registration failed.');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('roamready_token');
    localStorage.removeItem('roamready_user');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('roamready_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        loginDemoCustomer,
        loginDemoAdmin,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
