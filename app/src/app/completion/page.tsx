'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function CompletionPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('Processing payment...');

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent');
    const redirectStatus = searchParams.get('redirect_status');

    if (!paymentIntent || !redirectStatus) {
      setMessage('Missing payment information.');
      return;
    }

    setStatus(redirectStatus);

    switch (redirectStatus) {
      case 'succeeded':
        setMessage('✅ Thank you! Your payment was successful!🎉');
        break;
      case 'failed':
        setMessage('❌ Payment failed. Please try again.');
        break;
      case 'canceled':
        setMessage('⚠️ Payment was canceled.');
        break;
      case 'requires_payment_method':
        setMessage(
          '❌ Payment method failed. Please update your card and try again.'
        );
        break;
      default:
        setMessage(`Unknown status: ${redirectStatus}`);
    }
  }, [searchParams]);

  return (
    <div
      style={{
        padding: '20px',
        width: '100%',
        textAlign: 'center',
        fontSize: '24px',
        color: 'var(--accent-color)',
      }}
    >
      <h1>Payment Result</h1>
      <p>{message}</p>
      {status && (
        <p>
          <strong>Status:</strong> {status}
        </p>
      )}
    </div>
  );
}
