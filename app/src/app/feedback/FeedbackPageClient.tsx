'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const initialFormState = {
  email: '',
  message: '',
};

export default function FeedbackPageClient() {
  const searchParams = useSearchParams();
  const [formState, setFormState] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const emailFromQuery = searchParams.get('email');
    if (emailFromQuery) {
      setFormState(prev => ({ ...prev, email: emailFromQuery }));
    }
  }, [searchParams]);

  const handleChange = (field: 'email' | 'message') =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormState(prev => ({ ...prev, [field]: value }));
    };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formState.message.trim()) {
      setError('Please enter a message.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formState.email.trim() || null,
          message: formState.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Unable to send feedback right now.');
        return;
      }

      setSuccess('Thanks! Your feedback has been sent.');
      setFormState(prev => ({ email: prev.email, message: '' }));
    } catch (err) {
      console.error('Feedback submit error:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main style={{ width: '100%', maxWidth: 560 }}>
      <h1 style={{ marginBottom: 16 }}>We value your feedback</h1>
      <p style={{ marginBottom: 24 }}>
        Share your thoughts or issues so we can improve Sluk. If you leave an email, we will get back to you there.
      </p>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 16 }}>
        <label htmlFor="email">
          Email (optional)
          <input
            id="email"
            type="email"
            value={formState.email}
            onChange={handleChange('email')}
            placeholder="you@example.com"
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
        <label htmlFor="message">
          Message
          <textarea
            id="message"
            value={formState.message}
            onChange={handleChange('message')}
            placeholder="Tell us what we can improve..."
            required
            rows={6}
            style={{
              marginTop: 4,
              width: '100%',
              padding: '10px 12px',
              fontSize: '16px',
              borderRadius: 4,
              border: '1px solid #ccc',
              resize: 'vertical',
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
          {isSubmitting ? 'Sending...' : 'Send Feedback'}
        </button>
      </form>
      {success && (
        <p style={{ marginTop: 16, color: 'green' }}>{success}</p>
      )}
      {error && (
        <p style={{ marginTop: 16, color: 'red' }}>{error}</p>
      )}
    </main>
  );
}
