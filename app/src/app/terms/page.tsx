export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>

      <p className="mb-4">
        By using this Chrome Extension, you agree to the following terms and
        conditions:
      </p>

      <ul className="list-disc list-inside space-y-2 mb-6">
        <li>
          You will not use this extension for any unlawful, harmful, or abusive
          activity.
        </li>
        <li>
          We are not responsible for any data loss, damage, or misuse caused by
          this extension.
        </li>
        <li>
          This extension uses Google OAuth solely to access your basic profile
          information (such as name and email).
        </li>
        <li>
          Your personal data is not shared with third parties, and it is handled
          according to our{' '}
          <a href="/privacy-policy" className="text-blue-600 underline">
            Privacy Policy
          </a>
          .
        </li>
        <li>
          These terms may be updated at any time. Continued use of the extension
          implies acceptance of any changes.
        </li>
      </ul>

      <p className="text-sm text-gray-600">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </main>
  );
}
