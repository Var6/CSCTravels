import type { Metadata } from 'next'
import DeleteAccountForm from './DeleteAccountForm'

export const metadata: Metadata = {
  title: 'Delete Account — CSC Travels',
  description:
    'Request permanent deletion of your CSC Travels account and associated personal data.',
}

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-orange-600 mb-2">Delete your account</h1>
        <p className="text-sm text-gray-500 mb-2">App: CSC Travel (com.csctravels.app)</p>
        <p className="text-sm text-gray-500 mb-10">Developer: CSC Travels</p>

        <p className="text-gray-700 mb-6 leading-relaxed">
          You can request permanent deletion of your CSC Travels account at any time. There are two
          options below: an instant self-service deletion if you are signed in, or a request by
          email if you no longer have access to your account.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">What will be deleted</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 leading-relaxed">
            <li>Your name, phone number, email, and address</li>
            <li>Your saved profile and login credentials</li>
            <li>Your linkage to any past or upcoming trips</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">What is retained</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 leading-relaxed">
            <li>
              Historical trip records (pickup, drop-off, distance, fare, date) — these are kept
              anonymised (no name, no phone) for up to <strong>5 years</strong> to comply with
              Indian tax and accounting law applicable to transport service providers.
            </li>
            <li>
              Server access logs containing your IP address may be retained for up to{' '}
              <strong>30 days</strong> for security and abuse prevention.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Option 1 — Delete now (signed-in)</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Sign in with the account you want to delete, then confirm below. Deletion is
            immediate and cannot be undone.
          </p>
          <DeleteAccountForm />
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Option 2 — Request by email</h2>
          <p className="text-gray-700 leading-relaxed">
            If you no longer have access to your account, send an email to{' '}
            <a href="mailto:booking@csctravels.com" className="text-orange-600 underline">
              booking@csctravels.com
            </a>{' '}
            with the subject line <strong>&quot;Account deletion request&quot;</strong> from the
            email address linked to your account, including your registered phone number. We
            will process the request within <strong>7 business days</strong> and confirm by reply.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Questions</h2>
          <p className="text-gray-700 leading-relaxed">
            CSC Travels, Shanti Devi Nivas, Anishabad, Patna – 800002, Bihar, India
            <br />
            Email: booking@csctravels.com · Phone: +91 98731 01537
          </p>
        </section>

        <div className="mt-16 border-t pt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} CSC Travels. All rights reserved.
        </div>
      </div>
    </main>
  )
}
