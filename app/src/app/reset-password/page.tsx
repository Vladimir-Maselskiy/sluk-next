import ResetPasswordPageClient from './ResetPasswordPageClient';

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function ResetPasswordPage({ searchParams }: PageProps) {
  const emailParam = searchParams?.email;
  const initialEmail = Array.isArray(emailParam)
    ? emailParam[0] ?? ''
    : emailParam ?? '';

  return <ResetPasswordPageClient initialEmail={initialEmail} />;
}
