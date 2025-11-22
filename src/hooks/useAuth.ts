'use client';

import { useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/app/services/authService';
import { User } from '@/types/auth';


export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.getProfile();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authService.removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      authService.removeToken();
      setUser(null);
      router.push('/');
      router.refresh();
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}