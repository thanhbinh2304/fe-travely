'use client';

import { useState, useEffect } from 'react';
import {  User } from '@/app/services/api/authApi';
import authApi from '@/app/services/api/authApi';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = async () => {
      try {
        if (authApi.isAuthenticated()) {
          const userData = await authApi.getProfile();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authApi.removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}