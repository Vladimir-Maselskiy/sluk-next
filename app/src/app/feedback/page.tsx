import FeedbackPageClient from './FeedbackPageClient';

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function FeedbackPage({ searchParams }: PageProps) {
  const emailParam = searchParams?.email;
  const initialEmail = Array.isArray(emailParam)
    ? emailParam[0] ?? ''
    : emailParam ?? '';

  return <FeedbackPageClient initialEmail={initialEmail} />;
}
