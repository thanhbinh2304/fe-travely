// components/client/login/ResetPasswordForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Eye, EyeOff, CheckCircle, Key } from 'lucide-react';

interface ResetPasswordFormProps {
  onSubmit: (password: string, passwordConfirmation: string) => Promise<void>;
  isLoading: boolean;
  error?: string;
  success: boolean;
  token: string;
  onTokenChange: (token: string) => void;
  onBackToLogin: () => void;
}

export default function ResetPasswordForm({
  onSubmit,
  isLoading,
  error,
  success,
  token,
  onTokenChange,
  onBackToLogin,
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (password !== passwordConfirmation) {
      setValidationError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    if (!token) {
      setValidationError('Reset token is required');
      return;
    }

    await onSubmit(password, passwordConfirmation);
  };

  if (success) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Password Reset Successful</h3>
            <p className="text-sm text-gray-600">
              Your password has been updated. You can now login with your new password.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(error || validationError) && (
        <Alert variant="destructive">
          <AlertDescription>{error || validationError}</AlertDescription>
        </Alert>
      )}

      {/* <div className="space-y-2">
        <Label htmlFor="reset-token">Reset Code</Label>
        <div className="relative">
          <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="reset-token"
            type="text"
            placeholder="Enter reset code from email"
            value={token}
            onChange={(e) => onTokenChange(e.target.value)}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
        <p className="text-xs text-gray-500">
          Enter the code you received in your email.
        </p>
      </div> */}

      <div className="space-y-2">
        <Label htmlFor="reset-password">New Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="reset-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10"
            required
            disabled={isLoading}
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500">At least 6 characters</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reset-password-confirmation">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="reset-password-confirmation"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm new password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="pl-10 pr-10"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !token}
      >
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </Button>

      <button
        type="button"
        onClick={onBackToLogin}
        disabled={isLoading}
        className="w-full text-sm text-blue-600 hover:underline disabled:opacity-50"
      >
        Back to Login
      </button>
    </form>
  );
}
