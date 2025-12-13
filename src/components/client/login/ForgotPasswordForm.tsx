// components/client/login/ForgotPasswordForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

interface ForgotPasswordFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  error?: string;
  success: boolean;
  email: string;
  onEmailChange: (email: string) => void;
  onBackToLogin: () => void;
  onProceedToReset: () => void;
}

export default function ForgotPasswordForm({
  onSubmit,
  isLoading,
  error,
  success,
  email,
  onEmailChange,
  onBackToLogin,
  onProceedToReset,
}: ForgotPasswordFormProps) {
  if (success) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Your Email</h3>
            <p className="text-sm text-gray-600">
              If an account exists with <strong>{email}</strong>, we've sent a password reset link.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              The link will expire in 1 hour. Check your spam folder if you don't see it.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={onBackToLogin}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </div>
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500">
            Already have a reset code?{' '}
            <button
              type="button"
              onClick={onProceedToReset}
              className="text-blue-600 hover:underline font-medium"
            >
              Enter it here
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="forgot-email">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="forgot-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>
        <p className="text-xs text-gray-500">
          Enter the email address associated with your account.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </Button>

      <button
        type="button"
        onClick={onBackToLogin}
        disabled={isLoading}
        className="w-full text-sm text-blue-600 hover:underline disabled:opacity-50"
      >
        <ArrowLeft className="inline mr-1 h-3 w-3" />
        Back to Login
      </button>
    </form>
  );
}
