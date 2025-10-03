'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/password-reset/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      console.log('data', data);

      if (!response.ok || !data.success) {
        setError(data.error || 'Unable to process the request.');
      } else {
        setMessage(
          data.message || 'If the account exists, a reset code has been sent.'
        );
        // setEmail('');
        console.log('data.redirect', data.redirect);
        if (data.redirect) {
          setTimeout(() => {
            router.push(`/reset-password?email=${encodeURIComponent(email)}`);
          }, 500);
        }
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main style={{ width: '100%', maxWidth: 480 }}>
      <h1>Forgot Password</h1>
      <p style={{ margin: '16px 0' }}>
        Enter the email associated with your account and we will send you a code
        to reset your password.
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
          {isSubmitting ? 'Sending...' : 'Send Reset Code'}
        </button>
      </form>
      {message && <p style={{ marginTop: 16, color: 'green' }}>{message}</p>}
      {error && <p style={{ marginTop: 16, color: 'red' }}>{error}</p>}
    </main>
  );
}
