// components/client/Login/LoginModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFacebookLogin } from '@/hooks/useFacebookLogin';
import { useGoogleLogin } from '@react-oauth/google';
import { Modal, ModalHeader } from '@/components/shared/Modal';
import SocialLoginButtons from './SocialLoginButton';
import LoginForm from './EmailLoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import ResetPasswordForm from './ResetPasswordForm';
import LoginTerms from './LoginTerms';
import authService from '@/app/services/authServiceProvider';
import { ApiError } from '@/types/auth';


interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: ViewMode;
  initialToken?: string;
}

type ViewMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

export default function LoginModal({ isOpen, onClose, initialMode, initialToken }: LoginModalProps) {
  const router = useRouter();
  const { login: facebookLogin } = useFacebookLogin();
  const [viewMode, setViewMode] = useState<ViewMode>(initialMode || 'login');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>();
  const [registerErrors, setRegisterErrors] = useState<Record<string, string[]>>();
  const [registerGeneralError, setRegisterGeneralError] = useState<string>();
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState<string>();
  const [resetToken, setResetToken] = useState(initialToken || '');
  const [resetPasswordError, setResetPasswordError] = useState<string>();
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);

  // Update viewMode and resetToken when props change
  useEffect(() => {
    if (initialMode && isOpen) {
      setViewMode(initialMode);
    }
    if (initialToken && isOpen) {
      setResetToken(initialToken);
    }
  }, [initialMode, initialToken, isOpen]);

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

      // Check if email verification is required
      if (apiError.requires_verification) {
        setLoginError(apiError.msg + ' You can request a new verification email from the registration form.');
      }
      // Xử lý validation errors từ Laravel
      else if (apiError.errors) {
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
    userName: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    try {
      setIsLoading(true);
      setRegisterErrors(undefined);
      setRegisterGeneralError(undefined);

      const response = await authService.register(data);

      // Check if email verification is required
      if (response.data?.requires_verification) {
        setRegisterGeneralError('✅ Registration successful! Please check your email to verify your account before logging in.');
        setShowResendVerification(true);
        // Show debug verification URL in console if available
        if (response.data.debug?.verification_url) {
          console.log('Verification URL:', response.data.debug.verification_url);
        }
      } else {
        onClose();
        router.refresh();
      }

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
    setForgotPasswordError(undefined);
    setForgotPasswordSuccess(false);
    setResetPasswordError(undefined);
    setResetPasswordSuccess(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setForgotPasswordError(undefined);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API || 'http://127.0.0.1:8000/api'}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setForgotPasswordSuccess(true);
        // If debug info available, auto-fill token (development only)
        if (data.debug?.token) {
          setResetToken(data.debug.token);
        }
      } else {
        setForgotPasswordError(data.message || 'Failed to send reset email');
      }
    } catch (error) {
      setForgotPasswordError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (password: string, passwordConfirmation: string) => {
    setIsLoading(true);
    setResetPasswordError(undefined);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API || 'http://127.0.0.1:8000/api'}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: resetToken,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetPasswordSuccess(true);
        setTimeout(() => {
          setViewMode('login');
          setResetPasswordSuccess(false);
          setResetToken('');
        }, 2000);
      } else {
        setResetPasswordError(data.message || data.errors?.password?.[0] || 'Failed to reset password');
      }
    } catch (error) {
      setResetPasswordError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async (email: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API || 'http://127.0.0.1:8000/api'}/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setRegisterGeneralError('✅ Verification email sent! Please check your inbox (and spam folder).');
        if (data.debug?.verification_url) {
          console.log('Verification URL:', data.debug.verification_url);
        }
      } else {
        setRegisterGeneralError(data.message || 'Failed to resend verification email');
      }
    } catch (error) {
      setRegisterGeneralError('Network error. Please try again.');
    }
  };

  const getModalTitle = () => {
    switch (viewMode) {
      case 'forgot-password':
        return 'Forgot Password';
      case 'reset-password':
        return 'Reset Password';
      case 'register':
        return 'Create your account';
      default:
        return 'Welcome back';
    }
  };

  const getModalDescription = () => {
    switch (viewMode) {
      case 'forgot-password':
        return 'Enter your email to receive a password reset link';
      case 'reset-password':
        return 'Enter your reset code and new password';
      case 'register':
        return 'Sign up to start planning your next adventure';
      default:
        return 'Log in to access your bookings and saved activities';
    }
  };

  // Render forgot password or reset password as single column
  if (viewMode === 'forgot-password' || viewMode === 'reset-password') {
    return (
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
        <ModalHeader
          title={getModalTitle()}
          description={getModalDescription()}
          onClose={onClose}
        />
        <div className="mt-6">
          {viewMode === 'forgot-password' ? (
            <ForgotPasswordForm
              onSubmit={handleForgotPassword}
              isLoading={isLoading}
              error={forgotPasswordError}
              success={forgotPasswordSuccess}
              email={forgotPasswordEmail}
              onEmailChange={setForgotPasswordEmail}
              onBackToLogin={() => setViewMode('login')}
              onProceedToReset={() => setViewMode('reset-password')}
            />
          ) : (
            <ResetPasswordForm
              onSubmit={handleResetPassword}
              isLoading={isLoading}
              error={resetPasswordError}
              success={resetPasswordSuccess}
              token={resetToken}
              onTokenChange={setResetToken}
              onBackToLogin={() => setViewMode('login')}
            />
          )}
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <ModalHeader
        title={getModalTitle()}
        description={getModalDescription()}
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
            <LoginForm
              onSubmit={handleLogin}
              isLoading={isLoading}
              error={loginError}
              onForgotPassword={() => setViewMode('forgot-password')}
            />
          ) : (
            <RegisterForm
              onSubmit={handleRegister}
              isLoading={isLoading}
              errors={registerErrors}
              generalError={registerGeneralError}
              showResendVerification={showResendVerification}
              onResendVerification={handleResendVerification}
            />
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