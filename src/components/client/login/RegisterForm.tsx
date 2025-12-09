'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/shared/Form';
import { PrimaryButton } from '@/components/shared/Button';

interface RegisterFormProps {
  onSubmit: (data: {
    userName: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  isLoading: boolean;
  errors?: Record<string, string[]>;
  generalError?: string;
}

export default function RegisterForm({ onSubmit, isLoading, errors, generalError }: RegisterFormProps) {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({
      userName,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
  };

  const getFieldError = (field: string) => {
    return errors?.[field]?.[0];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {generalError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {generalError}
        </div>
      )}

      <div>
        <Input
          id="userName"
          label="Username"
          type="text"
          value={userName}
          onChange={setUserName}
          placeholder="Choose a username"
          required
        />
        {getFieldError('userName') && (
          <p className="text-red-600 text-xs mt-1">{getFieldError('userName')}</p>
        )}
      </div>

      <div>
        <Input
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="your@email.com"
          required
        />
        {getFieldError('email') && (
          <p className="text-red-600 text-xs mt-1">{getFieldError('email')}</p>
        )}
      </div>

      <div>
        <Input
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="At least 6 characters"
          required
        />
        {getFieldError('password') && (
          <p className="text-red-600 text-xs mt-1">{getFieldError('password')}</p>
        )}
      </div>

      <div>
        <Input
          id="password_confirmation"
          label="Confirm Password"
          type="password"
          value={passwordConfirmation}
          onChange={setPasswordConfirmation}
          placeholder="Re-enter password"
          required
        />
      </div>

      <PrimaryButton
        text={isLoading ? "Creating account..." : "Create Account"}
        type="submit"
        disabled={isLoading}
      />
    </form>
  );
}