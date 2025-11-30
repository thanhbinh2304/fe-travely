// components/client/Login/LoginModal.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFacebookLogin } from '@/hooks/useFacebookLogin';
import { useGoogleLogin } from '@react-oauth/google';
import { Modal, ModalHeader } from '@/components/shared/Modal';
import SocialLoginButtons from './SocialLoginButton';
import LoginForm from './EmailLoginForm';
import RegisterForm from './RegisterForm';
import LoginTerms from './LoginTerms';
import authService from '@/app/services/authServiceProvider';
import { ApiError } from '@/types/auth';


interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewMode = 'login' | 'register';

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const { login: facebookLogin } = useFacebookLogin();
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>();
  const [registerErrors, setRegisterErrors] = useState<Record<string, string[]>>();
  const [registerGeneralError, setRegisterGeneralError] = useState<string>();


  const handleFacebookLogin = () => {
    setIsLoading(true);
    setLoginError(undefined);

    facebookLogin(
      async (userData, accessToken) => {
        try {
          // Send to Laravel backend
          await authService.loginWithFacebook({
            facebook_id: userData.id,
            email: userData.email,
            name: userData.name,
          });

          // Success
          onClose();
          router.refresh();
        } catch (error) {
          console.error('Facebook login error:', error);
          const apiError = error as ApiError;
          setLoginError(apiError.msg || 'Facebook login failed');
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        // Don't show error if user just cancelled the login
        if (error.message !== 'Facebook login cancelled') {
          console.error('Facebook OAuth error:', error);
          setLoginError('Failed to connect with Facebook');
        }
        setIsLoading(false);
      }
    );
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        setLoginError(undefined);

        // 1. Get user info from Google
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        if (!userInfoResponse.ok) {
          throw new Error('Failed to get user info from Google');
        }

        const userInfo = await userInfoResponse.json();

        // 2. Send to Laravel backend
        await authService.loginWithGoogle({
          google_id: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
        });

        // 3. Success - close modal and refresh
        onClose();
        router.refresh();

      } catch (error) {
        console.error('Google login error:', error);
        const apiError = error as ApiError;
        setLoginError(apiError.msg || 'Google login failed');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      setLoginError('Failed to connect with Google');
      setIsLoading(false);
    },
  });

  const handleGoogleLogin = () => {
    googleLogin();
  };




  const handleLogin = async (login: string, password: string) => {
    try {
      setIsLoading(true);
      setLoginError(undefined);

      console.log('Attempting login with:', { login, password: '***' });
      const response = await authService.login({ login, password });
      console.log('Login successful:', response);

      onClose();

      // Redirect admin to dashboard, regular users stay on current page
      if (response.data.user.role_id === 1) {
        router.push('/dashboard');
      } else {
        router.refresh();
      }

    } catch (error) {
      console.error('Login error details:', error);
      const apiError = error as ApiError;

      // Xử lý validation errors từ Laravel
      if (apiError.errors) {
        const errorMessages = Object.values(apiError.errors).flat();
        setLoginError(errorMessages.join(', '));
      } else {
        setLoginError(apiError.msg || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    try {
      setIsLoading(true);
      setRegisterErrors(undefined);
      setRegisterGeneralError(undefined);

      await authService.register(data);

      onClose();
      router.refresh();

    } catch (error) {
      const apiError = error as ApiError;

      if (apiError.errors) {
        setRegisterErrors(apiError.errors);
      } else {
        setRegisterGeneralError(apiError.msg || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setViewMode(viewMode === 'login' ? 'register' : 'login');
    setLoginError(undefined);
    setRegisterErrors(undefined);
    setRegisterGeneralError(undefined);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <ModalHeader
        title={viewMode === 'login' ? 'Welcome back' : 'Create your account'}
        description={
          viewMode === 'login'
            ? 'Log in to access your bookings and saved activities'
            : 'Sign up to start planning your next adventure'
        }
        onClose={onClose}
      />

      <div className="grid md:grid-cols-2 gap-8 mt-6">
        {/* Left Column - OAuth */}
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Continue with</h3>
            <p className="text-sm text-gray-600">Quick and secure login using your social accounts</p>
          </div>

          <SocialLoginButtons
            onGoogleLogin={handleGoogleLogin}
            onFacebookLogin={handleFacebookLogin}
          />

          {/* Info box */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Why use social login?</p>
                <ul className="space-y-1 text-xs">
                  <li>• Faster checkout process</li>
                  <li>• No need to remember passwords</li>
                  <li>• Secure authentication</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block absolute left-1/2 top-24 bottom-8 w-px bg-gray-200" />

        {/* Right Column - Credentials */}
        <div className="flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {viewMode === 'login' ? 'Or log in with email' : 'Or sign up with email'}
            </h3>
            <p className="text-sm text-gray-600">
              {viewMode === 'login'
                ? 'Enter your credentials to access your account'
                : 'Create a new account with your email address'
              }
            </p>
          </div>

          {viewMode === 'login' ? (
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={loginError} />
          ) : (
            <RegisterForm onSubmit={handleRegister} isLoading={isLoading} errors={registerErrors} generalError={registerGeneralError} />
          )}

          {/* Switch mode button */}
          <div className="mt-6 text-center">
            <button
              onClick={switchMode}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {viewMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
            </button>
          </div>

          <LoginTerms />
        </div>
      </div>
    </Modal>
  );
}