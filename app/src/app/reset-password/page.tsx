import ResetPasswordPageClient from './ResetPasswordPageClient';

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const emailParam = resolvedParams.email;
  const initialEmail = Array.isArray(emailParam)
    ? emailParam[0] ?? ''
    : emailParam ?? '';

  return <ResetPasswordPageClient initialEmail={initialEmail} />;
}
