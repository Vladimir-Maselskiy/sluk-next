import dynamic from 'next/dynamic';

const ResetPasswordPageClient = dynamic(
  () => import('./ResetPasswordPageClient'),
  { ssr: false, loading: () => <div>Loading reset form...</div> }
);

export default function ResetPasswordPage() {
  return <ResetPasswordPageClient />;
}
