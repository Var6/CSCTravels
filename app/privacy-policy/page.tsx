import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — CSC Travels',
  description: 'How CSC Travels collects, uses, and protects your personal data.',
}

const sections = [
  {
    title: '1. Information We Collect',
    content: [
      'Personal information: name, email address, phone number, and profile photo.',
      'Location data: real-time GPS coordinates when using the app for ride booking and tracking.',
      'Trip data: pickup/drop-off addresses, trip history, and payment information.',
      'Device information: device type, operating system, and app version for technical support.',
      'Communication data: messages exchanged between riders and drivers through our platform.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    content: [
      'To provide and improve our ride-booking services.',
      'To match you with available drivers in your area.',
      'To process payments and generate invoices.',
      'To send ride confirmations, OTP codes, and trip updates via SMS or push notification.',
      'To resolve disputes, enforce our Terms of Service, and ensure platform safety.',
      'To personalise your experience and show relevant offers.',
      'To comply with legal obligations under applicable Indian law.',
    ],
  },
  {
    title: '3. Location Data',
    content: [
      'We collect precise location data only when the app is in use.',
      'Driver location is shared with the assigned passenger during an active trip.',
      'We use OpenStreetMap services for map display and routing. No location data is sent to third-party advertising networks.',
      'You may disable location access in your device settings, but this will prevent you from using ride-booking features.',
    ],
  },
  {
    title: '4. Data Sharing',
    content: [
      'We do not sell your personal data to third parties.',
      'Driver name, phone number, and vehicle details are shared with the matched passenger for the duration of the trip.',
      'Passenger name and phone number are shared with the assigned driver.',
      'We may share anonymised, aggregate data for analytics and business reporting.',
      'We may disclose data to law-enforcement agencies if required by a valid court order or applicable law.',
    ],
  },
  {
    title: '5. Data Retention',
    content: [
      'Account data is retained for as long as your account is active.',
      'Trip history is retained for 3 years for dispute resolution and regulatory compliance.',
      'You may request deletion of your account and associated data by contacting us. Retention obligations under law may prevent full deletion.',
    ],
  },
  {
    title: '6. Data Security',
    content: [
      'Passwords are stored using industry-standard bcrypt hashing and are never stored in plain text.',
      'All API communication is conducted over HTTPS/TLS encryption.',
      'Access to production databases is restricted to authorised personnel only.',
      'We regularly review our security practices and update them as required.',
    ],
  },
  {
    title: '7. Your Rights',
    content: [
      'Access: You may request a copy of the personal data we hold about you.',
      'Correction: You may update inaccurate or incomplete information via the app or by contacting us.',
      'Deletion: You may request deletion of your account subject to legal retention requirements.',
      'Portability: You may request your data in a machine-readable format.',
      'To exercise these rights, contact us at booking@csctravels.com.',
    ],
  },
  {
    title: '8. Cookies & Analytics',
    content: [
      'Our website uses essential cookies for session management only.',
      'We do not use third-party advertising cookies.',
      'The mobile app does not use cookies; authentication is handled via JWT tokens.',
    ],
  },
  {
    title: '9. Children\'s Privacy',
    content: [
      'Our services are not directed to children under 18 years of age.',
      'We do not knowingly collect personal data from minors.',
      'If you believe a minor has provided us with personal data, please contact us immediately.',
    ],
  },
  {
    title: '10. Changes to This Policy',
    content: [
      'We may update this Privacy Policy from time to time.',
      'Significant changes will be communicated via in-app notification or email.',
      'Continued use of the app after changes constitutes acceptance of the updated policy.',
    ],
  },
  {
    title: '11. Contact Us',
    content: [
      'CSC Travels, Shanti Devi Nivas, Anishabad, Patna – 800002, Bihar, India',
      'Email: booking@csctravels.com',
      'Phone: +91 98731 01537',
      'For privacy-related queries, please use the subject line "Privacy Request".',
    ],
  },
]

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-orange-600 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-2">Effective date: 1 January 2025</p>
        <p className="text-sm text-gray-500 mb-10">Last updated: 17 May 2026</p>

        <p className="text-gray-700 mb-10 leading-relaxed">
          CSC Travels (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This
          Privacy Policy explains how we collect, use, and safeguard your personal information when
          you use our ride-booking application and website. By using our services you agree to the
          practices described below.
        </p>

        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">{section.title}</h2>
              <ul className="list-disc list-inside space-y-2">
                {section.content.map((line, i) => (
                  <li key={i} className="text-gray-600 leading-relaxed">
                    {line}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-16 border-t pt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} CSC Travels. All rights reserved.
        </div>
      </div>
    </main>
  )
}
