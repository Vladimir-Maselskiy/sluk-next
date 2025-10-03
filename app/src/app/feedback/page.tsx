import FeedbackPageClient from './FeedbackPageClient';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FeedbackPage({ searchParams }: PageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const emailParam = resolvedParams.email;
  const initialEmail = Array.isArray(emailParam)
    ? emailParam[0] ?? ''
    : emailParam ?? '';

  return <FeedbackPageClient initialEmail={initialEmail} />;
}
