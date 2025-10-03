'use client';

import { FormEvent, useEffect, useState } from 'react';

type ResetPasswordPageClientProps = {
  initialEmail?: string;
};

export default function ResetPasswordPageClient({
  initialEmail = '',
}: ResetPasswordPageClientProps) {
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setEmail(initialEmail);
  }, [initialEmail]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/password-reset/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Unable to reset the password.');
      } else {
        setMessage('Your password has been updated successfully.');
        setCode('');
        setPassword('');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main style={{ width: '100%', maxWidth: 480 }}>
      <h1>Reset Password</h1>
      <p style={{ margin: '16px 0' }}>
        Enter the code you received by email together with your new password.
      </p>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <label htmlFor="email">
          Email
          <input
            id="email"
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
            style={{
              marginTop: 4,
              width: '100%',
              padding: '10px 12px',
              fontSize: '16px',
              borderRadius: 4,
              border: '1px solid #ccc',
            }}
          />
        </label>
        <label htmlFor="code">
          Reset code
          <input
            id="code"
            type="text"
            value={code}
            onChange={event => setCode(event.target.value)}
            required
            style={{
              marginTop: 4,
              width: '100%',
              padding: '10px 12px',
              fontSize: '16px',
              borderRadius: 4,
              border: '1px solid #ccc',
            }}
          />
        </label>
        <label htmlFor="password">
          New password
          <input
            id="password"
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            required
            style={{
              marginTop: 4,
              width: '100%',
              padding: '10px 12px',
              fontSize: '16px',
              borderRadius: 4,
              border: '1px solid #ccc',
            }}
          />
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '12px 16px',
            fontSize: '16px',
            borderRadius: 4,
            border: 'none',
            backgroundColor: 'var(--accent-color)',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {isSubmitting ? 'Updating...' : 'Update Password'}
        </button>
      </form>
      {message && <p style={{ marginTop: 16, color: 'green' }}>{message}</p>}
      {error && <p style={{ marginTop: 16, color: 'red' }}>{error}</p>}
    </main>
  );
}
