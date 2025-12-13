'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/shared/Form';
import { PrimaryButton } from '@/components/shared/Button';

interface LoginFormProps {
  onSubmit: (login: string, password: string) => Promise<void>;
  isLoading: boolean;
  error?: string;
  onForgotPassword?: () => void;
}

export default function LoginForm({ onSubmit, isLoading, error, onForgotPassword }: LoginFormProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(login, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Input
        id="login"
        label="Username or Email"
        type="text"
        value={login}
        onChange={setLogin}
        placeholder="Enter username or email"
        required
      />

      <Input
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="Enter password"
        required
      />
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span className="text-gray-600">Remember me</span>
        </label>
        {onForgotPassword ? (
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-blue-600 hover:text-blue-700 hover:underline"
          >
            Forgot password?
          </button>
        ) : (
          <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
            Forgot password?
          </a>
        )}
      </div>
      <PrimaryButton
        text={isLoading ? "Logging in..." : "Login"}
        type="submit"
        disabled={isLoading}
      />
    </form>
  );
}