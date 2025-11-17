'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/shared/Form';
import { PrimaryButton } from '@/components/shared/Button';

interface EmailLoginFormProps {
  onSubmit: (email: string) => void;
}

export default function EmailLoginForm({ onSubmit }: EmailLoginFormProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="email"
        label="Email address"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="your@email.com"
        required
      />
      <PrimaryButton text="Continue with email" type="submit" />
    </form>
  );
}