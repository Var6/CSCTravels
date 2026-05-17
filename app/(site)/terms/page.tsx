import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — CSC Travels',
  description: 'Terms and conditions governing the use of CSC Travels services.',
}

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: [
      'By downloading, installing, or using the CSC Travels app or website you agree to be bound by these Terms of Service.',
      'If you do not agree, do not use our services.',
      'We reserve the right to modify these Terms at any time. Continued use after changes constitutes acceptance.',
    ],
  },
  {
    title: '2. Eligibility',
    content: [
      'You must be at least 18 years old to use our services.',
      'You must provide accurate and complete registration information.',
      'You are responsible for maintaining the confidentiality of your account credentials.',
      'One account per person — multiple accounts are not permitted.',
    ],
  },
  {
    title: '3. Ride Booking',
    content: [
      'Booking a ride creates a service agreement between you and the driver; CSC Travels acts as a technology facilitator.',
      'You must be present at the pickup location within 5 minutes of driver arrival.',
      'Providing false pickup/drop-off information may result in account suspension.',
      'Scheduled rides must be cancelled at least 30 minutes in advance to avoid a cancellation fee.',
    ],
  },
  {
    title: '4. Cancellation Policy',
    content: [
      'Users may cancel a ride before the driver arrives without charge.',
      'Cancellations made after driver arrival may attract a cancellation fee of ₹30.',
      'Repeated cancellations may lead to temporary or permanent account suspension.',
      'Drivers who cancel accepted rides without valid reason will be penalised on the platform.',
    ],
  },
  {
    title: '5. Fares and Payments',
    content: [
      'Fares are calculated based on distance, vehicle type, and applicable surge pricing.',
      'The fare estimate shown at booking is indicative; the final fare may vary due to route changes or waiting time.',
      'Cash payments are made directly to the driver; online payments are processed through our platform.',
      'Receipts are available in-app after trip completion.',
      'Disputes regarding fares must be raised within 24 hours of trip completion.',
    ],
  },
  {
    title: '6. User Conduct',
    content: [
      'You must treat drivers with respect and courtesy at all times.',
      'No smoking, consumption of alcohol, or use of illegal substances is permitted inside vehicles.',
      'You are liable for any damage caused to the vehicle during your trip.',
      'Harassment, abuse, or threats towards drivers will result in immediate account termination.',
      'You must comply with all applicable traffic and local laws during your ride.',
    ],
  },
  {
    title: '7. Driver Obligations',
    content: [
      'Drivers must maintain valid driving licence, vehicle registration, and insurance.',
      'Drivers must keep their vehicle clean and in roadworthy condition.',
      'Drivers must not use mobile phones while driving.',
      'Drivers must follow the route suggested by the app unless the rider requests a change.',
      'Drivers found to be fraudulent or abusive will be permanently banned from the platform.',
    ],
  },
  {
    title: '8. Limitation of Liability',
    content: [
      'CSC Travels is a technology platform connecting riders and drivers; we are not a transport company.',
      'We are not liable for delays, accidents, or incidents that occur during a trip.',
      'Our maximum liability to any user shall not exceed the fare paid for the disputed trip.',
      'We are not responsible for items left in vehicles; please contact us within 24 hours for lost property.',
    ],
  },
  {
    title: '9. Indemnification',
    content: [
      'You agree to indemnify and hold harmless CSC Travels, its employees, and partners from any claims, damages, or losses arising from your use of the platform.',
    ],
  },
  {
    title: '10. Governing Law',
    content: [
      'These Terms are governed by the laws of India.',
      'Any disputes shall be subject to the exclusive jurisdiction of the courts in Patna, Bihar.',
      'We encourage resolution of disputes through our in-app support channel before approaching courts.',
    ],
  },
  {
    title: '11. Contact',
    content: [
      'CSC Travels, Shanti Devi Nivas, Anishabad, Patna – 800002, Bihar, India',
      'Email: booking@csctravels.com',
      'Phone: +91 98731 01537',
    ],
  },
]

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-orange-600 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-2">Effective date: 1 January 2025</p>
        <p className="text-sm text-gray-500 mb-10">Last updated: 17 May 2026</p>

        <p className="text-gray-700 mb-10 leading-relaxed">
          Please read these Terms of Service carefully before using the CSC Travels mobile application or
          website. These Terms govern your access to and use of all CSC Travels services.
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
